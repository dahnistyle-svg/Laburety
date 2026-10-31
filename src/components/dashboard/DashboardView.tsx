import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { LaburetyBrand } from "../brand/LaburetyBrand";
import {
  FileText,
  Plus,
  Briefcase,
  Award,
  ArrowRight,
  Edit3,
  Copy,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Building2,
  Search,
  X,
} from "lucide-react";
import { TemplateId } from "../../types";

const normalizeText = (text: string = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

interface DashboardViewProps {
  onOpenNewResumeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenNewResumeModal }) => {
  const {
    resumes,
    library,
    companies,
    openEditorForResume,
    duplicateResume,
    updateResume,
    setCurrentView,
  } = useApp();

  const [expandedNotesIds, setExpandedNotesIds] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const templateNames: Record<TemplateId, string> = {
    harvard: "Harvard Professional",
    executive: "Executive Corporate",
    ats: "ATS Minimal Clean",
  };

  // Calculate library completeness
  const completenessChecks = [
    Boolean(library.personal.firstName && library.personal.lastName),
    Boolean((library.profileVariants && library.profileVariants.length > 0 && library.profileVariants[0].title) || library.personal.professionalTitle),
    Boolean(library.contact.email && library.contact.phone),
    Boolean(library.about.content && library.about.content.length > 50),
    library.experiences.length > 0,
    library.education.length > 0,
    library.skills.length >= 3,
    library.languages.length > 0,
  ];
  const completedCount = completenessChecks.filter(Boolean).length;
  const completenessPercent = Math.round((completedCount / completenessChecks.length) * 100);

  // Filtered resumes in real time based on search query
  const filteredResumes = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!q) {
      return [...resumes]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6);
    }

    return [...resumes]
      .filter((resume) => {
        const nameNorm = normalizeText(resume.name);
        const objNorm = normalizeText(resume.objective || "");
        const titleNorm = normalizeText(resume.customProfessionalTitle || "");
        const descNorm = normalizeText(resume.description || "");
        const aboutNorm = normalizeText(resume.customAboutSummary || "");
        const notesNorm = normalizeText(resume.notes || "");
        const tplIdNorm = normalizeText(resume.templateId);
        const tplNameNorm = normalizeText(templateNames[resume.templateId] || "");

        return (
          nameNorm.includes(q) ||
          objNorm.includes(q) ||
          titleNorm.includes(q) ||
          descNorm.includes(q) ||
          aboutNorm.includes(q) ||
          notesNorm.includes(q) ||
          tplIdNorm.includes(q) ||
          tplNameNorm.includes(q)
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [resumes, searchQuery]);

  const toggleNotes = (resumeId: string) => {
    setExpandedNotesIds((prev) => ({
      ...prev,
      [resumeId]: !prev[resumeId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header: Official Laburety Brand & Mascot */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-[length:200%_auto] animate-[bg-gradient_8s_linear_infinite] border border-blue-900/40 p-6 sm:p-7 rounded-2xl shadow-lg transition-colors overflow-hidden">
        <div className="flex items-center">
          <LaburetyBrand
            variant="hero"
            showTagline={true}
            allowMascotUpload={true}
            themeMode="petrol-banner"
          />
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={onOpenNewResumeModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo CV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent CVs in List format (Left 8 cols), Compact Metric Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Resumes as a Vertical List */}
        <div className="lg:col-span-8">
          {/* Section Header: Fixed height & aligned with Right Column Header */}
          <div className="min-h-[48px] flex flex-wrap sm:flex-nowrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F2F26] dark:text-white leading-tight">
                Últimos CVs Modificados
              </h2>
              <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-1 leading-tight">
                Accede rápidamente a tus versiones y gestiona tus notas de postulación.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end">
              {/* Compact Real-Time Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-[#527969] dark:text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar CV (ej: Supervisor)..."
                  className="text-xs pl-8 pr-7 py-1.5 w-44 sm:w-56 bg-[#FAFCFB] dark:bg-slate-800 border border-[#A8C4B6] dark:border-slate-700 rounded-xl text-[#0F2F26] dark:text-slate-100 placeholder-[#769C8C] dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0D7A5F] transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 text-[#527969] hover:text-[#0F2F26] dark:text-slate-400 dark:hover:text-white p-0.5 rounded cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setCurrentView("resumes")}
                className="text-xs font-semibold text-[#0B63F6] dark:text-[#38BDF8] hover:text-[#084ec7] dark:hover:text-blue-300 transition-colors flex items-center gap-1 shrink-0 pb-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>Ver todos ({resumes.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List of Recent CV Rows or Search Results */}
          {resumes.length === 0 ? (
            <div className="bg-[#F2F7F4] dark:bg-slate-800 p-8 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 text-center space-y-3">
              <FileText className="w-10 h-10 text-[#527969] dark:text-slate-500 mx-auto" />
              <h3 className="font-bold text-sm text-[#0F2F26] dark:text-white">
                Aún no tienes currículums creados
              </h3>
              <p className="text-xs text-[#3E6556] dark:text-slate-400 max-w-sm mx-auto">
                Crea tu primera versión a partir de los datos cargados en tu biblioteca profesional.
              </p>
              <button
                onClick={onOpenNewResumeModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear mi primer CV</span>
              </button>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="bg-[#F2F7F4] dark:bg-slate-800 p-8 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 text-center space-y-3">
              <Search className="w-10 h-10 text-[#527969] dark:text-slate-500 mx-auto" />
              <h3 className="font-bold text-sm text-[#0F2F26] dark:text-white">
                No se encontraron CVs con "{searchQuery}"
              </h3>
              <p className="text-xs text-[#3E6556] dark:text-slate-400 max-w-sm mx-auto">
                Prueba buscando por otro término, nombre del puesto, plantilla o contenido de tus anotaciones.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D5E5DD] hover:bg-[#C8DBD1] text-[#0F2F26] dark:bg-slate-700 dark:hover:bg-slate-650 dark:text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Limpiar búsqueda</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResumes.map((resume) => {
                const hasNotes = Boolean(resume.notes && resume.notes.trim().length > 0);
                const isNotesOpen = Boolean(expandedNotesIds[resume.id]);

                return (
                  <div
                    key={resume.id}
                    className="bg-[#F2F7F4] hover:bg-[#F8FCFA] dark:bg-slate-800 dark:hover:bg-slate-800/90 rounded-xl border border-[#B8D0C4] hover:border-[#8AB5A1] dark:border-slate-700 dark:hover:border-slate-600 shadow-2xs transition-all overflow-hidden"
                  >
                    {/* Main Row Content */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: CV Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-sm sm:text-base text-[#0F2F26] dark:text-white truncate">
                            {resume.name}
                          </h3>
                          <span className="text-[10px] font-mono-num font-medium bg-[#E3EFE9] dark:bg-slate-700 text-[#0F2F26] dark:text-slate-300 px-2 py-0.5 rounded border border-[#B8D0C4]/70 dark:border-transparent">
                            {templateNames[resume.templateId]}
                          </span>
                          {hasNotes && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Con anotación
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#3E6556] dark:text-slate-400 line-clamp-1 mb-2.5">
                          {resume.objective || resume.description || "Sin objetivo específico definido"}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#527969] dark:text-slate-400 font-mono-num">
                          <span>{resume.selectedExperienceIds.length} exp.</span>
                          <span>·</span>
                          <span>{resume.selectedSkillIds.length} hab.</span>
                          <span>·</span>
                          <span>{resume.selectedEducationIds.length} form.</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#527969] dark:text-slate-500">
                            <Clock className="w-3 h-3" />
                            {new Date(resume.updatedAt).toLocaleDateString([], {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions (Anotaciones, Editar, Duplicar) */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {/* Button: Anotaciones */}
                        <button
                          onClick={() => toggleNotes(resume.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isNotesOpen
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 shadow-2xs"
                              : hasNotes
                              ? "bg-amber-50/70 dark:bg-slate-700/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-700"
                              : "bg-[#E3EFE9] dark:bg-slate-700/50 text-[#0F2F26] dark:text-slate-300 border-[#B5CEC2] dark:border-slate-700 hover:bg-[#F2F8F5] dark:hover:bg-slate-700"
                          }`}
                          title="Ver o escribir notas y recordatorios de postulación para este CV"
                        >
                          <span>📝</span>
                          <span>Anotaciones</span>
                          {hasNotes && !isNotesOpen && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          )}
                          {isNotesOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#527969] dark:text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#527969] dark:text-slate-400" />
                          )}
                        </button>

                        {/* Button: Editar */}
                        <button
                          onClick={() => openEditorForResume(resume.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                          title="Abrir editor completo de este CV"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* Button: Duplicar */}
                        <button
                          onClick={() => duplicateResume(resume.id)}
                          className="p-1.5 text-[#2C5244] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#E3EFE9] dark:hover:bg-slate-700 rounded-lg transition-colors border border-[#B5CEC2] dark:border-slate-700 cursor-pointer"
                          title="Duplicar este CV como una nueva versión"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Notes Accordion Panel */}
                    {isNotesOpen && (
                      <div className="px-4 pb-4 pt-3 bg-[#EAF3EE] dark:bg-slate-900/60 border-t border-[#B8D0C4] dark:border-slate-700/80 animate-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2F26] dark:text-slate-300">
                            <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                            <span>Anotaciones y Seguimiento de Postulaciones</span>
                          </div>
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium font-mono-num">
                            <CheckCircle2 className="w-3 h-3" />
                            Guardado automático
                          </span>
                        </div>

                        <textarea
                          value={resume.notes || ""}
                          onChange={(e) => updateResume(resume.id, { notes: e.target.value })}
                          placeholder="Escribe aquí anotaciones o recordatorios para este CV (ej: Enviado el 15/03 a Empresa X para puesto Y, falta actualizar curso, entrevista agendada para el lunes...)"
                          rows={3}
                          className="w-full text-xs p-3 rounded-lg border border-[#A8C4B6] dark:border-slate-700 bg-[#FAFCFB] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-100 placeholder-[#769C8C] dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0D7A5F] dark:focus:ring-blue-500 transition-colors resize-y leading-relaxed"
                        />

                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#527969] dark:text-slate-500">
                          <span>Tus anotaciones se guardan de inmediato asociadas a este CV</span>
                          {resume.notes && (
                            <button
                              onClick={() => updateResume(resume.id, { notes: "" })}
                              className="text-[#527969] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Borrar nota
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Reallocated Compact 4 Metric Cards in Lateral Widget Sidebar */}
        <div className="lg:col-span-4">
          {/* Section Header: Exactly matching left header height min-h-[48px], items-end, and mb-4 */}
          <div className="min-h-[48px] flex items-end justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 leading-tight">
                Métricas del Sistema
              </h3>
              <p className="text-xs text-[#3E6556] dark:text-slate-500 mt-1 leading-tight">
                Resumen de biblioteca
              </p>
            </div>
            <span className="text-[11px] text-[#527969] dark:text-slate-500 font-mono-num pb-0.5">
              En tiempo real
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Metric 1: Resumes */}
            <div className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-3.5 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 block truncate">
                  Mis CVs Creados
                </span>
                <div className="text-xl font-bold text-[#0F2F26] dark:text-white font-mono-num mt-0.5">
                  {resumes.length}
                </div>
                <span className="text-[10px] text-[#527969] dark:text-slate-500 block truncate">
                  Versiones independientes
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            {/* Metric: Empresas en Radar */}
            <div
              onClick={() => setCurrentView("companies")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCurrentView("companies");
                }
              }}
              className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-3.5 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#0B63F6] dark:hover:border-blue-500 hover:shadow-sm transition-all active:scale-[0.98] group"
              title="Haz clic para ver el Radar de Empresas y Postulaciones"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 block truncate group-hover:text-[#0B63F6] dark:group-hover:text-blue-400 transition-colors">
                    Empresas en Radar
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B63F6] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
                    Nuevo
                  </span>
                </div>
                <div className="text-xl font-bold text-[#0F2F26] dark:text-white font-mono-num mt-0.5">
                  {companies.length}
                </div>
                <span className="text-[10px] text-[#3E6556] dark:text-slate-400 block truncate">
                  {companies.filter((c) => c.status === "enviado").length} con CV enviado · Ver listado →
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0 group-hover:bg-[#0B63F6] group-hover:text-white transition-colors shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            {/* Metric 2: Experiences */}
            <div className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-3.5 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 block truncate">
                  Biblioteca Laboral
                </span>
                <div className="text-xl font-bold text-[#0F2F26] dark:text-white font-mono-num mt-0.5">
                  {library.experiences.length}
                </div>
                <span className="text-[10px] text-[#527969] dark:text-slate-500 block truncate">
                  Puestos y roles guardados
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            {/* Metric 3: Skills & Competencies */}
            <div className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-3.5 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 block truncate">
                  Competencias
                </span>
                <div className="text-xl font-bold text-[#0F2F26] dark:text-white font-mono-num mt-0.5">
                  {library.skills.length + library.tools.length}
                </div>
                <span className="text-[10px] text-[#527969] dark:text-slate-500 block truncate">
                  Habilidades y herramientas
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Metric 4: AI Status */}
            <div className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-3.5 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2C5244] dark:text-slate-400 block truncate">
                  Inteligencia Artificial
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-slate-500" />
                  <span className="text-xs font-bold text-[#0F2F26] dark:text-slate-300 font-mono tracking-wide">
                    DESACTIVADA
                  </span>
                </div>
                <span className="text-[10px] text-[#527969] dark:text-slate-500 block truncate">
                  Modo 100% manual activo
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Completeness Card */}
          <div className="bg-gradient-to-br from-[#E9F3EE] to-[#DFEDE6] dark:from-slate-800 dark:to-slate-800/90 p-4 rounded-xl border border-[#B2CCC0] dark:border-slate-700 shadow-2xs space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2F26] dark:text-slate-300">
                Salud de tu Biblioteca
              </h3>
              <span className="text-xs font-bold text-[#0B63F6] dark:text-[#38BDF8] font-mono-num">
                {completenessPercent}%
              </span>
            </div>

            <div className="w-full bg-[#D5E5DD] dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0B63F6] dark:bg-[#38BDF8] h-full rounded-full transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-[#3E6556] dark:text-slate-400 leading-relaxed">
              Completa tu información maestra para confeccionar rápidamente versiones a medida.
            </p>

            <button
              onClick={() => setCurrentView("library")}
              className="text-xs font-semibold text-[#0B63F6] dark:text-[#38BDF8] hover:text-[#084ec7] dark:hover:text-blue-300 flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              <span>Gestionar biblioteca</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
