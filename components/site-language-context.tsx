"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Supported languages
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "bh", label: "Bhojpuri" },
  { code: "ma", label: "Maithili" },
  { code: "nb", label: "Nepal Bhasa" },
  { code: "ta", label: "Tamang" },
  { code: "th", label: "Tharu" },
];

// Language codes to full names mapping
export const LANGUAGE_NAMES = {
  en: "english",
  ne: "nepali",
  bh: "bhojpuri",
  ma: "maithili",
  nb: "nepal_bhasa",
  ta: "tamang",
  th: "tharu",
};

// Context
const SiteLanguageContext = createContext<{
  siteLang: string;
  setSiteLang: (lang: string) => void;
}>({
  siteLang: "en",
  setSiteLang: () => {},
});

export const useSiteLanguage = () => useContext(SiteLanguageContext);

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [siteLang, setSiteLangState] = useState("en");
  
  // Initialize from localStorage on first render (client-side only)
  useEffect(() => {
    const storedLang = localStorage.getItem("siteLang");
    if (storedLang) {
      setSiteLangState(storedLang);
    }
  }, []);
  
  // Function to update both state and localStorage
  const setSiteLang = (lang: string) => {
    setSiteLangState(lang);
    localStorage.setItem("siteLang", lang);
  };

  return (
    <SiteLanguageContext.Provider value={{ siteLang, setSiteLang }}>
      {children}
    </SiteLanguageContext.Provider>
  );
}
