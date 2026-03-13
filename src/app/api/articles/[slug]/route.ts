import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  url: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Helper functions
function parseValue(value: string, type: string): any {
  if (type === 'json' || type === 'array') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

// GET - Get single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    
    // Find article by slug (extracted from URL field)
    const article = await db.get(`
      SELECT * FROM articles 
      WHERE url LIKE '%/${slug}' OR url = ? OR url LIKE '%/${slug}/%'
      LIMIT 1
    `, [slug]);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Only return published articles
    if (article.status !== 'published') {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedArticle: Article = {
      ...article,
      tags: parseValue(article.tags, 'json'),
      featured: Boolean(article.featured),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: parsedArticle
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
