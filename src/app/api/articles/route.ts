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

// GET - Get all published articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    
    const db = await getDatabase();

    // Build query
    let query = 'SELECT * FROM articles WHERE status = ?';
    const params: any[] = ['published'];

    // Add filters
    if (featured === 'true') {
      query += ' AND featured = ?';
      params.push(1);
    }
    
    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%"${tag}"%`);
    }

    // Add ordering and pagination
    query += ' ORDER BY publishedAt DESC, featured DESC';
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const articles = await db.all(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM articles WHERE status = ?';
    const countParams: any[] = ['published'];
    
    if (featured === 'true') {
      countQuery += ' AND featured = ?';
      countParams.push(1);
    }
    
    if (tag) {
      countQuery += ' AND tags LIKE ?';
      countParams.push(`%"${tag}"%`);
    }
    
    const countResult = await db.get(countQuery, countParams);
    const total = countResult.total;

    // Parse JSON fields
    const parsedArticles = articles.map((article: any) => ({
      ...article,
      tags: parseValue(article.tags, 'json'),
      featured: Boolean(article.featured),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: parsedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
