export interface PortfolioItem {
  name: string;
  url: string;
  category: string;
  image: string;
}

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
  {
    name: 'Tuition App',
    url: 'https://tuition-app.up.railway.app/',
    category: 'Education Platform',
    image: '/portfolio/tuition-app.png',
  },
];
