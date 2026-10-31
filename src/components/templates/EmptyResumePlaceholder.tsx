import React from "react";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";

interface EmptyResumePlaceholderProps {
  className?: string;
}

export const EmptyResumePlaceholder: React.FC<EmptyResumePlaceholderProps> = ({
  className = "",
}) => {
  return (
    <div
      data-html2canvas-ignore="true"
      className={`no-print my-8 p-7 rounded-2xl border-2 border-dashed border-neutral-300/80 bg-neutral-50/70 text-center select-none ${className}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-[#E9F3EE] text-[#0D7A5F] flex items-center justify-center font-bold mb-3 shadow-2xs">
        <FileText className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h3 className="text-sm font-bold text-neutral-800 tracking-tight">
        Currículum en preparación
      </h3>

      <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5 leading-relaxed">
        Los datos de contacto y encabezado ya están listos. Ve marcando con el tilde tus experiencias, formación, cursos o habilidades en el panel izquierdo para incorporarlos a esta hoja.
      </p>

      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-400">
        <span className="flex items-center gap-1 font-medium text-neutral-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7A5F]" /> Selección modular
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 font-medium text-neutral-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Paginación A4 automática
        </span>
      </div>
    </div>
  );
};
