
import { GeminiApiClient } from "@/api/geminiApi";
import { GenerateComponentParams, GeneratedComponent, ComponentType } from "@/types/gemini";

export class ComponentGeneratorService {
  private client: GeminiApiClient;

  constructor(apiKey: string) {
    this.client = new GeminiApiClient({
      apiKey,
      model: "gemini-1.5-flash",
    });
  }

  async generateComponent(params: GenerateComponentParams): Promise<GeneratedComponent> {
    const { prompt, componentType, style = "modern", tone = "professional", industry } = params;

    try {
      const componentPrompt = this.createComponentPrompt(componentType, prompt, style, tone, industry);
      const componentContent = await this.client.generate(componentPrompt);
      const componentHtml = await this.client.generateHtml(
        `Create a ${componentType} component for a website based on this content: ${componentContent}`
      );

      return {
        type: componentType,
        content: componentContent,
        html: componentHtml,
      };
    } catch (error) {
      console.error(`Error generating ${componentType} component:`, error);
      throw error;
    }
  }

  private createComponentPrompt(
    componentType: ComponentType,
    prompt: string,
    style: string,
    tone: string,
    industry?: string
  ): string {
    const industryContext = industry ? `Industry: ${industry}` : "";
    
    const componentPrompts: Record<ComponentType, string> = {
      header: `
        Create content for a website header with:
        - Logo/brand name
        - Navigation links (3-5 items)
        - Call-to-action button (if applicable)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "brandName": "Brand name",
          "navItems": [
            { "label": "Home", "url": "#" },
            { "label": "Features", "url": "#" }
          ],
          "cta": { "label": "Sign Up", "url": "#" } // Optional
        }
      `,
      
      footer: `
        Create content for a website footer with:
        - Copyright info
        - Optional social media links
        - Optional secondary navigation
        - Optional contact info
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "brandName": "Brand name",
          "copyright": "Copyright text",
          "navGroups": [
            {
              "title": "Group title",
              "links": [
                { "label": "Link 1", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "Twitter", "url": "#" }
          ],
          "contactInfo": {
            "email": "contact@example.com",
            "phone": "+1 (555) 123-4567"
          }
        }
      `,
      
      signup: `
        Create content for a sign-up form with:
        - Form title/heading
        - Brief description
        - Fields needed (name, email, etc.)
        - Button text
        - Optional: privacy policy text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Form heading",
          "description": "Brief description",
          "fields": [
            { "name": "fullName", "label": "Full Name", "type": "text", "required": true },
            { "name": "email", "label": "Email Address", "type": "email", "required": true }
          ],
          "buttonText": "Sign Up",
          "privacyText": "We respect your privacy..." // Optional
        }
      `,
      
      login: `
        Create content for a login form with:
        - Form title/heading
        - Fields needed (email, password)
        - Button text
        - Optional: forgot password link
        - Optional: sign up alternative
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Login",
          "fields": [
            { "name": "email", "label": "Email", "type": "email", "required": true },
            { "name": "password", "label": "Password", "type": "password", "required": true }
          ],
          "buttonText": "Log In",
          "forgotPasswordText": "Forgot password?",
          "signUpText": "Don't have an account? Sign up"
        }
      `,
      
      features: `
        Create content for a features section with:
        - Section title
        - Brief description
        - 3-6 features with name, description, and optional icon name
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Features title",
          "description": "Section description",
          "features": [
            {
              "name": "Feature 1",
              "description": "Feature 1 description",
              "icon": "zap" // Optional, use a name from lucide-react icons
            }
          ]
        }
      `,
      
      pricing: `
        Create content for a pricing table with:
        - Section title
        - Brief description
        - 2-4 pricing tiers with name, price, features, and button text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Pricing",
          "description": "Choose a plan that works for you",
          "tiers": [
            {
              "name": "Basic",
              "price": "$9",
              "period": "month",
              "description": "For individuals",
              "features": ["Feature 1", "Feature 2"],
              "buttonText": "Get Started"
            }
          ]
        }
      `,
      
      testimonial: `
        Create content for a testimonial section with:
        - Section title
        - 1-3 testimonials with quote, name, role, and company
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "What Our Clients Say",
          "testimonials": [
            {
              "quote": "Testimonial text here...",
              "name": "Client Name",
              "role": "Role",
              "company": "Company"
            }
          ]
        }
      `,
      
      cta: `
        Create content for a call-to-action section with:
        - Heading
        - Description
        - Button text and optional secondary button
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "CTA heading",
          "description": "CTA description",
          "primaryButton": {
            "text": "Get Started",
            "url": "#"
          },
          "secondaryButton": {
            "text": "Learn More",
            "url": "#"
          }
        }
      `,
      
      hero: `
        Create content for a hero section with:
        - Headline
        - Subheadline
        - CTA button text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "headline": "Main headline",
          "subheadline": "Supporting text",
          "buttonText": "CTA text"
        }
      `,
      
      contact: `
        Create content for a contact section with:
        - Section title
        - Brief message
        - Contact form fields
        - Contact information (email, phone, address)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Contact Us",
          "message": "Get in touch with us",
          "fields": [
            { "name": "name", "label": "Name", "type": "text" },
            { "name": "email", "label": "Email", "type": "email" }
          ],
          "buttonText": "Send Message",
          "contactInfo": {
            "email": "contact@example.com",
            "phone": "+1 (555) 123-4567",
            "address": "123 Main St, City, State"
          }
        }
      `,
      
      about: `
        Create content for an about section with:
        - Section title
        - Company story/mission
        - Optional team members
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "About Us",
          "story": "Company story/mission",
          "values": ["Value 1", "Value 2"],
          "team": [
            {
              "name": "Team Member",
              "role": "Position",
              "bio": "Brief bio"
            }
          ]
        }
      `,
      
      faq: `
        Create content for a FAQ section with:
        - Section title
        - 4-8 questions and answers
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Frequently Asked Questions",
          "items": [
            {
              "question": "Question 1",
              "answer": "Answer 1"
            }
          ]
        }
      `,
      
      gallery: `
        Create content for a gallery/portfolio section with:
        - Section title
        - Brief description
        - 4-8 items with title, category, and description
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Our Portfolio",
          "description": "Check out our work",
          "items": [
            {
              "title": "Project 1",
              "category": "Category",
              "description": "Brief description"
            }
          ]
        }
      `,
      
      stats: `
        Create content for a statistics section with:
        - Section title
        - 3-6 statistics with number, label, and optional description
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Our Impact",
          "stats": [
            {
              "value": "100+",
              "label": "Clients",
              "description": "Happy clients worldwide" // Optional
            }
          ]
        }
      `,
      
      team: `
        Create content for a team section with:
        - Section title
        - Brief description
        - 3-8 team members with name, role, and short bio
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Our Team",
          "description": "Meet the people behind our success",
          "members": [
            {
              "name": "Name",
              "role": "Position",
              "bio": "Brief bio"
            }
          ]
        }
      `,
      
      newsletter: `
        Create content for a newsletter signup section with:
        - Section title
        - Brief description
        - Form fields
        - Button text
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Subscribe to Our Newsletter",
          "description": "Stay updated with our latest news",
          "buttonText": "Subscribe",
          "privacyText": "We respect your privacy" // Optional
        }
      `
    };

    return componentPrompts[componentType] || 
      `Create content for a ${componentType} component based on: ${prompt}`;
  }

  async regenerateComponent(component: GeneratedComponent, prompt: string): Promise<GeneratedComponent> {
    try {
      const enhancedPrompt = `
        Regenerate content for a ${component.type} component with a fresh approach.
        Previous content: ${component.content}
        New direction: ${prompt}
      `;
      
      const newContent = await this.client.generate(enhancedPrompt);
      const newHtml = await this.client.generateHtml(
        `Create a ${component.type} component based on this content: ${newContent}`
      );

      return {
        ...component,
        content: newContent,
        html: newHtml,
      };
    } catch (error) {
      console.error(`Error regenerating ${component.type} component:`, error);
      throw error;
    }
  }
}
