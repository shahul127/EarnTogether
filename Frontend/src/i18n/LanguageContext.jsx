import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("skillConnectLanguage") || "en";
  });

  useEffect(() => {
    localStorage.setItem("skillConnectLanguage", language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language] || translations.en,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}
