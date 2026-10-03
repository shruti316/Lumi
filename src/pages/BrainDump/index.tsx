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
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9a82c7] flex items-center gap-1.5">
            <Feather size={14} /> Messy Mindspace • Stream of Consciousness
          </p>
          <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#40364a] sm:text-5xl">
            Brain Dump 🧠
          </h1>
          <p className="font-caveat text-xl text-[#766d78]">
            Pour out whatever is cluttering your head. No formatting required, just raw thoughts.
          </p>
        </header>

        {/* ═══════════════════════════════════════
            MAIN WRITING SURFACE (Low friction)
        ═══════════════════════════════════════ */}
        <Card className="mb-7 !bg-gradient-to-br !from-[#eee9f8] !to-[#faf8f6] !border-[#dcd5ed] p-6 shadow-sm glow-lavender">
          <form onSubmit={handleSave} className="space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#7564af] flex items-center gap-1.5">
              <Sparkles size={13} /> What's on your mind right now?
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
              className="w-full rounded-2xl border border-[#dcd5ed] bg-white p-4 text-xs font-medium text-[#403842] leading-relaxed placeholder:text-[#918793] focus:border-[#9a82c7] outline-none shadow-2xs resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#766d78] hidden sm:inline">
                Press <kbd className="rounded bg-white/80 px-1 py-0.5 border border-[#efe8e1] font-mono">Ctrl</kbd> + <kbd className="rounded bg-white/80 px-1 py-0.5 border border-[#efe8e1] font-mono">Enter</kbd> to save
              </span>

              <button
                type="submit"
                disabled={!content.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-[#9a82c7] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#886eb9] active:scale-95 disabled:opacity-50 ml-auto"
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
          <div className="mb-4 relative">
            <Search size={14} className="absolute left-3.5 top-2.5 text-[#918793]" />
            <input
              type="text"
              placeholder="Search previous brain dumps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#efe8e1] bg-white pl-9 pr-4 py-2 text-xs font-medium text-[#403842] shadow-2xs outline-none focus:border-[#9a82c7]"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <Card className="!bg-[#eee9f8] !border-[#dcd5ed] p-7 text-center glow-lavender">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
              🧠
            </div>
            <h3 className="font-caveat text-2xl font-bold text-[#40364a]">
              Your brain is clear & uncluttered
            </h3>
            <p className="mt-1 text-xs max-w-sm mx-auto font-medium text-[#766d78]">
              Type your thoughts in the box above whenever mental tabs feel overwhelmed.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-[#766d78]">
              Chronological Thoughts Stream ({filtered.length})
            </div>
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="group relative flex items-start justify-between gap-4 rounded-2xl border border-[#efe8e1] bg-white/90 p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#dcd5ed]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#403842] whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                  <p className="mt-2 text-[10px] font-bold text-[#918793]">
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
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#918793] hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
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
