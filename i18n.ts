// Traduções PT-BR para o portal
export const translations = {
  // Wizard Steps
  steps: {
    personalData: 'Dados Pessoais',
    qualification: 'Qualificação',
    bankData: 'Dados Bancários',
    subscription: 'Subscrição',
    aml: 'Prevenção à Lavagem de Dinheiro',
    documents: 'Documentos',
    review: 'Revisão',
    signature: 'Assinatura',
  },

  // Form Labels
  labels: {
    investorType: 'Tipo de Investidor',
    individual: 'Pessoa Física',
    entity: 'Pessoa Jurídica',
    fullName: 'Nome Completo',
    legalName: 'Razão Social',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    rg: 'RG',
    birthDate: 'Data de Nascimento',
    nationality: 'Nacionalidade',
    maritalStatus: 'Estado Civil',
    profession: 'Profissão',
    
    // Endereço
    address: 'Endereço',
    addressNumber: 'Número',
    complement: 'Complemento',
    neighborhood: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    zipCode: 'CEP',
    country: 'País',
    
    // Contato
    email: 'E-mail',
    phone: 'Telefone',
    cellphone: 'Celular',
    
    // Qualificação
    isQualified: 'É um investidor qualificado?',
    qualificationType: 'Tipo de Qualificação',
    professional: 'Profissional do mercado financeiro',
    assets: 'Patrimônio acima de R$ 1.000.000',
    income: 'Renda anual acima de R$ 200.000',
    
    // Banco
    bankName: 'Nome do Banco',
    bankBranch: 'Agência',
    bankAccount: 'Conta',
    bankAccountType: 'Tipo de Conta',
    checking: 'Conta Corrente',
    savings: 'Conta Poupança',
    
    // Subscrição
    subscriptionAmount: 'Valor da Subscrição',
    numberOfQuotas: 'Número de Cotas',
    quotaValue: 'Valor da Cota',
    
    // AML/PEP
    isPep: 'É uma Pessoa Politicamente Exposta (PEP)?',
    pepDetails: 'Detalhes da Exposição Política',
    pepPosition: 'Cargo/Posição Política',
    pepCountry: 'País de Exposição Política',
    isRca: 'É uma Pessoa Relacionada ou Associada a PEP?',
    rcaRelationship: 'Tipo de Relacionamento com PEP',
    
    // Source of Funds/Wealth
    sourceOfFunds: 'Origem dos Recursos (Source of Funds)',
    sourceOfWealth: 'Origem do Patrimônio (Source of Wealth)',
    employerName: 'Nome do Empregador',
    employerAddress: 'Endereço do Empregador',
    purposeOfAccount: 'Finalidade da Conta/Investimento',
    expectedActivity: 'Atividade Esperada',
    fundingSource: 'Origem dos Fundos',
    
    // FATCA/CRS
    isUsCitizen: 'É cidadão americano ou residente fiscal nos EUA?',
    ustin: 'U.S. TIN (Número de Identificação Fiscal dos EUA)',
    usBirthplace: 'Local de Nascimento nos EUA',
    hasSurrenderedUsCitizenship: 'Renunciou à cidadania americana?',
    taxResidency: 'Residência Fiscal',
    taxResidencies: 'Residências Fiscais',
    taxReferenceNumber: 'Número de Identificação Fiscal (TIN)',
    taxReferenceNumberType: 'Tipo de TIN',
    reasonForNoTin: 'Motivo para não ter TIN',
    
    // Beneficial Ownership
    beneficialOwner: 'Beneficiário Final',
    beneficialOwners: 'Beneficiários Finais',
    hasNoBeneficialOwner: 'Não há beneficiário final',
    ownershipPercentage: 'Percentual de Participação',
    controlType: 'Tipo de Controle',
  },

  // Validation Messages
  validation: {
    required: 'Este campo é obrigatório',
    invalidEmail: 'E-mail inválido',
    invalidCPF: 'CPF inválido',
    invalidCNPJ: 'CNPJ inválido',
    invalidPhone: 'Telefone inválido',
    invalidZipCode: 'CEP inválido',
    minAmount: 'Valor mínimo: R$ 25.000,00',
    maxAmount: 'Valor máximo excedido',
  },

  // Buttons
  buttons: {
    next: 'Próximo',
    previous: 'Anterior',
    save: 'Salvar',
    submit: 'Enviar',
    cancel: 'Cancelar',
    upload: 'Enviar Arquivo',
    download: 'Baixar',
    sign: 'Assinar Documento',
  },

  // Messages
  messages: {
    saving: 'Salvando...',
    saved: 'Dados salvos com sucesso!',
    submitting: 'Enviando...',
    submitted: 'Formulário enviado com sucesso!',
    error: 'Ocorreu um erro. Tente novamente.',
    uploadSuccess: 'Arquivo enviado com sucesso!',
    uploadError: 'Erro ao enviar arquivo',
  },

  // Document Types
  documentTypes: {
    cpf: 'CPF',
    rg: 'RG ou CNH',
    cnpj: 'Cartão CNPJ',
    proofOfAddress: 'Comprovante de Residência',
    proofOfIncome: 'Comprovante de Renda',
    bankStatement: 'Extrato Bancário',
    contractSocial: 'Contrato Social',
    other: 'Outro',
  },

  // Required Documents
  requiredDocuments: {
    individual: [
      { type: 'cpf', label: 'CPF', description: 'Documento de identificação fiscal' },
      { type: 'rg', label: 'RG ou CNH', description: 'Documento de identidade com foto' },
      { type: 'proofOfAddress', label: 'Comprovante de Residência', description: 'Com data dos últimos 90 dias' },
      { type: 'proofOfIncome', label: 'Comprovante de Renda', description: 'Declaração de IR ou holerite' },
    ],
    entity: [
      { type: 'cnpj', label: 'Cartão CNPJ', description: 'Documento de identificação fiscal da empresa' },
      { type: 'contractSocial', label: 'Contrato Social', description: 'Com última alteração consolidada' },
      { type: 'proofOfAddress', label: 'Comprovante de Endereço', description: 'Com data dos últimos 90 dias' },
      { type: 'bankStatement', label: 'Extrato Bancário', description: 'Dos últimos 3 meses' },
    ],
  },
};

// Mapeamento de campos PT → EN para o PDF
export const fieldMapping: Record<string, string> = {
  // Personal Data
  'nomeCompleto': 'full_name',
  'cpfCnpj': 'tax_id',
  'rg': 'id_number',
  'dataNascimento': 'birth_date',
  'nacionalidade': 'nationality',
  'estadoCivil': 'marital_status',
  'profissao': 'profession',
  
  // Address
  'endereco': 'address',
  'numero': 'address_number',
  'complemento': 'complement',
  'bairro': 'neighborhood',
  'cidade': 'city',
  'estado': 'state',
  'cep': 'zip_code',
  'pais': 'country',
  
  // Contact
  'email': 'email',
  'telefone': 'phone',
  'celular': 'cellphone',
  
  // Bank
  'banco': 'bank_name',
  'agencia': 'bank_branch',
  'conta': 'bank_account',
  'tipoConta': 'account_type',
  
  // Subscription
  'valorSubscricao': 'subscription_amount',
  'numeroCotas': 'number_of_quotas',
  'valorCota': 'quota_value',
  
  // AML
  'pep': 'is_pep',
  'detalhesPep': 'pep_details',
  'origemRecursos': 'origin_of_funds',
};

export default translations;