import type { Metadata } from "next";
import type { PublicService } from "@/lib/public-data";

export function createPageMetadata({
  title,
  description,
  path,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
}): Metadata {
  const socialTitle = `${title} | Leon.Tech`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title: socialTitle, description, url: path },
    twitter: { card: "summary_large_image", title: socialTitle, description },
    ...(robots ? { robots } : {}),
  };
}

const serviceSearchContent: Record<string, { title: string; description: string }> = {
  "web-design-development": {
    title: "Website Design & Development in Kenya",
    description: "Plan and build a responsive business website with clear content, useful integrations, and a maintainable foundation. Serving Nairobi and businesses across Kenya.",
  },
  ecommerce: {
    title: "E-commerce Website Development in Kenya",
    description: "Create an online shop with product discovery, checkout, order workflows, and payment integrations such as M-Pesa where requirements allow.",
  },
  "custom-software": {
    title: "Custom Software Development in Kenya",
    description: "Build web applications and business tools around your team's workflows, data, and integrations, with a clear scope and technical handover.",
  },
  "business-systems": {
    title: "Business Management System Development in Kenya",
    description: "Connect POS, inventory, CRM, ERP, and operational workflows with software shaped around how your Kenyan business works.",
  },
  "point-of-sale": {
    title: "POS System Development in Kenya",
    description: "Plan point-of-sale workflows for products, checkout, payments, stock visibility, and sales reporting around your retail operation.",
  },
  "inventory-management": {
    title: "Inventory Management Software in Kenya",
    description: "Design stock management workflows for product movement, multiple locations, replenishment, and fulfilment reporting.",
  },
  "erp-crm-hr-payroll": {
    title: "ERP, CRM, HR & Payroll Systems in Kenya",
    description: "Assess integrations, configuration, or custom development for connected customer, operations, staff, and payroll workflows.",
  },
  "school-management": {
    title: "School Management System Development in Kenya",
    description: "Plan digital workflows for student records, classes, timetables, communication, and school administration around your requirements.",
  },
  "hotel-management": {
    title: "Hotel Management Software in Kenya",
    description: "Coordinate reservation, guest communication, room status, and hospitality operations with software suited to your team's workflows.",
  },
  "saas-platforms": {
    title: "SaaS Platform Development in Kenya",
    description: "Shape a SaaS product from discovery through a customer-ready release, including accounts, permissions, integrations, and iteration planning.",
  },
  "api-integrations": {
    title: "API Development & Integration Services in Kenya",
    description: "Connect business tools and applications with documented APIs, data synchronization, webhooks, and agreed integration monitoring.",
  },
  "enterprise-software": {
    title: "Enterprise Software Development in Kenya",
    description: "Plan maintainable internal applications and system integrations around complex processes, stakeholders, and access requirements.",
  },
  "business-websites": {
    title: "Business Website Design in Kenya",
    description: "Build a clear, responsive company website or landing page with useful content, focused calls to action, and a maintainable foundation.",
  },
  "mobile-app-development": {
    title: "Mobile App Development in Kenya",
    description: "Plan and build mobile applications for customer and team workflows, with API integrations, testing, and release preparation.",
  },
  "ui-ux-design": {
    title: "UI/UX Design Services in Kenya",
    description: "Clarify product flows through discovery, wireframes, interactive prototypes, and usability reviews before or during development.",
  },
  "cloud-devops": {
    title: "Cloud Solutions & DevOps in Kenya",
    description: "Plan cloud deployment, delivery pipelines, environments, monitoring, and reliability improvements for your application.",
  },
  "application-security-review": {
    title: "Application Security Review in Kenya",
    description: "Review agreed application components, prioritize practical security findings, and plan remediation within a clearly defined scope.",
  },
  "security-support": {
    title: "Website Security, Maintenance & Support in Kenya",
    description: "Arrange updates, issue triage, health checks, security improvements, and technical support for your website or application.",
  },
  "maintenance-support": {
    title: "Website Maintenance & Support in Kenya",
    description: "Keep your website current with agreed updates, issue triage, health checks, technical support, and improvement planning.",
  },
  "digital-marketing": {
    title: "Digital Marketing & Search Visibility in Kenya",
    description: "Improve the foundations of online visibility with on-page reviews, analytics setup, campaign pages, and practical measurement.",
  },
  "workflow-automation": {
    title: "Business Process Automation in Kenya",
    description: "Map repetitive work, connect existing tools, and scope automation with clear operational boundaries and human oversight.",
  },
  "database-design": {
    title: "Database Design & Development in Kenya",
    description: "Model business data, plan safe migrations, and review performance and integrity for the applications your team relies on.",
  },
};

const solutionSearchContent: Record<string, { title: string; description: string }> = {
  "retail-commerce": {
    title: "Retail & E-commerce Software Solutions in Kenya",
    description: "Connect retail catalogues, POS activity, stock, online orders, and reporting with workflows planned for your business.",
  },
  "beauty-cosmetics": {
    title: "Digital Solutions for Beauty Businesses in Kenya",
    description: "Explore product catalogues, online ordering, service bookings, inventory, and customer enquiry workflows for beauty businesses.",
  },
  hospitality: {
    title: "Hotel & Hospitality Management Software in Kenya",
    description: "Plan reservation, guest communication, room-status, and daily operations workflows around your hospitality team's needs.",
  },
  education: {
    title: "School Management Systems in Kenya",
    description: "Improve student administration, timetables, notices, and fee-related reporting with digital workflows scoped to your school.",
  },
  "professional-services": {
    title: "Business Software for Professional Services in Kenya",
    description: "Organize client records, engagements, approvals, and service delivery with internal tools or client portals.",
  },
  "healthcare-administration": {
    title: "Healthcare Administration Software in Kenya",
    description: "Scope administrative appointment, operational information, and service-delivery workflows with privacy and regulatory needs reviewed.",
  },
  "logistics-distribution": {
    title: "Logistics & Distribution Software in Kenya",
    description: "Connect order handling, dispatch, delivery-status updates, and operational reporting to improve workflow visibility.",
  },
  startups: {
    title: "Software Development for Startups in Kenya",
    description: "Shape an MVP, user journeys, and a practical product roadmap around the needs of your early users and team.",
  },
};

export function getServiceMetadata(service: PublicService): Metadata {
  const searchContent = serviceSearchContent[service.slug];
  return createPageMetadata({
    title: service.seoTitle || searchContent?.title || `${service.title} in Kenya`,
    description: service.seoDescription || searchContent?.description || `${service.summary} Discuss a clear scope for your project with Leon.Tech in Nairobi, Kenya.`,
    path: service.seoCanonicalUrl || `/services/${service.slug}`,
  });
}

export function getSolutionMetadata(slug: string, title: string, summary: string): Metadata {
  const searchContent = solutionSearchContent[slug];
  return createPageMetadata({
    title: searchContent?.title || `${title} Digital Solutions in Kenya`,
    description: searchContent?.description || `${summary} Explore practical digital solutions for businesses in Kenya with Leon.Tech.`,
    path: `/solutions/${slug}`,
  });
}
