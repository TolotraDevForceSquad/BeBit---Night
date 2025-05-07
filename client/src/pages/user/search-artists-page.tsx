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

// Type pour les artistes
type Artist = {
  id: number;
  name: string;
  genres: string[];
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  price: number; // Prix par prestation en Ariary
  featured: boolean;
  available: boolean;
  instagramHandle?: string;
  soundcloudUrl?: string; 
  mixcloudUrl?: string;
  samples?: {
    title: string;
    url: string;
    duration: string;
  }[];
  upcomingEvents?: {
    id: number;
    name: string;
    date: string;
    location: string;
  }[];
};

// Données fictives d'artistes pour la démo
const mockArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    genres: ["House", "Techno", "Electronic"],
    image: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=400&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    rating: 4.8,
    reviewCount: 56,
    description: "DJ Elektra est connue pour ses sets énergiques et sa capacité à faire danser n'importe quelle foule. Spécialisée en house et techno.",
    price: 350000,
    featured: true,
    available: true,
    instagramHandle: "dj_elektra",
    soundcloudUrl: "https://soundcloud.com/dj-elektra",
    samples: [
      { title: "Summer Vibes Mix", url: "#", duration: "5:30" },
      { title: "Techno Night", url: "#", duration: "4:45" }
    ],
    upcomingEvents: [
      { id: 101, name: "Beach Party", date: "2025-05-15", location: "Club Oxygen" },
      { id: 102, name: "Festival Electro", date: "2025-05-22", location: "Parc Urbain" }
    ]
  },
  {
    id: 2,
    name: "MC Kool",
    genres: ["Hip-Hop", "Rap", "Trap"],
    image: "https://images.unsplash.com/photo-1618254283356-ae5fe9d0f456?w=400&h=400&auto=format&fit=crop",
    location: "Tamatave",
    rating: 4.5,
    reviewCount: 34,
    description: "MC Kool est un rappeur et MC qui enflamme la scène avec son flow unique et ses paroles percutantes.",
    price: 300000,
    featured: false,
    available: true,
    instagramHandle: "mc_kool",
    mixcloudUrl: "https://mixcloud.com/mc-kool",
    upcomingEvents: [
      { id: 103, name: "Hip-Hop Night", date: "2025-05-18", location: "Le Studio" }
    ]
  },
  {
    id: 3,
    name: "Banda Roots",
    genres: ["Reggae", "Afrobeat", "World"],
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&auto=format&fit=crop",
    location: "Majunga",
    rating: 4.9,
    reviewCount: 78,
    description: "Banda Roots est un groupe de reggae qui apporte des vibrations positives à chaque performance.",
    price: 450000,
    featured: true,
    available: false,
    instagramHandle: "bandaroots",
    soundcloudUrl: "https://soundcloud.com/banda-roots",
    samples: [
      { title: "Roots Vibration", url: "#", duration: "6:22" },
      { title: "Island Life", url: "#", duration: "4:17" }
    ]
  },
  {
    id: 4,
    name: "Lalatiana",
    genres: ["Soul", "R&B", "Jazz"],
    image: "https://images.unsplash.com/photo-1593697972672-b1c1b6969ab7?w=400&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    rating: 4.7,
    reviewCount: 42,
    description: "Lalatiana est une chanteuse à la voix exceptionnelle, spécialisée dans la soul et le jazz.",
    price: 400000,
    featured: false,
    available: true,
    instagramHandle: "lalatiana_music",
    soundcloudUrl: "https://soundcloud.com/lalatiana"
  },
  {
    id: 5,
    name: "The Groovers",
    genres: ["Funk", "Disco", "Soul"],
    image: "https://images.unsplash.com/photo-1574226516130-b38d180e8d31?w=400&h=400&auto=format&fit=crop",
    location: "Fianarantsoa",
    rating: 4.6,
    reviewCount: 29,
    description: "The Groovers est un groupe de funk qui fait bouger les danseurs avec leurs rythmes entrainants.",
    price: 500000,
    featured: false,
    available: true,
    instagramHandle: "thegroovers",
    samples: [
      { title: "Funk Town", url: "#", duration: "5:10" },
      { title: "Disco Nights", url: "#", duration: "4:35" }
    ],
    upcomingEvents: [
      { id: 104, name: "Funk Party", date: "2025-05-29", location: "Le Club" }
    ]
  },
  {
    id: 6,
    name: "DJ Nova",
    genres: ["EDM", "House", "Pop"],
    image: "https://images.unsplash.com/photo-1515443304400-3bcc63e73189?w=400&h=400&auto=format&fit=crop",
    location: "Antananarivo",
    rating: 4.4,
    reviewCount: 38,
    description: "DJ Nova mixe des hits EDM et pop pour créer une ambiance festive pour tous les événements.",
    price: 320000,
    featured: false,
    available: true,
    instagramHandle: "djnova",
    mixcloudUrl: "https://mixcloud.com/dj-nova",
    upcomingEvents: [
      { id: 105, name: "Club Night", date: "2025-05-16", location: "Metropolis" }
    ]
  }
];

