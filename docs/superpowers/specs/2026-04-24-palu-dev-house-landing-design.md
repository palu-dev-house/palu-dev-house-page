# Palu Dev House — Landing Page Design Spec

**Date:** 2026-04-24
**Status:** Approved for implementation planning

## Goal

Ship a minimal, SEO-focused landing page for Palu Dev House — a software house offering landing pages, web applications (POS/ERP/Booking), and SEO services to Indonesian UMKM and mid-market businesses. The site must out-rank and out-convert `umkmwebdev.com` on Indonesian keywords.

Deliberately **not** included: admin panel, CMS, client portal, authentication, blog (scoped for later), founder section, philosophy section.

## Brand & stack

- **Name:** Palu Dev House
- **Domain:** paludevhouse.site
- **Language:** Indonesian only
- **Tech:** Next.js 15 (Pages Router) + TypeScript + Tailwind CSS + Framer Motion (for subtle section-level motion)
- **Hosting:** Vercel free tier
- **Visual style:** Minimal mono + blue accent (`#2065A1`), Linear/Stripe-inspired, light mode default with dark mode toggle
- **Logo:** Existing SVG (blue house silhouette) — used in header, footer, favicon, OG image

## Target keywords (SEO)

Primary:
- `jasa pembuatan website Palu`
- `jasa pembuatan website Medan`
- `aplikasi kasir cafe`
- `aplikasi POS FnB`
- `jasa SEO UMKM`
- `jasa SEO Indonesia`

Secondary:
- `web developer Palu`
- `software house Medan`
- `bikin website toko`
- `aplikasi kasir online`

## Site map

Single-page scroll + 2 SEO sub-pages.

**`/` (main)**
1. Hero — "Website & Aplikasi yang Bikin Bisnismu Naik Kelas"
2. Kenapa Bisnis Butuh Aplikasi/Website — 4 business-outcome cards (no tech jargon)
3. Mengapa Palu Dev House — 3 value cards (transaksi, jangkauan, simpel)
4. Layanan — 3 package cards (Landing Page / Web App / SEO)
5. Rekomendasi Paket — interactive quiz (4 questions → recommended package + CTA)
6. Portfolio — logo strip (tokoninja, hinno.art, tuition-app) with live-site links
7. Harga — 3 pricing tables
8. FAQ — 6–8 items
9. Kontak — WhatsApp CTA + form + lokasi (Medan & Palu)
10. Footer

**`/harga`** — full pricing detail with add-ons, payment terms, and comparison

**`/seo`** — SEO service deep-dive (keyword strategy, deliverables, reporting cadence)

## Educational content — "Kenapa Bisnis Butuh Aplikasi/Website?"

4 business-outcome cards, no tech jargon, each ~2 sentences:

1. **Tambah Volume Transaksi**
   "Kasir digital + online ordering bisa tambah transaksi hingga 40%. Pelanggan order tanpa antri, pembayaran tercatat otomatis, kamu fokus ke operasional."

2. **Jangkau Pelanggan Baru**
   "Website yang muncul di Google = pelanggan nyari kamu duluan. 70%+ pelanggan cek bisnis di Google sebelum datang — kalau kamu ga ada, kompetitor yang dapat."

3. **Hemat Waktu & Biaya Operasional**
   "Laporan otomatis, stok terupdate real-time, satu dashboard untuk semua outlet. Tutup toko dari 2 jam jadi 15 menit."

4. **Data Pelanggan Jadi Aset**
   "Catat pelanggan, kasih promo berdasarkan histori order. Bisnis bukan cuma jualan — tapi bangun komunitas yang balik terus."

## Recommendation quiz — "Paket Mana yang Cocok Untuk Saya?"

Client-side interactive quiz, 4 questions, single-page reveal. No server roundtrip. State managed via `useState` / `useReducer`.

### Quiz flow

