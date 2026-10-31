import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  WidthType,
  VerticalAlign,
} from "docx";
import { Resume, MasterLibrary, Course } from "../../types/index";
import { resolveResumeData, ResolvedResumeData } from "../../components/templates/templateUtils";

/**
 * Safely fetches an image and converts it to a Uint8Array suitable for docx ImageRun.
 * Supports Base64 data URLs, raw base64, and standard http(s) URLs.
 */
async function fetchImageBuffer(urlOrBase64: string): Promise<Uint8Array | null> {
  if (!urlOrBase64 || typeof urlOrBase64 !== "string") return null;

  try {
    const trimmed = urlOrBase64.trim();
    if (!trimmed) return null;

    // 1. Data URL (e.g. data:image/png;base64,iVBORw...)
    if (trimmed.startsWith("data:")) {
      const commaIdx = trimmed.indexOf(",");
      if (commaIdx !== -1) {
        const base64Data = trimmed.slice(commaIdx + 1);
        if (typeof window !== "undefined" && typeof window.atob === "function") {
          const binaryString = window.atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        } else if (typeof Buffer !== "undefined") {
          return new Uint8Array(Buffer.from(base64Data, "base64"));
        }
      }
    }

    // 2. Direct Base64 string without data: prefix
    if (
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://") &&
      !trimmed.startsWith("/") &&
      !trimmed.startsWith("blob:")
    ) {
      if (/^[A-Za-z0-9+/=]+$/.test(trimmed.slice(0, 100))) {
        if (typeof window !== "undefined" && typeof window.atob === "function") {
          const binaryString = window.atob(trimmed);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        } else if (typeof Buffer !== "undefined") {
          return new Uint8Array(Buffer.from(trimmed, "base64"));
        }
      }
    }

    // 3. Web URL / Blob URL
    const response = await fetch(trimmed, { mode: "cors" });
    if (!response.ok) {
      console.warn("No se pudo obtener la imagen:", response.status);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.warn("Aviso al procesar foto para documento Word:", err);
    return null;
  }
}

/**
 * Detects image MIME/type for docx ImageRun from binary magic bytes or URL string.
 */
function detectImageType(data: Uint8Array, urlOrBase64?: string): "png" | "jpg" | "gif" | "bmp" {
  if (data && data.length >= 4) {
    if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) return "png";
    if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpg";
    if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) return "gif";
    if (data[0] === 0x42 && data[1] === 0x4d) return "bmp";
  }

  if (urlOrBase64) {
    const lower = urlOrBase64.toLowerCase();
    if (
      lower.includes("image/jpeg") ||
      lower.includes("image/jpg") ||
      lower.includes(".jpg") ||
      lower.includes(".jpeg")
    ) {
      return "jpg";
    }
    if (lower.includes("image/gif") || lower.includes(".gif")) return "gif";
    if (lower.includes("image/bmp") || lower.includes(".bmp")) return "bmp";
  }

  return "png";
}

/**
 * Sanitizes a string to be safely used as a filename across Windows, macOS, and Linux.
 */
export function sanitizeDocxFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 100);

  if (!cleaned) {
    return "CV_Profesional.docx";
  }

  return cleaned.toLowerCase().endsWith(".docx") ? cleaned : `${cleaned}.docx`;
}

/**
 * Creates a standard ATS-friendly Section Header with bottom border.
 */
function createSectionHeader(title: string, colorHex: string = "0F2F26"): Paragraph {
  const cleanColor = colorHex.replace("#", "");
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    border: {
      bottom: {
        color: cleanColor,
        space: 3,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 23, // ~11.5pt
        color: cleanColor,
        font: "Calibri",
      }),
    ],
  });
}

/**
 * Exports a resume into a clean, editable, native Word (.docx) document
 * optimized for human readers and automated Applicant Tracking Systems (ATS).
 */
