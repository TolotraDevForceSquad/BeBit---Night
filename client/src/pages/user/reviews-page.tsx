import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, MessageSquare, Star, Edit2, Trash2, Calendar, MapPin, User, ThumbsUp, ThumbsDown } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

// Type pour les avis
type Review = {
  id: number;
  targetType: "event" | "artist" | "club";
  targetId: number;
  targetName: string;
  targetImage?: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  userReaction?: "like" | "dislike" | null;
  status: "published" | "pending" | "flagged";
};

// Données fictives pour les avis
const mockReviews: Review[] = [
  {
    id: 1,
    targetType: "event",
    targetId: 101,
    targetName: "Soirée Techno",
    targetImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    rating: 4,
    content: "Ambiance incroyable et excellente programmation musicale. Seul bémol, les files d'attente au bar étaient trop longues. Je recommande vraiment cet événement à tous les amateurs de techno !",
    date: "2023-12-05T14:30:00",
    likes: 12,
    dislikes: 1,
    userReaction: "like",
    status: "published"
  },
  {
    id: 2,
    targetType: "club",
    targetId: 201,
    targetName: "Club Oxygen",
    targetImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000",
    rating: 5,
    content: "Le meilleur club de la ville ! Son de qualité, staff accueillant et bonne sélection de boissons. J'y retournerai sans hésitation pour les prochaines soirées.",
    date: "2023-11-20T23:45:00",
    likes: 8,
    dislikes: 0,
    userReaction: null,
    status: "published"
  },
  {
    id: 3,
    targetType: "artist",
    targetId: 301,
    targetName: "DJ Elektra",
    targetImage: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 3,
    content: "Performance correcte mais sans grande originalité. Le mix était bon techniquement mais manquait d'énergie et de transitions surprenantes.",
    date: "2023-10-15T01:15:00",
    likes: 3,
    dislikes: 2,
    userReaction: null,
    status: "published"
  },
  {
    id: 4,
    targetType: "event",
    targetId: 102,
    targetName: "Festival EDM",
    targetImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
    rating: 2,
    content: "Organisation catastrophique. Files d'attente interminables, problèmes de son et prix excessifs. Très déçu de cette édition qui était bien meilleure l'année dernière.",
    date: "2023-10-02T19:20:00",
    likes: 15,
    dislikes: 4,
    userReaction: "like",
    status: "published"
  }
];

export default function ReviewsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newContent, setNewContent] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
    
    // Simuler un chargement des avis
    setReviews(mockReviews);
  }, []);

  // Filtrer les avis selon l'onglet actif
  const filteredReviews = reviews.filter(review => {
    if (activeTab === "all") {
      return true;
    } else if (activeTab === "events" && review.targetType === "event") {
      return true;
    } else if (activeTab === "clubs" && review.targetType === "club") {
      return true;
    } else if (activeTab === "artists" && review.targetType === "artist") {
      return true;
    }
    
    return false;
  });

  // Modifier un avis
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewContent(review.content);
    setIsEditDialogOpen(true);
  };
  
  // Sauvegarder les modifications d'un avis
  const handleSaveEdit = () => {
    if (!editingReview) return;
    
    setReviews(reviews.map(review => 
      review.id === editingReview.id 
        ? { ...review, content: newContent } 
        : review
    ));
    
    setIsEditDialogOpen(false);
    setEditingReview(null);
    setNewContent("");
  };
  
  // Supprimer un avis
  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter(review => review.id !== id));
  };
  
  // Réagir à un avis (like/dislike)
  const handleReaction = (id: number, reaction: "like" | "dislike") => {
    setReviews(reviews.map(review => {
      if (review.id !== id) return review;
      
      const currentReaction = review.userReaction;
      let likes = review.likes;
      let dislikes = review.dislikes;
      
      // Annuler la réaction précédente s'il y en a une
      if (currentReaction === "like") likes--;
      if (currentReaction === "dislike") dislikes--;
      
      // Appliquer la nouvelle réaction sauf si c'est la même (toggle)
      if (currentReaction !== reaction) {
        if (reaction === "like") likes++;
        if (reaction === "dislike") dislikes++;
        
        return {
          ...review,
          likes,
          dislikes,
          userReaction: reaction
        };
      } else {
        // Toggle la réaction
        return {
          ...review,
          likes,
          dislikes,
          userReaction: null
        };
      }
    }));
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Mes avis</h1>
    </div>
  );

  return (
    <ResponsiveLayout activeItem="reviews" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mes avis</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {reviews.length} avis publiés
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
            <TabsTrigger value="events" className="flex-1">Événements</TabsTrigger>
            <TabsTrigger value="clubs" className="flex-1">Clubs</TabsTrigger>
            <TabsTrigger value="artists" className="flex-1">Artistes</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Aucun avis pour le moment
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore publié d'avis dans cette catégorie
                </p>
                <Button className="mt-4">Explorer les événements</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onEdit={() => handleEditReview(review)}
                    onDelete={() => handleDeleteReview(review.id)}
                    onReaction={(reaction) => handleReaction(review.id, reaction)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogue de modification d'avis */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier votre avis</DialogTitle>
            <DialogDescription>
              Mettez à jour votre commentaire sur {editingReview?.targetName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < (editingReview?.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {editingReview?.rating}/5
              </span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Votre commentaire</Label>
              <Textarea
                id="comment"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}

// Composant pour afficher un avis
interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (reaction: "like" | "dislike") => void;
}

function ReviewCard({ review, onEdit, onDelete, onReaction }: ReviewCardProps) {
  const formattedDate = format(new Date(review.date), "d MMMM yyyy", { locale: fr });
  
  // Obtenir l'icône du type cible
  let targetIcon;
  if (review.targetType === "event") {
    targetIcon = <Calendar className="h-4 w-4" />;
  } else if (review.targetType === "club") {
    targetIcon = <MapPin className="h-4 w-4" />;
  } else if (review.targetType === "artist") {
    targetIcon = <User className="h-4 w-4" />;
  }
  
  // Obtenir la couleur du badge de statut
  let statusColor = "";
  let statusText = "";
  if (review.status === "published") {
    statusColor = "bg-green-100 text-green-700";
    statusText = "Publié";
  } else if (review.status === "pending") {
    statusColor = "bg-yellow-100 text-yellow-700";
    statusText = "En attente";
  } else if (review.status === "flagged") {
    statusColor = "bg-red-100 text-red-700";
    statusText = "Signalé";
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {review.targetImage ? (
              <div className="h-12 w-12 rounded-md overflow-hidden">
                <img 
                  src={review.targetImage} 
                  alt={review.targetName} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                {targetIcon}
              </div>
            )}
            
            <div>
              <CardTitle className="text-base">
                {review.targetName}
              </CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="font-normal text-xs">
                  {review.targetType === "event" ? "Événement" : 
                   review.targetType === "club" ? "Club" : "Artiste"}
                </Badge>
                <Badge className={`${statusColor} text-xs font-normal`}>
                  {statusText}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="mb-3">
          <p className="text-sm">{review.content}</p>
          <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 px-2 ${review.userReaction === "like" ? "text-green-600" : ""}`}
              onClick={() => onReaction("like")}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${review.userReaction === "like" ? "fill-current" : ""}`} />
              {review.likes}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 px-2 ${review.userReaction === "dislike" ? "text-red-600" : ""}`}
              onClick={() => onReaction("dislike")}
            >
              <ThumbsDown className={`h-4 w-4 mr-1 ${review.userReaction === "dislike" ? "fill-current" : ""}`} />
              {review.dislikes}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'avis sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}