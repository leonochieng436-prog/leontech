-- CreateEnum
CREATE TYPE "PricingPriceType" AS ENUM ('FIXED', 'STARTING_FROM', 'CUSTOM_QUOTE', 'CONTACT_FOR_PRICING');

-- CreateEnum
CREATE TYPE "PricingBillingInterval" AS ENUM ('ONE_TIME', 'HOURLY', 'DAILY', 'MONTHLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('KES', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "EstimatorRuleType" AS ENUM ('BASE', 'FEATURE', 'COMPLEXITY', 'INTEGRATION', 'CONTINGENCY');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('NEW', 'REVIEWING', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'ACCEPTED', 'DECLINED', 'CONVERTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "PricingCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceType" "PricingPriceType" NOT NULL DEFAULT 'FIXED',
    "amount" DECIMAL(12,2),
    "currency" "CurrencyCode" NOT NULL DEFAULT 'KES',
    "billingInterval" "PricingBillingInterval",
    "features" TEXT[],
    "exclusions" TEXT[],
    "scope" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Choose plan',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorRule" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ruleType" "EstimatorRuleType" NOT NULL,
    "amount" DECIMAL(12,2),
    "multiplier" DECIMAL(10,4),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "serviceType" TEXT,
    "pricingPlanId" TEXT,
    "pricingPlanSnapshot" JSONB,
    "projectDescription" TEXT NOT NULL,
    "requestedFeatures" TEXT,
    "budget" TEXT,
    "timeline" TEXT,
    "estimateMin" DECIMAL(12,2),
    "estimateMax" DECIMAL(12,2),
    "currency" "CurrencyCode" NOT NULL DEFAULT 'KES',
    "status" "QuoteStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteNote" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingCategory_slug_key" ON "PricingCategory"("slug");

-- CreateIndex
CREATE INDEX "PricingCategory_isActive_sortOrder_idx" ON "PricingCategory"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_slug_key" ON "PricingPlan"("slug");

-- CreateIndex
CREATE INDEX "PricingPlan_categoryId_isActive_sortOrder_idx" ON "PricingPlan"("categoryId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "EstimatorRule_category_isActive_sortOrder_idx" ON "EstimatorRule"("category", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorRule_category_key_key" ON "EstimatorRule"("category", "key");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRequest_referenceNumber_key" ON "QuoteRequest"("referenceNumber");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_createdAt_idx" ON "QuoteRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteRequest_email_idx" ON "QuoteRequest"("email");

-- CreateIndex
CREATE INDEX "QuoteRequest_pricingPlanId_idx" ON "QuoteRequest"("pricingPlanId");

-- CreateIndex
CREATE INDEX "QuoteNote_quoteRequestId_createdAt_idx" ON "QuoteNote"("quoteRequestId", "createdAt");

-- AddForeignKey
ALTER TABLE "PricingPlan" ADD CONSTRAINT "PricingPlan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PricingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_pricingPlanId_fkey" FOREIGN KEY ("pricingPlanId") REFERENCES "PricingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteNote" ADD CONSTRAINT "QuoteNote_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteNote" ADD CONSTRAINT "QuoteNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
