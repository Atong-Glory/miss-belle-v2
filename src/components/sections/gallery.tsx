"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GalleryCategory = "stage" | "behind" | "events";
type AspectRatio = "square" | "portrait" | "landscape";

interface GalleryItem {
  id: string;
  category: GalleryCategory;
  title: string;
  aspectRatio: AspectRatio;
  src?: string;
  gradient?: string;
}

type FilterKey = "all" | GalleryCategory;

/* ------------------------------------------------------------------ */
/*  Gallery Data — add real images to /public/gallery/ and set src below  */
/* ------------------------------------------------------------------ */

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    category: "stage",
    title: "On Stage, Bamenda",
    aspectRatio: "landscape",
    gradient:
      "linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(139,0,0,0.08) 50%, rgba(201,162,39,0.05) 100%)",
  },
  {
    id: "g2",
    category: "behind",
    title: "The Writing Process",
    aspectRatio: "square",
    gradient:
      "linear-gradient(160deg, rgba(139,0,0,0.12) 0%, rgba(201,162,39,0.06) 40%, rgba(10,10,15,0.1) 100%)",
  },
  {
    id: "g3",
    category: "stage",
    title: "Slam Night, Douala",
    aspectRatio: "portrait",
    gradient:
      "radial-gradient(ellipse 60% 50% at 40% 30%, rgba(201,162,39,0.12) 0%, transparent 70%), linear-gradient(180deg, var(--bg-stage) 0%, var(--bg-void) 100%)",
  },
  {
    id: "g4",
    category: "behind",
    title: "Sound Check Moments",
    aspectRatio: "landscape",
    gradient:
      "linear-gradient(120deg, rgba(201,162,39,0.08) 0%, rgba(139,0,0,0.06) 50%, rgba(201,162,39,0.1) 100%)",
  },
  {
    id: "g5",
    category: "events",
    title: "Corporate Gala",
    aspectRatio: "square",
    gradient:
      "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,39,0.1) 0%, transparent 60%), linear-gradient(135deg, var(--bg-stage) 0%, var(--bg-void) 100%)",
  },
  {
    id: "g6",
    category: "events",
    title: "Festival des Arts",
    aspectRatio: "portrait",
    gradient:
      "linear-gradient(145deg, rgba(139,0,0,0.1) 0%, rgba(201,162,39,0.08) 50%, rgba(139,0,0,0.05) 100%)",
  },
  {
    id: "g7",
    category: "behind",
    title: "Backstage with the Team",
    aspectRatio: "square",
    gradient:
      "linear-gradient(170deg, rgba(201,162,39,0.1) 0%, rgba(10,10,15,0.15) 50%, rgba(201,162,39,0.05) 100%)",
  },
  {
    id: "g8",
    category: "stage",
    title: "Church Performance",
    aspectRatio: "landscape",
    gradient:
      "radial-gradient(ellipse 55% 45% at 60% 40%, rgba(139,0,0,0.1) 0%, transparent 65%), linear-gradient(135deg, var(--bg-stage) 0%, var(--bg-void) 100%)",
  },
];

/* ------------------------------------------------------------------ */
/*  Aspect ratio map                                                   */
/* ------------------------------------------------------------------ */

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

/* ------------------------------------------------------------------ */
/*  Filter config                                                      */
/* ------------------------------------------------------------------ */

const FILTERS: FilterKey[] = ["all", "stage", "behind", "events"];

function getFilterLabel(key: FilterKey, t: { gallery: Record<string, string> }): string {
  switch (key) {
    case "all":
      return t.gallery.filterAll;
    case "stage":
      return t.gallery.filterStage;
    case "behind":
      return t.gallery.filterBehind;
    case "events":
      return t.gallery.filterEvents;
  }
}

/* ------------------------------------------------------------------ */
/*  Spotlight mouse tracking                                           */
/* ------------------------------------------------------------------ */

function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Lightbox Component                                                  */
/* ------------------------------------------------------------------ */

