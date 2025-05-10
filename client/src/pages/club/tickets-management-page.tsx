import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Filter,
  Calendar,
  Search,
  PlusCircle,
  TicketIcon,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  Edit,
  Trash2,
  Clock,
  Settings,
  ChevronRight
} from "lucide-react";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import { Checkbox } from "@/components/ui/checkbox";

// Types
interface Event {
  id: number;
  name: string;
  date: string;
  status: "upcoming" | "ongoing" | "past";
  ticketsSold: number;
  ticketsTotal: number;
  revenue: number;
}

interface TicketType {
  id: number;
  eventId: number;
  name: string;
  price: number;
  available: number;
  sold: number;
  maxPerPerson: number;
  description: string;
  benefits: string[];
  startTime?: string;
  endTime?: string;
  status: "active" | "soldout" | "inactive" | "draft";
}

interface Ticket {
  id: string;
  eventId: number;
  userId: number;
  userName: string;
  userEmail: string;
  ticketTypeId: number;
  ticketTypeName: string;
  purchaseDate: string;
  price: number;
  status: "valid" | "used" | "cancelled" | "refunded";
  checkedInDate?: string;
  qrCode: string;
}

// Données factices
const events: Event[] = [
  {
    id: 1,
    name: "DJ International Night",
    date: "2023-05-20T21:00:00",
    status: "upcoming",
    ticketsSold: 350,
    ticketsTotal: 500,
    revenue: 1750000
  },
  {
    id: 2,
    name: "Afrobeats Special",
    date: "2023-05-13T22:00:00",
    status: "upcoming",
    ticketsSold: 280,
    ticketsTotal: 400,
    revenue: 1260000
  },
  {
    id: 3,
    name: "Ladies Night",
    date: "2023-05-06T21:30:00",
    status: "past",
    ticketsSold: 420,
    ticketsTotal: 450,
    revenue: 1680000
  },
  {
    id: 4,
    name: "Weekend Fever",
    date: "2023-04-29T22:00:00",
    status: "past",
    ticketsSold: 480,
    ticketsTotal: 500,
    revenue: 1920000
  }
];

const ticketTypes: TicketType[] = [
  {
    id: 1,
    eventId: 1,
    name: "Entrée standard",
    price: 5000,
    available: 300,
    sold: 240,
    maxPerPerson: 4,
    description: "Entrée générale au club",
    benefits: ["Accès à toutes les zones communes", "1 consommation incluse"],
    status: "active"
  },
  {
    id: 2,
    eventId: 1,
    name: "VIP",
    price: 10000,
    available: 100,
    sold: 75,
    maxPerPerson: 2,
    description: "Accès VIP avec service de table",
    benefits: ["Accès zone VIP", "File d'attente prioritaire", "2 consommations incluses"],
    status: "active"
  },
  {
    id: 3,
    eventId: 1,
    name: "Ultra VIP",
    price: 25000,
    available: 50,
    sold: 30,
    maxPerPerson: 1,
    description: "Expérience premium avec table réservée",
    benefits: ["Table réservée", "Bouteille incluse", "Service dédié", "Accès zones exclusives"],
    status: "active"
  },
  {
    id: 4,
    eventId: 1,
    name: "Entrée tardive",
    price: 3000,
    available: 50,
    sold: 5,
    maxPerPerson: 2,
    description: "Entrée après 1h du matin",
    benefits: ["Accès zones communes", "Entrée après 1h"],
    startTime: "2023-05-21T01:00:00",
    status: "active"
  },
  {
    id: 5,
    eventId: 2,
    name: "Entrée standard",
    price: 4500,
    available: 250,
    sold: 180,
    maxPerPerson: 4,
    description: "Entrée générale au club",
    benefits: ["Accès à toutes les zones communes", "1 consommation incluse"],
    status: "active"
  },
  {
    id: 6,
    eventId: 2,
    name: "VIP",
    price: 9000,
    available: 100,
    sold: 80,
    maxPerPerson: 2,
    description: "Accès VIP avec service de table",
    benefits: ["Accès zone VIP", "File d'attente prioritaire", "2 consommations incluses"],
    status: "active"
  },
  {
    id: 7,
    eventId: 2,
    name: "Entrée groupe (5 pers.)",
    price: 18000,
    available: 10,
    sold: 6,
    maxPerPerson: 1,
    description: "Package pour 5 personnes à prix réduit",
    benefits: ["5 entrées standard", "Table réservée", "2 bouteilles de spiritueux"],
    status: "active"
  }
];

