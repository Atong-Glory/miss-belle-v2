import dynamic from "next/dynamic";
import { ClientProviders } from "@/components/providers/client-providers";
import { Hero } from "@/components/sections/hero";
import { Navigation } from "@/components/sections/navigation";
import { ScrollProgress } from "@/components/sections/scroll-progress";
import { BackToTop } from "@/components/sections/back-to-top";
import { WhisperFloat, CollectedWhispers } from "@/components/whispering-ink";

/* Critical above-fold — loaded immediately */
const StatsCounter = dynamic(() => import("@/components/sections/stats-counter"), {
  loading: () => <div className="h-40" />,
});

/* Below-fold — lazy loaded with code splitting */
const About = dynamic(() => import("@/components/sections/about").then((m) => ({ default: m.About })), {
  loading: () => <div className="h-[600px]" />,
});

const Performances = dynamic(() => import("@/components/sections/performances"), {
  loading: () => <div className="h-[800px]" />,
});

const EmotionalMap = dynamic(() => import("@/components/sections/emotional-map"), {
  loading: () => <div className="h-[600px]" />,
});

const LivingStage = dynamic(() => import("@/components/sections/living-stage"), {
  loading: () => <div />,
});

const Testimonials = dynamic(() => import("@/components/sections/cinematic-testimonials"), {
  loading: () => <div className="h-[500px]" />,
});

const GallerySection = dynamic(() => import("@/components/sections/gallery"), {
  loading: () => <div className="h-[600px]" />,
});

const VoicedCanvasSection = dynamic(() => import("@/components/sections/voiced-canvas-section").then((m) => ({ default: m.VoicedCanvasSection })), {
  loading: () => <div className="h-[500px]" />,
});

const Booking = dynamic(() => import("@/components/sections/booking"), {
  loading: () => <div className="h-[800px]" />,
});

const MirrorRoom = dynamic(() => import("@/components/sections/mirror-room").then((m) => ({ default: m.MirrorRoom })), {
  loading: () => <div className="h-[500px]" />,
});

const OriginThread = dynamic(() => import("@/components/sections/origin-thread").then((m) => ({ default: m.OriginThread })), {
  loading: () => <div className="h-[800px]" />,
});

const KomProverbLoader = dynamic(() => import("@/components/sections/kom-codex").then((m) => ({ default: m.KomProverbLoader })), {
  loading: () => <div className="h-10" />,
});

const KomPatternDivider = dynamic(() => import("@/components/sections/kom-codex").then((m) => ({ default: m.KomPatternDivider })), {
  loading: () => <div className="h-10" />,
});

const Newsletter = dynamic(() => import("@/components/sections/newsletter"), {
  loading: () => <div className="h-[300px]" />,
});

const Footer = dynamic(() => import("@/components/sections/footer"), {
  loading: () => <div className="h-[200px]" />,
});

export default function Home() {
  return (
    <ClientProviders>
      <div className="flex min-h-screen flex-col">
        {/* Skip to content link for accessibility */}
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-void focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Scroll progress bar */}
        <ScrollProgress />

        {/* Sticky navigation — appears after hero */}
        <Navigation />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <Hero />
          <StatsCounter />
          <LivingStage index={0} />
          <About />
          <KomPatternDivider />
          <LivingStage index={1} />
          <Performances />
          <KomPatternDivider />
          <LivingStage index={2} />
          <EmotionalMap />
          <KomPatternDivider />
          <LivingStage index={3} />
          <Testimonials />
          <LivingStage index={4} />
          <GallerySection />
          <KomPatternDivider />
          <LivingStage index={0} />
          <OriginThread />
          <KomPatternDivider />
          <LivingStage index={1} />
          <MirrorRoom />
          <KomProverbLoader />
          <KomPatternDivider />
          <LivingStage index={2} />
          <VoicedCanvasSection />
          <Booking />
          <Newsletter />
        </main>

        <Footer />

        {/* Back to top button */}
        <BackToTop />

        {/* Whispering Ink — floating whisper + collected panel */}
        <WhisperFloat />
        <CollectedWhispers />
      </div>
    </ClientProviders>
  );
}