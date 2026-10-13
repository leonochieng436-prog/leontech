import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Frequently asked questions", description: "Answers to common questions about working with Leon.Tech." };
const questions = [
  ["What kinds of projects do you take on?", "We work on websites, e-commerce experiences, custom web applications, business systems, integrations, and ongoing technical improvements. The right fit starts with a conversation about your needs."],
  ["How much does a project cost?", "Every project is different. Once we understand scope, requirements, and timing, we can discuss a clear estimate. We do not publish placeholder prices as quotations."],
  ["How long does a project take?", "Timing depends on complexity, decisions, and the people involved. We agree on a realistic plan after discovery and keep you updated as work progresses."],
  ["Can you work with our existing software?", "Often, yes. We can review your current tools and explore sensible improvements, integrations, or a phased transition where appropriate."],
  ["Do you provide ongoing support?", "We can discuss maintenance and technical support as part of your project or as a separate arrangement, depending on your needs."],
  ["Where is Leon.Tech based?", "Leon.Tech is based in Nairobi, Kenya, and works with teams in Kenya, across Africa, and internationally."],
];
export default function FAQPage() { return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> A FEW ANSWERS</p><h1>Good questions.<br /><span style={{ color: "var(--lime)" }}>Straight answers.</span></h1><p>Here are a few things people often ask before we get started. Have something else in mind? Just ask.</p></div></section><section className="content-section"><div className="container faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}<p className="faq-cta">Still wondering about something? <Link href="/contact">Let’s talk <ArrowUpRight size={14} /></Link></p></div></section></main>; }
