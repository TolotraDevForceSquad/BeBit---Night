import { useState, useEffect } from "react";
import { Calendar, Search, Users, Wallet, QrCode, Plus, Settings, ChevronRight } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  profileImage?: string;
};

// Type pour un événement du club
type ClubEvent = {
  id: number;
  title: string;
  date: string;
  ticketsSold: number;
  capacity: number;
  status: "upcoming" | "live" | "past";
  revenue: number;
  coverImage: string;
};

// Type pour un artiste
type Artist = {
  id: number;
  name: string;
  genre: string;
  rating: number;
  image?: string;
  popularity: number;
};

// Données fictives pour les événements
const mockEvents: ClubEvent[] = [
  {
    id: 1,
    title: "Soirée Techno avec DJ Elektra",
    date: "2023-12-15T21:00:00",
    ticketsSold: 120,
    capacity: 200,
    status: "upcoming",
    revenue: 3000,
    coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    title: "House Party avec MC Blaze",
    date: "2023-12-22T22:00:00",
    ticketsSold: 85,
    capacity: 150,
    status: "upcoming",
    revenue: 2125,
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Nuit Électro",
    date: "2023-11-25T20:00:00",
    ticketsSold: 180,
    capacity: 200,
    status: "past",
    revenue: 5400,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop"
  }
];

// Données fictives pour les artistes populaires
const popularArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    genre: "Techno",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=120&h=120&fit=crop",
    popularity: 92
  },
  {
    id: 2,
    name: "MC Blaze",
    genre: "House",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1525517450344-d08c6a528e3c?w=120&h=120&fit=crop",
    popularity: 85
  },
  {
    id: 3,
    name: "Luna Ray",
    genre: "Trance",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1525194694565-87be5a7ddac8?w=120&h=120&fit=crop",
    popularity: 89
  },
  {
    id: 4,
    name: "BeatMaster",
    genre: "Hip-Hop",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1568750655343-2e0db8a637e1?w=120&h=120&fit=crop",
    popularity: 78
  }
];

export default function ClubDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
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
      setEvents(mockEvents);
      setArtists(popularArtists);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Statistiques calculées
  const stats = {
    totalRevenue: events.reduce((sum, event) => sum + event.revenue, 0),
    totalTickets: events.reduce((sum, event) => sum + event.ticketsSold, 0),
    upcomingEvents: events.filter(e => e.status === "upcoming").length,
    ticketSalesPercentage: events.length > 0 
      ? Math.round((events.reduce((sum, e) => sum + e.ticketsSold, 0) / 
          events.reduce((sum, e) => sum + e.capacity, 0)) * 100) 
      : 0
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Club</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Users className="h-3 w-3 mr-1" />
          <span>Club</span>
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
      activeItem="événements"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action principale: créer un événement */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Créer un événement</span>
            </Button>
          </div>
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase text-muted-foreground mb-1">
                    Revenus Totaux
                  </div>
                  <div className="text-3xl font-bold">{stats.totalRevenue}€</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tous les événements
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase text-muted-foreground mb-1">
                    Billets Vendus
                  </div>
                  <div className="text-3xl font-bold">{stats.totalTickets}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Taux de remplissage: {stats.ticketSalesPercentage}%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase text-muted-foreground mb-1">
                    Événements à Venir
                  </div>
                  <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Dans les 30 prochains jours
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase text-muted-foreground mb-1">
                    Note du Club
                  </div>
                  <div className="text-3xl font-bold">4.7/5</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Basé sur 156 avis
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs de contenu */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Vue générale</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="artists">Artistes</TabsTrigger>
            </TabsList>
            
            {/* Tab: Vue générale */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Section prochains événements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> 
                    Événements à venir
                  </CardTitle>
                  <CardDescription>
                    Les prochains événements organisés par votre club
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .filter(event => event.status === "upcoming")
                      .slice(0, 2)
                      .map(event => (
                      <div key={event.id} className="flex gap-4">
                        <div 
                          className="h-16 w-16 rounded-md bg-cover bg-center flex-shrink-0" 
                          style={{ backgroundImage: `url(${event.coverImage})` }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm">
                              {event.ticketsSold} / {event.capacity} billets vendus
                            </div>
                            <Button variant="outline" size="sm">Gérer</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 text-center">
                      <Button variant="outline" className="w-full">
                        Voir tous les événements
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section artistes populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Search className="h-5 w-5 mr-2" /> 
                    Artistes Populaires
                  </CardTitle>
                  <CardDescription>
                    Les artistes tendance que vous pourriez inviter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {artists.slice(0, 4).map(artist => (
                      <div key={artist.id} className="border rounded-lg p-4 text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarImage src={artist.image} alt={artist.name} />
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{artist.name}</h3>
                        <div className="text-xs text-muted-foreground mt-1">
                          {artist.genre} • {artist.rating} ★
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 w-full">
                          Inviter
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Actions rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Scanner QR Code</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      Scannez les tickets des participants
                    </p>
                    <Button variant="default" size="sm">
                      Ouvrir Scanner
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Portefeuille</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      Gérez vos revenus et paiements
                    </p>
                    <Button variant="outline" size="sm">
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Profil du Club</h3>
                    <p className="text-sm text-muted-foreground my-2">
                      Modifiez vos informations
                    </p>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Tab: Événements */}
            <TabsContent value="events" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Tous les événements
                  </CardTitle>
                  <CardDescription>
                    Gérez vos événements passés et à venir
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex gap-4 border-b pb-4">
                        <div 
                          className="h-20 w-32 rounded-md bg-cover bg-center flex-shrink-0" 
                          style={{ backgroundImage: `url(${event.coverImage})` }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge className={
                              event.status === "upcoming" ? "bg-blue-500/10 text-blue-500" :
                              event.status === "live" ? "bg-green-500/10 text-green-500" :
                              "bg-muted text-muted-foreground"
                            }>
                              {event.status === "upcoming" ? "À venir" :
                               event.status === "live" ? "En cours" : "Passé"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <span className="text-sm font-medium">{event.revenue}€</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({event.ticketsSold}/{event.capacity} billets)
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Détails</Button>
                              {event.status === "upcoming" && (
                                <Button variant="default" size="sm">Modifier</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab: Artistes */}
            <TabsContent value="artists" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Recherche d'artistes
                  </CardTitle>
                  <CardDescription>
                    Trouvez et invitez des artistes pour vos événements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {artists.map(artist => (
                      <div key={artist.id} className="border rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage src={artist.image} alt={artist.name} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{artist.name}</h3>
                            <div className="text-xs text-muted-foreground">
                              {artist.genre}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>Popularité:</span>
                            <span>{artist.popularity}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${artist.popularity}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>Note:</span>
                            <span>{artist.rating} / 5</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(artist.rating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Profil
                          </Button>
                          <Button variant="default" size="sm" className="flex-1">
                            Inviter
                          </Button>
                        </div>
                      </div>
                    ))}
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