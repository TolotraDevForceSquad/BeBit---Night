import React, { useState } from "react";
import { Search, Filter, Star, Music, Clock, Map, MapPin } from "lucide-react";
import UserLayout from "@/layouts/user-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
type Artist = {
  id: number;
  name: string;
  genre: string;
  rating: number;
  profileImage: string;
  location: string;
  fee: number;
  bookings: number;
};

const mockArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    genre: "Électronique",
    rating: 4.8,
    profileImage: "https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNsdWIlMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Antananarivo",
    fee: 250000,
    bookings: 28
  },
  {
    id: 2,
    name: "Ambiance Masters",
    genre: "Variété",
    rating: 4.6,
    profileImage: "https://images.unsplash.com/photo-1587825045005-c59de205cf7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM3fHxiYW5kfGVufDB8fDB8fHwy",
    location: "Toamasina",
    fee: 180000,
    bookings: 42
  },
  {
    id: 3,
    name: "Lazah Bros",
    genre: "Hip-Hop",
    rating: 4.7,
    profileImage: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGhpcCUyMGhvcCUyMGFydGlzdHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Antananarivo",
    fee: 220000,
    bookings: 36
  },
  {
    id: 4,
    name: "Zana Jazz Quartet",
    genre: "Jazz",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1574791325739-3060fa18b75d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphenolMjBiYW5kfGVufDB8fDB8fHwy",
    location: "Antsiranana",
    fee: 300000,
    bookings: 22
  },
  {
    id: 5,
    name: "DJ Salama",
    genre: "Afro House",
    rating: 4.5,
    profileImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGFmcmljYW4lMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D",
    location: "Mahajanga",
    fee: 200000,
    bookings: 31
  }
];

export default function SearchArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [artists, setArtists] = useState(mockArtists);

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

  const handleReservation = (artistId: number) => {
    console.log(`Réservation demandée pour l'artiste #${artistId}`);
    alert(`Demande de réservation envoyée à ${artists.find(a => a.id === artistId)?.name}`);
  };

  return (
    <UserLayout>
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
                  <p className="text-lg font-semibold mb-2">{artist.fee.toLocaleString()} Ar</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button onClick={() => handleReservation(artist.id)} className="w-full">
                    Réserver
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
    </UserLayout>
  );
}