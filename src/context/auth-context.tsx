import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const AUTH_KEY = "auth_logged_in";

// Platform-safe storage: localStorage on web, in-memory map on native
const nativeStore = new Map<string, string>();
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return nativeStore.get(key) ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") localStorage.setItem(key, value);
    else nativeStore.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") localStorage.removeItem(key);
    else nativeStore.delete(key);
  },
};

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STATIC_USERNAME = "admin";
const STATIC_PASSWORD = "123456";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from storage on mount
  useEffect(() => {
    storage
      .getItem(AUTH_KEY)
      .then((value) => setIsLoggedIn(value === "true"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      await storage.setItem(AUTH_KEY, "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await storage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
