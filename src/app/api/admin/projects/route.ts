import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkAdminAuth, createAuthErrorResponse } from '@/lib/admin-auth';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'SaaS' | 'Tools' | 'Enterprise' | 'Custom';
  featured: boolean;
  technologies: string[];
  images: string[];
  founders: string[];
  status: 'active' | 'inactive' | 'development';
  createdAt: string;
  updatedAt: string;
}

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Helper functions
function readProjects(): Project[] {
  try {
    if (!fs.existsSync(PROJECTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

function writeProjects(projects: Project[]): void {
  try {
    const dir = path.dirname(PROJECTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing projects:', error);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET - Get all projects
export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await checkAdminAuth(request);
  if (!auth.success) {
    return createAuthErrorResponse(auth.error!);
  }

  try {
    const projects = readProjects();
    return NextResponse.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  // Check authentication
  const auth = await checkAdminAuth(request);
  if (!auth.success) {
    return createAuthErrorResponse(auth.error!);
  }

  try {
    const body = await request.json();
    const { title, description, type, featured, technologies, images, founders, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const projects = readProjects();
    const newProject: Project = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      type: type || 'Tools',
      featured: featured || false,
      technologies: technologies || [],
      images: images || [],
      founders: founders || [],
      status: status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    writeProjects(projects);

    return NextResponse.json({
      success: true,
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  // Check authentication
  const auth = await checkAdminAuth(request);
  if (!auth.success) {
    return createAuthErrorResponse(auth.error!);
  }

  try {
    const body = await request.json();
    const { id, title, description, type, featured, technologies, images, founders, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject: Project = {
      ...projects[projectIndex],
      title: title?.trim() || projects[projectIndex].title,
      description: description?.trim() || projects[projectIndex].description,
      type: type || projects[projectIndex].type,
      featured: featured !== undefined ? featured : projects[projectIndex].featured,
      technologies: technologies || projects[projectIndex].technologies,
      images: images || projects[projectIndex].images,
      founders: founders || projects[projectIndex].founders,
      status: status || projects[projectIndex].status,
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    writeProjects(projects);

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

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  // Check authentication
  const auth = await checkAdminAuth(request);
  if (!auth.success) {
    return createAuthErrorResponse(auth.error!);
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const deletedProject = projects[projectIndex];
    projects.splice(projectIndex, 1);
    writeProjects(projects);

    return NextResponse.json({
      success: true,
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
