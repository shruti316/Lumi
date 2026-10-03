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

  // Extract all unique tags
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
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#57839d]">
              Knowledge Space 📝
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#364750] sm:text-5xl">
              Notes
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              Capture college lecture summaries, formulas, ideas & key takeaways.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#e2f1f6] border border-[#c8dfeb] px-4 py-2.5 text-xs font-bold text-[#364750] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#d4eaf1] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            FILTER & SEARCH ROW
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs: All, Pinned, Recent */}
          <div className="flex gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 p-1 w-fit shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSelectedTag(null);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "all" && !selectedTag
                  ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                  : "text-[#766d78] hover:text-[#403842]"
              }`}
            >
              All Notes ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pinned")}
              className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "pinned"
                  ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                  : "text-[#766d78] hover:text-[#403842]"
              }`}
            >
              <Pin size={12} />
              <span>Pinned ({pinnedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "recent"
                  ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                  : "text-[#766d78] hover:text-[#403842]"
              }`}
            >
              Recent
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-[#918793]" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#efe8e1] bg-white pl-8 pr-3 py-1.5 text-xs font-medium text-[#403842] shadow-2xs outline-none focus:border-[#57839d]"
            />
          </div>
        </div>

        {/* Tags bar if tags exist */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#57839d] mr-1 flex items-center gap-1">
              <Tag size={11} /> Filter:
            </span>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                  selectedTag === t
                    ? "bg-[#c8dfeb] border-[#57839d] text-[#364750] shadow-2xs"
                    : "bg-white border-[#efe8e1] text-[#766d78] hover:bg-[#faf8f6]"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NOTES LIST / COMPACT EMPTY STATE
        ═══════════════════════════════════════ */}
        {filteredNotes.length === 0 ? (
          <div className="space-y-6">
            <Card className="!bg-[#e2f1f6] !border-[#c8dfeb] p-7 text-center glow-blue">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
                📝
              </div>
              <h3 className="font-caveat text-3xl font-bold text-[#364750]">
                Your notes will live here
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#766d78] leading-relaxed">
                Capture college notes, ideas, reminders, exam formulas, and anything worth remembering in one clean space.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#57839d] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#466a7f]"
              >
                <Plus size={15} />
                <span>Create Note</span>
              </button>
            </Card>

            {/* Quick Starter Topics */}
            <div className="rounded-2xl border border-[#efe8e1] bg-white/70 p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#57839d] flex items-center gap-1.5 mb-2.5">
                <BookMarked size={14} /> Quick Note Starters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-[#efe8e1] bg-white p-3 text-xs">
                  <p className="font-bold text-[#403842]">📖 Lecture Takeaways</p>
                  <p className="mt-1 text-[11px] text-[#766d78]">Key terms & bullet points from today's classes.</p>
                </div>
                <div className="rounded-xl border border-[#efe8e1] bg-white p-3 text-xs">
                  <p className="font-bold text-[#403842]">⚡ Formula Cheatsheet</p>
                  <p className="mt-1 text-[11px] text-[#766d78]">Quick formulas & algorithms to memorize.</p>
                </div>
                <div className="rounded-xl border border-[#efe8e1] bg-white p-3 text-xs">
                  <p className="font-bold text-[#403842]">💡 Spontaneous Ideas</p>
                  <p className="mt-1 text-[11px] text-[#766d78]">Project concepts & college event plans.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className="group relative flex flex-col justify-between !bg-white/90 !border-[#efe8e1] p-4.5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-[#403842] leading-snug truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(note)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                          note.pinned
                            ? "bg-[#e2f1f6] text-[#57839d] shadow-2xs"
                            : "bg-[#faf8f6] text-[#918793] hover:text-[#57839d]"
                        }`}
                        title={note.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#faf8f6] text-[#918793] hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[#574c5d] line-clamp-4 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#efe8e1] flex flex-wrap items-center justify-between gap-1 text-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#e2f1f6] px-2 py-0.5 font-bold text-[#57839d]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-[#918793]">
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
          title="Create New Note 📝"
          subtitle="Capture knowledge, lecture summaries & formulas."
        >
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Dynamic Programming Memoization Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Note Content *
              </label>
              <textarea
                rows={5}
                placeholder="Write your notes, formulas, or summaries here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] p-3 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. algorithms, cs, midterm"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
              />
              <div className="mt-1.5 flex flex-wrap gap-1">
                {QUICK_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTagsInput((prev) =>
                        prev ? `${prev}, ${t}` : t
                      )
                    }
                    className="rounded-md bg-white border border-[#efe8e1] px-2 py-0.5 text-[10px] font-bold text-[#57839d] hover:bg-[#e2f1f6]"
                  >
                    +{t}
                  </button>
                ))}
              </div>
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
                disabled={!title.trim() && !content.trim()}
                className="rounded-xl bg-[#57839d] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#466a7f] disabled:opacity-50"
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
