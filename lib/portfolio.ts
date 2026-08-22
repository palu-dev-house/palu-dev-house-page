export interface PortfolioItem {
  name: string;
  url: string;
  category: string;
  image: string;
}

// Every entry is rendered as a clickable card (components/sections/Portfolio.tsx
// keys on and links to `url`), so a dead URL sends a prospective client from
// this page straight to a 404. Verify a link still answers 200 before adding
// it back.
//
// Removed 2026-08-22: "Tuition App" (tuition-app.up.railway.app) — the Railway
// deployment was decommissioned and the URL now 404s. Its successor, SkolFi,
// runs on the school's own machine and has no public address yet; add it back
// once it does.
export const portfolioItems: PortfolioItem[] = [
  {
    name: 'Toko Ninja',
    url: 'https://tokoninja.com/',
    category: 'Retail Platform',
    image: '/portfolio/toko-ninja.png',
  },
  {
    name: 'Toko Ninja POS',
    url: 'https://pos.tokoninja.com/',
    category: 'POS System',
    image: '/portfolio/toko-ninja-pos.png',
  },
  {
    name: 'Kontraktor Utama Indonesia',
    url: 'https://kontraktorutamaindonesia.netlify.app/',
    category: 'Company Profile',
    image: '/portfolio/kontraktor-utama.png',
  },
  {
    name: 'Tri Mustika Sejagat',
    url: 'https://tms-landing-lime.vercel.app/',
    category: 'Company Profile',
    image: '/portfolio/tri-mustika-sejagat.png',
  },
  {
    name: 'Hinno Art',
    url: 'https://hinno.art/',
    category: 'Portfolio Site',
    image: '/portfolio/hinno-art.png',
  },
];
