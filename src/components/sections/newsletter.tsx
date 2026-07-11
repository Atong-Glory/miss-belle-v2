"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";

export default function NewsletterSection() {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setEmail("");
    setConsent(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!consent) return;

      setIsSubmitting(true);

      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, consent }),
        });

        if (!res.ok) throw new Error("Newsletter subscription failed");

        toast.success(t.newsletter.success);
        resetForm();
      } catch {
        toast.error(t.newsletter.error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, consent, t, resetForm],
  );

  return (
    <section
      id="newsletter"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-xl mx-auto text-center">
        <FadeIn>
          {/* ---- Header ---- */}
          <h2
            id="newsletter-title"
            className="font-headline text-gradient-gold text-3xl md:text-4xl mb-4"
          >
            {t.newsletter.sectionTitle}
          </h2>
          <p className="text-silver italic text-lg mb-3">
            {t.newsletter.sectionSubtitle}
          </p>
          <p className="text-silver/80 font-body text-sm leading-relaxed mb-10 max-w-md mx-auto">
            {t.newsletter.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ---- Email input ---- */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-silver pointer-events-none"
                aria-hidden="true"
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.emailPlaceholder}
                required
                aria-label={t.newsletter.emailPlaceholder}
                className="pl-10 bg-stage border-gold/20 text-warm-white placeholder:text-silver/60 focus-visible:border-gold focus-visible:ring-gold/30 h-11 text-base"
              />
            </div>

            {/* ---- Consent checkbox ---- */}
            <div className="flex items-start gap-3 text-left">
              <Checkbox
                id="newsletter-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                aria-required="true"
              />
              <Label
                htmlFor="newsletter-consent"
                className="text-silver/80 text-sm font-body leading-relaxed cursor-pointer select-none"
              >
                {t.newsletter.consent}
              </Label>
            </div>

            {/* ---- Submit ---- */}
            <Button
              type="submit"
              disabled={isSubmitting || !consent}
              className="w-full h-11 text-sm font-headline tracking-wide bg-gold text-void hover:bg-champagne focus-visible:ring-gold/50 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>{t.newsletter.submitting}</span>
                </>
              ) : (
                <span>{t.newsletter.submit}</span>
              )}
            </Button>
          </form>
        </FadeIn>
      </div>

      {/* ---- Divider ---- */}
      <div className="section-divider mt-24 md:mt-32 max-w-xl mx-auto" />
    </section>
  );
}