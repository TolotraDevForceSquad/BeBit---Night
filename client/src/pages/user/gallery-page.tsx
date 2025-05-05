import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Image, Upload, Trash2, Download, MoreVertical, Info } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les éléments de galerie
type GalleryItem = {
  id: number;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  date: string;
  eventId?: number;
  eventTitle?: string;
};

// Données fictives pour la galerie
const mockGallery: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    title: "Soirée électro",
    date: "2023-12-05T23:30:00",
    eventId: 101,
    eventTitle: "Nuit Électro Premium"
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000",
    title: "Festival EDM",
    date: "2023-11-15T22:45:00",
    eventId: 102,
    eventTitle: "Summer Festival"
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
    title: "Afterparty",
    date: "2023-10-28T01:15:00",
    eventId: 103,
    eventTitle: "Urban Night"
  },
  {
    id: 4,
    type: "image",
    url: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?q=80&w=1000",
    title: "Concert live",
    date: "2023-09-14T21:30:00",
    eventId: 104,
    eventTitle: "Live Concert"
  },
  {
    id: 5,
    type: "image",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
    title: "DJ Set",
    date: "2023-08-20T23:00:00",
    eventId: 105,
    eventTitle: "DJ Battle"
  },
  {
    id: 6,
    type: "image",
    url: "https://images.unsplash.com/photo-1571266807835-ed3c5d26c6a7?q=80&w=1000",
    title: "Club premium",
    date: "2023-07-02T22:15:00",
    eventId: 106,
    eventTitle: "VIP Night"
  }
];

export default function GalleryPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
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
    
    // Simuler un chargement de la galerie
    setGallery(mockGallery);
  }, []);

  // Filtrer les images selon l'onglet actif
  const filteredGallery = gallery.filter(item => {
    if (activeTab === "all") {
      return true;
    }
    const itemDate = new Date(item.date);
    const currentDate = new Date();
    
    if (activeTab === "recent") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return itemDate >= oneMonthAgo;
    } else if (activeTab === "events") {
      return !!item.eventId;
    }
    
    return true;
  });

  // Supprimer une image
  const handleDelete = (id: number) => {
    setGallery(gallery.filter(item => item.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Ma galerie</h1>
    </div>
  );

  return (
    <ResponsiveLayout activeItem="gallery" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Ma galerie</h1>
          </div>
          
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Récentes</TabsTrigger>
            <TabsTrigger value="events" className="flex-1">Événements</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredGallery.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Galerie vide
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore d'images dans cette section
                </p>
                <Button className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter des photos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGallery.map((item) => (
                  <GalleryCard 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDelete}
                    onClick={() => setSelectedImage(item)}
                    isSelected={selectedImage?.id === item.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-background rounded-lg overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-medium">{selectedImage.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-2">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedImage.date), "d MMMM yyyy", { locale: fr })}
                    </p>
                    {selectedImage.eventTitle && (
                      <p className="text-sm">
                        Événement: {selectedImage.eventTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedImage.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}

// Composant pour afficher une carte de galerie
interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
}

function GalleryCard({ item, onClick, onDelete, isSelected }: GalleryCardProps) {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className="relative group">
        <img 
          src={item.url} 
          alt={item.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="text-white">
            <Image className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-black bg-opacity-50 text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}>
                <Info className="h-4 w-4 mr-2" />
                Détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                // Implémenter la fonction de téléchargement ici
              }}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-2">
        <div className="text-sm font-medium truncate">{item.title}</div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(item.date), "d MMM yyyy", { locale: fr })}
        </div>
      </CardContent>
    </Card>
  );
}