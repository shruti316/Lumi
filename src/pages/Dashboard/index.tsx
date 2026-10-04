import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  Leaf,
  Menu,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Card } from "../../components/ui/Card";
import { getTasks, type Task } from "../../lib/storage";
import { getHabits, type Habit } from "../../lib/habitStorage";

export default function Dashboard() {
  const [tasks] = useState<Task[]>(() => getTasks());
  const [habits] = useState<Habit[]>(() => getHabits());
  const [showDockMenu, setShowDockMenu] = useState(false);

  /* ───────────────── DATA ───────────────── */

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const completedHabits = habits.filter((habit) =>
    habit.completedDates.includes(todayString)
  ).length;

  const totalHabits = habits.length;
  const habitProgress =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  const habitStreaks = habits.map((habit) => {
    const completedDates = new Set(habit.completedDates);
    let streak = 0;
    const date = new Date();

    while (true) {
      const dateString = date.toISOString().split("T")[0];
      if (!completedDates.has(dateString)) break;
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const bestHabitStreak =
    habitStreaks.length > 0 ? Math.max(...habitStreaks) : 0;

  /* ───────────────── DATE / GREETING ───────────────── */

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hour = today.getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="min-h-screen bg-transparent pb-28 lumi-animate-fade-up">
      <div className="mx-auto max-w-[1450px] px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E96D8]" />
              <p className="text-xs font-semibold tracking-wider text-[#8D8792] uppercase">
                {formattedDate}
              </p>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              {greeting},{" "}
              <span className="font-editorial-italic font-normal text-[#9E96D8]">
                Shru.
              </span>
            </h1>

            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Here is your daily sanctuary & workspace overview.
            </p>
          </div>

          <div className="hidden items-center gap-2.5 sm:flex">
            <DashboardIconButton ariaLabel="Search">
              <Search size={17} />
            </DashboardIconButton>

            <DashboardIconButton ariaLabel="Notifications">
              <Bell size={17} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#D99BB8]" />
            </DashboardIconButton>

            <DashboardIconButton ariaLabel="Profile">
              <CircleUserRound size={17} />
            </DashboardIconButton>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            TOP STAT CARDS
        ═══════════════════════════════════════ */}
        <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <MiniStat
            label="Today's Goal"
            value="Project UI"
            subtext="Visual refinement in progress"
            icon={<Target size={19} />}
            tone="blue"
          />

          <MiniStat
            label="Tasks"
            value={`${completedTasks}/${totalTasks}`}
            subtext={`${taskProgress}% tasks completed`}
            icon={<Check size={19} />}
            tone="pink"
            progress={taskProgress}
          />

          <MiniStat
            label="Habits"
            value={`${completedHabits}/${totalHabits}`}
            subtext={
              bestHabitStreak > 0
                ? `${bestHabitStreak} day best streak`
                : "Build consistency today"
            }
            icon={<Leaf size={19} />}
            tone="green"
            progress={habitProgress}
          />

          <MiniStat
            label="Focus Time"
            value="2h 15m"
            subtext="Deep work session logged"
            icon={<Clock3 size={19} />}
            tone="lavender"
          />
        </section>

        {/* ═══════════════════════════════════════
            WEEKLY + TODAY'S PLAN
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
          {/* WEEKLY OVERVIEW */}
          <Card
            variant="lavender"
            hoverEffect
            className="group relative overflow-hidden p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#5F5965]">
                  Momentum
                </p>
                <h2 className="mt-0.5 font-serif text-2xl md:text-3xl font-bold text-[#17151C] tracking-tight">
                  Weekly Overview
                </h2>
              </div>

              <span className="rounded-full bg-white/80 border border-[#DDD8F2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5F5965] shadow-2xs">
                Active Week
              </span>
            </div>

            <div className="mt-5">
              <WeeklyChart />
            </div>

            <div className="mt-4 flex gap-6 text-xs font-medium text-[#5F5965] border-t border-white/60 pt-3">
              <span>
                <strong className="font-bold text-[#17151C]">{totalTasks}</strong>{" "}
                tasks active
              </span>
              <span>
                <strong className="font-bold text-[#17151C]">{totalHabits}</strong>{" "}
                habits tracked
              </span>
              <span>
                <strong className="font-bold text-[#17151C]">6.4h</strong> deep focus
              </span>
            </div>
          </Card>

          {/* TODAY'S PLAN */}
          <Card
            variant="pearl"
            hoverEffect
            className="group relative p-6 border-[#E8E3F0]"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8D8792]">
                Schedule
              </p>
              <h2 className="mt-0.5 font-serif text-2xl md:text-3xl font-bold text-[#17151C] tracking-tight">
                Today’s Plan
              </h2>
            </div>

            <div className="mt-5 space-y-3.5">
              <PlanItem time="09:00" label="Lectures & Class" tone="blue" />
              <PlanItem time="12:30" label="Lunch & Walk" tone="peach" />
              <PlanItem time="14:00" label="Project UI Studio" tone="lavender" />
              <PlanItem time="18:00" label="Evening Workout / Read" tone="green" />
            </div>

            <Link
              to="/planner"
              className="mt-5 flex items-center justify-between rounded-xl bg-[#EEEAFE] px-4 py-2.5 text-xs font-semibold text-[#17151C] hover:bg-[#E3DCFA] border border-[#DDD8F2] transition"
            >
              <span>View full schedule</span>
              <ArrowRight size={14} className="text-[#9E96D8]" />
            </Link>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            TASKS + HABITS
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          {/* TASKS */}
          <Card
            variant="pink"
            hoverEffect
            className="group relative p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8D8792]">
                  Action Items
                </p>
                <h2 className="mt-0.5 font-serif text-2xl md:text-3xl font-bold text-[#17151C] tracking-tight">
                  My Tasks
                </h2>
              </div>

              <Link
                to="/tasks"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-[#17151C] shadow-2xs border border-white hover:bg-white transition hover:-translate-y-0.5"
                aria-label="Add task"
              >
                <Plus size={17} />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {tasks.length === 0 ? (
                <div className="rounded-xl border border-white/80 bg-white/70 p-4 text-center">
                  <p className="text-xs font-medium text-[#5F5965]">
                    No tasks yet. Enjoy your clear day!
                  </p>
                </div>
              ) : (
                tasks.slice(0, 4).map((task) => (
                  <DashboardTask
                    key={task.id}
                    title={task.title}
                    completed={task.completed}
                  />
                ))
              )}
            </div>

            <Link
              to="/tasks"
              className="mt-4 flex items-center justify-between rounded-xl bg-white/85 px-4 py-2.5 text-xs font-semibold text-[#17151C] hover:bg-white border border-[#F2D8E4] transition"
            >
              <span>Open Task Manager</span>
              <ArrowRight size={14} className="text-[#D99BB8]" />
            </Link>
          </Card>

          {/* HABITS */}
          <Card
            variant="default"
            hoverEffect
            className="group relative p-6 border-[#DCE8E0] bg-gradient-to-br from-[#F2F8F5] to-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8D8792]">
                  Daily Rituals
                </p>
                <h2 className="mt-0.5 font-serif text-2xl md:text-3xl font-bold text-[#17151C] tracking-tight">
                  Habits
                </h2>
              </div>

              <div className="rounded-xl bg-[#CCE5DC]/60 p-2 text-[#2D5A46] border border-[#CCE5DC]">
                <Leaf size={17} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold tracking-tight text-[#17151C]">
                  {habitProgress}%
                </span>
                <span className="text-xs font-semibold text-[#8D8792]">
                  completed today
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5EFEA]">
                <div
                  className="h-full rounded-full bg-[#528D6F] transition-all duration-700"
                  style={{ width: `${habitProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <HabitRow emoji="🏃🏻‍♀️" label="Workout Session" progress={80} />
              <HabitRow emoji="📖" label="Read 20 Pages" progress={60} />
              <HabitRow emoji="💧" label="Drink 2L Water" progress={100} />
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#5F5965] border-t border-[#E8E3F0] pt-3">
              <Flame size={14} className="text-[#D99BB8]" />
              {bestHabitStreak > 0
                ? `${bestHabitStreak} day best streak`
                : "Start your streak today"}
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            READING + DIARY + UPCOMING
        ═══════════════════════════════════════ */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {/* READING */}
          <Card
            variant="blue"
            hoverEffect
            className="group relative p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#5F5965]">
                  Curated
                </p>
                <h2 className="mt-0.5 font-serif text-2xl font-bold text-[#17151C] tracking-tight">
                  Reading
                </h2>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 border border-white text-[#5F5965]">
                <BookOpen size={16} />
              </div>
            </div>

            <div className="mt-4 flex gap-3.5 items-center">
              <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-xl bg-[#17151C] text-[10px] font-bold tracking-widest text-[#EEEAFE] shadow-sm">
                BOOK
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#17151C] truncate">
                  Atomic Habits
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[#5F5965] truncate">
                  James Clear • Pg 142/320
                </p>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div className="h-full w-[44%] rounded-full bg-[#9E96D8]" />
                </div>
              </div>
            </div>

            <Link
              to="/reading"
              className="mt-5 flex items-center justify-between rounded-xl bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#17151C] hover:bg-white border border-white transition"
            >
              <span>Open library</span>
              <ArrowRight size={13} className="text-[#9E96D8]" />
            </Link>
          </Card>

          {/* DIARY */}
          <Card
            variant="peach"
            hoverEffect
            className="group relative p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#5F5965]">
                  Journal
                </p>
                <h2 className="mt-0.5 font-serif text-2xl font-bold text-[#17151C] tracking-tight">
                  Diary
                </h2>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 border border-white text-[#5F5965]">
                <PenLine size={16} />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/80 p-3.5 border border-white/90 shadow-2xs">
              <p className="text-xs font-medium leading-relaxed text-[#5F5965] line-clamp-3">
                "A quiet place to reflect, capture fleeting moments, and pause amid the busy semester."
              </p>
            </div>

            <Link
              to="/diary"
              className="mt-5 flex items-center justify-between rounded-xl bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#17151C] hover:bg-white border border-white transition"
            >
              <span>Write today</span>
              <PenLine size={13} className="text-[#D99BB8]" />
            </Link>
          </Card>

          {/* UPCOMING */}
          <Card
            variant="pearl"
            hoverEffect
            className="group relative p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8D8792]">
                  Agenda
                </p>
                <h2 className="mt-0.5 font-serif text-2xl font-bold text-[#17151C] tracking-tight">
                  Upcoming
                </h2>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] text-[#9E96D8]">
                <CalendarDays size={16} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <UpcomingItem to="/exams" title="Algorithm Exam" date="Oct 8" />
              <UpcomingItem to="/projects" title="Design Review" date="Oct 10" />
              <UpcomingItem to="/reflection" title="Weekly Reflection" date="Oct 12" />
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            LUMI EDITORIAL BANNER
        ═══════════════════════════════════════ */}
        <section className="mt-4">
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#DCD8F2] bg-gradient-to-r from-[#EEEAFE] via-[#F8E8F0] to-[#EEF3FA] px-5 py-4 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#9E96D8] border border-white shadow-2xs">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8D8792]">
                Lumi Note
              </p>
              <p className="mt-0.5 font-serif text-base sm:text-lg font-semibold text-[#17151C]">
                “Small deliberate steps create quiet masterpieces.”
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════
          FLOATING QUICK ACCESS DOCK
      ═══════════════════════════════════════ */}
      <div className="fixed bottom-5 left-1/2 z-50 w-auto -translate-x-1/2">
        {showDockMenu && (
          <div className="absolute bottom-[calc(100%+12px)] left-1/2 w-60 -translate-x-1/2 rounded-2xl border border-[#E8E3F0] bg-white/95 p-2 shadow-[0_20px_50px_rgba(80,70,120,0.18)] backdrop-blur-xl lumi-animate-fade-up">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
              All Spaces
            </div>
            <div className="grid grid-cols-2 gap-1">
              <DockMenuItem to="/notes" label="Notes" icon="📝" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/brain-dump" label="Brain Dump" icon="🧠" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/memories" label="Memories" icon="💭" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/reflection" label="Reflection" icon="💡" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/calendar" label="Calendar" icon="📅" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/music" label="Music" icon="🎵" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/exams" label="Exams" icon="📚" onClick={() => setShowDockMenu(false)} />
              <DockMenuItem to="/focus" label="Focus" icon="⏱️" onClick={() => setShowDockMenu(false)} />
            </div>
          </div>
        )}

        <nav className="flex w-fit items-center gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-[0_12px_36px_rgba(80,70,120,0.12)] backdrop-blur-xl">
          <DockLink to="/dashboard" icon="⌂" label="Home" active />
          <DockLink to="/planner" icon="☷" label="Planner" />
          <DockLink to="/tasks" icon="✓" label="Tasks" />
          <DockLink to="/habits" icon="🌱" label="Habits" />
          <DockLink to="/goals" icon="🎯" label="Goals" />
          <DockLink to="/reading" icon="📖" label="Reading" />
          <DockLink to="/diary" icon="✎" label="Diary" />

          <button
            type="button"
            onClick={() => setShowDockMenu((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
              showDockMenu
                ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2]"
                : "text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C]"
            }`}
            aria-label="More Lumi tools"
          >
            <Menu size={16} />
          </button>

          <div className="mx-0.5 h-5 w-px bg-[#E8E3F0]" />

          <Link
            to="/planner"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17151C] text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-95"
            aria-label="Quick add"
          >
            <Plus size={16} />
          </Link>
        </nav>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MINI STAT CARD
═══════════════════════════════════════════════ */

function MiniStat({
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
  tone: "pink" | "blue" | "green" | "lavender";
  progress?: number;
}) {
  const tones = {
    pink: {
      card: "card-pink",
      iconBg: "bg-white text-[#D99BB8]",
      accent: "bg-[#D99BB8]",
    },
    blue: {
      card: "card-blue",
      iconBg: "bg-white text-[#6B9AB8]",
      accent: "bg-[#6B9AB8]",
    },
    green: {
      card: "bg-gradient-to-br from-[#E6F4ED] to-[#F3F9F6] border border-[#CCE5DC]",
      iconBg: "bg-white text-[#4A7D63]",
      accent: "bg-[#4A7D63]",
    },
    lavender: {
      card: "card-lavender",
      iconBg: "bg-white text-[#9E96D8]",
      accent: "bg-[#9E96D8]",
    },
  };

  const current = tones[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl border p-5 lumi-shadow-sm lumi-card-hover ${current.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5F5965]">
            {label}
          </p>
          <p className="mt-1.5 truncate text-2xl font-bold tracking-tight text-[#17151C]">
            {value}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
            {subtext}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-2xs border border-white ${current.iconBg}`}
        >
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/70">
          <div
            className={`h-full rounded-full ${current.accent} transition-all duration-700`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WEEKLY CHART
═══════════════════════════════════════════════ */

function WeeklyChart() {
  return (
    <div className="relative h-[135px]">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
        <span className="border-t border-dashed border-[#B8B3E8]" />
        <span className="border-t border-dashed border-[#B8B3E8]" />
        <span className="border-t border-dashed border-[#B8B3E8]" />
      </div>

      <svg
        viewBox="0 0 700 135"
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lumiWeeklyGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#9E96D8" />
            <stop offset="50%" stopColor="#E8B9CD" />
            <stop offset="100%" stopColor="#B8D4E8" />
          </linearGradient>
          <linearGradient id="lumiAreaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9E96D8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9E96D8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path
          d="M10 95 C75 85, 95 78, 120 72 S175 60, 220 68 S275 90, 315 65 S370 35, 415 50 S470 75, 515 45 S575 22, 610 38 S665 55, 690 25 L690 135 L10 135 Z"
          fill="url(#lumiAreaGrad)"
        />

        <path
          d="M10 95 C75 85, 95 78, 120 72 S175 60, 220 68 S275 90, 315 65 S370 35, 415 50 S470 75, 515 45 S575 22, 610 38 S665 55, 690 25"
          fill="none"
          stroke="url(#lumiWeeklyGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <circle cx="690" cy="25" r="4.5" fill="#9E96D8" stroke="#FFFFFF" strokeWidth="2" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[10px] font-semibold text-[#8D8792]">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PLAN ITEM
═══════════════════════════════════════════════ */

function PlanItem({
  time,
  label,
  tone,
}: {
  time: string;
  label: string;
  tone: "blue" | "peach" | "lavender" | "green";
}) {
  const dotColors = {
    blue: "bg-[#B8D4E8] shadow-[0_0_8px_#B8D4E8]",
    peach: "bg-[#F1D2C9] shadow-[0_0_8px_#F1D2C9]",
    lavender: "bg-[#9E96D8] shadow-[0_0_8px_#9E96D8]",
    green: "bg-[#8BC8A8] shadow-[0_0_8px_#8BC8A8]",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/70 p-2.5 border border-[#E8E3F0]">
      <span className="w-11 text-[11px] font-semibold text-[#8D8792]">
        {time}
      </span>
      <span className={`h-2 w-2 rounded-full ${dotColors[tone]}`} />
      <span className="text-xs font-semibold text-[#17151C]">
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD TASK
═══════════════════════════════════════════════ */

function DashboardTask({
  title,
  completed,
}: {
  title: string;
  completed: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/80 bg-white/85 px-3.5 py-2.5 transition hover:-translate-y-0.5 hover:bg-white shadow-2xs">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
          completed
            ? "bg-[#D99BB8] text-white"
            : "border border-[#E8E3F0] bg-white"
        }`}
      >
        {completed && <Check size={12} strokeWidth={2.5} />}
      </div>

      <span
        className={`min-w-0 flex-1 text-xs font-medium ${
          completed ? "text-[#8D8792] line-through" : "text-[#17151C]"
        }`}
      >
        {title}
      </span>

      <ChevronRight
        size={14}
        className="text-[#8D8792] opacity-0 transition group-hover:opacity-100"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HABIT ROW
═══════════════════════════════════════════════ */

function HabitRow({
  emoji,
  label,
  progress,
}: {
  emoji: string;
  label: string;
  progress: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{emoji}</span>
      <span className="flex-1 text-xs font-medium text-[#17151C]">
        {label}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#CCE5DC]/60">
        <div
          className="h-full rounded-full bg-[#528D6F]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   UPCOMING ITEM
═══════════════════════════════════════════════ */

function UpcomingItem({
  title,
  date,
  to,
}: {
  title: string;
  date: string;
  to?: string;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-xl border border-[#E8E3F0] bg-white/80 px-3.5 py-2.5 transition duration-200 hover:-translate-y-0.5 hover:bg-white shadow-2xs">
      <span className="text-xs font-semibold text-[#17151C]">
        {title}
      </span>
      <span className="rounded-md bg-[#EEEAFE] px-2 py-0.5 text-[10px] font-bold text-[#9E96D8]">
        {date}
      </span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}

/* ═══════════════════════════════════════════════
   HEADER ICON BUTTON
═══════════════════════════════════════════════ */

function DashboardIconButton({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E3F0] bg-white/80 text-[#5F5965] shadow-2xs transition hover:-translate-y-0.5 hover:bg-white hover:text-[#17151C] cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   DOCK LINK
═══════════════════════════════════════════════ */

function DockLink({
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
      className={`group flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs transition cursor-pointer ${
        active
          ? "bg-[#EEEAFE] text-[#17151C] font-semibold border border-[#DDD8F2] shadow-2xs"
          : "text-[#5F5965] hover:bg-white/80 hover:text-[#17151C]"
      }`}
    >
      <span className="text-sm leading-none">{icon}</span>
      <span className="ml-1.5 hidden text-[11px] font-semibold lg:block">
        {label}
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   DOCK MENU ITEM
═══════════════════════════════════════════════ */

function DockMenuItem({
  to,
  label,
  icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-[#5F5965] transition hover:bg-[#EEEAFE] hover:text-[#17151C]"
    >
      <span className="text-sm">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}