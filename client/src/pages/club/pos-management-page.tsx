import React, { useState, useCallback } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, PlusCircle, Terminal, UserPlus, FileCog, Settings, Package, History, Smartphone, Banknote, User, CreditCard, Trash, Clipboard } from 'lucide-react';
import { Button } from "../../components/ui/button";
import POSManagementModal, { POSDevice } from '../../components/POSManagementModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

// Données fictives pour les appareils POS
const posDevices: POSDevice[] = [
  { id: 1, name: "POS Principal", location: "Entrée", status: "online", lastActive: "Il y a 5 minutes", sales: 152000 },
  { id: 2, name: "POS Bar", location: "Bar central", status: "online", lastActive: "Il y a 2 minutes", sales: 98500 },
  { id: 3, name: "POS VIP", location: "Lounge VIP", status: "online", lastActive: "Il y a 8 minutes", sales: 235000 },
  { id: 4, name: "Terminal Mobile 1", location: "Mobile", status: "offline", lastActive: "Il y a 3 heures", sales: 42000 },
  { id: 5, name: "Terminal Mobile 2", location: "Mobile", status: "online", lastActive: "Il y a 15 minutes", sales: 67500 },
];

// Données fictives pour les transactions
const transactionData = [
  { date: '01/05', tickets: 120000, bar: 85000, vip: 150000 },
  { date: '02/05', tickets: 145000, bar: 92000, vip: 175000 },
  { date: '03/05', tickets: 135000, bar: 78000, vip: 160000 },
  { date: '04/05', tickets: 155000, bar: 95000, vip: 185000 },
  { date: '05/05', tickets: 180000, bar: 110000, vip: 220000 },
  { date: '06/05', tickets: 170000, bar: 105000, vip: 210000 },
  { date: '07/05', tickets: 190000, bar: 115000, vip: 240000 },
];

// Données fictives pour les employés
const employees = [
  { id: 1, name: "Jean Dupont", role: "Manager", devices: ["POS Principal"], status: "actif" },
  { id: 2, name: "Marie Claire", role: "Barman", devices: ["POS Bar"], status: "actif" },
  { id: 3, name: "Alexandre Martin", role: "Responsable VIP", devices: ["POS VIP"], status: "actif" },
  { id: 4, name: "Sophie Leclerc", role: "Serveur", devices: ["Terminal Mobile 1"], status: "inactif" },
  { id: 5, name: "Thomas Petit", role: "Serveur", devices: ["Terminal Mobile 2"], status: "actif" },
];

