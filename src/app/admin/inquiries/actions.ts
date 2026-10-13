"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

const schema = z.object({ id: z.string().cuid(), status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST", "ARCHIVED"]) });

export async function updateInquiryStatus(formData: FormData) {
  const actor = await requireRole("inquiries:write");
  const parsed = schema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) throw new Error("Invalid inquiry status update.");
  await prisma.$transaction(async (transaction) => {
    const inquiry = await transaction.inquiry.findUnique({ where: { id: parsed.data.id }, select: { status: true } });
    if (!inquiry) throw new Error("Inquiry not found.");
    await transaction.inquiry.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    if (inquiry.status !== parsed.data.status) {
      await transaction.inquiryActivity.create({ data: { inquiryId: parsed.data.id, actorId: actor.id, action: "STATUS_CHANGED", previousValue: inquiry.status, newValue: parsed.data.status } });
    }
  });
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}
