import type { ReactNode } from "react";

const cardBase =
  "rounded-xl border border-[#27272A]/15 bg-[#F8F8F8] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <div className={`${cardBase} ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`space-y-1 mt-4 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`mt-3 space-y-3 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`mt-4 flex items-center gap-3 ${className}`}>{children}</div>;
}
