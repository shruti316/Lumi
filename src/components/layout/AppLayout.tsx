import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffafc]">
      <div className="flex min-h-screen">
        <Sidebar
          currentPath={location.pathname}
          onNavigate={navigate}
        />

        <main className="min-w-0 flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav
        currentPath={location.pathname}
        onNavigate={navigate}
      />
    </div>
  );
}