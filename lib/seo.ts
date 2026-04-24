export const SITE_URL = 'https://paludevhouse.site';
export const SITE_NAME = 'Palu Dev House';
export const DEFAULT_DESCRIPTION =
  'Software house untuk UMKM & bisnis Indonesia. Jasa pembuatan landing page (dengan technical SEO), aplikasi kasir (POS), ERP, dan booking. Minimalis, profesional, hasil yang naikin transaksi.';

export interface MetaInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export interface MetaOutput {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
}

export function buildMeta({ title, description, path = '/', ogImage }: MetaInput = {}): MetaOutput {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Jasa Pembuatan Website & Aplikasi`;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title: fullTitle,
    description: description ?? DEFAULT_DESCRIPTION,
    canonical,
    ogImage: `${SITE_URL}${ogImage ?? '/og-image.svg'}`,
    ogTitle: title ?? SITE_NAME,
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#business`,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.svg`,
    areaServed: [
      { '@type': 'City', name: 'Palu' },
      { '@type': 'City', name: 'Medan' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    address: [
      { '@type': 'PostalAddress', addressLocality: 'Palu', addressRegion: 'Sulawesi Tengah', addressCountry: 'ID' },
      { '@type': 'PostalAddress', addressLocality: 'Medan', addressRegion: 'Sumatera Utara', addressCountry: 'ID' },
    ],
    priceRange: 'Rp 150.000 – Rp 3.500.000+',
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
