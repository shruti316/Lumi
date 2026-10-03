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

// Generate last 7 days list
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
    if (!completed.has(dateString)) {
      break;
    }
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

  // Calculate weekly consistency rate
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
    // Check if already exists
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
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A6E53]">
              Daily Rituals & Consistency 🌱
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              My Habits
            </h1>
            <p className="font-caveat text-xl text-[#806C79]">
              Small positive habits compound into remarkable lifelong changes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#DCE8E0] border border-[#BAB0C8] px-4 py-2.5 text-xs font-bold text-[#16131F] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#DAD4DF] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>New Habit</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-3.5 glow-green">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A6E53]">
              Today's Completion
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {completedTodayCount}/{habits.length}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#BAB0C8]">
              <div
                className="h-full rounded-full bg-[#4A6E53] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-3.5 glow-peach">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
              Best Streak
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5 flex items-center gap-1">
              <Flame size={20} className="text-[#806C79]" />
              {bestStreak} {bestStreak === 1 ? "day" : "days"}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Keep the fire burning
            </p>
          </Card>

          <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-3.5 glow-lavender">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3F4B]">
              Active Habits
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {habits.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Tracked routines
            </p>
          </Card>

          <Card className="!bg-[#DDEAF0] !border-[#BAB0C8] p-3.5 glow-blue">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F7386]">
              7-Day Consistency
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5 flex items-center gap-1">
              <TrendingUp size={18} className="text-[#4F7386]" />
              {weeklyConsistency}%
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Weekly adherence
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            QUICK SUGGESTIONS CHIPS
        ═══════════════════════════════════════ */}
        <section className="mb-6">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-[#4A6E53]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4A6E53]">
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
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    alreadyAdded
                      ? "border-[#BAB0C8] bg-[#DCE8E0]/60 text-[#4A6E53] opacity-60 cursor-default"
                      : "border-[#DAD4DF] bg-[#F4F0EB] text-[#16131F] shadow-2xs hover:-translate-y-0.5 hover:bg-[#DCE8E0] hover:border-[#BAB0C8]"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.name}</span>
                  {alreadyAdded ? (
                    <Check size={12} className="text-[#4A6E53]" />
                  ) : (
                    <Plus size={12} className="text-[#806C79]" />
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
          <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-8 text-center glow-green">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F0EB] text-3xl shadow-2xs border border-[#BAB0C8]">
              🌱
            </div>
            <h3 className="font-caveat text-3xl font-bold text-[#16131F]">
              No habits created yet
            </h3>
            <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#806C79]">
              Pick from the quick ideas above or create your own custom habit to start building your daily streak!
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#312A44] px-4 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs transition hover:bg-[#4A3F4B]"
            >
              <Plus size={15} />
              <span>Create My First Habit</span>
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* 7-Day Header guide on desktop */}
            <div className="hidden md:flex items-center justify-between px-4 text-[10px] font-extrabold uppercase tracking-wider text-[#806C79]">
              <span>Habit Details</span>
              <div className="flex items-center gap-2 pr-12">
                {last7Days.map((d) => (
                  <div
                    key={d.dateStr}
                    className={`w-8 text-center ${
                      d.isToday ? "font-black text-[#4A6E53]" : ""
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
                  className="group !bg-[#F4F0EB] !border-[#DAD4DF] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Habit Info & Today Check */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#DCE8E0] text-xl border border-[#BAB0C8] shadow-2xs">
                        {habit.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#16131F] truncate">
                            {habit.name}
                          </h3>
                          {isDoneToday && (
                            <span className="rounded-full bg-[#DCE8E0] px-2 py-0.5 text-[9px] font-extrabold text-[#4A6E53]">
                              Done today
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-xs text-[#806C79]">
                          <span className="flex items-center gap-1 font-semibold">
                            <Flame
                              size={13}
                              className={
                                streak > 0 ? "text-[#806C79]" : "text-[#BAB0C8]"
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
                    <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#DAD4DF]">
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
                              className={`flex flex-col items-center justify-center h-8 w-8 rounded-xl border text-xs font-bold transition-transform active:scale-90 ${
                                isChecked
                                  ? "bg-[#4A6E53] border-[#4A6E53] text-white shadow-2xs"
                                  : day.isToday
                                  ? "bg-[#DCE8E0] border-[#BAB0C8] text-[#16131F] hover:bg-[#DAD4DF]"
                                  : "bg-[#F4F0EB] border-[#DAD4DF] text-[#806C79] hover:bg-[#EAE5E0]"
                              }`}
                              title={`${habit.name} - ${day.label} ${day.dayNum}`}
                            >
                              {isChecked ? (
                                <Check size={14} strokeWidth={3} />
                              ) : (
                                <span className="text-[9px]">{day.dayNum}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(habit.id)}
                        className="ml-2 flex h-8 w-8 items-center justify-center rounded-xl text-[#806C79] hover:text-[#C1A0AC] hover:bg-[#F0D9E4] transition"
                        title="Delete habit"
                      >
                        <Trash2 size={15} />
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
          subtitle="One small step every day builds momentum."
        >
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                What habit do you want to build?
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Morning stretch & 10 pushups"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] focus:border-[#4A6E53] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1.5">
                Pick an icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {HABIT_EMOJIS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    className={`flex h-10 items-center justify-center rounded-xl border text-lg transition ${
                      emoji === item
                        ? "border-[#4A6E53] bg-[#DCE8E0] shadow-2xs scale-105"
                        : "border-[#DAD4DF] bg-[#F4F0EB] hover:bg-[#DAD4DF]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#806C79] hover:bg-[#DAD4DF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs hover:bg-[#4A3F4B] disabled:opacity-50"
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