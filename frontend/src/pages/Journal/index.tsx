import { useState } from "react";
import {
  PenLine,
  Sparkles,
  CalendarDays,
  Heart,
  Search,
  Trash2,
  Tag,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getDiaryEntries,
  addDiaryEntry,
  deleteDiaryEntry,
  type DiaryEntry,
} from "../../lib/diaryStorage";
import {
  getReflections,
  addReflection,
  deleteReflection,
  type ReflectionEntry,
} from "../../lib/lifeOSStorage";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🥰", label: "Grateful" },
  { emoji: "⚡", label: "Energized" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Reflective" },
  { emoji: "😴", label: "Tired" },
];

const SUGGESTED_TAGS = [
  "college",
  "gratitude",
  "wins",
  "friends",
  "learning",
  "memories",
  "thoughts",
  "growth",
];

export default function Journal() {
  const [activeTab, setActiveTab] = useState<"diary" | "reflections">("diary");

  // Diary State
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getDiaryEntries());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("😊");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [diarySearch, setDiarySearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [isQuickWriteOpen, setIsQuickWriteOpen] = useState(false);

  // Reflection State
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => getReflections());
  const [weekOf, setWeekOf] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [wasDifficult, setWasDifficult] = useState("");
  const [learned, setLearned] = useState("");
  const [improve, setImprove] = useState("");
  const [nextWeekIntention, setNextWeekIntention] = useState("");
  const [isReflectionFormOpen, setIsReflectionFormOpen] = useState(true);

  // Diary Handlers
  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSaveDiary(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    addDiaryEntry({
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled reflection",
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags.length > 0 ? selectedTags : ["daily"],
      createdAt: new Date().toISOString(),
    });

    setEntries(getDiaryEntries());
    setTitle("");
    setContent("");
    setSelectedMood("😊");
    setSelectedTags([]);
    setIsQuickWriteOpen(false);
  }

  function handleDeleteDiary(id: string) {
    deleteDiaryEntry(id);
    setEntries(getDiaryEntries());
  }

  // Reflection Handlers
  function handleSaveReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!wentWell.trim() && !learned.trim() && !nextWeekIntention.trim()) return;

    const currentWeekLabel =
      weekOf.trim() ||
      `Week of ${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

    addReflection({
      id: crypto.randomUUID(),
      weekOf: currentWeekLabel,
      wentWell: wentWell.trim(),
      wasDifficult: wasDifficult.trim() + (improve.trim() ? ` • Focus: ${improve.trim()}` : ""),
      learned: learned.trim(),
      nextWeekIntention: nextWeekIntention.trim(),
      createdAt: new Date().toISOString(),
    });

    setReflections(getReflections());
    setWentWell("");
    setWasDifficult("");
    setLearned("");
    setImprove("");
    setNextWeekIntention("");
    setWeekOf("");
  }

  function handleDeleteReflection(id: string) {
    deleteReflection(id);
    setReflections(getReflections());
  }

  // Filtered Diary Entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(diarySearch.toLowerCase()) ||
      entry.content.toLowerCase().includes(diarySearch.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(diarySearch.toLowerCase()));
    const matchesTag = tagFilter ? entry.tags.includes(tagFilter) : true;
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D99BB8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Personal Sanctuary & Reflection
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Journal & <span className="font-editorial-italic font-normal text-[#9E96D8]">Reflection</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              A quiet space for daily journaling, weekly reflections, and mindful thoughts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[#E8E3F0] bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#17151C] shadow-2xs">
              ✍️ {entries.length + reflections.length} writings penned
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Daily Entries
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {entries.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Moments documented
            </p>
          </Card>

          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Weekly Reflections
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {reflections.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#4A7D63]">
              Growth reviews logged
            </p>
          </Card>

          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Mindset Rhythm
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Sparkles size={18} className="text-[#9E96D8]" />
              Mindful
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Calm perspective
            </p>
          </Card>

          <Card variant="pink" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Latest Mood
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {entries.length > 0 ? entries[0].mood || "😊" : "✨"}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Current vibe
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
              onClick={() => setActiveTab("diary")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "diary"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <PenLine size={15} className={activeTab === "diary" ? "text-[#9E96D8]" : ""} />
              <span>Daily Journal</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {entries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reflections")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "reflections"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <HeartHandshake size={15} className={activeTab === "reflections" ? "text-[#9E96D8]" : ""} />
              <span>Weekly Reflections</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {reflections.length}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            VIEW 1: DAILY DIARY
        ========================================================= */}
        {activeTab === "diary" && (
          <div>
            {/* Quick Write Box */}
            <Card
              variant="peach"
              hoverEffect
              className="mb-8 p-6 border-[#F1D2C9] shadow-sm"
            >
              <form onSubmit={handleSaveDiary} className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F5965] flex items-center gap-1.5">
                    <PenLine size={14} className="text-[#D99BB8]" />
                    Write in Journal
                  </span>

                  <div className="flex items-center gap-1">
                    {MOODS.map((m) => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setSelectedMood(m.emoji)}
                        className={`h-7 w-7 rounded-lg text-sm transition-transform cursor-pointer ${
                          selectedMood === m.emoji
                            ? "bg-white border border-[#D99BB8] scale-110 shadow-2xs"
                            : "opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                        title={m.label}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Give today a title (e.g. Afternoon coffee & breakthroughs)..."
                  value={title}
                  onFocus={() => setIsQuickWriteOpen(true)}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                />

                {(isQuickWriteOpen || content) && (
                  <>
                    <textarea
                      placeholder="Pour your thoughts, highlights, gratitude, or lessons learned..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-white/80 bg-white/90 p-3.5 text-xs font-medium text-[#17151C] leading-relaxed placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965] mr-1 flex items-center gap-1">
                        <Tag size={11} /> Tags:
                      </span>
                      {SUGGESTED_TAGS.map((t) => {
                        const isSelected = selectedTags.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleTag(t)}
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                              isSelected
                                ? "bg-[#17151C] border-[#17151C] text-white shadow-2xs"
                                : "bg-white/80 border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                            }`}
                          >
                            #{t}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTitle("");
                          setContent("");
                          setSelectedTags([]);
                          setIsQuickWriteOpen(false);
                        }}
                        className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-white/60 cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={!title.trim() && !content.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
                      >
                        <Heart size={13} />
                        <span>Save Entry</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </Card>

            {/* Filter and Search Bar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTagFilter(null)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    tagFilter === null
                      ? "bg-[#EEEAFE] border border-[#DDD8F2] text-[#17151C] shadow-2xs"
                      : "bg-white/80 border border-[#E8E3F0] text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  All Entries ({entries.length})
                </button>
                {SUGGESTED_TAGS.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTagFilter(tagFilter === t ? null : t)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      tagFilter === t
                        ? "bg-[#EEEAFE] border border-[#DDD8F2] text-[#17151C] shadow-2xs"
                        : "bg-white/80 border border-[#E8E3F0] text-[#5F5965] hover:text-[#17151C]"
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
                <input
                  type="text"
                  placeholder="Search journal thoughts..."
                  value={diarySearch}
                  onChange={(e) => setDiarySearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8]"
                />
              </div>
            </div>

            {/* Entries List */}
            {filteredEntries.length === 0 ? (
              <Card variant="peach" className="p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                  🌷
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                  No journal entries found
                </h3>
                <p className="mt-1 text-xs text-[#5F5965]">
                  Write down your thoughts in the box above to begin filling your journal.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    variant="glass"
                    hoverEffect
                    className="group relative flex flex-col justify-between p-6 border-[#E8E3F0] bg-white/90"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#8D8792]">
                          <CalendarDays size={13} className="text-[#9E96D8]" />
                          <span>{formatDate(entry.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FDF3EC] text-base border border-[#F1D2C9]"
                            title={entry.mood}
                          >
                            {entry.mood || "😊"}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteDiary(entry.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#17151C] leading-snug tracking-tight">
                        {entry.title}
                      </h3>

                      <p className="mt-2.5 text-xs font-normal text-[#5F5965] leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E8E3F0] flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2 py-0.5 text-[10px] font-semibold text-[#5F5965]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 2: WEEKLY REFLECTIONS
        ========================================================= */}
        {activeTab === "reflections" && (
          <div>
            {/* Structured Weekly Prompts */}
            <Card
              variant="default"
              hoverEffect
              className="mb-8 p-6 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] via-white to-[#FDF3EC] shadow-sm"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsReflectionFormOpen((prev) => !prev)}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7D63] flex items-center gap-1.5">
                    <Sparkles size={13} /> Guided Weekly Template
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#17151C] mt-0.5">
                    Reflect on this week
                  </h2>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#4A7D63] shadow-2xs border border-[#CCE5DC] hover:bg-[#EEF8F4] cursor-pointer"
                >
                  {isReflectionFormOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isReflectionFormOpen && (
                <form onSubmit={handleSaveReflection} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17151C] mb-1">
                      Week Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Week 6 • Midterm Sprint"
                      value={weekOf}
                      onChange={(e) => setWeekOf(e.target.value)}
                      className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
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
                        className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] outline-none shadow-2xs resize-none"
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
                        className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] outline-none shadow-2xs resize-none"
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
                        className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] outline-none shadow-2xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17151C] mb-1">
                        🌟 Next week's guiding intention
                      </label>
                      <textarea
                        rows={3}
                        placeholder="One core guiding priority for next week..."
                        value={nextWeekIntention}
                        onChange={(e) => setNextWeekIntention(e.target.value)}
                        className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] outline-none shadow-2xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWentWell("");
                        setWasDifficult("");
                        setLearned("");
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

            {/* Past Reflections Archive */}
            {reflections.length === 0 ? (
              <Card variant="pearl" className="p-8 text-center border-[#E8E3F0]">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-[#E8E3F0]">
                  💡
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                  No reflections recorded yet
                </h3>
                <p className="mt-1 text-xs max-w-sm mx-auto font-normal text-[#5F5965]">
                  Take a few minutes at the end of the week to fill out the prompts above and build your growth journal.
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
                          onClick={() => handleDeleteReflection(ref.id)}
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
        )}
      </div>
    </div>
  );
}
