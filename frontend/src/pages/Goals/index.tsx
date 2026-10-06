import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Clock, Sparkles, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Personal" | "Career" | "Health";
  deadline: string;
  targetDate?: string;
  progress: number;
  status: "In Progress" | "Completed";
  milestones?: string[];
  createdAt?: string;
}

const CATEGORIES = [
  { name: "Academic", icon: "📚", desc: "Grades, courses & exam targets" },
  { name: "Career", icon: "💼", desc: "Internships, skills & projects" },
  { name: "Personal", icon: "🌱", desc: "Habits, lifestyle & reading" },
  { name: "Health", icon: "💧", desc: "Fitness, wellness & sleep" },
] as const;

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("Academic");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  async function fetchGoals() {
    setLoading(true);
    const { data } = await api.goals.getAll();
    if (data?.goals) {
      setGoals(
        data.goals.map((g: any) => ({
          ...g,
          category: g.category || "Personal",
          deadline: g.targetDate || g.deadline || "Ongoing",
          status: g.status || (g.progress >= 100 ? "Completed" : "In Progress"),
          milestones: g.milestones || [],
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGoals();
    window.addEventListener("lumi-sync", fetchGoals);
    return () => window.removeEventListener("lumi-sync", fetchGoals);
  }, []);

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const { data } = await api.goals.create({
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate: deadline || "Ongoing",
      progress,
      status: progress >= 100 ? "Completed" : "In Progress",
    });

    if (data?.goal) {
      setGoals((prev) => [
        {
          ...data.goal,
          category: data.goal.category || category,
          deadline: data.goal.targetDate || deadline || "Ongoing",
          status: data.goal.status || (progress >= 100 ? "Completed" : "In Progress"),
          milestones: data.goal.milestones || [],
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "goal" } }));
    }

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

  async function handleToggleStatus(goal: Goal) {
    const isCompleted = goal.status === "Completed";
    const newStatus = isCompleted ? "In Progress" : "Completed";
    const newProgress = isCompleted ? 50 : 100;

    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id ? { ...g, status: newStatus, progress: newProgress } : g
      )
    );

    await api.goals.update(goal.id, {
      status: newStatus,
      progress: newProgress,
    });
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "goal" } }));
  }

  async function handleDelete(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await api.goals.delete(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "goal" } }));
  }

  const completedCount = goals.filter((g) => g.status === "Completed").length;
  const inProgressCount = goals.length - completedCount;

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E96D8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Life OS Vision
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Milestones & <span className="font-editorial-italic font-normal text-[#9E96D8]">Goals</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Define what you are working toward, track milestones & celebrate progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>New Goal</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR
        ═══════════════════════════════════════ */}
        {goals.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            <Card variant="blue" hoverEffect className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Total Goals
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {goals.length}
              </p>
            </Card>
            <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
                Completed
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {completedCount}
              </p>
            </Card>
            <Card variant="peach" hoverEffect className="p-4 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                In Progress
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {inProgressCount}
              </p>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════
            GOALS LIST / EMPTY STATE
        ═══════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : goals.length === 0 ? (
          <div className="space-y-6">
            <Card variant="lavender" className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                🎯
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#17151C]">
                Nothing you're chasing yet
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#5F5965] leading-relaxed">
                Create your first goal and start tracking your milestones, vision, and personal growth.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Goal</span>
              </button>
            </Card>

            <div>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Sparkles size={14} className="text-[#9E96D8]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D8792]">
                  Quick Start Categories
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleQuickStart(cat.name as Goal["category"])}
                    className="flex flex-col items-start rounded-2xl border border-[#E8E3F0] bg-white/90 p-4 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#EEEAFE] hover:border-[#DDD8F2] cursor-pointer"
                  >
                    <span className="text-2xl mb-1.5">{cat.icon}</span>
                    <span className="text-xs font-bold text-[#17151C]">{cat.name}</span>
                    <span className="mt-0.5 text-[11px] text-[#5F5965] line-clamp-1">{cat.desc}</span>
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
                variant="glass"
                hoverEffect
                className={`p-5 border-[#E8E3F0] bg-white/95 transition duration-200 ${
                  goal.status === "Completed" ? "opacity-80" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                      {goal.category}
                    </span>
                    <h3
                      className={`mt-2.5 font-serif text-base font-bold tracking-tight ${
                        goal.status === "Completed"
                          ? "line-through text-[#8D8792]"
                          : "text-[#17151C]"
                      }`}
                    >
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(goal)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition cursor-pointer ${
                        goal.status === "Completed"
                          ? "bg-[#528D6F] text-white shadow-2xs"
                          : "bg-white border border-[#E8E3F0] text-[#8D8792] hover:text-[#17151C] hover:bg-[#EEEAFE]"
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
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="mt-2 text-xs font-normal text-[#5F5965] line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#E8E3F0]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#17151C] mb-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-[#8D8792]">
                      <Clock size={12} className="text-[#9E96D8]" /> {goal.deadline}
                    </span>
                    <span className="text-[#9E96D8] font-bold">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEAFE]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#E8B9CD] transition-all duration-500"
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
          title="Create New Goal"
          subtitle="Set meaningful milestones for your personal journey."
        >
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Master DSA & Algorithms for Summer Internship"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Goal["category"])
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="Academic">Academic</option>
                  <option value="Career">Career</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Why is this goal important to you?
              </label>
              <textarea
                rows={2}
                placeholder="Add context, milestones, or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#17151C] mb-1">
                <span>Initial Progress</span>
                <span className="text-[#9E96D8] font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#17151C] cursor-pointer"
              />
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
                disabled={!title.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
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
