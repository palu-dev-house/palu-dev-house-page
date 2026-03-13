import { z } from 'zod';

// Common schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
});

// Article schemas
export const ArticleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required').default('Ferdy'),
  publishedAt: z.string().min(1, 'Published date is required'),
  readTime: z.string().min(1, 'Read time is required').default('5 min'),
  url: z.string().url('Invalid URL format'),
  tags: z.array(z.string()).default([]),
  featured: z.coerce.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  image: z.string().default('')
});

export const ArticleUpdateSchema = ArticleCreateSchema.partial().extend({
  id: z.string().min(1, 'Article ID is required')
});

export const ArticleParamsSchema = z.object({
  id: z.string().min(1, 'Article ID is required')
});

// Project schemas
export const ProjectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['Tools', 'SaaS', 'Enterprise', 'Custom', 'Mobile']).default('Tools'),
  featured: z.coerce.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  status: z.enum(['active', 'inactive', 'development', 'archived']).default('active'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  demoUrl: z.string().url('Invalid demo URL').optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  client: z.string().default(''),
  completedAt: z.string().optional()
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial().extend({
  id: z.string().min(1, 'Project ID is required')
});

export const ProjectParamsSchema = z.object({
  id: z.string().min(1, 'Project ID is required')
});

// Copywriting schemas
export const CopywritingUpdateSchema = z.object({
  landingPage: z.object({
    hero: z.object({
      title: z.string().min(1, 'Hero title is required'),
      subtitle: z.string().min(1, 'Hero subtitle is required'),
      description: z.string().min(1, 'Hero description is required'),
      ctaPrimary: z.string().min(1, 'Primary CTA is required'),
      ctaSecondary: z.string().min(1, 'Secondary CTA is required'),
      stats: z.array(z.object({
        value: z.string().min(1, 'Stat value is required'),
        label: z.string().min(1, 'Stat label is required')
      })).default([])
    }),
    story: z.object({
      title: z.string().min(1, 'Story title is required'),
      content: z.array(z.string().min(1, 'Story content is required')).default([])
    }),
    about: z.object({
      title: z.string().min(1, 'About title is required'),
      subtitle: z.string().min(1, 'About subtitle is required'),
      origin: z.object({
        title: z.string().min(1, 'Origin title is required'),
        content: z.string().min(1, 'Origin content is required')
      }),
      background: z.object({
        title: z.string().min(1, 'Background title is required'),
        content: z.string().min(1, 'Background content is required')
      }),
      mission: z.object({
        title: z.string().min(1, 'Mission title is required'),
        content: z.string().min(1, 'Mission content is required')
      })
    }),
    philosophy: z.object({
      title: z.string().min(1, 'Philosophy title is required'),
      subtitle: z.string().min(1, 'Philosophy subtitle is required'),
      items: z.array(z.object({
        title: z.string().min(1, 'Item title is required'),
        description: z.string().min(1, 'Item description is required')
      })).default([])
    }),
    focus: z.object({
      title: z.string().min(1, 'Focus title is required'),
      subtitle: z.string().min(1, 'Focus subtitle is required'),
      items: z.array(z.object({
        title: z.string().min(1, 'Item title is required'),
        description: z.string().min(1, 'Item description is required'),
        examples: z.array(z.string()).default([])
      })).default([])
    }),
    founders: z.object({
      title: z.string().min(1, 'Founders title is required'),
      subtitle: z.string().min(1, 'Founders subtitle is required'),
      items: z.array(z.object({
        name: z.string().min(1, 'Founder name is required'),
        location: z.string().min(1, 'Founder location is required'),
        image: z.string().min(1, 'Founder image is required'),
        background: z.array(z.string()).default([]),
        experience: z.string().min(1, 'Founder experience is required'),
        website: z.string().url().optional(),
        medium: z.string().url().optional(),
        social: z.object({
          linkedin: z.string().url().optional(),
          github: z.string().url().optional(),
          twitter: z.string().url().optional()
        }).default({})
      })).default([])
    }),
    projects: z.object({
      title: z.string().min(1, 'Projects title is required'),
      subtitle: z.string().min(1, 'Projects subtitle is required'),
      viewAll: z.string().min(1, 'View all text is required')
    }),
    articles: z.object({
      title: z.string().min(1, 'Articles title is required'),
      subtitle: z.string().min(1, 'Articles subtitle is required'),
      viewAll: z.string().min(1, 'View all text is required'),
      medium: z.array(z.object({
        author: z.string().min(1, 'Author name is required'),
        mediumProfile: z.string().url('Invalid Medium profile URL'),
        articles: z.array(z.object({
          title: z.string().min(1, 'Article title is required'),
          excerpt: z.string().min(1, 'Article excerpt is required'),
          url: z.string().url('Invalid article URL'),
          publishedAt: z.string().min(1, 'Published date is required'),
          readTime: z.string().min(1, 'Read time is required')
        })).default([])
      })).default([])
    }),
    contact: z.object({
      title: z.string().min(1, 'Contact title is required'),
      subtitle: z.string().min(1, 'Contact subtitle is required'),
      email: z.string().email('Invalid email format').min(1, 'Email is required'),
      phone: z.string().min(1, 'Phone is required'),
      location: z.string().min(1, 'Location is required')
    })
  }),
  meta: z.object({
    version: z.number().default(1),
    lastUpdated: z.string().optional(),
    updatedBy: z.string().default('system')
  }).default({
    version: 1,
    updatedBy: 'system'
  })
});

// Revalidation schemas
export const RevalidationSchema = z.object({
  secret: z.string().min(1, 'Secret is required'),
  paths: z.array(z.string().min(1, 'Path is required')).optional(),
  tags: z.array(z.string().min(1, 'Tag is required')).optional(),
  invalidateAll: z.boolean().default(false)
});

// Authentication schemas
export const TOTPAuthSchema = z.object({
  totpCode: z.string().length(6, 'TOTP code must be exactly 6 digits').regex(/^\d+$/, 'TOTP code must contain only numbers')
});

export const JWTResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.string()
  }).optional(),
  expiresIn: z.string().optional(),
  issuedAt: z.string().optional()
});

