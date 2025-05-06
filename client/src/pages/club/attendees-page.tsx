import { useState, useEffect } from "react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Users, Search, CheckCircle, XCircle, Calendar, MessageSquare, 
  Filter, ChevronDown, User, QrCode, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  profileImage?: string;
};

// Type pour un événement
type Event = {
  id: number;
  title: string;
  date: string;
  attendeeCount: number;
  capacity: number;
};

// Type pour un participant
type Attendee = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  ticketType: "standard" | "vip" | "early_bird";
  checkInStatus: "pending" | "checked_in" | "no_show";
  purchaseDate: string;
  ticketId: string;
  eventId: number;
  eventTitle?: string;
  specialRequests?: string;
};

// Données fictives pour les événements
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Soirée Techno avec DJ Elektra",
    date: "2023-12-15T21:00:00",
    attendeeCount: 120,
    capacity: 200
  },
  {
    id: 2,
    title: "House Party avec MC Blaze",
    date: "2023-12-22T22:00:00",
    attendeeCount: 85,
    capacity: 150
  },
  {
    id: 3,
    title: "Nuit Électro",
    date: "2023-11-25T20:00:00",
    attendeeCount: 180,
    capacity: 200
  }
];

// Données fictives pour les participants
const mockAttendees: Attendee[] = [
  {
    id: 1,
    name: "Marie Dupont",
    email: "marie.dupont@gmail.com",
    phone: "+33 6 12 34 56 78",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    ticketType: "vip",
    checkInStatus: "checked_in",
    purchaseDate: "2023-12-01T14:23:00",
    ticketId: "TKT-12345",
    eventId: 1
  },
  {
    id: 2,
    name: "Thomas Martin",
    email: "thomas.martin@gmail.com",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    ticketType: "standard",
    checkInStatus: "pending",
    purchaseDate: "2023-12-02T09:15:00",
    ticketId: "TKT-12346",
    eventId: 1
  },
  {
    id: 3,
    name: "Sophie Bernard",
    email: "sophie.bernard@gmail.com",
    phone: "+33 6 23 45 67 89",
    profileImage: "https://images.unsplash.com/photo-1563306406-e66174fa3787?w=120&h=120&fit=crop",
    ticketType: "early_bird",
    checkInStatus: "checked_in",
    purchaseDate: "2023-11-15T18:45:00",
    ticketId: "TKT-12347",
    eventId: 1,
    specialRequests: "Allergique aux arachides"
  },
  {
    id: 4,
    name: "Lucas Petit",
    email: "lucas.petit@gmail.com",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop",
    ticketType: "standard",
    checkInStatus: "no_show",
    purchaseDate: "2023-12-05T11:30:00",
    ticketId: "TKT-12348",
    eventId: 1
  },
  {
    id: 5,
    name: "Camille Leblanc",
    email: "camille.leblanc@gmail.com",
    phone: "+33 6 34 56 78 90",
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop",
    ticketType: "vip",
    checkInStatus: "pending",
    purchaseDate: "2023-12-08T20:12:00",
    ticketId: "TKT-12349",
    eventId: 1,
    specialRequests: "Fête d'anniversaire, table réservée"
  },
  {
    id: 6,
    name: "Alexandre Dubois",
    email: "alex.dubois@gmail.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    ticketType: "standard",
    checkInStatus: "pending",
    purchaseDate: "2023-12-10T15:45:00",
    ticketId: "TKT-12350",
    eventId: 2
  },
  {
    id: 7,
    name: "Emma Roussel",
    email: "emma.roussel@gmail.com",
    phone: "+33 6 45 67 89 01",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    ticketType: "early_bird",
    checkInStatus: "pending",
    purchaseDate: "2023-11-20T08:30:00",
    ticketId: "TKT-12351",
    eventId: 2
  }
];

interface AttendeesPageProps {
  selectedEventId?: number;
}

