import { useState } from "react";
import { Plus, Search, Pin, Trash2, Tag, BookMarked } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  type Note,
} from "../../lib/lifeOSStorage";

const QUICK_TAGS = ["college", "algorithms", "exam", "formulas", "ideas", "reference"];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pinned" | "recent">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      tags: tags.length > 0 ? tags : ["college"],
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    addNote(newNote);
    setNotes(getNotes());

    setTitle("");
    setContent("");
    setTagsInput("");
    setShowModal(false);
  }

  function handleTogglePin(note: Note) {
    const updated = { ...note, pinned: !note.pinned };
    updateNote(updated);
    setNotes(getNotes());
  }

  function handleDelete(id: string) {
    deleteNote(id);
    setNotes(getNotes());
  }

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    const matchesTab =
      activeTab === "pinned" ? n.pinned : activeTab === "recent" ? true : true;

    return matchesSearch && matchesTag && matchesTab;
  });

  const pinnedCount = notes.filter((n) => n.pinned).length;

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
                Knowledge & Reference
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Notes & <span className="font-editorial-italic font-normal text-[#9E96D8]">Knowledge</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Capture lecture summaries, key takeaways, formulas & conceptual notes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            FILTER & SEARCH ROW
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSelectedTag(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "all" && !selectedTag
                  ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              All Notes ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pinned")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "pinned"
                  ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Pin size={12} className={activeTab === "pinned" ? "text-[#9E96D8]" : ""} />
              <span>Pinned ({pinnedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === "recent"
                  ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              Recent
            </button>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30"
            />
          </div>
        </div>

        {/* Tags bar */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D8792] mr-1 flex items-center gap-1">
              <Tag size={11} /> Filter:
            </span>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                  selectedTag === t
                    ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs"
                    : "bg-white border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NOTES LIST / EMPTY STATE
        ═══════════════════════════════════════ */}
        {filteredNotes.length === 0 ? (
          <div className="space-y-6">
            <Card variant="blue" className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                📝
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#17151C]">
                Your notes will live here
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#5F5965] leading-relaxed">
                Capture college notes, ideas, reminders, exam formulas, and anything worth remembering in one clean space.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Note</span>
              </button>
            </Card>

            <Card variant="pearl" className="p-5 border-[#E8E3F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F5965] flex items-center gap-1.5 mb-3">
                <BookMarked size={14} className="text-[#9E96D8]" /> Quick Note Starters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 text-xs shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">📖 Lecture Takeaways</p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">Key terms & bullet points from today's classes.</p>
                </div>
                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 text-xs shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">⚡ Formula Cheatsheet</p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">Quick formulas & algorithms to memorize.</p>
                </div>
                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 text-xs shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">💡 Spontaneous Ideas</p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">Project concepts & college event plans.</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                variant="glass"
                hoverEffect
                className="group relative flex flex-col justify-between p-5 border-[#E8E3F0] bg-white/95"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <h3 className="font-serif font-bold text-base text-[#17151C] leading-snug truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(note)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition cursor-pointer ${
                          note.pinned
                            ? "bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2] shadow-2xs"
                            : "bg-[#F7F5F8] text-[#8D8792] hover:text-[#17151C]"
                        }`}
                        title={note.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-normal text-[#5F5965] line-clamp-4 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3F0] flex flex-wrap items-center justify-between gap-1 text-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2 py-0.5 font-semibold text-[#5F5965]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-medium text-[#8D8792]">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW NOTE MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Note"
          subtitle="Capture knowledge, lecture summaries, and formulas."
        >
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Dynamic Programming Memoization Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Note Content *
              </label>
              <textarea
                rows={5}
                placeholder="Write your notes, formulas, or summaries here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none resize-none leading-relaxed shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. algorithms, cs, midterm"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTagsInput((prev) =>
                        prev ? `${prev}, ${t}` : t
                      )
                    }
                    className="rounded-lg bg-white border border-[#E8E3F0] px-2 py-0.5 text-[10px] font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
                  >
                    +{t}
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
                disabled={!title.trim() && !content.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
