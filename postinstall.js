#!/usr/bin/env node

/**
 * Heroku postinstall script - builds client assets after npm install
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('Heroku postinstall: Building client assets...');

try {
  // Build client with timeout
  execSync('npx vite build', { 
    stdio: 'inherit', 
    timeout: 300000, // 5 minutes
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Copy built assets to server directory
  if (fs.existsSync('dist/public')) {
    execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
    console.log('✅ Client assets built and copied successfully');
  } else {
    console.log('⚠️ No client assets found, server will serve from development');
  }
} catch (error) {
  console.warn('⚠️ Client build failed, server will run in development mode');
  console.warn('Error:', error.message);
}