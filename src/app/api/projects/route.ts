import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  featured: boolean;
  technologies: string[];
  images: string[];
  status: string;
  slug: string;
  demoUrl: string;
  githubUrl: string;
  client: string;
  completedAt: string;
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

// GET - Get all active projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    
    const db = await getDatabase();

    // Build query
    let query = 'SELECT * FROM projects WHERE status = ?';
    const params: any[] = ['active'];

    // Add filters
    if (featured === 'true') {
      query += ' AND featured = ?';
      params.push(1);
    }
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    // Add ordering and pagination
    query += ' ORDER BY featured DESC, completedAt DESC, createdAt DESC';
    
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const projects = await db.all(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM projects WHERE status = ?';
    const countParams: any[] = ['active'];
    
    if (featured === 'true') {
      countQuery += ' AND featured = ?';
      countParams.push(1);
    }
    
    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }
    
    const countResult = await db.get(countQuery, countParams);
    const total = countResult.total;

    // Parse JSON fields
    const parsedProjects = projects.map((project: any) => ({
      ...project,
      technologies: parseValue(project.technologies, 'json'),
      images: parseValue(project.images, 'json'),
      featured: Boolean(project.featured),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: parsedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
