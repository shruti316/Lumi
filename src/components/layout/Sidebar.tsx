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
}

interface NavItemConfig {
  icon: ReactNode;
  label: string;
  path: string;
  colorClass: string;
  activeBg: string;
  activeBorder: string;
  dotColor: string;
}

const PRIMARY_NAV: NavItemConfig[] = [
  {
    icon: <Home size={17} />,
    label: "Home",
    path: "/",
    colorClass: "text-[#BAB0C8]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#BAB0C8]",
  },
  {
    icon: <CalendarDays size={17} />,
    label: "Planner",
    path: "/planner",
    colorClass: "text-[#DDEAF0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DDEAF0]",
  },
  {
    icon: <CheckSquare size={17} />,
    label: "Tasks",
    path: "/tasks",
    colorClass: "text-[#F0D9E4]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#F0D9E4]",
  },
  {
    icon: <Flame size={17} />,
    label: "Habits",
    path: "/habits",
    colorClass: "text-[#DCE8E0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DCE8E0]",
  },
  {
    icon: <Target size={17} />,
    label: "Goals",
    path: "/goals",
    colorClass: "text-[#DDEAF0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DDEAF0]",
  },
  {
    icon: <FolderKanban size={17} />,
    label: "Projects",
    path: "/projects",
    colorClass: "text-[#F2DFD0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#F2DFD0]",
  },
  {
    icon: <BookOpen size={17} />,
    label: "Reading",
    path: "/reading",
    colorClass: "text-[#DAD4DF]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DAD4DF]",
  },
  {
    icon: <FileText size={17} />,
    label: "Notes",
    path: "/notes",
    colorClass: "text-[#DDEAF0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DDEAF0]",
  },
  {
    icon: <PenLine size={17} />,
    label: "Diary",
    path: "/diary",
    colorClass: "text-[#F2DFD0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#F2DFD0]",
  },
  {
    icon: <Heart size={17} />,
    label: "Memories",
    path: "/memories",
    colorClass: "text-[#F0D9E4]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#F0D9E4]",
  },
  {
    icon: <Brain size={17} />,
    label: "Brain Dump",
    path: "/brain-dump",
    colorClass: "text-[#DAD4DF]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DAD4DF]",
  },
  {
    icon: <Lightbulb size={17} />,
    label: "Reflection",
    path: "/reflection",
    colorClass: "text-[#DCE8E0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DCE8E0]",
  },
];

const UTILITY_NAV: NavItemConfig[] = [
  {
    icon: <Calendar size={15} />,
    label: "Calendar",
    path: "/calendar",
    colorClass: "text-[#DDEAF0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DDEAF0]",
  },
  {
    icon: <Music size={15} />,
    label: "Music",
    path: "/music",
    colorClass: "text-[#BAB0C8]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#BAB0C8]",
  },
  {
    icon: <GraduationCap size={15} />,
    label: "Exams",
    path: "/exams",
    colorClass: "text-[#DDEAF0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#DDEAF0]",
  },
  {
    icon: <Clock size={15} />,
    label: "Study / Focus",
    path: "/focus",
    colorClass: "text-[#F2DFD0]",
    activeBg: "bg-[#312A44]",
    activeBorder: "border-[#4A3F4B]",
    dotColor: "bg-[#F2DFD0]",
  },
];

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside
      className="relative hidden w-60 shrink-0 border-r border-[#312A44] bg-[#16131F]/98 backdrop-blur-xl md:flex md:flex-col min-h-screen select-none z-20 shadow-2xs overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(33, 28, 43, 0.98) 0%, rgba(22, 19, 31, 0.98) 40%, rgba(49, 42, 68, 0.95) 100%)",
      }}
    >
      {/* Sidebar Atmospheric Tints */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#312A44]/40 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -right-10 h-48 w-48 rounded-full bg-[#4A3F4B]/35 blur-2xl" />
      <div className="pointer-events-none absolute top-2/3 -left-10 h-44 w-44 rounded-full bg-[#806C79]/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-[#312A44]/40 blur-2xl" />

      {/* BRAND HEADER */}
      <div className="relative z-10 px-5 pt-6 pb-4">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="flex items-center gap-3 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#211C2B] border border-[#312A44] text-lg shadow-2xs group-hover:scale-105 transition-transform duration-200">
            🌷
          </div>
          <div>
            <h1 className="font-caveat text-2xl font-bold tracking-wider text-white leading-none">
              LUMI
            </h1>
            <p className="mt-1 text-[11px] font-semibold text-[#FAF8FC]/80 tracking-wide font-sans">
              your little life OS
            </p>
          </div>
        </button>
      </div>

      {/* SINGLE NATURAL NAVIGATION LIST */}
      <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-none">
        {PRIMARY_NAV.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? `${item.activeBg} ${item.activeBorder} text-white shadow-2xs font-bold`
                  : "border-transparent text-[#FAF8FC] hover:bg-[#211C2B] hover:text-white hover:shadow-2xs"
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className={`absolute left-1.5 h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
              )}
              <span
                className={`transition-all duration-200 group-hover:translate-x-0.5 ${
                  isActive
                    ? item.colorClass
                    : `${item.colorClass} opacity-95 group-hover:opacity-100`
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
      <div className="relative z-10 border-t border-[#312A44] px-3 py-3">
        <div className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#FAF8FC]/70">
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
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition duration-200 border ${
                  isActive
                    ? `${item.activeBg} ${item.activeBorder} text-white font-bold`
                    : "border-transparent text-[#FAF8FC] hover:bg-[#211C2B] hover:text-white"
                }`}
              >
                <span
                  className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? item.colorClass : `${item.colorClass} opacity-95 group-hover:opacity-100`
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

      {/* PROFILE / USER FOOTER */}
      <div className="relative z-10 border-t border-[#312A44] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#211C2B] p-2.5 border border-[#312A44] shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#312A44] text-white font-bold text-xs">
            S
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">Shru</p>
            <p className="truncate text-[10px] text-[#FAF8FC]/75">College Life OS</p>
          </div>
          <Sparkles size={14} className="text-[#FAF8FC]/80" />
        </div>
      </div>
    </aside>
  );
}