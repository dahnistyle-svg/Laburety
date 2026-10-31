import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { LaburetyBrand } from "../brand/LaburetyBrand";
import {
  FileText,
  LayoutDashboard,
  Settings,
  FolderKanban,
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
} from "lucide-react";

interface NavbarProps {
  onOpenNewResumeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { currentView, setCurrentView, activeResumeId, logout, syncStatus, triggerCloudSync } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Mi Panel", icon: LayoutDashboard },
    { id: "library", label: "Mi Información", icon: FolderKanban },
    { id: "resumes", label: "Mis CV", icon: FileText },
    { id: "companies", label: "Empresas", icon: Building2 },
    { id: "templates", label: "Plantillas", icon: FileText },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    if (viewId === "resumes") {
      if (activeResumeId) {
        setCurrentView("editor");
      } else {
        setCurrentView("resumes");
      }
    } else {
      setCurrentView(viewId as any);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E3EFE9]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#B7CFC3] dark:border-slate-800 shadow-sm no-print print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Official Brand & Mascot (Laburety) */}
        <div className="flex items-center gap-3 shrink-0 mr-3">
          <LaburetyBrand
            variant="navbar"
            onClick={() => setCurrentView("dashboard")}
          />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
          {navItems.map((item) => {
            const isActive =
              item.id === "resumes"
                ? currentView === "resumes" || currentView === "editor"
                : currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative inline-flex items-center justify-center whitespace-nowrap text-xs xl:text-sm rounded-xl font-semibold transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer ${
                  isActive
                    ? "p-[1.5px] overflow-hidden shadow-md shadow-blue-500/25"
                    : "px-3 py-1.5 xl:px-3.5 xl:py-2 border border-[#B5CEC2] dark:border-slate-700 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 hover:border-[#8AB5A1] dark:hover:border-blue-500 hover:text-[#0B63F6] dark:hover:text-blue-400 shadow-2xs"
                }`}
              >
                {/* Borde Luminoso Rotatorio para el botón activo */}
                {isActive && (
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#38bdf8_0%,#2563eb_40%,#93c5fd_75%,#38bdf8_100%)] pointer-events-none" />
                )}
                <span
                  className={
                    isActive
                      ? "relative z-10 flex items-center gap-1.5 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-[10.5px] bg-[#0B63F6] text-white w-full h-full"
                      : "flex items-center gap-1.5"
                  }
                >
                  {(item.id === "dashboard" || item.id === "companies") && (
                    <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                  )}
                  <span className="whitespace-nowrap">{item.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Minimalist SaaS Icons) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {/* Firebase Cloud Sync Status Pill */}
          <button
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all cursor-pointer select-none shadow-2xs ${
              syncStatus.state === "syncing"
                ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                : syncStatus.state === "synced"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                : syncStatus.state === "error"
                ? "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                : "bg-[#D5E5DD] dark:bg-slate-800 border-[#B5CEC2] dark:border-slate-700 text-[#0F2F26] dark:text-slate-300"
            }`}
            onClick={() => triggerCloudSync()}
            title={
              syncStatus.state === "syncing"
                ? "Sincronizando con Cloud Firestore..."
                : syncStatus.state === "synced"
                ? `Guardado en la nube (Última sincronización: ${syncStatus.lastSyncedAt ? new Date(syncStatus.lastSyncedAt).toLocaleTimeString() : "reciente"})`
                : syncStatus.state === "error"
                ? "Error al conectar con la nube. Clic para reintentar."
                : "Guardado local. Clic para sincronizar a la nube."
            }
          >
            {syncStatus.state === "syncing" ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap">Sincronizando...</span>
              </>
            ) : syncStatus.state === "synced" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap flex items-center gap-1">
                  Nube conectada
                </span>
              </>
            ) : syncStatus.state === "error" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap">Reintentar nube</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap">Guardado local</span>
              </>
            )}
          </button>
          {/* Dark / Light Mode Selector Button (Icon Only) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#0F2F26] dark:text-slate-200 bg-[#D5E5DD]/70 dark:bg-slate-800/70 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 border border-[#B5CEC2] dark:border-slate-700 transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center"
            title="Cambiar tema"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[#0F2F26] animate-in spin-in-180 duration-300 shrink-0" />
            )}
          </button>

          {/* Cerrar Sesión Button (Icon Only) */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-[#D5E5DD]/70 dark:bg-slate-800/70 hover:bg-red-50 dark:hover:bg-red-950/40 border border-[#B5CEC2] dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/40 transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0F2F26] dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#D5E5DD] dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#B7CFC3] dark:border-slate-800 bg-[#E3EFE9] dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive =
              item.id === "resumes"
                ? currentView === "resumes" || currentView === "editor"
                : currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative w-full flex items-center text-sm font-semibold transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer rounded-xl ${
                  isActive
                    ? "p-[1.5px] overflow-hidden shadow-md shadow-blue-500/25"
                    : "px-4 py-2.5 border border-[#B5CEC2] dark:border-slate-800 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 hover:text-[#0B63F6] shadow-2xs"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#38bdf8_0%,#2563eb_40%,#93c5fd_75%,#38bdf8_100%)] pointer-events-none" />
                )}
                <span
                  className={
                    isActive
                      ? "relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-[10.5px] bg-[#0B63F6] text-white w-full h-full"
                      : "flex items-center gap-3 w-full"
                  }
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#2C5244] dark:text-slate-400"}`} />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#B7CFC3] dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
