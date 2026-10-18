export type Service = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  icon: string;
  features: string[];
};

export type ServiceFaq = { question: string; answer: string };

export const SERVICE_CATEGORIES = [
  "Web Development",
  "Software Engineering",
  "Business Management Systems",
  "Mobile Application Development",
  "UI/UX and Product Design",
  "Cloud, DevOps, AI and Application Security",
  "Digital Marketing, Maintenance and Technical Support",
] as const;

const serviceCategoryBySlug: Record<string, (typeof SERVICE_CATEGORIES)[number]> = {
  "web-design-development": "Web Development",
  ecommerce: "Web Development",
  "business-websites": "Web Development",
  "custom-software": "Software Engineering",
  "saas-platforms": "Software Engineering",
  "api-integrations": "Software Engineering",
  "enterprise-software": "Software Engineering",
  "database-design": "Software Engineering",
  "business-systems": "Business Management Systems",
  "point-of-sale": "Business Management Systems",
  "inventory-management": "Business Management Systems",
  "erp-crm-hr-payroll": "Business Management Systems",
  "school-management": "Business Management Systems",
  "hotel-management": "Business Management Systems",
  "mobile-app-development": "Mobile Application Development",
  "ui-ux-design": "UI/UX and Product Design",
  "cloud-devops": "Cloud, DevOps, AI and Application Security",
  "workflow-automation": "Cloud, DevOps, AI and Application Security",
  "application-security-review": "Cloud, DevOps, AI and Application Security",
  "security-support": "Digital Marketing, Maintenance and Technical Support",
  "digital-marketing": "Digital Marketing, Maintenance and Technical Support",
  "maintenance-support": "Digital Marketing, Maintenance and Technical Support",
};

export function getServiceCategory(slug: string, currentCategory: string) {
  return serviceCategoryBySlug[slug] ?? (SERVICE_CATEGORIES.includes(currentCategory as (typeof SERVICE_CATEGORIES)[number]) ? currentCategory : "Software Engineering");
}

