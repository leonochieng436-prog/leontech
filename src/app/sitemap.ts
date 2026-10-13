import type { MetadataRoute } from "next";
import { articles, projects, services } from "@/lib/content";
import { getPublicArticles, getPublicProjects, getPublicServices } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const fixed = ["", "/about", "/services", "/solutions", "/portfolio", "/blog", "/contact", "/faq", "/privacy-policy", "/terms", "/cookies"];
  const [serviceItems, projectItems, articleItems] = process.env.DATABASE_URL
    ? await Promise.all([getPublicServices(), getPublicProjects(), getPublicArticles()])
    : [services, projects, articles];
  const dynamic = [
    ...serviceItems.map((item) => `/services/${item.slug}`),
    ...projectItems.map((item) => `/portfolio/${item.slug}`),
    ...articleItems.map((item) => `/blog/${item.slug}`),
  ];
  return [...fixed, ...dynamic].map((path) => ({ url: `${base}${path}`, changeFrequency: path ? "monthly" : "weekly", priority: path ? 0.6 : 1 }));
}
