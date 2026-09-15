import dynamic from "next/dynamic";
import { ClientProviders } from "@/components/providers/client-providers";
import { Hero } from "@/components/sections/hero";
import { Navigation } from "@/components/sections/navigation";
import { ScrollProgress } from "@/components/sections/scroll-progress";
import { BackToTop } from "@/components/sections/back-to-top";
import { WhisperFloat, CollectedWhispers } from "@/components/whispering-ink";
import { db } from "@/lib/db"

/* Critical above-fold */
const StatsCounter = dynamic(() => import("@/components/sections/stats-counter"), {
  loading: () => <div className="h-40" />,
});

/* Below-fold */
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
const Newsletter = dynamic(() => import("@/components/sections/newsletter"), {
  loading: () => <div className="h-80" />,
});
const Footer = dynamic(() => import("@/components/sections/footer").then((m) => ({ default: m.Footer })));
const ThemeToggle = dynamic(() => import("@/components/sections/theme-toggle").then((m) => ({ default: m.ThemeToggle })));
const LanguageToggle = dynamic(() => import("@/components/sections/language-toggle").then((m) => ({ default: m.LanguageToggle })));
const PostFeed = dynamic(() => import("@/components/sections/feed"));

export default async function Home() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <ClientProviders>
      <div className="relative min-h-screen selection:bg-gold/30 selection:text-gold">
        <ScrollProgress />
        <Navigation />

        <main className="flex flex-col">
          <Hero />
          
          <div className="relative z-10 bg-background">
            <StatsCounter />
            <About />
            
            {posts.length > 0 && <PostFeed posts={posts} />}
            
            <Performances />
            <EmotionalMap />
            <LivingStage />
            <Testimonials />
            <GallerySection />
            <VoicedCanvasSection />
            <Booking />
            <MirrorRoom />
            <Newsletter />
          </div>
        </main>

        <Footer />
        
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>

        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4 pointer-events-none">
          <div className="pointer-events-auto"><BackToTop /></div>
          <div className="pointer-events-auto"><WhisperFloat /></div>
        </div>

        <CollectedWhispers />
      </div>
    </ClientProviders>
  );
}
