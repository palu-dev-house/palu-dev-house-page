/**
 * API Documentation Generator for Prebuild
 * 
 * This script automatically generates comprehensive API documentation
 * by scanning all API routes and extracting metadata.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_DIR = path.join(process.cwd(), 'src', 'app', 'api');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'docs', 'api');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'documentation.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// API route patterns to scan
const API_PATTERNS = [
  '**/route.ts',
  '**/route.js'
];

// Extract parameters from function signatures
function extractApiInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(path.join(process.cwd(), 'src', 'app'), filePath);
    
    // Parse route path
    const routePath = '/' + relativePath.replace(/\\/g, '/').replace(/\/route\.(ts|js)$/, '');
    
    // Extract HTTP methods
    const methods = [];
    if (content.includes('export async function GET')) methods.push('GET');
    if (content.includes('export async function POST')) methods.push('POST');
    if (content.includes('export async function PUT')) methods.push('PUT');
    if (content.includes('export async function DELETE')) methods.push('DELETE');
    if (content.includes('export async function PATCH')) methods.push('PATCH');
    
    // Extract description from comments
    let description = '';
    const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^*]+)\s*\n\s*\*\//);
    if (descriptionMatch) {
      description = descriptionMatch[1].trim();
    }

    // Extract request body examples from the code
    const requestBodies = [];
    const bodyExamples = [];
    
    // Look for JSON examples in the code
    const jsonExampleMatches = content.matchAll(/```json\s*\n([\s\S]*?)\n```/g);
    for (const match of jsonExampleMatches) {
      try {
        const example = JSON.parse(match[1]);
        bodyExamples.push({
          type: 'application/json',
          example: example,
          description: 'Request body example'
        });
      } catch (e) {
        // Invalid JSON, skip
      }
    }

    // Look for body structure in POST/PUT functions
    if (content.includes('export async function POST') || content.includes('export async function PUT')) {
      // Extract body interface/type definitions
      const interfaceMatches = content.matchAll(/interface\s+(\w+)\s*{([^}]*)}/g);
      for (const match of interfaceMatches) {
        const interfaceName = match[1];
        const interfaceBody = match[2];
        const properties = extractInterfaceProperties(interfaceBody);
        
        if (properties.length > 0) {
          bodyExamples.push({
            type: 'application/json',
            schema: {
              type: 'object',
              properties: properties,
              required: properties.filter(p => p.required).map(p => p.name)
            },
            description: `${interfaceName} interface`
          });
        }
      }

      // Extract example usage from the code
      const exampleUsageMatches = content.matchAll(/const\s+(body|data)\s*=\s*({[^;]*})/g);
      for (const match of exampleUsageMatches) {
        try {
          const example = eval(`(${match[2]})`);
          bodyExamples.push({
            type: 'application/json',
            example: example,
            description: 'Example from code'
          });
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    }
    
    // Extract parameters from function signatures
    const parameters = [];
    
    // GET parameters
    if (content.includes('export async function GET')) {
      const getMatch = content.match(/export async function GET\(([^)]+)\)/);
      if (getMatch) {
        const params = getMatch[1].split(',').map(p => p.trim());
        parameters.push(...params.map(p => ({
          name: p.replace(/[{}]/g, '').trim(),
          type: 'parameter',
          location: 'query/request',
          description: `GET parameter: ${p}`
        })));
      }
    }
    
    // POST/PUT body parameters
    if (content.includes('export async function POST') || content.includes('export async function PUT')) {
      // Extract body validation
      const validationMatches = content.matchAll(/if\s*\(!body\.(\w+)\)/g);
      for (const match of validationMatches) {
        parameters.push({
          name: match[1],
          type: 'string | object',
          location: 'request body',
          required: true,
          description: `Required field: ${match[1]}`
        });
      }

      // Extract body destructuring
      const destructuringMatches = content.matchAll(/const\s*{([^}]*)}\s*=\s*body/g);
      for (const match of destructuringMatches) {
        const fields = match[1].split(',').map(f => f.trim());
        for (const field of fields) {
          const fieldName = field.split(':')[0].trim();
          if (fieldName) {
            parameters.push({
              name: fieldName,
              type: inferFieldType(fieldName, content),
              location: 'request body',
              required: true,
              description: `Body field: ${fieldName}`
            });
          }
        }
      }
    }
    
    // Extract path parameters
    const pathParams = [];
    const pathParamMatches = routePath.match(/\[([^\]]+)\]/g);
    if (pathParamMatches) {
      pathParamMatches.forEach(param => {
        const paramName = param.replace(/[{}[\]]/g, '');
        pathParams.push({
          name: paramName,
          type: 'string',
          location: 'path',
          required: true,
          description: `Path parameter: ${paramName}`
        });
      });
    }
    parameters.push(...pathParams);

    // Extract query parameters from searchParams usage
    const queryParamMatches = content.matchAll(/searchParams\.get\(['"]([^'"]+)['"]\)/g);
    for (const match of queryParamMatches) {
      const paramName = match[1];
      if (!parameters.find(p => p.name === paramName)) {
        parameters.push({
          name: paramName,
          type: 'string',
          location: 'query',
          required: false,
          description: `Query parameter: ${paramName}`
        });
      }
    }
    
    // Extract response examples
    const responses = [];
    
    // Success response
    if (content.includes('NextResponse.json')) {
      const successMatch = content.match(/NextResponse\.json\(([^)]+)\)/);
      if (successMatch) {
        try {
          const responseExample = eval(`(${successMatch[1]})`);
          responses.push({
            status: 200,
            description: 'Success response',
            example: responseExample,
            schema: generateSchemaFromExample(responseExample)
          });
        } catch (e) {
          responses.push({
            status: 200,
            description: 'Success response',
            example: { success: true, message: 'Operation completed successfully' }
          });
        }
      }
    }

    // Extract specific response patterns
    const responsePatterns = [
      { status: 201, pattern: /status:\s*201/, description: 'Created successfully' },
      { status: 204, pattern: /status:\s*204/, description: 'No content' },
      { status: 400, pattern: /status:\s*400/, description: 'Bad request', example: { error: 'Invalid request' } },
      { status: 401, pattern: /status:\s*401/, description: 'Unauthorized', example: { error: 'Unauthorized' } },
      { status: 403, pattern: /status:\s*403/, description: 'Forbidden', example: { error: 'Forbidden' } },
      { status: 404, pattern: /status:\s*404/, description: 'Not found', example: { error: 'Resource not found' } },
      { status: 409, pattern: /status:\s*409/, description: 'Conflict', example: { error: 'Resource already exists' } },
      { status: 422, pattern: /status:\s*422/, description: 'Unprocessable entity', example: { error: 'Validation failed' } },
      { status: 500, pattern: /status:\s*500/, description: 'Internal server error', example: { error: 'Internal server error' } }
    ];

    for (const pattern of responsePatterns) {
      if (content.match(pattern.pattern)) {
        const existingResponse = responses.find(r => r.status === pattern.status);
        if (!existingResponse) {
          responses.push({
            status: pattern.status,
            description: pattern.description,
            example: pattern.example || { success: false, error: pattern.description }
          });
        }
      }
    }
    
    // Extract authentication requirements
    let authentication = null;
    if (content.includes('REVALIDATE_SECRET') || content.includes('ADMIN_TOTP_SECRET') || content.includes('secret') || content.includes('JWT_SECRET')) {
      authentication = {
        type: 'API Key',
        description: 'Requires secret token for authentication',
        examples: {
          header: 'Authorization: Bearer <token>',
          body: '{ "secret": "your-secret-token" }'
        }
      };
    }

    // Extract tags/categories
    const tags = [];
    if (routePath.includes('/admin/')) tags.push('Admin');
    if (routePath.includes('/api/')) tags.push('API');
    if (routePath.includes('/copywriting')) tags.push('Copywriting');
    if (routePath.includes('/articles')) tags.push('Articles');
    if (routePath.includes('/projects')) tags.push('Projects');
    if (routePath.includes('/revalidate')) tags.push('ISR');
    if (routePath.includes('/assets')) tags.push('Assets');
    if (routePath.includes('/database')) tags.push('Database');
    if (routePath.includes('/auth')) tags.push('Authentication');
    
    return {
      path: routePath,
      methods,
      description,
      parameters,
      responses,
      requestBodies: bodyExamples,
      authentication,
      tags,
      file: relativePath,
      lastModified: fs.statSync(filePath).mtime.toISOString()
    };
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// Helper function to extract interface properties
function extractInterfaceProperties(interfaceBody) {
  const properties = [];
  const lines = interfaceBody.split('\n').map(line => line.trim()).filter(line => line);
  
  for (const line of lines) {
    const match = line.match(/(\w+)(\??):\s*([^;]+);?/);
    if (match) {
      const name = match[1];
      const optional = match[2] === '?';
      const type = match[3].trim();
      
      properties.push({
        name,
        type,
        required: !optional,
        description: `${name} field of type ${type}`
      });
    }
  }
  
  return properties;
}

