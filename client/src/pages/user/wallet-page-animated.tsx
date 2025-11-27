import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wallet, Plus } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AnimatedBalanceCard, 
  TransactionAnimation, 
  AddFundsModal, 
  WithdrawFundsModal,
  Transaction
} from "@/components/wallet";
import { useToast } from "@/hooks/use-toast";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Données fictives pour le solde et les transactions
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

export default function WalletPageAnimated() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [balance, setBalance] = useState(125.50);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const { toast } = useToast();
  
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
    
    // Simuler un chargement des données du portefeuille avec un délai pour montrer l'animation
    setTimeout(() => {
      setTransactions(mockTransactions);
    }, 500);
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

  // Ajouter des fonds
  const handleAddFunds = (amount: number) => {
    // Créer une nouvelle transaction
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: amount,
      type: "deposit",
      description: "Dépôt via carte bancaire",
      status: "completed",
      reference: "CB****4242",
      isNew: true
    };
    
    // Mettre à jour les transactions et le solde
    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
    
    // Afficher un toast
    toast({
      title: "Dépôt effectué",
      description: `${amount.toFixed(2)} € ont été ajoutés à votre compte`,
      variant: "default",
    });
    
    // Fermer le modal
    setAddFundsModalOpen(false);
    
    // Après 5 secondes, supprimer le statut "nouveau" de la transaction
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => t.id === newTransaction.id ? { ...t, isNew: false } : t)
      );
    }, 5000);
  };

  // Retirer des fonds
  const handleWithdrawFunds = (amount: number) => {
    // Créer une nouvelle transaction
    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: amount,
      type: "withdrawal",
      description: "Retrait vers compte bancaire",
      status: "pending",
      reference: `WD-${Math.floor(Math.random() * 10000)}`,
      isNew: true
    };
    
    // Mettre à jour les transactions et le solde
    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev - amount);
    
    // Afficher un toast
    toast({
      title: "Retrait demandé",
      description: `Votre demande de retrait de ${amount.toFixed(2)} € a été traitée`,
      variant: "default",
    });
    
    // Fermer le modal
    setWithdrawModalOpen(false);
    
    // Après 5 secondes, supprimer le statut "nouveau" de la transaction
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => t.id === newTransaction.id ? { ...t, isNew: false } : t)
      );
    }, 5000);
  };

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
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mon portefeuille</h1>
          </div>
          
          <Button onClick={() => setAddFundsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter des fonds
          </Button>
        </div>
        
        {/* Carte de solde animée */}
        <AnimatedBalanceCard 
          balance={balance}
          totalDeposited={stats.totalDeposits}
          totalSpent={stats.totalSpent}
          onWithdraw={() => setWithdrawModalOpen(true)}
          onDeposit={() => setAddFundsModalOpen(true)}
        />
        
        {/* Méthodes de paiement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Méthodes de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center justify-between bg-muted p-3 rounded-lg"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-black text-white flex items-center justify-center mr-3">
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        whileHover={{ rotate: 5 }}
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </motion.svg>
                    </div>
                    <div>
                      <p className="font-medium">Visa ****4242</p>
                      <p className="text-xs text-muted-foreground">Expire 12/25</p>
                    </div>
                  </div>
                  <Badge>Par défaut</Badge>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between p-3 rounded-lg border"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-blue-500 text-white flex items-center justify-center mr-3">
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        whileHover={{ rotate: 5 }}
                      >
                        <path d="M18 3v4c0 2-2 4-4 4H2" />
                        <path d="M18 11v4c0 2-2 4-4 4H2" />
                        <path d="M14 7H8" />
                        <path d="M14 15H8" />
                      </motion.svg>
                    </div>
                    <div>
                      <p className="font-medium">Compte bancaire</p>
                      <p className="text-xs text-muted-foreground">FR76 **** **** 3456</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Définir par défaut</Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une méthode de paiement
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">
                        Aucune transaction
                      </h3>
                      <p className="text-muted-foreground">
                        Vous n'avez pas encore de transactions dans cette catégorie
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {filteredTransactions.map((transaction) => (
                          <TransactionAnimation 
                            key={transaction.id} 
                            transaction={transaction}
                            onAnimationComplete={() => {
                              // Fonction appelée lorsque l'animation est terminée
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Modales */}
      <AddFundsModal 
        open={addFundsModalOpen} 
        onOpenChange={setAddFundsModalOpen} 
        onAddFunds={handleAddFunds} 
      />
      
      <WithdrawFundsModal 
        open={withdrawModalOpen} 
        onOpenChange={setWithdrawModalOpen} 
        onWithdrawFunds={handleWithdrawFunds} 
        maxAmount={balance}
      />
    </ResponsiveLayout>
  );
}