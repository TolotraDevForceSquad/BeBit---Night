import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { Separator } from "../../components/ui/separator";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import { useToast } from "../../hooks/use-toast";
import {
  Search,
  Star,
  Mail,
  Calendar,
  Users,
  Music,
  Mic,
  Headphones,
  Award,
  Disc,
  Bookmark,
  MapPin,
  Globe,
  Flame,
  Filter,
  Clock,
  Heart
} from 'lucide-react';

// Types pour les artistes
interface Artist {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  genres: string[];
  location: string;
  experience: number;
  fee: number;
  bio: string;
  specialties: string[];
  socialFollowers: number;
  availability: boolean;
  followers: number;
  featured: boolean;
  verified: boolean;
  performances: number;
  portfolio: {
    image: string;
    title: string;
  }[];
}

// Données fictives pour les artistes
const artistsData: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    genres: ["House", "Techno", "EDM"],
    location: "Paris",
    experience: 7,
    fee: 120000,
    bio: "DJ Elektra crée des sets électrisants qui font vibrer les foules. Spécialiste de la house et de la techno, elle a joué dans les meilleurs clubs d'Europe.",
    specialties: ["Live Mixing", "Crowd Engagement"],
    socialFollowers: 45000,
    availability: true,
    followers: 28500,
    featured: true,
    verified: true,
    performances: 210,
    portfolio: [
      { image: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742", title: "Festival Électronique 2023" },
      { image: "https://images.unsplash.com/photo-1571397133301-3f1b6ae86085", title: "Club Underground" }
    ]
  },
  {
    id: 2,
    name: "Sax Master",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.6,
    genres: ["Jazz", "Funk", "Soul"],
    location: "Lyon",
    experience: 12,
    fee: 95000,
    bio: "Saxophoniste virtuose avec plus de 12 ans d'expérience, créant une ambiance sophistiquée pour votre événement. Parfait pour les soirées jazz et lounge.",
    specialties: ["Improvisation", "Live Collaborations"],
    socialFollowers: 22000,
    availability: true,
    followers: 15600,
    featured: false,
    verified: true,
    performances: 340,
    portfolio: [
      { image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae", title: "Jazz Club Melody" },
      { image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c", title: "Festival de Jazz" }
    ]
  },
  {
    id: 3,
    name: "Melodic Vibes",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.9,
    genres: ["Pop", "R&B", "Acoustic"],
    location: "Marseille",
    experience: 5,
    fee: 85000,
    bio: "Chanteuse à la voix envoûtante, parfaite pour créer une ambiance chaleureuse et émotionnelle. Son répertoire varié s'adapte à tous types d'événements.",
    specialties: ["Vocals", "Acoustic Guitar"],
    socialFollowers: 38000,
    availability: false,
    followers: 42300,
    featured: true,
    verified: true,
    performances: 180,
    portfolio: [
      { image: "https://images.unsplash.com/photo-1460723237783-e82e7e6f2535", title: "Concert Live" },
      { image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819", title: "Soirée Acoustique" }
    ]
  },
  {
    id: 4,
    name: "Beat Collective",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 4.7,
    genres: ["Hip-Hop", "Trap", "Reggaeton"],
    location: "Nice",
    experience: 6,
    fee: 110000,
    bio: "Groupe de trois DJ spécialistes des rythmes urbains. Leur énergie contagieuse et leur maîtrise des transitions sont parfaites pour les soirées endiablées.",
    specialties: ["Scratch", "Mashups"],
    socialFollowers: 62000,
    availability: true,
    followers: 54100,
    featured: false,
    verified: true,
    performances: 220,
    portfolio: [
      { image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a", title: "Festival Urbain" },
      { image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78", title: "Club Night" }
    ]
  },
  {
    id: 5,
    name: "Electric Strings",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 4.5,
    genres: ["Classical", "Electronic", "Fusion"],
    location: "Bordeaux",
    experience: 8,
    fee: 130000,
    bio: "Violoniste innovante fusionnant musique classique et électronique. Son approche unique crée une expérience sonore inoubliable pour des événements sophistiqués.",
    specialties: ["Violin Loop", "Electronic Fusion"],
    socialFollowers: 29000,
    availability: true,
    followers: 18700,
    featured: false,
    verified: true,
    performances: 160,
    portfolio: [
      { image: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b", title: "Fusion Électronique" },
      { image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e", title: "Concert Privé" }
    ]
  }
];

// Formatage monétaire
const formatCurrency = (value: number) => {
  return (value/100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const FindArtistsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([50000, 150000]);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState('all');
  const [savedArtists, setSavedArtists] = useState<number[]>([]);
  
  // Filtrer les artistes selon les critères
  const filteredArtists = artistsData.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artist.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          artist.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGenre = genreFilter === 'all' || artist.genres.includes(genreFilter);
    const matchesPrice = artist.fee >= priceRange[0] && artist.fee <= priceRange[1];
    const matchesAvailability = !availabilityFilter || artist.availability;
    const matchesRating = artist.rating >= ratingFilter;
    const matchesLocation = locationFilter === 'all' || artist.location === locationFilter;
    
    return matchesSearch && matchesGenre && matchesPrice && 
           matchesAvailability && matchesRating && matchesLocation;
  });
  
  // Enregistrer/supprimer un artiste des favoris
  const toggleSaveArtist = (id: number) => {
    if (savedArtists.includes(id)) {
      setSavedArtists(savedArtists.filter(artistId => artistId !== id));
      toast({
        title: "Artiste retiré des favoris",
        description: "L'artiste a été retiré de votre liste de favoris",
      });
    } else {
      setSavedArtists([...savedArtists, id]);
      toast({
        title: "Artiste ajouté aux favoris",
        description: "L'artiste a été ajouté à votre liste de favoris",
      });
    }
  };
  
  // Envoyer une invitation à un artiste
  const inviteArtist = (artistName: string) => {
    toast({
      title: "Invitation envoyée",
      description: `Votre invitation a été envoyée à ${artistName}`,
      variant: "default",
    });
  };
  
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Rechercher des artistes</h1>
            <p className="text-lg text-muted-foreground mt-1">Trouvez des talents pour vos événements</p>
          </div>
          
          <div className="flex mt-4 lg:mt-0 space-x-2">
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              {savedArtists.length} favoris
            </Button>
            <Button variant="default">
              <Mail className="h-4 w-4 mr-2" />
              Invitations en cours
            </Button>
          </div>
        </div>
        
        {/* Barre de recherche principale */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 py-6"
            placeholder="Rechercher par nom, genre ou compétences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Button 
            className="absolute right-1 top-1/2 -translate-y-1/2"
            variant="ghost"
            onClick={() => setSearchQuery('')}
          >
            {searchQuery && 'Effacer'}
          </Button>
        </div>
        
        {/* Filtres avancés */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle>Filtres avancés</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="genre">Genre musical</Label>
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Techno">Techno</SelectItem>
                    <SelectItem value="EDM">EDM</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Funk">Funk</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="R&B">R&B</SelectItem>
                    <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                    <SelectItem value="Classical">Classique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Lyon">Lyon</SelectItem>
                    <SelectItem value="Marseille">Marseille</SelectItem>
                    <SelectItem value="Nice">Nice</SelectItem>
                    <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rating">Note minimale</Label>
                <Select value={ratingFilter.toString()} onValueChange={(val) => setRatingFilter(Number(val))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Toutes les notes</SelectItem>
                    <SelectItem value="3">3+ étoiles</SelectItem>
                    <SelectItem value="4">4+ étoiles</SelectItem>
                    <SelectItem value="4.5">4.5+ étoiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Fourchette de prix</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </span>
                </div>
                <Slider
                  defaultValue={[50000, 150000]}
                  max={200000}
                  min={0}
                  step={5000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="available" 
                  checked={availabilityFilter}
                  onCheckedChange={setAvailabilityFilter}
                />
                <Label htmlFor="available" className="cursor-pointer">Disponibles uniquement</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Résultats de recherche */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredArtists.length} {filteredArtists.length > 1 ? 'artistes' : 'artiste'} trouvé{filteredArtists.length > 1 ? 's' : ''}
          </h2>
          
          <Select defaultValue="rating">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Note (décroissante)</SelectItem>
              <SelectItem value="price_low">Prix (croissant)</SelectItem>
              <SelectItem value="price_high">Prix (décroissant)</SelectItem>
              <SelectItem value="experience">Expérience</SelectItem>
              <SelectItem value="popularity">Popularité</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredArtists.length > 0 ? (
            filteredArtists.map(artist => (
              <Card key={artist.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-muted p-6 flex flex-col items-center justify-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center">
                      <h3 className="text-lg font-bold">{artist.name}</h3>
                      <div className="flex items-center justify-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1">{artist.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground ml-1">({artist.performances})</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {artist.location}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 w-full">
                      <Button 
                        className="w-full" 
                        variant="default"
                        onClick={() => inviteArtist(artist.name)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Inviter
                      </Button>
                      <Button 
                        className="w-full" 
                        variant={savedArtists.includes(artist.id) ? "secondary" : "outline"}
                        onClick={() => toggleSaveArtist(artist.id)}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${savedArtists.includes(artist.id) ? "fill-current" : ""}`} />
                        {savedArtists.includes(artist.id) ? 'Enregistré' : 'Enregistrer'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {artist.genres.map(genre => (
                        <Badge key={genre} variant="secondary">
                          <Music className="h-3 w-3 mr-1" />
                          {genre}
                        </Badge>
                      ))}
                      {artist.featured && (
                        <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                          <Flame className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      )}
                      {artist.verified && (
                        <Badge variant="outline" className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400">
                          <Award className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{artist.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Cachet</div>
                        <div className="font-semibold">{formatCurrency(artist.fee)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expérience</div>
                        <div className="font-semibold">{artist.experience} ans</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Spécialités</div>
                        <div className="font-semibold">{artist.specialties.join(', ')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Disponibilité</div>
                        <div className={`font-semibold ${artist.availability ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                          {artist.availability ? 'Disponible' : 'Non disponible'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Portfolio</div>
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {artist.portfolio.map((item, index) => (
                          <div key={index} className="min-w-[120px] w-[120px] rounded-md overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="h-[80px] w-full object-cover"
                            />
                            <div className="text-xs p-1 truncate">{item.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="text-muted-foreground mb-2">Aucun artiste ne correspond à vos critères de recherche</div>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setGenreFilter('all');
                setPriceRange([50000, 150000]);
                setAvailabilityFilter(false);
                setRatingFilter(0);
                setLocationFilter('all');
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
        
        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Artistes recommandés</CardTitle>
            <CardDescription>Basé sur vos événements précédents et vos préférences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artistsData.slice(0, 4).map(artist => (
                <div key={artist.id} className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium">{artist.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{artist.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{artist.genres[0]}</div>
                  <Button 
                    className="mt-3" 
                    variant="outline" 
                    size="sm"
                    onClick={() => inviteArtist(artist.name)}
                  >
                    Inviter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default FindArtistsPage;