"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { site } from "@/data/site";
import { skillCategories } from "@/data/skills";
import { useTypewriter } from "@/lib/useTypeWriter";

const backendStack = skillCategories
  .filter((category) => category.category === "Backend" || category.category === "Cloud")
  .flatMap((category) => category.skills);

const names = [site.name, site.nameTamil];

export function Hero() {
  const typedName = useTypewriter(names);
  const typedRole = useTypewriter(site.roles, { typingSpeed: 55, deletingSpeed: 30 });

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] scroll-mt-20 flex-col items-start justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-70 w-70 rounded-sm border border-[#27272A]/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-10 h-30 w-50 rounded-sm border border-[#27272A]/10"
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <p className="reveal font-mono text-sm text-[#7C7D80]">
          whoami
        </p>

        <h1 className="reveal mt-3 min-h-[1.2em] text-4xl inline-block font-semibold text-[#282929] sm:text-5xl lg:text-6xl">
          {site.name}
        </h1>

        <p className="reveal mt-3 min-h-[1.5em] text-xl text-[#444444] sm:text-2xl">
          {typedRole}
          <span aria-hidden className="cursor-blink ml-1 inline-block">
            |
          </span>
        </p>

        <p className="reveal mt-6 max-w-xl text-base text-[#444444] sm:text-lg">
          {site.description}
        </p>

        <div className="reveal mt-5 flex flex-wrap gap-2">
          {backendStack.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-wrap gap-4">
          <ButtonLink href="#projects">View Projects</ButtonLink>
          <ButtonLink href='/resume' variant="secondary">
            Download Resume
          </ButtonLink>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#7C7D80] transition-colors duration-300 hover:text-[#333333]"
      >
        <span className="block h-9 w-5 rounded-full border border-current p-1">
          <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
