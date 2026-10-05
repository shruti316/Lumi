import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Cloud,
  Check,
  Sparkles,
  User,
  Bell,
  Palette,
  Shield,
  Clock,
  Smartphone,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getStoredTheme,
  applyTheme,
  type LumiTheme,
} from "../../lib/theme";

interface ThemeOption {
  id: LumiTheme;
  name: string;
  subtitle: string;
  description: string;
  icon: typeof Sun;
  bgClass: string;
  cardClass: string;
  accentColors: string[];
  isDefault?: boolean;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    subtitle: "Default LUMI Aura",
    description: "Luminous pastel atmosphere with airy surfaces, soft blush/lavender gradients, and crisp contrast.",
    icon: Sun,
    bgClass: "bg-[#F7F5F8]",
    cardClass: "bg-white border-[#E8E3F0]",
    accentColors: ["#B8B3E8", "#E8B9CD", "#B8D4E8", "#CCE5DC"],
    isDefault: true,
  },
  {
    id: "dark",
    name: "Dark",
    subtitle: "Midnight Glow",
    description: "Deep midnight aesthetic with rich dark cards, readable light text, and soft glowing pastel accents.",
    icon: Moon,
    bgClass: "bg-[#131118]",
    cardClass: "bg-[#1C1924] border-[#2F2A3D]",
    accentColors: ["#9E96D8", "#D99BB8", "#B8D4E8", "#A3E5D4"],
  },
  {
    id: "mist",
    name: "Mist / Stone",
    subtitle: "Warm Neutral Stone",
    description: "Soft warm gray and natural stone palette for calm, grounded, and elegant daily workflows.",
    icon: Cloud,
    bgClass: "bg-[#ECEAE5]",
    cardClass: "bg-[#F8F6F2] border-[#DDD8D0]",
    accentColors: ["#B8B3E8", "#D0C9C0", "#A8B4A5", "#D99BB8"],
  },
];

