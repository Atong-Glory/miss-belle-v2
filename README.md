# Miss Belle — Spoken Word Artist Website

> *"My words from the canvas of my heart. Telling your story like it was my experience."*

A dark theater-themed, bilingual (EN/FR) single-page blog for spoken word artist **Miss Belle** (Moh Santity Ankimbim) from Kom, North West Region, Cameroon.

---

## Version Status

| Version | Status | Deploy Date |
|---------|--------|-------------|
| **v1.0** | Current | — |
| v2.0 | Planned | — |
| v3.0 | Planned | — |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (New York style) |
| Animations | Framer Motion |
| Icons | Lucide React + Custom SVG (WhatsApp) |
| i18n | React Context + JSON translations |
| Theme | next-themes (dark/light) |
| Form Validation | Zod |
| Notifications | Sonner (toast) |
| Fonts | Playfair Display · Inter · Great Vibes |

---

## v1.0 — Feature Inventory

### Sections (7)
1. **Hero** — Full-viewport with CSS spotlight gradients, parallax, typewriter tagline, audio waveform animation, CTA
2. **The Artist** (About) — Two-column layout, portrait placeholder, 3-paragraph bio, Kom/North West references, social links
3. **The Library of Echoes** (Performances) — 3-tab grid (By Flame/Stage/Season), expandable poem cards, spotlight mouse-tracking effect
4. **Voices from the Crowd** (Testimonials) — 3D center-focused carousel, auto-advance, touch swipe, keyboard arrows, dot indicators
5. **The Red Velvet Rope** (Booking) — 5-step form: event type cards → date picker with season indicator → budget tiers (Whisper/Voice/Roar/Legend) → message → contact info
6. **The Inner Circle** (Newsletter) — Email capture with consent checkbox
7. **Footer** — Brand, social icons, language toggle, copyright, developer signature

### Design System
- **Dark Theme**: "The Dark Stage" — void black `#0A0A0F`, old gold `#C9A227`, deep crimson `#8B0000`
- **Light Theme**: "Daylight on the Canvas" — warm parchment `#FAF8F5`, ink-dark text `#1A1A1A`, gold accents
- CSS variable architecture with smooth theme transitions
- Custom scrollbar, gold glow utilities, gradient utilities
- `prefers-reduced-motion` fully respected

### Internationalization
- Client-side i18n via React Context
- 200+ translation keys across EN and FR
- Language preference persisted to `localStorage`
- All UI text externalized — zero hardcoded strings in components

### Accessibility
- Semantic HTML (`main`, `header`, `nav`, `section`, `article`, `footer`)
- ARIA roles, labels, descriptions
- Skip-to-content link
- Keyboard navigation (tab, arrow keys for carousel)
- Focus-visible rings on all interactive elements
- `aria-disabled` on placeholder social links
- `aria-expanded` on expandable cards
- `aria-live="polite"` on season indicator
- Screen reader–friendly carousel with `role="tablist"`

### SEO
- Full `<meta>` tags (title, description, keywords, authors)
- Open Graph tags with image (1200×630)
- Twitter card with image
- JSON-LD structured data (`Person` schema)
- `robots.txt` with sitemap reference
- `sitemap.xml`
- `metadataBase` set for social image resolution
- Favicon (`.ico` + `.png`)

### Forms & API
- Booking API (`/api/booking`) — Zod-validated POST, honeypot anti-spam
- Newsletter API (`/api/newsletter`) — Zod-validated POST, consent verification, honeypot anti-spam
- Native browser validation enabled (email, required fields)
- Toast notifications for success/error feedback

### Social Links
- Facebook, Instagram, YouTube, TikTok, WhatsApp
- All currently **disabled** (`pointer-events-none`, `cursor-not-allowed`, `aria-disabled`)
- WhatsApp uses `wa.me/237XXXXXXXXX` direct-message format (Cameroon +237)
- Flip `SOCIAL_DISABLED` to `false` and update `href` values to activate

### Developer Credit
- Footer: "CRAFTED BY **Z.ai Code**" linked to `https://z.ai`
- Subtle opacity (25%) that reveals on hover

---

## v2.0 — Roadmap

### Content & Media
- [ ] Replace portrait placeholder with real photograph of Miss Belle
- [ ] Embed real video performances (YouTube iframe or custom player)
- [ ] Embed real audio recordings (HTML5 `<audio>` or waveform player)
- [ ] Add more performance items (currently 6, expand to 15-20)
- [ ] Add photo gallery section (behind-the-scenes, stage performances, events)

### Forms & Backend
- [ ] Connect booking form to email service (Resend, Formspree, or SendGrid)
- [ ] Connect newsletter to email service (Buttondown, Mailchimp, or Resend)
- [ ] Add reCAPTCHA or Turnstile for production spam protection
- [ ] Store submissions in database (Prisma + SQLite or PostgreSQL)
- [ ] Auto-reply confirmation emails (booking received, newsletter welcome)

