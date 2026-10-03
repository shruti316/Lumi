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
    <div className="relative min-h-screen bg-[#E8E7E5] lumi-page-atmosphere text-[#34323A] selection:bg-[#E5E0EC] selection:text-[#34323A]">
      {/* ═══════════════════════════════════════
          RICH VISIBLE ATMOSPHERIC AMBIENT GLOWS
          (Visibly designed, warm canvas & atmospheric color)
      ═══════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        {/* TOP-LEFT: Lavender #D8D2E6 */}
        <div className="absolute -left-16 -top-16 h-[720px] w-[720px] rounded-full bg-[#D8D2E6]/85 blur-[80px]" />

        {/* TOP-RIGHT: Dusty Blue #C9DDE4 */}
        <div className="absolute -right-12 top-4 h-[680px] w-[680px] rounded-full bg-[#C9DDE4]/85 blur-[80px]" />

        {/* MIDDLE / LOWER-LEFT: Sage #D1DFD3 */}
        <div className="absolute -left-10 top-1/2 h-[700px] w-[700px] rounded-full bg-[#D1DFD3]/85 blur-[80px]" />

        {/* LOWER-RIGHT: Muted Terracotta #E3D0C5 */}
        <div className="absolute -right-10 bottom-8 h-[680px] w-[680px] rounded-full bg-[#E3D0C5]/85 blur-[80px]" />

        {/* CENTER TIE-IN: Warm Cream #F0EAE4 */}
        <div className="absolute left-1/3 top-1/3 h-[580px] w-[580px] rounded-full bg-[#F0EAE4]/85 blur-[90px]" />
      </div>

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