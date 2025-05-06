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

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

// Type pour les invitations
type Invitation = {
  id: number;
  clubId: number;
  clubName: string;
  clubImage?: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  requestDate: string;
  offer: number;
  description: string;
  genre: string;
  status: "pending" | "accepted" | "declined";
  location: string;
};

// Données fictives pour les invitations
const mockInvitations: Invitation[] = [
  {
    id: 1,
    clubId: 1,
    clubName: "Club Oxygen",
    clubImage: "/images/clubs/club1.jpg",
    eventId: 101,
    eventTitle: "Soirée Techno de Noël",
    eventDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    requestDate: new Date().toISOString(),
    offer: 400000,
    description: "Nous organisons une soirée techno pour Noël et cherchons un DJ talentueux pour faire danser notre public de 22h à 2h du matin.",
    genre: "Techno",
    status: "pending",
    location: "Antananarivo, Madagascar"
  },
  {
    id: 2,
    clubId: 2,
    clubName: "Le Bunker",
    clubImage: "/images/clubs/club2.jpg",
    eventId: 102,
    eventTitle: "Underground Bass Night",
    eventDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    requestDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    offer: 300000,
    description: "Soirée bass music dans notre club underground. Nous recherchons un DJ pour un set de 3 heures dans notre salle principale.",
    genre: "Bass / Dubstep",
    status: "pending",
    location: "Antananarivo, Madagascar"
  },
  {
    id: 3,
    clubId: 3,
    clubName: "Sky Lounge",
    clubImage: "/images/clubs/club3.jpg",
    eventId: 103,
    eventTitle: "Sunset House Sessions",
    eventDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    requestDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    offer: 350000,
    description: "Session house en fin d'après-midi sur notre terrasse avec vue panoramique. Style détendu et mélodique.",
    genre: "House / Deep House",
    status: "accepted",
    location: "Antananarivo, Madagascar"
  },
  {
    id: 4,
    clubId: 4,
    clubName: "Jungle Room",
    clubImage: "/images/clubs/club4.jpg",
    eventId: 104,
    eventTitle: "Tribal Techno",
    eventDate: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    requestDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    offer: 450000,
    description: "Soirée spéciale mêlant influences tribales et techno minimaliste. Nous cherchons un artiste capable de créer une atmosphère immersive.",
    genre: "Tribal Techno",
    status: "declined",
    location: "Antananarivo, Madagascar"
  },
  {
    id: 5,
    clubId: 5,
    clubName: "Club Nova",
    clubImage: "/images/clubs/club5.jpg",
    eventId: 105,
    eventTitle: "Electro Swing Revival",
    eventDate: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    requestDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    offer: 320000,
    description: "Soirée thématique années 20 avec une touche moderne. Nous recherchons un DJ maîtrisant l'electro swing pour une ambiance festive et rétro.",
    genre: "Electro Swing",
    status: "pending",
    location: "Antananarivo, Madagascar"
  }
];

export default function ArtistInvitationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<Invitation[]>([]);
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
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Chargement des invitations
  useEffect(() => {
    const timer = setTimeout(() => {
      setInvitations(mockInvitations);
      setFilteredInvitations(mockInvitations);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtrer les invitations
  useEffect(() => {
    let result = invitations;
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(invitation => 
        invitation.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(invitation => invitation.status === statusFilter);
    }
    
    setFilteredInvitations(result);
  }, [invitations, searchTerm, statusFilter]);

  // Accepter une invitation
  const handleAcceptInvitation = (id: number) => {
    setInvitations(prev => 
      prev.map(invitation => 
        invitation.id === id 
          ? { ...invitation, status: "accepted" } 
          : invitation
      )
    );
  };
  
  // Refuser une invitation
  const handleDeclineInvitation = (id: number) => {
    setInvitations(prev => 
      prev.map(invitation => 
        invitation.id === id 
          ? { ...invitation, status: "declined" } 
          : invitation
      )
    );
  };

  // Statistiques des invitations
  const stats = {
    total: invitations.length,
    pending: invitations.filter(i => i.status === "pending").length,
    accepted: invitations.filter(i => i.status === "accepted").length,
    declined: invitations.filter(i => i.status === "declined").length,
    totalOffers: invitations
      .filter(i => i.status !== "declined")
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
                <div className="grid grid-cols-2 gap-2">
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
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">{stats.accepted}</p>
                  </div>
                  <div className="bg-red-500/10 p-2 rounded-md">
                    <p className="text-xs text-red-700 dark:text-red-300">Refusées</p>
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">{stats.declined}</p>
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
                        <DropdownMenuItem onClick={() => setStatusFilter("declined")}>
                          Refusées
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
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="declined">Refusées ({stats.declined})</TabsTrigger>
            </TabsList>
            
            {["all", "pending", "accepted", "declined"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filteredInvitations
                    .filter(invitation => tab === "all" || invitation.status === tab)
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
                      .filter(invitation => tab === "all" || invitation.status === tab)
                      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
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
                            <Badge className={
                              invitation.status === "accepted" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                              invitation.status === "declined" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                              "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                            }>
                              {invitation.status === "accepted" ? "Acceptée" :
                               invitation.status === "declined" ? "Refusée" : "En attente"}
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
                                      {format(new Date(invitation.eventDate), "EEEE d MMMM yyyy à HH'h'mm", { locale: fr })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Invitation reçue : </span>
                                    <span className="font-medium ml-1">
                                      {format(new Date(invitation.requestDate), "d MMMM yyyy", { locale: fr })}
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
                                
                                {invitation.status === "pending" && (
                                  <div className="mt-4 flex gap-2">
                                    <Button 
                                      className="w-full" 
                                      onClick={() => handleAcceptInvitation(invitation.id)}
                                    >
                                      <Check className="h-4 w-4 mr-2" /> Accepter
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className="w-full"
                                      onClick={() => handleDeclineInvitation(invitation.id)}
                                    >
                                      <X className="h-4 w-4 mr-2" /> Refuser
                                    </Button>
                                  </div>
                                )}
                                
                                {invitation.status !== "pending" && (
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