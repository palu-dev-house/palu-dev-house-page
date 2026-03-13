#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Pre-build SEO and Content Generation Script
 * 
 * This script runs before the build process to:
 * 1. Generate sitemap.xml
 * 2. Generate robots.txt
 * 3. Generate SEO metadata
 * 4. Update content writing with latest data
 * 5. Generate ETags for caching
 * 6. Generate manifest files
 * 7. Generate OpenGraph and Twitter Card metadata
 * 8. Generate structured data (JSON-LD)
 * 
 * Usage: node prebuild-seo.js [options]
 * 
 * Options:
 *   --output <dir>       Output directory (default: public)
 *   --base-url <url>     Base URL for sitemap (default: https://paludevhouse.site)
 *   --dry-run           Show what would be generated without creating files
 *   --verbose           Show detailed output
 *   --help              Show this help message
 */

class PrebuildSEOGenerator {
  constructor(options = {}) {
    this.options = {
      outputDir: options.output || 'public',
      baseUrl: options.baseUrl || 'https://paludevhouse.site',
      dryRun: options.dryRun || false,
      verbose: options.verbose || false,
    };
    
    this.stats = {
      filesGenerated: 0,
      filesUpdated: 0,
      errors: 0,
      startTime: Date.now(),
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
  }

  /**
   * Get current timestamp for ETags
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Generate ETag for content
   */
  generateETag(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Write file with ETag
   */
  writeFileWithETag(filePath, content, mimeType = 'text/plain') {
    try {
      const etag = this.generateETag(content);
      const etagPath = `${filePath}.etag`;
      
      if (!this.options.dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
        fs.writeFileSync(etagPath, etag, 'utf8');
        
        if (this.options.verbose) {
          console.log(`✅ Generated: ${path.relative(process.cwd(), filePath)} (${content.length} bytes)`);
          console.log(`   ETag: ${etag}`);
        }
      } else {
        console.log(`🔍 Would generate: ${path.relative(process.cwd(), filePath)} (${content.length} bytes)`);
      }
      
      this.stats.filesGenerated++;
      return true;
    } catch (error) {
      console.error(`❌ Error writing ${filePath}:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Load copywriting data
   */
  loadCopywriting() {
    try {
      const copywritingPath = path.join(process.cwd(), 'data', 'copywriting.json');
      if (fs.existsSync(copywritingPath)) {
        const content = fs.readFileSync(copywritingPath, 'utf8');
        return JSON.parse(content);
      }
      console.warn('⚠️  copywriting.json not found, using default data');
      return this.getDefaultCopywriting();
    } catch (error) {
      console.error('❌ Error loading copywriting data:', error.message);
      return this.getDefaultCopywriting();
    }
  }

  /**
   * Get default copywriting data
   */
  getDefaultCopywriting() {
    return {
      landingPage: {
        hero: {
          title: "Membangun Tools yang Tepat untuk Semua Orang di Indonesia",
          subtitle: "Tech House dari Indonesia",
          description: "Kami membangun tools yang tepat, berdampak, dan sederhana untuk semua orang di Indonesia."
        },
        meta: {
          title: "Palu Dev House - Tech House dari Indonesia",
          description: "Perusahaan teknologi dari Indonesia yang membangun tools dan aplikasi SaaS untuk membantu bisnis dan menyebarkan penggunaan teknologi di seluruh Indonesia.",
          keywords: "technology, indonesia, web development, mobile apps, saas, palu dev house"
        }
      }
    };
  }

  /**
   * Generate sitemap.xml
   */
  generateSitemap() {
    const copywriting = this.loadCopywriting();
    const currentDate = new Date().toISOString();
    
    const pages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.9', changefreq: 'weekly' },
      { url: '/founders', priority: '0.8', changefreq: 'weekly' },
      { url: '/projects', priority: '0.9', changefreq: 'weekly' },
      { url: '/articles', priority: '0.8', changefreq: 'daily' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/admin', priority: '0.3', changefreq: 'monthly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    pages.forEach(page => {
      sitemap += `
  <url>
    <loc>${this.options.baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add dynamic pages from projects and articles if they exist
    try {
      const projectsDir = path.join(process.cwd(), 'src', 'app', 'projects');
      if (fs.existsSync(projectsDir)) {
        const items = fs.readdirSync(projectsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]')
          .map(dirent => dirent.name);
        
        items.forEach(slug => {
          sitemap += `
  <url>
    <loc>${this.options.baseUrl}/projects/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });
      }
    } catch (error) {
      if (this.options.verbose) console.warn('⚠️  Could not scan projects directory:', error.message);
    }

    sitemap += `
</urlset>`;

    const sitemapPath = path.join(this.options.outputDir, 'sitemap.xml');
    return this.writeFileWithETag(sitemapPath, sitemap, 'application/xml');
  }

  /**
   * Generate robots.txt
   */
  generateRobots() {
    const robots = `# Palu Dev House - Robots.txt
# Generated on ${this.getTimestamp()}

User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.options.baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Crawl delay for respectful crawling
Crawl-delay: 1`;

    const robotsPath = path.join(this.options.outputDir, 'robots.txt');
    return this.writeFileWithETag(robotsPath, robots, 'text/plain');
  }

  /**
   * Generate SEO metadata JSON
   */
  generateSEOMetadata() {
    const copywriting = this.loadCopywriting();
    const metadata = {
      generated: this.getTimestamp(),
      baseUrl: this.options.baseUrl,
      site: {
        name: "Palu Dev House",
        title: copywriting.landingPage.hero.title,
        description: copywriting.landingPage.hero.description,
        subtitle: copywriting.landingPage.hero.subtitle,
        keywords: copywriting.landingPage.meta?.keywords || "technology, indonesia, web development, mobile apps, saas",
        author: "Palu Dev House",
        publisher: "Palu Dev House",
        copyright: `© ${new Date().getFullYear()} Palu Dev House. All rights reserved.`,
        language: "id-ID",
        locale: "id_ID",
        timezone: "Asia/Jakarta"
      },
      social: {
        "twitter:card": "summary_large_image",
        "twitter:site": "@paludevhouse",
        "twitter:creator": "@paludevhouse",
        "og:type": "website",
        "og:locale": "id_ID",
        "og:site_name": "Palu Dev House",
        "fb:app_id": ""
      },
      verification: {
        "google-site-verification": "",
        "msvalidate.01": "",
        "yandex-verification": "",
        "baidu-site-verification": ""
      },
      etags: {}
    };

    const metadataPath = path.join(this.options.outputDir, 'seo-metadata.json');
    const success = this.writeFileWithETag(metadataPath, JSON.stringify(metadata, null, 2), 'application/json');
    
    if (success) {
      // Store ETag for metadata
      metadata.etags['seo-metadata.json'] = this.generateETag(JSON.stringify(metadata, null, 2));
      return this.writeFileWithETag(metadataPath, JSON.stringify(metadata, null, 2), 'application/json');
    }
    return false;
  }

  /**
   * Generate structured data (JSON-LD)
   */
  generateStructuredData() {
    const copywriting = this.loadCopywriting();
    
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Palu Dev House",
      "url": this.options.baseUrl,
      "logo": `${this.options.baseUrl}/icons/logo.svg`,
      "description": copywriting.landingPage.hero.description,
      "foundingDate": "2024",
      "founders": [
        {
          "@type": "Person",
          "name": "Stiven Suhendra",
          "jobTitle": "Co-Founder & CEO",
          "url": `${this.options.baseUrl}/founders`
        },
        {
          "@type": "Person", 
          "name": "Ferdy Lim",
          "jobTitle": "Co-Founder & CTO",
          "url": `${this.options.baseUrl}/founders`
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Sulawesi",
        "addressLocality": "Palu"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-822-6874-7890",
        "contactType": "customer service",
        "availableLanguage": ["Indonesian", "English"]
      },
      "sameAs": [
        "https://github.com/palu-dev-house",
        "https://linkedin.com/company/paludevhouse",
        "https://twitter.com/paludevhouse"
      ]
    };

    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Palu Dev House",
      "url": this.options.baseUrl,
      "description": copywriting.landingPage.hero.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.options.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const structuredData = {
      generated: this.getTimestamp(),
      organization: organizationData,
      website: websiteData,
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": this.options.baseUrl
          }
        ]
      }
    };

    const structuredDataPath = path.join(this.options.outputDir, 'structured-data.json');
    return this.writeFileWithETag(structuredDataPath, JSON.stringify(structuredData, null, 2), 'application/ld+json');
  }

  /**
   * Generate OpenGraph and Twitter Card metadata
   */
  generateOpenGraph() {
    const copywriting = this.loadCopywriting();
    
    const openGraph = {
      "og:title": copywriting.landingPage.hero.title,
      "og:description": copywriting.landingPage.hero.description,
      "og:image": `${this.options.baseUrl}/icons/og-image.png`,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
      "og:url": this.options.baseUrl,
      "og:type": "website",
      "og:locale": "id_ID",
      "og:site_name": "Palu Dev House"
    };

    const twitterCard = {
      "twitter:card": "summary_large_image",
      "twitter:site": "@paludevhouse",
      "twitter:creator": "@paludevhouse",
      "twitter:title": copywriting.landingPage.hero.title,
      "twitter:description": copywriting.landingPage.hero.description,
      "twitter:image": `${this.options.baseUrl}/icons/twitter-card.png`,
      "twitter:image:alt": copywriting.landingPage.hero.title
    };

    const openGraphPath = path.join(this.options.outputDir, 'opengraph.json');
    const twitterPath = path.join(this.options.outputDir, 'twitter-card.json');
    
    const success1 = this.writeFileWithETag(openGraphPath, JSON.stringify(openGraph, null, 2), 'application/json');
    const success2 = this.writeFileWithETag(twitterPath, JSON.stringify(twitterCard, null, 2), 'application/json');
    
    return success1 && success2;
  }

  /**
   * Generate ETags index
   */
  generateETagsIndex() {
    const etags = {};
    
    // Scan all files in output directory
    const scanDirectory = (dir, basePath = '') => {
      try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const relativePath = path.relative(this.options.outputDir, itemPath);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            scanDirectory(itemPath, relativePath);
          } else if (item.endsWith('.etag')) {
            // Read ETag file
            try {
              const etagContent = fs.readFileSync(itemPath, 'utf8');
              const originalFile = relativePath.replace('.etag', '');
              etags[originalFile] = etagContent.trim();
            } catch (error) {
              console.warn(`⚠️  Could not read ETag file: ${itemPath}`);
            }
          }
        });
      } catch (error) {
        console.warn(`⚠️  Could not scan directory: ${dir}`);
      }
    };
    
    scanDirectory(this.options.outputDir);
    
    const etagsData = {
      generated: this.getTimestamp(),
      baseUrl: this.options.baseUrl,
      totalFiles: Object.keys(etags).length,
      etags: etags
    };
    
    const etagsPath = path.join(this.options.outputDir, 'etags.json');
    return this.writeFileWithETag(etagsPath, JSON.stringify(etagsData, null, 2), 'application/json');
  }

  /**
   * Update copywriting with latest timestamp
   */
  updateCopywritingTimestamp() {
    try {
      const copywritingPath = path.join(process.cwd(), 'data', 'copywriting.json');
      if (fs.existsSync(copywritingPath)) {
        const copywriting = JSON.parse(fs.readFileSync(copywritingPath, 'utf8'));
        copywriting.meta.lastUpdated = this.getTimestamp();
        copywriting.meta.prebuildGenerated = this.getTimestamp();
        
        if (!this.options.dryRun) {
          fs.writeFileSync(copywritingPath, JSON.stringify(copywriting, null, 2), 'utf8');
          if (this.options.verbose) {
            console.log(`✅ Updated copywriting timestamp`);
          }
        } else {
          console.log(`🔍 Would update copywriting timestamp`);
        }
        
        this.stats.filesUpdated++;
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating copywriting timestamp:', error.message);
      this.stats.errors++;
      return false;
    }
    return false;
  }

  /**
   * Generate security headers configuration
   */
  generateSecurityHeaders() {
    const securityConfig = {
      generated: this.getTimestamp(),
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
        "X-XSS-Protection": "1; mode=block",
        "X-Download-Options": "noopen"
      }
    };

    const securityPath = path.join(this.options.outputDir, 'security-headers.json');
    return this.writeFileWithETag(securityPath, JSON.stringify(securityConfig, null, 2), 'application/json');
  }

  /**
   * Run all generation tasks
   */
  async run() {
    console.log('🚀 Starting pre-build SEO generation...');
    console.log(`📁 Output directory: ${this.options.outputDir}`);
    console.log(`🌐 Base URL: ${this.options.baseUrl}`);
    console.log(`🧪 Dry run: ${this.options.dryRun}`);
    console.log('');

    const tasks = [
      { name: 'Sitemap', fn: () => this.generateSitemap() },
      { name: 'Robots.txt', fn: () => this.generateRobots() },
      { name: 'Update Timestamp', fn: () => this.updateCopywritingTimestamp() },
    ];

    for (const task of tasks) {
      console.log(`🔄 Generating ${task.name}...`);
      const success = task.fn();
      if (success) {
        console.log(`✅ ${task.name} completed`);
      } else {
        console.log(`❌ ${task.name} failed`);
      }
      console.log('');
    }

    // Print summary
    const duration = ((Date.now() - this.stats.startTime) / 1000).toFixed(2);
    console.log('📊 Generation Summary:');
    console.log('='.repeat(50));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📁 Files generated: ${this.stats.filesGenerated}`);
    console.log(`📝 Files updated: ${this.stats.filesUpdated}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    console.log('');

    if (this.stats.errors > 0) {
      console.log('⚠️  Some tasks failed. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('🎉 All SEO generation tasks completed successfully!');
      console.log('🚀 Ready for production build!');
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--output':
        options.output = args[++i];
        break;
      case '--base-url':
        options.baseUrl = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        console.log(`
Pre-build SEO and Content Generation Script

Usage: node prebuild-seo.js [options]

Options:
  --output <dir>       Output directory (default: public)
  --base-url <url>     Base URL for sitemap (default: https://paludevhouse.id)
  --dry-run           Show what would be generated without creating files
  --verbose           Show detailed output
  --help              Show this help message

Generated Files:
  - sitemap.xml
  - robots.txt
  - seo-metadata.json
  - structured-data.json
  - opengraph.json
  - twitter-card.json
  - security-headers.json
  - etags.json
  - *.etag files for caching

Examples:
  node prebuild-seo.js
  node prebuild-seo.js --base-url https://example.com
  node prebuild-seo.js --dry-run --verbose
        `);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        console.error('Use --help for available options');
        process.exit(1);
    }
  }
  
  return options;
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs();
  const generator = new PrebuildSEOGenerator(options);
  
  try {
    await generator.run();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PrebuildSEOGenerator;
