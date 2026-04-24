import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from './Container';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ButtonLink } from '../ui/Button';

const navLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#rekomendasi', label: 'Rekomendasi' },
  { href: '/harga', label: 'Harga' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastState = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 8;
        if (next !== lastState) {
          lastState = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };
    // prime initial state without animation frame
    setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled ? 'bg-surface/85 backdrop-blur border-b border-line' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Palu Dev House">
          <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-semibold text-ink">Palu Dev House</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/#kontak" size="sm" className="hidden sm:inline-flex">
            Hubungi Kami
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
