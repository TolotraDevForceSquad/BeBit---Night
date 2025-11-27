import React from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
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
  FileText
} from 'lucide-react';

// Nouvelles données fictives
const tables = [
  {
    id: 2,
    name: "Table 2",
    number: 2,
    area: "Terrasse",
    capacity: 2,
    status: "occupied",
    currentOrderId: 35
  },
  {
    id: 3,
    name: "Table 3",
    number: 3,
    area: "Terrasse",
    capacity: 4,
    status: "available",
    currentOrderId: null
  },
  {
    id: 4,
    name: "Table 4",
    number: 4,
    area: "Intérieur",
    capacity: 6,
    status: "available",
    currentOrderId: null
  },
  {
    id: 5,
    name: "Table 5",
    number: 5,
    area: "Intérieur",
    capacity: 4,
    status: "available",
    currentOrderId: null
  },
  {
    id: 6,
    name: "Table 6",
    number: 6,
    area: "Intérieur",
    capacity: 4,
    status: "available",
    currentOrderId: 102
  },
  {
    id: 7,
    name: "Table 7",
    number: 7,
    area: "Intérieur",
    capacity: 8,
    status: "available",
    currentOrderId: null
  },
  {
    id: 8,
    name: "VIP Lounge 1",
    number: 8,
    area: "VIP",
    capacity: 10,
    status: "available",
    currentOrderId: null
  },
  {
    id: 9,
    name: "VIP Lounge 2",
    number: 9,
    area: "VIP",
    capacity: 8,
    status: "available",
    currentOrderId: 103
  },
  {
    id: 10,
    name: "Bar 1",
    number: 10,
    area: "Bar",
    capacity: 2,
    status: "available",
    currentOrderId: null
  },
  {
    id: 11,
    name: "Bar 2",
    number: 11,
    area: "Bar",
    capacity: 2,
    status: "available",
    currentOrderId: 104
  },
  {
    id: 12,
    name: "Bar 3",
    number: 12,
    area: "Bar",
    capacity: 2,
    status: "available",
    currentOrderId: null
  }
];

const orders = [
  {
    id: 35,
    tableId: 2,
    customerName: null,
    status: "pending",
    total: 20000,
    createdAt: "2025-09-10T09:40:28.085Z",
    updatedAt: "2025-09-10T09:40:28.085Z",
    paymentMethod: null,
    priority: null,
    estimatedCompletionTime: null
  }
];

const orderItems = [
  {
    id: 35,
    orderId: 35,
    productId: 14,
    quantity: 4,
    price: 5000,
    subtotal: 20000,
    status: "pending",
    category: null,
    preparationTime: null,
    notes: null
  }
];

