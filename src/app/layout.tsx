import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const vibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://missbelle.art"),
  title: "Miss Belle — Spoken Word Artist | Canvas of the Heart",
  description:
    "My words from the canvas of my heart. Telling your story like it was my experience. Spoken word poetry by Moh Santity Ankimbim — Miss Belle.",
  keywords: [
    "Miss Belle",
    "spoken word",
    "poetry",
    "Cameroon",
    "slam poetry",
    "Moh Santity Ankimbim",
    "performance poetry",
    "African poetry",
    "faith poetry",
  ],
  authors: [{ name: "Moh Santity Ankimbim", url: "https://missbelle.art" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
  },
  openGraph: {
    title: "Miss Belle — Spoken Word Artist",
    description:
      "My words from the canvas of my heart. Telling your story like it was my experience.",
    siteName: "Miss Belle",
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Miss Belle — Spoken Word Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miss Belle — Spoken Word Artist",
    description:
      "My words from the canvas of my heart. Telling your story like it was my experience.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C9A227" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Moh Santity Ankimbim",
              alternateName: "Miss Belle",
              jobTitle: "Spoken Word Artist",
              description:
                "My words from the canvas of my heart. Telling your story like it was my experience.",
              nationality: "Cameroonian",
              knowsLanguage: ["English", "French"],
              performsAs: {
                "@type": "PerformingGroup",
                name: "Miss Belle",
                genre: "Spoken Word Poetry",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${vibes.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="missbelle-theme"
        >
          <noscript>
            <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Georgia, serif" }}>
              <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>MISS BELLE — Spoken Word Artist</h1>
              <p style={{ marginBottom: "0.5rem" }}>My words from the canvas of my heart.</p>
              <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>This site requires JavaScript to be enabled. Please enable JavaScript in your browser settings.</p>
            </div>
          </noscript>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: "bg-card border border-gold text-warm-white!",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}