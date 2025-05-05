import { useState, useEffect } from "react";
import { BarChart, PieChart, LineChart, ChevronRight, User, Music, Building, Calendar, Ban, AlertTriangle } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les statistiques globales
type Stats = {
  totalUsers: number;
  totalArtists: number;
  totalClubs: number;
  totalEvents: number;
  totalRevenue: number;
  newUsersLastMonth: number;
  growthRate: number;
};

// Type pour un utilisateur (pour la modération)
type UserForModeration = {
  id: number;
  username: string;
  email: string;
  role: string;
  dateJoined: string;
  status: "active" | "pending" | "suspended";
  profileImage?: string;
  reportCount: number;
};

// Type pour un événement (pour la modération)
type EventForModeration = {
  id: number;
  title: string;
  clubName: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  reportCount: number;
  coverImage: string;
};

// Données fictives pour les statistiques
const mockStats: Stats = {
  totalUsers: 2458,
  totalArtists: 732,
  totalClubs: 187,
  totalEvents: 463,
  totalRevenue: 128750,
  newUsersLastMonth: 143,
  growthRate: 8.2
};

// Données fictives pour les utilisateurs à modérer
const mockUsersForModeration: UserForModeration[] = [
  {
    id: 1,
    username: "johndoe",
    email: "john.doe@example.com",
    role: "user",
    dateJoined: "2023-11-10T14:23:01",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
    reportCount: 0
  },
  {
    id: 2,
    username: "partyanimal",
    email: "party.animal@example.com",
    role: "user",
    dateJoined: "2023-11-15T09:45:22",
    status: "pending",
    reportCount: 2
  },
  {
    id: 3,
    username: "clubmetropolis",
    email: "info@clubmetropolis.com",
    role: "club",
    dateJoined: "2023-11-12T16:30:45",
    status: "pending",
    profileImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=80&h=80&fit=crop",
    reportCount: 0
  },
  {
    id: 4,
    username: "dj_shadybeats",
    email: "dj.shadybeats@example.com",
    role: "artist",
    dateJoined: "2023-11-08T11:20:33",
    status: "suspended",
    profileImage: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=80&h=80&fit=crop",
    reportCount: 5
  }
];

// Données fictives pour les événements à modérer
const mockEventsForModeration: EventForModeration[] = [
  {
    id: 1,
    title: "Soirée Techno Extrême",
    clubName: "Club Metropolis",
    date: "2023-12-22T22:00:00",
    status: "pending",
    reportCount: 0,
    coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=240&h=120&fit=crop"
  },
  {
    id: 2,
    title: "After Party Underground",
    clubName: "Le Bunker",
    date: "2023-12-25T02:00:00",
    status: "pending",
    reportCount: 3,
    coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=240&h=120&fit=crop"
  },
  {
    id: 3,
    title: "Festival Électro",
    clubName: "Warehouse",
    date: "2023-12-30T18:00:00",
    status: "approved",
    reportCount: 1,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&h=120&fit=crop"
  }
];

// Données pour les graphiques (simplifiées)
const revenueData = [
  { month: "Jan", amount: 8500 },
  { month: "Feb", amount: 9200 },
  { month: "Mar", amount: 10100 },
  { month: "Apr", amount: 10800 },
  { month: "May", amount: 11500 },
  { month: "Jun", amount: 12300 },
  { month: "Jul", amount: 13000 },
  { month: "Aug", amount: 13700 },
  { month: "Sep", amount: 14200 },
  { month: "Oct", amount: 15000 },
  { month: "Nov", amount: 16000 },
  { month: "Dec", amount: 17200 }
];

