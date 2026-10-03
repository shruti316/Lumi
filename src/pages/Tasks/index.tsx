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
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#b5577f]">
            Task Execution Center
          </p>
          <h1 className="font-caveat text-4xl font-bold text-[#403842]">
            My Action Tasks ✓
          </h1>
          <p className="font-caveat text-xl text-[#766d78]">
            Get things done, stay organized & execute your daily checklist.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#f7dce7] border border-[#e8c5d5] px-4 py-2.5 text-xs font-bold text-[#b5577f] shadow-2xs transition hover:bg-[#efcbdc] active:scale-95 w-fit"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="!bg-[#f7dce7] !border-[#e8c5d5] p-3.5 glow-pink">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#b5577f]">
            Total Tasks
          </p>
          <p className="text-2xl font-extrabold text-[#473640] mt-0.5">{tasks.length}</p>
        </Card>
        <Card className="!bg-[#deeee0] !border-[#c6dccc] p-3.5 glow-green">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e8668]">
            Completed
          </p>
          <p className="text-2xl font-extrabold text-[#304639] mt-0.5">{completedCount}</p>
        </Card>
        <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-3.5 glow-peach">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#ae6e42]">
            Pending
          </p>
          <p className="text-2xl font-extrabold text-[#493b33] mt-0.5">{pendingCount}</p>
        </Card>
        <Card className="!bg-[#eee9f8] !border-[#dcd5ed] p-3.5 glow-lavender">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7564af]">
            High Priority
          </p>
          <p className="text-2xl font-extrabold text-[#40364a] mt-0.5">{highPriorityCount}</p>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-2xl border border-[#e8c5d5] bg-[#f7dce7]/40 p-4">
        <div className="flex items-center justify-between text-xs font-bold text-[#473640] mb-1.5">
          <span>Execution Rate</span>
          <span>{progress}% ({completedCount}/{tasks.length})</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/80">
          <div
            className="h-full rounded-full bg-[#b5577f] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 p-1 w-fit shadow-2xs">
          {(["all", "today", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? "bg-[#f7dce7] text-[#b5577f] shadow-2xs"
                  : "text-[#766d78] hover:text-[#403842]"
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
            className="rounded-xl border border-[#efe8e1] bg-white px-3 py-2 text-xs font-bold text-[#403842] shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🌱 Low</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <Search size={14} className="absolute left-3 top-2.5 text-[#918793]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#efe8e1] bg-white pl-8 pr-3 py-1.5 text-xs font-medium text-[#403842] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card className="!bg-[#f7dce7] !border-[#e8c5d5] p-8 text-center glow-pink">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-2xs">
            ✓
          </div>
          <h3 className="font-caveat text-2xl font-bold text-[#473640]">
            No tasks in this view
          </h3>
          <p className="mt-1 text-xs font-medium text-[#766d78]">
            Click "New Task" above to add items to your execution list.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`!bg-white/80 !border-[#e8c5d5] p-3.5 flex items-center justify-between gap-3 transition duration-200 hover:-translate-y-0.5 hover:bg-white ${
                task.completed ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition duration-200 ${
                    task.completed
                      ? "bg-[#5c8766] text-white shadow-2xs"
                      : "border border-[#e8c5d5] bg-white hover:border-[#b5577f]"
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>

                <span
                  className={`text-xs font-medium truncate ${
                    task.completed ? "line-through text-[#918793]" : "text-[#473640]"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                    task.priority === "high"
                      ? "bg-[#f7dce7] text-[#b5577f]"
                      : task.priority === "medium"
                      ? "bg-[#f7e0cc] text-[#ae6e42]"
                      : "bg-[#deeee0] text-[#5c8766]"
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#918793] hover:text-red-500 hover:bg-red-50 transition"
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
            <label className="block text-xs font-bold text-[#473640] mb-1">
              Task Name
            </label>
            <input
              type="text"
              placeholder="e.g. Finish chemistry lab assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#e8c5d5] bg-white px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#b5577f]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#473640] mb-1">
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
                      ? "bg-[#f7dce7] border-[#b5577f] text-[#b5577f] shadow-2xs"
                      : "bg-white border-[#efe8e1] text-[#766d78]"
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
              className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#b5577f] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#a14b70]"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
