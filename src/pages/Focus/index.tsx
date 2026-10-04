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
  const [duration, setDuration] = useState(25);
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
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8B3E8]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
              Deep Work & Focus
            </p>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
            Study & <span className="font-editorial-italic font-normal text-[#9E96D8]">Focus Studio</span>
          </h1>
          <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
            Pomodoro sprints, uninterrupted deep focus & study session history.
          </p>
        </div>

        {/* Main Timer Card */}
        <Card
          variant="mixed"
          hoverEffect
          className="mx-auto max-w-md p-8 text-center border-[#DDD8F2] shadow-sm mb-8"
        >
          {/* Duration Selector */}
          <div className="mb-6 flex justify-center gap-2">
            {[15, 25, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDuration(m)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  duration === m
                    ? "bg-[#17151C] text-white shadow-2xs"
                    : "bg-white/80 text-[#5F5965] border border-[#E8E3F0] hover:bg-white hover:text-[#17151C]"
                }`}
              >
                {m} min
              </button>
            ))}
          </div>

          {/* Big Countdown Display */}
          <div className="my-6">
            <span className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-[#17151C]">
              {formatDisplay(secondsLeft)}
            </span>
            <p className="mt-2 text-xs font-medium text-[#5F5965]">
              {isActive ? "Deep flow in progress... stay focused." : "Ready to start your focus sprint?"}
            </p>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className="flex h-12 w-36 items-center justify-center gap-2 rounded-xl bg-[#17151C] text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] active:scale-95 cursor-pointer"
            >
              {isActive ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
              <span>{isActive ? "Pause Sprint" : "Start Sprint"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E8E3F0] text-[#5F5965] shadow-2xs hover:bg-[#EEEAFE] hover:text-[#17151C] active:scale-95 transition cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </Card>

        {/* Focus Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="peach" hoverEffect className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#D99BB8] shadow-2xs border border-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Today's Focus Time
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
              </p>
            </div>
          </Card>

          <Card variant="default" hoverEffect className="p-5 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#4A7D63] shadow-2xs border border-[#CCE5DC]">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
                Completed Sessions
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {sessions.filter((s) => s.date === todayStr).length} sessions
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
