import { NextRequest, NextResponse } from 'next/server';

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

// Mock data for build time
const mockProjects: Project[] = [
  {
    id: 'project_1',
    title: 'Sample Project',
    description: 'Sample description',
    type: 'SaaS',
    featured: true,
    technologies: ['React', 'Node.js'],
    images: ['/images/project.jpg'],
    status: 'active',
    slug: 'sample-project',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example',
    client: 'Sample Client',
    completedAt: '2024-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

// Helper functions
function parseTechnologies(techString: string): string[] {
  try {
    return JSON.parse(techString);
  } catch {
    return [];
  }
}

function stringifyTechnologies(tech: string[]): string {
  return JSON.stringify(tech);
}

function parseImages(imagesString: string): string[] {
  try {
    return JSON.parse(imagesString);
  } catch {
    return [];
  }
}

function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}

// GET - Get specific project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update specific project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Update project (mock)
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const deletedProject = mockProjects[projectIndex];
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      project: deletedProject
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
