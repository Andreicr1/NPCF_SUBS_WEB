# 🔧 Troubleshooting - AWS Cognito Login

## ✅ **Servidor Rodando**

```
✓ Next.js 14.2.33
✓ Local: http://localhost:3000
✓ Ready in 1786ms
```

---

## 📋 **O que verificar agora:**

### **1️⃣ Abra o navegador e acesse:**
```
http://localhost:3000/login
```

### **2️⃣ Abra o Console do Navegador (F12)**

Veja a aba **Console** para erros JavaScript.

### **3️⃣ Verifique o Status de Debug na Página**

A página mostra:
```
Status:
• Loading: ✅ Sim / ❌ Não
• Authenticated: ✅ Sim / ❌ Não
• Has User: ✅ Sim / ❌ Não
• Error: (mensagem se houver)
```

---

## 🚨 **Possíveis Problemas e Soluções**

### **Problema 1: Página fica com "Loading: ✅ Sim" para sempre**

**Causa:** `react-oidc-context` travou no carregamento inicial

**Solução:**
1. Recarregue a página (Ctrl+R ou F5)
2. Limpe o cache do navegador (Ctrl+Shift+Del)
3. Verifique se há erro no console

---

### **Problema 2: Erro "redirect_uri_mismatch"**

**Causa:** URL de callback não configurada no Cognito

**Solução:**

1. **Acesse AWS Console:**
   ```
   https://console.aws.amazon.com/cognito
   ```

2. **User Pool:** `us-east-1_2tPpeSefC`

3. **App Integration → App client:** `2amt18k5uhrjtkklvpcotbtp8n`

4. **Adicione nas Allowed callback URLs:**
   ```
   http://localhost:3000/callback
   ```

5. **Adicione nas Allowed sign-out URLs:**
   ```
   http://localhost:3000
   ```

6. **Habilite OAuth flows:**
   - ✅ Authorization code grant
   - ✅ Allow scopes: openid, email, phone, profile

---

### **Problema 3: Erro "invalid_request" ou "unauthorized_client"**

**Causa:** OAuth não está habilitado no App Client

**Solução:**

No AWS Cognito Console:
1. User Pool → App integration
2. Edit App client
3. Marque: ✅ **Enable OAuth 2.0 flows**
4. Marque: ✅ **Authorization code grant**
5. Scopes: `openid`, `email`, `phone`, `profile`

---

### **Problema 4: Página em branco**

**Causa:** Erro JavaScript quebrando o React

**Solução:**

1. Abra Console do Navegador (F12)
2. Veja aba **Console** para erros
3. Veja aba **Network** para requisições falhando

Erros comuns:
- `Cannot find module 'react-oidc-context'` → Reinstalar dependências
- `auth is undefined` → Provider não envolvendo app

---

### **Problema 5: Botão não faz nada ao clicar**

**Causa:** `signinRedirect()` não funcionando

**Debug:**

1. Abra Console do Navegador
2. Clique no botão
3. Veja mensagem: `"Iniciando login..."`
4. Se aparecer erro, copie e me envie

---

## 🔍 **Debug Manual**

No Console do Navegador, execute:

```javascript
// Ver configuração do AuthProvider
console.log(window.localStorage);

// Ver se há token salvo
console.log(window.localStorage.getItem('oidc.user:https://cognito-idp.us-east-1.amazonaws.com/us-east-1_2tPpeSefC:2amt18k5uhrjtkklvpcotbtp8n'));
```

---

## ✅ **Teste Rápido**

### **1. Verificar se dependências foram instaladas:**
```bash
npm list oidc-client-ts react-oidc-context
```

Deve mostrar:
```
oidc-client-ts@3.x.x
react-oidc-context@3.x.x
```

### **2. Verificar se arquivo existe:**
```bash
dir components\CognitoAuthProvider.tsx
```

### **3. Verificar se .env está correto:**
```bash
type .env
```

Deve conter:
```
NEXT_PUBLIC_COGNITO_AUTHORITY="https://cognito-idp.us-east-1.amazonaws.com/us-east-1_2tPpeSefC"
NEXT_PUBLIC_COGNITO_CLIENT_ID="2amt18k5uhrjtkklvpcotbtp8n"
NEXT_PUBLIC_COGNITO_DOMAIN="https://us-east-1_2tPpeSefC.auth.us-east-1.amazoncognito.com"
```

---

## 📸 **O que você deve ver na página**

### **Antes de clicar:**
```
┌─────────────────────────────────┐
│  Netz Private Credit Fund       │
│  Portal do Investidor           │
│                                 │
│  Status:                        │
│  • Loading: ❌ Não             │
│  • Authenticated: ❌ Não       │
│  • Has User: ❌ Não            │
│                                 │
│  [Entrar com AWS Cognito]       │
│                                 │
│  🔒 Autenticação segura via AWS │
└─────────────────────────────────┘
```

### **Ao clicar no botão:**
Deve redirecionar para:
```
https://us-east-1_2tPpeSefC.auth.us-east-1.amazoncognito.com/login?...
```

---

## 🆘 **Se nada funcionar**

### **Reinstalar dependências:**
```bash
rd /s /q node_modules
del package-lock.json
npm install
npm install oidc-client-ts react-oidc-context
npm run dev
```

### **Verificar versões:**
```bash
npm list next react react-dom
```

---

## 📞 **Informações para me enviar se precisar ajuda:**

1. **Mensagens do Console do Navegador** (F12 → Console)
2. **Status da página de debug** (Loading/Authenticated/Error)
3. **Screenshot da página**
4. **Mensagens do terminal**

---

## ✅ **Checklist Rápido**

- [ ] Servidor rodando (`npm run dev`)
- [ ] Página carrega em `http://localhost:3000/login`
- [ ] Status mostra: Loading: ❌ Não
- [ ] Botão "Entrar com AWS Cognito" visível
- [ ] Console do navegador sem erros
- [ ] Callback URLs configuradas no Cognito
- [ ] OAuth habilitado no App Client

---

**Acesse http://localhost:3000/login e me diga o que você vê!** 👀

Se aparecer algum erro, copie a mensagem exata e me envie! 🚀
