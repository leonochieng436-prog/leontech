import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { articles } from "@/lib/content";
import { getPublicArticle } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicArticle(slug);
  if (!item) return { title: "Page not found" };
  const hasPublishedContent = Boolean(process.env.DATABASE_URL) && Boolean(item.content?.trim());
  return createPageMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/blog/${item.slug}`,
    robots: { index: hasPublishedContent, follow: true },
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = await getPublicArticle(slug); if (!article) notFound();
  const paragraphs = article.content?.split(/\n{2,}/).filter(Boolean) ?? [];
  const siteUrl = getSiteUrl();
  const articleUrl = new URL(`/blog/${article.slug}`, siteUrl).toString();
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: "Insights", item: new URL("/blog", siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };
  return <main className="page-shell"><JsonLd data={breadcrumbs} /><section className="page-hero"><div className="container"><Link href="/blog" className="text-link" style={{ color: "rgba(255,255,255,.65)" }}><ArrowLeft size={15} /> All insights</Link><p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> {article.category.toUpperCase()} · {article.date.toUpperCase()}</p><h1>{article.title}</h1><p>{article.excerpt}</p><p className="article-byline">By {article.authorName}</p></div></section><section className="content-section"><article className="article-content">{paragraphs.length ? paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>) : <div className="sample-disclaimer">This is a short article preview. Full editorial content will be published before this page is indexed.</div>}<p><Link className="button button-lime" href="/contact">Talk through your idea <ArrowUpRight size={15} /></Link></p></article></section></main>;
}