export default function Settings() {
  const [currentTheme, setCurrentTheme] = useState<LumiTheme>(() => getStoredTheme());
  const [activeTab, setActiveTab] = useState<"appearance" | "profile" | "notifications" | "data">("appearance");

  // Notification toggles (Foundation UI)
  const [notifyTasks, setNotifyTasks] = useState(true);
  const [notifyHabits, setNotifyHabits] = useState(true);
  const [notifyFriends, setNotifyFriends] = useState(true);
  const [notifyCalendar, setNotifyCalendar] = useState(false);

  // Profile preferences
  const [userName, setUserName] = useState("Shru");
  const [userBio, setUserBio] = useState("Designing my best days with LUMI ✨");
  const [is24Hour, setIs24Hour] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    function handleThemeChange(e: Event) {
      const customEvent = e as CustomEvent<{ theme: LumiTheme }>;
      if (customEvent.detail?.theme) {
        setCurrentTheme(customEvent.detail.theme);
      }
    }
    window.addEventListener("lumi-theme-change" as any, handleThemeChange);
    return () => {
      window.removeEventListener("lumi-theme-change" as any, handleThemeChange);
    };
  }, []);

  function handleSelectTheme(theme: LumiTheme) {
    setCurrentTheme(theme);
    applyTheme(theme);
    showToast();
  }

  function showToast() {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2400);
  }

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* HEADER */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8D8792] mb-1">
                <span>Preferences & System</span>
                <span>•</span>
                <span className="text-[#9E96D8] font-bold">LUMI Settings</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17151C]">
                Settings & Appearance
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#5F5965]">
                Customize your themes, profile aura, and notification preferences.
              </p>
            </div>

            {/* Saved Toast Pill */}
            {savedToast && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#EEEAFE] border border-[#DDD8F2] px-3.5 py-1.5 text-xs font-semibold text-[#17151C] shadow-2xs lumi-animate-fade-up">
                <Sparkles size={14} className="text-[#9E96D8]" />
                <span>Preferences saved!</span>
              </div>
            )}
          </div>

          {/* TAB BAR NAVIGATION */}
          <div className="mt-6 flex gap-2 border-b border-[#E8E3F0] pb-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "appearance"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Palette size={15} />
              <span>Appearance & Themes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "profile"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <User size={15} />
              <span>Profile & Persona</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "notifications"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Bell size={15} />
              <span>Notifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("data")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "data"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Shield size={15} />
              <span>Data & Storage</span>
            </button>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════
            TAB 1: APPEARANCE & THEMES
        ══════════════════════════════════════════════════════ */}
        {activeTab === "appearance" && (
          <div className="space-y-8 lumi-animate-fade-up">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#17151C]">
                    Color Theme
                  </h2>
                  <p className="text-xs text-[#5F5965]">
                    Select your preferred visual atmosphere. Saved automatically across sessions.
                  </p>
                </div>
                <span className="rounded-full bg-[#EEEAFE] px-3 py-1 text-[11px] font-bold text-[#17151C] border border-[#DDD8F2]">
                  Active: {currentTheme.toUpperCase()}
                </span>
              </div>

              {/* 3 THEME CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THEME_OPTIONS.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  const Icon = theme.icon;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`group relative flex flex-col justify-between rounded-3xl border p-5 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-[#17151C] ring-2 ring-[#17151C]/15 bg-white shadow-lg -translate-y-1"
                          : "border-[#E8E3F0] bg-white/80 hover:border-[#DDD8F2] hover:bg-white hover:shadow-md"
                      }`}
                    >
                      {/* Top Header inside card */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.bgClass} ${
                              theme.id === "dark" ? "text-white" : "text-[#17151C]"
                            } shadow-2xs border border-[#E8E3F0]`}
                          >
                            <Icon size={18} />
                          </div>
                          {isSelected ? (
                            <span className="flex items-center gap-1 rounded-full bg-[#17151C] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                              <Check size={12} strokeWidth={3} />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#8D8792] group-hover:text-[#17151C]">
                              Click to apply
                            </span>
                          )}
                        </div>

                        {/* Theme Name & Subtitle */}
                        <h3 className="font-serif text-lg font-bold text-[#17151C]">
                          {theme.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#9E96D8] mb-2">
                          {theme.subtitle}
                        </p>
                        <p className="text-xs text-[#5F5965] leading-relaxed mb-4">
                          {theme.description}
                        </p>
                      </div>

                      {/* Theme Mini Mockup / Color Swatches */}
                      <div className="pt-3 border-t border-[#E8E3F0]/60">
                        {/* Interactive UI Mock Mini Box */}
                        <div
                          className={`rounded-xl p-3 border ${theme.cardClass} shadow-2xs mb-3`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`h-2.5 w-16 rounded-full ${
                                theme.id === "dark" ? "bg-[#383348]" : "bg-[#E8E3F0]"
                              }`}
                            />
                            <div className="flex gap-1">
                              <span className="h-2 w-2 rounded-full bg-[#E8B9CD]" />
                              <span className="h-2 w-2 rounded-full bg-[#B8B3E8]" />
                            </div>
                          </div>
                          <div
                            className={`h-2 w-full rounded-full ${
                              theme.id === "dark" ? "bg-[#282436]" : "bg-[#FAF8FC]"
                            } mb-1.5`}
                          />
                          <div
                            className={`h-2 w-3/4 rounded-full ${
                              theme.id === "dark" ? "bg-[#282436]" : "bg-[#FAF8FC]"
                            }`}
                          />
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8D8792]">
                            Palette
                          </span>
                          <div className="flex items-center gap-1.5">
                            {theme.accentColors.map((color, idx) => (
                              <span
                                key={idx}
                                className="h-3 w-3 rounded-full shadow-2xs border border-white/50"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TYPOGRAPHY & DESIGN SYSTEM OVERVIEW */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EEEAFE] to-[#F8E8F0] border border-[#DDD8F2] text-[#17151C] text-lg font-serif">
                  ✧
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-[#17151C]">
                    LUMI Editorial Aesthetic Guidelines
                  </h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    LUMI pairs modern geometric sans-serif (<strong>Plus Jakarta Sans</strong>) with high-contrast editorial serifs (<strong>Playfair Display</strong>). Themes adaptively alter surface backgrounds and light absorption while maintaining consistent button geometry, shadows, and subtle glow ambiance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: PROFILE & PERSONA
        ══════════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <h2 className="font-serif text-lg font-bold text-[#17151C] mb-4">
                Personal Identity
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#DCD8F2] to-[#F2D8E4] border-2 border-white text-2xl font-serif font-bold text-[#17151C] shadow-md">
                  {userName ? userName.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold text-[#17151C]">
                    {userName}
                  </h3>
                  <p className="text-xs text-[#8D8792]">Personal Life OS Member</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EEEAFE] px-2.5 py-0.5 text-[10px] font-bold text-[#6B5BA5]">
                    ✨ LUMI Pro Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] outline-none transition focus:border-[#9E96D8] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="shru@lumi.app"
                    disabled
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC]/50 px-3.5 py-2.5 text-xs font-medium text-[#8D8792] cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Personal Motto / Bio
                  </label>
                  <input
                    type="text"
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] outline-none transition focus:border-[#9E96D8] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={showToast}
                  className="rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </Card>

            {/* TIME FORMAT & REGIONAL */}
            <Card className="p-6">
              <h3 className="font-serif text-base font-bold text-[#17151C] mb-4">
                Time & Calendar Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#9E96D8]" />
                    <div>
                      <p className="text-xs font-semibold text-[#17151C]">24-Hour Time Format</p>
                      <p className="text-[10px] text-[#8D8792]">Display 14:00 instead of 2:00 PM</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={is24Hour}
                    onChange={(e) => setIs24Hour(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#17151C]"
                  />
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: NOTIFICATIONS FOUNDATION
        ══════════════════════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Bell size={18} className="text-[#9E96D8]" />
                <h2 className="font-serif text-lg font-bold text-[#17151C]">
                  Notification Center
                </h2>
              </div>
              <p className="text-xs text-[#5F5965] mb-6">
                Manage proactive reminders for deadlines, habit streaks, and friends' shared moments.
              </p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer hover:bg-white transition">
                  <div>
                    <p className="text-xs font-semibold text-[#17151C]">
                      Task Reminders & Priority Alerts
                    </p>
                    <p className="text-[10px] text-[#8D8792]">
                      Notify me when important tasks are scheduled for today
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyTasks}
                    onChange={(e) => {
                      setNotifyTasks(e.target.checked);
                      showToast();
                    }}
                    className="h-4 w-4 rounded accent-[#17151C]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer hover:bg-white transition">
                  <div>
                    <p className="text-xs font-semibold text-[#17151C]">
                      Daily Habit Streak Reminders
                    </p>
                    <p className="text-[10px] text-[#8D8792]">
                      Evening prompt to keep daily routines and streaks alive
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyHabits}
                    onChange={(e) => {
                      setNotifyHabits(e.target.checked);
                      showToast();
                    }}
                    className="h-4 w-4 rounded accent-[#17151C]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer hover:bg-white transition">
                  <div>
                    <p className="text-xs font-semibold text-[#17151C]">
                      Friend Moments & Reactions
                    </p>
                    <p className="text-[10px] text-[#8D8792]">
                      Alert when friends share memories or react with ❤️
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyFriends}
                    onChange={(e) => {
                      setNotifyFriends(e.target.checked);
                      showToast();
                    }}
                    className="h-4 w-4 rounded accent-[#17151C]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer hover:bg-white transition">
                  <div>
                    <p className="text-xs font-semibold text-[#17151C]">
                      Calendar Event Alarms
                    </p>
                    <p className="text-[10px] text-[#8D8792]">
                      Receive a 15-minute head start before upcoming events
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyCalendar}
                    onChange={(e) => {
                      setNotifyCalendar(e.target.checked);
                      showToast();
                    }}
                    className="h-4 w-4 rounded accent-[#17151C]"
                  />
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4: DATA & STORAGE
        ══════════════════════════════════════════════════════ */}
        {activeTab === "data" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <h2 className="font-serif text-lg font-bold text-[#17151C] mb-2">
                Local Storage & Life Data
              </h2>
              <p className="text-xs text-[#5F5965] mb-6">
                Your tasks, habits, journals, notes, reading progress, and memories are safely managed in your browser's persistent storage.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const data: Record<string, any> = {};
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key && key.startsWith("lumi_")) {
                        data[key] = JSON.parse(localStorage.getItem(key) || "{}");
                      }
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `lumi-backup-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
                >
                  <span>Export All LUMI Data (.json)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset demo items and synchronize fresh state?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[#E8E3F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#D99BB8] hover:bg-[#FDF0F4] transition cursor-pointer"
                >
                  <span>Reset Demo State</span>
                </button>
              </div>
            </Card>

            {/* BACKEND READINESS NOTE */}
            <Card className="p-6 bg-gradient-to-br from-[#EEEAFE]/50 to-[#F8E8F0]/50">
              <div className="flex items-start gap-3">
                <Smartphone size={20} className="text-[#9E96D8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#17151C]">
                    Backend & Cloud Sync Ready
                  </h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    Frontend storage interfaces are normalized into modular schemas (`lumi_tasks`, `lumi_habits`, `lumi_reading`, `lumi_memories`, `lumi_goals`). In the upcoming backend phase, these will connect directly with persistent cloud APIs, real user authentication, Google Calendar, and Spotify OAuth.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
