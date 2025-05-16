
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingPageSection } from "@/types/gemini";
import { Eye, Code, RefreshCw } from "lucide-react";

interface PagePreviewProps {
  sections: LandingPageSection[];
  onRegenerateSection: (section: LandingPageSection) => void;
  isRegenerating: boolean;
  regeneratingSection: string | null;
}

const PagePreview = ({ 
  sections, 
  onRegenerateSection, 
  isRegenerating,
  regeneratingSection 
}: PagePreviewProps) => {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const handleCopyHtml = () => {
    const allHtml = sections.map(section => section.html).join('\n\n');
    navigator.clipboard.writeText(allHtml);
    // Toast notification handled by parent component
  };

  const handleRegenerateSection = (section: LandingPageSection) => {
    onRegenerateSection(section);
  };

  if (!sections.length) {
    return (
      <div className="w-full p-8 text-center border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          Generated landing page sections will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <Tabs 
          defaultValue="preview" 
          className="w-auto" 
          onValueChange={(value) => setViewMode(value as "preview" | "code")}
        >
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="h-4 w-4" /> HTML
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {viewMode === "code" && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopyHtml}
          >
            Copy All HTML
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={`${section.type}-${index}`} className="overflow-hidden">
            <div className="bg-muted p-2 flex items-center justify-between">
              <span className="font-medium capitalize px-2">{section.type} Section</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleRegenerateSection(section)}
                disabled={isRegenerating}
                className={`flex items-center gap-1 ${regeneratingSection === section.type ? 'animate-pulse-slow' : ''}`}
              >
                <RefreshCw className="h-4 w-4" />
                {regeneratingSection === section.type ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>
            
            <div className="border-t">
              {viewMode === "preview" ? (
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: section.html || "" }}
                />
              ) : (
                <div className="p-4 overflow-auto max-h-[500px]">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-muted p-4 rounded-md">
                    {section.html || "No HTML generated"}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PagePreview;
