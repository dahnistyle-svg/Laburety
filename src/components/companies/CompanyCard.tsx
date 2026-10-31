import React, { useState, useEffect } from "react";
import { Company, CompanyStatus, Resume } from "../../types";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  StickyNote,
  AlertTriangle,
  Clock,
  Send,
  UserCheck,
  Archive,
  ChevronDown,
} from "lucide-react";

interface CompanyCardProps {
  company: Company;
  resumes: Resume[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (id: string, updates: Partial<Company>) => void;
  onDelete: (id: string) => void;
  onEdit: (company: Company) => void;
}

const STATUS_CONFIG: Record<
  CompanyStatus,
  { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
> = {
  interesado: {
    label: "Por enviar",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700/60",
    icon: Clock,
  },
  enviado: {
    label: "CV Enviado",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-[#0B63F6] dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-700/60",
    icon: Send,
  },
  entrevista: {
    label: "En entrevista",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700/60",
    icon: UserCheck,
  },
  archivado: {
    label: "Guardado",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    icon: Archive,
  },
};

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  resumes,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const [copiedMail, setCopiedMail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inlineNotes, setInlineNotes] = useState(company.notes || "");
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);

  useEffect(() => {
    setInlineNotes(company.notes || "");
  }, [company.notes]);

  const statusInfo = STATUS_CONFIG[company.status] || STATUS_CONFIG.interesado;

  // Formatear URL de web para asegurar protocolo
  const getFormattedUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!company.email) return;
    try {
      await navigator.clipboard.writeText(company.email);
      setCopiedMail(true);
      setTimeout(() => setCopiedMail(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = company.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedMail(true);
      setTimeout(() => setCopiedMail(false), 2000);
    }
  };

  const handleStatusChange = (newStatus: CompanyStatus) => {
    const updates: Partial<Company> = { status: newStatus };
    if (newStatus === "enviado" && !company.appliedDate) {
      updates.appliedDate = new Date().toISOString().slice(0, 10);
    }
    onUpdate(company.id, updates);
  };

  const handleNotesBlur = () => {
    if (inlineNotes !== company.notes) {
      onUpdate(company.id, { notes: inlineNotes });
      setNotesSavedFeedback(true);
      setTimeout(() => setNotesSavedFeedback(false), 1800);
    }
  };

  const googleMapsUrl = company.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`
    : "";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-150">
      {/* 1. Header (Siempre Visible y Clickeable para Expandir/Colapsar) */}
      <div
        onClick={onToggleExpand}
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between p-4 transition-colors select-none"
      >
        {/* Izquierda: Nombre de la Empresa (en negrita) y la etiqueta del Rubro */}
        <div className="flex items-center gap-2.5 min-w-0 pr-3">
          <span className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base tracking-tight">
            {company.name}
          </span>
          {company.category && (
            <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600">
              {company.category}
            </span>
          )}
        </div>

        {/* Derecha: Select/Badge de Estado, Fecha y Chevron giratorio */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Select de Estado */}
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <select
              value={company.status}
              onChange={(e) => handleStatusChange(e.target.value as CompanyStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D7A5F] ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              <option value="interesado">📌 Por enviar</option>
              <option value="enviado">📤 CV Enviado</option>
              <option value="entrevista">🗣️ En entrevista</option>
              <option value="archivado">📁 Guardado</option>
            </select>
          </div>

          {/* Fecha */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {company.appliedDate ? (
              <span className="font-mono-num text-xs font-medium text-slate-700 dark:text-slate-300">
                {company.appliedDate}
              </span>
            ) : (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                Sin fecha
              </span>
            )}
          </div>

          {/* Chevron Indicador con giro animado */}
          <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* 2. Panel Desplegable (Detalles) */}
      <div
        className={`${
          isExpanded ? "block" : "hidden"
        } border-t border-slate-100 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-4`}
      >
        {/* Barra Superior de Detalles: Select de CV Específico, Fecha y Botones de Acción */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          {/* Select de CV específico */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-[#0B63F6] dark:text-blue-400 shrink-0" />
              <span>CV específico:</span>
            </div>
            <select
              value={company.linkedCvId || ""}
              onChange={(e) =>
                onUpdate(company.id, { linkedCvId: e.target.value || undefined })
              }
              className="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[220px]"
            >
              <option value="">Sin CV específico</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Botones de Edición / Eliminación */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {/* Edición de fecha rápida */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                Fecha:
              </span>
              {isEditingDate ? (
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={company.appliedDate || ""}
                    onChange={(e) => onUpdate(company.id, { appliedDate: e.target.value })}
                    className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="px-2 py-0.5 bg-[#0B63F6] text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDate(true)}
                  className="group flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  title="Modificar fecha"
                >
                  <span className="font-mono-num">{company.appliedDate || "Asignar"}</span>
                  <Edit2 className="w-3 h-3 opacity-50 group-hover:opacity-100 text-slate-500" />
                </button>
              )}
            </div>

            {/* Separador */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Botones de acción: Editar y Eliminar */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(company)}
                className="p-1.5 text-slate-500 hover:text-[#0B63F6] dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
                title="Editar empresa"
                aria-label="Editar empresa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-pointer"
                title="Eliminar empresa"
                aria-label="Eliminar empresa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Contacto (Dirección, Web, Mail) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Dirección física + Google Maps */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Ubicación
                </span>
                {company.address ? (
                  <p
                    className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate"
                    title={company.address}
                  >
                    {company.address}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400 dark:text-slate-500">
                    Sin dirección cargada
                  </p>
                )}
              </div>
            </div>
            {company.address ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>🗺️ Ver Mapa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => onEdit(company)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline text-left cursor-pointer"
              >
                + Agregar dirección
              </button>
            )}
          </div>

          {/* 2. Página Web */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2 min-w-0">
              <Globe className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Página Web
                </span>
                {company.website ? (
                  <p
                    className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate"
                    title={company.website}
                  >
                    {company.website.replace(/^https?:\/\//i, "")}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400 dark:text-slate-500">
                    Sin web registrada
                  </p>
                )}
              </div>
            </div>
            {company.website ? (
              <a
                href={getFormattedUrl(company.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>🌐 Abrir Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => onEdit(company)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline text-left cursor-pointer"
              >
                + Agregar enlace
              </button>
            )}
          </div>

          {/* 3. Mail con botones Copiar y Enviar */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2 min-w-0">
              <Mail className="w-4 h-4 text-[#0B63F6] dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Mail de RRHH
                </span>
                {company.email ? (
                  <p
                    className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate"
                    title={company.email}
                  >
                    {company.email}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400 dark:text-slate-500">
                    Sin mail de RRHH
                  </p>
                )}
              </div>
            </div>
            {company.email ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmail}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    copiedMail
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                  title="Copiar email al portapapeles"
                >
                  {copiedMail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-md bg-[#0B63F6] hover:bg-blue-700 text-white transition-colors"
                  title="Redactar correo a esta empresa"
                >
                  ✉️ Enviar
                </a>
              </div>
            ) : (
              <button
                onClick={() => onEdit(company)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline text-left cursor-pointer"
              >
                + Agregar correo
              </button>
            )}
          </div>
        </div>

        {/* Teléfono adicional si existe */}
        {company.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-500">Teléfono:</span>
            <a
              href={`tel:${company.phone}`}
              className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              {company.phone}
            </a>
          </div>
        )}

        {/* Área de texto de Notas Clave & Requisitos */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <StickyNote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Notas Clave & Requisitos</span>
            </div>
            {notesSavedFeedback ? (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
                ✓ Guardado
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Edita y guarda al hacer clic fuera
              </span>
            )}
          </div>
          <textarea
            value={inlineNotes}
            onChange={(e) => setInlineNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Escribe notas aquí (requisitos, nombre de contacto en RRHH, horarios para dejar CV presencial...)"
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Modal / Alerta de confirmación para eliminar */}
        {showDeleteConfirm && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>¿Eliminar "{company.name}" del radar?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(company.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-2xs active:scale-95 cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
