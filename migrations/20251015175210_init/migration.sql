-- CreateTable
CREATE TABLE "investors" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investorType" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "legalName" TEXT,
    "cpfCnpj" TEXT NOT NULL,
    "rg" TEXT,
    "birthDate" TIMESTAMP(3),
    "nationality" TEXT,
    "maritalStatus" TEXT,
    "profession" TEXT,
    "address" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Brasil',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cellphone" TEXT,
    "isQualified" BOOLEAN NOT NULL DEFAULT false,
    "qualificationType" TEXT,
    "bankName" TEXT,
    "bankBranch" TEXT,
    "bankAccount" TEXT,
    "bankAccountType" TEXT,
    "subscriptionAmount" DECIMAL(65,30),
    "numberOfQuotas" INTEGER,
    "quotaValue" DECIMAL(65,30),
    "isPep" BOOLEAN NOT NULL DEFAULT false,
    "pepDetails" TEXT,
    "pepPosition" TEXT,
    "pepCountry" TEXT,
    "isRca" BOOLEAN NOT NULL DEFAULT false,
    "rcaRelationship" TEXT,
    "sourceOfFunds" TEXT,
    "sourceOfWealth" TEXT,
    "wealthCategories" TEXT,
    "wealthDetails" TEXT,
    "transferringBank" TEXT,
    "transferringBankCountry" TEXT,
    "employerName" TEXT,
    "employerAddress" TEXT,
    "assetsArePersonalProperty" BOOLEAN NOT NULL DEFAULT true,
    "noAssetsFromCriminalActivity" BOOLEAN NOT NULL DEFAULT true,
    "isUsCitizen" BOOLEAN NOT NULL DEFAULT false,
    "ustin" TEXT,
    "usBirthplace" TEXT,
    "hasSurrenderedUsCitizenship" BOOLEAN NOT NULL DEFAULT false,
    "taxResidencies" TEXT,
    "purposeOfAccount" TEXT,
    "expectedActivity" TEXT,
    "fundingSource" TEXT,
    "eligibleInvestorConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "nonUsPersonConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "shareClassSelection" TEXT,
    "subscriptionAmountWords" TEXT,
    "incorporationDate" TIMESTAMP(3),
    "incorporationPlace" TEXT,
    "countryOfFormation" TEXT,
    "mailingAddress" TEXT,
    "incomingBankLocation" TEXT,
    "signatoryCapacity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investorId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNotes" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investorId" TEXT NOT NULL,
    "signatureRequestId" TEXT NOT NULL,
    "signatureId" TEXT,
    "pdfFilePath" TEXT,
    "signedPdfPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "signedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investors_cpfCnpj_key" ON "investors"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "investors_email_key" ON "investors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "signatures_signatureRequestId_key" ON "signatures"("signatureRequestId");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
