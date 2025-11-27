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
import { api } from '../../services/api';

// Fonctions de normalisation pour les données API
function normalizeTable(apiTable: any): POSTable {
  return {
    id: apiTable.id,
    name: apiTable.name,
    number: apiTable.number,
    area: apiTable.area,
    capacity: apiTable.capacity,
    status: apiTable.status,
    currentOrderId: apiTable.current_order_id,
    reservationInfo: apiTable.reservation_info ? {
      userId: apiTable.reservation_info.user_id,
      userName: apiTable.reservation_info.user_name,
      reservationTime: apiTable.reservation_info.reservation_time,
      partySize: apiTable.reservation_info.party_size,
      notes: apiTable.reservation_info.notes
    } : undefined
  };
}

function normalizeOrder(apiOrder: any, orderItems: any[] = []): Order {
  return {
    id: apiOrder.id,
    tableId: apiOrder.table_id,
    tableName: apiOrder.table_name,
    customerName: apiOrder.customer_name,
    items: orderItems.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal || item.price * item.quantity
    })),
    status: apiOrder.status,
    total: apiOrder.total,
    createdAt: new Date(apiOrder.created_at),
    updatedAt: new Date(apiOrder.updated_at),
    paymentMethod: apiOrder.payment_method
  };
}

const POSTablesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("floor-plan");
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // États pour les données
  const [tables, setTables] = useState<POSTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // États pour les modals
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<POSTable | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'table' | 'order', id: number } | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    loadTables();
    loadOrders();
    loadProducts();
    loadCategories();
  }, []);

  const loadTables = async () => {
    try {
      const data = await api.getAllPosTables();
      setTables(data.map(normalizeTable));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les tables",
        variant: "destructive",
      });
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await api.getAllOrders();

      // Pour chaque commande, récupérer les order_items
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order: any) => {
          try {
            const itemsData = await api.getOrderItemsByOrderId(order.id);
            return normalizeOrder(order, itemsData);
          } catch (error) {
            console.error(`Erreur lors du chargement des items pour la commande ${order.id}:`, error);
            return normalizeOrder(order, []);
          }
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getAllProducts();
      setProducts(data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category_id,
        categoryName: product.category_name,
        isAvailable: product.is_available,
        imageUrl: product.image_url
      })));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getAllProductCategories();
      setCategories(data.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.is_active,
        productCount: category.product_count
      })));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    }
  };

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
      (order.tableName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      order.id.toString().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Callbacks pour la gestion des tables
  const handleAddTable = useCallback(() => {
    // code
  }, []);

  const handleEditTable = useCallback((table: POSTable) => {
    // code
  }, []);

  const handleDeleteTable = useCallback((tableId: number) => {
    // code
  }, [orders, toast]);

  const handleSaveTable = useCallback(async (table: POSTable) => {
    // code
  }, [toast]);

  // Callbacks pour la gestion des commandes
  const handleAddOrder = useCallback((tableId?: number) => {
    setEditingOrder(null); // Réinitialiser la commande en édition
    setSelectedTableId(tableId || null); // Définir l'ID de la table sélectionnée
    setIsOrderModalOpen(true); // Ouvre le modal de commande
  }, []);

  const handleEditOrder = useCallback((order: Order) => {
    // code
  }, []);

  const handleDeleteOrder = useCallback((orderId: number) => {
    // code
  }, []);

  const handleCompleteOrder = useCallback(async (orderId: number) => {
    // code
  }, [orders, tables, toast]);

  const handleSaveOrder = useCallback(async (order: Order) => {
    setIsLoading(true);
    try {
      if (order.id) {
        // Mise à jour d'une commande existante
        await api.updateOrder(order.id, {
          table_id: order.tableId || null,
          customer_name: order.customerName || null,
          status: order.status,
          total: order.total,
          payment_method: order.paymentMethod
        });

        // Mettre à jour les items existants ou en créer de nouveaux
        await Promise.all(
          order.items.map(async (item) => {
            if (item.id && item.id > 0) {
              // Mettre à jour un item existant
              await api.updateOrderItem(item.id, {
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal
              });
            } else {
              // Créer un nouvel item
              await api.createOrderItem({
                order_id: order.id!,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
                status: 'pending'
              });
            }
          })
        );

        toast({
          title: "Commande mise à jour",
          description: `La commande #${order.id} a été mise à jour avec succès.`,
          variant: "default",
        });
      } else {
        // Création d'une nouvelle commande
        const newOrderData = {
          table_id: order.tableId || null,
          customer_name: order.customerName || null,
          status: order.status || 'pending',
          total: order.total,
          payment_method: order.paymentMethod || 'pending'
        };

        // Créer la commande
        const newOrder = await api.createOrder(newOrderData);

        // Créer automatiquement les OrderItems pour chaque produit
        await Promise.all(
          order.items.map(async (item) => {
            await api.createOrderItem({
              order_id: newOrder.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal,
              status: 'pending'
            });
          })
        );

        // Si la commande est liée à une table, mettre à jour son statut
        if (order.tableId) {
          await api.updatePosTable(order.tableId, {
            status: 'occupied',
            current_order_id: newOrder.id
          });
        }

        toast({
          title: "Commande créée",
          description: `La commande #${newOrder.id} a été créée avec succès.`,
          variant: "default",
        });
      }

      // Recharger les données
      await Promise.all([loadOrders(), loadTables()]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la commande:', error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const confirmDeleteItem = useCallback(async () => {
    // code
  }, [itemToDelete, orders, toast]);

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

  const getTableNameFromId = useCallback((tableId: number): string => {
    const table = tables.find(t => t.id === tableId);
    return table ? `${table.name}` : `Table ${tableId}`;
  }, [tables]);

  // Effet initial pour préremplir la commande avec la table sélectionnée
  useEffect(() => {
    // Ne pas exécuter si on est déjà en train d'éditer une commande spécifique
    if (editingOrder) return;

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
  }, [selectedTableId, isOrderModalOpen, tables, getTableOrder, editingOrder]);
  
  return (
    <POSLayout>
      <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
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
                ${table.status === 'available' ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-200' : ''}
                ${table.status === 'occupied' ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200' : ''}
                ${table.status === 'reserved' ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200' : ''}
                hover:shadow-md transition-shadow
            `}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{table.number}</div>
                            <div className="text-sm truncate">{table.name}</div>
                            <div className="text-xs mt-1">{table.capacity} places</div>
                          </div>

                          <div className="absolute top-2 right-2 flex space-x-1">
                            {table.status === 'occupied' && (
                              <Button size="icon" variant="ghost" className="h-6 w-6">
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

                          {table.status === 'reserved' && table.reservationInfo && (
                            <div className="text-xs font-medium text-center mt-2 space-y-1">
                              <div className="font-semibold">{table.reservationInfo.userName}</div>
                              <div>{table.reservationInfo.reservationTime}</div>
                              <div>{table.reservationInfo.partySize} pers.</div>
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
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
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
                    <div className="grid w-full max-w-sm items-center gap-2">
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
                      <Card key={table.id} className={`overflow-hidden ${table.status === 'available' ? 'border-green-200' :
                        table.status === 'reserved' ? 'border-orange-200' :
                          'border-blue-200'
                        }`}>
                        <CardHeader className={`pb-2 ${table.status === 'available' ? 'bg-green-50' :
                          table.status === 'reserved' ? 'bg-orange-50' :
                            'bg-blue-50'
                          }`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              <span className='text-gray-700'>{table.name}</span>
                              {table.number && <span className="text-muted-foreground ml-1">#{table.number}</span>}
                            </CardTitle>
                            <Badge
                              className={`${table.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
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
                              {order.tableId ? (
                                getTableNameFromId(order.tableId)
                              ) : (
                                <span className="text-muted-foreground italic">À emporter</span>
                              )}
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
                                className={`${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
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
      </div>
    </POSLayout>
  );
};

export default POSTablesPage;
