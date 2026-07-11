"use client";

import { useI18n } from "@/lib/i18n";
import { Instagram, Youtube, Music, Facebook, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Social links                                                       */
/* ------------------------------------------------------------------ */

interface SocialLink {
  href: string;
  icon: LucideIcon | typeof WhatsAppIcon;
  label: string;
  active: boolean;
}

const SOCIAL_LINKS: SocialLink[] = [
  { href: "https://facebook.com/missbelle.poetry", icon: Facebook, label: "Facebook", active: true },
  { href: "https://instagram.com/missbelle.poetry", icon: Instagram, label: "Instagram", active: true },
  { href: "https://youtube.com/@missbellepoetry", icon: Youtube, label: "YouTube", active: true },
  { href: "https://tiktok.com/@missbellepoetry", icon: Music, label: "TikTok", active: true },
  { href: "https://wa.me/?text=Hello%20Miss%20Belle!%20I%27d%20love%20to%20book%20you%20for%20an%20event.", icon: WhatsAppIcon, label: "WhatsApp", active: true },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const { t, lang, toggleLang } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto bg-curtain border-t border-gold/10 py-12 px-4 sm:px-6 lg:px-8"
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* ---- Brand ---- */}
        <div className="text-center space-y-2">
          <p className="font-headline text-gold text-xl tracking-wider">
            {t.brand.name}
          </p>
          <p className="font-script text-silver/60 text-lg">
            {t.footer.tagline}
          </p>
        </div>

        {/* ---- Social icons ---- */}
        <nav aria-label={t.footer.socialLabel} className="flex items-center gap-5">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label, active }) =>
            active ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-all duration-300 rounded-sm text-gold hover:text-champagne hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-curtain"
              >
                <Icon className="size-5" aria-hidden="true" />
              </a>
            ) : (
              <span
                key={label}
                aria-label={`${label} (coming soon)`}
                aria-disabled="true"
                tabIndex={-1}
                className="transition-all duration-300 rounded-sm text-gold/30 cursor-not-allowed inline-flex"
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
            )
          )}
        </nav>

        {/* ---- Language toggle ---- */}
        <button
          type="button"
          onClick={toggleLang}
          aria-label={t.a11y.toggleLanguage}
          className="flex items-center gap-1 text-sm text-silver/70 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-curtain rounded-sm font-body"
        >
          <span
            className={
              lang === "en"
                ? "text-gold font-medium"
                : "text-silver/50"
            }
          >
            {t.language.en}
          </span>
          <span className="text-silver/30 mx-0.5" aria-hidden="true">|</span>
          <span
            className={
              lang === "fr"
                ? "text-gold font-medium"
                : "text-silver/50"
            }
          >
            {t.language.fr}
          </span>
        </button>

        {/* ---- Copyright + Developed by ---- */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-silver/40 text-xs font-body">
            {t.footer.builtWith}
          </p>
          <p className="text-silver/40 text-xs font-body">
            {t.footer.copyright.replace("{year}", String(currentYear))}
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="text-silver/30 text-xs font-body">
              {t.footer.developedBy}
            </span>
            <a
              href="https://atom.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-headline text-gold/60 hover:text-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-1 focus-visible:ring-offset-curtain rounded-sm"
              aria-label="Atom — Developer Portfolio"
            >
              Atom
              <ExternalLink className="size-3 opacity-50" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}