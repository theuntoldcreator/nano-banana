import { useQuery } from "@tanstack/react-query";
import { type Prompt } from "@shared/schema";
import PromptCard from "@/components/prompt-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface GalleryProps {
  searchQuery: string;
  selectedCategory: string;
}

export default function Gallery({ searchQuery, selectedCategory }: GalleryProps) {
  const { data: prompts, isLoading, error } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts", { category: selectedCategory !== "all" ? selectedCategory : undefined, search: searchQuery || undefined }],
  });

  if (isLoading) {
    return (
      <main className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="masonry-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="masonry-item">
                <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load prompts</h3>
            <p className="text-muted-foreground">Please try again later or check your connection.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <main className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-muted/50 border border-border rounded-lg p-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria." 
                : "No prompts have been added yet."}
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Searched for: "<span className="font-mono">{searchQuery}</span>"
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 bg-background" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="masonry-grid">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg font-medium"
            data-testid="button-load-more"
          >
            Load More Prompts
          </Button>
        </div>
      </div>
    </main>
  );
}
