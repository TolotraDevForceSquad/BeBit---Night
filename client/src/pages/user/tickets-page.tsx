import { useEffect, useState } from "react";
import UserLayout from "@/layouts/user-layout"; // Changé pour UserLayout au lieu de ResponsiveLayout
import { Ticket, QrCode, Calendar, Clock, MapPin, ArrowLeft, Download, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les tickets
type UserTicket = {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: "valid" | "used" | "expired" | "refunded";
  qrCode: string;
};

// Données statiques pour les tests
const mockTickets: UserTicket[] = [
  {
    id: 1,
    eventId: 1,
    eventTitle: "Soirée Techno avec DJ Elektra",
    eventDate: "2023-12-15T20:00:00",
    venueName: "Club Oxygen",
    venueAddress: "12 Rue de la Danse, 75011 Paris",
    ticketType: "Standard",
    price: 25,
    purchaseDate: "2023-11-25T14:30:00",
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  },
  {
    id: 2,
    eventId: 2,
    eventTitle: "House Party avec MC Blaze",
    eventDate: "2023-12-22T21:00:00",
    venueName: "Loft 21",
    venueAddress: "21 Avenue des Arts, 75003 Paris",
    ticketType: "VIP",
    price: 40,
    purchaseDate: "2023-11-28T09:15:00",
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  },
  {
    id: 3,
    eventId: 3,
    eventTitle: "Soirée Jazz Live",
    eventDate: "2023-11-18T19:30:00",
    venueName: "Blue Note",
    venueAddress: "7 Rue du Jazz, 75006 Paris",
    ticketType: "Standard",
    price: 30,
    purchaseDate: "2023-11-10T11:45:00",
    status: "used",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  },
];



export default function TicketsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  
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
    
    // Simuler un chargement des tickets
    setTickets(mockTickets);
  }, []);

  // Filtrer les tickets selon l'onglet actif
  const filteredTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.eventDate);
    const now = new Date();
    
    if (activeTab === "upcoming") {
      return eventDate > now && ticket.status === "valid";
    } else if (activeTab === "past") {
      return eventDate < now || ticket.status === "used";
    }
    
    return true;
  });

  // Formater la date des événements
  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr });
  };

  // Le header content n'est pas utilisé car on utilise UserLayout

  // Récupérer l'événement réservé depuis le localStorage s'il existe
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [newlyReservedEvent, setNewlyReservedEvent] = useState<any>(null);
  
  useEffect(() => {
    // Vérifier si un événement a été réservé récemment
    const reservedEventJson = localStorage.getItem('reserved_event');
    if (reservedEventJson) {
      try {
        const reservedEvent = JSON.parse(reservedEventJson);
        setNewlyReservedEvent(reservedEvent);
        
        // Ajouter un nouveau ticket basé sur l'événement réservé
        const newTicket: UserTicket = {
          id: Math.max(...tickets.map(t => t.id), 0) + 1,
          eventId: reservedEvent.id,
          eventTitle: reservedEvent.title,
          eventDate: reservedEvent.date,
          venueName: reservedEvent.venueName,
          venueAddress: reservedEvent.city || "Adresse non spécifiée",
          ticketType: "Standard",
          price: reservedEvent.price || 0,
          purchaseDate: new Date().toISOString(),
          status: "valid",
          qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        };
        
        // Ajouter le ticket au tableau des tickets
        setTickets(prev => [newTicket, ...prev]);
        
        // Afficher une notification de succès
        toast({
          title: "Ticket ajouté!",
          description: `Votre ticket pour "${reservedEvent.title}" a été ajouté`,
          duration: 5000,
        });
        
        // Supprimer l'événement réservé du localStorage
        localStorage.removeItem('reserved_event');
      } catch (error) {
        console.error("Erreur lors de la lecture de l'événement réservé:", error);
      }
    }
  }, []);

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Ticket className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Mes tickets</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs font-medium">
              {tickets.filter(t => t.status === "valid").length} tickets actifs
            </Badge>
            <Button variant="outline" size="sm">
              <Link to="/user/explorer">
                Explorer plus d'événements
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="upcoming" className="flex-1">À venir</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">Passés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas de tickets à venir
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez aucun ticket pour des événements à venir
                </p>
                <Button className="mt-4">Explorer les événements</Button>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas de tickets passés
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez participé à aucun événement pour l'instant
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}

// Composant pour afficher un ticket
function TicketCard({ ticket }: { ticket: UserTicket }) {
  // Déterminer la couleur et le libellé selon le statut
  let statusColor = "";
  let statusLabel = "";
  
  switch (ticket.status) {
    case "valid":
      statusColor = "bg-green-100 text-green-700 border-green-200";
      statusLabel = "Valide";
      break;
    case "used":
      statusColor = "bg-blue-100 text-blue-700 border-blue-200";
      statusLabel = "Utilisé";
      break;
    case "expired":
      statusColor = "bg-amber-100 text-amber-700 border-amber-200";
      statusLabel = "Expiré";
      break;
    case "refunded":
      statusColor = "bg-red-100 text-red-700 border-red-200";
      statusLabel = "Remboursé";
      break;
    default:
      statusColor = "bg-gray-100 text-gray-700 border-gray-200";
      statusLabel = ticket.status;
  }
  
  const eventDate = format(new Date(ticket.eventDate), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr });
  
  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm">
      <CardHeader className="p-0">
        <div className="relative bg-primary/90 text-primary-foreground p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{ticket.eventTitle}</h3>
              <p className="opacity-80 text-sm">{ticket.venueName}</p>
            </div>
            
            <Badge className={`${statusColor} border text-xs font-medium`}>
              {statusLabel}
            </Badge>
          </div>
          
          {/* Effet perforé de ticket */}
          <div className="absolute -bottom-3 left-0 w-full flex justify-between px-4">
            <div className="h-6 w-6 rounded-full bg-background"></div>
            <div className="border-dashed border-t border-primary-foreground/30 flex-1 mx-2"></div>
            <div className="h-6 w-6 rounded-full bg-background"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Date
            </p>
            <p className="text-sm font-medium">
              {format(new Date(ticket.eventDate), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Heure
            </p>
            <p className="text-sm font-medium">
              {format(new Date(ticket.eventDate), "HH'h'mm", { locale: fr })}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> Lieu
            </p>
            <p className="text-sm font-medium">
              {ticket.venueName}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Type</p>
            <p className="text-sm font-medium">
              {ticket.ticketType} - {ticket.price > 0 ? `${ticket.price} €` : 'Gratuit'}
            </p>
          </div>
        </div>
        
        {ticket.status === "valid" && (
          <div className="flex flex-col items-center justify-center my-4">
            <div className="bg-muted p-3 rounded-lg mb-2">
              <QrCode className="h-32 w-32 text-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Présentez ce QR code à l'entrée</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" size="sm" className="border-primary/20 text-primary">
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        
        <Button variant="outline" size="sm" className="border-primary/20 text-primary">
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </CardFooter>
    </Card>
  );
}