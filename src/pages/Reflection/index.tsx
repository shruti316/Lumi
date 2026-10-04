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
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#528D6F]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792] flex items-center gap-1.5">
                <HeartHandshake size={14} className="text-[#528D6F]" /> Mindful Growth
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Weekly <span className="font-editorial-italic font-normal text-[#9E96D8]">Reflection</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Pause, celebrate small wins, examine challenges, and set calm intentions.
            </p>
          </div>

          <span className="rounded-xl border border-[#CCE5DC] bg-[#EEF8F4] px-3.5 py-1.5 text-xs font-semibold text-[#3E7D5C] w-fit shadow-2xs">
            🌿 {reflections.length} reflections logged
          </span>
        </header>

        {/* ═══════════════════════════════════════
            STRUCTURED WEEKLY PROMPTS FORM
        ═══════════════════════════════════════ */}
        <Card
          variant="default"
          hoverEffect
          className="mb-8 p-6 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] via-white to-[#FDF3EC] shadow-sm"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsEditorOpen((prev) => !prev)}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7D63] flex items-center gap-1.5">
                <Sparkles size={13} /> Weekly Growth Journal
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#17151C] mt-0.5">
                Reflect on this week
              </h2>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#4A7D63] shadow-2xs border border-[#CCE5DC] hover:bg-[#EEF8F4] cursor-pointer"
            >
              {isEditorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {isEditorOpen && (
            <form onSubmit={handleCreateReflection} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Week Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Week 6 • Midterm Sprint"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    ✨ What went well?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Milestones achieved, positive habits, good moments..."
                    value={wentWell}
                    onChange={(e) => setWentWell(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    🌱 What was difficult?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Obstacles, distractions, or difficult concepts..."
                    value={wasDifficult}
                    onChange={(e) => setWasDifficult(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    💡 What did I learn?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Academic insights, mindset shifts, life lessons..."
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    🎯 What do I want to improve?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Sleep schedule, time management, focus habits..."
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  🌟 Next week's guiding intention
                </label>
                <input
                  type="text"
                  placeholder="One core guiding priority for next week (e.g. Protect my 2-hour morning focus block)..."
                  value={nextWeekIntention}
                  onChange={(e) => setNextWeekIntention(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setWentWell("");
                    setWasDifficult("");
                    setLearned("");
                    setImprove("");
                    setNextWeekIntention("");
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-white cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={!wentWell.trim() && !learned.trim() && !nextWeekIntention.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Reflection</span>
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* ═══════════════════════════════════════
            PAST REFLECTIONS ARCHIVE
        ═══════════════════════════════════════ */}
        {reflections.length === 0 ? (
          <Card variant="pearl" className="p-8 text-center border-[#E8E3F0]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-[#E8E3F0]">
              💡
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17151C]">
              No reflections recorded yet
            </h3>
            <p className="mt-1 text-xs max-w-sm mx-auto font-normal text-[#5F5965]">
              Take 5 minutes at the end of the week to fill out the prompts above and build your growth journal.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
              Past Reflections Archive ({reflections.length})
            </div>

            {reflections.map((ref) => (
              <Card
                key={ref.id}
                variant="glass"
                hoverEffect
                className="group p-6 border-[#E8E3F0] bg-white/95"
              >
                <div className="flex items-center justify-between border-b border-[#E8E3F0] pb-3 mb-4">
                  <h3 className="font-serif text-xl font-bold text-[#17151C]">
                    {ref.weekOf}
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-medium text-[#8D8792]">
                      {new Date(ref.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(ref.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete reflection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                  {ref.wentWell && (
                    <div className="rounded-xl bg-[#EEF8F4] border border-[#CCE5DC] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#3E7D5C]">
                        ✨ What Went Well
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#17151C] leading-relaxed">
                        {ref.wentWell}
                      </p>
                    </div>
                  )}

                  {ref.wasDifficult && (
                    <div className="rounded-xl bg-[#FDF3EC] border border-[#F1D2C9] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A644D]">
                        🌱 Challenges & Growth
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#17151C] leading-relaxed">
                        {ref.wasDifficult}
                      </p>
                    </div>
                  )}

                  {ref.learned && (
                    <div className="rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B5BA5]">
                        💡 Key Takeaways
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#17151C] leading-relaxed">
                        {ref.learned}
                      </p>
                    </div>
                  )}

                  {ref.nextWeekIntention && (
                    <div className="rounded-xl bg-[#EEF3FA] border border-[#D9E7F2] p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A729A]">
                        🎯 Guiding Intention
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#17151C] leading-relaxed">
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
