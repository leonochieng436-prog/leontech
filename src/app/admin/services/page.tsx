import type { Metadata } from "next";
import { ContentStatus, Prisma } from "@prisma/client";
import { AdminSubmitButton } from "@/components/admin-submit-button";
import { SERVICE_CATEGORIES } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { createService, moveService, toggleService, updateService } from "./actions";

export const metadata: Metadata = { title: "Manage services", robots: { index: false, follow: false } };

type ManagedService = Prisma.ServiceGetPayload<{
  include: { relatedProjects: { include: { project: true } }; pricingPlan: true };
}>;

type PricingOption = { id: string; name: string; amount: Prisma.Decimal | null; currency: string };
type ProjectOption = { id: string; title: string };

function adminServicePrice(service: ManagedService) {
  const priceType = service.pricingPlan?.priceType ?? service.priceType;
  const amount = service.pricingPlan ? service.pricingPlan.amount : service.amount;
  const currency = service.pricingPlan?.currency ?? service.currency;
  const billingInterval = service.pricingPlan ? service.pricingPlan.billingInterval : service.billingInterval;
  if (!amount || priceType === "CUSTOM_QUOTE" || priceType === "CONTACT_FOR_PRICING") return "Request a Quote";
  const value = `${priceType === "STARTING_FROM" ? "From " : ""}${currency} ${amount.toString()}`;
  return billingInterval && billingInterval !== "ONE_TIME"
    ? `${value} / ${billingInterval.toLowerCase()}`
    : value;
}

function ServiceFields({ service, pricingPlans, projects }: { service?: ManagedService; pricingPlans: PricingOption[]; projects: ProjectOption[] }) {
  const text = (key: keyof ManagedService) => {
    const value = service?.[key];
    return typeof value === "string" ? value : "";
  };
  const lines = (key: "businessProblems" | "features" | "deliverables" | "technologies" | "benefits" | "useCases") => service?.[key].join("\n") ?? "";
  const faqs = Array.isArray(service?.faqs)
    ? service.faqs.flatMap((faq) => faq && typeof faq === "object" && "question" in faq && "answer" in faq ? [`${String(faq.question)} | ${String(faq.answer)}`] : []).join("\n")
    : "";

  return <>
    <div className="admin-service-form-grid">
      <label className="field"><span>Service name</span><input name="title" required minLength={3} maxLength={100} defaultValue={text("title")} /></label>
      <label className="field"><span>Unique URL slug</span><input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} defaultValue={text("slug")} placeholder="mobile-app-development" /></label>
      <label className="field"><span>Category</span><select name="category" required defaultValue={service?.category ?? SERVICE_CATEGORIES[0]}>{SERVICE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label className="field"><span>Icon name (Lucide)</span><input name="icon" required maxLength={40} defaultValue={service?.icon ?? "Code2"} /></label>
      <label className="field full"><span>Short description</span><textarea name="shortDescription" required minLength={10} maxLength={250} defaultValue={text("shortDescription")} /></label>
      <label className="field full"><span>Detailed description</span><textarea name="description" required minLength={20} maxLength={5000} defaultValue={text("description")} /></label>
      <label className="field"><span>Business problems solved (one per line)</span><textarea name="businessProblems" maxLength={5000} defaultValue={lines("businessProblems")} /></label>
      <label className="field"><span>Features (one per line)</span><textarea name="features" maxLength={5000} defaultValue={lines("features")} /></label>
      <label className="field"><span>Deliverables (one per line)</span><textarea name="deliverables" maxLength={5000} defaultValue={lines("deliverables")} /></label>
      <label className="field"><span>Technologies (one per line)</span><textarea name="technologies" maxLength={3000} defaultValue={lines("technologies")} /></label>
      <label className="field"><span>Benefits (one per line)</span><textarea name="benefits" maxLength={3000} defaultValue={lines("benefits")} /></label>
      <label className="field"><span>Use cases (one per line)</span><textarea name="useCases" maxLength={3000} defaultValue={lines("useCases")} /></label>
      <label className="field full"><span>FAQs (question | answer, one per line)</span><textarea name="faqs" maxLength={6000} defaultValue={faqs} /></label>
      <label className="field"><span>Cover image URL (optional)</span><input name="coverImage" type="url" defaultValue={text("coverImage")} /></label>
      <label className="field"><span>Delivery estimate (optional)</span><input name="deliveryEstimate" maxLength={120} defaultValue={text("deliveryEstimate")} placeholder="Agreed after discovery" /></label>
      <label className="field"><span>Price type</span><select name="priceType" defaultValue={service?.priceType ?? "CUSTOM_QUOTE"}><option value="CUSTOM_QUOTE">Custom quote</option><option value="CONTACT_FOR_PRICING">Request pricing</option><option value="STARTING_FROM">Starting from</option><option value="FIXED">Fixed price</option></select></label>
      <label className="field"><span>Amount (leave blank for a quote)</span><input name="amount" inputMode="decimal" pattern="(?:[0-9]{1,10}(?:\\.[0-9]{1,2})?)?" defaultValue={service?.amount?.toString() ?? ""} /></label>
      <label className="field"><span>Currency</span><select name="currency" defaultValue={service?.currency ?? "KES"}><option>KES</option><option>USD</option><option>EUR</option></select></label>
      <label className="field"><span>Billing interval</span><select name="billingInterval" defaultValue={service?.billingInterval ?? ""}><option value="">Not applicable</option><option value="ONE_TIME">One time</option><option value="HOURLY">Hourly</option><option value="DAILY">Daily</option><option value="MONTHLY">Monthly</option><option value="ANNUALLY">Annually</option></select></label>
      <label className="field full"><span>Use pricing plan as authoritative price (optional)</span><select name="pricingPlanId" defaultValue={service?.pricingPlanId ?? ""}><option value="">Use the service price fields</option>{pricingPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} — {plan.amount ? `${plan.currency} ${plan.amount.toString()}` : "Request a Quote"}</option>)}</select></label>
      <label className="field"><span>Publication status</span><select name="status" defaultValue={service?.status ?? ContentStatus.DRAFT}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="field"><span>SEO title</span><input name="seoTitle" maxLength={160} defaultValue={text("seoTitle")} /></label>
      <label className="field full"><span>SEO description</span><textarea name="seoDescription" maxLength={320} defaultValue={text("seoDescription")} /></label>
      <label className="field full"><span>Canonical URL (optional)</span><input name="seoCanonicalUrl" type="url" defaultValue={text("seoCanonicalUrl")} /></label>
      <fieldset className="field full service-project-select"><legend>Related portfolio projects</legend>{projects.length ? projects.map((project) => <label key={project.id}><input type="checkbox" name="relatedProjectIds" value={project.id} defaultChecked={service?.relatedProjects.some((relation) => relation.projectId === project.id)} />{project.title}</label>) : <p>No portfolio projects are available yet.</p>}</fieldset>
    </div>
  </>;
}

