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

  return {
    packageId: 'landing-pro',
    headline: 'Paket yang cocok: Landing Page Pro',
    reason:
      'Untuk bisnis kamu, mulai dari Landing Page Pro paling masuk akal: website profesional dengan SEO on-page, bisa di-expand ke aplikasi atau paket SEO bulanan nanti.',
    priceLabel: 'Rp 4.500.000',
    scrollTo: 'pricing',
  };
}
