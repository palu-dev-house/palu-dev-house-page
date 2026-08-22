export const SITE_URL = 'https://paludevhouse.site';
export const SITE_NAME = 'Palu Dev House';

export const DEFAULT_DESCRIPTION =
  'Jasa buat web & jasa buat aplikasi di Medan, Palu, dan seluruh Indonesia. Spesialis landing page, aplikasi kasir (POS), ERP, booking, dan sistem custom untuk UMKM. Technical SEO + GEO (Generative Engine Optimization) bundled — dikutip ChatGPT, Gemini & Perplexity. Hosting server Indonesia tersedia.';

/**
 * Resmi/social profiles for entity clarity & sameAs — a core GEO signal.
 * AI engines use these to confirm we're a real, single entity.
 *
 * Only list profiles that actually resolve. A sameAs entry pointing at a 404
 * weakens the very signal it exists to strengthen — the LinkedIn company page
 * listed here previously did exactly that. Verify a profile answers 200
 * before adding it.
 */
/**
 * The social preview card.
 *
 * PNG, not SVG. WhatsApp, Facebook, Instagram, LinkedIn, X and Slack all
 * refuse SVG for og:image and render no thumbnail at all — the site shipped
 * an SVG here, so every link ever shared appeared as bare text. WhatsApp is
 * how Indonesian clients actually pass links around, which made this the
 * most expensive four characters on the site.
 *
 * 1200x630 is the size the large-card layouts expect; declaring the
 * dimensions in the markup lets a scraper commit to a large card without
 * fetching and measuring the file first.
 */
export const OG_IMAGE = '/og-image.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
  'Palu Dev House — Website & Aplikasi untuk Bisnis';

export const SOCIAL_PROFILES = [
  'https://www.instagram.com/paludevhouse',
  'https://github.com/palu-dev-house',
];

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
  'generative engine optimization',
  'jasa GEO',
  'GEO Indonesia',
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
    ogImage: `${SITE_URL}${ogImage ?? OG_IMAGE}`,
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
    image: `${SITE_URL}${OG_IMAGE}`,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: SOCIAL_PROFILES,
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
      'Generative Engine Optimization',
      'GEO',
    ],
    // Catalogue of what we do, with no figures attached — the offer is real,
    // the number is quoted per project over WhatsApp.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Layanan Palu Dev House',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa Buat Landing Page (Technical SEO + GEO Bundled)',
            areaServed: 'Indonesia',
            serviceType: 'Web Development',
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
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Jasa Buat Sistem & Program Custom',
            areaServed: 'Indonesia',
            serviceType: 'Custom Software Development',
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

/**
 * Dedicated Service schema for GEO — gives AI engines a clean, citable entity
 * for "Generative Engine Optimization" tied to our brand and service area.
 *
 * No price, deliberately. Structured data outlives the page it sits on: a
 * `priceSpecification` here would keep Google and the answer engines quoting a
 * figure the site itself no longer shows.
 */
export function geoServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}#geo-service`,
    name: 'Generative Engine Optimization (GEO)',
    alternateName: ['GEO', 'Optimasi AI Search', 'AI Search Optimization'],
    serviceType: 'Generative Engine Optimization',
    description:
      'Optimasi konten website supaya dikutip dan direkomendasikan AI answer engine seperti ChatGPT, Google Gemini/AI Overviews, Perplexity, dan Microsoft Copilot — lewat structured data, konten citable, llms.txt, entity clarity, dan akses AI crawler. Bundled di paket Landing Page Palu Dev House.',
    provider: { '@id': `${SITE_URL}#business` },
    areaServed: [
      { '@type': 'City', name: 'Palu' },
      { '@type': 'City', name: 'Medan' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#kontak`,
    },
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
