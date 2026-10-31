import { MasterLibrary, Resume, AISettings, Company, TemplateId } from "../../types";
import { initialMasterLibrary, initialResumes } from "../../data/initialData";
import { defaultAISettings } from "../ai/AIService";

export const initialCompanies: Company[] = [
  {
    id: "comp-1",
    name: "Hotel Sheraton Libertador",
    category: "Hotelería y Turismo",
    address: "Av. Córdoba 690, CABA",
    website: "https://www.marriott.com",
    email: "rrhh.sheraton@marriott.com",
    phone: "+54 11 4318-9000",
    status: "interesado",
    appliedDate: "",
    notes: "Presentarse con CV impreso en mano los martes y jueves de 10 a 13 hs en RRHH (3er piso). Preguntar por Lic. Florencia Díaz.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-2",
    name: "Securitas Argentina S.A.",
    category: "Seguridad y Vigilancia",
    address: "Av. del Libertador 7200, Núñez, CABA",
    website: "https://www.securitasargentina.com",
    email: "empleos@securitasargentina.com",
    phone: "+54 11 4789-5000",
    status: "enviado",
    appliedDate: new Date().toISOString().slice(0, 10),
    notes: "CV enviado por portal de empleos para puesto de Supervisor de Operaciones. Tienen vacantes abiertas para turnos rotativos.",
    updatedAt: new Date().toISOString(),
  },
];

export const STORAGE_KEYS = {
  MASTER_LIBRARY: "cv_builder_master_library_v1",
  RESUMES: "cv_builder_resumes_v1",
  AI_SETTINGS: "cv_builder_settings_v1",
  LEGACY_AI_SETTINGS: "cv_builder_ai_settings_v1",
  ACTIVE_RESUME_ID: "cv_builder_active_resume_id_v1",
  LAST_SAVED: "cv_builder_last_saved_v1",
  INITIALIZED: "cv_builder_initialized_v1",
  COMPANIES: "laburety_companies_v1",
  DELETED_RESUME_IDS: "laburety_deleted_resume_ids_v1",
};

export interface BackupData {
  version: string;
  app: string;
  exportedAt: string;
  masterLibrary: MasterLibrary;
  resumes: Resume[];
  companies?: Company[];
  activeResumeId?: string | null;
  aiSettings?: AISettings;
}

