import { useState } from "react";
import {
  Check,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ListTodo,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getScheduleBlocks,
  addScheduleBlock,
  updateScheduleBlock,
  deleteScheduleBlock,
  type ScheduleBlock,
} from "../../lib/lifeOSStorage";

const CATEGORIES = [
  { name: "Class", color: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DCD8F2]" },
  { name: "Study", color: "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]" },
  { name: "Project", color: "bg-[#FDF3EC] text-[#9A644D] border-[#F1D2C9]" },
  { name: "Personal", color: "bg-[#FDF0F6] text-[#9A4E70] border-[#F2D8E4]" },
  { name: "Routine", color: "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]" },
  { name: "Break", color: "bg-[#F7F5F8] text-[#5F5965] border-[#E8E3F0]" },
] as const;

export default function Planner() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(() =>
    getScheduleBlocks()
  );
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<"timeline" | "week">("timeline");

  // Form State
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<ScheduleBlock["category"]>("Study");
  const [notes, setNotes] = useState("");

  const completedCount = blocks.filter((b) => b.completed).length;
  const progress =
    blocks.length === 0
      ? 0
      : Math.round((completedCount / blocks.length) * 100);

  function handleCreateBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !time.trim()) return;

    const newBlock: ScheduleBlock = {
      id: crypto.randomUUID(),
      time: time.trim(),
      title: title.trim(),
      category,
      completed: false,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addScheduleBlock(newBlock);
    setBlocks(getScheduleBlocks());
    setTitle("");
    setTime("");
    setNotes("");
    setShowModal(false);
  }

  function handleToggle(block: ScheduleBlock) {
    const updated = { ...block, completed: !block.completed };
    updateScheduleBlock(updated);
    setBlocks(getScheduleBlocks());
  }

  function handleDelete(id: string) {
    deleteScheduleBlock(id);
    setBlocks(getScheduleBlocks());
  }

  const todayDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8D4E8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Day & Schedule • {todayDateFormatted}
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Daily <span className="font-editorial-italic font-normal text-[#9E96D8]">Planner</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Time-block your focus, protect deep work, and balance your college day.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/tasks"
              className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-[#5F5965] shadow-2xs transition hover:bg-white hover:text-[#17151C] hover:-translate-y-0.5"
            >
              <ListTodo size={15} />
              <span>Action Tasks</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Time Block</span>
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="blue" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Timeline Completion
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {completedCount}/{blocks.length}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-[#6B9AB8] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Scheduled Blocks
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {blocks.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Time-boxed sessions
            </p>
          </Card>

          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Remaining Focus
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {blocks.length - completedCount} blocks
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Ready for action
            </p>
          </Card>

          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Schedule Rhythm
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Sparkles size={18} className="text-[#528D6F]" />
              In Flow
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#4A7D63]">
              Balanced day structure
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            MAIN TIMELINE + SIDEBAR GRID
        ═══════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          {/* TIMELINE LIST */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveView("timeline")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    activeView === "timeline"
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  Today's Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("week")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    activeView === "week"
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  Weekly Schedule
                </button>
              </div>

              <span className="text-xs font-medium text-[#8D8792]">
                {blocks.length} time blocks
              </span>
            </div>

            {activeView === "timeline" ? (
              <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E8E3F0]">
                {blocks.map((block) => {
                  const catConfig =
                    CATEGORIES.find((c) => c.name === block.category) ||
                    CATEGORIES[0];

                  return (
                    <Card
                      key={block.id}
                      variant="glass"
                      className={`relative ml-3 pl-10 p-4 border-[#E8E3F0] transition-all duration-200 hover:-translate-y-0.5 ${
                        block.completed ? "opacity-70 bg-white/50" : "bg-white/90"
                      }`}
                    >
                      {/* Timeline Dot & Check */}
                      <button
                        type="button"
                        onClick={() => handleToggle(block)}
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
                          onClick={() => handleDelete(block.id)}
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
              /* Weekly Schedule Grid Preview */
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

          {/* SIDEBAR WIDGETS */}
          <div className="space-y-4">
            {/* Quick Link to Tasks */}
            <Card variant="pink" hoverEffect className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F5965]">
                  Action Items
                </span>
                <ListTodo size={18} className="text-[#D99BB8]" />
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-[#17151C]">
                Task Execution Center
              </h3>
              <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                Looking for actionable checklists with priority filters and search? Manage individual to-dos in Tasks.
              </p>
              <Link
                to="/tasks"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#17151C] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B]"
              >
                <span>Go to Tasks</span>
                <ArrowRight size={14} />
              </Link>
            </Card>

            {/* Day Intentions */}
            <Card variant="peach" hoverEffect className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F5965]">
                  Daily Intentions
                </span>
                <Sparkles size={18} className="text-[#F1D2C9]" />
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-[#17151C]">
                Today's Core Principle
              </h3>
              <p className="mt-2 text-xs font-medium italic text-[#5F5965] leading-relaxed">
                "One deep focus session is worth four hours of distracted multitasking. Protect your afternoon focus block."
              </p>
            </Card>

            {/* Schedule Quick Tips */}
            <Card variant="default" hoverEffect className="p-5 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7D63]">
                College Routine Tips
              </span>
              <ul className="mt-2.5 space-y-2 text-xs text-[#17151C]">
                <li className="flex items-start gap-2">
                  <span className="text-[#528D6F]">•</span>
                  <span>Keep morning classes energized with a solid breakfast</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#528D6F]">•</span>
                  <span>Batch study sessions into 90-minute deep blocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#528D6F]">•</span>
                  <span>Leave one hour free in the evening for spontaneous rest</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ADD TIME BLOCK MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add Time Block"
          subtitle="Time-block your day to keep your flow structured and focused."
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
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ScheduleBlock["category"])
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                >
                  {CATEGORIES.map((c) => (
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Any special focus notes or classroom location..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none resize-none shadow-2xs"
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
                disabled={!title.trim() || !time.trim()}
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