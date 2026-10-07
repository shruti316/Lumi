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

export function getReflections(): ReflectionEntry[] {
  try {
    const data = localStorage.getItem(REFLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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

export function getScheduleBlocks(): ScheduleBlock[] {
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch {
    return [];
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

export function getMoodCheckins(): MoodCheckin[] {
  try {
    const data = localStorage.getItem(MOOD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
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

