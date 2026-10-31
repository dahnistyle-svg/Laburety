import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Languages,
  Wrench,
  Trophy,
  FolderGit2,
  FolderKanban,
  Users,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Layers,
  Upload,
} from "lucide-react";
import { processImageFile } from "../../utils/imageUtils";
import {
  Experience,
  Education,
  Course,
  Certification,
  Language,
  Skill,
  ToolItem,
  Achievement,
  Project,
  Reference,
  CustomSection,
  ProfileVariant,
} from "../../types";

const LibrarySectionHeader: React.FC<{
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}> = ({ title, description, actionButton }) => (
  <div className="bg-[#DCEBE3] dark:bg-slate-800/80 border border-[#ADC8BA] dark:border-slate-700 border-l-4 border-l-[#0D7A5F] dark:border-l-emerald-500 text-[#0B2B22] dark:text-white p-3.5 sm:px-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
    <div>
      <h2 className="text-base font-bold text-[#0B2B22] dark:text-white">{title}</h2>
      <p className="text-xs text-[#164E3F] dark:text-slate-300 mt-0.5">{description}</p>
    </div>
    {actionButton && <div className="shrink-0">{actionButton}</div>}
  </div>
);

export const LibraryView: React.FC = () => {
  const {
    library,
    updatePersonal,
    updateContact,
    updateAbout,
    addProfileVariant,
    updateProfileVariant,
    deleteProfileVariant,
    duplicateProfileVariant,
    addExperience,
    updateExperience,
    deleteExperience,
    duplicateExperience,
    reorderExperiences,
    addEducation,
    updateEducation,
    deleteEducation,
    addCourse,
    updateCourse,
    deleteCourse,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addSkill,
    updateSkill,
    deleteSkill,
    addTool,
    updateTool,
    deleteTool,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addProject,
    updateProject,
    deleteProject,
    addReference,
    updateReference,
    deleteReference,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    updateDefaultSectionTitle,
    libraryActiveTab,
    setLibraryActiveTab,
  } = useApp();

  // Active sub-tab
  const activeTab = libraryActiveTab || "personal";
  const setActiveTab = setLibraryActiveTab;

  // Modals and Delete Confirmation States
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: string;
    id: string;
    name: string;
  } | null>(null);

  // Profile Variant Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<ProfileVariant> | null>(null);

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);

  // Course Modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // Certification Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  // Achievement Modal
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);

  // Project Modal
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<Partial<Project> | null>(null);

  // Reference Modal
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<Partial<Reference> | null>(null);

  // Language Modal
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Partial<Language> | null>(null);

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  // Tool Modal
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Partial<ToolItem> | null>(null);

  // Skill Quick Add
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Gestión");
  const [newSkillLevel, setNewSkillLevel] = useState("Avanzado");

  // Tool Quick Add
  const [newToolName, setNewToolName] = useState("");
  const [newToolCategory, setNewToolCategory] = useState("General");

  // Language Quick Add
  const [newLangName, setNewLangName] = useState("");
  const [newLangLevel, setNewLangLevel] = useState<Language["proficiency"]>("Intermedio");

  // Custom Section Modal
  const [customSecModalOpen, setCustomSecModalOpen] = useState(false);
  const [editingCustomSec, setEditingCustomSec] = useState<CustomSection | null>(null);
  const [newCustomSecName, setNewCustomSecName] = useState("");
  const [newCustomSecDesc, setNewCustomSecDesc] = useState("");

  // Custom Section Item Add / Edit
  const [activeCustomSecId, setActiveCustomSecId] = useState<string | null>(null);
  const [editingCustomItemId, setEditingCustomItemId] = useState<string | null>(null);
  const [customItemTitle, setCustomItemTitle] = useState("");
  const [customItemSubtitle, setCustomItemSubtitle] = useState("");
  const [customItemDate, setCustomItemDate] = useState("");
  const [customItemDesc, setCustomItemDesc] = useState("");

  // Photo upload in Personal Info
  const personalPhotoInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingPersonalPhoto, setIsUploadingPersonalPhoto] = useState(false);

  const handlePersonalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPersonalPhoto(true);
      const base64 = await processImageFile(file);
      updatePersonal({ photoUrl: base64 });
    } catch (err: any) {
      console.error("Error al procesar la foto:", err);
    } finally {
      setIsUploadingPersonalPhoto(false);
      if (personalPhotoInputRef.current) personalPhotoInputRef.current.value = "";
    }
  };

  const tabs = [
    { id: "personal", label: "Datos Personales", icon: User, count: null },
    { id: "contact", label: "Contacto y Enlaces", icon: Mail, count: null },
    { id: "about", label: "Perfil Profesional", icon: BookOpen, count: library.profileVariants?.length || 1 },
    { id: "experience", label: "Experiencias", icon: Briefcase, count: library.experiences.length },
    { id: "education", label: "Formación", icon: GraduationCap, count: library.education.length },
    { id: "skills", label: "Habilidades", icon: Award, count: library.skills.length },
    { id: "tools", label: "Herramientas", icon: Wrench, count: library.tools.length },
    { id: "certifications", label: "Certificaciones", icon: Award, count: library.certifications.length },
    { id: "courses", label: "Cursos", icon: BookOpen, count: library.courses.length },
    { id: "languages", label: "Idiomas", icon: Languages, count: library.languages.length },
    { id: "achievements", label: "Logros", icon: Trophy, count: library.achievements.length },
    { id: "projects", label: "Proyectos", icon: FolderGit2, count: library.projects.length },
    { id: "references", label: "Referencias", icon: Users, count: library.references.length },
    { id: "custom", label: "Secciones Extra", icon: Layers, count: library.customSections.length },
  ];

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    switch (type) {
      case "profileVariant":
        deleteProfileVariant(id);
        break;
      case "experience":
        deleteExperience(id);
        break;
      case "education":
        deleteEducation(id);
        break;
      case "course":
        deleteCourse(id);
        break;
      case "certification":
        deleteCertification(id);
        break;
      case "language":
        deleteLanguage(id);
        break;
      case "skill":
        deleteSkill(id);
        break;
      case "tool":
        deleteTool(id);
        break;
      case "achievement":
        deleteAchievement(id);
        break;
      case "project":
        deleteProject(id);
        break;
      case "reference":
        deleteReference(id);
        break;
      case "customSection":
        deleteCustomSection(id);
        break;
    }
    setDeleteConfirm(null);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.company || !editingExp.role) return;

    if (editingExp.id) {
      updateExperience(editingExp.id, editingExp);
    } else {
      addExperience({
        company: editingExp.company || "",
        role: editingExp.role || "",
        location: editingExp.location || "",
        startDate: editingExp.startDate || "",
        endDate: editingExp.endDate || "",
        isCurrent: Boolean(editingExp.isCurrent),
        description: editingExp.description || "",
        responsibilities: editingExp.responsibilities || [],
        achievements: editingExp.achievements || [],
        keywords: editingExp.keywords || [],
        additionalInfo: editingExp.additionalInfo || "",
        isHidden: false,
      });
    }
    setExpModalOpen(false);
    setEditingExp(null);
  };

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.institution || (!editingEdu.degree && !editingEdu.fieldOfStudy)) return;
    const eduData: Omit<Education, "id"> = {
      institution: editingEdu.institution.trim(),
      fieldOfStudy: (editingEdu.fieldOfStudy || "").trim(),
      degree: (editingEdu.degree || editingEdu.fieldOfStudy || "").trim(),
      level: editingEdu.level || "Grado",
      startDate: editingEdu.startDate || "",
      endDate: editingEdu.endDate || "",
      status: (editingEdu.status as any) || "Graduado",
      description: editingEdu.description || "",
      additionalInfo: editingEdu.additionalInfo || "",
    };
    if (editingEdu.id) {
      updateEducation(editingEdu.id, eduData);
    } else {
      addEducation(eduData);
    }
    setEduModalOpen(false);
    setEditingEdu(null);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.name || !editingCourse.institution) return;
    const courseUrl = editingCourse.certificateUrl || editingCourse.url || "";
    const courseData: Omit<Course, "id"> = {
      name: editingCourse.name || "",
      institution: editingCourse.institution || "",
      date: editingCourse.date || "",
      duration: editingCourse.duration || "",
      description: editingCourse.description || "",
      certificateUrl: courseUrl,
      url: courseUrl,
    };
    if (editingCourse.id) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    setCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.name || !editingCert.institution) return;
    const certData: Omit<Certification, "id"> = {
      name: editingCert.name || "",
      institution: editingCert.institution || "",
      issueDate: editingCert.issueDate || "",
      expirationDate: editingCert.expirationDate || "",
      credentialId: editingCert.credentialId || "",
      url: editingCert.url || "",
      description: editingCert.description || "",
    };
    if (editingCert.id) {
      updateCertification(editingCert.id, certData);
    } else {
      addCertification(certData);
    }
    setCertModalOpen(false);
    setEditingCert(null);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch || !editingAch.title) return;
    const achData: Omit<Achievement, "id"> = {
      title: editingAch.title || "",
      description: editingAch.description || "",
      context: editingAch.context || "",
      result: editingAch.result || "",
      date: editingAch.date || "",
    };
    if (editingAch.id) {
      updateAchievement(editingAch.id, achData);
    } else {
      addAchievement(achData);
    }
    setAchModalOpen(false);
    setEditingAch(null);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj || !editingProj.title) return;
    const projData: Omit<Project, "id"> = {
      title: editingProj.title || "",
      description: editingProj.description || "",
      role: editingProj.role || "",
      date: editingProj.date || "",
      tools: editingProj.tools || "",
      result: editingProj.result || "",
      url: editingProj.url || "",
    };
    if (editingProj.id) {
      updateProject(editingProj.id, projData);
    } else {
      addProject(projData);
    }
    setProjModalOpen(false);
    setEditingProj(null);
  };

  const handleSaveReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRef || !editingRef.name) return;
    const refData: Omit<Reference, "id"> = {
      name: editingRef.name || "",
      position: editingRef.position || "",
      company: editingRef.company || "",
      contact: editingRef.contact || "",
      notes: editingRef.notes || "",
      isHidden: false,
    };
    if (editingRef.id) {
      updateReference(editingRef.id, refData);
    } else {
      addReference(refData);
    }
    setRefModalOpen(false);
    setEditingRef(null);
  };

  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLang || !editingLang.language) return;
    const langData: Omit<Language, "id"> = {
      language: editingLang.language.trim(),
      proficiency: editingLang.proficiency || "Intermedio",
      certification: editingLang.certification || "",
      notes: editingLang.notes || "",
    };
    if (editingLang.id) {
      updateLanguage(editingLang.id, langData);
    } else {
      addLanguage(langData);
    }
    setLangModalOpen(false);
    setEditingLang(null);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) return;
    const skillData: Omit<Skill, "id"> = {
      name: editingSkill.name.trim(),
      category: editingSkill.category || "Gestión",
      level: editingSkill.level || "Avanzado",
      description: editingSkill.description || "",
    };
    if (editingSkill.id) {
      updateSkill(editingSkill.id, skillData);
    } else {
      addSkill(skillData);
    }
    setSkillModalOpen(false);
    setEditingSkill(null);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.name) return;
    const toolData: Omit<ToolItem, "id"> = {
      name: editingTool.name.trim(),
      category: editingTool.category || "General",
      level: editingTool.level || "Intermedio",
    };
    if (editingTool.id) {
      updateTool(editingTool.id, toolData);
    } else {
      addTool(toolData);
    }
    setToolModalOpen(false);
    setEditingTool(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Title Banner Standardized (Estilo Empresas) */}
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#F2F7F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs transition-colors mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2F26] dark:text-white">
                Mi Información Profesional
              </h1>
              <p className="text-xs sm:text-sm text-[#3E6556] dark:text-slate-400 mt-0.5">
                Tu biblioteca profesional permanente. Carga tus datos una sola vez y reutilízalos para
                construir todos tus currículums sin duplicar información.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar & Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-[#F2F7F4] dark:bg-slate-800 border border-[#B8D0C4] dark:border-slate-700 rounded-xl p-2 shadow-xs space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left cursor-pointer ${
                  isActive
                    ? "bg-[#0B63F6] text-white shadow-xs"
                    : "text-[#0F2F26] dark:text-slate-300 hover:bg-[#E3EFE9] dark:hover:bg-slate-700 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span
                    className={`font-mono-num text-[11px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[#D5E5DD] dark:bg-slate-700 text-[#0F2F26] dark:text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Main Panel */}
        <main className="lg:col-span-9 bg-[#F2F7F4] dark:bg-slate-800 border border-[#B8D0C4] dark:border-slate-700 rounded-xl p-6 shadow-xs min-h-[500px]">
          {/* TAB 1: DATOS PERSONALES */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <LibrarySectionHeader
                title="Datos Personales"
                description="Información base del titular. Todos los campos son opcionales."
              />

              {/* Photo Uploader Card */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  {library.personal.photoUrl ? (
                    <img
                      src={library.personal.photoUrl}
                      alt="Foto de perfil"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs ring-1 ring-neutral-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral-200 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400">
                      <User className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <input
                      type="file"
                      ref={personalPhotoInputRef}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handlePersonalPhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => personalPhotoInputRef.current?.click()}
                      disabled={isUploadingPersonalPhoto}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{library.personal.photoUrl ? "📁 Cambiar foto" : "📁 Subir / Cambiar foto"}</span>
                    </button>
                    {library.personal.photoUrl && (
                      <button
                        type="button"
                        onClick={() => updatePersonal({ photoUrl: "" })}
                        className="flex items-center gap-1 px-3 py-2 border border-neutral-300 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar foto</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-normal">
                    Formatos admitidos: JPG, PNG o WebP. La imagen se recorta centrada en proporción 1:1 y se optimiza a 320x320px para una exportación a PDF nítida y ultraliviana.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={library.personal.firstName}
                    onChange={(e) => updatePersonal({ firstName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-neutral-900"
                    placeholder="Ej. Martín"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={library.personal.lastName}
                    onChange={(e) => updatePersonal({ lastName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-neutral-900"
                    placeholder="Ej. Rossi"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Ciudad / Ubicación
                  </label>
                  <input
                    type="text"
                    value={library.personal.location}
                    onChange={(e) => updatePersonal({ location: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-neutral-900"
                    placeholder="Ej. Buenos Aires"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={library.personal.country}
                    onChange={(e) => updatePersonal({ country: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-neutral-900"
                    placeholder="Ej. Argentina"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    URL de Foto de Perfil (Opcional)
                  </label>
                  <input
                    type="url"
                    value={library.personal.photoUrl || ""}
                    onChange={(e) => updatePersonal({ photoUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-neutral-900"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTO Y ENLACES */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <LibrarySectionHeader
                title="Información de Contacto"
                description="Canales de contacto y perfiles web profesionales."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={library.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                    placeholder="+54 9 11 ..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={library.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Perfil de LinkedIn
                  </label>
                  <input
                    type="url"
                    value={library.contact.linkedin || ""}
                    onChange={(e) => updateContact({ linkedin: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                    placeholder="https://linkedin.com/in/usuario"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Portfolio / Sitio Web
                  </label>
                  <input
                    type="url"
                    value={library.contact.portfolio || ""}
                    onChange={(e) => updateContact({ portfolio: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                    placeholder="https://miportfolio.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    GitHub / Repositorio
                  </label>
                  <input
                    type="url"
                    value={library.contact.github || ""}
                    onChange={(e) => updateContact({ github: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                    placeholder="https://github.com/usuario"
                  />
                </div>
              </div>

              {/* Enlaces adicionales */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Otros Enlaces Personalizados
                  </h3>
                  <button
                    onClick={() => {
                      const newLink = {
                        id: `link-${Date.now()}`,
                        label: "Otro Enlace",
                        url: "",
                      };
                      updateContact({
                        customLinks: [...library.contact.customLinks, newLink],
                      });
                    }}
                    className="text-xs font-semibold text-neutral-900 hover:text-neutral-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar enlace</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {library.contact.customLinks.map((link) => (
                    <div key={link.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = library.contact.customLinks.map((l) =>
                            l.id === link.id ? { ...l, label: e.target.value } : l
                          );
                          updateContact({ customLinks: updated });
                        }}
                        className="w-1/3 text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        placeholder="Etiqueta (ej. Certificado)"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const updated = library.contact.customLinks.map((l) =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          );
                          updateContact({ customLinks: updated });
                        }}
                        className="flex-1 text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => {
                          const filtered = library.contact.customLinks.filter(
                            (l) => l.id !== link.id
                          );
                          updateContact({ customLinks: filtered });
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded"
                        title="Eliminar enlace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACERCA DE MÍ / PERFIL PROFESIONAL */}
          {activeTab === "about" && (() => {
            const profilesList = library.profileVariants && library.profileVariants.length > 0
              ? library.profileVariants
              : [
                  {
                    id: "profile-default-1",
                    title: library.personal.professionalTitle || "Supervisor de Operaciones y Seguridad",
                    content: library.about.content || "",
                    isDefault: true,
                  },
                ];

            return (
              <div className="space-y-6">
                <LibrarySectionHeader
                  title="Perfiles Profesionales y Títulos de Encabezado"
                  description="Crea y administra múltiples variantes de perfil y cargo. Luego podrás elegir cuál mostrar en cada CV individual."
                  actionButton={
                    <button
                      onClick={() => {
                        setEditingProfile({
                          title: "",
                          subtitle: "",
                          content: "",
                        });
                        setProfileModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3.5 py-2 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Nuevo Perfil / Título</span>
                    </button>
                  }
                />

                {/* Título de la Sección General */}
                <div className="bg-[#FAFCFB] dark:bg-slate-800 p-4 rounded-xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs space-y-2">
                  <label className="text-xs font-semibold text-[#0F2F26] dark:text-slate-300 block">
                    Título de la Sección en el CV (Editable)
                  </label>
                  <input
                    type="text"
                    value={library.about.title}
                    onChange={(e) => updateAbout({ title: e.target.value })}
                    className="w-full sm:w-1/2 text-xs p-2.5 bg-[#FAFCFB] dark:bg-slate-900 border border-[#A8C4B6] dark:border-slate-700 rounded-lg text-[#0F2F26] dark:text-white focus:bg-white dark:focus:bg-slate-800"
                    placeholder="Ej. Perfil Profesional, Acerca de Mí, Resumen Ejecutivo"
                  />
                </div>

                {/* Lista de Perfiles Guardados */}
                <div className="space-y-3">
                  {profilesList.map((variant) => {
                    return (
                      <div
                        key={variant.id}
                        className="bg-[#FAFCFB] dark:bg-slate-800 p-4 sm:p-5 rounded-xl border border-[#B8D0C4] hover:border-[#8AB5A1] dark:border-slate-700 dark:hover:border-slate-600 shadow-2xs transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                              {variant.title || "Sin título definido"}
                            </h3>
                            {variant.subtitle && (
                              <p className="text-xs text-[#0B63F6] dark:text-blue-400 font-medium">
                                {variant.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Botones de Acción */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingProfile(variant);
                                setProfileModalOpen(true);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                              title="Editar este perfil"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => duplicateProfileVariant(variant.id)}
                              className="p-1.5 text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Duplicar este perfil"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {profilesList.length > 1 && (
                              <button
                                onClick={() => {
                                  setDeleteConfirm({
                                    open: true,
                                    type: "profileVariant",
                                    id: variant.id,
                                    name: variant.title || "Perfil Profesional",
                                  });
                                }}
                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar este perfil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {variant.content || variant.summary || "Sin resumen redactado"}
                        </p>

                        <div className="pt-2 border-t border-neutral-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-neutral-400 dark:text-slate-500 font-mono-num">
                          <span>{(variant.content || variant.summary || "").length} caracteres</span>
                          <span>Disponible para elegir en cada CV</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB 4: EXPERIENCIA LABORAL */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Experiencias Laborales</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Historial laboral completo. Puedes ordenar, duplicar o editar cada registro.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingExp({
                      company: "",
                      role: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      isCurrent: false,
                      description: "",
                      responsibilities: [],
                      achievements: [],
                      keywords: [],
                    });
                    setExpModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Experiencia</span>
                </button>
              </div>

              {/* Experiences List */}
              {library.experiences.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
                  <Briefcase className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-neutral-700">
                    Todavía no agregaste experiencias laborales.
                  </p>
                  <button
                    onClick={() => {
                      setEditingExp({
                        company: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        isCurrent: false,
                        responsibilities: [],
                      });
                      setExpModalOpen(true);
                    }}
                    className="mt-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg"
                  >
                    + Agregar primera experiencia
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {library.experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all bg-white shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-neutral-900">{exp.role}</h3>
                            {exp.isCurrent && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                Actual
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-neutral-600">
                            {exp.company} {exp.location ? `· ${exp.location}` : ""}
                          </p>
                          <p className="text-xs text-neutral-500 font-mono-num mt-0.5">
                            {exp.startDate} – {exp.isCurrent ? "Presente" : exp.endDate}
                          </p>

                          {exp.description && (
                            <p className="text-xs text-neutral-700 mt-2 line-clamp-2">
                              {exp.description}
                            </p>
                          )}

                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div className="text-xs text-neutral-500 mt-2 font-mono-num">
                              {exp.responsibilities.length} responsabilidades registradas
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              const order = [...library.experiences];
                              if (index > 0) {
                                const temp = order[index];
                                order[index] = order[index - 1];
                                order[index - 1] = temp;
                                reorderExperiences(order);
                              }
                            }}
                            disabled={index === 0}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 rounded"
                            title="Subir"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const order = [...library.experiences];
                              if (index < order.length - 1) {
                                const temp = order[index];
                                order[index] = order[index + 1];
                                order[index + 1] = temp;
                                reorderExperiences(order);
                              }
                            }}
                            disabled={index === library.experiences.length - 1}
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 rounded"
                            title="Bajar"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateExperience(exp.id)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
                            title="Duplicar experiencia"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingExp(exp);
                              setExpModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
                            title="Editar experiencia"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: "experience",
                                id: exp.id,
                                name: `${exp.role} en ${exp.company}`,
                              })
                            }
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                            title="Eliminar experiencia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FORMACIÓN ACADÉMICA */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Formación Académica</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Títulos universitarios, técnicos y secundarios.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingEdu({
                      institution: "",
                      fieldOfStudy: "",
                      degree: "",
                      level: "Grado",
                      startDate: "",
                      endDate: "",
                      status: "Graduado",
                      description: "",
                      additionalInfo: "",
                    });
                    setEduModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Título</span>
                </button>
              </div>

              {library.education.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
                  <p className="text-xs text-neutral-500">Todavía no agregaste formación académica.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {library.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-xl border border-neutral-200 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-bold text-xs text-neutral-900">
                          {edu.degree || edu.fieldOfStudy}
                          {edu.fieldOfStudy && edu.degree && edu.fieldOfStudy !== edu.degree && (
                            <span className="font-normal text-neutral-600 ml-1.5">
                              — {edu.fieldOfStudy}
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {edu.institution} · {edu.level}
                          {edu.additionalInfo && (
                            <span className="text-neutral-500"> · {edu.additionalInfo}</span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-500 font-mono-num mt-0.5">
                          {edu.startDate} – {edu.endDate || (edu.status === "En curso" ? "Presente" : edu.status)} ({edu.status})
                        </p>
                        {edu.description && (
                          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingEdu(edu);
                            setEduModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "education",
                              id: edu.id,
                              name: edu.degree || edu.fieldOfStudy,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HABILIDADES */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Habilidades y Competencias
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Gestiona las competencias clave que luego seleccionarás para tus CVs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill({
                      name: "",
                      category: "Gestión",
                      level: "Avanzado",
                      description: "",
                    });
                    setSkillModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Habilidad</span>
                </button>
              </div>

              {/* Quick Add Bar */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Carga rápida: Nombre (ej. Supervisión Operativa)"
                  className="flex-1 min-w-[180px] text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                >
                  <option value="Gestión">Gestión</option>
                  <option value="Operativa">Operativa</option>
                  <option value="Estratégica">Estratégica</option>
                  <option value="Interpersonal">Interpersonal</option>
                  <option value="Técnica">Técnica</option>
                  <option value="Calidad">Calidad</option>
                </select>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                >
                  <option value="Avanzado">Avanzado</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Experto">Experto</option>
                  <option value="Básico">Básico</option>
                </select>
                <button
                  onClick={() => {
                    if (!newSkillName.trim()) return;
                    addSkill({
                      name: newSkillName.trim(),
                      category: newSkillCategory,
                      level: newSkillLevel,
                    });
                    setNewSkillName("");
                  }}
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar
                </button>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {library.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-lg border border-neutral-200 flex items-start justify-between bg-white gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-xs text-neutral-900 block truncate">{skill.name}</span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        {skill.category} · {skill.level}
                      </span>
                      {skill.description && (
                        <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setSkillModalOpen(true);
                        }}
                        className="text-neutral-400 hover:text-neutral-900 p-1"
                        title="Editar habilidad"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "skill",
                            id: skill.id,
                            name: skill.name,
                          })
                        }
                        className="text-neutral-400 hover:text-red-600 p-1"
                        title="Eliminar habilidad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HERRAMIENTAS Y SOFTWARE */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Herramientas, Software y Tecnologías
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Programas de gestión, ofimática, sistemas CCTV, CRM, etc.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTool({
                      name: "",
                      category: "Software",
                      level: "Intermedio",
                    });
                    setToolModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Herramienta</span>
                </button>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="Carga rápida: Nombre (ej. Excel, SAP, Milestone)"
                  className="flex-1 min-w-[200px] text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                />
                <button
                  onClick={() => {
                    if (!newToolName.trim()) return;
                    addTool({
                      name: newToolName.trim(),
                      category: newToolCategory,
                    });
                    setNewToolName("");
                  }}
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {library.tools.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs shadow-2xs hover:border-neutral-300 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-neutral-900 block">{t.name}</span>
                      {(t.category || t.level) && (
                        <span className="text-[10px] text-neutral-500">
                          {[t.category, t.level].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 ml-1 border-l pl-1.5 border-neutral-100">
                      <button
                        onClick={() => {
                          setEditingTool(t);
                          setToolModalOpen(true);
                        }}
                        className="text-neutral-400 hover:text-neutral-900 p-1 rounded"
                        title="Editar herramienta"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "tool",
                            id: t.id,
                            name: t.name,
                          })
                        }
                        className="text-neutral-400 hover:text-red-600 p-1 rounded"
                        title="Eliminar herramienta"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CERTIFICACIONES Y CURSOS */}
          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Certificaciones Oficiales</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Habilitaciones, carnets y credenciales con validez formal.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCert({
                      name: "",
                      institution: "",
                      issueDate: "",
                      expirationDate: "",
                      credentialId: "",
                      url: "",
                      description: "",
                    });
                    setCertModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Certificación</span>
                </button>
              </div>

              <div className="space-y-3">
                {library.certifications.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-xs text-neutral-500">Todavía no agregaste certificaciones oficiales.</p>
                  </div>
                ) : (
                  library.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-neutral-200 flex justify-between items-start bg-white gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-neutral-900">{c.name}</div>
                        <div className="text-xs text-neutral-600 mt-0.5">{c.institution}</div>
                        <div className="text-[11px] text-neutral-500 font-mono-num mt-0.5">
                          Emisión: {c.issueDate} {c.expirationDate ? `· Vence: ${c.expirationDate}` : ""}
                          {c.credentialId ? ` · ID: ${c.credentialId}` : ""}
                        </div>
                        {c.description && (
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{c.description}</p>
                        )}
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline block mt-1 truncate"
                          >
                            {c.url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCert(c);
                            setCertModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
                          title="Editar certificación"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "certification",
                              id: c.id,
                              name: c.name,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                          title="Eliminar certificación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: CURSOS */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Cursos y Capacitaciones</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Cursos de extensión, talleres y capacitaciones continuas.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourse({
                      name: "",
                      institution: "",
                      date: "",
                      duration: "",
                      description: "",
                      certificateUrl: "",
                      url: "",
                    });
                    setCourseModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Curso</span>
                </button>
              </div>

              <div className="space-y-3">
                {library.courses.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-xs text-neutral-500">Todavía no agregaste cursos o capacitaciones.</p>
                  </div>
                ) : (
                  library.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl border border-neutral-200 flex justify-between items-start bg-white gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-neutral-900">{course.name}</div>
                        <div className="text-xs text-neutral-600 mt-0.5">{course.institution}</div>
                        <div className="text-[11px] text-neutral-500 font-mono-num mt-0.5">
                          {course.date} {course.duration ? `· ${course.duration}` : ""}
                        </div>
                        {course.description && (
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{course.description}</p>
                        )}
                        {(course.certificateUrl || course.url) && (
                          <a
                            href={course.certificateUrl || course.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline block mt-1 truncate"
                          >
                            {course.certificateUrl || course.url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
                          title="Editar curso"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "course",
                              id: course.id,
                              name: course.name,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                          title="Eliminar curso"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 10: IDIOMAS */}
          {activeTab === "languages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Idiomas</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Idiomas que dominas y nivel de competencia.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingLang({
                      language: "",
                      proficiency: "Intermedio",
                      certification: "",
                      notes: "",
                    });
                    setLangModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Idioma</span>
                </button>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  placeholder="Carga rápida: Idioma (ej. Inglés, Francés)"
                  className="flex-1 min-w-[160px] text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                />
                <select
                  value={newLangLevel}
                  onChange={(e) => setNewLangLevel(e.target.value as any)}
                  className="text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                >
                  <option value="Básico">Básico</option>
                  <option value="Elemental">Elemental</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Fluido">Fluido</option>
                  <option value="Nativo">Nativo</option>
                </select>
                <button
                  onClick={() => {
                    if (!newLangName.trim()) return;
                    addLanguage({
                      language: newLangName.trim(),
                      proficiency: newLangLevel,
                    });
                    setNewLangName("");
                  }}
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar
                </button>
              </div>

              <div className="space-y-2.5">
                {library.languages.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-xs text-neutral-500">Todavía no agregaste idiomas.</p>
                  </div>
                ) : (
                  library.languages.map((l) => (
                    <div
                      key={l.id}
                      className="p-3.5 rounded-xl border border-neutral-200 flex justify-between items-start bg-white text-xs gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-neutral-900">{l.language}: </span>
                        <span className="text-neutral-700 font-medium">{l.proficiency}</span>
                        {l.certification && (
                          <p className="text-neutral-600 text-[11px] mt-0.5">Certificación: {l.certification}</p>
                        )}
                        {l.notes && (
                          <p className="text-neutral-500 text-[11px] mt-0.5 italic">{l.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingLang(l);
                            setLangModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded"
                          title="Editar idioma"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "language",
                              id: l.id,
                              name: l.language,
                            })
                          }
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded"
                          title="Eliminar idioma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 11: LOGROS */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Logros Destacados</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Hitos concretos y cuantificables en tu carrera.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAch({
                      title: "",
                      description: "",
                      result: "",
                      date: "",
                    });
                    setAchModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar Logro
                </button>
              </div>

              <div className="space-y-3">
                {library.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3.5 rounded-xl border border-neutral-200 flex justify-between items-start bg-white text-xs"
                  >
                    <div>
                      <h3 className="font-bold text-neutral-900">{ach.title}</h3>
                      <p className="text-neutral-700 mt-0.5">{ach.description}</p>
                      {ach.result && <p className="text-neutral-500 italic mt-0.5">Resultado: {ach.result}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingAch(ach);
                          setAchModalOpen(true);
                        }}
                        className="text-neutral-500 hover:text-neutral-900 p-1"
                        title="Editar logro"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "achievement",
                            id: ach.id,
                            name: ach.title,
                          })
                        }
                        className="text-neutral-400 hover:text-red-600 p-1"
                        title="Eliminar logro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: PROYECTOS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Proyectos Clave</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Iniciativas que lideraste o en las que colaboraste.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProj({
                      title: "",
                      description: "",
                      role: "",
                      date: "",
                      tools: "",
                      result: "",
                    });
                    setProjModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar Proyecto
                </button>
              </div>

              <div className="space-y-3">
                {library.projects.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-xs text-neutral-500">Todavía no agregaste proyectos clave.</p>
                  </div>
                ) : (
                  library.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl border border-neutral-200 flex justify-between items-start bg-white text-xs gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-900">{proj.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 text-neutral-600 font-medium mt-0.5">
                          {proj.role && <span>{proj.role}</span>}
                          {proj.date && <span className="font-mono-num text-[11px] text-neutral-500">· {proj.date}</span>}
                          {proj.tools && <span className="text-[11px] text-neutral-500">· Herramientas: {proj.tools}</span>}
                        </div>
                        {proj.description && <p className="text-neutral-700 mt-1 leading-relaxed">{proj.description}</p>}
                        {proj.result && (
                          <div className="mt-1.5 p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-[11px] text-neutral-800">
                            <span className="font-bold text-neutral-900">Resultado: </span>
                            {proj.result}
                          </div>
                        )}
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline block mt-1 truncate"
                          >
                            {proj.url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProj(proj);
                            setProjModalOpen(true);
                          }}
                          className="text-neutral-500 hover:text-neutral-900 p-1"
                          title="Editar proyecto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "project",
                              id: proj.id,
                              name: proj.title,
                            })
                          }
                          className="text-neutral-400 hover:text-red-600 p-1"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: REFERENCIAS */}
          {activeTab === "references" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Referencias Laborales</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Contactos profesionales que avalan tu trayectoria.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingRef({
                      name: "",
                      position: "",
                      company: "",
                      contact: "",
                      notes: "",
                      isHidden: false,
                    });
                    setRefModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  + Agregar Referencia
                </button>
              </div>

              <div className="space-y-3">
                {library.references.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-xl">
                    <p className="text-xs text-neutral-500">Todavía no agregaste referencias laborales.</p>
                  </div>
                ) : (
                  library.references.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-neutral-200 flex justify-between items-start bg-white text-xs gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-neutral-900">{r.name}</div>
                        <div className="text-neutral-600 mt-0.5">{r.position} — {r.company}</div>
                        <div className="text-neutral-500 font-mono-num mt-0.5">{r.contact}</div>
                        {r.notes && (
                          <div className="text-neutral-500 text-[11px] italic mt-1 bg-neutral-50 p-1.5 rounded border border-neutral-100">
                            {r.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingRef(r);
                            setRefModalOpen(true);
                          }}
                          className="text-neutral-500 hover:text-neutral-900 p-1"
                          title="Editar referencia"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "reference",
                              id: r.id,
                              name: r.name,
                            })
                          }
                          className="text-neutral-400 hover:text-red-600 p-1"
                          title="Eliminar referencia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 14: SECCIONES PERSONALIZADAS */}
          {activeTab === "custom" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Secciones Personalizadas</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Crea secciones totalmente nuevas (Publicaciones, Voluntariado, Premios, etc.).
                  </p>
                </div>
                <button
                  onClick={() => setCustomSecModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Sección</span>
                </button>
              </div>

              <div className="space-y-4">
                {library.customSections.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-100 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                            {cs.name}
                          </h3>
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Sección Personalizada
                          </span>
                        </div>
                        {cs.description && (
                          <p className="text-xs text-neutral-500 mt-0.5">{cs.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomSec(cs);
                            setNewCustomSecName(cs.name);
                            setNewCustomSecDesc(cs.description || "");
                            setCustomSecModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900 font-medium px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 cursor-pointer transition-colors"
                          title="Editar título y descripción de la sección"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Editar Sección</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCustomSecId(cs.id);
                            setEditingCustomItemId(null);
                            setCustomItemTitle("");
                            setCustomItemSubtitle("");
                            setCustomItemDate("");
                            setCustomItemDesc("");
                          }}
                          className="flex items-center gap-1 text-xs text-neutral-800 hover:text-neutral-900 font-semibold px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 cursor-pointer transition-colors"
                        >
                          <span>+ Agregar elemento</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "customSection",
                              id: cs.id,
                              name: cs.name,
                            })
                          }
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 cursor-pointer transition-colors"
                          title="Eliminar sección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {cs.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200 text-xs flex justify-between items-start gap-2.5 hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-neutral-900 text-xs">{item.title}</span>
                              {item.date && (
                                <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-neutral-200/70 text-neutral-800 border border-neutral-300/60">
                                  {item.date}
                                </span>
                              )}
                            </div>
                            {item.subtitle && <div className="text-neutral-700 mt-0.5 font-medium">{item.subtitle}</div>}
                            {item.description && <p className="text-neutral-600 mt-1 leading-relaxed">{item.description}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCustomSecId(cs.id);
                                setEditingCustomItemId(item.id);
                                setCustomItemTitle(item.title);
                                setCustomItemSubtitle(item.subtitle || "");
                                setCustomItemDate(item.date || "");
                                setCustomItemDesc(item.description || "");
                              }}
                              className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer text-[11px] font-semibold transition-colors"
                              title="Editar este elemento"
                            >
                              <Edit2 className="w-3 h-3 text-neutral-600" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedItems = cs.items.filter((it) => it.id !== item.id);
                                updateCustomSection(cs.id, { items: updatedItems });
                              }}
                              className="text-neutral-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 cursor-pointer transition-colors"
                              title="Eliminar elemento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {cs.items.length === 0 && (
                        <p className="text-xs text-neutral-400 italic py-2 text-center">
                          No hay elementos en esta sección todavía. Haz clic en "+ Agregar elemento".
                        </p>
                      )}
                    </div>

                    {/* Inline add / edit item drawer */}
                    {activeCustomSecId === cs.id && (
                      <div className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-3 text-xs animate-in fade-in duration-150 shadow-xs">
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                          <span className="font-bold text-neutral-900 block text-xs">
                            {editingCustomItemId ? `✏️ Editar elemento en "${cs.name}"` : `+ Nuevo elemento en "${cs.name}"`}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {editingCustomItemId ? "Modifica los datos sin borrar el elemento" : "Se activará por defecto en todos tus CVs"}
                          </span>
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-800 block mb-1">
                            Título / Ítem *
                          </label>
                          <input
                            type="text"
                            value={customItemTitle}
                            onChange={(e) => setCustomItemTitle(e.target.value)}
                            placeholder="Ej. Licencia de Conducir"
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 text-xs font-medium"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-semibold text-neutral-800 block mb-1">
                              Detalle / Descripción opcional
                            </label>
                            <input
                              type="text"
                              value={customItemSubtitle}
                              onChange={(e) => setCustomItemSubtitle(e.target.value)}
                              placeholder="Ej. Categoría B1 - Al día / Movilidad propia"
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-neutral-800 block mb-1">
                              Fecha / Estado opcional
                            </label>
                            <input
                              type="text"
                              value={customItemDate}
                              onChange={(e) => setCustomItemDate(e.target.value)}
                              placeholder="Ej. Vigente, 2026, etc."
                              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-800 block mb-1">
                            Notas o Descripción adicional (opcional)
                          </label>
                          <textarea
                            rows={2}
                            value={customItemDesc}
                            onChange={(e) => setCustomItemDesc(e.target.value)}
                            placeholder="Información complementaria relevante para el CV..."
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1 border-t border-neutral-200">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCustomSecId(null);
                              setEditingCustomItemId(null);
                            }}
                            className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 rounded-lg cursor-pointer font-medium"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!customItemTitle.trim()) return;
                              if (editingCustomItemId) {
                                const updatedItems = cs.items.map((it) =>
                                  it.id === editingCustomItemId
                                    ? {
                                        ...it,
                                        title: customItemTitle.trim(),
                                        subtitle: customItemSubtitle.trim() || undefined,
                                        date: customItemDate.trim() || undefined,
                                        description: customItemDesc.trim() || undefined,
                                      }
                                    : it
                                );
                                updateCustomSection(cs.id, { items: updatedItems });
                              } else {
                                const newItem = {
                                  id: `it-${Date.now()}`,
                                  title: customItemTitle.trim(),
                                  subtitle: customItemSubtitle.trim() || undefined,
                                  date: customItemDate.trim() || undefined,
                                  description: customItemDesc.trim() || undefined,
                                };
                                updateCustomSection(cs.id, {
                                  items: [...cs.items, newItem],
                                });
                              }
                              setActiveCustomSecId(null);
                              setEditingCustomItemId(null);
                              setCustomItemTitle("");
                              setCustomItemSubtitle("");
                              setCustomItemDate("");
                              setCustomItemDesc("");
                            }}
                            className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors"
                          >
                            {editingCustomItemId ? "Guardar cambios en el elemento" : "+ Guardar elemento"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EXPERIENCIA LABORAL */}
      {expModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingExp.id ? "Editar Experiencia" : "Nueva Experiencia Laboral"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Puestos laborales, roles y responsabilidades desempeñadas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExpModalOpen(false);
                  setEditingExp(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Empresa u Organización *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Aeropuertos del Plata"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Cargo o Puesto *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.role || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Supervisor General"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={editingExp.location || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Buenos Aires, Argentina"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Fecha de Inicio (Año-Mes o Año)
                    </label>
                    <input
                      type="text"
                      value={editingExp.startDate || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                      placeholder="Ej. 2021-03 o 2021"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Fecha de Finalización
                    </label>
                    <input
                      type="text"
                      disabled={Boolean(editingExp.isCurrent)}
                      value={editingExp.endDate || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs disabled:opacity-50"
                      placeholder="Ej. 2024-01 o 2024"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                      <input
                        type="checkbox"
                        checked={Boolean(editingExp.isCurrent)}
                        onChange={(e) => setEditingExp({ ...editingExp, isCurrent: e.target.checked })}
                        className="rounded text-neutral-900"
                      />
                      <span>Trabajo actual</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Descripción General del Rol
                  </label>
                  <textarea
                    rows={3}
                    value={editingExp.description || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Resumen de funciones principales y contexto del puesto..."
                  />
                </div>

                {/* Responsibilities list manager */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-neutral-700">
                      Responsabilidades (Puntos viñeta)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingExp.responsibilities || [];
                        setEditingExp({ ...editingExp, responsibilities: [...current, ""] });
                      }}
                      className="text-xs font-semibold text-neutral-900 hover:text-neutral-700"
                    >
                      + Agregar viñeta
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {(editingExp.responsibilities || []).map((resp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-neutral-400">•</span>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => {
                            const next = [...(editingExp.responsibilities || [])];
                            next[idx] = e.target.value;
                            setEditingExp({ ...editingExp, responsibilities: next });
                          }}
                          className="flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded text-xs"
                          placeholder="Descripción de tarea u objetivo cumplido..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (editingExp.responsibilities || []).filter(
                              (_, i) => i !== idx
                            );
                            setEditingExp({ ...editingExp, responsibilities: next });
                          }}
                          className="text-neutral-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements list manager */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-neutral-700">
                      Logros Destacados en este Puesto (Opcional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingExp.achievements || [];
                        setEditingExp({ ...editingExp, achievements: [...current, ""] });
                      }}
                      className="text-xs font-semibold text-neutral-900 hover:text-neutral-700"
                    >
                      + Agregar logro
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {(editingExp.achievements || []).map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">★</span>
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => {
                            const next = [...(editingExp.achievements || [])];
                            next[idx] = e.target.value;
                            setEditingExp({ ...editingExp, achievements: next });
                          }}
                          className="flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded text-xs"
                          placeholder="Ej. Reducción del 30% en pérdidas patrimoniales durante el primer año..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (editingExp.achievements || []).filter(
                              (_, i) => i !== idx
                            );
                            setEditingExp({ ...editingExp, achievements: next });
                          }}
                          className="text-neutral-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {(editingExp.achievements || []).length === 0 && (
                      <p className="text-[11px] text-neutral-400 italic">
                        Sin logros específicos agregados. Haz clic en "+ Agregar logro" si deseas destacar hitos cuantificables.
                      </p>
                    )}
                  </div>
                </div>

                {/* Keywords / Competencias asociadas */}
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Palabras Clave / Competencias Asociadas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={(editingExp.keywords || []).join(", ")}
                    onChange={(e) => {
                      const words = e.target.value
                        .split(",")
                        .map((w) => w.trim())
                        .filter(Boolean);
                      setEditingExp({ ...editingExp, keywords: words });
                    }}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Seguridad Operativa, ISO 9001, Gestión de Crisis, CCTV"
                  />
                </div>

                {/* Información adicional */}
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Información Adicional (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingExp.additionalInfo || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, additionalInfo: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. División Aeroportuaria, Reporte a Dirección General..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setExpModalOpen(false);
                    setEditingExp(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Experiencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FORMACIÓN ACADÉMICA */}
      {eduModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingEdu.id ? "Editar Formación Académica" : "Nueva Formación Académica"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Títulos universitarios, técnicos, posgrados y secundarios.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEduModalOpen(false);
                  setEditingEdu(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                {/* Institución */}
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Institución Educativa / Universidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEdu.institution || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                    placeholder="Ej. Universidad Nacional de San Martín / UBA / UTN"
                  />
                </div>

                {/* Título y Carrera/Orientación */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Título Obtenido / Grado <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEdu.degree || ""}
                      onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                      placeholder="Ej. Licenciatura, Ingeniero, Técnico..."
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Carrera / Campo de Estudio / Orientación
                    </label>
                    <input
                      type="text"
                      value={editingEdu.fieldOfStudy || ""}
                      onChange={(e) => setEditingEdu({ ...editingEdu, fieldOfStudy: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                      placeholder="Ej. Seguridad Ciudadana y Operativa"
                    />
                  </div>
                </div>

                {/* Nivel y Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Nivel Académico
                    </label>
                    <select
                      value={editingEdu.level || "Grado"}
                      onChange={(e) => setEditingEdu({ ...editingEdu, level: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                    >
                      <option value="Grado">Grado / Universitario</option>
                      <option value="Posgrado">Posgrado / Especialización</option>
                      <option value="Maestría">Maestría / Máster</option>
                      <option value="Doctorado">Doctorado</option>
                      <option value="Terciario">Terciario / Tecnicatura</option>
                      <option value="Secundario">Secundario / Bachiller</option>
                      <option value="Diplomatura">Diplomatura</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Estado
                    </label>
                    <select
                      value={editingEdu.status || "Graduado"}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        setEditingEdu({
                          ...editingEdu,
                          status: newStatus,
                          endDate: newStatus === "En curso" ? (editingEdu.endDate || "Presente") : (editingEdu.endDate === "Presente" ? "" : editingEdu.endDate),
                        });
                      }}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                    >
                      <option value="Graduado">Graduado</option>
                      <option value="En curso">En curso</option>
                      <option value="Incompleto">Incompleto</option>
                      <option value="Pausado">Pausado</option>
                    </select>
                  </div>
                </div>

                {/* Fechas de Inicio y Fin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Fecha de Inicio (Año-Mes o Año)
                    </label>
                    <input
                      type="text"
                      value={editingEdu.startDate || ""}
                      onChange={(e) => setEditingEdu({ ...editingEdu, startDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                      placeholder="Ej. 2018-03 o 2018"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Fecha de Finalización
                    </label>
                    <input
                      type="text"
                      disabled={editingEdu.status === "En curso" && (editingEdu.endDate === "Presente" || editingEdu.endDate === "Actualidad")}
                      value={editingEdu.endDate || ""}
                      onChange={(e) => setEditingEdu({ ...editingEdu, endDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs focus:bg-white focus:border-neutral-900 transition-colors disabled:opacity-50"
                      placeholder="Ej. 2022-12 o 2022"
                    />
                  </div>
                </div>

                {/* Checkbox Cursando actualmente */}
                <div className="flex items-center gap-2 py-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-700 select-none">
                    <input
                      type="checkbox"
                      checked={editingEdu.status === "En curso" || editingEdu.endDate === "Presente" || editingEdu.endDate === "Actualidad"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditingEdu({
                            ...editingEdu,
                            status: "En curso",
                            endDate: "Presente",
                          });
                        } else {
                          setEditingEdu({
                            ...editingEdu,
                            status: "Graduado",
                            endDate: "",
                          });
                        }
                      }}
                      className="rounded text-neutral-900 focus:ring-0"
                    />
                    <span>Cursando actualmente (Estado "En curso" / Fecha "Presente")</span>
                  </label>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Ubicación (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingEdu.additionalInfo || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, additionalInfo: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors"
                    placeholder="Ej. Buenos Aires, Argentina"
                  />
                </div>

                {/* Descripción / Orientación / Información Adicional */}
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Descripción / Orientación / Información adicional
                  </label>
                  <textarea
                    rows={3}
                    value={editingEdu.description || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:border-neutral-900 transition-colors leading-relaxed"
                    placeholder="Ej. Orientación en gestión de crisis complejas, logística de seguridad urbana y normativas internacionales. Promedio general 8.80, honores académicos, materias destacadas, etc."
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEduModalOpen(false);
                    setEditingEdu(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors shadow-2xs active:scale-[0.99]"
                >
                  Guardar Formación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CURSO O CAPACITACIÓN */}
      {courseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingCourse.id ? "Editar Curso" : "Nuevo Curso o Capacitación"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Talleres, capacitaciones continuas y especializaciones cortas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseModalOpen(false);
                  setEditingCourse(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre del Curso o Taller <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Gestión de Crisis y Contingencias"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Institución u Organización Emisora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse.institution || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, institution: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Instituto Superior de Seguridad Operativa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Fecha (Año-Mes o Año)</label>
                    <input
                      type="text"
                      value={editingCourse.date || ""}
                      onChange={(e) => setEditingCourse({ ...editingCourse, date: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                      placeholder="Ej. 2023-08 o 2023"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Duración / Carga Horaria</label>
                    <input
                      type="text"
                      value={editingCourse.duration || ""}
                      onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. 60 horas, 3 meses"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Descripción / Temario breve</label>
                  <textarea
                    rows={2}
                    value={editingCourse.description || ""}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Temas principales vistos, metodologías y habilidades aprendidas..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Enlace / URL de Certificado o Credencial (opcional)
                  </label>
                  <input
                    type="url"
                    value={editingCourse.certificateUrl || editingCourse.url || ""}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        certificateUrl: e.target.value,
                        url: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                    placeholder="https://certificados.org/..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCourseModalOpen(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CERTIFICACIÓN OFICIAL */}
      {certModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingCert.id ? "Editar Certificación" : "Nueva Certificación Oficial"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Habilitaciones y credenciales formales con organismo emisor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCertModalOpen(false);
                  setEditingCert(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCertification} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre de la Certificación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.name || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Certificación AVSEC Oficial / ISO 9001 Lead Auditor"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Entidad u Organismo Emisor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.institution || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, institution: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. ANAC / OACI / Bureau Veritas"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Fecha de Emisión</label>
                    <input
                      type="text"
                      value={editingCert.issueDate || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                      placeholder="Ej. 2022-04 o 2022"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Fecha de Vencimiento (opcional)</label>
                    <input
                      type="text"
                      value={editingCert.expirationDate || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, expirationDate: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                      placeholder="Ej. 2027-04 o Sin vencimiento"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Nº o ID de Credencial / Matrícula</label>
                  <input
                    type="text"
                    value={editingCert.credentialId || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                    placeholder="Ej. AVSEC-ARG-8921"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Enlace de Validación / URL Oficial (opcional)
                  </label>
                  <input
                    type="url"
                    value={editingCert.url || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, url: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                    placeholder="https://anac.gob.ar/credenciales/..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Descripción o Alcance (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingCert.description || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Normas aplicadas, alcance de la habilitación profesional, etc."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCertModalOpen(false);
                    setEditingCert(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Certificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOGRO DESTACADO */}
      {achModalOpen && editingAch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingAch.id ? "Editar Logro" : "Nuevo Logro Destacado"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Hitos cuantificables y resultados de alto impacto profesional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAchModalOpen(false);
                  setEditingAch(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAchievement} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Título del Logro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAch.title || ""}
                    onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Auditoría Federal con Puntaje Perfecto"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Contexto o Desafío Inicial (Opcional)</label>
                  <input
                    type="text"
                    value={editingAch.context || ""}
                    onChange={(e) => setEditingAch({ ...editingAch, context: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Auditoría Federal anual en un entorno de alta criticidad"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Descripción de las Acciones Realizadas <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingAch.description || ""}
                    onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Describe cómo se implementó la solución o qué medidas se tomaron..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Resultado o Impacto Cuantificable</label>
                  <input
                    type="text"
                    value={editingAch.result || ""}
                    onChange={(e) => setEditingAch({ ...editingAch, result: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Reducción de tiempos en 35% / 100% de cumplimiento normativo"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Año o Fecha</label>
                  <input
                    type="text"
                    value={editingAch.date || ""}
                    onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                    placeholder="Ej. 2023"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAchModalOpen(false);
                    setEditingAch(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Logro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROYECTO CLAVE */}
      {projModalOpen && editingProj && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingProj.id ? "Editar Proyecto" : "Nuevo Proyecto Clave"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Iniciativas, implementación de sistemas y proyectos que lideraste.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProjModalOpen(false);
                  setEditingProj(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre del Proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProj.title || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Plan Integral de Evacuación y Respuesta"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Rol en el Proyecto</label>
                  <input
                    type="text"
                    value={editingProj.role || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, role: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Líder de Proyecto / Coordinador General"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={editingProj.description || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Alcance, objetivos y metodologías aplicadas..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Fecha o Período</label>
                    <input
                      type="text"
                      value={editingProj.date || ""}
                      onChange={(e) => setEditingProj({ ...editingProj, date: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                      placeholder="Ej. 2022 - 2023"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Herramientas Utilizadas</label>
                    <input
                      type="text"
                      value={editingProj.tools || ""}
                      onChange={(e) => setEditingProj({ ...editingProj, tools: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Excel, CCTV, Diagramas de Flujo"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Resultado o Impacto Cuantificable</label>
                  <input
                    type="text"
                    value={editingProj.result || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, result: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Reducción de incidentes en un 40% / Certificación IATA obtenida"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Enlace / URL del Proyecto (Opcional)</label>
                  <input
                    type="url"
                    value={editingProj.url || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, url: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono-num text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setProjModalOpen(false);
                    setEditingProj(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REFERENCIA LABORAL */}
      {refModalOpen && editingRef && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingRef.id ? "Editar Referencia" : "Nueva Referencia Laboral"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Contactos profesionales que avalan tu trayectoria.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRefModalOpen(false);
                  setEditingRef(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveReference} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre y Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRef.name || ""}
                    onChange={(e) => setEditingRef({ ...editingRef, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Ing. Carlos Méndez"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Cargo o Función</label>
                    <input
                      type="text"
                      value={editingRef.position || ""}
                      onChange={(e) => setEditingRef({ ...editingRef, position: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Gerente de Operaciones"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Empresa u Organización</label>
                    <input
                      type="text"
                      value={editingRef.company || ""}
                      onChange={(e) => setEditingRef({ ...editingRef, company: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Aeropuertos del Plata"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Contacto (Teléfono / Correo)</label>
                  <input
                    type="text"
                    value={editingRef.contact || ""}
                    onChange={(e) => setEditingRef({ ...editingRef, contact: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono-num"
                    placeholder="correo@empresa.com / +54 9 11 ..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Observaciones (Opcional)</label>
                  <textarea
                    rows={2}
                    value={editingRef.notes || ""}
                    onChange={(e) => setEditingRef({ ...editingRef, notes: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Ej. Superior directo durante 3 años en División de Seguridad."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setRefModalOpen(false);
                    setEditingRef(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Referencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IDIOMA */}
      {langModalOpen && editingLang && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingLang.id ? "Editar Idioma" : "Nuevo Idioma"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Idiomas que dominas y nivel de competencia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLangModalOpen(false);
                  setEditingLang(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveLanguage} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Idioma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLang.language || ""}
                    onChange={(e) => setEditingLang({ ...editingLang, language: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Inglés, Francés, Portugués, Alemán"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nivel de Competencia
                  </label>
                  <select
                    value={editingLang.proficiency || "Intermedio"}
                    onChange={(e) => setEditingLang({ ...editingLang, proficiency: e.target.value as any })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Elemental">Elemental</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Fluido">Fluido</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Certificación Oficial o Examen (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingLang.certification || ""}
                    onChange={(e) => setEditingLang({ ...editingLang, certification: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Cambridge B2 First / TOEFL iBT 95 / EF SET 72"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Observaciones / Uso Profesional (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingLang.notes || ""}
                    onChange={(e) => setEditingLang({ ...editingLang, notes: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Negociación técnica fluida, redacción de reportes operativos..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLangModalOpen(false);
                    setEditingLang(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Idioma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HABILIDAD */}
      {skillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingSkill.id ? "Editar Habilidad" : "Nueva Habilidad"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Competencias clave para tu perfil profesional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSkillModalOpen(false);
                  setEditingSkill(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveSkill} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre de la Habilidad / Competencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Gestión de Crisis, Liderazgo de Equipos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Categoría
                    </label>
                    <select
                      value={editingSkill.category || "Gestión"}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    >
                      <option value="Gestión">Gestión</option>
                      <option value="Operativa">Operativa</option>
                      <option value="Estratégica">Estratégica</option>
                      <option value="Interpersonal">Interpersonal</option>
                      <option value="Técnica">Técnica</option>
                      <option value="Calidad">Calidad</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Nivel (Opcional)
                    </label>
                    <select
                      value={editingSkill.level || "Avanzado"}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    >
                      <option value="Avanzado">Avanzado</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Experto">Experto</option>
                      <option value="Básico">Básico</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Descripción o Contexto de Aplicación (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingSkill.description || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Ej. Coordinación de planes de respuesta, simulacros y liderazgo operativo..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSkillModalOpen(false);
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Habilidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HERRAMIENTA O SOFTWARE */}
      {toolModalOpen && editingTool && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingTool.id ? "Editar Herramienta" : "Nueva Herramienta o Software"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Herramientas tecnológicas, sistemas y aplicaciones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToolModalOpen(false);
                  setEditingTool(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveTool} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 text-xs flex-1">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Nombre del Software / Herramienta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTool.name || ""}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    placeholder="Ej. Excel Avanzado, SAP, Milestone CCTV, Jira"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={editingTool.category || ""}
                      onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      placeholder="Ej. Seguridad, Ofimática, ERP"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">
                      Nivel (Opcional)
                    </label>
                    <select
                      value={editingTool.level || "Intermedio"}
                      onChange={(e) => setEditingTool({ ...editingTool, level: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Experto">Experto</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setToolModalOpen(false);
                    setEditingTool(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Guardar Herramienta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SECCIÓN PERSONALIZADA (CREAR / EDITAR) */}
      {customSecModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-neutral-900">
              {editingCustomSec ? "Editar Sección Personalizada" : "+ Crear Sección Personalizada"}
            </h2>
            <p className="text-xs text-neutral-500">
              Define el nombre y propósito de la sección (ej. Voluntariado, OTROS:, Publicaciones, Premios).
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Nombre de la Sección *
                </label>
                <input
                  type="text"
                  value={newCustomSecName}
                  onChange={(e) => setNewCustomSecName(e.target.value)}
                  placeholder="Ej. OTROS:"
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  value={newCustomSecDesc}
                  onChange={(e) => setNewCustomSecDesc(e.target.value)}
                  placeholder="Ej. Licencias, disponibilidad y datos adicionales"
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setCustomSecModalOpen(false);
                    setEditingCustomSec(null);
                    setNewCustomSecName("");
                    setNewCustomSecDesc("");
                  }}
                  className="px-3 py-1.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newCustomSecName.trim()) return;
                    if (editingCustomSec) {
                      updateCustomSection(editingCustomSec.id, {
                        name: newCustomSecName.trim(),
                        description: newCustomSecDesc.trim(),
                      });
                    } else {
                      addCustomSection({
                        name: newCustomSecName.trim(),
                        description: newCustomSecDesc.trim(),
                        contentType: "items",
                        items: [],
                        order: 20,
                        isVisible: true,
                      });
                    }
                    setNewCustomSecName("");
                    setNewCustomSecDesc("");
                    setEditingCustomSec(null);
                    setCustomSecModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  {editingCustomSec ? "Guardar cambios" : "Crear Sección"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE VARIANT MODAL */}
      {profileModalOpen && editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-neutral-200 dark:border-slate-700">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              {editingProfile.id ? "Editar Perfil Profesional y Título" : "+ Agregar Nuevo Perfil / Título"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Define el cargo profesional para el encabezado y el texto del resumen correspondiente a este perfil.
            </p>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                  Título o Cargo Profesional (para el encabezado del CV) *
                </label>
                <input
                  type="text"
                  value={editingProfile.title || ""}
                  onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                  placeholder="Ej. Supervisor de Operaciones y Seguridad, Experto en Marketing, Especialista en Atención al Cliente..."
                  className="w-full p-2.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-300 dark:border-slate-700 rounded-lg text-neutral-900 dark:text-white text-xs focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 dark:text-slate-300 block mb-1">
                  Especialidad o Subtítulo Opcional
                </label>
                <input
                  type="text"
                  value={editingProfile.subtitle || ""}
                  onChange={(e) => setEditingProfile({ ...editingProfile, subtitle: e.target.value })}
                  placeholder="Ej. Seguridad Operativa y Logística, Estrategia Digital..."
                  className="w-full p-2.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-300 dark:border-slate-700 rounded-lg text-neutral-900 dark:text-white text-xs focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-slate-300">
                    Contenido del Resumen / Perfil Profesional *
                  </label>
                  <span className="text-[11px] text-neutral-400 dark:text-slate-500 font-mono-num">
                    {(editingProfile.content || editingProfile.summary || "").length} caracteres
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={editingProfile.content || editingProfile.summary || ""}
                  onChange={(e) => setEditingProfile({ ...editingProfile, content: e.target.value, summary: e.target.value })}
                  placeholder="Describe la trayectoria, fortalezas clave y propuesta de valor enfocada a este perfil..."
                  className="w-full p-3 bg-neutral-50 dark:bg-slate-900 border border-neutral-300 dark:border-slate-700 rounded-lg text-neutral-900 dark:text-white text-xs leading-relaxed focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setEditingProfile(null);
                  }}
                  className="px-3 py-1.5 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingProfile.title?.trim() && !editingProfile.content?.trim()) return;
                    if (editingProfile.id) {
                      updateProfileVariant(editingProfile.id, {
                        title: editingProfile.title?.trim() || "",
                        subtitle: editingProfile.subtitle?.trim() || "",
                        content: editingProfile.content || editingProfile.summary || "",
                        summary: editingProfile.content || editingProfile.summary || "",
                      });
                    } else {
                      addProfileVariant({
                        title: editingProfile.title?.trim() || "Nuevo Perfil",
                        subtitle: editingProfile.subtitle?.trim() || "",
                        content: editingProfile.content || editingProfile.summary || "",
                        summary: editingProfile.content || editingProfile.summary || "",
                        isDefault: false,
                      });
                    }
                    setEditingProfile(null);
                    setProfileModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-lg font-semibold cursor-pointer shadow-sm transition-colors"
                >
                  {editingProfile.id ? "Guardar cambios" : "Crear Perfil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-neutral-900">¿Confirmas la eliminación?</h3>
            <p className="text-xs text-neutral-600">
              Estás a punto de eliminar <span className="font-semibold text-neutral-900">"{deleteConfirm.name}"</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
