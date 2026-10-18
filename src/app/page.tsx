import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BarChart3,
  BriefcaseBusiness,
  Boxes,
  Check,
  Code2,
  Cpu,
  Database,
  Fingerprint,
  GraduationCap,
  HeartPulse,
  Hotel,
  Layers3,
  LifeBuoy,
  Link2,
  MonitorSmartphone,
  MoveUpRight,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Workflow,
} from "lucide-react";
import { getPublicProjects, getPublicServices } from "@/lib/public-data";
import { getPublicPricingPlans } from "@/lib/pricing";
import { solutions } from "@/lib/content";
import { homeFaqs } from "@/lib/faqs";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "Web & Software Development Company in Kenya",
  description: "Looking for web or software development in Kenya? Leon.Tech builds business websites, e-commerce platforms, and custom business systems around your needs.",
  path: "/",
});
const serviceIcons = [Code2, Boxes, Workflow, ShieldCheck];
const industryIcons = [Store, Sparkles, Hotel, GraduationCap, BriefcaseBusiness, HeartPulse, Truck, Rocket];

const developmentSteps = [
  ["01", "Discovery and Planning", "Understand your objectives, requirements, budget, constraints, and the people who will use the solution."],
  ["02", "UI/UX Design", "Map user journeys, layouts, and prototypes before agreeing on the interface and build scope."],
  ["03", "Development", "Build the agreed solution in practical increments, with regular reviews and clear communication."],
  ["04", "Testing and Quality Assurance", "Check functionality, responsiveness, accessibility, security, and reliability against the agreed requirements."],
  ["05", "Deployment and Launch", "Prepare the production environment, configure the release, and support a careful launch."],
  ["06", "Maintenance and Support", "Arrange updates, troubleshooting, improvements, and ongoing assistance to fit the project agreement."],
];
const addOnServices = [
  { title: "Search visibility and analytics", description: "Add on-page SEO review, analytics setup, and measurement to a website project.", service: "digital-marketing", icon: SearchCheck },
  { title: "Cloud deployment", description: "Plan production hosting, deployment workflows, and environment configuration for your product.", service: "cloud-devops", icon: MonitorSmartphone },
  { title: "UI/UX design", description: "Shape user journeys, prototypes, and interface patterns before or alongside development.", service: "ui-ux-design", icon: Sparkles },
  { title: "Payment and M-Pesa integration", description: "Connect agreed payment providers, including M-Pesa where account approval and provider requirements allow.", service: "api-integrations", icon: Link2 },
  { title: "Maintenance and support", description: "Keep an existing website or application updated, reviewed, and supported after launch.", service: "maintenance-support", icon: LifeBuoy },
];

