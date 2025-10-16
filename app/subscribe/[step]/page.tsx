"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/enterprise/AppShell'
import StepperTabs from '@/components/enterprise/StepperTabs'
import BookletSidebar from '@/components/enterprise/BookletSidebar'
import MobileStepper from '@/src/components/MobileStepper'
import FormCard from '@/src/components/FormCard'
import TertiaryButton from '@/src/components/buttons/TertiaryButton'
import PrimaryButton from '@/src/components/buttons/PrimaryButton'
import Input from '@/src/components/form/Input'
import DateInput from '@/src/components/form/DateInput'
import Select from '@/src/components/form/Select'
import FormField from '@/src/components/form/FormField'
import { firstStepId, isValidStep, STEPS, StepId, stepIndex } from '@/src/lib/steps'
import DocumentsUploader from './DocumentsUploader'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PersonalData, personalDataSchema } from '@/src/lib/validation/personalData'
import { loadDraft, saveDraft } from '@/src/lib/storage/draft'
import { z } from 'zod'

type ProgressMap = Partial<Record<StepId, number>>

const addressSchema = z.object({
  address1: z.string().min(3, 'Informe o endereÃ§o.'),
  address2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, 'Informe a cidade.'),
  state: z.string().min(2, 'Informe o estado/provÃ­ncia.'),
  postalCode: z.string().min(3, 'Informe o CEP/cÃ³digo postal.'),
  country: z.string().min(2, 'Informe o paÃ­s.'),
  email: z.string().email('Email invÃ¡lido.'),
  phone: z.string().min(6, 'Telefone invÃ¡lido.'),
})
type AddressData = z.infer<typeof addressSchema>

const pepAmlSchema = z.object({
  isPep: z.boolean().default(false),
  isRca: z.boolean().default(false),
  pepDetails: z.string().optional().or(z.literal('')),
  pepPosition: z.string().optional().or(z.literal('')),
  pepCountry: z.string().optional().or(z.literal('')),
  rcaRelationship: z.string().optional().or(z.literal('')),
  sourceOfFunds: z.string().min(2, 'Informe a origem dos recursos.'),
  sourceOfWealth: z.string().min(2, 'Informe a origem do patrimÃ´nio.'),
  wealthCategories: z.array(z.string()).optional().default([]),
  wealthDetails: z.string().optional().or(z.literal('')),
  transferringBank: z.string().optional().or(z.literal('')),
  transferringBankCountry: z.string().optional().or(z.literal('')),
  employerName: z.string().optional().or(z.literal('')),
  employerAddress: z.string().optional().or(z.literal('')),
  employmentYears: z.coerce.number().int().min(0).optional(),
  annualIncome: z.coerce.number().min(0).optional(),
  netWorth: z.coerce.number().min(0).optional(),
  assetsArePersonalProperty: z.boolean().default(true),
  noAssetsFromCriminalActivity: z.boolean().default(true),
})
type PepAmlData = z.infer<typeof pepAmlSchema>

const taxResidencySchema = z.object({
  country: z.string().min(2, 'Informe o paÃ­s.'),
  taxReferenceNumberType: z.string().min(2, 'Informe o tipo do identificador.'),
  taxReferenceNumber: z.string().optional().or(z.literal('')),
  reasonForNoTin: z.string().optional().or(z.literal('')),
})
const fatcaCrsSchema = z.object({
  isUsCitizen: z.boolean().default(false),
  ustin: z.string().optional().or(z.literal('')),
  taxResidencies: z.array(taxResidencySchema).min(1, 'Adicione ao menos uma residÃªncia fiscal.'),
})
type FatcaCrsData = z.infer<typeof fatcaCrsSchema>

const subscriptionSchema = z.object({
  eligibleInvestorConfirmation: z.literal(true, {
    errorMap: () => ({ message: 'ConfirmaÃ§Ã£o obrigatÃ³ria.' }),
  }),
  nonUsPersonConfirmation: z.literal(true, {
    errorMap: () => ({ message: 'ConfirmaÃ§Ã£o obrigatÃ³ria.' }),
  }),
  shareClassSelection: z.string().min(1, 'Selecione a classe de cota.'),
  subscriptionAmount: z.coerce.number().min(1, 'Informe o valor.'),
  incomingBankLocation: z.string().min(2, 'Informe o local do banco remetente.'),
})
type SubscriptionData = z.infer<typeof subscriptionSchema>

