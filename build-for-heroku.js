#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Building application for Heroku...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  execSync('rm -rf dist server/public', { stdio: 'inherit' });

  // Build server (TypeScript to JavaScript)
  console.log('🔨 Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
    stdio: 'inherit',
    timeout: 30000
  });

  // Build client (React app)
  console.log('🎨 Building client...');
  execSync('npx vite build', {
    stdio: 'inherit',
    timeout: 180000 // 3 minutes
  });

  // Copy client assets to server/public
  console.log('📁 Copying assets...');
  if (fs.existsSync('dist')) {
    execSync('mkdir -p server/public', { stdio: 'inherit' });
    
    // Skip server.js and server.js.map when copying
    const files = fs.readdirSync('dist').filter(file => 
      !file.startsWith('server.js')
    );
    
    files.forEach(file => {
      execSync(`cp -r dist/${file} server/public/`, { stdio: 'inherit' });
    });

    console.log('✅ Build completed successfully!');
    console.log('📦 Available files:');
    console.log('  Server:', fs.existsSync('dist/server.js') ? '✅' : '❌');
    console.log('  Client:', fs.existsSync('server/public/index.html') ? '✅' : '❌');
  } else {
    throw new Error('Build directory not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}