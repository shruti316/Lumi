import { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";
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
  const [isImmersive, setIsImmersive] = useState(false);
  const [focusTag, setFocusTag] = useState("Deep Work");

  const FOCUS_TAGS = ["Deep Work", "Study", "Coding", "Writing", "Reading"];

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

  const progressPercent = Math.min(
    100,
    Math.round(((duration * 60 - secondsLeft) / (duration * 60)) * 100)
  );

  return (
    <div className={`min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up transition-colors duration-500 ${
      isImmersive && isActive ? "bg-[#F4F1F7]" : "bg-transparent"
    }`}>
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* Header (hidden in full immersive mode) */}
        <div className={`mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-opacity duration-300 ${
          isImmersive ? "opacity-60" : "opacity-100"
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8B3E8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Deep Work & Focus
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Study & <span className="font-editorial-italic font-normal text-[#9E96D8]">Focus Studio</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Pomodoro sprints, uninterrupted deep flow & study session tracking.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsImmersive(!isImmersive)}
            className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#E8E3F0] px-3.5 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer shadow-2xs w-fit"
            title={isImmersive ? "Exit minimal focus" : "Enter minimal focus"}
          >
            {isImmersive ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span>{isImmersive ? "Normal Mode" : "Minimal Focus"}</span>
          </button>
        </div>

        {/* Focus Timer Hero Card */}
        <Card
          variant={isActive ? "mixed" : "lavender"}
          hoverEffect={!isActive}
          className={`mx-auto max-w-lg p-8 md:p-10 text-center border-[#DDD8F2] shadow-md mb-8 relative overflow-hidden transition-all duration-500 ${
            isActive ? "ring-2 ring-[#9E96D8]/40 shadow-[0_20px_45px_rgba(158,150,216,0.2)]" : ""
          }`}
        >
          {/* Subtle Ambient Focus Pulse Background */}
          {isActive && (
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-[#DDD8F3]/40 via-white/50 to-[#E4EEF6]/40 animate-pulse" />
          )}

          {/* Focus Session Mode Pills */}
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
                {m === 25 ? "25m • Classic" : m === 45 ? "45m • Sprint" : m === 60 ? "60m • Flow" : "15m • Quick"}
              </button>
            ))}
          </div>

          {/* Focus Tag Selector */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
            {FOCUS_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFocusTag(tag)}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                  focusTag === tag
                    ? "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2] shadow-2xs"
                    : "bg-white/60 text-[#8D8792] border-transparent hover:bg-white hover:text-[#17151C]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Big Editorial Countdown Display */}
          <div className="my-6">
            <span className="font-serif text-7xl md:text-8xl font-bold tracking-tight text-[#17151C] select-none">
              {formatDisplay(secondsLeft)}
            </span>

            <p className="mt-3 font-editorial-italic text-sm md:text-base text-[#5F5965]">
              {isActive ? "“Stay here for a while. Protect your flow.”" : "Ready to enter your focused sanctuary?"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mx-auto max-w-xs mb-7">
            <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden border border-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#B8D4E8] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] font-medium text-[#8D8792]">
              <span>{progressPercent}% completed</span>
              <span>{Math.ceil(secondsLeft / 60)} min remaining</span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl bg-[#17151C] text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              {isActive ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
              <span>{isActive ? "Pause Sprint" : "Start Focus"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#E8E3F0] text-[#5F5965] shadow-2xs hover:bg-[#EEEAFE] hover:text-[#17151C] active:scale-95 transition cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </Card>

        {/* Focus Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card variant="peach" hoverEffect className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#D99BB8] shadow-2xs border border-white">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Today's Focus Time
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
              </p>
              <p className="text-[11px] text-[#8D8792]">
                {todayMinutes > 0 ? "Compounding mindful progress" : "No focus recorded yet today"}
              </p>
            </div>
          </Card>

          <Card variant="default" hoverEffect className="p-5 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4A7D63] shadow-2xs border border-[#CCE5DC]">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
                Completed Sessions
              </p>
              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {sessions.filter((s) => s.date === todayStr).length} <span className="text-sm font-normal text-[#5F5965]">sessions</span>
              </p>
              <p className="text-[11px] text-[#4A7D63]">
                {sessions.length} total historical sprints
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
