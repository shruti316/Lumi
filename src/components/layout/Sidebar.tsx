import {
  Home,
  CalendarDays,
  CheckSquare,
  Flame,
  Target,
  FolderKanban,
  BookOpen,
  FileText,
  PenLine,
  Heart,
  Brain,
  Lightbulb,
  Calendar,
  Music,
  GraduationCap,
  Clock,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

interface NavItemConfig {
  icon: ReactNode;
  label: string;
  path: string;
}

const PRIMARY_NAV: NavItemConfig[] = [
  { icon: <Home size={17} strokeWidth={1.9} />, label: "Home", path: "/dashboard" },
  { icon: <CalendarDays size={17} strokeWidth={1.9} />, label: "Planner", path: "/planner" },
  { icon: <CheckSquare size={17} strokeWidth={1.9} />, label: "Tasks", path: "/tasks" },
  { icon: <Flame size={17} strokeWidth={1.9} />, label: "Habits", path: "/habits" },
  { icon: <Target size={17} strokeWidth={1.9} />, label: "Goals", path: "/goals" },
  { icon: <FolderKanban size={17} strokeWidth={1.9} />, label: "Projects", path: "/projects" },
  { icon: <BookOpen size={17} strokeWidth={1.9} />, label: "Reading", path: "/reading" },
  { icon: <FileText size={17} strokeWidth={1.9} />, label: "Notes", path: "/notes" },
  { icon: <PenLine size={17} strokeWidth={1.9} />, label: "Diary", path: "/diary" },
  { icon: <Heart size={17} strokeWidth={1.9} />, label: "Memories", path: "/memories" },
  { icon: <Brain size={17} strokeWidth={1.9} />, label: "Brain Dump", path: "/brain-dump" },
  { icon: <Lightbulb size={17} strokeWidth={1.9} />, label: "Reflection", path: "/reflection" },
];

const UTILITY_NAV: NavItemConfig[] = [
  { icon: <Calendar size={15} strokeWidth={1.8} />, label: "Calendar", path: "/calendar" },
  { icon: <Music size={15} strokeWidth={1.8} />, label: "Music", path: "/music" },
  { icon: <GraduationCap size={15} strokeWidth={1.8} />, label: "Exams", path: "/exams" },
  { icon: <Clock size={15} strokeWidth={1.8} />, label: "Study / Focus", path: "/focus" },
];

export function Sidebar({ currentPath, onNavigate, onOpenSearch }: SidebarProps) {
  return (
    <aside className="relative hidden w-64 shrink-0 border-r border-[#E8E3F0] bg-white/80 backdrop-blur-xl md:flex md:flex-col min-h-screen select-none z-20 shadow-[0_4px_24px_rgba(80,70,120,0.04)] overflow-hidden">
      {/* Subtle Pastel Ambient Blobs Behind Sidebar */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-[#EEEAFE]/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-12 h-40 w-40 rounded-full bg-[#F8E8F0]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[#EEF3FA]/60 blur-3xl" />

      {/* BRAND HEADER */}
      <div className="relative z-10 px-6 pt-7 pb-4">
        <button
          type="button"
          onClick={() => onNavigate("/dashboard")}
          className="flex items-center gap-3.5 group text-left w-full cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DCD8F2] to-[#F2D8E4] border border-white shadow-[0_4px_12px_rgba(184,179,232,0.3)] group-hover:scale-105 transition-transform duration-200 text-lg">
            ✧
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#17151C] leading-none group-hover:text-[#9E96D8] transition-colors">
              LUMI
            </h1>
            <p className="mt-1 text-[11px] font-medium tracking-widest text-[#8D8792] uppercase">
              Editorial Life OS
            </p>
          </div>
        </button>

        {/* Global Search / Command Trigger in Sidebar */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] px-3 py-2 text-xs text-[#8D8792] hover:border-[#9E96D8]/50 hover:bg-white transition cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 font-medium">
              <Sparkles size={13} className="text-[#9E96D8]" />
              <span>Search / Command</span>
            </span>
            <kbd className="rounded border border-[#DDD8F2] bg-[#EEEAFE] px-1.5 py-0.5 text-[10px] font-semibold text-[#6B5BA5]">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* PRIMARY NAVIGATION */}
      <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3.5 py-2 scrollbar-none">
        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
          Workspace
        </div>
        {PRIMARY_NAV.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:bg-white/90 hover:text-[#17151C] font-medium border border-transparent hover:border-[#E8E3F0]"
              }`}
            >
              {isActive && (
                <span className="absolute left-1.5 h-1.5 w-1.5 rounded-full bg-[#9E96D8] shadow-[0_0_6px_#9E96D8]" />
              )}
              <span
                className={`transition-all duration-200 group-hover:translate-x-0.5 ${
                  isActive ? "text-[#9E96D8]" : "text-[#8D8792] group-hover:text-[#17151C]"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* UTILITY NAVIGATION AREA */}
      <div className="relative z-10 border-t border-[#E8E3F0] px-3.5 py-3">
        <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
          Quick Tools
        </div>
        <div className="space-y-0.5">
          {UTILITY_NAV.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2]"
                    : "text-[#5F5965] hover:bg-white/80 hover:text-[#17151C] font-medium border border-transparent"
                }`}
              >
                <span
                  className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? "text-[#9E96D8]" : "text-[#8D8792] group-hover:text-[#17151C]"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="relative z-10 border-t border-[#E8E3F0] p-3.5">
        <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-2.5 border border-[#E8E3F0] shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#DCD8F2] to-[#EEF3FA] text-[#17151C] font-bold text-xs border border-white shadow-2xs">
            S
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#17151C]">Shru</p>
            <p className="truncate text-[10px] text-[#8D8792]">Personal Life OS</p>
          </div>
          <Sparkles size={14} className="text-[#B8B3E8]" />
        </div>
      </div>
    </aside>
  );
}