### Social Integration
- [ ] Activate all social links with real URLs
- [ ] Add social media feed preview (Instagram embed, TikTok widget)
- [ ] Add "Share this poem" functionality (WhatsApp, Twitter, Facebook)

### SEO & Analytics
- [ ] Add Google Analytics 4 or Plausible
- [ ] Add Meta Pixel for retargeting
- [ ] Per-poem Open Graph meta tags (dynamic metadata)
- [ ] Add `manifest.json` for PWA installability

### Performance
- [ ] Add loading skeletons for initial page load
- [ ] Image optimization via `next/image` with WebP/AVIF
- [ ] Font subsetting (only Latin + French characters)
- [ ] Bundle analysis and code splitting

### UX Enhancements
- [ ] "Back to top" floating button
- [ ] Scroll progress indicator
- [ ] Animated counter stats (performances, events, years)
- [ ] Poem of the week highlighted section
- [ ] Audio background music toggle (optional ambient)

---

## v3.0 — Roadmap

### Platform Features
- [ ] Admin dashboard (add/edit/delete performances, testimonials)
- [ ] Blog section with markdown CMS
- [ ] Event calendar with upcoming shows
- [ ] Merchandise store (or "Buy My Book" section)
- [ ] Patron/membership tier with exclusive content

### Community
- [ ] Comments section on performances
- [ ] Fan wall / guestbook
- [ ] Poetry submission contest feature
- [ ] Workshop booking system

### Multimedia
- [ ] Full video background on hero
- [ ] 3D stage visualization (Three.js or WebGL)
- [ ] Interactive poem explorer (click lines for annotations)
- [ ] AR experience (scan poster to see Miss Belle perform)

### Advanced
- [ ] Server-side i18n with `[lang]` routing for SEO
- [ ] Multi-author support (if Miss Belle collaborates)
- [ ] PWA with offline reading of poems
- [ ] AI chatbot assistant ("Ask Miss Belle")
- [ ] SMS notification system for new performances

---

## File Structure