// Helper function to infer field type
function inferFieldType(fieldName, content) {
  // Look for type hints in the code
  const typePatterns = [
    { field: 'title', type: 'string' },
    { field: 'description', type: 'string' },
    { field: 'content', type: 'string' },
    { field: 'email', type: 'string' },
    { field: 'password', type: 'string' },
    { field: 'url', type: 'string' },
    { field: 'slug', type: 'string' },
    { field: 'status', type: 'string' },
    { field: 'type', type: 'string' },
    { field: 'id', type: 'string' },
    { field: 'featured', type: 'boolean' },
    { field: 'active', type: 'boolean' },
    { field: 'published', type: 'boolean' },
    { field: 'order', type: 'number' },
    { field: 'index', type: 'number' },
    { field: 'count', type: 'number' },
    { field: 'page', type: 'number' },
    { field: 'limit', type: 'number' },
    { field: 'tags', type: 'array' },
    { field: 'items', type: 'array' },
    { field: 'data', type: 'object' },
    { field: 'metadata', type: 'object' }
  ];
  
  for (const pattern of typePatterns) {
    if (fieldName.toLowerCase().includes(pattern.field)) {
      return pattern.type;
    }
  }
  
  return 'string | object';
}

// Helper function to generate JSON schema from example
function generateSchemaFromExample(example) {
  if (typeof example !== 'object' || example === null) {
    return { type: typeof example };
  }
  
  const schema = {
    type: 'object',
    properties: {},
    required: []
  };
  
  for (const [key, value] of Object.entries(example)) {
    const propSchema = generateSchemaFromExample(value);
    schema.properties[key] = propSchema;
    
    // Consider common required fields
    if (['id', 'title', 'name', 'email'].includes(key)) {
      schema.required.push(key);
    }
  }
  
  return schema;
}

