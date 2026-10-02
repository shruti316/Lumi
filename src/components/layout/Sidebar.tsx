import {
  BookOpen,
  CalendarDays,
  FileText,
  Flame,
  FolderKanban,
  Heart,
  Home,
  Lightbulb,
  PenLine,
  Target,
  Brain,
} from "lucide-react";
import type { ReactNode } from "react";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({
  currentPath,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#f1e5eb] bg-[#fffafd] md:flex md:flex-col">
      {/* LOGO */}

      <div className="px-6 pb-6 pt-7">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c8dc] via-[#eadcff] to-[#ffe3cf] text-xl shadow-sm">
            🌷
          </div>

          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight text-[#3f3340]">
              Lumi
            </h1>

            <p className="text-[11px] font-medium text-[#a18f99]">
              your little life space
            </p>
          </div>
        </button>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        {/* MAIN */}

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b6a7af]">
            Main
          </p>

          <NavItem
            icon={<Home size={18} />}
            label="Home"
            path="/"
            currentPath={currentPath}
            onNavigate={onNavigate}
          />

          <NavItem
            icon={<CalendarDays size={18} />}
            label="Planner"
            path="/planner"
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        </div>

        {/* LIFE */}

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b6a7af]">
            Life
          </p>

          <NavItem
            icon={<Flame size={18} />}
            label="Habits"
            path="/habits"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#78a887]"
          />

          <NavItem
            icon={<Target size={18} />}
            label="Goals"
            path="/goals"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#8d7ad9]"
          />

          <NavItem
            icon={<FolderKanban size={18} />}
            label="Projects"
            path="/projects"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#d89561]"
          />
        </div>

        {/* LIBRARY */}

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b6a7af]">
            Library
          </p>

          <NavItem
            icon={<BookOpen size={18} />}
            label="Reading"
            path="/reading"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#8d7ad9]"
          />

          <NavItem
            icon={<FileText size={18} />}
            label="Notes"
            path="/notes"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#6fa4b8]"
          />
        </div>

        {/* THINK */}

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b6a7af]">
            Think
          </p>

          <NavItem
            icon={<Brain size={18} />}
            label="Brain Dump"
            path="/brain-dump"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#9a82c7]"
          />

          <NavItem
            icon={<Lightbulb size={18} />}
            label="Reflection"
            path="/reflection"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#d7a74e]"
          />
        </div>

        {/* PERSONAL */}

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b6a7af]">
            Personal
          </p>

          <NavItem
            icon={<Heart size={18} />}
            label="Memories"
            path="/memories"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#d85d91]"
          />

          <NavItem
            icon={<PenLine size={18} />}
            label="Diary"
            path="/diary"
            currentPath={currentPath}
            onNavigate={onNavigate}
            iconClassName="text-[#d89561]"
          />
        </div>
      </nav>

      {/* BOTTOM MESSAGE */}

      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#fce7f3] via-[#f3eaff] to-[#fff0e3] p-4">
          <div className="mb-2 text-lg">🌷</div>

          <p className="text-sm font-semibold text-[#4c3e48]">
            Take it one day at a time.
          </p>

          <p className="mt-1 text-xs leading-5 text-[#8f7d88]">
            Lumi is here to help you keep track of the little things.
          </p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  path,
  currentPath,
  onNavigate,
  iconClassName = "",
}: {
  icon: ReactNode;
  label: string;
  path: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  iconClassName?: string;
}) {
  const isActive = currentPath === path;

  return (
    <button
      type="button"
      onClick={() => onNavigate(path)}
      className={`group mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-[#fce7f3] text-[#d85d91] shadow-sm"
          : "text-[#756671] hover:bg-white hover:text-[#4c3e48] hover:shadow-sm"
      }`}
    >
      <span
        className={`transition-transform duration-200 group-hover:scale-110 ${
          isActive ? "text-[#d85d91]" : iconClassName
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}