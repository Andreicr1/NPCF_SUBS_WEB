import React, { useState } from 'react';
import { CompleteKycData, PepData, SourceData, FatcaCrsData, SubscriptionAgreementData } from '@/lib/types';
import { validateRequiredFields } from '@/lib/fieldMapping';
import useDocumentUpload from '../hooks/useDocumentUpload';
import PepAmlForm from './PepAmlForm';
import FatcaCrsForm from './FatcaCrsForm';
import SubscriptionAgreementForm from './SubscriptionAgreementForm';
import PdfPreview from './PdfPreview';

interface InvestmentWizardProps {
  fundId: string;
  onComplete: (data: InvestmentWizardData) => void;
}

// Type for investor data
type InvestorData = Record<string, any>;

export interface InvestmentWizardData {
  investor: Partial<InvestorData>;
  kycData: CompleteKycData;
  documents: {
    passport?: File;
    proofOfAddress?: File;
    bankStatement?: File;
    other?: File[];
  };
}

const STEPS = [
  { id: 1, name: 'Dados Pessoais', description: 'Informações básicas' },
  { id: 2, name: 'Endereço e Contato', description: 'Dados de contato' },
  { id: 3, name: 'PEP e AML', description: 'Prevenção à lavagem de dinheiro' },
  { id: 4, name: 'FATCA/CRS', description: 'Residência fiscal' },
  { id: 5, name: 'Subscription Agreement', description: 'Acordo de subscrição' },
  { id: 6, name: 'Documentos', description: 'Upload de documentos' },
  { id: 7, name: 'Revisão', description: 'Confirme seus dados' },
];

