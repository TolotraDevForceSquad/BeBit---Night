// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page.tsx
import React, { useState } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Calendar, Clock, MapPin, Users, DollarSign, Music, Bookmark, AlertCircle, Truck, Coffee, Award, Edit, Trash2, Plus, BarChart3, Share2, Download } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocation } from 'wouter';

// Interfaces pour les entités (structurées comme des tables de base de données)
interface Event {
  id: number;
  title: string;
  date: string;
  status: 'upcoming' | 'planning' | 'past' | 'cancelled';
  reservations: number;
  capacity: number;
  sales: number;
  coverImage: string;
  description: string;
  location: string;
  time: string;
  artists: number[]; // Référence aux IDs des artistes
  ticketTypes: number[]; // Référence aux IDs des types de tickets
  createdAt: string;
  updatedAt: string;
}

interface Artist {
  id: number;
  name: string;
  image: string;
  eventId?: number; // Liaison vers l'événement si nécessaire
}

interface TicketType {
  id: number;
  eventId: number;
  name: string;
  price: number;
  available: number;
  sold: number;
  createdAt: string;
}

interface DemographicGroup {
  id: number;
  eventId: number;
  label: string;
  percentage: number;
  type: 'age' | 'gender';
}

interface Review {
  id: number;
  eventId: number;
  text: string;
  author: string;
  type: string;
  rating?: number;
  createdAt: string;
}

interface SocialShare {
  id: number;
  eventId: number;
  platform: string;
  count: number;
  color: string;
  createdAt: string;
}