export function buildServiceSeedContent(service: Service) {
  const category = getServiceCategory(service.slug, service.category);
  const categoryContent: Record<(typeof SERVICE_CATEGORIES)[number], { problems: string[]; benefits: string[]; useCases: string[]; technologies: string[] }> = {
    "Web Development": {
      problems: ["The website does not clearly communicate the offer or guide visitors to a useful next step.", "Slow, inaccessible, or difficult-to-update pages create friction for customers and staff."],
      benefits: ["A clearer customer journey across devices.", "A maintainable foundation for future content and growth."],
      useCases: ["Company and service websites", "Campaign landing pages and online stores"],
      technologies: ["Next.js", "React", "TypeScript", "PostgreSQL or a project-appropriate CMS"],
    },
    "Software Engineering": {
      problems: ["Manual work and disconnected tools make important processes hard to repeat.", "Existing software no longer fits the business rules or customer experience."],
      benefits: ["More consistent workflows and information.", "Software designed to evolve with real requirements."],
      useCases: ["Internal applications and customer portals", "APIs, data platforms, and SaaS products"],
      technologies: ["TypeScript", "Node.js", "PostgreSQL", "Cloud deployment selected for the project"],
    },
    "Business Management Systems": {
      problems: ["Stock, sales, staff, and customer records are scattered across tools.", "Teams lack timely visibility into routine operations."],
      benefits: ["More connected operational information.", "Fewer repeated manual steps and clearer reporting."],
      useCases: ["Retail and wholesale operations", "Education, hospitality, and service businesses"],
      technologies: ["TypeScript", "PostgreSQL", "APIs and payment integrations selected for the project"],
    },
    "Mobile Application Development": {
      problems: ["Customers or staff need important workflows while away from a desktop.", "Mobile experiences are inconsistent or disconnected from business systems."],
      benefits: ["Convenient access to the workflows people need.", "A shared product direction across mobile and backend systems."],
      useCases: ["Customer self-service and commerce", "Field-team and operational apps"],
      technologies: ["React Native", "TypeScript", "REST APIs", "PostgreSQL"],
    },
    "UI/UX and Product Design": {
      problems: ["Users struggle to understand important product flows.", "Teams are building without enough evidence about user needs."],
      benefits: ["Clearer, more usable product experiences.", "Validated decisions before investing in implementation."],
      useCases: ["New product discovery and prototyping", "Usability improvements and design systems"],
      technologies: ["Figma", "Interactive prototypes", "Accessibility and usability review methods"],
    },
    "Cloud, DevOps, AI and Application Security": {
      problems: ["Releases are manual, environments are unreliable, or risk is difficult to assess.", "Automation or AI ideas lack clear controls and integration boundaries."],
      benefits: ["More repeatable delivery and operational visibility.", "Security and human oversight considered as part of implementation."],
      useCases: ["Cloud deployments and release pipelines", "Security reviews and carefully scoped automation"],
      technologies: ["Cloud platforms selected for the project", "CI/CD tooling", "TypeScript", "Security testing tools"],
    },
    "Digital Marketing, Maintenance and Technical Support": {
      problems: ["A digital presence is not being maintained or measured consistently.", "Small technical issues and updates accumulate without a clear owner."],
      benefits: ["More dependable digital operations.", "A practical path for ongoing improvements."],
      useCases: ["Ongoing website and application care", "Search visibility and digital campaign support"],
      technologies: ["Analytics platforms", "Search tools", "Monitoring and managed update workflows"],
    },
  };
  const detail = categoryContent[category];

  return {
    category,
    businessProblems: detail.problems,
    deliverables: [...service.features, "Implementation notes and handover guidance"],
    technologies: detail.technologies,
    benefits: detail.benefits,
    useCases: detail.useCases,
    faqs: [
      { question: `What is included in ${service.title}?`, answer: `The final scope is agreed together. Typical work includes discovery, the relevant ${category.toLowerCase()} deliverables, testing, and a clear handover.` },
      { question: "How is the project price determined?", answer: "Pricing depends on requirements, integrations, content, and delivery constraints. We confirm scope and provide a written quotation before work begins." },
      { question: "How long does delivery take?", answer: "Timing depends on scope and review needs. We agree on a delivery plan after understanding your requirements." },
    ] satisfies ServiceFaq[],
  };
}

