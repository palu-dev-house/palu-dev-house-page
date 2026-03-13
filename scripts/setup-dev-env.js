#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up the development environment
 * for API-based data fetching without SQLite dependency.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env.local file if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
const envContent = `
# Development Environment Configuration
# Enable API simulation mode (no SQLite required)
SIMULATE_API=true

# API Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Development settings
NODE_ENV=development
`;

if (!fs.existsSync(envPath)) {
  console.log('🚀 Creating .env.local file with simulation settings...');
  fs.writeFileSync(envPath, envContent.trim());
  console.log('✅ .env.local created successfully!');
  console.log('');
  console.log('📋 Environment variables set:');
  console.log('  SIMULATE_API=true - Enable API simulation mode');
  console.log('  NEXT_PUBLIC_BASE_URL=http://localhost:3000 - API base URL');
  console.log('  NODE_ENV=development - Development mode');
  console.log('');
  console.log('🔄 Please restart your development server to apply changes.');
} else {
  console.log('⚠️  .env.local already exists');
  console.log('📝  Current contents:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}
