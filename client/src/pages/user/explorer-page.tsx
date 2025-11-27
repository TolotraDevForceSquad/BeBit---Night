import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import MobileEventCard from "@/components/MobileEventCard";
import MoodEventCard from "@/components/MoodEventCard";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import LocationDisplay from "@/components/LocationDisplay";
import UserLayout from "@/layouts/user-layout";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Bell, 
  Ticket, 
  Calendar, 
  Heart, 
  Wallet, 
  Star, 
  Settings, 
  MapPin, 
  Navigation,
  X,
  Building,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { 
  prioritizeEventsByCity, 
  getDistanceFromLatLonInKm,
  formatDistance,
  sortEventsByDistance
} from "@/lib/geo-utils";
import { EventMood } from "@/lib/mood-utils";

// Type pour l'utilisateur authentifié et l'événement
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  profileImage?: string;
};

// Définir le type d'événement pour l'interface (pas le même que celui de la base de données)
type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  category: string;
  venueName: string;
  price: number;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
  isLiked?: boolean;
  calculatedDistance?: number; // Distance calculée par rapport à la position de l'utilisateur
  mood?: EventMood; // Ambiance de l'événement
  superLiked?: boolean; // Si l'utilisateur a super-liké l'événement
};

// Données statiques pour les tests
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Soirée Techno avec DJ Elektra",
    description: "Une soirée techno inoubliable avec DJ Elektra. Venez vibrer sur les meilleurs sons électro de la scène parisienne. Un voyage sonore à ne pas manquer !",
    date: "2023-12-15T20:00:00",
    coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=500&h=300&fit=crop",
    category: "Techno",
    venueName: "Club Oxygen",
    city: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    price: 25,
    isFeatured: true,
    mood: "energetic",
  },
  {
    id: 2,
    title: "House Party avec MC Blaze",
    description: "Venez vibrer sur les meilleurs morceaux house du moment avec MC Blaze, DJ reconnu de la scène house internationale. Une soirée qui s'annonce mémorable !",
    date: "2023-12-22T21:00:00",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
    category: "House",
    venueName: "Loft 21",
    city: "Lyon",
    country: "France",
    latitude: 45.7640,
    longitude: 4.8357,
    price: 20,
    mood: "festive",
  },
  {
    id: 3,
    title: "Soirée Jazz Live",
    description: "Une ambiance jazzy avec les meilleurs musiciens de la scène parisienne. Un moment de détente et de découverte musicale dans un cadre intimiste.",
    date: "2023-12-18T19:30:00",
    coverImage: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&h=300&fit=crop",
    category: "Jazz",
    venueName: "Blue Note",
    city: "Paris",
    country: "France",
    latitude: 48.8584,
    longitude: 2.3488,
    price: 30,
    isLiked: true,
    mood: "chill",
  },
  {
    id: 4,
    title: "Hip-Hop Underground",
    description: "Découvrez les talents émergents de la scène hip-hop locale. Des flows percutants et des beats qui décoiffent !",
    date: "2023-12-23T22:00:00",
    coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=500&h=300&fit=crop",
    category: "Hip-Hop",
    venueName: "Le Bunker",
    city: "Marseille",
    country: "France",
    latitude: 43.2965,
    longitude: 5.3698,
    price: 15,
    mood: "dark",
  },
  {
    id: 5,
    title: "Nuit Électro",
    description: "Une nuit entière dédiée à l'électro avec des DJs internationaux. De 23h à l'aube pour les vrais passionnés.",
    date: "2023-12-30T23:00:00",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    category: "Électro",
    venueName: "Warehouse",
    city: "Bordeaux",
    country: "France",
    latitude: 44.8378,
    longitude: -0.5792,
    price: 35,
    isFeatured: true,
    mood: "energetic",
  },
  {
    id: 6,
    title: "Funk & Soul Party",
    description: "Plongez dans l'univers funk et soul des années 70-80. Dress code: paillettes et couleurs vives !",
    date: "2023-12-29T21:00:00",
    coverImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=300&fit=crop",
    category: "Funk",
    venueName: "Studio 54",
    city: "Lille",
    country: "France",
    latitude: 50.6329,
    longitude: 3.0581,
    price: 25,
    mood: "romantic",
  },
];

