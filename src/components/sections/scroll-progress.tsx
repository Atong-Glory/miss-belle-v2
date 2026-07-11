"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        setProgress(scrolled);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] w-full"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-gold transition-shadow duration-300 ease-out"
        style={{
          width: `${progress * 100}%`,
          boxShadow:
            progress > 0.8
              ? "0 0 8px rgba(201, 162, 39, 0.6), 0 0 20px rgba(201, 162, 39, 0.3)"
              : "none",
        }}
      />
    </div>
  );
}