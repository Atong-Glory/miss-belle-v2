"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWhisper } from "./whisper-context";

/* ------------------------------------------------------------------ */
/*  Floating Whisper — appears near the clicked word & fades out      */
/* ------------------------------------------------------------------ */

export function WhisperFloat() {
  const { activeWhisper, whisperPosition, dismissWhisper, lang } = useWhisper();
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!whisperPosition) return;

    // Clamp to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelW = 320;
    const panelH = 120;
    let x = whisperPosition.x - panelW / 2;
    let y = whisperPosition.y - panelH - 16;

    if (x < 12) x = 12;
    if (x + panelW > vw - 12) x = vw - panelW - 12;
    if (y < 12) y = whisperPosition.y + 24; // flip below if no room above

    setStyle({ left: x, top: y, position: "fixed", zIndex: 9998, width: panelW });
  }, [whisperPosition]);

  // Click outside to dismiss
  useEffect(() => {
    if (!activeWhisper) return;
    const handler = () => dismissWhisper();
    const timer = setTimeout(() => document.addEventListener("click", handler), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handler);
    };
  }, [activeWhisper, dismissWhisper]);

  if (!activeWhisper || !whisperPosition) return null;

  const text = lang === "fr" ? activeWhisper.fr : activeWhisper.en;

  return (
    <AnimatePresence>
      <motion.div
        key={activeWhisper.id + "-" + Date.now()}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={style}
        className="whisper-float pointer-events-auto rounded-lg border border-gold/20 bg-stage/95 px-5 py-4 shadow-lg backdrop-blur-md"
        role="status"
        aria-live="polite"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent dot */}
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-gold whisper-glow-dot" />
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold/60">
            {activeWhisper.source}
          </span>
        </div>
        <p className="font-headline text-sm leading-relaxed text-warm-white/90 italic">
          &ldquo;{text}&rdquo;
        </p>
      </motion.div>
    </AnimatePresence>
  );
}