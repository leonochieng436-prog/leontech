import "server-only";

import { Prisma, type CurrencyCode, type PricingBillingInterval, type PricingPlan, type PricingPriceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PricingPlanRecord = Prisma.PricingPlanGetPayload<{
  include: { category: true };
}>;

export type PublicPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceType: PricingPriceType;
  amount: string | null;
  currency: CurrencyCode;
  billingInterval: PricingBillingInterval | null;
  features: string[];
  exclusions: string[];
  scope: string | null;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  ctaLabel: string;
  sortOrder: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  priceLabel: string;
};

type SeedPricingPlan = {
  name: string;
  slug: string;
  description: string;
  priceType: PricingPriceType;
  amount: string | null;
  currency: CurrencyCode;
  billingInterval: PricingBillingInterval | null;
  features: string[];
  exclusions: string[];
  scope: string | null;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  ctaLabel: string;
  sortOrder: number;
};

type SeedPricingCategory = {
  category: {
    name: string;
    slug: string;
    description: string;
  };
  plans: SeedPricingPlan[];
};

export const pricingSeed: SeedPricingCategory[] = [
  {
    category: { name: "Website development", slug: "website-development", description: "Professional websites and focused brand experiences." },
    plans: [
      { name: "Starter Website", slug: "starter-website", description: "A polished online presence for founders, consultants, and small businesses.", priceType: "STARTING_FROM", amount: "15000", currency: "KES", billingInterval: "ONE_TIME", features: ["Up to five core pages", "Responsive mobile-first layout", "Contact form and WhatsApp integration", "Basic on-page SEO", "Deployment assistance", "Basic handover documentation"], exclusions: ["Domain registration and hosting are billed separately unless agreed.", "Premium stock photography or custom illustrations are extra.", "Ongoing maintenance is separate from the launch package."], scope: "Ideal for individuals, startups, and service businesses needing a clear online presence.", isFeatured: false, isPopular: false, ctaLabel: "Choose Starter", isActive: true, sortOrder: 0 },
      { name: "Business Website", slug: "business-website", description: "Stronger positioning, richer content, and conversion-focused interactions for growing teams.", priceType: "STARTING_FROM", amount: "35000", currency: "KES", billingInterval: "ONE_TIME", features: ["Up to ten core pages", "Custom responsive UI/UX", "Advanced inquiry flows", "Blog or news section", "Analytics and performance tuning", "Deployment and handover"], exclusions: ["Custom CMS or large content migrations are scoped separately.", "Third-party integrations beyond the agreed brief are billed extra.", "Premium hosting, domains, and support retainers are separate."], scope: "Best for businesses that want a stronger digital presence and clearer lead generation.", isFeatured: true, isPopular: true, ctaLabel: "Choose Business", isActive: true, sortOrder: 1 },
      { name: "Premium Website", slug: "premium-website", description: "Custom, content-rich experiences built for higher visibility and more advanced engagement.", priceType: "STARTING_FROM", amount: "65000", currency: "KES", billingInterval: "ONE_TIME", features: ["Custom page layouts and interactions", "Advanced content management", "Advanced SEO and analytics", "Lead capture and conversion tracking", "Testing and quality assurance", "Technical documentation"], exclusions: ["Large-scale content migration, custom systems, and new application logic are scoped separately.", "Any third-party SaaS subscriptions are additional.", "Ongoing optimization is billed as maintenance or a separate retainer."], scope: "Suitable for growing businesses needing more customization, richer content, and conversion-focused improvements.", isFeatured: false, isPopular: false, ctaLabel: "Choose Premium", isActive: true, sortOrder: 2 },
    ],
  },
  {
    category: { name: "E-commerce", slug: "ecommerce", description: "Online stores with product discovery, conversion flows, and operational visibility." },
    plans: [
      { name: "Starter E-commerce", slug: "starter-ecommerce", description: "A clean online shop for product discovery and basic order management.", priceType: "STARTING_FROM", amount: "35000", currency: "KES", billingInterval: "ONE_TIME", features: ["Product catalogue and categories", "Product detail pages", "Shopping cart and order workflow", "WhatsApp checkout or specified integration", "Mobile-friendly storefront", "Basic SEO and order management"], exclusions: ["Payment gateways and delivery provider setups require scope confirmation and provider approvals.", "Inventory integrations and advanced customization are extra.", "Hosting and premium plugins remain separate costs unless included in the brief."], scope: "A strong starting point for small e-commerce businesses and early online brands.", isFeatured: false, isPopular: false, ctaLabel: "Choose Storefront", isActive: true, sortOrder: 0 },
      { name: "Business E-commerce", slug: "business-ecommerce", description: "An operational storefront with stronger merchandising and inventory control.", priceType: "STARTING_FROM", amount: "70000", currency: "KES", billingInterval: "ONE_TIME", features: ["Advanced filters and search", "Inventory integration", "Order management and shipping rules", "Promotional codes and reporting", "Customer account flows where required", "Admin product management"], exclusions: ["Payment gateways and delivery rules require implementation and provider-specific approval.", "Bulk importer tooling and custom business logic are scoped separately.", "Large migrations and complex integrations may require a custom quote."], scope: "Best for brands ready to run richer online sales and operational workflows.", isFeatured: true, isPopular: true, ctaLabel: "Choose Growth", isActive: true, sortOrder: 1 },
      { name: "Advanced E-commerce", slug: "advanced-ecommerce", description: "High-scale storefronts with enhanced merchandising, reporting, and custom logic.", priceType: "STARTING_FROM", amount: "120000", currency: "KES", billingInterval: "ONE_TIME", features: ["Advanced catalogue and merchandising", "Advanced inventory workflows", "Multiple payment and shipping integrations", "Advanced promotions and reporting", "Customer management and sales analytics", "Performance and security testing"], exclusions: ["Large custom integration projects need project consultation and a defined phase plan.", "Provider fees, subscriptions, and hosting costs are not included automatically.", "Ongoing optimization and support are extra and may be arranged as a retainer."], scope: "Designed for larger catalogues, custom flows, and operational complexity.", isFeatured: false, isPopular: false, ctaLabel: "Request a Strategy Call", isActive: true, sortOrder: 2 },
    ],
  },
  {
    category: { name: "Custom software", slug: "custom-software", description: "Tailored applications, SaaS systems, and business software." },
    plans: [
      { name: "Custom Web Application", slug: "custom-web-application", description: "Purpose-built web apps shaped around your workflows and users.", priceType: "CUSTOM_QUOTE", amount: null, currency: "KES", billingInterval: null, features: ["Workflow design and discovery", "Custom dashboards and reporting", "User roles and permissions", "Integrations and migration planning", "Deployment and handover guidance"], exclusions: ["Final pricing depends on scope, integrations, hosting, and required security controls.", "Third-party service subscriptions are billed separately.", "Support and maintenance can be added as a separate monthly plan."], scope: "Built for operations, customer tools, and internal platforms that need custom logic.", isFeatured: false, isPopular: false, ctaLabel: "Request a Quote", isActive: true, sortOrder: 0 },
      { name: "SaaS Platform", slug: "saas-platform", description: "Multi-user product foundations for a growing digital offering.", priceType: "STARTING_FROM", amount: "85000", currency: "KES", billingInterval: "MONTHLY", features: ["Discovery and MVP shaping", "User accounts and permissions", "Subscription or billing workflow integration", "Operational dashboards and analytics", "Scalable architecture review"], exclusions: ["Billing-provider fees and infrastructure costs are additional.", "Large data migrations and custom integrations need scope review.", "Long-term support and enhancements are separate from the initial build."], scope: "Ideal for SaaS founders and product teams building a user-ready platform.", isFeatured: false, isPopular: true, ctaLabel: "Discuss the product", isActive: true, sortOrder: 1 },
      { name: "Business System", slug: "business-system", description: "Operational systems for stock, sales, CRM, ERP, and admin workflows.", priceType: "STARTING_FROM", amount: "95000", currency: "KES", billingInterval: "MONTHLY", features: ["POS and inventory management", "CRM and customer admin", "ERP and operational dashboards", "User role design and reporting", "Secure hosting and deployment support"], exclusions: ["Data migration and migration validation require a defined scope.", "Large integrations and compliance reviews may be extra.", "Ongoing support and user training can be added separately."], scope: "Built for teams that need software to support daily operations and better decision-making.", isFeatured: true, isPopular: false, ctaLabel: "Request a scope review", isActive: true, sortOrder: 2 },
      { name: "Enterprise Software", slug: "enterprise-software", description: "A scoped software engagement for complex workflows, legacy systems, and multiple integrations.", priceType: "CUSTOM_QUOTE", amount: null, currency: "KES", billingInterval: null, features: ["Stakeholder and workflow discovery", "Integration and data-migration planning", "Role-based access and reporting requirements", "Testing and release planning", "Phased deployment and handover guidance"], exclusions: ["Pricing and delivery stages are agreed after requirements and constraints are reviewed.", "Third-party licences, hosting, and provider fees are separate unless listed in the proposal.", "Ongoing maintenance and support are scoped separately."], scope: "For established teams with complex workflows, integrations, or legacy-system requirements.", isFeatured: false, isPopular: false, ctaLabel: "Request an Enterprise Quote", isActive: true, sortOrder: 3 },
    ],
  },
  {
    category: { name: "Support and maintenance", slug: "support-and-maintenance", description: "Ongoing care for performance, updates, and technical health." },
    plans: [
      { name: "Essential Care", slug: "essential-care", description: "Flexible technical support and routine website maintenance.", priceType: "STARTING_FROM", amount: "2500", currency: "KES", billingInterval: "MONTHLY", features: ["Basic website health checks", "Routine updates where applicable", "Basic technical support", "Backup verification", "Monthly support allowance"], exclusions: ["Hosting and third-party subscription fees are separate.", "New feature development or substantial redesign work is scoped separately.", "Priority response windows and larger support allowances are only in higher tiers."], scope: "A practical option for small websites and light business support needs.", isFeatured: false, isPopular: false, ctaLabel: "Choose Essential Care", isActive: true, sortOrder: 0 },
      { name: "Business Care", slug: "business-care", description: "More frequent attention for growing digital products and business websites.", priceType: "STARTING_FROM", amount: "6000", currency: "KES", billingInterval: "MONTHLY", features: ["Everything in Essential Care", "Performance monitoring", "Additional support hours", "Backup monitoring", "Minor content updates within allowance"], exclusions: ["Major updates, custom development, and redesigns are separate work.", "Backups remain the responsibility of the hosting provider unless explicitly included.", "Support response targets are defined within the signed agreement."], scope: "Suitable for active websites, lead-generation systems, and digital operations that need regular upkeep.", isFeatured: true, isPopular: true, ctaLabel: "Choose Business Care", isActive: true, sortOrder: 1 },
      { name: "Premium Care", slug: "premium-care", description: "Priority support and a more strategic maintenance partnership.", priceType: "STARTING_FROM", amount: "12000", currency: "KES", billingInterval: "MONTHLY", features: ["Everything in Business Care", "Priority support", "Enhanced monitoring", "Expanded support allowance", "Periodic technical reviews"], exclusions: ["Major feature work and large replatforming effort are separate from routine care.", "Hosting, third-party subscriptions, and infrastructure costs are additional.", "24/7 coverage is not included unless specifically agreed in writing."], scope: "Best for established digital products that need dependable maintenance and a strategic partner.", isFeatured: false, isPopular: false, ctaLabel: "Choose Premium Care", isActive: true, sortOrder: 2 },
    ],
  },
] as const;

