import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from './Container';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ButtonLink } from '../ui/Button';

const navLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#rekomendasi', label: 'Rekomendasi' },
  { href: '/#paket', label: 'Paket' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/#faq', label: 'FAQ' },
];

/**
 * Two thresholds, not one. A single `scrollY > 8` boundary sits exactly where a
 * momentum scroll comes to rest on a phone, so the bar could flip between its
 * two heights on every frame; with the condensed state entered at 64px and left
 * again at 16px there is no scroll position that can oscillate.
 */
const CONDENSE_AT = 64;
const EXPAND_AT = 16;

function isActive(href: string, asPath: string) {
  const current = asPath.split('?')[0];
  if (href.includes('#')) return current === href;
  return current === href || current.startsWith(`${href}/`);
}

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { asPath } = useRouter();

  useEffect(() => {
    let ticking = false;
    let state = false;
    const apply = (y: number) => {
      const next = state ? y > EXPAND_AT : y > CONDENSE_AT;
      if (next !== state) {
        state = next;
        setCondensed(next);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply(window.scrollY);
        ticking = false;
      });
    };
    // Prime the initial state (a reload can restore a mid-page scroll offset).
    state = window.scrollY > CONDENSE_AT;
    setCondensed(state);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the sheet on navigation, on Escape, and when the viewport grows past
  // the breakpoint where the desktop nav takes over.
  useEffect(() => {
    setOpen(false);
  }, [asPath]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`transition-[background-color,box-shadow,border-color] duration-200 ${
          condensed || open
            ? 'border-b border-line bg-surface/90 shadow-sm backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <Container
          className={`flex items-center justify-between transition-[height] duration-200 ${
            condensed ? 'h-14' : 'h-16 md:h-20'
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label="Palu Dev House"
          >
            <img
              src="/logo.svg"
              alt=""
              width={32}
              height={32}
              className={`transition-[height,width] duration-200 ${condensed ? 'h-7 w-7' : 'h-8 w-8'}`}
            />
            <span className="font-display font-bold text-ink">Palu Dev House</span>
          </Link>

          <nav aria-label="Utama" className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, asPath);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    active ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/#kontak" size="sm" className="hidden sm:inline-flex">
              Hubungi Kami
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 md:hidden"
            >
              {/* Transform-only morph — nothing here triggers layout per frame. */}
              <span aria-hidden="true" className="relative block h-4 w-4">
                <motion.span
                  className="absolute left-0 top-1/2 -mt-px block h-0.5 w-4 rounded-full bg-current"
                  animate={open ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
                  transition={{ duration: 0.18 }}
                />
                <motion.span
                  className="absolute left-0 top-1/2 -mt-px block h-0.5 w-4 rounded-full bg-current"
                  animate={open ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </span>
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 bg-brand-950/30 backdrop-blur-[2px] md:hidden"
            />
            <motion.div
              key="sheet"
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-surface shadow-lg md:hidden"
            >
              <Container className="py-5">
                <nav aria-label="Menu seluler" className="flex flex-col">
                  {navLinks.map((link) => {
                    const active = isActive(link.href, asPath);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-base transition-colors ${
                          active
                            ? 'bg-brand-light font-semibold text-ink'
                            : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                        }`}
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={active ? 'text-brand' : 'text-ink-subtle'}
                        >
                          →
                        </span>
                      </Link>
                    );
                  })}
                </nav>
                <ButtonLink
                  href="/#kontak"
                  size="lg"
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full py-3.5"
                >
                  Hubungi Kami
                </ButtonLink>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
