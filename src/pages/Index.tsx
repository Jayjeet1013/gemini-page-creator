
import { useEffect, useState } from "react";
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
        "Create a new version of this component with a fresh approach"
      );
      
      setGeneratedComponent(newComponent);
      toast.success(`${component.type} component regenerated!`);
    } catch (error) {
      console.error("Regeneration error:", error);
      toast.error(`Failed to regenerate ${component.type} component`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border shadow-sm mb-4">
                <div className="bg-gemini-gradient p-1 rounded-full">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Powered by Gemini AI</span>
              </div>
              
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gemini-gradient animate-gradient-shift">
                UI Component Generator
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Create beautiful, production-ready UI components in seconds with the power of AI
              </p>
            </div>

            <PromptInput 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
            />
            
            {generatedComponent && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-sm">
                  <h3 className="font-medium mb-2">Tips:</h3>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Click "Regenerate" to create a new version</li>
                    <li>View the HTML code by clicking the "HTML" tab</li>
                    <li>Copy the HTML to use in your project</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {isGenerating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="inline-block bg-gemini-gradient p-3 rounded-lg animate-pulse">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium">Generating Your Component...</h3>
                <p className="text-muted-foreground">
                  This may take a few moments as we craft the perfect component
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
      
      <footer className="py-4 border-t text-center text-sm text-muted-foreground bg-background">
        <p>Built with Lovable and Gemini AI &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
