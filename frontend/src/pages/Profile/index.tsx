import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  MapPin,
  Minus,
  Music,
  Plus,
  Quote,
  RotateCcw,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

/* =========================================================
   TYPES
========================================================= */

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

interface ProfileMemory {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  caption: string;
  location?: string;
  song?: string;
  visibility?: "private" | "friends" | "close_friends";
  isShared?: boolean;
  createdAt?: string;
}

interface CropEditorProps {
  image: string;
  type: "cover" | "avatar";
  onCancel: () => void;
  onSave: (image: string) => void;
}

/* =========================================================
   DEFAULT PROFILE
========================================================= */

const DEFAULT_PROFILE: UserProfileData = {
  displayName: "Shru",
  username: "shru.lumi",
  bio: "Crafting beautiful days with LUMI ✨",
  favoriteQuote:
    "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
  quoteAuthor: "John C. Maxwell",
  currentGoal:
    "Master Full-Stack Systems & Finish 25 Books",
  favoriteBook:
    "Atomic Habits by James Clear",
  favoriteSong:
    "Kyoto — Phoebe Bridgers",
  interests: [
    "Design Systems",
    "Machine Learning",
    "Book Clubs",
    "Trail Running",
    "Matcha & Coffee",
  ],
  joinedDate: "October 2025",
};

/* =========================================================
   CROP EDITOR
========================================================= */

