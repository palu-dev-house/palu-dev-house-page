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
// was added 2026-08-26 once it got a public Vercel address.
//
// Order matters: the first entry is rendered as the feature card in the
// Portfolio mosaic (components/sections/Portfolio.tsx) — twice the width of the
// rest — so keep the strongest piece of work at the top. The mosaic has
// explicit spans for the first five entries; any beyond that fall back to
// half-width, so keep the count odd (5, 7, ...) to avoid a lone card on the
// last row.
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
    // Renamed + repointed 2026-08-22: the client's live site moved off the
    // Netlify preview (kontraktorutamaindonesia.netlify.app) to their own
    // domain, and the company is "Konstruksi" — not "Kontraktor". The image
    // filename still says kontraktor-; it is only an asset path, left alone
    // because public/ is not owned here.
    name: 'Konstruksi Utama Indonesia',
    url: 'https://www.konstruksiutamaindonesia.com/',
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
  {
    name: 'Bloomwell Allied Health',
    url: 'https://bloom-well-delta.vercel.app/',
    category: 'Clinic Website',
    image: '/portfolio/bloom-well.png',
  },
  {
    // The public URL lands on a sign-in screen, so the screenshot is the
    // admin dashboard captured from a local build with seeded data.
    name: 'SkolFi',
    url: 'https://skolfi.vercel.app/',
    category: 'School Tuition App',
    image: '/portfolio/skolfi.png',
  },
];