// Simulation d'une base de données (objet global avec des "tables")
const mockDatabase = {
  events: [
    {
      id: 1,
      title: "Summer Night Party",
      date: "2025-07-15",
      status: "upcoming",
      reservations: 145,
      capacity: 180,
      sales: 25200000,
      coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
      description: "Une soirée d'été exceptionnelle avec les meilleurs DJ de la ville pour une expérience inoubliable sous les étoiles.",
      location: "Terrasse principale",
      time: "21:00 - 04:00",
      artists: [1, 2], // IDs des artistes
      ticketTypes: [1, 2], // IDs des types de tickets
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-11-01T14:30:00Z"
    },
    {
      id: 2,
      title: "DJ Elektra Live",
      date: "2025-08-22",
      status: "planning",
      reservations: 42,
      capacity: 200,
      sales: 8400000,
      coverImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&h=300&fit=crop",
      description: "DJ Elektra fait son retour avec un set électronique exceptionnel mêlant techno et house progressive.",
      location: "Salle principale",
      time: "22:00 - 05:00",
      artists: [3, 4],
      ticketTypes: [3, 4],
      createdAt: "2025-02-10T09:15:00Z",
      updatedAt: "2025-10-28T16:45:00Z"
    },
    {
      id: 3,
      title: "Techno Revolution",
      date: "2025-04-10",
      status: "past",
      reservations: 175,
      capacity: 200,
      sales: 36750000,
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
      description: "La soirée techno qui a révolutionné la scène locale avec des artistes internationaux et une ambiance électrique.",
      location: "Club entier",
      time: "22:00 - 06:00",
      artists: [5, 6, 7],
      ticketTypes: [5, 6],
      createdAt: "2025-01-05T11:20:00Z",
      updatedAt: "2025-05-15T18:00:00Z"
    },
    {
      id: 4,
      title: "Jazz & Cocktails Night",
      date: "2025-06-05",
      status: "upcoming",
      reservations: 89,
      capacity: 120,
      sales: 15600000,
      coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop",
      description: "Une soirée jazz intimiste avec des cocktails signature dans une ambiance lounge exclusive.",
      location: "Salon VIP",
      time: "20:00 - 02:00",
      artists: [8, 9],
      ticketTypes: [7, 8],
      createdAt: "2025-03-20T13:45:00Z",
      updatedAt: "2025-11-04T12:10:00Z"
    }
  ] as Event[],

  artists: [
    { id: 1, name: "DJ Phoenix", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face" },
    { id: 2, name: "Lisa Groove", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop&crop=face" },
    { id: 3, name: "DJ Elektra", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { id: 4, name: "Mark Vega", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { id: 5, name: "Carl Johnson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { id: 6, name: "Techno Sisters", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
    { id: 7, name: "Max Power", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
    { id: 8, name: "Smooth Jazz Trio", image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=150&h=150&fit=crop&crop=face" },
    { id: 9, name: "Ella Divine", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" }
  ] as Artist[],

  ticketTypes: [
    { id: 1, eventId: 1, name: "Standard", price: 180000, available: 35, sold: 110, createdAt: "2025-01-15T10:00:00Z" },
    { id: 2, eventId: 1, name: "VIP", price: 300000, available: 0, sold: 35, createdAt: "2025-01-15T10:00:00Z" },
    { id: 3, eventId: 2, name: "Entrée simple", price: 200000, available: 158, sold: 42, createdAt: "2025-02-10T09:15:00Z" },
    { id: 4, eventId: 2, name: "Table VIP", price: 1500000, available: 5, sold: 0, createdAt: "2025-02-10T09:15:00Z" },
    { id: 5, eventId: 3, name: "Regular", price: 200000, available: 0, sold: 150, createdAt: "2025-01-05T11:20:00Z" },
    { id: 6, eventId: 3, name: "Premium", price: 350000, available: 0, sold: 25, createdAt: "2025-01-05T11:20:00Z" },
    { id: 7, eventId: 4, name: "Standard", price: 120000, available: 31, sold: 89, createdAt: "2025-03-20T13:45:00Z" },
    { id: 8, eventId: 4, name: "Table Privée", price: 800000, available: 3, sold: 2, createdAt: "2025-03-20T13:45:00Z" }
  ] as TicketType[],

  demographicGroups: [
    { id: 1, eventId: 1, label: '18-24 ans', percentage: 35, type: 'age' as const },
    { id: 2, eventId: 1, label: '25-34 ans', percentage: 45, type: 'age' as const },
    { id: 3, eventId: 1, label: '35-44 ans', percentage: 15, type: 'age' as const },
    { id: 4, eventId: 1, label: '45+ ans', percentage: 5, type: 'age' as const },
    { id: 5, eventId: 1, label: 'Hommes', percentage: 60, type: 'gender' as const },
    { id: 6, eventId: 1, label: 'Femmes', percentage: 40, type: 'gender' as const }
    // Note: Pour simplifier, on réutilise pour tous les événements ; en DB réelle, dupliquer par eventId
  ] as DemographicGroup[],

  reviews: [
    { 
      id: 1, 
      eventId: 1, 
      text: "Excellente soirée, l'ambiance était électrique et l'organisation parfaite.", 
      author: "Marie L.", 
      type: "Utilisateur premium", 
      rating: 5, 
      createdAt: "2025-07-16T09:30:00Z" 
    },
    { 
      id: 2, 
      eventId: 1, 
      text: "Les DJ étaient incroyables, mais un peu trop de monde à mon goût.", 
      author: "Thomas M.", 
      type: "Première visite", 
      rating: 4, 
      createdAt: "2025-07-17T14:20:00Z" 
    }
  ] as Review[],

  socialShares: [
    { id: 1, eventId: 1, platform: 'Facebook', count: 124, color: 'bg-blue-600', createdAt: "2025-07-15T20:00:00Z" },
    { id: 2, eventId: 1, platform: 'Twitter', count: 87, color: 'bg-sky-500', createdAt: "2025-07-15T20:00:00Z" },
    { id: 3, eventId: 1, platform: 'Instagram', count: 203, color: 'bg-pink-600', createdAt: "2025-07-15T20:00:00Z" }
  ] as SocialShare[]
};

// Fonctions utilitaires pour "requêter" la DB mock
const getEventById = (id: number): Event | undefined => mockDatabase.events.find(e => e.id === id);
const getArtistsByEventId = (eventId: number): Artist[] => mockDatabase.artists.filter(a => mockDatabase.events.find(e => e.id === eventId)?.artists.includes(a.id) || false);
const getTicketTypesByEventId = (eventId: number): TicketType[] => mockDatabase.ticketTypes.filter(t => t.eventId === eventId);
const getDemographicGroupsByEventId = (eventId: number): DemographicGroup[] => mockDatabase.demographicGroups.filter(d => d.eventId === eventId);
const getReviewsByEventId = (eventId: number): Review[] => mockDatabase.reviews.filter(r => r.eventId === eventId);
const getSocialSharesByEventId = (eventId: number): SocialShare[] => mockDatabase.socialShares.filter(s => s.eventId === eventId);

// Constante pour le multiplicateur des ventes additionnelles
const ADDITIONAL_SALES_MULTIPLIER = 0.35;

// Fonction pour formatter les dates en français
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Fonction pour formatter les montants en Ariary
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-MG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' Ar';
};

// Composant pour afficher un événement avec des actions (adapté pour utiliser les données liées)
const EventCard: React.FC<{ 
  event: Event, 
  artists: Artist[],
  ticketTypes: TicketType[],
  onManage: (event: Event) => void, 
  onViewSummary: (event: Event) => void,
  onEdit: (event: Event) => void,
  onDelete: (event: Event) => void 
}> = ({ 
  event, 
  artists,
  ticketTypes,
  onManage, 
  onViewSummary,
  onEdit,
  onDelete 
}) => {
  const statusColors: Record<string, string> = {
    upcoming: "bg-green-600 text-white",
    planning: "bg-blue-600 text-white",
    past: "border text-muted-foreground",
    cancelled: "bg-red-600 text-white"
  };

  const statusLabels: Record<string, string> = {
    upcoming: "À venir",
    planning: "En planification",
    past: "Passé",
    cancelled: "Annulé"
  };

  // Calcul des réservations et ventes à partir des tickets liés
  const reservations = ticketTypes.reduce((acc, t) => acc + t.sold, 0);
  const sales = ticketTypes.reduce((acc, t) => acc + (t.price * t.sold), 0);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-40 relative overflow-hidden">
        <img 
          src={event.coverImage} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status]}`}>
            {statusLabels[event.status]}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{event.location}</span>
        </div>

        <div className="flex -space-x-2 mb-3">
          {artists.slice(0, 3).map((artist, index) => (
            <img
              key={artist.id}
              src={artist.image}
              alt={artist.name}
              className="w-6 h-6 rounded-full border-2 border-background object-cover"
            />
          ))}
          {artists.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
              +{artists.length - 3}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Réservations</span>
            <span className="text-sm font-medium">{reservations} / {event.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {event.status === 'past' ? 'Revenus totaux' : 'Vente de tickets'}
            </span>
            <span className="text-sm font-medium">{formatCurrency(sales)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          {(event.status === 'upcoming' || event.status === 'planning') ? (
            <Button 
              className="flex-1"
              onClick={() => onManage(event)}
            >
              Gérer
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => onViewSummary(event)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </Button>
          )}
          <Button 
            variant="outline"
            size="icon"
            onClick={() => onViewSummary(event)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ClubEventsPage: React.FC = () => {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>(mockDatabase.events); // Chargement initial depuis la "DB"
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null); // Changé en ID au lieu d'index
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
    time: '21:00 - 04:00'
  });

  const [editEvent, setEditEvent] = useState({
    title: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
    time: '',
    status: 'planning' as 'upcoming' | 'planning' | 'past' | 'cancelled'
  });

  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    available: ''
  });

  const [editingTicket, setEditingTicket] = useState({
    name: '',
    price: '',
    available: ''
  });

  const [manageDetails, setManageDetails] = useState<Event>({
    id: 0,
    title: '',
    date: '',
    status: 'planning',
    reservations: 0,
    capacity: 0,
    sales: 0,
    coverImage: '',
    description: '',
    location: '',
    time: '',
    artists: [],
    ticketTypes: [],
    createdAt: '',
    updatedAt: ''
  });

  const [promoData, setPromoData] = useState({
    title: '',
    desc: '',
    start: '',
    end: '',
    discount: '',
    code: '',
    channels: {
      app: true,
      email: true,
      sms: false,
      social: true,
      push: false
    }
  });

  // Fonction pour créer un nouvel événement (simule insertion DB)
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.capacity) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const capacityNum = parseInt(newEvent.capacity);
    if (isNaN(capacityNum)) {
      toast({
        title: "Erreur",
        description: "La capacité doit être un nombre valide",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const newEventId = Math.max(...events.map(e => e.id), 0) + 1;
    const newEventData: Event = {
      id: newEventId,
      title: newEvent.title,
      date: newEvent.date,
      status: "planning",
      reservations: 0,
      capacity: capacityNum,
      sales: 0,
      coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&h=300&fit=crop",
      description: newEvent.description,
      location: newEvent.location,
      time: newEvent.time,
      artists: [], // À lier plus tard
      ticketTypes: [],
      createdAt: now,
      updatedAt: now
    };

    // Simuler insertion : ajouter un ticket par défaut
    const newTicketId = Math.max(...mockDatabase.ticketTypes.map(t => t.id), 0) + 1;
    const defaultTicket: TicketType = {
      id: newTicketId,
      eventId: newEventId,
      name: "Standard", 
      price: 150000, 
      available: capacityNum, 
      sold: 0,
      createdAt: now
    };
    mockDatabase.ticketTypes.push(defaultTicket);
    newEventData.ticketTypes = [newTicketId];

    setEvents([...events, newEventData]);
    
    toast({
      title: "🎉 Événement créé !",
      description: "Votre nouvel événement a été créé avec succès",
    });
    
    // Réinitialiser le formulaire
    setNewEvent({
      title: '',
      date: '',
      location: '',
      capacity: '',
      description: '',
      time: '21:00 - 04:00'
    });
    
    setIsCreateModalOpen(false);
  };

  // Mise à jour d'un événement (simule update DB)
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEditEvent({
      title: event.title,
      date: event.date,
      location: event.location,
      capacity: event.capacity.toString(),
      description: event.description,
      time: event.time,
      status: event.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    
    const capacityNum = parseInt(editEvent.capacity);
    if (isNaN(capacityNum)) {
      toast({
        title: "Erreur",
        description: "La capacité doit être un nombre valide",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date().toISOString();
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id 
        ? { 
            ...event, 
            title: editEvent.title,
            date: editEvent.date,
            location: editEvent.location,
            capacity: capacityNum,
            description: editEvent.description,
            time: editEvent.time,
            status: editEvent.status,
            updatedAt: now
          }
        : event
    );
    
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvents.find(e => e.id === selectedEvent.id) || null);
    
    toast({
      title: "✅ Événement modifié",
      description: "Les détails de l'événement ont été mis à jour avec succès",
    });
    setIsEditModalOpen(false);
  };

  // Suppression d'un événement (simule delete DB, cascade sur tickets/artists si nécessaire)
  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (!selectedEvent) return;
    
    // Simuler suppression en cascade
    mockDatabase.ticketTypes = mockDatabase.ticketTypes.filter(t => t.eventId !== selectedEvent.id);
    // Pour les artistes, on pourrait les dissocier au lieu de supprimer
    
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    
    toast({
      title: "🗑️ Événement supprimé",
      description: "L'événement a été supprimé avec succès",
    });
    setIsDeleteModalOpen(false);
  };

  const handleManageEvent = (event: Event) => {
    setSelectedEvent(event);
    setManageDetails({...event});
    setPromoData({
      title: '',
      desc: '',
      start: '',
      end: '',
      discount: '',
      code: '',
      channels: {
        app: true,
        email: true,
        sms: false,
        social: true,
        push: false
      }
    });
    setIsManageModalOpen(true);
  };

  const handleViewSummary = (event: Event) => {
    setSelectedEvent(event);
    setIsSummaryModalOpen(true);
  };

  // Ajout d'un ticket (simule insertion DB)
  const handleAddTicket = () => {
    if (!newTicket.name || !newTicket.price || !newTicket.available) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseInt(newTicket.price);
    const availableNum = parseInt(newTicket.available);
    if (isNaN(priceNum) || isNaN(availableNum) || priceNum <= 0 || availableNum < 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être un nombre positif et la quantité un nombre non-négatif",
        variant: "destructive"
      });
      return;
    }

    if (!selectedEvent) return;

    const now = new Date().toISOString();
    const newTicketId = Math.max(...mockDatabase.ticketTypes.map(t => t.id), 0) + 1;
    const newTicketType: TicketType = {
      id: newTicketId,
      eventId: selectedEvent.id,
      name: newTicket.name,
      price: priceNum,
      available: availableNum,
      sold: 0,
      createdAt: now
    };

    mockDatabase.ticketTypes.push(newTicketType);

    const updatedTicketTypesIds = [...selectedEvent.ticketTypes, newTicketId];
    const updatedEvent = { ...selectedEvent, ticketTypes: updatedTicketTypesIds };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));

    toast({
      title: "🎫 Type de ticket ajouté",
      description: "Le nouveau type de ticket a été ajouté avec succès",
    });

    // Réinitialiser le formulaire
    setNewTicket({
      name: '',
      price: '',
      available: ''
    });
    
    setIsAddTicketModalOpen(false);
  };

  // Modification d'un ticket (simule update DB)
  const handleEditTicket = (ticketId: number) => {
    const ticketToEdit = mockDatabase.ticketTypes.find(t => t.id === ticketId);
    if (!ticketToEdit || !selectedEvent || !editingTicket.name || !editingTicket.price || !editingTicket.available) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const priceNum = parseInt(editingTicket.price);
    const availableNum = parseInt(editingTicket.available);
    if (isNaN(priceNum) || isNaN(availableNum) || priceNum <= 0 || availableNum < 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être un nombre positif et la quantité un nombre non-négatif",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const updatedTicketTypes = mockDatabase.ticketTypes.map(t =>
      t.id === ticketId
        ? {
            ...t,
            name: editingTicket.name,
            price: priceNum,
            available: availableNum,
            updatedAt: now // Ajout d'un updatedAt si on étend l'interface
          }
        : t
    );

    mockDatabase.ticketTypes = updatedTicketTypes;

    toast({
      title: "🎫 Type de ticket modifié",
      description: "Le type de ticket a été mis à jour avec succès",
    });

    setIsEditTicketModalOpen(false);
    setEditingTicketId(null);
    setEditingTicket({ name: '', price: '', available: '' });
  };

  // Suppression d'un artiste (dissociation)
  const handleDeleteArtist = (artistId: number) => {
    if (!selectedEvent) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'artiste ?`)) return;

    const newArtistsIds = selectedEvent.artists.filter(id => id !== artistId);

    const updatedEvent = { ...selectedEvent, artists: newArtistsIds };
    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => 
      e.id === selectedEvent.id ? updatedEvent : e
    ));

    toast({
      title: "🗑️ Artiste supprimé",
      description: "L'artiste a été supprimé de l'événement",
    });
  };

  const handleUpdateEventDetails = () => {
    if (!selectedEvent) return;

    const capacityNum = manageDetails.capacity;
    if (isNaN(capacityNum) || capacityNum < 0) {
      toast({
        title: "Erreur",
        description: "La capacité doit être un nombre non-négatif",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const updatedEvent: Event = {
      ...manageDetails,
      id: selectedEvent.id,
      reservations: selectedEvent.reservations,
      sales: selectedEvent.sales,
      coverImage: selectedEvent.coverImage,
      artists: selectedEvent.artists,
      ticketTypes: selectedEvent.ticketTypes,
      updatedAt: now
    };

    setSelectedEvent(updatedEvent);
    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));

    toast({
      title: "✅ Événement mis à jour",
      description: "Les détails de l'événement ont été mis à jour avec succès",
    });
    setIsManageModalOpen(false);
  };

  const handlePublishPromotion = () => {
    if (!selectedEvent) return;

    const activeChannels = Object.keys(promoData.channels).filter(key => promoData.channels[key as keyof typeof promoData.channels]);
    
    toast({
      title: "🎯 Promotion publiée !",
      description: `La promotion "${promoData.title || 'Sans titre'}" pour "${selectedEvent.title}" a été publiée avec succès sur les canaux: ${activeChannels.join(', ') || 'aucun'}.`,
    });
  };

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Recherche dans les noms d'artistes liés
      getArtistsByEventId(event.id).some(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(event => 
      activeTab === 'all' || 
      (activeTab === 'upcoming' && event.status === 'upcoming') ||
      (activeTab === 'planning' && event.status === 'planning') ||
      (activeTab === 'past' && event.status === 'past')
    );

  // Statistiques calculées (en utilisant les données liées)
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalRevenue = events.reduce((acc, event) => {
    const tickets = getTicketTypesByEventId(event.id);
    return acc + tickets.reduce((sum, t) => sum + (t.price * t.sold), 0);
  }, 0);
  const totalCapacity = events.reduce((acc, event) => acc + event.capacity, 0);
  const totalReservations = events.reduce((acc, event) => {
    const tickets = getTicketTypesByEventId(event.id);
    return acc + tickets.reduce((sum, t) => sum + t.sold, 0);
  }, 0);
  const averageFillRate = totalCapacity > 0 
    ? Math.round((totalReservations / totalCapacity) * 100) 
    : 0;
  const uniqueArtists = new Set(events.flatMap(event => getArtistsByEventId(event.id).map(a => a.id))).size;

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Événements du club</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Gérez vos événements passés et à venir • {totalEvents} événements au total
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Total d'événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalEvents}</div>
              <p className="text-xs text-blue-600 mt-1">
                {upcomingEvents} à venir
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenus totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-green-600 mt-1">
                Tous événements confondus
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Taux de remplissage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{averageFillRate}%</div>
              <p className="text-xs text-purple-600 mt-1">
                Moyenne sur tous les événements
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <Music className="h-4 w-4 mr-2" />
                Artistes invités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{uniqueArtists}</div>
              <p className="text-xs text-orange-600 mt-1">
                Artistes uniques programmés
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs 
            defaultValue="all" 
            className="w-full sm:w-auto"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">Tous ({events.length})</TabsTrigger>
              <TabsTrigger value="upcoming">À venir ({events.filter(e => e.status === 'upcoming').length})</TabsTrigger>
              <TabsTrigger value="planning">Planification ({events.filter(e => e.status === 'planning').length})</TabsTrigger>
              <TabsTrigger value="past">Passés ({events.filter(e => e.status === 'past').length})</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Rechercher un événement, artiste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-muted">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Aucun événement trouvé</h3>
            <p className="mt-2 text-muted-foreground">
              Aucun événement ne correspond à vos critères de recherche
            </p>
            <div className="mt-4 space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
              >
                Effacer les filtres
              </Button>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
              >
                Créer un événement
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => {
              const linkedArtists = getArtistsByEventId(event.id);
              const linkedTickets = getTicketTypesByEventId(event.id);
              return (
                <EventCard 
                  key={event.id}
                  event={event}
                  artists={linkedArtists}
                  ticketTypes={linkedTickets}
                  onManage={handleManageEvent}
                  onViewSummary={handleViewSummary}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modale de création d'événement (inchangée, mais utilise les nouvelles interfaces) */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel événement pour votre club
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement *</Label>
              <Input
                id="title"
                placeholder="Soirée Summer Vibes 2025"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="200"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Horaires</Label>
                <Input
                  id="time"
                  placeholder="21:00 - 04:00"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lieu dans le club</Label>
                <Select 
                  value={newEvent.location}
                  onValueChange={(value) => setNewEvent({...newEvent, location: value})}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Sélectionner un lieu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salle principale">Salle principale</SelectItem>
                    <SelectItem value="Terrasse principale">Terrasse principale</SelectItem>
                    <SelectItem value="Salon VIP">Salon VIP</SelectItem>
                    <SelectItem value="Club entier">Club entier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Décrivez votre événement en quelques phrases..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
            <Button type="submit" onClick={handleCreateEvent}>Créer l'événement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition d'événement (adaptée) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre événement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titre de l'événement *</Label>
              <Input
                id="edit-title"
                value={editEvent.title}
                onChange={(e) => setEditEvent({...editEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({...editEvent, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacité *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editEvent.capacity}
                  onChange={(e) => setEditEvent({...editEvent, capacity: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-time">Horaires</Label>
                <Input
                  id="edit-time"
                  value={editEvent.time}
                  onChange={(e) => setEditEvent({...editEvent, time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select 
                  value={editEvent.status}
                  onValueChange={(value: 'upcoming' | 'planning' | 'past' | 'cancelled') => 
                    setEditEvent({...editEvent, status: value})
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">En planification</SelectItem>
                    <SelectItem value="upcoming">À venir</SelectItem>
                    <SelectItem value="past">Passé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Lieu dans le club</Label>
              <Select 
                value={editEvent.location}
                onValueChange={(value) => setEditEvent({...editEvent, location: value})}
              >
                <SelectTrigger id="edit-location">
                  <SelectValue placeholder="Sélectionner un lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salle principale">Salle principale</SelectItem>
                  <SelectItem value="Terrasse principale">Terrasse principale</SelectItem>
                  <SelectItem value="Salon VIP">Salon VIP</SelectItem>
                  <SelectItem value="Club entier">Club entier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                rows={3}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={editEvent.description}
                onChange={(e) => setEditEvent({...editEvent, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateEvent}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de confirmation de suppression (inchangée) */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'événement "{selectedEvent?.title}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvent}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'ajout de type de ticket (adaptée pour IDs) */}
      <Dialog open={isAddTicketModalOpen} onOpenChange={setIsAddTicketModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un type de ticket</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau type de ticket à l'événement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-name">Nom du type de ticket *</Label>
              <Input
                id="ticket-name"
                placeholder="Ex: VIP Premium"
                value={newTicket.name}
                onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-price">Prix (Ar) *</Label>
              <Input
                id="ticket-price"
                type="number"
                placeholder="250000"
                value={newTicket.price}
                onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-available">Quantité disponible *</Label>
              <Input
                id="ticket-available"
                type="number"
                placeholder="50"
                value={newTicket.available}
                onChange={(e) => setNewTicket({...newTicket, available: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTicketModalOpen(false)}>Annuler</Button>
            <Button onClick={handleAddTicket}>Ajouter le ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de modification de type de ticket (adaptée pour ID) */}
      <Dialog open={isEditTicketModalOpen} onOpenChange={setIsEditTicketModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le type de ticket</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de ticket sélectionné
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ticket-name">Nom du type de ticket *</Label>
              <Input
                id="edit-ticket-name"
                placeholder="Ex: VIP Premium"
                value={editingTicket.name}
                onChange={(e) => setEditingTicket({...editingTicket, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-ticket-price">Prix (Ar) *</Label>
              <Input
                id="edit-ticket-price"
                type="number"
                placeholder="250000"
                value={editingTicket.price}
                onChange={(e) => setEditingTicket({...editingTicket, price: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-ticket-available">Quantité disponible *</Label>
              <Input
                id="edit-ticket-available"
                type="number"
                placeholder="50"
                value={editingTicket.available}
                onChange={(e) => setEditingTicket({...editingTicket, available: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTicketModalOpen(false)}>Annuler</Button>
            <Button onClick={() => editingTicketId && handleEditTicket(editingTicketId)}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de gestion d'événement (adaptée pour données liées) */}
      {selectedEvent && (
        <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gérer l'événement: {selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Modifiez les détails ou gérez les tickets de cet événement
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="artists">Artistes</TabsTrigger>
                <TabsTrigger value="promo">Promotion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Titre de l'événement</Label>
                    <Input 
                      id="event-title" 
                      value={manageDetails.title} 
                      onChange={(e) => setManageDetails({...manageDetails, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input 
                      id="event-date" 
                      type="date"
                      value={manageDetails.date} 
                      onChange={(e) => setManageDetails({...manageDetails, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Horaires</Label>
                    <Input 
                      id="event-time" 
                      value={manageDetails.time} 
                      onChange={(e) => setManageDetails({...manageDetails, time: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Lieu</Label>
                    <Select 
                      value={manageDetails.location}
                      onValueChange={(value) => setManageDetails({...manageDetails, location: value})}
                    >
                      <SelectTrigger id="event-location">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salle principale">Salle principale</SelectItem>
                        <SelectItem value="Terrasse principale">Terrasse principale</SelectItem>
                        <SelectItem value="Salon VIP">Salon VIP</SelectItem>
                        <SelectItem value="Club entier">Club entier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-description">Description</Label>
                    <textarea 
                      id="event-description" 
                      rows={4} 
                      value={manageDetails.description}
                      onChange={(e) => setManageDetails({...manageDetails, description: e.target.value})}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">Capacité</Label>
                    <Input 
                      id="event-capacity" 
                      type="number" 
                      value={manageDetails.capacity} 
                      onChange={(e) => setManageDetails({...manageDetails, capacity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-status">Statut</Label>
                    <Select 
                      value={manageDetails.status}
                      onValueChange={(value: 'upcoming' | 'planning' | 'past' | 'cancelled') => 
                        setManageDetails({...manageDetails, status: value})
                      }
                    >
                      <SelectTrigger id="event-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">En planification</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="past">Passé</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Annuler</Button>
                  <Button onClick={handleUpdateEventDetails}>Enregistrer les modifications</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="tickets" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Type de ticket</th>
                        <th className="text-left py-3 font-medium">Prix</th>
                        <th className="text-left py-3 font-medium">Vendus</th>
                        <th className="text-left py-3 font-medium">Disponibles</th>
                        <th className="text-left py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTicketTypesByEventId(selectedEvent.id).map((ticket) => (
                        <tr key={ticket.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">{ticket.name}</td>
                          <td className="py-3">{formatCurrency(ticket.price)}</td>
                          <td className="py-3">{ticket.sold}</td>
                          <td className="py-3">{ticket.available}</td>
                          <td className="py-3 space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setEditingTicketId(ticket.id);
                                setEditingTicket({
                                  name: ticket.name,
                                  price: ticket.price.toString(),
                                  available: ticket.available.toString()
                                });
                                setIsEditTicketModalOpen(true);
                              }}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => {
                                if (confirm(`Êtes-vous sûr de vouloir supprimer le type de ticket "${ticket.name}" ?`)) {
                                  mockDatabase.ticketTypes = mockDatabase.ticketTypes.filter(t => t.id !== ticket.id);
                                  toast({
                                    title: "🗑️ Type de ticket supprimé",
                                    description: "Le type de ticket a été supprimé avec succès",
                                  });
                                }
                              }}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddTicketModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un type de ticket
                </Button>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Fermer</Button>
                  <Button onClick={() => {
                    toast({
                      title: "Tickets mis à jour",
                      description: "La configuration des tickets a été mise à jour avec succès",
                    });
                  }}>Enregistrer les modifications</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="artists" className="space-y-4">
                <div className="space-y-4">
                  {getArtistsByEventId(selectedEvent.id).map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{artist.name}</p>
                          <p className="text-sm text-muted-foreground">Performance confirmée</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteArtist(artist.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/find-artists");
                    toast({
                      title: "Redirection",
                      description: "Ouverture de la page de recherche d'artistes...",
                    });
                  }}>
                    <Music className="h-4 w-4 mr-2" />
                    Trouver des artistes
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/invitations");
                    toast({
                      title: "Redirection",
                      description: "Ouverture des invitations en cours...",
                    });
                  }}>
                    <Users className="h-4 w-4 mr-2" />
                    Invitations en cours
                  </Button>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Fermer</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="promo" className="space-y-4">
                {/* Contenu de la promo inchangé */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-title">Titre de la promotion</Label>
                    <Input 
                      id="promo-title" 
                      placeholder="Ex: Early Bird Special - 20% de réduction"
                      value={promoData.title}
                      onChange={(e) => setPromoData(prev => ({...prev, title: e.target.value}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="promo-desc">Description</Label>
                    <textarea 
                      id="promo-desc" 
                      rows={3} 
                      placeholder="Décrivez cette offre promotionnelle..."
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={promoData.desc}
                      onChange={(e) => setPromoData(prev => ({...prev, desc: e.target.value}))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-start">Date de début</Label>
                      <Input 
                        id="promo-start" 
                        type="date"
                        value={promoData.start}
                        onChange={(e) => setPromoData(prev => ({...prev, start: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-end">Date de fin</Label>
                      <Input 
                        id="promo-end" 
                        type="date"
                        value={promoData.end}
                        onChange={(e) => setPromoData(prev => ({...prev, end: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">Réduction (%)</Label>
                      <Input 
                        id="promo-discount" 
                        type="number" 
                        min="1" 
                        max="100" 
                        placeholder="20"
                        value={promoData.discount}
                        onChange={(e) => setPromoData(prev => ({...prev, discount: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Code promo (optionnel)</Label>
                      <Input 
                        id="promo-code" 
                        placeholder="SUMMER2025"
                        value={promoData.code}
                        onChange={(e) => setPromoData(prev => ({...prev, code: e.target.value}))}
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">Canaux de distribution</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="channel-app" 
                          className="rounded" 
                          checked={promoData.channels.app}
                          onChange={(e) => setPromoData(prev => ({...prev, channels: {...prev.channels, app: e.target.checked}}))}
                        />
                        <label htmlFor="channel-app">Application</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="channel-email" 
                          className="rounded" 
                          checked={promoData.channels.email}
                          onChange={(e) => setPromoData(prev => ({...prev, channels: {...prev.channels, email: e.target.checked}}))}
                        />
                        <label htmlFor="channel-email">Email</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="channel-sms" 
                          className="rounded" 
                          checked={promoData.channels.sms}
                          onChange={(e) => setPromoData(prev => ({...prev, channels: {...prev.channels, sms: e.target.checked}}))}
                        />
                        <label htmlFor="channel-sms">SMS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="channel-social" 
                          className="rounded" 
                          checked={promoData.channels.social}
                          onChange={(e) => setPromoData(prev => ({...prev, channels: {...prev.channels, social: e.target.checked}}))}
                        />
                        <label htmlFor="channel-social">Réseaux sociaux</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="channel-push" 
                          className="rounded" 
                          checked={promoData.channels.push}
                          onChange={(e) => setPromoData(prev => ({...prev, channels: {...prev.channels, push: e.target.checked}}))}
                        />
                        <label htmlFor="channel-push">Notifications push</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Annuler</Button>
                  <Button onClick={handlePublishPromotion}>Publier la promotion</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Modale de récapitulatif d'événement (adaptée pour données liées) */}
      {selectedEvent && (
        <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Récapitulatif: {selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Vue d'ensemble de l'événement et de ses performances
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Taux de remplissage</CardDescription>
                  <CardTitle className="text-2xl">
                    {selectedEvent.capacity > 0 ? Math.round((selectedEvent.reservations / selectedEvent.capacity) * 100) : 0}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {getTicketTypesByEventId(selectedEvent.id).reduce((acc, t) => acc + t.sold, 0)} participants sur {selectedEvent.capacity} places
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Revenu total</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(getTicketTypesByEventId(selectedEvent.id).reduce((acc, t) => acc + (t.price * t.sold), 0))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {getTicketTypesByEventId(selectedEvent.id).reduce((acc, t) => acc + t.sold, 0)} tickets vendus
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ventes additionnelles</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedEvent.sales * ADDITIONAL_SALES_MULTIPLIER)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Boissons, nourriture et autres
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informations de l'événement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Lieu</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Artistes</p>
                      <p className="text-sm text-muted-foreground">{getArtistsByEventId(selectedEvent.id).map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Analyse des ventes de tickets</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Type de ticket</th>
                      <th className="text-left py-2 font-medium">Prix</th>
                      <th className="text-left py-2 font-medium">Vendus</th>
                      <th className="text-left py-2 font-medium">Revenu</th>
                      <th className="text-left py-2 font-medium">% du total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTicketTypesByEventId(selectedEvent.id).map((ticket) => {
                      const totalSales = getTicketTypesByEventId(selectedEvent.id).reduce((acc, t) => acc + (t.price * t.sold), 0);
                      const ticketRevenue = ticket.price * ticket.sold;
                      return (
                        <tr key={ticket.id} className="border-b">
                          <td className="py-2">{ticket.name}</td>
                          <td className="py-2">{formatCurrency(ticket.price)}</td>
                          <td className="py-2">{ticket.sold}</td>
                          <td className="py-2">{formatCurrency(ticketRevenue)}</td>
                          <td className="py-2">
                            {totalSales > 0 ? Math.round((ticketRevenue / totalSales) * 100) : 0}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Répartition démographique</h3>
                  <div className="space-y-2">
                    {getDemographicGroupsByEventId(selectedEvent.id).filter(d => d.type === 'age').map((group) => (
                      <div key={group.id}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{group.label}</span>
                          <span className="text-sm font-medium">{group.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${group.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    {getDemographicGroupsByEventId(selectedEvent.id).filter(d => d.type === 'gender').map((gender) => (
                      <div key={gender.id} className="text-center">
                        <p className="text-xl font-medium">{gender.percentage}%</p>
                        <p className="text-sm text-muted-foreground">{gender.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Avis et engagement</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Award key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 font-medium">
                        {getReviewsByEventId(selectedEvent.id).reduce((acc, r) => acc + (r.rating || 0), 0) / getReviewsByEventId(selectedEvent.id).length || 0}/5
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">({getReviewsByEventId(selectedEvent.id).length} avis)</span>
                    </div>
                    
                    <div className="space-y-3 mt-3">
                      {getReviewsByEventId(selectedEvent.id).map((review) => (
                        <div key={review.id} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm italic">{review.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{review.author} - {review.type}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Partages sur les réseaux sociaux</h4>
                      <div className="flex space-x-3">
                        {getSocialSharesByEventId(selectedEvent.id).map((share) => (
                          <div key={share.id} className="flex items-center space-x-1">
                            <div className={`h-6 w-6 rounded-full ${share.color} flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">
                                {share.platform === 'Facebook' ? 'f' : share.platform === 'Twitter' ? 't' : 'i'}
                              </span>
                            </div>
                            <span className="text-sm">{share.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSummaryModalOpen(false)}>Fermer</Button>
              <Button onClick={() => {
                toast({
                  title: "📊 Rapport exporté",
                  description: "Le rapport a été exporté au format PDF",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Exporter le rapport
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ResponsiveLayout>
  );
};

export default ClubEventsPage;