import esbuild from 'esbuild';
import { readFileSync } from 'fs';

// Read package.json to get dependencies that should remain external
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

// Build configuration for Heroku deployment
const buildConfig = {
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: 'dist',
  sourcemap: false,
  minify: false,
  // Keep ALL dependencies external - let Node.js handle them
  external: dependencies.concat([
    // Node.js built-ins
    'fs', 'path', 'http', 'https', 'url', 'crypto', 'os', 'stream', 'util', 
    'events', 'querystring', 'zlib', 'buffer', 'net', 'tls', 'child_process',
    // Problematic packages that should remain external
    '@babel/*', 'lightningcss*', '@tailwindcss/*', 'postcss*', 'autoprefixer*'
  ]),
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
    `.trim()
  }
};

try {
  console.log('🏗️ Building server for Heroku deployment...');
  await esbuild.build(buildConfig);
  console.log('✅ Server build completed successfully!');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}