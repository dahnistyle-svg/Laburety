import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ResumePreviewSheet } from "../preview/ResumePreviewSheet";
import { TemplateId, CoursesDisplayFormat, CustomSectionItem } from "../../types";
import {
  ArrowLeft,
  Sliders,
  Type,
  ListOrdered,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Check,
  Palette,
  FileText,
  Copy,
  Plus,
  User,
  Upload,
  Trash2,
  BookOpen,
  Search,
  List,
  LayoutGrid,
  AlignLeft,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  Layers,
  ExternalLink,
  CheckSquare,
  X,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { processImageFile } from "../../utils/imageUtils";
import { CoursesOrderManager } from "./CoursesOrderManager";

interface CoursesFormatSelectorProps {
  format: CoursesDisplayFormat;
  includeInstitution: boolean;
  alignment?: "justify" | "left";
  onChangeFormat: (fmt: CoursesDisplayFormat) => void;
  onChangeIncludeInstitution: (val: boolean) => void;
  onChangeAlignment?: (alignment: "justify" | "left") => void;
}

const CoursesFormatSelector: React.FC<CoursesFormatSelectorProps> = ({
  format,
  includeInstitution,
  alignment = "justify",
  onChangeFormat,
  onChangeIncludeInstitution,
  onChangeAlignment,
}) => {
  return (
    <div className="bg-neutral-50/90 border border-neutral-200/90 rounded-xl p-2.5 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-neutral-500" />
          Estilo de visualización:
        </span>
        <span className="text-[10px] text-neutral-400 font-medium">
          {format === "detailed" && "1 fila por curso"}
          {format === "compact-grid" && "Grilla 2 columnas"}
          {format === "compact-inline" && "Párrafo continuo"}
        </span>
      </div>

      {/* 3 Opciones principales */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-lg border border-neutral-200 text-xs">
        <button
          type="button"
          onClick={() => onChangeFormat("detailed")}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
            format === "detailed"
              ? "bg-neutral-900 text-white shadow-2xs font-semibold"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
          title="Detallado (Lista): 1 curso por fila con Nombre, Institución y Fecha completa"
        >
          <List className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Detallado</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeFormat("compact-grid")}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
            format === "compact-grid"
              ? "bg-neutral-900 text-white shadow-2xs font-semibold"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
          title="Compacto (2 Columnas): Ahorra 50% de espacio vertical"
        >
          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">2 Columnas</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeFormat("compact-inline")}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
            format === "compact-inline"
              ? "bg-neutral-900 text-white shadow-2xs font-semibold"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
          title="Párrafo continuo: Formato en bloque fluido separado por viñetas"
        >
          <AlignLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Continuo</span>
        </button>
      </div>

      {/* Sub-selectores para modo Continuo */}
      {format === "compact-inline" && (
        <div className="pt-2 border-t border-neutral-200/70 space-y-2 text-[11px] animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <span className="text-neutral-600 font-medium">Contenido en párrafo:</span>
            <div className="flex items-center bg-white border border-neutral-200 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => onChangeIncludeInstitution(true)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  includeInstitution
                    ? "bg-neutral-900 text-white font-semibold shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                title="Muestra Nombre + (Institución)"
              >
                Nombre + Institución
              </button>
              <button
                type="button"
                onClick={() => onChangeIncludeInstitution(false)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  !includeInstitution
                    ? "bg-neutral-900 text-white font-semibold shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                title="Solo nombres de los cursos (Máximo ahorro de espacio)"
              >
                Solo nombres (Ultra)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionAccordionHeaderProps {
  title: string;
  countBadge?: string;
  isExpanded: boolean;
  onToggle: () => void;
  subtitle?: string;
}

const SectionAccordionHeader: React.FC<SectionAccordionHeaderProps> = ({
  title,
  countBadge,
  isExpanded,
  onToggle,
  subtitle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full p-3 sm:px-4 sm:py-3.5 flex items-center justify-between cursor-pointer select-none text-left transition-colors border border-[#ADC8BA] dark:border-slate-700 border-l-4 border-l-[#0D7A5F] dark:border-l-emerald-500 text-[#0B2B22] dark:text-white ${
        isExpanded
          ? "bg-[#DCEBE3] dark:bg-slate-800"
          : "bg-[#DCEBE3]/80 hover:bg-[#DCEBE3] dark:bg-slate-800 dark:hover:bg-slate-700/70"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <span className="text-xs font-bold text-[#0D7A5F] dark:text-emerald-400 shrink-0 select-none">
          {isExpanded ? "▼" : "▶"}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold uppercase tracking-wide text-xs sm:text-sm text-[#0B2B22] dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#164E3F] dark:text-emerald-300 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {countBadge && (
        <span className="shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAFCFB] dark:bg-slate-900 border border-[#A8C4B6] dark:border-slate-700 text-[#0D7A5F] dark:text-emerald-400 shadow-2xs font-mono-num">
          {countBadge}
        </span>
      )}
    </button>
  );
};

export const ResumeEditorView: React.FC = () => {
  const {
    activeResume,
    library,
    updateResume,
    toggleItemSelectionInResume,
    setItemOverrideInResume,
    removeItemOverrideInResume,
    setSectionTitleOverrideInResume,
    toggleSectionVisibilityInResume,
    reorderSectionsInResume,
    updateVisualSettings,
    setCustomItemsOrderInResume,
    selectAllCustomItemsInResume,
    updatePersonal,
    setCurrentView,
    setActiveResumeId,
    setLibraryActiveTab,
    addProfileVariant,
    isSaving,
    lastSaved,
  } = useApp();

  const formattedTime = lastSaved
    ? new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const [activeTab, setActiveTab] = useState<"content" | "structure" | "design">("content");
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedOverrides, setExpandedOverrides] = useState<Record<string, boolean>>({});
  const photoFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estados para nuevo perfil inline en el editor
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfileTitle, setNewProfileTitle] = useState("");
  const [newProfileSubtitle, setNewProfileSubtitle] = useState("");
  const [newProfileContent, setNewProfileContent] = useState("");
  const [clearSuccessNotice, setClearSuccessNotice] = useState(false);

  // Fallback de seguridad: Si el CV activo tiene seleccionada la plantilla retirada "modern", cambiarla automáticamente a "harvard"
  useEffect(() => {
    if (activeResume && (activeResume.templateId as string) === "modern") {
      updateResume(activeResume.id, { templateId: "harvard" });
    }
  }, [activeResume, updateResume]);

  const handleClearAllSelections = () => {
    if (!activeResume) return;
    updateResume(activeResume.id, {
      selectedExperienceIds: [],
      selectedEducationIds: [],
      selectedCourseIds: [],
      selectedCertificationIds: [],
      selectedLanguageIds: [],
      selectedSkillIds: [],
      selectedToolIds: [],
      selectedAchievementIds: [],
      selectedProjectIds: [],
      selectedReferenceIds: [],
      selectedCustomSectionIds: [],
      selectedCustomItemIds: [],
      selectedProfileId: "none",
      customAboutSummary: "",
    });
    setClearSuccessNotice(true);
    setTimeout(() => setClearSuccessNotice(false), 3500);
  };

  // Estado de acordeón desplegable para cada sección en "Contenido y Selección"
  // Por defecto sólo el primer bloque ("profile") permanece abierto para evitar scroll innecesario
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profile: true,
    experience: false,
    education: false,
    skills: false,
    tools: false,
    certifications: false,
    courses: false,
    languages: false,
    achievements: false,
    projects: false,
    references: false,
    customSections: false,
  });

  const toggleSectionAccordion = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const areAllSectionsExpanded = Object.values(expandedSections).every(Boolean);

  const handleToggleAllSections = () => {
    const nextVal = !areAllSectionsExpanded;
    setExpandedSections({
      profile: nextVal,
      experience: nextVal,
      education: nextVal,
      skills: nextVal,
      tools: nextVal,
      certifications: nextVal,
      courses: nextVal,
      languages: nextVal,
      achievements: nextVal,
      projects: nextVal,
      references: nextVal,
      customSections: nextVal,
    });
  };

  // Sincronización dinámica inmediata: asegurar que cualquier sección personalizada esté en sectionOrder
  React.useEffect(() => {
    if (!activeResume || !library.customSections || library.customSections.length === 0) return;
    const missingSecIds = library.customSections
      .map((cs) => cs.id)
      .filter((id) => !activeResume.sectionOrder.includes(id));

    if (missingSecIds.length > 0) {
      const allItemIds = library.customSections.flatMap((cs) => cs.items.map((it) => it.id));
      const currentSelected = activeResume.selectedCustomItemIds || allItemIds;
      const missingItems = library.customSections
        .filter((cs) => missingSecIds.includes(cs.id))
        .flatMap((cs) => cs.items.map((it) => it.id));

      updateResume(activeResume.id, {
        sectionOrder: [...activeResume.sectionOrder, ...missingSecIds],
        selectedCustomSectionIds: Array.from(
          new Set([...(activeResume.selectedCustomSectionIds || []), ...missingSecIds])
        ),
        selectedCustomItemIds: Array.from(new Set([...currentSelected, ...missingItems])),
      });
    }
  }, [activeResume?.id, library.customSections]);

  // Cursos individuales: estado de acordeón en Estructura y búsqueda en Contenido
  const [coursesStructureExpanded, setCoursesStructureExpanded] = useState<boolean>(true);
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>("");

  // IDs de cursos seleccionados seguro (con retrocompatibilidad)
  const currentSelectedCourseIds: string[] = Array.isArray(activeResume?.selectedCourseIds)
    ? activeResume.selectedCourseIds
    : Array.isArray((activeResume as any)?.selectedCourses)
    ? (activeResume as any).selectedCourses
    : library.courses.map((c) => c.id);

  const handleUpdateCoursesOrderAndSelection = (newSelectedIds: string[], newOrder: string[]) => {
    if (!activeResume) return;
    updateResume(activeResume.id, {
      selectedCourseIds: newSelectedIds,
      selectedCourses: newSelectedIds,
      coursesOrder: newOrder,
    } as any);
  };

  const handleToggleCourse = (courseId: string) => {
    if (!activeResume) return;
    const exists = currentSelectedCourseIds.includes(courseId);
    let nextIds: string[];
    if (exists) {
      nextIds = currentSelectedCourseIds.filter((id) => id !== courseId);
    } else {
      const fullOrder = activeResume.coursesOrder || library.courses.map((c) => c.id);
      const orderIndex = new Map(fullOrder.map((id, idx) => [id, idx]));
      nextIds = [...currentSelectedCourseIds, courseId].sort((a, b) => {
        const idxA = orderIndex.has(a) ? orderIndex.get(a)! : 9999;
        const idxB = orderIndex.has(b) ? orderIndex.get(b)! : 9999;
        return idxA - idxB;
      });
    }
    updateResume(activeResume.id, {
      selectedCourseIds: nextIds,
      selectedCourses: nextIds,
    } as any);
  };

  const handleSelectAllCourses = () => {
    if (!activeResume) return;
    const fullOrder = activeResume.coursesOrder || library.courses.map((c) => c.id);
    const orderIndex = new Map(fullOrder.map((id, idx) => [id, idx]));
    const allIds = library.courses.map((c) => c.id).sort((a, b) => {
      const idxA = orderIndex.has(a) ? orderIndex.get(a)! : 9999;
      const idxB = orderIndex.has(b) ? orderIndex.get(b)! : 9999;
      return idxA - idxB;
    });
    updateResume(activeResume.id, {
      selectedCourseIds: allIds,
      selectedCourses: allIds,
      coursesOrder: allIds,
    } as any);
  };

  const handleDeselectAllCourses = () => {
    if (!activeResume) return;
    updateResume(activeResume.id, {
      selectedCourseIds: [],
      selectedCourses: [],
    } as any);
  };

  // Reordenar sub-ítems en Experiencias, Formación, Certificaciones, etc. dentro del CV actual
  const handleMoveSubItem = (
    section: "experience" | "education" | "certification" | "skill",
    id: string,
    direction: "up" | "down" | "top"
  ) => {
    if (!activeResume) return;
    let key: "selectedExperienceIds" | "selectedEducationIds" | "selectedCertificationIds" | "selectedSkillIds";
    if (section === "experience") key = "selectedExperienceIds";
    else if (section === "education") key = "selectedEducationIds";
    else if (section === "certification") key = "selectedCertificationIds";
    else if (section === "skill") key = "selectedSkillIds";
    else return;

    const currentIds = [...((activeResume[key] || []) as string[])];
    const idx = currentIds.indexOf(id);
    if (idx === -1) return;

    if (direction === "top") {
      currentIds.splice(idx, 1);
      currentIds.unshift(id);
    } else if (direction === "up" && idx > 0) {
      const temp = currentIds[idx - 1];
      currentIds[idx - 1] = currentIds[idx];
      currentIds[idx] = temp;
    } else if (direction === "down" && idx < currentIds.length - 1) {
      const temp = currentIds[idx + 1];
      currentIds[idx + 1] = currentIds[idx];
      currentIds[idx] = temp;
    } else {
      return;
    }

    updateResume(activeResume.id, { [key]: currentIds });
  };

  // Control de elementos de Secciones Personalizadas (VOLUNTARIADO, OTROS, etc.)
  const currentSelectedCustomItemIds: string[] =
    activeResume?.selectedCustomItemIds ||
    library.customSections.flatMap((cs) => cs.items.map((it) => it.id));

  const handleToggleCustomItem = (itemId: string) => {
    if (!activeResume) return;
    toggleItemSelectionInResume(activeResume.id, "customItem", itemId);
  };

  const handleMoveCustomItem = (
    sectionId: string,
    currentOrderedItems: CustomSectionItem[],
    index: number,
    direction: "up" | "down" | "top"
  ) => {
    if (!activeResume) return;
    const itemIds = currentOrderedItems.map((it) => it.id);
    const nextIds = [...itemIds];
    if (direction === "top") {
      const [moved] = nextIds.splice(index, 1);
      nextIds.unshift(moved);
    } else if (direction === "up" && index > 0) {
      const temp = nextIds[index];
      nextIds[index] = nextIds[index - 1];
      nextIds[index - 1] = temp;
    } else if (direction === "down" && index < nextIds.length - 1) {
      const temp = nextIds[index];
      nextIds[index] = nextIds[index + 1];
      nextIds[index + 1] = temp;
    } else {
      return;
    }
    setCustomItemsOrderInResume(activeResume.id, sectionId, nextIds);
  };

  const filteredCourses = library.courses.filter((course) => {
    if (!courseSearchQuery.trim()) return true;
    const q = courseSearchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      course.institution.toLowerCase().includes(q) ||
      (course.date && course.date.toLowerCase().includes(q))
    );
  });

  const currentCoursesFormat: CoursesDisplayFormat = activeResume?.coursesFormat || "detailed";
  const currentCoursesInlineIncludeInstitution: boolean =
    activeResume?.coursesInlineIncludeInstitution !== false;
  const currentCoursesAlignment: "justify" | "left" = activeResume?.coursesAlignment || "justify";

  const handleChangeCoursesFormat = (fmt: CoursesDisplayFormat) => {
    if (!activeResume) return;
    updateResume(activeResume.id, { coursesFormat: fmt });
  };

  const handleChangeCoursesInlineIncludeInstitution = (val: boolean) => {
    if (!activeResume) return;
    updateResume(activeResume.id, { coursesInlineIncludeInstitution: val });
  };

  const handleChangeCoursesAlignment = (alignment: "justify" | "left") => {
    if (!activeResume) return;
    updateResume(activeResume.id, { coursesAlignment: alignment });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const base64 = await processImageFile(file);
      updatePersonal({ photoUrl: base64 });
      if (activeResume) {
        updateVisualSettings(activeResume.id, { showPhoto: true });
      }
    } catch (err: any) {
      console.error("Error al procesar la foto:", err);
    } finally {
      setIsUploadingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
    }
  };

  if (!activeResume) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-neutral-800">No hay ningún CV seleccionado</h2>
        <p className="text-sm text-neutral-500 mt-1 mb-4">
          Selecciona un CV de tu lista o crea uno nuevo para comenzar a editar.
        </p>
        <button
          onClick={() => {
            setActiveResumeId(null);
            setCurrentView("resumes");
          }}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
        >
          Volver a Mis CV
        </button>
      </div>
    );
  }

  const toggleOverrideAccordion = (id: string) => {
    setExpandedOverrides((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const effectiveSectionOrder = React.useMemo(() => {
    const currentOrder = activeResume?.sectionOrder || [];
    const missing = library.customSections
      .map((cs) => cs.id)
      .filter((id) => !currentOrder.includes(id));
    return missing.length > 0 ? [...currentOrder, ...missing] : currentOrder;
  }, [activeResume?.sectionOrder, library.customSections]);

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (!activeResume) return;
    const order = [...effectiveSectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    reorderSectionsInResume(activeResume.id, order);
  };

  return (
    <div className="h-[calc(100vh-4rem)] print:h-auto print:overflow-visible print:bg-white flex flex-col overflow-hidden bg-[#D2E2DA] dark:bg-slate-900">
      {/* Subheader bar */}
      <div className="bg-[#E3EFE9] dark:bg-slate-900 border-b border-[#B7CFC3] dark:border-slate-800 px-4 py-2.5 flex items-center justify-between no-print print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveResumeId(null);
              setCurrentView("resumes");
            }}
            className="p-1.5 hover:bg-[#D5E5DD] dark:hover:bg-slate-800 rounded-lg text-[#0F2F26] dark:text-slate-300 transition-colors cursor-pointer"
            title="Volver a la lista de CVs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeResume.name}
                onChange={(e) => updateResume(activeResume.id, { name: e.target.value })}
                className="font-bold text-sm sm:text-base text-[#0F2F26] dark:text-white border-b border-transparent hover:border-[#A8C4B6] focus:border-[#0D7A5F] focus:outline-none transition-colors px-1 bg-transparent"
                placeholder="Nombre del CV"
              />
              <span className="text-[11px] text-[#527969] dark:text-slate-400 font-mono-num hidden sm:inline">
                ({activeResume.templateId.toUpperCase()})
              </span>
            </div>
            {activeResume.objective && (
              <p className="text-xs text-[#3E6556] dark:text-slate-400 truncate max-w-md px-1">
                {activeResume.objective}
              </p>
            )}
          </div>
        </div>

        {/* Mobile View Toggle Segmented Button */}
        <div className="md:hidden flex items-center bg-[#D5E5DD] dark:bg-slate-800 p-0.5 rounded-lg border border-[#B5CEC2] dark:border-slate-700">
          <button
            onClick={() => setMobileTab("editor")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mobileTab === "editor" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mobileTab === "preview" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600"
            }`}
          >
            Vista Previa
          </button>
        </div>

        {/* Desktop Quick Info */}
        <div className="hidden md:flex items-center gap-3 text-xs text-[#527969] dark:text-slate-400 font-mono-num">
          <span>{activeResume.selectedExperienceIds.length} experiencias</span>
          <span>·</span>
          <span>{activeResume.selectedSkillIds.length} habilidades</span>
          <span>·</span>
          <span>{activeResume.selectedEducationIds.length} títulos</span>
          <span>·</span>
          <span
            className="flex items-center gap-1.5 whitespace-nowrap text-slate-600 dark:text-slate-400"
            title="Autoguardado permanente en el almacenamiento local de tu navegador"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B63F6] shrink-0" />
                <span className="text-[#0B63F6] font-medium">Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Guardado {formattedTime ? `a las ${formattedTime}` : ""}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Workspace: Left Editor, Right Preview */}
      <div className="flex-1 w-full min-w-0 flex overflow-hidden print:overflow-visible print:block">
        {/* LEFT PANEL: Editor */}
        <div
          className={`transition-all duration-300 ease-in-out relative flex flex-col shrink-0 bg-[#F2F7F4] dark:bg-slate-900 border-[#B8D0C4] dark:border-slate-800 no-print print:hidden ${
            isSidebarOpen
              ? "w-full md:w-[480px] lg:w-[520px] opacity-100 border-r"
              : "w-0 opacity-0 overflow-hidden border-r-0"
          } ${mobileTab === "preview" ? "hidden md:flex" : "flex"}`}
        >
          <div className="w-full md:w-[480px] lg:w-[520px] flex-1 flex flex-col overflow-hidden">
            {/* Editor Tabs Navigation with Inline Collapse Button */}
            <div className="flex items-center justify-between border-b border-[#B8D0C4] dark:border-slate-800 bg-[#E3EFE9] dark:bg-slate-900/80 p-2 gap-1.5 shrink-0">
              <div className="flex-1 flex items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-2.5 text-xs lg:text-[13px] font-semibold tracking-tight rounded-xl transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer text-center ${
                    activeTab === "content"
                      ? "bg-[#0B63F6] text-white border border-[#0B63F6] shadow-md shadow-blue-500/25"
                      : "border border-[#B5CEC2] dark:border-slate-700 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 hover:border-[#8AB5A1] dark:hover:border-blue-500 hover:text-[#0B63F6] dark:hover:text-blue-400 shadow-2xs"
                  }`}
                >
                  <span className="leading-tight">Contenido y Selección</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("structure")}
                  className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-2.5 text-xs lg:text-[13px] font-semibold tracking-tight rounded-xl transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer text-center ${
                    activeTab === "structure"
                      ? "bg-[#0B63F6] text-white border border-[#0B63F6] shadow-md shadow-blue-500/25"
                      : "border border-[#B5CEC2] dark:border-slate-700 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 hover:border-[#8AB5A1] dark:hover:border-blue-500 hover:text-[#0B63F6] dark:hover:text-blue-400 shadow-2xs"
                  }`}
                >
                  <span className="leading-tight">Estructura y Títulos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-2.5 text-xs lg:text-[13px] font-semibold tracking-tight rounded-xl transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer text-center ${
                    activeTab === "design"
                      ? "bg-[#0B63F6] text-white border border-[#0B63F6] shadow-md shadow-blue-500/25"
                      : "border border-[#B5CEC2] dark:border-slate-700 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F2F8F5] dark:hover:bg-slate-700 hover:border-[#8AB5A1] dark:hover:border-blue-500 hover:text-[#0B63F6] dark:hover:text-blue-400 shadow-2xs"
                  }`}
                >
                  <span className="leading-tight">Diseño y Plantilla</span>
                </button>
              </div>

              {/* Botón inline para plegar el panel izquierdo */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="hidden md:flex h-8 w-8 ml-2 cursor-pointer flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-sm transition-all no-print"
                title="Ocultar panel lateral (Maximizar CV)"
                aria-label="Colapsar panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* TAB 1: Content & Selective Reusability + Overrides */}
            {activeTab === "content" && (
              <div className="space-y-4">
                {/* Control Bar: Expandir / Contraer todo y Limpiar selección */}
                <div className="flex flex-col gap-2.5 p-3.5 bg-neutral-50/90 dark:bg-slate-800/80 rounded-xl border border-neutral-200/90 dark:border-slate-700/80 shadow-2xs">
                  {/* Fila 1: Título y subtítulo en ancho completo */}
                  <div className="w-full min-w-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white leading-tight">
                      Reutilización Inteligente de Información
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                      Marca qué elementos incluir en este CV y personalízalos a medida.
                    </p>
                  </div>

                  {/* Fila 2: Botones compactos alineados a la derecha */}
                  <div className="flex items-center justify-end gap-2 pt-0.5 border-t border-neutral-200/60 dark:border-slate-700/60 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={handleClearAllSelections}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all active:scale-95 shadow-2xs cursor-pointer whitespace-nowrap"
                      title="Desmarcar todos los ítems de este CV sin borrar nada de tu biblioteca"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Vaciar CV</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleAllSections}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-[#0B63F6] dark:hover:text-blue-400 transition-all active:scale-95 shadow-2xs cursor-pointer whitespace-nowrap"
                    >
                      {areAllSectionsExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Contraer todo</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Expandir todo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {clearSuccessNotice && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-center justify-between animate-in fade-in duration-200">
                    <span>✓ CV limpiado con éxito. Ahora está en blanco, listo para activar lo que necesites.</span>
                    <button onClick={() => setClearSuccessNotice(false)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold cursor-pointer">×</button>
                  </div>
                )}

                {/* ENCABEZADO Y PERFIL PROFESIONAL SECTION */}
                {(() => {
                  const availableProfiles = library.profileVariants && library.profileVariants.length > 0
                    ? library.profileVariants
                    : [
                        {
                          id: "profile-default-1",
                          title: library.personal.professionalTitle || "Supervisor de Operaciones y Seguridad",
                          content: library.about.content || "",
                          isDefault: true,
                        },
                      ];

                  const currentSelectedProfile =
                    activeResume.selectedProfileId === "none"
                      ? null
                      : availableProfiles.find((p) => p.id === activeResume.selectedProfileId) || null;

                  const currentCustomTitle =
                    activeResume.customProfessionalTitle !== undefined
                      ? activeResume.customProfessionalTitle
                      : currentSelectedProfile?.title || "";

                  const currentCustomSummary =
                    activeResume.customAboutSummary !== undefined
                      ? activeResume.customAboutSummary
                      : currentSelectedProfile?.content || currentSelectedProfile?.summary || "";

                  return (
                    <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                      <SectionAccordionHeader
                        title="ENCABEZADO Y PERFIL PROFESIONAL"
                        subtitle={currentSelectedProfile?.title ? `Perfil activo: ${currentSelectedProfile.title}` : "Sin perfil preseleccionado"}
                        countBadge={currentSelectedProfile?.title ? "1 activo" : "0 activo"}
                        isExpanded={Boolean(expandedSections.profile)}
                        onToggle={() => toggleSectionAccordion("profile")}
                      />

                      {expandedSections.profile && (
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-slate-700/80 gap-2 flex-wrap">
                            <p className="text-[11px] text-neutral-500 dark:text-slate-400">
                              Selecciona el perfil base o crea uno nuevo para este CV.
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowNewProfileForm((prev) => !prev)}
                                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Nuevo Perfil</span>
                              </button>

                              <button
                                onClick={() => {
                                  setCurrentView("library");
                                  setLibraryActiveTab("about");
                                }}
                                className="text-[11px] font-semibold text-[#0B63F6] dark:text-[#38BDF8] hover:text-[#084ec7] flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <span>Gestionar perfiles</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Formulario Inline para Crear Nuevo Perfil */}
                          {showNewProfileForm && (
                            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in-50 duration-200">
                              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200 dark:border-emerald-800/80">
                                <span className="font-bold text-xs text-[#0B2B22] dark:text-emerald-300 flex items-center gap-1.5">
                                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                                  Crear Nuevo Perfil Profesional (se guarda en tu biblioteca)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowNewProfileForm(false)}
                                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                                  Título Profesional del Nuevo Perfil *
                                </label>
                                <input
                                  type="text"
                                  value={newProfileTitle}
                                  onChange={(e) => setNewProfileTitle(e.target.value)}
                                  placeholder="Ej. Recepcionista de Hotel, Supervisor de Hotelería..."
                                  className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                                  Subtítulo o Especialidad (Opcional)
                                </label>
                                <input
                                  type="text"
                                  value={newProfileSubtitle}
                                  onChange={(e) => setNewProfileSubtitle(e.target.value)}
                                  placeholder="Ej. Front Desk & Atención a Huéspedes"
                                  className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                                  Resumen / Perfil Profesional *
                                </label>
                                <textarea
                                  rows={4}
                                  value={newProfileContent}
                                  onChange={(e) => setNewProfileContent(e.target.value)}
                                  placeholder="Redacta la síntesis profesional para este perfil..."
                                  className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-neutral-900 dark:text-white focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                                />
                              </div>

                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setShowNewProfileForm(false)}
                                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-slate-600 text-xs font-medium text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 cursor-pointer"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  disabled={!newProfileTitle.trim()}
                                  onClick={() => {
                                    if (!newProfileTitle.trim()) return;
                                    const newVariant = addProfileVariant({
                                      title: newProfileTitle.trim(),
                                      subtitle: newProfileSubtitle.trim() || undefined,
                                      summary: newProfileContent.trim(),
                                      content: newProfileContent.trim(),
                                      isDefault: false,
                                    });
                                    updateResume(activeResume.id, {
                                      selectedProfileId: newVariant.id,
                                      customProfessionalTitle: newVariant.title,
                                      customAboutSummary: newVariant.content || newVariant.summary || "",
                                    });
                                    setNewProfileTitle("");
                                    setNewProfileSubtitle("");
                                    setNewProfileContent("");
                                    setShowNewProfileForm(false);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#0D7A5F] hover:bg-[#0A644D] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                  Guardar y Seleccionar en este CV
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Selector de Perfiles Guardados */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="text-xs font-semibold text-neutral-700 dark:text-slate-300 block">
                                Seleccionar Perfil Guardado de la Biblioteca:
                              </label>
                              {activeResume.selectedProfileId && activeResume.selectedProfileId !== "none" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateResume(activeResume.id, {
                                      selectedProfileId: "none",
                                      customAboutSummary: "",
                                    });
                                  }}
                                  className="text-[10px] text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                                >
                                  Desmarcar perfil
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {/* Opción clara: Sin perfil / En blanco */}
                              <div
                                onClick={() => {
                                  updateResume(activeResume.id, {
                                    selectedProfileId: "none",
                                    customAboutSummary: "",
                                  });
                                }}
                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                                  activeResume.selectedProfileId === "none" || !activeResume.selectedProfileId
                                    ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-[#0D7A5F] dark:border-emerald-500 shadow-2xs"
                                    : "bg-neutral-50/60 dark:bg-slate-900/60 border-neutral-200 dark:border-slate-700 hover:bg-neutral-100/70 dark:hover:bg-slate-700/50"
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-neutral-900 dark:text-white">
                                      📄 Sin perfil / En blanco
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D5E5DD] dark:bg-emerald-900 text-[#0D7A5F] dark:text-emerald-300 font-bold font-mono">
                                      Limpio
                                    </span>
                                  </div>
                                  <p className="text-neutral-500 dark:text-slate-400 text-[11px] leading-relaxed">
                                    No incluye perfil predeterminado en el CV. Puedes escribir un título o resumen exclusivo abajo o dejarlo en blanco.
                                  </p>
                                </div>
                                <div className="shrink-0 mt-0.5">
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                                      activeResume.selectedProfileId === "none" || !activeResume.selectedProfileId
                                        ? "bg-[#0D7A5F] border-[#0D7A5F] text-white"
                                        : "border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                    }`}
                                  >
                                    {(activeResume.selectedProfileId === "none" || !activeResume.selectedProfileId) && (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    )}
                                  </span>
                                </div>
                              </div>

                              {availableProfiles.map((p) => {
                                const isSelected = activeResume.selectedProfileId === p.id;

                                return (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      if (isSelected) {
                                        updateResume(activeResume.id, {
                                          selectedProfileId: "none",
                                          customAboutSummary: "",
                                        });
                                      } else {
                                        updateResume(activeResume.id, {
                                          selectedProfileId: p.id,
                                          customProfessionalTitle: p.title,
                                          customAboutSummary: p.content || p.summary || "",
                                        });
                                      }
                                    }}
                                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                                      isSelected
                                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0B63F6] dark:border-blue-500 shadow-2xs"
                                        : "bg-neutral-50/60 dark:bg-slate-900/60 border-neutral-200 dark:border-slate-700 hover:bg-neutral-100/70 dark:hover:bg-slate-700/50"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-bold text-neutral-900 dark:text-white">
                                          {p.title || "Sin título definido"}
                                        </span>
                                        {p.subtitle && (
                                          <span className="text-[11px] text-[#0B63F6] dark:text-blue-400 font-medium">
                                            • {p.subtitle}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-neutral-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {p.content || p.summary || "Sin resumen redactado"}
                                      </p>
                                    </div>

                                    <div className="shrink-0 mt-0.5">
                                      <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                                          isSelected
                                            ? "bg-[#0B63F6] border-[#0B63F6] text-white"
                                            : "border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                                        }`}
                                      >
                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Edición Rápida Exclusiva para este CV */}
                          <div className="pt-3 border-t border-neutral-100 dark:border-slate-700 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300">
                                Edición Exclusiva para este CV
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                Se guarda solo en este CV
                              </span>
                            </div>

                            {/* Campo 1: Título Profesional en este CV */}
                            <div>
                              <label className="text-xs font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                                Título Profesional en este CV (se muestra debajo de tu nombre en el encabezado A4)
                              </label>
                              <input
                                type="text"
                                value={currentCustomTitle}
                                onChange={(e) => {
                                  updateResume(activeResume.id, {
                                    customProfessionalTitle: e.target.value,
                                  });
                                }}
                                placeholder="Ej. Experto en Marketing, Especialista en Atención al Cliente..."
                                className="w-full text-xs p-2.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-lg text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-[#0B63F6] transition-colors"
                              />
                            </div>

                            {/* Campo 2: Resumen / Perfil Profesional en este CV */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-neutral-700 dark:text-slate-300">
                                  Resumen / Perfil Profesional en este CV (sección PERFIL PROFESIONAL)
                                </label>
                                <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-mono-num">
                                  {currentCustomSummary.length} caracteres
                                </span>
                              </div>
                              <textarea
                                rows={5}
                                value={currentCustomSummary}
                                onChange={(e) => {
                                  updateResume(activeResume.id, {
                                    customAboutSummary: e.target.value,
                                  });
                                }}
                                placeholder="Describe el perfil profesional adaptado específicamente a este CV..."
                                className="w-full text-xs p-2.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-lg text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-[#0B63F6] leading-relaxed transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Experiencia Laboral Section */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="EXPERIENCIAS LABORALES"
                    countBadge={`${activeResume.selectedExperienceIds.length} de ${library.experiences.length} activas`}
                    isExpanded={Boolean(expandedSections.experience)}
                    onToggle={() => toggleSectionAccordion("experience")}
                  />

                  {expandedSections.experience && (
                    <div className="p-3 space-y-2">
                      <div className="flex justify-end pb-1 border-b border-neutral-100 dark:border-slate-700/60">
                        <button
                          onClick={() => {
                            setCurrentView("library");
                            setLibraryActiveTab("experience");
                          }}
                          className="text-[11px] font-semibold text-[#0B63F6] dark:text-[#38BDF8] hover:text-[#084ec7] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Gestionar biblioteca</span>
                        </button>
                      </div>

                      <div className="divide-y divide-neutral-100 dark:divide-slate-700 p-1 space-y-1">
                        {library.experiences.length === 0 ? (
                          <p className="p-4 text-xs text-neutral-400 text-center">
                            No hay experiencias en la biblioteca.
                          </p>
                        ) : (
                          library.experiences.map((exp) => {
                            const isSelected = activeResume.selectedExperienceIds.includes(exp.id);
                            const override = activeResume.itemOverrides[exp.id];
                            const isExpanded = expandedOverrides[exp.id];

                            return (
                              <div
                                key={exp.id}
                                className={`p-3 rounded-lg border transition-all ${
                                  isSelected
                                    ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-xs"
                                    : "bg-neutral-50/60 dark:bg-slate-900/40 border-transparent opacity-60"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        toggleItemSelectionInResume(activeResume.id, "experience", exp.id)
                                      }
                                      className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                                    />
                                    <div>
                                      <div className="font-semibold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                                        <span>{override?.title || exp.role}</span>
                                        {override?.title && (
                                          <span className="text-[10px] text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-1 py-0.2 rounded font-mono">
                                            Personalizado
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-neutral-500 dark:text-slate-400">
                                        {exp.company} · {exp.startDate} - {exp.isCurrent ? "Actualidad" : exp.endDate}
                                      </div>
                                    </div>
                                  </label>

                                  {isSelected && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {/* Rank Badge & Move Up/Down / Top */}
                                      <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-slate-800 p-0.5 rounded-md border border-neutral-200 dark:border-slate-700">
                                        <span className="text-[10px] font-mono font-bold bg-neutral-900 dark:bg-slate-950 text-white px-1.5 py-0.2 rounded shadow-2xs">
                                          #{activeResume.selectedExperienceIds.indexOf(exp.id) + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveSubItem("experience", exp.id, "top")}
                                          disabled={activeResume.selectedExperienceIds.indexOf(exp.id) === 0}
                                          className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                          title="Poner primero (#1)"
                                        >
                                          <ChevronsUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveSubItem("experience", exp.id, "up")}
                                          disabled={activeResume.selectedExperienceIds.indexOf(exp.id) === 0}
                                          className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                          title="Subir posición en este CV"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveSubItem("experience", exp.id, "down")}
                                          disabled={
                                            activeResume.selectedExperienceIds.indexOf(exp.id) ===
                                            activeResume.selectedExperienceIds.length - 1
                                          }
                                          className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                          title="Bajar posición en este CV"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => toggleOverrideAccordion(exp.id)}
                                        className="text-xs text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white p-1 flex items-center gap-1 cursor-pointer"
                                        title="Personalizar texto solo para este CV"
                                      >
                                        <span className="text-[11px]">Ajustar para este CV</span>
                                        {isExpanded ? (
                                          <ChevronUp className="w-3.5 h-3.5" />
                                        ) : (
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Item Override Accordion */}
                                {isSelected && isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-slate-700 bg-neutral-50/70 dark:bg-slate-800/70 p-3 rounded-lg text-xs space-y-2.5">
                                    <div className="flex justify-between items-center text-[11px] text-neutral-600 dark:text-slate-300">
                                      <span className="font-semibold">
                                        Ajuste exclusivo para "{activeResume.name}"
                                      </span>
                                      {override && (
                                        <button
                                          onClick={() => removeItemOverrideInResume(activeResume.id, exp.id)}
                                          className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[10px] cursor-pointer"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                          <span>Restaurar valor original</span>
                                        </button>
                                      )}
                                    </div>

                                    <div>
                                      <label className="text-[11px] text-neutral-600 dark:text-slate-300 font-medium block mb-1">
                                        Título del puesto (Override):
                                      </label>
                                      <input
                                        type="text"
                                        value={override?.title !== undefined ? override.title : exp.role}
                                        onChange={(e) =>
                                          setItemOverrideInResume(activeResume.id, exp.id, {
                                            title: e.target.value,
                                          })
                                        }
                                        className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-neutral-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-neutral-800 text-neutral-900 dark:text-white"
                                        placeholder={exp.role}
                                      />
                                    </div>

                                    <div>
                                      <label className="text-[11px] text-neutral-600 dark:text-slate-300 font-medium block mb-1">
                                        Descripción o Enfoque (Override):
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={
                                          override?.description !== undefined
                                            ? override.description
                                            : exp.description
                                        }
                                        onChange={(e) =>
                                          setItemOverrideInResume(activeResume.id, exp.id, {
                                            description: e.target.value,
                                          })
                                        }
                                        className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-neutral-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-neutral-800 text-neutral-900 dark:text-white"
                                        placeholder={exp.description}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Formación Académica */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="FORMACIÓN ACADÉMICA"
                    countBadge={`${activeResume.selectedEducationIds.length} de ${library.education.length} activas`}
                    isExpanded={Boolean(expandedSections.education)}
                    onToggle={() => toggleSectionAccordion("education")}
                  />

                  {expandedSections.education && (
                    <div className="p-2 space-y-1">
                      {library.education.map((edu) => {
                        const isSelected = activeResume.selectedEducationIds.includes(edu.id);
                        return (
                          <div
                            key={edu.id}
                            className={`flex items-center justify-between gap-2.5 p-2.5 rounded-lg border transition-all ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 border-transparent opacity-60"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "education", edu.id)
                                }
                                className="mt-0.5 rounded text-neutral-900 cursor-pointer"
                              />
                              <div className="text-xs flex-1 min-w-0">
                                <span className="font-semibold text-neutral-900 dark:text-white block truncate">
                                  {edu.degree || edu.fieldOfStudy}
                                </span>
                                <span className="text-neutral-500 dark:text-slate-400 text-[11px] block truncate">
                                  {edu.institution} · {edu.startDate} - {edu.endDate || edu.status}
                                </span>
                              </div>
                            </label>

                            {isSelected && (
                              <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-slate-800 p-0.5 rounded-md border border-neutral-200 dark:border-slate-700 shrink-0">
                                <span className="text-[10px] font-mono font-bold bg-neutral-900 dark:bg-slate-950 text-white px-1.5 py-0.2 rounded shadow-2xs">
                                  #{activeResume.selectedEducationIds.indexOf(edu.id) + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("education", edu.id, "top");
                                  }}
                                  disabled={activeResume.selectedEducationIds.indexOf(edu.id) === 0}
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Poner primero (#1)"
                                >
                                  <ChevronsUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("education", edu.id, "up");
                                  }}
                                  disabled={activeResume.selectedEducationIds.indexOf(edu.id) === 0}
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Subir posición en este CV"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("education", edu.id, "down");
                                  }}
                                  disabled={
                                    activeResume.selectedEducationIds.indexOf(edu.id) ===
                                    activeResume.selectedEducationIds.length - 1
                                  }
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Bajar posición en este CV"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Habilidades & Competencias */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="COMPETENCIAS Y HABILIDADES"
                    countBadge={`${activeResume.selectedSkillIds.length} de ${library.skills.length} seleccionadas`}
                    isExpanded={Boolean(expandedSections.skills)}
                    onToggle={() => toggleSectionAccordion("skills")}
                  />
                  {expandedSections.skills && (
                    <div className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {library.skills.map((s) => {
                          const isSelected = activeResume.selectedSkillIds.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() =>
                                toggleItemSelectionInResume(activeResume.id, "skill", s.id)
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs"
                                  : "bg-white dark:bg-slate-700 text-neutral-600 dark:text-slate-200 border-neutral-200 dark:border-slate-600 hover:border-neutral-300"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{s.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {activeResume.selectedSkillIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-slate-700/80">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-neutral-700 dark:text-slate-300">
                              Orden en este CV ({activeResume.selectedSkillIds.length} activas):
                            </span>
                            <span className="text-[10px] text-neutral-400 dark:text-slate-400">
                              Reordena con las flechas
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                            {activeResume.selectedSkillIds.map((skillId, sIdx) => {
                              const skill = library.skills.find((s) => s.id === skillId);
                              if (!skill) return null;
                              const isFirst = sIdx === 0;
                              const isLast = sIdx === activeResume.selectedSkillIds.length - 1;
                              return (
                                <div
                                  key={skillId}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 dark:bg-slate-700 border border-neutral-200 dark:border-slate-600 text-xs shadow-2xs"
                                >
                                  <span className="font-mono text-[9px] font-bold bg-neutral-900 dark:bg-slate-900 text-white px-1 py-0.2 rounded">
                                    #{sIdx + 1}
                                  </span>
                                  <span className="font-semibold text-neutral-800 dark:text-slate-200 text-[11px]">{skill.name}</span>
                                  <div className="flex items-center gap-0.5 ml-1 border-l border-neutral-300 dark:border-slate-500 pl-1">
                                    <button
                                      type="button"
                                      onClick={() => handleMoveSubItem("skill", skillId, "top")}
                                      disabled={isFirst}
                                      className="p-0.5 rounded text-neutral-400 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                      title="Poner primera (#1)"
                                    >
                                      <ChevronsUp className="w-2.5 h-2.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveSubItem("skill", skillId, "up")}
                                      disabled={isFirst}
                                      className="p-0.5 rounded text-neutral-400 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                      title="Subir"
                                    >
                                      <ArrowUp className="w-2.5 h-2.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveSubItem("skill", skillId, "down")}
                                      disabled={isLast}
                                      className="p-0.5 rounded text-neutral-400 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                      title="Bajar"
                                    >
                                      <ArrowDown className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Herramientas y Software */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="HERRAMIENTAS"
                    countBadge={`${activeResume.selectedToolIds.length} de ${library.tools.length} seleccionadas`}
                    isExpanded={Boolean(expandedSections.tools)}
                    onToggle={() => toggleSectionAccordion("tools")}
                  />
                  {expandedSections.tools && (
                    <div className="p-3 flex flex-wrap gap-2">
                      {library.tools.map((t) => {
                        const isSelected = activeResume.selectedToolIds.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                              toggleItemSelectionInResume(activeResume.id, "tool", t.id)
                            }
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs"
                                : "bg-white dark:bg-slate-700 text-neutral-600 dark:text-slate-200 border-neutral-200 dark:border-slate-600 hover:border-neutral-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                      {library.tools.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400 w-full">
                          No hay herramientas cargadas en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificaciones */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="CERTIFICACIONES"
                    countBadge={`${(activeResume.selectedCertificationIds || []).length} de ${library.certifications.length} seleccionadas`}
                    isExpanded={Boolean(expandedSections.certifications)}
                    onToggle={() => toggleSectionAccordion("certifications")}
                  />
                  {expandedSections.certifications && (
                    <div className="p-2 space-y-1">
                      {library.certifications.map((c) => {
                        const isSelected = (activeResume.selectedCertificationIds || []).includes(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`flex items-center justify-between gap-2.5 p-2 rounded-lg border text-xs transition-colors ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 opacity-60 border-transparent"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "certification", c.id)
                                }
                                className="mt-0.5 rounded text-neutral-900 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-neutral-900 dark:text-white block truncate">{c.name}</span>
                                <span className="text-[11px] text-neutral-500 dark:text-slate-400 block truncate">{c.institution}</span>
                              </div>
                            </label>

                            {isSelected && (
                              <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-slate-800 p-0.5 rounded-md border border-neutral-200 dark:border-slate-700 shrink-0">
                                <span className="text-[10px] font-mono font-bold bg-neutral-900 dark:bg-slate-950 text-white px-1.5 py-0.2 rounded shadow-2xs">
                                  #{(activeResume.selectedCertificationIds || []).indexOf(c.id) + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("certification", c.id, "top");
                                  }}
                                  disabled={(activeResume.selectedCertificationIds || []).indexOf(c.id) === 0}
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Poner primero (#1)"
                                >
                                  <ChevronsUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("certification", c.id, "up");
                                  }}
                                  disabled={(activeResume.selectedCertificationIds || []).indexOf(c.id) === 0}
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Subir posición en este CV"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveSubItem("certification", c.id, "down");
                                  }}
                                  disabled={
                                    (activeResume.selectedCertificationIds || []).indexOf(c.id) ===
                                    (activeResume.selectedCertificationIds || []).length - 1
                                  }
                                  className="p-1 rounded text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                                  title="Bajar posición en este CV"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {library.certifications.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400">
                          No hay certificaciones cargadas en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Cursos y Capacitaciones con Ojito Individual y Reordenamiento */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="CURSOS Y CAPACITACIONES"
                    countBadge={`${currentSelectedCourseIds.length} de ${library.courses.length} seleccionados`}
                    isExpanded={Boolean(expandedSections.courses)}
                    onToggle={() => toggleSectionAccordion("courses")}
                  />
                  {expandedSections.courses && (
                    <>
                      {/* Selector de Estilo de Visualización */}
                      <div className="p-3 border-b border-neutral-200 dark:border-slate-700 bg-neutral-50/40 dark:bg-slate-900/40">
                        <CoursesFormatSelector
                          format={currentCoursesFormat}
                          includeInstitution={currentCoursesInlineIncludeInstitution}
                          alignment={currentCoursesAlignment}
                          onChangeFormat={handleChangeCoursesFormat}
                          onChangeIncludeInstitution={handleChangeCoursesInlineIncludeInstitution}
                          onChangeAlignment={handleChangeCoursesAlignment}
                        />
                      </div>

                      {/* Administrador de Cursos: Reordenamiento, Flechas, Drag & Drop y Ojito */}
                      <div className="p-3">
                        <CoursesOrderManager
                          courses={library.courses}
                          selectedCourseIds={currentSelectedCourseIds}
                          coursesOrder={activeResume.coursesOrder}
                          onUpdateOrderAndSelection={handleUpdateCoursesOrderAndSelection}
                          onToggleCourse={handleToggleCourse}
                          onSelectAll={handleSelectAllCourses}
                          onDeselectAll={handleDeselectAllCourses}
                          maxHeightClass="max-h-96"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Idiomas */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="IDIOMAS"
                    countBadge={`${activeResume.selectedLanguageIds.length} de ${library.languages.length} seleccionados`}
                    isExpanded={Boolean(expandedSections.languages)}
                    onToggle={() => toggleSectionAccordion("languages")}
                  />
                  {expandedSections.languages && (
                    <div className="p-2 space-y-1">
                      {library.languages.map((l) => {
                        const isSelected = activeResume.selectedLanguageIds.includes(l.id);
                        return (
                          <label
                            key={l.id}
                            className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 opacity-60 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "language", l.id)
                                }
                                className="rounded text-neutral-900 cursor-pointer"
                              />
                              <span className="font-medium text-neutral-900 dark:text-white">{l.language}</span>
                            </div>
                            <span className="text-neutral-500 dark:text-slate-400 text-[11px]">{l.proficiency}</span>
                          </label>
                        );
                      })}
                      {library.languages.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400">
                          No hay idiomas cargados en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Logros */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="LOGROS"
                    countBadge={`${(activeResume.selectedAchievementIds || []).length} de ${library.achievements.length} seleccionados`}
                    isExpanded={Boolean(expandedSections.achievements)}
                    onToggle={() => toggleSectionAccordion("achievements")}
                  />
                  {expandedSections.achievements && (
                    <div className="p-2 space-y-1">
                      {library.achievements.map((ach) => {
                        const isSelected = (activeResume.selectedAchievementIds || []).includes(ach.id);
                        return (
                          <label
                            key={ach.id}
                            className={`flex items-start justify-between p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 opacity-60 border-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "achievement", ach.id)
                                }
                                className="mt-0.5 rounded text-neutral-900 cursor-pointer"
                              />
                              <div>
                                <span className="font-semibold text-neutral-900 dark:text-white block">{ach.title}</span>
                                {ach.description && (
                                  <p className="text-neutral-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                                    {ach.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                      {library.achievements.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400">
                          No hay logros cargados en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Proyectos */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="PROYECTOS"
                    countBadge={`${(activeResume.selectedProjectIds || []).length} de ${library.projects.length} seleccionados`}
                    isExpanded={Boolean(expandedSections.projects)}
                    onToggle={() => toggleSectionAccordion("projects")}
                  />
                  {expandedSections.projects && (
                    <div className="p-2 space-y-1">
                      {library.projects.map((proj) => {
                        const isSelected = (activeResume.selectedProjectIds || []).includes(proj.id);
                        return (
                          <label
                            key={proj.id}
                            className={`flex items-start justify-between p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 opacity-60 border-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "project", proj.id)
                                }
                                className="mt-0.5 rounded text-neutral-900 cursor-pointer"
                              />
                              <div>
                                <span className="font-semibold text-neutral-900 dark:text-white block">{proj.title}</span>
                                {proj.role && (
                                  <span className="text-[11px] text-[#0B63F6] dark:text-blue-400 block">{proj.role}</span>
                                )}
                                {proj.description && (
                                  <p className="text-neutral-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                                    {proj.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                      {library.projects.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400">
                          No hay proyectos cargados en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Referencias */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="REFERENCIAS"
                    countBadge={`${(activeResume.selectedReferenceIds || []).length} de ${library.references.length} seleccionadas`}
                    isExpanded={Boolean(expandedSections.references)}
                    onToggle={() => toggleSectionAccordion("references")}
                  />
                  {expandedSections.references && (
                    <div className="p-2 space-y-1">
                      {library.references.map((ref) => {
                        const isSelected = (activeResume.selectedReferenceIds || []).includes(ref.id);
                        return (
                          <label
                            key={ref.id}
                            className={`flex items-start justify-between p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                              isSelected
                                ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                : "bg-neutral-50/50 dark:bg-slate-900/40 opacity-60 border-transparent"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelectionInResume(activeResume.id, "reference", ref.id)
                                }
                                className="mt-0.5 rounded text-neutral-900 cursor-pointer"
                              />
                              <div>
                                <span className="font-semibold text-neutral-900 dark:text-white block">{ref.name}</span>
                                <span className="text-[11px] text-neutral-500 dark:text-slate-400 block">
                                  {ref.position} {ref.company ? `en ${ref.company}` : ""}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                      {library.references.length === 0 && (
                        <p className="text-center py-3 text-xs text-neutral-400 dark:text-slate-400">
                          No hay referencias cargadas en la biblioteca.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Secciones Personalizadas (VOLUNTARIADO, OTROS, Licencias, etc.) */}
                <div className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-2xs">
                  <SectionAccordionHeader
                    title="SECCIONES PERSONALIZADAS"
                    countBadge={`${library.customSections.length} ${library.customSections.length === 1 ? "sección" : "secciones"}`}
                    isExpanded={Boolean(expandedSections.customSections)}
                    onToggle={() => toggleSectionAccordion("customSections")}
                  />
                  {expandedSections.customSections && (
                    <div className="p-3 space-y-4">
                      {library.customSections.map((cs) => {
                        const customTitle = activeResume.sectionTitleOverrides[cs.id] || cs.name;
                        const orderList = activeResume.customItemsOrder?.[cs.id];
                        let orderedItems = [...cs.items];
                        if (Array.isArray(orderList) && orderList.length > 0) {
                          const orderMap = new Map(orderList.map((id, idx) => [id, idx]));
                          orderedItems.sort((a, b) => {
                            const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
                            const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
                            return idxA - idxB;
                          });
                        }

                        const selectedCount = orderedItems.filter((it) =>
                          currentSelectedCustomItemIds.includes(it.id)
                        ).length;
                        const allSelected = orderedItems.length > 0 && selectedCount === orderedItems.length;

                        return (
                          <div
                            key={cs.id}
                            className="border border-neutral-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800/80 shadow-2xs space-y-0"
                          >
                            <div className="bg-neutral-50/90 dark:bg-slate-800 px-4 py-3 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                                  <Layers className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
                                      {customTitle}
                                    </h4>
                                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                      Sección Personalizada
                                    </span>
                                  </div>
                                  {cs.description && (
                                    <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5">{cs.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono-num text-neutral-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 px-2 py-0.5 rounded">
                                  {selectedCount}/{orderedItems.length} activos
                                </span>
                                {orderedItems.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => selectAllCustomItemsInResume(activeResume.id, cs.id, !allSelected)}
                                    className="text-[11px] font-medium text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white px-2 py-0.5 rounded bg-white dark:bg-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-600 border border-neutral-200 dark:border-slate-600 cursor-pointer transition-colors"
                                  >
                                    {allSelected ? "Desmarcar todos" : "Marcar todos"}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Lista de elementos con Ojito, Checkbox y Flechas */}
                            <div className="p-2 space-y-1.5">
                              {orderedItems.map((item, itemIdx) => {
                                const isSelected = currentSelectedCustomItemIds.includes(item.id);
                                return (
                                  <div
                                    key={item.id}
                                    className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-3 text-xs ${
                                      isSelected
                                        ? "bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-700 shadow-2xs"
                                        : "bg-neutral-50/60 dark:bg-slate-900/40 border-neutral-200/60 dark:border-slate-800 opacity-55"
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleCustomItem(item.id)}
                                        className="mt-0.5 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-500 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer shrink-0"
                                        title={isSelected ? "Ocultar en este CV" : "Mostrar en este CV"}
                                      >
                                        {isSelected ? (
                                          <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <EyeOff className="w-4 h-4 text-neutral-400 dark:text-slate-500" />
                                        )}
                                      </button>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-semibold text-neutral-900 dark:text-white">
                                            {item.title}
                                          </span>
                                          {item.date && (
                                            <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300">
                                              {item.date}
                                            </span>
                                          )}
                                        </div>
                                        {item.subtitle && (
                                          <div className="text-[11px] text-neutral-600 dark:text-slate-400 mt-0.5">
                                            {item.subtitle}
                                          </div>
                                        )}
                                        {item.description && (
                                          <p className="text-[11px] text-neutral-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Ranking y controles de orden */}
                                    {isSelected && (
                                      <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-slate-800 p-0.5 rounded-md border border-neutral-200 dark:border-slate-700 shrink-0">
                                        <span className="text-[10px] font-mono-num font-bold text-neutral-600 dark:text-slate-400 px-1.5">
                                          #{itemIdx + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveCustomItem(cs.id, orderedItems, itemIdx, "top")}
                                          disabled={itemIdx === 0}
                                          className="p-1 hover:bg-neutral-200 dark:hover:bg-slate-700 rounded text-neutral-600 dark:text-slate-400 disabled:opacity-20 cursor-pointer"
                                          title="Poner primero"
                                        >
                                          <ChevronsUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveCustomItem(cs.id, orderedItems, itemIdx, "up")}
                                          disabled={itemIdx === 0}
                                          className="p-1 hover:bg-neutral-200 dark:hover:bg-slate-700 rounded text-neutral-600 dark:text-slate-400 disabled:opacity-20 cursor-pointer"
                                          title="Subir"
                                        >
                                          <ChevronUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveCustomItem(cs.id, orderedItems, itemIdx, "down")}
                                          disabled={itemIdx === orderedItems.length - 1}
                                          className="p-1 hover:bg-neutral-200 dark:hover:bg-slate-700 rounded text-neutral-600 dark:text-slate-400 disabled:opacity-20 cursor-pointer"
                                          title="Bajar"
                                        >
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                              {orderedItems.length === 0 && (
                                <div className="p-3 text-center space-y-1.5 bg-neutral-50/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-neutral-200 dark:border-slate-700">
                                  <p className="text-xs text-neutral-400 dark:text-slate-400 italic">
                                    No hay elementos en esta sección todavía.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrentView("library");
                                      setLibraryActiveTab("custom");
                                    }}
                                    className="text-xs text-[#0B63F6] dark:text-[#38BDF8] hover:underline font-medium cursor-pointer"
                                  >
                                    + Cargar elementos en "Mi Información" → Secciones Personalizadas
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {library.customSections.length === 0 && (
                        <div className="p-4 text-center space-y-1.5 bg-neutral-50/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-neutral-200 dark:border-slate-700">
                          <p className="text-xs text-neutral-400 dark:text-slate-400 italic">
                            No hay secciones personalizadas creadas en la biblioteca.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentView("library");
                              setLibraryActiveTab("custom");
                            }}
                            className="text-xs text-[#0B63F6] dark:text-[#38BDF8] hover:underline font-medium cursor-pointer"
                          >
                            + Crear secciones en "Mi Información" → Secciones Personalizadas
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Structure, Reordering & Section Title Customization */}
            {activeTab === "structure" && (
              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                  <span className="font-semibold text-neutral-900 block mb-0.5">
                    Títulos Personalizables y Orden de Secciones
                  </span>
                  Puedes reordenar las secciones arrastrándolas o utilizando las flechas. Además,
                  puedes cambiar cualquier título (ej. cambiar "Experiencia Laboral" por "Trayectoria
                  en Seguridad") sin alterar los datos originales.
                </div>

                <div className="space-y-2">
                  {effectiveSectionOrder.map((sectionKey, index) => {
                    const isHidden = activeResume.hiddenSections.includes(sectionKey);
                    const customSectionObj = library.customSections.find((c) => c.id === sectionKey);
                    const defaultTitle =
                      library.defaultSectionTitles[sectionKey] ||
                      customSectionObj?.name ||
                      sectionKey;
                    const customTitle = activeResume.sectionTitleOverrides[sectionKey] || "";

                    return (
                      <div
                        key={sectionKey}
                        className={`p-3 rounded-xl border transition-all ${
                          isHidden
                            ? "bg-neutral-50 border-neutral-200 opacity-50"
                            : "bg-white border-neutral-200 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {/* Up/Down Controls */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleMoveSection(index, "up")}
                                disabled={index === 0}
                                className="p-0.5 hover:bg-neutral-200 rounded text-neutral-600 disabled:opacity-30"
                                title="Subir sección"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveSection(index, "down")}
                                disabled={index === effectiveSectionOrder.length - 1}
                                className="p-0.5 hover:bg-neutral-200 rounded text-neutral-600 disabled:opacity-30"
                                title="Bajar sección"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Section title editor input */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="text"
                                  value={customTitle || defaultTitle}
                                  onChange={(e) =>
                                    setSectionTitleOverrideInResume(
                                      activeResume.id,
                                      sectionKey,
                                      e.target.value
                                    )
                                  }
                                  className="text-xs font-semibold text-neutral-900 w-full bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none py-0.5"
                                  placeholder={defaultTitle}
                                />
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                {customSectionObj && (
                                  <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    Sección Personalizada ({customSectionObj.items.length} ítems)
                                  </span>
                                )}
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  Clave: {sectionKey}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Section Courses expansion button */}
                          {sectionKey === "courses" && (
                            <button
                              type="button"
                              onClick={() => setCoursesStructureExpanded((prev) => !prev)}
                              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                              title={coursesStructureExpanded ? "Plegar lista de cursos" : "Desplegar lista de cursos"}
                            >
                              <span>{currentSelectedCourseIds.length}/{library.courses.length} cursos</span>
                              {coursesStructureExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Visibility Toggle */}
                          <button
                            onClick={() => toggleSectionVisibilityInResume(activeResume.id, sectionKey)}
                            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 cursor-pointer"
                            title={isHidden ? "Mostrar sección" : "Ocultar sección"}
                          >
                            {isHidden ? (
                              <EyeOff className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        </div>

                        {/* Desplegable de Cursos con Ojito individual dentro de Estructura */}
                        {sectionKey === "courses" && coursesStructureExpanded && (
                          <div className="mt-3 pt-3 border-t border-neutral-200/80 space-y-2.5">
                            {/* Selector de formato de Cursos */}
                            <CoursesFormatSelector
                              format={currentCoursesFormat}
                              includeInstitution={currentCoursesInlineIncludeInstitution}
                              alignment={currentCoursesAlignment}
                              onChangeFormat={handleChangeCoursesFormat}
                              onChangeIncludeInstitution={handleChangeCoursesInlineIncludeInstitution}
                              onChangeAlignment={handleChangeCoursesAlignment}
                            />

                            {/* Administrador de Cursos: Reordenamiento, Flechas, Drag & Drop y Ojito */}
                            <CoursesOrderManager
                              courses={library.courses}
                              selectedCourseIds={currentSelectedCourseIds}
                              coursesOrder={activeResume.coursesOrder}
                              onUpdateOrderAndSelection={handleUpdateCoursesOrderAndSelection}
                              onToggleCourse={handleToggleCourse}
                              onSelectAll={handleSelectAllCourses}
                              onDeselectAll={handleDeselectAllCourses}
                              maxHeightClass="max-h-72"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Visual Design & Templates */}
            {activeTab === "design" && (
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                    Plantilla Seleccionada
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        id: "harvard" as TemplateId,
                        name: "Harvard Professional",
                        desc: "Académica, sobria, una columna, ATS",
                      },
                      {
                        id: "executive" as TemplateId,
                        name: "Executive Corporate",
                        desc: "Ejecutiva, barra de acento, distinguida",
                      },
                      {
                        id: "ats" as TemplateId,
                        name: "ATS Minimal Clean",
                        desc: "100% texto puro, máxima legibilidad",
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => updateResume(activeResume.id, { templateId: tpl.id })}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          activeResume.templateId === tpl.id
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                            : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="font-semibold text-xs">{tpl.name}</div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            activeResume.templateId === tpl.id
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          {tpl.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Font Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                    Tipografía
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "garamond", label: "EB Garamond", style: "font-garamond" },
                      { id: "merriweather", label: "Merriweather", style: "font-merriweather" },
                      { id: "sans", label: "Plus Jakarta", style: "font-sans-pro" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() =>
                          updateVisualSettings(activeResume.id, {
                            fontFamily: f.id as any,
                          })
                        }
                        className={`p-2.5 rounded-lg border text-center text-xs transition-colors ${
                          activeResume.visualSettings.fontFamily === f.id
                            ? "border-neutral-900 bg-neutral-100 font-bold"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <span className={`${f.style} block text-sm`}>Aa</span>
                        <span className="text-[11px] text-neutral-600 mt-1 block">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing & Layout controls */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
                    Espaciado e Interlineado
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["compact", "normal", "spacious"] as const).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => updateVisualSettings(activeResume.id, { spacing: sp })}
                        className={`p-2 rounded-lg border text-xs capitalize ${
                          activeResume.visualSettings.spacing === sp
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {sp === "compact" ? "Compacto" : sp === "normal" ? "Normal" : "Espacioso"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Display Toggle */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Mostrar Foto en CV
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Habilita la foto en el encabezado del CV.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeResume.visualSettings.showPhoto}
                    onChange={(e) =>
                      updateVisualSettings(activeResume.id, { showPhoto: e.target.checked })
                    }
                    className="rounded text-neutral-900 w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Photo Upload & Configuration Card */}
                {activeResume.visualSettings.showPhoto && (
                  <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      {/* Thumbnail or Silhouette */}
                      <div className="relative shrink-0">
                        {library.personal.photoUrl ? (
                          <img
                            src={library.personal.photoUrl}
                            alt="Foto de perfil"
                            className="w-16 h-16 object-cover border-2 border-neutral-200 shadow-2xs transition-all"
                            style={{
                              borderRadius:
                                (activeResume.visualSettings.photoShape || "circle") === "rounded"
                                  ? "8px"
                                  : "50%",
                            }}
                          />
                        ) : (
                          <div
                            className="w-16 h-16 bg-neutral-100 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 transition-all"
                            style={{
                              borderRadius:
                                (activeResume.visualSettings.photoShape || "circle") === "rounded"
                                  ? "8px"
                                  : "50%",
                            }}
                          >
                            <User className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Upload / Remove Buttons */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <input
                          type="file"
                          ref={photoFileInputRef}
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{library.personal.photoUrl ? "📁 Cambiar foto desde mi PC" : "📁 Subir foto desde mi PC"}</span>
                        </button>
                        {library.personal.photoUrl && (
                          <button
                            type="button"
                            onClick={() => updatePersonal({ photoUrl: "" })}
                            className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium pt-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Quitar foto</span>
                          </button>
                        )}
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Formatos: PNG, JPG o WebP. Se optimiza a 1:1 automáticamente.
                        </p>
                      </div>
                    </div>

                    {/* Quick Selectors */}
                    <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Posición en el encabezado */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                          Posición en el encabezado
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateVisualSettings(activeResume.id, { photoPosition: "left" })}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeResume.visualSettings.photoPosition === "left"
                                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                                : "text-neutral-600 hover:text-neutral-900"
                            }`}
                          >
                            Izquierda
                          </button>
                          <button
                            type="button"
                            onClick={() => updateVisualSettings(activeResume.id, { photoPosition: "right" })}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                              (activeResume.visualSettings.photoPosition || "right") === "right"
                                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                                : "text-neutral-600 hover:text-neutral-900"
                            }`}
                          >
                            Derecha
                          </button>
                        </div>
                      </div>

                      {/* Formato de marco */}
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                          Formato de marco
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateVisualSettings(activeResume.id, { photoShape: "circle" })}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                              (activeResume.visualSettings.photoShape || "circle") === "circle"
                                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                                : "text-neutral-600 hover:text-neutral-900"
                            }`}
                          >
                            Circular
                          </button>
                          <button
                            type="button"
                            onClick={() => updateVisualSettings(activeResume.id, { photoShape: "rounded" })}
                            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeResume.visualSettings.photoShape === "rounded"
                                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                                : "text-neutral-600 hover:text-neutral-900"
                            }`}
                          >
                            Cuadrado redondeado
                          </button>
                        </div>
                      </div>

                      {/* Tamaño de foto */}
                      <div className="sm:col-span-2 pt-1 border-t border-neutral-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-semibold text-neutral-700 block">
                            Tamaño de foto
                          </label>
                          <span className="text-[10px] text-neutral-400 font-mono-num">
                            {(activeResume.visualSettings.photoSize || "lg") === "sm"
                              ? "90px"
                              : (activeResume.visualSettings.photoSize || "lg") === "md"
                              ? "110px"
                              : (activeResume.visualSettings.photoSize || "lg") === "xl"
                              ? "145px"
                              : "125px (por defecto)"}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-100 rounded-lg">
                          {[
                            { key: "sm", label: "Pequeña", px: "90px" },
                            { key: "md", label: "Mediana", px: "110px" },
                            { key: "lg", label: "Grande", px: "125px" },
                            { key: "xl", label: "Extra G.", px: "145px" },
                          ].map((s) => {
                            const isSelected =
                              (activeResume.visualSettings.photoSize || "lg") === s.key;
                            return (
                              <button
                                key={s.key}
                                type="button"
                                onClick={() =>
                                  updateVisualSettings(activeResume.id, {
                                    photoSize: s.key as "sm" | "md" | "lg" | "xl",
                                  })
                                }
                                className={`py-1 px-1 text-center rounded-md transition-all ${
                                  isSelected
                                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                                    : "text-neutral-600 hover:text-neutral-900"
                                }`}
                              >
                                <span className="block text-[11px] leading-tight">
                                  {s.label}
                                </span>
                                <span className="block text-[9px] text-neutral-400 font-mono-num leading-tight">
                                  {s.px}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live A4 Preview Sheet */}
        <div
          className={`flex-1 min-w-0 flex flex-col h-full overflow-hidden w-full p-3 sm:p-5 bg-[#C8DBD1] dark:bg-slate-950 transition-all duration-300 ease-in-out relative print:flex print:p-0 print:bg-white print:overflow-visible ${
            mobileTab === "editor" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Botón flotante para reabrir el panel de edición cuando está colapsado */}
          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="hidden md:flex absolute top-5 left-3 z-30 h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 no-print print:hidden"
              title="Mostrar panel lateral de edición"
              aria-label="Expandir panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <ResumePreviewSheet
            resume={activeResume}
            library={library}
            onSelectTemplate={(tplId) => updateResume(activeResume.id, { templateId: tplId })}
          />
        </div>
      </div>
    </div>
  );
};
