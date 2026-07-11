"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Typewriter } from "@/components/animations/typewriter";
import { Waveform } from "@/components/animations/waveform";
import { LanguageToggle } from "@/components/sections/language-toggle";
import { ThemeToggle } from "@/components/sections/theme-toggle";
import { WhisperText } from "@/components/whispering-ink";

export function Hero() {
  const { t } = useI18n();
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect on the background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleTypewriterComplete = useCallback(() => {
    setSubtitleVisible(true);
  }, []);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = document.querySelector("#about");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero"
      suppressHydrationWarning
    >
      {/* Parallax background — simulated dark theater stage with spotlights */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 60% 50% at 50% 40%, var(--hero-spotlight-1) 0%, transparent 70%)",
              "radial-gradient(ellipse 40% 60% at 30% 50%, var(--hero-spotlight-2) 0%, transparent 60%)",
              "radial-gradient(ellipse 40% 60% at 70% 50%, var(--hero-spotlight-2) 0%, transparent 60%)",
              "radial-gradient(circle at 50% 80%, var(--hero-spotlight-3) 0%, transparent 50%)",
              "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-void) 100%)",
            ].join(", "),
          }}
        />
      </motion.div>

      {/* Bottom overlay gradient */}
      <div className="hero-overlay pointer-events-none absolute inset-0" />

      {/* Language toggle */}
      <LanguageToggle />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Small label: MISS BELLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-8 font-body text-xs uppercase tracking-[0.3em] text-gold sm:text-sm"
        >
          {t.brand.name}
        </motion.p>

        {/* Tagline — typewriter effect */}
        <div className="mb-6 min-h-[3rem] md:min-h-[4rem] lg:min-h-[5rem]">
          <Typewriter
            text={t.hero.tagline}
            speed={55}
            className="font-script text-xl text-gold gold-glow sm:text-2xl md:text-2xl lg:text-3xl"
            onComplete={handleTypewriterComplete}
          />
        </div>

        {/* Subtitle — fades in after typewriter completes */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={subtitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-10 font-headline text-sm italic text-silver sm:text-base md:text-lg"
        >
          <WhisperText>{t.hero.subtitle}</WhisperText>
        </motion.p>

        {/* Waveform */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <Waveform barCount={24} className="opacity-60" />
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href="#about"
          onClick={handleCtaClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          className="inline-block border border-gold/60 px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-gold
            transition-all duration-500 hover:border-champagne hover:bg-gold hover:text-void
            hover:shadow-[0_0_30px_rgba(201,162,39,0.2)] focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void sm:text-sm"
        >
          {t.hero.cta}
        </motion.a>
      </div>
    </section>
  );
}