import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CheckSquare,
  FileText,
  PenLine,
  Camera,
  BookOpen,
  Clock,
  Brain,
  Sparkles,
} from "lucide-react";

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const ACTIONS: QuickActionItem[] = [
  {
    id: "task",
    label: "New Task",
    icon: <CheckSquare size={15} />,
    path: "/tasks",
    color: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2]",
  },
  {
    id: "note",
    label: "New Note",
    icon: <FileText size={15} />,
    path: "/notes",
    color: "bg-[#E5E5FA] text-[#554E8C] border-[#D4D4F5]",
  },
  {
    id: "diary",
    label: "Diary Entry",
    icon: <PenLine size={15} />,
    path: "/diary",
    color: "bg-[#F8E8F0] text-[#8C4E6D] border-[#F2D8E4]",
  },
  {
    id: "memory",
    label: "Add Memory",
    icon: <Camera size={15} />,
    path: "/memories",
    color: "bg-[#F3EAF4] text-[#825380] border-[#E8D9EB]",
  },
  {
    id: "book",
    label: "Add Book",
    icon: <BookOpen size={15} />,
    path: "/reading",
    color: "bg-[#EEF3FA] text-[#4E6B8C] border-[#D9E5F2]",
  },
  {
    id: "focus",
    label: "Start Focus",
    icon: <Clock size={15} />,
    path: "/focus",
    color: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2]",
  },
  {
    id: "braindump",
    label: "Brain Dump",
    icon: <Brain size={15} />,
    path: "/brain-dump",
    color: "bg-[#F8E8F0] text-[#8C4E6D] border-[#F2D8E4]",
  },
];

export const QuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="fixed bottom-20 md:bottom-7 right-5 md:right-8 z-40 select-none">
      {/* Backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#17151C]/20 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Menu Items */}
      {isOpen && (
        <div className="relative mb-3 flex flex-col items-end gap-2 animate-lumi-fade-up">
          <div className="rounded-2xl bg-white/95 p-3 shadow-[0_12px_36px_rgba(80,70,120,0.14)] backdrop-blur-xl border border-[#E8E3F0] w-56 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8D8792] flex items-center justify-between">
              <span>Quick Create</span>
              <Sparkles size={11} className="text-[#9E96D8]" />
            </div>

            {ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  navigate(action.path);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#17151C] hover:bg-[#FAF8FC] transition cursor-pointer text-left"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border shadow-2xs ${action.color}`}
                >
                  {action.icon}
                </div>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
        className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-[#17151C] text-white shadow-[0_8px_24px_rgba(23,21,28,0.25)] transition-all duration-300 hover:scale-105 hover:bg-[#2D263B] active:scale-95 cursor-pointer relative z-10 ${
          isOpen ? "rotate-45 bg-[#2D263B]" : "rotate-0"
        }`}
      >
        <Plus size={22} className="transition-transform duration-300" />
      </button>
    </div>
  );
};
