import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock3, Code2, Layers3, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getPublicService, getPublicServices } from "@/lib/public-data";
import { getServiceMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return {};
  return getServiceMetadata(service);
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) notFound();
  const siteUrl = getSiteUrl();
  const serviceUrl = new URL(`/services/${service.slug}`, siteUrl).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: serviceUrl,
    provider: { "@id": `${siteUrl}#organization` },
    areaServed: { "@type": "Country", name: "Kenya" },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: "Services", item: new URL("/services", siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: service.title, item: serviceUrl },
    ],
  };

  return <main className="page-shell">
    <JsonLd data={structuredData} />
    <JsonLd data={breadcrumbs} />
    <section className="page-hero service-detail-hero">
      {service.coverImage && <div className="service-cover-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(23,30,27,.92), rgba(23,30,27,.5)), url("${service.coverImage.replaceAll("\"", "%22")}")` }} role="img" aria-label={`${service.title} cover`} />}
      <div className="container service-detail-hero-content">
        <Link href="/services" className="text-link" style={{ color: "rgba(255,255,255,.72)" }}><ArrowLeft size={15} /> All services</Link>
        <p className="eyebrow" style={{ marginTop: 38 }}><span className="eyebrow-dot" /> {service.category.toUpperCase()}</p>
        <h1>{service.title}</h1>
        <p>{service.summary}</p>
        <div className="service-detail-price"><strong>{service.priceLabel}</strong>{service.deliveryEstimate && <span><Clock3 size={14} /> Estimated delivery: {service.deliveryEstimate}</span>}</div>
        <Link className="button button-lime" href={`/contact?service=${encodeURIComponent(service.slug)}`}>Request a Quote <ArrowRight size={15} /></Link>
      </div>
    </section>

    <section className="content-section service-detail-content">
      <div className="container">
        <div className="service-overview-grid">
          <div className="service-overview"><p className="eyebrow dark-eyebrow">SERVICE OVERVIEW</p><h2>Built around the work that matters.</h2><p>{service.description}</p></div>
          <aside className="service-benefit-panel"><span className="service-icon"><Code2 size={19} /></span><h2>What this helps you do</h2>{service.benefits.length ? <ul>{service.benefits.map((benefit) => <li key={benefit}><Check size={15} />{benefit}</li>)}</ul> : <p>We shape the outcomes with you during discovery.</p>}</aside>
        </div>

        {service.businessProblems.length > 0 && <section className="service-content-block"><div className="service-section-heading"><span className="service-icon"><ShieldCheck size={18} /></span><div><p className="eyebrow dark-eyebrow">THE CHALLENGE</p><h2>Problems we help solve</h2></div></div><ul className="service-point-grid">{service.businessProblems.map((problem) => <li key={problem}>{problem}</li>)}</ul></section>}

        <section className="service-content-block service-deliverables-grid">
          <div><div className="service-section-heading"><span className="service-icon"><Layers3 size={18} /></span><div><p className="eyebrow dark-eyebrow">WHAT YOU GET</p><h2>Features and deliverables</h2></div></div>
            <ul className="service-feature-list">{[...new Set([...service.features, ...service.deliverables])].map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
          </div>
          <div className="service-side-lists">
            {service.technologies.length > 0 && <div><h3>Technology options</h3><div className="service-tag-list">{service.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>}
            {service.useCases.length > 0 && <div><h3>Common use cases</h3><ul>{service.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul></div>}
          </div>
        </section>

        {service.relatedProjects.length > 0 && <section className="service-content-block"><div className="service-section-heading"><span className="service-icon"><Code2 size={18} /></span><div><p className="eyebrow dark-eyebrow">RELATED WORK</p><h2>Relevant projects</h2></div></div><div className="simple-grid service-related-projects">{service.relatedProjects.map((project) => <article className="simple-card" key={project.slug}><p className="service-card-category">{project.category}</p><h3>{project.title}</h3><p>{project.summary}</p><Link href={`/portfolio/${project.slug}`} className="underlined-link">View project <ArrowUpRight size={14} /></Link></article>)}</div></section>}

        {service.faqs.length > 0 && <section className="service-content-block"><div className="service-section-heading"><div><p className="eyebrow dark-eyebrow">FAQ</p><h2>Questions about {service.title.toLowerCase()}</h2></div></div><div className="faq-list">{service.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>}
      </div>
    </section>

    <section className="service-detail-cta"><div className="container"><p className="eyebrow"><span className="eyebrow-dot" /> A CLEAR NEXT STEP</p><h2>Let’s talk about your<br /><span>{service.title.toLowerCase()} project.</span></h2><p>Share the context and the outcomes you have in mind. We’ll help define a sensible scope and provide a clear quotation.</p><Link className="button button-lime" href={`/contact?service=${encodeURIComponent(service.slug)}`}>Request a Quote <ArrowUpRight size={15} /></Link><p><Link className="text-link" href="/pricing">Explore available packages <ArrowRight size={14} /></Link></p></div></section>
  </main>;
}
