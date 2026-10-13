import type { Metadata } from "next";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getPublicProjects } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Selected work", description: "Explore Leon.Tech's illustrative product and digital experience concepts." };

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const projects = await getPublicProjects();
  const { category = "All work", q = "" } = await searchParams;
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> SELECTED WORK</p><h1>Good ideas deserve<br /><span style={{ color: "var(--lime)" }}>good execution.</span></h1><p>{process.env.DATABASE_URL ? "Thoughtful digital products start with thoughtful collaboration. Explore selected Leon.Tech projects." : "Thoughtful digital products start with thoughtful collaboration. Explore a few sample concepts that show how we approach the work."}</p></div></section><section className="content-section"><div className="container">{projects.length ? <PortfolioBrowser items={projects} isSample={!process.env.DATABASE_URL} initialCategory={category} initialQuery={q} /> : <p className="empty-note">Portfolio projects will appear here as they are published.</p>}</div></section></main>;
}
