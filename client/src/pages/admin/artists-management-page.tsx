import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  User, Music, CircleSlash, CheckCircle, Search, 
  Trash2, Edit, Eye, Star, Filter, MoreHorizontal, 
  ArrowUpDown, ChevronDown, X
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import PartyLoader from "@/components/PartyLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Types pour les artistes
type Artist = {
  id: number;
  name: string;
  username: string;
  email: string;
  genres: string[];
  avatar?: string;
  status: "pending" | "approved" | "rejected";
  rating: number;
  followers: number;
  events: number;
  lastActive: string;
  phone?: string;
  description?: string;
  isFeatured: boolean;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    soundcloud?: string;
    spotify?: string;
  }
};

export default function ArtistsManagementPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isArtistDetailsOpen, setIsArtistDetailsOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);

  // Liste des genres de musique
  const genres = [
    "EDM", "House", "Techno", "Reggae", "Hip Hop", "R&B", 
    "Afrobeat", "Salsa", "Dancehall", "Pop", "Rock"
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      // Données simulées pour les artistes
      const mockArtists: Artist[] = [
        {
          id: 1,
          name: "DJ Elektra",
          username: "dj_elektra",
          email: "elektra@example.com",
          genres: ["EDM", "House"],
          avatar: "https://images.unsplash.com/photo-1594077412701-1ea2e7e4e0c5?fit=crop&w=150&h=150",
          status: "approved",
          rating: 4.7,
          followers: 12500,
          events: 47,
          lastActive: "2025-05-07T16:42:00",
          phone: "+261 34 12 345 67",
          description: "DJ Elektra est une DJ et productrice spécialisée dans la house et l'EDM, avec une expérience internationale.",
          isFeatured: true,
          socialLinks: {
            instagram: "@dj_elektra",
            facebook: "dj.elektra.official",
            soundcloud: "dj_elektra"
          }
        },
        {
          id: 2,
          name: "DJ Metro",
          username: "dj_metro",
          email: "metro@example.com",
          genres: ["Techno", "House"],
          avatar: "https://images.unsplash.com/photo-1516122415324-fb05fbd90bde?fit=crop&w=150&h=150",
          status: "approved",
          rating: 4.5,
          followers: 8900,
          events: 32,
          lastActive: "2025-05-06T11:23:00",
          phone: "+261 34 67 890 12",
          description: "DJ Metro est reconnu pour ses sets techno et ses productions originales.",
          isFeatured: false,
          socialLinks: {
            instagram: "@djmetro",
            facebook: "dj.metro.official",
            spotify: "djmetro"
          }
        },
        {
          id: 3,
          name: "Sarah Beats",
          username: "sarah_beats",
          email: "sarah@example.com",
          genres: ["Hip Hop", "R&B"],
          avatar: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?fit=crop&w=150&h=150",
          status: "approved",
          rating: 4.3,
          followers: 7200,
          events: 28,
          lastActive: "2025-05-05T19:10:00",
          phone: "+261 33 45 678 90",
          description: "Sarah Beats est une artiste hip-hop et R&B connue pour ses performances énergiques.",
          isFeatured: false,
          socialLinks: {
            instagram: "@sarah_beats",
            twitter: "@sarah_beats"
          }
        },
        {
          id: 4,
          name: "Reggae Lions",
          username: "reggae_lions",
          email: "lions@example.com",
          genres: ["Reggae", "Dancehall"],
          avatar: "https://images.unsplash.com/photo-1496386273169-2de3ecb9b2a3?fit=crop&w=150&h=150",
          status: "approved",
          rating: 4.6,
          followers: 9500,
          events: 42,
          lastActive: "2025-05-04T21:35:00",
          phone: "+261 32 12 345 67",
          description: "Reggae Lions est un groupe de reggae qui fusionne les sonorités traditionnelles avec des éléments modernes.",
          isFeatured: true,
          socialLinks: {
            facebook: "reggaelions",
            instagram: "@reggae_lions"
          }
        },
        {
          id: 5,
          name: "AfroJam Collective",
          username: "afrojam",
          email: "afrojam@example.com",
          genres: ["Afrobeat", "Jazz"],
          status: "pending",
          rating: 0,
          followers: 1200,
          events: 0,
          lastActive: "2025-05-08T09:15:00",
          phone: "+261 33 98 765 43",
          description: "AfroJam Collective est un groupe qui mélange afrobeat et jazz pour créer une expérience musicale unique.",
          isFeatured: false
        },
        {
          id: 6,
          name: "DJ Pulse",
          username: "dj_pulse",
          email: "pulse@example.com",
          genres: ["Techno", "EDM"],
          avatar: "https://images.unsplash.com/photo-1642297822915-3aeb4c0c9a8e?fit=crop&w=150&h=150",
          status: "pending",
          rating: 0,
          followers: 800,
          events: 0,
          lastActive: "2025-05-07T14:22:00",
          phone: "+261 32 45 678 90",
          description: "DJ Pulse est un artiste émergent spécialisé dans la techno et l'EDM.",
          isFeatured: false
        },
        {
          id: 7,
          name: "Salsa Kings",
          username: "salsa_kings",
          email: "salsa@example.com",
          genres: ["Salsa", "Latin"],
          status: "rejected",
          rating: 0,
          followers: 0,
          events: 0,
          lastActive: "2025-05-06T10:05:00",
          phone: "+261 34 56 789 01",
          description: "Demande rejetée en raison d'informations incomplètes. Manque de preuves d'expérience.",
          isFeatured: false
        }
      ];

      setArtists(mockArtists);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour filtrer les artistes
  const getFilteredArtists = () => {
    return artists.filter(artist => {
      // Filtre par recherche
      const matchesSearch = 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        artist.status === statusFilter;
      
      // Filtre par genre
      const matchesGenre = 
        genreFilter === "all" || 
        artist.genres?.some(g => g.toLowerCase() === genreFilter.toLowerCase());
      
      // Filtre par onglet
      const matchesTab = 
        (activeTab === "all") ||
        (activeTab === "approved" && artist.status === "approved") ||
        (activeTab === "pending" && artist.status === "pending") ||
        (activeTab === "rejected" && artist.status === "rejected") ||
        (activeTab === "featured" && artist.isFeatured);
      
      return matchesSearch && matchesStatus && matchesGenre && matchesTab;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "rating") {
        return sortOrder === "asc" 
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortBy === "followers") {
        return sortOrder === "asc" 
          ? a.followers - b.followers
          : b.followers - a.followers;
      } else if (sortBy === "events") {
        return sortOrder === "asc" 
          ? a.events - b.events
          : b.events - a.events;
      }
      return 0;
    });
  };

  // Obtenir les artistes filtrés et triés
  const filteredArtists = getFilteredArtists();

  // Fonctions pour les actions sur les artistes
  const handleViewArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsArtistDetailsOpen(true);
  };

  const handleEditArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    // Action d'édition (ouvrir un dialog d'édition)
    toast({
      title: "Mode édition",
      description: `Édition de ${artist.name} non implémentée dans cette version.`,
    });
  };

  const handleDeleteArtist = (artist: Artist) => {
    // Action de suppression (demander confirmation)
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'artiste ${artist.name} ?`)) {
      toast({
        title: "Artiste supprimé",
        description: `${artist.name} a été supprimé avec succès.`,
      });
      // Simuler la suppression
      setArtists(artists.filter(a => a.id !== artist.id));
    }
  };

  const handleApproveArtist = (artist: Artist) => {
    toast({
      title: "Artiste approuvé",
      description: `${artist.name} a été approuvé avec succès.`
    });
    // Simuler l'approbation
    setArtists(artists.map(a => 
      a.id === artist.id ? { ...a, status: "approved" as const } : a
    ));
  };

  const handleRejectArtist = (artist: Artist) => {
    toast({
      title: "Artiste rejeté",
      description: `${artist.name} a été rejeté.`,
      variant: "destructive"
    });
    // Simuler le rejet
    setArtists(artists.map(a => 
      a.id === artist.id ? { ...a, status: "rejected" as const } : a
    ));
  };

  const handleToggleFeatured = (artist: Artist) => {
    toast({
      title: artist.isFeatured ? "Artiste retiré des favoris" : "Artiste mis en avant",
      description: artist.isFeatured 
        ? `${artist.name} a été retiré des artistes en vedette.`
        : `${artist.name} a été ajouté aux artistes en vedette.`
    });
    // Simuler le changement
    setArtists(artists.map(a => 
      a.id === artist.id ? { ...a, isFeatured: !a.isFeatured } : a
    ));
  };

  // Rendu de la page
  return (
    <ResponsiveLayout>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <PartyLoader />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestion des Artistes</h1>
              <p className="text-muted-foreground">
                Gérez et modérez les profils d'artistes sur la plateforme Be bit.
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button onClick={() => setLocation("/admin")}>
                Retour au Dashboard
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-1/2">
              <TabsTrigger value="all">
                Tous <Badge className="ml-1">{artists.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approuvés <Badge className="ml-1">{artists.filter(a => a.status === "approved").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente <Badge variant="secondary" className="ml-1">{artists.filter(a => a.status === "pending").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejetés <Badge variant="destructive" className="ml-1">{artists.filter(a => a.status === "rejected").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="featured">
                En vedette <Badge className="ml-1 bg-amber-500">{artists.filter(a => a.isFeatured).length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Liste des artistes</CardTitle>
                <CardDescription>
                  {filteredArtists.length} artistes correspondent à vos critères
                </CardDescription>
                
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, username, email..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <X 
                        className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                        onClick={() => setSearchQuery("")}
                      />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="approved">Approuvés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="rejected">Rejetés</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={genreFilter} onValueChange={setGenreFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Music className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les genres</SelectItem>
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => {
                          setSortBy("name");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Artiste
                          {sortBy === "name" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Genres</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end cursor-pointer" onClick={() => {
                          setSortBy("rating");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Note
                          {sortBy === "rating" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end cursor-pointer" onClick={() => {
                          setSortBy("followers");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Followers
                          {sortBy === "followers" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end cursor-pointer" onClick={() => {
                          setSortBy("events");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Événements
                          {sortBy === "events" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredArtists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <Music className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">Aucun artiste trouvé</p>
                            <p className="text-sm text-muted-foreground">
                              Modifiez vos filtres ou essayez une autre recherche
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArtists.map((artist, index) => (
                        <TableRow key={artist.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={artist.avatar} />
                                <AvatarFallback>
                                  {artist.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {artist.name}
                                  {artist.isFeatured && (
                                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-600 border-amber-200">
                                      Vedette
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">@{artist.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {artist.genres?.map(genre => (
                                <Badge key={genre} variant="outline" className="whitespace-nowrap">
                                  {genre}
                                </Badge>
                              )) || "Non spécifié"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                artist.status === "approved" ? "bg-green-100 text-green-600 border-green-200" :
                                artist.status === "pending" ? "bg-yellow-100 text-yellow-600 border-yellow-200" :
                                "bg-red-100 text-red-600 border-red-200"
                              }
                            >
                              {artist.status === "approved" ? "Approuvé" :
                               artist.status === "pending" ? "En attente" : "Rejeté"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {artist.rating > 0 ? (
                              <div className="flex items-center justify-end">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                                {artist.rating.toFixed(1)}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {artist.followers > 0 ? artist.followers.toLocaleString() : "0"}
                          </TableCell>
                          <TableCell className="text-right">
                            {artist.events}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewArtist(artist)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>Voir le profil</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditArtist(artist)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Modifier</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(artist)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    <span>{artist.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}</span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  {artist.status === "pending" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleApproveArtist(artist)}>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                        <span>Approuver</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleRejectArtist(artist)}>
                                        <CircleSlash className="h-4 w-4 mr-2 text-red-500" />
                                        <span>Rejeter</span>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteArtist(artist)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Supprimer</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredArtists.length} artistes sur {artists.length} au total
                </div>
                {filteredArtists.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Suivant
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Tabs>
        </div>
      )}

      {/* Dialogue de détails d'artiste */}
      <Dialog open={isArtistDetailsOpen} onOpenChange={setIsArtistDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedArtist && (
            <>
              <DialogHeader>
                <DialogTitle>Profil d'artiste</DialogTitle>
                <DialogDescription>
                  Détails complets du profil de {selectedArtist.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedArtist.avatar} />
                    <AvatarFallback className="text-xl">
                      {selectedArtist.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold">{selectedArtist.name}</h3>
                    <p className="text-muted-foreground">@{selectedArtist.username}</p>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-2">
                      <Badge
                        className={
                          selectedArtist.status === "approved" ? "bg-green-100 text-green-600 border-green-200" :
                          selectedArtist.status === "pending" ? "bg-yellow-100 text-yellow-600 border-yellow-200" :
                          "bg-red-100 text-red-600 border-red-200"
                        }
                      >
                        {selectedArtist.status === "approved" ? "Approuvé" :
                         selectedArtist.status === "pending" ? "En attente" : "Rejeté"}
                      </Badge>
                      
                      {selectedArtist.isFeatured && (
                        <Badge className="bg-amber-100 text-amber-600 border-amber-200">
                          Artiste en vedette
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <p className="text-2xl font-bold">{selectedArtist.followers.toLocaleString()}</p>
                    <p className="text-muted-foreground text-sm">Abonnés</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <p className="text-2xl font-bold">{selectedArtist.events}</p>
                    <p className="text-muted-foreground text-sm">Événements</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <div className="flex items-center text-2xl font-bold">
                      {selectedArtist.rating > 0 ? (
                        <>
                          {selectedArtist.rating.toFixed(1)}
                          <Star className="h-5 w-5 text-yellow-500 ml-1" fill="currentColor" />
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">Note</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-semibold mb-1">Description</h4>
                  <p className="text-muted-foreground">{selectedArtist.description || "Aucune description fournie."}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h4 className="font-semibold mb-1">Coordonnées</h4>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span> {selectedArtist.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Téléphone:</span> {selectedArtist.phone || "Non fourni"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">Genres musicaux</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedArtist.genres?.map(genre => (
                        <Badge key={genre} variant="outline">
                          {genre}
                        </Badge>
                      )) || "Non spécifié"}
                    </div>
                  </div>
                </div>
                
                {selectedArtist.socialLinks && Object.keys(selectedArtist.socialLinks).length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-1">Réseaux sociaux</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.socialLinks.instagram && (
                        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                          Instagram: {selectedArtist.socialLinks.instagram}
                        </Badge>
                      )}
                      {selectedArtist.socialLinks.facebook && (
                        <Badge variant="outline" className="bg-blue-600 text-white border-none">
                          Facebook: {selectedArtist.socialLinks.facebook}
                        </Badge>
                      )}
                      {selectedArtist.socialLinks.twitter && (
                        <Badge variant="outline" className="bg-sky-500 text-white border-none">
                          Twitter: {selectedArtist.socialLinks.twitter}
                        </Badge>
                      )}
                      {selectedArtist.socialLinks.soundcloud && (
                        <Badge variant="outline" className="bg-orange-500 text-white border-none">
                          SoundCloud: {selectedArtist.socialLinks.soundcloud}
                        </Badge>
                      )}
                      {selectedArtist.socialLinks.spotify && (
                        <Badge variant="outline" className="bg-green-500 text-white border-none">
                          Spotify: {selectedArtist.socialLinks.spotify}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedArtist.status === "pending" && (
                  <>
                    <Button 
                      onClick={() => {
                        handleApproveArtist(selectedArtist);
                        setIsArtistDetailsOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    <Button 
                      onClick={() => {
                        handleRejectArtist(selectedArtist);
                        setIsArtistDetailsOpen(false);
                      }}
                      variant="destructive"
                    >
                      <CircleSlash className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => handleToggleFeatured(selectedArtist)}
                  variant="outline" 
                  className={selectedArtist.isFeatured ? "text-red-600" : ""}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedArtist.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Fermer</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}