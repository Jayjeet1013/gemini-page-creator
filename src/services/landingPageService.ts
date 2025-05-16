
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
        this.createHtmlPrompt(componentType, componentContent, style)
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

  private createHtmlPrompt(componentType: ComponentType, content: string, style: string): string {
    return `
Generate a beautiful, visually appealing ${componentType} component based on this content: ${content}

Requirements:
- Create a HIGHLY VISUALLY APPEALING component with rich visual design
- Use attractive color schemes and gradients
- Include ample padding and margin for good spacing
- Design must be fully responsive
- Use semantic HTML5
- Implement modern design style: ${style}
- Use Tailwind CSS classes for styling
- Add visual elements like icons, decorative shapes, or gradients
- Include placeholder images using URLs like "https://images.unsplash.com/photo-[id]" where appropriate
- Make good use of whitespace
- Include hover effects where appropriate
- Add subtle animations using Tailwind classes
- Ensure excellent mobile responsiveness
- Make text readable with good contrast
- Structure content with visual hierarchy

Output ONLY the HTML with inline Tailwind classes, nothing else.
`;
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
        Create content for a visually appealing website header with:
        - Eye-catching logo/brand name
        - Navigation links (3-5 items)
        - Call-to-action button with compelling text
        - Consider a visual accent or gradient
        
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
        Create content for a visually striking website footer with:
        - Brand info and copyright text
        - Social media links with appropriate icons
        - Organized navigation sections
        - Optional newsletter signup or contact
        
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
        Create content for a visually compelling sign-up form with:
        - Attention-grabbing headline and value proposition
        - Clear, concise description
        - Minimal but necessary form fields
        - Eye-catching submit button
        - Trust indicators (privacy policy, secure icon, etc.)
        
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
          "privacyText": "We respect your privacy...",
          "benefits": ["Benefit 1", "Benefit 2"] // Optional list of benefits
        }
      `,
      
      login: `
        Create content for an aesthetically pleasing login form with:
        - Welcoming headline
        - Clean, professional form fields
        - Clear call-to-action button
        - Options for password recovery and new account creation
        - Optional: social login options
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Login",
          "subtitle": "Optional welcome message",
          "fields": [
            { "name": "email", "label": "Email", "type": "email", "required": true },
            { "name": "password", "label": "Password", "type": "password", "required": true }
          ],
          "buttonText": "Log In",
          "forgotPasswordText": "Forgot password?",
          "signUpText": "Don't have an account? Sign up",
          "socialLogins": ["Google", "Apple", "Facebook"] // Optional
        }
      `,
      
      features: `
        Create content for a visually impressive features section with:
        - Compelling section headline
        - Engaging introductory text
        - 3-6 feature cards with:
          - Feature name
          - Brief, benefit-focused description
          - Relevant icon name from lucide-react
          - Optional visual accent or highlight
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Features headline",
          "description": "Section description",
          "features": [
            {
              "name": "Feature 1",
              "description": "Feature 1 description that focuses on benefits",
              "icon": "zap", // Use names from lucide-react icons
              "highlight": true // Optional, indicate if feature should be visually highlighted
            }
          ]
        }
      `,
      
      pricing: `
        Create content for a visually striking pricing table with:
        - Attention-grabbing headline
        - Clear value proposition
        - 2-4 distinct pricing tiers with:
          - Tier name
          - Price and billing period
          - Highlighted key features
          - Clear CTA button
          - Optional most popular/recommended tag
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Pricing Plans",
          "description": "Choose a plan that works for you",
          "tiers": [
            {
              "name": "Basic",
              "price": "$9",
              "period": "month",
              "description": "For individuals",
              "features": ["Feature 1", "Feature 2"],
              "buttonText": "Get Started",
              "isPopular": false,
              "accentColor": "#4F46E5" // Optional color for pricing tier
            }
          ]
        }
      `,
      
      testimonial: `
        Create content for a compelling testimonial section with:
        - Strong headline about social proof
        - 1-3 testimonials featuring:
          - Authentic-sounding quote (specific details, not generic praise)
          - Customer name, role, and company
          - Optional avatar description or industry
          - Optional company logo reference
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "What Our Clients Say",
          "subtitle": "Optional subheading",
          "testimonials": [
            {
              "quote": "Specific, detailed testimonial with concrete results or experience",
              "name": "Client Name",
              "role": "Position",
              "company": "Company Name",
              "industry": "Tech" // Optional
            }
          ]
        }
      `,
      
      cta: `
        Create content for an eye-catching call-to-action section with:
        - Bold, action-oriented headline
        - Compelling supporting text that creates urgency
        - Primary button with strong action text
        - Optional secondary button
        - Visual elements description (background, accent, etc.)
        
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
          },
          "background": "gradient" // Optional: gradient, image, color, pattern
        }
      `,
      
      hero: `
        Create content for a visually stunning hero section with:
        - Bold, attention-grabbing headline
        - Compelling subheadline with clear value proposition
        - Primary CTA button with strong action text
        - Optional secondary CTA or trust indicators
        - Visual elements description (image, pattern, background suggestion)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "headline": "Main attention-grabbing headline",
          "subheadline": "Supporting value proposition",
          "buttonText": "Primary CTA text",
          "secondaryButtonText": "Secondary CTA text", // Optional
          "visualElement": "Abstract pattern", // Suggestion for visual element
          "backgroundStyle": "gradient" // gradient, image, solid, pattern
        }
      `,
      
      contact: `
        Create content for a welcoming contact section with:
        - Friendly, inviting headline
        - Clear, concise message about getting in touch
        - Well-structured contact form with necessary fields
        - Additional contact methods (email, phone, address)
        - Optional map reference or office hours
        
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
          },
          "officeHours": "Monday-Friday: 9am-5pm" // Optional
        }
      `,
      
      about: `
        Create content for a compelling about section with:
        - Engaging headline that captures the brand essence
        - Authentic company story or mission
        - Key company values or principles
        - Team member highlights (if applicable)
        - Visual elements description (timeline, milestones, etc.)
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "About Us",
          "story": "Company story/mission",
          "tagline": "Short company tagline", // Optional
          "values": ["Value 1", "Value 2"],
          "team": [
            {
              "name": "Team Member",
              "role": "Position",
              "bio": "Brief bio"
            }
          ],
          "milestones": [ // Optional
            { "year": "2020", "achievement": "Founded the company" }
          ]
        }
      `,
      
      faq: `
        Create content for an informative FAQ section with:
        - Clear headline and introduction
        - 4-8 well-structured question and answer pairs
        - Questions that address common concerns or objections
        - Concise yet comprehensive answers
        - Optional CTA for additional questions
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Frequently Asked Questions",
          "description": "Find answers to common questions", // Optional
          "items": [
            {
              "question": "Question 1",
              "answer": "Clear and concise answer"
            }
          ],
          "ctaText": "Still have questions? Contact us" // Optional
        }
      `,
      
      gallery: `
        Create content for a visually striking gallery/portfolio section with:
        - Engaging section headline
        - Brief descriptive text
        - 4-8 portfolio items with:
          - Project/item title
          - Category or type
          - Description
          - Optional image description
        
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
              "description": "Brief but compelling project description",
              "imageKeywords": "modern design architecture" // Optional: keywords for images
            }
          ],
          "filters": ["All", "Web Design", "Branding"] // Optional: filter categories
        }
      `,
      
      stats: `
        Create content for a visually impressive statistics section with:
        - Impactful headline
        - Brief context for the numbers
        - 3-6 key statistics with:
          - Bold, attention-grabbing number
          - Clear label
          - Optional brief supporting text
          - Optional icon suggestion
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Our Impact",
          "description": "The results speak for themselves", // Optional
          "stats": [
            {
              "value": "100+",
              "label": "Clients",
              "description": "Happy clients worldwide", // Optional
              "icon": "users" // Optional, use names from lucide-react icons
            }
          ]
        }
      `,
      
      team: `
        Create content for an engaging team section with:
        - Welcoming headline about the team
        - Brief introduction to the team's expertise
        - 3-8 team members with:
          - Name and role
          - Brief compelling bio highlighting expertise
          - Optional social links
          - Optional fun fact or specialty
        
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
              "name": "Full Name",
              "role": "Position",
              "bio": "Brief engaging bio highlighting expertise and personality",
              "socialLinks": ["linkedin", "twitter"], // Optional
              "specialty": "Area of expertise" // Optional
            }
          ]
        }
      `,
      
      newsletter: `
        Create content for an attention-grabbing newsletter signup section with:
        - Compelling headline about staying updated
        - Brief value proposition (what subscribers will gain)
        - Simple signup form with email field
        - Strong call-to-action button
        - Reassuring privacy message
        
        Style: ${style}
        Tone: ${tone}
        ${industryContext}
        
        Based on this prompt: ${prompt}
        
        Format your response as JSON with these fields:
        {
          "title": "Subscribe to Our Newsletter",
          "description": "Get valuable insights and updates",
          "benefits": ["Benefit 1", "Benefit 2"], // Optional list of subscriber benefits
          "buttonText": "Subscribe",
          "privacyText": "We respect your privacy and will never share your information",
          "frequency": "Weekly" // Optional: how often newsletters are sent
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
        
        Make this version MORE VISUALLY APPEALING with:
        - Bold design choices
        - Attractive color combinations
        - Creative layout
        - Strong visual elements
      `;
      
      const newContent = await this.client.generate(enhancedPrompt);
      const newHtml = await this.client.generateHtml(
        this.createHtmlPrompt(component.type, newContent, "modern")
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
