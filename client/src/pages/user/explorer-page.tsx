import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useGeolocation } from "@/hooks/use-geolocation";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import MobileEventCard from "@/components/MobileEventCard";
import EventCard from "@/components/EventCard";
import CategoryFilter from "@/components/CategoryFilter";
import LocationDisplay from "@/components/LocationDisplay";
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
  Navigation
} from "lucide-react";
import { Link } from "wouter";
import { 
  prioritizeEventsByCity, 
  getDistanceFromLatLonInKm,
  formatDistance,
  sortEventsByDistance
} from "@/lib/geo-utils";

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
  },
];

export default function UserExplorerPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  
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

  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("découvrir");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Distance maximale en km
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);

  // Utiliser la géolocalisation
  const { latitude, longitude, city, country, loading: geoLoading } = useGeolocation();

  // Utiliser les événements mockés au lieu de useQuery
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

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

  // Header content for the layout
  const headerContent = (
    <div className="w-full flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg text-white">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
      </h1>
      
      <div className="flex items-center space-x-2">
        <Link to="/user/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
        </Link>
        
        <Link to="/user/tickets">
          <Button variant="ghost" size="icon">
            <Ticket className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );

  // Sidebar content for desktop
  const sidebarContent = (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-medium mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "Tous" : category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-medium mb-3">Artistes Tendance</h3>
        <div className="space-y-3">
          {["DJ Elektra", "MC Blaze", "Luna Ray"].map((artist) => (
            <div key={artist} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                {artist.charAt(0)}
              </div>
              <span>{artist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="home"
      headerContent={headerContent}
      sidebarContent={sidebarContent}
    >
      {/* Mobile search and filters */}
      {isMobile && (
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Explorer</h2>
            <LocationDisplay 
              displayMode="badge" 
              onCitySelect={handleCityChange}
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des événements..."
              className="pl-9 bg-muted border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <CategoryFilter
              categories={categories.map(c => c === 'all' ? 'Tous' : c)}
              activeCategory={activeCategory === 'all' ? 'Tous' : activeCategory}
              onChange={(category) => setActiveCategory(category === 'Tous' ? 'all' : category)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="découvrir" className="flex-1">Découvrir</TabsTrigger>
              <TabsTrigger value="tendances" className="flex-1">Tendances</TabsTrigger>
              <TabsTrigger value="nearby" className="flex-1">À proximité</TabsTrigger>
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
            <MobileEventCard 
              event={events[0]} 
              onLike={() => console.log("Liked event", events[0].id)}
              onDislike={() => console.log("Disliked event", events[0].id)}
            />
          )}
          {activeTab === "tendances" && events.filter(e => e.isFeatured).length > 0 && (
            <MobileEventCard 
              event={events.find(e => e.isFeatured) || events[0]} 
              onLike={() => console.log("Liked event")}
              onDislike={() => console.log("Disliked event")}
            />
          )}
          {activeTab === "nearby" && (
            <>
              {events.length > 0 ? (
                <>
                  <MobileEventCard 
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
                </>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </ResponsiveLayout>
  );
}