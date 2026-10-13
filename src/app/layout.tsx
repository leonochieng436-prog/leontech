import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getSiteContact } from "@/lib/site-contact";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Leon.Tech — Software that moves business forward",
    template: "%s | Leon.Tech",
  },
  description: "Leon.Tech designs and builds purposeful digital products, custom software, and business systems for ambitious teams across Africa and beyond.",
  openGraph: {
    type: "website",
    siteName: "Leon.Tech",
    title: "Leon.Tech — Software that moves business forward",
    description: "Purposeful digital products and business software, thoughtfully engineered in Nairobi, Kenya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leon.Tech — Software that moves business forward",
    description: "Purposeful digital products and business software, thoughtfully engineered in Nairobi, Kenya.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { email, phone, whatsappNumber } = getSiteContact();
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Leon.Tech, I am interested in your software development services.")}`;
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter email={email} phone={phone} whatsappLink={whatsappLink} />
        <ScrollToTop />
      </body>
    </html>
  );
}
