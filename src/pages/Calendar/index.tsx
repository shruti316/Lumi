import { useState } from "react";
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent,
  type CalendarEvent,
} from "../../lib/lifeOSStorage";

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getCalendarEvents()
  );
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarEvent["type"]>("Exam");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvt: CalendarEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00 AM",
      createdAt: new Date().toISOString(),
    };

    addCalendarEvent(newEvt);
    setEvents(getCalendarEvents());

    setTitle("");
    setDate("");
    setTime("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteCalendarEvent(id);
    setEvents(getCalendarEvents());
  }

  const typeColors: Record<CalendarEvent["type"], { bg: string; text: string; border: string }> = {
    Exam: { bg: "bg-[#FDF0F6]", text: "text-[#9A4E70]", border: "border-[#F2D8E4]" },
    Assignment: { bg: "bg-[#EEF3FA]", text: "text-[#4A729A]", border: "border-[#D9E7F2]" },
    Project: { bg: "bg-[#FDF3EC]", text: "text-[#9A644D]", border: "border-[#F1D2C9]" },
    Class: { bg: "bg-[#EEEAFE]", text: "text-[#6B5BA5]", border: "border-[#DCD8F2]" },
    Personal: { bg: "bg-[#EEF8F4]", text: "text-[#3E7D5C]", border: "border-[#CCE5DC]" },
  };

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8D4E8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Schedule & Milestones
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Calendar & <span className="font-editorial-italic font-normal text-[#9E96D8]">Schedule</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              All your key deadlines, exam dates, coursework reviews & events in one timeline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 w-fit cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>

        {/* Event Creation Form */}
        {showForm && (
          <Card variant="blue" hoverEffect className="mb-7 p-6 border-[#D9E7F2] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[#17151C] mb-4">
              Add Calendar Event / Deadline
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title (e.g. DAA Midterm Exam)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2.5 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                required
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Class">Class</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17151C] mb-1">
                    Date
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
                    placeholder="e.g. 10:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                  />
                </div>
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
                  Save Event
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Event List */}
        {events.length === 0 ? (
          <Card variant="blue" className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#4A729A] text-2xl shadow-2xs border border-white">
              📅
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#17151C]">
              No calendar events scheduled
            </h3>
            <p className="mt-1 text-xs font-normal text-[#5F5965]">
              Click "Add Event" to track midterm dates, project deadlines, or special events.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => {
              const currentTypeStyle = typeColors[evt.type] || typeColors.Personal;

              return (
                <Card
                  key={evt.id}
                  variant="glass"
                  hoverEffect
                  className="p-4 border-[#E8E3F0] bg-white/95 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EEEAFE] to-[#EEF3FA] text-[#17151C] font-bold text-xs border border-[#E8E3F0] shadow-2xs">
                      <CalendarIcon size={16} className="text-[#9E96D8]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-sm text-[#17151C]">{evt.title}</h3>
                        <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${currentTypeStyle.bg} ${currentTypeStyle.text} ${currentTypeStyle.border}`}>
                          {evt.type}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-xs font-medium text-[#8D8792]">
                        <span>{evt.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={11} className="text-[#9E96D8]" /> {evt.time}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(evt.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FDF0F6] transition cursor-pointer"
                    title="Delete event"
                  >
                    <Trash2 size={14} />
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
