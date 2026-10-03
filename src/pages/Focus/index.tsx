import { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  getFocusSessions,
  addFocusSession,
  type FocusSession,
} from "../../lib/lifeOSStorage";

export default function Focus() {
  const [sessions, setSessions] = useState<FocusSession[]>(() =>
    getFocusSessions()
  );
  const [duration, setDuration] = useState(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSecondsLeft(duration * 60);
    setIsActive(false);
  }, [duration]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      // Log session
      const newSession: FocusSession = {
        id: crypto.randomUUID(),
        durationMinutes: duration,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };
      addFocusSession(newSession);
      setSessions(getFocusSessions());
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, duration]);

  function formatDisplay(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function handleReset() {
    setIsActive(false);
    setSecondsLeft(duration * 60);
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMinutes = sessions
    .filter((s) => s.date === todayStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8 text-[#16131F]">
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#806C79]">
          Life OS Space
        </p>
        <h1 className="font-caveat text-4xl font-bold text-[#16131F]">
          Study & Focus Timer ⏱️
        </h1>
        <p className="font-caveat text-xl text-[#806C79]">
          Pomodoro sessions, deep focus tracking & session history.
        </p>
      </div>

      {/* Main Timer Card */}
      <Card className="mx-auto max-w-md !bg-[#F2DFD0] !border-[#E4CEBC] p-8 text-center glow-peach shadow-lg mb-8">
        {/* Duration Selector */}
        <div className="mb-6 flex justify-center gap-2">
          {[15, 25, 45, 60].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDuration(m)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                duration === m
                  ? "bg-[#312A44] text-white shadow-2xs"
                  : "bg-white/70 text-[#312A44] hover:bg-white"
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        {/* Big Countdown Display */}
        <div className="my-6">
          <span className="font-manrope text-6xl font-extrabold tracking-tight text-[#16131F]">
            {formatDisplay(secondsLeft)}
          </span>
          <p className="mt-2 text-xs font-semibold text-[#806C79]">
            {isActive ? "Flow session in progress... stay focused!" : "Ready to focus?"}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsActive((prev) => !prev)}
            className="flex h-12 w-32 items-center justify-center gap-2 rounded-2xl bg-[#312A44] text-xs font-bold text-white shadow-md transition hover:bg-[#211C2B] active:scale-95"
          >
            {isActive ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            <span>{isActive ? "Pause" : "Start"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#312A44] shadow-2xs hover:bg-white active:scale-95 transition"
            title="Reset timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </Card>

      {/* Focus Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="!bg-[#F2DFD0] !border-[#E4CEBC] p-4 glow-peach flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#806C79] shadow-2xs">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#806C79]">
              Today's Focus Time
            </p>
            <p className="text-2xl font-extrabold text-[#312A44]">
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </p>
          </div>
        </Card>

        <Card className="!bg-[#DCE8E0] !border-[#C7DDD0] p-4 glow-green flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4A6E53] shadow-2xs">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A6E53]">
              Completed Sessions
            </p>
            <p className="text-2xl font-extrabold text-[#3A5642]">
              {sessions.filter((s) => s.date === todayStr).length} sessions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
