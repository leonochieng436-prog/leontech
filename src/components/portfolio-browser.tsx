"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { projects } from "@/lib/content";

export function PortfolioBrowser({ items, isSample, initialCategory = "All work", initialQuery = "" }: { items: typeof projects; isSample: boolean; initialCategory?: string; initialQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const categories = useMemo(() => ["All work", ...new Set(items.map((project) => project.category))], [items]);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All work");
  const [query, setQuery] = useState(initialQuery);
  function syncFilters(nextCategory: string, nextQuery: string) {
    const params = new URLSearchParams();
    if (nextCategory !== "All work") params.set("category", nextCategory);
    if (nextQuery) params.set("q", nextQuery);
    const suffix = params.size ? `?${params.toString()}` : "";
    router.replace(`${pathname}${suffix}`, { scroll: false });
  }
  const visible = useMemo(() => items.filter((project) => (category === "All work" || project.category === category) && `${project.title} ${project.summary} ${project.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [category, items, query]);
  return <div>
    <div className="portfolio-controls"><div className="filter-list" role="group" aria-label="Filter projects by category">{categories.map((item) => <button key={item} type="button" className={`filter-chip${category === item ? " active" : ""}`} aria-pressed={category === item} onClick={() => { setCategory(item); syncFilters(item, query); }}>{item}</button>)}</div><label className="search-field"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); syncFilters(category, event.target.value); }} placeholder="Search work" aria-label="Search portfolio" /></label></div>
    <div className="project-grid">{visible.map((project) => <article className="project-card" key={project.slug}><Link href={`/portfolio/${project.slug}`} className={`project-art ${project.accent}`} aria-label={`View ${isSample ? "sample " : ""}project ${project.title}`}><div className="project-window"><div className="window-top"><span /><span /><span /></div><div className="window-content"><div className="window-mark">L<span>.</span></div><span className="window-lines"><i /><i /><i /></span><span className="window-block" /></div></div><span className="project-index">{project.mark}{isSample ? " / SAMPLE CONCEPT" : ""}</span><span className="project-open"><ArrowUpRight size={16} /></span></Link><div className="project-info"><div><span className="project-category">{project.category}{isSample ? " · SAMPLE CONCEPT" : ""}</span><h2><Link href={`/portfolio/${project.slug}`}>{project.title}</Link></h2><p>{project.summary}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><Link className="project-link" href={`/portfolio/${project.slug}`} aria-label={`View ${project.title}`}><ArrowUpRight size={17} /></Link></div></article>)}</div>
    {visible.length === 0 && <p className="empty-note">No projects match this search. Try another category or phrase.</p>}
    {isSample && <p className="sample-disclaimer"><Check size={14} /> These are illustrative sample concepts—not client work. Published project case studies will be added with client permission and verified details.</p>}
  </div>;
}
