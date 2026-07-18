"use client";

import { useEffect, useState } from "react";
import { navItems, sectionIds } from "@/data/nav";
import { site } from "@/data/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { ContactModal } from "./ContactModal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-[#D4D6D4]/80 backdrop-blur-md border-b border-[#27272A]/10" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <a href="#home" className="text-lg font-semibold text-[#282929]">
            {site.name}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  active={activeId === item.href.replace("#", "")}
                  onContactClick={() => setContactOpen(true)}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272A]/15 text-[#333333] md:hidden"
          >
            <span className="sr-only">Menu</span>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </nav>

        {mobileOpen ? (
          <ul className="flex flex-col gap-1 border-t border-[#27272A]/10 bg-[#D4D6D4] px-6 py-4 md:hidden">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  active={activeId === item.href.replace("#", "")}
                  onContactClick={() => {
                    setContactOpen(true);
                    setMobileOpen(false);
                  }}
                  onNavigate={() => setMobileOpen(false)}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

function NavLink({
  item,
  active,
  onContactClick,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onContactClick: () => void;
  onNavigate?: () => void;
}) {
  const baseClasses =
    "block rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-[#ECECEC]";
  const activeClasses = active ? "text-[#282929]" : "text-[#444444]";

  if (item.isModal) {
    return (
      <button
        type="button"
        onClick={onContactClick}
        className={`${baseClasses} ${activeClasses}`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <a href={item.href} onClick={onNavigate} className={`${baseClasses} ${activeClasses}`}>
      {item.label}
    </a>
  );
}
