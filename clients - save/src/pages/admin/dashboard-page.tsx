import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  BarChart, Calendar, UsersRound, Music, Building, 
  Activity, TrendingUp, Wallet, CreditCard, Clock,
  FileWarning, AlertTriangle, ArrowUpRight, ArrowDownRight,
  DollarSign, Users, MapPin, BarChart3, PieChart
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PartyLoader from "@/components/PartyLoader";

// Types pour le dashboard
type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ReactNode;
  iconColor: string;
}

type ActiviteRecente = {
  id: number;
  type: "event_created" | "user_registered" | "artist_approved" | "club_approved" | "transaction";
  user: {
    name: string;
    avatar?: string;
    role: "user" | "artist" | "club" | "admin";
  };
  description: string;
  timestamp: string;
}

type EventProchain = {
  id: number;
  title: string;
  venue: string;
  date: string;
  attendees: number;
  artist: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  image?: string;
}

type Recette = {
  mois: string;
  billetterie: number;
  commissions: number;
  abonnements: number;
  total: number;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("7j");
  const [activeTab, setActiveTab] = useState("overview");

  // Données simulées pour le dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: "5,231",
    totalArtists: "324",
    totalClubs: "128",
    totalEvents: "867",
    totalTransactions: "4,582",
    totalRevenue: "34,245,560 Ar",
    userGrowth: "12.4%",
    artistGrowth: "8.7%",
    clubGrowth: "5.2%",
    eventGrowth: "15.3%",
    transactionGrowth: "22.1%",
    revenueGrowth: "18.5%"
  });

  const [recentActivity, setRecentActivity] = useState<ActiviteRecente[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventProchain[]>([]);
  const [revenue, setRevenue] = useState<Recette[]>([]);
  const [topLocations, setTopLocations] = useState<{name: string, count: number}[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<{artists: number, clubs: number}>({artists: 0, clubs: 0});
  const [userTypes, setUserTypes] = useState<{type: string, percentage: number}[]>([]);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentActivity([
        {
          id: 1,
          type: "event_created",
          user: { name: "Club Oxygen", avatar: "https://images.unsplash.com/photo-1583244685026-d4ddf6338ba1?w=48&h=48&fit=crop", role: "club" },
          description: "a créé l'événement Night Glow Party",
          timestamp: "2025-05-08T10:23:00"
        },
        {
          id: 2,
          type: "user_registered",
          user: { name: "Thomas Rakoto", avatar: undefined, role: "user" },
          description: "s'est inscrit sur la plateforme",
          timestamp: "2025-05-08T09:17:00"
        },
        {
          id: 3,
          type: "artist_approved",
          user: { name: "DJ Elektra", avatar: "https://images.unsplash.com/photo-1594077412701-1ea2e7e4e0c5?w=48&h=48&fit=crop", role: "artist" },
          description: "a été approuvé comme artiste",
          timestamp: "2025-05-07T16:42:00"
        },
        {
          id: 4,
          type: "transaction",
          user: { name: "Clara Rasoanaivo", avatar: undefined, role: "user" },
          description: "a acheté 2 tickets pour Beach Wave Festival",
          timestamp: "2025-05-07T14:55:00"
        },
        {
          id: 5,
          type: "club_approved",
          user: { name: "Club District", avatar: "https://images.unsplash.com/photo-1602513142546-7226e3e609ff?w=48&h=48&fit=crop", role: "club" },
          description: "a été approuvé comme établissement",
          timestamp: "2025-05-07T11:30:00"
        }
      ]);
      
      setUpcomingEvents([
        {
          id: 1,
          title: "Tropical House Night",
          venue: "Club Oxygen",
          date: "2025-05-10T20:00:00",
          attendees: 187,
          artist: "DJ Elektra",
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=80&fit=crop"
        },
        {
          id: 2,
          title: "Beach Wave Festival",
          venue: "Plage de Tamatave",
          date: "2025-05-15T14:00:00",
          attendees: 543,
          artist: "Multiple Artists",
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=150&h=80&fit=crop"
        },
        {
          id: 3,
          title: "Urban Beats Party",
          venue: "Club District",
          date: "2025-05-17T21:30:00",
          attendees: 129,
          artist: "DJ Metro",
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=80&fit=crop"
        },
        {
          id: 4,
          title: "Jazz & Soul Night",
          venue: "Le Lounge",
          date: "2025-05-20T19:00:00",
          attendees: 75,
          artist: "Nina Jazz Quartet",
          status: "upcoming"
        }
      ]);
      
      setRevenue([
        { mois: "Jan", billetterie: 2456000, commissions: 613500, abonnements: 150000, total: 3219500 },
        { mois: "Fév", billetterie: 2789000, commissions: 697000, abonnements: 180000, total: 3666000 },
        { mois: "Mar", billetterie: 3124000, commissions: 781000, abonnements: 210000, total: 4115000 },
        { mois: "Avr", billetterie: 3567000, commissions: 891750, abonnements: 240000, total: 4698750 },
        { mois: "Mai", billetterie: 1856000, commissions: 464000, abonnements: 270000, total: 2590000 }
      ]);
      
      setTopLocations([
        { name: "Antananarivo", count: 1563 },
        { name: "Tamatave", count: 872 },
        { name: "Majunga", count: 543 },
        { name: "Diego-Suarez", count: 421 },
        { name: "Fianarantsoa", count: 308 }
      ]);
      
      setPendingApprovals({ artists: 12, clubs: 7 });
      
      setUserTypes([
        { type: "Utilisateurs standard", percentage: 78 },
        { type: "Artistes", percentage: 14 },
        { type: "Clubs", percentage: 6 },
        { type: "Administrateurs", percentage: 2 }
      ]);
      
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Composant pour une carte de statistique
  const StatsCard = ({ title, value, description, trend, trendValue, icon, iconColor }: StatsCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-full ${iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {trend === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : trend === "down" ? (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
          )}
          <p className={`text-xs ${
            trend === "up" ? "text-green-500" : 
            trend === "down" ? "text-red-500" : 
            "text-yellow-500"
          }`}>
            {trendValue}
          </p>
          <p className="text-xs text-muted-foreground ml-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ResponsiveLayout>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <PartyLoader />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Aperçu et analyse des données de la plateforme Be bit.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7j">7 jours</SelectItem>
                  <SelectItem value="30j">30 jours</SelectItem>
                  <SelectItem value="90j">90 jours</SelectItem>
                  <SelectItem value="1an">1 an</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
                <Clock className="h-4 w-4 mr-1" />
                Actualiser
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-1/2">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            </TabsList>
            
            {/* Onglet Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard 
                  title="Utilisateurs inscrits"
                  value={dashboardStats.totalUsers}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.userGrowth}
                  icon={<UsersRound className="h-4 w-4 text-blue-500" />}
                  iconColor="bg-blue-100"
                />
                
                <StatsCard 
                  title="Artistes"
                  value={dashboardStats.totalArtists}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.artistGrowth}
                  icon={<Music className="h-4 w-4 text-purple-500" />}
                  iconColor="bg-purple-100"
                />
                
                <StatsCard 
                  title="Clubs & Établissements"
                  value={dashboardStats.totalClubs}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.clubGrowth}
                  icon={<Building className="h-4 w-4 text-indigo-500" />}
                  iconColor="bg-indigo-100"
                />
                
                <StatsCard 
                  title="Événements"
                  value={dashboardStats.totalEvents}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.eventGrowth}
                  icon={<Calendar className="h-4 w-4 text-pink-500" />}
                  iconColor="bg-pink-100"
                />
                
                <StatsCard 
                  title="Transactions"
                  value={dashboardStats.totalTransactions}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.transactionGrowth}
                  icon={<CreditCard className="h-4 w-4 text-green-500" />}
                  iconColor="bg-green-100"
                />
                
                <StatsCard 
                  title="Revenus"
                  value={dashboardStats.totalRevenue}
                  description="depuis le mois dernier"
                  trend="up"
                  trendValue={dashboardStats.revenueGrowth}
                  icon={<DollarSign className="h-4 w-4 text-amber-500" />}
                  iconColor="bg-amber-100"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenus Mensuels (Ariary)</CardTitle>
                    <CardDescription>
                      Répartition des revenus par source
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {/* Ici, intégrer un vrai graphique avec recharts */}
                      <div className="space-y-4">
                        {revenue.map((month, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{month.mois}</span>
                              <span className="font-medium text-right">{month.total.toLocaleString()} Ar</span>
                            </div>
                            <div className="w-full h-4 flex rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-500" 
                                style={{ width: `${(month.billetterie / month.total) * 100}%` }}
                                title="Billetterie"
                              />
                              <div 
                                className="bg-green-500" 
                                style={{ width: `${(month.commissions / month.total) * 100}%` }}
                                title="Commissions"
                              />
                              <div 
                                className="bg-purple-500" 
                                style={{ width: `${(month.abonnements / month.total) * 100}%` }}
                                title="Abonnements"
                              />
                            </div>
                            <div className="flex text-xs text-muted-foreground mt-1 space-x-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                                <span>Billetterie: {month.billetterie.toLocaleString()} Ar</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                <span>Commissions: {month.commissions.toLocaleString()} Ar</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                                <span>Abonnements: {month.abonnements.toLocaleString()} Ar</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Activité Récente</CardTitle>
                    <CardDescription>
                      Dernières actions sur la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{activity.user.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`ml-2 px-1 text-xs ${
                                  activity.user.role === 'artist' ? 'bg-purple-100 text-purple-600' : 
                                  activity.user.role === 'club' ? 'bg-indigo-100 text-indigo-600' : 
                                  activity.user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 
                                  'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {activity.user.role === 'artist' ? 'Artiste' : 
                                 activity.user.role === 'club' ? 'Club' : 
                                 activity.user.role === 'admin' ? 'Admin' : 'User'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), "dd MMM · HH:mm", { locale: fr })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setLocation("/admin/activity")}>
                      Voir toute l'activité
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Prochains Événements</CardTitle>
                    <CardDescription>
                      Événements à venir dans les prochains jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
                          <div className="h-12 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {event.image ? (
                              <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                              <Calendar className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{event.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{event.venue}</p>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <span>{format(new Date(event.date), "dd MMM yyyy · HH:mm", { locale: fr })}</span>
                              <span>•</span>
                              <span>{event.attendees} participants</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setLocation("/admin/events")}>
                      Voir tous les événements
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Demandes En Attente</CardTitle>
                    <CardDescription>
                      Demandes nécessitant votre approbation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Music className="h-5 w-5 mr-2 text-purple-500" />
                            <span className="font-medium">Demandes d'artistes</span>
                          </div>
                          <Badge variant="secondary">{pendingApprovals.artists}</Badge>
                        </div>
                        <Progress value={(pendingApprovals.artists / (pendingApprovals.artists + pendingApprovals.clubs)) * 100} className="mt-2 h-2" />
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Building className="h-5 w-5 mr-2 text-indigo-500" />
                            <span className="font-medium">Demandes d'établissements</span>
                          </div>
                          <Badge variant="secondary">{pendingApprovals.clubs}</Badge>
                        </div>
                        <Progress value={(pendingApprovals.clubs / (pendingApprovals.artists + pendingApprovals.clubs)) * 100} className="mt-2 h-2" />
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center">
                          <FileWarning className="h-5 w-5 mr-2 text-yellow-500" />
                          <span className="font-medium">Signalements à examiner</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="border rounded p-2 text-center">
                            <p className="text-lg font-bold">14</p>
                            <p className="text-xs text-muted-foreground">Utilisateurs</p>
                          </div>
                          <div className="border rounded p-2 text-center">
                            <p className="text-lg font-bold">8</p>
                            <p className="text-xs text-muted-foreground">Événements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => setLocation("/admin/moderation")} className="w-full bg-purple-600 hover:bg-purple-700">
                      Gérer les approbations
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Utilisateurs</CardTitle>
                    <CardDescription>
                      Par type de compte et localisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Types de compte</h4>
                        <span className="text-xs text-muted-foreground">Total: {dashboardStats.totalUsers}</span>
                      </div>
                      <div className="space-y-2">
                        {userTypes.map((type, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs">
                              <span>{type.type}</span>
                              <span>{type.percentage}%</span>
                            </div>
                            <Progress value={type.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Top Localisations</h4>
                        <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/admin/analytics")}>
                          Voir carte
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {topLocations.map((location, i) => (
                          <div key={i} className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">{location.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{location.count} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Onglet Analyses */}
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analyses Avancées</CardTitle>
                  <CardDescription>Statistiques et métriques détaillées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Module d'analyse avancée</h3>
                    <p className="text-muted-foreground mb-4">
                      Cette fonctionnalité sera disponible dans la prochaine mise à jour.
                    </p>
                    <Button variant="outline">Être notifié</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Onglet Événements */}
            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tous les Événements</CardTitle>
                  <CardDescription>Vue d'ensemble des événements à venir</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Événement</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Artiste</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{event.venue}</TableCell>
                          <TableCell>{format(new Date(event.date), "dd MMM yyyy · HH:mm", { locale: fr })}</TableCell>
                          <TableCell>{event.artist}</TableCell>
                          <TableCell>{event.attendees}</TableCell>
                          <TableCell>
                            <Badge className={
                              event.status === "upcoming" ? "bg-blue-500/10 text-blue-500 border-blue-300" :
                              event.status === "live" ? "bg-green-500/10 text-green-500 border-green-300" :
                              event.status === "completed" ? "bg-gray-500/10 text-gray-500 border-gray-300" :
                              "bg-red-500/10 text-red-500 border-red-300"
                            }>
                              {event.status === "upcoming" ? "À venir" :
                               event.status === "live" ? "En cours" :
                               event.status === "completed" ? "Terminé" : "Annulé"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Précédent</Button>
                  <Button variant="outline">Suivant</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Onglet Utilisateurs */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>Vue d'ensemble de la base utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Module de gestion des utilisateurs</h3>
                    <p className="text-muted-foreground mb-4">
                      Cette fonctionnalité sera disponible dans la prochaine mise à jour.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => setLocation("/admin/moderation")}>
                        Voir les demandes d'approbation
                      </Button>
                      <Button variant="outline">Rechercher des utilisateurs</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ResponsiveLayout>
  );
}