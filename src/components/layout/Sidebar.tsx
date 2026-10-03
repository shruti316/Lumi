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
    colorClass: "text-[#786A9B]",
    activeBg: "bg-[#E5E0EC]",
    activeBorder: "border-[#D2CADB]",
    dotColor: "bg-[#786A9B]",
  },
  {
    icon: <CalendarDays size={17} />,
    label: "Planner",
    path: "/planner",
    colorClass: "text-[#638DA0]",
    activeBg: "bg-[#DCE8EC]",
    activeBorder: "border-[#C5D8E0]",
    dotColor: "bg-[#638DA0]",
  },
  {
    icon: <CheckSquare size={17} />,
    label: "Tasks",
    path: "/tasks",
    colorClass: "text-[#A95C78]",
    activeBg: "bg-[#EBD8DF]",
    activeBorder: "border-[#D8BDC7]",
    dotColor: "bg-[#A95C78]",
  },
  {
    icon: <Flame size={17} />,
    label: "Habits",
    path: "/habits",
    colorClass: "text-[#668C72]",
    activeBg: "bg-[#DCE6DE]",
    activeBorder: "border-[#C4D7C8]",
    dotColor: "bg-[#668C72]",
  },
  {
    icon: <Target size={17} />,
    label: "Goals",
    path: "/goals",
    colorClass: "text-[#786A9B]",
    activeBg: "bg-[#E5E0EC]",
    activeBorder: "border-[#D2CADB]",
    dotColor: "bg-[#786A9B]",
  },
  {
    icon: <FolderKanban size={17} />,
    label: "Projects",
    path: "/projects",
    colorClass: "text-[#A96F51]",
    activeBg: "bg-[#EBD9CD]",
    activeBorder: "border-[#DCBFAD]",
    dotColor: "bg-[#A96F51]",
  },
  {
    icon: <BookOpen size={17} />,
    label: "Reading",
    path: "/reading",
    colorClass: "text-[#786A9B]",
    activeBg: "bg-[#E5E0EC]",
    activeBorder: "border-[#D2CADB]",
    dotColor: "bg-[#786A9B]",
  },
  {
    icon: <FileText size={17} />,
    label: "Notes",
    path: "/notes",
    colorClass: "text-[#638DA0]",
    activeBg: "bg-[#DCE8EC]",
    activeBorder: "border-[#C5D8E0]",
    dotColor: "bg-[#638DA0]",
  },
  {
    icon: <PenLine size={17} />,
    label: "Diary",
    path: "/diary",
    colorClass: "text-[#A96F51]",
    activeBg: "bg-[#EBD9CD]",
    activeBorder: "border-[#DCBFAD]",
    dotColor: "bg-[#A96F51]",
  },
  {
    icon: <Heart size={17} />,
    label: "Memories",
    path: "/memories",
    colorClass: "text-[#A95C78]",
    activeBg: "bg-[#EBD8DF]",
    activeBorder: "border-[#D8BDC7]",
    dotColor: "bg-[#A95C78]",
  },
  {
    icon: <Brain size={17} />,
    label: "Brain Dump",
    path: "/brain-dump",
    colorClass: "text-[#786A9B]",
    activeBg: "bg-[#E5E0EC]",
    activeBorder: "border-[#D2CADB]",
    dotColor: "bg-[#786A9B]",
  },
  {
    icon: <Lightbulb size={17} />,
    label: "Reflection",
    path: "/reflection",
    colorClass: "text-[#668C72]",
    activeBg: "bg-[#DCE6DE]",
    activeBorder: "border-[#C4D7C8]",
    dotColor: "bg-[#668C72]",
  },
];

const UTILITY_NAV: NavItemConfig[] = [
  {
    icon: <Calendar size={15} />,
    label: "Calendar",
    path: "/calendar",
    colorClass: "text-[#638DA0]",
    activeBg: "bg-[#DCE8EC]",
    activeBorder: "border-[#C5D8E0]",
    dotColor: "bg-[#638DA0]",
  },
  {
    icon: <Music size={15} />,
    label: "Music",
    path: "/music",
    colorClass: "text-[#786A9B]",
    activeBg: "bg-[#E5E0EC]",
    activeBorder: "border-[#D2CADB]",
    dotColor: "bg-[#786A9B]",
  },
  {
    icon: <GraduationCap size={15} />,
    label: "Exams",
    path: "/exams",
    colorClass: "text-[#638DA0]",
    activeBg: "bg-[#DCE8EC]",
    activeBorder: "border-[#C5D8E0]",
    dotColor: "bg-[#638DA0]",
  },
  {
    icon: <Clock size={15} />,
    label: "Study / Focus",
    path: "/focus",
    colorClass: "text-[#A96F51]",
    activeBg: "bg-[#EBD9CD]",
    activeBorder: "border-[#DCBFAD]",
    dotColor: "bg-[#A96F51]",
  },
];

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside
      className="relative hidden w-60 shrink-0 border-r border-[#D8D4CD] bg-[#E8E7E5]/95 backdrop-blur-xl md:flex md:flex-col min-h-screen select-none z-20 shadow-2xs overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(216, 210, 230, 0.75) 0%, rgba(232, 231, 229, 0.6) 28%, rgba(201, 221, 228, 0.65) 65%, rgba(209, 223, 211, 0.75) 100%)",
      }}
    >
      {/* Sidebar Atmospheric Tints */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#D8D2E6]/80 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -right-10 h-48 w-48 rounded-full bg-[#C9DDE4]/80 blur-2xl" />
      <div className="pointer-events-none absolute top-2/3 -left-10 h-44 w-44 rounded-full bg-[#E3D0C5]/75 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-[#D1DFD3]/80 blur-2xl" />

      {/* BRAND HEADER */}
      <div className="relative z-10 px-5 pt-6 pb-4">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="flex items-center gap-3 group text-left w-full"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E0EC] border border-[#D2CADB] text-lg shadow-2xs group-hover:scale-105 transition-transform duration-200">
            🌷
          </div>
          <div>
            <h1 className="font-caveat text-2xl font-bold tracking-wider text-[#34323A] leading-none">
              LUMI
            </h1>
            <p className="mt-1 text-[11px] font-semibold text-[#706C72] tracking-wide font-sans">
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
                  ? `${item.activeBg} ${item.activeBorder} text-[#34323A] shadow-2xs font-bold`
                  : "border-transparent text-[#706C72] hover:bg-[#F8F5F2] hover:text-[#34323A] hover:shadow-2xs"
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
                    : `${item.colorClass} opacity-80 group-hover:opacity-100`
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
      <div className="relative z-10 border-t border-[#DDD8D1] px-3 py-3">
        <div className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#8E8A90]">
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
                    ? `${item.activeBg} ${item.activeBorder} text-[#34323A] font-bold`
                    : "border-transparent text-[#706C72] hover:bg-[#F8F5F2] hover:text-[#34323A]"
                }`}
              >
                <span
                  className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? item.colorClass : `${item.colorClass} opacity-80 group-hover:opacity-100`
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
      <div className="relative z-10 border-t border-[#DDD8D1] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F2] p-2.5 border border-[#DDD8D1] shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCE6DE] text-[#668C72] font-bold text-xs">
            S
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#34323A]">Shru</p>
            <p className="truncate text-[10px] text-[#706C72]">College Life OS</p>
          </div>
          <Sparkles size={14} className="text-[#8E8A90]" />
        </div>
      </div>
    </aside>
  );
}