// Heroku production server entry point
console.log('🚀 Starting Heroku server...');

// Set environment variables for Heroku
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('📋 Node version:', process.version);
console.log('🌐 Port:', process.env.PORT);
console.log('🔧 Environment:', process.env.NODE_ENV);

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

import fs from 'fs';

// Check if compiled server exists, otherwise use TypeScript fallback
const compiledServerPath = './dist/server.js';

console.log('📁 Checking for compiled server at:', compiledServerPath);
console.log('📁 Compiled server exists:', fs.existsSync(compiledServerPath));

if (fs.existsSync(compiledServerPath)) {
  console.log('✅ Using compiled JavaScript server...');
  import('./dist/server.js')
    .then(() => {
      console.log('🎉 Compiled server started successfully');
    })
    .catch((error) => {
      console.error('❌ Compiled server failed:', error.message);
      console.error('Stack:', error.stack);
      console.log('🔄 Falling back to TypeScript...');
      startWithTsx();
    });
} else {
  console.log('⚠️ No compiled server found, using TypeScript...');
  startWithTsx();
}

function startWithTsx() {
  console.log('🔧 Starting TypeScript server with tsx...');
  import('child_process').then(({ spawn }) => {
    const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: 'inherit',
      env: process.env,
      cwd: process.cwd()
    });

    serverProcess.on('error', (error) => {
      console.error('❌ TypeScript server failed to start:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    });

    serverProcess.on('exit', (code, signal) => {
      console.log(`🚪 Server process exited with code ${code} and signal ${signal}`);
      if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`);
        process.exit(code || 1);
      }
    });

    // Handle shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
      process.on(signal, () => {
        console.log(`📨 Received ${signal}, shutting down...`);
        serverProcess.kill(signal);
      });
    });

    console.log('✅ TypeScript server process started');
  }).catch((error) => {
    console.error('❌ Failed to start any server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  });
}