#!/usr/bin/env node

/**
 * Production server entry point for Heroku
 * This script sets up the environment and runs the TypeScript server directly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Use Heroku's port or fallback to 5000
const port = process.env.PORT || 5000;
process.env.PORT = port;

console.log(`🚀 Starting server in production mode on port ${port}...`);

// Run the TypeScript server directly using tsx
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});