"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/app/admin/sign-out";

const publicLinks = [
  ["Services", "/services"],
  ["Solutions", "/solutions"],
  ["Work", "/portfolio"],
  ["About", "/about"],
  ["Insights", "/blog"],
  ["Contact", "/contact"],
];

const adminLinks = [
  ["Overview", "/admin"],
  ["Inquiries", "/admin/inquiries"],
  ["Services", "/admin/services"],
];

function isCurrentPage(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const links = isAdmin && !isAdminLogin ? adminLinks : publicLinks;

  return (
    <header className={`site-header${isAdmin ? " admin-header" : ""}`}>
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="Leon.Tech home" onClick={() => setOpen(false)}>
          <span className="brand-mark">L.</span><span>Leon<span className="brand-dot">.</span>Tech</span>
        </Link>
        <nav id="primary-navigation" className={`nav-links${open ? " open" : ""}`} aria-label={isAdmin && !isAdminLogin ? "Admin navigation" : "Primary navigation"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isCurrentPage(pathname, href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="nav-cta">
          {isAdmin && !isAdminLogin
            ? <SignOutButton />
            : <Link className="button button-lime" href={isAdminLogin ? "/" : "/contact"}>{isAdminLogin ? "Visit website" : "Start a project"} <ArrowUpRight size={15} /></Link>}
          <button className="menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
