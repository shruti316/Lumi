const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("lumi_token") || sessionStorage.getItem("lumi_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || `HTTP error ${res.status}` };
    }
    return { data: json };
  } catch (err: any) {
    console.warn(`[LUMI API Sync] Falling back to local store for ${endpoint}:`, err);
    return { error: err.message || "Network error" };
  }
}

export const api = {
  // Authentication & Profile
  auth: {
    signup: (body: { email: string; password: string; name?: string }) =>
      request<{ token: string; user: any }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    getMe: () => request<{ user: any }>("/auth/me"),
    updateMe: (body: { name?: string; bio?: string; theme?: string }) =>
      request<{ user: any }>("/auth/me", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },

  // Tasks & Day Planner
  tasks: {
    getAll: () => request<{ tasks: any[] }>("/tasks"),
    create: (body: any) =>
      request<{ task: any }>("/tasks", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: any) =>
      request<{ task: any }>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/tasks/${id}`, {
        method: "DELETE",
      }),
  },

  // Habits & Streaks
  habits: {
    getAll: () => request<{ habits: any[] }>("/habits"),
    create: (body: any) =>
      request<{ habit: any }>("/habits", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    toggle: (id: string, date?: string) =>
      request<{ habit: any }>(`/habits/${id}/toggle`, {
        method: "POST",
        body: JSON.stringify({ date }),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/habits/${id}`, {
        method: "DELETE",
      }),
  },

  // Workspace (Notes & Projects)
  workspace: {
    getNotes: () => request<{ notes: any[] }>("/notes"),
    createNote: (body: any) =>
      request<{ note: any }>("/notes", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateNote: (id: string, body: any) =>
      request<{ note: any }>(`/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    deleteNote: (id: string) =>
      request<{ message: string }>(`/notes/${id}`, {
        method: "DELETE",
      }),

    getProjects: () => request<{ projects: any[] }>("/projects"),
    createProject: (body: any) =>
      request<{ project: any }>("/projects", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateProject: (id: string, body: any) =>
      request<{ project: any }>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    deleteProject: (id: string) =>
      request<{ message: string }>(`/projects/${id}`, {
        method: "DELETE",
      }),
  },

  // Goals
  goals: {
    getAll: () => request<{ goals: any[] }>("/goals"),
    create: (body: any) =>
      request<{ goal: any }>("/goals", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: any) =>
      request<{ goal: any }>(`/goals/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/goals/${id}`, {
        method: "DELETE",
      }),
  },

  // Journal (Diary & Reflections)
  journals: {
    getAll: () => request<{ journals: any[] }>("/journals"),
    create: (body: any) =>
      request<{ journal: any }>("/journals", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/journals/${id}`, {
        method: "DELETE",
      }),
  },

  // Memories
  memories: {
    getAll: () => request<{ memories: any[] }>("/memories"),
    create: (body: any) =>
      request<{ memory: any }>("/memories", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/memories/${id}`, {
        method: "DELETE",
      }),
  },

  // Reading
  reading: {
    getAll: () => request<{ books: any[] }>("/books"),
    create: (body: any) =>
      request<{ book: any }>("/books", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: any) =>
      request<{ book: any }>(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/books/${id}`, {
        method: "DELETE",
      }),
  },

  // Friends & Social Layer
  friends: {
    getFeed: () => request<{ feed: any[] }>("/friends/feed"),
    react: (id: string, reactionType: "heart" | "sparkle" | "fire") =>
      request<{ memory: any }>(`/friends/memories/${id}/react`, {
        method: "POST",
        body: JSON.stringify({ reactionType }),
      }),
    comment: (id: string, text: string) =>
      request<{ comment: any }>(`/friends/memories/${id}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
  },
};
