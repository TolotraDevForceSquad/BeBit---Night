import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  ArrowLeft, ArrowUp, ArrowDown, Wallet, Plus, CreditCard, 
  Banknote, DollarSign, Settings, User, Bell, Shield, 
  Globe, LogOut, MapPin, Calendar, Mail, Phone
} from "lucide-react";
import UserLayout from "@/layouts/user-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Type pour l'utilisateur authentifié
type AuthUser = {
  id: number;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  createdAt?: string;
  preferences?: {
    notifications: boolean;
    marketingEmails: boolean;
    showLocation: boolean;
    darkMode: boolean;
  };
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
const mockBalance = 125000;
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "2023-12-15T14:30:00",
    amount: 15000,
    type: "purchase",
    description: "Achat ticket - Soirée Techno",
    status: "completed",
    eventId: 101,
    eventTitle: "Soirée Techno"
  },
  {
    id: 2,
    date: "2023-12-10T09:45:00",
    amount: 50000,
    type: "deposit",
    description: "Dépôt via carte bancaire",
    status: "completed",
    reference: "CB****4242"
  },
  {
    id: 3,
    date: "2023-12-05T18:20:00",
    amount: 25000,
    type: "withdrawal",
    description: "Retrait vers compte bancaire",
    status: "pending",
    reference: "WD-12345"
  },
  {
    id: 4,
    date: "2023-11-28T21:15:00",
    amount: 12500,
    type: "refund",
    description: "Remboursement - Festival annulé",
    status: "completed",
    eventId: 102,
    eventTitle: "Festival d'Hiver"
  },
  {
    id: 5,
    date: "2023-11-20T12:30:00",
    amount: 100000,
    type: "deposit",
    description: "Dépôt via virement bancaire",
    status: "completed",
    reference: "VIR-9876"
  },
  {
    id: 6,
    date: "2023-11-15T22:45:00",
    amount: 18000,
    type: "purchase",
    description: "Achat ticket - Live EDM",
    status: "completed",
    eventId: 103,
    eventTitle: "Live EDM"
  }
];

// Mock user data
const mockUser: AuthUser = {
  id: 1,
  username: "user1",
  role: "user",
  firstName: "Marc",
  lastName: "Randria",
  email: "marc.randria@example.com",
  phone: "+261 34 12 34 567",
  address: "123 Rue Principale",
  city: "Antananarivo",
  country: "Madagascar",
  profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww",
  createdAt: "2023-01-15T00:00:00",
  preferences: {
    notifications: true,
    marketingEmails: false,
    showLocation: true,
    darkMode: false
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser({...mockUser, ...userData}); // Merge with mock data for demo
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        setUser(mockUser); // Fallback to mock data
      }
    } else {
      setUser(mockUser); // Use mock data if no user in localStorage
    }
    
    // Simuler un chargement des données du portefeuille
    setBalance(mockBalance);
    setTransactions(mockTransactions);
  }, []);

  // Filtrer les transactions selon l'onglet actif
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "wallet") {
      return true;
    } else if (activeTab === "deposits") {
      return transaction.type === "deposit" || transaction.type === "refund";
    } else if (activeTab === "withdrawals") {
      return transaction.type === "withdrawal";
    } else if (activeTab === "purchases") {
      return transaction.type === "purchase";
    }
    
    return false;
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

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.location.href = '/auth';
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <UserLayout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-3 flex items-center justify-center mb-4">
        <h1 className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Be bit.
        </h1>
      </div>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="profile" className="flex-1">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex-1">
              <Wallet className="h-4 w-4 mr-2" />
              Portefeuille
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>
          
          {/* Tab content for Profile */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
              <CardContent className="relative pt-0 -mt-16">
                <div className="flex flex-col sm:flex-row sm:items-end">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={user.profileImage} alt={user.username} />
                    <AvatarFallback>{user.firstName?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <p className="text-muted-foreground">@{user.username}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.city}, {user.country}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Membre depuis {new Date(user.createdAt || '').getFullYear()}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="sm:self-start mt-4 sm:mt-0">
                    Modifier le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Nom complet</Label>
                    <div className="p-2 bg-muted rounded-md">{user.firstName} {user.lastName}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Adresse email</Label>
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.email}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Téléphone</Label>
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.phone}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Adresse</Label>
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.address}<br />
                      {user.city}, {user.country}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="block mb-1">Notifications</Label>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications sur les événements</p>
                    </div>
                    <Switch id="notifications" checked={user.preferences?.notifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing" className="block mb-1">Emails marketing</Label>
                      <p className="text-sm text-muted-foreground">Recevoir des offres et promotions</p>
                    </div>
                    <Switch id="marketing" checked={user.preferences?.marketingEmails} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="location" className="block mb-1">Partage de localisation</Label>
                      <p className="text-sm text-muted-foreground">Permettre l'accès à votre localisation</p>
                    </div>
                    <Switch id="location" checked={user.preferences?.showLocation} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkmode" className="block mb-1">Mode sombre</Label>
                      <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                    </div>
                    <Switch id="darkmode" checked={user.preferences?.darkMode} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab content for Wallet */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-6 w-6 mr-2" />
                <h2 className="text-2xl font-bold">Mon portefeuille</h2>
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
                    <p className="text-3xl font-bold mt-1">{balance.toLocaleString()} Ar</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-xs opacity-80">Total déposé</p>
                    <p className="text-lg font-medium">{stats.totalDeposits.toLocaleString()} Ar</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Total dépensé</p>
                    <p className="text-lg font-medium">{stats.totalSpent.toLocaleString()} Ar</p>
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
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-xs text-muted-foreground">+261 34 **** 567</p>
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
              <CardHeader className="pb-2 flex justify-between">
                <CardTitle className="text-xl">Historique des transactions</CardTitle>
                <Tabs value="all" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
                    <TabsTrigger value="deposits" className="flex-1">Dépôts</TabsTrigger>
                    <TabsTrigger value="purchases" className="flex-1">Achats</TabsTrigger>
                    <TabsTrigger value="withdrawals" className="flex-1">Retraits</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
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
                    {filteredTransactions.map(transaction => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab content for Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                <h2 className="text-2xl font-bold">Paramètres</h2>
              </div>
              
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Langue et région</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="language">Langue</Label>
                      <Input 
                        id="language" 
                        value="Français" 
                        className="bg-muted" 
                        readOnly 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="region">Région</Label>
                      <Input 
                        id="region" 
                        value="Madagascar" 
                        className="bg-muted" 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Notifications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push" className="block mb-1">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Recevoir des alertes sur votre appareil</p>
                    </div>
                    <Switch id="push" checked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email" className="block mb-1">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">Recevoir des mises à jour par email</p>
                    </div>
                    <Switch id="email" checked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Sécurité</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa" className="block mb-1">Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">Renforcer la sécurité de votre compte</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div>
                    <Label className="block mb-1">Appareils connectés</Label>
                    <Button variant="outline" className="mt-2">Gérer les appareils</Button>
                  </div>
                  
                  <div>
                    <Label className="block mb-1">Activité du compte</Label>
                    <Button variant="outline" className="mt-2">Voir l'historique de connexion</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Shield className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
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
          {amountPrefix}{transaction.amount.toLocaleString()} Ar
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