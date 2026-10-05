import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Core Primary Application Pages
import Dashboard from "./pages/Dashboard";
import Plan from "./pages/Plan";
import Workspace from "./pages/Workspace";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Reading from "./pages/Reading";
import Music from "./pages/Music";
import Memories from "./pages/Memories";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Specialized & Legacy Pages (Preserved & accessible)
import Tasks from "./pages/Tasks";
import Planner from "./pages/planner";
import Diary from "./pages/Diary";
import Reflection from "./pages/Reflection";
import Notes from "./pages/Notes";
import Projects from "./pages/Projects";
import Mood from "./pages/Mood";
import BrainDump from "./pages/BrainDump";
import Focus from "./pages/Focus";
import Exams from "./pages/Exams";
import NotFound from "./pages/NotFound";

function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("lumi_token") || sessionStorage.getItem("lumi_token"));
}

function RootRedirect() {
  return <Navigate to={hasAuthToken() ? "/dashboard" : "/login"} replace />;
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  if (hasAuthToken()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ENTRY REDIRECT
        ========================= */}
        <Route path="/" element={<RootRedirect />} />

        {/* =========================
            PUBLIC AUTH ROUTES
        ========================= */}
        <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
        <Route path="/signup" element={<PublicAuthRoute><Signup /></PublicAuthRoute>} />

        {/* =========================
            LUMI APPLICATION (AppLayout with Outlet)
        ========================= */}
        <Route element={<AppLayout />}>
          {/* Primary Unified Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/music" element={<Music />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Preserved Direct Sub-Routes */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/brain-dump" element={<BrainDump />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/exams" element={<Exams />} />
        </Route>

        {/* =========================
            404 NOT FOUND
        ========================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;