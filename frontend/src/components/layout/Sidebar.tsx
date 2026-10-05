import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  CalendarDays,
  Flame,
  FolderKanban,
  PenLine,
  BookOpen,
  Music,
  Heart,
  Users,
  Sparkles,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";
import { LumiButterfly } from "../common/LumiButterfly";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCreate?: () => void;
  onOpenSearch?: () => void;
}

interface NavItemConfig {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: string;
}

const PRIMARY_NAV: NavItemConfig[] = [
  { icon: <Home size={17} strokeWidth={1.9} />, label: "Home", path: "/dashboard" },
  { icon: <CalendarDays size={17} strokeWidth={1.9} />, label: "Plan", path: "/plan" },
  { icon: <FolderKanban size={17} strokeWidth={1.9} />, label: "Workspace", path: "/workspace" },
  { icon: <PenLine size={17} strokeWidth={1.9} />, label: "Journal", path: "/journal" },
  { icon: <Flame size={17} strokeWidth={1.9} />, label: "Habits", path: "/habits" },
  { icon: <BookOpen size={17} strokeWidth={1.9} />, label: "Reading", path: "/reading" },
  { icon: <Music size={17} strokeWidth={1.9} />, label: "Music", path: "/music" },
  { icon: <Heart size={17} strokeWidth={1.9} />, label: "Memories", path: "/memories" },
  { icon: <Users size={17} strokeWidth={1.9} />, label: "Friends", path: "/friends" },
];

export function Sidebar({
  currentPath,
  onNavigate,
  onOpenCreate,
  onOpenSearch,
}: SidebarProps) {
  const [profile, setProfile] = useState<{ displayName: string; username: string; avatarUrl?: string }>(() => {
    try {
      const saved = localStorage.getItem("lumi_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { displayName: "Shru", username: "shru.lumi" };
  });

  useEffect(() => {
    function handleProfileSync(e: Event) {
      const customEvent = e as CustomEvent<{ displayName: string; username: string; avatarUrl?: string }>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      }
    }
    window.addEventListener("lumi-profile-change" as any, handleProfileSync);
    return () => window.removeEventListener("lumi-profile-change" as any, handleProfileSync);
  }, []);
  return (
    <aside className="relative hidden w-64 shrink-0 border-r border-[#E8E3F0] bg-white/80 backdrop-blur-xl md:flex md:flex-col min-h-screen select-none z-20 shadow-[0_4px_24px_rgba(80,70,120,0.04)] overflow-hidden">
      {/* Subtle Pastel Ambient Glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-[#EEEAFE]/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-12 h-40 w-40 rounded-full bg-[#F8E8F0]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[#EEF3FA]/60 blur-3xl" />

      {/* BRAND HEADER & LOGO */}
      <div className="relative z-10 px-5 pt-6 pb-3">
        <button
          type="button"
          onClick={() => onNavigate("/dashboard")}
          className="flex items-center gap-3 group text-left w-full cursor-pointer select-none"
        >
          <div className="lumi-logo-container flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DCD8F2] to-[#F2D8E4] border border-white shadow-[0_4px_12px_rgba(184,179,232,0.3)] group-hover:scale-105 transition-transform duration-200">
            <LumiButterfly size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#17151C] leading-none group-hover:text-[#9E96D8] transition-colors">
              LUMI
            </h1>
            <p className="mt-1 text-[10px] font-semibold tracking-widest text-[#8D8792] uppercase">
              Personal Life OS
            </p>
          </div>
        </button>

        {/* UNIVERSAL CREATE TRIGGER BUTTON */}
        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17151C] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          <Plus size={16} />
          <span>Create</span>
        </button>

        {/* Search / Command Trigger */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="mt-2 flex w-full items-center justify-between rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] px-3 py-2 text-xs text-[#8D8792] hover:border-[#9E96D8]/50 hover:bg-white transition cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2 font-medium">
              <Sparkles size={13} className="text-[#9E96D8]" />
              <span>Quick Search</span>
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
          Navigation
        </div>
        {PRIMARY_NAV.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path === "/plan" && (currentPath === "/tasks" || currentPath === "/planner")) ||
            (item.path === "/workspace" && (currentPath === "/notes" || currentPath === "/projects")) ||
            (item.path === "/journal" && (currentPath === "/diary" || currentPath === "/reflection"));

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

      {/* USER PROFILE FOOTER */}
      <div className="relative z-10 border-t border-[#E8E3F0] p-3.5">
        <div
          className={`flex w-full items-center justify-between gap-2.5 rounded-2xl p-2.5 border transition text-left ${
            currentPath === "/profile" || currentPath === "/settings"
              ? "bg-[#EEEAFE] border-[#DDD8F2] shadow-2xs"
              : "bg-white/90 border-[#E8E3F0] hover:bg-white hover:border-[#DDD8F2] shadow-2xs"
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate("/profile")}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            title="View Profile"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#DCD8F2] to-[#EEF3FA] text-[#17151C] font-bold text-xs border border-white shadow-2xs shrink-0 overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "S"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-[#17151C]">{profile.displayName || "Shru"}</p>
              <p className="truncate text-[10px] text-[#8D8792]">@{profile.username || "shru.lumi"}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/settings")}
            className="text-[#8D8792] hover:text-[#17151C] p-1.5 rounded-lg hover:bg-white/80 transition cursor-pointer"
            title="Settings & Themes"
          >
            <Settings size={14} className={currentPath === "/settings" ? "text-[#9E96D8]" : ""} />
          </button>
        </div>
      </div>
    </aside>
  );
}