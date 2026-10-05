import {
  Home,
  CalendarDays,
  Users,
  Plus,
  Flame,
  FolderKanban,
  PenLine,
  BookOpen,
  Music,
  Heart,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCreate: () => void;
}

const MORE_SECTIONS = [
  { label: "Workspace", path: "/workspace", icon: FolderKanban, desc: "Notes & Projects" },
  { label: "Journal", path: "/journal", icon: PenLine, desc: "Diary & Reflections" },
  { label: "Habits", path: "/habits", icon: Flame, desc: "Routines & Streaks" },
  { label: "Reading", path: "/reading", icon: BookOpen, desc: "Books & Library" },
  { label: "Music", path: "/music", icon: Music, desc: "Spotify & Playlists" },
  { label: "Memories", path: "/memories", icon: Heart, desc: "Photo Moments" },
  { label: "My Profile", path: "/profile", icon: User, desc: "@username & Identity" },
  { label: "Settings", path: "/settings", icon: Settings, desc: "Themes & Privacy" },
];

export function MobileNav({
  currentPath,
  onNavigate,
  onOpenCreate,
}: MobileNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {/* MORE SPACES FLYOUT SHEET */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#17151C]/50 backdrop-blur-xs md:hidden"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl border-t border-[#E8E3F0] bg-white p-5 shadow-2xl lumi-animate-fade-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#DDD8F2]" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E3F0]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#17151C]">
                  All LUMI Spaces
                </h3>
                <p className="text-[11px] text-[#8D8792]">
                  Explore all your life tools & settings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="rounded-full p-1.5 text-[#8D8792] hover:bg-[#FAF8FC] cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MORE_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = currentPath === sec.path;
                return (
                  <button
                    key={sec.label + sec.path}
                    type="button"
                    onClick={() => {
                      onNavigate(sec.path);
                      setIsMoreOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition cursor-pointer ${
                      isActive
                        ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs"
                        : "bg-[#FAF8FC] border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-[#DCD8F2] text-[#17151C]"
                          : "bg-white text-[#8D8792] border border-[#E8E3F0]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-[#17151C]">
                        {sec.label}
                      </p>
                      <p className="text-[10px] text-[#8D8792] truncate">
                        {sec.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR: Home | Plan | + Create | Friends | More */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E3F0] bg-white/95 px-3 py-1.5 backdrop-blur-xl md:hidden shadow-[0_-4px_24px_rgba(80,70,120,0.08)]">
        <div className="flex items-center justify-around relative">
          {/* 1. HOME */}
          <button
            type="button"
            onClick={() => onNavigate("/dashboard")}
            className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition cursor-pointer ${
              currentPath === "/dashboard"
                ? "text-[#17151C] font-semibold"
                : "text-[#8D8792] hover:text-[#17151C]"
            }`}
          >
            <Home
              size={18}
              className={currentPath === "/dashboard" ? "text-[#9E96D8]" : "text-[#8D8792]"}
            />
            <span>Home</span>
          </button>

          {/* 2. PLAN */}
          <button
            type="button"
            onClick={() => onNavigate("/plan")}
            className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition cursor-pointer ${
              currentPath === "/plan" || currentPath === "/tasks" || currentPath === "/planner"
                ? "text-[#17151C] font-semibold"
                : "text-[#8D8792] hover:text-[#17151C]"
            }`}
          >
            <CalendarDays
              size={18}
              className={
                currentPath === "/plan" || currentPath === "/tasks" || currentPath === "/planner"
                  ? "text-[#9E96D8]"
                  : "text-[#8D8792]"
              }
            />
            <span>Plan</span>
          </button>

          {/* 3. CENTER PROMINENT FLOATING + CREATE BUTTON */}
          <div className="relative -top-4 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenCreate}
              aria-label="Create item"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#17151C] text-white shadow-[0_8px_20px_rgba(23,21,28,0.28)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-[#F7F5F8]"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#9E96D8]/20 to-[#E8B9CD]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus size={22} className="relative z-10 transition-transform group-hover:rotate-90 duration-300" />
            </button>
          </div>

          {/* 4. FRIENDS */}
          <button
            type="button"
            onClick={() => onNavigate("/friends")}
            className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition cursor-pointer ${
              currentPath === "/friends"
                ? "text-[#17151C] font-semibold"
                : "text-[#8D8792] hover:text-[#17151C]"
            }`}
          >
            <Users
              size={18}
              className={currentPath === "/friends" ? "text-[#9E96D8]" : "text-[#8D8792]"}
            />
            <span>Friends</span>
          </button>

          {/* 5. MORE */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition cursor-pointer ${
              isMoreOpen ||
              currentPath === "/calendar" ||
              currentPath === "/workspace" ||
              currentPath === "/goals" ||
              currentPath === "/journal" ||
              currentPath === "/reading" ||
              currentPath === "/music" ||
              currentPath === "/memories" ||
              currentPath === "/habits" ||
              currentPath === "/settings"
                ? "text-[#17151C] font-semibold"
                : "text-[#8D8792] hover:text-[#17151C]"
            }`}
            aria-label="More spaces"
          >
            <Menu
              size={18}
              className={
                isMoreOpen ||
                currentPath === "/calendar" ||
                currentPath === "/workspace" ||
                currentPath === "/goals" ||
                currentPath === "/journal" ||
                currentPath === "/reading" ||
                currentPath === "/music" ||
                currentPath === "/memories" ||
                currentPath === "/habits" ||
                currentPath === "/settings"
                  ? "text-[#9E96D8]"
                  : "text-[#8D8792]"
              }
            />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}