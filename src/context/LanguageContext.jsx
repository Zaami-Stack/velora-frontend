import { createContext, useContext, useState, useCallback } from "react";
import en from "../i18n/en.json";
import fr from "../i18n/fr.json";

const translations = { en, fr };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem("velora_lang") || "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("velora_lang", newLang);
    } catch { /* ignore */ }
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      const keys = key.split(".");
      let value = translations[lang];
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k];
        } else {
          return key;
        }
      }
      if (typeof value !== "string") return key;
      return value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        params[name] !== undefined ? params[name] : `{{${name}}}`
      );
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
