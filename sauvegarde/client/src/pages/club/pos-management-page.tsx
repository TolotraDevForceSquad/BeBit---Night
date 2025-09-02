import React, { useState, useCallback, useEffect } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, PlusCircle, Terminal, UserPlus, FileCog, Settings, Package, History, Smartphone, Banknote, User, CreditCard, Trash, ClipboardList } from 'lucide-react';
import { Button } from "../../components/ui/button";
import POSManagementModal, { POSDevice, Employee } from '../../components/POSManagementModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { api } from '../../services/api';
import { format } from 'date-fns';

interface Transaction {
  id: number;
  type: string;
  description: string;
  amount: number;
  timestamp: string;
  userName: string;
  tableName: string;
  paymentMethod: string;
}

interface SalesData {
  date: string;
  tickets: number;
  bar: number;
  vip: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const POSManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // États pour les données réelles
  const [devices, setDevices] = useState<POSDevice[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<{ name: string, value: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [todayTransactions, setTodayTransactions] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);

  // États pour les modals des terminaux
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<POSDevice | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<POSDevice | null>(null);

  // Nouveaux États pour les modals des employés
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // 1️⃣ Charger les appareils POS
      const posDevicesRaw = await api.getAllPosDevices();
      const posDevices: POSDevice[] = posDevicesRaw.map(d => ({
        id: d.id,
        name: d.name,
        location: d.location,
        status: d.status,
        lastActive: d.last_active ? new Date(d.last_active).toISOString() : null,
        sales: Number(d.sales) || 0
      }));
      setDevices(posDevices);
      setActiveDevices(posDevices.filter(d => d.status === 'active').length);

      // 2️⃣ Charger les employés
      const employeesRaw = await api.getAllEmployees();
      const employeesData: Employee[] = employeesRaw.map(e => ({
        id: e.id,
        name: e.name,
        pin: e.pin,
        role: e.role
      }));
      setEmployees(employeesData);

      // 3️⃣ Charger l'historique des transactions (7 derniers jours)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const posHistoryRaw = await api.getAllPosHistory({ startDate, endDate });
      const posHistory: Transaction[] = posHistoryRaw.map(t => ({
        id: t.id,
        type: t.type,
        description: t.description,
        amount: Number(t.amount) || 0,
        timestamp: new Date(t.timestamp).toISOString(),
        userName: t.user_name || 'Inconnu',
        tableName: t.table_name || '',
        paymentMethod: t.payment_method || 'inconnu'
      }));

      setTransactions(posHistory.slice(0, 5));

      // 4️⃣ Calcul des données pour graphiques et KPIs
      calculateSalesData(posHistory);
      calculatePaymentMethodsData(posHistory);
      calculateKPIs(posHistory);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du système POS",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSalesData = (transactions: Transaction[]) => {
    const salesByDate: { [key: string]: SalesData } = {};

    transactions.forEach(transaction => {
      if (transaction.type === 'sale' && transaction.amount) {
        const date = format(new Date(transaction.timestamp), 'dd/MM');

        if (!salesByDate[date]) {
          salesByDate[date] = { date, tickets: 0, bar: 0, vip: 0 };
        }

        const desc = (transaction.description || '').toLowerCase();
        if (desc.includes('ticket') || desc.includes('billet')) salesByDate[date].tickets += transaction.amount;
        else if (desc.includes('bar') || desc.includes('consommation')) salesByDate[date].bar += transaction.amount;
        else if (desc.includes('vip')) salesByDate[date].vip += transaction.amount;
        else salesByDate[date].bar += transaction.amount;
      }
    });

    setSalesData(Object.values(salesByDate));
  };

