import { MasterLibrary, Resume, Experience, CustomSection, Course } from "../../types";

export interface ResolvedResumeData {
  resume: Resume;
  personal: MasterLibrary["personal"];
  contact: MasterLibrary["contact"];
  about: {
    title: string;
    content: string;
  };
  experiences: Experience[];
  education: MasterLibrary["education"];
  courses: MasterLibrary["courses"];
  certifications: MasterLibrary["certifications"];
  languages: MasterLibrary["languages"];
  skills: MasterLibrary["skills"];
  tools: MasterLibrary["tools"];
  achievements: MasterLibrary["achievements"];
  projects: MasterLibrary["projects"];
  references: MasterLibrary["references"];
  customSections: CustomSection[];
  sectionTitles: Record<string, string>;
  visibleSectionOrder: string[];
}

export function resolveResumeData(resume: Resume, library: MasterLibrary): ResolvedResumeData {
  const overrides = resume.itemOverrides || {};
  const titleOverrides = resume.sectionTitleOverrides || {};
  const defaultTitles = library.defaultSectionTitles || {};

  // Resolve section titles
  const sectionTitles: Record<string, string> = {
    about: titleOverrides.about || library.about.title || defaultTitles.about || "Perfil Profesional",
    experience: titleOverrides.experience || defaultTitles.experience || "Experiencia Laboral",
    education: titleOverrides.education || defaultTitles.education || "Formación Académica",
    courses: titleOverrides.courses || defaultTitles.courses || "Cursos y Capacitaciones",
    certifications: titleOverrides.certifications || defaultTitles.certifications || "Certificaciones",
    skills: titleOverrides.skills || defaultTitles.skills || "Competencias y Habilidades",
    tools: titleOverrides.tools || defaultTitles.tools || "Herramientas y Software",
    languages: titleOverrides.languages || defaultTitles.languages || "Idiomas",
    achievements: titleOverrides.achievements || defaultTitles.achievements || "Logros Destacados",
    projects: titleOverrides.projects || defaultTitles.projects || "Proyectos",
    references: titleOverrides.references || defaultTitles.references || "Referencias",
  };

  // Add custom sections titles
  library.customSections.forEach((cs) => {
    sectionTitles[cs.id] = titleOverrides[cs.id] || cs.name;
  });

  // Selected & Overridden Experiences (preserving order in selectedExperienceIds)
  const expMap = new Map(library.experiences.map((e) => [e.id, e]));
  const experiences: Experience[] = (
    Array.isArray(resume.selectedExperienceIds)
      ? resume.selectedExperienceIds
          .map((id) => expMap.get(id))
          .filter((e): e is Experience => e !== undefined && !e.isHidden)
      : library.experiences.filter((e) => !e.isHidden)
  ).map((e) => {
    const ov = overrides[e.id];
    if (!ov) return e;
    return {
      ...e,
      role: ov.title || e.role,
      company: ov.subtitle || e.company,
      description: ov.description !== undefined ? ov.description : e.description,
      responsibilities: ov.responsibilities || e.responsibilities,
      achievements: ov.achievements || e.achievements,
    };
  });

  // Selected Education (preserving order in selectedEducationIds)
  const eduMap = new Map(library.education.map((edu) => [edu.id, edu]));
  const education =
    Array.isArray(resume.selectedEducationIds)
      ? resume.selectedEducationIds
          .map((id) => eduMap.get(id))
          .filter((edu): edu is (typeof library.education)[0] => edu !== undefined)
      : library.education;

  // Selected Courses (preserving order in selectedCourseIds / coursesOrder)
  const rawCourseIds: string[] | null = Array.isArray(resume.selectedCourseIds)
    ? resume.selectedCourseIds
    : Array.isArray((resume as any).selectedCourses)
    ? ((resume as any).selectedCourses as string[])
    : null;

  const courseMap = new Map<string, Course>(library.courses.map((c) => [c.id, c]));
  let courses: Course[] = [];

  if (rawCourseIds !== null) {
    courses = rawCourseIds
      .map((id: string) => courseMap.get(id))
      .filter((c): c is Course => c !== undefined);
  } else {
    courses = [...library.courses];
  }

  // If coursesOrder is explicitly set on resume, honor it
  if (Array.isArray(resume.coursesOrder) && resume.coursesOrder.length > 0) {
    const orderIndex = new Map(resume.coursesOrder.map((id, idx) => [id, idx]));
    courses.sort((a, b) => {
      const idxA = orderIndex.has(a.id) ? orderIndex.get(a.id)! : 9999;
      const idxB = orderIndex.has(b.id) ? orderIndex.get(b.id)! : 9999;
      return idxA - idxB;
    });
  }

  // Selected Certifications (preserving order in selectedCertificationIds)
  const certMap = new Map(library.certifications.map((cert) => [cert.id, cert]));
  const certifications =
    Array.isArray(resume.selectedCertificationIds)
      ? resume.selectedCertificationIds
          .map((id) => certMap.get(id))
          .filter((cert): cert is (typeof library.certifications)[0] => cert !== undefined)
      : library.certifications;

  // Selected Languages (preserving order in selectedLanguageIds)
  const langMap = new Map(library.languages.map((l) => [l.id, l]));
  const languages =
    Array.isArray(resume.selectedLanguageIds)
      ? resume.selectedLanguageIds
          .map((id) => langMap.get(id))
          .filter((l): l is (typeof library.languages)[0] => l !== undefined)
      : library.languages;

  // Selected Skills (preserving order in selectedSkillIds)
  const skillMap = new Map(library.skills.map((s) => [s.id, s]));
  const skills =
    Array.isArray(resume.selectedSkillIds)
      ? resume.selectedSkillIds
          .map((id) => skillMap.get(id))
          .filter((s): s is (typeof library.skills)[0] => s !== undefined)
      : library.skills;

  // Selected Tools (preserving order in selectedToolIds)
  const toolMap = new Map(library.tools.map((t) => [t.id, t]));
  const tools =
    Array.isArray(resume.selectedToolIds)
      ? resume.selectedToolIds
          .map((id) => toolMap.get(id))
          .filter((t): t is (typeof library.tools)[0] => t !== undefined)
      : library.tools;

  // Selected Achievements (preserving order in selectedAchievementIds)
  const achMap = new Map(library.achievements.map((a) => [a.id, a]));
  const achievements =
    Array.isArray(resume.selectedAchievementIds)
      ? resume.selectedAchievementIds
          .map((id) => achMap.get(id))
          .filter((a): a is (typeof library.achievements)[0] => a !== undefined)
      : library.achievements;

  // Selected Projects (preserving order in selectedProjectIds)
  const projMap = new Map(library.projects.map((p) => [p.id, p]));
  const projects =
    Array.isArray(resume.selectedProjectIds)
      ? resume.selectedProjectIds
          .map((id) => projMap.get(id))
          .filter((p): p is (typeof library.projects)[0] => p !== undefined)
      : library.projects;

  // Selected References
  const selectedRefIds = new Set(resume.selectedReferenceIds || []);
  const references = library.references.filter((r) => selectedRefIds.has(r.id) && !r.isHidden);

  // Selected & Ordered Custom Sections
  const hidden = new Set(resume.hiddenSections || []);

  // Ensure all custom sections from library are included in the section order
  const fullSectionOrder = [...(resume.sectionOrder || [])];
  library.customSections.forEach((cs) => {
    if (!fullSectionOrder.includes(cs.id)) {
      fullSectionOrder.push(cs.id);
    }
  });

  // Visible sections in order (excluding explicitly hidden sections)
  const visibleSectionOrder = fullSectionOrder.filter((sKey) => !hidden.has(sKey));

  // Resolve custom sections with item ordering and selection
  const selectedCustomIds = resume.selectedCustomSectionIds && resume.selectedCustomSectionIds.length > 0
    ? new Set(resume.selectedCustomSectionIds)
    : null;
  const selectedItemIds = resume.selectedCustomItemIds ? new Set(resume.selectedCustomItemIds) : null;
  const itemsOrderMap = resume.customItemsOrder || {};

  const customSections: CustomSection[] = library.customSections
    .filter((cs) => {
      // If explicitly hidden in resume, exclude
      if (hidden.has(cs.id)) return false;
      return true;
    })
    .map((cs) => {
      let items = [...cs.items];

      // Honor custom item ordering in this resume if defined
      const customOrder = itemsOrderMap[cs.id];
      if (Array.isArray(customOrder) && customOrder.length > 0) {
        const orderIdx = new Map(customOrder.map((id, idx) => [id, idx]));
        items.sort((a, b) => {
          const idxA = orderIdx.has(a.id) ? orderIdx.get(a.id)! : 9999;
          const idxB = orderIdx.has(b.id) ? orderIdx.get(b.id)! : 9999;
          return idxA - idxB;
        });
      }

      // Filter by selectedCustomItemIds if configured
      if (selectedItemIds !== null && selectedItemIds.size > 0) {
        // If this custom section has at least one item present in selectedItemIds, filter by it
        const hasAnyTracked = cs.items.some((it) => selectedItemIds.has(it.id));
        if (hasAnyTracked) {
          items = items.filter((it) => selectedItemIds.has(it.id));
        }
      }

      return {
        ...cs,
        items,
      };
    });

  // Resolve Professional Title for this resume:
  // 1. Direct custom title on resume (resume.customProfessionalTitle)
  // 2. Selected profile variant from library (resume.selectedProfileId)
  // 3. Fallback to first profile variant from library (unless explicitly none)
  // 4. Fallback to library.personal.professionalTitle (unless explicitly none)
  const isProfileExplicitlyNone =
    resume.selectedProfileId === "none" ||
    resume.selectedProfileId === null ||
    resume.selectedProfileId === "";

  const selectedVariant = isProfileExplicitlyNone
    ? undefined
    : resume.selectedProfileId
    ? library.profileVariants?.find((p) => p.id === resume.selectedProfileId)
    : library.profileVariants && library.profileVariants.length > 0
    ? library.profileVariants[0]
    : undefined;

  const resolvedTitle =
    resume.customProfessionalTitle !== undefined && resume.customProfessionalTitle.trim().length > 0
      ? resume.customProfessionalTitle
      : selectedVariant?.title && selectedVariant.title.trim().length > 0
      ? selectedVariant.title
      : isProfileExplicitlyNone
      ? ""
      : library.personal.professionalTitle || "";

  // Resolve About Summary Content for this resume:
  // 1. Direct custom summary on resume (resume.customAboutSummary)
  // 2. Selected profile variant from library (resume.selectedProfileId)
  // 3. Fallback to first profile variant from library (unless explicitly none)
  // 4. Fallback to library.about.content (unless explicitly none)
  const resolvedAboutContent =
    resume.customAboutSummary !== undefined && resume.customAboutSummary.trim().length > 0
      ? resume.customAboutSummary
      : (selectedVariant?.content || selectedVariant?.summary) && (selectedVariant.content || selectedVariant.summary)!.trim().length > 0
      ? (selectedVariant.content || selectedVariant.summary)!
      : isProfileExplicitlyNone
      ? ""
      : library.about.content || "";

  return {
    resume,
    personal: {
      ...library.personal,
      professionalTitle: resolvedTitle,
    },
    contact: library.contact,
    about: {
      title: sectionTitles.about,
      content: resolvedAboutContent,
    },
    experiences,
    education,
    courses,
    certifications,
    languages,
    skills,
    tools,
    achievements,
    projects,
    references,
    customSections,
    sectionTitles,
    visibleSectionOrder,
  };
}

export interface SpacingConfig {
  leading: string;
  spaceY: string;
  sectionMarginBottom: string;
  sectionMbClass: string;
}

export const SPACING_CONFIG: Record<"compact" | "normal" | "spacious", SpacingConfig> = {
  compact: {
    leading: "leading-tight",
    spaceY: "space-y-3",
    sectionMarginBottom: "10px",
    sectionMbClass: "mb-2",
  },
  normal: {
    leading: "leading-normal",
    spaceY: "space-y-5",
    sectionMarginBottom: "16px",
    sectionMbClass: "mb-4",
  },
  spacious: {
    leading: "leading-relaxed",
    spaceY: "space-y-7",
    sectionMarginBottom: "24px",
    sectionMbClass: "mb-6",
  },
};

export function getSpacingConfig(spacing?: "compact" | "normal" | "spacious"): SpacingConfig {
  if (spacing && SPACING_CONFIG[spacing]) {
    return SPACING_CONFIG[spacing];
  }
  return SPACING_CONFIG.normal;
}

export function formatLinkedInUrl(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^linkedin\.com/i.test(trimmed) || /^www\.linkedin\.com/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return `https://www.linkedin.com/in/${trimmed.replace(/^\/+/, "")}`;
}

export function formatExternalUrl(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

