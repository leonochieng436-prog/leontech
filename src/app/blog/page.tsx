import type { Metadata } from "next";
import { BlogBrowser } from "@/components/blog-browser";
import { getPublicArticles } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const articles = await getPublicArticles();
  const hasPublishedArticles = Boolean(process.env.DATABASE_URL) && articles.length > 0;
  return createPageMetadata({
    title: "Web & Software Development Insights",
    description: hasPublishedArticles
      ? "Practical guidance on planning business websites, custom software, digital products, and better business tools."
      : "Leon.Tech insights will be published here when original articles are ready.",
    path: "/blog",
    robots: { index: hasPublishedArticles, follow: true },
  });
}
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; page?: string }> }) { const [articles, params] = await Promise.all([getPublicArticles(), searchParams]); const page = Math.max(1, Math.min(1000, Number.parseInt(params.page ?? "1", 10) || 1)); return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> NOTES FROM THE STUDIO</p><h1>Ideas for building<br /><span style={{ color: "var(--lime)" }}>what comes next.</span></h1><p>Practical perspectives on digital products, software, and making technology work better for your business.</p></div></section><section className="content-section"><div className="container">{articles.length ? <BlogBrowser items={articles} initialQuery={params.q ?? ""} initialCategory={params.category ?? "All categories"} initialPage={page} /> : <p className="empty-note">Articles will appear here when they are published.</p>}</div></section></main>; }
