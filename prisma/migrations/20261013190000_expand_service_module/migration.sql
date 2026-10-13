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
"status" = CASE WHEN "isActive" THEN 'PUBLISHED'::"ContentStatus" ELSE 'DRAFT'::"ContentStatus" END;

UPDATE "Service" SET
  "businessProblems" = CASE
    WHEN "category" = 'Web Development' THEN ARRAY['The website does not clearly communicate the offer or guide visitors to a useful next step.', 'Slow, inaccessible, or difficult-to-update pages create friction for customers and staff.']::TEXT[]
    WHEN "category" = 'Business Management Systems' THEN ARRAY['Stock, sales, staff, and customer records are scattered across tools.', 'Teams lack timely visibility into routine operations.']::TEXT[]
    WHEN "category" = 'UI/UX and Product Design' THEN ARRAY['Users struggle to understand important product flows.', 'Teams are building without enough evidence about user needs.']::TEXT[]
    WHEN "category" = 'Cloud, DevOps, AI and Application Security' THEN ARRAY['Releases are manual, environments are unreliable, or risk is difficult to assess.', 'Automation ideas lack clear controls and integration boundaries.']::TEXT[]
    WHEN "category" = 'Digital Marketing, Maintenance and Technical Support' THEN ARRAY['A digital presence is not being maintained or measured consistently.', 'Small technical issues and updates accumulate without a clear owner.']::TEXT[]
    ELSE ARRAY['Manual work and disconnected tools make important processes hard to repeat.', 'Existing software no longer fits business rules or customer needs.']::TEXT[]
  END,
  "deliverables" = "features" || ARRAY['Implementation notes and handover guidance']::TEXT[],
  "technologies" = CASE
    WHEN "category" = 'Web Development' THEN ARRAY['Next.js', 'React', 'TypeScript', 'PostgreSQL or a project-appropriate CMS']::TEXT[]
    WHEN "category" = 'Business Management Systems' THEN ARRAY['TypeScript', 'PostgreSQL', 'APIs and payment integrations selected for the project']::TEXT[]
    WHEN "category" = 'UI/UX and Product Design' THEN ARRAY['Figma', 'Interactive prototypes', 'Accessibility and usability review methods']::TEXT[]
    WHEN "category" = 'Cloud, DevOps, AI and Application Security' THEN ARRAY['Cloud platforms selected for the project', 'CI/CD tooling', 'Security testing tools']::TEXT[]
    WHEN "category" = 'Digital Marketing, Maintenance and Technical Support' THEN ARRAY['Analytics platforms', 'Search tools', 'Monitoring and managed update workflows']::TEXT[]
    ELSE ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Cloud deployment selected for the project']::TEXT[]
  END,
  "benefits" = ARRAY['A solution shaped around real requirements.', 'A maintainable foundation with clear next steps.']::TEXT[],
  "useCases" = CASE
    WHEN "category" = 'Web Development' THEN ARRAY['Company and service websites', 'Campaign landing pages and online stores']::TEXT[]
    WHEN "category" = 'Business Management Systems' THEN ARRAY['Retail and wholesale operations', 'Education, hospitality, and service businesses']::TEXT[]
    WHEN "category" = 'UI/UX and Product Design' THEN ARRAY['New product discovery and prototyping', 'Usability improvements and design systems']::TEXT[]
    WHEN "category" = 'Cloud, DevOps, AI and Application Security' THEN ARRAY['Cloud deployments and release pipelines', 'Security reviews and carefully scoped automation']::TEXT[]
    WHEN "category" = 'Digital Marketing, Maintenance and Technical Support' THEN ARRAY['Ongoing website and application care', 'Search visibility and digital campaign support']::TEXT[]
    ELSE ARRAY['Internal applications and customer portals', 'APIs, data platforms, and SaaS products']::TEXT[]
  END,
  "faqs" = jsonb_build_array(
    jsonb_build_object('question', 'What is included in this service?', 'answer', 'The final scope is agreed together and confirmed in writing before work begins.'),
    jsonb_build_object('question', 'How is the project price determined?', 'answer', 'Pricing depends on requirements, integrations, content, and delivery constraints. We confirm the scope and provide a written quotation before work begins.'),
    jsonb_build_object('question', 'How long does delivery take?', 'answer', 'Timing depends on scope and review needs. We agree on a delivery plan after understanding your requirements.')
  ),
  "priceType" = 'CUSTOM_QUOTE',
  "amount" = NULL;

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
