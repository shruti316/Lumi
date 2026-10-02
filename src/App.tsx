import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/planner";
import Diary from "./pages/Diary";
import Mood from "./pages/Mood";
import Habits from "./pages/Habits";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/habits" element={<Habits />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;