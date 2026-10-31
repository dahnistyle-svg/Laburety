import React, { useState, useEffect, useRef } from "react";
import { Camera, RotateCcw, X, Upload } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const MASCOT_STORAGE_KEY = "laburety_custom_mascot_v1";

interface LaburetyMascotProps {
  size?: number; // size in px, e.g. 40, 72, 84
  className?: string;
  allowUpload?: boolean;
  interactive?: boolean;
}

export const LaburetyMascot: React.FC<LaburetyMascotProps> = ({
  size = 40,
  className = "",
  allowUpload = false,
  interactive = false,
}) => {
  const { theme } = useTheme();
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom mascot if stored
  const loadCustomMascot = () => {
    try {
      const stored = localStorage.getItem(MASCOT_STORAGE_KEY);
      setCustomImage(stored || null);
    } catch {
      // LocalStorage access fallback
      setCustomImage(null);
    }
  };

  useEffect(() => {
    loadCustomMascot();

    const handleStorageChange = () => loadCustomMascot();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("laburety-mascot-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("laburety-mascot-updated", handleStorageChange);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          localStorage.setItem(MASCOT_STORAGE_KEY, result);
          setCustomImage(result);
          window.dispatchEvent(new Event("laburety-mascot-updated"));
          setIsModalOpen(false);
        } catch {
          alert("La imagen es demasiado pesada para almacenar en memoria. Prueba con una imagen más pequeña.");
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem(MASCOT_STORAGE_KEY);
      setCustomImage(null);
      window.dispatchEvent(new Event("laburety-mascot-updated"));
      setIsModalOpen(false);
    } catch {
      setCustomImage(null);
    }
  };

  return (
    <>
      <div
        className={`relative group inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        {customImage ? (
          <div
            className={`w-full h-full flex items-center justify-center rounded-xl overflow-hidden transition-transform ${
              theme === "dark" ? "bg-white/95 p-1 shadow-sm" : ""
            }`}
          >
            <img
              src={customImage}
              alt="Mascota Laburety"
              className="w-full h-full object-contain filter drop-shadow-sm"
              style={{
                mixBlendMode: theme === "light" ? "multiply" : "normal",
              }}
            />
          </div>
        ) : (
          /* High-Fidelity SVG Mascot: Smiling Walking Resume with thumbs up and portfolio */
          <svg
            viewBox="0 0 200 215"
            width={size}
            height={size}
            className="w-full h-full overflow-visible transition-transform duration-200 group-hover:scale-105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Soft Drop Shadow for Character */}
              <filter id="mascot-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#091E42" floodOpacity="0.18" />
              </filter>
              {/* Subtle Gradient for Sheet Depth */}
              <linearGradient id="sheet-grad" x1="50" y1="20" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="85%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
              {/* Electric Blue gradient for folder & corner */}
              <linearGradient id="blue-flap-grad" x1="120" y1="20" x2="160" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#0B63F6" />
              </linearGradient>
              {/* Navy Blue gradient for limbs */}
              <linearGradient id="navy-limb-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F2850" />
                <stop offset="100%" stopColor="#081830" />
              </linearGradient>
            </defs>

            {/* 1. Ground Shadow */}
            <ellipse cx="98" cy="198" rx="55" ry="7" fill="#CBD5E1" fillOpacity="0.55" />

            {/* 2. Limbs Behind Sheet */}
            {/* Back Leg (our left / character's right) in mid-stride */}
            <path
              d="M78 152 Q 68 172 60 184"
              stroke="#081830"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Back Sneaker */}
            <g transform="translate(42, 174) rotate(-14)">
              {/* White Rubber Sole */}
              <path
                d="M 5 23 C 12 25, 34 25, 42 20 C 43 23, 38 27, 24 28 C 10 28, 4 25, 5 23 Z"
                fill="#FFFFFF"
                stroke="#081830"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Electric Blue Shoe Body */}
              <path
                d="M 6 22 C 4 15, 12 11, 20 11 C 24 7, 30 7, 34 11 C 38 13, 40 17, 42 20 C 32 23, 14 24, 6 22 Z"
                fill="#0B63F6"
                stroke="#081830"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* White Toe Cap & Curved Accent */}
              <path
                d="M 6 21 C 9 17, 16 16, 21 21 C 15 22, 9 22, 6 21 Z"
                fill="#FFFFFF"
              />
              {/* White Lace detail */}
              <path d="M 23 12 L 29 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Front Leg (our right / character's left) stepping forward */}
            <path
              d="M112 152 Q 124 168 138 182"
              stroke="#081830"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Front Sneaker (Tilted Up showing sole and angle) */}
            <g transform="translate(126, 166) rotate(32)">
              {/* White Rubber Sole */}
              <path
                d="M 6 24 C 14 26, 36 26, 44 20 C 45 23, 40 28, 26 29 C 12 29, 5 26, 6 24 Z"
                fill="#FFFFFF"
                stroke="#081830"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Electric Blue Shoe Body */}
              <path
                d="M 7 23 C 5 15, 13 11, 21 11 C 25 7, 31 7, 35 11 C 39 13, 42 17, 44 20 C 34 23, 15 24, 7 23 Z"
                fill="#0B63F6"
                stroke="#081830"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* White Toe Cap */}
              <path
                d="M 7 22 C 10 18, 17 17, 22 22 C 16 23, 10 23, 7 22 Z"
                fill="#FFFFFF"
              />
              {/* White Lace detail */}
              <path d="M 24 12 L 30 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Left Arm & Portfolio (character's right side, our left) */}
            {/* Dark Navy Portfolio Folder under arm */}
            <g transform="translate(34, 104) rotate(16)">
              <rect
                x="0"
                y="0"
                width="34"
                height="44"
                rx="5"
                fill="#0A1D37"
                stroke="#081830"
                strokeWidth="2.5"
              />
              {/* Folder tab & crease line */}
              <line x1="8" y1="0" x2="8" y2="44" stroke="#1E3A8A" strokeWidth="1.5" />
            </g>
            {/* Arm tucking folder */}
            <path
              d="M 66 112 Q 44 116 38 132 Q 42 142 54 140"
              stroke="#081830"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White Gloved Hand clutching the folder bottom */}
            <g transform="translate(40, 130) rotate(-10)">
              <ellipse cx="10" cy="10" rx="9" ry="8" fill="#FFFFFF" stroke="#081830" strokeWidth="2.5" />
              {/* Fingers definition */}
              <path d="M 6 12 Q 10 15 14 12" stroke="#081830" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M 8 7 Q 12 10 16 7" stroke="#081830" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>

            {/* 3. Main Resume Sheet Body (Clean White Paper with Deep Navy Border) */}
            <g filter="url(#mascot-shadow)">
              {/* The CV Page Contour with top-right folded corner cut */}
              <path
                d="M 62 26 
                   C 54 26, 48 32, 48 40 
                   L 55 145 
                   C 56 153, 62 159, 70 159 
                   L 132 154 
                   C 140 154, 146 148, 145 140 
                   L 142 54 
                   L 118 26 
                   Z"
                fill="url(#sheet-grad)"
                stroke="#081830"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Folded Top-Right Corner (Vibrant Electric Blue flap with dark crease shadow) */}
              {/* Under-fold shadow */}
              <path
                d="M 118 26 L 142 54 L 118 54 Z"
                fill="#0747B6"
                opacity="0.3"
              />
              {/* Top flap */}
              <path
                d="M 118 26 L 142 54 L 118 54 C 117 44, 117 36, 118 26 Z"
                fill="url(#blue-flap-grad)"
                stroke="#081830"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </g>

            {/* 4. Cute Anime Face */}
            {/* Eyebrows */}
            <path
              d="M 68 59 Q 77 53 85 58"
              stroke="#081830"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 103 56 Q 112 50 120 54"
              stroke="#081830"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Eye (our left) */}
            <ellipse cx="78" cy="71" rx="6.5" ry="9" fill="#081830" />
            {/* White sparkle reflection */}
            <circle cx="76" cy="68" r="2.5" fill="#FFFFFF" />
            <circle cx="80" cy="74" r="1.2" fill="#FFFFFF" />

            {/* Right Eye (our right) */}
            <ellipse cx="111" cy="68" rx="6.5" ry="9" fill="#081830" />
            {/* White sparkle reflection */}
            <circle cx="109" cy="65" r="2.5" fill="#FFFFFF" />
            <circle cx="113" cy="71" r="1.2" fill="#FFFFFF" />

            {/* Happy Open Smile */}
            <g transform="translate(80, 81)">
              {/* Mouth Interior */}
              <path
                d="M 3 4 Q 15 20 27 4 C 20 2, 10 2, 3 4 Z"
                fill="#081830"
              />
              {/* Upper White Teeth */}
              <path
                d="M 4 4 Q 15 10 26 4 C 20 3, 10 3, 4 4 Z"
                fill="#FFFFFF"
              />
              {/* Pink Warm Tongue */}
              <path
                d="M 9 12 Q 15 19 21 12 C 18 10, 12 10, 9 12 Z"
                fill="#FF6584"
              />
            </g>

            {/* 5. Resume Content on Sheet Body */}
            {/* Avatar Circle */}
            <g transform="translate(68, 104)">
              <circle cx="12" cy="12" r="11" fill="#0B63F6" />
              {/* White User Silhouette */}
              {/* Head */}
              <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
              {/* Shoulders */}
              <path
                d="M 6 19 C 6 15, 9 14, 12 14 C 15 14, 18 15, 18 19 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Resume Text Lines */}
            {/* Title Line (Electric Blue) */}
            <rect x="97" y="107" width="34" height="5.5" rx="2.75" fill="#0B63F6" />
            {/* Body Line 1 (Soft Blue) */}
            <rect x="97" y="116" width="38" height="4" rx="2" fill="#93C5FD" />
            {/* Body Line 2 (Soft Blue) */}
            <rect x="70" y="127" width="65" height="4" rx="2" fill="#BFDBFE" />
            {/* Body Line 3 (Soft Blue) */}
            <rect x="70" y="135" width="52" height="4" rx="2" fill="#BFDBFE" />

            {/* 6. Right Arm & Thumbs Up (our right / character's left) */}
            {/* Energetic raised Navy Arm */}
            <path
              d="M 134 116 Q 148 108 156 94"
              stroke="#081830"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* White Gloved Hand with Thumbs Up */}
            <g transform="translate(148, 76)">
              {/* Fist */}
              <ellipse cx="14" cy="19" rx="8" ry="7.5" fill="#FFFFFF" stroke="#081830" strokeWidth="2.5" />
              {/* Thumb pointing proudly UP */}
              <path
                d="M 10 16 L 10 5 C 10 2, 15 2, 15 5 L 15 16 Z"
                fill="#FFFFFF"
                stroke="#081830"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Fingers curling into fist lines */}
              <path d="M 12 15 Q 18 15 20 18" stroke="#081830" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M 11 20 Q 17 20 19 23" stroke="#081830" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>

            {/* 7. Golden Spark Energy Rays radiating from the Thumbs Up */}
            <g stroke="#FFB800" strokeWidth="3" strokeLinecap="round">
              {/* Ray 1 (Top Left) */}
              <line x1="156" y1="68" x2="150" y2="58" />
              {/* Ray 2 (Top Right) */}
              <line x1="168" y1="72" x2="178" y2="65" />
              {/* Ray 3 (Bottom Right) */}
              <line x1="171" y1="84" x2="182" y2="87" />
            </g>
          </svg>
        )}

        {/* Hover / Edit button when allowUpload is enabled */}
        {allowUpload && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-200 rounded-full shadow-md border border-neutral-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-50 dark:hover:bg-slate-700 focus:opacity-100 z-10"
            title="Personalizar imagen de la mascota"
            aria-label="Personalizar imagen de la mascota"
          >
            <Camera className="w-3.5 h-3.5 text-[#0B63F6]" />
          </button>
        )}
      </div>

      {/* Modal for Custom Mascot Image Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Mascota de Laburety
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
              Puedes utilizar la versión vectorial de alta resolución oficial o subir tu archivo PNG exacto desde tu computadora.
            </p>

            {/* Current Preview */}
            <div className="flex items-center justify-center p-4 bg-neutral-50 dark:bg-slate-900/60 rounded-xl border border-neutral-100 dark:border-slate-700">
              <LaburetyMascot size={80} allowUpload={false} />
            </div>

            {/* Upload & Reset Buttons */}
            <div className="space-y-2 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B63F6] hover:bg-[#084ec7] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>Subir mi archivo PNG / imagen</span>
              </button>

              {customImage && (
                <button
                  onClick={handleResetToDefault}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar mascota vectorial original</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
