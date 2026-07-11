import { createContext, useContext, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com";

type AnonymousLoginResponse = {
  access_token: string;
  refresh_token: string;
};

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  updateAnonymousUser: (email: string, password: string) => Promise<boolean>;
  anonymousLogin: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  currentUser: SupabaseUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  const applySessionState = (hasSession: boolean) => {
    setIsLoggedIn(hasSession);
  };

  const anonymousLogin = async (): Promise<boolean> => {
    if (!supabase) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/anonymous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("[auth] anonymous login failed", await response.text());
        return false;
      }

      const authResponse = (await response.json()) as AnonymousLoginResponse;
      const { data, error } = await supabase.auth.setSession({
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token,
      });

      if (error) {
        console.warn("[auth] unable to apply anonymous session", error.message);
        return false;
      }

      const hasSession = Boolean(data.session);
      applySessionState(hasSession);
      setCurrentUser(data.session?.user ?? null);
      return hasSession;
    } catch (error) {
      console.warn("[auth] anonymous login request failed", error);
      return false;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn(
        "[auth] Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY.",
      );
      setIsLoading(false);
      return;
    }

    const supabaseClient = supabase;
    let appStateSubscription: { remove: () => void } | null = null;

    if (Platform.OS !== "web") {
      const handleAppStateChange = (state: AppStateStatus) => {
        if (state === "active") {
          void supabaseClient.auth.startAutoRefresh();
        } else {
          void supabaseClient.auth.stopAutoRefresh();
        }
      };

      appStateSubscription = AppState.addEventListener(
        "change",
        handleAppStateChange,
      );
      handleAppStateChange(AppState.currentState);
    }

    let isMounted = true;

    const restoreSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.warn("[auth] unable to restore session", error.message);
      }

      if (!isMounted) {
        return;
      }

      applySessionState(Boolean(data.session));
      setCurrentUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      applySessionState(Boolean(session));
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      appStateSubscription?.remove();
      if (Platform.OS !== "web") {
        void supabaseClient.auth.stopAutoRefresh();
      }
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.warn("[auth] login failed", error.message);
      return false;
    }

    const hasSession = Boolean(data.session);
    applySessionState(hasSession);
    setCurrentUser(data.session?.user ?? null);
    return hasSession;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });

    if (error) {
      console.warn("[auth] register failed", error.message);
      return false;
    }

    // If email confirmation is disabled, a session may already exist.
    applySessionState(Boolean(data.session));
    setCurrentUser(data.session?.user ?? null);
    return true;
  };

  const logout = async () => {
    if (!supabase) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("[auth] logout failed", error.message);
    }

    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const updateAnonymousUser = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase.auth.updateUser({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.warn("[auth] update anonymous user failed", error.message);
      return false;
    }

    setCurrentUser(data.user ?? null);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        updateAnonymousUser,
        anonymousLogin,
        login,
        register,
        logout,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
