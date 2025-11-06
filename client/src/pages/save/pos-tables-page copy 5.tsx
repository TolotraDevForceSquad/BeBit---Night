import React from 'react';
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

// Données fictives
const tables = [
  { id: 1, name: 'Table 1', number: 1, area: 'Terrasse', capacity: 4, status: 'available' },
  { id: 2, name: 'Table 2', number: 2, area: 'Terrasse', capacity: 6, status: 'occupied', currentOrderId: 101 },
  { id: 3, name: 'Table 3', number: 3, area: 'Salle principale', capacity: 2, status: 'reserved', reservationInfo: { userName: 'Jean Dupont', reservationTime: '19:00', partySize: 2 } },
  { id: 4, name: 'Table 4', number: 4, area: 'Salle principale', capacity: 8, status: 'available' },
];

const orders = [
  { id: 101, tableId: 2, tableName: 'Table 2', customerName: 'Marie Dubois', items: [{ id: 1, productName: 'Pizza Margherita', quantity: 2, price: 12000, subtotal: 24000 }], status: 'pending', total: 24000, paymentMethod: 'pending' },
  { id: 102, tableId: null, customerName: 'À emporter', items: [{ id: 2, productName: 'Burger Classique', quantity: 1, price: 15000, subtotal: 15000 }], status: 'completed', total: 15000, paymentMethod: 'cash' },
];

const uniqueAreas = ['Terrasse', 'Salle principale'];

const tablesByArea = {
  'Terrasse': tables.filter(t => t.area === 'Terrasse'),
  'Salle principale': tables.filter(t => t.area === 'Salle principale'),
};

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
              <div className="text-3xl font-bold">150,000 Ar</div>
              <p className="text-xs text-muted-foreground mt-1">12 commandes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Tables</CardTitle>
              <CardDescription>État des tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">2 disponibles</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">1 réservée</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">1 occupée</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Commandes en cours</CardTitle>
              <CardDescription>Commandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">1 en attente</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">0 en cours</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Commandes terminées</CardTitle>
              <CardDescription>Commandes finalisées aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">Ticket moyen: 12,500 Ar</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="floor-plan" className="w-full">
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
                              Commande #{table.currentOrderId}
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
                  {tables.map((table) => (
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
                            <span className="text-muted-foreground ml-1">#{table.number}</span>
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
                        {/* ici utilise bien la logique du code que j ai envoyer pour lister ca */}
                        {table.status === 'occupied' ? (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-semibold">Commande en cours:</span> #101
                            </div>
                            <div className="text-sm">
                              <span className="font-semibold">Montant:</span> 24,000 Ar
                            </div>
                            <div className="text-sm">
                              <span className="font-semibold">Articles:</span> 2
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
                        {table.status === 'occupied' ? (
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
                  ))}
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
                          {/* Le contenu de cette colomn ne dois pas avoir d erreur ca affiche le nombre d article genre 2 article */}
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
                              {/* ici aussi afficher le nom de la table ici */}
                            </td>
                            <td className="p-4 align-middle">
                              {order.customerName || <span className="text-muted-foreground italic">—</span>}
                            </td>
                            <td className="p-4 align-middle">
                              {/* fait attention ici */}
                            </td>
                            <td className="p-4 align-middle font-semibold">
                              {order.total.toLocaleString()} Ar
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                className={`${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                  order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                    'bg-red-100 text-red-800 hover:bg-red-100'
                                  }`}>
                                {order.status === 'pending' ? 'En attente' :
                                  order.status === 'completed' ? 'Terminée' :
                                    'Annulée'}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              {order.paymentMethod === 'cash' && <span className="text-sm">Espèces</span>}
                              {order.paymentMethod === 'pending' && <span className="text-sm text-muted-foreground italic">En attente</span>}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button size="icon" variant="outline">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Voir/Modifier</span>
                                </Button>
                                {order.status === 'pending' && (
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