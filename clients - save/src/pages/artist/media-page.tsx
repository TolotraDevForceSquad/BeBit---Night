import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Upload, PlayCircle, Image as ImageIcon, 
  X, Music, Video, Check, Trash2, MoreHorizontal, Edit2
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type d'élément média
type MediaItem = {
  id: number;
  type: "image" | "video" | "audio";
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  uploadDate: string;
  duration?: string;
  fileSize?: string;
  views?: number;
  featured: boolean;
};

// Données fictives de l'artiste
const mockMediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    title: "Live au Club Oxygen",
    description: "Performance au Club Oxygen le 15 novembre 2023",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
    uploadDate: "2023-11-16T12:30:00",
    fileSize: "2.3 MB",
    views: 432,
    featured: true
  },
  {
    id: 2,
    type: "image",
    title: "Festival Électro 2023",
    description: "Photos de ma performance au Festival Électro",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop",
    uploadDate: "2023-09-20T15:45:00",
    fileSize: "1.8 MB",
    views: 287,
    featured: false
  },
  {
    id: 3,
    type: "video",
    title: "Mix Techno - Live Session",
    description: "Session live de mix techno en studio",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=300&h=200&fit=crop",
    uploadDate: "2023-10-05T18:20:00",
    duration: "24:15",
    fileSize: "58 MB",
    views: 1253,
    featured: true
  },
  {
    id: 4,
    type: "image",
    title: "Studio Session",
    description: "En studio pour mon prochain album",
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=200&fit=crop",
    uploadDate: "2023-08-12T09:15:00",
    fileSize: "3.1 MB",
    views: 189,
    featured: false
  },
  {
    id: 5,
    type: "audio",
    title: "Summer Vibes Mix",
    description: "Mix électro pour l'été 2023",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=200&fit=crop",
    uploadDate: "2023-07-01T14:30:00",
    duration: "58:42",
    fileSize: "84 MB",
    views: 2876,
    featured: true
  }
];

// Composant principal
export default function ArtistMediaPage() {
  const [, setLocation] = useLocation();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Charger les données initiales
  useEffect(() => {
    // Chargement immédiat sans délai artificiel
    setMediaItems(mockMediaItems);
    setIsLoading(false);
  }, []);
  
  // Filtrer les médias selon l'onglet actif
  const filteredMedia = mediaItems.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "images") return item.type === "image";
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "audio") return item.type === "audio";
    if (activeTab === "featured") return item.featured;
    return true;
  });
  
  // Gérer la sélection/désélection d'un élément
  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Sélectionner tous les éléments filtrés
  const selectAllItems = () => {
    setSelectedItems(filteredMedia.map(item => item.id));
  };
  
  // Désélectionner tous les éléments
  const deselectAllItems = () => {
    setSelectedItems([]);
  };
  
  // Marquer les éléments sélectionnés comme favoris
  const toggleFeaturedItems = () => {
    setMediaItems(mediaItems.map(item => 
      selectedItems.includes(item.id)
        ? { ...item, featured: !item.featured }
        : item
    ));
  };
  
  // Supprimer les éléments sélectionnés
  const deleteSelectedItems = () => {
    setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Gérer les médias</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <ImageIcon className="h-3 w-3 mr-1" />
          <span>Médias</span>
        </Badge>
        
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=300&h=300&fit=crop" alt="DJ Elektra" />
          <AvatarFallback>DJ</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
  
  // Si les données sont en cours de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <ResponsiveLayout 
      activeItem="profile"
      headerContent={headerContent}
    >
      <div>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/artist/profile")}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gestion des médias</h1>
        </div>
        
        {/* Barre d'actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 ? (
              <>
                <Button variant="ghost" size="sm" onClick={deselectAllItems}>
                  <X className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Annuler</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} {selectedItems.length > 1 ? "éléments sélectionnés" : "élément sélectionné"}
                </span>
                <div className="h-6 w-px bg-border mx-1"></div>
                <Button variant="outline" size="sm" onClick={toggleFeaturedItems}>
                  <Check className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mettre en avant</span>
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteSelectedItems}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Supprimer</span>
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={selectAllItems}>
                <Check className="h-4 w-4 mr-1" />
                <span>Tout sélectionner</span>
              </Button>
            )}
          </div>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Upload className="h-4 w-4" />
                <span>Mettre en ligne</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau média</DialogTitle>
                <DialogDescription>
                  Téléchargez une image, une vidéo ou un fichier audio pour votre galerie.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="mediaType">Type de média</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1 gap-1.5">
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 gap-1.5">
                      <Video className="h-4 w-4" />
                      <span>Vidéo</span>
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 gap-1.5">
                      <Music className="h-4 w-4" />
                      <span>Audio</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Donnez un titre à votre média" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (facultatif)</Label>
                  <Input id="description" placeholder="Ajoutez une description" />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Glissez-déposez un fichier ici</p>
                  <p className="text-xs text-muted-foreground mb-2">ou cliquez pour sélectionner un fichier</p>
                  <Button variant="outline" size="sm">Parcourir</Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Annuler</Button>
                <Button>Télécharger</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Tabs et contenu */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="featured">À la une</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <div className="flex justify-center">
                  {activeTab === "images" ? (
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  ) : activeTab === "videos" ? (
                    <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  ) : activeTab === "audio" ? (
                    <Music className="h-12 w-12 text-muted-foreground mb-4" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">Aucun média trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" 
                    ? "Vous n'avez pas encore ajouté de médias" 
                    : `Vous n'avez pas encore de ${
                        activeTab === "images" ? "photos" 
                        : activeTab === "videos" ? "vidéos" 
                        : activeTab === "audio" ? "fichiers audio" 
                        : "médias en vedette"
                      }`
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadDialogOpen(true)} 
                  className="gap-1.5"
                >
                  <Upload className="h-4 w-4" />
                  <span>Ajouter un nouveau média</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMedia.map(item => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden relative ${
                      selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div 
                      className="absolute top-2 right-2 z-10 flex gap-1"
                    >
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm" 
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        {selectedItems.includes(item.id) ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Check className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            {item.featured ? (
                              <>
                                <X className="h-4 w-4" />
                                <span>Retirer de la une</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Mettre à la une</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="relative aspect-video bg-muted">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <PlayCircle className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {item.type === "audio" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <Music className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {item.featured && (
                        <Badge className="absolute top-2 left-2 bg-primary text-white border-none">
                          À la une
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-3">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          {item.type === "image" ? (
                            <ImageIcon className="h-3 w-3 mr-1" />
                          ) : item.type === "video" ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : (
                            <Music className="h-3 w-3 mr-1" />
                          )}
                          <span>
                            {item.type === "image" ? "Image" : item.type === "video" ? "Vidéo" : "Audio"}
                          </span>
                          {item.duration && (
                            <span className="ml-2">{item.duration}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.views?.toLocaleString()} vues
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}