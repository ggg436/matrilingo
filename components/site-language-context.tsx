"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Supported languages
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "sa", label: "Sanskrit" },
  { code: "bh", label: "Bhojpuri" },
  { code: "ma", label: "Maithili" },
];

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
  const [siteLang, setSiteLang] = useState("en");
  return (
    <SiteLanguageContext.Provider value={{ siteLang, setSiteLang }}>
      {children}
    </SiteLanguageContext.Provider>
  );
}
