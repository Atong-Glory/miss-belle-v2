"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { FadeIn } from "@/components/animations/fade-in";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Landmark,
  Mic,
  Building2,
  Users,
  Sparkles,
  Music,
  Volume2,
  Flame,
  Crown,
  CalendarDays,
  Loader2,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EventType = "wedding" | "church" | "slam" | "corporate" | "private" | "other";
type BudgetTier = "whisper" | "voice" | "roar" | "legend";
type SeasonKey = "spring" | "summer" | "autumn" | "winter";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EVENT_OPTIONS: { key: EventType; icon: typeof Heart }[] = [
  { key: "wedding", icon: Heart },
  { key: "church", icon: Landmark },
  { key: "slam", icon: Mic },
  { key: "corporate", icon: Building2 },
  { key: "private", icon: Users },
  { key: "other", icon: Sparkles },
];

const BUDGET_OPTIONS: {
  key: BudgetTier;
  icon: typeof Music;
  glowClass: string;
}[] = [
  { key: "whisper", icon: Music, glowClass: "" },
  { key: "voice", icon: Volume2, glowClass: "" },
  { key: "roar", icon: Flame, glowClass: "gold-border-glow" },
  { key: "legend", icon: Crown, glowClass: "gold-glow-strong" },
];

function getSeason(month: number): SeasonKey | null {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BookingSection() {
  const { t } = useI18n();

  /* ---- form state ---- */
  const [eventType, setEventType] = useState<EventType | "">("");
  const [date, setDate] = useState("");
  const [budgetTier, setBudgetTier] = useState<BudgetTier | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");

  /* ---- ui state ---- */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---- derived ---- */
  const selectedMonth = date ? new Date(date + "T00:00:00").getMonth() + 1 : 0;
  const season: SeasonKey | null = selectedMonth ? getSeason(selectedMonth) : null;

  /* ---- handlers ---- */
  const resetForm = useCallback(() => {
    setEventType("");
    setDate("");
    setBudgetTier("");
    setMessage("");
    setName("");
    setEmail("");
    setPhone("");
    setHoneypot("");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Honeypot check — bots fill this, humans don't
      if (honeypot) return;

      setIsSubmitting(true);

      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType,
            date,
            budgetTier,
            message,
            name,
            email,
            phone,
          }),
        });

        if (!res.ok) throw new Error("Booking request failed");

        toast.success(t.booking.success);
        resetForm();
      } catch {
        toast.error(t.booking.error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [eventType, date, budgetTier, message, name, email, phone, honeypot, t, resetForm],
  );

  return (
    <section
      id="booking"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="booking-title"
    >
      <div className="max-w-3xl mx-auto">
        {/* ---- Section header ---- */}
        <FadeIn className="text-center mb-16">
          <h2
            id="booking-title"
            className="font-headline text-gradient-gold text-3xl md:text-4xl mb-4"
          >
            {t.booking.sectionTitle}
          </h2>
          <p className="text-silver italic text-lg">{t.booking.sectionSubtitle}</p>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-14">
          {/* ========================================================= */}
          {/*  Step 1 — Event Type                                       */}
          {/* ========================================================= */}
          <FadeIn delay={0.1}>
            <fieldset>
              <legend className="font-headline text-warm-white text-xl mb-6">
                {t.booking.eventType}
              </legend>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4" role="radiogroup" aria-label={t.booking.eventType}>
                {EVENT_OPTIONS.map(({ key, icon: Icon }) => {
                  const isSelected = eventType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setEventType(key)}
                      className={[
                        "flex flex-col items-center gap-2.5 p-4 md:p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                        isSelected
                          ? "bg-gold border-gold text-void scale-105 gold-glow"
                          : "border-gold/30 bg-transparent text-silver hover:border-gold hover:text-warm-white",
                      ].join(" ")}
                    >
                      <Icon className="size-6 md:size-7" aria-hidden="true" />
                      <span className="text-sm font-medium font-body">
                        {t.booking.types[key as keyof typeof t.booking.types]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </FadeIn>

          {/* ========================================================= */}
          {/*  Step 2 — Date                                             */}
          {/* ========================================================= */}
          <FadeIn delay={0.15}>
            <div className="space-y-4">
              <Label
                htmlFor="booking-date"
                className="font-headline text-warm-white text-xl"
              >
                {t.booking.dateLabel}
              </Label>

              <div className="relative">
                <CalendarDays
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-silver pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-11 bg-stage border-gold/20 text-warm-white focus-visible:border-gold focus-visible:ring-gold/30 h-12 text-base"
                  aria-describedby={season ? "season-indicator" : undefined}
                />
              </div>

              {/* Season pill */}
              {season && (
                <div
                  id="season-indicator"
                  className="flex items-center gap-2 justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm font-script text-lg tracking-wide">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    {t.booking.seasonLabels[season]}
                  </span>
                </div>
              )}
            </div>
          </FadeIn>

          {/* ========================================================= */}
          {/*  Step 3 — Budget Tier                                      */}
          {/* ========================================================= */}
          <FadeIn delay={0.2}>
            <fieldset>
              <legend className="font-headline text-warm-white text-xl mb-6">
                {t.booking.budgetLabel}
              </legend>

              <div
                className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible scrollbar-thin"
                role="radiogroup"
                aria-label={t.booking.budgetLabel}
              >
                {BUDGET_OPTIONS.map(({ key, icon: Icon, glowClass }, idx) => {
                  const isSelected = budgetTier === key;
                  const isLegend = key === "legend";
                  const tier = t.booking.budgetTiers[key as keyof typeof t.booking.budgetTiers];

                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setBudgetTier(key)}
                      className={[
                        "relative flex flex-col items-center gap-3 p-5 md:p-6 rounded-lg border-2 min-w-[160px] md:min-w-0 flex-shrink-0 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                        isSelected
                          ? "bg-gold border-gold text-void"
                          : `border-gold/20 bg-transparent text-silver hover:border-gold/40 hover:text-warm-white`,
                        isSelected && glowClass ? glowClass : "",
                        isLegend && isSelected ? "gold-glow-strong ring-1 ring-gold/30" : "",
                      ].join(" ")}
                    >
                      {/* Progressive visual weight */}
                      <Icon
                        className={[
                          "transition-colors",
                          idx === 0 ? "size-5" : idx === 1 ? "size-6" : idx === 2 ? "size-6" : "size-7",
                          isSelected ? "text-void" : "",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                      <span className="font-headline text-base font-semibold text-center leading-tight">
                        {tier.name}
                      </span>
                      <span className="text-xs text-center leading-relaxed opacity-80 font-body">
                        {tier.description}
                      </span>

                      {/* Crown indicator for selected Legend */}
                      {isSelected && isLegend && (
                        <Star
                          className="absolute -top-2.5 -right-2.5 size-5 text-void fill-void"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </FadeIn>

          {/* ========================================================= */}
          {/*  Step 4 — Message                                          */}
          {/* ========================================================= */}
          <FadeIn delay={0.25}>
            <div className="space-y-3">
              <Label
                htmlFor="booking-message"
                className="font-headline text-warm-white text-xl"
              >
                {t.booking.messageLabel}
              </Label>

              <Textarea
                id="booking-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.booking.messagePlaceholder}
                className="min-h-[120px] bg-stage border-gold/20 text-warm-white placeholder:text-silver/60 focus-visible:border-gold focus-visible:ring-gold/30 resize-y text-base leading-relaxed font-body"
                rows={5}
              />
            </div>
          </FadeIn>

          {/* ========================================================= */}
          {/*  Step 5 — Contact                                          */}
          {/* ========================================================= */}
          <FadeIn delay={0.3}>
            <div className="space-y-4">
              <p className="font-headline text-warm-white text-xl">
                {t.booking.contactLabel}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="booking-name" className="text-silver text-sm font-body">
                    {t.booking.namePlaceholder}
                  </Label>
                  <Input
                    id="booking-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.booking.namePlaceholder}
                    required
                    className="bg-stage border-gold/20 text-warm-white placeholder:text-silver/60 focus-visible:border-gold focus-visible:ring-gold/30 h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-email" className="text-silver text-sm font-body">
                    {t.booking.emailPlaceholder}
                  </Label>
                  <Input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.booking.emailPlaceholder}
                    required
                    className="bg-stage border-gold/20 text-warm-white placeholder:text-silver/60 focus-visible:border-gold focus-visible:ring-gold/30 h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-phone" className="text-silver text-sm font-body">
                    {t.booking.phonePlaceholder}
                  </Label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.booking.phonePlaceholder}
                    className="bg-stage border-gold/20 text-warm-white placeholder:text-silver/60 focus-visible:border-gold focus-visible:ring-gold/30 h-11 text-base"
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ========================================================= */}
          {/*  Honeypot (hidden from humans, visible to bots)            */}
          {/* ========================================================= */}
          <div className="relative opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* ========================================================= */}
          {/*  Submit                                                     */}
          {/* ========================================================= */}
          <FadeIn delay={0.35}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-headline tracking-wide bg-gold text-void hover:bg-champagne focus-visible:ring-gold/50 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  <span>{t.booking.submitting}</span>
                </>
              ) : (
                <span>{t.booking.submit}</span>
              )}
            </Button>
          </FadeIn>
        </form>
      </div>

      {/* ---- Divider ---- */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
}