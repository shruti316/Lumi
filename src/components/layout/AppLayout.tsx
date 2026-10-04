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
        text-[#17151C]
        selection:bg-[#DCD8F2]
        selection:text-[#17151C]
        overflow-x-hidden
      "
    >
      {/* Ambient background glow accents */}
      <div className="pointer-events-none fixed top-10 left-1/4 h-96 w-96 rounded-full bg-[#EEEAFE]/40 blur-3xl -z-10" />
      <div className="pointer-events-none fixed top-1/3 right-10 h-80 w-80 rounded-full bg-[#F8E8F0]/35 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-20 left-1/3 h-96 w-96 rounded-full bg-[#EEF3FA]/40 blur-3xl -z-10" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          currentPath={location.pathname}
          onNavigate={navigate}
        />

        <main className="min-w-0 flex-1 pb-24 md:pb-8">
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