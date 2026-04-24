import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { ArticleBody } from '@/components/ui/ArticleBody';
import { ButtonLink } from '@/components/ui/Button';
import {
  articles,
  getArticleBySlug,
  getAllArticleSlugs,
  type Article,
} from '@/lib/articles';
import { buildMeta, SITE_URL } from '@/lib/seo';

const WHATSAPP_NUMBER = '628000000000';

interface Props {
  article: Article;
  related: Article[];
}

export default function ArticlePage({ article, related }: Props) {
  const meta = buildMeta({
    title: article.title,
    description: article.description,
    path: `/artikel/${article.slug}`,
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Palu Dev House' },
    publisher: {
      '@type': 'Organization',
      name: 'Palu Dev House',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': meta.canonical,
    },
  };

  const whatsappText = encodeURIComponent(
    `Halo Palu Dev House, saya baru baca artikel "${article.title}" dan mau konsultasi.`
  );

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:section" content={article.category} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </Head>
      <Header />
      <main>
        <section className="py-section-sm md:pt-section">
          <Container>
            <div className="max-w-prose mx-auto">
              <div className="text-xs">
                <Link
                  href="/artikel"
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  ← Semua Artikel
                </Link>
              </div>
              <div className="mt-6 text-xs font-semibold text-brand uppercase tracking-wide">
                {article.category}
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight">
                {article.title}
              </h1>
              <div className="mt-4 flex items-center gap-3 text-sm text-ink-muted">
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{article.readTime} baca</span>
              </div>

              <div className="mt-10">
                <ArticleBody intro={article.intro} sections={article.sections} />
              </div>

              {/* CTA block */}
              <div className="mt-16 rounded-2xl border border-brand/30 bg-brand-light p-8">
                <h2 className="text-2xl font-semibold text-ink">{article.cta.headline}</h2>
                <p className="mt-3 text-ink-muted">{article.cta.body}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <ButtonLink href="/#rekomendasi" size="lg">
                    Ikuti Quiz Rekomendasi
                  </ButtonLink>
                  <ButtonLink
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="lg"
                  >
                    Chat WhatsApp
                  </ButtonLink>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-section-sm">
                  <h2 className="text-xl font-semibold text-ink">Baca Juga</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/artikel/${r.slug}`}
                        className="group block rounded-xl border border-line bg-surface p-5 hover:border-brand transition-colors"
                      >
                        <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                          {r.category}
                        </div>
                        <div className="mt-2 font-semibold text-ink group-hover:text-brand transition-colors leading-snug">
                          {r.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllArticleSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);
  if (!article) return { notFound: true };

  const related = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => (a.category === article.category ? -1 : 1))
    .slice(0, 4);

  return { props: { article, related } };
};
