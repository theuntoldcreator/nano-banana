import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface NavigationProps {
  onAdminClick: () => void;
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  return (
    <nav className="bg-card/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.5 2A7.5 7.5 0 0 0 2 9.5c0 1.6.5 3.1 1.3 4.3L9.5 22l6.2-8.2c.8-1.2 1.3-2.7 1.3-4.3A7.5 7.5 0 0 0 9.5 2z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gemini Nano Banana
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">Gallery</a>
            <a href="#categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={onAdminClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-admin"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1.5V3.5L21 9ZM3 9L9 3.5V1.5L3 7V9ZM15 12.5C15 14.4 13.4 16 11.5 16C9.6 16 8 14.4 8 12.5C8 10.6 9.6 9 11.5 9C13.4 9 15 10.6 15 12.5ZM20 20C20 20.6 19.6 21 19 21H5C4.4 21 4 20.6 4 20V19C4 17.9 4.9 17 6 17H18C19.1 17 20 17.9 20 19V20Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
