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
            <p>Thoughtful digital products and software for people building what’s next.</p>
            <div className="footer-social-links" aria-label="Contact Leon.Tech">
              <a href={`mailto:${email}`} aria-label={`Email ${email}`}><Mail size={16} /></a>
              <a href={`tel:${phone}`} aria-label={`Call ${phone}`}><Phone size={16} /></a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Contact Leon.Tech on WhatsApp"><MessageCircle size={16} /></a>
            </div>
          </div>
          <div className="footer-col"><h4>EXPLORE</h4><Link href="/services">Services</Link><Link href="/solutions">Solutions</Link><Link href="/portfolio">Selected work</Link><Link href="/about">About Leon.Tech</Link></div>
          <div className="footer-col"><h4>RESOURCES</h4><Link href="/blog">Insights</Link><Link href="/faq">FAQs</Link><Link href="/contact">Start a project</Link></div>
          <div className="footer-col"><h4>LET’S TALK</h4><Link href="/contact">Tell us about your project ↗</Link><p>Nairobi, Kenya · Working everywhere</p><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone}`}>{phone}</a><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp us ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Leon.Tech. Built with intention.</span><div className="footer-legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link></div></div>
      </div>
    </footer>
  );
}
