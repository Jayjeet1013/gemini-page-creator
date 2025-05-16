
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedComponent } from "@/types/gemini";
import { Eye, Code, RefreshCw, Clipboard, Check } from "lucide-react";
import { toast } from "sonner";

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
  const [copied, setCopied] = useState(false);

  const handleCopyHtml = () => {
    if (!component?.html) return;
    
    navigator.clipboard.writeText(component.html);
    setCopied(true);
    toast.success("HTML code copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (component) {
      onRegenerate(component);
    }
  };

  if (!component) {
    return (
      <div className="w-full h-96 p-8 text-center border rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 flex flex-col items-center justify-center">
        <div className="bg-gemini-gradient text-white p-3 rounded-full mb-4">
          <Eye className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-medium mb-2">Your Component Will Appear Here</h3>
        <p className="text-muted-foreground max-w-md">
          Use the form on the left to describe and generate your component. 
          Be specific about colors, layout, and content for best results.
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
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" /> 
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" /> 
                Copy HTML
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="overflow-hidden shadow-lg border-2 border-gemini-blue/20">
        <div className="bg-gradient-to-r from-gemini-blue/10 to-gemini-purple/10 p-3 flex items-center justify-between">
          <span className="font-medium capitalize px-2 flex items-center gap-2">
            <div className="bg-gemini-gradient text-white p-1 rounded-full">
              <span className="block h-3 w-3"></span>
            </div>
            {component.type} Component
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`flex items-center gap-1 ${isRegenerating ? 'animate-pulse-slow' : ''}`}
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        </div>
        
        <div className="border-t">
          {viewMode === "preview" ? (
            <div 
              className="max-h-[600px] overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: component.html || "" }}
            />
          ) : (
            <div className="p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-muted p-4 rounded-md">
                {component.html || "No HTML generated"}
              </pre>
            </div>
          )}
        </div>
      </Card>
      
      {viewMode === "preview" && (
        <div className="text-xs text-muted-foreground text-center">
          Scroll within the preview to see the full component if needed
        </div>
      )}
    </div>
  );
};

export default ComponentPreview;
