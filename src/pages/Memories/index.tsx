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
  const [memories, setMemories] = useState<Memory[]>(
    () => getMemories()
  );

  const [showModal, setShowModal] = useState(false);

  const [selectedImage, setSelectedImage] =
    useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  function handleCreateMemory(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim() || !imageUrl.trim()) return;

    const memory: Memory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      date,
      caption: caption.trim(),
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
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">

        {/* HEADER */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#806C79]">
              Little moments worth keeping 📸
            </p>

            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              Memories
            </h1>

            <p className="font-caveat text-xl text-[#806C79]">
              Keep the moments, photos and little stories you never want
              to forget.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex w-fit items-center gap-2 rounded-2xl border border-[#BAB0C8] bg-[#DAD4DF] px-4 py-2.5 text-xs font-bold text-[#16131F] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#C1A0AC] active:scale-95"
          >
            <Plus size={16} />
            <span>Add Memory</span>
          </button>
        </header>

        {/* MEMORY COUNT */}
        <section className="mb-6">
          <Card className="!border-[#BAB0C8] !bg-[#F0D9E4] p-4 glow-pink">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
                <Camera
                  size={18}
                  className="text-[#806C79]"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
                  Your Memory Collection
                </p>

                <p className="text-xl font-extrabold text-[#16131F]">
                  {memories.length}
                </p>

                <p className="text-[10px] font-semibold text-[#806C79]">
                  little moments saved
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* EMPTY STATE */}
        {memories.length === 0 ? (
          <div className="space-y-5">
            <Card className="!border-[#DAD4DF] !bg-white/90 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0D9E4]">
                <Camera
                  size={28}
                  className="text-[#806C79]"
                />
              </div>

              <h2 className="mt-4 text-lg font-bold text-[#16131F]">
                No memories yet
              </h2>

              <p className="mx-auto mt-1 max-w-md text-xs font-medium leading-relaxed text-[#806C79]">
                Save little campus moments, study room victories, coffee
                dates, and aesthetic photo memories from college life.
              </p>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#312A44] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#211C2B]"
              >
                <Camera size={15} />
                <span>Upload First Memory</span>
              </button>
            </Card>

            <div className="rounded-2xl border border-[#DAD4DF] bg-white/70 p-4">
              <span className="mb-2.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#806C79]">
                <Sparkles size={14} />
                Ideas for your memory log
              </span>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">
                    ☕ Campus Coffee Spots
                  </p>

                  <p className="mt-1 text-[11px] text-[#806C79]">
                    Your favorite study beverage or cafe corner.
                  </p>
                </div>

                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">
                    💻 Project Sprints
                  </p>

                  <p className="mt-1 text-[11px] text-[#806C79]">
                    Snap a photo when shipping a build or lab project.
                  </p>
                </div>

                <div className="rounded-xl border border-[#DAD4DF] bg-white p-3">
                  <p className="font-bold text-[#16131F]">
                    🌷 Golden Hour on Campus
                  </p>

                  <p className="mt-1 text-[11px] text-[#806C79]">
                    Scenic views on the walk between lectures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {memories.map((mem) => (
              <Card
                key={mem.id}
                className="group relative flex flex-col justify-between overflow-hidden !border-[#DAD4DF] !bg-white/95 p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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

                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                        <ImageIcon size={12} />
                        View Full
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-xs font-bold text-[#16131F]">
                        {mem.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(mem.id)
                        }
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#806C79] transition hover:bg-rose-50 hover:text-rose-500"
                        title="Delete memory"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <p className="mt-0.5 text-[10px] font-semibold text-[#806C79]">
                      {mem.date}
                    </p>

                    {mem.caption && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#806C79]">
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
            className="fixed inset-0 z-50 flex select-none items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-xl rounded-3xl border border-[#DAD4DF] bg-[#F4F0EB] p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black"
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
                  <h3 className="text-base font-bold text-[#16131F]">
                    {selectedImage.title}
                  </h3>

                  <span className="text-[11px] font-bold text-[#806C79]">
                    {selectedImage.date}
                  </span>
                </div>

                {selectedImage.caption && (
                  <p className="mt-1.5 text-xs leading-relaxed text-[#806C79]">
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
          title="Capture a Memory 📸"
          subtitle="Add photos and stories from your campus life."
        >
          <form
            onSubmit={handleCreateMemory}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-bold text-[#16131F]">
                Memory Title *
              </label>

              <input
                type="text"
                autoFocus
                placeholder="e.g. Late night hackathon with team"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2.5 text-xs font-medium text-[#16131F] outline-none focus:border-[#806C79] focus:bg-white"
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="mb-1 block text-xs font-bold text-[#16131F]">
                Memory Photo *
              </label>

              <div className="rounded-xl border border-dashed border-[#C1A0AC] bg-[#F4F0EB] p-4">
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Memory preview"
                      className="mx-auto h-48 w-full rounded-xl object-cover shadow-md"
                    />

                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="mx-auto mt-3 block rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-rose-500 shadow-sm hover:bg-rose-50"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center py-5 text-center">
                    <Camera
                      size={28}
                      className="text-[#806C79]"
                    />

                    <span className="mt-2 text-xs font-bold text-[#312A44]">
                      Upload Photo
                    </span>

                    <span className="mt-1 text-[10px] text-[#806C79]">
                      PNG, JPG or WEBP · Max 2.5MB
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                )}
              </div>

              <p className="mt-2 text-[10px] text-[#806C79]">
                Or paste an image URL:
              </p>

              <input
                type="url"
                value={
                  imageUrl.startsWith("data:")
                    ? ""
                    : imageUrl
                }
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-[#D7C5D2] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F] outline-none focus:border-[#806C79]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#16131F]">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] outline-none focus:border-[#806C79] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#16131F]">
                  Caption / Moment Note
                </label>

                <textarea
                  rows={2}
                  placeholder="What made this moment special..."
                  value={caption}
                  onChange={(e) =>
                    setCaption(e.target.value)
                  }
                  className="w-full resize-none rounded-xl border border-[#D7C5D2] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] outline-none focus:border-[#806C79] focus:bg-white"
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
                disabled={
                  !title.trim() ||
                  !imageUrl.trim()
                }
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#211C2B] disabled:opacity-50"
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
