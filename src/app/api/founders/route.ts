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

// GET - Get all active founders
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get all active founders from copywriting table
    const founders = await db.all(`
      SELECT * FROM copywriting 
      WHERE section = 'founders' AND isActive = 1
      ORDER BY order_index ASC
    `);

    // Parse the founder data from JSON values
    const parsedFounders = founders.map((founder: any) => {
      const founderData = parseValue(founder.value, 'json');
      return {
        id: founder.id,
        name: founderData.name || founder.key,
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
    });

    return NextResponse.json({
      success: true,
      data: parsedFounders
    });

  } catch (error) {
    console.error('Error fetching founders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch founders' },
      { status: 500 }
    );
  }
}
