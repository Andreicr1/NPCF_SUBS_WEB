# 📦 Instalação das Dependências do Sistema de Autenticação

## 🚀 Comandos para Executar

Execute os seguintes comandos no terminal para instalar as novas dependências:

```bash
# Instalar jose (JWT handling)
npm install jose

# Instalar resend (Email service - Recomendado)
npm install resend

# OU instalar SendGrid (alternativa)
# npm install @sendgrid/mail
```

## ✅ Dependências Já Incluídas no package.json

As seguintes dependências foram **adicionadas** ao `package.json`:

- ✅ **jose**: `^5.9.6` - Para JWT (tokens de autenticação)
- ✅ **resend**: `^4.0.1` - Para envio de emails

## 📋 Instalação Completa

Se preferir instalar todas as dependências do projeto de uma vez:

```bash
npm install
```

Isso irá instalar automaticamente todas as dependências listadas no `package.json`, incluindo as novas dependências de autenticação.

## 🔧 Verificar Instalação

Para verificar se as dependências foram instaladas corretamente:

```bash
# Verificar se jose está instalado
npm list jose

# Verificar se resend está instalado
npm list resend
```

## 📝 Próximos Passos Após Instalação

1. **Configurar variáveis de ambiente** (`.env`):
   ```bash
   JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"
   RESEND_API_KEY="re_sua_api_key_aqui"
   EMAIL_FROM="noreply@seudominio.com"
   ```

2. **Gerar Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Executar Migrations**:
   ```bash
   npx prisma migrate dev --name add_auth_system
   ```

4. **Iniciar aplicação**:
   ```bash
   npm run dev
   ```

## ⚠️ Notas Importantes

- **jose**: Biblioteca moderna para JWT, mais leve que jsonwebtoken
- **resend**: Serviço de email moderno e fácil de usar (recomendado)
- **SendGrid**: Alternativa ao Resend, caso prefira (não incluído no package.json)

## 🆘 Solução de Problemas

Se encontrar erros durante a instalação:

1. **Limpar cache do npm**:
   ```bash
   npm cache clean --force
   ```

2. **Deletar node_modules e reinstalar**:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

3. **Verificar versão do Node.js** (recomendado: 18.x ou superior):
   ```bash
   node --version
   ```

## ✅ Checklist de Instalação

- [ ] Executar `npm install jose`
- [ ] Executar `npm install resend`
- [ ] Verificar instalação com `npm list jose resend`
- [ ] Configurar `.env` com credenciais
- [ ] Executar `npx prisma generate`
- [ ] Executar `npx prisma migrate dev`
- [ ] Testar com `npm run dev`

---

**Após seguir estes passos, o sistema de autenticação estará 100% pronto!** 🎉
