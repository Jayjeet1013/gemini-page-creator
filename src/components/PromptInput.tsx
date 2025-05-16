
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
    { label: "Header", value: "header" },
    { label: "Footer", value: "footer" },
    { label: "Sign Up Form", value: "signup" },
    { label: "Login Form", value: "login" },
    { label: "Features Section", value: "features" },
    { label: "Pricing Table", value: "pricing" },
    { label: "Testimonial", value: "testimonial" },
    { label: "Call to Action", value: "cta" },
    { label: "Hero Section", value: "hero" },
    { label: "Contact Form", value: "contact" },
    { label: "About Section", value: "about" },
    { label: "FAQ Section", value: "faq" },
    { label: "Gallery/Portfolio", value: "gallery" },
    { label: "Statistics", value: "stats" },
    { label: "Team Section", value: "team" },
    { label: "Newsletter", value: "newsletter" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Zap className="h-5 w-5 text-gemini-deepblue" />
          Describe Your Component
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe the component you want to create... (e.g., 'A sleek signup form for a SaaS product with email and password fields')"
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Component Type</label>
              <Select value={componentType} onValueChange={(value) => setComponentType(value as ComponentType)}>
                <SelectTrigger>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gemini-gradient hover:opacity-90 transition-opacity"
        >
          {isGenerating ? "Generating..." : "Generate Component"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptInput;
