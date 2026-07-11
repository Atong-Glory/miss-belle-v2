"use client";

import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { WhisperText } from "@/components/whispering-ink";

export function About() {
  const { t } = useI18n();

  return (
    <section
      id="about"
      className="relative py-24 md:py-32"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <FadeIn className="mb-16 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-gold sm:text-sm">
            {t.about.sectionSubtitle}
          </p>
          <h2
            id="about-title"
            className="font-headline text-3xl text-gradient-gold sm:text-4xl md:text-5xl"
          >
            {t.about.sectionTitle}
          </h2>
        </FadeIn>

        {/* Two-column content */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: Portrait */}
          <FadeIn direction="left" delay={0.1} className="flex justify-center lg:justify-start">
            <div
              className="gold-border-glow aspect-[3/4] w-full max-w-sm rounded-lg border border-gold/20 transition-shadow duration-500 overflow-hidden relative"
            >
              {/* Portrait placeholder — replace with real Image component when portrait.jpg is available */}
              <div
                className="absolute inset-0"
                style={{
                  background: [
                    "linear-gradient(180deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.03) 40%, rgba(139,0,0,0.04) 100%)",
                    "radial-gradient(ellipse 50% 45% at 50% 35%, rgba(201,162,39,0.1) 0%, transparent 70%)",
                    "linear-gradient(180deg, var(--bg-stage) 0%, var(--bg-void) 100%)",
                  ].join(", "),
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-script text-4xl text-gold/20 select-none" aria-hidden="true">MB</span>
              </div>
            </div>
          </FadeIn>

          {/* Right column: Bio content — Whispering Ink enabled */}
          <div className="flex flex-col gap-6">
            <FadeIn delay={0.2}>
              <p className="font-body text-base leading-relaxed text-silver sm:text-lg">
                <WhisperText>{t.about.bio1}</WhisperText>
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <p className="font-body text-base leading-relaxed text-silver sm:text-lg">
                <WhisperText>{t.about.bio2}</WhisperText>
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <p className="font-body text-base leading-relaxed text-silver sm:text-lg">
                <WhisperText>{t.about.bio3}</WhisperText>
              </p>
            </FadeIn>

            {/* Tagline motif */}
            <FadeIn delay={0.65}>
              <p className="mt-8 font-script text-lg text-gold gold-glow sm:text-xl md:text-2xl">
                <WhisperText>{t.about.taglineMotif}</WhisperText>
              </p>
            </FadeIn>

            {/* WhatsApp contact */}
            <FadeIn delay={0.8}>
              <div className="mt-8">
                <p className="mb-4 font-body text-xs uppercase tracking-[0.2em] text-silver">
                  {t.about.socialLabel}
                </p>
                <a
                  href={t.whatsapp.tooltip ? `https://wa.me/?text=${encodeURIComponent(t.whatsapp.message)}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.whatsapp.tooltip}
                  className="inline-flex items-center gap-2 text-gold hover:text-champagne transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-void rounded-sm"
                >
                  <WhatsAppIcon className="size-5" />
                  <span className="font-body text-sm">WhatsApp</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider mx-auto mt-24 max-w-4xl md:mt-32" />
      </div>
    </section>
  );
}