/**
 * AI Service Types & Interface definitions
 * Prepared for future integration without breaking core manual functionality.
 */

import { MasterLibrary, Resume } from "../../types";

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TextImprovementRequest {
  originalText: string;
  targetRole?: string;
  tone?: "professional" | "concise" | "executive" | "technical";
  context?: string;
}

export interface ResumeAnalysisResult {
  score: number;
  clarityFeedback: string[];
  missingElements: string[];
  atsRecommendations: string[];
  keywordGaps: string[];
}

export interface JobMatchResult {
  jobTitle: string;
  fitPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedExperiences: string[];
  recommendedKeywords: string[];
}

export interface IAIService {
  isEnabled(): boolean;
  improveText(request: TextImprovementRequest): Promise<AIServiceResponse<string>>;
  analyzeResume(resume: Resume, library: MasterLibrary): Promise<AIServiceResponse<ResumeAnalysisResult>>;
  matchJobOffer(jobDescription: string, library: MasterLibrary): Promise<AIServiceResponse<JobMatchResult>>;
  suggestSkills(existingSkills: string[], targetRole: string): Promise<AIServiceResponse<string[]>>;
  generateProfileSummary(library: MasterLibrary, targetRole?: string): Promise<AIServiceResponse<string>>;
}
