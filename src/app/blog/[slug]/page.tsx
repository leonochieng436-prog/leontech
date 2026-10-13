import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articles } from "@/lib/content";
import { getPublicArticle } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = await getPublicArticle(slug); return item ? { title: item.title, description: item.excerpt } : {}; }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = await getPublicArticle(slug); if (!article) notFound();
  const paragraphs = "content" in article && article.content ? article.content.split(/\n{2,}/).filter(Boolean) : [article.excerpt, "Start by understanding the people who will use the product and the job they need to get done. The strongest digital products are shaped by real needs—not by a feature checklist.", "Write down the most important thing your website or product should help someone do. Then be specific about who that person is, what they need to know, and what might prevent them from taking the next step.", "There is no one-size-fits-all answer. Start with the business problem, listen to the people closest to it, and choose the simplest approach that genuinely improves the experience."];
  return <main className="page-shell"><section className="page-hero"><div className="container"><Link href="/blog" className="text-link" style={{ color: "rgba(255,255,255,.65)" }}><ArrowLeft size={15} /> All insights</Link><p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> {article.category.toUpperCase()} · {article.date.toUpperCase()}</p><h1>{article.title}</h1><p>{article.excerpt}</p><p className="article-byline">By {article.authorName}</p></div></section><section className="content-section"><article className="article-content">{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>)}<p><Link className="button button-lime" href="/contact">Talk through your idea <ArrowUpRight size={15} /></Link></p></article></section></main>;
}
