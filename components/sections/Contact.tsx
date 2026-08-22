import { useState, type FormEvent } from 'react';
import { Container } from '../layout/Container';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';
import { WHATSAPP_NUMBER } from '@/lib/contact';


const fieldClass =
  'mt-1.5 w-full rounded-lg border border-line bg-surface-muted px-3.5 py-2.5 text-[15px] text-ink ' +
  'transition-colors hover:border-line-strong focus:border-brand-400 focus:bg-surface focus:outline-none ' +
  // No alpha modifier on ring-brand-400: the colour tokens are raw CSS vars, so
  // `ring-brand-400/50` compiles away and falls back to Tailwind's default blue.
  'focus:ring-2 focus:ring-brand-400';

const labelClass = 'block text-sm font-medium text-ink';

function Required() {
  return (
    <span className="text-brand" aria-hidden="true">
      {' '}
      *
    </span>
  );
}

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
    <MotionSection id="kontak" className="relative py-section-sm md:py-section">
      {/* Same glow that opens the page, closing it — the last screen should feel
          like an arrival, not the page running out. */}
      <div className="pointer-events-none absolute inset-0 bg-glow" aria-hidden="true" />
      <Container className="relative">
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-line bg-brand-50 p-6 dark:bg-brand-950 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                Siap Naik Kelas?
              </h2>
              <p className="mt-4 text-ink-muted">
                Chat WhatsApp untuk respon cepat, atau isi form untuk dapat quote lengkap via email.
              </p>
              <ButtonLink
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Palu Dev House, saya mau konsultasi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="mt-8 w-full sm:w-auto"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06s.89 2.39 1.01 2.56c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
                </svg>
                Chat WhatsApp
              </ButtonLink>

              <dl className="mt-10 space-y-6 border-t border-line pt-8 text-sm text-ink-muted">
                <div className="flex gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <dt className="font-semibold text-ink">Lokasi</dt>
                    <dd className="mt-1">Medan, Sumatera Utara</dd>
                    <dd>Palu, Sulawesi Tengah</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <div>
                    <dt className="font-semibold text-ink">Jam Operasional</dt>
                    <dd className="mt-1">Senin – Jumat, 09:00 – 18:00 WIB</dd>
                    <dd>Sabtu, 10:00 – 15:00 WIB (by appointment)</dd>
                  </div>
                </div>
              </dl>
            </div>

            <form
              onSubmit={handleSubmit}
              aria-busy={status === 'sending'}
              className="space-y-5 p-6 sm:p-8 lg:col-span-7 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nama
                    <Required />
                  </label>
                  <input id="name" name="name" required autoComplete="name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                    <Required />
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    WhatsApp / HP
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="interest" className={labelClass}>
                    Paket yang diminati
                  </label>
                  <div className="relative">
                    <select id="interest" name="interest" className={`${fieldClass} appearance-none pr-10`}>
                      <option>Landing Page</option>
                      <option>Web Application</option>
                      <option>Belum yakin — minta saran</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Cerita bisnismu
                </label>
                <textarea id="message" name="message" rows={5} className={`${fieldClass} resize-y`} />
              </div>

              {status === 'sent' && (
                <div
                  role="status"
                  className="flex gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="16 9 11 14.5 8 11.5" />
                  </svg>
                  <p>Terkirim — kami akan hubungi kamu dalam 1x24 jam.</p>
                </div>
              )}
              {status === 'error' && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  <p>Gagal kirim. Coba lagi atau chat via WhatsApp.</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={status === 'sending'}
                className="w-full sm:w-auto"
              >
                {status === 'sending' && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3a9 9 0 1 0 9 9" />
                  </svg>
                )}
                {status === 'sending' ? 'Mengirim...' : 'Kirim'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
