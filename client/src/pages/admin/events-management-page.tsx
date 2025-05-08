import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, Search, Plus, Calendar, Star, Eye, Edit, Trash2,
  CheckCircle, XCircle, Filter, RefreshCw, Download, MoreHorizontal,
  MapPin, Clock, Building, Users, Ticket
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
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

// Types pour la gestion des événements
type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  coverImage?: string;
  venueName: string;
  clubId: number;
  price: number;
  maxCapacity: number;
  ticketsSold: number;
  artists: string[];
  dateCreated: string;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  approvalStatus: "approved" | "pending" | "rejected";
};

// Données fictives des événements
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Soirée Techno avec DJ Elektra",
    category: "Techno",
    date: "2023-12-15",
    startTime: "22:00",
    endTime: "05:00",
    coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=200&h=100&fit=crop",
    venueName: "Club Oxygen",
    clubId: 1,
    price: 25,
    maxCapacity: 200,
    ticketsSold: 142,
    artists: ["DJ Elektra", "MC Blaze"],
    dateCreated: "2023-10-15T12:30:00",
    status: "upcoming",
    approvalStatus: "approved"
  },
  {
    id: 2,
    title: "House Party Weekend",
    category: "House",
    date: "2023-12-22",
    startTime: "22:00",
    endTime: "04:00",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=100&fit=crop",
    venueName: "Le Bunker",
    clubId: 2,
    price: 20,
    maxCapacity: 250,
    ticketsSold: 98,
    artists: ["Luna Ray", "BeatMaster"],
    dateCreated: "2023-10-20T09:45:00",
    status: "upcoming",
    approvalStatus: "approved"
  },
  {
    id: 3,
    title: "Nuit Électro",
    category: "Électro",
    date: "2023-11-25",
    startTime: "22:00",
    endTime: "06:00",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=100&fit=crop",
    venueName: "Warehouse",
    clubId: 3,
    price: 15,
    maxCapacity: 500,
    ticketsSold: 500,
    artists: ["BeatMaster"],
    dateCreated: "2023-10-25T14:20:00",
    status: "past",
    approvalStatus: "approved"
  },
  {
    id: 4,
    title: "Festival Nouvel An",
    category: "Festival",
    date: "2023-12-31",
    startTime: "22:00",
    endTime: "08:00",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=100&fit=crop",
    venueName: "Parc d'Exposition",
    clubId: 2,
    price: 45,
    maxCapacity: 2000,
    ticketsSold: 850,
    artists: ["DJ Elektra", "Luna Ray", "MC Blaze", "BeatMaster"],
    dateCreated: "2023-11-05T10:15:00",
    status: "upcoming",
    approvalStatus: "pending"
  },
  {
    id: 5,
    title: "Underground Bass Night",
    category: "Drum & Bass",
    date: "2023-11-18",
    startTime: "23:00",
    endTime: "05:00",
    coverImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=200&h=100&fit=crop",
    venueName: "Loft 21",
    clubId: 4,
    price: 12,
    maxCapacity: 150,
    ticketsSold: 130,
    artists: ["MC Blaze", "DJ Elektra"],
    dateCreated: "2023-11-01T11:30:00",
    status: "past",
    approvalStatus: "approved"
  }
];

// Fonctions d'aide
function getStatusBadge(status: string) {
  switch (status) {
    case "upcoming":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/25 flex gap-1 items-center">
          <Calendar className="h-3 w-3" />
          <span>À venir</span>
        </Badge>
      );
    case "ongoing":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/25 flex gap-1 items-center">
          <Clock className="h-3 w-3" />
          <span>En cours</span>
        </Badge>
      );
    case "past":
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/25 flex gap-1 items-center">
          <Clock className="h-3 w-3" />
          <span>Terminé</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/25 flex gap-1 items-center">
          <XCircle className="h-3 w-3" />
          <span>Annulé</span>
        </Badge>
      );
    default:
      return null;
  }
}

function getApprovalStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/25 flex gap-1 items-center">
          <CheckCircle className="h-3 w-3" />
          <span>Approuvé</span>
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
export default function EventsManagementPage() {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Obtenir toutes les catégories uniques
  const allCategories = Array.from(
    new Set(events.map(event => event.category))
  ).sort();

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery 
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artists.some(artist => artist.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesCategory = categoryFilter === "all" 
      ? true 
      : event.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : event.status === statusFilter || event.approvalStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Gérer la suppression d'un événement
  const handleDeleteEvent = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setEvents(prev => prev.filter(event => event.id !== id));
    setShowDeleteDialog(false);
  };

  // Gérer l'approbation d'un événement
  const handleApproveEvent = (id: number) => {
    // Implémentation à venir (API call, etc.)
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, approvalStatus: "approved" } 
          : event
      )
    );
  };

  // Calculer les statistiques des événements
  const eventStats = {
    total: events.length,
    upcoming: events.filter(e => e.status === "upcoming").length,
    past: events.filter(e => e.status === "past").length,
    ticketsSold: events.reduce((sum, e) => sum + e.ticketsSold, 0),
    revenue: events.reduce((sum, e) => sum + (e.price * e.ticketsSold), 0)
  };

  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Gestion des Événements</span>
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
      <ResponsiveLayout headerContent={headerContent} activeItem="événements">
        <LoadingSpinner message="Chargement des événements..." />
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout headerContent={headerContent} activeItem="événements">
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Total Événements
                </div>
                <div className="text-2xl font-bold">{eventStats.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  À venir
                </div>
                <div className="text-2xl font-bold">{eventStats.upcoming}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-gray-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Passés
                </div>
                <div className="text-2xl font-bold">{eventStats.past}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Ticket className="h-8 w-8 text-indigo-500 mb-2" />
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Tickets Vendus
                </div>
                <div className="text-2xl font-bold">{eventStats.ticketsSold.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold mb-1">€</div>
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  Revenus
                </div>
                <div className="text-2xl font-bold">{eventStats.revenue.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par titre, lieu, artiste..."
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
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="ongoing">En cours</SelectItem>
                <SelectItem value="past">Terminés</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" title="Rafraîchir" onClick={() => {
              // Implémentation à venir (API call, etc.)
              setIsLoading(true);
              setTimeout(() => {
                setEvents(mockEvents);
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
            <h2 className="text-xl font-semibold">Liste des événements</h2>
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} événement(s) trouvé(s)
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
                alert("Redirection vers le formulaire d'ajout d'événement");
              }}
            >
              <Plus className="h-4 w-4" />
              Ajouter un événement
            </Button>
          </div>
        </div>
        
        {/* Tableau des événements */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Événement</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Aucun événement trouvé correspondant aux critères
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map(event => (
                    <TableRow key={event.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div 
                            className="h-10 w-16 rounded bg-cover bg-center mr-3 flex-shrink-0"
                            style={{ backgroundImage: `url(${event.coverImage})` }}
                          />
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {event.artists.join(", ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-3.5 w-3.5 text-muted-foreground mr-1.5 flex-shrink-0" />
                          <span>{event.venueName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{format(new Date(event.date), "dd/MM/yyyy", { locale: fr })}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{event.ticketsSold}</span>
                            <span className="text-muted-foreground">/{event.maxCapacity}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({Math.round((event.ticketsSold / event.maxCapacity) * 100)}%)
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(event.ticketsSold / event.maxCapacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          {getStatusBadge(event.status)}
                          {getApprovalStatusBadge(event.approvalStatus)}
                        </div>
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
                                // Rediriger vers la page de détail de l'événement
                                window.open(`/event/${event.id}`, '_blank');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span>Voir le détail</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer"
                              onClick={() => {
                                // Rediriger vers le formulaire de modification
                                alert(`Redirection vers le formulaire de modification pour ${event.title}`);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            {event.approvalStatus === "pending" && (
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer text-green-600"
                                onClick={() => handleApproveEvent(event.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span>Approuver</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="flex items-center cursor-pointer text-destructive"
                              onClick={() => {
                                setSelectedEvent(event);
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
              Êtes-vous sûr de vouloir supprimer l'événement "{selectedEvent?.title}" ? Cette action est irréversible.
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
                if (selectedEvent) {
                  handleDeleteEvent(selectedEvent.id);
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