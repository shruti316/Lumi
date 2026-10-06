import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
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

function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#FAF8FC]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#9E96D8]" />
        <p className="font-serif text-sm font-medium text-[#5F5965] tracking-wide">
          Opening your space...
        </p>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          ENTRY REDIRECT
      ========================= */}
      <Route path="/" element={<RootRedirect />} />

      {/* =========================
          PUBLIC AUTH ROUTES
      ========================= */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <Signup />
          </PublicAuthRoute>
        }
      />

      {/* =========================
          LUMI PROTECTED APPLICATION
      ========================= */}
      <Route element={<ProtectedRoute />}>
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
      </Route>

      {/* =========================
          404 NOT FOUND
      ========================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;