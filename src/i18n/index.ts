import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

import { useLangStore } from "@/stores/useLangStore";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

const interpolation = {
  escapeValue: false,
};

const initialLang = useLangStore.getState().lang;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "en",
  debug: false,
  interpolation,
});

useLangStore.subscribe((state) => {
  if (i18n.language !== state.lang) {
    i18n.changeLanguage(state.lang);
  }
});

export default i18n;
