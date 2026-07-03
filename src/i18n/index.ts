import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import en from "./translations/en.json";
import vi from "./translations/vi.json";

const SUPPORTED_LOCALES = ["en", "vi"];

const i18n = new I18n({ en, vi });

const deviceLocale = getLocales()[0].languageCode ?? "vi";
i18n.locale = SUPPORTED_LOCALES.includes(deviceLocale) ? deviceLocale : "vi";
i18n.enableFallback = true;
i18n.defaultLocale = "vi";

export default i18n;
