import { Button } from "@/components/ui/button";
import { Settings, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  onAdminClick: () => void;
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const { session } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

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
            {session ? (
              <>
                <Button 
                  onClick={onAdminClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-testid="button-admin"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="icon"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setLocation('/login')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}