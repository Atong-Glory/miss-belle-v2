#!/usr/bin/env python3
"""Miss Belle Blog - System Report & Deployment Guide (Body PDF)"""

import os, sys, hashlib, platform
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, HRFlowable, ListFlowable, ListItem,
    Frame, PageTemplate,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ━━ Paths ━━
OUTPUT_PATH = "/home/z/my-project/download/Miss_Belle_Deployment_Guide.pdf"
FONT_DIR = "/usr/share/fonts" if platform.system() != "Darwin" else os.path.expanduser("~/.openclaw/workspace/fonts")

# ━━ Cascade Palette ━━
PAGE_BG       = colors.HexColor('#f6f6f6')
SECTION_BG    = colors.HexColor('#ececea')
CARD_BG       = colors.HexColor('#eeedea')
TABLE_STRIPE  = colors.HexColor('#f0efed')
HEADER_FILL   = colors.HexColor('#706646')
COVER_BLOCK   = colors.HexColor('#8a7d54')
BORDER        = colors.HexColor('#c3bca6')
ICON          = colors.HexColor('#9b843e')
ACCENT        = colors.HexColor('#856f2c')
ACCENT_2      = colors.HexColor('#4e9cb6')
TEXT_PRIMARY   = colors.HexColor('#1b1a18')
TEXT_MUTED     = colors.HexColor('#828078')

# ━━ Font Registration ━━
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold', italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

# ━━ Styles ━━
W = A4[0]
HM = 55 * mm  # horizontal margin
RM = 45 * mm  # right margin
CW = W - HM - RM  # content width

toc_level0 = ParagraphStyle(
    name="TOC0", fontName="FreeSerif-Bold", fontSize=12, leading=22,
    textColor=TEXT_PRIMARY, leftIndent=0, spaceBefore=6, spaceAfter=2
)
toc_level1 = ParagraphStyle(
    name="TOC1", fontName="FreeSerif", fontSize=10.5, leading=18,
    textColor=TEXT_MUTED, leftIndent=20, spaceBefore=2, spaceAfter=2
)

h1_style = ParagraphStyle(
    name="H1", fontName="FreeSerif-Bold", fontSize=20, leading=28,
    textColor=HEADER_FILL, spaceBefore=24, spaceAfter=10,
    borderWidth=0, borderPadding=0,
)
h2_style = ParagraphStyle(
    name="H2", fontName="FreeSerif-Bold", fontSize=14, leading=20,
    textColor=TEXT_PRIMARY, spaceBefore=16, spaceAfter=8,
)
body_style = ParagraphStyle(
    name="Body", fontName="FreeSerif", fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=8,
    firstLineIndent=0,
)
body_indent = ParagraphStyle(
    name="BodyIndent", fontName="FreeSerif", fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6,
    leftIndent=16,
)
code_style = ParagraphStyle(
    name="Code", fontName="DejaVuSans", fontSize=8.5, leading=13,
    textColor=colors.HexColor('#3a3a3a'), backColor=colors.HexColor('#f0efed'),
    borderWidth=0.5, borderColor=colors.HexColor('#d4d2ce'), borderPadding=8,
    leftIndent=8, rightIndent=8, spaceAfter=10, spaceBefore=4,
)
bullet_style = ParagraphStyle(
    name="Bullet", fontName="FreeSerif", fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=4,
    leftIndent=24, bulletIndent=12, bulletFontName="FreeSerif",
    bulletFontSize=10.5,
)
muted_style = ParagraphStyle(
    name="Muted", fontName="FreeSerif-Italic", fontSize=9.5, leading=15,
    textColor=TEXT_MUTED, spaceAfter=8,
)
callout_style = ParagraphStyle(
    name="Callout", fontName="FreeSerif-Bold", fontSize=10, leading=16,
    textColor=ACCENT, leftIndent=12, spaceBefore=8, spaceAfter=8,
)

page_num_style = ParagraphStyle(
    name="PageNum", fontName="FreeSerif", fontSize=8.5, leading=12,
    textColor=TEXT_MUTED, alignment=TA_CENTER,
)
header_style = ParagraphStyle(
    name="PageHeader", fontName="FreeSerif-Italic", fontSize=8, leading=10,
    textColor=TEXT_MUTED, alignment=TA_LEFT,
)

