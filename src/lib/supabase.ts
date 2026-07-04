import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const nativeFallbackStore = new Map<string, string>();

const hasWebLocalStorage = (): boolean => {
  return typeof globalThis !== "undefined" && "localStorage" in globalThis;
};

const getNativeAsyncStorage = (): AsyncStorageLike | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@react-native-async-storage/async-storage");
    const storageCandidate = mod?.default;
    if (
      storageCandidate &&
      typeof storageCandidate.getItem === "function" &&
      typeof storageCandidate.setItem === "function" &&
      typeof storageCandidate.removeItem === "function"
    ) {
      return storageCandidate as AsyncStorageLike;
    }
    return null;
  } catch {
    return null;
  }
};

const storageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      if (hasWebLocalStorage()) {
        return globalThis.localStorage.getItem(key);
      }
      return nativeFallbackStore.get(key) ?? null;
    }
    const asyncStorage = getNativeAsyncStorage();
    if (!asyncStorage) {
      return nativeFallbackStore.get(key) ?? null;
    }

    try {
      return await asyncStorage.getItem(key);
    } catch {
      return nativeFallbackStore.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (hasWebLocalStorage()) {
        globalThis.localStorage.setItem(key, value);
      } else {
        nativeFallbackStore.set(key, value);
      }
      return;
    }

    const asyncStorage = getNativeAsyncStorage();
    if (!asyncStorage) {
      nativeFallbackStore.set(key, value);
      return;
    }

    try {
      await asyncStorage.setItem(key, value);
    } catch {
      nativeFallbackStore.set(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (hasWebLocalStorage()) {
        globalThis.localStorage.removeItem(key);
      } else {
        nativeFallbackStore.delete(key);
      }
      return;
    }

    const asyncStorage = getNativeAsyncStorage();
    if (!asyncStorage) {
      nativeFallbackStore.delete(key);
      return;
    }

    try {
      await asyncStorage.removeItem(key);
    } catch {
      nativeFallbackStore.delete(key);
    }
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
        storage: storageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === "web",
      },
    })
  : null;
