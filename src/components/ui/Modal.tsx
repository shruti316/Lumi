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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17151C]/40 p-4 backdrop-blur-sm lumi-animate-fade-up select-none">
      <div
        className={`relative w-full ${maxWidth} rounded-2xl md:rounded-3xl border border-[#E8E3F0] bg-white/95 p-6 md:p-7 shadow-[0_20px_50px_rgba(80,70,120,0.16)] backdrop-blur-xl transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#17151C] tracking-tight leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#5F5965] mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#5F5965] hover:text-[#17151C] hover:bg-[#E2DCFA] border border-[#DDD8F2] transition active:scale-95 shadow-2xs"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
