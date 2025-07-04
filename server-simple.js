// Simple Heroku server - tries compiled version first, then tsx
console.log('Starting Heroku server (simple version)...');

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Node:', process.version);
console.log('Port:', process.env.PORT);

import fs from 'fs';

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

const compiledPath = './dist/server.js';

console.log('Checking for compiled server...');
console.log('Current directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.').join(', '));

if (fs.existsSync('dist')) {
  console.log('Files in dist:', fs.readdirSync('dist').join(', '));
}

if (fs.existsSync(compiledPath)) {
  console.log('✅ Using compiled server...');
  try {
    await import('./dist/server.js');
    console.log('✅ Server started successfully');
  } catch (error) {
    console.error('❌ Compiled server failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1); // No fallback - force rebuild
  }
} else {
  console.error('❌ No compiled server found at:', compiledPath);
  console.error('Build process must have failed. Check postinstall logs.');
  process.exit(1); // Force failure to trigger rebuild
}

// TypeScript fallback functions removed - Heroku uses compiled JavaScript only