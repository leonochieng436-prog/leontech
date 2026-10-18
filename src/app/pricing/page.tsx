import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { getPublicPricingCategories } from "@/lib/pricing";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "Website & Software Pricing in Kenya",
  description: "Compare available website, e-commerce, software, and maintenance packages in KES. Review inclusions and exclusions; custom work is quoted to scope.",
  path: "/pricing",
});

export default async function PricingPage() {
  const categories = await getPublicPricingCategories();

  return <main className="page-shell">
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow"><span className="eyebrow-dot" /> PRICING AND PACKAGES</p>
        <h1>Clear starting points.<br /><span style={{ color: "var(--lime)" }}>A scope that fits.</span></h1>
        <p>Explore the available packages and what each includes. Starting prices are not a final quote; we confirm requirements, deliverables, exclusions, and payment terms with you before work begins.</p>
      </div>
    </section>
    <section className="content-section pricing-page-content">
      <div className="container">
        <p className="pricing-page-note">Project packages are one-time unless labelled otherwise. Recurring support and other monthly arrangements are identified on their package; third-party subscriptions and provider fees are separate unless agreed in writing.</p>
        {categories.map((category) => <section className="pricing-category-section" id={category.slug} key={category.slug}>
          <div className="pricing-category-heading">
            <div><p className="eyebrow dark-eyebrow">PACKAGE CATEGORY</p><h2>{category.name}</h2></div>
            <p>{category.description}</p>
          </div>
          {category.plans.length ? <div className="detailed-pricing-grid">
            {category.plans.map((plan) => <article className={`detailed-pricing-card${plan.isPopular ? " detailed-pricing-card-popular" : ""}`} key={plan.slug}>
              <div className="detailed-pricing-top">
                {plan.isPopular && <span className="pricing-badge">Popular choice</span>}
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="detailed-price-wrap">
                <strong>{plan.priceLabel}</strong>
                {plan.billingInterval === "ONE_TIME" && <span>one-time project fee</span>}
                {!plan.billingInterval && <span>confirmed after scope review</span>}
              </div>
              {plan.scope && <p className="detailed-pricing-scope"><strong>Good fit:</strong> {plan.scope}</p>}
              <div>
                <h4>Included</h4>
                <ul className="detailed-pricing-list">{plan.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
              </div>
              {plan.exclusions.length > 0 && <div className="detailed-pricing-exclusions">
                <h4><Minus size={14} /> Not included unless agreed</h4>
                <ul>{plan.exclusions.map((exclusion) => <li key={exclusion}>{exclusion}</li>)}</ul>
              </div>}
              <Link className={`button ${plan.isPopular ? "button-lime" : "button-secondary"}`} href={`/contact?plan=${encodeURIComponent(plan.slug)}`}>
                {plan.ctaLabel} <ArrowUpRight size={16} />
              </Link>
            </article>)}
          </div> : <p className="empty-note">Packages in this category are being prepared. Contact us to discuss your requirements.</p>}
        </section>)}
        <div className="pricing-custom-cta">
          <div><h2>Need a different combination?</h2><p>Tell us about your requirements and we can discuss a tailored scope, a phased delivery plan, or add-on services.</p></div>
          <Link className="button button-lime" href="/contact">Request a quotation <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  </main>;
}
