import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  preferredContactMethod: z.enum(["EMAIL", "PHONE", "WHATSAPP"]),
  description: z.string().trim().min(20).max(5000),
  consent: z.literal("yes"),
  website: z.string().max(0).optional(),
});
