import { useState } from "react";
import {
  Camera,
  ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  X,
  Calendar,
  Lock,
  Users,
  Star,
  MapPin,
  Music,
  Filter,
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
  const [activeFilter, setActiveFilter] = useState<"all" | "private" | "shared">("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [song, setSong] = useState("");
  const [visibility, setVisibility] = useState<"private" | "friends" | "close_friends">("private");

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setDate(new Date().toISOString().split("T")[0]);
    setCaption("");
    setLocation("");
    setSong("");
    setVisibility("private");
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
      location: location.trim() || undefined,
      song: song.trim() || undefined,
      visibility,
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

  const filteredMemories = memories.filter((mem) => {
    if (activeFilter === "private") return !mem.visibility || mem.visibility === "private";
    if (activeFilter === "shared") return mem.visibility === "friends" || mem.visibility === "close_friends";
    return true;
  });

  const privateCount = memories.filter((m) => !m.visibility || m.visibility === "private").length;
  const sharedCount = memories.filter((m) => m.visibility === "friends" || m.visibility === "close_friends").length;

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
                Visual Scrapbook & Vault
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
            <span>+ Create Memory</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            FILTER TABS
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Filter size={13} className={activeFilter === "all" ? "text-[#9E96D8]" : ""} />
              <span>All Memories</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {memories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("private")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeFilter === "private"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Lock size={13} className={activeFilter === "private" ? "text-[#9E96D8]" : ""} />
              <span>Personal Vault</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {privateCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("shared")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeFilter === "shared"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Users size={13} className={activeFilter === "shared" ? "text-[#9E96D8]" : ""} />
              <span>Shared Moments</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {sharedCount}
              </span>
            </button>
          </div>

          <span className="text-xs text-[#8D8792] font-medium hidden sm:inline-block">
            Showing {filteredMemories.length} {filteredMemories.length === 1 ? "entry" : "entries"}
          </span>
        </div>

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
                <span>+ Create First Memory</span>
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
        ) : filteredMemories.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2]">
              <Filter size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#17151C]">No memories in this view</h3>
            <p className="mt-1 text-xs text-[#5F5965] max-w-sm mx-auto">
              {activeFilter === "private"
                ? "You don't have any private vault memories yet."
                : "You haven't shared any memories with friends yet."}
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                if (activeFilter === "shared") setVisibility("friends");
                setShowModal(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#17151C] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add a memory here</span>
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filteredMemories.map((mem, idx) => {
              const rotations = ["hover:rotate-0", "rotate-0.5 hover:rotate-0", "-rotate-0.5 hover:rotate-0"];
              const rotationClass = rotations[idx % rotations.length];

              const isShared = mem.visibility === "friends" || mem.visibility === "close_friends";

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

                    {/* Visibility badge overlay */}
                    <div className="absolute top-2.5 right-2.5">
                      {isShared ? (
                        <span className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2] shadow-sm">
                          <Users size={10} />
                          <span>Shared</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#5F5965] border border-[#E8E3F0] shadow-sm">
                          <Lock size={10} />
                          <span>Private</span>
                        </span>
                      )}
                    </div>

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

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#8D8792]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-[#9E96D8]" />
                        <span>{mem.date}</span>
                      </span>
                      {mem.location && (
                        <span className="flex items-center gap-1 text-[#5F5965]">
                          <MapPin size={11} className="text-[#E8B9CD]" />
                          <span>{mem.location}</span>
                        </span>
                      )}
                      {mem.song && (
                        <span className="flex items-center gap-1 text-[#6B5BA5]">
                          <Music size={11} className="text-[#9E96D8]" />
                          <span>{mem.song}</span>
                        </span>
                      )}
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
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                    {selectedImage.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8D8792] font-semibold bg-[#FAF8FC] border border-[#E8E3F0] px-2.5 py-1 rounded-full">
                      {selectedImage.date}
                    </span>
                    {selectedImage.visibility && (
                      <span className="text-xs text-[#6B5BA5] font-semibold bg-[#EEEAFE] border border-[#DDD8F2] px-2.5 py-1 rounded-full capitalize">
                        {selectedImage.visibility.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>

                {(selectedImage.location || selectedImage.song) && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#5F5965]">
                    {selectedImage.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#E8B9CD]" />
                        <span>{selectedImage.location}</span>
                      </span>
                    )}
                    {selectedImage.song && (
                      <span className="flex items-center gap-1">
                        <Music size={12} className="text-[#9E96D8]" />
                        <span>{selectedImage.song}</span>
                      </span>
                    )}
                  </div>
                )}

                {selectedImage.caption && (
                  <p className="mt-2.5 text-xs leading-relaxed text-[#5F5965] bg-[#FAF8FC] p-3 rounded-xl border border-[#E8E3F0]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  Location (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Central Library 3rd Floor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
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
                Soundtrack / Song Tag (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Kyoto - Phoebe Bridgers"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

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

            {/* Visibility Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                Visibility & Sharing
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    visibility === "private"
                      ? "bg-[#FAF8FC] border-[#9E96D8] ring-1 ring-[#9E96D8]"
                      : "border-[#E8E3F0] bg-white hover:bg-[#FAF8FC]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#17151C]">
                    <Lock size={12} className="text-[#8D8792]" />
                    <span>Private</span>
                  </div>
                  <p className="text-[10px] text-[#8D8792] mt-0.5">Only you</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("friends")}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    visibility === "friends"
                      ? "bg-[#FAF8FC] border-[#9E96D8] ring-1 ring-[#9E96D8]"
                      : "border-[#E8E3F0] bg-white hover:bg-[#FAF8FC]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#17151C]">
                    <Users size={12} className="text-[#9E96D8]" />
                    <span>Friends</span>
                  </div>
                  <p className="text-[10px] text-[#8D8792] mt-0.5">Shared feed</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("close_friends")}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    visibility === "close_friends"
                      ? "bg-[#FAF8FC] border-[#9E96D8] ring-1 ring-[#9E96D8]"
                      : "border-[#E8E3F0] bg-white hover:bg-[#FAF8FC]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#17151C]">
                    <Star size={12} className="text-[#E8B9CD]" />
                    <span>Close</span>
                  </div>
                  <p className="text-[10px] text-[#8D8792] mt-0.5">Favorites</p>
                </button>
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
