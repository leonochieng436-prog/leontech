import type { Metadata } from "next";
import { getPublicServices } from "@/lib/public-data";
import { ServiceBrowser } from "@/components/service-browser";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services", description: "Web design, custom software, business systems, integrations, and ongoing technical support from Leon.Tech." };

export default async function ServicesPage() {
  const services = await getPublicServices();
  return <main className="page-shell">
    <section className="page-hero"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> OUR SERVICES</p><h1>Thoughtful technology.<br /><span style={{ color: "var(--lime)" }}>Built around your business.</span></h1><p>From a first website to the systems your whole team depends on, we bring ideas to life with care, clarity, and solid engineering.</p></div></section>
    <section className="content-section"><div className="container">{services.length ? <ServiceBrowser items={services} /> : <p className="empty-note">Services are being prepared. Please check back shortly.</p>}</div></section>
  </main>;
}
