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
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// Type pour les catégories de produits
export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  productCount?: number;
}

interface ProductCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { id?: number; name: string; description?: string; isActive: boolean }) => void;
  editingCategory: ProductCategory | null;
  productCount?: number;
}

const ProductCategoryModal = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  productCount = 0
}: ProductCategoryModalProps) => {
  const [category, setCategory] = useState<{ id?: number; name: string; description?: string; isActive: boolean; productCount?: number }>({
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
        id: editingCategory.id,
        name: editingCategory.name,
        description: editingCategory.description,
        isActive: editingCategory.isActive,
        productCount: editingCategory.productCount || productCount
      });
    } else {
      setCategory({
        name: '',
        description: '',
        isActive: true,
        productCount: 0
      });
    }
  }, [editingCategory, productCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name.trim()) {
      setError('Le nom de la catégorie est requis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // On ne passe pas productCount à l'API
      const { id, name, description, isActive } = category;
      onSave(editingCategory ? { id, name, description, isActive } : { name, description, isActive });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCategory(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? 'Modifiez les détails de la catégorie.'
              : 'Ajoutez une nouvelle catégorie pour vos produits.'}
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
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Boissons, Plats, Desserts, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={category.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description de la catégorie..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={category.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {category.isActive ? 'Oui' : 'Non'}
                </Label>
              </div>
            </div>
            
            {editingCategory && category.productCount !== undefined && category.productCount > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-sm text-muted-foreground">
                  Produits
                </div>
                <div className="col-span-3 text-sm">
                  Cette catégorie contient {category.productCount} produits
                </div>
              </div>
            )}
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