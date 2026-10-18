"use client";

import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteFooter({ email, phone, whatsappLink }: { email: string; phone: string; whatsappLink: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/"><span className="brand-mark">L.</span><span>Leon<span className="brand-dot">.</span>Tech</span></Link>
            <p>Thoughtful digital products and software for people building what’s next. Based in Nairobi, working everywhere.</p>
            <div className="footer-social-links" aria-label="Contact Leon.Tech">
              <a href={`mailto:${email}`} aria-label={`Email ${email}`}><Mail size={16} /></a>
              <a href={`tel:${phone}`} aria-label={`Call ${phone}`}><Phone size={16} /></a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Contact Leon.Tech on WhatsApp"><MessageCircle size={16} /></a>
            </div>
          </div>
          <div className="footer-col"><h4>COMPANY</h4><Link href="/about">About us</Link><Link href="/services">Our services</Link><Link href="/portfolio">Portfolio</Link><Link href="/pricing">Pricing</Link><Link href="/blog">Insights</Link><Link href="/faq">FAQs</Link><Link href="/contact">Contact us</Link></div>
          <div className="footer-col"><h4>SERVICES</h4><Link href="/services/web-design-development">Web development</Link><Link href="/services/mobile-app-development">Mobile applications</Link><Link href="/services/business-systems">Business systems</Link><Link href="/services/cloud-devops">Cloud solutions</Link><Link href="/services/application-security-review">Cybersecurity</Link><Link href="/services/maintenance-support">IT support</Link></div>
          <div className="footer-col"><h4>INDUSTRIES</h4><Link href="/solutions/education">Education</Link><Link href="/solutions/healthcare-administration">Healthcare</Link><Link href="/solutions/retail-commerce">Retail & commerce</Link><Link href="/solutions/hospitality">Hospitality</Link><Link href="/solutions/professional-services">Professional services</Link><Link href="/solutions">All industries</Link></div>
          <div className="footer-col"><h4>LET’S TALK</h4><Link href="/contact">Tell us about your project ↗</Link><p>Nairobi, Kenya · Working everywhere</p><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone}`}>{phone}</a><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp us ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Leon.Tech. Built with intention.</span><div className="footer-legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><a href="/sitemap.xml">Sitemap</a></div></div>
      </div>
    </footer>
  );
}
