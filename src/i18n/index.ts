import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import en from "./translations/en.json";
import vi from "./translations/vi.json";

const SUPPORTED_LOCALES = ["en", "vi"];
const LOCALE_STORAGE_KEY = "app_locale_v1";

const i18n = new I18n({ en, vi });

const normalizeLocale = (locale: string | null | undefined): "en" | "vi" => {
	const normalized = locale?.toLowerCase().startsWith("en") ? "en" : "vi";
	return normalized;
};

const deviceLocale = normalizeLocale(getLocales()[0].languageCode);
i18n.locale = SUPPORTED_LOCALES.includes(deviceLocale) ? deviceLocale : "vi";
i18n.enableFallback = true;
i18n.defaultLocale = "vi";

export const initializeLocale = async (): Promise<void> => {
	try {
		const storedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
		if (storedLocale) {
			i18n.locale = normalizeLocale(storedLocale);
			return;
		}
	} catch {
		// Fall through to device locale when storage is unavailable.
	}

	i18n.locale = deviceLocale;
};

export const setAppLocale = async (locale: string): Promise<void> => {
	const nextLocale = normalizeLocale(locale);
	i18n.locale = nextLocale;
	try {
		await AsyncStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
	} catch {
		// Keep in-memory locale even if persistence fails.
	}
};

export default i18n;
