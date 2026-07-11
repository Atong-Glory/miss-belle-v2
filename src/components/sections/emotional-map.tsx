"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { Shuffle, Compass } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MOODS = [
  "grief",
  "love",
  "rage",
  "hope",
  "longing",
  "faith",
  "identity",
  "freedom",
  "joy",
  "loss",
] as const;

type Mood = (typeof MOODS)[number];

const MOOD_TO_POEMS: Record<Mood, string[]> = {
  grief: ["6", "10"],
  love: ["4", "14"],
  rage: ["3", "13"],
  hope: ["1", "11"],
  longing: ["2", "7"],
  faith: ["1", "6", "8", "11"],
  identity: ["5", "7", "15"],
  freedom: ["3", "10"],
  joy: ["9", "12"],
  loss: ["7", "10"],
};

const POEMS = [
  {
    id: "1",
    title: "The Canvas Speaks",
    excerpt:
      "I painted my prayers on walls no one could see, and God turned them into galleries of grace...",
    lang: "en" as const,
    theme: "faith",
    format: "text" as const,
  },
  {
    id: "2",
    title: "L'Écho du Terroir",
    excerpt:
      "Mon cœur bat au rythme des tam-tams de mon village, un battement qui traverse les océans...",
    lang: "fr" as const,
    theme: "cameroon",
    format: "audio" as const,
  },
  {
    id: "3",
    title: "Threads of Iron",
    excerpt:
      "They said silence was golden, but I've seen what gold does to the hands that hold it while others starve...",
    lang: "en" as const,
    theme: "justice",
    format: "video" as const,
  },
  {
    id: "4",
    title: "Tu Es Lumière",
    excerpt:
      "Dans l'obscurité de tes doutes, j'ai trouvé la clé de ta lumière, une lumière qui ne s'éteint jamais...",
    lang: "fr" as const,
    theme: "love",
    format: "text" as const,
  },
  {
    id: "5",
    title: "Daughter of the Soil",
    excerpt:
      "My grandmother's name is written in the lines of my palms, in the way I hold the mic like she held her hoe...",
    lang: "en" as const,
    theme: "identity",
    format: "video" as const,
  },
  {
    id: "6",
    title: "Le Cri Silencieux",
    excerpt:
      "Même dans le silence, Dieu entend le murmure d'un cœur qui cherche...",
    lang: "fr" as const,
    theme: "faith",
    format: "audio" as const,
  },
  {
    id: "7",
    title: "When the Soil Remembers",
    excerpt:
      "The earth holds memory in its cracks, and I am the daughter who reads them like scripture written before time...",
    lang: "en" as const,
    theme: "identity",
    format: "text" as const,
  },
  {
    id: "8",
    title: "Les Racines du Ciel",
    excerpt:
      "Ses racines plongent dans le ciel, un arbre à l'envers dont les feuilles sont des prières...",
    lang: "fr" as const,
    theme: "faith",
    format: "audio" as const,
  },
  {
    id: "9",
    title: "Bamenda to Buea",
    excerpt:
      "From the highlands to the coast, every mile is a stanza, every town a verse in the poem of home...",
    lang: "en" as const,
    theme: "cameroon",
    format: "video" as const,
  },
  {
    id: "10",
    title: "Le Prix du Silence",
    excerpt:
      "Le silence a un prix que seuls les pauvres paient, assis dans l'ombre d'une justice qui ne vient jamais...",
    lang: "fr" as const,
    theme: "justice",
    format: "text" as const,
  },
  {
    id: "11",
    title: "Psalm of the Mic",
    excerpt:
      "Lord, make me an instrument of your rhythm. Let every syllable land like a seed on good soil...",
    lang: "en" as const,
    theme: "faith",
    format: "audio" as const,
  },
  {
    id: "12",
    title: "Cœur de Kom",
    excerpt:
      "Au cœur de Kom, les tambours parlent une langue que les mots ne peuvent pas traduire...",
    lang: "fr" as const,
    theme: "cameroon",
    format: "text" as const,
  },
  {
    id: "13",
    title: "The Weight of Words",
    excerpt:
      "They told me words are cheap, so I made mine expensive — every poem costs me a piece of my peace...",
    lang: "en" as const,
    theme: "justice",
    format: "video" as const,
  },
  {
    id: "14",
    title: "Amour Sans Frontières",
    excerpt:
      "L'amour ne connaît ni frontières ni passeports, il voyage dans le souffle d'un poème...",
    lang: "fr" as const,
    theme: "love",
    format: "audio" as const,
  },
  {
    id: "15",
    title: "Stage of Ancestors",
    excerpt:
      "I stand on a stage built by people whose names I cannot pronounce, and I speak their language fluently...",
    lang: "en" as const,
    theme: "identity",
    format: "text" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Mood Button                                                        */
/* ------------------------------------------------------------------ */

function MoodButton({
  mood,
  label,
  isSelected,
  onClick,
  index,
}: {
  mood: Mood;
  label: string;
  isSelected: boolean;
  onClick: (mood: Mood) => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(mood)}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        isSelected
          ? "bg-gold/10 text-gold border-gold/50 shadow-[0_0_20px_rgba(201,162,39,0.15)] scale-105"
          : "border-gold/15 text-silver hover:text-gold hover:border-gold/40"
      )}
      aria-pressed={isSelected}
      aria-label={`Filter by ${label}`}
    >
      {label}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Poem Card                                                          */
/* ------------------------------------------------------------------ */

function PoemCard({
  poem,
  activeMood,
  moodLabel,
}: {
  poem: (typeof POEMS)[number];
  activeMood: Mood | null;
  moodLabel: string;
}) {
  const formatIcon = {
    text: "📝",
    audio: "🎙️",
    video: "🎬",
  } as const;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "group relative rounded-xl bg-stage border border-gold/10 p-5 flex flex-col gap-3",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,0.08)] hover:border-gold/25"
      )}
    >
      {/* Top row: language flag + format icon */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs text-gold"
          )}
        >
          <span aria-hidden="true">{poem.lang === "en" ? "🇬🇧" : "🇨🇲"}</span>
          <span className="ml-0.5">{poem.lang.toUpperCase()}</span>
        </span>
        <span className="text-xs text-silver" aria-hidden="true">
          {formatIcon[poem.format]}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-headline text-lg text-warm-white leading-snug">
        {poem.title}
      </h3>

      {/* Mood tag pill */}
      {activeMood && (
        <span className="inline-block self-start rounded-full border border-gold/20 bg-gold/5 px-3 py-0.5 text-xs font-medium text-gold">
          {moodLabel}
        </span>
      )}

      {/* Excerpt */}
      <p className="text-silver text-sm leading-relaxed line-clamp-3">
        {poem.excerpt}
      </p>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function EmotionalMap() {
  const { t } = useI18n();
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  const handleMoodSelect = useCallback((mood: Mood) => {
    setActiveMood((prev) => (prev === mood ? null : mood));
  }, []);

  const handleAllMoods = useCallback(() => {
    setActiveMood(null);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const moods = MOODS[Math.floor(Math.random() * MOODS.length)];
    setActiveMood(moods);
  }, []);

  const filteredPoems = useMemo(() => {
    if (!activeMood) return POEMS;
    const ids = MOOD_TO_POEMS[activeMood];
    return POEMS.filter((p) => ids.includes(p.id));
  }, [activeMood]);

  return (
    <section
      id="emotional-map"
      className="py-24 md:py-32"
      aria-labelledby="emotional-map-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-4">
              <Compass className="size-5 text-gold/60" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.25em] text-silver/60 font-body">
                {t.emotionalMap.subtitle}
              </span>
              <Compass className="size-5 text-gold/60" aria-hidden="true" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2
              id="emotional-map-title"
              className="font-headline text-3xl md:text-4xl text-gradient-gold"
            >
              {t.emotionalMap.title}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-3 font-headline text-silver italic text-lg">
              {t.emotionalMap.subtitle}
            </p>
          </FadeIn>
        </div>

        {/* Compass / Mood Selector */}
        <FadeIn delay={0.3} once>
          <div className="mb-10">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
              {MOODS.map((mood, i) => (
                <MoodButton
                  key={mood}
                  mood={mood}
                  label={t.emotionalMap.moods[mood]}
                  isSelected={activeMood === mood}
                  onClick={handleMoodSelect}
                  index={i}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={handleAllMoods}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-gold/20 px-5 py-2 text-sm font-medium",
                  "text-silver hover:text-gold hover:border-gold/40",
                  "transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  !activeMood && "text-gold border-gold/40 bg-gold/5"
                )}
                aria-label={t.emotionalMap.allMoods}
              >
                {t.emotionalMap.allMoods}
              </button>

              <button
                onClick={handleSurpriseMe}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-crimson/30 px-5 py-2 text-sm font-medium",
                  "text-crimson hover:bg-crimson hover:text-white hover:border-crimson",
                  "transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
                )}
                aria-label={t.emotionalMap.surpriseMe}
              >
                <Shuffle className="size-4" aria-hidden="true" />
                {t.emotionalMap.surpriseMe}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Filtered Poem Cards */}
        <div className="min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {filteredPoems.length > 0 ? (
              <motion.div
                key={activeMood ?? "all"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredPoems.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    activeMood={activeMood}
                    moodLabel={
                      activeMood
                        ? t.emotionalMap.moods[activeMood]
                        : ""
                    }
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-4 text-gold/20">
                  <Compass className="size-12 mx-auto" aria-hidden="true" />
                </div>
                <p className="text-silver/60 font-body text-sm">
                  {t.emotionalMap.noMatch}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section divider */}
        <div className="section-divider mt-24" role="separator" />
      </div>
    </section>
  );
}