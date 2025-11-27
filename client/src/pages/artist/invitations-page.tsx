import { useState, useEffect } from "react";
import { Mail, Calendar, User, Check, X, Filter, Search, Clock, Building2 } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  getAllInvitations,
  getEventById,
  getUserById,
  getClubById,
} from "@/services/servapi";
import type { User as UserType, Invitation as InvitationType, Event, Club } from "@shared/schema";

// Types adaptés aux données réelles
type AuthUser = UserType & {
  profileImage?: string;
};

type ArtistInvitation = InvitationType & {
  clubName: string;
  clubImage?: string;
  eventTitle: string;
  eventDate: Date;
  offer: number;
  location: string;
  description: string;
  genre: string;
  status: "pending" | "accepted" | "declined" | "confirmed" | "cancelled" | "rejected" | "negotiation" | "preparation" | "completed";
};

export default function ArtistInvitationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [invitations, setInvitations] = useState<ArtistInvitation[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<ArtistInvitation[]>([]);
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

        // Charger les invitations une fois l'utilisateur connu
        if (userData.id) {
          loadArtistInvitations(userData.id);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Charger les invitations de l'artiste
  const loadArtistInvitations = async (userId: number) => {
    try {
      const userInvitations = await getAllInvitations({ userId });

      if (!userInvitations || userInvitations.length === 0) {
        setInvitations([]);
        setFilteredInvitations([]);
        setIsLoading(false);
        return;
      }

      const invitationPromises = userInvitations.map(async (invitation: InvitationType) => {
        try {
          // Récupérer les détails de l'événement
          const event = await getEventById(invitation.eventId);

          // Récupérer les informations du club/organisateur
          let clubName = "Organisateur";
          let clubImage: string | undefined;
          let location = event.location || "Lieu non spécifié";
          let description = event.description || "Aucune description fournie";
          let genre = invitation.genre || "Non spécifié";

          try {
            // Essayer de récupérer le club via l'organisateur de l'événement
            if (event.organizerType === "club") {
              const club = await getClubById(event.organizerId);
              clubName = club?.name || "Club";
              clubImage = club?.profileImage;
            } else {
              // Fallback: récupérer l'utilisateur qui a invité
              const organizer = await getUserById(invitation.invitedById);
              clubName = organizer.firstName && organizer.lastName
                ? `${organizer.firstName} ${organizer.lastName}`
                : organizer.username || `Organisateur #${invitation.invitedById}`;
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de l'organisateur:", error);
            // Fallback: utiliser l'ID de l'invitant comme nom
            clubName = `Organisateur #${invitation.invitedById}`;
          }

          // Convertir le statut pour l'UI - tous les statuts sont maintenant supportés
          let status: ArtistInvitation["status"] = invitation.status as ArtistInvitation["status"];

          // Calculer l'offre basée sur le progrès ou le prix de l'événement
          const offer = Number(invitation.progress) > 0 ? Number(invitation.progress) * 1000 : (Number(event.price) || 0);

          return {
            ...invitation,
            clubName,
            clubImage,
            eventTitle: event.title,
            eventDate: new Date(event.date),
            offer,
            location,
            description,
            genre,
            status
          } as ArtistInvitation;
        } catch (error) {
          console.error(`Erreur lors du traitement de l'invitation ${invitation.id}:`, error);
          return null;
        }
      });

      const invitationsData = (await Promise.all(invitationPromises)).filter(Boolean) as ArtistInvitation[];
      setInvitations(invitationsData);
      setFilteredInvitations(invitationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des invitations:", error);
      setInvitations([]);
      setFilteredInvitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les invitations
  useEffect(() => {
    let result = invitations;

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(invitation =>
        invitation.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter) {
      result = result.filter(invitation => invitation.status === statusFilter);
    }

    setFilteredInvitations(result);
  }, [invitations, searchTerm, statusFilter]);

  // Accepter une invitation
  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      // Ici, vous implémenteriez l'appel API pour accepter l'invitation
      console.log("Accepter l'invitation:", invitationId);
      // await acceptInvitation(invitationId);

      // Mettre à jour l'état local
      setInvitations(prev => prev.map(inv =>
        inv.id === invitationId ? { ...inv, status: "accepted" as const } : inv
      ));
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'invitation:", error);
    }
  };

  // Refuser une invitation
  const handleDeclineInvitation = async (invitationId: number) => {
    try {
      // Ici, vous implémenteriez l'appel API pour refuser l'invitation
      console.log("Refuser l'invitation:", invitationId);
      // await declineInvitation(invitationId);

      // Mettre à jour l'état local
      setInvitations(prev => prev.map(inv =>
        inv.id === invitationId ? { ...inv, status: "declined" as const } : inv
      ));
    } catch (error) {
      console.error("Erreur lors du refus de l'invitation:", error);
    }
  };

  const stats = {
    total: invitations.length,
    pending: invitations.filter(i => i.status === "pending").length,
    accepted: invitations.filter(i => i.status === "accepted").length,
    declined: invitations.filter(i => i.status === "declined").length,
    negotiation: invitations.filter(i => i.status === "negotiation").length,
    confirmed: invitations.filter(i => i.status === "confirmed").length,
    preparation: invitations.filter(i => i.status === "preparation").length,
    completed: invitations.filter(i => i.status === "completed").length,
    rejected: invitations.filter(i => i.status === "rejected").length,
    cancelled: invitations.filter(i => i.status === "cancelled").length,
    totalOffers: invitations
      .filter(i => i.status !== "declined" && i.status !== "rejected" && i.status !== "cancelled")
      .reduce((sum, i) => sum + i.offer, 0)
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Invitations</span>
      </h1>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Mail className="h-3 w-3 mr-1" />
          <span>Invitations</span>
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

  // Fonction pour obtenir la classe du badge selon le statut
  const getStatusBadgeClass = (status: ArtistInvitation["status"]) => {
    switch (status) {
      case "accepted":
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/25";
      case "declined":
      case "rejected":
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/25";
      case "negotiation":
        return "bg-blue-500/10 text-blue-500 border-blue-500/25";
      case "preparation":
        return "bg-purple-500/10 text-purple-500 border-purple-500/25";
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/25";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/25";
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: ArtistInvitation["status"]) => {
    switch (status) {
      case "accepted": return "Acceptée";
      case "confirmed": return "Confirmée";
      case "declined": return "Déclinée";
      case "rejected": return "Rejetée";
      case "cancelled": return "Annulée";
      case "negotiation": return "En négociation";
      case "preparation": return "En préparation";
      case "completed": return "Terminée";
      default: return "En attente";
    }
  };

  return (
    <ResponsiveLayout
      activeItem="invitations"
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
                <CardDescription>Statistiques de vos invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-semibold">{stats.total}</p>
                  </div>
                  <div className="bg-yellow-500/10 p-2 rounded-md">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">En attente</p>
                    <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded-md">
                    <p className="text-xs text-green-700 dark:text-green-300">Acceptées</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">{stats.accepted + stats.confirmed}</p>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-md">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Négociation</p>
                    <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{stats.negotiation}</p>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded-md">
                    <p className="text-xs text-purple-700 dark:text-purple-300">Préparation</p>
                    <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">{stats.preparation}</p>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded-md">
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">Terminées</p>
                    <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
                  </div>
                  <div className="bg-red-500/10 p-2 rounded-md">
                    <p className="text-xs text-red-700 dark:text-red-300">Refusées</p>
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">{stats.declined + stats.rejected + stats.cancelled}</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-primary/10 rounded-md">
                  <p className="text-xs text-primary">Offres totales</p>
                  <p className="text-xl font-semibold">{stats.totalOffers.toLocaleString()} Ar</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filtres</CardTitle>
                <CardDescription>Rechercher et filtrer vos invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" /> Filtrer par statut
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Statut</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                          Tous les statuts
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                          En attente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>
                          Acceptées
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
                          Confirmées
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("negotiation")}>
                          En négociation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("preparation")}>
                          En préparation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                          Terminées
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("declined")}>
                          Refusées
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                          Rejetées
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                          Annulées
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {statusFilter && (
                      <Button
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => setStatusFilter(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Effacer le filtre
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un événement, un club ou un genre..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets des invitations */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex flex-wrap justify-start overflow-x-auto">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({stats.accepted + stats.confirmed})</TabsTrigger>
              <TabsTrigger value="negotiation">Négociation ({stats.negotiation})</TabsTrigger>
              <TabsTrigger value="preparation">Préparation ({stats.preparation})</TabsTrigger>
              <TabsTrigger value="completed">Terminées ({stats.completed})</TabsTrigger>
              <TabsTrigger value="declined">Refusées ({stats.declined})</TabsTrigger>
            </TabsList>

            {["all", "pending", "accepted", "negotiation", "preparation", "completed", "declined"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filteredInvitations
                    .filter(invitation => {
                      if (tab === "all") return true;
                      if (tab === "accepted") return invitation.status === "accepted" || invitation.status === "confirmed";
                      if (tab === "declined") return invitation.status === "declined" || invitation.status === "rejected" || invitation.status === "cancelled";
                      return invitation.status === tab;
                    })
                    .length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="mb-2">Aucune invitation {
                        tab === "pending" ? "en attente" :
                          tab === "accepted" ? "acceptée" :
                            tab === "declined" ? "refusée" : ""
                      }</p>
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
                    filteredInvitations
                      .filter(invitation => {
                        if (tab === "all") return true;
                        if (tab === "accepted") return invitation.status === "accepted" || invitation.status === "confirmed";
                        if (tab === "declined") return invitation.status === "declined" || invitation.status === "rejected" || invitation.status === "cancelled";
                        return invitation.status === tab;
                      })
                      .sort((a, b) => new Date(b.createdAt || b.eventDate).getTime() - new Date(a.createdAt || a.eventDate).getTime())
                      .map((invitation) => (
                        <Card key={invitation.id} className="overflow-hidden">
                          <CardHeader className="pb-2 flex flex-row items-start justify-between">
                            <div>
                              <CardTitle>{invitation.eventTitle}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building2 className="h-3 w-3 mr-1" />
                                {invitation.clubName}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusBadgeClass(invitation.status)}>
                              {getStatusLabel(invitation.status)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Date de l'événement : </span>
                                    <span className="font-medium ml-1">
                                      {format(invitation.eventDate, "EEEE d MMMM yyyy à HH'h'mm", { locale: fr })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Invitation reçue : </span>
                                    <span className="font-medium ml-1">
                                      {format(new Date(invitation.createdAt || invitation.eventDate), "d MMMM yyyy", { locale: fr })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Genre musical : </span>
                                    <span className="font-medium ml-1">{invitation.genre}</span>
                                  </div>
                                  <div className="mt-3">
                                    <h4 className="text-sm font-semibold mb-1">Description :</h4>
                                    <p className="text-sm text-muted-foreground">{invitation.description}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-between border-l pl-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Détails de l'offre</h4>
                                  <div className="text-2xl font-bold">{invitation.offer.toLocaleString()} Ar</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {invitation.location}
                                  </div>
                                </div>

                                {(invitation.status === "pending" || invitation.status === "negotiation") && (
                                  <div className="mt-4 flex gap-2">
                                    <Button
                                      className="w-full"
                                      onClick={() => handleAcceptInvitation(invitation.id)}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      {invitation.status === "negotiation" ? "Finaliser" : "Accepter"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => handleDeclineInvitation(invitation.id)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      {invitation.status === "negotiation" ? "Abandonner" : "Refuser"}
                                    </Button>
                                  </div>
                                )}

                                {invitation.status !== "pending" && invitation.status !== "negotiation" && (
                                  <div className="mt-4">
                                    <Button variant="outline" className="w-full">
                                      Voir détails
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </ResponsiveLayout>
  );
}