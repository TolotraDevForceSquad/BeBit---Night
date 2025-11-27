import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Calendar, Star, Building, Heart, Share, MapPin, Check,
  ChevronLeft, Users, Clock, PlayCircle, Link as LinkIcon,
  Instagram, Facebook, Twitter, Phone, Mail, ExternalLink
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

// Type de club complet
type Club = {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  followers: number;
  coverImage: string;
  profileImage: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  features: string[];
  capacity: number;
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
    artists: string[];
    coverImage: string;
    price: number;
  }[];
  pastEvents: {
    id: number;
    title: string;
    date: string;
    artists: string[];
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

// Données fictives d'un club
const mockClub: Club = {
  id: 1,
  name: "Club Oxygen",
  description: "Le Club Oxygen est l'un des meilleurs clubs de Paris pour la musique électronique. Avec un système de son dernier cri et des lumières spectaculaires, le club vous offre une expérience nocturne inoubliable. Nous accueillons régulièrement les meilleurs DJs et artistes de la scène électronique internationale.",
  category: "Club de Nuit",
  rating: 4.7,
  reviewCount: 238,
  followers: 8750,
  coverImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=1200&h=400&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=300&h=300&fit=crop",
  location: {
    address: "15 rue de la Nuit",
    city: "Paris",
    country: "France",
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  contactInfo: {
    phone: "+33 1 23 45 67 89",
    email: "contact@cluboxygen.com",
    website: "https://cluboxygen.com"
  },
  openingHours: {
    monday: "Fermé",
    tuesday: "Fermé",
    wednesday: "22:00 - 05:00",
    thursday: "22:00 - 05:00",
    friday: "22:00 - 06:00",
    saturday: "22:00 - 06:00",
    sunday: "22:00 - 04:00"
  },
  socialLinks: {
    website: "https://cluboxygen.com",
    instagram: "club_oxygen",
    facebook: "cluboxygen",
    twitter: "club_oxygen"
  },
  features: ["Bar VIP", "Terrasse", "Système son Funktion-One", "Vestiaire", "DJ Résidents", "Salle fumeurs"],
  capacity: 800,
  mediaGallery: [
    {
      id: 1,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=800&fit=crop",
      title: "Soirée Techno avec DJ Elektra"
    },
    {
      id: 2,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop",
      title: "House Party Weekend"
    },
    {
      id: 3,
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop",
      url: "#",
      title: "Visite Virtuelle du Club"
    },
    {
      id: 4,
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=200&fit=crop",
      url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=800&fit=crop",
      title: "DJ Set au Club Oxygen"
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Soirée Techno avec DJ Elektra",
      date: "2023-12-15T22:00:00",
      artists: ["DJ Elektra", "MC Blaze"],
      coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=500&h=300&fit=crop",
      price: 25
    },
    {
      id: 2,
      title: "House Party Weekend",
      date: "2023-12-22T22:00:00",
      artists: ["Luna Ray", "BeatMaster"],
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
      price: 20
    },
    {
      id: 3,
      title: "Soirée Techno de Noël",
      date: "2023-12-24T23:00:00",
      artists: ["DJ Elektra", "Luna Ray"],
      coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=500&h=300&fit=crop",
      price: 30
    }
  ],
  pastEvents: [
    {
      id: 4,
      title: "Nuit Électro",
      date: "2023-11-25T22:00:00",
      artists: ["BeatMaster"],
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
      price: 20
    },
    {
      id: 5,
      title: "Underground Bass Night",
      date: "2023-11-18T22:00:00",
      artists: ["MC Blaze", "DJ Elektra"],
      coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=500&h=300&fit=crop",
      price: 15
    }
  ],
  reviews: [
    {
      id: 1,
      username: "partygoer88",
      rating: 5,
      comment: "Super club ! Ambiance au top, bonne musique et staff agréable.",
      userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
      date: "2023-11-26T14:30:00"
    },
    {
      id: 2,
      username: "nightlife_lover",
      rating: 4,
      comment: "Très bonne ambiance, mais un peu cher.",
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
      date: "2023-11-20T09:15:00"
    },
    {
      id: 3,
      username: "musicfan22",
      rating: 5,
      comment: "Le meilleur son de Paris ! Les DJ résidents sont excellents.",
      date: "2023-11-15T23:45:00"
    }
  ]
};

// Composant pour transformer une URL en format lisible
function formatUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// Composant pour afficher un jour d'ouverture
function OpeningHourRow({ day, hours }: { day: string; hours: string }) {
  const isToday = format(new Date(), "EEEE", { locale: fr }).toLowerCase() === day.toLowerCase();
  
  return (
    <div className={`flex justify-between py-1 ${isToday ? "font-medium" : ""}`}>
      <span className="capitalize">{day}</span>
      <span>{hours}</span>
    </div>
  );
}

// Composant principal
export default function ClubProfilePage() {
  const [, setLocation] = useLocation();
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");
  const [following, setFollowing] = useState(false);
  
  const isMobile = useMobile();
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setClub(mockClub);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !club) {
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
  const upcomingEventsForCards = club.upcomingEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: `Avec: ${e.artists.join(", ")}`,
    date: e.date,
    coverImage: e.coverImage,
    category: "Event",
    venueName: club.name,
    price: e.price
  }));
  
  const pastEventsForCards = club.pastEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: `Avec: ${e.artists.join(", ")}`,
    date: e.date,
    coverImage: e.coverImage,
    category: "Event",
    venueName: club.name,
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
          style={{ backgroundImage: `url(${club.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        </div>
        
        {/* Info de profil */}
        <div className="relative -mt-16 md:-mt-20 px-4 flex flex-col md:flex-row md:items-end">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background">
            <AvatarImage src={club.profileImage} alt={club.name} />
            <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-4 md:ml-6 md:flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{club.name}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Building className="h-4 w-4 mr-1.5" />
                  <span>{club.category}</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  <span>{club.location.address}, {club.location.city}</span>
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
                <Button className="gap-1.5" onClick={() => window.open("https://maps.google.com", "_blank")}>
                  <MapPin className="h-4 w-4" />
                  Itinéraire
                </Button>
                <Button variant="default" className="gap-1.5" onClick={() => setLocation(`/club/table-reservation/${club.id}`)}>
                  <Calendar className="h-4 w-4" />
                  Réserver une table
                </Button>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="flex gap-4 md:gap-6 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold">{club.followers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold flex items-center justify-center">
                  {club.rating}
                  <Star className="h-4 w-4 text-yellow-500 fill-current ml-1" />
                </div>
                <div className="text-xs text-muted-foreground">{club.reviewCount} avis</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{club.capacity}</div>
                <div className="text-xs text-muted-foreground">Capacité</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{club.upcomingEvents.length + club.pastEvents.length}</div>
                <div className="text-xs text-muted-foreground">Événements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs pour le contenu détaillé */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>
        
        {/* Tab Événements */}
        <TabsContent value="events" className="mt-6 space-y-8">
          {/* Événements à venir */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
            
            {club.upcomingEvents.length === 0 ? (
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
            
            {club.pastEvents.length === 0 ? (
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
        
        {/* Tab Informations */}
        <TabsContent value="info" className="mt-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">À propos</h2>
            <p className="text-muted-foreground">
              {club.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de contact */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  {club.contactInfo.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <a href={`tel:${club.contactInfo.phone}`} className="hover:underline">
                          {club.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {club.contactInfo.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <a href={`mailto:${club.contactInfo.email}`} className="hover:underline">
                          {club.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {club.contactInfo.website && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <a 
                          href={club.contactInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {formatUrl(club.contactInfo.website)}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p>{club.location.address}</p>
                      <p>{club.location.city}, {club.location.country}</p>
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Voir sur la carte
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Liens sociaux */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {club.socialLinks.instagram && (
                    <a 
                      href={`https://instagram.com/${club.socialLinks.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      <span>@{club.socialLinks.instagram}</span>
                    </a>
                  )}
                  {club.socialLinks.facebook && (
                    <a 
                      href={`https://facebook.com/${club.socialLinks.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
                    >
                      <Facebook className="h-3.5 w-3.5" />
                      <span>{club.socialLinks.facebook}</span>
                    </a>
                  )}
                  {club.socialLinks.twitter && (
                    <a 
                      href={`https://twitter.com/${club.socialLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                      <span>@{club.socialLinks.twitter}</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Horaires d'ouverture */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-1">
                  <OpeningHourRow day="Lundi" hours={club.openingHours.monday} />
                  <OpeningHourRow day="Mardi" hours={club.openingHours.tuesday} />
                  <OpeningHourRow day="Mercredi" hours={club.openingHours.wednesday} />
                  <OpeningHourRow day="Jeudi" hours={club.openingHours.thursday} />
                  <OpeningHourRow day="Vendredi" hours={club.openingHours.friday} />
                  <OpeningHourRow day="Samedi" hours={club.openingHours.saturday} />
                  <OpeningHourRow day="Dimanche" hours={club.openingHours.sunday} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Caractéristiques */}
          <div>
            <h3 className="font-semibold mb-3">Caractéristiques</h3>
            <div className="flex flex-wrap gap-2">
              {club.features.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Galerie */}
          <div>
            <h3 className="font-semibold mb-3">Galerie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {club.mediaGallery.map((media) => (
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
          </div>
        </TabsContent>
        
        {/* Tab Avis */}
        <TabsContent value="reviews" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Avis des clients</h2>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{club.rating}</span>
              <span className="text-muted-foreground ml-1">({club.reviewCount} avis)</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {club.reviews.map((review) => (
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
    </ResponsiveLayout>
  );
}