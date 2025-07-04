# Guia de Deploy no Heroku - Plataforma Leilões Caixa

Este guia vai ajudar você a fazer deploy da aplicação de leilões da Caixa no Heroku.

## Pré-requisitos

1. Conta no Heroku (gratuita): https://signup.heroku.com/
2. Heroku CLI instalado: https://devcenter.heroku.com/articles/heroku-cli
3. Git instalado no seu computador

## Passos para Deploy

### 1. Configurar o Heroku CLI

```bash
# Fazer login no Heroku
heroku login

# Verificar se está logado
heroku auth:whoami
```

### 2. Criar aplicação no Heroku

```bash
# Criar nova aplicação (escolha um nome único)
heroku create seu-nome-app-leiloes-caixa

# Ou usar um nome automático
heroku create
```

### 3. Configurar variáveis de ambiente

```bash
# Configurar ambiente de produção
heroku config:set NODE_ENV=production

# Configurar para instalar devDependencies durante build
heroku config:set NPM_CONFIG_PRODUCTION=false

# Se você tiver chave da API For4Payments, configure:
heroku config:set FOR4PAYMENTS_SECRET_KEY=sua_chave_aqui

# Para ver todas as variáveis configuradas
heroku config
```

### 4. Configurar buildpack Node.js

```bash
heroku buildpacks:set heroku/nodejs
```

### 5. Fazer deploy

```bash
# Adicionar o repositório Heroku como remote
heroku git:remote -a seu-nome-app-leiloes-caixa

# Fazer commit de todas as mudanças
git add .
git commit -m "Configuração para deploy no Heroku"

# Fazer push para o Heroku
git push heroku main
```

### 6. Verificar o deploy

```bash
# Abrir a aplicação no navegador
heroku open

# Ver logs da aplicação
heroku logs --tail

# Ver status da aplicação
heroku ps
```

## Estrutura de Deploy

O projeto foi configurado com:

- **Procfile**: Define que o Heroku deve executar `node --import tsx/esm server/index.ts`
- **app.json**: Configurações específicas do Heroku  
- **postinstall.js**: Script que constrói os assets do cliente após npm install
- **Porto dinâmico**: A aplicação usa `process.env.PORT` do Heroku
- **Dependências**: Todas as dependências críticas movidas para dependencies (não devDependencies)

## Scripts Importantes

- `npm run build`: Constrói a aplicação para produção
- `npm run start`: Inicia o servidor em produção
- `npm run dev`: Execução local (desenvolvimento)

## Comandos Úteis

```bash
# Reiniciar a aplicação
heroku restart

# Executar comandos na aplicação
heroku run bash

# Ver configurações da aplicação
heroku info

# Escalar dynos (instâncias)
heroku ps:scale web=1

# Ver logs em tempo real
heroku logs --tail
```

## Solução de Problemas

### Erro de Build

Se o build falhar:

```bash
# Ver logs detalhados do build
heroku logs --tail

# Verificar se todas as dependências estão corretas
heroku run npm list
```

### Erro de Porta

Se a aplicação não iniciar:

- Verifique se está usando `process.env.PORT`
- Confirme que o Procfile está correto

### Erro de Dependências

Se faltarem dependências:

```bash
# Verificar package.json
heroku run cat package.json

# Instalar dependência específica
heroku run npm install nome-da-dependencia
```

## Monitoramento

- **Logs**: `heroku logs --tail`
- **Métricas**: Disponíveis no dashboard do Heroku
- **Alertas**: Configure no painel do Heroku

## Custos

- **Dyno gratuito**: 550 horas/mês (suficiente para testes)
- **Hobby Dyno**: $7/mês (sempre ativo)
- **Standard Dyno**: $25/mês (recursos profissionais)

## URLs Importantes

- Dashboard Heroku: https://dashboard.heroku.com/
- Documentação: https://devcenter.heroku.com/
- Status: https://status.heroku.com/

## Próximos Passos

1. Configure um domínio personalizado (opcional)
2. Configure SSL (incluído gratuitamente)
3. Configure monitoramento e alertas
4. Configure backup de dados se necessário

Sua aplicação estará disponível em: `https://seu-nome-app.herokuapp.com`