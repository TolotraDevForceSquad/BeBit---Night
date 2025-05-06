import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Search, Users, Music, Star, Filter, UserCheck, 
  Check, MapPin, Disc3, BadgeCheck, ArrowRight, BadgePlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

// Type pour l'authentification
type AuthUser = {
  username: string;
  role: string;
  profileImage?: string;
};

// Type pour les artistes
type Artist = {
  id: number;
  name: string;
  username: string;
  genre: string;
  subGenres?: string[];
  bio?: string;
  location?: string;
  rating: number;
  verified: boolean;
  bookedCount?: number;
  price?: {
    min: number;
    max: number;
  };
  availability?: string[];
  image?: string;
  popularity: number;
  socialLinks?: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
  };
  skills?: string[];
  equipment?: string[];
  samples?: {
    title: string;
    url: string;
    type: "audio" | "video";
  }[];
};

// Données de test pour les artistes
const mockArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    username: "dj_elektra",
    genre: "Techno",
    subGenres: ["Melodic Techno", "Industrial"],
    bio: "Reconnue pour ses sets énergiques et innovants, DJ Elektra fusionne la techno mélodique avec des éléments industriels pour créer une expérience unique sur le dancefloor.",
    location: "Paris",
    rating: 4.8,
    verified: true,
    bookedCount: 78,
    price: {
      min: 800,
      max: 2000
    },
    availability: ["Vendredi", "Samedi"],
    image: "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=300&h=300&fit=crop",
    popularity: 92,
    socialLinks: {
      instagram: "@dj_elektra",
      soundcloud: "djelektra",
      spotify: "DJ Elektra Official"
    },
    skills: ["Production", "Live Performance", "Mixing"],
    equipment: ["Pioneer CDJ-3000", "DJM-900NXS2", "Ableton Push 2"],
    samples: [
      {
        title: "Techno Night @ Club Oxygen",
        url: "https://example.com/audio1.mp3",
        type: "audio"
      },
      {
        title: "Summer Festival 2023",
        url: "https://example.com/video1.mp4",
        type: "video"
      }
    ]
  },
  {
    id: 2,
    name: "Marcus Beats",
    username: "marcus_beats",
    genre: "House",
    subGenres: ["Deep House", "Progressive House"],
    bio: "Le soulèvement de la scène deep house, Marcus crée des ambiances luxuriantes et des atmosphères hypnotiques dans ses sets.",
    location: "Lyon",
    rating: 4.6,
    verified: true,
    bookedCount: 56,
    price: {
      min: 700,
      max: 1800
    },
    availability: ["Jeudi", "Vendredi", "Samedi"],
    image: "https://images.unsplash.com/photo-1570499911518-41d35c14a4fb?w=300&h=300&fit=crop",
    popularity: 85,
    socialLinks: {
      instagram: "@marcus_beats",
      soundcloud: "marcusbeats",
      spotify: "Marcus Beats"
    },
    skills: ["Vinyl", "Long Sets", "Music Production"],
    equipment: ["Vinyl Turntables", "Pioneer DJM-900", "Roland TR-8"],
    samples: [
      {
        title: "Deep House Session",
        url: "https://example.com/audio2.mp3",
        type: "audio"
      }
    ]
  },
  {
    id: 3,
    name: "Luna Nova",
    username: "luna_nova",
    genre: "EDM",
    subGenres: ["Future Bass", "Trap"],
    bio: "Avec ses transitions fluides et ses drops énergiques, Luna Nova captive les foules avec son style unique et sa présence scénique dynamique.",
    location: "Marseille",
    rating: 4.9,
    verified: true,
    bookedCount: 92,
    price: {
      min: 1200,
      max: 3000
    },
    availability: ["Vendredi", "Samedi", "Dimanche"],
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=300&fit=crop",
    popularity: 97,
    socialLinks: {
      instagram: "@luna_nova_official",
      soundcloud: "lunanova",
      spotify: "Luna Nova"
    },
    skills: ["Visual Mapping", "Live Performance", "Composition"],
    equipment: ["Pioneer DDJ-1000", "Traktor S4", "Ableton Live"],
    samples: [
      {
        title: "EDM Summer Mix",
        url: "https://example.com/audio3.mp3",
        type: "audio"
      },
      {
        title: "Festival Highlights",
        url: "https://example.com/video2.mp4",
        type: "video"
      }
    ]
  },
  {
    id: 4,
    name: "Victor Pulse",
    username: "victor_pulse",
    genre: "Drum & Bass",
    subGenres: ["Liquid", "Neurofunk"],
    bio: "Le maître du rythme, Victor Pulse distille des beats drum & bass intenses et captivants qui font trembler les dancefloors.",
    location: "Nice",
    rating: 4.7,
    verified: false,
    bookedCount: 42,
    price: {
      min: 600,
      max: 1500
    },
    availability: ["Mercredi", "Vendredi", "Samedi"],
    image: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=300&h=300&fit=crop",
    popularity: 81,
    socialLinks: {
      instagram: "@victor_pulse",
      soundcloud: "victorpulse",
      spotify: "Victor Pulse"
    },
    skills: ["Fast Mixing", "Scratching", "Production"],
    samples: [
      {
        title: "Drum & Bass Set 2023",
        url: "https://example.com/audio4.mp3",
        type: "audio"
      }
    ]
  },
  {
    id: 5,
    name: "Mélanie Wave",
    username: "melanie_wave",
    genre: "Ambient",
    subGenres: ["Downtempo", "Chill"],
    bio: "Créatrice d'ambiances sonores uniques, Mélanie Wave emmène son public dans un voyage musical immersif et relaxant.",
    location: "Bordeaux",
    rating: 4.5,
    verified: true,
    bookedCount: 35,
    price: {
      min: 500,
      max: 1200
    },
    availability: ["Mardi", "Mercredi", "Jeudi", "Dimanche"],
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ce894f6?w=300&h=300&fit=crop",
    popularity: 78,
    socialLinks: {
      instagram: "@melanie_wave",
      soundcloud: "melaniewave",
      spotify: "Mélanie Wave Music"
    },
    skills: ["Live Instruments", "Sampling", "Sound Design"],
    equipment: ["Ableton Push", "MIDI Controller", "Field Recorder"],
    samples: [
      {
        title: "Ambient Evening",
        url: "https://example.com/audio5.mp3",
        type: "audio"
      }
    ]
  },
  {
    id: 6,
    name: "Rhythm Raiders",
    username: "rhythm_raiders",
    genre: "Hip-Hop",
    subGenres: ["Trap", "Lo-Fi Hip-Hop"],
    bio: "Un collectif de DJs hip-hop qui mélange les classiques avec des sons contemporains pour une ambiance urbaine électrisante.",
    location: "Lille",
    rating: 4.4,
    verified: false,
    bookedCount: 28,
    price: {
      min: 900,
      max: 2500
    },
    availability: ["Vendredi", "Samedi"],
    image: "https://images.unsplash.com/photo-1547507883-fa77deaf5eb8?w=300&h=300&fit=crop",
    popularity: 83,
    socialLinks: {
      instagram: "@rhythm_raiders",
      soundcloud: "rhythmraiders",
      spotify: "Rhythm Raiders"
    },
    skills: ["Scratching", "Beat Matching", "Crowd Control"],
    equipment: ["Technics SL-1200", "Serato DJ", "MPC Live"],
    samples: [
      {
        title: "Hip-Hop Classics Mix",
        url: "https://example.com/audio6.mp3",
        type: "audio"
      },
      {
        title: "Club Performance",
        url: "https://example.com/video3.mp4",
        type: "video"
      }
    ]
  },
  {
    id: 7,
    name: "Soul Searcher",
    username: "soul_searcher",
    genre: "Soul",
    subGenres: ["Funk", "R&B"],
    bio: "Un DJ qui puise dans l'âge d'or de la soul et du funk pour créer des sets rétro qui font danser toutes les générations.",
    location: "Strasbourg",
    rating: 4.3,
    verified: true,
    bookedCount: 47,
    price: {
      min: 650,
      max: 1600
    },
    availability: ["Vendredi", "Samedi", "Dimanche"],
    image: "https://images.unsplash.com/photo-1618679755576-ce3cc5dabbe6?w=300&h=300&fit=crop",
    popularity: 76,
    socialLinks: {
      instagram: "@soul_searcher",
      soundcloud: "soulsearcher",
      spotify: "Soul Searcher"
    },
    skills: ["Vinyl Selection", "Music History", "Crowd Reading"],
    equipment: ["Vintage Turntables", "Analog Mixer", "Rare Vinyl Collection"],
    samples: [
      {
        title: "Soul & Funk Classics",
        url: "https://example.com/audio7.mp3",
        type: "audio"
      }
    ]
  },
  {
    id: 8,
    name: "Echo Ensemble",
    username: "echo_ensemble",
    genre: "Live Electronic",
    subGenres: ["Fusion", "Experimental"],
    bio: "Un groupe qui fusionne instruments traditionnels et production électronique pour créer une expérience sonore immersive et innovante.",
    location: "Toulouse",
    rating: 4.7,
    verified: true,
    bookedCount: 39,
    price: {
      min: 1500,
      max: 4000
    },
    availability: ["Vendredi", "Samedi"],
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop",
    popularity: 89,
    socialLinks: {
      instagram: "@echo_ensemble",
      soundcloud: "echoensemble",
      spotify: "Echo Ensemble"
    },
    skills: ["Live Performance", "Improvisation", "Sound Design"],
    equipment: ["Synthesizers", "Electric Guitar", "Drum Machine", "Live Vocals"],
    samples: [
      {
        title: "Live at La Cigale",
        url: "https://example.com/audio8.mp3",
        type: "audio"
      },
      {
        title: "Studio Session",
        url: "https://example.com/video4.mp4",
        type: "video"
      }
    ]
  }
];

