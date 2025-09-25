import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Copy, Check } from "lucide-react";
import { type Prompt } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/prompts/${prompt.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      toast({
        title: "Prompt copied!",
        description: "The prompt has been copied to your clipboard.",
        variant: "default",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Digital Art": "bg-accent/20 text-accent",
      "Nature": "bg-success/20 text-success",
      "Abstract": "bg-secondary/20 text-secondary",
      "Portrait": "bg-accent/20 text-accent",
      "Vintage": "bg-accent/20 text-accent",
      "Surreal": "bg-secondary/20 text-secondary",
      "Macro": "bg-success/20 text-success",
      "Architecture": "bg-accent/20 text-accent",
    };
    return colors[category as keyof typeof colors] || "bg-muted/20 text-muted-foreground";
  };

  return (
    <div className="masonry-item group relative" data-testid={`card-prompt-${prompt.id}`}>
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
        <img 
          src={prompt.imageUrl} 
          alt={prompt.title}
          className="w-full h-auto object-cover"
          onError={(e) => {
            // Fallback image if the original fails to load
            e.currentTarget.src = "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
          }}
          data-testid={`img-prompt-${prompt.id}`}
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge className={getCategoryColor(prompt.category)} data-testid={`badge-category-${prompt.id}`}>
              {prompt.category}
            </Badge>
            <button 
              onClick={handleLike}
              className="flex items-center space-x-2 text-muted-foreground text-sm hover:text-primary transition-colors"
              disabled={likeMutation.isPending}
              data-testid={`button-like-${prompt.id}`}
            >
              <Heart className="w-4 h-4" />
              <span data-testid={`text-likes-${prompt.id}`}>{prompt.likes}</span>
            </button>
          </div>
          
          <div className="bg-muted rounded-lg p-3 font-mono text-sm text-muted-foreground mb-3">
            <span data-testid={`text-prompt-${prompt.id}`}>{prompt.prompt}</span>
          </div>
          
          <Button 
            onClick={copyPrompt}
            className={`copy-button w-full ${
              copied 
                ? "bg-success hover:bg-success/90 text-success-foreground" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            } py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2`}
            data-testid={`button-copy-${prompt.id}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
