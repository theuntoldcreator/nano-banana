import { Button } from "@/components/ui/button";

interface FilterTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Prompts" },
  { id: "Portrait", label: "Portraits" },
  { id: "Nature", label: "Landscapes" },
  { id: "Abstract", label: "Abstract" },
  { id: "Digital Art", label: "Digital Art" },
  { id: "Macro", label: "Photography" },
  { id: "Architecture", label: "Illustrations" },
];

export default function FilterTabs({ selectedCategory, onCategoryChange }: FilterTabsProps) {
  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className={
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }
              data-testid={`button-category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
