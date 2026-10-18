import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, HeartPulse, Hotel, Rocket, Sparkles, Store, Truck } from "lucide-react";
import { solutions } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Business Software Solutions in Kenya",
  description: "Explore practical web, software, and business system solutions for retail, hospitality, schools, professional services, healthcare administration, and logistics teams.",
  path: "/solutions",
});
const icons = [Store, Sparkles, Hotel, GraduationCap, BriefcaseBusiness, HeartPulse, Truck, Rocket];

export default function SolutionsPage() {
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> SOLUTIONS BY INDUSTRY</p><h1>Technology that gets<br /><span style={{ color: "var(--lime)" }}>how your business works.</span></h1><p>Different businesses have different challenges. We listen, learn your context, and shape digital solutions around what matters most.</p></div></section><section className="content-section"><div className="container simple-grid">{solutions.map((item, index) => { const Icon = icons[index]; return <Link key={item.slug} href={`/solutions/${item.slug}`} className="simple-card"><span className="service-icon"><Icon size={18} /></span><h2>{item.title}</h2><p>{item.summary}</p><span className="underlined-link" style={{ marginTop: 18 }}>Explore solution <ArrowUpRight size={14} /></span></Link>; })}</div></section></main>;
}
