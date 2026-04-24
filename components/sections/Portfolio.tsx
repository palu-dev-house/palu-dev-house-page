import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { portfolioItems } from '@/lib/portfolio';

export function Portfolio() {
  return (
    <MotionSection id="portfolio" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Karya yang Sudah Live
          </h2>
          <p className="mt-4 text-ink-muted">
            Produk yang sudah kami build dan running di lapangan.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {portfolioItems.map((item, i) => (
            <motion.a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-xl border border-line bg-surface p-6 flex flex-col justify-between min-h-[140px] hover:border-brand transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-ink-muted">{item.category}</div>
                <div className="mt-2 font-semibold text-ink">{item.name}</div>
              </div>
              <div className="mt-4 text-xs text-brand font-medium">
                Buka live site →
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
