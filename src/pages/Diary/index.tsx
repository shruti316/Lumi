import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Heart,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  addDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntries,
  type DiaryEntry,
} from "../../lib/diaryStorage";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🥰", label: "Loved" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
];

const suggestedTags = [
  "college",
  "personal",
  "friends",
  "family",
  "memories",
  "growth",
];

function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() =>
    getDiaryEntries()
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("😊");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((item) => item !== tag)
        : [...currentTags, tag]
    );
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled entry",
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    };

    addDiaryEntry(newEntry);

    setEntries(getDiaryEntries());
    setTitle("");
    setContent("");
    setSelectedMood("😊");
    setSelectedTags([]);
    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    deleteDiaryEntry(id);
    setEntries(getDiaryEntries());
  };

  const filteredEntries = entries.filter((entry) => {
    const searchText = search.toLowerCase();

    return (
      entry.title.toLowerCase().includes(searchText) ||
      entry.content.toLowerCase().includes(searchText) ||
      entry.tags.some((tag) =>
        tag.toLowerCase().includes(searchText)
      )
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#fffafd] px-5 py-7 md:px-10 md:py-9">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#d895a9]">
              Your little corner of the world 🌷
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#3f3340] md:text-4xl">
              My Diary
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#8f7d88]">
              A quiet place to write down your days, thoughts, feelings,
              and little moments you want to remember.
            </p>
          </div>

          <button
            onClick={() => setShowEditor(true)}
            className="flex w-fit items-center gap-2 rounded-2xl bg-[#e879a9] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus size={18} />
            New Entry
          </button>
        </div>

        {/* Search */}
        <div className="mb-7 flex items-center gap-3 rounded-2xl border border-[#f0e3ea] bg-white px-4 py-3 shadow-sm">
          <Search size={19} className="text-[#a18f99]" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your diary..."
            className="w-full bg-transparent text-sm text-[#3f3340] outline-none placeholder:text-[#b5a6ae]"
          />
        </div>

        {/* Empty state */}
        {filteredEntries.length === 0 ? (
          <div className="rounded-[2rem] border border-[#f2e4eb] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff0f6]">
              <BookOpen size={28} className="text-[#e879a9]" />
            </div>

            <h2 className="text-xl font-extrabold text-[#3f3340]">
              {search
                ? "No entries found"
                : "Your diary is waiting for its first story ✨"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f7d88]">
              {search
                ? "Try searching for another word, tag, or thought."
                : "Write about your day, something you're grateful for, a random thought, or anything you want to remember."}
            </p>

            {!search && (
              <button
                onClick={() => setShowEditor(true)}
                className="mt-6 rounded-2xl bg-[#fff0f6] px-5 py-3 text-sm font-bold text-[#d95f92] transition hover:bg-[#ffe5f0]"
              >
                Write my first entry
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="group relative rounded-[2rem] border border-[#f2e4eb] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Delete */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute right-5 top-5 rounded-xl p-2 text-[#c7b9c0] opacity-0 transition hover:bg-[#fff0f4] hover:text-[#d66b91] group-hover:opacity-100"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>

                <div className="mb-4 flex items-center justify-between pr-10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#a18f99]">
                    <CalendarDays size={15} />
                    {formatDate(entry.createdAt)}
                  </div>

                  <span className="text-2xl">
                    {entry.mood}
                  </span>
                </div>

                <h2 className="mb-3 text-xl font-extrabold text-[#3f3340]">
                  {entry.title}
                </h2>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#756670]">
                  {entry.content}
                </p>

                {entry.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#fff3f7] px-3 py-1 text-xs font-semibold text-[#c76d90]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3f3340]/30 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">

            {/* Modal Header */}
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-[#d895a9]">
                  Take a little moment 🌷
                </p>

                <h2 className="text-2xl font-extrabold text-[#3f3340]">
                  New Diary Entry
                </h2>
              </div>

              <button
                onClick={() => setShowEditor(false)}
                className="rounded-xl p-2 text-[#a18f99] transition hover:bg-[#fff2f6] hover:text-[#d66b91]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <label className="mb-2 block text-sm font-bold text-[#4d3d48]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give today a little title..."
              className="mb-6 w-full rounded-2xl border border-[#eadde4] bg-[#fffafd] px-4 py-3 text-sm text-[#3f3340] outline-none transition focus:border-[#e7a2bd] focus:ring-2 focus:ring-[#fbe0ea]"
            />

            {/* Mood */}
            <label className="mb-3 block text-sm font-bold text-[#4d3d48]">
              How are you feeling?
            </label>

            <div className="mb-6 flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.emoji)}
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition ${
                    selectedMood === mood.emoji
                      ? "border-[#e9a3bd] bg-[#fff0f6] shadow-sm"
                      : "border-[#eee2e8] bg-white hover:bg-[#fff8fb]"
                  }`}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="font-semibold text-[#756670]">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Content */}
            <label className="mb-2 block text-sm font-bold text-[#4d3d48]">
              Your thoughts
            </label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write whatever is on your mind..."
              rows={8}
              className="mb-6 w-full resize-none rounded-2xl border border-[#eadde4] bg-[#fffafd] px-4 py-4 text-sm leading-7 text-[#3f3340] outline-none transition focus:border-[#e7a2bd] focus:ring-2 focus:ring-[#fbe0ea]"
            />

            {/* Tags */}
            <label className="mb-3 block text-sm font-bold text-[#4d3d48]">
              Add some tags
            </label>

            <div className="mb-7 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => {
                const selected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      selected
                        ? "border-[#e8a1bb] bg-[#fff0f6] text-[#c76d90]"
                        : "border-[#eee2e8] text-[#9b8992] hover:bg-[#fff8fb]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowEditor(false)}
                className="rounded-2xl px-5 py-3 text-sm font-bold text-[#8f7d88] transition hover:bg-[#faf3f7]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={!title.trim() && !content.trim()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#e879a9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#df6d9f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Heart size={17} />
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Diary;