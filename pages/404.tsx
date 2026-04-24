import Head from 'next/head';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Halaman tidak ditemukan | Palu Dev House</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Header />
      <main className="py-section">
        <Container className="text-center">
          <div className="text-sm font-semibold text-brand uppercase tracking-wide">404</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-ink">Halaman tidak ditemukan</h1>
          <p className="mt-4 text-ink-muted">Mungkin link-nya salah atau halaman sudah dipindah.</p>
          <div className="mt-8">
            <ButtonLink href="/">Kembali ke beranda</ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
