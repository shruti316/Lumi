import { useState, useEffect } from "react";

import {
  Camera,
  ImageIcon,
  Plus,
  Trash2,
  Lock,
  Users,
  MapPin,
  Filter,
  Loader2,
} from "lucide-react";

import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Memory {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  caption: string;
  location?: string;
  song?: string;
  visibility?: "private" | "friends" | "close_friends";
  isShared?: boolean;
  tags?: string[];
  createdAt?: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<
    "all" | "private" | "shared"
  >("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const [visibility, setVisibility] = useState<
    "private" | "friends" | "close_friends"
  >("private");

  async function fetchMemories() {
    setLoading(true);

    try {
      const { data, error } = await api.memories.getAll();

      if (error) {
        console.error("Get memories error:", error);
        setLoading(false);
        return;
      }

      if (data?.memories) {
        setMemories(
          data.memories.map((m: any) => ({
            ...m,
            imageUrl:
              m.imageUrl ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            visibility: m.isShared ? "friends" : "private",
            date:
              m.date || new Date().toISOString().split("T")[0],
          }))
        );
      }
    } catch (err) {
      console.error("Fetch memories exception:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMemories();

    const handleSync = () => {
      fetchMemories();
    };

    window.addEventListener("lumi-sync", handleSync);

    return () => {
      window.removeEventListener("lumi-sync", handleSync);
    };
  }, []);

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setDate(new Date().toISOString().split("T")[0]);
    setCaption("");
    setLocation("");
    setVisibility("private");
  }

  function handleImageUpload(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("Please choose a file smaller than 50MB.");
      return;
    }

    fileToDataUrl(file)
      .then((dataUrl) => {
        setImageUrl(dataUrl);
      })
      .catch(() => {
        alert("Could not process this image file. Please try a different image.");
      });
  }

  async function handleCreateMemory(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !imageUrl.trim()) {
      return;
    }

    const isShared =
      visibility === "friends" ||
      visibility === "close_friends";

    try {
      const { data, error } = await api.memories.create({
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        date,
        caption: caption.trim(),
        location: location.trim() || "",
        isShared,
      });

      // Backend/API returned an error
      if (error) {
        console.error("Memory save error:", error);

        alert(
          `Could not save memory: ${
            typeof error === "string"
              ? error
              : "The server rejected the request."
          }`
        );

        return;
      }

      // Request technically completed but no memory came back
      if (!data?.memory) {
        console.error("Memory save returned no memory:", data);

        alert(
          "Memory could not be saved. Please try again."
        );

        return;
      }

      // Successfully saved
      setMemories((prev) => [
        {
          ...data.memory,
          visibility,
          isShared,
          imageUrl:
            data.memory.imageUrl || imageUrl,
          date:
            data.memory.date || date,
        },
        ...prev,
      ]);

      window.dispatchEvent(
        new CustomEvent("lumi-sync", {
          detail: { type: "memory" },
        })
      );

      // Only clear the form after successful save
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error("Memory save exception:", err);

      alert(
        "Something went wrong while saving this memory. Please try again."
      );
    }
  }

  async function handleDelete(id: string) {
    setMemories((prev) =>
      prev.filter((m) => m.id !== id)
    );

    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }

    try {
      const { error } = await api.memories.delete(id);

      if (error) {
        console.error("Delete memory error:", error);
      }
    } catch (err) {
      console.error("Delete memory exception:", err);
    }

    window.dispatchEvent(
      new CustomEvent("lumi-sync", {
        detail: { type: "memory" },
      })
    );
  }

  const filteredMemories = memories.filter((mem) => {
    if (activeFilter === "private") {
      return (
        !mem.isShared &&
        (!mem.visibility ||
          mem.visibility === "private")
      );
    }

    if (activeFilter === "shared") {
      return (
        mem.isShared ||
        mem.visibility === "friends" ||
        mem.visibility === "close_friends"
      );
    }

    return true;
  });

  const privateCount = memories.filter(
    (m) =>
      !m.isShared &&
      (!m.visibility || m.visibility === "private")
  ).length;

  const sharedCount = memories.filter(
    (m) =>
      m.isShared ||
      m.visibility === "friends" ||
      m.visibility === "close_friends"
  ).length;

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">

        {/* HEADER */}

        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />

              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Visual Scrapbook & Vault
              </p>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Memory{" "}
              <span className="font-editorial-italic font-normal text-[#9E96D8]">
                Wall
              </span>
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

        {/* FILTER TABS */}

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
              <Filter
                size={13}
                className={
                  activeFilter === "all"
                    ? "text-[#9E96D8]"
                    : ""
                }
              />

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
              <Lock
                size={13}
                className={
                  activeFilter === "private"
                    ? "text-[#8D8792]"
                    : ""
                }
              />

              <span>Private Vault</span>

              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#5F5965] border border-[#DDD8F2]">
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
              <Users
                size={13}
                className={
                  activeFilter === "shared"
                    ? "text-[#9E96D8]"
                    : ""
                }
              />

              <span>Shared Feed</span>

              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#9E96D8] border border-[#DDD8F2]">
                {sharedCount}
              </span>
            </button>

          </div>
        </div>

        {/* MEMORIES */}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : filteredMemories.length === 0 ? (
          <Card
            variant="default"
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
              <Camera size={22} />
            </div>

            <h3 className="font-serif text-lg font-bold text-[#17151C]">
              No memories yet
            </h3>

            <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
              Take photos of little moments, sunsets, latte art, or study sessions and pin them to your scrapbook.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => setSelectedImage(mem)}
                className="group relative overflow-hidden rounded-2xl border border-[#E8E3F0] bg-white shadow-2xs transition duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F5F8]">

                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mem.id);
                    }}
                    className="absolute right-2.5 top-2.5 rounded-xl bg-white/90 p-1.5 text-[#8D8792] shadow-sm opacity-0 group-hover:opacity-100 hover:text-[#D84C2C] hover:bg-[#FDECE8] transition cursor-pointer"
                    title="Delete memory"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-[#17151C] line-clamp-1">
                      {mem.title}
                    </h3>

                    <span className="text-[10px] font-semibold text-[#8D8792]">
                      {mem.date}
                    </span>
                  </div>

                  {mem.caption && (
                    <p className="mt-1.5 text-xs text-[#5F5965] line-clamp-2 leading-relaxed">
                      {mem.caption}
                    </p>
                  )}

                  {mem.location && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-[#8D8792]">
                      <MapPin
                        size={12}
                        className="text-[#9E96D8]"
                      />

                      <span>{mem.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE MEMORY MODAL */}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Memory Snapshot"
          subtitle="Pin a photograph and reflection to your memory vault."
        >
          <form
            onSubmit={handleCreateMemory}
            className="space-y-4"
          >

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Memory Title *
              </label>

              <input
                type="text"
                autoFocus
                placeholder="e.g. Golden hour study session by the bay"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Image URL or Photo Upload *
              </label>

              <div className="space-y-2">

                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-[#F7F5F8] px-3 py-1.5 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer">
                    <ImageIcon size={13} />

                    <span>Upload local image</span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(
                          e.target.files?.[0]
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>

              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Location (optional)
                </label>

                <input
                  type="text"
                  placeholder="e.g. San Francisco Pier"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Caption & Story
              </label>

              <textarea
                placeholder="Write a little note about what happened on this day..."
                value={caption}
                onChange={(e) =>
                  setCaption(e.target.value)
                }
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            {/* Visibility */}

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                Visibility & Sharing
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("private")
                  }
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    visibility === "private"
                      ? "bg-[#FAF8FC] border-[#9E96D8] ring-1 ring-[#9E96D8]"
                      : "border-[#E8E3F0] bg-white hover:bg-[#FAF8FC]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#17151C]">
                    <Lock
                      size={12}
                      className="text-[#8D8792]"
                    />

                    <span>Private Vault</span>
                  </div>

                  <p className="text-[10px] text-[#8D8792] mt-0.5">
                    Only visible to you
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("friends")
                  }
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    visibility === "friends" ||
                    visibility === "close_friends"
                      ? "bg-[#FAF8FC] border-[#9E96D8] ring-1 ring-[#9E96D8]"
                      : "border-[#E8E3F0] bg-white hover:bg-[#FAF8FC]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#17151C]">
                    <Users
                      size={12}
                      className="text-[#9E96D8]"
                    />

                    <span>Friend Feed</span>
                  </div>

                  <p className="text-[10px] text-[#8D8792] mt-0.5">
                    Shared on community feed
                  </p>
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