**Q1: Jenis bisnis kamu?**
- A) Cafe / Restoran / FnB
- B) Retail / Toko
- C) Jasa / Booking (salon, klinik, coaching)
- D) Edukasi / Kursus
- E) Lainnya

**Q2: Status digital saat ini?**
- A) Belum punya website / aplikasi sama sekali
- B) Sudah punya tapi kuno / lemot
- C) Sudah punya, mau upgrade fitur

**Q3: Transaksi harian rata-rata?**
- A) < 20 transaksi
- B) 20–100 transaksi
- C) 100+ transaksi / multi-outlet

**Q4: Tujuan utama kamu?**
- A) Dapat lebih banyak pelanggan (branding + Google)
- B) Efisiensi operasional (kasir, stok, laporan)
- C) Jangkau daerah baru (online ordering, delivery)
- D) Professional image (website elegan + SEO)

### Scoring rule

Scoring is a simple lookup table keyed on combinations:

- **Landing Page Starter/Pro** — when Q2=A and Q4=A or D (needs digital presence first)
- **Standard POS/Kasir** — when Q1=A or B, Q3=A or B, Q4=B (operational focus, single outlet)
- **Pro ERP** — when Q3=C or Q1=B with multi-outlet signal, Q4=B or C
- **Booking/Tuition** — when Q1=C or D, Q4=A or B
- **SEO (Growth/Dominate)** — when Q2=B or C, Q4=A or C (already has site, wants reach)
- **Landing Page + SEO bundle** — when Q2=A, Q4=A or C (needs both site and SEO to get discovered)

### Output card

After Q4, display:
- **Headline:** "Rekomendasi untuk bisnis kamu: Paket [X]"
- **Why:** 2-sentence explanation referencing their answers ("Karena bisnis cafe dengan 20–100 transaksi harian butuh kasir digital yang cepat...")
- **Price:** shown prominently
- **2 CTAs:** "Chat WhatsApp sekarang" (prefilled with quiz answers) + "Lihat paket lengkap" (scrolls to Harga section)
- **Secondary:** "Ga yakin? Konsultasi gratis" → WhatsApp

### Logic location

- Questions + scoring rules → `lib/recommendation.ts` (pure function `recommend(answers): Package`)
- UI component → `components/sections/Recommendation.tsx`
- Keep logic separate from UI so it's unit-testable.

## Pricing (single source of truth)

### Landing Page (one-time)
| Tier | Harga | Isi |
|---|---|---|
| Starter | Rp 2.000.000 | 1–3 halaman, mobile-responsive, form WhatsApp, domain + hosting 1 tahun |
| Pro | Rp 4.500.000 | 5+ halaman, CMS simple, SEO on-page, animasi, 3x revisi, domain + hosting 1 tahun |
| Custom | Mulai Rp 8.000.000 | E-commerce / booking / multi-language / integrasi payment |

### Web Application (one-time build + monthly)
| Tier | Harga Build | Biaya Bulanan | Isi |
|---|---|---|---|
| Standard POS/Kasir | Rp 8.000.000 | Rp 250.000 | 1 outlet, menu, transaksi, laporan, cetak struk |
| Pro ERP | Rp 18.000.000 | Rp 500.000 | Multi-outlet, inventory, staff, analytics, WhatsApp integration |
| Booking/Tuition | Rp 12.000.000 | Rp 350.000 | Jadwal, booking online, payment gateway, notifikasi |
| Enterprise | Mulai Rp 35.000.000 | Mulai Rp 1.000.000 | Custom workflow, integrasi API, mobile app |

### SEO (monthly, minimum 3-month contract)
| Tier | Harga/bulan | Isi |
|---|---|---|
| Basic | Rp 1.500.000 | 5 keywords, on-page, Google Business Profile, laporan bulanan |
| Growth | Rp 3.500.000 | 15 keywords, 4 artikel SEO/bulan, technical audit, backlink, laporan mingguan |
| Dominate | Rp 7.000.000 | 30+ keywords, 8 artikel/bulan, PR & backlink premium, competitor analysis |