const products = [
  {
    id: 14,
    name: "Bière Rou",
    description: "THB/Star",
    price: 5000,
    categoryId: 3,
    isAvailable: true,
    imageUrl: null
  },
  {
    id: 9,
    name: "Burger Club",
    description: "Burger avec frites",
    price: 16,
    categoryId: 5,
    isAvailable: false,
    imageUrl: "burger.jpg"
  },
  {
    id: 7,
    name: "Coca-Cola",
    description: "Canette 33cl",
    price: 5,
    categoryId: 4,
    isAvailable: true,
    imageUrl: "coca.jpg"
  },
  {
    id: 3,
    name: "Cosmopolitan",
    description: "Vodka, triple sec, cranberry",
    price: 13,
    categoryId: 1,
    isAvailable: false,
    imageUrl: "cosmo.jpg"
  },
  {
    id: 6,
    name: "Heineken",
    description: "Bière pression 50cl",
    price: 7,
    categoryId: 3,
    isAvailable: true,
    imageUrl: "heineken.jpg"
  },
  {
    id: 2,
    name: "Margarita",
    description: "Tequila, triple sec, citron vert",
    price: 14,
    categoryId: 1,
    isAvailable: true,
    imageUrl: "margarita.jpg"
  },
  {
    id: 1,
    name: "Mojito",
    description: "Rhum, menthe, citron vert",
    price: 12,
    categoryId: 1,
    isAvailable: true,
    imageUrl: "mojito.jpg"
  },
  {
    id: 10,
    name: "Pizza Margherita",
    description: "Pizza traditionnelle",
    price: 14,
    categoryId: 5,
    isAvailable: true,
    imageUrl: "pizza.jpg"
  },
  {
    id: 8,
    name: "Plateau fromage",
    description: "Assortiment de fromages",
    price: 18,
    categoryId: 6,
    isAvailable: true,
    imageUrl: "plateau_fromage.jpg"
  },
  {
    id: 0,
    name: "Tenia",
    description: "kakana 2m",
    price: 500,
    categoryId: 16,
    isAvailable: true,
    imageUrl: null
  },
  {
    id: 12,
    name: "Tenia 1",
    description: "Tenia 100",
    price: 500,
    categoryId: 16,
    isAvailable: true,
    imageUrl: null
  },
  {
    id: 11,
    name: "Tenia 2",
    description: "Tenia 3m",
    price: 1000,
    categoryId: 16,
    isAvailable: true,
    imageUrl: null
  },
  {
    id: 13,
    name: "Tenia 3",
    description: "Tenia 300",
    price: 1500,
    categoryId: 16,
    isAvailable: true,
    imageUrl: null
  },
  {
    id: 5,
    name: "Vin Blanc Maison",
    description: "Verre de vin blanc",
    price: 8,
    categoryId: 2,
    isAvailable: true,
    imageUrl: "vin_blanc.jpg"
  },
  {
    id: 4,
    name: "Vin Rouge Maison",
    description: "Verre de vin rouge",
    price: 8,
    categoryId: 2,
    isAvailable: true,
    imageUrl: "vin_rouge.jpg"
  }
];

const categories = [
  {
    id: 3,
    name: "Bières",
    description: "Bières pression et bouteilles",
    isActive: true
  },
  {
    id: 8,
    name: "Boissons",
    description: "Boisson bafas",
    isActive: true
  },
  {
    id: 1,
    name: "Cocktails",
    description: "Cocktails signature et classiques",
    isActive: true
  },
  {
    id: 16,
    name: "Kakana",
    description: "Kakana lava be, kkk non ts de lava kay ka",
    isActive: false
  },
  {
    id: 5,
    name: "Plats",
    description: "Carte restaurant",
    isActive: true
  },
  {
    id: 6,
    name: "Snacks",
    description: "En-cas et petits plats",
    isActive: true
  },
  {
    id: 4,
    name: "Softs",
    description: "Boissons non-alcoolisées",
    isActive: true
  },
  {
    id: 2,
    name: "Vins",
    description: "Vins au verre et bouteilles",
    isActive: true
  }
];

// Obtenir les zones/emplacements uniques
const uniqueAreas = Array.from(new Set(tables.map(table => table.area)));

// Regrouper les tables par zone pour le plan de tables
const tablesByArea = uniqueAreas.reduce((acc, area) => {
  acc[area] = tables.filter(table => table.area === area);
  return acc;
}, {} as Record<string, any[]>);

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

const POSTablesPage = () => {
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
                  <Button>
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
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>

                          {table.status === 'available' && (
                            <Button variant="default" size="sm" className="w-full mt-2">
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
                          {uniqueAreas.map(area => (
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
                  {tables.map((table) => {
                    const tableOrder = orders.find(o => o.tableId === table.id && (o.status === 'pending' || o.status === 'processing'));
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
                            <>
                              <Button size="sm" variant="outline">
                                <PlusSquare className="mr-1 h-3 w-3" />
                                Commande
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            <Settings className="mr-1 h-3 w-3" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
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
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle font-medium">#{order.id}</td>
                            <td className="p-4 align-middle">
                              {tables.find(t => t.id === order.tableId)?.name || <span className="text-muted-foreground italic">À emporter</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {order.customerName || <span className="text-muted-foreground italic">—</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {orderItems.filter(item => item.orderId === order.id).length} {orderItems.filter(item => item.orderId === order.id).length === 1 ? 'article' : 'articles'}
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
                              {order.paymentMethod === null && <span className="text-sm text-muted-foreground italic">En attente</span>}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button size="icon" variant="outline">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Voir/Modifier</span>
                                </Button>
                                {(order.status === 'pending' || order.status === 'processing') && (
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
    </POSLayout>
  );
};

export default POSTablesPage;