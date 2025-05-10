import React, { useState, useCallback, useEffect } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import {
  Search,
  PlusCircle,
  Settings,
  Trash,
  Edit,
  Printer,
  MoreHorizontal,
  PlusSquare,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  Coffee,
  CreditCard
} from 'lucide-react';

import TableManagementModal, { POSTable } from '../../components/TableManagementModal';
import OrderModal, { Order, OrderItem } from '../../components/OrderModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { Product } from '../../components/ProductModal';
import { ProductCategory } from '../../components/ProductCategoryModal';

// Données fictives pour les tables
const initialTables: POSTable[] = [
  { id: 1, name: "Table 1", number: 1, area: "Terrasse", capacity: 4, status: "available" as const },
  { id: 2, name: "Table 2", number: 2, area: "Terrasse", capacity: 2, status: "occupied" as const, currentOrderId: 101 },
  { id: 3, name: "Table 3", number: 3, area: "Terrasse", capacity: 4, status: "available" as const },
  { id: 4, name: "Table 4", number: 4, area: "Intérieur", capacity: 6, status: "reserved" as const },
  { id: 5, name: "Table 5", number: 5, area: "Intérieur", capacity: 4, status: "available" as const },
  { id: 6, name: "Table 6", number: 6, area: "Intérieur", capacity: 4, status: "occupied" as const, currentOrderId: 102 },
  { id: 7, name: "Table 7", number: 7, area: "Intérieur", capacity: 8, status: "available" as const },
  { id: 8, name: "VIP Lounge 1", number: 8, area: "VIP", capacity: 10, status: "reserved" as const },
  { id: 9, name: "VIP Lounge 2", number: 9, area: "VIP", capacity: 8, status: "occupied" as const, currentOrderId: 103 },
  { id: 10, name: "Bar 1", number: 10, area: "Bar", capacity: 2, status: "available" as const },
  { id: 11, name: "Bar 2", number: 11, area: "Bar", capacity: 2, status: "occupied" as const, currentOrderId: 104 },
  { id: 12, name: "Bar 3", number: 12, area: "Bar", capacity: 2, status: "available" as const },
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

// Données fictives pour les catégories
const initialCategories: ProductCategory[] = [
  { id: 1, name: "Boissons", description: "Boissons fraîches et chaudes", isActive: true, productCount: 8 },
  { id: 2, name: "Cocktails", description: "Cocktails avec et sans alcool", isActive: true, productCount: 12 },
  { id: 3, name: "Snacks", description: "Petites collations", isActive: true, productCount: 6 },
  { id: 4, name: "Plats", description: "Plats principaux", isActive: true, productCount: 4 },
  { id: 5, name: "Desserts", description: "Pâtisseries et desserts", isActive: true, productCount: 3 },
];

// Données fictives pour les commandes
const initialOrders: Order[] = [
  {
    id: 101,
    tableId: 2,
    tableName: "Table 2",
    items: [
      { id: 1, productId: 1, productName: "Coca-Cola", quantity: 2, unitPrice: 5000, subtotal: 10000 },
      { id: 2, productId: 7, productName: "Burger", quantity: 2, unitPrice: 25000, subtotal: 50000 }
    ],
    status: "processing" as const,
    total: 60000,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentMethod: "pending" as const
  },
  {
    id: 102,
    tableId: 6,
    tableName: "Table 6",
    items: [
      { id: 3, productId: 3, productName: "Mojito", quantity: 4, unitPrice: 15000, subtotal: 60000 },
      { id: 4, productId: 5, productName: "Chips", quantity: 2, unitPrice: 5000, subtotal: 10000 }
    ],
    status: "processing" as const,
    total: 70000,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentMethod: "pending" as const
  },
  {
    id: 103,
    tableId: 9,
    tableName: "VIP Lounge 2",
    customerName: "Groupe VIP",
    items: [
      { id: 5, productId: 4, productName: "Piña Colada", quantity: 8, unitPrice: 15000, subtotal: 120000 },
      { id: 6, productId: 6, productName: "Cacahuètes", quantity: 4, unitPrice: 4000, subtotal: 16000 },
      { id: 7, productId: 8, productName: "Pizza Margherita", quantity: 3, unitPrice: 30000, subtotal: 90000 }
    ],
    status: "processing" as const,
    total: 226000,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentMethod: "pending" as const
  },
  {
    id: 104,
    tableId: 11,
    tableName: "Bar 2",
    items: [
      { id: 8, productId: 2, productName: "Eau minérale", quantity: 1, unitPrice: 3000, subtotal: 3000 },
      { id: 9, productId: 5, productName: "Chips", quantity: 1, unitPrice: 5000, subtotal: 5000 }
    ],
    status: "completed" as const,
    total: 8000,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentMethod: "cash" as const
  },
  {
    id: 105,
    items: [
      { id: 10, productId: 7, productName: "Burger", quantity: 2, unitPrice: 25000, subtotal: 50000 },
      { id: 11, productId: 10, productName: "Mousse au chocolat", quantity: 2, unitPrice: 10000, subtotal: 20000 }
    ],
    status: "completed" as const,
    customerName: "Client à emporter",
    total: 70000,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3550000),
    paymentMethod: "card" as const
  }
];

const POSTablesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("floor-plan");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  
  // États pour les données
  const [tables, setTables] = useState<POSTable[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<ProductCategory[]>(initialCategories);
  
  // États pour les modals
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<POSTable | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'table' | 'order', id: number } | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Obtenir les zones/emplacements uniques
  const uniqueAreas = Array.from(new Set(tables.map(table => table.area)));
  
  // Regrouper les tables par zone pour le plan de tables
  const tablesByArea = uniqueAreas.reduce((acc, area) => {
    acc[area] = tables.filter(table => table.area === area);
    return acc;
  }, {} as Record<string, POSTable[]>);
  
  // Filtrer les tables
  const filteredTables = tables.filter(table => {
    const matchesSearch = 
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (table.number?.toString().includes(searchTerm) || false);
    const matchesArea = areaFilter === "all" || table.area === areaFilter;
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    
    return matchesSearch && matchesArea && matchesStatus;
  });
  
  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    const matchesSearch = 
      order.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.id.toString().includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });
  
  // Callbacks pour la gestion des tables
  const handleAddTable = useCallback(() => {
    setEditingTable(null);
    setIsTableModalOpen(true);
  }, []);
  
  const handleEditTable = useCallback((table: POSTable) => {
    setEditingTable(table);
    setIsTableModalOpen(true);
  }, []);
  
  const handleDeleteTable = useCallback((tableId: number) => {
    // Vérifier si la table a des commandes actives
    const hasActiveOrders = orders.some(o => o.tableId === tableId && (o.status === 'pending' || o.status === 'processing'));
    
    if (hasActiveOrders) {
      toast({
        title: "Impossible de supprimer",
        description: "Cette table a des commandes actives. Veuillez d'abord finaliser ou supprimer ces commandes.",
        variant: "destructive",
      });
    } else {
      setItemToDelete({ type: 'table', id: tableId });
      setIsDeleteModalOpen(true);
    }
  }, [orders, toast]);
  
  const handleSaveTable = useCallback((table: POSTable) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let updatedTables;
      const isNew = !tables.some(t => t.id === table.id);
      
      if (isNew) {
        updatedTables = [...tables, table];
        toast({
          title: "Table ajoutée",
          description: `La table "${table.name}" a été ajoutée avec succès.`,
          variant: "default",
        });
      } else {
        updatedTables = tables.map(t => t.id === table.id ? table : t);
        toast({
          title: "Table mise à jour",
          description: `La table "${table.name}" a été mise à jour avec succès.`,
          variant: "default",
        });
      }
      
      setTables(updatedTables);
      setIsLoading(false);
    }, 500);
  }, [tables, toast]);
  
  // Callbacks pour la gestion des commandes
  const handleAddOrder = useCallback((tableId?: number) => {
    setEditingOrder(null);
    if (tableId) {
      const selectedTable = tables.find(t => t.id === tableId);
      if (selectedTable) {
        // Préremplir l'ordre avec la table sélectionnée
        setSelectedTableId(tableId);
      }
    } else {
      setSelectedTableId(null);
    }
    setIsOrderModalOpen(true);
  }, [tables]);
  
  const handleEditOrder = useCallback((order: Order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  }, []);
  
  const handleDeleteOrder = useCallback((orderId: number) => {
    setItemToDelete({ type: 'order', id: orderId });
    setIsDeleteModalOpen(true);
  }, []);
  
  const handleCompleteOrder = useCallback((orderId: number) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'completed' as const, updatedAt: new Date() };
        }
        return o;
      });
      
      setOrders(updatedOrders);
      
      // Si la commande est liée à une table, libérer la table
      const order = orders.find(o => o.id === orderId);
      if (order?.tableId) {
        const updatedTables = tables.map(t => {
          if (t.id === order.tableId) {
            return { ...t, status: 'available' as const, currentOrderId: undefined };
          }
          return t;
        });
        
        setTables(updatedTables);
      }
      
      setIsLoading(false);
      
      toast({
        title: "Commande terminée",
        description: `La commande #${orderId} a été marquée comme terminée.`,
        variant: "default",
      });
    }, 500);
  }, [orders, tables, toast]);
  
  const handleSaveOrder = useCallback((order: Order) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let updatedOrders;
      const isNew = !orders.some(o => o.id === order.id);
      
      if (isNew) {
        updatedOrders = [...orders, order];
        toast({
          title: "Commande créée",
          description: `La commande a été créée avec succès.`,
          variant: "default",
        });
        
        // Si la commande est liée à une table, marquer la table comme occupée
        if (order.tableId) {
          const updatedTables = tables.map(t => {
            if (t.id === order.tableId) {
              return { ...t, status: 'occupied' as const, currentOrderId: order.id };
            }
            return t;
          });
          
          setTables(updatedTables);
        }
      } else {
        updatedOrders = orders.map(o => o.id === order.id ? order : o);
        toast({
          title: "Commande mise à jour",
          description: `La commande #${order.id} a été mise à jour avec succès.`,
          variant: "default",
        });
      }
      
      setOrders(updatedOrders);
      setIsLoading(false);
    }, 500);
  }, [orders, tables, toast]);
  
  const confirmDeleteItem = useCallback(() => {
    if (!itemToDelete) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (itemToDelete.type === 'table') {
        const updatedTables = tables.filter(t => t.id !== itemToDelete.id);
        setTables(updatedTables);
        
        toast({
          title: "Table supprimée",
          description: "La table a été supprimée avec succès.",
          variant: "default",
        });
      } else if (itemToDelete.type === 'order') {
        const order = orders.find(o => o.id === itemToDelete.id);
        const updatedOrders = orders.filter(o => o.id !== itemToDelete.id);
        setOrders(updatedOrders);
        
        // Si la commande est liée à une table, libérer la table
        if (order?.tableId) {
          const updatedTables = tables.map(t => {
            if (t.id === order.tableId) {
              return { ...t, status: 'available' as const, currentOrderId: undefined };
            }
            return t;
          });
          
          setTables(updatedTables);
        }
        
        toast({
          title: "Commande supprimée",
          description: `La commande #${itemToDelete.id} a été supprimée avec succès.`,
          variant: "default",
        });
      }
      
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }, 500);
  }, [itemToDelete, orders, tables, toast]);
  
  // Sélectionner la commande d'une table
  const getTableOrder = useCallback((tableId: number) => {
    return orders.find(o => o.tableId === tableId && (o.status === 'pending' || o.status === 'processing'));
  }, [orders]);
  
  // Calculer les statistiques
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  const todayOrders = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });
  
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Effet initial pour préremplir la commande avec la table sélectionnée
  useEffect(() => {
    if (selectedTableId && isOrderModalOpen) {
      const selectedTable = tables.find(t => t.id === selectedTableId);
      if (selectedTable) {
        // Si la table a déjà une commande, l'éditer
        const existingOrder = getTableOrder(selectedTableId);
        if (existingOrder) {
          setEditingOrder(existingOrder);
        } else {
          // Sinon créer une nouvelle commande pour cette table
          setEditingOrder(null);
        }
      }
    }
  }, [selectedTableId, isOrderModalOpen, tables, getTableOrder]);
  
  return (
    <POSLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tables et Commandes</h1>
            <p className="text-muted-foreground">Gérez vos tables, prenez les commandes et suivez vos factures</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Chiffre du jour</CardTitle>
              <CardDescription>Total des ventes aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayRevenue.toLocaleString()} Ar</div>
              <p className="text-xs text-muted-foreground mt-1">{todayOrders.length} commandes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Tables</CardTitle>
              <CardDescription>État des tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTables}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{availableTables} disponibles</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{reservedTables} réservées</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{occupiedTables} occupées</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Commandes en cours</CardTitle>
              <CardDescription>Commandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingOrders + processingOrders}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">{pendingOrders} en attente</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{processingOrders} en cours</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Commandes terminées</CardTitle>
              <CardDescription>Commandes finalisées aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Ticket moyen: {todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length).toLocaleString() : 0} Ar</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="tables" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="floor-plan">Plan de tables</TabsTrigger>
            <TabsTrigger value="tables">Liste des tables</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>
          
          {/* Vue du plan de tables */}
          <TabsContent value="floor-plan">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Plan de tables</CardTitle>
                    <CardDescription>Vue d'ensemble des tables par zone</CardDescription>
                  </div>
                  <Button onClick={handleAddTable}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {uniqueAreas.map(area => (
                  <div key={area} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">{area}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {tablesByArea[area].map(table => (
                        <div 
                          key={table.id}
                          onClick={() => {
                            if (table.status === 'occupied') {
                              const order = getTableOrder(table.id);
                              if (order) {
                                handleEditOrder(order);
                              }
                            } else {
                              handleEditTable(table);
                            }
                          }}
                          className={`
                            p-4 rounded-md border-2 cursor-pointer relative
                            ${table.status === 'available' ? 'border-green-400 bg-green-50 dark:bg-green-950' : ''}
                            ${table.status === 'occupied' ? 'border-red-400 bg-red-50 dark:bg-red-950' : ''}
                            ${table.status === 'reserved' ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' : ''}
                            hover:shadow-md transition-shadow
                          `}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{table.number}</div>
                            <div className="text-sm truncate">{table.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{table.capacity} places</div>
                          </div>
                          
                          <div className="absolute top-2 right-2 flex space-x-1">
                            {table.status === 'occupied' && (
                              <Button size="icon" variant="ghost" className="h-6 w-6" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const order = getTableOrder(table.id);
                                  if (order) handleEditOrder(order);
                                }}>
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTable(table);
                              }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>

                          {table.status === 'available' && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddOrder(table.id);
                              }}
                            >
                              Nouvelle commande
                            </Button>
                          )}
                          
                          {table.status === 'occupied' && (
                            <div className="text-xs font-medium text-center mt-2">
                              {table.currentOrderId && `Commande #${table.currentOrderId}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Vue des Tables (liste) */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des tables</CardTitle>
                    <CardDescription>Gérez les tables de votre établissement</CardDescription>
                  </div>
                  <Button onClick={handleAddTable}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une table..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="area">Zone</Label>
                      <Select value={areaFilter} onValueChange={setAreaFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les zones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les zones</SelectItem>
                          {uniqueAreas.map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="status">Statut</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="reserved">Réservée</SelectItem>
                          <SelectItem value="occupied">Occupée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTables.map((table) => {
                    const tableOrder = getTableOrder(table.id);
                    return (
                      <Card key={table.id} className={`overflow-hidden ${
                        table.status === 'available' ? 'border-green-200' :
                        table.status === 'reserved' ? 'border-orange-200' :
                        'border-blue-200'
                      }`}>
                        <CardHeader className={`pb-2 ${
                          table.status === 'available' ? 'bg-green-50' :
                          table.status === 'reserved' ? 'bg-orange-50' :
                          'bg-blue-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {table.name}
                              {table.number && <span className="text-muted-foreground ml-1">#{table.number}</span>}
                            </CardTitle>
                            <Badge 
                              className={`${
                                table.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                table.status === 'reserved' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              }`}>
                              {table.status === 'available' ? 'Disponible' :
                               table.status === 'reserved' ? 'Réservée' :
                               'Occupée'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {table.area} - {table.capacity} places
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          {table.status === 'occupied' && tableOrder ? (
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-semibold">Commande en cours:</span> #{tableOrder.id}
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Montant:</span> {tableOrder.total.toLocaleString()} Ar
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Articles:</span> {tableOrder.items.length}
                              </div>
                            </div>
                          ) : table.status === 'reserved' ? (
                            <div className="text-sm">
                              <span className="font-semibold">Réservation en attente</span>
                            </div>
                          ) : (
                            <div className="text-sm">
                              <span className="font-semibold">Prête à être occupée</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                          {table.status === 'occupied' && tableOrder ? (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEditOrder(tableOrder)}>
                                <Edit className="mr-1 h-3 w-3" />
                                Voir
                              </Button>
                              <Button size="sm" onClick={() => handleCompleteOrder(tableOrder.id)}>
                                <DollarSign className="mr-1 h-3 w-3" />
                                Encaisser
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleAddOrder(table.id)}>
                                <PlusSquare className="mr-1 h-3 w-3" />
                                Commande
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleEditTable(table)}>
                            <Settings className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive" 
                            onClick={() => handleDeleteTable(table.id)}
                            disabled={table.status === 'occupied'}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Vue des Commandes */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des commandes</CardTitle>
                    <CardDescription>Gérez les commandes et factures</CardDescription>
                  </div>
                  <Button onClick={() => handleAddOrder()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle commande
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une commande..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="orderStatus">Statut</Label>
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Table</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Articles</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Paiement</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle font-medium">#{order.id}</td>
                            <td className="p-4 align-middle">
                              {order.tableName ? order.tableName : <span className="text-muted-foreground italic">À emporter</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {order.customerName || <span className="text-muted-foreground italic">—</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {order.items.length} {order.items.length === 1 ? 'article' : 'articles'}
                            </td>
                            <td className="p-4 align-middle font-semibold">
                              {order.total.toLocaleString()} Ar
                            </td>
                            <td className="p-4 align-middle">
                              <Badge 
                                className={`${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                  order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                  'bg-red-100 text-red-800 hover:bg-red-100'
                                }`}>
                                {order.status === 'pending' ? 'En attente' :
                                 order.status === 'processing' ? 'En cours' :
                                 order.status === 'completed' ? 'Terminée' :
                                 'Annulée'}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              {order.paymentMethod === 'cash' && <span className="text-sm">Espèces</span>}
                              {order.paymentMethod === 'card' && <span className="text-sm">Carte</span>}
                              {order.paymentMethod === 'mobile' && <span className="text-sm">Mobile</span>}
                              {order.paymentMethod === 'pending' && <span className="text-sm text-muted-foreground italic">En attente</span>}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  onClick={() => handleEditOrder(order)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Voir/Modifier</span>
                                </Button>
                                {(order.status === 'pending' || order.status === 'processing') && (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCompleteOrder(order.id)}
                                  >
                                    <DollarSign className="h-4 w-4" />
                                    <span className="sr-only">Encaisser</span>
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => { /* Implementer la fonction d'impression */ }}
                                >
                                  <Printer className="h-4 w-4" />
                                  <span className="sr-only">Imprimer</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleDeleteOrder(order.id)}
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
      <TableManagementModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onSave={handleSaveTable}
        editingTable={editingTable}
      />
      
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        tables={tables}
        products={products}
        categories={categories}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteItem}
        title={`Supprimer ${itemToDelete?.type === 'table' ? 'la table' : 'la commande'}`}
        description={`Êtes-vous sûr de vouloir supprimer ${itemToDelete?.type === 'table' ? 'cette table' : 'cette commande'} ? Cette action est irréversible.`}
        isLoading={isLoading}
      />
    </POSLayout>
  );
};

export default POSTablesPage;