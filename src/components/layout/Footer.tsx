"use client";

import { useState } from "react";
import { navItems } from "@/data/nav";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ContactModal } from "./ContactModal";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="border-t border-[#27272A]/10 bg-[#D4D6D4]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="hover:cursor-pointer">
            <p className="text-lg font-semibold text-[#282929]">{site.name}</p>
            <p className="mt-1 text-sm text-[#7C7D80]">{site.title}</p>
            <Button
              type="button"
              onClick={() => setContactOpen(true)}
              className="mt-4 hover:cursor-pointer"
            >
              Connect
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2">
              {navItems
                .filter((item) => !item.isModal)
                .map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-[#444444] hover:text-[#282929]">
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-[#444444] hover:text-[#282929]">
                  Email
                </a>
              </li>
              <li>
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#444444] hover:text-[#282929]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#444444] hover:text-[#282929]"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#27272A]/10 pt-6 text-xs text-[#7C7D80] sm:flex-row sm:justify-center hover:cursor-pointer">
          <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          {/* <p>Built with Next.js &amp; Tailwind CSS</p> */}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