export default async function ManageServicesPage() {
  const user = await requireRole("services:write");
  const [items, pricingPlans, portfolioProjects] = await Promise.all([
    prisma.service.findMany({ include: { relatedProjects: { include: { project: true } }, pricingPlan: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.pricingPlan.findMany({ where: { isActive: true }, select: { id: true, name: true, amount: true, currency: true }, orderBy: { name: "asc" } }),
    prisma.portfolioProject.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  return <main className="admin-shell"><div className="admin-container">
    <div className="admin-heading"><div><p className="eyebrow dark-eyebrow">CONTENT MANAGEMENT · {user.role.replace("_", " ")}</p><h1>Services</h1><p>Manage service content, pricing, publication, and related work.</p></div></div>
    <section className="admin-service-layout">
      <div className="admin-box">
        <h2>Service catalogue</h2><p>Draft, publish, reorder, or archive each service. Archived services remain stored but are hidden from the public catalogue.</p>
        {items.length === 0 ? <p className="empty-note">No services yet. Create the first service using the form.</p> : <div className="admin-service-list">{items.map((item, index) => <article className="admin-service-row service-admin-record" key={item.id}>
          <div className="service-admin-summary"><strong>{item.title}</strong><small>/{item.slug} · {item.category} · {item.status.replaceAll("_", " ")}</small><p>{item.shortDescription}</p><b>{adminServicePrice(item)}</b></div>
          <div className="service-row-actions">
            <form action={moveService}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="up" /><AdminSubmitButton label="↑" pendingLabel="…" disabled={index === 0} ariaLabel={`Move ${item.title} up`} /></form>
            <form action={moveService}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="direction" value="down" /><AdminSubmitButton label="↓" pendingLabel="…" disabled={index === items.length - 1} ariaLabel={`Move ${item.title} down`} /></form>
            <form action={toggleService}><input type="hidden" name="id" value={item.id} /><select name="status" defaultValue={item.status} aria-label={`Set ${item.title} publication status`}>{Object.values(ContentStatus).map((status) => <option key={status} value={status}>{status}</option>)}</select><AdminSubmitButton label="Save status" /></form>
            <a href={`/services/${item.slug}`} target="_blank" rel="noreferrer">Preview</a>
          </div>
          <details className="service-edit-details"><summary>Edit service details</summary><form className="admin-create-form service-editor-form" action={updateService}><input type="hidden" name="id" value={item.id} /><ServiceFields service={item} pricingPlans={pricingPlans} projects={portfolioProjects} /><AdminSubmitButton label="Save service" className="button button-lime" /></form></details>
        </article>)}</div>}
      </div>
      <div className="admin-box"><h2>Add a service</h2><p>Set the service price or choose custom quotation; no price is inferred by the public page.</p><form className="admin-create-form service-editor-form" action={createService}><ServiceFields pricingPlans={pricingPlans} projects={portfolioProjects} /><AdminSubmitButton label="Create service" className="button button-lime" /></form></div>
    </section>
  </div></main>;
}
