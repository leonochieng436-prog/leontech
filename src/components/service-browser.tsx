"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Boxes, Code2, Database, Search, ShieldCheck, ShoppingBag, Workflow } from "lucide-react";

type ServiceCard = { slug: string; title: string; category: string; summary: string };
const icons = [Code2, ShoppingBag, Boxes, Database, Workflow, ShieldCheck];

export function ServiceBrowser({ items }: { items: ServiceCard[] }) {
  const categories = ["All services", ...Array.from(new Set(items.map((item) => item.category)))];
  const [category, setCategory] = useState("All services");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => items.filter((item) => (category === "All services" || item.category === category) && `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [category, items, query]);
  return <><div className="portfolio-controls"><div className="filter-list" aria-label="Filter services">{categories.map((item) => <button key={item} type="button" className={`filter-chip${category === item ? " active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services" aria-label="Search services" /></label></div>{visible.length ? <div className="simple-grid">{visible.map((service, index) => { const Icon = icons[index % icons.length]; return <Link className="simple-card" href={`/services/${service.slug}`} key={service.slug}><span className="service-icon"><Icon size={18} /></span><h2>{service.title}</h2><p>{service.summary}</p><span className="underlined-link" style={{ marginTop: 18 }}>Explore service <ArrowUpRight size={14} /></span></Link>; })}</div> : <p className="empty-note">No services match that search. Try another category or phrase.</p>}</>;
}
