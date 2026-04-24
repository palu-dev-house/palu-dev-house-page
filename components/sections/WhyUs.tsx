import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
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

export function WhyUs() {
  return (
    <MotionSection id="mengapa-kami" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Mengapa Palu Dev House
          </h2>
          <p className="mt-4 text-ink-muted">
            Tiga hal yang bikin kami beda dari freelance atau jasa biasa.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-l-2 border-brand pl-6"
            >
              <h3 className="text-xl font-semibold text-ink">{r.title}</h3>
              <p className="mt-3 text-ink-muted leading-relaxed">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
