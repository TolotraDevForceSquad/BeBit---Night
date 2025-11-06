import React, { useState, useEffect, useCallback } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import {
  Search,
  Check,
  Clock,
  AlertCircle,
  Filter,
  TrendingUp,
  Users,
  Tag,
  Utensils
} from 'lucide-react';
import { api } from "../../services/api"; // Adjust path if necessary
import { PosTable, Order, OrderItem, Product, ProductCategory } from "@shared/schema";

interface ExtendedOrderItem extends OrderItem {
  productName: string;
  productImageUrl?: string;
  tableName?: string;
  customerName?: string;
  createdAt: Date | string;
  priority: string;
  category: string;
}

const POSKitchenPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ordersState, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [tables, setTables] = useState<PosTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Extraire toutes les catégories uniques pour les produits de destination "cuisine"
  const uniqueCategories = Array.from(
    new Set(
      products
        .filter(p => p.destination === 'cuisine')
        .map(p => categories.find(c => c.id === p.categoryId)?.name)
        .filter(Boolean)
    )
  ).sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tablesData, ordersData, itemsData, productsData, categoriesData] = await Promise.all([
          api.getAllPosTables(),
          api.getAllOrders(),
          api.getAllOrderItems(),
          api.getAllProducts(),
          api.getAllProductCategories()
        ]);
        setTables(tablesData);
        setOrders(ordersData);
        setOrderItems(itemsData);
        // Mapper destinations vers destination pour cohérence
        setProducts(productsData.map(p => ({ ...p, destination: p.destinations || 'bar' })));
        setCategories(categoriesData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Calculer les compteurs pour les badges (seulement pour destination "cuisine")
  const pendingItems = orderItems.filter(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.destination === 'cuisine' && item.status === 'pending';
  }).length;
  const preparingItems = orderItems.filter(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.destination === 'cuisine' && item.status === 'preparing';
  }).length;
  const readyItems = orderItems.filter(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.destination === 'cuisine' && item.status === 'ready';
  }).length;
  const servedItems = orderItems.filter(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.destination === 'cuisine' && item.status === 'served';
  }).length;

  // Fonction pour obtenir tous les éléments de commandes filtrés (seulement pour destination "cuisine")
  const getFilteredItems = (): ExtendedOrderItem[] => {
    return orderItems
      .filter(item => {
        const order = ordersState.find(o => o.id === item.orderId);
        const product = products.find(p => p.id === item.productId);
        const categoryName = categories.find(c => c.id === product?.categoryId)?.name || 'Non catégorisé';
        const matchesDestination = product?.destination === 'cuisine';
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || categoryName === categoryFilter;
        const matchesSearch =
          product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tables.find(t => t.id === order?.tableId)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order?.id.toString().includes(searchTerm);
        return matchesDestination && matchesStatus && matchesCategory && matchesSearch;
      })
      .map(item => {
        const order = ordersState.find(o => o.id === item.orderId);
        const product = products.find(p => p.id === item.productId);
        const table = tables.find(t => t.id === order?.tableId);
        const categoryName = categories.find(c => c.id === product?.categoryId)?.name || 'Non catégorisé';
        return {
          ...item,
          orderId: item.orderId,
          productName: product?.name || item.notes || 'Unknown',
          productImageUrl: product?.imageUrl,
          tableName: table?.name,
          customerName: order?.customerName,
          createdAt: order?.createdAt || new Date(),
          priority: order?.priority || 'normal',
          category: categoryName
        };
      });
  };

  // Fonction pour mettre à jour le statut d'un élément de commande
  const updateItemStatus = useCallback(async (orderId: number, itemId: number, newStatus: string) => {
    let oldStatus: string | undefined;
    let oldOrderStatus: string | undefined;
    try {
      const currentItem = orderItems.find(item => item.id === itemId);
      if (!currentItem) return;
      oldStatus = currentItem.status;
      // Mise à jour optimiste pour l'item
      setOrderItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      // Vérifier si tous les items sont servis
      const orderItemsForOrder = orderItems.filter(item => item.orderId === orderId);
      const updatedOrderItems = orderItemsForOrder.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      const allServed = updatedOrderItems.every(item => item.status === 'served');
      if (allServed) {
        setOrders(prev => prev.map(order => {
          if (order.id === orderId) {
            oldOrderStatus = order.status;
            return { ...order, status: 'completed', updatedAt: new Date().toISOString() };
          }
          return order;
        }));
      }
      // Appels API
      await api.updateOrderItem(itemId, { status: newStatus });
      if (allServed) {
        await api.updateOrder(orderId, { status: 'completed' });
      }
      toast({
        title: "Statut mis à jour",
        description: `L'élément a été marqué comme ${
          newStatus === 'pending' ? 'en attente' :
          newStatus === 'preparing' ? 'en préparation' :
          newStatus === 'ready' ? 'prêt à servir' : 'servi'
        }`,
        variant: "default",
      });
    } catch (error) {
      // Revert updates
      if (oldStatus) {
        setOrderItems(prev => prev.map(item =>
          item.id === itemId ? { ...item, status: oldStatus } : item
        ));
      }
      if (oldOrderStatus) {
        const orderItemsForOrder = orderItems.filter(item => item.orderId === orderId);
        const updatedOrderItems = orderItemsForOrder.map(item =>
          item.id === itemId ? { ...item, status: oldStatus } : item
        );
        const allServed = updatedOrderItems.every(item => item.status === 'served');
        if (allServed) {
          setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: oldOrderStatus } : order
          ));
        }
      }
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }, [orderItems, ordersState, toast]);

  // Fonction pour obtenir la couleur de badge selon la priorité
  const getPriorityBadgeColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border border-red-800/50';
      case 'low':
        return 'bg-blue-900/30 text-blue-400 border border-blue-800/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border border-gray-800/50';
    }
  };

  // Fonction pour estimer le temps d'attente
  const getEstimatedWaitTime = (item: ExtendedOrderItem, order: Order | undefined): string => {
    if (item.status === 'served') return 'Servi';
    if (item.status === 'ready') return 'Prêt';
   
    if (order?.estimatedCompletionTime) {
      const now = new Date();
      const timeLeft = Math.max(0, Math.floor((new Date(order.estimatedCompletionTime).getTime() - now.getTime()) / 60000));
      return `~${timeLeft} min`;
    }
   
    return item.preparationTime ? `~${item.preparationTime} min` : 'En attente';
  };

  // Composant pour afficher un élément de commande avec actions
  const OrderItemCard: React.FC<{ item: ExtendedOrderItem; order?: Order }> = ({ item, order }) => {
    return (
      <Card className="bg-black border-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
        <CardHeader className={`pb-3 ${item.status === 'pending' ? 'bg-yellow-900/20 border-yellow-600' :
            item.status === 'preparing' ? 'bg-blue-900/20 border-blue-600' :
              item.status === 'ready' ? 'bg-green-900/20 border-green-600' :
                'bg-gray-900/20 border-gray-600'
          }`}>
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden">
              {item.productImageUrl ? (
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <Tag className={`absolute inset-0 h-full w-full text-gray-500 flex items-center justify-center ${item.productImageUrl ? 'hidden' : 'flex'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white truncate">{item.productName}</CardTitle>
                <Badge variant="outline" className="bg-gray-900/30 text-gray-400 border border-gray-800/50 text-xs">x{item.quantity}</Badge>
              </div>
              <CardDescription className="text-gray-300 text-sm">
                {item.tableName || item.customerName || `Commande #${item.orderId}`}
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <Badge className={`${getPriorityBadgeColor(item.priority)} text-xs`}>
                {item.priority === 'high' ? 'Prioritaire' :
                   item.priority === 'low' ? 'Basse' : 'Normal'}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-gray-900/30 text-gray-400 border border-gray-800/50 text-sm">
              {item.category}
            </Badge>
            <Badge variant="outline" className="bg-gray-900/30 text-gray-400 border border-gray-800/50 flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1 text-amber-400" />
              {getEstimatedWaitTime(item, order)}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-300 pt-1 border-t border-gray-800">
            <div>Commande #{item.orderId}</div>
            <div className="font-semibold text-pink-400">{item.subtotal?.toLocaleString()} Ar</div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Badge
            className={`w-full justify-center text-sm py-2 ${
              item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' :
              item.status === 'preparing' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
              item.status === 'ready' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
              'bg-gray-900/30 text-gray-400 border border-gray-800/50'
            }`}
          >
            {item.status === 'pending' ? 'En attente' :
             item.status === 'preparing' ? 'En préparation' :
             item.status === 'ready' ? 'Prêt à servir' : 'Servi'}
          </Badge>
          <div className="flex space-x-2 w-full">
            {item.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                onClick={() => updateItemStatus(item.orderId, item.id, 'preparing')}
              >
                Commencer
              </Button>
            )}
            {item.status === 'preparing' && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                onClick={() => updateItemStatus(item.orderId, item.id, 'ready')}
              >
                Prêt
              </Button>
            )}
            {item.status === 'ready' && (
              <Button
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white flex-1"
                onClick={() => updateItemStatus(item.orderId, item.id, 'served')}
              >
                Servir
              </Button>
            )}
            {item.status === 'served' && (
              <Badge variant="outline" className="flex items-center justify-center flex-1 bg-gray-900/30 text-gray-400 border border-gray-800/50 py-2">
                <Check className="h-3 w-3 mr-1 text-green-400" />
                Terminé
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <POSLayout>
        <div className="p-6 space-y-6 bg-black text-white">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-300">Chargement des données...</h3>
          </div>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="p-6 space-y-6 bg-black text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Utensils className="h-8 w-8 text-pink-400" />
              Back Office - Cuisine
            </h1>
            <p className="text-gray-300 mt-1">Gérez les commandes à préparer par catégorie</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 bg-black border-gray-800 text-white placeholder-gray-400 rounded-lg focus:border-pink-500 focus:ring-pink-500 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
       
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-300">En attente</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-300">En préparation</p>
                <p className="text-2xl font-bold text-blue-400">{preparingItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50">
                <Utensils className="h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-300">Prêt à servir</p>
                <p className="text-2xl font-bold text-green-400">{readyItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50">
                <Check className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-300">Servis</p>
                <p className="text-2xl font-bold text-cyan-400">{servedItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-900/30 border border-gray-800/50">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>
       
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Label className="mr-2 text-gray-300">Statut:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prêt à servir</SelectItem>
                <SelectItem value="served">Servi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label className="mr-2 text-gray-300">Catégorie:</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label className="mr-2 text-gray-300">Priorité:</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px] bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="high">Prioritaire</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
       
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="mb-6 bg-black text-gray-300 rounded-xl p-1 border border-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              Toutes les commandes
            </TabsTrigger>
            {uniqueCategories.map(category => (
              <TabsTrigger key={category} value={category} className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
                {category}
              </TabsTrigger>
            ))}
          </TabsList> */}
          <TabsContent value="all">
            {getFilteredItems().length === 0 ? (
              <div className="text-center py-12 bg-black rounded-xl border border-gray-800">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Aucune commande trouvée</h3>
                <p className="text-sm text-gray-400">Ajustez vos filtres ou attendez de nouvelles commandes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredItems()
                  .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
                  .sort((a, b) => {
                    const priorityOrder: { [key: string]: number } = { high: 0, normal: 1, low: 2 };
                    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    const statusOrder: { [key: string]: number } = { pending: 0, preparing: 1, ready: 2, served: 3 };
                    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
                    if (statusDiff !== 0) return statusDiff;
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((item) => (
                    <OrderItemCard
                      key={`${item.orderId}-${item.id}`}
                      item={item}
                      order={ordersState.find(o => o.id === item.orderId)}
                    />
                  ))
                }
              </div>
            )}
          </TabsContent>
          {uniqueCategories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredItems()
                  .filter(item => item.category === category)
                  .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
                  .sort((a, b) => {
                    const priorityOrder: { [key: string]: number } = { high: 0, normal: 1, low: 2 };
                    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                    if (priorityDiff !== 0) return priorityDiff;
                    const statusOrder: { [key: string]: number } = { pending: 0, preparing: 1, ready: 2, served: 3 };
                    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
                    if (statusDiff !== 0) return statusDiff;
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((item) => (
                    <OrderItemCard
                      key={`${item.orderId}-${item.id}`}
                      item={item}
                      order={ordersState.find(o => o.id === item.orderId)}
                    />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </POSLayout>
  );
};

export default POSKitchenPage;