export const services: Service[] = [
  { slug: "web-design-development", title: "Website Design & Development", category: "Web", summary: "Distinctive, high-performing websites that tell your story and move people to act.", description: "From the first conversation to launch day, we create fast, accessible websites built around the people you want to reach. Clear content, considered design, and a flexible foundation make your site a useful part of your business—not just a digital brochure.", icon: "Code2", features: ["Business and marketing websites", "Landing pages and campaign sites", "Responsive, accessible frontends", "Content management and SEO foundations"] },
  { slug: "ecommerce", title: "E-commerce Development", category: "Commerce", summary: "Thoughtful online storefronts that make buying easy and running your shop easier.", description: "We build commerce experiences that bring products to life and support the work behind every order—from product discovery through fulfillment and reporting.", icon: "ShoppingBag", features: ["Product catalog and search", "Checkout and payment integrations", "Inventory and order workflows", "Storefront analytics"] },
  { slug: "custom-software", title: "Custom Software & Web Applications", category: "Software", summary: "Purpose-built tools that fit the way your team actually works.", description: "When spreadsheets and disconnected apps hold you back, a purpose-built application can give your team a clearer way to manage work and serve customers.", icon: "Layers3", features: ["Internal business applications", "Customer and partner portals", "Workflow and approval tools", "Secure, scalable application architecture"] },
  { slug: "business-systems", title: "Business Management Systems", category: "Software", summary: "Bring operations, inventory, customer records, and reporting into one connected system.", description: "We help teams reduce manual work and gain a more useful view of their operations with well-designed POS, inventory, CRM, ERP, HR, and sector-specific systems.", icon: "Boxes", features: ["Point of sale and inventory", "CRM and client management", "ERP, HR and operations tooling", "Custom dashboards and reporting"] },
  { slug: "saas-platforms", title: "SaaS Platform Development", category: "Software", summary: "Turn a promising product idea into a stable, customer-ready platform.", description: "From first release to the next stage of growth, we build maintainable SaaS products with the foundation for secure accounts, subscriptions, and evolving product needs.", icon: "Cloud", features: ["Product discovery and MVPs", "Multi-tenant application foundations", "Subscription and billing integrations", "Product analytics and iteration"] },
  { slug: "api-integrations", title: "API Development & Integrations", category: "Engineering", summary: "Make the tools you rely on work together with dependable integrations.", description: "We design and build APIs and integrations that move information safely between your products, partners, and internal systems.", icon: "Workflow", features: ["REST API design and implementation", "Third-party service integrations", "Data synchronization and webhooks", "Integration monitoring and documentation"] },
  { slug: "ui-ux-design", title: "UI/UX Design & Prototyping", category: "Design", summary: "Make complex products feel clear, useful, and natural to use.", description: "We turn research and requirements into practical flows, prototypes, and visual systems that help teams make good product decisions before investing in development.", icon: "MousePointer2", features: ["Product discovery and user flows", "Wireframes and interactive prototypes", "Design systems and component libraries", "Usability reviews"] },
  { slug: "cloud-devops", title: "Cloud Deployment & DevOps", category: "Engineering", summary: "A reliable path from a developer’s machine to the people who depend on your product.", description: "We help teams build safe, repeatable deployment workflows, sensible environments, and monitoring that makes it easier to keep products healthy.", icon: "CloudCog", features: ["Cloud architecture and deployment", "CI/CD workflows", "Environment and release management", "Performance and reliability improvements"] },
  { slug: "security-support", title: "Security, Maintenance & Support", category: "Engineering", summary: "Keep your digital products cared for, current, and ready for change.", description: "Thoughtful maintenance helps your business stay responsive. We can review an existing product, resolve issues, plan improvements, and provide ongoing technical support.", icon: "ShieldCheck", features: ["Application health reviews", "Dependency and security updates", "Bug fixes and technical support", "Improvement planning and delivery"] },
  { slug: "business-websites", title: "Business Websites & Landing Pages", category: "Web", summary: "Clear, focused web pages that help people understand your offer and take the next step.", description: "We create concise business websites and campaign landing pages with useful content, clear calls to action, and a responsive foundation.", icon: "PanelsTopLeft", features: ["Company and service websites", "Lead-generation landing pages", "Campaign and event pages", "Content and conversion planning"] },
  { slug: "enterprise-software", title: "Enterprise Software Development", category: "Software", summary: "Robust software shaped around complex teams, processes, and integrations.", description: "We work with stakeholders to map operational needs and build maintainable software that can work alongside existing systems.", icon: "Building2", features: ["Internal enterprise applications", "System modernization", "Workflow and access design", "Integration and rollout planning"] },
  { slug: "point-of-sale", title: "Point of Sale Systems", category: "Business Systems", summary: "Make sales, payments, and day-to-day shop operations easier to manage.", description: "Build or connect a point of sale system that supports staff, products, transactions, and the reporting your team needs.", icon: "Receipt", features: ["Sales and checkout workflows", "Product and stock visibility", "Payment service integrations", "Daily sales reporting"] },
  { slug: "inventory-management", title: "Inventory Management Systems", category: "Business Systems", summary: "Get a clearer view of stock movement, replenishment, and fulfillment.", description: "We design inventory tools around your locations, catalog, and operating process, with useful views for teams managing the work.", icon: "Boxes", features: ["Stock levels and movements", "Multi-location inventory", "Reorder and fulfillment workflows", "Inventory reporting"] },
  { slug: "erp-crm-hr-payroll", title: "ERP, CRM, HR & Payroll Systems", category: "Business Systems", summary: "Connect the business information and workflows your teams rely on.", description: "We help assess whether configuration, integration, or custom development best fits your business systems needs, then deliver a practical solution.", icon: "Network", features: ["CRM and customer workflows", "ERP process integrations", "HR and staff administration", "Payroll system integrations"] },
  { slug: "school-management", title: "School Management Systems", category: "Business Systems", summary: "Bring school administration, communication, and records into clearer workflows.", description: "Digital tools can help school teams manage routine administrative tasks and improve access to useful information for their communities.", icon: "GraduationCap", features: ["Student and class administration", "Staff and timetable workflows", "Communication and notices", "Fee and reporting integrations"] },
  { slug: "hotel-management", title: "Hotel & Hospitality Management Systems", category: "Business Systems", summary: "Support reservations, guest communication, and hospitality operations.", description: "We build and integrate practical hospitality software that helps teams coordinate bookings and day-to-day operations while supporting a welcoming guest experience.", icon: "Hotel", features: ["Reservation and booking workflows", "Guest communication tools", "Operations and room-status views", "Hospitality integrations"] },
  { slug: "database-design", title: "Database Design & Development", category: "Engineering", summary: "A reliable data foundation for the applications and workflows you depend on.", description: "We model information around real business rules, build reliable database structures, and plan migrations with care for existing data and connected systems.", icon: "Database", features: ["Data modeling and schema design", "PostgreSQL and relational databases", "Data migration planning", "Performance and integrity reviews"] },
  { slug: "workflow-automation", title: "Workflow Automation & AI Integration", category: "Automation", summary: "Reduce repetitive work with responsible, well-integrated automation.", description: "We identify suitable repetitive tasks, connect existing tools, and explore carefully scoped AI features with human oversight and clear expectations.", icon: "Workflow", features: ["Workflow mapping and automation", "Business system integrations", "Carefully scoped AI features", "Human review and operational safeguards"] },
  { slug: "mobile-app-development", title: "Mobile Application Development", category: "Mobile", summary: "Useful mobile experiences that connect customers and teams to the services they need.", description: "We plan and build mobile applications around real user needs, with secure connections to the services and data that power the product.", icon: "Smartphone", features: ["Mobile product discovery and scope", "Cross-platform iOS and Android applications", "Account, notification, and API integration", "Testing, release preparation, and handover"] },
  { slug: "application-security-review", title: "Application Security Review", category: "Security", summary: "Identify practical security improvements across your application and delivery process.", description: "We review agreed application components and workflows, prioritize actionable findings, and help teams plan improvements. The scope and testing boundaries are agreed in writing before any assessment.", icon: "ShieldCheck", features: ["Application and dependency review", "Risk-prioritized findings", "Secure configuration recommendations", "Remediation planning and retest options"] },
  { slug: "digital-marketing", title: "Digital Marketing and Search Visibility", category: "Marketing", summary: "Make it easier for the right people to find and understand your business online.", description: "We help shape practical digital visibility work around your goals, from analytics foundations and search improvements to campaign landing pages and measurement.", icon: "Megaphone", features: ["Search visibility and on-page review", "Analytics and conversion measurement setup", "Campaign landing page support", "Content and performance recommendations"] },
  { slug: "maintenance-support", title: "Website Maintenance and Technical Support", category: "Support", summary: "Keep your website and digital tools updated, monitored, and ready for what comes next.", description: "Ongoing technical care can include agreed maintenance, issue triage, dependency updates, monitoring, and a prioritized improvement plan.", icon: "Wrench", features: ["Routine maintenance and updates", "Issue triage and technical support", "Health and performance checks", "Improvement planning and handover notes"] },
];

