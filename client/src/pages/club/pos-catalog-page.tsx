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
  X,
  Image as ImageIcon
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
  const [destinationFilter, setDestinationFilter] = useState("all"); // Nouveau filtre pour la destination
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

  // Fonction utilitaire pour mapper les données de l'API (destinations -> destination)
  const mapProductsFromApi = useCallback((apiProducts: any[]) => {
    return apiProducts.map(p => ({
      ...p,
      destination: p.destinations || 'bar' // Par défaut 'bar' si absent
    }));
  }, []);

  // Charger les catégories et produits depuis l'API au montage du composant
  useEffect(() => {
    api.getAllProductCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
    api.getAllProducts()
      .then(mapProductsFromApi)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [mapProductsFromApi]);

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
    const matchesDestination = destinationFilter === "all" || product.destination === destinationFilter;
    return matchesSearch && matchesCategory && matchesAvailability && matchesDestination;
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
        .then(() => api.getAllProducts().then(mapProductsFromApi).then(setProducts))
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
  }, [itemToDelete, products, categories, toast, mapProductsFromApi]);

  const handleSaveCategory = useCallback(async (category: { id?: number; name: string; description?: string; isActive: boolean }) => {
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
    try {
      await savePromise;
      const updatedCategories = await api.getAllProductCategories();
      setCategories(updatedCategories);
      toast({
        title: !isEdit ? "Catégorie ajoutée" : "Catégorie mise à jour",
        description: `La catégorie "${category.name}" a été ${!isEdit ? "ajoutée" : "mise à jour"} avec succès.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    }
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
      setProducts(mapProductsFromApi(updatedProducts));
      toast({
        title: !product.isAvailable ? "Produit activé" : "Produit désactivé",
        description: `Le produit "${product.name}" est maintenant ${!product.isAvailable ? 'disponible' : 'indisponible'}.`,
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, mapProductsFromApi]);

  const handleSaveProduct = useCallback(async (productData: any) => {
    setIsLoading(true);
    // Préparer les données pour l'API (sans categoryName, et avec destinations)
    const apiProductData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      categoryId: productData.categoryId,
      isAvailable: productData.isAvailable,
      imageUrl: productData.imageUrl,
      destinations: productData.destinations // Ajout du champ destinations pour le backend
    };
    const savePromise = productData.id
      ? api.updateProduct(productData.id, apiProductData)
      : api.createProduct(apiProductData);
    try {
      await savePromise;
      const updatedProducts = await api.getAllProducts();
      setProducts(mapProductsFromApi(updatedProducts));
      toast({
        title: productData.id ? "Produit mis à jour" : "Produit ajouté",
        description: `Le produit "${productData.name}" a été ${productData.id ? "mis à jour" : "ajouté"} avec succès.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  }, [products, toast, mapProductsFromApi]);

  // Fonction pour obtenir les produits d'une catégorie
  const getCategoryProducts = useCallback((categoryId: number) => {
    return products.filter(p => p.categoryId === categoryId);
  }, [products]);

  // Composant utilitaire pour le badge de destination
  const DestinationBadge = ({ destination }: { destination: string }) => {
    const isBar = destination === 'bar';
    return (
      <Badge
        variant="secondary"
        className={`${
          isBar
            ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
            : 'bg-green-900/30 text-green-400 border border-green-800/50'
        }`}
      >
        {isBar ? 'Bar' : 'Cuisine'}
      </Badge>
    );
  };

  return (
    <POSLayout>
      <div className="p-6 space-y-6 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Tag className="h-8 w-8 text-pink-400" />
              Catalogue des produits
            </h1>
            <p className="text-gray-300 mt-1">Gérez les produits et catégories disponibles sur vos terminaux en toute simplicité</p>
          </div>
        </div>
        <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-gray-900 text-gray-300 rounded-xl p-1 border border-gray-800">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg"
            >
              <TagsIcon className="h-4 w-4 mr-2" />
              Produits
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg"
            >
              <Settings className="h-4 w-4 mr-2" />
              Catégories
            </TabsTrigger>
          </TabsList>
          {/* Onglet Produits */}
          <TabsContent value="products">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-cyan-400" />
                      Liste des produits
                    </CardTitle>
                    <CardDescription className="text-gray-300">Tous les produits disponibles sur vos terminaux</CardDescription>
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={handleAddProduct}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher un produit..."
                      className="pl-10 bg-black border-gray-800 text-white placeholder-gray-500 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="category" className="text-gray-300">Catégorie</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-white">
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="availability" className="text-gray-300">Disponibilité</Label>
                      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                        <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-white">
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="available">Disponibles</SelectItem>
                          <SelectItem value="unavailable">Indisponibles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Nouveau filtre Destination */}
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="destination" className="text-gray-300">Destination</Label>
                      <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                        <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Toutes les destinations" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-white">
                          <SelectItem value="all">Toutes les destinations</SelectItem>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="cuisine">Cuisine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                      const category = categories.find(c => c.id === product.categoryId);
                      return (
                        <Card key={product.id} className="bg-black border-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                          <div className="relative h-48 bg-gray-950 flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <ImageIcon className={`h-12 w-12 text-gray-500 ${product.imageUrl ? 'hidden' : 'flex'}`} />
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-white text-lg leading-tight">{product.name}</h3>
                              {product.description && (
                                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{product.description}</p>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-gray-300 bg-black border-gray-900">
                                  {category ? category.name : '—'}
                                </Badge>
                                <DestinationBadge destination={product.destination || 'bar'} />
                              </div>
                              <div className="text-xl font-bold text-pink-400">
                                {product.price?.toLocaleString()} Ar
                              </div>
                            </div>
                            <Badge
                              className={`w-full justify-center ${
                                product.isAvailable
                                  ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                                  : 'bg-red-900/30 text-red-400 border border-red-800/50'
                              }`}
                            >
                              {product.isAvailable ? 'Disponible' : 'Indisponible'}
                            </Badge>
                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                              <Button
                                size="icon"
                                variant={product.isAvailable ? "destructive" : "default"}
                                className={`h-8 w-8 flex-1 ${product.isAvailable ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
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
                                className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white flex-1"
                                onClick={() => handleDeleteProduct(product)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Aucun produit trouvé</h3>
                    <p className="text-sm text-gray-400">Essayez d'ajuster vos filtres ou ajoutez un nouveau produit.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Onglet Catégories */}
          <TabsContent value="categories">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="h-6 w-6 text-amber-400" />
                      Liste des catégories
                    </CardTitle>
                    <CardDescription className="text-gray-300">Organisez vos produits par catégories</CardDescription>
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={handleAddCategory}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une catégorie
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                      const count = categoryProductCounts[category.id] || 0;
                      const categoryProducts = getCategoryProducts(category.id);
                      return (
                        <Card key={category.id} className="bg-black border-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow h-[500px] flex flex-col overflow-hidden">
                          <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                                {category.description && (
                                  <p className="text-sm text-gray-300 mt-1">{category.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-gray-300 bg-black border-gray-900">
                                  {count} produit{count !== 1 ? 's' : ''}
                                </Badge>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 border-gray-800 text-gray-300 hover:bg-gray-900"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleDeleteCategory(category)}
                                  disabled={count > 0}
                                >
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Supprimer</span>
                                </Button>
                              </div>
                            </div>
                            <Badge
                              className={`mb-4 ${
                                category.isActive
                                  ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                                  : 'bg-orange-900/30 text-orange-400 border border-orange-800/50'
                              }`}
                            >
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="flex-1 overflow-y-auto">
                              {categoryProducts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                  {categoryProducts.map((product) => (
                                    <div key={product.id} className="bg-gray-950 rounded-lg p-2 space-y-1">
                                      <div className="relative h-20 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                          <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              e.currentTarget.nextSibling.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}
                                        <ImageIcon className={`h-6 w-6 text-gray-500 ${product.imageUrl ? 'hidden' : 'flex'}`} />
                                      </div>
                                      <h4 className="text-sm font-medium text-white line-clamp-1">{product.name}</h4>
                                      <p className="text-xs text-gray-300 line-clamp-1">{product.description}</p>
                                      <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-pink-400">
                                          {product.price?.toLocaleString()} Ar
                                        </div>
                                        <DestinationBadge destination={product.destination || 'bar'} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <ImageIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-400">Aucun produit dans cette catégorie</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Aucune catégorie trouvée</h3>
                    <p className="text-sm text-gray-400">Ajoutez une nouvelle catégorie pour organiser vos produits.</p>
                  </div>
                )}
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