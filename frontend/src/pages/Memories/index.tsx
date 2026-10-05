import { useState } from "react";
import {
  Camera,
  ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  X,
  Calendar,
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
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Visual Journal & Scrapbook
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Memory <span className="font-editorial-italic font-normal text-[#9E96D8]">Wall</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Capture snapshots, little victories, and moments worth keeping forever.
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

        {/* ═══════════════════════════════════════
            MEMORY WALL SCRAPBOOK VIEW
        ═══════════════════════════════════════ */}
        {memories.length === 0 ? (
          <div className="space-y-6">
            <Card variant="lavender" className="p-12 text-center border-[#DDD8F2]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#9E96D8] shadow-sm border border-white">
                <Camera size={28} />
              </div>

              <h2 className="mt-4 font-serif text-3xl font-bold text-[#17151C]">
                Your memories will live here.
              </h2>

              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm font-normal leading-relaxed text-[#5F5965]">
                Save the little moments worth keeping — campus sunsets, late-night study sessions, coffee dates, and milestones.
              </p>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#17151C] px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Memory</span>
              </button>
            </Card>

            <Card variant="pearl" className="p-6 border-[#E8E3F0]">
              <span className="mb-3.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F5965]">
                <Sparkles size={14} className="text-[#9E96D8]" />
                Inspiration for your digital scrapbook
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E8E3F0] bg-white p-4 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    ☕ Campus Coffee Spots
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Your favorite morning brew, cozy study nook, or cafe table.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3F0] bg-white p-4 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    💻 Milestone Builds
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Snap a photo when shipping a project or acing an exam.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3F0] bg-white p-4 shadow-2xs">
                  <p className="font-semibold text-xs text-[#17151C]">
                    🌷 Golden Hour Walks
                  </p>
                  <p className="mt-1 text-[11px] text-[#5F5965]">
                    Scenic skies on the walk across campus and quiet moments.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {memories.map((mem, idx) => {
              // Tasteful slight polaroid tilt variations
              const rotations = ["hover:rotate-0", "rotate-0.5 hover:rotate-0", "-rotate-0.5 hover:rotate-0"];
              const rotationClass = rotations[idx % rotations.length];

              return (
                <div
                  key={mem.id}
                  className={`break-inside-avoid rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(80,70,120,0.08)] border border-[#E8E3F0] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(80,70,120,0.14)] hover:scale-[1.01] ${rotationClass}`}
                >
                  {/* Image container */}
                  <div
                    className="relative w-full cursor-pointer overflow-hidden rounded-2xl bg-[#FAF8FC] border border-black/5 group"
                    onClick={() => setSelectedImage(mem)}
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full object-cover max-h-80 transition duration-500 group-hover:scale-103"
                    />

                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <ImageIcon size={14} />
                        View Full Photograph
                      </span>
                    </div>
                  </div>

                  {/* Caption & Metadata Footer */}
                  <div className="mt-3.5 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-[#17151C] leading-snug">
                        {mem.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() => handleDelete(mem.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#8D8792] transition hover:bg-[#FDF0F6] hover:text-[#D99BB8] cursor-pointer"
                        title="Delete memory"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#8D8792]">
                      <Calendar size={11} className="text-[#9E96D8]" />
                      <span>{mem.date}</span>
                    </div>

                    {mem.caption && (
                      <p className="mt-2 text-xs leading-relaxed text-[#5F5965] bg-[#FAF8FC] border border-[#E8E3F0] rounded-xl p-2.5">
                        “{mem.caption}”
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════
            FULL LIGHTBOX MODAL
        ═══════════════════════════════════════ */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex select-none items-center justify-center bg-[#17151C]/65 p-4 backdrop-blur-md lumi-animate-fade-up"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-xl rounded-3xl border border-[#E8E3F0] bg-white p-6 shadow-2xl"
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
                className="h-88 w-full rounded-2xl object-cover shadow-inner"
              />

              <div className="mt-4 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                    {selectedImage.title}
                  </h3>
                  <span className="text-xs text-[#8D8792] font-semibold bg-[#FAF8FC] border border-[#E8E3F0] px-2.5 py-1 rounded-full">
                    {selectedImage.date}
                  </span>
                </div>

                {selectedImage.caption && (
                  <p className="mt-2 text-xs leading-relaxed text-[#5F5965] bg-[#FAF8FC] p-3 rounded-xl border border-[#E8E3F0]">
                    “{selectedImage.caption}”
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            ADD MEMORY MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add a Photograph to Memory Wall"
          subtitle="Keep moments, campus life, and little stories safe in LUMI."
        >
          <form onSubmit={handleCreateMemory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Rainy Afternoon in the Library"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white p-2 text-xs font-medium text-[#5F5965] file:mr-3 file:rounded-lg file:border-0 file:bg-[#17151C] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white cursor-pointer shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Or Image URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            {imageUrl && (
              <div className="overflow-hidden rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-2">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
                  Preview
                </p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-44 w-full rounded-lg object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Story / Note / Caption
              </label>
              <textarea
                placeholder="Write a little note about what happened on this day..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
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
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save to Wall
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
