import React, { useState, useEffect } from 'react';
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
                {Array.from(new Set(tables.map(table => table.area || 'Non spécifié'))).map(area => (
                  <div key={area} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">{area}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {tables
                        .filter(table => (table.area || 'Non spécifié') === area)
                        .map(table => {
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
                    <CardDescription>Gérez les tables de votre établissement</CardDescription>
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
                    <Input placeholder="Rechercher une table..." className="pl-8" />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="area">Zone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les zones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les zones</SelectItem>
                          {Array.from(new Set(tables.map(table => table.area || 'Non spécifié'))).map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="status">Statut</Label>
                      <Select>
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
                  {tables.map(table => {
                    const hasActiveOrder = table.orders.some(order => 
                      order.status === 'pending' || order.status === 'processing'
                    );
                    const activeOrder = table.orders.find(order => 
                      order.status === 'pending' || order.status === 'processing'
                    );
                    
                    let borderColor = 'border-green-200';
                    let bgColor = 'bg-green-50';
                    let badgeColor = 'bg-green-100 text-green-800 hover:bg-green-100';
                    let statusText = 'Disponible';
                    
                    if (table.status === 'reserved') {
                      borderColor = 'border-orange-200';
                      bgColor = 'bg-orange-50';
                      badgeColor = 'bg-orange-100 text-orange-800 hover:bg-orange-100';
                      statusText = 'Réservée';
                    } else if (table.status === 'occupied' || hasActiveOrder) {
                      borderColor = 'border-blue-200';
                      bgColor = 'bg-blue-50';
                      badgeColor = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
                      statusText = 'Occupée';
                    }
                    
                    return (
                      <Card key={table.id} className={`overflow-hidden ${borderColor}`}>
                        <CardHeader className={`pb-2 ${bgColor}`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              <span className='text-gray-700'>{table.name}</span>
                              <span className="text-muted-foreground ml-1">#{table.number}</span>
                            </CardTitle>
                            <Badge className={badgeColor}>
                              {statusText}
                            </Badge>
                          </div>
                          <CardDescription>
                            {table.area || 'Non spécifié'} - {table.capacity} places
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          {hasActiveOrder && activeOrder ? (
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-semibold">Commande en cours:</span> #{activeOrder.id}
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Montant:</span> {activeOrder.total.toLocaleString()} Ar
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold">Articles:</span> {activeOrder.items.length}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm">
                              <span className="font-semibold">Prête à être occupée</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                          {hasActiveOrder ? (
                            <>
                              <Button size="sm" variant="outline">
                                <Edit className="mr-1 h-3 w-3" />
                                Voir
                              </Button>
                              <Button size="sm">
                                <DollarSign className="mr-1 h-3 w-3" />
                                Encaisser
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline">
                              <PlusSquare className="mr-1 h-3 w-3" />
                              Commande
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Settings className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={hasActiveOrder}
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

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des commandes</CardTitle>
                    <CardDescription>Gérez les commandes et factures</CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle commande
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher une commande..." className="pl-8" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="orderStatus">Statut</Label>
                    <Select>
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
                        {tables.flatMap(table => 
                          table.orders.map(order => {
                            let badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
                            if (order.status === 'pending') {
                              badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
                            } else if (order.status === 'processing') {
                              badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100";
                            } else if (order.status === 'completed' || order.status === 'paid') {
                              badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
                            } else if (order.status === 'cancelled') {
                              badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
                            }
                            
                            return (
                              <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle font-medium">#{order.id}</td>
                                <td className="p-4 align-middle">
                                  {table.name || 'À emporter'}
                                </td>
                                <td className="p-4 align-middle">
                                  {order.customerName || 'Non spécifié'}
                                </td>
                                <td className="p-4 align-middle">
                                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                </td>
                                <td className="p-4 align-middle font-semibold">
                                  {order.total.toLocaleString()} Ar
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge className={badgeClass}>
                                    {order.status === 'pending' && 'En attente'}
                                    {order.status === 'processing' && 'En cours'}
                                    {order.status === 'completed' && 'Terminée'}
                                    {order.status === 'paid' && 'Payée'}
                                    {order.status === 'cancelled' && 'Annulée'}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  {order.paymentMethod ? (
                                    <span className="text-sm">{order.paymentMethod}</span>
                                  ) : (
                                    <span className="text-sm text-muted-foreground italic">En attente</span>
                                  )}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex space-x-2">
                                    <Button size="icon" variant="outline">
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Voir/Modifier</span>
                                    </Button>
                                    {order.status !== 'paid' && order.status !== 'completed' && (
                                      <Button size="icon" variant="outline">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="sr-only">Encaisser</span>
                                      </Button>
                                    )}
                                    <Button size="icon" variant="outline">
                                      <Printer className="h-4 w-4" />
                                      <span className="sr-only">Imprimer</span>
                                    </Button>
                                    <Button size="icon" variant="outline" className="text-destructive">
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">Supprimer</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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