// Données pour les méthodes de paiement (graphique camembert)
const paymentMethodsData = [
  { name: 'Espèces', value: 35 },
  { name: 'Carte bancaire', value: 50 },
  { name: 'Mobile', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const POSManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // États pour les modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<POSDevice | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<POSDevice | null>(null);
  const [devices, setDevices] = useState<POSDevice[]>(posDevices);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtrer les appareils POS en fonction des filtres
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesLocation = locationFilter === "all" || device.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Obtenir les localisations uniques pour le filtre
  const uniqueLocations = Array.from(new Set(devices.map(device => device.location)));
  
  // Gestion des actions sur les terminaux POS
  const handleAddDevice = useCallback(() => {
    setEditingDevice(null);
    setIsAddModalOpen(true);
  }, []);
  
  const handleEditDevice = useCallback((device: POSDevice) => {
    setEditingDevice(device);
    setIsAddModalOpen(true);
  }, []);
  
  const handleToggleDeviceStatus = useCallback((device: POSDevice) => {
    setIsLoading(true);
    
    // Simule une requête API pour changer le statut
    setTimeout(() => {
      const newStatus = device.status === "online" ? "offline" as const : "online" as const;
      
      // Création d'un nouvel array strictement typé
      const updatedDevices: POSDevice[] = devices.map(d => {
        if (d.id === device.id) {
          return { 
            ...d, 
            status: newStatus 
          };
        }
        return d;
      });
      
      setDevices(updatedDevices);
      setIsLoading(false);
      
      toast({
        title: `Terminal ${newStatus === "online" ? "activé" : "désactivé"}`,
        description: `Le terminal "${device.name}" a été ${newStatus === "online" ? "activé" : "désactivé"} avec succès.`,
        variant: newStatus === "online" ? "default" : "destructive",
      });
    }, 500);
  }, [devices, toast]);
  
  const handleDeleteDevice = useCallback((device: POSDevice) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  }, []);
  
  const confirmDeleteDevice = useCallback(() => {
    if (!deviceToDelete) return;
    
    setIsLoading(true);
    
    // Simule une requête API pour supprimer l'appareil
    setTimeout(() => {
      const updatedDevices: POSDevice[] = devices.filter(d => d.id !== deviceToDelete.id);
      setDevices(updatedDevices);
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      
      toast({
        title: "Terminal supprimé",
        description: `Le terminal "${deviceToDelete.name}" a été supprimé avec succès.`,
        variant: "default",
      });
      
      setDeviceToDelete(null);
    }, 500);
  }, [deviceToDelete, devices, toast]);
  
  const handleSaveDevice = useCallback((device: POSDevice) => {
    setIsLoading(true);
    
    // Simule une requête API pour ajouter/mettre à jour l'appareil
    setTimeout(() => {
      let updatedDevices: POSDevice[];
      const isNew = !devices.some(d => d.id === device.id);
      
      if (isNew) {
        // Ajout d'un nouvel appareil
        updatedDevices = [...devices, device];
        toast({
          title: "Terminal ajouté",
          description: `Le terminal "${device.name}" a été ajouté avec succès.`,
          variant: "default",
        });
      } else {
        // Mise à jour d'un appareil existant
        updatedDevices = devices.map(d => d.id === device.id ? device : d);
        toast({
          title: "Terminal mis à jour",
          description: `Le terminal "${device.name}" a été mis à jour avec succès.`,
          variant: "default",
        });
      }
      
      setDevices(updatedDevices);
      setIsLoading(false);
    }, 500);
  }, [devices, toast]);

  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des points de vente</h1>
            <p className="text-muted-foreground">Gérez vos terminaux POS, les utilisateurs et suivez vos ventes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <a href="/club/pos-catalog">
                <Clipboard className="mr-2 h-4 w-4" />
                Gérer le catalogue produits
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-4xl mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="devices">Terminaux</TabsTrigger>
            <TabsTrigger value="employees">Utilisateurs</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Chiffre d'affaires total</CardTitle>
                  <CardDescription>Montant total des ventes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">595 000 Ar</div>
                  <p className="text-xs text-muted-foreground mt-1">+12.5% depuis le mois dernier</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Terminaux actifs</CardTitle>
                  <CardDescription>Nombre de terminaux en ligne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4 / 5</div>
                  <p className="text-xs text-muted-foreground mt-1">1 terminal hors ligne</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Transactions aujourd'hui</CardTitle>
                  <CardDescription>Nombre de transactions traitées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground mt-1">Ticket moyen: 4 685 Ar</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes par catégorie</CardTitle>
                  <CardDescription>Détail des ventes des 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={transactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} Ar`} />
                        <Legend />
                        <Bar dataKey="tickets" name="Billets" fill="#8884d8" />
                        <Bar dataKey="bar" name="Consommations" fill="#82ca9d" />
                        <Bar dataKey="vip" name="Services VIP" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>Répartition des méthodes de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Terminaux POS */}
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Terminaux POS</CardTitle>
                    <CardDescription>Gérez vos appareils de point de vente</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleAddDevice()}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un terminal
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un terminal..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="status">Statut</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="online">En ligne</SelectItem>
                          <SelectItem value="offline">Hors ligne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="location">Emplacement</Label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les emplacements" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les emplacements</SelectItem>
                          {uniqueLocations.map(location => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Emplacement</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dernière activité</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ventes</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredDevices.map((device) => (
                          <tr key={device.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{device.id}</td>
                            <td className="p-4 align-middle font-medium">{device.name}</td>
                            <td className="p-4 align-middle">{device.location}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                device.status === 'online' 
                                  ? 'bg-green-50 text-green-700 border border-green-300' 
                                  : 'bg-red-50 text-red-700 border border-red-300'
                              }`}>
                                {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                              </span>
                            </td>
                            <td className="p-4 align-middle">{device.lastActive}</td>
                            <td className="p-4 align-middle">{device.sales.toLocaleString()} Ar</td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <button 
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                                  onClick={() => handleEditDevice(device)}
                                >
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </button>
                                <button 
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                                  onClick={() => handleToggleDeviceStatus(device)}
                                >
                                  <Terminal className="h-4 w-4" />
                                  <span className="sr-only">Activer/Désactiver</span>
                                </button>
                                <button 
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 w-8 p-0"
                                  onClick={() => handleDeleteDevice(device)}
                                >
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Supprimer</span>
                                </button>
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

          {/* Employés */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Utilisateurs POS</CardTitle>
                    <CardDescription>Gérez les accès de vos employés aux terminaux</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rôle</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Terminaux assignés</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {employees.map((employee) => (
                          <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{employee.id}</td>
                            <td className="p-4 align-middle font-medium">{employee.name}</td>
                            <td className="p-4 align-middle">{employee.role}</td>
                            <td className="p-4 align-middle">{employee.devices.join(', ')}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                employee.status === 'actif' 
                                  ? 'bg-green-50 text-green-700 border border-green-300' 
                                  : 'bg-orange-50 text-orange-700 border border-orange-300'
                              }`}>
                                {employee.status === 'actif' ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                                  <Smartphone className="h-4 w-4" />
                                  <span className="sr-only">Appareils</span>
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                                  <Package className="h-4 w-4" />
                                  <span className="sr-only">Permissions</span>
                                </button>
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

          {/* Historique */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Historique des transactions</CardTitle>
                    <CardDescription>Consultez l'historique des transactions récentes</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 border border-input">
                      <History className="mr-2 h-4 w-4" />
                      Exporter
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Terminal</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Opérateur</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Montant</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Méthode de paiement</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">#8742</td>
                          <td className="p-4 align-middle">07/05/2025 21:35</td>
                          <td className="p-4 align-middle">POS Principal</td>
                          <td className="p-4 align-middle">Jean Dupont</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              <span>Vente</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">12 500 Ar</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Carte bancaire</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">#8741</td>
                          <td className="p-4 align-middle">07/05/2025 21:22</td>
                          <td className="p-4 align-middle">POS Bar</td>
                          <td className="p-4 align-middle">Marie Claire</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              <span>Vente</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">8 000 Ar</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>Espèces</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">#8740</td>
                          <td className="p-4 align-middle">07/05/2025 21:17</td>
                          <td className="p-4 align-middle">POS VIP</td>
                          <td className="p-4 align-middle">Alexandre Martin</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              <span>Vente</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">25 000 Ar</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Carte bancaire</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">#8739</td>
                          <td className="p-4 align-middle">07/05/2025 21:05</td>
                          <td className="p-4 align-middle">Terminal Mobile 2</td>
                          <td className="p-4 align-middle">Thomas Petit</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              <span>Vente</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">5 500 Ar</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Smartphone className="mr-2 h-4 w-4" />
                              <span>Mobile</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">#8738</td>
                          <td className="p-4 align-middle">07/05/2025 20:55</td>
                          <td className="p-4 align-middle">POS Principal</td>
                          <td className="p-4 align-middle">Jean Dupont</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              <span>Vente</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle font-medium">15 000 Ar</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>Espèces</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Affichage de 5 sur 123 transactions
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Précédent
                      </button>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal pour l'ajout/modification de terminaux POS */}
      <POSManagementModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveDevice}
        editingDevice={editingDevice}
        locations={uniqueLocations}
      />
      
      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteDevice}
        title="Supprimer le terminal"
        description={`Êtes-vous sûr de vouloir supprimer le terminal "${deviceToDelete?.name}" ? Cette action est irréversible.`}
        isLoading={isLoading}
      />
    </ResponsiveLayout>
  );
};

export default POSManagementPage;