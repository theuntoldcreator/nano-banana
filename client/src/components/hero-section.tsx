import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  const handleSearch = () => {
    // Search functionality is handled by the parent component
  };

  return (
    <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          AI Prompt Gallery
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover amazing AI-generated images with copy-ready prompts for Gemini Nano Banana. 
          Browse, copy, and create stunning visuals with ease.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Search prompts, styles, or keywords..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent h-14"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium"
              data-testid="button-search"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
