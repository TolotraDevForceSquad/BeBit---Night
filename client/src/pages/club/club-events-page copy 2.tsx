// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page.tsx
import React, { useState } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Calendar, Clock, MapPin, Users, DollarSign, Music, Bookmark, AlertCircle, Truck, Coffee, Award, Edit, Trash2, Plus, BarChart3, Share2, Download, X } from 'lucide-react';
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

// Type définition pour un événement
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
  artists: string[];
  artistImages: string[];
  ticketTypes: {
    name: string;
    price: number;
    available: number;
    sold: number;
  }[];
}

// Données initiales avec des images réelles
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Summer Night Party",
    date: "15 juillet 2025",
    status: "upcoming",
    reservations: 145,
    capacity: 180,
    sales: 25200000,
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
    description: "Une soirée d'été exceptionnelle avec les meilleurs DJ de la ville pour une expérience inoubliable sous les étoiles.",
    location: "Terrasse principale",
    time: "21:00 - 04:00",
    artists: ["DJ Phoenix", "Lisa Groove"],
    artistImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop&crop=face"
    ],
    ticketTypes: [
      { name: "Standard", price: 180000, available: 35, sold: 110 },
      { name: "VIP", price: 300000, available: 0, sold: 35 }
    ]
  },
  {
    id: 2,
    title: "DJ Elektra Live",
    date: "22 août 2025",
    status: "planning",
    reservations: 42,
    capacity: 200,
    sales: 8400000,
    coverImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&h=300&fit=crop",
    description: "DJ Elektra fait son retour avec un set électronique exceptionnel mêlant techno et house progressive.",
    location: "Salle principale",
    time: "22:00 - 05:00",
    artists: ["DJ Elektra", "Mark Vega"],
    artistImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    ],
    ticketTypes: [
      { name: "Entrée simple", price: 200000, available: 158, sold: 42 },
      { name: "Table VIP", price: 1500000, available: 5, sold: 0 }
    ]
  },
  {
    id: 3,
    title: "Techno Revolution",
    date: "10 avril 2025",
    status: "past",
    reservations: 175,
    capacity: 200,
    sales: 36750000,
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
    description: "La soirée techno qui a révolutionné la scène locale avec des artistes internationaux et une ambiance électrique.",
    location: "Club entier",
    time: "22:00 - 06:00",
    artists: ["Carl Johnson", "Techno Sisters", "Max Power"],
    artistImages: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
    ],
    ticketTypes: [
      { name: "Regular", price: 200000, available: 0, sold: 150 },
      { name: "Premium", price: 350000, available: 0, sold: 25 }
    ]
  },
  {
    id: 4,
    title: "Jazz & Cocktails Night",
    date: "5 juin 2025",
    status: "upcoming",
    reservations: 89,
    capacity: 120,
    sales: 15600000,
    coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop",
    description: "Une soirée jazz intimiste avec des cocktails signature dans une ambiance lounge exclusive.",
    location: "Salon VIP",
    time: "20:00 - 02:00",
    artists: ["Smooth Jazz Trio", "Ella Divine"],
    artistImages: [
      "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    ],
    ticketTypes: [
      { name: "Standard", price: 120000, available: 31, sold: 89 },
      { name: "Table Privée", price: 800000, available: 3, sold: 2 }
    ]
  }
];

// Constantes pour les URLs d'images par défaut
const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&h=300&fit=crop";

