import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import { generateToken, addToken, removeToken, validateToken, cleanExpiredTokens, activeTokens } from "@/lib/admin-tokens";

// Admin TOTP secret from environment — must be set in .env.local
const ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET;

// Validate TOTP secret exists
if (!ADMIN_TOTP_SECRET) {
  console.error("❌ ADMIN_TOTP_SECRET environment variable is not set");
  throw new Error("ADMIN_TOTP_SECRET environment variable is required");
}

// POST - Login with TOTP
export async function POST(request: NextRequest) {
  try {
    // Clean expired tokens
    cleanExpiredTokens();

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "TOTP code is required" },
        { status: 400 },
      );
    }

    // Validate TOTP code format
    if (!/^\d{6}$/.test(code)) {
      console.log("❌ Admin login failed - invalid TOTP format");
      return NextResponse.json(
        { error: "Invalid TOTP code format" },
        { status: 400 },
      );
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: ADMIN_TOTP_SECRET!,
      encoding: "base32",
      token: code,
      window: 2, // Allow 2 steps before/after for clock drift
    });

    if (!verified) {
      console.log("❌ Admin login failed - invalid TOTP code");
      return NextResponse.json({ error: "Invalid TOTP code" }, { status: 401 });
    }

    // Generate token
    const token = generateToken();

    // Store token using shared function
    addToken(token, 24); // 24 hours

    console.log("✅ Admin login successful with TOTP");

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: "admin@paludevhouse.site",
        name: "Admin User",
        role: "admin",
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET - Validate token
export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Validate token using shared function
    const isValid = validateToken(token);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: "admin@paludevhouse.site",
        name: "Admin User",
        role: "admin",
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Logout
export async function DELETE(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Remove token using shared function
    removeToken(token);
    console.log("✅ Admin logout successful");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