export const InvestmentWizard: React.FC<InvestmentWizardProps> = ({
  fundId,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<InvestmentWizardData>({
    investor: {},
    kycData: {
      pep: {
        isPep: false,
        isRca: false,
      } as PepData,
      source: {
        sourceOfFunds: '',
        sourceOfWealth: '',
        wealthCategories: [],
        wealthDetails: '',
        assetsArePersonalProperty: true,
        noAssetsFromCriminalActivity: true,
      } as SourceData,
      fatcaCrs: {
        isUsCitizen: false,
        taxResidencies: [],
      } as FatcaCrsData,
      subscription: {
        eligibleInvestorConfirmation: false,
        nonUsPersonConfirmation: false,
        shareClassSelection: '' as any,
        subscriptionAmount: 0,
        incomingBankLocation: '',
      } as SubscriptionAgreementData,
      purposeOfAccount: '',
      expectedActivity: '',
      fundingSource: '',
    },
    documents: {},
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = () => {
    // Validar step atual
    const stepErrors = validateCurrentStep();
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleComplete = () => {
    // Validação final
    const validation = validateRequiredFields(
      wizardData.investor,
      wizardData.kycData
    );

    if (!validation.isValid) {
      setErrors(validation.missingFields.map((f) => `Campo obrigatório: ${f}`));
      return;
    }

    onComplete(wizardData);
  };

  const validateCurrentStep = (): string[] => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1: // Dados Pessoais
        if (!wizardData.investor.fullName) errors.push('Nome completo é obrigatório');
        if (!wizardData.investor.birthDate) errors.push('Data de nascimento é obrigatória');
        if (!wizardData.investor.nationality) errors.push('Nacionalidade é obrigatória');
        break;

      case 2: // Endereço
        if (!wizardData.investor.address) errors.push('Endereço é obrigatório');
        if (!wizardData.investor.city) errors.push('Cidade é obrigatória');
        if (!wizardData.investor.country) errors.push('País é obrigatório');
        if (!wizardData.investor.email) errors.push('Email é obrigatório');
        if (!wizardData.investor.phone) errors.push('Telefone é obrigatório');
        break;

      case 3: // PEP/AML
        if (!wizardData.kycData.source.sourceOfWealth) {
          errors.push('Origem do patrimônio é obrigatória');
        }
        if (!wizardData.kycData.source.sourceOfFunds) {
          errors.push('Origem dos recursos é obrigatória');
        }
        if (wizardData.kycData.pep.isPep && !wizardData.kycData.pep.pepDetails) {
          errors.push('Detalhes da exposição política são obrigatórios');
        }
        break;

      case 4: // FATCA/CRS
        if (wizardData.kycData.fatcaCrs.taxResidencies.length === 0) {
          errors.push('Ao menos uma residência fiscal é obrigatória');
        }
        if (wizardData.kycData.fatcaCrs.isUsCitizen && !wizardData.kycData.fatcaCrs.ustin) {
          errors.push('U.S. TIN é obrigatório para cidadãos americanos');
        }
        break;

      case 5: // Subscription Agreement
        if (!wizardData.kycData.subscription.eligibleInvestorConfirmation) {
          errors.push('Confirme que é um investidor elegível');
        }
        if (!wizardData.kycData.subscription.nonUsPersonConfirmation) {
          errors.push('Confirme que não é uma U.S. Person');
        }
        if (!wizardData.kycData.subscription.shareClassSelection) {
          errors.push('Selecione uma classe de ações');
        }
        if (!wizardData.kycData.subscription.subscriptionAmount || wizardData.kycData.subscription.subscriptionAmount < 100000) {
          errors.push('Valor mínimo de subscrição: USD 100,000');
        }
        if (!wizardData.kycData.subscription.incomingBankLocation) {
          errors.push('Localização do banco de origem é obrigatória');
        }
        break;

      case 6: // Documentos
        if (!wizardData.documents.passport) {
          errors.push('Cópia do passaporte é obrigatória');
        }
        if (!wizardData.documents.proofOfAddress) {
          errors.push('Comprovante de endereço é obrigatório');
        }
        break;
    }

    return errors;
  };

  const updateInvestor = (field: string | number | symbol, value: any) => {
    setWizardData({
      ...wizardData,
      investor: {
        ...wizardData.investor,
        [field]: value,
      },
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={wizardData.investor} onChange={updateInvestor} />;
      case 2:
        return <AddressContactStep data={wizardData.investor} onChange={updateInvestor} />;
      case 3:
        return (
          <PepAmlForm
            pepData={wizardData.kycData.pep}
            sourceData={wizardData.kycData.source}
            onPepChange={(pep) =>
              setWizardData({
                ...wizardData,
                kycData: { ...wizardData.kycData, pep },
              })
            }
            onSourceChange={(source) =>
              setWizardData({
                ...wizardData,
                kycData: { ...wizardData.kycData, source },
              })
            }
          />
        );
      case 4:
        return (
          <FatcaCrsForm
            data={wizardData.kycData.fatcaCrs}
            onChange={(fatcaCrs) =>
              setWizardData({
                ...wizardData,
                kycData: { ...wizardData.kycData, fatcaCrs },
              })
            }
          />
        );
      case 5:
        return (
          <SubscriptionAgreementForm
            data={wizardData.kycData.subscription}
            investorData={wizardData.investor}
            onChange={(subscription) =>
              setWizardData({
                ...wizardData,
                kycData: { ...wizardData.kycData, subscription },
              })
            }
          />
        );
      case 6:
        return (
          <DocumentUploadStep
            documents={wizardData.documents}
            onChange={(documents) =>
              setWizardData({
                ...wizardData,
                documents,
              })
            }
          />
        );
      case 7:
        return (
          <PdfPreview
            investor={wizardData.investor}
            kycData={wizardData.kycData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="text-xs mt-2 text-center">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Por favor, corrija os seguintes erros:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          Voltar
        </button>

        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Finalizar e Enviar
          </button>
        )}
      </div>
    </div>
  );
};

// Step Components (to be created separately)
interface StepProps {
  data: Partial<InvestorData>;
  onChange: (field: string | number | symbol, value: any) => void;
}

const PersonalInfoStep: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Dados Pessoais</h2>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo *
        </label>
        <input
          type="text"
          id="fullName"
          value={data.fullName || ''}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder="Como aparece no passaporte"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={data.dateOfBirth?.toString().split('T')[0] || ''}
            onChange={(e) => onChange('dateOfBirth', new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="countryOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            País de Nascimento *
          </label>
          <input
            type="text"
            id="countryOfBirth"
            value={data.countryOfBirth || ''}
            onChange={(e) => onChange('countryOfBirth', e.target.value)}
            placeholder="Brasil"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidade *
          </label>
          <input
            type="text"
            id="nationality"
            value={data.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
            placeholder="Brasileira"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
            Ocupação
          </label>
          <input
            type="text"
            id="occupation"
            value={data.occupation || ''}
            onChange={(e) => onChange('occupation', e.target.value)}
            placeholder="Engenheiro, Médico, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

const AddressContactStep: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Endereço e Contato</h2>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Endereço Completo *
        </label>
        <input
          type="text"
          id="address"
          value={data.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Rua, número, complemento"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Cidade *
          </label>
          <input
            type="text"
            id="city"
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            Estado/Província
          </label>
          <input
            type="text"
            id="state"
            value={data.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            CEP/Código Postal
          </label>
          <input
            type="text"
            id="postalCode"
            value={data.postalCode || ''}
            onChange={(e) => onChange('postalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          País *
        </label>
        <input
          type="text"
          id="country"
          value={data.country || ''}
          onChange={(e) => onChange('country', e.target.value)}
          placeholder="Brasil"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+55 11 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

interface DocumentUploadProps {
  investorId?: string;
  documents: InvestmentWizardData['documents'];
  onChange: (documents: InvestmentWizardData['documents']) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadProps> = ({ 
  investorId,
  documents, 
  onChange 
}) => {
  const {
    documents: uploadedDocs,
    uploadDocument,
    deleteDocument,
    uploading,
    error
  } = useDocumentUpload();

  const handleFileChange = async (
    field: keyof InvestmentWizardData['documents'], 
    file: File | null
  ) => {
    if (file && investorId) {
      // Fazer upload do arquivo
      try {
        await uploadDocument(file, field, investorId);
        onChange({
          ...documents,
          [field]: file,
        });
      } catch (error) {
        console.error('Error uploading:', error);
      }
    } else {
      onChange({
        ...documents,
        [field]: null,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Upload de Documentos</h2>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Requisitos:</strong> Todos os documentos devem ser cópias coloridas legíveis em PDF ou imagem (JPG/PNG).
          Tamanho máximo: 10MB por arquivo.
        </p>
      </div>

      <FileUploadField
        label="Passaporte ou Documento de Identidade *"
        description="Cópia completa do passaporte (todas as páginas com informações) ou documento de identidade com foto"
        file={documents.passport}
        onChange={(file) => handleFileChange('passport', file)}
        required
      />

      <FileUploadField
        label="Comprovante de Endereço *"
        description="Conta de luz, água, telefone fixo ou extrato bancário (emitido nos últimos 3 meses)"
        file={documents.proofOfAddress}
        onChange={(file) => handleFileChange('proofOfAddress', file)}
        required
      />

      <FileUploadField
        label="Extrato Bancário"
        description="Extrato bancário recente mostrando origem dos recursos"
        file={documents.bankStatement}
        onChange={(file) => handleFileChange('bankStatement', file)}
      />
    </div>
  );
};

interface FileUploadFieldProps {
  label: string;
  description: string;
  file?: File;
  onChange: (file: File | null) => void;
  required?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  description,
  file,
  onChange,
  required,
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tamanho (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 10MB');
        return;
      }
      onChange(selectedFile);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-500 mb-3">{description}</p>

      {file ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700">{file.name}</span>
            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            onClick={() => onChange(null)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remover
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500">PDF, PNG ou JPG (máx. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            required={required}
          />
        </label>
      )}
    </div>
  );
};

export default InvestmentWizard;
