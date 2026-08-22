import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { Badge } from '../ui/Badge';
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

/** The three engines already named in the copy above — no new claims, just the picture. */
const engines = ['ChatGPT', 'Gemini', 'Perplexity'];

/**
 * GEO is the least familiar thing we sell, and a paragraph alone
 * leaves a visitor guessing what "dikutip AI" actually looks like. This draws
 * it: the three assistants, one bus, one answer — the studio's client. Built
 * from divs so it reflows at 360px without any SVG viewBox maths, and tinted
 * with `brand-light`, which flips with the theme so the panel stays readable in
 * dark mode.
 */
function CitationDiagram() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-brand-light p-5 shadow-md sm:p-8 lg:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {engines.map((engine) => (
            <div
              key={engine}
              className="truncate rounded-lg border border-line bg-surface px-2 py-2.5 text-center text-[11px] font-semibold text-ink shadow-sm sm:text-xs"
            >
              {engine}
            </div>
          ))}
        </div>

        {/* Connectors: a drop under each engine, a shared bus, one stem down.
            The bus is inset so it reads as drawn rather than as a page rule. */}
        <div aria-hidden="true" className="grid grid-cols-3 gap-2 sm:gap-3">
          {engines.map((engine) => (
            <div key={engine} className="mx-auto h-6 w-px bg-brand-300 sm:h-9" />
          ))}
        </div>
        <div aria-hidden="true" className="mx-5 h-px bg-brand-300 sm:mx-8" />
        <div aria-hidden="true" className="mx-auto h-6 w-px bg-brand-300 sm:h-9" />

        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-inset ring-white/15">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            Palu Dev House
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Three structures in one section, none of them the centred stack it used to
 * be: an asymmetric split that pairs the explanation with the diagram, then a
 * sidebar heading against the six technical items as `sunken` cards recessed
 * into the white band, with the article link ending the sidebar instead of
 * floating centred under everything.
 */
export function GEO() {
  return (
    <MotionSection id="geo" className="bg-surface py-section-sm md:py-section">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <Badge className="uppercase tracking-wide">Generative Engine Optimization</Badge>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl">
              Apa Itu GEO &amp; Kenapa Bisnismu Butuh?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              GEO (Generative Engine Optimization) bikin bisnismu dikutip AI seperti ChatGPT, Gemini,
              dan Perplexity — bukan cuma ranking di Google. Makin banyak orang nanya langsung ke AI
              sebelum beli. Kalau AI ga &quot;kenal&quot; bisnismu, kamu ilang dari percakapan itu.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <CitationDiagram />
          </motion.div>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Yang Kami Tingkatkan untuk GEO
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Tiap landing page yang kami bangun sekarang GEO-ready dari fondasi, bukan cuma
              SEO-ready.
            </p>
            <ButtonLink
              href="/artikel/apa-itu-generative-engine-optimization"
              variant="secondary"
              className="mt-6"
            >
              Pelajari GEO lebih lengkap →
            </ButtonLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {improvements.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card tone="sunken" className="h-full">
                  <span
                    aria-hidden="true"
                    className="font-display text-xs font-bold tabular-nums tracking-wide text-brand"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="mt-2 font-display text-base font-semibold text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
