import React, { useState, useRef } from "react";
import { Resume, MasterLibrary, TemplateId } from "../../types";
import { PaginatedA4Document } from "./PaginatedA4Document";
import { exportToWord } from "../../services/docx/docxExportService";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Printer,
  Download,
  Layout,
  FileCheck,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ResumePreviewSheetProps {
  resume: Resume;
  library: MasterLibrary;
  onSelectTemplate?: (templateId: TemplateId) => void;
}

export const ResumePreviewSheet: React.FC<ResumePreviewSheetProps> = ({
  resume,
  library,
  onSelectTemplate,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isGeneratingWord, setIsGeneratingWord] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 50));
  const handleResetZoom = () => setZoom(100);

  const handleToggleFitToWidth = () => {
    if (!viewportRef.current) return;

    // 210mm at standard 96 DPI is approximately 794px
    const a4SheetWidthPx = 794;
    const padding = 64; // Horizontal padding in the viewport (p-4 to p-8)
    const availableWidth = viewportRef.current.clientWidth - padding;

    if (availableWidth <= 0) return;

    const calculatedZoom = Math.min(
      150,
      Math.max(50, Math.round((availableWidth / a4SheetWidthPx) * 100))
    );

    // If currently fitted to width, toggle back to 100%
    if (Math.abs(zoom - calculatedZoom) <= 2 && zoom !== 100) {
      setZoom(100);
    } else {
      setZoom(calculatedZoom);
    }
  };

  const handleDownloadWord = async () => {
    if (isGeneratingWord) return;

    setIsGeneratingWord(true);
    setErrorMessage(null);

    try {
      await exportToWord(resume, library);
    } catch (err) {
      console.error("Fallo al exportar Word (.docx):", err);
      setErrorMessage("No se pudo generar el archivo Word. Intentá nuevamente.");
    } finally {
      setIsGeneratingWord(false);
    }
  };

  const templatesList: { id: TemplateId; label: string }[] = [
    { id: "harvard", label: "Harvard Professional" },
    { id: "executive", label: "Executive Corporate" },
    { id: "ats", label: "ATS Minimal Clean" },
  ];

  return (
    <div className="flex-1 min-w-0 w-full flex flex-col h-full bg-neutral-100/80 rounded-xl border border-neutral-200 overflow-hidden shadow-inner print:bg-white print:border-0 print:shadow-none print:rounded-none print:overflow-visible">
      {/* Top Preview Controls Bar */}
      <div className="w-full flex-shrink-0 flex items-center justify-between flex-wrap gap-3 px-4 py-2.5 bg-white border-b border-neutral-200 no-print print:hidden">
        {/* Template Quick Switcher */}
        <div className="flex items-center gap-2 print:hidden">
          <Layout className="w-4 h-4 text-neutral-500" />
          <span className="text-xs font-semibold text-neutral-700">Plantilla:</span>
          {onSelectTemplate ? (
            <select
              value={resume.templateId}
              onChange={(e) => onSelectTemplate(e.target.value as TemplateId)}
              className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              {templatesList.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.label}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-medium text-neutral-800">
              {templatesList.find((t) => t.id === resume.templateId)?.label}
            </span>
          )}
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2 print:hidden">
          {/* Zoom controls */}
          <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg p-0.5 print:hidden">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 hover:bg-neutral-200 rounded text-neutral-600 disabled:opacity-40 transition-colors"
              title="Reducir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 text-xs font-mono-num font-medium text-neutral-700 hover:text-neutral-900"
              title="Restablecer tamaño al 100%"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 hover:bg-neutral-200 rounded text-neutral-600 disabled:opacity-40 transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fit to Width Button */}
          <button
            type="button"
            onClick={handleToggleFitToWidth}
            className={`p-1.5 rounded-md border transition-colors flex items-center justify-center print:hidden ${
              zoom !== 100
                ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs hover:bg-neutral-800"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border-neutral-200"
            }`}
            title={
              zoom === 100
                ? "Ajustar al ancho de pantalla"
                : "Restaurar zoom al 100%"
            }
          >
            {zoom !== 100 ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Print & PDF Export */}
          <div className="h-4 w-[1px] bg-neutral-200 mx-1 print:hidden" />

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors shadow-xs active:scale-95 cursor-pointer print:hidden"
            title="Imprimir CV en formato A4 limpio"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-700" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          {/* Descargar Word (.docx) */}
          <button
            type="button"
            onClick={handleDownloadWord}
            disabled={isGeneratingWord}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#185ABD] dark:text-blue-300 bg-blue-50/80 hover:bg-blue-100/90 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200/90 dark:border-blue-800/60 rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
            title="Descargar currículum en formato Word editable (.docx) para sistemas ATS"
          >
            {isGeneratingWord ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#185ABD]" />
                <span className="hidden sm:inline">Generando...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-[#185ABD] dark:text-blue-400" />
                <span>Descargar Word</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0B63F6] hover:bg-[#084ec7] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer print:hidden"
            title="Descargar archivo PDF real del CV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center justify-between no-print print:hidden animate-in slide-in-from-top-1">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* A4 Sheet Container Viewport */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto w-full flex justify-center items-start p-4 sm:p-8 bg-neutral-200/50 print:p-0 print:bg-white print:overflow-visible print:block"
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="flex justify-center shrink-0 min-w-fit print:block print:min-w-0"
        >
          <PaginatedA4Document
            resume={resume}
            library={library}
            containerRef={sheetRef}
          />
        </div>
      </div>

      {/* Bottom Advice Strip */}
      <div className="w-full flex-shrink-0 px-4 py-2 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2 no-print print:hidden">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>Hojas A4 individuales con paginación real para lectura humana y sistemas ATS.</span>
        </div>
        <span className="text-neutral-400 text-[11px]">
          Exporta en PDF con texto seleccionable o en Word (.docx) editable optimizado para ATS.
        </span>
      </div>
    </div>
  );
};
