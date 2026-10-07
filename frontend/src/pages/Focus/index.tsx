import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Maximize2,
  Minimize2,
  CheckSquare,
  CalendarDays,
  Volume2,
  VolumeX,
  Settings2,
  ChevronDown,
  History,
  Tag,
  Check,
} from "lucide-react";

import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";

type TimerMode = "focus" | "short_break" | "long_break";

interface FocusStats {
  todayMinutes: number;
  todaySessions: number;
  totalMinutes: number;
  totalSessions: number;
  tagBreakdown: {
    tag: string;
    sessionCount: number;
    totalMinutes: number;
  }[];
  recentSessions: any[];
}

const DEFAULT_DURATIONS: Record<TimerMode, number> = {
  focus: 25,
  short_break: 5,
  long_break: 15,
};

const FOCUS_TAGS = [
  "Deep Work",
  "Study",
  "Coding",
  "Writing",
  "Reading",
  "Design",
  "Planning",
];

const INSPIRATIONAL_QUOTES = [
  "“Stay here for a while. Protect your flow.”",
  "“Small mindful efforts compound into extraordinary results.”",
  "“Deep focus is a quiet sanctuary for your mind.”",
  "“One breath, one task, uninterrupted presence.”",
  "“Your future self is being shaped by this moment.”",
];

