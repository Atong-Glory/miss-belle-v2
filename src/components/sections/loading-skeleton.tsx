"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * PageSkeleton — Full-page loading skeleton that mirrors the main page layout.
 *
 * Sections: Hero → About → Performances
 * Uses gold-tinted shimmer backgrounds to match the dark theater design system.
 */
export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col" aria-hidden="true">
      {/* ── Hero skeleton ────────────────────────────────────────────── */}
      <div className="relative flex min-h-screen items-center justify-center">
        {/* Faint radial glow to echo the hero spotlight */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,162,39,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex flex-col items-center gap-5">
          {/* Small "SPOKEN WORD ARTIST" label */}
          <Skeleton className="h-3 w-36 rounded-sm bg-gold/10 sm:h-4 sm:w-44" />
          {/* Brand name */}
          <Skeleton className="h-10 w-60 rounded-sm bg-gold/10 sm:h-14 sm:w-80" />
          {/* Tagline */}
          <Skeleton className="h-4 w-48 rounded-sm bg-gold/8" />
          {/* CTA button */}
          <Skeleton className="mt-2 h-10 w-40 rounded-full bg-gold/10" />
        </div>
      </div>

      {/* ── Section divider ──────────────────────────────────────────── */}
      <div className="section-divider mx-auto w-full max-w-5xl" />

      {/* ── About skeleton ───────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32" aria-label="Loading about section">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section header */}
          <div className="mb-16 flex flex-col items-center gap-3">
            <Skeleton className="h-3 w-28 rounded-sm bg-gold/5 sm:h-4 sm:w-32" />
            <Skeleton className="h-8 w-52 rounded-sm bg-gold/10 sm:h-10 sm:w-72" />
          </div>

          {/* Two-column content */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Portrait placeholder */}
            <div className="flex justify-center lg:justify-start">
              <Skeleton className="aspect-[3/4] w-full max-w-sm rounded-lg border border-gold/10 bg-gold/5" />
            </div>

            {/* Right: Text lines */}
            <div className="flex flex-col justify-center gap-5">
              {/* Social icon row placeholder */}
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-8 w-8 rounded-full bg-gold/8"
                  />
                ))}
              </div>
              <Skeleton className="h-4 w-full rounded-sm bg-gold/5" />
              <Skeleton className="h-4 w-full rounded-sm bg-gold/5" />
              <Skeleton className="h-4 w-full rounded-sm bg-gold/5" />
              <Skeleton className="h-4 w-5/6 rounded-sm bg-gold/5" />
              <Skeleton className="h-4 w-3/4 rounded-sm bg-gold/5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section divider ──────────────────────────────────────────── */}
      <div className="section-divider mx-auto w-full max-w-5xl" />

      {/* ── Performances skeleton ────────────────────────────────────── */}
      <section className="relative py-24 md:py-32" aria-label="Loading performances section">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section header */}
          <div className="mb-12 flex flex-col items-center gap-3">
            <Skeleton className="h-3 w-28 rounded-sm bg-gold/5 sm:h-4 sm:w-36" />
            <Skeleton className="h-8 w-48 rounded-sm bg-gold/10 sm:h-10 sm:w-64" />
          </div>

          {/* Tabs bar placeholder */}
          <div className="mb-10 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-20 rounded-full bg-gold/6 sm:w-24"
              />
            ))}
          </div>

          {/* 3×2 card grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-gold/8 p-5">
                <Skeleton className="h-5 w-3/4 rounded-sm bg-gold/10" />
                <Skeleton className="h-3 w-1/2 rounded-sm bg-gold/6" />
                <div className="mt-1 flex gap-2">
                  <Skeleton className="h-5 w-14 rounded-full bg-gold/8" />
                  <Skeleton className="h-5 w-16 rounded-full bg-gold/8" />
                  <Skeleton className="h-5 w-12 rounded-full bg-gold/8" />
                </div>
                <Skeleton className="h-3 w-full rounded-sm bg-gold/4" />
                <Skeleton className="h-3 w-full rounded-sm bg-gold/4" />
                <Skeleton className="h-3 w-2/3 rounded-sm bg-gold/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}