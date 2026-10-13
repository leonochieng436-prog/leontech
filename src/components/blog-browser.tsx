"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { articles } from "@/lib/content";

type Article = (typeof articles)[number] & { authorName: string };

export function BlogBrowser({ items, initialQuery = "", initialCategory = "All categories", initialPage = 1 }: { items: Article[]; initialQuery?: string; initialCategory?: string; initialPage?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const categories = ["All categories", ...Array.from(new Set(items.map((item) => item.category)))];
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All categories");
  const [requestedPage, setPage] = useState(initialPage);
  const pageSize = 6;
  function syncFilters(nextCategory: string, nextQuery: string, nextPage: number) {
    const params = new URLSearchParams();
    if (nextCategory !== "All categories") params.set("category", nextCategory);
    if (nextQuery) params.set("q", nextQuery);
    if (nextPage > 1) params.set("page", String(nextPage));
    const suffix = params.size ? `?${params.toString()}` : "";
    router.replace(`${pathname}${suffix}`, { scroll: false });
  }
  const filtered = useMemo(() => items.filter((article) => (category === "All categories" || article.category === category) && `${article.title} ${article.category} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase())), [category, items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <div><div className="portfolio-controls"><div className="filter-list" aria-label="Filter articles">{categories.map((item) => <button key={item} type="button" className={`filter-chip${category === item ? " active" : ""}`} onClick={() => { setCategory(item); setPage(1); syncFilters(item, query, 1); }}>{item}</button>)}</div><label className="search-field blog-search"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); syncFilters(category, event.target.value, 1); }} placeholder="Search insights" aria-label="Search articles" /></label></div><div className="simple-grid blog-grid">{visible.map((article, index) => <article className="article-card" key={article.slug}><span className={`article-art article-art-${index % 2}`}><span>FIELD NOTES <b>{String(index + 1).padStart(2, "0")}</b></span><i>{index ? "Think it through." : "Start with people."}</i></span><div className="article-meta">{article.category}<span />{article.date} <span />{article.authorName}</div><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="underlined-link" href={`/blog/${article.slug}`}>Read the article <ArrowUpRight size={14} /></Link></article>)}</div>{filtered.length === 0 && <p className="empty-note">No articles match that search.</p>}{pageCount > 1 && <div className="pagination"><button type="button" onClick={() => { const next = Math.max(1, page - 1); setPage(next); syncFilters(category, query, next); }} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => { const next = Math.min(pageCount, page + 1); setPage(next); syncFilters(category, query, next); }} disabled={page === pageCount}>Next</button></div>}</div>;
}
