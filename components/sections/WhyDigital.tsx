import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
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

export function WhyDigital() {
  return (
    <MotionSection id="kenapa-digital" className="py-section-sm md:py-section bg-surface-muted">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Kenapa Bisnis Butuh Aplikasi atau Website?
          </h2>
          <p className="mt-4 text-ink-muted">
            Bukan soal teknologi — soal hasil bisnis yang konkret.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="h-full">
                <h3 className="text-lg font-semibold text-ink">{o.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{o.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </MotionSection>
  );
}
