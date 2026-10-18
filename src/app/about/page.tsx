import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About the Studio",
  description: "Meet Leon.Tech, an independent digital studio based in Nairobi, Kenya, building practical websites, software, and business technology with teams.",
  path: "/about",
});

const values = [
  { icon: Compass, title: "Start with purpose", text: "We ask better questions before we reach for technology. Clear goals help us build something that matters." },
  { icon: HeartHandshake, title: "Work in partnership", text: "Good products come from open conversations, useful feedback, and shared understanding." },
  { icon: ShieldCheck, title: "Care about the craft", text: "Accessibility, security, performance, and maintainability belong in the work from day one." },
  { icon: Lightbulb, title: "Keep it useful", text: "The simplest solution that solves the real problem is often the most valuable one." },
];

export default function AboutPage() {
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> ABOUT LEON.TECH</p><h1>Good technology is<br /><span style={{ color: "var(--lime)" }}>a human thing.</span></h1><p>Leon.Tech is an independent digital studio in Nairobi, Kenya. We work with teams to make useful software, considered digital experiences, and better ways of doing business.</p></div></section><section className="content-section"><div className="container"><div className="industry-content about-intro"><div><p className="eyebrow dark-eyebrow">OUR POINT OF VIEW</p><h2>Technology should make good work easier.</h2></div><div className="industry-right"><p>We believe the best digital products come from understanding the people and processes behind them. That means starting with listening, making decisions together, and building only what helps move the work forward.</p><p>Our work is grounded in practical engineering and a respect for the businesses and people who rely on what we make. We bring clear communication, thoughtful design, and a commitment to doing the details well.</p><p>We&apos;re based in Nairobi and open to working with ambitious teams across Africa and internationally.</p></div></div><div className="value-grid">{values.map(({ icon: Icon, title, text }) => <article className="simple-card" key={title}><span className="service-icon"><Icon size={18} /></span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="about-bottom"><p className="eyebrow dark-eyebrow">OUR APPROACH</p><h2>Discovery. Design. Development.<br />Careful handover. Ongoing support.</h2><p>Every engagement is shaped around the problem, the people involved, and the time and resources available. We favour transparent decisions, regular check-ins, and maintainable solutions.</p><Link className="underlined-link" href="/contact">Get to know us <ArrowRight size={15} /></Link></div></div></section></main>;
}