// Database backup schemas
export const BackupCreateSchema = z.object({
  backup: z.any(), // Backup data can be any structure
  overwrite: z.boolean().default(false)
});

export const BackupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  filename: z.string().optional(),
  backup: z.any().optional(),
  restored: z.object({
    articles: z.number(),
    projects: z.number(),
    copywriting: z.number()
  }).optional(),
  downloadUrl: z.string().optional()
});

// Asset schemas
export const AssetQuerySchema = z.object({
  type: z.enum(['images', 'videos', 'documents']).optional(),
  category: z.string().optional(),
  search: z.string().optional()
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  }).optional()
});

// Export all schemas for easy importing
export const schemas = {
  PaginationSchema,
  ArticleCreateSchema,
  ArticleUpdateSchema,
  ArticleParamsSchema,
  ProjectCreateSchema,
  ProjectUpdateSchema,
  ProjectParamsSchema,
  CopywritingUpdateSchema,
  RevalidationSchema,
  TOTPAuthSchema,
  JWTResponseSchema,
  BackupCreateSchema,
  BackupResponseSchema,
  AssetQuerySchema,
  ApiResponseSchema
};

// Type exports
export type Pagination = z.infer<typeof PaginationSchema>;
export type ArticleCreate = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdate = z.infer<typeof ArticleUpdateSchema>;
export type ArticleParams = z.infer<typeof ArticleParamsSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectParams = z.infer<typeof ProjectParamsSchema>;
export type CopywritingUpdate = z.infer<typeof CopywritingUpdateSchema>;
export type Revalidation = z.infer<typeof RevalidationSchema>;
export type TOTPAuth = z.infer<typeof TOTPAuthSchema>;
export type JWTResponse = z.infer<typeof JWTResponseSchema>;
export type BackupCreate = z.infer<typeof BackupCreateSchema>;
export type BackupResponse = z.infer<typeof BackupResponseSchema>;
export type AssetQuery = z.infer<typeof AssetQuerySchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
