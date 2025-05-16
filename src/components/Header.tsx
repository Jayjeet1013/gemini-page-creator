
import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gemini-gradient p-1.5 rounded-md">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-xl">UI Component Generator</h1>
          <div className="hidden md:flex items-center bg-muted text-xs px-2 py-0.5 rounded-full text-muted-foreground">
            Powered by Gemini 1.5 Flash
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