// Scan all API routes
function scanApiRoutes(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanApiRoutes(filePath, results);
    } else if (API_PATTERNS.some(pattern => filePath.includes(pattern.replace('**/', '')))) {
      const apiInfo = extractApiInfo(filePath);
      if (apiInfo) {
        results.push(apiInfo);
      }
    }
  }
  
  return results;
}

// Generate documentation
function generateDocumentation() {
  console.log('📚 Generating API documentation...');
  
  const apiRoutes = scanApiRoutes(API_DIR);
  
  // Group by category
  const categories = {
    'Admin': [],
    'Copywriting': [],
    'Articles': [],
    'Projects': [],
    'Assets': [],
    'Database': [],
    'ISR': [],
    'Other': []
  };
  
  apiRoutes.forEach(route => {
    let categorized = false;
    
    // Try to categorize by tags first
    for (const tag of route.tags) {
      if (categories[tag]) {
        categories[tag].push(route);
        categorized = true;
        break;
      }
    }
    
    // If not categorized by tags, try path-based categorization
    if (!categorized) {
      if (route.path.includes('/admin/')) {
        categories['Admin'].push(route);
      } else if (route.path.includes('/copywriting')) {
        categories['Copywriting'].push(route);
      } else if (route.path.includes('/articles')) {
        categories['Articles'].push(route);
      } else if (route.path.includes('/projects')) {
        categories['Projects'].push(route);
      } else if (route.path.includes('/assets')) {
        categories['Assets'].push(route);
      } else if (route.path.includes('/database')) {
        categories['Database'].push(route);
      } else if (route.path.includes('/revalidate')) {
        categories['ISR'].push(route);
      } else {
        categories['Other'].push(route);
      }
    }
  });
  
  // Sort routes within each category
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => a.path.localeCompare(b.path));
  });
  
  // Generate documentation object
  const documentation = {
    metadata: {
      title: 'Palu Dev House API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Palu Dev House website',
      generatedAt: new Date().toISOString(),
      totalRoutes: apiRoutes.length,
      totalCategories: Object.keys(categories).length
    },
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    categories,
    routes: apiRoutes,
    security: {
      authentication: {
        type: 'Secret Token',
        description: 'Some endpoints require a secret token for authentication',
        examples: {
          revalidate: 'REVALIDATE_SECRET or palu-dev-house-secret',
          admin: 'ADMIN_TOTP_SECRET or configured secret'
        }
      },
      rateLimit: {
        description: 'Rate limiting may be applied to prevent abuse',
        limits: {
          default: '100 requests per minute',
          revalidate: '10 requests per minute'
        }
      }
    },
    examples: {
      authentication: {
        curl: 'curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d \'{"secret": "palu-dev-house-secret"}\''
      },
      errorHandling: {
        commonErrors: {
          '400': 'Bad Request - Invalid input or missing parameters',
          '401': 'Unauthorized - Invalid or missing secret token',
          '404': 'Not Found - Resource does not exist',
          '500': 'Internal Server Error - Server error occurred'
        }
      }
    }
  };
  
  // Save documentation
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(documentation, null, 2));
  
  // Generate HTML documentation
  generateHtmlDocumentation(documentation);
  
  console.log(`✅ API documentation generated!`);
  console.log(`📊 Total routes: ${apiRoutes.length}`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  console.log(`🌐 HTML: ${path.join(OUTPUT_DIR, 'index.html')}`);
  
  return documentation;
}