function toCurrencyLabel(currency: CurrencyCode) {
  return currency === "KES" ? "KES" : currency;
}

export function formatPrice(amount: string | number | null | undefined, currency: CurrencyCode = "KES", billingInterval: PricingBillingInterval | null = null, priceType: PricingPriceType = "FIXED") {
  if (priceType === "CUSTOM_QUOTE" || priceType === "CONTACT_FOR_PRICING") return "Custom quote";
  if (amount === null || amount === undefined || amount === "") return "Custom quote";
  const numeric = typeof amount === "number" ? amount : Number.parseFloat(String(amount));
  if (Number.isNaN(numeric)) return `${toCurrencyLabel(currency)} ${String(amount)}`;
  const formatted = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(numeric);
  const suffix = billingInterval && billingInterval !== "ONE_TIME" ? ` / ${billingInterval.toLowerCase()}` : "";
  return `${toCurrencyLabel(currency)} ${formatted}${suffix}`;
}

export function normalizePricingPlan(plan: PricingPlanRecord): PublicPlan {
  const price = plan.amount ? String(plan.amount) : null;
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    priceType: plan.priceType,
    amount: price,
    currency: plan.currency,
    billingInterval: plan.billingInterval,
    features: plan.features,
    exclusions: plan.exclusions,
    scope: plan.scope,
    isFeatured: plan.isFeatured,
    isPopular: plan.isPopular,
    isActive: plan.isActive,
    ctaLabel: plan.ctaLabel,
    sortOrder: plan.sortOrder,
    category: { id: plan.category.id, name: plan.category.name, slug: plan.category.slug },
    priceLabel: formatPrice(price, plan.currency, plan.billingInterval, plan.priceType),
  };
}