const tickets: Ticket[] = [
  {
    id: "TIX-001-1234",
    eventId: 1,
    userId: 101,
    userName: "Emma Dubois",
    userEmail: "emma.dubois@mail.com",
    ticketTypeId: 2,
    ticketTypeName: "VIP",
    purchaseDate: "2023-05-02T14:35:00",
    price: 10000,
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-001-1235",
    eventId: 1,
    userId: 102,
    userName: "Thomas Rakoto",
    userEmail: "thomas.r@mail.com",
    ticketTypeId: 2,
    ticketTypeName: "VIP",
    purchaseDate: "2023-05-02T15:22:00",
    price: 10000,
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-001-1236",
    eventId: 1,
    userId: 103,
    userName: "Sophie Andrianome",
    userEmail: "sophie.a@mail.com",
    ticketTypeId: 1,
    ticketTypeName: "Entrée standard",
    purchaseDate: "2023-05-03T09:15:00",
    price: 5000,
    status: "cancelled",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-001-1237",
    eventId: 1,
    userId: 104,
    userName: "Jean Razafindrakoto",
    userEmail: "jean.r@mail.com",
    ticketTypeId: 3,
    ticketTypeName: "Ultra VIP",
    purchaseDate: "2023-05-03T16:45:00",
    price: 25000,
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-001-1238",
    eventId: 1,
    userId: 105,
    userName: "Marie Solofo",
    userEmail: "marie.s@mail.com",
    ticketTypeId: 1,
    ticketTypeName: "Entrée standard",
    purchaseDate: "2023-05-04T11:10:00",
    price: 5000,
    status: "refunded",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-001-1239",
    eventId: 1,
    userId: 106,
    userName: "Luc Randriamanga",
    userEmail: "luc.r@mail.com",
    ticketTypeId: 1,
    ticketTypeName: "Entrée standard",
    purchaseDate: "2023-05-04T18:20:00",
    price: 5000,
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-002-1240",
    eventId: 2,
    userId: 101,
    userName: "Emma Dubois",
    userEmail: "emma.dubois@mail.com",
    ticketTypeId: 6,
    ticketTypeName: "VIP",
    purchaseDate: "2023-05-05T10:30:00",
    price: 9000,
    status: "valid",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  },
  {
    id: "TIX-003-1241",
    eventId: 3,
    userId: 107,
    userName: "Nathalie Rabemananjara",
    userEmail: "nathalie.r@mail.com",
    ticketTypeId: 8,
    ticketTypeName: "Entrée standard",
    purchaseDate: "2023-05-01T14:15:00",
    price: 4000,
    status: "used",
    checkedInDate: "2023-05-06T21:47:00",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
  }
];

// Formatage des montants en Ariary
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0
  }).format(amount);
};