// Constantes pour les chaînes de caractères UI (français)
const UI_STRINGS = {
  pageTitle: "Événements du club",
  pageSubtitle: "Gérez vos événements passés et à venir • {totalEvents} événements au total",
  createEventButton: "Créer un événement",
  searchPlaceholder: "Rechercher un événement, artiste...",
  noEventsTitle: "Aucun événement trouvé",
  noEventsDescription: "Aucun événement ne correspond à vos critères de recherche",
  clearFilters: "Effacer les filtres",
  stats: {
    totalEvents: {
      title: "Total d'événements",
      subtitle: "{upcomingEvents} à venir"
    },
    totalRevenue: {
      title: "Revenus totaux",
      subtitle: "Tous événements confondus"
    },
    fillRate: {
      title: "Taux de remplissage",
      subtitle: "Moyenne sur tous les événements"
    },
    uniqueArtists: {
      title: "Artistes invités",
      subtitle: "Artistes uniques programmés"
    }
  },
  tabs: {
    all: "Tous ({count})",
    upcoming: "À venir ({count})",
    planning: "Planification ({count})",
    past: "Passés ({count})"
  },
  status: {
    upcoming: "À venir",
    planning: "En planification",
    past: "Passé",
    cancelled: "Annulé"
  },
  eventCard: {
    reservations: "Réservations",
    sales: "Vente de tickets",
    pastSales: "Revenus totaux",
    manage: "Gérer",
    stats: "Stats"
  },
  createModal: {
    title: "Créer un nouvel événement",
    description: "Remplissez les informations pour créer un nouvel événement pour votre club",
    titleLabel: "Titre de l'événement *",
    titlePlaceholder: "Soirée Summer Vibes 2025",
    dateLabel: "Date *",
    capacityLabel: "Capacité *",
    capacityPlaceholder: "200",
    timeLabel: "Horaires",
    timePlaceholder: "21:00 - 04:00",
    locationLabel: "Lieu dans le club",
    locationPlaceholder: "Sélectionner un lieu",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Décrivez votre événement en quelques phrases...",
    cancel: "Annuler",
    create: "Créer l'événement"
  },
  editModal: {
    title: "Modifier l'événement",
    description: "Modifiez les informations de votre événement",
    titleLabel: "Titre de l'événement *",
    dateLabel: "Date *",
    capacityLabel: "Capacité *",
    timeLabel: "Horaires",
    statusLabel: "Statut",
    locationLabel: "Lieu dans le club",
    descriptionLabel: "Description",
    cancel: "Annuler",
    save: "Enregistrer les modifications"
  },
  deleteModal: {
    title: "Confirmer la suppression",
    description: "Êtes-vous sûr de vouloir supprimer l'événement \"{eventTitle}\" ? Cette action est irréversible.",
    cancel: "Annuler",
    delete: "Supprimer définitivement"
  },
  ticketModal: {
    title: "Ajouter un type de ticket",
    description: "Créez un nouveau type de ticket pour {eventTitle}",
    nameLabel: "Nom du ticket *",
    namePlaceholder: "VIP Early Bird, Standard, etc.",
    priceLabel: "Prix (Ar) *",
    pricePlaceholder: "150000",
    availableLabel: "Quantité disponible *",
    availablePlaceholder: "50",
    cancel: "Annuler",
    add: "Ajouter le ticket"
  },
  manageModal: {
    title: "Gérer l'événement: {eventTitle}",
    description: "Modifiez les détails ou gérez les tickets de cet événement",
    tabs: {
      details: "Détails",
      tickets: "Tickets",
      artists: "Artistes",
      promo: "Promotion"
    },
    details: {
      titleLabel: "Titre de l'événement",
      dateLabel: "Date",
      timeLabel: "Horaires",
      locationLabel: "Lieu",
      descriptionLabel: "Description",
      capacityLabel: "Capacité",
      statusPlaceholder: "Sélectionner un statut"
    },
    tickets: {
      tableHeaders: {
        type: "Type de ticket",
        price: "Prix",
        sold: "Vendus",
        available: "Disponibles",
        actions: "Actions"
      },
      soldBadge: "{count} vendus",
      availableBadge: "{count} disponibles",
      edit: "Modifier",
      delete: "Supprimer",
      addButton: "Ajouter un type de ticket"
    },
    artists: {
      confirmed: "Performance confirmée",
      findArtists: "Trouver des artistes",
      invitations: "Invitations en cours"
    },
    promo: {
      titleLabel: "Titre de la promotion",
      titlePlaceholder: "Ex: Early Bird Special - 20% de réduction",
      descLabel: "Description",
      descPlaceholder: "Décrivez cette offre promotionnelle...",
      startLabel: "Date de début",
      endLabel: "Date de fin",
      discountLabel: "Réduction (%)",
      discountPlaceholder: "20",
      codeLabel: "Code promo (optionnel)",
      codePlaceholder: "SUMMER2025",
      channelsTitle: "Canaux de distribution",
      channels: {
        app: "Application",
        email: "Email",
        sms: "SMS",
        social: "Réseaux sociaux",
        push: "Notifications push"
      }
    },
    cancel: "Annuler",
    save: "Enregistrer les modifications",
    close: "Fermer",
    publish: "Publier la promotion"
  },
  summaryModal: {
    title: "Récapitulatif: {eventTitle}",
    description: "Vue d'ensemble de l'événement et de ses performances",
    stats: {
      fillRate: {
        description: "Taux de remplissage",
        subtitle: "{reservations} participants sur {capacity} places"
      },
      revenue: {
        description: "Revenu total",
        subtitle: "{ticketsSold} tickets vendus"
      },
      additional: {
        description: "Ventes additionnelles",
        subtitle: "Boissons, nourriture et autres"
      }
    },
    info: {
      date: "Date",
      time: "Horaires",
      location: "Lieu",
      artists: "Artistes"
    },
    sales: {
      tableHeaders: {
        type: "Type de ticket",
        price: "Prix",
        sold: "Vendus",
        revenue: "Revenu",
        percent: "% du total"
      }
    },
    demographics: {
      title: "Répartition démographique",
      ages: [
        { label: "18-24 ans", percent: 35 },
        { label: "25-34 ans", percent: 45 },
        { label: "35-44 ans", percent: 15 },
        { label: "45+ ans", percent: 5 }
      ],
      gender: {
        men: { percent: 60, label: "Hommes" },
        women: { percent: 40, label: "Femmes" }
      }
    },
    engagement: {
      title: "Avis et engagement",
      rating: "4.8/5",
      reviewsCount: "(42 avis)",
      reviews: [
        {
          text: "Excellente soirée, l'ambiance était électrique et l'organisation parfaite.",
          author: "Marie L. - Utilisateur premium"
        },
        {
          text: "Les DJ étaient incroyables, mais un peu trop de monde à mon goût.",
          author: "Thomas M. - Première visite"
        }
      ],
      shares: {
        title: "Partages sur les réseaux sociaux",
        facebook: { icon: "f", count: 124 },
        twitter: { icon: "t", count: 87 },
        instagram: { icon: "i", count: 203 }
      }
    },
    close: "Fermer",
    export: "Exporter le rapport",
    exportSuccess: "📊 Rapport exporté",
    exportDescription: "Le rapport a été exporté au format PDF"
  },
  toasts: {
    createSuccess: {
      title: "🎉 Événement créé !",
      description: "Votre nouvel événement a été créé avec succès"
    },
    updateSuccess: {
      title: "✅ Événement modifié",
      description: "Les détails de l'événement ont été mis à jour avec succès"
    },
    deleteSuccess: {
      title: "🗑️ Événement supprimé",
      description: "L'événement a été supprimé avec succès"
    },
    ticketAddSuccess: {
      title: "✅ Ticket ajouté",
      description: `Le ticket "{ticketName}" a été ajouté avec succès`
    },
    ticketDeleteSuccess: {
      title: "🗑️ Ticket supprimé",
      description: "Le ticket a été supprimé avec succès"
    },
    promotionSuccess: {
      title: "🎯 Promotion publiée !",
      description: `La promotion pour "{eventTitle}" a été publiée avec succès`
    },
    updateDetailsSuccess: {
      title: "✅ Événement mis à jour",
      description: "Les détails de l'événement ont été mis à jour avec succès"
    },
    error: {
      title: "Erreur",
      description: "Veuillez remplir tous les champs obligatoires"
    },
    ticketError: {
      title: "Erreur",
      description: "Veuillez remplir tous les champs du ticket"
    },
    redirect: {
      title: "Redirection",
      descriptions: {
        artists: "Ouverture de la page de recherche d'artistes...",
        invitations: "Ouverture des invitations en cours..."
      }
    }
  },
  selectOptions: {
    locations: [
      { value: "Salle principale", label: "Salle principale" },
      { value: "Terrasse", label: "Terrasse" },
      { value: "Salon VIP", label: "Salon VIP" },
      { value: "Club entier", label: "Club entier" }
    ],
    statuses: [
      { value: "planning", label: "En planification" },
      { value: "upcoming", label: "À venir" },
      { value: "past", label: "Passé" },
      { value: "cancelled", label: "Annulé" }
    ]
  }
};

