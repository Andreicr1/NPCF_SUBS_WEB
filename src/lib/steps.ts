export type StepId =
  | 'dados-pessoais'
  | 'endereco-contato'
  | 'pep-aml'
  | 'fatca-crs'
  | 'subscription-agreement'
  | 'documentos'
  | 'revisao'

export interface StepDef {
  id: StepId
  title: string
  description?: string
}

export const STEPS: StepDef[] = [
  { id: 'dados-pessoais', title: 'Dados Pessoais' },
  { id: 'endereco-contato', title: 'Endereço e Contato' },
  { id: 'pep-aml', title: 'PEP e AML' },
  { id: 'fatca-crs', title: 'FATCA/CRS' },
  { id: 'subscription-agreement', title: 'Subscription Agreement' },
  { id: 'documentos', title: 'Documentos' },
  { id: 'revisao', title: 'Revisão' },
]

export const firstStepId: StepId = STEPS[0].id

export function stepIndex(id: StepId) {
  return STEPS.findIndex((s) => s.id === id)
}

export function isValidStep(id: string): id is StepId {
  return (STEPS as StepDef[]).some((s) => s.id === id)
}

