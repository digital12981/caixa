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

if (fs.existsSync(compiledPath)) {
  console.log('Using compiled server...');
  try {
    await import('./dist/server.js');
    console.log('Server started successfully');
  } catch (error) {
    console.error('Compiled server failed:', error.message);
    console.log('Trying TypeScript fallback...');
    startTypescript();
  }
} else {
  console.log('No compiled server, using TypeScript...');
  startTypescript();
}

async function startTypescript() {
  try {
    console.log('Attempting tsx execution...');
    
    // Method 1: Try tsx directly
    const { spawn } = await import('child_process');
    
    const tsxProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: 'inherit',
      env: { ...process.env },
      shell: true
    });

    tsxProcess.on('error', (error) => {
      console.error('tsx spawn failed:', error.message);
      tryDirectImport();
    });

    tsxProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`tsx exited with code ${code}`);
        tryDirectImport();
      }
    });

    // Handle shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down...`);
        tsxProcess.kill(signal);
      });
    });

  } catch (error) {
    console.error('tsx method failed:', error.message);
    tryDirectImport();
  }
}

async function tryDirectImport() {
  try {
    console.log('Trying direct TypeScript import...');
    const { register } = await import('tsx/esm');
    register();
    await import('./server/index.ts');
    console.log('Direct TypeScript server started');
  } catch (error) {
    console.error('All server startup methods failed:', error.message);
    process.exit(1);
  }
}