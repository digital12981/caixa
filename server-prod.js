#!/usr/bin/env node

/**
 * Production server entry point for Heroku
 */

// Set production environment first
process.env.NODE_ENV = 'production';

// Use Heroku's dynamic port
const port = process.env.PORT || 5000;
process.env.PORT = port;

console.log(`Starting server on port ${port}...`);
console.log(`Node version: ${process.version}`);
console.log(`Working directory: ${process.cwd()}`);

// Import and run the server directly
try {
  // Dynamic import to handle ES modules correctly
  const { spawn } = await import('child_process');
  
  // Try to run with tsx first, fallback to node if needed
  const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: port
    }
  });

  serverProcess.on('error', (error) => {
    console.error('Server start failed:', error.message);
    process.exit(1);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`Server exited with code ${code} and signal ${signal}`);
      process.exit(code || 1);
    }
  });

  // Graceful shutdown
  ['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
      console.log(`Received ${signal}, shutting down...`);
      serverProcess.kill(signal);
    });
  });

} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}