export type Solution = { slug: string; title: string; summary: string; detail: string; icon: string };
export const solutions: Solution[] = [
  { slug: "retail-commerce", title: "Retail & wholesale", summary: "Keep products, orders, and customers connected.", detail: "Bring product catalogues, point-of-sale activity, stock levels, and online orders into clearer workflows. Teams can plan around inventory visibility, checkout, and the reporting they need for daily trade.", icon: "Store" },
  { slug: "beauty-cosmetics", title: "Beauty & cosmetics", summary: "Help customers discover products and services with ease.", detail: "Support product catalogues, online ordering, service bookings, inventory tracking, and customer enquiries in one considered digital experience for a beauty or cosmetics business.", icon: "Sparkles" },
  { slug: "hospitality", title: "Hospitality & hotels", summary: "Make guest journeys and back-office work feel seamless.", detail: "Coordinate reservations, guest communication, room-status updates, and day-to-day operations. Booking and hospitality integrations are selected to fit the property's existing process.", icon: "Hotel" },
  { slug: "education", title: "Education & schools", summary: "Give school communities a clearer way to stay connected.", detail: "Improve student and class administration, staff and timetable workflows, notices, and fee-related reporting. Existing school processes and access requirements shape the scope.", icon: "GraduationCap" },
  { slug: "professional-services", title: "Professional services", summary: "Spend less time coordinating work and more time doing it.", detail: "Organize client records, engagements, approvals, and service delivery in practical internal tools or client portals, with reporting tailored to how the team works.", icon: "BriefcaseBusiness" },
  { slug: "healthcare-administration", title: "Healthcare administration", summary: "Reduce operational friction with carefully designed digital workflows.", detail: "Support administrative appointment coordination, authorized access to operational information, and service-delivery workflows. Clinical, privacy, and regulatory requirements must be verified and agreed for each project.", icon: "HeartPulse" },
  { slug: "logistics-distribution", title: "Logistics & distribution", summary: "Improve visibility from dispatch through delivery.", detail: "Connect order handling, dispatch, delivery-status updates, and operational reporting. Where useful, scope fleet and inventory information into the team's existing fulfillment workflow.", icon: "Truck" },
  { slug: "startups", title: "Startups & growing businesses", summary: "Build the right foundation for your next stage.", detail: "Validate the first release, shape user journeys, and plan a product roadmap. A focused MVP can include the accounts, workflows, and integrations needed to learn from early users.", icon: "Rocket" },
];

