import { z } from 'zod'

export const personalDataSchema = z.object({
  cpfCnpj: z
    .string({ required_error: 'Informe CPF/CNPJ.' })
    .min(11, 'Informe CPF/CNPJ.'),
  fullName: z
    .string({ required_error: 'Informe o nome completo.' })
    .min(3, 'Informe o nome completo.'),
  birthDate: z
    .string({ required_error: 'Informe a data de nascimento.' })
    .refine((v) => Boolean(Date.parse(v)), 'Data inválida.'),
  birthCountry: z
    .string({ required_error: 'Selecione o país de nascimento.' })
    .min(2, 'Selecione o país de nascimento.'),
  nationality: z
    .string({ required_error: 'Informe a nacionalidade.' })
    .min(2, 'Informe a nacionalidade.'),
  occupation: z
    .string({ required_error: 'Informe a ocupação.' })
    .min(2, 'Informe a ocupação.'),
})

export type PersonalData = z.infer<typeof personalDataSchema>
