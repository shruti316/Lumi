import { useState } from "react";
import { Sparkles, Trash2, Heart, Zap, Compass } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getMoodCheckins,
  addMoodCheckin,
  deleteMoodCheckin,
  type MoodCheckin,
} from "../../lib/lifeOSStorage";

type MoodType = MoodCheckin["mood"];

interface MoodOption {
  type: MoodType;
  label: string;
  icon: string;
  cardVariant: "lavender" | "pink" | "blue" | "peach" | "pearl" | "mixed";
  description: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    type: "Serene",
    label: "Serene & Grounded",
    icon: "🕊️",
    cardVariant: "blue",
    description: "Peaceful clarity, balanced emotions, and steady calm.",
  },
  {
    type: "Inspired",
    label: "Inspired & Creative",
    icon: "✨",
    cardVariant: "lavender",
    description: "Deep flow state, imaginative ideas, and motivated momentum.",
  },
  {
    type: "Focused",
    label: "Focused & Driven",
    icon: "🎯",
    cardVariant: "mixed",
    description: "Clear objectives, disciplined attention, and high efficiency.",
  },
  {
    type: "Grateful",
    label: "Grateful & Warm",
    icon: "🌸",
    cardVariant: "pink",
    description: "Appreciative of life's subtle beauty, connections, and joy.",
  },
  {
    type: "Reflective",
    label: "Reflective & Still",
    icon: "🌙",
    cardVariant: "pearl",
    description: "Introspective mood, quiet observation, and internal alignment.",
  },
  {
    type: "Overwhelmed",
    label: "Tired / Resetting",
    icon: "🌧️",
    cardVariant: "peach",
    description: "Need for restorative rest, slower pacing, and gentle care.",
  },
];

const CONTEXT_TAGS = [
  "Deep Work Block",
  "Restorative Sleep",
  "Fresh Morning Air",
  "Warm Beverage",
  "Quality Social Time",
  "Movement & Workout",
  "Mindful Reading",
  "Creative Session",
  "Digital Downtime",
  "Nature Walk",
];

