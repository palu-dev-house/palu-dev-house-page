import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { articles } from '@/lib/articles';
import { buildMeta } from '@/lib/seo';

export default function ArtikelIndex() {
  const meta = buildMeta({
    title: 'Artikel Jasa Buat Web & Aplikasi — Panduan UMKM',
    description:
      'Panduan lengkap jasa buat web & jasa buat aplikasi untuk UMKM Indonesia: ERP, POS, landing page, static vs dynamic web, technical SEO, pilihan server & hosting Indonesia. Semua artikel gratis.',
    path: '/artikel',
  });

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
      </Head>
      <Header />
      <main>
        <section className="py-section-sm md:py-section">
          <Container>
            <div className="max-w-prose mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                Artikel & Panduan
              </h1>
              <p className="mt-4 text-ink-muted">
                Penjelasan tanpa jargon soal aplikasi, hosting, dan technical SEO. Biar kamu ga beli
                yang salah.
              </p>
            </div>

            <div className="mt-section-sm grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/artikel/${article.slug}`}
                  className="group block rounded-xl border border-line bg-surface p-6 hover:border-brand transition-colors"
                >
                  <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                    {article.category}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-ink group-hover:text-brand transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
                    <span>{article.readTime} baca</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
