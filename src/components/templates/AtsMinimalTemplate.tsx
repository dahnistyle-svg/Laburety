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

export const AtsMinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
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
        className="text-black hover:underline"
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
        className="text-black hover:underline"
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
        className="text-black hover:underline"
      >
        {cleanPortfolio}
      </a>
    );
  }

  const showPhoto = Boolean(resume?.visualSettings?.showPhoto && personal.photoUrl);
  const photoPosition = resume?.visualSettings?.photoPosition || "right";
  const photoShape = resume?.visualSettings?.photoShape || "circle";
  const photoRadius = photoShape === "rounded" ? "8px" : "50%";
  const photoSizeKey = resume?.visualSettings?.photoSize || "lg";
  const photoDimension =
    photoSizeKey === "sm" ? 90 : photoSizeKey === "md" ? 110 : photoSizeKey === "xl" ? 145 : 125;

  const spacingConfig = getSpacingConfig(resume?.visualSettings?.spacing);

  const renderSectionHeader = (title: string) => (
    <h2
      className="section-heading font-bold uppercase text-xs border-b border-black pb-0.5 mb-1.5"
      style={{
        breakAfter: "avoid",
        pageBreakAfter: "avoid",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      {title.toUpperCase()}
    </h2>
  );

  return (
    <div
      className={`w-full bg-white text-black font-sans-pro text-[12px] ${spacingConfig.leading}`}
    >
      {/* Header */}
      {showPhoto ? (
        <header
          className="pt-1.5 pb-2 mb-3 border-b border-black"
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
              border: "1px solid #000000",
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
            <h1 className="text-xl font-bold tracking-normal uppercase leading-tight">
              {personal.firstName} {personal.lastName}
            </h1>
            {personal.professionalTitle && (
              <p className="text-xs font-semibold uppercase tracking-wide mt-1 leading-normal">
                {personal.professionalTitle}
              </p>
            )}
            <div
              className="text-[11px] mt-1"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: "6px",
                rowGap: "4px",
                maxWidth: "100%",
                boxSizing: "border-box",
                lineHeight: 1.35,
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
                      className="text-neutral-500 select-none font-bold"
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
          className="text-center pt-1.5 pb-2 mb-3 border-b border-black"
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <h1 className="text-xl font-bold tracking-normal uppercase leading-tight">
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.professionalTitle && (
            <p className="text-xs font-semibold uppercase tracking-wide mt-1 leading-normal">
              {personal.professionalTitle}
            </p>
          )}
          <div
            className="text-[11px] mt-1 text-center"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "6px",
              rowGap: "4px",
              maxWidth: "100%",
              boxSizing: "border-box",
              lineHeight: 1.35,
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
                    className="text-neutral-500 select-none font-bold"
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
        /* Sections */
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
                    className="text-xs text-black print-item page-break-avoid m-0"
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
                  <ul className="list-none p-0 m-0 space-y-2.5">
                    {experiences.map((exp) => (
                      <li
                        key={exp.id}
                        className="experience-item print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3 font-bold text-xs">
                          <span className="flex-1 leading-[1.35] mb-1">
                            {exp.role.toUpperCase()}
                          </span>
                          <span className="font-normal text-[11px] shrink-0 text-right whitespace-nowrap leading-[1.35]">
                            {exp.startDate} - {exp.isCurrent ? "PRESENTE" : exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-start text-[11px] mt-0.5 mb-1 leading-[1.35]">
                          <span className="font-semibold flex-1">{exp.company}</span>
                          {exp.location && (
                            <span className="shrink-0 text-right whitespace-nowrap ml-2">
                              {exp.location}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-xs mb-1 leading-[1.35]">{exp.description}</p>
                        )}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="list-disc pl-5 space-y-0.5 text-xs leading-[1.35]">
                            {exp.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="list-disc pl-5 space-y-0.5 text-xs mt-1 leading-[1.35]">
                            {exp.achievements.map((a, i) => (
                              <li key={i}>
                                <strong>Logro:</strong> {a}
                              </li>
                            ))}
                          </ul>
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
                  <ul className="list-none p-0 m-0 space-y-1.5">
                    {education.map((edu) => (
                      <li
                        key={edu.id}
                        className="education-item print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <div className="flex justify-between items-start gap-3 font-bold text-xs">
                          <span className="flex-1 leading-[1.35] mb-1">
                            {edu.degree || edu.fieldOfStudy}
                          </span>
                          <span className="font-normal text-[11px] shrink-0 text-right whitespace-nowrap leading-[1.35]">
                            {edu.startDate} - {edu.endDate || edu.status}
                          </span>
                        </div>
                        <div className="text-[11px] mt-0.5 mb-1 leading-[1.35]">
                          {edu.institution} {edu.additionalInfo ? `· ${edu.additionalInfo}` : ""}{" "}
                          {edu.status ? `- ${edu.status}` : ""}
                        </div>
                        {edu.description && (
                          <p className="text-[11px] text-neutral-800 mt-0.5 leading-[1.35]">
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
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-1.5 gap-y-1 text-xs">
                    {skills.map((s, idx) => (
                      <li
                        key={s.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span>{s.name}</span>
                        {showSkillLevels && s.level && <span>{` (${s.level})`}</span>}
                        {idx < skills.length - 1 ? "," : ""}
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
                          <strong className="font-bold text-xs flex-1">{c.name}</strong>
                          <span className="shrink-0 whitespace-nowrap text-right text-xs font-mono-num">
                            {c.issueDate}
                          </span>
                        </div>
                        {(c.institution || c.credentialId) && (
                          <div className="text-xs italic text-neutral-700 leading-[1.4] mt-0.5">
                            {c.institution}
                            {c.credentialId ? ` [ID: ${c.credentialId}]` : ""}
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
                      titleClass: "text-xs font-bold text-black",
                      dateClass: "text-xs font-mono-num text-black",
                      subClass: "text-xs text-neutral-700 italic",
                      textClass: "text-xs text-black",
                    }}
                  />
                </section>
              );
            }

            if (sectionKey === "languages" && languages.length > 0) {
              return (
                <section key="languages" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.languages)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-[1.4]">
                    {languages.map((l, idx) => (
                      <li
                        key={l.id}
                        className="inline-flex items-baseline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span>
                          <strong className="font-bold">{`${l.language}: `}</strong>
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

            if (sectionKey === "tools" && tools.length > 0) {
              return (
                <section key="tools" style={sectionContainerStyle}>
                  {renderSectionHeader(sectionTitles.tools)}
                  <ul className="list-none p-0 m-0 flex flex-wrap gap-x-1.5 gap-y-1 text-xs">
                    {tools.map((t, idx) => (
                      <li
                        key={t.id}
                        className="inline print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <span>{t.name}</span>
                        {idx < tools.length - 1 ? "," : ""}
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
                  <ul className="list-none p-0 m-0 space-y-1.5">
                    {achievements.map((a) => (
                      <li
                        key={a.id}
                        className="print-item page-break-avoid text-xs leading-[1.45]"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong className="font-bold">{a.title}: </strong>
                        <span>{a.description}</span>
                        {a.result ? ` (${a.result})` : ""}
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
                          <strong className="font-bold text-xs flex-1">{p.title}</strong>
                          {p.date && (
                            <span className="shrink-0 whitespace-nowrap text-right text-xs font-mono-num font-normal">
                              {p.date}
                            </span>
                          )}
                        </div>
                        <p className="text-xs m-0 leading-[1.45]">{p.description}</p>
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
                  <ul className="list-none p-0 m-0 space-y-1 text-xs">
                    {references.map((r) => (
                      <li
                        key={r.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong>{r.name}</strong> - {r.position} ({r.company}) | Contacto:{" "}
                        {r.contact}
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
                    <p className="text-xs text-neutral-600 mb-1 italic">{cs.description}</p>
                  )}
                  <ul className="list-none p-0 m-0 space-y-1 text-xs">
                    {cs.items.map((it) => (
                      <li
                        key={it.id}
                        className="print-item page-break-avoid"
                        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                      >
                        <strong>{it.title}</strong>
                        {it.date ? ` (${it.date})` : ""}
                        {it.subtitle ? ` - ${it.subtitle}` : ""}
                        {it.description ? `: ${it.description}` : ""}
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
