"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const serviceSchema = z.object({
  title: z.string().trim().min(3).max(100),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  shortDescription: z.string().trim().min(10).max(250),
  description: z.string().trim().min(20).max(5000),
  category: z.string().trim().min(2).max(60),
  features: z.string().max(3000),
});

export async function createService(formData: FormData) {
  await requireRole("content:write");
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Please provide a valid service title, slug, category, and descriptions.");
  const exists = await prisma.service.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (exists) throw new Error("A service with this slug already exists.");
  await prisma.service.create({
    data: {
      ...parsed.data,
      features: parsed.data.features.split(/\r?\n/).map((feature) => feature.trim()).filter(Boolean).slice(0, 30),
      sortOrder: await prisma.service.count(),
    },
  });
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
}

export async function toggleService(formData: FormData) {
  await requireRole("content:write");
  const parsed = z.object({ id: z.string().cuid(), isActive: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Invalid service update.");
  await prisma.service.update({ where: { id: parsed.data.id }, data: { isActive: parsed.data.isActive === "true" } });
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
}
