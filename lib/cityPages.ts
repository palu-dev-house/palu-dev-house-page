/**
 * City-specific SEO landing pages. Each entry becomes a static page at
 * /{slug} with LocalBusiness schema targeting that city. Copy is written
 * to rank for the city + service keyword combos in Google Indonesia.
 */

export interface CityPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string;
  city: 'Medan' | 'Palu' | 'Indonesia';
  region?: string;
  keywords: string[];
  serviceFocus: 'web' | 'aplikasi' | 'sistem';
  highlights: { title: string; body: string }[];
  localPitch: string[];
  faqs: { question: string; answer: string }[];
}

const sharedWebHighlights = [
  {
    title: 'Landing Page + Technical SEO Bundled',
    body: 'Setiap website yang kami bangun sudah include meta tags, schema, sitemap, Open Graph, dan Core Web Vitals tuning. Siap bersaing di halaman 1 Google sejak hari pertama.',
  },
  {
    title: 'Harga Transparan Mulai Rp 150rb',
    body: 'Bukan harga "hubungi untuk quote". Starter Rp 150rb, Pro Rp 225rb, Max Rp 300rb — semua build sekali bayar, dengan opsi hosting Indonesia sebagai add-on.',
  },
  {
    title: 'Mobile-First & Page Speed',
    body: 'Google ranking ditentukan dari mobile experience. Semua landing page kami lolos PageSpeed Insights 90+ di mobile, dengan design yang clean dan fast-loading.',
  },
];

const sharedAppHighlights = [
  {
    title: 'POS Kasir, ERP, Booking, Tuition',
    body: 'Aplikasi web proven: tokoninja (POS multi-outlet), tuition-app (booking kursus), hinno.art (creative services). Workflow-nya sudah matang, tinggal custom ke bisnismu.',
  },
  {
    title: 'Hosting Server Indonesia Termasuk',
    body: 'Deploy di server Jakarta/Medan — latency rendah untuk pengunjung Indonesia, compliance UU PDP, billing lokal. Kami handle setup, kamu fokus jualan.',
  },
  {
    title: 'Maintenance Bulanan Fair',
    body: 'Monthly fee Rp 120rb – Rp 350rb tergantung paket. Sudah include bug fix, minor update, dan hosting. Tidak ada fee tersembunyi per outlet atau per user.',
  },
];

