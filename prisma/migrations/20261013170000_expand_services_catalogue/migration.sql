ALTER TABLE "Service"
  ADD COLUMN "businessProblems" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "deliverables" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "benefits" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "useCases" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "faqs" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "coverImage" TEXT,
  ADD COLUMN "deliveryEstimate" TEXT,
  ADD COLUMN "priceType" "PricingPriceType" NOT NULL DEFAULT 'CUSTOM_QUOTE',
  ADD COLUMN "amount" DECIMAL(12,2),
  ADD COLUMN "currency" "CurrencyCode" NOT NULL DEFAULT 'KES',
  ADD COLUMN "billingInterval" "PricingBillingInterval",
  ADD COLUMN "pricingPlanId" TEXT,
  ADD COLUMN "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  ADD COLUMN "seoCanonicalUrl" TEXT;

UPDATE "Service" SET "category" = CASE
  WHEN "slug" IN ('web-design-development', 'ecommerce', 'business-websites') THEN 'Web Development'
  WHEN "slug" IN ('business-systems', 'point-of-sale', 'inventory-management', 'erp-crm-hr-payroll', 'school-management', 'hotel-management') THEN 'Business Management Systems'
  WHEN "slug" = 'ui-ux-design' THEN 'UI/UX and Product Design'
  WHEN "slug" IN ('cloud-devops', 'workflow-automation') THEN 'Cloud, DevOps, AI and Application Security'
  WHEN "slug" = 'security-support' THEN 'Digital Marketing, Maintenance and Technical Support'
  ELSE 'Software Engineering'
END,
"isActive" = true,
"status" = 'PUBLISHED';

CREATE INDEX "Service_category_status_sortOrder_idx" ON "Service"("category", "status", "sortOrder");
CREATE INDEX "Service_pricingPlanId_idx" ON "Service"("pricingPlanId");

ALTER TABLE "Service"
  ADD CONSTRAINT "Service_pricingPlanId_fkey"
  FOREIGN KEY ("pricingPlanId") REFERENCES "PricingPlan"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ServicePortfolioProject" (
  "serviceId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  CONSTRAINT "ServicePortfolioProject_pkey" PRIMARY KEY ("serviceId", "projectId")
);

CREATE INDEX "ServicePortfolioProject_projectId_idx" ON "ServicePortfolioProject"("projectId");

ALTER TABLE "ServicePortfolioProject"
  ADD CONSTRAINT "ServicePortfolioProject_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "ServicePortfolioProject_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;