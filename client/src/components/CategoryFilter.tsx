import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange
}: CategoryFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 whitespace-nowrap scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className={`
            rounded-full px-4 py-2 text-sm font-medium
            ${activeCategory === category 
              ? "bg-primary text-white border-transparent" 
              : "bg-transparent border-muted-foreground/20 text-muted-foreground hover:bg-muted"}
          `}
          onClick={() => onChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}