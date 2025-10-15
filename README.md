# Portal de Subscrição - Netz Private Credit Fund 🏦

Portal institucional em português para investidores preencherem dados, enviarem documentos KYC/AML e assinarem eletronicamente o Subscription Agreement.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **Assinatura Eletrônica**: Dropbox Sign (HelloSign)
- **Manipulação de PDF**: pdf-lib / FDF Toolkit

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Dropbox Sign (HelloSign)

## 🔧 Setup do Projeto

### 1. Clonar e Instalar Dependências

```bash
# Instalar dependências
npm install

# ou
yarn install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database
DATABASE_URL="file:./dev.db"

# Dropbox Sign (HelloSign)
DROPBOX_SIGN_API_KEY="sua_api_key_aqui"
DROPBOX_SIGN_CLIENT_ID="seu_client_id_aqui"
DROPBOX_SIGN_TEST_MODE="true"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_SECRET="seu_secret_key_min_32_chars"

# PDF Configuration
PDF_TEMPLATE_PATH="./public/documents/subscription_agreement_template.pdf"
UPLOAD_DIR="./uploads"

# Admin
ADMIN_EMAIL="admin@netzprivatecredit.com"
```

### 3. Configurar Dropbox Sign

1. Crie uma conta em [Dropbox Sign](https://www.dropboxsign.com/)
2. Vá em **API** > **Settings**
3. Copie sua **API Key**
4. Crie uma aplicação e copie o **Client ID**
5. Configure o callback URL: `https://seu-dominio.com/api/esign/webhook`

### 4. Adicionar Template PDF

Coloque o PDF original do Subscription Agreement em:

```
public/documents/subscription_agreement_template.pdf
```

### 5. Inicializar o Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar banco de dados e tabelas
npm run prisma:migrate

# Popular com dados de exemplo (opcional)
npm run prisma:seed

# Abrir Prisma Studio para visualizar dados (opcional)
npm run prisma:studio
```

### 6. Criar Pasta de Uploads

```bash
mkdir -p uploads
```

### 7. Rodar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# ou
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
netz-subscription-portal/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados iniciais
├── public/
│   └── documents/
│       └── subscription_agreement_template.pdf
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── investors/     # CRUD de investidores
│   │   │   ├── uploads/       # Upload de documentos
│   │   │   ├── pdf/
│   │   │   │   └── fill/      # Preencher PDF
│   │   │   ├── esign/
│   │   │   │   ├── dropbox/
│   │   │   │   │   └── start/ # Iniciar assinatura
│   │   │   │   └── webhook/   # Callback da assinatura
│   │   │   └── admin/
│   │   │       └── package/   # Gerar pacote ZIP
│   │   ├── subscribe/
│   │   │   └── page.tsx       # Wizard de subscrição
│   │   ├── layout.tsx
│   │   └── page.tsx           # Home
│   ├── components/            # Componentes React
│   │   ├── wizard/
│   │   ├── forms/
│   │   └── ui/
│   └── lib/                   # Bibliotecas e utils
│       ├── db.ts              # Prisma client
│       ├── fdf.ts             # Manipulação de PDF/FDF
│       ├── dropboxSign.ts     # Integração Dropbox Sign
│       ├── i18n.ts            # Traduções PT-BR
│       ├── validation.ts      # Validações (CPF, CNPJ, etc)
│       └── requiredDocs.ts    # Documentos obrigatórios
├── uploads/                   # Arquivos enviados
├── .env                       # Variáveis de ambiente
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Fluxo do Usuário

### 1. Wizard de Subscrição (8 Etapas)

1. **Dados Pessoais**: Nome, CPF/CNPJ, RG, Data de Nascimento, etc.
2. **Qualificação**: Investidor qualificado? Tipo de qualificação
3. **Dados Bancários**: Banco, Agência, Conta
4. **Subscrição**: Valor, Número de Cotas, Valor da Cota
5. **AML/KYC**: PEP, Origem dos Recursos
6. **Documentos**: Upload de CPF, RG, Comprovantes
7. **Revisão**: Revisão de todos os dados
8. **Assinatura**: Assinatura eletrônica do PDF

### 2. Processamento Backend

1. Salvar dados no banco de dados (Prisma)
2. Preencher PDF template com os dados (FDF/pdf-lib)
3. Enviar PDF para Dropbox Sign
4. Usuário assina o documento
5. Webhook recebe confirmação
6. Gerar pacote ZIP (PDF assinado + uploads + JSON)
7. Notificar administrador

## 🔐 APIs

### Investidores

- `GET /api/investors` - Listar investidores
- `POST /api/investors` - Criar investidor
- `GET /api/investors/[id]` - Buscar investidor
- `PUT /api/investors/[id]` - Atualizar investidor
- `DELETE /api/investors/[id]` - Deletar investidor

### Uploads

- `POST /api/uploads` - Upload de documento
- `GET /api/uploads/[id]` - Baixar documento
- `DELETE /api/uploads/[id]` - Deletar documento

### PDF

- `POST /api/pdf/fill` - Preencher PDF template

### E-Sign

- `POST /api/esign/dropbox/start` - Iniciar assinatura
- `POST /api/esign/webhook` - Callback do Dropbox Sign
- `GET /api/esign/status/[id]` - Status da assinatura

### Admin

- `POST /api/admin/package` - Gerar pacote ZIP para admin

## 🧪 Testes

```bash
# Rodar testes (quando implementados)
npm test
```

## 📦 Deploy

### Cloudflare Pages (Recomendado)

1. **Conectar Repositório:**
   - Acesse [Cloudflare Pages](https://pages.cloudflare.com/)
   - Clique em "Create a project"
   - Conecte seu repositório Git (GitHub/GitLab)

2. **Configurar Build:**
   ```
   Build command: npm run build
   Build output directory: .next
   Root directory: (leave empty)
   Framework preset: Next.js
   ```

3. **Variáveis de Ambiente:**
   Adicione as seguintes variáveis no painel do Cloudflare Pages:
   ```
   DATABASE_URL=file:./dev.db
   NEXT_PUBLIC_APP_URL=https://seu-dominio.pages.dev
   DROPBOX_SIGN_API_KEY=sua_api_key
   DROPBOX_SIGN_CLIENT_ID=seu_client_id
   DROPBOX_SIGN_TEST_MODE=true
   APP_SECRET=seu_secret_key_min_32_chars
   ADMIN_EMAIL=admin@netzprivatecredit.com
   ```

4. **Deploy Automático:**
   - O deploy acontecerá automaticamente a cada push na branch main
   - O banco SQLite será criado automaticamente no ambiente de produção

   **Importante:** Certifique-se de selecionar "Next.js" como Framework preset no painel do Cloudflare Pages
   para evitar erros de detecção de output directory.

   **Nota:** As dependências TypeScript estão em `dependencies` ao invés de `devDependencies`
   porque o Cloudflare Pages não instala devDependencies por padrão durante o build.

### Outras Plataformas

#### Vercel
```bash
npm i -g vercel
vercel
```

#### AWS Amplify
1. Conecte o repositório no console do Amplify
2. Configure as variáveis de ambiente
3. Configure o banco de dados (RDS PostgreSQL)
4. Deploy automático

## 🛠️ Próximos Passos (TODO)

- [ ] Completar todas as APIs
- [ ] Implementar wizard frontend
- [ ] Adicionar validações de formulário
- [ ] Implementar upload de arquivos
- [ ] Integrar assinatura eletrônica
- [ ] Adicionar testes unitários
- [ ] Adicionar autenticação de admin
- [ ] Implementar painel administrativo
- [ ] Melhorar tratamento de erros
- [ ] Adicionar logs e monitoramento

## 📝 Licença

Propriedade de Netz Private Credit Fund. Todos os direitos reservados.

## 👥 Contato

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.