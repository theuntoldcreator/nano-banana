import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FilterTabs from "@/components/filter-tabs";
import Gallery from "@/components/gallery";
import AdminPanel from "@/components/admin-panel";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAdminClick={() => setIsAdminOpen(true)} />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FilterTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <Gallery searchQuery={searchQuery} selectedCategory={selectedCategory} />
      {session && <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />}
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5 2A7.5 7.5 0 0 0 2 9.5c0 1.6.5 3.1 1.3 4.3L9.5 22l6.2-8.2c.8-1.2 1.3-2.7 1.3-4.3A7.5 7.5 0 0 0 9.5 2z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Gemini Nano Banana
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                The ultimate prompt gallery for AI image generation. Discover, copy, and create amazing visuals with our curated collection of prompts.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Gemini Nano Banana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}