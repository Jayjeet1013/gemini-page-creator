
import { GeminiConfig, GeminiGenerationConfig, GeminiResponse } from "@/types/gemini";

const DEFAULT_CONFIG: GeminiGenerationConfig = {
  temperature: 0.9,  // Increased temperature for more creative outputs
  topP: 0.95,
  topK: 32,
  maxOutputTokens: 2048,
};

export class GeminiApiClient {
  private apiKey: string;
  private model: string;

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "gemini-1.5-flash";
  }

  async generate(
    prompt: string,
    config: Partial<GeminiGenerationConfig> = {}
  ): Promise<string> {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${
          this.model
        }:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: mergedConfig,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error (${response.status}): ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json() as GeminiResponse;
      
      // Check if the response contains blocking information
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
      }

      // Return the first text part if available
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }

  // Enhanced HTML generator with better styling instructions
  async generateHtml(prompt: string): Promise<string> {
    const enhancedPrompt = `
${prompt}

Remember to:
- Use visually appealing layouts with proper spacing
- Incorporate beautiful gradients and color schemes
- Add subtle animations and hover effects
- Use unsplash placeholder images (https://images.unsplash.com/photo-...)
- Include modern UI patterns like cards, shadows, and rounded corners
- Make the design responsive for all devices
- Use decorative elements like patterns, dividers, or accents
- Style with Tailwind CSS classes for beautiful typography, colors, and spacing

Output ONLY the HTML code with inline Tailwind CSS, nothing else.
`;

    return this.generate(enhancedPrompt, {
      temperature: 0.85, // Slightly increased temperature for creative designs
    });
  }
}
