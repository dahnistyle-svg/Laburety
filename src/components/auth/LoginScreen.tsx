import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LaburetyMascot } from "../brand/LaburetyMascot";
import { LaburetyLogoText } from "../brand/LaburetyLogoText";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const LoginScreen: React.FC = () => {
  const { login, loginWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || "Credenciales incorrectas. Inténtalo de nuevo.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al iniciar sesión.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorMessage(result.error || "No se pudo iniciar sesión con Google.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al conectar con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@laburety.com");
    setPassword("admin123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#041217] via-[#09222b] to-[#020b0e] text-white selection:bg-[#0B63F6] selection:text-white">
      {/* Subtle background ambient glow orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#0B63F6]/15 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#10b981]/15 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0284c7]/5 rounded-full blur-[140px]" />

      {/* Subtle geometric dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0c252f]/90 backdrop-blur-2xl border border-[#1b434e]/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl p-7 sm:p-9 relative z-10 flex flex-col gap-6 animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          {/* Medallion with Mascot */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0B63F6] to-[#10b981] rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative bg-[#081b22] border border-[#21515f] p-2.5 rounded-2xl shadow-xl flex items-center justify-center">
              <LaburetyMascot size={64} className="transition-transform group-hover:scale-105 duration-200" />
            </div>
          </div>

          {/* Logo Name & Slogan */}
          <div className="flex flex-col items-center select-none mt-1">
            <LaburetyLogoText size="lg" showTagline={true} themeMode="petrol-banner" animated={true} />
          </div>
        </div>

        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1b434e] to-transparent" />

        {/* Card Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accede a tu biblioteca profesional y editor de CV
          </p>
        </div>

        {/* Google One-Click Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar con Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1b434e]" />
          <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">o ingresa con correo</span>
          <div className="flex-1 h-px bg-[#1b434e]" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error Message Box */}
          {errorMessage && (
            <div
              role="alert"
              className="bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm p-3 rounded-xl flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Email Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
              Correo electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="admin@laburety.com"
                className="w-full pl-3.5 pr-4 py-3 rounded-xl text-sm font-medium !bg-[#071920] !text-white !border !border-[#1c4755] placeholder:text-slate-500 focus:outline-none focus:!border-[#38BDF8] focus:!ring-2 focus:!ring-[#38BDF8]/25 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="admin123"
                className="w-full pl-3.5 pr-11 py-3 rounded-xl text-sm font-medium !bg-[#071920] !text-white !border !border-[#1c4755] placeholder:text-slate-500 focus:outline-none focus:!border-[#38BDF8] focus:!ring-2 focus:!ring-[#38BDF8]/25 transition-all shadow-inner font-mono-num"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3.5 px-6 rounded-xl font-bold text-white text-base shadow-lg shadow-blue-600/30 bg-gradient-to-r from-[#0B63F6] via-[#0284c7] to-[#0ea5e9] hover:from-[#1d4ed8] hover:via-[#0284c7] hover:to-[#0284c7] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Ingresar a mi cuenta</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill & Quick Autofill */}
        <div className="bg-[#081a21] border border-[#1b434e] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-300">
              Demo: <strong className="text-white">admin@laburety.com</strong> / <strong className="text-white">admin123</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#38BDF8] hover:text-white bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Autocompletar con credenciales demo"
          >
            <Sparkles className="w-3 h-3 text-[#38BDF8]" />
            <span>Autocompletar</span>
          </button>
        </div>

        {/* Privacy & Local Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Almacenamiento 100% privado y seguro en tu navegador</span>
        </div>
      </div>
    </div>
  );
};
