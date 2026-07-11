"use client";

import { useEffect, useState } from "react";

interface WaveformBarProps {
  barCount?: number;
  className?: string;
}

export function Waveform({ barCount = 24, className = "" }: WaveformBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex items-center justify-center gap-[3px] h-8 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const isCenter = Math.abs(i - barCount / 2) < barCount / 4;
        const baseHeight = isCenter ? 20 : 8;
        const height = baseHeight + Math.sin(i * 0.5) * 8;
        const duration = 0.8 + Math.random() * 0.8;
        const delay = Math.random() * 1.2;

        return (
          <div
            key={i}
            className="waveform-bar w-[2px] rounded-full bg-gold/40"
            style={{
              "--wave-height": `${height}px`,
              "--wave-duration": `${duration}s`,
              "--wave-delay": `${delay}s`,
              height: mounted ? undefined : "4px",
              opacity: mounted ? 0.4 + (isCenter ? 0.4 : 0) : 0.3,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}