import React from "react";
import { LaburetyMascot } from "./LaburetyMascot";
import { LaburetyLogoText } from "./LaburetyLogoText";

export interface LaburetyBrandProps {
  variant?: "navbar" | "hero";
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  allowMascotUpload?: boolean;
  themeMode?: "default" | "petrol-banner";
}

export const LaburetyBrand: React.FC<LaburetyBrandProps> = ({
  variant = "navbar",
  showTagline,
  className = "",
  onClick,
  allowMascotUpload,
  themeMode = "default",
}) => {
  const isNavbar = variant === "navbar";
  const shouldShowTagline = showTagline !== undefined ? showTagline : !isNavbar;
  const shouldAllowUpload = allowMascotUpload !== undefined ? allowMascotUpload : !isNavbar;

  if (isNavbar) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2.5 select-none ${
          onClick ? "cursor-pointer group" : ""
        } ${className}`}
      >
        {/* Mascot in compact 40x40px */}
        <LaburetyMascot
          size={40}
          allowUpload={shouldAllowUpload}
          className="transition-transform group-hover:scale-105"
        />

        {/* Wordmark with Turquoise Dot on 'y' */}
        <div className="flex flex-col justify-center">
          <LaburetyLogoText size="sm" showTagline={false} themeMode={themeMode} />
        </div>
      </div>
    );
  }

  // Hero variant (for Dashboard header banner)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-5 sm:gap-6 select-none ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
    >
      {/* Mascot inside a luminous rounded medallion for contrast over petrol background */}
      <div className="relative shrink-0 bg-[#F2F8F5] p-2 rounded-2xl shadow-md border border-[#E3EFE9]">
        <LaburetyMascot
          size={80}
          allowUpload={shouldAllowUpload}
          className="transition-transform group-hover:scale-105"
        />
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col justify-center">
        <LaburetyLogoText
          size="lg"
          showTagline={shouldShowTagline}
          themeMode={themeMode}
        />
      </div>
    </div>
  );
};
