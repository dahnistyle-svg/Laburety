/**
 * Core Domain Types for Laburety
 */

export interface PersonalData {
  firstName: string;
  lastName: string;
  professionalName?: string;
  professionalTitle: string; // e.g. "Supervisor de Operaciones y Seguridad"
  profession?: string;
  photoUrl?: string;
  location: string; // City, State
  country: string;
}

export interface CustomContactLink {
  id: string;
  label: string;
  url: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
  github?: string;
  customLinks: CustomContactLink[];
}

export interface AboutProfile {
  title: string; // Default "Perfil Profesional"
  content: string;
}

export interface ProfileVariant {
  id: string;
  title: string; // Título Profesional para el encabezado (ej: "Supervisor de Operaciones y Seguridad", "Especialista en Marketing")
  subtitle?: string; // Especialidad o subtítulo opcional
  content: string; // Resumen / Perfil Profesional
  summary?: string; // Alias compatible para contenido
  isDefault?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string; // e.g. "2021-03" or "03/2021"
  endDate: string; // e.g. "2024-01" or ""
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  keywords: string[];
  additionalInfo?: string;
  isHidden?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  fieldOfStudy: string;
  degree: string;
  level: string; // e.g. "Grado", "Posgrado", "Tecnicatura", "Secundario"
  startDate: string;
  endDate: string;
  status: "Graduado" | "En curso" | "Pausado" | "Incompleto";
  description?: string;
  additionalInfo?: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  date: string;
  duration?: string;
  description?: string;
  certificateUrl?: string;
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
  description?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: "Básico" | "Elemental" | "Intermedio" | "Avanzado" | "Fluido" | "Nativo";
  certification?: string;
  notes?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string; // e.g. "Gestión", "Técnica", "Interpersonal"
  level?: string; // e.g. "Avanzado", "Intermedio"
  description?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category?: string;
  level?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  context?: string;
  result?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
  date?: string;
  tools?: string;
  result?: string;
  url?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact: string;
  notes?: string;
  isHidden?: boolean;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  name: string; // e.g. "Publicaciones", "Voluntariado", "Premios"
  description?: string;
  contentType: "items" | "text" | "bullet_points";
  textContent?: string;
  items: CustomSectionItem[];
  order: number;
  isVisible: boolean;
}

export interface MasterLibrary {
  personal: PersonalData;
  contact: ContactInfo;
  about: AboutProfile;
  profileVariants?: ProfileVariant[];
  experiences: Experience[];
  education: Education[];
  courses: Course[];
  certifications: Certification[];
  languages: Language[];
  skills: Skill[];
  tools: ToolItem[];
  achievements: Achievement[];
  projects: Project[];
  references: Reference[];
  customSections: CustomSection[];
  defaultSectionTitles: Record<string, string>;
}

export type TemplateId = "harvard" | "executive" | "ats";

export type CoursesDisplayFormat = "detailed" | "compact-grid" | "compact-inline";

export interface ItemOverride {
  title?: string;
  subtitle?: string;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface VisualSettings {
  fontFamily: "garamond" | "merriweather" | "sans" | "cinzel";
  fontSize: "sm" | "base" | "lg";
  primaryColor: string;
  secondaryColor: string;
  spacing: "compact" | "normal" | "spacious";
  margins: "tight" | "normal" | "relaxed";
  showPhoto: boolean;
  showCourseDates?: boolean;
  showSkillLevels?: boolean;
  headerAlignment: "left" | "center";
  photoPosition?: "left" | "right";
  photoShape?: "circle" | "rounded";
  photoSize?: "sm" | "md" | "lg" | "xl";
}

export interface Resume {
  id: string;
  name: string;
  objective: string;
  description?: string;
  templateId: TemplateId;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "active" | "archived";
  notes?: string;
  selectedProfileId?: string;
  customProfessionalTitle?: string;
  customAboutSummary?: string;
  
  // Selective inclusion IDs
  selectedExperienceIds: string[];
  selectedEducationIds: string[];
  selectedCourseIds: string[];
  selectedCertificationIds: string[];
  selectedLanguageIds: string[];
  selectedSkillIds: string[];
  selectedToolIds: string[];
  selectedAchievementIds: string[];
  selectedProjectIds: string[];
  selectedReferenceIds: string[];
  selectedCustomSectionIds: string[];
  selectedCustomItemIds?: string[];
  customItemsOrder?: Record<string, string[]>;

  // Ordering & Visibility
  sectionOrder: string[]; // ['about', 'experience', 'education', 'skills', 'courses', 'certifications', 'languages', 'tools', 'achievements', 'projects', 'references', ...]
  hiddenSections: string[];
  
  // Custom titles per CV
  sectionTitleOverrides: Record<string, string>;
  
  // Specific item overrides per CV (without mutating master library)
  itemOverrides: Record<string, ItemOverride>;

  // Design customization
  visualSettings: VisualSettings;

  // Courses & Skills format customization
  coursesFormat?: CoursesDisplayFormat;
  coursesInlineIncludeInstitution?: boolean;
  showCourseDates?: boolean;
  showSkillLevels?: boolean;
  coursesOrder?: string[];
  coursesAlignment?: "justify" | "left";
}

export interface AISettings {
  enabled: boolean;
  textImprovement: boolean;
  resumeAnalysis: boolean;
  jobMatching: boolean;
  suggestions: boolean;
  profileGeneration: boolean;
  provider: "gemini" | "custom";
}

export type CompanyStatus = "interesado" | "enviado" | "entrevista" | "archivado";

export interface Company {
  id: string;
  name: string;
  category: string;
  address: string;
  website: string;
  email: string;
  phone?: string;
  status: CompanyStatus;
  appliedDate?: string; // YYYY-MM-DD
  linkedCvId?: string;
  notes: string;
  updatedAt: string;
}
