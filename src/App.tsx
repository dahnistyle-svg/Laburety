import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/layout/Navbar";
import { DashboardView } from "./components/dashboard/DashboardView";
import { LibraryView } from "./components/library/LibraryView";
import { ResumesListView } from "./components/resumes/ResumesListView";
import { ResumeEditorView } from "./components/editor/ResumeEditorView";
import { CompaniesView } from "./components/companies/CompaniesView";
import { TemplatesView } from "./components/templates/TemplatesView";
import { SettingsView } from "./components/settings/SettingsView";
import { NewResumeModal } from "./components/resumes/NewResumeModal";
import { LoginScreen } from "./components/auth/LoginScreen";
import { CheckCircle2, RefreshCw } from "lucide-react";

const AppContent: React.FC = () => {
  const { currentView, activeResumeId, isLoggedIn, isSaving, lastSaved } = useApp();
  const [newResumeModalOpen, setNewResumeModalOpen] = useState(false);

  const formattedTime = lastSaved
    ? new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  // If user is not authenticated, render ONLY the LoginScreen
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CEDFD6] via-[#D7E6DE] to-[#C8DBD1] dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 text-[#0F2F26] dark:text-slate-100 flex flex-col font-sans transition-colors print:block print:min-h-0 print:w-full print:m-0 print:p-0 print:bg-none print:bg-white">
      <Navbar onOpenNewResumeModal={() => setNewResumeModalOpen(true)} />

      <main className="flex-1 print:block print:w-full print:m-0 print:p-0">
        {currentView === "dashboard" && (
          <DashboardView onOpenNewResumeModal={() => setNewResumeModalOpen(true)} />
        )}
        {currentView === "library" && <LibraryView />}
        {(currentView === "resumes" || currentView === "editor") && (
          activeResumeId ? (
            <ResumeEditorView />
          ) : (
            <ResumesListView onOpenNewModal={() => setNewResumeModalOpen(true)} />
          )
        )}
        {currentView === "companies" && <CompaniesView />}
        {currentView === "templates" && (
          <TemplatesView onOpenNewResumeModal={() => setNewResumeModalOpen(true)} />
        )}
        {currentView === "settings" && <SettingsView />}
      </main>

      {/* Global New Resume Modal */}
      <NewResumeModal
        isOpen={newResumeModalOpen}
        onClose={() => setNewResumeModalOpen(false)}
      />

      {/* Quiet Footer (Hidden in print and editor to maximize workspace) */}
      {currentView !== "editor" && (
        <footer className="border-t border-[#B7CFC3] dark:border-slate-800 bg-[#E3EFE9]/90 dark:bg-slate-900/90 py-5 mt-12 text-xs text-[#2C5244] dark:text-slate-400 no-print print:hidden transition-colors">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="font-semibold text-[#0F2F26] dark:text-slate-300">
              Laburety · Biblioteca & Gestor Profesional de Currículums
            </span>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 font-mono-num">
              <span className="text-[#3E6556] dark:text-slate-500">
                Modo 100% manual activo · Arquitectura desacoplada
              </span>
              <span className="hidden sm:inline text-[#A8C4B6] dark:text-slate-700">·</span>

              {/* Indicador de última hora de guardado (Horizontal, compacto y sutil) */}
              <div
                className="flex items-center gap-1.5 text-xs text-[#2C5244] dark:text-slate-400 whitespace-nowrap bg-[#D5E5DD]/70 dark:bg-slate-800/70 border border-[#B5CEC2] dark:border-slate-700 px-2.5 py-1 rounded-lg"
                title="Autoguardado permanente en el almacenamiento local de tu navegador"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B63F6] shrink-0" />
                    <span className="font-medium text-[#0B63F6]">Guardando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Último guardado: {formattedTime ? formattedTime : "Al instante"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