export default function Focus() {
  // Timer settings & state
  const [mode, setMode] = useState<TimerMode>("focus");
  const [durations, setDurations] =
    useState<Record<TimerMode, number>>(DEFAULT_DURATIONS);
  const [secondsLeft, setSecondsLeft] = useState(
    DEFAULT_DURATIONS.focus * 60
  );
  const [isActive, setIsActive] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Focus cycle tracker (4 sessions per cycle)
  const [cycleIndex, setCycleIndex] = useState(1);

  // Tag & Task association
  const [focusTag, setFocusTag] = useState("Deep Work");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  // Backend Stats & Session History
  const [stats, setStats] = useState<FocusStats>({
    todayMinutes: 0,
    todaySessions: 0,
    totalMinutes: 0,
    totalSessions: 0,
    tagBreakdown: [],
    recentSessions: [],
  });

  const [isSavingSession, setIsSavingSession] = useState(false);

  // Random quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Play gentle bell chime via Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;

      if (!AudioCtx) return;

      const ctx = new AudioCtx();

      // Dual harmonic bell sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(
        783.99,
        ctx.currentTime + 0.15
      );

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(
        1046.5,
        ctx.currentTime + 0.2
      );

      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 1.4
      );

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(ctx.currentTime + 1.4);
      osc2.stop(ctx.currentTime + 1.4);
    } catch {
      // Ignore audio policy errors
    }
  }, [soundEnabled]);

  // Load stats and tasks on mount
  const loadData = useCallback(async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        api.focus.getStats(),
        api.tasks.getAll(),
      ]);

      if (statsResponse.data?.stats) {
        setStats(statsResponse.data.stats);
      }

      if (tasksResponse.data?.tasks) {
        const openTasks = tasksResponse.data.tasks.filter(
          (task) => !task.completed
        );

        setTasks(openTasks);
      }
    } catch (error) {
      console.error("[Focus] Failed to load focus data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync seconds left when mode or duration setting changes
  useEffect(() => {
    setSecondsLeft(durations[mode] * 60);
    setIsActive(false);
  }, [mode, durations]);

  // Handle session completion and saving to MySQL
  const handleSessionComplete = useCallback(async () => {
    setIsActive(false);
    playChime();

    try {
      setIsSavingSession(true);

      const durationCompleted = durations[mode];

      await api.focus.createSession({
        taskId: selectedTaskId,
        mode,
        durationMinutes: durationCompleted,
        tag: focusTag,
      });

      // Refresh stats
      const updatedStats = await api.focus.getStats();

      if (updatedStats.data?.stats) {
        setStats(updatedStats.data.stats);
      }
    } catch (err) {
      console.error("[Focus] Failed to log completed session:", err);
    } finally {
      setIsSavingSession(false);
    }

    // Advance cycle and auto-suggest next mode
    if (mode === "focus") {
      if (cycleIndex >= 4) {
        setCycleIndex(1);
        setMode("long_break");
      } else {
        setCycleIndex((prev) => prev + 1);
        setMode("short_break");
      }
    } else {
      setMode("focus");
    }

    setQuoteIndex(
      (prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length
    );
  }, [
    mode,
    durations,
    selectedTaskId,
    focusTag,
    cycleIndex,
    playChime,
  ]);

  // Main countdown interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive, secondsLeft, handleSessionComplete]);

  // Timer helpers
  function formatDisplay(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }

  function handleReset() {
    setIsActive(false);
    setSecondsLeft(durations[mode] * 60);
  }

  function handleSkip() {
    setIsActive(false);

    if (mode === "focus") {
      setMode(cycleIndex >= 4 ? "long_break" : "short_break");
    } else {
      setMode("focus");
    }
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const currentDurationMinutes = durations[mode];

  const progressPercent = Math.min(
    100,
    Math.round(
      ((currentDurationMinutes * 60 - secondsLeft) /
        (currentDurationMinutes * 60)) *
        100
    )
  );

  return (
    <div
      className={`min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up transition-colors duration-500 ${
        isImmersive && isActive
          ? "bg-[#F4F1F7]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* Plans Sub-Navigation */}
        {!isImmersive && (
          <div className="mb-6 flex items-center gap-1.5 rounded-2xl border border-[#E8E3F0] bg-white/90 p-1.5 shadow-2xs w-fit">
            <Link
              to="/plan"
              className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#5F5965] hover:text-[#17151C] transition cursor-pointer"
            >
              <CheckSquare size={14} />
              <span>Tasks</span>
            </Link>

            <Link
              to="/planner"
              className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-[#5F5965] hover:text-[#17151C] transition cursor-pointer"
            >
              <CalendarDays size={14} />
              <span>Planner</span>
            </Link>

            <div className="flex items-center gap-2 rounded-xl bg-[#EEEAFE] px-3.5 py-1.5 text-xs font-semibold text-[#17151C] border border-[#DDD8F2] shadow-2xs">
              <Clock size={14} className="text-[#9E96D8]" />
              <span>Focus Studio</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className={`mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-opacity duration-300 ${
            isImmersive ? "opacity-60" : "opacity-100"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8B3E8]" />

              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Deep Work & Pomodoro Studio
              </p>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Study &{" "}
              <span className="font-editorial-italic font-normal text-[#9E96D8]">
                Focus Studio
              </span>
            </h1>

            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Mindful sprints, uninterrupted deep flow & MySQL-synced
              session analytics.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 rounded-xl bg-white/80 border border-[#E8E3F0] px-3 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer shadow-2xs"
              title={
                soundEnabled
                  ? "Mute chime sound"
                  : "Enable chime sound"
              }
            >
              {soundEnabled ? (
                <Volume2
                  size={15}
                  className="text-[#9E96D8]"
                />
              ) : (
                <VolumeX
                  size={15}
                  className="text-[#8D8792]"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs ${
                showSettings
                  ? "bg-[#EEEAFE] text-[#6B5BA5] border-[#DDD8F2]"
                  : "bg-white/80 text-[#5F5965] border-[#E8E3F0] hover:bg-[#EEEAFE] hover:text-[#17151C]"
              }`}
              title="Configure Pomodoro Durations"
            >
              <Settings2 size={15} />
              <span>Config</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImmersive(!isImmersive)}
              className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#E8E3F0] px-3.5 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] transition cursor-pointer shadow-2xs"
              title={
                isImmersive
                  ? "Exit minimal focus"
                  : "Enter minimal focus"
              }
            >
              {isImmersive ? (
                <Minimize2 size={15} />
              ) : (
                <Maximize2 size={15} />
              )}

              <span>
                {isImmersive ? "Normal Mode" : "Minimal Focus"}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Duration Config Drawer */}
        {showSettings && (
          <Card
            variant="default"
            className="p-5 mb-6 border-[#DDD8F2] bg-white/90 shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17151C] flex items-center gap-2">
                <Settings2
                  size={14}
                  className="text-[#9E96D8]"
                />
                Pomodoro Duration Settings (Minutes)
              </h3>

              <button
                type="button"
                onClick={() => setDurations(DEFAULT_DURATIONS)}
                className="text-[11px] text-[#8D8792] hover:text-[#9E96D8] underline cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#5F5965] block mb-1">
                  Focus Sprint
                </label>

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={durations.focus}
                  onChange={(e) =>
                    setDurations((prev) => ({
                      ...prev,
                      focus:
                        Math.max(
                          1,
                          parseInt(e.target.value, 10) || 25
                        ),
                    }))
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#5F5965] block mb-1">
                  Short Break
                </label>

                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durations.short_break}
                  onChange={(e) =>
                    setDurations((prev) => ({
                      ...prev,
                      short_break:
                        Math.max(
                          1,
                          parseInt(e.target.value, 10) || 5
                        ),
                    }))
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#5F5965] block mb-1">
                  Long Break
                </label>

                <input
                  type="number"
                  min="1"
                  max="90"
                  value={durations.long_break}
                  onChange={(e) =>
                    setDurations((prev) => ({
                      ...prev,
                      long_break:
                        Math.max(
                          1,
                          parseInt(e.target.value, 10) || 15
                        ),
                    }))
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] focus:outline-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Focus Timer Hero Card */}
        <Card
          variant={
            mode === "focus"
              ? isActive
                ? "mixed"
                : "lavender"
              : "peach"
          }
          hoverEffect={!isActive}
          className={`mx-auto max-w-lg p-8 md:p-10 text-center border-[#DDD8F2] shadow-md mb-8 relative overflow-hidden transition-all duration-500 ${
            isActive
              ? "ring-2 ring-[#9E96D8]/40 shadow-[0_20px_45px_rgba(158,150,216,0.2)]"
              : ""
          }`}
        >
          {/* Ambient Focus Pulse */}
          {isActive && (
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-[#DDD8F3]/40 via-white/50 to-[#E4EEF6]/40 animate-pulse" />
          )}

          {/* Pomodoro Mode Switcher */}
          <div className="mb-5 flex justify-center gap-1.5 rounded-2xl bg-white/70 p-1 border border-[#E8E3F0] shadow-2xs max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setMode("focus")}
              className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition cursor-pointer ${
                mode === "focus"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              Focus ({durations.focus}m)
            </button>

            <button
              type="button"
              onClick={() => setMode("short_break")}
              className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition cursor-pointer ${
                mode === "short_break"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              Short Break ({durations.short_break}m)
            </button>

            <button
              type="button"
              onClick={() => setMode("long_break")}
              className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition cursor-pointer ${
                mode === "long_break"
                  ? "bg-[#17151C] text-white shadow-2xs"
                  : "text-[#5F5965] hover:text-[#17151C]"
              }`}
            >
              Long Break ({durations.long_break}m)
            </button>
          </div>

          {/* 4-Session Cycle Indicator */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-[#8D8792]">
              Sprint Cycle:
            </span>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  title={`Session ${step} of 4`}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    step < cycleIndex
                      ? "bg-[#9E96D8] scale-100"
                      : step === cycleIndex
                      ? "bg-[#17151C] ring-2 ring-[#9E96D8]/50 scale-110"
                      : "bg-[#E8E3F0]"
                  }`}
                />
              ))}
            </div>

            <span className="text-[11px] font-bold text-[#5F5965]">
              {cycleIndex}/4
            </span>
          </div>

          {/* Active Task Association */}
          <div className="mb-4 relative max-w-sm mx-auto">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-white/90 border border-[#E8E3F0] px-3 py-2 text-xs shadow-2xs">
              <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                <CheckSquare
                  size={14}
                  className="shrink-0 text-[#9E96D8]"
                />

                <span className="truncate font-medium text-[#17151C]">
                  {selectedTask
                    ? selectedTask.title
                    : "No task attached"}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTaskDropdown(!showTaskDropdown)
                }
                className="text-[11px] font-semibold text-[#6B5BA5] hover:text-[#17151C] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>
                  {selectedTask ? "Change" : "Select Task"}
                </span>

                <ChevronDown size={12} />
              </button>
            </div>

            {/* Task selection dropdown */}
            {showTaskDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-30 max-h-48 overflow-y-auto rounded-xl border border-[#DDD8F2] bg-white p-2 shadow-lg text-left">
                <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-[#8D8792]">
                  Select an active task
                </div>

                {tasks.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-[#8D8792]">
                    No open tasks found
                  </p>
                ) : (
                  tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setShowTaskDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        selectedTaskId === task.id
                          ? "bg-[#EEEAFE] font-semibold text-[#6B5BA5]"
                          : "text-[#5F5965] hover:bg-[#FAF8FC] hover:text-[#17151C]"
                      }`}
                    >
                      <span className="truncate">
                        {task.title}
                      </span>

                      {selectedTaskId === task.id && (
                        <Check
                          size={13}
                          className="text-[#6B5BA5]"
                        />
                      )}
                    </button>
                  ))
                )}

                {selectedTaskId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTaskId(null);
                      setShowTaskDropdown(false);
                    }}
                    className="mt-1 w-full border-t border-[#F0EBF8] pt-1 text-center text-[11px] text-[#8D8792] hover:text-red-600 cursor-pointer"
                  >
                    Clear attached task
                  </button>
                )}
              </div>
            )}
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

          {/* Countdown Display */}
          <div className="my-5">
            <span className="font-serif text-7xl md:text-8xl font-bold tracking-tight text-[#17151C] select-none">
              {formatDisplay(secondsLeft)}
            </span>

            <p className="mt-3 font-editorial-italic text-sm md:text-base text-[#5F5965]">
              {isActive
                ? INSPIRATIONAL_QUOTES[quoteIndex]
                : mode === "focus"
                ? "Ready to enter your focused sanctuary?"
                : "Breathe, stretch & recharge your energy."}
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
              <span>
                {Math.ceil(secondsLeft / 60)} min remaining
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              disabled={isSavingSession}
              className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl bg-[#17151C] text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isActive ? (
                <Pause size={17} />
              ) : (
                <Play size={17} className="ml-0.5" />
              )}

              <span>
                {isActive ? "Pause Sprint" : "Start Focus"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#E8E3F0] text-[#5F5965] shadow-2xs hover:bg-[#EEEAFE] hover:text-[#17151C] active:scale-95 transition cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw size={17} />
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#E8E3F0] text-[#5F5965] shadow-2xs hover:bg-[#EEEAFE] hover:text-[#17151C] active:scale-95 transition cursor-pointer"
              title="Skip to next session"
            >
              <SkipForward size={17} />
            </button>
          </div>
        </Card>

        {/* Focus Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <Card
            variant="peach"
            hoverEffect
            className="p-5 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#D99BB8] shadow-2xs border border-white">
              <Clock size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
                Today's Focus Time
              </p>

              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {Math.floor(stats.todayMinutes / 60)}h{" "}
                {stats.todayMinutes % 60}m
              </p>

              <p className="text-[11px] text-[#8D8792]">
                {stats.todayMinutes > 0
                  ? `${stats.todayMinutes} mins of mindful deep flow recorded`
                  : "No focus recorded yet today"}
              </p>
            </div>
          </Card>

          <Card
            variant="default"
            hoverEffect
            className="p-5 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white flex items-center gap-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4A7D63] shadow-2xs border border-[#CCE5DC]">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
                Completed Sessions
              </p>

              <p className="text-2xl font-bold text-[#17151C] mt-0.5">
                {stats.todaySessions}{" "}
                <span className="text-sm font-normal text-[#5F5965]">
                  today
                </span>
              </p>

              <p className="text-[11px] text-[#4A7D63]">
                {stats.totalSessions} lifetime sprints (
                {Math.round(stats.totalMinutes / 60)}h total)
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Session History & Tag Distribution */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* History List */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17151C] flex items-center gap-2">
                <History
                  size={14}
                  className="text-[#9E96D8]"
                />
                Recent MySQL Sprints
              </h3>

              <span className="text-[11px] text-[#8D8792]">
                {stats.recentSessions.length} logged
              </span>
            </div>

            {stats.recentSessions.length === 0 ? (
              <Card
                variant="lavender"
                className="p-6 text-center text-xs text-[#8D8792]"
              >
                Complete your first Pomodoro sprint to see your
                session history appear here in MySQL!
              </Card>
            ) : (
              <div className="space-y-2.5">
                {stats.recentSessions.slice(0, 5).map((s) => (
                  <Card
                    key={s.id}
                    variant="default"
                    className="p-3.5 flex items-center justify-between gap-3 bg-white/80 border-[#E8E3F0] hover:border-[#DDD8F2] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#6B5BA5]">
                        <Clock size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#17151C] truncate">
                          {s.taskTitle ||
                            `${s.tag || "Deep Work"} Sprint`}
                        </p>

                        <p className="text-[10px] text-[#8D8792]">
                          {s.mode === "focus"
                            ? "Deep Focus"
                            : s.mode === "short_break"
                            ? "Short Break"
                            : "Long Break"}{" "}
                          • {s.durationMinutes} min
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block rounded-full bg-[#FAF8FC] border border-[#DDD8F2] px-2 py-0.5 text-[10px] font-semibold text-[#6B5BA5]">
                        {s.tag || "Deep Work"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Tag Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17151C] flex items-center gap-2">
                <Tag
                  size={14}
                  className="text-[#9E96D8]"
                />
                Top Focus Focuses
              </h3>
            </div>

            <Card
              variant="mixed"
              className="p-4 border-[#DDD8F2]"
            >
              {stats.tagBreakdown.length === 0 ? (
                <p className="text-xs text-[#8D8792] text-center py-4">
                  No focus tags recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.tagBreakdown.slice(0, 5).map((tb) => (
                    <div
                      key={tb.tag}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#17151C]">
                          {tb.tag}
                        </span>

                        <span className="text-[#8D8792]">
                          {tb.totalMinutes}m
                        </span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#9E96D8]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (tb.totalMinutes /
                                  Math.max(
                                    1,
                                    stats.totalMinutes
                                  )) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}