export interface Founder {
  name: string;
  role: string;
  linkedin: string;
  bio: string;
  initials: string;
}

export const founders: Founder[] = [
  {
    name: 'Stiven Suhendra',
    role: 'Co-Founder',
    linkedin: 'https://www.linkedin.com/in/stiven-suhendra/',
    bio: 'Co-founder Palu Dev House. Fokus memastikan setiap project — dari landing page sampai sistem ERP — selesai tepat waktu dan benar-benar dipakai bisnis klien, bukan sekadar jadi.',
    initials: 'SS',
  },
  {
    name: 'Ferdy Lim',
    role: 'Co-Founder',
    linkedin: 'https://www.linkedin.com/in/ferdylimm9/',
    bio: 'Co-founder Palu Dev House. Engineer di balik produk-produk yang sudah live seperti Toko Ninja (retail platform & POS) — membangun web dan aplikasi yang running di lapangan setiap hari.',
    initials: 'FL',
  },
];
