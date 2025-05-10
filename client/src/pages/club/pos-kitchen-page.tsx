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
  Coffee,
  Utensils,
  Wine,
  Pizza,
  CakeSlice,
  Filter
} from 'lucide-react';

// Importation des types depuis les autres composants
import { Order, OrderItem } from '../../components/OrderModal';
import { Product } from '../../components/ProductModal';
import { ProductCategory } from '../../components/ProductCategoryModal';

// Type OrderItem modifié pour l'interface de cuisine
interface KitchenOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price?: number;
  subtotal: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  category: string;
  preparationTime?: number; // en minutes
}

// État étendu pour les commandes
interface KitchenOrder extends Order {
  items: KitchenOrderItem[];
  priority: 'normal' | 'high' | 'low';
  estimatedCompletionTime?: Date;
}

// Données fictives pour les commandes de cuisine
const initialKitchenOrders: KitchenOrder[] = [
  {
    id: 101,
    tableId: 2,
    tableName: "Table 2",
    items: [
      { 
        id: 1, 
        productId: 1, 
        productName: "Coca-Cola", 
        quantity: 2, 
        subtotal: 10000,
        status: 'ready',
        category: 'Boissons'
      },
      { 
        id: 2, 
        productId: 7, 
        productName: "Burger", 
        quantity: 2, 
        subtotal: 50000,
        status: 'preparing',
        category: 'Plats',
        preparationTime: 15
      }
    ],
    status: "processing",
    total: 60000,
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    updatedAt: new Date(),
    paymentMethod: "pending",
    priority: 'normal',
    estimatedCompletionTime: new Date(Date.now() + 10 * 60000) // 10 minutes from now
  },
  {
    id: 102,
    tableId: 6,
    tableName: "Table 6",
    items: [
      { 
        id: 3, 
        productId: 3, 
        productName: "Mojito", 
        quantity: 4, 
        subtotal: 60000,
        status: 'pending',
        category: 'Cocktails'
      },
      { 
        id: 4, 
        productId: 5, 
        productName: "Chips", 
        quantity: 2, 
        subtotal: 10000,
        status: 'ready',
        category: 'Snacks'
      }
    ],
    status: "processing",
    total: 70000,
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    updatedAt: new Date(),
    paymentMethod: "pending",
    priority: 'normal'
  },
  {
    id: 103,
    tableId: 9,
    tableName: "VIP Lounge 2",
    customerName: "Groupe VIP",
    items: [
      { 
        id: 5, 
        productId: 4, 
        productName: "Piña Colada", 
        quantity: 8, 
        subtotal: 120000,
        status: 'pending',
        category: 'Cocktails'
      },
      { 
        id: 6, 
        productId: 6, 
        productName: "Cacahuètes", 
        quantity: 4, 
        subtotal: 16000,
        status: 'ready',
        category: 'Snacks'
      },
      { 
        id: 7, 
        productId: 8, 
        productName: "Pizza Margherita", 
        quantity: 3, 
        subtotal: 90000,
        status: 'preparing',
        category: 'Plats',
        preparationTime: 20
      }
    ],
    status: "processing",
    total: 226000,
    createdAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
    updatedAt: new Date(),
    paymentMethod: "pending",
    priority: 'high',
    estimatedCompletionTime: new Date(Date.now() + 15 * 60000) // 15 minutes from now
  },
  {
    id: 104,
    tableId: 11,
    tableName: "Bar 2",
    items: [
      { 
        id: 8, 
        productId: 2, 
        productName: "Eau minérale", 
        quantity: 1, 
        subtotal: 3000,
        status: 'served',
        category: 'Boissons'
      },
      { 
        id: 9, 
        productId: 5, 
        productName: "Chips", 
        quantity: 1, 
        subtotal: 5000,
        status: 'served',
        category: 'Snacks'
      }
    ],
    status: "completed",
    total: 8000,
    createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    paymentMethod: "cash",
    priority: 'normal'
  },
  {
    id: 105,
    items: [
      { 
        id: 10, 
        productId: 7, 
        productName: "Burger", 
        quantity: 2, 
        subtotal: 50000,
        status: 'pending',
        category: 'Plats',
        preparationTime: 15
      },
      { 
        id: 11, 
        productId: 10, 
        productName: "Mousse au chocolat", 
        quantity: 2, 
        subtotal: 20000,
        status: 'pending',
        category: 'Desserts'
      }
    ],
    status: "processing",
    customerName: "Client à emporter",
    total: 70000,
    createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    updatedAt: new Date(),
    paymentMethod: "pending",
    priority: 'high',
    estimatedCompletionTime: new Date(Date.now() + 15 * 60000) // 15 minutes from now
  }
];

const POSKitchenPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<KitchenOrder[]>(initialKitchenOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setcategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Extraire toutes les catégories uniques
  const uniqueCategories = Array.from(
    new Set(
      orders.flatMap(order => 
        order.items.map(item => item.category)
      )
    )
  ).sort();
  
  // Calculer les compteurs pour les badges
  const pendingItems = orders.flatMap(order => 
    order.items.filter(item => item.status === 'pending')
  ).length;
  
  const preparingItems = orders.flatMap(order => 
    order.items.filter(item => item.status === 'preparing')
  ).length;
  
  const readyItems = orders.flatMap(order => 
    order.items.filter(item => item.status === 'ready')
  ).length;
  
  const servedItems = orders.flatMap(order => 
    order.items.filter(item => item.status === 'served')
  ).length;
  
  // Fonction pour obtenir tous les éléments de commandes filtrés
  const getFilteredItems = () => {
    return orders.flatMap(order => {
      return order.items
        .filter(item => {
          const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
          const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
          const matchesSearch = 
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);
            
          return matchesStatus && matchesCategory && matchesSearch;
        })
        .map(item => ({
          ...item,
          orderId: order.id,
          tableName: order.tableName,
          customerName: order.customerName,
          createdAt: order.createdAt,
          priority: order.priority
        }));
    });
  };
  
  // Fonction pour mettre à jour le statut d'un élément de commande
  const updateItemStatus = useCallback((orderId: number, itemId: number, newStatus: 'pending' | 'preparing' | 'ready' | 'served') => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          });
          
          // Vérifier si toutes les commandes sont servies pour mettre à jour le statut de la commande
          const allServed = updatedItems.every(item => item.status === 'served');
          
          return { 
            ...order, 
            items: updatedItems,
            status: allServed ? 'completed' as const : order.status,
            updatedAt: new Date()
          };
        }
        return order;
      })
    );
    
    // Notification
    toast({
      title: "Statut mis à jour",
      description: `L'élément a été marqué comme ${
        newStatus === 'pending' ? 'en attente' :
        newStatus === 'preparing' ? 'en préparation' :
        newStatus === 'ready' ? 'prêt à servir' : 'servi'
      }`,
      variant: "default",
    });
  }, [toast]);
  
  // Fonction pour obtenir la couleur de badge selon la priorité
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'boissons':
        return <Coffee className="h-4 w-4 mr-1" />;
      case 'cocktails':
        return <Wine className="h-4 w-4 mr-1" />;
      case 'plats':
        return <Utensils className="h-4 w-4 mr-1" />;
      case 'snacks':
        return <Pizza className="h-4 w-4 mr-1" />;
      case 'desserts':
        return <CakeSlice className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Fonction pour estimer le temps d'attente
  const getEstimatedWaitTime = (item: any, order: any) => {
    if (item.status === 'served') return 'Servi';
    if (item.status === 'ready') return 'Prêt';
    
    if (order.estimatedCompletionTime) {
      const now = new Date();
      const timeLeft = Math.max(0, Math.floor((order.estimatedCompletionTime.getTime() - now.getTime()) / 60000));
      return `~${timeLeft} min`;
    }
    
    return item.preparationTime ? `~${item.preparationTime} min` : 'En attente';
  };
  
  // Composant pour afficher un élément de commande avec actions
  const OrderItemCard = ({ item, order }: { item: any, order: any }) => {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center">
                <span className="font-bold">{item.productName}</span>
                <Badge variant="outline" className="ml-2">x{item.quantity}</Badge>
              </div>
              <CardDescription>
                {order.tableName || order.customerName || `Commande #${order.orderId}`}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className={getPriorityBadgeColor(order.priority)}>
                {order.priority === 'high' ? 'Prioritaire' : 
                 order.priority === 'low' ? 'Basse' : 'Normal'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center mb-2">
            <Badge variant="outline" className="flex items-center">
              {getCategoryIcon(item.category)}
              {item.category}
            </Badge>
            <Badge variant="outline" className="ml-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {getEstimatedWaitTime(item, order)}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div>
            <Badge 
              className={`
                ${item.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                ${item.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${item.status === 'ready' ? 'bg-green-100 text-green-800' : ''}
                ${item.status === 'served' ? 'bg-blue-100 text-blue-800' : ''}
              `}
            >
              {item.status === 'pending' ? 'En attente' : 
               item.status === 'preparing' ? 'En préparation' : 
               item.status === 'ready' ? 'Prêt à servir' : 'Servi'}
            </Badge>
          </div>
          <div className="flex space-x-2">
            {item.status === 'pending' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateItemStatus(order.orderId, item.id, 'preparing')}
              >
                Commencer
              </Button>
            )}
            
            {item.status === 'preparing' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateItemStatus(order.orderId, item.id, 'ready')}
              >
                Prêt
              </Button>
            )}
            
            {item.status === 'ready' && (
              <Button 
                size="sm" 
                variant="default"
                onClick={() => updateItemStatus(order.orderId, item.id, 'served')}
              >
                Servir
              </Button>
            )}
            
            {item.status === 'served' && (
              <Badge variant="outline" className="flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Back Office - Cuisine</h1>
            <p className="text-muted-foreground">Gérez les commandes à préparer par catégorie</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{pendingItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En préparation</p>
                <p className="text-2xl font-bold">{preparingItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-yellow-100">
                <Utensils className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prêt à servir</p>
                <p className="text-2xl font-bold">{readyItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servis</p>
                <p className="text-2xl font-bold">{servedItems}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Label className="mr-2">Statut:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prêt à servir</SelectItem>
                <SelectItem value="served">Servi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <Label className="mr-2">Catégorie:</Label>
            <Select value={categoryFilter} onValueChange={setcategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
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
            <Label className="mr-2">Priorité:</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="high">Prioritaire</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Toutes les commandes</TabsTrigger>
            {uniqueCategories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            {getFilteredItems().length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucune commande trouvée</h3>
                <p className="text-muted-foreground">Ajustez vos filtres ou attendez de nouvelles commandes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {getFilteredItems()
                  .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
                  .sort((a, b) => {
                    // Trier par priorité d'abord
                    const priorityOrder = { high: 0, normal: 1, low: 2 };
                    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                                         priorityOrder[b.priority as keyof typeof priorityOrder];
                    
                    if (priorityDiff !== 0) return priorityDiff;
                    
                    // Puis par statut
                    const statusOrder = { pending: 0, preparing: 1, ready: 2, served: 3 };
                    const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - 
                                      statusOrder[b.status as keyof typeof statusOrder];
                    
                    if (statusDiff !== 0) return statusDiff;
                    
                    // Enfin par heure de création
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((item, index) => (
                    <OrderItemCard 
                      key={`${item.orderId}-${item.id}`} 
                      item={item} 
                      order={item} 
                    />
                  ))
                }
              </div>
            )}
          </TabsContent>
          
          {uniqueCategories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {getFilteredItems()
                  .filter(item => item.category === category)
                  .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
                  .filter(item => statusFilter === 'all' || item.status === statusFilter)
                  .sort((a, b) => {
                    // Trier par priorité d'abord
                    const priorityOrder = { high: 0, normal: 1, low: 2 };
                    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                                         priorityOrder[b.priority as keyof typeof priorityOrder];
                    
                    if (priorityDiff !== 0) return priorityDiff;
                    
                    // Puis par statut
                    const statusOrder = { pending: 0, preparing: 1, ready: 2, served: 3 };
                    const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - 
                                      statusOrder[b.status as keyof typeof statusOrder];
                    
                    if (statusDiff !== 0) return statusDiff;
                    
                    // Enfin par heure de création
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  })
                  .map((item, index) => (
                    <OrderItemCard 
                      key={`${item.orderId}-${item.id}`} 
                      item={item} 
                      order={item} 
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