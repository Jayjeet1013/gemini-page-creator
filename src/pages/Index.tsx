
import { useState } from "react";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import Header from "@/components/Header";
import ComponentPreview from "@/components/PagePreview";
import PromptInput from "@/components/PromptInput";
import { ComponentGeneratorService } from "@/services/landingPageService";
import { GenerateComponentParams, GeneratedComponent } from "@/types/gemini";

// Fixed Gemini API key
const GEMINI_API_KEY = "AIzaSyDHrZrJY9LyzpNEUTg76vJ2jYryTs2Vrzc";

const Index = () => {
  const [componentService] = useState<ComponentGeneratorService>(
    new ComponentGeneratorService(GEMINI_API_KEY)
  );
  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGenerate = async (params: GenerateComponentParams) => {
    setIsGenerating(true);
    try {
      const component = await componentService.generateComponent(params);
      setGeneratedComponent(component);
      toast.success("Component generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate component. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateComponent = async (component: GeneratedComponent) => {
    setIsRegenerating(true);
    try {
      const newComponent = await componentService.regenerateComponent(
        component,
        "Create a new visually striking version of this component with beautiful colors, gradients, and layout"
      );
      
      setGeneratedComponent(newComponent);
      toast.success(`${component.type} component regenerated with a fresh design!`);
    } catch (error) {
      console.error("Regeneration error:", error);
      toast.error(`Failed to regenerate ${component.type} component`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50">
      <Header />
      
      <main className="flex-1 container py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border shadow-sm mb-4">
                <div className="bg-gemini-gradient p-1.5 rounded-full">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Powered by Gemini AI</span>
              </div>
              
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gemini-gradient animate-gradient-shift">
                UI Component Generator
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Create beautiful, visually striking UI components in seconds with the power of AI
              </p>
            </div>

            <PromptInput 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
            />
            
            {generatedComponent && (
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-gemini-blue/5 to-gemini-purple/5 rounded-lg text-sm border shadow-sm">
                  <h3 className="font-medium mb-3 text-lg flex items-center gap-2">
                    <span className="bg-gemini-gradient text-white p-1 rounded-full">
                      <Zap className="h-4 w-4" />
                    </span>
                    Pro Tips:
                  </h3>
                  <ul className="space-y-2 list-inside text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-gemini-purple inline-block mt-1">•</span>
                      <span>Click <strong>Regenerate</strong> to create a different design variation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gemini-purple inline-block mt-1">•</span>
                      <span>Switch to the <strong>HTML</strong> tab to view and copy the code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gemini-purple inline-block mt-1">•</span>
                      <span>Be specific in your prompts about colors and style for better results</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {isGenerating ? (
            <div className="h-96 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl border shadow-sm">
              <div className="text-center space-y-4 p-8">
                <div className="inline-block bg-gemini-gradient p-3 rounded-lg mx-auto animate-pulse">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium">Creating Your Component...</h3>
                <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gemini-gradient animate-pulse-slow"></div>
                </div>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Gemini AI is crafting a beautiful component based on your specifications
                </p>
              </div>
            </div>
          ) : (
            <ComponentPreview 
              component={generatedComponent} 
              onRegenerate={handleRegenerateComponent} 
              isRegenerating={isRegenerating}
            />
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t text-center text-sm text-muted-foreground bg-gradient-to-r from-gemini-blue/5 to-gemini-purple/5">
        <div className="container">
          <p className="flex items-center justify-center gap-2">
            <span>Built with</span>
            <span className="bg-gemini-gradient px-2 py-0.5 rounded text-white text-xs font-medium">Gemini AI</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
