"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const drawer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => drawer.current?.close();

  useEffect(() => { drawer.current?.close(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 768px)");
    const onResize = () => { if (media.matches) drawer.current?.close(); };
    media.addEventListener("change", onResize);
    return () => { document.body.style.overflow = previous; media.removeEventListener("change", onResize); };
  }, [open]);

  const links = NAV_LINKS.map(({ name, href }) => {
    const current = pathname === href;
    return <li key={href}><Link href={href} onClick={close} aria-current={current ? "page" : undefined}
      className={`flex min-h-12 items-center rounded-lg px-4 text-base transition-colors md:min-h-11 md:px-2 md:text-sm ${current ? "bg-accent/10 font-semibold text-foreground md:bg-transparent" : "text-muted hover:text-foreground"}`}>{name}</Link></li>;
  });

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center text-lg font-bold tracking-tight hover:text-accent">{SITE_NAME}</Link>
        <ul className="hidden items-center gap-4 md:flex lg:gap-6">{links}</ul>
        <button type="button" aria-haspopup="dialog" aria-controls="mobile-navigation" aria-expanded={open}
          onClick={() => { drawer.current?.showModal(); setOpen(true); }}
          className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm md:hidden">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>Menu
        </button>
      </nav>
      <dialog ref={drawer} id="mobile-navigation" aria-label="Site menu" className="mobile-drawer" onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="flex h-full flex-col p-5">
          <div className="mb-6 flex items-center justify-between gap-3"><span className="text-lg font-semibold">Explore</span><button autoFocus type="button" onClick={close} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-lg border border-border text-2xl">×</button></div>
          <nav aria-label="Mobile navigation"><ul className="space-y-2">{links}</ul></nav>
          <div className="mt-auto border-t border-border pt-4"><Link href="/resume" onClick={close} className="flex min-h-12 items-center px-4">Résumé</Link><Link href="/contact" onClick={close} className="flex min-h-12 items-center px-4 text-accent">Contact</Link></div>
        </div>
      </dialog>
    </header>
  );
}
