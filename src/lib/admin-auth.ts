import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from './admin-tokens';

// Middleware to check admin authentication
export async function checkAdminAuth(request: NextRequest): Promise<{ success: boolean; error?: string }> {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, error: "No token provided" };
    }

    const token = authHeader.substring(7);

    // Validate token using shared storage
    const isValid = validateToken(token);

    if (!isValid) {
      return { success: false, error: "Invalid or expired token" };
    }

    return { success: true };
  } catch (error) {
    console.error("Auth check error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// Helper to create authenticated response
export function createAuthErrorResponse(error: string) {
  return NextResponse.json(
    { error },
    { status: 401 }
  );
}
