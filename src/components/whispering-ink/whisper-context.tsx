"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { type WhisperEntry, findWhisper, type WhisperEmotion, WORD_EMOTION_MAP } from "./whisper-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CollectedWhisper extends WhisperEntry {
  collectedAt: number; // timestamp
  lang: "en" | "fr";
}

interface WhisperContextValue {
  /** Currently floating whisper (or null) */
  activeWhisper: WhisperEntry | null;
  /** Position of the clicked word [x, y] */
  whisperPosition: { x: number; y: number } | null;
  /** All collected whispers in this session */
  collected: CollectedWhisper[];
  /** Total whispers collected across all sessions */
  totalCollected: number;
  /** Whether the collection panel is open */
  panelOpen: boolean;
  /** Current language */
  lang: "en" | "fr";
  /** Trigger a whisper for a word */
  triggerWhisper: (word: string, position: { x: number; y: number }) => void;
  /** Dismiss the floating whisper */
  dismissWhisper: () => void;
  /** Open/close the collection panel */
  togglePanel: () => void;
  /** Release all collected whispers (particle effect) */
  releaseWhispers: () => void;
  /** Set language (called from parent i18n) */
  setLang: (lang: "en" | "fr") => void;
  /** Aura color based on total collected across sessions */
  auraColor: string;
}

const WhisperContext = createContext<WhisperContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  AURA COLOR — shifts based on total collected whispers              */
/* ------------------------------------------------------------------ */

function getAuraColor(total: number): string {
  if (total === 0) return "rgba(100, 120, 180, 0.15)"; // cold blue — newcomer
  if (total < 5) return "rgba(160, 140, 100, 0.25)";  // warm amber
  if (total < 15) return "rgba(201, 162, 39, 0.35)";  // gold — regular
  return "rgba(75, 50, 130, 0.4)";                      // deep indigo — devoted
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "missbelle-whispers-total";

export function WhisperProvider({ children, lang: initialLang }: { children: ReactNode; lang: "en" | "fr" }) {
  const [activeWhisper, setActiveWhisper] = useState<WhisperEntry | null>(null);
  const [whisperPosition, setWhisperPosition] = useState<{ x: number; y: number } | null>(null);
  const [collected, setCollected] = useState<CollectedWhisper[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [lang, setLang] = useState(initialLang);

  // Load total from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTotalCollected(parseInt(saved, 10) || 0);
    } catch { /* localStorage unavailable */ }
  }, []);

  // Persist total when it changes
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(totalCollected)); } catch { /* */ }
  }, [totalCollected]);

  // Sync lang from parent
  useEffect(() => { setLang(initialLang); }, [initialLang]);

  const triggerWhisper = useCallback(
    (word: string, position: { x: number; y: number }) => {
      const normalized = word.toLowerCase().trim();

      // Look up emotion from word map
      let emotion: WhisperEmotion = "faith"; // default fallback
      for (const [w, e] of Object.entries(WORD_EMOTION_MAP)) {
        if (normalized.includes(w) || w.includes(normalized)) {
          emotion = e;
          break;
        }
      }

      const whisper = findWhisper(emotion, lang);
      setActiveWhisper(whisper);
      setWhisperPosition(position);
      setCollected((prev) => [
        { ...whisper, collectedAt: Date.now(), lang },
        ...prev,
      ]);
      setTotalCollected((prev) => prev + 1);

      // Auto-dismiss after 4s
      setTimeout(() => {
        setActiveWhisper(null);
        setWhisperPosition(null);
      }, 4000);
    },
    [lang],
  );

  const dismissWhisper = useCallback(() => {
    setActiveWhisper(null);
    setWhisperPosition(null);
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => !prev);
  }, []);

  const releaseWhispers = useCallback(() => {
    setCollected([]);
    setPanelOpen(false);
  }, []);

  const auraColor = getAuraColor(totalCollected);

  return (
    <WhisperContext.Provider
      value={{
        activeWhisper,
        whisperPosition,
        collected,
        totalCollected,
        panelOpen,
        lang,
        triggerWhisper,
        dismissWhisper,
        togglePanel,
        releaseWhispers,
        setLang,
        auraColor: auraColor, // expose for external use
      }}
    >
      {children}
    </WhisperContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useWhisper() {
  const ctx = useContext(WhisperContext);
  if (!ctx) throw new Error("useWhisper must be used within <WhisperProvider>");
  return ctx;
}