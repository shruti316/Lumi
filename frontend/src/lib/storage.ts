export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const TASKS_KEY = "lumi_tasks";

export function getTasks(): Task[] {
  const storedTasks = localStorage.getItem(TASKS_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    return JSON.parse(storedTasks) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(
    TASKS_KEY,
    JSON.stringify(tasks)
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage-sync"));
  }
}

export function addTask(task: Task) {
  const tasks = getTasks();

  saveTasks([...tasks, task]);
}

export function updateTask(updatedTask: Task) {
  const tasks = getTasks();

  saveTasks(
    tasks.map((task) =>
      task.id === updatedTask.id
        ? updatedTask
        : task
    )
  );
}

export function deleteTask(taskId: string) {
  const tasks = getTasks();

  saveTasks(
    tasks.filter(
      (task) => task.id !== taskId
    )
  );
}