### Add-ons
- Perpanjangan domain: Rp 300.000/tahun
- Hosting tambahan: mulai Rp 150.000/bulan
- Revisi tambahan setelah launch: Rp 500.000/revisi
- Training penggunaan aplikasi: Rp 1.000.000 (2 jam)

### Payment terms
- Option A: 50% DP / 50% saat launch
- Option B: 30% DP / 40% mid-project / 30% launch
- Option C: Full upfront (diskon 10%)
- Transfer: BCA / QRIS

## Portfolio entries

Logo strip only (no case-study copy yet). Each entry links to the live site.

- Toko Ninja — https://tokoninja.com/
- Toko Ninja ERP — https://erp.tokoninja.com/
- Toko Ninja POS — https://pos.tokoninja.com/
- Hinno Art — https://hinno.art/
- Tuition App — https://tuition-app.up.railway.app/

## Contact

- **Lokasi:** Medan & Palu, Sulawesi Tengah
- **WhatsApp:** TBD (placeholder until user provides)
- **Email:** TBD (placeholder until user provides)
- **Instagram:** TBD (optional)

## Design system

### Colors
- Primary: `#2065A1` (logo blue)
- Primary-light: `#EDF4F8` (logo light)
- Ink: `#0A0A0A` (primary text, light mode)
- Ink-muted: `#525252`
- Surface: `#FFFFFF`
- Surface-muted: `#F7F7F8`
- Border: `#E5E5E5`
- Dark mode: inverted with `#0A0A0A` surface, `#F7F7F8` ink, primary brightened to `#4A8FCC`

### Typography
- Headings: Inter (tight tracking, 600–700 weight)
- Body: Inter (400 weight, 1.6 line-height)
- No serif. No decorative fonts.

### Layout
- Max content width: 1200px (pricing/grid sections), 720px (text sections)
- Section vertical padding: 96px desktop, 64px mobile
- Grid: 12-column on desktop, stacked on mobile (< 768px)

### Motion (Framer Motion)
- **Library:** `framer-motion` — used sparingly, minimalism first
- **Hero:** staggered fade-up for headline → sub-copy → CTAs (200ms each, ease-out, total < 800ms)
- **Section scroll-in:** `whileInView` fade + 12px translate-up, once per session, 300ms
- **Cards (services/pricing/portfolio):** stagger children on enter (60ms delay between siblings)
- **Buttons & cards hover:** `whileHover` lift (2px translate, soft shadow), `whileTap` 0.98 scale
- **Theme toggle:** cross-fade icon swap
- **Respect `prefers-reduced-motion`:** all transitions fall back to instant when user opts out
- **No parallax, no auto-play video, no full-page entrance overlays** — motion must not delay LCP

## Caching & cache-busting

- **Static assets (`/_next/static/*`):** Next.js emits hashed filenames per build → `Cache-Control: public, max-age=31536000, immutable` (set automatically). New deploy = new hash = browser fetches fresh file.
- **HTML pages (SSG):** served from Vercel CDN with `Cache-Control: public, max-age=0, s-maxage=31536000, stale-while-revalidate`. CDN caches the HTML; browser revalidates on every request.
- **Images (`next/image`):** optimized and cached at the edge with `Cache-Control: public, max-age=31536000, immutable` (hashed URLs).
- **Fonts:** self-hosted via `next/font` with `display: swap`, cached with 1-year immutable headers.
- **CDN purge on deploy:** Vercel automatically invalidates the edge cache when a new deployment is promoted to production — no manual action needed.
- **Build ID:** Next.js generates a unique `BUILD_ID` per deploy (visible in `/_next/BUILD_ID`). Used for client-side navigation cache invalidation — old tabs detect new build and refetch.
- **`next.config.js` custom headers:** explicit `headers()` block to reinforce the above + add security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **No service worker / PWA** for v1 — landing page doesn't need offline. Avoids the "stuck on old cache" problem entirely.