function buildSeedPricingCategories() {
  return pricingSeed.map((category) => ({
    id: category.category.slug,
    name: category.category.name,
    slug: category.category.slug,
    description: category.category.description,
    plans: category.plans.map((plan) => ({
      id: plan.slug,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      priceType: plan.priceType,
      amount: typeof plan.amount === "string" ? plan.amount : null,
      currency: plan.currency,
      billingInterval: plan.billingInterval,
      features: plan.features,
      exclusions: plan.exclusions,
      scope: plan.scope,
      isFeatured: plan.isFeatured,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      ctaLabel: plan.ctaLabel,
      sortOrder: plan.sortOrder,
      category: { id: category.category.slug, name: category.category.name, slug: category.category.slug },
      priceLabel: formatPrice(plan.amount, plan.currency, plan.billingInterval, plan.priceType),
    })),
  }));
}

export async function getPublicPricingCategories() {
  if (!process.env.DATABASE_URL) {
    return buildSeedPricingCategories();
  }

  try {
    const categories = await prisma.pricingCategory.findMany({
      where: { isActive: true },
      include: { plans: { where: { isActive: true }, orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }] } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (categories.length === 0 || categories.every((category) => !category.plans.length)) {
      return buildSeedPricingCategories();
    }

    return categories.map((category) => ({
      ...category,
      plans: category.plans.map((plan) => normalizePricingPlan({ ...plan, category })),
    }));
  } catch (error) {
    console.warn("Falling back to seeded pricing data because the pricing tables are unavailable:", error);
    return buildSeedPricingCategories();
  }
}

export async function getPublicPricingPlans() {
  const categories = await getPublicPricingCategories();
  const plans = categories.flatMap((category) => category.plans);

  if (plans.length === 0) {
    return buildSeedPricingCategories().flatMap((category) => category.plans);
  }

  return plans;
}

export async function getPublicPricingPlanBySlug(slug: string) {
  const plans = await getPublicPricingPlans();
  return plans.find((plan) => plan.slug === slug) ?? null;
}

export async function buildWhatsAppInquiryLink(serviceName: string, planName: string, priceText: string, features: string[] = []) {
  const number = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "") ?? "";
  if (!number) return null;
  const message = [
    "Hello Leon.Tech,",
    `I am interested in the ${planName} package for ${serviceName}.`,
    "Please help me discuss my requirements and receive a detailed quotation.",
    `Selected package price: ${priceText}.`,
    features.length ? `Relevant requirements: ${features.slice(0, 4).join(", ")}.` : "",
  ].filter(Boolean).join(" ");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
