#!/usr/bin/env node

/**
 * Heroku postinstall script - runs after npm install
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('Setting up for Heroku deployment...');

// Only run this on Heroku (which sets NODE_ENV to production)
if (process.env.NODE_ENV === 'production') {
  try {
    console.log('Building client assets...');
    execSync('npx vite build', { stdio: 'inherit', timeout: 300000 }); // 5 min timeout
    
    // Copy assets if build succeeds
    if (fs.existsSync('dist/public')) {
      execSync('mkdir -p server && cp -r dist/public server/', { stdio: 'inherit' });
      console.log('Client assets copied to server/public');
    }
    
    console.log('Build completed successfully');
  } catch (error) {
    console.warn('Build failed, server will run in development mode');
  }
} else {
  console.log('Development environment detected, skipping build');
}