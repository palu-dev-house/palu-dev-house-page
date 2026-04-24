import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { PricingTable } from '@/components/ui/PricingTable';
import { ButtonLink } from '@/components/ui/Button';
import {
  cityPages,
  getCityPageBySlug,
  getAllCityPageSlugs,
  type CityPage,
} from '@/lib/cityPages';
import { landingPackage, webappPackage } from '@/lib/pricing';
import {
  buildMeta,
  faqJsonLd,
  localBusinessJsonLd,
  breadcrumbJsonLd,
  SITE_URL,
} from '@/lib/seo';

const WHATSAPP_NUMBER = '628000000000';

interface Props {
  page: CityPage;
  otherCities: CityPage[];
}

export default function CityServicePage({ page, otherCities }: Props) {
  const meta = buildMeta({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: page.keywords,
  });

  // Pick the relevant package tiers to showcase based on serviceFocus
  const tiers =
    page.serviceFocus === 'aplikasi'
      ? webappPackage.tiers
      : page.serviceFocus === 'sistem'
        ? webappPackage.tiers.filter((t) => t.id === 'webapp-enterprise')
        : landingPackage.tiers;

  const jsonLd = [
    localBusinessJsonLd(),
    faqJsonLd(page.faqs),
    breadcrumbJsonLd([
      { name: 'Beranda', url: SITE_URL },
      { name: page.title, url: `${SITE_URL}/${page.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title,
      description: page.description,
      provider: { '@id': `${SITE_URL}#business` },
      areaServed: {
        '@type': 'City',
        name: page.city,
        ...(page.region
          ? {
              containedInPlace: {
                '@type': 'AdministrativeArea',
                name: page.region,
              },
            }
          : {}),
      },
      offers: tiers.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        price: String(t.priceNumeric),
        priceCurrency: 'IDR',
        url: `${SITE_URL}/harga`,
      })),
    },
  ];

  const whatsappText = encodeURIComponent(
    `Halo Palu Dev House, saya tertarik ${page.title.toLowerCase()}. Mau konsultasi.`
  );

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:locale" content="id_ID" />
        <meta name="geo.region" content="ID" />
        <meta name="geo.placename" content={page.city} />
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
        {/* Hero */}
        <section className="py-section-sm md:py-section">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted">
                {page.kicker}
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-tight">
                {page.h1}
              </h1>
              <p className="mt-6 text-lg text-ink-muted">{page.intro}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonLink href="/#rekomendasi" size="lg">
                  Ikuti Quiz Rekomendasi
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                >
                  Chat WhatsApp
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>

        {/* Highlights */}
        <section className="py-section-sm bg-surface-muted">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h2 className="text-3xl font-semibold text-ink">
                Kenapa Pilih {page.city} Dev House
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {page.highlights.map((h) => (
                <div
                  key={h.title}
                  className="rounded-xl border border-line bg-surface p-6"
                >
                  <h3 className="text-lg font-semibold text-ink">{h.title}</h3>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{h.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Local pitch */}
        <section className="py-section-sm">
          <Container>
            <div className="max-w-prose mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-ink text-center">
                Khusus untuk Bisnis di {page.city}
              </h2>
              <ul className="mt-8 space-y-3">
                {page.localPitch.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-ink-muted leading-relaxed"
                  >
                    <svg
                      className="h-5 w-5 mt-0.5 text-brand flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Pricing snapshot */}
        <section className="py-section-sm bg-surface-muted">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-ink">
                {page.serviceFocus === 'aplikasi'
                  ? 'Paket Aplikasi (Web App)'
                  : 'Paket Landing Page'}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Harga transparan — semua include technical SEO atau hosting server Indonesia.
              </p>
            </div>
            <div
              className={`mt-8 grid gap-6 ${
                tiers.length === 4
                  ? 'md:grid-cols-2 lg:grid-cols-4'
                  : 'md:grid-cols-3'
              }`}
            >
              {tiers.map((tier, i) => (
                <PricingTable key={tier.id} tier={tier} index={i} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/harga"
                className="text-sm text-brand hover:underline"
              >
                Lihat harga lengkap + add-ons →
              </Link>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-section-sm">
          <Container>
            <div className="max-w-prose mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-ink text-center">
                FAQ — {page.city}
              </h2>
              <div className="mt-8 space-y-4">
                {page.faqs.map((f) => (
                  <details
                    key={f.question}
                    className="rounded-xl border border-line bg-surface p-5"
                  >
                    <summary className="font-semibold text-ink cursor-pointer list-none flex items-center justify-between">
                      <span>{f.question}</span>
                      <span className="text-ink-muted text-xl" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Related cities + final CTA */}
        <section className="py-section-sm bg-surface-muted">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h2 className="text-2xl font-semibold text-ink">
                Lokasi & Layanan Lain
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="block rounded-xl border border-line bg-surface p-5 hover:border-brand transition-colors text-left"
                  >
                    <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                      {c.city}
                    </div>
                    <div className="mt-2 font-semibold text-ink">{c.title}</div>
                  </Link>
                ))}
              </div>

              <div className="mt-10">
                <ButtonLink href="/#kontak" size="lg">
                  Konsultasi Gratis →
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllCityPageSlugs().map((slug) => ({ params: { cityService: slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.cityService as string;
  const page = getCityPageBySlug(slug);
  if (!page) return { notFound: true };
  const otherCities = cityPages.filter((c) => c.slug !== page.slug);
  return { props: { page, otherCities } };
};
