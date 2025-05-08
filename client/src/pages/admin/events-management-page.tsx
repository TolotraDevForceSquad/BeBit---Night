import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Calendar, Search, Filter, MoreHorizontal, MapPin, 
  Clock, Users, Music, Building, ArrowUpDown, CheckCircle, 
  XCircle, Eye, Edit, Trash2, AlertTriangle, X, Star
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import PartyLoader from "@/components/PartyLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Types pour les événements
type Event = {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  date: string;
  endDate?: string;
  venue: string;
  location: string;
  category: string;
  ticket_price: number;
  organizer: {
    id: number;
    name: string;
    type: "club" | "artist" | "user";
    avatar?: string;
  };
  artists: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  status: "upcoming" | "live" | "completed" | "cancelled" | "reported";
  attendees: number;
  maxAttendees?: number;
  isFeatured: boolean;
  hasTicketsAvailable: boolean;
  hasTableReservation: boolean;
  createdAt: string;
};

export default function EventsManagementPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Liste des catégories d'événements
  const categories = [
    "Soirée", "Concert", "Festival", "DJ Set", "Live", "After-work", 
    "Événement privé", "Beach Party", "Showcase"
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      // Données simulées pour les événements
      const mockEvents: Event[] = [
        {
          id: 1,
          title: "Tropical House Night",
          description: "Une soirée exceptionnelle avec les meilleurs DJ House de la ville. Ambiance tropicale garantie!",
          thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=180&fit=crop",
          date: "2025-05-10T20:00:00",
          endDate: "2025-05-11T03:00:00",
          venue: "Club Oxygen",
          location: "Antananarivo",
          category: "DJ Set",
          ticket_price: 25000,
          organizer: {
            id: 101,
            name: "Club Oxygen",
            type: "club",
            avatar: "https://images.unsplash.com/photo-1583244685026-d4ddf6338ba1?w=48&h=48&fit=crop"
          },
          artists: [
            {
              id: 201,
              name: "DJ Elektra",
              avatar: "https://images.unsplash.com/photo-1594077412701-1ea2e7e4e0c5?w=48&h=48&fit=crop"
            }
          ],
          status: "upcoming",
          attendees: 187,
          maxAttendees: 300,
          isFeatured: true,
          hasTicketsAvailable: true,
          hasTableReservation: true,
          createdAt: "2025-04-15T14:23:00"
        },
        {
          id: 2,
          title: "Beach Wave Festival",
          description: "Le plus grand festival de musique électronique sur la plage de Tamatave. Trois jours de musique non-stop!",
          thumbnail: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=180&fit=crop",
          date: "2025-05-15T14:00:00",
          endDate: "2025-05-17T23:59:00",
          venue: "Plage de Tamatave",
          location: "Tamatave",
          category: "Festival",
          ticket_price: 75000,
          organizer: {
            id: 102,
            name: "Wave Productions",
            type: "user",
            avatar: undefined
          },
          artists: [
            {
              id: 201,
              name: "DJ Elektra",
              avatar: "https://images.unsplash.com/photo-1594077412701-1ea2e7e4e0c5?w=48&h=48&fit=crop"
            },
            {
              id: 202,
              name: "DJ Metro",
              avatar: "https://images.unsplash.com/photo-1516122415324-fb05fbd90bde?w=48&h=48&fit=crop"
            },
            {
              id: 203,
              name: "Sarah Beats",
              avatar: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=48&h=48&fit=crop"
            }
          ],
          status: "upcoming",
          attendees: 543,
          maxAttendees: 2000,
          isFeatured: true,
          hasTicketsAvailable: true,
          hasTableReservation: false,
          createdAt: "2025-03-20T09:45:00"
        },
        {
          id: 3,
          title: "Urban Beats Party",
          description: "Une soirée dédiée au hip-hop et R&B avec les meilleurs DJ de la ville.",
          thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=180&fit=crop",
          date: "2025-05-17T21:30:00",
          endDate: "2025-05-18T04:00:00",
          venue: "Club District",
          location: "Antananarivo",
          category: "Soirée",
          ticket_price: 20000,
          organizer: {
            id: 103,
            name: "Club District",
            type: "club",
            avatar: "https://images.unsplash.com/photo-1602513142546-7226e3e609ff?w=48&h=48&fit=crop"
          },
          artists: [
            {
              id: 203,
              name: "Sarah Beats",
              avatar: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=48&h=48&fit=crop"
            }
          ],
          status: "upcoming",
          attendees: 129,
          maxAttendees: 250,
          isFeatured: false,
          hasTicketsAvailable: true,
          hasTableReservation: true,
          createdAt: "2025-04-30T18:12:00"
        },
        {
          id: 4,
          title: "Jazz & Soul Night",
          description: "Une soirée relaxante avec la meilleure musique jazz et soul en live.",
          date: "2025-05-20T19:00:00",
          endDate: "2025-05-20T23:00:00",
          venue: "Le Lounge",
          location: "Antananarivo",
          category: "Live",
          ticket_price: 35000,
          organizer: {
            id: 104,
            name: "Le Lounge",
            type: "club"
          },
          artists: [
            {
              id: 204,
              name: "Nina Jazz Quartet"
            }
          ],
          status: "upcoming",
          attendees: 75,
          maxAttendees: 100,
          isFeatured: false,
          hasTicketsAvailable: true,
          hasTableReservation: false,
          createdAt: "2025-05-01T10:15:00"
        },
        {
          id: 5,
          title: "Afterwork Chill",
          description: "Venez vous détendre après une journée de travail avec de la bonne musique et des cocktails.",
          thumbnail: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300&h=180&fit=crop",
          date: "2025-05-09T17:00:00",
          endDate: "2025-05-09T22:00:00",
          venue: "Sky Bar",
          location: "Antananarivo",
          category: "After-work",
          ticket_price: 15000,
          organizer: {
            id: 105,
            name: "Sky Bar",
            type: "club",
            avatar: "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=48&h=48&fit=crop"
          },
          artists: [
            {
              id: 205,
              name: "DJ Smooth",
              avatar: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=48&h=48&fit=crop"
            }
          ],
          status: "completed",
          attendees: 95,
          maxAttendees: 120,
          isFeatured: false,
          hasTicketsAvailable: false,
          hasTableReservation: true,
          createdAt: "2025-04-25T14:20:00"
        },
        {
          id: 6,
          title: "Summer Beach Party",
          description: "Fête sur la plage avec DJ internationaux et animations.",
          thumbnail: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=300&h=180&fit=crop",
          date: "2025-06-15T15:00:00",
          endDate: "2025-06-15T23:59:00",
          venue: "Plage d'Ambondrona",
          location: "Majunga",
          category: "Beach Party",
          ticket_price: 40000,
          organizer: {
            id: 106,
            name: "Beach Events",
            type: "user"
          },
          artists: [
            {
              id: 202,
              name: "DJ Metro",
              avatar: "https://images.unsplash.com/photo-1516122415324-fb05fbd90bde?w=48&h=48&fit=crop"
            }
          ],
          status: "cancelled",
          attendees: 0,
          maxAttendees: 500,
          isFeatured: false,
          hasTicketsAvailable: false,
          hasTableReservation: false,
          createdAt: "2025-05-01T09:30:00"
        },
        {
          id: 7,
          title: "Reggae Vibes Concert",
          description: "Concert de reggae avec les meilleurs groupes locaux et internationaux.",
          thumbnail: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=300&h=180&fit=crop",
          date: "2025-05-25T19:00:00",
          endDate: "2025-05-25T23:30:00",
          venue: "Stade Mahamasina",
          location: "Antananarivo",
          category: "Concert",
          ticket_price: 30000,
          organizer: {
            id: 107,
            name: "Lion Productions",
            type: "user"
          },
          artists: [
            {
              id: 206,
              name: "Reggae Lions",
              avatar: "https://images.unsplash.com/photo-1496386273169-2de3ecb9b2a3?w=48&h=48&fit=crop"
            }
          ],
          status: "reported",
          attendees: 250,
          maxAttendees: 5000,
          isFeatured: false,
          hasTicketsAvailable: true,
          hasTableReservation: false,
          createdAt: "2025-04-10T11:45:00"
        }
      ];

      setEvents(mockEvents);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour filtrer les événements
  const getFilteredEvents = () => {
    return events.filter(event => {
      // Filtre par recherche
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        event.status === statusFilter;
      
      // Filtre par catégorie
      const matchesCategory = 
        categoryFilter === "all" || 
        event.category.toLowerCase() === categoryFilter.toLowerCase();
      
      // Filtre par onglet
      const matchesTab = 
        (activeTab === "all") ||
        (activeTab === "upcoming" && event.status === "upcoming") ||
        (activeTab === "completed" && event.status === "completed") ||
        (activeTab === "cancelled" && event.status === "cancelled") ||
        (activeTab === "reported" && event.status === "reported") ||
        (activeTab === "featured" && event.isFeatured);
      
      return matchesSearch && matchesStatus && matchesCategory && matchesTab;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "attendees") {
        return sortOrder === "asc" 
          ? a.attendees - b.attendees
          : b.attendees - a.attendees;
      } else if (sortBy === "price") {
        return sortOrder === "asc" 
          ? a.ticket_price - b.ticket_price
          : b.ticket_price - a.ticket_price;
      }
      return 0;
    });
  };

  // Obtenir les événements filtrés et triés
  const filteredEvents = getFilteredEvents();

  // Fonctions pour les actions sur les événements
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    // Action d'édition (ouvrir un dialog d'édition)
    toast({
      title: "Modification d'événement",
      description: `L'édition de ${event.title} n'est pas implémentée dans cette version.`
    });
  };

  const handleDeleteEvent = (event: Event) => {
    // Action de suppression (demander confirmation)
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement ${event.title} ?`)) {
      toast({
        title: "Événement supprimé",
        description: `${event.title} a été supprimé avec succès.`
      });
      // Simuler la suppression
      setEvents(events.filter(e => e.id !== event.id));
    }
  };

  const handleToggleFeatured = (event: Event) => {
    toast({
      title: event.isFeatured ? "Événement retiré des favoris" : "Événement mis en avant",
      description: event.isFeatured 
        ? `${event.title} a été retiré des événements en vedette.`
        : `${event.title} a été ajouté aux événements en vedette.`
    });
    // Simuler le changement
    setEvents(events.map(e => 
      e.id === event.id ? { ...e, isFeatured: !e.isFeatured } : e
    ));
  };

  const handleApproveEvent = (event: Event) => {
    if (event.status === "reported") {
      toast({
        title: "Événement approuvé",
        description: `${event.title} a été vérifié et approuvé.`
      });
      // Simuler l'approbation
      setEvents(events.map(e => 
        e.id === event.id ? { ...e, status: "upcoming" as const } : e
      ));
    }
  };

  const handleCancelEvent = (event: Event) => {
    toast({
      title: "Événement annulé",
      description: `${event.title} a été annulé.`,
      variant: "destructive"
    });
    // Simuler l'annulation
    setEvents(events.map(e => 
      e.id === event.id ? { ...e, status: "cancelled" as const } : e
    ));
  };

  // Obtenir le statut formaté pour affichage
  const getStatusDisplay = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return { label: "À venir", color: "bg-blue-100 text-blue-600 border-blue-200" };
      case "live":
        return { label: "En cours", color: "bg-green-100 text-green-600 border-green-200" };
      case "completed":
        return { label: "Terminé", color: "bg-gray-100 text-gray-600 border-gray-200" };
      case "cancelled":
        return { label: "Annulé", color: "bg-red-100 text-red-600 border-red-200" };
      case "reported":
        return { label: "Signalé", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
      default:
        return { label: status, color: "" };
    }
  };

  // Calculer les statistiques d'événements
  const getEventStats = () => {
    return {
      total: events.length,
      upcoming: events.filter(e => e.status === "upcoming").length,
      live: events.filter(e => e.status === "live").length,
      completed: events.filter(e => e.status === "completed").length,
      cancelled: events.filter(e => e.status === "cancelled").length,
      reported: events.filter(e => e.status === "reported").length,
      featured: events.filter(e => e.isFeatured).length,
      withTableReservation: events.filter(e => e.hasTableReservation).length,
      totalTicketsSold: events.reduce((sum, event) => sum + event.attendees, 0),
      totalRevenue: events.reduce((sum, event) => sum + (event.attendees * event.ticket_price), 0),
    };
  };

  const stats = getEventStats();

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
              <h1 className="text-3xl font-bold">Gestion des Événements</h1>
              <p className="text-muted-foreground">
                Gérez et surveillez tous les événements de la plateforme Be bit.
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button onClick={() => setLocation("/admin")}>
                Retour au Dashboard
              </Button>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.upcoming} à venir · {stats.reported} signalés
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billets vendus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTicketsSold}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur tous les événements
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} Ar</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Commissions: {(stats.totalRevenue * 0.1).toLocaleString()} Ar
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tables réservées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.withTableReservation}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Événements avec réservation de tables
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-2/3">
              <TabsTrigger value="all">
                Tous <Badge className="ml-1">{stats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                À venir <Badge className="ml-1">{stats.upcoming}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminés <Badge className="ml-1">{stats.completed}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Annulés <Badge variant="destructive" className="ml-1">{stats.cancelled}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reported">
                Signalés <Badge className="ml-1 bg-yellow-500">{stats.reported}</Badge>
              </TabsTrigger>
              <TabsTrigger value="featured">
                En vedette <Badge className="ml-1 bg-purple-500">{stats.featured}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Liste des événements</CardTitle>
                <CardDescription>
                  {filteredEvents.length} événements correspondent à vos critères
                </CardDescription>
                
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par titre, lieu, organisateur..."
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
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="live">En cours</SelectItem>
                        <SelectItem value="completed">Terminés</SelectItem>
                        <SelectItem value="cancelled">Annulés</SelectItem>
                        <SelectItem value="reported">Signalés</SelectItem>
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
                          setSortBy("title");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Événement
                          {sortBy === "title" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => {
                          setSortBy("date");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Date
                          {sortBy === "date" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Organisateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end cursor-pointer" onClick={() => {
                          setSortBy("attendees");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Participants
                          {sortBy === "attendees" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end cursor-pointer" onClick={() => {
                          setSortBy("price");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Prix
                          {sortBy === "price" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">Aucun événement trouvé</p>
                            <p className="text-sm text-muted-foreground">
                              Modifiez vos filtres ou essayez une autre recherche
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event, index) => (
                        <TableRow key={event.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                {event.thumbnail ? (
                                  <img src={event.thumbnail} alt={event.title} className="h-full w-full object-cover" />
                                ) : (
                                  <Calendar className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {event.title}
                                  {event.isFeatured && (
                                    <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-600 border-purple-200">
                                      En vedette
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{event.category}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <div>
                                <div className="text-sm">
                                  {format(new Date(event.date), "dd MMM yyyy", { locale: fr })}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(event.date), "HH:mm", { locale: fr })}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <div>
                                <div className="text-sm">{event.venue}</div>
                                <div className="text-xs text-muted-foreground">{event.location}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={event.organizer.avatar} />
                                <AvatarFallback className="text-xs">
                                  {event.organizer.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                {event.organizer.name}
                                <span className="ml-1 text-xs text-muted-foreground">
                                  ({event.organizer.type === "club" ? "Club" : 
                                    event.organizer.type === "artist" ? "Artiste" : "Utilisateur"})
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusDisplay(event.status).color}>
                              {getStatusDisplay(event.status).label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <span className="font-medium">{event.attendees}</span>
                              {event.maxAttendees && (
                                <span className="text-xs text-muted-foreground">/{event.maxAttendees}</span>
                              )}
                            </div>
                            {event.maxAttendees && (
                              <Progress 
                                value={(event.attendees / event.maxAttendees) * 100} 
                                className="h-1 mt-1" 
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {event.ticket_price.toLocaleString()} Ar
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
                                  <DropdownMenuItem onClick={() => handleViewEvent(event)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>Voir les détails</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Modifier</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(event)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    <span>
                                      {event.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  {event.status === "reported" && (
                                    <DropdownMenuItem onClick={() => handleApproveEvent(event)}>
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      <span>Approuver</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {event.status === "upcoming" && (
                                    <DropdownMenuItem onClick={() => handleCancelEvent(event)}>
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      <span>Annuler</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteEvent(event)}
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
                  Affichage de {filteredEvents.length} événements sur {events.length} au total
                </div>
                {filteredEvents.length > 0 && (
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

      {/* Dialogue de détails d'événement */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de l'événement</DialogTitle>
                <DialogDescription>
                  Informations complètes sur l'événement
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="flex flex-col items-center">
                  <div className="w-full h-40 rounded-md overflow-hidden bg-muted mb-4">
                    {selectedEvent.thumbnail ? (
                      <img 
                        src={selectedEvent.thumbnail} 
                        alt={selectedEvent.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Calendar className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                    <div className="flex items-center justify-center mt-1">
                      <Badge className="mr-2">{selectedEvent.category}</Badge>
                      <Badge className={getStatusDisplay(selectedEvent.status).color}>
                        {getStatusDisplay(selectedEvent.status).label}
                      </Badge>
                      {selectedEvent.isFeatured && (
                        <Badge className="ml-2 bg-purple-100 text-purple-600 border-purple-200">
                          En vedette
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm font-medium">Date et heure</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(selectedEvent.date), "dd MMMM yyyy", { locale: fr })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(selectedEvent.date), "HH:mm", { locale: fr })} 
                            {selectedEvent.endDate && (
                              <> - {format(new Date(selectedEvent.endDate), "HH:mm", { locale: fr })}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm font-medium">Lieu</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{selectedEvent.venue}</div>
                          <div className="text-sm text-muted-foreground">{selectedEvent.location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm font-medium">Billetterie</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {selectedEvent.attendees} participants
                            {selectedEvent.maxAttendees && (
                              <span> / {selectedEvent.maxAttendees}</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedEvent.ticket_price.toLocaleString()} Ar par billet
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedEvent.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">Organisateur</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedEvent.organizer.avatar} />
                        <AvatarFallback>
                          {selectedEvent.organizer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedEvent.organizer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedEvent.organizer.type === "club" ? "Club" : 
                           selectedEvent.organizer.type === "artist" ? "Artiste" : "Utilisateur"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Options disponibles</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Badge variant={selectedEvent.hasTicketsAvailable ? "default" : "outline"} className="mr-2">
                            {selectedEvent.hasTicketsAvailable ? "Places disponibles" : "Complet"}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={selectedEvent.hasTableReservation ? "default" : "outline"} className="mr-2">
                            {selectedEvent.hasTableReservation ? "Tables réservables" : "Pas de réservation de table"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Artistes ({selectedEvent.artists.length})</h3>
                    <div className="space-y-3">
                      {selectedEvent.artists.map(artist => (
                        <div key={artist.id} className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={artist.avatar} />
                            <AvatarFallback>
                              {artist.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{artist.name}</div>
                        </div>
                      ))}
                      {selectedEvent.artists.length === 0 && (
                        <p className="text-muted-foreground">Aucun artiste spécifié</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Informations de création</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>ID: {selectedEvent.id}</p>
                        <p>Créé le: {format(new Date(selectedEvent.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedEvent.status === "reported" && (
                  <Button 
                    onClick={() => {
                      handleApproveEvent(selectedEvent);
                      setIsEventDetailsOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver cet événement
                  </Button>
                )}
                
                {selectedEvent.status === "upcoming" && (
                  <Button 
                    onClick={() => {
                      handleCancelEvent(selectedEvent);
                      setIsEventDetailsOpen(false);
                    }}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Annuler l'événement
                  </Button>
                )}
                
                <Button 
                  onClick={() => handleToggleFeatured(selectedEvent)}
                  variant="outline" 
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedEvent.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
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