function Lightbox({
  item,
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  closeLabel,
  prevLabel,
  nextLabel,
  counterTemplate,
}: {
  item: GalleryItem;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  counterTemplate: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & keyboard handling
  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "Tab": {
          e.preventDefault();
          const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) last.focus();
          } else {
            if (document.activeElement === last) first.focus();
          }
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const counterText = counterTemplate
    .replace("{current}", String(currentIndex + 1))
    .replace("{total}", String(items.length));

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-void/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4">
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-12 right-4 rounded-full p-2 text-silver transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:right-0 sm:-top-14"
          aria-label={closeLabel}
        >
          <X className="size-6" />
        </button>

        {/* Image placeholder */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="w-full"
          >
            <div
              className={cn(
                "flex w-full items-center justify-center rounded-xl border border-gold/20",
                ASPECT_CLASSES[item.aspectRatio],
                "max-h-[75vh]"
              )}
              style={{ background: item.gradient || "linear-gradient(135deg, var(--bg-stage) 0%, var(--bg-void) 100%)" }}
              role="img"
              aria-label={item.title}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Camera className="size-10 text-gold/20" aria-hidden="true" />
                  <span className="font-script text-xl text-gold/25 sm:text-2xl">
                    {item.title}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Title + counter */}
        <div className="mt-5 flex w-full items-center justify-between px-1">
          <h3 className="font-headline text-lg text-warm-white sm:text-xl">
            {item.title}
          </h3>
          <span className="font-body text-sm text-silver" aria-live="polite">
            {counterText}
          </span>
        </div>

        {/* Navigation arrows */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={onPrev}
            className="rounded-full border border-gold/30 p-2 text-silver transition-all duration-200 hover:border-gold hover:bg-gold hover:text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            aria-label={prevLabel}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={onNext}
            className="rounded-full border border-gold/30 p-2 text-silver transition-all duration-200 hover:border-gold hover:bg-gold hover:text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            aria-label={nextLabel}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery Section (default export)                                    */
/* ------------------------------------------------------------------ */

export default function GallerySection() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleSpotlight = useSpotlight();

  const filteredItems =
    activeFilter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const lightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  }, [filteredItems.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  }, [filteredItems.length]);

  // Reset lightbox index when filter changes — handled inline in the setter
  const handleFilterChange = useCallback((key: FilterKey) => {
    setActiveFilter(key);
    setLightboxIndex(null);
  }, []);

  return (
    <section
      id="gallery"
      className="relative py-24 md:py-32"
      aria-labelledby="gallery-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="mb-12 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-gold sm:text-sm">
            {t.gallery.sectionSubtitle}
          </p>
          <h2
            id="gallery-title"
            className="font-headline text-3xl text-gradient-gold sm:text-4xl md:text-5xl"
          >
            {t.gallery.sectionTitle}
          </h2>
        </FadeIn>

        {/* Category filters */}
        <FadeIn delay={0.15} className="mb-10">
          <div
            className="mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            role="tablist"
            aria-label={t.gallery.filterAll ? "Gallery filters" : undefined}
          >
            {FILTERS.map((key, idx) => {
              const isActive = activeFilter === key;
              const label = getFilterLabel(key, t as unknown as { gallery: Record<string, string> });
              const tabId = `gallery-tab-${key}`;
              const panelId = `gallery-panel-${key}`;
              return (
                <button
                  key={key}
                  id={tabId}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  onClick={() => handleFilterChange(key)}
                  className={cn(
                    "rounded-full px-4 py-1.5 font-body text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                    isActive
                      ? "bg-gold text-void shadow-[0_0_15px_rgba(201,162,39,0.25)]"
                      : "border border-gold/30 text-silver hover:border-gold/50 hover:text-warm-white"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Gallery panel */}
        <div
          id={activeFilter === "all" ? "gallery-panel-all" : `gallery-panel-${activeFilter}`}
          role="tabpanel"
          aria-label={activeFilter === "all" ? "All gallery items" : getFilterLabel(activeFilter, t as unknown as { gallery: Record<string, string> })}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          <AnimatePresence initial={false}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  onMouseMove={handleSpotlight}
                  className={cn(
                    "spotlight-card group relative block w-full cursor-pointer overflow-hidden rounded-xl",
                    "border border-gold/10 bg-stage",
                    "transition-all duration-300 ease-out",
                    "hover:scale-[1.03] hover:border-gold/25 hover:shadow-[0_0_25px_rgba(201,162,39,0.12)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                    "text-left"
                  )}
                  aria-label={`View: ${item.title}`}
                >
                  {/* Gradient image placeholder */}
                  <div
                    className={cn(
                      "flex w-full items-end justify-center",
                      ASPECT_CLASSES[item.aspectRatio]
                    )}
                    style={{ background: item.gradient || "linear-gradient(135deg, var(--bg-stage) 0%, var(--bg-void) 100%)" }}
                  >
                    {item.src && (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    )}

                    {/* Overlay gradient on hover */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                        item.src ? "bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-0 group-hover:opacity-100" : "bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-100"
                      )}
                      aria-hidden="true"
                    />

                    {/* Camera icon (visible when no image, or subtle on hover) */}
                    <div className={cn(
                      "relative z-10 pb-4 transition-opacity duration-300",
                      item.src ? "opacity-40 group-hover:opacity-80" : "opacity-40"
                    )}>
                      <Camera
                        className="mx-auto mb-2 size-6 text-gold/50"
                        aria-hidden="true"
                      />
                      <span className="block text-center font-script text-base text-gold/40 sm:text-lg">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxItem && (
            <Lightbox
              item={lightboxItem}
              items={filteredItems}
              currentIndex={lightboxIndex!}
              onClose={closeLightbox}
              onPrev={goPrev}
              onNext={goNext}
              closeLabel={t.gallery.closeLightbox}
              prevLabel={t.gallery.previousImage}
              nextLabel={t.gallery.nextImage}
              counterTemplate={t.gallery.imageCounter}
            />
          )}
        </AnimatePresence>

        {/* Section divider */}
        <div className="section-divider mx-auto mt-24 max-w-4xl md:mt-32" role="separator" />
      </div>
    </section>
  );
}