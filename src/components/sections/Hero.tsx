import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] scroll-mt-20 flex-col items-start justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#27272A]/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full border border-[#27272A]/10"
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <p className="reveal text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
          Hi, I&apos;m
        </p>
        <h1 className="reveal mt-3 text-4xl font-semibold text-[#282929] sm:text-5xl lg:text-6xl">
          {site.name}
        </h1>
        <p className="reveal mt-3 text-xl text-[#444444] sm:text-2xl">{site.title}</p>
        <p className="reveal mt-6 max-w-xl text-base text-[#444444] sm:text-lg">
          {site.description}
        </p>

        <div className="reveal mt-8 flex flex-wrap gap-4">
          <ButtonLink href="#projects">View Projects</ButtonLink>
          <ButtonLink href={site.resumeUrl} variant="secondary" download>
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
