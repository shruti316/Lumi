import { useState, useEffect } from "react";
import {
  CheckSquare,
  CalendarDays,
  Plus,
  Check,
  Trash2,
  Search,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";
import {
  getScheduleBlocks,
  addScheduleBlock,
  updateScheduleBlock,
  deleteScheduleBlock,
  type ScheduleBlock,
} from "../../lib/lifeOSStorage";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  createdAt?: string;
}

const SCHEDULE_CATEGORIES = [
  { name: "Class", color: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DCD8F2]" },
  { name: "Study", color: "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]" },
  { name: "Project", color: "bg-[#FDF3EC] text-[#9A644D] border-[#F1D2C9]" },
  { name: "Personal", color: "bg-[#FDF0F6] text-[#9A4E70] border-[#F2D8E4]" },
  { name: "Routine", color: "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]" },
  { name: "Break", color: "bg-[#F7F5F8] text-[#5F5965] border-[#E8E3F0]" },
] as const;

export default function Plan() {
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule">("tasks");

  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium");

  // Schedule State
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(() => getScheduleBlocks());
  const [scheduleView, setScheduleView] = useState<"timeline" | "week">("timeline");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Schedule Form
  const [blockTime, setBlockTime] = useState("");
  const [blockTitle, setBlockTitle] = useState("");
  const [blockCategory, setBlockCategory] = useState<ScheduleBlock["category"]>("Study");
  const [blockNotes, setBlockNotes] = useState("");

  async function fetchTasks() {
    const { data } = await api.tasks.getAll();
    if (data?.tasks) {
      setTasks(
        data.tasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          completed: Boolean(t.completed),
          priority: t.priority || "medium",
          dueDate: t.dueDate,
          createdAt: t.createdAt,
        }))
      );
    }
  }

  useEffect(() => {
    fetchTasks();
    window.addEventListener("lumi-sync", fetchTasks);
    return () => window.removeEventListener("lumi-sync", fetchTasks);
  }, []);

  // Task Actions
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const payload = {
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
    };

    const { data } = await api.tasks.create(payload);
    if (data?.task) {
      setTasks((prev) => [
        {
          id: data.task.id,
          title: data.task.title,
          completed: Boolean(data.task.completed),
          priority: data.task.priority || "medium",
          dueDate: data.task.dueDate,
          createdAt: data.task.createdAt,
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
    }
    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setShowTaskModal(false);
  }

  async function handleToggleTask(task: Task) {
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );
    await api.tasks.update(task.id, { completed: nextCompleted });
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
  }

  async function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await api.tasks.delete(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "task" } }));
  }

  // Schedule Actions
  function handleCreateBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockTitle.trim() || !blockTime.trim()) return;

    const newBlock: ScheduleBlock = {
      id: crypto.randomUUID(),
      time: blockTime.trim(),
      title: blockTitle.trim(),
      category: blockCategory,
      completed: false,
      notes: blockNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addScheduleBlock(newBlock);
    setBlocks(getScheduleBlocks());
    setBlockTitle("");
    setBlockTime("");
    setBlockNotes("");
    setShowScheduleModal(false);
  }

  function handleToggleBlock(block: ScheduleBlock) {
    const updated = { ...block, completed: !block.completed };
    updateScheduleBlock(updated);
    setBlocks(getScheduleBlocks());
  }

  function handleDeleteBlock(id: string) {
    deleteScheduleBlock(id);
    setBlocks(getScheduleBlocks());
  }

  // Derived Metrics
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const taskProgress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);
  const completedBlocks = blocks.filter((b) => b.completed).length;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    if (!matchesSearch || !matchesPriority) return false;

    if (taskFilter === "completed") return t.completed;
    if (taskFilter === "pending") return !t.completed;
    return true;
  });

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

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
                Execution & Schedule • {todayFormatted}
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Plan & <span className="font-editorial-italic font-normal text-[#9E96D8]">Tasks</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              What do I need to do, and when am I planning to do it? All in one place.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "tasks" ? (
              <button
                type="button"
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Task</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Time Block</span>
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="pink" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Tasks Left
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {pendingTasks}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              {completedTasks} completed
            </p>
          </Card>

          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Task Completion
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {taskProgress}%
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-[#9E96D8] transition-all duration-500"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </Card>

          <Card variant="blue" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Schedule Blocks
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {completedBlocks}/{blocks.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Time-blocked day
            </p>
          </Card>

          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Daily Flow
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Sparkles size={18} className="text-[#528D6F]" />
              In Rhythm
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#4A7D63]">
              Balanced momentum
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            PRIMARY VIEW SELECTOR TABS
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("tasks")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "tasks"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <CheckSquare size={15} className={activeTab === "tasks" ? "text-[#9E96D8]" : ""} />
              <span>Tasks & To-Dos</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {pendingTasks}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "schedule"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <CalendarDays size={15} className={activeTab === "schedule" ? "text-[#9E96D8]" : ""} />
              <span>Planner & Schedule</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {blocks.length}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            VIEW 1: TASKS & TO-DOS
        ========================================================= */}
        {activeTab === "tasks" && (
          <div>
            {/* Filters and Search */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
                {(["all", "pending", "completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTaskFilter(tab)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                      taskFilter === tab
                        ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                        : "text-[#5F5965] hover:text-[#17151C]"
                    }`}
                  >
                    {tab === "all" ? "All Tasks" : tab === "pending" ? "To-Do" : "Completed"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="rounded-xl border border-[#E8E3F0] bg-white px-3 py-2 text-xs font-semibold text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8]"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                <div className="relative flex-1 sm:w-56">
                  <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8]"
                  />
                </div>
              </div>
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <Card variant="lavender" className="p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#9E96D8] text-xl shadow-2xs border border-white">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                  No tasks in this view
                </h3>
                <p className="mt-1 text-xs font-medium text-[#5F5965]">
                  Click "Add Task" above to organize what needs your focus.
                </p>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    variant="glass"
                    className={`p-3.5 flex items-center justify-between gap-3.5 transition duration-200 hover:-translate-y-0.5 border-[#E8E3F0] ${
                      task.completed ? "opacity-70 bg-white/50" : "bg-white/90"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition duration-200 cursor-pointer ${
                          task.completed
                            ? "bg-[#528D6F] text-white shadow-2xs"
                            : "border border-[#DCD8F2] bg-white hover:border-[#9E96D8]"
                        }`}
                      >
                        {task.completed && <Check size={12} strokeWidth={2.5} />}
                      </button>

                      <span
                        className={`text-xs font-medium truncate ${
                          task.completed ? "line-through text-[#8D8792]" : "text-[#17151C]"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          task.priority === "high"
                            ? "bg-[#FDF0F6] text-[#9A4E70] border border-[#F2D8E4]"
                            : task.priority === "medium"
                            ? "bg-[#FDF3EC] text-[#9A644D] border border-[#F1D2C9]"
                            : "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 2: PLANNER & SCHEDULE
        ========================================================= */}
        {activeTab === "schedule" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setScheduleView("timeline")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    scheduleView === "timeline"
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  Today's Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleView("week")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    scheduleView === "week"
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  Weekly Overview
                </button>
              </div>

              <span className="text-xs font-medium text-[#8D8792]">
                {blocks.length} scheduled sessions
              </span>
            </div>

            {scheduleView === "timeline" ? (
              <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E8E3F0]">
                {blocks.map((block) => {
                  const catConfig =
                    SCHEDULE_CATEGORIES.find((c) => c.name === block.category) ||
                    SCHEDULE_CATEGORIES[0];

                  return (
                    <Card
                      key={block.id}
                      variant="glass"
                      className={`relative ml-3 pl-10 p-4 border-[#E8E3F0] transition-all duration-200 hover:-translate-y-0.5 ${
                        block.completed ? "opacity-70 bg-white/50" : "bg-white/90"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(block)}
                        className={`absolute left-3.5 top-4.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          block.completed
                            ? "border-[#528D6F] bg-[#528D6F] text-white shadow-2xs"
                            : "border-[#DCD8F2] bg-white hover:border-[#9E96D8]"
                        }`}
                        title={block.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {block.completed && <Check size={12} strokeWidth={3} />}
                      </button>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2 py-0.5 text-[11px] font-semibold text-[#5F5965]">
                              <Clock size={11} className="text-[#9E96D8]" />
                              {block.time}
                            </span>

                            <span
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catConfig.color}`}
                            >
                              {block.category}
                            </span>
                          </div>

                          <h3
                            className={`mt-2 text-sm font-semibold ${
                              block.completed
                                ? "line-through text-[#8D8792]"
                                : "text-[#17151C]"
                            }`}
                          >
                            {block.title}
                          </h3>

                          {block.notes && (
                            <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                              {block.notes}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                          title="Delete time block"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekend"].map(
                  (day, idx) => (
                    <Card
                      key={day}
                      variant="glass"
                      className="p-4 border-[#E8E3F0] bg-white/90"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3F0] mb-2.5">
                        <span className="text-xs font-bold text-[#17151C]">
                          {day}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8D8792]">
                          {idx % 2 === 0 ? "3 blocks" : "4 blocks"}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#5F5965]">
                          <span>09:00 - Classes</span>
                          <span className="text-[#4A729A] font-semibold">Lecture</span>
                        </div>
                        <div className="flex justify-between text-[#5F5965]">
                          <span>14:00 - Focus Block</span>
                          <span className="text-[#9A644D] font-semibold">Project</span>
                        </div>
                        <div className="flex justify-between text-[#5F5965]">
                          <span>18:00 - Personal</span>
                          <span className="text-[#3E7D5C] font-semibold">Gym</span>
                        </div>
                      </div>
                    </Card>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════
            TASK MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          title="Add Action Task"
          subtitle="Add an actionable to-do item to your daily plan."
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Task Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Complete AI & Machine Learning assignment"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
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
                    onClick={() => setNewTaskPriority(p)}
                    className={`rounded-xl border py-2 text-xs font-semibold capitalize transition cursor-pointer ${
                      newTaskPriority === p
                        ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs font-bold"
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
                onClick={() => setShowTaskModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </Modal>

        {/* ═══════════════════════════════════════
            SCHEDULE BLOCK MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Add Time Block"
          subtitle="Time-block your day to protect your deep focus."
        >
          <form onSubmit={handleCreateBlock} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Time Slot *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 - 11:30"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Category
                </label>
                <select
                  value={blockCategory}
                  onChange={(e) =>
                    setBlockCategory(e.target.value as ScheduleBlock["category"])
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  {SCHEDULE_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Session Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Physics Lab Prep & Formulas Review"
                value={blockTitle}
                onChange={(e) => setBlockTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Classroom location, study links, or notes..."
                value={blockNotes}
                onChange={(e) => setBlockNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!blockTitle.trim() || !blockTime.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Add Block
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
