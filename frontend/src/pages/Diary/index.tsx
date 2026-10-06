import { useState, useEffect } from "react";
import {
  CalendarDays,
  PenLine,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags?: string[];
  date?: string;
  createdAt?: string;
}

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

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline Quick Entry State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("😊");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  async function fetchEntries() {
    setLoading(true);
    const { data } = await api.journals.getAll();
    if (data?.journals) {
      setEntries(
        data.journals.map((j: any) => ({
          id: j.id,
          title: j.title,
          content: j.entry || j.content || "",
          mood: j.mood || "😊",
          tags: Array.isArray(j.tags) ? j.tags : ["college"],
          date: j.date,
          createdAt: j.createdAt,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEntries();
    const handleSync = () => {
      fetchEntries();
    };
    window.addEventListener("lumi-sync", handleSync);
    return () => window.removeEventListener("lumi-sync", handleSync);
  }, []);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSaveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const { data } = await api.journals.create({
      title: title.trim() || "Untitled reflection",
      entry: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      date: new Date().toISOString().split("T")[0],
    });

    if (data?.journal) {
      setEntries((prev) => [
        {
          id: data.journal.id,
          title: data.journal.title,
          content: data.journal.entry,
          mood: data.journal.mood,
          tags: selectedTags.length > 0 ? selectedTags : ["college"],
          date: data.journal.date,
          createdAt: data.journal.createdAt,
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync"));
    }

    setTitle("");
    setContent("");
    setSelectedMood("😊");
    setSelectedTags([]);
    setIsExpanded(false);
  }

  async function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await api.journals.delete(id);
    window.dispatchEvent(new CustomEvent("lumi-sync"));
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase()) ||
      (entry.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = tagFilter ? (entry.tags || []).includes(tagFilter) : true;
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Today";
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
              placeholder="Give your thoughts a title (optional)..."
              value={title}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white/90 px-4 py-2.5 text-xs font-semibold text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
            />

            <textarea
              rows={isExpanded ? 4 : 2}
              placeholder="What happened today? How are you feeling? Capture gratitude or lessons..."
              value={content}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white/90 p-4 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none resize-none leading-relaxed shadow-2xs transition-all"
            />

            {/* Tags & Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#8D8792] uppercase mr-1">
                  Tags:
                </span>
                {SUGGESTED_TAGS.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-[#17151C] text-white"
                        : "bg-white/80 border border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {isExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[#5F5965] hover:bg-white/50 cursor-pointer"
                  >
                    Collapse
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!title.trim() && !content.trim()}
                  className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </form>
        </Card>

        {/* ═══════════════════════════════════════
            SEARCH & FILTER BAR
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D8792]"
            />
            <input
              type="text"
              placeholder="Search previous diary entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
            />
          </div>

          {/* Tag Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTagFilter(null)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                tagFilter === null
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
              }`}
            >
              All
            </button>
            {SUGGESTED_TAGS.slice(0, 4).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  tagFilter === tag
                    ? "bg-[#9E96D8] text-white shadow-2xs"
                    : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#EEEAFE]"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ENTRIES TIMELINE FEED
        ═══════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-2xl">
              ✍️
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17151C]">No journal entries found</h3>
            <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
              {search || tagFilter
                ? "No entries match your search query."
                : "Your private space is quiet. Write your first thought in the box above."}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                variant="default"
                hoverEffect
                className="group p-5 bg-white border-[#E8E3F0] transition duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F7F5F8] text-base border border-[#E8E3F0]">
                      {entry.mood}
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#17151C]">
                        {entry.title}
                      </h3>
                      <p className="text-[10px] text-[#8D8792] font-semibold flex items-center gap-1 mt-0.5">
                        <CalendarDays size={11} className="text-[#9E96D8]" />
                        {formatDate(entry.date || entry.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#8D8792] hover:text-[#D84C2C] hover:bg-[#FDECE8] transition cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-xs text-[#5F5965] font-normal leading-relaxed whitespace-pre-wrap pl-10">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#F7F5F8] flex flex-wrap gap-1.5 pl-10">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[#F7F5F8] border border-[#E8E3F0] px-2 py-0.5 text-[10px] font-semibold text-[#5F5965]"
                      >
                        #{t}
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