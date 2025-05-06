import { useState, useEffect } from "react";
import { Calendar, Mail, Star, Wallet, Music, User, Settings } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
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

// Type pour les événements
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  fee: number;
  status: "pending" | "confirmed" | "cancelled";
};

// Type pour les invitations
type Invitation = {
  id: number;
  clubName: string;
  eventTitle: string;
  date: string;
  offer: number;
  status: "pending" | "accepted" | "declined";
};

// Données fictives pour les événements
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Soirée Techno",
    date: "2023-12-15T21:00:00",
    location: "Club Oxygen",
    fee: 300,
    status: "confirmed"
  },
  {
    id: 2,
    title: "House Party",
    date: "2023-12-22T22:00:00",
    location: "Loft 21",
    fee: 250,
    status: "pending"
  },
  {
    id: 3,
    title: "Festival Électro",
    date: "2023-12-29T20:00:00",
    location: "Warehouse",
    fee: 500,
    status: "confirmed"
  }
];

// Données fictives pour les invitations
const mockInvitations: Invitation[] = [
  {
    id: 1,
    clubName: "Club Oxygen",
    eventTitle: "Soirée Techno de Noël",
    date: "2023-12-24T23:00:00",
    offer: 400,
    status: "pending"
  },
  {
    id: 2,
    clubName: "Le Bunker",
    eventTitle: "Underground Bass Night",
    date: "2023-12-28T22:00:00",
    offer: 300,
    status: "pending"
  }
];

export default function ArtistDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
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
    // Chargement immédiat sans délai artificiel
    setEvents(mockEvents);
    setInvitations(mockInvitations);
    setIsLoading(false);
  }, []);

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
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user?.username}</h3>
                  <p className="text-muted-foreground">DJ & Producteur</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.location.href = "/settings"}>Éditer le profil</Button>
                    <Button size="sm" variant="default" onClick={() => window.location.href = "/settings"}>Gérer les médias</Button>
                  </div>
                </div>
                
                {/* Stats rapides */}
                <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Événements</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Invitations</p>
                    <p className="text-2xl font-bold">{invitations.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Revenus</p>
                    <p className="text-2xl font-bold">{events.reduce((sum, event) => sum + (event.status === "confirmed" ? event.fee : 0), 0)}€</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Notation</p>
                    <p className="text-2xl font-bold">4.7/5</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Followers</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-muted-foreground text-sm">Style</p>
                    <p className="text-2xl font-bold">Techno</p>
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
                  events.map((event) => (
                    <div key={event.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}
                        </div>
                        <div className="text-sm">{event.location}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={
                          event.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                          event.status === "cancelled" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                          "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                        }>
                          {event.status === "confirmed" ? "Confirmé" :
                           event.status === "cancelled" ? "Annulé" : "En attente"}
                        </Badge>
                        <div className="font-medium mt-1">{event.fee}€</div>
                      </div>
                    </div>
                  ))
                )}
                
                <div className="text-center pt-2">
                  <Button variant="outline">Voir tous mes événements</Button>
                </div>
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
                  invitations.map((invitation) => (
                    <div key={invitation.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{invitation.eventTitle}</h3>
                        <Badge className={
                          invitation.status === "accepted" ? "bg-green-500/10 text-green-500" :
                          invitation.status === "declined" ? "bg-red-500/10 text-red-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        }>
                          {invitation.status === "accepted" ? "Acceptée" :
                           invitation.status === "declined" ? "Refusée" : "En attente"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Club: {invitation.clubName}</p>
                        <p>Date: {format(new Date(invitation.date), "EEEE d MMMM, HH'h'mm", { locale: fr })}</p>
                        <p>Rémunération proposée: {invitation.offer}€</p>
                      </div>
                      {invitation.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="default" className="w-full">Accepter</Button>
                          <Button size="sm" variant="outline" className="w-full">Refuser</Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                <div className="text-center pt-2">
                  <Button variant="outline">Voir toutes les invitations</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Feedbacks</h3>
                <p className="text-sm text-muted-foreground mb-3">Voir les avis reçus</p>
                <Button variant="outline" size="sm">Consulter</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Portefeuille</h3>
                <p className="text-sm text-muted-foreground mb-3">Gérer vos revenus</p>
                <Button variant="outline" size="sm">Consulter</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Médias</h3>
                <p className="text-sm text-muted-foreground mb-3">Votre portfolio</p>
                <Button variant="outline" size="sm">Gérer</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
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