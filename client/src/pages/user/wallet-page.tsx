import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, ArrowUp, ArrowDown, Wallet, Plus, CreditCard, Banknote, DollarSign } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les transactions
type Transaction = {
  id: number;
  date: string;
  amount: number;
  type: "deposit" | "withdrawal" | "purchase" | "refund";
  description: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
  eventId?: number;
  eventTitle?: string;
};

// Données fictives pour le solde et les transactions
const mockBalance = 125.50;
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "2023-12-15T14:30:00",
    amount: 15.00,
    type: "purchase",
    description: "Achat ticket - Soirée Techno",
    status: "completed",
    eventId: 101,
    eventTitle: "Soirée Techno"
  },
  {
    id: 2,
    date: "2023-12-10T09:45:00",
    amount: 50.00,
    type: "deposit",
    description: "Dépôt via carte bancaire",
    status: "completed",
    reference: "CB****4242"
  },
  {
    id: 3,
    date: "2023-12-05T18:20:00",
    amount: 25.00,
    type: "withdrawal",
    description: "Retrait vers compte bancaire",
    status: "pending",
    reference: "WD-12345"
  },
  {
    id: 4,
    date: "2023-11-28T21:15:00",
    amount: 12.50,
    type: "refund",
    description: "Remboursement - Festival annulé",
    status: "completed",
    eventId: 102,
    eventTitle: "Festival d'Hiver"
  },
  {
    id: 5,
    date: "2023-11-20T12:30:00",
    amount: 100.00,
    type: "deposit",
    description: "Dépôt via virement bancaire",
    status: "completed",
    reference: "VIR-9876"
  },
  {
    id: 6,
    date: "2023-11-15T22:45:00",
    amount: 18.00,
    type: "purchase",
    description: "Achat ticket - Live EDM",
    status: "completed",
    eventId: 103,
    eventTitle: "Live EDM"
  }
];

export default function WalletPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
    
    // Simuler un chargement des données du portefeuille
    setBalance(mockBalance);
    setTransactions(mockTransactions);
  }, []);

  // Filtrer les transactions selon l'onglet actif
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") {
      return true;
    } else if (activeTab === "deposits") {
      return transaction.type === "deposit" || transaction.type === "refund";
    } else if (activeTab === "withdrawals") {
      return transaction.type === "withdrawal";
    } else if (activeTab === "purchases") {
      return transaction.type === "purchase";
    }
    
    return true;
  });

  // Obtenir les statistiques des transactions
  const getTransactionStats = () => {
    const totalDeposits = transactions
      .filter(t => t.type === "deposit" || t.type === "refund")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalSpent = transactions
      .filter(t => t.type === "purchase")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { totalDeposits, totalSpent };
  };
  
  const stats = getTransactionStats();

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Mon portefeuille</h1>
    </div>
  );

  return (
    <ResponsiveLayout activeItem="wallet" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mon portefeuille</h1>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter des fonds
          </Button>
        </div>
        
        {/* Carte de solde */}
        <Card className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm opacity-80">Solde actuel</p>
                <p className="text-3xl font-bold mt-1">{balance.toFixed(2)} €</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs opacity-80">Total déposé</p>
                <p className="text-lg font-medium">{stats.totalDeposits.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-xs opacity-80">Total dépensé</p>
                <p className="text-lg font-medium">{stats.totalSpent.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-black/10 p-4 mt-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <ArrowDown className="h-4 w-4 mr-2" />
                Retirer
              </Button>
              <Button variant="default" className="bg-white text-primary border-0 hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Méthodes de paiement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Méthodes de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-black text-white flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ****4242</p>
                    <p className="text-xs text-muted-foreground">Expire 12/25</p>
                  </div>
                </div>
                <Badge>Par défaut</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-blue-500 text-white flex items-center justify-center mr-3">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Compte bancaire</p>
                    <p className="text-xs text-muted-foreground">FR76 **** **** 3456</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Définir par défaut</Button>
              </div>
              
              <Button variant="outline" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une méthode de paiement
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Historique des transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
                <TabsTrigger value="deposits" className="flex-1">Dépôts</TabsTrigger>
                <TabsTrigger value="purchases" className="flex-1">Achats</TabsTrigger>
                <TabsTrigger value="withdrawals" className="flex-1">Retraits</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Aucune transaction
                    </h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore de transactions dans cette catégorie
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}

// Composant pour afficher une transaction
interface TransactionItemProps {
  transaction: Transaction;
}

function TransactionItem({ transaction }: TransactionItemProps) {
  // Formater la date
  const formattedDate = format(new Date(transaction.date), "d MMM yyyy, HH'h'mm", { locale: fr });
  
  // Déterminer l'icône, la couleur et le préfixe selon le type de transaction
  let icon = <Wallet className="h-5 w-5" />;
  let colorClass = "bg-gray-100 text-gray-700";
  let amountPrefix = "";
  
  if (transaction.type === "deposit" || transaction.type === "refund") {
    icon = <ArrowDown className="h-5 w-5" />;
    colorClass = "bg-green-100 text-green-700";
    amountPrefix = "+";
  } else if (transaction.type === "withdrawal") {
    icon = <ArrowUp className="h-5 w-5" />;
    colorClass = "bg-red-100 text-red-700";
    amountPrefix = "-";
  } else if (transaction.type === "purchase") {
    icon = <CreditCard className="h-5 w-5" />;
    colorClass = "bg-amber-100 text-amber-700";
    amountPrefix = "-";
  }
  
  // Déterminer la couleur du statut
  let statusColorClass = "bg-green-100 text-green-700";
  if (transaction.status === "pending") {
    statusColorClass = "bg-yellow-100 text-yellow-700";
  } else if (transaction.status === "failed") {
    statusColorClass = "bg-red-100 text-red-700";
  }
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            
            {transaction.status === "pending" && (
              <Badge variant="outline" className={`ml-2 text-[10px] px-1 ${statusColorClass}`}>
                En attente
              </Badge>
            )}
            
            {transaction.status === "failed" && (
              <Badge variant="outline" className={`ml-2 text-[10px] px-1 ${statusColorClass}`}>
                Échouée
              </Badge>
            )}
          </div>
          
          {transaction.reference && (
            <div className="text-xs text-muted-foreground mt-1">
              Réf: {transaction.reference}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-bold ${
          transaction.type === "deposit" || transaction.type === "refund" 
            ? "text-green-600" 
            : transaction.type === "purchase" || transaction.type === "withdrawal" 
              ? "text-red-600" 
              : ""
        }`}>
          {amountPrefix}{transaction.amount.toFixed(2)} €
        </p>
        
        {transaction.eventId && (
          <Link to={`/event/${transaction.eventId}`} className="text-xs text-blue-600 hover:underline">
            Voir l'événement
          </Link>
        )}
      </div>
    </div>
  );
}