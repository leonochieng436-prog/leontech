import type { Metadata } from "next";
import { getPublicServices } from "@/lib/public-data";
import { ServiceBrowser } from "@/components/service-browser";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "Web & Software Development Services in Kenya",
  description: "Explore website development, e-commerce, custom software, POS and inventory systems, mobile apps, integrations, and technical support in Kenya.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublicServices();
  return <main className="page-shell">
    <section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> OUR SERVICES</p><h1>Thoughtful technology.<br /><span style={{ color: "var(--lime)" }}>Built around your business.</span></h1><p>From a first website to the systems your whole team depends on, we bring ideas to life with care, clarity, and solid engineering.</p></div></section>
    <section className="content-section"><div className="container">{services.length ? <ServiceBrowser items={services} /> : <p className="empty-note">Services are being prepared. Please check back shortly.</p>}</div></section>
  </main>;
}
