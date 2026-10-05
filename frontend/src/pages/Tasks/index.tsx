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

        {/* Progress Bar */}
        <Card variant="pearl" className="mb-6 p-4.5 border-[#E8E3F0]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#17151C] mb-2">
            <span>Execution Progress</span>
            <span className="text-[#5F5965]">{progress}% ({completedCount}/{tasks.length})</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#EEEAFE]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#E8B9CD] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
            {(["all", "today", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                    : "text-[#5F5965] hover:text-[#17151C]"
                }`}
              >
                {tab === "all" ? "All Tasks" : tab === "today" ? "To-Do" : "Done"}
              </button>
            ))}
          </div>

          {/* Priority Filter & Search */}
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

            <div className="relative flex-1 sm:w-52">
              <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30"
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
              Click "New Task" above to add items to your execution list.
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
                    onClick={() => handleToggle(task)}
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
                    onClick={() => handleDelete(task.id)}
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
