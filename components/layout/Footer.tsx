import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from './Container';
import { portfolioItems } from '@/lib/portfolio';

const serviceLinks = [
  { href: '/#layanan', label: 'Landing Page' },
  { href: '/#layanan', label: 'Web Application' },
  { href: '/artikel', label: 'Artikel & Edukasi' },
  { href: '/#paket', label: 'Isi Paket' },
  { href: '/tentang', label: 'Tentang Kami' },
];

const locationLinks = [
  { href: '/jasa-buat-web-medan', label: 'Jasa Buat Web Medan' },
  { href: '/jasa-buat-aplikasi-medan', label: 'Jasa Buat Aplikasi Medan' },
  { href: '/jasa-buat-web-palu', label: 'Jasa Buat Web Palu' },
  { href: '/jasa-buat-aplikasi-palu', label: 'Jasa Buat Aplikasi Palu' },
];

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/**
 * The footer is the last thing a hesitant UMKM owner reads before deciding
 * whether these are real people. Every figure here is pulled from somewhere
 * else on the site — the live-work count comes straight from `lib/portfolio`,
 * so it cannot drift from the portfolio grid.
 */
const signals = [
  {
    icon: (
      <svg {...iconProps}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Basis tim',
    value: 'Medan & Palu, melayani seluruh Indonesia',
  },
  {
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    label: 'Jam operasional',
    value: 'Senin – Jumat, 09:00 – 18:00 WIB',
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    label: 'Karya yang sudah live',
    value: `${portfolioItems.length} produk klien berjalan di lapangan`,
  },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">{children}</ul>
    </div>
  );
}

const linkClass =
  'inline-block rounded-sm transition-colors hover:text-brand focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    /* The tinted band and the top rule do the separating now, so the old
       `mt-section-sm` on top of the last section's bottom padding only left a
       hole between the page and its close. */
    <footer className="relative overflow-hidden border-t border-line bg-surface-muted">
      {/* Bookends the hero — the same quiet grid, held further back. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <Container className="relative">
        {/* Trust strip. */}
        <ul className="grid gap-4 border-b border-line py-8 sm:grid-cols-3 sm:gap-6">
          {signals.map((signal) => (
            <li key={signal.label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand">
                {signal.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                  {signal.label}
                </span>
                <span className="block text-sm text-ink">{signal.value}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* Two columns even at 360px — a single stacked column turned the footer
            into a 1000px scroll on a phone. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-5 md:gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="font-display font-bold text-ink">Palu Dev House</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-muted">
              Software house Indonesia untuk UMKM &amp; bisnis yang mau naik kelas. Jasa buat web &amp;
              aplikasi dari Medan, Palu, melayani seluruh Indonesia.
            </p>
          </div>

          <FooterColumn title="Layanan">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Lokasi">
            {locationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Kontak">
            <li>Medan, Sumatera Utara</li>
            <li>Palu, Sulawesi Tengah</li>
            <li>
              <Link href="/#kontak" className={linkClass}>
                WhatsApp
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-line py-6 text-sm text-ink-subtle sm:flex-row sm:items-center">
          <div>© {year} Palu Dev House. All rights reserved.</div>
          <div>paludevhouse.site</div>
        </div>
      </Container>
    </footer>
  );
}
