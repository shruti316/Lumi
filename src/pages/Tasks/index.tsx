import { useState } from "react";
import { Plus, Check, Trash2, Search } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  type Task,
} from "../../lib/storage";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "today" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");

  // Form state
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setTasks(getTasks());
    setTitle("");
    setPriority("medium");
    setShowModal(false);
  }

  function handleToggle(task: Task) {
    const updated = { ...task, completed: !task.completed };
    updateTask(updated);
    setTasks(getTasks());
  }

  function handleDelete(id: string) {
    deleteTask(id);
    setTasks(getTasks());
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
    <div className="mx-auto max-w-5xl p-6 md:p-8 text-[#16131F]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#806C79]">
            Task Execution Center
          </p>
          <h1 className="font-caveat text-4xl font-bold text-[#16131F]">
            My Action Tasks ✓
          </h1>
          <p className="font-caveat text-xl text-[#806C79]">
            Get things done, stay organized & execute your daily checklist.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#F0D9E4] border border-[#C1A0AC] px-4 py-2.5 text-xs font-bold text-[#16131F] shadow-2xs transition hover:bg-[#D7C5D2] active:scale-95 w-fit"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="!bg-[#F0D9E4] !border-[#C1A0AC] p-3.5 glow-pink">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
            Total Tasks
          </p>
          <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">{tasks.length}</p>
        </Card>
        <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-3.5 glow-green">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A6E53]">
            Completed
          </p>
          <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">{completedCount}</p>
        </Card>
        <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-3.5 glow-peach">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
            Pending
          </p>
          <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">{pendingCount}</p>
        </Card>
        <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-3.5 glow-lavender">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3F4B]">
            High Priority
          </p>
          <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">{highPriorityCount}</p>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-2xl border border-[#C1A0AC] bg-[#F0D9E4]/60 p-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#16131F] mb-1.5">
          <span>Execution Rate</span>
          <span>{progress}% ({completedCount}/{tasks.length})</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#DAD4DF]">
          <div
            className="h-full rounded-full bg-[#806C79] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-1.5 rounded-2xl border border-[#DAD4DF] bg-[#F4F0EB] p-1 w-fit shadow-2xs">
          {(["all", "today", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? "bg-[#F0D9E4] text-[#16131F] shadow-2xs"
                  : "text-[#806C79] hover:text-[#16131F]"
              }`}
            >
              {tab === "all" ? "All Tasks" : tab === "today" ? "To-Do" : "Done"}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="rounded-xl border border-[#DAD4DF] bg-[#F4F0EB] px-3 py-2 text-xs font-bold text-[#16131F] shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🌱 Low</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <Search size={14} className="absolute left-3 top-2.5 text-[#806C79]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DAD4DF] bg-[#F4F0EB] pl-8 pr-3 py-1.5 text-xs font-medium text-[#16131F] shadow-2xs outline-none focus:border-[#BAB0C8]"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card className="!bg-[#F0D9E4] !border-[#C1A0AC] p-8 text-center glow-pink">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F0EB] text-xl shadow-2xs border border-[#C1A0AC]">
            ✓
          </div>
          <h3 className="font-caveat text-2xl font-bold text-[#16131F]">
            No tasks in this view
          </h3>
          <p className="mt-1 text-xs font-medium text-[#806C79]">
            Click "New Task" above to add items to your execution list.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`!bg-[#F4F0EB] !border-[#DAD4DF] p-3.5 flex items-center justify-between gap-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#BAB0C8] ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition duration-200 ${
                    task.completed
                      ? "bg-[#4A6E53] text-white shadow-2xs"
                      : "border border-[#BAB0C8] bg-[#F4F0EB] hover:border-[#806C79]"
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>

                <span
                  className={`text-xs font-medium truncate ${
                    task.completed ? "line-through text-[#806C79]" : "text-[#16131F]"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                    task.priority === "high"
                      ? "bg-[#F0D9E4] text-[#806C79]"
                      : task.priority === "medium"
                      ? "bg-[#F2DFD0] text-[#806C79]"
                      : "bg-[#DCE8E0] text-[#4A6E53]"
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#806C79] hover:text-[#C1A0AC] hover:bg-[#F0D9E4] transition"
                  title="Delete task"
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
        subtitle="Add a task to your execution list."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#16131F] mb-1">
              Task Name
            </label>
            <input
              type="text"
              placeholder="e.g. Finish chemistry lab assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#16131F] mb-1">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-xl border py-2 text-xs font-bold capitalize transition ${
                    priority === p
                      ? "bg-[#F0D9E4] border-[#C1A0AC] text-[#16131F] shadow-2xs"
                      : "bg-[#F4F0EB] border-[#DAD4DF] text-[#806C79]"
                  }`}
                >
                  {p}
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
              className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs hover:bg-[#4A3F4B]"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
