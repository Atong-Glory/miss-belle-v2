"use client";

import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggleLang, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.a11y.toggleLanguage}
      className="fixed top-6 right-6 z-50 flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5
        font-body text-xs uppercase tracking-widest text-gold transition-all duration-300
        hover:border-champagne/50 hover:text-champagne hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void
        bg-void/60 backdrop-blur-sm"
    >
      <Globe className="size-[14px]" />
      <span>{t.language[lang]}</span>
    </button>
  );
}