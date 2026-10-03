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
  { name: "Class", color: "bg-[#DAD4DF] text-[#312A44] border-[#BAB0C8]" },
  { name: "Study", color: "bg-[#DDEAF0] text-[#4F7386] border-[#BAB0C8]" },
  { name: "Project", color: "bg-[#F2DFD0] text-[#806C79] border-[#BAB0C8]" },
  { name: "Personal", color: "bg-[#F0D9E4] text-[#4A3F4B] border-[#C1A0AC]" },
  { name: "Routine", color: "bg-[#DCE8E0] text-[#4A6E53] border-[#BAB0C8]" },
  { name: "Break", color: "bg-[#F2DFD0] text-[#806C79] border-[#BAB0C8]" },
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
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F7386]">
              Day & Schedule Timeline 📅 • {todayDateFormatted}
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              Daily Planner
            </h1>
            <p className="font-caveat text-xl text-[#806C79]">
              Design your schedule, time-block your focus & build a balanced college routine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/tasks"
              className="flex items-center gap-1.5 rounded-2xl border border-[#DAD4DF] bg-[#F4F0EB] px-3.5 py-2 text-xs font-bold text-[#806C79] shadow-2xs transition hover:bg-[#DAD4DF] hover:text-[#16131F]"
            >
              <ListTodo size={15} />
              <span>Action Tasks</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#DDEAF0] border border-[#BAB0C8] px-4 py-2 text-xs font-bold text-[#16131F] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#DAD4DF] active:scale-95"
            >
              <Plus size={16} />
              <span>Add Time Block</span>
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="!bg-[#DDEAF0] !border-[#BAB0C8] p-3.5 glow-blue">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4F7386]">
              Timeline Completion
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {completedCount}/{blocks.length}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#BAB0C8]">
              <div
                className="h-full rounded-full bg-[#4F7386] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-3.5 glow-lavender">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3F4B]">
              Scheduled Blocks
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {blocks.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Time-boxed sessions
            </p>
          </Card>

          <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-3.5 glow-peach">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
              Remaining Focus
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {blocks.length - completedCount} blocks
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Ready to conquer
            </p>
          </Card>

          <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-3.5 glow-green">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A6E53]">
              Schedule Rhythm
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5 flex items-center gap-1">
              <Sparkles size={18} className="text-[#4A6E53]" />
              In Flow
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Balanced day structure
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            MAIN TIMELINE + SIDEBAR GRID
        ═══════════════════════════════════════ */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* TIMELINE LIST */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5 rounded-2xl border border-[#DAD4DF] bg-[#F4F0EB] p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveView("timeline")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    activeView === "timeline"
                      ? "bg-[#DAD4DF] text-[#16131F] shadow-2xs"
                      : "text-[#806C79] hover:text-[#16131F]"
                  }`}
                >
                  Today's Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("week")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    activeView === "week"
                      ? "bg-[#DAD4DF] text-[#16131F] shadow-2xs"
                      : "text-[#806C79] hover:text-[#16131F]"
                  }`}
                >
                  Weekly Schedule
                </button>
              </div>

              <span className="text-xs font-semibold text-[#806C79]">
                {blocks.length} time blocks
              </span>
            </div>

            {activeView === "timeline" ? (
              <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#DAD4DF]">
                {blocks.map((block) => {
                  const catConfig =
                    CATEGORIES.find((c) => c.name === block.category) ||
                    CATEGORIES[0];

                  return (
                    <Card
                      key={block.id}
                      className={`relative ml-3 pl-10 !bg-[#F4F0EB] !border-[#DAD4DF] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs ${
                        block.completed ? "opacity-75" : ""
                      }`}
                    >
                      {/* Timeline Dot & Check */}
                      <button
                        type="button"
                        onClick={() => handleToggle(block)}
                        className={`absolute left-3.5 top-4.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all ${
                          block.completed
                            ? "border-[#4A6E53] bg-[#4A6E53] text-white shadow-2xs"
                            : "border-[#BAB0C8] bg-[#F4F0EB] hover:border-[#4F7386]"
                        }`}
                        title={block.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {block.completed && <Check size={12} strokeWidth={3} />}
                      </button>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#DAD4DF]/50 border border-[#BAB0C8] px-2 py-0.5 text-[11px] font-bold text-[#4F7386]">
                              <Clock size={11} />
                              {block.time}
                            </span>

                            <span
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${catConfig.color}`}
                            >
                              {block.category}
                            </span>
                          </div>

                          <h3
                            className={`mt-1.5 text-sm font-bold ${
                              block.completed
                                ? "line-through text-[#806C79]"
                                : "text-[#16131F]"
                            }`}
                          >
                            {block.title}
                          </h3>

                          {block.notes && (
                            <p className="mt-1 text-xs text-[#806C79] leading-relaxed">
                              {block.notes}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(block.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#806C79] hover:text-[#C1A0AC] hover:bg-[#F0D9E4] transition"
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
                      className="!bg-[#F4F0EB] !border-[#DAD4DF] p-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#DAD4DF] mb-2.5">
                        <span className="text-xs font-bold text-[#16131F]">
                          {day}
                        </span>
                        <span className="text-[10px] font-bold text-[#806C79]">
                          {idx % 2 === 0 ? "3 blocks" : "4 blocks"}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-[#806C79]">
                          <span>09:00 - Classes</span>
                          <span className="text-[#4F7386] font-semibold">Lecture</span>
                        </div>
                        <div className="flex justify-between text-[#806C79]">
                          <span>14:00 - Focus Block</span>
                          <span className="text-[#806C79] font-semibold">Project</span>
                        </div>
                        <div className="flex justify-between text-[#806C79]">
                          <span>17:00 - Personal</span>
                          <span className="text-[#4A6E53] font-semibold">Gym</span>
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
            {/* Quick Link to Tasks Execution */}
            <Card className="!bg-[#F0D9E4] !border-[#C1A0AC] p-5 glow-pink">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4A3F4B]">
                  Action Items
                </span>
                <ListTodo size={18} className="text-[#4A3F4B]" />
              </div>
              <h3 className="mt-1 font-caveat text-2xl font-bold text-[#16131F]">
                Task Execution Center
              </h3>
              <p className="mt-1 text-xs text-[#806C79] leading-relaxed">
                Looking for actionable checklists with priority filters and search? Manage individual to-dos in Tasks.
              </p>
              <Link
                to="/tasks"
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#312A44] px-4 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs transition hover:bg-[#4A3F4B]"
              >
                <span>Go to Tasks</span>
                <ArrowRight size={14} />
              </Link>
            </Card>

            {/* Day Intentions */}
            <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-5 glow-peach">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#806C79]">
                  Daily Intentions
                </span>
                <Sparkles size={18} className="text-[#806C79]" />
              </div>
              <h3 className="mt-1 font-caveat text-2xl font-bold text-[#16131F]">
                Today's Core Principle
              </h3>
              <p className="mt-2 text-xs font-medium italic text-[#806C79] leading-relaxed">
                "One deep focus session is worth 4 hours of distracted multitasking. Protect your afternoon focus block."
              </p>
            </Card>

            {/* Schedule Quick Tips */}
            <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-5 glow-green">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4A6E53]">
                College Routine Tips
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-[#16131F]">
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Keep morning classes energized with a solid breakfast</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Batch study sessions into 90-minute deep blocks</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Leave 1 hour free in the evening for spontaneous rest</span>
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
          title="Add Schedule Time Block"
          subtitle="Time-block your day to keep your flow structured."
        >
          <form onSubmit={handleCreateBlock} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Time Slot *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 - 11:30"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ScheduleBlock["category"])
                  }
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-bold text-[#16131F] focus:border-[#4F7386] outline-none"
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
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Session Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Physics Lab Prep & Formulas Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Any special focus notes or classroom location..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#4F7386] outline-none resize-none"
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
                disabled={!title.trim() || !time.trim()}
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs hover:bg-[#4A3F4B] disabled:opacity-50"
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