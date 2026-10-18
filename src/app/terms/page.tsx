import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
export const metadata: Metadata = createPageMetadata({
  title: "Terms of use",
  description: "Draft terms covering use of the Leon.Tech website and separate written project agreements.",
  path: "/terms",
  robots: { index: false, follow: true },
});
export default function TermsPage() { return <main className="page-shell"><section className="page-hero"><div className="container"><p className="eyebrow">LEGAL · REVIEW REQUIRED BEFORE PRODUCTION</p><h1>Terms of use</h1><p>Draft terms covering access to the Leon.Tech website.</p></div></section><section className="content-section"><article className="article-content"><div className="sample-disclaimer">Draft content only—not legal advice. Have these terms reviewed and tailored before production use.</div><h2>Using this website</h2><p>This website provides general information about Leon.Tech and its services. Website content is for informational purposes and is not a binding offer, quotation, or professional advice.</p><h2>Project agreements</h2><p>Any services, deliverables, fees, timelines, intellectual property, and support obligations will be described in a separate written agreement accepted by the relevant parties.</p><h2>Content and availability</h2><p>We aim to keep information accurate and the website available, but do not warrant uninterrupted access or that all content is complete or current.</p><h2>Contact</h2><p>Questions about these draft terms can be sent through the contact page. Update this document with reviewed company details and governing-law terms before launch.</p></article></section></main>; }
