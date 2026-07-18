import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  withTopBorder?: boolean;
};

export function Section({ id, children, className = "", withTopBorder = true }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-16 sm:py-24 ${withTopBorder ? "border-t border-[#27272A]/10" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
