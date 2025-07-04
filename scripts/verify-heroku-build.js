#!/usr/bin/env node

/**
 * Script de Verificação para Deploy no Heroku
 * Verifica se tudo está configurado corretamente para deploy
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Verificando configuração para deploy no Heroku...\n');

const checks = [];

// Verificar se Procfile existe
const procfileExists = fs.existsSync('Procfile');
checks.push({
  name: 'Procfile',
  status: procfileExists,
  message: procfileExists ? 'Procfile encontrado' : 'Procfile não encontrado'
});

// Verificar se app.json existe
const appJsonExists = fs.existsSync('app.json');
checks.push({
  name: 'app.json',
  status: appJsonExists,
  message: appJsonExists ? 'app.json encontrado' : 'app.json não encontrado'
});

// Verificar se package.json tem scripts corretos
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasStartScript = packageJson.scripts && packageJson.scripts.start;
  const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
  
  checks.push({
    name: 'script start',
    status: hasStartScript,
    message: hasStartScript ? 'Script "start" encontrado' : 'Script "start" não encontrado'
  });
  
  checks.push({
    name: 'script build',
    status: hasBuildScript,
    message: hasBuildScript ? 'Script "build" encontrado' : 'Script "build" não encontrado'
  });
} else {
  checks.push({
    name: 'package.json',
    status: false,
    message: 'package.json não encontrado'
  });
}

// Verificar se server/index.ts usa process.env.PORT
const serverIndexPath = 'server/index.ts';
if (fs.existsSync(serverIndexPath)) {
  const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
  const usesEnvPort = serverContent.includes('process.env.PORT');
  
  checks.push({
    name: 'Porta dinâmica',
    status: usesEnvPort,
    message: usesEnvPort ? 'Usando process.env.PORT' : 'Não está usando process.env.PORT'
  });
} else {
  checks.push({
    name: 'server/index.ts',
    status: false,
    message: 'server/index.ts não encontrado'
  });
}

// Verificar se server-prod.js existe
const serverProdExists = fs.existsSync('server-prod.js');
checks.push({
  name: 'server-prod.js',
  status: serverProdExists,
  message: serverProdExists ? 'Script de produção encontrado' : 'server-prod.js não encontrado'
});

// Verificar se tsx está nas dependências normais
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasTsx = packageJson.dependencies && packageJson.dependencies.tsx;
  
  checks.push({
    name: 'tsx dependency',
    status: hasTsx,
    message: hasTsx ? 'tsx está nas dependências' : 'tsx precisa estar nas dependências normais'
  });
}

// Verificar se .gitignore existe e tem configurações básicas
const gitignoreExists = fs.existsSync('.gitignore');
if (gitignoreExists) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const ignoresNodeModules = gitignoreContent.includes('node_modules');
  const ignoresDist = gitignoreContent.includes('dist');
  
  checks.push({
    name: '.gitignore',
    status: ignoresNodeModules && ignoresDist,
    message: (ignoresNodeModules && ignoresDist) ? 
      '.gitignore configurado corretamente' : 
      '.gitignore precisa incluir node_modules e dist'
  });
} else {
  checks.push({
    name: '.gitignore',
    status: false,
    message: '.gitignore não encontrado'
  });
}

// Mostrar resultados
console.log('📋 Resultados da verificação:\n');

let allGood = true;
checks.forEach(check => {
  const icon = check.status ? '✅' : '❌';
  console.log(`${icon} ${check.name}: ${check.message}`);
  if (!check.status) allGood = false;
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Tudo pronto para deploy no Heroku!');
  console.log('\nPróximos passos:');
  console.log('1. heroku create seu-nome-app');
  console.log('2. git push heroku main');
  console.log('3. heroku open');
} else {
  console.log('⚠️  Alguns itens precisam ser corrigidos antes do deploy.');
  console.log('\nConsulte o arquivo HEROKU_DEPLOYMENT.md para mais detalhes.');
}

console.log('\n💡 Para ver o guia completo: cat HEROKU_DEPLOYMENT.md');