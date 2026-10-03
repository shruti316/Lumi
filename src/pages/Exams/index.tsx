import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getExams,
  addExam,
  deleteExam,
  type Exam,
} from "../../lib/lifeOSStorage";

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>(() => getExams());
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [preparationProgress, setPreparationProgress] = useState(50);
  const [notes, setNotes] = useState("");

  function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;

    const newExam: Exam = {
      id: crypto.randomUUID(),
      name: name.trim(),
      subject: subject.trim(),
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00 AM",
      preparationProgress,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    addExam(newExam);
    setExams(getExams());

    setName("");
    setSubject("");
    setDate("");
    setTime("");
    setPreparationProgress(50);
    setNotes("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteExam(id);
    setExams(getExams());
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8 text-[#16131F]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#4F7386]">
            Life OS Space
          </p>
          <h1 className="font-caveat text-4xl font-bold text-[#16131F]">
            Exams & Tests 📚
          </h1>
          <p className="font-caveat text-xl text-[#806C79]">
            Midterms, finals, quizzes & study preparation progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-[#DDEAF0] border border-[#C5DAE3] px-4 py-2.5 text-xs font-bold text-[#312A44] shadow-2xs transition hover:bg-[#CDE0E9] active:scale-95 w-fit"
        >
          <Plus size={16} />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Creation Modal */}
      {showForm && (
        <Card className="mb-6 !bg-[#DDEAF0] !border-[#C5DAE3] p-5 shadow-md">
          <h3 className="font-caveat text-2xl font-bold text-[#16131F] mb-3">
            Add an Exam / Test
          </h3>
          <form onSubmit={handleCreateExam} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Exam / Test Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. DAA Midterm Exam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#C5DAE3] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Subject / Course
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms & Data Structures"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#C5DAE3] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F]"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#C5DAE3] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 12:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#C5DAE3] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Syllabus & Notes
              </label>
              <textarea
                rows={2}
                placeholder="Key topics: Dynamic programming, Graphs, Greedy algorithms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#C5DAE3] bg-white px-3.5 py-2 text-xs font-medium text-[#16131F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#16131F] mb-1">
                <span>Preparation Progress</span>
                <span>{preparationProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preparationProgress}
                onChange={(e) => setPreparationProgress(Number(e.target.value))}
                className="w-full accent-[#4F7386]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#806C79] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#211C2B]"
              >
                Save Exam
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="!bg-[#DDEAF0] !border-[#C5DAE3] p-4 glow-blue">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4F7386]">
            Upcoming Exams
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#312A44]">
            {exams.length}
          </p>
        </Card>
        <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-4 glow-lavender">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4A3F4B]">
            Avg Preparation
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#312A44]">
            {exams.length > 0
              ? Math.round(
                  exams.reduce((acc, e) => acc + e.preparationProgress, 0) /
                    exams.length
                )
              : 0}
            %
          </p>
        </Card>
      </div>

      {/* Exam List */}
      {exams.length === 0 ? (
        <Card className="!bg-[#DDEAF0] !border-[#C5DAE3] p-8 text-center glow-blue">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-2xs">
            📚
          </div>
          <h3 className="font-caveat text-2xl font-bold text-[#16131F]">
            No upcoming exams scheduled
          </h3>
          <p className="mt-1 text-xs font-medium text-[#806C79]">
            Click "Add Exam" to track test dates, syllabus, and study progress.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="!bg-[#DDEAF0] !border-[#C5DAE3] p-5 glow-blue transition hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-white/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4F7386]">
                    {exam.subject}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[#16131F]">
                    {exam.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(exam.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 text-[#806C79] hover:bg-white hover:text-rose-500 transition"
                  title="Delete Exam"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs font-medium text-[#806C79]">
                <span>📅 {exam.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {exam.time}</span>
              </div>

              {exam.notes && (
                <p className="mt-2.5 text-xs text-[#4F7386] bg-white/60 rounded-xl p-2.5 line-clamp-2">
                  {exam.notes}
                </p>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#16131F] mb-1">
                  <span>Preparation</span>
                  <span>{exam.preparationProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-[#4F7386] transition-all duration-500"
                    style={{ width: `${exam.preparationProgress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
