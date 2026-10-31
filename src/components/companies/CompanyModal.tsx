import React, { useState, useEffect } from "react";
import { Company, CompanyStatus, Resume } from "../../types";
import {
  X,
  Building2,
  Calendar,
  FileText,
  MapPin,
  Globe,
  Mail,
  Phone,
  Tag,
  StickyNote,
  Check,
} from "lucide-react";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Company, "id" | "updatedAt">) => void;
  companyToEdit?: Company | null;
  resumes: Resume[];
}

const COMMON_CATEGORIES = [
  "Hotelería y Turismo",
  "Seguridad y Vigilancia",
  "Atención al Cliente",
  "Administración",
  "Logística y Almacén",
  "Gastronomía",
  "Comercio y Ventas",
  "Salud",
  "Tecnología",
];

const STATUS_OPTIONS: { id: CompanyStatus; label: string; badgeClass: string }[] = [
  {
    id: "interesado",
    label: "📌 Por enviar",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  {
    id: "enviado",
    label: "📤 CV Enviado",
    badgeClass: "bg-blue-100 text-[#0B63F6] border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  },
  {
    id: "entrevista",
    label: "🗣️ En entrevista",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
  {
    id: "archivado",
    label: "📁 Guardado",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
];

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  companyToEdit,
  resumes,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<CompanyStatus>("interesado");
  const [appliedDate, setAppliedDate] = useState("");
  const [linkedCvId, setLinkedCvId] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (companyToEdit) {
      setName(companyToEdit.name || "");
      setCategory(companyToEdit.category || "");
      setAddress(companyToEdit.address || "");
      setWebsite(companyToEdit.website || "");
      setEmail(companyToEdit.email || "");
      setPhone(companyToEdit.phone || "");
      setStatus(companyToEdit.status || "interesado");
      setAppliedDate(companyToEdit.appliedDate || "");
      setLinkedCvId(companyToEdit.linkedCvId || "");
      setNotes(companyToEdit.notes || "");
    } else {
      setName("");
      setCategory("");
      setAddress("");
      setWebsite("");
      setEmail("");
      setPhone("");
      setStatus("interesado");
      setAppliedDate("");
      setLinkedCvId(resumes.length > 0 ? resumes[0].id : "");
      setNotes("");
    }
    setErrors({});
  }, [companyToEdit, isOpen, resumes]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: CompanyStatus) => {
    setStatus(newStatus);
    // Si cambia el estado a 'enviado' y la fecha estaba vacía, autocompletar con la fecha actual
    if (newStatus === "enviado" && !appliedDate) {
      const today = new Date().toISOString().slice(0, 10);
      setAppliedDate(today);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la empresa es requerido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      category: category.trim(),
      address: address.trim(),
      website: website.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      appliedDate: appliedDate || "",
      linkedCvId: linkedCvId || "",
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F2F7F4] dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-[#B8D0C4] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#B8D0C4] dark:border-slate-800 flex items-center justify-between bg-[#E3EFE9] dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0B63F6] dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2F26] dark:text-white">
                {companyToEdit ? "Editar Empresa en Radar" : "Agregar Nueva Empresa"}
              </h2>
              <p className="text-xs text-[#3E6556] dark:text-slate-400">
                Registra datos de contacto, ubicación, notas y seguimiento de tu postulación.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#527969] hover:text-[#0F2F26] dark:hover:text-slate-200 hover:bg-[#D5E5DD] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Row 1: Nombre de la Empresa y Rubro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Nombre de la Empresa / Lugar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Hotel Sheraton, Securitas..."
                  className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors ${
                    errors.name
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-neutral-200 dark:border-slate-700"
                  }`}
                  autoFocus
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Rubro o Sector
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  list="categories-list"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: Hotelería, Seguridad, Ventas..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                />
                <datalist id="categories-list">
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-neutral-400 dark:text-slate-500 mr-1">
              Sugerencias de rubro:
            </span>
            {COMMON_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  category === cat
                    ? "bg-[#0B63F6] text-white border-[#0B63F6]"
                    : "bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 border-neutral-200 dark:border-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 2: Dirección física */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
              Dirección Física / Ubicación (para ver en Google Maps)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. del Libertador 774, CABA o Quilmes Centro"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Página Web y Mail de contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Página Web / LinkedIn / Portal
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.empresa.com o URL de empleos"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Mail de Contacto / RRHH para Enviar CV
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rrhh@empresa.com o empleos@..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Teléfono opcional & Estado de postulación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Teléfono o WhatsApp (opcional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: +54 11 4321-0000"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                Estado Actual de la Postulación
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = status === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleStatusChange(opt.id)}
                      className={`text-xs px-2.5 py-2 rounded-xl font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? opt.badgeClass + " ring-2 ring-[#0B63F6]"
                          : "bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 5: Fecha de envío y CV vinculado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Fecha de Envío del CV</span>
                {status === "enviado" && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                    (Autocompletada con hoy)
                  </span>
                )}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                />
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-slate-500 mt-1">
                {appliedDate ? `Registrado para: ${appliedDate}` : "Pendiente de envío si aún no postulaste"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 mb-1.5">
                CV Vinculado (de "Mis CV")
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={linkedCvId}
                  onChange={(e) => setLinkedCvId(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors"
                >
                  <option value="">(Ningún CV seleccionado)</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-slate-500 mt-1">
                Indica qué versión de tu currículum enviaste o enviarás
              </p>
            </div>
          </div>

          {/* Row 6: Notas importantes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300">
                Notas Importantes de la Empresa
              </label>
              <span className="text-[11px] text-neutral-400 dark:text-slate-500 flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                Requisitos, horarios, contacto RRHH
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Dejar CV en mano los martes de 10 a 14 hs en recepción. Preguntar por Lic. Gómez. Piden experiencia comprobable y movilidad propia..."
              rows={4}
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0B63F6] transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-[#B8D0C4] dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#284E42] dark:text-slate-300 hover:bg-[#D5E5DD] dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0B63F6] hover:bg-[#084ec7] rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{companyToEdit ? "Guardar Cambios" : "Agregar Empresa"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
