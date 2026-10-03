import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#57839d]">
            Life OS Space
          </p>
          <h1 className="font-caveat text-4xl font-bold text-[#403842]">
            Calendar & Schedule 📅
          </h1>
          <p className="font-caveat text-xl text-[#766d78]">
            All your deadlines, exams & events in one view.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-[#e2f1f6] border border-[#c8dfeb] px-4 py-2.5 text-xs font-bold text-[#57839d] shadow-2xs transition hover:bg-[#d8ecf4] active:scale-95 w-fit"
        >
          <Plus size={16} />
          <span>Add Event</span>
        </button>
      </div>

      {/* Event Creation Form */}
      {showForm && (
        <Card className="mb-6 !bg-[#e2f1f6] !border-[#c8dfeb] p-5 shadow-md">
          <h3 className="font-caveat text-2xl font-bold text-[#364750] mb-3">
            Add Calendar Event / Deadline
          </h3>
          <form onSubmit={handleCreateEvent} className="space-y-3">
            <input
              type="text"
              placeholder="Event Title (e.g. DAA Midterm Exam)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#c8dfeb] bg-white px-3.5 py-2 text-xs font-medium text-[#403842]"
              required
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-[#364750] mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
                  className="w-full rounded-xl border border-[#c8dfeb] bg-white px-3.5 py-2 text-xs font-medium text-[#403842]"
                >
                  <option value="Exam">Exam</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Class">Class</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#364750] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#c8dfeb] bg-white px-3.5 py-2 text-xs font-medium text-[#403842]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#364750] mb-1">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[#c8dfeb] bg-white px-3.5 py-2 text-xs font-medium text-[#403842]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#57839d] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#487188]"
              >
                Save Event
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Event List */}
      {events.length === 0 ? (
        <Card className="!bg-[#e2f1f6] !border-[#c8dfeb] p-8 text-center glow-blue">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-2xs">
            📅
          </div>
          <h3 className="font-caveat text-2xl font-bold text-[#364750]">
            No calendar events scheduled
          </h3>
          <p className="mt-1 text-xs font-medium text-[#766d78]">
            Click "Add Event" to track midterm dates, project deadlines, or classes.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((evt) => (
            <Card
              key={evt.id}
              className="!bg-[#e2f1f6] !border-[#c8dfeb] p-4 glow-blue flex items-center justify-between gap-4 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#57839d] font-bold text-xs shadow-2xs">
                  {evt.type[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#364750]">{evt.title}</h3>
                    <span className="rounded-md bg-white/80 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#57839d]">
                      {evt.type}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-[#766d78]">
                    <span>📅 {evt.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {evt.time}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(evt.id)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 text-[#918793] hover:bg-white hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
