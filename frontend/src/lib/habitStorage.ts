export interface Habit {
  id: string;
  name: string;
  emoji: string;
  completedDates: string[];
  createdAt: string;
}

const HABITS_KEY = "lumi_habits";

export function getHabits(): Habit[] {
  const storedHabits = localStorage.getItem(HABITS_KEY);

  if (!storedHabits) {
    return [];
  }

  try {
    return JSON.parse(storedHabits) as Habit[];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(
    HABITS_KEY,
    JSON.stringify(habits)
  );
}

export function addHabit(habit: Habit) {
  const habits = getHabits();

  saveHabits([
    ...habits,
    habit,
  ]);
}

export function updateHabit(updatedHabit: Habit) {
  const habits = getHabits();

  saveHabits(
    habits.map((habit) =>
      habit.id === updatedHabit.id
        ? updatedHabit
        : habit
    )
  );
}

export function deleteHabit(habitId: string) {
  const habits = getHabits();

  saveHabits(
    habits.filter(
      (habit) => habit.id !== habitId
    )
  );
}