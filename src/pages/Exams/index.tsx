import { useState } from "react";
import { Plus, Trash2, Clock, GraduationCap } from "lucide-react";
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
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8D4E8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Academic Milestones
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Exams & <span className="font-editorial-italic font-normal text-[#9E96D8]">Tests</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Midterms, finals, quizzes & syllabus preparation tracker.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Exam</span>
          </button>
        </div>

        {/* Creation Form */}
        {showForm && (
          <Card variant="blue" hoverEffect className="mb-7 p-6 border-[#D9E7F2] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#17151C] mb-4">
              Add an Exam / Test
            </h3>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Exam / Test Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DAA Midterm Exam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Subject / Course *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Algorithms & Data Structures"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Syllabus & Key Topics
                </label>
                <textarea
                  rows={2}
                  placeholder="Key topics: Dynamic programming, Graphs, Greedy algorithms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white p-3 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#17151C] mb-1">
                  <span>Preparation Progress</span>
                  <span className="text-[#9E96D8] font-bold">{preparationProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preparationProgress}
                  onChange={(e) => setPreparationProgress(Number(e.target.value))}
                  className="w-full accent-[#17151C] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-white/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] cursor-pointer"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="mb-6 grid gap-3.5 sm:grid-cols-2">
          <Card variant="blue" hoverEffect className="p-4.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Upcoming Exams
            </p>
            <p className="mt-1 text-2xl font-bold text-[#17151C]">
              {exams.length}
            </p>
          </Card>
          <Card variant="lavender" hoverEffect className="p-4.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Avg Preparation Rate
            </p>
            <p className="mt-1 text-2xl font-bold text-[#17151C]">
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
          <Card variant="lavender" className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs border border-white">
              <GraduationCap size={24} className="text-[#9E96D8]" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#17151C]">
              No upcoming exams scheduled
            </h3>
            <p className="mt-1 text-xs font-normal text-[#5F5965]">
              Click "Add Exam" to track test dates, syllabus, and revision progress.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => (
              <Card
                key={exam.id}
                variant="glass"
                hoverEffect
                className="p-5 border-[#E8E3F0] bg-white/95"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md bg-[#EEEAFE] border border-[#DDD8F2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6B5BA5]">
                      {exam.subject}
                    </span>
                    <h3 className="mt-2 font-serif text-base font-bold text-[#17151C]">
                      {exam.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(exam.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                    title="Delete Exam"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-xs font-medium text-[#8D8792]">
                  <span>📅 {exam.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} className="text-[#9E96D8]" /> {exam.time}</span>
                </div>

                {exam.notes && (
                  <p className="mt-2.5 text-xs text-[#5F5965] bg-[#F7F5F8] border border-[#E8E3F0] rounded-xl p-2.5 line-clamp-2">
                    {exam.notes}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#E8E3F0]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#17151C] mb-1.5">
                    <span>Preparation Level</span>
                    <span className="text-[#9E96D8] font-bold">{exam.preparationProgress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEAFE]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#B8D4E8] transition-all duration-500"
                      style={{ width: `${exam.preparationProgress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
