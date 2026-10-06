import { useState, useEffect } from "react";
import { Plus, Check, Trash2, Search, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
  time?: string;
  createdAt?: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "today" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");

  // Form state
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");

  async function fetchTasks() {
    setLoading(true);
    const { data } = await api.tasks.getAll();
    if (data?.tasks) {
      setTasks(data.tasks);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
    window.addEventListener("lumi-sync", fetchTasks);
    return () => window.removeEventListener("lumi-sync", fetchTasks);
  }, []);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const { data } = await api.tasks.create({
      title: title.trim(),
      priority,
      dueDate: "Today",
      category: "Academic",
    });

    if (data?.task) {
      setTasks((prev) => [data.task, ...prev]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
    }
    setTitle("");
    setPriority("medium");
    setShowModal(false);
  }

  async function handleToggle(task: Task) {
    const updatedStatus = !task.completed;
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: updatedStatus } : t))
    );

    await api.tasks.update(task.id, { completed: updatedStatus });
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
  }

  async function handleDelete(id: string) {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await api.tasks.delete(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const highPriorityCount = tasks.filter((t) => t.priority === "high" && !t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    if (!matchesSearch || !matchesPriority) return false;

    if (activeTab === "completed") return t.completed;
    if (activeTab === "today") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Execution Center
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Action <span className="font-editorial-italic font-normal text-[#9E96D8]">Tasks</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Get things done, prioritize high-impact work & clear your mental load.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>

        {/* Mini Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="pink" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">{tasks.length}</p>
          </Card>
          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Completed
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">{completedCount}</p>
          </Card>
          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Pending
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">{pendingCount}</p>
          </Card>
          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              High Priority
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">{highPriorityCount}</p>
          </Card>
        </div>

        {/* Progress Card */}
        <Card variant="lavender" className="mb-6 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5BA5]">
                Today's Momentum
              </p>
              <h3 className="text-lg font-bold text-[#17151C]">
                {progress === 100
                  ? "All tasks cleared! Take a breath ✦"
                  : `${completedCount} of ${tasks.length} tasks completed`}
              </h3>
            </div>
            <span className="text-2xl font-serif font-bold text-[#6B5BA5]">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] via-[#B8B3E8] to-[#E8B9CD] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Controls: Search + Tabs + Filter */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D8792]"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Tabs */}
            <div className="flex rounded-xl bg-[#F7F5F8] p-1 border border-[#E8E3F0]">
              {(["all", "today", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-[#17151C] shadow-2xs"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="rounded-xl border border-[#E8E3F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5F5965] focus:border-[#9E96D8] outline-none shadow-2xs cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
              <Check size={22} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17151C]">No tasks found</h3>
            <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
              {search
                ? "No tasks match your search query."
                : "Your action checklist is all clear. Add a new task to get started."}
            </p>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                variant={task.completed ? "default" : "default"}
                hoverEffect
                className={`group flex items-center justify-between p-3.5 sm:p-4 transition duration-200 ${
                  task.completed ? "opacity-60 bg-[#F7F5F8]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(task)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition duration-200 cursor-pointer ${
                      task.completed
                        ? "border-[#CCE5DC] bg-[#528F75] text-white"
                        : "border-[#E8E3F0] bg-white hover:border-[#9E96D8]"
                    }`}
                  >
                    {task.completed && <Check size={13} strokeWidth={3} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-medium transition ${
                        task.completed ? "line-through text-[#8D8792]" : "text-[#17151C]"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.category && (
                      <p className="text-[10px] text-[#8D8792] font-semibold mt-0.5">
                        {task.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === "high"
                        ? "bg-[#FDECE8] text-[#D84C2C] border border-[#F1D2C9]"
                        : task.priority === "medium"
                        ? "bg-[#FEF5E7] text-[#9A644D] border border-[#F6E1C8]"
                        : "bg-[#EEF8F4] text-[#3E7D5C] border border-[#CCE5DC]"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#8D8792] hover:text-[#D84C2C] hover:bg-[#FDECE8] transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Action Task"
          subtitle="Add an item to your execution checklist."
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Task Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Finish chemistry lab assignment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-xl border py-2 text-xs font-semibold capitalize transition cursor-pointer ${
                      priority === p
                        ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs"
                        : "bg-white border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                    }`}
                  >
                    {p}
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
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
