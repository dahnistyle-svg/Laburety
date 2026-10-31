import React from "react";
import { Resume, MasterLibrary } from "../../types";
import { resolveResumeData } from "./templateUtils";
import { HarvardTemplate } from "./HarvardTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { AtsMinimalTemplate } from "./AtsMinimalTemplate";

interface ResumeRendererProps {
  resume: Resume;
  library: MasterLibrary;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ resume, library }) => {
  const resolved = resolveResumeData(resume, library);

  switch (resume.templateId) {
    case "harvard":
      return <HarvardTemplate data={resolved} />;
    case "executive":
      return <ExecutiveTemplate data={resolved} />;
    case "ats":
      return <AtsMinimalTemplate data={resolved} />;
    default:
      return <HarvardTemplate data={resolved} />;
  }
};
