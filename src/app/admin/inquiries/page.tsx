import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { updateInquiryStatus } from "./actions";

export const metadata: Metadata = { title: "Inquiries", robots: { index: false, follow: false } };
const statuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST", "ARCHIVED"] as const;

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole("inquiries:read");
  const { status } = await searchParams;
  const validStatus = statuses.find((item) => item === status);
  const inquiries = await prisma.inquiry.findMany({
    where: validStatus ? { status: validStatus } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, referenceNumber: true, fullName: true, email: true, phone: true, company: true, serviceNameSnapshot: true, budget: true, timeline: true, description: true, status: true, createdAt: true },
  });
  return <main className="admin-shell"><div className="admin-container"><div className="admin-heading"><div><p className="eyebrow dark-eyebrow">LEAD MANAGEMENT</p><h1>Inquiries</h1><p>Review requests and keep the conversation moving.</p></div></div><div className="admin-nav">{["All", ...statuses].map((item) => <Link key={item} className={(validStatus ?? "All") === item ? "selected" : ""} href={item === "All" ? "/admin/inquiries" : `/admin/inquiries?status=${item}`}>{item.replaceAll("_", " ")}</Link>)}</div><div className="admin-box"><div className="inquiry-table-wrap"><table className="inquiry-table"><thead><tr><th>Inquiry</th><th>Project</th><th>Details</th><th>Status</th><th>Update status</th></tr></thead><tbody>{inquiries.map((item) => <tr key={item.id}><td><strong>{item.referenceNumber}</strong><br />{item.fullName}<br /><a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>{item.phone && <><br />{item.phone}</>}{item.company && <><br />{item.company}</>}<small>{item.createdAt.toLocaleDateString("en-KE")}</small></td><td>{item.serviceNameSnapshot ?? "Not specified"}<br /><small>Budget: {item.budget ?? "Not specified"}</small><br /><small>Timeline: {item.timeline ?? "Not specified"}</small></td><td className="inquiry-description">{item.description}</td><td><span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status.replaceAll("_", " ")}</span></td><td><form action={updateInquiryStatus} className="status-form"><input type="hidden" name="id" value={item.id} /><select name="status" defaultValue={item.status} aria-label={`Update status for ${item.referenceNumber}`}>{statuses.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select><button type="submit">Save</button></form></td></tr>)}</tbody></table>{inquiries.length === 0 && <p className="empty-note">No inquiries match this filter.</p>}</div><p className="admin-footnote">Showing at most 100 inquiries, newest first. Changes are recorded in the inquiry activity history.</p></div></div></main>;
}
