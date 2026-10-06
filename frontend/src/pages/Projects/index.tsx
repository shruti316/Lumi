import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Sparkles, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../lib/api";

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

const QUICK_STATUS_LIST: { status: Project["status"]; label: string; desc: string; badgeColor: string }[] = [
  {
    status: "Planning",
    label: "Planning",
    desc: "Brainstorming, roadmapping & architecture",
    badgeColor: "bg-[#EEEAFE] text-[#6B5BA5] border-[#DCD8F2]",
  },
  {
    status: "In Progress",
    label: "In Progress",
    desc: "Active sprints, development & coursework",
    badgeColor: "bg-[#EEF3FA] text-[#4A729A] border-[#D9E7F2]",
  },
  {
    status: "Completed",
    label: "Completed",
    desc: "Shipped builds, assignments & past works",
    badgeColor: "bg-[#EEF8F4] text-[#3E7D5C] border-[#CCE5DC]",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | Project["status"]>("All");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("In Progress");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  async function fetchProjects() {
    setLoading(true);
    const { data } = await api.workspace.getProjects();
    if (data?.projects) {
      setProjects(
        data.projects.map((p: any) => ({
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
    fetchProjects();
    const handleSync = () => {
      fetchProjects();
    };
    window.addEventListener("lumi-sync", handleSync);
    return () => window.removeEventListener("lumi-sync", handleSync);
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const { data } = await api.workspace.createProject({
      name: name.trim(),
      description: description.trim(),
      status,
      progress,
      deadline: deadline || "Ongoing",
      notes: notes.trim(),
    });

    if (data?.project) {
      setProjects((prev) => [
        {
          ...data.project,
          status: (data.project.status === "in-progress" ? "In Progress" : data.project.status) || status,
          deadline: data.project.deadline || deadline || "Ongoing",
          progress: Number(data.project.progress) || progress,
          notes: data.project.notes || notes,
          tasks: Array.isArray(data.project.tasks) ? data.project.tasks : [],
        },
        ...prev,
      ]);
      window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
    }

    setName("");
    setDescription("");
    setProgress(0);
    setDeadline("");
    setNotes("");
    setShowModal(false);
  }

  function handleQuickStart(st: Project["status"]) {
    setStatus(st);
    setShowModal(true);
  }

  async function handleProgressChange(proj: Project, newProgress: number) {
    const newStatus = newProgress >= 100 ? "Completed" : proj.status === "Completed" ? "In Progress" : proj.status;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, progress: newProgress, status: newStatus } : p))
    );

    await api.workspace.updateProject(proj.id, {
      progress: newProgress,
      status: newStatus,
    });
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
  }

  async function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await api.workspace.deleteProject(id);
    window.dispatchEvent(new CustomEvent("lumi-sync", { detail: { type: "project" } }));
  }

  const activeCount = projects.filter((p) => p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "All") return true;
    return p.status === statusFilter;
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8D4B9]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Portfolio & Sprints
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Creative <span className="font-editorial-italic font-normal text-[#9E96D8]">Projects</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Track your coursework builds, software sprints & long-term deliverables.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR
        ═══════════════════════════════════════ */}
        {projects.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            <Card variant="peach" hoverEffect className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Total Builds
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {projects.length}
              </p>
            </Card>
            <Card variant="blue" hoverEffect className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A729A]">
                In Progress
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {activeCount}
              </p>
            </Card>
            <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
                Completed
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-1">
                {completedCount}
              </p>
            </Card>
          </div>
        )}

        {/* Status Tabs Filter */}
        {projects.length > 0 && (
          <div className="mb-5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {(["All", "In Progress", "Planning", "Completed", "On Hold"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#17151C] text-white shadow-2xs"
                    : "bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#F7F5F8]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            PROJECT LIST / EMPTY STATE
        ═══════════════════════════════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#9E96D8]" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="space-y-6">
            <Card variant="peach" className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
                🚀
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#17151C]">
                No projects underway
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#5F5965] leading-relaxed">
                Add an assignment, coding build, or creative idea to track your sprint deliverables.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17151C] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#2D263B] cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Project</span>
              </button>
            </Card>

            <div>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Sparkles size={14} className="text-[#9E96D8]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D8792]">
                  Quick Start by Status
                </span>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {QUICK_STATUS_LIST.map((item) => (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() => handleQuickStart(item.status)}
                    className="flex flex-col items-start rounded-2xl border border-[#E8E3F0] bg-white/90 p-4 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#EEEAFE] hover:border-[#DDD8F2] cursor-pointer"
                  >
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${item.badgeColor}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#5F5965] leading-relaxed">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
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
                    onClick={() => handleDelete(proj.id)}
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
                    Quick adjust progress
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

        {/* ═══════════════════════════════════════
            NEW PROJECT MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Project["status"])
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
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#17151C] mb-1">
                <span>Current Progress</span>
                <span className="text-[#9E96D8] font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#17151C] cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
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
