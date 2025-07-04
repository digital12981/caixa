#!/usr/bin/env node

/**
 * Heroku postinstall script - builds both client and server for production
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('Heroku postinstall: Building application...');

try {
  // Build client assets
  console.log('Building client...');
  execSync('npx vite build', { 
    stdio: 'inherit', 
    timeout: 300000,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Build server from TypeScript to JavaScript
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
    stdio: 'inherit',
    timeout: 120000
  });
  
  // Copy client assets to server directory
  if (fs.existsSync('dist/public')) {
    execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
    console.log('✅ Client and server built successfully');
  }
  
  console.log('✅ Build completed - ready for production');
} catch (error) {
  console.warn('⚠️ Build failed:', error.message);
  // Try simpler client-only build
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Client build completed, server will run from TypeScript');
  } catch (clientError) {
    console.warn('⚠️ All builds failed, will try to run in development mode');
  }
}