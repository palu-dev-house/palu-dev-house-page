export type ArticleCategory = 'Aplikasi' | 'Website' | 'Hosting' | 'SEO' | 'Studi Kasus';

export interface ArticleSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  callout?: { title: string; body: string };
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  intro: string;
  sections: ArticleSection[];
  cta: { headline: string; body: string };
}

export const articles: Article[] = [
  {
    slug: 'apa-itu-erp',
    title: 'Apa Itu ERP? Panduan Lengkap untuk UMKM Indonesia',
    description:
      'Penjelasan ERP (Enterprise Resource Planning) dalam bahasa sederhana: fungsi, modul, dan kapan UMKM butuh ERP. Plus contoh ERP untuk cafe dan toko retail.',
    category: 'Aplikasi',
    readTime: '6 menit',
    publishedAt: '2026-04-20',
    intro:
      'ERP (Enterprise Resource Planning) kedengarannya ribet, padahal konsepnya simpel: satu sistem yang gabungin semua operasional bisnis — mulai dari kasir, stok barang, keuangan, sampai staff — dalam satu dashboard. UMKM Indonesia makin banyak yang beralih ke ERP karena Excel dan catatan manual sudah ga cukup buat skala yang bertumbuh.',
    sections: [
      {
        heading: 'ERP Itu Apa Sebenarnya?',
        paragraphs: [
          'Bayangin kamu punya cafe dengan 3 cabang. Tiap cabang punya kasir sendiri, stok masing-masing, dan laporan Excel yang berbeda format. Mau tau total penjualan semua cabang hari ini? Harus buka 3 file, copy-paste, total manual. Capek.',
          'ERP ngasih satu tempat buat semua itu. Transaksi dari cabang A, B, C langsung masuk ke dashboard pusat. Stok kebaca real-time. Laporan otomatis ter-generate. Kamu tinggal buka HP, semua data ada.',
        ],
      },
      {
        heading: 'Modul Utama ERP untuk UMKM',
        bullets: [
          'POS / Kasir — transaksi di titik penjualan, cetak struk, tracking item terjual',
          'Inventory — stok masuk/keluar, alert stok minimum, supplier management',
          'Multi-outlet — satu dashboard, banyak cabang, transfer stok antar cabang',
          'Staff & Shift — absensi, shift scheduling, komisi per staff',
          'Analytics — penjualan per kategori, jam ramai, menu favorit, profit margin',
          'Integrasi — WhatsApp blast, payment gateway, marketplace (Tokopedia/Shopee)',
        ],
      },
      {
        heading: 'Kapan Bisnis Butuh ERP?',
        paragraphs: [
          'Indikator simpel: kalau kamu mulai kehilangan kontrol. Stok sering kekurangan, laporan keuangan telat 2 minggu, staff ga tau harga terbaru, laporan penjualan antara cabang ga konsisten.',
          'Biasanya threshold-nya di angka 100+ transaksi harian, atau saat kamu buka cabang kedua. Di bawah itu, POS biasa plus Google Sheets masih cukup. Di atasnya, ERP jadi investasi yang balik modal dalam hitungan bulan.',
        ],
      },
      {
        heading: 'ERP Custom vs ERP SaaS',
        paragraphs: [
          'SaaS ERP (Moka, Majoo, Pawoon) siap pakai, tapi kamu harus ngikutin workflow mereka. Cocok buat bisnis yang model operasionalnya standar.',
          'ERP custom dibangun sesuai workflow bisnismu — misal sistem komisi unik, perhitungan HPP yang kompleks, atau integrasi khusus ke supplier lokal. Investasi awal lebih besar, tapi fit sempurna ke bisnis kamu.',
        ],
        callout: {
          title: 'Pertimbangan biaya',
          body: 'SaaS ERP biasanya Rp 200rb – 2jt/bulan per outlet. ERP custom Palu Dev House dari Rp 9 juta build (estimasi 1 bulan penuh) + Rp 300rb/bulan hosting, tanpa fee per outlet.',
        },
      },
    ],
    cta: {
      headline: 'Masih bingung pilih ERP yang cocok untuk bisnismu?',
      body: 'Ikuti quiz 2 menit untuk dapat rekomendasi paket yang pas — atau konsultasi langsung via WhatsApp.',
    },
  },
  {
    slug: 'apa-itu-pos',
    title: 'Apa Itu POS/Kasir Digital? Panduan untuk Cafe & Toko',
    description:
      'Penjelasan POS (Point of Sale) lengkap: cara kerja, fitur wajib, dan kapan bisnis perlu upgrade dari kasir manual ke digital.',
    category: 'Aplikasi',
    readTime: '5 menit',
    publishedAt: '2026-04-21',
    intro:
      'POS (Point of Sale) adalah sistem kasir digital yang gantiin catatan buku dan kalkulator. Bukan cuma bikin hitung-hitungan lebih cepat — POS ngasih data penjualan real-time yang bisa dianalisa. Mulai dari warung kopi sampai minimarket, POS sudah jadi standar baru.',
    sections: [
      {
        heading: 'Cara Kerja POS Digital',
        paragraphs: [
          'POS modern punya 3 komponen: software (aplikasi kasir), hardware (tablet/PC + printer struk), dan database (tempat nyimpen data transaksi).',
          'Saat pelanggan bayar, kasir tinggal pilih menu di layar, sistem otomatis hitung total, kurangi stok, cetak struk, dan simpan data transaksi. Semua itu dalam hitungan detik.',
        ],
      },
      {
        heading: 'Fitur Wajib POS yang Bagus',
        bullets: [
          'Menu/produk management dengan foto dan kategori',
          'Multiple payment methods (cash, QRIS, debit, e-wallet)',
          'Cetak struk thermal printer',
          'Tracking stok otomatis setiap transaksi',
          'Laporan harian/bulanan (penjualan, profit, item terlaris)',
          'Shift management untuk multiple kasir',
          'Diskon, promo, dan voucher handling',
          'Backup data otomatis (lokal + cloud)',
        ],
      },
      {
        heading: 'POS untuk Cafe vs Retail',
        paragraphs: [
          'Cafe/restoran butuh fitur khusus: modifier menu (extra shot, ukuran), table management, split bill, dan kitchen display. Kalau POS kamu belum support, staff dapur bakal kerepotan.',
          'Retail/toko lebih butuh: barcode scanning, multi-variant (ukuran/warna), bundle pricing, dan integrasi marketplace. Transaksi retail biasanya lebih cepat tapi lebih banyak SKU.',
        ],
      },
      {
        heading: 'Kapan Harus Upgrade dari Kasir Manual?',
        paragraphs: [
          'Tandanya: sering salah hitung, laporan harian baru selesai jam 11 malam, stok ga ketemu antara catatan dan fisik, atau pelanggan komplain struk ga jelas.',
          'Investasi POS biasanya balik dalam 2-3 bulan dari pengurangan kesalahan hitung saja, belum dari insight data yang bisa kamu pakai buat naikin penjualan.',
        ],
      },
    ],
    cta: {
      headline: 'Butuh POS yang sesuai bisnismu?',
      body: 'Paket POS Palu Dev House mulai Rp 4 juta + Rp 150rb/bulan termasuk hosting Indonesia, estimasi build 1 bulan penuh. Konsultasi dulu untuk memastikan fit.',
    },
  },
  {
    slug: 'apa-itu-landing-page',
    title: 'Apa Itu Landing Page? Beda dengan Homepage & Website Biasa',
    description:
      'Penjelasan landing page: fungsi, struktur ideal, dan perbedaan dengan homepage website. Plus contoh landing page yang convert.',
    category: 'Website',
    readTime: '5 menit',
    publishedAt: '2026-04-22',
    intro:
      'Landing page itu satu halaman web yang dirancang khusus untuk satu tujuan: bikin pengunjung melakukan satu aksi. Bisa daftar newsletter, download e-book, booking konsultasi, atau beli produk. Beda sama homepage yang multi-purpose, landing page fokus.',
    sections: [
      {
        heading: 'Landing Page vs Homepage',
        paragraphs: [
          'Homepage itu pintu utama website — pengunjung bisa eksplor ke banyak halaman lain dari situ. Isinya general: tentang perusahaan, produk, portfolio, kontak, blog.',
          'Landing page itu pintu ke satu tujuan. Ga ada navigasi yang distracting. Semua konten diarahin untuk meyakinkan pengunjung melakukan satu aksi — biasanya isi form atau klik tombol CTA.',
        ],
      },
      {
        heading: 'Struktur Landing Page yang Convert',
        bullets: [
          'Hero section — headline yang jelasin value proposition dalam 5 detik',
          'Problem/pain point — pengunjung harus ngerasa "ini buat saya"',
          'Solusi + benefit — bukan fitur, tapi apa yang mereka dapet',
          'Social proof — testimoni, logo klien, angka pengguna',
          'CTA utama — tombol jelas, warna kontras, teks action-oriented',
          'FAQ singkat — jawab keraguan terakhir sebelum mereka klik',
        ],
      },
      {
        heading: 'Kapan Butuh Landing Page?',
        paragraphs: [
          'Kalau kamu lagi running iklan (Facebook, Google Ads, TikTok), jangan arahin ke homepage. Arahin ke landing page yang khusus match sama copy iklan. Conversion rate biasanya naik 2-5x.',
          'Landing page juga wajib buat promo spesifik, launch produk baru, atau kampanye musiman. Pengunjung yang dateng lewat iklan punya niat spesifik — kasih mereka halaman yang spesifik juga.',
        ],
      },
      {
        heading: 'Landing Page Wajib Punya Technical SEO',
        paragraphs: [
          'Meskipun landing page fokus ke conversion, technical SEO tetap penting. Kenapa? Biar landing page kamu juga muncul di search Google, bukan cuma dari iklan berbayar.',
          'Technical SEO dasar: meta tags yang bagus, Open Graph untuk share media sosial, schema markup (LocalBusiness, FAQ), sitemap, dan Core Web Vitals yang sehat. Tanpa ini, landing page kamu kalah cepat di Google.',
        ],
        callout: {
          title: 'Di Palu Dev House',
          body: 'Semua paket landing page (Rp 150rb – Rp 300rb) sudah include technical SEO. Ga perlu beli jasa SEO terpisah — sudah built-in di build.',
        },
      },
    ],
    cta: {
      headline: 'Siap bikin landing page yang convert?',
      body: 'Mulai dari Rp 150rb — sudah include mobile-first design, technical SEO, dan form WhatsApp integration.',
    },
  },
  {
    slug: 'static-vs-dynamic-web',
    title: 'Static vs Dynamic Web: Mana yang Cocok untuk Bisnis Kamu?',
    description:
      'Perbedaan static website dan dynamic website: cara kerja, biaya, kecepatan, dan kapan pilih masing-masing untuk bisnis UMKM.',
    category: 'Website',
    readTime: '6 menit',
    publishedAt: '2026-04-22',
    intro:
      'Dua tipe website yang sering bikin bingung: static dan dynamic. Salah pilih bisa bikin website kamu over-engineered (mahal, lemot) atau kurang fitur (ga bisa scale). Panduan ini bantu kamu nentuin yang mana yang cocok.',
    sections: [
      {
        heading: 'Static Website Itu Apa?',
        paragraphs: [
          'Website static itu halaman HTML yang sudah "jadi" di server — pas pengunjung buka, server tinggal kirim file yang sama persis ke semua orang. Ga ada database, ga ada logic yang jalan saat di-request.',
          'Contoh: landing page, company profile, portfolio. Konten jarang berubah (mungkin update tiap bulan atau semester), jadi ga butuh sistem dinamis.',
        ],
      },
      {
        heading: 'Dynamic Website Itu Apa?',
        paragraphs: [
          'Website dynamic generate halaman secara real-time saat pengunjung request. Ada database di belakang, ada logic yang jalan (misal: cek login, ambil produk dari database, kalkulasi ongkir).',
          'Contoh: toko online, aplikasi booking, dashboard admin, forum. Konten berubah-ubah, user bisa interaksi, ada login.',
        ],
      },
      {
        heading: 'Perbandingan Langsung',
        bullets: [
          'Kecepatan: Static menang telak — bisa <1 detik. Dynamic tergantung server & database, biasa 1-3 detik',
          'Biaya hosting: Static murah banget (bisa gratis di Cloudflare Pages, Netlify). Dynamic butuh server berbayar',
          'Skalabilitas trafik: Static scale otomatis via CDN. Dynamic perlu tuning kalau trafik lonjak',
          'Fleksibilitas: Dynamic menang — bisa kasih content personal per user. Static sama untuk semua',
          'SEO: Dua-duanya bisa SEO-friendly, tapi static biasanya lebih cepat (plus di Core Web Vitals)',
          'Keamanan: Static lebih aman (ga ada database yang bisa di-hack). Dynamic harus maintain security updates',
        ],
      },
      {
        heading: 'Kapan Pilih Static?',
        paragraphs: [
          'Pilih static kalau konten kamu stabil dan ga ada interaksi user yang kompleks. Landing page untuk cafe, portfolio fotografer, company profile kontraktor — semua cocok static.',
          'Static juga cocok buat bisnis yang ngutamain kecepatan dan SEO. Google suka website yang load cepat, pengunjung suka juga.',
        ],
      },
      {
        heading: 'Kapan Pilih Dynamic?',
        paragraphs: [
          'Pilih dynamic kalau butuh: user login, keranjang belanja, booking dengan kalender, dashboard admin, data yang diupdate dari banyak sumber, atau konten yang berubah per user.',
          'Toko online, aplikasi kasir, sistem ERP, booking salon — semua wajib dynamic.',
        ],
        callout: {
          title: 'Kombinasi paling umum',
          body: 'Landing page (static) untuk marketing + subdomain app (dynamic) untuk operasional. Misal: paludevhouse.site (static) + app.paludevhouse.site (dynamic dashboard).',
        },
      },
    ],
    cta: {
      headline: 'Bingung bisnismu cocok static atau dynamic?',
      body: 'Konsultasi gratis — kami bantu review kebutuhan dan kasih rekomendasi paket yang sesuai.',
    },
  },
  {
    slug: 'apa-itu-seo',
    title: 'Apa Itu SEO? Panduan Technical SEO untuk Pemula',
    description:
      'Penjelasan SEO dari nol: cara kerja Google, technical SEO vs content SEO, dan checklist website yang SEO-friendly.',
    category: 'SEO',
    readTime: '7 menit',
    publishedAt: '2026-04-23',
    intro:
      'SEO (Search Engine Optimization) itu seni dan ilmu bikin website kamu muncul di Google saat orang cari sesuatu yang relevan. Ini bukan magic — ini kombinasi technical setup, konten yang bagus, dan reputasi domain. Panduan ini fokus ke technical SEO, yang paling sering diabaikan pemula.',
    sections: [
      {
        heading: 'Cara Kerja Google Secara Singkat',
        paragraphs: [
          'Google punya "crawler" — bot yang keliling internet baca semua website. Crawler ini masukin halaman ke index (database raksasa Google).',
          'Pas orang ngetik query, Google lihat index-nya, ranking ratusan halaman berdasarkan ratusan faktor (relevansi, kecepatan, backlink, mobile-friendly, dll), lalu tampilin 10 yang teratas di halaman 1.',
        ],
      },
      {
        heading: 'Technical SEO vs Content SEO',
        paragraphs: [
          'Technical SEO: setup teknis website biar Google bisa crawl, index, dan rank dengan mudah. Ini fondasi — tanpa technical SEO yang benar, konten sebagus apapun bakal kalah.',
          'Content SEO: bikin konten yang match intent pencari. Artikel, copywriting, keyword targeting. Ini diatasnya fondasi.',
        ],
      },
      {
        heading: 'Checklist Technical SEO Wajib',
        bullets: [
          'Meta tags (title & description) unique di setiap halaman',
          'Heading hierarchy benar (satu H1, H2/H3 terstruktur)',
          'Open Graph tags untuk preview di media sosial',
          'Schema markup (JSON-LD) — LocalBusiness, FAQ, Product sesuai konteks',
          'Sitemap.xml yang up-to-date',
          'Robots.txt yang benar (jangan accidentally block Google)',
          'URL yang bersih dan deskriptif (bukan ?id=123)',
          'Mobile-first responsive design',
          'Core Web Vitals sehat — LCP <2.5s, CLS <0.1, INP <200ms',
          'HTTPS aktif dengan sertifikat valid',
          'Internal linking yang masuk akal antar halaman',
          'Image optimization — format modern (WebP/AVIF), alt text, lazy loading',
        ],
      },
      {
        heading: 'Kesalahan Technical SEO yang Sering',
        paragraphs: [
          'Title tag generic seperti "Home" atau "Untitled". Setiap halaman harus punya title yang unik dan deskriptif.',
          'Gambar hero 5MB. Google drop ranking kalau website lemot di mobile. Compress image ke max 200KB.',
          'Robots.txt yang block /. Kami pernah audit website yang sudah 2 tahun online tapi ga pernah muncul di Google — ternyata robots.txt-nya block semua crawler.',
          'Schema markup invalid. Schema yang salah ga bakal bikin website kena penalti, tapi juga ga bakal ngasih rich snippet.',
        ],
      },
      {
        heading: 'Mengukur Hasil SEO',
        paragraphs: [
          'Tools gratis yang wajib kamu setup: Google Search Console (lihat query yang bawa visitor, monitor error), Google Analytics 4 (tracking traffic & behavior), PageSpeed Insights (check Core Web Vitals).',
          'SEO butuh waktu — biasanya hasil nyata mulai kelihatan di bulan 3-6. Kalau ada yang jual paket "rank page 1 dalam 1 minggu", itu red flag.',
        ],
        callout: {
          title: 'Di Palu Dev House',
          body: 'Technical SEO sudah built-in di semua landing page (mulai Rp 150rb). Kami ga jual jasa SEO bulanan — fokus bangun fondasi yang solid, lalu kasih kamu tools untuk monitor sendiri.',
        },
      },
    ],
    cta: {
      headline: 'Mau landing page yang technical SEO-nya sudah rapi?',
      body: 'Semua paket landing page kami include meta tags, schema, sitemap, dan Core Web Vitals tuning — tanpa biaya tambahan.',
    },
  },
  {
    slug: 'cara-memilih-server-hosting',
    title: 'Cara Memilih Server & Hosting: Shared vs VPS vs Dedicated vs Cloud',
    description:
      'Panduan memilih tipe hosting untuk website bisnis: shared hosting, VPS, dedicated server, dan cloud. Mana yang cocok untuk UMKM Indonesia.',
    category: 'Hosting',
    readTime: '8 menit',
    publishedAt: '2026-04-23',
    intro:
      'Pilih hosting yang salah bisa bikin website kamu lemot, down pas ramai, atau bayar mahal untuk resource yang ga kepake. Panduan ini jelasin 4 tipe hosting utama dengan analogi sederhana, plus rekomendasi untuk skala bisnis yang berbeda.',
    sections: [
      {
        heading: 'Analogi: Hosting Itu Seperti Tempat Tinggal',
        paragraphs: [
          'Shared hosting = kost. Murah, fasilitas umum dibagi, tapi kalau tetangga ribut kamu kena imbas.',
          'VPS = kontrakan. Kamar sendiri dengan jatah listrik/air terukur, lebih privat, harga menengah.',
          'Dedicated server = rumah sendiri. Penuh kontrol, resource penuh, tapi bayar listrik dan maintenance sendiri.',
          'Cloud = apartemen dengan layanan hotel. Bisa pindah ukuran kamar sesuai kebutuhan, bayar pakai apa, lebih fleksibel.',
        ],
      },
      {
        heading: 'Shared Hosting',
        paragraphs: [
          'Satu server fisik di-share ke ratusan website. Resource (CPU, RAM, bandwidth) dibagi-bagi. Paling murah (Rp 25-50rb/bulan), paling simpel (tinggal upload file).',
          'Cocok buat: landing page kecil, blog personal, company profile yang trafiknya ga tinggi (< 10rb pengunjung/bulan).',
        ],
        bullets: [
          'Plus: murah, zero setup, ada cPanel',
          'Minus: lemot kalau tetangga lagi ramai, keterbatasan teknis (ga bisa install apa aja), resource terbatas',
          'Rekomendasi provider ID: Niagahoster, Rumahweb, IDwebhost',
        ],
      },
      {
        heading: 'VPS (Virtual Private Server)',
        paragraphs: [
          'Satu server fisik dipecah jadi beberapa "virtual server" — tiap virtual server punya resource yang terjamin. Kamu dapet akses root, bisa install apa aja.',
          'Cocok buat: aplikasi web dengan trafik menengah (10rb-100rb pengunjung/bulan), toko online kecil, aplikasi kasir/ERP untuk 1-3 outlet.',
        ],
        bullets: [
          'Plus: resource terjamin, full control, lebih kenceng dari shared',
          'Minus: butuh skill sysadmin (atau managed VPS yang lebih mahal), self-maintenance',
          'Rekomendasi provider ID: IDCloudHost (mulai Rp 80rb/bln), Biznet Gio (mulai Rp 99rb/bln), Alibaba Cloud Jakarta (mulai Rp 200rb/bln)',
        ],
      },
      {
        heading: 'Dedicated Server',
        paragraphs: [
          'Satu server fisik kamu sewa sendiri — full resource, full control. Harga Rp 2-10jt/bulan tergantung spek.',
          'Cocok buat: aplikasi enterprise dengan trafik tinggi, compliance khusus yang ga bisa share infrastructure, atau use case yang butuh hardware spesifik (GPU, SSD enterprise).',
        ],
        bullets: [
          'Plus: performance maksimal, full isolation, bisa custom hardware',
          'Minus: mahal, butuh tim IT untuk manage, lama kalau mau upgrade',
          'Rekomendasi provider ID: Biznet, Lintasarta, Telkomsigma',
        ],
      },
      {
        heading: 'Cloud Hosting',
        paragraphs: [
          'Resource tersebar di banyak server fisik, kamu bayar sesuai pemakaian. Bisa auto-scale — trafik naik, server nambah otomatis. Trafik turun, biaya turun.',
          'Cocok buat: aplikasi dengan trafik yang ga predictable, startup yang mau scale cepat, atau project yang butuh high availability (99.99% uptime).',
        ],
        bullets: [
          'Plus: elastic (naik-turun sesuai butuh), high availability, banyak service tambahan (database managed, CDN, AI)',
          'Minus: pricing kompleks (bisa kaget kalau ga monitor), learning curve tinggi',
          'Rekomendasi: Alibaba Cloud Jakarta, AWS Jakarta, Railway, DigitalOcean, Google Cloud Jakarta',
        ],
      },
      {
        heading: 'Rekomendasi Cepat Berdasarkan Use Case',
        bullets: [
          'Landing page cafe/toko — Shared hosting cukup (Rp 30-50rb/bulan)',
          'Company profile + blog sederhana — Shared hosting / static hosting gratis (Cloudflare Pages)',
          'Toko online kecil (< 500 produk) — VPS kecil atau managed hosting WooCommerce',
          'Aplikasi kasir 1-3 outlet — VPS IDCloudHost / Biznet Indonesia (Rp 99-200rb/bulan)',
          'Aplikasi multi-outlet / ERP — VPS menengah Alibaba Jakarta / Cloud',
          'Enterprise dengan compliance — Dedicated atau Private Cloud',
        ],
        callout: {
          title: 'Kenapa server Indonesia?',
          body: 'Latency ke pengunjung Indonesia lebih rendah (< 50ms vs 200ms dari Singapore), compliance data lokal (UU PDP), dan support bahasa Indonesia kalau ada masalah.',
        },
      },
    ],
    cta: {
      headline: 'Bingung hosting mana yang cocok untuk aplikasi bisnismu?',
      body: 'Semua paket web app Palu Dev House sudah include hosting server Indonesia. Ga perlu pusing setup VPS sendiri.',
    },
  },
  {
    slug: 'rekomendasi-hosting-indonesia',
    title: 'Rekomendasi Hosting Indonesia 2026: Biznet, IDCloudHost, Alibaba Jakarta',
    description:
      'Review hosting Indonesia terbaik: Biznet Gio, IDCloudHost, Alibaba Cloud Jakarta, Niagahoster, dan Railway. Perbandingan harga, performa, dan support.',
    category: 'Hosting',
    readTime: '7 menit',
    publishedAt: '2026-04-24',
    intro:
      'Deploy di server Indonesia bukan cuma soal speed — juga soal compliance (UU PDP), support bahasa Indonesia, dan akses billing yang gampang (transfer bank lokal). Berikut 5 provider hosting yang sering kami pakai untuk project klien di 2026.',
    sections: [
      {
        heading: 'IDCloudHost — VPS Murah untuk Startup',
        paragraphs: [
          'Provider lokal yang fokus ke harga bersaing. VPS mulai Rp 80rb/bulan untuk 1 CPU + 1GB RAM. Data center di Jakarta (Cyber 1) dan Palembang.',
          'Dashboard-nya bahasa Indonesia, billing per bulan via transfer bank atau GoPay. Support via WhatsApp yang responsive — rare untuk provider VPS.',
        ],
        bullets: [
          'Best untuk: Aplikasi kasir/ERP skala kecil-menengah, landing page yang butuh lebih dari shared hosting',
          'Plus: Murah, support bahasa Indonesia, bayar lokal gampang',
          'Minus: Uptime kadang fluktuasi, perlu sysadmin skill dasar',
        ],
      },
      {
        heading: 'Biznet Gio — Enterprise-Grade Jakarta',
        paragraphs: [
          'Bagian dari Biznet (ISP Indonesia) yang fokus ke cloud. Data center Tier IV di Jakarta, latency super rendah ke pengunjung Indonesia.',
          'VPS mulai Rp 99rb/bulan. Cocok buat bisnis yang butuh SLA serius (99.9%+ uptime). Banyak dipakai korporat lokal.',
        ],
        bullets: [
          'Best untuk: Aplikasi enterprise, compliance ketat, bisnis yang butuh uptime tinggi',
          'Plus: Infrastructure premium, SLA ketat, support 24/7, data center sertifikat Tier IV',
          'Minus: Harga naik cepat kalau scale, dashboard teknikal (bukan buat pemula)',
        ],
      },
      {
        heading: 'Alibaba Cloud Jakarta — Cloud Global dengan Footprint ID',
        paragraphs: [
          'Data center Alibaba di Jakarta (ap-southeast-5) buka 2018, sekarang jadi salah satu yang paling matang. VPS (ECS) mulai Rp 200rb/bulan. Dashboard global, tapi billing bisa pakai Rupiah.',
          'Cocok buat bisnis yang mau akses service cloud modern (managed database, CDN, object storage, AI services) tapi deploy di Indonesia.',
        ],
        bullets: [
          'Best untuk: Aplikasi yang butuh scale, akses service cloud modern (RDS, OSS, CDN), ekosistem marketplace (Lazada, Shopee)',
          'Plus: Ekosistem lengkap, dokumentasi bagus, regional redundancy',
          'Minus: Learning curve, UI kurang friendly untuk pemula, billing cloud bisa surprise',
        ],
      },
      {
        heading: 'Niagahoster / Hostinger ID — Shared Hosting Standar',
        paragraphs: [
          'Untuk static website, landing page, atau WordPress kecil, shared hosting masih solusi paling hemat. Niagahoster dan Hostinger dominan di segmen ini.',
          'Harga shared hosting Rp 25-50rb/bulan sudah termasuk domain. Disk 10-50GB, unlimited bandwidth (fair use).',
        ],
        bullets: [
          'Best untuk: Landing page, company profile, blog personal, WordPress kecil',
          'Plus: Sangat murah, 1-click WordPress install, SSL gratis',
          'Minus: Resource share (performance ga stabil), terbatas teknis (ga bisa install Node.js/Python), support suka slow',
        ],
      },
      {
        heading: 'Railway — Deploy Global dengan Ease',
        paragraphs: [
          'Platform deploy modern — push code ke GitHub, Railway deploy otomatis. Global CDN (Anycast), jadi pengunjung Indonesia tetap kena latency rendah via edge nodes.',
          'Mulai USD 5/bulan (~Rp 80rb) hobby plan. Auto-scale, environment variables gampang, database managed (PostgreSQL, MySQL, Redis) sekali klik.',
        ],
        bullets: [
          'Best untuk: Project Next.js/Node.js/Python, MVP yang butuh deploy cepat, team kecil',
          'Plus: DevEx luar biasa, zero-config deploy, ada free tier, CI/CD built-in',
          'Minus: Server bukan di Indonesia (data center Singapore/US), billing dalam USD, kurang cocok untuk compliance yang ketat soal lokasi data',
        ],
        callout: {
          title: 'Website ini',
          body: 'Deploy di Railway dengan auto-deploy dari GitHub. Tiap push ke main, Railway rebuild dalam 2-3 menit. Cocok untuk static marketing site.',
        },
      },
      {
        heading: 'Ringkasan: Pilih Mana?',
        bullets: [
          'Budget < Rp 50rb/bln: Niagahoster/Hostinger shared (landing page)',
          'Budget Rp 80-150rb/bln: IDCloudHost VPS (aplikasi kecil)',
          'Budget Rp 200-500rb/bln: Alibaba Jakarta / Biznet Gio (aplikasi menengah)',
          'Butuh deploy cepat, team kecil: Railway (USD 5-20/bln)',
          'Enterprise / compliance ketat: Biznet Dedicated / Lintasarta',
        ],
      },
    ],
    cta: {
      headline: 'Ga mau ribet pilih dan setup hosting?',
      body: 'Paket web app kami sudah include hosting server Indonesia — kami pilih yang paling fit ke aplikasi kamu, tanpa biaya tambahan.',
    },
  },
  {
    slug: 'before-after-aplikasi-bisnis',
    title: 'Before & After: 5 Cafe UMKM Sebelum dan Sesudah Pakai Aplikasi',
    description:
      'Studi kasus nyata: 5 cafe di Palu & Medan sebelum dan sesudah pakai aplikasi kasir/ERP. Perubahan operasional, laporan, dan revenue.',
    category: 'Studi Kasus',
    readTime: '6 menit',
    publishedAt: '2026-04-24',
    intro:
      'Angka lebih meyakinkan daripada janji marketing. Berikut gambaran cafe-cafe UMKM yang kami observasi — sebelum dan sesudah pakai aplikasi kasir/ERP. Nama disamarkan untuk privacy, tapi pola perubahan mirip di semua kasus.',
    sections: [
      {
        heading: 'Kasus 1: Cafe Kopi di Palu (Single Outlet)',
        paragraphs: [
          'Before: Kasir pakai kalkulator + buku catatan. Laporan harian selesai jam 11 malam (kasir harus hitung manual total per menu). Sering salah kasih kembalian. Ga tau menu mana yang paling laku.',
          'After (3 bulan pakai POS): Laporan harian auto-generate saat tutup. Menu terlaris keluar di dashboard. Waktu tutup kasir turun dari 30 menit jadi 5 menit. Owner tau persis jam ramai dan menu yang harus di-push.',
        ],
        callout: {
          title: 'Impact',
          body: 'Owner mulai promo menu yang margin-nya tinggi di jam sepi. Revenue naik ~15% dalam 3 bulan dari optimasi menu dan pricing.',
        },
      },
      {
        heading: 'Kasus 2: Retail Fashion di Medan (2 Outlet)',
        paragraphs: [
          'Before: 2 outlet pakai kasir manual terpisah. Stok antar outlet ga sinkron — barang di outlet A ada, di outlet B kosong tapi ga pernah transfer. Laporan penjualan harus digabung manual di Excel.',
          'After (4 bulan pakai ERP): Stok real-time antar outlet. Kalau outlet B habis, sistem kasih alert transfer dari A. Laporan gabungan otomatis. Owner bisa pantau performance per outlet dari HP.',
        ],
        callout: {
          title: 'Impact',
          body: 'Barang "numpuk" di satu outlet turun drastis. Customer yang dateng ke outlet tertentu tapi size-nya ga ada bisa dipandu ke outlet lain. Lost sales turun ~20%.',
        },
      },
      {
        heading: 'Kasus 3: Salon di Palu (Booking App)',
        paragraphs: [
          'Before: Booking via WhatsApp manual. Staff harus cek kalender di buku, konfirmasi via chat. Sering double-booking. Customer kadang lupa datang karena ga ada reminder.',
          'After (2 bulan pakai booking app): Customer booking self-service via website. Kalender auto-block slot yang sudah dipesan. Reminder WhatsApp otomatis H-1 dan H-0. No-show turun drastis.',
        ],
        callout: {
          title: 'Impact',
          body: 'Waktu staff untuk handle booking turun 70%. Staff fokus ke customer di salon, bukan balas chat. Revenue naik karena slot terisi lebih optimal.',
        },
      },
      {
        heading: 'Kasus 4: Toko Kue di Medan (Online Ordering)',
        paragraphs: [
          'Before: Pesanan cake via telepon + WhatsApp. Sering miss-komunikasi soal topping, tanggal pickup, alamat delivery. Pernah ada kasus 2 cake dikirim ke alamat yang sama.',
          'After (3 bulan pakai online ordering): Customer pesan via website dengan form terstruktur (topping, pickup/delivery, tanggal, alamat, instruksi khusus). Sistem cetak struk order ke dapur otomatis. Zero miss.',
        ],
        callout: {
          title: 'Impact',
          body: 'Order volume naik 30% (customer bisa pesan tengah malam tanpa nunggu WhatsApp dibalas). Komplain turun 80%.',
        },
      },
      {
        heading: 'Kasus 5: Kursus Bahasa di Palu (Tuition App)',
        paragraphs: [
          'Before: Jadwal kelas di spreadsheet. Pembayaran lewat transfer manual, cek pembayaran satu-satu. Attendance dicatat di kertas yang sering hilang.',
          'After (5 bulan pakai tuition app): Jadwal kelas online, murid bisa cek sendiri. Pembayaran via payment gateway (otomatis rekonsiliasi). Attendance via QR code yang di-scan saat masuk kelas. Laporan attendance dan pembayaran auto-generate tiap bulan.',
        ],
        callout: {
          title: 'Impact',
          body: 'Admin yang dulu full-time jadi part-time — tugas administratif turun 60%. Owner fokus ke kualitas pengajaran.',
        },
      },
      {
        heading: 'Pola yang Terlihat',
        paragraphs: [
          'Investasi aplikasi biasanya balik modal dalam 3-6 bulan dari efisiensi operasional saja, belum dari revenue increase karena insight data.',
          'Yang paling sering bilang "kenapa ga dari dulu pakai ini" adalah owner yang struggle dengan Excel/buku manual selama bertahun-tahun.',
        ],
      },
    ],
    cta: {
      headline: 'Siap upgrade dari kalkulator dan Excel?',
      body: 'Konsultasi 15 menit — kami bantu review operasional bisnismu dan rekomendasi aplikasi yang cocok.',
    },
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}
