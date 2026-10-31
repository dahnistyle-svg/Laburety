import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { TemplateId, Resume } from "../../types";
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  Archive,
  Calendar,
  CheckCircle,
  Layers,
  Sparkles,
  Download,
  Search,
  X,
} from "lucide-react";

const normalizeText = (text: string = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

interface ResumesListViewProps {
  onOpenNewModal: () => void;
}

export const ResumesListView: React.FC<ResumesListViewProps> = ({ onOpenNewModal }) => {
  const {
    resumes,
    duplicateResume,
    deleteResume,
    archiveResume,
    openEditorForResume,
    library,
    setActiveResumeId,
    setCurrentView,
  } = useApp();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const templateLabels: Record<TemplateId, string> = {
    harvard: "Harvard Professional",
    executive: "Executive Corporate",
    ats: "ATS Minimal Clean",
  };

  const resumeToDelete = resumes.find((r) => r.id === deleteConfirmId);

  // Real-time filtered resumes
  const filteredResumes = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!q) {
      return resumes;
    }

    return resumes.filter((resume) => {
      const nameNorm = normalizeText(resume.name);
      const objNorm = normalizeText(resume.objective || "");
      const titleNorm = normalizeText(resume.customProfessionalTitle || "");
      const descNorm = normalizeText(resume.description || "");
      const aboutNorm = normalizeText(resume.customAboutSummary || "");
      const notesNorm = normalizeText(resume.notes || "");
      const tplIdNorm = normalizeText(resume.templateId);
      const tplNameNorm = normalizeText(templateLabels[resume.templateId] || "");

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
    });
  }, [resumes, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Standardized (Estilo Empresas) */}
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#F2F7F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs transition-colors mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2F26] dark:text-white flex items-center gap-2">
                <span>Mis Currículums (CVs)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B63F6] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                  {resumes.length} {resumes.length === 1 ? "currículum" : "currículums"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#3E6556] dark:text-slate-400 mt-0.5">
                Gestiona versiones específicas de tu CV orientadas a diferentes industrias y puestos de trabajo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-auto shrink-0">
          {/* Compact Real-Time Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#527969] dark:text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar CV (ej: Supervisor)..."
              className="text-xs pl-8 pr-7 py-2 w-48 sm:w-60 bg-[#FAFCFB] dark:bg-slate-900/60 border border-[#A8C4B6] dark:border-slate-700 rounded-xl text-[#0F2F26] dark:text-slate-100 placeholder-[#769C8C] dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0D7A5F] transition-all shadow-2xs"
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
            onClick={onOpenNewModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 active:translate-y-[1px] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo CV</span>
          </button>
        </div>
      </div>

      {/* CV Grid */}
      {resumes.length === 0 ? (
        <div className="text-center py-16 bg-[#F2F7F4] dark:bg-slate-800 border border-[#B8D0C4] dark:border-slate-700 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
          <FileText className="w-12 h-12 text-[#527969] dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F2F26] dark:text-white">
            Todavía no tienes ningún CV creado
          </h3>
          <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-1 mb-6">
            A partir de tu biblioteca profesional, crea tu primer CV seleccionando solo las experiencias y habilidades relevantes para tu objetivo.
          </p>
          <button
            onClick={onOpenNewModal}
            className="px-4 py-2 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            + Crear mi primer CV
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-16 bg-[#F2F7F4] dark:bg-slate-800 border border-[#B8D0C4] dark:border-slate-700 rounded-2xl p-8 max-w-xl mx-auto shadow-xs space-y-3">
          <Search className="w-12 h-12 text-[#527969] dark:text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-[#0F2F26] dark:text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const expCount = resume.selectedExperienceIds.length;
            const skillCount = resume.selectedSkillIds.length;
            const eduCount = resume.selectedEducationIds.length;
            const isArchived = resume.status === "archived";

            return (
              <div
                key={resume.id}
                className={`bg-[#F2F7F4] hover:bg-[#F8FCFA] dark:bg-slate-800 dark:hover:bg-slate-800/90 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-md ${
                  isArchived
                    ? "border-[#B8D0C4] opacity-60 bg-[#EAF3EE]/50"
                    : "border-[#B8D0C4] hover:border-[#8AB5A1] dark:border-slate-700 dark:hover:border-slate-600"
                }`}
              >
                {/* Card Top Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono-num font-medium text-[#0F2F26] dark:text-slate-300 bg-[#E3EFE9] dark:bg-slate-700 border border-[#B8D0C4]/70 dark:border-transparent px-2 py-0.5 rounded">
                      {templateLabels[resume.templateId]}
                    </span>
                    {isArchived && (
                      <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Archivado
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#0F2F26] group-hover:text-[#0D7A5F] dark:text-white dark:group-hover:text-blue-300 transition-colors line-clamp-1">
                    {resume.name}
                  </h3>

                  {resume.objective ? (
                    <p className="text-xs text-[#3E6556] dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {resume.objective}
                    </p>
                  ) : (
                    <p className="text-xs text-[#527969] dark:text-slate-500 mt-1 italic">
                      Sin objetivo específico definido
                    </p>
                  )}

                  {/* Metadata Chips (Clean unboxed style) */}
                  <div className="flex items-center gap-2 text-xs text-[#527969] dark:text-slate-400 mt-4 pt-3 border-t border-[#B8D0C4]/60 dark:border-slate-700/60 font-mono-num">
                    <span>{expCount} experiencias</span>
                    <span aria-hidden="true">·</span>
                    <span>{skillCount} habilidades</span>
                    <span aria-hidden="true">·</span>
                    <span>{eduCount} títulos</span>
                  </div>

                  <div className="text-[11px] text-[#527969] dark:text-slate-500 font-mono-num mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Modificado: {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-[#EAF3EE] dark:bg-slate-800/80 border-t border-[#B8D0C4]/60 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openEditorForResume(resume.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar CV</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateResume(resume.id)}
                      className="p-1.5 hover:bg-[#D5E5DD] dark:hover:bg-slate-700 rounded-lg text-[#2C5244] dark:text-slate-300 transition-colors cursor-pointer"
                      title="Duplicar CV"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => archiveResume(resume.id)}
                      className="p-1.5 hover:bg-[#D5E5DD] dark:hover:bg-slate-700 rounded-lg text-[#2C5244] dark:text-slate-300 transition-colors cursor-pointer"
                      title={isArchived ? "Desarchivar CV" : "Archivar CV"}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(resume.id)}
                      className="p-1.5 hover:bg-red-50 text-[#527969] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar CV"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && resumeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-base text-neutral-900">
              ¿Eliminar este currículum?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Vas a eliminar <span className="font-semibold text-neutral-900">"{resumeToDelete.name}"</span>. 
              Los datos en tu biblioteca profesional <strong className="text-neutral-900">no se perderán</strong>, únicamente se borrará esta versión específica de CV.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteResume(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Eliminar CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
