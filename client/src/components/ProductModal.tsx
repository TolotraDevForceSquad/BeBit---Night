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
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { ProductCategory } from "./ProductCategoryModal";

// Type pour les produits
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  isAvailable: boolean;
  imageUrl?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct: Product | null;
  categories: ProductCategory[];
}

const ProductModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProduct,
  categories
}: ProductModalProps) => {
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser le formulaire lorsqu'on édite un produit existant
  useEffect(() => {
    if (editingProduct) {
      setProduct({
        ...editingProduct
      });
    } else {
      // Réinitialiser pour un nouveau produit
      setProduct({
        id: Date.now(),
        name: '',
        description: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : 0,
        isAvailable: true,
      });
    }
  }, [editingProduct, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!product.name.trim()) {
      setError("Veuillez entrer un nom pour le produit.");
      return;
    }
    
    if (product.price <= 0) {
      setError("Le prix doit être supérieur à zéro.");
      return;
    }
    
    if (product.categoryId === 0 && categories.length > 0) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simuler une requête API
    setTimeout(() => {
      const category = categories.find(c => c.id === product.categoryId);
      const productWithCategoryName = {
        ...product,
        categoryName: category?.name || ''
      };
      
      onSave(productWithCategoryName);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Modifiez les détails du produit.' 
              : 'Ajoutez un nouveau produit à votre catalogue.'}
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
                value={product.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Coca-Cola, Burger, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description du produit (optionnel)"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Prix (Ar)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: 5000"
                min="0"
                step="500"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Catégorie</Label>
              {categories.length > 0 ? (
                <Select 
                  value={product.categoryId.toString()} 
                  onValueChange={(val) => setProduct(prev => ({ ...prev, categoryId: parseInt(val) }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="col-span-3 text-sm text-muted-foreground">
                  Aucune catégorie disponible. Veuillez d'abord créer une catégorie.
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">Disponible</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isAvailable"
                  checked={product.isAvailable}
                  onCheckedChange={(checked) => setProduct(prev => ({ ...prev, isAvailable: checked }))}
                />
                <Label htmlFor="isAvailable" className="cursor-pointer">
                  {product.isAvailable ? 'Produit disponible' : 'Produit indisponible'}
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={product.imageUrl || ''}
                onChange={handleChange}
                className="col-span-3"
                placeholder="URL de l'image (optionnel)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;