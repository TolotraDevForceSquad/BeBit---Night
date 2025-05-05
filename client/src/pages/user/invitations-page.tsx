import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Mail, Calendar, MapPin, Clock, Users, Ticket, Music } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les invitations
type UserInvitation = {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  clubName: string;
  clubId: number;
  clubImage?: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  invitedBy: {
    id: number;
    name: string;
    image?: string;
  };
  invitedAt: string;
};

// Données fictives pour les invitations
const mockInvitations: UserInvitation[] = [
  {
    id: 1,
    eventId: 101,
    eventTitle: "Nuit Électro Premium",
    eventDate: "2023-12-25T22:00:00",
    eventImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000",
    clubName: "Club Oxygen",
    clubId: 201,
    clubImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000",
    message: "Salut ! On organise une soirée spéciale pour Noël et on aimerait t'y voir. Tu auras accès au carré VIP !",
    status: "pending",
    invitedBy: {
      id: 301,
      name: "Marc Dubois",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    invitedAt: "2023-12-10T14:30:00"
  },
  {
    id: 2,
    eventId: 102,
    eventTitle: "Soirée Masquée",
    eventDate: "2024-01-15T23:00:00",
    eventImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    clubName: "Le Bunker",
    clubId: 202,
    message: "Hey, on organise une soirée masquée au Bunker le 15 janvier. L'entrée t'est offerte si tu viens déguisé(e) !",
    status: "accepted",
    invitedBy: {
      id: 302,
      name: "Sophie Martin",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    invitedAt: "2023-12-05T18:15:00"
  },
  {
    id: 3,
    eventId: 103,
    eventTitle: "After Work Jazzy",
    eventDate: "2023-12-22T19:00:00",
    eventImage: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=1000",
    clubName: "Blue Note",
    clubId: 203,
    clubImage: "https://images.unsplash.com/photo-1577201561968-fd58f12e8dcd?q=80&w=1000",
    message: "Nous organisons une soirée jazz ce vendredi. Une place t'est réservée avec un cocktail offert !",
    status: "declined",
    invitedBy: {
      id: 303,
      name: "Jean Moreau",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    invitedAt: "2023-12-01T10:45:00"
  }
];

export default function InvitationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  
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
    
    // Simuler un chargement des invitations
    setInvitations(mockInvitations);
  }, []);

  // Filtrer les invitations selon l'onglet actif
  const filteredInvitations = invitations.filter(invitation => {
    if (activeTab === "pending") {
      return invitation.status === "pending";
    } else if (activeTab === "accepted") {
      return invitation.status === "accepted";
    } else if (activeTab === "declined") {
      return invitation.status === "declined";
    }
    
    return true;
  });

  // Formater la date des événements
  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr });
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Mes invitations</h1>
    </div>
  );

  // Fonction pour accepter une invitation
  const handleAccept = (id: number) => {
    setInvitations(prev => 
      prev.map(invitation => 
        invitation.id === id 
          ? { ...invitation, status: "accepted" } 
          : invitation
      )
    );
  };

  // Fonction pour refuser une invitation
  const handleDecline = (id: number) => {
    setInvitations(prev => 
      prev.map(invitation => 
        invitation.id === id 
          ? { ...invitation, status: "declined" } 
          : invitation
      )
    );
  };

  return (
    <ResponsiveLayout activeItem="invitations" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mes invitations</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {invitations.filter(i => i.status === "pending").length} invitation(s) en attente
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="pending" className="flex-1">En attente</TabsTrigger>
            <TabsTrigger value="accepted" className="flex-1">Acceptées</TabsTrigger>
            <TabsTrigger value="declined" className="flex-1">Refusées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas d'invitations en attente
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez aucune invitation en attente pour le moment
                </p>
              </div>
            ) : (
              filteredInvitations.map((invitation) => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="accepted" className="space-y-4">
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas d'invitations acceptées
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez accepté aucune invitation pour le moment
                </p>
              </div>
            ) : (
              filteredInvitations.map((invitation) => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="declined" className="space-y-4">
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas d'invitations refusées
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez refusé aucune invitation pour le moment
                </p>
              </div>
            ) : (
              filteredInvitations.map((invitation) => (
                <InvitationCard 
                  key={invitation.id} 
                  invitation={invitation} 
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}

// Composant pour afficher une invitation
interface InvitationCardProps {
  invitation: UserInvitation;
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
}

function InvitationCard({ invitation, onAccept, onDecline }: InvitationCardProps) {
  const eventDate = format(new Date(invitation.eventDate), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr });
  const invitedDate = format(new Date(invitation.invitedAt), "d MMMM yyyy", { locale: fr });
  
  // Badge de statut
  let statusColor = "";
  let statusLabel = "";
  
  switch (invitation.status) {
    case "pending":
      statusColor = "bg-yellow-100 text-yellow-700";
      statusLabel = "En attente";
      break;
    case "accepted":
      statusColor = "bg-green-100 text-green-700";
      statusLabel = "Acceptée";
      break;
    case "declined":
      statusColor = "bg-red-100 text-red-700";
      statusLabel = "Refusée";
      break;
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {invitation.eventImage && (
          <div 
            className="h-32 w-full bg-center bg-cover"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${invitation.eventImage})` 
            }}
          >
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="font-bold text-lg">{invitation.eventTitle}</h3>
              <p className="opacity-80 text-sm">{invitation.clubName}</p>
            </div>
            
            <Badge className={`${statusColor} absolute top-3 right-3 text-xs font-medium`}>
              {statusLabel}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={invitation.invitedBy.image} alt={invitation.invitedBy.name} />
            <AvatarFallback>{invitation.invitedBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              <span className="font-semibold">{invitation.invitedBy.name}</span> vous a invité
            </p>
            <p className="text-xs text-muted-foreground">
              le {invitedDate}
            </p>
          </div>
        </div>
        
        <div className="border p-3 rounded-md mb-3 text-sm bg-muted/50">
          {invitation.message}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Date
            </p>
            <p className="text-sm font-medium">
              {format(new Date(invitation.eventDate), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Heure
            </p>
            <p className="text-sm font-medium">
              {format(new Date(invitation.eventDate), "HH'h'mm", { locale: fr })}
            </p>
          </div>
        </div>
      </CardContent>
      
      {invitation.status === "pending" && onAccept && onDecline && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" size="sm" onClick={() => onDecline(invitation.id)}>
            Refuser
          </Button>
          
          <Button size="sm" onClick={() => onAccept(invitation.id)}>
            Accepter
          </Button>
        </CardFooter>
      )}
      
      {invitation.status !== "pending" && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/club/${invitation.clubId}`}>
              Voir le club
            </Link>
          </Button>
          
          <Button size="sm" asChild>
            <Link to={`/event/${invitation.eventId}`}>
              Voir l'événement
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}