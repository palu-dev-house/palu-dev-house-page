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
