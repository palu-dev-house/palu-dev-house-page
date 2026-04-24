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
