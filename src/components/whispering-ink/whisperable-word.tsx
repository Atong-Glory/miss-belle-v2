"use client";

import { useState, useCallback, useRef, type MouseEvent } from "react";
import { useWhisper } from "./whisper-context";
import { WORD_EMOTION_MAP, type WhisperEmotion } from "./whisper-data";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface WhisperableWordProps {
  children: string;
  /** Optional: force a specific emotion instead of auto-detecting */
  emotion?: WhisperEmotion;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Utility: check if a word is whisperable                           */
/* ------------------------------------------------------------------ */

export function isWhisperable(word: string): boolean {
  const w = word.toLowerCase().replace(/[.,!?;:'"()]/g, "");
  for (const key of Object.keys(WORD_EMOTION_MAP)) {
    if (w === key || w.includes(key) || key.includes(w)) return true;
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WhisperableWord({ children, emotion, className = "" }: WhisperableWordProps) {
  const { triggerWhisper } = useWhisper();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      triggerWhisper(children, {
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [triggerWhisper, children],
  );

  return (
    <span
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as unknown as MouseEvent);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "whisperable-word",
        hovered ? "whisperable-word--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${children} — click to reveal a hidden whisper`}
    >
      {children}
    </span>
  );
}