import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Search, Plus, Building, Star, Eye, Edit, Trash2,
  CheckCircle, XCircle, Filter, RefreshCw, Download, MoreHorizontal,
  MapPin, Calendar, Clock, Users
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
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

// Types pour la gestion des clubs
type Club = {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  followers: number;
  profileImage?: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  dateCreated: string;
  verificationStatus: "pending" | "verified" | "rejected";
  events: number;
  userId: number;
};

// Données fictives des clubs
const mockClubs: Club[] = [
  {
    id: 1,
    name: "Club Oxygen",
    category: "Club de Nuit",
    rating: 4.7,
    reviewCount: 238,
    followers: 8750,
    profileImage: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=100&h=100&fit=crop",
    address: "15 rue de la Nuit",
    city: "Paris",
    country: "France",
    capacity: 800,
    dateCreated: "2023-01-15T12:30:00",
    verificationStatus: "verified",
    events: 52,
    userId: 201
  },
  {
    id: 2,
    name: "Le Bunker",
    category: "Club Techno",
    rating: 4.5,
    reviewCount: 186,
    followers: 6320,
    profileImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100&h=100&fit=crop",
    address: "8 rue des Souterrains",
    city: "Lyon",
    country: "France",
    capacity: 450,
    dateCreated: "2023-02-20T09:45:00",
    verificationStatus: "verified",
    events: 38,
    userId: 202
  },
  {
    id: 3,
    name: "Warehouse",
    category: "Club Alternatif",
    rating: 4.2,
    reviewCount: 154,
    followers: 5980,
    profileImage: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=100&h=100&fit=crop",
    address: "23 avenue Industrielle",
    city: "Marseille",
    country: "France",
    capacity: 1200,
    dateCreated: "2023-03-05T15:20:00",
    verificationStatus: "verified",
    events: 45,
    userId: 203
  },
  {
    id: 4,
    name: "Loft 21",
    category: "Lounge Bar",
    rating: 4.8,
    reviewCount: 92,
    followers: 3860,
    profileImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop",
    address: "21 boulevard des Arts",
    city: "Nice",
    country: "France",
    capacity: 250,
    dateCreated: "2023-04-12T11:15:00",
    verificationStatus: "pending",
    events: 17,
    userId: 204
  },
  {
    id: 5,
    name: "Club Métropolis",
    category: "Club Généraliste",
    rating: 3.9,
    reviewCount: 75,
    followers: 2940,
    profileImage: "https://images.unsplash.com/photo-1586999768265-24af89630739?w=100&h=100&fit=crop",
    address: "45 rue du Commerce",
    city: "Toulouse",
    country: "France",
    capacity: 600,
    dateCreated: "2023-05-30T14:10:00",
    verificationStatus: "pending",
    events: 12,
    userId: 205
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
export default function ClubsManagementPage() {
  const [, setLocation] = useLocation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setClubs(mockClubs);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Obtenir toutes les catégories uniques
  const allCategories = Array.from(
    new Set(clubs.map(club => club.category))
  ).sort();

  // Filtrer les clubs
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = searchQuery 
      ? club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.address.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = categoryFilter === "all" 
      ? true 
      : club.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : club.verificationStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Gérer la suppression d'un club
  const handleDeleteClub = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setClubs(prev => prev.filter(club => club.id !== id));
    setShowDeleteDialog(false);
  };

  // Gérer la vérification d'un club
  const handleVerifyClub = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setClubs(prev => 
      prev.map(club => 
        club.id === id 
          ? { ...club, verificationStatus: "verified" } 
          : club
      )
    );
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Gestion des Clubs</span>
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
      <ResponsiveLayout headerContent={headerContent} activeItem="clubs">
        <LoadingSpinner message="Chargement des clubs..." />
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="clubs">
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Building className="h-8 w-8 text-primary mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Total Clubs
                </div>
                <div className="text-2xl font-bold">{clubs.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Clubs Vérifiés
                </div>
                <div className="text-2xl font-bold">
                  {clubs.filter(c => c.verificationStatus === "verified").length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-indigo-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Capacité Totale
                </div>
                <div className="text-2xl font-bold">
                  {clubs.reduce((sum, c) => sum + c.capacity, 0).toLocaleString()}
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
                  {clubs.reduce((sum, c) => sum + c.events, 0)}
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
              placeholder="Rechercher par nom, ville, adresse..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
                setClubs(mockClubs);
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
            <h2 className="text-xl font-semibold">Liste des clubs</h2>
            <p className="text-sm text-muted-foreground">
              {filteredClubs.length} club(s) trouvé(s)
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
                alert("Redirection vers le formulaire d'ajout de club");
              }}
            >
              <Plus className="h-4 w-4" />
              Ajouter un club
            </Button>
          </div>
        </div>
        
        {/* Tableau des clubs */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Club</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Aucun club trouvé correspondant aux critères
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClubs.map(club => (
                    <TableRow key={club.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={club.profileImage} alt={club.name} />
                            <AvatarFallback>{club.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{club.name}</div>
                            <div className="text-xs text-muted-foreground">{club.city}, {club.country}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {club.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={club.address}>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1 flex-shrink-0" />
                          <span className="truncate">{club.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <span>{club.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current mr-1" />
                          <span>{club.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({club.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getVerificationStatusBadge(club.verificationStatus)}
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
                                // Rediriger vers la page de détail du club
                                window.open(`/club/${club.id}`, '_blank');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span>Voir le profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                // Rediriger vers le formulaire de modification
                                alert(`Redirection vers le formulaire de modification pour ${club.name}`);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            {club.verificationStatus === "pending" && (
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer text-green-600"
                                onClick={() => handleVerifyClub(club.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span>Vérifier</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer text-destructive"
                              onClick={() => {
                                setSelectedClub(club);
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
              Êtes-vous sûr de vouloir supprimer le club "{selectedClub?.name}" ? Cette action est irréversible.
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
                if (selectedClub) {
                  handleDeleteClub(selectedClub.id);
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