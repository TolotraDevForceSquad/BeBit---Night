import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// Type pour les catégories de produits
export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
}

interface ProductCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: ProductCategory) => void;
  editingCategory: ProductCategory | null;
}

const ProductCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCategory 
}: ProductCategoryModalProps) => {
  const [category, setCategory] = useState<ProductCategory>({
    id: 0,
    name: '',
    description: '',
    isActive: true,
    productCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le formulaire lorsqu'on édite une catégorie existante
  useEffect(() => {
    if (editingCategory) {
      setCategory({
        ...editingCategory
      });
    } else {
      // Réinitialiser pour une nouvelle catégorie
      setCategory({
        id: Date.now(),
        name: '',
        description: '',
        isActive: true,
        productCount: 0
      });
    }
  }, [editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!category.name.trim()) {
      setError("Veuillez entrer un nom pour la catégorie.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      onSave(category);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? 'Modifiez les détails de la catégorie de produits.' 
              : 'Créez une nouvelle catégorie pour organiser vos produits.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Boissons, Nourriture, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input
                id="description"
                name="description"
                value={category.description || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description de la catégorie (optionnel)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCategoryModal;