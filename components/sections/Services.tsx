import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { ButtonLink } from '../ui/Button';

const services = [
  {
    title: 'Landing Page',
    subtitle: 'Landing page + technical SEO & GEO sekali bayar',
    bullets: ['Build sekali bayar', 'Mobile-first responsive', 'SEO + GEO on-page + schema', 'Dikutip ChatGPT, Gemini & Perplexity'],
    href: '#paket',
  },
  {
    title: 'Web Application',
    subtitle: 'POS / ERP / Booking / Tuition',
    bullets: ['Build + maintenance bulanan', 'Estimasi build 1 bulan penuh', 'Proven di tokoninja & tuition-app', 'Hosting server Indonesia'],
    href: '#paket',
  },
  {
    title: 'Edukasi & Artikel',
    subtitle: 'Panduan memilih aplikasi & hosting',
    bullets: ['Panduan ERP/POS', 'Cara pilih server & hosting', 'Static vs dynamic web', 'Semuanya gratis'],
    href: '/artikel',
  },
];

function Check() {
  return (
    <svg
      className="h-4 w-4 mt-0.5 text-brand flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Layout note: this is a stacked list, not a card grid, so it reads differently
 * from Portfolio's mosaic and the package cards further down the page. The
 * heading sits in its own column on the left rather than centred over the
 * content, which breaks the centre-aligned rhythm the page otherwise falls
 * into, and each row gets the full width to lay the offer out side by side.
 */
export function Services() {
  return (
    <MotionSection id="layanan" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Layanan Kami
            </h2>
            <p className="mt-4 text-ink-muted">
              Tiga paket yang cover kebutuhan digital bisnis dari awal sampai skala.
            </p>
            <div aria-hidden="true" className="mt-8 hidden h-px w-14 bg-brand lg:block" />
          </div>

          <div className="grid min-w-0 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-lg border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-brand-400 hover:shadow-md md:p-7"
              >
                <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="font-display text-xs font-semibold tabular-nums text-brand"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-ink">{s.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{s.subtitle}</p>
                    <ButtonLink href={s.href} variant="secondary" size="sm" className="mt-5">
                      Lihat detail →
                    </ButtonLink>
                  </div>

                  <ul className="min-w-0 space-y-2.5 md:border-l md:border-line md:pl-8">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink-muted">
                        <Check />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
