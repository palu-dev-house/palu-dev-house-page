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

// GET - Get single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    
    // Find project by slug
    const project = await db.get('SELECT * FROM projects WHERE slug = ?', [slug]);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only return active projects
    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedProject: Project = {
      ...project,
      technologies: parseValue(project.technologies, 'json'),
      images: parseValue(project.images, 'json'),
      featured: Boolean(project.featured),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: parsedProject
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
