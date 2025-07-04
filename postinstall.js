#!/usr/bin/env node

/**
 * Heroku postinstall script - prepares application for production
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Heroku postinstall: Preparing application...');
console.log('📋 Node version:', process.version);
console.log('📋 Working directory:', process.cwd());
console.log('📋 Environment:', process.env.NODE_ENV);

try {
  // Build server first - compile TypeScript to JavaScript for Heroku
  console.log('🔨 Building server for production...');
  
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
    console.log('📁 Created dist directory');
  }
  
  // Check if esbuild is available
  try {
    execSync('npx esbuild --version', { stdio: 'pipe' });
    console.log('✅ esbuild is available');
  } catch (esbuildError) {
    console.error('❌ esbuild not found:', esbuildError.message);
    throw new Error('esbuild is required for server compilation');
  }
  
  console.log('🔧 Compiling server/index.ts to dist/server.js...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js --log-level=info', {
    stdio: 'inherit',
    timeout: 60000,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Verify server compilation
  if (fs.existsSync('dist/server.js')) {
    const serverSize = fs.statSync('dist/server.js').size;
    console.log(`✅ Server compiled successfully (${Math.round(serverSize/1024)}KB)`);
  } else {
    throw new Error('Server compilation failed - dist/server.js not created');
  }
  
  // Build client assets
  console.log('Building client assets...');
  execSync('npx vite build', { 
    stdio: 'inherit', 
    timeout: 300000, // 5 minutes
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Verify client assets location
  const distPublicPath = 'dist/public';
  
  if (fs.existsSync(distPublicPath)) {
    console.log('✅ Client assets built in dist/public/ (Vite configuration)');
    console.log('📁 Available in dist/public:', fs.readdirSync(distPublicPath).join(', '));
  } else if (fs.existsSync('dist')) {
    console.log('📁 Available in dist:', fs.readdirSync('dist').join(', '));
    
    // Check if assets are in dist root instead of dist/public
    const hasAssets = fs.existsSync('dist/index.html') || fs.existsSync('dist/assets');
    
    if (hasAssets) {
      console.log('📋 Client assets found in dist/ root, moving to dist/public/...');
      
      // Move assets to the expected dist/public structure
      execSync('mkdir -p dist/public', { stdio: 'inherit' });
      
      // Move all files except server.js to dist/public
      const files = fs.readdirSync('dist').filter(file => 
        !file.startsWith('server.js') && file !== 'public'
      );
      
      files.forEach(file => {
        execSync(`mv dist/${file} dist/public/`, { stdio: 'inherit' });
      });
      
      console.log('✅ Client assets moved to dist/public/');
    } else {
      console.log('⚠️ No client assets found');
    }
  } else {
    console.log('⚠️ Dist directory not found');
  }
  
  console.log('✅ Application built successfully for Heroku');
} catch (error) {
  console.warn('⚠️ Build failed:', error.message);
  console.log('Will attempt fallback build...');
  
  // Fallback: try client build only
  try {
    console.log('🔄 Attempting fallback build...');
    execSync('npx vite build', { stdio: 'inherit', timeout: 300000 });
    
    // Check what was actually built
    if (fs.existsSync('dist')) {
      const distFiles = fs.readdirSync('dist');
      console.log('📁 Fallback build created:', distFiles.join(', '));
      
      // Copy all files except server.js to server/public
      execSync('mkdir -p server/public', { stdio: 'inherit' });
      
      distFiles.forEach(file => {
        if (!file.startsWith('server.js')) {
          execSync(`cp -r dist/${file} server/public/`, { stdio: 'inherit' });
        }
      });
      
      console.log('✅ Fallback build completed');
    }
  } catch (fallbackError) {
    console.warn('⚠️ All builds failed:', fallbackError.message);
    console.log('Server will run in development mode');
  }
}