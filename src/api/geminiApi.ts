
import { GeminiConfig, GeminiGenerationConfig, GeminiResponse } from "@/types/gemini";

const DEFAULT_CONFIG: GeminiGenerationConfig = {
  temperature: 0.8,
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

  // Helper to generate HTML from a prompt
  async generateHtml(prompt: string): Promise<string> {
    const enhancedPrompt = `
Generate valid, semantic, and accessible HTML for the following: 
${prompt}

The HTML should:
- Be self-contained (no external CSS)
- Use inline Tailwind CSS classes
- Be responsive
- Follow best practices for accessibility
- Include only the HTML for this specific component (no full page markup)
- Use semantic HTML5 elements where appropriate
- Not include any script tags or external resources

Output ONLY the HTML, nothing else:
`;

    return this.generate(enhancedPrompt);
  }
}
