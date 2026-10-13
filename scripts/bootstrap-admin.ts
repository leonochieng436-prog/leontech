import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();
const schema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(100),
  ADMIN_EMAIL: z.string().trim().email().max(254),
  ADMIN_PASSWORD: z.string().min(16).max(128),
});

async function main() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) throw new Error("Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD (at least 16 characters) in the server environment.");
  const email = parsed.data.ADMIN_EMAIL.toLowerCase();
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    throw new Error("An account with this email already exists. Bootstrap never resets an existing password.");
  }
  const passwordHash = await hash(parsed.data.ADMIN_PASSWORD, 12);
  await prisma.user.create({
    data: { name: parsed.data.ADMIN_NAME, email, passwordHash, role: Role.SUPER_ADMIN, isActive: true },
    select: { id: true },
  });
  console.info(`Created initial super administrator account for ${email}.`);
}

main()
  .catch((error: unknown) => {
    console.error("Administrator bootstrap failed:", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
