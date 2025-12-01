import { useState, useEffect } from "react";
import { 
  Star, 
  StarHalf, 
  Calendar, 
  Music, 
  Building, 
  Heart, 
  MessageSquare, 
  Trash2, 
  Edit,
  Filter,
  ArrowUpDown,
  Search,
  Send,
  Users
} from "lucide-react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "../../hooks/use-toast";

// Import des services pour les feedbacks réels
import {
  useFeedback,
  useFeedbackComments,
  createFeedback,
  createFeedbackComment,
  deleteFeedback,
  deleteFeedbackComment,
  createFeedbackLike,
  deleteFeedbackLike,
  useFeedbackLikes,
  useUsers,
  useEvents,
  useClubs,
  useArtists,
  updateFeedback
} from "../../services/servapi";

// Types
interface Review {
  id: number;
  title: string;
  comment: string;
  rating: number;
  createdAt: string;
  sourceType: "event" | "club" | "artist" | "user";
  sourceId: number;
  sourceName: string;
  contextType: "event" | "other";
  contextId?: number;
  reviewerId: number;
  reviewerType: "user" | "artist" | "club";
  reply: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
    username: string;
  };
  entityImage?: string;
  comments?: FeedbackComment[];
}

interface FeedbackComment {
  id: number;
  feedbackId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
    username: string;
  };
}

// Type pour l'utilisateur authentifié
type AuthUser = {
  id: number;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};

