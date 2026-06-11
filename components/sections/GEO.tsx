import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { ButtonLink } from '../ui/Button';

const improvements = [
  {
    title: 'Structured data lengkap',
    body: 'JSON-LD Organization, LocalBusiness, FAQPage, Article, Service & Offer — biar AI ngerti persis siapa bisnismu, di mana, dan jualan apa.',
  },
  {
    title: 'Konten format citable',
    body: 'Definisi jelas, blok tanya-jawab, dan statistik yang gampang dikutip ChatGPT, Gemini & Perplexity.',
  },
  {
    title: 'llms.txt + akses AI crawler',
    body: 'File llms.txt dan robots.txt yang ngizinin GPTBot, ClaudeBot, PerplexityBot, dan Google-Extended baca kontenmu.',
  },
  {
    title: 'Entity clarity & sameAs',
    body: 'Nama brand konsisten plus link ke profil resmi (sosial media, Google Business) biar AI ga salah orang.',
  },
  {
    title: 'Conversational query targeting',
    body: 'Heading yang jawab persis pertanyaan natural orang ke AI — bukan cuma kata kunci kaku gaya SEO lama.',
  },
  {
    title: 'E-E-A-T + Core Web Vitals',
    body: 'Sinyal pengalaman & otoritas plus halaman cepat — dipercaya mesin, enak buat manusia.',
  },
];

export function GEO() {
  return (
    <MotionSection id="geo" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <div className="text-xs font-semibold text-brand uppercase tracking-wide">
            Generative Engine Optimization
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Apa Itu GEO & Kenapa Bisnismu Butuh?
          </h2>
          <p className="mt-4 text-ink-muted">
            GEO (Generative Engine Optimization) bikin bisnismu dikutip AI seperti ChatGPT, Gemini,
            dan Perplexity — bukan cuma ranking di Google. Makin banyak orang nanya langsung ke AI
            sebelum beli. Kalau AI ga "kenal" bisnismu, kamu ilang dari percakapan itu.
          </p>
        </div>

        <div className="mt-12">
          <div className="max-w-prose mx-auto text-center">
            <h3 className="text-xl font-semibold text-ink">Yang Kami Tingkatkan untuk GEO</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Tiap landing page yang kami bangun sekarang GEO-ready dari fondasi, bukan cuma
              SEO-ready.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {improvements.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="h-full">
                  <h4 className="text-base font-semibold text-ink">{item.title}</h4>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <ButtonLink href="/artikel/apa-itu-generative-engine-optimization" variant="secondary">
            Pelajari GEO lebih lengkap →
          </ButtonLink>
        </div>
      </Container>
    </MotionSection>
  );
}
