export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
}

const DIARY_KEY = "lumi_diary";

export function getDiaryEntries(): DiaryEntry[] {
  const storedEntries = localStorage.getItem(DIARY_KEY);

  if (!storedEntries) {
    return [];
  }

  try {
    return JSON.parse(storedEntries) as DiaryEntry[];
  } catch {
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]) {
  localStorage.setItem(
    DIARY_KEY,
    JSON.stringify(entries)
  );
}

export function addDiaryEntry(entry: DiaryEntry) {
  const entries = getDiaryEntries();

  saveDiaryEntries([
    entry,
    ...entries,
  ]);
}

export function deleteDiaryEntry(entryId: string) {
  const entries = getDiaryEntries();

  saveDiaryEntries(
    entries.filter(
      (entry) => entry.id !== entryId
    )
  );
}