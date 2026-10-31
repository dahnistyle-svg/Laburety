import React, { useState, useMemo, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { TemplateId, Resume } from "../../types";
import { PaginatedA4Document, A4_WIDTH_PX } from "../preview/PaginatedA4Document";
import {
  Check,
  CheckCircle2,
  Sparkles,
  Layout,
  Plus,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Eye,
  FileCheck,
} from "lucide-react";

interface TemplatesViewProps {
  onOpenNewResumeModal: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onOpenNewResumeModal }) => {
  const { library, resumes, createResume, openEditorForResume, updateResume } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("harvard");
  const [zoom, setZoom] = useState<number>(85);
  const [selectedCvId, setSelectedCvId] = useState<string>(() => {
    return resumes.length > 0 ? resumes[0].id : "library";
  });
  const [appliedSuccessMessage, setAppliedSuccessMessage] = useState<string | null>(null);

  const previewSheetRef = useRef<HTMLDivElement>(null);

  const templatesList: {
    id: TemplateId;
    name: string;
    category: string;
    description: string;
    features: string[];
    bestFor: string;
  }[] = [
    {
      id: "harvard",
      name: "Harvard Professional",
      category: "Académico · Sobrio · ATS 100%",
      description:
        "Inspirado en los estándares de las facultades de Harvard y universidades de la Ivy League. Formato clásico en una columna, divisores sutiles y serif refinado.",
      features: [
        "Estructura 100% amigable con sistemas de reclutamiento ATS",
        "Alta densidad de lectura sin fatiga visual",
        "Tipografía clásica EB Garamond",
        "Encabezados de sección con líneas horizontales formales",
      ],
      bestFor: "Perfiles ejecutivos, académicos, seguridad, ingeniería y cargos senior.",
    },
    {
      id: "executive",
      name: "Executive Corporate",
      category: "Corporativo · Distinguido",
      description:
        "Diseñado para directores, jefes de área y supervisores con trayectoria de liderazgo demostrable e impacto cuantificable.",
      features: [
        "Acento de color institucional en encabezados y detalles",
        "Línea de contacto estructurada a la derecha",
        "Bloques de logros destacados con barra vertical",
        "Excelente jerarquía visual para lectura rápida en 30 segundos",
      ],
      bestFor: "Jefaturas, gerencias, consultoría, banca y gestión de operaciones.",
    },
    {
      id: "ats",
      name: "ATS Minimal Clean",
      category: "Puro Texto · Cero Filtros",
      description:
        "Diseñado específicamente para portales de empleo corporativos con filtros automáticos que rechazan formatos gráficos complejos.",
      features: [
        "Sin tablas, fondos de color ni columnas flotantes",
        "Encabezados en mayúsculas semánticas estándar",
        "Viñetas y caracteres ASCII compatibles universalmente",
        "Máxima tasa de aprobación en escáneres ATS (Workday, Taleo, Greenhouse)",
      ],
      bestFor: "Postulaciones masivas en portales corporativos multinacionales.",
    },
  ];

  // Safeguard: Ensure valid selected CV
  const activeCvId = useMemo(() => {
    if (selectedCvId === "library") return "library";
    const exists = resumes.some((r) => r.id === selectedCvId);
    return exists ? selectedCvId : resumes[0]?.id || "library";
  }, [selectedCvId, resumes]);

  const targetCv = useMemo(() => {
    if (activeCvId === "library") return null;
    return resumes.find((r) => r.id === activeCvId) || null;
  }, [activeCvId, resumes]);

  // Synthetic full-library resume for previewing all raw items if requested
  const fullLibraryResume: Resume = useMemo(
    () => ({
      id: "preview-full-library",
      name: "Biblioteca Completa",
      objective: "Previsualización con todos los elementos registrados en tu biblioteca personal.",
      templateId: selectedTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      selectedProfileId: library.profileVariants?.[0]?.id,
      selectedExperienceIds: library.experiences.map((e) => e.id),
      selectedEducationIds: library.education.map((e) => e.id),
      selectedCourseIds: library.courses.map((c) => c.id),
      selectedCertificationIds: library.certifications.map((c) => c.id),
      selectedLanguageIds: library.languages.map((l) => l.id),
      selectedSkillIds: library.skills.map((s) => s.id),
      selectedToolIds: library.tools.map((t) => t.id),
      selectedAchievementIds: library.achievements.map((a) => a.id),
      selectedProjectIds: library.projects.map((p) => p.id),
      selectedReferenceIds: library.references.map((r) => r.id),
      selectedCustomSectionIds: library.customSections.map((s) => s.id),
      selectedCustomItemIds: library.customSections.flatMap((s) => s.items?.map((it) => it.id) || []),
      sectionOrder: [
        "about",
        "experience",
        "education",
        "skills",
        "courses",
        "certifications",
        "languages",
        "tools",
        "achievements",
        "projects",
        "references",
        ...library.customSections.map((s) => s.id),
      ],
      hiddenSections: [],
      sectionTitleOverrides: {},
      itemOverrides: {},
      coursesFormat: "compact-inline",
      coursesAlignment: "left",
      visualSettings: {
        fontFamily: "garamond",
        fontSize: "base",
        primaryColor: "#0f172a",
        secondaryColor: "#475569",
        spacing: "normal",
        margins: "normal",
        showPhoto: true,
        headerAlignment: "left",
      },
    }),
    [selectedTemplate, library]
  );

  // Resume used for preview: if a real CV is selected, respect all its options
  const previewResume: Resume = useMemo(() => {
    if (targetCv) {
      return {
        ...targetCv,
        templateId: selectedTemplate,
      };
    }
    return fullLibraryResume;
  }, [targetCv, selectedTemplate, fullLibraryResume]);

  const handleUseTemplate = () => {
    const tpl = templatesList.find((t) => t.id === selectedTemplate);
    const newCv = createResume({
      name: `CV ${tpl?.name.split(" ")[0]}`,
      objective: `Orientado a puestos afines a ${tpl?.name}`,
      templateId: selectedTemplate,
    });
    openEditorForResume(newCv.id);
  };

  const handleApplyTemplateToCurrentCv = () => {
    if (!targetCv) return;

    updateResume(targetCv.id, { templateId: selectedTemplate });
    const tplName = templatesList.find((t) => t.id === selectedTemplate)?.name || selectedTemplate;
    setAppliedSuccessMessage(`¡Plantilla "${tplName}" aplicada con éxito a "${targetCv.name}"!`);
    setTimeout(() => setAppliedSuccessMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Standardized (Estilo Empresas) */}
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#F2F7F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs transition-colors mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2F26] dark:text-white flex items-center gap-2">
                <span>Plantillas Profesionales</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B63F6] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                  {templatesList.length} formatos A4
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#3E6556] dark:text-slate-400 mt-0.5">
                Diseños calibrados para cumplir con las exigencias del mercado laboral y los escáneres ATS con paginación A4 real.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={onOpenNewResumeModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 active:translate-y-[1px] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Crear CV con Plantilla</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Sticky Template Selector, Right Real A4 Paginated Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Template Cards List & Actions (Sticky with independent scroll) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:pr-2 space-y-4">
          {/* Notification feedback when template is applied */}
          {appliedSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs text-emerald-900 dark:text-emerald-100 flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold leading-tight">{appliedSuccessMessage}</span>
            </div>
          )}

          {templatesList.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-left bg-[#F2F7F4] hover:bg-[#F8FCFA] dark:bg-slate-800 ${
                  isSelected
                    ? "border-[#0D7A5F] shadow-md ring-2 ring-[#0D7A5F]/20 dark:border-emerald-500"
                    : "border-[#B8D0C4] hover:border-[#8AB5A1] dark:border-slate-700 shadow-2xs"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <h3 className="text-base font-bold text-[#0F2F26] dark:text-white">{tpl.name}</h3>
                    <span className="text-xs text-[#527969] dark:text-slate-400 font-mono-num font-medium">
                      {tpl.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0D7A5F] dark:bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#284E42] dark:text-slate-300 mt-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="mt-3 pt-3 border-t border-[#D5E5DD] dark:border-slate-700 space-y-1">
                  <div className="text-[11px] font-semibold text-[#0F2F26] dark:text-slate-200">
                    Ideal para: <span className="font-normal text-[#3E6556] dark:text-slate-400">{tpl.bestFor}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Action Buttons Box */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleUseTemplate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0B63F6] hover:bg-blue-600 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Crear Nuevo CV con esta plantilla</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {targetCv ? (
              <button
                onClick={handleApplyTemplateToCurrentCv}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E9F3EE] hover:bg-[#DCEBE3] dark:bg-slate-800 dark:hover:bg-slate-750 text-[#0F2F26] dark:text-slate-200 border border-[#B8D0C4] hover:border-[#8AB5A1] dark:border-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                title={`Cambiar la plantilla de "${targetCv.name}" a "${templatesList.find((t) => t.id === selectedTemplate)?.name}"`}
              >
                <Check className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400" />
                <span>Aplicar plantilla a "{targetCv.name}"</span>
              </button>
            ) : (
              <div className="p-2.5 bg-[#E9F3EE]/80 dark:bg-slate-800/50 rounded-xl border border-[#B8D0C4] dark:border-slate-700 text-center">
                <p className="text-[11px] text-[#3E6556] dark:text-slate-400">
                  💡 Selecciona uno de tus CVs arriba a la derecha para aplicarle esta plantilla en 1 clic.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live A4 Paginated Preview (individual sheets identical to Editor) */}
        <div className="lg:col-span-7 bg-[#C8DBD1]/60 dark:bg-slate-900/60 rounded-2xl border border-[#B8D0C4] dark:border-slate-800 shadow-inner flex flex-col overflow-hidden">
          {/* Top Preview Controls Bar: CV Selector & Zoom Controls */}
          <div className="bg-[#E3EFE9] dark:bg-slate-900 border-b border-[#B7CFC3] dark:border-slate-800 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 no-print">
            {/* Previsualizar con: Selector */}
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Eye className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
              <label htmlFor="preview-cv-select" className="text-xs font-bold text-[#0F2F26] dark:text-slate-200 shrink-0">
                Previsualizar con:
              </label>
              <select
                id="preview-cv-select"
                value={activeCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                className="text-xs font-semibold bg-[#FAFCFB] dark:bg-slate-800 border border-[#A8C4B6] dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[#0F2F26] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F] cursor-pointer max-w-[220px] sm:max-w-xs truncate"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    📄 {r.name}
                  </option>
                ))}
                <option value="library">
                  📚 Biblioteca completa (modo compacto)
                </option>
              </select>
            </div>

            {/* Zoom Controls (75%, 85%, 100%) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-[#527969] dark:text-slate-400 hidden sm:inline mr-1">
                Zoom:
              </span>
              <div className="flex items-center bg-[#D5E5DD] dark:bg-slate-800 border border-[#B5CEC2] dark:border-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                  disabled={zoom <= 50}
                  className="p-1 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 rounded text-[#0F2F26] dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {[75, 85, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setZoom(preset)}
                    className={`px-2 py-0.5 text-xs font-mono-num font-semibold rounded-md transition-colors cursor-pointer ${
                      zoom === preset
                        ? "bg-[#0B63F6] text-white shadow-2xs"
                        : "text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700"
                    }`}
                    title={`Zoom al ${preset}%`}
                  >
                    {preset}%
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(125, prev + 10))}
                  disabled={zoom >= 125}
                  className="p-1 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 rounded text-[#0F2F26] dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Viewport: Real A4 Paginated Document */}
          <div className="p-4 sm:p-8 flex flex-col items-center justify-start overflow-x-auto min-h-[620px]">
            <div
              style={{
                width: `${Math.round(A4_WIDTH_PX * (zoom / 100))}px`,
                display: "flex",
                justifyContent: "center",
                transition: "width 0.15s ease",
              }}
            >
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  width: `${A4_WIDTH_PX}px`,
                  transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <PaginatedA4Document
                  resume={previewResume}
                  library={library}
                  containerRef={previewSheetRef}
                />
              </div>
            </div>
          </div>

          {/* Bottom Advice Strip */}
          <div className="px-4 py-2.5 bg-[#E3EFE9]/80 dark:bg-slate-900 border-t border-[#B7CFC3] dark:border-slate-800 text-xs text-[#3E6556] dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 no-print">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#0D7A5F] dark:text-emerald-400 shrink-0" />
              <span>Hojas A4 individuales con paginación real calibradas para lectura humana y sistemas ATS.</span>
            </div>
            <span className="text-[11px] text-[#527969] dark:text-slate-500 font-mono-num">
              Dimensiones: 794px × 1123px (A4 Estándar)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
