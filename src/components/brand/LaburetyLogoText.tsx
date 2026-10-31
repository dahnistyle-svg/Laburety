import React from "react";

interface LaburetyLogoTextProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  themeMode?: "default" | "petrol-banner";
  animated?: boolean;
}

export const LaburetyLogoText: React.FC<LaburetyLogoTextProps> = ({
  size = "md",
  showTagline = false,
  className = "",
  themeMode = "default",
  animated = true,
}) => {
  // Size mapping
  const sizeConfig = {
    sm: {
      textClass: "text-xl sm:text-2xl",
      taglineClass: "text-[10px]",
    },
    md: {
      textClass: "text-2xl sm:text-3xl",
      taglineClass: "text-xs",
    },
    lg: {
      textClass: "text-3xl sm:text-4xl md:text-[42px]",
      taglineClass: "text-xs sm:text-sm",
    },
    xl: {
      textClass: "text-4xl sm:text-5xl md:text-6xl",
      taglineClass: "text-sm sm:text-base",
    },
  };

  const config = sizeConfig[size];
  const isPetrol = themeMode === "petrol-banner";

  // Gradient styles for animated liquid / tornasolado effect
  const labureGradient = animated
    ? isPetrol
      ? "bg-gradient-to-r from-white via-emerald-100 via-sky-100 via-teal-100 to-white bg-clip-text text-transparent animate-text-gradient"
      : "bg-gradient-to-r from-[#091E42] via-[#0D7A5F] via-[#1E3A8A] via-[#0F2F26] to-[#091E42] dark:from-white dark:via-emerald-200 dark:via-sky-200 dark:to-white bg-clip-text text-transparent animate-text-gradient"
    : isPetrol
    ? "text-white"
    : "text-[#091E42] dark:text-white";

  const tyGradient = animated
    ? isPetrol
      ? "bg-gradient-to-r from-[#34D399] via-[#38BDF8] via-[#818CF8] via-[#2DD4BF] to-[#34D399] bg-clip-text text-transparent animate-text-gradient"
      : "bg-gradient-to-r from-[#0B63F6] via-[#06B6D4] via-[#10B981] via-[#0B63F6] to-[#0B63F6] dark:from-[#38BDF8] dark:via-[#34D399] dark:via-[#818CF8] dark:to-[#38BDF8] bg-clip-text text-transparent animate-text-gradient"
    : isPetrol
    ? "text-[#34D399]"
    : "text-[#0B63F6] dark:text-[#3B82F6]";

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      {/* Brand Name "Laburety" */}
      <div className="flex items-baseline font-['Nunito',_'Plus_Jakarta_Sans',_sans-serif] font-black tracking-tight leading-none">
        {/* "Labure" */}
        <span
          className={`inline-block ${config.textClass} ${labureGradient} transition-colors`}
        >
          Labure
        </span>

        {/* "ty" in aqua / turquoise */}
        <span
          className={`inline-block ${config.textClass} ${tyGradient} transition-colors`}
        >
          ty
        </span>
      </div>

      {/* Slogan: "Tu próximo trabajo empieza acá" */}
      {showTagline && (
        <span
          className={`mt-1 font-['Nunito',_'Plus_Jakarta_Sans',_sans-serif] font-semibold tracking-tight ${config.taglineClass} ${
            isPetrol
              ? "text-[#A7F3D0]"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Tu próximo trabajo empieza acá
        </span>
      )}
    </div>
  );
};
