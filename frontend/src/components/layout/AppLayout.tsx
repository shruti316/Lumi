import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "../common/CommandPalette";
import { QuickActions } from "../common/QuickActions";
import {
  UniversalCreateModal,
  type CreateTemplateType,
} from "../common/UniversalCreateModal";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTemplate, setCreateTemplate] = useState<CreateTemplateType>("menu");
  const [createText, setCreateText] = useState("");

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    }

    // Custom event listener for triggering Universal Create from any page/widget
    function handleOpenUniversalCreate(e: Event) {
      const customEvent = e as CustomEvent<{
        template?: CreateTemplateType;
        initialText?: string;
      }>;
      setCreateTemplate(customEvent.detail?.template || "menu");
      setCreateText(customEvent.detail?.initialText || "");
      setIsCreateOpen(true);
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("open-universal-create" as any, handleOpenUniversalCreate);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("open-universal-create" as any, handleOpenUniversalCreate);
    };
  }, []);

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
          onOpenCreate={() => {
            setCreateTemplate("menu");
            setCreateText("");
            setIsCreateOpen(true);
          }}
          onOpenSearch={() => setIsCommandOpen(true)}
        />

        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileNav
        currentPath={location.pathname}
        onNavigate={navigate}
        onOpenCreate={() => {
          setCreateTemplate("menu");
          setCreateText("");
          setIsCreateOpen(true);
        }}
      />

      {/* Global Universal Create Modal */}
      <UniversalCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        initialTemplate={createTemplate}
        initialText={createText}
        onSuccess={() => {
          // Dispatch a lightweight state sync trigger if needed
          window.dispatchEvent(new Event("storage-sync"));
        }}
      />

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Global Quick Actions Floating Action Menu */}
      <QuickActions
        onOpenCreate={(template) => {
          setCreateTemplate(template || "menu");
          setCreateText("");
          setIsCreateOpen(true);
        }}
      />
    </div>
  );
}