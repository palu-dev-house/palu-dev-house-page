import Head from "next/head";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Portfolio } from "@/components/Portfolio";
import { Stack } from "@/components/Stack";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{site.brand} — {site.tagline}</title>
        <meta name="description" content={site.description} />
        <meta property="og:title" content={`${site.brand} — ${site.tagline}`} />
        <meta property="og:description" content={site.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
