import { useState, useEffect } from "react";
import { Calendar, Mail, Star, Wallet, Music, User, Settings } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  useApiData,
  getArtistByUserId,
  getAllEventArtists,
  getEventById,
  getAllInvitations,
  getUserById,
  getClubByUserId,
  getClubById,
} from "@/services/servapi";
import type { User as UserType, Artist, Event, EventArtist, Invitation, Club } from "@shared/schema";

// Types adaptés aux données réelles
type AuthUser = UserType & {
  profileImage?: string;
};

type ArtistEvent = Event & {
  artistFee: number;
  status: "pending" | "confirmed" | "cancelled";
};

type ArtistInvitation = Invitation & {
  clubName: string;
  clubImage?: string;
  eventTitle: string;
  eventDate: Date;
  offer: number;
  status: "pending" | "accepted" | "declined" | "confirmed" | "cancelled" | "rejected" | "negotiation" | "preparation" | "completed";
};

export default function ArtistDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [events, setEvents] = useState<ArtistEvent[]>([]);
  const [invitations, setInvitations] = useState<ArtistInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);

        // Charger les données de l'artiste après avoir l'utilisateur
        if (userData.id) {
          loadArtistData(userData.id);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Charger les données de l'artiste
  const loadArtistData = async (userId: number) => {
    try {
      const artistData = await getArtistByUserId(userId);
      setArtist(artistData);

      // Charger les événements et invitations une fois l'artiste connu
      if (artistData) {
        await Promise.all([
          loadArtistEvents(artistData.id),
          loadArtistInvitations(userId)
        ]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données artiste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les événements de l'artiste
  const loadArtistEvents = async (artistId: number) => {
    try {
      const eventArtists = await getAllEventArtists(undefined, artistId);

      if (!eventArtists || eventArtists.length === 0) {
        setEvents([]);
        return;
      }

      const eventPromises = eventArtists.map(async (eventArtist: EventArtist) => {
        try {
          const event = await getEventById(eventArtist.eventId);

          // Convertir le statut de la base de données vers le format attendu par l'UI
          let status: "pending" | "confirmed" | "cancelled" = "pending";
          if (event.status === "upcoming" || event.status === "confirmed") {
            status = "confirmed";
          } else if (event.status === "cancelled") {
            status = "cancelled";
          }

          return {
            ...event,
            artistFee: Number(eventArtist.fee) || 0,
            status
          } as ArtistEvent;
        } catch (error) {
          console.error(`Erreur lors du chargement de l'événement ${eventArtist.eventId}:`, error);
          return null;
        }
      });

      const eventsData = (await Promise.all(eventPromises)).filter(Boolean) as ArtistEvent[];
      setEvents(eventsData);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setEvents([]);
    }
  };

  // Charger les invitations de l'artiste
  const loadArtistInvitations = async (userId: number) => {
    try {
      const userInvitations = await getAllInvitations({ userId });

      if (!userInvitations || userInvitations.length === 0) {
        setInvitations([]);
        return;
      }

      const invitationPromises = userInvitations.map(async (invitation: Invitation) => {
        try {
          // Récupérer les détails de l'événement
          const event = await getEventById(invitation.eventId);

          // Récupérer les informations du club/organisateur
          let clubName = "Organisateur";
          let clubImage: string | undefined;

          try {
            // Essayer de récupérer le club via l'organisateur de l'événement
            if (event.organizerType === "club") {
              // Utiliser getClubById au lieu de getClubByUserId
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

          return {
            ...invitation,
            clubName,
            clubImage,
            eventTitle: event.title,
            eventDate: new Date(event.date),
            offer: Number(invitation.progress) > 0 ? Number(invitation.progress) * 1000 : (Number(event.price) || 0),
            status
          } as ArtistInvitation;
        } catch (error) {
          console.error(`Erreur lors du traitement de l'invitation ${invitation.id}:`, error);
          return null;
        }
      });

      const invitationsData = (await Promise.all(invitationPromises)).filter(Boolean) as ArtistInvitation[];
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Erreur lors du chargement des invitations:", error);
      setInvitations([]);
    }
  };

  // Gérer l'acceptation d'une invitation
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

  // Gérer le refus d'une invitation
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

  // Calculer les statistiques
  const confirmedEvents = events.filter(event => event.status === "confirmed");
  const pendingInvitations = invitations.filter(inv => inv.status === "pending");
  const totalRevenue = confirmedEvents.reduce((sum, event) => sum + event.artistFee, 0);
  const artistGenres = artist?.genres as string[] || [];
  const primaryGenre = artistGenres[0] || "Non spécifié";
  const artistRating = artist?.rating ? Number(artist.rating) : 0;

  // Navigation handlers
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Artiste</span>
      </h1>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Music className="h-3 w-3 mr-1" />
          <span>Artiste</span>
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
        <div className="space-y-8">
          {/* Section Profil */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Infos de base */}
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.profileImage} alt={user?.username} />
                    <AvatarFallback className="text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{artist?.displayName || user?.username}</h3>
                  <p className="text-muted-foreground">
                    {artistGenres.length > 0 ? artistGenres.join(", ") : "Artiste"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigateTo("/artist/profile")}>
                      Éditer le profil
                    </Button>
                    <Button size="sm" variant="default" onClick={() => navigateTo("/artist/portfolio")}>
                      Gérer les médias
                    </Button>
                  </div>
                </div>

                {/* Stats rapides */}
                <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Événements</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Invitations en attente</p>
                    <p className="text-2xl font-bold">{pendingInvitations.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Revenus</p>
                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} Ar</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Notation</p>
                    <p className="text-2xl font-bold">{artistRating.toFixed(1)}/5</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Popularité</p>
                    <p className="text-2xl font-bold">{artist?.popularity || 0}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Style principal</p>
                    <p className="text-lg font-bold truncate">{primaryGenre}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Événements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Mes Événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    Aucun événement prévu pour le moment.
                  </p>
                ) : (
                  events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex justify-between items-center border-b pb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "EEEE d MMMM yyyy, HH'h'mm", { locale: fr })}
                        </div>
                        <div className="text-sm">{event.location}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={
                          event.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                            event.status === "cancelled" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                              "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                        }>
                          {event.status === "confirmed" ? "Confirmé" :
                            event.status === "cancelled" ? "Annulé" : "En attente"}
                        </Badge>
                        <div className="font-medium">{event.artistFee.toLocaleString()} Ar</div>
                      </div>
                    </div>
                  ))
                )}

                {events.length > 0 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => navigateTo("/artist/events")}>
                      Voir tous mes événements ({events.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section Invitations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Invitations Reçues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    Aucune invitation en attente.
                  </p>
                ) : (
                  invitations.slice(0, 3).map((invitation) => (
                    <div key={invitation.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          {invitation.clubImage && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={invitation.clubImage} alt={invitation.clubName} />
                              <AvatarFallback>{invitation.clubName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <h3 className="font-medium">{invitation.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground">Par {invitation.clubName}</p>
                          </div>
                        </div>
                        <Badge className={
                          invitation.status === "accepted" || invitation.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                            invitation.status === "declined" || invitation.status === "rejected" || invitation.status === "cancelled" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                              invitation.status === "negotiation" ? "bg-blue-500/10 text-blue-500 border-blue-500/25" :
                                invitation.status === "preparation" ? "bg-purple-500/10 text-purple-500 border-purple-500/25" :
                                  invitation.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" :
                                    "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                        }>
                          {invitation.status === "accepted" ? "Acceptée" :
                            invitation.status === "confirmed" ? "Confirmée" :
                              invitation.status === "declined" ? "Déclinée" :
                                invitation.status === "rejected" ? "Rejetée" :
                                  invitation.status === "cancelled" ? "Annulée" :
                                    invitation.status === "negotiation" ? "En négociation" :
                                      invitation.status === "preparation" ? "En préparation" :
                                        invitation.status === "completed" ? "Terminée" : "En attente"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Date: {format(invitation.eventDate, "EEEE d MMMM yyyy, HH'h'mm", { locale: fr })}</p>
                        <p>Rémunération proposée: {invitation.offer.toLocaleString()} Ar</p>
                        {invitation.genre && <p>Style demandé: {invitation.genre}</p>}
                      </div>
                      {(invitation.status === "pending" || invitation.status === "negotiation") && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full"
                            onClick={() => handleAcceptInvitation(invitation.id)}
                          >
                            {invitation.status === "negotiation" ? "Finaliser" : "Accepter"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleDeclineInvitation(invitation.id)}
                          >
                            {invitation.status === "negotiation" ? "Abandonner" : "Refuser"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {invitations.length > 0 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => navigateTo("/artist/invitations")}>
                      Voir toutes les invitations ({invitations.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => navigateTo("/artist/feedback")}>
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Feedbacks</h3>
                <p className="text-sm text-muted-foreground mb-3">Voir les avis reçus</p>
                <Button variant="outline" size="sm">Consulter</Button>
              </CardContent>
            </Card>

            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => navigateTo("/artist/wallet")}>
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Portefeuille</h3>
                <p className="text-sm text-muted-foreground mb-3">Gérer vos revenus</p>
                <Button variant="outline" size="sm">Consulter</Button>
              </CardContent>
            </Card>

            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => navigateTo("/artist/portfolio")}>
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Médias</h3>
                <p className="text-sm text-muted-foreground mb-3">Votre portfolio</p>
                <Button variant="outline" size="sm">Gérer</Button>
              </CardContent>
            </Card>

            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => navigateTo("/settings")}>
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Réglages</h3>
                <p className="text-sm text-muted-foreground mb-3">Paramètres du compte</p>
                <Button variant="outline" size="sm">Modifier</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}