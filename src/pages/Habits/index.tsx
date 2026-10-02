import { useState } from "react";
import {
  Check,
  Flame,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  addHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  type Habit,
} from "../../lib/habitStorage";

const habitEmojis = [
  "💧",
  "📚",
  "🏋️",
  "🧘",
  "💻",
  "🥗",
  "😴",
  "✍️",
  "🌱",
  "🎧",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getStreak(habit: Habit) {
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

function Habits() {
  const [habits, setHabits] = useState<Habit[]>(() =>
    getHabits()
  );

  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");

  const today = getToday();

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(today)
  ).length;

  const progress =
    habits.length === 0
      ? 0
      : Math.round((completedToday / habits.length) * 100);

  const handleAddHabit = () => {
    if (!name.trim()) {
      return;
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    setHabits(getHabits());

    setName("");
    setEmoji("🌱");
    setShowEditor(false);
  };

  const toggleHabit = (habit: Habit) => {
    const alreadyCompleted =
      habit.completedDates.includes(today);

    const updatedDates = alreadyCompleted
      ? habit.completedDates.filter(
          (date) => date !== today
        )
      : [...habit.completedDates, today];

    const updatedHabit: Habit = {
      ...habit,
      completedDates: updatedDates,
    };

    updateHabit(updatedHabit);
    setHabits(getHabits());
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    setHabits(getHabits());
  };

  return (
    <div className="min-h-screen bg-[#fffafd] px-5 py-7 md:px-10 md:py-9">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#78a887]">
              Little things, every day 🌱
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#3f3340] md:text-4xl">
              My Habits
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#8f7d88]">
              Small actions become big changes when you keep showing up.
            </p>
          </div>

          <button
            onClick={() => setShowEditor(true)}
            className="flex w-fit items-center gap-2 rounded-2xl bg-[#78a887] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus size={18} />
            New Habit
          </button>
        </div>

        {/* Today's Progress */}
        <div className="mb-7 rounded-[2rem] border border-[#e5eee7] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8f7d88]">
                Today's progress
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-[#3f3340]">
                {completedToday} of {habits.length} completed
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf7f0] text-lg font-extrabold text-[#78a887]">
              {progress}%
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[#edf1ee]">
            <div
              className="h-full rounded-full bg-[#78a887] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Habit List */}
        {habits.length === 0 ? (
          <div className="rounded-[2rem] border border-[#e5eee7] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#edf7f0] text-3xl">
              🌱
            </div>

            <h2 className="text-xl font-extrabold text-[#3f3340]">
              No habits yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f7d88]">
              Start with something small. Drink more water, read,
              exercise, study, or simply take some time for yourself.
            </p>

            <button
              onClick={() => setShowEditor(true)}
              className="mt-6 rounded-2xl bg-[#edf7f0] px-5 py-3 text-sm font-bold text-[#5d9270] transition hover:bg-[#e3f1e7]"
            >
              Create my first habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const completedToday =
                habit.completedDates.includes(today);

              const streak = getStreak(habit);

              return (
                <div
                  key={habit.id}
                  className={`group flex items-center gap-4 rounded-[1.75rem] border bg-white p-5 shadow-sm transition ${
                    completedToday
                      ? "border-[#cfe5d5]"
                      : "border-[#eee6ea]"
                  }`}
                >
                  {/* Emoji */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                      completedToday
                        ? "bg-[#eaf6ed]"
                        : "bg-[#f8f4f6]"
                    }`}
                  >
                    {habit.emoji}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-extrabold ${
                        completedToday
                          ? "text-[#6e8575]"
                          : "text-[#3f3340]"
                      }`}
                    >
                      {habit.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-3 text-xs text-[#9b8992]">
                      <span className="flex items-center gap-1">
                        <Flame
                          size={14}
                          className={
                            streak > 0
                              ? "text-[#e49a62]"
                              : "text-[#bdb1b7]"
                          }
                        />
                        {streak} day streak
                      </span>

                      <span>
                        {habit.completedDates.length} total
                        completions
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="hidden rounded-xl p-2 text-[#c7b9c0] transition hover:bg-[#fff2f5] hover:text-[#d66b91] group-hover:block"
                    title="Delete habit"
                  >
                    <Trash2 size={17} />
                  </button>

                  {/* Complete */}
                  <button
                    onClick={() => toggleHabit(habit)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition ${
                      completedToday
                        ? "border-[#78a887] bg-[#78a887] text-white"
                        : "border-[#d9e5dc] bg-white text-transparent hover:border-[#78a887]"
                    }`}
                    title={
                      completedToday
                        ? "Mark incomplete"
                        : "Mark complete"
                    }
                  >
                    <Check size={22} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Habit Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3f3340]/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">

            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-[#78a887]">
                  One small step 🌱
                </p>

                <h2 className="text-2xl font-extrabold text-[#3f3340]">
                  New Habit
                </h2>
              </div>

              <button
                onClick={() => setShowEditor(false)}
                className="rounded-xl p-2 text-[#a18f99] transition hover:bg-[#f4f8f5]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Name */}
            <label className="mb-2 block text-sm font-bold text-[#4d3d48]">
              What do you want to build?
            </label>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddHabit();
                }
              }}
              placeholder="e.g. Read 20 pages"
              className="mb-6 w-full rounded-2xl border border-[#e2eae4] bg-[#fbfdfb] px-4 py-3 text-sm text-[#3f3340] outline-none transition focus:border-[#9ac1a5] focus:ring-2 focus:ring-[#e3f1e7]"
            />

            {/* Emoji */}
            <label className="mb-3 block text-sm font-bold text-[#4d3d48]">
              Pick an emoji
            </label>

            <div className="mb-7 grid grid-cols-5 gap-2">
              {habitEmojis.map((item) => (
                <button
                  key={item}
                  onClick={() => setEmoji(item)}
                  className={`flex h-12 items-center justify-center rounded-xl border text-xl transition ${
                    emoji === item
                      ? "border-[#9ac1a5] bg-[#edf7f0]"
                      : "border-[#eee7ea] hover:bg-[#fafdfb]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditor(false)}
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-bold text-[#8f7d88] transition hover:bg-[#f8f4f6]"
              >
                Cancel
              </button>

              <button
                onClick={handleAddHabit}
                disabled={!name.trim()}
                className="flex-1 rounded-2xl bg-[#78a887] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#6f9d7d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;