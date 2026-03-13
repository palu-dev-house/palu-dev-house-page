'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StatusData {
  timestamp: string;
  status: number;
  message: string;
  details?: any;
  duration?: number;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

const statusCodes = {
  200: { code: 200, message: 'OK', type: 'success', color: 'green' },
  201: { code: 201, message: 'Created', type: 'success', color: 'green' },
  204: { code: 204, message: 'No Content', type: 'success', color: 'green' },
  400: { code: 400, message: 'Bad Request', type: 'client', color: 'yellow' },
  401: { code: 401, message: 'Unauthorized', type: 'auth', color: 'red' },
  403: { code: 403, message: 'Forbidden', type: 'security', color: 'red' },
  404: { code: 404, message: 'Not Found', type: 'client', color: 'yellow' },
  405: { code: 405, message: 'Method Not Allowed', type: 'client', color: 'yellow' },
  429: { code: 429, message: 'Too Many Requests', type: 'security', color: 'orange' },
  500: { code: 500, message: 'Internal Server Error', type: 'server', color: 'red' },
  502: { code: 502, message: 'Bad Gateway', type: 'server', color: 'red' },
  503: { code: 503, message: 'Service Unavailable', type: 'server', color: 'orange' }
};

export default function StatusControl() {
  const router = useRouter();
  const [statusHistory, setStatusHistory] = useState<StatusData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Load status from localStorage on mount
  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      const saved = localStorage.getItem('statusHistory');
      if (saved) {
        try {
          setStatusHistory(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load status history:', e);
        }
      }
    }, 0);
    
    return () => clearTimeout(loadTimeout);
  }, []);

  // Save status to localStorage when updated
  const saveStatus = (status: StatusData) => {
    const updated = [status, ...statusHistory.slice(0, 49)]; // Keep last 50
    setStatusHistory(updated);
    localStorage.setItem('statusHistory', JSON.stringify(updated));
  };

  // Test API endpoints
  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`/api/${endpoint}`, options);
      const data = await response.json();
      
      const status: StatusData = {
        timestamp: new Date().toISOString(),
        status: response.status || 200,
        message: data?.error || 'Success',
        details: data,
        duration: Date.now() - startTime
      };

      saveStatus(status);
      return status;
    } catch (error) {
      const status: StatusData = {
        timestamp: new Date().toISOString(),
        status: 0,
        message: (error as Error)?.message || 'Unknown error',
        details: (error as Error)?.message,
        duration: Date.now() - startTime
      };
      
      saveStatus(status);
      return status;
    }
  };

  const clearHistory = () => {
    setStatusHistory([]);
    localStorage.removeItem('statusHistory');
  };

  const getStatusColor = (status: number) => {
    const statusInfo = Object.values(statusCodes).find(s => s.code === status);
    return statusInfo?.color || 'gray';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">API Status Control</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isMonitoring 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              <button
                onClick={clearHistory}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Status Code Reference */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">HTTP Status Code Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(statusCodes).map(([code, info]) => (
                <div 
                  key={code}
                  className={`border rounded-lg p-4 ${
                    info.type === 'success' ? 'border-green-200 bg-green-50' :
                    info.type === 'client' ? 'border-yellow-200 bg-yellow-50' :
                    info.type === 'auth' ? 'border-red-200 bg-red-50' :
                    info.type === 'security' ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span 
                      className={`inline-block w-12 h-12 rounded text-white font-mono text-sm font-bold ${
                        info.color === 'green' ? 'bg-green-600' :
                        info.color === 'yellow' ? 'bg-yellow-600' :
                        info.color === 'red' ? 'bg-red-600' :
                        info.color === 'orange' ? 'bg-orange-600' :
                        'bg-gray-600'
                      }`}
                    >
                      {code}
                    </span>
                    <span className="ml-3 font-semibold text-gray-900">{info.message}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {info.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Test Controls */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Testing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Assets API</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => testEndpoint('assets')}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Test GET /api/assets
                  </button>
                  <button
                    onClick={() => testEndpoint('assets', 'POST', { action: 'invalidate', key: 'test' })}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Test POST /api/assets (invalidate)
                  </button>
                  <button
                    onClick={() => testEndpoint('assets', 'POST', { action: 'invalid' })}
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                  >
                    Test POST /api/assets (invalid)
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Revalidate API</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => testEndpoint('revalidate', 'POST', { secret: 'wrong-secret' })}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Test POST /api/revalidate (wrong secret)
                  </button>
                  <button
                    onClick={() => testEndpoint('revalidate', 'POST', { secret: 'palu-dev-house-secret', paths: ['/'] })}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Test POST /api/revalidate (valid)
                  </button>
                  <button
                    onClick={() => testEndpoint('revalidate', 'POST', { secret: 'palu-dev-house-secret', invalidateAll: true })}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Test POST /api/revalidate (invalidate all)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
            {statusHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No status history available. Test some API endpoints to see results.
              </div>
            ) : (
              <div className="space-y-2">
                {statusHistory.map((status, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${
                      status.status >= 400 ? 'border-red-200' :
                      status.status >= 300 ? 'border-yellow-200' :
                      'border-green-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span 
                          className={`inline-block w-16 h-8 rounded text-white font-mono text-xs font-bold ${
                            getStatusColor(status.status)
                          }`}
                        >
                          {status.status}
                        </span>
                        <span className="ml-3 font-semibold text-gray-900">
                          {Object.values(statusCodes).find(s => s.code === status.status)?.message || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    {status.message && (
                      <div className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Message:</span> {status.message}
                      </div>
                    )}
                    
                    {status.details && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Details:</span>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(status.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Duration: {formatDuration(status.duration || 0)}</span>
                      {status.rateLimit && (
                        <span className="ml-4">
                          Rate Limit: {status.rateLimit.remaining}/{100} remaining
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
