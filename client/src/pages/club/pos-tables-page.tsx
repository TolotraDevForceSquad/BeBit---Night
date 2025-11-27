// pos-tables-page.tsx
import React, { useEffect, useState } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  PlusCircle,
  Settings,
  Trash,
  Edit,
  Printer,
  PlusSquare,
  DollarSign,
  FileText,
  Tag,
  Users,
  Clock,
  TrendingUp,
  Check
} from 'lucide-react';
import { api } from '../../services/api'; // Import the ApiClient instance
import { PosTable, InsertPosTable, Order, OrderItem, Product, ProductCategory, InsertOrder, InsertOrderItem } from '@shared/schema'; // Import types from schema.ts
import OrderModal from '@/components/OrderModal';
import AlertModal from '@/components/AlertModal';
import TableManagementModal, { POSTable } from '@/components/TableManagementModal';

const POSTablesPage = () => {
  // State for data and loading/error
  const [tables, setTables] = useState<PosTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for order modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [initialTableId, setInitialTableId] = useState<number | undefined>(undefined);

  // State for table management modal
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<PosTable | null>(null);

  // State for delete table confirmation modal
  const [isDeleteTableModalOpen, setIsDeleteTableModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<number | null>(null);
  const [isDeletingTable, setIsDeletingTable] = useState(false);

  // State for delete order confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for checkout confirmation modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderToCheckout, setOrderToCheckout] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // State for alert modal
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertDescription, setAlertDescription] = useState<string>('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'warning' | 'error' | 'danger'>('success');

  // States for tables filters
  const [tableSearch, setTableSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedTableStatus, setSelectedTableStatus] = useState('all');

  // States for orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all necessary data in parallel
        const [tablesData, ordersData, orderItemsData, productsData, categoriesData] = await Promise.all([
          api.getAllPosTables(),
          api.getAllOrders(),
          api.getAllOrderItems(),
          api.getAllProducts(),
          api.getAllProductCategories(),
        ]);

        setTables(tablesData);
        setOrders(ordersData);
        setOrderItems(orderItemsData);
        setProducts(productsData);
        setCategories(categoriesData);

        // Afficher toutes les données en JSON
        console.log('Tables : ', JSON.stringify(tablesData, null, 2));
        console.log('Orders : ', JSON.stringify(ordersData, null, 2));
        console.log('Order Items : ', JSON.stringify(orderItemsData, null, 2));
        console.log('Produits : ', JSON.stringify(productsData, null, 2));
        console.log('Catégories : ', JSON.stringify(categoriesData, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle save order (create or update)
  const handleSaveOrder = async (orderData: Partial<InsertOrder>, itemsData: InsertOrderItem[]) => {
    try {
      let order: Order;
      let oldTableId: number | null = null;
      if (editingOrder) {
        oldTableId = editingOrder.tableId;
        // Update order
        order = await api.updateOrder(editingOrder.id, orderData);

        // Fetch current existing items
        const existingItems = await api.getOrderItemsByOrderId(order.id);

        // Create map of new items by productId (assuming one per product)
        const newItemMap: Map<number, InsertOrderItem> = new Map(
          itemsData.map(item => [item.productId, item])
        );

        // Process updates and deletes
        for (const existing of existingItems) {
          const newData = newItemMap.get(existing.productId);
          if (newData) {
            // Update existing item (only the fields managed in modal)
            await api.updateOrderItem(existing.id, {
              quantity: newData.quantity,
              price: newData.price,
              notes: newData.notes,
              subtotal: newData.subtotal,
            });
            newItemMap.delete(existing.productId);
          } else {
            // Delete removed item
            await api.deleteOrderItem(existing.id);
          }
        }

        // Create new items (remaining in map)
        for (const remaining of newItemMap.values()) {
          await api.createOrderItem({ ...remaining, orderId: order.id });
        }
      } else {
        // Create new order
        order = await api.createOrder(orderData as InsertOrder);

        // Create order items
        for (const item of itemsData) {
          await api.createOrderItem({ ...item, orderId: order.id });
        }
      }

      // Handle table status updates
      const newTableId = order.tableId;
      if (oldTableId !== newTableId) {
        if (oldTableId !== null) {
          await api.updatePosTable(oldTableId, { status: 'available', currentOrderId: null });
        }
        if (newTableId !== null) {
          await api.updatePosTable(newTableId, { status: 'occupied', currentOrderId: order.id });
        }
      } else if (newTableId !== null) {
        // Ensure occupied if same table
        await api.updatePosTable(newTableId, { status: 'occupied', currentOrderId: order.id });
      }

      // Refresh data
      const [newOrders, newOrderItems, newTables] = await Promise.all([
        api.getAllOrders(),
        api.getAllOrderItems(),
        api.getAllPosTables(),
      ]);
      setOrders(newOrders);
      setOrderItems(newOrderItems);
      setTables(newTables);

      setAlertTitle('Succès');
      setAlertDescription(editingOrder ? 'Commande modifiée avec succès' : 'Commande ajoutée avec succès');
      setAlertType('success');
      setAlertOpen(true);

      setIsModalOpen(false);
      setEditingOrder(null);
      setInitialTableId(undefined);
    } catch (err) {
      console.error('Failed to save order:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save order';
      setAlertTitle('Erreur');
      setAlertDescription(errorMsg);
      setAlertType('error');
      setAlertOpen(true);
    }
  };

  // Handle save table (create or update)
  const handleSaveTable = async (tableData: POSTable) => {
    try {
      let savedTable: PosTable;
      if (editingTable) {
        const { id, ...updateData } = tableData;
        savedTable = await api.updatePosTable(editingTable.id, updateData);
      } else {
        const { id, ...createData } = tableData;
        savedTable = await api.createPosTable(createData as InsertPosTable);
      }

      // Refresh tables
      const newTables = await api.getAllPosTables();
      setTables(newTables);

      setAlertTitle('Succès');
      setAlertDescription(editingTable ? 'Table modifiée avec succès' : 'Table ajoutée avec succès');
      setAlertType('success');
      setAlertOpen(true);

      setIsTableModalOpen(false);
      setEditingTable(null);
    } catch (err) {
      console.error('Failed to save table:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save table';
      setAlertTitle('Erreur');
      setAlertDescription(errorMsg);
      setAlertType('error');
      setAlertOpen(true);
    }
  };

  // Handle delete table
  const handleDeleteTable = async () => {
    if (!tableToDelete) return;

    try {
      setIsDeletingTable(true);

      await api.deletePosTable(tableToDelete);

      // Refresh tables
      const newTables = await api.getAllPosTables();
      setTables(newTables);

      setAlertTitle('Succès');
      setAlertDescription('Table supprimée avec succès');
      setAlertType('success');
      setAlertOpen(true);

      setIsDeleteTableModalOpen(false);
      setTableToDelete(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete table';
      setAlertTitle('Erreur');
      setAlertDescription(errorMsg);
      setAlertType('error');
      setAlertOpen(true);
    } finally {
      setIsDeletingTable(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setIsDeleting(true);

      // Fetch the order to get its tableId
      const order = orders.find(o => o.id === orderToDelete);
      const tableId = order?.tableId;

      // Delete the order
      await api.deleteOrder(orderToDelete);

      // If the order was associated with a table, update the table status
      if (tableId) {
        await api.updatePosTable(tableId, { status: 'available', currentOrderId: null });
      }

      // Refresh data
      const [newOrders, newOrderItems, newTables] = await Promise.all([
        api.getAllOrders(),
        api.getAllOrderItems(),
        api.getAllPosTables(),
      ]);
      setOrders(newOrders);
      setOrderItems(newOrderItems);
      setTables(newTables);

      setAlertTitle('Succès');
      setAlertDescription('Suppression réussie');
      setAlertType('success');
      setAlertOpen(true);

      // Close the delete modal
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete order';
      setAlertTitle('Erreur');
      setAlertDescription(errorMsg);
      setAlertType('error');
      setAlertOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle open checkout confirmation
  const openCheckoutModal = (orderId: number) => {
    setOrderToCheckout(orderId);
    setIsCheckoutModalOpen(true);
  };

  // Confirm checkout
  const confirmCheckout = async () => {
    if (!orderToCheckout) return;

    setIsCheckingOut(true);

    try {
      // Fetch the order
      const order = await api.getOrder(orderToCheckout);

      // Update order to completed, set paymentMethod if null (default to 'cash')
      const updateData: Partial<InsertOrder> = {
        status: 'completed',
        paymentMethod: order.paymentMethod || 'cash',
      };
      await api.updateOrder(orderToCheckout, updateData);

      // If tableId, update table to available
      if (order.tableId) {
        await api.updatePosTable(order.tableId, { status: 'available', currentOrderId: null });
      }

      // Refresh data
      const [newOrders, newOrderItems, newTables] = await Promise.all([
        api.getAllOrders(),
        api.getAllOrderItems(),
        api.getAllPosTables(),
      ]);
      setOrders(newOrders);
      setOrderItems(newOrderItems);
      setTables(newTables);

      setAlertTitle('Succès');
      setAlertDescription('Encaissement réussi');
      setAlertType('success');
      setAlertOpen(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to checkout order';
      setAlertTitle('Erreur');
      setAlertDescription(errorMsg);
      setAlertType('error');
      setAlertOpen(true);
    } finally {
      setIsCheckingOut(false);
      setIsCheckoutModalOpen(false);
      setOrderToCheckout(null);
    }
  };

  // Open delete confirmation modal for order
  const openDeleteModal = (orderId: number) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  // Open delete confirmation modal for table
  const openDeleteTableModal = (tableId: number) => {
    setTableToDelete(tableId);
    setIsDeleteTableModalOpen(true);
  };

  // Obtenir les zones/emplacements uniques
  const uniqueAreas = Array.from(new Set(tables.map(table => table.area)));

  // Regrouper les tables par zone pour le plan de tables
  const tablesByArea = uniqueAreas.reduce((acc, area) => {
    acc[area ?? 'Unknown'] = tables.filter(table => table.area === area);
    return acc;
  }, {} as Record<string, PosTable[]>);

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

  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total ?? 0), 0);

  // Filtered tables for the list view
  const filteredTables = tables.filter(table => {
    const searchLower = tableSearch.toLowerCase();
    const matchesSearch =
      (table.name?.toLowerCase().includes(searchLower) || false) ||
      (table.number?.toString().includes(searchLower) || false) ||
      ((table.area ?? 'Unknown').toLowerCase().includes(searchLower) || false);
    const matchesArea = selectedArea === 'all' || (table.area ?? 'Unknown') === selectedArea;
    const matchesStatus = selectedTableStatus === 'all' || table.status === selectedTableStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });

  // Filtered orders for the list view
  const filteredOrders = orders.filter(order => {
    const searchLower = orderSearch.toLowerCase();
    const table = tables.find(t => t.id === order.tableId);
    const tableName = table?.name?.toLowerCase() || 'à emporter';
    const matchesSearch =
      order.id.toString().includes(searchLower) ||
      (order.customerName?.toLowerCase().includes(searchLower) || false) ||
      tableName.includes(searchLower) ||
      (table?.number?.toString().includes(searchLower) || false);
    const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus;
    return matchesSearch && matchesStatus;
  });

  // Group order items by category for a given order
  const getGroupedOrderItems = (orderId: number) => {
    const items = orderItems.filter(item => item.orderId === orderId);
    const grouped: { [key: number]: OrderItem[] } = {};
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const categoryId = product?.categoryId || 0;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <POSLayout>
        <div className="p-6 space-y-6 bg-black text-white">
          <p className="text-gray-300">Chargement...</p>
        </div>
      </POSLayout>
    );
  }

  if (error) {
    return (
      <POSLayout>
        <div className="p-6 space-y-6 bg-black text-white">
          <p className="text-red-400">Erreur: {error}</p>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="p-6 space-y-6 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Tag className="h-8 w-8 text-pink-400" />
              Tables et Commandes
            </h1>
            <p className="text-gray-300 mt-1">Gérez vos tables, prenez les commandes et suivez vos factures en toute simplicité</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg font-semibold text-white">Chiffre du jour</CardTitle>
              </div>
              <CardDescription className="text-gray-300">Total des ventes aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-400">{todayRevenue.toLocaleString()} Ar</div>
              <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {todayOrders.length} commandes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-lg font-semibold text-white">Tables</CardTitle>
              </div>
              <CardDescription className="text-gray-300">État des tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{totalTables}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge className="bg-green-900/30 text-green-400 border border-green-800/50 text-xs">{availableTables} disponibles</Badge>
                <Badge className="bg-orange-900/30 text-orange-400 border border-orange-800/50 text-xs">{reservedTables} réservées</Badge>
                <Badge className="bg-blue-900/30 text-blue-400 border border-blue-800/50 text-xs">{occupiedTables} occupées</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-lg font-semibold text-white">Commandes en cours</CardTitle>
              </div>
              <CardDescription className="text-gray-300">Commandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{pendingOrders + processingOrders}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 text-xs">{pendingOrders} en attente</Badge>
                <Badge className="bg-blue-900/30 text-blue-400 border border-blue-800/50 text-xs">{processingOrders} en cours</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg font-semibold text-white">Commandes terminées</CardTitle>
              </div>
              <CardDescription className="text-gray-300">Commandes finalisées aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{completedOrders}</div>
              <p className="text-sm text-gray-300 mt-1">
                Ticket moyen: {todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length).toLocaleString() : 0} Ar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6 bg-black text-gray-300 rounded-xl p-1 border border-gray-800">
            <TabsTrigger
              value="floor-plan"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              Plan de tables
            </TabsTrigger>
            <TabsTrigger
              value="tables"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Liste des tables
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg"
            >
              <Clock className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
          </TabsList>

          {/* Vue du plan de tables */}
          <TabsContent value="floor-plan">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-6 w-6 text-cyan-400" />
                      Plan de tables
                    </CardTitle>
                    <CardDescription className="text-gray-300">Vue d'ensemble des tables par zone</CardDescription>
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {uniqueAreas.map(area => (
                  <div key={area ?? 'Unknown'} className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 px-4 py-2 bg-gray-950 rounded-xl">{area ?? 'Unknown'}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {tablesByArea[area ?? 'Unknown'].map(table => (
                        <Card
                          key={table.id}
                          className={`overflow-hidden cursor-pointer relative transition-all hover:shadow-xl ${table.status === 'available' ? 'border-green-600 bg-green-900/20' :
                              table.status === 'occupied' ? 'border-red-600 bg-red-900/20' :
                                'border-blue-600 bg-blue-900/20'
                            }`}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="font-bold text-lg text-white">{table.number ?? 'N/A'}</div>
                            <div className="text-sm text-gray-300 truncate">{table.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{table.capacity ?? 0} places</div>
                            {table.status === 'occupied' && (
                              <div className="text-xs font-medium text-red-400 mt-2">
                                Commande #{table.currentOrderId}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                            <div className="flex justify-end gap-1 mb-2">
                              {table.status === 'occupied' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-white hover:bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const order = orders.find(o => o.id === table.currentOrderId);
                                    if (order) {
                                      setEditingOrder(order);
                                      setIsModalOpen(true);
                                    }
                                  }}
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-white hover:bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTable(table);
                                  setIsTableModalOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                            {table.status === 'available' && (
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                onClick={() => { setInitialTableId(table.id); setEditingOrder(null); setIsModalOpen(true); }}
                              >
                                Nouvelle commande
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vue des Tables (liste) */}
          <TabsContent value="tables">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-6 w-6 text-pink-400" />
                      Liste des tables
                    </CardTitle>
                    <CardDescription className="text-gray-300">Gérez les tables de votre établissement</CardDescription>
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher une table..."
                      className="pl-10 bg-black border-gray-800 text-white placeholder-gray-400 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      onChange={(e) => setTableSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="area" className="text-gray-300">Zone</Label>
                      <Select onValueChange={setSelectedArea} defaultValue="all">
                        <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Toutes les zones" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-white">
                          <SelectItem value="all">Toutes les zones</SelectItem>
                          {uniqueAreas.map(area => (
                            <SelectItem key={area ?? 'Unknown'} value={area ?? 'Unknown'}>{area ?? 'Unknown'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="status" className="text-gray-300">Statut</Label>
                      <Select onValueChange={setSelectedTableStatus} defaultValue="all">
                        <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-white">
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="reserved">Réservée</SelectItem>
                          <SelectItem value="occupied">Occupée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredTables.map((table) => {
                    const tableOrder = orders.find(o => o.id === table.currentOrderId);
                    return (
                      <Card
                        key={table.id}
                        className="bg-black border-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                      >
                        <CardHeader className={`pb-3 ${table.status === 'available' ? 'bg-green-900/20 border-green-600' :
                            table.status === 'reserved' ? 'bg-orange-900/20 border-orange-600' :
                              'bg-red-900/20 border-red-600'
                          }`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-white">
                              <span className='font-semibold'>{table.name}</span>
                              {table.number && <span className="text-gray-300 ml-1">#{table.number}</span>}
                            </CardTitle>
                            <Badge
                              className={`${table.status === 'available' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
                                  table.status === 'reserved' ? 'bg-orange-900/30 text-orange-400 border border-orange-800/50' :
                                    'bg-red-900/30 text-red-400 border border-red-800/50'
                                }`}
                            >
                              {table.status === 'available' ? 'Disponible' :
                                table.status === 'reserved' ? 'Réservée' :
                                  'Occupée'}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-300">
                            {table.area ?? 'Unknown'} - {table.capacity ?? 0} places
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          {table.status === 'occupied' && tableOrder ? (
                            <div className="space-y-2 text-sm text-gray-300">
                              <div>
                                <span className="font-semibold text-white">Commande en cours:</span> #{tableOrder.id}
                              </div>
                              <div>
                                <span className="font-semibold text-white">Montant:</span> {tableOrder.total?.toLocaleString() ?? 0} Ar
                              </div>
                              <div>
                                <span className="font-semibold text-white">Articles:</span> {orderItems.filter(item => item.orderId === tableOrder.id).length}
                              </div>
                            </div>
                          ) : table.status === 'reserved' ? (
                            <div className="text-sm text-gray-300">
                              <span className="font-semibold text-white">Réservation en attente</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-300">
                              <span className="font-semibold text-white">Prête à être occupée</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                          {table.status === 'occupied' && tableOrder ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                                onClick={() => { setEditingOrder(tableOrder); setIsModalOpen(true); }}
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                Voir
                              </Button>
                              <Button
                                size="sm"
                                className="bg-pink-600 hover:bg-pink-700 text-white flex-1"
                                onClick={() => openCheckoutModal(tableOrder.id)}
                              >
                                <DollarSign className="mr-1 h-3 w-3" />
                                Encaisser
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                                onClick={() => { setInitialTableId(table.id); setEditingOrder(null); setIsModalOpen(true); }}
                              >
                                <PlusSquare className="mr-1 h-3 w-3" />
                                Commande
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-300 hover:bg-gray-900 flex-1"
                            onClick={() => { setEditingTable(table); setIsTableModalOpen(true); }}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-900/20 flex-1"
                            disabled={table.status === 'occupied'}
                            onClick={() => openDeleteTableModal(table.id)}
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
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-6 w-6 text-amber-400" />
                      Liste des commandes
                    </CardTitle>
                    <CardDescription className="text-gray-300">Gérez les commandes et factures</CardDescription>
                  </div>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={() => { setInitialTableId(undefined); setEditingOrder(null); setIsModalOpen(true); }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Nouvelle commande
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher une commande..."
                      className="pl-10 bg-black border-gray-800 text-white placeholder-gray-400 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="orderStatus" className="text-gray-300">Statut</Label>
                    <Select onValueChange={setSelectedOrderStatus} defaultValue="all">
                      <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-800 text-white">
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => {
                    const table = tables.find(t => t.id === order.tableId);
                    const groupedItems = getGroupedOrderItems(order.id);
                    const categoryNames: { [key: number]: string } = {};
                    categories.forEach(cat => {
                      categoryNames[cat.id] = cat.name;
                    });
                    return (
                      <Card key={order.id} className="flex flex-col h-full bg-black border-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                        <CardHeader className={`pb-3 ${order.status === 'pending' ? 'bg-yellow-900/20 border-yellow-600' :
                            order.status === 'processing' ? 'bg-blue-900/20 border-blue-600' :
                              order.status === 'completed' ? 'bg-green-900/20 border-green-600' :
                                'bg-red-900/20 border-red-600'
                          }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-white">Commande #{order.id}</CardTitle>
                              <CardDescription className="text-gray-300">
                                {table ? `${table.name} (${table.number})` : <span className="italic">À emporter</span>}
                                {order.customerName && ` - ${order.customerName}`}
                              </CardDescription>
                            </div>
                            <Badge
                              className={`${order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' :
                                  order.status === 'processing' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
                                    order.status === 'completed' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
                                      'bg-red-900/30 text-red-400 border border-red-800/50'
                                }`}
                            >
                              {order.status === 'pending' ? 'En attente' :
                                order.status === 'processing' ? 'En cours' :
                                  order.status === 'completed' ? 'Terminée' :
                                    'Annulée'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <div>Articles: {Object.values(groupedItems).reduce((sum, items) => sum + items.length, 0)}</div>
                            <div className="font-semibold text-pink-400">{order.total?.toLocaleString() ?? 0} Ar</div>
                          </div>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {Object.entries(groupedItems).map(([catId, items]) => {
                              const catName = categoryNames[Number(catId)] || 'Sans catégorie';
                              return (
                                <div key={catId} className="space-y-2">
                                  <h4 className="font-semibold text-white text-sm uppercase tracking-wide border-b border-gray-800 pb-1">{catName}</h4>
                                  <div className="grid grid-cols-3 gap-3">
                                    {items.slice(0, 4).map((item) => {
                                      const product = products.find(p => p.id === item.productId);
                                      return (
                                        <div key={item.id} className="bg-gray-950 rounded-lg p-2 space-y-1">
                                          <div className="relative h-24 bg-gray-900 rounded overflow-hidden flex items-center justify-center">
                                            {product?.imageUrl ? (
                                              <img
                                                src={product.imageUrl}
                                                alt={product?.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = 'none';
                                                  e.currentTarget.nextSibling.style.display = 'flex';
                                                }}
                                              />
                                            ) : null}
                                            <Tag className={`h-8 w-8 text-gray-500 ${product?.imageUrl ? 'hidden' : 'flex'}`} />
                                          </div>
                                          <h5 className="text-xs font-medium text-white line-clamp-1">{product?.name || 'Inconnu'}</h5>
                                          <div className="text-xs text-gray-300">x{item.quantity}</div>
                                          <div className="text-xs font-bold text-pink-400">{item.subtotal?.toLocaleString()} Ar</div>
                                        </div>
                                      );
                                    })}
                                    {items.length > 4 && (
                                      <div className="col-span-2 text-center py-4 text-xs text-gray-400">
                                        +{items.length - 4} article(s) supplémentaire(s)
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto p-4 pt-0 flex flex-wrap gap-2 bg-black/50">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                            onClick={() => { setEditingOrder(order); setIsModalOpen(true); }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              size="sm"
                              className="bg-pink-600 hover:bg-pink-700 text-white flex-1"
                              onClick={() => openCheckoutModal(order.id)}
                            >
                              <DollarSign className="mr-1 h-3 w-3" />
                              Encaisser
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-800 text-gray-300 hover:bg-gray-900 flex-1"
                          >
                            <Printer className="h-3 w-3" />
                            Imprimer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 hover:bg-red-900/20 border-red-800/50 flex-1"
                            onClick={() => openDeleteModal(order.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Aucune commande trouvée</h3>
                    <p className="text-sm text-gray-400">Essayez d'ajuster vos filtres ou ajoutez une nouvelle commande.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingOrder(null); setInitialTableId(undefined); }}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        products={products}
        categories={categories}
        tables={tables}
        orderItems={orderItems}
        initialTableId={initialTableId}
      />

      <TableManagementModal
        isOpen={isTableModalOpen}
        onClose={() => { setIsTableModalOpen(false); setEditingTable(null); }}
        onSave={handleSaveTable}
        editingTable={editingTable}
      />

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setOrderToDelete(null); }}
        onConfirm={handleDeleteOrder}
        title="Confirmer la suppression de la commande"
        description={`Êtes-vous sûr de vouloir supprimer la commande #${orderToDelete}? Cette action est irréversible.`}
        isLoading={isDeleting}
        type="danger"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />

      <AlertModal
        isOpen={isDeleteTableModalOpen}
        onClose={() => { setIsDeleteTableModalOpen(false); setTableToDelete(null); }}
        onConfirm={handleDeleteTable}
        title="Confirmer la suppression de la table"
        description={`Êtes-vous sûr de vouloir supprimer la table #${tableToDelete}? Cette action est irréversible.`}
        isLoading={isDeletingTable}
        type="danger"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />

      <AlertModal
        isOpen={isCheckoutModalOpen}
        onClose={() => { setIsCheckoutModalOpen(false); setOrderToCheckout(null); }}
        onConfirm={confirmCheckout}
        title="Confirmer l'encaissement"
        description={`Confirmer l'encaissement de la commande #${orderToCheckout}?`}
        isLoading={isCheckingOut}
        type="warning"
        confirmLabel="Encaisser"
        cancelLabel="Annuler"
      />

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => setAlertOpen(false)}
        title={alertTitle}
        description={alertDescription}
        type={alertType}
        confirmLabel="OK"
        cancelLabel="Fermer"
      />
    </POSLayout>
  );
};

export default POSTablesPage;