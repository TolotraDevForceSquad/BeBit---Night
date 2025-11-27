// V2 avec graphiques utilisant les données réelles

import React, { useState, useEffect } from "react";
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
  Award,
  PieChart,
  BarChart3
} from "lucide-react";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { toast } from '@/hooks/use-toast';

// Import des services API
import { 
  Event, Ticket, TicketType, User, Transaction, EventParticipant, Promotion,
  getAllEvents, getAllTickets, getAllTicketTypes, getAllUsers, 
  getAllTransactions, getAllEventParticipants, getAllPromotions, updateTicket
} from '@/services/servapi';

// Types adaptés aux données réelles
interface EventWithStats extends Event {
  ticketsSold: number;
  ticketsTotal: number;
  revenue: number;
  status: "upcoming" | "ongoing" | "past";
  participantStats: {
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

interface TicketWithDetails extends Ticket {
  userName: string;
  userEmail: string;
  ticketTypeName: string;
  eventName: string;
  qrCode?: string;
  status: "valid" | "used" | "cancelled" | "refunded";
  transactionReference?: string;
}

interface TicketTypeWithStats extends TicketType {
  sold: number;
  available: number;
  status: "active" | "soldout" | "inactive" | "draft";
  revenue: number;
}

// Formatage des montants en Ariary
const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0
  }).format(numAmount);
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

