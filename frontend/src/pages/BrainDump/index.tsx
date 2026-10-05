import { useState } from "react";
import { Trash2, Search, Send, Sparkles, Feather } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getBrainDumpEntries,
  addBrainDumpEntry,
  deleteBrainDumpEntry,
  type BrainDumpEntry,
} from "../../lib/lifeOSStorage";

export default function BrainDump() {
  const [entries, setEntries] = useState<BrainDumpEntry[]>(() =>
    getBrainDumpEntries()
  );
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: BrainDumpEntry = {
      id: crypto.randomUUID(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    addBrainDumpEntry(newEntry);
    setEntries(getBrainDumpEntries());
    setContent("");
  }

  function handleDelete(id: string) {
    deleteBrainDumpEntry(id);
    setEntries(getBrainDumpEntries());
  }

  const filtered = entries.filter((e) =>
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8B3E8]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792] flex items-center gap-1.5">
              <Feather size={13} className="text-[#9E96D8]" /> Stream of Consciousness
            </p>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
            Brain <span className="font-editorial-italic font-normal text-[#9E96D8]">Dump</span>
          </h1>
          <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
            Pour out whatever is cluttering your mind. No formatting, just raw spontaneous thoughts.
          </p>
        </header>

        {/* ═══════════════════════════════════════
            MAIN WRITING SURFACE
        ═══════════════════════════════════════ */}
        <Card
          variant="lavender"
          hoverEffect
          className="mb-8 p-6 border-[#DCD8F2] shadow-sm"
        >
          <form onSubmit={handleSave} className="space-y-3.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F5965] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#9E96D8]" /> What's on your mind right now?
            </label>

            <textarea
              rows={4}
              autoFocus
              placeholder="Start typing without worrying about grammar or structure... random ideas, anxious thoughts, things you need to remember later..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSave(e);
                }
              }}
              className="w-full rounded-2xl border border-white/80 bg-white/90 p-4 text-xs font-medium text-[#17151C] leading-relaxed placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#5F5965] hidden sm:inline">
                Press <kbd className="rounded bg-white px-1.5 py-0.5 border border-[#E8E3F0] font-mono text-[10px]">Ctrl</kbd> + <kbd className="rounded bg-white px-1.5 py-0.5 border border-[#E8E3F0] font-mono text-[10px]">Enter</kbd> to save
              </span>

              <button
                type="submit"
                disabled={!content.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] active:scale-95 disabled:opacity-50 ml-auto cursor-pointer"
              >
                <Send size={13} />
                <span>Save Thought</span>
              </button>
            </div>
          </form>
        </Card>

        {/* ═══════════════════════════════════════
            SEARCH & CHRONOLOGICAL STREAM
        ═══════════════════════════════════════ */}
        {entries.length > 0 && (
          <div className="mb-5 relative">
            <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
            <input
              type="text"
              placeholder="Search previous thoughts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-4 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <Card variant="pearl" className="p-8 text-center border-[#E8E3F0]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#9E96D8] text-2xl shadow-2xs border border-[#E8E3F0]">
              🧠
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17151C]">
              Your mind is clear
            </h3>
            <p className="mt-1 text-xs max-w-sm mx-auto font-normal text-[#5F5965]">
              Type your thoughts in the box above whenever you feel overwhelmed or want to capture a quick idea.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <div className="px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
              Chronological Thoughts Stream ({filtered.length})
            </div>
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="group relative flex items-start justify-between gap-4 rounded-2xl border border-[#E8E3F0] bg-white/90 p-4.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#DDD8F2]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-normal text-[#17151C] whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                  <p className="mt-2.5 text-[11px] font-medium text-[#8D8792]">
                    {new Date(entry.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete thought"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
