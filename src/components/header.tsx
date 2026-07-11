"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark } from "./icons";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="site-header">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="Vantalume home"><Mark /><span>Vantalume</span></Link>
      <button className="menu-button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span></button>
      <nav id="primary-navigation" aria-label="Primary navigation" className={open ? "nav open" : "nav"}>
        {nav.map(item => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        <Link onClick={() => setOpen(false)} href="/contact" className="nav-cta">Start a conversation</Link>
      </nav>
    </div>
  </header>;
}
