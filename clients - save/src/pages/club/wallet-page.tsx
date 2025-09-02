import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Filter, 
  FileText,
  ChevronRight, 
  Calendar, 
  PieChart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  BanknoteIcon,
  CreditCardIcon,
  ReceiptIcon,
  CheckCircle2Icon,
  RefreshCcwIcon
} from "lucide-react";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";

// Données simulées
const transactions = [
  { 
    id: "txn_132456789", 
    date: "2023-05-09T20:45:00", 
    description: "Entrées événement DJ Elektra", 
    amount: 12500, 
    type: "credit", 
    status: "completed" 
  },
  { 
    id: "txn_987654321", 
    date: "2023-05-08T14:30:00", 
    description: "Commissions et taxes", 
    amount: -1875, 
    type: "fee", 
    status: "completed" 
  },
  { 
    id: "txn_564738291", 
    date: "2023-05-05T22:15:00", 
    description: "Réservation VIP table 12", 
    amount: 3500, 
    type: "credit", 
    status: "completed" 
  },
  { 
    id: "txn_928374651", 
    date: "2023-05-02T10:20:00", 
    description: "Retrait vers compte bancaire", 
    amount: -10000, 
    type: "withdrawal", 
    status: "completed" 
  },
  { 
    id: "txn_543216789", 
    date: "2023-04-30T21:10:00", 
    description: "Entrées soirée thématique", 
    amount: 8750, 
    type: "credit", 
    status: "completed" 
  },
  { 
    id: "txn_678912345", 
    date: "2023-04-28T18:45:00", 
    description: "Paiement DJ invité", 
    amount: -2500, 
    type: "debit", 
    status: "completed" 
  },
  { 
    id: "txn_123789456", 
    date: "2023-04-25T09:30:00", 
    description: "Retrait vers compte bancaire", 
    amount: -7500, 
    type: "withdrawal", 
    status: "processing" 
  },
  { 
    id: "txn_456123789", 
    date: "2023-04-23T22:15:00", 
    description: "Entrées événement spécial", 
    amount: 9200, 
    type: "credit", 
    status: "completed" 
  },
  { 
    id: "txn_789456123", 
    date: "2023-04-20T16:40:00", 
    description: "Réservation VIP table 8", 
    amount: 3000, 
    type: "credit", 
    status: "completed" 
  },
  { 
    id: "txn_321654987", 
    date: "2023-04-18T11:05:00", 
    description: "Commissions et taxes", 
    amount: -1380, 
    type: "fee", 
    status: "completed" 
  },
];

// Données simulées des revenus mensuels
const monthlyRevenue = [
  { month: "Jan", revenue: 85000 },
  { month: "Fév", revenue: 92000 },
  { month: "Mar", revenue: 88000 },
  { month: "Avr", revenue: 99000 },
  { month: "Mai", revenue: 105000 },
  { month: "Juin", revenue: 96000 },
  { month: "Juil", revenue: 116000 },
  { month: "Août", revenue: 135000 },
  { month: "Sep", revenue: 118000 },
  { month: "Oct", revenue: 110000 },
  { month: "Nov", revenue: 107000 },
  { month: "Déc", revenue: 125000 },
];

// Données simulées des méthodes de paiement
const paymentMethods = [
  { id: "pm_123", name: "VISA •••• 4242", default: true, type: "card", expiryDate: "05/25" },
  { id: "pm_456", name: "BNI Mobile Banking", default: false, type: "bank", accountNumber: "•••• 7890" },
];

// Données simulées des factures
const invoices = [
  { 
    id: "INV-001", 
    date: "2023-05-01", 
    description: "Facture transactions Avril 2023", 
    amount: 12675, 
    status: "paid" 
  },
  { 
    id: "INV-002", 
    date: "2023-04-01", 
    description: "Facture transactions Mars 2023", 
    amount: 10945, 
    status: "paid" 
  },
  { 
    id: "INV-003", 
    date: "2023-03-01", 
    description: "Facture transactions Février 2023", 
    amount: 9820, 
    status: "paid" 
  },
];

// Formatage des montants en Ariary
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0
  }).format(amount);
};

