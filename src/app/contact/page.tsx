import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getPublicServices } from "@/lib/public-data";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = { title: "Start a project", description: "Tell Leon.Tech what you are hoping to build or improve. Share a few details and we will be in touch." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const services = await getPublicServices();
  const { email, phone, whatsappNumber } = getSiteContact();
  const selectedService = services.find((item) => item.slug === service)?.title;
  const whatsappMessage = selectedService
    ? `Hello Leon.Tech, I am interested in ${selectedService}. I would like to discuss my project requirements and obtain a quotation.`
    : "Hello Leon.Tech, I am interested in your software development services. I would like to discuss my project requirements and obtain a quotation.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> LET’S TALK</p><h1>Every good project<br /><span style={{ color: "var(--lime)" }}>starts somewhere.</span></h1><p>Tell us a little about what you have in mind. We’ll get back to you with a thoughtful next step—no pressure, just a good conversation.</p></div></section>
    <section className="content-section"><div className="container contact-grid"><aside className="contact-side"><h2>Tell us what’s next.</h2><p>Share what you are hoping to build, the problem you are trying to solve, or where you would like a second opinion. We’ll take it from there.</p><div className="contact-details"><p><MapPin size={15} /> Nairobi, Kenya · Working everywhere</p><a href={`mailto:${email}`}><Mail size={15} />{email}</a><a href={`tel:${phone}`}><Phone size={15} />{phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} />Start a WhatsApp conversation <ArrowUpRight size={13} /></a></div><p className="form-small-note">We only use the information you provide to respond to your inquiry. We will never sell your personal information.</p></aside><ContactForm initialService={service ?? ""} services={services} /></div></section></main>;
}
