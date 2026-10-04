import { useState } from "react";
import {
  Check,
  Flame,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  addHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  type Habit,
} from "../../lib/habitStorage";

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
  const completed = new Set(habit.completedDates);
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
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");

  const todayStr = getTodayString();
  const last7Days = getLast7Days();

  const completedTodayCount = habits.filter((h) =>
    h.completedDates.includes(todayStr)
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
        if (h.completedDates.includes(day.dateStr)) {
          totalActualChecks++;
        }
      });
    });
  }
  const weeklyConsistency =
    totalPossibleChecks === 0
      ? 0
      : Math.round((totalActualChecks / totalPossibleChecks) * 100);

  function handleCreateHabit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji: emoji || "🌱",
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    setHabits(getHabits());
    setName("");
    setEmoji("🌱");
    setShowModal(false);
  }

  function handleQuickAdd(suggested: { emoji: string; name: string }) {
    const exists = habits.some(
      (h) => h.name.toLowerCase() === suggested.name.toLowerCase()
    );
    if (exists) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: suggested.name,
      emoji: suggested.emoji,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    setHabits(getHabits());
  }

  function handleToggleDate(habit: Habit, dateStr: string) {
    const isCompleted = habit.completedDates.includes(dateStr);
    const updatedDates = isCompleted
      ? habit.completedDates.filter((d) => d !== dateStr)
      : [...habit.completedDates, dateStr];

    const updated = { ...habit, completedDates: updatedDates };
    updateHabit(updated);
    setHabits(getHabits());
  }

  function handleDelete(id: string) {
    deleteHabit(id);
    setHabits(getHabits());
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

          <Card variant="blue" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              7-Day Consistency
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <TrendingUp size={18} className="text-[#6B9AB8]" />
              {weeklyConsistency}%
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Weekly adherence
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            QUICK SUGGESTIONS CHIPS
        ═══════════════════════════════════════ */}
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-[#9E96D8]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D8792]">
              Quick Habit Ideas • Click to Add
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => {
              const alreadyAdded = habits.some(
                (h) => h.name.toLowerCase() === s.name.toLowerCase()
              );
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => !alreadyAdded && handleQuickAdd(s)}
                  disabled={alreadyAdded}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    alreadyAdded
                      ? "border-[#E8E3F0] bg-[#EEEAFE]/50 text-[#8D8792] opacity-60 cursor-default"
                      : "border-[#E8E3F0] bg-white/90 text-[#17151C] shadow-2xs hover:-translate-y-0.5 hover:bg-[#EEEAFE] hover:border-[#DDD8F2]"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.name}</span>
                  {alreadyAdded ? (
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
            HABITS LIST / 7-DAY MATRIX
        ═══════════════════════════════════════ */}
        {habits.length === 0 ? (
          <Card variant="lavender" className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-2xs border border-white">
              🌱
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#17151C]">
              No habits created yet
            </h3>
            <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#5F5965]">
              Pick from the quick ideas above or create your own custom habit to start building your daily streak!
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
            >
              <Plus size={15} />
              <span>Create My First Habit</span>
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* 7-Day Header guide on desktop */}
            <div className="hidden md:flex items-center justify-between px-5 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
              <span>Habit Details</span>
              <div className="flex items-center gap-2 pr-12">
                {last7Days.map((d) => (
                  <div
                    key={d.dateStr}
                    className={`w-8 text-center ${
                      d.isToday ? "font-bold text-[#9E96D8]" : ""
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-[9px] opacity-75">{d.dayNum}</div>
                  </div>
                ))}
              </div>
            </div>

            {habits.map((habit) => {
              const streak = calculateStreak(habit);
              const isDoneToday = habit.completedDates.includes(todayStr);

              return (
                <Card
                  key={habit.id}
                  variant="glass"
                  className="group p-4 shadow-2xs border-[#E8E3F0] transition-all duration-200 hover:-translate-y-0.5 bg-white/90"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Habit Info & Today Check */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EEEAFE] to-[#F8E8F0] text-xl border border-[#E8E3F0] shadow-2xs">
                        {habit.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-[#17151C] truncate">
                            {habit.name}
                          </h3>
                          {isDoneToday && (
                            <span className="rounded-full bg-[#EEF8F4] border border-[#CCE5DC] px-2 py-0.5 text-[9px] font-bold text-[#3E7D5C]">
                              Done today
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2.5 text-xs text-[#8D8792]">
                          <span className="flex items-center gap-1 font-medium text-[#5F5965]">
                            <Flame
                              size={13}
                              className={
                                streak > 0 ? "text-[#D99BB8]" : "text-[#8D8792]"
                              }
                            />
                            {streak} {streak === 1 ? "day streak" : "days streak"}
                          </span>
                          <span>•</span>
                          <span className="text-[11px]">
                            {habit.completedDates.length} total checks
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 7-Day Completion matrix + Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E3F0]">
                      {/* 7 Day checks */}
                      <div className="flex items-center gap-1.5 md:gap-2">
                        {last7Days.map((day) => {
                          const isChecked = habit.completedDates.includes(
                            day.dateStr
                          );
                          return (
                            <button
                              key={day.dateStr}
                              type="button"
                              onClick={() => handleToggleDate(habit, day.dateStr)}
                              className={`flex flex-col items-center justify-center h-8 w-8 rounded-lg border text-xs font-semibold transition-all active:scale-90 cursor-pointer ${
                                isChecked
                                  ? "bg-[#528D6F] border-[#528D6F] text-white shadow-2xs"
                                  : day.isToday
                                  ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] hover:bg-[#E3DCFA]"
                                  : "bg-white border-[#E8E3F0] text-[#8D8792] hover:bg-[#F7F5F8]"
                              }`}
                              title={`${habit.name} - ${day.label} ${day.dayNum}`}
                            >
                              {isChecked ? (
                                <Check size={14} strokeWidth={2.5} />
                              ) : (
                                <span className="text-[10px]">{day.dayNum}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(habit.id)}
                        className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
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
            NEW HABIT MODAL
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