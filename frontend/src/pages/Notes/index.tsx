import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Tag, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const QUICK_TAGS = ["college", "algorithms", "exam", "formulas", "ideas", "reference"];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  async function fetchNotes() {
    setLoading(true);
    const { data } = await api.workspace.getNotes();
    if (data?.notes) {
      setNotes(
        data.notes.map((n: any) => ({
          ...n,
          tags: Array.isArray(n.tags) ? n.tags : [],
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchNotes();
    const handleSync = () => {
      fetchNotes();
    };
    window.addEventListener("lumi-sync", handleSync);
    return () => window.removeEventListener("lumi-sync", handleSync);
  }, []);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const { data } = await api.workspace.createNote({
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      tags: tags.length > 0 ? tags : ["college"],
      category: "General",
    });

    if (data?.note) {
      setNotes((prev) => [
        {
          ...data.note,
          tags: Array.isArray(data.note.tags) ? data.note.tags : tags,
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "note" } }));
    }

    setTitle("");
    setContent("");
    setTagsInput("");
    setShowModal(false);
  }

  async function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await api.workspace.deleteNote(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "note" } }));
  }

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag ? (n.tags || []).includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

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
            SEARCH & CONTROLS
        ═══════════════════════════════════════ */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D8792]"
            />
            <input
              type="text"
              placeholder="Search notes or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
            />
          </div>

          {/* Tags Filter Chips */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  selectedTag === null
                    ? "bg-[#17151C] text-white shadow-2xs"
                    : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedTag === tag
                      ? "bg-[#9E96D8] text-white shadow-2xs"
                      : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#EEEAFE]"
                  }`}
                >
                  <Tag size={10} />
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
            NOTES GRID
        ═══════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
              <Tag size={22} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17151C]">No notes found</h3>
            <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
              {search || selectedTag
                ? "No notes match your active filter."
                : "Create your first note to capture ideas, summaries, and code snippets."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                variant="default"
                hoverEffect
                className="group flex flex-col justify-between p-4 bg-white border-[#E8E3F0]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-base font-bold text-[#17151C] line-clamp-1">
                      {note.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#8D8792] hover:text-[#D84C2C] hover:bg-[#FDECE8] transition cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <p className="text-xs text-[#5F5965] font-normal line-clamp-5 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#F7F5F8] flex flex-wrap gap-1.5">
                    {note.tags.map((t) => (
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
