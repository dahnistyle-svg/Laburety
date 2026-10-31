import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { TemplateId } from "../../types";
import { X, Check, FileText } from "lucide-react";

interface NewResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewResumeModal: React.FC<NewResumeModalProps> = ({ isOpen, onClose }) => {
  const { createResume, openEditorForResume } = useApp();

  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("harvard");
  const [initialSelectionMode, setInitialSelectionMode] = useState<"empty" | "all">("empty");

  if (!isOpen) return null;

  const templates: {
    id: TemplateId;
    title: string;
    style: string;
    description: string;
    tags: string[];
  }[] = [
    {
      id: "harvard",
      title: "Harvard Professional",
      style: "Académico · Sobrio · 1 Columna",
      description: "Diseño clásico universitario, alta legibilidad y parsing perfecto para sistemas ATS.",
      tags: ["Una columna", "ATS Friendly", "Serif clásico"],
    },
    {
      id: "executive",
      title: "Executive Corporate",
      style: "Ejecutivo · Distinguido",
      description: "Líneas de acento corporativas, tipografía clara y estructuración directiva de impacto.",
      tags: ["Barra de acento", "Corporativo", "Directivo"],
    },
    {
      id: "ats",
      title: "ATS Minimal Clean",
      style: "Minimalista · 100% Texto",
      description: "Estructura estricta sin gráficos ornamentales, optimizada para escáneres automáticos de selección.",
      tags: ["Puro texto", "Máximo ATS", "Sin bordes"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCv = createResume({
      name: name.trim(),
      objective: objective.trim(),
      description: description.trim(),
      templateId: selectedTemplate,
      initialSelectionMode,
    });

    onClose();
    openEditorForResume(newCv.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Crear Nuevo Currículum</h2>
            <p className="text-xs text-neutral-500">
              Define el objetivo laboral de esta versión y elige una plantilla inicial.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              Nombre identificador del CV *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. CV Seguridad Aeroportuaria, CV Atención al Cliente..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              Objetivo Profesional (Orientación del CV)
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ej. Postulaciones a supervisión operativa y coordinación de predios."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-800 block mb-1">
              Descripción o Notas Internas (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas sobre para qué postulaciones o empresas vas a usar este CV..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Initial Selection Mode */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1.5">
              Modo de inicio del CV
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setInitialSelectionMode("empty")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  initialSelectionMode === "empty"
                    ? "border-[#0D7A5F] bg-[#E9F3EE] shadow-2xs"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="initialSelectionMode"
                  checked={initialSelectionMode === "empty"}
                  onChange={() => setInitialSelectionMode("empty")}
                  className="mt-0.5 text-[#0D7A5F] focus:ring-[#0D7A5F] cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs text-[#0B2B22] flex items-center gap-1.5">
                    <span>📄 Empezar en limpio</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#D5E5DD] text-[#0D7A5F] font-mono">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                    Activa manualmente con el tilde únicamente los elementos que apliquen a este puesto.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setInitialSelectionMode("all")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  initialSelectionMode === "all"
                    ? "border-neutral-900 bg-neutral-50 shadow-2xs"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="initialSelectionMode"
                  checked={initialSelectionMode === "all"}
                  onChange={() => setInitialSelectionMode("all")}
                  className="mt-0.5 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs text-neutral-900">
                    📚 Toda mi biblioteca marcada
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                    Preselecciona todas las experiencias, cursos, títulos y habilidades existentes.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-2">
              Seleccionar Plantilla Inicial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50/80 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-neutral-900 text-xs">{tpl.title}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono-num mb-1">
                      {tpl.style}
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 shadow-xs"
            >
              Crear CV y Abrir Editor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
