import type { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border border-[#27272A]/15 bg-white px-3 py-1 text-xs font-medium text-[#444444] ${className}`}
    >
      {children}
    </span>
  );
}
