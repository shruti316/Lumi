import React, { useState, useEffect } from "react";
import {
  X,
  CheckSquare,
  FileText,
  FolderKanban,
  Target,
  PenLine,
  Camera,
  BookOpen,
  Flame,
} from "lucide-react";
import { addTask, type Task } from "../../lib/storage";
import {
  addNote,
  addProject,
  addGoal,
  addMemory,
  type Project,
  type Goal,
  getProjects,
  getGoals,
} from "../../lib/lifeOSStorage";
import { addDiaryEntry } from "../../lib/diaryStorage";
import { addHabit } from "../../lib/habitStorage";
import { addBook } from "../../lib/readingStorage";

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

  // Available relations
  const projects = getProjects();
  const goals = getGoals();

  // Form States
  // Task
  const [taskTitle, setTaskTitle] = useState(initialText);
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium");
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
  const [projStatus, setProjStatus] = useState<Project["status"]>("In Progress");

  // Goal
  const [goalTitle, setGoalTitle] = useState(initialText);
  const [goalDesc, setGoalDesc] = useState("");
  const [goalCategory, setGoalCategory] = useState<Goal["category"]>("Academic");
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
  const [memoryShare, setMemoryShare] = useState(false);

  // Habit
  const [habitName, setHabitName] = useState(initialText);
  const [habitEmoji, setHabitEmoji] = useState("✨");

  // Reading
  const [bookTitle, setBookTitle] = useState(initialText);
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPages, setBookPages] = useState<number>(300);

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialTemplate || "menu");
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
    }
  }, [isOpen, initialTemplate, initialText]);

  if (!isOpen) return null;

  function handleTriggerSuccess(msg: string, type: CreateTemplateType) {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
      if (onSuccess) onSuccess(type);
    }, 900);
  }

  // SUBMIT HANDLERS
  function handleSubmitTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      completed: false,
      priority: taskPriority,
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Task added to your plan!", "task");
  }

  function handleSubmitNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;

    const tags = noteTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    addNote({
      id: crypto.randomUUID(),
      title: noteTitle.trim() || "Untitled Note",
      content: noteContent.trim(),
      tags: tags.length > 0 ? tags : ["general"],
      pinned: false,
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Note saved to workspace!", "note");
  }

  function handleSubmitProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projName.trim()) return;

    addProject({
      id: crypto.randomUUID(),
      name: projName.trim(),
      description: projDesc.trim(),
      status: projStatus,
      progress: 0,
      deadline: projDeadline || "Ongoing",
      notes: "",
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Project created in workspace!", "project");
  }

  function handleSubmitGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      id: crypto.randomUUID(),
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      category: goalCategory,
      deadline: goalDeadline || "Ongoing",
      progress: 0,
      status: "In Progress",
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Goal set successfully!", "goal");
  }

  function handleSubmitJournal(e: React.FormEvent) {
    e.preventDefault();
    if (!journalTitle.trim() && !journalContent.trim()) return;

    addDiaryEntry({
      id: crypto.randomUUID(),
      title: journalTitle.trim() || "Journal Entry",
      content: journalContent.trim(),
      mood: journalMood,
      tags: [journalType],
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Journal entry penned!", "journal");
  }

  function handleSubmitMemory(e: React.FormEvent) {
    e.preventDefault();
    if (!memoryTitle.trim()) return;

    const sampleImages = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
    ];
    const finalImg = memoryImage.trim() || sampleImages[Math.floor(Math.random() * sampleImages.length)];

    addMemory({
      id: crypto.randomUUID(),
      title: memoryTitle.trim(),
      caption: memoryCaption.trim() + (memoryLocation ? ` 📍 ${memoryLocation}` : ""),
      imageUrl: finalImg,
      date: memoryDate,
      tags: memoryShare ? ["shared", "friends"] : ["personal"],
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("Memory preserved in LUMI!", "memory");
  }

  function handleSubmitHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!habitName.trim()) return;

    addHabit({
      id: crypto.randomUUID(),
      name: habitName.trim(),
      emoji: habitEmoji || "✨",
      completedDates: [],
      createdAt: new Date().toISOString(),
    });

    handleTriggerSuccess("New habit tracker activated!", "habit");
  }

  function handleSubmitReading(e: React.FormEvent) {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    addBook({
      id: crypto.randomUUID(),
      title: bookTitle.trim(),
      author: bookAuthor.trim() || "Unknown Author",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
      status: "reading",
      currentPage: 0,
      totalPages: Number(bookPages) || 300,
      rating: 0,
      whyIPickedIt: "",
      notes: "",
      favoriteQuote: "",
      createdAt: new Date().toISOString(),
    });

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
      type: "goal" as CreateTemplateType,
      title: "Goal",
      desc: "Long term milestone & target",
      icon: <Target size={20} className="text-[#9E96D8]" />,
      bg: "bg-[#EEEAFE] border-[#DDD8F2]",
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
      type: "habit" as CreateTemplateType,
      title: "Habit",
      desc: "Daily ritual to track",
      icon: <Flame size={20} className="text-[#D99BB8]" />,
      bg: "bg-[#FDF0F6] border-[#F2D8E4]",
    },
    {
      type: "reading" as CreateTemplateType,
      title: "Reading",
      desc: "Book to read & track progress",
      icon: <BookOpen size={20} className="text-[#6B9AB8]" />,
      bg: "bg-[#EEF3FA] border-[#D9E7F2]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17151C]/45 backdrop-blur-md p-4 lumi-animate-fade-up">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#E8E3F0] bg-white p-6 shadow-2xl transition-all"
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
                onClick={() => setCurrentView("menu")}
                className="text-xs font-semibold text-[#9E96D8] hover:underline cursor-pointer"
              >
                ← All Options
              </button>
            )}
          </div>
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
                  onChange={(e) => setTaskPriority(e.target.value as Task["priority"])}
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
                  onChange={(e) => setProjStatus(e.target.value as Project["status"])}
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
                  onChange={(e) => setGoalCategory(e.target.value as Goal["category"])}
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
            CREATE MEMORY
        ========================================================= */}
        {currentView === "memory" && (
          <form onSubmit={handleSubmitMemory} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Sunset over Campus Quad"
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:bg-white outline-none shadow-2xs"
                required
              />
            </div>

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
                  placeholder="e.g. Library Cafe / Kyoto"
                  value={memoryLocation}
                  onChange={(e) => setMemoryLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Image URL (Optional or uses aesthetic default)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={memoryImage}
                onChange={(e) => setMemoryImage(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-[#FAF8FC] px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
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

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="shareMemory"
                checked={memoryShare}
                onChange={(e) => setMemoryShare(e.target.checked)}
                className="rounded accent-[#17151C] cursor-pointer"
              />
              <label htmlFor="shareMemory" className="text-xs font-medium text-[#5F5965] cursor-pointer select-none">
                Share with Friends feed in LUMI
              </label>
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
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Preserve Memory
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
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Icon / Emoji
              </label>
              <div className="flex gap-2">
                {["🏃🏻‍♀️", "📖", "💧", "🧘🏻‍♀️", "✍️", "🥗", "✨"].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setHabitEmoji(em)}
                    className={`h-9 w-9 rounded-xl text-base flex items-center justify-center transition cursor-pointer ${
                      habitEmoji === em
                        ? "bg-[#EEEAFE] border border-[#DDD8F2] scale-110 shadow-2xs"
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
