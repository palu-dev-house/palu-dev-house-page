import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { ButtonLink } from '../ui/Button';

export function Hero() {
  return (
    <section className="pt-section-sm pb-section-sm md:pt-section md:pb-section">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted"
          >
            Software house Medan · Palu · Indonesia
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-ink"
          >
            Jasa Buat Web &amp; Aplikasi yang Bikin
            <br />
            <span className="text-brand">Bisnismu Naik Kelas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-ink-muted max-w-xl mx-auto"
          >
            Jasa buat web, aplikasi, sistem, dan program custom untuk UMKM di Medan, Palu, dan seluruh Indonesia. Landing page mulai Rp 150rb, aplikasi POS/ERP/booking mulai Rp 800rb — hasil yang naikin transaksi dan jangkauan pelanggan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <ButtonLink href="#rekomendasi" size="lg">
              Cari Paket yang Cocok
            </ButtonLink>
            <ButtonLink href="#harga" variant="secondary" size="lg">
              Lihat Harga
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
