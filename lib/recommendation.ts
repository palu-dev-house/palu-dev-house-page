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
  /** What to do next, in the visitor's words — the result used to end on a price. */
  nextStep: string;
  scrollTo: 'paket';
}

export function recommend(answers: QuizAnswers): Recommendation {
  const { q1, q2, q3, q4 } = answers;

  if (q2 === 'A' && (q4 === 'A' || q4 === 'D')) {
    if (q4 === 'D') {
      return {
        packageId: 'landing-starter',
        headline: 'Paket yang cocok: Landing Page Starter',
        reason:
          'Bisnis kamu butuh presence digital yang profesional dulu. Landing Page Starter sudah cukup untuk bangun kepercayaan pelanggan dan tampil di Google — technical SEO + fondasi GEO sudah include di paket.',
        nextStep:
          'Chat WhatsApp dengan nama bisnismu dan 3-5 hal yang mau tampil di halaman — kami balas dengan estimasi biaya dan timeline-nya.',
        scrollTo: 'paket',
      };
    }
    return {
      packageId: 'landing-pro',
      headline: 'Paket yang cocok: Landing Page Pro',
      reason:
        'Kamu belum punya presence digital dan mau jangkau pelanggan baru. Landing Page Pro punya technical SEO on-page, Google Analytics, dan schema markup supaya cepat naik di Google.',
      nextStep:
        'Chat WhatsApp dan cerita siapa pelanggan yang mau kamu jangkau — kami hitung scope-nya lalu kirim estimasi lengkap.',
      scrollTo: 'paket',
    };
  }

  if (q3 === 'C') {
    if (q4 === 'C') {
      return {
        packageId: 'webapp-enterprise',
        headline: 'Paket yang cocok: Enterprise',
        reason:
          'Skala bisnis kamu sudah besar dan mau jangkau daerah baru. Paket Enterprise ideal untuk custom workflow, mobile app, dan integrasi API pihak ketiga.',
        nextStep:
          'Chat WhatsApp dan ceritakan alur kerja yang mau diotomatiskan. Kami mapping prosesnya dulu, baru keluar estimasi dan timeline.',
        scrollTo: 'paket',
      };
    }
    return {
      packageId: 'webapp-erp',
      headline: 'Paket yang cocok: Pro ERP',
      reason:
        'Multi-outlet atau volume transaksi tinggi butuh sistem terpadu: inventory, staff, laporan analytics. Pro ERP jawab semua itu dalam satu dashboard — hosting server Indonesia sudah termasuk.',
      nextStep:
        'Chat WhatsApp dengan jumlah outlet dan modul yang kamu butuh — estimasi build dan maintenance kami kirim setelah briefing singkat.',
      scrollTo: 'paket',
    };
  }

  if ((q1 === 'C' || q1 === 'D') && q4 !== 'D') {
    return {
      packageId: 'webapp-booking',
      headline: 'Paket yang cocok: Booking/Tuition App',
      reason:
        'Bisnis jasa atau edukasi paling butuh sistem booking online & notifikasi otomatis. Pelanggan bisa pesan tanpa chat manual, kamu fokus deliver.',
      nextStep:
        'Chat WhatsApp dan cerita alur booking bisnismu sekarang — kami susun scope-nya lalu kirim estimasi.',
      scrollTo: 'paket',
    };
  }

  if ((q2 === 'B' || q2 === 'C') && (q4 === 'A' || q4 === 'C')) {
    return {
      packageId: 'landing-max',
      headline: 'Paket yang cocok: Landing Page Max',
      reason:
        'Kamu sudah punya website dan mau dapat lebih banyak pelanggan. Landing Page Max punya technical SEO + GEO lengkap, keyword & conversational query research, structured data penuh, akses AI crawler, dan Core Web Vitals tuning.',
      nextStep:
        'Chat WhatsApp dengan alamat website kamu sekarang — kami audit sekilas, lalu kirim estimasi untuk upgrade-nya.',
      scrollTo: 'paket',
    };
  }

  if ((q1 === 'A' || q1 === 'B') && q4 === 'B') {
    return {
      packageId: 'webapp-pos',
      headline: 'Paket yang cocok: Standard POS/Kasir',
      reason:
        'Untuk cafe atau retail skala kamu, Standard POS sudah cukup: kasir digital, laporan otomatis, cetak struk. Bisa di-upgrade ke Pro ERP kalau bisnis berkembang.',
      nextStep:
        'Chat WhatsApp dengan jenis outlet dan jumlah item di menu kamu — estimasi build dan maintenance kami kirim balik.',
      scrollTo: 'paket',
    };
  }

  return {
    packageId: 'landing-pro',
    headline: 'Paket yang cocok: Landing Page Pro',
    reason:
      'Untuk bisnis kamu, mulai dari Landing Page Pro paling masuk akal: website profesional dengan technical SEO on-page, bisa di-expand ke aplikasi nanti kalau skala bertambah.',
    nextStep:
      'Chat WhatsApp dan cerita singkat soal bisnismu — kami bantu pastikan paketnya pas sebelum kirim estimasi.',
    scrollTo: 'paket',
  };
}
