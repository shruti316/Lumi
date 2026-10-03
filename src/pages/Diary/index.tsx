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
  title: "A fresh start to the new semester ✨",
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
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#ae6e42]">
              Personal Sanctuary & Journal 🌷
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#493b33] sm:text-5xl">
              My Diary
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              A quiet, aesthetic space to reflect, unwind, and document your personal journey.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-2xl border border-[#efe8e1] bg-white/80 px-3.5 py-2 text-xs font-bold text-[#ae6e42] shadow-2xs">
              ✍️ {entries.length} entries penned
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            QUICK WRITE BOX (LOW FRICTION)
        ═══════════════════════════════════════ */}
        <Card className="mb-8 !bg-gradient-to-br !from-[#f7e0cc] !to-[#fff2ea] !border-[#edcfb5] p-5 shadow-sm glow-peach">
          <form onSubmit={handleSaveEntry} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ae6e42] flex items-center gap-1.5">
                <PenLine size={14} />
                Write Today's Thoughts
              </span>

              {/* Mood selector in header */}
              <div className="flex items-center gap-1">
                {MOODS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`h-7 w-7 rounded-lg text-sm transition-transform ${
                      selectedMood === m.emoji
                        ? "bg-white border border-[#edcfb5] scale-110 shadow-2xs"
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
              className="w-full rounded-xl border border-[#edcfb5] bg-white px-3.5 py-2.5 text-xs font-bold text-[#403842] placeholder:text-[#918793] focus:border-[#ae6e42] outline-none shadow-2xs"
            />

            {(isExpanded || content) && (
              <>
                <textarea
                  placeholder="Pour your thoughts, feelings, highlights of the day, or lessons learned..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#edcfb5] bg-white p-3.5 text-xs font-medium text-[#403842] leading-relaxed placeholder:text-[#918793] focus:border-[#ae6e42] outline-none shadow-2xs resize-none"
                />

                {/* Tags Picker */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ae6e42] mr-1 flex items-center gap-1">
                    <Tag size={11} /> Tags:
                  </span>
                  {SUGGESTED_TAGS.map((t) => {
                    const isSelected = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                          isSelected
                            ? "bg-[#edcfb5] border-[#ae6e42] text-[#493b33] shadow-2xs"
                            : "bg-white border-[#efe8e1] text-[#766d78] hover:bg-[#faf8f6]"
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setContent("");
                      setSelectedTags([]);
                      setIsExpanded(false);
                    }}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() && !content.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#ae6e42] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#975c34] disabled:opacity-50"
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
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                tagFilter === null
                  ? "bg-[#f7e0cc] border border-[#edcfb5] text-[#ae6e42] shadow-2xs"
                  : "bg-white border border-[#efe8e1] text-[#766d78] hover:text-[#403842]"
              }`}
            >
              All Entries ({entries.length})
            </button>
            {SUGGESTED_TAGS.slice(0, 5).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTagFilter(tagFilter === t ? null : t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  tagFilter === t
                    ? "bg-[#f7e0cc] border border-[#edcfb5] text-[#ae6e42] shadow-2xs"
                    : "bg-white border border-[#efe8e1] text-[#766d78] hover:text-[#403842]"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-[#918793]" />
            <input
              type="text"
              placeholder="Search diary thoughts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#efe8e1] bg-white pl-8 pr-3 py-1.5 text-xs font-medium text-[#403842] shadow-2xs outline-none"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ENTRIES MASONRY / GRID
        ═══════════════════════════════════════ */}
        {filteredEntries.length === 0 ? (
          <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-8 text-center glow-peach">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
              🌷
            </div>
            <h3 className="font-caveat text-2xl font-bold text-[#493b33]">
              No entries found
            </h3>
            <p className="mt-1 text-xs text-[#766d78]">
              Write down your thoughts in the box above to start filling your diary.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="group relative flex flex-col justify-between !bg-white/90 !border-[#efe8e1] p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#766d78]">
                      <CalendarDays size={13} />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f7e0cc] text-base border border-[#edcfb5]"
                        title={entry.mood}
                      >
                        {entry.mood || "😊"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#918793] hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-[#403842] leading-snug">
                    {entry.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium text-[#574c5d] leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 pt-2.5 border-t border-[#efe8e1] flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#faf8f6] border border-[#efe8e1] px-2 py-0.5 text-[10px] font-bold text-[#ae6e42]"
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