"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  lang: "en" | "fr";
}

/* ------------------------------------------------------------------ */
/*  Testimonial Card — dramatic, spotlight-lit                          */
/* ------------------------------------------------------------------ */
function TestimonialCard({
  item,
  isActive,
  position,
}: {
  item: TestimonialItem;
  isActive: boolean;
  position: "center" | "left" | "right" | "far-left" | "far-right";
}) {
  const scale = isActive ? 1.06 : position === "left" || position === "right" ? 0.92 : 0.85;
  const opacity = isActive ? 1 : position === "left" || position === "right" ? 0.6 : 0.3;
  const zIndex = isActive ? 20 : position === "left" || position === "right" ? 10 : 5;
  const blur = isActive ? 0 : 1;

  return (
    <motion.article
      style={{
        scale,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "absolute top-0 left-0 right-0 flex flex-col justify-between",
        "rounded-2xl border p-8 md:p-10",
        "transition-colors duration-500",
        "max-w-2xl mx-auto w-[85%] md:w-[65%]",
        isActive
          ? "bg-stage border-gold/25 shadow-[0_0_60px_rgba(201,162,39,0.08)]"
          : "bg-stage border-gold/8"
      )}
      aria-label={`Testimonial from ${item.author}`}
    >
      {/* Gold accent line at top */}
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500",
          isActive ? "w-24 bg-gold" : "w-0 bg-transparent"
        )}
      />

      {/* Language badge */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-body transition-colors duration-500",
            isActive
              ? "bg-gold/15 text-gold"
              : "bg-silver/10 text-silver/60"
          )}
        >
          {item.lang === "en" ? "🇬🇧 English" : "🇨🇲 Français"}
        </span>
      </div>

      {/* Opening quote mark */}
      <div className="relative z-10 mb-4">
        <span
          className={cn(
            "font-script leading-none block select-none transition-colors duration-500",
            isActive
              ? "text-7xl md:text-8xl text-gold"
              : "text-6xl text-gold/40"
          )}
          aria-hidden="true"
        >
          &ldquo;
        </span>
      </div>

      {/* Quote text */}
      <blockquote className="relative z-10 flex-1 mb-6">
        <p
          className={cn(
            "font-body leading-relaxed italic transition-colors duration-500",
            isActive
              ? "text-warm-white/95 text-[16px] md:text-lg"
              : "text-warm-white/50 text-[15px]"
          )}
        >
          {item.quote}
        </p>
      </blockquote>

      {/* Author section */}
      <footer className="relative z-10 border-t border-gold/10 pt-5">
        <span
          className={cn(
            "block font-headline transition-colors duration-500",
            isActive ? "text-gold text-lg" : "text-gold/60 text-base"
          )}
        >
          {item.author}
        </span>
        <span
          className={cn(
            "block text-sm mt-0.5 font-body transition-colors duration-500",
            isActive ? "text-silver" : "text-silver/40"
          )}
        >
          {item.role}
        </span>
      </footer>

      {/* Spotlight glow for active card */}
      {isActive && (
        <motion.div
          layoutId="testimonial-spotlight"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,162,39,0.04) 0%, transparent 70%)",
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        />
      )}
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Carousel Section                                               */
/* ------------------------------------------------------------------ */
export default function TestimonialsSection() {
  const { t } = useI18n();
  const items = useMemo(
    () => t.testimonials.items as unknown as TestimonialItem[],
    [t.testimonials.items]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((prev) => {
        const next = ((index % total) + total) % total;
        return next;
      });
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* Auto-advance */
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, goNext]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    },
    [goNext, goPrev]
  );

  /* Touch swipe */
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  /* Position mapping for visible cards */
  const getPosition = useCallback(
    (index: number): "center" | "left" | "right" | "far-left" | "far-right" => {
      const diff = ((index - activeIndex) % total + total) % total;
      if (diff === 0) return "center";
      if (diff === 1) return "right";
      if (diff === total - 1) return "left";
      if (diff === 2) return "far-right";
      if (diff === total - 2) return "far-left";
      return "center"; // hidden
    },
    [activeIndex, total]
  );

  // Show up to 5 cards: far-left, left, center, right, far-right (deduplicated)
  const renderIndices = useMemo(() => {
    const seen = new Set<number>();
    const result: { index: number; position: "center" | "left" | "right" | "far-left" | "far-right" }[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = ((activeIndex + offset) % total + total) % total;
      if (seen.has(idx)) continue;
      seen.add(idx);
      const pos = getPosition(idx);
      result.push({ index: idx, position: pos });
    }
    return result;
  }, [activeIndex, total, getPosition]);

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center">
          <FadeIn>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl text-gradient-gold">
              {t.testimonials.sectionTitle}
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 font-headline text-silver italic text-lg md:text-xl">
              {t.testimonials.sectionSubtitle}
            </p>
          </FadeIn>
        </div>

        {/* Carousel Stage */}
        <FadeIn delay={0.25}>
          <div
            className="relative"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonial carousel"
            tabIndex={0}
          >
            {/* Card stage — fixed height container */}
            <div className="relative h-[420px] md:h-[380px] lg:h-[360px]">
              <AnimatePresence initial={false}>
                {renderIndices.map(({ index, position }) => (
                  <TestimonialCard
                    key={items[index].id}
                    item={items[index]}
                    isActive={index === activeIndex}
                    position={position}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop navigation arrows */}
            <div className="hidden md:flex absolute -left-4 lg:-left-6 -right-4 lg:-right-6 top-1/2 -translate-y-1/2 items-center justify-between pointer-events-none z-30">
              <button
                onClick={goPrev}
                className={cn(
                  "pointer-events-auto flex items-center justify-center",
                  "w-11 h-11 rounded-full",
                  "border border-gold/25 text-gold",
                  "bg-void/80 backdrop-blur-sm",
                  "transition-all duration-300",
                  "hover:bg-gold hover:text-void hover:border-gold hover:scale-110",
                  "active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                )}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                className={cn(
                  "pointer-events-auto flex items-center justify-center",
                  "w-11 h-11 rounded-full",
                  "border border-gold/25 text-gold",
                  "bg-void/80 backdrop-blur-sm",
                  "transition-all duration-300",
                  "hover:bg-gold hover:text-void hover:border-gold hover:scale-110",
                  "active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                )}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Dot indicators — connected to active slide */}
          <div
            className="flex items-center justify-center gap-3 mt-10"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Testimonial ${i + 1} of ${total}: ${item.author}`}
                className={cn(
                  "rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  i === activeIndex
                    ? "w-10 h-2 bg-gold"
                    : "w-2 h-2 bg-gold/20 hover:bg-gold/40"
                )}
              />
            ))}
          </div>

          {/* Mobile swipe hint (fades after first interaction) */}
          <p className="md:hidden text-center text-silver/40 text-xs mt-4 font-body">
            {t.testimonials.swipeHint}
          </p>
        </FadeIn>

        {/* Section divider */}
        <div className="section-divider mt-24" role="separator" />
      </div>
    </section>
  );
}