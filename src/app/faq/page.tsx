import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { faqs } from "@/lib/faqs";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Web & Software Development FAQs",
  description: "Answers about project scope, timelines, website and software pricing, integrations, handover, and ongoing support from Leon.Tech.",
  path: "/faq",
});
export default function FAQPage() { return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> A FEW ANSWERS</p><h1>Good questions.<br /><span style={{ color: "var(--lime)" }}>Straight answers.</span></h1><p>Here are a few things people often ask before we get started. Have something else in mind? Just ask.</p></div></section><section className="content-section"><div className="container faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}<p className="faq-cta">Still wondering about something? <Link href="/contact">Let’s talk <ArrowUpRight size={14} /></Link></p></div></section></main>; }
