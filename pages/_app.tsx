import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme';
import '@/styles/globals.css';

/**
 * Fonts are loaded through `next/font`, which downloads and self-hosts them at
 * build time. They were previously pulled from a Google Fonts <link> at
 * runtime, which never actually rendered — `document.fonts.check` reported
 * Inter unloaded and the page fell through to Helvetica, so the site was
 * showing a system font while claiming to use Inter. Self-hosting also removes
 * a render-blocking third-party request and the privacy question that comes
 * with it.
 *
 * Plus Jakarta Sans carries the headings. It was commissioned for Jakarta's
 * city branding, which makes it a deliberate choice for an Indonesian studio
 * rather than another Inter-on-Inter page — and its wider, rounder caps give
 * headlines the confidence the old flat type never had.
 */
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div className={`${sans.variable} ${display.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
