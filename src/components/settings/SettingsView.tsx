import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BackupManagementCard } from "../common/BackupManagementCard";
import { LaburetyMascot } from "../brand/LaburetyMascot";
import { LaburetyLogoText } from "../brand/LaburetyLogoText";
import {
  RotateCcw,
  Trash2,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Upload,
  Settings,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { aiSettings, resetDemoData, clearAllData } = useApp();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Standardized (Estilo Empresas) */}
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#F2F7F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs transition-colors mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2F26] dark:text-white">
                Configuración
              </h1>
              <p className="text-xs sm:text-sm text-[#3E6556] dark:text-slate-400 mt-0.5">
                Ajustes de identidad visual, respaldo, persistencia de datos y servicios de Laburety.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: BRAND IDENTITY & MASCOT */}
      <div className="bg-[#F2F7F4] dark:bg-slate-800 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 p-6 shadow-2xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#D5E5DD] dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2F26] dark:text-white">
                Identidad Visual y Mascota ("Laburety")
              </h2>
              <p className="text-xs text-[#3E6556] dark:text-slate-400">
                Logotipo oficial bicolor con punto turquesa en la "y" y personaje del CV en movimiento.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 bg-gradient-to-r from-blue-50/50 via-white to-neutral-50 dark:from-slate-900/60 dark:via-slate-800 dark:to-slate-900/60 rounded-xl border border-[#B8D0C4] dark:border-slate-700">
          <div className="flex items-center gap-5">
            <LaburetyMascot size={72} allowUpload={true} />
            <div>
              <LaburetyLogoText size="md" showTagline={true} />
              <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-1 max-w-sm">
                Haz clic sobre el ícono de la cámara en la mascota para subir tu archivo PNG personalizado o restaurar la versión vectorial original.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => {
                // Find and trigger the camera button or open mascot modal
                const cameraBtn = document.querySelector('button[title="Personalizar imagen de la mascota"]') as HTMLButtonElement;
                if (cameraBtn) cameraBtn.click();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Gestionar Imagen Mascota</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: BACKUP & DATA PERSISTENCE */}
      <BackupManagementCard />

      {/* SECTION 2: ARTIFICIAL INTELLIGENCE CONFIGURATION (CRITICAL SPEC REQUIREMENT) */}
      <div className="bg-[#F2F7F4] dark:bg-slate-800 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-[#D5E5DD] dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D5E5DD] dark:bg-slate-700 flex items-center justify-center text-[#0F2F26] dark:text-slate-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2F26] dark:text-white">Inteligencia Artificial</h2>
              <p className="text-xs text-[#3E6556] dark:text-slate-400">
                Módulo desacoplado de asistencia laboral.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0F2F26] dark:text-slate-200 bg-[#D5E5DD] dark:bg-slate-700 px-3 py-1 rounded-full">
              ESTADO: {aiSettings.enabled ? "ACTIVADA" : "DESACTIVADA"}
            </span>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="p-4 bg-[#E9F3EE] dark:bg-slate-900/60 rounded-xl border border-[#B2CCC0] dark:border-slate-700 text-xs text-[#284E42] dark:text-slate-300 space-y-2">
          <div className="flex items-start gap-2 text-[#0F2F26] dark:text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Principio Fundamental: Funcionamiento 100% Manual en V1</span>
          </div>
          <p className="leading-relaxed">
            La aplicación está construida sobre una arquitectura modular desacoplada. Toda la
            gestión de biblioteca, creación de currículums, selección de elementos, personalización de
            títulos, previsualización en tiempo real y exportación a PDF funciona de manera autónoma
            sin ninguna dependencia de servicios de Inteligencia Artificial ni proveedores externos.
          </p>
        </div>

        {/* Feature Switches (Visual checkmarks ready for future activation) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2F26] dark:text-slate-300">
            Funcionalidades de IA en preparación
          </h3>

          <div className="space-y-2">
            {[
              {
                id: "textImprovement",
                title: "Mejora y pulido de redacción profesional",
                desc: "Ajuste de tono (ejecutivo, técnico o conciso) sin alterar los datos reales.",
                enabled: aiSettings.textImprovement,
              },
              {
                id: "resumeAnalysis",
                title: "Análisis de consistencia y ATS",
                desc: "Auditoría de palabras clave, legibilidad y detección de información faltante.",
                enabled: aiSettings.resumeAnalysis,
              },
              {
                id: "jobMatching",
                title: "Adaptación de CV a oferta laboral",
                desc: "Comparación entre la descripción de un puesto y los elementos de tu biblioteca.",
                enabled: aiSettings.jobMatching,
              },
              {
                id: "suggestions",
                title: "Sugerencia de competencias relacionadas",
                desc: "Identificación de habilidades clave a partir de tu experiencia registrada.",
                enabled: aiSettings.suggestions,
              },
              {
                id: "profileGeneration",
                title: "Propuesta de perfil profesional",
                desc: "Generación de síntesis ejecutiva basada exclusivamente en tu historial real.",
                enabled: aiSettings.profileGeneration,
              },
            ].map((feat) => (
              <div
                key={feat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#B8D0C4] dark:border-slate-700 bg-white/70 dark:bg-slate-900/60"
              >
                <div>
                  <span className="text-xs font-semibold text-[#0F2F26] dark:text-slate-200 block">
                    {feat.title}
                  </span>
                  <span className="text-[11px] text-[#3E6556] dark:text-slate-400">{feat.desc}</span>
                </div>
                <span className="text-[10px] font-mono-num text-[#527969] dark:text-slate-400 bg-[#D5E5DD] dark:bg-slate-800 px-2 py-0.5 rounded">
                  En preparación
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: DEMO DATA RESTORATION & DANGER ZONE */}
      <div className="bg-[#F2F7F4] dark:bg-slate-800 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#0F2F26] dark:text-white">Datos de Demostración</h3>
            <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-0.5">
              Restaura los datos de ejemplo iniciales (Martín Rossi) con fines de prueba o vacía la base de datos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#B8D0C4] hover:border-[#8AB5A1] rounded-xl text-xs font-medium text-[#0F2F26] dark:text-slate-200 bg-[#E9F3EE] dark:bg-slate-700 hover:bg-[#DCEBE3] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar datos de demostración</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar Todo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">¿Restaurar datos de demostración?</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Esta acción sobrescribirá tu biblioteca y tus currículums con los datos de ejemplo iniciales de Martín Rossi.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
              >
                Restaurar datos de demostración
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">¿Borrar todos los datos?</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Se vaciará toda tu biblioteca profesional y todos tus CVs creados. Te recomendamos descargar una copia de seguridad (.json) antes de continuar.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
              >
                Borrar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
