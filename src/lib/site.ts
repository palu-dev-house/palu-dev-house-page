export const site = {
  brand: "Palu Dev House",
  tagline: "Software house yang membangun produk digital untuk bisnis Anda.",
  description:
    "Kami membantu bisnis dan startup membangun produk SaaS, landing page, dan aplikasi custom/on-premise — dari ide hingga produksi.",
  whatsapp: "https://wa.me/6281234567890",
  whatsappLabel: "+62 812-3456-7890",
  email: "halo@paludevhouse.com",
  location: "Palu & Medan, Indonesia",
};

export const nav = [
  { href: "#layanan", label: "Layanan" },
  { href: "#proses", label: "Proses" },
  { href: "#portofolio", label: "Portofolio" },
  { href: "#tentang", label: "Tentang" },
  { href: "#kontak", label: "Kontak" },
];

export const services = [
  {
    title: "Produk SaaS",
    desc: "Bangun produk SaaS multi-tenant siap pakai — autentikasi, billing, dashboard analitik, dan integrasi pihak ketiga.",
    bullets: ["Arsitektur multi-tenant", "Auth & subscription billing", "Dashboard & laporan", "Deploy ke cloud"],
    badge: "Untuk founder & startup",
  },
  {
    title: "Landing Page",
    desc: "Landing page konversi tinggi yang cepat, SEO-friendly, dan terintegrasi dengan tools marketing Anda.",
    bullets: ["Desain custom", "Performa 95+ Lighthouse", "CMS / Headless siap pakai", "A/B testing ready"],
    badge: "Untuk peluncuran produk",
  },
  {
    title: "Custom & On-Premise App",
    desc: "Aplikasi bisnis sesuai kebutuhan — ERP, POS, internal tools — dengan opsi deploy on-premise atau cloud privat.",
    bullets: ["Diskusi kebutuhan mendalam", "Integrasi sistem internal", "Deploy on-prem / cloud privat", "Maintenance & training"],
    badge: "Untuk perusahaan & enterprise",
  },
];

export const process = [
  { step: "01", title: "Discovery", desc: "Kami pelajari bisnis, pengguna, dan tujuan Anda untuk menentukan ruang lingkup yang tepat." },
  { step: "02", title: "Design", desc: "Wireframe, prototype, dan UI yang divalidasi sebelum sebaris kode ditulis." },
  { step: "03", title: "Build", desc: "Tim engineer kami bangun dengan stack modern, code quality terjaga, deploy bertahap." },
  { step: "04", title: "Launch & Care", desc: "Go-live, monitoring, dan iterasi berkelanjutan agar produk terus berkembang." },
];

export const portfolio = [
  {
    title: "Toko Ninja",
    type: "Marketing Site",
    desc: "Landing page produk Toko Ninja — fokus konversi, cepat, dan SEO-friendly.",
    tag: "Landing Page",
    url: "https://tokoninja.com",
  },
  {
    title: "Toko Ninja ERP",
    type: "Multi-tenant SaaS",
    desc: "Sistem ERP cloud untuk Toko Ninja — manajemen inventory, pembelian, penjualan, dan keuangan.",
    tag: "SaaS Product",
    url: "https://erp.tokoninja.com",
  },
  {
    title: "Toko Ninja POS",
    type: "Multi-tenant SaaS",
    desc: "Aplikasi kasir berbasis web untuk Toko Ninja — transaksi cepat, sinkron multi-cabang.",
    tag: "SaaS Product",
    url: "https://pos.tokoninja.com",
  },
  {
    title: "Hinno",
    type: "Marketing Site",
    desc: "Landing page personal artist Hinno — portofolio karya dengan estetika visual yang kuat.",
    tag: "Landing Page",
    url: "https://hinno.art",
  },
  {
    title: "SkolFi",
    type: "Web App",
    desc: "Aplikasi manajemen pembayaran SPP / tuition fee untuk lembaga pendidikan.",
    tag: "Custom App",
    url: "https://tuition-app.up.railway.app",
  },
];

export const stack = [
  "Next.js", "React", "TypeScript", "Node.js", "Bun",
  "PostgreSQL", "Prisma", "tRPC", "Tailwind CSS",
  "Docker", "AWS", "Vercel", "Supabase", "Stripe",
];

export const founders = [
  { name: "Ferdy Lim", role: "Co-founder & CTO", img: "/images/ferdy.webp" },
  { name: "Stiven", role: "Co-founder & CEO", img: "/images/stiven.webp" },
];
