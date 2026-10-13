import Link from "next/link";
import { ArrowUpRight, Inbox, Layers3, Newspaper, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export const metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const user = await requireRole("content:read");
  const [total, fresh, inProgress, activeServices, publishedProjects, publishedArticles, recent, publishedTestimonials] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: { in: ["CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION"] } } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.portfolioProject.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, referenceNumber: true, fullName: true, serviceNameSnapshot: true, status: true, createdAt: true } }),
    prisma.testimonial.count({ where: { isApproved: true, isPublished: true } }),
  ]);
  const cards = [
    ["Total inquiries", total, Inbox], ["New inquiries", fresh, Inbox], ["In progress", inProgress, Users],
    ["Active services", activeServices, Layers3], ["Published projects", publishedProjects, Layers3], ["Published articles", publishedArticles, Newspaper],
  ] as const;
  return <main className="admin-shell"><div className="admin-container"><div className="admin-heading"><div><p className="eyebrow dark-eyebrow">BUSINESS OVERVIEW</p><h1>Good to see you, {user.name.split(" ")[0]}.</h1><p>A clear view of the work that matters today.</p></div><Link href="/admin/inquiries" className="button button-lime">View inquiries <ArrowUpRight size={15} /></Link></div><nav className="admin-nav" aria-label="Admin dashboard sections"><Link className="selected" href="/admin">Overview</Link><Link href="/admin/inquiries">Inquiries</Link><Link href="/admin/services">Services</Link><span>{user.role.replace("_", " ")}</span></nav><section className="admin-stats">{cards.map(([title, value, Icon]) => <article className="stat-card" key={title}><span><Icon size={16} /></span><p>{title}</p><b>{value}</b></article>)}</section><section className="admin-content-grid"><article className="admin-box"><div className="admin-box-heading"><div><h2>Recent inquiries</h2><p>The latest requests from your contact form.</p></div><Link href="/admin/inquiries">All inquiries <ArrowUpRight size={13} /></Link></div>{recent.length === 0 ? <p className="empty-note">No inquiries yet. Submitted inquiries will appear here.</p> : <div className="inquiry-table-wrap"><table className="inquiry-table"><thead><tr><th>Reference</th><th>Name</th><th>Service</th><th>Status</th><th>Received</th></tr></thead><tbody>{recent.map((item) => <tr key={item.id}><td><Link href="/admin/inquiries">{item.referenceNumber}</Link></td><td>{item.fullName}</td><td>{item.serviceNameSnapshot ?? "—"}</td><td><span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status.replaceAll("_", " ")}</span></td><td>{item.createdAt.toLocaleDateString("en-KE")}</td></tr>)}</tbody></table></div>}</article><aside className="admin-box"><h2>Content snapshot</h2><p>Real published counts from the database.</p><div className="content-count"><Layers3 size={15} /> <span>Projects</span><b>{publishedProjects}</b></div><div className="content-count"><Newspaper size={15} /> <span>Articles</span><b>{publishedArticles}</b></div><div className="content-count"><Users size={15} /> <span>Testimonials</span><b>{publishedTestimonials}</b></div><Link className="admin-manage" href="/admin/services">Manage services <ArrowUpRight size={14} /></Link></aside></section></div></main>;
}
