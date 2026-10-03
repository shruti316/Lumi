import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  type Goal,
} from "../../lib/lifeOSStorage";

const CATEGORIES = [
  { name: "Academic", icon: "📚", desc: "Grades, courses & exam targets" },
  { name: "Career", icon: "💼", desc: "Internships, skills & projects" },
  { name: "Personal", icon: "🌱", desc: "Habits, lifestyle & reading" },
  { name: "Health", icon: "💧", desc: "Fitness, wellness & sleep" },
] as const;

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => getGoals());
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("Academic");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      deadline: deadline || "Ongoing",
      progress,
      status: progress >= 100 ? "Completed" : "In Progress",
      createdAt: new Date().toISOString(),
    };

    addGoal(newGoal);
    setGoals(getGoals());

    setTitle("");
    setDescription("");
    setProgress(0);
    setDeadline("");
    setShowModal(false);
  }

  function handleQuickStart(cat: Goal["category"]) {
    setCategory(cat);
    setShowModal(true);
  }

  function handleToggleStatus(goal: Goal) {
    const updated: Goal = {
      ...goal,
      status: goal.status === "Completed" ? "In Progress" : "Completed",
      progress: goal.status === "Completed" ? 50 : 100,
    };
    updateGoal(updated);
    setGoals(getGoals());
  }

  function handleDelete(id: string) {
    deleteGoal(id);
    setGoals(getGoals());
  }

  const completedCount = goals.filter((g) => g.status === "Completed").length;
  const inProgressCount = goals.length - completedCount;

  return (
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F7386]">
              Life OS Vision 🎯
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              Goals
            </h1>
            <p className="font-caveat text-xl text-[#806C79]">
              What are you working toward? Set milestones & track your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#DDEAF0] border border-[#BAB0C8] px-4 py-2.5 text-xs font-bold text-[#16131F] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#DAD4DF] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>New Goal</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR (Compact)
        ═══════════════════════════════════════ */}
        {goals.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card className="!bg-[#DDEAF0] !border-[#BAB0C8] p-3.5 glow-blue">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F7386]">
                Total Goals
              </p>
              <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
                {goals.length}
              </p>
            </Card>
            <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-3.5 glow-green">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A6E53]">
                Completed
              </p>
              <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
                {completedCount}
              </p>
            </Card>
            <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-3.5 glow-peach col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
                In Progress
              </p>
              <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
                {inProgressCount}
              </p>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════
            GOALS LIST / COMPACT EMPTY STATE
        ═══════════════════════════════════════ */}
        {goals.length === 0 ? (
          <div className="space-y-6">
            {/* Compact Useful Empty Card */}
            <Card className="!bg-[#DDEAF0] !border-[#BAB0C8] p-7 text-center glow-blue">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F0EB] text-2xl shadow-2xs border border-[#BAB0C8]">
                🎯
              </div>
              <h3 className="font-caveat text-3xl font-bold text-[#16131F]">
                Nothing you're chasing yet
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#806C79] leading-relaxed">
                Create your first goal and start tracking your progress, milestones, and personal growth.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#312A44] px-5 py-2.5 text-xs font-bold text-[#F4F0EB] shadow-2xs transition hover:bg-[#4A3F4B]"
              >
                <Plus size={15} />
                <span>Create Goal</span>
              </button>
            </Card>

            {/* Quick Start Category Suggestions */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Sparkles size={14} className="text-[#4F7386]" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4F7386]">
                  Quick Start Categories
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleQuickStart(cat.name as Goal["category"])}
                    className="flex flex-col items-start rounded-2xl border border-[#DAD4DF] bg-[#F4F0EB] p-3.5 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#DDEAF0] hover:border-[#BAB0C8]"
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="text-xs font-bold text-[#16131F]">{cat.name}</span>
                    <span className="mt-0.5 text-[10px] text-[#806C79] line-clamp-1">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className={`!bg-[#DDEAF0]/70 !border-[#BAB0C8] p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:shadow-xs ${
                  goal.status === "Completed" ? "opacity-85" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md bg-[#DAD4DF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#312A44]">
                      {goal.category}
                    </span>
                    <h3
                      className={`mt-2 text-sm font-bold ${
                        goal.status === "Completed"
                          ? "line-through text-[#806C79]"
                          : "text-[#16131F]"
                      }`}
                    >
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(goal)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                        goal.status === "Completed"
                          ? "bg-[#4A6E53] text-white shadow-2xs"
                          : "bg-[#F4F0EB] border border-[#DAD4DF] text-[#806C79] hover:text-[#312A44]"
                      }`}
                      title={
                        goal.status === "Completed"
                          ? "Mark In Progress"
                          : "Mark Completed"
                      }
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#806C79] hover:text-[#C1A0AC] hover:bg-[#F0D9E4] transition"
                      title="Delete goal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="mt-2 text-xs font-medium text-[#4A3F4B] line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                <div className="mt-4 pt-2 border-t border-[#BAB0C8]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#16131F] mb-1">
                    <span className="flex items-center gap-1 text-[11px] text-[#806C79]">
                      <Clock size={12} /> {goal.deadline}
                    </span>
                    <span className="text-[#312A44]">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#DAD4DF]">
                    <div
                      className="h-full rounded-full bg-[#312A44] transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW GOAL MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Goal 🎯"
          subtitle="Set meaningful milestones for your college journey."
        >
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Master DSA & Algorithms for Summer Internship"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Goal["category"])
                  }
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-bold text-[#16131F] focus:border-[#4F7386] outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Career">Career</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Why is this goal important to you?
              </label>
              <textarea
                rows={2}
                placeholder="Add context, milestones, or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none resize-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#16131F] mb-1">
                <span>Initial Progress</span>
                <span className="text-[#312A44]">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#312A44] cursor-pointer"
              />
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
                disabled={!title.trim()}
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs hover:bg-[#4A3F4B] disabled:opacity-50"
              >
                Save Goal
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
