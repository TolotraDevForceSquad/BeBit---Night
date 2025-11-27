import { useState, useEffect } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Clock, Heart, Music, Filter } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Type pour les événements favoris
type FavoriteEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  category: string;
  venueName: string;
  price: number;
  isFeatured?: boolean;
  isLiked: boolean;
  artists: Array<{
    id: number;
    name: string;
    image?: string;
  }>;
};

// Type pour les artistes favoris
type FavoriteArtist = {
  id: number;
  name: string;
  image?: string;
  genres: string[];
  popularity: number;
  followers: number;
  isFollowing: boolean;
  upcomingEvents?: number;
};

// Type pour les clubs favoris
type FavoriteClub = {
  id: number;
  name: string;
  image?: string;
  location: string;
  category: string;
  rating: number;
  isFollowing: boolean;
  upcomingEvents?: number;
};

// Données fictives pour les favoris
const mockFavoriteEvents: FavoriteEvent[] = [
  {
    id: 1,
    title: "Soirée Techno",
    description: "Une soirée électro avec les meilleurs DJ de la scène",
    date: "2023-12-20T22:00:00",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    category: "Électro",
    venueName: "Club Oxygen",
    price: 15,
    isFeatured: true,
    isLiked: true,
    artists: [
      { id: 1, name: "DJ Elektra", image: "https://randomuser.me/api/portraits/women/32.jpg" },
      { id: 2, name: "RythmX", image: "https://randomuser.me/api/portraits/men/45.jpg" }
    ]
  },
  {
    id: 2,
    title: "Festival EDM",
    description: "Le plus grand festival EDM de l'année avec des artistes internationaux",
    date: "2024-01-15T18:00:00",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
    category: "Festival",
    venueName: "Parc des Expositions",
    price: 45,
    isFeatured: false,
    isLiked: true,
    artists: [
      { id: 3, name: "Bass Warrior", image: "https://randomuser.me/api/portraits/men/22.jpg" },
      { id: 4, name: "Luna Beats", image: "https://randomuser.me/api/portraits/women/65.jpg" }
    ]
  },
  {
    id: 3,
    title: "After Work House",
    description: "Détendez-vous après le travail avec de la musique house",
    date: "2023-12-16T19:00:00",
    coverImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1000",
    category: "House",
    venueName: "Le Loft",
    price: 0,
    isFeatured: false,
    isLiked: true,
    artists: [
      { id: 5, name: "Groove Master", image: "https://randomuser.me/api/portraits/men/68.jpg" }
    ]
  }
];

const mockFavoriteArtists: FavoriteArtist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    genres: ["Techno", "Deep House"],
    popularity: 92,
    followers: 15000,
    isFollowing: true,
    upcomingEvents: 3
  },
  {
    id: 3,
    name: "Bass Warrior",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    genres: ["EDM", "Dubstep"],
    popularity: 88,
    followers: 12400,
    isFollowing: true,
    upcomingEvents: 2
  },
  {
    id: 5,
    name: "Groove Master",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    genres: ["House", "Disco"],
    popularity: 75,
    followers: 8500,
    isFollowing: true,
    upcomingEvents: 1
  }
];

const mockFavoriteClubs: FavoriteClub[] = [
  {
    id: 101,
    name: "Club Oxygen",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000",
    location: "Paris, France",
    category: "Club",
    rating: 4.8,
    isFollowing: true,
    upcomingEvents: 5
  },
  {
    id: 102,
    name: "Le Loft",
    image: "https://images.unsplash.com/photo-1578760427650-9645a33f4e1b?q=80&w=1000",
    location: "Lyon, France",
    category: "Lounge",
    rating: 4.6,
    isFollowing: true,
    upcomingEvents: 2
  }
];