// Formatage des dates
const formatDate = (dateString: string, includeTime: boolean = true) => {
  const date = new Date(dateString);
  
  if (includeTime) {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } else {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
};

// Formatage du pourcentage
const formatPercentage = (value: number, total: number) => {
  if (total === 0) return "0%";
  return Math.round((value / total) * 100) + "%";
};

const TicketsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    // Filtre de recherche
    if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Filtre de statut
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    return true;
  });
  
  // Obtenir les types de tickets pour l'événement sélectionné
  const getEventTicketTypes = (eventId: number) => {
    return ticketTypes.filter(type => type.eventId === eventId);
  };
  
  // Obtenir les tickets pour l'événement sélectionné
  const getEventTickets = (eventId: number) => {
    return tickets.filter(ticket => ticket.eventId === eventId);
  };
  
  const ticketStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "used":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "refunded":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const ticketTypeStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "soldout":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "draft":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">BI Tickets</h1>
            <p className="text-lg text-muted-foreground mt-1.5">
              Analysez et gérez vos événements, tickets et ventes
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={16} />
              Exporter
            </Button>
            <Button size="sm" className="gap-1.5">
              <PlusCircle size={16} />
              Nouvel événement
            </Button>
          </div>
        </div>

        <Tabs defaultValue="events" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
          </TabsList>

          {/* Tab: Événements */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Liste des événements</CardTitle>
                    <CardDescription>
                      Gérez vos événements et leurs tickets
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="ongoing">En cours</SelectItem>
                        <SelectItem value="past">Passés</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Input 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium p-2">Nom</th>
                        <th className="text-left font-medium p-2">Date</th>
                        <th className="text-left font-medium p-2">Tickets vendus</th>
                        <th className="text-left font-medium p-2">Revenu</th>
                        <th className="text-left font-medium p-2">Statut</th>
                        <th className="text-right font-medium p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((event) => (
                        <tr 
                          key={event.id} 
                          className={`border-b border-border hover:bg-muted/50 cursor-pointer ${selectedEvent?.id === event.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <td className="p-2 font-medium">{event.name}</td>
                          <td className="p-2">{formatDate(event.date)}</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              <span className="mr-2">{event.ticketsSold}/{event.ticketsTotal}</span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${(event.ticketsSold / event.ticketsTotal) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">{formatCurrency(event.revenue)}</td>
                          <td className="p-2">
                            <Badge variant={
                              event.status === 'upcoming' ? 'default' : 
                              event.status === 'ongoing' ? 'secondary' : 'outline'
                            }>
                              {event.status === 'upcoming' ? 'À venir' : 
                               event.status === 'ongoing' ? 'En cours' : 'Passé'}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <TicketIcon size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronRight size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredEvents.length} événements
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar size={16} />
                  Voir le calendrier
                </Button>
              </CardFooter>
            </Card>
            
            {selectedEvent && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <CardTitle>{selectedEvent.name}</CardTitle>
                        <CardDescription>
                          {formatDate(selectedEvent.date)} • {selectedEvent.status === 'upcoming' ? 'À venir' : selectedEvent.status === 'ongoing' ? 'En cours' : 'Passé'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Edit size={16} />
                          Modifier
                        </Button>
                        <Button size="sm" className="gap-1.5">
                          <PlusCircle size={16} />
                          Ajouter un type de ticket
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TicketIcon className="text-primary" size={20} />
                          <h3 className="font-medium">Tickets vendus</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold">{selectedEvent.ticketsSold}/{selectedEvent.ticketsTotal}</div>
                          <div className="text-sm text-muted-foreground pb-1">
                            ({formatPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsTotal)})
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(selectedEvent.ticketsSold / selectedEvent.ticketsTotal) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                          <span>Taux de conversion: 4.2%</span>
                          <span className="text-green-500">↑ 0.8%</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="text-primary" size={20} />
                          <h3 className="font-medium">Analyse participants</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold">{selectedEvent.ticketsSold}</div>
                          <div className="text-sm text-muted-foreground pb-1">personnes</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <div className="text-muted-foreground">Hommes/Femmes</div>
                            <div className="font-medium">45% / 55%</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Âge moyen</div>
                            <div className="font-medium">27.3 ans</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Premières visites</div>
                            <div className="font-medium">32%</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Fidèles</div>
                            <div className="font-medium">22%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-primary">Ar</div>
                          <h3 className="font-medium">Analyse financière</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold">{formatCurrency(selectedEvent.revenue)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <div className="text-muted-foreground">Panier moyen</div>
                            <div className="font-medium">{formatCurrency(selectedEvent.revenue / selectedEvent.ticketsSold)}</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Revenues / capacité</div>
                            <div className="font-medium">{formatCurrency(selectedEvent.revenue / selectedEvent.ticketsTotal)}</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Croissance</div>
                            <div className="font-medium text-green-500">+12.5%</div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Prévision finale</div>
                            <div className="font-medium">{formatCurrency(selectedEvent.revenue * 1.18)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Analyse des ventes et types de tickets</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Graphique de distribution des tickets */}
                        <div className="border border-border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-3">Distribution des ventes par type de ticket</h4>
                          <div className="aspect-[4/3] flex items-center justify-center">
                            {/* Simuler un graphique simple */}
                            <div className="w-full h-full flex items-end justify-around p-4">
                              {getEventTicketTypes(selectedEvent.id).map((ticketType, index) => (
                                <div key={ticketType.id} className="flex flex-col items-center">
                                  <div 
                                    className="w-16 bg-primary/80 rounded-t-md relative group"
                                    style={{ 
                                      height: `${(ticketType.sold / ticketType.available) * 100}%`,
                                      opacity: 0.5 + (index * 0.15),
                                      minHeight: '20px'
                                    }}
                                  >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-muted-foreground text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      {ticketType.name}: {ticketType.sold} vendus
                                    </div>
                                  </div>
                                  <div className="text-xs mt-2 max-w-24 truncate text-center">
                                    {ticketType.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <div>Distribution par type</div>
                            <div>Taux de remplissage: {formatPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsTotal)}</div>
                          </div>
                        </div>
                        
                        {/* Tendances de vente */}
                        <div className="border border-border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-3">Tendances des ventes dans le temps</h4>
                          <div className="aspect-[4/3] flex items-center justify-center p-4">
                            {/* Simuler un graphique de tendance */}
                            <div className="w-full h-full flex items-end">
                              <div className="w-full h-full relative">
                                {/* Axe Y */}
                                <div className="absolute left-0 h-full w-[1px] bg-border"></div>
                                {/* Axe X */}
                                <div className="absolute bottom-0 w-full h-[1px] bg-border"></div>
                                
                                {/* Courbe de vente - lignes */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <path 
                                    d="M0,100 L10,90 L20,85 L30,80 L40,70 L50,50 L60,40 L70,35 L80,25 L90,20 L100,15" 
                                    fill="none" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth="2"
                                  />
                                  <path 
                                    d="M0,100 L10,90 L20,85 L30,80 L40,70 L50,50 L60,40 L70,35 L80,25 L90,20 L100,15" 
                                    fill="hsl(var(--primary)/0.1)" 
                                    strokeWidth="0"
                                  />
                                </svg>
                                
                                {/* Points de données */}
                                <div className="absolute left-[10%] bottom-[10%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[20%] bottom-[15%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[30%] bottom-[20%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[40%] bottom-[30%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[50%] bottom-[50%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[60%] bottom-[60%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[70%] bottom-[65%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[80%] bottom-[75%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[90%] bottom-[80%] w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute left-[100%] bottom-[85%] w-2 h-2 rounded-full bg-primary -translate-x-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <div>60 jours avant l'événement</div>
                            <div>Jour de l'événement</div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            <div className="flex items-center justify-between">
                              <span>Pic de ventes: J-12</span>
                              <span className="text-green-500">Prévision: +42 ventes à venir</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left font-medium p-2">Nom</th>
                              <th className="text-left font-medium p-2">Prix</th>
                              <th className="text-left font-medium p-2">Disponibles</th>
                              <th className="text-left font-medium p-2">Vendus</th>
                              <th className="text-left font-medium p-2">Statut</th>
                              <th className="text-right font-medium p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getEventTicketTypes(selectedEvent.id).map((ticketType) => (
                              <tr key={ticketType.id} className="border-b border-border hover:bg-muted/50">
                                <td className="p-2">
                                  <div>
                                    <div className="font-medium">{ticketType.name}</div>
                                    <div className="text-xs text-muted-foreground">{ticketType.description}</div>
                                  </div>
                                </td>
                                <td className="p-2 font-medium">{formatCurrency(ticketType.price)}</td>
                                <td className="p-2">{ticketType.available - ticketType.sold}</td>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <span className="mr-2">{ticketType.sold}/{ticketType.available}</span>
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(ticketType.sold / ticketType.available) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <Badge className={ticketTypeStatusColor(ticketType.status)}>
                                    {ticketType.status === 'active' ? 'Actif' : 
                                     ticketType.status === 'soldout' ? 'Épuisé' : 
                                     ticketType.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                                  </Badge>
                                </td>
                                <td className="p-2 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download size={16} />
                      Exporter les tickets
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Filter size={16} />
                      Gérer les promotions
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Settings size={16} />
                      Paramètres de l'événement
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Liste des tickets vendus pour l'événement sélectionné */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tickets vendus pour {selectedEvent.name}</CardTitle>
                    <CardDescription>
                      Liste des tickets vendus et leur statut
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left font-medium p-2">ID Ticket</th>
                            <th className="text-left font-medium p-2">Utilisateur</th>
                            <th className="text-left font-medium p-2">Type</th>
                            <th className="text-left font-medium p-2">Prix</th>
                            <th className="text-left font-medium p-2">Date d'achat</th>
                            <th className="text-left font-medium p-2">Statut</th>
                            <th className="text-right font-medium p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getEventTickets(selectedEvent.id).map((ticket) => (
                            <tr key={ticket.id} className="border-b border-border hover:bg-muted/50">
                              <td className="p-2 font-medium">{ticket.id}</td>
                              <td className="p-2">
                                <div>
                                  <div>{ticket.userName}</div>
                                  <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                                </div>
                              </td>
                              <td className="p-2">{ticket.ticketTypeName}</td>
                              <td className="p-2">{formatCurrency(ticket.price)}</td>
                              <td className="p-2">{formatDate(ticket.purchaseDate)}</td>
                              <td className="p-2">
                                <Badge className={ticketStatusColor(ticket.status)}>
                                  {ticket.status === 'valid' ? 'Valide' : 
                                   ticket.status === 'used' ? 'Utilisé' : 
                                   ticket.status === 'cancelled' ? 'Annulé' : 'Remboursé'}
                                </Badge>
                              </td>
                              <td className="p-2 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <QrCode size={16} />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    {ticket.status === 'valid' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tab: Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Tous les tickets</CardTitle>
                    <CardDescription>
                      Recherchez et gérez tous les tickets vendus
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] flex-shrink-0">
                        <SelectValue placeholder="Statut du ticket" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les tickets</SelectItem>
                        <SelectItem value="valid">Valides</SelectItem>
                        <SelectItem value="used">Utilisés</SelectItem>
                        <SelectItem value="cancelled">Annulés</SelectItem>
                        <SelectItem value="refunded">Remboursés</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] flex-shrink-0">
                        <SelectValue placeholder="Événement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les événements</SelectItem>
                        {events.map(event => (
                          <SelectItem key={event.id} value={event.id.toString()}>{event.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Rechercher par ID, nom, email..." 
                        className="pl-9"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">
                          <div className="flex items-center">
                            <Checkbox id="select-all" />
                            <label htmlFor="select-all" className="ml-2 font-medium">ID Ticket</label>
                          </div>
                        </th>
                        <th className="text-left font-medium p-2">Utilisateur</th>
                        <th className="text-left font-medium p-2">Événement</th>
                        <th className="text-left font-medium p-2">Type de ticket</th>
                        <th className="text-left font-medium p-2">Date d'achat</th>
                        <th className="text-left font-medium p-2">Prix</th>
                        <th className="text-left font-medium p-2">Statut</th>
                        <th className="text-right font-medium p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => {
                        const event = events.find(e => e.id === ticket.eventId);
                        return (
                          <tr key={ticket.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-2">
                              <div className="flex items-center">
                                <Checkbox id={`select-${ticket.id}`} />
                                <label htmlFor={`select-${ticket.id}`} className="ml-2 font-medium">{ticket.id}</label>
                              </div>
                            </td>
                            <td className="p-2">
                              <div>
                                <div>{ticket.userName}</div>
                                <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                              </div>
                            </td>
                            <td className="p-2">{event?.name}</td>
                            <td className="p-2">{ticket.ticketTypeName}</td>
                            <td className="p-2">{formatDate(ticket.purchaseDate)}</td>
                            <td className="p-2">{formatCurrency(ticket.price)}</td>
                            <td className="p-2">
                              <Badge className={ticketStatusColor(ticket.status)}>
                                {ticket.status === 'valid' ? 'Valide' : 
                                 ticket.status === 'used' ? 'Utilisé' : 
                                 ticket.status === 'cancelled' ? 'Annulé' : 'Remboursé'}
                              </Badge>
                              {ticket.status === 'used' && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <Clock size={12} className="inline mr-1" />
                                  {formatDate(ticket.checkedInDate || '')}
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <QrCode size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  {ticket.status === 'valid' ? 
                                    <CheckCircle2 size={16} className="text-green-500" /> : 
                                    ticket.status === 'used' ? 
                                      <CheckCircle2 size={16} className="text-blue-500" /> :
                                      <XCircle size={16} className="text-red-500" />
                                  }
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronRight size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage de {tickets.length} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Précédent</Button>
                  <Button variant="outline" size="sm" className="bg-primary/10">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab: Scanner */}
          <TabsContent value="scanner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scanner de tickets</CardTitle>
                <CardDescription>
                  Scannez les QR codes des tickets pour vérifier leur validité
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Scanner un QR code</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Utilisez votre appareil pour scanner le QR code sur les tickets des participants.
                    Vous pourrez vérifier leur validité et enregistrer leur entrée.
                  </p>
                </div>

                <div className="w-full max-w-md p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg mb-8 flex flex-col items-center">
                  <div className="w-56 h-56 bg-muted rounded-md flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <QrCode size={40} className="mx-auto mb-2" />
                      <p className="text-sm">Zone de numérisation</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Button className="gap-1.5">
                      <QrCode size={16} />
                      Scanner
                    </Button>
                    <Button variant="outline" className="gap-1.5">
                      <TicketIcon size={16} />
                      Saisir ID
                    </Button>
                  </div>
                </div>
                
                <div className="w-full max-w-md">
                  <h3 className="text-lg font-medium mb-4">Derniers tickets scannés</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="mr-3">
                        <CheckCircle2 size={24} className="text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">TIX-001-1234</div>
                            <div className="text-xs text-muted-foreground">Emma Dubois • DJ International Night</div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Valide
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Clock size={12} className="inline mr-1" />
                          Il y a 5 minutes
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="mr-3">
                        <XCircle size={24} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">TIX-001-2345</div>
                            <div className="text-xs text-muted-foreground">Marc Dupont • DJ International Night</div>
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            Déjà utilisé
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Clock size={12} className="inline mr-1" />
                          Il y a 12 minutes
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="mr-3">
                        <AlertCircle size={24} className="text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">TIX-002-3456</div>
                            <div className="text-xs text-muted-foreground">Julie Martin • Afrobeats Special</div>
                          </div>
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            Mauvais événement
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Clock size={12} className="inline mr-1" />
                          Il y a 25 minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-center">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download size={16} />
                  Exporter l'historique
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default TicketsManagementPage;