// Constantes pour les couleurs de statut
const STATUS_COLORS = {
  upcoming: "bg-green-600 text-white",
  planning: "bg-blue-600 text-white",
  past: "border text-muted-foreground",
  cancelled: "bg-red-600 text-white"
};

// Fonction pour formatter les montants en Ariary
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-MG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' Ar';
};

// Composant pour afficher un événement avec des actions
const EventCard: React.FC<{
  event: Event,
  onManage: (event: Event) => void,
  onViewSummary: (event: Event) => void,
  onEdit: (event: Event) => void,
  onDelete: (event: Event) => void
}> = ({
  event,
  onManage,
  onViewSummary,
  onEdit,
  onDelete
}) => {
  const statusLabels = UI_STRINGS.status;
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
            <p className="text-sm text-muted-foreground">{event.date}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[event.status]}`}>
            {statusLabels[event.status]}
          </span>
        </div>
       
        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{event.location}</span>
        </div>
        <div className="flex -space-x-2 mb-3">
          {event.artistImages.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={event.artists[index]}
              className="w-6 h-6 rounded-full border-2 border-background object-cover"
            />
          ))}
          {event.artists.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
              +{event.artists.length - 3}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{UI_STRINGS.eventCard.reservations}</span>
            <span className="text-sm font-medium">{event.reservations} / {event.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {event.status === 'past' ? UI_STRINGS.eventCard.pastSales : UI_STRINGS.eventCard.sales}
            </span>
            <span className="text-sm font-medium">{formatCurrency(event.sales)}</span>
          </div>
        </div>
       
        <div className="flex space-x-2 mt-4">
          {(event.status === 'upcoming' || event.status === 'planning') ? (
            <Button
              className="flex-1"
              onClick={() => onManage(event)}
            >
              {UI_STRINGS.eventCard.manage}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewSummary(event)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {UI_STRINGS.eventCard.stats}
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
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
    time: UI_STRINGS.createModal.timePlaceholder
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

  // Demo data pour le récapitulatif
  const demoDemographics = UI_STRINGS.summaryModal.demographics.ages;
  const demoReviews = UI_STRINGS.summaryModal.engagement.reviews;
  const demoShares = UI_STRINGS.summaryModal.engagement.shares;
  const demoGender = UI_STRINGS.summaryModal.demographics.gender;

  // CREATE - Créer un nouvel événement
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.capacity) {
      toast({
        title: UI_STRINGS.toasts.error.title,
        description: UI_STRINGS.toasts.error.description,
        variant: "destructive"
      });
      return;
    }
    const newEventData: Event = {
      id: Math.max(...events.map(e => e.id), 0) + 1,
      title: newEvent.title,
      date: newEvent.date,
      status: "planning",
      reservations: 0,
      capacity: parseInt(newEvent.capacity),
      sales: 0,
      coverImage: DEFAULT_COVER_IMAGE,
      description: newEvent.description,
      location: newEvent.location,
      time: newEvent.time,
      artists: [],
      artistImages: [],
      ticketTypes: [
        {
          name: "Standard",
          price: 150000,
          available: parseInt(newEvent.capacity),
          sold: 0
        }
      ]
    };
    setEvents([...events, newEventData]);
   
    toast({
      title: UI_STRINGS.toasts.createSuccess.title,
      description: UI_STRINGS.toasts.createSuccess.description,
    });
   
    // Réinitialiser le formulaire
    setNewEvent({
      title: '',
      date: '',
      location: '',
      capacity: '',
      description: '',
      time: UI_STRINGS.createModal.timePlaceholder
    });
   
    setIsCreateModalOpen(false);
  };

  // UPDATE - Mettre à jour un événement
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
   
    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: editEvent.title,
            date: editEvent.date,
            location: editEvent.location,
            capacity: parseInt(editEvent.capacity),
            description: editEvent.description,
            time: editEvent.time,
            status: editEvent.status
          }
        : event
    );
   
    setEvents(updatedEvents);
   
    toast({
      title: UI_STRINGS.toasts.updateSuccess.title,
      description: UI_STRINGS.toasts.updateSuccess.description,
    });
    setIsEditModalOpen(false);
  };

  // DELETE - Supprimer un événement
  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (!selectedEvent) return;
   
    setEvents(events.filter(event => event.id !== selectedEvent.id));
   
    toast({
      title: UI_STRINGS.toasts.deleteSuccess.title,
      description: UI_STRINGS.toasts.deleteSuccess.description,
    });
    setIsDeleteModalOpen(false);
  };

  // GESTION DES TICKETS
  const handleAddTicket = () => {
    if (!selectedEvent) return;
    if (!newTicket.name || !newTicket.price || !newTicket.available) {
      toast({
        title: UI_STRINGS.toasts.ticketError.title,
        description: UI_STRINGS.toasts.ticketError.description,
        variant: "destructive"
      });
      return;
    }
    const ticket = {
      name: newTicket.name,
      price: parseInt(newTicket.price),
      available: parseInt(newTicket.available),
      sold: 0
    };
    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id
        ? {
            ...event,
            ticketTypes: [...event.ticketTypes, ticket],
            capacity: event.capacity + parseInt(newTicket.available)
          }
        : event
    );
    setEvents(updatedEvents);
   
    toast({
      title: UI_STRINGS.toasts.ticketAddSuccess.title,
      description: UI_STRINGS.toasts.ticketAddSuccess.description.replace("{ticketName}", newTicket.name),
    });
    // Réinitialiser le formulaire
    setNewTicket({
      name: '',
      price: '',
      available: ''
    });
   
    setIsAddTicketModalOpen(false);
  };

  const handleEditTicket = (event: Event, ticketIndex: number) => {
    setSelectedEvent(event);
    const ticket = event.ticketTypes[ticketIndex];
    setNewTicket({
      name: ticket.name,
      price: ticket.price.toString(),
      available: ticket.available.toString()
    });
    setIsAddTicketModalOpen(true);
  };

  const handleDeleteTicket = (event: Event, ticketIndex: number) => {
    const updatedEvents = events.map(ev =>
      ev.id === event.id
        ? {
            ...ev,
            ticketTypes: ev.ticketTypes.filter((_, index) => index !== ticketIndex)
          }
        : ev
    );
    setEvents(updatedEvents);
   
    toast({
      title: UI_STRINGS.toasts.ticketDeleteSuccess.title,
      description: UI_STRINGS.toasts.ticketDeleteSuccess.description,
    });
  };

  const handleManageEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsManageModalOpen(true);
  };

  const handleViewSummary = (event: Event) => {
    setSelectedEvent(event);
    setIsSummaryModalOpen(true);
  };

  const handlePublishPromotion = () => {
    if (!selectedEvent) return;
   
    toast({
      title: UI_STRINGS.toasts.promotionSuccess.title,
      description: UI_STRINGS.toasts.promotionSuccess.description.replace("{eventTitle}", selectedEvent.title),
    });
  };

  const handleUpdateEventDetails = () => {
    if (!selectedEvent) return;
   
    toast({
      title: UI_STRINGS.toasts.updateDetailsSuccess.title,
      description: UI_STRINGS.toasts.updateDetailsSuccess.description,
    });
    setIsManageModalOpen(false);
  };

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.artists.some(artist => artist.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(event =>
      activeTab === 'all' ||
      (activeTab === 'upcoming' && event.status === 'upcoming') ||
      (activeTab === 'planning' && event.status === 'planning') ||
      (activeTab === 'past' && event.status === 'past')
    );

  // Statistiques calculées
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalRevenue = events.reduce((acc, event) => acc + event.sales, 0);
  const averageFillRate = Math.round(
    (events.reduce((acc, event) => acc + event.reservations, 0) /
    events.reduce((acc, event) => acc + event.capacity, 0)) * 100
  );
  const uniqueArtists = new Set(events.flatMap(event => event.artists)).size;

  // Helpers pour les tabs
  const getTabLabel = (tab: string, count: number) => {
    const labels = UI_STRINGS.tabs;
    return labels[tab as keyof typeof labels].replace("{count}", count.toString());
  };

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{UI_STRINGS.pageTitle}</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {UI_STRINGS.pageSubtitle.replace("{totalEvents}", totalEvents.toString())}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {UI_STRINGS.createEventButton}
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {UI_STRINGS.stats.totalEvents.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalEvents}</div>
              <p className="text-xs text-blue-600 mt-1">
                {UI_STRINGS.stats.totalEvents.subtitle.replace("{upcomingEvents}", upcomingEvents.toString())}
              </p>
            </CardContent>
          </Card>
         
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                {UI_STRINGS.stats.totalRevenue.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-green-600 mt-1">
                {UI_STRINGS.stats.totalRevenue.subtitle}
              </p>
            </CardContent>
          </Card>
         
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {UI_STRINGS.stats.fillRate.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{averageFillRate}%</div>
              <p className="text-xs text-purple-600 mt-1">
                {UI_STRINGS.stats.fillRate.subtitle}
              </p>
            </CardContent>
          </Card>
         
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <Music className="h-4 w-4 mr-2" />
                {UI_STRINGS.stats.uniqueArtists.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{uniqueArtists}</div>
              <p className="text-xs text-orange-600 mt-1">
                {UI_STRINGS.stats.uniqueArtists.subtitle}
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
              <TabsTrigger value="all">{getTabLabel('all', events.length)}</TabsTrigger>
              <TabsTrigger value="upcoming">{getTabLabel('upcoming', events.filter(e => e.status === 'upcoming').length)}</TabsTrigger>
              <TabsTrigger value="planning">{getTabLabel('planning', events.filter(e => e.status === 'planning').length)}</TabsTrigger>
              <TabsTrigger value="past">{getTabLabel('past', events.filter(e => e.status === 'past').length)}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full sm:w-64">
            <Input
              placeholder={UI_STRINGS.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-muted">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{UI_STRINGS.noEventsTitle}</h3>
            <p className="mt-2 text-muted-foreground">
              {UI_STRINGS.noEventsDescription}
            </p>
            <div className="mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
              >
                {UI_STRINGS.clearFilters}
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
              >
                {UI_STRINGS.createEventButton}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onManage={handleManageEvent}
                onViewSummary={handleViewSummary}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modale de création d'événement */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{UI_STRINGS.createModal.title}</DialogTitle>
            <DialogDescription>
              {UI_STRINGS.createModal.description}
            </DialogDescription>
          </DialogHeader>
         
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{UI_STRINGS.createModal.titleLabel}</Label>
              <Input
                id="title"
                placeholder={UI_STRINGS.createModal.titlePlaceholder}
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{UI_STRINGS.createModal.dateLabel}</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="capacity">{UI_STRINGS.createModal.capacityLabel}</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder={UI_STRINGS.createModal.capacityPlaceholder}
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">{UI_STRINGS.createModal.timeLabel}</Label>
                <Input
                  id="time"
                  placeholder={UI_STRINGS.createModal.timePlaceholder}
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="location">{UI_STRINGS.createModal.locationLabel}</Label>
                <Select
                  value={newEvent.location}
                  onValueChange={(value) => setNewEvent({...newEvent, location: value})}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder={UI_STRINGS.createModal.locationPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {UI_STRINGS.selectOptions.locations.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="description">{UI_STRINGS.createModal.descriptionLabel}</Label>
              <textarea
                id="description"
                rows={3}
                placeholder={UI_STRINGS.createModal.descriptionPlaceholder}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
         
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>{UI_STRINGS.createModal.cancel}</Button>
            <Button type="submit" onClick={handleCreateEvent}>{UI_STRINGS.createModal.create}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition d'événement */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{UI_STRINGS.editModal.title}</DialogTitle>
            <DialogDescription>
              {UI_STRINGS.editModal.description}
            </DialogDescription>
          </DialogHeader>
         
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{UI_STRINGS.editModal.titleLabel}</Label>
              <Input
                id="edit-title"
                value={editEvent.title}
                onChange={(e) => setEditEvent({...editEvent, title: e.target.value})}
              />
            </div>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">{UI_STRINGS.editModal.dateLabel}</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({...editEvent, date: e.target.value})}
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">{UI_STRINGS.editModal.capacityLabel}</Label>
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
                <Label htmlFor="edit-time">{UI_STRINGS.editModal.timeLabel}</Label>
                <Input
                  id="edit-time"
                  value={editEvent.time}
                  onChange={(e) => setEditEvent({...editEvent, time: e.target.value})}
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="edit-status">{UI_STRINGS.editModal.statusLabel}</Label>
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
                    {UI_STRINGS.selectOptions.statuses.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">{UI_STRINGS.editModal.locationLabel}</Label>
              <Select
                value={editEvent.location}
                onValueChange={(value) => setEditEvent({...editEvent, location: value})}
              >
                <SelectTrigger id="edit-location">
                  <SelectValue placeholder={UI_STRINGS.createModal.locationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {UI_STRINGS.selectOptions.locations.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="edit-description">{UI_STRINGS.editModal.descriptionLabel}</Label>
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
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>{UI_STRINGS.editModal.cancel}</Button>
            <Button onClick={handleUpdateEvent}>{UI_STRINGS.editModal.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{UI_STRINGS.deleteModal.title}</DialogTitle>
            <DialogDescription>
              {UI_STRINGS.deleteModal.description.replace("{eventTitle}", selectedEvent?.title || '')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {UI_STRINGS.deleteModal.cancel}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEvent}>
              {UI_STRINGS.deleteModal.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'ajout de ticket */}
      <Dialog open={isAddTicketModalOpen} onOpenChange={setIsAddTicketModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{UI_STRINGS.ticketModal.title}</DialogTitle>
            <DialogDescription>
              {UI_STRINGS.ticketModal.description.replace("{eventTitle}", selectedEvent?.title || '')}
            </DialogDescription>
          </DialogHeader>
         
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-name">{UI_STRINGS.ticketModal.nameLabel}</Label>
              <Input
                id="ticket-name"
                placeholder={UI_STRINGS.ticketModal.namePlaceholder}
                value={newTicket.name}
                onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
              />
            </div>
           
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-price">{UI_STRINGS.ticketModal.priceLabel}</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  placeholder={UI_STRINGS.ticketModal.pricePlaceholder}
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="ticket-available">{UI_STRINGS.ticketModal.availableLabel}</Label>
                <Input
                  id="ticket-available"
                  type="number"
                  placeholder={UI_STRINGS.ticketModal.availablePlaceholder}
                  value={newTicket.available}
                  onChange={(e) => setNewTicket({...newTicket, available: e.target.value})}
                />
              </div>
            </div>
          </div>
         
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTicketModalOpen(false)}>
              {UI_STRINGS.ticketModal.cancel}
            </Button>
            <Button onClick={handleAddTicket}>
              <Plus className="h-4 w-4 mr-2" />
              {UI_STRINGS.ticketModal.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de gestion d'événement */}
      {selectedEvent && (
        <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{UI_STRINGS.manageModal.title.replace("{eventTitle}", selectedEvent.title)}</DialogTitle>
              <DialogDescription>
                {UI_STRINGS.manageModal.description}
              </DialogDescription>
            </DialogHeader>
           
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">{UI_STRINGS.manageModal.tabs.details}</TabsTrigger>
                <TabsTrigger value="tickets">{UI_STRINGS.manageModal.tabs.tickets}</TabsTrigger>
                <TabsTrigger value="artists">{UI_STRINGS.manageModal.tabs.artists}</TabsTrigger>
                <TabsTrigger value="promo">{UI_STRINGS.manageModal.tabs.promo}</TabsTrigger>
              </TabsList>
             
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">{UI_STRINGS.manageModal.details.titleLabel}</Label>
                    <Input id="event-title" defaultValue={selectedEvent.title} />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="event-date">{UI_STRINGS.manageModal.details.dateLabel}</Label>
                    <Input id="event-date" defaultValue={selectedEvent.date} />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="event-time">{UI_STRINGS.manageModal.details.timeLabel}</Label>
                    <Input id="event-time" defaultValue={selectedEvent.time} />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="event-location">{UI_STRINGS.manageModal.details.locationLabel}</Label>
                    <Input id="event-location" defaultValue={selectedEvent.location} />
                  </div>
                 
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-description">{UI_STRINGS.manageModal.details.descriptionLabel}</Label>
                    <textarea
                      id="event-description"
                      rows={4}
                      defaultValue={selectedEvent.description}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">{UI_STRINGS.manageModal.details.capacityLabel}</Label>
                    <Input id="event-capacity" type="number" defaultValue={selectedEvent.capacity} />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="event-status">{UI_STRINGS.manageModal.details.statusLabel}</Label>
                    <Select defaultValue={selectedEvent.status}>
                      <SelectTrigger id="event-status">
                        <SelectValue placeholder={UI_STRINGS.manageModal.details.statusPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {UI_STRINGS.selectOptions.statuses.slice(0, 3).map(({ value, label }) => (  // Exclut 'cancelled' pour cohérence
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
               
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>{UI_STRINGS.manageModal.cancel}</Button>
                  <Button onClick={handleUpdateEventDetails}>{UI_STRINGS.manageModal.save}</Button>
                </DialogFooter>
              </TabsContent>
             
              <TabsContent value="tickets" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">{UI_STRINGS.manageModal.tickets.tableHeaders.type}</th>
                        <th className="text-left py-3 font-medium">{UI_STRINGS.manageModal.tickets.tableHeaders.price}</th>
                        <th className="text-left py-3 font-medium">{UI_STRINGS.manageModal.tickets.tableHeaders.sold}</th>
                        <th className="text-left py-3 font-medium">{UI_STRINGS.manageModal.tickets.tableHeaders.available}</th>
                        <th className="text-left py-3 font-medium">{UI_STRINGS.manageModal.tickets.tableHeaders.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.ticketTypes.map((ticket, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 font-medium">{ticket.name}</td>
                          <td className="py-3">{formatCurrency(ticket.price)}</td>
                          <td className="py-3">
                            <Badge variant={ticket.sold > 0 ? "default" : "secondary"}>
                              {UI_STRINGS.manageModal.tickets.soldBadge.replace("{count}", ticket.sold.toString())}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={ticket.available > 0 ? "outline" : "destructive"}>
                              {UI_STRINGS.manageModal.tickets.availableBadge.replace("{count}", ticket.available.toString())}
                            </Badge>
                          </td>
                          <td className="py-3 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTicket(selectedEvent, index)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              {UI_STRINGS.manageModal.tickets.edit}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTicket(selectedEvent, index)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              {UI_STRINGS.manageModal.tickets.delete}
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
                  onClick={() => {
                    setNewTicket({ name: '', price: '', available: '' });
                    setIsAddTicketModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {UI_STRINGS.manageModal.tickets.addButton}
                </Button>
               
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>{UI_STRINGS.manageModal.close}</Button>
                </DialogFooter>
              </TabsContent>
             
              <TabsContent value="artists" className="space-y-4">
                <div className="space-y-4">
                  {selectedEvent.artists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedEvent.artistImages[index]}
                          alt={artist}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{artist}</p>
                          <p className="text-sm text-muted-foreground">{UI_STRINGS.manageModal.artists.confirmed}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
               
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/find-artists");
                    toast({
                      title: UI_STRINGS.toasts.redirect.title,
                      description: UI_STRINGS.toasts.redirect.descriptions.artists,
                    });
                  }}>
                    <Music className="h-4 w-4 mr-2" />
                    {UI_STRINGS.manageModal.artists.findArtists}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/invitations");
                    toast({
                      title: UI_STRINGS.toasts.redirect.title,
                      description: UI_STRINGS.toasts.redirect.descriptions.invitations,
                    });
                  }}>
                    <Users className="h-4 w-4 mr-2" />
                    {UI_STRINGS.manageModal.artists.invitations}
                  </Button>
                </div>
               
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>{UI_STRINGS.manageModal.close}</Button>
                </DialogFooter>
              </TabsContent>
             
              <TabsContent value="promo" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-title">{UI_STRINGS.manageModal.promo.titleLabel}</Label>
                    <Input id="promo-title" placeholder={UI_STRINGS.manageModal.promo.titlePlaceholder} />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="promo-desc">{UI_STRINGS.manageModal.promo.descLabel}</Label>
                    <textarea
                      id="promo-desc"
                      rows={3}
                      placeholder={UI_STRINGS.manageModal.promo.descPlaceholder}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-start">{UI_STRINGS.manageModal.promo.startLabel}</Label>
                      <Input id="promo-start" type="date" />
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="promo-end">{UI_STRINGS.manageModal.promo.endLabel}</Label>
                      <Input id="promo-end" type="date" />
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">{UI_STRINGS.manageModal.promo.discountLabel}</Label>
                      <Input id="promo-discount" type="number" min="1" max="100" placeholder={UI_STRINGS.manageModal.promo.discountPlaceholder} />
                    </div>
                   
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">{UI_STRINGS.manageModal.promo.codeLabel}</Label>
                      <Input id="promo-code" placeholder={UI_STRINGS.manageModal.promo.codePlaceholder} />
                    </div>
                  </div>
                 
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">{UI_STRINGS.manageModal.promo.channelsTitle}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(UI_STRINGS.manageModal.promo.channels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input type="checkbox" id={`channel-${key}`} className="rounded" defaultChecked={key === 'app' || key === 'email' || key === 'social'} />
                          <label htmlFor={`channel-${key}`}>{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
               
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>{UI_STRINGS.manageModal.cancel}</Button>
                  <Button onClick={handlePublishPromotion}>{UI_STRINGS.manageModal.publish}</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Modale de récapitulatif d'événement */}
      {selectedEvent && (
        <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{UI_STRINGS.summaryModal.title.replace("{eventTitle}", selectedEvent.title)}</DialogTitle>
              <DialogDescription>
                {UI_STRINGS.summaryModal.description}
              </DialogDescription>
            </DialogHeader>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{UI_STRINGS.summaryModal.stats.fillRate.description}</CardDescription>
                  <CardTitle className="text-2xl">
                    {Math.round((selectedEvent.reservations / selectedEvent.capacity) * 100)}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {UI_STRINGS.summaryModal.stats.fillRate.subtitle
                      .replace("{reservations}", selectedEvent.reservations.toString())
                      .replace("{capacity}", selectedEvent.capacity.toString())}
                  </p>
                </CardContent>
              </Card>
             
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{UI_STRINGS.summaryModal.stats.revenue.description}</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedEvent.sales)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {UI_STRINGS.summaryModal.stats.revenue.subtitle.replace("{ticketsSold}", selectedEvent.ticketTypes.reduce((acc, t) => acc + t.sold, 0).toString())}
                  </p>
                </CardContent>
              </Card>
             
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{UI_STRINGS.summaryModal.stats.additional.description}</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedEvent.sales * 0.35)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {UI_STRINGS.summaryModal.stats.additional.subtitle}
                  </p>
                </CardContent>
              </Card>
            </div>
           
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{UI_STRINGS.summaryModal.info.date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{UI_STRINGS.summaryModal.info.date}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.date}</p>
                    </div>
                  </div>
                 
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{UI_STRINGS.summaryModal.info.time}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                    </div>
                  </div>
                 
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{UI_STRINGS.summaryModal.info.location}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                    </div>
                  </div>
                 
                  <div className="flex items-center space-x-3">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{UI_STRINGS.summaryModal.info.artists}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.artists.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
             
              <div>
                <h3 className="text-lg font-medium mb-2">{UI_STRINGS.summaryModal.sales.tableHeaders.type}</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">{UI_STRINGS.summaryModal.sales.tableHeaders.type}</th>
                      <th className="text-left py-2 font-medium">{UI_STRINGS.summaryModal.sales.tableHeaders.price}</th>
                      <th className="text-left py-2 font-medium">{UI_STRINGS.summaryModal.sales.tableHeaders.sold}</th>
                      <th className="text-left py-2 font-medium">{UI_STRINGS.summaryModal.sales.tableHeaders.revenue}</th>
                      <th className="text-left py-2 font-medium">{UI_STRINGS.summaryModal.sales.tableHeaders.percent}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.ticketTypes.map((ticket, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{ticket.name}</td>
                        <td className="py-2">{formatCurrency(ticket.price)}</td>
                        <td className="py-2">{ticket.sold}</td>
                        <td className="py-2">{formatCurrency(ticket.price * ticket.sold)}</td>
                        <td className="py-2">
                          {Math.round((ticket.price * ticket.sold / selectedEvent.sales) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{UI_STRINGS.summaryModal.demographics.title}</h3>
                  <div className="space-y-2">
                    {demoDemographics.map(({ label, percent }) => (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{label}</span>
                          <span className="text-sm font-medium">{percent}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-center">
                      <p className="text-xl font-medium">{demoGender.men.percent}%</p>
                      <p className="text-sm text-muted-foreground">{demoGender.men.label}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-medium">{demoGender.women.percent}%</p>
                      <p className="text-sm text-muted-foreground">{demoGender.women.label}</p>
                    </div>
                  </div>
                </div>
               
                <div>
                  <h3 className="text-lg font-medium mb-2">{UI_STRINGS.summaryModal.engagement.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Award key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 font-medium">{UI_STRINGS.summaryModal.engagement.rating}</span>
                      <span className="text-sm text-muted-foreground ml-2">{UI_STRINGS.summaryModal.engagement.reviewsCount}</span>
                    </div>
                   
                    <div className="space-y-3 mt-3">
                      {demoReviews.map(({ text, author }, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm italic">{text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{author}</p>
                        </div>
                      ))}
                    </div>
                   
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">{demoShares.title}</h4>
                      <div className="flex space-x-3">
                        {Object.entries(demoShares).map(([key, { icon, count }]) => (
                          <div key={key} className="flex items-center space-x-1">
                            <div className={`h-6 w-6 rounded-full bg-${key === 'facebook' ? 'blue-600' : key === 'twitter' ? 'sky-500' : 'pink-600'} flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">{icon}</span>
                            </div>
                            <span className="text-sm">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSummaryModalOpen(false)}>{UI_STRINGS.summaryModal.close}</Button>
              <Button onClick={() => {
                toast({
                  title: UI_STRINGS.summaryModal.exportSuccess,
                  description: UI_STRINGS.summaryModal.exportDescription,
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                {UI_STRINGS.summaryModal.export}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ResponsiveLayout>
  );
};

export default ClubEventsPage;