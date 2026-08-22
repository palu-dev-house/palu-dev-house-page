import Head from 'next/head';
import type { MetaOutput } from '@/lib/seo';
import { OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/seo';

interface SeoHeadProps {
  meta: MetaOutput;
  /** Articles set "article"; everything else is a plain page. */
  ogType?: 'website' | 'article';
  /** JSON-LD blocks for this page, already shaped. */
  jsonLd?: unknown[];
  /** Anything page-specific: article:published_time, noindex, and so on. */
  children?: React.ReactNode;
}

/**
 * One place that emits the social/SEO head tags.
 *
 * They were previously copy-pasted per page and had drifted: the homepage
 * carried the full set while /tentang, /artikel and the city pages emitted
 * only four OG tags — no `og:type`, no Twitter card at all. A page shared on
 * WhatsApp or X previewed worse purely because of which file it lived in.
 *
 * og:image:width/height matter more than they look: without them a scraper
 * must fetch and measure the image before it can decide on a large card, and
 * several — WhatsApp among them — will fall back to a small thumbnail or none
 * rather than wait.
 */
export function SeoHead({
  meta,
  ogType = 'website',
  jsonLd = [],
  children,
}: SeoHeadProps) {
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:site_name" content="Palu Dev House" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />

      <meta name="geo.region" content="ID" />
      <meta name="geo.placename" content="Medan, Palu" />

      {children}

      {jsonLd.map((obj, i) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable list
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </Head>
  );
}
