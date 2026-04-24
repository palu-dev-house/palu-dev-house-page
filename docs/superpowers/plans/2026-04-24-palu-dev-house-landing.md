# Palu Dev House Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a minimal, SEO-focused Indonesian landing page for Palu Dev House at paludevhouse.site — showcases 3 service packages (Landing Page, Web App, SEO) with pricing, an interactive recommendation quiz, and business-outcome content to convert UMKM/mid-market buyers.

**Architecture:** Next.js 15 (Pages Router) + TypeScript + Tailwind CSS + Framer Motion. Single-page scroll on `/` with 2 SEO sub-pages (`/harga`, `/seo`). All data (pricing, FAQ, portfolio, quiz logic) lives in `lib/` as single sources of truth. SSG for all public routes. Deploy to Vercel free tier. Caching handled by Next.js + Vercel CDN with hashed asset URLs and auto CDN purge on deploy.

**Tech Stack:** Next.js 15, React 18, TypeScript 5, Tailwind CSS 3, Framer Motion 11, next-sitemap, Vitest (for unit tests on logic).

**Spec:** `docs/superpowers/specs/2026-04-24-palu-dev-house-landing-design.md`

---

## File Structure

```
palu-dev-house/
├── pages/
│   ├── _app.tsx              # Theme provider, global layout wrapper
│   ├── _document.tsx         # HTML scaffold, font preload, JSON-LD base
│   ├── index.tsx             # Landing page (composes all sections)
│   ├── harga.tsx             # Pricing detail page
│   ├── seo.tsx               # SEO service deep-dive
│   ├── 404.tsx               # Custom 404
│   └── api/
│       └── contact.ts        # Form submission stub → logs + future webhook
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Logo + nav + theme toggle
│   │   ├── Footer.tsx        # Links + social + copyright
│   │   └── Container.tsx     # Consistent max-width wrapper
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── WhyDigital.tsx    # 4 business-outcome cards
│   │   ├── WhyUs.tsx         # 3 value cards (Palu Dev House)
│   │   ├── Services.tsx      # 3 package cards
│   │   ├── Recommendation.tsx # Interactive quiz
│   │   ├── Portfolio.tsx     # Logo strip + live links
│   │   ├── Pricing.tsx       # 3 pricing tables
│   │   ├── FAQ.tsx           # Accordion, JSON-LD FAQPage
│   │   └── Contact.tsx       # WhatsApp CTA + form + location
│   └── ui/
│       ├── Button.tsx        # Primary / secondary / ghost variants
│       ├── Card.tsx          # Hover lift, border, dark-mode aware
│       ├── Badge.tsx         # Small labels (e.g. "Popular")
│       ├── PricingTable.tsx  # Tier card (name, price, features, CTA)
│       ├── ThemeToggle.tsx   # Light/dark switch, localStorage persistence
│       └── MotionSection.tsx # Framer Motion wrapper with scroll-in fade
├── lib/
│   ├── pricing.ts            # Typed pricing data (single source of truth)
│   ├── portfolio.ts          # Portfolio entries
│   ├── faq.ts                # FAQ items
│   ├── recommendation.ts     # Quiz questions + scoring + recommend(answers)
│   ├── seo.ts                # buildMeta({title, description, path}) helper
│   └── theme.ts              # Theme context + hook
├── public/
│   ├── logo.svg              # Provided SVG
│   ├── favicon.ico           # Derived from logo
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── og-image.png          # 1200×630
├── styles/
│   └── globals.css           # Tailwind + CSS custom props + base styles
├── tests/
│   └── recommendation.test.ts # Vitest for quiz logic
├── next.config.js            # Headers, images, poweredByHeader off
├── next-sitemap.config.js    # Sitemap generation
├── tailwind.config.ts        # Design tokens
├── tsconfig.json
├── postcss.config.js
├── vitest.config.ts
├── .gitignore
├── .eslintrc.json
├── package.json
└── README.md
```

---

## Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `next.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Initialize project in empty directory**

```bash
cd /Users/ferdylim/palu-dev-house
git init
```

- [ ] **Step 2: Create package.json**

Write to `package.json`:

```json
{
  "name": "palu-dev-house",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postbuild": "next-sitemap",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "framer-motion": "11.11.17"
  },
  "devDependencies": {
    "@types/node": "22.9.0",
    "@types/react": "18.3.12",
    "@types/react-dom": "18.3.1",
    "autoprefixer": "10.4.20",
    "eslint": "9.14.0",
    "eslint-config-next": "15.0.3",
    "next-sitemap": "4.2.3",
    "postcss": "8.4.49",
    "tailwindcss": "3.4.15",
    "typescript": "5.6.3",
    "vitest": "2.1.5"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: `added ~300 packages` without errors. `node_modules/` and `package-lock.json` exist.

- [ ] **Step 4: Create tsconfig.json**

Write to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create .gitignore**

Write to `.gitignore`:

```
node_modules/
.next/
out/
dist/
*.log
.env*.local
.DS_Store
.vercel
next-env.d.ts
coverage/
```

- [ ] **Step 6: Create next.config.js**

Write to `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 7: Create postcss.config.js**

Write to `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore next.config.js postcss.config.js
git commit -m "chore: initialize next.js 15 project with pages router"
```

---

## Task 2: Configure Tailwind with design tokens

**Files:**
- Create: `tailwind.config.ts`
- Create: `styles/globals.css`

- [ ] **Step 1: Create tailwind.config.ts**

Write to `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2065A1',
          light: '#EDF4F8',
          dark: '#4A8FCC',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          muted: '#525252',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F7F8',
        },
        line: '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        prose: '720px',
      },
      spacing: {
        section: '96px',
        'section-sm': '64px',
      },
      boxShadow: {
        lift: '0 4px 20px -4px rgba(32, 101, 161, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Create styles/globals.css**

Write to `styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-brand: #2065A1;
  --color-brand-light: #EDF4F8;
  --color-ink: #0A0A0A;
  --color-ink-muted: #525252;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F7F7F8;
  --color-line: #E5E5E5;
}

