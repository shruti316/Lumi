import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Planner from "./pages/planner";
import Reading from "./pages/Reading";
import Diary from "./pages/Diary";
import Mood from "./pages/Mood";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Projects from "./pages/Projects";
import Notes from "./pages/Notes";
import BrainDump from "./pages/BrainDump";
import Memories from "./pages/Memories";
import Reflection from "./pages/Reflection";
import Calendar from "./pages/Calendar";
import Focus from "./pages/Focus";
import Exams from "./pages/Exams";
import Music from "./pages/Music";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/brain-dump" element={<BrainDump />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/music" element={<Music />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;