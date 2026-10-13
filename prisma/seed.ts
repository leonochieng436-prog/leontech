import { PrismaClient } from "@prisma/client";
import { buildServiceSeedContent, services } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  for (const [sortOrder, service] of services.entries()) {
    const content = buildServiceSeedContent(service);
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        title: service.title,
        slug: service.slug,
        shortDescription: service.summary,
        description: service.description,
        category: content.category,
        businessProblems: content.businessProblems,
        features: service.features,
        deliverables: content.deliverables,
        technologies: content.technologies,
        benefits: content.benefits,
        useCases: content.useCases,
        faqs: content.faqs,
        icon: service.icon,
        sortOrder,
        isActive: true,
        status: "PUBLISHED",
        priceType: "CUSTOM_QUOTE",
      },
    });
  }
  console.info(`Seeded ${services.length} service records.`);
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