export type Project = { slug: string; title: string; category: string; summary: string; tags: string[]; accent: string; mark: string; challenge?: string; solution?: string; liveUrl?: string | null };
export const projects: Project[] = [
  { slug: "sample-operations-platform", title: "Operations, made clearer", category: "Business Systems", summary: "A sample concept for bringing team workflows, reporting, and day-to-day operations into one calm workspace.", tags: ["Product design", "Web application", "Dashboards"], accent: "project-olive", mark: "01" },
  { slug: "sample-commerce-experience", title: "A more human storefront", category: "E-commerce", summary: "A sample concept showing a considered digital storefront for a growing independent retailer.", tags: ["E-commerce", "UX design", "Mobile-first"], accent: "project-peach", mark: "02" },
  { slug: "sample-client-portal", title: "Better client collaboration", category: "SaaS Applications", summary: "A sample concept for a secure client portal that makes shared work and updates easier to follow.", tags: ["SaaS", "Client portal", "Integrations"], accent: "project-blue", mark: "03" },
];

export const articles = [
  { slug: "planning-your-first-business-website", title: "A more useful way to plan your first business website", category: "Digital Strategy", date: "Sample article", excerpt: "A good website begins with the people it serves. Here are the questions worth answering before you pick a template or write a line of code." },
  { slug: "when-custom-software-makes-sense", title: "When does custom software make sense for a growing team?", category: "Software Engineering", date: "Sample article", excerpt: "Not every business needs custom software. Learn how to spot the operational patterns that might mean a purpose-built tool is worth exploring." },
];
