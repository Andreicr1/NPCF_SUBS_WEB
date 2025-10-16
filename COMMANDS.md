# Comandos Úteis - NPCF Subscription

## 🚀 Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm start
```

## 🗄️ Banco de Dados (Prisma)

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Abrir Prisma Studio (GUI)
npx prisma studio

# Ver status das migrations
npx prisma migrate status

# Criar seed (popular banco)
npm run seed
```

## 📝 Dropbox Sign (Debugging)

```bash
# Ver logs em tempo real
npm run dev | grep "Dropbox"

# Testar webhook localmente (ngrok)
ngrok http 3000
# Depois configure webhook: https://xxx.ngrok.io/api/webhooks/dropbox-sign

# Verificar API Key
curl -X GET "https://api.hellosign.com/v3/account" \
  -u "YOUR_API_KEY:"
```

## 🧪 Testes

```bash
# Rodar testes (se configurados)
npm test

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Format code
npx prettier --write .
```

## 📦 Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link projeto
vercel link

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável
vercel env add NOME_VAR
```

## 🐛 Debugging

```bash
# Ver logs do Next.js
npm run dev

# Ver logs do banco
DATABASE_URL="..." npx prisma studio

# Testar endpoint de PDFs
curl -X POST http://localhost:3000/api/pdfs/generate \
  -H "Content-Type: application/json" \
  -d '{"investorId":"xxx"}'

# Testar endpoint KYC
curl -X POST http://localhost:3000/api/kyc/submit \
  -H "Content-Type: application/json" \
  -d @test-data.json

# Verificar webhook
curl http://localhost:3000/api/webhooks/dropbox-sign
```

## 📊 Monitoramento

```bash
# Ver status do banco
npx prisma db execute --stdin < scripts/check_db.sql

# Ver investidores recentes
npx prisma studio
# Ou SQL direto:
# SELECT * FROM investors ORDER BY "createdAt" DESC LIMIT 10;

# Ver assinaturas pendentes
# SELECT * FROM signatures WHERE status = 'pending';

# Ver logs de auditoria
# SELECT * FROM audit_logs ORDER BY "createdAt" DESC LIMIT 50;
```

## 🔧 Manutenção

```bash
# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Limpar cache
rm -rf .next
rm -rf node_modules
npm install

# Recriar Prisma Client
rm -rf node_modules/.prisma
npx prisma generate
```

## 📄 PDFs

```bash
# Verificar templates
ls -lh public/templates/

# Testar geração manual (Node.js)
node -e "
const { generateKycPdf } = require('./lib/pdfGenerator');
generateKycPdf({fullName: 'Test'}, {}).then(() => console.log('OK'));
"

# Extrair campos de um PDF (pdf-lib)
node scripts/extract-pdf-fields.js public/templates/KYC*.pdf
```

## 🌐 Variáveis de Ambiente

```bash
# Copiar exemplo
cp .env.example .env

# Editar
nano .env
# ou
code .env

# Verificar se está carregando
node -e "console.log(process.env.DATABASE_URL)"
```

## 🚨 Emergência

```bash
# Reverter última migration
npx prisma migrate rollback

# Backup do banco
pg_dump $DATABASE_URL > backup.sql

# Restaurar backup
psql $DATABASE_URL < backup.sql

# Cancelar todas as solicitações pendentes no Dropbox
# (Use o dashboard: https://app.hellosign.com/home/manage)
```

## 📚 Documentação

```bash
# Gerar documentação da API (se configurado)
npm run docs

# Ver schema do Prisma
cat prisma/schema.prisma

# Ver todas as rotas da API
grep -r "export async function" app/api/
```

## 🎯 Atalhos Úteis

```bash
# Desenvolvimento completo
npm run dev & npx prisma studio

# Deploy rápido
git add . && git commit -m "Update" && git push && vercel --prod

# Resetar tudo
rm -rf .next node_modules && npm install && npx prisma generate

# Ver todos os investidores
npx prisma studio
# Ou: psql $DATABASE_URL -c "SELECT * FROM investors;"
```

---

**Dica**: Crie aliases no seu `.bashrc` ou `.zshrc`:

```bash
alias dev="npm run dev"
alias pstudio="npx prisma studio"
alias pmigrate="npx prisma migrate dev"
alias vdeploy="vercel --prod"
```