function CropEditor({
  image,
  type,
  onCancel,
  onSave,
}: CropEditorProps) {
  const isCover = type === "cover";

  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] = useState(false);
    useState(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const positionStart = useRef({
    x: 0,
    y: 0,
  });

  const previewWidth = isCover ? 760 : 224;
  const previewHeight = isCover ? 250 : 224;

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    setDragging(true);

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    positionStart.current = {
      ...position,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!dragging) return;

    const deltaX =
      event.clientX -
      dragStart.current.x;

    const deltaY =
      event.clientY -
      dragStart.current.y;

    setPosition({
      x:
        positionStart.current.x +
        deltaX,

      y:
        positionStart.current.y +
        deltaY,
    });
  }

  function handlePointerUp() {
    setDragging(false);
  }

  function resetCrop() {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  }

  function saveCrop() {
    const img = new Image();

    img.onload = () => {
      const outputWidth = isCover
        ? 1600
        : 800;

      const outputHeight = isCover
        ? 520
        : 800;

      const canvas =
        document.createElement("canvas");

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context =
        canvas.getContext("2d");

      if (!context) return;

      /*
       * IMPORTANT:
       * This is the exact same "cover" calculation
       * used by the preview.
       */

      const baseScale = Math.max(
        previewWidth / img.width,
        previewHeight / img.height
      );

      const scale =
        baseScale * zoom;

      const renderedWidth =
        img.width * scale;

      const renderedHeight =
        img.height * scale;

      const renderedX =
        (previewWidth -
          renderedWidth) /
          2 +
        position.x;

      const renderedY =
        (previewHeight -
          renderedHeight) /
          2 +
        position.y;

      const scaleX =
        outputWidth /
        previewWidth;

      const scaleY =
        outputHeight /
        previewHeight;

      context.clearRect(
        0,
        0,
        outputWidth,
        outputHeight
      );

      context.drawImage(
        img,
        renderedX * scaleX,
        renderedY * scaleY,
        renderedWidth * scaleX,
        renderedHeight * scaleY
      );

      /*
       * Crop exactly what the user saw.
       */
      onSave(
        canvas.toDataURL(
          "image/jpeg",
          0.94
        )
      );
    };

    img.src = image;
  }

  /*
   * The preview and canvas now use the SAME
   * cover calculation.
   */

  return (
    <div
      className="
        fixed
        inset-0
        z-[500]
        flex
        items-center
        justify-center
        bg-black/75
        p-4
        backdrop-blur-md
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[2rem]
          bg-[#17151C]
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-5
            py-4
          "
        >
          <div>
            <h2
              className="
                font-serif
                text-xl
                font-bold
                text-white
              "
            >
              Adjust{" "}
              {isCover
                ? "cover"
                : "profile photo"}
            </h2>

            <p
              className="
                mt-0.5
                text-[11px]
                text-white/55
              "
            >
              Drag to position · Use the
              slider to zoom
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              cursor-pointer
            "
          >
            <X size={17} />
          </button>
        </div>

        {/* PREVIEW */}

        <div
          className="
            flex
            justify-center
            bg-black/30
            p-5
            sm:p-8
          "
        >
          <div
            className={`
              relative
              overflow-hidden
              bg-black
              shadow-2xl
              ${
                isCover
                  ? "aspect-[3.04/1] w-full max-w-3xl rounded-2xl"
                  : "h-52 w-52 rounded-full sm:h-56 sm:w-56"
              }
            `}
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            style={{
              cursor: dragging
                ? "grabbing"
                : "grab",
              touchAction: "none",
            }}
          >
            <img
              src={image}
              alt="Crop preview"
              draggable={false}
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-full
                w-full
                max-w-none
                select-none
                object-cover
              "
              style={{
                transform: `
                  translate(
                    calc(-50% + ${position.x}px),
                    calc(-50% + ${position.y}px)
                  )
                  scale(${zoom})
                `,
              }}
            />

            {/* Subtle preview border */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                ring-1
                ring-inset
                ring-white/30
              "
            />

            {!isCover && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-full
                  ring-2
                  ring-white/60
                "
              />
            )}
          </div>
        </div>

        {/* ZOOM */}

        <div className="px-5 pb-5 sm:px-8">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <Minus
              size={15}
              className="text-white/60"
            />

            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) =>
                setZoom(
                  Number(
                    event.target.value
                  )
                )
              }
              className="
                h-1.5
                flex-1
                cursor-pointer
                accent-[#9E96D8]
              "
            />

            <Plus
              size={15}
              className="text-white/60"
            />

            <button
              type="button"
              onClick={resetCrop}
              className="
                ml-2
                flex
                items-center
                gap-1.5
                rounded-lg
                px-2.5
                py-1.5
                text-[10px]
                font-semibold
                text-white/60
                hover:bg-white/10
                hover:text-white
                cursor-pointer
              "
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          {/* ACTIONS */}

          <div
            className="
              mt-5
              flex
              justify-end
              gap-2.5
            "
          >
            <button
              type="button"
              onClick={onCancel}
              className="
                rounded-xl
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white/70
                hover:bg-white/10
                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveCrop}
              className="
                rounded-xl
                bg-white
                px-5
                py-2.5
                text-xs
                font-bold
                text-[#17151C]
                transition
                hover:bg-[#EEEAFE]
                cursor-pointer
              "
            >
              Apply & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

export default function Profile() {
  /* =========================================================
     PROFILE
  ========================================================= */

  const [profile, setProfile] =
    useState<UserProfileData>(() => {
      try {
        const saved =
          localStorage.getItem(
            "lumi_profile"
          );

        return saved
          ? JSON.parse(saved)
          : DEFAULT_PROFILE;
      } catch {
        return DEFAULT_PROFILE;
      }
    });

  const [editForm, setEditForm] =
    useState<UserProfileData>(profile);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [newInterest, setNewInterest] =
    useState("");

  const [savedToast, setSavedToast] =
    useState(false);

  /* =========================================================
     COVER
  ========================================================= */

  const [coverImage, setCoverImage] =
    useState<string | null>(() =>
      localStorage.getItem(
        "lumi_profile_cover"
      )
    );

  const coverInputRef =
    useRef<HTMLInputElement>(null);

  /* =========================================================
     PFP
  ========================================================= */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* =========================================================
     CROP
  ========================================================= */

  const [cropImage, setCropImage] =
    useState<string | null>(null);

  const [cropType, setCropType] =
    useState<
      "cover" | "avatar" | null
    >(null);

  /* =========================================================
     TABS
  ========================================================= */

  const [activeTab, setActiveTab] =
    useState<
      "memories" | "about"
    >("memories");

  /* =========================================================
     MEMORIES
  ========================================================= */

  const [memories, setMemories] =
    useState<ProfileMemory[]>([]);

  const [loadingMemories, setLoadingMemories] =
    useState(true);

  const [selectedMemory, setSelectedMemory] =
    useState<ProfileMemory | null>(null);

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    async function loadUser() {
      try {
        const response =
          await api.auth.getMe();

        if (response.data?.user) {
          const user =
            response.data.user;

          setProfile((previous) => {
            const updated = {
              ...previous,

              displayName:
                user.name ||
                previous.displayName,

              username: user.email
                ? user.email.split(
                    "@"
                  )[0]
                : previous.username,

              bio:
                user.bio ||
                previous.bio,
            };

            setEditForm(updated);

            localStorage.setItem(
              "lumi_profile",
              JSON.stringify(updated)
            );

            return updated;
          });
        }
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    }

    loadUser();
  }, []);

  /* =========================================================
     LOAD SHARED MEMORIES
  ========================================================= */

  useEffect(() => {
    async function loadMemories() {
      setLoadingMemories(true);

      try {
        const response =
          await api.memories.getAll();

        if (
          response.data?.memories
        ) {
          const mapped: ProfileMemory[] =
            response.data.memories.map(
              (memory: any) => ({
                id: memory.id,

                title:
                  memory.title ||
                  "Untitled memory",

                imageUrl:
                  memory.imageUrl ||
                  memory.image_url ||
                  "",

                date:
                  memory.date ||
                  memory.createdAt ||
                  memory.created_at ||
                  new Date().toISOString(),

                caption:
                  memory.caption || "",

                location:
                  memory.location ||
                  "",

                song:
                  memory.song || "",

                visibility:
                  memory.isShared
                    ? "friends"
                    : memory.visibility ||
                      "private",

                isShared:
                  Boolean(
                    memory.isShared
                  ) ||
                  memory.visibility ===
                    "friends" ||
                  memory.visibility ===
                    "close_friends",

                createdAt:
                  memory.createdAt ||
                  memory.created_at,
              })
            );

          const sharedMemories =
            mapped.filter(
              (memory) =>
                memory.isShared ||
                memory.visibility ===
                  "friends" ||
                memory.visibility ===
                  "close_friends"
            );

          setMemories(
            sharedMemories
          );
        } else {
          setMemories([]);
        }
      } catch (error) {
        console.error(
          "Failed to load memories:",
          error
        );

        setMemories([]);
      } finally {
        setLoadingMemories(false);
      }
    }

    loadMemories();

    const handleSync = () => {
      loadMemories();
    };

    window.addEventListener(
      "lumi-sync",
      handleSync
    );

    return () => {
      window.removeEventListener(
        "lumi-sync",
        handleSync
      );
    };
  }, []);

  /* =========================================================
     PFP UPLOAD
  ========================================================= */

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Please select an image smaller than 5MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (
      readerEvent
    ) => {
      const dataUrl =
        readerEvent.target
          ?.result as string;

      if (!dataUrl) return;

      setCropImage(dataUrl);
      setCropType("avatar");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  /* =========================================================
     REMOVE AVATAR
  ========================================================= */

  function handleRemoveAvatar() {
    const updated = {
      ...profile,
      avatarUrl: undefined,
    };

    setProfile(updated);
    setEditForm(updated);

    localStorage.setItem(
      "lumi_profile",
      JSON.stringify(updated)
    );

    localStorage.removeItem(
      "lumi_user_avatar"
    );

    window.dispatchEvent(
      new CustomEvent(
        "lumi-profile-change",
        {
          detail: updated,
        }
      )
    );

    setSavedToast(true);

    setTimeout(
      () => setSavedToast(false),
      2500
    );
  }

  /* =========================================================
     COVER UPLOAD
  ========================================================= */

  function handleCoverUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Please select a cover image smaller than 10MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (
      readerEvent
    ) => {
      const dataUrl =
        readerEvent.target
          ?.result as string;

      if (!dataUrl) return;

      setCropImage(dataUrl);
      setCropType("cover");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  /* =========================================================
     SAVE CROP
  ========================================================= */

  function handleCropSave(
    croppedImage: string
  ) {
    if (cropType === "cover") {
      setCoverImage(croppedImage);

      localStorage.setItem(
        "lumi_profile_cover",
        croppedImage
      );
    }

    if (cropType === "avatar") {
      const updated = {
        ...profile,
        avatarUrl: croppedImage,
      };

      setProfile(updated);
      setEditForm(updated);

      localStorage.setItem(
        "lumi_profile",
        JSON.stringify(updated)
      );

      localStorage.setItem(
        "lumi_user_avatar",
        croppedImage
      );

      window.dispatchEvent(
        new CustomEvent(
          "lumi-profile-change",
          {
            detail: updated,
          }
        )
      );
    }

    setCropImage(null);
    setCropType(null);

    setSavedToast(true);

    setTimeout(
      () => setSavedToast(false),
      2500
    );
  }

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  async function handleSaveProfile(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setProfile(editForm);

      localStorage.setItem(
        "lumi_profile",
        JSON.stringify(editForm)
      );

      if (editForm.avatarUrl) {
        localStorage.setItem(
          "lumi_user_avatar",
          editForm.avatarUrl
        );
      } else {
        localStorage.removeItem(
          "lumi_user_avatar"
        );
      }

      window.dispatchEvent(
        new CustomEvent(
          "lumi-profile-change",
          {
            detail: editForm,
          }
        )
      );

      const response =
        await api.auth.updateMe({
          name:
            editForm.displayName,

          bio:
            editForm.bio,
        });

      if (response.error) {
        console.error(
          "Profile backend update failed:",
          response.error
        );
      }

      setShowEditModal(false);

      setSavedToast(true);

      setTimeout(
        () => setSavedToast(false),
        2500
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      alert(
        "Your local profile was saved, but the server update failed."
      );
    }
  }

  /* =========================================================
     INTERESTS
  ========================================================= */

  function handleAddInterest() {
    const value =
      newInterest.trim();

    if (!value) return;

    if (
      !editForm.interests.includes(
        value
      )
    ) {
      setEditForm(
        (previous) => ({
          ...previous,

          interests: [
            ...previous.interests,
            value,
          ],
        })
      );
    }

    setNewInterest("");
  }

  function handleRemoveInterest(
    tag: string
  ) {
    setEditForm(
      (previous) => ({
        ...previous,

        interests:
          previous.interests.filter(
            (interest) =>
              interest !== tag
          ),
      })
    );
  }

  /* =========================================================
     DATE
  ========================================================= */

  function formatMemoryDate(
    date: string
  ) {
    if (!date) return "";

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        pb-28
        text-[#17151C]
        lumi-animate-fade-up
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          px-4
          py-5
          sm:px-6
          md:px-8
          md:py-7
        "
      >
        {/* =====================================================
            EDIT PROFILE
        ===================================================== */}

        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEditForm(profile);
              setShowEditModal(true);
            }}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#17151C]
              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:bg-[#2D263B]
              active:scale-95
              cursor-pointer
            "
          >
            <Edit3 size={15} />
            Edit Profile
          </button>
        </div>

        {/* =====================================================
            COVER
        ===================================================== */}

        <section>
          <div
            className="
              group
              relative
              h-44
              overflow-hidden
              rounded-[2rem]
              border
              border-[#E8E3F0]
              bg-gradient-to-br
              from-[#DCD6F7]
              via-[#F5DCE8]
              to-[#DCEBF4]
              shadow-sm
              sm:h-52
              md:h-60
            "
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Profile cover"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <>
                <div
                  className="
                    absolute
                    -left-12
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-[#BEB6EC]/40
                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    right-0
                    top-0
                    h-72
                    w-72
                    rounded-full
                    bg-[#F3BFD5]/40
                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[-100px]
                    left-1/3
                    h-72
                    w-72
                    rounded-full
                    bg-[#BBDCEB]/50
                    blur-3xl
                  "
                />
              </>
            )}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-b
                from-black/0
                via-black/0
                to-black/15
              "
            />

            <input
              type="file"
              ref={coverInputRef}
              onChange={
                handleCoverUpload
              }
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                coverInputRef.current?.click()
              }
              className="
                absolute
                right-4
                top-4
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/60
                bg-black/35
                px-3
                py-2
                text-[11px]
                font-semibold
                text-white
                opacity-0
                backdrop-blur-md
                transition
                duration-200
                group-hover:opacity-100
                hover:bg-black/50
                cursor-pointer
              "
            >
              <Camera size={14} />
              Change cover
            </button>
          </div>

          {/* =================================================
              IDENTITY
          ================================================= */}

          <div
            className="
              relative
              px-1
              sm:px-4
              md:px-7
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
              "
            >
              {/* PFP */}

              <div
                className="
                  relative
                  -mt-12
                  ml-4
                  shrink-0
                  sm:-mt-14
                  sm:ml-3
                  md:-mt-16
                  md:ml-4
                "
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={
                    handleImageUpload
                  }
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    group
                    relative
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-[5px]
                    border-white
                    bg-gradient-to-br
                    from-[#EEEAFE]
                    via-[#F8E8F0]
                    to-[#EEF3FA]
                    shadow-lg
                    sm:h-32
                    sm:w-32
                    md:h-36
                    md:w-36
                    cursor-pointer
                  "
                >
                  {profile.avatarUrl ? (
                    <img
                      src={
                        profile.avatarUrl
                      }
                      alt={
                        profile.displayName
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <span
                      className="
                        font-serif
                        text-5xl
                        font-bold
                        text-[#17151C]
                      "
                    >
                      {profile.displayName
                        ? profile.displayName
                            .charAt(0)
                            .toUpperCase()
                        : "S"}
                    </span>
                  )}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                      bg-[#17151C]/55
                      text-white
                      opacity-0
                      transition-opacity
                      duration-200
                      group-hover:opacity-100
                    "
                  >
                    <Camera size={18} />

                    <span
                      className="
                        mt-1
                        text-[9px]
                        font-semibold
                      "
                    >
                      Change
                    </span>
                  </div>
                </button>

                <span
                  className="
                    absolute
                    bottom-1
                    right-1
                    h-5
                    w-5
                    rounded-full
                    border-[3px]
                    border-white
                    bg-[#528D6F]
                    shadow-sm
                  "
                />
              </div>

              {/* PROFILE TEXT */}

              <div
                className="
                  min-w-0
                  flex-1
                  pb-1
                  pt-0
                  sm:pb-2
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2.5
                  "
                >
                  <h1
                    className="
                      font-serif
                      text-3xl
                      font-bold
                      tracking-tight
                      text-[#17151C]
                      dark:text-[#F3EFF8]
                      sm:text-4xl
                    "
                  >
                    {profile.displayName}

                    <span
                      className="
                        ml-1.5
                        text-[#9E96D8]
                      "
                    >
                      ✦
                    </span>
                  </h1>

                  <span
                    className="
                      rounded-full
                      border
                      border-[#DDD8F2]
                      dark:border-[#584D7A]
                      bg-[#EEEAFE]
                      dark:bg-[#3D3456]
                      px-2.5
                      py-1
                      text-[11px]
                      font-bold
                      text-[#554394]
                      dark:text-[#E2DEEA]
                    "
                  >
                    @{profile.username}
                  </span>
                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#2D263B] dark:text-[#E2DEEA] font-normal">
                  {profile.bio}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[#524B5C] dark:text-[#B2AABF]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-[#9E96D8]" />
                    Member since {profile.joinedDate}
                  </span>

                  <span className="hidden sm:inline text-[#DDD8F2] dark:text-[#4A3E65]">•</span>

                  <span className="flex items-center gap-1.5 text-[#2F6B4D] dark:text-[#7BE0B8] font-semibold">
                    <Shield size={13} className="text-[#3E7D5C] dark:text-[#7BE0B8]" />
                    Private Vault Protected
                  </span>

                  {profile.avatarUrl && (
                    <>
                      <span className="hidden sm:inline text-[#DDD8F2] dark:text-[#4A3E65]">•</span>

                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-[11px] font-semibold text-[#B83E6A] dark:text-[#F0B5CF] hover:underline cursor-pointer transition"
                      >
                        Remove photo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                INTERESTS
            ================================================= */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-2
                pb-5
              "
            >
              {profile.interests.map(
                (interest) => (
                  <span
                    key={interest}
                    className="
                      rounded-full
                      border
                      border-[#E8E3F0]
                      dark:border-[#3D3550]
                      bg-white/90
                      dark:bg-[#252033]
                      px-3
                      py-1.5
                      text-[11px]
                      font-medium
                      text-[#3D3747]
                      dark:text-[#DDD8F2]
                      shadow-2xs
                    "
                  >
                    #{interest}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            SUCCESS TOAST
        ===================================================== */}

        {savedToast && (
          <div
            className="
              fixed
              right-5
              top-5
              z-[100]
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-[#CCE5DC]
              bg-[#EEF8F4]
              px-4
              py-3
              text-xs
              font-semibold
              text-[#3E7D5C]
              shadow-lg
              lumi-animate-fade-up
            "
          >
            <CheckCircle2 size={16} />
            Profile updated
          </div>
        )}

        {/* =====================================================
            MEMORIES / ABOUT
            NO TOP LINE
            NO BOTTOM LINE
            PILL STYLE
        ===================================================== */}

      {/* =====================================================
    MEMORIES / ABOUT
===================================================== */}

<div className="mb-7 mt-4">
  <div
    className="
      flex
      items-center
      gap-3
      px-1
      sm:px-4
      md:px-7
    "
  >
    {/* MEMORIES */}

    <button
      type="button"
      onClick={() =>
        setActiveTab("memories")
      }
      className={`
        rounded-full
        border
        px-5
        py-2.5
        text-sm
        font-bold
        uppercase
        tracking-[0.08em]
        transition-all
        duration-200
        cursor-pointer

        ${
          activeTab === "memories"
            ? `
              border-[#D2C9EF]
              bg-[#EEEAFE]
              text-[#5F5294]
              shadow-sm
            `
            : `
              border-transparent
              bg-transparent
              text-[#8D8792]
              hover:border-[#E8E3F0]
              hover:bg-white/60
              hover:text-[#5F5965]
            `
        }
      `}
    >
      MEMORIES
    </button>

    {/* ABOUT */}

    <button
      type="button"
      onClick={() =>
        setActiveTab("about")
      }
      className={`
        rounded-full
        border
        px-5
        py-2.5
        text-sm
        font-bold
        uppercase
        tracking-[0.08em]
        transition-all
        duration-200
        cursor-pointer

        ${
          activeTab === "about"
            ? `
              border-[#D2C9EF]
              bg-[#EEEAFE]
              text-[#5F5294]
              shadow-sm
            `
            : `
              border-transparent
              bg-transparent
              text-[#8D8792]
              hover:border-[#E8E3F0]
              hover:bg-white/60
              hover:text-[#5F5965]
            `
        }
      `}
    >
      ABOUT
    </button>
  </div>
</div>     
        {/* =====================================================
            MEMORIES
        ===================================================== */}

        {activeTab === "memories" && (
          <section>
            {loadingMemories ? (
              <div className="py-16 text-center">
                <div
                  className="
                    mx-auto
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-[#DDD8F2]
                    border-t-[#9E96D8]
                  "
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-[#8D8792]
                  "
                >
                  Loading shared memories...
                </p>
              </div>
            ) : memories.length ===
              0 ? (
              <Card
                variant="glass"
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  border-[#E8E3F0]
                  px-6
                  py-16
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#EEEAFE]
                    text-[#9E96D8]
                  "
                >
                  <ImageIcon size={23} />
                </div>

                <h3
                  className="
                    mt-4
                    font-serif
                    text-lg
                    font-bold
                    text-[#17151C]
                  "
                >
                  No shared memories yet
                </h3>

                <p
                  className="
                    mt-1
                    max-w-sm
                    text-xs
                    leading-relaxed
                    text-[#8D8792]
                  "
                >
                  Moments you choose to
                  share will appear here.
                </p>
              </Card>
            ) : (
              <div
                className="
                  grid
                  grid-cols-3
                  gap-1.5
                  sm:gap-2
                  md:gap-2.5
                "
              >
                {memories.map(
                  (memory) => (
                    <button
                      key={memory.id}
                      type="button"
                      onClick={() =>
                        setSelectedMemory(
                          memory
                        )
                      }
                      className="
                        group
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-xl
                        bg-[#F4F1F6]
                        text-left
                        cursor-pointer
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#9E96D8]
                        focus:ring-offset-2
                      "
                    >
                      {memory.imageUrl ? (
                        <img
                          src={
                            memory.imageUrl
                          }
                          alt={
                            memory.caption ||
                            memory.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-[#EEEAFE]
                            to-[#F8E8F0]
                          "
                        >
                          <ImageIcon
                            size={26}
                            className="text-[#9E96D8]"
                          />
                        </div>
                      )}

                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-end
                          bg-gradient-to-t
                          from-black/55
                          via-black/10
                          to-transparent
                          opacity-0
                          transition
                          duration-300
                          group-hover:opacity-100
                        "
                      >
                        <div className="w-full p-3 text-white">
                          <p className="truncate text-[11px] font-semibold">
                            {memory.title}
                          </p>

                          <p className="mt-0.5 text-[9px] opacity-80">
                            {formatMemoryDate(
                              memory.date
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            ABOUT
        ===================================================== */}

        {activeTab === "about" && (
          <section
            className="
              mx-auto
              grid
              max-w-4xl
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            <Card
              variant="glass"
              className="
                border-[#E8E3F0]
                p-6
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2
                "
              >
                <Sparkles
                  size={17}
                  className="text-[#9E96D8]"
                />

                <h2
                  className="
                    font-serif
                    text-xl
                    font-bold
                    text-[#17151C]
                  "
                >
                  A little about me
                </h2>
              </div>

              <p
                className="
                  text-sm
                  leading-7
                  text-[#2D263B]
                  dark:text-[#E2DEEA]
                "
              >
                {profile.bio}
              </p>

              <div className="mt-6">
                <p
                  className="
                    mb-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#524B5C]
                    dark:text-[#A7A0B5]
                  "
                >
                  Interests
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(
                    (interest) => (
                      <span
                        key={interest}
                        className="
                          rounded-xl
                          border
                          border-[#E8E3F0]
                          dark:border-[#3D3550]
                          bg-[#FAF8FC]
                          dark:bg-[#252033]
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-[#3D3747]
                          dark:text-[#DDD8F2]
                        "
                      >
                        {interest}
                      </span>
                    )
                  )}
                </div>
              </div>
            </Card>

            <Card
              variant="lavender"
              className="
                border-[#DDD8F2]
                p-6
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2
                "
              >
                <Sparkles
                  size={17}
                  className="text-[#9E96D8]"
                />

                <h2
                  className="
                    font-serif
                    text-xl
                    font-bold
                    text-[#17151C]
                  "
                >
                  Current things
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#8D8792]
                    "
                  >
                    Current goal
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-[#17151C]
                    "
                  >
                    {profile.currentGoal}
                  </p>
                </div>

                <div>
                  <p
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#8D8792]
                    "
                  >
                    <BookOpen size={12} />
                    Reading
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-[#17151C]
                    "
                  >
                    {profile.favoriteBook}
                  </p>
                </div>

                <div>
                  <p
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#8D8792]
                    "
                  >
                    <Music size={12} />
                    Soundtrack
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-[#17151C]
                    "
                  >
                    {profile.favoriteSong}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              variant="pink"
              className="
                border-[#F0D5E1]
                p-6
                md:col-span-2
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/70
                    text-[#D99BB8]
                  "
                >
                  <Quote size={18} />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#8D8792]
                    "
                  >
                    Guiding philosophy
                  </p>

                  <p
                    className="
                      mt-2
                      font-serif
                      text-base
                      italic
                      leading-relaxed
                      text-[#17151C]
                      md:text-lg
                    "
                  >
                    “{profile.favoriteQuote}”
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      font-semibold
                      text-[#5F5965]
                    "
                  >
                    — {profile.quoteAuthor}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* =====================================================
            MEMORY LIGHTBOX
        ===================================================== */}

        {selectedMemory && (
          <div
            className="
              fixed
              inset-0
              z-[200]
              flex
              items-center
              justify-center
              bg-[#17151C]/75
              p-4
              backdrop-blur-sm
            "
            onClick={() =>
              setSelectedMemory(null)
            }
          >
            <div
              className="
                relative
                max-h-[92vh]
                w-full
                max-w-4xl
                overflow-hidden
                rounded-[2rem]
                bg-white
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedMemory(null)
                }
                className="
                  absolute
                  right-4
                  top-4
                  z-10
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/50
                  text-white
                  backdrop-blur-md
                  transition
                  hover:bg-black/70
                  cursor-pointer
                "
              >
                <X size={17} />
              </button>

              <div
                className="
                  grid
                  max-h-[92vh]
                  grid-cols-1
                  overflow-auto
                  md:grid-cols-[1.4fr_0.8fr]
                "
              >
                <div
                  className="
                    flex
                    min-h-[300px]
                    items-center
                    justify-center
                    bg-[#F4F1F6]
                  "
                >
                  {selectedMemory.imageUrl ? (
                    <img
                      src={
                        selectedMemory.imageUrl
                      }
                      alt={
                        selectedMemory.caption ||
                        selectedMemory.title
                      }
                      className="
                        max-h-[70vh]
                        w-full
                        object-contain
                        md:max-h-[92vh]
                      "
                    />
                  ) : (
                    <ImageIcon
                      size={40}
                      className="text-[#9E96D8]"
                    />
                  )}
                </div>

                <div
                  className="
                    flex
                    flex-col
                    p-6
                    md:p-7
                  "
                >
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#9E96D8]
                      "
                    >
                      LUMI Memory
                    </p>

                    <h2
                      className="
                        mt-1
                        font-serif
                        text-2xl
                        font-bold
                        text-[#17151C]
                      "
                    >
                      {selectedMemory.title}
                    </h2>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-[#5F5965]
                      "
                    >
                      <Calendar
                        size={14}
                        className="text-[#9E96D8]"
                      />

                      {formatMemoryDate(
                        selectedMemory.date
                      )}
                    </div>

                    {selectedMemory.location && (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-[#5F5965]
                        "
                      >
                        <MapPin
                          size={14}
                          className="text-[#D99BB8]"
                        />

                        {
                          selectedMemory.location
                        }
                      </div>
                    )}

                    {selectedMemory.song && (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-[#5F5965]
                        "
                      >
                        <Music
                          size={14}
                          className="text-[#9E96D8]"
                        />

                        {
                          selectedMemory.song
                        }
                      </div>
                    )}
                  </div>

                  {selectedMemory.caption && (
                    <p
                      className="
                        mt-6
                        text-sm
                        leading-7
                        text-[#5F5965]
                      "
                    >
                      {
                        selectedMemory.caption
                      }
                    </p>
                  )}

                  <div className="mt-auto pt-8">
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[#E8E3F0]
                        bg-[#FAF8FC]
                        px-3
                        py-2.5
                      "
                    >
                      <Shield
                        size={14}
                        className="text-[#528D6F]"
                      />

                      <span
                        className="
                          text-[11px]
                          font-medium
                          text-[#5F5965]
                        "
                      >
                        Shared from this
                        LUMI profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            EDIT PROFILE MODAL
        ===================================================== */}

        <Modal
          isOpen={showEditModal}
          onClose={() =>
            setShowEditModal(false)
          }
          title="Edit Your LUMI Persona"
          subtitle="Customize your identity and the details that appear on your profile."
        >
          <form
            onSubmit={
              handleSaveProfile
            }
            className="space-y-4"
          >
            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              <div>
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  Display Name *
                </label>

                <input
                  type="text"
                  value={
                    editForm.displayName
                  }
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      displayName:
                        event.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                  required
                />
              </div>

              <div>
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  LUMI @username *
                </label>

                <div className="relative">
                  <span
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      font-bold
                      text-[#8D8792]
                    "
                  >
                    @
                  </span>

                  <input
                    type="text"
                    value={
                      editForm.username
                    }
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        username:
                          event.target.value
                            .replace(
                              /[^a-zA-Z0-9._]/g,
                              ""
                            )
                            .toLowerCase(),
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E8E3F0]
                      bg-white
                      py-2
                      pl-7
                      pr-3
                      text-xs
                      font-medium
                      text-[#17151C]
                      outline-none
                      shadow-2xs
                      focus:border-[#9E96D8]
                    "
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  text-[#17151C]
                "
              >
                Personal Bio & Intention
              </label>

              <textarea
                value={editForm.bio}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    bio: event.target.value,
                  })
                }
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#E8E3F0]
                  bg-white
                  px-3.5
                  py-2
                  text-xs
                  font-medium
                  text-[#17151C]
                  outline-none
                  shadow-2xs
                  focus:border-[#9E96D8]
                "
              />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              <div>
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  Current Goal
                </label>

                <input
                  type="text"
                  value={
                    editForm.currentGoal
                  }
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      currentGoal:
                        event.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                />
              </div>

              <div>
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  Favorite / Current Book
                </label>

                <input
                  type="text"
                  value={
                    editForm.favoriteBook
                  }
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      favoriteBook:
                        event.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                />
              </div>
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  text-[#17151C]
                "
              >
                Favorite Soundtrack / Song
              </label>

              <input
                type="text"
                value={
                  editForm.favoriteSong
                }
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    favoriteSong:
                      event.target.value,
                  })
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#E8E3F0]
                  bg-white
                  px-3.5
                  py-2
                  text-xs
                  font-medium
                  text-[#17151C]
                  outline-none
                  shadow-2xs
                  focus:border-[#9E96D8]
                "
              />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-3
              "
            >
              <div className="sm:col-span-2">
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  Guiding Quote
                </label>

                <input
                  type="text"
                  value={
                    editForm.favoriteQuote
                  }
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      favoriteQuote:
                        event.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                />
              </div>

              <div>
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    text-[#17151C]
                  "
                >
                  Quote Author
                </label>

                <input
                  type="text"
                  value={
                    editForm.quoteAuthor
                  }
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      quoteAuthor:
                        event.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                />
              </div>
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  text-[#17151C]
                "
              >
                Interests & Focus Tags
              </label>

              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add interest..."
                  value={newInterest}
                  onChange={(event) =>
                    setNewInterest(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-[#E8E3F0]
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-medium
                    text-[#17151C]
                    outline-none
                    shadow-2xs
                    focus:border-[#9E96D8]
                  "
                />

                <button
                  type="button"
                  onClick={
                    handleAddInterest
                  }
                  className="
                    rounded-xl
                    border
                    border-[#DDD8F2]
                    bg-[#EEEAFE]
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-[#6B5BA5]
                    hover:bg-[#E2DBFA]
                    cursor-pointer
                  "
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {editForm.interests.map(
                  (interest) => (
                    <span
                      key={interest}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-[#E8E3F0]
                        bg-[#FAF8FC]
                        px-2.5
                        py-1
                        text-xs
                        text-[#17151C]
                      "
                    >
                      <span>
                        #{interest}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveInterest(
                            interest
                          )
                        }
                        className="
                          font-bold
                          text-[#8D8792]
                          hover:text-[#D99BB8]
                          cursor-pointer
                        "
                      >
                        ×
                      </button>
                    </span>
                  )
                )}
              </div>
            </div>

            <div
              className="
                flex
                justify-end
                gap-2.5
                pt-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
                className="
                  rounded-xl
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-[#5F5965]
                  hover:bg-[#EEEAFE]
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  rounded-xl
                  bg-[#17151C]
                  px-5
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  shadow-2xs
                  hover:bg-[#2D263B]
                  cursor-pointer
                "
              >
                Save Persona
              </button>
            </div>
          </form>
        </Modal>

        {/* =====================================================
            CROP EDITOR
        ===================================================== */}

        {cropImage && cropType && (
          <CropEditor
            image={cropImage}
            type={cropType}
            onCancel={() => {
              setCropImage(null);
              setCropType(null);
            }}
            onSave={handleCropSave}
          />
        )}
      </div>
    </div>
  );
}