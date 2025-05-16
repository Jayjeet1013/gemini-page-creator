
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
import { ComponentType, GenerateComponentParams } from "@/types/gemini";

interface PromptInputProps {
  onGenerate: (params: GenerateComponentParams) => void;
  isGenerating: boolean;
}

const PromptInput = ({ onGenerate, isGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("modern");
  const [tone, setTone] = useState("professional");
  const [componentType, setComponentType] = useState<ComponentType>("hero");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    onGenerate({
      prompt: prompt.trim(),
      componentType,
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

  const componentTypes: { label: string; value: ComponentType }[] = [
    { label: "Hero Section", value: "hero" },
    { label: "Features Section", value: "features" },
    { label: "Pricing Table", value: "pricing" },
    { label: "Testimonial", value: "testimonial" },
    { label: "Call to Action", value: "cta" },
    { label: "Header", value: "header" },
    { label: "Footer", value: "footer" },
    { label: "Sign Up Form", value: "signup" },
    { label: "Login Form", value: "login" },
    { label: "Contact Form", value: "contact" },
    { label: "About Section", value: "about" },
    { label: "FAQ Section", value: "faq" },
    { label: "Gallery/Portfolio", value: "gallery" },
    { label: "Statistics", value: "stats" },
    { label: "Team Section", value: "team" },
    { label: "Newsletter", value: "newsletter" }
  ];

  const styleOptions = [
    { label: "Modern & Clean", value: "modern" },
    { label: "Bold & Vibrant", value: "bold" },
    { label: "Minimalist", value: "minimal" },
    { label: "Gradient-rich", value: "gradient" },
    { label: "Corporate", value: "corporate" },
    { label: "Creative", value: "creative" },
    { label: "Playful", value: "playful" },
    { label: "Luxury", value: "luxury" }
  ];

  const toneOptions = [
    { label: "Professional", value: "professional" },
    { label: "Friendly", value: "casual" },
    { label: "Enthusiastic", value: "enthusiastic" },
    { label: "Formal", value: "formal" },
    { label: "Persuasive", value: "persuasive" },
    { label: "Inspirational", value: "inspirational" }
  ];

  return (
    <Card className="w-full border-2 border-gradient-to-r from-gemini-blue to-gemini-purple shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gemini-blue/10 to-gemini-purple/10 border-b">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <div className="bg-gemini-gradient p-2 rounded-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span>Design Your Component</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <span className="bg-gemini-gradient text-white p-1 rounded text-xs">1</span>
              Select Component Type
            </label>
            <Select value={componentType} onValueChange={(value) => setComponentType(value as ComponentType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select component type" />
              </SelectTrigger>
              <SelectContent>
                {componentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <span className="bg-gemini-gradient text-white p-1 rounded text-xs">2</span>
              Describe Your Component
            </label>
            <Textarea
              placeholder="Describe the component in detail, including colors, style preferences, content ideas, and any specific features you want (e.g., 'A vibrant blue hero section for a fitness app with motivational text and a signup form')"
              className="min-h-[120px] resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <span className="bg-gemini-gradient text-white p-1 rounded text-xs">3</span>
                Design Style
              </label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map(style => (
                    <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <span className="bg-gemini-gradient text-white p-1 rounded text-xs">4</span>
                Tone
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => (
                    <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gradient-to-r from-gemini-blue/5 to-gemini-purple/5 p-4">
        <Button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gemini-gradient hover:opacity-90 transition-opacity text-white font-medium p-6"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"></span>
              Creating Beautiful Component...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generate Stunning Component
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptInput;
