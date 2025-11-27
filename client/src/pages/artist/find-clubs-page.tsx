import React, { useState } from "react";
import { Search, Filter, Star, Music, Calendar, MapPin, Mail, Phone, Globe, Users } from "lucide-react";
import ArtistLayout from "../../layouts/artist-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types
type Club = {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  rating: number;
  capacity: number;
  coverImage: string;
  email: string;
  phone: string;
  website: string;
  musicTypes: string[];
  upcomingEvents: Event[];
  pastBookings: Booking[];
};

type Event = {
  id: number;
  title: string;
  date: string;
  posterImage: string;
  artistsCount: number;
};

type Booking = {
  id: number;
  artistName: string;
  date: string;
  image: string;
};

const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    description: "Club moderne et branché au cœur d'Antananarivo. Accueille des DJ internationaux et locaux pour des soirées mémorables.",
    location: "Antananarivo",
    address: "25 Avenue de l'Indépendance, Antananarivo",
    rating: 4.8,
    capacity: 400,
    coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHRjbHVifGVufDB8fDB8fHwy",
    email: "contact@cluboxygen.mg",
    phone: "+261 20 22 123 456",
    website: "www.cluboxygen.mg",
    musicTypes: ["Électronique", "House", "Techno"],
    upcomingEvents: [
      {
        id: 101,
        title: "Summer Vibes Festival",
        date: "2025-03-15",
        posterImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxpdmUlMjBiYW5kfGVufDB8fDB8fHwy",
        artistsCount: 5
      },
      {
        id: 102,
        title: "Tech House Night",
        date: "2025-02-20",
        posterImage: "https://images.unsplash.com/photo-1642114021434-cc31ac421656?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fG5pZ2h0Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D",
        artistsCount: 3
      }
    ],
    pastBookings: [
      {
        id: 201,
        artistName: "DJ Elektra",
        date: "2025-01-25",
        image: "https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNsdWIlMjBkanhcXHxlbnwwfHwwfHx8Mg%3D%3D"
      },
      {
        id: 202,
        artistName: "Sound Collective",
        date: "2024-12-31",
        image: "https://images.unsplash.com/photo-1583795484071-3c453b3d1f6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGJhbmR8ZW58MHx8MHx8fDI%3D"
      }
    ]
  },
  {
    id: 2,
    name: "Havana Club",
    description: "Ambiance latino et internationale. Spécialisé dans les soirées à thème et les performances live de groupes de variété.",
    location: "Antananarivo",
    address: "Zone Tana Waterfront, Antananarivo",
    rating: 4.6,
    capacity: 300,
    coverImage: "https://images.unsplash.com/photo-1628688351280-c5636e954ff1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG5pZ2h0Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D",
    email: "info@havanaclub.mg",
    phone: "+261 20 22 234 567",
    website: "www.havanaclub.mg",
    musicTypes: ["Latino", "Salsa", "Variété"],
    upcomingEvents: [
      {
        id: 103,
        title: "Noche Latina",
        date: "2025-02-28",
        posterImage: "https://images.unsplash.com/photo-1481653125770-b78c206c59d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhbHNhfGVufDB8fDB8fHwy",
        artistsCount: 2
      }
    ],
    pastBookings: [
      {
        id: 203,
        artistName: "Salsa Kings",
        date: "2025-01-15",
        image: "https://images.unsplash.com/photo-1505282722405-413748d3de7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Fsc2F8ZW58MHx8MHx8fDI%3D"
      }
    ]
  },
  {
    id: 3,
    name: "Sky Lounge",
    description: "Bar-lounge avec vue panoramique sur la ville. Ambiance feutrée idéale pour des performances acoustiques et DJ sets lounge.",
    location: "Antananarivo",
    address: "Tour Zital, 15ème étage, Ankorondrano",
    rating: 4.9,
    capacity: 200,
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWxlY3Ryb25pYyUyMG11c2ljfGVufDB8fDB8fHwy",
    email: "reservation@skylounge.mg",
    phone: "+261 20 22 345 678",
    website: "www.skylounge.mg",
    musicTypes: ["Lounge", "Deep House", "Jazz"],
    upcomingEvents: [
      {
        id: 104,
        title: "Sunset Sessions",
        date: "2025-03-05",
        posterImage: "https://images.unsplash.com/photo-1517157837591-17b69085bfdc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGphenolMjBtdXNpY3xlbnwwfHwwfHx8Mg%3D%3D",
        artistsCount: 2
      },
      {
        id: 105,
        title: "Jazz & Soul Evening",
        date: "2025-02-15",
        posterImage: "https://images.unsplash.com/photo-1568882190772-215a36050953?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNvdWwlMjBtdXNpY3xlbnwwfHwwfHx8Mg%3D%3D",
        artistsCount: 1
      }
    ],
    pastBookings: [
      {
        id: 204,
        artistName: "Zana Jazz Quartet",
        date: "2025-01-10",
        image: "https://images.unsplash.com/photo-1574791325739-3060fa18b75d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphenolMjBiYW5kfGVufDB8fDB8fHwy"
      },
      {
        id: 205,
        artistName: "DJ Chill",
        date: "2024-12-20",
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGhpcCUyMGhvcCUyMGFydGlzdHxlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 4,
    name: "Beach Club",
    description: "Club en bord de mer avec terrasse sur la plage. Idéal pour les performances festives et les DJ sets tropicaux.",
    location: "Mahajanga",
    address: "Plage d'Amborovy, Mahajanga",
    rating: 4.7,
    capacity: 350,
    coverImage: "https://images.unsplash.com/photo-1527271982979-83fea3eb3582?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBjbHVifGVufDB8fDB8fHwy",
    email: "contact@beachclub.mg",
    phone: "+261 20 62 123 456",
    website: "www.beachclub.mg",
    musicTypes: ["Tropical House", "Reggae", "Afrobeats"],
    upcomingEvents: [
      {
        id: 106,
        title: "Beach Party",
        date: "2025-03-20",
        posterImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwcGFydHl8ZW58MHx8MHx8fDI%3D",
        artistsCount: 4
      }
    ],
    pastBookings: [
      {
        id: 206,
        artistName: "Reggae Vibrations",
        date: "2025-01-20",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVnZ2FlJTIwYmFuZHxlbnwwfHwwfHx8Mg%3D%3D"
      }
    ]
  },
  {
    id: 5,
    name: "Le Studio",
    description: "Espace intime et acoustique dédié aux performances live. Parfait pour les concerts et showcases exclusifs.",
    location: "Antananarivo",
    address: "Rue Rainandriamampandry, Antananarivo",
    rating: 4.5,
    capacity: 150,
    coverImage: "https://images.unsplash.com/photo-1571955100660-fa004a45bc21?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGxpdmUlMjBtdXNpY3xlbnwwfHwwfHx8Mg%3D%3D",
    email: "info@lestudio.mg",
    phone: "+261 20 22 456 789",
    website: "www.lestudio.mg",
    musicTypes: ["Acoustique", "Folk", "Indie"],
    upcomingEvents: [
      {
        id: 107,
        title: "Acoustic Sessions",
        date: "2025-02-25",
        posterImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2x1YnxlbnwwfHwwfHx8Mg%3D%3D",
        artistsCount: 3
      }
    ],
    pastBookings: [
      {
        id: 207,
        artistName: "Folk Ensemble",
        date: "2025-01-05",
        image: "https://images.unsplash.com/photo-1621478374422-35206faedbd7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGZvbGslMjBiYW5kfGVufDB8fDB8fHwy"
      }
    ]
  }
];

export default function FindClubsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [clubs, setClubs] = useState(mockClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrer les clubs en fonction des critères de recherche
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.musicTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter === "all" || club.location === locationFilter;
    const matchesGenre = genreFilter === "all" || club.musicTypes.includes(genreFilter);
    
    return matchesSearch && matchesLocation && matchesGenre;
  });

  // Obtenir les valeurs uniques pour les filtres
  const locations = Array.from(new Set(clubs.map(club => club.location)));
  const genres = Array.from(new Set(clubs.flatMap(club => club.musicTypes)));

  const handleViewClub = (club: Club) => {
    setSelectedClub(club);
  };

  const handleSendProposal = (clubId: number) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      setSelectedClub(club);
      setIsDialogOpen(true);
    }
  };

  const handleSubmitProposal = () => {
    if (!selectedClub || !messageText.trim()) {
      toast({
        title: "Information manquante",
        description: "Veuillez rédiger un message pour votre proposition",
        variant: "destructive",
      });
      return;
    }

    console.log({
      clubId: selectedClub.id,
      clubName: selectedClub.name,
      message: messageText,
    });

    toast({
      title: "Proposition envoyée!",
      description: `Votre proposition a été envoyée à ${selectedClub.name}`,
    });

    setIsDialogOpen(false);
    setMessageText("");
  };

  return (
    <ArtistLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Rechercher des Clubs</h1>
        
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un club par nom, description ou style musical..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          
          <div className="flex-1">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Style musical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les styles</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Résultats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClubs.length > 0 ? (
            filteredClubs.map(club => (
              <Card key={club.id} className="overflow-hidden">
                <CardHeader className="p-0 relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src={club.coverImage} 
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex flex-col">
                    <CardTitle className="text-white text-xl">{club.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-white text-sm mr-3">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {club.rating}
                      </div>
                      <Badge variant="outline" className="bg-primary/20 text-white border-primary">
                        <Users className="h-3 w-3 mr-1" />
                        {club.capacity} pers.
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center mb-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {club.location}
                  </div>
                  <p className="text-sm line-clamp-2 mb-3">{club.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {club.musicTypes.map(type => (
                      <Badge key={type} variant="secondary" className="flex items-center">
                        <Music className="h-3 w-3 mr-1" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button onClick={() => handleViewClub(club)} variant="outline" className="flex-1">
                    Détails
                  </Button>
                  <Button onClick={() => handleSendProposal(club.id)} className="flex-1">
                    Proposer
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center">
              <p className="text-muted-foreground">Aucun club ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog pour envoyer une proposition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Envoyer une proposition</DialogTitle>
            <DialogDescription>
              Présentez votre profil et proposez une collaboration à {selectedClub?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Décrivez votre style musical, votre expérience et les dates où vous seriez disponible..."
              className="min-h-[200px]"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitProposal}>
              Envoyer la proposition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher les détails d'un club */}
      {selectedClub && !isDialogOpen && (
        <Dialog open={!!selectedClub && !isDialogOpen} onOpenChange={() => setSelectedClub(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedClub.coverImage} alt={selectedClub.name} />
                  <AvatarFallback>{selectedClub.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selectedClub.name}</DialogTitle>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-sm mr-3">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {selectedClub.rating}
                    </div>
                    <Badge variant="outline" className="border-primary">
                      <Users className="h-3 w-3 mr-1" />
                      {selectedClub.capacity} pers.
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="events">Événements</TabsTrigger>
                <TabsTrigger value="bookings">Historique</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedClub.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedClub.address}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {selectedClub.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedClub.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Site web</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {selectedClub.website}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Styles musicaux</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedClub.musicTypes.map(type => (
                        <Badge key={type} variant="secondary" className="flex items-center">
                          <Music className="h-3 w-3 mr-1" />
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Événements à venir</h3>
                  {selectedClub.upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedClub.upcomingEvents.map(event => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/3 h-32">
                              <img 
                                src={event.posterImage} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <Users className="h-4 w-4 mr-1" />
                                {event.artistsCount} artiste{event.artistsCount > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aucun événement à venir
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="bookings" className="mt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Artistes ayant joué récemment</h3>
                  {selectedClub.pastBookings.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-1 gap-4 pr-4">
                        {selectedClub.pastBookings.map(booking => (
                          <Card key={booking.id} className="overflow-hidden">
                            <div className="flex items-center p-3">
                              <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={booking.image} alt={booking.artistName} />
                                <AvatarFallback>{booking.artistName.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{booking.artistName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(booking.date), 'dd MMM yyyy', { locale: fr })}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aucun historique disponible
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button onClick={() => {
                setIsDialogOpen(true);
              }}>
                Envoyer une proposition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ArtistLayout>
  );
}