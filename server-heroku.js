// Heroku production server entry point
console.log('Heroku: Starting application...');
console.log('Node version:', process.version);
console.log('PORT:', process.env.PORT || 5000);

import fs from 'fs';
import { pathToFileURL } from 'url';

// Set production environment
process.env.NODE_ENV = 'production';
const port = process.env.PORT || 5000;
process.env.PORT = port;

// Check if compiled server exists, otherwise use TypeScript
const compiledServerPath = './dist/server.js';
const typescriptServerPath = './server/index.ts';

async function startServer() {
  try {
    if (fs.existsSync(compiledServerPath)) {
      console.log('Using compiled JavaScript server...');
      const { default: server } = await import(pathToFileURL(compiledServerPath).href);
    } else {
      console.log('Compiled server not found, starting TypeScript compilation...');
      // Import tsx dynamically and run TypeScript server
      const { spawn } = await import('child_process');
      
      const serverProcess = spawn('npx', ['tsx', typescriptServerPath], {
        stdio: 'inherit',
        env: process.env
      });

      serverProcess.on('error', (error) => {
        console.error('Server failed to start:', error.message);
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
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

startServer();