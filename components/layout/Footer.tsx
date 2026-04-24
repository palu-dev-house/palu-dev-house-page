import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-12 mt-section-sm">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="font-semibold text-ink">Palu Dev House</span>
            </div>
            <p className="mt-4 text-sm text-ink-muted max-w-sm">
              Software house Indonesia untuk UMKM & bisnis yang mau naik kelas. Berbasis di Medan & Palu, melayani klien di seluruh Indonesia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Layanan</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li><Link href="/#layanan" className="hover:text-ink">Landing Page</Link></li>
              <li><Link href="/#layanan" className="hover:text-ink">Web Application</Link></li>
              <li><Link href="/seo" className="hover:text-ink">SEO Service</Link></li>
              <li><Link href="/harga" className="hover:text-ink">Harga Lengkap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">Kontak</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>Medan, Sumatera Utara</li>
              <li>Palu, Sulawesi Tengah</li>
              <li><Link href="/#kontak" className="hover:text-ink">Hubungi via WhatsApp</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-4 text-sm text-ink-muted">
          <div>© {year} Palu Dev House. All rights reserved.</div>
          <div>paludevhouse.site</div>
        </div>
      </Container>
    </footer>
  );
}
