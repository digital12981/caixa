#!/usr/bin/env node

// Heroku startup script - ensures server is compiled before running
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Heroku Startup Script');
console.log('📋 Node:', process.version);
console.log('📋 Environment:', process.env.NODE_ENV);
console.log('📋 Port:', process.env.PORT);

// Check if server is already compiled
const serverPath = './dist/server.js';

if (!fs.existsSync(serverPath)) {
  console.log('⚠️ Server not compiled, building now...');
  
  try {
    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    // Compile server (using production.ts to avoid vite dependency)
    console.log('🔨 Compiling server...');
    execSync('npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', {
      stdio: 'inherit',
      timeout: 60000
    });
    
    if (fs.existsSync(serverPath)) {
      console.log('✅ Server compiled successfully');
    } else {
      throw new Error('Server compilation failed');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Server already compiled');
}

// Ensure static files directory exists
if (!fs.existsSync('dist/public')) {
  console.log('📁 Creating static files directory...');
  fs.mkdirSync('dist/public', { recursive: true });
  
  // Create minimal index.html for production
  fs.writeFileSync('dist/public/index.html', `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leilões Caixa</title>
</head>
<body>
  <div id="root">
    <h1>Leilões Caixa - Servidor Online</h1>
    <p>Aplicação rodando em modo de produção.</p>
    <p>Port: ${process.env.PORT}</p>
  </div>
</body>
</html>`);
  
  console.log('✅ Static files directory created');
}

// Now start the server
console.log('🚀 Starting server...');

// Import and run the compiled server
try {
  await import('./dist/server.js');
  console.log('✅ Server started successfully');
} catch (error) {
  console.error('❌ Server startup failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}