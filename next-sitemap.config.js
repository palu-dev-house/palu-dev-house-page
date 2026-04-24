/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://paludevhouse.site',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
