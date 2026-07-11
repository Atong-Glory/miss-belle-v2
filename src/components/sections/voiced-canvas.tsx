"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Play, Pause, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface VoicedCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  poem: { title: string; excerpt: string; lang: "en" | "fr" } | null;
}

/* ------------------------------------------------------------------ */
/*  Word reveal speed                                                  */
/* ------------------------------------------------------------------ */

const WORD_REVEAL_INTERVAL = 200; // ms per word

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function VoicedCanvas({ isOpen, onClose, poem }: VoicedCanvasProps) {
  const { t } = useI18n();

  /* ---- State ---- */
  // Track previous poem title via state (not ref) to enable render-time reset
  const [prevPoemTitle, setPrevPoemTitle] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedWordCount, setRevealedWordCount] = useState(0);

  /* ---- Refs ---- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef<number>(0);

  /* ---- Derived ---- */
  const words = poem ? poem.excerpt.split(/\s+/) : [];
  const totalWords = words.length;
  const progress = totalWords > 0 ? revealedWordCount / totalWords : 0;

  /* ---- Adjust state when poem title changes (during render, no ref access) ---- */
  const currentPoemTitle = poem?.title ?? null;
  if (currentPoemTitle !== prevPoemTitle) {
    setPrevPoemTitle(currentPoemTitle);
    if (currentPoemTitle !== null) {
      setIsPlaying(false);
      setRevealedWordCount(0);
    }
  }

  /* ---- Timer cleanup (only used in event handlers and effects, not render) ---- */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* ---- Full reset (event handler only) ---- */
  const stopAndReset = useCallback(() => {
    setIsPlaying(false);
    setRevealedWordCount(0);
    clearTimer();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    timeRef.current = 0;
  }, [clearTimer]);

  /* ---- Handle dialog close from Radix ---- */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        stopAndReset();
        onClose();
      }
    },
    [stopAndReset, onClose]
  );

  /* ---- Word reveal timer (effect subscribes to external timer, setState in callback) ---- */
  useEffect(() => {
    if (isPlaying && isOpen && poem) {
      timerRef.current = setInterval(() => {
        setRevealedWordCount((prev) => {
          if (prev >= totalWords) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, WORD_REVEAL_INTERVAL);
    }
    return clearTimer;
  }, [isPlaying, isOpen, poem, totalWords, clearTimer]);

  /* ---- Toggle play/pause ---- */
  const togglePlay = useCallback(() => {
    if (revealedWordCount >= totalWords && !isPlaying) {
      setRevealedWordCount(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [revealedWordCount, totalWords, isPlaying]);

  /* ---- Canvas waveform (demo mode) ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    const BAR_COUNT = 64;
    const barWidth = W / BAR_COUNT;
    const gap = 2;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      timeRef.current += 0.02;

      for (let i = 0; i < BAR_COUNT; i++) {
        const norm = i / BAR_COUNT;
        let height: number;

        if (isPlaying) {
          const centerDist = Math.abs(norm - 0.5) * 2;
          const bassFactor = 1 - centerDist * 0.6;
          const wave1 = Math.sin(timeRef.current * 2.5 + i * 0.3) * 0.4;
          const wave2 = Math.sin(timeRef.current * 1.8 + i * 0.15) * 0.3;
          const wave3 = Math.sin(timeRef.current * 4.0 + i * 0.5) * 0.15;
          const combined = (0.5 + wave1 + wave2 + wave3) * bassFactor;
          height = Math.max(4, combined * H * 0.85);
        } else {
          const wave = Math.sin(timeRef.current * 0.8 + i * 0.12) * 0.5 + 0.5;
          height = 4 + wave * 8;
        }

        const x = i * barWidth + gap / 2;
        const barH = Math.max(2, height);
        const y = (H - barH) / 2;

        const centerDist = Math.abs(norm - 0.5) * 2;
        const isBass = centerDist < 0.35;

        if (isPlaying) {
          ctx.fillStyle = isBass
            ? "rgba(201, 162, 39, 0.15)"
            : "rgba(201, 162, 39, 0.1)";
          ctx.fillRect(x - 1, y - 1, barWidth - gap + 2, barH + 2);

          ctx.fillStyle = isBass
            ? "rgba(201, 162, 39, 0.4)"
            : "rgba(201, 162, 39, 0.8)";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - gap, barH, 1.5);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(201, 162, 39, 0.2)";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - gap, barH, 1.5);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
    };
  }, [isPlaying]);

  /* ---- Render ---- */
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-void/95 backdrop-blur-xl" />
        <DialogContent
          showCloseButton={false}
          className={cn(
            "bg-stage border border-gold/15 rounded-2xl",
            "max-w-2xl w-[95%]",
            "p-6 md:p-10",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <DialogTitle className="sr-only">
            {poem?.title ?? "Voiced Canvas"}
          </DialogTitle>

          <AnimatePresence mode="wait">
            {poem && (
              <motion.div
                key={poem.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-col gap-6"
              >
                {/* Close button (top right) */}
                <div className="flex justify-end">
                  <DialogClose asChild>
                    <button
                      className={cn(
                        "inline-flex items-center justify-center size-8 rounded-full",
                        "border border-gold/15 text-silver/60",
                        "hover:text-gold hover:border-gold/40",
                        "transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                      )}
                      aria-label={t.voicedCanvas.close}
                    >
                      <X className="size-4" />
                    </button>
                  </DialogClose>
                </div>

                {/* Title */}
                <div className="text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs text-gold mb-3"
                    )}
                  >
                    <span aria-hidden="true">
                      {poem.lang === "en" ? "🇬🇧" : "🇨🇲"}
                    </span>
                    <span>{poem.lang.toUpperCase()}</span>
                  </span>
                  <h2 className="font-headline text-2xl text-gradient-gold">
                    {poem.title}
                  </h2>
                </div>

                {/* Canvas Visualizer */}
                <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-void/50 border border-gold/5">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    aria-hidden="true"
                  />
                </div>

                {/* Synchronized Text */}
                <div
                  className="min-h-[80px] font-body text-lg leading-relaxed text-center"
                  role="status"
                  aria-live="polite"
                >
                  {words.map((word, i) => (
                    <span
                      key={`${i}-${word}`}
                      className={cn(
                        "transition-colors duration-200",
                        i < revealedWordCount
                          ? "text-warm-white"
                          : "text-silver/30"
                      )}
                    >
                      {word}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-0.5 bg-gold/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.15, ease: "linear" }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    className={cn(
                      "inline-flex items-center justify-center size-12 rounded-full",
                      "border border-gold/30 bg-gold/10 text-gold",
                      "hover:bg-gold hover:text-void hover:border-gold",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                    )}
                    aria-label={
                      isPlaying
                        ? t.voicedCanvas.pause
                        : t.voicedCanvas.play
                    }
                  >
                    {isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5 ml-0.5" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}