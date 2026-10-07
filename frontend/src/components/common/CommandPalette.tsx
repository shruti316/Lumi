import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../lib/api";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ReactNode;
  path: string;
  keywords?: string[];
  badge?: string;
  badgeColor?: string;
}

const STATIC_COMMANDS: CommandItem[] = [
  // Navigation
  {
    id: "nav-dashboard",
    title: "Dashboard",
    subtitle: "Daily overview, metrics & focus",
    category: "Navigation",
    icon: <Home size={16} className="text-[#9E96D8]" />,
    path: "/dashboard",
    keywords: ["home", "main", "overview", "today"],
  },
  {
    id: "nav-plan",
    title: "Plan & Schedule",
    subtitle: "Today's agenda & tasks",
    category: "Navigation",
    icon: <CalendarDays size={16} className="text-[#9E96D8]" />,
    path: "/plan",
    keywords: ["plan", "tasks", "planner", "schedule", "todos"],
  },
  {
    id: "nav-planner",
    title: "Planner & Timeline",
    subtitle: "Timeline, schedule & routine",
    category: "Navigation",
    icon: <CalendarDays size={16} className="text-[#B8D4E8]" />,
    path: "/planner",
    keywords: ["schedule", "routine", "time"],
  },
  {
    id: "nav-tasks",
    title: "Tasks & To-Dos",
    subtitle: "Checklists & task priority",
    category: "Navigation",
    icon: <CheckSquare size={16} className="text-[#9E96D8]" />,
    path: "/tasks",
    keywords: ["checklist", "todos", "action", "task"],
  },
  {
    id: "nav-habits",
    title: "Habit Tracker",
    subtitle: "Daily streaks & routines",
    category: "Navigation",
    icon: <Flame size={16} className="text-[#E07A5F]" />,
    path: "/habits",
    keywords: ["routine", "streak", "daily", "habit"],
  },
  {
    id: "nav-goals",
    title: "Life Goals",
    subtitle: "Milestones, ambitions & roadmap",
    category: "Navigation",
    icon: <Target size={16} className="text-[#6B8EA8]" />,
    path: "/goals",
    keywords: ["milestones", "targets", "ambitions", "goal"],
  },
  {
    id: "nav-workspace",
    title: "Workspace & Studio",
    subtitle: "Notes, docs & active projects",
    category: "Navigation",
    icon: <FolderKanban size={16} className="text-[#9E96D8]" />,
    path: "/workspace",
    keywords: ["notes", "projects", "studio", "knowledge", "docs", "workspace"],
  },
  {
    id: "nav-projects",
    title: "Projects & Sprints",
    subtitle: "Project tracker & subtasks",
    category: "Navigation",
    icon: <FolderKanban size={16} className="text-[#9E96D8]" />,
    path: "/projects",
    keywords: ["work", "milestone", "build", "project"],
  },
  {
    id: "nav-notes",
    title: "Notes & Documents",
    subtitle: "Ideas, reference & memos",
    category: "Navigation",
    icon: <FileText size={16} className="text-[#9E96D8]" />,
    path: "/notes",
    keywords: ["memo", "writing", "docs", "note"],
  },
  {
    id: "nav-reading",
    title: "Reading Sanctuary",
    subtitle: "Book tracker & reading progress",
    category: "Navigation",
    icon: <BookOpen size={16} className="text-[#D99BB8]" />,
    path: "/reading",
    keywords: ["books", "library", "pages", "reading", "read"],
  },
  {
    id: "nav-journal",
    title: "Journal & Reflections",
    subtitle: "Gratitude & daily reflections",
    category: "Navigation",
    icon: <PenLine size={16} className="text-[#D99BB8]" />,
    path: "/journal",
    keywords: ["journal", "reflection", "gratitude", "entry"],
  },
  {
    id: "nav-diary",
    title: "Personal Diary",
    subtitle: "Daily thoughts & private entries",
    category: "Navigation",
    icon: <PenLine size={16} className="text-[#D99BB8]" />,
    path: "/diary",
    keywords: ["diary", "thoughts", "mood"],
  },
  {
    id: "nav-memories",
    title: "Photo Memories",
    subtitle: "Scrapbook & captured moments",
    category: "Navigation",
    icon: <Heart size={16} className="text-[#E8B9CD]" />,
    path: "/memories",
    keywords: ["scrapbook", "photos", "moments", "memory", "memories"],
  },
  {
    id: "nav-friends",
    title: "Friends & Feed",
    subtitle: "Shared memories & friend circle",
    category: "Navigation",
    icon: <Users size={16} className="text-[#9E96D8]" />,
    path: "/friends",
    keywords: ["friends", "moments", "social", "requests", "circle"],
  },
  {
    id: "nav-calendar",
    title: "Calendar Schedule",
    subtitle: "Time blocking & events",
    category: "Navigation",
    icon: <Calendar size={16} className="text-[#B8D4E8]" />,
    path: "/calendar",
    keywords: ["events", "dates", "schedule", "calendar"],
  },
  {
    id: "nav-focus",
    title: "Study & Focus Studio",
    subtitle: "Pomodoro timer & deep work",
    category: "Navigation",
    icon: <Clock size={16} className="text-[#9E96D8]" />,
    path: "/focus",
    keywords: ["pomodoro", "timer", "deep work", "focus"],
  },
  {
    id: "nav-music",
    title: "Music Room",
    subtitle: "Soundscapes & focus playlists",
    category: "Navigation",
    icon: <Music size={16} className="text-[#D99BB8]" />,
    path: "/music",
    keywords: ["spotify", "audio", "vibes", "music"],
  },
  {
    id: "nav-braindump",
    title: "Brain Dump",
    subtitle: "Unstructured thought capture",
    category: "Navigation",
    icon: <Brain size={16} className="text-[#9E96D8]" />,
    path: "/brain-dump",
    keywords: ["stream", "raw", "dump", "braindump"],
  },
  {
    id: "nav-reflection",
    title: "Weekly Reflection",
    subtitle: "Mindful review & retrospectives",
    category: "Navigation",
    icon: <Lightbulb size={16} className="text-[#F1D2C9]" />,
    path: "/reflection",
    keywords: ["retrospective", "review", "mind"],
  },
  {
    id: "nav-exams",
    title: "Exams & Midterms",
    subtitle: "Course exams & syllabus prep",
    category: "Navigation",
    icon: <GraduationCap size={16} className="text-[#6B8EA8]" />,
    path: "/exams",
    keywords: ["midterms", "finals", "syllabus", "exams", "tests"],
  },
  {
    id: "nav-profile",
    title: "My Profile",
    subtitle: "Personal bio, goals & identity",
    category: "Navigation",
    icon: <SettingsIcon size={16} className="text-[#D99BB8]" />,
    path: "/profile",
    keywords: ["profile", "persona", "username", "handle"],
  },
  {
    id: "nav-settings",
    title: "Settings & Appearance",
    subtitle: "Themes, privacy & data preferences",
    category: "Navigation",
    icon: <SettingsIcon size={16} className="text-[#9E96D8]" />,
    path: "/settings",
    keywords: ["settings", "appearance", "dark theme", "mist", "light", "profile", "theme", "privacy", "integrations"],
  },

  // Quick Actions
  {
    id: "action-task",
    title: "New Task",
    subtitle: "Add an action item",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/tasks",
    keywords: ["add task", "create todo", "new task"],
  },
  {
    id: "action-note",
    title: "New Note",
    subtitle: "Write a document or note",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/notes",
    keywords: ["add note", "create document", "new note"],
  },
  {
    id: "action-diary",
    title: "New Journal Entry",
    subtitle: "Write today's reflection",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/journal",
    keywords: ["write journal", "log mood", "new diary", "reflection"],
  },
  {
    id: "action-memory",
    title: "Add Photo Memory",
    subtitle: "Preserve a special photo moment",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/memories",
    keywords: ["upload image", "new memory", "photo"],
  },
  {
    id: "action-book",
    title: "Add Book to Reading",
    subtitle: "Track a new book",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/reading",
    keywords: ["new book", "add reading", "library"],
  },
  {
    id: "action-goal",
    title: "Set Life Goal",
    subtitle: "Create a target or milestone",
    category: "Quick Actions",
    icon: <Plus size={16} className="text-[#17151C]" />,
    path: "/goals",
    keywords: ["new goal", "target", "milestone"],
  },
  {
    id: "action-focus",
    title: "Start Focus Sprint",
    subtitle: "Launch 25-minute Pomodoro timer",
    category: "Quick Actions",
    icon: <Clock size={16} className="text-[#17151C]" />,
    path: "/focus",
    keywords: ["start pomodoro", "deep work session", "focus timer"],
  },
  {
    id: "action-braindump",
    title: "Quick Brain Dump",
    subtitle: "Stream of consciousness capture",
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Live Backend Data Stores
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevQueryRef = useRef(query);

  // Fetch live user data from authenticated backend API
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [
        tasksRes,
        notesRes,
        projectsRes,
        goalsRes,
        habitsRes,
        booksRes,
        journalsRes,
        memoriesRes,
      ] = await Promise.allSettled([
        api.tasks.getAll(),
        api.workspace.getNotes(),
        api.workspace.getProjects(),
        api.goals.getAll(),
        api.habits.getAll(),
        api.reading.getAll(),
        api.journals.getAll(),
        api.memories.getAll(),
      ]);

      if (tasksRes.status === "fulfilled" && tasksRes.value.data?.tasks) {
        setTasks(tasksRes.value.data.tasks);
      }
      if (notesRes.status === "fulfilled" && notesRes.value.data?.notes) {
        setNotes(notesRes.value.data.notes);
      }
      if (projectsRes.status === "fulfilled" && projectsRes.value.data?.projects) {
        setProjects(projectsRes.value.data.projects);
      }
      if (goalsRes.status === "fulfilled" && goalsRes.value.data?.goals) {
        setGoals(goalsRes.value.data.goals);
      }
      if (habitsRes.status === "fulfilled" && habitsRes.value.data?.habits) {
        setHabits(habitsRes.value.data.habits);
      }
      if (booksRes.status === "fulfilled" && booksRes.value.data?.books) {
        setBooks(booksRes.value.data.books);
      }
      if (journalsRes.status === "fulfilled" && journalsRes.value.data?.journals) {
        setJournals(journalsRes.value.data.journals);
      }
      if (memoriesRes.status === "fulfilled" && memoriesRes.value.data?.memories) {
        setMemories(memoriesRes.value.data.memories);
      }
    } catch (err) {
      console.error("[CommandPalette Search] Failed to fetch live user items:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      fetchUserData();
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fetchUserData]);

  // Compute matched items
  const { groupedResults, allItems } = useMemo(() => {
    const q = query.toLowerCase().trim();

    // 1. When empty, show standard Command Palette (Quick Actions & Navigation)
    if (!q) {
      const quickActions = STATIC_COMMANDS.filter((c) => c.category === "Quick Actions");
      const navigation = STATIC_COMMANDS.filter((c) => c.category === "Navigation");

      const groups: { category: string; items: CommandItem[] }[] = [
        { category: "Quick Actions", items: quickActions },
        { category: "Navigation", items: navigation },
      ];

      return {
        groupedResults: groups,
        allItems: [...quickActions, ...navigation],
      };
    }

    // 2. When query is non-empty, search across Commands AND live User Data
    const groups: { category: string; items: CommandItem[] }[] = [];
    const collected: CommandItem[] = [];

    // Match static commands
    const matchingCommands = STATIC_COMMANDS.filter((cmd) => {
      const titleMatch = cmd.title.toLowerCase().includes(q);
      const subMatch = cmd.subtitle?.toLowerCase().includes(q);
      const categoryMatch = cmd.category.toLowerCase().includes(q);
      const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
      return titleMatch || subMatch || categoryMatch || keywordMatch;
    });

    if (matchingCommands.length > 0) {
      groups.push({ category: "Commands & Actions", items: matchingCommands });
      collected.push(...matchingCommands);
    }

    // Match Tasks
    const matchingTasks: CommandItem[] = tasks
      .filter((t) => t.title && t.title.toLowerCase().includes(q))
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        subtitle: t.dueDate ? `Due: ${t.dueDate}` : `Priority: ${t.priority || "Medium"}`,
        category: "Tasks",
        icon: <CheckSquare size={16} className={t.completed ? "text-[#528D6F]" : "text-[#9E96D8]"} />,
        path: "/plan",
        badge: t.completed ? "Done ✓" : t.priority || "Task",
        badgeColor: t.completed ? "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]" : "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2]",
      }));

    if (matchingTasks.length > 0) {
      groups.push({ category: "Tasks", items: matchingTasks });
      collected.push(...matchingTasks);
    }

    // Match Notes
    const matchingNotes: CommandItem[] = notes
      .filter((n) => {
        const titleMatch = n.title && n.title.toLowerCase().includes(q);
        const contentMatch = n.content && n.content.toLowerCase().includes(q);
        const tagMatch = Array.isArray(n.tags) && n.tags.some((tag: string) => tag.toLowerCase().includes(q));
        return titleMatch || contentMatch || tagMatch;
      })
      .map((n) => ({
        id: `note-${n.id}`,
        title: n.title || "Untitled Note",
        subtitle: n.content ? n.content.replace(/<[^>]*>?/gm, "").slice(0, 70) : (n.category || "Note"),
        category: "Notes",
        icon: <FileText size={16} className="text-[#528D6F]" />,
        path: "/notes",
        badge: n.category || "Note",
        badgeColor: "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]",
      }));

    if (matchingNotes.length > 0) {
      groups.push({ category: "Notes", items: matchingNotes });
      collected.push(...matchingNotes);
    }

    // Match Projects
    const matchingProjects: CommandItem[] = projects
      .filter((p) => {
        const nameMatch = p.name && p.name.toLowerCase().includes(q);
        const descMatch = p.description && p.description.toLowerCase().includes(q);
        const notesMatch = p.notes && p.notes.toLowerCase().includes(q);
        return nameMatch || descMatch || notesMatch;
      })
      .map((p) => ({
        id: `project-${p.id}`,
        title: p.name || "Untitled Project",
        subtitle: p.description ? p.description.slice(0, 70) : `${p.progress || 0}% progress`,
        category: "Projects",
        icon: <FolderKanban size={16} className="text-[#9E96D8]" />,
        path: "/projects",
        badge: `${p.progress || 0}%`,
        badgeColor: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2]",
      }));

    if (matchingProjects.length > 0) {
      groups.push({ category: "Projects", items: matchingProjects });
      collected.push(...matchingProjects);
    }

    // Match Goals
    const matchingGoals: CommandItem[] = goals
      .filter((g) => {
        const titleMatch = g.title && g.title.toLowerCase().includes(q);
        const descMatch = g.description && g.description.toLowerCase().includes(q);
        const catMatch = g.category && g.category.toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch;
      })
      .map((g) => ({
        id: `goal-${g.id}`,
        title: g.title,
        subtitle: g.description ? g.description.slice(0, 70) : (g.category || "Life Goal"),
        category: "Goals",
        icon: <Target size={16} className="text-[#6B8EA8]" />,
        path: "/goals",
        badge: `${g.progress || 0}%`,
        badgeColor: "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]",
      }));

    if (matchingGoals.length > 0) {
      groups.push({ category: "Goals", items: matchingGoals });
      collected.push(...matchingGoals);
    }

    // Match Habits
    const matchingHabits: CommandItem[] = habits
      .filter((h) => h.name && h.name.toLowerCase().includes(q))
      .map((h) => ({
        id: `habit-${h.id}`,
        title: h.name,
        subtitle: `${h.streak || 0} day streak`,
        category: "Habits",
        icon: <Flame size={16} className="text-[#E07A5F]" />,
        path: "/habits",
        badge: h.emoji || "🔥",
        badgeColor: "bg-[#FDF3EC] text-[#E07A5F] border-[#F1D2C9]",
      }));

    if (matchingHabits.length > 0) {
      groups.push({ category: "Habits", items: matchingHabits });
      collected.push(...matchingHabits);
    }

    // Match Reading Books
    const matchingBooks: CommandItem[] = books
      .filter((b) => {
        const titleMatch = b.title && b.title.toLowerCase().includes(q);
        const authorMatch = b.author && b.author.toLowerCase().includes(q);
        return titleMatch || authorMatch;
      })
      .map((b) => ({
        id: `book-${b.id}`,
        title: b.title,
        subtitle: `by ${b.author || "Unknown"} • ${b.currentPage || 0}/${b.totalPages || 300} pages`,
        category: "Reading",
        icon: <BookOpen size={16} className="text-[#D99BB8]" />,
        path: "/reading",
        badge: b.status === "reading" ? "Reading" : (b.status === "completed" ? "Done" : "Want to Read"),
        badgeColor: "bg-[#FDF0F6] text-[#D99BB8] border-[#F2D8E4]",
      }));

    if (matchingBooks.length > 0) {
      groups.push({ category: "Reading", items: matchingBooks });
      collected.push(...matchingBooks);
    }

    // Match Journals
    const matchingJournals: CommandItem[] = journals
      .filter((j) => {
        const titleMatch = j.title && j.title.toLowerCase().includes(q);
        const entryMatch = j.entry && j.entry.toLowerCase().includes(q);
        const gratitudeMatch = j.gratitude && j.gratitude.toLowerCase().includes(q);
        return titleMatch || entryMatch || gratitudeMatch;
      })
      .map((j) => ({
        id: `journal-${j.id}`,
        title: j.title || "Journal Entry",
        subtitle: j.entry ? j.entry.slice(0, 70) : (j.gratitude ? `Gratitude: ${j.gratitude.slice(0, 50)}` : j.date),
        category: "Journal",
        icon: <PenLine size={16} className="text-[#D99BB8]" />,
        path: "/journal",
        badge: j.mood || j.date || "Entry",
        badgeColor: "bg-[#F8E8F0] text-[#D99BB8] border-[#F2D8E4]",
      }));

    if (matchingJournals.length > 0) {
      groups.push({ category: "Journal", items: matchingJournals });
      collected.push(...matchingJournals);
    }

    // Match Memories
    const matchingMemories: CommandItem[] = memories
      .filter((m) => {
        const titleMatch = m.title && m.title.toLowerCase().includes(q);
        const descMatch = m.description && m.description.toLowerCase().includes(q);
        return titleMatch || descMatch;
      })
      .map((m) => ({
        id: `memory-${m.id}`,
        title: m.title || "Photo Memory",
        subtitle: m.description ? m.description.slice(0, 70) : "Captured memory",
        category: "Memories",
        icon: <Heart size={16} className="text-[#E8B9CD]" />,
        path: "/memories",
        badge: "Memory",
        badgeColor: "bg-[#FAF8FC] text-[#5F5965] border-[#E8E3F0]",
      }));

    if (matchingMemories.length > 0) {
      groups.push({ category: "Memories", items: matchingMemories });
      collected.push(...matchingMemories);
    }

    return {
      groupedResults: groups,
      allItems: collected,
    };
  }, [query, tasks, notes, projects, goals, habits, books, journals, memories]);

  // Safe selected index bounded by current list length
  const activeIndex = useMemo(() => {
    if (allItems.length === 0) return 0;
    // Reset to 0 when query changes
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      return 0;
    }
    return Math.min(selectedIndex, allItems.length - 1);
  }, [selectedIndex, allItems.length, query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (allItems.length > 0) {
          setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (allItems.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = allItems[activeIndex];
        if (selected) {
          navigate(selected.path);
          onClose();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, allItems, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  let globalIndexCounter = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17151C]/40 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E8E3F0] bg-white/95 text-[#17151C] shadow-[0_24px_50px_rgba(80,70,120,0.18)] backdrop-blur-2xl animate-lumi-fade-up">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#E8E3F0] px-4 py-3.5 sm:px-5">
          <Search size={18} className="text-[#9E96D8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tasks, notes, goals, books, reflections or commands..."
            className="w-full bg-transparent text-sm font-medium text-[#17151C] outline-none placeholder-[#8D8792]"
            aria-label="Command Palette Search"
          />
          {isLoading && (
            <Loader2 size={16} className="animate-spin text-[#9E96D8] shrink-0" />
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-[#DDD8F2] bg-[#EEEAFE] px-2 py-0.5 text-[10px] font-semibold text-[#6B5BA5]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-96 overflow-y-auto p-2.5 sm:p-3 scrollbar-thin space-y-3"
        >
          {hasError && (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] text-xs text-[#C53030]">
              <AlertCircle size={14} className="shrink-0" />
              <span>Some live workspace items could not be loaded. Offline mode active.</span>
            </div>
          )}

          {allItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8D8792]">
              <Sparkles size={22} className="mx-auto mb-2 text-[#9E96D8]" />
              <p className="text-sm font-serif font-bold text-[#17151C]">No matching items found</p>
              <p className="mt-1 text-xs text-[#5F5965]">We couldn't find anything matching "{query}" across your workspace.</p>
            </div>
          ) : (
            groupedResults.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
                  <span>{group.category}</span>
                  <span className="text-[9px] font-semibold opacity-70">({group.items.length})</span>
                </div>

                {group.items.map((item) => {
                  const itemIndex = globalIndexCounter++;
                  const isSelected = activeIndex === itemIndex;

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
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-xs transition cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2] shadow-2xs"
                          : "text-[#5F5965] hover:bg-[#FAF8FC] font-medium border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-[#E8E3F0]">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#17151C] truncate leading-tight">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[11px] text-[#8D8792] truncate mt-0.5 font-normal">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                              item.badgeColor || "bg-white text-[#5F5965] border-[#E8E3F0]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[11px] text-[#9E96D8] font-medium hidden sm:inline-flex items-center gap-0.5">
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
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
            <Command size={11} /> LUMI Global Search
          </span>
        </div>
      </div>
    </div>
  );
};


