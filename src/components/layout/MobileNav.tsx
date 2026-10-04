import {
  BookOpen,
  CalendarDays,
  Home,
  Flame,
  PenLine,
} from "lucide-react";

const navigation = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Planner",
    path: "/planner",
    icon: CalendarDays,
  },
  {
    label: "Diary",
    path: "/diary",
    icon: PenLine,
  },
  {
    label: "Habits",
    path: "/habits",
    icon: Flame,
  },
  {
    label: "Reading",
    path: "/reading",
    icon: BookOpen,
  },
];

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function MobileNav({
  currentPath,
  onNavigate,
}: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E3F0] bg-white/90 px-3 py-2 backdrop-blur-xl md:hidden shadow-[0_-4px_20px_rgba(80,70,120,0.06)]">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition cursor-pointer ${
                isActive
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] font-semibold shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? "text-[#9E96D8]" : "text-[#8D8792]"} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}