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
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">Terrasse</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="p-4 rounded-md border-2 cursor-pointer relative border-green-400 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="font-bold text-lg">1</div>
                        <div className="text-sm truncate">Table 1</div>
                        <div className="text-xs mt-1">4 places</div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="default" size="sm" className="w-full mt-2">
                        Nouvelle commande
                      </Button>
                    </div>
                    <div className="p-4 rounded-md border-2 cursor-pointer relative border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="font-bold text-lg">2</div>
                        <div className="text-sm truncate">Table 2</div>
                        <div className="text-xs mt-1">6 places</div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs font-medium text-center mt-2">
                        Commande #101
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4 px-4 py-2 bg-muted rounded-md">Salle principale</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="p-4 rounded-md border-2 cursor-pointer relative border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="font-bold text-lg">3</div>
                        <div className="text-sm truncate">Table 3</div>
                        <div className="text-xs mt-1">2 places</div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs font-medium text-center mt-2 space-y-1">
                        <div className="font-semibold">Jean Dupont</div>
                        <div>19:00</div>
                        <div>2 pers.</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-md border-2 cursor-pointer relative border-green-400 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="font-bold text-lg">4</div>
                        <div className="text-sm truncate">Table 4</div>
                        <div className="text-xs mt-1">8 places</div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="default" size="sm" className="w-full mt-2">
                        Nouvelle commande
                      </Button>
                    </div>
                  </div>
                </div>
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
                          <SelectItem value="Terrasse">Terrasse</SelectItem>
                          <SelectItem value="Salle principale">Salle principale</SelectItem>
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
                  <Card className="overflow-hidden border-green-200">
                    <CardHeader className="pb-2 bg-green-50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          <span className='text-gray-700'>Table 1</span>
                          <span className="text-muted-foreground ml-1">#1</span>
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Disponible
                        </Badge>
                      </div>
                      <CardDescription>
                        Terrasse - 4 places
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm">
                        <span className="font-semibold">Prête à être occupée</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <PlusSquare className="mr-1 h-3 w-3" />
                        Commande
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="overflow-hidden border-blue-200">
                    <CardHeader className="pb-2 bg-blue-50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          <span className='text-gray-700'>Table 2</span>
                          <span className="text-muted-foreground ml-1">#2</span>
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Occupée
                        </Badge>
                      </div>
                      <CardDescription>
                        Terrasse - 6 places
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
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
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Voir
                      </Button>
                      <Button size="sm">
                        <DollarSign className="mr-1 h-3 w-3" />
                        Encaisser
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={true}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="overflow-hidden border-orange-200">
                    <CardHeader className="pb-2 bg-orange-50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          <span className='text-gray-700'>Table 3</span>
                          <span className="text-muted-foreground ml-1">#3</span>
                        </CardTitle>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          Réservée
                        </Badge>
                      </div>
                      <CardDescription>
                        Salle principale - 2 places
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm">
                        <span className="font-semibold">Réservation en attente</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <PlusSquare className="mr-1 h-3 w-3" />
                        Commande
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="overflow-hidden border-green-200">
                    <CardHeader className="pb-2 bg-green-50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          <span className='text-gray-700'>Table 4</span>
                          <span className="text-muted-foreground ml-1">#4</span>
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Disponible
                        </Badge>
                      </div>
                      <CardDescription>
                        Salle principale - 8 places
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm">
                        <span className="font-semibold">Prête à être occupée</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <PlusSquare className="mr-1 h-3 w-3" />
                        Commande
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
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
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">#101</td>
                          <td className="p-4 align-middle">
                            Table 2
                          </td>
                          <td className="p-4 align-middle">
                            Marie Dubois
                          </td>
                          <td className="p-4 align-middle">
                            1 article
                          </td>
                          <td className="p-4 align-middle font-semibold">
                            24,000 Ar
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              En attente
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm text-muted-foreground italic">En attente</span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button size="icon" variant="outline">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Voir/Modifier</span>
                              </Button>
                              <Button size="icon" variant="outline">
                                <DollarSign className="h-4 w-4" />
                                <span className="sr-only">Encaisser</span>
                              </Button>
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
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">#102</td>
                          <td className="p-4 align-middle">
                            À emporter
                          </td>
                          <td className="p-4 align-middle">
                            À emporter
                          </td>
                          <td className="p-4 align-middle">
                            1 article
                          </td>
                          <td className="p-4 align-middle font-semibold">
                            15,000 Ar
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Terminée
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm">Espèces</span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button size="icon" variant="outline">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Voir/Modifier</span>
                              </Button>
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