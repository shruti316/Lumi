import { useState } from "react";
import {
  CalendarDays,
  Heart,
  PenLine,
  Search,
  Trash2,
  Tag,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  addDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntries,
  type DiaryEntry,
} from "../../lib/diaryStorage";

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

const STARTER_ENTRY: Omit<DiaryEntry, "id" | "createdAt"> = {
  title: "A fresh start to the new semester",
  content:
    "Feeling optimistic about building better daily routines and keeping up with coursework. Spent some time organizing my notes and enjoying a warm matcha latte this afternoon. Taking things one day at a time.",
  mood: "🥰",
  tags: ["college", "growth", "gratitude"],
};

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const existing = getDiaryEntries();
    if (existing.length === 0) {
      const starter = {
        ...STARTER_ENTRY,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      addDiaryEntry(starter);
      return [starter];
    }
    return existing;
  });

  // Inline Quick Entry State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("😊");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSaveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled reflection",
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    };

    addDiaryEntry(newEntry);
    setEntries(getDiaryEntries());
    setTitle("");
    setContent("");
    setSelectedMood("😊");
    setSelectedTags([]);
    setIsExpanded(false);
  }

  function handleDelete(id: string) {
    deleteDiaryEntry(id);
    setEntries(getDiaryEntries());
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = tagFilter ? entry.tags.includes(tagFilter) : true;
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
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
                Personal Sanctuary
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Digital <span className="font-editorial-italic font-normal text-[#9E96D8]">Journal</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              A quiet, aesthetic journal to reflect, document milestones, and collect thoughts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[#E8E3F0] bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#17151C] shadow-2xs">
              ✍️ {entries.length} reflections penned
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            QUICK WRITE BOX
        ═══════════════════════════════════════ */}
        <Card
          variant="peach"
          hoverEffect
          className="mb-8 p-6 border-[#F1D2C9] shadow-sm"
        >
          <form onSubmit={handleSaveEntry} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F5965] flex items-center gap-1.5">
                <PenLine size={14} className="text-[#D99BB8]" />
                Write Today's Entry
              </span>

              {/* Mood selector */}
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
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/80 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
            />

            {(isExpanded || content) && (
              <>
                <textarea
                  placeholder="Pour your thoughts, feelings, highlights of the day, or lessons learned..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-white/80 bg-white/90 p-3.5 text-xs font-medium text-[#17151C] leading-relaxed placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
                />

                {/* Tags Picker */}
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
                      setIsExpanded(false);
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

        {/* ═══════════════════════════════════════
            SEARCH & TAG FILTER BAR
        ═══════════════════════════════════════ */}
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
            {SUGGESTED_TAGS.slice(0, 5).map((t) => (
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
              placeholder="Search diary thoughts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ENTRIES MASONRY / GRID
        ═══════════════════════════════════════ */}
        {filteredEntries.length === 0 ? (
          <Card variant="peach" className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
              🌷
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17151C]">
              No entries found
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
                        onClick={() => handleDelete(entry.id)}
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
    </div>
  );
}