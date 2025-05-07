import React, { useState, useEffect } from "react";
import { Search, Filter, Music, MapPin, Star, Calendar, ArrowUpDown, X } from "lucide-react";
import { useLocation } from "wouter";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

// Type pour les clubs
type Club = {
  id: number;
  name: string;
  category: string;
  image: string;
  coverImage: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  description: string;
  featured: boolean;
  hasTableReservation: boolean;
  capacity: number;
  instagram?: string;
  website?: string;
  openingHours: {
    [key: string]: string;
  };
  features: string[];
  upcomingEvents?: {
    id: number;
    name: string;
    date: string;
    image: string;
  }[];
  tableReservationEnabled: boolean;
};

// Données fictives de clubs pour la démo
const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    address: "Lot II J 34 D, Analakely",
    rating: 4.7,
    reviewCount: 124,
    description: "Club Oxygen est le lieu de prédilection de la vie nocturne à Antananarivo avec son ambiance électrique et sa musique de premier ordre.",
    featured: true,
    hasTableReservation: true,
    capacity: 300,
    instagram: "cluboxygen",
    website: "https://cluboxygen.com",
    openingHours: {
      "monday": "Fermé",
      "tuesday": "Fermé",
      "wednesday": "20:00 - 03:00",
      "thursday": "20:00 - 03:00",
      "friday": "20:00 - 05:00",
      "saturday": "20:00 - 05:00",
      "sunday": "18:00 - 02:00"
    },
    features: ["DJ résident", "Espace VIP", "Service de bouteilles", "Piste de danse"],
    upcomingEvents: [
      { id: 101, name: "Summer Vibes", date: "2025-05-15", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=200&auto=format&fit=crop" },
      { id: 102, name: "House Music Festival", date: "2025-05-22", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?w=300&h=200&auto=format&fit=crop" }
    ],
    tableReservationEnabled: true
  },
  {
    id: 2,
    name: "Le Studio",
    category: "Lounge Bar",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    address: "Ivandry, Route de l'aéroport",
    rating: 4.5,
    reviewCount: 87,
    description: "Un espace lounge élégant offrant une sélection de cocktails artisanaux et une ambiance plus détendue pour les discussions et networking.",
    featured: false,
    hasTableReservation: true,
    capacity: 150,
    instagram: "lestudiomada",
    openingHours: {
      "monday": "Fermé",
      "tuesday": "18:00 - 00:00",
      "wednesday": "18:00 - 01:00",
      "thursday": "18:00 - 01:00",
      "friday": "18:00 - 02:00",
      "saturday": "18:00 - 02:00",
      "sunday": "18:00 - 00:00"
    },
    features: ["Cocktails artisanaux", "Espace lounge", "Terrasse", "Ambiance jazz"],
    upcomingEvents: [
      { id: 103, name: "Jazz Night", date: "2025-05-18", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&auto=format&fit=crop" }
    ],
    tableReservationEnabled: true
  },
  {
    id: 3,
    name: "Havana Club",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=800&h=400&auto=format&fit=crop",
    location: "Tamatave",
    address: "Boulevard de la libération",
    rating: 4.8,
    reviewCount: 156,
    description: "Havana Club vous transporte dans l'ambiance cubaine avec sa musique latino, ses cocktails cubains et son atmosphère chaleureuse.",
    featured: true,
    hasTableReservation: true,
    capacity: 250,
    instagram: "havanaclub_mada",
    website: "https://havanaclub-mada.com",
    openingHours: {
      "monday": "Fermé",
      "tuesday": "Fermé",
      "wednesday": "Fermé",
      "thursday": "21:00 - 04:00",
      "friday": "21:00 - 05:00",
      "saturday": "21:00 - 05:00",
      "sunday": "19:00 - 02:00"
    },
    features: ["Soirées à thème", "Musique latine", "Spectacles live", "Bar à rhum"],
    upcomingEvents: [
      { id: 104, name: "Salsa Night", date: "2025-05-16", image: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=300&h=200&auto=format&fit=crop" },
      { id: 105, name: "Cuban Party", date: "2025-05-23", image: "https://images.unsplash.com/photo-1535359056830-d4badde79747?w=300&h=200&auto=format&fit=crop" }
    ],
    tableReservationEnabled: true
  },
  {
    id: 4,
    name: "Sky Lounge",
    category: "Rooftop Bar",
    image: "https://images.unsplash.com/photo-1527015102068-d6dd86f90cf6?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1527015102068-d6dd86f90cf6?w=800&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    address: "Ankorondrano, Tour Zital 15ème étage",
    rating: 4.6,
    reviewCount: 92,
    description: "Un rooftop bar avec une vue panoramique sur la ville, parfait pour les couchers de soleil et une ambiance sophistiquée.",
    featured: false,
    hasTableReservation: true,
    capacity: 120,
    instagram: "skylounge_tana",
    website: "https://skylounge.mg",
    openingHours: {
      "monday": "17:00 - 00:00",
      "tuesday": "17:00 - 00:00",
      "wednesday": "17:00 - 01:00",
      "thursday": "17:00 - 01:00",
      "friday": "17:00 - 02:00",
      "saturday": "17:00 - 02:00",
      "sunday": "16:00 - 23:00"
    },
    features: ["Vue panoramique", "Cocktails premium", "Cuisine fusion", "DJ weekend"],
    tableReservationEnabled: true
  },
  {
    id: 5,
    name: "Jungle Club",
    category: "Beach Club",
    image: "https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=800&h=400&auto=format&fit=crop",
    location: "Majunga",
    address: "Plage d'Amborovy",
    rating: 4.4,
    reviewCount: 78,
    description: "Beach club en plein air avec piscine, accès à la plage et ambiance détendue de jour comme de nuit.",
    featured: false,
    hasTableReservation: false,
    capacity: 200,
    instagram: "jungleclub_mada",
    openingHours: {
      "monday": "10:00 - 22:00",
      "tuesday": "10:00 - 22:00",
      "wednesday": "10:00 - 22:00",
      "thursday": "10:00 - 00:00",
      "friday": "10:00 - 02:00",
      "saturday": "10:00 - 03:00",
      "sunday": "10:00 - 22:00"
    },
    features: ["Piscine", "Accès plage", "Restaurant", "Bar extérieur"],
    upcomingEvents: [
      { id: 106, name: "Beach Party", date: "2025-05-17", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&h=200&auto=format&fit=crop" }
    ],
    tableReservationEnabled: false
  },
  {
    id: 6,
    name: "Le Club",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1545128485-c400ce7b15ca?w=400&h=300&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1545128485-c400ce7b15ca?w=800&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    address: "Behoririka, Rue Rainandriamampandry",
    rating: 4.2,
    reviewCount: 65,
    description: "Club moderne avec un système son de pointe et des DJs nationaux et internationaux qui s'y produisent régulièrement.",
    featured: false,
    hasTableReservation: true,
    capacity: 280,
    instagram: "leclub_tana",
    openingHours: {
      "monday": "Fermé",
      "tuesday": "Fermé",
      "wednesday": "Fermé",
      "thursday": "22:00 - 04:00",
      "friday": "22:00 - 05:00",
      "saturday": "22:00 - 05:00",
      "sunday": "Fermé"
    },
    features: ["Système son Funktion One", "Grands DJs", "Spectacles de lumière", "Espace fumeur"],
    upcomingEvents: [
      { id: 107, name: "Techno Night", date: "2025-05-24", image: "https://images.unsplash.com/photo-1575417017574-4780862a3234?w=300&h=200&auto=format&fit=crop" }
    ],
    tableReservationEnabled: true
  }
];

// Catégories de clubs
const clubCategories = [
  "Toutes les catégories",
  "Nightclub",
  "Lounge Bar",
  "Rooftop Bar",
  "Beach Club",
  "Live Music Venue",
  "Jazz Club",
  "Sports Bar"
];

// Villes
const locations = [
  "Toutes les villes",
  "Antananarivo",
  "Tamatave",
  "Majunga",
  "Fianarantsoa",
  "Diego-Suarez",
  "Tuléar"
];

// Fonctionnalités de club
const clubFeatures = [
  "DJ résident",
  "Espace VIP",
  "Service de bouteilles",
  "Terrasse",
  "Vue panoramique",
  "Spectacles live",
  "Piscine",
  "Accès plage",
  "Restaurant",
  "Cuisine fusion",
  "Cocktails artisanaux",
  "Bar à rhum",
  "Musique latine",
  "Ambiance jazz"
];

// Composant pour afficher une carte de club
function ClubCard({ club }: { club: Club }) {
  const [, setLocation] = useLocation();
  
  return (
    <Card className={cn(
      "h-full overflow-hidden transition-all duration-200 hover:shadow-md",
      club.featured && "border-primary/40"
    )}>
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img 
            src={club.image} 
            alt={club.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {club.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Featured
          </Badge>
        )}
        
        {club.tableReservationEnabled && (
          <Badge className="absolute top-2 left-2 bg-green-600">
            Réservation de table
          </Badge>
        )}
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-lg md:text-xl font-bold mb-0">{club.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{club.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="font-medium">{club.rating}</span>
          <span className="text-muted-foreground text-sm">({club.reviewCount} avis)</span>
        </div>
        
        <Badge variant="outline" className="bg-muted/50 mb-3">
          {club.category}
        </Badge>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {club.description}
        </p>
        
        <div className="mt-2 text-sm">
          <span className="font-medium">Horaires aujourd'hui: </span>
          {club.openingHours[getDayOfWeek()] || "Fermé"}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {club.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {club.features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{club.features.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={() => setLocation(`/club-profile/${club.id}`)}
          className="w-full"
          variant="default"
        >
          Voir profil
        </Button>
        
        {club.tableReservationEnabled && (
          <Button 
            onClick={() => setLocation(`/club/table-reservation/${club.id}`)}
            className="w-full"
            variant="outline"
          >
            Réserver une table
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Obtenir le jour de la semaine actuel (en français, en minuscules)
function getDayOfWeek(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
}

export default function SearchClubsPage() {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedLocation, setSelectedLocation] = useState("Toutes les villes");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [capacityRange, setCapacityRange] = useState([100, 350]);
  const [sortBy, setSortBy] = useState("rating");
  const [showTableReservationOnly, setShowTableReservationOnly] = useState(false);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>(mockClubs);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  
  // Fonction pour basculer une fonctionnalité sélectionnée
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(item => item !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  // Appliquer les filtres
  useEffect(() => {
    let result = [...mockClubs];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        club => club.name.toLowerCase().includes(query) ||
                club.description.toLowerCase().includes(query) ||
                club.category.toLowerCase().includes(query) ||
                club.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Filtre par catégorie
    if (selectedCategory !== "Toutes les catégories") {
      result = result.filter(
        club => club.category === selectedCategory
      );
    }
    
    // Filtre par lieu
    if (selectedLocation !== "Toutes les villes") {
      result = result.filter(
        club => club.location === selectedLocation
      );
    }
    
    // Filtre par fonctionnalités
    if (selectedFeatures.length > 0) {
      result = result.filter(
        club => selectedFeatures.every(feature => club.features.includes(feature))
      );
    }
    
    // Filtre par réservation de table
    if (showTableReservationOnly) {
      result = result.filter(club => club.tableReservationEnabled);
    }
    
    // Filtre par capacité
    result = result.filter(
      club => club.capacity >= capacityRange[0] && club.capacity <= capacityRange[1]
    );
    
    // Tri
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredClubs(result);
  }, [searchQuery, selectedCategory, selectedLocation, selectedFeatures, capacityRange, showTableReservationOnly, sortBy]);
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Toutes les catégories");
    setSelectedLocation("Toutes les villes");
    setSelectedFeatures([]);
    setCapacityRange([100, 350]);
    setShowTableReservationOnly(false);
    setSortBy("rating");
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été remis à zéro.",
    });
  };
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Rechercher un club</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Music className="h-3 w-3 mr-1" />
          <span>Clubs</span>
        </Badge>
      </div>
    </div>
  );
  
  // Contenu de filtrage pour mobile
  const mobileFilterContent = (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Filtrer les clubs</SheetTitle>
          <SheetDescription>
            Affinez votre recherche avec les filtres ci-dessous
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(85vh-10rem)] pr-4">
          <div className="space-y-6">
            {/* Catégorie de club */}
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Catégories</SelectLabel>
                    {clubCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Localisation */}
            <div className="space-y-2">
              <Label>Ville</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Villes</SelectLabel>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Capacité */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Capacité</Label>
                <span className="text-sm text-muted-foreground">
                  {capacityRange[0]} - {capacityRange[1]} personnes
                </span>
              </div>
              <Slider 
                defaultValue={[100, 350]} 
                value={capacityRange}
                onValueChange={setCapacityRange}
                min={50} 
                max={500}
                step={10}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50 pers.</span>
                <span>500 pers.</span>
              </div>
            </div>
            
            {/* Fonctionnalités */}
            <div className="space-y-2">
              <Label>Fonctionnalités</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {clubFeatures.map((feature) => (
                  <Button
                    key={feature}
                    variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => toggleFeature(feature)}
                  >
                    <span className="truncate">{feature}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Réservation de table */}
            <div className="flex items-center justify-between">
              <Label>Réservation de table uniquement</Label>
              <Switch 
                checked={showTableReservationOnly} 
                onCheckedChange={setShowTableReservationOnly} 
              />
            </div>
          </div>
        </ScrollArea>
        
        <SheetFooter className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex-1"
          >
            Réinitialiser
          </Button>
          <SheetClose asChild>
            <Button className="flex-1">Appliquer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
  // Contenu de tri pour mobile
  const mobileSortContent = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <ArrowUpDown className="h-4 w-4" />
          <span>Trier</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[40vh] rounded-t-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Trier les clubs</SheetTitle>
          <SheetDescription>
            Choisissez comment ordonner les résultats
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-2">
          <Button 
            variant={sortBy === "rating" ? "default" : "outline"}
            className="w-full justify-start" 
            onClick={() => setSortBy("rating")}
          >
            <Star className="h-4 w-4 mr-2" />
            Meilleure note
          </Button>
          
          <Button 
            variant={sortBy === "popularity" ? "default" : "outline"}
            className="w-full justify-start" 
            onClick={() => setSortBy("popularity")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Popularité
          </Button>
          
          <Button 
            variant={sortBy === "name" ? "default" : "outline"}
            className="w-full justify-start" 
            onClick={() => setSortBy("name")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Ordre alphabétique
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  // Contenu de filtrage pour desktop
  const desktopFilterContent = (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filtres</CardTitle>
        <CardDescription>
          Affinez votre recherche de clubs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Catégorie de club */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Catégories</SelectLabel>
                {clubCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Localisation */}
        <div className="space-y-2">
          <Label>Ville</Label>
          <Select 
            value={selectedLocation} 
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Villes</SelectLabel>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Capacité */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Capacité</Label>
            <span className="text-sm text-muted-foreground">
              {capacityRange[0]} - {capacityRange[1]} personnes
            </span>
          </div>
          <Slider 
            defaultValue={[100, 350]} 
            value={capacityRange}
            onValueChange={setCapacityRange}
            min={50} 
            max={500}
            step={10}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50 pers.</span>
            <span>500 pers.</span>
          </div>
        </div>
        
        {/* Réservation de table */}
        <div className="flex items-center justify-between">
          <Label>Réservation de table uniquement</Label>
          <Switch 
            checked={showTableReservationOnly} 
            onCheckedChange={setShowTableReservationOnly} 
          />
        </div>
        
        {/* Fonctionnalités */}
        <div className="space-y-2 pt-2">
          <Label>Fonctionnalités</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {clubFeatures.map((feature) => (
              <Button
                key={feature}
                variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                size="sm"
                className="justify-start px-3 py-1 h-auto"
                onClick={() => toggleFeature(feature)}
              >
                <span className="truncate">{feature}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Options de tri */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Trier par</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant={sortBy === "rating" ? "default" : "outline"}
              className="w-full justify-start" 
              onClick={() => setSortBy("rating")}
              size="sm"
            >
              <Star className="h-4 w-4 mr-2" />
              Meilleure note
            </Button>
            
            <Button 
              variant={sortBy === "popularity" ? "default" : "outline"}
              className="w-full justify-start" 
              onClick={() => setSortBy("popularity")}
              size="sm"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Popularité
            </Button>
            
            <Button 
              variant={sortBy === "name" ? "default" : "outline"}
              className="w-full justify-start" 
              onClick={() => setSortBy("name")}
              size="sm"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordre alphabétique
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={resetFilters}
        >
          Réinitialiser les filtres
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <ResponsiveLayout headerContent={headerContent}>
      <div className="w-full">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un club, une catégorie, des fonctionnalités..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isMobile ? (
            <div className="flex gap-2">
              {mobileFilterContent}
              {mobileSortContent}
            </div>
          ) : null}
        </div>
        
        {/* Affichage des résultats */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filtres (desktop) */}
          {!isMobile && (
            <div className="hidden md:block md:w-1/4 lg:w-1/5">
              {desktopFilterContent}
            </div>
          )}
          
          {/* Liste des clubs */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
              </h2>
              
              {/* Affichage des filtres actifs */}
              <div className="flex flex-wrap gap-2 justify-end">
                {selectedCategory !== "Toutes les catégories" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedCategory("Toutes les catégories")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedLocation !== "Toutes les villes" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLocation}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedLocation("Toutes les villes")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {showTableReservationOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Réservation de table
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setShowTableReservationOnly(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedFeatures.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedFeatures.length} fonctionnalité{selectedFeatures.length > 1 ? 's' : ''}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedFeatures([])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
            
            {filteredClubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucun club trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}