export default function FavoritesPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favoriteEvents, setFavoriteEvents] = useState<FavoriteEvent[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<FavoriteArtist[]>([]);
  const [favoriteClubs, setFavoriteClubs] = useState<FavoriteClub[]>([]);
  const [activeTab, setActiveTab] = useState("events");
  
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
    
    // Simuler un chargement des favoris
    setFavoriteEvents(mockFavoriteEvents);
    setFavoriteArtists(mockFavoriteArtists);
    setFavoriteClubs(mockFavoriteClubs);
  }, []);

  // Header content pour la mise en page
  const headerContent = (
    <div className="w-full flex items-center">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="font-semibold text-lg">Mes favoris</h1>
    </div>
  );

  // Gérer le retrait des favoris
  const handleRemoveEvent = (id: number) => {
    setFavoriteEvents(favoriteEvents.filter(event => event.id !== id));
  };
  
  const handleUnfollowArtist = (id: number) => {
    setFavoriteArtists(favoriteArtists.filter(artist => artist.id !== id));
  };
  
  const handleUnfollowClub = (id: number) => {
    setFavoriteClubs(favoriteClubs.filter(club => club.id !== id));
  };

  return (
    <ResponsiveLayout activeItem="favorites" headerContent={headerContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Mes favoris</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Récents d'abord</DropdownMenuItem>
              <DropdownMenuItem>Anciens d'abord</DropdownMenuItem>
              <DropdownMenuItem>Alphabétique</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="events" className="flex-1">
              Événements ({favoriteEvents.length})
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex-1">
              Artistes ({favoriteArtists.length})
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex-1">
              Clubs ({favoriteClubs.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            {favoriteEvents.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas d'événements favoris
                </h3>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore ajouté d'événements à vos favoris
                </p>
                <Button className="mt-4">Découvrir des événements</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteEvents.map((event) => (
                  <FavoriteEventCard 
                    key={event.id} 
                    event={event} 
                    onRemove={() => handleRemoveEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="artists" className="space-y-4">
            {favoriteArtists.length === 0 ? (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas d'artistes suivis
                </h3>
                <p className="text-muted-foreground">
                  Vous ne suivez aucun artiste pour le moment
                </p>
                <Button className="mt-4">Découvrir des artistes</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteArtists.map((artist) => (
                  <FavoriteArtistCard 
                    key={artist.id} 
                    artist={artist} 
                    onUnfollow={() => handleUnfollowArtist(artist.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clubs" className="space-y-4">
            {favoriteClubs.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Pas de clubs suivis
                </h3>
                <p className="text-muted-foreground">
                  Vous ne suivez aucun club pour le moment
                </p>
                <Button className="mt-4">Découvrir des clubs</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteClubs.map((club) => (
                  <FavoriteClubCard 
                    key={club.id} 
                    club={club} 
                    onUnfollow={() => handleUnfollowClub(club.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
}

// Composant pour afficher un événement favori
interface FavoriteEventCardProps {
  event: FavoriteEvent;
  onRemove: () => void;
}

function FavoriteEventCard({ event, onRemove }: FavoriteEventCardProps) {
  const eventDate = format(new Date(event.date), "EEEE d MMMM", { locale: fr });
  const eventTime = format(new Date(event.date), "HH'h'mm", { locale: fr });
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={event.coverImage} 
          alt={event.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-2 text-white">
          <Badge className="bg-primary mb-1">{event.category}</Badge>
          <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/30 hover:bg-black/40"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
        >
          <Heart className="h-5 w-5 fill-current" />
        </Button>
      </div>
      
      <CardContent className="p-3 flex-1">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{eventDate}</span>
            <span className="mx-1">•</span>
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{eventTime}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{event.venueName}</span>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avec :</p>
            <div className="flex -space-x-2">
              {event.artists.map((artist) => (
                <Avatar key={artist.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={artist.image} alt={artist.name} />
                  <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              <div className="ml-2 flex items-center text-sm">
                {event.artists.map((artist, index) => (
                  <span key={artist.id}>
                    {artist.name}
                    {index < event.artists.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="p-3 mt-auto border-t">
        <div className="flex justify-between items-center">
          <div className="font-bold">
            {event.price > 0 ? `${event.price} €` : 'Gratuit'}
          </div>
          <Button variant="default" size="sm" asChild>
            <Link to={`/event/${event.id}`}>
              Voir détails
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Composant pour afficher un artiste favori
interface FavoriteArtistCardProps {
  artist: FavoriteArtist;
  onUnfollow: () => void;
}

function FavoriteArtistCard({ artist, onUnfollow }: FavoriteArtistCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 text-center">
        <div className="relative mx-auto mb-3">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarImage src={artist.image} alt={artist.name} />
            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-muted hover:bg-muted/90"
            onClick={(e) => {
              e.preventDefault();
              onUnfollow();
            }}
          >
            <Heart className="h-4 w-4 fill-current text-primary" />
          </Button>
        </div>
        
        <h3 className="font-bold text-lg">{artist.name}</h3>
        <div className="flex flex-wrap justify-center gap-1 my-2">
          {artist.genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-center text-sm text-muted-foreground mb-3">
          <span>{artist.followers.toLocaleString()} followers</span>
          {artist.upcomingEvents && (
            <>
              <span className="mx-1">•</span>
              <span>{artist.upcomingEvents} événements à venir</span>
            </>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/artist/${artist.id}`}>
            Voir profil
          </Link>
        </Button>
      </div>
    </Card>
  );
}

// Composant pour afficher un club favori
interface FavoriteClubCardProps {
  club: FavoriteClub;
  onUnfollow: () => void;
}

function FavoriteClubCard({ club, onUnfollow }: FavoriteClubCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={club.image} 
          alt={club.name} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white">
          <h3 className="font-bold text-lg">{club.name}</h3>
          <div className="flex items-center text-sm opacity-80">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{club.location}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/30 hover:bg-black/40"
          onClick={(e) => {
            e.preventDefault();
            onUnfollow();
          }}
        >
          <Heart className="h-5 w-5 fill-current" />
        </Button>
      </div>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline">{club.category}</Badge>
          <div className="flex items-center">
            <span className="text-amber-500 mr-1">★</span>
            <span className="font-medium">{club.rating}</span>
          </div>
        </div>
        
        {club.upcomingEvents && (
          <div className="text-sm text-muted-foreground mb-3">
            {club.upcomingEvents} événements à venir
          </div>
        )}
        
        <Button variant="default" size="sm" className="w-full" asChild>
          <Link to={`/club/${club.id}`}>
            Voir détails
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}