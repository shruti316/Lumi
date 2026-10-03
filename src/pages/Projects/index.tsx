import { useState } from "react";
import { Plus, Trash2, Clock, Sparkles } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  getProjects,
  addProject,
  deleteProject,
  updateProject,
  type Project,
} from "../../lib/lifeOSStorage";

const QUICK_STATUS_LIST: { status: Project["status"]; label: string; desc: string; badgeColor: string }[] = [
  {
    status: "Planning",
    label: "Planning",
    desc: "Brainstorming, roadmapping & architecture",
    badgeColor: "bg-[#eee9f8] text-[#7564af] border-[#dcd5ed]",
  },
  {
    status: "In Progress",
    label: "In Progress",
    desc: "Active sprints, development & coursework",
    badgeColor: "bg-[#e2f1f6] text-[#57839d] border-[#c8dfeb]",
  },
  {
    status: "Completed",
    label: "Completed",
    desc: "Shipped builds, assignments & past works",
    badgeColor: "bg-[#deeee0] text-[#5e8668] border-[#c6dccc]",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | Project["status"]>("All");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("In Progress");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");

  function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      status,
      progress,
      deadline: deadline || "Ongoing",
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    addProject(newProj);
    setProjects(getProjects());

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

  function handleProgressChange(proj: Project, newProgress: number) {
    const updated: Project = {
      ...proj,
      progress: newProgress,
      status: newProgress >= 100 ? "Completed" : proj.status === "Completed" ? "In Progress" : proj.status,
    };
    updateProject(updated);
    setProjects(getProjects());
  }

  function handleDelete(id: string) {
    deleteProject(id);
    setProjects(getProjects());
  }

  const activeCount = projects.filter((p) => p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "All") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#57839d]">
              Life OS Workspace 🧩
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#364750] sm:text-5xl">
              Projects
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              Things I'm building • College labs, side projects & creative builds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#e2f1f6] border border-[#c8dfeb] px-4 py-2.5 text-xs font-bold text-[#364750] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#d4eaf1] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY METRICS BAR (Compact)
        ═══════════════════════════════════════ */}
        {projects.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Card className="!bg-[#e2f1f6] !border-[#c8dfeb] p-3.5 glow-blue">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#57839d]">
                Total Projects
              </p>
              <p className="text-2xl font-extrabold text-[#364750] mt-0.5">
                {projects.length}
              </p>
            </Card>
            <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-3.5 glow-peach">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ae6e42]">
                In Progress
              </p>
              <p className="text-2xl font-extrabold text-[#493b33] mt-0.5">
                {activeCount}
              </p>
            </Card>
            <Card className="!bg-[#deeee0] !border-[#c6dccc] p-3.5 glow-green col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e8668]">
                Completed
              </p>
              <p className="text-2xl font-extrabold text-[#304639] mt-0.5">
                {completedCount}
              </p>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PROJECTS LIST / COMPACT EMPTY STATE
        ═══════════════════════════════════════ */}
        {projects.length === 0 ? (
          <div className="space-y-6">
            {/* Compact Useful Empty Card */}
            <Card className="!bg-[#e2f1f6] !border-[#c8dfeb] p-7 text-center glow-blue">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
                🧩
              </div>
              <h3 className="font-caveat text-3xl font-bold text-[#364750]">
                Nothing in progress yet
              </h3>
              <p className="mt-1 text-xs max-w-md mx-auto font-medium text-[#766d78] leading-relaxed">
                Start something you're excited to build. Track deliverables, codebases, assignments, and milestones.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#57839d] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#466a7f]"
              >
                <Plus size={15} />
                <span>Create Project</span>
              </button>
            </Card>

            {/* Quick Status Shortcuts */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Sparkles size={14} className="text-[#57839d]" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#57839d]">
                  Quick Status Framework
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUICK_STATUS_LIST.map((qs) => (
                  <button
                    key={qs.status}
                    type="button"
                    onClick={() => handleQuickStart(qs.status)}
                    className="flex flex-col items-start rounded-2xl border border-[#efe8e1] bg-white/90 p-4 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#e2f1f6] hover:border-[#c8dfeb]"
                  >
                    <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-2 ${qs.badgeColor}`}>
                      {qs.label}
                    </span>
                    <span className="text-xs font-bold text-[#403842]">{qs.label} Stage</span>
                    <span className="mt-1 text-[10px] text-[#766d78] leading-relaxed">{qs.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="mb-4 flex flex-wrap gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 p-1 w-fit shadow-2xs">
              {(["All", "In Progress", "Planning", "Completed", "On Hold"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === st
                        ? "bg-[#e2f1f6] text-[#364750] shadow-2xs"
                        : "text-[#766d78] hover:text-[#403842]"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredProjects.map((proj) => (
                <Card
                  key={proj.id}
                  className="!bg-white/90 !border-[#efe8e1] p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          proj.status === "In Progress"
                            ? "bg-[#e2f1f6] text-[#57839d] border-[#c8dfeb]"
                            : proj.status === "Completed"
                            ? "bg-[#deeee0] text-[#5e8668] border-[#c6dccc]"
                            : proj.status === "Planning"
                            ? "bg-[#eee9f8] text-[#7564af] border-[#dcd5ed]"
                            : "bg-[#f7e0cc] text-[#ae6e42] border-[#edcfb5]"
                        }`}
                      >
                        {proj.status}
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-[#403842]">
                        {proj.name}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#918793] hover:text-red-500 hover:bg-red-50 transition"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {proj.description && (
                    <p className="mt-2 text-xs font-medium text-[#766d78] line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}

                  <div className="mt-4 pt-2 border-t border-[#efe8e1]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#403842] mb-1">
                      <span className="flex items-center gap-1 text-[11px] text-[#766d78]">
                        <Clock size={12} /> {proj.deadline}
                      </span>
                      <span className="text-[#57839d]">{proj.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#efe8e1]">
                        <div
                          className="h-full rounded-full bg-[#57839d] transition-all duration-500"
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
                        className="w-20 accent-[#57839d] cursor-pointer"
                        title="Adjust progress"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW PROJECT MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Project 🧩"
          subtitle="Organize deadlines, assignments & creative builds."
        >
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. LUMI Life OS Web Application"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Project["status"])
                  }
                  className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2.5 text-xs font-bold text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Short Description / Deliverables
              </label>
              <textarea
                rows={2}
                placeholder="Overview of project deliverables, stack, or milestones..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#c8dfeb] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#57839d] focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#403842] mb-1">
                <span>Current Progress</span>
                <span className="text-[#57839d]">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#57839d] cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-xl bg-[#57839d] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#466a7f] disabled:opacity-50"
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
