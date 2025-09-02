import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format, isPast, isFuture } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Plus, Euro, Edit, Trash2, Eye, Share2, Heart, X, Settings, Navigation } from "lucide-react";
import UserLayout from "@/layouts/user-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les événements créés par l'utilisateur
type UserEvent = {
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
  createdBy: {
    id: number;
    username: string;
    profileImage?: string;
  };
  participants: Array<{
    id: number;
    username: string;
    profileImage?: string;
    status: "confirmed" | "pending";
  }>;
};

// Type pour les invitations reçues
type EventInvitation = {
  id: number;
  eventId: number;
  event: UserEvent;
  status: "pending" | "accepted" | "declined";
  invitedBy: {
    id: number;
    username: string;
    profileImage?: string;
  };
  invitedAt: string;
};

// Données fictives pour les événements
const mockMyEvents: UserEvent[] = [
  {
    id: 1001,
    title: "Soirée Techno au Club Oxygen",
    description: "Une sortie entre amis pour découvrir les nouveaux DJ de la scène techno",
    date: "2023-12-25T22:00:00",
    clubId: 101,
    clubName: "Club Oxygen",
    clubLocation: "Paris, France",
    clubImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    maxParticipants: 10,
    currentParticipants: 3,
    contribution: 15,
    isPrivate: false,
    createdBy: {
      id: 1,
      username: "user1",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    participants: [
      {
        id: 2,
        username: "sophie78",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "confirmed"
      },
      {
        id: 3,
        username: "thomasb",
        profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
        status: "confirmed"
      },
      {
        id: 4,
        username: "marie_p",
        profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
        status: "pending"
      }
    ]
  },
  {
    id: 1002,
    title: "After Work House Music",
    description: "Détendons-nous après le travail avec de la bonne musique house et des cocktails",
    date: "2023-10-15T19:00:00",
    clubId: 102,
    clubName: "Le Loft",
    clubLocation: "Lyon, France",
    clubImage: "https://images.unsplash.com/photo-1578760427650-9645a33f4e1b?q=80&w=1000",
    maxParticipants: 8,
    currentParticipants: 8,
    contribution: 0,
    isPrivate: true,
    createdBy: {
      id: 1,
      username: "user1",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    participants: [
      {
        id: 2,
        username: "sophie78",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "confirmed"
      },
      {
        id: 3,
        username: "thomasb",
        profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
        status: "confirmed"
      },
      {
        id: 5,
        username: "alex_d",
        profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
        status: "confirmed"
      },
      {
        id: 6,
        username: "julie87",
        profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
        status: "confirmed"
      },
      {
        id: 7,
        username: "paulr",
        profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
        status: "confirmed"
      },
      {
        id: 8,
        username: "emma_l",
        profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
        status: "confirmed"
      },
      {
        id: 9,
        username: "lucas_m",
        profileImage: "https://randomuser.me/api/portraits/men/76.jpg",
        status: "confirmed"
      }
    ]
  }
];

const mockInvitedEvents: EventInvitation[] = [
  {
    id: 2001,
    eventId: 1003,
    event: {
      id: 1003,
      title: "Soirée DJ Battle",
      description: "Venez assister à une battle de DJ exceptionnelle",
      date: "2023-12-22T23:00:00",
      clubId: 103,
      clubName: "Warehouse",
      clubLocation: "Marseille, France",
      clubImage: "https://images.unsplash.com/photo-1577201561968-fd58f12e8dcd?q=80&w=1000",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
      maxParticipants: 15,
      currentParticipants: 6,
      contribution: 10,
      isPrivate: false,
      createdBy: {
        id: 3,
        username: "thomasb",
        profileImage: "https://randomuser.me/api/portraits/men/67.jpg"
      },
      participants: []
    },
    status: "pending",
    invitedBy: {
      id: 3,
      username: "thomasb",
      profileImage: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    invitedAt: "2023-12-05T14:30:00"
  },
  {
    id: 2002,
    eventId: 1004,
    event: {
      id: 1004,
      title: "Jazz Night",
      description: "Une soirée jazz relaxante au Blue Note",
      date: "2023-11-10T20:00:00",
      clubId: 104,
      clubName: "Blue Note",
      clubLocation: "Bordeaux, France",
      clubImage: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=1000",
      maxParticipants: 12,
      currentParticipants: 8,
      contribution: 5,
      isPrivate: true,
      createdBy: {
        id: 2,
        username: "sophie78",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      participants: []
    },
    status: "accepted",
    invitedBy: {
      id: 2,
      username: "sophie78",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    invitedAt: "2023-10-29T11:20:00"
  }
];

export default function EventsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [myEvents, setMyEvents] = useState<UserEvent[]>([]);
  const [invitedEvents, setInvitedEvents] = useState<EventInvitation[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  
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
    
    // Simuler un chargement des données
    setMyEvents(mockMyEvents);
    setInvitedEvents(mockInvitedEvents);
  }, []);

  // Filtrer les événements selon l'onglet actif
  const getFilteredEvents = () => {
    const now = new Date();
    
    // Filtrer mes événements
    const filteredMyEvents = myEvents.filter(event => {
      const eventDate = new Date(event.date);
      if (activeTab === "upcoming") {
        return isFuture(eventDate);
      } else if (activeTab === "past") {
        return isPast(eventDate);
      }
      return true;
    });
    
    // Filtrer les événements sur invitation
    const filteredInvitations = invitedEvents.filter(invitation => {
      if (invitation.status !== "accepted") return false;
      
      const eventDate = new Date(invitation.event.date);
      if (activeTab === "upcoming") {
        return isFuture(eventDate);
      } else if (activeTab === "past") {
        return isPast(eventDate);
      }
      return true;
    });
    
    return {
      myEvents: filteredMyEvents,
      invitedEvents: filteredInvitations
    };
  };

  const filteredEvents = getFilteredEvents();
  
  // Gérer les invitations
  const handleInvitation = (id: number, status: "accepted" | "declined") => {
    setInvitedEvents(invitedEvents.map(invitation => 
      invitation.id === id ? { ...invitation, status } : invitation
    ));
  };
  
  // Supprimer un événement
  const handleDeleteEvent = (id: number) => {
    setMyEvents(myEvents.filter(event => event.id !== id));
  };

  // Le header content n'est pas utilisé car on utilise UserLayout

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mes sorties</h1>
          </div>
          
          <Button asChild>
            <Link to="/user/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Créer une sortie
            </Link>
          </Button>
        </div>
        
        {/* Invitations en attente */}
        {invitedEvents.filter(inv => inv.status === "pending").length > 0 && (
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <h2 className="font-semibold">Invitations en attente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invitedEvents
                .filter(inv => inv.status === "pending")
                .map(invitation => (
                  <Card key={invitation.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
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
                              vous invite à rejoindre une sortie
                            </p>
                            <h3 className="font-bold">{invitation.event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(invitation.event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                              {" • "}
                              {invitation.event.clubName}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="p-3 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleInvitation(invitation.id, "declined")}
                        >
                          Refuser
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleInvitation(invitation.id, "accepted")}
                        >
                          Accepter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="upcoming" className="flex-1">À venir</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">Passés</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredEvents.myEvents.length === 0 && filteredEvents.invitedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas de sorties {activeTab === "upcoming" ? "à venir" : "passées"}
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === "upcoming" 
                    ? "Vous n'avez pas encore créé ou rejoint de sorties à venir"
                    : "Vous n'avez pas encore créé ou participé à des sorties"}
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/user/events/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une sortie
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Événements créés par l'utilisateur */}
                {filteredEvents.myEvents.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Sorties que j'organise</h2>
                    
                    {/* Affichage mode grille (version traditionnelle) - visible seulement en desktop */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredEvents.myEvents.map(event => (
                        <UserEventCard 
                          key={event.id} 
                          event={event} 
                          isOrganizer={true}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      ))}
                    </div>

                    {/* Affichage mode Tinder (swipe) - visible seulement sur mobile */}
                    <div className="md:hidden">
                      {/* Barre de progression */}
                      <div className="flex mb-2">
                        {filteredEvents.myEvents.slice(0, Math.min(5, filteredEvents.myEvents.length)).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full mx-0.5 ${
                              i === currentEventIndex ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Card principale avec boutons d'action */}
                      <div className="relative h-[calc(100vh-380px)] mb-2">
                        {filteredEvents.myEvents.length > 0 && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden border border-border">
                            <div 
                              className="w-full h-full bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${filteredEvents.myEvents[currentEventIndex]?.imageUrl || 
                                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000"})`
                              }}
                            >
                              {/* Badge Organisateur */}
                              <div className="absolute top-3 left-3 bg-primary/80 text-white px-2 py-1 rounded-md text-xs font-semibold">
                                Organisateur
                              </div>
                              
                              {/* Dégradé pour rendre le texte lisible */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              
                              {/* Contenu de la carte */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-xl font-bold mb-1">{filteredEvents.myEvents[currentEventIndex]?.title}</h3>
                                <div className="flex items-center mb-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{filteredEvents.myEvents[currentEventIndex]?.clubName}, {filteredEvents.myEvents[currentEventIndex]?.clubLocation}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    {format(new Date(filteredEvents.myEvents[currentEventIndex]?.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                      {filteredEvents.myEvents[currentEventIndex]?.currentParticipants}/{filteredEvents.myEvents[currentEventIndex]?.maxParticipants} participants
                                    </span>
                                  </div>
                                  {filteredEvents.myEvents[currentEventIndex]?.contribution > 0 && (
                                    <Badge className="bg-primary">
                                      <Euro className="h-3 w-3 mr-1" />
                                      {filteredEvents.myEvents[currentEventIndex]?.contribution} Ar
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Boutons d'action style Tinder - adaptés pour mes sorties */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-10">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-orange-500 hover:bg-orange-50"
                            onClick={() => {
                              if (currentEventIndex > 0) {
                                setCurrentEventIndex(currentEventIndex - 1);
                              }
                            }}
                          >
                            <Calendar className="h-6 w-6 text-orange-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-blue-500 hover:bg-blue-50"
                            onClick={() => {
                              // Rediriger vers la page d'édition
                              window.location.href = `/user/events/${filteredEvents.myEvents[currentEventIndex]?.id}/edit`;
                            }}
                          >
                            <Edit className="h-8 w-8 text-blue-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-green-500 hover:bg-green-50"
                            onClick={() => {
                              alert("Sortie partagée !");
                              // Passer à l'événement suivant
                              if (currentEventIndex < filteredEvents.myEvents.length - 1) {
                                setCurrentEventIndex(currentEventIndex + 1);
                              }
                            }}
                          >
                            <Share2 className="h-8 w-8 text-green-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-red-500 hover:bg-red-50"
                            onClick={() => {
                              // Confirmation de suppression
                              if (confirm("Êtes-vous sûr de vouloir supprimer cette sortie ?")) {
                                handleDeleteEvent(filteredEvents.myEvents[currentEventIndex]?.id);
                              }
                            }}
                          >
                            <Trash2 className="h-6 w-6 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Informations supplémentaires */}
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Détails de la sortie</h4>
                          <p className="text-xs text-muted-foreground">
                            {filteredEvents.myEvents[currentEventIndex]?.description}
                          </p>
                          
                          {filteredEvents.myEvents[currentEventIndex]?.participants.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium mt-3 mb-1">Participants</h5>
                              <div className="flex -space-x-2 overflow-hidden">
                                {filteredEvents.myEvents[currentEventIndex]?.participants.slice(0, 5).map((participant) => (
                                  <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={participant.profileImage} alt={participant.username} />
                                    <AvatarFallback>{participant.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {(filteredEvents.myEvents[currentEventIndex]?.participants.length || 0) > 5 && (
                                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                    +{(filteredEvents.myEvents[currentEventIndex]?.participants.length || 0) - 5}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Événements auxquels l'utilisateur participe - version Tinder */}
                {filteredEvents.invitedEvents.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h2 className="font-semibold text-lg">Sorties auxquelles je participe</h2>
                    
                    {/* Affichage mode grille (version traditionnelle) - visible seulement en desktop */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredEvents.invitedEvents.map(invitation => (
                        <UserEventCard 
                          key={invitation.event.id} 
                          event={invitation.event} 
                          isOrganizer={false}
                        />
                      ))}
                    </div>
                    
                    {/* Affichage mode Tinder (swipe) - visible seulement sur mobile */}
                    <div className="md:hidden">
                      {/* Barre de progression */}
                      <div className="flex mb-2">
                        {filteredEvents.invitedEvents.slice(0, Math.min(5, filteredEvents.invitedEvents.length)).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full mx-0.5 ${
                              i === currentEventIndex ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Card principale avec boutons d'action */}
                      <div className="relative h-[calc(100vh-380px)] mb-2">
                        {filteredEvents.invitedEvents.length > 0 && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden border border-border">
                            <div 
                              className="w-full h-full bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${filteredEvents.invitedEvents[currentEventIndex]?.event.imageUrl || 
                                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000"})`
                              }}
                            >
                              {/* Dégradé pour rendre le texte lisible */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              
                              {/* Contenu de la carte */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-xl font-bold mb-1">{filteredEvents.invitedEvents[currentEventIndex]?.event.title}</h3>
                                <div className="flex items-center mb-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{filteredEvents.invitedEvents[currentEventIndex]?.event.clubName}, {filteredEvents.invitedEvents[currentEventIndex]?.event.clubLocation}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    {format(new Date(filteredEvents.invitedEvents[currentEventIndex]?.event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                      {filteredEvents.invitedEvents[currentEventIndex]?.event.currentParticipants}/{filteredEvents.invitedEvents[currentEventIndex]?.event.maxParticipants} participants
                                    </span>
                                  </div>
                                  {filteredEvents.invitedEvents[currentEventIndex]?.event.contribution > 0 && (
                                    <Badge className="bg-primary">
                                      <Euro className="h-3 w-3 mr-1" />
                                      {filteredEvents.invitedEvents[currentEventIndex]?.event.contribution} Ar
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Boutons d'action style Tinder */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-10">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-orange-500 hover:bg-orange-50"
                            onClick={() => {
                              if (currentEventIndex > 0) {
                                setCurrentEventIndex(currentEventIndex - 1);
                              }
                            }}
                          >
                            <Calendar className="h-6 w-6 text-orange-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-red-500 hover:bg-red-50"
                            onClick={() => {
                              // Passer à l'événement suivant
                              if (currentEventIndex < filteredEvents.invitedEvents.length - 1) {
                                setCurrentEventIndex(currentEventIndex + 1);
                              } else {
                                // Afficher un message si plus d'événements
                                alert("Vous avez parcouru toutes les sorties disponibles !");
                              }
                            }}
                          >
                            <X className="h-8 w-8 text-red-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-green-500 hover:bg-green-50"
                            onClick={() => {
                              console.log("Liked event", filteredEvents.invitedEvents[currentEventIndex]?.event.id);
                              // Passer à l'événement suivant
                              if (currentEventIndex < filteredEvents.invitedEvents.length - 1) {
                                setCurrentEventIndex(currentEventIndex + 1);
                              } else {
                                // Afficher un message si plus d'événements
                                alert("Vous avez parcouru toutes les sorties disponibles !");
                              }
                            }}
                          >
                            <Heart className="h-8 w-8 text-green-500" />
                          </Button>
                          
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-blue-500 hover:bg-blue-50"
                            onClick={() => {
                              alert("Sortie partagée !");
                            }}
                          >
                            <Share2 className="h-6 w-6 text-blue-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Informations supplémentaires */}
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <h4 className="font-medium text-sm mb-2">Organisé par</h4>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage 
                              src={filteredEvents.invitedEvents[currentEventIndex]?.event.createdBy.profileImage} 
                              alt={filteredEvents.invitedEvents[currentEventIndex]?.event.createdBy.username} 
                            />
                            <AvatarFallback>
                              {filteredEvents.invitedEvents[currentEventIndex]?.event.createdBy.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{filteredEvents.invitedEvents[currentEventIndex]?.event.createdBy.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}

// Composant pour afficher un événement
interface UserEventCardProps {
  event: UserEvent;
  isOrganizer: boolean;
  onDelete?: () => void;
}

function UserEventCard({ event, isOrganizer, onDelete }: UserEventCardProps) {
  const eventDate = new Date(event.date);
  const isPastEvent = isPast(eventDate);
  const formattedDate = format(eventDate, "EEEE d MMMM", { locale: fr });
  const formattedTime = format(eventDate, "HH'h'mm", { locale: fr });
  const participantPercentage = (event.currentParticipants / event.maxParticipants) * 100;
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        {event.imageUrl && (
          <div 
            className="h-40 w-full bg-center bg-cover"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${event.imageUrl})` 
            }}
          >
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="flex items-center text-sm opacity-90">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{event.clubName}</span>
              </div>
            </div>
            
            {isOrganizer && !isPastEvent && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-black/30 hover:bg-black/40 text-white"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/user/events/${event.id}/edit`} className="flex items-center cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center cursor-pointer">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </div>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                        <div className="flex items-center cursor-pointer">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </div>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette sortie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. La sortie sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
        
        {!event.imageUrl && (
          <div className="h-40 w-full bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="flex items-center justify-center text-sm opacity-90">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{event.clubName}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="py-4 flex-1">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formattedTime}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.currentParticipants}/{event.maxParticipants} participants
                </span>
              </div>
              {event.contribution > 0 && (
                <Badge variant="outline" className="font-normal text-xs">
                  <Euro className="h-3 w-3 mr-1" />
                  {event.contribution} € / pers.
                </Badge>
              )}
            </div>
            <Progress value={participantPercentage} className="h-1" />
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          
          {event.participants.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Participants:</p>
              <div className="flex -space-x-2 overflow-hidden">
                {event.participants.slice(0, 6).map((participant) => (
                  <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={participant.profileImage} alt={participant.username} />
                    <AvatarFallback>{participant.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {event.participants.length > 6 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{event.participants.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-3 mt-auto">
        <div className="w-full flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/user/events/${event.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Voir détails
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}