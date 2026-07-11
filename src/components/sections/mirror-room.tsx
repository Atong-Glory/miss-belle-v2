"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

/* ------------------------------------------------------------------ */
/*  Daily Prompts                                                      */
/* ------------------------------------------------------------------ */

const PROMPTS = [
  "Finish this thought: I painted my prayers on walls...",
  "What does the canvas of your heart look like today?",
  "Write about a silence that had weight.",
  "What would your grandmother's hands say if they could speak?",
  "Describe the rhythm of your hometown.",
  "What does freedom sound like in your mother tongue?",
  "Write a letter to the soil that raised you.",
  "What words do you carry that were never spoken?",
  "Describe a stage you've never performed on but feel you belong to.",
  "What does justice taste like?",
  "Write about the space between two languages.",
  "What would the mountains of Kom say to the city?",
  "Describe a memory that lives in your hands.",
  "What does love sound like when it has no words?",
  "Write about the fire that doesn't burn.",
  "What borders exist inside you?",
  "Describe the color of your oldest memory.",
  "What does the mic hear before you speak?",
  "Write about a name that carries a story.",
  "What echoes do you leave behind in a room?",
  "Describe the weight of an unspoken truth.",
  "What would your ancestors say about today?",
  "Write about light that comes from dark places.",
  "What does home sound like from far away?",
  "Describe a song that lives in your body.",
  "What does the earth remember about you?",
  "Write about a door you opened that changed everything.",
  "What does it mean to be a daughter of the soil?",
  "Describe the feeling after the last word is spoken.",
  "What does your voice look like?",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `missbelle-mirror-${y}-${m}-${d}`;
}

function getDailyPrompt(): string {
  return PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MirrorRoom() {
  const { t } = useI18n();
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(getTodayKey()) ?? "";
    } catch {
      return "";
    }
  });
  const [isDissolving, setIsDissolving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* -- Debounced save to localStorage -- */
  const persist = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      try {
        const key = getTodayKey();
        if (value.trim() === "") {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      } catch {
        // silent
      }
    }, 500);
  }, []);

  /* -- Cleanup debounce on unmount -- */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /* -- Handle text change -- */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setText(value);
      persist(value);
    },
    [persist],
  );

  /* -- Wipe the mirror with dissolve animation -- */
  const handleClear = useCallback(() => {
    if (text.trim() === "") return;
    setIsDissolving(true);
    setTimeout(() => {
      setText("");
      try {
        localStorage.removeItem(getTodayKey());
      } catch {
        // silent
      }
      setIsDissolving(false);
    }, 500);
  }, [text]);

  const dailyPrompt = getDailyPrompt();

  return (
    <section id="mirror-room" className="py-24 md:py-32 bg-curtain">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="space-y-10">
          {/* ---- Header ---- */}
          <StaggerItem className="text-center space-y-3">
            <FadeIn>
              <h2 className="font-headline text-3xl md:text-4xl text-gradient-gold">
                {t.mirrorRoom.title}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="font-headline text-silver italic text-lg">
                {t.mirrorRoom.subtitle}
              </p>
            </FadeIn>
          </StaggerItem>

          {/* ---- Daily Prompt ---- */}
          <StaggerItem>
            <FadeIn delay={0.2}>
              <div className="border border-gold/20 rounded-xl p-6 gold-border-glow text-center">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/60 mb-3">
                  {t.mirrorRoom.dailyPrompt}
                </p>
                <p className="font-script text-xl text-gold gold-glow">
                  &ldquo;{dailyPrompt}&rdquo;
                </p>
              </div>
            </FadeIn>
          </StaggerItem>

          {/* ---- Writing Area ---- */}
          <StaggerItem>
            <FadeIn delay={0.3}>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.textarea
                    key={isDissolving ? "dissolving" : "stable"}
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    placeholder={t.mirrorRoom.placeholder}
                    rows={8}
                    className={cn(
                      "mirror-text",
                      "bg-void/50 border border-gold/10 rounded-xl p-6",
                      "font-body text-warm-white text-lg leading-relaxed",
                      "resize-none w-full min-h-[250px]",
                      "placeholder:text-silver/30",
                      "focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20",
                      "transition-all duration-300",
                    )}
                    initial={
                      isDissolving
                        ? { opacity: 0, filter: "blur(8px)" }
                        : { opacity: 1, filter: "blur(0px)" }
                    }
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {/* Wipe Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={text.trim() === "" || isDissolving}
                  className={cn(
                    "absolute bottom-3 right-3",
                    "border border-gold/20 text-gold/60 text-sm px-4 py-2 rounded-lg",
                    "hover:border-gold/40 hover:text-gold hover:bg-gold/5",
                    "transition-all duration-300",
                    "disabled:opacity-30 disabled:pointer-events-none",
                  )}
                >
                  {t.mirrorRoom.clear}
                </button>
              </div>
            </FadeIn>
          </StaggerItem>

          {/* ---- Privacy Note ---- */}
          <StaggerItem>
            <FadeIn delay={0.4}>
              <p className="text-xs text-silver/40 text-center mt-4">
                {t.mirrorRoom.privacy}
              </p>
            </FadeIn>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}