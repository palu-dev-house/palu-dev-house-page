import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { founders } from '@/lib/founders';
import { buildMeta, breadcrumbJsonLd, SITE_URL } from '@/lib/seo';

function foundersJsonLd() {
  return founders.map((f) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: f.name,
    jobTitle: f.role,
    description: f.bio,
    worksFor: { '@id': `${SITE_URL}#business` },
  }));
}

export default function TentangPage() {
  const meta = buildMeta({
    title: 'Tentang Kami — Founder Palu Dev House',
    description:
      'Kenalan dengan founder Palu Dev House: Stiven Suhendra dan Ferdy Lim. Software house dari Medan & Palu yang membangun web, aplikasi POS, ERP, dan sistem custom untuk UMKM di seluruh Indonesia.',
    path: '/tentang',
  });

  const jsonLd = [
    ...foundersJsonLd(),
    breadcrumbJsonLd([
      { name: 'Beranda', url: SITE_URL },
      { name: 'Tentang', url: `${SITE_URL}/tentang` },
    ]),
  ];

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
        {jsonLd.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </Head>
      <Header />
      <main>
        <section className="py-section-sm md:py-section">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                Tentang Palu Dev House
              </h1>
              <p className="mt-4 text-ink-muted">
                Software house dari Medan & Palu. Kami membangun web, aplikasi POS, ERP, dan
                sistem custom yang benar-benar dipakai bisnis setiap hari — bukan sekadar live
                lalu ditinggal.
              </p>
            </div>

            <div className="mt-16 max-w-prose mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-ink">Founder</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Dua orang di balik setiap project yang kami kerjakan.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {founders.map((f) => (
                <div key={f.name} className="rounded-xl border border-line bg-surface p-6 flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-semibold">
                      {f.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{f.name}</div>
                      <div className="text-sm text-ink-muted">{f.role}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-ink-muted flex-1">{f.bio}</p>
                </div>
              ))}
            </div>

            <div className="mt-section-sm text-center">
              <Link
                href="/#kontak"
                className="inline-flex items-center rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-brand/90"
              >
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
