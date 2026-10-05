import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
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
  Clock,
  GraduationCap,
  Music,
  Plus,
  ArrowRight,
  Sparkles,
  Command,
  Settings as SettingsIcon,
  Users,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Actions";
  icon: React.ReactNode;
  path: string;
  keywords?: string[];
}

const COMMANDS: CommandItem[] = [
  // Navigation
  {
    id: "nav-dashboard",
    title: "Dashboard",
    category: "Navigation",
    icon: <Home size={16} className="text-[#9E96D8]" />,
    path: "/dashboard",
    keywords: ["home", "main", "overview"],
  },
  {
    id: "nav-planner",
    title: "Planner & Timeline",
    category: "Navigation",
    icon: <CalendarDays size={16} className="text-[#B8D4E8]" />,
    path: "/planner",
    keywords: ["schedule", "routine", "time"],
  },
  {
    id: "nav-tasks",
    title: "Tasks & To-Dos",
    category: "Navigation",
    icon: <CheckSquare size={16} className="text-[#9E96D8]" />,
    path: "/tasks",
    keywords: ["checklist", "todos", "action"],
  },
  {
    id: "nav-habits",
    title: "Habit Tracker",
    category: "Navigation",
    icon: <Flame size={16} className="text-[#D99BB8]" />,
    path: "/habits",
    keywords: ["routine", "streak", "daily"],
  },
  {
    id: "nav-goals",
    title: "Life Goals",
    category: "Navigation",
    icon: <Target size={16} className="text-[#6B8EA8]" />,
    path: "/goals",
    keywords: ["milestones", "targets", "ambitions"],
  },
  {
    id: "nav-projects",
    title: "Projects & Sprints",
    category: "Navigation",
    icon: <FolderKanban size={16} className="text-[#9E96D8]" />,
    path: "/projects",
    keywords: ["work", "milestone", "build"],
  },
  {
    id: "nav-reading",
    title: "Reading Sanctuary",
    category: "Navigation",
    icon: <BookOpen size={16} className="text-[#6B8EA8]" />,
    path: "/reading",
    keywords: ["books", "library", "pages"],
  },
  {
    id: "nav-notes",
    title: "Notes & Ideas",
    category: "Navigation",
    icon: <FileText size={16} className="text-[#9E96D8]" />,
    path: "/notes",
    keywords: ["memo", "writing", "docs"],
  },
  {
    id: "nav-diary",
    title: "Personal Diary",
    category: "Navigation",
    icon: <PenLine size={16} className="text-[#D99BB8]" />,
    path: "/diary",
    keywords: ["journal", "thoughts", "reflection"],
  },
  {
    id: "nav-memories",
    title: "Photo Memories",
    category: "Navigation",
    icon: <Heart size={16} className="text-[#E8B9CD]" />,
    path: "/memories",
    keywords: ["scrapbook", "photos", "moments"],
  },
  {
    id: "nav-braindump",
    title: "Brain Dump",
    category: "Navigation",
    icon: <Brain size={16} className="text-[#9E96D8]" />,
    path: "/brain-dump",
    keywords: ["stream", "raw", "dump"],
  },
  {
    id: "nav-reflection",
    title: "Weekly Reflection",
    category: "Navigation",
    icon: <Lightbulb size={16} className="text-[#F1D2C9]" />,
    path: "/reflection",
    keywords: ["retrospective", "review", "mind"],
  },
  {
    id: "nav-calendar",
    title: "Calendar Schedule",
    category: "Navigation",
    icon: <Calendar size={16} className="text-[#B8D4E8]" />,
    path: "/calendar",
    keywords: ["events", "dates", "schedule"],
  },
  {
    id: "nav-focus",
    title: "Study & Focus Studio",
    category: "Navigation",
    icon: <Clock size={16} className="text-[#9E96D8]" />,
    path: "/focus",
    keywords: ["pomodoro", "timer", "deep work"],
  },
  {
    id: "nav-exams",
    title: "Exams & Tests",
    category: "Navigation",
    icon: <GraduationCap size={16} className="text-[#6B8EA8]" />,
    path: "/exams",
    keywords: ["midterms", "finals", "syllabus"],
  },
  {
    id: "nav-music",
    title: "Music Room",
    category: "Navigation",
    icon: <Music size={16} className="text-[#D99BB8]" />,
    path: "/music",
    keywords: ["spotify", "audio", "vibes"],
  },
  {
    id: "nav-plan",
    title: "Plan & Schedule",
    category: "Navigation",
    icon: <CalendarDays size={16} className="text-[#9E96D8]" />,
    path: "/plan",
    keywords: ["plan", "tasks", "planner", "schedule", "todos"],
  },
  {
    id: "nav-workspace",
    title: "Workspace & Studio",
    category: "Navigation",
    icon: <FolderKanban size={16} className="text-[#9E96D8]" />,
    path: "/workspace",
    keywords: ["notes", "projects", "studio", "knowledge", "docs"],
  },
  {
    id: "nav-journal",
    title: "Journal & Reflections",
    category: "Navigation",
    icon: <PenLine size={16} className="text-[#D99BB8]" />,
    path: "/journal",
    keywords: ["journal", "diary", "reflection", "gratitude", "entry"],
  },
  {
    id: "nav-friends",
    title: "Friends & Shared Moments",
    category: "Navigation",
    icon: <Users size={16} className="text-[#9E96D8]" />,
    path: "/friends",
    keywords: ["friends", "moments", "social", "requests", "circle"],
  },
  {
    id: "nav-profile",
    title: "My LUMI Profile & @username",
    category: "Navigation",
    icon: <SettingsIcon size={16} className="text-[#D99BB8]" />,
    path: "/profile",
    keywords: ["profile", "persona", "username", "handle", "shru.lumi"],
  },
  {
    id: "nav-settings",
    title: "Settings & Appearance Themes",
    category: "Navigation",
    icon: <SettingsIcon size={16} className="text-[#9E96D8]" />,
    path: "/settings",
    keywords: ["settings", "appearance", "dark theme", "mist", "light", "profile", "theme", "privacy", "integrations"],
  },

  // Quick Actions
  {
    id: "action-task",
    title: "New Task",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/tasks",
    keywords: ["add task", "create todo"],
  },
  {
    id: "action-note",
    title: "New Note",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/notes",
    keywords: ["add note", "create document"],
  },
  {
    id: "action-diary",
    title: "New Diary Entry",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/diary",
    keywords: ["write journal", "log mood"],
  },
  {
    id: "action-memory",
    title: "Add Photo Memory",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/memories",
    keywords: ["upload image", "new memory"],
  },
  {
    id: "action-book",
    title: "Add Book to Library",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/reading",
    keywords: ["new book", "add reading"],
  },
  {
    id: "action-focus",
    title: "Start Focus Sprint",
    category: "Quick Actions",
    icon: <Clock size={16} className="text-[#17151C]" />,
    path: "/focus",
    keywords: ["start pomodoro", "deep work session"],
  },
  {
    id: "action-braindump",
    title: "New Brain Dump",
    category: "Quick Actions",
    icon: <Brain size={16} className="text-[#17151C]" />,
    path: "/brain-dump",
    keywords: ["quick thought", "stream of consciousness"],
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands
  const filteredCommands = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = cmd.title.toLowerCase().includes(q);
    const categoryMatch = cmd.category.toLowerCase().includes(q);
    const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
    return titleMatch || categoryMatch || keywordMatch;
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          navigate(filteredCommands[selectedIndex].path);
          onClose();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group commands by category
  const navigationItems = filteredCommands.filter(
    (c) => c.category === "Navigation"
  );
  const actionItems = filteredCommands.filter(
    (c) => c.category === "Quick Actions"
  );

  let currentIndexTracker = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:pt-24 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17151C]/35 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-[#E8E3F0] bg-white/95 shadow-[0_24px_50px_rgba(80,70,120,0.16)] backdrop-blur-2xl animate-lumi-fade-up">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#E8E3F0] px-4 py-3.5 sm:px-5">
          <Search size={18} className="text-[#9E96D8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search LUMI workspace or quick action..."
            className="w-full bg-transparent text-sm font-medium text-[#17151C] outline-none placeholder-[#8D8792]"
            aria-label="Command Palette Search"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-[#DDD8F2] bg-[#EEEAFE] px-2 py-0.5 text-[10px] font-semibold text-[#6B5BA5]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2.5 sm:p-3 scrollbar-thin"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8D8792]">
              <Sparkles size={18} className="mx-auto mb-2 text-[#9E96D8]" />
              <p>No matching commands found for "{query}"</p>
            </div>
          ) : (
            <>
              {/* Quick Actions Group */}
              {actionItems.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
                    Quick Actions
                  </div>
                  {actionItems.map((item) => {
                    const itemIndex = currentIndexTracker++;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={itemIndex}
                        onClick={() => {
                          navigate(item.path);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition cursor-pointer ${
                          isSelected
                            ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2] shadow-2xs"
                            : "text-[#5F5965] hover:bg-white font-medium border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs border border-[#E8E3F0]">
                            {item.icon}
                          </div>
                          <span>{item.title}</span>
                        </div>
                        <span className="text-[11px] text-[#9E96D8] font-medium flex items-center gap-1">
                          Action <ArrowRight size={12} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Navigation Group */}
              {navigationItems.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
                    Navigation
                  </div>
                  {navigationItems.map((item) => {
                    const itemIndex = currentIndexTracker++;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-index={itemIndex}
                        onClick={() => {
                          navigate(item.path);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition cursor-pointer ${
                          isSelected
                            ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2] shadow-2xs"
                            : "text-[#5F5965] hover:bg-white font-medium border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs border border-[#E8E3F0]">
                            {item.icon}
                          </div>
                          <span>{item.title}</span>
                        </div>
                        <span className="text-[10px] text-[#8D8792]">Jump to page</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-[#E8E3F0] bg-[#FAF8FC] px-4 py-2.5 text-[11px] text-[#8D8792]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white border border-[#E8E3F0] px-1.5 py-0.5 text-[10px] font-semibold shadow-2xs">↑</kbd>
              <kbd className="rounded bg-white border border-[#E8E3F0] px-1.5 py-0.5 text-[10px] font-semibold shadow-2xs">↓</kbd>
              <span className="text-[10px]">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white border border-[#E8E3F0] px-1.5 py-0.5 text-[10px] font-semibold shadow-2xs">↵</kbd>
              <span className="text-[10px]">Open</span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-[#9E96D8] font-semibold">
            <Command size={11} /> LUMI Command
          </span>
        </div>
      </div>
    </div>
  );
};
