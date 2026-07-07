import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemePreference = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

const THEME_STORAGE_KEY = "app_theme_v1";

type ThemeContextValue = {
  themePreference: ThemePreference;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemePreference(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const colorScheme: ColorScheme =
    themePreference === "system" ? systemColorScheme : themePreference;

  const setTheme = async (theme: ThemePreference) => {
    setThemePreference(theme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Keep in-memory preference even if persistence fails.
    }
  };

  const toggleTheme = async () => {
    const next: ThemePreference = colorScheme === "dark" ? "light" : "dark";
    await setTheme(next);
  };

  const value = useMemo(
    () => ({ themePreference, colorScheme, setTheme, toggleTheme, isReady }),
    [themePreference, colorScheme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeContextProvider");
  return ctx;
}
