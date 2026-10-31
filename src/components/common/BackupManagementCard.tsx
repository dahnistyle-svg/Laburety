import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Download,
  Upload,
  Cloud,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

interface BackupManagementCardProps {
  variant?: "full" | "compact";
}

export const BackupManagementCard: React.FC<BackupManagementCardProps> = ({
  variant = "full",
}) => {
  const { exportBackup, importBackup, lastSaved, resumes, syncStatus, triggerCloudSync } = useApp();
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    try {
      await triggerCloudSync();
      setNotification({
        type: "success",
        message: "¡Sincronización con Cloud Firestore completada exitosamente!",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch {
      setNotification({
        type: "error",
        message: "Error al sincronizar con Cloud Firestore.",
      });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleExport = () => {
    try {
      exportBackup();
      setNotification({
        type: "success",
        message: "¡Copia de seguridad descargada exitosamente en tu dispositivo!",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch {
      setNotification({
        type: "error",
        message: "Ocurrió un error al generar la copia de seguridad.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importBackup(content);
      if (result.success) {
        setNotification({
          type: "success",
          message: result.message,
        });
      } else {
        setNotification({
          type: "error",
          message: result.message,
        });
      }
      setTimeout(() => setNotification(null), 6000);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setNotification({
        type: "error",
        message: "No se pudo leer el archivo seleccionado.",
      });
    };
    reader.readAsText(file);
  };

  const formattedTime = lastSaved
    ? new Date(lastSaved).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div className="bg-[#F2F7F4] dark:bg-slate-800 rounded-2xl border border-[#B8D0C4] dark:border-slate-700 p-6 shadow-2xs space-y-5 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-[#D5E5DD] dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D7A5F] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F2F26] dark:text-white flex items-center gap-2">
              <span>Respaldo de Seguridad (Backup)</span>
              <span className="text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                Protección Activa
              </span>
            </h2>
            <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-0.5">
              Descarga o restaura un archivo JSON físico con toda tu información para máxima portabilidad y seguridad.
            </p>
          </div>
        </div>

        {/* Sync Info Pill */}
        <div className="flex items-center gap-1.5 text-xs text-[#0F2F26] dark:text-slate-200 bg-[#E9F3EE] dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-[#B2CCC0] dark:border-slate-600 font-mono-num self-start sm:self-auto shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Autoguardado: {formattedTime || "activo"}</span>
        </div>
      </div>

      {/* Cloud Firestore Status Section */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-[#B8D0C4] dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0F2F26] dark:text-white">
                Sincronización Cloud Firestore
              </h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                syncStatus.state === "synced"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : syncStatus.state === "syncing"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                  : syncStatus.state === "error"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
              }`}>
                {syncStatus.state === "synced" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                {syncStatus.state === "syncing" && <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />}
                {syncStatus.state === "synced"
                  ? "Nube conectada"
                  : syncStatus.state === "syncing"
                  ? "Sincronizando..."
                  : syncStatus.state === "error"
                  ? "Error de conexión"
                  : "Guardado local"}
              </span>
            </div>
            <p className="text-xs text-[#3E6556] dark:text-slate-400 mt-0.5">
              {syncStatus.lastSyncedAt
                ? `Última sincronización con Firestore: ${new Date(syncStatus.lastSyncedAt).toLocaleString()}`
                : "Conectando con la base de datos de Firebase..."}
              {syncStatus.userId && (
                <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-500 truncate max-w-xs sm:max-w-md">
                  ID de sesión en la nube: {syncStatus.userId}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleManualCloudSync}
          disabled={isCloudSyncing || syncStatus.state === "syncing"}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0B63F6] hover:bg-blue-700 active:scale-95 text-white shadow-2xs transition-all disabled:opacity-60 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing || syncStatus.state === "syncing" ? "animate-spin" : ""}`} />
          <span>Sincronizar ahora</span>
        </button>
      </div>

      {/* Persistence Guarantee Banner */}
      <div className="p-3.5 bg-[#E9F3EE] dark:bg-slate-900/60 rounded-xl border border-[#B2CCC0] dark:border-slate-700 text-xs text-[#284E42] dark:text-slate-300 flex items-start gap-2.5">
        <Database className="w-4 h-4 text-[#0D7A5F] dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tus datos se guardan de forma permanente e instantánea en el <strong>almacenamiento local de tu navegador</strong> ({resumes.length} currículum(s) y tu biblioteca completa). Descarga copias periódicas para tener un resguardo físico ante limpiezas de historial o cambio de equipo.
        </p>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export Button */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
              <Download className="w-3.5 h-3.5 text-neutral-700" />
              <span>Exportar copia de seguridad (JSON)</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
              Descarga un archivo <code>.json</code> con toda tu biblioteca maestra, todos tus CVs y la configuración del usuario con marca de tiempo en el nombre.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Exportar copia de seguridad (JSON)</span>
          </button>
        </div>

        {/* Import Button */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
              <Upload className="w-3.5 h-3.5 text-neutral-700" />
              <span>Importar copia de seguridad (JSON)</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
              Selecciona un archivo <code>.json</code> previamente exportado para validar su estructura, restaurar tus datos en <code>localStorage</code> y refrescar la app inmediatamente.
            </p>
          </div>

          <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-colors shadow-2xs cursor-pointer active:scale-[0.99]">
            <Upload className="w-4 h-4 text-neutral-600" />
            <span>Importar copia de seguridad (JSON)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
