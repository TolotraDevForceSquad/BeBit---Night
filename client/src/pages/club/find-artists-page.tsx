import React, { useState } from "react";
import { Search, Filter, Star, Music, Clock, Map, MapPin, Coins } from "lucide-react";
import ClubLayout from "@/layouts/club-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

// Types
type Artist = {
  id: number;
  name: string;
  genre: string;
  rating: number;
  profileImage: string;
  location: string;
  bio: string;
  fee: number;
  bookings: number;
  performances: Performance[];
};

type Performance = {
  id: number;
  title: string;
  venue: string;
  date: string;
  image: string;
};

const mockArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    genre: "Électronique",
    rating: 4.8,
    profileImage: "https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNsdWIlMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Antananarivo",
    bio: "DJ professionnel avec plus de 5 ans d'expérience dans les clubs et festivals. Spécialiste en house et techno.",
    fee: 250000,
    bookings: 28,
    performances: [
      {
        id: 101,
        title: "Summer Night Fever",
        venue: "Club Oxygen",
        date: "2025-02-15",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWxlY3Ryb25pYyUyMG11c2ljfGVufDB8fDB8fHwy"
      },
      {
        id: 102,
        title: "Electric Dreams",
        venue: "Festival MFM",
        date: "2024-12-20",
        image: "https://images.unsplash.com/photo-1642114021434-cc31ac421656?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fG5pZ2h0Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 2,
    name: "Ambiance Masters",
    genre: "Variété",
    rating: 4.6,
    profileImage: "https://images.unsplash.com/photo-1587825045005-c59de205cf7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM3fHxiYW5kfGVufDB8fDB8fHwy",
    location: "Toamasina",
    bio: "Groupe de variété avec un large répertoire international et malgache. Parfait pour les ambiances festives.",
    fee: 180000,
    bookings: 42,
    performances: [
      {
        id: 201,
        title: "Soirée Gala",
        venue: "Hôtel Carlton",
        date: "2025-01-25",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxpdmUlMjBiYW5kfGVufDB8fDB8fHwy"
      }
    ]
  },
  {
    id: 3,
    name: "Lazah Bros",
    genre: "Hip-Hop",
    rating: 4.7,
    profileImage: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGhpcCUyMGhvcCUyMGFydGlzdHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Antananarivo",
    bio: "Duo de rap avec des productions originales et des remix populaires. Énergie garantie sur scène.",
    fee: 220000,
    bookings: 36,
    performances: [
      {
        id: 301,
        title: "Hip-Hop Night",
        venue: "Urban Space",
        date: "2025-03-05",
        image: "https://images.unsplash.com/photo-1544616326-a041468f4ad0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGhpcCUyMGhvcHxlbnwwfHwwfHx8Mg%3D%3D"
      },
      {
        id: 302,
        title: "Street Culture Festival",
        venue: "Place de l'Indépendance",
        date: "2024-12-15",
        image: "https://images.unsplash.com/photo-1537172518061-cb3f33022035?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhpcCUyMGhvcHxlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 4,
    name: "Zana Jazz Quartet",
    genre: "Jazz",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1574791325739-3060fa18b75d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphenolMjBiYW5kfGVufDB8fDB8fHwy",
    location: "Antsiranana",
    bio: "Quartet de jazz fusion mêlant influences traditionnelles malgaches et jazz contemporain.",
    fee: 300000,
    bookings: 22,
    performances: [
      {
        id: 401,
        title: "Jazz & Soul Evening",
        venue: "Le Louvre",
        date: "2025-02-28",
        image: "https://images.unsplash.com/photo-1576096876569-5dcd9a84389a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGphenolMjBtdXNpY3xlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 5,
    name: "DJ Salama",
    genre: "Afro House",
    rating: 4.5,
    profileImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGFmcmljYW4lMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Mahajanga",
    bio: "DJ mêlant rythmes africains et house moderne. Crée une ambiance unique et dansante pour tous types d'événements.",
    fee: 200000,
    bookings: 31,
    performances: [
      {
        id: 501,
        title: "Afro Beach Party",
        venue: "Mahajanga Beach",
        date: "2025-01-10",
        image: "https://images.unsplash.com/photo-1531568209242-78aa174b4a68?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFmcmljYW4lMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D"
      },
      {
        id: 502,
        title: "Sunset Sessions",
        venue: "La Terrasse",
        date: "2024-12-28",
        image: "https://images.unsplash.com/photo-1517457210348-703079e57d4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHN1bnNldCUyMGRqfGVufDB8fDB8fHwy"
      }
    ]
  }
];

export default function FindArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [artists, setArtists] = useState(mockArtists);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrer les artistes en fonction des critères de recherche
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "all" || artist.genre === genreFilter;
    const matchesLocation = locationFilter === "all" || artist.location === locationFilter;
    
    return matchesSearch && matchesGenre && matchesLocation;
  });

  // Obtenir les valeurs uniques pour les filtres
  const genres = Array.from(new Set(artists.map(artist => artist.genre)));
  const locations = Array.from(new Set(artists.map(artist => artist.location)));

  const handleViewArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleBookArtist = (artistId: number) => {
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
      setSelectedArtist(artist);
      setIsDialogOpen(true);
    }
  };

  const handleSubmitBooking = () => {
    if (!selectedArtist || !bookingDate) return;
    
    console.log({
      artistId: selectedArtist.id,
      artistName: selectedArtist.name,
      date: bookingDate,
      message: bookingMessage
    });
    
    alert(`Demande de réservation envoyée à ${selectedArtist.name} pour le ${format(bookingDate, 'dd/MM/yyyy')}`);
    setIsDialogOpen(false);
    setBookingDate(undefined);
    setBookingMessage("");
  };

  return (
    <ClubLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Rechercher des Artistes</h1>
        
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un artiste par nom ou genre..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Genre musical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Résultats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArtists.length > 0 ? (
            filteredArtists.map(artist => (
              <Card key={artist.id} className="overflow-hidden">
                <CardHeader className="p-0 relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src={artist.profileImage} 
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex flex-col">
                    <CardTitle className="text-white text-xl">{artist.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-primary/20 text-white border-primary mr-2">
                        <Music className="h-3 w-3 mr-1" />
                        {artist.genre}
                      </Badge>
                      <div className="flex items-center text-white text-sm">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {artist.rating}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {artist.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {artist.bookings} réservations
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2 mb-2">{artist.bio}</p>
                  <p className="text-lg font-semibold mb-2 flex items-center">
                    <Coins className="h-4 w-4 mr-1 text-green-600" />
                    {artist.fee.toLocaleString()} Ar
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button onClick={() => handleViewArtist(artist)} variant="outline" className="flex-1">
                    Profil
                  </Button>
                  <Button onClick={() => handleBookArtist(artist.id)} className="flex-1">
                    Inviter
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center">
              <p className="text-muted-foreground">Aucun artiste ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog pour les réservations */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invitation d'artiste</DialogTitle>
            <DialogDescription>
              Envoyez une demande d'invitation à {selectedArtist?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!bookingDate ? "text-muted-foreground" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      initialFocus
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Détails sur l'événement..."
                className="col-span-3"
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmitBooking} disabled={!bookingDate}>
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour afficher les détails d'un artiste */}
      {selectedArtist && !isDialogOpen && (
        <Dialog open={!!selectedArtist && !isDialogOpen} onOpenChange={() => setSelectedArtist(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedArtist.profileImage} alt={selectedArtist.name} />
                  <AvatarFallback>{selectedArtist.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selectedArtist.name}</DialogTitle>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="bg-primary/10 border-primary mr-2">
                      <Music className="h-3 w-3 mr-1" />
                      {selectedArtist.genre}
                    </Badge>
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {selectedArtist.rating}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="performances">Performances</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{selectedArtist.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Localisation</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedArtist.location}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Tarif</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Coins className="h-4 w-4 mr-1 text-green-600" />
                        {selectedArtist.fee.toLocaleString()} Ar
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Réservations</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedArtist.bookings} événements
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performances" className="mt-4">
                <div className="space-y-4">
                  {selectedArtist.performances.length > 0 ? (
                    selectedArtist.performances.map(performance => (
                      <Card key={performance.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 h-32">
                            <img 
                              src={performance.image} 
                              alt={performance.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <h3 className="font-medium">{performance.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {performance.venue}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(performance.date), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aucune performance récente
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button onClick={() => {
                setIsDialogOpen(true);
              }}>
                Inviter cet artiste
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ClubLayout>
  );
}