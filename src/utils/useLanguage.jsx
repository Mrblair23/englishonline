import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "es" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  // Save language to localStorage when it changes
  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const setLang = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage: setLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Translation helper
export function t(translations, lang) {
  return translations[lang] || translations.en;
}
