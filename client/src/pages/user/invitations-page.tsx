import { useState } from "react";
import { Bell, Check, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";

// Types
type Invitation = {
  id: number;
  eventId: number;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    clubId: number;
    clubName: string;
    clubLocation: string;
    clubImage?: string;
    imageUrl?: string;
    maxParticipants: number;
    currentParticipants: number;
    contribution: number;
    isPrivate: boolean;
    createdAt: string;
  };
  status: "pending" | "accepted" | "declined";
  invitedBy: {
    id: number;
    username: string;
    profileImage?: string;
  };
  invitedAt: string;
};

export default function InvitationsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");
  
  // Données simulées pour les invitations
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 1,
      eventId: 1,
      event: {
        id: 1,
        title: "After-work Jazz & Cocktails",
        description: "Rejoignez-nous pour une soirée décontractée avec du jazz live et des cocktails exquis.",
        date: "2023-06-15T19:00:00Z",
        clubId: 1,
        clubName: "Le Blue Note",
        clubLocation: "Antananarivo, MG",
        imageUrl: "https://images.unsplash.com/photo-1602025239586-46f9a046f73f?q=80&w=1000",
        maxParticipants: 20,
        currentParticipants: 12,
        contribution: 15000,
        isPrivate: true,
        createdAt: "2023-06-01T10:00:00Z"
      },
      status: "pending",
      invitedBy: {
        id: 2,
        username: "marie_claire",
        profileImage: "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=250&h=250&auto=format&fit=crop"
      },
      invitedAt: "2023-06-10T14:30:00Z"
    },
    {
      id: 2,
      eventId: 2,
      event: {
        id: 2,
        title: "Soirée House & Techno",
        description: "Une nuit complète dédiée à la house et la techno avec des DJs internationaux.",
        date: "2023-06-20T22:00:00Z",
        clubId: 2,
        clubName: "Klub Elektronica",
        clubLocation: "Antananarivo, MG",
        imageUrl: "https://images.unsplash.com/photo-1571266163388-8a8d891f85f5?q=80&w=1000",
        maxParticipants: 50,
        currentParticipants: 35,
        contribution: 25000,
        isPrivate: false,
        createdAt: "2023-06-05T10:00:00Z"
      },
      status: "accepted",
      invitedBy: {
        id: 3,
        username: "dj_thomas",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&auto=format&fit=crop"
      },
      invitedAt: "2023-06-12T09:15:00Z"
    },
    {
      id: 3,
      eventId: 3,
      event: {
        id: 3,
        title: "Hip-Hop Anniversary",
        description: "Célébrons l'anniversaire du club avec une soirée hip-hop all night long.",
        date: "2023-06-25T21:00:00Z",
        clubId: 3,
        clubName: "Basement Club",
        clubLocation: "Antananarivo, MG",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
        maxParticipants: 100,
        currentParticipants: 65,
        contribution: 20000,
        isPrivate: false,
        createdAt: "2023-06-08T10:00:00Z"
      },
      status: "declined",
      invitedBy: {
        id: 4,
        username: "alex_promoter",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop"
      },
      invitedAt: "2023-06-14T17:45:00Z"
    },
    {
      id: 4,
      eventId: 4,
      event: {
        id: 4,
        title: "Festival Pre-Party",
        description: "Échauffement officiel avant le grand festival de musique électronique du week-end.",
        date: "2023-06-28T20:00:00Z",
        clubId: 2,
        clubName: "Klub Elektronica",
        clubLocation: "Antananarivo, MG",
        imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000",
        maxParticipants: 75,
        currentParticipants: 40,
        contribution: 30000,
        isPrivate: true,
        createdAt: "2023-06-15T10:00:00Z"
      },
      status: "pending",
      invitedBy: {
        id: 5,
        username: "festival_team",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop"
      },
      invitedAt: "2023-06-20T13:20:00Z"
    }
  ]);

  // Filtrer les invitations selon l'onglet actif
  const filteredInvitations = invitations.filter(invitation => {
    if (activeTab === "pending") return invitation.status === "pending";
    if (activeTab === "accepted") return invitation.status === "accepted";
    if (activeTab === "declined") return invitation.status === "declined";
    return true;
  });

  // Fonction pour accepter une invitation
  const handleAcceptInvitation = (invitationId: number) => {
    setInvitations(invitations.map(invitation => 
      invitation.id === invitationId 
        ? { ...invitation, status: "accepted" } 
        : invitation
    ));
    
    toast({
      title: "Invitation acceptée",
      description: "Vous avez accepté l'invitation à cet événement.",
      variant: "default",
    });
  };

  // Fonction pour refuser une invitation
  const handleDeclineInvitation = (invitationId: number) => {
    setInvitations(invitations.map(invitation => 
      invitation.id === invitationId 
        ? { ...invitation, status: "declined" } 
        : invitation
    ));
    
    toast({
      title: "Invitation refusée",
      description: "Vous avez refusé l'invitation à cet événement.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Bell className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Mes invitations</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="pending" className="flex-1">
            En attente 
            {invitations.filter(inv => inv.status === "pending").length > 0 && (
              <Badge className="ml-2 bg-primary">{invitations.filter(inv => inv.status === "pending").length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex-1">Acceptées</TabsTrigger>
          <TabsTrigger value="declined" className="flex-1">Refusées</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredInvitations.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Pas d'invitations {activeTab === "pending" ? "en attente" : activeTab === "accepted" ? "acceptées" : "refusées"}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === "pending" 
                  ? "Vous n'avez pas d'invitations en attente de réponse."
                  : activeTab === "accepted"
                  ? "Vous n'avez pas encore accepté d'invitations."
                  : "Vous n'avez pas encore refusé d'invitations."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvitations.map((invitation) => (
                <Card key={invitation.id} className="overflow-hidden">
                  <div className="h-32 w-full bg-cover bg-center relative" 
                    style={{ 
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${invitation.event.imageUrl})` 
                    }}>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="font-bold text-lg">{invitation.event.title}</h3>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{invitation.event.clubName}</span>
                      </div>
                    </div>
                    
                    {/* Badge du statut */}
                    <div className="absolute top-3 right-3">
                      {invitation.status === "pending" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600">En attente</Badge>
                      )}
                      {invitation.status === "accepted" && (
                        <Badge className="bg-green-500 hover:bg-green-600">Acceptée</Badge>
                      )}
                      {invitation.status === "declined" && (
                        <Badge className="bg-red-500 hover:bg-red-600">Refusée</Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar>
                        <AvatarImage 
                          src={invitation.invitedBy.profileImage} 
                          alt={invitation.invitedBy.username} 
                        />
                        <AvatarFallback>
                          {invitation.invitedBy.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{invitation.invitedBy.username}</span>{" "}
                          vous a invité à rejoindre cet événement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Invité le {format(new Date(invitation.invitedAt), "d MMMM à HH'h'mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {format(new Date(invitation.event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {invitation.event.description}
                    </p>
                    
                    {invitation.status === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeclineInvitation(invitation.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptInvitation(invitation.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                      </div>
                    )}
                    
                    {invitation.status !== "pending" && (
                      <div className="flex justify-end">
                        <Button size="sm" asChild variant="outline">
                          <a href={`/user/events/${invitation.event.id}`}>
                            Voir les détails
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}