# ━━ TocDocTemplate ━━
class TocDocTemplate(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.page_count = 0

    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

    def afterPage(self):
        self.page_count += 1
        self._draw_page_footer()

    def _draw_page_footer(self):
        """Draw page number on current canvas after each page."""
        if self.canv:
            c = self.canv
            c.saveState()
            c.setStrokeColor(BORDER)
            c.setLineWidth(0.5)
            c.line(HM, 30*mm, W - RM, 30*mm)
            c.setFont('FreeSerif', 9)
            c.setFillColor(TEXT_MUTED)
            c.drawCentredString(W / 2, 15*mm, str(self.page))
            c.restoreState()

def page_title(canvas, doc):
    """Page header and footer (used by PageTemplate)."""
    canvas.saveState()
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(HM, 30*mm, W - RM, 30*mm)
    canvas.setFont('FreeSerif', 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(W / 2, 22*mm, str(doc.page))
    canvas.restoreState()

def add_heading(text, style, level=0):
    key = f'h_{hashlib.md5(text.encode()).hexdigest()[:8]}'
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def make_table(headers, rows, col_widths=None):
    """Create a styled table."""
    if col_widths is None:
        n = len(headers)
        col_widths = [CW / n] * n
    data = [headers] + rows
    para_headers = [Paragraph(f'<b>{h}</b>', ParagraphStyle(
        name=f'th_{h}', fontName='FreeSerif-Bold', fontSize=9.5, leading=14,
        textColor=colors.white,
    )) for h in headers]
    para_rows = []
    for row in rows:
        para_rows.append([Paragraph(str(c), ParagraphStyle(
            name=f'td_{c}_{i}', fontName='FreeSerif', fontSize=9, leading=13,
            textColor=TEXT_PRIMARY,
        )) for i, c in enumerate(row)])
    t = Table([para_headers] + para_rows, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_FILL),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'FreeSerif-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9.5),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), TABLE_STRIPE))
    t.setStyle(TableStyle(style_cmds))
    return t

# ━━ Build Document ━━
doc = TocDocTemplate(
    OUTPUT_PATH, pagesize=A4,
    title="Miss Belle Blog - System Report & Deployment Guide",
    author="Z.ai",
    subject="Deployment documentation for the Miss Belle spoken word artist blog",
    creator="Z.ai",
)

# Replace default template with one that has page numbers
from reportlab.platypus.doctemplate import _doNothing
doc.pageTemplates = []
content_frame = Frame(HM, 38*mm, CW, A4[1] - 42*mm - 38*mm, id='content')
body_pt = PageTemplate(id='body', frames=[content_frame], onPage=page_title)
doc.addPageTemplates([body_pt])

story = []

# ── Table of Contents ──
toc = TableOfContents()
toc.levelStyles = [toc_level0, toc_level1]
story.append(Paragraph("Table of Contents", ParagraphStyle(
    name="TOCTitle", fontName="FreeSerif-Bold", fontSize=22, leading=30,
    textColor=HEADER_FILL, spaceBefore=10, spaceAfter=20,
)))
story.append(toc)
story.append(PageBreak())

# ═══════════════════════════════════════════
# Chapter 1: System Overview
# ═══════════════════════════════════════════
story.append(add_heading("1. System Overview", h1_style, 0))
story.append(Paragraph(
    "The Miss Belle blog is a single-page marketing website built for Moh Santity Ankimbim, "
    "a spoken word artist and poet performing under the stage name Miss Belle. The site serves as "
    "her professional online presence, showcasing performances, testimonials, gallery images, and "
    "providing a booking form for event organizers. It is designed with a strong emphasis on visual "
    "storytelling, dark-mode aesthetics with gold accents, and smooth animations that reflect the "
    "artistic nature of spoken word poetry.",
    body_style
))
story.append(Paragraph(
    "The website is a client-side rendered React application built with Next.js 16 (App Router) "
    "and styled using Tailwind CSS 4 with the shadcn/ui component library. It features bilingual "
    "support for English and French through a custom internationalization provider, light and dark "
    "theme toggling via next-themes, and performance-critical optimizations including code-split "
    "lazy loading for all below-the-fold sections. The application is configured for standalone "
    "output, meaning it produces a self-contained production build that includes its own Node.js "
    "server, eliminating the need for a traditional Node.js installation on the deployment target.",
    body_style
))
story.append(Paragraph(
    "The primary domain for this project is missbelle.art. The site includes structured data "
    "(JSON-LD schema markup for a Person entity), Open Graph and Twitter card metadata for social "
    "media sharing, a progressive web app manifest, and SEO-friendly robots.txt configuration. "
    "Two API routes handle form submissions: a booking inquiry endpoint with Zod validation and "
    "honeypot spam protection, and a newsletter subscription endpoint. Both routes currently log "
    "submissions to the console and include TODO markers for integration with email services such "
    "as Resend, Formspree, or Buttondown.",
    body_style
))

story.append(add_heading("1.1 Key Features", h2_style, 1))
story.append(Paragraph(
    "The blog implements a rich set of interactive and presentational features designed to engage "
    "visitors and communicate the artist's brand effectively. Below is a summary of the primary "
    "feature areas, each implemented as a self-contained React component loaded dynamically to "
    "minimize the initial JavaScript bundle size and improve page load performance.",
    body_style
))
story.append(make_table(
    ["Feature", "Description", "Component"],
    [
        ["Hero Section", "Full-viewport landing with typewriter animation, waveform visualizer, and scroll progress indicator", "hero.tsx, scroll-progress.tsx"],
        ["Navigation", "Sticky top navigation bar with responsive mobile menu and language toggle", "navigation.tsx, language-toggle.tsx"],
        ["Statistics", "Animated counters displaying performance metrics and career highlights", "stats-counter.tsx"],
        ["About", "Biography section with image, text, and animated entry", "about.tsx"],
        ["Performances", "Event listing with date, venue, and booking integration", "performances.tsx"],
        ["Testimonials", "Rotating testimonial carousel with Framer Motion transitions", "testimonials.tsx"],
        ["Gallery", "Photo grid with lightbox viewer using AnimatePresence", "gallery.tsx"],
        ["Booking Form", "Multi-field booking inquiry with Zod validation and honeypot", "booking.tsx"],
        ["Newsletter", "Email subscription with consent checkbox and validation", "newsletter.tsx"],
        ["Theme Toggle", "Dark/light mode switch with smooth CSS transitions", "theme-toggle.tsx"],
    ],
    col_widths=[CW*0.18, CW*0.52, CW*0.30],
))

# ═══════════════════════════════════════════
# Chapter 2: Technology Stack
# ═══════════════════════════════════════════
story.append(add_heading("2. Technology Stack", h1_style, 0))
story.append(Paragraph(
    "The project leverages a modern JavaScript/TypeScript stack centered around the Next.js "
    "framework. All dependencies and their versions are managed through the package.json manifest, "
    "with lock files generated by the Bun package manager. The technology choices prioritize "
    "developer experience, performance, and a rich visual design system suitable for an artist's "
    "portfolio website. Below is a comprehensive breakdown of every major technology category "
    "and its role within the application.",
    body_style
))

story.append(add_heading("2.1 Core Framework", h2_style, 1))
story.append(Paragraph(
    "Next.js 16.1.1 serves as the application framework, using the App Router architecture "
    "introduced in Next.js 13 and stabilized through subsequent releases. The App Router provides "
    "file-system-based routing, server components by default, and nested layouts. The project is "
    "configured with <font name='DejaVuSans'>output: 'standalone'</font>, which produces an optimized "
    "production build that includes a minimal Node.js server capable of running the application "
    "without installing the full node_modules tree on the target server. TypeScript 5 provides "
    "static type checking across all source files, with build-time type errors suppressed via "
    "<font name='DejaVuSans'>ignoreBuildErrors: true</font> in the Next.js configuration for faster "
    "iteration during development.",
    body_style
))

story.append(add_heading("2.2 Styling and UI", h2_style, 1))
story.append(Paragraph(
    "Tailwind CSS 4 is used for utility-first styling, configured with custom color tokens "
    "defined as HSL CSS variables (such as --background, --foreground, --card, --primary, and "
    "so on). This approach enables seamless theme switching between light and dark modes by "
    "toggling a CSS class on the HTML root element. The shadcn/ui component library provides "
    "a comprehensive set of pre-built, accessible UI primitives (buttons, dialogs, forms, "
    "tooltips, etc.) built on top of Radix UI. Framer Motion 12 handles all animations and "
    "transitions throughout the site, including page-level scroll progress, section entry "
    "animations, testimonial carousel transitions, and gallery lightbox effects.",
    body_style
))

story.append(add_heading("2.3 Full Dependency Table", h2_style, 1))
story.append(make_table(
    ["Category", "Package", "Version", "Purpose"],
    [
        ["Framework", "next", "16.1.1", "React meta-framework with App Router"],
        ["Runtime", "react / react-dom", "19.0.0", "UI rendering library"],
        ["Styling", "tailwindcss", "4.x", "Utility-first CSS framework"],
        ["UI Library", "radix-ui (multiple)", "various", "Accessible headless UI primitives"],
        ["Animations", "framer-motion", "12.23.2", "Declarative animation library"],
        ["Theming", "next-themes", "0.4.6", "Dark/light mode management"],
        ["Fonts", "next/font (Google Fonts)", "built-in", "Inter, Playfair Display, Great Vibes"],
        ["Validation", "zod", "4.0.2", "Schema validation for API routes"],
        ["Database", "prisma / @prisma/client", "6.11.1", "ORM for SQLite database access"],
        ["Icons", "lucide-react", "0.525.0", "SVG icon library"],
        ["Toasts", "sonner", "2.0.6", "Toast notification system"],
        ["Package Mgr", "bun", "lock file", "Fast JavaScript package manager"],
    ],
    col_widths=[CW*0.14, CW*0.30, CW*0.12, CW*0.44],
))

# ═══════════════════════════════════════════
# Chapter 3: Architecture & Performance
# ═══════════════════════════════════════════
story.append(add_heading("3. Architecture and Performance Optimizations", h1_style, 0))
story.append(Paragraph(
    "Performance was a primary concern during the development of this blog. The original "
    "implementation loaded all section components synchronously, resulting in a large initial "
    "JavaScript bundle and slow time-to-interactive metrics. Three major optimizations were "
    "applied to address these issues: code splitting via dynamic imports, elimination of CSS "
    "paint thrashing caused by wildcard transition selectors, and removal of expensive Framer "
    "Motion layout animations. Each optimization is detailed below with the specific code "
    "changes and the performance impact they deliver.",
    body_style
))

story.append(add_heading("3.1 Code Splitting with next/dynamic", h2_style, 1))
story.append(Paragraph(
    "The primary performance bottleneck was the synchronous import of eight section components "
    "(StatsCounter, About, Performances, Testimonials, Gallery, Booking, Newsletter, and Footer) "
    "at the top level of the main page. This forced the browser to download, parse, and execute "
    "the JavaScript for every section before the page became interactive, even though only the "
    "Hero and Navigation sections are visible above the fold. The solution was to wrap each "
    "below-fold section in a <font name='DejaVuSans'>next/dynamic()</font> call with "
    "<font name='DejaVuSans'>ssr: false</font> and a placeholder loading element that reserves "
    "the correct vertical space to prevent layout shift.",
    body_style
))
story.append(Paragraph(
    "This approach means the initial HTML sent by the server contains only the critical "
    "above-the-fold content (Hero, Navigation, ScrollProgress, BackToTop). All other sections "
    "are loaded as separate JavaScript chunks that are fetched asynchronously by the browser "
    "after the initial page render. The loading placeholders use CSS height values matching each "
    "section's approximate rendered height, which prevents cumulative layout shift (CLS) as "
    "sections load progressively into the page. The build output confirms multiple chunk files "
    "are generated, with the main bundle significantly smaller than the original monolithic build.",
    body_style
))

story.append(add_heading("3.2 Targeted CSS Transitions", h2_style, 1))
story.append(Paragraph(
    "The original stylesheet applied a wildcard CSS transition rule to every DOM element using "
    "<font name='DejaVuSans'>*, *::before, *::after { transition-property: background-color, "
    "color, border-color, ... }</font>. This rule forced the browser's transition machinery to "
    "activate on every single element in the document tree, including deeply nested divs, spans, "
    "and pseudo-elements that never actually change their visual properties. On a page with "
    "hundreds of DOM nodes (common with complex Tailwind utility output), this caused significant "
    "paint thrashing during theme toggling and page load, as the browser had to compute "
    "transitions for elements that were not visually changing.",
    body_style
))
story.append(Paragraph(
    "The fix replaced the wildcard selector with a set of targeted selectors scoped to elements "
    "that actually participate in theme transitions. The new rule uses a "
    "<font name='DejaVuSans'>html.theme-transition</font> class toggled by the theme switch "
    "button, and applies transitions only to <font name='DejaVuSans'>body</font>, "
    "<font name='DejaVuSans'>main</font>, <font name='DejaVuSans'>header</font>, "
    "<font name='DejaVuSans'>footer</font>, <font name='DejaVuSans'>section</font>, and "
    "elements with background-related CSS classes. This reduced the number of elements "
    "participating in transitions from potentially thousands to approximately two dozen, "
    "eliminating the paint thrashing entirely.",
    body_style
))

story.append(add_heading("3.3 Animation Cleanup", h2_style, 1))
story.append(Paragraph(
    "Framer Motion's <font name='DejaVuSans'>AnimatePresence</font> component was configured "
    "with <font name='DejaVuSans'>mode='popLayout'</font> and child elements used the "
    "<font name='DejaVuSans'>layout</font> prop. The <font name='DejaVuSans'>layout</font> "
    "prop instructs Framer Motion to automatically animate an element's position and size "
    "whenever the DOM layout changes, which triggers continuous layout recalculations during "
    "list reordering or element mounting. Combined with <font name='DejaVuSans'>popLayout'</font> "
    "mode (which exits and enters elements simultaneously), this caused expensive reflow "
    "operations during testimonial carousel transitions and gallery lightbox animations.",
    body_style
))
story.append(Paragraph(
    "The fix was straightforward: set <font name='DejaVuSans'>initial={false}</font> on "
    "<font name='DejaVuSans'>AnimatePresence</font> to prevent the initial mount animation "
    "(which was causing a visible flash on page load), remove all "
    "<font name='DejaVuSans'>layout</font> props from animated children, and reduce transition "
    "durations from 0.5s to 0.25s for gallery items and 0.4s for testimonials. These changes "
    "eliminated the layout thrashing while maintaining smooth, visually appealing transitions "
    "for section changes.",
    body_style
))

story.append(add_heading("3.4 Theme Toggle Timer Fix", h2_style, 1))
story.append(Paragraph(
    "A subtle but impactful bug existed in the theme toggle component. The original code used "
    "a cleanup function inside the <font name='DejaVuSans'>onClick</font> handler to clear a "
    "setTimeout, following the pattern <font name='DejaVuSans'>return () => clearTimeout(timer)"
    "</font>. However, React event handlers do not treat return values as cleanup functions; "
    "the returned function was silently discarded. This meant the timer that removes the "
    "<font name='DejaVuSans'>theme-transition</font> CSS class was never properly cleared if the "
    "user clicked the toggle rapidly, causing the class to persist and break subsequent theme "
    "switches. The fix replaced the inline timer with a <font name='DejaVuSans'>useRef</font> "
    "that stores the timer ID, allowing the new click handler to clear any pending timer before "
    "setting a new one, ensuring consistent transition behavior regardless of click frequency.",
    body_style
))

# ═══════════════════════════════════════════
# Chapter 4: Project Structure
# ═══════════════════════════════════════════
story.append(add_heading("4. Project Structure", h1_style, 0))
story.append(Paragraph(
    "The project follows the standard Next.js App Router directory convention, with all "
    "source code organized under the <font name='DejaVuSans'>src/</font> directory. The "
    "structure separates concerns into clear directories: page components in "
    "<font name='DejaVuSans'>src/app/</font>, reusable section components in "
    "<font name='DejaVuSans'>src/components/sections/</font>, UI primitives from shadcn/ui "
    "in <font name='DejaVuSans'>src/components/ui/</font>, custom animations in "
    "<font name='DejaVuSans'>src/components/animations/</font>, internationalization files "
    "in <font name='DejaVuSans'>src/lib/i18n/</font>, and API route handlers in "
    "<font name='DejaVuSans'>src/app/api/</font>. The Prisma schema and database files reside "
    "at the project root. Below is the complete directory tree with annotations for the most "
    "important files.",
    body_style
))

story.append(Paragraph(
    "<font name='DejaVuSans'>src/app/page.tsx</font>  -  Main page component with dynamic imports<br/>"
    "<font name='DejaVuSans'>src/app/layout.tsx</font>  -  Root layout with fonts, ThemeProvider, metadata, JSON-LD<br/>"
    "<font name='DejaVuSans'>src/app/globals.css</font>  -  Global styles, CSS variables, theme transitions<br/>"
    "<font name='DejaVuSans'>src/app/api/booking/route.ts</font>  -  Booking form POST handler (Zod validated)<br/>"
    "<font name='DejaVuSans'>src/app/api/newsletter/route.ts</font>  -  Newsletter subscription handler<br/>"
    "<font name='DejaVuSans'>src/components/sections/</font>  -  All page section components (hero, about, gallery, etc.)<br/>"
    "<font name='DejaVuSans'>src/components/ui/</font>  -  shadcn/ui primitives (button, dialog, form, etc.)<br/>"
    "<font name='DejaVuSans'>src/components/animations/</font>  -  Typewriter, fade-in, waveform effects<br/>"
    "<font name='DejaVuSans'>src/lib/i18n/</font>  -  English and French translation JSON files, I18nProvider<br/>"
    "<font name='DejaVuSans'>prisma/schema.prisma</font>  -  Database schema (User, Post models, SQLite)<br/>"
    "<font name='DejaVuSans'>next.config.ts</font>  -  Next.js config (standalone output, no TS errors)<br/>"
    "<font name='DejaVuSans'>tailwind.config.ts</font>  -  Tailwind with HSL CSS variable colors, class dark mode<br/>"
    "<font name='DejaVuSans'>Caddyfile</font>  -  Caddy reverse proxy config for port 3000<br/>"
    "<font name='DejaVuSans'>public/</font>  -  Static assets (favicon, OG image, manifest, robots.txt)",
    code_style
))

# ═══════════════════════════════════════════
# Chapter 5: Prerequisites
# ═══════════════════════════════════════════
story.append(add_heading("5. Prerequisites and Environment Setup", h1_style, 0))
story.append(Paragraph(
    "Before building or deploying the Miss Belle blog, your development machine or server "
    "must meet the following requirements. The standalone build mode significantly reduces "
    "the runtime dependencies on the deployment server, as it bundles its own minimal Node.js "
    "runtime. However, the build process itself requires a full development environment with "
    "Node.js (or Bun), npm (or Bun), and all project dependencies installed.",
    body_style
))

story.append(add_heading("5.1 Build Machine Requirements", h2_style, 1))
story.append(make_table(
    ["Requirement", "Minimum Version", "Recommended", "Notes"],
    [
        ["Node.js", "18.17.0", "20.x or 22.x LTS", "Required for Next.js 16; use nvm or fnm for version management"],
        ["Package Manager", "npm 9.x", "Bun 1.x", "Project uses bun.lock; Bun is significantly faster"],
        ["Git", "2.30+", "Latest", "For cloning the repository"],
        ["Disk Space", "500 MB", "1 GB", "Includes node_modules, .next build output, and standalone server"],
        ["OS", "Linux x64", "Ubuntu 22.04+ / Debian 12+", "Standalone output targets Linux; macOS works for development"],
    ],
    col_widths=[CW*0.18, CW*0.18, CW*0.24, CW*0.40],
))

story.append(add_heading("5.2 Deployment Server Requirements", h2_style, 1))
story.append(Paragraph(
    "Because the project uses <font name='DejaVuSans'>output: 'standalone'</font>, the "
    "deployment server does not need Node.js or npm installed. The standalone build produces a "
    "self-contained server at <font name='DejaVuSans'>.next/standalone/server.js</font> that "
    "includes only the minimal dependencies required to run. However, you still need a "
    "JavaScript runtime on the deployment machine to execute this server file. The options "
    "are listed below, along with a summary of what gets deployed to the server.",
    body_style
))
story.append(make_table(
    ["Option", "Runtime Needed", "Pros", "Cons"],
    [
        ["Node.js", "Node.js 18+", "Full compatibility, standard approach", "Must install and maintain Node.js"],
        ["Bun", "Bun 1.x", "Faster startup, used in dev", "Less common on hosting platforms"],
        ["Docker", "None (bundled)", "Reproducible, portable", "Larger image size (~150-200 MB)"],
        ["Vercel", "None (managed)", "Zero-config, auto-scaling", "Vendor lock-in, less control"],
    ],
    col_widths=[CW*0.14, CW*0.20, CW*0.32, CW*0.34],
))

# ═══════════════════════════════════════════
# Chapter 6: Local Development
# ═══════════════════════════════════════════
story.append(add_heading("6. Local Development", h1_style, 0))
story.append(Paragraph(
    "Setting up the project for local development is straightforward. Clone the repository, "
    "install dependencies, and start the development server. The development server supports "
    "hot module replacement (HMR), meaning changes to any source file are reflected instantly "
    "in the browser without a full page reload. This section covers the complete setup process "
    "step by step, from cloning the repository to verifying the development server is running.",
    body_style
))

story.append(add_heading("6.1 Setup Steps", h2_style, 1))
story.append(Paragraph(
    "Open a terminal in your project directory (after downloading and extracting the files) "
    "and run the following commands in sequence. If you are using Visual Studio Code, you can "
    "open the integrated terminal with Ctrl+` (backtick) and run these commands directly.",
    body_style
))
story.append(Paragraph(
    "# Step 1: Install dependencies<br/>"
    "npm install<br/>"
    "# Or if you have Bun installed (recommended, faster):<br/>"
    "bun install<br/><br/>"
    "# Step 2: (Optional) Set up the database<br/>"
    "npx prisma generate<br/>"
    "npx prisma db push<br/><br/>"
    "# Step 3: Start the development server<br/>"
    "npm run dev<br/>"
    "# Or with Bun:<br/>"
    "bun run dev<br/><br/>"
    "# Step 4: Open in browser<br/>"
    "# Navigate to http://localhost:3000",
    code_style
))

story.append(add_heading("6.2 Development Scripts", h2_style, 1))
story.append(make_table(
    ["Script", "Command", "Description"],
    [
        ["dev", "next dev -p 3000", "Start development server with HMR on port 3000"],
        ["build", "next build + copy static", "Production build with standalone output and asset copying"],
        ["start", "NODE_ENV=production bun .next/standalone/server.js", "Start production server from standalone build"],
        ["lint", "eslint .", "Run ESLint on all source files"],
        ["db:push", "prisma db push", "Push Prisma schema to SQLite database"],
        ["db:generate", "prisma generate", "Generate Prisma client from schema"],
    ],
    col_widths=[CW*0.15, CW*0.42, CW*0.43],
))

# ═══════════════════════════════════════════
# Chapter 7: Production Build
# ═══════════════════════════════════════════
story.append(add_heading("7. Production Build", h1_style, 0))
story.append(Paragraph(
    "The production build process compiles the Next.js application into an optimized, "
    "deployment-ready artifact. The build command in package.json performs three operations "
    "in sequence: first, it runs <font name='DejaVuSans'>next build</font> which compiles "
    "all pages and components, tree-shakes unused code, and generates the standalone server; "
    "second, it copies the <font name='DejaVuSans'>.next/static</font> directory into the "
    "standalone output; and third, it copies the <font name='DejaVuSans'>public/</font> "
    "directory into the standalone output. These copy steps are necessary because the standalone "
    "output does not automatically include static assets and public files.",
    body_style
))

story.append(add_heading("7.1 Build Command", h2_style, 1))
story.append(Paragraph(
    "# Run the production build<br/>"
    "npm run build<br/><br/>"
    "# The build output will be in:<br/>"
    "# .next/standalone/     - Self-contained server + minimal node_modules<br/>"
    "# .next/standalone/.next/static/  - JS/CSS bundles<br/>"
    "# .next/standalone/public/         - Static assets (favicon, OG images, manifest)",
    code_style
))

story.append(add_heading("7.2 Build Output Structure", h2_style, 1))
story.append(Paragraph(
    "After a successful build, the <font name='DejaVuSans'>.next/standalone/</font> directory "
    "contains everything needed to run the application in production. This directory is fully "
    "self-contained and can be copied to any server with a compatible runtime. The structure "
    "includes the standalone server entry point, a minimal set of node_modules containing only "
    "the production dependencies, the compiled page and API route handlers, and the static "
    "assets that were copied during the build step. The total size of the standalone directory "
    "is typically between 80 and 150 megabytes, depending on the number of dependencies.",
    body_style
))
story.append(Paragraph(
    ".next/standalone/<br/>"
    "|-- server.js              # Entry point: run with `node server.js` or `bun server.js`<br/>"
    "|-- .next/<br/>"
    "|   |-- server/            # Compiled server-side pages and API routes<br/>"
    "|   |-- static/            # Hashed JS/CSS chunks (copied from .next/static/)<br/>"
    "|-- node_modules/          # Minimal production dependencies only<br/>"
    "|-- public/                # Static assets (copied from project root public/)<br/>"
    "|-- package.json           # Minimal package.json for the standalone server",
    code_style
))

# ═══════════════════════════════════════════
# Chapter 8: Deployment Methods
# ═══════════════════════════════════════════
story.append(add_heading("8. Deployment Methods", h1_style, 0))
story.append(Paragraph(
    "The Miss Belle blog can be deployed using several strategies, ranging from a simple VPS "
    "with a manual process script to fully managed platforms that handle scaling and SSL "
    "automatically. This chapter covers the four recommended deployment methods in detail, "
    "each with complete step-by-step instructions. The choice of method depends on your "
    "budget, technical expertise, and expected traffic volume. For most personal artist "
    "websites, a basic VPS deployment or Vercel is the most appropriate choice.",
    body_style
))

story.append(add_heading("8.1 Method A: VPS with PM2 (Recommended for Control)", h2_style, 1))
story.append(Paragraph(
    "Deploying to a Virtual Private Server gives you full control over the runtime environment, "
    "domain configuration, and process management. This method uses PM2, a production process "
    "manager for Node.js, to keep the application running and automatically restart it if it "
    "crashes. The steps assume you have a Linux server (Ubuntu 22.04 or Debian 12) with SSH "
    "access and a registered domain name pointing to your server's IP address.",
    body_style
))
story.append(Paragraph(
    "# On your LOCAL machine - build and upload<br/>"
    "npm run build<br/>"
    "cd .next/standalone<br/>"
    "tar -czf missbelle-deploy.tar.gz .<br/>"
    "scp missbelle-deploy.tar.gz user@your-server:/home/user/<br/><br/>"
    "# On your SERVER - extract and run<br/>"
    "mkdir -p /var/www/missbelle<br/>"
    "cd /var/www/missbelle<br/>"
    "tar -xzf /home/user/missbelle-deploy.tar.gz<br/><br/>"
    "# Install PM2 globally and start the app<br/>"
    "npm install -g pm2<br/>"
    "pm2 start server.js --name missbelle<br/>"
    "pm2 save<br/>"
    "pm2 startup  # generates command to auto-start on boot",
    code_style
))

story.append(add_heading("8.2 Method B: Docker Container", h2_style, 1))
story.append(Paragraph(
    "Docker provides a fully portable and reproducible deployment environment. The container "
    "image includes the standalone server, all required files, and a minimal Linux base, making "
    "it easy to deploy to any platform that supports Docker (AWS ECS, Google Cloud Run, DigitalOcean "
    "App Platform, or any VPS with Docker installed). Create a Dockerfile in the project root "
    "with the following content, build the image locally, and push it to a container registry "
    "or deploy it directly.",
    body_style
))
story.append(Paragraph(
    "# Dockerfile (place in project root)<br/>"
    "FROM node:20-alpine AS builder<br/>"
    "WORKDIR /app<br/>"
    "COPY package.json bun.lock ./<br/>"
    "RUN npm install<br/>"
    "COPY . .<br/>"
    "RUN npm run build<br/><br/>"
    "FROM node:20-alpine AS runner<br/>"
    "WORKDIR /app<br/>"
    "ENV NODE_ENV=production<br/>"
    "ENV PORT=3000<br/>"
    "COPY --from=builder /app/.next/standalone ./<br/>"
    "EXPOSE 3000<br/>"
    'CMD ["node", "server.js"]',
    code_style
))

story.append(add_heading("8.3 Method C: Vercel (Easiest, Zero-Config)", h2_style, 1))
story.append(Paragraph(
    "Vercel is the recommended hosting platform for Next.js applications and provides the "
    "simplest deployment experience. Simply connect your Git repository (GitHub, GitLab, or "
    "Bitbucket) to Vercel, and every push to the main branch triggers an automatic build and "
    "deployment. Vercel handles SSL certificates, CDN distribution, serverless function "
    "execution, and automatic scaling without any configuration. The free tier is sufficient "
    "for a personal artist website. Note that Vercel ignores the "
    "<font name='DejaVuSans'>output: 'standalone'</font> setting and uses its own optimized "
    "deployment pipeline, so no changes to the codebase are needed.",
    body_style
))
story.append(Paragraph(
    "# Deploy to Vercel (requires Vercel CLI)<br/>"
    "npm i -g vercel<br/>"
    "vercel login<br/>"
    "vercel --prod<br/><br/>"
    "# Or connect via the Vercel web dashboard:<br/>"
    "# 1. Go to vercel.com and sign in with GitHub<br/>"
    "# 2. Click 'New Project' and import your repository<br/>"
    "# 3. Vercel auto-detects Next.js and deploys<br/>"
    "# 4. Add custom domain: missbelle.art in Project Settings",
    code_style
))

story.append(add_heading("8.4 Method D: Caddy Reverse Proxy", h2_style, 1))
story.append(Paragraph(
    "If you already have a VPS running the standalone server on port 3000, you can use Caddy "
    "as a reverse proxy to handle HTTPS termination, automatic SSL certificate provisioning "
    "via Let's Encrypt, and static file serving. The project includes a Caddyfile in the "
    "repository root that is configured to proxy requests to localhost:3000. To use it, "
    "install Caddy on your server, copy the Caddyfile to the appropriate location, and "
    "update the domain name. Caddy will automatically obtain and renew SSL certificates.",
    body_style
))
story.append(Paragraph(
    "# Install Caddy on Ubuntu/Debian<br/>"
    "sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https<br/>"
    "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg<br/>"
    "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list<br/>"
    "sudo apt update && sudo apt install caddy<br/><br/>"
    "# Copy Caddyfile and restart<br/>"
    "sudo cp Caddyfile /etc/caddy/Caddyfile<br/>"
    "# Edit the file to replace ':81' with 'missbelle.art'<br/>"
    "sudo systemctl restart caddy<br/>"
    "sudo systemctl enable caddy",
    code_style
))

# ═══════════════════════════════════════════
# Chapter 9: Environment Variables
# ═══════════════════════════════════════════
story.append(add_heading("9. Environment Variables and Configuration", h1_style, 0))
story.append(Paragraph(
    "The application currently requires only one environment variable for full functionality: "
    "the database connection URL used by Prisma. All other configuration is handled through "
    "hardcoded values in the source code (such as the domain name in metadata and the theme "
    "default). The table below lists the current and planned environment variables, including "
    "those that will be needed when integrating email services for the booking and newsletter "
    "API routes. When deploying, create a <font name='DejaVuSans'>.env</font> file in the "
    "project root (or the standalone directory) with the required variables.",
    body_style
))
story.append(make_table(
    ["Variable", "Required", "Default", "Description"],
    [
        ["DATABASE_URL", "Yes", "file:./db/custom.db", "SQLite connection string for Prisma ORM"],
        ["PORT", "No", "3000", "Port for the standalone server to listen on"],
        ["HOSTNAME", "No", "0.0.0.0", "Hostname to bind (use 0.0.0.0 for all interfaces)"],
        ["RESEND_API_KEY", "Planned", "-", "API key for Resend email service (booking notifications)"],
        ["BUTTONDOWN_API_KEY", "Planned", "-", "API key for Buttondown newsletter service"],
        ["CONTACT_EMAIL", "Planned", "-", "Destination email for booking form submissions"],
    ],
    col_widths=[CW*0.22, CW*0.10, CW*0.28, CW*0.40],
))

# ═══════════════════════════════════════════
# Chapter 10: Post-Deployment Verification
# ═══════════════════════════════════════════
story.append(add_heading("10. Post-Deployment Verification", h1_style, 0))
story.append(Paragraph(
    "After deploying the application to your server, perform the following verification checks "
    "to ensure everything is functioning correctly. These checks cover the core functionality "
    "of the site, including page rendering, interactivity, theme switching, form submissions, "
    "and SEO metadata. Run through each check systematically and address any issues before "
    "considering the deployment complete.",
    body_style
))

story.append(add_heading("10.1 Verification Checklist", h2_style, 1))
story.append(make_table(
    ["Check", "How to Verify", "Expected Result"],
    [
        ["Page loads", "Open missbelle.art in browser", "Hero section renders with typewriter animation"],
        ["Dark/Light mode", "Click the sun/moon icon in navigation", "Theme switches smoothly without flash"],
        ["Language toggle", "Click EN/FR toggle in navigation", "All visible text switches language"],
        ["Scroll animations", "Scroll down the page slowly", "Sections animate in as they enter viewport"],
        ["Gallery lightbox", "Click any gallery image", "Lightbox opens with smooth transition"],
        ["Booking form", "Fill out and submit the booking form", "Success toast notification appears"],
        ["Newsletter", "Enter email and subscribe", "Success message appears"],
        ["Mobile responsive", "Open in mobile browser or DevTools", "All sections stack vertically, menu collapses"],
        ["SEO meta", "View page source or use browser DevTools", "Title, description, OG tags, JSON-LD present"],
        ["SSL/HTTPS", "Check browser address bar", "Green lock icon, https:// prefix"],
    ],
    col_widths=[CW*0.18, CW*0.40, CW*0.42],
))

story.append(add_heading("10.2 Performance Testing", h2_style, 1))
story.append(Paragraph(
    "Use Google Lighthouse (built into Chrome DevTools) or web.dev/measure to run a performance "
    "audit on the deployed site. With the code-splitting optimizations in place, you should see "
    "a Performance score above 85, with First Contentful Paint under 1.5 seconds and Largest "
    "Contentful Paint under 2.5 seconds on a 4G mobile connection. If scores are lower, check "
    "that the standalone build was created correctly with the static assets copied into the "
    "standalone directory. Also verify that the server is running in production mode "
    "(<font name='DejaVuSans'>NODE_ENV=production</font>), as development mode is significantly "
    "slower and should never be used in production.",
    body_style
))

# ═══════════════════════════════════════════
# Chapter 11: Troubleshooting
# ═══════════════════════════════════════════
story.append(add_heading("11. Troubleshooting Common Issues", h1_style, 0))
story.append(Paragraph(
    "This chapter addresses the most common issues you may encounter during development, "
    "building, and deployment. Each issue includes a description of the problem, the likely "
    "root cause, and the specific steps to resolve it. If you encounter an issue not covered "
    "here, check the Next.js documentation at nextjs.org/docs and the project's worklog at "
    "<font name='DejaVuSans'>worklog.md</font> for additional context about known issues "
    "and their resolutions.",
    body_style
))
story.append(make_table(
    ["Issue", "Likely Cause", "Solution"],
    [
        ["Build fails with module not found", "Missing dependencies", "Run npm install or bun install to reinstall all packages"],
        ["Blank page after deployment", "Static assets not copied", "Ensure the build script copies .next/static and public/ into .next/standalone/"],
        ["Theme flash on page load", "Missing disableTransitionOnChange", "Verify ThemeProvider has disableTransitionOnChange={true} in layout.tsx"],
        ["Font not loading (squares/garbled)", "Google Fonts blocked or slow", "Check network tab; fonts use display:swap so fallback fonts show first"],
        ["Port 3000 already in use", "Another process on port", "Kill the process: lsof -i :3000 then kill -9 PID, or change port"],
        ["API returns 500 error", "Missing environment variable", "Check DATABASE_URL is set in .env file at project root"],
        ["CLS (layout shift) on load", "Loading placeholders wrong height", "Adjust the height values in the dynamic() loading callbacks in page.tsx"],
        ["CSS transitions not smooth", "Wildcard selector still present", "Ensure globals.css uses targeted selectors, not *, *::before, *::after"],
    ],
    col_widths=[CW*0.22, CW*0.30, CW*0.48],
))

# ━━ Build ━━
doc.multiBuild(story)
print(f"Body PDF built: {OUTPUT_PATH}")