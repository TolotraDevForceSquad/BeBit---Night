import { useState } from "react";
import { 
  Wallet, CreditCard, PlusCircle, ArrowUpRight, 
  ArrowDownLeft, Calendar, Copy, ChevronsUpDown,
  CheckCircle2, AlertCircle, Clock, Ticket, CalendarDays,
  DollarSign, Trash2, Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "../../hooks/use-toast";

// Types pour les transactions
interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  date: string;
  category?: string;
  relatedTo?: {
    type: "event" | "ticket" | "reservation" | "refund";
    id: number;
    name: string;
  };
}

// Types pour les cartes de paiement
interface PaymentCard {
  id: string;
  last4: string;
  expiry: string;
  name: string;
  type: "visa" | "mastercard" | "amex" | "other";
  isDefault: boolean;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  
  // État du portefeuille utilisateur
  const [walletData, setWalletData] = useState({
    balance: 15000, // 15,000 Ar
    pendingAmount: 2500, // 2,500 Ar
    currency: "Ar", // Ariary
    bonusPoints: 750,
  });
  
  // Liste des transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      amount: 5000,
      description: "Achat de ticket - Festival Hip Hop",
      type: "debit",
      status: "completed",
      date: "2023-08-15T14:30:00Z",
      category: "ticket",
      relatedTo: {
        type: "ticket",
        id: 123,
        name: "Festival Hip Hop"
      }
    },
    {
      id: "t2",
      amount: 10000,
      description: "Rechargement du compte",
      type: "credit",
      status: "completed",
      date: "2023-08-10T09:15:00Z",
      category: "deposit"
    },
    {
      id: "t3",
      amount: 3500,
      description: "Réservation de table - Club Oxygen",
      type: "debit",
      status: "completed",
      date: "2023-08-05T20:45:00Z",
      category: "reservation",
      relatedTo: {
        type: "reservation",
        id: 456,
        name: "Club Oxygen"
      }
    },
    {
      id: "t4",
      amount: 2500,
      description: "Remboursement d'événement annulé",
      type: "credit",
      status: "pending",
      date: "2023-08-02T11:20:00Z",
      category: "refund",
      relatedTo: {
        type: "event",
        id: 789,
        name: "Soirée électro"
      }
    },
    {
      id: "t5",
      amount: 7500,
      description: "Achat de ticket premium - Concert Jazz",
      type: "debit",
      status: "completed",
      date: "2023-07-28T18:00:00Z",
      category: "ticket",
      relatedTo: {
        type: "ticket",
        id: 234,
        name: "Concert Jazz"
      }
    },
    {
      id: "t6",
      amount: 15000,
      description: "Rechargement du compte",
      type: "credit",
      status: "completed",
      date: "2023-07-20T10:30:00Z",
      category: "deposit"
    },
    {
      id: "t7",
      amount: 1200,
      description: "Paiement échoué - Soirée Techno",
      type: "debit",
      status: "failed",
      date: "2023-07-15T21:10:00Z",
      category: "ticket"
    }
  ]);
  
  // Liste des cartes de paiement
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([
    {
      id: "card1",
      last4: "4242",
      expiry: "05/25",
      name: "John Doe",
      type: "visa",
      isDefault: true
    },
    {
      id: "card2",
      last4: "5678",
      expiry: "08/24",
      name: "John Doe",
      type: "mastercard",
      isDefault: false
    }
  ]);
  
  // Filtrer et trier les transactions
  const filteredTransactions = transactions
    .filter(tx => filterStatus.length === 0 || filterStatus.includes(tx.status))
    .filter(tx => !filterCategory || filterCategory === "all" || tx.category === filterCategory)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  
  // Gérer l'ajout d'une nouvelle carte
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une application réelle, on enverrait ceci au backend
    toast({
      title: "Carte ajoutée",
      description: "Votre nouvelle carte a été ajoutée avec succès.",
      variant: "default",
    });
    setShowAddCardDialog(false);
  };
  
  // Gérer l'ajout de fonds
  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler l'ajout de fonds
    const amount = parseFloat((document.getElementById("amount") as HTMLInputElement).value);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide.",
        variant: "destructive",
      });
      return;
    }
    
    // Ajouter une transaction de dépôt
    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      amount,
      description: "Rechargement du compte",
      type: "credit",
      status: "completed",
      date: new Date().toISOString(),
      category: "deposit"
    };
    
    setTransactions([newTransaction, ...transactions]);
    setWalletData({
      ...walletData,
      balance: walletData.balance + amount
    });
    
    toast({
      title: "Compte rechargé",
      description: `${amount.toLocaleString()} ${walletData.currency} ont été ajoutés à votre portefeuille.`,
      variant: "default",
    });
    
    setShowAddFundsDialog(false);
  };
  
  // Fonction pour définir une carte comme par défaut
  const setDefaultCard = (cardId: string) => {
    setPaymentCards(
      paymentCards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    
    toast({
      title: "Carte par défaut mise à jour",
      description: "Votre carte par défaut a été mise à jour.",
      variant: "default",
    });
  };
  
  // Fonction pour supprimer une carte
  const deleteCard = (cardId: string) => {
    // Vérifier si c'est la carte par défaut
    const isDefault = paymentCards.find(card => card.id === cardId)?.isDefault;
    
    if (isDefault && paymentCards.length > 1) {
      toast({
        title: "Action impossible",
        description: "Vous ne pouvez pas supprimer votre carte par défaut. Définissez une autre carte comme par défaut d'abord.",
        variant: "destructive",
      });
      return;
    }
    
    setPaymentCards(paymentCards.filter(card => card.id !== cardId));
    
    toast({
      title: "Carte supprimée",
      description: "Votre carte a été supprimée avec succès.",
      variant: "default",
    });
  };
  
  // Fonction pour copier les détails d'une transaction
  const copyTransactionId = (txId: string) => {
    navigator.clipboard.writeText(txId);
    toast({
      title: "ID copié",
      description: "L'identifiant de la transaction a été copié dans le presse-papiers.",
      variant: "default",
    });
  };
  
  // Fonction pour obtenir l'icône de statut d'une transaction
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (category?: string) => {
    switch (category) {
      case "ticket":
        return "Achat de ticket";
      case "deposit":
        return "Dépôt";
      case "withdrawal":
        return "Retrait";
      case "refund":
        return "Remboursement";
      case "reservation":
        return "Réservation";
      default:
        return "Autre";
    }
  };
  
  // Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "ticket":
        return <Ticket className="h-4 w-4" />;
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4" />;
      case "refund":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "reservation":
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };
  
  // Fonction pour obtenir l'icône de type de carte
  const getCardIcon = (type: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Wallet className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Portefeuille</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter des fonds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter des fonds</DialogTitle>
                <DialogDescription>
                  Choisissez le montant et la méthode de paiement pour recharger votre compte.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (en {walletData.currency})</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1000"
                    step="500"
                    placeholder="ex: 10000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Montant minimum: 1000 {walletData.currency}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Méthode de paiement</Label>
                  <Select defaultValue="card1">
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Choisir une méthode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card1">Visa se terminant par 4242</SelectItem>
                      <SelectItem value="card2">Mastercard se terminant par 5678</SelectItem>
                      <SelectItem value="mobile">Paiement mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddFundsDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Recharger</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Ajouter une carte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle carte</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle carte de paiement à votre compte.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Numéro de carte</Label>
                  <Input
                    id="card-number"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nom sur la carte</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="default-card"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="default-card">Définir comme carte par défaut</Label>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter la carte</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Méthodes de paiement</TabsTrigger>
          <TabsTrigger value="tickets">Mes tickets</TabsTrigger>
        </TabsList>
        
        {/* Aperçu du portefeuille */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Solde disponible
                </CardTitle>
                <CardDescription>
                  Montant disponible pour les paiements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {walletData.balance.toLocaleString()} {walletData.currency}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  En attente
                </CardTitle>
                <CardDescription>
                  Montant en attente de traitement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {walletData.pendingAmount.toLocaleString()} {walletData.currency}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Points bonus
                </CardTitle>
                <CardDescription>
                  Points accumulés sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {walletData.bonusPoints.toLocaleString()} pts
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
                <CardDescription>
                  Les 5 dernières transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${
                          transaction.type === "credit" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-red-100 text-red-600"
                        }`}>
                          {transaction.type === "credit" 
                            ? <ArrowDownLeft className="h-4 w-4" /> 
                            : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "d MMM", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                        <p className="text-sm font-medium">
                          {transaction.type === "credit" ? "+" : "-"}
                          {transaction.amount.toLocaleString()} {walletData.currency}
                        </p>
                        <div className="flex items-center justify-end gap-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs capitalize text-muted-foreground">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTab("transactions")}
                >
                  Voir toutes les transactions
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>
                  Vos cartes et moyens de paiement enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentCards.map(card => (
                    <div
                      key={card.id}
                      className="p-4 rounded-md border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getCardIcon(card.type)}
                        <div>
                          <p className="font-medium">
                            {card.type.charAt(0).toUpperCase() + card.type.slice(1)} ••••{card.last4}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expire le {card.expiry}
                          </p>
                        </div>
                      </div>
                      {card.isDefault && (
                        <Badge variant="outline" className="bg-primary/10">
                          Par défaut
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowAddCardDialog(true)}
                >
                  Ajouter une carte
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Liste des transactions */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Historique des transactions</CardTitle>
                  <CardDescription>
                    Toutes vos transactions sur la plateforme
                  </CardDescription>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <span>Filtrer par statut</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Statut de la transaction</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={filterStatus.includes("completed")}
                        onCheckedChange={() => {
                          if (filterStatus.includes("completed")) {
                            setFilterStatus(filterStatus.filter(s => s !== "completed"));
                          } else {
                            setFilterStatus([...filterStatus, "completed"]);
                          }
                        }}
                      >
                        Complété
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterStatus.includes("pending")}
                        onCheckedChange={() => {
                          if (filterStatus.includes("pending")) {
                            setFilterStatus(filterStatus.filter(s => s !== "pending"));
                          } else {
                            setFilterStatus([...filterStatus, "pending"]);
                          }
                        }}
                      >
                        En attente
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterStatus.includes("failed")}
                        onCheckedChange={() => {
                          if (filterStatus.includes("failed")) {
                            setFilterStatus(filterStatus.filter(s => s !== "failed"));
                          } else {
                            setFilterStatus([...filterStatus, "failed"]);
                          }
                        }}
                      >
                        Échoué
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="ticket">Achat de ticket</SelectItem>
                      <SelectItem value="deposit">Dépôt</SelectItem>
                      <SelectItem value="withdrawal">Retrait</SelectItem>
                      <SelectItem value="refund">Remboursement</SelectItem>
                      <SelectItem value="reservation">Réservation</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  >
                    {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">Aucune transaction trouvée</h3>
                  <p className="text-muted-foreground mt-1">
                    Aucune transaction ne correspond à vos critères de recherche.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead aria-label="Actions" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {transaction.id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-2">
                                {getCategoryIcon(transaction.category)}
                              </span>
                              {getCategoryName(transaction.category)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(transaction.date), "d MMMM yyyy, HH:mm", { locale: fr })}
                          </TableCell>
                          <TableCell className={
                            transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }>
                            <span className="font-medium">
                              {transaction.type === "credit" ? "+" : "-"}
                              {transaction.amount.toLocaleString()} {walletData.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-2">
                                {getStatusIcon(transaction.status)}
                              </span>
                              <span className="capitalize">{transaction.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyTransactionId(transaction.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Méthodes de paiement */}
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Vos méthodes de paiement</CardTitle>
                  <CardDescription>
                    Gérez vos cartes et autres moyens de paiement
                  </CardDescription>
                </div>
                
                <Button onClick={() => setShowAddCardDialog(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ajouter une carte
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paymentCards.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">Aucune méthode de paiement</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Vous n'avez pas encore ajouté de méthode de paiement à votre compte.
                  </p>
                  <Button onClick={() => setShowAddCardDialog(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ajouter une carte
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentCards.map(card => (
                    <div
                      key={card.id}
                      className="p-4 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {getCardIcon(card.type)}
                        <div>
                          <p className="font-medium">
                            {card.type.charAt(0).toUpperCase() + card.type.slice(1)} ••••{card.last4}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expire le {card.expiry} • {card.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {card.isDefault && (
                          <Badge>Par défaut</Badge>
                        )}
                        
                        <div className="flex items-center">
                          {!card.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => setDefaultCard(card.id)}
                            >
                              Définir par défaut
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exigences de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>Toutes vos informations de paiement sont cryptées et sécurisées.</li>
                <li>Nous ne stockons jamais l'intégralité de vos numéros de carte.</li>
                <li>L'authentification à deux facteurs est obligatoire pour les transactions importantes.</li>
                <li>Vous serez toujours notifié par e-mail lors d'une activité inhabituelle.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mes tickets */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mes tickets</CardTitle>
              <CardDescription>
                Accédez à tous vos tickets pour les événements à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter(tx => tx.category === "ticket" && tx.status === "completed")
                  .map(transaction => (
                    <div
                      key={transaction.id}
                      className="p-4 rounded-md border flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{transaction.relatedTo?.name || "Événement"}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Acheté le {format(new Date(transaction.date), "d MMMM yyyy", { locale: fr })}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(transaction.date), "EEEE d MMMM", { locale: fr })}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                            #{transaction.id}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0">
                        <div className="font-semibold">
                          {transaction.amount.toLocaleString()} {walletData.currency}
                        </div>
                        <Button size="sm" className="gap-2">
                          <Ticket className="h-4 w-4" />
                          <span>Voir le ticket</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                {transactions.filter(tx => tx.category === "ticket" && tx.status === "completed").length === 0 && (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">Aucun ticket trouvé</h3>
                    <p className="text-muted-foreground mt-1">
                      Vous n'avez pas encore acheté de tickets pour des événements.
                    </p>
                    <Button className="mt-4" variant="outline">
                      Explorer les événements
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Historique des tickets</Button>
              <Button variant="ghost">Voir tous les événements</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}