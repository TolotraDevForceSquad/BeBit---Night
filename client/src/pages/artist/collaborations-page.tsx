import { useState, useEffect } from "react";
import { 
  CalendarDays, Clock, PieChart, CheckCircle2, CircleDashed, 
  ArrowUpDown, Filter, Search, CalendarRange, Users, MessageSquare, 
  Mic2, Timer, MapPin, ChevronsUpDown, TrendingUp, AlertCircle, X
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Services pour récupérer les vraies données
import {
  useInvitations,
  useEvents,
  useCollaborationMessages,
  useCollaborationMilestones,
  useUsers,
  createCollaborationMessage,
  updateCollaborationMilestone,
  getArtistByUserId
} from "@/services/servapi";

// Types pour les données réelles
type AuthUser = {
  id: number;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

type InvitationStatus = 
  | "pending" 
  | "accepted"
  | "rejected"
  | "confirmed" 
  | "preparation" 
  | "completed" 
  | "cancelled"
  | "declined"
  | "negotiation";

type MilestoneStatus = "pending" | "in_progress" | "completed";

type CollaborationMilestone = {
  id: number;
  invitationId: number;
  title: string;
  description: string;
  dueDate?: string;
  status: MilestoneStatus;
  completedAt?: string;
  assignedTo: "artist" | "club" | "both";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

type CollaborationMessage = {
  id: number;
  invitationId: number;
  senderType: "club" | "artist";
  senderId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type Invitation = {
  id: number;
  eventId: number;
  userId: number;
  invitedById: number;
  status: InvitationStatus;
  description?: string;
  genre?: string;
  expectedAttendees: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

type Event = {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  coverImage?: string;
  price: number;
  participantCount: number;
  organizerId: number;
  organizerType: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
};

// Fonctions de formatage de date simplifiées
const formatDate = (dateString: string): string => {
  if (!dateString) return "Date non définie";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatShortDate = (dateString: string): string => {
  if (!dateString) return "Date non définie";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "Date non définie";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDayOfWeek = (dateString: string): string => {
  if (!dateString) return "Date non définie";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDistanceFromNow = (dateString: string): string => {
  if (!dateString) return "Date non définie";
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) return "Date invalide";
  
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  if (diffDays === -1) return "Hier";
  if (diffDays > 0) return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
  
  return formatShortDate(dateString);
};

// Fonction d'aide pour récupérer le statut textuel en français
const getStatusText = (status: InvitationStatus): string => {
  const statusMap: Record<InvitationStatus, string> = {
    pending: "En attente",
    accepted: "Accepté",
    rejected: "Rejeté",
    negotiation: "En négociation",
    confirmed: "Confirmé",
    preparation: "En préparation",
    completed: "Terminé",
    cancelled: "Annulé",
    declined: "Refusé"
  };
  return statusMap[status] || status;
};

// Fonction d'aide pour récupérer la couleur associée au statut
const getStatusColor = (status: InvitationStatus): string => {
  const colorMap: Record<InvitationStatus, string> = {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    negotiation: "bg-purple-100 text-purple-800 border-purple-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    preparation: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-slate-100 text-slate-800 border-slate-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    declined: "bg-red-100 text-red-800 border-red-200"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer le texte du statut des jalons
const getMilestoneStatusText = (status: MilestoneStatus): string => {
  const statusMap: Record<MilestoneStatus, string> = {
    pending: "À venir",
    in_progress: "En cours",
    completed: "Terminé"
  };
  return statusMap[status] || status;
};

// Fonction d'aide pour récupérer la couleur associée au statut des jalons
const getMilestoneStatusColor = (status: MilestoneStatus): string => {
  const colorMap: Record<MilestoneStatus, string> = {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-green-100 text-green-800 border-green-200"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer la priorité textuelle
const getPriorityText = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute"
  };
  return priorityMap[priority] || priority;
};

// Fonction d'aide pour récupérer la couleur associée à la priorité
const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };
  return colorMap[priority] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer l'attribution textuelle
const getAssignedToText = (assignedTo: string): string => {
  const assignedMap: Record<string, string> = {
    artist: "Artiste",
    club: "Club",
    both: "Les deux"
  };
  return assignedMap[assignedTo] || assignedTo;
};

export default function ArtistCollaborationsPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | null>(null);
  const [sortOrder, setSortOrder] = useState<'upcoming' | 'recent'>('upcoming');
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [message, setMessage] = useState("");
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});
  const [isSending, setIsSending] = useState(false);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setAuthUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Récupérer les données réelles
  const { data: invitations, loading: invitationsLoading, refetch: refetchInvitations } = useInvitations(
    { userId: authUser?.id }
  );

  const { data: events, loading: eventsLoading } = useEvents();

  const { data: messages, loading: messagesLoading, refetch: refetchMessages } = useCollaborationMessages(
    selectedInvitation?.id
  );

  const { data: milestones, loading: milestonesLoading, refetch: refetchMilestones } = useCollaborationMilestones(
    selectedInvitation?.id
  );

  const { data: users, loading: usersLoading } = useUsers();

  // Filtrer les invitations pour l'artiste connecté
  const artistInvitations = invitations?.filter(invitation => 
    invitation.userId === authUser?.id
  ) || [];

  // Filtrer les collaborations
  const filteredCollaborations = artistInvitations.filter(invitation => {
    // Filtre par onglet
    if (currentTab === "active") {
      return ["pending", "negotiation", "confirmed", "preparation", "accepted"].includes(invitation.status);
    } else if (currentTab === "completed") {
      return invitation.status === "completed";
    } else if (currentTab === "cancelled") {
      return ["cancelled", "rejected", "declined"].includes(invitation.status);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const event = events?.find(e => e.id === invitation.eventId);
      const clubUser = users?.find(u => u.id === invitation.invitedById);
      return (
        event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clubUser?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clubUser?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clubUser?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  }).sort((a, b) => {
    const eventA = events?.find(e => e.id === a.eventId);
    const eventB = events?.find(e => e.id === b.eventId);
    
    if (!eventA || !eventB) return 0;
    
    const dateA = new Date(eventA.date);
    const dateB = new Date(eventB.date);
    
    if (sortOrder === 'upcoming') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  // Récupérer les informations du club pour une invitation
  const getClubInfo = (invitation: Invitation) => {
    const clubUser = users?.find(user => user.id === invitation.invitedById);
    return {
      name: clubUser ? `${clubUser.firstName} ${clubUser.lastName}` : `Club #${invitation.invitedById}`,
      profileImage: clubUser?.profileImage,
      role: clubUser?.role || 'club'
    };
  };

  // Récupérer l'événement pour une invitation
  const getEventInfo = (invitation: Invitation) => {
    return events?.find(event => event.id === invitation.eventId);
  };

  // Récupérer les milestones pour une invitation
  const getInvitationMilestones = (invitation: Invitation) => {
    return milestones?.filter(milestone => milestone.invitationId === invitation.id) || [];
  };

  // Récupérer les messages pour une invitation
  const getInvitationMessages = (invitation: Invitation) => {
    return messages?.filter(message => message.invitationId === invitation.id) || [];
  };

  // Calculer la progression basée sur les milestones
  const calculateProgress = (milestones: CollaborationMilestone[]) => {
    if (!milestones || milestones.length === 0) return 0;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = milestones.length;
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  };

  // Calculer la prochaine étape pour une collaboration
  const getNextMilestone = (invitation: Invitation) => {
    const invitationMilestones = getInvitationMilestones(invitation);
    const pendingMilestones = invitationMilestones
      .filter(m => m.status === "pending" || m.status === "in_progress")
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      });
    
    return pendingMilestones[0];
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!selectedInvitation || !message.trim() || isSending || !authUser) return;

    setIsSending(true);
    try {
      await createCollaborationMessage({
        invitationId: selectedInvitation.id,
        senderType: "artist",
        senderId: authUser.id,
        content: message.trim()
      });

      setMessage("");
      await refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Mettre à jour un milestone
  const handleUpdateMilestone = async (milestoneId: number, updates: Partial<CollaborationMilestone>) => {
    if (!selectedInvitation) return;

    try {
      const milestone = milestones?.find(m => m.id === milestoneId);
      if (!milestone) return;

      // Vérifier les permissions pour cocher comme "completed"
      if (updates.status === 'completed') {
        const canComplete =
          milestone.assignedTo === 'both' ||
          (milestone.assignedTo === 'artist' && authUser?.role === 'artist');

        if (!canComplete) {
          alert('Vous n\'êtes pas autorisé à compléter cette étape');
          return;
        }
      }

      await updateCollaborationMilestone(milestoneId, {
        ...updates,
        ...(updates.status === 'completed' && { completedAt: new Date().toISOString() }),
        ...(updates.status !== 'completed' && { completedAt: null })
      });

      await refetchMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  // Basculer l'état d'expansion des jalons
  const toggleMilestoneExpansion = (invitationId: number) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [invitationId]: !prev[invitationId]
    }));
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Collaborations</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <PieChart className="h-3 w-3 mr-1" />
          <span>Suivi d'événements</span>
        </Badge>
        
        {authUser && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={authUser.profileImage} alt={authUser.username} />
            <AvatarFallback>{authUser.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  const isLoading = invitationsLoading || eventsLoading || usersLoading;

  return (
    <ResponsiveLayout
      activeItem="collaborations"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des collaborations */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mes collaborations</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtres</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un événement ou un club..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortOrder('upcoming')}>
                    Prochains événements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('recent')}>
                    Événements récents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
                <TabsTrigger value="cancelled">Annulés</TabsTrigger>
              </TabsList>
              
              <div className="space-y-3 mt-2">
                {filteredCollaborations.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                    <p className="text-muted-foreground">Aucune collaboration trouvée</p>
                  </div>
                ) : (
                  <>
                    {filteredCollaborations.map(invitation => {
                      const clubInfo = getClubInfo(invitation);
                      const eventInfo = getEventInfo(invitation);
                      const invitationMilestones = getInvitationMilestones(invitation);
                      const progress = calculateProgress(invitationMilestones);

                      return (
                        <Card 
                          key={invitation.id} 
                          className={`cursor-pointer hover:border-primary/50 transition-colors ${
                            selectedInvitation?.id === invitation.id ? "border-primary" : ""
                          }`}
                          onClick={() => setSelectedInvitation(invitation)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={clubInfo.profileImage} alt={clubInfo.name} />
                                  <AvatarFallback>{clubInfo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{eventInfo?.title || "Événement sans titre"}</h3>
                                  <p className="text-sm text-muted-foreground">{clubInfo.name}</p>
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(invitation.status)}`}
                              >
                                {getStatusText(invitation.status)}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 text-sm text-muted-foreground">
                              {eventInfo && (
                                <>
                                  <div className="flex items-center mb-1">
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    <span>{eventInfo.date ? formatDate(eventInfo.date) : "Date non définie"}</span>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{eventInfo.venueName}</span>
                                  </div>
                                </>
                              )}
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Audience prévue: {invitation.expectedAttendees.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progression:</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            {/* Prochaine étape */}
                            {getNextMilestone(invitation) && invitation.status !== "completed" && !["cancelled", "rejected", "declined"].includes(invitation.status) && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-1">Prochaine étape:</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{getNextMilestone(invitation)?.title}</p>
                                  {getNextMilestone(invitation)?.dueDate && (
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs bg-blue-50 text-blue-800 border-blue-100"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDistanceFromNow(getNextMilestone(invitation).dueDate!)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </>
                )}
              </div>
            </Tabs>
          </div>
          
          {/* Détails de la collaboration */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedInvitation ? (
              <div className="flex items-center justify-center h-full text-center p-12 border rounded-lg border-dashed">
                <div>
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une collaboration</h3>
                  <p className="text-muted-foreground">Cliquez sur une collaboration pour voir les détails et suivre votre progression.</p>
                </div>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{getEventInfo(selectedInvitation)?.title || "Événement sans titre"}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <CalendarDays className="h-4 w-4 mr-1" /> 
                          {getEventInfo(selectedInvitation)?.date ? formatDayOfWeek(getEventInfo(selectedInvitation)!.date) : "Date non définie"}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(selectedInvitation.status)}`}
                      >
                        {getStatusText(selectedInvitation.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage src={getClubInfo(selectedInvitation).profileImage} alt={getClubInfo(selectedInvitation).name} />
                            <AvatarFallback>{getClubInfo(selectedInvitation).name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{getClubInfo(selectedInvitation).name}</h3>
                            <p className="text-sm text-muted-foreground">{getEventInfo(selectedInvitation)?.venueName}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Audience prévue:</span>
                            <span>{selectedInvitation.expectedAttendees.toLocaleString()} personnes</span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Collaboration créée le:</span>
                            <span>{selectedInvitation?.createdAt ? formatShortDate(selectedInvitation.createdAt) : "Date inconnue"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dernière mise à jour:</span>
                            <span>{selectedInvitation?.updatedAt ? formatShortDate(selectedInvitation.updatedAt) : "Date inconnue"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium flex items-center">
                          <PieChart className="h-4 w-4 mr-2" />
                          Progression globale
                        </h3>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Avancement:</span>
                            <span className="font-medium">{calculateProgress(getInvitationMilestones(selectedInvitation))}%</span>
                          </div>
                          <Progress value={calculateProgress(getInvitationMilestones(selectedInvitation))} className="h-3" />
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {getInvitationMilestones(selectedInvitation).filter(m => m.status === "completed").length}
                            </div>
                            <div className="text-muted-foreground mt-1">Terminés</div>
                          </div>
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {getInvitationMilestones(selectedInvitation).filter(m => m.status === "in_progress").length}
                            </div>
                            <div className="text-muted-foreground mt-1">En cours</div>
                          </div>
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {getInvitationMilestones(selectedInvitation).filter(m => m.status === "pending").length}
                            </div>
                            <div className="text-muted-foreground mt-1">À venir</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="milestones" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="milestones">Étapes</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="milestones" className="space-y-4">
                    <Collapsible 
                      open={expandedMilestones[selectedInvitation.id] || false}
                      onOpenChange={() => toggleMilestoneExpansion(selectedInvitation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Jalons de la collaboration</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="ml-1">
                              {expandedMilestones[selectedInvitation.id] ? "Réduire" : "Voir tout"}
                            </span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <div className="mt-4 space-y-4">
                        {/* Jalon en cours ou à venir le plus proche d'abord */}
                        {getInvitationMilestones(selectedInvitation)
                          .filter(milestone => milestone.status !== "completed")
                          .sort((a, b) => {
                            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                            return dateA - dateB;
                          })
                          .slice(0, expandedMilestones[selectedInvitation.id] ? undefined : 2)
                          .map(milestone => (
                            <Card key={milestone.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <h4 className="font-semibold">{milestone.title}</h4>
                                      <Badge 
                                        variant="outline" 
                                        className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                      >
                                        {getMilestoneStatusText(milestone.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      {milestone.dueDate && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                          <CalendarRange className="h-3 w-3 mr-1" />
                                          {formatShortDate(milestone.dueDate)}
                                        </Badge>
                                      )}
                                      <Badge variant="outline" className={getPriorityColor(milestone.priority)}>
                                        Priorité: {getPriorityText(milestone.priority)}
                                      </Badge>
                                      <Badge variant="outline">
                                        Assigné à: {getAssignedToText(milestone.assignedTo)}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {milestone.status === "pending" && (
                                    <Button 
                                      size="sm" 
                                      className="ml-4"
                                      onClick={() => handleUpdateMilestone(milestone.id, { status: "in_progress" })}
                                    >
                                      Démarrer
                                    </Button>
                                  )}
                                  
                                  {milestone.status === "in_progress" && (
                                    <Button 
                                      size="sm" 
                                      className="ml-4"
                                      onClick={() => handleUpdateMilestone(milestone.id, { status: "completed" })}
                                    >
                                      Terminer
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        
                        <CollapsibleContent className="space-y-4">
                          {/* Jalons terminés */}
                          <h4 className="font-medium flex items-center text-muted-foreground mt-4">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Étapes terminées
                          </h4>
                          
                          {getInvitationMilestones(selectedInvitation)
                            .filter(milestone => milestone.status === "completed")
                            .sort((a, b) => {
                              const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                              const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                              return dateB - dateA; // Plus récent en premier
                            })
                            .map(milestone => (
                              <Card key={milestone.id} className="bg-muted/30">
                                <CardContent className="p-4">
                                  <div className="flex items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-1">
                                        <h4 className="font-semibold text-muted-foreground">{milestone.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                        >
                                          {getMilestoneStatusText(milestone.status)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                      
                                      <div className="flex flex-wrap gap-2 text-xs">
                                        {milestone.completedAt && (
                                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-100">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Terminé le {formatShortDate(milestone.completedAt)}
                                          </Badge>
                                        )}
                                        {milestone.dueDate && (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                            <CalendarRange className="h-3 w-3 mr-1" />
                                            Date limite: {formatShortDate(milestone.dueDate)}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                          {/* Jalons en attente au-delà de la limite initiale */}
                          {getInvitationMilestones(selectedInvitation)
                            .filter(milestone => milestone.status !== "completed")
                            .sort((a, b) => {
                              const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                              const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                              return dateA - dateB;
                            })
                            .slice(2)
                            .map(milestone => (
                              <Card key={milestone.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-1">
                                        <h4 className="font-semibold">{milestone.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                        >
                                          {getMilestoneStatusText(milestone.status)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                      
                                      <div className="flex flex-wrap gap-2 text-xs">
                                        {milestone.dueDate && (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                            <CalendarRange className="h-3 w-3 mr-1" />
                                            {formatShortDate(milestone.dueDate)}
                                          </Badge>
                                        )}
                                        <Badge variant="outline" className={getPriorityColor(milestone.priority)}>
                                          Priorité: {getPriorityText(milestone.priority)}
                                        </Badge>
                                        <Badge variant="outline">
                                          Assigné à: {getAssignedToText(milestone.assignedTo)}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {milestone.status === "pending" && (
                                      <Button 
                                        size="sm" 
                                        className="ml-4"
                                        onClick={() => handleUpdateMilestone(milestone.id, { status: "in_progress" })}
                                      >
                                        Démarrer
                                      </Button>
                                    )}
                                    
                                    {milestone.status === "in_progress" && (
                                      <Button 
                                        size="sm" 
                                        className="ml-4"
                                        onClick={() => handleUpdateMilestone(milestone.id, { status: "completed" })}
                                      >
                                        Terminer
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </TabsContent>
                  
                  <TabsContent value="messages" className="space-y-4">
                    <h3 className="text-lg font-semibold">Messagerie</h3>
                    
                    <div className="rounded-lg border h-[400px] flex flex-col">
                      <div className="p-4 flex-1 overflow-y-auto space-y-4">
                        {getInvitationMessages(selectedInvitation).length === 0 ? (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                              <p className="text-muted-foreground">Aucun message pour le moment</p>
                            </div>
                          </div>
                        ) : (
                          getInvitationMessages(selectedInvitation).map(msg => {
                            const messageSender = users?.find(user => user.id === msg.senderId);
                            const isCurrentUser = msg.senderId === authUser?.id;

                            return (
                              <div 
                                key={msg.id}
                                className={`flex ${isCurrentUser ? "justify-end" : ""}`}
                              >
                                <div 
                                  className={`flex max-w-[75%] ${
                                    isCurrentUser 
                                      ? "flex-row-reverse" 
                                      : "flex-row"
                                  }`}
                                >
                                  <Avatar className={`h-8 w-8 ${isCurrentUser ? "ml-2" : "mr-2"}`}>
                                    <AvatarImage src={messageSender?.profileImage} alt={messageSender?.firstName || "Utilisateur"} />
                                    <AvatarFallback>{(messageSender?.firstName || "U").charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className={`text-xs mb-1 ${
                                      isCurrentUser ? "text-right" : "text-left"
                                    }`}>
                                      <span className="font-medium">
                                        {isCurrentUser ? "Vous" : messageSender?.firstName || "Utilisateur"}
                                      </span>
                                      <span className="text-muted-foreground ml-2">
                                        {msg.createdAt ? formatDateTime(msg.createdAt) : "Date inconnue"}
                                      </span>
                                    </div>
                                    <div className={`rounded-lg p-3 ${
                                      isCurrentUser 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted"
                                    }`}>
                                      <p className="text-sm">{msg.content}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Écrivez votre message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button onClick={handleSendMessage} disabled={!message.trim() || isSending}>
                            {isSending ? "Envoi..." : "Envoyer"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}