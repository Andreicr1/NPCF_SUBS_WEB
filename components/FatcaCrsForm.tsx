import React, { useState } from 'react';
import { FatcaCrsData, TaxResidency } from '../lib/types';
import { commonCountries, reasonsForNoTin } from '../lib/fatcaCrsValidation';

interface FatcaCrsFormProps {
  data: FatcaCrsData;
  onChange: (data: FatcaCrsData) => void;
}

export const FatcaCrsForm: React.FC<FatcaCrsFormProps> = ({ data, onChange }) => {
  const [showUsTinField, setShowUsTinField] = useState(data.isUsCitizen);

  const handleUsCitizenChange = (isUsCitizen: boolean) => {
    setShowUsTinField(isUsCitizen);
    onChange({
      ...data,
      isUsCitizen,
      ustin: isUsCitizen ? data.ustin : undefined,
    });
  };

  const addTaxResidency = () => {
    const newResidency: TaxResidency = {
      country: '',
      taxReferenceNumberType: 'CPF',
      taxReferenceNumber: '',
    };

    onChange({
      ...data,
      taxResidencies: [...data.taxResidencies, newResidency],
    });
  };

  const removeTaxResidency = (index: number) => {
    const newResidencies = data.taxResidencies.filter((_: TaxResidency, i: number) => i !== index);
    onChange({
      ...data,
      taxResidencies: newResidencies,
    });
  };

  const updateTaxResidency = (index: number, field: keyof TaxResidency, value: string) => {
    const newResidencies = data.taxResidencies.map((residency: TaxResidency, i: number) => {
      if (i === index) {
        return { ...residency, [field]: value };
      }
      return residency;
    });

    onChange({
      ...data,
      taxResidencies: newResidencies,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Declaração FATCA/CRS
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Estas informações são necessárias para cumprir com as obrigações fiscais internacionais (FATCA e CRS).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* U.S. Citizenship */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status de Cidadania/Residência nos EUA</h3>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="isUsCitizen"
            checked={data.isUsCitizen}
            onChange={(e) => handleUsCitizenChange(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isUsCitizen" className="text-sm">
            Sou cidadão americano e/ou residente nos EUA para fins fiscais (green card holder ou resident under substantial presence test)
          </label>
        </div>

        {showUsTinField && (
          <div>
            <label htmlFor="ustin" className="block text-sm font-medium text-gray-700 mb-1">
              U.S. TIN (Social Security Number ou EIN) *
            </label>
            <input
              type="text"
              id="ustin"
              value={data.ustin || ''}
              onChange={(e) => onChange({ ...data, ustin: e.target.value })}
              placeholder="XXX-XX-XXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={data.isUsCitizen}
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: XXX-XX-XXXX (SSN) ou XX-XXXXXXX (EIN)
            </p>
          </div>
        )}

        {data.usBirthplace && (
          <div>
            <div className="flex items-start space-x-3 mb-2">
              <input
                type="checkbox"
                id="hasSurrenderedUsCitizenship"
                checked={data.hasSurrenderedUsCitizenship}
                onChange={(e) => onChange({ ...data, hasSurrenderedUsCitizenship: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasSurrenderedUsCitizenship" className="text-sm">
                Renunciei voluntariamente à minha cidadania americana
              </label>
            </div>
            {data.hasSurrenderedUsCitizenship && (
              <p className="text-xs text-gray-500 ml-7">
                Será necessário anexar documentação comprobatória da renúncia
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tax Residencies */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Residência(s) Fiscal(is)</h3>
          <button
            type="button"
            onClick={addTaxResidency}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            + Adicionar Residência Fiscal
          </button>
        </div>

        {data.taxResidencies.map((residency: TaxResidency, index: number) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Residência Fiscal {index + 1}</h4>
              {data.taxResidencies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTaxResidency(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover
                </button>
              )}
            </div>

            <div>
              <label htmlFor={`country-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                País de Residência Fiscal *
              </label>
              <select
                id={`country-${index}`}
                value={residency.country}
                onChange={(e) => updateTaxResidency(index, 'country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um país</option>
                {commonCountries.map((country: { code: string; name: string }) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`taxType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Identificação Fiscal
              </label>
              <input
                id={`taxType-${index}`}
                type="text"
                value={residency.taxReferenceNumberType}
                onChange={(e) => updateTaxResidency(index, 'taxReferenceNumberType', e.target.value)}
                placeholder="Ex: CPF, TIN, NIF, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor={`taxNumber-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Número de Identificação Fiscal (TIN) *
              </label>
              <input
                id={`taxNumber-${index}`}
                type="text"
                value={residency.taxReferenceNumber}
                onChange={(e) => updateTaxResidency(index, 'taxReferenceNumber', e.target.value)}
                placeholder="Número de identificação fiscal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!residency.reasonForNoTin}
              />
            </div>

            {!residency.taxReferenceNumber && (
              <div>
                <label htmlFor={`noTinReason-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo para não ter TIN *
                </label>
                <select
                  id={`noTinReason-${index}`}
                  value={residency.reasonForNoTin || ''}
                  onChange={(e) => updateTaxResidency(index, 'reasonForNoTin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!residency.taxReferenceNumber}
                >
                  <option value="">Selecione um motivo</option>
                  {reasonsForNoTin.map((reason: string) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}

        {data.taxResidencies.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Clique em "Adicionar Residência Fiscal" para começar
          </p>
        )}
      </div>
    </div>
  );
};

export default FatcaCrsForm;