export default function AttendeesPage({ selectedEventId }: AttendeesPageProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(selectedEventId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>("all");
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
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
      setAttendees(mockAttendees);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les participants en fonction des critères
  useEffect(() => {
    let filtered = [...attendees];
    
    // Filtrer par événement
    if (selectedEvent) {
      filtered = filtered.filter(a => a.eventId === selectedEvent);
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.email.toLowerCase().includes(query) || 
        a.ticketId.toLowerCase().includes(query)
      );
    }
    
    // Filtrer par statut de check-in
    if (statusFilter !== "all") {
      filtered = filtered.filter(a => a.checkInStatus === statusFilter);
    }
    
    // Filtrer par type de billet
    if (ticketTypeFilter !== "all") {
      filtered = filtered.filter(a => a.ticketType === ticketTypeFilter);
    }
    
    setFilteredAttendees(filtered);
  }, [attendees, selectedEvent, searchQuery, statusFilter, ticketTypeFilter]);
  
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

  const openAttendeeDetails = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setIsAttendeeModalOpen(true);
  };
  
  const handleCheckIn = (id: number) => {
    setAttendees(prevAttendees => 
      prevAttendees.map(attendee => 
        attendee.id === id 
          ? { ...attendee, checkInStatus: "checked_in" } 
          : attendee
      )
    );
  };

  const getEventTitle = (eventId: number): string => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : "Événement inconnu";
  };

  const getTicketTypeLabel = (type: string): string => {
    switch (type) {
      case "standard": return "Standard";
      case "vip": return "VIP";
      case "early_bird": return "Early Bird";
      default: return type;
    }
  };

  const getStatusLabel = (status: string): JSX.Element => {
    switch (status) {
      case "checked_in": 
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />Présent
               </Badge>;
      case "pending": 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                En attente
               </Badge>;
      case "no_show": 
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                <XCircle className="h-3 w-3 mr-1" />Absent
               </Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Participants</h1>
              <p className="text-muted-foreground">
                Gérez les participants à vos événements
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedEvent 
                      ? getEventTitle(selectedEvent)
                      : "Sélectionner un événement"
                    }
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Événements</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setSelectedEvent(null)}
                  className="cursor-pointer"
                >
                  Tous les événements
                </DropdownMenuItem>
                {events.map(event => (
                  <DropdownMenuItem 
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className="cursor-pointer"
                  >
                    {event.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher par nom, email ou numéro de billet" 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Statut
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setStatusFilter("all")}
                        className="cursor-pointer"
                      >
                        Tous les statuts
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setStatusFilter("checked_in")}
                        className="cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Présent
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setStatusFilter("pending")}
                        className="cursor-pointer"
                      >
                        En attente
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setStatusFilter("no_show")}
                        className="cursor-pointer"
                      >
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Absent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Type de billet
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setTicketTypeFilter("all")}
                        className="cursor-pointer"
                      >
                        Tous les types
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTicketTypeFilter("standard")}
                        className="cursor-pointer"
                      >
                        Standard
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTicketTypeFilter("vip")}
                        className="cursor-pointer"
                      >
                        VIP
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setTicketTypeFilter("early_bird")}
                        className="cursor-pointer"
                      >
                        Early Bird
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Liste des participants */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredAttendees.length} Participant{filteredAttendees.length !== 1 ? 's' : ''}
              </CardTitle>
              <CardDescription>
                {selectedEvent 
                  ? `Pour l'événement: ${getEventTitle(selectedEvent)}`
                  : "Tous les événements confondus"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((attendee) => (
                    <div 
                      key={attendee.id} 
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openAttendeeDetails(attendee)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={attendee.profileImage} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <h3 className="font-medium truncate">{attendee.name}</h3>
                          {!selectedEvent && (
                            <span className="text-xs text-muted-foreground truncate">
                              {getEventTitle(attendee.eventId)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 mt-1 text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {attendee.email}
                          </span>
                          <span className="text-muted-foreground">
                            {attendee.ticketId}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <Badge className="whitespace-nowrap" variant={attendee.ticketType === "vip" ? "default" : "outline"}>
                          {getTicketTypeLabel(attendee.ticketType)}
                        </Badge>
                        {getStatusLabel(attendee.checkInStatus)}
                        
                        {attendee.checkInStatus === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hidden sm:flex"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckIn(attendee.id);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Check-in
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <User className="h-10 w-10 mx-auto text-muted-foreground/50" />
                    <p className="mt-2 text-lg font-medium">Aucun participant trouvé</p>
                    <p className="text-muted-foreground">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Modal de détails du participant */}
          {selectedAttendee && (
            <Dialog open={isAttendeeModalOpen} onOpenChange={setIsAttendeeModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Détails du participant</DialogTitle>
                  <DialogDescription>
                    Informations complètes et gestion du participant
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col items-center py-4">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={selectedAttendee.profileImage} alt={selectedAttendee.name} />
                    <AvatarFallback>{selectedAttendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold">{selectedAttendee.name}</h2>
                  <p className="text-muted-foreground">
                    {getEventTitle(selectedAttendee.eventId)}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    {getStatusLabel(selectedAttendee.checkInStatus)}
                    <Badge className="whitespace-nowrap" variant={selectedAttendee.ticketType === "vip" ? "default" : "outline"}>
                      {getTicketTypeLabel(selectedAttendee.ticketType)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAttendee.email}</span>
                    </div>
                    
                    {selectedAttendee.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedAttendee.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAttendee.ticketId}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Acheté le {format(new Date(selectedAttendee.purchaseDate), "d MMMM yyyy, HH:mm", { locale: fr })}
                      </span>
                    </div>
                    
                    {selectedAttendee.specialRequests && (
                      <div className="flex items-start gap-2 border-t pt-3 mt-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Demandes spéciales:</p>
                          <p className="text-sm">{selectedAttendee.specialRequests}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="sm:justify-start">
                  {selectedAttendee.checkInStatus === "pending" ? (
                    <Button 
                      variant="default" 
                      onClick={() => {
                        handleCheckIn(selectedAttendee.id);
                        setIsAttendeeModalOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme présent
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAttendeeModalOpen(false)}>
                      Fermer
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </ResponsiveLayout>
  );
}