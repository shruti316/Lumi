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

const UI_FONT = {
  fontFamily: "'Manrope', sans-serif",
};

export default function Dashboard() {
  const [tasks] = useState<Task[]>(() => getTasks());
  const [habits] = useState<Habit[]>(() => getHabits());
  const [showDockMenu, setShowDockMenu] = useState(false);

  /* ───────────────── DATA ───────────────── */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const taskProgress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const completedHabits = habits.filter((habit) =>
    habit.completedDates.includes(todayString)
  ).length;

  const totalHabits = habits.length;

  const habitProgress =
    totalHabits === 0
      ? 0
      : Math.round((completedHabits / totalHabits) * 100);

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
    habitStreaks.length > 0
      ? Math.max(...habitStreaks)
      : 0;

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
    <div className="min-h-screen bg-transparent pb-28">
      <div className="mx-auto max-w-[1450px] px-5 py-6 md:px-8 md:py-7">

        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}

        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[13px] font-bold tracking-wide text-[#806C79]">
              {formattedDate}
            </p>

            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] md:text-5xl">
              {greeting}, Shru!
            </h1>

            <p className="mt-1 font-caveat text-xl sm:text-2xl font-bold text-[#806C79]">
              Here’s what’s happening today.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <DashboardIconButton>
              <Search size={18} />
            </DashboardIconButton>

            <DashboardIconButton>
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C1A0AC]" />
            </DashboardIconButton>

            <DashboardIconButton>
              <CircleUserRound size={18} />
            </DashboardIconButton>
          </div>
        </header>


        {/* ═══════════════════════════════════════
            TOP STAT CARDS
        ═══════════════════════════════════════ */}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <MiniStat
            label="Today's Goal"
            value="Project UI"
            subtext="Keep moving forward"
            icon={<Target size={20} />}
            tone="blue"
          />

          <MiniStat
            label="Tasks"
            value={`${completedTasks}/${totalTasks}`}
            subtext={`${taskProgress}% completed`}
            icon={<Check size={20} />}
            tone="pink"
            progress={taskProgress}
          />

          <MiniStat
            label="Habits"
            value={`${completedHabits}/${totalHabits}`}
            subtext={
              bestHabitStreak > 0
                ? `${bestHabitStreak} day streak`
                : "Start your streak today"
            }
            icon={<Leaf size={20} />}
            tone="green"
            progress={habitProgress}
          />

          <MiniStat
            label="Focus"
            value="2h"
            subtext="Keep the momentum going"
            icon={<Clock3 size={20} />}
            tone="peach"
          />

        </section>


        {/* ═══════════════════════════════════════
            WEEKLY + TODAY'S PLAN
        ═══════════════════════════════════════ */}

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">

          {/* WEEKLY OVERVIEW */}

          <Card
            className="group overflow-hidden !border-[#BAB0C8] !bg-[#DAD4DF] p-5 shadow-[0_7px_25px_rgba(72,58,70,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(72,58,70,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#312A44]">
                  Overview
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#312A44]">
                  Weekly overview
                </h2>
              </div>

              <span className="rounded-full bg-[#BAB0C8] px-3 py-1.5 text-[10px] font-bold text-[#4A3F4B]">
                This week
              </span>
            </div>

            <div className="mt-4">
              <WeeklyChart />
            </div>

            <div className="mt-3 flex gap-5 text-[11px] font-semibold text-[#806C79]">
              <span>
                <strong className="font-extrabold text-[#312A44]">
                  12
                </strong>{" "}
                tasks
              </span>

              <span>
                <strong className="font-extrabold text-[#312A44]">
                  8
                </strong>{" "}
                habits
              </span>

              <span>
                <strong className="font-extrabold text-[#312A44]">
                  6.4h
                </strong>{" "}
                focus
              </span>
            </div>
          </Card>


          {/* TODAY'S PLAN */}

          <Card
            className="group !border-[#D7C5D2] !bg-[#DAD4DF] p-5 shadow-[0_7px_25px_rgba(72,58,70,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(72,58,70,0.10)]"
            style={UI_FONT}
          >
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                Schedule
              </p>

              <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#312A44]">
                Today’s plan
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <PlanItem
                time="09:00"
                label="Classes"
                tone="blue"
              />

              <PlanItem
                time="12:00"
                label="Lunch break"
                tone="peach"
              />

              <PlanItem
                time="14:00"
                label="Project work"
                tone="lavender"
              />

              <PlanItem
                time="17:00"
                label="Gym / personal time"
                tone="green"
              />
            </div>
          </Card>

        </section>


        {/* ═══════════════════════════════════════
            TASKS + HABITS
        ═══════════════════════════════════════ */}

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">

          {/* TASKS */}

          <Card
            className="group !border-[#C1A0AC] !bg-[#F0D9E4] p-5 shadow-[0_7px_25px_rgba(72,58,70,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(72,58,70,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                  Today
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#312A44]">
                  My tasks
                </h2>
              </div>

              <Link
                to="/planner"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D7C5D2] text-[#4A3F4B] transition hover:-translate-y-0.5 hover:bg-[#C1A0AC]"
              >
                <Plus size={17} />
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {tasks.length === 0 ? (
                <>
                  <DashboardTask
                    title="Add your first task"
                    completed={false}
                  />

                  <p className="px-1 text-[11px] font-medium text-[#806C79]">
                    Your Planner tasks will appear here.
                  </p>
                </>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <DashboardTask
                    key={task.id}
                    title={task.title}
                    completed={task.completed}
                  />
                ))
              )}
            </div>

            <Link
              to="/planner"
              className="mt-4 flex items-center justify-between rounded-xl bg-[#D7C5D2] px-3.5 py-2.5 text-[11px] font-extrabold text-[#4A3F4B] transition hover:bg-[#C1A0AC]"
            >
              Open planner
              <ArrowRight size={14} />
            </Link>
          </Card>


          {/* HABITS */}

          <Card
            className="group !border-[#BAB0C8] !bg-[#DCE8E0] p-5 shadow-[0_7px_25px_rgba(72,58,70,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(72,58,70,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                  Routine
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#16131F]">
                  Habits
                </h2>
              </div>

              <div className="rounded-xl bg-[#DAD4DF] p-2 text-[#4A3F4B]">
                <Leaf size={18} />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-end justify-between">
                <span className="text-[34px] font-extrabold tracking-[-0.045em] text-[#16131F]">
                  {habitProgress}%
                </span>

                <span className="text-[10px] font-bold text-[#806C79]">
                  today
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#DAD4DF]">
                <div
                  className="h-full rounded-full bg-[#4A6E53] transition-all duration-700"
                  style={{
                    width: `${habitProgress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <HabitRow
                emoji="🏃🏻‍♀️"
                label="Workout"
                progress={80}
              />

              <HabitRow
                emoji="📖"
                label="Reading"
                progress={60}
              />

              <HabitRow
                emoji="💧"
                label="Water"
                progress={100}
              />
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-[#4A3F4B]">
              <Flame
                size={14}
                className="text-[#806C79]"
              />

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
            className="group !border-[#BAB0C8] !bg-[#DAD4DF] p-5 shadow-[0_7px_25px_rgba(72,58,90,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(72,58,90,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                  Library
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#16131F]">
                  Reading
                </h2>
              </div>

              <BookOpen
                size={19}
                className="text-[#4A3F4B]"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16131F] to-[#806C79] text-[10px] font-extrabold text-[#F4F0EB] shadow-sm">
                BOOK
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-[#16131F]">
                  Currently reading
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
                  Add a book to see it here.
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#BAB0C8]">
                  <div className="h-full w-0 rounded-full bg-[#806C79]" />
                </div>
              </div>
            </div>

            <Link
              to="/reading"
              className="mt-4 flex items-center justify-between rounded-xl bg-[#BAB0C8] px-3.5 py-2.5 text-[11px] font-extrabold text-[#16131F] hover:bg-[#C1A0AC]"
            >
              Open library
              <ArrowRight size={14} />
            </Link>
          </Card>


          {/* DIARY */}

          <Card
            className="group !border-[#C1A0AC] !bg-[#F2DFD0] p-5 shadow-[0_7px_25px_rgba(100,75,50,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(100,75,50,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                  Personal
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#16131F]">
                  Diary
                </h2>
              </div>

              <div className="rounded-xl bg-[#D7C5D2] p-2 text-[#4A3F4B]">
                <PenLine size={18} />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#F4F0EB] p-3.5 border border-[#E5CFBF]">
              <p className="text-[12px] font-semibold leading-6 text-[#806C79]">
                A quiet place to put down whatever is on your mind.
              </p>
            </div>

            <Link
              to="/diary"
              className="mt-4 flex items-center justify-between rounded-xl bg-[#C1A0AC] px-3.5 py-2.5 text-[11px] font-extrabold text-[#16131F] hover:bg-[#D7C5D2]"
            >
              Write today
              <PenLine size={14} />
            </Link>
          </Card>


          {/* UPCOMING */}

          <Card
            className="group !border-[#BAB0C8] !bg-[#DDEAF0] p-5 shadow-[0_7px_25px_rgba(60,90,110,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_14px_32px_rgba(60,90,110,0.10)]"
            style={UI_FONT}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4A3F4B]">
                  Coming up
                </p>

                <h2 className="mt-0.5 font-caveat text-3xl font-bold text-[#16131F]">
                  Upcoming
                </h2>
              </div>

              <CalendarDays
                size={19}
                className="text-[#4A3F4B]"
              />
            </div>

            <div className="mt-4 space-y-3">
              <UpcomingItem
                to="/exams"
                title="DAA Exam"
                date="Oct 8"
              />

              <UpcomingItem
                to="/projects"
                title="Project Review"
                date="Oct 10"
              />

              <UpcomingItem
                to="/reflection"
                title="Weekly Reflection"
                date="Oct 12"
              />
            </div>
          </Card>

        </section>


        {/* ═══════════════════════════════════════
            LUMI REMINDER
        ═══════════════════════════════════════ */}

        <section className="mt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#C1A0AC] bg-[#F0D9E4] px-5 py-4 shadow-[0_6px_24px_rgba(72,58,70,0.03)]">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D7C5D2] text-[#4A3F4B]">
              <Sparkles size={17} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#16131F]">
                A little Lumi reminder
              </p>

              <p className="mt-0.5 font-caveat text-xl font-bold text-[#806C79]">
                Small progress is still progress.
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
          <div className="absolute bottom-[calc(100%+12px)] left-1/2 w-56 -translate-x-1/2 rounded-2xl border border-[#312A44] bg-[#16131F]/98 p-2.5 shadow-[0_18px_45px_rgba(22,19,31,0.4)] backdrop-blur-xl">

            <DockMenuItem
              to="/notes"
              label="Notes"
              icon="📝"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/brain-dump"
              label="Brain Dump"
              icon="🧠"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/memories"
              label="Memories"
              icon="💭"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/reflection"
              label="Reflection"
              icon="💡"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/calendar"
              label="Calendar"
              icon="📅"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/music"
              label="Music"
              icon="🎵"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/exams"
              label="Exams"
              icon="📚"
              onClick={() => setShowDockMenu(false)}
            />

            <DockMenuItem
              to="/focus"
              label="Focus"
              icon="⏱️"
              onClick={() => setShowDockMenu(false)}
            />

          </div>
        )}


        <nav className="flex w-fit max-w-[720px] items-center gap-1 rounded-[22px] border border-[#312A44] bg-[#16131F]/98 p-2 shadow-[0_14px_40px_rgba(22,19,31,0.35)] backdrop-blur-xl">

          <DockLink
            to="/"
            icon="⌂"
            label="Home"
            active
          />

          <DockLink
            to="/planner"
            icon="☷"
            label="Planner"
          />

          <DockLink
            to="/tasks"
            icon="✓"
            label="Tasks"
          />

          <DockLink
            to="/habits"
            icon="🌱"
            label="Habits"
          />

          <DockLink
            to="/goals"
            icon="🎯"
            label="Goals"
          />

          <DockLink
            to="/reading"
            icon="📖"
            label="Reading"
          />

          <DockLink
            to="/diary"
            icon="✎"
            label="Diary"
          />

          <button
            type="button"
            onClick={() =>
              setShowDockMenu((value) => !value)
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              showDockMenu
                ? "bg-[#312A44] text-white"
                : "text-[#FAF8FC] hover:bg-[#211C2B] hover:text-white"
            }`}
            aria-label="More Lumi tools"
          >
            <Menu size={17} />
          </button>

          <div className="mx-1 h-6 w-px bg-[#312A44]" />

          <Link
            to="/planner"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1A0AC] text-[#16131F] transition hover:-translate-y-0.5 hover:bg-[#F0D9E4]"
            aria-label="Quick add"
          >
            <Plus size={18} />
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
  tone: "pink" | "blue" | "green" | "peach";
  progress?: number;
}) {

  const tones = {

    pink: {
      bg: "!bg-[#F0D9E4]",
      border: "!border-[#C1A0AC]",
      icon: "bg-[#D7C5D2] text-[#16131F]",
      accent: "bg-[#806C79]",
      label: "text-[#16131F]",
      value: "text-[#16131F]",
    },

    blue: {
      bg: "!bg-[#DDEAF0]",
      border: "!border-[#BAB0C8]",
      icon: "bg-[#BAB0C8] text-[#16131F]",
      accent: "bg-[#806C79]",
      label: "text-[#16131F]",
      value: "text-[#16131F]",
    },

    green: {
      bg: "!bg-[#DCE8E0]",
      border: "!border-[#BAB0C8]",
      icon: "bg-[#DAD4DF] text-[#16131F]",
      accent: "bg-[#4A6E53]",
      label: "text-[#16131F]",
      value: "text-[#16131F]",
    },

    peach: {
      bg: "!bg-[#F2DFD0]",
      border: "!border-[#BAB0C8]",
      icon: "bg-[#D7C5D2] text-[#16131F]",
      accent: "bg-[#806C79]",
      label: "text-[#16131F]",
      value: "text-[#16131F]",
    },

  };

  const current = tones[tone];

  return (
    <Card
      className={`group relative overflow-hidden border ${current.border} ${current.bg} p-5 shadow-[0_6px_22px_rgba(72,58,70,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.012] hover:shadow-[0_14px_32px_rgba(72,58,70,0.11)]`}
      style={UI_FONT}
    >

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p
            className={`text-[15px] sm:text-[16px] font-extrabold italic uppercase tracking-[0.12em] ${current.label}`}
          >
            {label}
          </p>

          <p
            className={`mt-2.5 truncate text-[25px] font-extrabold tracking-[-0.045em] ${current.value}`}
          >
            {value}
          </p>

          <p className="mt-1.5 text-[11px] font-semibold text-[#806C79]">
            {subtext}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${current.icon}`}
        >
          {icon}
        </div>

      </div>

      {progress !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F4F0EB]/60">

          <div
            className={`h-full rounded-full ${current.accent} transition-all duration-700`}
            style={{
              width: `${progress}%`,
            }}
          />

        </div>
      )}

    </Card>
  );
}


/* ═══════════════════════════════════════════════
   WEEKLY CHART
═══════════════════════════════════════════════ */

function WeeklyChart() {
  return (
    <div className="relative h-[145px]">

      <div className="absolute inset-0 flex flex-col justify-between">

        <span className="border-t border-dashed border-[#BAB0C8]" />
        <span className="border-t border-dashed border-[#BAB0C8]" />
        <span className="border-t border-dashed border-[#BAB0C8]" />
        <span className="border-t border-dashed border-[#BAB0C8]" />

      </div>

      <svg
        viewBox="0 0 700 145"
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >

        <defs>

          <linearGradient
            id="lumiChartGradient"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >

            <stop
              offset="0%"
              stopColor="#312A44"
            />

            <stop
              offset="100%"
              stopColor="#806C79"
            />

          </linearGradient>

        </defs>

        <path
          d="M10 105 C75 95, 95 88, 120 82 S175 70, 220 78 S275 100, 315 75 S370 42, 415 60 S470 85, 515 55 S575 28, 610 45 S665 65, 690 30"
          fill="none"
          stroke="url(#lumiChartGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle
          cx="690"
          cy="30"
          r="4.5"
          fill="#806C79"
        />

      </svg>

      <div className="absolute bottom-[-2px] left-0 right-0 flex justify-between px-1 text-[10px] font-semibold text-[#806C79]">

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

  const colors = {
    blue: "bg-[#806C79]",
    peach: "bg-[#4A3F4B]",
    lavender: "bg-[#312A44]",
    green: "bg-[#4A3F4B]",
  };

  return (
    <div className="flex items-center gap-3">

      <span className="w-10 text-[10px] font-bold text-[#806C79]">
        {time}
      </span>

      <span
        className={`h-2 w-2 rounded-full ${colors[tone]}`}
      />

      <span className="text-[11px] font-bold text-[#312A44]">
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
    <div className="group flex items-center gap-3 rounded-xl border border-[#C1A0AC] bg-[#F4F0EB]/70 px-3.5 py-2.5 transition hover:-translate-y-0.5 hover:bg-[#F4F0EB]/88">

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-[#DAD4DF] text-[#4A3F4B]"
            : "border border-[#BAB0C8] bg-[#F4F0EB]/72"
        }`}
      >
        {completed && <Check size={12} />}
      </div>

      <span
        className={`min-w-0 flex-1 text-[11px] font-semibold ${
          completed
            ? "text-[#806C79] line-through"
            : "text-[#312A44]"
        }`}
      >
        {title}
      </span>

      <ChevronRight
        size={13}
        className="text-[#806C79] opacity-0 transition group-hover:opacity-100"
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
    <div className="flex items-center gap-2.5">

      <span className="text-sm">
        {emoji}
      </span>

      <span className="flex-1 text-[11px] font-bold text-[#4A3F4B]">
        {label}
      </span>

      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#BAB0C8]">

        <div
          className="h-full rounded-full bg-[#806C79]"
          style={{
            width: `${progress}%`,
          }}
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
    <div className="flex items-center justify-between rounded-xl border border-[#BAB0C8] bg-[#F4F0EB]/60 px-3 py-2.5 transition duration-200 hover:-translate-y-0.5 hover:bg-[#F4F0EB] hover:shadow-2xs">
      <span className="text-[11px] font-bold text-[#312A44]">
        {title}
      </span>

      <span className="text-[10px] font-extrabold text-[#4A3F4B]">
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
}: {
  children: React.ReactNode;
}) {

  return (
    <button
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] text-[#312A44] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#DAD4DF]"
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
      className={`group flex h-10 min-w-10 items-center justify-center rounded-xl px-2.5 transition ${
        active
          ? "bg-[#DAD4DF] text-[#16131F] font-bold shadow-2xs"
          : "text-[#FAF8FC] hover:bg-[#211C2B] hover:text-white"
      }`}
    >

      <span className="text-[15px] leading-none">
        {icon}
      </span>

      <span className="ml-1.5 hidden text-[10px] font-bold lg:block">
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
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#FAF8FC] transition hover:bg-[#312A44] hover:text-white"
    >

      <span className="text-sm">
        {icon}
      </span>

      <span>{label}</span>

    </Link>
  );
}