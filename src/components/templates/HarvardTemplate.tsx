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

export const HarvardTemplate: React.FC<TemplateProps> = ({ data }) => {
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

  const fontClass =
    resume.visualSettings.fontFamily === "garamond"
      ? "font-garamond"
      : resume.visualSettings.fontFamily === "merriweather"
      ? "font-merriweather"
      : "font-sans-pro";

  const spacingConfig = getSpacingConfig(resume.visualSettings?.spacing);

  const contactNodes: React.ReactNode[] = [];
  if (personal.location || personal.country) {
    contactNodes.push(
      <span key="loc">{[personal.location, personal.country].filter(Boolean).join(", ")}</span>
    );
  }
  if (contact.phone) {
    contactNodes.push(<span key="phone">{contact.phone}</span>);
  }
  if (contact.email) {
    contactNodes.push(
      <a
        key="email"
        href={`mailto:${contact.email.trim()}`}
        className="text-neutral-700 hover:underline"
      >
        {contact.email}
      </a>
    );
  }
  if (contact.linkedin) {
    const cleanDisplay = contact.linkedin.replace(/^https?:\/\/(www\.)?/i, "");
    contactNodes.push(
      <a
        key="linkedin"
        href={formatLinkedInUrl(contact.linkedin)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-700 hover:underline"
      >
        {cleanDisplay}
      </a>
    );
  }
  if (contact.portfolio) {
    const cleanPortfolio = contact.portfolio.replace(/^https?:\/\/(www\.)?/i, "");
    contactNodes.push(
      <a
        key="portfolio"
        href={formatExternalUrl(contact.portfolio)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-700 hover:underline"
      >
        {cleanPortfolio}
      </a>
    );
  }

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

  const renderSectionHeader = (title: string) => (
    <h2
      className="section-heading text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 mb-2 mt-1"
      style={{
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

  return (
    <div
      className={`w-full bg-white text-neutral-900 ${fontClass} ${spacingConfig.leading} text-[13px] print:text-[12px]`}
    >
      {/* Header */}
      {showPhoto ? (
        <header
          className="pt-1.5 pb-3 border-b-2 border-neutral-900 mb-3"
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
            className="text-left"
          >
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">
              {personal.firstName} {personal.lastName}
            </h1>
            {personal.professionalTitle && (
              <p className="text-sm font-semibold tracking-wide text-neutral-700 mt-1 uppercase leading-normal">
                {personal.professionalTitle}
              </p>
            )}
            <div
              className="text-xs text-neutral-600 mt-2 leading-normal"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-start",
                columnGap: "6px",
                rowGap: "4px",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {contactNodes.map((node, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center"
                  style={{
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {node}
                  {idx < contactNodes.length - 1 && (
                    <span
                      className="text-neutral-400 select-none font-bold"
                      style={{
                        margin: "0 6px",
                        display: "inline-block",
                      }}
                    >
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </header>
      ) : (
        <header
          className="text-center pt-1.5 pb-3 border-b-2 border-neutral-900 mb-3"
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.professionalTitle && (
            <p className="text-sm font-semibold tracking-wide text-neutral-700 mt-1 uppercase leading-normal">
              {personal.professionalTitle}
            </p>
          )}
          <div
            className="text-xs text-neutral-600 mt-1.5 leading-normal"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "6px",
              rowGap: "4px",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {contactNodes.map((node, idx) => (
              <span
                key={idx}
                className="inline-flex items-center"
                style={{
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {node}
                {idx < contactNodes.length - 1 && (
                  <span
                    className="text-neutral-400 select-none font-bold"
                    style={{
                      margin: "0 6px",
                      display: "inline-block",
                    }}
                  >
                    •
                  </span>
                )}
              </span>
            ))}
          </div>
        </header>
      )}

      {/* When CV is empty / being built, render elegant placeholder */}
      {totalActiveItems === 0 ? (
        <EmptyResumePlaceholder />
      ) : (
        /* Dynamic Sections ordered */
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

            // About / Profile
            if (sectionKey === "about" && about.content) {
              return (
                <section key="about" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.about)}
                  <p
                    className="text-neutral-800 print-item page-break-avoid m-0"
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

            // Experience
            if (sectionKey === "experience" && experiences.length > 0) {
              return (
                <section key="experience" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.experience)}
                  <ul className="list-none p-0 m-0 space-y-3">
                    {experiences.map((exp) => (
                      <li
                        key={exp.id}
                        className="experience-item print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3 font-bold text-neutral-900">
                          <span className="flex-1 leading-[1.35] mb-1">{exp.role}</span>
                          <span className="shrink-0 text-right whitespace-nowrap text-xs text-neutral-600 font-mono-num font-normal leading-[1.35]">
                            {exp.startDate} – {exp.isCurrent ? "Actualidad" : exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-start italic text-xs text-neutral-700 mt-0.5 mb-1 leading-[1.35]">
                          <span className="flex-1">{exp.company}</span>
                          {exp.location && (
                            <span className="shrink-0 text-right whitespace-nowrap ml-2">
                              {exp.location}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-neutral-800 mb-1 leading-[1.35]">{exp.description}</p>
                        )}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="list-disc pl-4 space-y-0.5 text-neutral-800 leading-[1.35]">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="mt-1">
                            <span className="font-semibold text-xs text-neutral-900 leading-[1.35]">
                              Logros destacados:
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 text-neutral-800 leading-[1.35]">
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

            // Education
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
                        <div className="flex justify-between items-start gap-3 font-bold text-neutral-900">
                          <span className="flex-1 leading-[1.35] mb-1">
                            {edu.degree || edu.fieldOfStudy}
                          </span>
                          <span className="shrink-0 text-right whitespace-nowrap text-xs text-neutral-600 font-mono-num font-normal leading-[1.35]">
                            {edu.startDate} – {edu.endDate || edu.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-start italic text-xs text-neutral-700 mt-0.5 mb-1 leading-[1.35]">
                          <span className="flex-1">
                            {edu.institution}
                            {edu.additionalInfo ? ` · ${edu.additionalInfo}` : ""}
                          </span>
                          {edu.status && (
                            <span className="shrink-0 text-right whitespace-nowrap ml-2">
                              {edu.status}
                            </span>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-neutral-800 text-xs mt-0.5 leading-[1.35]">
                            {edu.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Skills
            if (sectionKey === "skills" && skills.length > 0) {
              const showSkillLevels =
                resume.showSkillLevels ?? resume.visualSettings?.showSkillLevels ?? true;
              return (
                <section key="skills" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.skills)}
                  <ul className="list-none p-0 m-0 text-neutral-800 leading-[1.35] flex flex-wrap gap-x-1.5 gap-y-1">
                    {skills.map((s, idx) => (
                      <li
                        key={s.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong className="text-neutral-900">{s.name}</strong>
                        {showSkillLevels && s.level && <span>{` (${s.level})`}</span>}
                        {idx < skills.length - 1 ? " ·" : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Certifications
            if (sectionKey === "certifications" && certifications.length > 0) {
              return (
                <section key="certifications" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.certifications)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {certifications.map((cert) => (
                      <li
                        key={cert.id}
                        className="print-item page-break-avoid"
                        style={{
                          breakInside: "avoid",
                          pageBreakInside: "avoid",
                        }}
                      >
                        <div className="flex justify-between items-start gap-4 w-full leading-[1.4]">
                          <strong className="font-bold text-neutral-900 flex-1">
                            {cert.name}
                          </strong>
                          <span className="shrink-0 whitespace-nowrap text-right text-xs text-neutral-600 font-mono-num">
                            {cert.issueDate}
                          </span>
                        </div>
                        {(cert.institution || cert.credentialId) && (
                          <div className="text-xs italic text-neutral-700 leading-[1.4] mt-0.5">
                            {cert.institution}
                            {cert.credentialId ? ` (ID: ${cert.credentialId})` : ""}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Courses
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
                      dateClass: "text-xs text-neutral-600 font-mono-num",
                      subClass: "text-xs text-neutral-700 italic",
                      textClass: "text-xs text-neutral-800",
                    }}
                  />
                </section>
              );
            }

            // Languages
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
                          <span>{l.proficiency}</span>
                          {l.certification && (
                            <span className="italic text-neutral-600">{` (${l.certification})`}</span>
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

            // Tools
            if (sectionKey === "tools" && tools.length > 0) {
              return (
                <section key="tools" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.tools)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-1.5 gap-y-1 text-neutral-800 leading-[1.35]">
                    {tools.map((t, idx) => (
                      <li
                        key={t.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span>{t.name}</span>
                        {idx < tools.length - 1 ? " ·" : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Achievements
            if (sectionKey === "achievements" && achievements.length > 0) {
              return (
                <section key="achievements" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.achievements)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {achievements.map((ach) => (
                      <li
                        key={ach.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-4 mb-0.5">
                          <strong className="font-bold text-neutral-900 text-xs flex-1">
                            {ach.title}
                          </strong>
                          {ach.date && (
                            <span className="shrink-0 whitespace-nowrap text-right text-xs text-neutral-600 font-mono-num">
                              {ach.date}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-800 text-xs m-0 leading-[1.45]">
                          {ach.description}
                        </p>
                        {ach.result && (
                          <p className="text-neutral-700 italic text-xs mt-0.5 m-0 leading-[1.45]">
                            Resultado: {ach.result}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Projects
            if (sectionKey === "projects" && projects.length > 0) {
              return (
                <section key="projects" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.projects)}
                  <ul className="list-none p-0 m-0 space-y-2">
                    {projects.map((proj) => (
                      <li
                        key={proj.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-4 mb-0.5">
                          <strong className="font-bold text-neutral-900 text-xs flex-1">
                            {proj.title}
                          </strong>
                          {proj.date && (
                            <span className="shrink-0 whitespace-nowrap text-right text-xs text-neutral-600 font-mono-num">
                              {proj.date}
                            </span>
                          )}
                        </div>
                        {proj.role && (
                          <div className="text-xs italic text-neutral-700 mt-0.5 mb-1 leading-[1.35]">
                            {proj.role}
                          </div>
                        )}
                        <p className="text-neutral-800 text-xs mt-0.5 m-0 leading-[1.45]">
                          {proj.description}
                        </p>
                        {proj.tools && (
                          <p className="text-neutral-600 text-xs mt-0.5 m-0 leading-[1.45]">
                            Herramientas: {proj.tools}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // References (single column semantic ul/li)
            if (sectionKey === "references" && references.length > 0) {
              return (
                <section key="references" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.references)}
                  <ul className="list-none p-0 m-0 space-y-1.5 text-xs">
                    {references.map((ref) => (
                      <li
                        key={ref.id}
                        className="print-item page-break-avoid border-l-2 border-neutral-300 pl-2 leading-[1.35]"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong className="font-bold text-neutral-900">{ref.name}</strong>
                        <span className="text-neutral-700">
                          {" — "}
                          {ref.position} ({ref.company})
                        </span>
                        {ref.contact && (
                          <span className="text-neutral-600 font-mono-num">{` · ${ref.contact}`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            // Custom Sections
            const customSec = customSections.find((cs) => cs.id === sectionKey);
            if (customSec) {
              return (
                <section key={customSec.id} style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles[customSec.id] || customSec.name)}
                  {customSec.description && (
                    <p className="text-xs text-neutral-600 mb-1.5 italic leading-[1.35]">
                      {customSec.description}
                    </p>
                  )}
                  {customSec.items && customSec.items.length > 0 && (
                    <ul className="list-none p-0 m-0 space-y-1.5">
                      {customSec.items.map((item) => (
                        <li
                          key={item.id}
                          className="print-item page-break-avoid"
                          style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                        >
                          <div className="flex justify-between items-start gap-3 font-bold text-neutral-900">
                            <span className="flex-1 leading-[1.35] mb-1">{item.title}</span>
                            {item.date && (
                              <span className="shrink-0 text-right whitespace-nowrap text-xs text-neutral-600 font-mono-num font-normal leading-[1.35]">
                                {item.date}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs italic text-neutral-700 mt-0.5 mb-1 leading-[1.35]">
                              {item.subtitle}
                            </div>
                          )}
                          {item.description && (
                            <p className="text-neutral-800 text-xs mt-0.5 m-0 leading-[1.35]">
                              {item.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
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
