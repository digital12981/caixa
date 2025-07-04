#!/usr/bin/env node

/**
 * Build only client assets for Heroku
 */

import { execSync } from 'child_process';

console.log('📦 Building client assets only...');

try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Client build completed!');
} catch (error) {
  console.error('❌ Client build failed:', error.message);
  process.exit(1);
}