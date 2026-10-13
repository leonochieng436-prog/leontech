"use server";

import { ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { SERVICE_CATEGORIES, type ServiceFaq } from "@/lib/content";

const optionalUrl = z.string().trim().max(2048).refine((value) => !value || /^https?:\/\/\S+$/i.test(value), "Use a valid http or https URL.");
const serviceSchema = z.object({
  title: z.string().trim().min(3).max(100),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  shortDescription: z.string().trim().min(10).max(250),
  description: z.string().trim().min(20).max(5000),
  category: z.enum(SERVICE_CATEGORIES),
  icon: z.string().trim().min(1).max(40),
  businessProblems: z.string().max(5000),
  features: z.string().max(5000),
  deliverables: z.string().max(5000),
  technologies: z.string().max(3000),
  benefits: z.string().max(3000),
  useCases: z.string().max(3000),
  faqs: z.string().max(6000),
  coverImage: optionalUrl,
  deliveryEstimate: z.string().trim().max(120),
  priceType: z.enum(["FIXED", "STARTING_FROM", "CUSTOM_QUOTE", "CONTACT_FOR_PRICING"]),
  amount: z.string().trim().regex(/^(?:\d{1,10}(?:\.\d{1,2})?)?$/, "Enter a non-negative amount with up to two decimals."),
  currency: z.enum(["KES", "USD", "EUR"]),
  billingInterval: z.enum(["", "ONE_TIME", "HOURLY", "DAILY", "MONTHLY", "ANNUALLY"]),
  pricingPlanId: z.string().trim().max(30),
  status: z.nativeEnum(ContentStatus),
  seoTitle: z.string().trim().max(160),
  seoDescription: z.string().trim().max(320),
  seoCanonicalUrl: optionalUrl,
});

function formToService(formData: FormData) {
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Please check the service details.");

  const faqItems: ServiceFaq[] = parsed.data.faqs
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("|");
      if (separator < 1 || separator === line.length - 1) throw new Error("Enter each FAQ as a question | answer on its own line.");
      return { question: line.slice(0, separator).trim(), answer: line.slice(separator + 1).trim() };
    });
  if (faqItems.length > 20) throw new Error("A service can have at most 20 FAQs.");
  const relatedProjectIds = formData.getAll("relatedProjectIds").filter((value): value is string => typeof value === "string");

  return {
    ...parsed.data,
    businessProblems: splitLines(parsed.data.businessProblems),
    features: splitLines(parsed.data.features),
    deliverables: splitLines(parsed.data.deliverables),
    technologies: splitLines(parsed.data.technologies),
    benefits: splitLines(parsed.data.benefits),
    useCases: splitLines(parsed.data.useCases),
    faqs: faqItems,
    amount: parsed.data.amount || null,
    billingInterval: parsed.data.billingInterval || null,
    pricingPlanId: parsed.data.pricingPlanId || null,
    status: parsed.data.status,
    isActive: parsed.data.status === ContentStatus.PUBLISHED,
    coverImage: parsed.data.coverImage || null,
    deliveryEstimate: parsed.data.deliveryEstimate || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    seoCanonicalUrl: parsed.data.seoCanonicalUrl || null,
    relatedProjectIds: [...new Set(relatedProjectIds)],
  };
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 50);
}

async function validateRelations(pricingPlanId: string | null, relatedProjectIds: string[]) {
  if (pricingPlanId) {
    const plan = await prisma.pricingPlan.findFirst({ where: { id: pricingPlanId, isActive: true }, select: { id: true } });
    if (!plan) throw new Error("Select an existing pricing plan or leave pricing plan blank.");
  }
  if (relatedProjectIds.length) {
    const projects = await prisma.portfolioProject.findMany({ where: { id: { in: relatedProjectIds } }, select: { id: true } });
    if (projects.length !== relatedProjectIds.length) throw new Error("One or more selected portfolio projects are no longer available.");
  }
}

