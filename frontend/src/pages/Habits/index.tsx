import { useState, useEffect } from "react";
import {
  Check,
  Flame,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  emoji?: string;
  category?: string;
  color?: string;
  targetDaysPerWeek?: number;
  completedDates: string[];
  createdAt?: string;
}

const HABIT_EMOJIS = [
  "💧",
  "📚",
  "🏃",
  "🧘",
  "💻",
  "🥗",
  "😴",
  "✍️",
  "🌱",
  "🎧",
  "☀️",
  "🍵",
  "🚶‍♀️",
  "🎯",
  "✨",
];

const SUGGESTIONS = [
  { emoji: "💧", name: "Drink 2L Water" },
  { emoji: "📚", name: "Read 20 pages" },
  { emoji: "🏃", name: "30m Workout" },
  { emoji: "🧘", name: "10m Mindfulness" },
  { emoji: "💻", name: "Study / Focus 1hr" },
  { emoji: "😴", name: "Sleep by 11:30 PM" },
  { emoji: "🥗", name: "Eat fresh fruit" },
  { emoji: "✍️", name: "Write in Diary" },
];

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getLast7Days() {
  const days: { dateStr: string; label: string; dayNum: number; isToday: boolean }[] = [];
  const todayStr = getTodayString();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      dateStr,
      label: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }
  return days;
}

