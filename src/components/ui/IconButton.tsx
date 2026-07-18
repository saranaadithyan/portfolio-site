import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ label, className = "", children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272A]/15 text-[#333333] transition-colors duration-300 hover:bg-[#ECECEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#333333] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
