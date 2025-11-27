import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import LocationDisplay from "@/components/LocationDisplay";
import UserLayout from "@/layouts/user-layout";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Search,
  MapPin,
  Navigation,
  Building,
  Sparkles,
  Music,
  Filter,
  Users,
  Heart,
  Star,
  MessageSquare,
  ThumbsUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  X
} from "lucide-react";
import {
  prioritizeEventsByCity,
  getDistanceFromLatLonInKm,
  formatDistance
} from "@/lib/geo-utils";
import { EventMood } from "@/lib/mood-utils";
import {
  useEvents,
  useClubs,
  useArtists,
  useUsers,
  useFeedback,
  useFeedbackComments,
  createFeedback,
  createFeedbackComment,
  deleteFeedback,
  deleteFeedbackComment,
  createFeedbackLike,
  deleteFeedbackLike,
  useFeedbackLikes,
  getAllFeedbackComments,
  getAllFeedbackLikes
} from "@/services/servapi";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
  id?: number;
};

// Type d'événement enrichi avec les relations
type EnhancedEvent = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  coverImage: string | null;
  category: string;
  venueName: string;
  price: number;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  participantCount: number;
  popularity: number;
  status: "upcoming" | "planning" | "past" | "cancelled";
  mood?: EventMood;
  isFeatured?: boolean;
  isLiked?: boolean;
  calculatedDistance?: number;
  superLiked?: boolean;

  // Relations
  organizerType: "club" | "artist" | "user";
  organizerId: number;
  createdBy: number;

  // Données enrichies
  club?: {
    id: number;
    name: string;
    profileImage?: string;
    rating: number;
    city: string;
  };

  artist?: {
    id: number;
    displayName: string;
    genres: string[];
    rating: number;
  };

  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };

  artists?: Array<{
    id: number;
    displayName: string;
    genres: string[];
  }>;

  participantCountReal?: number;
};

// Type pour le feedback avec utilisateur
type FeedbackWithUser = {
  id: number;
  reviewerId: number;
  reviewerType: string;
  sourceType: string;
  sourceId: number;
  contextType: string;
  contextId: number;
  title: string;
  rating: number;
  comment: string;
  reply: string | null;
  sourceName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
    username: string;
  };
  isLiked?: boolean;
};

