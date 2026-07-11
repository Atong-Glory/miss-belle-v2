"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* =================================================================
   DATA — Kom proverbs with multilingual translations
   ================================================================= */

const PROVERBS = [
  {
    kom: "A nkyi wo sɛm, wo sɛm wo",
    en: "What you say is what you are.",
    fr: "Ce que tu dis est ce que tu es.",
  },
  {
    kom: "Kɛ mbuh ka wo yi ka wo fã",
    en: "A child who travels discovers the feet of the elders are not so long.",
    fr: "L'enfant qui voyage découvre que les pieds des anciens ne sont pas si longs.",
  },
  {
    kom: "Nshi wo ndzəŋ, wo ndzəŋ ndzəŋ ghɔ",
    en: "When you follow the path of your father, you learn to walk your own.",
    fr: "Quand tu suis le chemin de ton père, tu apprends à marcher le tien.",
  },
  {
    kom: "Wɔ ndzɔŋ fə̀ŋ a mbi ghɔ nka wɔ",
    en: "The river that forgets its source will dry up.",
    fr: "La rivière qui oublie sa source s'asséchera.",
  },
  {
    kom: "A kpa a vère, a kpa a ngban",
    en: "One hand cannot clap alone.",
    fr: "Une seule main ne peut applaudir seule.",
  },
  {
    kom: "Nwi wo yi, nwi wo sɔŋ",
    en: "Where there is love, there is patience.",
    fr: "Là où il y a de l'amour, il y a de la patience.",
  },
  {
    kom: "Ghɔŋ a zhi a mbuh nshi",
    en: "The tree that bears fruit gets stoned.",
    fr: "L'arbre qui porte des fruits reçoit des pierres.",
  },
  {
    kom: "A fwa a fwa, a yi a ntəŋ",
    en: "Slowly, slowly, the bird builds its nest.",
    fr: "Lentement, lentement, l'oiseau construit son nid.",
  },
] as const;

/* =================================================================
   2a. KomPatternDivider
   Decorative SVG divider with traditional Kom-inspired diamond
   geometry that slowly drifts horizontally.
   ================================================================= */

export function KomPatternDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      role="separator"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 40"
        preserveAspectRatio="xMidYMid meet"
        className="h-10 w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="kom-pattern"
            x="0"
            y="0"
            width="60"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 5 L55 20 L30 35 L5 20 Z"
              fill="none"
              stroke="rgba(201,162,39,0.25)"
              strokeWidth="0.8"
            />
            <line
              x1="55"
              y1="20"
              x2="65"
              y2="20"
              stroke="rgba(201,162,39,0.15)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="800" height="40" fill="url(#kom-pattern)" />
        {/* Animated drift overlay */}
        <rect
          width="800"
          height="40"
          fill="url(#kom-pattern)"
          style={{
            animation: "kom-drift 30s linear infinite",
          }}
        />
      </svg>

      {/* Keyframe for the slow leftward drift */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes kom-drift {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-60px); }
            }
          `,
        }}
      />
    </div>
  );
}

/* =================================================================
   2b. KomProverbLoader
   Rotating Kom proverbs — drop-in replacement for loading text.
   ================================================================= */

export function KomProverbLoader({ className }: { className?: string }) {
  const { lang } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROVERBS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = PROVERBS[index];
  const translation =
    lang === "fr" ? current.fr : current.en;

  return (
    <div
      className={cn("flex flex-col items-center gap-2 py-8", className)}
      role="status"
      aria-live="polite"
      aria-label="Rotating Kom proverb"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <p className="font-script text-lg text-gold/60">{current.kom}</p>
          <p className="max-w-md font-body text-sm italic text-silver/40">
            {translation}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =================================================================
   2c. CulturalNote
   Expandable cultural-note tooltip for poems.
   ================================================================= */

export function CulturalNote({
  note,
  children,
}: {
  note: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="inline-flex flex-col">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center"
        aria-expanded={isOpen}
        aria-label="Toggle cultural note"
      >
        <motion.span
          className="inline-block text-gold"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ fontSize: 18, lineHeight: 1, display: "inline-block" }}
        >
          ✦
        </motion.span>
      </button>

      {/* Expandable panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-gold/10 border-l-2 border-l-gold bg-void/80 p-4">
              <p className="mb-1 font-body text-xs uppercase tracking-widest text-gold/60">
                ✦ Cultural Note
              </p>
              <p className="font-body text-sm leading-relaxed text-silver">
                {note}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden children — keep in DOM for SSR but visually replaced by trigger */}
      <span className="sr-only">{children}</span>
    </span>
  );
}