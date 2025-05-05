import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if the container is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [categories]);

  return (
    <div className="mb-6">
      <ScrollArea className={isScrollable ? "w-full" : ""}>
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 py-2"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              className={`whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-muted text-gray-300"
              } rounded-full px-4 py-2 text-sm font-medium transition-colors`}
              onClick={() => onChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
