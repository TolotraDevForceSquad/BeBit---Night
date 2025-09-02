import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Calendar, Star, Music, Heart, Share, Check,
  ChevronLeft, Users, Clock, PlayCircle, Link as LinkIcon,
  Instagram, Facebook, Twitter, MapPin
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/EventCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMobile } from "@/hooks/use-mobile";

// Type d'artiste complet
type Artist = {
  id: number;
  name: string;
  bio: string;
  genres: string[];
  rating: number;
  reviewCount: number;
  followers: number;
  coverImage: string;
  profileImage: string;
  location: string;
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  mediaGallery: {
    id: number;
    type: "image" | "video";
    thumbnail: string;
    url: string;
    title: string;
  }[];
  upcomingEvents: {
    id: number;
    title: string;
    date: string;
    venue: string;
    coverImage: string;
    price: number;
  }[];
  pastEvents: {
    id: number;
    title: string;
    date: string;
    venue: string;
    coverImage: string;
    price: number;
  }[];
  reviews: {
    id: number;
    username: string;
    rating: number;
    comment: string;
    userImage?: string;
    date: string;
  }[];
};

// Données fictives d'un artiste
const mockArtist: Artist = {
  id: 1,
  name: "DJ Elektra",
  bio: "DJ Elektra est une artiste de musique électronique spécialisée dans la techno et la house. Avec plus de 10 ans d'expérience, elle a joué dans les plus grands clubs d'Europe et a sorti plusieurs EP sur des labels renommés. Son style unique mêle des beats profonds et des mélodies hypnotiques pour créer une expérience immersive sur le dancefloor.",
  genres: ["Techno", "House", "Électro"],
  rating: 4.8,
  reviewCount: 156,
  followers: 12540,
  coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=400&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=300&h=300&fit=crop",
  location: "Paris, France",
  socialLinks: {
    website: "https://dj-elektra.com",
    instagram: "dj_elektra",
    facebook: "dj.elektra",
    twitter: "dj_elektra"
  },
  mediaGallery: [
    {
      id: 1,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop",
      title: "Live au Club Oxygen"
    },
    {
      id: 2,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
      title: "Festival Électro 2023"
    },
    {
      id: 3,
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=300&h=200&fit=crop",
      url: "#",
      title: "Mix Techno - Live Session"
    },
    {
      id: 4,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=800&fit=crop",
      title: "Studio Session"
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Soirée Techno de Noël",
      date: "2023-12-24T23:00:00",
      venue: "Club Oxygen",
      coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=500&h=300&fit=crop",
      price: 25
    },
    {
      id: 2,
      title: "Festival Nouvel An",
      date: "2023-12-31T22:00:00",
      venue: "Warehouse",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
      price: 45
    }
  ],
  pastEvents: [
    {
      id: 3,
      title: "House Party",
      date: "2023-11-15T21:00:00",
      venue: "Loft 21",
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
      price: 20
    },
    {
      id: 4,
      title: "Underground Bass Night",
      date: "2023-10-28T22:00:00",
      venue: "Le Bunker",
      coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=500&h=300&fit=crop",
      price: 15
    }
  ],
  reviews: [
    {
      id: 1,
      username: "partygoer88",
      rating: 5,
      comment: "Le meilleur set que j'ai vu cette année ! DJ Elektra a une énergie incroyable.",
      userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
      date: "2023-11-15T14:30:00"
    },
    {
      id: 2,
      username: "nightlife_lover",
      rating: 4,
      comment: "Super ambiance, les transitions étaient parfaites.",
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
      date: "2023-11-14T09:15:00"
    },
    {
      id: 3,
      username: "musicfan22",
      rating: 5,
      comment: "Incroyablement talentueuse ! Les morceaux étaient bien choisis.",
      date: "2023-11-10T23:45:00"
    }
  ]
};

