#!/usr/bin/env node

/**
 * Heroku Post-Build Script
 * This script runs after npm install to prepare the application for production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Heroku post-build process...');

try {
  // Build the client assets
  console.log('📦 Building client assets with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Build the server
  console.log('🏗️ Building server with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Verify build outputs exist
  const distPublicPath = path.join(process.cwd(), 'dist', 'public');
  const distServerPath = path.join(process.cwd(), 'dist', 'index.js');

  if (!fs.existsSync(distPublicPath)) {
    throw new Error('Client build output not found at dist/public');
  }

  if (!fs.existsSync(distServerPath)) {
    throw new Error('Server build output not found at dist/index.js');
  }

  console.log('✅ Build completed successfully!');
  console.log(`📂 Client assets: ${distPublicPath}`);
  console.log(`🖥️ Server bundle: ${distServerPath}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}