import { Header } from '@/components/layout/Header';
import { SeoHead } from '@/components/layout/SeoHead';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { WhyDigital } from '@/components/sections/WhyDigital';
import { GEO } from '@/components/sections/GEO';
import { WhyUs } from '@/components/sections/WhyUs';
import { Services } from '@/components/sections/Services';
import { Recommendation } from '@/components/sections/Recommendation';
import { Portfolio } from '@/components/sections/Portfolio';
import { Packages } from '@/components/sections/Packages';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { buildMeta, localBusinessJsonLd, webSiteJsonLd, faqJsonLd, geoServiceJsonLd } from '@/lib/seo';
import { faqItems } from '@/lib/faq';

export default function Home() {
  const meta = buildMeta({
    title: 'Jasa Buat Web & Aplikasi (SEO + GEO) — Medan, Palu, Indonesia',
    description:
      'Jasa buat web & jasa buat aplikasi Medan, Palu, seluruh Indonesia. Landing page dengan technical SEO + GEO (Generative Engine Optimization) bawaan — dikutip ChatGPT, Gemini & Perplexity. Aplikasi POS kasir, ERP, booking dengan estimasi build 1 bulan penuh, plus jasa buat sistem custom. Domain dibeli terpisah, hosting server Indonesia tersedia. Konsultasi & estimasi gratis via WhatsApp.',
    path: '/',
  });

  const jsonLd = [localBusinessJsonLd(), webSiteJsonLd(), faqJsonLd(faqItems), geoServiceJsonLd()];

  return (
    <>
      <SeoHead
        meta={meta}
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        <Hero />
        <WhyDigital />
        <GEO />
        <WhyUs />
        <Services />
        <Recommendation />
        <Portfolio />
        <Packages />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
