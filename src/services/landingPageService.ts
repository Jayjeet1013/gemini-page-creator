
import { GeminiApiClient } from "@/api/geminiApi";
import { GenerateLandingPageParams, LandingPageSection } from "@/types/gemini";

export class LandingPageService {
  private client: GeminiApiClient;

  constructor(apiKey: string) {
    this.client = new GeminiApiClient({
      apiKey,
      model: "gemini-1.5-flash",
    });
  }

  async generateLandingPage(params: GenerateLandingPageParams): Promise<LandingPageSection[]> {
    const { prompt, sections = ["hero", "features", "testimonial", "cta"], style = "modern", tone = "professional" } = params;

    const landingPageSections: LandingPageSection[] = [];

    // Generate content for each section
    for (const section of sections) {
      try {
        const sectionPrompt = this.createSectionPrompt(section, prompt, style, tone, params.industry);
        const sectionContent = await this.client.generate(sectionPrompt);
        const sectionHtml = await this.client.generateHtml(
          `Create a ${section} section for a landing page based on this content: ${sectionContent}`
        );

        landingPageSections.push({
          type: section as LandingPageSection['type'],
          content: sectionContent,
          html: sectionHtml,
        });
      } catch (error) {
        console.error(`Error generating ${section} section:`, error);
        // Add a placeholder error section
        landingPageSections.push({
          type: section as LandingPageSection['type'],
          content: `Error generating ${section} section. Please try again.`,
          html: `<div class="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <h3 class="text-lg font-medium">Error generating ${section} section</h3>
            <p>Please try again or modify your prompt.</p>
          </div>`,
        });
      }
    }

    return landingPageSections;
  }

  private createSectionPrompt(
    section: string,
    prompt: string,
    style: string,
    tone: string,
    industry?: string
  ): string {
    const industryContext = industry ? `Industry: ${industry}` : "";
    
    const sectionPrompts: Record<string, string> = {
      hero: `
        Create compelling hero section content for a landing page with:
        - An attention-grabbing headline (max 10 words)
        - A persuasive subheading (1-2 sentences)
        - A clear call-to-action button text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Main headline",
          "subtitle": "Subheading text",
          "buttonText": "CTA button text",
          "buttonLink": "#"
        }
      `,
      
      features: `
        Create content for a features section with:
        - A section title
        - 3-4 key features with:
          - Feature name (2-5 words)
          - Brief description (1 sentence each)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "sectionTitle": "Features section title",
          "features": [
            {
              "name": "Feature 1 name",
              "description": "Feature 1 description"
            },
            {
              "name": "Feature 2 name",
              "description": "Feature 2 description"
            }
          ]
        }
      `,
      
      testimonial: `
        Create a realistic customer testimonial with:
        - A quote from a satisfied customer (2-3 sentences)
        - Customer name
        - Customer role/company
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "quote": "Testimonial text",
          "name": "Customer name",
          "role": "Customer role/company"
        }
      `,
      
      cta: `
        Create a call-to-action section with:
        - A compelling heading (5-8 words)
        - A brief description (1-2 sentences)
        - Button text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "CTA heading",
          "description": "CTA description",
          "buttonText": "Button text"
        }
      `,
      
      about: `
        Create content for an "About Us" section with:
        - A section title
        - Company story/background (2-3 sentences)
        - Mission statement (1 sentence)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "About section title",
          "story": "Company background text",
          "mission": "Mission statement"
        }
      `,
      
      pricing: `
        Create content for a pricing section with:
        - A section title
        - 3 pricing tiers with:
          - Tier name
          - Price
          - 3-5 features included
          - CTA text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "sectionTitle": "Pricing section title",
          "tiers": [
            {
              "name": "Basic tier",
              "price": "$X/month",
              "features": ["Feature 1", "Feature 2", "Feature 3"],
              "buttonText": "Get Started"
            },
            {
              "name": "Pro tier",
              "price": "$X/month",
              "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
              "buttonText": "Buy Now"
            }
          ]
        }
      `,
      
      contact: `
        Create content for a contact section with:
        - A section title
        - A brief invitation to get in touch (1-2 sentences)
        - Placeholder email and phone
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Contact section title",
          "message": "Contact invitation text",
          "email": "contact@example.com",
          "phone": "+1 (555) 123-4567"
        }
      `
    };

    return sectionPrompts[section] || 
      `Create content for a ${section} section for a landing page based on: ${prompt}`;
  }

  async regenerateSection(section: LandingPageSection, prompt: string): Promise<LandingPageSection> {
    try {
      const enhancedPrompt = `
        Regenerate content for a ${section.type} section with a fresh approach.
        Previous content: ${section.content}
        New direction: ${prompt}
      `;
      
      const newContent = await this.client.generate(enhancedPrompt);
      const newHtml = await this.client.generateHtml(
        `Create a ${section.type} section for a landing page based on this content: ${newContent}`
      );

      return {
        ...section,
        content: newContent,
        html: newHtml,
      };
    } catch (error) {
      console.error(`Error regenerating ${section.type} section:`, error);
      throw error;
    }
  }
}
