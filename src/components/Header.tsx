
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface HeaderProps {
  onResetApiKey: () => void;
}

const Header = ({ onResetApiKey }: HeaderProps) => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gemini-gradient p-1.5 rounded-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-xl">Landing Page Generator</h1>
          <div className="hidden md:flex items-center bg-muted text-xs px-2 py-0.5 rounded-full text-muted-foreground">
            Powered by Gemini AI
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetApiKey}
          >
            Change API Key
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
