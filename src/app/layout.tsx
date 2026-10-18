import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { JsonLd } from "@/components/json-ld";
import { getSiteContact } from "@/lib/site-contact";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-manrope",
});

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Web & Software Development Company in Kenya",
    template: "%s | Leon.Tech",
  },
  description: "Leon.Tech builds business websites, e-commerce experiences, custom software, and management systems for teams in Nairobi and across Kenya.",
  openGraph: {
    type: "website",
    siteName: "Leon.Tech",
    locale: "en_KE",
    title: "Web & Software Development Company in Kenya | Leon.Tech",
    description: "Business websites, e-commerce experiences, custom software, and management systems for teams in Nairobi and across Kenya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web & Software Development Company in Kenya | Leon.Tech",
    description: "Business websites, e-commerce experiences, custom software, and management systems for teams in Nairobi and across Kenya.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { email, phone, whatsappNumber } = getSiteContact();
  const siteUrl = getSiteUrl();
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Leon.Tech, I am interested in your software development services.")}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Leon.Tech",
        url: siteUrl.toString(),
        email,
        telephone: phone,
        description: "Independent digital studio designing and building websites, custom software, and business systems.",
        areaServed: { "@type": "Country", name: "Kenya" },
        contactPoint: { "@type": "ContactPoint", contactType: "project enquiries", email, telephone: phone },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Leon.Tech",
        url: siteUrl.toString(),
        publisher: { "@id": `${siteUrl}#organization` },
        inLanguage: "en-KE",
      },
    ],
  };
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={structuredData} />
        <SiteHeader email={email} phone={phone} />
        {children}
        <SiteFooter email={email} phone={phone} whatsappLink={whatsappLink} />
        <ScrollToTop />
      </body>
    </html>
  );
}
