import { Card } from "./components/ui/Card";

function App() {
  return (
    <main className="min-h-screen bg-[#fffafc] p-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-medium text-[#e879a9]">
          Welcome to
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-[#3f3340]">
          Lumi 🌷
        </h1>

        <p className="mt-2 text-[#8f7f8b]">
          Your little space to plan, reflect, and grow.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h2 className="font-semibold text-[#3f3340]">Planner</h2>
            <p className="mt-2 text-sm text-[#8f7f8b]">
              Organize your day.
            </p>
          </Card>

          <Card>
            <h2 className="font-semibold text-[#3f3340]">Diary</h2>
            <p className="mt-2 text-sm text-[#8f7f8b]">
              Keep your thoughts somewhere safe.
            </p>
          </Card>

          <Card>
            <h2 className="font-semibold text-[#3f3340]">Mood</h2>
            <p className="mt-2 text-sm text-[#8f7f8b]">
              Check in with yourself.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default App;