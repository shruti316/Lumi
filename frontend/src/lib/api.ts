const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("lumi_token") || sessionStorage.getItem("lumi_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status?: number }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...((options.headers as Record<string, string>) || {}),
    };

    const method = options.method || "GET";
    const url = `${API_BASE_URL}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        json = await res.json();
      } catch {
        json = null;
      }
    }

    if (!res.ok) {
      const errorMsg = json?.error || `HTTP error ${res.status}: ${res.statusText}`;
      
      // Auto-clear invalid/expired token on 401 or 403
      if (res.status === 401 || res.status === 403) {
        console.warn(`[LUMI API] ${method} ${endpoint} -> ${res.status} Unauthorized / Forbidden`);
        localStorage.removeItem("lumi_token");
        localStorage.removeItem("lumi_user");
        sessionStorage.removeItem("lumi_token");
        sessionStorage.removeItem("lumi_user");
        window.dispatchEvent(new CustomEvent("lumi-auth-expired"));
      } else {
        console.error(`[LUMI API] ${method} ${endpoint} -> ${res.status}:`, errorMsg);
      }

      return { error: errorMsg, status: res.status };
    }

    return { data: json, status: res.status };
  } catch (err: any) {
    console.error(`[LUMI API Network Error] ${options.method || "GET"} ${endpoint}:`, err);
    return { error: err.message || "Network connection error" };
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
    resetData: () =>
      request<{ message: string }>("/auth/reset-data", {
        method: "DELETE",
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

  // 1-to-1 Messaging
  messages: {
    getConversations: () => request<{ conversations: any[] }>("/messages/conversations"),
    getMessages: (conversationId: string) =>
      request<{ messages: any[] }>(`/messages/conversations/${conversationId}`),
    send: (conversationId: string, text: string, mediaUrl?: string) =>
      request<{ data: any }>(`/messages/conversations/${conversationId}/send`, {
        method: "POST",
        body: JSON.stringify({ text, mediaUrl }),
      }),
    start: (friendId: string, initialMessage?: string) =>
      request<{ conversation: any }>("/messages/conversations/start", {
        method: "POST",
        body: JSON.stringify({ friendId, initialMessage }),
      }),
  },
};
