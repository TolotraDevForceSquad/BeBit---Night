// V1

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
  ChevronRight,
  Brain,
  LineChart,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Award
} from "lucide-react";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import { useOfflineSync } from "@/hooks/use-offline-sync";

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
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const offlineSync = useOfflineSync();
  const [aiSettings, setAiSettings] = useState({
    enablePredictions: true,
    enableInsights: true,
    enableSuggestions: true,
    dataCollectionLevel: 2, // 0-3: minimum, basic, standard, comprehensive
    predictionAccuracy: 90, // 70-99: balance between speed and accuracy
    updateFrequency: 1, // 0-3: daily, weekly, monthly, quarterly
    confidenceThreshold: 2, // 0-3: low, medium, high, very high
  });
  
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">BI Tickets</h1>
            <p className="text-lg text-muted-foreground mt-1.5">
              Analyse prédictive et gestion intelligente des événements
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <SyncStatusIndicator compact />
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

        {/* AI Insights Panel */}
        <div className="mb-8 border border-primary/20 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="text-primary h-5 w-5" />
            <h2 className="font-semibold text-primary">IA Insights & Recommandations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm">Opportunité détectée</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                L'analyse des événements passés montre que les clients qui achètent des tickets VIP dépensent 72% de plus au bar.
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Augmenter quota VIP (+15%)</span>
              </div>
            </div>
            
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm">Prévision IA</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                L'événement "DJ International Night" atteindra 92% de sa capacité avec les tendances actuelles de vente.
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Campagne ciblée sur Instagram</span>
              </div>
            </div>
            
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-sm">Optimisation tarifaire</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Une augmentation de 10% du prix des tickets "Entrée tardive" augmenterait les revenus de 8.5% sans impact sur les ventes.
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Ajuster tarifs tickets tardifs</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <Dialog open={recommendationsOpen} onOpenChange={setRecommendationsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Award className="h-3.5 w-3.5 mr-1.5" />
                  Voir toutes les recommandations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommandations IA
                  </DialogTitle>
                  <DialogDescription>
                    Analyse complète et recommandations basées sur l'intelligence artificielle
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  {/* Opportunities */}
                  <div className="space-y-3">
                    <h3 className="text-base font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Opportunités détectées
                    </h3>
                    
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="border rounded-md p-3 space-y-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">Recommandation #{i}</h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Impact élevé
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {i === 1 && "Les clients qui achètent des tickets VIP dépensent 72% de plus au bar."}
                          {i === 2 && "Les événements pendant la semaine ont un taux de conversion 18% plus élevé quand promus 14 jours à l'avance."}
                          {i === 3 && "Les offres de groupe (6+ personnes) génèrent 34% plus de revenus par événement."}
                          {i === 4 && "L'ajout d'un DJ international augmente les réservations VIP de 42%."}
                          {i === 5 && "Les utilisateurs qui réservent une table dépensent en moyenne 3.2x plus en consommations."}
                        </p>
                        <div className="flex justify-between items-center pt-1 text-xs">
                          <div className="flex items-center gap-1">
                            <LineChart className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Basé sur {10 + i * 5} événements similaires</span>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Predictions */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-base font-medium flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-blue-500" />
                      Prévisions et tendances
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-2">Prévisions de fréquentation</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Mai 2023:</span>
                            <span className="font-medium">+12%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Juin 2023:</span>
                            <span className="font-medium">+18%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Juillet 2023:</span>
                            <span className="font-medium">+24%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-2">Tendances musicales</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Afrobeats:</span>
                            <span className="font-medium text-green-500">↑ 32%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tech House:</span>
                            <span className="font-medium text-green-500">↑ 18%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">EDM:</span>
                            <span className="font-medium text-red-500">↓ 8%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-2">Optimisation tarifaire</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Standard:</span>
                            <span className="font-medium">5,500 Ar</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">VIP:</span>
                            <span className="font-medium">12,000 Ar</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Ultra VIP:</span>
                            <span className="font-medium">28,000 Ar</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="text-sm font-medium mb-2">Clientèle optimale</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Âge moyen:</span>
                            <span className="font-medium">27-34 ans</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Zone d'affluence:</span>
                            <span className="font-medium">12km</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Groupe cible:</span>
                            <span className="font-medium">Professionnels</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Rapport complet disponible en téléchargement
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                    <Button size="sm" onClick={() => setRecommendationsOpen(false)}>Fermer</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">
              Dernière analyse: <span className="font-medium">Aujourd'hui, 08:12</span>
            </p>
          </div>
        </div>

        <Tabs defaultValue="events" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="predictions" className="bg-primary/10">
              <Brain className="mr-1.5 h-4 w-4" />
              IA
            </TabsTrigger>
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
          
          {/* Tab: Analyse prédictive IA */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="text-primary h-5 w-5" />
                  <div>
                    <CardTitle>Prévisions intelligentes</CardTitle>
                    <CardDescription>
                      Analyse avancée et prédictions basées sur l'intelligence artificielle
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prédictions pour l'événement sélectionné */}
                {selectedEvent ? (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{selectedEvent.name}</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Prévisions intelligentes activées
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Prévisions de vente */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <LineChart className="h-4 w-4 text-primary" />
                          Prévisions de vente
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Ventes actuelles</span>
                            <span className="font-medium">{selectedEvent.ticketsSold} tickets</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Prévision J-7</span>
                            <span className="font-medium">{Math.round(selectedEvent.ticketsSold * 1.15)} tickets</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Prévision J-1</span>
                            <span className="font-medium">{Math.round(selectedEvent.ticketsSold * 1.32)} tickets</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Prévision finale</span>
                            <span className="font-medium">{Math.round(selectedEvent.ticketsSold * 1.42)} tickets</span>
                          </div>
                          
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Taux de remplissage prévu</span>
                              <span className="font-medium text-green-500">
                                {Math.round((selectedEvent.ticketsSold * 1.42 / selectedEvent.ticketsTotal) * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-primary mr-1.5" />
                            <span>Précision prédictive: 92% (basée sur 24 événements similaires)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Optimisation des prix */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Optimisation intelligente des prix
                        </h4>
                        
                        <div className="space-y-3">
                          {getEventTicketTypes(selectedEvent.id).map((ticketType) => (
                            <div key={ticketType.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <div className="font-medium text-sm">{ticketType.name}</div>
                                <div className="text-xs text-muted-foreground">Prix actuel: {formatCurrency(ticketType.price)}</div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xs font-medium">Prix optimal:</div>
                                <div className="text-primary font-medium">
                                  {formatCurrency(Math.round(ticketType.price * (0.9 + Math.random() * 0.3)))}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="text-sm font-medium pt-2">
                            Impact prévu sur les revenus: <span className="text-green-500">+8.7%</span>
                          </div>
                          
                          <Button size="sm" className="w-full mt-2 gap-1.5">
                            <Sparkles className="h-4 w-4" />
                            Appliquer les prix optimisés
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Recommandations personnalisées</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 border rounded-md bg-muted/30">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">Promotion ciblée</div>
                            <p className="text-xs text-muted-foreground">
                              Envoyez des invitations personnalisées aux 47 clients qui ont assisté à plus de 3 événements similaires ces 2 derniers mois.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 p-2 border rounded-md bg-muted/30">
                          <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">Offre spéciale</div>
                            <p className="text-xs text-muted-foreground">
                              Créez un package de groupe (6 personnes) avec une réduction de 15% pour augmenter le ticket moyen de 22%.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 p-2 border rounded-md bg-muted/30">
                          <LineChart className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">Timing des promotions</div>
                            <p className="text-xs text-muted-foreground">
                              Lancez une campagne promo "dernier jour" le 15 mai pour profiter du pic d'intérêt avant l'événement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sélectionnez un événement</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Choisissez un événement dans l'onglet Événements pour voir les prévisions intelligentes et les recommandations personnalisées.
                    </p>
                  </div>
                )}
                
                {/* Tableau de bord prédictif global */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Tableau de bord prédictif</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Analyse du public</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nouveaux clients:</span>
                          <span>32% (↑ 5.3%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taux de retour:</span>
                          <span>45% (↑ 2.1%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Clients premium:</span>
                          <span>18% (↑ 7.8%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Âge moyen:</span>
                          <span>27.5 ans</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Planification intelligente</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Meilleur jour:</span>
                          <span>Samedi</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heure optimale:</span>
                          <span>22h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée recommandée:</span>
                          <span>4h30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gain potentiel:</span>
                          <span className="text-green-500">+15%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Stratégie tarifaire</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix moyen optimal:</span>
                          <span>8,500 Ar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ratio VIP optimal:</span>
                          <span>25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Réduction groupe:</span>
                          <span>12-18%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenu projeté:</span>
                          <span className="text-green-500">+22%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Optimisé par BeIA™ - Précision prédictive: 92%
                </div>
                <Dialog open={aiSettingsOpen} onOpenChange={setAiSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Settings className="h-4 w-4" />
                      Paramètres IA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Configuration de l'IA
                      </DialogTitle>
                      <DialogDescription>
                        Personnalisez les fonctionnalités d'intelligence artificielle selon vos besoins
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Fonctionnalités</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-predictions" className="flex-1">
                              Prévisions de vente
                              <p className="text-xs text-muted-foreground">
                                Estimation du nombre de tickets qui seront vendus
                              </p>
                            </Label>
                            <Switch 
                              id="enable-predictions" 
                              checked={aiSettings.enablePredictions}
                              onCheckedChange={(checked) => setAiSettings({...aiSettings, enablePredictions: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-insights" className="flex-1">
                              Insights automatiques
                              <p className="text-xs text-muted-foreground">
                                Détection des tendances et opportunités
                              </p>
                            </Label>
                            <Switch 
                              id="enable-insights" 
                              checked={aiSettings.enableInsights}
                              onCheckedChange={(checked) => setAiSettings({...aiSettings, enableInsights: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-suggestions" className="flex-1">
                              Suggestions d'amélioration
                              <p className="text-xs text-muted-foreground">
                                Recommandations pour optimiser les prix et promotions
                              </p>
                            </Label>
                            <Switch 
                              id="enable-suggestions" 
                              checked={aiSettings.enableSuggestions}
                              onCheckedChange={(checked) => setAiSettings({...aiSettings, enableSuggestions: checked})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Configuration avancée</h4>
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label htmlFor="data-collection">Niveau de collecte des données</Label>
                              <span className="text-xs">
                                {aiSettings.dataCollectionLevel === 0 && "Minimum"}
                                {aiSettings.dataCollectionLevel === 1 && "Basique"}
                                {aiSettings.dataCollectionLevel === 2 && "Standard"}
                                {aiSettings.dataCollectionLevel === 3 && "Complet"}
                              </span>
                            </div>
                            <Slider 
                              id="data-collection"
                              min={0} 
                              max={3} 
                              step={1}
                              value={[aiSettings.dataCollectionLevel]}
                              onValueChange={(value) => setAiSettings({...aiSettings, dataCollectionLevel: value[0]})}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label htmlFor="prediction-accuracy">Précision des prédictions</Label>
                              <span className="text-xs">{aiSettings.predictionAccuracy}%</span>
                            </div>
                            <Slider 
                              id="prediction-accuracy"
                              min={70} 
                              max={99} 
                              step={1}
                              value={[aiSettings.predictionAccuracy]}
                              onValueChange={(value) => setAiSettings({...aiSettings, predictionAccuracy: value[0]})}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Une précision plus élevée nécessite plus de données et de temps de calcul
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="update-frequency" className="mb-2 block">Fréquence des mises à jour</Label>
                            <Select 
                              value={aiSettings.updateFrequency.toString()}
                              onValueChange={(value) => setAiSettings({...aiSettings, updateFrequency: parseInt(value)})}
                            >
                              <SelectTrigger id="update-frequency">
                                <SelectValue placeholder="Sélectionner une fréquence" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Quotidienne</SelectItem>
                                <SelectItem value="1">Hebdomadaire</SelectItem>
                                <SelectItem value="2">Mensuelle</SelectItem>
                                <SelectItem value="3">Trimestrielle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="confidence-threshold" className="mb-2 block">Seuil de confiance</Label>
                            <Select 
                              value={aiSettings.confidenceThreshold.toString()}
                              onValueChange={(value) => setAiSettings({...aiSettings, confidenceThreshold: parseInt(value)})}
                            >
                              <SelectTrigger id="confidence-threshold">
                                <SelectValue placeholder="Sélectionner un seuil" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Bas (plus de suggestions)</SelectItem>
                                <SelectItem value="1">Moyen</SelectItem>
                                <SelectItem value="2">Élevé</SelectItem>
                                <SelectItem value="3">Très élevé (suggestions plus précises)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => setAiSettingsOpen(false)}
                        className="gap-1.5"
                      >
                        <Brain className="h-4 w-4" />
                        Appliquer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default TicketsManagementPage;