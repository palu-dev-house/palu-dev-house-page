export interface PortfolioItem {
  name: string;
  url: string;
  category: string;
}

export const portfolioItems: PortfolioItem[] = [
  { name: 'Toko Ninja', url: 'https://tokoninja.com/', category: 'Retail Platform' },
  { name: 'Toko Ninja ERP', url: 'https://erp.tokoninja.com/', category: 'ERP System' },
  { name: 'Toko Ninja POS', url: 'https://pos.tokoninja.com/', category: 'POS System' },
  { name: 'Hinno Art', url: 'https://hinno.art/', category: 'Portfolio Site' },
  { name: 'Tuition App', url: 'https://tuition-app.up.railway.app/', category: 'Education Platform' },
];
