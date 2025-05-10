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
  RefreshCcw,
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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'refund':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'order':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'status_change':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'login':
      case 'logout':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'table_reservation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'inventory':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Fonction pour obtenir l'icône selon le type d'action
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <Banknote className="h-4 w-4 mr-1" />;
      case 'refund':
        return <RefreshCcw className="h-4 w-4 mr-1" />;
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
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Historique des actions</h1>
            <p className="text-muted-foreground">Consultez l'historique détaillé de toutes les actions effectuées sur ce terminal</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="yesterday">Hier</SelectItem>
                <SelectItem value="last7days">7 derniers jours</SelectItem>
                <SelectItem value="last24hours">24 dernières heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
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
          
          <div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par utilisateur" />
              </SelectTrigger>
              <SelectContent>
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
        <Tabs className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="financials">Finances</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Tableau d'historique */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Historique détaillé</CardTitle>
            <CardDescription>
              {getFilteredHistory().length} entrées trouvées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date et heure</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredHistory().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Aucune action trouvée avec les filtres actuels
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredHistory()
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatHistoryDate(entry.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`flex items-center ${getActionBadgeColor(entry.type)}`}>
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
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.userName}</div>
                          <div className="text-xs text-muted-foreground">{entry.userRole}</div>
                        </TableCell>
                        <TableCell>
                          {entry.orderId && (
                            <div className="text-xs">Commande #{entry.orderId}</div>
                          )}
                          {entry.tableName && (
                            <div className="text-xs">{entry.tableName}</div>
                          )}
                          {entry.details && (
                            <div className="text-xs text-muted-foreground">{entry.details}</div>
                          )}
                          {entry.status && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {entry.status === 'pending' && 'En attente'}
                              {entry.status === 'preparing' && 'En préparation'}
                              {entry.status === 'ready' && 'Prêt'}
                              {entry.status === 'served' && 'Servi'}
                              {entry.status === 'completed' && 'Terminé'}
                              {entry.status === 'cancelled' && 'Annulé'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.amount ? (
                            <div className="font-medium">
                              {(entry.amount/100).toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'MGA'
                              })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </POSLayout>
  );
};

export default POSHistoryPage;