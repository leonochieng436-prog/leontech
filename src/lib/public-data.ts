import "server-only";
import { ContentStatus, Prisma, type PricingBillingInterval, type PricingPriceType, type CurrencyCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { articles, buildServiceSeedContent, projects, services, type ServiceFaq } from "@/lib/content";

export type PublicService = (typeof services)[number] & {
  businessProblems: string[];
  deliverables: string[];
  technologies: string[];
  benefits: string[];
  useCases: string[];
  faqs: ServiceFaq[];
  coverImage: string | null;
  deliveryEstimate: string | null;
  priceType: PricingPriceType;
  amount: string | null;
  currency: CurrencyCode;
  billingInterval: PricingBillingInterval | null;
  priceLabel: string;
  relatedProjects: { slug: string; title: string; summary: string; category: string }[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonicalUrl: string | null;
};
type PublicProject = (typeof projects)[number] & { challenge?: string; solution?: string; liveUrl?: string | null; features?: string[] };
type PublicArticle = (typeof articles)[number] & { content?: string; authorName: string };

function parseServiceFaqs(value: Prisma.JsonValue): ServiceFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const question = "question" in item && typeof item.question === "string" ? item.question : null;
    const answer = "answer" in item && typeof item.answer === "string" ? item.answer : null;
    return question && answer ? [{ question, answer }] : [];
  });
}

function servicePriceLabel(priceType: PricingPriceType, amount: string | null, currency: CurrencyCode, billingInterval: PricingBillingInterval | null) {
  if (!amount || priceType === "CUSTOM_QUOTE" || priceType === "CONTACT_FOR_PRICING") return "Request a Quote";
  const formatted = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(Number(amount));
  const price = `${priceType === "STARTING_FROM" ? "From " : ""}${currency} ${formatted}`;
  return billingInterval && billingInterval !== "ONE_TIME" ? `${price} / ${billingInterval.toLowerCase()}` : price;
}

function mapSeedService(service: (typeof services)[number]): PublicService {
  const details = buildServiceSeedContent(service);
  return {
    ...service,
    category: details.category,
    businessProblems: details.businessProblems,
    deliverables: details.deliverables,
    technologies: details.technologies,
    benefits: details.benefits,
    useCases: details.useCases,
    faqs: details.faqs,
    coverImage: null,
    deliveryEstimate: null,
    priceType: "CUSTOM_QUOTE",
    amount: null,
    currency: "KES",
    billingInterval: null,
    priceLabel: "Request a Quote",
    relatedProjects: [],
    seoTitle: null,
    seoDescription: null,
    seoCanonicalUrl: null,
  };
}

function mapDatabaseService(item: {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  businessProblems: string[];
  deliverables: string[];
  technologies: string[];
  benefits: string[];
  useCases: string[];
  faqs: Prisma.JsonValue;
  coverImage: string | null;
  deliveryEstimate: string | null;
  priceType: PricingPriceType;
  amount: Prisma.Decimal | null;
  currency: CurrencyCode;
  billingInterval: PricingBillingInterval | null;
  pricingPlan: { priceType: PricingPriceType; amount: Prisma.Decimal | null; currency: CurrencyCode; billingInterval: PricingBillingInterval | null } | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonicalUrl: string | null;
  relatedProjects: { project: { slug: string; title: string; summary: string; category: string } }[];
}): PublicService {
  const priceType = item.pricingPlan ? item.pricingPlan.priceType : item.priceType;
  const amount = item.pricingPlan ? item.pricingPlan.amount?.toString() ?? null : item.amount?.toString() ?? null;
  const currency = item.pricingPlan ? item.pricingPlan.currency : item.currency;
  const billingInterval = item.pricingPlan ? item.pricingPlan.billingInterval : item.billingInterval;

  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    summary: item.shortDescription,
    description: item.description,
    icon: item.icon,
    features: item.features,
    businessProblems: item.businessProblems,
    deliverables: item.deliverables,
    technologies: item.technologies,
    benefits: item.benefits,
    useCases: item.useCases,
    faqs: parseServiceFaqs(item.faqs),
    coverImage: item.coverImage,
    deliveryEstimate: item.deliveryEstimate,
    priceType,
    amount,
    currency,
    billingInterval,
    priceLabel: servicePriceLabel(priceType, amount, currency, billingInterval),
    relatedProjects: item.relatedProjects.map(({ project }) => project),
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    seoCanonicalUrl: item.seoCanonicalUrl,
  };
}