export default function Mood() {
  const [checkins, setCheckins] = useState<MoodCheckin[]>(() => getMoodCheckins());
  const [selectedMood, setSelectedMood] = useState<MoodType>("Serene");
  const [energy, setEnergy] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Morning Sun", "Gentle Pace"]);
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSaveCheckin(e: React.FormEvent) {
    e.preventDefault();

    const newCheckin: MoodCheckin = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      energy,
      tags: selectedTags,
      note: note.trim(),
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    addMoodCheckin(newCheckin);
    setCheckins(getMoodCheckins());
    setNote("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  function handleDelete(id: string) {
    deleteMoodCheckin(id);
    setCheckins(getMoodCheckins());
  }

  const latestCheckin = checkins[0];
  const avgEnergy =
    checkins.length > 0
      ? (checkins.reduce((acc, c) => acc + c.energy, 0) / checkins.length).toFixed(1)
      : "4.0";

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Emotional Sanctuary
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Mood & <span className="font-editorial-italic font-normal text-[#9E96D8]">Energy</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Track your emotional rhythm, mental vitality, and reflective thoughts.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#EEEAFE] border border-[#DDD8F2] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#6B5BA5]">
            <Heart size={14} className="text-[#D99BB8]" />
            <span>Harmonious Balance</span>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card variant="lavender" hoverEffect className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Current Resonance
              </p>
              <Sparkles size={15} className="text-[#9E96D8]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#17151C]">
              {latestCheckin ? latestCheckin.mood : "Balanced"}
            </p>
            <p className="mt-1 text-xs text-[#5F5965]">
              {latestCheckin ? `Recorded today` : "Ready for daily check-in"}
            </p>
          </Card>

          <Card variant="peach" hoverEffect className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Average Vitality
              </p>
              <Zap size={15} className="text-[#D99BB8]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#17151C]">
              {avgEnergy} <span className="text-sm font-sans font-normal text-[#5F5965]">/ 5.0</span>
            </p>
            <p className="mt-1 text-xs text-[#5F5965]">Optimal cognitive band</p>
          </Card>

          <Card variant="blue" hoverEffect className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Total Check-ins
              </p>
              <Compass size={15} className="text-[#B8D4E8]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#17151C]">
              {checkins.length}
            </p>
            <p className="mt-1 text-xs text-[#5F5965]">Reflections recorded</p>
          </Card>
        </div>

        {/* Interactive Check-In Panel */}
        <Card variant="glass" className="mb-10 p-6 md:p-8 border-[#E8E3F0] bg-white/95">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E3F0]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17151C]">
                Daily Check-In
              </h2>
              <p className="text-xs text-[#5F5965]">
                How are you feeling in this current moment?
              </p>
            </div>
            {showSuccess && (
              <span className="rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] px-3 py-1 text-xs font-semibold text-[#2E7D32] animate-fade-in">
                ✓ Check-in saved gracefully
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCheckin} className="space-y-6">
            {/* Mood Cards Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5965] mb-3">
                1. Select Dominant Mood
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = selectedMood === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedMood(item.type)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-center ${
                        isSelected
                          ? "border-[#9E96D8] ring-2 ring-[#B8B3E8]/40 bg-[#EEEAFE] shadow-sm scale-102"
                          : "border-[#E8E3F0] bg-white hover:border-[#DDD8F2] hover:bg-[#FDFBFE]"
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{item.icon}</span>
                      <span className="text-xs font-bold text-[#17151C]">{item.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F5965]">
                  2. Energy & Mental Vitality
                </label>
                <span className="text-xs font-bold text-[#9E96D8] bg-[#EEEAFE] px-2.5 py-0.5 rounded-md border border-[#DDD8F2]">
                  Level {energy} / 5
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergy(lvl)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                      energy === lvl
                        ? "bg-[#17151C] text-white border-[#17151C] shadow-2xs"
                        : "bg-white text-[#5F5965] border-[#E8E3F0] hover:bg-[#F7F5F8]"
                    }`}
                  >
                    {lvl === 1 && "1 • Low"}
                    {lvl === 2 && "2 • Calm"}
                    {lvl === 3 && "3 • Steady"}
                    {lvl === 4 && "4 • Vibrant"}
                    {lvl === 5 && "5 • Peak"}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5965] mb-2.5">
                3. What Contributed to this State?
              </label>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                        active
                          ? "bg-[#17151C] text-white border-[#17151C]"
                          : "bg-white text-[#5F5965] border-[#E8E3F0] hover:border-[#9E96D8]/50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5965] mb-2">
                4. Introspective Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What thoughts, sensations, or realizations are on your mind today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3.5 text-xs font-normal text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none resize-none shadow-2xs placeholder-[#8D8792]"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-[#17151C] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
              >
                Log Check-In
              </button>
            </div>
          </form>
        </Card>

        {/* Recent Mood History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl font-bold text-[#17151C]">
              Past Check-Ins & <span className="font-editorial-italic font-normal text-[#9E96D8]">Flow</span>
            </h3>
            <span className="text-xs text-[#8D8792]">
              {checkins.length} recorded entries
            </span>
          </div>

          {checkins.length === 0 ? (
            <Card variant="lavender" className="p-10 text-center">
              <p className="font-serif text-2xl font-bold text-[#17151C]">
                No check-ins recorded yet
              </p>
              <p className="mt-1 text-xs text-[#5F5965]">
                Log your first check-in above to track your emotional flow over time.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {checkins.map((entry) => {
                const opt = MOOD_OPTIONS.find((m) => m.type === entry.mood);
                const variant = opt?.cardVariant || "glass";

                return (
                  <Card
                    key={entry.id}
                    variant={variant}
                    hoverEffect
                    className="p-5 border-[#E8E3F0]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{opt?.icon || "🕊️"}</span>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#17151C]">
                            {entry.mood}
                          </h4>
                          <p className="text-[11px] text-[#8D8792]">
                            {entry.date} • Energy {entry.energy}/5
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-white/80 transition cursor-pointer"
                        title="Delete check-in"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {entry.note && (
                      <p className="mt-3 text-xs leading-relaxed text-[#5F5965] bg-white/70 border border-white/80 rounded-xl p-3">
                        "{entry.note}"
                      </p>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#5F5965] border border-[#DDD8F2]/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}