import React, { useState, useEffect } from 'react';
import POSLayout from '../../layouts/POSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { 
  Search,
  Calendar,
  ArrowDownUp,
  Filter,
  Download,
  ClipboardList,
  Activity,
  RefreshCw,
  Clock,
  User,
  Banknote
} from 'lucide-react';
import { format, subHours, subDays, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
interface POSHistoryEntry {
  id: number;
  type: 'sale' | 'refund' | 'order' | 'status_change' | 'login' | 'logout' | 'table_reservation' | 'inventory';
  description: string;
  userId: number;
  userName: string;
  userRole: string;
  timestamp: Date;
  amount?: number;
  orderId?: number;
  tableId?: number;
  tableName?: string;
  details?: string;
  status?: string;
}

// Données d'exemple pour l'historique des actions
const sampleHistory: POSHistoryEntry[] = [
  {
    id: 1,
    type: 'login',
    description: 'Connexion au terminal',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    details: 'Terminal principal'
  },
  {
    id: 2,
    type: 'order',
    description: 'Nouvelle commande créée',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    orderId: 101,
    tableId: 2,
    tableName: 'Table 2',
    amount: 60000,
    details: '2 Coca-Cola, 2 Burger'
  },
  {
    id: 3,
    type: 'order',
    description: 'Nouvelle commande créée',
    userId: 2,
    userName: 'Marie Lambert',
    userRole: 'Serveur',
    timestamp: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    orderId: 102,
    tableId: 6,
    tableName: 'Table 6',
    amount: 70000,
    details: '4 Mojito, 2 Chips'
  },
  {
    id: 4,
    type: 'status_change',
    description: 'Statut de commande modifié',
    userId: 3,
    userName: 'Pierre Martin',
    userRole: 'Cuisinier',
    timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    orderId: 101,
    status: 'preparing',
    details: 'Burger en préparation'
  },
  {
    id: 5,
    type: 'table_reservation',
    description: 'Réservation de table confirmée',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: new Date(Date.now() - 8 * 60000), // 8 minutes ago
    tableId: 4,
    tableName: 'Table 4',
    details: 'Réservation pour Marie Durand à 20:00, 5 personnes'
  },
  {
    id: 6,
    type: 'status_change',
    description: 'Statut de commande modifié',
    userId: 3,
    userName: 'Pierre Martin',
    userRole: 'Cuisinier',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    orderId: 101,
    status: 'ready',
    details: 'Burger prêt à servir'
  },
  {
    id: 7,
    type: 'sale',
    description: 'Paiement reçu',
    userId: 2,
    userName: 'Marie Lambert',
    userRole: 'Serveur',
    timestamp: new Date(Date.now() - 3 * 60000), // 3 minutes ago
    orderId: 101,
    tableId: 2,
    tableName: 'Table 2',
    amount: 60000,
    details: 'Paiement en espèces'
  },
  {
    id: 8,
    type: 'order',
    description: 'Nouvelle commande créée',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    orderId: 103,
    tableId: 9,
    tableName: 'VIP Lounge 2',
    amount: 226000,
    details: '8 Piña Colada, 4 Cacahuètes, 3 Pizza Margherita'
  },
  {
    id: 9,
    type: 'inventory',
    description: 'Mise à jour de stock',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: new Date(Date.now() - 1 * 60000), // 1 minute ago
    details: 'Ajout de 24 bouteilles de vodka au stock'
  },
  // Historique des jours précédents
  {
    id: 10,
    type: 'sale',
    description: 'Paiement reçu',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: subDays(new Date(), 1), // Hier
    orderId: 95,
    tableId: 3,
    tableName: 'Table 3',
    amount: 45000,
    details: 'Paiement par carte'
  },
  {
    id: 11,
    type: 'refund',
    description: 'Remboursement effectué',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: subDays(new Date(), 1), // Hier
    amount: 12000,
    details: 'Boisson renversée, remboursement partiel'
  },
  {
    id: 12,
    type: 'logout',
    description: 'Déconnexion du terminal',
    userId: 2,
    userName: 'Marie Lambert',
    userRole: 'Serveur',
    timestamp: subDays(new Date(), 1), // Hier
    details: 'Fin de service'
  },
  {
    id: 13,
    type: 'login',
    description: 'Connexion au terminal',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: subDays(new Date(), 2), // Avant-hier
    details: 'Terminal principal'
  },
  {
    id: 14,
    type: 'sale',
    description: 'Paiement reçu',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: subDays(new Date(), 2), // Avant-hier
    orderId: 94,
    tableId: 7,
    tableName: 'Table 7',
    amount: 120000,
    details: 'Paiement par carte'
  },
  {
    id: 15,
    type: 'logout',
    description: 'Déconnexion du terminal',
    userId: 1,
    userName: 'Jean Dupont',
    userRole: 'Manager',
    timestamp: subDays(new Date(), 2), // Avant-hier
    details: 'Fin de service'
  }
];

const POSHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [history, setHistory] = useState<POSHistoryEntry[]>(sampleHistory);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fonction pour formater la date
  const formatHistoryDate = (date: Date) => {
    if (isToday(date)) {
      return `Aujourd'hui à ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Hier à ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd MMM yyyy HH:mm', { locale: fr });
    }
  };
  
  // Fonction pour obtenir la couleur du badge selon le type d'action
  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-900/30 text-green-400 border border-green-800/50';
      case 'refund':
        return 'bg-red-900/30 text-red-400 border border-red-800/50';
      case 'order':
        return 'bg-blue-900/30 text-blue-400 border border-blue-800/50';
      case 'status_change':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50';
      case 'login':
      case 'logout':
        return 'bg-purple-900/30 text-purple-400 border border-purple-800/50';
      case 'table_reservation':
        return 'bg-orange-900/30 text-orange-400 border border-orange-800/50';
      case 'inventory':
        return 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50';
      default:
        return 'bg-gray-900/30 text-gray-400 border border-gray-800/50';
    }
  };
  
  // Fonction pour obtenir l'icône selon le type d'action
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <Banknote className="h-4 w-4 mr-1" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 mr-1" />;
      case 'order':
        return <Activity className="h-4 w-4 mr-1" />;
      case 'status_change':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'login':
      case 'logout':
        return <User className="h-4 w-4 mr-1" />;
      case 'table_reservation':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'inventory':
        return <ArrowDownUp className="h-4 w-4 mr-1" />;
      default:
        return <ClipboardList className="h-4 w-4 mr-1" />;
    }
  };
  
  // Filtrer l'historique
  const getFilteredHistory = () => {
    return history.filter(entry => {
      // Filtre de recherche
      const matchesSearch = 
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.tableName && entry.tableName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.details && entry.details.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre de date
      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = isToday(entry.timestamp);
      } else if (dateFilter === 'yesterday') {
        matchesDate = isYesterday(entry.timestamp);
      } else if (dateFilter === 'last7days') {
        const sevenDaysAgo = subDays(new Date(), 7);
        matchesDate = entry.timestamp >= sevenDaysAgo;
      } else if (dateFilter === 'last24hours') {
        const twentyFourHoursAgo = subHours(new Date(), 24);
        matchesDate = entry.timestamp >= twentyFourHoursAgo;
      }
      
      // Filtre de type
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;
      
      // Filtre d'utilisateur
      const matchesUser = userFilter === 'all' || entry.userId.toString() === userFilter;
      
      // Filtre d'onglet
      let matchesTab = true;
      if (activeTab === 'financials') {
        matchesTab = entry.type === 'sale' || entry.type === 'refund';
      } else if (activeTab === 'orders') {
        matchesTab = entry.type === 'order' || entry.type === 'status_change';
      } else if (activeTab === 'tables') {
        matchesTab = entry.type === 'table_reservation';
      } else if (activeTab === 'users') {
        matchesTab = entry.type === 'login' || entry.type === 'logout';
      }
      
      return matchesSearch && matchesDate && matchesType && matchesUser && matchesTab;
    });
  };
  
  // Extraire les utilisateurs uniques pour le filtre
  const uniqueUsers = Array.from(new Set(history.map(entry => entry.userId)))
    .map(userId => {
      const user = history.find(entry => entry.userId === userId);
      return {
        id: userId,
        name: user?.userName,
        role: user?.userRole
      };
    });
  
  // Générer le CSV pour l'exportation
  const generateCSV = () => {
    const filteredData = getFilteredHistory();
    const headers = "ID,Type,Description,Utilisateur,Rôle,Date et heure,Montant,Commande,Table,Détails,Statut\n";
    
    const csvRows = filteredData.map(entry => {
      const row = [
        entry.id,
        entry.type,
        `"${entry.description}"`,
        `"${entry.userName}"`,
        `"${entry.userRole}"`,
        format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        entry.amount || '',
        entry.orderId || '',
        entry.tableName ? `"${entry.tableName}"` : '',
        entry.details ? `"${entry.details}"` : '',
        entry.status || ''
      ];
      
      return row.join(',');
    }).join('\n');
    
    return headers + csvRows;
  };
  
  // Télécharger l'historique filtré au format CSV
  const handleExport = () => {
    const csvData = generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_pos_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <POSLayout>
      <div className="p-6 space-y-6 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-pink-400" />
              Historique des actions
            </h1>
            <p className="text-gray-300 mt-1">Consultez l'historique détaillé de toutes les actions effectuées sur ce terminal</p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-all"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 bg-black border-gray-800 text-white placeholder-gray-400 rounded-lg focus:border-pink-500 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="date" className="text-gray-300">Date</Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par date" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="yesterday">Hier</SelectItem>
                <SelectItem value="last7days">7 derniers jours</SelectItem>
                <SelectItem value="last24hours">24 dernières heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="type" className="text-gray-300">Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="sale">Ventes</SelectItem>
                <SelectItem value="refund">Remboursements</SelectItem>
                <SelectItem value="order">Commandes</SelectItem>
                <SelectItem value="status_change">Changements de statut</SelectItem>
                <SelectItem value="login">Connexions</SelectItem>
                <SelectItem value="logout">Déconnexions</SelectItem>
                <SelectItem value="table_reservation">Réservations de table</SelectItem>
                <SelectItem value="inventory">Inventaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="user" className="text-gray-300">Utilisateur</Label>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="bg-black border-gray-800 text-white rounded-lg">
                <SelectValue placeholder="Filtrer par utilisateur" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800 text-white">
                <SelectItem value="all">Tous les utilisateurs</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Onglets */}
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mb-6 bg-black text-gray-300 rounded-xl p-1 border border-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <ClipboardList className="h-4 w-4 mr-2" />
              Tout
            </TabsTrigger>
            <TabsTrigger value="financials" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <Banknote className="h-4 w-4 mr-2" />
              Finances
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <Activity className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="tables" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-lg">
              <User className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="all" className="w-full">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ClipboardList className="h-6 w-6 text-pink-400" />
                      Historique détaillé
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {getFilteredHistory().length} entrées trouvées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Date et heure</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">Utilisateur</TableHead>
                      <TableHead className="text-gray-300">Détails</TableHead>
                      <TableHead className="text-gray-300 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                          Aucune action trouvée avec les filtres actuels
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredHistory()
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map(entry => (
                          <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300 whitespace-nowrap">
                              {formatHistoryDate(entry.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`flex items-center ${getActionBadgeColor(entry.type)} text-xs`}>
                                {getActionIcon(entry.type)}
                                {entry.type === 'sale' && 'Vente'}
                                {entry.type === 'refund' && 'Remboursement'}
                                {entry.type === 'order' && 'Commande'}
                                {entry.type === 'status_change' && 'Changement de statut'}
                                {entry.type === 'login' && 'Connexion'}
                                {entry.type === 'logout' && 'Déconnexion'}
                                {entry.type === 'table_reservation' && 'Réservation table'}
                                {entry.type === 'inventory' && 'Inventaire'}
                              </Badge>
                              <div className="text-sm text-gray-300 mt-1">
                                {entry.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="font-medium text-white">{entry.userName}</div>
                              <div className="text-xs text-gray-400">{entry.userRole}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {entry.orderId && (
                                <div className="text-sm">Commande #{entry.orderId}</div>
                              )}
                              {entry.tableName && (
                                <div className="text-sm">{entry.tableName}</div>
                              )}
                              {entry.details && (
                                <div className="text-sm text-gray-400">{entry.details}</div>
                              )}
                              {entry.status && (
                                <Badge variant="outline" className="text-xs mt-1 bg-gray-900/30 text-gray-400 border border-gray-800/50">
                                  {entry.status === 'pending' && 'En attente'}
                                  {entry.status === 'preparing' && 'En préparation'}
                                  {entry.status === 'ready' && 'Prêt'}
                                  {entry.status === 'served' && 'Servi'}
                                  {entry.status === 'completed' && 'Terminé'}
                                  {entry.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              {entry.amount ? (
                                <div className="font-medium text-pink-400">
                                  {(entry.amount/100).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'MGA'
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Banknote className="h-6 w-6 text-pink-400" />
                      Historique financier
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {getFilteredHistory().length} entrées trouvées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Date et heure</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">Utilisateur</TableHead>
                      <TableHead className="text-gray-300">Détails</TableHead>
                      <TableHead className="text-gray-300 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                          Aucune action trouvée avec les filtres actuels
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredHistory()
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map(entry => (
                          <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300 whitespace-nowrap">
                              {formatHistoryDate(entry.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`flex items-center ${getActionBadgeColor(entry.type)} text-xs`}>
                                {getActionIcon(entry.type)}
                                {entry.type === 'sale' && 'Vente'}
                                {entry.type === 'refund' && 'Remboursement'}
                                {entry.type === 'order' && 'Commande'}
                                {entry.type === 'status_change' && 'Changement de statut'}
                                {entry.type === 'login' && 'Connexion'}
                                {entry.type === 'logout' && 'Déconnexion'}
                                {entry.type === 'table_reservation' && 'Réservation table'}
                                {entry.type === 'inventory' && 'Inventaire'}
                              </Badge>
                              <div className="text-sm text-gray-300 mt-1">
                                {entry.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="font-medium text-white">{entry.userName}</div>
                              <div className="text-xs text-gray-400">{entry.userRole}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {entry.orderId && (
                                <div className="text-sm">Commande #{entry.orderId}</div>
                              )}
                              {entry.tableName && (
                                <div className="text-sm">{entry.tableName}</div>
                              )}
                              {entry.details && (
                                <div className="text-sm text-gray-400">{entry.details}</div>
                              )}
                              {entry.status && (
                                <Badge variant="outline" className="text-xs mt-1 bg-gray-900/30 text-gray-400 border border-gray-800/50">
                                  {entry.status === 'pending' && 'En attente'}
                                  {entry.status === 'preparing' && 'En préparation'}
                                  {entry.status === 'ready' && 'Prêt'}
                                  {entry.status === 'served' && 'Servi'}
                                  {entry.status === 'completed' && 'Terminé'}
                                  {entry.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              {entry.amount ? (
                                <div className="font-medium text-pink-400">
                                  {(entry.amount/100).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'MGA'
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-6 w-6 text-pink-400" />
                      Historique des commandes
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {getFilteredHistory().length} entrées trouvées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Date et heure</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">Utilisateur</TableHead>
                      <TableHead className="text-gray-300">Détails</TableHead>
                      <TableHead className="text-gray-300 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                          Aucune action trouvée avec les filtres actuels
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredHistory()
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map(entry => (
                          <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300 whitespace-nowrap">
                              {formatHistoryDate(entry.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`flex items-center ${getActionBadgeColor(entry.type)} text-xs`}>
                                {getActionIcon(entry.type)}
                                {entry.type === 'sale' && 'Vente'}
                                {entry.type === 'refund' && 'Remboursement'}
                                {entry.type === 'order' && 'Commande'}
                                {entry.type === 'status_change' && 'Changement de statut'}
                                {entry.type === 'login' && 'Connexion'}
                                {entry.type === 'logout' && 'Déconnexion'}
                                {entry.type === 'table_reservation' && 'Réservation table'}
                                {entry.type === 'inventory' && 'Inventaire'}
                              </Badge>
                              <div className="text-sm text-gray-300 mt-1">
                                {entry.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="font-medium text-white">{entry.userName}</div>
                              <div className="text-xs text-gray-400">{entry.userRole}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {entry.orderId && (
                                <div className="text-sm">Commande #{entry.orderId}</div>
                              )}
                              {entry.tableName && (
                                <div className="text-sm">{entry.tableName}</div>
                              )}
                              {entry.details && (
                                <div className="text-sm text-gray-400">{entry.details}</div>
                              )}
                              {entry.status && (
                                <Badge variant="outline" className="text-xs mt-1 bg-gray-900/30 text-gray-400 border border-gray-800/50">
                                  {entry.status === 'pending' && 'En attente'}
                                  {entry.status === 'preparing' && 'En préparation'}
                                  {entry.status === 'ready' && 'Prêt'}
                                  {entry.status === 'served' && 'Servi'}
                                  {entry.status === 'completed' && 'Terminé'}
                                  {entry.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              {entry.amount ? (
                                <div className="font-medium text-pink-400">
                                  {(entry.amount/100).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'MGA'
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-pink-400" />
                      Historique des tables
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {getFilteredHistory().length} entrées trouvées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Date et heure</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">Utilisateur</TableHead>
                      <TableHead className="text-gray-300">Détails</TableHead>
                      <TableHead className="text-gray-300 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                          Aucune action trouvée avec les filtres actuels
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredHistory()
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map(entry => (
                          <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300 whitespace-nowrap">
                              {formatHistoryDate(entry.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`flex items-center ${getActionBadgeColor(entry.type)} text-xs`}>
                                {getActionIcon(entry.type)}
                                {entry.type === 'sale' && 'Vente'}
                                {entry.type === 'refund' && 'Remboursement'}
                                {entry.type === 'order' && 'Commande'}
                                {entry.type === 'status_change' && 'Changement de statut'}
                                {entry.type === 'login' && 'Connexion'}
                                {entry.type === 'logout' && 'Déconnexion'}
                                {entry.type === 'table_reservation' && 'Réservation table'}
                                {entry.type === 'inventory' && 'Inventaire'}
                              </Badge>
                              <div className="text-sm text-gray-300 mt-1">
                                {entry.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="font-medium text-white">{entry.userName}</div>
                              <div className="text-xs text-gray-400">{entry.userRole}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {entry.orderId && (
                                <div className="text-sm">Commande #{entry.orderId}</div>
                              )}
                              {entry.tableName && (
                                <div className="text-sm">{entry.tableName}</div>
                              )}
                              {entry.details && (
                                <div className="text-sm text-gray-400">{entry.details}</div>
                              )}
                              {entry.status && (
                                <Badge variant="outline" className="text-xs mt-1 bg-gray-900/30 text-gray-400 border border-gray-800/50">
                                  {entry.status === 'pending' && 'En attente'}
                                  {entry.status === 'preparing' && 'En préparation'}
                                  {entry.status === 'ready' && 'Prêt'}
                                  {entry.status === 'served' && 'Servi'}
                                  {entry.status === 'completed' && 'Terminé'}
                                  {entry.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              {entry.amount ? (
                                <div className="font-medium text-pink-400">
                                  {(entry.amount/100).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'MGA'
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-black border-gray-800 rounded-xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-6 w-6 text-pink-400" />
                      Historique des utilisateurs
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {getFilteredHistory().length} entrées trouvées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Date et heure</TableHead>
                      <TableHead className="text-gray-300">Action</TableHead>
                      <TableHead className="text-gray-300">Utilisateur</TableHead>
                      <TableHead className="text-gray-300">Détails</TableHead>
                      <TableHead className="text-gray-300 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-gray-400">
                          Aucune action trouvée avec les filtres actuels
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredHistory()
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map(entry => (
                          <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-900/50">
                            <TableCell className="text-gray-300 whitespace-nowrap">
                              {formatHistoryDate(entry.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`flex items-center ${getActionBadgeColor(entry.type)} text-xs`}>
                                {getActionIcon(entry.type)}
                                {entry.type === 'sale' && 'Vente'}
                                {entry.type === 'refund' && 'Remboursement'}
                                {entry.type === 'order' && 'Commande'}
                                {entry.type === 'status_change' && 'Changement de statut'}
                                {entry.type === 'login' && 'Connexion'}
                                {entry.type === 'logout' && 'Déconnexion'}
                                {entry.type === 'table_reservation' && 'Réservation table'}
                                {entry.type === 'inventory' && 'Inventaire'}
                              </Badge>
                              <div className="text-sm text-gray-300 mt-1">
                                {entry.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div className="font-medium text-white">{entry.userName}</div>
                              <div className="text-xs text-gray-400">{entry.userRole}</div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {entry.orderId && (
                                <div className="text-sm">Commande #{entry.orderId}</div>
                              )}
                              {entry.tableName && (
                                <div className="text-sm">{entry.tableName}</div>
                              )}
                              {entry.details && (
                                <div className="text-sm text-gray-400">{entry.details}</div>
                              )}
                              {entry.status && (
                                <Badge variant="outline" className="text-xs mt-1 bg-gray-900/30 text-gray-400 border border-gray-800/50">
                                  {entry.status === 'pending' && 'En attente'}
                                  {entry.status === 'preparing' && 'En préparation'}
                                  {entry.status === 'ready' && 'Prêt'}
                                  {entry.status === 'served' && 'Servi'}
                                  {entry.status === 'completed' && 'Terminé'}
                                  {entry.status === 'cancelled' && 'Annulé'}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              {entry.amount ? (
                                <div className="font-medium text-pink-400">
                                  {(entry.amount/100).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'MGA'
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </POSLayout>
  );
};

export default POSHistoryPage;