import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { ButtonLink } from '../ui/Button';
import { portfolioItems } from '@/lib/portfolio';

/**
 * The three things a prospect is actually shopping for, buried mid-sentence in
 * a dense block of Indonesian. Surfacing them as chips lets the eye grab the
 * offer in a glance; the full sentence stays above them for search and for
 * anyone who reads it properly.
 *
 * Two of these were prices until the studio took pricing off the site. What a
 * chip has to do is give the eye something concrete to hold, so they were
 * replaced with the other concrete things we can promise — not deleted, which
 * would have left the hero with a single lonely chip.
 */
const stats = [
  { value: 'SEO + GEO', label: 'Sudah bawaan' },
  { value: '1 bulan', label: 'Estimasi build aplikasi' },
  { value: 'Gratis', label: 'Konsultasi & estimasi' },
];

/**
 * The right-hand column shows real, live client work rather than an abstract
 * shape — for an agency, the proof and the decoration can be the same object.
 * Both frames come from `lib/portfolio`, so they can never drift from the
 * portfolio section further down the page.
 */
const [primaryWork, secondaryWork] = portfolioItems;

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

function WindowDots() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-line-strong" />
      <span className="h-2 w-2 rounded-full bg-line-strong" />
      <span className="h-2 w-2 rounded-full bg-line-strong" />
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-section-sm pt-10 md:pb-section md:pt-16">
      {/* Depth, without shipping a background image. The grid is held back so it
          reads as texture behind the glow rather than as a second pattern. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-50" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---------------------------------------------------------- copy */}
          <div className="max-w-2xl">
            <motion.div
              {...rise(0)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur-sm"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Software house Medan · Palu · Indonesia
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              className="mt-6 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]"
            >
              Jasa Buat Web &amp; Aplikasi yang Bikin{' '}
              <span className="text-gradient">Bisnismu Naik Kelas</span>
            </motion.h1>

            <motion.p {...rise(0.16)} className="mt-6 max-w-xl text-base text-ink-muted sm:text-lg">
              Jasa buat web, aplikasi, sistem, dan program custom untuk UMKM di Medan, Palu, dan seluruh Indonesia. Landing page dengan technical SEO + GEO bundled (dikutip ChatGPT/Gemini/Perplexity), aplikasi POS/ERP/booking dengan estimasi build 1 bulan penuh — hasil yang naikin transaksi dan jangkauan pelanggan. Estimasi biayanya kami hitung sesuai kebutuhan bisnismu, gratis lewat WhatsApp.
            </motion.p>

            <motion.dl {...rise(0.22)} className="mt-8 flex flex-wrap gap-2.5">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="flex flex-col-reverse rounded-lg border border-line bg-surface/70 px-3.5 py-2 backdrop-blur-sm"
                >
                  <dt className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-[17px] font-bold leading-none text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div {...rise(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              {/* One CTA leads. Amber is the only thing on the page that colour,
                  so there is no question which button is the next step.
                  `py-3.5` is a stopgap: Button's `lg` size asks for `h-13`, which
                  is not on Tailwind's default spacing scale, so the class emits
                  nothing and lg buttons collapse to ~24px. 14px of padding either
                  side of a 24px line box lands on exactly the 52px `h-13` wants,
                  so this stays correct once the scale gains a `13`. */}
              <ButtonLink href="#rekomendasi" variant="accent" size="lg" className="w-full py-3.5 sm:w-auto">
                Cari Paket yang Cocok
              </ButtonLink>
              <ButtonLink href="#paket" variant="secondary" size="lg" className="w-full py-3.5 sm:w-auto">
                Lihat Isi Paket
              </ButtonLink>
            </motion.div>
          </div>

          {/* -------------------------------------------------------- visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[540px] pb-14 sm:pb-20 lg:mx-0"
          >
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
              <div
                aria-hidden="true"
                className="flex items-center gap-3 border-b border-line bg-surface-muted px-3 py-2.5"
              >
                <WindowDots />
                <span className="min-w-0 flex-1 truncate rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] text-ink-subtle">
                  {hostname(primaryWork.url)}
                </span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image
                  src={primaryWork.image}
                  alt={`Preview ${primaryWork.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 540px, (min-width: 640px) 540px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Second frame, offset — one screenshot is a picture, two stacked
                read as a body of work. */}
            <div className="absolute bottom-0 left-0 w-[52%] max-w-[240px] overflow-hidden rounded-lg border border-line bg-surface shadow-lg sm:left-2">
              <div
                aria-hidden="true"
                className="flex items-center gap-2 border-b border-line bg-surface-muted px-2 py-1.5"
              >
                <WindowDots />
                <span className="min-w-0 flex-1 truncate text-[10px] text-ink-subtle">
                  {hostname(secondaryWork.url)}
                </span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image
                  src={secondaryWork.image}
                  alt={`Preview ${secondaryWork.name}`}
                  fill
                  sizes="(min-width: 640px) 240px, 50vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
