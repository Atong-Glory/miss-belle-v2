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

type CardPosition = "center" | "left" | "right";

/* ------------------------------------------------------------------ */
/*  Typewriter Text — character-by-character reveal with gold cursor   */
/* ------------------------------------------------------------------ */
function TypewriterText({
  text,
  isActive,
  className,
}: {
  text: string;
  isActive: boolean;
  className?: string;
}) {
  const [revealedChars, setRevealedChars] = useState<number>(() =>
    isActive ? 0 : text.length
  );
  const isTypingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      setRevealedChars(0);
      isTypingRef.current = true;
      let charIndex = 0;
      intervalRef.current = setInterval(() => {
        charIndex++;
        if (charIndex >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          isTypingRef.current = false;
          setRevealedChars(text.length);
        } else {
          setRevealedChars(charIndex);
        }
      }, 30);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isTypingRef.current = false;
      setRevealedChars(text.length);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, text]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => {
        if (i < revealedChars) {
          if (isActive && isTypingRef.current && i === revealedChars - 1) {
            return (
              <span
                key={i}
                className="text-gold transition-colors duration-75"
              >
                {char}
              </span>
            );
          }
          return (
            <span key={i} className="text-warm-white/90">
              {char}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="text-transparent select-none"
            aria-hidden
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Cinematic Quote Card                                               */
/* ------------------------------------------------------------------ */
function CinematicQuoteCard({
  item,
  isActive,
  position,
}: {
  item: TestimonialItem;
  isActive: boolean;
  position: CardPosition;
}) {
  const scale = isActive ? 1.0 : 0.9;
  const opacity = isActive ? 1 : 0.5;
  const blur = isActive ? 0 : 1;
  const zIndex = isActive ? 20 : 10;

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
        "absolute top-0 left-0 right-0 flex flex-col",
        "rounded-2xl overflow-hidden",
        "max-w-2xl mx-auto w-[85%] md:w-[65%]",
        "transition-colors duration-500",
        isActive
          ? "border border-gold/25 gold-border-glow"
          : "border border-gold/8"
      )}
      aria-label={`Testimonial from ${item.author}`}
    >
      {/* Card background — golden key light gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-stage to-void/50" />

      {/* Film grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,162,39,0.6) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Top gold accent line — 2px, centered, 60% width */}
      <div
        className={cn(
          "relative z-10 mx-auto h-[2px] rounded-full transition-all duration-500",
          isActive ? "w-[60%] bg-gold" : "w-0 bg-transparent"
        )}
      />

      {/* Cinematic portrait area — 120px with dramatic gradient & quote mark */}
      <div className="relative z-10 h-[120px] flex items-center justify-center bg-gradient-to-b from-gold/8 to-transparent">
        <span
          className={cn(
            "font-script leading-none select-none transition-all duration-500",
            isActive
              ? "text-6xl md:text-7xl text-gold/30"
              : "text-5xl md:text-6xl text-gold/15"
          )}
          aria-hidden="true"
        >
          &ldquo;
        </span>
      </div>

      {/* Quote text — typewriter reveal when active */}
      <div className="relative z-10 flex-1 px-6 md:px-10 pb-4">
        <blockquote>
          <TypewriterText
            text={item.quote}
            isActive={isActive}
            className="font-body text-base md:text-lg leading-relaxed italic text-warm-white/90"
          />
        </blockquote>
      </div>

      {/* Author section — separated by thin gold line */}
      <footer className="relative z-10 border-t border-gold/15 px-6 md:px-10 py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
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
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-body transition-colors duration-500 shrink-0",
              isActive
                ? "bg-gold/15 text-gold"
                : "bg-silver/10 text-silver/60"
            )}
          >
            {item.lang === "en" ? "\u{1F1EC}\u{1F1E7} English" : "\u{1F1E8}\u{1F1F2} Français"}
          </span>
        </div>
      </footer>

      {/* Spotlight glow for active card */}
      {isActive && (
        <motion.div
          layoutId="cinematic-testimonial-spotlight"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,162,39,0.06) 0%, transparent 70%)",
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
export default function CinematicTestimonials() {
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
      setActiveIndex((prev) => ((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo]
  );
  const goPrev = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo]
  );

  /* Auto-advance every 5 seconds, pause on hover/focus */
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

  /* Position mapping — 3 visible cards */
  const getPosition = useCallback(
    (index: number): CardPosition => {
      const diff = ((index - activeIndex) % total + total) % total;
      if (diff === 0) return "center";
      if (diff === 1) return "right";
      if (diff === total - 1) return "left";
      return "center";
    },
    [activeIndex, total]
  );

  /* Render indices — left, center, right (deduplicated) */
  const renderIndices = useMemo(() => {
    const seen = new Set<number>();
    const result: { index: number; position: CardPosition }[] = [];
    for (const offset of [-1, 0, 1]) {
      const idx = ((activeIndex + offset) % total + total) % total;
      if (seen.has(idx)) continue;
      seen.add(idx);
      result.push({ index: idx, position: getPosition(idx) });
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
        {/* Section Header */}
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
            <div className="relative h-[480px] md:h-[440px] lg:h-[420px]">
              <AnimatePresence initial={false}>
                {renderIndices.map(({ index, position }) => (
                  <CinematicQuoteCard
                    key={items[index].id}
                    item={items[index]}
                    isActive={index === activeIndex}
                    position={position}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop navigation arrows — gold circular buttons */}
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

          {/* Dot indicators */}
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

          {/* Mobile swipe hint */}
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