.dark {
  --color-brand: #4A8FCC;
  --color-brand-light: #0F2A42;
  --color-ink: #F7F7F8;
  --color-ink-muted: #A3A3A3;
  --color-surface: #0A0A0A;
  --color-surface-muted: #171717;
  --color-line: #262626;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-surface);
  color: var(--color-ink);
  font-family: Inter, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.2s ease, color 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

::selection {
  background-color: var(--color-brand);
  color: #FFFFFF;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts styles/globals.css
git commit -m "feat: add tailwind config with design tokens"
```

---

## Task 3: Create logo and public assets

**Files:**
- Create: `public/logo.svg` (copy from Downloads)
- Create: `public/favicon.svg`
- Create: `public/og-image.png` (placeholder 1200×630)

- [ ] **Step 1: Copy the logo SVG**

```bash
mkdir -p public
cp "/Users/ferdylim/Downloads/Palu Dev House.svg" public/logo.svg
```

- [ ] **Step 2: Create favicon.svg**

Write to `public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
<path d="M0 0 C60.29 -0.12 60.29 -0.12 85.6 -0.15 C91.38 -0.15 97.16 -0.16 102.94 -0.16 C104.03 -0.17 104.03 -0.17 105.14 -0.17 C116.81 -0.18 128.48 -0.20 140.14 -0.23 C152.14 -0.26 164.13 -0.28 176.12 -0.28 C182.85 -0.29 189.58 -0.30 196.31 -0.32 C202.65 -0.34 208.99 -0.34 215.33 -0.34 C217.65 -0.34 219.97 -0.35 222.29 -0.36 C234.90 -0.42 246.70 0.01 259 3 C259 3.99 259 4.98 259 6 L83 78 C83.02 79.07 83.04 80.14 83.06 81.25 C83.24 91.37 83.38 101.49 83.47 111.62 L83 167.91 L2 231 C0 154.77 0 78.54 0 0 Z" fill="#2065A1" transform="translate(354,303)"/>
</svg>
```

- [ ] **Step 3: Generate a simple OG image placeholder**

Create `public/og-image.png` as a 1200×630 placeholder. For now, use a simple solid background SVG converted, or skip and add in a later polish task. Use this SVG saved as `og-image.svg` (will convert later):

Write to `public/og-image.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2065A1"/>
  <text x="600" y="300" font-family="Inter, sans-serif" font-size="72" font-weight="700" fill="#FFFFFF" text-anchor="middle">Palu Dev House</text>
  <text x="600" y="380" font-family="Inter, sans-serif" font-size="32" font-weight="400" fill="#EDF4F8" text-anchor="middle">Website &amp; Aplikasi untuk Bisnis</text>
</svg>
```

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "chore: add logo, favicon, and og-image assets"
```

---

## Task 4: Create pricing data (single source of truth)

**Files:**
- Create: `lib/pricing.ts`

- [ ] **Step 1: Write typed pricing data**

Write to `lib/pricing.ts`:

```ts
export type PackageCategory = 'landing' | 'webapp' | 'seo';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceNumeric: number;
  monthly?: string;
  monthlyNumeric?: number;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
}

export interface PricingPackage {
  category: PackageCategory;
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export const landingPackage: PricingPackage = {
  category: 'landing',
  title: 'Landing Page',
  subtitle: 'Website profesional yang dibuat sekali, jadi aset bisnis selamanya.',
  tiers: [
    {
      id: 'landing-starter',
      name: 'Starter',
      price: 'Rp 2.000.000',
      priceNumeric: 2000000,
      features: [
        '1–3 halaman responsive',
        'Mobile-first design',
        'Form WhatsApp terintegrasi',
        'Domain + hosting 1 tahun',
        'SSL + keamanan dasar',
        'Revisi: 1x',
      ],
      ctaLabel: 'Mulai dengan Starter',
    },
    {
      id: 'landing-pro',
      name: 'Pro',
      price: 'Rp 4.500.000',
      priceNumeric: 4500000,
      popular: true,
      features: [
        '5+ halaman custom',
        'CMS simple (edit konten sendiri)',
        'SEO on-page optimization',
        'Animasi & motion design',
        'Domain + hosting 1 tahun',
        'Revisi: 3x',
      ],
      ctaLabel: 'Ambil paket Pro',
    },
    {
      id: 'landing-custom',
      name: 'Custom',
      price: 'Mulai Rp 8.000.000',
      priceNumeric: 8000000,
      features: [
        'E-commerce / booking / multi-bahasa',
        'Integrasi payment gateway',
        'Custom design & animasi',
        'Domain + hosting 1 tahun',
        'Revisi: unlimited hingga launch',
        'Support 30 hari setelah launch',
      ],
      ctaLabel: 'Konsultasi custom',
    },
  ],
};

export const webappPackage: PricingPackage = {
  category: 'webapp',
  title: 'Web Application',
  subtitle: 'Aplikasi kasir, ERP, booking — bikin operasional bisnis lebih efisien.',
  tiers: [
    {
      id: 'webapp-pos',
      name: 'Standard POS/Kasir',
      price: 'Rp 8.000.000',
      priceNumeric: 8000000,
      monthly: 'Rp 250.000/bulan',
      monthlyNumeric: 250000,
      features: [
        '1 outlet',
        'Menu & produk management',
        'Transaksi real-time',
        'Laporan harian/bulanan',
        'Cetak struk',
        'Hosting + maintenance',
      ],
      ctaLabel: 'Pilih paket POS',
    },
    {
      id: 'webapp-erp',
      name: 'Pro ERP',
      price: 'Rp 18.000.000',
      priceNumeric: 18000000,
      monthly: 'Rp 500.000/bulan',
      monthlyNumeric: 500000,
      popular: true,
      features: [
        'Multi-outlet',
        'Inventory tracking',
        'Staff management & shift',
        'Analytics & dashboard',
        'Integrasi WhatsApp',
        'Hosting + maintenance',
      ],
      ctaLabel: 'Pilih paket ERP',
    },
    {
      id: 'webapp-booking',
      name: 'Booking/Tuition',
      price: 'Rp 12.000.000',
      priceNumeric: 12000000,
      monthly: 'Rp 350.000/bulan',
      monthlyNumeric: 350000,
      features: [
        'Jadwal & booking online',
        'Payment gateway',
        'Notifikasi WhatsApp otomatis',
        'Manajemen peserta/pelanggan',
        'Laporan revenue',
        'Hosting + maintenance',
      ],
      ctaLabel: 'Pilih paket Booking',
    },
    {
      id: 'webapp-enterprise',
      name: 'Enterprise',
      price: 'Mulai Rp 35.000.000',
      priceNumeric: 35000000,
      monthly: 'Mulai Rp 1.000.000/bulan',
      monthlyNumeric: 1000000,
      features: [
        'Custom workflow & business logic',
        'Integrasi API pihak ketiga',
        'Mobile app (iOS/Android)',
        'Dedicated support',
        'SLA uptime',
        'On-site training',
      ],
      ctaLabel: 'Konsultasi Enterprise',
    },
  ],
};

export const seoPackage: PricingPackage = {
  category: 'seo',
  title: 'SEO Service',
  subtitle: 'Bikin bisnismu muncul di halaman 1 Google — minimum kontrak 3 bulan.',
  tiers: [
    {
      id: 'seo-basic',
      name: 'Basic',
      price: 'Rp 1.500.000/bulan',
      priceNumeric: 1500000,
      features: [
        '5 target keywords',
        'On-page optimization',
        'Google Business Profile setup',
        'Laporan bulanan',
        'Cocok untuk UMKM lokal',
      ],
      ctaLabel: 'Mulai SEO Basic',
    },
    {
      id: 'seo-growth',
      name: 'Growth',
      price: 'Rp 3.500.000/bulan',
      priceNumeric: 3500000,
      popular: true,
      features: [
        '15 target keywords',
        '4 artikel SEO / bulan',
        'Technical audit bulanan',
        'Backlink building',
        'Laporan mingguan',
        'Cocok untuk kota besar',
      ],
      ctaLabel: 'Pilih Growth',
    },
    {
      id: 'seo-dominate',
      name: 'Dominate',
      price: 'Rp 7.000.000/bulan',
      priceNumeric: 7000000,
      features: [
        '30+ target keywords',
        '8 artikel SEO / bulan',
        'PR & backlink premium',
        'Competitor analysis',
        'Laporan real-time',
        'Cocok untuk skala nasional',
      ],
      ctaLabel: 'Pilih Dominate',
    },
  ],
};

export const allPackages: PricingPackage[] = [landingPackage, webappPackage, seoPackage];

export const addOns = [
  { label: 'Perpanjangan domain', price: 'Rp 300.000/tahun' },
  { label: 'Hosting tambahan', price: 'Mulai Rp 150.000/bulan' },
  { label: 'Revisi tambahan setelah launch', price: 'Rp 500.000/revisi' },
  { label: 'Training aplikasi (2 jam)', price: 'Rp 1.000.000' },
];

export const paymentOptions = [
  { label: '50% DP / 50% saat launch', detail: 'Pilihan paling umum, cocok untuk semua paket.' },
  { label: '30% DP / 40% mid-project / 30% launch', detail: 'Cocok untuk proyek besar & Enterprise.' },
  { label: 'Full upfront (diskon 10%)', detail: 'Bayar lunas di depan, hemat lebih banyak.' },
];
```

- [ ] **Step 2: Commit**

```bash
git add lib/pricing.ts
git commit -m "feat: add pricing data as single source of truth"
```

---

## Task 5: Create portfolio, FAQ, and SEO helper data

**Files:**
- Create: `lib/portfolio.ts`
- Create: `lib/faq.ts`
- Create: `lib/seo.ts`

- [ ] **Step 1: Create lib/portfolio.ts**

Write to `lib/portfolio.ts`:

```ts
export interface PortfolioItem {
  name: string;
  url: string;
  category: string;
}

export const portfolioItems: PortfolioItem[] = [
  { name: 'Toko Ninja', url: 'https://tokoninja.com/', category: 'Retail Platform' },
  { name: 'Toko Ninja ERP', url: 'https://erp.tokoninja.com/', category: 'ERP System' },
  { name: 'Toko Ninja POS', url: 'https://pos.tokoninja.com/', category: 'POS System' },
  { name: 'Hinno Art', url: 'https://hinno.art/', category: 'Portfolio Site' },
  { name: 'Tuition App', url: 'https://tuition-app.up.railway.app/', category: 'Education Platform' },
];
```

- [ ] **Step 2: Create lib/faq.ts**

Write to `lib/faq.ts`:

```ts
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Berapa lama proses pembuatan website atau aplikasi?',
    answer: 'Landing Page Starter 5–7 hari kerja, Pro 10–14 hari. Web App Standard POS 3–4 minggu, Pro ERP 6–8 minggu. Setiap proyek akan dapat timeline detail setelah briefing awal.',
  },
  {
    question: 'Apakah harga sudah termasuk domain dan hosting?',
    answer: 'Ya, semua paket Landing Page sudah include domain + hosting untuk 1 tahun pertama. Web App include hosting selama ada kontrak maintenance bulanan. Perpanjangan domain tahun ke-2: Rp 300rb/tahun.',
  },
  {
    question: 'Bagaimana sistem pembayarannya?',
    answer: 'Kami fleksibel: 50% DP + 50% saat launch, atau 30/40/30, atau full upfront dengan diskon 10%. Transfer bisa via BCA atau QRIS. Invoice resmi akan dikirim via email/WhatsApp.',
  },
  {
    question: 'Ada garansi kalau ada bug atau masalah setelah launch?',
    answer: 'Ya. Semua paket dapat 30 hari gratis bug-fix setelah launch. Untuk Web App yang ada maintenance bulanan, bug-fix + minor update selalu included selama kontrak aktif.',
  },
  {
    question: 'Kalau mau revisi setelah launch gimana?',
    answer: 'Revisi minor tetap di-handle selama masa garansi 30 hari. Setelah itu, revisi berbayar Rp 500rb/revisi atau bisa di-bundle dalam paket maintenance bulanan.',
  },
  {
    question: 'Apakah Palu Dev House bisa kerja dengan klien luar Palu/Medan?',
    answer: 'Tentu. Walaupun lokasi fisik di Palu & Medan, kami handle klien dari seluruh Indonesia secara remote. Meeting via Zoom/Google Meet, delivery via email/WhatsApp, support 24/7 via chat.',
  },
  {
    question: 'Kalau belum yakin paket mana yang cocok, gimana?',
    answer: 'Coba quiz rekomendasi di atas — 4 pertanyaan singkat, langsung dapat saran paket yang cocok. Atau chat langsung via WhatsApp untuk konsultasi gratis.',
  },
  {
    question: 'Bisakah nanti upgrade dari paket Landing Page ke Web App?',
    answer: 'Bisa. Banyak klien mulai dari Landing Page dulu untuk establish online presence, lalu upgrade ke Web App saat bisnis tumbuh. Harga upgrade dihitung selisih + migration fee yang wajar.',
  },
];
```

- [ ] **Step 3: Create lib/seo.ts**

Write to `lib/seo.ts`:

```ts
export const SITE_URL = 'https://paludevhouse.site';
export const SITE_NAME = 'Palu Dev House';
export const DEFAULT_DESCRIPTION =
  'Software house untuk UMKM & bisnis Indonesia. Jasa pembuatan website, aplikasi kasir (POS), ERP, dan SEO. Minimalis, profesional, hasil yang naikin transaksi.';

export interface MetaInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export interface MetaOutput {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
}

export function buildMeta({ title, description, path = '/', ogImage }: MetaInput = {}): MetaOutput {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Jasa Pembuatan Website & Aplikasi`;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title: fullTitle,
    description: description ?? DEFAULT_DESCRIPTION,
    canonical,
    ogImage: `${SITE_URL}${ogImage ?? '/og-image.png'}`,
    ogTitle: title ?? SITE_NAME,
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#business`,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    areaServed: [
      { '@type': 'City', name: 'Palu' },
      { '@type': 'City', name: 'Medan' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    address: [
      { '@type': 'PostalAddress', addressLocality: 'Palu', addressRegion: 'Sulawesi Tengah', addressCountry: 'ID' },
      { '@type': 'PostalAddress', addressLocality: 'Medan', addressRegion: 'Sumatera Utara', addressCountry: 'ID' },
    ],
    priceRange: 'Rp 1.500.000 – Rp 35.000.000+',
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/portfolio.ts lib/faq.ts lib/seo.ts
git commit -m "feat: add portfolio, faq, and seo helper modules"
```

---

## Task 6: Build recommendation quiz logic with TDD

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/recommendation.ts`
- Create: `tests/recommendation.test.ts`

- [ ] **Step 1: Create vitest config**

Write to `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

- [ ] **Step 2: Write failing tests first**

Write to `tests/recommendation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { recommend, questions, type QuizAnswers } from '../lib/recommendation';

describe('recommendation engine', () => {
  it('exposes 4 questions with defined options', () => {
    expect(questions).toHaveLength(4);
    questions.forEach((q) => {
      expect(q.options.length).toBeGreaterThan(0);
      expect(q.id).toBeTruthy();
      expect(q.label).toBeTruthy();
    });
  });

  it('recommends Landing Page Starter for new business needing presence', () => {
    const answers: QuizAnswers = { q1: 'E', q2: 'A', q3: 'A', q4: 'D' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-starter');
    expect(result.reason).toContain('profesional');
  });

  it('recommends Landing Page Pro bundle for new biz wanting reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'A', q3: 'A', q4: 'A' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-pro');
  });

  it('recommends Standard POS for small cafe with operational focus', () => {
    const answers: QuizAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'B' };
    const result = recommend(answers);
    expect(result.packageId).toBe('webapp-pos');
  });

  it('recommends Pro ERP for multi-outlet retail', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'C', q3: 'C', q4: 'B' };
    const result = recommend(answers);
    expect(result.packageId).toBe('webapp-erp');
  });

  it('recommends Booking/Tuition for service and education businesses', () => {
    const serviceAnswers: QuizAnswers = { q1: 'C', q2: 'A', q3: 'B', q4: 'B' };
    expect(recommend(serviceAnswers).packageId).toBe('webapp-booking');

    const eduAnswers: QuizAnswers = { q1: 'D', q2: 'B', q3: 'B', q4: 'B' };
    expect(recommend(eduAnswers).packageId).toBe('webapp-booking');
  });

  it('recommends SEO Growth when business already has site and wants reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'B', q3: 'B', q4: 'A' };
    const result = recommend(answers);
    expect(result.packageId).toBe('seo-growth');
  });

  it('recommends SEO Dominate for high-transaction biz wanting nationwide reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'C', q3: 'C', q4: 'C' };
    const result = recommend(answers);
    expect(['seo-dominate', 'webapp-erp']).toContain(result.packageId);
  });

  it('returns a valid package for every combination of answers', () => {
    const q1Opts = ['A', 'B', 'C', 'D', 'E'] as const;
    const q2Opts = ['A', 'B', 'C'] as const;
    const q3Opts = ['A', 'B', 'C'] as const;
    const q4Opts = ['A', 'B', 'C', 'D'] as const;
    for (const q1 of q1Opts)
      for (const q2 of q2Opts)
        for (const q3 of q3Opts)
          for (const q4 of q4Opts) {
            const result = recommend({ q1, q2, q3, q4 });
            expect(result.packageId).toBeTruthy();
            expect(result.reason).toBeTruthy();
            expect(result.headline).toBeTruthy();
          }
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test
```

Expected: All tests FAIL with module-not-found errors for `../lib/recommendation`.

- [ ] **Step 4: Implement recommendation logic**

Write to `lib/recommendation.ts`:

```ts
export type Q1 = 'A' | 'B' | 'C' | 'D' | 'E';
export type Q2 = 'A' | 'B' | 'C';
export type Q3 = 'A' | 'B' | 'C';
export type Q4 = 'A' | 'B' | 'C' | 'D';

export interface QuizAnswers {
  q1: Q1;
  q2: Q2;
  q3: Q3;
  q4: Q4;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: keyof QuizAnswers;
  label: string;
  helper?: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: 'q1',
    label: 'Jenis bisnis kamu?',
    options: [
      { value: 'A', label: 'Cafe / Restoran / FnB' },
      { value: 'B', label: 'Retail / Toko' },
      { value: 'C', label: 'Jasa / Booking (salon, klinik, coaching)' },
      { value: 'D', label: 'Edukasi / Kursus' },
      { value: 'E', label: 'Lainnya' },
    ],
  },
  {
    id: 'q2',
    label: 'Status digital saat ini?',
    options: [
      { value: 'A', label: 'Belum punya website / aplikasi sama sekali' },
      { value: 'B', label: 'Sudah punya tapi kuno / lemot' },
      { value: 'C', label: 'Sudah punya, mau upgrade fitur' },
    ],
  },
  {
    id: 'q3',
    label: 'Transaksi harian rata-rata?',
    options: [
      { value: 'A', label: 'Kurang dari 20 transaksi' },
      { value: 'B', label: '20 – 100 transaksi' },
      { value: 'C', label: '100+ transaksi atau multi-outlet' },
    ],
  },
  {
    id: 'q4',
    label: 'Tujuan utama kamu?',
    options: [
      { value: 'A', label: 'Dapat lebih banyak pelanggan (branding + Google)' },
      { value: 'B', label: 'Efisiensi operasional (kasir, stok, laporan)' },
      { value: 'C', label: 'Jangkau daerah baru (online ordering, delivery)' },
      { value: 'D', label: 'Professional image (website elegan + SEO)' },
    ],
  },
];

export interface Recommendation {
  packageId: string;
  headline: string;
  reason: string;
  priceLabel: string;
  scrollTo: 'pricing' | 'seo';
}

export function recommend(answers: QuizAnswers): Recommendation {
  const { q1, q2, q3, q4 } = answers;

  // Rule 1: No existing digital presence AND goal is reach/branding → Landing Page
  if (q2 === 'A' && (q4 === 'A' || q4 === 'D')) {
    if (q4 === 'D') {
      return {
        packageId: 'landing-starter',
        headline: 'Paket yang cocok: Landing Page Starter',
        reason:
          'Bisnis kamu butuh presence digital yang profesional dulu. Landing Page Starter sudah cukup untuk bangun kepercayaan pelanggan dan tampil di Google.',
        priceLabel: 'Rp 2.000.000',
        scrollTo: 'pricing',
      };
    }
    return {
      packageId: 'landing-pro',
      headline: 'Paket yang cocok: Landing Page Pro',
      reason:
        'Kamu belum punya presence digital dan mau jangkau pelanggan baru. Landing Page Pro punya SEO on-page dan bisa dipadukan dengan SEO bulanan supaya cepat naik di Google.',
      priceLabel: 'Rp 4.500.000',
      scrollTo: 'pricing',
    };
  }

  // Rule 2: Multi-outlet or 100+ transactions → Pro ERP
  if (q3 === 'C') {
    if (q4 === 'C') {
      return {
        packageId: 'seo-dominate',
        headline: 'Paket yang cocok: SEO Dominate',
        reason:
          'Skala bisnis kamu sudah besar dan mau jangkau nasional. SEO Dominate ideal untuk dapat visibility organic di banyak kota sekaligus.',
        priceLabel: 'Rp 7.000.000/bulan',
        scrollTo: 'seo',
      };
    }
    return {
      packageId: 'webapp-erp',
      headline: 'Paket yang cocok: Pro ERP',
      reason:
        'Multi-outlet atau volume transaksi tinggi butuh sistem terpadu: inventory, staff, laporan analytics. Pro ERP jawab semua itu dalam satu dashboard.',
      priceLabel: 'Rp 18.000.000 + Rp 500.000/bulan',
      scrollTo: 'pricing',
    };
  }

  // Rule 3: Service / Education businesses → Booking
  if ((q1 === 'C' || q1 === 'D') && q4 !== 'D') {
    return {
      packageId: 'webapp-booking',
      headline: 'Paket yang cocok: Booking/Tuition App',
      reason:
        'Bisnis jasa atau edukasi paling butuh sistem booking online & notifikasi otomatis. Pelanggan bisa pesan tanpa chat manual, kamu fokus deliver.',
      priceLabel: 'Rp 12.000.000 + Rp 350.000/bulan',
      scrollTo: 'pricing',
    };
  }

  // Rule 4: Already has site, wants reach → SEO
  if ((q2 === 'B' || q2 === 'C') && (q4 === 'A' || q4 === 'C')) {
    return {
      packageId: 'seo-growth',
      headline: 'Paket yang cocok: SEO Growth',
      reason:
        'Kamu sudah punya website dan mau dapat lebih banyak pelanggan lewat Google. SEO Growth fokus naikin ranking untuk 15 keyword target + artikel bulanan.',
      priceLabel: 'Rp 3.500.000/bulan',
      scrollTo: 'seo',
    };
  }

  // Rule 5: Cafe/FnB/Retail with operational focus → POS
  if ((q1 === 'A' || q1 === 'B') && q4 === 'B') {
    return {
      packageId: 'webapp-pos',
      headline: 'Paket yang cocok: Standard POS/Kasir',
      reason:
        'Untuk cafe atau retail skala kamu, Standard POS sudah cukup: kasir digital, laporan otomatis, cetak struk. Bisa di-upgrade ke Pro ERP kalau bisnis berkembang.',
      priceLabel: 'Rp 8.000.000 + Rp 250.000/bulan',
      scrollTo: 'pricing',
    };
  }

  // Default fallback: Landing Page Pro (safe baseline for most undecided cases)
  return {
    packageId: 'landing-pro',
    headline: 'Paket yang cocok: Landing Page Pro',
    reason:
      'Untuk bisnis kamu, mulai dari Landing Page Pro paling masuk akal: website profesional dengan SEO on-page, bisa di-expand ke aplikasi atau paket SEO bulanan nanti.',
    priceLabel: 'Rp 4.500.000',
    scrollTo: 'pricing',
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests PASS. If any fail, adjust rule ordering in `recommend()` until the test scenarios match. The exhaustive combination test must produce a valid package for every single input.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts lib/recommendation.ts tests/recommendation.test.ts
git commit -m "feat: add recommendation quiz logic with exhaustive tests"
```

---

## Task 7: Build theme context and toggle

**Files:**
- Create: `lib/theme.ts`
- Create: `components/ui/ThemeToggle.tsx`

- [ ] **Step 1: Create theme context**

Write to `lib/theme.ts`:

```ts
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'pdh-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

Note: since this file contains JSX, rename extension. Re-create as `lib/theme.tsx`:

```bash
rm lib/theme.ts
```

Write to `lib/theme.tsx` with the exact same contents as above.

- [ ] **Step 2: Create ThemeToggle component**

Write to `components/ui/ThemeToggle.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface hover:bg-surface-muted transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 45 }}
          transition={{ duration: 0.15 }}
          className="inline-block"
        >
          {theme === 'light' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/theme.tsx components/ui/ThemeToggle.tsx
git commit -m "feat: add theme provider and toggle"
```

---

## Task 8: Build UI primitives (Button, Card, Badge, Container, MotionSection)

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/MotionSection.tsx`
- Create: `components/layout/Container.tsx`

- [ ] **Step 1: Create Button**

Write to `components/ui/Button.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90',
  secondary: 'bg-surface-muted text-ink border border-line hover:border-brand',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base font-semibold',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonLinkProps) {
  const classes = `inline-flex items-center justify-center rounded-lg font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  return (
    <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 2: Create Card**

Write to `components/ui/Card.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  const hoverProps = hoverable ? { whileHover: { y: -4, boxShadow: '0 12px 32px -8px rgba(32, 101, 161, 0.18)' } } : {};
  return (
    <motion.div
      {...hoverProps}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border border-line bg-surface p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create Badge**

Write to `components/ui/Badge.tsx`:

```tsx
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'brand' | 'muted';
}

export function Badge({ children, variant = 'brand' }: BadgeProps) {
  const styles =
    variant === 'brand'
      ? 'bg-brand text-white'
      : 'bg-surface-muted text-ink-muted border border-line';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Create MotionSection**

Write to `components/ui/MotionSection.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function MotionSection({ children, className = '', id, delay = 0 }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 5: Create Container**

Write to `components/layout/Container.tsx`:

```tsx
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className = '', narrow = false }: ContainerProps) {
  const maxW = narrow ? 'max-w-prose' : 'max-w-content';
  return <div className={`${maxW} mx-auto px-6 ${className}`}>{children}</div>;
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ui components/layout
git commit -m "feat: add ui primitives (button, card, badge, container, motion-section)"
```

---

## Task 9: Build Header and Footer layout

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create Header**

Write to `components/layout/Header.tsx`:

```tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from './Container';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ButtonLink } from '../ui/Button';

const navLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#rekomendasi', label: 'Rekomendasi' },
  { href: '/harga', label: 'Harga' },
  { href: '/seo', label: 'SEO' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled ? 'bg-surface/85 backdrop-blur border-b border-line' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Palu Dev House">
          <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-semibold text-ink">Palu Dev House</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/#kontak" size="sm" className="hidden sm:inline-flex">
            Hubungi Kami
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 2: Create Footer**

Write to `components/layout/Footer.tsx`:

```tsx
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-12 mt-section-sm">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="font-semibold text-ink">Palu Dev House</span>
            </div>
            <p className="mt-4 text-sm text-ink-muted max-w-sm">
              Software house Indonesia untuk UMKM & bisnis yang mau naik kelas. Berbasis di Medan & Palu, melayani klien di seluruh Indonesia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Layanan</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li><Link href="/#layanan" className="hover:text-ink">Landing Page</Link></li>
              <li><Link href="/#layanan" className="hover:text-ink">Web Application</Link></li>
              <li><Link href="/seo" className="hover:text-ink">SEO Service</Link></li>
              <li><Link href="/harga" className="hover:text-ink">Harga Lengkap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Kontak</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>Medan, Sumatera Utara</li>
              <li>Palu, Sulawesi Tengah</li>
              <li><Link href="/#kontak" className="hover:text-ink">Hubungi via WhatsApp</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-4 text-sm text-ink-muted">
          <div>© {year} Palu Dev House. All rights reserved.</div>
          <div>paludevhouse.site</div>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat: add header and footer layout"
```

---

## Task 10: Build Hero, WhyDigital, WhyUs, Services sections

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/sections/WhyDigital.tsx`
- Create: `components/sections/WhyUs.tsx`
- Create: `components/sections/Services.tsx`

- [ ] **Step 1: Create Hero**

Write to `components/sections/Hero.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { ButtonLink } from '../ui/Button';

export function Hero() {
  return (
    <section className="pt-section-sm pb-section-sm md:pt-section md:pb-section">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted"
          >
            Software house untuk UMKM Indonesia
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-ink"
          >
            Website & Aplikasi yang Bikin
            <br />
            <span className="text-brand">Bisnismu Naik Kelas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-ink-muted max-w-xl mx-auto"
          >
            Dari landing page sampai aplikasi kasir & ERP. Hasil yang fokus pada yang penting: tambah transaksi, jangkau lebih banyak pelanggan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <ButtonLink href="#rekomendasi" size="lg">
              Cari Paket yang Cocok
            </ButtonLink>
            <ButtonLink href="#harga" variant="secondary" size="lg">
              Lihat Harga
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Create WhyDigital**

Write to `components/sections/WhyDigital.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';

const outcomes = [
  {
    title: 'Tambah Volume Transaksi',
    body: 'Kasir digital + online ordering bisa tambah transaksi hingga 40%. Pelanggan order tanpa antri, pembayaran tercatat otomatis, kamu fokus ke operasional.',
  },
  {
    title: 'Jangkau Pelanggan Baru',
    body: 'Website yang muncul di Google = pelanggan nyari kamu duluan. 70%+ pelanggan cek bisnis di Google sebelum datang — kalau kamu ga ada, kompetitor yang dapat.',
  },
  {
    title: 'Hemat Waktu & Biaya',
    body: 'Laporan otomatis, stok terupdate real-time, satu dashboard untuk semua outlet. Tutup toko dari 2 jam jadi 15 menit.',
  },
  {
    title: 'Data Pelanggan Jadi Aset',
    body: 'Catat pelanggan, kasih promo berdasarkan histori order. Bisnis bukan cuma jualan — tapi bangun komunitas yang balik terus.',
  },
];

export function WhyDigital() {
  return (
    <MotionSection id="kenapa-digital" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Kenapa Bisnis Butuh Aplikasi atau Website?
          </h2>
          <p className="mt-4 text-ink-muted">
            Bukan soal teknologi — soal hasil bisnis yang konkret.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="h-full">
                <h3 className="text-lg font-semibold text-ink">{o.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{o.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 3: Create WhyUs**

Write to `components/sections/WhyUs.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';

const reasons = [
  {
    title: 'Hasil Transaksi Nyata',
    body: 'Fokus ke metrik bisnis — bukan showcase teknis. Setiap fitur yang kami bangun punya tujuan konkret: tambah penjualan atau hemat waktu operasional.',
  },
  {
    title: 'Desain Minimalis, Modern',
    body: 'Ga ribet, ga lebay. Tampilan profesional yang bikin calon pelanggan percaya sejak detik pertama buka website kamu.',
  },
  {
    title: 'SEO Sejak Hari Pertama',
    body: 'Setiap website yang kami bangun sudah siap SEO — bukan sekedar online, tapi ditemukan. Opsi paket SEO bulanan untuk yang mau dominasi Google.',
  },
];

export function WhyUs() {
  return (
    <MotionSection id="mengapa-kami" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Mengapa Palu Dev House
          </h2>
          <p className="mt-4 text-ink-muted">
            Tiga hal yang bikin kami beda dari freelance atau jasa biasa.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-l-2 border-brand pl-6"
            >
              <h3 className="text-xl font-semibold text-ink">{r.title}</h3>
              <p className="mt-3 text-ink-muted leading-relaxed">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 4: Create Services**

Write to `components/sections/Services.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { ButtonLink } from '../ui/Button';

const services = [
  {
    title: 'Landing Page',
    subtitle: 'Website profesional sekali bayar',
    bullets: ['Dari Rp 2jt', 'Mobile-responsive', 'SEO-ready sejak awal', 'Domain + hosting included'],
    href: '#harga',
  },
  {
    title: 'Web Application',
    subtitle: 'POS / ERP / Booking / Tuition',
    bullets: ['Dari Rp 8jt + maintenance', 'Proven di tokoninja & tuition-app', 'Multi-outlet ready', 'Custom workflow tersedia'],
    href: '#harga',
  },
  {
    title: 'SEO Service',
    subtitle: 'Dominasi hasil Google bulanan',
    bullets: ['Dari Rp 1,5jt/bulan', 'Keyword research & tracking', 'Artikel + backlink building', 'Laporan transparan'],
    href: '/seo',
  },
];

export function Services() {
  return (
    <MotionSection id="layanan" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Layanan Kami</h2>
          <p className="mt-4 text-ink-muted">Tiga paket yang cover kebutuhan digital bisnis dari awal sampai skala.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full flex flex-col">
                <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.subtitle}</p>
                <ul className="mt-6 space-y-2 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink-muted">
                      <svg className="h-4 w-4 mt-0.5 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={s.href} variant="secondary" size="sm" className="mt-6 self-start">
                  Lihat detail →
                </ButtonLink>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/WhyDigital.tsx components/sections/WhyUs.tsx components/sections/Services.tsx
git commit -m "feat: add hero, why-digital, why-us, services sections"
```

---

## Task 11: Build Recommendation quiz component

**Files:**
- Create: `components/sections/Recommendation.tsx`

- [ ] **Step 1: Create Recommendation component**

Write to `components/sections/Recommendation.tsx`:

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';
import { questions, recommend, type QuizAnswers } from '@/lib/recommendation';

const WHATSAPP_NUMBER = '628000000000'; // placeholder until user provides real number

type Answers = Partial<QuizAnswers>;

export function Recommendation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isComplete = step >= questions.length;
  const recommendation = isComplete ? recommend(answers as QuizAnswers) : null;
  const progress = (step / questions.length) * 100;

  const handleSelect = (value: string) => {
    const current = questions[step];
    const nextAnswers = { ...answers, [current.id]: value };
    setAnswers(nextAnswers);
    setStep(step + 1);
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
  };

  const whatsappMessage = recommendation
    ? encodeURIComponent(
        `Halo Palu Dev House! Saya baru coba quiz rekomendasi dan dapat saran paket ${recommendation.headline.replace(/^Paket yang cocok: /, '')}. Boleh konsultasi lebih lanjut?`,
      )
    : '';

  return (
    <MotionSection id="rekomendasi" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Paket Mana yang Cocok Untuk Saya?
          </h2>
          <p className="mt-4 text-ink-muted">
            4 pertanyaan singkat — langsung dapat rekomendasi paket yang pas.
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card hoverable={false} className="p-8">
            {!isComplete && (
              <div className="mb-6 h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                    Pertanyaan {step + 1} dari {questions.length}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{questions[step].label}</h3>
                  <div className="mt-6 grid gap-3">
                    {questions[step].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className="text-left rounded-lg border border-line bg-surface p-4 hover:border-brand hover:bg-brand-light transition-colors"
                      >
                        <span className="text-sm font-medium text-ink">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : recommendation ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                    Rekomendasi Kami
                  </div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-ink">
                    {recommendation.headline}
                  </h3>
                  <p className="mt-4 text-ink-muted leading-relaxed">{recommendation.reason}</p>
                  <div className="mt-6 inline-flex items-center rounded-lg bg-brand-light px-4 py-2">
                    <span className="text-sm font-semibold text-brand">{recommendation.priceLabel}</span>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <ButtonLink
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="lg"
                    >
                      Chat WhatsApp Sekarang
                    </ButtonLink>
                    <ButtonLink
                      href={recommendation.scrollTo === 'seo' ? '/seo' : '#harga'}
                      variant="secondary"
                      size="lg"
                    >
                      Lihat paket lengkap
                    </ButtonLink>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4" onClick={handleReset}>
                    ↺ Ulangi quiz
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card>
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Recommendation.tsx
git commit -m "feat: add interactive recommendation quiz"
```

---

## Task 12: Build Portfolio, Pricing, FAQ, Contact sections

**Files:**
- Create: `components/sections/Portfolio.tsx`
- Create: `components/sections/Pricing.tsx`
- Create: `components/ui/PricingTable.tsx`
- Create: `components/sections/FAQ.tsx`
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Create Portfolio**

Write to `components/sections/Portfolio.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { portfolioItems } from '@/lib/portfolio';

export function Portfolio() {
  return (
    <MotionSection id="portfolio" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Karya yang Sudah Live
          </h2>
          <p className="mt-4 text-ink-muted">
            Produk yang sudah kami build dan running di lapangan.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {portfolioItems.map((item, i) => (
            <motion.a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-xl border border-line bg-surface p-6 flex flex-col justify-between min-h-[140px] hover:border-brand transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-ink-muted">{item.category}</div>
                <div className="mt-2 font-semibold text-ink">{item.name}</div>
              </div>
              <div className="mt-4 text-xs text-brand font-medium">
                Buka live site →
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 2: Create PricingTable UI primitive**

Write to `components/ui/PricingTable.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Card } from './Card';
import { ButtonLink } from './Button';
import { Badge } from './Badge';
import type { PricingTier } from '@/lib/pricing';

const WHATSAPP_NUMBER = '628000000000';

interface PricingTableProps {
  tier: PricingTier;
  index: number;
}

export function PricingTable({ tier, index }: PricingTableProps) {
  const msg = encodeURIComponent(`Halo Palu Dev House, saya tertarik dengan paket ${tier.name}.`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className={`h-full flex flex-col ${tier.popular ? 'ring-2 ring-brand' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{tier.name}</h3>
          {tier.popular && <Badge>Populer</Badge>}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-semibold text-ink">{tier.price}</div>
          {tier.monthly && <div className="text-sm text-ink-muted mt-1">+ {tier.monthly}</div>}
        </div>
        <ul className="mt-6 space-y-2 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
              <svg className="h-4 w-4 mt-0.5 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <ButtonLink
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          variant={tier.popular ? 'primary' : 'secondary'}
          className="mt-8"
        >
          {tier.ctaLabel}
        </ButtonLink>
      </Card>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create Pricing section**

Write to `components/sections/Pricing.tsx`:

```tsx
import Link from 'next/link';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { PricingTable } from '../ui/PricingTable';
import { allPackages } from '@/lib/pricing';

export function Pricing() {
  return (
    <MotionSection id="harga" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Harga</h2>
          <p className="mt-4 text-ink-muted">
            Transparan, ga ada biaya tersembunyi. Pilih paket sesuai kebutuhan bisnismu.
          </p>
        </div>

        {allPackages.map((pkg) => (
          <div key={pkg.category} className="mt-16">
            <div className="max-w-prose mx-auto text-center">
              <h3 className="text-2xl font-semibold text-ink">{pkg.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{pkg.subtitle}</p>
            </div>
            <div className={`mt-8 grid gap-6 ${pkg.tiers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
              {pkg.tiers.map((tier, i) => (
                <PricingTable key={tier.id} tier={tier} index={i} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 text-center">
          <Link href="/harga" className="text-sm font-medium text-brand hover:underline">
            Lihat add-ons & detail pembayaran →
          </Link>
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 4: Create FAQ section**

Write to `components/sections/FAQ.tsx`:

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { faqItems } from '@/lib/faq';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <MotionSection id="faq" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Pertanyaan yang Sering Ditanya
            </h2>
          </div>
          <div className="mt-12 divide-y divide-line border-t border-b border-line">
            {faqItems.map((item, i) => {
              const open = openIdx === i;
              return (
                <div key={item.question} className="py-4">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-start justify-between gap-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-medium text-ink">{item.question}</span>
                    <span className={`text-brand transition-transform flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 5: Create Contact section**

Write to `components/sections/Contact.tsx`:

```tsx
import { useState, type FormEvent } from 'react';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';

const WHATSAPP_NUMBER = '628000000000';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <MotionSection id="kontak" className="py-section-sm md:py-section">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Siap Naik Kelas?
            </h2>
            <p className="mt-4 text-ink-muted">
              Chat WhatsApp untuk respon cepat, atau isi form untuk dapat quote lengkap via email.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Palu Dev House, saya mau konsultasi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Chat WhatsApp
              </ButtonLink>
            </div>
            <div className="mt-12 space-y-4 text-sm text-ink-muted">
              <div>
                <div className="font-semibold text-ink">Lokasi</div>
                <div>Medan, Sumatera Utara</div>
                <div>Palu, Sulawesi Tengah</div>
              </div>
              <div>
                <div className="font-semibold text-ink">Jam Operasional</div>
                <div>Senin – Jumat, 09:00 – 18:00 WIB</div>
                <div>Sabtu, 10:00 – 15:00 WIB (by appointment)</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-surface p-6 md:p-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">Nama</label>
              <input id="name" name="name" required className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink">WhatsApp / HP</label>
              <input id="phone" name="phone" className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-ink">Paket yang diminati</label>
              <select id="interest" name="interest" className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>Landing Page</option>
                <option>Web Application</option>
                <option>SEO Service</option>
                <option>Belum yakin — minta saran</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink">Cerita bisnismu</label>
              <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <Button type="submit" disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? 'Mengirim...' : 'Kirim'}
            </Button>
            {status === 'sent' && <p className="text-sm text-green-600">Terkirim — kami akan hubungi kamu dalam 1x24 jam.</p>}
            {status === 'error' && <p className="text-sm text-red-600">Gagal kirim. Coba lagi atau chat via WhatsApp.</p>}
          </form>
        </div>
      </Container>
    </MotionSection>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add components/sections/Portfolio.tsx components/sections/Pricing.tsx components/ui/PricingTable.tsx components/sections/FAQ.tsx components/sections/Contact.tsx
git commit -m "feat: add portfolio, pricing, faq, and contact sections"
```

---

## Task 13: Build pages (_app, _document, index, 404)

**Files:**
- Create: `pages/_app.tsx`
- Create: `pages/_document.tsx`
- Create: `pages/index.tsx`
- Create: `pages/404.tsx`
- Create: `pages/api/contact.ts`

- [ ] **Step 1: Create _app.tsx**

Write to `pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@/lib/theme';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Create _document.tsx**

Write to `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 3: Create pages/index.tsx**

Write to `pages/index.tsx`:

```tsx
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { WhyDigital } from '@/components/sections/WhyDigital';
import { WhyUs } from '@/components/sections/WhyUs';
import { Services } from '@/components/sections/Services';
import { Recommendation } from '@/components/sections/Recommendation';
import { Portfolio } from '@/components/sections/Portfolio';
import { Pricing } from '@/components/sections/Pricing';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { buildMeta, localBusinessJsonLd, faqJsonLd } from '@/lib/seo';
import { faqItems } from '@/lib/faq';

export default function Home() {
  const meta = buildMeta({
    description:
      'Software house Indonesia untuk UMKM & bisnis yang mau naik kelas. Jasa pembuatan website profesional, aplikasi kasir (POS), ERP, booking, dan SEO. Dari Rp 2 juta.',
    path: '/',
  });

  const jsonLd = [localBusinessJsonLd(), faqJsonLd(faqItems)];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:locale" content="id_ID" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.ogImage} />
        {jsonLd.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </Head>
      <Header />
      <main>
        <Hero />
        <WhyDigital />
        <WhyUs />
        <Services />
        <Recommendation />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Create pages/404.tsx**

Write to `pages/404.tsx`:

```tsx
import Head from 'next/head';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Halaman tidak ditemukan | Palu Dev House</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="py-section">
        <Container className="text-center">
          <div className="text-sm font-semibold text-brand uppercase tracking-wide">404</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-ink">Halaman tidak ditemukan</h1>
          <p className="mt-4 text-ink-muted">Mungkin link-nya salah atau halaman sudah dipindah.</p>
          <div className="mt-8">
            <ButtonLink href="/">Kembali ke beranda</ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Create pages/api/contact.ts**

Write to `pages/api/contact.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as ContactPayload;
  if (!body?.name || !body?.email) {
    return res.status(400).json({ error: 'Nama dan email wajib diisi' });
  }

  // For v1: log submission. Replace with email/webhook integration once contact channel confirmed.
  console.log('[contact]', {
    ts: new Date().toISOString(),
    ...body,
  });

  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 6: Run dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000 in browser. Expected:
- Header with logo + nav + theme toggle
- Hero with staggered headline animation
- 4 value-outcome cards scroll in on viewport
- 3 why-us cards
- 3 service cards
- Interactive quiz: click options, see progress bar, reach recommendation screen
- Portfolio cards linking to real URLs
- 3 pricing tables (landing, webapp, seo)
- FAQ accordion expands/collapses
- Contact form renders
- Footer shows

No console errors. Dark mode toggle works and persists.

- [ ] **Step 7: Commit**

```bash
git add pages/_app.tsx pages/_document.tsx pages/index.tsx pages/404.tsx pages/api/contact.ts
git commit -m "feat: add landing page with all sections composed"
```

---

## Task 14: Build /harga and /seo sub-pages

**Files:**
- Create: `pages/harga.tsx`
- Create: `pages/seo.tsx`

- [ ] **Step 1: Create /harga**

Write to `pages/harga.tsx`:

```tsx
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { PricingTable } from '@/components/ui/PricingTable';
import { allPackages, addOns, paymentOptions } from '@/lib/pricing';
import { buildMeta } from '@/lib/seo';

export default function HargaPage() {
  const meta = buildMeta({
    title: 'Harga Jasa Pembuatan Website & Aplikasi',
    description:
      'Daftar harga lengkap Palu Dev House: Landing Page dari Rp 2jt, Web Application (POS/ERP/Booking) dari Rp 8jt, SEO bulanan dari Rp 1,5jt. Add-ons dan opsi pembayaran transparan.',
    path: '/harga',
  });

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
      </Head>
      <Header />
      <main>
        <section className="py-section-sm md:py-section">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                Harga Lengkap
              </h1>
              <p className="mt-4 text-ink-muted">
                Semua paket, add-ons, dan opsi pembayaran di satu tempat. Transparan tanpa biaya tersembunyi.
              </p>
            </div>

            {allPackages.map((pkg) => (
              <div key={pkg.category} className="mt-16">
                <div className="max-w-prose mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-ink">{pkg.title}</h2>
                  <p className="mt-2 text-sm text-ink-muted">{pkg.subtitle}</p>
                </div>
                <div className={`mt-8 grid gap-6 ${pkg.tiers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
                  {pkg.tiers.map((tier, i) => (
                    <PricingTable key={tier.id} tier={tier} index={i} />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-section-sm max-w-prose mx-auto">
              <h2 className="text-2xl font-semibold text-ink">Add-ons</h2>
              <div className="mt-6 divide-y divide-line border-t border-b border-line">
                {addOns.map((a) => (
                  <div key={a.label} className="flex items-center justify-between py-4">
                    <span className="text-ink">{a.label}</span>
                    <span className="font-semibold text-ink">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-section-sm max-w-prose mx-auto">
              <h2 className="text-2xl font-semibold text-ink">Opsi Pembayaran</h2>
              <p className="mt-2 text-sm text-ink-muted">Transfer BCA atau QRIS. Invoice resmi via email/WhatsApp.</p>
              <div className="mt-6 space-y-4">
                {paymentOptions.map((p) => (
                  <div key={p.label} className="rounded-xl border border-line bg-surface p-5">
                    <div className="font-semibold text-ink">{p.label}</div>
                    <div className="mt-1 text-sm text-ink-muted">{p.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-section-sm text-center">
              <Link href="/#kontak" className="inline-flex items-center rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-brand/90">
                Konsultasi Gratis →
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create /seo**

Write to `pages/seo.tsx`:

```tsx
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { PricingTable } from '@/components/ui/PricingTable';
import { seoPackage } from '@/lib/pricing';
import { buildMeta } from '@/lib/seo';

const deliverables = [
  {
    title: 'Keyword Research',
    body: 'Riset kata kunci yang dicari target pelanggan kamu di Google. Fokus pada keyword dengan niat beli tinggi, bukan sekedar traffic.',
  },
  {
    title: 'On-page Optimization',
    body: 'Perbaikan struktur konten, meta tags, heading hierarchy, dan internal linking supaya Google paham topik website kamu.',
  },
  {
    title: 'Technical SEO',
    body: 'Audit performa, Core Web Vitals, mobile-friendly, sitemap, robots.txt. Semua detail teknis yang bikin Google percaya.',
  },
  {
    title: 'Content & Artikel',
    body: 'Artikel SEO-friendly yang rank di Google. Bukan sekedar isi kata kunci — tapi konten yang benar-benar berguna untuk pembaca.',
  },
  {
    title: 'Backlink Building',
    body: 'Dapat backlink dari website kredibel untuk naikin authority domain kamu. Fokus kualitas, bukan kuantitas.',
  },
  {
    title: 'Reporting Transparan',
    body: 'Laporan ranking, traffic, conversion — setiap bulan (atau setiap minggu di paket Growth/Dominate). Kamu selalu tahu progressnya.',
  },
];

export default function SEOPage() {
  const meta = buildMeta({
    title: 'Jasa SEO Indonesia untuk UMKM & Bisnis',
    description:
      'Jasa SEO bulanan dari Rp 1,5jt. Keyword research, on-page optimization, artikel SEO, backlink building, laporan transparan. Kontrak minimum 3 bulan.',
    path: '/seo',
  });

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
      </Head>
      <Header />
      <main>
        <section className="py-section-sm md:py-section">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                Jasa SEO yang Fokus pada Hasil
              </h1>
              <p className="mt-4 text-ink-muted">
                Website kamu sudah ada, sekarang saatnya ditemukan pelanggan. Minimum kontrak 3 bulan — SEO butuh waktu, tapi worth it.
              </p>
            </div>

            <div className="mt-section-sm">
              <h2 className="text-2xl font-semibold text-ink text-center">Yang Kamu Dapat</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {deliverables.map((d) => (
                  <div key={d.title} className="rounded-xl border border-line bg-surface p-6">
                    <h3 className="text-lg font-semibold text-ink">{d.title}</h3>
                    <p className="mt-3 text-sm text-ink-muted leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-section-sm">
              <h2 className="text-2xl font-semibold text-ink text-center">Paket SEO</h2>
              <p className="mt-2 text-sm text-ink-muted text-center">{seoPackage.subtitle}</p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {seoPackage.tiers.map((tier, i) => (
                  <PricingTable key={tier.id} tier={tier} index={i} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify pages in browser**

```bash
npm run dev
```

Visit http://localhost:3000/harga and http://localhost:3000/seo. Expected: both render without errors, logo + nav visible, pricing tables rendered, dark mode still works.

- [ ] **Step 4: Commit**

```bash
git add pages/harga.tsx pages/seo.tsx
git commit -m "feat: add harga and seo sub-pages"
```

---

## Task 15: Add sitemap, robots.txt, and build verification

**Files:**
- Create: `next-sitemap.config.js`

- [ ] **Step 1: Create next-sitemap config**

Write to `next-sitemap.config.js`:

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://paludevhouse.site',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
```

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes without errors. `postbuild` script runs `next-sitemap` which generates `public/sitemap.xml`, `public/sitemap-0.xml`, and `public/robots.txt`.

- [ ] **Step 3: Verify sitemap contains all 3 public routes**

```bash
cat public/sitemap-0.xml
```

Expected: contains `<loc>https://paludevhouse.site</loc>`, `<loc>https://paludevhouse.site/harga</loc>`, `<loc>https://paludevhouse.site/seo</loc>`.

- [ ] **Step 4: Run tests one more time**

```bash
npm test
```

Expected: all recommendation tests PASS.

- [ ] **Step 5: Start production server and verify locally**

```bash
npm run start
```

Visit http://localhost:3000. Expected: all pages render, no console errors, theme toggle works.

- [ ] **Step 6: Commit**

```bash
git add next-sitemap.config.js package.json
git commit -m "chore: add sitemap generation and verify build"
```

---

## Task 16: Final verification checklist

- [ ] **Step 1: Lighthouse check (dev)**

Run production build locally:

```bash
npm run build && npm run start
```

Open http://localhost:3000 in Chrome → DevTools → Lighthouse → Analyze.

Expected scores (Mobile):
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

If Performance < 90: check that images use `next/image`, fonts use `display=swap`, no blocking scripts. (Acceptable: some slack on first build; real Vercel deploy will be faster.)

- [ ] **Step 2: HTML validation check**

```bash
curl -s http://localhost:3000 | grep -E "canonical|og:title|og:description|application/ld\+json"
```

Expected: output includes canonical URL, OG tags, and at least one JSON-LD script tag.

- [ ] **Step 3: Cache headers check**

```bash
curl -I http://localhost:3000/_next/static/chunks/main.js 2>/dev/null | grep -i cache
```

Expected: `Cache-Control: public, max-age=31536000, immutable`.

- [ ] **Step 4: Mobile viewport check**

Open http://localhost:3000 in Chrome DevTools → toggle device toolbar → iPhone SE (375px). Expected: no horizontal scroll, all sections stack cleanly, nav collapses (or hides on mobile — menu via hamburger is optional for v1, basic stacking is acceptable).

- [ ] **Step 5: Dark mode check**

Toggle theme in header. Expected: all sections adapt correctly, no flashes of unthemed content, preference persists on reload.

- [ ] **Step 6: Quiz exhaustive manual check**

Run through the quiz 3–4 times with different answer combinations. Expected: each path produces a valid recommendation card with CTAs that work.

- [ ] **Step 7: Final commit**

```bash
git log --oneline
```

Expected: clean linear history of ~16 commits, ready for deployment.

- [ ] **Step 8: Deployment note**

Add to README or a deployment checklist:

Write to `README.md`:

```markdown
# Palu Dev House

Landing page for Palu Dev House — Indonesian software house. Next.js 15 (Pages Router) + Tailwind + Framer Motion.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

Covers recommendation quiz logic.

## Deployment

Hosted on Vercel. Push to `main` → auto-deploy. Sitemap regenerates on every build. Cache-Control headers set in `next.config.js` + `public/robots.txt` generated by `next-sitemap`.

Contact details (WhatsApp number, email) live in `components/sections/Contact.tsx`, `components/sections/Recommendation.tsx`, `components/ui/PricingTable.tsx` as `WHATSAPP_NUMBER` constant — update all three before launch.
```

Commit:

```bash
git add README.md
git commit -m "docs: add readme with dev, build, and deploy notes"
```

---

## Self-Review Notes

**Spec coverage:**
- Brand, tech, visual style → Tasks 1–3 ✓
- Pricing tables (3 packages, all tiers) → Tasks 4, 12, 13, 14 ✓
- Educational "Why need app" section → Task 10 ✓
- Recommendation quiz with tests → Tasks 6, 11 ✓
- Portfolio logo strip → Task 12 ✓
- FAQ with JSON-LD → Tasks 5, 12, 13 ✓
- Contact form + WhatsApp → Task 12 ✓
- Dark mode toggle → Task 7 ✓
- Caching + headers → Task 1 (next.config.js) ✓
- Sitemap + SEO meta → Task 15, per-page in Tasks 13–14 ✓
- Framer Motion throughout → Tasks 8–12 ✓

**Known placeholders (intentional, documented in Task 16 README):**
- `WHATSAPP_NUMBER = '628000000000'` in Recommendation, PricingTable, Contact — replace when user provides real number
- Contact form API just logs submissions — upgrade to email/webhook integration when channel confirmed

**Not implemented (explicitly out of scope per spec):**
- No admin panel, no CMS, no auth, no blog, no client portal, no founder section, no multi-language

**Deployment:** Vercel free tier with auto CDN purge on deploy handles cache-busting automatically. No PWA/service worker. Domain `paludevhouse.site` to be pointed at Vercel.
