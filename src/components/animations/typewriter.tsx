"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
}

export function Typewriter({
  text,
  speed = 50,
  className,
  cursorClassName = "cursor-blink",
  onComplete,
  as: Component = "p",
}: TypewriterProps) {
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // Wait for mount before starting animation to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const type = useCallback(() => {
    let index = 0;
    setDisplayText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    if (!mounted) return;
    const cleanup = type();
    return cleanup;
  }, [type, mounted]);

  const Tag = Component;

  return (
    <Tag className={className} aria-label={text}>
      {displayText}
      <span
        className={`${cursorClassName} inline-block ml-0.5 w-[2px] h-[1em] bg-gold align-middle`}
        aria-hidden="true"
      />
    </Tag>
  );
}