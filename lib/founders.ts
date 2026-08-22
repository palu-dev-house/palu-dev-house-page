export interface Founder {
  name: string;
  role: string;
  /**
   * Personal LinkedIn profile. Only real, resolving profiles belong here —
   * these feed each founder's Person `sameAs`, and a dead one weakens the
   * entity signal instead of strengthening it. The studio's own company page
   * was removed for exactly that reason (it 404s).
   *
   * Note when checking these: LinkedIn answers automated requests with HTTP
   * 999, not 200. That is its bot block, not a broken link — verify in a
   * browser rather than with curl.
   */
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
