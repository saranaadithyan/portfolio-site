import type { ElementType, ReactNode } from "react";

type HeadingProps = {
  as?: ElementType;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function Heading({ as: Tag = "h2", eyebrow, children, className = "" }: HeadingProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-widest text-[#7C7D80]">
          {eyebrow}
        </p>
      ) : null}
      <Tag className={`text-2xl font-semibold text-[#282929] sm:text-3xl ${className}`}>
        {children}
      </Tag>
    </div>
  );
}
