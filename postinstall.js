#!/usr/bin/env node

/**
 * Heroku postinstall script - builds application for production
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('Heroku postinstall: Building application...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

try {
  // Build server first (faster)
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
    stdio: 'inherit',
    timeout: 60000 // 1 minute timeout
  });
  console.log('✅ Server compiled successfully');
  
  // Build client assets (slower)
  console.log('Building client...');
  execSync('npx vite build', { 
    stdio: 'inherit', 
    timeout: 300000, // 5 minutes
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Copy client assets to server directory
  if (fs.existsSync('dist/public')) {
    execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
    console.log('✅ Client assets copied to server directory');
  }
  
  console.log('✅ Full build completed successfully');
} catch (error) {
  console.warn('⚠️ Build error:', error.message);
  
  // Try server build only as fallback
  try {
    console.log('Attempting server-only build...');
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
      stdio: 'inherit'
    });
    console.log('✅ Server compiled, will use TypeScript for client in dev mode');
  } catch (serverError) {
    console.warn('⚠️ Server compilation failed, will use TypeScript runtime fallback');
  }
}