import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';

const reasons = [
  {
    title: 'Hasil Transaksi Nyata',
    body: 'Fokus ke metrik bisnis — bukan showcase teknis. Setiap fitur yang kami bangun punya tujuan konkret: tambah penjualan atau hemat waktu operasional.',
  },
  {
    title: 'Desain Minimalis, Modern',
    body: 'Ga ribet, ga lebay. Tampilan profesional yang bikin calon pelanggan percaya sejak detik pertama buka website kamu.',
  },
  {
    title: 'Technical SEO Sejak Hari Pertama',
    body: 'Setiap landing page include technical SEO — meta tags, schema, sitemap, Core Web Vitals tuning. Bukan sekedar online, tapi siap ditemukan di Google.',
  },
];

/**
 * The credibility section, so it is deliberately the quietest of the three: no
 * grid, no reveal-per-card choreography competing with the argument above it.
 * The heading holds a sidebar and the three claims sit in a single raised slab
 * as label/value rows — a spec sheet rather than three floating adjectives.
 * `raised` because the band is muted; a `sunken` card would disappear into it.
 */
export function WhyUs() {
  return (
    <MotionSection
      id="mengapa-kami"
      className="border-b border-line bg-surface-muted py-section-sm md:py-section"
    >
      <Container>
        <div className="max-w-prose">
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl">
            Mengapa Palu Dev House
          </h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            Tiga hal yang bikin kami beda dari freelance atau jasa biasa.
          </p>
        </div>

        <Card tone="raised" hoverable={false} className="mt-8 divide-y divide-line md:mt-10">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="grid gap-2 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-10 sm:py-6"
            >
              <h3 className="flex items-start gap-2.5 font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                />
                {r.title}
              </h3>
              <p className="leading-relaxed text-ink-muted">{r.body}</p>
            </motion.div>
          ))}
        </Card>
      </Container>
    </MotionSection>
  );
}
