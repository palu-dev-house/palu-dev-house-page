import { Html, Head, Main, NextScript } from 'next/document';

const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {GSC_TOKEN && <meta name="google-site-verification" content={GSC_TOKEN} />}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