// Filtre des artistes
type Filters = {
  search: string;
  genre: string;
  location: string;
  priceRange: [number, number];
  ratingMin: number;
  verifiedOnly: boolean;
  availability: string[];
};

// Composant de carte d'artiste
function ArtistCard({ artist, onInvite }: { artist: Artist, onInvite: (e: React.MouseEvent, artist: Artist) => void }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-14 w-14">
              <AvatarImage src={artist.image} alt={artist.name} />
              <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-1">
                {artist.name}
                {artist.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
              </CardTitle>
              <div className="flex items-center text-muted-foreground text-sm">
                <Music className="h-3 w-3 mr-1" />
                <span>{artist.genre}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-amber-500">
              <Star className="fill-amber-500 h-4 w-4" />
              <span className="ml-1 font-medium">{artist.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{artist.bookedCount} réservations</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="flex items-center text-sm mb-3 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{artist.location}</span>
        </div>
        
        <div className="text-sm">
          {artist.bio?.substring(0, 120)}{artist.bio && artist.bio.length > 120 ? "..." : ""}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {artist.subGenres?.slice(0, 3).map((genre, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 border-t mt-auto">
        <div className="text-sm">
          <span className="font-medium">{artist.price?.min} - {artist.price?.max}€</span>
          <span className="text-muted-foreground text-xs ml-1">par soirée</span>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          className="gap-1"
          onClick={(e) => onInvite(e, artist)}
        >
          <UserCheck className="h-4 w-4" />
          <span>Inviter</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Composant de carte d'artiste détaillée (dialogue)
function ArtistDetailDialog({ artist, isOpen, onClose, onInvite }: { 
  artist: Artist | null, 
  isOpen: boolean, 
  onClose: () => void,
  onInvite: (artist: Artist) => void
}) {
  if (!artist) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={artist.image} alt={artist.name} />
              <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl flex items-center gap-1">
                {artist.name}
                {artist.verified && (
                  <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/25">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    <span>Vérifié</span>
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Disc3 className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{artist.genre}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{artist.location}</span>
                </div>
                <span>•</span>
                <div className="flex items-center text-amber-500">
                  <Star className="fill-amber-500 h-4 w-4 mr-1" />
                  <span>{artist.rating.toFixed(1)}</span>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Bio</h3>
              <p className="text-muted-foreground">{artist.bio}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {artist.skills?.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="py-1">
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {artist.equipment && artist.equipment.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Équipement</h3>
                <div className="flex flex-wrap gap-2">
                  {artist.equipment?.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="py-1">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {artist.samples && artist.samples.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Échantillons</h3>
                <div className="space-y-3">
                  {artist.samples?.map((sample, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        {sample.type === "audio" ? (
                          <Music className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <Disc3 className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <span>{sample.title}</span>
                      </div>
                      <Button variant="outline" size="sm">Écouter</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6 border-l pl-6 md:pl-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Réservation</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Tarif par prestation</div>
                  <div className="text-xl font-bold">{artist.price?.min} - {artist.price?.max}€</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Disponibilité</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {artist.availability?.map((day, idx) => (
                      <Badge key={idx} variant="outline" className="bg-primary/10 text-primary border-primary/25">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Expérience</div>
                  <div className="mt-1">
                    <span className="font-medium">{artist.bookedCount}</span> prestations via Be bit.
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Réseaux sociaux</div>
                  <div className="space-y-2 mt-1">
                    {artist.socialLinks?.instagram && (
                      <div className="text-sm">{artist.socialLinks.instagram}</div>
                    )}
                    {artist.socialLinks?.soundcloud && (
                      <div className="text-sm">{artist.socialLinks.soundcloud}</div>
                    )}
                    {artist.socialLinks?.spotify && (
                      <div className="text-sm">{artist.socialLinks.spotify}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => {
            onInvite(artist);
            onClose();
          }} className="gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Inviter à un événement</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Système de filtrage
function FilterPanel({ filters, setFilters }: { 
  filters: Filters, 
  setFilters: (filters: Filters) => void 
}) {
  // Listes des options
  const genres = [
    "Tous", "Techno", "House", "EDM", "Drum & Bass", "Ambient", 
    "Hip-Hop", "Soul", "Live Electronic"
  ];
  
  const locations = [
    "Toutes", "Paris", "Lyon", "Marseille", "Nice", 
    "Bordeaux", "Lille", "Strasbourg", "Toulouse"
  ];
  
  const availabilityOptions = [
    "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"
  ];

  // Gestionnaires d'événements
  const handleAvailabilityChange = (day: string) => {
    if (filters.availability.includes(day)) {
      setFilters({
        ...filters,
        availability: filters.availability.filter(d => d !== day)
      });
    } else {
      setFilters({
        ...filters,
        availability: [...filters.availability, day]
      });
    }
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };
  
  const resetFilters = () => {
    setFilters({
      search: "",
      genre: "Tous",
      location: "Toutes",
      priceRange: [0, 5000],
      ratingMin: 0,
      verifiedOnly: false,
      availability: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtres
        </CardTitle>
        <CardDescription>
          Affinez votre recherche d'artistes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recherche */}
        <div>
          <Label htmlFor="artist-search">Recherche</Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="artist-search"
              placeholder="Nom, genre ou compétence..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        
        {/* Genre */}
        <div>
          <Label htmlFor="genre-filter">Genre musical</Label>
          <Select 
            value={filters.genre}
            onValueChange={(value) => setFilters({ ...filters, genre: value })}
          >
            <SelectTrigger id="genre-filter" className="mt-1.5">
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Localisation */}
        <div>
          <Label htmlFor="location-filter">Localisation</Label>
          <Select 
            value={filters.location}
            onValueChange={(value) => setFilters({ ...filters, location: value })}
          >
            <SelectTrigger id="location-filter" className="mt-1.5">
              <SelectValue placeholder="Sélectionner une ville" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Prix */}
        <div>
          <div className="flex justify-between mb-1.5">
            <Label>Fourchette de prix</Label>
            <span className="text-sm text-muted-foreground">
              {filters.priceRange[0]}€ - {filters.priceRange[1]}€
            </span>
          </div>
          <Slider
            defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
            max={5000}
            step={100}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={handlePriceRangeChange}
            className="py-4"
          />
        </div>
        
        {/* Note minimum */}
        <div>
          <div className="flex justify-between mb-1.5">
            <Label>Note minimum</Label>
            <div className="flex items-center text-amber-500">
              <span className="mr-1 text-sm">{filters.ratingMin.toFixed(1)}</span>
              <Star className="fill-amber-500 h-4 w-4" />
            </div>
          </div>
          <Slider
            defaultValue={[filters.ratingMin]}
            max={5}
            step={0.1}
            value={[filters.ratingMin]}
            onValueChange={(value) => setFilters({ ...filters, ratingMin: value[0] })}
            className="py-4"
          />
        </div>
        
        {/* Artistes vérifiés uniquement */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="verified-only">Artistes vérifiés uniquement</Label>
          <Switch
            id="verified-only"
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => setFilters({ ...filters, verifiedOnly: checked })}
          />
        </div>
        
        {/* Disponibilité */}
        <div>
          <Label className="mb-2 block">Disponibilité</Label>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map(day => (
              <Badge
                key={day}
                variant={filters.availability.includes(day) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleAvailabilityChange(day)}
              >
                {day}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Réinitialiser les filtres */}
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Réinitialiser les filtres
        </Button>
      </CardContent>
    </Card>
  );
}

// Modèle d'invitation
type InvitationFormData = {
  artistId: number;
  eventId: string;
  date: string;
  message: string;
  offerAmount: number;
};

// Composant de dialogue d'invitation
function InvitationDialog({ artist, isOpen, onClose }: {
  artist: Artist | null,
  isOpen: boolean,
  onClose: () => void
}) {
  const [formData, setFormData] = useState<InvitationFormData>({
    artistId: artist?.id || 0,
    eventId: "",
    date: "",
    message: "",
    offerAmount: artist?.price?.min || 0
  });
  
  // Événements fictifs du club
  const clubEvents = [
    { id: "evt1", title: "Soirée Techno Vibrations", date: "2023-06-15" },
    { id: "evt2", title: "House Music Festival", date: "2023-06-28" },
    { id: "evt3", title: "Summer Beats Party", date: "2023-07-10" },
    { id: "evt4", title: "Electronic Night", date: "2023-07-22" }
  ];
  
  const handleSubmit = () => {
    console.log("Invitation envoyée:", formData);
    onClose();
  };
  
  useEffect(() => {
    if (artist) {
      setFormData({
        artistId: artist.id,
        eventId: "",
        date: "",
        message: `Bonjour ${artist.name},\n\nNous serions ravis de vous avoir comme artiste dans notre club pour un événement prochain. Votre style ${artist.genre} correspond parfaitement à l'ambiance que nous recherchons.\n\nPourriez-vous nous faire part de vos disponibilités ?\n\nCordialement,\nClub Oxygen`,
        offerAmount: artist.price?.min || 0
      });
    }
  }, [artist]);
  
  if (!artist) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Inviter {artist.name} à un événement
          </DialogTitle>
          <DialogDescription>
            Envoyez une invitation à cet artiste pour l'un de vos événements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="event-select">Événement</Label>
            <Select
              value={formData.eventId}
              onValueChange={(value) => setFormData({ ...formData, eventId: value })}
            >
              <SelectTrigger id="event-select" className="mt-1.5">
                <SelectValue placeholder="Sélectionner un événement" />
              </SelectTrigger>
              <SelectContent>
                {clubEvents.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} ({event.date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date-input">Date proposée</Label>
            <Input
              id="date-input"
              type="date"
              className="mt-1.5"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="amount-input" className="flex justify-between">
              <span>Montant proposé (€)</span>
              <span className="text-sm text-muted-foreground">
                Fourchette: {artist.price?.min} - {artist.price?.max}€
              </span>
            </Label>
            <Input
              id="amount-input"
              type="number"
              className="mt-1.5"
              value={formData.offerAmount}
              onChange={(e) => setFormData({ ...formData, offerAmount: Number(e.target.value) })}
              min={artist.price?.min}
              max={artist.price?.max}
            />
          </div>
          
          <div>
            <Label htmlFor="message-input">Message</Label>
            <textarea
              id="message-input"
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
              placeholder="Votre message à l'artiste..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <BadgePlus className="h-4 w-4" />
            <span>Envoyer l'invitation</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant principal
export default function FindArtistsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showArtistDetail, setShowArtistDetail] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    genre: "Tous",
    location: "Toutes",
    priceRange: [0, 5000],
    ratingMin: 0,
    verifiedOnly: false,
    availability: []
  });

  // Récupérer les données utilisateur
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

  // Simuler un chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setArtists(mockArtists);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les artistes
  const filteredArtists = artists.filter(artist => {
    // Recherche textuelle
    const matchesSearch = filters.search.trim() === '' || 
      artist.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      artist.genre.toLowerCase().includes(filters.search.toLowerCase()) ||
      artist.subGenres?.some(g => g.toLowerCase().includes(filters.search.toLowerCase())) ||
      artist.skills?.some(s => s.toLowerCase().includes(filters.search.toLowerCase()));
    
    // Genre
    const matchesGenre = filters.genre === "Tous" || artist.genre === filters.genre;
    
    // Localisation
    const matchesLocation = filters.location === "Toutes" || artist.location === filters.location;
    
    // Prix
    const matchesPrice = 
      (artist.price?.min !== undefined && artist.price?.min >= filters.priceRange[0]) &&
      (artist.price?.max !== undefined && artist.price?.max <= filters.priceRange[1]);
    
    // Note minimum
    const matchesRating = artist.rating >= filters.ratingMin;
    
    // Artistes vérifiés uniquement
    const matchesVerified = !filters.verifiedOnly || artist.verified;
    
    // Disponibilité
    const matchesAvailability = 
      filters.availability.length === 0 || 
      filters.availability.some(day => artist.availability?.includes(day));
    
    return matchesSearch && matchesGenre && matchesLocation && matchesPrice && 
           matchesRating && matchesVerified && matchesAvailability;
  });

  // Gérer l'invitation d'un artiste
  const handleInviteArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowInvitationForm(true);
  };
  
  // Gérer l'affichage des détails d'un artiste
  const handleViewArtistDetail = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowArtistDetail(true);
  };

  // Gérer le clic sur le bouton invitation dans la carte d'artiste
  const handleCardInviteClick = (e: React.MouseEvent, artist: Artist) => {
    e.stopPropagation();
    handleInviteArtist(artist);
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Trouver des Artistes</h1>
            <p className="text-muted-foreground">
              Découvrez et invitez des artistes pour vos prochains événements
            </p>
          </div>
          
          <div className="flex">
            <Input 
              placeholder="Rechercher un artiste..." 
              className="w-full md:w-80"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau de filtres */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
          
          {/* Liste des artistes */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {filteredArtists.length} artiste{filteredArtists.length !== 1 ? 's' : ''} trouvé{filteredArtists.length !== 1 ? 's' : ''}
                </div>
                <TabsList>
                  <TabsTrigger value="grid" className="px-3">
                    <div className="grid grid-cols-3 gap-0.5 h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-3">
                    <div className="flex flex-col gap-0.5 h-4 w-4">
                      <div className="h-0.5 w-full bg-current" />
                      <div className="h-0.5 w-full bg-current" />
                      <div className="h-0.5 w-full bg-current" />
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Vue en grille */}
                  <TabsContent value="grid" className="mt-0">
                    {filteredArtists.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArtists.map(artist => (
                          <div key={artist.id} onClick={() => handleViewArtistDetail(artist)} className="cursor-pointer">
                            <ArtistCard artist={artist} onInvite={(e) => {
                              e.stopPropagation();
                              handleInviteArtist(artist);
                            }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Aucun artiste trouvé</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                          Essayez d'ajuster vos filtres ou de modifier votre recherche pour trouver plus d'artistes.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setFilters({
                          search: "",
                          genre: "Tous",
                          location: "Toutes",
                          priceRange: [0, 5000],
                          ratingMin: 0,
                          verifiedOnly: false,
                          availability: []
                        })}>
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Vue en liste */}
                  <TabsContent value="list" className="mt-0">
                    {filteredArtists.length > 0 ? (
                      <div className="space-y-4">
                        {filteredArtists.map(artist => (
                          <Card key={artist.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleViewArtistDetail(artist)}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={artist.image} alt={artist.name} />
                                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  
                                  <div>
                                    <h3 className="font-medium flex items-center">
                                      {artist.name}
                                      {artist.verified && <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Music className="h-3 w-3 mr-1" />
                                      <span>{artist.genre}</span>
                                      <span className="mx-2">•</span>
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>{artist.location}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="font-medium">{artist.price?.min} - {artist.price?.max}€</div>
                                    <div className="flex items-center text-amber-500 justify-end">
                                      <Star className="fill-amber-500 h-4 w-4" />
                                      <span className="ml-1">{artist.rating.toFixed(1)}</span>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInviteArtist(artist);
                                    }}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    <span>Inviter</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Aucun artiste trouvé</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                          Essayez d'ajuster vos filtres ou de modifier votre recherche pour trouver plus d'artistes.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => setFilters({
                          search: "",
                          genre: "Tous",
                          location: "Toutes",
                          priceRange: [0, 5000],
                          ratingMin: 0,
                          verifiedOnly: false,
                          availability: []
                        })}>
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Dialogues */}
      <ArtistDetailDialog 
        artist={selectedArtist} 
        isOpen={showArtistDetail} 
        onClose={() => setShowArtistDetail(false)}
        onInvite={handleInviteArtist}
      />
      
      <InvitationDialog 
        artist={selectedArtist}
        isOpen={showInvitationForm}
        onClose={() => setShowInvitationForm(false)}
      />
    </ResponsiveLayout>
  );
}