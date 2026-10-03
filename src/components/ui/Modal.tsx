import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16131F]/50 p-4 backdrop-blur-xs animate-fade-up select-none">
      <div
        className={`relative w-full ${maxWidth} rounded-3xl border border-[#DAD4DF] bg-[#F4F0EB] p-6 shadow-2xl transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-caveat text-3xl font-bold text-[#16131F] leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="font-caveat text-lg text-[#806C79] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DAD4DF] text-[#4A3F4B] shadow-2xs hover:bg-[#C1A0AC] hover:text-[#16131F] transition active:scale-95 border border-[#BAB0C8]"
          >
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