function calculateStreak(habit: Habit) {
  const completed = new Set(habit.completedDates || []);
  let streak = 0;
  const date = new Date();

  while (true) {
    const dateString = date.toISOString().split("T")[0];
    if (!completed.has(dateString)) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");

  async function fetchHabits() {
    setLoading(true);
    const { data } = await api.habits.getAll();
    if (data?.habits) {
      setHabits(
        data.habits.map((h: any) => ({
          ...h,
          emoji: h.icon || h.emoji || "🌱",
          completedDates: h.completedDates || [],
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchHabits();
    window.addEventListener("lumi-sync", fetchHabits);
    return () => window.removeEventListener("lumi-sync", fetchHabits);
  }, []);

  const todayStr = getTodayString();
  const last7Days = getLast7Days();

  const completedTodayCount = habits.filter((h) =>
    (h.completedDates || []).includes(todayStr)
  ).length;

  const progress =
    habits.length === 0
      ? 0
      : Math.round((completedTodayCount / habits.length) * 100);

  const streaks = habits.map((h) => calculateStreak(h));
  const bestStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

  const totalPossibleChecks = habits.length * 7;
  let totalActualChecks = 0;
  if (totalPossibleChecks > 0) {
    last7Days.forEach((day) => {
      habits.forEach((h) => {
        if ((h.completedDates || []).includes(day.dateStr)) {
          totalActualChecks++;
        }
      });
    });
  }
  const weeklyConsistency =
    totalPossibleChecks === 0
      ? 0
      : Math.round((totalActualChecks / totalPossibleChecks) * 100);

  async function handleCreateHabit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const { data } = await api.habits.create({
      name: name.trim(),
      icon: emoji || "🌱",
      category: "Daily",
      targetDaysPerWeek: 7,
    });

    if (data?.habit) {
      setHabits((prev) => [
        {
          ...data.habit,
          emoji: data.habit.icon || emoji || "🌱",
          completedDates: data.habit.completedDates || [],
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "habit" } }));
    }

    setName("");
    setEmoji("🌱");
    setShowModal(false);
  }

  async function handleQuickAdd(suggested: { emoji: string; name: string }) {
    const exists = habits.some(
      (h) => h.name.toLowerCase() === suggested.name.toLowerCase()
    );
    if (exists) return;

    const { data } = await api.habits.create({
      name: suggested.name,
      icon: suggested.emoji,
      category: "Daily",
      targetDaysPerWeek: 7,
    });

    if (data?.habit) {
      setHabits((prev) => [
        {
          ...data.habit,
          emoji: data.habit.icon || suggested.emoji,
          completedDates: data.habit.completedDates || [],
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "habit" } }));
    }
  }

  async function handleToggleDate(habit: Habit, dateStr: string) {
    const isCompleted = (habit.completedDates || []).includes(dateStr);
    const updatedDates = isCompleted
      ? habit.completedDates.filter((d) => d !== dateStr)
      : [...(habit.completedDates || []), dateStr];

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, completedDates: updatedDates } : h))
    );

    await api.habits.toggle(habit.id, dateStr);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "habit" } }));
  }

  async function handleDelete(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await api.habits.delete(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "habit" } }));
  }

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#528D6F]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Daily Rituals & Consistency
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Daily <span className="font-editorial-italic font-normal text-[#9E96D8]">Habits</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Small positive rituals compound quietly into remarkable personal growth.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>New Habit</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Today's Completion
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {completedTodayCount}/{habits.length}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E5EFEA]">
              <div
                className="h-full rounded-full bg-[#528D6F] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Best Streak
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Flame size={19} className="text-[#D99BB8]" />
              {bestStreak} {bestStreak === 1 ? "day" : "days"}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Keep momentum high
            </p>
          </Card>

          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Active Habits
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {habits.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Tracked daily
            </p>
          </Card>

          <Card variant="pink" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              7-Day Consistency
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <TrendingUp size={19} className="text-[#9E96D8]" />
              {weeklyConsistency}%
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Past 7 days
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            QUICK ADD SUGGESTIONS (CHIPS)
        ═══════════════════════════════════════ */}
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-[#9E96D8]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5F5965]">
              Quick Inspiration
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => {
              const isAdded = habits.some(
                (h) => h.name.toLowerCase() === s.name.toLowerCase()
              );
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleQuickAdd(s)}
                  disabled={isAdded}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isAdded
                      ? "border-transparent bg-[#EEEAFE] text-[#8D8792] cursor-default opacity-60"
                      : "border-[#E8E3F0] bg-white text-[#17151C] hover:border-[#9E96D8] hover:bg-[#F7F5F8] shadow-2xs"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.name}</span>
                  {isAdded ? (
                    <Check size={12} className="text-[#528D6F]" />
                  ) : (
                    <Plus size={12} className="text-[#8D8792]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WEEKLY 7-DAY MATRIX HABIT LIST
        ═══════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : habits.length === 0 ? (
          <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
              <Sparkles size={22} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17151C]">No habits yet</h3>
            <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
              Start small by creating a simple 2-minute daily habit or choosing one from the suggestions above.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const streak = calculateStreak(habit);
              const isCompletedToday = (habit.completedDates || []).includes(todayStr);

              return (
                <Card
                  key={habit.id}
                  variant="default"
                  hoverEffect
                  className="p-4 bg-white border-[#E8E3F0]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Habit Info & Today Check */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleDate(habit, todayStr)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition duration-200 cursor-pointer ${
                          isCompletedToday
                            ? "border-[#CCE5DC] bg-[#528F75] text-white shadow-2xs"
                            : "border-[#E8E3F0] bg-[#F7F5F8] text-lg hover:border-[#9E96D8]"
                        }`}
                      >
                        {isCompletedToday ? <Check size={18} strokeWidth={3} /> : habit.emoji || "🌱"}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              isCompletedToday ? "text-[#528D6F]" : "text-[#17151C]"
                            }`}
                          >
                            {habit.name}
                          </h4>
                          {streak > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-[#FEF5E7] px-2 py-0.5 text-[10px] font-bold text-[#9A644D] border border-[#F6E1C8]">
                              <Flame size={11} className="text-[#D99BB8]" />
                              {streak}d
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8D8792] font-medium">
                          {isCompletedToday ? "Completed today ✨" : "Tap circle to mark complete today"}
                        </p>
                      </div>
                    </div>

                    {/* 7-Day History Circles */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F7F5F8]">
                      <div className="flex items-center gap-1.5">
                        {last7Days.map((day) => {
                          const done = (habit.completedDates || []).includes(day.dateStr);
                          return (
                            <button
                              key={day.dateStr}
                              type="button"
                              onClick={() => handleToggleDate(habit, day.dateStr)}
                              title={`${day.label} (${day.dateStr}): ${done ? "Done" : "Missed"}`}
                              className={`flex flex-col items-center justify-center w-8 h-10 rounded-xl border transition cursor-pointer ${
                                done
                                  ? "border-[#CCE5DC] bg-[#EEF8F4] text-[#3E7D5C]"
                                  : day.isToday
                                  ? "border-[#DCD8F2] bg-[#EEEAFE]/50 text-[#17151C]"
                                  : "border-transparent bg-[#F7F5F8] text-[#8D8792] hover:bg-[#EEEAFE]"
                              }`}
                            >
                              <span className="text-[9px] font-bold uppercase">{day.label[0]}</span>
                              <span className="text-[10px] font-semibold">{day.dayNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(habit.id)}
                        className="p-2 rounded-xl text-[#8D8792] hover:text-[#D84C2C] hover:bg-[#FDECE8] transition ml-1 cursor-pointer"
                        title="Delete habit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════
            CREATE HABIT MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Habit"
          subtitle="One small step every day builds lasting momentum."
        >
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                What habit do you want to build? *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Morning stretch & 10 pushups"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                Pick an icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {HABIT_EMOJIS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    className={`flex h-10 items-center justify-center rounded-xl border text-lg transition cursor-pointer ${
                      emoji === item
                        ? "border-[#9E96D8] bg-[#EEEAFE] shadow-2xs scale-105"
                        : "border-[#E8E3F0] bg-white hover:bg-[#F7F5F8]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Add Habit
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}