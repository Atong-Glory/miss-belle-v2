"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";

/* ------------------------------------------------------------------ */
/*  Timeline Data                                                      */
/* ------------------------------------------------------------------ */

interface Chapter {
  year: string;
  title: string;
  text: string;
}

const CHAPTERS: Chapter[] = [
  {
    year: "The Beginning",
    title: "The First Verse",
    text: "In the highlands of Kom, where the mountains hold silence like a treasure, a child learned that words have weight. Not the weight of textbooks, but the weight of truth — the kind that settles in your chest when an elder speaks and the whole room goes still.",
  },
  {
    year: "Discovery",
    title: "Finding the Flame",
    text: "Between the pages of scripture and the rhythms of the village, a voice found its shape. Not in a classroom, not in a book — but in the space between breath and word, where spoken word poetry lives. The flame was lit not by a match, but by a need to be heard.",
  },
  {
    year: "First Stage",
    title: "The Stage Calls",
    text: "The first microphone felt like a handshake from destiny. In a room full of strangers, the words that had been whispered in quiet corners finally found their volume. The stage didn't change the words — it changed the space around them, and in that space, something sacred happened.",
  },
  {
    year: "The Roots",
    title: "Voices of Cameroon",
    text: "From Bamenda to Buea, from Douala to Yaoundé, the voice traveled with the urgency of a message that couldn't wait. Each stage was a new verse in an ongoing poem about a country, a people, a faith that refuses to be silent. The music of Cameroon — its languages, its pains, its joys — became the rhythm of the art.",
  },
  {
    year: "The Bridge",
    title: "Two Tongues, One Heart",
    text: "English and French — two languages that colonialism left behind, now woven into a single artistic voice. To speak in both is to carry two worlds in one mouth, and Miss Belle discovered that the space between languages is where the deepest poetry lives.",
  },
  {
    year: "The Canvas",
    title: "Canvas of the Heart",
    text: "Every poem is a painting made of breath. Every performance is an exhibition of the invisible. The brand was born not from a marketing plan, but from a truth: the heart is a canvas, and words are the only brush that can reach it. This is not a career — it is a calling.",
  },
];

/* ------------------------------------------------------------------ */
/*  Chapter Card (individual timeline node)                            */
/* ------------------------------------------------------------------ */

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
  isVisible: boolean;
}

function ChapterCard({ chapter, index, isVisible }: ChapterCardProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative flex items-start gap-6 md:gap-0",
        /* Mobile: always left-aligned */
        "pl-10 md:pl-0",
        /* Desktop: alternate sides */
        isEven ? "md:flex-row" : "md:flex-row-reverse",
      )}
    >
      {/* -- Node dot -- */}
      <div
        className={cn(
          "absolute top-2 left-4 md:left-1/2 md:-translate-x-1/2 z-10",
          "w-3 h-3 rounded-full bg-gold/60 border-2 border-gold",
          "transition-shadow duration-700",
          isVisible && "shadow-[0_0_12px_rgba(201,162,39,0.4)]",
        )}
      />

      {/* -- Content card -- */}
      <div
        className={cn(
          "w-full md:w-[calc(50%-2rem)]",
          isEven ? "md:pr-4 md:text-right" : "md:pl-4 md:text-left",
        )}
      >
        <motion.div
          className="bg-stage border border-gold/10 rounded-xl p-6 md:p-8 max-w-[500px] mx-auto"
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          animate={
            isVisible
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 30, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-body mb-2">
            {chapter.year}
          </p>
          <h3 className="font-headline text-xl text-warm-white mb-3">
            {chapter.title}
          </h3>
          <p className="font-body text-silver text-sm leading-relaxed">
            {chapter.text}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function OriginThread() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const [lineProgress, setLineProgress] = useState(0);

  /* -- IntersectionObserver for chapter visibility -- */
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(
            (entry.target as HTMLElement).dataset.chapterIndex,
          );
          if (!Number.isNaN(index)) {
            setVisibleSet((prev) => {
              const next = new Set(prev);
              if (entry.isIntersecting) {
                next.add(index);
              } else {
                next.delete(index);
              }
              return next;
            });
          }
        });
      },
      { threshold: 0.3 },
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* -- Scroll-driven gold line growth -- */
  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // progress: 0 when section top is at viewport bottom, 1 when section bottom reaches viewport top
      const scrollDistance = viewportHeight + sectionHeight;
      const scrolled = viewportHeight - sectionTop;
      const raw = Math.max(0, Math.min(1, scrolled / scrollDistance));

      setLineProgress(raw);
    };

    // Use passive listener for scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="origin-thread" ref={sectionRef} className="py-24 md:py-32 bg-void">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Header ---- */}
        <div className="text-center space-y-3 mb-16 md:mb-20">
          <FadeIn>
            <h2 className="font-headline text-3xl md:text-4xl text-gradient-gold">
              {t.originThread.title}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-headline text-silver italic text-lg">
              {t.originThread.subtitle}
            </p>
          </FadeIn>
        </div>

        {/* ---- Timeline ---- */}
        <div className="relative">
          {/* Gold vertical line — grows on scroll */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 w-px z-0"
            style={{
              height: "100%",
              background: `linear-gradient(
                to bottom,
                rgba(201, 162, 39, 0) 0%,
                rgba(201, 162, 39, ${0.3 * Math.min(1, lineProgress * 1.5)}) 20%,
                rgba(201, 162, 39, ${0.3 * Math.min(1, lineProgress * 1.5)}) ${Math.min(100, lineProgress * 100)}%,
                rgba(201, 162, 39, 0) ${Math.min(100, lineProgress * 100 + 5)}%
              )`,
              transition: "background 0.1s linear",
            }}
          />

          {/* Chapter items */}
          <div className="space-y-16 md:space-y-20">
            {CHAPTERS.map((chapter, index) => (
              <div
                key={chapter.year}
                ref={setItemRef(index)}
                data-chapter-index={index}
              >
                <ChapterCard
                  chapter={chapter}
                  index={index}
                  isVisible={visibleSet.has(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}