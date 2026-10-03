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
    <div
      className="
        relative
        min-h-screen
        lumi-page-atmosphere
        text-[#16131F]
        selection:bg-[#DAD4DF]
        selection:text-[#16131F]
      "
    >
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          currentPath={location.pathname}
          onNavigate={navigate}
        />

        <main className="min-w-0 flex-1 pb-24 md:pb-0">
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