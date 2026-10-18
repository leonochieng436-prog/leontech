import type { MetadataRoute } from "next";
import { services, solutions } from "@/lib/content";
import { getPublicArticles, getPublicProjects, getPublicServices } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const fixed = ["", "/about", "/services", "/solutions", "/pricing", "/contact", "/faq"];
  const [serviceItems, projectItems, articleItems] = process.env.DATABASE_URL
    ? await Promise.all([getPublicServices(), getPublicProjects(), getPublicArticles()])
    : [services, [], []];
  const dynamic = [
    ...serviceItems.map((item) => `/services/${item.slug}`),
    ...projectItems.map((item) => `/portfolio/${item.slug}`),
    ...articleItems.filter((article) => article.content?.trim()).map((item) => `/blog/${item.slug}`),
  ];
  const contentIndexPages = [
    ...(projectItems.length ? ["/portfolio"] : []),
    ...(articleItems.some((article) => article.content?.trim()) ? ["/blog"] : []),
  ];
  const solutionPages = solutions.map((solution) => `/solutions/${solution.slug}`);
  const paths = [...fixed, ...contentIndexPages, ...solutionPages, ...dynamic];
  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.6 : 1,
  }));
}
