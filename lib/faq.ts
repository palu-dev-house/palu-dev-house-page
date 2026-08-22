export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: 'Apakah Palu Dev House menerima jasa buat web untuk klien di Medan, Palu, atau luar kota?',
    answer: 'Ya, kami melayani jasa buat web & jasa buat aplikasi untuk klien di Medan (Sumatera Utara), Palu (Sulawesi Tengah), dan seluruh Indonesia. Tim kami berbasis di 2 kota tersebut, tapi 90%+ proyek dikerjakan remote — meeting via Google Meet, delivery via email/WhatsApp. Untuk klien Medan & Palu, meeting offline bisa diatur kalau diperlukan.',
  },
  {
    question: 'Bagaimana cara tahu biaya untuk proyek saya?',
    answer: 'Kami hitung per proyek, bukan pakai daftar harga gelondongan — karena landing page 1 halaman dan aplikasi kasir multi-outlet jelas beda beban kerjanya. Chat WhatsApp, cerita jenis bisnis dan apa yang mau dicapai, lalu kami balas dengan scope dan estimasi biaya + timeline yang jelas. Konsultasi dan estimasi gratis, tanpa kewajiban lanjut. Setelah deal, angkanya dikunci di invoice — tidak ada biaya tersembunyi di tengah jalan.'
  },
  {
    question: 'Berapa lama proses pembuatan website atau aplikasi?',
    answer: 'Landing Page Starter 5–7 hari kerja, Pro 10–14 hari. Web App (POS/ERP/Booking) estimasi 1 bulan penuh untuk build & QA. Paket Enterprise 1–3 bulan tergantung scope. Setiap proyek akan dapat timeline detail setelah briefing awal.',
  },
  {
    question: 'Apakah domain dan hosting sudah termasuk?',
    answer: 'Domain dibeli klien sendiri, atas nama kamu — jadi kepemilikan 100% di tangan kamu dan kami bantu carikan serta setup-nya. Biaya domain dibayar langsung ke registrar, di luar paket. Untuk Landing Page, paketnya mencakup build + technical SEO + GEO; hosting tersedia sebagai add-on (shared hosting Indonesia atau VPS) dan kami bantu pilihkan yang sesuai skala kamu. Untuk Web App, hosting server Indonesia sudah include selama kontrak maintenance bulanan aktif.'
  },
  {
    question: 'Apa itu GEO (Generative Engine Optimization) dan apakah sudah termasuk?',
    answer: 'GEO (Generative Engine Optimization) adalah optimasi konten supaya bisnismu dikutip dan direkomendasikan AI seperti ChatGPT, Google Gemini, dan Perplexity — bukan cuma ranking di Google. GEO sudah bundled di paket Landing Page: paket Pro dapat GEO starter (llms.txt + struktur Q&A citable + schema FAQ/Article), dan paket Max dapat GEO lengkap (structured data penuh, akses AI crawler seperti GPTBot/ClaudeBot/PerplexityBot/Google-Extended, konten citable, dan E-E-A-T signal). Semua paket, termasuk Starter, sudah dapat fondasi JSON-LD-nya.'
  },
  {
    question: 'Apa bedanya SEO dan GEO?',
    answer: 'SEO (Search Engine Optimization) bikin halamanmu ranking tinggi di hasil pencarian Google supaya orang klik. GEO (Generative Engine Optimization) bikin kontenmu dikutip langsung di dalam jawaban AI seperti ChatGPT, Gemini, dan Perplexity — sering tanpa klik sama sekali. Keduanya saling melengkapi, dan Palu Dev House sudah bundling keduanya di setiap paket Landing Page.',
  },
  {
    question: 'Bagaimana sistem pembayarannya?',
    answer: 'Kami fleksibel: 50% DP + 50% saat launch, atau 30/40/30 untuk proyek besar, atau lunas di depan kalau kamu mau — bayar penuh di awal dapat potongan. Transfer bisa via BCA atau QRIS. Invoice resmi akan dikirim via email/WhatsApp sebelum kerja dimulai.'
  },
  {
    question: 'Ada garansi kalau ada bug atau masalah setelah launch?',
    answer: 'Ya. Semua paket dapat 30 hari gratis bug-fix setelah launch. Untuk Web App yang ada maintenance bulanan, bug-fix + minor update selalu included selama kontrak aktif.',
  },
  {
    question: 'Kalau mau revisi setelah launch gimana?',
    answer: 'Revisi minor tetap di-handle gratis selama masa garansi 30 hari. Setelah itu, revisi jadi pekerjaan berbayar per permintaan — atau bisa di-bundle dalam paket maintenance bulanan supaya lebih tenang. Kami kasih estimasi dulu sebelum ngerjain, jadi tidak ada kejutan.'
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
    answer: 'Bisa. Banyak klien mulai dari Landing Page dulu untuk establish online presence, lalu upgrade ke Web App saat bisnis tumbuh. Biaya upgrade dihitung dari selisih scope-nya, bukan dari nol lagi — plus migration fee yang wajar. Kerja yang sudah dibayar tidak hangus.'
  },
];
