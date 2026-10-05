import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "lavender"
  | "pink"
  | "blue"
  | "peach"
  | "mixed"
  | "glass"
  | "pearl";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  hoverEffect?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white/85 backdrop-blur-md border border-[#E8E3F0]",
  lavender: "card-lavender border border-[#DCD8F2]",
  pink: "card-pink border border-[#F2D8E4]",
  blue: "card-blue border border-[#D9E7F2]",
  peach: "card-peach border border-[#F1D2C9]",
  mixed: "card-mixed border border-[#DDD8F3]",
  glass: "card-glass border border-white/70 shadow-sm",
  pearl: "card-pearl border border-[#E8E3F0]",
};

export function Card({
  children,
  variant = "default",
  className = "",
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl md:rounded-3xl p-5 md:p-6 lumi-shadow-md transition-all duration-260 ${
        variantClasses[variant]
      } ${hoverEffect ? "lumi-card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}