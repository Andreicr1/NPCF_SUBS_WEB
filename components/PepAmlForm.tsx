'use client';

import React from 'react';
import { PepData, SourceData, WealthCategory } from '../lib/types';

interface PepAmlFormProps {
  pepData: PepData;
  sourceData: SourceData;
  onPepChange: (data: PepData) => void;
  onSourceChange: (data: SourceData) => void;
}

const ALL_WEALTH_CATEGORIES: WealthCategory[] = [
  'savings',
  'investment_activity',
  'sale_of_asset',
  'divorce_settlement',
  'salary',
  'insurance_claim',
  'corporate_profit',
  'court',
  'inheritance',
  'life_assurance',
  'gift',
  'other',
];

const PepAmlForm: React.FC<PepAmlFormProps> = ({
  pepData,
  sourceData,
  onPepChange,
  onSourceChange,
}) => {
  const toggleCategory = (category: WealthCategory, checked: boolean) => {
    const current = sourceData.wealthCategories || [];
    const next = checked
      ? Array.from(new Set([...current, category]))
      : current.filter((c) => c !== category);
    onSourceChange({ ...sourceData, wealthCategories: next });
  };

  return (
    <div className="card p-8 space-y-8">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
        <h3 className="text-sm font-medium text-amber-800">PEP e AML</h3>
        <p className="mt-1 text-sm text-amber-700">
          Informações necessárias para prevenção à lavagem de dinheiro (AML/KYC).
        </p>
      </div>

      {/* PEP */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold">Pessoa Politicamente Exposta (PEP)</h4>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={pepData.isPep}
            onChange={(e) => onPepChange({ ...pepData, isPep: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm">
            Sou PEP ou membro da família/associado próximo de uma PEP
          </span>
        </label>

        {pepData.isPep && (
          <div className="ml-7 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo/Posição Política
              </label>
              <input
                type="text"
                value={pepData.pepPosition || ''}
                onChange={(e) => onPepChange({ ...pepData, pepPosition: e.target.value })}
                placeholder="Ex: Ministro, Senador, Diretor de estatal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                value={pepData.pepCountry || ''}
                onChange={(e) => onPepChange({ ...pepData, pepCountry: e.target.value })}
                placeholder="País"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalhes
              </label>
              <textarea
                value={pepData.pepDetails || ''}
                onChange={(e) => onPepChange({ ...pepData, pepDetails: e.target.value })}
                rows={3}
                placeholder="Detalhe a posição, período e contexto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={pepData.isRca}
            onChange={(e) => onPepChange({ ...pepData, isRca: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm">Sou membro da família/associado próximo de uma PEP</span>
        </label>
      </section>

      {/* Origem de Recursos/Patrimônio */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold">Origem dos Recursos e Patrimônio</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorias de origem do patrimônio
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ALL_WEALTH_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={Boolean(sourceData.wealthCategories?.includes(cat))}
                  onChange={(e) => toggleCategory(cat, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm">{cat.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detalhes sobre o patrimônio
          </label>
          <textarea
            value={sourceData.wealthDetails || ''}
            onChange={(e) => onSourceChange({ ...sourceData, wealthDetails: e.target.value })}
            rows={3}
            placeholder="Explique como o patrimônio foi formado"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origem dos recursos para este investimento
          </label>
          <input
            type="text"
            value={sourceData.sourceOfFunds || ''}
            onChange={(e) => onSourceChange({ ...sourceData, sourceOfFunds: e.target.value })}
            placeholder="Conta bancária, venda de ativo, salário, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={Boolean(sourceData.assetsArePersonalProperty)}
              onChange={(e) => onSourceChange({ ...sourceData, assetsArePersonalProperty: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm">Ativos são propriedade pessoal inteiramente minha</span>
          </label>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={Boolean(sourceData.noAssetsFromCriminalActivity)}
              onChange={(e) => onSourceChange({ ...sourceData, noAssetsFromCriminalActivity: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm">Nenhum ativo/dinheiro é proveniente de atividade criminal</span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default PepAmlForm;

