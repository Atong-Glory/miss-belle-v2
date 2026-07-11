"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   DATA — floating poem lines that drift between major sections
   ---------------------------------------------------------------- */

const BREATH_MOMENTS = [
  { quote: "I painted my prayers on walls no one could see...", lang: "en" },
  { quote: "Le silence a un poids, et j'ai appris a lui donner une voix.", lang: "fr" },
  { quote: "Every mile is a stanza, every town a verse.", lang: "en" },
  { quote: "Les mots ne font qu'echo — ils persistent.", lang: "fr" },
  { quote: "My grandmother's name is written in the lines of my palms.", lang: "en" },
];

/* ----------------------------------------------------------------
   Single breath moment — scroll-triggered interstitial
   ---------------------------------------------------------------- */

function BreathMoment({ quote, index }: { quote: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "0px 0px -40px 0px",
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div
      ref={ref}
      className="flex min-h-[120px] items-center justify-center px-6"
      aria-hidden="true"
    >
      <motion.div
        className="flex w-full max-w-2xl items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{
          duration: 0.8,
          delay: index * 0.05,
          ease: [0.25, 0.4, 0.25, 1],
        }}
      >
        {/* Left gold line */}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* Star + quote */}
        <div className="flex shrink-0 items-center px-4 sm:px-6">
          <span className="mx-2 text-sm text-gold/20 select-none" aria-hidden="true">
            &#10022;
          </span>
          <p
            className={cn(
              "text-center font-script text-lg italic text-gold/40 md:text-xl"
            )}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <span className="mx-2 text-sm text-gold/20 select-none" aria-hidden="true">
            &#10022;
          </span>
        </div>

        {/* Right gold line */}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------
   EXPORT — accepts an optional index prop to render one moment.
   If no index, renders all as a fragment (backward compat).
   ---------------------------------------------------------------- */

export default function LivingStage({ index }: { index?: number }) {
  if (index !== undefined) {
    const moment = BREATH_MOMENTS[index % BREATH_MOMENTS.length];
    return <BreathMoment quote={moment.quote} index={index} />;
  }

  return (
    <>
      {BREATH_MOMENTS.map((moment, i) => (
        <BreathMoment key={i} quote={moment.quote} index={i} />
      ))}
    </>
  );
}