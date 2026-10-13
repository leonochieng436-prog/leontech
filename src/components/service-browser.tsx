"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Boxes, Code2, Database, Search, ShieldCheck, ShoppingBag, Workflow, Smartphone, Palette, CloudCog, Wrench, Megaphone, Layers3 } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/content";

type ServiceCard = { slug: string; title: string; category: string; summary: string; description: string; icon: string; priceLabel: string; deliveryEstimate: string | null };
const icons = { Code2, ShoppingBag, Boxes, Database, Workflow, ShieldCheck, Smartphone, Palette, CloudCog, Wrench, Megaphone, Layers3 };

export function ServiceBrowser({ items }: { items: ServiceCard[] }) {
  const categories = ["All services", ...SERVICE_CATEGORIES.filter((category) => items.some((item) => item.category === category))];
  const [category, setCategory] = useState("All services");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => items.filter((item) => (category === "All services" || item.category === category) && `${item.title} ${item.summary} ${item.description} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())), [category, items, query]);
  return <><div className="portfolio-controls"><div className="filter-list" aria-label="Filter services">{categories.map((item) => <button key={item} type="button" className={`filter-chip${category === item ? " active" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><Search size={15} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services" aria-label="Search services" /></label></div>{visible.length ? <div className="simple-grid">{visible.map((service) => { const Icon = icons[service.icon as keyof typeof icons] ?? Code2; return <article className="simple-card service-card-public" key={service.slug}><span className="service-icon"><Icon size={18} /></span><p className="service-card-category">{service.category}</p><h2>{service.title}</h2><p>{service.summary}</p><div className="service-card-price"><strong>{service.priceLabel}</strong>{service.deliveryEstimate && <span>Typical delivery: {service.deliveryEstimate}</span>}</div><Link className="underlined-link" href={`/services/${service.slug}`}>Explore service <ArrowUpRight size={14} /></Link></article>; })}</div> : <p className="empty-note" role="status">No services match that search. Try another category or phrase.</p>}</>;
}
