import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  BookOpen,
  Target,
  Music,
  Quote,
  Shield,
  Edit3,
  Calendar,
  CheckCircle2,
  Camera,
  Flame,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

interface UserProfileData {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  favoriteQuote: string;
  quoteAuthor: string;
  currentGoal: string;
  favoriteBook: string;
  favoriteSong: string;
  interests: string[];
  joinedDate: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  displayName: "Shru",
  username: "shru.lumi",
  bio: "Designing my best days with LUMI ✨ Computer science, calm aesthetics, late-night tea, and continuous learning.",
  favoriteQuote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
  quoteAuthor: "John C. Maxwell",
  currentGoal: "Master Full-Stack Systems & Finish 25 Books",
  favoriteBook: "Atomic Habits by James Clear",
  favoriteSong: "Kyoto — Phoebe Bridgers",
  interests: ["Design Systems", "Machine Learning", "Book Clubs", "Trail Running", "Matcha & Coffee"],
  joinedDate: "October 2025",
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem("lumi_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileData>(profile);
  const [newInterest, setNewInterest] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  // Live stats from live APIs
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    activeGoals: 0,
    habitsStreak: 0,
    booksRead: 0,
    memoriesSaved: 0,
  });

  useEffect(() => {
    async function loadStatsAndUser() {
      try {
        const [meRes, tasksRes, goalsRes, habitsRes, booksRes, memoriesRes] = await Promise.allSettled([
          api.auth.getMe(),
          api.tasks.getAll(),
          api.goals.getAll(),
          api.habits.getAll(),
          api.reading.getAll(),
          api.memories.getAll(),
        ]);

        if (meRes.status === "fulfilled" && meRes.value.data?.user) {
          const u = meRes.value.data.user;
          setProfile((prev) => {
            const updated = {
              ...prev,
              displayName: u.name || prev.displayName,
              username: u.email ? u.email.split("@")[0] : prev.username,
              bio: u.bio || prev.bio,
            };
            setEditForm(updated);
            return updated;
          });
        }

        let completedTasks = 0;
        if (tasksRes.status === "fulfilled" && tasksRes.value.data?.tasks) {
          completedTasks = tasksRes.value.data.tasks.filter((t: any) => t.completed).length;
        }

        let goalsCount = 0;
        if (goalsRes.status === "fulfilled" && goalsRes.value.data?.goals) {
          goalsCount = goalsRes.value.data.goals.length;
        }

        let maxStreak = 0;
        if (habitsRes.status === "fulfilled" && habitsRes.value.data?.habits) {
          maxStreak = habitsRes.value.data.habits.reduce(
            (max: number, h: any) => Math.max(max, h.streak || h.completedDates?.length || 0),
            0
          );
        }

        let readCount = 0;
        if (booksRes.status === "fulfilled" && booksRes.value.data?.books) {
          readCount = booksRes.value.data.books.filter((b: any) => b.status === "completed").length;
        }

        let memoriesCount = 0;
        if (memoriesRes.status === "fulfilled" && memoriesRes.value.data?.memories) {
          memoriesCount = memoriesRes.value.data.memories.length;
        }

        setStats({
          tasksCompleted: completedTasks,
          activeGoals: goalsCount,
          habitsStreak: maxStreak,
          booksRead: readCount,
          memoriesSaved: memoriesCount,
        });
      } catch (err) {
        console.error("Failed to load profile stats:", err);
      }
    }

    loadStatsAndUser();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = { ...profile, avatarUrl: dataUrl };
        setProfile(updated);
        setEditForm(updated);
        localStorage.setItem("lumi_profile", JSON.stringify(updated));
        localStorage.setItem("lumi_user_avatar", dataUrl);
        window.dispatchEvent(new CustomEvent("lumi-profile-change", { detail: updated }));
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveAvatar() {
    const updated = { ...profile, avatarUrl: undefined };
    setProfile(updated);
    setEditForm(updated);
    localStorage.setItem("lumi_profile", JSON.stringify(updated));
    localStorage.removeItem("lumi_user_avatar");
    window.dispatchEvent(new CustomEvent("lumi-profile-change", { detail: updated }));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem("lumi_profile", JSON.stringify(editForm));
    if (editForm.avatarUrl) {
      localStorage.setItem("lumi_user_avatar", editForm.avatarUrl);
    } else {
      localStorage.removeItem("lumi_user_avatar");
    }
    window.dispatchEvent(new CustomEvent("lumi-profile-change", { detail: editForm }));
    setShowEditModal(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);

    await api.auth.updateMe({
      name: editForm.displayName,
      bio: editForm.bio,
    });
  }

  function handleAddInterest() {
    if (!newInterest.trim()) return;
    if (!editForm.interests.includes(newInterest.trim())) {
      setEditForm((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
    }
    setNewInterest("");
  }

  function handleRemoveInterest(tag: string) {
    setEditForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== tag),
    }));
  }

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        
        {/* ═══════════════════════════════════════
            HEADER & HERO IDENTITY CARD
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Personal Identity & Life Persona
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Your <span className="font-editorial-italic font-normal text-[#9E96D8]">Profile</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Your LUMI identity used for connecting with friends and keeping track of your life journey.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditForm(profile);
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </header>

        {savedToast && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-[#EEF8F4] border border-[#CCE5DC] px-4 py-2 text-xs font-semibold text-[#3E7D5C] shadow-2xs lumi-animate-fade-up">
            <CheckCircle2 size={16} />
            <span>Profile successfully updated and synchronized!</span>
          </div>
        )}

        {/* ═══════════════════════════════════════
            MAIN PROFILE HERO CARD
        ═══════════════════════════════════════ */}
        <Card variant="pearl" className="p-6 md:p-8 mb-6 border-[#E8E3F0]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Avatar Circle with Upload & Camera Overlay */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#EEEAFE] via-[#F8E8F0] to-[#EEF3FA] border-2 border-white shadow-md text-3xl font-serif font-bold text-[#17151C] overflow-hidden cursor-pointer relative"
                  title="Click to upload profile photo"
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "S"}</span>
                  )}

                  {/* Camera overlay on hover */}
                  <div className="absolute inset-0 bg-[#17151C]/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Camera size={18} />
                    <span className="text-[9px] font-semibold mt-0.5">Change</span>
                  </div>
                </div>

                <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[#528D6F] border-2 border-white shadow-xs" title="Online & Active" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#17151C]">
                    {profile.displayName}
                  </h2>
                  <span className="rounded-full bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-0.5 text-xs font-bold text-[#6B5BA5]">
                    @{profile.username}
                  </span>
                </div>

                <p className="mt-2 text-xs md:text-sm text-[#5F5965] max-w-xl leading-relaxed">
                  {profile.bio}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#8D8792]">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={13} className="text-[#9E96D8]" />
                    Member since {profile.joinedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-[#5F5965]">
                    <Shield size={13} className="text-[#528D6F]" />
                    Private Vault Protected
                  </span>
                  {profile.avatarUrl && (
                    <>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-[11px] text-[#D99BB8] hover:underline cursor-pointer font-medium"
                      >
                        Remove custom photo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interests Pill Tags */}
          <div className="mt-6 pt-5 border-t border-[#E8E3F0] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D8792] mr-1">
              Interests:
            </span>
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] px-3 py-1 text-xs font-medium text-[#17151C] shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </Card>

        {/* ═══════════════════════════════════════
            METRICS & MILESTONES GRID
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="lavender" hoverEffect className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">Tasks Done</span>
              <CheckCircle2 size={16} className="text-[#9E96D8]" />
            </div>
            <p className="text-2xl font-bold text-[#17151C] mt-2">{stats.tasksCompleted}</p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">Completed items</p>
          </Card>

          <Card variant="pink" hoverEffect className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">Habit Streak</span>
              <Flame size={16} className="text-[#D99BB8]" />
            </div>
            <p className="text-2xl font-bold text-[#17151C] mt-2">{stats.habitsStreak} Days</p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">Top routine streak</p>
          </Card>

          <Card variant="blue" hoverEffect className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">Active Goals</span>
              <Target size={16} className="text-[#9E96D8]" />
            </div>
            <p className="text-2xl font-bold text-[#17151C] mt-2">{stats.activeGoals}</p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">Life aspirations</p>
          </Card>

          <Card variant="peach" hoverEffect className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">Memories</span>
              <Camera size={16} className="text-[#D99BB8]" />
            </div>
            <p className="text-2xl font-bold text-[#17151C] mt-2">{stats.memoriesSaved}</p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">Captured moments</p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            FAVORITES & CURATED INSPIRATIONS
        ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Daily Life OS Highlights */}
          <Card variant="glass" className="p-6 border-[#E8E3F0] space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-[#9E96D8]" />
              <h3 className="font-serif text-lg font-bold text-[#17151C]">
                Current Life Highlights
              </h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8D8792] uppercase">
                  <Target size={13} className="text-[#9E96D8]" />
                  <span>Current Priority Goal</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#17151C]">
                  {profile.currentGoal}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8D8792] uppercase">
                  <BookOpen size={13} className="text-[#E8B9CD]" />
                  <span>Currently Reading / Favorite</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#17151C]">
                  {profile.favoriteBook}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8D8792] uppercase">
                  <Music size={13} className="text-[#9E96D8]" />
                  <span>Current Soundtrack / Song</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#17151C]">
                  {profile.favoriteSong}
                </p>
              </div>
            </div>
          </Card>

          {/* Guiding Quote Card */}
          <Card variant="lavender" className="p-6 border-[#DDD8F2] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Quote size={18} className="text-[#9E96D8]" />
                <h3 className="font-serif text-lg font-bold text-[#17151C]">
                  Guiding Philosophy
                </h3>
              </div>
              <p className="font-serif italic text-base md:text-lg text-[#17151C] leading-relaxed">
                “{profile.favoriteQuote}”
              </p>
            </div>

            <p className="mt-4 text-xs font-bold text-[#5F5965] text-right">
              — {profile.quoteAuthor}
            </p>
          </Card>
        </div>

        {/* ═══════════════════════════════════════
            EDIT PROFILE MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Your LUMI Persona"
          subtitle="Customize how you appear in friends' circles and on your personal dashboard."
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, displayName: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  LUMI @username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8D8792]">
                    @
                  </span>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        username: e.target.value.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase(),
                      })
                    }
                    className="w-full rounded-xl border border-[#E8E3F0] bg-white py-2 pl-7 pr-3 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Personal Bio & Intention
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Current Goal
                </label>
                <input
                  type="text"
                  value={editForm.currentGoal}
                  onChange={(e) =>
                    setEditForm({ ...editForm, currentGoal: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Favorite / Current Book
                </label>
                <input
                  type="text"
                  value={editForm.favoriteBook}
                  onChange={(e) =>
                    setEditForm({ ...editForm, favoriteBook: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Favorite Soundtrack / Song
              </label>
              <input
                type="text"
                value={editForm.favoriteSong}
                onChange={(e) =>
                  setEditForm({ ...editForm, favoriteSong: e.target.value })
                }
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Guiding Quote
                </label>
                <input
                  type="text"
                  value={editForm.favoriteQuote}
                  onChange={(e) =>
                    setEditForm({ ...editForm, favoriteQuote: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Quote Author
                </label>
                <input
                  type="text"
                  value={editForm.quoteAuthor}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quoteAuthor: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Interest Tags Editor */}
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Interests & Focus Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add interest tag (e.g. Neuroscience, Piano)"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  className="flex-1 rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-1.5 text-xs font-semibold text-[#6B5BA5] hover:bg-[#E2DBFA] cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {editForm.interests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF8FC] border border-[#E8E3F0] px-2.5 py-1 text-xs text-[#17151C]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(tag)}
                      className="text-[#8D8792] hover:text-[#D99BB8] font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
              >
                Save Persona
              </button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}
