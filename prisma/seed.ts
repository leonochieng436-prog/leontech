import { PrismaClient } from "@prisma/client";
import { services } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  for (const [sortOrder, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        title: service.title,
        slug: service.slug,
        shortDescription: service.summary,
        description: service.description,
        category: service.category,
        features: service.features,
        icon: service.icon,
        sortOrder,
        isActive: true,
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
