"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Wind } from "lucide-react";
import { useWhisper } from "./whisper-context";
import { useI18n } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Collected Whispers Panel                                           */
/* ------------------------------------------------------------------ */

export function CollectedWhispers() {
  const { collected, panelOpen, togglePanel, releaseWhispers, totalCollected, lang } = useWhisper();
  const { t } = useI18n();
  const [releasing, setReleasing] = useState(false);

  const handleRelease = useCallback(() => {
    setReleasing(true);
    // Brief particle animation delay
    setTimeout(() => {
      releaseWhispers();
      setReleasing(false);
    }, 800);
  }, [releaseWhispers]);

  const sessionCount = collected.length;

  return (
    <>
      {/* ---- Toggle Button (bottom-right) ---- */}
      <button
        type="button"
        onClick={togglePanel}
        aria-label={t.whisperingInk.openPanel}
        className="whisper-panel-toggle group fixed bottom-24 right-5 z-[9990] flex items-center justify-center rounded-full border border-gold/30 bg-stage/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_20px_rgba(201,162,39,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
      >
        <Sparkles className="size-5 text-gold transition-transform duration-300 group-hover:rotate-12" />
        {sessionCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-void">
            {sessionCount}
          </span>
        )}
      </button>

      {/* ---- Panel ---- */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-40 right-5 z-[9995] flex max-h-[70vh] w-80 flex-col rounded-xl border border-gold/20 bg-stage/95 shadow-2xl backdrop-blur-md"
            role="dialog"
            aria-label={t.whisperingInk.panelTitle}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
              <div>
                <h3 className="font-headline text-sm text-gold">
                  {t.whisperingInk.panelTitle}
                </h3>
                <p className="mt-0.5 font-body text-[10px] text-silver/50">
                  {t.whisperingInk.lifetimeCount.replace("{count}", String(totalCollected))}
                </p>
              </div>
              <button
                type="button"
                onClick={togglePanel}
                aria-label={t.whisperingInk.closePanel}
                className="rounded-sm p-1 text-silver/40 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Whisper list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3">
              {releasing ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Wind className="size-8 text-gold/40 animate-pulse" />
                  <p className="mt-3 font-body text-xs text-silver/40 italic">
                    {t.whisperingInk.released}
                  </p>
                </div>
              ) : collected.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Sparkles className="size-8 text-gold/20" />
                  <p className="mt-3 font-body text-xs text-silver/40 italic">
                    {t.whisperingInk.emptyHint}
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {collected.map((w, i) => {
                    const text = w.lang === "fr" ? w.fr : w.en;
                    return (
                      <motion.div
                        key={w.id + "-" + w.collectedAt}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.03 }}
                        className="group/w border-b border-gold/5 py-3 last:border-0"
                      >
                        <p className="font-body text-xs leading-relaxed text-silver/80 italic">
                          &ldquo;{text}&rdquo;
                        </p>
                        <p className="mt-1 font-body text-[9px] uppercase tracking-widest text-gold/30">
                          {w.source}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer: Release button */}
            {collected.length > 0 && (
              <div className="border-t border-gold/10 px-5 py-3">
                <button
                  type="button"
                  onClick={handleRelease}
                  disabled={releasing}
                  className="w-full rounded-lg border border-crimson/30 bg-crimson/5 py-2 font-body text-xs uppercase tracking-widest text-crimson/70 transition-all duration-300 hover:border-crimson/60 hover:bg-crimson/10 hover:text-crimson disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
                >
                  {t.whisperingInk.releaseAll}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}