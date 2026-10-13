import "server-only";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { articles, projects, services } from "@/lib/content";

type PublicService = (typeof services)[number];
type PublicProject = (typeof projects)[number] & { challenge?: string; solution?: string; liveUrl?: string | null; features?: string[] };
type PublicArticle = (typeof articles)[number] & { content?: string; authorName: string };

export async function getPublicServices(): Promise<PublicService[]> {
  if (!process.env.DATABASE_URL) return services;
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: { slug: true, title: true, category: true, shortDescription: true, description: true, icon: true, features: true },
  }).then((items) => items.map((item) => ({ ...item, summary: item.shortDescription })));
}

export async function getPublicService(slug: string): Promise<PublicService | null> {
  if (!process.env.DATABASE_URL) return services.find((item) => item.slug === slug) ?? null;
  const item = await prisma.service.findFirst({
    where: { slug, isActive: true },
    select: { slug: true, title: true, category: true, shortDescription: true, description: true, icon: true, features: true },
  });
  return item ? { ...item, summary: item.shortDescription } : null;
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
