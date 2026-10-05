import { useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  UserPlus,
  Send,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

interface FriendMemory {
  id: string;
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

const INITIAL_FRIEND_MEMORIES: FriendMemory[] = [
  {
    id: "fm-1",
    authorName: "Aarav",
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
    authorName: "Meera",
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
    authorName: "Rohan",
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
    authorName: "Isha",
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

const FRIENDS_LIST = [
  { name: "Aarav Patel", handle: "@aarav_codes", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80", status: "Coding ML Project", online: true },
  { name: "Meera Sen", handle: "@meera_design", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80", status: "Reading in library", online: true },
  { name: "Rohan Verma", handle: "@rohan_dev", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80", status: "Out on trail", online: false },
  { name: "Isha Roy", handle: "@isha_reads", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80", status: "Study sprint", online: true },
];

export default function Friends() {
  const [memories, setMemories] = useState<FriendMemory[]>(INITIAL_FRIEND_MEMORIES);
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendHandle, setNewFriendHandle] = useState("");
  const [addedFriendToast, setAddedFriendToast] = useState(false);

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
            VIEW SELECTOR TABS
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs">
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
                {FRIENDS_LIST.length}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            FEED VIEW
        ========================================================= */}
        {activeTab === "feed" && (
          <div className="grid gap-6 md:grid-cols-2">
            {memories.map((mem) => (
              <Card
                key={mem.id}
                variant="glass"
                hoverEffect
                className="overflow-hidden border-[#E8E3F0] bg-white/95 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mem.authorAvatar}
                        alt={mem.authorName}
                        className="h-10 w-10 rounded-full object-cover border border-[#DDD8F2] shadow-2xs"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#17151C] flex items-center gap-1.5">
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

        {/* =========================================================
            FRIENDS LIST VIEW
        ========================================================= */}
        {activeTab === "friends" && (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {FRIENDS_LIST.map((friend) => (
              <Card
                key={friend.handle}
                variant="glass"
                hoverEffect
                className="p-4 border-[#E8E3F0] bg-white/95 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="h-11 w-11 rounded-full object-cover border border-[#DDD8F2]"
                    />
                    {friend.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#528D6F] border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#17151C]">
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

                <span className="rounded-xl bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-1 text-[11px] font-semibold text-[#6B5BA5]">
                  Connected
                </span>
              </Card>
            ))}
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

              <div className="rounded-2xl bg-[#FAF8FC] border border-[#E8E3F0] p-3 text-xs text-[#5F5965] leading-relaxed">
                <strong className="text-[#17151C]">LUMI Privacy Note:</strong> Friends can only see memories that you explicitly toggle to "Share with Friends". All other entries remain 100% private to you.
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
