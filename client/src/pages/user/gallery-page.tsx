import { useState } from "react";
import { ImageIcon, Upload, X, ZoomIn, Download, Share2, Heart, MessageSquare } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger 
} from "../../components/ui/dialog";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "../../hooks/use-toast";

// Types pour les photos
interface PhotoData {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  eventId?: number;
  eventName?: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  user: {
    id: number;
    username: string;
    profileImage?: string;
  };
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500",
      title: "Hip-Hop Night",
      description: "Une soirée mémorable au club Underground avec DJ Max",
      eventId: 1,
      eventName: "Summer Hip-Hop Festival",
      uploadedAt: "2023-06-10T22:30:00Z",
      tags: ["hip-hop", "club", "night", "DJ"],
      likes: 24,
      comments: 5,
      isLiked: false,
      user: {
        id: 101,
        username: "photo_lover",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&h=250&auto=format&fit=crop"
      }
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1571266163388-8a8d891f85f5?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1571266163388-8a8d891f85f5?q=80&w=500",
      title: "Techno Lights",
      description: "Les effets de lumière impressionnants à la soirée Techno Revolution",
      eventId: 2,
      eventName: "Techno Revolution",
      uploadedAt: "2023-06-15T23:45:00Z",
      tags: ["techno", "lights", "party", "night"],
      likes: 42,
      comments: 8,
      isLiked: true,
      user: {
        id: 102,
        username: "nightlife_captures",
        profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop"
      }
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500",
      title: "Concert Live",
      description: "Le groupe The Rockers en pleine performance au festival d'été",
      eventId: 3,
      eventName: "Summer Rock Festival",
      uploadedAt: "2023-06-20T21:15:00Z",
      tags: ["concert", "live", "rock", "band"],
      likes: 37,
      comments: 12,
      isLiked: false,
      user: {
        id: 103,
        username: "music_hunter",
        profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&h=250&auto=format&fit=crop"
      }
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500",
      title: "DJ Set",
      description: "DJ Electra pendant son set au Klub Elektronica",
      eventId: 4,
      eventName: "Elektronica Night",
      uploadedAt: "2023-06-25T22:00:00Z",
      tags: ["dj", "electronic", "club", "music"],
      likes: 56,
      comments: 14,
      isLiked: true,
      user: {
        id: 104,
        username: "dj_lifestyle",
        profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=250&h=250&auto=format&fit=crop"
      }
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=500",
      title: "Rooftop Party",
      description: "Soirée sur le toit avec vue panoramique sur la ville",
      eventId: 5,
      eventName: "Summer Rooftop Party",
      uploadedAt: "2023-06-30T20:30:00Z",
      tags: ["rooftop", "sunset", "party", "summer"],
      likes: 89,
      comments: 23,
      isLiked: false,
      user: {
        id: 105,
        username: "sunset_lover",
        profileImage: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=250&h=250&auto=format&fit=crop"
      }
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000",
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500",
      title: "Cocktail Bar",
      description: "Les cocktails spéciaux de la soirée au Blue Note Bar",
      eventId: 6,
      eventName: "Cocktail Night",
      uploadedAt: "2023-07-05T21:45:00Z",
      tags: ["cocktails", "bar", "lounge", "night"],
      likes: 31,
      comments: 7,
      isLiked: true,
      user: {
        id: 106,
        username: "cocktail_master",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop"
      }
    }
  ]);
  
  // Fonction pour filtrer les photos selon l'onglet actif
  // Dans une application réelle, on chargerait les données depuis le serveur
  const filteredPhotos = photos.filter(photo => {
    if (activeTab === "all") return true;
    if (activeTab === "liked") return photo.isLiked;
    return photo.eventName?.toLowerCase().includes(activeTab);
  });
  
  // Fonction pour gérer l'ajout d'une nouvelle photo
  const handlePhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Photo ajoutée",
      description: "Votre photo a été ajoutée à la galerie.",
      variant: "default",
    });
  };
  
  // Fonction pour "aimer" une photo
  const handleLikePhoto = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            isLiked: !photo.isLiked,
            likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1 
          } 
        : photo
    ));
    
    // Si la photo est actuellement affichée dans la modal, la mettre à jour également
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        isLiked: !selectedPhoto.isLiked,
        likes: selectedPhoto.isLiked ? selectedPhoto.likes - 1 : selectedPhoto.likes + 1
      });
    }
  };
  
  // Fonction pour télécharger une photo
  const handleDownload = (photoUrl: string, photoTitle: string) => {
    // Dans une application réelle, cela déclencherait un téléchargement
    toast({
      title: "Téléchargement démarré",
      description: `Téléchargement de "${photoTitle}" en cours...`,
      variant: "default",
    });
  };
  
  // Fonction pour partager une photo
  const handleShare = (photoId: number) => {
    toast({
      title: "Partage",
      description: "Lien copié dans le presse-papiers.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ImageIcon className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Galerie photos</h1>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter une photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle photo</DialogTitle>
              <DialogDescription>
                Partagez vos photos de sorties et d'événements avec la communauté.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePhotoUpload} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center hover:bg-muted/25 transition cursor-pointer">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Glissez-déposez ou cliquez pour sélectionner une photo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Donnez un titre à votre photo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Input
                    id="description"
                    placeholder="Ajoutez une description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event">Événement associé (optionnel)</Label>
                  <select
                    id="event"
                    className="w-full px-3 py-2 rounded-md border border-input"
                  >
                    <option value="">Sélectionnez un événement</option>
                    <option value="1">Summer Hip-Hop Festival</option>
                    <option value="2">Techno Revolution</option>
                    <option value="3">Summer Rock Festival</option>
                    <option value="4">Elektronica Night</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    placeholder="Ex: concert, club, dj, fête"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Publier la photo</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4 overflow-x-auto flex no-scrollbar justify-start">
          <TabsTrigger value="all" className="px-4">Toutes</TabsTrigger>
          <TabsTrigger value="liked" className="px-4">J'aime</TabsTrigger>
          <TabsTrigger value="hip-hop" className="px-4">Hip-Hop</TabsTrigger>
          <TabsTrigger value="techno" className="px-4">Techno</TabsTrigger>
          <TabsTrigger value="rock" className="px-4">Rock</TabsTrigger>
          <TabsTrigger value="lounge" className="px-4">Lounge</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Aucune photo {activeTab !== "all" && `dans la catégorie "${activeTab}"`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "all"
                  ? "Vous n'avez pas encore de photos dans votre galerie."
                  : activeTab === "liked"
                  ? "Vous n'avez pas encore aimé de photos."
                  : `Aucune photo n'a été trouvée dans la catégorie "${activeTab}".`}
              </p>
              {activeTab === "all" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter une photo
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div
                    className="h-48 w-full bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${photo.thumbnail})` }}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="w-full h-full bg-gradient-to-b from-transparent to-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold">{photo.title}</h3>
                        {photo.eventName && (
                          <p className="text-sm opacity-90">{photo.eventName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={photo.user.profileImage}
                          alt={photo.user.username}
                        />
                        <AvatarFallback>
                          {photo.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">
                          {photo.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(photo.uploadedAt), "d MMMM", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center space-x-1 text-sm"
                        onClick={() => handleLikePhoto(photo.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            photo.isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        <span>{photo.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-sm">
                        <MessageSquare className="h-4 w-4" />
                        <span>{photo.comments}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleShare(photo.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modal d'affichage de la photo complète */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl w-full p-0">
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 bg-black relative">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="w-full object-contain max-h-[70vh]"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{selectedPhoto.title}</h2>
                    {selectedPhoto.eventName && (
                      <p className="text-sm opacity-80">{selectedPhoto.eventName}</p>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 p-4 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={selectedPhoto.user.profileImage}
                        alt={selectedPhoto.user.username}
                      />
                      <AvatarFallback>
                        {selectedPhoto.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPhoto.user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(selectedPhoto.uploadedAt), "d MMMM yyyy, HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  {selectedPhoto.description && (
                    <p className="text-sm mb-4">{selectedPhoto.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedPhoto.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleLikePhoto(selectedPhoto.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            selectedPhoto.isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        <span>{selectedPhoto.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-5 w-5" />
                        <span>{selectedPhoto.comments}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(selectedPhoto.id)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Partager
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(selectedPhoto.url, selectedPhoto.title)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Commentaires ({selectedPhoto.comments})</h3>
                    
                    <div className="border rounded-lg p-3 mb-2">
                      <div className="flex items-start gap-3 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>J</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">john_doe</p>
                          <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                        </div>
                      </div>
                      <p className="text-sm">Super photo ! L'ambiance avait l'air incroyable !</p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-start gap-3 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">music_lover</p>
                          <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                        </div>
                      </div>
                      <p className="text-sm">J'y étais aussi ! C'était une soirée mémorable !</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input placeholder="Ajouter un commentaire..." />
                      <Button size="sm">Envoyer</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}