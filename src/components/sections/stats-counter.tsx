"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Flame, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

function useCountUp(target: number, isActive: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [isActive, target, duration]);

  return count;
}

interface StatItemProps {
  icon: React.ReactNode;
  target: number;
  suffix: string;
  label: string;
  isActive: boolean;
}

function StatItem({ icon, target, suffix, label, isActive }: StatItemProps) {
  const count = useCountUp(target, isActive);

  return (
    <StaggerItem className="flex flex-col items-center gap-3 text-center">
      <div className="text-gold">{icon}</div>
      <div className="font-headline text-4xl font-bold md:text-5xl text-gradient-gold">
        {count}
        {suffix}
      </div>
      <p className="font-body text-sm uppercase tracking-widest text-silver">
        {label}
      </p>
    </StaggerItem>
  );
}

const stats = [
  { key: "poemsPerformed" as const, target: 50, suffix: "+", icon: Mic },
  { key: "stagesLit" as const, target: 30, suffix: "+", icon: Flame },
  { key: "yearsOfVoice" as const, target: 8, suffix: "+", icon: Clock },
];

export default function StatsCounter() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20"
      aria-label="Artist statistics"
    >
      <FadeIn>
        <StaggerContainer className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 sm:grid-cols-3 sm:gap-12 md:gap-16">
          {stats.map((stat) => (
            <StatItem
              key={stat.key}
              icon={<stat.icon className="h-7 w-7" strokeWidth={1.5} />}
              target={stat.target}
              suffix={stat.suffix}
              label={t.stats[stat.key]}
              isActive={isActive}
            />
          ))}
        </StaggerContainer>
      </FadeIn>

      <div className="section-divider mt-16 md:mt-20" />
    </section>
  );
}