// Catégories de genres musicaux
const musicGenres = [
  "Tous les genres",
  "House",
  "Techno",
  "Hip-Hop",
  "Rap",
  "Reggae",
  "Afrobeat",
  "Soul",
  "R&B",
  "Jazz",
  "Funk",
  "Disco",
  "EDM",
  "Pop",
  "Rock"
];

// Catégories de lieux
const locations = [
  "Tous les lieux",
  "Antananarivo",
  "Tamatave",
  "Majunga",
  "Fianarantsoa",
  "Diego-Suarez",
  "Tuléar"
];

// Composant pour afficher une carte d'artiste
function ArtistCard({ artist }: { artist: Artist }) {
  const [, setLocation] = useLocation();
  
  return (
    <Card className={cn(
      "h-full overflow-hidden transition-all duration-200 hover:shadow-md",
      artist.featured && "border-primary/40"
    )}>
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        {artist.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Featured
          </Badge>
        )}
        
        {!artist.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-base py-1 px-3">
              Non disponible
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-lg md:text-xl font-bold mb-0">{artist.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{artist.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="font-medium">{artist.rating}</span>
          <span className="text-muted-foreground text-sm">({artist.reviewCount} avis)</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {artist.genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {genre}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {artist.description}
        </p>
        
        <div className="font-semibold mt-2">
          {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(artist.price).replace('MGA', 'Ar')}
          <span className="text-muted-foreground font-normal text-sm"> /prestation</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={() => setLocation(`/artist-details/${artist.id}`)}
          className="w-full"
          variant="default"
          disabled={!artist.available}
        >
          Voir profil
        </Button>
        
        <Button 
          onClick={() => setLocation(`/artist-booking/${artist.id}`)}
          className="w-full"
          variant="outline"
          disabled={!artist.available}
        >
          Réserver
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SearchArtistsPage() {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous les genres");
  const [selectedLocation, setSelectedLocation] = useState("Tous les lieux");
  const [priceRange, setPriceRange] = useState([200000, 500000]);
  const [sortBy, setSortBy] = useState("rating");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(mockArtists);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  
  // Appliquer les filtres
  useEffect(() => {
    let result = [...mockArtists];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        artist => artist.name.toLowerCase().includes(query) ||
                 artist.description.toLowerCase().includes(query) ||
                 artist.genres.some(genre => genre.toLowerCase().includes(query))
      );
    }
    
    // Filtre par genre
    if (selectedGenre !== "Tous les genres") {
      result = result.filter(
        artist => artist.genres.includes(selectedGenre)
      );
    }
    
    // Filtre par lieu
    if (selectedLocation !== "Tous les lieux") {
      result = result.filter(
        artist => artist.location === selectedLocation
      );
    }
    
    // Filtre par disponibilité
    if (showAvailableOnly) {
      result = result.filter(artist => artist.available);
    }
    
    // Filtre par fourchette de prix
    result = result.filter(
      artist => artist.price >= priceRange[0] && artist.price <= priceRange[1]
    );
    
    // Tri
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      result.sort((a, b) => b.price - a.price);
    }
    
    setFilteredArtists(result);
  }, [searchQuery, selectedGenre, selectedLocation, priceRange, showAvailableOnly, sortBy]);
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("Tous les genres");
    setSelectedLocation("Tous les lieux");
    setPriceRange([200000, 500000]);
    setShowAvailableOnly(false);
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
        <span className="ml-2 text-foreground">Rechercher un artiste</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Music className="h-3 w-3 mr-1" />
          <span>Artistes</span>
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
          <SheetTitle>Filtrer les artistes</SheetTitle>
          <SheetDescription>
            Affinez votre recherche avec les filtres ci-dessous
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(85vh-10rem)] pr-4">
          <div className="space-y-6">
            {/* Genre musical */}
            <div className="space-y-2">
              <Label>Genre musical</Label>
              <Select 
                value={selectedGenre} 
                onValueChange={setSelectedGenre}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genres</SelectLabel>
                    {musicGenres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Localisation */}
            <div className="space-y-2">
              <Label>Localisation</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Lieux</SelectLabel>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Fourchette de prix */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Fourchette de prix</Label>
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(priceRange[0]).replace('MGA', 'Ar')} - 
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(priceRange[1]).replace('MGA', 'Ar')}
                </span>
              </div>
              <Slider 
                defaultValue={[200000, 500000]} 
                value={priceRange}
                onValueChange={setPriceRange}
                min={100000} 
                max={1000000}
                step={10000}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 000 Ar</span>
                <span>1 000 000 Ar</span>
              </div>
            </div>
            
            {/* Disponibilité */}
            <div className="flex items-center justify-between">
              <Label>Artistes disponibles uniquement</Label>
              <Switch 
                checked={showAvailableOnly} 
                onCheckedChange={setShowAvailableOnly} 
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
          <SheetTitle>Trier les artistes</SheetTitle>
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
            variant={sortBy === "price_low" ? "default" : "outline"}
            className="w-full justify-start" 
            onClick={() => setSortBy("price_low")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Prix: croissant
          </Button>
          
          <Button 
            variant={sortBy === "price_high" ? "default" : "outline"}
            className="w-full justify-start" 
            onClick={() => setSortBy("price_high")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2 rotate-180" />
            Prix: décroissant
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
          Affinez votre recherche d'artistes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Genre musical */}
        <div className="space-y-2">
          <Label>Genre musical</Label>
          <Select 
            value={selectedGenre} 
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Genres</SelectLabel>
                {musicGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Localisation */}
        <div className="space-y-2">
          <Label>Localisation</Label>
          <Select 
            value={selectedLocation} 
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un lieu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lieux</SelectLabel>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Fourchette de prix */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Fourchette de prix</Label>
            <span className="text-sm text-muted-foreground">
              {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(priceRange[0]).replace('MGA', 'Ar')} - 
              {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(priceRange[1]).replace('MGA', 'Ar')}
            </span>
          </div>
          <Slider 
            defaultValue={[200000, 500000]} 
            value={priceRange}
            onValueChange={setPriceRange}
            min={100000} 
            max={1000000}
            step={10000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100 000 Ar</span>
            <span>1 000 000 Ar</span>
          </div>
        </div>
        
        {/* Disponibilité */}
        <div className="flex items-center justify-between">
          <Label>Artistes disponibles uniquement</Label>
          <Switch 
            checked={showAvailableOnly} 
            onCheckedChange={setShowAvailableOnly} 
          />
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
              variant={sortBy === "price_low" ? "default" : "outline"}
              className="w-full justify-start" 
              onClick={() => setSortBy("price_low")}
              size="sm"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Prix: croissant
            </Button>
            
            <Button 
              variant={sortBy === "price_high" ? "default" : "outline"}
              className="w-full justify-start" 
              onClick={() => setSortBy("price_high")}
              size="sm"
            >
              <ArrowUpDown className="h-4 w-4 mr-2 rotate-180" />
              Prix: décroissant
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
              placeholder="Rechercher un artiste, un genre, une spécialité..."
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
          
          {/* Liste des artistes */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {filteredArtists.length} artiste{filteredArtists.length !== 1 ? 's' : ''}
              </h2>
              
              {/* Affichage des filtres actifs */}
              <div className="flex flex-wrap gap-2 justify-end">
                {selectedGenre !== "Tous les genres" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedGenre}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedGenre("Tous les genres")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedLocation !== "Tous les lieux" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLocation}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedLocation("Tous les lieux")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {showAvailableOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Disponibles
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setShowAvailableOnly(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
            
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucun artiste trouvé</h3>
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