export class StorageService {
  /**
   * Returns whether user data has already been initialized in localStorage.
   */
  public static isInitialized(): boolean {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.INITIALIZED) === "true" ||
        localStorage.getItem(STORAGE_KEYS.MASTER_LIBRARY) !== null ||
        localStorage.getItem(STORAGE_KEYS.RESUMES) !== null
      );
    } catch {
      return false;
    }
  }

  /**
   * Initializes default demo data ONLY IF localStorage has no data whatsoever
   * (very first run in browser history).
   */
  public static ensureInitialized(): void {
    try {
      if (this.isInitialized()) {
        // Already initialized, never overwrite with demo data!
        return;
      }

      // First time EVER: Seed initial library data, never create fake or default resumes!
      this.saveMasterLibrary(initialMasterLibrary);
      this.saveResumes([]);
      this.saveAISettings(defaultAISettings);
      this.saveActiveResumeId(null);
      this.markInitialized();
      this.touchLastSaved();
    } catch (e) {
      console.error("Error during initial storage initialization:", e);
    }
  }

  /**
   * Retrieves the Master Library.
   * Priority: Saved data in localStorage ALWAYS takes absolute precedence.
   * Demo data is ONLY loaded on the very first visit in history.
   */
  public static getMasterLibrary(): MasterLibrary {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MASTER_LIBRARY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          // Merge safely with empty schema to ensure all arrays/subfields exist
          // without ever modifying or dropping user data
          const empty = this.getEmptyMasterLibrary();
          const defaultTitle = parsed.personal?.professionalTitle || "Supervisor de Operaciones y Seguridad";
          const defaultContent = parsed.about?.content || "";
          const initialVariants = [
            {
              id: "profile-default-1",
              title: defaultTitle,
              content: defaultContent,
              isDefault: true,
            },
          ];

          return {
            ...empty,
            ...parsed,
            personal: { ...empty.personal, ...(parsed.personal || {}) },
            contact: { ...empty.contact, ...(parsed.contact || {}) },
            about: { ...empty.about, ...(parsed.about || {}) },
            profileVariants: Array.isArray(parsed.profileVariants) && parsed.profileVariants.length > 0
              ? parsed.profileVariants
              : initialVariants,
            experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
            education: Array.isArray(parsed.education) ? parsed.education : [],
            courses: Array.isArray(parsed.courses) ? parsed.courses : [],
            certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
            languages: Array.isArray(parsed.languages) ? parsed.languages : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
            tools: Array.isArray(parsed.tools) ? parsed.tools : [],
            achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
            projects: Array.isArray(parsed.projects) ? parsed.projects : [],
            references: Array.isArray(parsed.references) ? parsed.references : [],
            customSections: Array.isArray(parsed.customSections) ? parsed.customSections : [],
            defaultSectionTitles: {
              ...empty.defaultSectionTitles,
              ...(parsed.defaultSectionTitles || {}),
            },
          };
        }
      }
    } catch (e) {
      console.error("Error reading master library from localStorage:", e);
    }

    // If never initialized before in history, initialize atomically
    if (!this.isInitialized()) {
      this.ensureInitialized();
      return initialMasterLibrary;
    }

    // If initialized previously but data was empty, return empty template (never overwrite user data with demo!)
    return this.getEmptyMasterLibrary();
  }

  public static saveMasterLibrary(library: MasterLibrary): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MASTER_LIBRARY, JSON.stringify(library));
      this.markInitialized();
      this.touchLastSaved();
    } catch (e) {
      console.error("Error saving master library to localStorage:", e);
    }
  }

  /**
   * Retrieves all Resumes.
   * Priority: Saved resumes in localStorage ALWAYS take absolute precedence.
   * Demo resumes are ONLY loaded on the very first visit in history.
   */
  public static getResumes(): Resume[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          let hasMigratedModern = false;
          const sanitized = parsed.map((resume: Resume) => {
            if ((resume.templateId as string) === "modern") {
              hasMigratedModern = true;
              return { ...resume, templateId: "harvard" as TemplateId };
            }
            return resume;
          });

          if (hasMigratedModern) {
            localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(sanitized));
          }

          return sanitized;
        }
      }
    } catch (e) {
      console.error("Error reading resumes from localStorage:", e);
    }

    // If never initialized before in history, initialize atomically
    if (!this.isInitialized()) {
      this.ensureInitialized();
      return [];
    }

    return [];
  }

  public static saveResumes(resumes: Resume[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
      this.markInitialized();
      this.touchLastSaved();
    } catch (e) {
      console.error("Error saving resumes to localStorage:", e);
    }
  }

  public static getActiveResumeId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_RESUME_ID);
    } catch {
      return null;
    }
  }

  public static saveActiveResumeId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_RESUME_ID);
      }
    } catch (e) {
      console.error("Error saving active resume id to localStorage:", e);
    }
  }

  public static getAISettings(): AISettings {
    try {
      const data =
        localStorage.getItem(STORAGE_KEYS.AI_SETTINGS) ||
        localStorage.getItem(STORAGE_KEYS.LEGACY_AI_SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading settings from localStorage:", e);
    }
    return defaultAISettings;
  }

  public static saveAISettings(settings: AISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving settings to localStorage:", e);
    }
  }

  public static getLastSavedTime(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SAVED) || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  public static touchLastSaved(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    } catch (e) {
      console.error("Error touching last saved time in localStorage:", e);
    }
  }

  public static markInitialized(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
    } catch {
      // ignore
    }
  }

  /**
   * Retrieves all Companies for the Job Radar module.
   * Stored independently in 'laburety_companies_v1'.
   */
  public static getCompanies(): Company[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading companies from localStorage:", e);
    }

    // Default sample companies on first access
    const initial = initialCompanies;
    this.saveCompanies(initial);
    return initial;
  }

  public static saveCompanies(companies: Company[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      this.touchLastSaved();
    } catch (e) {
      console.error("Error saving companies to localStorage:", e);
    }
  }

  /**
   * Generates and downloads a complete physical JSON backup file of all user data.
   */
  public static exportBackup(
    library?: MasterLibrary,
    resumes?: Resume[],
    aiSettings?: AISettings,
    activeResumeId?: string | null,
    companies?: Company[]
  ): void {
    const backup: BackupData = {
      version: "1.0.0",
      app: "Laburety",
      exportedAt: new Date().toISOString(),
      masterLibrary: library || this.getMasterLibrary(),
      resumes: resumes || this.getResumes(),
      companies: companies || this.getCompanies(),
      activeResumeId: activeResumeId ?? this.getActiveResumeId(),
      aiSettings: aiSettings || this.getAISettings(),
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 5).replace(":", "-");
    const filename = `laburety_backup_${dateStr}_${timeStr}.json`;

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validates and imports a JSON backup string into localStorage.
   */
  public static validateAndParseBackup(jsonString: string): {
    valid: boolean;
    data?: BackupData;
    error?: string;
  } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") {
        return { valid: false, error: "El archivo no contiene un objeto JSON válido." };
      }

      if (!parsed.masterLibrary || typeof parsed.masterLibrary !== "object") {
        return {
          valid: false,
          error: "Falta la sección 'masterLibrary' en el archivo de respaldo.",
        };
      }

      if (!Array.isArray(parsed.resumes)) {
        return {
          valid: false,
          error: "Falta la lista de currículums ('resumes') en el archivo de respaldo.",
        };
      }

      return { valid: true, data: parsed as BackupData };
    } catch (e) {
      return {
        valid: false,
        error: e instanceof Error ? e.message : "Error al procesar el archivo JSON.",
      };
    }
  }

  /**
   * Imports a backup directly into localStorage.
   */
  public static importBackup(jsonString: string): {
    success: boolean;
    message: string;
    data?: BackupData;
  } {
    const check = this.validateAndParseBackup(jsonString);
    if (!check.valid || !check.data) {
      return { success: false, message: check.error || "Archivo de respaldo inválido." };
    }

    const { masterLibrary, resumes, aiSettings, activeResumeId, companies } = check.data;

    this.saveMasterLibrary(masterLibrary);
    this.saveResumes(resumes);
    if (Array.isArray(companies)) {
      this.saveCompanies(companies);
    }
    if (aiSettings) {
      this.saveAISettings(aiSettings);
    }
    if (activeResumeId) {
      this.saveActiveResumeId(activeResumeId);
    }
    this.markInitialized();
    this.touchLastSaved();

    const personName = [masterLibrary.personal?.firstName, masterLibrary.personal?.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      success: true,
      message: `¡Copia de seguridad restaurada con éxito! Se cargaron ${resumes.length} currículum(s) y la biblioteca de ${personName || "usuario"}.`,
      data: check.data,
    };
  }

  /**
   * Resets the library data to base template without injecting fake resumes.
   */
  public static resetToDemo(): void {
    this.saveMasterLibrary(initialMasterLibrary);
    this.saveResumes([]);
    this.saveAISettings(defaultAISettings);
    this.saveActiveResumeId(null);
    this.markInitialized();
  }

  /**
   * Retrieves IDs of explicitly deleted resumes to prevent ghost reappearance on cloud sync.
   */
  public static getDeletedResumeIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DELETED_RESUME_IDS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error reading deleted resume IDs:", e);
    }
    return [];
  }

  /**
   * Records a resume ID as explicitly deleted.
   */
  public static recordDeletedResumeId(id: string): void {
    try {
      const current = this.getDeletedResumeIds();
      if (!current.includes(id)) {
        current.push(id);
        localStorage.setItem(STORAGE_KEYS.DELETED_RESUME_IDS, JSON.stringify(current));
      }
    } catch (e) {
      console.error("Error recording deleted resume ID:", e);
    }
  }

  /**
   * Removes a resume ID from the deleted tracking (e.g. if newly created with same ID).
   */
  public static removeDeletedResumeId(id: string): void {
    try {
      const current = this.getDeletedResumeIds().filter((d) => d !== id);
      localStorage.setItem(STORAGE_KEYS.DELETED_RESUME_IDS, JSON.stringify(current));
    } catch (e) {
      console.error("Error removing deleted resume ID:", e);
    }
  }

  /**
   * Clears all user data, leaving an empty library and 0 resumes.
   */
  public static clearAll(): void {
    const emptyLibrary = this.getEmptyMasterLibrary();
    this.saveMasterLibrary(emptyLibrary);
    this.saveResumes([]);
    this.saveActiveResumeId(null);
    this.markInitialized();
  }

  public static getEmptyMasterLibrary(): MasterLibrary {
    return {
      personal: {
        firstName: "",
        lastName: "",
        professionalTitle: "",
        location: "",
        country: "",
      },
      contact: {
        phone: "",
        email: "",
        customLinks: [],
      },
      about: {
        title: "Perfil Profesional",
        content: "",
      },
      profileVariants: [],
      experiences: [],
      education: [],
      courses: [],
      certifications: [],
      languages: [],
      skills: [],
      tools: [],
      achievements: [],
      projects: [],
      references: [],
      customSections: [],
      defaultSectionTitles: {
        about: "Perfil Profesional",
        experience: "Experiencia Laboral",
        education: "Formación Académica",
        courses: "Cursos y Capacitaciones",
        certifications: "Certificaciones",
        skills: "Competencias y Habilidades",
        tools: "Herramientas y Software",
        languages: "Idiomas",
        achievements: "Logros Destacados",
        projects: "Proyectos",
        references: "Referencias",
      },
    };
  }
}
