import { useState } from "react";
import {
  FileText,
  FolderKanban,
  Plus,
  Search,
  Pin,
  Trash2,
  Tag,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  type Note,
  type Project,
} from "../../lib/lifeOSStorage";

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<"notes" | "projects">("notes");

  // Notes State
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [notesFilter, setNotesFilter] = useState<"all" | "pinned" | "recent">("all");
  const [noteSearch, setNoteSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Note Form
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [projectStatusFilter, setProjectStatusFilter] = useState<"All" | Project["status"]>("All");
  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Project Form
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<Project["status"]>("In Progress");
  const [newProjDeadline, setNewProjDeadline] = useState("");
  const [newProjProgress, setNewProjProgress] = useState(0);

  // Note Handlers
  function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;

    const tags = newNoteTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    addNote({
      id: crypto.randomUUID(),
      title: newNoteTitle.trim() || "Untitled Note",
      content: newNoteContent.trim(),
      tags: tags.length > 0 ? tags : ["college"],
      pinned: false,
      createdAt: new Date().toISOString(),
    });

    setNotes(getNotes());
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteTags("");
    setShowNoteModal(false);
  }

  function handleTogglePin(note: Note) {
    const updated = { ...note, pinned: !note.pinned };
    updateNote(updated);
    setNotes(getNotes());
  }

  function handleDeleteNote(id: string) {
    deleteNote(id);
    setNotes(getNotes());
  }

  // Project Handlers
  function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjName.trim()) return;

    addProject({
      id: crypto.randomUUID(),
      name: newProjName.trim(),
      description: newProjDesc.trim(),
      status: newProjStatus,
      progress: newProjProgress,
      deadline: newProjDeadline || "Ongoing",
      notes: "",
      createdAt: new Date().toISOString(),
    });

    setProjects(getProjects());
    setNewProjName("");
    setNewProjDesc("");
    setNewProjDeadline("");
    setNewProjProgress(0);
    setShowProjectModal(false);
  }

  function handleProgressChange(proj: Project, newProgress: number) {
    const updated: Project = {
      ...proj,
      progress: newProgress,
      status: newProgress >= 100 ? "Completed" : proj.status === "Completed" ? "In Progress" : proj.status,
    };
    updateProject(updated);
    setProjects(getProjects());
  }

  function handleDeleteProject(id: string) {
    deleteProject(id);
    setProjects(getProjects());
  }

  // Metrics
  const pinnedNotesCount = notes.filter((n) => n.pinned).length;
  const activeProjectsCount = projects.filter((p) => p.status === "In Progress").length;
  const completedProjectsCount = projects.filter((p) => p.status === "Completed").length;

  // Filtered Notes
  const allNoteTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(noteSearch.toLowerCase()));

    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    const matchesFilter =
      notesFilter === "pinned" ? n.pinned : true;

    return matchesSearch && matchesTag && matchesFilter;
  });

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesStatus =
      projectStatusFilter === "All" || p.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#CCE5DC]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Creative Studio & Knowledge Vault
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Workspace & <span className="font-editorial-italic font-normal text-[#9E96D8]">Studio</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Quick lecture notes, conceptual knowledge, and active project builds connected in one hub.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "notes" ? (
              <button
                type="button"
                onClick={() => setShowNoteModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
              >
                <Plus size={16} />
                <span>New Note</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
              >
                <Plus size={16} />
                <span>New Project</span>
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Total Notes
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {notes.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              {pinnedNotesCount} pinned references
            </p>
          </Card>

          <Card variant="blue" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Active Projects
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {activeProjectsCount}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              In development sprint
            </p>
          </Card>

          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Completed Projects
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {completedProjectsCount}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#4A7D63]">
              Shipped builds
            </p>
          </Card>

          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Workspace Knowledge
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Sparkles size={18} className="text-[#D99BB8]" />
              Synthesized
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Connected life system
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            PRIMARY VIEW SELECTOR TABS
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "notes"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <FileText size={15} className={activeTab === "notes" ? "text-[#9E96D8]" : ""} />
              <span>Notes & Knowledge</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {notes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "projects"
                  ? "bg-[#EEEAFE] text-[#17151C] border border-[#DDD8F2] shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              <FolderKanban size={15} className={activeTab === "projects" ? "text-[#9E96D8]" : ""} />
              <span>Projects & Studio</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#6B5BA5] border border-[#DDD8F2]">
                {projects.length}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            VIEW 1: NOTES & KNOWLEDGE
        ========================================================= */}
        {activeTab === "notes" && (
          <div>
            {/* Filter and Search Row */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setNotesFilter("all");
                    setSelectedTag(null);
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    notesFilter === "all" && !selectedTag
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  All Notes ({notes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotesFilter("pinned")}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    notesFilter === "pinned"
                      ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                      : "text-[#5F5965] hover:text-[#17151C]"
                  }`}
                >
                  <Pin size={12} className={notesFilter === "pinned" ? "text-[#9E96D8]" : ""} />
                  <span>Pinned ({pinnedNotesCount})</span>
                </button>
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
                <input
                  type="text"
                  placeholder="Search notes or tags..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8]"
                />
              </div>
            </div>

            {/* Tag Pills */}
            {allNoteTags.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D8792] mr-1 flex items-center gap-1">
                  <Tag size={11} /> Filter:
                </span>
                {allNoteTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      selectedTag === t
                        ? "bg-[#EEEAFE] border-[#DDD8F2] text-[#17151C] shadow-2xs"
                        : "bg-white border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <Card variant="blue" className="p-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                  📝
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                  No notes found
                </h3>
                <p className="mt-1 text-xs max-w-sm mx-auto font-medium text-[#5F5965]">
                  Capture study notes, cheatsheets, formulas, and ideas in your workspace.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create Note</span>
                </button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    variant="glass"
                    hoverEffect
                    className="group relative flex flex-col justify-between p-5 border-[#E8E3F0] bg-white/95"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h3 className="font-serif font-bold text-base text-[#17151C] leading-snug truncate">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTogglePin(note)}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition cursor-pointer ${
                              note.pinned
                                ? "bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2] shadow-2xs"
                                : "bg-[#F7F5F8] text-[#8D8792] hover:text-[#17151C]"
                            }`}
                            title={note.pinned ? "Unpin" : "Pin note"}
                          >
                            <Pin size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                            title="Delete note"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-normal text-[#5F5965] line-clamp-4 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E3F0] flex flex-wrap items-center justify-between gap-1 text-[10px]">
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2 py-0.5 font-semibold text-[#5F5965]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="font-medium text-[#8D8792]">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 2: PROJECTS & BUILDS
        ========================================================= */}
        {activeTab === "projects" && (
          <div>
            {/* Project Filter & Search Row */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
                {(["All", "In Progress", "Planning", "Completed", "On Hold"] as const).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setProjectStatusFilter(st)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        projectStatusFilter === st
                          ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                          : "text-[#5F5965] hover:text-[#17151C]"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8]"
                />
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <Card variant="peach" className="p-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                  🧩
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#17151C]">
                  No projects in this category
                </h3>
                <p className="mt-1 text-xs max-w-sm mx-auto font-medium text-[#5F5965]">
                  Start a new project build, manage deliverables, research notes, and deadlines.
                </p>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create Project</span>
                </button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredProjects.map((proj) => (
                  <Card
                    key={proj.id}
                    variant="glass"
                    hoverEffect
                    className="p-5 border-[#E8E3F0] bg-white/95"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            proj.status === "In Progress"
                              ? "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]"
                              : proj.status === "Completed"
                              ? "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]"
                              : proj.status === "Planning"
                              ? "bg-[#EEEAFE] text-[#6B5BA5] border-[#DCD8F2]"
                              : "bg-[#FDF3EC] text-[#9A644D] border-[#F1D2C9]"
                          }`}
                        >
                          {proj.status}
                        </span>
                        <h3 className="mt-2.5 font-serif text-base font-bold tracking-tight text-[#17151C]">
                          {proj.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {proj.description && (
                      <p className="mt-2 text-xs font-normal text-[#5F5965] line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-[#E8E3F0]">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#17151C] mb-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-[#8D8792]">
                          <Clock size={12} className="text-[#9E96D8]" /> {proj.deadline}
                        </span>
                        <span className="text-[#9E96D8] font-bold">{proj.progress}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEEAFE]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#B8D4E8] transition-all duration-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={proj.progress}
                          onChange={(e) =>
                            handleProgressChange(proj, Number(e.target.value))
                          }
                          className="w-20 accent-[#17151C] cursor-pointer"
                          title="Adjust progress"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW NOTE MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          title="Create New Note"
          subtitle="Capture knowledge, lecture summaries, and formulas."
        >
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Title *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Dynamic Programming Memoization Notes"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Note Content *
              </label>
              <textarea
                rows={5}
                placeholder="Write your notes, formulas, or summaries here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none leading-relaxed shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. algorithms, cs, midterm"
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newNoteTitle.trim() && !newNoteContent.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </form>
        </Modal>

        {/* ═══════════════════════════════════════
            NEW PROJECT MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          title="Create New Project"
          subtitle="Organize deadlines, assignments, and creative builds."
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. LUMI Life OS Web Application"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Status
                </label>
                <select
                  value={newProjStatus}
                  onChange={(e) =>
                    setNewProjStatus(e.target.value as Project["status"])
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
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
                  value={newProjDeadline}
                  onChange={(e) => setNewProjDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Short Description / Deliverables
              </label>
              <textarea
                rows={2}
                placeholder="Overview of project deliverables, stack, or milestones..."
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#17151C] mb-1">
                <span>Initial Progress</span>
                <span className="text-[#9E96D8] font-bold">{newProjProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={newProjProgress}
                onChange={(e) => setNewProjProgress(Number(e.target.value))}
                className="w-full accent-[#17151C] cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newProjName.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
