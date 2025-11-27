import React, { useState, useEffect, useMemo } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
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
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { PosTable, Order, OrderItem, Product } from '@shared/schema';

interface TableWithOrders extends PosTable {
  orders: (Order & { items: (OrderItem & { product: Product | null })[] })[];
}

const POSTablesPage = () => {
  const [tables, setTables] = useState<TableWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("floor-plan");
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  
  const [todaysSales, setTodaysSales] = useState(0);
  const [todaysOrders, setTodaysOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all POS tables
        const posTables = await api.getAllPosTables();

        // For each table, fetch its orders and order items
        const tablesWithOrders = await Promise.all(
          posTables.map(async (table) => {
            const orders = await api.getOrdersByTableId(table.id);
            const ordersWithItems = await Promise.all(
              orders.map(async (order) => {
                const rawItems = await api.getOrderItemsByOrderId(order.id);
                // Map product_id to productId to match OrderItem type
                const items = rawItems.map((item: any) => ({
                  ...item,
                  productId: item.product_id,
                })) as OrderItem[];
                // Fetch product details for each order item
                const itemsWithProducts = await Promise.all(
                  items.map(async (item) => {
                    let product: Product | null = null;
                    try {
                      if (item.productId !== null && item.productId !== undefined) {
                        product = await api.getProduct(item.productId);
                      }
                    } catch (err) {
                      console.error(`Failed to fetch product ${item.productId} for OrderItem ${item.id}:`, err);
                    }
                    return { ...item, product };
                  })
                );
                return { ...order, items: itemsWithProducts };
              })
            );
            return { ...table, orders: ordersWithItems };
          })
        );

        setTables(tablesWithOrders);
        
        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        const allOrders = tablesWithOrders.flatMap(table => table.orders);
        const todaysOrdersList = allOrders.filter(order => 
          new Date(order.createdAt).toISOString().split('T')[0] === today
        );
        
        const completedOrdersList = todaysOrdersList.filter(order => 
          order.status === 'completed' || order.status === 'paid'
        );
        
        const totalSales = completedOrdersList.reduce((sum, order) => sum + order.total, 0);
        const avgTicket = completedOrdersList.length > 0 
          ? totalSales / completedOrdersList.length 
          : 0;
        
        setTodaysSales(totalSales);
        setTodaysOrders(todaysOrdersList.length);
        setCompletedOrders(completedOrdersList.length);
        setAverageTicket(avgTicket);
      } catch (err) {
        setError('Failed to fetch tables, orders, or products');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage des tables
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      // Filtre par recherche
      const matchesSearch = searchTerm === "" || 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (table.number && table.number.toString().includes(searchTerm));
      
      // Filtre par zone
      const matchesArea = areaFilter === "all" || 
        (areaFilter === "unspecified" && !table.area) || 
        table.area === areaFilter;
      
      // Filtre par statut
      const matchesStatus = statusFilter === "all" || table.status === statusFilter;
      
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [tables, searchTerm, areaFilter, statusFilter]);

  // Filtrage des commandes
  const filteredOrders = useMemo(() => {
    const allOrders = tables.flatMap(table => 
      table.orders.map(order => ({ ...order, tableName: table.name, tableNumber: table.number }))
    );
    
    return allOrders.filter(order => {
      // Filtre par recherche
      const matchesSearch = orderSearchTerm === "" || 
        order.id.toString().includes(orderSearchTerm) ||
        (order.tableName && order.tableName.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
        (order.customerName && order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()));
      
      // Filtre par statut
      const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tables, orderSearchTerm, orderStatusFilter]);

  // Zones uniques pour les filtres
  const uniqueAreas = useMemo(() => {
    const areas = Array.from(new Set(tables.map(table => table.area || "Non spécifié")));
    return areas.sort();
  }, [tables]);

  // Tables groupées par zone pour le plan de tables
  const tablesByArea = useMemo(() => {
    return filteredTables.reduce((acc, table) => {
      const area = table.area || "Non spécifié";
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(table);
      return acc;
    }, {} as Record<string, TableWithOrders[]>);
  }, [filteredTables]);

  // Helper functions to get counts
  const getAvailableTablesCount = () => {
    return tables.filter(table => table.status === 'available').length;
  };

  const getReservedTablesCount = () => {
    return tables.filter(table => table.status === 'reserved').length;
  };

  const getOccupiedTablesCount = () => {
    return tables.filter(table => table.status === 'occupied').length;
  };

  const getPendingOrdersCount = () => {
    return tables.flatMap(table => table.orders)
      .filter(order => order.status === 'pending').length;
  };

  const getProcessingOrdersCount = () => {
    return tables.flatMap(table => table.orders)
      .filter(order => order.status === 'processing').length;
  };

  // Fonctions pour réinitialiser les filtres
  const resetTableFilters = () => {
    setSearchTerm("");
    setAreaFilter("all");
    setStatusFilter("all");
  };

  const resetOrderFilters = () => {
    setOrderSearchTerm("");
    setOrderStatusFilter("all");
  };

  if (loading) {
    return (
      <POSLayout>
        <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
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
              <div className="text-3xl font-bold">{todaysSales.toLocaleString()} Ar</div>
              <p className="text-xs text-muted-foreground mt-1">{todaysOrders} commandes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Tables</CardTitle>
              <CardDescription>État des tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tables.length}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {getAvailableTablesCount()} disponibles
                </span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  {getReservedTablesCount()} réservée
                </span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {getOccupiedTablesCount()} occupée
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Commandes en cours</CardTitle>
              <CardDescription>Commandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getPendingOrdersCount() + getProcessingOrdersCount()}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  {getPendingOrdersCount()} en attente
                </span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {getProcessingOrdersCount()} en cours
                </span>
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
                Ticket moyen: {averageTicket.toLocaleString()} Ar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="floor-plan" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="floor-plan">Plan de tables</TabsTrigger>
            <TabsTrigger value="tables">Liste des tables</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="floor-plan">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Plan de tables</CardTitle>
                    <CardDescription>Vue d'ensemble des tables par zone</CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Group tables by area */}
                {Object.entries(tablesByArea).map(([area, areaTables]) => (
                  <div key={area} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">{area}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {areaTables.map(table => {
                        const hasActiveOrder = table.orders.some(order => 
                          order.status === 'pending' || order.status === 'processing'
                        );
                        const isReserved = table.status === 'reserved';
                        const isOccupied = table.status === 'occupied';
                        
                        let borderColor = 'border-green-400';
                        let bgColor = 'bg-green-50 dark:bg-green-950';
                        let textColor = 'text-green-900 dark:text-green-200';
                        
                        if (isReserved) {
                          borderColor = 'border-orange-400';
                          bgColor = 'bg-orange-50 dark:bg-orange-950';
                          textColor = 'text-orange-900 dark:text-orange-200';
                        } else if (isOccupied || hasActiveOrder) {
                          borderColor = 'border-red-400';
                          bgColor = 'bg-red-50 dark:bg-red-950';
                          textColor = 'text-red-900 dark:text-red-200';
                        }
                        
                        return (
                          <div 
                            key={table.id} 
                            className={`p-4 rounded-md border-2 cursor-pointer relative ${borderColor} ${bgColor} ${textColor} hover:shadow-md transition-shadow`}
                          >
                            <div className="text-center">
                              <div className="font-bold text-lg">{table.number}</div>
                              <div className="text-sm truncate">{table.name}</div>
                              <div className="text-xs mt-1">{table.capacity} places</div>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-1">
                              {hasActiveOrder && (
                                <Button size="icon" variant="ghost" className="h-6 w-6">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="icon" variant="ghost" className="h-6 w-6">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {hasActiveOrder ? (
                              table.orders
                                .filter(order => order.status === 'pending' || order.status === 'processing')
                                .map(order => (
                                  <div key={order.id} className="text-xs font-medium text-center mt-2">
                                    Commande #{order.id}
                                  </div>
                                ))
                            ) : isReserved ? (
                              <div className="text-xs font-medium text-center mt-2 space-y-1">
                                <div className="font-semibold">Réservation</div>
                              </div>
                            ) : (
                              <Button variant="default" size="sm" className="w-full mt-2">
                                Nouvelle commande
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des tables</CardTitle>
                    <CardDescription>
                      {filteredTables.length} table{filteredTables.length !== 1 ? 's' : ''} trouvée{filteredTables.length !== 1 ? 's' : ''}
                      {(searchTerm !== "" || areaFilter !== "all" || statusFilter !== "all") && (
                        <Button variant="link" className="ml-2 p-0 h-auto" onClick={resetTableFilters}>
                          <X className="h-3 w-3 mr-1" />
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </CardDescription>
                  </div>
                  <Button>
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
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-5 w-5"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="area-filter" className="text-xs">Zone</Label>
                      <Select value={areaFilter} onValueChange={setAreaFilter}>
                        <SelectTrigger id="area-filter" className="w-full sm:w-[180px]">
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
                    <div className="grid gap-2">
                      <Label htmlFor="status-filter" className="text-xs">Statut</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status-filter" className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="occupied">Occupée</SelectItem>
                          <SelectItem value="reserved">Réservée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTables.map(table => {
                    const hasActiveOrder = table.orders.some(order => 
                      order.status === 'pending' || order.status === 'processing'
                    );
                    const isReserved = table.status === 'reserved';
                    const isOccupied = table.status === 'occupied';
                    
                    let statusText = "Disponible";
                    let statusVariant = "success";
                    
                    if (isReserved) {
                      statusText = "Réservée";
                      statusVariant = "warning";
                    } else if (isOccupied || hasActiveOrder) {
                      statusText = "Occupée";
                      statusVariant = "destructive";
                    }
                    
                    return (
                      <Card key={table.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Table {table.number}</CardTitle>
                              <CardDescription>{table.name}</CardDescription>
                            </div>
                            <Badge variant={statusVariant as "default" | "destructive" | "success" | "warning" | "secondary" | "outline"}>
                              {statusText}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Zone:</span>
                              <div className="font-medium">{table.area || "Non spécifiée"}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Capacité:</span>
                              <div className="font-medium">{table.capacity} personnes</div>
                            </div>
                          </div>
                          
                          {hasActiveOrder && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Commandes actives:</h4>
                              {table.orders
                                .filter(order => order.status === 'pending' || order.status === 'processing')
                                .map(order => (
                                  <div key={order.id} className="text-sm bg-muted p-2 rounded-md mb-2">
                                    <div className="font-medium">Commande #{order.id}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {order.items.length} article{order.items.length !== 1 ? 's' : ''} • {order.total.toLocaleString()} Ar
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {hasActiveOrder ? "Voir commande" : "Nouvelle commande"}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
                
                {filteredTables.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune table trouvée avec les filtres actuels.</p>
                    <Button variant="link" onClick={resetTableFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Commandes</CardTitle>
                    <CardDescription>
                      {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} trouvée{filteredOrders.length !== 1 ? 's' : ''}
                      {(orderSearchTerm !== "" || orderStatusFilter !== "all") && (
                        <Button variant="link" className="ml-2 p-0 h-auto" onClick={resetOrderFilters}>
                          <X className="h-3 w-3 mr-1" />
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher par ID, table ou client..." 
                      className="pl-8" 
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                    />
                    {orderSearchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-5 w-5"
                        onClick={() => setOrderSearchTerm("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="order-status-filter" className="text-xs">Statut</Label>
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger id="order-status-filter" className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="paid">Payée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Table</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Articles</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredOrders.map(order => {
                          let statusVariant = "secondary";
                          if (order.status === 'pending') statusVariant = "warning";
                          if (order.status === 'processing') statusVariant = "default";
                          if (order.status === 'completed') statusVariant = "success";
                          if (order.status === 'paid') statusVariant = "success";
                          if (order.status === 'cancelled') statusVariant = "destructive";
                          
                          const statusText = {
                            'pending': 'En attente',
                            'processing': 'En cours',
                            'completed': 'Terminée',
                            'paid': 'Payée',
                            'cancelled': 'Annulée'
                          }[order.status];
                          
                          return (
                            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <td className="p-4 align-middle font-medium">#{order.id}</td>
                              <td className="p-4 align-middle">
                                {order.tableName || `Table ${order.tableNumber}`}
                              </td>
                              <td className="p-4 align-middle">
                                {order.customerName || "Non spécifié"}
                              </td>
                              <td className="p-4 align-middle">
                                {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                              </td>
                              <td className="p-4 align-middle font-medium">
                                {order.total.toLocaleString()} Ar
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant={statusVariant as "default" | "destructive" | "success" | "warning" | "secondary" | "outline"}>
                                  {statusText}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  {(order.status === 'pending' || order.status === 'processing') && (
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="icon">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune commande trouvée avec les filtres actuels.</p>
                      <Button variant="link" onClick={resetOrderFilters}>
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </POSLayout>
  );
};

export default POSTablesPage;