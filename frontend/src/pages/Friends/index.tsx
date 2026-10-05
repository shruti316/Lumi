import { useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  UserPlus,
  Send,
  UserCheck,
  UserX,
  BookOpen,
  Target,
  Search,
  X,
  Smile,
  ShieldCheck,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

interface FriendProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  status: string;
  online: boolean;
  activeGoal: string;
  readingBook: string;
  mutualCount: number;
  sharedMomentsCount: number;
  joinedDate: string;
}

interface FriendRequest {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  mutualCount: number;
  timeAgo: string;
}

interface FriendMemory {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  title: string;
  caption: string;
  imageUrl: string;
  location?: string;
  timeAgo: string;
  likes: number;
  userLiked: boolean;
  reactions: Record<string, number>;
  userReaction?: string;
  comments: {
    id: string;
    author: string;
    text: string;
    time: string;
  }[];
}

const INITIAL_FRIEND_PROFILES: Record<string, FriendProfile> = {
  "u-1": {
    id: "u-1",
    name: "Aarav Patel",
    handle: "@aarav_codes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    bio: "Computer Science junior • Building neural nets and brewing espresso.",
    status: "Coding ML Project",
    online: true,
    activeGoal: "Train & deploy vision model before Hackathon",
    readingBook: "Deep Learning with Python",
    mutualCount: 7,
    sharedMomentsCount: 14,
    joinedDate: "Joined Sept 2025",
  },
  "u-2": {
    id: "u-2",
    name: "Meera Sen",
    handle: "@meera_design",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    bio: "Design student & watercolor painter. Exploring calm interfaces.",
    status: "Reading in library",
    online: true,
    activeGoal: "Publish 5 UI interaction prototypes",
    readingBook: "The Design of Everyday Things",
    mutualCount: 12,
    sharedMomentsCount: 21,
    joinedDate: "Joined Oct 2025",
  },
  "u-3": {
    id: "u-3",
    name: "Rohan Verma",
    handle: "@rohan_dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    bio: "Full stack enthusiast, trail runner, and tea enthusiast.",
    status: "Out on trail",
    online: false,
    activeGoal: "Run half marathon in November",
    readingBook: "Atomic Habits",
    mutualCount: 4,
    sharedMomentsCount: 9,
    joinedDate: "Joined Aug 2025",
  },
  "u-4": {
    id: "u-4",
    name: "Isha Roy",
    handle: "@isha_reads",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
    bio: "Literature & Neuroscience major. Slow mornings, matcha & notebooks.",
    status: "Study sprint",
    online: true,
    activeGoal: "Read 25 books this academic term",
    readingBook: "Thinking, Fast and Slow",
    mutualCount: 9,
    sharedMomentsCount: 18,
    joinedDate: "Joined Nov 2025",
  },
};

const INITIAL_FRIEND_MEMORIES: FriendMemory[] = [
  {
    id: "fm-1",
    authorId: "u-1",
    authorName: "Aarav Patel",
    authorHandle: "@aarav_codes",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    title: "Late night lab sprint & coffee",
    caption: "Finally got the machine learning model compiling at 2 AM. Coffee was the MVP today ☕✨",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    location: "Campus Science Center",
    timeAgo: "2h ago",
    likes: 14,
    userLiked: false,
    reactions: { "❤️": 8, "🔥": 4, "✨": 2 },
    comments: [
      { id: "c-1", author: "Shru", text: "Proud of you! The loss curve looked amazing.", time: "1h ago" },
      { id: "c-2", author: "Meera", text: "Need that coffee recommendation ASAP ☕", time: "45m ago" },
    ],
  },
  {
    id: "fm-2",
    authorId: "u-2",
    authorName: "Meera Sen",
    authorHandle: "@meera_design",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    title: "Autumn golden hour on the quad",
    caption: "The campus trees are turning golden. Perfect crisp air for a design sketchbook walk.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    location: "Main Quadrangle",
    timeAgo: "5h ago",
    likes: 22,
    userLiked: true,
    reactions: { "❤️": 15, "✨": 7 },
    comments: [
      { id: "c-3", author: "Rohan", text: "Such stunning light! 🍂", time: "3h ago" },
    ],
  },
  {
    id: "fm-3",
    authorId: "u-3",
    authorName: "Rohan Verma",
    authorHandle: "@rohan_dev",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    title: "Weekend mountain trail reset",
    caption: "Took a break from algorithms to hike the ridge. Clear minds make better code.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    location: "Summit Ridge Trail",
    timeAgo: "1d ago",
    likes: 19,
    userLiked: false,
    reactions: { "🔥": 11, "❤️": 8 },
    comments: [],
  },
  {
    id: "fm-4",
    authorId: "u-4",
    authorName: "Isha Roy",
    authorHandle: "@isha_reads",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
    title: "Cozy library nook & matcha",
    caption: "Finished chapter 12 of Atomic Habits. Creating systems instead of chasing distant goals.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    location: "Central Library 3rd Floor",
    timeAgo: "2d ago",
    likes: 27,
    userLiked: true,
    reactions: { "✨": 18, "❤️": 9 },
    comments: [
      { id: "c-4", author: "Shru", text: "Best chapter in the whole book!", time: "1d ago" },
    ],
  },
];

