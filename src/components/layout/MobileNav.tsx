import {
  CalendarDays,
  Home,
  Leaf,
  PenLine,
  Sparkles,
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
    label: "Mood",
    path: "/mood",
    icon: Sparkles,
  },
  {
    label: "Habits",
    path: "/habits",
    icon: Leaf,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#f1e5ec] bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] transition ${
                isActive
                  ? "text-[#d85d91]"
                  : "text-[#8f7f8b]"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}