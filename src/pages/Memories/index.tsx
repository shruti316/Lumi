import { useState } from "react";
import {
  Camera,
  ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  addMemory,
  deleteMemory,
  getMemories,
  type Memory,
} from "../../lib/lifeOSStorage";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>(() => getMemories());
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [caption, setCaption] = useState("");

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setDate(new Date().toISOString().split("T")[0]);
    setCaption("");
  }

  function handleImageUpload(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      alert("Please choose an image smaller than 2.5MB.");
      return;
    }

    fileToDataUrl(file)
      .then((dataUrl) => {
        setImageUrl(dataUrl);
      })
      .catch(() => {
        alert("Could not read this image.");
      });
  }

  function handleCreateMemory(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const memory: Memory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      date,
      caption: caption.trim(),
      tags: [],
      createdAt: new Date().toISOString(),
    };

    addMemory(memory);
    setMemories(getMemories());
    resetForm();
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteMemory(id);
    setMemories(getMemories());

    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  }

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        {/* HEADER */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Visual Journal & Scrapbook
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Photo <span className="font-editorial-italic font-normal text-[#9E96D8]">Memories</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Capture snapshots, campus milestones, and little stories worth preserving.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Memory</span>
          </button>
        </header>

        {/* MEMORY COUNT CARD */}
        <section className="mb-6">
          <Card variant="pink" hoverEffect className="p-4.5 border-[#F2D8E4]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#D99BB8] shadow-2xs border border-white">
                <Camera size={18} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                  Memory Archive
                </p>
                <p className="text-xl font-bold text-[#17151C]">
                  {memories.length} <span className="text-xs font-normal text-[#5F5965]">snapshots saved</span>
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* EMPTY STATE */}
        {memories.length === 0 ? (
          <div className="space-y-5">
            <Card variant="lavender" className="p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#9E96D8] shadow-2xs border border-white">
                <Camera size={28} />
              </div>

              <h2 className="mt-4 font-serif text-2xl font-bold text-[#17151C]">
                No memories archived yet
              </h2>

              <p className="mx-auto mt-1 max-w-md text-xs font-normal leading-relaxed text-[#5F5965]">
                Save campus moments, study victories, coffee dates, and aesthetic photo journals from college life.
              </p>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
              >
                <Camera size={15} />
                <span>Upload First Memory</span>
              </button>
            </Card>

            <Card variant="pearl" className="p-5 border-[#E8E3F0]">
              <span className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5F5965]">
                <Sparkles size={14} className="text-[#9E96D8]" />
                Ideas for your digital scrapbook
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    ☕ Campus Coffee Spots
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Your favorite study drink or cozy library nook.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    💻 Project Sprints
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Snap a photo when shipping a build or coursework milestone.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8E3F0] bg-white p-3.5 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    🌷 Golden Hour Moments
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Scenic evening skies on the walk across campus.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4.5 sm:grid-cols-2 md:grid-cols-3">
            {memories.map((mem) => (
              <Card
                key={mem.id}
                variant="glass"
                hoverEffect
                className="group relative flex flex-col justify-between overflow-hidden p-3.5 border-[#E8E3F0] bg-white/95"
              >
                <div>
                  <div
                    className="relative h-52 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#EEEAFE] to-[#F8E8F0] border border-white/60"
                    onClick={() => setSelectedImage(mem)}
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <ImageIcon size={14} />
                        View Full
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-serif font-bold text-sm text-[#17151C]">
                        {mem.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() => handleDelete(mem.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#8D8792] transition hover:bg-[#FDF0F6] hover:text-[#D99BB8] cursor-pointer"
                        title="Delete memory"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="mt-0.5 text-[11px] font-medium text-[#8D8792]">
                      {mem.date}
                    </p>

                    {mem.caption && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#5F5965]">
                        {mem.caption}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* LIGHTBOX */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex select-none items-center justify-center bg-[#17151C]/60 p-4 backdrop-blur-md lumi-animate-fade-up"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-xl rounded-2xl md:rounded-3xl border border-[#E8E3F0] bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black cursor-pointer shadow-md"
                aria-label="Close image"
              >
                <X size={16} />
              </button>

              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="h-80 w-full rounded-xl object-cover shadow-inner"
              />

              <div className="mt-4 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#17151C]">
                    {selectedImage.title}
                  </h3>

                  <span className="text-xs font-semibold text-[#8D8792]">
                    {selectedImage.date}
                  </span>
                </div>

                {selectedImage.caption && (
                  <p className="mt-2 text-xs leading-relaxed text-[#5F5965]">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NEW MEMORY MODAL */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Capture a Memory"
          subtitle="Add photos and notes from your campus experience."
        >
          <form onSubmit={handleCreateMemory} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#17151C]">
                Memory Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Late night hackathon sprint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#17151C]">
                Memory Photo *
              </label>

              <div className="rounded-xl border border-dashed border-[#DDD8F2] bg-[#F7F5F8] p-4 text-center">
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Memory preview"
                      className="mx-auto h-48 w-full rounded-xl object-cover shadow-sm border border-white"
                    />

                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="mx-auto mt-3 block rounded-xl bg-white border border-[#E8E3F0] px-3.5 py-1.5 text-xs font-semibold text-[#D99BB8] shadow-2xs hover:bg-[#FDF0F6] cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center py-5 text-center">
                    <Camera size={26} className="text-[#9E96D8]" />
                    <span className="mt-2 text-xs font-semibold text-[#17151C]">
                      Upload Photo
                    </span>
                    <span className="mt-1 text-[11px] text-[#8D8792]">
                      PNG, JPG or WEBP · Max 2.5MB
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>

              <p className="mt-2 text-[11px] text-[#8D8792]">
                Or paste an image URL:
              </p>
              <input
                type="url"
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#17151C]">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#17151C]">
                  Caption / Moment Note
                </label>
                <textarea
                  rows={2}
                  placeholder="What made this moment special..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full resize-none rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
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
                disabled={!title.trim() || !imageUrl.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
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