function computePersonalDataProgress(values: Partial<PersonalData>): number {
  const fields: (keyof PersonalData)[] = ['cpfCnpj', 'fullName', 'birthDate', 'birthCountry', 'nationality', 'occupation']
  const filled = fields.filter((f) => values[f] && String(values[f]).trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
}
function computeStepProgress(values: Record<string, any>, total: number) {
  const filled = Object.values(values).filter((v) => (typeof v === 'boolean' ? true : String(v ?? '').trim().length > 0)).length
  return Math.round((filled / total) * 100)
}

export default function SubscribeStepPage() {
  const router = useRouter()
  const params = useParams()
  const stepParam = (params?.step as string) || firstStepId

  if (!isValidStep(stepParam)) {
    if (typeof window !== 'undefined') router.replace(`/subscribe/${firstStepId}`)
  }
  const step = (isValidStep(stepParam) ? stepParam : firstStepId) as StepId
  const currentIdx = stepIndex(step)

  const [progress, setProgress] = React.useState<ProgressMap>({})
  const setStepProgress = (id: StepId, pct: number) => setProgress((p) => ({ ...p, [id]: Math.max(0, Math.min(100, pct)) }))

  // Step 1: Dados Pessoais
  const personalDraft = loadDraft<PersonalData>('dados-pessoais') || undefined
  const form1 = useForm<PersonalData>({ resolver: zodResolver(personalDataSchema), defaultValues: personalDraft })
  const values1 = form1.watch()
  React.useEffect(() => {
    if (step === 'dados-pessoais') {
      saveDraft('dados-pessoais', values1)
      setStepProgress('dados-pessoais', computePersonalDataProgress(values1))
    }
  }, [values1, step])

  // Step 2: EndereÃ§o
  const addressDraft = loadDraft<AddressData>('endereco-contato') || undefined
  const form2 = useForm<AddressData>({ resolver: zodResolver(addressSchema), defaultValues: addressDraft })
  const values2 = form2.watch()
  React.useEffect(() => {
    if (step === 'endereco-contato') {
      saveDraft('endereco-contato', values2)
      setStepProgress('endereco-contato', computeStepProgress(values2, 8))
    }
  }, [values2, step])

  // Step 3: PEP/AML
  const pepDraft = loadDraft<PepAmlData>('pep-aml') || undefined
  const form3 = useForm<PepAmlData>({ resolver: zodResolver(pepAmlSchema), defaultValues: pepDraft })
  const values3 = form3.watch()
  React.useEffect(() => {
    if (step === 'pep-aml') {
      saveDraft('pep-aml', values3)
      setStepProgress('pep-aml', computeStepProgress(values3, 12))
    }
  }, [values3, step])

  // Step 4: FATCA/CRS
  const fatcaDraft = loadDraft<FatcaCrsData>('fatca-crs') || undefined
  const form4 = useForm<FatcaCrsData>({ resolver: zodResolver(fatcaCrsSchema), defaultValues: fatcaDraft ?? { isUsCitizen: false, ustin: '', taxResidencies: [] } })
  const residencies = useFieldArray({ control: form4.control, name: 'taxResidencies' as const })
  const values4 = form4.watch()
  React.useEffect(() => {
    if (step === 'fatca-crs') {
      saveDraft('fatca-crs', values4)
      const count = (values4?.taxResidencies?.length || 0) * 4 + (values4?.isUsCitizen ? 1 : 0)
      setStepProgress('fatca-crs', Math.min(100, Math.round((count / 5) * 100)))
    }
  }, [values4, step])

  // Step 5: Subscription Agreement
  const subDraft = loadDraft<SubscriptionData>('subscription-agreement') || undefined
  const form5 = useForm<SubscriptionData>({ resolver: zodResolver(subscriptionSchema), defaultValues: subDraft })
  const values5 = form5.watch()
  React.useEffect(() => {
    if (step === 'subscription-agreement') {
      saveDraft('subscription-agreement', values5)
      setStepProgress('subscription-agreement', computeStepProgress(values5, 5))
    }
  }, [values5, step])

  const [submitting, setSubmitting] = React.useState(false)
  // const [docError, setDocError] = React.useState<string | null>(null)
  const [submittedId, setSubmittedId] = React.useState<string | null>(null)

  function goNext() {
    const next = STEPS[currentIdx + 1]
    if (next) router.push(`/subscribe/${next.id}`)
  }
  function goPrev() {
    const prev = STEPS[currentIdx - 1]
    if (prev) router.push(`/subscribe/${prev.id}`)
    else router.push('/')
  }

  return (
    <AppShell sidebar={<BookletSidebar current={step} progress={progress} />}>
      <div className="space-y-6">
        <div className="space-y-3">
          <MobileStepper current={step} />
          <div className="hidden sm:block">
            <StepperTabs current={step} />
          </div>
        </div>

        {step === 'dados-pessoais' && (
          <FormCard
            title="Dados Pessoais"
            description="Preencha seus dados conforme documento oficial."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={form1.handleSubmit(goNext)}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="CPF/CNPJ" htmlFor="cpfCnpj" required error={form1.formState.errors.cpfCnpj?.message}>
                <Input id="cpfCnpj" aria-invalid={!!form1.formState.errors.cpfCnpj} {...form1.register('cpfCnpj')} />
              </FormField>
              <FormField label="Nome completo" htmlFor="fullName" required help="Como aparece no passaporte" error={form1.formState.errors.fullName?.message}>
                <Input id="fullName" placeholder="Como aparece no passaporte" aria-invalid={!!form1.formState.errors.fullName} {...form1.register('fullName')} />
              </FormField>
              <FormField label="Data de Nascimento" htmlFor="birthDate" required error={form1.formState.errors.birthDate?.message}>
                <DateInput id="birthDate" aria-invalid={!!form1.formState.errors.birthDate} {...form1.register('birthDate')} />
              </FormField>
              <FormField label="PaÃ­s de Nascimento" htmlFor="birthCountry" required error={form1.formState.errors.birthCountry?.message}>
                <Select id="birthCountry" aria-invalid={!!form1.formState.errors.birthCountry} {...form1.register('birthCountry')}>
                  <option value="">Selecione</option>
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="PT">Portugal</option>
                </Select>
              </FormField>
              <FormField label="Nacionalidade" htmlFor="nationality" required error={form1.formState.errors.nationality?.message}>
                <Input id="nationality" aria-invalid={!!form1.formState.errors.nationality} {...form1.register('nationality')} />
              </FormField>
              <FormField label="OcupaÃ§Ã£o" htmlFor="occupation" required help="Engenheiro, MÃ©dico, etc." error={form1.formState.errors.occupation?.message}>
                <Input id="occupation" placeholder="Engenheiro, MÃ©dico, etc." aria-invalid={!!form1.formState.errors.occupation} {...form1.register('occupation')} />
              </FormField>
            </form>
          </FormCard>
        )}

        {step === 'endereco-contato' && (
          <FormCard
            title="EndereÃ§o e Contato"
            description="Informe seu endereÃ§o e formas de contato."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={form2.handleSubmit(goNext)}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="EndereÃ§o" htmlFor="address1" required error={form2.formState.errors.address1?.message}>
                <Input id="address1" {...form2.register('address1')} />
              </FormField>
              <FormField label="Complemento" htmlFor="address2" error={form2.formState.errors.address2?.message}>
                <Input id="address2" {...form2.register('address2')} />
              </FormField>
              <FormField label="Cidade" htmlFor="city" required error={form2.formState.errors.city?.message}>
                <Input id="city" {...form2.register('city')} />
              </FormField>
              <FormField label="Estado/ProvÃ­ncia" htmlFor="state" required error={form2.formState.errors.state?.message}>
                <Input id="state" {...form2.register('state')} />
              </FormField>
              <FormField label="CEP / CÃ³digo Postal" htmlFor="postalCode" required error={form2.formState.errors.postalCode?.message}>
                <Input id="postalCode" {...form2.register('postalCode')} />
              </FormField>
              <FormField label="PaÃ­s" htmlFor="country" required error={form2.formState.errors.country?.message}>
                <Input id="country" placeholder="Brasil" {...form2.register('country')} />
              </FormField>
              <FormField label="Email" htmlFor="email" required error={form2.formState.errors.email?.message}>
                <Input id="email" type="email" placeholder="seu@email.com" {...form2.register('email')} />
              </FormField>
              <FormField label="Telefone" htmlFor="phone" required error={form2.formState.errors.phone?.message}>
                <Input id="phone" type="tel" placeholder="+55 11 99999-9999" {...form2.register('phone')} />
              </FormField>
            </form>
          </FormCard>
        )}

        {step === 'pep-aml' && (
          <FormCard
            title="PEP e AML"
            description="InformaÃ§Ãµes de prevenÃ§Ã£o Ã  lavagem de dinheiro."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={form3.handleSubmit(goNext)}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Ã‰ PEP?" htmlFor="isPep">
                <Select id="isPep" {...form3.register('isPep', { setValueAs: (v) => v === 'true' })}>
                  <option value="false">NÃ£o</option>
                  <option value="true">Sim</option>
                </Select>
              </FormField>
              <FormField label="Ã‰ RCA?" htmlFor="isRca">
                <Select id="isRca" {...form3.register('isRca', { setValueAs: (v) => v === 'true' })}>
                  <option value="false">NÃ£o</option>
                  <option value="true">Sim</option>
                </Select>
              </FormField>
              {form3.watch('isPep') && (
                <>
                  <FormField label="Cargo/PosiÃ§Ã£o PolÃ­tica" htmlFor="pepPosition" error={form3.formState.errors.pepPosition?.message}>
                    <Input id="pepPosition" {...form3.register('pepPosition')} />
                  </FormField>
                  <FormField label="PaÃ­s (PEP)" htmlFor="pepCountry" error={form3.formState.errors.pepCountry?.message}>
                    <Input id="pepCountry" {...form3.register('pepCountry')} />
                  </FormField>
                  <FormField label="Detalhes (PEP)" htmlFor="pepDetails" error={form3.formState.errors.pepDetails?.message}>
                    <Input id="pepDetails" {...form3.register('pepDetails')} />
                  </FormField>
                </>
              )}
              <FormField label="Origem dos recursos" htmlFor="sourceOfFunds" required error={form3.formState.errors.sourceOfFunds?.message}>
                <Input id="sourceOfFunds" {...form3.register('sourceOfFunds')} />
              </FormField>
              <FormField label="Origem do patrimÃ´nio" htmlFor="sourceOfWealth" required error={form3.formState.errors.sourceOfWealth?.message}>
                <Input id="sourceOfWealth" {...form3.register('sourceOfWealth')} />
              </FormField>
              <FormField label="Anos de experiÃªncia profissional" htmlFor="employmentYears">
                <Input id="employmentYears" type="number" step="1" {...form3.register('employmentYears', { setValueAs: (v) => v === '' ? undefined : Number(v) })} />
              </FormField>
              <FormField label="Renda anual (USD)" htmlFor="annualIncome">
                <Input id="annualIncome" type="number" step="0.01" {...form3.register('annualIncome', { setValueAs: (v) => v === '' ? undefined : Number(v) })} />
              </FormField>
              <FormField label="PatrimÃ´nio lÃ­quido (USD)" htmlFor="netWorth">
                <Input id="netWorth" type="number" step="0.01" {...form3.register('netWorth', { setValueAs: (v) => v === '' ? undefined : Number(v) })} />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Categorias de origem do patrimÃ´nio" htmlFor="wealthCategories">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {['savings','investment_activity','sale_of_asset','divorce_settlement','salary','insurance_claim','corporate_profit','court','inheritance','life_assurance','gift','other'].map((cat) => (
                      <label key={cat} className="inline-flex items-center gap-2 text-sm text-ink-700">
                        <input type="checkbox" value={cat} defaultChecked={form3.getValues('wealthCategories')?.includes(cat)} onChange={(e) => {
                          const current = form3.getValues('wealthCategories') || []
                          const next = e.target.checked ? Array.from(new Set([...current, cat])) : current.filter((c) => c !== cat)
                          form3.setValue('wealthCategories', next, { shouldDirty: true })
                        }} />
                        <span>{cat.replace(/_/g,' ')}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
              </div>
              <FormField label="Detalhes do patrimÃ´nio" htmlFor="wealthDetails">
                <Input id="wealthDetails" {...form3.register('wealthDetails')} />
              </FormField>
              <FormField label="Banco remetente" htmlFor="transferringBank">
                <Input id="transferringBank" {...form3.register('transferringBank')} />
              </FormField>
              <FormField label="PaÃ­s do banco remetente" htmlFor="transferringBankCountry">
                <Input id="transferringBankCountry" {...form3.register('transferringBankCountry')} />
              </FormField>
              <FormField label="Empregador" htmlFor="employerName">
                <Input id="employerName" {...form3.register('employerName')} />
              </FormField>
              <FormField label="EndereÃ§o do empregador" htmlFor="employerAddress">
                <Input id="employerAddress" {...form3.register('employerAddress')} />
              </FormField>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-ink-700">
                  <input type="checkbox" defaultChecked={form3.getValues('assetsArePersonalProperty')} onChange={(e) => form3.setValue('assetsArePersonalProperty', e.target.checked)} />
                  <span>Ativos sÃ£o propriedade pessoal inteiramente minha</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-ink-700">
                  <input type="checkbox" defaultChecked={form3.getValues('noAssetsFromCriminalActivity')} onChange={(e) => form3.setValue('noAssetsFromCriminalActivity', e.target.checked)} />
                  <span>Nenhum ativo/dinheiro Ã© proveniente de atividade criminal</span>
                </label>
              </div>
            </form>
          </FormCard>
        )}

        {step === 'fatca-crs' && (
          <FormCard
            title="FATCA/CRS"
            description="ResidÃªncia fiscal e nÃºmero identificador."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={form4.handleSubmit(goNext)}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Ã‰ cidadÃ£o/obrigaÃ§Ã£o fiscal nos EUA?" htmlFor="isUsCitizen">
                  <Select id="isUsCitizen" {...form4.register('isUsCitizen', { setValueAs: (v) => v === 'true' })}>
                    <option value="false">NÃ£o</option>
                    <option value="true">Sim</option>
                  </Select>
                </FormField>
                {form4.watch('isUsCitizen') && (
                  <FormField label="U.S. TIN (SSN/EIN)" htmlFor="ustin" error={form4.formState.errors.ustin?.message}>
                    <Input id="ustin" {...form4.register('ustin')} />
                  </FormField>
                )}
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-ink-900">ResidÃªncia(s) Fiscal(is)</h4>
                <TertiaryButton type="button" onClick={() => residencies.append({ country: '', taxReferenceNumberType: 'CPF', taxReferenceNumber: '', reasonForNoTin: '' })}>+ Adicionar</TertiaryButton>
              </div>

              {residencies.fields.length === 0 && (
                <div className="text-sm text-ink-500">Nenhuma residÃªncia fiscal adicionada.</div>
              )}

              {residencies.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormField label="PaÃ­s" htmlFor={`taxResidencies.${index}.country`} required error={(form4.formState.errors.taxResidencies as any)?.[index]?.country?.message}>
                    <Input id={`taxResidencies.${index}.country`} {...form4.register(`taxResidencies.${index}.country` as const)} />
                  </FormField>
                  <FormField label="Tipo" htmlFor={`taxResidencies.${index}.taxReferenceNumberType`} required error={(form4.formState.errors.taxResidencies as any)?.[index]?.taxReferenceNumberType?.message}>
                    <Input id={`taxResidencies.${index}.taxReferenceNumberType`} {...form4.register(`taxResidencies.${index}.taxReferenceNumberType` as const)} />
                  </FormField>
                  <FormField label="NÃºmero (TIN/NIF)" htmlFor={`taxResidencies.${index}.taxReferenceNumber`} error={(form4.formState.errors.taxResidencies as any)?.[index]?.taxReferenceNumber?.message}>
                    <Input id={`taxResidencies.${index}.taxReferenceNumber`} {...form4.register(`taxResidencies.${index}.taxReferenceNumber` as const)} />
                  </FormField>
                  <FormField label="Motivo sem TIN" htmlFor={`taxResidencies.${index}.reasonForNoTin`} error={(form4.formState.errors.taxResidencies as any)?.[index]?.reasonForNoTin?.message}>
                    <Input id={`taxResidencies.${index}.reasonForNoTin`} {...form4.register(`taxResidencies.${index}.reasonForNoTin` as const)} />
                  </FormField>
                  <div className="md:col-span-4 flex justify-end">
                    <TertiaryButton type="button" onClick={() => residencies.remove(index)}>Remover</TertiaryButton>
                  </div>
                </div>
              ))}
            </form>
          </FormCard>
        )}

        {step === 'subscription-agreement' && (
          <FormCard
            title="Subscription Agreement"
            description="ConfirmaÃ§Ãµes e informaÃ§Ãµes de subscriÃ§Ã£o."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={form5.handleSubmit(goNext)}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Sou investidor elegÃ­vel" htmlFor="eligibleInvestorConfirmation" required error={form5.formState.errors.eligibleInvestorConfirmation?.message}>
                <Select id="eligibleInvestorConfirmation" {...form5.register('eligibleInvestorConfirmation', { setValueAs: (v) => v === 'true' })}>
                  <option value="false">NÃ£o</option>
                  <option value="true">Sim</option>
                </Select>
              </FormField>
              <FormField label="NÃ£o sou pessoa dos EUA (US Person)" htmlFor="nonUsPersonConfirmation" required error={form5.formState.errors.nonUsPersonConfirmation?.message}>
                <Select id="nonUsPersonConfirmation" {...form5.register('nonUsPersonConfirmation', { setValueAs: (v) => v === 'true' })}>
                  <option value="false">NÃ£o</option>
                  <option value="true">Sim</option>
                </Select>
              </FormField>
              <FormField label="Classe de Cotas" htmlFor="shareClassSelection" required error={form5.formState.errors.shareClassSelection?.message}>
                <Select id="shareClassSelection" {...form5.register('shareClassSelection')}>
                  <option value="">Selecione</option>
                  <option value="A1">Classe A1</option>
                  <option value="A2">Classe A2</option>
                  <option value="B1">Classe B1</option>
                  <option value="B2">Classe B2</option>
                  <option value="C">Classe C</option>
                  <option value="N">Classe N</option>
                </Select>
              </FormField>
              <FormField label="Valor da SubscriÃ§Ã£o (USD)" htmlFor="subscriptionAmount" required error={form5.formState.errors.subscriptionAmount?.message}>
                <Input id="subscriptionAmount" type="number" step="0.01" {...form5.register('subscriptionAmount')} />
              </FormField>
              <FormField label="Local do Banco Remetente" htmlFor="incomingBankLocation" required error={form5.formState.errors.incomingBankLocation?.message}>
                <Input id="incomingBankLocation" {...form5.register('incomingBankLocation')} />
              </FormField>
            </form>
          </FormCard>
        )}

        {step === 'documentos' && (
          <FormCard
            title="Documentos"
            description="Envie os documentos necessÃ¡rios. ApÃ³s gerar o protocolo (enviar na RevisÃ£o), o upload ficarÃ¡ habilitado."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" onClick={goNext}>PrÃ³ximo</PrimaryButton>
              </div>
            }
          >
            <DocumentsUploader />
          </FormCard>
        )}

        {step === 'revisao' && (
          <FormCard
            title="RevisÃ£o"
            description="Confira seus dados antes de enviar."
            footer={
              <div className="flex items-center justify-between">
                <TertiaryButton type="button" onClick={goPrev}>Voltar</TertiaryButton>
                <PrimaryButton type="button" disabled={submitting} onClick={async () => {
                  setSubmitting(true)
                  try {
                    // Se já existir protocolo, validar uploads obrigatórios antes de enviar
                    const storedId = typeof window !== 'undefined' ? localStorage.getItem('investorId') : null
                    if (storedId) {
                      try {
                        const resp = await fetch(`/api/documents/upload?investorId=${storedId}`)
                        const docs = resp.ok ? await resp.json() : []
                        const hasPassport = docs.some((d: any) => d.documentType === 'passport')
                        const hasProof = docs.some((d: any) => d.documentType === 'proofOfAddress')
                        if (!hasPassport || !hasProof) {
                          alert('Envie Passaporte e Comprovante de Endereço antes de finalizar.')
                          router.push('/subscribe/documentos')
                          setSubmitting(false)
                          return
                        }
                      } catch {}
                    }
                    const p = form1.getValues()
                    const a = form2.getValues()
                    const pep = form3.getValues()
                    const f = form4.getValues()
                    const s = form5.getValues()

                    const investorData = {
                      cpfCnpj: p.cpfCnpj,
                      fullName: p.fullName,
                      dateOfBirth: p.birthDate,
                      countryOfBirth: p.birthCountry,
                      nationality: p.nationality,
                      occupation: p.occupation,
                      email: a.email,
                      phone: a.phone,
                      address: [a.address1, a.address2, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(', '),
                    }

                    const kycData = {
                      pep: {
                        isPep: pep.isPep,
                        isRca: pep.isRca,
                        pepDetails: pep.pepDetails,
                        pepPosition: pep.pepPosition,
                        pepCountry: pep.pepCountry,
                        rcaRelationship: pep.rcaRelationship,
                      },
                      source: {
                        sourceOfFunds: pep.sourceOfFunds,
                        sourceOfWealth: pep.sourceOfWealth,
                        wealthCategories: pep.wealthCategories || [],
                        wealthDetails: pep.wealthDetails || '',
                        assetsArePersonalProperty: true,
                        noAssetsFromCriminalActivity: true,
                        transferringBank: pep.transferringBank || undefined,
                        transferringBankCountry: pep.transferringBankCountry || undefined,
                        employerName: pep.employerName || undefined,
                        employerAddress: pep.employerAddress || undefined,
                        employmentYears: pep.employmentYears || undefined,
                        annualIncome: pep.annualIncome || undefined,
                        netWorth: pep.netWorth || undefined,
                      },
                      fatcaCrs: {
                        isUsCitizen: f.isUsCitizen,
                        ustin: f.ustin,
                        taxResidencies: f.taxResidencies || [],
                      },
                      subscription: {
                        eligibleInvestorConfirmation: s.eligibleInvestorConfirmation,
                        nonUsPersonConfirmation: s.nonUsPersonConfirmation,
                        shareClassSelection: s.shareClassSelection,
                        subscriptionAmount: s.subscriptionAmount,
                        incomingBankLocation: s.incomingBankLocation,
                      },
                      purposeOfAccount: '',
                      expectedActivity: '',
                      fundingSource: '',
                    }

                    const res = await fetch('/api/kyc/submit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ investorData, kycData }),
                    })
                    const json = await res.json()
                    if (!res.ok) throw new Error(json?.error || 'Falha ao submeter')
                    setSubmittedId(json.investorId ?? null)
                    if (json?.investorId) localStorage.setItem('investorId', json.investorId)
                  } catch (e) {
                    alert('Erro ao enviar. Verifique os dados.')
                    console.error(e)
                  } finally {
                    setSubmitting(false)
                  }
                }}>Enviar</PrimaryButton>
              </div>
            }
          >
            <div className="space-y-2 text-sm">
              {submittedId && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">Dados enviados com sucesso. Protocolo: {submittedId}</div>
              )}
              <div className="font-medium text-ink-900">Dados Pessoais</div>
              <pre className="text-ink-700 bg-white rounded-lg p-3 border border-muted-200 overflow-auto">{JSON.stringify(personalDraft || {}, null, 2)}</pre>
              <div className="font-medium text-ink-900">EndereÃ§o e Contato</div>
              <pre className="text-ink-700 bg-white rounded-lg p-3 border border-muted-200 overflow-auto">{JSON.stringify(addressDraft || {}, null, 2)}</pre>
              <div className="font-medium text-ink-900">PEP/AML</div>
              <pre className="text-ink-700 bg-white rounded-lg p-3 border border-muted-200 overflow-auto">{JSON.stringify(pepDraft || {}, null, 2)}</pre>
              <div className="font-medium text-ink-900">FATCA/CRS</div>
              <pre className="text-ink-700 bg-white rounded-lg p-3 border border-muted-200 overflow-auto">{JSON.stringify(fatcaDraft || {}, null, 2)}</pre>
              <div className="font-medium text-ink-900">Subscription</div>
              <pre className="text-ink-700 bg-white rounded-lg p-3 border border-muted-200 overflow-auto">{JSON.stringify(subDraft || {}, null, 2)}</pre>
            </div>
          </FormCard>
        )}
      </div>
    </AppShell>
  )
}
