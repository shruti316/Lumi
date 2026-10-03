import {
  BookOpen,
  CalendarDays,
  Home,
  Leaf,
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
    icon: Leaf,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#DDD8D1] bg-[#FAF7F4]/95 px-3 py-2 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-[#E5E0EC] text-[#786A9B] font-bold"
                  : "text-[#706C72] hover:text-[#34323A]"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}