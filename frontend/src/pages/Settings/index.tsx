import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Moon,
  Cloud,
  Check,
  Sparkles,
  User,
  Bell,
  Palette,
  Clock,
  Smartphone,
  Radio,
  Lock,
  HardDrive,
  Download,
  Trash2,
  ExternalLink,
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
    cardClass: "bg-[#F8F6F2] border-[#DDD8F0]",
    accentColors: ["#B8B3E8", "#D0C9C0", "#A8B4A5", "#D99BB8"],
  },
];

export default function Settings() {
  const [currentTheme, setCurrentTheme] = useState<LumiTheme>(() => getStoredTheme());
  const [activeTab, setActiveTab] = useState<
    "appearance" | "profile" | "notifications" | "privacy" | "data" | "integrations"
  >("appearance");

  // Notifications
  const [notifyTasks, setNotifyTasks] = useState(true);
  const [notifyHabits, setNotifyHabits] = useState(true);
  const [notifyFriends, setNotifyFriends] = useState(true);
  const [notifyCalendar, setNotifyCalendar] = useState(true);
  const [notifyMemories, setNotifyMemories] = useState(true);

  // Profile preferences
  const [userName, setUserName] = useState("Shru");
  const [userHandle, setUserHandle] = useState("shru.lumi");
  const [userBio, setUserBio] = useState("Designing my best days with LUMI ✨");
  const [userGoal, setUserGoal] = useState("Master Full-Stack Systems & Finish 25 Books");
  const [userBook, setUserBook] = useState("Atomic Habits by James Clear");
  const [userSong, setUserSong] = useState("Kyoto — Phoebe Bridgers");

  // Privacy controls
  const [profileVisibility, setProfileVisibility] = useState<"public" | "friends_only" | "private">("friends_only");
  const [friendRequestPermission, setFriendRequestPermission] = useState<"everyone" | "friends_of_friends" | "nobody">("everyone");
  const [defaultMemoryVisibility, setDefaultMemoryVisibility] = useState<"private" | "friends" | "close_friends">("private");
  const [shareGoalProgress, setShareGoalProgress] = useState(false);
  const [shareReadingStatus, setShareReadingStatus] = useState(true);

  // Integrations state (simulation)
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);

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
                <span className="text-[#9E96D8] font-bold">LUMI Control Center</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17151C]">
                Settings & Preferences
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#5F5965]">
                Configure appearance themes, personal identity, privacy guards, notifications, and integrations.
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

          {/* 6 TAB BAR NAVIGATION */}
          <div className="mt-6 flex gap-1.5 border-b border-[#E8E3F0] pb-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "appearance"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Palette size={14} />
              <span>Appearance & Themes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "profile"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <User size={14} />
              <span>Profile & Persona</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "notifications"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Bell size={14} />
              <span>Notifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "privacy"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Lock size={14} />
              <span>Privacy & Guard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("data")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "data"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <HardDrive size={14} />
              <span>Data & Storage</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("integrations")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === "integrations"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:bg-white hover:text-[#17151C]"
              }`}
            >
              <Radio size={14} />
              <span>Integrations</span>
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
                    Color Theme & Atmosphere
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
                    LUMI pairs modern geometric typography (<strong>Plus Jakarta Sans</strong>) with high-contrast editorial serifs (<strong>Playfair Display</strong>). Themes adaptively alter surface backgrounds and light absorption while maintaining consistent button geometry, shadows, and soft glow ambiance.
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-[#17151C]">
                  Personal Identity & Handle
                </h2>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-xs font-semibold text-[#6B5BA5] hover:underline"
                >
                  <span>View Public Profile Page</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#DCD8F2] to-[#F2D8E4] border-2 border-white text-2xl font-serif font-bold text-[#17151C] shadow-md">
                  {userName ? userName.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold text-[#17151C]">
                    {userName}
                  </h3>
                  <p className="text-xs text-[#8D8792]">@{userHandle}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EEEAFE] px-2.5 py-0.5 text-[10px] font-bold text-[#6B5BA5]">
                    ✨ LUMI Verified Identity
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
                    LUMI @username (for Friends search)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8D8792]">@</span>
                    <input
                      type="text"
                      value={userHandle}
                      onChange={(e) => setUserHandle(e.target.value.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase())}
                      className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] py-2.5 pl-7 pr-3 text-xs font-medium text-[#17151C] outline-none transition focus:border-[#9E96D8] focus:bg-white"
                    />
                  </div>
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Current Goal Spotlight
                  </label>
                  <input
                    type="text"
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] outline-none transition focus:border-[#9E96D8] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Favorite / Currently Reading Book
                  </label>
                  <input
                    type="text"
                    value={userBook}
                    onChange={(e) => setUserBook(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] outline-none transition focus:border-[#9E96D8] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F5965] mb-1.5">
                    Favorite Soundtrack / Song
                  </label>
                  <input
                    type="text"
                    value={userSong}
                    onChange={(e) => setUserSong(e.target.value)}
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
            TAB 3: NOTIFICATIONS
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
                Manage proactive reminders for deadlines, habit streaks, calendar alerts, and friends' shared moments.
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
                      Alert when friends share memories, cheers, or react with ❤️
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
                      Receive a 15-minute head start before scheduled calendar events
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

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer hover:bg-white transition">
                  <div>
                    <p className="text-xs font-semibold text-[#17151C]">
                      Memory On This Day Throwbacks
                    </p>
                    <p className="text-[10px] text-[#8D8792]">
                      Occasional gentle reminders of photographs captured on this date in the past
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyMemories}
                    onChange={(e) => {
                      setNotifyMemories(e.target.checked);
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
            TAB 4: PRIVACY & GUARD
        ══════════════════════════════════════════════════════ */}
        {activeTab === "privacy" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={18} className="text-[#9E96D8]" />
                <h2 className="font-serif text-lg font-bold text-[#17151C]">
                  Privacy & Personal Vault Security
                </h2>
              </div>
              <p className="text-xs text-[#5F5965] mb-6">
                LUMI is designed as a personal-first Sanctuary. Control exactly who can view your profile and moments.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                    Profile Visibility
                  </label>
                  <select
                    value={profileVisibility}
                    onChange={(e) => {
                      setProfileVisibility(e.target.value as any);
                      showToast();
                    }}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  >
                    <option value="friends_only">Friends Only (Only confirmed friends can view profile)</option>
                    <option value="public">Public to LUMI Circle (Visible via @username search)</option>
                    <option value="private">Ghost Mode (Hidden from search, invite-only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                    Who Can Send You Friend Requests
                  </label>
                  <select
                    value={friendRequestPermission}
                    onChange={(e) => {
                      setFriendRequestPermission(e.target.value as any);
                      showToast();
                    }}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  >
                    <option value="everyone">Everyone on LUMI</option>
                    <option value="friends_of_friends">Mutual Connections Only</option>
                    <option value="nobody">Direct Invitations Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                    Default Memory Creation Visibility
                  </label>
                  <select
                    value={defaultMemoryVisibility}
                    onChange={(e) => {
                      setDefaultMemoryVisibility(e.target.value as any);
                      showToast();
                    }}
                    className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  >
                    <option value="private">🔒 Private Vault (Default — never shared automatically)</option>
                    <option value="friends">👥 Shared with Friends Circle</option>
                    <option value="close_friends">⭐ Close Friends Only</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-[#E8E3F0] space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#17151C]">Share Active Goal on Profile</p>
                      <p className="text-[10px] text-[#8D8792]">Allow friends to see what you are currently striving for</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={shareGoalProgress}
                      onChange={(e) => {
                        setShareGoalProgress(e.target.checked);
                        showToast();
                      }}
                      className="h-4 w-4 rounded accent-[#17151C]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-[#17151C]">Share Currently Reading Books</p>
                      <p className="text-[10px] text-[#8D8792]">Display your current library selection to friends</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={shareReadingStatus}
                      onChange={(e) => {
                        setShareReadingStatus(e.target.checked);
                        showToast();
                      }}
                      className="h-4 w-4 rounded accent-[#17151C]"
                    />
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 5: DATA & STORAGE
        ══════════════════════════════════════════════════════ */}
        {activeTab === "data" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <h2 className="font-serif text-lg font-bold text-[#17151C] mb-2">
                Local Storage & Life Data Backup
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
                  <Download size={14} />
                  <span>Export All LUMI Data (.json)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset demo items and synchronize fresh state?")) {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[#E8E3F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#D99BB8] hover:bg-[#FDF0F4] transition cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Reset Demo State</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("lumi_token");
                    localStorage.removeItem("lumi_user");
                    sessionStorage.removeItem("lumi_token");
                    sessionStorage.removeItem("lumi_user");
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[#DDD8F2] bg-[#EEEAFE] px-4 py-2.5 text-xs font-semibold text-[#17151C] hover:bg-[#E5E0F8] transition cursor-pointer"
                >
                  <span>Sign Out of Device</span>
                </button>
              </div>
            </Card>

            {/* BACKEND READINESS NOTE */}
            <Card className="p-6 bg-gradient-to-br from-[#EEEAFE]/50 to-[#F8E8F0]/50">
              <div className="flex items-start gap-3">
                <Smartphone size={20} className="text-[#9E96D8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#17151C]">
                    Backend & MySQL Database Ready
                  </h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    Frontend storage interfaces are normalized into modular schemas (`lumi_tasks`, `lumi_habits`, `lumi_reading`, `lumi_memories`, `lumi_goals`). In the upcoming backend phase, these connect directly with persistent cloud APIs, MySQL models, JWT sessions, Google Calendar, and Spotify OAuth.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 6: INTEGRATIONS
        ══════════════════════════════════════════════════════ */}
        {activeTab === "integrations" && (
          <div className="space-y-6 lumi-animate-fade-up">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Radio size={18} className="text-[#9E96D8]" />
                <h2 className="font-serif text-lg font-bold text-[#17151C]">
                  Connected Integrations
                </h2>
              </div>
              <p className="text-xs text-[#5F5965] mb-6">
                Seamlessly connect external audio, calendar, and library APIs with your LUMI personal system.
              </p>

              <div className="space-y-4">
                {/* Spotify Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF8F4] text-[#1DB954] border border-[#CCE5DC]">
                      🎵
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#17151C]">Spotify Music & Focus Playlists</h4>
                      <p className="text-xs text-[#5F5965]">Sync currently playing track and lo-fi study playlists directly to your Dashboard.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSpotifyConnected(!spotifyConnected);
                      showToast();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      spotifyConnected
                        ? "bg-[#EEF8F4] text-[#3E7D5C] border border-[#CCE5DC]"
                        : "bg-[#17151C] text-white hover:bg-[#2D263B]"
                    }`}
                  >
                    {spotifyConnected ? "Connected ✓" : "Connect Spotify"}
                  </button>
                </div>

                {/* Google Calendar Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3FA] text-[#4285F4] border border-[#D9E7F2]">
                      📅
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#17151C]">Google Calendar</h4>
                      <p className="text-xs text-[#5F5965]">Two-way sync with campus classes, assignment schedules, and personal events.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGoogleCalendarConnected(!googleCalendarConnected);
                      showToast();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                      googleCalendarConnected
                        ? "bg-[#EEF8F4] text-[#3E7D5C] border border-[#CCE5DC]"
                        : "bg-[#17151C] text-white hover:bg-[#2D263B]"
                    }`}
                  >
                    {googleCalendarConnected ? "Connected ✓" : "Connect Calendar"}
                  </button>
                </div>

                {/* OpenLibrary / Book Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8E8F0] text-[#D99BB8] border border-[#F2D8E4]">
                      📚
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#17151C]">OpenLibrary & Book Metadata</h4>
                      <p className="text-xs text-[#5F5965]">Auto-fetch book covers, author details, and page counts when adding to Reading.</p>
                    </div>
                  </div>

                  <span className="rounded-xl bg-[#EEF8F4] border border-[#CCE5DC] px-3 py-1.5 text-xs font-semibold text-[#3E7D5C] shrink-0">
                    Active & Ready
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
