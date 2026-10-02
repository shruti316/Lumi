import {
  BookOpen,
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

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-[#f1e5ec] bg-white px-5 py-6 lg:flex">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fce7f3] text-xl">
          🌷
        </div>

        <div>
          <h1 className="text-lg font-bold text-[#3f3340]">Lumi</h1>
          <p className="text-xs text-[#8f7f8b]">your little space</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#fce7f3] text-[#d85d91]"
                  : "text-[#8f7f8b] hover:bg-[#fff5f9] hover:text-[#d85d91]"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom message */}
      <div className="rounded-2xl bg-[#fff5f9] p-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={16} className="text-[#d85d91]" />
          <span className="text-sm font-semibold text-[#3f3340]">
            Little reminder
          </span>
        </div>

        <p className="text-xs leading-5 text-[#8f7f8b]">
          You don't have to do everything today. 🌷
        </p>
      </div>
    </aside>
  );
}