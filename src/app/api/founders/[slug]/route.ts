import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  skills: string[];
  experience: string;
  education: string;
  isActive: boolean;
  orderIndex: number;
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

// GET - Get single founder by slug/name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    
    // Find founder by slug (we'll use name as slug for now)
    const founder = await db.get(`
      SELECT * FROM copywriting 
      WHERE section = 'founders' AND key = ? AND isActive = 1
    `, [slug]);

    if (!founder) {
      return NextResponse.json(
        { error: 'Founder not found' },
        { status: 404 }
      );
    }

    // Parse the founder data from JSON value
    const founderData = parseValue(founder.value, 'json');
    
    // Ensure the founder data has the required structure
    const parsedFounder: Founder = {
      id: founder.id,
      name: founderData.name || slug,
      role: founderData.role || '',
      bio: founderData.bio || '',
      image: founderData.image || '',
      socialLinks: founderData.socialLinks || {},
      skills: founderData.skills || [],
      experience: founderData.experience || '',
      education: founderData.education || '',
      isActive: Boolean(founder.isActive),
      orderIndex: founder.order_index || 0,
      createdAt: founder.createdAt,
      updatedAt: founder.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: parsedFounder
    });

  } catch (error) {
    console.error('Error fetching founder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch founder' },
      { status: 500 }
    );
  }
}
