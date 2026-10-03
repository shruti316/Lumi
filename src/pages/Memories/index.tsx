import { useState } from "react";
import { Plus, Trash2, X, Sparkles, Camera, Image as ImageIcon } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getMemories,
  addMemory,
  deleteMemory,
  type Memory,
} from "../../lib/lifeOSStorage";

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>(() => getMemories());
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");

  function handleCreateMemory(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newMem: Memory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      caption: caption.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
      date: date || new Date().toISOString().split("T")[0],
      tags: ["college", "life"],
      createdAt: new Date().toISOString(),
    };

    addMemory(newMem);
    setMemories(getMemories());

    setTitle("");
    setCaption("");
    setImageUrl("");
    setDate("");
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteMemory(id);
    setMemories(getMemories());
  }

  return (
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#806C79]">
              Visual Memory Log 📸
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              Memories & Moments
            </h1>
            <p className="font-caveat text-xl text-[#806C79]">
              Campus highlights, coffee runs, study milestones & little moments to remember.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#F0D9E4] border border-[#D7C5D2] px-4 py-2.5 text-xs font-bold text-[#312A44] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#E7CAD7] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>Upload Memory</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            GALLERY / BEAUTIFUL EMPTY STATE
        ═══════════════════════════════════════ */}
        {memories.length === 0 ? (
          <div className="space-y-6">
            {/* Visual Floating Frame Placeholder Card */}
            <Card className="relative overflow-hidden !bg-gradient-to-br !from-[#F0D9E4] !via-[#F4F0EB] !to-[#DAD4DF] !border-[#D7C5D2] p-8 text-center shadow-sm glow-pink">
              {/* Subtle Decorative floating photo frame shapes */}
              <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-2xl border border-white/60 bg-white/30 rotate-12 backdrop-blur-xs" />
              <div className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 rounded-2xl border border-white/60 bg-white/30 -rotate-12 backdrop-blur-xs" />

              <div className="relative z-10">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-md border border-[#D7C5D2] transition-transform duration-300 hover:scale-105">
                  📸
                </div>
                <h3 className="font-caveat text-3xl font-bold text-[#16131F]">
                  Your memories will live here
                </h3>
                <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#806C79] leading-relaxed">
                  Save little campus moments, study room victories, coffee dates, and aesthetic photo memories from college life.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#312A44] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#211C2B]"
                >
                  <Camera size={15} />
                  <span>Upload First Memory</span>
                </button>
              </div>
            </Card>

            {/* Starter Photography Inspiration */}
            <div className="rounded-2xl border border-[#DAD4DF] bg-white/70 p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#806C79] flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} /> Ideas for your memory log
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">☕ Campus Coffee Spots</p>
                  <p className="mt-1 text-[11px] text-[#806C79]">Your favorite study beverage or cafe corner.</p>
                </div>
                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">💻 Project Sprints</p>
                  <p className="mt-1 text-[11px] text-[#806C79]">Snap a photo when shipping a build or lab project.</p>
                </div>
                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">🌷 Golden Hour on Campus</p>
                  <p className="mt-1 text-[11px] text-[#806C79]">Scenic views on the walk between lectures.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {memories.map((mem) => (
              <Card
                key={mem.id}
                className="group relative flex flex-col justify-between overflow-hidden !bg-white/95 !border-[#DAD4DF] p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div
                    className="relative h-48 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#F0D9E4] to-[#DAD4DF]"
                    onClick={() => setSelectedImage(mem)}
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-end justify-between p-3">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1">
                        <ImageIcon size={12} /> View Full
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#16131F] truncate">
                        {mem.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleDelete(mem.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#806C79] hover:text-rose-500 hover:bg-rose-50 transition"
                        title="Delete memory"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <p className="text-[10px] font-semibold text-[#806C79] mt-0.5">
                      {mem.date}
                    </p>

                    {mem.caption && (
                      <p className="mt-1.5 text-[11px] text-[#806C79] line-clamp-2 leading-relaxed">
                        {mem.caption}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            LIGHTBOX VIEWER MODAL
        ═══════════════════════════════════════ */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm select-none"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-xl w-full rounded-3xl bg-[#F4F0EB] p-4 shadow-2xl border border-[#DAD4DF]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition z-10"
              >
                <X size={16} />
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="h-80 w-full rounded-2xl object-cover shadow-inner"
              />
              <div className="mt-4 px-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#16131F]">
                    {selectedImage.title}
                  </h3>
                  <span className="text-[11px] font-bold text-[#806C79]">
                    {selectedImage.date}
                  </span>
                </div>
                {selectedImage.caption && (
                  <p className="text-xs text-[#806C79] mt-1.5 leading-relaxed">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW MEMORY MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Capture a Memory 📸"
          subtitle="Add photos and stories from your campus life."
        >
          <form onSubmit={handleCreateMemory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Late night hackathon with team"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] focus:border-[#806C79] focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Image URL (Unsplash or direct link)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#806C79] focus:bg-white outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#806C79] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Caption / Moment Note
                </label>
                <textarea
                  rows={2}
                  placeholder="What made this moment special..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#806C79] focus:bg-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#806C79] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#211C2B] disabled:opacity-50"
              >
                Save Memory
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
