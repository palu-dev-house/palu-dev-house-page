import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { WhyDigital } from '@/components/sections/WhyDigital';
import { WhyUs } from '@/components/sections/WhyUs';
import { Services } from '@/components/sections/Services';
import { Recommendation } from '@/components/sections/Recommendation';
import { Portfolio } from '@/components/sections/Portfolio';
import { Pricing } from '@/components/sections/Pricing';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { buildMeta, localBusinessJsonLd, webSiteJsonLd, faqJsonLd } from '@/lib/seo';
import { faqItems } from '@/lib/faq';

export default function Home() {
  const meta = buildMeta({
    title: 'Jasa Buat Web & Aplikasi — Medan, Palu, Indonesia',
    description:
      'Jasa buat web & jasa buat aplikasi Medan, Palu, seluruh Indonesia. Landing page mulai Rp 150rb (technical SEO bundled), aplikasi POS kasir, ERP, booking, dan jasa buat sistem custom mulai Rp 800rb. Hosting server Indonesia tersedia.',
    path: '/',
  });

  const jsonLd = [localBusinessJsonLd(), webSiteJsonLd(), faqJsonLd(faqItems)];

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
        <meta property="og:site_name" content="Palu Dev House" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.ogImage} />
        <meta name="geo.region" content="ID" />
        <meta name="geo.placename" content="Medan, Palu" />
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
        <Hero />
        <WhyDigital />
        <WhyUs />
        <Services />
        <Recommendation />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
