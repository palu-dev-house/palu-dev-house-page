import crypto from 'crypto';

// Shared token storage for admin authentication
export const activeTokens = new Map<
  string,
  {
    issuedAt: number;
    expiresAt: number;
  }
>();

// Generate JWT-like token
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Clean expired tokens
export function cleanExpiredTokens(): void {
  const now = Date.now();
  for (const [token, data] of activeTokens.entries()) {
    if (data.expiresAt < now) {
      activeTokens.delete(token);
      console.log("🧹 Cleaned expired admin token");
    }
  }
}

// Validate token
export function validateToken(token: string): boolean {
  cleanExpiredTokens();
  
  const tokenData = activeTokens.get(token);
  
  if (!tokenData) {
    return false;
  }
  
  // Check if token is expired
  if (tokenData.expiresAt < Date.now()) {
    activeTokens.delete(token);
    return false;
  }
  
  return true;
}

// Add token (for login)
export function addToken(token: string, expiresInHours: number = 24): void {
  const now = Date.now();
  activeTokens.set(token, {
    issuedAt: now,
    expiresAt: now + (expiresInHours * 60 * 60 * 1000), // Convert hours to milliseconds
  });
}

// Remove token (for logout)
export function removeToken(token: string): void {
  activeTokens.delete(token);
}
