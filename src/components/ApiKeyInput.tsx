
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter your Gemini API key");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if the API key format is valid
      if (!apiKey.trim().startsWith("AI") || apiKey.length < 10) {
        toast.error("Invalid API key format");
        setIsLoading(false);
        return;
      }
      
      // Store the API key in local storage
      localStorage.setItem("gemini_api_key", apiKey.trim());
      
      // Notify the parent component
      onApiKeySubmit(apiKey.trim());
      toast.success("API key saved");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Enter your Gemini API Key</CardTitle>
        <CardDescription>
          You'll need a Google Gemini API key to generate landing pages.
          Get one from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a>.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="AI..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-gemini-gradient hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? "Validating..." : "Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApiKeyInput;
