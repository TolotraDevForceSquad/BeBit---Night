import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, PlusCircle, Terminal, UserPlus, Settings, Package, Smartphone, Banknote, CreditCard, Trash, ClipboardList, TrendingUp, Users, Activity, DollarSign } from 'lucide-react';
import POSLayout from '../../layouts/POSLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { api } from '../../services/api'; // Ajustez le chemin vers api.ts selon votre structure de projet
import { PosDevice, Employee, Transaction, PaymentMethod } from "@shared/schema";
import POSManagementModal, { POSDevice as ModalPOSDevice, Employee as ModalEmployee } from '../../components/POSManagementModal'; // Ajustez le chemin selon votre structure
import { Link } from 'wouter';

const COLORS = ['#EC4899', '#06B6D4', '#F59E0B']; // Pink, Cyan, Amber to match layout accents

const POSManagementPage: React.FC = () => {
  // State for data
  const [deviceList, setDeviceList] = useState<PosDevice[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // State for filters
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('all');
  const [deviceLocationFilter, setDeviceLocationFilter] = useState('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'device' | 'employee'>('device');
  const [editingDevice, setEditingDevice] = useState<ModalPOSDevice | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<ModalEmployee | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [devicesRes, employeesRes, transactionsRes, paymentMethodsRes] = await Promise.all([
          api.getAllPosDevices({}),
          api.getAllEmployees({}),
          api.getAllTransactions({}),
          api.getAllPaymentMethods()
        ]);
        setDeviceList(devicesRes);
        setEmployees(employeesRes);
        setTransactions(transactionsRes);
        setPaymentMethods(paymentMethodsRes);

        console.log("Devices : ", JSON.stringify(devicesRes, null, 2));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);

  // Locations for modal
  const locations = [...new Set(deviceList.map(d => d.location))];

  // Calculate total revenue
  const totalRevenue = transactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  // Calculate active devices
  const activeDevices = deviceList.filter(d => d.status).length;
  const totalDevices = deviceList.length;

  // Prepare data for sales by category chart
  const salesByCategory = transactions.reduce((acc, t) => {
    const dateStr = t.createdAt ? t.createdAt.toISOString().split('T')[0] : '';
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, tickets: 0, bar: 0, vip: 0 };
    }
    const typeKey = t.type || '';
    if (typeKey in acc[dateStr]) {
      acc[dateStr][typeKey as keyof typeof acc[dateStr]] = (acc[dateStr][typeKey as keyof typeof acc[dateStr]] || 0) + parseFloat(t.amount || '0');
    }
    return acc;
  }, {} as { [key: string]: { date: string; tickets: number; bar: number; vip: number } });
  const salesData = Object.values(salesByCategory);

  // Format date for display
  const formatDate = (input: string | Date | null | undefined): string => {
    if (!input) return 'Inconnue';
    const date = typeof input === 'string' ? new Date(input) : input;
    if (isNaN(date.getTime())) return 'Invalide';
    return date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  // Filter devices
  const filteredDevices = deviceList.filter(device => {
    const matchesSearch = device.name?.toLowerCase().includes(deviceSearch.toLowerCase()) || false;
    const matchesStatus = deviceStatusFilter === 'all' || (deviceStatusFilter === 'online' ? device.status : !device.status);
    const matchesLocation = deviceLocationFilter === 'all' || device.location === deviceLocationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description?.toLowerCase().includes(transactionSearch.toLowerCase()) || false;
    const matchesType = transactionTypeFilter === 'all' || t.type === transactionTypeFilter;
    return matchesSearch && matchesType;
  });

  // Toggle device status
  const toggleDeviceStatus = async (id: number) => {
    try {
      const device = deviceList.find(d => d.id === id);
      if (!device) return;
      const newStatus = !device.status;
      const updatedDevice = await api.updatePosDevice(id, { status: newStatus });
      setDeviceList(prev => prev.map(d => d.id === id ? updatedDevice : d));
    } catch (err) {
      console.error('Error updating device status:', err);
      alert('Erreur lors de la mise à jour du statut du terminal.');
    }
  };

  // Handle save from modal
  const handleSave = async (data: ModalPOSDevice | ModalEmployee) => {
    try {
      if (modalType === 'device') {
        const deviceData = data as ModalPOSDevice;
        let updatedList: PosDevice[];
        if (editingDevice && deviceData.id) {
          const { id, ...updateData } = deviceData;
          const updated = await api.updatePosDevice(deviceData.id, updateData);
          updatedList = deviceList.map(d => d.id === updated.id ? updated : d);
        } else {
          const { id, ...insertData } = deviceData;
          const newDevice = await api.createPosDevice(insertData);
          updatedList = [...deviceList, newDevice];
        }
        setDeviceList(updatedList);
      } else {
        const employeeData = data as ModalEmployee;
        let updatedEmployees: Employee[];
        if (editingEmployee && employeeData.id) {
          const { id, ...updateData } = employeeData;
          const updated = await api.updateEmployee(employeeData.id.toString(), updateData);
          updatedEmployees = employees.map(e => e.id === updated.id ? updated : e);
        } else {
          const { id, ...insertData } = employeeData;
          const newEmp = await api.createEmployee(insertData);
          updatedEmployees = [...employees, newEmp];
        }
        setEmployees(updatedEmployees);
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setShowModal(false);
      setEditingDevice(null);
      setEditingEmployee(null);
    }
  };

  // Handle delete device
  const handleDeleteDevice = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce terminal ?')) return;
    try {
      await api.deletePosDevice(id);
      setDeviceList(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting device:', err);
      alert('Erreur lors de la suppression du terminal.');
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await api.deleteEmployee(id.toString());
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Erreur lors de la suppression de l\'utilisateur.');
    }
  };

  // Open modal handlers
  const openDeviceModal = (device?: ModalPOSDevice) => {
    setModalType('device');
    setEditingDevice(device || null);
    setShowModal(true);
  };

  const openEmployeeModal = (employee?: ModalEmployee) => {
    setModalType('employee');
    setEditingEmployee(employee || null);
    setShowModal(true);
  };

  return (
    <POSLayout>
      <div className="p-6 space-y-6 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Settings className="h-8 w-8 text-pink-400" />
              Gestion des points de vente
            </h1>
            <p className="text-gray-400 mt-1">Gérez vos terminaux POS, les utilisateurs et suivez vos ventes en toute simplicité</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild className="border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white">
              <Link href="/club/pos-catalog">
                <ClipboardList className="mr-2 h-4 w-4" />
                Gérer le catalogue produits
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-4xl mb-6 bg-gray-900 text-gray-400 rounded-xl p-1 border border-gray-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg "
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger 
              value="devices" 
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg "
            >
              <Terminal className="h-4 w-4 mr-2" />
              Terminaux
            </TabsTrigger>
            <TabsTrigger 
              value="employees" 
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg "
            >
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            {/* <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg py-2"
            >
              <Activity className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <CardTitle className="text-lg font-semibold text-white">Chiffre d'affaires total</CardTitle>
                  </div>
                  <CardDescription className="text-gray-500">Montant total des ventes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-400">{totalRevenue.toLocaleString()} Ar</div>
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +12.5% depuis le mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="h-5 w-5 text-cyan-400" />
                    <CardTitle className="text-lg font-semibold text-white">Terminaux actifs</CardTitle>
                  </div>
                  <CardDescription className="text-gray-500">Nombre de terminaux en ligne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">{activeDevices} / {totalDevices}</div>
                  <p className="text-sm text-gray-500 mt-1">{totalDevices - activeDevices} terminal(s) hors ligne</p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-amber-400" />
                    <CardTitle className="text-lg font-semibold text-white">Transactions totales</CardTitle>
                  </div>
                  <CardDescription className="text-gray-500">Nombre de transactions traitées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-400">{transactions.length}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket moyen: {transactions.length > 0 ? (totalRevenue / transactions.length).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : 0} Ar
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-pink-400" />
                    Ventes par catégorie
                  </CardTitle>
                  <CardDescription className="text-gray-500">Détail des ventes des 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                        <XAxis dataKey="date" fill="#9CA3AF" fontSize={12} />
                        <YAxis fill="#9CA3AF" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000000', border: 'none', borderRadius: '8px', color: '#FFFFFF' }}
                          formatter={(value: number) => `${value.toLocaleString()} Ar`}
                        />
                        <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                        <Bar dataKey="tickets" name="Billets" fill="#EC4899" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="bar" name="Consommations" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="vip" name="Services VIP" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-cyan-400" />
                    Méthodes de paiement
                  </CardTitle>
                  <CardDescription className="text-gray-500">Répartition des méthodes de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethods.map(pm => ({ name: pm.name, value: Math.random() * 100 }))} // Demo data; adjust as needed
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          labelStyle={{ fill: '#FFFFFF', fontSize: '12px' }}
                        >
                          {paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000000', border: 'none', borderRadius: '8px', color: '#FFFFFF' }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Terminal className="h-6 w-6 text-cyan-400" />
                      Terminaux POS
                    </CardTitle>
                    <CardDescription className="text-gray-500">Gérez vos appareils de point de vente</CardDescription>
                  </div>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={() => openDeviceModal()}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter un terminal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher un terminal..."
                      className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="status" className="text-gray-400">Statut</Label>
                      <Select value={deviceStatusFilter} onValueChange={setDeviceStatusFilter}>
                        <SelectTrigger className="bg-gray-900 border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800 text-white">
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="online">En ligne</SelectItem>
                          <SelectItem value="offline">Hors ligne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                      <Label htmlFor="location" className="text-gray-400">Emplacement</Label>
                      <Select value={deviceLocationFilter} onValueChange={setDeviceLocationFilter}>
                        <SelectTrigger className="bg-gray-900 border-gray-800 text-white rounded-lg">
                          <SelectValue placeholder="Tous les emplacements" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800 text-white">
                          <SelectItem value="all">Tous les emplacements</SelectItem>
                          {locations.map(location => (
                            <SelectItem key={location} value={location}>{location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Emplacement</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Statut</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Dernière activité</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Ventes</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDevices.map(device => (
                          <tr key={device.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                            <td className="p-4 font-medium">{device.id}</td>
                            <td className="p-4 font-semibold text-white">{device.name}</td>
                            <td className="p-4 text-gray-500">{device.location}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                device.status 
                                  ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                                  : 'bg-red-900/30 text-red-400 border border-red-800/50'
                              }`}>
                                {device.status ? 'En ligne' : 'Hors ligne'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">{formatDate(device.lastActive)}</td>
                            <td className="p-4 text-pink-400 font-semibold">{(device.sales || 0).toLocaleString()} Ar</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 border-gray-800 text-gray-400 hover:bg-gray-900"
                                  onClick={() => openDeviceModal(device as ModalPOSDevice)}
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border-gray-800 text-gray-400 hover:bg-gray-900"
                                  onClick={() => toggleDeviceStatus(device.id!)}
                                >
                                  <Terminal className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleDeleteDevice(device.id!)}
                                >
                                  <Trash className="h-4 w-4" />
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

          <TabsContent value="employees">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-6 w-6 text-pink-400" />
                      Utilisateurs POS
                    </CardTitle>
                    <CardDescription className="text-gray-500">Gérez les accès de vos employés aux terminaux</CardDescription>
                  </div>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
                    onClick={() => openEmployeeModal()}
                  >
                    <UserPlus className="h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Nom</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Rôle</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Terminaux assignés</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Statut</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(employee => (
                          <tr key={employee.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                            <td className="p-4 font-medium">{employee.id}</td>
                            <td className="p-4 font-semibold text-white">{employee.name}</td>
                            <td className="p-4 text-gray-500">{employee.role}</td>
                            <td className="p-4 text-gray-500">{deviceList.find(d => d.id === employee.deviceId)?.name || 'Aucun'}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                employee.status 
                                  ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                                  : 'bg-orange-900/30 text-orange-400 border border-orange-800/50'
                              }`}>
                                {employee.status ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 border-gray-800 text-gray-400 hover:bg-gray-900"
                                  onClick={() => openEmployeeModal({ ...employee } as ModalEmployee)}
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleDeleteEmployee(employee.id!)}
                                >
                                  <Trash className="h-4 w-4" />
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

          <TabsContent value="history">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-6 w-6 text-amber-400" />
                      Historique des transactions
                    </CardTitle>
                    <CardDescription className="text-gray-500">Consultez l'historique des transactions récentes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher une transaction..."
                      className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="type" className="text-gray-400">Type</Label>
                    <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                      <SelectTrigger className="bg-gray-900 border-gray-800 text-white rounded-lg">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="tickets">Billets</SelectItem>
                        <SelectItem value="bar">Consommations</SelectItem>
                        <SelectItem value="vip">Services VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">ID</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Date</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Terminal</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Opérateur</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Type</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Montant</th>
                          <th className="h-12 px-4 text-left font-medium text-gray-400">Méthode de paiement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map(t => {
                          const employee = employees.find(e => e.id === t.userId);
                          const terminal = employee ? deviceList.find(d => d.id === employee.deviceId) : undefined;
                          const pm = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                          const IconComponent = pm.name === 'Espèces' ? Banknote : pm.name === 'Mobile' ? Smartphone : CreditCard;
                          return (
                            <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                              <td className="p-4 font-medium">{t.id}</td>
                              <td className="p-4 text-gray-500">{formatDate(t.createdAt)}</td>
                              <td className="p-4 font-semibold text-white">{terminal?.name || 'Inconnu'}</td>
                              <td className="p-4 text-gray-500">{employee?.name || 'Inconnu'}</td>
                              <td className="p-4 flex items-center gap-2 text-pink-400">
                                <Banknote className="h-4 w-4" />
                                {t.type}
                              </td>
                              <td className="p-4 font-semibold text-cyan-400">{parseFloat(t.amount || '0').toLocaleString()} Ar</td>
                              <td className="p-4 flex items-center gap-2 text-gray-500">
                                <IconComponent className="h-4 w-4" />
                                {pm.name}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4 bg-gray-900 border-t border-gray-800">
                    <div className="text-sm text-gray-500">
                      Affichage de {filteredTransactions.length} sur {transactions.length} transactions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" disabled className="border-gray-800 text-gray-400 hover:bg-gray-900">
                        Précédent
                      </Button>
                      <Button variant="outline" disabled className="border-gray-800 text-gray-400 hover:bg-gray-900">
                        Suivant
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <POSManagementModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingDevice(null);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
          editingDevice={editingDevice}
          editingEmployee={editingEmployee}
          locations={locations}
          devices={deviceList as ModalPOSDevice[]}
          modalType={modalType}
        />
      </div>
    </POSLayout>
  );
};

export default POSManagementPage;