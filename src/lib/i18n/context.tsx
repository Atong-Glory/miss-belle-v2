"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore, useEffect, ReactNode } from "react";
import en from "./en.json";
import fr from "./fr.json";

type Lang = "en" | "fr";
type Translations = typeof en;

const translations: Record<Lang, Translations> = { en, fr };

const STORAGE_KEY = "missbelle-lang";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") return stored;
  } catch {}
  return "en";
}

function getServerSnapshot(): Lang {
  return "en";
}

interface I18nContextType {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync html lang attribute with selected language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
    // Dispatch a storage event so useSyncExternalStore re-reads
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  const toggleLang = useCallback(() => {
    const current = getSnapshot();
    const next: Lang = current === "en" ? "fr" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  return (
    <I18nContext.Provider
      value={{ lang, t: translations[lang], setLang, toggleLang }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export type { Lang };