```
miss-belle/
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── og-image.png
│   ├── logo.svg
│   ├── robots.txt
│   └── sitemap.xml
├── prisma/
│   └── schema.prisma          # (unused in v1 — planned for v2)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── booking/
│   │   │   │   └── route.ts   # Booking form endpoint
│   │   │   └── newsletter/
│   │   │       └── route.ts   # Newsletter subscription endpoint
│   │   ├── globals.css         # Design system (dual theme)
│   │   ├── layout.tsx          # Root layout, SEO, ThemeProvider
│   │   └── page.tsx            # Single-page assembly
│   ├── components/
│   │   ├── animations/
│   │   │   ├── fade-in.tsx     # FadeIn, StaggerContainer, StaggerItem
│   │   │   ├── typewriter.tsx  # Character-by-character typing
│   │   │   └── waveform.tsx    # Audio waveform bars
│   │   ├── icons/
│   │   │   └── whatsapp.tsx    # WhatsApp SVG icon
│   │   ├── sections/
│   │   │   ├── about.tsx       # The Artist
│   │   │   ├── booking.tsx     # The Red Velvet Rope (booking form)
│   │   │   ├── footer.tsx      # Footer with developer credit
│   │   │   ├── hero.tsx        # Full-viewport hero
│   │   │   ├── language-toggle.tsx
│   │   │   ├── navigation.tsx  # Sticky nav with mobile Sheet
│   │   │   ├── newsletter.tsx  # The Inner Circle (email capture)
│   │   │   ├── performances.tsx # The Library of Echoes
│   │   │   ├── testimonials.tsx # Voices from the Crowd (carousel)
│   │   │   └── theme-toggle.tsx
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── i18n/
│       │   ├── context.tsx     # I18nProvider + useI18n hook
│       │   ├── en.json         # English translations
│       │   └── fr.json         # French translations
│       ├── utils.ts
│       └── db.ts               # Prisma client (unused in v1)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Deployment Guide

### STEP 1 — Download

1. Click the **Download** button in the preview panel
2. Extract the ZIP to a folder on your computer
3. Open a terminal in that folder

### STEP 2 — Install Dependencies

```bash
npm install
```

### STEP 3 — Edit These Files Before Deploying

Open the following files and make the specified changes:

#### 3a. Social Media URLs
**File:** `src/components/sections/about.tsx` (line ~11-17)
**File:** `src/components/sections/footer.tsx` (line ~18-25)

Replace the `href` values with real URLs:

```typescript
// about.tsx
const socialLinks = [
  { href: "https://facebook.com/MISS_BELLE_REAL_PROFILE", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com/miss_belle_real", icon: Instagram, label: "Instagram" },
  { href: "https://youtube.com/@MissBelleReal", icon: Youtube, label: "YouTube" },
  { href: "https://tiktok.com/@miss_belle_real", icon: Music, label: "TikTok" },
  { href: "https://wa.me/2376XXXXXXXX", icon: WhatsAppIcon, label: "WhatsApp" },  // Cameroon +237
];

// footer.tsx — same changes, PLUS flip the flag:
const SOCIAL_DISABLED = false;  // ← CHANGE THIS TO false
```

> **WhatsApp DM format:** `https://wa.me/237XXXXXXXXX` where `237` is Cameroon's country code and `XXXXXXXXX` is Miss Belle's phone number (no spaces, no +, no dashes).

#### 3b. Name Spelling Verification
**File:** `src/lib/i18n/en.json` (line 20)
**File:** `src/lib/i18n/fr.json` (line 20)

Currently says: `"MOH SANTITY ANKINBIMOM"`

Confirm with Miss Belle whether it's **ANKINBIMOM** or **ANKIMBIMOM** and correct if needed.

#### 3c. Domain Name
**File:** `src/app/layout.tsx` (line 27)

```typescript
metadataBase: new URL("https://missbelle.art"),
```

Change `missbelle.art` to the actual domain you'll deploy to.

**File:** `public/sitemap.xml` (line 4)

```xml
<loc>https://missbelle.art/</loc>
```

Change to the same domain.

**File:** `public/robots.txt` (lines 3, 7)

```txt
Sitemap: https://missbelle.art/sitemap.xml
```

Change to the same domain.

#### 3d. Portrait Image (Optional — Can Do After Launch)
**File:** `src/components/sections/about.tsx` (line ~41-60)

Replace the gradient placeholder `<div>` with a real `<Image>` tag:

```tsx
import Image from "next/image";

<Image
  src="/miss-belle-portrait.jpg"
  alt="Miss Belle — Spoken Word Artist"
  width={400}
  height={533}
  className="gold-border-glow aspect-[3/4] w-full max-w-sm rounded-lg border border-gold/20 object-cover"
  priority
/>
```

Place the image file in the `public/` folder.

### STEP 4 — Connect Email Services (Optional — Forms Still Log to Console Without This)

#### Option A: Resend (Recommended)
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Update `src/app/api/booking/route.ts` and `src/app/api/newsletter/route.ts`

#### Option B: Formspree (Simplest)
1. Create account at [formspree.io](https://formspree.io)
2. Create two forms (booking + newsletter)
3. Replace the `console.log(...)` and `return NextResponse.json(...)` blocks with fetch calls to Formspree endpoints

### STEP 5 — Deploy to Vercel (Recommended)

1. Push the project to a GitHub repository (private or public)
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import the GitHub repository
4. Leave all defaults (Vercel auto-detects Next.js)
5. Click **Deploy**
6. Wait 60-90 seconds
7. Vercel gives you a live URL like `miss-belle.vercel.app`
8. (Optional) Add a custom domain in Vercel → Settings → Domains

### STEP 6 — Alternative Deployment (Netlify, Railway, etc.)

#### Netlify
```bash
npm run build
# Upload .next/static folder and configure server settings
# Or use Git integration: connect repo → auto-deploys on push
```

#### Railway / Render
```bash
npm install
# Connect GitHub repo in Railway/Render dashboard
# Auto-detects Next.js, deploys automatically
```

#### Self-Hosted (VPS)
```bash
npm run build
npm start   # Starts on port 3000
# Use Caddy or Nginx as reverse proxy
```

### STEP 7 — Send the Link to Miss Belle

1. Copy the live URL from Vercel/Netlify
2. Open WhatsApp on your phone
3. Find Miss Belle's chat
4. Send a message like:

> 🎤 Surprise! I built you something.
>
> Go here: https://your-deployed-url.vercel.app
>
> It's your website. Your stage. Your words.
>
> — [Your Name]

5. Wait for her reaction. 😊

### Post-Launch Checklist

- [ ] Visit the URL on your phone and test every section
- [ ] Switch between EN and FR — confirm all text translates
- [ ] Toggle dark/light mode
- [ ] Test the booking form (it will log to console — confirm no errors)
- [ ] Test the newsletter form
- [ ] Check all social links open correctly
- [ ] Share the URL on Facebook/WhatsApp to verify the OG image appears
- [ ] Run [Google PageSpeed Insights](https://pagespeed.web.dev/) — aim for 80+ mobile

---

## Design Tokens

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--bg-void` | `#0A0A0F` | `#FAF8F5` | Page background |
| `--bg-stage` | `#12121A` | `#FFFFFF` | Card/surface background |
| `--bg-curtain` | `#08080D` | `#F0EDE8` | Footer background |
| `--text-primary` | `#F5F5F0` | `#1A1A1A` | Primary text |
| `--text-secondary` | `#A0A0A0` | `#6B6B6B` | Secondary/muted text |
| `--color-gold` | `#C9A227` | `#C9A227` | Accent (constant) |
| `--color-champagne` | `#E8D5B7` | `#E8D5B7` | Light accent (constant) |
| `--color-crimson` | `#8B0000` | `#8B0000` | Dramatic accent (constant) |

---

## License

Built with reverence for the spoken word. All original content (poetry, testimonials, bio) belongs to Miss Belle. Code by **Z.ai Code**.

---

*CRAFTED BY [Z.ai Code](https://z.ai)*