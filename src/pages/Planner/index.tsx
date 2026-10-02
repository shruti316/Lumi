import { useState } from "react";
import {
  Check,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";

import { Card } from "../../components/ui/Card";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "../../lib/storage";

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState<Task["priority"]>("medium");

  function handleAddTask() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);

    setTitle("");
    setPriority("medium");
  }

  function handleToggleTask(task: Task) {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed,
    };

    updateTask(updatedTask);

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? updatedTask
          : currentTask
      )
    );
  }

  function handleDeleteTask(taskId: string) {
    deleteTask(taskId);

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completedTasks / tasks.length) * 100;

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      {/* Header */}
      <section className="mb-8">
        <p className="text-sm font-medium text-[#d85d91]">
          Plan your day
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#3f3340] md:text-4xl">
          Planner 📅
        </h1>

        <p className="mt-2 text-[#8f7f8b]">
          Small steps make big days.
        </p>
      </section>

      {/* Progress Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8f7f8b]">
              Today's progress
            </p>

            <p className="mt-1 text-2xl font-bold text-[#3f3340]">
              {completedTasks} / {tasks.length}
            </p>
          </div>

          <div className="text-3xl">
            🌱
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f8edf2]">
          <div
            className="h-full rounded-full bg-[#e879a9] transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </Card>

      {/* Add Task */}
      <Card className="mb-6">
        <h2 className="font-semibold text-[#3f3340]">
          Add a task
        </h2>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddTask();
              }
            }}
            placeholder="What do you want to get done?"
            className="min-w-0 flex-1 rounded-2xl border border-[#f1e5ec] bg-[#fffafc] px-4 py-3 text-sm text-[#3f3340] outline-none transition placeholder:text-[#b5a5ae] focus:border-[#e879a9] focus:ring-2 focus:ring-[#fce7f3]"
          />

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as Task["priority"]
              )
            }
            className="rounded-2xl border border-[#f1e5ec] bg-[#fffafc] px-4 py-3 text-sm text-[#3f3340] outline-none focus:border-[#e879a9]"
          >
            <option value="low">
              Low priority
            </option>

            <option value="medium">
              Medium priority
            </option>

            <option value="high">
              High priority
            </option>
          </select>

          <button
            type="button"
            onClick={handleAddTask}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#e879a9] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#d96899]"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </Card>

      {/* Task List */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#3f3340]">
              Today's tasks
            </h2>

            <p className="mt-1 text-sm text-[#8f7f8b]">
              {tasks.length === 0
                ? "Nothing planned yet."
                : `${tasks.length} task${
                    tasks.length === 1
                      ? ""
                      : "s"
                  }`}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-2xl bg-[#fff8fb] px-5 py-10 text-center">
              <div className="text-4xl">
                🌷
              </div>

              <p className="mt-3 font-medium text-[#3f3340]">
                Your planner is clear.
              </p>

              <p className="mt-1 text-sm text-[#8f7f8b]">
                Add your first task above.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-2xl border border-[#f1e5ec] bg-white p-4"
              >
                {/* Complete Button */}
                <button
                  type="button"
                  onClick={() =>
                    handleToggleTask(task)
                  }
                  className="shrink-0 text-[#d85d91]"
                  aria-label={
                    task.completed
                      ? "Mark task incomplete"
                      : "Mark task complete"
                  }
                >
                  {task.completed ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fce7f3]">
                      <Check size={15} />
                    </span>
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                {/* Task Information */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? "text-[#a18f99] line-through"
                        : "text-[#3f3340]"
                    }`}
                  >
                    {task.title}
                  </p>

                  <span
                    className={`mt-1 inline-block text-xs ${
                      task.priority === "high"
                        ? "text-[#d96d6d]"
                        : task.priority ===
                          "medium"
                        ? "text-[#c49455]"
                        : "text-[#78a887]"
                    }`}
                  >
                    {task.priority} priority
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteTask(task.id)
                  }
                  className="rounded-xl p-2 text-[#b5a5ae] transition hover:bg-[#fff1f5] hover:text-[#d96d6d]"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}