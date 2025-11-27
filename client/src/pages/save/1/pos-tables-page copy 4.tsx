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
  FileText
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

  if (loading) {
    return (
      <POSLayout>
        <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
          <p>Loading...</p>
        </div>
      </POSLayout>
    );
  }

  if (error) {
    return (
      <POSLayout>
        <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </POSLayout>
    );
  }

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
              <p className="text-xs text-muted-foreground mt-1">
                Ticket moyen: {todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length).toLocaleString() : 0} Ar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tables" className="w-full">
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
                  <Button onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {uniqueAreas.map(area => (
                  <div key={area ?? 'Unknown'} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">{area ?? 'Unknown'}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {tablesByArea[area ?? 'Unknown'].map(table => (
                        <div
                          key={table.id}
                          className={`
                            p-4 rounded-md border-2 cursor-pointer relative
                            ${table.status === 'available' ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-200' : ''}
                            ${table.status === 'occupied' ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200' : ''}
                            ${table.status === 'reserved' ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200' : ''}
                            hover:shadow-md transition-shadow
                          `}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{table.number ?? 'N/A'}</div>
                            <div className="text-sm truncate">{table.name}</div>
                            <div className="text-xs mt-1">{table.capacity ?? 0} places</div>
                          </div>

                          <div className="absolute top-2 right-2 flex space-x-1">
                            {table.status === 'occupied' && (
                              <Button size="icon" variant="ghost" className="h-6 w-6">
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditingTable(table); setIsTableModalOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>

                          {table.status === 'available' && (
                            <Button variant="default" size="sm" className="w-full mt-2" onClick={() => { setInitialTableId(table.id); setEditingOrder(null); setIsModalOpen(true); }}>
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
                  <Button onClick={() => { setEditingTable(null); setIsTableModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher une table..." className="pl-8" onChange={(e) => setTableSearch(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="area">Zone</Label>
                      <Select onValueChange={setSelectedArea} defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les zones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les zones</SelectItem>
                          {uniqueAreas.map(area => (
                            <SelectItem key={area ?? 'Unknown'} value={area ?? 'Unknown'}>{area ?? 'Unknown'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="status">Statut</Label>
                      <Select onValueChange={setSelectedTableStatus} defaultValue="all">
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
                    const tableOrder = orders.find(o => o.tableId === table.id && (o.status === 'pending' || o.status === 'processing'));
                    return (
                      <Card
                        key={table.id}
                        className={`overflow-hidden ${table.status === 'available' ? 'border-green-200' :
                          table.status === 'reserved' ? 'border-orange-200' :
                            'border-blue-200'
                          }`}
                      >
                        <CardHeader
                          className={`pb-2 ${table.status === 'available' ? 'bg-green-50' :
                            table.status === 'reserved' ? 'bg-orange-50' :
                              'bg-blue-50'
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              <span className='text-gray-700'>{table.name}</span>
                              {table.number && <span className="text-muted-foreground ml-1">#{table.number}</span>}
                            </CardTitle>
                            <Badge
                              className={`${table.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                table.status === 'reserved' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                  'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                }`}
                            >
                              {table.status === 'available' ? 'Disponible' :
                                table.status === 'reserved' ? 'Réservée' :
                                  'Occupée'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {table.area ?? 'Unknown'} - {table.capacity ?? 0} places
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          {table.status === 'occupied' && tableOrder ? (
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-semibold">Commande en cours:</span> #{tableOrder.id}
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Montant:</span> {tableOrder.total?.toLocaleString() ?? 0} Ar
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Articles:</span> {orderItems.filter(item => item.orderId === tableOrder.id).length}
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
                              <Button size="sm" variant="outline" onClick={() => { setEditingOrder(tableOrder); setIsModalOpen(true); }}>
                                <Edit className="mr-1 h-3 w-3" />
                                Voir
                              </Button>
                              <Button size="sm" onClick={() => openCheckoutModal(tableOrder.id)}>
                                <DollarSign className="mr-1 h-3 w-3" />
                                Encaisser
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => { setInitialTableId(table.id); setEditingOrder(null); setIsModalOpen(true); }}>
                                <PlusSquare className="mr-1 h-3 w-3" />
                                Commande
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => { setEditingTable(table); setIsTableModalOpen(true); }}>
                            <Settings className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des commandes</CardTitle>
                    <CardDescription>Gérez les commandes et factures</CardDescription>
                  </div>
                  <Button onClick={() => { setInitialTableId(undefined); setEditingOrder(null); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle commande
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher une commande..." className="pl-8" onChange={(e) => setOrderSearch(e.target.value)} />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="orderStatus">Statut</Label>
                    <Select onValueChange={setSelectedOrderStatus} defaultValue="all">
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
                              {tables.find(t => t.id === order.tableId)?.name ?? <span className="text-muted-foreground italic">À emporter</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {order.customerName ?? <span className="text-muted-foreground italic">—</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {orderItems.filter(item => item.orderId === order.id).length} {orderItems.filter(item => item.orderId === order.id).length === 1 ? 'article' : 'articles'}
                            </td>
                            <td className="p-4 align-middle font-semibold">
                              {order.total?.toLocaleString() ?? 0} Ar
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={`${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                    order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                      'bg-red-100 text-red-800 hover:bg-red-100'
                                  }`}
                              >
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
                              {order.paymentMethod === null && <span className="text-sm text-muted-foreground italic">En attente</span>}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button size="icon" variant="outline" onClick={() => { setEditingOrder(order); setIsModalOpen(true); }}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Voir/Modifier</span>
                                </Button>
                                {(order.status === 'pending' || order.status === 'processing') && (
                                  <Button size="icon" variant="outline" onClick={() => openCheckoutModal(order.id)}>
                                    <DollarSign className="h-4 w-4" />
                                    <span className="sr-only">Encaisser</span>
                                  </Button>
                                )}
                                <Button size="icon" variant="outline">
                                  <Printer className="h-4 w-4" />
                                  <span className="sr-only">Imprimer</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => openDeleteModal(order.id)}
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