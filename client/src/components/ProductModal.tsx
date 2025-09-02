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
import { Badge } from "./ui/badge";
import { Loader2, AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ProductCategory } from './ProductCategoryModal';

// Type pour les produits
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  isAvailable: boolean;
  imageUrl: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> & { id?: number }) => void;
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
  const [product, setProduct] = useState<Omit<Product, 'id'> & { id?: number }>({
    id: undefined,
    name: '',
    description: '',
    price: 0,
    categoryId: categories.length > 0 ? categories[0].id : 0,
    isAvailable: true,
    imageUrl: ''
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
      // Réinitialiser pour un nouveau produit (sans ID)
      setProduct({
        id: undefined,
        name: '',
        description: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : 0,
        isAvailable: true,
        imageUrl: ''
      });
    }
    setError(null);
  }, [editingProduct, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!product.name.trim()) {
      setError('Le nom du produit est requis.');
      return;
    }

    if (product.price <= 0) {
      setError('Le prix doit être supérieur à zéro.');
      return;
    }

    if (!product.categoryId) {
      setError('Veuillez sélectionner une catégorie.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Trouver le nom de la catégorie
      const category = categories.find(c => c.id === product.categoryId);

      // Préparer les données à sauvegarder
      const productToSave = {
        ...product,
        categoryName: category?.name || ''
      };

      // Appeler onSave avec les données
      await onSave(productToSave);

      // Fermer le modal seulement après une sauvegarde réussie
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProduct(prev => ({
      ...prev,
      isAvailable: checked
    }));
  };

  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({
      ...prev,
      categoryId: parseInt(value)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
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
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Nom du produit"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description du produit..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix (Ar)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="col-span-3"
                min="0"
                step="500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie
              </Label>
              <Select
                value={product.categoryId.toString()}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      <div className="flex items-center">
                        {category.name}

                        {!category.isActive && (
                          <Badge
                            className='bg-red-100 text-red-800 hover:bg-red-100 ml-2'
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">
                Disponible
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isAvailable"
                  checked={product.isAvailable}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isAvailable" className="cursor-pointer">
                  {product.isAvailable ? 'Oui' : 'Non'}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageInput" className="text-right">
                Image
              </Label>
              <div className="col-span-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    placeholder="URL de l'image (optionnel)"
                    className="flex-1"
                  />
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => document.getElementById('imageInput')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setProduct(prev => ({
                              ...prev,
                              imageUrl: event.target?.result as string
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Entrez une URL ou téléchargez une image locale
                </p>
              </div>
            </div>

            {product.imageUrl && (
              <div className="grid grid-cols-4 gap-4">
                <div className="text-right text-sm text-muted-foreground self-start pt-1">
                  Aperçu
                </div>
                <div className="col-span-3 rounded-md overflow-hidden border border-input w-24 h-24">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3e%3cpath fill=\'%23ccc\' d=\'M50 0a50 50 0 1 1 0 100A50 50 0 0 1 50 0zm-1 18c-1.82 0-3.53.5-5 1.35-2.86 1.72-4.8 4.86-4.8 8.44 0 5.4 4.4 9.8 9.8 9.8 5.4 0 9.8-4.4 9.8-9.8s-4.4-9.8-9.8-9.8zm0 44c-13.33 0-25 3.34-25 10v8h50v-8c0-6.66-11.67-10-25-10z\'/%3e%3c/svg%3e';
                    }}
                  />
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
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;