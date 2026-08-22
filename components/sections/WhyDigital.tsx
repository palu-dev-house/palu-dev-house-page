import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';

const outcomes = [
  {
    title: 'Tambah Volume Transaksi',
    body: 'Kasir digital + online ordering bisa tambah transaksi hingga 40%. Pelanggan order tanpa antri, pembayaran tercatat otomatis, kamu fokus ke operasional.',
  },
  {
    title: 'Jangkau Pelanggan Baru',
    body: 'Website yang muncul di Google = pelanggan nyari kamu duluan. 70%+ pelanggan cek bisnis di Google sebelum datang — kalau kamu ga ada, kompetitor yang dapat.',
  },
  {
    title: 'Hemat Waktu & Biaya',
    body: 'Laporan otomatis, stok terupdate real-time, satu dashboard untuk semua outlet. Tutup toko dari 2 jam jadi 15 menit.',
  },
  {
    title: 'Data Pelanggan Jadi Aset',
    body: 'Catat pelanggan, kasih promo berdasarkan histori order. Bisnis bukan cuma jualan — tapi bangun komunitas yang balik terus.',
  },
];

/**
 * The broadest argument on the page, so it gets the most editorial treatment of
 * the three: a masthead where the heading and its lead sit on one line rather
 * than stacked and centred, then the four outcomes as rule-topped columns with
 * no card chrome at all. Cards would flatten these into the same object as the
 * GEO checklist and the services grid further down; a hairline rule and larger
 * type read as a magazine spread and let the argument breathe.
 */
export function WhyDigital() {
  return (
    <MotionSection id="kenapa-digital" className="bg-surface-muted py-section-sm md:py-section">
      <Container>
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:col-span-7 lg:text-[2.6rem]">
            Kenapa Bisnis Butuh Aplikasi atau Website?
          </h2>
          <p className="text-base text-ink-muted sm:text-lg lg:col-span-5 lg:pb-1 lg:text-right">
            Bukan soal teknologi — soal hasil bisnis yang konkret.
          </p>
        </div>

        <div className="mt-10 grid gap-x-14 gap-y-9 sm:grid-cols-2 lg:mt-14 lg:gap-y-12">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border-t-2 border-line-strong pt-5"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {o.title}
              </h3>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-ink-muted">{o.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