export default async function Home() {
  const [services, projects, plans] = await Promise.all([getPublicServices(), getPublicProjects(), getPublicPricingPlans()]);
  const featuredPlans = plans.filter((plan) => plan.isActive).slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> INDEPENDENT DIGITAL STUDIO · NAIROBI, KENYA</p>
            <h1>Websites and software that <span>move business forward.</span></h1>
            <p className="hero-lede">We design and build business websites, e-commerce platforms, custom software, and management systems for teams in Nairobi and across Kenya.</p>
            <div className="hero-actions">
              <Link className="button button-lime" href="/contact">Start a project <ArrowUpRight size={17} /></Link>
              <Link className="text-link" href="/portfolio">Explore our work <ArrowRight size={16} /></Link>
            </div>
            <div className="hero-proof"><div className="proof-rule" /><p>Thoughtfully engineered.<br /><strong>Made for what’s next.</strong></p></div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustration of a connected digital product dashboard">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="float-tag tag-top"><span className="tag-icon tag-icon-green"><AudioLines size={17} /></span><span><b>Built around you</b><small>Not off the shelf</small></span></div>
            <div className="dashboard">
              <div className="dash-top"><span className="dash-brand"><span className="tiny-mark">L.</span> studio<span className="dash-chevron">⌄</span></span><span className="dash-dots">PRODUCT CONCEPT</span></div>
              <div className="dash-heading"><small>AN ILLUSTRATIVE PRODUCT INTERFACE</small><b>A clearer day, together <span>✳</span></b></div>
              <div className="dash-metrics"><div><small>PROJECT FLOW</small><b>In motion</b></div><div><small>TEAM VIEW</small><b>In focus</b></div></div>
              <div className="chart-area"><div className="chart-head"><span>Illustrative activity view</span><small>Concept UI</small></div><div className="chart-grid"><span /><span /><span /><span /></div><svg className="chart" viewBox="0 0 420 115" fill="none" role="img" aria-label="Illustrative activity visualization, not business results"><defs><linearGradient id="chartFill" x1="210" y1="0" x2="210" y2="115" gradientUnits="userSpaceOnUse"><stop stopColor="#C4F266" stopOpacity=".35" /><stop offset="1" stopColor="#C4F266" stopOpacity="0" /></linearGradient></defs><path d="M0 93C28 88 25 61 58 69C94 77 96 43 131 51C165 59 161 77 194 61C226 46 235 21 267 34C300 47 306 57 338 34C370 10 390 29 420 8V115H0V93Z" fill="url(#chartFill)" /><path d="M0 93C28 88 25 61 58 69C94 77 96 43 131 51C165 59 161 77 194 61C226 46 235 21 267 34C300 47 306 57 338 34C370 10 390 29 420 8" stroke="#B4E954" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div>
              <div className="dash-bottom"><span className="mini-avatars"><i>A</i><i>K</i><i>M</i></span><span>Everything in sync</span><span className="sync-check"><Check size={12} /></span></div>
            </div>
            <div className="float-tag tag-bottom"><span className="tag-icon tag-icon-blue"><Fingerprint size={17} /></span><span><b>Made to scale</b><small>Ready when you are</small></span><MoveUpRight size={14} className="tag-arrow" /></div>
            <div className="art-caption"><span className="caption-line" /> A clearer view of your business</div>
          </div>
        </div>
        <div className="container hero-bottom"><span>Digital craft. Real-world impact.</span><span className="hero-scroll">SCROLL TO EXPLORE <ArrowDownRight size={14} /></span></div>
      </section>

      <section className="trust-strip"><div className="container trust-inner"><p>THE THINGS WE BRING TO THE TABLE</p><div><span><Layers3 size={16} /> Thoughtful design</span><span><Cpu size={16} /> Solid engineering</span><span><BarChart3 size={16} /> Business clarity</span><span><Database size={16} /> Built to last</span></div></div></section>

      <section className="section services-section" id="services">
        <div className="container"><div className="section-heading"><div><p className="eyebrow dark-eyebrow">WHAT WE DO</p><h2>Good technology.<br /><span>Thoughtfully applied.</span></h2></div><p className="section-intro">From smoother operations and connected systems to clearer customer journeys, we bring strategy, design, and engineering together to make digital tools work better.</p></div>
          <div className="service-grid">{services.slice(0, 4).map((service, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <Link className="service-card" href={`/services/${service.slug}`} key={service.slug}><div className="service-top"><span className="service-icon"><Icon size={19} strokeWidth={1.8} /></span><span className="service-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{service.title}</h3><p>{service.summary}</p><span className="card-arrow"><ArrowUpRight size={16} /></span></Link>; })}</div>
          <div className="section-foot"><span>From the first sketch to what comes next.</span><div className="section-foot-links"><Link className="underlined-link" href="/services">All services <ArrowRight size={15} /></Link><Link className="underlined-link" href="/pricing">View packages <ArrowRight size={15} /></Link></div></div>
        </div>
      </section>

      {projects.length > 0 && <section className="section home-work-section"><div className="container"><div className="section-heading"><div><p className="eyebrow dark-eyebrow">SELECTED WORK</p><h2>Ideas, made <span>tangible.</span></h2></div><Link className="underlined-link" href="/portfolio">Explore all work <ArrowRight size={15} /></Link></div><div className="home-project-grid">{projects.slice(0, 2).map((project) => <Link className={`home-project ${project.accent}`} href={`/portfolio/${project.slug}`} key={project.slug}><span className="home-project-index">{project.mark}{process.env.DATABASE_URL ? "" : " / SAMPLE CONCEPT"}</span><div className="home-project-visual"><div className="project-window"><div className="window-top"><span /><span /><span /></div><div className="window-content"><div className="window-mark">L<span>.</span></div><span className="window-lines"><i /><i /><i /></span><span className="window-block" /></div></div></div><span className="home-project-category">{project.category}</span><h3>{project.title} <ArrowUpRight size={15} /></h3><p>{project.summary}</p></Link>)}</div>{!process.env.DATABASE_URL && <p className="sample-disclaimer"><Check size={14} /> Illustrative sample concepts only—not client work or completed projects.</p>}</div></section>}

      <section className="section industries-section" id="industries">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow dark-eyebrow">SOLUTIONS BY INDUSTRY</p><h2>Built around the work<br /><span>your teams do.</span></h2></div>
            <p className="section-intro">From stock and bookings to student records and client work, each solution starts with the workflows that matter in your sector.</p>
          </div>
          <div className="industry-grid">
            {solutions.map((solution, index) => {
              const Icon = industryIcons[index % industryIcons.length];
              return <Link className="industry-card" href={`/solutions/${solution.slug}`} key={solution.slug}>
                <span className="service-icon"><Icon size={18} /></span>
                <h3>{solution.title}</h3>
                <p>{solution.detail}</p>
                <span className="underlined-link">Explore solution <ArrowUpRight size={14} /></span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="dark-section">
        <div className="container approach">
          <div className="approach-intro"><p className="eyebrow"><span className="eyebrow-dot" /> A BETTER WAY TO BUILD</p><h2>Good work starts<br />with <span>good questions.</span></h2><p>Technology should make things easier, not more complicated. We start by understanding the real problem—and stay close until it’s solved.</p><Link className="text-link light-link" href="/about">How we work <ArrowRight size={16} /></Link><div className="decor-spark"><Sparkles size={37} strokeWidth={1} /></div></div>
          <div className="process-list">{developmentSteps.map(([n, title, body]) => <div className="process-item" key={n}><span className="process-n">{n}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight size={16} /></div>)}</div>
        </div>
      </section>

      <section className="section pricing-section">
        <div className="container">
          <div className="section-heading pricing-header">
            <div>
              <p className="eyebrow dark-eyebrow">PRICING</p>
              <h2>Simple options.<br /><span>Clear next steps.</span></h2>
            </div>
            <Link className="underlined-link" href="/pricing">View all pricing <ArrowRight size={15} /></Link>
          </div>
          <div className="pricing-grid">
            {featuredPlans.map((plan) => (
              <article className={`pricing-card${plan.isPopular ? " pricing-card-popular" : ""}`} key={plan.slug}>
                <div className="pricing-card-top">
                  {plan.isPopular && <span className="pricing-badge">Most popular</span>}
                  <p className="pricing-category">{plan.category.name}</p>
                  <h3>{plan.name}</h3>
                  <p className="pricing-description">{plan.description}</p>
                </div>
                <div className="pricing-price-wrap">
                  <span className="plan-price">{plan.priceLabel}</span>
                  {plan.billingInterval && plan.billingInterval !== "ONE_TIME" && <span className="plan-interval">/ {plan.billingInterval.toLowerCase()}</span>}
                </div>
                <ul className="pricing-feature-list">
                  {plan.features.slice(0, 4).map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}
                </ul>
                <Link className={`button ${plan.isPopular ? "button-lime" : "button-secondary"}`} href={`/contact?plan=${encodeURIComponent(plan.slug)}`}>
                  {plan.ctaLabel} <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
          <p className="pricing-note">One-time project fees and recurring support are labelled on each package. Custom software is scoped and quoted before work begins.</p>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow dark-eyebrow">WHY LEON.TECH</p><h2>Good work, with<br /><span>the details considered.</span></h2></div><p className="section-intro">A practical, collaborative approach—from the first scope conversation to the handover and what comes next.</p></div>
          <div className="why-grid">
            {[
              ["A fit for your requirements", "We shape the solution around your users, existing tools, constraints, and priorities."],
              ["Clear scope and pricing", "We agree deliverables, assumptions, exclusions, and costs in a written proposal before work starts."],
              ["Responsive and accessible", "Mobile layouts and accessibility considerations are part of design and quality checks."],
              ["Maintainable foundations", "We plan for security, clear handover, and sensible future changes—not just the first release."],
              ["Direct communication", "Regular reviews and agreed decision points keep project conversations practical and visible."],
              ["Support after launch", "Maintenance, troubleshooting, and improvements can be arranged around your actual needs."],
            ].map(([title, description]) => <article className="why-card" key={title}><Check size={17} /><div><h3>{title}</h3><p>{description}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="section add-ons-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow dark-eyebrow">OPTIONAL ADD-ONS</p><h2>Useful extras,<br /><span>when you need them.</span></h2></div><p className="section-intro">Extend a website or software project with focused services. Add-ons are scoped to your setup; third-party subscriptions and provider fees are quoted separately.</p></div>
          <div className="add-on-grid">
            {addOnServices.map(({ title, description, service, icon: Icon }) => <article className="add-on-card" key={service}>
              <span className="service-icon"><Icon size={18} /></span>
              <h3>{title}</h3><p>{description}</p>
              <span className="add-on-price">Quoted to scope</span>
              <Link className="underlined-link" href={`/contact?service=${service}`}>Ask about this add-on <ArrowRight size={14} /></Link>
            </article>)}
          </div>
          <p className="add-on-pricing-link">Looking for ongoing care? <Link href="/pricing#support-and-maintenance">Compare maintenance packages <ArrowRight size={14} /></Link></p>
        </div>
      </section>

      <section className="section home-faq-section">
        <div className="container home-faq-inner">
          <div><p className="eyebrow dark-eyebrow">BEFORE WE BEGIN</p><h2>Questions worth<br /><span>asking.</span></h2><p>Need more detail about planning, costs, or handover? Find straightforward answers or talk to us directly.</p><Link className="underlined-link" href="/faq">Read all FAQs <ArrowRight size={15} /></Link></div>
          <div className="faq-list">{homeFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</p><h2>Have an idea?<br /><span>Let's make it real.</span></h2></div><div className="cta-right"><p>Tell us what you're working on. We'll bring honest advice, a thoughtful approach, and the right people to help you move forward.</p><Link className="button button-lime" href="/contact">Let's talk <ArrowUpRight size={17} /></Link><span className="cta-note">No pressure. Just a good conversation.</span></div></div><div className="cta-orb" aria-hidden="true" /></section>
    </main>
  );
}
