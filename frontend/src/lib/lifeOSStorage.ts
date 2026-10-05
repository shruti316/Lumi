/* ═══════════════════════════════════════════════
   LUMI LIFE OS LOCALSTORAGE UTILITIES
═══════════════════════════════════════════════ */

// GOALS
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Personal" | "Career" | "Health";
  deadline: string;
  progress: number;
  status: "In Progress" | "Completed";
  createdAt: string;
}

const GOALS_KEY = "lumi_goals";

export function getGoals(): Goal[] {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function addGoal(goal: Goal) {
  saveGoals([goal, ...getGoals()]);
}

export function updateGoal(updated: Goal) {
  saveGoals(getGoals().map((g) => (g.id === updated.id ? updated : g)));
}

export function deleteGoal(id: string) {
  saveGoals(getGoals().filter((g) => g.id !== id));
}

// PROJECTS
export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  deadline: string;
  notes: string;
  createdAt: string;
}

const PROJECTS_KEY = "lumi_projects";

export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project: Project) {
  saveProjects([project, ...getProjects()]);
}

export function updateProject(updated: Project) {
  saveProjects(getProjects().map((p) => (p.id === updated.id ? updated : p)));
}

export function deleteProject(id: string) {
  saveProjects(getProjects().filter((p) => p.id !== id));
}

// NOTES
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
}

const NOTES_KEY = "lumi_notes";

