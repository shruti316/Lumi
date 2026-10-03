import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Flame,
  Leaf,
  Menu,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Target,
  Play,
  Pause,
} from "lucide-react";

import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { getTasks, updateTask, type Task } from "../../lib/storage";
import { getHabits, updateHabit, type Habit } from "../../lib/habitStorage";
import { getBooks, type Book } from "../../lib/readingStorage";
import { getDiaryEntries, type DiaryEntry } from "../../lib/diaryStorage";
import {
  getGoals,
  getExams,
  getCalendarEvents,
  getFocusSessions,
  getNotes,
  getProjects,
} from "../../lib/lifeOSStorage";

export default function Dashboard() {
  const navigate = useNavigate();

  // Real Storage States
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const [books] = useState<Book[]>(() => getBooks());
  const [diaryEntries] = useState<DiaryEntry[]>(() => getDiaryEntries());
  const [goals] = useState(() => getGoals());
  const [exams] = useState(() => getExams());
  const [events] = useState(() => getCalendarEvents());
  const [focusSessions] = useState(() => getFocusSessions());
  const [notes] = useState(() => getNotes());
  const [projects] = useState(() => getProjects());

  // Top Bar Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [showDockMenu, setShowDockMenu] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Focus Timer Interactive State
  const [focusSeconds, setFocusSeconds] = useState(7200); // 2 hours default
  const [isFocusing, setIsFocusing] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isFocusing && focusSeconds > 0) {
      timer = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFocusing, focusSeconds]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  /* ───────────────── CALCULATIONS ───────────────── */
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const completedHabitsCount = habits.filter((h) =>
    h.completedDates.includes(todayString)
  ).length;
  const totalHabits = habits.length;
  const habitProgress =
    totalHabits === 0
      ? 0
      : Math.round((completedHabitsCount / totalHabits) * 100);

  // Overall Daily Life OS Progress
  const totalItems = totalTasks + totalHabits;
  const completedItems = completedTasks + completedHabitsCount;
  const overallProgress =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const habitStreaks = habits.map((habit) => {
    const completedDates = new Set(habit.completedDates);
    let streak = 0;
    const date = new Date();

    while (true) {
      const dateString = date.toISOString().split("T")[0];
      if (!completedDates.has(dateString)) {
        break;
      }
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const bestHabitStreak =
    habitStreaks.length > 0 ? Math.max(...habitStreaks) : 0;

  /* ───────────────── READING CALCULATIONS ───────────────── */
  const currentBook =
    books.find((b) => b.status === "reading") || (books.length > 0 ? books[0] : null);

  const bookProgress =
    currentBook && currentBook.totalPages > 0
      ? Math.min(
          100,
          Math.round((currentBook.currentPage / currentBook.totalPages) * 100)
        )
      : 0;

  /* ───────────────── DIARY LATEST ENTRY ───────────────── */
  const latestDiary = diaryEntries.length > 0 ? diaryEntries[0] : null;

  /* ───────────────── TODAY'S GOAL ───────────────── */
  const primaryGoal = goals.length > 0 ? goals[0] : null;

  /* ───────────────── FOCUS RECORDED ───────────────── */
  const loggedFocusMinutes = focusSessions
    .filter((s) => s.date === todayString)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  /* ───────────────── TIME BASED GREETING ───────────────── */
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  const hour = today.getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : hour >= 17 && hour < 22
          ? "Good evening"
          : "Good night";

  /* ───────────────── UPCOMING ITEMS (EXAMS + EVENTS) ───────────────── */
  const upcomingList = [
    ...exams.map((e) => ({ title: `${e.name} (${e.subject})`, date: e.date })),
    ...events.map((ev) => ({ title: ev.title, date: ev.date })),
  ];

  /* ───────────────── HANDLERS ───────────────── */
  function handleToggleTask(task: Task) {
    const updated = { ...task, completed: !task.completed };
    updateTask(updated);
    setTasks((current) =>
      current.map((t) => (t.id === task.id ? updated : t))
    );
  }

  function handleToggleHabit(habit: Habit) {
    const isCompleted = habit.completedDates.includes(todayString);
    const updatedDates = isCompleted
      ? habit.completedDates.filter((d) => d !== todayString)
      : [...habit.completedDates, todayString];

    const updated = { ...habit, completedDates: updatedDates };
    updateHabit(updated);
    setHabits((current) =>
      current.map((h) => (h.id === habit.id ? updated : h))
    );
  }

  return (
    <div className="min-h-screen pb-28 text-[#34323A]">
      <div className="mx-auto max-w-[1450px] px-5 py-6 md:px-8 md:py-7">
        
        {/* ═══════════════════════════════════════
            1. DASHBOARD HEADER (Stagger 1)
        ═══════════════════════════════════════ */}
        <header className="lumi-animate-fade-up delay-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold tracking-widest text-[#706C72]">
              {formattedDate}
            </p>

            <h1 className="font-caveat text-3xl font-semibold tracking-tight text-[#34323A] sm:text-4xl md:text-5xl">
              {greeting}, Shru! ✨
            </h1>

            <p className="mt-1 font-caveat text-lg text-[#706C72] md:text-xl">
              Here’s what’s happening today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Overall Daily Progress Pill */}
            {totalItems > 0 && (
              <div className="hidden md:flex items-center gap-2.5 rounded-2xl border border-[#DDD8D1] bg-[#F8F5F2] px-3.5 py-2 shadow-2xs">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#706C72]">
                    Daily Progress
                  </span>
                  <span className="text-xs font-extrabold text-[#34323A]">
                    {overallProgress}% completed
                  </span>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E0EC] text-[10px] font-extrabold text-[#786A9B]">
                  {overallProgress}%
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <HeaderIconButton
                ariaLabel="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={18} />
              </HeaderIconButton>

              <HeaderIconButton
                ariaLabel="Notifications"
                className="group"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <Bell size={18} className="group-hover:animate-wiggle" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#A95C78]" />
              </HeaderIconButton>

              <HeaderIconButton
                ariaLabel="Profile"
                onClick={() => setIsProfileOpen(true)}
              >
                <CircleUserRound size={18} />
              </HeaderIconButton>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            2. TOP OVERVIEW CARDS (Stagger 2)
        ═══════════════════════════════════════ */}
        <section className="lumi-animate-fade-up delay-2 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {/* TODAY'S GOAL (Dusty Blue) */}
          <MiniStatCard
            label="Today's Goal"
            value={primaryGoal ? primaryGoal.title : "Project UI"}
            subtext={primaryGoal ? `${primaryGoal.progress}% • ${primaryGoal.category}` : "Keep moving forward"}
            icon={<Target size={19} />}
            tone="blue"
            progress={primaryGoal ? primaryGoal.progress : undefined}
          />

          {/* TASKS (Dusty Rose) */}
          <MiniStatCard
            label="Tasks"
            value={`${completedTasks}/${totalTasks}`}
            subtext={
              totalTasks === 0
                ? "No tasks set for today"
                : `${taskProgress}% completed`
            }
            icon={<Check size={19} />}
            tone="pink"
            progress={taskProgress}
          />

          {/* HABITS (Muted Sage) */}
          <MiniStatCard
            label="Habits"
            value={`${completedHabitsCount}/${totalHabits}`}
            subtext={
              bestHabitStreak > 0
                ? `${bestHabitStreak} day streak`
                : "Start your streak today"
            }
            icon={<Leaf size={19} />}
            tone="green"
            progress={habitProgress}
          />

          {/* FOCUS (Muted Terracotta) */}
          <Card className="group relative overflow-hidden border !border-[#DCBFAD] !bg-[#EBD9CD] p-4.5 glow-peach transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold italic uppercase tracking-wider text-[#A96F51]">
                  Focus
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-[#34323A]">
                  {loggedFocusMinutes > 0
                    ? `${Math.floor(loggedFocusMinutes / 60)}h ${loggedFocusMinutes % 60}m`
                    : formatTime(focusSeconds)}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#706C72]">
                  {isFocusing ? "Timer active • Stay in flow" : "Keep the momentum going"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsFocusing((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFCBBC] text-[#34323A] transition hover:scale-105 active:scale-95 shadow-2xs"
                  title={isFocusing ? "Pause Focus" : "Start Focus"}
                >
                  {isFocusing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                </button>
                {isFocusing && (
                  <button
                    type="button"
                    onClick={() => { setIsFocusing(false); setFocusSeconds(7200); }}
                    className="text-[10px] font-bold text-[#A96F51] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            3. WEEKLY OVERVIEW + TODAY'S PLAN (Stagger 3 & 4)
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
          {/* WEEKLY OVERVIEW (Muted Lavender - Stagger 3) */}
          <Card className="lumi-animate-fade-up delay-3 group overflow-hidden !border-[#D2CADB] !bg-[#E5E0EC] p-5 glow-lavender transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#786A9B]">
                  Overview
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  Weekly overview
                </h2>
              </div>

              <span className="rounded-full bg-[#D6CFE0] px-3 py-1 text-[11px] font-bold text-[#786A9B] shadow-2xs">
                This week
              </span>
            </div>

            <div className="mt-4">
              <InteractiveWeeklyChart />
            </div>

            <div className="mt-3 flex gap-5 text-xs font-semibold text-[#706C72]">
              <span>
                <strong className="font-bold text-[#34323A]">
                  {completedTasks} / {totalTasks || 12}
                </strong>{" "}
                tasks
              </span>
              <span>
                <strong className="font-bold text-[#34323A]">
                  {totalHabits || 8}
                </strong>{" "}
                habits
              </span>
              <span>
                <strong className="font-bold text-[#34323A]">
                  {loggedFocusMinutes > 0
                    ? `${(loggedFocusMinutes / 60).toFixed(1)}h`
                    : "6.4h"}
                </strong>{" "}
                focus
              </span>
            </div>
          </Card>

          {/* TODAY'S PLAN (Dusty Blue - Stagger 4) */}
          <Card className="lumi-animate-fade-up delay-4 group !border-[#C5D8E0] !bg-[#DCE8EC] p-5 glow-blue transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#638DA0]">
                Schedule
              </p>
              <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                Today’s plan
              </h2>
            </div>

            <div className="mt-4 space-y-3.5">
              <SchedulePlanItem time="09:00" label="Classes" tone="blue" />
              <SchedulePlanItem time="12:00" label="Lunch break" tone="peach" />
              <SchedulePlanItem time="14:00" label="Project work" tone="lavender" />
              <SchedulePlanItem time="17:00" label="Gym / personal time" tone="green" />
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            4. MY TASKS + HABITS (Stagger 5 & 6)
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          {/* MY TASKS (Dusty Rose - Stagger 5) */}
          <Card className="lumi-animate-fade-up delay-5 group !border-[#D8BDC7] !bg-[#EBD8DF] p-5 glow-pink transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#A95C78]">
                  Today
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  My tasks
                </h2>
              </div>

              <Link
                to="/tasks"
                className="group/btn flex h-8 w-8 items-center justify-center rounded-xl bg-[#DFCAD2] text-[#A95C78] transition duration-200 hover:-translate-y-0.5 hover:bg-[#D5BCC5] active:scale-95"
                aria-label="Add task"
              >
                <Plus size={17} className="transition-transform duration-300 group-hover/btn:rotate-90" />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {tasks.length === 0 ? (
                <div className="rounded-xl border border-[#D8BDC7] bg-[#F8F5F2] p-4 text-center">
                  <p className="text-xs font-bold text-[#34323A]">
                    🌷 A quiet day
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#706C72]">
                    Nothing planned yet. Add something when you're ready.
                  </p>
                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <TaskItemRow
                    key={task.id}
                    task={task}
                    onToggle={() => handleToggleTask(task)}
                  />
                ))
              )}
            </div>

            <Link
              to="/tasks"
              className="group/link mt-4 flex items-center justify-between rounded-xl bg-[#DFCAD2]/75 px-3.5 py-2.5 text-xs font-extrabold text-[#A95C78] transition duration-200 hover:bg-[#DFCAD2]"
            >
              Open task center
              <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </Card>

          {/* HABITS (Muted Sage - Stagger 6) */}
          <Card className="lumi-animate-fade-up delay-6 group !border-[#C4D7C8] !bg-[#DCE6DE] p-5 glow-green transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#668C72]">
                  Routine
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  Habits
                </h2>
              </div>

              <div className="rounded-xl bg-[#CADBCE] p-2 text-[#668C72]">
                <Leaf size={18} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-[#34323A]">
                  {habitProgress}%
                </span>
                <span className="text-xs font-bold text-[#668C72]">
                  completed today
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#CADBCE]">
                <div
                  className="h-full rounded-full bg-[#668C72] transition-all duration-700 ease-out"
                  style={{ width: `${habitProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {habits.length === 0 ? (
                <>
                  <DefaultHabitRow emoji="🏃🏻‍♀️" label="Workout" progress={80} />
                  <DefaultHabitRow emoji="📖" label="Reading" progress={60} />
                  <DefaultHabitRow emoji="💧" label="Water" progress={100} />
                </>
              ) : (
                habits.slice(0, 4).map((habit) => {
                  const isDone = habit.completedDates.includes(todayString);
                  return (
                    <button
                      key={habit.id}
                      type="button"
                      onClick={() => handleToggleHabit(habit)}
                      className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] px-3 py-2 text-left text-xs font-semibold text-[#34323A] transition hover:bg-[#FAF7F4] active:scale-[0.99] border border-[#C4D7C8]/60"
                    >
                      <div className="flex items-center gap-2">
                        <span>{habit.emoji}</span>
                        <span className={isDone ? "line-through opacity-70" : ""}>
                          {habit.name}
                        </span>
                      </div>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                          isDone ? "bg-[#668C72] text-white" : "border border-[#C4D7C8]"
                        }`}
                      >
                        {isDone && <Check size={10} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#668C72]">
              <Flame size={14} className="text-[#A96F51]" />
              {bestHabitStreak > 0
                ? `${bestHabitStreak} day best streak`
                : "Start your streak today"}
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            5. READING + DIARY + UPCOMING (Stagger 7, 8, 9)
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {/* READING (Muted Lavender - Stagger 7) */}
          <Card className="lumi-animate-fade-up delay-7 group !border-[#D2CADB] !bg-[#E5E0EC] p-5 glow-lavender transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#786A9B]">
                  Library
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  Reading
                </h2>
              </div>
              <BookOpen size={19} className="text-[#786A9B] transition-transform duration-200 group-hover:-translate-y-0.5" />
            </div>

            <div className="mt-4 flex gap-3">
              {currentBook?.cover ? (
                <img
                  src={currentBook.cover}
                  alt={currentBook.title}
                  className="h-24 w-16 rounded-lg object-cover shadow-2xs transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#786A9B] to-[#A95C78] text-[10px] font-extrabold text-white shadow-2xs">
                  BOOK
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#786A9B]">
                  Currently reading
                </p>
                <p className="mt-0.5 truncate text-xs font-bold text-[#34323A]">
                  {currentBook ? currentBook.title : "Your library is waiting"}
                </p>
                <p className="truncate text-[11px] font-medium text-[#706C72]">
                  {currentBook ? `by ${currentBook.author}` : "Add a book to track your reading."}
                </p>

                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#D2CADB]">
                    <div
                      className="h-full rounded-full bg-[#786A9B] transition-all duration-500"
                      style={{ width: `${bookProgress}%` }}
                    />
                  </div>
                  {currentBook && (
                    <p className="mt-1 text-[10px] font-semibold text-[#706C72]">
                      Page {currentBook.currentPage} of {currentBook.totalPages} ({bookProgress}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/reading"
              className="group/link mt-4 flex items-center justify-between rounded-xl bg-[#D6CFE0] px-3.5 py-2.5 text-xs font-extrabold text-[#786A9B] transition duration-200 hover:bg-[#CCC4D6]"
            >
              Open library
              <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          </Card>

          {/* DIARY (Muted Terracotta - Stagger 8) */}
          <Card className="lumi-animate-fade-up delay-8 group !border-[#DCBFAD] !bg-[#EBD9CD] p-5 glow-peach transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#A96F51]">
                  Personal
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  Diary
                </h2>
              </div>
              <div className="rounded-xl bg-[#DCBFAD] p-2 text-[#A96F51]">
                <PenLine size={18} />
              </div>
            </div>

            <div className="mt-4 min-h-[96px] rounded-xl bg-[#F8F5F2] border border-[#DCBFAD]/60 p-3.5">
              {latestDiary ? (
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#34323A] truncate">
                      {latestDiary.title || "Untitled Entry"}
                    </span>
                    <span className="text-sm">{latestDiary.mood}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs font-medium text-[#706C72] leading-relaxed">
                    {latestDiary.content}
                  </p>
                </div>
              ) : (
                <div className="text-center py-1">
                  <p className="text-xs font-bold text-[#34323A]">
                    ✨ A quiet space
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#706C72] leading-relaxed">
                    Put down whatever is on your mind today.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Mood Tracker Widget */}
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold text-[#A96F51] uppercase tracking-wider">
                Mood check-in
              </span>
              <div className="flex items-center gap-1.5">
                {["😊", "😌", "😐", "😔", "😴"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedMood(emoji)}
                    className={`text-sm transition-transform hover:scale-125 ${
                      selectedMood === emoji ? "scale-125 drop-shadow-xs" : "opacity-75"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/diary"
              className="group/link mt-3 flex items-center justify-between rounded-xl bg-[#DFCBBC] px-3.5 py-2 text-xs font-extrabold text-[#A96F51] transition duration-200 hover:bg-[#D5BEAE]"
            >
              Write today
              <PenLine size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </Card>

          {/* UPCOMING (Dusty Blue - Stagger 9) */}
          <Card className="lumi-animate-fade-up delay-9 group !border-[#C5D8E0] !bg-[#DCE8EC] p-5 glow-blue transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.008]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#638DA0]">
                  Coming up
                </p>
                <h2 className="mt-0.5 font-caveat text-2xl font-bold tracking-tight text-[#34323A]">
                  Upcoming
                </h2>
              </div>
              <CalendarDays size={19} className="text-[#638DA0] transition-transform duration-200 group-hover:-translate-y-0.5" />
            </div>

            <div className="mt-4 space-y-2.5">
              {upcomingList.length === 0 ? (
                <>
                  <UpcomingEventItem title="DAA Exam" date="Oct 8" />
                  <UpcomingEventItem title="Project Review" date="Oct 10" />
                  <UpcomingEventItem title="Weekly Reflection" date="Oct 12" />
                </>
              ) : (
                upcomingList.slice(0, 3).map((item, idx) => (
                  <UpcomingEventItem key={idx} title={item.title} date={item.date} />
                ))
              )}
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            6. LUMI REMINDER (Stagger 10)
        ═══════════════════════════════════════ */}
        <section className="lumi-animate-fade-up delay-10 mt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#D2CADB] bg-[#E5E0EC] px-5 py-4 glow-lavender transition-all duration-300">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D6CFE0] text-[#786A9B]">
              <Sparkles size={17} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#34323A]">
                A little Lumi reminder
              </p>
              <p className="mt-0.5 font-caveat text-xl text-[#786A9B]">
                "Small progress is still progress."
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════
          FLOATING QUICK ACCESS DOCK
      ═══════════════════════════════════════ */}
      <div className="fixed bottom-5 left-1/2 z-50 w-auto -translate-x-1/2 select-none">
        {showDockMenu && (
          <div className="absolute bottom-[calc(100%+12px)] left-1/2 w-56 -translate-x-1/2 rounded-2xl border border-[#DDD8D1] bg-[#FAF7F4]/95 p-2.5 shadow-xl backdrop-blur-xl animate-fade-up">
            <DockMenuItem label="Notes" icon="📝" onClick={() => { navigate("/notes"); setShowDockMenu(false); }} />
            <DockMenuItem label="Brain Dump" icon="🧠" onClick={() => { navigate("/brain-dump"); setShowDockMenu(false); }} />
            <DockMenuItem label="Memories" icon="💭" onClick={() => { navigate("/memories"); setShowDockMenu(false); }} />
            <DockMenuItem label="Calendar" icon="📅" onClick={() => { navigate("/calendar"); setShowDockMenu(false); }} />
            <DockMenuItem label="Music" icon="🎵" onClick={() => { navigate("/music"); setShowDockMenu(false); }} />
            <DockMenuItem label="Exams" icon="📚" onClick={() => { navigate("/exams"); setShowDockMenu(false); }} />
            <DockMenuItem label="Focus" icon="⏱️" onClick={() => { navigate("/focus"); setShowDockMenu(false); }} />
          </div>
        )}

        <nav className="flex w-fit items-center gap-1 rounded-[22px] border border-[#DDD8D1] bg-[#FAF7F4]/95 p-2 shadow-xl backdrop-blur-xl">
          <DockNavLink to="/" icon="⌂" label="Home" active />
          <DockNavLink to="/planner" icon="☷" label="Planner" />
          <DockNavLink to="/tasks" icon="✓" label="Tasks" />
          <DockNavLink to="/habits" icon="🌱" label="Habits" />
          <DockNavLink to="/goals" icon="🎯" label="Goals" />
          <DockNavLink to="/reading" icon="📖" label="Reading" />
          <DockNavLink to="/diary" icon="✎" label="Diary" />

          <button
            type="button"
            onClick={() => setShowDockMenu((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition duration-200 ${
              showDockMenu
                ? "bg-[#E5E0EC] text-[#786A9B]"
                : "text-[#706C72] hover:bg-[#F2F0ED]"
            }`}
            aria-label="More tools"
          >
            <Menu size={16} />
          </button>

          <div className="mx-1 h-5 w-px bg-[#DDD8D1]" />

          <Link
            to="/tasks"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBD8DF] text-[#A95C78] transition duration-200 hover:-translate-y-0.5 hover:bg-[#DEC5D0] active:scale-95"
            aria-label="Quick add task"
          >
            <Plus size={17} />
          </Link>
        </nav>
      </div>

      {/* ═══════════════════════════════════════
          GLOBAL SEARCH MODAL
      ═══════════════════════════════════════ */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        title="Quick Search Across LUMI ✨"
        subtitle="Search tasks, habits, goals, notes, books & diary."
      >
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-3 text-[#706C72]"
            />
            <input
              type="text"
              autoFocus
              placeholder="Type to search anything in your Life OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#DDD8D1] bg-[#FAF7F4] pl-10 pr-4 py-2.5 text-xs font-medium text-[#34323A] shadow-2xs outline-none focus:border-[#786A9B]"
            />
          </div>

          {searchQuery.trim() && (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-none">
              {/* Tasks */}
              {tasks
                .filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      navigate("/tasks");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#EBD8DF] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#A95C78]">✓</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#A95C78] uppercase">
                      Task
                    </span>
                  </button>
                ))}

              {/* Habits */}
              {habits
                .filter((h) =>
                  h.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      navigate("/habits");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#DCE6DE] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{h.emoji}</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {h.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#668C72] uppercase">
                      Habit
                    </span>
                  </button>
                ))}

              {/* Goals */}
              {goals
                .filter(
                  (g) =>
                    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    g.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      navigate("/goals");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#E5E0EC] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#786A9B]">🎯</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {g.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#786A9B] uppercase">
                      Goal
                    </span>
                  </button>
                ))}

              {/* Notes */}
              {notes
                .filter(
                  (n) =>
                    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    n.content.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      navigate("/notes");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#DCE8EC] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#638DA0]">📝</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {n.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#638DA0] uppercase">
                      Note
                    </span>
                  </button>
                ))}

              {/* Projects */}
              {projects
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      navigate("/projects");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#EBD9CD] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#A96F51]">📁</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#A96F51] uppercase">
                      Project
                    </span>
                  </button>
                ))}

              {/* Books */}
              {books
                .filter(
                  (b) =>
                    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.author.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      navigate("/reading");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#E5E0EC] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#786A9B]">📖</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {b.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#786A9B] uppercase">
                      Book
                    </span>
                  </button>
                ))}

              {/* Diary */}
              {diaryEntries
                .filter(
                  (d) =>
                    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.content.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      navigate("/diary");
                      setIsSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-[#F8F5F2] p-2.5 text-left text-xs border border-[#DDD8D1] hover:bg-[#EBD9CD] transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#A96F51]">🌷</span>
                      <span className="font-semibold text-[#34323A] truncate">
                        {d.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#A96F51] uppercase">
                      Diary
                    </span>
                  </button>
                ))}
            </div>
          )}

          {!searchQuery.trim() && (
            <div className="rounded-2xl border border-[#DDD8D1] bg-[#F8F5F2] p-4 text-center">
              <p className="text-xs font-bold text-[#34323A]">
                Quick Navigation Shortcuts
              </p>
              <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                {[
                  { label: "Tasks", path: "/tasks", color: "bg-[#EBD8DF] text-[#A95C78]" },
                  { label: "Habits", path: "/habits", color: "bg-[#DCE6DE] text-[#668C72]" },
                  { label: "Planner", path: "/planner", color: "bg-[#DCE8EC] text-[#638DA0]" },
                  { label: "Goals", path: "/goals", color: "bg-[#E5E0EC] text-[#786A9B]" },
                  { label: "Reading", path: "/reading", color: "bg-[#E5E0EC] text-[#786A9B]" },
                  { label: "Diary", path: "/diary", color: "bg-[#EBD9CD] text-[#A96F51]" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setIsSearchOpen(false);
                    }}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition shadow-2xs hover:scale-105 ${item.color}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ═══════════════════════════════════════
          NOTIFICATIONS MODAL
      ═══════════════════════════════════════ */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notifications"
        subtitle="Your college updates & system reminders."
      >
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E0EC] text-2xl shadow-2xs border border-[#D2CADB]">
            ✨
          </div>
          <h4 className="font-caveat text-3xl font-bold text-[#34323A]">
            You're all caught up.
          </h4>
          <p className="mt-1 text-xs max-w-xs mx-auto font-medium text-[#706C72] leading-relaxed">
            No new notifications right now. Enjoy your calm, focused college day!
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(false)}
              className="rounded-xl bg-[#E5E0EC] border border-[#D2CADB] px-5 py-2 text-xs font-bold text-[#786A9B] shadow-2xs hover:bg-[#D6CFE0] transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════
          STUDENT PROFILE & SETTINGS MODAL
      ═══════════════════════════════════════ */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Account & Preferences 🌷"
        subtitle="Manage your personal Life OS settings."
      >
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#D2CADB] bg-[#E5E0EC]/60 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5E0EC] text-2xl font-bold text-[#786A9B] border border-[#D2CADB] shadow-2xs">
              S
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-extrabold text-[#34323A]">
                Shru
              </h4>
              <p className="text-xs font-bold text-[#786A9B]">
                College Life OS • Student Edition
              </p>
              <p className="text-[11px] text-[#706C72] mt-0.5">
                Local-First • Private & Secure
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-[#DDD8D1] bg-[#FAF7F4] p-3">
              <span className="text-[10px] font-bold text-[#706C72] uppercase">Tasks Done</span>
              <p className="text-lg font-extrabold text-[#34323A] mt-0.5">{completedTasks}</p>
            </div>
            <div className="rounded-xl border border-[#DDD8D1] bg-[#FAF7F4] p-3">
              <span className="text-[10px] font-bold text-[#706C72] uppercase">Habits Tracked</span>
              <p className="text-lg font-extrabold text-[#34323A] mt-0.5">{habits.length}</p>
            </div>
          </div>

          {/* Settings & Appearance sections */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-[#DDD8D1] bg-[#FAF7F4] p-3">
              <div>
                <p className="font-bold text-[#34323A]">Appearance & Theme</p>
                <p className="text-[11px] text-[#706C72]">Warm Greige Atmosphere (#EEEAE6) + Visible Multi-Radial Pastel Gradients</p>
              </div>
              <span className="rounded-md bg-[#DCE6DE] px-2 py-0.5 text-[10px] font-bold text-[#668C72]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#DDD8D1] bg-[#FAF7F4] p-3">
              <div>
                <p className="font-bold text-[#34323A]">Data Storage</p>
                <p className="text-[11px] text-[#706C72]">Local-First Browser Persistence</p>
              </div>
              <span className="rounded-md bg-[#DCE8EC] px-2 py-0.5 text-[10px] font-bold text-[#638DA0]">
                Synced
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HELPER COMPONENTS
═══════════════════════════════════════════════ */

function MiniStatCard({
  label,
  value,
  subtext,
  icon,
  tone,
  progress,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  tone: "pink" | "blue" | "green" | "peach";
  progress?: number;
}) {
  const tones = {
    pink: {
      bg: "!bg-[#EBD8DF]",
      border: "!border-[#D8BDC7]",
      icon: "bg-[#DEC5D0] text-[#34323A]",
      accent: "bg-[#A95C78]",
      label: "text-[#A95C78]",
      value: "text-[#34323A]",
      glow: "glow-pink",
    },
    blue: {
      bg: "!bg-[#DCE8EC]",
      border: "!border-[#C5D8E0]",
      icon: "bg-[#C6D8DF] text-[#34323A]",
      accent: "bg-[#638DA0]",
      label: "text-[#638DA0]",
      value: "text-[#34323A]",
      glow: "glow-blue",
    },
    green: {
      bg: "!bg-[#DCE6DE]",
      border: "!border-[#C4D7C8]",
      icon: "bg-[#C8D8CC] text-[#34323A]",
      accent: "bg-[#668C72]",
      label: "text-[#668C72]",
      value: "text-[#34323A]",
      glow: "glow-green",
    },
    peach: {
      bg: "!bg-[#EBD9CD]",
      border: "!border-[#DCBFAD]",
      icon: "bg-[#DEC3B2] text-[#34323A]",
      accent: "bg-[#A96F51]",
      label: "text-[#A96F51]",
      value: "text-[#34323A]",
      glow: "glow-peach",
    },
  };

  const current = tones[tone];

  return (
    <Card
      className={`group relative overflow-hidden border ${current.border} ${current.bg} ${current.glow} p-4.5 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`text-xs font-bold italic uppercase tracking-wider ${current.label}`}
          >
            {label}
          </p>

          <p
            className={`mt-2 truncate text-2xl font-bold tracking-tight ${current.value}`}
          >
            {value}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-[#706C72]">
            {subtext}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${current.icon}`}
        >
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/60">
          <div
            className={`h-full rounded-full ${current.accent} transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  );
}

function InteractiveWeeklyChart() {
  const [activeDay, setActiveDay] = useState<string | null>("Wed");

  const daysData: Record<string, { tasks: number; habits: number; focus: string; cx: number; cy: number }> = {
    Mon: { tasks: 2, habits: 3, focus: "1.2h", cx: 10, cy: 95 },
    Tue: { tasks: 4, habits: 4, focus: "2.0h", cx: 120, cy: 72 },
    Wed: { tasks: 5, habits: 5, focus: "2.5h", cx: 220, cy: 68 },
    Thu: { tasks: 3, habits: 4, focus: "1.8h", cx: 315, cy: 65 },
    Fri: { tasks: 6, habits: 5, focus: "3.2h", cx: 415, cy: 50 },
    Sat: { tasks: 4, habits: 3, focus: "1.5h", cx: 515, cy: 45 },
    Sun: { tasks: 5, habits: 4, focus: "2.2h", cx: 690, cy: 25 },
  };

  return (
    <div className="relative h-[135px]">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        <span className="border-t border-dashed border-[#D2CADB]" />
        <span className="border-t border-dashed border-[#D2CADB]" />
        <span className="border-t border-dashed border-[#D2CADB]" />
        <span className="border-t border-dashed border-[#D2CADB]" />
      </div>

      {/* SVG Smooth Line Chart */}
      <svg
        viewBox="0 0 700 135"
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lumiChartGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#786A9B" />
            <stop offset="100%" stopColor="#A95C78" />
          </linearGradient>
        </defs>

        <path
          d="M10 95 C75 85, 95 78, 120 72 S175 60, 220 68 S275 90, 315 65 S370 32, 415 50 S470 75, 515 45 S575 22, 610 38 S665 58, 690 25"
          fill="none"
          stroke="url(#lumiChartGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className="lumi-chart-line"
        />

        {/* Day Data Points */}
        {Object.entries(daysData).map(([day, d]) => (
          <circle
            key={day}
            cx={d.cx}
            cy={d.cy}
            r={activeDay === day ? "6" : "4"}
            className="cursor-pointer transition-all duration-200"
            fill={activeDay === day ? "#A95C78" : "#786A9B"}
            stroke="#ffffff"
            strokeWidth="1.5"
            onMouseEnter={() => setActiveDay(day)}
          />
        ))}
      </svg>

      {/* Tooltip Popup on Day Hover */}
      {activeDay && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1 text-[11px] font-bold text-[#34323A] shadow-md border border-[#D2CADB] backdrop-blur-md animate-fade-up">
          <span className="text-[#786A9B]">{activeDay}</span>
          <span className="text-[#706C72]">•</span>
          <span>{daysData[activeDay].tasks} Tasks</span>
          <span className="text-[#706C72]">|</span>
          <span>{daysData[activeDay].habits} Habits</span>
          <span className="text-[#706C72]">|</span>
          <span>{daysData[activeDay].focus} Focus</span>
        </div>
      )}

      {/* Day Labels */}
      <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-1 text-[10px] font-semibold text-[#706C72]">
        {Object.keys(daysData).map((day) => (
          <button
            key={day}
            type="button"
            onMouseEnter={() => setActiveDay(day)}
            className={`transition-colors ${activeDay === day ? "font-bold text-[#786A9B]" : "hover:text-[#34323A]"}`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

function SchedulePlanItem({
  time,
  label,
  tone,
}: {
  time: string;
  label: string;
  tone: "blue" | "peach" | "lavender" | "green";
}) {
  const dots = {
    blue: "bg-[#638DA0]",
    peach: "bg-[#A96F51]",
    lavender: "bg-[#786A9B]",
    green: "bg-[#668C72]",
  };

  return (
    <div className="group flex items-center gap-3">
      <span className="w-10 text-[11px] font-bold text-[#638DA0]">
        {time}
      </span>
      <span className={`h-2 w-2 rounded-full ${dots[tone]} transition-transform duration-200 group-hover:scale-125`} />
      <span className="text-xs font-semibold text-[#34323A] transition-colors group-hover:text-[#18161D]">
        {label}
      </span>
    </div>
  );
}

function TaskItemRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-[#D8BDC7] bg-white/70 px-3.5 py-2 transition duration-200 hover:-translate-y-0.5 hover:bg-white">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md transition duration-200 ${
          task.completed
            ? "bg-[#668C72] text-white shadow-2xs"
            : "border border-[#D8BDC7] bg-white hover:border-[#A95C78]"
        }`}
      >
        {task.completed && <Check size={11} />}
      </button>

      <span
        className={`min-w-0 flex-1 text-xs font-medium transition-all duration-200 ${
          task.completed ? "text-[#706C72] line-through opacity-70" : "text-[#34323A]"
        }`}
      >
        {task.title}
      </span>

      <ChevronRight
        size={13}
        className="text-[#706C72] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
      />
    </div>
  );
}

function DefaultHabitRow({
  emoji,
  label,
  progress,
}: {
  emoji: string;
  label: string;
  progress: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm">{emoji}</span>
      <span className="flex-1 text-xs font-semibold text-[#34323A]">
        {label}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#C4D7C8]">
        <div
          className="h-full rounded-full bg-[#668C72] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function UpcomingEventItem({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-[#C5D8E0] bg-white/70 px-3 py-2 transition duration-200 hover:bg-white hover:-translate-y-0.5">
      <span className="text-xs font-semibold text-[#34323A] truncate max-w-[200px]">{title}</span>
      <span className="text-[11px] font-bold text-[#638DA0] shrink-0">{date}</span>
    </div>
  );
}

function HeaderIconButton({
  children,
  ariaLabel,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5DFD7] bg-white text-[#706C72] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#F2F0ED] active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function DockNavLink({
  to,
  icon,
  label,
  active = false,
}: {
  to: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      title={label}
      className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 transition duration-200 ${
        active
          ? "bg-[#E5E0EC] text-[#786A9B] font-bold"
          : "text-[#706C72] hover:bg-[#F2F0ED] hover:text-[#34323A]"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="ml-1.5 hidden text-[11px] font-bold lg:block">
        {label}
      </span>
    </Link>
  );
}

function DockMenuItem({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#34323A] transition duration-200 hover:bg-[#E5E0EC]"
    >
      <span className="text-sm">{icon}</span>
      {label}
    </button>
  );
}