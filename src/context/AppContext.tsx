import { FirebaseSyncService, SyncStatus } from "../services/firebase/FirebaseSyncService";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  MasterLibrary,
  Resume,
  AISettings,
  PersonalData,
  ContactInfo,
  AboutProfile,
  ProfileVariant,
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
  TemplateId,
  ItemOverride,
  VisualSettings,
  Company,
} from "../types";
import { StorageService } from "../services/storage/storageService";
import { defaultAISettings, aiServiceInstance } from "../services/ai/AIService";

export type AppView = "dashboard" | "library" | "resumes" | "companies" | "editor" | "templates" | "settings";

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  libraryActiveTab: string;
  setLibraryActiveTab: (tab: string) => void;

  // Companies / Radar Laboral
  companies: Company[];
  addCompany: (company: Omit<Company, "id" | "updatedAt">) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Master Library
  library: MasterLibrary;
  updateLibrary: (updater: (prev: MasterLibrary) => MasterLibrary) => void;
  updatePersonal: (data: Partial<PersonalData>) => void;
  updateContact: (data: Partial<ContactInfo>) => void;
  updateAbout: (data: Partial<AboutProfile>) => void;
  
  // Profile Variants CRUD (Multiple Titles & Summaries)
  addProfileVariant: (variant: Omit<ProfileVariant, "id">) => ProfileVariant;
  updateProfileVariant: (id: string, variant: Partial<ProfileVariant>) => void;
  deleteProfileVariant: (id: string) => void;
  duplicateProfileVariant: (id: string) => ProfileVariant;

  // Library Item CRUD
  addExperience: (exp: Omit<Experience, "id">) => Experience;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  duplicateExperience: (id: string) => Experience;
  reorderExperiences: (newOrder: Experience[]) => void;

  addEducation: (edu: Omit<Education, "id">) => Education;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  addCourse: (course: Omit<Course, "id">) => Course;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addCertification: (cert: Omit<Certification, "id">) => Certification;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  addLanguage: (lang: Omit<Language, "id">) => Language;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;

  addSkill: (skill: Omit<Skill, "id">) => Skill;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  addTool: (tool: Omit<ToolItem, "id">) => ToolItem;
  updateTool: (id: string, tool: Partial<ToolItem>) => void;
  deleteTool: (id: string) => void;

  addAchievement: (ach: Omit<Achievement, "id">) => Achievement;
  updateAchievement: (id: string, ach: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  addProject: (proj: Omit<Project, "id">) => Project;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addReference: (ref: Omit<Reference, "id">) => Reference;
  updateReference: (id: string, ref: Partial<Reference>) => void;
  deleteReference: (id: string) => void;

  addCustomSection: (sec: Omit<CustomSection, "id">) => CustomSection;
  updateCustomSection: (id: string, sec: Partial<CustomSection>) => void;
  deleteCustomSection: (id: string) => void;

  updateDefaultSectionTitle: (sectionKey: string, newTitle: string) => void;

  // Resumes
  resumes: Resume[];
  activeResumeId: string | null;
  setActiveResumeId: (id: string | null) => void;
  activeResume: Resume | null;
  createResume: (data: {
    name: string;
    objective: string;
    description?: string;
    templateId: TemplateId;
    initialSelectionMode?: "empty" | "all";
  }) => Resume;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  duplicateResume: (id: string) => Resume;
  deleteResume: (id: string) => void;
  archiveResume: (id: string) => void;

  // Selective Inclusion & Overrides inside Resume
  toggleItemSelectionInResume: (resumeId: string, itemType: string, itemId: string) => void;
  setItemOverrideInResume: (resumeId: string, itemId: string, override: Partial<ItemOverride>) => void;
  removeItemOverrideInResume: (resumeId: string, itemId: string) => void;
  setSectionTitleOverrideInResume: (resumeId: string, sectionKey: string, title: string) => void;
  toggleSectionVisibilityInResume: (resumeId: string, sectionKey: string) => void;
  reorderSectionsInResume: (resumeId: string, newOrder: string[]) => void;
  updateVisualSettings: (resumeId: string, settings: Partial<VisualSettings>) => void;
  setCustomItemsOrderInResume: (resumeId: string, sectionId: string, itemIds: string[]) => void;
  selectAllCustomItemsInResume: (resumeId: string, sectionId: string, selectAll: boolean) => void;

  // AI & Settings
  aiSettings: AISettings;
  updateAISettings: (settings: Partial<AISettings>) => void;

  // Authentication
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Cloud Sync
  syncStatus: SyncStatus;
  triggerCloudSync: () => Promise<void>;
  // Status & Utility
  lastSaved: string;
  isSaving: boolean;
  exportBackup: () => void;
  importBackup: (jsonString: string) => { success: boolean; message: string };
  resetDemoData: () => void;
  clearAllData: () => void;
  openEditorForResume: (resumeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [libraryActiveTab, setLibraryActiveTab] = useState<string>("personal");

  const [library, setLibrary] = useState<MasterLibrary>(() => {
    StorageService.ensureInitialized();
    return StorageService.getMasterLibrary();
  });
  const [resumes, setResumes] = useState<Resume[]>(() => StorageService.getResumes());
  const [activeResumeId, setActiveResumeId] = useState<string | null>(() => {
    const savedId = StorageService.getActiveResumeId();
    const list = StorageService.getResumes();
    if (savedId && list.some((r) => r.id === savedId)) {
      return savedId;
    }
    return list.length > 0 ? list[0].id : null;
  });
  const [aiSettings, setAiSettings] = useState<AISettings>(() => StorageService.getAISettings());
  const [companies, setCompanies] = useState<Company[]>(() => StorageService.getCompanies());
  const [lastSaved, setLastSaved] = useState<string>(() => StorageService.getLastSavedTime());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => FirebaseSyncService.getStatus());
  useEffect(() => {
    return FirebaseSyncService.onStatusChange((status) => {
      setSyncStatus(status);
    });
  }, []);

  // Listen to Auth state and pull/merge data from Firestore
  useEffect(() => {
    return FirebaseSyncService.initAuth((cloudData) => {
      if (cloudData.library) setLibrary(cloudData.library);
      if (cloudData.resumes !== undefined) {
        setResumes(cloudData.resumes);
        setActiveResumeId((currentActive) => {
          if (currentActive && cloudData.resumes!.some((r) => r.id === currentActive)) {
            return currentActive;
          }
          return cloudData.resumes!.length > 0 ? cloudData.resumes![0].id : null;
        });
      }
      if (cloudData.companies !== undefined) setCompanies(cloudData.companies);
      if (cloudData.aiSettings) setAiSettings(cloudData.aiSettings);
    });
  }, []);

  const triggerCloudSync = useCallback(async () => {
    await FirebaseSyncService.syncAllToFirestore(library, resumes, companies, aiSettings);
  }, [library, resumes, companies, aiSettings]);


  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("laburety_auth") === "true";
    } catch {
      return false;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    // Allow local admin authentication
    if (normalizedEmail === "admin@laburety.com" && password === "admin123") {
      try {
        localStorage.setItem("laburety_auth", "true");
      } catch (e) {
        console.error("Error setting laburety_auth", e);
      }
      setIsLoggedIn(true);
      // Attempt Firebase anonymous or standard auth
      FirebaseSyncService.loginAnonymously().catch(console.warn);
      return { success: true };
    }
    // Alternatively attempt Firebase email/password authentication
    const fbRes = await FirebaseSyncService.loginWithEmail(normalizedEmail, password);
    if (fbRes.success) {
      try {
        localStorage.setItem("laburety_auth", "true");
      } catch (e) {
        console.error("Error setting laburety_auth", e);
      }
      setIsLoggedIn(true);
      return { success: true };
    }
    return {
      success: false,
      error: fbRes.error || "Credenciales incorrectas. Inténtalo de nuevo.",
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const res = await FirebaseSyncService.loginWithGoogle();
    if (res.success) {
      try {
        localStorage.setItem("laburety_auth", "true");
      } catch (e) {
        console.error("Error setting laburety_auth", e);
      }
      setIsLoggedIn(true);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("laburety_auth");
    } catch (e) {
      console.error("Error removing laburety_auth", e);
    }
    FirebaseSyncService.logout().catch(console.warn);
    setIsLoggedIn(false);
  }, []);

  const isFirstRender = React.useRef(true);

  // Debounced auto-save effect
  useEffect(() => {
    // Avoid marking as "saving" on initial mount if state matches localStorage
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      StorageService.saveMasterLibrary(library);
      StorageService.saveResumes(resumes);
      StorageService.saveAISettings(aiSettings);
      StorageService.saveCompanies(companies);
      StorageService.saveActiveResumeId(activeResumeId);
      // Async sync to Firebase Firestore without blocking local save
      FirebaseSyncService.syncAllToFirestore(library, resumes, companies, aiSettings).catch(console.warn);
      const now = new Date().toISOString();
      setLastSaved(now);
      setIsSaving(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [library, resumes, aiSettings, activeResumeId, companies]);

  // Fallback de seguridad: Si existe algún CV con la plantilla eliminada "modern", migrarlo silenciosamente a "harvard"
  useEffect(() => {
    setResumes((prevResumes) => {
      const hasModern = prevResumes.some((r) => (r.templateId as string) === "modern");
      if (!hasModern) return prevResumes;
      return prevResumes.map((r) =>
        (r.templateId as string) === "modern" ? { ...r, templateId: "harvard" as TemplateId } : r
      );
    });
  }, []);

  // Sincronización automática de Secciones Personalizadas con los CVs existentes
  useEffect(() => {
    if (!library.customSections || library.customSections.length === 0) return;
    setResumes((prevResumes) => {
      let changed = false;
      const allLibraryCustomItemIds = library.customSections.flatMap((cs) => cs.items.map((it) => it.id));

      const updated = prevResumes.map((resume) => {
        // Verificar si faltan secciones en sectionOrder
        const missingSecIds = library.customSections
          .map((cs) => cs.id)
          .filter((id) => !resume.sectionOrder.includes(id));

        // Determinar qué ítems personalizados deben agregarse/activarse por defecto
        let newSelectedCustomItemIds = resume.selectedCustomItemIds;
        let itemsChanged = false;

        if (!newSelectedCustomItemIds) {
          // Si no existía selectedCustomItemIds, activar todos los ítems por defecto
          newSelectedCustomItemIds = allLibraryCustomItemIds;
          itemsChanged = true;
        } else {
          // Si ya existía, revisar si alguna sección personalizada no tiene ninguno de sus ítems seleccionados
          // (por ejemplo una sección nueva como "OTROS:" con "Licencia de Conducir")
          const itemsToAdd: string[] = [];
          library.customSections.forEach((cs) => {
            const hasAnySelected = cs.items.some((it) => newSelectedCustomItemIds!.includes(it.id));
            if (!hasAnySelected && cs.items.length > 0) {
              // Activar por defecto todos los ítems de esta sección
              cs.items.forEach((it) => itemsToAdd.push(it.id));
            } else if (missingSecIds.includes(cs.id)) {
              cs.items.forEach((it) => itemsToAdd.push(it.id));
            }
          });

          if (itemsToAdd.length > 0) {
            const merged = Array.from(new Set([...newSelectedCustomItemIds, ...itemsToAdd]));
            if (merged.length !== newSelectedCustomItemIds.length) {
              newSelectedCustomItemIds = merged;
              itemsChanged = true;
            }
          }
        }

        // Si no faltan secciones y no cambiaron los ítems, no mutar este CV
        if (missingSecIds.length === 0 && !itemsChanged) return resume;

        changed = true;
        const newSectionOrder = missingSecIds.length > 0 ? [...resume.sectionOrder, ...missingSecIds] : resume.sectionOrder;
        const newSelectedSecIds = Array.from(
          new Set([...(resume.selectedCustomSectionIds || []), ...library.customSections.map((cs) => cs.id)])
        );

        return {
          ...resume,
          sectionOrder: newSectionOrder,
          selectedCustomSectionIds: newSelectedSecIds,
          selectedCustomItemIds: newSelectedCustomItemIds,
          updatedAt: new Date().toISOString(),
        };
      });

      return changed ? updated : prevResumes;
    });
  }, [library.customSections]);

  // Ensure synchronous save before window closes or refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      StorageService.saveMasterLibrary(library);
      StorageService.saveResumes(resumes);
      StorageService.saveAISettings(aiSettings);
      StorageService.saveCompanies(companies);
      StorageService.saveActiveResumeId(activeResumeId);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [library, resumes, aiSettings, activeResumeId, companies]);

  // Keep AIService instance synced
  useEffect(() => {
    aiServiceInstance.updateSettings(aiSettings);
  }, [aiSettings]);

  const activeResume = useMemo(() => {
    if (!activeResumeId) return null;
    return resumes.find((r) => r.id === activeResumeId) || null;
  }, [resumes, activeResumeId]);

  // Companies / Radar Laboral CRUD
  const addCompany = useCallback((data: Omit<Company, "id" | "updatedAt">): Company => {
    const newCompany: Company = {
      ...data,
      id: `comp-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    // Autocompletar con fecha de hoy si se crea directamente en 'enviado' y está vacío
    if (newCompany.status === "enviado" && !newCompany.appliedDate) {
      newCompany.appliedDate = new Date().toISOString().slice(0, 10);
    }
    setCompanies((prev) => [newCompany, ...prev]);
    return newCompany;
  }, []);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates, updatedAt: new Date().toISOString() };
        // Si el usuario cambia el estado a 'enviado' y appliedDate estaba vacío, autocompletar con hoy
        if (updates.status === "enviado" && !updated.appliedDate) {
          updated.appliedDate = new Date().toISOString().slice(0, 10);
        }
        return updated;
      })
    );
  }, []);

  const deleteCompany = useCallback((id: string) => {
    FirebaseSyncService.deleteCompanyFromFirestore(id).catch(console.warn);
    setCompanies((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      StorageService.saveCompanies(filtered);
      return filtered;
    });
  }, []);

  const updateLibrary = useCallback((updater: (prev: MasterLibrary) => MasterLibrary) => {
    setLibrary((prev) => updater(prev));
  }, []);

  const updatePersonal = useCallback((data: Partial<PersonalData>) => {
    setLibrary((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...data },
    }));
  }, []);

  const updateContact = useCallback((data: Partial<ContactInfo>) => {
    setLibrary((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...data },
    }));
  }, []);

  const updateAbout = useCallback((data: Partial<AboutProfile>) => {
    setLibrary((prev) => ({
      ...prev,
      about: { ...prev.about, ...data },
    }));
  }, []);

  // Profile Variants (Multiple Titles & Summaries) - 100% Independent
  const addProfileVariant = useCallback((variant: Omit<ProfileVariant, "id">): ProfileVariant => {
    const newVariant: ProfileVariant = {
      ...variant,
      id: `profile-${Date.now()}`,
      content: variant.content || variant.summary || "",
      summary: variant.summary || variant.content || "",
    };
    setLibrary((prev) => ({
      ...prev,
      profileVariants: [...(prev.profileVariants || []), newVariant],
    }));
    return newVariant;
  }, []);

  const updateProfileVariant = useCallback((id: string, updates: Partial<ProfileVariant>) => {
    setLibrary((prev) => {
      const currentList = prev.profileVariants || [];
      const updatedList = currentList.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.content !== undefined && updates.summary === undefined) {
            updated.summary = updates.content;
          } else if (updates.summary !== undefined && updates.content === undefined) {
            updated.content = updates.summary;
          }
          return updated;
        }
        return p;
      });

      return {
        ...prev,
        profileVariants: updatedList,
      };
    });
  }, []);

  const deleteProfileVariant = useCallback((id: string) => {
    setLibrary((prev) => {
      const currentList = prev.profileVariants || [];
      if (currentList.length <= 1) {
        // Do not delete the only remaining profile
        return prev;
      }
      return {
        ...prev,
        profileVariants: currentList.filter((p) => p.id !== id),
      };
    });
  }, []);

  const duplicateProfileVariant = useCallback((id: string): ProfileVariant => {
    let duplicated: ProfileVariant | null = null;
    setLibrary((prev) => {
      const currentList = prev.profileVariants || [];
      const target = currentList.find((p) => p.id === id);
      if (!target) return prev;

      duplicated = {
        ...target,
        id: `profile-${Date.now()}`,
        title: `${target.title} (Copia)`,
        isDefault: false,
      };

      return {
        ...prev,
        profileVariants: [...currentList, duplicated],
      };
    });
    return duplicated!;
  }, []);

  // Experience
  const addExperience = useCallback((exp: Omit<Experience, "id">): Experience => {
    const newExp: Experience = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setLibrary((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
    return newExp;
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setLibrary((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
    // Remove from resumes
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedExperienceIds: r.selectedExperienceIds.filter((expId) => expId !== id),
      }))
    );
  }, []);

  const duplicateExperience = useCallback((id: string): Experience => {
    const existing = library.experiences.find((e) => e.id === id);
    const newExp: Experience = {
      ...(existing || {
        company: "Nueva Empresa",
        role: "Nuevo Puesto",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        responsibilities: [],
        achievements: [],
        keywords: [],
      }),
      id: `exp-${Date.now()}`,
      role: `${existing?.role || "Puesto"} (Copia)`,
    };
    setLibrary((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
    return newExp;
  }, [library.experiences]);

  const reorderExperiences = useCallback((newOrder: Experience[]) => {
    setLibrary((prev) => ({
      ...prev,
      experiences: newOrder,
    }));
  }, []);

  // Education
  const addEducation = useCallback((edu: Omit<Education, "id">): Education => {
    const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, education: [newEdu, ...prev.education] }));
    return newEdu;
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setLibrary((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedEducationIds: r.selectedEducationIds.filter((eduId) => eduId !== id),
      }))
    );
  }, []);

  // Courses
  const addCourse = useCallback((course: Omit<Course, "id">): Course => {
    const newCourse: Course = { ...course, id: `course-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, courses: [newCourse, ...prev.courses] }));
    return newCourse;
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setLibrary((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedCourseIds: r.selectedCourseIds.filter((cId) => cId !== id),
      }))
    );
  }, []);

  // Certifications
  const addCertification = useCallback((cert: Omit<Certification, "id">): Certification => {
    const newCert: Certification = { ...cert, id: `cert-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, certifications: [newCert, ...prev.certifications] }));
    return newCert;
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<Certification>) => {
    setLibrary((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCertification = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedCertificationIds: r.selectedCertificationIds.filter((cId) => cId !== id),
      }))
    );
  }, []);

  // Languages
  const addLanguage = useCallback((lang: Omit<Language, "id">): Language => {
    const newLang: Language = { ...lang, id: `lang-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
    return newLang;
  }, []);

  const updateLanguage = useCallback((id: string, updates: Partial<Language>) => {
    setLibrary((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  }, []);

  const deleteLanguage = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedLanguageIds: r.selectedLanguageIds.filter((lId) => lId !== id),
      }))
    );
  }, []);

  // Skills
  const addSkill = useCallback((skill: Omit<Skill, "id">): Skill => {
    const newSkill: Skill = { ...skill, id: `sk-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    return newSkill;
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setLibrary((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedSkillIds: r.selectedSkillIds.filter((sId) => sId !== id),
      }))
    );
  }, []);

  // Tools
  const addTool = useCallback((tool: Omit<ToolItem, "id">): ToolItem => {
    const newTool: ToolItem = { ...tool, id: `tool-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, tools: [...prev.tools, newTool] }));
    return newTool;
  }, []);

  const updateTool = useCallback((id: string, updates: Partial<ToolItem>) => {
    setLibrary((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTool = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.id !== id),
    }));
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        selectedToolIds: r.selectedToolIds.filter((tId) => tId !== id),
      }))
    );
  }, []);

  // Achievements
  const addAchievement = useCallback((ach: Omit<Achievement, "id">): Achievement => {
    const newAch: Achievement = { ...ach, id: `ach-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
    return newAch;
  }, []);

  const updateAchievement = useCallback((id: string, updates: Partial<Achievement>) => {
    setLibrary((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  }, []);

  // Projects
  const addProject = useCallback((proj: Omit<Project, "id">): Project => {
    const newProj: Project = { ...proj, id: `proj-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    return newProj;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setLibrary((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // References
  const addReference = useCallback((ref: Omit<Reference, "id">): Reference => {
    const newRef: Reference = { ...ref, id: `ref-${Date.now()}` };
    setLibrary((prev) => ({ ...prev, references: [...prev.references, newRef] }));
    return newRef;
  }, []);

  const updateReference = useCallback((id: string, updates: Partial<Reference>) => {
    setLibrary((prev) => ({
      ...prev,
      references: prev.references.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const deleteReference = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      references: prev.references.filter((r) => r.id !== id),
    }));
  }, []);

  // Custom Sections
  const addCustomSection = useCallback((sec: Omit<CustomSection, "id">): CustomSection => {
    const newSec: CustomSection = { ...sec, id: `cust-sec-${Date.now()}` };
    setLibrary((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSec],
    }));

    // Sincronizar de inmediato con todos los CVs existentes
    const newItemIds = (newSec.items || []).map((it) => it.id);
    setResumes((prevResumes) =>
      prevResumes.map((r) => {
        const sectionOrder = r.sectionOrder.includes(newSec.id)
          ? r.sectionOrder
          : [...r.sectionOrder, newSec.id];
        const selectedCustomSectionIds = (r.selectedCustomSectionIds || []).includes(newSec.id)
          ? r.selectedCustomSectionIds
          : [...(r.selectedCustomSectionIds || []), newSec.id];
        const hiddenSections = (r.hiddenSections || []).filter((hId) => hId !== newSec.id);
        const selectedCustomItemIds = r.selectedCustomItemIds
          ? Array.from(new Set([...r.selectedCustomItemIds, ...newItemIds]))
          : newItemIds;
        return {
          ...r,
          sectionOrder,
          selectedCustomSectionIds,
          hiddenSections,
          selectedCustomItemIds,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    return newSec;
  }, []);

  const updateCustomSection = useCallback((id: string, updates: Partial<CustomSection>) => {
    setLibrary((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));

    // Si se agregaron ítems nuevos a la sección personalizada, activarlos por defecto en todos los CVs
    if (updates.items && Array.isArray(updates.items) && updates.items.length > 0) {
      const itemIds = updates.items.map((it) => it.id);
      setResumes((prevResumes) =>
        prevResumes.map((r) => {
          if (!r.selectedCustomItemIds) {
            return {
              ...r,
              selectedCustomItemIds: itemIds,
              updatedAt: new Date().toISOString(),
            };
          }
          const nextItems = Array.from(new Set([...r.selectedCustomItemIds, ...itemIds]));
          if (nextItems.length !== r.selectedCustomItemIds.length) {
            return {
              ...r,
              selectedCustomItemIds: nextItems,
              updatedAt: new Date().toISOString(),
            };
          }
          return r;
        })
      );
    }
  }, []);

  const deleteCustomSection = useCallback((id: string) => {
    setLibrary((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
    }));
    setResumes((prevResumes) =>
      prevResumes.map((r) => ({
        ...r,
        sectionOrder: r.sectionOrder.filter((sKey) => sKey !== id),
        selectedCustomSectionIds: (r.selectedCustomSectionIds || []).filter((sId) => sId !== id),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, []);

  const updateDefaultSectionTitle = useCallback((sectionKey: string, newTitle: string) => {
    setLibrary((prev) => ({
      ...prev,
      defaultSectionTitles: {
        ...prev.defaultSectionTitles,
        [sectionKey]: newTitle,
      },
    }));
  }, []);

  // Resume Management
  const createResume = useCallback(
    (data: {
      name: string;
      objective: string;
      description?: string;
      templateId: TemplateId;
      initialSelectionMode?: "empty" | "all";
    }): Resume => {
      const now = new Date().toISOString();
      const defaultVisuals: VisualSettings = {
        fontFamily: data.templateId === "harvard" ? "garamond" : "sans",
        fontSize: "base",
        primaryColor: data.templateId === "executive" ? "#0f172a" : "#18181b",
        secondaryColor: "#475569",
        spacing: "normal",
        margins: "normal",
        showPhoto: false,
        showCourseDates: true,
        showSkillLevels: true,
        headerAlignment: data.templateId === "harvard" ? "center" : "left",
        photoPosition: "right",
        photoShape: "circle",
        photoSize: "lg",
      };

      const startWithAll = data.initialSelectionMode === "all";

      const newResume: Resume = {
        id: `resume-${Date.now()}`,
        name: data.name,
        objective: data.objective,
        description: data.description || "",
        templateId: data.templateId,
        createdAt: now,
        updatedAt: now,
        status: "active",
        selectedExperienceIds: startWithAll ? library.experiences.map((e) => e.id) : [],
        selectedEducationIds: startWithAll ? library.education.map((e) => e.id) : [],
        selectedCourseIds: startWithAll ? library.courses.map((c) => c.id) : [],
        selectedCertificationIds: startWithAll ? library.certifications.map((c) => c.id) : [],
        selectedLanguageIds: startWithAll ? library.languages.map((l) => l.id) : [],
        selectedSkillIds: startWithAll ? library.skills.map((s) => s.id) : [],
        selectedToolIds: startWithAll ? library.tools.map((t) => t.id) : [],
        selectedAchievementIds: startWithAll ? library.achievements.map((a) => a.id) : [],
        selectedProjectIds: startWithAll ? library.projects.map((p) => p.id) : [],
        selectedReferenceIds: startWithAll ? library.references.map((r) => r.id) : [],
        selectedCustomSectionIds: startWithAll ? library.customSections.map((s) => s.id) : [],
        selectedCustomItemIds: startWithAll ? library.customSections.flatMap((s) => s.items.map((i) => i.id)) : [],
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
        visualSettings: defaultVisuals,
        showCourseDates: true,
        showSkillLevels: true,
        selectedProfileId: startWithAll && library.profileVariants && library.profileVariants.length > 0 ? library.profileVariants[0].id : "none",
        customProfessionalTitle: data.objective?.trim() || (startWithAll && library.profileVariants && library.profileVariants.length > 0 ? library.profileVariants[0].title : undefined),
        customAboutSummary: startWithAll && library.profileVariants && library.profileVariants.length > 0 ? (library.profileVariants[0].content || library.profileVariants[0].summary || "") : "",
      };

      StorageService.removeDeletedResumeId(newResume.id);
      setResumes((prev) => [newResume, ...prev]);
      setActiveResumeId(newResume.id);
      FirebaseSyncService.syncResume(newResume).catch(console.warn);
      return newResume;
    },
    [library]
  );

  const updateResume = useCallback((id: string, updates: Partial<Resume>) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  }, []);

  const duplicateResume = useCallback(
    (id: string): Resume => {
      const target = resumes.find((r) => r.id === id);
      const now = new Date().toISOString();
      const cloned: Resume = {
        ...(target || {
          name: "Nuevo CV",
          objective: "",
          templateId: "harvard",
          status: "active" as const,
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
          sectionOrder: [],
          hiddenSections: [],
          sectionTitleOverrides: {},
          itemOverrides: {},
          visualSettings: {
            fontFamily: "garamond",
            fontSize: "base",
            primaryColor: "#0f172a",
            secondaryColor: "#334155",
            spacing: "normal",
            margins: "normal",
            showPhoto: false,
            headerAlignment: "center",
          },
        }),
        id: `resume-${Date.now()}`,
        name: `${target?.name || "CV"} (Duplicado)`,
        createdAt: now,
        updatedAt: now,
      };

      StorageService.removeDeletedResumeId(cloned.id);
      setResumes((prev) => [cloned, ...prev]);
      setActiveResumeId(cloned.id);
      FirebaseSyncService.syncResume(cloned).catch(console.warn);
      return cloned;
    },
    [resumes]
  );

  const deleteResume = useCallback((id: string) => {
    // 1. Record ID as explicitly deleted to prevent ghost reappearance on cloud sync
    StorageService.recordDeletedResumeId(id);

    // 2. Direct, immediate and permanent deletion from Cloud Firestore
    FirebaseSyncService.deleteResumeFromFirestore(id).catch(console.warn);

    // 3. Update local state and persist to localStorage
    setResumes((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      StorageService.saveResumes(filtered);
      if (activeResumeId === id) {
        const nextActive = filtered.length > 0 ? filtered[0].id : null;
        setActiveResumeId(nextActive);
        StorageService.saveActiveResumeId(nextActive);
      }
      return filtered;
    });
  }, [activeResumeId]);

  const archiveResume = useCallback((id: string) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "archived" ? "active" : "archived",
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  }, []);

  // Selective toggles inside Resume
  const toggleItemSelectionInResume = useCallback(
    (resumeId: string, itemType: string, itemId: string) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== resumeId) return r;
          let key: keyof Resume;
          switch (itemType) {
            case "experience":
              key = "selectedExperienceIds";
              break;
            case "education":
              key = "selectedEducationIds";
              break;
            case "course":
              key = "selectedCourseIds";
              break;
            case "certification":
              key = "selectedCertificationIds";
              break;
            case "language":
              key = "selectedLanguageIds";
              break;
            case "skill":
              key = "selectedSkillIds";
              break;
            case "tool":
              key = "selectedToolIds";
              break;
            case "achievement":
              key = "selectedAchievementIds";
              break;
            case "project":
              key = "selectedProjectIds";
              break;
            case "reference":
              key = "selectedReferenceIds";
              break;
            case "customSection":
              key = "selectedCustomSectionIds";
              break;
            case "customItem":
              key = "selectedCustomItemIds";
              break;
            default:
              return r;
          }

          let currentIds = (r[key] as string[]) || [];
          if (itemType === "course") {
            if (!Array.isArray(r.selectedCourseIds) && Array.isArray((r as any).selectedCourses)) {
              currentIds = (r as any).selectedCourses;
            }
          } else if (itemType === "customItem" && !r.selectedCustomItemIds) {
            // Por defecto todos los elementos de todas las secciones personalizadas están activos
            currentIds = library.customSections.flatMap((cs) => cs.items.map((it) => it.id));
          }
          const exists = currentIds.includes(itemId);
          const nextIds = exists ? currentIds.filter((id) => id !== itemId) : [...currentIds, itemId];

          return {
            ...r,
            [key]: nextIds,
            ...(itemType === "course" ? { selectedCourses: nextIds } : {}),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  // Overrides inside Resume
  const setItemOverrideInResume = useCallback(
    (resumeId: string, itemId: string, override: Partial<ItemOverride>) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== resumeId) return r;
          const currentOverrides = r.itemOverrides || {};
          const existingItemOverride = currentOverrides[itemId] || {};
          return {
            ...r,
            itemOverrides: {
              ...currentOverrides,
              [itemId]: { ...existingItemOverride, ...override },
            },
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const removeItemOverrideInResume = useCallback((resumeId: string, itemId: string) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== resumeId) return r;
        const currentOverrides = { ...(r.itemOverrides || {}) };
        delete currentOverrides[itemId];
        return {
          ...r,
          itemOverrides: currentOverrides,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const setSectionTitleOverrideInResume = useCallback(
    (resumeId: string, sectionKey: string, title: string) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== resumeId) return r;
          return {
            ...r,
            sectionTitleOverrides: {
              ...r.sectionTitleOverrides,
              [sectionKey]: title,
            },
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const toggleSectionVisibilityInResume = useCallback((resumeId: string, sectionKey: string) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== resumeId) return r;
        const hidden = r.hiddenSections || [];
        const isHidden = hidden.includes(sectionKey);
        const nextHidden = isHidden ? hidden.filter((s) => s !== sectionKey) : [...hidden, sectionKey];
        return {
          ...r,
          hiddenSections: nextHidden,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const reorderSectionsInResume = useCallback((resumeId: string, newOrder: string[]) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== resumeId) return r;
        return {
          ...r,
          sectionOrder: newOrder,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const updateVisualSettings = useCallback((resumeId: string, settings: Partial<VisualSettings>) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== resumeId) return r;
        return {
          ...r,
          visualSettings: {
            ...r.visualSettings,
            ...settings,
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const setCustomItemsOrderInResume = useCallback(
    (resumeId: string, sectionId: string, itemIds: string[]) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== resumeId) return r;
          return {
            ...r,
            customItemsOrder: {
              ...(r.customItemsOrder || {}),
              [sectionId]: itemIds,
            },
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const selectAllCustomItemsInResume = useCallback(
    (resumeId: string, sectionId: string, selectAll: boolean) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== resumeId) return r;
          const targetSection = library.customSections.find((cs) => cs.id === sectionId);
          if (!targetSection) return r;
          const sectionItemIds = targetSection.items.map((it) => it.id);
          const currentSelected =
            r.selectedCustomItemIds || library.customSections.flatMap((cs) => cs.items.map((it) => it.id));
          let nextSelected: string[];
          if (selectAll) {
            nextSelected = Array.from(new Set([...currentSelected, ...sectionItemIds]));
          } else {
            nextSelected = currentSelected.filter((id) => !sectionItemIds.includes(id));
          }
          return {
            ...r,
            selectedCustomItemIds: nextSelected,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [library.customSections]
  );

  const updateAISettings = useCallback((settings: Partial<AISettings>) => {
    setAiSettings((prev) => {
      const next = { ...prev, ...settings };
      StorageService.saveAISettings(next);
      return next;
    });
  }, []);

  const exportBackup = useCallback(() => {
    StorageService.exportBackup(library, resumes, aiSettings, activeResumeId, companies);
  }, [library, resumes, aiSettings, activeResumeId, companies]);

  const importBackup = useCallback(
    (jsonString: string) => {
      const res = StorageService.importBackup(jsonString);
      if (res.success && res.data) {
        setLibrary(res.data.masterLibrary);
        setResumes(res.data.resumes);
        setCompanies(StorageService.getCompanies());
        if (res.data.aiSettings) {
          setAiSettings(res.data.aiSettings);
        }
        if (res.data.activeResumeId) {
          setActiveResumeId(res.data.activeResumeId);
        } else if (res.data.resumes.length > 0) {
          setActiveResumeId(res.data.resumes[0].id);
        } else {
          setActiveResumeId(null);
        }
        const now = new Date().toISOString();
        setLastSaved(now);
      }
      return { success: res.success, message: res.message };
    },
    []
  );

  const resetDemoData = useCallback(() => {
    StorageService.resetToDemo();
    setLibrary(StorageService.getMasterLibrary());
    const initial = StorageService.getResumes();
    setResumes(initial);
    setCompanies(StorageService.getCompanies());
    setActiveResumeId(initial.length > 0 ? initial[0].id : null);
    setAiSettings(defaultAISettings);
    const now = new Date().toISOString();
    setLastSaved(now);
  }, []);

  const clearAllData = useCallback(() => {
    StorageService.clearAll();
    setLibrary(StorageService.getMasterLibrary());
    setResumes([]);
    setActiveResumeId(null);
    const now = new Date().toISOString();
    setLastSaved(now);
  }, []);

  const openEditorForResume = useCallback((resumeId: string) => {
    setActiveResumeId(resumeId);
    setCurrentView("editor");
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        libraryActiveTab,
        setLibraryActiveTab,
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        library,
        updateLibrary,
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
        resumes,
        activeResumeId,
        setActiveResumeId,
        activeResume,
        createResume,
        updateResume,
        duplicateResume,
        deleteResume,
        archiveResume,
        toggleItemSelectionInResume,
        setItemOverrideInResume,
        removeItemOverrideInResume,
        setSectionTitleOverrideInResume,
        toggleSectionVisibilityInResume,
        reorderSectionsInResume,
        updateVisualSettings,
        setCustomItemsOrderInResume,
        selectAllCustomItemsInResume,
        aiSettings,
        updateAISettings,
        // Authentication
        isLoggedIn,
        login,
        loginWithGoogle,
        logout,
        lastSaved,
        isSaving,
        exportBackup,
        importBackup,
        resetDemoData,
        clearAllData,
        openEditorForResume,
        syncStatus,
        triggerCloudSync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
