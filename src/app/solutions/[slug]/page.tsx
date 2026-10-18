import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { solutions } from "@/lib/content";
import { getSolutionMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export function generateStaticParams() { return solutions.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = solutions.find((solution) => solution.slug === slug); return item ? getSolutionMetadata(item.slug, item.title, item.summary) : {}; }

export default async function SolutionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = solutions.find((solution) => solution.slug === slug); if (!item) notFound();
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(`/solutions/${item.slug}`, siteUrl).toString();
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: "Solutions", item: new URL("/solutions", siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: item.title, item: pageUrl },
    ],
  };
  return <main className="page-shell"><JsonLd data={breadcrumbs} /><section className="page-hero"><div className="container"><Link href="/solutions" className="text-link" style={{ color: "rgba(255,255,255,.65)" }}><ArrowLeft size={15} /> All solutions</Link><p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> INDUSTRY SOLUTIONS</p><h1>{item.title}</h1><p>{item.summary}</p></div></section><section className="content-section"><div className="container contact-grid"><div><p className="eyebrow dark-eyebrow">YOUR BUSINESS, YOUR CONTEXT</p><h2 style={{ fontSize: 32, letterSpacing: -1.5, lineHeight: 1.15 }}>Digital tools shaped around real-world needs.</h2><p style={{ color: "#737b74", fontSize: 12, lineHeight: 1.9 }}>{item.detail}</p><Link className="button button-lime" href="/contact">Discuss your needs <ArrowRight size={15} /></Link></div><div><h2 style={{ fontSize: 20 }}>A practical place to begin</h2>{["Understand the current workflow and its friction points", "Identify the people, tools, and information involved", "Choose a useful first step and plan for what comes next"].map((text) => <p key={text} style={{ display: "flex", gap: 10, fontSize: 12, color: "#626b63", lineHeight: 1.7 }}><CheckCircle2 size={16} style={{ color: "#71924a", flexShrink: 0 }} />{text}</p>)}</div></div></section></main>;
}
