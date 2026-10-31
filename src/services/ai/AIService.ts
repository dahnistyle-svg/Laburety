/**
 * AIService Implementation
 * 
 * In V1, all AI features are strictly disabled and decoupled.
 * No API requests are made. No mock AI results are fabricated.
 * This class ensures that future AI integration can be plugged in seamlessly
 * without refactoring the CV editor, library, or templates.
 */

import { MasterLibrary, Resume, AISettings } from "../../types";
import {
  IAIService,
  AIServiceResponse,
  TextImprovementRequest,
  ResumeAnalysisResult,
  JobMatchResult,
} from "./types";

export class AIService implements IAIService {
  private settings: AISettings;

  constructor(settings: AISettings) {
    this.settings = settings;
  }

  public updateSettings(newSettings: AISettings) {
    this.settings = newSettings;
  }

  public isEnabled(): boolean {
    return Boolean(this.settings.enabled);
  }

  public async improveText(_request: TextImprovementRequest): Promise<AIServiceResponse<string>> {
    if (!this.settings.enabled || !this.settings.textImprovement) {
      return {
        success: false,
        error: "Módulo de Inteligencia Artificial desactivado en configuración.",
      };
    }
    // Future expansion point: secure backend call
    return {
      success: false,
      error: "Servicio de IA actualmente en preparación para la próxima versión.",
    };
  }

  public async analyzeResume(_resume: Resume, _library: MasterLibrary): Promise<AIServiceResponse<ResumeAnalysisResult>> {
    if (!this.settings.enabled || !this.settings.resumeAnalysis) {
      return {
        success: false,
        error: "Módulo de análisis de CV desactivado.",
      };
    }
    return {
      success: false,
      error: "Servicio de análisis disponible en la siguiente fase.",
    };
  }

  public async matchJobOffer(_jobDescription: string, _library: MasterLibrary): Promise<AIServiceResponse<JobMatchResult>> {
    if (!this.settings.enabled || !this.settings.jobMatching) {
      return {
        success: false,
        error: "Módulo de adaptación a ofertas laborales desactivado.",
      };
    }
    return {
      success: false,
      error: "Servicio de matching laboral en preparación.",
    };
  }

  public async suggestSkills(_existingSkills: string[], _targetRole: string): Promise<AIServiceResponse<string[]>> {
    if (!this.settings.enabled || !this.settings.suggestions) {
      return {
        success: false,
        error: "Módulo de sugerencias desactivado.",
      };
    }
    return {
      success: false,
      error: "Sugerencias de habilidades en preparación.",
    };
  }

  public async generateProfileSummary(_library: MasterLibrary, _targetRole?: string): Promise<AIServiceResponse<string>> {
    if (!this.settings.enabled || !this.settings.profileGeneration) {
      return {
        success: false,
        error: "Generador de perfil desactivado.",
      };
    }
    return {
      success: false,
      error: "Generador de perfil en preparación.",
    };
  }
}

export const defaultAISettings: AISettings = {
  enabled: false,
  textImprovement: false,
  resumeAnalysis: false,
  jobMatching: false,
  suggestions: false,
  profileGeneration: false,
  provider: "gemini",
};

export const aiServiceInstance = new AIService(defaultAISettings);
