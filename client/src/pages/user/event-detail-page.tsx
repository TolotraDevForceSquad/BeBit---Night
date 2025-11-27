import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Euro, Edit, Trash2, Share2, MessageSquare } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
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
  clubAddress?: string;
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
  comments: Array<{
    id: number;
    userId: number;
    username: string;
    userImage?: string;
    text: string;
    date: string;
  }>;
};

// Données fictives des événements
const mockEvents: UserEvent[] = [
  {
    id: 1001,
    title: "Soirée Techno au Club Oxygen",
    description: "Une sortie entre amis pour découvrir les nouveaux DJ de la scène techno. On se retrouve directement au club, table réservée au nom de Thomas. Dress code: noir/blanc, ambiance décontractée mais stylée.",
    date: "2023-12-25T22:00:00",
    clubId: 101,
    clubName: "Club Oxygen",
    clubLocation: "Paris, France",
    clubAddress: "14 Rue de la Nuit, 75001 Paris",
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
    ],
    comments: [
      {
        id: 1,
        userId: 2,
        username: "sophie78",
        userImage: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Super idée ! Je suis trop impatiente de découvrir ce club, j'ai entendu de bons échos.",
        date: "2023-12-01T14:30:00"
      },
      {
        id: 2,
        userId: 3,
        username: "thomasb",
        userImage: "https://randomuser.me/api/portraits/men/67.jpg",
        text: "Est-ce qu'on se retrouve quelque part avant ou directement au club ?",
        date: "2023-12-02T18:45:00"
      },
      {
        id: 3,
        userId: 1,
        username: "user1",
        userImage: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "On se retrouve directement au club vers 22h30, j'ai déjà réservé une table.",
        date: "2023-12-03T09:15:00"
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
    clubAddress: "22 Avenue des Lumières, 69001 Lyon",
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
    ],
    comments: [
      {
        id: 4,
        userId: 6,
        username: "julie87",
        userImage: "https://randomuser.me/api/portraits/women/32.jpg",
        text: "C'était super ! On remet ça bientôt ?",
        date: "2023-10-16T10:20:00"
      }
    ]
  }
];

