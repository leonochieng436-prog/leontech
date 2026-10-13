import { createHash, randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/features/inquiries/schema";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

async function sendInquiryEmails(data: z.infer<typeof inquirySchema>, reference: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!apiKey || !from || !recipient) return;
  const safeName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeDetails = escapeHtml(data.description).replace(/\n/g, "<br>");
  const messages = [
    {
      to: [recipient],
      subject: `New Leon.Tech inquiry · ${reference}`,
      html: `<h2>New project inquiry</h2><p><strong>Reference:</strong> ${reference}</p><p><strong>From:</strong> ${safeName} (${safeEmail})</p><p><strong>Service:</strong> ${escapeHtml(data.service || "Not specified")}</p><p>${safeDetails}</p>`,
      text: `New project inquiry ${reference}\nFrom: ${data.fullName} (${data.email})\nService: ${data.service || "Not specified"}\n\n${data.description}`,
    },
    {
      to: [data.email],
      subject: `We received your project inquiry · ${reference}`,
      html: `<p>Hello ${safeName},</p><p>Thank you for getting in touch with Leon.Tech. We’ve received your project inquiry and will review the details.</p><p>Your reference number is <strong>${reference}</strong>.</p><p>— The Leon.Tech team</p>`,
      text: `Hello ${data.fullName},\n\nThank you for getting in touch with Leon.Tech. We’ve received your project inquiry and will review the details.\n\nYour reference number is ${reference}.\n\nThe Leon.Tech team`,
    },
  ];
  const results = await Promise.all(messages.map(async (message) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, ...message }),
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
  }));
  return results;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12000) return NextResponse.json({ error: "The inquiry is too large to submit." }, { status: 413 });
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Expected a JSON inquiry." }, { status: 415 });
  const origin = request.headers.get("origin");
  if (origin) {
    const expectedOrigin = new URL(process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).origin;
    const parsedOrigin = z.string().url().safeParse(origin);
    if (!parsedOrigin.success || new URL(parsedOrigin.data).origin !== expectedOrigin) {
      return NextResponse.json({ error: "Cross-origin inquiry submission is not allowed." }, { status: 403 });
    }
  }
  const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and provide valid contact details and a project description." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ error: "Unable to submit this request." }, { status: 400 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "The inquiry service is not configured yet. Please contact us through WhatsApp or email." }, { status: 503 });
  }

  try {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const key = createHash("sha256").update(forwardedFor).digest("hex");
    const bucketMs = 10 * 60 * 1000;
    const windowStart = new Date(Math.floor(Date.now() / bucketMs) * bucketMs);
    const bucket = await prisma.rateLimitBucket.upsert({
      where: { key_windowStart: { key, windowStart } },
      create: { key, windowStart, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true },
    });
    if (bucket.count > 5) return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });

    const service = parsed.data.service
      ? await prisma.service.findFirst({ where: { slug: parsed.data.service, isActive: true }, select: { id: true, title: true } })
      : null;
    const reference = `LT-${new Date().getFullYear()}-${randomInt(100000, 999999)}`;
    const inquiry = await prisma.inquiry.create({
      data: {
        referenceNumber: reference,
        fullName: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        serviceId: service?.id ?? null,
        serviceNameSnapshot: service?.title ?? (parsed.data.service || null),
        budget: parsed.data.budget || null,
        timeline: parsed.data.timeline || null,
        preferredContactMethod: parsed.data.preferredContactMethod,
        description: parsed.data.description,
      },
      select: { referenceNumber: true },
    });
    await sendInquiryEmails(parsed.data, inquiry.referenceNumber).catch((error: unknown) => {
      console.error("Inquiry notification email failed", { reference: inquiry.referenceNumber, reason: error instanceof Error ? error.message : "Unknown email error" });
    });
    return NextResponse.json({ ok: true, reference: inquiry.referenceNumber }, { status: 201 });
  } catch (error) {
    console.error("Inquiry persistence failed", error instanceof Error ? error.message : "Unknown database error");
    return NextResponse.json({ error: "We couldn’t save your inquiry just now. Please try again shortly." }, { status: 500 });
  }
}
