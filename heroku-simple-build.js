#!/usr/bin/env node

/**
 * Simplified Heroku Build Script
 * Just builds client and copies files - server runs directly with tsx
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting simplified Heroku build...');

try {
  // Only build client assets - much faster
  console.log('📦 Building client assets...');
  execSync('npm run build:client', { stdio: 'inherit' });

  // Verify and copy client assets
  const distPublicPath = path.join(process.cwd(), 'dist', 'public');
  const serverPublicPath = path.join(process.cwd(), 'server', 'public');

  if (fs.existsSync(distPublicPath)) {
    console.log('📁 Copying client assets to server/public...');
    execSync(`cp -r ${distPublicPath} ${path.dirname(serverPublicPath)}`, { stdio: 'inherit' });
    console.log('✅ Client build completed successfully!');
  } else {
    console.log('⚠️ Client build not found, will serve from development mode');
  }

  console.log('🎯 Server will run directly from TypeScript using tsx');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('🔄 Continuing anyway - server will handle missing client files');
}