import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getPublicServices } from "@/lib/public-data";
import { getPublicPricingPlans } from "@/lib/pricing";
import { getSiteContact } from "@/lib/site-contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Leon.Tech in Kenya",
  description: "Tell Leon.Tech about your website, e-commerce, custom software, or business system project. Contact our Nairobi-based team for a clear next step.",
  path: "/contact",
});

const serviceByPricingCategory: Record<string, string> = {
  "website-development": "web-design-development",
  ecommerce: "ecommerce",
  "custom-software": "custom-software",
  "support-and-maintenance": "maintenance-support",
};
const serviceByPricingPlan: Record<string, string> = {
  "saas-platform": "saas-platforms",
  "business-system": "business-systems",
  "enterprise-software": "enterprise-software",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; plan?: string }> }) {
  const [{ service, plan: planSlug }, services, plans] = await Promise.all([searchParams, getPublicServices(), getPublicPricingPlans()]);
  const { email, phone, whatsappNumber } = getSiteContact();
  const selectedPlan = plans.find((item) => item.slug === planSlug);
  const selectedServiceSlug = service || (selectedPlan
    ? serviceByPricingPlan[selectedPlan.slug] ?? serviceByPricingCategory[selectedPlan.category.slug]
    : undefined);
  const selectedService = services.find((item) => item.slug === selectedServiceSlug);
  const initialDescription = selectedPlan
    ? `I am interested in the ${selectedPlan.name} package (${selectedPlan.priceLabel}). Please help me confirm the scope and next steps.`
    : "";
  const whatsappMessage = selectedPlan
    ? `Hello Leon.Tech, I am interested in the ${selectedPlan.name} package (${selectedPlan.priceLabel}). I would like to discuss the scope and next steps.`
    : selectedService
      ? `Hello Leon.Tech, I am interested in ${selectedService.title}. I would like to discuss my project requirements and obtain a quotation.`
    : "Hello Leon.Tech, I am interested in your software development services. I would like to discuss my project requirements and obtain a quotation.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> LET’S TALK</p><h1>Every good project<br /><span style={{ color: "var(--lime)" }}>starts somewhere.</span></h1><p>Tell us a little about what you have in mind. We’ll get back to you with a thoughtful next step—no pressure, just a good conversation.</p></div></section>
    <section className="content-section"><div className="container contact-grid"><aside className="contact-side"><h2>Tell us what’s next.</h2><p>Share what you are hoping to build, the problem you are trying to solve, or where you would like a second opinion. We’ll take it from there.</p>{selectedPlan && <p className="selected-plan-note">Enquiring about: <strong>{selectedPlan.name}</strong> · {selectedPlan.priceLabel}</p>}<div className="contact-details"><p><MapPin size={15} /> Nairobi, Kenya · Working everywhere</p><a href={`mailto:${email}`}><Mail size={15} />{email}</a><a href={`tel:${phone}`}><Phone size={15} />{phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} />Start a WhatsApp conversation <ArrowUpRight size={13} /></a></div><p className="form-small-note">We only use the information you provide to respond to this inquiry. We will never sell your personal information.</p></aside><ContactForm initialService={selectedService?.slug ?? ""} initialDescription={initialDescription} services={services} /></div></section></main>;
}