// Formatage des dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const ClubWalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [transactionType, setTransactionType] = useState("all");

  // Calculer les totaux
  const totalBalance = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const pendingBalance = transactions
    .filter(txn => txn.status === "processing")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const availableBalance = totalBalance - pendingBalance;

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(txn => {
    if (transactionType !== "all" && txn.type !== transactionType) {
      return false;
    }
    return true;
  });

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portefeuille</h1>
            <p className="text-lg text-muted-foreground mt-1.5">
              Gérez vos revenus et transactions
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={16} />
              Exporter
            </Button>
            <Button size="sm" className="gap-1.5">
              <DollarSign size={16} />
              Retirer des fonds
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payment">Paiements</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>

          {/* Tab: Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Solde disponible
                  </CardTitle>
                  <CardDescription>
                    Montant disponible pour retrait
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(availableBalance)}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+18.2%</span>
                    <span className="ml-1.5">depuis le mois dernier</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Retirer des fonds
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    En attente
                  </CardTitle>
                  <CardDescription>
                    Fonds en cours de traitement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(pendingBalance < 0 ? -pendingBalance : pendingBalance)}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-amber-500">
                    <RefreshCcwIcon size={16} className="mr-1" />
                    <span>En cours de traitement</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Voir les détails
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Total cumulé
                  </CardTitle>
                  <CardDescription>
                    Revenus totaux depuis l'inscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(1250000)}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CheckCircle2Icon size={16} className="text-green-500 mr-1" />
                    <span>Compte vérifié</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Rapport annuel
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Aperçu des revenus</CardTitle>
                    <CardDescription>Évolution des revenus sur l'année en cours</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">7 derniers jours</SelectItem>
                        <SelectItem value="month">30 derniers jours</SelectItem>
                        <SelectItem value="quarter">Trimestre en cours</SelectItem>
                        <SelectItem value="year">Année en cours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  {/* Chart simulation */}
                  <div className="flex h-[250px] items-end space-x-2">
                    {monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-14 bg-primary/90 hover:bg-primary rounded-t transition-all"
                          style={{ 
                            height: `${item.revenue / 1350}px`,
                            opacity: index < 6 ? 0.6 : 1
                          }}
                        ></div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {item.month}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-sm text-muted-foreground">Revenu mensuel moyen: {formatCurrency(106333)}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <PieChart size={16} />
                  Rapport détaillé
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions récentes</CardTitle>
                  <CardDescription>
                    Les 5 dernières transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                            transaction.type === 'debit' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            transaction.type === 'fee' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {transaction.type === 'credit' ? <ArrowUpRight size={16} /> : 
                            transaction.type === 'debit' ? <ArrowDownRight size={16} /> :
                            transaction.type === 'fee' ? <ReceiptIcon size={16} /> :
                            <BanknoteIcon size={16} />}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                          </div>
                        </div>
                        <div className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Voir toutes les transactions
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse des revenus</CardTitle>
                  <CardDescription>
                    Répartition des sources de revenus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-16">
                      <div className="w-32 h-32 relative">
                        {/* Donut chart simulation */}
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle r="35" cx="50" cy="50" fill="transparent" stroke="#e2e8f0" strokeWidth="15"></circle>
                          
                          <circle 
                            r="35" 
                            cx="50" 
                            cy="50" 
                            fill="transparent" 
                            stroke="#3b82f6" 
                            strokeWidth="15" 
                            strokeDasharray="219.8" 
                            strokeDashoffset="0"
                          ></circle>
                          
                          <circle 
                            r="35" 
                            cx="50" 
                            cy="50" 
                            fill="transparent" 
                            stroke="#10b981" 
                            strokeWidth="15" 
                            strokeDasharray="219.8" 
                            strokeDashoffset="131.9"
                          ></circle>
                          
                          <circle 
                            r="35" 
                            cx="50" 
                            cy="50" 
                            fill="transparent" 
                            stroke="#f59e0b" 
                            strokeWidth="15" 
                            strokeDasharray="219.8" 
                            strokeDashoffset="175.8"
                          ></circle>

                          <circle 
                            r="35" 
                            cx="50" 
                            cy="50" 
                            fill="transparent" 
                            stroke="#ec4899" 
                            strokeWidth="15" 
                            strokeDasharray="219.8" 
                            strokeDashoffset="197.8"
                          ></circle>
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div className="text-sm">Entrées événements (60%)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="text-sm">Réservations de tables (20%)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div className="text-sm">Ventes au bar (10%)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          <div className="text-sm">Autres (10%)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Meilleures sources de revenus</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>Événement DJ Elektra (Avril)</span>
                          <span className="font-medium">{formatCurrency(15000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Tables VIP Week-end (Mars)</span>
                          <span className="font-medium">{formatCurrency(12500)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Soirée spéciale (Février)</span>
                          <span className="font-medium">{formatCurrency(10800)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 pb-2">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Rapport analytique complet
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Transactions */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Historique des transactions</CardTitle>
                    <CardDescription>Voir toutes vos transactions</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={transactionType} onValueChange={setTransactionType}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Type de transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="credit">Crédits</SelectItem>
                        <SelectItem value="debit">Débits</SelectItem>
                        <SelectItem value="withdrawal">Retraits</SelectItem>
                        <SelectItem value="fee">Frais</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Input 
                        placeholder="Rechercher..." 
                        className="pl-9"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium p-2 pl-4">Description</th>
                        <th className="text-left font-medium p-2">Date</th>
                        <th className="text-left font-medium p-2">Montant</th>
                        <th className="text-left font-medium p-2">Type</th>
                        <th className="text-right font-medium p-2 pr-4">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-2 pl-4">{transaction.description}</td>
                          <td className="p-2">{formatDate(transaction.date)}</td>
                          <td className={`p-2 ${
                            transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </td>
                          <td className="p-2">
                            <Badge variant={
                              transaction.type === 'credit' ? 'default' : 
                              transaction.type === 'debit' ? 'destructive' :
                              transaction.type === 'fee' ? 'secondary' : 'outline'
                            }>
                              {transaction.type === 'credit' ? 'Crédit' : 
                              transaction.type === 'debit' ? 'Débit' :
                              transaction.type === 'fee' ? 'Frais' : 'Retrait'}
                            </Badge>
                          </td>
                          <td className="p-2 pr-4 text-right">
                            <Badge variant={transaction.status === 'completed' ? 'outline' : 'secondary'} className={
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900' : 
                              'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900'
                            }>
                              {transaction.status === 'completed' ? 'Terminé' : 'En traitement'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground mb-3 sm:mb-0">
                  Affichage de {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Précédent</Button>
                  <Button variant="outline" size="sm" className="bg-primary/10">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab: Paiements */}
          <TabsContent value="payment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>
                    Gérez vos comptes de retrait
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className="p-4 border rounded-lg flex items-center justify-between hover:border-primary cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          method.type === 'card' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 
                          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {method.type === 'card' ? <CreditCardIcon size={20} /> : <BanknoteIcon size={20} />}
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {method.name}
                            {method.default && (
                              <Badge variant="outline" className="ml-2 text-xs">Par défaut</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {method.type === 'card' ? 'Expire ' + method.expiryDate : 'Compte ' + method.accountNumber}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 border border-dashed rounded-lg flex items-center justify-center hover:border-primary cursor-pointer transition-colors">
                    <div className="text-center">
                      <div className="p-2 rounded-full bg-primary/10 mx-auto mb-2 w-fit">
                        <CreditCard size={20} className="text-primary" />
                      </div>
                      <div className="font-medium">Ajouter une méthode de paiement</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Carte bancaire, compte mobile, ou compte bancaire
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Options de retrait</CardTitle>
                  <CardDescription>
                    Retirez vos fonds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Initier un retrait</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-1">
                          Méthode de paiement
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un compte" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pm_123">VISA •••• 4242</SelectItem>
                            <SelectItem value="pm_456">BNI Mobile Banking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1">
                          Montant à retirer
                        </label>
                        <div className="relative">
                          <Input placeholder="0" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            Ar
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Minimum: 5 000 Ar
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button className="w-full">Retirer des fonds</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">À propos des retraits</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Les retraits sont traités sous 1-2 jours ouvrables</li>
                      <li>• Des frais de 1.5% s'appliquent (min: 1 000 Ar)</li>
                      <li>• Plafond de retrait: 500 000 Ar par jour</li>
                      <li>• Les retraits en attente seront affichés dans votre historique</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Factures */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Factures</CardTitle>
                    <CardDescription>
                      Accédez à toutes vos factures et reçus
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Filter size={16} />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Calendar size={16} />
                      Date
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium p-2 pl-4">Référence</th>
                        <th className="text-left font-medium p-2">Date</th>
                        <th className="text-left font-medium p-2">Description</th>
                        <th className="text-left font-medium p-2">Montant</th>
                        <th className="text-right font-medium p-2">Statut</th>
                        <th className="text-right font-medium p-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-2 pl-4 font-medium">{invoice.id}</td>
                          <td className="p-2">{invoice.date}</td>
                          <td className="p-2">{invoice.description}</td>
                          <td className="p-2">{formatCurrency(invoice.amount)}</td>
                          <td className="p-2 text-right">
                            <Badge variant={invoice.status === 'paid' ? 'outline' : 'secondary'} className={
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900' : 
                              'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900'
                            }>
                              {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                            </Badge>
                          </td>
                          <td className="p-2 pr-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center border-t pt-4">
                <div className="text-sm text-muted-foreground text-center">
                  Tous vos reçus et factures des 12 derniers mois sont disponibles. 
                  <a href="#" className="text-primary ml-1">Besoin d'une facture spécifique?</a>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default ClubWalletPage;