// Composant pour transformer une URL en format lisible
function formatUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// Composant principal
export default function ArtistProfilePage() {
  const [, setLocation] = useLocation();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [following, setFollowing] = useState(false);
  
  const isMobile = useMobile();
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setArtist(mockArtist);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !artist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const handleShare = () => {
    // Logique de partage
    alert("Fonctionnalité de partage à implémenter");
  };
  
  const handleFollow = () => {
    setFollowing(!following);
    // Ici on pourrait appeler une API pour sauvegarder l'état
  };
  
  const handleBookArtist = () => {
    // Logique de réservation d'artiste
    alert(`Demande de réservation pour ${artist.name}`);
  };
  
  const handleEditProfile = () => {
    setLocation("/artist/settings");
  };
  
  const handleManageMedia = () => {
    setLocation("/artist/media");
  };
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLocation("/")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
        >
          <Share className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
  
  // Transformer les événements pour les cartes d'événements
  const upcomingEventsForCards = artist.upcomingEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: `Lieu: ${e.venue}`,
    date: e.date,
    coverImage: e.coverImage,
    category: artist.genres[0],
    venueName: e.venue,
    price: e.price
  }));
  
  const pastEventsForCards = artist.pastEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: `Lieu: ${e.venue}`,
    date: e.date,
    coverImage: e.coverImage,
    category: artist.genres[0],
    venueName: e.venue,
    price: e.price
  }));
  
  return (
    <ResponsiveLayout 
      headerContent={isMobile ? headerContent : undefined}
      showNavigation={false}
    >
      {/* Couverture et infos de profil */}
      <div className="relative mb-8">
        {/* Image de couverture */}
        <div 
          className="h-48 md:h-64 w-full bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${artist.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        </div>
        
        {/* Info de profil */}
        <div className="relative -mt-16 md:-mt-20 px-4 flex flex-col md:flex-row md:items-end">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background">
            <AvatarImage src={artist.profileImage} alt={artist.name} />
            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-4 md:ml-6 md:flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{artist.name}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Music className="h-4 w-4 mr-1.5" />
                  <span>{artist.genres.join(", ")}</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  <span>{artist.location}</span>
                </div>
              </div>
              
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button
                  variant={following ? "default" : "outline"}
                  className="gap-1.5"
                  onClick={handleFollow}
                >
                  {following ? (
                    <>
                      <Check className="h-4 w-4" />
                      Suivi
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />
                      Suivre
                    </>
                  )}
                </Button>
                <Button className="gap-1.5" onClick={handleBookArtist}>
                  <Calendar className="h-4 w-4" />
                  Réserver
                </Button>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="flex gap-4 md:gap-6 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold">{artist.followers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold flex items-center justify-center">
                  {artist.rating}
                  <Star className="h-4 w-4 text-yellow-500 fill-current ml-1" />
                </div>
                <div className="text-xs text-muted-foreground">{artist.reviewCount} avis</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{artist.upcomingEvents.length + artist.pastEvents.length}</div>
                <div className="text-xs text-muted-foreground">Événements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio et infos supplémentaires */}
      <div className="mb-8 px-4">
        <h2 className="text-xl font-semibold mb-3">Biographie</h2>
        <p className="text-muted-foreground mb-6">
          {artist.bio}
        </p>
        
        {/* Liens sociaux */}
        <div className="flex flex-wrap gap-2">
          {artist.socialLinks.website && (
            <a 
              href={artist.socialLinks.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>{formatUrl(artist.socialLinks.website)}</span>
            </a>
          )}
          {artist.socialLinks.instagram && (
            <a 
              href={`https://instagram.com/${artist.socialLinks.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>@{artist.socialLinks.instagram}</span>
            </a>
          )}
          {artist.socialLinks.facebook && (
            <a 
              href={`https://facebook.com/${artist.socialLinks.facebook}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
            >
              <Facebook className="h-3.5 w-3.5" />
              <span>{artist.socialLinks.facebook}</span>
            </a>
          )}
          {artist.socialLinks.twitter && (
            <a 
              href={`https://twitter.com/${artist.socialLinks.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
            >
              <Twitter className="h-3.5 w-3.5" />
              <span>@{artist.socialLinks.twitter}</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Tabs pour le contenu détaillé */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        
        {/* Tab Événements */}
        <TabsContent value="events" className="mt-6 space-y-8">
          {/* Événements à venir */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
            
            {artist.upcomingEvents.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-lg">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucun événement à venir pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEventsForCards.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
          
          {/* Événements passés */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Événements passés</h2>
            
            {artist.pastEvents.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-lg">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucun événement passé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEventsForCards.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Tab Médias */}
        <TabsContent value="media" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Galerie média</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artist.mediaGallery.map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <CardContent className="p-0 relative group cursor-pointer">
                  <img
                    src={media.thumbnail}
                    alt={media.title}
                    className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm truncate">{media.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Tab Avis */}
        <TabsContent value="reviews" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Avis des fans</h2>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{artist.rating}</span>
              <span className="text-muted-foreground ml-1">({artist.reviewCount} avis)</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {artist.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={review.userImage} />
                      <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(review.date), "d MMM yyyy", { locale: fr })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded">
                    <Star className="h-3.5 w-3.5 fill-current mr-1" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              Voir tous les avis
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Boutons de gestion du profil */}
      <div className="fixed bottom-20 md:bottom-10 right-4 md:right-10 flex flex-col gap-2">
        <Button onClick={handleEditProfile} className="gap-2">
          <Users className="h-4 w-4" />
          Modifier le profil
        </Button>
        <Button onClick={handleManageMedia} variant="outline" className="gap-2">
          <PlayCircle className="h-4 w-4" />
          Gérer les médias
        </Button>
      </div>
    </ResponsiveLayout>
  );
}