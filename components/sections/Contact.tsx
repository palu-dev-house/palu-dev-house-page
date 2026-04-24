import { useState, type FormEvent } from 'react';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';

const WHATSAPP_NUMBER = '628000000000';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <MotionSection id="kontak" className="py-section-sm md:py-section">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Siap Naik Kelas?
            </h2>
            <p className="mt-4 text-ink-muted">
              Chat WhatsApp untuk respon cepat, atau isi form untuk dapat quote lengkap via email.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Palu Dev House, saya mau konsultasi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Chat WhatsApp
              </ButtonLink>
            </div>
            <div className="mt-12 space-y-4 text-sm text-ink-muted">
              <div>
                <div className="font-semibold text-ink">Lokasi</div>
                <div>Medan, Sumatera Utara</div>
                <div>Palu, Sulawesi Tengah</div>
              </div>
              <div>
                <div className="font-semibold text-ink">Jam Operasional</div>
                <div>Senin – Jumat, 09:00 – 18:00 WIB</div>
                <div>Sabtu, 10:00 – 15:00 WIB (by appointment)</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-surface p-6 md:p-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">Nama</label>
              <input id="name" name="name" required className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-ink">WhatsApp / HP</label>
              <input id="phone" name="phone" className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-ink">Paket yang diminati</label>
              <select id="interest" name="interest" className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>Landing Page</option>
                <option>Web Application</option>
                <option>SEO Service</option>
                <option>Belum yakin — minta saran</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink">Cerita bisnismu</label>
              <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <Button type="submit" disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? 'Mengirim...' : 'Kirim'}
            </Button>
            {status === 'sent' && <p className="text-sm text-green-600">Terkirim — kami akan hubungi kamu dalam 1x24 jam.</p>}
            {status === 'error' && <p className="text-sm text-red-600">Gagal kirim. Coba lagi atau chat via WhatsApp.</p>}
          </form>
        </div>
      </Container>
    </MotionSection>
  );
}
