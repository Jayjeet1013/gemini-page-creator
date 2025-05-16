
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ApiKeyInput from "@/components/ApiKeyInput";
import Header from "@/components/Header";
import PagePreview from "@/components/PagePreview";
import PromptInput from "@/components/PromptInput";
import { LandingPageService } from "@/services/landingPageService";
import { GenerateLandingPageParams, LandingPageSection } from "@/types/gemini";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [landingPageService, setLandingPageService] = useState<LandingPageService | null>(null);
  const [generatedSections, setGeneratedSections] = useState<LandingPageSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setLandingPageService(new LandingPageService(savedApiKey));
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setLandingPageService(new LandingPageService(key));
  };

  const handleResetApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey(null);
    setLandingPageService(null);
  };

  const handleGenerate = async (params: GenerateLandingPageParams) => {
    if (!landingPageService) return;
    
    setIsGenerating(true);
    try {
      const sections = await landingPageService.generateLandingPage(params);
      setGeneratedSections(sections);
      toast.success("Landing page generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate landing page. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSection = async (section: LandingPageSection) => {
    if (!landingPageService || !apiKey) return;
    
    setRegeneratingSection(section.type);
    try {
      const newSection = await landingPageService.regenerateSection(
        section,
        "Create a new version of this section with a fresh approach"
      );
      
      // Replace the old section with the new one
      setGeneratedSections(prev => 
        prev.map(s => s.type === section.type ? newSection : s)
      );
      
      toast.success(`${section.type} section regenerated!`);
    } catch (error) {
      console.error("Regeneration error:", error);
      toast.error(`Failed to regenerate ${section.type} section`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleCopyHtml = () => {
    toast.success("HTML copied to clipboard!");
  };

  // If no API key is provided, show the API key input
  if (!apiKey) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border shadow-sm mb-4">
                <div className="bg-gemini-gradient p-1 rounded-full">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">Powered by Gemini AI</span>
              </div>
              
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gemini-gradient animate-gradient-shift">
                Landing Page Generator
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Create beautiful, production-ready landing pages in seconds with the power of AI
              </p>
            </div>
            
            <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
          </div>
        </div>
        
        <footer className="py-4 border-t text-center text-sm text-muted-foreground bg-background">
          <p>Built with Lovable and Gemini AI &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onResetApiKey={handleResetApiKey} />
      
      <main className="flex-1 container py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <PromptInput 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
            />
            
            {generatedSections.length > 0 && (
              <div className="p-4 bg-muted rounded-lg text-sm">
                <h3 className="font-medium mb-2">Tips:</h3>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Click "Regenerate" on any section to create a new version</li>
                  <li>View the HTML code by clicking the "HTML" tab</li>
                  <li>Copy the entire HTML to use in your project</li>
                </ul>
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
                <h3 className="text-xl font-medium">Generating Your Landing Page...</h3>
                <p className="text-muted-foreground">
                  This may take a few moments as we craft the perfect landing page
                </p>
              </div>
            </div>
          ) : (
            <PagePreview 
              sections={generatedSections} 
              onRegenerateSection={handleRegenerateSection} 
              isRegenerating={!!regeneratingSection}
              regeneratingSection={regeneratingSection}
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
