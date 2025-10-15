import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpar dados existentes (apenas em dev)
  if (process.env.NODE_ENV === 'development') {
    await prisma.auditLog.deleteMany();
    await prisma.signature.deleteMany();
    await prisma.document.deleteMany();
    await prisma.investor.deleteMany();
    console.log('✅ Cleared existing data');
  }

  // Criar investidor de exemplo
  const exampleInvestor = await prisma.investor.create({
    data: {
      investorType: 'individual',
      fullName: 'João da Silva Santos',
      cpfCnpj: '123.456.789-00',
      rg: '12.345.678-9',
      birthDate: new Date('1985-05-15'),
      nationality: 'Brasileiro',
      maritalStatus: 'Casado',
      profession: 'Empresário',
      
      address: 'Rua das Flores',
      addressNumber: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      
      email: 'joao.silva@example.com',
      phone: '(11) 3456-7890',
      cellphone: '(11) 98765-4321',
      
      isQualified: true,
      qualificationType: 'professional',
      
      bankName: 'Banco Itaú',
      bankBranch: '1234',
      bankAccount: '56789-0',
      bankAccountType: 'checking',
      
      subscriptionAmount: 500000.00,
      numberOfQuotas: 500,
      quotaValue: 1000.00,
      
      isPep: false,
      
      status: 'draft',
    },
  });

  console.log('✅ Created example investor:', exampleInvestor.id);

  // Criar log de auditoria
  await prisma.auditLog.create({
    data: {
      userId: 'system',
      action: 'seed',
      entity: 'database',
      entityId: 'initial_seed',
      changes: JSON.stringify({ message: 'Database seeded successfully' }),
    },
  });

  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });