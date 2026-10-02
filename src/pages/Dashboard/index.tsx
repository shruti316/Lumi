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

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const taskProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const today = new Date();

  const todayString = today.toISOString().split("T")[0];

  const completedHabits = habits.filter((habit) =>
    habit.completedDates.includes(todayString)
  ).length;

  const totalHabits = habits.length;

  const habitProgress =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedHabits / totalHabits) * 100
        );

  const habitStreaks = habits.map((habit) => {
    const completedDates = new Set(
      habit.completedDates
    );

    let streak = 0;
    const date = new Date();

    while (true) {
      const dateString = date
        .toISOString()
        .split("T")[0];

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

  const formattedDate = today.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  const firstName = "Shru";

  return (
    <div className="min-h-screen bg-[#fffafd]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 md:px-8 md:py-8">

        {/* ───────────────── HEADER ───────────────── */}

        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-[#d85d91]">
              {formattedDate}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#3f3340] md:text-4xl">
              Good morning, {firstName} 🌷
            </h1>

            <p className="mt-2 text-sm text-[#95838e] md:text-base">
              Here's what's happening today.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f2e5ec] bg-white text-[#8f7d88] shadow-sm transition hover:bg-[#fff5fa]"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f2e5ec] bg-white text-[#8f7d88] shadow-sm transition hover:bg-[#fff5fa]"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e879a9]" />
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f2e5ec] bg-white text-[#8f7d88] shadow-sm transition hover:bg-[#fff5fa]"
            >
              <CircleUserRound size={19} />
            </button>
          </div>
        </header>

        {/* ───────────────── STAT CARDS ───────────────── */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Tasks */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#fff0f7] to-white shadow-[0_8px_30px_rgba(216,93,145,0.08)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fce1ef]" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8f7d88]">
                    Tasks done
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#3f3340]">
                    {completedTasks}
                    <span className="text-lg font-medium text-[#ad9da6]">
                      {" "}
                      / {totalTasks}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 text-[#d85d91] shadow-sm">
                  <Check size={20} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-[#e879a9] transition-all"
                  style={{
                    width: `${taskProgress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-[#a18f99]">
                {taskProgress}% of today's tasks
              </p>
            </div>
          </Card>

          {/* Mood */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#f4efff] to-white shadow-[0_8px_30px_rgba(141,122,217,0.08)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e9e1ff]" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8f7d88]">
                    Today's mood
                  </p>

                  <p className="mt-2 text-4xl">
                    😊
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 text-[#8d7ad9] shadow-sm">
                  <Sparkles size={20} />
                </div>
              </div>

              <p className="mt-4 font-semibold text-[#3f3340]">
                Feeling good
              </p>

              <p className="mt-1 text-xs text-[#a18f99]">
                A little check-in for yourself
              </p>
            </div>
          </Card>

          {/* Habits */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#edf8ef] to-white shadow-[0_8px_30px_rgba(100,150,110,0.08)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#dff1e2]" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8f7d88]">
                    Habits
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#3f3340]">
                    {completedHabits}
                    <span className="text-lg font-medium text-[#ad9da6]">
                      {" "}
                      / {totalHabits}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 text-[#78a887] shadow-sm">
                  <Leaf size={20} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-[#78a887] transition-all"
                  style={{
                    width: `${habitProgress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Flame
                  size={16}
                  className={
                    bestHabitStreak > 0
                      ? "text-[#e89a62]"
                      : "text-[#c5b9be]"
                  }
                />

                <p className="text-xs font-medium text-[#8f7d88]">
                  {bestHabitStreak > 0
                    ? `${bestHabitStreak} day streak`
                    : "Start your streak today"}
                </p>
              </div>
            </div>
          </Card>

          {/* Focus */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#fff4e8] to-white shadow-[0_8px_30px_rgba(220,155,100,0.08)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#ffe9d2]" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8f7d88]">
                    Focus time
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#3f3340]">
                    2h
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 text-[#d89561] shadow-sm">
                  <Clock3 size={20} />
                </div>
              </div>

              <p className="mt-5 text-xs text-[#a18f99]">
                Keep going, you're doing well 🌷
              </p>
            </div>
          </Card>
        </section>

        {/* ───────────────── MAIN GRID ───────────────── */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">

          {/* Productivity */}
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#d85d91]">
                  Overview
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#3f3340]">
                  Your productivity
                </h2>

                <p className="mt-1 text-sm text-[#95838e]">
                  A little progress every day adds up.
                </p>
              </div>

              <button
                type="button"
                className="hidden items-center gap-1 rounded-xl bg-[#fff5fa] px-3 py-2 text-xs font-medium text-[#d85d91] sm:flex"
              >
                This week
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Simple visual chart */}
            <div className="mt-8">
              <div className="flex h-56 items-end justify-between gap-3 px-2">
                {[
                  {
                    day: "Mon",
                    height: "42%",
                  },
                  {
                    day: "Tue",
                    height: "58%",
                  },
                  {
                    day: "Wed",
                    height: "76%",
                  },
                  {
                    day: "Thu",
                    height: "62%",
                  },
                  {
                    day: "Fri",
                    height: "86%",
                  },
                  {
                    day: "Sat",
                    height: "78%",
                  },
                  {
                    day: "Sun",
                    height: "92%",
                  },
                ].map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-[#e879a9] to-[#f8c2da] transition-all hover:from-[#d96899] hover:to-[#f3b2d0]"
                        style={{
                          height: item.height,
                        }}
                      />
                    </div>

                    <span className="text-xs text-[#a18f99]">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#d85d91]">
                  Today
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#3f3340]">
                  To-do list
                </h2>
              </div>

              <Link
                to="/planner"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fce7f3] text-[#d85d91] transition hover:bg-[#f9d7e8]"
              >
                <Plus size={18} />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {tasks.length === 0 ? (
                <>
                  <DashboardTask
                    title="Add your first task"
                    completed={false}
                  />

                  <p className="px-1 text-xs text-[#a18f99]">
                    Your real tasks will appear here.
                  </p>
                </>
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
              to="/planner"
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#fff5fa] px-4 py-3 text-sm font-medium text-[#d85d91] transition hover:bg-[#fce7f3]"
            >
              Open planner
              <ArrowRight size={16} />
            </Link>
          </Card>
        </section>

        {/* ───────────────── LOWER CARDS ───────────────── */}

        <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Reading */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#d85d91]">
                  Reading
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#3f3340]">
                  Currently reading
                </h2>
              </div>

              <BookOpen
                size={20}
                className="text-[#d85d91]"
              />
            </div>

            <div className="mt-5 flex gap-4">
              <div className="flex h-32 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#d8c4f5] via-[#f2d6e8] to-[#f9c5d8] text-center text-xs font-semibold text-white shadow-sm">
                Your
                <br />
                next
                <br />
                story
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-[#3f3340]">
                  Your next favourite book
                </h3>

                <p className="mt-1 text-xs text-[#a18f99]">
                  Add a book to your library
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f7edf2]">
                  <div className="h-0 w-0 rounded-full bg-[#d85d91]" />
                </div>

                <p className="mt-2 text-xs text-[#a18f99]">
                  No book added yet
                </p>
              </div>
            </div>

            <Link
              to="/reading"
              className="mt-5 flex items-center justify-between rounded-xl bg-[#fff7fb] px-4 py-3 text-sm font-medium text-[#d85d91]"
            >
              Open my library
              <ArrowRight size={16} />
            </Link>
          </Card>

          {/* Diary */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#d89561]">
                  Diary
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#3f3340]">
                  Today's reflection
                </h2>
              </div>

              <div className="rounded-xl bg-[#fff1e5] p-2.5 text-[#d89561]">
                <PenLine size={18} />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff8f2] p-5">
              <p className="text-sm leading-6 text-[#8f7d88]">
                You haven't written today's entry yet.
                Take a few quiet minutes to put your
                thoughts somewhere safe. 🌷
              </p>
            </div>

            <Link
              to="/diary"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#fff1e5] px-4 py-3 text-sm font-medium text-[#c77f4f] transition hover:bg-[#ffe8d8]"
            >
              Write today's entry
              <PenLine size={16} />
            </Link>
          </Card>

          {/* Quick actions */}
          <Card>
            <div>
              <p className="text-sm font-medium text-[#8d7ad9]">
                Quick access
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#3f3340]">
                What do you want to do?
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <QuickAction
                icon={<CalendarDays size={18} />}
                label="Plan"
                to="/planner"
                color="pink"
              />

              <QuickAction
                icon={<PenLine size={18} />}
                label="Diary"
                to="/diary"
                color="peach"
              />

              <QuickAction
                icon={<Leaf size={18} />}
                label="Habits"
                to="/habits"
                color="green"
              />

              <QuickAction
                icon={<Target size={18} />}
                label="Goals"
                to="/goals"
                color="purple"
              />
            </div>
          </Card>
        </section>

        {/* ───────────────── MOTIVATION ───────────────── */}

        <section className="mt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#fce7f3] via-[#f3eaff] to-[#fff0e3] p-6 md:p-8">
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />

            <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[#d85d91]">
                  <Sparkles size={18} />

                  <span className="text-sm font-semibold">
                    A little Lumi reminder
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#3f3340] md:text-2xl">
                  You don't have to do everything today. 🌷
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8f7d88]">
                  Pick what matters, take it one step at a time,
                  and let the rest wait.
                </p>
              </div>

              <div className="text-6xl">
                🌷
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ───────────────── TASK COMPONENT ───────────────── */

function DashboardTask({
  title,
  completed,
}: {
  title: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#fff8fb] px-4 py-3">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-[#e8f5eb] text-[#78a887]"
            : "border border-[#eadde5] bg-white"
        }`}
      >
        {completed && <Check size={14} />}
      </div>

      <span
        className={`min-w-0 flex-1 text-sm ${
          completed
            ? "text-[#a18f99] line-through"
            : "text-[#4c3e48]"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

/* ───────────────── QUICK ACTION ───────────────── */

function QuickAction({
  icon,
  label,
  to,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  color: "pink" | "peach" | "green" | "purple";
}) {
  const styles = {
    pink: "bg-[#fce7f3] text-[#d85d91]",
    peach: "bg-[#fff1e5] text-[#d89561]",
    green: "bg-[#e8f5eb] text-[#78a887]",
    purple: "bg-[#eee9ff] text-[#8d7ad9]",
  };

  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-2xl border border-[#f2e5ec] bg-white p-3 text-sm font-medium text-[#4c3e48] transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles[color]}`}
      >
        {icon}
      </span>

      {label}
    </Link>
  );
}