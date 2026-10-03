import { useState } from "react";
import { Sparkles, Trash2, HeartHandshake, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getReflections,
  addReflection,
  deleteReflection,
  type ReflectionEntry,
} from "../../lib/lifeOSStorage";

export default function Reflection() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() =>
    getReflections()
  );

  const [weekOf, setWeekOf] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [wasDifficult, setWasDifficult] = useState("");
  const [learned, setLearned] = useState("");
  const [improve, setImprove] = useState("");
  const [nextWeekIntention, setNextWeekIntention] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  function handleCreateReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!wentWell.trim() && !learned.trim() && !nextWeekIntention.trim()) return;

    const currentWeekLabel =
      weekOf.trim() ||
      `Week of ${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

    const newRef: ReflectionEntry = {
      id: crypto.randomUUID(),
      weekOf: currentWeekLabel,
      wentWell: wentWell.trim(),
      wasDifficult: wasDifficult.trim() + (improve.trim() ? ` • Focus: ${improve.trim()}` : ""),
      learned: learned.trim(),
      nextWeekIntention: nextWeekIntention.trim(),
      createdAt: new Date().toISOString(),
    };

    addReflection(newRef);
    setReflections(getReflections());

    setWentWell("");
    setWasDifficult("");
    setLearned("");
    setImprove("");
    setNextWeekIntention("");
    setWeekOf("");
  }

  function handleDelete(id: string) {
    deleteReflection(id);
    setReflections(getReflections());
  }

  return (
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5e8668] flex items-center gap-1.5">
              <HeartHandshake size={14} /> Weekly Mindful Check-in 💡
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#304639] sm:text-5xl">
              Weekly Reflection
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              Pause, celebrate small wins, examine challenges & set a calm intention for next week.
            </p>
          </div>

          <span className="rounded-2xl border border-[#c6dccc] bg-[#deeee0]/70 px-3.5 py-1.5 text-xs font-bold text-[#304639] w-fit shadow-2xs">
            🌿 {reflections.length} reflections logged
          </span>
        </header>

        {/* ═══════════════════════════════════════
            STRUCTURED WEEKLY PROMPTS FORM
        ═══════════════════════════════════════ */}
        <Card className="mb-8 !bg-gradient-to-br !from-[#deeee0] !via-[#f5fbf6] !to-[#eee9f8] !border-[#c6dccc] p-6 shadow-sm glow-green">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsEditorOpen((prev) => !prev)}
          >
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5e8668] flex items-center gap-1.5">
                <Sparkles size={13} /> Weekly Growth Journal
              </span>
              <h2 className="font-caveat text-2xl font-bold text-[#304639]">
                Reflect on this week
              </h2>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[#5e8668] shadow-2xs hover:bg-white"
            >
              {isEditorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {isEditorOpen && (
            <form onSubmit={handleCreateReflection} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#304639] mb-1">
                  Week Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Week 6 • Midterm Sprint"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  className="w-full rounded-xl border border-[#c6dccc] bg-white px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#5c8766] outline-none shadow-2xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#304639] mb-1">
                    ✨ What went well?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Milestones achieved, positive habits, good moments..."
                    value={wentWell}
                    onChange={(e) => setWentWell(e.target.value)}
                    className="w-full rounded-xl border border-[#c6dccc] bg-white p-3 text-xs font-medium text-[#403842] leading-relaxed focus:border-[#5c8766] outline-none shadow-2xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#304639] mb-1">
                    🌱 What was difficult?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Obstacles, distractions, or difficult concepts..."
                    value={wasDifficult}
                    onChange={(e) => setWasDifficult(e.target.value)}
                    className="w-full rounded-xl border border-[#c6dccc] bg-white p-3 text-xs font-medium text-[#403842] leading-relaxed focus:border-[#5c8766] outline-none shadow-2xs resize-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#304639] mb-1">
                    💡 What did I learn?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Academic insights, mindset shifts, life lessons..."
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    className="w-full rounded-xl border border-[#c6dccc] bg-white p-3 text-xs font-medium text-[#403842] leading-relaxed focus:border-[#5c8766] outline-none shadow-2xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#304639] mb-1">
                    🎯 What do I want to improve?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Sleep schedule, time management, focus habits..."
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    className="w-full rounded-xl border border-[#c6dccc] bg-white p-3 text-xs font-medium text-[#403842] leading-relaxed focus:border-[#5c8766] outline-none shadow-2xs resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#304639] mb-1">
                  🌟 Next week's intention
                </label>
                <input
                  type="text"
                  placeholder="One core guiding priority for next week (e.g. Protect my 2-hour morning focus block)..."
                  value={nextWeekIntention}
                  onChange={(e) => setNextWeekIntention(e.target.value)}
                  className="w-full rounded-xl border border-[#c6dccc] bg-white px-3.5 py-2.5 text-xs font-medium text-[#403842] focus:border-[#5c8766] outline-none shadow-2xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setWentWell("");
                    setWasDifficult("");
                    setLearned("");
                    setImprove("");
                    setNextWeekIntention("");
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={!wentWell.trim() && !learned.trim() && !nextWeekIntention.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#5c8766] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#4a6e53] disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Reflection</span>
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* ═══════════════════════════════════════
            PREVIOUS REFLECTIONS LIST
        ═══════════════════════════════════════ */}
        {reflections.length === 0 ? (
          <Card className="!bg-[#deeee0] !border-[#c6dccc] p-7 text-center glow-green">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
              💡
            </div>
            <h3 className="font-caveat text-2xl font-bold text-[#304639]">
              No reflections recorded yet
            </h3>
            <p className="mt-1 text-xs max-w-sm mx-auto font-medium text-[#766d78]">
              Take 5 minutes at the end of the week to fill out the prompts above and build your growth journal.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[#5e8668]">
              Past Reflections Archive ({reflections.length})
            </div>

            {reflections.map((ref) => (
              <Card
                key={ref.id}
                className="group !bg-white/90 !border-[#efe8e1] p-5 shadow-2xs transition hover:-translate-y-0.5 hover:shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#efe8e1] pb-2.5 mb-3">
                  <h3 className="font-caveat text-2xl font-bold text-[#304639]">
                    {ref.weekOf}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#918793]">
                      {new Date(ref.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(ref.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#918793] hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                      title="Delete reflection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {ref.wentWell && (
                    <div className="rounded-xl bg-[#deeee0]/40 border border-[#c6dccc]/50 p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5e8668]">
                        ✨ What Went Well
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#403842] leading-relaxed">
                        {ref.wentWell}
                      </p>
                    </div>
                  )}

                  {ref.wasDifficult && (
                    <div className="rounded-xl bg-[#f7e0cc]/40 border border-[#edcfb5]/50 p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ae6e42]">
                        🌱 Challenges & Growth
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#403842] leading-relaxed">
                        {ref.wasDifficult}
                      </p>
                    </div>
                  )}

                  {ref.learned && (
                    <div className="rounded-xl bg-[#eee9f8]/40 border border-[#dcd5ed]/50 p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7564af]">
                        💡 Key Takeaways
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#403842] leading-relaxed">
                        {ref.learned}
                      </p>
                    </div>
                  )}

                  {ref.nextWeekIntention && (
                    <div className="rounded-xl bg-[#e2f1f6]/40 border border-[#c8dfeb]/50 p-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#57839d]">
                        🎯 Guiding Intention
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#403842] leading-relaxed">
                        {ref.nextWeekIntention}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