export default function ReviewsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "event" | "club" | "artist">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [filterRating, setFilterRating] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  
  // État pour l'utilisateur connecté
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // États pour les données réelles
  const [reviews, setReviews] = useState<Review[]>([]);
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
  
  // Services pour récupérer les données réelles
  const { data: feedbacksData, refetch: refetchFeedbacks } = useFeedback(
    user ? { reviewerId: user.id } : undefined
  );
  
  const { data: feedbackCommentsData, refetch: refetchFeedbackComments } = useFeedbackComments();
  
  const { data: allFeedbackLikes } = useFeedbackLikes();
  
  const { data: userFeedbackLikes, refetch: refetchUserLikes } = useFeedbackLikes(
    user ? { userId: user.id } : undefined
  );
  
  const { data: usersData } = useUsers();
  const { data: eventsData } = useEvents();
  const { data: clubsData } = useClubs();
  const { data: artistsData } = useArtists();
  
  // Enrichir les reviews avec les données réelles
  useEffect(() => {
    if (feedbacksData && usersData && userFeedbackLikes && allFeedbackLikes && feedbackCommentsData && user) {
      // Filtrer les feedbacks pour ne garder que ceux de l'utilisateur connecté
      const userFeedbacks = feedbacksData.filter(feedback => 
        feedback.reviewerId === user.id
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
      
      // Organiser les commentaires par feedback
      const commentsByFeedback = feedbackCommentsData.reduce((acc, comment) => {
        if (!acc[comment.feedbackId]) {
          acc[comment.feedbackId] = [];
        }
        
        // Enrichir le commentaire avec les données utilisateur
        const commentUser = usersData.find(u => u.id === comment.userId);
        const enrichedComment: FeedbackComment = {
          ...comment,
          user: commentUser ? {
            id: commentUser.id,
            firstName: commentUser.firstName,
            lastName: commentUser.lastName,
            profileImage: commentUser.profileImage,
            username: commentUser.username
          } : undefined
        };
        
        acc[comment.feedbackId].push(enrichedComment);
        return acc;
      }, {} as Record<number, FeedbackComment[]>);
      
      // Créer un Set des feedbacks likés par l'utilisateur
      const userLikedFeedbackIds = new Set(
        userFeedbackLikes.map(like => like.feedbackId)
      );
      
      // Enrichir les feedbacks avec les données des entités et utilisateurs
      const enrichedReviews = userFeedbacks.map(feedback => {
        const feedbackUser = usersData.find(u => u.id === feedback.reviewerId);
        const isLikedByUser = userLikedFeedbackIds.has(feedback.id);
        const actualLikesCount = feedbackLikesCount[feedback.id] || 0;
        const actualCommentsCount = feedbackCommentsCount[feedback.id] || 0;
        const feedbackComments = commentsByFeedback[feedback.id] || [];
        
        // Déterminer l'image de l'entité selon le type
        let entityImage = "";
        if (feedback.sourceType === "event") {
          const event = eventsData?.find(e => e.id === feedback.sourceId);
          entityImage = event?.coverImage || "";
        } else if (feedback.sourceType === "club") {
          const club = clubsData?.find(c => c.id === feedback.sourceId);
          entityImage = club?.profileImage || "";
        } else if (feedback.sourceType === "artist") {
          const artist = artistsData?.find(a => a.id === feedback.sourceId);
          entityImage = artist?.profileImage || "";
        } else if (feedback.sourceType === "user") {
          const targetUser = usersData?.find(u => u.id === feedback.sourceId);
          entityImage = targetUser?.profileImage || "";
        }
        
        return {
          id: feedback.id,
          title: feedback.title,
          comment: feedback.comment,
          rating: feedback.rating,
          createdAt: feedback.createdAt,
          sourceType: feedback.sourceType as "event" | "club" | "artist" | "user",
          sourceId: feedback.sourceId,
          sourceName: feedback.sourceName,
          contextType: feedback.contextType as "event" | "other",
          contextId: feedback.contextId,
          reviewerId: feedback.reviewerId,
          reviewerType: feedback.reviewerType as "user" | "artist" | "club",
          reply: feedback.reply,
          likesCount: actualLikesCount,
          commentsCount: actualCommentsCount,
          isLiked: isLikedByUser,
          user: feedbackUser ? {
            id: feedbackUser.id,
            firstName: feedbackUser.firstName,
            lastName: feedbackUser.lastName,
            profileImage: feedbackUser.profileImage,
            username: feedbackUser.username
          } : undefined,
          entityImage: entityImage,
          comments: feedbackComments
        };
      });
      
      setReviews(enrichedReviews);
      setIsLoading(false);
    }
  }, [feedbacksData, usersData, userFeedbackLikes, allFeedbackLikes, feedbackCommentsData, user, eventsData, clubsData, artistsData]);
  
  // Filtrer les avis selon l'onglet actif, la recherche et les filtres
  const filteredReviews = reviews
    .filter(review => {
      // Filtrer par type (ignorer les feedbacks sur les utilisateurs)
      if (activeTab !== "all" && review.sourceType !== activeTab) {
        return false;
      }
      
      // Filtrer par notation
      if (filterRating && review.rating.toString() !== filterRating) {
        return false;
      }
      
      // Filtrer par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          review.title.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.sourceName.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Trier selon l'ordre sélectionné
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      switch (sortOrder) {
        case "latest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  
  // Fonction pour supprimer un avis
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;
    
    try {
      // Mise à jour optimiste
      const originalReviews = [...reviews];
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      await deleteFeedback(reviewId);
      
      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès.",
        variant: "default",
      });
      
      // Recharger les données
      refetchFeedbacks();
      
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      // Restaurer en cas d'erreur
      setReviews(originalReviews);
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour aimer/ne plus aimer un avis
  const handleLikeReview = async (reviewId: number) => {
    if (!user) return;
    
    try {
      const review = reviews.find(r => r.id === reviewId);
      const isCurrentlyLiked = review?.isLiked;
      
      // Sauvegarder l'état actuel pour rollback
      const originalReviews = [...reviews];
      
      // Mise à jour optimiste
      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
          };
        }
        return r;
      }));
      
      if (isCurrentlyLiked) {
        await deleteFeedbackLike(reviewId, user.id);
      } else {
        await createFeedbackLike({
          feedbackId: reviewId,
          userId: user.id
        });
      }
      
      // Recharger les likes utilisateur
      refetchUserLikes();
      
    } catch (error) {
      console.error("Erreur lors du like:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour éditer un avis
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditDialog(true);
  };
  
  // Fonction pour enregistrer les modifications d'un avis
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReview || !user) return;
    
    const title = (document.getElementById("edit-title") as HTMLInputElement).value;
    const comment = (document.getElementById("edit-content") as HTMLTextAreaElement).value;
    const rating = parseInt((document.getElementById("edit-rating") as HTMLSelectElement).value);
    
    if (!title || !comment || !rating) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Mise à jour optimiste
      setReviews(prev => prev.map(review => {
        if (review.id === editingReview.id) {
          return {
            ...review,
            title,
            comment,
            rating
          };
        }
        return review;
      }));
      
      // Mettre à jour le feedback dans la base de données
      await updateFeedback(editingReview.id, {
        title,
        comment,
        rating
      });
      
      toast({
        title: "Avis mis à jour",
        description: "Votre avis a été mis à jour avec succès.",
        variant: "default",
      });
      
      setShowEditDialog(false);
      setEditingReview(null);
      
      // Recharger les données
      refetchFeedbacks();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'avis.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour ajouter un commentaire
  const handleAddComment = async (feedbackId: number) => {
    if (!user || !commentInputs[feedbackId]?.trim()) return;
    
    try {
      const newCommentData = await createFeedbackComment({
        feedbackId,
        userId: user.id,
        content: commentInputs[feedbackId].trim()
      });
      
      // Mise à jour optimiste
      setReviews(prev => prev.map(review => {
        if (review.id === feedbackId) {
          const currentUser = usersData?.find(u => u.id === user.id);
          const newComment: FeedbackComment = {
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
            ...review,
            commentsCount: (review.commentsCount || 0) + 1,
            comments: [...(review.comments || []), newComment]
          };
        }
        return review;
      }));
      
      // Réinitialiser l'input
      setCommentInputs(prev => ({ ...prev, [feedbackId]: "" }));
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié.",
        variant: "default",
      });
      
      // Recharger les commentaires
      refetchFeedbackComments();
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour supprimer un commentaire
  const handleDeleteComment = async (commentId: number, feedbackId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
    
    try {
      // Mise à jour optimiste
      setReviews(prev => prev.map(review => {
        if (review.id === feedbackId) {
          return {
            ...review,
            commentsCount: Math.max(0, (review.commentsCount || 0) - 1),
            comments: review.comments?.filter(comment => comment.id !== commentId) || []
          };
        }
        return review;
      }));
      
      await deleteFeedbackComment(commentId);
      
      toast({
        title: "Commentaire supprimé",
        description: "Le commentaire a été supprimé avec succès.",
        variant: "default",
      });
      
      // Recharger les commentaires
      refetchFeedbackComments();
      
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour mettre à jour un commentaire
  const handleUpdateComment = async (commentId: number, feedbackId: number, content: string) => {
    if (!content.trim()) return;
    
    try {
      // Mise à jour optimiste
      setReviews(prev => prev.map(review => {
        if (review.id === feedbackId) {
          return {
            ...review,
            comments: review.comments?.map(comment => 
              comment.id === commentId ? { ...comment, content } : comment
            ) || []
          };
        }
        return review;
      }));
      
      // Note: Vous devrez implémenter une fonction updateFeedbackComment dans servapi.ts
      // Pour l'instant, nous allons simuler la mise à jour
      console.log("Commentaire à mettre à jour:", { commentId, content });
      
      setEditingCommentId(null);
      
      toast({
        title: "Commentaire mis à jour",
        description: "Votre commentaire a été modifié avec succès.",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du commentaire:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le commentaire.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour générer les étoiles selon la note
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }
    
    return stars;
  };
  
  // Fonction pour obtenir l'icône du type d'entité
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "artist":
        return <Music className="h-4 w-4" />;
      case "club":
        return <Building className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Obtenir le nom du type d'entité en français
  const getEntityTypeName = (type: string) => {
    switch (type) {
      case "event":
        return "Événement";
      case "artist":
        return "Artiste";
      case "club":
        return "Club";
      case "user":
        return "Utilisateur";
      default:
        return "Autre";
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Mes avis</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtrer par note</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterRating("")}>
                Toutes les notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("5")}>
                5 étoiles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("4")}>
                4 étoiles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("3")}>
                3 étoiles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("2")}>
                2 étoiles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("1")}>
                1 étoile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Trier
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder("latest")}>
                Plus récents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Plus anciens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("highest")}>
                Meilleures notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("lowest")}>
                Moins bonnes notes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="event">Événements</TabsTrigger>
          <TabsTrigger value="artist">Artistes</TabsTrigger>
          <TabsTrigger value="club">Clubs</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h3 className="text-xl font-medium">Chargement des avis...</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                Récupération de vos avis depuis le serveur
              </p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Aucun avis trouvé</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                {searchQuery
                  ? "Aucun avis ne correspond à votre recherche. Essayez d'autres termes."
                  : filterRating
                  ? `Vous n'avez pas encore donné d'avis avec ${filterRating} étoiles.`
                  : activeTab === "all"
                  ? "Vous n'avez pas encore donné d'avis."
                  : `Vous n'avez pas encore donné d'avis sur des ${
                      activeTab === "event"
                        ? "événements"
                        : activeTab === "artist"
                        ? "artistes"
                        : "clubs"
                    }.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getEntityIcon(review.sourceType)}
                          <span>{getEntityTypeName(review.sourceType)}</span>
                        </Badge>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditReview(review)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={review.entityImage}
                          alt={review.sourceName}
                        />
                        <AvatarFallback>
                          {review.sourceName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-medium line-clamp-1">
                          {review.sourceName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {formatDate(review.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <h3 className="font-medium text-sm mb-1">{review.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    
                    {/* Réponse du propriétaire */}
                    {review.reply && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium mb-1">Réponse :</p>
                        <p className="text-sm">{review.reply}</p>
                      </div>
                    )}
                    
                    {/* Section commentaires */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">
                          {review.commentsCount} commentaire{review.commentsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Liste des commentaires */}
                      {review.comments && review.comments.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {review.comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <Avatar className="h-6 w-6 mt-1">
                                <AvatarImage src={comment.user?.profileImage} />
                                <AvatarFallback className="text-xs">
                                  {comment.user?.firstName?.[0]}{comment.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted rounded-lg p-3">
                                  <div className="flex justify-between items-start">
                                    <p className="font-medium text-sm">
                                      {comment.user?.firstName} {comment.user?.lastName}
                                    </p>
                                    {comment.userId === user?.id && (
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setEditingCommentId(
                                            editingCommentId === comment.id ? null : comment.id
                                          )}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive"
                                          onClick={() => handleDeleteComment(comment.id, review.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {editingCommentId === comment.id ? (
                                    <div className="mt-2">
                                      <Input
                                        defaultValue={comment.content}
                                        onBlur={(e) => handleUpdateComment(comment.id, review.id, e.target.value)}
                                        className="text-sm"
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-sm mt-1">{comment.content}</p>
                                  )}
                                  
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {formatDate(comment.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Formulaire pour ajouter un commentaire */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Ajouter un commentaire..."
                          value={commentInputs[review.id] || ""}
                          onChange={(e) => setCommentInputs(prev => ({ 
                            ...prev, 
                            [review.id]: e.target.value 
                          }))}
                          className="flex-1 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(review.id);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleAddComment(review.id)}
                          disabled={!commentInputs[review.id]?.trim()}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleLikeReview(review.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${
                        review.isLiked ? "fill-red-500 text-red-500" : ""
                      }`} />
                      <span>{review.likesCount}</span>
                    </Button>
                    
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{review.commentsCount}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Boîte de dialogue d'édition d'avis */}
      {editingReview && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier votre avis</DialogTitle>
              <DialogDescription>
                Modifiez votre avis sur {editingReview.sourceName}.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  defaultValue={editingReview.title}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Votre avis</Label>
                <Textarea
                  id="edit-content"
                  defaultValue={editingReview.comment}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Note</Label>
                <Select defaultValue={editingReview.rating.toString()}>
                  <SelectTrigger id="edit-rating">
                    <SelectValue placeholder="Choisir une note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Votre note</SelectLabel>
                      <SelectItem value="5">5 étoiles - Excellent</SelectItem>
                      <SelectItem value="4">4 étoiles - Très bien</SelectItem>
                      <SelectItem value="3">3 étoiles - Bien</SelectItem>
                      <SelectItem value="2">2 étoiles - Moyen</SelectItem>
                      <SelectItem value="1">1 étoile - Mauvais</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}