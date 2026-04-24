export type PackageCategory = 'landing' | 'webapp';

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
  subtitle: 'Landing page profesional + technical SEO bawaan. Build sekali bayar — hosting Indonesia tersedia sebagai add-on.',
  tiers: [
    {
      id: 'landing-starter',
      name: 'Starter',
      price: 'Rp 150.000',
      priceNumeric: 150000,
      features: [
        '1 halaman landing responsive',
        'Mobile-first design',
        'Form WhatsApp terintegrasi',
        'Meta tags & Open Graph siap',
        'Sitemap + robots.txt',
        'Revisi: 1x',
      ],
      ctaLabel: 'Mulai dengan Starter',
    },
    {
      id: 'landing-pro',
      name: 'Pro',
      price: 'Rp 225.000',
      priceNumeric: 225000,
      popular: true,
      features: [
        '1 halaman landing + section lengkap',
        'Technical SEO on-page (H1, meta, schema)',
        'Google Business Profile setup',
        'Integrasi Google Analytics & Search Console',
        'Animasi & motion design',
        'Revisi: 3x',
      ],
      ctaLabel: 'Ambil paket Pro',
    },
    {
      id: 'landing-max',
      name: 'Max',
      price: 'Rp 300.000',
      priceNumeric: 300000,
      features: [
        'Semua fitur Pro',
        'Keyword research 5 target',
        'Artikel SEO perdana (1 artikel)',
        'JSON-LD schema (LocalBusiness + FAQ)',
        'Page speed & Core Web Vitals tuning',
        'Revisi: unlimited hingga launch',
      ],
      ctaLabel: 'Pilih paket Max',
    },
  ],
};

export const webappPackage: PricingPackage = {
  category: 'webapp',
  title: 'Web Application',
  subtitle: 'Aplikasi kasir, ERP, booking, sistem custom — estimasi build 1 bulan penuh. Hosting server Indonesia termasuk.',
  tiers: [
    {
      id: 'webapp-pos',
      name: 'Standard POS/Kasir',
      price: 'Rp 4.000.000',
      priceNumeric: 4000000,
      monthly: 'Rp 150.000/bulan',
      monthlyNumeric: 150000,
      features: [
        '1 outlet',
        'Menu & produk management',
        'Transaksi real-time',
        'Laporan harian/bulanan',
        'Cetak struk',
        'Hosting server Indonesia + maintenance',
        'Estimasi build: 1 bulan penuh',
      ],
      ctaLabel: 'Pilih paket POS',
    },
    {
      id: 'webapp-erp',
      name: 'Pro ERP',
      price: 'Rp 9.000.000',
      priceNumeric: 9000000,
      monthly: 'Rp 300.000/bulan',
      monthlyNumeric: 300000,
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
      ctaLabel: 'Pilih paket ERP',
    },
    {
      id: 'webapp-booking',
      name: 'Booking/Tuition',
      price: 'Rp 6.000.000',
      priceNumeric: 6000000,
      monthly: 'Rp 200.000/bulan',
      monthlyNumeric: 200000,
      features: [
        'Jadwal & booking online',
        'Payment gateway',
        'Notifikasi WhatsApp otomatis',
        'Manajemen peserta/pelanggan',
        'Laporan revenue',
        'Hosting server Indonesia + maintenance',
        'Estimasi build: 1 bulan penuh',
      ],
      ctaLabel: 'Pilih paket Booking',
    },
    {
      id: 'webapp-enterprise',
      name: 'Enterprise',
      price: 'Mulai Rp 15.000.000',
      priceNumeric: 15000000,
      monthly: 'Mulai Rp 500.000/bulan',
      monthlyNumeric: 500000,
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

export const allPackages: PricingPackage[] = [landingPackage, webappPackage];

export const addOns = [
  { label: 'Domain .my.id', price: 'Rp 30.000/tahun' },
  { label: 'Domain .site', price: 'Rp 200.000/tahun' },
  { label: 'Domain .com / .id', price: 'Rp 175.000 – Rp 350.000/tahun' },
  { label: 'Shared hosting Indonesia', price: 'Mulai Rp 300.000/tahun' },
  { label: 'VPS kecil (Biznet / IDCloudHost)', price: 'Mulai Rp 99.000/bulan' },
  { label: 'VPS Alibaba Jakarta', price: 'Mulai Rp 200.000/bulan' },
  { label: 'Railway Hobby (global CDN)', price: 'Mulai USD 5/bulan' },
  { label: 'Revisi tambahan setelah launch', price: 'Rp 500.000/revisi' },
  { label: 'Training aplikasi (2 jam)', price: 'Rp 1.000.000' },
];

export const paymentOptions = [
  { label: '50% DP / 50% saat launch', detail: 'Pilihan paling umum, cocok untuk semua paket.' },
  { label: '30% DP / 40% mid-project / 30% launch', detail: 'Cocok untuk proyek besar & Enterprise.' },
  { label: 'Full upfront (diskon 10%)', detail: 'Bayar lunas di depan, hemat lebih banyak.' },
];
