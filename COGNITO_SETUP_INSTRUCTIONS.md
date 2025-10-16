# 🔧 Configuração do AWS Cognito User Pool

## ⚠️ IMPORTANTE: Configure o Redirect URI no Cognito

Para o login funcionar, você precisa configurar as URLs de callback no AWS Cognito:

---

## 📝 **Passos para Configurar**

### 1️⃣ **Acesse o AWS Console**
```
https://console.aws.amazon.com/cognito
```

### 2️⃣ **Selecione seu User Pool**
```
us-east-1_2tPpeSefC
```

### 3️⃣ **Vá para App Integration → App client**
```
App client ID: 2amt18k5uhrjtkklvpcotbtp8n
```

### 4️⃣ **Editar Hosted UI Settings**

Adicione as seguintes URLs:

#### **Allowed callback URLs:**
```
http://localhost:3000/callback
https://d84l1y8p4kdic.cloudfront.net/callback
```

#### **Allowed sign-out URLs:**
```
http://localhost:3000
https://d84l1y8p4kdic.cloudfront.net
```

#### **Allowed OAuth Flows:**
- ✅ Authorization code grant
- ⬜ Implicit grant

#### **Allowed OAuth Scopes:**
- ✅ openid
- ✅ email
- ✅ phone
- ✅ profile

---

## 🔍 **Verificar Configuração Atual**

Execute este comando para ver sua configuração atual:

```bash
aws cognito-idp describe-user-pool-client \
  --user-pool-id us-east-1_2tPpeSefC \
  --client-id 2amt18k5uhrjtkklvpcotbtp8n
```

---

## ✅ **Configuração Correta (JSON)**

```json
{
  "UserPoolClient": {
    "UserPoolId": "us-east-1_2tPpeSefC",
    "ClientId": "2amt18k5uhrjtkklvpcotbtp8n",
    "CallbackURLs": [
      "http://localhost:3000/callback",
      "https://d84l1y8p4kdic.cloudfront.net/callback"
    ],
    "LogoutURLs": [
      "http://localhost:3000",
      "https://d84l1y8p4kdic.cloudfront.net"
    ],
    "AllowedOAuthFlows": [
      "code"
    ],
    "AllowedOAuthScopes": [
      "openid",
      "email",
      "phone",
      "profile"
    ],
    "AllowedOAuthFlowsUserPoolClient": true
  }
}
```

---

## 🚨 **Erros Comuns**

### **Erro: "redirect_uri_mismatch"**
**Causa:** URL de callback não está registrada no Cognito
**Solução:** Adicionar URL exata nas "Allowed callback URLs"

### **Erro: "invalid_request"**
**Causa:** OAuth flows não habilitados
**Solução:** Marcar "Authorization code grant" e "Enable OAuth flows"

### **Erro: "unauthorized_client"**
**Causa:** Client não tem permissão para OAuth
**Solução:** Marcar "AllowedOAuthFlowsUserPoolClient: true"

---

## 🔧 **Atualizar via AWS CLI**

```bash
aws cognito-idp update-user-pool-client \
  --user-pool-id us-east-1_2tPpeSefC \
  --client-id 2amt18k5uhrjtkklvpcotbtp8n \
  --callback-urls "http://localhost:3000/callback" "https://d84l1y8p4kdic.cloudfront.net/callback" \
  --logout-urls "http://localhost:3000" "https://d84l1y8p4kdic.cloudfront.net" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid" "email" "phone" "profile" \
  --allowed-o-auth-flows-user-pool-client
```

---

## 📱 **Testar Configuração**

Após configurar, teste acessando:

```
http://localhost:3000/login
```

Abra o Console do Navegador (F12) e veja se aparece algum erro.

---

## 🔍 **Debug no Browser Console**

Abra a página `/login` e veja no console:

```javascript
Status:
• Loading: ✅ Sim / ❌ Não
• Authenticated: ✅ Sim / ❌ Não
• Has User: ✅ Sim / ❌ Não
• Error: (mensagem de erro se houver)
```

---

## ✅ **Checklist**

- [ ] Callback URLs configuradas no Cognito
- [ ] Logout URLs configuradas no Cognito
- [ ] OAuth flows habilitados (code)
- [ ] OAuth scopes configurados (openid, email, phone, profile)
- [ ] AllowedOAuthFlowsUserPoolClient = true
- [ ] Página /login carregando sem erros
- [ ] Console do navegador sem erros

---

**Após configurar, recarregue a página `/login` e tente fazer login!** 🚀
