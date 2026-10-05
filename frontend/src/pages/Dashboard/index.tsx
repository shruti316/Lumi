import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  Plus,
  ArrowRight,
  Check,
  Flame,
  Target,
  CalendarDays,
  BookOpen,
  Headphones,
  Heart,
  Laptop,
  Dumbbell,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MoreHorizontal,
  CheckSquare,
  FileText,
  Camera,
  ExternalLink,
  FolderKanban,
  X,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { getTasks, updateTask, addTask, type Task } from "../../lib/storage";
import { getHabits, type Habit } from "../../lib/habitStorage";
import {
  getGoals,
  getMemories,
  type Goal,
  type Memory,
} from "../../lib/lifeOSStorage";
import { getBooks, type Book } from "../../lib/readingStorage";
import type { CreateTemplateType } from "../../components/common/UniversalCreateModal";

export default function Dashboard() {
  const navigate = useNavigate();

  // Data States
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const [goals, setGoals] = useState<Goal[]>(() => getGoals());
  const [books, setBooks] = useState<Book[]>(() => getBooks());
  const [memories, setMemories] = useState<Memory[]>(() => getMemories());

  // Notifications State Foundation
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "reminders" | "friends">("all");
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "DSA Assignment Due Today",
      desc: "Priority: High • Schedule for evening focus session",
      time: "15m ago",
      type: "reminders",
      unread: true,
      icon: "🎯",
    },
    {
      id: "n-2",
      title: "Maya shared a new photo memory",
      desc: '"Golden sunset at the coast" 🌅',
      time: "1h ago",
      type: "friends",
      unread: true,
      icon: "❤️",
    },
    {
      id: "n-3",
      title: "Habit Streak Reminder",
      desc: "Log your daily reading to maintain your 7-day streak!",
      time: "2h ago",
      type: "reminders",
      unread: false,
      icon: "🔥",
    },
    {
      id: "n-4",
      title: "Google Calendar Sync",
      desc: "Weekly Reflection scheduled for Sunday at 6:00 PM",
      time: "Yesterday",
      type: "reminders",
      unread: false,
      icon: "📅",
    },
  ]);

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  // Quick Capture State
  const [quickCaptureText, setQuickCaptureText] = useState("");

  // Music Player Mock State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLikedSong, setIsLikedSong] = useState(true);

  // Sync listener
  useEffect(() => {
    function syncData() {
      setTasks(getTasks());
      setHabits(getHabits());
      setGoals(getGoals());
      setBooks(getBooks());
      setMemories(getMemories());
    }
    window.addEventListener("storage", syncData);
    window.addEventListener("storage-sync", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("storage-sync", syncData);
    };
  }, []);

  // Today Date & Greeting Logic
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = today.toLocaleDateString("en-US", { day: "numeric" });
  const monthName = today.toLocaleDateString("en-US", { month: "short" });
  const dateFormatted = `${dayName}, ${dayNum} ${monthName}`;

  const currentHour = today.getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  // Task Stats
  const remainingTasksCount = tasks.filter((t) => !t.completed).length;

  // Habit Streak Stats
  const habitStreaks = habits.map((habit) => {
    const completedDates = new Set(habit.completedDates);
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split("T")[0];
      if (!completedDates.has(ds)) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  });
  const bestStreak = habitStreaks.length > 0 ? Math.max(...habitStreaks, 7) : 7;

  // Goal Progress Stats
  const overallGoalProgress =
    goals.length > 0
      ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
      : 64;

  // Currently Reading Book
  const readingBooks = books.filter((b) => b.status === "reading");
  const currentBook =
    readingBooks.length > 0
      ? readingBooks[0]
      : books.length > 0
      ? books[0]
      : {
          title: "Atomic Habits",
          author: "James Clear",
          cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
          currentPage: 142,
          totalPages: 320,
        };

  const bookProgressPercent =
    currentBook.totalPages && currentBook.totalPages > 0
      ? Math.round((currentBook.currentPage / currentBook.totalPages) * 100)
      : 64;

  // Recent Memories sample or existing
  const displayMemories =
    memories.length > 0
      ? memories.slice(0, 4)
      : [
          {
            id: "m-1",
            title: "Golden Hour Walk",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
          },
          {
            id: "m-2",
            title: "Coffee & Study",
            imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80",
          },
          {
            id: "m-3",
            title: "Mountain Trail",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80",
          },
          {
            id: "m-4",
            title: "Library Moments",
            imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
          },
        ];

  // Default focus tasks if user has none
  const defaultFocusTasks: Task[] = [
    { id: "def-t-1", title: "Complete AI-ML assignment", completed: false, priority: "high", createdAt: "" },
    { id: "def-t-2", title: "Read 20 pages", completed: true, priority: "medium", createdAt: "" },
    { id: "def-t-3", title: "Workout", completed: false, priority: "low", createdAt: "" },
    { id: "def-t-4", title: "Plan for midterm", completed: false, priority: "high", createdAt: "" },
  ];

  const focusTasksList = tasks.length > 0 ? tasks.slice(0, 4) : defaultFocusTasks;

  function handleToggleTask(task: Task) {
    if (tasks.some((t) => t.id === task.id)) {
      const updated = { ...task, completed: !task.completed };
      updateTask(updated);
      setTasks(getTasks());
    } else {
      const newTask: Task = { ...task, id: crypto.randomUUID(), completed: !task.completed };
      addTask(newTask);
      setTasks(getTasks());
    }
  }

  function handleTriggerUniversalCreate(template: CreateTemplateType, text?: string) {
    window.dispatchEvent(
      new CustomEvent("open-universal-create", {
        detail: {
          template,
          initialText: text !== undefined ? text : quickCaptureText,
        },
      })
    );
    setQuickCaptureText("");
  }

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-5 md:py-7">
        {/* ═══════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17151C] flex items-center gap-2">
              <span>{greeting}, Shru!</span>
              <span className="text-2xl sm:text-3xl">☀️</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-normal text-[#5F5965]">
              A new day, a new chance to be proud of yourself.
            </p>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-72">
              <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
              <input
                type="text"
                placeholder="Search anything..."
                onClick={() => {
                  window.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
                  );
                }}
                className="w-full rounded-2xl border border-[#E8E3F0] bg-white/90 pl-9 pr-4 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none transition focus:border-[#9E96D8] focus:bg-white"
              />
            </div>

            {/* Notification Bell & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-2xl border transition shadow-2xs cursor-pointer ${
                  isNotifOpen
                    ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C]"
                    : "bg-white/90 border-[#E8E3F0] text-[#5F5965] hover:bg-white hover:text-[#17151C]"
                }`}
                aria-label="Notifications"
                title="Notification Center"
              >
                <Bell size={16} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#D99BB8] ring-2 ring-white text-[8px] font-bold text-white" />
                )}
              </button>

              {/* NOTIFICATIONS DROPDOWN PANEL */}
              {isNotifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsNotifOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-40 w-80 sm:w-96 rounded-3xl border border-[#E8E3F0] bg-white p-4 shadow-2xl lumi-animate-fade-up">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8E3F0]">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-sm font-bold text-[#17151C]">
                          Notifications
                        </h3>
                        {unreadNotifsCount > 0 && (
                          <span className="rounded-full bg-[#EEEAFE] px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5]">
                            {unreadNotifsCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) => ({ ...n, unread: false }))
                            );
                          }}
                          className="text-[11px] font-medium text-[#9E96D8] hover:text-[#6B5BA5] transition"
                        >
                          Mark all read
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsNotifOpen(false)}
                          className="rounded-full p-1 text-[#8D8792] hover:bg-[#FAF8FC]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1.5 py-2.5 border-b border-[#E8E3F0]/60 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setNotifFilter("all")}
                        className={`rounded-xl px-2.5 py-1 transition cursor-pointer ${
                          notifFilter === "all"
                            ? "bg-[#17151C] text-white shadow-2xs"
                            : "text-[#5F5965] hover:bg-[#FAF8FC]"
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter("reminders")}
                        className={`rounded-xl px-2.5 py-1 transition cursor-pointer ${
                          notifFilter === "reminders"
                            ? "bg-[#17151C] text-white shadow-2xs"
                            : "text-[#5F5965] hover:bg-[#FAF8FC]"
                        }`}
                      >
                        Reminders
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter("friends")}
                        className={`rounded-xl px-2.5 py-1 transition cursor-pointer ${
                          notifFilter === "friends"
                            ? "bg-[#17151C] text-white shadow-2xs"
                            : "text-[#5F5965] hover:bg-[#FAF8FC]"
                        }`}
                      >
                        Friends
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                      {notifications
                        .filter(
                          (n) => notifFilter === "all" || n.type === notifFilter
                        )
                        .map((notif) => (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-3 rounded-2xl p-2.5 transition ${
                              notif.unread
                                ? "bg-[#FAF8FC] border border-[#DDD8F2]"
                                : "hover:bg-[#FAF8FC] border border-transparent"
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E3F0] text-sm shadow-2xs">
                              {notif.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#17151C] truncate">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-[#5F5965] line-clamp-2 leading-tight mt-0.5">
                                {notif.desc}
                              </p>
                              <span className="text-[9px] text-[#8D8792] mt-1 block">
                                {notif.time}
                              </span>
                            </div>
                            {notif.unread && (
                              <span className="h-2 w-2 rounded-full bg-[#9E96D8] shrink-0 mt-1" />
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E8E3F0] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate("/settings");
                        }}
                        className="text-[11px] font-medium text-[#8D8792] hover:text-[#17151C] transition"
                      >
                        Notification Settings →
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifications([])}
                        className="text-[11px] text-[#D99BB8] hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar / Settings Trigger */}
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DCD8F2] to-[#F2D8E4] border border-white text-xs font-bold text-[#17151C] shadow-2xs transition hover:scale-105 cursor-pointer"
              title="Settings & Appearance"
            >
              <Settings size={15} className="text-[#5F5965]" />
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════
            TOP SUMMARY CARDS (ROW 1)
        ═══════════════════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* CARD 1: TODAY'S DATE CARD */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EEEAFE] via-[#F8E8F0] to-[#EEF3FA] p-5 border border-[#DCD8F2] shadow-[0_4px_20px_rgba(80,70,120,0.05)] transition-all duration-300 hover:shadow-md">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#17151C]">
                {dateFormatted}
              </span>
              <p className="mt-1 text-xs font-medium text-[#5F5965] flex items-center gap-1">
                <span>Let's make it count</span>
                <span className="text-[#D99BB8]">✨</span>
              </p>
            </div>
            <div className="pointer-events-none absolute -bottom-3 -right-2 text-4xl opacity-35 select-none transition-transform group-hover:scale-110 duration-500">
              🌿
            </div>
          </div>

          {/* CARD 2: TASKS LEFT */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/90 p-5 border border-[#E8E3F0] shadow-[0_4px_20px_rgba(80,70,120,0.04)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF8F4] text-[#3E7D5C] border border-[#CCE5DC] shadow-2xs">
                <CalendarDays size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[#17151C] leading-none">
                  {remainingTasksCount || 3}
                </p>
                <p className="mt-1 text-xs font-medium text-[#8D8792] truncate">
                  Tasks left
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: HABIT STREAK */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/90 p-5 border border-[#E8E3F0] shadow-[0_4px_20px_rgba(80,70,120,0.04)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF3EC] text-[#E07A5F] border border-[#F1D2C9] shadow-2xs">
                <Flame size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[#17151C] leading-none">
                  {bestStreak} days
                </p>
                <p className="mt-1 text-xs font-medium text-[#8D8792] truncate">
                  Habit streak
                </p>
              </div>
            </div>
          </div>

          {/* CARD 4: GOAL PROGRESS */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/90 p-5 border border-[#E8E3F0] shadow-[0_4px_20px_rgba(80,70,120,0.04)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2] shadow-2xs">
                <Target size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[#17151C] leading-none">
                  {overallGoalProgress}%
                </p>
                <p className="mt-1 text-xs font-medium text-[#8D8792] truncate">
                  Goal progress
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            MAIN GRID (ROW 2 & ROW 3)
        ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ===================================================
              COLUMN 1 (LEFT / 4 COLS): TODAY'S FOCUS & UPCOMING & QUOTE
          =================================================== */}
          <div className="lg:col-span-4 space-y-5">
            {/* CARD: TODAY'S FOCUS */}
            <Card
              variant="glass"
              hoverEffect
              className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🗂️</span>
                  <h2 className="font-serif text-lg font-bold text-[#17151C]">
                    Today's Focus
                  </h2>
                </div>
                <Link
                  to="/plan"
                  className="text-xs font-semibold text-[#9E96D8] hover:text-[#7A70C2] flex items-center gap-1 transition"
                >
                  <span>See all</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Task Checklist Items */}
              <div className="space-y-2.5">
                {focusTasksList.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task)}
                    className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition duration-200 cursor-pointer ${
                      task.completed
                        ? "bg-[#FAF8FC] border-[#E8E3F0]/60 opacity-60"
                        : "bg-white border-[#E8E3F0] hover:border-[#9E96D8]/50 hover:bg-[#FAF8FC] shadow-2xs"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                        task.completed
                          ? "bg-[#9E96D8] border-[#9E96D8] text-white"
                          : "border-[#DCD8F2] bg-white hover:border-[#9E96D8]"
                      }`}
                    >
                      {task.completed && <Check size={12} strokeWidth={3} />}
                    </div>

                    <span
                      className={`text-xs font-medium truncate min-w-0 flex-1 ${
                        task.completed
                          ? "line-through text-[#8D8792]"
                          : "text-[#17151C]"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Task Button */}
              <button
                type="button"
                onClick={() => handleTriggerUniversalCreate("task")}
                className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#DDD8F2] bg-[#FAF8FC] py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Add task</span>
              </button>
            </Card>

            {/* CARD: UPCOMING */}
            <Card
              variant="glass"
              hoverEffect
              className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">✨</span>
                  <h2 className="font-serif text-lg font-bold text-[#17151C]">
                    Upcoming
                  </h2>
                </div>
                <Link
                  to="/calendar"
                  className="text-xs font-semibold text-[#9E96D8] hover:text-[#7A70C2] flex items-center gap-1 transition"
                >
                  <span>See all</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="space-y-2.5">
                {/* Midterm Item */}
                <div className="flex items-center gap-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 shadow-2xs">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6B5BA5] border border-[#DDD8F2]">
                    <BookOpen size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#17151C] truncate">
                      DSA Midterm
                    </p>
                    <p className="text-[11px] font-medium text-[#8D8792]">
                      Tomorrow, 10:00 AM
                    </p>
                  </div>
                </div>

                {/* Project Meeting Item */}
                <div className="flex items-center gap-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 shadow-2xs">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FA] text-[#4A729A] border border-[#D9E7F2]">
                    <Laptop size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#17151C] truncate">
                      Project Meeting
                    </p>
                    <p className="text-[11px] font-medium text-[#8D8792]">
                      5 Oct, 2:00 PM
                    </p>
                  </div>
                </div>

                {/* Gym Item */}
                <div className="flex items-center gap-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 shadow-2xs">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF0F6] text-[#9A4E70] border border-[#F2D8E4]">
                    <Dumbbell size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#17151C] truncate">
                      Gym
                    </p>
                    <p className="text-[11px] font-medium text-[#8D8792]">
                      Today, 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CARD: INSPIRATION BANNER (MOUNTAIN/NATURE) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#17151C] text-white p-6 shadow-md border border-[#2D263B] group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 flex flex-col justify-between min-h-32">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8B3E8]">
                    Daily Mindset
                  </span>
                  <ArrowRight size={14} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-snug">
                    "Progress, not perfection."
                  </h3>
                  <p className="mt-1 text-xs text-white/80 font-normal">
                    You're doing better than you think.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              COLUMN 2 (CENTER & RIGHT / 8 COLS): READING, MUSIC, MEMORIES, QUICK CAPTURE, FRIENDS
          =================================================== */}
          <div className="lg:col-span-8 space-y-5">
            {/* TOP ROW: CURRENTLY READING + NOW PLAYING */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* CURRENTLY READING CARD */}
              <Card
                variant="glass"
                hoverEffect
                className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="font-serif text-base font-bold text-[#17151C]">
                      Currently Reading
                    </h2>
                    <Link
                      to="/reading"
                      className="text-xs font-semibold text-[#9E96D8] hover:text-[#7A70C2] flex items-center gap-1 transition"
                    >
                      <span>See all</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Book Thumbnail */}
                    <img
                      src={currentBook.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"}
                      alt={currentBook.title}
                      className="h-24 w-17 rounded-xl object-cover shadow-sm border border-black/5 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-sm font-bold text-[#17151C] truncate">
                        {currentBook.title}
                      </h3>
                      <p className="text-[11px] font-medium text-[#5F5965] truncate">
                        {currentBook.author}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-[#8D8792] mb-1">
                          <span>Progress</span>
                          <span>{bookProgressPercent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEAFE]">
                          <div
                            className="h-full rounded-full bg-[#9E96D8]"
                            style={{ width: `${bookProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/reading"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#EEEAFE] py-2 text-xs font-semibold text-[#6B5BA5] hover:bg-[#DDD8F2] border border-[#DDD8F2] transition"
                >
                  Continue Reading
                </Link>
              </Card>

              {/* NOW PLAYING CARD (SPOTIFY READY AESTHETIC) */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F232B] to-[#121418] text-white p-5 shadow-sm border border-[#2F3542] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-semibold text-white/90">
                      Now Playing
                    </span>
                    <a
                      href="https://open.spotify.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#1DB954] hover:underline flex items-center gap-1.5"
                    >
                      <span>Open Spotify</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"
                      alt="Track cover"
                      className="h-16 w-16 rounded-xl object-cover shadow-sm shrink-0 border border-white/10"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            Snooze
                          </p>
                          <p className="text-xs text-white/60 truncate">
                            SZA
                          </p>
                        </div>

                        <div className="h-6 w-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black shrink-0">
                          <Headphones size={13} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsLikedSong(!isLikedSong)}
                    className="text-white/70 hover:text-[#D99BB8] transition cursor-pointer"
                  >
                    <Heart
                      size={16}
                      className={isLikedSong ? "fill-[#D99BB8] text-[#D99BB8]" : ""}
                    />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-white/70 hover:text-white transition cursor-pointer"
                    >
                      <SkipBack size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#17151C] hover:scale-105 transition cursor-pointer"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      className="text-white/70 hover:text-white transition cursor-pointer"
                    >
                      <SkipForward size={15} />
                    </button>
                  </div>

                  <Link to="/music" className="text-white/50 hover:text-white transition">
                    <MoreHorizontal size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: RECENT MEMORIES + QUICK CAPTURE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* RECENT MEMORIES CARD */}
              <Card
                variant="glass"
                hoverEffect
                className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="font-serif text-base font-bold text-[#17151C]">
                      Recent Memories
                    </h2>
                    <Link
                      to="/memories"
                      className="text-xs font-semibold text-[#9E96D8] hover:text-[#7A70C2] flex items-center gap-1 transition"
                    >
                      <span>See all</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Photos Row */}
                  <div className="grid grid-cols-4 gap-2">
                    {displayMemories.map((mem, idx) => (
                      <Link
                        key={mem.id}
                        to="/memories"
                        className="group relative h-24 overflow-hidden rounded-2xl border border-black/5 bg-[#FAF8FC]"
                      >
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        />
                        {idx === 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            +12
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerUniversalCreate("memory")}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer"
                >
                  <Camera size={14} />
                  <span>Preserve Memory</span>
                </button>
              </Card>

              {/* QUICK CAPTURE CARD */}
              <Card
                variant="glass"
                hoverEffect
                className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">💡</span>
                    <h2 className="font-serif text-base font-bold text-[#17151C]">
                      Quick Capture
                    </h2>
                  </div>

                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={quickCaptureText}
                    onChange={(e) => setQuickCaptureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && quickCaptureText.trim()) {
                        handleTriggerUniversalCreate("task", quickCaptureText);
                      }
                    }}
                    className="w-full rounded-2xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-3 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                  />
                </div>

                {/* Shortcuts Row */}
                <div className="mt-4 grid grid-cols-6 gap-1 pt-2 border-t border-[#E8E3F0]">
                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("task", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <CheckSquare size={14} className="text-[#9E96D8]" />
                    <span>Task</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("note", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#EEF8F4] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <FileText size={14} className="text-[#528D6F]" />
                    <span>Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("project", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#F3EAF4] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <FolderKanban size={14} className="text-[#A26D9B]" />
                    <span>Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("goal", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <Target size={14} className="text-[#9E96D8]" />
                    <span>Goal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("journal", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#FAEEF3] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <Heart size={14} className="text-[#D99BB8]" />
                    <span>Journal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerUniversalCreate("memory", quickCaptureText)}
                    className="flex flex-col items-center gap-1 rounded-xl p-1.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#EEF3FA] hover:text-[#17151C] transition cursor-pointer"
                  >
                    <Camera size={14} className="text-[#6B9AB8]" />
                    <span>Memory</span>
                  </button>
                </div>
              </Card>
            </div>

            {/* BOTTOM ROW: FRIENDS' MEMORIES PREVIEW */}
            <Card
              variant="glass"
              hoverEffect
              className="p-5 border-[#E8E3F0] bg-white/95 rounded-3xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">👥</span>
                  <h2 className="font-serif text-base font-bold text-[#17151C]">
                    Friends' Memories
                  </h2>
                </div>
                <Link
                  to="/friends"
                  className="text-xs font-semibold text-[#9E96D8] hover:text-[#7A70C2] flex items-center gap-1 transition"
                >
                  <span>See all</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { name: "Aarav", time: "2h ago", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" },
                  { name: "Meera", time: "5h ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" },
                  { name: "Rohan", time: "1d ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" },
                  { name: "Isha", time: "2d ago", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80" },
                ].map((friend) => (
                  <Link
                    key={friend.name}
                    to="/friends"
                    className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-2xs group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#528D6F] ring-2 ring-white" />
                    </div>
                    <span className="text-xs font-bold text-[#17151C]">{friend.name}</span>
                    <span className="text-[10px] text-[#8D8792]">{friend.time}</span>
                  </Link>
                ))}

                <Link
                  to="/friends"
                  className="relative h-14 w-24 overflow-hidden rounded-2xl border border-black/5 bg-[#FAF8FC] shrink-0 ml-auto hidden sm:block group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80"
                    alt="Shared preview"
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-[10px] font-bold">
                    View Feed
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}