"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { WhisperText } from "@/components/whispering-ink";

type Theme = "faith" | "love" | "justice" | "identity" | "cameroon";
type Format = "text" | "video" | "audio";
type Season = "2024" | "2023" | "2025";
type Lang = "en" | "fr";

interface PerformanceItem {
  id: string;
  title: string;
  lang: Lang;
  theme: Theme;
  format: Format;
  season: Season;
  excerpt: string;
}

const LANG_FLAG: Record<Lang, string> = { en: "🇬🇧", fr: "🇨🇲" };

/* ------------------------------------------------------------------ */
/*  Spotlight mouse tracking hook                                     */
/* ------------------------------------------------------------------ */
function useSpotlight() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Performance Card                                                   */
/* ------------------------------------------------------------------ */
function PerformanceCard({
  item,
  themeName,
  formatName,
  experienceLabel,
  collapseLabel,
  expandLabel,
  shareLabel,
  shareWhatsAppLabel,
  shareTwitterLabel,
  shareFacebookLabel,
}: {
  item: PerformanceItem;
  themeName: string;
  formatName: string;
  experienceLabel: string;
  collapseLabel: string;
  expandLabel: string;
  shareLabel: string;
  shareWhatsAppLabel: string;
  shareTwitterLabel: string;
  shareFacebookLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const handleSpotlight = useSpotlight();

  return (
    <StaggerItem>
      <article
        onMouseMove={handleSpotlight}
        className={cn(
          "spotlight-card group relative rounded-xl",
          "bg-stage border border-gold/10",
          "p-5 flex flex-col gap-4",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,0.08)]",
          "hover:border-gold/25"
        )}
      >
        {/* Top badges row */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs text-gold"
            aria-label={item.lang === "en" ? "English" : "Français"}
          >
            <span aria-hidden="true">{LANG_FLAG[item.lang]}</span>
            <span className="ml-0.5">{item.lang.toUpperCase()}</span>
          </span>
          <span className="text-xs text-silver">{formatName}</span>
        </div>

        {/* Title */}
        <h3 className="relative z-10 font-headline text-lg text-warm-white leading-snug">
          {item.title}
        </h3>

        {/* Theme tag */}
        <div className="relative z-10">
          <span className="inline-block rounded-full bg-gold px-3 py-0.5 text-xs font-medium text-void">
            {themeName}
          </span>
        </div>

        {/* Excerpt */}
        <p
          className={cn(
            "relative z-10 text-silver text-sm leading-relaxed transition-all duration-300",
            expanded ? "line-clamp-none" : "line-clamp-3"
          )}
          aria-expanded={expanded}
        >
          <WhisperText>{item.excerpt}</WhisperText>
        </p>

        {/* Experience button */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            "relative z-10 mt-auto self-start",
            "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
            "border border-gold/30 text-gold",
            "transition-all duration-200",
            "hover:bg-gold hover:text-void hover:border-gold",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          )}
          aria-expanded={expanded}
        >
          {expanded ? collapseLabel : expandLabel}
          <svg
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Share buttons */}
        <div className="relative z-10 mt-2 flex items-center gap-2">
          <span className="text-xs text-silver mr-1">{shareLabel}</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(item.title + ' — ' + item.excerpt)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={shareWhatsAppLabel}
            className="text-gold/40 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm p-1"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title + ' — Miss Belle')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={shareTwitterLabel}
            className="text-gold/40 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm p-1"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(item.title + ' — Miss Belle')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={shareFacebookLabel}
            className="text-gold/40 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm p-1"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </article>
    </StaggerItem>
  );
}

/* ------------------------------------------------------------------ */
/*  Grouped Grid                                                       */
/* ------------------------------------------------------------------ */
function GroupedGrid({
  groups,
  getThemeName,
  getFormatName,
  experienceLabel,
  collapseLabel,
  expandLabel,
  shareLabel,
  shareWhatsAppLabel,
  shareTwitterLabel,
  shareFacebookLabel,
}: {
  groups: { key: string; label: string; items: PerformanceItem[] }[];
  getThemeName: (theme: Theme) => string;
  getFormatName: (format: Format) => string;
  experienceLabel: string;
  collapseLabel: string;
  expandLabel: string;
  shareLabel: string;
  shareWhatsAppLabel: string;
  shareTwitterLabel: string;
  shareFacebookLabel: string;
}) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.key}>
          <FadeIn once>
            <h3 className="mb-5 font-headline text-xl text-gold gold-glow">
              {group.label}
            </h3>
          </FadeIn>
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.08}
          >
            {group.items.map((item) => (
              <PerformanceCard
                key={item.id}
                item={item}
                themeName={getThemeName(item.theme)}
                formatName={getFormatName(item.format)}
                experienceLabel={experienceLabel}
                collapseLabel={collapseLabel}
                expandLabel={expandLabel}
                shareLabel={shareLabel}
                shareWhatsAppLabel={shareWhatsAppLabel}
                shareTwitterLabel={shareTwitterLabel}
                shareFacebookLabel={shareFacebookLabel}
              />
            ))}
          </StaggerContainer>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */
