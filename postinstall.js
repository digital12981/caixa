#!/usr/bin/env node

/**
 * Heroku postinstall script - prepares application for production
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('Heroku postinstall: Preparing application...');

try {
  // Build server first - compile TypeScript to JavaScript for Heroku
  console.log('Building server for production...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
    stdio: 'inherit',
    timeout: 60000
  });
  
  // Build client assets
  console.log('Building client assets...');
  execSync('npx vite build', { 
    stdio: 'inherit', 
    timeout: 300000, // 5 minutes
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Copy client assets to server directory for production serving
  if (fs.existsSync('dist/public')) {
    execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
    console.log('✅ Client assets built and copied successfully');
  }
  
  console.log('✅ Application built successfully for Heroku');
} catch (error) {
  console.warn('⚠️ Build failed:', error.message);
  console.log('Will attempt fallback build...');
  
  // Fallback: try client build only
  try {
    execSync('npx vite build', { stdio: 'inherit', timeout: 300000 });
    if (fs.existsSync('dist/public')) {
      execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
    }
    console.log('✅ Client build completed, server will run with tsx');
  } catch (fallbackError) {
    console.warn('⚠️ All builds failed, running in development mode');
  }
}