# ⚠️ AÇÃO NECESSÁRIA: Configurar Cognito para Localhost

## 🎯 O login está funcionando, mas precisa adicionar localhost!

A URL que está sendo usada é:
```
https://us-east-1_2tPpeSefC.auth.us-east-1.amazoncognito.com/login
```

Mas o `redirect_uri` precisa incluir `localhost` para desenvolvimento.

---

## 📝 **Configure no AWS Cognito agora:**

### **1. Acesse o AWS Console:**
```
https://us-east-1.console.aws.amazon.com/cognito/v2/idp/user-pools/us-east-1_2tPpeSefC/app-integration/clients/2amt18k5uhrjtkklvpcotbtp8n
```

### **2. Clique em "Edit" (Editar)**

### **3. Na seção "Hosted UI" encontre:**

#### **Allowed callback URLs:**
Adicione (mantendo a URL existente):
```
http://localhost:3000/callback
https://d84l1y8p4kdic.cloudfront.net/callback
```

#### **Allowed sign-out URLs:**
Adicione:
```
http://localhost:3000
https://d84l1y8p4kdic.cloudfront.net
```

### **4. Verifique OAuth 2.0 grant types:**
- ✅ Authorization code grant

### **5. OpenID Connect scopes:**
- ✅ openid
- ✅ email
- ✅ phone
- ✅ profile

### **6. Clique em "Save changes"**

---

## 🧪 **Após configurar, teste:**

1. **Recarregue a página:**
   ```
   http://localhost:3000/login
   ```

2. **Clique em "Entrar com AWS Cognito"**

3. **Você será redirecionado para:**
   ```
   https://us-east-1_2tPpeSefC.auth.us-east-1.amazoncognito.com/login?
   client_id=2amt18k5uhrjtkklvpcotbtp8n&
   redirect_uri=http://localhost:3000/callback  👈 Agora com localhost!
   ```

4. **Faça login no Cognito**

5. **Será redirecionado de volta para:**
   ```
   http://localhost:3000/callback
   ```

6. **E depois para:**
   ```
   http://localhost:3000/dashboard
   ```

---

## 📸 **Captura de Tela do AWS Console:**

Você verá algo assim:

```
┌─────────────────────────────────────────┐
│ Edit app client                         │
├─────────────────────────────────────────┤
│ App client name: npcf-web-app          │
│                                         │
│ Hosted UI:                             │
│                                         │
│ Allowed callback URLs:                 │
│ ┌────────────────────────────────────┐ │
│ │ http://localhost:3000/callback     │ │
│ │ https://d84l1y8p4kdic...          │ │
│ └────────────────────────────────────┘ │
│                                         │
│ Allowed sign-out URLs:                 │
│ ┌────────────────────────────────────┐ │
│ │ http://localhost:3000              │ │
│ │ https://d84l1y8p4kdic...          │ │
│ └────────────────────────────────────┘ │
│                                         │
│ OAuth 2.0 grant types:                 │
│ ☑ Authorization code grant            │
│                                         │
│ OpenID Connect scopes:                 │
│ ☑ openid                              │
│ ☑ email                               │
│ ☑ phone                               │
│ ☑ profile                             │
└─────────────────────────────────────────┘
```

---

## ⚡ **Comando rápido via AWS CLI:**

Se preferir usar a linha de comando:

```bash
aws cognito-idp update-user-pool-client \
  --user-pool-id us-east-1_2tPpeSefC \
  --client-id 2amt18k5uhrjtkklvpcotbtp8n \
  --callback-urls "http://localhost:3000/callback" "https://d84l1y8p4kdic.cloudfront.net/callback" \
  --logout-urls "http://localhost:3000" "https://d84l1y8p4kdic.cloudfront.net" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid" "email" "phone" "profile" \
  --allowed-o-auth-flows-user-pool-client \
  --supported-identity-providers "COGNITO"
```

---

## ✅ **Checklist:**

- [ ] Abrir AWS Console
- [ ] Acessar User Pool `us-east-1_2tPpeSefC`
- [ ] Editar App Client `2amt18k5uhrjtkklvpcotbtp8n`
- [ ] Adicionar `http://localhost:3000/callback` em Callback URLs
- [ ] Adicionar `http://localhost:3000` em Sign-out URLs
- [ ] Salvar mudanças
- [ ] Recarregar página `/login`
- [ ] Testar login

---

## 🎯 **Após configurar:**

A página de login do Cognito vai carregar normalmente, e você poderá:

1. **Fazer login com usuário existente** OU
2. **Criar nova conta** (se signup estiver habilitado)

---

**Configure isso no AWS Console e depois me avise para testarmos juntos!** 🚀
