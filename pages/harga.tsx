import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { PricingTable } from '@/components/ui/PricingTable';
import { allPackages, addOns, paymentOptions } from '@/lib/pricing';
import { buildMeta } from '@/lib/seo';

export default function HargaPage() {
  const meta = buildMeta({
    title: 'Harga Jasa Buat Web & Aplikasi — Medan, Palu, Indonesia',
    description:
      'Harga jasa buat web & jasa buat aplikasi Palu Dev House: Landing Page mulai Rp 150rb (technical SEO bundled), Web Application (POS/ERP/Booking) mulai Rp 4 juta dengan estimasi build 1 bulan penuh + hosting server Indonesia. Add-ons domain & hosting transparan.',
    path: '/harga',
  });

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
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
                Harga Lengkap
              </h1>
              <p className="mt-4 text-ink-muted">
                Semua paket, add-ons, dan opsi pembayaran di satu tempat. Transparan tanpa biaya tersembunyi.
              </p>
            </div>

            {allPackages.map((pkg) => (
              <div key={pkg.category} className="mt-16">
                <div className="max-w-prose mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-semibold text-ink">{pkg.title}</h2>
                  <p className="mt-2 text-sm text-ink-muted">{pkg.subtitle}</p>
                </div>
                <div className={`mt-8 grid gap-6 ${pkg.tiers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
                  {pkg.tiers.map((tier, i) => (
                    <PricingTable key={tier.id} tier={tier} index={i} />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-section-sm max-w-prose mx-auto">
              <h2 className="text-2xl font-semibold text-ink">Add-ons</h2>
              <div className="mt-6 divide-y divide-line border-t border-b border-line">
                {addOns.map((a) => (
                  <div key={a.label} className="flex items-center justify-between py-4">
                    <span className="text-ink">{a.label}</span>
                    <span className="font-semibold text-ink">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-section-sm max-w-prose mx-auto">
              <h2 className="text-2xl font-semibold text-ink">Opsi Pembayaran</h2>
              <p className="mt-2 text-sm text-ink-muted">Transfer BCA atau QRIS. Invoice resmi via email/WhatsApp.</p>
              <div className="mt-6 space-y-4">
                {paymentOptions.map((p) => (
                  <div key={p.label} className="rounded-xl border border-line bg-surface p-5">
                    <div className="font-semibold text-ink">{p.label}</div>
                    <div className="mt-1 text-sm text-ink-muted">{p.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-section-sm text-center">
              <Link href="/#kontak" className="inline-flex items-center rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-brand/90">
                Konsultasi Gratis →
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
