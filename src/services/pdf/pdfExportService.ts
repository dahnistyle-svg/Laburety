export interface PDFExportOptions {
  filename?: string;
  scale?: number;
}

/**
 * Sanitizes a string to be safely used as a filename across Windows, macOS, and Linux.
 */
export function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 100);

  if (!cleaned) {
    return "CV_Profesional.pdf";
  }

  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

/**
 * Exports the A4 document as real, selectable, ATS-friendly text using native print.
 */
export async function exportElementToPDF(
  _element?: HTMLElement | null,
  _options?: PDFExportOptions
): Promise<boolean> {
  window.print();
  return true;
}