const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: "req-1",
    name: "Kavya Nair",
    handle: "@kavya_nair",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    bio: "Architecture student • Drawing perspectives & drinking chai.",
    mutualCount: 3,
    timeAgo: "1d ago",
  },
  {
    id: "req-2",
    name: "Dev Sharma",
    handle: "@dev_sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    bio: "Bioinformatics researcher. Curious about genomics and robotics.",
    mutualCount: 5,
    timeAgo: "3d ago",
  },
];

export default function Friends() {
  const [friends, setFriends] = useState<Record<string, FriendProfile>>(INITIAL_FRIEND_PROFILES);
  const [memories, setMemories] = useState<FriendMemory[]>(INITIAL_FRIEND_MEMORIES);
  const [requests, setRequests] = useState<FriendRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "requests">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendHandle, setNewFriendHandle] = useState("");
  const [addedFriendToast, setAddedFriendToast] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<FriendProfile | null>(null);
  const [cheeredToast, setCheeredToast] = useState(false);

  const friendsList = Object.values(friends);

  function handleToggleLike(id: string) {
    setMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === id) {
          const newLiked = !mem.userLiked;
          return {
            ...mem,
            userLiked: newLiked,
            likes: newLiked ? mem.likes + 1 : mem.likes - 1,
          };
        }
        return mem;
      })
    );
  }

  function handleAddReaction(id: string, emoji: string) {
    setMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === id) {
          const currentCount = mem.reactions[emoji] || 0;
          return {
            ...mem,
            reactions: {
              ...mem.reactions,
              [emoji]: currentCount + 1,
            },
            userReaction: emoji,
          };
        }
        return mem;
      })
    );
  }

  function handleAddComment(memId: string, e: React.FormEvent) {
    e.preventDefault();
    const text = commentInput[memId]?.trim();
    if (!text) return;

    setMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === memId) {
          return {
            ...mem,
            comments: [
              ...mem.comments,
              {
                id: crypto.randomUUID(),
                author: "Shru",
                text,
                time: "Just now",
              },
            ],
          };
        }
        return mem;
      })
    );

    setCommentInput((prev) => ({ ...prev, [memId]: "" }));
  }

  function handleAddFriend(e: React.FormEvent) {
    e.preventDefault();
    if (!newFriendHandle.trim()) return;

    setAddedFriendToast(true);
    setTimeout(() => {
      setAddedFriendToast(false);
      setNewFriendHandle("");
      setShowAddFriendModal(false);
    }, 1000);
  }

  function handleAcceptRequest(req: FriendRequest) {
    const newProfile: FriendProfile = {
      id: req.id,
      name: req.name,
      handle: req.handle,
      avatar: req.avatar,
      bio: req.bio,
      status: "Recently connected",
      online: true,
      activeGoal: "Setting up LUMI Life OS",
      readingBook: "Quiet: The Power of Introverts",
      mutualCount: req.mutualCount,
      sharedMomentsCount: 0,
      joinedDate: "Joined recently",
    };

    setFriends((prev) => ({ ...prev, [req.id]: newProfile }));
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  function handleDeclineRequest(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSendCheer() {
    setCheeredToast(true);
    setTimeout(() => setCheeredToast(false), 2000);
  }

  const filteredMemories = memories.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = friendsList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B9CD]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Lightweight Social Layer • Inspired by Waffle
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Friends & <span className="font-editorial-italic font-normal text-[#9E96D8]">Moments</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              LUMI is personal first. Share moments selectively with friends you care about.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddFriendModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Add Friend</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            SEARCH & VIEW SELECTOR TABS
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "feed"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Sparkles size={15} className={activeTab === "feed" ? "text-[#9E96D8]" : ""} />
              <span>Shared Moments Feed</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {memories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "friends"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <Users size={15} className={activeTab === "friends" ? "text-[#9E96D8]" : ""} />
              <span>Friends Circle</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {friendsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "requests"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <UserPlus size={15} className={activeTab === "requests" ? "text-[#9E96D8]" : ""} />
              <span>Requests</span>
              {requests.length > 0 && (
                <span className="rounded-full bg-[#E8B9CD] px-2 py-0.5 text-[10px] font-bold text-[#6B2848] border border-[#DC9EB7]">
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D8792]" />
            <input
              type="text"
              placeholder="Search feed & friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#17151C] placeholder-[#8D8792] focus:border-[#9E96D8] outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* =========================================================
            FEED VIEW
        ========================================================= */}
        {activeTab === "feed" && (
          <div>
            {filteredMemories.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2]">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#17151C]">No moments found</h3>
                <p className="mt-1 text-xs text-[#5F5965]">
                  {searchQuery ? "No moments match your search query." : "When friends share moments, they will appear right here."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredMemories.map((mem) => (
                  <Card
                    key={mem.id}
                    variant="glass"
                    hoverEffect
                    className="overflow-hidden border-[#E8E3F0] bg-white/95 p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Author Header */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer group"
                          onClick={() => {
                            const p = friends[mem.authorId] || {
                              id: mem.authorId,
                              name: mem.authorName,
                              handle: mem.authorHandle,
                              avatar: mem.authorAvatar,
                              bio: "LUMI Life OS User",
                              status: "Sharing moments",
                              online: true,
                              activeGoal: "Staying mindful & productive",
                              readingBook: "Atomic Habits",
                              mutualCount: 4,
                              sharedMomentsCount: 8,
                              joinedDate: "Joined 2025",
                            };
                            setSelectedProfile(p);
                          }}
                        >
                          <img
                            src={mem.authorAvatar}
                            alt={mem.authorName}
                            className="h-10 w-10 rounded-full object-cover border border-[#DDD8F2] shadow-2xs group-hover:scale-105 transition"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17151C] flex items-center gap-1.5 group-hover:text-[#6B5BA5] transition">
                              <span>{mem.authorName}</span>
                              <span className="text-[10px] font-normal text-[#8D8792]">{mem.authorHandle}</span>
                            </p>
                            <p className="text-[10px] font-medium text-[#8D8792]">
                              {mem.timeAgo} {mem.location && `• 📍 ${mem.location}`}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-[#FAF8FC] border border-[#E8E3F0] px-2.5 py-1 text-[10px] font-semibold text-[#8D8792]">
                          Shared Moment
                        </span>
                      </div>

                      {/* Photo with rounded card container */}
                      <div className="relative overflow-hidden rounded-2xl bg-[#FAF8FC] border border-black/5 mb-3.5">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="h-56 w-full object-cover transition-transform duration-300 hover:scale-103"
                        />
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#17151C] leading-snug">
                        {mem.title}
                      </h3>

                      <p className="mt-1.5 text-xs text-[#5F5965] leading-relaxed">
                        {mem.caption}
                      </p>
                    </div>

                    {/* Reactions & Comments Footer */}
                    <div className="mt-4 pt-3 border-t border-[#E8E3F0]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleLike(mem.id)}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                              mem.userLiked
                                ? "bg-[#FDF0F6] text-[#9A4E70] border border-[#F2D8E4]"
                                : "bg-[#FAF8FC] text-[#5F5965] border border-[#E8E3F0] hover:bg-white"
                            }`}
                          >
                            <Heart size={14} className={mem.userLiked ? "fill-[#D99BB8]" : ""} />
                            <span>{mem.likes}</span>
                          </button>

                          {["❤️", "✨", "🔥"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleAddReaction(mem.id, emoji)}
                              className="flex h-8 items-center gap-1 rounded-xl bg-[#FAF8FC] px-2 text-xs border border-[#E8E3F0] hover:bg-white transition cursor-pointer"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] font-bold text-[#8D8792]">
                                {mem.reactions[emoji] || 0}
                              </span>
                            </button>
                          ))}
                        </div>

                        <span className="text-[11px] font-medium text-[#8D8792] flex items-center gap-1">
                          <MessageCircle size={13} />
                          <span>{mem.comments.length}</span>
                        </span>
                      </div>

                      {/* Comments Preview */}
                      {mem.comments.length > 0 && (
                        <div className="space-y-1.5 mb-3 rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] p-2.5 text-xs">
                          {mem.comments.map((c) => (
                            <p key={c.id} className="text-[11px] leading-relaxed">
                              <strong className="text-[#17151C] font-semibold">{c.author}:</strong>{" "}
                              <span className="text-[#5F5965]">{c.text}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Form */}
                      <form
                        onSubmit={(e) => handleAddComment(mem.id, e)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Add a kind thought..."
                          value={commentInput[mem.id] || ""}
                          onChange={(e) =>
                            setCommentInput({
                              ...commentInput,
                              [mem.id]: e.target.value,
                            })
                          }
                          className="flex-1 rounded-xl border border-[#E8E3F0] bg-white px-3 py-1.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={!commentInput[mem.id]?.trim()}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#17151C] text-white hover:bg-[#2D263B] disabled:opacity-40 transition cursor-pointer"
                        >
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            FRIENDS LIST VIEW
        ========================================================= */}
        {activeTab === "friends" && (
          <div>
            {filteredFriends.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2]">
                  <Users size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#17151C]">No friends match your search</h3>
                <p className="mt-1 text-xs text-[#5F5965]">
                  Try searching for another name or handle, or invite friends to your LUMI circle.
                </p>
              </div>
            ) : (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {filteredFriends.map((friend) => (
                  <Card
                    key={friend.handle}
                    variant="glass"
                    hoverEffect
                    onClick={() => setSelectedProfile(friend)}
                    className="p-4 border-[#E8E3F0] bg-white/95 flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-11 w-11 rounded-full object-cover border border-[#DDD8F2] group-hover:scale-105 transition"
                        />
                        {friend.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#528D6F] border-2 border-white" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#17151C] group-hover:text-[#6B5BA5] transition">
                          {friend.name}
                        </h3>
                        <p className="text-[11px] font-medium text-[#8D8792]">
                          {friend.handle}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#5F5965] flex items-center gap-1 font-medium">
                          <Sparkles size={10} className="text-[#9E96D8]" /> {friend.status}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-1 text-[11px] font-semibold text-[#6B5BA5]">
                        View Profile
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            REQUESTS TAB VIEW
        ========================================================= */}
        {activeTab === "requests" && (
          <div>
            {requests.length === 0 ? (
              <Card variant="pearl" className="p-12 text-center border-[#E8E3F0]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF8F4] text-[#3E7D5C] text-xl border border-[#CCE5DC]">
                  ✓
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#17151C]">All caught up!</h3>
                <p className="mt-1 text-xs text-[#5F5965] max-w-sm mx-auto">
                  You have no pending friend requests right now. Connect with classmates or friends using the button below.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddFriendModal(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Invite Friends</span>
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <Card
                    key={req.id}
                    variant="glass"
                    className="p-4 border-[#E8E3F0] bg-white/95 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="h-12 w-12 rounded-full object-cover border border-[#DDD8F2]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-sm text-[#17151C]">{req.name}</h3>
                          <span className="text-[11px] text-[#8D8792] font-medium">{req.handle}</span>
                        </div>
                        <p className="text-xs text-[#5F5965] mt-0.5">{req.bio}</p>
                        <p className="text-[10px] text-[#8D8792] mt-1 font-medium">
                          {req.mutualCount} mutual friends • {req.timeAgo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#17151C] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] transition cursor-pointer"
                      >
                        <UserCheck size={14} />
                        <span>Accept</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-1.5 text-xs font-semibold text-[#5F5965] hover:bg-white hover:text-[#9A4E70] transition cursor-pointer"
                      >
                        <UserX size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════
            FRIEND PROFILE PREVIEW MODAL
        ═══════════════════════════════════════ */}
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex select-none items-center justify-center bg-[#17151C]/65 p-4 backdrop-blur-md lumi-animate-fade-up"
            onClick={() => setSelectedProfile(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl border border-[#E8E3F0] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8FC] text-[#5F5965] hover:bg-[#EEEAFE] transition cursor-pointer shadow-xs border border-[#E8E3F0]"
                aria-label="Close profile"
              >
                <X size={16} />
              </button>

              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-[#DDD8F2] shadow-sm"
                  />
                  {selectedProfile.online && (
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[#528D6F] border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 pr-6">
                  <h2 className="font-serif text-2xl font-bold text-[#17151C]">
                    {selectedProfile.name}
                  </h2>
                  <p className="text-xs font-semibold text-[#8D8792]">
                    {selectedProfile.handle} • <span className="font-normal">{selectedProfile.joinedDate}</span>
                  </p>
                  <p className="mt-2 text-xs text-[#5F5965] leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="mt-4 rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#9E96D8]" />
                  <span className="text-xs font-semibold text-[#17151C]">Current Focus:</span>
                  <span className="text-xs text-[#5F5965]">{selectedProfile.status}</span>
                </div>
                <span className="text-[10px] font-bold text-[#528D6F] bg-[#EEF8F4] border border-[#CCE5DC] px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              {/* Life OS Highlights */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-[#E8E3F0] bg-white p-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8D8792] uppercase">
                    <Target size={13} className="text-[#9E96D8]" />
                    <span>Active Goal</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-[#17151C]">
                    {selectedProfile.activeGoal}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3F0] bg-white p-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8D8792] uppercase">
                    <BookOpen size={13} className="text-[#E8B9CD]" />
                    <span>Reading Now</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-[#17151C]">
                    {selectedProfile.readingBook}
                  </p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 pt-3 border-t border-[#E8E3F0] flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#8D8792]">
                  <span>
                    <strong className="text-[#17151C]">{selectedProfile.sharedMomentsCount}</strong> moments
                  </span>
                  <span>
                    <strong className="text-[#17151C]">{selectedProfile.mutualCount}</strong> mutual friends
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendCheer}
                    className="flex items-center gap-1.5 rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-1.5 text-xs font-semibold text-[#6B5BA5] hover:bg-[#E2DBFA] transition cursor-pointer"
                  >
                    <Smile size={14} />
                    <span>Send Cheer ✨</span>
                  </button>
                </div>
              </div>

              {cheeredToast && (
                <div className="mt-3 rounded-xl bg-[#EEF8F4] border border-[#CCE5DC] p-2 text-center text-xs font-semibold text-[#3E7D5C] lumi-animate-fade-up">
                  ✨ Sent encouragement cheer to {selectedProfile.name}!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            ADD FRIEND MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showAddFriendModal}
          onClose={() => setShowAddFriendModal(false)}
          title="Add a Friend to Your LUMI Circle"
          subtitle="Connect with close friends to share memories and study moments."
        >
          {addedFriendToast ? (
            <div className="py-6 text-center lumi-animate-fade-up">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8F4] text-[#3E7D5C] text-xl border border-[#CCE5DC]">
                ✓
              </div>
              <p className="font-serif font-bold text-lg text-[#17151C]">Friend Request Sent!</p>
              <p className="text-xs text-[#5F5965] mt-0.5">They will appear in your circle once confirmed.</p>
            </div>
          ) : (
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Friend's LUMI Handle or Email *
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. @priya_code or priya@university.edu"
                  value={newFriendHandle}
                  onChange={(e) => setNewFriendHandle(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  required
                />
              </div>

              <div className="rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 text-xs text-[#5F5965] leading-relaxed flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#9E96D8] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#17151C]">LUMI Privacy Guarantee:</strong> Friends can only see memories you explicitly share. Your daily planner, journal reflections, and personal vault remain 100% private.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFriendModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFriendHandle.trim()}
                  className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
