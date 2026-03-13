import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'palu-dev-house-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// TOTP configuration
const TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || 'palu-dev-house-secret';

// Mock user data (in production, this would come from database)
const ADMIN_USER = {
  id: 'admin_1',
  email: 'admin@paludevhouse.site',
  role: 'admin',
  name: 'Admin User'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { totpCode } = body;

    // Validate TOTP code
    if (!totpCode || typeof totpCode !== 'string') {
      return NextResponse.json(
        { error: 'TOTP code is required' },
        { status: 400 }
      );
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: TOTP_SECRET,
      encoding: 'base32',
      token: totpCode,
      window: 2, // Allow 2 steps before/after for clock drift
      time: Math.floor(Date.now() / 1000)
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid TOTP code' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const now = Math.floor(Date.now() / 1000);
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: ADMIN_USER.id,
      email: ADMIN_USER.email,
      role: ADMIN_USER.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as string,
      issuer: 'palu-dev-house',
      audience: 'palu-dev-house-api'
    } as jwt.SignOptions);

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    const response = NextResponse.json({
      success: true,
      message: 'JWT token generated successfully',
      token: token,
      user: {
        id: ADMIN_USER.id,
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
        role: ADMIN_USER.role
      },
      expiresIn: JWT_EXPIRES_IN,
      issuedAt: new Date(now * 1000).toISOString()
    });

    // Set cookie
    response.cookies.set('auth-token', token, cookieOptions);

    return response;

  } catch (error) {
    console.error('Error generating JWT token:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWT token' },
      { status: 500 }
    );
  }
}

// GET endpoint to validate current token
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    return NextResponse.json({
      success: true,
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error validating JWT token:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

// DELETE endpoint to logout (clear cookie)
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });

    return response;

  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
