import { create } from "zustand";
import { persist } from "zustand/middleware";


export type Language = "zh" | "en";


export const LANG_MAP: Record<Language, string> = {
  en: "English",
} as const;


interface LangState {
  lang: Language;
  setLang: (lang: Language) => void;
}


export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en", 
      setLang: (lang: Language) => set({ lang }),
    }),
    {
      name: "lang-storage", 
      getStorage: () => localStorage, 
    },
  ),
);
