import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applySessionState = (hasSession: boolean) => {
    setIsLoggedIn(hasSession);
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
      setIsLoading(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      applySessionState(Boolean(session));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
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
    return true;
  };

  const logout = async () => {
    if (!supabase) {
      setIsLoggedIn(false);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("[auth] logout failed", error.message);
    }

    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