export default function PerformancesSection() {
  const { t } = useI18n();
  const items = t.performances.items as unknown as PerformanceItem[];

  const getThemeName = useCallback(
    (theme: Theme) => t.performances.themes[theme],
    [t]
  );
  const getFormatName = useCallback(
    (format: Format) => t.performances.formats[format],
    [t]
  );
  const getSeasonName = useCallback(
    (season: Season) => t.performances.seasons[season],
    [t]
  );

  /* Grouping helpers */
  const groupBy = useCallback(
    <K extends string>(
      keyFn: (item: PerformanceItem) => K,
      labelFn: (key: K) => string
    ) => {
      const map = new Map<K, PerformanceItem[]>();
      for (const item of items) {
        const k = keyFn(item);
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(item);
      }
      return Array.from(map.entries()).map(([key, groupItems]) => ({
        key,
        label: labelFn(key),
        items: groupItems,
      }));
    },
    [items]
  );

  const byFlame = groupBy<Theme>(
    (i) => i.theme,
    (theme) => getThemeName(theme)
  );

  const byStage = groupBy<Format>(
    (i) => i.format,
    (format) => getFormatName(format)
  );

  const bySeason = groupBy<Season>(
    (i) => i.season,
    (season) => getSeasonName(season)
  );

  return (
    <section id="performances" className="py-24 md:py-32" aria-labelledby="performances-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <FadeIn>
            <h2 id="performances-title" className="font-headline text-3xl md:text-4xl text-gradient-gold">
              {t.performances.sectionTitle}
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 font-headline text-silver italic text-lg">
              {t.performances.sectionSubtitle}
            </p>
          </FadeIn>
        </div>

        {/* Tabs */}
        <FadeIn delay={0.25} once>
          <Tabs defaultValue="flame" className="w-full">
            <TabsList
              className={cn(
                "mx-auto flex h-auto gap-0 rounded-none border-b border-gold/15 bg-transparent p-0",
                "w-fit"
              )}
            >
              {(
                [
                  { value: "flame", label: t.performances.tabByFlame },
                  { value: "stage", label: t.performances.tabByStage },
                  { value: "season", label: t.performances.tabBySeason },
                ] as const
              ).map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "relative rounded-none border-0 bg-transparent px-5 py-3 text-sm font-medium text-silver",
                    "transition-colors duration-200",
                    "hover:text-gold",
                    "data-[state=active]:text-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:origin-left",
                    "data-[state=active]:after:scale-x-100"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="flame" className="mt-8">
              <GroupedGrid
                groups={byFlame}
                getThemeName={getThemeName}
                getFormatName={getFormatName}
                experienceLabel={t.performances.experienceThis}
                collapseLabel={t.a11y.collapsePoem}
                expandLabel={t.a11y.expandPoem}
                shareLabel={t.performances.sharePoem}
                shareWhatsAppLabel={t.a11y.shareWhatsApp}
                shareTwitterLabel={t.a11y.shareTwitter}
                shareFacebookLabel={t.a11y.shareFacebook}
              />
            </TabsContent>

            <TabsContent value="stage" className="mt-8">
              <GroupedGrid
                groups={byStage}
                getThemeName={getThemeName}
                getFormatName={getFormatName}
                experienceLabel={t.performances.experienceThis}
                collapseLabel={t.a11y.collapsePoem}
                expandLabel={t.a11y.expandPoem}
                shareLabel={t.performances.sharePoem}
                shareWhatsAppLabel={t.a11y.shareWhatsApp}
                shareTwitterLabel={t.a11y.shareTwitter}
                shareFacebookLabel={t.a11y.shareFacebook}
              />
            </TabsContent>

            <TabsContent value="season" className="mt-8">
              <GroupedGrid
                groups={bySeason}
                getThemeName={getThemeName}
                getFormatName={getFormatName}
                experienceLabel={t.performances.experienceThis}
                collapseLabel={t.a11y.collapsePoem}
                expandLabel={t.a11y.expandPoem}
                shareLabel={t.performances.sharePoem}
                shareWhatsAppLabel={t.a11y.shareWhatsApp}
                shareTwitterLabel={t.a11y.shareTwitter}
                shareFacebookLabel={t.a11y.shareFacebook}
              />
            </TabsContent>
          </Tabs>
        </FadeIn>

        {/* Section divider */}
        <div className="section-divider mt-24" role="separator" />
      </div>
    </section>
  );
}