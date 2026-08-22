/**
 * What each package actually contains — the single source of truth for the
 * offer, minus any figures.
 *
 * Prices used to live here and were rendered as a public ladder. They are gone
 * on purpose: scope, not a number, is what a prospect needs to recognise their
 * own situation in. Every card ends at WhatsApp, where the scope gets turned
 * into a quote for that specific business.
 */

export type PackageCategory = 'landing' | 'webapp';

export interface PackageTier {
  id: string;
  name: string;
  /** One line saying who this tier is for — the card's hook now the price is gone. */
  summary: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
}

export interface PackageGroup {
  category: PackageCategory;
  title: string;
  subtitle: string;
  tiers: PackageTier[];
}

export const landingPackage: PackageGroup = {
  category: 'landing',
  title: 'Landing Page',
  subtitle:
    'Landing page profesional + technical SEO & GEO (Generative Engine Optimization) bawaan — biar bisnismu kebaca Google sekaligus dikutip AI seperti ChatGPT, Gemini & Perplexity. Build sekali bayar. Domain dibeli klien sendiri (kami bantu carikan & setup) supaya kepemilikan 100% di tangan kamu; hosting Indonesia tersedia sebagai add-on.',
  tiers: [
    {
      id: 'landing-starter',
      name: 'Starter',
      summary: 'Buat yang baru mulai — satu halaman yang benar-benar kerja.',
      features: [
        '1 halaman landing responsive',
        'Mobile-first design',
        'Form WhatsApp terintegrasi',
        'Meta tags & Open Graph siap',
        'Sitemap + robots.txt',
        'JSON-LD dasar (Organization + LocalBusiness) — fondasi GEO',
        'Revisi: 2x',
      ],
      ctaLabel: 'Tanya paket Starter',
    },
    {
      id: 'landing-pro',
      name: 'Pro',
      summary: 'Paling sering dipilih — siap tempur di Google sekaligus di jawaban AI.',
      popular: true,
      features: [
        'Semua fitur Starter',
        'Technical SEO on-page (H1, meta, schema)',
        'Google Business Profile + Google Analytics & Search Console',
        'GEO starter: llms.txt + struktur konten Q&A yang gampang dikutip AI',
        'Schema FAQPage + Article (jadi sumber jawaban buat AI engine)',
        'Animasi & motion design',
        'Revisi: 3x',
      ],
      ctaLabel: 'Tanya paket Pro',
    },
    {
      id: 'landing-max',
      name: 'Max',
      summary: 'Paket terlengkap — SEO dan GEO digarap sampai tuntas.',
      features: [
        'Semua fitur Pro',
        'GEO lengkap: structured data penuh (Service / Offer / sameAs) + entity clarity',
        'Akses AI crawler diatur (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)',
        'Konten format citable + statistik & definisi yang siap dikutip AI',
        'Keyword + conversational query research (5 target)',
        'Artikel SEO/GEO perdana (1 artikel) + E-E-A-T signal',
        'Page speed & Core Web Vitals tuning',
        'Revisi: unlimited hingga launch',
      ],
      ctaLabel: 'Tanya paket Max',
    },
  ],
};

export const webappPackage: PackageGroup = {
  category: 'webapp',
  title: 'Web Application',
  subtitle:
    'Aplikasi kasir, ERP, booking, sistem custom — estimasi build 1 bulan penuh. Hosting server Indonesia termasuk selama kontrak maintenance aktif.',
  tiers: [
    {
      id: 'webapp-pos',
      name: 'Standard POS/Kasir',
      summary: 'Kasir digital untuk satu outlet yang mulai kewalahan pakai catatan manual.',
      features: [
        '1 outlet',
        'Menu & produk management',
        'Transaksi real-time',
        'Laporan harian/bulanan',
        'Cetak struk',
        'Hosting server Indonesia + maintenance',
        'Estimasi build: 1 bulan penuh',
      ],
      ctaLabel: 'Tanya paket POS',
    },
    {
      id: 'webapp-erp',
      name: 'Pro ERP',
      summary: 'Satu dashboard untuk multi-outlet: stok, staff, dan angka penjualan.',
      popular: true,
      features: [
        'Multi-outlet',
        'Inventory tracking',
        'Staff management & shift',
        'Analytics & dashboard',
        'Integrasi WhatsApp',
        'Hosting server Indonesia + maintenance',
        'Estimasi build: 1 bulan penuh',
      ],
      ctaLabel: 'Tanya paket ERP',
    },
    {
      id: 'webapp-booking',
      name: 'Booking/Tuition',
      summary: 'Jadwal, pembayaran, dan notifikasi otomatis buat bisnis jasa & kursus.',
      features: [
        'Jadwal & booking online',
        'Payment gateway',
        'Notifikasi WhatsApp otomatis',
        'Manajemen peserta/pelanggan',
        'Laporan revenue',
        'Hosting server Indonesia + maintenance',
        'Estimasi build: 1 bulan penuh',
      ],
      ctaLabel: 'Tanya paket Booking',
    },
    {
      id: 'webapp-enterprise',
      name: 'Enterprise',
      summary: 'Dibangun dari nol mengikuti alur kerja bisnismu, bukan sebaliknya.',
      features: [
        'Custom workflow & business logic',
        'Integrasi API pihak ketiga',
        'Mobile app (iOS/Android)',
        'Dedicated support',
        'SLA uptime',
        'On-site training',
        'Estimasi build: 1-3 bulan tergantung scope',
      ],
      ctaLabel: 'Konsultasi Enterprise',
    },
  ],
};

export const allPackages: PackageGroup[] = [landingPackage, webappPackage];
