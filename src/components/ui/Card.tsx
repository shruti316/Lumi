interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#f1e5ec] bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}