export default function EventDetailPage() {
  const [, params] = useRoute("/user/events/:id");
  const eventId = params?.id ? parseInt(params.id) : null;
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [event, setEvent] = useState<UserEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [newParticipant, setNewParticipant] = useState("");
  const [isJoiningEvent, setIsJoiningEvent] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  
  const { toast } = useToast();
  
  // Vérifier si l'utilisateur est l'organisateur
  const isOrganizer = user?.username === event?.createdBy.username;
  
  // Vérifier si l'utilisateur participe déjà
  const isParticipant = event?.participants.some(p => p.username === user?.username);
  
  // Vérifier si l'événement est complet
  const isEventFull = event ? event.currentParticipants >= event.maxParticipants : false;
  
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
    
    // Simuler un chargement des données de l'événement
    if (eventId) {
      setTimeout(() => {
        const foundEvent = mockEvents.find(e => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        }
        setIsLoading(false);
      }, 500);
    }
  }, [eventId]);

  // Gérer l'ajout d'un commentaire
  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    
    setIsAddingComment(true);
    
    // Simuler l'ajout d'un commentaire
    setTimeout(() => {
      if (event) {
        const newCommentObj = {
          id: Date.now(),
          userId: 1, // ID fictif pour l'utilisateur actuel
          username: user.username,
          userImage: user.profileImage,
          text: newComment,
          date: new Date().toISOString()
        };
        
        setEvent({
          ...event,
          comments: [...event.comments, newCommentObj]
        });
        
        setNewComment("");
        setIsAddingComment(false);
        
        toast({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été publié avec succès.",
        });
      }
    }, 1000);
  };
  
  // Gérer la participation à l'événement
  const handleJoinEvent = () => {
    if (!user || isParticipant || isEventFull) return;
    
    setIsJoiningEvent(true);
    
    // Simuler la participation à l'événement
    setTimeout(() => {
      if (event) {
        const newParticipant = {
          id: Date.now(),
          username: user.username,
          profileImage: user.profileImage,
          status: "confirmed" as const
        };
        
        setEvent({
          ...event,
          participants: [...event.participants, newParticipant],
          currentParticipants: event.currentParticipants + 1
        });
        
        setIsJoiningEvent(false);
        
        toast({
          title: "Vous participez !",
          description: "Vous avez rejoint cette sortie avec succès.",
        });
      }
    }, 1000);
  };
  
  // Gérer l'invitation d'un ami
  const handleInviteFriend = () => {
    if (!newParticipant.trim()) return;
    
    setIsInviting(true);
    
    // Simuler l'invitation
    setTimeout(() => {
      toast({
        title: "Invitation envoyée",
        description: `${newParticipant} a été invité(e) à cette sortie.`,
      });
      
      setNewParticipant("");
      setIsInviting(false);
    }, 1000);
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/user/events">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">{event?.title || "Détails de la sortie"}</h1>
    </div>
  );

  if (isLoading) {
    return (
      <ResponsiveLayout activeItem="explore" headerContent={headerContent}>
        <LoadingSpinner message="Chargement des détails de l'événement..." />
      </ResponsiveLayout>
    );
  }

  if (!event) {
    return (
      <ResponsiveLayout activeItem="explore" headerContent={headerContent}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-bold mb-2">Événement introuvable</h2>
          <p className="text-muted-foreground mb-4">
            L'événement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link to="/user/events">Retour aux événements</Link>
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeItem="explore" headerContent={headerContent}>
      <div className="space-y-6 pb-10">
        {/* Image de couverture */}
        <div className="relative h-40 md:h-60 w-full bg-center bg-cover rounded-lg overflow-hidden mb-4">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <div className="flex items-center text-sm opacity-90">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.clubName}, {event.clubLocation}</span>
            </div>
          </div>
          
          {isOrganizer && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="outline" size="sm" asChild className="bg-black/30 text-white border-white/30 hover:bg-black/50 hover:text-white">
                <Link to={`/user/events/${event.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="bg-red-500/80 hover:bg-red-500">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette sortie ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Tous les participants seront notifiés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Badge variant="outline" className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              {format(new Date(event.date), "EEEE d MMMM", { locale: fr })}
            </Badge>
            
            <Badge variant="outline" className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              {format(new Date(event.date), "HH'h'mm", { locale: fr })}
            </Badge>
            
            <Badge variant="outline" className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              {event.currentParticipants}/{event.maxParticipants} participants
            </Badge>
            
            {event.contribution > 0 && (
              <Badge variant="outline" className="flex items-center text-sm">
                <Euro className="h-4 w-4 mr-1 text-muted-foreground" />
                {event.contribution} € / personne
              </Badge>
            )}
            
            {event.isPrivate && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                Événement privé
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </Button>
            
            {!isOrganizer && !isParticipant && !isEventFull && (
              <Button size="sm" onClick={handleJoinEvent} disabled={isJoiningEvent}>
                {isJoiningEvent ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-1 border-2 border-current border-t-transparent rounded-full" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-1" />
                    Participer
                  </>
                )}
              </Button>
            )}
            
            {!isOrganizer && !isParticipant && isEventFull && (
              <Button size="sm" disabled>
                Complet
              </Button>
            )}
            
            {isParticipant && !isOrganizer && (
              <Button size="sm" variant="destructive">
                <Users className="h-4 w-4 mr-1" />
                Ne plus participer
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Contenu principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">Détails</TabsTrigger>
            <TabsTrigger value="participants" className="flex-1">
              Participants ({event.participants.length})
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex-1">
              Discussion ({event.comments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Colonne de gauche - détails */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de cette sortie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{event.description}</p>
                  </CardContent>
                </Card>
                
                {/* Club / Lieu */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lieu de l'événement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      {event.clubImage ? (
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={event.clubImage} 
                            alt={event.clubName} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-bold text-lg">{event.clubName}</h3>
                        <p className="text-muted-foreground">{event.clubLocation}</p>
                        {event.clubAddress && (
                          <p className="text-sm">{event.clubAddress}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img 
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.clubLocation)}&zoom=14&size=600x300&markers=${encodeURIComponent(event.clubLocation)}&key=DUMMY_KEY`}
                        alt="Map location"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x300?text=Map+Placeholder";
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Colonne de droite - organisateur et actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organisateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={event.createdBy.profileImage} 
                          alt={event.createdBy.username} 
                        />
                        <AvatarFallback>
                          {event.createdBy.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">{event.createdBy.username}</p>
                        <p className="text-xs text-muted-foreground">Organisateur</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Participants rapide */}
                <Card>
                  <CardHeader>
                    <CardTitle>Participants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {event.currentParticipants}/{event.maxParticipants} places
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round((event.currentParticipants / event.maxParticipants) * 100)}%
                        </span>
                      </div>
                      <Progress value={(event.currentParticipants / event.maxParticipants) * 100} />
                    </div>
                    
                    {event.participants.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.participants.slice(0, 8).map((participant) => (
                          <Avatar key={participant.id}>
                            <AvatarImage 
                              src={participant.profileImage} 
                              alt={participant.username} 
                            />
                            <AvatarFallback>
                              {participant.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        
                        {event.participants.length > 8 && (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm">
                            +{event.participants.length - 8}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {(isOrganizer || isParticipant) && !isEventFull && (
                      <div className="pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full" size="sm">
                              <Users className="h-4 w-4 mr-1" />
                              Inviter des amis
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Inviter des amis</DialogTitle>
                              <DialogDescription>
                                Invitez des amis à rejoindre cette sortie.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="friend">Nom d'utilisateur ou email</Label>
                                <Input
                                  id="friend"
                                  placeholder="Ex: alex123 ou alex@example.com"
                                  value={newParticipant}
                                  onChange={(e) => setNewParticipant(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setNewParticipant("")}>
                                Annuler
                              </Button>
                              <Button onClick={handleInviteFriend} disabled={isInviting || !newParticipant.trim()}>
                                {isInviting ? "Envoi en cours..." : "Inviter"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des participants ({event.participants.length})</CardTitle>
                  {(isOrganizer || isParticipant) && !isEventFull && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Inviter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Inviter des amis</DialogTitle>
                          <DialogDescription>
                            Invitez des amis à rejoindre cette sortie.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="friend-name">Nom d'utilisateur ou email</Label>
                            <Input
                              id="friend-name"
                              placeholder="Ex: alex123 ou alex@example.com"
                              value={newParticipant}
                              onChange={(e) => setNewParticipant(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setNewParticipant("")}>
                            Annuler
                          </Button>
                          <Button onClick={handleInviteFriend} disabled={isInviting || !newParticipant.trim()}>
                            {isInviting ? "Envoi en cours..." : "Inviter"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {event.participants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-1">Aucun participant</h3>
                    <p className="text-sm text-muted-foreground">
                      Personne n'a encore rejoint cette sortie.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {event.participants.map((participant) => (
                      <div key={participant.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage 
                              src={participant.profileImage} 
                              alt={participant.username} 
                            />
                            <AvatarFallback>
                              {participant.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <p className="font-medium">{participant.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {participant.username === event.createdBy.username 
                                ? "Organisateur" 
                                : "Participant"}
                            </p>
                          </div>
                        </div>
                        
                        {isOrganizer && participant.username !== event.createdBy.username && (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Retirer</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discussion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-1">Aucun message</h3>
                    <p className="text-sm text-muted-foreground">
                      Soyez le premier à démarrer la conversation !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {event.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage 
                            src={comment.userImage} 
                            alt={comment.username} 
                          />
                          <AvatarFallback>
                            {comment.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{comment.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(comment.date), "d MMM yyyy, HH'h'mm", { locale: fr })}
                            </p>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {(isOrganizer || isParticipant) && (
                  <div className="pt-4 space-y-2">
                    <Textarea
                      placeholder="Écrivez un message..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        onClick={handleAddComment}
                        disabled={isAddingComment || !newComment.trim()}
                      >
                        {isAddingComment ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-1 border-2 border-current border-t-transparent rounded-full" />
                            Envoi...
                          </>
                        ) : (
                          "Envoyer"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}