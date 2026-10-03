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
  { name: "Class", color: "bg-[#eee9f8] text-[#7564af] border-[#dcd5ed]" },
  { name: "Study", color: "bg-[#e2f1f6] text-[#57839d] border-[#c8dfeb]" },
  { name: "Project", color: "bg-[#f7e0cc] text-[#ae6e42] border-[#edcfb5]" },
  { name: "Personal", color: "bg-[#f7dce7] text-[#b5577f] border-[#e8c5d5]" },
  { name: "Routine", color: "bg-[#deeee0] text-[#5e8668] border-[#c6dccc]" },
  { name: "Break", color: "bg-[#fff2cc] text-[#9b7b2c] border-[#fae39d]" },
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
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#57839d]">
              Day & Schedule Timeline 📅 • {todayDateFormatted}
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#364750] sm:text-5xl">
              Daily Planner
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              Design your schedule, time-block your focus & build a balanced college routine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/tasks"
              className="flex items-center gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 px-3.5 py-2 text-xs font-bold text-[#766d78] shadow-2xs transition hover:bg-white hover:text-[#403842]"
            >
              <ListTodo size={15} />
              <span>Action Tasks</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#e2f1f6] border border-[#c8dfeb] px-4 py-2 text-xs font-bold text-[#364750] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#d4eaf1] active:scale-95"
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
          <Card className="!bg-[#e2f1f6] !border-[#c8dfeb] p-3.5 glow-blue">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#57839d]">
              Timeline Completion
            </p>
            <p className="text-2xl font-extrabold text-[#364750] mt-0.5">
              {completedCount}/{blocks.length}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#c8dfeb]">
              <div
                className="h-full rounded-full bg-[#57839d] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          <Card className="!bg-[#eee9f8] !border-[#dcd5ed] p-3.5 glow-lavender">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7564af]">
              Scheduled Blocks
            </p>
            <p className="text-2xl font-extrabold text-[#40364a] mt-0.5">
              {blocks.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              Time-boxed sessions
            </p>
          </Card>

          <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-3.5 glow-peach">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ae6e42]">
              Remaining Focus
            </p>
            <p className="text-2xl font-extrabold text-[#493b33] mt-0.5">
              {blocks.length - completedCount} blocks
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              Ready to conquer
            </p>
          </Card>

          <Card className="!bg-[#deeee0] !border-[#c6dccc] p-3.5 glow-green">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e8668]">
              Schedule Rhythm
            </p>
            <p className="text-2xl font-extrabold text-[#304639] mt-0.5 flex items-center gap-1">
              <Sparkles size={18} className="text-[#5e8668]" />
              In Flow
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
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
              <div className="flex gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveView("timeline")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    activeView === "timeline"
                      ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                      : "text-[#766d78] hover:text-[#403842]"
                  }`}
                >
                  Today's Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("week")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    activeView === "week"
                      ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                      : "text-[#766d78] hover:text-[#403842]"
                  }`}
                >
                  Weekly Schedule
                </button>
              </div>

              <span className="text-xs font-semibold text-[#766d78]">
                {blocks.length} time blocks
              </span>
            </div>

            {activeView === "timeline" ? (
              <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#efe8e1]">
                {blocks.map((block) => {
                  const catConfig =
                    CATEGORIES.find((c) => c.name === block.category) ||
                    CATEGORIES[0];

                  return (
                    <Card
                      key={block.id}
                      className={`relative ml-3 pl-10 !bg-white/90 !border-[#efe8e1] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs ${
                        block.completed ? "opacity-75" : ""
                      }`}
                    >
                      {/* Timeline Dot & Check */}
                      <button
                        type="button"
                        onClick={() => handleToggle(block)}
                        className={`absolute left-3.5 top-4.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all ${
                          block.completed
                            ? "border-[#5c8766] bg-[#5c8766] text-white shadow-2xs"
                            : "border-[#c8dfeb] bg-white hover:border-[#57839d]"
                        }`}
                        title={block.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {block.completed && <Check size={12} strokeWidth={3} />}
                      </button>

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#faf8f6] border border-[#efe8e1] px-2 py-0.5 text-[11px] font-bold text-[#57839d]">
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
                                ? "line-through text-[#918793]"
                                : "text-[#403842]"
                            }`}
                          >
                            {block.title}
                          </h3>

                          {block.notes && (
                            <p className="mt-1 text-xs text-[#766d78] leading-relaxed">
                              {block.notes}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(block.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#918793] hover:text-red-500 hover:bg-red-50 transition"
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
                      className="!bg-white/80 !border-[#efe8e1] p-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#efe8e1] mb-2.5">
                        <span className="text-xs font-bold text-[#403842]">
                          {day}
                        </span>
                        <span className="text-[10px] font-bold text-[#766d78]">
                          {idx % 2 === 0 ? "3 blocks" : "4 blocks"}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-[#766d78]">
                          <span>09:00 - Classes</span>
                          <span className="text-[#57839d] font-semibold">Lecture</span>
                        </div>
                        <div className="flex justify-between text-[#766d78]">
                          <span>14:00 - Focus Block</span>
                          <span className="text-[#ae6e42] font-semibold">Project</span>
                        </div>
                        <div className="flex justify-between text-[#766d78]">
                          <span>17:00 - Personal</span>
                          <span className="text-[#5e8668] font-semibold">Gym</span>
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
            <Card className="!bg-[#f7dce7] !border-[#e8c5d5] p-5 glow-pink">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b5577f]">
                  Action Items
                </span>
                <ListTodo size={18} className="text-[#b5577f]" />
              </div>
              <h3 className="mt-1 font-caveat text-2xl font-bold text-[#473640]">
                Task Execution Center
              </h3>
              <p className="mt-1 text-xs text-[#766d78] leading-relaxed">
                Looking for actionable checklists with priority filters and search? Manage individual to-dos in Tasks.
              </p>
              <Link
                to="/tasks"
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#b5577f] px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#a14b70]"
              >
                <span>Go to Tasks</span>
                <ArrowRight size={14} />
              </Link>
            </Card>

            {/* Day Intentions */}
            <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-5 glow-peach">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ae6e42]">
                  Daily Intentions
                </span>
                <Sparkles size={18} className="text-[#ae6e42]" />
              </div>
              <h3 className="mt-1 font-caveat text-2xl font-bold text-[#493b33]">
                Today's Core Principle
              </h3>
              <p className="mt-2 text-xs font-medium italic text-[#766d78] leading-relaxed">
                "One deep focus session is worth 4 hours of distracted multitasking. Protect your afternoon focus block."
              </p>
            </Card>

            {/* Schedule Quick Tips */}
            <Card className="!bg-[#deeee0] !border-[#c6dccc] p-5 glow-green">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5e8668]">
                College Routine Tips
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-[#304639]">
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
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Time Slot *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 - 11:30"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ScheduleBlock["category"])
                  }
                  className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-bold text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
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
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Session Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Physics Lab Prep & Formulas Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Any special focus notes or classroom location..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none resize-none"
              />
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
                disabled={!title.trim() || !time.trim()}
                className="rounded-xl bg-[#57839d] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#466a7f] disabled:opacity-50"
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