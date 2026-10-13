import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Code2 } from "lucide-react";
import { services } from "@/lib/content";
import { getPublicService } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  return service ? { title: service.title, description: service.summary } : {};
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) notFound();
  return <main className="page-shell">
    <section className="page-hero"><div className="container"><Link href="/services" className="text-link" style={{ color: "rgba(255,255,255,.65)" }}><ArrowLeft size={15} /> All services</Link><p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> {service.category.toUpperCase()}</p><h1>{service.title}</h1><p>{service.summary}</p></div></section>
    <section className="content-section"><div className="container contact-grid"><div><p className="eyebrow dark-eyebrow">THE RIGHT FIT, BUILT WELL</p><h2 style={{ fontSize: 32, letterSpacing: -1.5, lineHeight: 1.15 }}>Useful technology begins with understanding the work.</h2><p style={{ fontSize: 12, color: "#737b74", lineHeight: 1.9 }}>{service.description}</p><Link className="button button-lime" href={`/contact?service=${service.slug}`} style={{ marginTop: 18 }}>Talk about this service <ArrowRight size={15} /></Link></div><div><span className="service-icon" style={{ width: 48, height: 48 }}><Code2 size={23} /></span><h2 style={{ fontSize: 20 }}>What we can help with</h2><ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 15 }}>{service.features.map((feature) => <li key={feature} style={{ display: "flex", gap: 10, fontSize: 12, color: "#616961" }}><Check size={15} style={{ color: "#70934b", flexShrink: 0 }} />{feature}</li>)}</ul></div></div></section>
  </main>;
}