export const cityPages: CityPage[] = [
  {
    slug: 'jasa-buat-web-medan',
    city: 'Medan',
    region: 'Sumatera Utara',
    serviceFocus: 'web',
    title: 'Jasa Buat Web Medan — Landing Page & Technical SEO',
    description:
      'Jasa buat web Medan mulai Rp 150rb. Landing page profesional dengan technical SEO bundled, mobile-first, form WhatsApp, dan hosting server Indonesia. Melayani UMKM & bisnis di Medan, Deli Serdang, Binjai.',
    h1: 'Jasa Buat Web di Medan yang Fokus ke Hasil',
    kicker: 'Medan · Sumatera Utara',
    intro:
      'Cari jasa buat web di Medan yang transparan dan ga ribet? Palu Dev House punya tim lokal yang paham pasar Sumatera Utara. Dari UMKM di Pasar 4 sampai bisnis menengah di Ringroad, kami bantu bikin website yang bukan cuma cantik — tapi benar-benar jadi funnel pelanggan.',
    keywords: [
      'jasa buat web medan',
      'jasa buat website medan',
      'pembuatan website medan',
      'jasa web sumatera utara',
      'web developer medan',
      'jasa landing page medan',
      'software house medan',
    ],
    highlights: sharedWebHighlights,
    localPitch: [
      'Tim berbasis di Medan — bisa meeting langsung kalau perlu',
      'Paham karakteristik pasar FnB, retail, dan jasa di Sumatera Utara',
      'Support via WhatsApp bahasa Indonesia, jam kerja WIB',
      'Portfolio klien Medan: tokoninja (POS), cafe, toko retail',
      'Invoice resmi, transfer BCA atau QRIS',
    ],
    faqs: [
      {
        question: 'Apakah Palu Dev House benar-benar berbasis di Medan?',
        answer:
          'Ya, kami punya tim di Medan (Sumatera Utara) dan Palu (Sulawesi Tengah). Untuk klien Medan, kami bisa meeting offline kalau diperlukan. Sebagian besar koordinasi tetap via WhatsApp & Google Meet supaya hemat waktu kamu.',
      },
      {
        question: 'Berapa lama proses jasa buat web di Medan?',
        answer:
          'Landing Page Starter 5–7 hari kerja. Pro 10–14 hari. Max 14–21 hari. Tergantung kelengkapan konten yang kamu siapkan. Kami kasih timeline detail setelah briefing awal.',
      },
      {
        question: 'Website Medan yang dibuat sudah SEO-ready?',
        answer:
          'Semua paket landing page kami include technical SEO: meta tags, schema markup, sitemap, robots.txt, Open Graph, dan Core Web Vitals tuning. Paket Pro & Max juga include Google Business Profile setup — penting banget untuk ranking "local search" di Medan.',
      },
      {
        question: 'Bisa sekalian bikin aplikasi kasir atau ERP untuk bisnis di Medan?',
        answer:
          'Bisa. Kami juga punya paket web application (POS/Kasir Rp 800rb, ERP Rp 1.8jt, Booking Rp 1.2jt) yang proven dipakai klien retail dan FnB di Sumatera Utara. Cek halaman Harga untuk detail.',
      },
    ],
  },
  {
    slug: 'jasa-buat-aplikasi-medan',
    city: 'Medan',
    region: 'Sumatera Utara',
    serviceFocus: 'aplikasi',
    title: 'Jasa Buat Aplikasi Medan — POS, ERP, Booking',
    description:
      'Jasa buat aplikasi Medan mulai Rp 800rb + hosting Indonesia. Aplikasi kasir (POS), ERP multi-outlet, booking online, dan sistem custom untuk UMKM, retail, FnB di Medan & Sumatera Utara.',
    h1: 'Jasa Buat Aplikasi di Medan untuk UMKM & Bisnis Menengah',
    kicker: 'Medan · Sumatera Utara',
    intro:
      'Bisnis kamu mulai kewalahan diatur pakai Excel? Saatnya upgrade ke aplikasi web custom. Kami spesialis jasa buat aplikasi di Medan — POS kasir untuk cafe, ERP multi-outlet untuk retail, booking online untuk jasa salon/klinik. Semua dengan hosting server Indonesia dan harga transparan.',
    keywords: [
      'jasa buat aplikasi medan',
      'jasa pembuatan aplikasi medan',
      'jasa aplikasi kasir medan',
      'jasa ERP medan',
      'jasa software medan',
      'software house medan',
      'jasa buat sistem medan',
    ],
    highlights: sharedAppHighlights,
    localPitch: [
      'Tim di Medan — training aplikasi bisa dilakukan on-site di outlet kamu',
      'Banyak klien retail & FnB di Medan yang sudah pakai sistem kami',
      'Integrasi WhatsApp untuk notifikasi booking / order ke pelanggan Medan',
      'Payment gateway lokal: QRIS, Xendit, Midtrans, BCA Virtual Account',
      'Support WhatsApp 24/7, meeting offline tersedia kalau diperlukan',
    ],
    faqs: [
      {
        question: 'Aplikasi kasir untuk cafe di Medan, harga berapa?',
        answer:
          'Standard POS/Kasir Rp 800rb sekali bayar + Rp 120rb/bulan untuk hosting & maintenance. Cocok untuk single outlet. Kalau multi-outlet (misal cafe dengan 2–3 cabang di Medan), kami rekomendasi Pro ERP Rp 1.8jt + Rp 200rb/bulan.',
      },
      {
        question: 'Aplikasinya bisa diakses dari HP?',
        answer:
          'Ya, semua web application kami responsive — bisa dibuka dari laptop kasir, tablet POS, dan HP owner untuk monitoring. Untuk Enterprise, kami juga sediakan mobile app native (iOS/Android) jika butuh offline mode.',
      },
      {
        question: 'Data aplikasi disimpan di server mana?',
        answer:
          'Server Indonesia (Jakarta/Medan) — Biznet Gio, IDCloudHost, atau Alibaba Cloud Jakarta tergantung paket. Latency rendah untuk pengguna Medan, compliance UU PDP, backup harian otomatis.',
      },
      {
        question: 'Bisa custom workflow sesuai bisnis saya di Medan?',
        answer:
          'Paket Enterprise (mulai Rp 3.5jt) memang dibangun dari nol sesuai workflow kamu — misal sistem komisi unik, integrasi supplier lokal, atau alur approval yang spesifik. Kami briefing dulu, mapping proses, lalu build.',
      },
    ],
  },
  {
    slug: 'jasa-buat-web-palu',
    city: 'Palu',
    region: 'Sulawesi Tengah',
    serviceFocus: 'web',
    title: 'Jasa Buat Web Palu — Landing Page Profesional',
    description:
      'Jasa buat web Palu mulai Rp 150rb. Landing page profesional dengan technical SEO, mobile-first, form WhatsApp terintegrasi, dan hosting server Indonesia. Tim lokal Sulawesi Tengah.',
    h1: 'Jasa Buat Web di Palu — Software House Lokal',
    kicker: 'Palu · Sulawesi Tengah',
    intro:
      'Bisnis di Palu butuh website tapi bingung mulai dari mana? Kami software house lokal yang paham pasar Sulawesi Tengah — dari warung kopi di Jalan Imam Bonjol sampai bisnis jasa di Kelurahan Lolu. Harga transparan mulai Rp 150rb, technical SEO bundled, meeting bisa offline kalau perlu.',
    keywords: [
      'jasa buat web palu',
      'jasa buat website palu',
      'pembuatan website palu',
      'jasa web sulawesi tengah',
      'web developer palu',
      'jasa landing page palu',
      'software house palu',
    ],
    highlights: sharedWebHighlights,
    localPitch: [
      'Tim lokal di Palu — bisa meeting offline di cafe / co-working',
      'Paham karakteristik pasar FnB & retail Sulawesi Tengah',
      'Pengalaman handle klien Palu di berbagai sektor',
      'Support bahasa Indonesia, jam kerja WITA',
      'Invoice resmi, pembayaran via BCA, QRIS, atau transfer lokal',
    ],
    faqs: [
      {
        question: 'Palu Dev House benar-benar ada di Palu?',
        answer:
          'Ya, kami punya tim di Palu (Sulawesi Tengah) — inilah asal nama "Palu Dev House". Untuk klien Palu, kami bisa meeting langsung. Sebagian besar koordinasi tetap remote supaya proyek cepat jalan.',
      },
      {
        question: 'Berapa harga jasa buat web di Palu?',
        answer:
          'Mulai Rp 150rb untuk Landing Page Starter, Rp 225rb untuk Pro, Rp 300rb untuk Max. Semua harga sudah include technical SEO (meta tags, schema, sitemap). Hosting Indonesia sebagai add-on (shared Rp 300rb/tahun atau VPS Rp 99rb/bulan).',
      },
      {
        question: 'Website bisnis Palu bisa muncul di Google Palu?',
        answer:
          'Paket Pro & Max include Google Business Profile setup — ini kunci untuk muncul di "Google Maps search" saat orang cari "cafe Palu" atau "salon Palu". Kami juga tuning JSON-LD schema LocalBusiness supaya Google paham lokasi kamu.',
      },
      {
        question: 'Kalau butuh aplikasi kasir atau booking, bisa sekalian?',
        answer:
          'Bisa. Kami juga melayani jasa buat aplikasi di Palu — POS kasir Rp 800rb + Rp 120rb/bulan, ERP multi-outlet Rp 1.8jt + Rp 200rb/bulan, booking online Rp 1.2jt + Rp 150rb/bulan. Semua hosting server Indonesia.',
      },
    ],
  },
  {
    slug: 'jasa-buat-aplikasi-palu',
    city: 'Palu',
    region: 'Sulawesi Tengah',
    serviceFocus: 'aplikasi',
    title: 'Jasa Buat Aplikasi Palu — POS, ERP, Sistem Custom',
    description:
      'Jasa buat aplikasi Palu mulai Rp 800rb + hosting Indonesia. POS kasir, ERP, booking, dan jasa buat sistem custom untuk UMKM, cafe, retail, klinik, kursus di Palu & Sulawesi Tengah.',
    h1: 'Jasa Buat Aplikasi di Palu — Sistem Custom untuk Bisnis Lokal',
    kicker: 'Palu · Sulawesi Tengah',
    intro:
      'Mau upgrade bisnis Palu kamu dari catatan manual ke aplikasi digital? Kami tim lokal yang fokus ke jasa buat aplikasi untuk UMKM Sulawesi Tengah. Aplikasi kasir untuk cafe di Kelurahan Besusu, sistem booking untuk klinik di Kelurahan Talise, ERP untuk toko retail — semua proven, harga transparan.',
    keywords: [
      'jasa buat aplikasi palu',
      'jasa pembuatan aplikasi palu',
      'jasa aplikasi kasir palu',
      'jasa ERP palu',
      'jasa buat sistem palu',
      'jasa buat program palu',
      'software house palu',
    ],
    highlights: sharedAppHighlights,
    localPitch: [
      'Tim di Palu — training offline di outlet kamu mungkin dilakukan',
      'Paham tantangan operasional UMKM Sulawesi Tengah',
      'Integrasi payment lokal: QRIS, BCA VA, BNI, Mandiri VA',
      'Support bahasa Indonesia, response cepat via WhatsApp',
      'Dokumentasi aplikasi lengkap, training staff included',
    ],
    faqs: [
      {
        question: 'Harga jasa buat aplikasi kasir di Palu berapa?',
        answer:
          'Standard POS/Kasir Rp 800rb sekali bayar + Rp 120rb/bulan (hosting + maintenance). Untuk multi-outlet atau fitur lebih kompleks, Pro ERP Rp 1.8jt + Rp 200rb/bulan. Booking/Tuition App Rp 1.2jt + Rp 150rb/bulan.',
      },
      {
        question: 'Aplikasinya bisa dipakai offline?',
        answer:
          'Web application kami butuh internet. Untuk Enterprise (mulai Rp 3.5jt), kami juga sediakan mobile app native yang bisa offline mode + sync saat online — cocok untuk daerah dengan sinyal ga stabil.',
      },
      {
        question: 'Ada garansi setelah aplikasi launch?',
        answer:
          'Ya — 30 hari gratis bug-fix setelah launch. Untuk paket dengan maintenance bulanan, bug-fix dan minor update selalu include selama kontrak aktif. Support via WhatsApp dalam jam kerja WITA.',
      },
      {
        question: 'Kalau mau custom sistem atau program khusus bisa?',
        answer:
          'Bisa — paket Enterprise mulai Rp 3.5jt khusus untuk custom workflow, integrasi API, atau mobile app. Kami briefing dulu, mapping proses bisnis kamu, baru build sesuai kebutuhan.',
      },
    ],
  },
];

export function getCityPageBySlug(slug: string): CityPage | undefined {
  return cityPages.find((p) => p.slug === slug);
}

export function getAllCityPageSlugs(): string[] {
  return cityPages.map((p) => p.slug);
}
