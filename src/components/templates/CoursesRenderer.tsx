import React from "react";
import { Course, CoursesDisplayFormat } from "../../types";

interface CoursesRendererProps {
  courses: Course[];
  format?: CoursesDisplayFormat;
  includeInstitution?: boolean;
  showCourseDates?: boolean;
  alignment?: "justify" | "left";
  theme?: {
    titleClass?: string;
    dateClass?: string;
    subClass?: string;
    textClass?: string;
  };
}

export const CoursesRenderer: React.FC<CoursesRendererProps> = ({
  courses,
  format = "detailed",
  includeInstitution = true,
  showCourseDates = true,
  alignment = "justify",
  theme,
}) => {
  if (!courses || courses.length === 0) return null;

  const normalizedFormat =
    format === "compact-grid" || (format as string) === "columns"
      ? "compact-grid"
      : format === "compact-inline" || (format as string) === "inline"
      ? "compact-inline"
      : "detailed";

  // MODO 1: GRILLA DE 2 COLUMNAS ("2 Columnas")
  if (normalizedFormat === "compact-grid") {
    return (
      <ul
        className="courses-grid grid grid-cols-2 gap-x-6 gap-y-1.5 list-none p-0 m-0"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          columnGap: "24px",
          rowGap: "6px",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {courses.map((course, idx) => {
          const hasInstitution = Boolean(includeInstitution && course.institution);
          const hasDuration = Boolean(includeInstitution && course.duration);
          const hasDate = Boolean(showCourseDates && course.date);
          const shortDate = hasDate ? course.date.split("-")[0] || course.date : "";

          return (
            <li
              key={course.id || `course-grid-${idx}`}
              className={`course-item print-item page-break-avoid flex items-baseline justify-between gap-2 min-w-0 leading-[1.35] ${
                theme?.textClass || "text-xs text-neutral-900"
              }`}
              style={{
                breakInside: "avoid",
                pageBreakInside: "avoid",
                boxSizing: "border-box",
              }}
            >
              <div className="min-w-0 flex-1">
                <span className="mr-1 select-none">•</span>
                <strong className={theme?.titleClass || "font-bold text-neutral-900"}>
                  {course.name}
                </strong>
                {(hasInstitution || hasDuration) && (
                  <span className={theme?.subClass || "text-xs text-neutral-700 italic"}>
                    {" ("}
                    {hasInstitution ? course.institution : ""}
                    {hasDuration ? `${hasInstitution ? ", " : ""}${course.duration}` : ""}
                    {")"}
                  </span>
                )}
              </div>
              {shortDate && (
                <span
                  className={`shrink-0 whitespace-nowrap text-right ${
                    theme?.dateClass || "text-xs text-neutral-600 font-mono-num"
                  }`}
                >
                  {shortDate}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  // MODO 2: PÁRRAFO CONTINUO ("Continuo")
  if (normalizedFormat === "compact-inline") {
    return (
      <p
        className={`courses-inline print-item page-break-avoid m-0 leading-[1.5] ${
          theme?.textClass || "text-xs text-neutral-900"
        }`}
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          textAlign: alignment === "justify" ? "justify" : "left",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        {courses.map((course, idx) => {
          const hasInstitution = Boolean(includeInstitution && course.institution);
          const hasDuration = Boolean(includeInstitution && course.duration);
          const hasDate = Boolean(showCourseDates && course.date);
          const shortDate = hasDate ? course.date.split("-")[0] || course.date : "";

          const metaParts = [
            hasInstitution ? course.institution : "",
            hasDuration ? course.duration : "",
            shortDate,
          ].filter(Boolean);

          return (
            <React.Fragment key={course.id || `course-inline-${idx}`}>
              <span className="course-item">
                <strong className={theme?.titleClass || "font-bold text-neutral-900"}>
                  {course.name}
                </strong>
                {metaParts.length > 0 && (
                  <span className={theme?.subClass || "text-xs text-neutral-700 italic"}>
                    {` (${metaParts.join(", ")})`}
                  </span>
                )}
              </span>
              {idx < courses.length - 1 && (
                <span className="mx-1.5 text-neutral-400 select-none">•</span>
              )}
            </React.Fragment>
          );
        })}
      </p>
    );
  }

  // MODO 3: LISTA DETALLADA DE 1 COLUMNA ("Detallado" - por defecto)
  return (
    <ul
      className="list-none p-0 m-0 space-y-1.5"
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {courses.map((course, idx) => {
        const hasInstitution = Boolean(includeInstitution && course.institution);
        const hasDuration = Boolean(includeInstitution && course.duration);
        const hasDate = Boolean(showCourseDates && course.date);

        return (
          <li
            key={course.id || `course-${idx}`}
            className={`course-item print-item page-break-avoid leading-[1.4] ${
              theme?.textClass || "text-xs text-neutral-900"
            }`}
            style={{
              breakInside: "avoid",
              pageBreakInside: "avoid",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div className="flex justify-between items-baseline gap-3">
              <div className="flex-1 min-w-0">
                <strong className={theme?.titleClass || "font-bold text-neutral-900"}>
                  {course.name}
                </strong>
                {(hasInstitution || hasDuration) && (
                  <span className={theme?.subClass || "text-xs text-neutral-700 italic"}>
                    {" — "}
                    {hasInstitution ? course.institution : ""}
                    {hasDuration ? `${hasInstitution ? " " : ""}(${course.duration})` : ""}
                  </span>
                )}
              </div>
              {hasDate && (
                <span
                  className={`shrink-0 whitespace-nowrap text-right ${
                    theme?.dateClass || "text-xs text-neutral-600 font-mono-num"
                  }`}
                >
                  {course.date}
                </span>
              )}
            </div>
            {course.description && (
              <p className="text-xs text-neutral-600 mt-0.5 mb-0 leading-[1.35]">
                {course.description}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};
