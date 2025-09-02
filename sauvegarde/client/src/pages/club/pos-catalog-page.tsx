import React, { useState, useCallback } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  PlusCircle,
  Settings,
  Trash,
  Tag,
  TagsIcon,
  Pencil,
  Clipboard,
  ClipboardCheck,
  Check,
  X
} from 'lucide-react';
import ProductCategoryModal, { ProductCategory } from '../../components/ProductCategoryModal';
import ProductModal, { Product } from '../../components/ProductModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

// Données fictives pour les catégories
const initialCategories: ProductCategory[] = [
  { id: 1, name: "Boissons", description: "Boissons fraîches et chaudes", isActive: true, productCount: 8 },
  { id: 2, name: "Cocktails", description: "Cocktails avec et sans alcool", isActive: true, productCount: 12 },
  { id: 3, name: "Snacks", description: "Petites collations", isActive: true, productCount: 6 },
  { id: 4, name: "Plats", description: "Plats principaux", isActive: true, productCount: 4 },
  { id: 5, name: "Desserts", description: "Pâtisseries et desserts", isActive: false, productCount: 3 },
];

// Données fictives pour les produits
const initialProducts: Product[] = [
  { id: 1, name: "Coca-Cola", description: "33cl", price: 5000, categoryId: 1, categoryName: "Boissons", isAvailable: true, imageUrl: "" },
  { id: 2, name: "Eau minérale", description: "50cl", price: 3000, categoryId: 1, categoryName: "Boissons", isAvailable: true, imageUrl: "" },
  { id: 3, name: "Mojito", description: "Cocktail à base de rhum, menthe et citron vert", price: 15000, categoryId: 2, categoryName: "Cocktails", isAvailable: true, imageUrl: "" },
  { id: 4, name: "Piña Colada", description: "Cocktail à base de rhum, ananas et coco", price: 15000, categoryId: 2, categoryName: "Cocktails", isAvailable: true, imageUrl: "" },
  { id: 5, name: "Chips", description: "Sachet de chips", price: 5000, categoryId: 3, categoryName: "Snacks", isAvailable: true, imageUrl: "" },
  { id: 6, name: "Cacahuètes", description: "Cacahuètes grillées et salées", price: 4000, categoryId: 3, categoryName: "Snacks", isAvailable: true, imageUrl: "" },
  { id: 7, name: "Burger", description: "Burger avec frites", price: 25000, categoryId: 4, categoryName: "Plats", isAvailable: true, imageUrl: "" },
  { id: 8, name: "Pizza Margherita", description: "Pizza classique tomate mozzarella", price: 30000, categoryId: 4, categoryName: "Plats", isAvailable: true, imageUrl: "" },
  { id: 9, name: "Tiramisu", description: "Dessert italien au café", price: 12000, categoryId: 5, categoryName: "Desserts", isAvailable: false, imageUrl: "" },
  { id: 10, name: "Mousse au chocolat", description: "Mousse au chocolat noir", price: 10000, categoryId: 5, categoryName: "Desserts", isAvailable: true, imageUrl: "" },
];

const POSCatalogPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // États pour les données
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // États pour les modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'product', item: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || product.categoryId.toString() === categoryFilter;
    const matchesAvailability = availabilityFilter === "all" ||
      (availabilityFilter === "available" && product.isAvailable) ||
      (availabilityFilter === "unavailable" && !product.isAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Callbacks pour la gestion des catégories
  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: ProductCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  }, []);

  const handleDeleteCategory = useCallback((category: ProductCategory) => {
    setItemToDelete({ type: 'category', item: category });
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteItem = useCallback(() => {
    if (!itemToDelete) return;

    setIsLoading(true);

    setTimeout(() => {
      if (itemToDelete.type === 'category') {
        const category = itemToDelete.item as ProductCategory;
        // Vérifier si la catégorie a des produits
        const hasProducts = products.some(p => p.categoryId === category.id);

        if (hasProducts) {
          toast({
            title: "Impossible de supprimer",
            description: "Cette catégorie contient des produits. Veuillez d'abord supprimer ou déplacer ces produits.",
            variant: "destructive",
          });
        } else {
          const updatedCategories = categories.filter(c => c.id !== category.id);
          setCategories(updatedCategories);
          toast({
            title: "Catégorie supprimée",
            description: `La catégorie "${category.name}" a été supprimée avec succès.`,
            variant: "default",
          });
        }
      } else if (itemToDelete.type === 'product') {
        const product = itemToDelete.item as Product;
        const updatedProducts = products.filter(p => p.id !== product.id);
        setProducts(updatedProducts);

        // Mettre à jour le compteur de produits dans la catégorie
        const updatedCategories = categories.map(category => {
          if (category.id === product.categoryId) {
            return {
              ...category,
              productCount: (category.productCount || 0) - 1
            };
          }
          return category;
        });
        setCategories(updatedCategories);

        toast({
          title: "Produit supprimé",
          description: `Le produit "${product.name}" a été supprimé avec succès.`,
          variant: "default",
        });
      }

      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }, 500);
  }, [itemToDelete, products, categories, toast]);

  const handleSaveCategory = useCallback((category: ProductCategory) => {
    setIsLoading(true);

    setTimeout(() => {
      let updatedCategories;
      const isNew = !categories.some(c => c.id === category.id);

      if (isNew) {
        // Ajout d'une nouvelle catégorie
        updatedCategories = [...categories, { ...category, productCount: 0 }];
        toast({
          title: "Catégorie ajoutée",
          description: `La catégorie "${category.name}" a été ajoutée avec succès.`,
          variant: "default",
        });
      } else {
        // Mise à jour d'une catégorie existante
        updatedCategories = categories.map(c => c.id === category.id ? category : c);
        toast({
          title: "Catégorie mise à jour",
          description: `La catégorie "${category.name}" a été mise à jour avec succès.`,
          variant: "default",
        });
      }

      setCategories(updatedCategories);
      setIsLoading(false);
    }, 500);
  }, [categories, toast]);

  // Callbacks pour la gestion des produits
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const handleDeleteProduct = useCallback((product: Product) => {
    setItemToDelete({ type: 'product', item: product });
    setIsDeleteModalOpen(true);
  }, []);

  const handleToggleProductAvailability = useCallback((product: Product) => {
    setIsLoading(true);

    setTimeout(() => {
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, isAvailable: !p.isAvailable };
        }
        return p;
      });

      setProducts(updatedProducts);

      toast({
        title: product.isAvailable ? "Produit désactivé" : "Produit activé",
        description: `Le produit "${product.name}" est maintenant ${product.isAvailable ? 'indisponible' : 'disponible'}.`,
        variant: "default",
      });

      setIsLoading(false);
    }, 500);
  }, [products, toast]);

  const handleSaveProduct = useCallback((product: Product) => {
    setIsLoading(true);

    setTimeout(() => {
      let updatedProducts;
      const isNew = !products.some(p => p.id === product.id);

      if (isNew) {
        // Ajout d'un nouveau produit
        updatedProducts = [...products, product];

        // Mettre à jour le compteur de produits dans la catégorie
        const updatedCategories = categories.map(category => {
          if (category.id === product.categoryId) {
            return {
              ...category,
              productCount: (category.productCount || 0) + 1
            };
          }
          return category;
        });
        setCategories(updatedCategories);

        toast({
          title: "Produit ajouté",
          description: `Le produit "${product.name}" a été ajouté avec succès.`,
          variant: "default",
        });
      } else {
        // Vérifier si la catégorie a changé
        const oldProduct = products.find(p => p.id === product.id);
        if (oldProduct && oldProduct.categoryId !== product.categoryId) {
          // Mettre à jour les compteurs de produits dans les deux catégories
          const updatedCategories = categories.map(category => {
            if (category.id === oldProduct.categoryId) {
              return {
                ...category,
                productCount: Math.max(0, (category.productCount || 0) - 1)
              };
            } else if (category.id === product.categoryId) {
              return {
                ...category,
                productCount: (category.productCount || 0) + 1
              };
            }
            return category;
          });
          setCategories(updatedCategories);
        }

        // Mise à jour d'un produit existant
        updatedProducts = products.map(p => p.id === product.id ? {
          ...product,
          categoryName: categories.find(c => c.id === product.categoryId)?.name || ''
        } : p);

        toast({
          title: "Produit mis à jour",
          description: `Le produit "${product.name}" a été mis à jour avec succès.`,
          variant: "default",
        });
      }

      setProducts(updatedProducts);
      setIsLoading(false);
    }, 500);
  }, [products, categories, toast]);

  return (
    <POSLayout>
      <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
        {/* <div className="p-6 bg-gray-950 text-gray-100 min-h-screen"> */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-50">Catalogue des produits</h1>
            <p className="text-gray-400">Gérez les produits et catégories disponibles sur vos terminaux</p>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-muted dark:bg-gray-800">
            <TabsTrigger value="products" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Produits</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Catégories</TabsTrigger>
          </TabsList>

          {/* Onglet Produits */}
          <TabsContent value="products">
            {/* <Card className="bg-gray-800 border-gray-700 text-gray-100"> */}
            <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-gray-50">Liste des produits</CardTitle>
                    <CardDescription className="text-gray-400">Tous les produits disponibles sur vos terminaux</CardDescription>
                  </div>
                  <Button onClick={handleAddProduct} className="bg-green-600 text-white hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      className="pl-8 bg-background dark:bg-gray-950 text-foreground dark:text-gray-50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="category" className="text-gray-300">Catégorie</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectItem value="all" className="hover:bg-gray-700">Toutes les catégories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()} className="hover:bg-gray-700">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="availability" className="text-gray-300">Disponibilité</Label>
                      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                        <SelectTrigger className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectItem value="all" className="hover:bg-gray-700">Tous les statuts</SelectItem>
                          <SelectItem value="available" className="hover:bg-gray-700">Disponibles</SelectItem>
                          <SelectItem value="unavailable" className="hover:bg-gray-700">Indisponibles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-gray-700">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-gray-200">
                      <thead className="[&_tr]:border-b border-gray-700">
                        <tr className="border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700">
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Catégorie</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Prix</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Disponibilité</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700">
                              <td className="p-4 align-middle">{product.id}</td>
                              <td className="p-4 align-middle font-medium text-gray-50">
                                <div>
                                  {product.name}
                                  {product.description && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      {product.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className="font-normal bg-gray-700 text-gray-300 border-gray-600">
                                  {product.categoryName || '—'}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle font-medium text-gray-50">
                                {product.price.toLocaleString()} Ar
                              </td>
                              <td className="p-4 align-middle">
                                <Badge
                                  className={`${product.isAvailable
                                    ? 'bg-green-700 text-green-100 hover:bg-green-600'
                                    : 'bg-red-700 text-red-100 hover:bg-red-600'}`}
                                >
                                  {product.isAvailable ? 'Disponible' : 'Indisponible'}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex space-x-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleEditProduct(product)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-50"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Modifier</span>
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant={product.isAvailable ? "destructive" : "default"}
                                    onClick={() => handleToggleProductAvailability(product)}
                                    className={`${product.isAvailable ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                  >
                                    {product.isAvailable
                                      ? <X className="h-4 w-4" />
                                      : <Check className="h-4 w-4" />}
                                    <span className="sr-only">
                                      {product.isAvailable ? 'Désactiver' : 'Activer'}
                                    </span>
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDeleteProduct(product)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="h-24 text-center text-gray-400">
                              Aucun produit trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Catégories */}
          <TabsContent value="categories">
            {/* <Card className="bg-gray-800 border-gray-700 text-gray-100"> */}
            <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">

              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-gray-50">Liste des catégories</CardTitle>
                    <CardDescription className="text-gray-400">Organisez vos produits par catégories</CardDescription>
                  </div>
                  <Button onClick={handleAddCategory} className="bg-green-600 text-white hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une catégorie
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-700">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-gray-200">
                      <thead className="[&_tr]:border-b border-gray-700">
                        <tr className="border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700">
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Description</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Produits</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {categories.map((category) => (
                          <tr key={category.id} className="border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700">
                            <td className="p-4 align-middle">{category.id}</td>
                            <td className="p-4 align-middle font-medium text-gray-50">{category.name}</td>
                            <td className="p-4 align-middle">
                              {category.description || '—'}
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                {category.productCount || 0}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={`${category.isActive
                                  ? 'bg-green-700 text-green-100 hover:bg-green-600'
                                  : 'bg-orange-700 text-orange-100 hover:bg-orange-600'}`}
                              >
                                {category.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleEditCategory(category)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-50"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleDeleteCategory(category)}
                                  disabled={category.productCount! > 0}
                                  className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:text-gray-500"
                                >
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Supprimer</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories.filter(c => c.isActive)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteItem}
        title={`Supprimer ${itemToDelete?.type === 'category' ? 'la catégorie' : 'le produit'}`}
        description={`Êtes-vous sûr de vouloir supprimer ${itemToDelete?.type === 'category' ? 'la catégorie' : 'le produit'} "${itemToDelete?.item?.name}" ? Cette action est irréversible.`}
        isLoading={isLoading}
      />
    </POSLayout>
  );
};

export default POSCatalogPage;