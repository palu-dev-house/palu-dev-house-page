#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * ISR (Incremental Static Regeneration) Trigger Script
 * 
 * This script handles ISR triggers for Next.js pages and generates
 * revalidation tokens and checksums for cache invalidation.
 * 
 * Usage: node isr-trigger.js [options]
 * 
 * Options:
 *   --output <dir>       Output directory (default: public)
 *   --base-url <url>     Base URL for revalidation (default: https://paludevhouse.site)
 *   --pages <pages>      Comma-separated list of pages to revalidate
 *   --all               Revalidate all pages
 *   --dry-run           Show what would be generated without creating files
 *   --verbose           Show detailed output
 *   --help              Show this help message
 */

class ISRTrigger {
  constructor(options = {}) {
    this.options = {
      outputDir: options.output || 'public',
      baseUrl: options.baseUrl || 'https://paludevhouse.site',
      pages: options.pages ? options.pages.split(',') : [],
      all: options.all || false,
      dryRun: options.dryRun || false,
      verbose: options.verbose || false,
    };
    
    this.stats = {
      pagesProcessed: 0,
      tokensGenerated: 0,
      errors: 0,
      startTime: Date.now(),
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
  }

  /**
   * Generate revalidation token
   */
  generateRevalidationToken(page, timestamp) {
    const data = `${page}:${timestamp}:${this.options.baseUrl}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate page checksum
   */
  generatePageChecksum(page, content) {
    return crypto.createHash('md5').update(`${page}:${content}`).digest('hex');
  }

  /**
   * Get all ISR-eligible pages
   */
  getISRPages() {
    const pages = [
      '/',
      '/about',
      '/founders', 
      '/projects',
      '/projects/[slug]',
      '/articles',
      '/articles/[slug]',
      '/contact',
      '/admin'
    ];

    // Add dynamic pages from file system
    try {
      const projectsDir = path.join(process.cwd(), 'src', 'app', 'projects');
      if (fs.existsSync(projectsDir)) {
        const items = fs.readdirSync(projectsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('[') && !dirent.name.startsWith('_'))
          .map(dirent => `/projects/${dirent.name}`);
        pages.push(...items);
      }

      const articlesDir = path.join(process.cwd(), 'src', 'app', 'articles');
      if (fs.existsSync(articlesDir)) {
        const items = fs.readdirSync(articlesDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('[') && !dirent.name.startsWith('_'))
          .map(dirent => `/articles/${dirent.name}`);
        pages.push(...items);
      }
    } catch (error) {
      if (this.options.verbose) console.warn('⚠️  Could not scan dynamic pages:', error.message);
    }

    return pages;
  }

  /**
   * Generate ISR manifest
   */
  generateISRManifest() {
    const pages = this.options.all ? this.getISRPages() : this.options.pages;
    const timestamp = new Date().toISOString();
    
    const manifest = {
      generated: timestamp,
      baseUrl: this.options.baseUrl,
      isrConfig: {
        revalidate: 3600, // 1 hour default
        fallback: true,
        pages: {}
      },
      pages: {}
    };

    pages.forEach(page => {
      const token = this.generateRevalidationToken(page, timestamp);
      const checksum = this.generatePageChecksum(page, timestamp);
      
      manifest.pages[page] = {
        token,
        checksum,
        lastRevalidated: timestamp,
        revalidate: this.getRevalidateTime(page),
        priority: this.getPagePriority(page),
        dependencies: this.getPageDependencies(page)
      };

      manifest.isrConfig.pages[page] = {
        revalidate: this.getRevalidateTime(page),
        fallback: true
      };
    });

    const manifestPath = path.join(this.options.outputDir, 'isr-manifest.json');
    const success = this.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    if (success) {
      this.stats.pagesProcessed = pages.length;
      this.stats.tokensGenerated = pages.length;
    }
    
    return success;
  }

  /**
   * Get revalidate time for page (in seconds)
   */
  getRevalidateTime(page) {
    const revalidateTimes = {
      '/': 3600,        // 1 hour
      '/about': 86400,  // 24 hours
      '/founders': 86400, // 24 hours
      '/projects': 1800, // 30 minutes
      '/articles': 1800,  // 30 minutes
      '/contact': 86400,  // 24 hours
      '/admin': 300     // 5 minutes
    };

    return revalidateTimes[page] || 3600;
  }

  /**
   * Get page priority for revalidation
   */
  getPagePriority(page) {
    const priorities = {
      '/': 1,
      '/projects': 2,
      '/articles': 2,
      '/about': 3,
      '/founders': 3,
      '/contact': 4,
      '/admin': 5
    };

    return priorities[page] || 10;
  }

  /**
   * Get page dependencies
   */
  getPageDependencies(page) {
    const dependencies = {
      '/': ['copywriting.json', 'assets.json'],
      '/about': ['copywriting.json'],
      '/founders': ['copywriting.json'],
      '/projects': ['copywriting.json', 'assets.json'],
      '/articles': ['copywriting.json'],
      '/contact': ['copywriting.json'],
      '/admin': ['copywriting.json']
    };

    return dependencies[page] || [];
  }

  /**
   * Generate revalidation endpoints
   */
  generateRevalidationEndpoints() {
    const pages = this.options.all ? this.getISRPages() : this.options.pages;
    const timestamp = new Date().toISOString();
    
    const endpoints = {
      generated: timestamp,
      baseUrl: this.options.baseUrl,
      api: {
        revalidate: '/api/revalidate',
        batchRevalidate: '/api/revalidate/batch',
        status: '/api/revalidate/status'
      },
      endpoints: {}
    };

    pages.forEach(page => {
      const token = this.generateRevalidationToken(page, timestamp);
      endpoints.endpoints[page] = {
        revalidateUrl: `${this.options.baseUrl}/api/revalidate?page=${encodeURIComponent(page)}&token=${token}`,
        token,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          page,
          token,
          revalidate: this.getRevalidateTime(page)
        }
      };
    });

    const endpointsPath = path.join(this.options.outputDir, 'revalidation-endpoints.json');
    return this.writeFile(endpointsPath, JSON.stringify(endpoints, null, 2));
  }

  /**
   * Generate cache invalidation rules
   */
  generateCacheInvalidationRules() {
    const timestamp = new Date().toISOString();
    
    const rules = {
      generated: timestamp,
      version: '1.0',
      rules: {
        // File-based invalidation
        filePatterns: [
          {
            pattern: 'data/copywriting.json',
            pages: ['/', '/about', '/founders', '/projects', '/articles', '/contact'],
            action: 'revalidate'
          },
          {
            pattern: 'data/assets.json',
            pages: ['/projects'],
            action: 'revalidate'
          },
          {
            pattern: 'public/icons/**',
            pages: ['/'],
            action: 'revalidate'
          },
          {
            pattern: 'public/images/**',
            pages: ['/', '/projects', '/articles'],
            action: 'revalidate'
          }
        ],
        // Time-based invalidation
        schedules: [
          {
            name: 'daily-revalidation',
            cron: '0 2 * * *', // 2 AM daily
            pages: ['/about', '/founders', '/contact'],
            timezone: 'Asia/Jakarta'
          },
          {
            name: 'hourly-revalidation',
            cron: '0 * * * *', // Every hour
            pages: ['/projects', '/articles'],
            timezone: 'Asia/Jakarta'
          }
        ],
        // Event-based invalidation
        events: [
          {
            event: 'content-update',
            trigger: 'copywriting.json',
            pages: ['all'],
            delay: 0
          },
          {
            event: 'asset-update',
            trigger: 'assets.json',
            pages: ['/projects'],
            delay: 0
          }
        ]
      }
    };

    const rulesPath = path.join(this.options.outputDir, 'cache-invalidation-rules.json');
    return this.writeFile(rulesPath, JSON.stringify(rules, null, 2));
  }

  /**
   * Generate ISR status dashboard data
   */
  generateISRStatus() {
    const pages = this.options.all ? this.getISRPages() : this.options.pages;
    const timestamp = new Date().toISOString();
    
    const status = {
      generated: timestamp,
      baseUrl: this.options.baseUrl,
      summary: {
        totalPages: pages.length,
        pagesWithISR: pages.length,
        averageRevalidateTime: this.calculateAverageRevalidateTime(pages),
        lastGlobalRevalidation: timestamp
      },
      pages: {}
    };

    pages.forEach(page => {
      status.pages[page] = {
        status: 'active',
        lastRevalidated: timestamp,
        nextRevalidation: new Date(Date.now() + this.getRevalidateTime(page) * 1000).toISOString(),
        revalidateInterval: this.getRevalidateTime(page),
        priority: this.getPagePriority(page),
        cacheStatus: 'fresh',
        dependencies: this.getPageDependencies(page),
        performance: {
          avgLoadTime: Math.random() * 1000 + 200, // Mock data
          cacheHitRate: Math.random() * 0.3 + 0.7 // Mock data
        }
      };
    });

    const statusPath = path.join(this.options.outputDir, 'isr-status.json');
    return this.writeFile(statusPath, JSON.stringify(status, null, 2));
  }

  /**
   * Calculate average revalidate time
   */
  calculateAverageRevalidateTime(pages) {
    if (pages.length === 0) return 0;
    
    const total = pages.reduce((sum, page) => sum + this.getRevalidateTime(page), 0);
    return Math.round(total / pages.length);
  }

  /**
   * Write file to output directory
   */
  writeFile(filePath, content) {
    try {
      if (!this.options.dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
        if (this.options.verbose) {
          console.log(`✅ Generated: ${path.relative(process.cwd(), filePath)}`);
        }
      } else {
        console.log(`🔍 Would generate: ${path.relative(process.cwd(), filePath)}`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Error writing ${filePath}:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Generate webhook configuration
   */
  generateWebhookConfig() {
    const timestamp = new Date().toISOString();
    const webhookSecret = crypto.randomBytes(32).toString('hex');
    
    const config = {
      generated: timestamp,
      webhook: {
        url: `${this.options.baseUrl}/api/webhooks/isr`,
        secret: webhookSecret,
        events: ['content.update', 'asset.update', 'build.complete'],
        headers: {
          'X-Webhook-Signature': 'sha256',
          'X-Webhook-Timestamp': timestamp
        }
      },
      triggers: [
        {
          name: 'content-update',
          description: 'Triggered when copywriting.json is updated',
          payload: {
            event: 'content.update',
            timestamp: timestamp,
            pages: ['all']
          }
        },
        {
          name: 'asset-update',
          description: 'Triggered when assets are updated',
          payload: {
            event: 'asset.update',
            timestamp: timestamp,
            pages: ['/projects']
          }
        },
        {
          name: 'build-complete',
          description: 'Triggered after successful build',
          payload: {
            event: 'build.complete',
            timestamp: timestamp,
            pages: ['all']
          }
        }
      ]
    };

    const configPath = path.join(this.options.outputDir, 'webhook-config.json');
    return this.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Run all ISR generation tasks
   */
  async run() {
    console.log('🔄 Starting ISR trigger generation...');
    console.log(`📁 Output directory: ${this.options.outputDir}`);
    console.log(`🌐 Base URL: ${this.options.baseUrl}`);
    console.log(`📄 Pages: ${this.options.all ? 'all' : this.options.pages.join(', ')}`);
    console.log(`🧪 Dry run: ${this.options.dryRun}`);
    console.log('');

    const tasks = [
      { name: 'ISR Manifest', fn: () => this.generateISRManifest() },
      { name: 'Revalidation Endpoints', fn: () => this.generateRevalidationEndpoints() },
      { name: 'Cache Invalidation Rules', fn: () => this.generateCacheInvalidationRules() },
      { name: 'ISR Status', fn: () => this.generateISRStatus() },
      { name: 'Webhook Config', fn: () => this.generateWebhookConfig() }
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
    console.log('📊 ISR Generation Summary:');
    console.log('='.repeat(50));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📄 Pages processed: ${this.stats.pagesProcessed}`);
    console.log(`🔑 Tokens generated: ${this.stats.tokensGenerated}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    console.log('');

    if (this.stats.errors > 0) {
      console.log('⚠️  Some tasks failed. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('🎉 All ISR generation tasks completed successfully!');
      console.log('🚀 Ready for ISR deployment!');
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
      case '--pages':
        options.pages = args[++i];
        break;
      case '--all':
        options.all = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        console.log(`
ISR (Incremental Static Regeneration) Trigger Script

Usage: node isr-trigger.js [options]

Options:
  --output <dir>       Output directory (default: public)
  --base-url <url>     Base URL for revalidation (default: https://paludevhouse.id)
  --pages <pages>      Comma-separated list of pages to revalidate
  --all               Revalidate all pages
  --dry-run           Show what would be generated without creating files
  --verbose           Show detailed output
  --help              Show this help message

Generated Files:
  - isr-manifest.json
  - revalidation-endpoints.json
  - cache-invalidation-rules.json
  - isr-status.json
  - webhook-config.json

Examples:
  node isr-trigger.js --all
  node isr-trigger.js --pages "/,/projects,/articles"
  node isr-trigger.js --dry-run --verbose
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
  const trigger = new ISRTrigger(options);
  
  try {
    await trigger.run();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ISRTrigger;
