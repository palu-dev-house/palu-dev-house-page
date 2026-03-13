import { ZodSchema, ZodError } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Validation result type
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: string[];
  errorDetails?: ZodError;
}

// Generic validation function
export function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
      return {
        success: false,
        errors,
        errorDetails: error
      };
    }
    
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

// Validate JSON body from request
export async function validateJsonBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return validateRequest(schema, body);
  } catch (error) {
    return {
      success: false,
      errors: ['Invalid JSON in request body']
    };
  }
}

// Validate query parameters
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): ValidationResult<T> {
  const { searchParams } = new URL(request.url);
  const params: Record<string, any> = {};
  
  // Convert URLSearchParams to object
  for (const [key, value] of searchParams.entries()) {
    // Handle multiple values for the same key
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return validateRequest(schema, params);
}

// Validate path parameters
export function validatePathParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>
): ValidationResult<T> {
  return validateRequest(schema, params);
}

// Create standardized error response
export function createValidationErrorResponse(errors: string[], status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

// Create standardized success response
export function createSuccessResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    message: message || 'Operation completed successfully',
    data,
    timestamp: new Date().toISOString()
  });
}

// Middleware-like validation wrapper
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const validation = await validateJsonBody(request, schema);
    
    if (!validation.success) {
      return createValidationErrorResponse(validation.errors || []);
    }
    
    return handler(validation.data!, request);
  };
}

// Async validation wrapper for any validation function
export async function withAsyncValidation<T>(
  validationFn: () => Promise<ValidationResult<T>>,
  successHandler: (data: T) => Promise<NextResponse>,
  errorHandler?: (errors: string[]) => Promise<NextResponse>
) {
  try {
    const validation = await validationFn();
    
    if (!validation.success) {
      if (errorHandler) {
        return errorHandler(validation.errors || []);
      }
      return createValidationErrorResponse(validation.errors || []);
    }
    
    return successHandler(validation.data!);
  } catch (error) {
    return createValidationErrorResponse(['Internal server error'], 500);
  }
}

// Common validation patterns
export const validationPatterns = {
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    search: '',
    sort: 'createdAt',
    order: 'desc'
  },
  
  // Common filters
  filters: {
    status: '',
    type: '',
    category: '',
    featured: undefined
  },
  
  // IDs
  id: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  
  // Slugs
  slug: {
    pattern: /^[a-z0-9-]+$/,
    minLength: 1,
    maxLength: 100
  },
  
  // URLs
  url: {
    pattern: /^https?:\/\/.+/,
    minLength: 1,
    maxLength: 2048
  },
  
  // Emails
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    maxLength: 254
  },
  
  // Dates
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    minLength: 10,
    maxLength: 10
  },
  
  // TOTP codes
  totp: {
    length: 6,
    pattern: /^\d+$/
  }
};

// Custom validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must be less than ${max} characters`,
  invalidEmail: 'Please enter a valid email address',
  invalidUrl: 'Please enter a valid URL',
  invalidDate: 'Please enter a valid date in YYYY-MM-DD format',
  invalidSlug: 'Slug must contain only lowercase letters, numbers, and hyphens',
  invalidId: 'ID must contain only letters, numbers, underscores, and hyphens',
  invalidTotp: 'TOTP code must be exactly 6 digits',
  passwordTooWeak: 'Password must be at least 8 characters long',
  passwordsDoNotMatch: 'Passwords do not match',
  invalidJson: 'Invalid JSON format',
  invalidArray: 'Must be an array',
  invalidObject: 'Must be an object',
  invalidNumber: 'Must be a valid number',
  invalidBoolean: 'Must be true or false',
  invalidString: 'Must be a string',
  invalidEnum: (values: string[]) => `Must be one of: ${values.join(', ')}`
};

// Type guards for common validations
export const validators = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isArray: (value: unknown): value is any[] => Array.isArray(value),
  isObject: (value: unknown): value is Record<string, any> => 
    typeof value === 'object' && value !== null && !Array.isArray(value),
  isEmail: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isUrl: (value: string): boolean => /^https?:\/\/.+/.test(value),
  isDate: (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value)),
  isSlug: (value: string): boolean => /^[a-z0-9-]+$/.test(value),
  isId: (value: string): boolean => /^[a-zA-Z0-9_-]+$/.test(value)
};

// Sanitization helpers
export const sanitizers = {
  trim: (value: string): string => value.trim(),
  lowercase: (value: string): string => value.toLowerCase(),
  uppercase: (value: string): string => value.toUpperCase(),
  slugify: (value: string): string => 
    (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''),
  
  escapeHtml: (value: string): string => 
    (value || '').replace(/[&<>"']/g, (match: string) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[match] || ''),
  
  normalizeEmail: (value: string): string => value.toLowerCase().trim(),
  
  normalizeUrl: (value: string): string => {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  }
};

// Validation error formatter
export function formatValidationErrors(error: ZodError): string[] {
  return error.issues.map((err: any) => {
    const path = err.path.join('.');
    const message = err.message;
    
    // Make user-friendly messages
    if (message.includes('Required')) {
      return `${path} is required`;
    }
    
    if (message.includes('Invalid')) {
      return `${path} has invalid format`;
    }
    
    if (message.includes('Too small')) {
      return `${path} is too short`;
    }
    
    if (message.includes('Too big')) {
      return `${path} is too long`;
    }
    
    return `${path}: ${message}`;
  });
}

// Export all utilities
export const validation = {
  validateRequest,
  validateJsonBody,
  validateQueryParams,
  validatePathParams,
  createValidationErrorResponse,
  createSuccessResponse,
  withValidation,
  withAsyncValidation,
  patterns: validationPatterns,
  messages: validationMessages,
  validators,
  sanitizers,
  formatValidationErrors
};
