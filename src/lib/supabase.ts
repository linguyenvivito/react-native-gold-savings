import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type SupabaseStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

const memoryStorage = new Map<string, string>();

const storage: SupabaseStorage = {
  getItem: (key) => {
    if (Platform.OS !== "web") {
      return AsyncStorage.getItem(key);
    }

    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }

    return memoryStorage.get(key) ?? null;
  },
  setItem: (key, value) => {
    if (Platform.OS !== "web") {
      return AsyncStorage.setItem(key, value);
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }

    memoryStorage.set(key, value);
  },
  removeItem: (key) => {
    if (Platform.OS !== "web") {
      return AsyncStorage.removeItem(key);
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }

    memoryStorage.delete(key);
  },
};

const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const rawSupabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY?.trim() ?? "";

const normalizeUrl = (url: string): string => url.replace(/\/+$/, "");

const supabaseUrl = rawSupabaseUrl ? normalizeUrl(rawSupabaseUrl) : "";
const supabaseKey = rawSupabaseKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === "web",
      },
    })
  : null;
