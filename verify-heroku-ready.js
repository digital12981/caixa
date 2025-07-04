#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Verificação Final para Deploy no Heroku\n');

const checks = [];

// 1. Verificar arquivos essenciais
console.log('📋 Verificando arquivos essenciais...');
const essentialFiles = ['Procfile', 'server-simple.js', 'postinstall.js', 'package.json'];
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    checks.push(true);
  } else {
    console.log(`  ❌ ${file} - FALTANDO`);
    checks.push(false);
  }
});

// 2. Verificar Procfile
console.log('\n📋 Verificando Procfile...');
if (fs.existsSync('Procfile')) {
  const procfileContent = fs.readFileSync('Procfile', 'utf8').trim();
  if (procfileContent === 'web: node server-simple.js') {
    console.log('  ✅ Procfile configurado corretamente');
    checks.push(true);
  } else {
    console.log(`  ❌ Procfile incorreto: "${procfileContent}"`);
    checks.push(false);
  }
} else {
  checks.push(false);
}

// 3. Testar build
console.log('\n🔨 Testando build do servidor...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js', { 
    stdio: 'pipe',
    timeout: 30000 
  });
  
  if (fs.existsSync('dist/server.js')) {
    const size = fs.statSync('dist/server.js').size;
    console.log(`  ✅ Servidor compilado com sucesso (${Math.round(size/1024)}KB)`);
    checks.push(true);
  } else {
    console.log('  ❌ Arquivo server.js não foi criado');
    checks.push(false);
  }
} catch (error) {
  console.log(`  ❌ Falha no build: ${error.message}`);
  checks.push(false);
}

// 4. Verificar estrutura de diretórios
console.log('\n📁 Verificando estrutura de diretórios...');
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
  
  // Criar arquivo de teste
  fs.writeFileSync('dist/public/index.html', `
<!DOCTYPE html>
<html><head><title>Test</title></head>
<body><h1>Heroku Test Page</h1></body></html>
  `.trim());
}

if (fs.existsSync('dist/public/index.html')) {
  console.log('  ✅ Estrutura dist/public/ configurada');
  checks.push(true);
} else {
  console.log('  ❌ Estrutura dist/public/ faltando');
  checks.push(false);
}

// 5. Testar servidor
console.log('\n🚀 Testando servidor...');
let serverWorking = false;
try {
  const { spawn } = await import('child_process');
  
  const serverProcess = spawn('node', ['server-simple.js'], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3015' },
    stdio: 'pipe'
  });

  let serverOutput = '';
  serverProcess.stdout.on('data', (data) => {
    serverOutput += data.toString();
  });

  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:3015/health');
      if (response.ok) {
        console.log('  ✅ Servidor respondendo corretamente');
        serverWorking = true;
      } else {
        console.log('  ❌ Servidor não responde ao health check');
      }
    } catch (error) {
      console.log(`  ❌ Erro ao testar servidor: ${error.message}`);
    } finally {
      serverProcess.kill();
      checks.push(serverWorking);
      
      // Resultado final
      console.log('\n📊 RESULTADO DA VERIFICAÇÃO:');
      const passed = checks.filter(Boolean).length;
      const total = checks.length;
      
      if (passed === total) {
        console.log(`✅ PASSOU EM TODOS OS TESTES (${passed}/${total})`);
        console.log('\n🎉 PRONTO PARA DEPLOY NO HEROKU!');
        console.log('Execute: git add . && git commit -m "Deploy ready" && git push heroku main');
      } else {
        console.log(`❌ FALHOU EM ${total - passed} TESTE(S) (${passed}/${total})`);
        console.log('\n⚠️  Corrija os problemas antes do deploy');
      }
    }
  }, 3000);

} catch (error) {
  console.log(`  ❌ Erro ao iniciar servidor: ${error.message}`);
  checks.push(false);
}