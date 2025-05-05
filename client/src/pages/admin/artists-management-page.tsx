import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Search, Plus, Music, Star, Eye, Edit, Trash2,
  CheckCircle, XCircle, Filter, RefreshCw, Download, MoreHorizontal,
  Calendar, Clock
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types pour la gestion des artistes
type Artist = {
  id: number;
  name: string;
  genres: string[];
  rating: number;
  reviewCount: number;
  followers: number;
  profileImage?: string;
  location: string;
  dateCreated: string;
  verficationStatus: "pending" | "verified" | "rejected";
  events: number;
  userId: number;
};

// Données fictives d'artistes
const mockArtists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    genres: ["Techno", "House"],
    rating: 4.8,
    reviewCount: 156,
    followers: 12540,
    profileImage: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=100&h=100&fit=crop",
    location: "Paris, France",
    dateCreated: "2023-03-15T10:30:00",
    verficationStatus: "verified",
    events: 47,
    userId: 101
  },
  {
    id: 2,
    name: "MC Blaze",
    genres: ["Hip-Hop", "Rap"],
    rating: 4.6,
    reviewCount: 89,
    followers: 8320,
    profileImage: "https://images.unsplash.com/photo-1525517450344-d08c6a528e3c?w=100&h=100&fit=crop",
    location: "Lyon, France",
    dateCreated: "2023-05-22T14:15:00",
    verficationStatus: "verified",
    events: 23,
    userId: 102
  },
  {
    id: 3,
    name: "Luna Ray",
    genres: ["Deep House", "Melodic Techno"],
    rating: 4.9,
    reviewCount: 124,
    followers: 15680,
    profileImage: "https://images.unsplash.com/photo-1587858450571-d9e80f6ccc76?w=100&h=100&fit=crop",
    location: "Marseille, France",
    dateCreated: "2023-04-10T09:45:00",
    verficationStatus: "verified",
    events: 38,
    userId: 103
  },
  {
    id: 4,
    name: "BeatMaster",
    genres: ["Drum & Bass", "Jungle"],
    rating: 4.7,
    reviewCount: 68,
    followers: 6240,
    profileImage: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=100&h=100&fit=crop",
    location: "Lille, France",
    dateCreated: "2023-06-05T16:20:00",
    verficationStatus: "pending",
    events: 15,
    userId: 104
  },
  {
    id: 5,
    name: "DJ NiteMagic",
    genres: ["Trance", "Progressive"],
    rating: 4.5,
    reviewCount: 47,
    followers: 4120,
    profileImage: "https://images.unsplash.com/photo-1567385337777-03a1ca5c33e7?w=100&h=100&fit=crop",
    location: "Toulouse, France",
    dateCreated: "2023-07-12T11:30:00",
    verficationStatus: "pending",
    events: 9,
    userId: 105
  }
];

// Fonctions d'aide
function getVerificationStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/25 flex gap-1 items-center">
          <CheckCircle className="h-3 w-3" />
          <span>Vérifié</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/25 flex gap-1 items-center">
          <Clock className="h-3 w-3" />
          <span>En attente</span>
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/25 flex gap-1 items-center">
          <XCircle className="h-3 w-3" />
          <span>Rejeté</span>
        </Badge>
      );
    default:
      return null;
  }
}

// Composant principal
export default function ArtistsManagementPage() {
  const [, setLocation] = useLocation();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setArtists(mockArtists);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Obtenir tous les genres uniques
  const allGenres = Array.from(
    new Set(artists.flatMap(artist => artist.genres))
  ).sort();

  // Filtrer les artistes
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = searchQuery 
      ? artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesGenre = genreFilter === "all" 
      ? true 
      : artist.genres.includes(genreFilter);
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : artist.verficationStatus === statusFilter;
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Gérer la suppression d'un artiste
  const handleDeleteArtist = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setArtists(prev => prev.filter(artist => artist.id !== id));
    setShowDeleteDialog(false);
  };

  // Gérer la vérification d'un artiste
  const handleVerifyArtist = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setArtists(prev => 
      prev.map(artist => 
        artist.id === id 
          ? { ...artist, verficationStatus: "verified" } 
          : artist
      )
    );
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Gestion des Artistes</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setLocation("/admin")}
        >
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ResponsiveLayout headerContent={headerContent} activeItem="artistes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="artistes">
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Music className="h-8 w-8 text-primary mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Total Artistes
                </div>
                <div className="text-2xl font-bold">{artists.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Artistes Vérifiés
                </div>
                <div className="text-2xl font-bold">
                  {artists.filter(a => a.verficationStatus === "verified").length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Note Moyenne
                </div>
                <div className="text-2xl font-bold">
                  {(artists.reduce((sum, a) => sum + a.rating, 0) / artists.length).toFixed(1)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Événements
                </div>
                <div className="text-2xl font-bold">
                  {artists.reduce((sum, a) => sum + a.events, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, lieu..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                {allGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="verified">Vérifiés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" title="Rafraîchir" onClick={() => {
              // Implémentation à venir (API call, etc.)
              setIsLoading(true);
              setTimeout(() => {
                setArtists(mockArtists);
                setIsLoading(false);
              }, 500);
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Actions en masse */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Liste des artistes</h2>
            <p className="text-sm text-muted-foreground">
              {filteredArtists.length} artiste(s) trouvé(s)
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                // Implémentation à venir (export CSV, etc.)
                alert("Fonctionnalité d'export à implémenter");
              }}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                // Rediriger vers le formulaire d'ajout
                alert("Redirection vers le formulaire d'ajout d'artiste");
              }}
            >
              <Plus className="h-4 w-4" />
              Ajouter un artiste
            </Button>
          </div>
        </div>
        
        {/* Tableau des artistes */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artiste</TableHead>
                  <TableHead>Genres</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Aucun artiste trouvé correspondant aux critères
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArtists.map(artist => (
                    <TableRow key={artist.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={artist.profileImage} alt={artist.name} />
                            <AvatarFallback>{artist.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{artist.name}</div>
                            <div className="text-xs text-muted-foreground">{artist.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {artist.genres.map(genre => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current mr-1" />
                          <span>{artist.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({artist.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {artist.followers.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {format(new Date(artist.dateCreated), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {getVerificationStatusBadge(artist.verficationStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                // Rediriger vers la page de détail de l'artiste
                                window.open(`/artist/${artist.id}`, '_blank');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span>Voir le profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                // Rediriger vers le formulaire de modification
                                alert(`Redirection vers le formulaire de modification pour ${artist.name}`);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            {artist.verficationStatus === "pending" && (
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer text-green-600"
                                onClick={() => handleVerifyArtist(artist.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span>Vérifier</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer text-destructive"
                              onClick={() => {
                                setSelectedArtist(artist);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'artiste "{selectedArtist?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedArtist) {
                  handleDeleteArtist(selectedArtist.id);
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}