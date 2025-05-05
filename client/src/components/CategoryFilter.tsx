import { AnimatePresence, motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-1 min-w-min">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`relative flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category 
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category}
          {activeCategory === category && (
            <AnimatePresence>
              <motion.span
                layoutId="activePill"
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: -1 }}
              />
            </AnimatePresence>
          )}
        </button>
      ))}
    </div>
  );
}