const publicServiceSelect = {
  slug: true,
  title: true,
  category: true,
  shortDescription: true,
  description: true,
  icon: true,
  features: true,
  businessProblems: true,
  deliverables: true,
  technologies: true,
  benefits: true,
  useCases: true,
  faqs: true,
  coverImage: true,
  deliveryEstimate: true,
  priceType: true,
  amount: true,
  currency: true,
  billingInterval: true,
  pricingPlan: { select: { priceType: true, amount: true, currency: true, billingInterval: true } },
  seoTitle: true,
  seoDescription: true,
  seoCanonicalUrl: true,
  relatedProjects: {
    where: { project: { status: ContentStatus.PUBLISHED } },
    select: { project: { select: { slug: true, title: true, summary: true, category: true } } },
  },
} satisfies Prisma.ServiceSelect;

export async function getPublicServices(): Promise<PublicService[]> {
  if (!process.env.DATABASE_URL) return services.map(mapSeedService);
  try {
    const items = await prisma.service.findMany({
      where: { isActive: true, status: ContentStatus.PUBLISHED },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: publicServiceSelect,
    });
    if (items.length) return items.map(mapDatabaseService);
    const catalogueSize = await prisma.service.count();
    return catalogueSize === 0 ? services.map(mapSeedService) : [];
  } catch (error) {
    console.warn("Falling back to seeded service content because the service catalogue could not be loaded:", error);
    return services.map(mapSeedService);
  }
}

export async function getPublicService(slug: string): Promise<PublicService | null> {
  if (!process.env.DATABASE_URL) return services.map(mapSeedService).find((item) => item.slug === slug) ?? null;
  try {
    const item = await prisma.service.findFirst({
      where: { slug, isActive: true, status: ContentStatus.PUBLISHED },
      select: publicServiceSelect,
    });
    if (item) return mapDatabaseService(item);
    const catalogueSize = await prisma.service.count();
    return catalogueSize === 0 ? services.map(mapSeedService).find((service) => service.slug === slug) ?? null : null;
  } catch (error) {
    console.warn(`Falling back to seeded service content for ${slug}:`, error);
    return services.map(mapSeedService).find((service) => service.slug === slug) ?? null;
  }
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  if (!process.env.DATABASE_URL) return projects;
  return prisma.portfolioProject.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    select: { slug: true, title: true, category: true, summary: true, technologies: true, coverImage: true, challenge: true, solution: true, features: true, gallery: true, liveUrl: true, isFeatured: true },
  }).then((items) => items.map((item, index) => ({
    slug: item.slug, title: item.title, category: item.category, summary: item.summary, tags: item.technologies,
    accent: ["project-olive", "project-peach", "project-blue"][index % 3], mark: String(index + 1).padStart(2, "0"),
    challenge: item.challenge, solution: item.solution, features: item.features, gallery: item.gallery, liveUrl: item.liveUrl,
  })));
}

export async function getPublicProject(slug: string): Promise<PublicProject | null> {
  if (!process.env.DATABASE_URL) return projects.find((item) => item.slug === slug) ?? null;
  const item = await prisma.portfolioProject.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
    select: { slug: true, title: true, category: true, summary: true, technologies: true, challenge: true, solution: true, features: true, liveUrl: true },
  });
  return item ? {
    slug: item.slug, title: item.title, category: item.category, summary: item.summary, tags: item.technologies,
    accent: "project-olive", mark: "01", challenge: item.challenge, solution: item.solution, features: item.features, liveUrl: item.liveUrl,
  } : null;
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  if (!process.env.DATABASE_URL) return articles.map((item) => ({ ...item, content: undefined, authorName: "Leon.Tech" }));
  return prisma.blogPost.findMany({
    where: { status: ContentStatus.PUBLISHED, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take: 500,
    select: { slug: true, title: true, category: true, publishedAt: true, excerpt: true, content: true, author: { select: { name: true } } },
  }).then((items) => items.map((item) => ({
    ...item,
    authorName: item.author.name,
    date: item.publishedAt?.toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) ?? "",
  })));
}

export async function getPublicArticle(slug: string): Promise<PublicArticle | null> {
  const all = await getPublicArticles();
  return all.find((item) => item.slug === slug) ?? null;
}
