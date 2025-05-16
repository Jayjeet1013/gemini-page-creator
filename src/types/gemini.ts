
export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export interface GeminiGenerationConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  promptFeedback: {
    blockReason?: string;
  };
}

export type ComponentType = 
  'header' | 
  'footer' | 
  'signup' | 
  'login' | 
  'features' | 
  'pricing' | 
  'testimonial' | 
  'cta' | 
  'hero' | 
  'contact' | 
  'about' | 
  'faq' | 
  'gallery' | 
  'stats' | 
  'team' | 
  'newsletter';

export interface GeneratedComponent {
  type: ComponentType;
  content: string;
  html: string;
}

export interface GenerateComponentParams {
  prompt: string;
  componentType: ComponentType;
  style?: string;
  tone?: string;
  industry?: string;
}
