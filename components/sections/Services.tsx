import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { ButtonLink } from '../ui/Button';

const services = [
  {
    title: 'Landing Page',
    subtitle: 'Landing page + technical SEO sekali bayar',
    bullets: ['Mulai Rp 150rb', 'Mobile-first responsive', 'SEO on-page + schema', 'Meta tags + sitemap siap'],
    href: '#harga',
  },
  {
    title: 'Web Application',
    subtitle: 'POS / ERP / Booking / Tuition',
    bullets: ['Mulai Rp 800rb + maintenance', 'Proven di tokoninja & tuition-app', 'Multi-outlet ready', 'Hosting server Indonesia'],
    href: '#harga',
  },
  {
    title: 'Edukasi & Artikel',
    subtitle: 'Panduan memilih aplikasi & hosting',
    bullets: ['Panduan ERP/POS', 'Cara pilih server & hosting', 'Static vs dynamic web', 'Semuanya gratis'],
    href: '/artikel',
  },
];

export function Services() {
  return (
    <MotionSection id="layanan" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Layanan Kami</h2>
          <p className="mt-4 text-ink-muted">Tiga paket yang cover kebutuhan digital bisnis dari awal sampai skala.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full flex flex-col">
                <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.subtitle}</p>
                <ul className="mt-6 space-y-2 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink-muted">
                      <svg className="h-4 w-4 mt-0.5 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={s.href} variant="secondary" size="sm" className="mt-6 self-start">
                  Lihat detail →
                </ButtonLink>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
