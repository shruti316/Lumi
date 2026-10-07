import React, { useState, useEffect } from "react";
import {
  X,
  CheckSquare,
  FileText,
  FolderKanban,
  PenLine,
  Camera,
  BookOpen,
  Flame,
  Lock,
  Users,
  Star,
} from "lucide-react";
import { api } from "../../lib/api";

export type CreateTemplateType =
  | "menu"
  | "task"
  | "note"
  | "project"
  | "goal"
  | "journal"
  | "memory"
  | "reading"
  | "habit";

interface UniversalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: CreateTemplateType;
  initialText?: string;
  onSuccess?: (type: CreateTemplateType) => void;
}

export function UniversalCreateModal({
  isOpen,
  onClose,
  initialTemplate = "menu",
  initialText = "",
  onSuccess,
}: UniversalCreateModalProps) {
  const [currentView, setCurrentView] = useState<CreateTemplateType>(initialTemplate);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available relations
  const [projects, setProjects] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  // Form States
  // Task
  const [taskTitle, setTaskTitle] = useState(initialText);
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskRelatedProject, setTaskRelatedProject] = useState("");
  const [taskRelatedGoal, setTaskRelatedGoal] = useState("");

  // Note
  const [noteTitle, setNoteTitle] = useState(initialText);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");

  // Project
  const [projName, setProjName] = useState(initialText);
  const [projDesc, setProjDesc] = useState("");
  const [projDeadline, setProjDeadline] = useState("");
  const [projStatus, setProjStatus] = useState<"Planning" | "In Progress" | "Completed" | "On Hold">("In Progress");

  // Goal
  const [goalTitle, setGoalTitle] = useState(initialText);
  const [goalDesc, setGoalDesc] = useState("");
  const [goalCategory, setGoalCategory] = useState<"Academic" | "Career" | "Health" | "Personal" | "Financial">("Academic");
  const [goalDeadline, setGoalDeadline] = useState("");

  // Journal
  const [journalTitle, setJournalTitle] = useState(initialText);
  const [journalType, setJournalType] = useState<"daily" | "reflection" | "gratitude" | "free">("daily");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("😊");

  // Memory
  const [memoryTitle, setMemoryTitle] = useState(initialText);
  const [memoryImage, setMemoryImage] = useState("");
  const [memoryCaption, setMemoryCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [memoryLocation, setMemoryLocation] = useState("");
  const [memoryVisibility, setMemoryVisibility] = useState<"private" | "friends" | "close_friends">("private");
  const [memoryMusic, setMemoryMusic] = useState("");
  const [memoryPeople, setMemoryPeople] = useState("");

  // Habit
  const [habitName, setHabitName] = useState(initialText);
  const [habitEmoji, setHabitEmoji] = useState("💧");

  // Reading
  const [bookTitle, setBookTitle] = useState(initialText);
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPages, setBookPages] = useState<number>(300);

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialTemplate || "menu");
      setErrorMessage(null);
      if (initialText) {
        setTaskTitle(initialText);
        setNoteTitle(initialText);
        setProjName(initialText);
        setGoalTitle(initialText);
        setJournalTitle(initialText);
        setMemoryTitle(initialText);
        setHabitName(initialText);
        setBookTitle(initialText);
      }
      // Load relation options
      api.workspace.getProjects().then((res) => {
        if (res.data?.projects) setProjects(res.data.projects);
      });
      api.goals.getAll().then((res) => {
        if (res.data?.goals) setGoals(res.data.goals);
      });
    }
  }, [isOpen, initialTemplate, initialText]);

  if (!isOpen) return null;

  function handleTriggerSuccess(msg: string, type: CreateTemplateType) {
    setSuccessToast(msg);
    setErrorMessage(null);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type } }));
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
      if (onSuccess) onSuccess(type);
    }, 900);
  }

  // SUBMIT HANDLERS
  async function handleSubmitTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.tasks.create({
      title: taskTitle.trim(),
      completed: false,
      priority: taskPriority,
      dueDate: taskDueDate || undefined,
    });
    setIsSubmitting(false);

    if (error || !data?.task) {
      setErrorMessage(error || "Failed to create task");
      return;
    }

    handleTriggerSuccess("Task added to your plan!", "task");
  }

  async function handleSubmitNote(e: React.FormEvent) {
    e.preventDefault();
    if ((!noteTitle.trim() && !noteContent.trim()) || isSubmitting) return;

    const tags = noteTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.workspace.createNote({
      title: noteTitle.trim() || "Untitled Note",
      content: noteContent.trim(),
      tags: tags.length > 0 ? tags : ["general"],
      pinned: false,
    });
    setIsSubmitting(false);

    if (error || !data?.note) {
      setErrorMessage(error || "Failed to save note");
      return;
    }

    handleTriggerSuccess("Note saved to workspace!", "note");
  }

  async function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.workspace.createProject({
      name: projName.trim(),
      description: projDesc.trim(),
      status: projStatus,
      progress: 0,
      deadline: projDeadline || "Ongoing",
    });
    setIsSubmitting(false);

    if (error || !data?.project) {
      setErrorMessage(error || "Failed to create project");
      return;
    }

    handleTriggerSuccess("Project created in workspace!", "project");
  }

  async function handleSubmitGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.goals.create({
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      category: goalCategory,
      targetDate: goalDeadline || "Ongoing",
      progress: 0,
      status: "In Progress",
    });
    setIsSubmitting(false);

    if (error || !data?.goal) {
      setErrorMessage(error || "Failed to set goal");
      return;
    }

    handleTriggerSuccess("Goal set successfully!", "goal");
  }

  async function handleSubmitJournal(e: React.FormEvent) {
    e.preventDefault();
    if ((!journalTitle.trim() && !journalContent.trim()) || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.journals.create({
      title: journalTitle.trim() || "Journal Entry",
      entry: journalContent.trim(),
      mood: journalMood,
      tags: [journalType],
      date: new Date().toISOString().split("T")[0],
    });
    setIsSubmitting(false);

    if (error || !data?.journal) {
      setErrorMessage(error || "Failed to save journal entry");
      return;
    }

    handleTriggerSuccess("Journal entry penned!", "journal");
  }

  async function handleSubmitMemory(e: React.FormEvent) {
    e.preventDefault();
    if (!memoryTitle.trim() || isSubmitting) return;

    const sampleImages = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
    ];
    const finalImg =
      memoryImage.trim() ||
      sampleImages[Math.floor(Math.random() * sampleImages.length)];
    const isSharedMoment = memoryVisibility === "friends" || memoryVisibility === "close_friends";

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.memories.create({
      title: memoryTitle.trim(),
      caption:
        memoryCaption.trim() +
        (memoryLocation ? ` 📍 ${memoryLocation}` : "") +
        (memoryPeople ? ` 👥 ${memoryPeople}` : "") +
        (memoryMusic ? ` 🎵 ${memoryMusic}` : ""),
      imageUrl: finalImg,
      location: memoryLocation.trim() || undefined,
      visibility: memoryVisibility,
      tags: isSharedMoment ? ["moment", "shared", memoryVisibility] : ["personal", "private"],
      memoryDate: memoryDate,
    });
    setIsSubmitting(false);

    if (error || !data?.memory) {
      setErrorMessage(error || "Failed to preserve memory");
      return;
    }

    handleTriggerSuccess(
      isSharedMoment ? "Moment shared with friends! ✨" : "Personal memory preserved in vault! 🔒",
      "memory"
    );
  }

  async function handleSubmitHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!habitName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.habits.create({
      name: habitName.trim(),
      emoji: habitEmoji || "🌱",
      icon: habitEmoji || "🌱",
      category: "Daily",
      targetDaysPerWeek: 7,
      frequency: "daily",
    });
    setIsSubmitting(false);

    if (error || !data?.habit) {
      setErrorMessage(error || "Failed to create habit");
      return;
    }

    handleTriggerSuccess("New habit tracker activated!", "habit");
  }

  async function handleSubmitReading(e: React.FormEvent) {
    e.preventDefault();
    if (!bookTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await api.reading.create({
      title: bookTitle.trim(),
      author: bookAuthor.trim() || "Unknown Author",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
      status: "reading",
      currentPage: 0,
      totalPages: Number(bookPages) || 300,
      rating: 0,
    });
    setIsSubmitting(false);

    if (error || !data?.book) {
      setErrorMessage(error || "Failed to add book");
      return;
    }

    handleTriggerSuccess("Book placed on your shelf!", "reading");
  }

  const CREATE_OPTIONS = [
    {
      type: "task" as CreateTemplateType,
      title: "Task",
      desc: "To-do item, deadline & priority",
      icon: <CheckSquare size={20} className="text-[#9E96D8]" />,
      bg: "bg-[#EEEAFE] border-[#DDD8F2]",
    },
    {
      type: "note" as CreateTemplateType,
      title: "Note",
      desc: "Knowledge, thoughts, ideas",
      icon: <FileText size={20} className="text-[#528D6F]" />,
      bg: "bg-[#EEF8F4] border-[#CCE5DC]",
    },
    {
      type: "project" as CreateTemplateType,
      title: "Project",
      desc: "Deliverable, codebase or sprint",
      icon: <FolderKanban size={20} className="text-[#9A644D]" />,
      bg: "bg-[#FDF3EC] border-[#F1D2C9]",
    },
    {
      type: "journal" as CreateTemplateType,
      title: "Journal",
      desc: "Daily entry, reflection, gratitude",
      icon: <PenLine size={20} className="text-[#D99BB8]" />,
      bg: "bg-[#FDF0F6] border-[#F2D8E4]",
    },
    {
      type: "memory" as CreateTemplateType,
      title: "Memory",
      desc: "Photo snapshot, date & story",
      icon: <Camera size={20} className="text-[#6B9AB8]" />,
      bg: "bg-[#EEF3FA] border-[#D9E7F2]",
    },
    {
      type: "reading" as CreateTemplateType,
      title: "Reading",
      desc: "Book to read & track progress",
      icon: <BookOpen size={20} className="text-[#6B9AB8]" />,
      bg: "bg-[#EEF3FA] border-[#D9E7F2]",
    },
    {
      type: "habit" as CreateTemplateType,
      title: "Habit",
      desc: "Daily ritual to track",
      icon: <Flame size={20} className="text-[#D99BB8]" />,
      bg: "bg-[#FDF0F6] border-[#F2D8E4]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17151C]/45 backdrop-blur-md p-3 sm:p-4 lumi-animate-fade-up">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#E8E3F0] bg-white p-4 sm:p-6 shadow-2xl transition-all scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8FC] text-[#8D8792] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer border border-[#E8E3F0]"
        >
          <X size={16} />
        </button>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm lumi-animate-fade-up">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF8F4] text-2xl text-[#3E7D5C] border border-[#CCE5DC] shadow-sm mb-3">
              ✨
            </div>
            <p className="font-serif text-xl font-bold text-[#17151C]">{successToast}</p>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2] text-xs">
              ✦
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
              LUMI Universal Creator
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17151C]">
              {currentView === "menu"
                ? "What would you like to create?"
                : `Create ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`}
            </h2>

            {currentView !== "menu" && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentView("menu");
                }}
                className="text-xs font-semibold text-[#9E96D8] hover:underline cursor-pointer"
              >
                ← All Options
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-600 font-medium animate-fadeIn">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* =========================================================
            MENU VIEW (GRID OF CREATION TYPES)
        ========================================================= */}
        {currentView === "menu" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            {CREATE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setCurrentView(opt.type)}
                className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${opt.bg}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-2xs border border-white/60 mb-2">
                  {opt.icon}
                </div>
                <span className="text-xs font-bold text-[#17151C]">{opt.title}</span>
                <span className="mt-0.5 text-[10px] text-[#5F5965] line-clamp-1 leading-tight">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* =========================================================
            CREATE TASK
        ========================================================= */}
        {currentView === "task" && (
          <form onSubmit={handleSubmitTask} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Task Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Complete AI assignment & submit lab"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as "low" | "medium" | "high")}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Related Project
                </label>
                <select
                  value={taskRelatedProject}
                  onChange={(e) => setTaskRelatedProject(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Related Goal
                </label>
                <select
                  value={taskRelatedGoal}
                  onChange={(e) => setTaskRelatedGoal(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="">None</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.title}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE NOTE
        ========================================================= */}
        {currentView === "note" && (
          <form onSubmit={handleSubmitNote} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Note Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Algorithm Study Cheat Sheet"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Content
              </label>
              <textarea
                rows={4}
                placeholder="Write your thoughts, lecture takeaways, or markdown notes..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:bg-white outline-none resize-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. college, study, formulas"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!noteTitle.trim() && !noteContent.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE PROJECT
        ========================================================= */}
        {currentView === "project" && (
          <form onSubmit={handleSubmitProject} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. AI Marketplace Application"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Status
                </label>
                <select
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value as "Planning" | "In Progress" | "Completed" | "On Hold")}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={projDeadline}
                  onChange={(e) => setProjDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Description / Stack / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Key deliverables, tech stack, dataset links or teammates..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:bg-white outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!projName.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE GOAL
        ========================================================= */}
        {currentView === "goal" && (
          <form onSubmit={handleSubmitGoal} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Build AI/ML Portfolio & Ship 3 Projects"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Category
                </label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value as "Academic" | "Career" | "Health" | "Personal" | "Financial")}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="Academic">Academic</option>
                  <option value="Career">Career</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Why does this goal matter?
              </label>
              <textarea
                rows={3}
                placeholder="What will achieving this unlock for your journey?"
                value={goalDesc}
                onChange={(e) => setGoalDesc(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:bg-white outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!goalTitle.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Set Goal
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE JOURNAL
        ========================================================= */}
        {currentView === "journal" && (
          <form onSubmit={handleSubmitJournal} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Template Type
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "daily", label: "Daily Entry" },
                  { id: "reflection", label: "Reflection" },
                  { id: "gratitude", label: "Gratitude" },
                  { id: "free", label: "Free Write" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setJournalType(t.id as any)}
                    className={`rounded-xl border py-2 text-[11px] font-semibold transition cursor-pointer ${
                      journalType === t.id
                        ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs"
                        : "bg-white border-[#E8E3F0] text-[#5F5965] hover:bg-[#FAF8FC]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#17151C]">
                  Title
                </label>
                <div className="flex gap-1">
                  {["😊", "😌", "🥰", "⚡", "😴"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setJournalMood(m)}
                      className={`h-6 w-6 rounded-md text-xs transition-transform cursor-pointer ${
                        journalMood === m ? "bg-[#EEEAFE] scale-110 border border-[#DDD8F2]" : "opacity-60"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Give today's thoughts a title..."
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Entry Content
              </label>
              <textarea
                rows={4}
                placeholder="Pour your reflections, memorable moments, or thoughts here..."
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] focus:bg-white outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!journalTitle.trim() && !journalContent.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save Journal
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE MEMORY / MOMENT
        ========================================================= */}
        {currentView === "memory" && (
          <form onSubmit={handleSubmitMemory} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1 scrollbar-none">
            {/* 1. MEDIA & TITLE */}
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Golden hour sunset at the bay"
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Photo Media / Upload (Up to 50MB)
              </label>
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#DDD8F2] bg-[#FAF8FC] hover:bg-[#EEEAFE]/50 hover:border-[#9E96D8] p-3.5 text-center transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        setErrorMessage("Please select an image file.");
                        return;
                      }
                      if (file.size > 50 * 1024 * 1024) {
                        setErrorMessage("File exceeds 50MB limit. Please choose a smaller file.");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setMemoryImage(reader.result as string);
                      reader.onerror = () => setErrorMessage("Could not process this file.");
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <Camera size={18} className="text-[#9E96D8]" />
                  <span className="text-xs font-semibold text-[#5F5965]">
                    Click or drag image to upload
                  </span>
                  <span className="text-[10px] text-[#8D8792]">
                    Supports JPG, PNG, WEBP, GIF, SVG (Max 50MB)
                  </span>
                </label>

                {memoryImage && (
                  <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-[#E8E3F0] bg-black/5">
                    <img
                      src={memoryImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setMemoryImage("")}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#8D8792]">or URL:</span>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={memoryImage.startsWith("data:") ? "" : memoryImage}
                    onChange={(e) => setMemoryImage(e.target.value)}
                    className="flex-1 rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3 py-1.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. DETAILS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={memoryDate}
                  onChange={(e) => setMemoryDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco Pier"
                  value={memoryLocation}
                  onChange={(e) => setMemoryLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Tag People (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya, Aarav"
                  value={memoryPeople}
                  onChange={(e) => setMemoryPeople(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Soundtrack / Song (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Snooze - SZA"
                  value={memoryMusic}
                  onChange={(e) => setMemoryMusic(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Caption / Story
              </label>
              <textarea
                rows={2}
                placeholder="What made this moment special?"
                value={memoryCaption}
                onChange={(e) => setMemoryCaption(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] p-3 text-xs font-medium text-[#17151C] leading-relaxed focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            {/* 3. VISIBILITY (MEMORY VS MOMENT) */}
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1.5">
                Visibility & Sharing
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMemoryVisibility("private")}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition cursor-pointer ${
                    memoryVisibility === "private"
                      ? "bg-[#17151C] text-white border-[#17151C] shadow-2xs"
                      : "bg-[#FAF8FC] border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                  }`}
                >
                  <Lock size={14} className={memoryVisibility === "private" ? "text-[#E8B9CD]" : "text-[#8D8792]"} />
                  <span className="text-xs font-bold">Private</span>
                  <span className="text-[9px] opacity-80 leading-tight">Personal Vault</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMemoryVisibility("friends")}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition cursor-pointer ${
                    memoryVisibility === "friends"
                      ? "bg-[#17151C] text-white border-[#17151C] shadow-2xs"
                      : "bg-[#FAF8FC] border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                  }`}
                >
                  <Users size={14} className={memoryVisibility === "friends" ? "text-[#9E96D8]" : "text-[#8D8792]"} />
                  <span className="text-xs font-bold">Friends</span>
                  <span className="text-[9px] opacity-80 leading-tight">Shared Moment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMemoryVisibility("close_friends")}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition cursor-pointer ${
                    memoryVisibility === "close_friends"
                      ? "bg-[#17151C] text-white border-[#17151C] shadow-2xs"
                      : "bg-[#FAF8FC] border-[#E8E3F0] text-[#5F5965] hover:bg-white"
                  }`}
                >
                  <Star size={14} className={memoryVisibility === "close_friends" ? "text-[#F1D2C9]" : "text-[#8D8792]"} />
                  <span className="text-xs font-bold">Close Circle</span>
                  <span className="text-[9px] opacity-80 leading-tight">Inner Circle</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!memoryTitle.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                {memoryVisibility === "private" ? "Preserve Memory 🔒" : "Share Moment ✨"}
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE HABIT
        ========================================================= */}
        {currentView === "habit" && (
          <form onSubmit={handleSubmitHabit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Habit Ritual *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Read 20 pages / Morning workout"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#17151C]">
                  Habit Icon / Emoji
                </label>
                <span className="text-xs font-medium text-[#5F5965] flex items-center gap-1">
                  Selected: <span className="text-base">{habitEmoji}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["💧", "📚", "🏃", "🧘", "💻", "🥗", "😴", "✍️", "🌱", "🎧", "☀️", "🍵", "🎯", "✨"].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setHabitEmoji(em)}
                    className={`h-9 w-9 rounded-xl text-base flex items-center justify-center transition cursor-pointer ${
                      habitEmoji === em
                        ? "bg-[#EEEAFE] border border-[#9E96D8] scale-110 shadow-2xs"
                        : "bg-[#FAF8FC] border border-[#E8E3F0] hover:bg-white"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!habitName.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Start Habit
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            CREATE READING (BOOK)
        ========================================================= */}
        {currentView === "reading" && (
          <form onSubmit={handleSubmitReading} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Book Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Deep Work"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cal Newport"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  value={bookPages}
                  onChange={(e) => setBookPages(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!bookTitle.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Add to Reading
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
