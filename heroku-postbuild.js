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

  // Build the server using esbuild for better compatibility
  console.log('🏗️ Building server with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --format=esm --outfile=dist/server.js --bundle --external:express --external:drizzle-orm --external:@neondatabase/serverless --external:axios', { stdio: 'inherit' });

  // Verify build outputs exist
  const distPublicPath = path.join(process.cwd(), 'dist', 'public');
  const serverPublicPath = path.join(process.cwd(), 'server', 'public');
  const distServerPath = path.join(process.cwd(), 'dist', 'server.js');

  if (!fs.existsSync(distPublicPath)) {
    throw new Error('Client build output not found at dist/public');
  }

  if (!fs.existsSync(distServerPath)) {
    throw new Error('Server build output not found at dist/server.js');
  }

  // Copy built client files to where the server expects them
  console.log('📁 Copying client assets to server/public...');
  execSync(`cp -r ${distPublicPath} ${path.dirname(serverPublicPath)}`, { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log(`📂 Client assets: ${distPublicPath}`);
  console.log(`📋 Copied to: ${serverPublicPath}`);
  console.log(`🖥️ Server compiled to: ${distServerPath}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}