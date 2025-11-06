import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  CalendarCheck, Users, Clock, BadgeCheck, X, Filter, Search, 
  ChevronDown, MoreHorizontal, Calendar as CalendarIcon,
  CheckCircle, XCircle, AlertCircle, MessageSquare, Eye, Calendar
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Type pour les réservations
type Reservation = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guestCount: number;
  tableArea: string;
  tableAreaName: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  specialRequests?: string;
  amount: number;
  depositPaid: boolean;
  createdAt: string;
  customerAvatar?: string;
};

// Type pour les statistiques de réservation
type ReservationStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: {
    today: number;
    weekly: number;
    monthly: number;
  };
  tableAreaStats: {
    name: string;
    count: number;
    percentage: number;
  }[];
};

// Données fictives pour les réservations
const mockReservations: Reservation[] = [
  {
    id: 1,
    customerName: "Jean Rabarifaly",
    customerEmail: "jean.raba@gmail.com",
    customerPhone: "034 12 345 67",
    date: "2025-05-10",
    time: "21:00",
    guestCount: 6,
    tableArea: "vip",
    tableAreaName: "Espace VIP",
    status: "confirmed",
    specialRequests: "Je voudrais une table proche de la scène si possible.",
    amount: 250000,
    depositPaid: true,
    createdAt: "2025-05-05T14:23:45",
    customerAvatar: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    id: 2,
    customerName: "Sophie Randria",
    customerEmail: "sophie.r@yahoo.fr",
    customerPhone: "033 98 765 43",
    date: "2025-05-08",
    time: "22:30",
    guestCount: 4,
    tableArea: "standard",
    tableAreaName: "Table Standard",
    status: "pending",
    amount: 100000,
    depositPaid: false,
    createdAt: "2025-05-07T09:12:33"
  },
  {
    id: 3,
    customerName: "Tahiana Rakoto",
    customerEmail: "tahiana@outlook.com",
    customerPhone: "032 45 678 90",
    date: "2025-05-07",
    time: "20:00",
    guestCount: 10,
    tableArea: "booth",
    tableAreaName: "Booth Privé",
    status: "completed",
    specialRequests: "Anniversaire de mon ami, pourriez-vous préparer une surprise?",
    amount: 350000,
    depositPaid: true,
    createdAt: "2025-05-01T18:45:12",
    customerAvatar: "https://randomuser.me/api/portraits/men/36.jpg"
  },
  {
    id: 4,
    customerName: "Emma Razafy",
    customerEmail: "emma.razafy@gmail.com",
    customerPhone: "034 56 789 01",
    date: "2025-05-09",
    time: "23:00",
    guestCount: 8,
    tableArea: "booth",
    tableAreaName: "Booth Privé",
    status: "cancelled",
    amount: 350000,
    depositPaid: true,
    createdAt: "2025-05-02T10:33:21",
    customerAvatar: "https://randomuser.me/api/portraits/women/24.jpg"
  },
  {
    id: 5,
    customerName: "Rija Andria",
    customerEmail: "rija.andria@gmail.com",
    customerPhone: "033 12 345 67",
    date: "2025-05-06",
    time: "21:30",
    guestCount: 15,
    tableArea: "mezzanine",
    tableAreaName: "Mezzanine Premium",
    status: "no_show",
    amount: 500000,
    depositPaid: true,
    createdAt: "2025-04-30T15:20:45"
  },
  {
    id: 6,
    customerName: "Nathalie Ratsara",
    customerEmail: "nath.ratsara@yahoo.fr",
    customerPhone: "032 98 765 43",
    date: "2025-05-12",
    time: "20:30",
    guestCount: 6,
    tableArea: "vip",
    tableAreaName: "Espace VIP",
    status: "confirmed",
    amount: 250000,
    depositPaid: true,
    createdAt: "2025-05-07T11:17:38",
    customerAvatar: "https://randomuser.me/api/portraits/women/42.jpg"
  },
  {
    id: 7,
    customerName: "Patrick Rakotobe",
    customerEmail: "patrick.r@gmail.com",
    customerPhone: "034 67 890 12",
    date: "2025-05-13",
    time: "22:00",
    guestCount: 5,
    tableArea: "standard",
    tableAreaName: "Table Standard",
    status: "pending",
    specialRequests: "C'est la première fois que nous venons, nous aimerions avoir une bonne vue sur le DJ.",
    amount: 100000,
    depositPaid: false,
    createdAt: "2025-05-07T14:05:29"
  },
  {
    id: 8,
    customerName: "Léa Rajaonarison",
    customerEmail: "lea.raja@outlook.com",
    customerPhone: "033 45 678 90",
    date: "2025-05-14",
    time: "21:00",
    guestCount: 12,
    tableArea: "mezzanine",
    tableAreaName: "Mezzanine Premium",
    status: "confirmed",
    amount: 500000,
    depositPaid: true,
    createdAt: "2025-05-06T09:23:51",
    customerAvatar: "https://randomuser.me/api/portraits/women/29.jpg"
  }
];

