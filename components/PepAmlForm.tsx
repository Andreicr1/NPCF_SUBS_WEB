import React from 'react';
import { PepData, SourceData, WealthCategory } from '@/lib/types';

interface PepAmlFormProps {
  pepData: PepData;
  sourceData: SourceData;
  onPepChange: (data: PepData) => void;
  onSourceChange: (data: SourceData) => void;
}

export const PepAmlForm: React.FC<PepAmlFormProps> = ({
  pepData,
  sourceData,
  onPepChange,
  onSourceChange,
}) => {
  const handleWealthCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = sourceData.wealthCategories || [];
    
    const newCategories = checked
      ? [...currentCategories, category as WealthCategory]
      : currentCategories.filter((c: WealthCategory) => c !== category);

    onSourceChange({
      ...sourceData,
      wealthCategories: newCategories,
    });
  };

  return (
    <div className="space-y-8">
      {/* Info Box */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Prevenção à Lavagem de Dinheiro (AML/KYC)
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Estas informações são obrigatórias de acordo com as regulamentações de prevenção à lavagem de dinheiro e financiamento ao terrorismo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PEP Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pessoa Politicamente Exposta (PEP)</h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700 mb-2">
            <strong>O que é uma PEP?</strong>
          </p>
          <p className="text-sm text-gray-600">
            Uma Pessoa Politicamente Exposta (PEP) é alguém que ocupa ou ocupou um cargo público proeminente, como:
            Chefe de Estado, político sênior, oficial militar, executivo de empresa estatal, membro importante de partido político, etc.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="isPep"
            checked={pepData.isPep}
            onChange={(e) => onPepChange({ ...pepData, isPep: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPep" className="text-sm">
            <strong>Sou uma Pessoa Politicamente Exposta (PEP)</strong> ou membro da família/associado próximo de uma PEP
          </label>
        </div>

        {pepData.isPep && (
          <div className="ml-7 space-y-4 border-l-2 border-blue-500 pl-4">
            <div>
              <label htmlFor="pepPosition" className="block text-sm font-medium text-gray-700 mb-1">
                Cargo ou Posição Política *
              </label>
              <input
                type="text"
                id="pepPosition"
                value={pepData.pepPosition || ''}
                onChange={(e) => onPepChange({ ...pepData, pepPosition: e.target.value })}
                placeholder="Ex: Ministro da Fazenda, Senador, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="pepCountry" className="block text-sm font-medium text-gray-700 mb-1">
                País de Exposição Política *
              </label>
              <input
                type="text"
                id="pepCountry"
                value={pepData.pepCountry || ''}
                onChange={(e) => onPepChange({ ...pepData, pepCountry: e.target.value })}
                placeholder="País onde exerceu/exerce o cargo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="pepDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Detalhes Adicionais *
              </label>
              <textarea
                id="pepDetails"
                value={pepData.pepDetails || ''}
                onChange={(e) => onPepChange({ ...pepData, pepDetails: e.target.value })}
                placeholder="Forneça detalhes sobre sua exposição política, período de atuação, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )}

        {/* RCA */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="isRca"
            checked={pepData.isRca}
            onChange={(e) => onPepChange({ ...pepData, isRca: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
          />
          <label htmlFor="isRca" className="text-sm">
            Sou <strong>membro da família</strong> ou <strong>associado próximo</strong> de uma PEP
          </label>
        </div>

        {pepData.isRca && (
          <div className="ml-7 space-y-4 border-l-2 border-blue-500 pl-4">
            <div>
              <label htmlFor="rcaRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Relacionamento *
              </label>
              <select
                id="rcaRelationship"
                value={pepData.rcaRelationship || ''}
                onChange={(e) => onPepChange({ ...pepData, rcaRelationship: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione</option>
                <option value="spouse">Cônjuge</option>
                <option value="parent">Pai/Mãe</option>
                <option value="child">Filho(a)</option>
                <option value="sibling">Irmão(ã)</option>
                <option value="business_partner">Sócio Comercial</option>
                <option value="close_associate">Associado Próximo</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="rcaPepName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da PEP Relacionada
              </label>
              <input
                type="text"
                id="rcaPepName"
                value={pepData.rcaPepName || ''}
                onChange={(e) => onPepChange({ ...pepData, rcaPepName: e.target.value })}
                placeholder="Nome completo da pessoa politicamente exposta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Source of Funds/Wealth */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Origem dos Recursos e Patrimônio</h3>

        {/* Source of Wealth Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origem do Patrimônio (Source of Wealth) *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Selecione uma ou mais atividades que geraram seu patrimônio total
          </p>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('savings')}
                onChange={(e) => handleWealthCategoryChange('savings', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Poupança (Savings)</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('investment_activity')}
                onChange={(e) => handleWealthCategoryChange('investment_activity', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Atividade de Investimento</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('sale_of_asset')}
                onChange={(e) => handleWealthCategoryChange('sale_of_asset', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Venda de Ativo</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('divorce_settlement')}
                onChange={(e) => handleWealthCategoryChange('divorce_settlement', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Acordo de Divórcio</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('salary')}
                onChange={(e) => handleWealthCategoryChange('salary', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Salário</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('insurance_claim')}
                onChange={(e) => handleWealthCategoryChange('insurance_claim', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Indenização de Seguro</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('corporate_profit')}
                onChange={(e) => handleWealthCategoryChange('corporate_profit', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Lucro Empresarial</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('court')}
                onChange={(e) => handleWealthCategoryChange('court', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Decisão Judicial</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('inheritance')}
                onChange={(e) => handleWealthCategoryChange('inheritance', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Herança</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('life_assurance')}
                onChange={(e) => handleWealthCategoryChange('life_assurance', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Seguro de Vida</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('gift')}
                onChange={(e) => handleWealthCategoryChange('gift', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Doação</span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={sourceData.wealthCategories?.includes('other')}
                onChange={(e) => handleWealthCategoryChange('other', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Outro</span>
            </label>
          </div>
        </div>

        {/* Wealth Details */}
        <div>
          <label htmlFor="wealthDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detalhes Completos sobre Origem do Patrimônio *
          </label>
          <textarea
            id="wealthDetails"
            value={sourceData.wealthDetails || ''}
            onChange={(e) => onSourceChange({ ...sourceData, wealthDetails: e.target.value })}
            placeholder="Forneça detalhes completos sobre como seu patrimônio foi acumulado, incluindo prazos, valores aproximados, documentação de suporte, etc."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Seja específico. Exemplo: "Acumulei patrimônio através de 20 anos de trabalho como engenheiro (salário anual médio de R$ 200.000), investimentos em fundos mútuos desde 2005, e venda de imóvel residencial em 2020."
          </p>
        </div>

        {/* Bank/Transfer Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="transferringBank" className="block text-sm font-medium text-gray-700 mb-1">
              Banco Transferidor / Custodiante
            </label>
            <input
              type="text"
              id="transferringBank"
              value={sourceData.transferringBank || ''}
              onChange={(e) => onSourceChange({ ...sourceData, transferringBank: e.target.value })}
              placeholder="Nome do banco"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="transferringBankCountry" className="block text-sm font-medium text-gray-700 mb-1">
              País do Banco
            </label>
            <input
              type="text"
              id="transferringBankCountry"
              value={sourceData.transferringBankCountry || ''}
              onChange={(e) => onSourceChange({ ...sourceData, transferringBankCountry: e.target.value })}
              placeholder="País"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Source of Funds (simplified) */}
        <div>
          <label htmlFor="sourceOfFunds" className="block text-sm font-medium text-gray-700 mb-1">
            Origem Específica dos Recursos para ESTE Investimento *
          </label>
          <select
            id="sourceOfFunds"
            value={sourceData.sourceOfFunds}
            onChange={(e) => onSourceChange({ ...sourceData, sourceOfFunds: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione</option>
            <option value="bank_account">Conta Bancária Existente</option>
            <option value="sale_of_securities">Venda de Títulos/Ações</option>
            <option value="loan">Empréstimo</option>
            <option value="salary">Salário Recente</option>
            <option value="business_income">Receita Empresarial</option>
            <option value="other">Outro</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            De onde virão ESPECIFICAMENTE os fundos para este investimento?
          </p>
        </div>

        {/* Employment Info (if salary selected) */}
        {(sourceData.wealthCategories?.includes('salary') || sourceData.sourceOfFunds === 'salary') && (
          <>
            <div>
              <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Empregador *
              </label>
              <input
                type="text"
                id="employerName"
                value={sourceData.employerName || ''}
                onChange={(e) => onSourceChange({ ...sourceData, employerName: e.target.value })}
                placeholder="Nome completo da empresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="employerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço do Empregador
              </label>
              <input
                type="text"
                id="employerAddress"
                value={sourceData.employerAddress || ''}
                onChange={(e) => onSourceChange({ ...sourceData, employerAddress: e.target.value })}
                placeholder="Endereço completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Declarations */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
          <h4 className="font-medium text-blue-900">Declarações Obrigatórias</h4>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={sourceData.assetsArePersonalProperty}
              onChange={(e) => onSourceChange({ ...sourceData, assetsArePersonalProperty: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              Confirmo que todos os ativos são <strong>propriedade pessoal inteiramente minha</strong>
            </span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={sourceData.noAssetsFromCriminalActivity}
              onChange={(e) => onSourceChange({ ...sourceData, noAssetsFromCriminalActivity: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-700">
              Confirmo que <strong>nenhum ativo ou dinheiro foi derivado de atividades criminais</strong> de qualquer natureza
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PepAmlForm;