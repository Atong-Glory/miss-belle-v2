"use client";

import { useState, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import VoicedCanvas from "@/components/sections/voiced-canvas";

/* ------------------------------------------------------------------ */
/*  Featured poems for the Voiced Canvas section                       */
/* ------------------------------------------------------------------ */

const FEATURED_POEMS = [
  { title: "The Canvas Speaks", excerpt: "I painted my prayers on walls no one could see, and God turned them into galleries of grace...", lang: "en" as const },
  { title: "L'Echo du Terroir", excerpt: "Mon coeur bat au rythme des tam-tams de mon village, un battement qui traverse les ocean...", lang: "fr" as const },
  { title: "Psalm of the Mic", excerpt: "Lord, make me an instrument of your rhythm. Let every syllable land like a seed on good soil...", lang: "en" as const },
  { title: "Daughter of the Soil", excerpt: "My grandmother's name is written in the lines of my palms, in the way I hold the mic like she held her hoe...", lang: "en" as const },
];

/* ------------------------------------------------------------------ */
/*  Self-contained section wrapping the VoicedCanvas modal             */
/* ------------------------------------------------------------------ */

export function VoicedCanvasSection() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activePoemIndex, setActivePoemIndex] = useState(0);

  const activePoem = FEATURED_POEMS[activePoemIndex];

  const handleSelect = useCallback((index: number) => {
    setActivePoemIndex(index);
    setIsOpen(true);
  }, []);

  return (
    <section id="voiced-canvas" className="py-24 md:py-32 bg-void" aria-labelledby="voiced-canvas-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <FadeIn>
            <h2 id="voiced-canvas-title" className="font-headline text-3xl md:text-4xl text-gradient-gold">
              The Voiced Canvas
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 font-headline text-silver italic text-lg">
              Hear the words breathe.
            </p>
          </FadeIn>
        </div>

        {/* Featured poem cards */}
        <FadeIn delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_POEMS.map((poem, i) => (
              <button
                key={poem.title}
                onClick={() => handleSelect(i)}
                className={cn(
                  "group relative rounded-xl border p-5 text-left",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  activePoemIndex === i && isOpen
                    ? "border-gold/40 bg-gold/5 shadow-[0_0_30px_rgba(201,162,39,0.1)]"
                    : "border-gold/10 bg-stage hover:border-gold/25 hover:shadow-[0_8px_30px_rgba(201,162,39,0.08)]"
                )}
              >
                <span className="inline-block mb-2 text-xs text-gold/60 font-body">
                  {poem.lang === "en" ? "EN" : "FR"}
                </span>
                <h3 className="font-headline text-base text-warm-white leading-snug mb-2 group-hover:text-gold transition-colors duration-300">
                  {poem.title}
                </h3>
                <p className="text-silver text-xs leading-relaxed line-clamp-2">
                  {poem.excerpt}
                </p>
                <span className="mt-3 inline-block text-xs text-gold/50 font-body uppercase tracking-widest group-hover:text-gold transition-colors duration-300">
                  {t.voicedCanvas.listen}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* The modal */}
        <VoicedCanvas
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          poem={activePoem}
        />
      </div>
    </section>
  );
}