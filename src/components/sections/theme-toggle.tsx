"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useI18n();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = useCallback(() => {
    // Add transition class for smooth theme switch
    const html = document.documentElement;
    html.classList.add("theme-transition");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    // Remove transition class after animation completes
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      html.classList.remove("theme-transition");
    }, 400);
  }, [resolvedTheme, setTheme]);

  // Prevent flash of wrong icon
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!mounted}
      aria-label={mounted ? (isDark ? t.a11y.switchToLight : t.a11y.switchToDark) : t.a11y.toggleTheme}
      className="fixed top-6 right-24 z-50 flex items-center justify-center
        w-9 h-9 rounded-full
        border border-gold/30
        bg-void/80 backdrop-blur-sm
        font-body text-gold
        transition-all duration-300
        hover:border-champagne/50 hover:text-champagne hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
        disabled:opacity-0"
      suppressHydrationWarning
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )
      ) : (
        <span className="w-4 h-4" />
      )}
    </button>
  );
}