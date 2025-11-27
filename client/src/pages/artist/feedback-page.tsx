import { useState, useEffect } from "react";
import { Star, Calendar, Users, Building2, Filter, Search, ArrowUpDown, MessageSquare } from "lucide-react";
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
  getArtistByUserId,
  getEventById,
  getUserById,
  getClubById,
  getAllFeedback,
  updateFeedback,
  getClubByUserId
} from "@/services/servapi";
import type { User as UserType, Artist, Feedback as FeedbackType, Event, Club } from "@shared/schema";

// Types adaptés aux données réelles
type AuthUser = UserType & {
  profileImage?: string;
};

type ArtistFeedback = FeedbackType & {
  reviewerType: "user" | "club" | "artist";
  reviewerName: string;
  reviewerImage?: string;
  eventTitle: string;
  eventDate: Date;
  clubName?: string;
  reply?: string;
};

export default function ArtistFeedbackPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [feedbacks, setFeedbacks] = useState<ArtistFeedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<ArtistFeedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [replyInput, setReplyInput] = useState<Record<number, string>>({});
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

      // Charger les feedbacks une fois l'artiste connu
      if (artistData) {
        await loadArtistFeedbacks(artistData.id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données artiste:", error);
      setIsLoading(false);
    }
  };

  // Charger les feedbacks de l'artiste
  const loadArtistFeedbacks = async (artistId: number) => {
    try {
      // Récupérer tous les feedbacks où la source est l'artiste
      const allFeedbacks = await getAllFeedback({ sourceType: "artist", sourceId: artistId });

      if (!allFeedbacks || allFeedbacks.length === 0) {
        setFeedbacks([]);
        setFilteredFeedbacks([]);
        setIsLoading(false);
        return;
      }

      const feedbackPromises = allFeedbacks.map(async (feedback: FeedbackType) => {
        try {
          let reviewerName = "Utilisateur";
          let reviewerImage: string | undefined;
          let eventTitle = "Événement";
          let eventDate = new Date();
          let clubName: string | undefined;

          // Récupérer les informations du REVIEWER (celui qui a écrit le feedback)
          try {
            if (feedback.reviewerType === "user") {
              const reviewer = await getUserById(feedback.reviewerId);
              reviewerName = reviewer.firstName && reviewer.lastName
                ? `${reviewer.firstName} ${reviewer.lastName}`
                : reviewer.username || `Utilisateur #${feedback.reviewerId}`;
              reviewerImage = reviewer.profileImage;
            } else if (feedback.reviewerType === "club") {
              // Pour les clubs, reviewerId est l'ID utilisateur, on doit trouver le club par userId
              const club = await getClubByUserId(feedback.reviewerId);
              reviewerName = club?.name || `Club #${feedback.reviewerId}`;
              reviewerImage = club?.profileImage;
            } else if (feedback.reviewerType === "artist") {
              const artist = await getArtistByUserId(feedback.reviewerId);
              reviewerName = artist?.displayName || `Artiste #${feedback.reviewerId}`;
              const artistUser = await getUserById(feedback.reviewerId);
              reviewerImage = artistUser?.profileImage;
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du reviewer:", error);
            reviewerName = `Reviewer #${feedback.reviewerId}`;
          }

          // Récupérer les informations du contexte si c'est un événement
          if (feedback.contextType === "event" && feedback.contextId) {
            try {
              const event = await getEventById(feedback.contextId);
              eventTitle = event.title;
              eventDate = new Date(event.date);

              // Récupérer le nom du club organisateur si disponible
              if (event.organizerType === "club") {
                const club = await getClubById(event.organizerId);
                clubName = club?.name;
              }
            } catch (error) {
              console.error("Erreur lors de la récupération de l'événement:", error);
            }
          }

          return {
            ...feedback,
            reviewerType: feedback.reviewerType as "user" | "club" | "artist",
            reviewerName,
            reviewerImage,
            eventTitle,
            eventDate,
            clubName,
            reply: feedback.reply || undefined
          } as ArtistFeedback;
        } catch (error) {
          console.error(`Erreur lors du traitement du feedback ${feedback.id}:`, error);
          return null;
        }
      });

      const feedbacksData = (await Promise.all(feedbackPromises)).filter(Boolean) as ArtistFeedback[];
      setFeedbacks(feedbacksData);
      setFilteredFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Erreur lors du chargement des feedbacks:", error);
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les feedbacks
  useEffect(() => {
    let result = feedbacks;

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(feedback =>
        feedback.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par source
    if (sourceFilter) {
      result = result.filter(feedback => feedback.reviewerType === sourceFilter);
    }

    // Tri
    result = [...result].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'highest') {
        return b.rating - a.rating;
      } else if (sortOrder === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

    setFilteredFeedbacks(result);
  }, [feedbacks, searchTerm, sourceFilter, sortOrder]);

  // Ajouter une réponse
  const handleAddReply = async (feedbackId: number) => {
    const replyText = replyInput[feedbackId]?.trim();

    if (!replyText) return;

    try {
      // Appel API pour mettre à jour le feedback avec la réponse
      await updateFeedback(feedbackId, replyText);

      // Mettre à jour l'état local
      setFeedbacks(prev =>
        prev.map(feedback =>
          feedback.id === feedbackId
            ? { ...feedback, reply: replyText }
            : feedback
        )
      );

      // Réinitialiser l'entrée de réponse
      setReplyInput(prev => {
        const newInput = { ...prev };
        delete newInput[feedbackId];
        return newInput;
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse:", error);
    }
  };

  // Statistiques des feedbacks
  const stats = {
    total: feedbacks.length,
    averageRating: feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : "0.0",
    fromUsers: feedbacks.filter(f => f.reviewerType === "user").length,
    fromClubs: feedbacks.filter(f => f.reviewerType === "club").length,
    fromArtists: feedbacks.filter(f => f.reviewerType === "artist").length,
    fiveStars: feedbacks.filter(f => f.rating === 5).length,
    fourStars: feedbacks.filter(f => f.rating === 4).length,
    threeStars: feedbacks.filter(f => f.rating === 3).length,
    twoStars: feedbacks.filter(f => f.rating === 2).length,
    oneStar: feedbacks.filter(f => f.rating === 1).length,
  };

  // Rendu des étoiles
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
      />
    ));
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Feedbacks</span>
      </h1>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Star className="h-3 w-3 mr-1" />
          <span>Feedbacks</span>
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
      activeItem="feedbacks"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Évaluation globale</CardTitle>
                <CardDescription>Moyenne de tous les avis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-primary">{stats.averageRating}</div>
                  <div className="flex">
                    {renderStars(Math.round(parseFloat(stats.averageRating)))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Basé sur {stats.total} avis
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(5)}
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2 mr-2 ml-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (stats.fiveStars / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground w-8 text-right">{stats.fiveStars}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(4)}
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2 mr-2 ml-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (stats.fourStars / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground w-8 text-right">{stats.fourStars}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(3)}
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2 mr-2 ml-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (stats.threeStars / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground w-8 text-right">{stats.threeStars}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(2)}
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2 mr-2 ml-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (stats.twoStars / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground w-8 text-right">{stats.twoStars}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStars(1)}
                    </div>
                    <div className="w-32 bg-muted rounded-full h-2 mr-2 ml-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.total > 0 ? (stats.oneStar / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground w-8 text-right">{stats.oneStar}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Source des avis</CardTitle>
                <CardDescription>Répartition par type de reviewer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <Users className="h-8 w-8 text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">{stats.fromUsers}</div>
                    <div className="text-sm text-muted-foreground">Utilisateurs</div>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <Building2 className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{stats.fromClubs}</div>
                    <div className="text-sm text-muted-foreground">Clubs</div>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center">
                    <Star className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{stats.fromArtists}</div>
                    <div className="text-sm text-muted-foreground">Artistes</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" /> Filtrer
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Type de reviewer</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSourceFilter(null)}>
                            Tous les avis
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSourceFilter("user")}>
                            Avis des utilisateurs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSourceFilter("club")}>
                            Avis des clubs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSourceFilter("artist")}>
                            Avis des artistes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                            Plus récents d'abord
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                            Plus anciens d'abord
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortOrder('highest')}>
                            Meilleures notes d'abord
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortOrder('lowest')}>
                            Moins bonnes notes d'abord
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button variant="outline" size="sm" onClick={() => setSortOrder('newest')}>
                        <ArrowUpDown className="h-4 w-4 mr-2" /> {
                          sortOrder === 'newest' ? 'Plus récents' :
                            sortOrder === 'oldest' ? 'Plus anciens' :
                              sortOrder === 'highest' ? 'Meilleures notes' :
                                'Moins bonnes notes'
                        }
                      </Button>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans les avis..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets des avis */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous les avis</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs ({stats.fromUsers})</TabsTrigger>
              <TabsTrigger value="clubs">Clubs ({stats.fromClubs})</TabsTrigger>
              <TabsTrigger value="artists">Artistes ({stats.fromArtists})</TabsTrigger>
            </TabsList>

            {["all", "users", "clubs", "artists"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filteredFeedbacks
                    .filter(feedback =>
                      tab === "all" ||
                      (tab === "users" && feedback.reviewerType === "user") ||
                      (tab === "clubs" && feedback.reviewerType === "club") ||
                      (tab === "artists" && feedback.reviewerType === "artist")
                    )
                    .length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="mb-2">Aucun avis trouvé</p>
                      {(searchTerm || sourceFilter) && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchTerm("");
                            setSourceFilter(null);
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredFeedbacks
                      .filter(feedback =>
                        tab === "all" ||
                        (tab === "users" && feedback.reviewerType === "user") ||
                        (tab === "clubs" && feedback.reviewerType === "club") ||
                        (tab === "artists" && feedback.reviewerType === "artist")
                      )
                      .map((feedback) => (
                        <Card key={feedback.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={feedback.reviewerImage} alt={feedback.reviewerName} />
                                  <AvatarFallback>
                                    {feedback.reviewerName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{feedback.reviewerName}</h4>
                                  <div className="flex items-center">
                                    {renderStars(feedback.rating)}
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {format(new Date(feedback.createdAt), "d MMMM yyyy", { locale: fr })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  feedback.reviewerType === "club"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/25"
                                    : feedback.reviewerType === "artist"
                                      ? "bg-green-500/10 text-green-500 border-green-500/25"
                                      : "bg-purple-500/10 text-purple-500 border-purple-500/25"
                                }
                              >
                                {feedback.reviewerType === "club" ? "Club" :
                                  feedback.reviewerType === "artist" ? "Artiste" : "Utilisateur"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3 space-y-4">
                            <div>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Événement : </span>
                                <span className="font-medium ml-1">
                                  {feedback.eventTitle} - {format(feedback.eventDate, "d MMMM yyyy", { locale: fr })}
                                </span>
                              </div>
                              {feedback.clubName && (
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                  <Building2 className="h-4 w-4 mr-2" />
                                  <span>Club : </span>
                                  <span className="font-medium ml-1">{feedback.clubName}</span>
                                </div>
                              )}
                              <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm">{feedback.comment}</p>
                              </div>
                            </div>

                            {feedback.reply && (
                              <div className="pl-6 border-l-2 border-primary/30">
                                <div className="flex items-center mb-2">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={user?.profileImage} alt={user?.username} />
                                    <AvatarFallback>
                                      {user?.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h5 className="text-sm font-medium">Votre réponse</h5>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(), "d MMMM yyyy", { locale: fr })}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-3 bg-primary/5 rounded-lg">
                                  <p className="text-sm">{feedback.reply}</p>
                                </div>
                              </div>
                            )}

                            {!feedback.reply && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Répondre à cet avis</h5>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Écrire une réponse..."
                                    value={replyInput[feedback.id] || ''}
                                    onChange={(e) => setReplyInput(prev => ({ ...prev, [feedback.id]: e.target.value }))}
                                  />
                                  <Button
                                    onClick={() => handleAddReply(feedback.id)}
                                    disabled={!replyInput[feedback.id]?.trim()}
                                  >
                                    Répondre
                                  </Button>
                                </div>
                              </div>
                            )}
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