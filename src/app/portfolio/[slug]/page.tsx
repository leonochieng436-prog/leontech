import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { projects } from "@/lib/content";
import { getPublicProject } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicProject(slug);
  if (!item) return { title: "Page not found" };
  const isSample = !process.env.DATABASE_URL;
  return createPageMetadata({
    title: item.title,
    description: item.summary,
    path: `/portfolio/${item.slug}`,
    robots: { index: !isSample, follow: true },
  });
}

export default async function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = await getPublicProject(slug); if (!item) notFound();
  const isSample = !process.env.DATABASE_URL;
  const siteUrl = getSiteUrl();
  const projectUrl = new URL(`/portfolio/${item.slug}`, siteUrl).toString();
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: new URL("/portfolio", siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: item.title, item: projectUrl },
    ],
  };
  return <main className="page-shell"><JsonLd data={breadcrumbs} /><section className="page-hero"><div className="container"><Link href="/portfolio" className="text-link" style={{ color: "rgba(255,255,255,.65)" }}><ArrowLeft size={15} /> Selected work</Link><p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> {isSample ? "SAMPLE CONCEPT · " : ""}{item.category.toUpperCase()}</p><h1>{item.title}</h1><p>{item.summary}</p></div></section><section className="content-section"><div className="container article-content">{isSample && <div className="sample-disclaimer"><Check size={15} /> Illustrative sample concept created to demonstrate approach. This is not a representation of completed client work, measurable outcomes, or an active product.</div>}<h2>{isSample ? "The opportunity" : "The challenge"}</h2><p>{item.challenge ?? "We begin with discovery: understanding current workflows, user needs, business constraints, and how success will be measured."}</p><h2>{isSample ? "A thoughtful approach" : "The solution"}</h2><p>{item.solution ?? "We shape a useful release around the most important tasks, test design decisions, and build a technical foundation that teams can maintain and extend."}</p><h2>Project focus</h2><ul>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>{item.liveUrl && <p><a className="underlined-link" href={item.liveUrl} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14} /></a></p>}<p><Link className="button button-lime" href="/contact">Build something similar <ArrowUpRight size={15} /></Link></p><p><Link className="underlined-link" href="/portfolio">Back to selected work</Link></p></div></section></main>;
}
