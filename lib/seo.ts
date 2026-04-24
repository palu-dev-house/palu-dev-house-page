export const SITE_URL = 'https://paludevhouse.site';
export const SITE_NAME = 'Palu Dev House';

export const DEFAULT_DESCRIPTION =
  'Jasa buat web & jasa buat aplikasi di Medan, Palu, dan seluruh Indonesia. Spesialis landing page, aplikasi kasir (POS), ERP, booking, dan sistem custom untuk UMKM. Technical SEO bundled, hosting server Indonesia tersedia.';

/**
 * Primary Indonesian keyword set we rank for — used as comma-separated meta
 * and sprinkled through copy/H1/H2/FAQ. Keep this list tight — more isn't
 * better; Google weights content relevance, not keyword density.
 */
export const PRIMARY_KEYWORDS = [
  'jasa buat web',
  'jasa buat aplikasi',
  'jasa buat web medan',
  'jasa buat aplikasi medan',
  'jasa buat web palu',
  'jasa buat aplikasi palu',
  'jasa buat web indonesia',
  'jasa buat aplikasi indonesia',
  'jasa buat sistem',
  'jasa buat program',
  'jasa pembuatan website',
  'software house medan',
  'software house palu',
  'jasa POS kasir',
  'jasa ERP UMKM',
];

export interface MetaInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface MetaOutput {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
  keywords: string;
}

export function buildMeta({
  title,
  description,
  path = '/',
  ogImage,
  keywords,
}: MetaInput = {}): MetaOutput {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Jasa Buat Web & Aplikasi (Medan, Palu, Indonesia)`;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const kw = (keywords ?? PRIMARY_KEYWORDS).join(', ');
  return {
    title: fullTitle,
    description: description ?? DEFAULT_DESCRIPTION,
    canonical,
    ogImage: `${SITE_URL}${ogImage ?? '/og-image.svg'}`,
    ogTitle: title ?? SITE_NAME,
    keywords: kw,
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}#business`,
    name: SITE_NAME,
    alternateName: ['Palu Dev House', 'PDH', 'Software House Palu Medan'],
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.svg`,
    logo: `${SITE_URL}/logo.svg`,
    areaServed: [
      { '@type': 'City', name: 'Palu' },
      { '@type': 'City', name: 'Medan' },
      { '@type': 'AdministrativeArea', name: 'Sulawesi Tengah' },
      { '@type': 'AdministrativeArea', name: 'Sumatera Utara' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Palu',
        addressRegion: 'Sulawesi Tengah',
        addressCountry: 'ID',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Medan',
        addressRegion: 'Sumatera Utara',
        addressCountry: 'ID',
      },
    ],
    priceRange: 'Rp 150.000 – Rp 3.500.000+',
    knowsAbout: [
      'Jasa Buat Web',
      'Jasa Buat Aplikasi',
      'Jasa Buat Sistem',
      'Jasa Buat Program',
      'Landing Page',
      'Web Application',
      'POS Kasir',
      'ERP',
      'Technical SEO',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Palu Dev House',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa Buat Landing Page (Technical SEO Bundled)',
            areaServed: 'Indonesia',
            serviceType: 'Web Development',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'IDR',
            price: '150000',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa Buat Aplikasi Web (POS, ERP, Booking)',
            areaServed: 'Indonesia',
            serviceType: 'Application Development',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'IDR',
            price: '800000',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa Buat Sistem & Program Custom',
            areaServed: 'Indonesia',
            serviceType: 'Custom Software Development',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'IDR',
            price: '3500000',
          },
        },
      ],
    },
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}#business` },
    inLanguage: 'id-ID',
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

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
