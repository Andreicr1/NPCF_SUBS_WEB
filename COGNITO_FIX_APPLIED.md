# 🔧 Correção de Invalid Scope - AWS Cognito

## ✅ Mudanças Aplicadas

### 1. **CognitoAuthProvider.tsx** - Corrigido Authority e Scopes

**ANTES:**
```typescript
authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_2tPpeSefC",
scope: "email openid phone profile",
```

**DEPOIS:**
```typescript
authority: "https://us-east-12tppesefc.auth.us-east-1.amazoncognito.com",
scope: "openid email phone",
```

**Motivo da correção:**
- ❌ **Authority estava errado**: Usava User Pool ID URL ao invés do Hosted UI domain
- ❌ **Scope "profile" não permitido**: Não está habilitado no App Client do Cognito
- ✅ **Agora usa**: Domínio correto do Hosted UI
- ✅ **Scopes válidos**: Apenas os habilitados (openid, email, phone)

---

### 2. **AuthButtons.tsx** - Componente Criado

Novo componente com:
- ✅ Login via `auth.signinRedirect()`
- ✅ Logout correto com redirect para Cognito Hosted UI
- ✅ UI moderna com Tailwind CSS
- ✅ Exibição de tokens (ID, Access, Refresh) em `<details>`
- ✅ Loading states e error handling

**Como usar:**
```tsx
import AuthButtons from '@/components/AuthButtons';

<AuthButtons />
```

---

### 3. **Dashboard.tsx** - Corrigido Cognito Domain

**ANTES:**
```typescript
const cognitoDomain = "https://us-east-1_2tPpeSefC.auth.us-east-1.amazoncognito.com";
```

**DEPOIS:**
```typescript
const cognitoDomain = "https://us-east-12tppesefc.auth.us-east-1.amazoncognito.com";
```

---

## 🧪 Como Testar

### 1. **Limpar Cache do Browser**

```bash
# Chrome/Edge: Ctrl + Shift + Delete
# Selecione: Cookies e Cache
# Período: Tudo
```

### 2. **Reiniciar o Servidor Next.js**

```bash
# Parar o servidor (Ctrl + C)
npm run dev
```

### 3. **Acessar a Aplicação**

```
http://localhost:3000
```

### 4. **Fluxo Esperado**

1. ✅ Landing page carrega
2. ✅ Clica "Acessar Portal" → redireciona para `/login`
3. ✅ `/login` redireciona automaticamente para Cognito Hosted UI
4. ✅ Login no Cognito com suas credenciais
5. ✅ Cognito redireciona para `/callback` **SEM ERRO**
6. ✅ `/callback` processa tokens e redireciona para `/dashboard`
7. ✅ Dashboard mostra seus dados do usuário
8. ✅ Botão "Sign Out" funciona corretamente

---

## 🚨 Se Ainda Houver Erro

### **Erro: "redirect_uri_mismatch"**

**Solução**: Adicionar callback URLs no AWS Cognito Console:

1. AWS Console → Cognito User Pools → `us-east-1_2tPpeSefC`
2. App Integration → App client `2amt18k5uhrjtkklvpcotbtp8n`
3. **Allowed callback URLs**:
   ```
   http://localhost:3000/callback
   https://d84l1y8p4kdic.cloudfront.net/callback
   ```
4. **Allowed sign-out URLs**:
   ```
   http://localhost:3000
   https://d84l1y8p4kdic.cloudfront.net
   ```

### **Erro: "invalid_client"**

**Solução**: Verificar Client ID no `.env`:
```bash
NEXT_PUBLIC_COGNITO_CLIENT_ID="2amt18k5uhrjtkklvpcotbtp8n"
```

### **Erro: "unauthorized_client"**

**Solução**: Verificar OAuth flows no Cognito:
- ✅ Authorization code grant
- ❌ Implicit grant (desabilitar)

---

## 📋 Checklist Pós-Correção

- [x] Authority corrigido para Hosted UI domain
- [x] Scope removido "profile"
- [x] AuthButtons.tsx criado
- [x] Dashboard.tsx corrigido
- [ ] Cache do browser limpo
- [ ] Servidor reiniciado
- [ ] Teste completo do fluxo de login
- [ ] Callback URLs configuradas no AWS Console

---

## 🎯 Resultado Esperado

**Antes da correção:**
```
❌ Callback error: {message: 'invalid_scope'}
❌ Loop infinito de redirects
```

**Depois da correção:**
```
✅ Login redireciona para Cognito
✅ Cognito retorna para /callback com code=XXXXX
✅ Tokens trocados com sucesso
✅ Dashboard carrega com dados do usuário
✅ Logout funciona corretamente
```

---

## 📚 Documentação de Referência

- [AWS Cognito Hosted UI](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-integration.html)
- [react-oidc-context](https://github.com/authts/react-oidc-context)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)

---

**Data da Correção:** 15 de outubro de 2025  
**Status:** ✅ Aplicado e pronto para teste
