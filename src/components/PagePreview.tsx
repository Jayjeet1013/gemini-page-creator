
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedComponent } from "@/types/gemini";
import { Eye, Code, RefreshCw } from "lucide-react";

interface ComponentPreviewProps {
  component: GeneratedComponent | null;
  onRegenerate: (component: GeneratedComponent) => void;
  isRegenerating: boolean;
}

const ComponentPreview = ({ 
  component, 
  onRegenerate, 
  isRegenerating 
}: ComponentPreviewProps) => {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const handleCopyHtml = () => {
    if (!component?.html) return;
    
    navigator.clipboard.writeText(component.html);
    // Toast notification handled by parent component
  };

  const handleRegenerate = () => {
    if (component) {
      onRegenerate(component);
    }
  };

  if (!component) {
    return (
      <div className="w-full p-8 text-center border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          Generated component will appear here.
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
            Copy HTML
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="bg-muted p-2 flex items-center justify-between">
          <span className="font-medium capitalize px-2">{component.type} Component</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`flex items-center gap-1 ${isRegenerating ? 'animate-pulse-slow' : ''}`}
          >
            <RefreshCw className="h-4 w-4" />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        </div>
        
        <div className="border-t">
          {viewMode === "preview" ? (
            <div 
              className="p-4"
              dangerouslySetInnerHTML={{ __html: component.html || "" }}
            />
          ) : (
            <div className="p-4 overflow-auto max-h-[500px]">
              <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-muted p-4 rounded-md">
                {component.html || "No HTML generated"}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComponentPreview;
