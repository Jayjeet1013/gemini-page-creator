
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import { GenerateLandingPageParams } from "@/types/gemini";

interface PromptInputProps {
  onGenerate: (params: GenerateLandingPageParams) => void;
  isGenerating: boolean;
}

const PromptInput = ({ onGenerate, isGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("modern");
  const [tone, setTone] = useState("professional");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "hero", 
    "features", 
    "testimonial", 
    "cta"
  ]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    onGenerate({
      prompt: prompt.trim(),
      sections: selectedSections,
      style,
      tone,
      industry: industry || undefined
    });
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", 
    "E-commerce", "Real Estate", "Travel", "Food & Restaurant",
    "Fitness", "Entertainment", "Marketing", "Non-profit"
  ];

  const toggleSection = (section: string) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter(s => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Zap className="h-5 w-5 text-gemini-deepblue" />
          Describe Your Landing Page
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe the landing page you want to create... (e.g., 'A landing page for a productivity app that helps remote teams collaborate better')"
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry (Optional)</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Industry</SelectItem>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind.toLowerCase()}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Design Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Clean</SelectItem>
                  <SelectItem value="minimal">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sections to Generate</label>
            <div className="flex flex-wrap gap-2">
              {["hero", "features", "testimonial", "pricing", "about", "cta", "contact"].map((section) => (
                <Button
                  key={section}
                  type="button"
                  variant={selectedSections.includes(section) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSection(section)}
                  className={`capitalize ${
                    selectedSections.includes(section) 
                      ? "bg-gemini-gradient" 
                      : "hover:bg-secondary/50"
                  }`}
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || isGenerating || selectedSections.length === 0}
          className="w-full bg-gemini-gradient hover:opacity-90 transition-opacity"
        >
          {isGenerating ? "Generating..." : "Generate Landing Page"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptInput;
