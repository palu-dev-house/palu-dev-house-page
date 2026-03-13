import { Metadata } from 'next';

export const siteConfig = {
  name: 'Palu Dev House',
  description: 'Tech House dari Indonesia yang membangun tools dan aplikasi SaaS untuk membantu bisnis dan menyebarkan penggunaan teknologi di seluruh Indonesia.',
  url: 'https://paludevhouse.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/paludevhouse',
    github: 'https://github.com/paludevhouse',
    linkedin: 'https://linkedin.com/company/palu-dev-house'
  }
};

export type SiteConfig = typeof siteConfig;

// Metadata for pages that should NOT be indexed
export const noIndexMetadata: Partial<Metadata> = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': 'none',
      'max-image-preview': 'none',
      'max-snippet': 0,
    },
  },
  other: {
    'google-site-verification': 'noindex',
  },
};

export function generateMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: [
      'tech house',
      'software development',
      'Indonesia',
      'SaaS',
      'tools',
      'applications',
      'technology',
      'Palu Dev House',
      'developer tools',
      'business solutions',
      'digital transformation',
      'Indonesian tech'
    ],
    authors: [{ name: 'Palu Dev House' }],
    creator: 'Palu Dev House',
    publisher: 'Palu Dev House',
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Tech House dari Indonesia`
        }
      ]
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@paludevhouse',
      site: '@paludevhouse'
    },
    
    // Robots and indexing
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        ...(process.env.BING_VERIFICATION && { bing: process.env.BING_VERIFICATION })
      }
    },
    
    // Additional meta
    other: {
      'theme-color': '#2065A1',
      'msapplication-TileColor': '#2065A1',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': siteConfig.name,
      'application-name': siteConfig.name,
      'msapplication-config': '/browserconfig.xml'
    }
  };
}

// Helper function to create metadata for private/admin pages
export function generatePrivateMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const baseMeta = generateMetadata();
  return {
    ...baseMeta,
    ...noIndexMetadata,
    ...overrides,
  };
}

// Page-specific metadata
export const pageMetadata = {
  home: generateMetadata(),
  
  projects: {
    ...generateMetadata(),
    title: 'Projects',
    description: 'Browse our portfolio of software development projects including web applications, mobile apps, and custom solutions.',
  },
  
  articles: {
    ...generateMetadata(),
    title: 'Articles',
    description: 'Read articles about software development, technology trends, and industry insights from Palu Dev House.',
  },
  
  founders: {
    ...generateMetadata(),
    title: 'Founders',
    description: 'Meet the founders of Palu Dev House and learn about our journey in software development.',
  },
  
  // Admin and sensitive pages
  admin: generatePrivateMetadata({
    title: 'Admin Dashboard',
    description: 'Admin dashboard for managing content and settings.',
  }),
  
  docs: generatePrivateMetadata({
    title: 'API Documentation',
    description: 'Internal API documentation for developers.',
  }),
  
  tools: generatePrivateMetadata({
    title: 'Developer Tools',
    description: 'Internal developer tools and utilities.',
  }),
  
  login: generatePrivateMetadata({
    title: 'Admin Login',
    description: 'Secure login for administrators.',
  }),
};