const userTypeData = [
  { type: "Utilisateurs", count: 1539 },
  { type: "Artistes", count: 732 },
  { type: "Clubs", count: 187 }
];

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [usersForModeration, setUsersForModeration] = useState<UserForModeration[]>([]);
  const [eventsForModeration, setEventsForModeration] = useState<EventForModeration[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  
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
  }, []);

  // Simuler un chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(mockStats);
      setUsersForModeration(mockUsersForModeration);
      setEventsForModeration(mockEventsForModeration);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculer le pourcentage d'événements approuvés
  const approvedEventsPercentage = !eventsForModeration.length ? 0 :
    Math.round((eventsForModeration.filter(e => e.status === "approved").length / eventsForModeration.length) * 100);

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Admin</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <User className="h-3 w-3 mr-1" />
          <span>Admin</span>
        </Badge>
        
        {user && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="dashboard"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Utilisateurs
                    </p>
                    <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium text-green-500">+{stats?.newUsersLastMonth}</span>
                  <span className="mx-1">nouveaux ce mois</span>
                  <span className="font-medium text-green-500">({stats?.growthRate}%)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Artistes
                    </p>
                    <p className="text-2xl font-bold">{stats?.totalArtists}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium">Ratio:</span>
                  <span className="mx-1">{Math.round(stats?.totalArtists / stats?.totalUsers * 100)}% des utilisateurs</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Clubs
                    </p>
                    <p className="text-2xl font-bold">{stats?.totalClubs}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium">Ratio:</span>
                  <span className="mx-1">{Math.round(stats?.totalClubs / stats?.totalUsers * 100)}% des utilisateurs</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Revenus
                    </p>
                    <p className="text-2xl font-bold">{stats?.totalRevenue.toLocaleString()}€</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium">Événements:</span>
                  <span className="mx-1">{stats?.totalEvents} au total</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs de contenu */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Vue générale</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="moderation">Modération</TabsTrigger>
            </TabsList>
            
            {/* Tab: Vue générale */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Graphiques et statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <LineChart className="h-5 w-5 mr-2" /> 
                      Revenus Mensuels
                    </CardTitle>
                    <CardDescription>
                      Progression des revenus sur l'année
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                      <p className="text-muted-foreground">Graphique: Revenus Mensuels</p>
                      {/* Ici nous pourrions intégrer un graphique réel avec Recharts */}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <PieChart className="h-5 w-5 mr-2" /> 
                      Répartition des Utilisateurs
                    </CardTitle>
                    <CardDescription>
                      Distribution par type d'utilisateur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                      <p className="text-muted-foreground">Graphique: Répartition des Utilisateurs</p>
                      {/* Ici nous pourrions intégrer un graphique réel avec Recharts */}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Statistiques supplémentaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Récapitulatif des Activités
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <span className="text-lg font-bold">{stats?.totalEvents}</span>
                      <span className="text-sm text-muted-foreground text-center">Événements Créés</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <span className="text-lg font-bold">{approvedEventsPercentage}%</span>
                      <span className="text-sm text-muted-foreground text-center">Taux d'Approbation</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <span className="text-lg font-bold">4.7/5</span>
                      <span className="text-sm text-muted-foreground text-center">Note Moyenne</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-md">
                      <span className="text-lg font-bold">95%</span>
                      <span className="text-sm text-muted-foreground text-center">Satisfaction Client</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab: Utilisateurs */}
            <TabsContent value="users" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Gestion des Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersForModeration.map(user => (
                        <TableRow key={user.id} className={user.reportCount > 0 ? "bg-red-50 dark:bg-red-950/10" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={user.profileImage} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{user.username}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              user.role === "admin" ? "bg-purple-500/10 text-purple-500 border-purple-500/25" :
                              user.role === "artist" ? "bg-blue-500/10 text-blue-500 border-blue-500/25" :
                              user.role === "club" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                              "bg-gray-500/10 text-gray-500 border-gray-500/25"
                            }>
                              {user.role === "admin" ? "Admin" :
                               user.role === "artist" ? "Artiste" :
                               user.role === "club" ? "Club" : "Utilisateur"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.dateJoined), "dd/MM/yyyy", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              user.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                              user.status === "suspended" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                              "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                            }>
                              {user.status === "active" ? "Actif" :
                               user.status === "suspended" ? "Suspendu" : "En attente"}
                            </Badge>
                            {user.reportCount > 0 && (
                              <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/25">
                                {user.reportCount} signalement(s)
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm">Voir</Button>
                              {user.status === "pending" && (
                                <Button variant="default" size="sm">Approuver</Button>
                              )}
                              {user.status !== "suspended" && (
                                <Button variant="destructive" size="sm">Suspendre</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab: Modération */}
            <TabsContent value="moderation" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" /> 
                    Événements à Modérer
                  </CardTitle>
                  <CardDescription>
                    Événements en attente d'approbation ou signalés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventsForModeration
                      .filter(event => event.status === "pending" || event.reportCount > 0)
                      .map(event => (
                      <div key={event.id} className={`border rounded-lg p-4 ${event.reportCount > 0 ? "border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-800/30" : ""}`}>
                        <div className="flex gap-4">
                          <div 
                            className="h-20 w-20 rounded-md bg-cover bg-center flex-shrink-0" 
                            style={{ backgroundImage: `url(${event.coverImage})` }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge className={
                                event.status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                                event.status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                                "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                              }>
                                {event.status === "approved" ? "Approuvé" :
                                 event.status === "rejected" ? "Rejeté" : "En attente"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Club: {event.clubName}</p>
                            <p className="text-sm text-muted-foreground">
                              Date: {format(new Date(event.date), "dd/MM/yyyy HH'h'mm", { locale: fr })}
                            </p>
                            {event.reportCount > 0 && (
                              <p className="text-sm font-medium text-red-500 mt-1">
                                {event.reportCount} signalement(s)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <Button variant="outline" size="sm">Voir détails</Button>
                          {event.status === "pending" && (
                            <>
                              <Button variant="default" size="sm">Approuver</Button>
                              <Button variant="destructive" size="sm">Rejeter</Button>
                            </>
                          )}
                          {event.reportCount > 0 && event.status !== "pending" && (
                            <Button variant="destructive" size="sm">Examiner signalements</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Ban className="h-5 w-5 mr-2" /> 
                    Utilisateurs Signalés
                  </CardTitle>
                  <CardDescription>
                    Utilisateurs ayant reçu des signalements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Signalements</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersForModeration
                        .filter(user => user.reportCount > 0)
                        .map(user => (
                        <TableRow key={user.id} className="bg-red-50 dark:bg-red-950/10">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={user.profileImage} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{user.username}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              user.role === "admin" ? "bg-purple-500/10 text-purple-500" :
                              user.role === "artist" ? "bg-blue-500/10 text-blue-500" :
                              user.role === "club" ? "bg-green-500/10 text-green-500" :
                              "bg-gray-500/10 text-gray-500"
                            }>
                              {user.role === "admin" ? "Admin" :
                               user.role === "artist" ? "Artiste" :
                               user.role === "club" ? "Club" : "Utilisateur"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/25">
                              {user.reportCount} signalement(s)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              user.status === "active" ? "bg-green-500/10 text-green-500" :
                              user.status === "suspended" ? "bg-red-500/10 text-red-500" :
                              "bg-yellow-500/10 text-yellow-500"
                            }>
                              {user.status === "active" ? "Actif" :
                               user.status === "suspended" ? "Suspendu" : "En attente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm">Voir signalements</Button>
                              {user.status !== "suspended" && (
                                <Button variant="destructive" size="sm">Suspendre</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {usersForModeration.filter(user => user.reportCount > 0).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Aucun utilisateur signalé pour le moment.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ResponsiveLayout>
  );
}