// Generate HTML documentation
function generateHtmlDocumentation(docs) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docs.metadata.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-blue-600 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold">${docs.metadata.title}</h1>
                        <p class="text-blue-100 mt-1">${docs.metadata.description}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-blue-100">Version ${docs.metadata.version}</p>
                        <p class="text-xs text-blue-200">Generated: ${new Date(docs.metadata.generatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex space-x-8 overflow-x-auto py-4">
                    ${Object.keys(docs.categories).map(cat => `
                        <a href="#${cat.toLowerCase()}" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium whitespace-nowrap">
                            ${cat} (${docs.categories[cat].length})
                        </a>
                    `).join('')}
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Overview -->
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Base URL</h3>
                            <code class="text-sm bg-gray-100 px-2 py-1 rounded">${docs.baseUrl}</code>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Total Routes</h3>
                            <p class="text-2xl font-bold text-blue-600">${docs.metadata.totalRoutes}</p>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Categories</h3>
                            <p class="text-2xl font-bold text-blue-600">${docs.metadata.totalCategories}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Security -->
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Security</h2>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
                    <p class="text-gray-600 mb-4">${docs.security.authentication.description}</p>
                    <div class="bg-gray-50 rounded p-4">
                        <h4 class="font-semibold text-gray-900 mb-2">Examples:</h4>
                        <ul class="space-y-2 text-sm">
                            ${Object.entries(docs.security.authentication.examples).map(([key, value]) => `
                                <li><strong>${key}:</strong> <code class="bg-gray-100 px-2 py-1 rounded text-xs">${value}</code></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Categories -->
            ${Object.entries(docs.categories).map(([category, routes]) => `
                <section id="${category.toLowerCase()}" class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">${category} (${routes.length})</h2>
                    <div class="space-y-6">
                        ${routes.map(route => `
                            <div class="bg-white rounded-lg shadow overflow-hidden">
                                <div class="bg-gray-50 px-6 py-4 border-b">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-900">
                                                <code class="text-sm bg-gray-100 px-2 py-1 rounded">${route.path}</code>
                                            </h3>
                                            ${route.description ? `<p class="text-gray-600 mt-1">${route.description}</p>` : ''}
                                        </div>
                                        <div class="flex space-x-2">
                                            ${route.methods.map(method => `
                                                <span class="px-2 py-1 text-xs font-medium rounded ${getMethodColor(method)}">${method}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="p-6">
                                    ${route.authentication ? `
                                        <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                            <p class="text-sm text-yellow-800">
                                                <strong>🔒 Authentication Required:</strong> ${route.authentication.description}
                                            </p>
                                        </div>
                                    ` : ''}
                                    
                                    ${route.parameters.length > 0 ? `
                                        <div class="mb-4">
                                            <h4 class="font-semibold text-gray-900 mb-2">Parameters</h4>
                                            <div class="overflow-x-auto">
                                                <table class="min-w-full text-sm">
                                                    <thead>
                                                        <tr class="border-b">
                                                            <th class="text-left py-2">Name</th>
                                                            <th class="text-left py-2">Type</th>
                                                            <th class="text-left py-2">Location</th>
                                                            <th class="text-left py-2">Required</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${route.parameters.map(param => `
                                                            <tr class="border-b">
                                                                <td class="py-2"><code class="bg-gray-100 px-2 py-1 rounded text-xs">${param.name}</code></td>
                                                                <td class="py-2">${param.type}</td>
                                                                <td class="py-2">${param.location}</td>
                                                                <td class="py-2">${param.required ? 'Yes' : 'No'}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ` : ''}
                                    
                                    ${route.responses.length > 0 ? `
                                        <div>
                                            <h4 class="font-semibold text-gray-900 mb-2">Responses</h4>
                                            <div class="space-y-3">
                                                ${route.responses.map(response => `
                                                    <div class="border rounded">
                                                        <div class="bg-gray-50 px-3 py-2 border-b">
                                                            <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(response.status)}">
                                                                ${response.status} ${response.description}
                                                            </span>
                                                        </div>
                                                        <div class="p-3">
                                                            <pre class="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto"><code>${JSON.stringify(response.example, null, 2)}</code></pre>
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `).join('')}
        </main>
    </div>

    <script>
        // Highlight code blocks
        document.addEventListener('DOMContentLoaded', function() {
            Prism.highlightAll();
        });
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>

function getMethodColor(method) {
    const colors = {
        'GET': 'bg-green-100 text-green-800',
        'POST': 'bg-blue-100 text-blue-800',
        'PUT': 'bg-orange-100 text-orange-800',
        'DELETE': 'bg-red-100 text-red-800',
        'PATCH': 'bg-purple-100 text-purple-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
}

function getStatusColor(status) {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
    if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
}
</script>
</html>
  `;
  
  const htmlFile = path.join(OUTPUT_DIR, 'index.html');
  fs.writeFileSync(htmlFile, html);
}

// Helper functions for HTML generation
function getMethodColor(method) {
  const colors = {
    'GET': 'bg-green-100 text-green-800',
    'POST': 'bg-blue-100 text-blue-800',
    'PUT': 'bg-orange-100 text-orange-800',
    'DELETE': 'bg-red-100 text-red-800',
    'PATCH': 'bg-purple-100 text-purple-800'
  };
  return colors[method] || 'bg-gray-100 text-gray-800';
}

function getStatusColor(status) {
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
  if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
  if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-800';
  if (status >= 500) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

// Run the generator
if (require.main === module) {
  generateDocumentation();
}

module.exports = { generateDocumentation, extractApiInfo, scanApiRoutes };
