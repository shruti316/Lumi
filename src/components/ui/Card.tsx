import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#D8D4CD] bg-[#F8F5F2] p-5 shadow-2xs transition-all duration-300 ease-out ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}