// Composant Graphique à barres simple
const BarChart: React.FC<{ data: { label: string; value: number; max: number; color?: string }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.max), 1);
  
  return (
    <div className="w-full h-48 flex items-end justify-around p-4">
      {data.map((item, index) => (
        <div key={item.label} className="flex flex-col items-center">
          <div 
            className="w-12 bg-primary/80 rounded-t-md relative group transition-all duration-300"
            style={{ 
              height: `${(item.value / maxValue) * 80}%`,
              opacity: 0.6 + (index * 0.1),
              minHeight: '20px',
              backgroundColor: item.color || `hsl(var(--primary))`
            }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {item.label}: {item.value}
            </div>
          </div>
          <div className="text-xs mt-2 max-w-16 truncate text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant Graphique de tendance basé sur les dates d'achat réelles
const TrendChart: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  // Grouper les tickets par jour d'achat
  const dailySales = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.purchasedAt).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convertir en tableau et prendre les 7 derniers jours
  const salesData = Object.entries(dailySales)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-7)
    .map(([_, count]) => count);

  if (salesData.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
        Aucune donnée de vente disponible
      </div>
    );
  }

  const maxValue = Math.max(...salesData);
  const points = salesData.map((value, index) => {
    const x = (index / (salesData.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-48 relative">
      {/* Axe Y */}
      <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
      {/* Axe X */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-border"></div>
      
      {/* Courbe de tendance */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline 
          points={points}
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <polygon 
          points={`0,100 ${points} 100,100`}
          fill="hsl(var(--primary)/0.1)" 
          strokeWidth="0"
        />
        
        {/* Points de données */}
        {salesData.map((value, index) => {
          const x = (index / (salesData.length - 1)) * 100;
          const y = 100 - (value / maxValue) * 80;
          return (
            <circle 
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="hsl(var(--primary))"
              className="transition-all duration-300 hover:r-3"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Composant Graphique circulaire (Pie Chart)
const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  let currentAngle = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const largeArc = percentage > 50 ? 1 : 0;
    
    const startX = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
    const startY = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
    
    const endX = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
    const endY = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
    
    const pathData = [
      `M 50 50`,
      `L ${startX} ${startY}`,
      `A 40 40 0 ${largeArc} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');
    
    const segment = (
      <path
        key={item.label}
        d={pathData}
        fill={item.color}
        className="transition-all duration-300 hover:opacity-80"
      />
    );
    
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {segments}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="12" fontWeight="bold">
          {total}
        </text>
      </svg>
    </div>
  );
};

const TicketsManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [scannerInput, setScannerInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  
  // États pour les données
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeWithStats[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const offlineSync = useOfflineSync();
  const [aiSettings, setAiSettings] = useState({
    enablePredictions: true,
    enableInsights: true,
    enableSuggestions: true,
    dataCollectionLevel: 2,
    predictionAccuracy: 90,
    updateFrequency: 1,
    confidenceThreshold: 2,
  });

  // Récupérer l'utilisateur connecté
  const getCurrentUser = () => {
    const authUser = localStorage.getItem("auth_user");
    return authUser ? JSON.parse(authUser) : null;
  };

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      
      // Charger les données via les services API
      const [
        eventsData,
        ticketsData,
        ticketTypesData,
        usersData,
        transactionsData,
        participantsData,
        promotionsData
      ] = await Promise.all([
        getAllEvents({ 
          organizerId: currentUser?.id,
          organizerType: currentUser?.role 
        }),
        getAllTickets(),
        getAllTicketTypes(),
        getAllUsers(),
        getAllTransactions(),
        getAllEventParticipants(),
        getAllPromotions()
      ]);

      // Transformer les événements avec les stats
      const eventsWithStats: EventWithStats[] = eventsData.map(event => {
        const eventTickets = ticketsData.filter(ticket => ticket.eventId === event.id);
        const eventTicketTypes = ticketTypesData.filter(type => type.eventId === event.id);
        const eventParticipants = participantsData.filter(p => p.eventId === event.id);
        
        const ticketsSold = eventTickets.length;
        const ticketsTotal = eventTicketTypes.reduce((sum, type) => sum + type.capacity, 0);
        const revenue = eventTickets.reduce((sum, ticket) => sum + parseFloat(ticket.price.toString()), 0);
        
        // Déterminer le statut de l'événement
        const eventDate = new Date(event.date);
        const now = new Date();
        let status: "upcoming" | "ongoing" | "past" = "upcoming";
        
        if (eventDate < now) {
          status = "past";
        } else if (eventDate.toDateString() === now.toDateString()) {
          status = "ongoing";
        }

        // Statistiques des participants
        const participantStats = {
          confirmed: eventParticipants.filter(p => p.status === 'confirmed').length,
          pending: eventParticipants.filter(p => p.status === 'pending').length,
          cancelled: eventParticipants.filter(p => p.status === 'cancel').length
        };
        
        return {
          ...event,
          ticketsSold,
          ticketsTotal,
          revenue,
          status,
          participantStats
        };
      });

      // Transformer les tickets avec les détails
      const ticketsWithDetails: TicketWithDetails[] = ticketsData.map(ticket => {
        const user = usersData.find(u => u.id === ticket.userId);
        const ticketType = ticketTypesData.find(t => t.id === ticket.ticketTypeId);
        const event = eventsData.find(e => e.id === ticket.eventId);
        const transaction = transactionsData.find(t => 
          t.sourceType === 'ticket_purchase' && t.sourceId === ticket.id
        );

        // Convertir le statut du ticket
        let status: "valid" | "used" | "cancelled" | "refunded" = "valid";
        if (ticket.status === "used") status = "used";
        else if (ticket.status === "cancelled") status = "cancelled";
        else if (transactionsData.some(t => 
          t.sourceType === 'refund' && t.sourceId === ticket.id
        )) status = "refunded";

        return {
          ...ticket,
          userName: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu',
          userEmail: user?.email || 'Email inconnu',
          ticketTypeName: ticketType?.name || 'Type inconnu',
          eventName: event?.title || 'Événement inconnu',
          qrCode: transaction ? `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
              <rect width="100" height="100" fill="white"/>
              <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="8">
                ${transaction.reference}
              </text>
            </svg>
          `)}` : undefined,
          status,
          transactionReference: transaction?.reference
        };
      });

      // Transformer les types de tickets avec les stats
      const ticketTypesWithStats: TicketTypeWithStats[] = ticketTypesData.map(type => {
        const typeTickets = ticketsData.filter(ticket => ticket.ticketTypeId === type.id);
        const sold = typeTickets.length;
        const available = type.capacity - sold;
        const revenue = typeTickets.reduce((sum, ticket) => sum + parseFloat(ticket.price.toString()), 0);
        
        let status: "active" | "soldout" | "inactive" | "draft" = "active";
        if (available <= 0) status = "soldout";
        else if (sold === 0) status = "draft";

        return {
          ...type,
          sold,
          available,
          status,
          revenue
        };
      });

      setEvents(eventsWithStats);
      setTickets(ticketsWithDetails);
      setTicketTypes(ticketTypesWithStats);
      setUsers(usersData);
      setTransactions(transactionsData);
      setEventParticipants(participantsData);
      setPromotions(promotionsData);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Filtrer les tickets
  const filteredTickets = tickets.filter(ticket => {
    if (ticketStatusFilter !== "all" && ticket.status !== ticketStatusFilter) {
      return false;
    }
    if (eventFilter !== "all" && ticket.eventId !== parseInt(eventFilter)) {
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

  // Obtenir les promotions pour l'événement sélectionné
  const getEventPromotions = (eventId: number) => {
    return promotions.filter(promo => promo.eventId === eventId);
  };

  // Données pour les graphiques - BASÉES SUR LES DONNÉES RÉELLES
  const getTicketStatusData = () => {
    const statusCounts = {
      valid: tickets.filter(t => t.status === 'valid').length,
      used: tickets.filter(t => t.status === 'used').length,
      cancelled: tickets.filter(t => t.status === 'cancelled').length,
      refunded: tickets.filter(t => t.status === 'refunded').length,
    };

    return [
      { label: 'Valides', value: statusCounts.valid, color: '#10b981' },
      { label: 'Utilisés', value: statusCounts.used, color: '#3b82f6' },
      { label: 'Annulés', value: statusCounts.cancelled, color: '#ef4444' },
      { label: 'Remboursés', value: statusCounts.refunded, color: '#f59e0b' },
    ];
  };

  const getTicketTypeSalesData = () => {
    return ticketTypes.map((type, index) => ({
      label: type.name,
      value: type.sold,
      max: type.capacity,
      color: `hsl(${index * 60}, 70%, 50%)`
    }));
  };

  const getEventPerformanceData = () => {
    return events.slice(0, 5).map(event => ({
      label: event.title.length > 10 ? event.title.substring(0, 10) + '...' : event.title,
      value: event.ticketsSold,
      max: event.ticketsTotal
    }));
  };

  // Scanner un ticket
  const handleScanTicket = async () => {
    if (!scannerInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une référence de ticket",
        variant: "destructive",
      });
      return;
    }

    try {
      // Rechercher la transaction par référence
      const transaction = transactions.find(t => 
        t.reference === scannerInput || 
        t.sourceReference === scannerInput
      );

      if (!transaction) {
        setScanResult({
          valid: false,
          message: "Ticket non trouvé",
          ticket: null
        });
        return;
      }

      // Trouver le ticket correspondant
      const ticket = tickets.find(t => t.id === transaction.sourceId);
      
      if (!ticket) {
        setScanResult({
          valid: false,
          message: "Ticket non trouvé",
          ticket: null
        });
        return;
      }

      // Vérifier si le ticket est déjà utilisé
      if (ticket.status === "used") {
        setScanResult({
          valid: false,
          message: "Ticket déjà utilisé",
          ticket: ticket
        });
        return;
      }

      // Marquer le ticket comme utilisé
      await updateTicket(ticket.id, { status: "used" as any });
      
      setScanResult({
        valid: true,
        message: "Ticket validé avec succès",
        ticket: { ...ticket, status: "used" as any }
      });

      // Recharger les données
      await loadData();

      toast({
        title: "Succès",
        description: "Ticket validé avec succès",
      });

    } catch (error) {
      console.error('Erreur lors du scan:', error);
      setScanResult({
        valid: false,
        message: "Erreur lors de la validation du ticket",
        ticket: null
      });
    }
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

  // Calculer les statistiques globales BASÉES SUR LES DONNÉES RÉELLES
  const globalStats = {
    totalTickets: tickets.length,
    uniqueCustomers: new Set(tickets.map(t => t.userId)).size,
    totalRevenue: tickets.reduce((sum, ticket) => sum + parseFloat(ticket.price.toString()), 0),
    usedTickets: tickets.filter(t => t.status === 'used').length,
    validTickets: tickets.filter(t => t.status === 'valid').length,
    cancelledTickets: tickets.filter(t => t.status === 'cancelled').length,
    refundedTickets: tickets.filter(t => t.status === 'refunded').length,
  };

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Tickets</h1>
            <p className="text-lg text-muted-foreground mt-1.5">
              Gérez et scannez les tickets de vos événements
            </p>
          </div>
        </div>

        {/* Panel d'insights IA avec données réelles */}
        <div className="mb-8 border border-primary/20 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="text-primary h-5 w-5" />
            <h2 className="font-semibold text-primary">Insights & Recommandations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm">Performance des ventes</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedEvent 
                  ? `${selectedEvent.ticketsSold} tickets vendus sur ${selectedEvent.ticketsTotal} (${formatPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsTotal)})`
                  : `${globalStats.totalTickets} tickets vendus au total`
                }
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Promotion ciblée</span>
              </div>
            </div>
            
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm">Analyse de fréquentation</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedEvent 
                  ? `${selectedEvent.participantStats.confirmed} participants confirmés`
                  : `${globalStats.uniqueCustomers} clients uniques`
                }
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Fidélisation</span>
              </div>
            </div>
            
            <div className="bg-background rounded p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-sm">Revenus générés</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedEvent 
                  ? `${formatCurrency(selectedEvent.revenue)} de revenus`
                  : `${formatCurrency(globalStats.totalRevenue)} au total`
                }
              </p>
              <div className="text-xs font-medium flex justify-between">
                <span className="text-primary">Recommandation:</span>
                <span>Optimiser prix</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="events" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Tab: Événements */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Mes événements</CardTitle>
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
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun événement trouvé</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" 
                        ? "Aucun événement ne correspond à vos critères de recherche" 
                        : "Vous n'avez pas encore créé d'événements"}
                    </p>
                  </div>
                ) : (
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
                            <td className="p-2 font-medium">{event.title}</td>
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
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredEvents.length} événements
                </div>
              </CardFooter>
            </Card>
            
            {selectedEvent && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <CardTitle>{selectedEvent.title}</CardTitle>
                        <CardDescription>
                          {formatDate(selectedEvent.date)} • {selectedEvent.status === 'upcoming' ? 'À venir' : selectedEvent.status === 'ongoing' ? 'En cours' : 'Passé'}
                        </CardDescription>
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
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="text-primary" size={20} />
                          <h3 className="font-medium">Participants</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold">{selectedEvent.participantStats.confirmed}</div>
                          <div className="text-sm text-muted-foreground pb-1">confirmés</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <div className="text-muted-foreground">En attente</div>
                            <div className="font-medium">
                              {selectedEvent.participantStats.pending}
                            </div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Annulés</div>
                            <div className="font-medium">
                              {selectedEvent.participantStats.cancelled}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-primary">Ar</div>
                          <h3 className="font-medium">Revenus</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="text-2xl font-bold">{formatCurrency(selectedEvent.revenue)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-xs">
                            <div className="text-muted-foreground">Panier moyen</div>
                            <div className="font-medium">
                              {selectedEvent.ticketsSold > 0 
                                ? formatCurrency(selectedEvent.revenue / selectedEvent.ticketsSold)
                                : formatCurrency(0)
                              }
                            </div>
                          </div>
                          <div className="text-xs">
                            <div className="text-muted-foreground">Revenu / capacité</div>
                            <div className="font-medium">
                              {formatCurrency(selectedEvent.revenue / selectedEvent.ticketsTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Types de tickets</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left font-medium p-2">Nom</th>
                              <th className="text-left font-medium p-2">Prix</th>
                              <th className="text-left font-medium p-2">Disponibles</th>
                              <th className="text-left font-medium p-2">Vendus</th>
                              <th className="text-left font-medium p-2">Revenu</th>
                              <th className="text-left font-medium p-2">Statut</th>
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
                                <td className="p-2">{ticketType.available}</td>
                                <td className="p-2">
                                  <div className="flex items-center">
                                    <span className="mr-2">{ticketType.sold}/{ticketType.capacity}</span>
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(ticketType.sold / ticketType.capacity) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2 font-medium">{formatCurrency(ticketType.revenue)}</td>
                                <td className="p-2">
                                  <Badge className={ticketTypeStatusColor(ticketType.status)}>
                                    {ticketType.status === 'active' ? 'Actif' : 
                                     ticketType.status === 'soldout' ? 'Épuisé' : 
                                     ticketType.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Promotions de l'événement */}
                    {getEventPromotions(selectedEvent.id).length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Promotions actives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getEventPromotions(selectedEvent.id).map((promotion) => (
                            <Card key={promotion.id}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{promotion.title}</CardTitle>
                                <CardDescription>{promotion.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center">
                                  <Badge variant="secondary">
                                    {promotion.discountType === 'percentage' 
                                      ? `${promotion.discountValue}% de réduction`
                                      : `${formatCurrency(promotion.discountValue)} de réduction`
                                    }
                                  </Badge>
                                  <Badge className={promotion.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                    {promotion.status === 'active' ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                  Valide du {formatDate(promotion.validFrom)} au {formatDate(promotion.validTo)}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Liste des tickets vendus pour l'événement sélectionné */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tickets vendus pour {selectedEvent.title}</CardTitle>
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
                          </tr>
                        </thead>
                        <tbody>
                          {getEventTickets(selectedEvent.id).map((ticket) => (
                            <tr key={ticket.id} className="border-b border-border hover:bg-muted/50">
                              <td className="p-2 font-medium">TKT-{ticket.id}</td>
                              <td className="p-2">
                                <div>
                                  <div>{ticket.userName}</div>
                                  <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                                </div>
                              </td>
                              <td className="p-2">{ticket.ticketTypeName}</td>
                              <td className="p-2">{formatCurrency(ticket.price)}</td>
                              <td className="p-2">{formatDate(ticket.purchasedAt.toString())}</td>
                              <td className="p-2">
                                <Badge className={ticketStatusColor(ticket.status)}>
                                  {ticket.status === 'valid' ? 'Valide' : 
                                   ticket.status === 'used' ? 'Utilisé' : 
                                   ticket.status === 'cancelled' ? 'Annulé' : 'Remboursé'}
                                </Badge>
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
                    <Select value={ticketStatusFilter} onValueChange={setTicketStatusFilter}>
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
                    <Select value={eventFilter} onValueChange={setEventFilter}>
                      <SelectTrigger className="w-[180px] flex-shrink-0">
                        <SelectValue placeholder="Événement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les événements</SelectItem>
                        {events.map(event => (
                          <SelectItem key={event.id} value={event.id.toString()}>{event.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Rechercher par nom, email..." 
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
                        <th className="text-left font-medium p-2">ID Ticket</th>
                        <th className="text-left font-medium p-2">Utilisateur</th>
                        <th className="text-left font-medium p-2">Événement</th>
                        <th className="text-left font-medium p-2">Type de ticket</th>
                        <th className="text-left font-medium p-2">Date d'achat</th>
                        <th className="text-left font-medium p-2">Prix</th>
                        <th className="text-left font-medium p-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-2 font-medium">TKT-{ticket.id}</td>
                          <td className="p-2">
                            <div>
                              <div>{ticket.userName}</div>
                              <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-2">{ticket.eventName}</td>
                          <td className="p-2">{ticket.ticketTypeName}</td>
                          <td className="p-2">{formatDate(ticket.purchasedAt.toString())}</td>
                          <td className="p-2">{formatCurrency(ticket.price)}</td>
                          <td className="p-2">
                            <Badge className={ticketStatusColor(ticket.status)}>
                              {ticket.status === 'valid' ? 'Valide' : 
                               ticket.status === 'used' ? 'Utilisé' : 
                               ticket.status === 'cancelled' ? 'Annulé' : 'Remboursé'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredTickets.length} tickets
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
                  <h3 className="text-lg font-medium mb-2">Scanner un ticket</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Saisissez la référence du ticket pour vérifier sa validité et enregistrer l'entrée.
                  </p>
                </div>

                <div className="w-full max-w-md p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg mb-8 flex flex-col items-center">
                  <div className="w-full mb-4">
                    <Label htmlFor="ticket-reference" className="mb-2 block">
                      Référence du ticket
                    </Label>
                    <Input
                      id="ticket-reference"
                      placeholder="Saisissez la référence du ticket..."
                      value={scannerInput}
                      onChange={(e) => setScannerInput(e.target.value)}
                      className="mb-4"
                    />
                    <Button 
                      onClick={handleScanTicket} 
                      className="w-full gap-1.5"
                      disabled={!scannerInput.trim()}
                    >
                      <QrCode size={16} />
                      Vérifier le ticket
                    </Button>
                  </div>
                </div>
                
                {scanResult && (
                  <div className="w-full max-w-md">
                    <h3 className="text-lg font-medium mb-4">Résultat du scan</h3>
                    
                    <div className={`flex items-center p-3 border rounded-md ${
                      scanResult.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="mr-3">
                        {scanResult.valid ? (
                          <CheckCircle2 size={24} className="text-green-500" />
                        ) : (
                          <XCircle size={24} className="text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {scanResult.valid ? "Ticket valide" : "Ticket invalide"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {scanResult.message}
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            scanResult.valid 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }>
                            {scanResult.valid ? "Valide" : "Invalide"}
                          </Badge>
                        </div>
                        {scanResult.ticket && (
                          <div className="text-xs text-muted-foreground mt-2">
                            <div>Utilisateur: {scanResult.ticket.userName}</div>
                            <div>Événement: {scanResult.ticket.eventName}</div>
                            <div>Type: {scanResult.ticket.ticketTypeName}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full max-w-md mt-8">
                  <h3 className="text-lg font-medium mb-4">Derniers tickets scannés</h3>
                  
                  <div className="space-y-3">
                    {tickets
                      .filter(ticket => ticket.status === 'used')
                      .slice(0, 3)
                      .map((ticket) => (
                      <div key={ticket.id} className="flex items-center p-3 border rounded-md">
                        <div className="mr-3">
                          <CheckCircle2 size={24} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">TKT-{ticket.id}</div>
                              <div className="text-xs text-muted-foreground">
                                {ticket.userName} • {ticket.eventName}
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Utilisé
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <Clock size={12} className="inline mr-1" />
                            {formatDate(ticket.purchasedAt.toString())}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Analytics - Avec graphiques utilisant les données réelles */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LineChart className="text-primary h-5 w-5" />
                  <div>
                    <CardTitle>Analytics des tickets</CardTitle>
                    <CardDescription>
                      Statistiques et analyses des ventes de tickets basées sur les données réelles
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Statistiques globales */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Vue d'ensemble</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TicketIcon className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Tickets vendus</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        {globalStats.totalTickets}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total tous événements
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Clients uniques</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        {globalStats.uniqueCustomers}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Participants distincts
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-primary">Ar</div>
                        <h4 className="text-sm font-medium">Chiffre d'affaires</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(globalStats.totalRevenue)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total des ventes
                      </div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Taux d'utilisation</h4>
                      </div>
                      <div className="text-2xl font-bold">
                        {formatPercentage(globalStats.usedTickets, globalStats.totalTickets)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tickets utilisés
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphiques principaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Graphique de distribution des statuts */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Répartition des tickets par statut</h4>
                    <DonutChart data={getTicketStatusData()} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>Distribution par statut</div>
                      <div>Total: {globalStats.totalTickets} tickets</div>
                    </div>
                  </div>
                  
                  {/* Graphique de tendance des ventes */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Tendances des ventes dans le temps</h4>
                    <TrendChart tickets={tickets} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>Évolution basée sur les dates d'achat réelles</div>
                      <div>{tickets.length} transactions</div>
                    </div>
                  </div>
                </div>

                {/* Graphiques secondaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance par type de ticket */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Performance par type de ticket</h4>
                    <BarChart data={getTicketTypeSalesData()} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>Ventes par catégorie</div>
                      <div>Capacité vs Ventes réelles</div>
                    </div>
                  </div>

                  {/* Performance des événements */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Performance des événements</h4>
                    <BarChart data={getEventPerformanceData()} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>Top {Math.min(5, events.length)} événements</div>
                      <div>Tickets vendus / Capacité</div>
                    </div>
                  </div>
                </div>

                {selectedEvent && (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Analyse détaillée
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Statistiques de vente */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          Statistiques de vente
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Ventes totales</span>
                            <span className="font-medium">{selectedEvent.ticketsSold} tickets</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Taux de remplissage</span>
                            <span className="font-medium">
                              {formatPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsTotal)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Revenu total</span>
                            <span className="font-medium">{formatCurrency(selectedEvent.revenue)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Panier moyen</span>
                            <span className="font-medium">
                              {selectedEvent.ticketsSold > 0 
                                ? formatCurrency(selectedEvent.revenue / selectedEvent.ticketsSold)
                                : formatCurrency(0)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Répartition par type */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-primary" />
                          Répartition par type
                        </h4>
                        
                        <div className="space-y-2">
                          {getEventTicketTypes(selectedEvent.id).map((ticketType) => (
                            <div key={ticketType.id} className="flex justify-between items-center">
                              <div className="text-sm">{ticketType.name}</div>
                              <div className="text-right">
                                <div className="font-medium">{ticketType.sold} vendus</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatCurrency(ticketType.revenue)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default TicketsManagementPage;