// Statistiques fictives pour le tableau de bord
const mockStats: ReservationStats = {
  total: 42,
  pending: 7,
  confirmed: 15,
  completed: 12,
  cancelled: 5,
  noShow: 3,
  revenue: {
    today: 750000,
    weekly: 3250000,
    monthly: 12500000
  },
  tableAreaStats: [
    { name: "VIP", count: 18, percentage: 43 },
    { name: "Standard", count: 10, percentage: 24 },
    { name: "Booth", count: 8, percentage: 19 },
    { name: "Mezzanine", count: 6, percentage: 14 }
  ]
};

// Mapper les statuts pour l'affichage
const statusMap = {
  pending: { label: "En attente", color: "bg-yellow-500", icon: AlertCircle },
  confirmed: { label: "Confirmée", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: XCircle },
  completed: { label: "Terminée", color: "bg-blue-500", icon: BadgeCheck },
  no_show: { label: "Non présenté", color: "bg-gray-500", icon: X }
};

// Fonction pour formater la date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "EEEE d MMMM yyyy", { locale: fr });
}

// Composant principal
export default function ManageReservationsPage() {
  const [, setLocation] = useLocation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  
  // Charger les données
  useEffect(() => {
    // Chargement immédiat sans délai artificiel
    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
    setStats(mockStats);
    setIsLoading(false);
  }, []);
  
  // Filtrer les réservations quand les filtres changent
  useEffect(() => {
    let result = [...reservations];
    
    // Filtre par statut
    if (statusFilter !== "all") {
      result = result.filter(res => res.status === statusFilter);
    }
    
    // Filtre par date
    if (dateFilter) {
      result = result.filter(res => {
        const resDate = new Date(res.date);
        return isSameDay(resDate, dateFilter);
      });
    }
    
    // Filtre par recherche (nom, email ou téléphone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        res => res.customerName.toLowerCase().includes(query) ||
               res.customerEmail.toLowerCase().includes(query) ||
               res.customerPhone.includes(query)
      );
    }
    
    setFilteredReservations(result);
  }, [statusFilter, dateFilter, searchQuery, reservations]);
  
  // Gérer le changement de statut d'une réservation
  const handleStatusChange = (id: number, newStatus: Reservation["status"]) => {
    const updatedReservations = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    );
    
    setReservations(updatedReservations);
    
    // Afficher une confirmation
    toast({
      title: "Statut mis à jour",
      description: `La réservation a été marquée comme "${statusMap[newStatus].label}"`,
      variant: "default",
    });
  };
  
  // Gérer l'envoi d'un message
  const handleSendMessage = () => {
    if (!selectedReservation || !message.trim()) return;
    
    // Simuler l'envoi d'un message
    toast({
      title: "Message envoyé",
      description: `Votre message a été envoyé à ${selectedReservation.customerName}`,
      variant: "default",
    });
    
    setMessage("");
    setMessageOpen(false);
  };
  
  // Contenu de l'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Gestion des réservations</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <CalendarCheck className="h-3 w-3 mr-1" />
          <span>Réservations</span>
        </Badge>
        
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://images.unsplash.com/photo-1559329255-2e7cb6866d5f?w=100&h=100&fit=crop" alt="Club Oxygen" />
          <AvatarFallback>CO</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
  
  // Si les données sont en cours de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <ResponsiveLayout
      activeItem="reservations"
      headerContent={headerContent}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne principale */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Réservations de tables</CardTitle>
                    <CardDescription>
                      Gérez les réservations de tables pour votre établissement
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setStatusFilter("all");
                        setDateFilter(undefined);
                        setSearchQuery("");
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span>Réinitialiser</span>
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "gap-1",
                            dateFilter ? "text-primary border-primary" : ""
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          <span>{dateFilter 
                            ? format(dateFilter, "d MMM", { locale: fr })
                            : "Date"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={dateFilter}
                          onSelect={setDateFilter}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  {/* Barre de recherche */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, email ou téléphone..."
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Filtre par statut */}
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Tous les statuts" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmées</SelectItem>
                      <SelectItem value="completed">Terminées</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                      <SelectItem value="no_show">Non présentés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Aucune réservation trouvée</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      {searchQuery || statusFilter !== "all" || dateFilter
                        ? "Essayez de modifier vos filtres pour voir plus de résultats."
                        : "Vous n'avez pas encore reçu de réservations."}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter("all");
                        setDateFilter(undefined);
                        setSearchQuery("");
                      }}
                    >
                      Afficher toutes les réservations
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Date et heure</TableHead>
                          <TableHead>Personnes</TableHead>
                          <TableHead>Zone</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservations.map(reservation => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={reservation.customerAvatar} />
                                  <AvatarFallback>{reservation.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{reservation.customerName}</div>
                                  <div className="text-xs text-muted-foreground">{reservation.customerPhone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{formatDate(reservation.date)}</div>
                              <div className="text-xs text-muted-foreground">{reservation.time}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{reservation.guestCount}</span>
                              </div>
                            </TableCell>
                            <TableCell>{reservation.tableAreaName}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "flex items-center gap-1 text-white",
                                  statusMap[reservation.status].color
                                )}
                              >
                                {React.createElement(statusMap[reservation.status].icon, { className: "h-3 w-3" })}
                                <span>{statusMap[reservation.status].label}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(reservation.amount).replace('MGA', 'Ar')}
                              </div>
                              <div className="text-xs">
                                {reservation.depositPaid ? (
                                  <span className="text-green-600">Acompte payé</span>
                                ) : (
                                  <span className="text-amber-600">En attente de paiement</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedReservation(reservation);
                                      setDetailsOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedReservation(reservation);
                                      setMessageOpen(true);
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contacter le client
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                                  {reservation.status !== "confirmed" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(reservation.id, "confirmed")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      Confirmer
                                    </DropdownMenuItem>
                                  )}
                                  {reservation.status !== "completed" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(reservation.id, "completed")}
                                    >
                                      <BadgeCheck className="h-4 w-4 mr-2 text-blue-500" />
                                      Marquer comme terminée
                                    </DropdownMenuItem>
                                  )}
                                  {reservation.status !== "cancelled" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(reservation.id, "cancelled")}
                                    >
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      Annuler
                                    </DropdownMenuItem>
                                  )}
                                  {reservation.status !== "no_show" && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(reservation.id, "no_show")}
                                    >
                                      <X className="h-4 w-4 mr-2 text-gray-500" />
                                      Marquer comme non présenté
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredReservations.length} sur {reservations.length} réservations
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Exporter</Button>
                  <Button variant="outline" size="sm">Imprimer</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Colonne latérale avec les statistiques */}
          <div className="lg:w-1/3 space-y-6">
            {/* Statistiques générales */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des réservations</CardTitle>
                <CardDescription>Statistiques de vos réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Total</div>
                    <div className="text-2xl font-bold">{stats?.total}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">En attente</div>
                    <div className="text-2xl font-bold text-yellow-500">{stats?.pending}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Confirmées</div>
                    <div className="text-2xl font-bold text-green-500">{stats?.confirmed}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">Annulées</div>
                    <div className="text-2xl font-bold text-red-500">{stats?.cancelled}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setStatusFilter("all")}>
                  Voir toutes les réservations
                </Button>
              </CardFooter>
            </Card>
            
            {/* Revenus */}
            <Card>
              <CardHeader>
                <CardTitle>Revenus estimés</CardTitle>
                <CardDescription>Revenus générés par les réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Aujourd'hui</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(stats?.revenue.today || 0).replace('MGA', 'Ar')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Cette semaine</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(stats?.revenue.weekly || 0).replace('MGA', 'Ar')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Ce mois</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(stats?.revenue.monthly || 0).replace('MGA', 'Ar')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Prochaines dates */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines réservations</CardTitle>
                <CardDescription>Les 7 prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = addDays(new Date(), i);
                    const reservationsOnDate = reservations.filter(r => {
                      const resDate = new Date(r.date);
                      return isSameDay(resDate, date) && (r.status === "confirmed" || r.status === "pending");
                    });
                    
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        className={cn(
                          "w-full justify-between h-auto py-3",
                          dateFilter && isSameDay(dateFilter, date) ? "border-primary" : "",
                          i === 0 ? "bg-primary/5" : ""
                        )}
                        onClick={() => setDateFilter(date)}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(date, i === 0 ? "'Aujourd'hui'" : i === 1 ? "'Demain'" : "EEEE d MMM", { locale: fr })}</span>
                        </div>
                        <Badge className="ml-2">{reservationsOnDate.length}</Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal de détails de réservation */}
      {selectedReservation && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails de la réservation</DialogTitle>
              <DialogDescription>
                Informations complètes sur la réservation #{selectedReservation.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedReservation.customerAvatar} />
                  <AvatarFallback>{selectedReservation.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-lg">{selectedReservation.customerName}</h3>
                  <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                    <span>{selectedReservation.customerEmail}</span>
                    <span>{selectedReservation.customerPhone}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date et heure</Label>
                  <div className="font-medium flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {formatDate(selectedReservation.date)} • {selectedReservation.time}
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1 text-white",
                        statusMap[selectedReservation.status].color
                      )}
                    >
                      {React.createElement(statusMap[selectedReservation.status].icon, { className: "h-3 w-3" })}
                      <span>{statusMap[selectedReservation.status].label}</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Zone de table</Label>
                  <div className="font-medium mt-1">{selectedReservation.tableAreaName}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Nombre de personnes</Label>
                  <div className="font-medium flex items-center mt-1">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedReservation.guestCount} personnes
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Montant</Label>
                  <div className="font-medium mt-1">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(selectedReservation.amount).replace('MGA', 'Ar')}
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Paiement</Label>
                  <div className="mt-1">
                    {selectedReservation.depositPaid ? (
                      <Badge variant="outline" className="bg-green-500 text-white border-none">
                        Acompte payé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500 text-white border-none">
                        En attente de paiement
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedReservation.specialRequests && (
                <div>
                  <Label className="text-muted-foreground">Demandes spéciales</Label>
                  <div className="bg-muted/50 p-3 rounded-md mt-1 text-sm">
                    {selectedReservation.specialRequests}
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-muted-foreground">Créée le</Label>
                <div className="text-sm mt-1">
                  {format(new Date(selectedReservation.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReservation(selectedReservation);
                  setDetailsOpen(false);
                  setMessageOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contacter le client
              </Button>
              
              {selectedReservation.status === "pending" && (
                <Button
                  onClick={() => {
                    handleStatusChange(selectedReservation.id, "confirmed");
                    setDetailsOpen(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer la réservation
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Modal de contact client */}
      {selectedReservation && (
        <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Contacter le client</DialogTitle>
              <DialogDescription>
                Envoyer un message à {selectedReservation.customerName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedReservation.customerAvatar} />
                  <AvatarFallback>{selectedReservation.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium">{selectedReservation.customerName}</div>
                  <div className="text-sm text-muted-foreground">{selectedReservation.customerEmail}</div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Écrivez votre message ici..."
                  className="resize-none h-32 mt-1.5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Messages prédéfinis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Bonjour ${selectedReservation.customerName}, nous confirmons votre réservation pour le ${formatDate(selectedReservation.date)} à ${selectedReservation.time}. Nous avons bien noté que vous serez ${selectedReservation.guestCount} personnes. À bientôt !`)}
                    className="h-auto py-2 justify-start"
                  >
                    <span className="text-left text-xs">Confirmation de réservation</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Bonjour ${selectedReservation.customerName}, pour confirmer votre réservation, merci de bien vouloir régler l'acompte de ${new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(selectedReservation.amount * 0.5).replace('MGA', 'Ar')} via notre lien de paiement.`)}
                    className="h-auto py-2 justify-start"
                  >
                    <span className="text-left text-xs">Demande d'acompte</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Bonjour ${selectedReservation.customerName}, nous vous rappelons votre réservation pour demain à ${selectedReservation.time}. Merci de confirmer votre présence. À bientôt !`)}
                    className="h-auto py-2 justify-start"
                  >
                    <span className="text-left text-xs">Rappel de réservation</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Bonjour ${selectedReservation.customerName}, nous sommes désolés de vous informer que nous ne pouvons pas honorer votre réservation du ${formatDate(selectedReservation.date)}. Pouvons-nous vous proposer une autre date ?`)}
                    className="h-auto py-2 justify-start"
                  >
                    <span className="text-left text-xs">Annulation par le club</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setMessageOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ResponsiveLayout>
  );
}