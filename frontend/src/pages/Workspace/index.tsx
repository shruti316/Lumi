import { useState, useEffect } from "react";
import {
  FileText,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  Tag,
  Clock,
  Loader2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  deadline: string;
  notes: string;
  tasks?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<"notes" | "projects">("notes");
  const [loading, setLoading] = useState(true);

  // Notes State
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteSearch, setNoteSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Note Form
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStatusFilter, setProjectStatusFilter] = useState<"All" | Project["status"]>("All");
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Project Form
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<Project["status"]>("In Progress");
  const [newProjDeadline, setNewProjDeadline] = useState("");
  const [newProjProgress, setNewProjProgress] = useState(0);

  async function loadWorkspaceData() {
    setLoading(true);
    const [notesRes, projRes] = await Promise.all([
      api.workspace.getNotes(),
      api.workspace.getProjects(),
    ]);

    if (notesRes.data?.notes) {
      setNotes(
        notesRes.data.notes.map((n: any) => ({
          ...n,
          tags: Array.isArray(n.tags) ? n.tags : [],
        }))
      );
    }

    if (projRes.data?.projects) {
      setProjects(
        projRes.data.projects.map((p: any) => ({
          ...p,
          status: (p.status === "in-progress" ? "In Progress" : p.status) || "In Progress",
          deadline: p.deadline || "Ongoing",
          progress: Number(p.progress) || 0,
          notes: p.notes || "",
          tasks: Array.isArray(p.tasks) ? p.tasks : [],
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    loadWorkspaceData();
    window.addEventListener("lumi-sync", loadWorkspaceData);
    return () => window.removeEventListener("lumi-sync", loadWorkspaceData);
  }, []);

  // Note Handlers
  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;

    const tags = newNoteTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const { data } = await api.workspace.createNote({
      title: newNoteTitle.trim() || "Untitled Note",
      content: newNoteContent.trim(),
      tags: tags.length > 0 ? tags : ["college"],
      category: "General",
    });

    if (data?.note) {
      setNotes((prev) => [
        {
          ...data.note,
          tags: Array.isArray(data.note.tags) ? data.note.tags : tags,
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "note" } }));
    }

    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteTags("");
    setShowNoteModal(false);
  }

  async function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await api.workspace.deleteNote(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "note" } }));
  }

  // Project Handlers
  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const { data } = await api.workspace.createProject({
      name: newProjName.trim(),
      description: newProjDesc.trim(),
      status: newProjStatus,
      progress: newProjProgress,
      deadline: newProjDeadline || "Ongoing",
      notes: "",
    });

    if (data?.project) {
      setProjects((prev) => [
        {
          ...data.project,
          status: (data.project.status === "in-progress" ? "In Progress" : data.project.status) || newProjStatus,
          deadline: data.project.deadline || newProjDeadline || "Ongoing",
          progress: Number(data.project.progress) || newProjProgress,
          notes: data.project.notes || "",
          tasks: Array.isArray(data.project.tasks) ? data.project.tasks : [],
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
    }

    setNewProjName("");
    setNewProjDesc("");
    setNewProjDeadline("");
    setNewProjProgress(0);
    setShowProjectModal(false);
  }

  async function handleProgressChange(proj: Project, newProgress: number) {
    const newStatus =
      newProgress >= 100
        ? "Completed"
        : proj.status === "Completed"
        ? "In Progress"
        : proj.status;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === proj.id ? { ...p, progress: newProgress, status: newStatus } : p
      )
    );

    await api.workspace.updateProject(proj.id, {
      progress: newProgress,
      status: newStatus,
    });
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
  }

  async function handleDeleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await api.workspace.deleteProject(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
  }

  // Filtered Notes
  const allNoteTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(noteSearch.toLowerCase()));

    const matchesTag = selectedTag ? (n.tags || []).includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    if (projectStatusFilter === "All") return true;
    return p.status === projectStatusFilter;
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E96D8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Knowledge & Deliverables
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Creative <span className="font-editorial-italic font-normal text-[#9E96D8]">Workspace</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Organize lecture notes, project builds, formulas & creative ideas in one calm hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === "notes") setShowNoteModal(true);
                else setShowProjectModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
            >
              <Plus size={16} />
              <span>{activeTab === "notes" ? "New Note" : "New Project"}</span>
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            NAVIGATION TABS (NOTES vs PROJECTS)
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex items-center justify-between border-b border-[#E8E3F0] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "notes"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
              }`}
            >
              <FileText size={14} />
              <span>Notes & Knowledge ({notes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "projects"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
              }`}
            >
              <FolderKanban size={14} />
              <span>Project Sprints ({projects.length})</span>
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : activeTab === "notes" ? (
          /* ═══════════════════════════════════════
              NOTES TAB CONTENT
          ═══════════════════════════════════════ */
          <div>
            {/* Search & Tag Filter */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D8792]"
                />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] placeholder:text-[#8D8792] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                />
              </div>

              {allNoteTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                      selectedTag === null
                        ? "bg-[#17151C] text-white shadow-2xs"
                        : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                    }`}
                  >
                    All
                  </button>
                  {allNoteTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                        selectedTag === tag
                          ? "bg-[#9E96D8] text-white shadow-2xs"
                          : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#EEEAFE]"
                      }`}
                    >
                      <Tag size={10} />
                      <span>#{tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredNotes.length === 0 ? (
              <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
                  <FileText size={22} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17151C]">No notes found</h3>
                <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
                  Create your first note to capture lecture formulas, ideas, and cheat sheets.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    variant="default"
                    hoverEffect
                    className="group flex flex-col justify-between p-4 bg-white border-[#E8E3F0]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif text-base font-bold text-[#17151C] line-clamp-1">
                          {note.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#8D8792] hover:text-[#D84C2C] hover:bg-[#FDECE8] transition cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="text-xs text-[#5F5965] font-normal line-clamp-5 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F7F5F8] flex flex-wrap gap-1.5">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-[#F7F5F8] border border-[#E8E3F0] px-2 py-0.5 text-[10px] font-semibold text-[#5F5965]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ═══════════════════════════════════════
              PROJECTS TAB CONTENT
          ═══════════════════════════════════════ */
          <div>
            {/* Status Filter */}
            <div className="mb-5 flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["All", "In Progress", "Planning", "Completed", "On Hold"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setProjectStatusFilter(st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    projectStatusFilter === st
                      ? "bg-[#17151C] text-white shadow-2xs"
                      : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredProjects.length === 0 ? (
              <Card variant="default" className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAFE] text-[#9E96D8]">
                  <FolderKanban size={22} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17151C]">No projects found</h3>
                <p className="mt-1 text-xs text-[#5F5965] max-w-xs">
                  Add a new coursework build, web application, or design sprint.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredProjects.map((proj) => (
                  <Card
                    key={proj.id}
                    variant="glass"
                    hoverEffect
                    className="p-5 border-[#E8E3F0] bg-white/95 transition duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            proj.status === "Completed"
                              ? "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]"
                              : proj.status === "In Progress"
                              ? "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]"
                              : "bg-[#EEEAFE] text-[#6B5BA5] border-[#DCD8F2]"
                          }`}
                        >
                          {proj.status}
                        </span>
                        <h3 className="mt-2.5 font-serif text-base font-bold text-[#17151C] tracking-tight">
                          {proj.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                        title="Delete project"
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
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEAFE]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#E8B9CD] transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2">
                      <span className="text-[10px] font-semibold text-[#8D8792]">
                        Adjust progress
                      </span>
                      <div className="flex gap-1">
                        {[25, 50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleProgressChange(proj, pct)}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                              proj.progress === pct
                                ? "bg-[#17151C] text-white"
                                : "bg-[#F7F5F8] text-[#5F5965] hover:bg-[#EEEAFE]"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
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
                placeholder="e.g. Dynamic Programming Memoization"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Content *
              </label>
              <textarea
                rows={5}
                placeholder="Write your note content here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white p-3 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. college, cs, algorithms"
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
