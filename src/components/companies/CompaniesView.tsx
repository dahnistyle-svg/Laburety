import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { Company, CompanyStatus } from "../../types";
import { CompanyCard } from "./CompanyCard";
import { CompanyModal } from "./CompanyModal";
import {
  Building2,
  Search,
  Plus,
  Send,
  UserCheck,
  Clock,
  Archive,
  Layers,
  Sparkles,
} from "lucide-react";

type FilterStatus = "all" | CompanyStatus;

export const CompaniesView: React.FC = () => {
  const { companies, addCompany, updateCompany, deleteCompany, resumes } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Totales para métricas
  const totalCount = companies.length;
  const interestedCount = companies.filter((c) => c.status === "interesado").length;
  const sentCount = companies.filter((c) => c.status === "enviado").length;
  const interviewCount = companies.filter((c) => c.status === "entrevista").length;
  const archivedCount = companies.filter((c) => c.status === "archivado").length;

  // Filtrado reactivo por texto y estado
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Filtro por estado
      if (statusFilter !== "all" && company.status !== statusFilter) {
        return false;
      }

      // Filtro de búsqueda (nombre, rubro, dirección, notas)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = company.name.toLowerCase().includes(query);
        const matchCategory = (company.category || "").toLowerCase().includes(query);
        const matchAddress = (company.address || "").toLowerCase().includes(query);
        const matchNotes = (company.notes || "").toLowerCase().includes(query);
        const matchEmail = (company.email || "").toLowerCase().includes(query);

        return matchName || matchCategory || matchAddress || matchNotes || matchEmail;
      }

      return true;
    });
  }, [companies, statusFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setCompanyToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (comp: Company) => {
    setCompanyToEdit(comp);
    setModalOpen(true);
  };

  const handleSaveModal = (data: Omit<Company, "id" | "updatedAt">) => {
    if (companyToEdit) {
      updateCompany(companyToEdit.id, data);
    } else {
      addCompany(data);
    }
  };

  const filterTabs: { id: FilterStatus; label: string; count: number; icon: React.FC<{ className?: string }> }[] = [
    { id: "all", label: "Todas", count: totalCount, icon: Layers },
    { id: "interesado", label: "Por enviar", count: interestedCount, icon: Clock },
    { id: "enviado", label: "CV Enviado", count: sentCount, icon: Send },
    { id: "entrevista", label: "En entrevista", count: interviewCount, icon: UserCheck },
    { id: "archivado", label: "Guardadas", count: archivedCount, icon: Archive },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header con Título, Métricas Rápidas y Botón Principal */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#F2F7F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2F26] dark:text-white flex items-center gap-2">
                <span>Radar de Empresas y Postulaciones</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B63F6] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                  {totalCount} {totalCount === 1 ? "empresa" : "empresas"}
                </span>
              </h1>
              <p className="text-xs text-[#3E6556] dark:text-slate-400">
                Registra lugares de interés, correos de RRHH, direcciones en Google Maps y el estado de tu CV.
              </p>
            </div>
          </div>
        </div>

        {/* Botón Principal Físico con Relieve */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 active:translate-y-[1px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Empresa</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Búsqueda y Filtros de Estado */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F2F7F4] dark:bg-slate-800 p-3 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 shadow-2xs">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#527969] dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por empresa, rubro, dirección o notas..."
            className="w-full text-xs pl-10 pr-3 py-2 rounded-xl border border-[#A8C4B6] dark:border-slate-700 bg-[#FAFCFB] dark:bg-slate-900/60 text-[#0F2F26] dark:text-white placeholder-[#769C8C] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#527969] hover:text-[#0F2F26] dark:hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botonera de Filtro por Estado (Físicos) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all duration-150 active:scale-95 active:translate-y-[1px] cursor-pointer ${
                  isActive
                    ? "bg-[#0B63F6] text-white border border-[#0B63F6] shadow-sm shadow-blue-500/20"
                    : "border border-[#B5CEC2] dark:border-slate-700 bg-[#D5E5DD] dark:bg-slate-800 text-[#0F2F26] dark:text-slate-300 hover:bg-[#F8FCFA] dark:hover:bg-slate-700 hover:text-[#0B63F6] dark:hover:text-blue-400 shadow-2xs"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#CADBD2] dark:bg-slate-700 text-[#0F2F26] dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Listado / Grilla de Empresas */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-[#F2F7F4] dark:bg-slate-800 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0B63F6] dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/40">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-[#0F2F26] dark:text-white">
              {searchQuery || statusFilter !== "all"
                ? "No se encontraron empresas con estos filtros"
                : "Aún no tienes empresas en tu radar"}
            </h3>
            <p className="text-xs text-[#3E6556] dark:text-slate-400 leading-relaxed">
              {searchQuery || statusFilter !== "all"
                ? "Prueba cambiando el término de búsqueda o seleccionando 'Todas' en las opciones de estado."
                : "Registra los lugares que te interesan (por ejemplo un hotel, empresa de seguridad o local que viste en internet o en la calle) para organizar tus postulaciones."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#B8D0C4] dark:border-slate-700 hover:bg-[#E3EFE9] dark:hover:bg-slate-700 text-[#0F2F26] dark:text-slate-200 transition-colors cursor-pointer"
              >
                Limpiar Filtros
              </button>
            )}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar primera empresa</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              resumes={resumes}
              isExpanded={expandedId === company.id}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === company.id ? null : company.id))
              }
              onUpdate={updateCompany}
              onDelete={deleteCompany}
              onEdit={handleOpenEditModal}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear / Editar Empresa */}
      <CompanyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
        companyToEdit={companyToEdit}
        resumes={resumes}
      />
    </div>
  );
};
