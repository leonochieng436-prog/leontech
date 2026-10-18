import type { Metadata } from "next";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getPublicProjects } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const projects = await getPublicProjects();
  const hasPublishedProjects = Boolean(process.env.DATABASE_URL) && projects.length > 0;
  return createPageMetadata({
    title: "Software & Website Project Portfolio",
    description: hasPublishedProjects
      ? "Explore published Leon.Tech software, website, and business system projects with verified project details."
      : "Browse clearly labelled sample concepts from Leon.Tech while verified project case studies are prepared.",
    path: "/portfolio",
    robots: { index: hasPublishedProjects, follow: true },
  });
}

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const projects = await getPublicProjects();
  const { category = "All work", q = "" } = await searchParams;
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> SELECTED WORK</p><h1>Good ideas deserve<br /><span style={{ color: "var(--lime)" }}>good execution.</span></h1><p>{process.env.DATABASE_URL ? "Thoughtful digital products start with thoughtful collaboration. Explore selected Leon.Tech projects." : "Thoughtful digital products start with thoughtful collaboration. Explore a few sample concepts that show how we approach the work."}</p></div></section><section className="content-section"><div className="container">{projects.length ? <PortfolioBrowser items={projects} isSample={!process.env.DATABASE_URL} initialCategory={category} initialQuery={q} /> : <p className="empty-note">Portfolio projects will appear here as they are published.</p>}</div></section></main>;
}
