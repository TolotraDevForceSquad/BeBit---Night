import React, { useState, useCallback, useEffect } from 'react';
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
import { api } from '../../services/api';

const POSCatalogPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // États pour les données
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // États pour les modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'product', item: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Normalisation des données reçues de l'API pour correspondre aux noms utilisés côté front
  function normalizeProduct(apiProduct: any): Product {
    return {
      ...apiProduct,
      categoryId: apiProduct.category_id,
      isAvailable: apiProduct.is_available,
      imageUrl: apiProduct.image_url,
      // Le nom de la catégorie sera ajouté dynamiquement lors de l'affichage
    };
  }
  function normalizeCategory(apiCategory: any): ProductCategory {
    return {
      ...apiCategory,
      isActive: apiCategory.is_active,
    };
  }

  // Charger les catégories et produits depuis l'API au montage du composant
  useEffect(() => {
    api.getAllProductCategories()
      .then((data) => setCategories(data.map(normalizeCategory)))
      .catch(() => setCategories([]));
    api.getAllProducts()
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch(() => setProducts([]));
  }, []);

  // Calcul dynamique du nombre de produits par catégorie
  const categoryProductCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || product.categoryId?.toString() === categoryFilter;
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

    if (itemToDelete.type === 'product') {
      api.deleteProduct(itemToDelete.item.id)
        .then(() => api.getAllProducts().then(setProducts))
        .then(() => {
          toast({
            title: "Produit supprimé",
            description: `Le produit "${itemToDelete.item.name}" a été supprimé avec succès.`,
            variant: "default",
          });
        })
        .finally(() => {
          setIsLoading(false);
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        });
    } else if (itemToDelete.type === 'category') {
      // Vérifier si la catégorie a des produits
      const category = itemToDelete.item as ProductCategory;
      const hasProducts = products.some(p => p.categoryId === category.id);
      if (hasProducts) {
        toast({
          title: "Impossible de supprimer",
          description: "Cette catégorie contient des produits. Veuillez d'abord supprimer ou déplacer ces produits.",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        api.deleteProductCategory(category.id)
          .then(() => api.getAllProductCategories().then(setCategories))
          .then(() => {
            toast({
              title: "Catégorie supprimée",
              description: `La catégorie "${category.name}" a été supprimée avec succès.`,
              variant: "default",
            });
          })
          .finally(() => {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          });
      }
    }
  }, [itemToDelete, products, categories, toast]);

  const handleSaveCategory = useCallback((category: { id?: number; name: string; description?: string; isActive: boolean }) => {
    setIsLoading(true);

    const isEdit = !!category.id;
    const savePromise = !isEdit
      ? api.createProductCategory({
        name: category.name,
        description: category.description,
        isActive: category.isActive
      })
      : api.updateProductCategory(category.id!, {
        name: category.name,
        description: category.description,
        isActive: category.isActive
      });

    savePromise
      .then(() => api.getAllProductCategories().then(data => setCategories(data.map(normalizeCategory))))
      .then(() => {
        toast({
          title: !isEdit ? "Catégorie ajoutée" : "Catégorie mise à jour",
          description: `La catégorie "${category.name}" a été ${!isEdit ? "ajoutée" : "mise à jour"} avec succès.`,
          variant: "default",
        });
      })
      .finally(() => setIsLoading(false));
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

  const handleToggleProductAvailability = useCallback(async (product: Product) => {
    setIsLoading(true);
    try {
      // Appel API pour mettre à jour la disponibilité
      await api.updateProduct(product.id, { isAvailable: !product.isAvailable });
      // Rafraîchir la liste des produits depuis l'API
      const updatedProducts = await api.getAllProducts();
      setProducts(updatedProducts.map(normalizeProduct));
      toast({
        title: !product.isAvailable ? "Produit activé" : "Produit désactivé",
        description: `Le produit "${product.name}" est maintenant ${!product.isAvailable ? 'disponible' : 'indisponible'}.`,
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSaveProduct = useCallback((productData: any) => {
    setIsLoading(true);

    // Préparer les données pour l'API (sans categoryName)
    const apiProductData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      categoryId: productData.categoryId,
      isAvailable: productData.isAvailable,
      imageUrl: productData.imageUrl
    };

    const savePromise = productData.id
      ? api.updateProduct(productData.id, apiProductData)
      : api.createProduct(apiProductData);

    savePromise
      .then(() => {
        return api.getAllProducts().then(data => setProducts(data.map(normalizeProduct)));
      })
      .then(() => {
        toast({
          title: productData.id ? "Produit mis à jour" : "Produit ajouté",
          description: `Le produit "${productData.name}" a été ${productData.id ? "mis à jour" : "ajouté"} avec succès.`,
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: `Une erreur est survenue: ${error.message}`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [products, toast]);

  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Catalogue des produits</h1>
            <p className="text-muted-foreground">Gérez les produits et catégories disponibles sur vos terminaux</p>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>

          {/* Onglet Produits */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des produits</CardTitle>
                    <CardDescription>Tous les produits disponibles sur vos terminaux</CardDescription>
                  </div>
                  <Button onClick={handleAddProduct}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un produit..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="availability">Disponibilité</Label>
                      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="available">Disponibles</SelectItem>
                          <SelectItem value="unavailable">Indisponibles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Catégorie</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prix</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Disponibilité</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => {
                            const category = categories.find(c => c.id === product.categoryId);
                            return (
                              <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle">{product.id}</td>
                                <td className="p-4 align-middle font-medium">
                                  <div>
                                    {product.name}
                                    {product.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {product.description}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge variant="outline" className="font-normal">
                                    {category ? category.name : '—'}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle font-medium">
                                  {product.price?.toLocaleString()} Ar
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    className={`${product.isAvailable
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : 'bg-red-100 text-red-800 hover:bg-red-100'}`}
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
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Modifier</span>
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant={product.isAvailable ? "destructive" : "default"}
                                      onClick={() => handleToggleProductAvailability(product)}
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
                                    >
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">Supprimer</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="h-24 text-center">
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des catégories</CardTitle>
                    <CardDescription>Organisez vos produits par catégories</CardDescription>
                  </div>
                  <Button onClick={handleAddCategory}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une catégorie
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Produits</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {categories.map((category) => (
                          <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{category.id}</td>
                            <td className="p-4 align-middle font-medium">{category.name}</td>
                            <td className="p-4 align-middle">
                              {category.description || '—'}
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant="secondary">{categoryProductCounts[category.id] || 0}</Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={`${category.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-orange-100 text-orange-800 hover:bg-orange-100'}`}
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
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleDeleteCategory(category)}
                                  disabled={categoryProductCounts[category.id] > 0}
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
        // categories={categories.filter(c => c.isActive)}
        categories={categories}
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