export default function UserExplorerPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("découvrir");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showOnlyMyRegion, setShowOnlyMyRegion] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [showFilters, setShowFilters] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    rating: 5,
    comment: "",
    sourceName: ""
  });
  const [newComment, setNewComment] = useState("");
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(null);
  const [showMenuFeedbackId, setShowMenuFeedbackId] = useState<number | null>(null);
  const { toast } = useToast();

  // Utiliser la géolocalisation
  const { latitude, longitude, city: userCity, country, loading: geoLoading } = useGeolocation();

  // États pour les données
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EnhancedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EnhancedEvent[]>([]);

  // Récupérer TOUS les événements approuvés (upcoming ET planning)
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useEvents({
    // Ne pas filtrer par statut pour récupérer tous les événements
  });

  const { data: clubsData } = useClubs();
  const { data: artistsData } = useArtists();
  const { data: usersData } = useUsers();

  // Modification 7555555

  // Récupérer les feedbacks pour l'événement sélectionné
  const { data: feedbacksData, refetch: refetchFeedbacks } = useFeedback(
    selectedEvent ? { sourceType: "event", sourceId: selectedEvent.id } : undefined
  );

  // Récupérer les commentaires pour tous les feedbacks avec filtre
  const { data: feedbackCommentsData, refetch: refetchFeedbackComments } = useFeedbackComments(
    selectedEvent ? undefined : undefined
  );


  // Récupérer tous les likes pour compter manuellement
  const { data: allFeedbackLikes } = useFeedbackLikes();

  // Récupérer les likes des feedbacks pour l'utilisateur connecté
  const { data: userFeedbackLikes, refetch: refetchUserLikes } = useFeedbackLikes(
    user ? { userId: user.id } : undefined
  );

  // États pour gérer les données enrichies
  const [enrichedFeedbacks, setEnrichedFeedbacks] = useState<FeedbackWithUser[]>([]);


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

  // Enrichir les événements avec les données des relations
  useEffect(() => {
    if (eventsData && clubsData && artistsData && usersData) {
      // Filtrer uniquement les événements approuvés (isApproved: true) et non annulés
      const approvedEvents = eventsData.filter(event =>
        event.isApproved === true && event.status !== "cancelled"
      );

      const enrichedEvents = approvedEvents.map(event => {
        const enhancedEvent: EnhancedEvent = {
          ...event,
          price: Number(event.price),
          latitude: event.latitude ? Number(event.latitude) : undefined,
          longitude: event.longitude ? Number(event.longitude) : undefined,
          isFeatured: event.popularity > 70, // Logique pour déterminer les événements featured
          mood: event.mood as EventMood || undefined
        };

        // Ajouter les données du club si l'organisateur est un club
        if (event.organizerType === 'club') {
          const club = clubsData.find(c => c.id === event.organizerId);
          if (club) {
            enhancedEvent.club = {
              id: club.id,
              name: club.name,
              profileImage: club.profileImage || undefined,
              rating: Number(club.rating),
              city: club.city
            };
          }
        }

        // Ajouter les données de l'artiste si l'organisateur est un artiste
        if (event.organizerType === 'artist') {
          const artist = artistsData.find(a => a.id === event.organizerId);
          if (artist) {
            enhancedEvent.artist = {
              id: artist.id,
              displayName: artist.displayName,
              genres: Array.isArray(artist.genres) ? artist.genres : [],
              rating: Number(artist.rating) || 0
            };
          }
        }

        // Ajouter les données du créateur
        const creator = usersData.find(u => u.id === event.createdBy);
        if (creator) {
          enhancedEvent.creator = {
            id: creator.id,
            firstName: creator.firstName,
            lastName: creator.lastName,
            profileImage: creator.profileImage || undefined
          };
        }

        return enhancedEvent;
      });

      console.log("Événements approuvés chargés:", enrichedEvents.length);
      console.log("Détails des événements:", enrichedEvents);

      setEvents(enrichedEvents);
      setFilteredEvents(enrichedEvents);
      setIsLoading(false);
    }
  }, [eventsData, clubsData, artistsData, usersData]);

  // Enrichir les feedbacks avec les données utilisateur, les likes et les commentaires
  useEffect(() => {
    if (feedbacksData && usersData && userFeedbackLikes && allFeedbackLikes && feedbackCommentsData && selectedEvent) {
      // Filtrer les feedbacks pour ne garder que ceux de l'événement sélectionné
      const eventFeedbacks = feedbacksData.filter(feedback =>
        feedback.sourceType === "event" && feedback.sourceId === selectedEvent.id
      );

      // Compter les likes pour chaque feedback
      const feedbackLikesCount = allFeedbackLikes.reduce((acc, like) => {
        acc[like.feedbackId] = (acc[like.feedbackId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Compter les commentaires pour chaque feedback
      const feedbackCommentsCount = feedbackCommentsData.reduce((acc, comment) => {
        acc[comment.feedbackId] = (acc[comment.feedbackId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Récupérer les commentaires pour chaque feedback
      const commentsByFeedback = feedbackCommentsData.reduce((acc, comment) => {
        if (!acc[comment.feedbackId]) {
          acc[comment.feedbackId] = [];
        }
        acc[comment.feedbackId].push(comment);
        return acc;
      }, {} as Record<number, typeof feedbackCommentsData>);

      // Créer un Set des feedbacks likés par l'utilisateur pour une recherche rapide
      const userLikedFeedbackIds = new Set(
        userFeedbackLikes.map(like => like.feedbackId)
      );

      const newEnrichedFeedbacks = eventFeedbacks.map(feedback => {
        const feedbackUser = usersData.find(u => u.id === feedback.reviewerId);
        const isLikedByUser = userLikedFeedbackIds.has(feedback.id);
        const actualLikesCount = feedbackLikesCount[feedback.id] || 0;
        const actualCommentsCount = feedbackCommentsCount[feedback.id] || 0;
        const feedbackComments = commentsByFeedback[feedback.id] || [];

        return {
          ...feedback,
          likesCount: actualLikesCount,
          commentsCount: actualCommentsCount,
          comments: feedbackComments, // Ajouter les commentaires au feedback
          user: feedbackUser ? {
            id: feedbackUser.id,
            firstName: feedbackUser.firstName,
            lastName: feedbackUser.lastName,
            profileImage: feedbackUser.profileImage,
            username: feedbackUser.username
          } : undefined,
          isLiked: isLikedByUser
        };
      });

      // Mettre à jour seulement lors du chargement initial ou si les données de base changent
      setEnrichedFeedbacks(prev => {
        if (prev.length === 0) return newEnrichedFeedbacks;

        const hasMajorChanges =
          prev.length !== newEnrichedFeedbacks.length ||
          JSON.stringify(prev.map(p => p.id)) !== JSON.stringify(newEnrichedFeedbacks.map(n => n.id)) ||
          JSON.stringify(prev.map(p => p.comment)) !== JSON.stringify(newEnrichedFeedbacks.map(n => n.comment));

        return hasMajorChanges ? newEnrichedFeedbacks : prev;
      });
    }
  }, [feedbacksData, usersData, userFeedbackLikes, allFeedbackLikes, feedbackCommentsData, selectedEvent]);

  // Filtrer les événements selon les critères
  useEffect(() => {
    if (events.length === 0) return;

    let filtered = [...events];

    // Filtre par catégorie
    if (activeCategory !== "all") {
      filtered = filtered.filter(e => e.category === activeCategory);
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        (e.description && e.description.toLowerCase().includes(query)) ||
        e.venueName.toLowerCase().includes(query) ||
        (e.club?.name.toLowerCase().includes(query)) ||
        (e.artist?.displayName.toLowerCase().includes(query)) ||
        (e.creator?.firstName.toLowerCase().includes(query)) ||
        (e.creator?.lastName.toLowerCase().includes(query))
      );
    }

    // Filtre pour n'afficher que les événements de ma région
    if (showOnlyMyRegion && userCity && latitude && longitude) {
      filtered = filtered.filter(event =>
        event.latitude && event.longitude
      );

      filtered = filtered.filter(event => {
        if (!event.latitude || !event.longitude) return false;

        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          event.latitude,
          event.longitude
        );

        event.calculatedDistance = distance;
        return distance <= maxDistance;
      });

      // Trier par distance
      filtered.sort((a, b) => {
        if (!a.calculatedDistance || !b.calculatedDistance) return 0;
        return a.calculatedDistance - b.calculatedDistance;
      });
    }

    // Filtre par distance pour l'onglet "À proximité"
    if (activeTab === "nearby" && latitude && longitude) {
      filtered = filtered.filter(event =>
        event.latitude && event.longitude
      );

      filtered = filtered.filter(event => {
        if (!event.latitude || !event.longitude) return false;

        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          event.latitude,
          event.longitude
        );

        event.calculatedDistance = distance;
        return distance <= maxDistance;
      });

      // Trier par distance
      filtered.sort((a, b) => {
        if (!a.calculatedDistance || !b.calculatedDistance) return 0;
        return a.calculatedDistance - b.calculatedDistance;
      });
    } else if (selectedCity) {
      // Prioriser les événements dans la ville sélectionnée
      filtered = prioritizeEventsByCity(filtered, selectedCity);
    }

    // Filtre pour l'onglet "Tendances" (événements populaires)
    if (activeTab === "tendances") {
      filtered = filtered.filter(e => e.isFeatured || e.popularity > 50);
    }

    setFilteredEvents(filtered);
  }, [activeCategory, searchQuery, activeTab, selectedCity, showOnlyMyRegion, latitude, longitude, maxDistance, events, userCity]);

  // Catégories dynamiques basées sur les événements disponibles
  const categories = ["all", ...new Set(events.map(e => e.category).filter(Boolean))];

  // Gestion des likes
  const handleLikeEvent = (eventId: number) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, isLiked: true } : event
    ));

    toast({
      title: "J'adore!",
      description: "Événement ajouté à vos favoris",
      duration: 2000,
    });
  };

  // Ouvrir le modal de feedback
  const handleOpenFeedback = (event: EnhancedEvent) => {
    setSelectedEvent(event);
    setFeedbackData({
      title: `Avis sur ${event.title}`,
      rating: 5,
      comment: "",
      sourceName: event.title
    });
    setShowFeedbackModal(true);
    refetchFeedbacks();
  };

  // Fermer le modal
  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setSelectedEvent(null);
    setEditingFeedbackId(null);
    setShowMenuFeedbackId(null);
    setNewComment("");
    setEnrichedFeedbacks([]);
  };

  // Soumettre le feedback
  const handleSubmitFeedback = async () => {
    if (!user || !selectedEvent) return;

    try {
      const feedbackPayload = {
        reviewerId: user.id || 0,
        reviewerType: "user" as const,
        sourceType: "event" as const,
        sourceId: selectedEvent.id,
        contextType: "event" as const,
        contextId: selectedEvent.id,
        title: feedbackData.title,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        sourceName: feedbackData.sourceName,
      };

      await createFeedback(feedbackPayload);

      toast({
        title: "Avis publié!",
        description: "Merci pour votre retour sur cet événement",
        duration: 3000,
      });

      setFeedbackData({
        title: "",
        rating: 5,
        comment: "",
        sourceName: ""
      });
      setEditingFeedbackId(null);
      refetchFeedbacks();
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'avis",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Modifier un feedback
  const handleEditFeedback = (feedback: FeedbackWithUser) => {
    setEditingFeedbackId(feedback.id);
    setFeedbackData({
      title: feedback.title,
      rating: feedback.rating,
      comment: feedback.comment,
      sourceName: feedback.sourceName
    });
    setShowMenuFeedbackId(null);
  };

  const handleDeleteFeedback = async (feedbackId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ? Cette action supprimera également tous les commentaires et likes associés.")) return;

    try {
      // Sauvegarder l'état actuel pour rollback en cas d'erreur
      const originalFeedbacks = [...enrichedFeedbacks];

      // Mise à jour OPTIMISTE immédiate
      setEnrichedFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackId));

      // Récupérer tous les commentaires associés à ce feedback
      const allComments = await getAllFeedbackComments();
      const commentsToDelete = allComments.filter(comment => comment.feedbackId === feedbackId);

      // Récupérer tous les likes associés à ce feedback
      const allLikes = await getAllFeedbackLikes();
      const likesToDelete = allLikes.filter(like => like.feedbackId === feedbackId);

      // Supprimer d'abord tous les commentaires associés
      for (const comment of commentsToDelete) {
        await deleteFeedbackComment(comment.id);
      }

      // Supprimer ensuite tous les likes associés
      for (const like of likesToDelete) {
        await deleteFeedbackLike(feedbackId, like.userId);
      }

      // Enfin supprimer le feedback
      await deleteFeedback(feedbackId);

      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès",
        duration: 3000,
      });

      // Recharger les données
      refetchFeedbacks();
      refetchFeedbackComments();

    } catch (error) {
      console.error("Erreur lors de la suppression:", error);

      // En cas d'erreur, restaurer l'état précédent
      setEnrichedFeedbacks(originalFeedbacks);

      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddComment = async (feedbackId: number) => {
    if (!user || !newComment.trim()) return;

    try {
      // Créer le nouveau commentaire
      const newCommentData = await createFeedbackComment({
        feedbackId,
        userId: user.id || 0,
        content: newComment.trim()
      });

      // Mise à jour OPTIMISTE immédiate
      setEnrichedFeedbacks(prev => prev.map(feedback => {
        if (feedback.id === feedbackId) {
          const currentUser = usersData?.find(u => u.id === user.id);
          const newCommentWithUser = {
            ...newCommentData,
            user: currentUser ? {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              profileImage: currentUser.profileImage,
              username: currentUser.username
            } : undefined
          };

          return {
            ...feedback,
            commentsCount: (feedback.commentsCount || 0) + 1,
            comments: [...(feedback.comments || []), newCommentWithUser]
          };
        }
        return feedback;
      }));

      setNewComment("");
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié",
        duration: 2000,
      });

    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive",
        duration: 3000,
      });
    }
  };


  // Gérer les likes sur les feedbacks
  const handleLikeFeedback = async (feedbackId: number) => {
    if (!user) return;

    try {
      const feedback = enrichedFeedbacks.find(f => f.id === feedbackId);
      const isCurrentlyLiked = feedback?.isLiked;

      // Sauvegarder l'état actuel pour rollback en cas d'erreur
      const originalFeedbacks = [...enrichedFeedbacks];

      // Mise à jour OPTIMISTE immédiate
      setEnrichedFeedbacks(prev => prev.map(f => {
        if (f.id === feedbackId) {
          return {
            ...f,
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? Math.max(0, f.likesCount - 1) : f.likesCount + 1
          };
        }
        return f;
      }));

      if (isCurrentlyLiked) {
        await deleteFeedbackLike(feedbackId, user.id || 0);
        toast({
          title: "Like retiré",
          duration: 1500,
        });
      } else {
        await createFeedbackLike({
          feedbackId,
          userId: user.id || 0
        });
        toast({
          title: "Like ajouté",
          duration: 1500,
        });
      }

      // NE RIEN RECHARGER du tout - on fait confiance à la mise à jour optimiste

    } catch (error) {
      console.error("Erreur lors du like:", error);

      // En cas d'erreur, restaurer l'état précédent
      setEnrichedFeedbacks(originalFeedbacks);

      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setShowOnlyMyRegion(false);
    setMaxDistance(25);
    setSelectedCity(null);
    setActiveTab("découvrir");
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Générer les étoiles pour la notation
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  if (eventsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground mb-4">
            Impossible de charger les événements
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Espace pour l'en-tête géré par UserLayout */}
      <div className="mb-4"></div>

      {/* Header responsive */}
      <div className="mb-6 space-y-4">
        {/* Entête avec titre et localisation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl lg:text-3xl font-semibold flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            Explorer
          </h2>
          <LocationDisplay
            displayMode="badge"
            onCitySelect={setSelectedCity}
          />
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des événements, artistes, clubs..."
            className="pl-9 bg-muted border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtres organisés pour desktop */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Filtres</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Catégories */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégories</label>
              <div className="overflow-x-auto pb-2">
                <CategoryFilter
                  categories={categories.map(c => c === 'all' ? 'Tous' : c)}
                  activeCategory={activeCategory === 'all' ? 'Tous' : activeCategory}
                  onChange={(category) => setActiveCategory(category === 'Tous' ? 'all' : category)}
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Localisation</label>
              <div className="flex flex-col space-y-3">
                {userCity && (
                  <Button
                    variant={showOnlyMyRegion ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => setShowOnlyMyRegion(!showOnlyMyRegion)}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {showOnlyMyRegion ? "Voir tous" : `Ma région (${userCity})`}
                  </Button>
                )}

                {(activeTab === "nearby" || showOnlyMyRegion) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs flex items-center">
                        <Navigation className="h-3 w-3 mr-1" />
                        Rayon: <span className="font-medium ml-1">{maxDistance} km</span>
                      </span>
                    </div>
                    <Slider
                      value={[maxDistance]}
                      min={5}
                      max={200}
                      step={5}
                      onValueChange={(values) => setMaxDistance(values[0])}
                      className="py-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Onglets */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Explorer par</label>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="découvrir" className="flex-1 text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    Découvrir
                  </TabsTrigger>
                  <TabsTrigger value="tendances" className="flex-1 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Tendances
                  </TabsTrigger>
                  <TabsTrigger value="nearby" className="flex-1 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Proximité
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Section Artistes Tendance */}
      {artistsData && (
        <div className="mb-6 bg-card rounded-lg p-4 border border-border">
          <h3 className="font-medium mb-3">Artistes Tendance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {artistsData?.slice(0, 4).map((artist) => (
              <div key={artist.id} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <Music className="h-4 w-4 text-primary" />
                </div>
                <span className="truncate text-sm">{artist.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {(isLoading || eventsLoading) && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2">Chargement des événements...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !eventsLoading && filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || activeCategory !== "all" || activeTab === "tendances" || showOnlyMyRegion
              ? "Essayez de modifier vos filtres ou votre recherche"
              : "Aucun événement à venir disponible"
            }
          </p>
          {(searchQuery || activeCategory !== "all" || showOnlyMyRegion) && (
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      )}

      {/* Affichage des événements en Grid */}
      {!isLoading && !eventsLoading && filteredEvents.length > 0 && (
        <div className="space-y-6">
          {/* En-tête avec informations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="font-normal">
                <MapPin className="h-3 w-3 mr-1" />
                {showOnlyMyRegion ? `${userCity} • ${maxDistance} km` :
                  selectedCity ? selectedCity : "Toutes les régions"}
                <span className="ml-1">({filteredEvents.length})</span>
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {events.filter(e => e.status === 'upcoming').length} à venir
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {events.filter(e => e.status === 'planning').length} en planification
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              Tous les événements approuvés - Clubs, Artistes et Utilisateurs
            </div>
          </div>

          {/* Affichage Grid pour desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative group">
                <EventCard event={event} />

                {/* Badges d'information supplémentaires */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {/* Badge type d'organisateur */}
                  <Badge variant="secondary" className="text-xs">
                    {event.organizerType === 'club' && <Building className="h-3 w-3 mr-1" />}
                    {event.organizerType === 'artist' && <Music className="h-3 w-3 mr-1" />}
                    {event.organizerType === 'user' && <Users className="h-3 w-3 mr-1" />}
                    {event.organizerType === 'club' && 'Club'}
                    {event.organizerType === 'artist' && 'Artiste'}
                    {event.organizerType === 'user' && 'Utilisateur'}
                  </Badge>

                  {/* Badge statut */}
                  <Badge variant="outline" className="text-xs bg-background/80">
                    {event.status === 'upcoming' && 'À venir'}
                    {event.status === 'planning' && 'En planification'}
                    {event.status === 'past' && 'Passé'}
                  </Badge>

                  {/* Badge nom de l'organisateur */}
                  {event.club && (
                    <Badge variant="outline" className="text-xs bg-background/80">
                      {event.club.name}
                    </Badge>
                  )}
                  {event.artist && (
                    <Badge variant="outline" className="text-xs bg-background/80">
                      {event.artist.displayName}
                    </Badge>
                  )}
                  {event.creator && !event.club && !event.artist && (
                    <Badge variant="outline" className="text-xs bg-background/80">
                      {event.creator.firstName} {event.creator.lastName}
                    </Badge>
                  )}

                  {/* Badge distance */}
                  {event.calculatedDistance && (
                    <Badge variant="outline" className="text-xs bg-background/80">
                      <MapPin className="h-3 w-3 mr-1" />
                      {formatDistance(event.calculatedDistance)}
                    </Badge>
                  )}

                  {/* Badge featured */}
                  {event.isFeatured && (
                    <Badge variant="default" className="text-xs bg-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Tendance
                    </Badge>
                  )}
                </div>

                {/* Bouton de feedback */}
                <div className="absolute top-2 right-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-background/80 backdrop-blur-sm"
                    onClick={() => handleOpenFeedback(event)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Avis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de feedback */}
      {showFeedbackModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden border border-border flex flex-col">
            {/* En-tête du modal */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Avis sur {selectedEvent.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseFeedback}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mt-1">
                Partagez votre expérience et voyez ce que les autres en pensent
              </p>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Formulaire d'avis */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">
                    {editingFeedbackId ? "Modifier votre avis" : "Donner votre avis"}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Titre</label>
                      <Input
                        value={feedbackData.title}
                        onChange={(e) => setFeedbackData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Titre de votre avis"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Note</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant={feedbackData.rating >= star ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                          >
                            {star} ★
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Commentaire</label>
                      <textarea
                        value={feedbackData.comment}
                        onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Partagez votre expérience..."
                        className="w-full min-h-[100px] p-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      {editingFeedbackId && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingFeedbackId(null);
                            setFeedbackData({
                              title: "",
                              rating: 5,
                              comment: "",
                              sourceName: ""
                            });
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackData.title || !feedbackData.comment}
                      >
                        {editingFeedbackId ? "Modifier" : "Publier"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Liste des avis */}
                <div>
                  <h4 className="font-medium mb-4">
                    Avis de la communauté ({enrichedFeedbacks.length})
                  </h4>

                  {enrichedFeedbacks.length > 0 ? (
                    <div className="space-y-4">
                      {enrichedFeedbacks.map((feedback) => (
                        <div key={feedback.id} className="border border-border rounded-lg p-4">
                          {/* En-tête de l'avis */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={feedback.user?.profileImage} />
                                <AvatarFallback>
                                  {feedback.user?.firstName?.[0]}{feedback.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {feedback.user?.firstName} {feedback.user?.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(feedback.createdAt)}
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="flex text-yellow-500">
                                    {renderStars(feedback.rating)}
                                  </div>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {feedback.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Menu d'options pour l'utilisateur connecté */}
                            {user?.id === feedback.reviewerId && (
                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowMenuFeedbackId(
                                    showMenuFeedbackId === feedback.id ? null : feedback.id
                                  )}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                {showMenuFeedbackId === feedback.id && (
                                  <div className="absolute right-0 top-8 bg-background border border-border rounded-md shadow-lg z-10 w-32">
                                    <button
                                      onClick={() => handleEditFeedback(feedback)}
                                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted"
                                    >
                                      <Edit className="h-3 w-3 mr-2" />
                                      Modifier
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFeedback(feedback.id)}
                                      className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Supprimer
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Contenu de l'avis */}
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">{feedback.title}</h5>
                            <p className="text-sm">{feedback.comment}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeFeedback(feedback.id)}
                                className={feedback.isLiked ? "text-primary" : ""}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {feedback.likesCount}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {feedback.commentsCount}
                              </Button>
                            </div>
                          </div>

                          {/* Section commentaires */}
                          <div className="mt-4 pt-4 border-t border-border">
                            {/* Affichage des commentaires existants */}
                            {feedback.comments && feedback.comments.length > 0 && (
                              <div className="space-y-3 mb-4">
                                {feedback.comments.map((comment) => (
                                  <div key={comment.id} className="flex space-x-3">
                                    <Avatar className="h-6 w-6 mt-1">
                                      <AvatarFallback className="text-xs">
                                        {usersData?.find(u => u.id === comment.userId)?.firstName?.[0]}
                                        {usersData?.find(u => u.id === comment.userId)?.lastName?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="bg-muted rounded-lg p-3">
                                        <p className="font-medium text-sm">
                                          {usersData?.find(u => u.id === comment.userId)?.firstName}
                                          {usersData?.find(u => u.id === comment.userId)?.lastName}
                                        </p>
                                        <p className="text-sm mt-1">{comment.content}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Formulaire pour ajouter un nouveau commentaire */}
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Ajouter un commentaire..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => handleAddComment(feedback.id)}
                                disabled={!newComment.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Soyez le premier à donner votre avis sur cet événement !</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}