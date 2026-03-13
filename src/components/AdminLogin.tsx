'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOTPInput } from '@/components/ui/Input';

interface AdminSession {
  token: string;
  loginAt: number;
  expiresAt: number;
}

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const router = useRouter();

  // Get TOTP issuer from environment
  const totpIssuer = process.env.NEXT_PUBLIC_ADMIN_TOTP_ISSUER || 'Palu Dev House Admin';

  // Add debug info
  const addDebug = (message: string) => {
    console.log('🔐 Admin Login Debug:', message);
    setDebugInfo(prev => {
      const newDebug = [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`];
      return newDebug;
    });
  };

  // Check if already logged in
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          
          // Check if session is still valid
          if (session.expiresAt > Date.now()) {
            addDebug('Valid session found, redirecting to admin...');
            router.push('/admin/dashboard');
            return;
          } else {
            addDebug('Session expired, clearing...');
            localStorage.removeItem('adminSession');
          }
        }
        addDebug('No existing session found');
      } catch (error) {
        addDebug('Error checking session: ' + error);
        localStorage.removeItem('adminSession');
      }
    };

    checkExistingSession();
  }, [router]);

  // Handle login with TOTP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter TOTP code');
      return;
    }

    if (code.length !== 6) {
      setError('TOTP code must be 6 digits');
      return;
    }

    setLoading(true);
    setError(null);
    addDebug(`Attempting admin login with TOTP: ${code}`);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
        }),
      });

      const data = await response.json();
      addDebug(`Login response: ${JSON.stringify(data)}`);

      if (data.success && data.token) {
        // Store session
        const session: AdminSession = {
          token: data.token,
          loginAt: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        };

        localStorage.setItem('adminSession', JSON.stringify(session));
        addDebug('Session stored, redirecting to admin...');
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid TOTP code');
        addDebug(`Login failed: ${data.error}`);
      }
    } catch (error) {
      addDebug(`Login error: ${error}`);
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">🔐 Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter TOTP code to access admin panel</p>
          </div>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-900">🔍 Debug Info:</h3>
            </div>
            <div className="space-y-1">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-blue-700">{info}</div>
              ))}
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Authentication Instructions */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <h3 className="font-semibold mb-2">📱 Authentication Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Open Google Authenticator app</li>
              <li>Use the configured {totpIssuer} account</li>
              <li>Enter the 6-digit code below</li>
              <li>Session will last for 24 hours</li>
            </ol>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <TOTPInput
              value={code}
              onChange={setCode}
              error={error || undefined}
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Login with TOTP'
              )}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <h4 className="font-semibold mb-2">📋 Login Instructions:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use Google Authenticator with admin secret</li>
                <li>Enter 6-digit TOTP code</li>
                <li>Session will last for 24 hours</li>
                <li>No email or password required</li>
                <li>Invalid sessions will be automatically cleared</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
