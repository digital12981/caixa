// Heroku production server entry point
console.log('Starting Heroku server...');

// Set environment variables for Heroku
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('Node version:', process.version);
console.log('Port:', process.env.PORT);
console.log('Environment:', process.env.NODE_ENV);

import fs from 'fs';

// Check if compiled server exists, otherwise use TypeScript fallback
const compiledServerPath = './dist/server.js';

if (fs.existsSync(compiledServerPath)) {
  console.log('Using compiled JavaScript server...');
  import('./dist/server.js')
    .then(() => {
      console.log('Compiled server started successfully');
    })
    .catch((error) => {
      console.error('Compiled server failed:', error.message);
      console.log('Falling back to TypeScript...');
      startWithTsx();
    });
} else {
  console.log('No compiled server found, using TypeScript...');
  startWithTsx();
}

function startWithTsx() {
  import('child_process').then(({ spawn }) => {
    const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: 'inherit',
      env: process.env
    });

    serverProcess.on('error', (error) => {
      console.error('TypeScript server failed to start:', error.message);
      process.exit(1);
    });

    serverProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Server exited with code ${code}`);
        process.exit(code || 1);
      }
    });

    // Handle shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down...`);
        serverProcess.kill(signal);
      });
    });
  }).catch((error) => {
    console.error('Failed to start any server:', error.message);
    process.exit(1);
  });
}