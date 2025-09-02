import { useState } from "react";
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
  Search
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
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "../../hooks/use-toast";

// Types
interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  date: string;
  type: "club" | "artist" | "event";
  entityId: string;
  entityName: string;
  entityImage?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export default function ReviewsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [filterRating, setFilterRating] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // État pour les avis de l'utilisateur
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      title: "Excellente ambiance !",
      content: "Une soirée incroyable avec une super ambiance. Le DJ était exceptionnel, les lumières et le son parfaits. Je recommande vivement !",
      rating: 5,
      date: "2023-08-15T21:30:00Z",
      type: "event",
      entityId: "e1",
      entityName: "Festival Hip Hop Summer",
      entityImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop",
      likes: 24,
      comments: 3,
      isLiked: true
    },
    {
      id: "r2",
      title: "DJ incroyable !",
      content: "Une excellente performance, très bon mix et interaction avec le public.",
      rating: 5,
      date: "2023-08-01T23:15:00Z",
      type: "artist",
      entityId: "a1",
      entityName: "DJ Elektra",
      entityImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
      likes: 12,
      comments: 2,
      isLiked: false
    },
    {
      id: "r3",
      title: "Bonne ambiance mais trop bondé",
      content: "J'ai apprécié la musique et l'atmosphère, mais il y avait trop de monde et c'était difficile de se déplacer. Le service au bar était lent.",
      rating: 3,
      date: "2023-07-20T22:45:00Z",
      type: "club",
      entityId: "c1",
      entityName: "Club Oxygen",
      entityImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=100&h=100&fit=crop",
      likes: 8,
      comments: 5,
      isLiked: false
    },
    {
      id: "r4",
      title: "Concert décevant",
      content: "Son de mauvaise qualité et artiste en retard. Le lieu était sympa mais l'organisation laissait à désirer.",
      rating: 2,
      date: "2023-07-10T21:00:00Z",
      type: "event",
      entityId: "e2",
      entityName: "Summer Rock Festival",
      entityImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
      likes: 4,
      comments: 7,
      isLiked: false
    },
    {
      id: "r5",
      title: "Excellente soirée techno",
      content: "Une ambiance incroyable, des sets exceptionnels et une organisation parfaite. À refaire !",
      rating: 5,
      date: "2023-06-15T23:30:00Z",
      type: "event",
      entityId: "e3",
      entityName: "Techno Revolution",
      entityImage: "https://images.unsplash.com/photo-1571266163388-8a8d891f85f5?w=100&h=100&fit=crop",
      likes: 31,
      comments: 12,
      isLiked: true
    },
    {
      id: "r6",
      title: "Bon cocktails mais service lent",
      content: "Les cocktails sont excellents mais l'attente est trop longue. L'ambiance est sympa mais le club est trop petit.",
      rating: 3,
      date: "2023-06-05T22:15:00Z",
      type: "club",
      entityId: "c2",
      entityName: "Blue Note Bar",
      entityImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop",
      likes: 9,
      comments: 4,
      isLiked: true
    }
  ]);
  
  // Filtrer les avis selon l'onglet actif, la recherche et les filtres
  const filteredReviews = reviews
    .filter(review => {
      // Filtrer par type
      if (activeTab !== "all" && review.type !== activeTab) {
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
          review.content.toLowerCase().includes(query) ||
          review.entityName.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Trier selon l'ordre sélectionné
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
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
  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    
    toast({
      title: "Avis supprimé",
      description: "Votre avis a été supprimé avec succès.",
      variant: "default",
    });
  };
  
  // Fonction pour aimer/ne plus aimer un avis
  const handleLikeReview = (reviewId: string) => {
    setReviews(
      reviews.map(review => {
        if (review.id === reviewId) {
          const isLiked = !review.isLiked;
          return {
            ...review,
            isLiked,
            likes: isLiked ? review.likes + 1 : review.likes - 1
          };
        }
        return review;
      })
    );
  };
  
  // Fonction pour éditer un avis
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowEditDialog(true);
  };
  
  // Fonction pour enregistrer les modifications d'un avis
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReview) return;
    
    const title = (document.getElementById("edit-title") as HTMLInputElement).value;
    const content = (document.getElementById("edit-content") as HTMLTextAreaElement).value;
    const rating = parseInt((document.getElementById("edit-rating") as HTMLSelectElement).value);
    
    if (!title || !content || !rating) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    // Mettre à jour l'avis
    setReviews(
      reviews.map(review => {
        if (review.id === editingReview.id) {
          return {
            ...review,
            title,
            content,
            rating
          };
        }
        return review;
      })
    );
    
    toast({
      title: "Avis mis à jour",
      description: "Votre avis a été mis à jour avec succès.",
      variant: "default",
    });
    
    setShowEditDialog(false);
    setEditingReview(null);
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
      default:
        return "Autre";
    }
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="event">Événements</TabsTrigger>
          <TabsTrigger value="artist">Artistes</TabsTrigger>
          <TabsTrigger value="club">Clubs</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="w-full">
          {filteredReviews.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getEntityIcon(review.type)}
                          <span>{getEntityTypeName(review.type)}</span>
                        </Badge>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      
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
                    
                    <div className="flex items-center gap-3 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={review.entityImage}
                          alt={review.entityName}
                        />
                        <AvatarFallback>
                          {review.entityName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-medium line-clamp-1">
                          {review.entityName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {format(new Date(review.date), "d MMMM yyyy", { locale: fr })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <h3 className="font-medium text-sm mb-1">{review.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {review.content}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleLikeReview(review.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${
                        review.isLiked ? "fill-red-500 text-red-500" : ""
                      }`} />
                      <span>{review.likes}</span>
                    </Button>
                    
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{review.comments}</span>
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
                Modifiez votre avis sur {editingReview.entityName}.
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
                  defaultValue={editingReview.content}
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