  const calculatePaymentMethodsData = (transactions: Transaction[]) => {
    const paymentMethods: { [key: string]: number } = {};
    let total = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'sale' && transaction.amount) {
        const method = transaction.paymentMethod || 'inconnu';
        paymentMethods[method] = (paymentMethods[method] || 0) + transaction.amount;
        total += transaction.amount;
      }
    });

    const data = Object.entries(paymentMethods).map(([name, value]) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0
    }));

    setPaymentMethodsData(data);
  };

  const calculateKPIs = (transactions: Transaction[]) => {
    const revenue = transactions
      .filter(t => t.type === 'sale' && t.amount)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setTotalRevenue(revenue);

    const today = new Date().toDateString();
    const todayTransactionsCount = transactions.filter(t =>
      new Date(t.timestamp).toDateString() === today && t.type === 'sale'
    ).length;

    setTodayTransactions(todayTransactionsCount);

    const sales = transactions.filter(t => t.type === 'sale' && t.amount);
    const avgTicket = sales.length > 0 ? revenue / sales.length : 0;
    setAverageTicket(Math.round(avgTicket));
  };

  // Filtrer les appareils POS en fonction des filtres
  // --- Filtrage et uniqueLocations ---
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "online" && device.status === "active") ||
      (statusFilter === "offline" && device.status !== "active");
    const matchesLocation = locationFilter === "all" || device.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });
  // Obtenir les localisations uniques pour le filtre
  const uniqueLocations = Array.from(new Set(devices.map(device => device.location || '').filter(loc => loc)));

  // Gestion des actions sur les terminaux POS
  const handleAddDevice = useCallback(() => {
    setEditingDevice(null);
    setIsDeviceModalOpen(true);
  }, []);

  const handleEditDevice = useCallback((device: POSDevice) => {
    setEditingDevice(device);
    setIsDeviceModalOpen(true);
  }, []);

  const handleToggleDeviceStatus = useCallback(async (device: POSDevice) => {
    try {
      setIsLoading(true);
      const newStatus = device.status === "active" ? "inactive" as const : "active" as const;

      await api.updatePosDevice(device.id, { status: newStatus });

      // Mettre à jour l'état local
      const updatedDevices = devices.map(d =>
        d.id === device.id ? { ...d, status: newStatus } : d
      );

      setDevices(updatedDevices);
      setActiveDevices(updatedDevices.filter(d => d.status === 'active').length);

      toast({
        title: `Terminal ${newStatus === "active" ? "activé" : "désactivé"}`,
        description: `Le terminal "${device.name}" a été ${newStatus === "active" ? "activé" : "désactivé"} avec succès.`,
        variant: newStatus === "active" ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du terminal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [devices, toast]);

  const handleDeleteDevice = useCallback((device: POSDevice) => {
    setDeviceToDelete(device);
    setIsDeviceModalOpen(true);
  }, []);

  const confirmDeleteDevice = useCallback(async () => {
    if (!deviceToDelete) return;

    try {
      setIsLoading(true);
      await api.deletePosDevice(deviceToDelete.id);

      // Mettre à jour l'état local
      const updatedDevices = devices.filter(d => d.id !== deviceToDelete.id);
      setDevices(updatedDevices);

      toast({
        title: "Terminal supprimé",
        description: `Le terminal "${deviceToDelete.name}" a été supprimé avec succès.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le terminal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeviceModalOpen(false);
      setDeviceToDelete(null);
    }
  }, [deviceToDelete, devices, toast]);

  const handleSaveDevice = useCallback(async (deviceData: POSDevice) => {
    try {
      setIsLoading(true);
      let updatedDevice: POSDevice;

      if (deviceData.id) {
        // Mise à jour d'un appareil existant
        const dataToSend = {
          name: deviceData.name,
          location: deviceData.location,
          status: deviceData.status,
        };

        updatedDevice = await api.updatePosDevice(deviceData.id, dataToSend);
        const updatedDevices = devices.map(d =>
          d.id === deviceData.id ? updatedDevice : d
        );
        setDevices(updatedDevices);
        toast({
          title: "Terminal mis à jour",
          description: `Le terminal "${deviceData.name}" a été mis à jour avec succès.`,
          variant: "default",
        });
      } else {
        // Pour un nouveau device
        const dataToSend = {
          name: deviceData.name,
          location: deviceData.location,
          status: deviceData.status,
        };

        updatedDevice = await api.createPosDevice(dataToSend);
        setDevices([...devices, updatedDevice]);
        toast({
          title: "Terminal ajouté",
          description: `Le terminal "${deviceData.name}" a été ajouté avec succès.`,
          variant: "default",
        });
      }

      // Fermer le modal après sauvegarde réussie
      setIsDeviceModalOpen(false);
      setEditingDevice(null);
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la sauvegarde";
      const validationErrors = error.response?.data?.errors || [];

      toast({
        title: "Erreur de validation",
        description: (
          <div>
            <p>{errorMessage}</p>
            {validationErrors.length > 0 && (
              <ul className="mt-1">
                {validationErrors.map((err: any, index: number) => (
                  <li key={index} className="text-xs">- {err.path}: {err.message}</li>
                ))}
              </ul>
            )}
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [devices, toast]);

  // NOUVELLES FONCTIONS DE GESTION DES EMPLOYÉS
  const handleAddEmployee = useCallback(() => {
    setEditingEmployee(null);
    setIsEmployeeModalOpen(true);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeModalOpen(true);
  }, []);

  const handleDeleteEmployee = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsEmployeeModalOpen(true);
  }, []);

  const confirmDeleteEmployee = useCallback(async () => {
    if (!employeeToDelete) return;

    try {
      setIsLoading(true);
      await api.deleteEmployee(employeeToDelete.id);

      // Mettre à jour l'état local
      const updatedEmployees = employees.filter(e => e.id !== employeeToDelete.id);
      setEmployees(updatedEmployees);

      toast({
        title: "Employé supprimé",
        description: `L'employé "${employeeToDelete.name}" a été supprimé avec succès.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'employé",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsEmployeeModalOpen(false);
      setEmployeeToDelete(null);
    }
  }, [employeeToDelete, employees, toast]);

  const handleSaveEmployee = useCallback(async (employeeData: Employee) => {
    try {
      setIsLoading(true);
      let updatedEmployee: Employee;

      if (employeeData.id) {
        // Mise à jour d'un employé existant
        updatedEmployee = await api.updateEmployee(employeeData.id, employeeData);
        const updatedEmployees = employees.map(e =>
          e.id === employeeData.id ? updatedEmployee : e
        );
        setEmployees(updatedEmployees);
        toast({
          title: "Employé mis à jour",
          description: `L'employé "${employeeData.name}" a été mis à jour avec succès.`,
          variant: "default",
        });
      } else {
        // Création d'un nouvel employé - enlever l'ID vide
        const dataToSend = {
          name: employeeData.name,
          pin: employeeData.pin,
          role: employeeData.role
        };

        updatedEmployee = await api.createEmployee(dataToSend);
        setEmployees([...employees, updatedEmployee]);
        toast({
          title: "Employé ajouté",
          description: `L'employé "${employeeData.name}" a été ajouté avec succès.`,
          variant: "default",
        });
      }

      // Fermer le modal après sauvegarde réussie
      setIsEmployeeModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'employé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'employé",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [employees, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA'
    }).format(amount);
  };

  const getStatusDisplay = (status: string) => {
    return status === 'active' ? 'En ligne' : 'Hors ligne';
  };

  const getStatusClass = (status: string) => {
    return status === 'active'
      ? 'bg-green-950 text-green-400 border border-green-700'
      : 'bg-red-950 text-red-400 border border-red-700';
  };

  return (
    <POSLayout>
      <div className="p-6 bg-background text-foreground dark:bg-gray-950 dark:text-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des points de vente</h1>
            <p className="text-muted-foreground dark:text-gray-400">Gérez vos terminaux POS, les utilisateurs et suivez vos ventes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <a href="/club/pos-catalog">
                <ClipboardList className="mr-2 h-4 w-4" />
                Gérer le catalogue produits
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-4xl mb-6 bg-muted dark:bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Aperçu</TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Terminaux</TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Utilisateurs</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-background dark:data-[state=active]:bg-gray-900">Historique</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Chiffre d'affaires total</CardTitle>
                  <CardDescription className="dark:text-gray-400">Montant total des ventes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">7 derniers jours</p>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Terminaux actifs</CardTitle>
                  <CardDescription className="dark:text-gray-400">Nombre de terminaux en ligne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeDevices} / {devices.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
                    {devices.length - activeDevices} terminal{devices.length - activeDevices !== 1 ? 's' : ''} hors ligne
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Transactions aujourd's hui</CardTitle>
                  <CardDescription className="dark:text-gray-400">Nombre de transactions traitées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todayTransactions}</div>
                  <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
                    Ticket moyen: {formatCurrency(averageTicket)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
                <CardHeader>
                  <CardTitle>Ventes par catégorie</CardTitle>
                  <CardDescription className="dark:text-gray-400">Détail des ventes des 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                        <XAxis dataKey="date" className="fill-current text-gray-900 dark:text-gray-50" />
                        <YAxis className="fill-current text-gray-900 dark:text-gray-50" />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="tickets" name="Billets" fill="#8884d8" />
                        <Bar dataKey="bar" name="Consommations" fill="#82ca9d" />
                        <Bar dataKey="vip" name="Services VIP" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription className="dark:text-gray-400">Répartition des méthodes de paiement</CardDescription>
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
            <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Terminaux POS</CardTitle>
                    <CardDescription className="dark:text-gray-400">Gérez vos appareils de point de vente</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleAddDevice}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un terminal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    <Input
                      placeholder="Rechercher un terminal..."
                      className="pl-8 bg-background dark:bg-gray-950 text-foreground dark:text-gray-50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="status" className="dark:text-gray-50">Statut</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="online">En ligne</SelectItem>
                          <SelectItem value="offline">Hors ligne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="location" className="dark:text-gray-50">Emplacement</Label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectValue placeholder="Tous les emplacements" />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-gray-950 text-foreground dark:text-gray-50">
                          <SelectItem value="all">Tous les emplacements</SelectItem>
                          {uniqueLocations.map(location => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-gray-200 dark:border-gray-800">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Emplacement</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Statut</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Dernière activité</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Ventes</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredDevices.map((device) => (
                          <tr key={device.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 border-gray-200 dark:border-gray-800">
                            <td className="p-4 align-middle">{device.id}</td>
                            <td className="p-4 align-middle font-medium">{device.name}</td>
                            <td className="p-4 align-middle">{device.location || 'Non spécifié'}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(device.status)}`}>
                                {getStatusDisplay(device.status)}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              {device.lastActive ? format(new Date(device.lastActive), 'dd/MM/yyyy HH:mm') : 'Jamais'}
                            </td>
                            <td className="p-4 align-middle">{formatCurrency(device.sales || 0)}</td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditDevice(device)}
                                >
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleToggleDeviceStatus(device)}
                                >
                                  <Terminal className="h-4 w-4" />
                                  <span className="sr-only">Activer/Désactiver</span>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteDevice(device)}
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

          {/* Employés */}
          <TabsContent value="employees">
            <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Utilisateurs POS</CardTitle>
                    <CardDescription className="dark:text-gray-400">Gérez les accès de vos employés aux terminaux</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleAddEmployee}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-200 dark:border-gray-800">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Rôle</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">PIN</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {employees.map((employee) => (
                          <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 border-gray-200 dark:border-gray-800">
                            <td className="p-4 align-middle">{employee.id}</td>
                            <td className="p-4 align-middle font-medium">{employee.name}</td>
                            <td className="p-4 align-middle">{employee.role}</td>
                            <td className="p-4 align-middle">{employee.pin}</td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handleEditEmployee(employee)}>
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteEmployee(employee)}>
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

          {/* Historique */}
          <TabsContent value="history">
            <Card className="bg-card text-card-foreground dark:bg-gray-900 dark:text-gray-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Historique des transactions</CardTitle>
                    <CardDescription className="dark:text-gray-400">Consultez l'historique des transactions récentes</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <History className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-200 dark:border-gray-800">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b border-gray-200 dark:border-gray-800">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Opérateur</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Description</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Montant</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground dark:text-gray-400">Méthode de paiement</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 border-gray-200 dark:border-gray-800">
                            <td className="p-4 align-middle">#{transaction.id}</td>
                            <td className="p-4 align-middle">
                              {format(new Date(transaction.timestamp), 'dd/MM/yyyy HH:mm')}
                            </td>
                            <td className="p-4 align-middle">{transaction.userName || 'Inconnu'}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                <Banknote className="mr-2 h-4 w-4" />
                                <span>{transaction.type === 'sale' ? 'Vente' : transaction.type}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{transaction.description}</td>
                            <td className="p-4 align-middle font-medium">
                              {transaction.amount ? formatCurrency(transaction.amount) : '-'}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                {transaction.paymentMethod === 'cash' ? (
                                  <>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Espèces</span>
                                  </>
                                ) : transaction.paymentMethod === 'card' ? (
                                  <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Carte bancaire</span>
                                  </>
                                ) : transaction.paymentMethod === 'mobile' ? (
                                  <>
                                    <Smartphone className="mr-2 h-4 w-4" />
                                    <span>Mobile</span>
                                  </>
                                ) : (
                                  <span>{transaction.paymentMethod || 'Inconnu'}</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      Affichage de {transactions.length} transactions récentes
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Précédent
                      </Button>
                      <Button variant="outline" size="sm">
                        Suivant
                      </Button>
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
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onSave={handleSaveDevice}
        editingDevice={editingDevice}
        editingEmployee={null}
        locations={uniqueLocations}
        mode="device"
      />

      {/* Modal pour l'ajout/modification d'employés */}
      <POSManagementModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        editingEmployee={editingEmployee}
        editingDevice={null}
        locations={uniqueLocations}
        mode="employee"
      />

      {/* Modal de confirmation de suppression pour les terminaux */}
      <DeleteConfirmationModal
        isOpen={!!deviceToDelete}
        onClose={() => setDeviceToDelete(null)}
        onConfirm={confirmDeleteDevice}
        title="Supprimer le terminal"
        description={`Êtes-vous sûr de vouloir supprimer le terminal "${deviceToDelete?.name}" ? Cette action est irréversible.`}
        isLoading={isLoading}
      />

      {/* Modal de confirmation de suppression pour les employés */}
      <DeleteConfirmationModal
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={confirmDeleteEmployee}
        title="Supprimer l'employé"
        description={`Êtes-vous sûr de vouloir supprimer l'employé "${employeeToDelete?.name}" ? Cette action est irréversible.`}
        isLoading={isLoading}
      />
    </POSLayout>
  );
};

export default POSManagementPage;