export function getNotes(): Note[] {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function addNote(note: Note) {
  saveNotes([note, ...getNotes()]);
}

export function updateNote(updated: Note) {
  saveNotes(getNotes().map((n) => (n.id === updated.id ? updated : n)));
}

export function deleteNote(id: string) {
  saveNotes(getNotes().filter((n) => n.id !== id));
}

// BRAIN DUMP
export interface BrainDumpEntry {
  id: string;
  content: string;
  createdAt: string;
}

const BRAIN_DUMP_KEY = "lumi_braindump";

export function getBrainDumpEntries(): BrainDumpEntry[] {
  try {
    const data = localStorage.getItem(BRAIN_DUMP_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBrainDumpEntries(entries: BrainDumpEntry[]) {
  localStorage.setItem(BRAIN_DUMP_KEY, JSON.stringify(entries));
}

export function addBrainDumpEntry(entry: BrainDumpEntry) {
  saveBrainDumpEntries([entry, ...getBrainDumpEntries()]);
}

export function deleteBrainDumpEntry(id: string) {
  saveBrainDumpEntries(getBrainDumpEntries().filter((e) => e.id !== id));
}

// MEMORIES
export interface Memory {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  date: string;
  tags: string[];
  location?: string;
  song?: string;
  visibility?: "private" | "friends" | "close_friends";
  createdAt: string;
}

const MEMORIES_KEY = "lumi_memories";

export function getMemories(): Memory[] {
  try {
    const data = localStorage.getItem(MEMORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMemories(memories: Memory[]) {
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function addMemory(memory: Memory) {
  saveMemories([memory, ...getMemories()]);
}

export function deleteMemory(id: string) {
  saveMemories(getMemories().filter((m) => m.id !== id));
}

// REFLECTION
export interface ReflectionEntry {
  id: string;
  weekOf: string;
  wentWell: string;
  wasDifficult: string;
  learned: string;
  nextWeekIntention: string;
  createdAt: string;
}

const REFLECTIONS_KEY = "lumi_reflections";

const DEFAULT_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "ref-1",
    weekOf: "Week 5 • Calm Midterm Sprint",
    wentWell: "Maintained a steady 2-hour morning focus routine and shipped lab builds on time.",
    wasDifficult: "Late-night screen time • Focus: Wind down 30 minutes earlier.",
    learned: "Consistent small daily habits compound much better than all-nighters.",
    nextWeekIntention: "Protect morning deep work blocks and drink more water throughout lectures.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export function getReflections(): ReflectionEntry[] {
  try {
    const data = localStorage.getItem(REFLECTIONS_KEY);
    if (!data) {
      saveReflections(DEFAULT_REFLECTIONS);
      return DEFAULT_REFLECTIONS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_REFLECTIONS;
  }
}

export function saveReflections(reflections: ReflectionEntry[]) {
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
}

export function addReflection(reflection: ReflectionEntry) {
  saveReflections([reflection, ...getReflections()]);
}

export function deleteReflection(id: string) {
  saveReflections(getReflections().filter((r) => r.id !== id));
}

// CALENDAR EVENTS
export interface CalendarEvent {
  id: string;
  title: string;
  type: "Exam" | "Assignment" | "Project" | "Personal" | "Class";
  date: string;
  time: string;
  createdAt: string;
}

const EVENTS_KEY = "lumi_events";

export function getCalendarEvents(): CalendarEvent[] {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCalendarEvents(events: CalendarEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addCalendarEvent(event: CalendarEvent) {
  saveCalendarEvents([event, ...getCalendarEvents()]);
}

export function deleteCalendarEvent(id: string) {
  saveCalendarEvents(getCalendarEvents().filter((e) => e.id !== id));
}

// EXAMS
export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  preparationProgress: number;
  notes: string;
  createdAt: string;
}

const EXAMS_KEY = "lumi_exams";

export function getExams(): Exam[] {
  try {
    const data = localStorage.getItem(EXAMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveExams(exams: Exam[]) {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
}

export function addExam(exam: Exam) {
  saveExams([exam, ...getExams()]);
}

export function updateExam(updated: Exam) {
  saveExams(getExams().map((e) => (e.id === updated.id ? updated : e)));
}

export function deleteExam(id: string) {
  saveExams(getExams().filter((e) => e.id !== id));
}

// FOCUS SESSIONS
export interface FocusSession {
  id: string;
  durationMinutes: number;
  date: string;
  createdAt: string;
}

const FOCUS_KEY = "lumi_focus";

export function getFocusSessions(): FocusSession[] {
  try {
    const data = localStorage.getItem(FOCUS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFocusSessions(sessions: FocusSession[]) {
  localStorage.setItem(FOCUS_KEY, JSON.stringify(sessions));
}

export function addFocusSession(session: FocusSession) {
  saveFocusSessions([session, ...getFocusSessions()]);
}

// PLANNER TIMELINE SCHEDULE BLOCKS
export interface ScheduleBlock {
  id: string;
  time: string;
  title: string;
  category: "Class" | "Study" | "Project" | "Personal" | "Routine" | "Break";
  completed: boolean;
  notes?: string;
  createdAt: string;
}

const SCHEDULE_KEY = "lumi_schedule";

const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  {
    id: "def-1",
    time: "08:00 - 09:00",
    title: "Morning Routine & Healthy Breakfast",
    category: "Routine",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-2",
    time: "09:00 - 11:30",
    title: "Algorithms & Data Structures Lecture",
    category: "Class",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-3",
    time: "12:00 - 13:00",
    title: "Lunch Break & Coffee with Friends",
    category: "Break",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-4",
    time: "14:00 - 16:30",
    title: "LUMI Life OS Project Sprint & Coding",
    category: "Project",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-5",
    time: "17:00 - 18:00",
    title: "Gym Workout & Fresh Air",
    category: "Personal",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-6",
    time: "19:30 - 20:30",
    title: "Dinner & Cozy Downtime",
    category: "Break",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "def-7",
    time: "21:30 - 22:30",
    title: "Reading, Reflection & Wind Down",
    category: "Routine",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export function getScheduleBlocks(): ScheduleBlock[] {
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    if (!data) {
      saveScheduleBlocks(DEFAULT_SCHEDULE);
      return DEFAULT_SCHEDULE;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveScheduleBlocks(blocks: ScheduleBlock[]) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(blocks));
}

export function addScheduleBlock(block: ScheduleBlock) {
  saveScheduleBlocks([...getScheduleBlocks(), block]);
}

export function updateScheduleBlock(updated: ScheduleBlock) {
  saveScheduleBlocks(
    getScheduleBlocks().map((b) => (b.id === updated.id ? updated : b))
  );
}

export function deleteScheduleBlock(id: string) {
  saveScheduleBlocks(getScheduleBlocks().filter((b) => b.id !== id));
}

// MOOD CHECK-INS
export interface MoodCheckin {
  id: string;
  mood: "Serene" | "Inspired" | "Focused" | "Grateful" | "Reflective" | "Overwhelmed";
  energy: number; // 1 to 5
  tags: string[];
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

const MOOD_KEY = "lumi_mood_checkins";

const DEFAULT_MOODS: MoodCheckin[] = [
  {
    id: "mood-1",
    mood: "Serene",
    energy: 4,
    tags: ["Morning Sun", "Herbal Tea", "Gentle Pace"],
    note: "Started the morning with quiet contemplation and felt peaceful throughout the day.",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: "mood-2",
    mood: "Inspired",
    energy: 5,
    tags: ["Deep Focus", "Creative Flow", "Music"],
    note: "Made incredible headway on architectural concepts and interface designs.",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mood-3",
    mood: "Grateful",
    energy: 4,
    tags: ["Connection", "Good Food", "Evening Walk"],
    note: "Had a delightful conversation with family and enjoyed a calm evening stroll.",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export function getMoodCheckins(): MoodCheckin[] {
  try {
    const data = localStorage.getItem(MOOD_KEY);
    if (!data) {
      saveMoodCheckins(DEFAULT_MOODS);
      return DEFAULT_MOODS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_MOODS;
  }
}

export function saveMoodCheckins(checkins: MoodCheckin[]) {
  localStorage.setItem(MOOD_KEY, JSON.stringify(checkins));
}

export function addMoodCheckin(checkin: MoodCheckin) {
  saveMoodCheckins([checkin, ...getMoodCheckins()]);
}

export function deleteMoodCheckin(id: string) {
  saveMoodCheckins(getMoodCheckins().filter((m) => m.id !== id));
}

