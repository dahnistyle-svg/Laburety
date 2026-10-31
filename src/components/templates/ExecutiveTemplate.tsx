import React from "react";
import {
  ResolvedResumeData,
  getSpacingConfig,
  formatLinkedInUrl,
  formatExternalUrl,
} from "./templateUtils";
import { CoursesRenderer } from "./CoursesRenderer";
import { EmptyResumePlaceholder } from "./EmptyResumePlaceholder";

interface TemplateProps {
  data: ResolvedResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const {
    personal,
    contact,
    about,
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
    resume,
  } = data;

  const primaryColor = resume.visualSettings.primaryColor || "#0f172a";

  const totalActiveItems =
    (about.content ? 1 : 0) +
    experiences.length +
    education.length +
    courses.length +
    certifications.length +
    languages.length +
    skills.length +
    tools.length +
    achievements.length +
    projects.length +
    references.length +
    customSections.reduce((sum, cs) => sum + cs.items.length, 0);

  const contactItems: { label: string; node: React.ReactNode }[] = [];
  if (personal.location || personal.country) {
    contactItems.push({
      label: "Ubicación",
      node: <span>{[personal.location, personal.country].filter(Boolean).join(", ")}</span>,
    });
  }
  if (contact.email) {
    contactItems.push({
      label: "Email",
      node: (
        <a href={`mailto:${contact.email.trim()}`} className="text-neutral-800 hover:underline">
          {contact.email}
        </a>
      ),
    });
  }
  if (contact.phone) {
    contactItems.push({
      label: "Teléfono",
      node: <span>{contact.phone}</span>,
    });
  }
  if (contact.linkedin) {
    const cleanDisplay = contact.linkedin.replace(/^https?:\/\/(www\.)?/i, "");
    contactItems.push({
      label: "LinkedIn",
      node: (
        <a
          href={formatLinkedInUrl(contact.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:underline"
        >
          {cleanDisplay}
        </a>
      ),
    });
  }
  if (contact.portfolio) {
    const cleanPortfolio = contact.portfolio.replace(/^https?:\/\/(www\.)?/i, "");
    contactItems.push({
      label: "Web",
      node: (
        <a
          href={formatExternalUrl(contact.portfolio)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:underline"
        >
          {cleanPortfolio}
        </a>
      ),
    });
  }

  const renderSectionHeader = (title: string) => (
    <h2
      className="section-heading text-xs font-bold uppercase tracking-wider mb-2 pb-1 pl-2 border-l-4 border-b border-neutral-300"
      style={{
        color: primaryColor,
        borderLeftColor: primaryColor,
        breakAfter: "avoid",
        pageBreakAfter: "avoid",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      {title}
    </h2>
  );

  const showPhoto = Boolean(resume.visualSettings?.showPhoto && personal.photoUrl);
  const photoPosition = resume.visualSettings?.photoPosition || "right";
  const photoShape = resume.visualSettings?.photoShape || "circle";
  const photoRadius = photoShape === "rounded" ? "8px" : "50%";
  const photoSizeKey = resume.visualSettings?.photoSize || "lg";
  const photoDimension =
    photoSizeKey === "sm" ? 90 : photoSizeKey === "md" ? 110 : photoSizeKey === "xl" ? 145 : 125;

  const spacingConfig = getSpacingConfig(resume.visualSettings?.spacing);

  return (
    <div
      className={`w-full bg-white text-neutral-800 font-sans-pro text-[13px] ${spacingConfig.leading}`}
    >
      {/* Executive Header Banner */}
      {showPhoto ? (
        <header
          className="pt-1.5 pb-4 mb-4 border-b-2 border-neutral-800"
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexDirection: photoPosition === "left" ? "row" : "row-reverse",
          }}
        >
          <img
            src={personal.photoUrl}
            alt={`${personal.firstName} ${personal.lastName}`}
            style={{
              width: `${photoDimension}px`,
              height: `${photoDimension}px`,
              flexShrink: 0,
              objectFit: "cover",
              borderRadius: photoRadius,
              border: "1px solid #d4d4d4",
            }}
          />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-3"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase leading-tight">
                {personal.firstName} {personal.lastName}
              </h1>
              {personal.professionalTitle && (
                <p
                  className="text-sm font-semibold tracking-wide mt-1 leading-normal"
                  style={{ color: primaryColor }}
                >
                  {personal.professionalTitle}
                </p>
              )}
            </div>
            <div className="text-xs text-neutral-600 space-y-0.5 sm:text-right font-mono-num leading-[1.35]">
              {contactItems.map((item, idx) => (
                <div key={idx} className="whitespace-nowrap">
                  <span className="text-neutral-500">{item.label}: </span>
                  <span className="text-neutral-800 font-medium">{item.node}</span>
                </div>
              ))}
            </div>
          </div>
        </header>
      ) : (
        <header
          className="pt-1.5 pb-4 mb-4 border-b-2 border-neutral-800"
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase leading-tight">
                {personal.firstName} {personal.lastName}
              </h1>
              {personal.professionalTitle && (
                <p
                  className="text-sm font-semibold tracking-wide mt-1 leading-normal"
                  style={{ color: primaryColor }}
                >
                  {personal.professionalTitle}
                </p>
              )}
            </div>
            <div className="text-xs text-neutral-600 space-y-0.5 sm:text-right font-mono-num leading-[1.35]">
              {contactItems.map((item, idx) => (
                <div key={idx} className="whitespace-nowrap">
                  <span className="text-neutral-500">{item.label}: </span>
                  <span className="text-neutral-800 font-medium">{item.node}</span>
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* When CV is empty / being built, render elegant placeholder */}
      {totalActiveItems === 0 ? (
        <EmptyResumePlaceholder />
      ) : (
        /* Main Flow */
        <div className={spacingConfig.spaceY}>
          {visibleSectionOrder.map((sectionKey) => {
            const sectionContainerStyle: React.CSSProperties = {
              display: "block",
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              overflow: "visible",
              marginBottom: spacingConfig.sectionMarginBottom,
              clear: "both",
              boxSizing: "border-box",
              paddingRight: 0,
              marginRight: 0,
            };

            if (sectionKey === "about" && about.content) {
              return (
                <section key="about" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.about)}
                  <p
                    className="text-neutral-700 print-item page-break-avoid m-0"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: "100%",
                      textAlign: "left",
                      lineHeight: 1.5,
                      wordBreak: "normal",
                      overflowWrap: "break-word",
                      letterSpacing: "0px",
                      boxSizing: "border-box",
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {about.content}
                  </p>
                </section>
              );
            }

            if (sectionKey === "experience" && experiences.length > 0) {
              return (
                <section key="experience" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.experience)}
                  <ul className="list-none p-0 m-0 space-y-3.5">
                    {experiences.map((exp) => (
                      <li
                        key={exp.id}
                        className="experience-item print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-neutral-900 text-sm flex-1 leading-[1.35] mb-1">
                            {exp.role}
                          </h3>
                          <span className="text-xs text-neutral-600 font-mono-num font-medium shrink-0 text-right whitespace-nowrap leading-[1.35]">
                            {exp.startDate} – {exp.isCurrent ? "Presente" : exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-start text-xs font-medium text-neutral-600 mt-0.5 mb-1 leading-[1.35]">
                          <span className="flex-1">{exp.company}</span>
                          {exp.location && (
                            <span className="shrink-0 text-right whitespace-nowrap ml-2">
                              {exp.location}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-neutral-700 text-xs mb-1.5 leading-[1.35]">
                            {exp.description}
                          </p>
                        )}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-neutral-700 leading-[1.35]">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mt-1.5 pl-4 border-l-2 border-neutral-200">
                            <span className="text-xs font-semibold text-neutral-900 leading-[1.35]">
                              Resultados e impacto:
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 text-xs text-neutral-700 mt-0.5 leading-[1.35]">
                              {exp.achievements.map((ach, i) => (
                                <li key={i}>{ach}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "education" && education.length > 0) {
              return (
                <section key="education" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.education)}
                  <ul className="list-none p-0 m-0 space-y-2.5">
                    {education.map((edu) => (
                      <li
                        key={edu.id}
                        className="education-item print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-neutral-900 text-xs flex-1 leading-[1.35] mb-1">
                            {edu.degree || edu.fieldOfStudy}
                          </h3>
                          <span className="text-xs text-neutral-600 font-mono-num font-medium shrink-0 text-right whitespace-nowrap leading-[1.35]">
                            {edu.startDate} – {edu.endDate || edu.status}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600 mt-0.5 mb-1 leading-[1.35]">
                          {edu.institution} {edu.level ? `· ${edu.level}` : ""}{" "}
                          {edu.additionalInfo ? `· ${edu.additionalInfo}` : ""}
                        </div>
                        {edu.description && (
                          <p className="text-neutral-600 text-xs mt-0.5 leading-[1.35]">
                            {edu.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "skills" && skills.length > 0) {
              const showSkillLevels =
                resume.showSkillLevels ?? resume.visualSettings?.showSkillLevels ?? true;
              return (
                <section key="skills" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.skills)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-[1.4]">
                    {skills.map((s, idx) => (
                      <li
                        key={s.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong className="font-semibold text-neutral-800">{s.name}</strong>
                        {showSkillLevels && s.level && (
                          <span className="text-neutral-500 font-mono-num text-[11px]">
                            {` (${s.level})`}
                          </span>
                        )}
                        {idx < skills.length - 1 ? " ·" : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "certifications" && certifications.length > 0) {
              return (
                <section key="certifications" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.certifications)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {certifications.map((c) => (
                      <li
                        key={c.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-4 w-full leading-[1.4]">
                          <strong className="font-bold text-neutral-900 text-xs flex-1">
                            {c.name}
                          </strong>
                          <span className="shrink-0 whitespace-nowrap text-right text-neutral-600 font-mono-num text-xs">
                            {c.issueDate}
                          </span>
                        </div>
                        {(c.institution || c.credentialId) && (
                          <div className="text-xs italic text-neutral-600 leading-[1.4] mt-0.5">
                            {c.institution}
                            {c.credentialId ? ` (ID: ${c.credentialId})` : ""}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "courses" && courses.length > 0) {
              return (
                <section key="courses" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.courses)}
                  <CoursesRenderer
                    courses={courses}
                    format={resume.coursesFormat}
                    includeInstitution={resume.coursesInlineIncludeInstitution}
                    showCourseDates={
                      resume.showCourseDates ?? resume.visualSettings?.showCourseDates ?? true
                    }
                    alignment={resume.coursesAlignment || "justify"}
                    theme={{
                      titleClass: "font-bold text-neutral-900 text-xs",
                      dateClass: "text-neutral-600 font-mono-num text-xs",
                      subClass: "text-xs text-neutral-700 italic",
                      textClass: "text-xs text-neutral-800",
                    }}
                  />
                </section>
              );
            }

            if (sectionKey === "languages" && languages.length > 0) {
              return (
                <section key="languages" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.languages)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-3 gap-y-1 text-neutral-800 text-xs leading-[1.4]">
                    {languages.map((l, idx) => (
                      <li
                        key={l.id}
                        className="inline-flex items-baseline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span>
                          <strong className="text-neutral-900 font-bold">{`${l.language}: `}</strong>
                          <span className="text-neutral-700">{l.proficiency}</span>
                          {l.certification && (
                            <span className="italic text-neutral-500 text-[11px]">{` (${l.certification})`}</span>
                          )}
                        </span>
                        {idx < languages.length - 1 && (
                          <span className="text-neutral-400 ml-3">•</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "tools" && tools.length > 0) {
              return (
                <section key="tools" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.tools)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-700">
                    {tools.map((t, idx) => (
                      <li
                        key={t.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span className="font-medium text-neutral-900">{t.name}</span>
                        {idx < tools.length - 1 && <span className="text-neutral-400 ml-2">/</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "achievements" && achievements.length > 0) {
              return (
                <section key="achievements" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.achievements)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {achievements.map((ach) => (
                      <li
                        key={ach.id}
                        className="print-item page-break-avoid pl-3 border-l-2 border-neutral-300"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="font-bold text-neutral-900 text-xs leading-[1.45]">
                          {ach.title}
                        </div>
                        <div className="text-neutral-700 text-xs leading-[1.45]">
                          {ach.description}
                        </div>
                        {ach.result && (
                          <div className="text-neutral-600 font-medium text-xs mt-0.5 leading-[1.45]">
                            Impacto: {ach.result}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "projects" && projects.length > 0) {
              return (
                <section key="projects" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.projects)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {projects.map((p) => (
                      <li
                        key={p.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-4 mb-0.5">
                          <strong className="font-bold text-neutral-900 text-xs flex-1">
                            {p.title}
                          </strong>
                          {p.date && (
                            <span className="shrink-0 whitespace-nowrap text-right text-neutral-500 font-mono-num text-xs">
                              {p.date}
                            </span>
                          )}
                        </div>
                        {p.role && (
                          <div className="text-neutral-600 font-medium text-xs mt-0.5 mb-1 leading-[1.35]">
                            {p.role}
                          </div>
                        )}
                        {p.description && (
                          <p className="text-neutral-700 text-xs mt-0.5 m-0 leading-[1.45]">
                            {p.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionKey === "references" && references.length > 0) {
              return (
                <section key="references" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.references)}
                  <ul className="list-none p-0 m-0 space-y-1.5 text-xs leading-[1.35]">
                    {references.map((ref) => (
                      <li
                        key={ref.id}
                        className="print-item page-break-avoid p-2 bg-neutral-50 rounded border border-neutral-200"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong className="font-bold text-neutral-900">{ref.name}</strong>
                        <span className="text-neutral-600">
                          {" — "}
                          {ref.position} ({ref.company})
                        </span>
                        {ref.contact && (
                          <span className="text-neutral-500 font-mono-num">{` · ${ref.contact}`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            const cs = customSections.find((item) => item.id === sectionKey);
            if (cs) {
              return (
                <section key={cs.id} style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles[cs.id] || cs.name)}
                  {cs.description && (
                    <p className="text-xs text-neutral-500 mb-1.5 italic leading-[1.35]">
                      {cs.description}
                    </p>
                  )}
                  <ul className="list-none p-0 m-0 space-y-1.5 text-xs">
                    {cs.items.map((it) => (
                      <li
                        key={it.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3 font-bold text-neutral-900">
                          <span className="flex-1 leading-[1.35] mb-1">{it.title}</span>
                          {it.date && (
                            <span className="text-neutral-500 font-mono-num font-normal shrink-0 text-right whitespace-nowrap leading-[1.35]">
                              {it.date}
                            </span>
                          )}
                        </div>
                        {it.subtitle && (
                          <div className="text-neutral-600 mt-0.5 mb-1 leading-[1.35]">
                            {it.subtitle}
                          </div>
                        )}
                        {it.description && (
                          <p className="text-neutral-700 mt-0.5 m-0 leading-[1.35]">
                            {it.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
};
