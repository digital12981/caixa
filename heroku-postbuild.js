#!/usr/bin/env node

/**
 * Heroku Post-Build Script
 * This script runs after npm install to prepare the application for production
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Heroku post-build process...');

try {
  // Build the client assets
  console.log('📦 Building client assets with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Verify build outputs exist
  const distPublicPath = path.join(process.cwd(), 'dist', 'public');
  const serverPublicPath = path.join(process.cwd(), 'server', 'public');

  if (!fs.existsSync(distPublicPath)) {
    throw new Error('Client build output not found at dist/public');
  }

  // Copy built client files to where the server expects them
  console.log('📁 Copying client assets to server/public...');
  execSync(`cp -r ${distPublicPath} ${path.dirname(serverPublicPath)}`, { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log(`📂 Client assets: ${distPublicPath}`);
  console.log(`📋 Copied to: ${serverPublicPath}`);
  console.log(`🖥️ Server will run directly from TypeScript source using tsx`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}