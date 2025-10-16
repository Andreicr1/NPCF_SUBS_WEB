-- AddSignatureFieldsToInvestor
-- Adiciona campos para tracking de assinatura eletrônica

-- AlterTable
ALTER TABLE "investors" ADD COLUMN     "signatureRequestId" TEXT,
ADD COLUMN     "signatureStatus" TEXT DEFAULT 'not_sent',
ADD COLUMN     "signatureUrl" TEXT;

-- AlterTable
ALTER TABLE "signatures" ADD COLUMN     "documentType" TEXT NOT NULL;

-- DropIndex (se existir)
-- DROP INDEX IF EXISTS "signatures_signatureRequestId_key";

-- Comentários das mudanças
COMMENT ON COLUMN "investors"."signatureRequestId" IS 'ID da solicitação no Dropbox Sign';
COMMENT ON COLUMN "investors"."signatureStatus" IS 'Status: not_sent | pending | signed | declined | expired';
COMMENT ON COLUMN "investors"."signatureUrl" IS 'URL para assinatura (se disponível)';
COMMENT ON COLUMN "signatures"."documentType" IS 'Tipo: kyc | fatca | source_of_wealth | subscription';