function revalidateServiceRoutes(slug?: string, previousSlug?: string) {
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/services/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/services/${previousSlug}`);
}

export async function createService(formData: FormData) {
  await requireRole("services:write");
  const service = formToService(formData);
  await validateRelations(service.pricingPlanId, service.relatedProjectIds);
  try {
    const created = await prisma.service.create({
      data: {
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        category: service.category,
        icon: service.icon,
        businessProblems: service.businessProblems,
        features: service.features,
        deliverables: service.deliverables,
        technologies: service.technologies,
        benefits: service.benefits,
        useCases: service.useCases,
        faqs: service.faqs,
        coverImage: service.coverImage,
        deliveryEstimate: service.deliveryEstimate,
        priceType: service.priceType,
        amount: service.amount ? new Prisma.Decimal(service.amount) : null,
        currency: service.currency,
        billingInterval: service.billingInterval,
        pricingPlanId: service.pricingPlanId,
        status: service.status,
        isActive: service.isActive,
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
        seoCanonicalUrl: service.seoCanonicalUrl,
        sortOrder: await prisma.service.count(),
        relatedProjects: { create: service.relatedProjectIds.map((projectId) => ({ project: { connect: { id: projectId } } })) },
      },
      select: { slug: true },
    });
    revalidateServiceRoutes(created.slug);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("That service slug is already in use.");
    throw error;
  }
}

export async function updateService(formData: FormData) {
  await requireRole("services:write");
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) throw new Error("Invalid service record.");
  const service = formToService(formData);
  await validateRelations(service.pricingPlanId, service.relatedProjectIds);
  const current = await prisma.service.findUnique({ where: { id: id.data }, select: { slug: true } });
  if (!current) throw new Error("This service no longer exists.");
  try {
    const updated = await prisma.service.update({
      where: { id: id.data },
      data: {
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        category: service.category,
        icon: service.icon,
        businessProblems: service.businessProblems,
        features: service.features,
        deliverables: service.deliverables,
        technologies: service.technologies,
        benefits: service.benefits,
        useCases: service.useCases,
        faqs: service.faqs,
        coverImage: service.coverImage,
        deliveryEstimate: service.deliveryEstimate,
        priceType: service.priceType,
        amount: service.amount ? new Prisma.Decimal(service.amount) : null,
        currency: service.currency,
        billingInterval: service.billingInterval,
        pricingPlanId: service.pricingPlanId,
        status: service.status,
        isActive: service.isActive,
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
        seoCanonicalUrl: service.seoCanonicalUrl,
        relatedProjects: {
          deleteMany: {},
          create: service.relatedProjectIds.map((projectId) => ({ project: { connect: { id: projectId } } })),
        },
      },
      select: { slug: true },
    });
    revalidateServiceRoutes(updated.slug, current.slug);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("That service slug is already in use.");
    throw error;
  }
}

export async function toggleService(formData: FormData) {
  await requireRole("services:write");
  const parsed = z.object({ id: z.string().cuid(), status: z.nativeEnum(ContentStatus) }).safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Invalid service update.");
  const item = await prisma.service.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status, isActive: parsed.data.status === ContentStatus.PUBLISHED },
    select: { slug: true },
  });
  revalidateServiceRoutes(item.slug);
}

export async function moveService(formData: FormData) {
  await requireRole("services:write");
  const parsed = z.object({ id: z.string().cuid(), direction: z.enum(["up", "down"]) }).safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Invalid service reorder request.");
  const items = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, slug: true, sortOrder: true } });
  const index = items.findIndex((item) => item.id === parsed.data.id);
  const neighborIndex = index + (parsed.data.direction === "up" ? -1 : 1);
  if (index < 0 || neighborIndex < 0 || neighborIndex >= items.length) return;
  const current = items[index];
  const neighbor = items[neighborIndex];
  await prisma.$transaction([
    prisma.service.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.service.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidateServiceRoutes(current.slug);
  revalidateServiceRoutes(neighbor.slug);
}