export default function UserExplorerPage() {
  // Utilisation du UserLayout sera gérée par le routeur dans App.tsx
  const [user, setUser] = useState<AuthUser | null>(null);
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("découvrir");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(25); // Distance maximale en km
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const { toast } = useToast();

  // Utiliser la géolocalisation
  const { latitude, longitude, city, country, loading: geoLoading } = useGeolocation();
  
  // Utiliser les événements mockés au lieu de useQuery
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  
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

  // Mettre à jour la ville sélectionnée quand la géolocalisation est disponible
  useEffect(() => {
    if (city && !selectedCity) {
      setSelectedCity(city);
    }
  }, [city, selectedCity]);

  // Fonction pour changer la ville
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };
  
  // Simuler un chargement des données avec tri par localisation
  useEffect(() => {
    const timer = setTimeout(() => {
      // Filtrer les événements selon la catégorie et la recherche
      let filteredEvents = [...mockEvents];
      
      if (activeCategory !== "all") {
        filteredEvents = filteredEvents.filter(e => e.category === activeCategory);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(e => 
          e.title.toLowerCase().includes(query) || 
          e.description.toLowerCase().includes(query) ||
          e.venueName.toLowerCase().includes(query)
        );
      }
      
      // Filtrer par distance si la géolocalisation est active
      if (activeTab === "nearby" && isMobile && latitude && longitude) {
        // Filtrer les événements qui ont des coordonnées
        filteredEvents = filteredEvents.filter(event => 
          event.latitude && event.longitude
        );
        
        // Calculer la distance pour chaque événement et filtrer ceux dans le rayon souhaité
        filteredEvents = filteredEvents.filter(event => {
          if (!event.latitude || !event.longitude) return false;
          
          const distance = getDistanceFromLatLonInKm(
            latitude, 
            longitude, 
            event.latitude, 
            event.longitude
          );
          
          // Ajouter la distance calculée à l'événement pour l'affichage
          event.calculatedDistance = distance;
          
          // Filtrer par rayon
          return distance <= maxDistance;
        });
        
        // Trier par distance croissante
        filteredEvents.sort((a, b) => {
          if (!a.calculatedDistance || !b.calculatedDistance) return 0;
          return a.calculatedDistance - b.calculatedDistance;
        });
      } else if (selectedCity) {
        // Dans les autres onglets, prioriser les événements dans la ville sélectionnée
        filteredEvents = prioritizeEventsByCity(filteredEvents, selectedCity);
      }
      
      // Réinitialiser l'index courant
      setCurrentEventIndex(0);
      setEvents(filteredEvents);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, activeTab, selectedCity, latitude, longitude, maxDistance]);

  // Dummy categories for now
  const categories = ["all", "House", "Techno", "Hip-Hop", "Jazz", "Funk", "EDM"];

  // Header content for the layout (supprimé car dupliqué avec UserLayout)

  // Sidebar content for desktop (supprimé car déplacé dans le contenu principal)
  const sidebarContent = null;

  return (
    <div className="pb-16">
      {/* Espace pour l'en-tête géré par UserLayout */}
      <div className="mb-4"></div>
      
      {/* Mobile search and filters */}
      {isMobile && (
        <div className="mb-4 space-y-4">
          {/* Entête avec titre et localisation */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Explorer
            </h2>
            <LocationDisplay 
              displayMode="badge" 
              onCitySelect={handleCityChange}
            />
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des événements..."
              className="pl-9 bg-muted border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtres par catégorie - scrollable */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <CategoryFilter
              categories={categories.map(c => c === 'all' ? 'Tous' : c)}
              activeCategory={activeCategory === 'all' ? 'Tous' : activeCategory}
              onChange={(category) => setActiveCategory(category === 'Tous' ? 'all' : category)}
            />
          </div>
          
          {/* Onglets principaux */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="découvrir" className="flex-1">
                <Heart className="h-3.5 w-3.5 mr-1" />
                Découvrir
              </TabsTrigger>
              <TabsTrigger value="tendances" className="flex-1">
                <Star className="h-3.5 w-3.5 mr-1" />
                Tendances
              </TabsTrigger>
              <TabsTrigger value="nearby" className="flex-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Proximité
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Contrôle du rayon de distance (visible uniquement dans l'onglet "À proximité") */}
          {activeTab === "nearby" && (
            <div className="pt-2 pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm flex items-center">
                  <Navigation className="h-4 w-4 mr-1" /> 
                  Rayon: <span className="font-medium ml-1">{maxDistance} km</span>
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setMaxDistance(50)}  // Réinitialiser à 50km
                >
                  Réinitialiser
                </Button>
              </div>
              <Slider
                value={[maxDistance]}
                min={5}
                max={200}
                step={5}
                onValueChange={(values) => setMaxDistance(values[0])}
                className="py-4"
              />
            </div>
          )}
        </div>
      )}
      
      {/* Desktop search and title */}
      {!isMobile && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Explorez les événements</h1>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground">
                  Découvrez les meilleurs événements et artistes près de chez vous
                </p>
                <LocationDisplay 
                  displayMode="badge" 
                  onCitySelect={handleCityChange}
                  showSelector={true}
                />
              </div>
            </div>
            
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des événements..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Section Catégories et Artistes Tendance */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3 bg-card rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-3">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === "all" ? "Tous" : category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-card rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-3">Artistes Tendance</h3>
              <div className="grid grid-cols-2 gap-3">
                {["DJ Elektra", "MC Blaze", "Luna Ray", "Banda Roots"].map((artist) => (
                  <div key={artist} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      {artist.charAt(0)}
                    </div>
                    <span className="truncate">{artist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Empty state */}
      {events && events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}
      
      {/* Mobile event cards (TikTok style) */}
      {isMobile && events && events.length > 0 && (
        <div className="space-y-4">
          {activeTab === "découvrir" && (
            <div className="flex flex-col h-full">
              {/* Version Tinder complète avec swipe card et boutons d'action */}
              {events.length > 0 ? (
                <>
                  {/* En-tête avec barre de progression */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-2 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
                        Découvrez des événements près de vous
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {currentEventIndex + 1} / {events.length}
                      </span>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="flex mb-1 px-1">
                      {events.slice(0, Math.min(5, events.length)).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full mx-0.5 ${
                            i <= currentEventIndex ? "bg-primary" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
              
                  {/* Carte principale en plein écran avec fond dynamique basé sur l'ambiance */}
                  <div className="relative h-[calc(100vh-220px)] mb-2">
                    <MoodEventCard 
                      event={events[currentEventIndex]} 
                      className="swipeable-card"
                      onLike={() => {
                        // Animation puis passage à l'événement suivant
                        if (currentEventIndex < events.length - 1) {
                          toast({
                            title: "J'aime",
                            description: `Vous avez aimé "${events[currentEventIndex].title}"`,
                            duration: 2000
                          });
                          setCurrentEventIndex(currentEventIndex + 1);
                        } else {
                          // Plus d'événements, afficher un message
                          toast({
                            title: "Fin des événements",
                            description: "Vous avez parcouru tous les événements disponibles",
                            duration: 3000
                          });
                        }
                      }}
                      onDislike={() => {
                        // Animation puis passage à l'événement suivant
                        if (currentEventIndex < events.length - 1) {
                          toast({
                            title: "Passer",
                            description: `Vous avez passé "${events[currentEventIndex].title}"`,
                            duration: 2000
                          });
                          setCurrentEventIndex(currentEventIndex + 1);
                        } else {
                          // Plus d'événements, afficher un message
                          toast({
                            title: "Fin des événements",
                            description: "Vous avez parcouru tous les événements disponibles",
                            duration: 3000
                          });
                        }
                      }}
                      onSuperLike={() => {
                        // Animation spéciale puis passage à l'événement suivant
                        if (currentEventIndex < events.length - 1) {
                          toast({
                            title: "Super Like!",
                            description: `Vous avez super-liké "${events[currentEventIndex].title}"`,
                            duration: 2000
                          });
                          setCurrentEventIndex(currentEventIndex + 1);
                        } else {
                          toast({
                            title: "Fin des événements",
                            description: "Vous avez parcouru tous les événements disponibles",
                            duration: 3000
                          });
                        }
                      }}
                    />
                    
                    {/* Boutons d'action style Tinder */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-10">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-orange-500 hover:bg-orange-50"
                        onClick={() => {
                          // Animation de rewind (revenir à l'événement précédent)
                          if (currentEventIndex > 0) {
                            toast({
                              title: "Événement précédent",
                              description: "Retour à l'événement précédent",
                              duration: 2000,
                            });
                            setCurrentEventIndex(currentEventIndex - 1);
                          } else {
                            toast({
                              description: "C'est le premier événement",
                              variant: "destructive",
                              duration: 2000,
                            });
                          }
                        }}
                      >
                        <Calendar className="h-6 w-6 text-orange-500" />
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-red-500 hover:bg-red-50"
                        onClick={() => {
                          // Animation de dislike puis passage à l'événement suivant
                          toast({
                            description: `Vous n'êtes pas intéressé par "${events[currentEventIndex].title}"`,
                            variant: "default",
                            duration: 2000,
                          });
                          
                          // Passage à l'événement suivant avec délai pour voir le toast
                          setTimeout(() => {
                            if (currentEventIndex < events.length - 1) {
                              setCurrentEventIndex(currentEventIndex + 1);
                            } else {
                              toast({
                                title: "Fin des événements",
                                description: "Vous avez vu tous les événements disponibles",
                                variant: "default",
                                duration: 3000,
                              });
                            }
                          }, 300);
                        }}
                      >
                        <X className="h-8 w-8 text-red-500" />
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="h-16 w-16 rounded-full p-0 bg-white shadow-lg border-2 border-green-500 hover:bg-green-50"
                        onClick={() => {
                          // Animation de like puis passage à l'événement suivant
                          console.log("Liked event", events[currentEventIndex].id);
                          // Afficher un message toast de confirmation
                          toast({
                            title: "J'adore!",
                            description: `Vous avez aimé "${events[currentEventIndex].title}"`,
                            duration: 3000,
                          });
                          
                          // Marquer l'événement comme aimé
                          const updatedEvents = [...events];
                          updatedEvents[currentEventIndex] = {
                            ...updatedEvents[currentEventIndex],
                            isLiked: true
                          };
                          setEvents(updatedEvents);
                          
                          // Attendre un peu avant de passer au suivant pour voir l'animation
                          setTimeout(() => {
                            if (currentEventIndex < events.length - 1) {
                              setCurrentEventIndex(currentEventIndex + 1);
                            }
                          }, 500);
                        }}
                      >
                        <Heart className="h-8 w-8 text-green-500" />
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="h-14 w-14 rounded-full p-0 bg-white shadow-lg border-2 border-blue-500 hover:bg-blue-50"
                        onClick={() => {
                          // Super like (réserver un ticket)
                          console.log("Super liked event", events[currentEventIndex].id);
                          
                          // Afficher un message toast avec une action
                          toast({
                            title: "Réserver un ticket",
                            description: `Pour l'événement "${events[currentEventIndex].title}"`,
                            action: (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-primary/10 hover:bg-primary/20 border-primary"
                                onClick={() => {
                                  // Simuler une réservation directe
                                  toast({
                                    title: "Réservation confirmée!",
                                    description: `Votre ticket pour "${events[currentEventIndex].title}" a été réservé`,
                                    variant: "default",
                                    duration: 3000,
                                  });
                                  
                                  // Redirection alternative: stocker dans le localStorage et rediriger
                                  localStorage.setItem('reserved_event', JSON.stringify(events[currentEventIndex]));
                                  
                                  // Après un délai pour voir le toast de confirmation
                                  setTimeout(() => {
                                    window.location.href = '/user/tickets';
                                  }, 1000);
                                }}
                              >
                                Confirmer
                              </Button>
                            ),
                            duration: 5000,
                          });
                          
                          // Marquer l'événement avec une indication visuelle
                          const updatedEvents = [...events];
                          updatedEvents[currentEventIndex] = {
                            ...updatedEvents[currentEventIndex],
                            superLiked: true
                          };
                          setEvents(updatedEvents);
                          
                          // Attendre avant de passer au suivant
                          setTimeout(() => {
                            if (currentEventIndex < events.length - 1) {
                              setCurrentEventIndex(currentEventIndex + 1);
                            }
                          }, 1000);
                        }}
                      >
                        <Ticket className="h-6 w-6 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Filtres compacts en style Tinder */}
                  <div className="mt-1 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0"
                          onClick={() => {
                            // Ouvrir une sheet/drawer pour les filtres avancés
                            console.log("Open filters");
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          <span className="text-xs">Filtres</span>
                        </Button>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className="font-normal"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {city || "Votre position"} • {maxDistance} km
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                // État vide
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Aucun événement à proximité
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Essayez d'augmenter votre rayon de recherche<br/>ou de changer de localisation
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setMaxDistance(Math.min(maxDistance + 10, 50))}
                  >
                    Augmenter le rayon à {Math.min(maxDistance + 10, 50)} km
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "tendances" && events.filter(e => e.isFeatured).length > 0 && (
            <div className="flex flex-col">
              {/* PARTIE 1: Featured artists en haut */}
              <div className="order-1 mb-3">
                <div className="bg-card rounded-lg p-3 border border-border mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Artistes en vedette</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      Voir tous
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["DJ Elektra", "MC Blaze"].map((artist) => (
                      <div key={artist} className="flex items-center p-2 bg-muted rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center mr-2">
                          {artist.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{artist}</div>
                          <div className="text-xs text-muted-foreground">3 événements</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* PARTIE 2: Event Card en dessous */}
              <div className="order-2 mt-4">
                <MoodEventCard 
                  event={events.find(e => e.isFeatured) || events[0]} 
                  onLike={() => console.log("Liked event")}
                  onDislike={() => console.log("Disliked event")}
                  onSuperLike={() => console.log("Super liked event")}
                />
              </div>
            </div>
          )}
          
          {activeTab === "nearby" && (
            <>
              {events.length > 0 ? (
                <div className="flex flex-col">
                  {/* PARTIE 1: Événements à proximité en haut */}
                  <div className="order-1 mb-3">
                    {events.length > 1 && (
                      <div className="bg-card rounded-lg p-3 border border-border mb-3">
                        <h3 className="font-medium text-sm mb-2">Événements à proximité</h3>
                        <div className="space-y-2">
                          {events.filter((_, i) => i !== currentEventIndex).slice(0, 2).map((event) => (
                            <div key={event.id} className="flex items-center p-2 bg-muted rounded-lg">
                              <div 
                                className="h-12 w-12 rounded bg-cover bg-center mr-3"
                                style={{ backgroundImage: `url(${event.coverImage})` }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{event.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.city && event.calculatedDistance && (
                                    <span>{event.city} • {formatDistance(event.calculatedDistance)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* PARTIE 2: Event Card et navigation en dessous */}
                  <div className="order-2 mt-2">
                    <MoodEventCard 
                      event={events[currentEventIndex]} 
                      onLike={() => {
                        console.log("Liked event", events[currentEventIndex].id);
                        // Passer à l'événement suivant s'il en reste
                        if (currentEventIndex < events.length - 1) {
                          setCurrentEventIndex(currentEventIndex + 1);
                        }
                      }}
                      onDislike={() => {
                        console.log("Disliked event", events[currentEventIndex].id);
                        // Passer à l'événement suivant s'il en reste
                        if (currentEventIndex < events.length - 1) {
                          setCurrentEventIndex(currentEventIndex + 1);
                        }
                      }}
                      onSuperLike={() => {
                        console.log("Super liked event", events[currentEventIndex].id);
                        // Passer à l'événement suivant s'il en reste
                        if (currentEventIndex < events.length - 1) {
                          setCurrentEventIndex(currentEventIndex + 1);
                        }
                      }}
                    />
                  
                    {/* Information sur le nombre d'événements restants */}
                    <div className="flex justify-center mt-3">
                      <Badge variant="outline" className="text-xs font-normal">
                        {currentEventIndex + 1} / {events.length} événements dans un rayon de {maxDistance} km
                      </Badge>
                    </div>
                    
                    {/* Navigation entre les événements (uniquement si plus d'un événement) */}
                    {events.length > 1 && (
                      <div className="flex justify-center mt-4 space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentEventIndex(Math.max(0, currentEventIndex - 1))}
                          disabled={currentEventIndex === 0}
                        >
                          Précédent
                        </Button>
                        <Button 
                          size="sm"
                          variant="default"
                          onClick={() => setCurrentEventIndex(Math.min(events.length - 1, currentEventIndex + 1))}
                          disabled={currentEventIndex === events.length - 1}
                        >
                          Suivant
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Aucun événement à proximité
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez d'augmenter le rayon de recherche ou de changer de localisation
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Desktop event grid */}
      {!isMobile && events && events.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Événements pour vous
            </h2>
            
            <div className="flex items-center space-x-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-4">
                <TabsList>
                  <TabsTrigger value="découvrir">Découvrir</TabsTrigger>
                  <TabsTrigger value="tendances">Tendances</TabsTrigger>
                  <TabsTrigger value="nearby">À proximité</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedCity || city || "Localisation"}
              </Badge>
            </div>
          </div>
          
          {activeTab === "tendances" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {events.filter(e => e.isFeatured).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}