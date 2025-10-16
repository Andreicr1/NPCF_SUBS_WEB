'use client';

import React, { useEffect } from 'react';
import { SubscriptionAgreementData, ShareClass, shareClassLabels } from '../lib/types';
import DateInput from './DateInput';

type InvestorData = Record<string, any>;

interface SubscriptionAgreementFormProps {
  data: SubscriptionAgreementData;
  investorData: Partial<InvestorData>;
  onChange: (data: SubscriptionAgreementData) => void;
}

export const SubscriptionAgreementForm: React.FC<SubscriptionAgreementFormProps> = ({
  data,
  investorData,
  onChange,
}) => {
  const isEntity = investorData.investorType !== 'individual';

  // Auto-gerar valor por extenso
  useEffect(() => {
    if (data.subscriptionAmount && data.subscriptionAmount > 0) {
      const words = numberToWords(data.subscriptionAmount);
      onChange({ ...data, subscriptionAmountWords: words });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChange]);

  return (
    <div className="card p-8 space-y-8">
      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Subscription Agreement
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Este é o documento principal de subscrição. Por favor, revise cuidadosamente todas as declarações e confirmações.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Qualificações do Investidor</h3>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={data.eligibleInvestorConfirmation}
              onChange={(e) =>
                onChange({ ...data, eligibleInvestorConfirmation: e.target.checked })
              }
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              <strong>Confirmo que sou um Investidor Elegível</strong> de acordo com as leis aplicáveis e atendo aos requisitos mínimos de investimento e qualificação estabelecidos no memorando de oferta do Fundo.
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={data.nonUsPersonConfirmation}
              onChange={(e) =>
                onChange({ ...data, nonUsPersonConfirmation: e.target.checked })
              }
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              <strong>Confirmo que NÃO sou uma "U.S. Person"</strong> conforme definido na Regulation S do Securities Act de 1933 dos Estados Unidos.
            </span>
          </label>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalhes da Subscrição</h3>

        <div>
          <label htmlFor="shareClassSelection" className="block text-sm font-medium text-gray-700 mb-1">
            Classe de Ações *
          </label>
          <select
            id="shareClassSelection"
            value={data.shareClassSelection}
            onChange={(e) =>
              onChange({ ...data, shareClassSelection: e.target.value as ShareClass })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione a classe de ações</option>
            {(Object.keys(shareClassLabels) as ShareClass[]).map((shareClass) => (
              <option key={shareClass} value={shareClass}>
                {shareClassLabels[shareClass]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Consulte o memorando de oferta para detalhes sobre cada classe de ações
          </p>
        </div>

        <div>
          <label htmlFor="subscriptionAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor da Subscrição (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="subscriptionAmount"
              value={data.subscriptionAmount || ''}
              onChange={(e) =>
                onChange({ ...data, subscriptionAmount: parseFloat(e.target.value) })
              }
              min={100000}
              step={1000}
              placeholder="100,000"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mínimo: USD 100,000.00
          </p>
        </div>

        {data.subscriptionAmountWords && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-gray-700">
              <strong>Por extenso:</strong> {data.subscriptionAmountWords}
            </p>
          </div>
        )}
      </div>

      {/* Entity Information (conditional) */}
      {isEntity && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações da Entidade</h3>

          <DateInput
            id="incorporationDate"
            name="incorporationDate"
            label="Data de Incorporação"
            required
            value={data.incorporationDate ? new Date(data.incorporationDate).toLocaleDateString('pt-BR') : ''}
            onChange={(e) => {
              const dateStr = e.target.value;
              // Converte dd/MM/yyyy para Date object
              if (dateStr.length === 10) {
                const [day, month, year] = dateStr.split('/');
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                onChange({ ...data, incorporationDate: date });
              }
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="incorporationPlace" className="block text-sm font-medium text-gray-700 mb-1">
                Local de Incorporação *
              </label>
              <input
                type="text"
                id="incorporationPlace"
                value={data.incorporationPlace || ''}
                onChange={(e) =>
                  onChange({ ...data, incorporationPlace: e.target.value })
                }
                placeholder="Cidade, Estado"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="countryOfFormation" className="block text-sm font-medium text-gray-700 mb-1">
                País de Formação *
              </label>
              <input
                type="text"
                id="countryOfFormation"
                value={data.countryOfFormation || ''}
                onChange={(e) =>
                  onChange({ ...data, countryOfFormation: e.target.value })
                }
                placeholder="País"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="signatoryCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidade do Signatário *
            </label>
            <select
              id="signatoryCapacity"
              value={data.signatoryCapacity || ''}
              onChange={(e) =>
                onChange({ ...data, signatoryCapacity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione</option>
              <option value="director">Diretor</option>
              <option value="authorized_signatory">Signatário Autorizado</option>
              <option value="ceo">CEO</option>
              <option value="cfo">CFO</option>
              <option value="managing_partner">Sócio Gerente</option>
              <option value="trustee">Trustee</option>
              <option value="other">Outro</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Qual a sua capacidade para assinar em nome da entidade?
            </p>
          </div>
        </div>
      )}

      {/* Banking Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Bancárias</h3>

        <div>
          <label htmlFor="incomingBankLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Localização do Banco de Origem *
          </label>
          <input
            type="text"
            id="incomingBankLocation"
            value={data.incomingBankLocation || ''}
            onChange={(e) =>
              onChange({ ...data, incomingBankLocation: e.target.value })
            }
            placeholder="Cidade, País do banco que enviará os fundos"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Localização do banco de onde virá a transferência
          </p>
        </div>
      </div>

      {/* Mailing Address (optional) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Endereço de Correspondência (Opcional)</h3>

        <div>
          <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Alternativo
          </label>
          <textarea
            id="mailingAddress"
            value={data.mailingAddress || ''}
            onChange={(e) =>
              onChange({ ...data, mailingAddress: e.target.value })
            }
            placeholder="Se diferente do endereço residencial/principal"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <h4 className="font-medium text-green-900 mb-2">Resumo da Subscrição</h4>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Investidor:</dt>
            <dd className="font-medium text-gray-900">{investorData.fullName}</dd>
          </div>
          {data.shareClassSelection && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Classe de Ações:</dt>
              <dd className="font-medium text-gray-900">
                {shareClassLabels[data.shareClassSelection]}
              </dd>
            </div>
          )}
          {data.subscriptionAmount && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Valor:</dt>
              <dd className="font-medium text-gray-900">
                USD {data.subscriptionAmount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

/**
 * Converte número para extenso (simplificado)
 */
const numberToWords = (num: number): string => {
  if (num === 0) return 'zero dollars';
  
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' million' + (n % 1000000 !== 0 ? ' ' + convert(n % 1000000) : '');
    return n.toString();
  };

  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);

  let result = convert(dollars) + ' dollars';
  if (cents > 0) {
    result += ' and ' + convert(cents) + ' cents';
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default SubscriptionAgreementForm;