export async function exportToWord(
  resume: Resume,
  library: MasterLibrary,
  customFilename?: string
): Promise<boolean> {
  const resolved: ResolvedResumeData = resolveResumeData(resume, library);

  const firstName = resolved.personal.firstName?.trim() || "";
  const lastName = resolved.personal.lastName?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim() || resolved.personal.professionalName || "Curriculum Vitae";
  const professionalTitle = resolved.personal.professionalTitle || "";

  const primaryColor = (resume.visualSettings?.primaryColor || "#0F2F26").replace("#", "");

  // Build ATS-friendly Contact Line
  const contactParts: string[] = [];
  if (resolved.contact.phone?.trim()) contactParts.push(resolved.contact.phone.trim());
  if (resolved.contact.email?.trim()) contactParts.push(resolved.contact.email.trim());
  if (resolved.personal.location?.trim() || resolved.personal.country?.trim()) {
    const loc = [resolved.personal.location?.trim(), resolved.personal.country?.trim()]
      .filter(Boolean)
      .join(", ");
    if (loc) contactParts.push(loc);
  }
  if (resolved.contact.linkedin?.trim()) contactParts.push(resolved.contact.linkedin.trim());
  if (resolved.contact.portfolio?.trim()) contactParts.push(resolved.contact.portfolio.trim());
  if (resolved.contact.website?.trim()) contactParts.push(resolved.contact.website.trim());

  if (Array.isArray(resolved.contact.customLinks)) {
    resolved.contact.customLinks.forEach((link) => {
      if (link.url?.trim()) {
        contactParts.push(`${link.label ? link.label + ": " : ""}${link.url.trim()}`);
      }
    });
  }

  // Check profile photo in resume or library
  const photoUrl =
    resolved.personal.photoUrl?.trim() ||
    library.personal?.photoUrl?.trim() ||
    (resume as any)?.profilePhoto?.trim() ||
    (resume as any)?.photoUrl?.trim() ||
    "";

  const showPhoto = Boolean(photoUrl && (resume.visualSettings?.showPhoto !== false));

  let imageBuffer: Uint8Array | null = null;
  if (showPhoto) {
    imageBuffer = await fetchImageBuffer(photoUrl);
  }

  const documentChildren: (Paragraph | Table)[] = [];

  // ==========================================
  // 1. Header (Name, Title, Contact Info & Photo)
  // ==========================================
  if (imageBuffer) {
    const photoPosition = resume.visualSettings?.photoPosition || "right";
    const photoSizeKey = resume.visualSettings?.photoSize || "lg";
    const dimension =
      photoSizeKey === "sm" ? 85 : photoSizeKey === "md" ? 100 : photoSizeKey === "xl" ? 125 : 105;

    const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

    const photoCell = new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      width: { size: 24, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
      },
      children: [
        new Paragraph({
          alignment: photoPosition === "left" ? AlignmentType.LEFT : AlignmentType.RIGHT,
          spacing: { before: 0, after: 0 },
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: { width: dimension, height: dimension },
              type: detectImageType(imageBuffer, photoUrl),
            }),
          ],
        }),
      ],
    });

    const textParagraphs: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: fullName,
            bold: true,
            size: 32, // 16pt
            color: primaryColor,
            font: "Calibri",
          }),
        ],
      }),
    ];

    if (professionalTitle) {
      textParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: professionalTitle,
              bold: true,
              size: 22, // 11pt
              color: "374151",
              font: "Calibri",
            }),
          ],
        })
      );
    }

    if (contactParts.length > 0) {
      textParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({
              text: contactParts.join("  |  "),
              size: 19, // 9.5pt
              color: "4B5563",
              font: "Calibri",
            }),
          ],
        })
      );
    }

    const textCell = new TableCell({
      verticalAlign: VerticalAlign.CENTER,
      width: { size: 76, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
      },
      children: textParagraphs,
    });

    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: photoPosition === "left" ? [photoCell, textCell] : [textCell, photoCell],
        }),
      ],
    });

    documentChildren.push(headerTable);
  } else {
    // Standard Centered Header when no photo is used
    documentChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: fullName,
            bold: true,
            size: 34, // 17pt
            color: primaryColor,
            font: "Calibri",
          }),
        ],
      })
    );

    if (professionalTitle) {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: professionalTitle,
              bold: true,
              size: 23, // 11.5pt
              color: "374151",
              font: "Calibri",
            }),
          ],
        })
      );
    }

    if (contactParts.length > 0) {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 180 },
          children: [
            new TextRun({
              text: contactParts.join("  |  "),
              size: 19, // 9.5pt
              color: "4B5563",
              font: "Calibri",
            }),
          ],
        })
      );
    }
  }

  // ==========================================
  // 2. Sections based on visibleSectionOrder
  // ==========================================
  for (const sectionKey of resolved.visibleSectionOrder) {
    // --- ABOUT / PROFILE ---
    if (sectionKey === "about") {
      if (!resolved.about.content?.trim()) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.about || "Perfil Profesional", primaryColor)
      );
      documentChildren.push(
        new Paragraph({
          spacing: { before: 60, after: 120 },
          children: [
            new TextRun({
              text: resolved.about.content.trim(),
              size: 21, // 10.5pt
              font: "Calibri",
              color: "1F2937",
            }),
          ],
        })
      );
      continue;
    }

    // --- EXPERIENCE ---
    if (sectionKey === "experience") {
      if (!resolved.experiences || resolved.experiences.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.experience || "Experiencia Laboral", primaryColor)
      );

      resolved.experiences.forEach((exp) => {
        const dates = [
          exp.startDate,
          exp.isCurrent ? "Presente" : exp.endDate || "",
        ]
          .filter(Boolean)
          .join(" – ");

        // Line 1: Role & Dates
        documentChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 30 },
            children: [
              new TextRun({
                text: exp.role || "Puesto",
                bold: true,
                size: 22,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: dates ? `  (${dates})` : "",
                italics: true,
                size: 19,
                color: "4B5563",
                font: "Calibri",
              }),
            ],
          })
        );

        // Line 2: Company & Location
        const companyLoc = [exp.company, exp.location].filter(Boolean).join(" · ");
        if (companyLoc) {
          documentChildren.push(
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [
                new TextRun({
                  text: companyLoc,
                  italics: true,
                  size: 20,
                  color: "374151",
                  font: "Calibri",
                }),
              ],
            })
          );
        }

        // Line 3: Description if present
        if (exp.description?.trim()) {
          documentChildren.push(
            new Paragraph({
              spacing: { before: 20, after: 60 },
              children: [
                new TextRun({
                  text: exp.description.trim(),
                  size: 20,
                  font: "Calibri",
                  color: "1F2937",
                }),
              ],
            })
          );
        }

        // Responsibilities as bullet points
        if (Array.isArray(exp.responsibilities)) {
          exp.responsibilities.forEach((resp) => {
            if (resp && resp.trim()) {
              documentChildren.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: resp.trim(),
                      size: 20,
                      font: "Calibri",
                      color: "1F2937",
                    }),
                  ],
                })
              );
            }
          });
        }

        // Achievements as bullet points
        if (Array.isArray(exp.achievements)) {
          exp.achievements.forEach((ach) => {
            if (ach && ach.trim()) {
              documentChildren.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: `Logro: ${ach.trim()}`,
                      bold: true,
                      size: 20,
                      font: "Calibri",
                      color: "1F2937",
                    }),
                  ],
                })
              );
            }
          });
        }
      });
      continue;
    }

    // --- EDUCATION ---
    if (sectionKey === "education") {
      if (!resolved.education || resolved.education.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.education || "Formación Académica", primaryColor)
      );

      resolved.education.forEach((edu) => {
        const titleDegree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" en ");
        const dates = [edu.startDate, edu.endDate || (edu.status === "En curso" ? "En curso" : "")]
          .filter(Boolean)
          .join(" – ");

        documentChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: [
              new TextRun({
                text: titleDegree || "Título Académico",
                bold: true,
                size: 22,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: dates ? `  (${dates})` : "",
                italics: true,
                size: 19,
                color: "4B5563",
                font: "Calibri",
              }),
            ],
          })
        );

        const subInfo = [edu.institution, edu.status ? `Estado: ${edu.status}` : ""]
          .filter(Boolean)
          .join(" · ");
        if (subInfo) {
          documentChildren.push(
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [
                new TextRun({
                  text: subInfo,
                  italics: true,
                  size: 20,
                  color: "374151",
                  font: "Calibri",
                }),
              ],
            })
          );
        }

        if (edu.description?.trim()) {
          documentChildren.push(
            new Paragraph({
              spacing: { before: 20, after: 60 },
              children: [
                new TextRun({
                  text: edu.description.trim(),
                  size: 20,
                  font: "Calibri",
                  color: "1F2937",
                }),
              ],
            })
          );
        }
      });
      continue;
    }

    // --- COURSES ---
    if (sectionKey === "courses") {
      if (!resolved.courses || resolved.courses.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.courses || "Cursos y Capacitaciones", primaryColor)
      );

      const showCourseDates =
        resume.showCourseDates ?? resume.visualSettings?.showCourseDates ?? true;
      const includeInstitution = resume.coursesInlineIncludeInstitution !== false;
      const currentCoursesFormat = resume.coursesFormat || "detailed";

      // Si el estado es "2 Columnas" ("compact-grid" / "columns"), genera la Tabla invisible de 2 columnas.
      // Si el estado es "Detallado" ("detailed") o "Continuo" ("compact-inline"), genera la lista simple de 1 columna.
      const isTwoColumnCourses =
        currentCoursesFormat === "compact-grid" ||
        (currentCoursesFormat as string) === "columns";

      if (isTwoColumnCourses) {
        // MAQUETACIÓN CON TABLA INVISIBLE (BORDERLESS) EN 2 COLUMNAS
        const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
        const courseRows: TableRow[] = [];

        // Divide array into pairs (chunks of 2)
        for (let i = 0; i < resolved.courses.length; i += 2) {
          const c1 = resolved.courses[i];
          const c2 = resolved.courses[i + 1];

          const buildCourseCell = (course?: Course): TableCell => {
            if (!course) {
              return new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: noBorder,
                  bottom: noBorder,
                  left: noBorder,
                  right: noBorder,
                },
                children: [new Paragraph({ children: [] })],
              });
            }

            const yearOrDate =
              showCourseDates && course.date ? course.date.split("-")[0] || course.date : "";
            const metaParts = [
              includeInstitution ? course.institution : "",
              includeInstitution ? course.duration : "",
              yearOrDate,
            ].filter(Boolean);
            const metaText = metaParts.length > 0 ? ` (${metaParts.join(", ")})` : "";

            const runs: TextRun[] = [
              new TextRun({
                text: `• ${course.name}`,
                bold: true,
                size: 19, // ~9.5pt
                color: "111827",
                font: "Calibri",
              }),
            ];

            if (metaText) {
              runs.push(
                new TextRun({
                  text: metaText,
                  italics: true,
                  size: 18, // ~9pt
                  color: "4B5563",
                  font: "Calibri",
                })
              );
            }

            const cellParagraphs: Paragraph[] = [
              new Paragraph({
                spacing: { before: 25, after: 25 },
                children: runs,
              }),
            ];

            if (course.description?.trim()) {
              cellParagraphs.push(
                new Paragraph({
                  spacing: { before: 0, after: 25 },
                  indent: { left: 240 },
                  children: [
                    new TextRun({
                      text: course.description.trim(),
                      size: 17,
                      color: "4B5563",
                      font: "Calibri",
                    }),
                  ],
                })
              );
            }

            return new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: noBorder,
                bottom: noBorder,
                left: noBorder,
                right: noBorder,
              },
              children: cellParagraphs,
            });
          };

          courseRows.push(
            new TableRow({
              children: [buildCourseCell(c1), buildCourseCell(c2)],
            })
          );
        }

        const coursesTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: noBorder,
            bottom: noBorder,
            left: noBorder,
            right: noBorder,
            insideHorizontal: noBorder,
            insideVertical: noBorder,
          },
          rows: courseRows,
        });

        documentChildren.push(coursesTable);
      } else {
        // FALLBACK PARA 1 COLUMNA (Detallado o Continuo: Lista simple de 1 columna)
        resolved.courses.forEach((course) => {
          const details = [
            includeInstitution ? course.institution : "",
            showCourseDates ? course.date : "",
            includeInstitution ? course.duration : "",
          ]
            .filter(Boolean)
            .join(" · ");

          documentChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: course.name,
                  bold: true,
                  size: 20,
                  color: "111827",
                  font: "Calibri",
                }),
                new TextRun({
                  text: details ? ` — ${details}` : "",
                  size: 19,
                  color: "4B5563",
                  font: "Calibri",
                }),
              ],
            })
          );

          if (course.description?.trim()) {
            documentChildren.push(
              new Paragraph({
                spacing: { before: 0, after: 40 },
                indent: { left: 400 },
                children: [
                  new TextRun({
                    text: course.description.trim(),
                    size: 18,
                    font: "Calibri",
                    color: "4B5563",
                  }),
                ],
              })
            );
          }
        });
      }
      continue;
    }

    // --- CERTIFICATIONS ---
    if (sectionKey === "certifications") {
      if (!resolved.certifications || resolved.certifications.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.certifications || "Certificaciones", primaryColor)
      );

      resolved.certifications.forEach((cert) => {
        const details = [cert.institution, cert.issueDate ? `Emisión: ${cert.issueDate}` : ""]
          .filter(Boolean)
          .join(" · ");

        documentChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
                size: 20,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: details ? ` — ${details}` : "",
                size: 19,
                color: "4B5563",
                font: "Calibri",
              }),
            ],
          })
        );
      });
      continue;
    }

    // --- SKILLS ---
    if (sectionKey === "skills") {
      if (!resolved.skills || resolved.skills.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.skills || "Competencias y Habilidades", primaryColor)
      );

      const showSkillLevels =
        resume.showSkillLevels ?? resume.visualSettings?.showSkillLevels ?? true;

      const skillNames = resolved.skills
        .map((s) => {
          const name = s.name.trim();
          if (!name) return "";
          const level = showSkillLevels && s.level?.trim() ? ` (${s.level.trim()})` : "";
          return `${name}${level}`;
        })
        .filter(Boolean);
      documentChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [
            new TextRun({
              text: skillNames.join("  •  "),
              size: 20,
              font: "Calibri",
              color: "1F2937",
            }),
          ],
        })
      );
      continue;
    }

    // --- TOOLS ---
    if (sectionKey === "tools") {
      if (!resolved.tools || resolved.tools.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.tools || "Herramientas y Software", primaryColor)
      );

      const toolNames = resolved.tools.map((t) => t.name.trim()).filter(Boolean);
      documentChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 80 },
          children: [
            new TextRun({
              text: toolNames.join("  •  "),
              size: 20,
              font: "Calibri",
              color: "1F2937",
            }),
          ],
        })
      );
      continue;
    }

    // --- LANGUAGES ---
    if (sectionKey === "languages") {
      if (!resolved.languages || resolved.languages.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.languages || "Idiomas", primaryColor)
      );

      resolved.languages.forEach((lang) => {
        const extra = lang.certification ? ` (${lang.certification})` : "";
        documentChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: lang.language,
                bold: true,
                size: 20,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: `: ${lang.proficiency}${extra}`,
                size: 20,
                color: "374151",
                font: "Calibri",
              }),
            ],
          })
        );
      });
      continue;
    }

    // --- ACHIEVEMENTS ---
    if (sectionKey === "achievements") {
      if (!resolved.achievements || resolved.achievements.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.achievements || "Logros Destacados", primaryColor)
      );

      resolved.achievements.forEach((ach) => {
        documentChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: ach.title,
                bold: true,
                size: 20,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: ach.description ? `: ${ach.description}` : "",
                size: 20,
                color: "1F2937",
                font: "Calibri",
              }),
            ],
          })
        );
      });
      continue;
    }

    // --- PROJECTS ---
    if (sectionKey === "projects") {
      if (!resolved.projects || resolved.projects.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.projects || "Proyectos", primaryColor)
      );

      resolved.projects.forEach((proj) => {
        const header = [proj.title, proj.role, proj.date].filter(Boolean).join(" · ");
        documentChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({
                text: header,
                bold: true,
                size: 21,
                color: "111827",
                font: "Calibri",
              }),
            ],
          })
        );
        if (proj.description?.trim()) {
          documentChildren.push(
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [
                new TextRun({
                  text: proj.description.trim(),
                  size: 20,
                  font: "Calibri",
                  color: "1F2937",
                }),
              ],
            })
          );
        }
      });
      continue;
    }

    // --- REFERENCES ---
    if (sectionKey === "references") {
      if (!resolved.references || resolved.references.length === 0) continue;
      documentChildren.push(
        createSectionHeader(resolved.sectionTitles.references || "Referencias", primaryColor)
      );

      resolved.references.forEach((ref) => {
        const details = [ref.position, ref.company, ref.contact].filter(Boolean).join(" · ");
        documentChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: ref.name,
                bold: true,
                size: 20,
                color: "111827",
                font: "Calibri",
              }),
              new TextRun({
                text: details ? ` — ${details}` : "",
                size: 19,
                color: "4B5563",
                font: "Calibri",
              }),
            ],
          })
        );
      });
      continue;
    }

    // --- CUSTOM SECTIONS ---
    const customSec = resolved.customSections?.find((cs) => cs.id === sectionKey);
    if (customSec) {
      const title = resolved.sectionTitles[customSec.id] || customSec.name;
      documentChildren.push(createSectionHeader(title, primaryColor));

      if (customSec.contentType === "text" && customSec.textContent?.trim()) {
        documentChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 80 },
            children: [
              new TextRun({
                text: customSec.textContent.trim(),
                size: 20,
                font: "Calibri",
                color: "1F2937",
              }),
            ],
          })
        );
      } else if (Array.isArray(customSec.items) && customSec.items.length > 0) {
        customSec.items.forEach((item) => {
          const subInfo = [item.subtitle, item.date].filter(Boolean).join(" · ");
          documentChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: item.title,
                  bold: true,
                  size: 20,
                  color: "111827",
                  font: "Calibri",
                }),
                new TextRun({
                  text: subInfo ? ` (${subInfo})` : "",
                  italics: true,
                  size: 19,
                  color: "4B5563",
                  font: "Calibri",
                }),
                new TextRun({
                  text: item.description ? ` — ${item.description}` : "",
                  size: 19,
                  color: "1F2937",
                  font: "Calibri",
                }),
              ],
            })
          );
        });
      }
      continue;
    }
  }

  // Build Document
  const doc = new Document({
    creator: "Laburety ATS Resume Builder",
    title: `${fullName} - ${professionalTitle || "Curriculum Vitae"}`,
    description: `Curriculum Vitae de ${fullName} generado en formato Word editable (.docx) de alta compatibilidad ATS.`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 20mm
              right: 1134, // 20mm
              bottom: 1134, // 20mm
              left: 1134, // 20mm
            },
          },
        },
        children: documentChildren,
      },
    ],
  });

  // Calculate target filename: CV_[Nombre]_[Puesto].docx
  const cleanPerson = `${firstName}_${lastName}`.trim().replace(/\s+/g, "_") || "Profesional";
  const cleanTitle = (professionalTitle || resume.name || "Curriculum").trim().replace(/\s+/g, "_");
  const fallbackFilename = `CV_${cleanPerson}_${cleanTitle}`;
  const finalFilename = sanitizeDocxFilename(customFilename || fallbackFilename);

  // Generate Blob and trigger download in browser
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  return true;
}
