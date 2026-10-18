import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata({
  title: "Cookie information",
  description: "Information about essential browser storage and optional analytics on the Leon.Tech website.",
  path: "/cookies",
  robots: { index: false, follow: true },
});
export default function CookiesPage() { return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow">LEGAL · REVIEW REQUIRED BEFORE PRODUCTION</p><h1>Cookie information</h1><p>How this website may use browser storage.</p></div></section><section className="content-section"><article className="article-content"><div className="sample-disclaimer">Draft content only. Revisit if analytics, advertising, or other non-essential tracking is enabled.</div><h2>Essential website functions</h2><p>The website may use strictly necessary browser storage to support requested functions such as authentication for the protected administration area.</p><h2>Optional analytics</h2><p>No analytics or advertising cookies are configured in the initial implementation. If optional tracking is added, disclose it here and obtain any consent required by applicable law before it is activated.</p><h2>Manage browser storage</h2><p>You can manage or remove cookies using your browser settings. Some essential functionality may not work if necessary storage is blocked.</p></article></section></main>; }
