import { useState, useEffect } from "react";
import { Calendar, Search, Users, Wallet, QrCode, Plus, Settings, ChevronRight, CalendarDays, Map, Clock, Phone, UserPlus, Check, X } from "lucide-react";
import ClubLayout from "@/layouts/club-layout";
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

// Type pour une réservation de table
type TableReservation = {
  id: number;
  customerName: string;
  date: string;
  time: string;
  guestCount: number;
  status: "confirmed" | "pending" | "cancelled";
  phone: string;
  specialRequests?: string;
  tableNumber?: string;
};

// Type pour une sortie (événement informel créé par un utilisateur)
type UserEvent = {
  id: number;
  title: string;
  organizer: string;
  date: string;
  participantCount: number;
  maxParticipants: number;
  status: "upcoming" | "live" | "past";
  image?: string;
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

// Données fictives pour les réservations de tables
const mockTableReservations: TableReservation[] = [
  {
    id: 1,
    customerName: "Thomas Martin",
    date: "2023-12-16",
    time: "21:00",
    guestCount: 5,
    status: "confirmed",
    phone: "+33 6 12 34 56 78",
    tableNumber: "VIP-3"
  },
  {
    id: 2,
    customerName: "Sophie Dubois",
    date: "2023-12-16",
    time: "22:30",
    guestCount: 8,
    status: "confirmed",
    phone: "+33 6 23 45 67 89",
    tableNumber: "VIP-1",
    specialRequests: "Anniversaire, prévoir bouteille de champagne"
  },
  {
    id: 3,
    customerName: "Jean Durand",
    date: "2023-12-15",
    time: "20:00",
    guestCount: 4,
    status: "pending",
    phone: "+33 6 34 56 78 90"
  },
  {
    id: 4,
    customerName: "Emma Petit",
    date: "2023-12-22",
    time: "22:00",
    guestCount: 6,
    status: "confirmed",
    phone: "+33 6 45 67 89 01",
    tableNumber: "A-12"
  },
  {
    id: 5,
    customerName: "Lucas Bernard",
    date: "2023-12-17",
    time: "23:00",
    guestCount: 3,
    status: "cancelled",
    phone: "+33 6 56 78 90 12"
  }
];

// Données fictives pour les sorties liées au club
const mockUserEvents: UserEvent[] = [
  {
    id: 1,
    title: "Soirée d'anniversaire de Marie",
    organizer: "Marie L.",
    date: "2023-12-18T21:00:00",
    participantCount: 12,
    maxParticipants: 15,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=120&h=120&fit=crop"
  },
  {
    id: 2,
    title: "After-work du vendredi",
    organizer: "Marc D.",
    date: "2023-12-15T19:00:00",
    participantCount: 8,
    maxParticipants: 10,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=120&h=120&fit=crop"
  },
  {
    id: 3,
    title: "Retrouvailles promo 2020",
    organizer: "Julie M.",
    date: "2023-12-22T20:30:00",
    participantCount: 18,
    maxParticipants: 25,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=120&h=120&fit=crop"
  },
  {
    id: 4,
    title: "Pot de départ de Laurent",
    organizer: "Équipe Marketing",
    date: "2023-11-30T18:00:00",
    participantCount: 15,
    maxParticipants: 15,
    status: "past",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=120&h=120&fit=crop"
  }
];

interface ClubDashboardPageProps {
  activeTab?: string;
}

export default function ClubDashboardPage({ activeTab = "overview" }: ClubDashboardPageProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tableReservations, setTableReservations] = useState<TableReservation[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [currentTab, setCurrentTab] = useState(activeTab);
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
      setTableReservations(mockTableReservations);
      setUserEvents(mockUserEvents);
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

  return (
    <ClubLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* En-tête avec le titre et le bouton d'action */}
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
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid grid-cols-6 lg:w-[700px]">
                <TabsTrigger value="overview">Vue générale</TabsTrigger>
                <TabsTrigger value="events">Événements</TabsTrigger>
                <TabsTrigger value="attendees">Participants</TabsTrigger>
                <TabsTrigger value="reservations">Réservations</TabsTrigger>
                <TabsTrigger value="outings">Sorties</TabsTrigger>
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
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/club/wallet'}>
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
                                  {event.ticketsSold}/{event.capacity} billets
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Modifier</Button>
                                <Button variant="default" size="sm">Gérer</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab: Participants */}
              <TabsContent value="attendees" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Participants récents</CardTitle>
                    <CardDescription>
                      Les personnes qui ont assisté à vos événements récemment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Contenu pour les participants - À développer */}
                      <div className="text-center p-12 text-muted-foreground">
                        Les données des participants seront affichées ici
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab: Réservations */}
              <TabsContent value="reservations" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Réservations de tables</CardTitle>
                    <CardDescription>
                      Gérez les réservations de tables pour vos événements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tableReservations.map(reservation => (
                        <div key={reservation.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{reservation.customerName}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                {reservation.date} • {reservation.time}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Users className="h-3 w-3 mr-1" />
                                {reservation.guestCount} personnes
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Phone className="h-3 w-3 mr-1" />
                                {reservation.phone}
                              </div>
                              {reservation.specialRequests && (
                                <div className="text-sm italic mt-2 text-muted-foreground">
                                  "{reservation.specialRequests}"
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className={
                                reservation.status === "confirmed" ? "bg-green-500/10 text-green-500" :
                                reservation.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                "bg-red-500/10 text-red-500"
                              }>
                                {reservation.status === "confirmed" ? "Confirmée" :
                                 reservation.status === "pending" ? "En attente" : "Annulée"}
                              </Badge>
                              {reservation.tableNumber && (
                                <div className="text-sm font-medium mt-2">
                                  Table: {reservation.tableNumber}
                                </div>
                              )}
                            </div>
                          </div>
                          {reservation.status === "pending" && (
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="w-full gap-1" variant="default">
                                <Check className="h-4 w-4" />
                                Confirmer
                              </Button>
                              <Button size="sm" className="w-full gap-1" variant="outline">
                                <X className="h-4 w-4" />
                                Refuser
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab: Sorties */}
              <TabsContent value="outings" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Sorties prévues dans votre club</CardTitle>
                    <CardDescription>
                      Événements informels organisés par des utilisateurs dans votre établissement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userEvents.map(event => (
                        <div key={event.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="h-32 bg-cover bg-center" 
                            style={{ backgroundImage: `url(${event.image})` }}
                          />
                          <div className="p-4">
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <UserPlus className="h-3 w-3 mr-1" />
                              {event.participantCount}/{event.maxParticipants} participants
                            </div>
                            <div className="flex items-center text-sm font-medium mt-1">
                              Organisé par: {event.organizer}
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-3">
                              Voir les détails
                            </Button>
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
                    <CardTitle className="text-xl">Artistes populaires</CardTitle>
                    <CardDescription>
                      Découvrez et invitez des artistes pour vos événements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {artists.map(artist => (
                        <div key={artist.id} className="border rounded-lg p-4 text-center">
                          <Avatar className="h-20 w-20 mx-auto mb-3">
                            <AvatarImage src={artist.image} alt={artist.name} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-lg">{artist.name}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {artist.genre}
                          </div>
                          <div className="mt-1 text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < Math.floor(artist.rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
                            ))}
                            <span className="ml-1 text-muted-foreground">({artist.rating})</span>
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            Popularité: {artist.popularity}%
                            <div className="w-full bg-muted h-1 mt-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-1 rounded-full" 
                                style={{ width: `${artist.popularity}%` }}
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <Button variant="default" size="sm" className="w-full">
                              Inviter pour un événement
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              Voir le profil
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </ClubLayout>
  );
}