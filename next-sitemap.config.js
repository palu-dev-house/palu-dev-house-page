/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://paludevhouse.site',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 7000,
  robotsTxtOptions: {
    // GEO: explicitly welcome AI answer-engine crawlers so our content can be
    // indexed and cited by ChatGPT, Gemini, Perplexity, Claude, and Copilot.
    additionalSitemaps: [],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' }, // OpenAI / ChatGPT
      { userAgent: 'OAI-SearchBot', allow: '/' }, // OpenAI search
      { userAgent: 'ChatGPT-User', allow: '/' }, // ChatGPT browsing
      { userAgent: 'ClaudeBot', allow: '/' }, // Anthropic / Claude
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' }, // Perplexity
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini / AI Overviews
      { userAgent: 'Applebot-Extended', allow: '/' }, // Apple Intelligence
      { userAgent: 'CCBot', allow: '/' }, // Common Crawl (LLM training)
      { userAgent: 'cohere-ai', allow: '/' },
    ],
  },
};
