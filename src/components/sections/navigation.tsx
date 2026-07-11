"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

export function Navigation() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navItems: NavItem[] = useMemo(
    () => [
      { label: t.nav.about, href: "#about" },
      { label: t.nav.performances, href: "#performances" },
      { label: t.nav.testimonials, href: "#testimonials" },
      { label: t.nav.gallery, href: "#gallery" },
      { label: t.nav.originThread, href: "#origin-thread" },
      { label: t.nav.mirrorRoom, href: "#mirror-room" },
      { label: t.nav.booking, href: "#booking" },
    ],
    [t.nav]
  );

  // Show/hide nav based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-40 border-b border-gold/10 bg-void/80 backdrop-blur-xl"
          role="banner"
        >
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
            aria-label="Main navigation"
          >
            {/* Left: Brand */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="font-headline text-lg tracking-wider text-gold transition-colors hover:text-champagne"
            >
              {t.brand.name}
            </a>

            {/* Right: Desktop nav links */}
            <ul className="hidden items-center gap-8 md:flex" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative font-body text-sm uppercase tracking-widest transition-colors duration-300 ${
                      activeSection === item.href.replace("#", "")
                        ? "text-gold"
                        : "text-silver hover:text-champagne"
                    }`}
                  >
                    {item.label}
                    {/* Gold underline for active link */}
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                      initial={false}
                      animate={{
                        scaleX:
                          activeSection === item.href.replace("#", "") ? 1 : 0,
                        opacity:
                          activeSection === item.href.replace("#", "") ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile: Hamburger menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label={t.a11y.openMenu}
                    className="rounded-sm p-2 text-silver transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                  >
                    <Menu className="size-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 border-gold/10 bg-void/95 backdrop-blur-xl"
                >
                  <SheetHeader>
                    <SheetTitle className="font-headline text-lg tracking-wider text-gold">
                      {t.brand.name}
                    </SheetTitle>
                  </SheetHeader>
                  <ul className="mt-8 flex flex-col gap-6 px-4" role="list">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={`block font-body text-base uppercase tracking-widest transition-colors duration-300 ${
                              activeSection === item.href.replace("#", "")
                                ? "text-gold"
                                : "text-silver hover:text-champagne"
                            }`}
                          >
                            {item.label}
                          </a>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}