## SEO implementation

- **Metadata:** unique `<title>` + `<meta description>` per page; in-page sections use semantic `<section>` with `<h2>`
- **Structured data (JSON-LD):**
  - `LocalBusiness` on `/` with addresses for Medan & Palu
  - `Service` entries on `/harga` for each tier
  - `FAQPage` on `/` for FAQ section
- **Sitemap:** auto-generated via `next-sitemap`
- **Robots.txt:** allow all, sitemap reference
- **Open Graph + Twitter Card:** og-image.png (1200×630), unique per page
- **Performance targets:** LCP < 2.5s, CLS < 0.1, TTFB < 600ms
- **Rendering:** SSG for `/`, `/harga`, `/seo`; ISR not needed (content rarely changes)

## File structure

```
palu-dev-house/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── harga.tsx
│   ├── seo.tsx
│   ├── 404.tsx
│   └── api/
│       └── contact.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── WhyDigital.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Services.tsx
│   │   ├── Recommendation.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── PricingTable.tsx
│       └── ThemeToggle.tsx
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.png
├── lib/
│   ├── pricing.ts
│   ├── portfolio.ts
│   ├── faq.ts
│   ├── recommendation.ts
│   └── seo.ts
├── styles/
│   └── globals.css
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── next-sitemap.config.js
└── package.json
```

## Unit boundaries

- **`lib/pricing.ts`** — exports typed pricing data consumed by `Pricing`, `/harga`, and `Services`. Changing a price requires only editing this file.
- **`lib/portfolio.ts`** — portfolio entries (name, url, logo path).
- **`lib/faq.ts`** — FAQ items (used by `FAQ` section and `FAQPage` JSON-LD).
- **`lib/recommendation.ts`** — pure `recommend(answers)` function + question data. Unit-testable scoring rules decoupled from UI.
- **`lib/seo.ts`** — metadata helper: `buildMeta({ title, description, path })` returns consistent `<Head>` tags.
- **`components/sections/*`** — pure presentational; all copy passed as props or imported from `lib/`.
- **`components/ui/*`** — reusable, no business logic.
- **`pages/api/contact.ts`** — form handler. For v1: logs submission + forwards to email/WhatsApp webhook (details deferred until user provides contact info).

Each unit is testable in isolation and changeable without touching consumers.

## Out of scope (explicitly)

- No admin panel or CMS
- No user authentication
- No blog (file structure prepped, not built)
- No client portal or dashboard
- No founder bio or philosophy section
- No multi-language (Indonesian only)
- No heavy animations or parallax
- No payment processing on the site itself (contact → quote → offline transfer)

## Success criteria

1. Lighthouse scores ≥ 95 on Performance, SEO, Accessibility, Best Practices for `/`, `/harga`, `/seo`
2. All 3 pages render valid HTML with proper `<title>`, `<meta description>`, Open Graph, JSON-LD
3. Pricing in `lib/pricing.ts` matches spec exactly, reflected in both `/` section and `/harga` page
4. Mobile (< 768px) layout works without horizontal scroll on iPhone SE width (375px)
5. WhatsApp CTA opens `wa.me/<number>` with prefilled message (once number provided)
6. Contact form submits without JS errors (backend handling can be stub until email/WhatsApp confirmed)
7. Dark mode toggle works, persists via `localStorage`
8. Sitemap.xml generates on build with all 3 public routes
9. Deploys to Vercel free tier without build errors
10. Recommendation quiz returns a valid package for every combination of Q1–Q4 answers (no "undefined" output)
11. Recommendation scoring logic has ≥ 80% branch coverage in unit tests (`lib/recommendation.ts`)
12. Cache-Control headers verified via `curl -I` on deployed URL: HTML revalidates, static assets immutable
