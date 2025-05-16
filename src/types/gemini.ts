
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

export interface LandingPageSection {
  type: 'hero' | 'features' | 'testimonial' | 'pricing' | 'cta' | 'about' | 'contact';
  content: string;
  title?: string;
  html?: string;
  subtitle?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface GenerateLandingPageParams {
  prompt: string;
  sections?: string[];
  style?: string;
  tone?: string;
  industry?: string;
}
