import { useState, useEffect } from "react";
import { Calendar, Plus, Filter, Download, Search } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import ArtistCalendar, { CalendarEvent } from "@/components/ArtistCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

// Données fictives pour les événements (projetés sur 3 mois)
const generateMockEvents = (): CalendarEvent[] => {
  const now = new Date();
  const events: CalendarEvent[] = [];
  
  // Événements ce mois-ci
  events.push({
    id: 1,
    title: "Soirée Techno",
    date: new Date(now.getFullYear(), now.getMonth(), 5, 21, 0).toISOString(),
    location: "Club Oxygen",
    fee: 300000,
    status: "confirmed"
  });
  
  events.push({
    id: 2,
    title: "House Party",
    date: new Date(now.getFullYear(), now.getMonth(), 12, 22, 0).toISOString(),
    location: "Loft 21",
    fee: 250000,
    status: "pending"
  });
  
  events.push({
    id: 3,
    title: "Festival Électro",
    date: new Date(now.getFullYear(), now.getMonth(), 19, 20, 0).toISOString(),
    location: "Warehouse",
    fee: 500000,
    status: "confirmed"
  });
  
  // Événements le mois prochain
  const nextMonth = addMonths(now, 1);
  events.push({
    id: 4,
    title: "Summer Vibes",
    date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 2, 19, 30).toISOString(),
    location: "Beach Club",
    fee: 350000,
    status: "confirmed"
  });
  
  events.push({
    id: 5,
    title: "Club Opening",
    date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 10, 23, 0).toISOString(),
    location: "New Venue",
    fee: 450000,
    status: "confirmed"
  });
  
  events.push({
    id: 6,
    title: "Private Event",
    date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15, 20, 0).toISOString(),
    location: "Hotel XYZ",
    fee: 600000,
    status: "pending"
  });
  
  // Événements dans deux mois
  const twoMonthsLater = addMonths(now, 2);
  events.push({
    id: 7,
    title: "Underground Night",
    date: new Date(twoMonthsLater.getFullYear(), twoMonthsLater.getMonth(), 5, 22, 0).toISOString(),
    location: "The Basement",
    fee: 400000,
    status: "pending"
  });
  
  events.push({
    id: 8,
    title: "Festival Main Stage",
    date: new Date(twoMonthsLater.getFullYear(), twoMonthsLater.getMonth(), 20, 18, 0).toISOString(),
    location: "City Park",
    fee: 800000,
    status: "confirmed"
  });
  
  return events;
};

export default function ArtistAgendaPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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

  // Chargement des événements
  useEffect(() => {
    // Chargement immédiat sans délai artificiel
    const mockEvents = generateMockEvents();
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setIsLoading(false);
  }, []);
  
  // Filtrer les événements
  useEffect(() => {
    let result = events;
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(event => event.status === statusFilter);
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, statusFilter]);

  // Statistiques des événements
  const stats = {
    confirmed: events.filter(e => e.status === "confirmed").length,
    pending: events.filter(e => e.status === "pending").length,
    cancelled: events.filter(e => e.status === "cancelled").length,
    totalRevenue: events
      .filter(e => e.status === "confirmed")
      .reduce((sum, event) => sum + event.fee, 0),
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Agenda</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Agenda</span>
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
          {/* Actions et statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Aperçu</CardTitle>
                <CardDescription>Statistiques de vos événements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Total d'événements</p>
                    <p className="text-xl font-semibold">{events.length}</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">À venir</p>
                    <p className="text-xl font-semibold">{stats.upcomingEvents}</p>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded-md">
                    <p className="text-xs text-green-700 dark:text-green-300">Confirmés</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">{stats.confirmed}</p>
                  </div>
                  <div className="bg-yellow-500/10 p-2 rounded-md">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">En attente</p>
                    <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-primary/10 rounded-md">
                  <p className="text-xs text-primary">Revenus confirmés</p>
                  <p className="text-xl font-semibold">{stats.totalRevenue.toLocaleString()} Ar</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Outils</CardTitle>
                <CardDescription>Gérer et filtrer vos événements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" /> Nouvel événement
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" /> Filtrer
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Statut</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                          Tous
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
                          Confirmés
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                          En attente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                          Annulés
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Exporter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un événement..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets Calendrier / Liste */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <ArtistCalendar events={filteredEvents} />
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> 
                    Liste des Événements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>Aucun événement trouvé</p>
                      {(searchTerm || statusFilter) && (
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter(null);
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => (
                          <div key={event.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-4 rounded-lg">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(event.date), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr })}
                              </div>
                              <div className="text-sm">{event.location}</div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                              <Badge className={
                                event.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                                event.status === "cancelled" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                                "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                              }>
                                {event.status === "confirmed" ? "Confirmé" :
                                 event.status === "cancelled" ? "Annulé" : "En attente"}
                              </Badge>
                              <div className="font-medium mt-1">{event.fee.toLocaleString()} Ar</div>
                              <div className="mt-2">
                                <Button variant="outline" size="sm">Détails</Button>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ResponsiveLayout>
  );
}