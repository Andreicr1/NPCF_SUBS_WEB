# Guia de Integração - NPCF Subscription Web

## ✅ Funcionalidades Restauradas

Este repositório foi atualizado para garantir que os dados coletados no aplicativo WEB sejam automaticamente transportados para os formulários originais em `/public/templates` e enviados para assinatura eletrônica via **Dropbox Sign**.

---

## 📋 Fluxo Completo de Subscrição

### 1. **Coleta de Dados (InvestmentWizard)**
O usuário preenche 7 etapas:
- Dados Pessoais
- Endereço e Contato
- PEP e AML (Prevenção à Lavagem de Dinheiro)
- FATCA/CRS (Residência Fiscal)
- Subscription Agreement
- Upload de Documentos
- Revisão Final

### 2. **Mapeamento de Campos (fieldMapping.ts)**
Os dados coletados são mapeados automaticamente para os campos dos PDFs:
```typescript
// Exemplo: Nome completo aparece em todos os formulários
{
  uiField: 'fullName',
  pdfMappings: [
    { formName: 'kyc', pdfField: 'Full legal name' },
    { formName: 'fatca', pdfField: 'Account Holder Name' },
    { formName: 'sourceOfWealth', pdfField: 'Name of Individual/Entity' },
    { formName: 'subscription', pdfField: 'Investor Name' },
  ]
}
```

### 3. **Geração de PDFs (pdfGenerator.ts)**
Usando `pdf-lib`, os templates são preenchidos com os dados:
- `KYC Client Questionnaire - Feb 2022.pdf`
- `FATCA_CRS_individual_self_cert_final_Dec_15.pdf`
- `Source_of_Funds_and_Wealth_Form.pdf`
- `Netz_Private_Credit_Fund_-_Main_Subscription_Documents_-_FINAL Compacted.pdf`

### 4. **Assinatura Eletrônica (Dropbox Sign)**
Os PDFs são enviados para o Dropbox Sign com:
- **Campos de assinatura posicionados automaticamente**
- **E-mail do investidor**
- **Instruções personalizadas**

### 5. **Webhook Handler**
Quando o investidor assina os documentos:
- O webhook `/api/webhooks/dropbox-sign` é notificado
- O status é atualizado no banco de dados
- Os PDFs assinados são armazenados

---

## 🔧 Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Configurar Dropbox Sign

#### a) Criar Conta
1. Acesse: https://app.hellosign.com/api/signatureRequestApi
2. Crie uma conta gratuita (50 assinaturas/mês em modo teste)
3. Ative o **API Access**

#### b) Obter API Key
1. Dashboard → Settings → API
2. Copie sua API Key
3. Cole em `.env`:
```
DROPBOX_SIGN_API_KEY="sua_chave_aqui"
```

#### c) Configurar Webhook
1. Dashboard → API → Webhooks
2. Adicione a URL do webhook:
```
https://seu-dominio.vercel.app/api/webhooks/dropbox-sign
```
3. Selecione os eventos:
   - ☑️ signature_request_sent
   - ☑️ signature_request_signed
   - ☑️ signature_request_all_signed
   - ☑️ signature_request_declined
   - ☑️ signature_request_expired

### 4. Configurar Banco de Dados
```bash
# Rodar migrações
npx prisma migrate dev

# Visualizar banco
npx prisma studio
```

### 5. Executar Aplicação
```bash
npm run dev
```

---

## 📁 Estrutura de Arquivos

### APIs
```
app/api/
├── pdfs/generate/route.ts      # Gera PDFs e envia para assinatura
├── kyc/submit/route.ts          # Submete dados KYC
├── documents/upload/route.ts    # Upload de documentos
└── webhooks/dropbox-sign/route.ts # Recebe notificações do Dropbox Sign
```

### Bibliotecas
```
lib/
├── pdfGenerator.ts              # Gera PDFs preenchidos
├── dropboxSign.ts               # Cliente Dropbox Sign
├── fieldMapping.ts              # Mapeamento de campos UI → PDF
├── fdf.ts                       # Serviço FDF (legado)
├── fatcaCrsValidation.ts        # Validação FATCA/CRS
└── types.ts                     # TypeScript types
```

### Componentes
```
components/
├── InvestmentWizard.tsx         # Wizard principal
├── PdfPreview.tsx               # Visualização de PDFs
├── FatcaCrsForm.tsx             # Formulário FATCA/CRS
├── PepAmlForm.tsx               # Formulário PEP/AML
└── SubscriptionAgreementForm.tsx # Formulário de subscrição
```

---

## 🎨 Visual Agradável para Assinatura

### Customização do E-mail
O investidor recebe um e-mail com:
```typescript
{
  title: `NPCF Subscription Documents - ${investor.fullName}`,
  subject: 'Please sign your NPCF subscription documents',
  message: `Dear ${investor.fullName},

Please review and sign the following documents to complete your subscription to Netz Private Credit Fund:

1. KYC Client Questionnaire
2. FATCA/CRS Self-Certification
3. Source of Funds and Wealth Form
4. Subscription Agreement

Thank you.`,
}
```

### Posicionamento de Campos de Assinatura
Coordenadas são definidas em `lib/dropboxSign.ts`:
```typescript
export const DEFAULT_SIGNATURE_FIELDS = {
  kyc: {
    documentIndex: 0,
    fields: [
      { page: 0, x: 100, y: 700, width: 200, height: 40, type: 'signature' },
      { page: 0, x: 100, y: 740, width: 150, height: 20, type: 'date' },
    ],
  },
  // ...
}
```

**Ajuste as coordenadas conforme necessário!**

---

## 🧪 Testando

### Modo de Teste
Com `DROPBOX_SIGN_TEST_MODE="true"`:
- Assinaturas não são contabilizadas no limite
- Documentos têm marca d'água "TEST MODE"
- Ideal para desenvolvimento

### Teste Manual
1. Preencha o wizard completo
2. Clique em "Finalizar e Enviar"
3. Verifique o e-mail do investidor
4. Assine os documentos
5. Confirme que o webhook foi recebido em `/api/webhooks/dropbox-sign`

---

## 📊 Monitoramento

### Logs
```bash
# Ver logs do servidor
npm run dev

# Ver logs do Prisma
npx prisma studio
```

### Dashboard Dropbox Sign
https://app.hellosign.com/home/manage

---

## 🔒 Segurança

### Validação de Webhook
O webhook valida a assinatura HMAC do Dropbox Sign:
```typescript
const signature = request.headers.get('x-hellosign-signature');
const expectedSignature = crypto
  .createHmac('sha256', apiKey)
  .update(eventJson)
  .digest('hex');

if (signature !== expectedSignature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### Auditoria
Todas as ações são registradas na tabela `AuditLog`:
- Submissão de KYC
- Geração de PDFs
- Assinaturas completadas
- Recusas

---

## 🚀 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Variáveis de Ambiente no Vercel
Configure em: **Project Settings → Environment Variables**

---

## 📞 Suporte

Para dúvidas sobre:
- **Dropbox Sign API**: https://developers.hellosign.com/
- **pdf-lib**: https://pdf-lib.js.org/
- **Prisma**: https://www.prisma.io/docs

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Templates PDF em `/public/templates`
- [ ] API Key do Dropbox Sign válida
- [ ] Webhook configurado
- [ ] Coordenadas de assinatura ajustadas
- [ ] Teste completo de ponta a ponta
- [ ] Deploy em produção

---

**Desenvolvido com ❤️ para NPCF**
