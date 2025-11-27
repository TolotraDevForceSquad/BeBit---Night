// client\src\pages\artist\artist-events-page.tsx

import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Calendar, Clock, MapPin, Users, DollarSign, Music, Bookmark, AlertCircle, Truck, Coffee, Award, Plus, Edit, Trash2, Upload, Link } from 'lucide-react';
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
import {
  Event,
  InsertEvent,
  TicketType,
  InsertTicketType,
  Artist,
  InsertEventArtist,
  Promotion,
  InsertPromotion,
  Club,
  Ticket,
} from '@shared/schema';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  getAllArtists,
  createEventArtist,
  getAllEventArtists,
  deleteArtist,
  useEvents,
  useTicketTypes,
  useArtists,
  uploadFile,
  getFileUrl,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getClubByUserId,
  getArtistByUserId
} from '@/services/servapi';

import AlertModal from "@/components/AlertModal";

// Import Leaflet pour la carte
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour la sélection de localisation sur la carte
const LocationPicker: React.FC<{
  position: [number, number] | null;
  onPositionChange: (position: [number, number]) => void;
}> = ({ position, onPositionChange }) => {
  const defaultPosition: [number, number] = [-18.8792, 47.5079]; // Antananarivo

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        onPositionChange([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <div className="h-64 w-full rounded-md overflow-hidden border">
      <MapContainer
        center={position || defaultPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
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
  onDelete: (event: Event) => void
}> = ({
  event,
  onManage,
  onViewSummary,
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

    // Calculer les revenus totaux basés sur les tickets vendus
    const calculateTotalSales = (event: Event) => {
      return event.price ? Number(event.price) * event.participantCount : 0;
    };

    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className={`h-80 bg-gradient-to-r from-purple-600 to-blue-500 relative`}>
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <Music className="h-12 w-12 text-white opacity-70" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onManage(event);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
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
              <p className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status || 'planning']}`}>
              {statusLabels[event.status || 'planning']}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {event.venueName} - {event.location}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {event.startTime} - {event.endTime}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Participants</span>
              <span className="text-sm font-medium">{event.participantCount} / {event.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {event.status === 'past' ? 'Revenus totaux' : 'Vente estimée'}
              </span>
              <span className="text-sm font-medium">{formatCurrency(calculateTotalSales(event))}</span>
            </div>
          </div>
          {(event.status === 'upcoming' || event.status === 'planning') ? (
            <Button
              className="w-full mt-4"
              onClick={() => onManage(event)}
            >
              Gérer l'événement
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => onViewSummary(event)}
            >
              Voir le récapitulatif
            </Button>
          )}
        </div>
      </div>
    );
  };

const ArtistEventsPage: React.FC = () => {
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (!authUser) {
      console.warn("Aucun utilisateur connecté - fonctionnalités limitées");
    }
  }, []);
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les données
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [eventArtists, setEventArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les modales
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // États pour les tickets
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);

  // États pour les promotions
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isCreatePromotionModalOpen, setIsCreatePromotionModalOpen] = useState(false);
  const [isEditPromotionModalOpen, setIsEditPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const [newPromotion, setNewPromotion] = useState<InsertPromotion>({
    eventId: 0,
    clubId: 0, // Sera mis à jour lors de la création
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: "0",
    status: 'active',
    channels: [],
    validFrom: new Date().toISOString().split('T')[0] + 'T00:00:00',
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59'
  });

  // État pour la carte
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  // États pour l'upload d'image
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">("url");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // État pour la modale d'alerte
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'danger';
    onConfirm: () => void;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'warning',
    onConfirm: () => { },
  });

  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null);
  const [newTicketType, setNewTicketType] = useState<InsertTicketType>({
    eventId: selectedEvent?.id || 0,
    name: '',
    price: "0",
    capacity: 50,
    description: ''
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const getCurrentUserId = () => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        return userData.id;
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
      }
    }
    return null; // Retourne null si pas d'utilisateur connecté
  };

  const getCurrentUserArtist = async (): Promise<Artist | null> => {
    try {
      const authUser = localStorage.getItem("auth_user");
      if (authUser) {
        const userData = JSON.parse(authUser);
        if (userData.role === 'artist') {
          const artist = await getArtistByUserId(userData.id);
          return artist;
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'artiste:", error);
      return null;
    }
  };

  const [newEvent, setNewEvent] = useState<InsertEvent>({
    organizerType: 'artist',
    organizerId: getCurrentUserId(),
    createdBy: getCurrentUserId(),
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '20:00',
    endTime: '04:00',
    location: '',
    city: 'Antananarivo',
    country: 'Madagascar',
    venueName: '',
    category: 'Concert',
    price: "0",
    capacity: 100,
    coverImage: '',
    participantCount: 0,
    popularity: 0,
    isApproved: false,
    status: 'planning',
    mood: 'energetic',
    reserveTables: false,
    latitude: null,
    longitude: null
  });

  // Charger les données
  useEffect(() => {
    loadEvents();
    loadArtists();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const authUser = localStorage.getItem("auth_user");

      if (!authUser) {
        setEvents([]);
        return;
      }

      const userData = JSON.parse(authUser);
      const currentUserId = userData.id;

      // Récupérer l'artiste de l'utilisateur si c'est un artiste
      let userArtist: Artist | null = null;
      if (userData.role === 'artist') {
        userArtist = await getArtistByUserId(currentUserId);
      }

      const eventsData = await getAllEvents();

      // Filtrer selon le rôle
      let userEvents: Event[];
      if (userData.role === 'artist' && userArtist) {
        // Pour les artistes: événements où ils sont organisateurs
        userEvents = eventsData.filter(event =>
          event.organizerType === 'artist' && event.organizerId === userArtist!.id
        );
      } else {
        // Pour les autres: événements qu'ils ont créés
        userEvents = eventsData.filter(event => event.createdBy === currentUserId);
      }

      setEvents(userEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadArtists = async () => {
    try {
      const artistsData = await getAllArtists();
      setArtists(artistsData);
    } catch (error) {
      console.error('Erreur lors du chargement des artistes:', error);
    }
  };

  const loadPromotions = async (eventId: number) => {
    try {
      const promotionsData = await getAllPromotions({ eventId });
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    }
  };

  const loadEventArtists = async (eventId: number) => {
    try {
      const artistsData = await getAllEventArtists(eventId, undefined);
      setEventArtists(artistsData);
    } catch (error) {
      console.error('Erreur lors du chargement des artistes de l\'événement:', error);
    }
  };

  const loadTicketTypes = async (eventId: number) => {
    try {
      const ticketTypesData = await getAllTicketTypes(eventId);
      setTicketTypes(ticketTypesData);
    } catch (error) {
      console.error('Erreur lors du chargement des types de tickets:', error);
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setAlertModal({
          isOpen: true,
          title: "Type de fichier invalide",
          description: "Veuillez sélectionner un fichier image (JPG, PNG, GIF, etc.)",
          type: 'error',
          onConfirm: () => setAlertModal({ ...alertModal, isOpen: false }),
        });
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlertModal({
          isOpen: true,
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 5MB",
          type: 'error',
          onConfirm: () => setAlertModal({ ...alertModal, isOpen: false }),
        });
        return;
      }

      setSelectedFile(file);

      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de l'image
  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error("Aucun fichier sélectionné");
    }

    setUploadingImage(true);
    try {
      const response = await uploadFile(selectedFile);
      return getFileUrl(response.file.filename);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      throw new Error("Échec de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleManageEvent = async (event: Event) => {
    setSelectedEvent(event);
    await loadEventArtists(event.id);
    await loadTicketTypes(event.id);
    await loadPromotions(event.id);

    // Initialiser la position de la carte
    if (event.latitude && event.longitude) {
      setMapPosition([parseFloat(event.latitude), parseFloat(event.longitude)]);
    } else {
      setMapPosition([-18.8792, 47.5079]);
    }

    setIsManageModalOpen(true);
  };

  const handleViewSummary = (event: Event) => {
    setSelectedEvent(event);
    setIsSummaryModalOpen(true);
  };

  const handleCreateEvent = async () => {
    try {
      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un événement",
          variant: "destructive"
        });
        return;
      }

      const userData = JSON.parse(authUser);
      const userId = userData.id;

      // Récupérer l'artiste si l'utilisateur est un artiste
      let userArtist: Artist | null = null;
      if (userData.role === 'artist') {
        userArtist = await getArtistByUserId(userId);
      }

      let coverImageUrl = newEvent.coverImage;

      if (imageUploadMethod === "upload" && selectedFile) {
        coverImageUrl = await handleImageUpload();
      }

      // Déterminer organizerType et organizerId
      const organizerType = userData.role === 'artist' ? 'artist' : 'user';
      const organizerId = userData.role === 'artist' && userArtist ? userArtist.id : userId;

      const eventData = {
        ...newEvent,
        createdBy: userId,
        organizerType,
        organizerId,
        coverImage: coverImageUrl,
        ...(mapPosition && {
          latitude: mapPosition[0].toString(),
          longitude: mapPosition[1].toString()
        })
      };

      const createdEvent = await createEvent(eventData);
      toast({
        title: "Événement créé",
        description: "Votre nouvel événement a été créé avec succès",
      });
      setIsCreateModalOpen(false);

      // Réinitialisation
      setNewEvent({
        organizerType: userData.role === 'artist' ? 'artist' : 'user',
        organizerId: organizerId,
        createdBy: userId,
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '20:00',
        endTime: '04:00',
        location: '',
        city: '',
        country: '',
        venueName: '',
        category: 'Concert',
        price: "0",
        capacity: 100,
        coverImage: '',
        participantCount: 0,
        popularity: 0,
        isApproved: false,
        status: 'planning',
        mood: 'energetic',
        reserveTables: false,
        latitude: null,
        longitude: null
      });

      setMapPosition(null);
      setSelectedFile(null);
      setImagePreview("");
      setImageUploadMethod("url");
      loadEvents();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      let coverImageUrl = selectedEvent.coverImage;

      // Si upload de fichier, uploader l'image d'abord
      if (imageUploadMethod === "upload" && selectedFile) {
        coverImageUrl = await handleImageUpload();
      }

      // Préparer les données de mise à jour avec les coordonnées
      const updateData = {
        ...selectedEvent,
        coverImage: coverImageUrl,
        ...(mapPosition && {
          latitude: mapPosition[0].toString(),
          longitude: mapPosition[1].toString()
        })
      };

      // Créer un objet sans les champs générés automatiquement
      const { id, createdAt, ...dataToUpdate } = updateData;
      await updateEvent(selectedEvent.id, dataToUpdate);
      toast({
        title: "Événement mis à jour",
        description: "Les détails de l'événement ont été mis à jour avec succès",
      });
      setIsManageModalOpen(false);
      setSelectedFile(null);
      setImagePreview("");
      loadEvents();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    setAlertModal({
      isOpen: true,
      title: "Supprimer l'événement",
      description: `Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ? Cette action est irréversible.`,
      type: 'danger',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          // Mettre à jour l'état local immédiatement pour un feedback instantané
          setEvents(prev => prev.filter(e => e.id !== event.id));

          // Puis effectuer la suppression sur l'API
          await deleteEvent(event.id);

          toast({
            title: "Événement supprimé",
            description: "L'événement a été supprimé avec succès",
          });

          // Recharger depuis l'API pour synchronisation
          await loadEvents();
          setAlertModal({ ...alertModal, isOpen: false });
        } catch (error) {
          // En cas d'erreur, recharger les données pour remettre l'état à jour
          await loadEvents();

          toast({
            title: "Erreur",
            description: "Impossible de supprimer l'événement",
            variant: "destructive"
          });
          setAlertModal({ ...alertModal, isOpen: false });
        }
      }
    });
  };

  const handleAddTicketType = async (eventId: number) => {
    const newTicketType: InsertTicketType = {
      eventId,
      name: 'Nouveau ticket',
      price: "0",
      capacity: 50,
      description: ''
    };

    try {
      await createTicketType(newTicketType);
      await loadTicketTypes(eventId);
      toast({
        title: "Type de ticket ajouté",
        description: "Le nouveau type de ticket a été ajouté avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le type de ticket",
        variant: "destructive"
      });
    }
  };

  const handleAddArtist = async (eventId: number, artistId: number) => {
    const newEventArtist: InsertEventArtist = {
      eventId,
      artistId,
      fee: 0
    };

    try {
      await createEventArtist(newEventArtist);
      await loadEventArtists(eventId);
      toast({
        title: "Artiste ajouté",
        description: "L'artiste a été ajouté à l'événement avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'artiste:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'artiste",
        variant: "destructive"
      });
    }
  };

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event =>
      activeTab === 'all' ||
      (activeTab === 'upcoming' && event.status === 'upcoming') ||
      (activeTab === 'planning' && event.status === 'planning') ||
      (activeTab === 'past' && event.status === 'past')
    );

  // Calcul des statistiques basées sur les données réelles
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalRevenue = events.reduce((acc, event) => acc + (event.price ? Number(event.price) * event.participantCount : 0), 0);
  const averageFillRate = events.length > 0
    ? Math.round((events.reduce((acc, event) => acc + event.participantCount, 0) /
      events.reduce((acc, event) => acc + event.capacity, 0)) * 100)
    : 0;

  const handleCreateTicketType = async () => {
    if (!selectedEvent) return;

    try {
      const ticketTypeData = {
        ...newTicketType,
        eventId: selectedEvent.id
      };
      await createTicketType(ticketTypeData);
      toast({
        title: "Type de ticket créé",
        description: "Le nouveau type de ticket a été créé avec succès",
      });
      setIsCreateTicketModalOpen(false);
      setNewTicketType({
        eventId: selectedEvent.id,
        name: '',
        price: "0",
        capacity: 50,
        description: ''
      });
      await loadTicketTypes(selectedEvent.id);
    } catch (error) {
      console.error('Erreur lors de la création du type de ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de ticket",
        variant: "destructive"
      });
    }
  };

  const handleEditTicketType = (ticketType: TicketType) => {
    setEditingTicketType(ticketType);
    setIsEditTicketModalOpen(true);
  };

  const handleUpdateTicketType = async () => {
    if (!editingTicketType || !selectedEvent) return;

    try {
      await updateTicketType(editingTicketType.id, {
        name: editingTicketType.name,
        price: editingTicketType.price,
        capacity: editingTicketType.capacity,
        description: editingTicketType.description
      });
      toast({
        title: "Type de ticket mis à jour",
        description: "Le type de ticket a été modifié avec succès",
      });
      setIsEditTicketModalOpen(false);
      setEditingTicketType(null);
      await loadTicketTypes(selectedEvent.id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du type de ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le type de ticket",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTicketType = async (ticketTypeId: number) => {
    setAlertModal({
      isOpen: true,
      title: "Supprimer le type de ticket",
      description: "Êtes-vous sûr de vouloir supprimer ce type de ticket ? Cette action est irréversible.",
      type: 'danger',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          // Mettre à jour l'état local immédiatement pour un feedback instantané
          setTicketTypes(prev => prev.filter(ticket => ticket.id !== ticketTypeId));

          // Puis effectuer la suppression sur l'API
          await deleteTicketType(ticketTypeId);

          toast({
            title: "Type de ticket supprimé",
            description: "Le type de ticket a été supprimé avec succès",
          });

          // Recharger depuis l'API pour synchronisation
          if (selectedEvent) {
            await loadTicketTypes(selectedEvent.id);
          }
          setAlertModal({ ...alertModal, isOpen: false });
        } catch (error) {
          console.error('Erreur lors de la suppression du type de ticket:', error);

          // En cas d'erreur, recharger les données pour remettre l'état à jour
          if (selectedEvent) {
            await loadTicketTypes(selectedEvent.id);
          }

          toast({
            title: "Erreur",
            description: "Impossible de supprimer le type de ticket",
            variant: "destructive"
          });
          setAlertModal({ ...alertModal, isOpen: false });
        }
      }
    });
  };

  const handleCreatePromotion = async () => {
    if (!selectedEvent) return;

    try {
      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une promotion",
          variant: "destructive"
        });
        return;
      }

      const userData = JSON.parse(authUser);
      const userId = userData.id;

      // Pour les artistes, utiliser l'ID utilisateur comme fallback
      const clubId = userId;

      const promotionData = {
        ...newPromotion,
        eventId: selectedEvent.id,
        clubId: clubId,
        validFrom: new Date(newPromotion.validFrom).toISOString(),
        validTo: new Date(newPromotion.validTo).toISOString()
      };

      await createPromotion(promotionData);
      toast({
        title: "Promotion créée",
        description: "La nouvelle promotion a été créée avec succès",
      });
      setIsCreatePromotionModalOpen(false);
      setNewPromotion({
        eventId: 0,
        clubId: clubId,
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: "0",
        status: 'active',
        channels: [],
        validFrom: new Date().toISOString().split('T')[0] + 'T00:00:00',
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59'
      });
      await loadPromotions(selectedEvent.id);
    } catch (error) {
      console.error('Erreur lors de la création de la promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la promotion",
        variant: "destructive"
      });
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsEditPromotionModalOpen(true);
  };

  const handleUpdatePromotion = async () => {
    if (!editingPromotion || !selectedEvent) return;

    try {
      await updatePromotion(editingPromotion.id, {
        title: editingPromotion.title,
        description: editingPromotion.description,
        discountType: editingPromotion.discountType,
        discountValue: editingPromotion.discountValue,
        status: editingPromotion.status,
        channels: editingPromotion.channels,
        validFrom: new Date(editingPromotion.validFrom).toISOString(),
        validTo: new Date(editingPromotion.validTo).toISOString()
      });
      toast({
        title: "Promotion mise à jour",
        description: "La promotion a été modifiée avec succès",
      });
      setIsEditPromotionModalOpen(false);
      setEditingPromotion(null);
      await loadPromotions(selectedEvent.id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la promotion",
        variant: "destructive"
      });
    }
  };

  const handleDeletePromotion = async (promotionId: number) => {
    setAlertModal({
      isOpen: true,
      title: "Supprimer la promotion",
      description: "Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible.",
      type: 'danger',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          // Mettre à jour l'état local immédiatement pour un feedback instantané
          setPromotions(prev => prev.filter(p => p.id !== promotionId));

          // Puis effectuer la suppression sur l'API
          await deletePromotion(promotionId);

          toast({
            title: "Promotion supprimée",
            description: "La promotion a été supprimée avec succès",
          });

          // Recharger depuis l'API pour synchronisation
          if (selectedEvent) {
            await loadPromotions(selectedEvent.id);
          }
          setAlertModal({ ...alertModal, isOpen: false });
        } catch (error) {
          // En cas d'erreur, recharger les données pour remettre l'état à jour
          if (selectedEvent) {
            await loadPromotions(selectedEvent.id);
          }

          toast({
            title: "Erreur",
            description: "Impossible de supprimer la promotion",
            variant: "destructive"
          });
          setAlertModal({ ...alertModal, isOpen: false });
        }
      }
    });
  };

  const handleChannelToggle = (channel: string) => {
    setNewPromotion(prev => {
      const currentChannels = Array.isArray(prev.channels) ? prev.channels : [];
      const updatedChannels = currentChannels.includes(channel)
        ? currentChannels.filter(c => c !== channel)
        : [...currentChannels, channel];

      return { ...prev, channels: updatedChannels };
    });
  };

  const handleEditChannelToggle = (channel: string) => {
    if (!editingPromotion) return;

    const currentChannels = Array.isArray(editingPromotion.channels) ? editingPromotion.channels : [];
    const updatedChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];

    setEditingPromotion({ ...editingPromotion, channels: updatedChannels });
  };

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Événements de l'artiste</h1>
            <p className="text-lg text-muted-foreground mt-1">Gérez vos événements passés et à venir</p>
          </div>
          <Button
            onClick={() => {
              if (!localStorage.getItem("auth_user")) {
                toast({
                  title: "Connexion requise",
                  description: "Veuillez vous connecter pour créer un événement",
                  variant: "destructive"
                });
                return;
              }
              setIsCreateModalOpen(true);
            }}
            className="mt-4 md:mt-0"
            disabled={!localStorage.getItem("auth_user")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="planning">Planification</TabsTrigger>
              <TabsTrigger value="past">Passés</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Alerte si pas d'utilisateur connecté */}
        {!localStorage.getItem("auth_user") && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Non connecté</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">
              Connectez-vous pour voir et gérer vos événements personnels.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des événements...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-muted">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Aucun événement trouvé</h3>
            <p className="mt-2 text-muted-foreground">
              Aucun événement ne correspond à vos critères de recherche
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
            >
              Effacer les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onManage={handleManageEvent}
                onViewSummary={handleViewSummary}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Statistiques rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total d'événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingEvents} à venir
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tous événements confondus
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taux de remplissage moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {averageFillRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basé sur tous les événements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Participants totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.reduce((acc, event) => acc + event.participantCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total des participants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modale de gestion d'événement */}
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="promo">Promotion</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Titre de l'événement</Label>
                    <Input
                      id="event-title"
                      value={selectedEvent.title}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={selectedEvent.date ? new Date(selectedEvent.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-start-time">Heure de début</Label>
                    <Input
                      id="event-start-time"
                      type="time"
                      value={selectedEvent.startTime}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-end-time">Heure de fin</Label>
                    <Input
                      id="event-end-time"
                      type="time"
                      value={selectedEvent.endTime}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-location">Adresse</Label>
                    <Input
                      id="event-location"
                      value={selectedEvent.location}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-venue">Nom de la salle</Label>
                    <Input
                      id="event-venue"
                      value={selectedEvent.venueName}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, venueName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-city">Ville</Label>
                    <Input
                      id="event-city"
                      value={selectedEvent.city}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-country">Pays</Label>
                    <Input
                      id="event-country"
                      value={selectedEvent.country}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, country: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">Capacité</Label>
                    <Input
                      id="event-capacity"
                      type="number"
                      value={selectedEvent.capacity}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, capacity: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-price">Prix de base</Label>
                    <Input
                      id="event-price"
                      type="number"
                      value={selectedEvent.price || "0"}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, price: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-category">Catégorie</Label>
                    <Select
                      value={selectedEvent.category}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, category: value })}
                    >
                      <SelectTrigger id="event-category">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Concert">Concert</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Nightclub">Nightclub</SelectItem>
                        <SelectItem value="Afterwork">Afterwork</SelectItem>
                        <SelectItem value="Soirée privée">Soirée privée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-status">Statut</Label>
                    <Select
                      value={selectedEvent.status || 'planning'}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, status: value as any })}
                    >
                      <SelectTrigger id="event-status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">En planification</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="past">Passé</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nouveaux champs ajoutés */}
                  <div className="space-y-2">
                    <Label htmlFor="event-mood">Ambiance</Label>
                    <Select
                      value={selectedEvent.mood || 'energetic'}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, mood: value as any })}
                    >
                      <SelectTrigger id="event-mood">
                        <SelectValue placeholder="Sélectionner une ambiance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="energetic">Énergique</SelectItem>
                        <SelectItem value="chill">Chill</SelectItem>
                        <SelectItem value="romantic">Romantique</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="festive">Festif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-popularity">Popularité</Label>
                    <Input
                      id="event-popularity"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedEvent.popularity || 0}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, popularity: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="event-reserve-tables"
                      checked={selectedEvent.reserveTables || false}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, reserveTables: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="event-reserve-tables">Réservation de tables disponible</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="event-is-approved"
                      checked={selectedEvent.isApproved || false}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, isApproved: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="event-is-approved">Événement approuvé</Label>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Localisation sur la carte</Label>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMap(!showMap)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {showMap ? 'Masquer la carte' : 'Choisir sur la carte'}
                      </Button>
                      {showMap && (
                        <LocationPicker
                          position={mapPosition}
                          onPositionChange={setMapPosition}
                        />
                      )}
                      {mapPosition && (
                        <p className="text-sm text-muted-foreground">
                          Position sélectionnée: {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section Image de couverture */}
                  <div className="md:col-span-2 space-y-2">
                    <Label>Image de couverture</Label>

                    {/* Sélection de la méthode */}
                    <div className="flex gap-4 mb-4">
                      <Button
                        type="button"
                        onClick={() => setImageUploadMethod("url")}
                        variant={imageUploadMethod === "url" ? "default" : "outline"}
                        size="sm"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setImageUploadMethod("upload")}
                        variant={imageUploadMethod === "upload" ? "default" : "outline"}
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {imageUploadMethod === "url" ? (
                      <div>
                        <Input
                          type="url"
                          value={selectedEvent.coverImage || ''}
                          onChange={(e) => {
                            setSelectedEvent({ ...selectedEvent, coverImage: e.target.value });
                            setImagePreview(e.target.value);
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Entrez l'URL d'une image sur internet
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload-edit"
                          />
                          <label
                            htmlFor="file-upload-edit"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {selectedFile ? selectedFile.name : "Cliquez pour sélectionner une image"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              JPG, PNG, GIF (max 5MB)
                            </span>
                          </label>
                        </div>
                        {uploadingImage && (
                          <div className="mt-2 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                            <p className="text-xs text-muted-foreground mt-1">Upload en cours...</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preview de l'image */}
                    {(imagePreview || selectedEvent.coverImage) && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Aperçu:</p>
                        <img
                          src={imagePreview || selectedEvent.coverImage || ''}
                          alt="Preview"
                          className="max-h-48 rounded-lg object-cover mx-auto"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-description">Description</Label>
                    <textarea
                      id="event-description"
                      rows={4}
                      value={selectedEvent.description || ''}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Annuler</Button>
                  <Button
                    onClick={handleUpdateEvent}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Upload..." : "Enregistrer les modifications"}
                  </Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="tickets" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Types de tickets</h3>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateTicketModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un type de ticket
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Type de ticket</th>
                        <th className="text-left py-3 font-medium">Prix</th>
                        <th className="text-left py-3 font-medium">Capacité</th>
                        <th className="text-left py-3 font-medium">Vendus</th>
                        <th className="text-left py-3 font-medium">Description</th>
                        <th className="text-left py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketTypes.map((ticket) => (
                        <tr key={ticket.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 font-medium">{ticket.name}</td>
                          <td className="py-3">{formatCurrency(Number(ticket.price))}</td>
                          <td className="py-3">{ticket.capacity}</td>
                          <td className="py-3">
                            {tickets.filter(t => t.ticketTypeId === ticket.id).length}
                          </td>
                          <td className="py-3">{ticket.description}</td>
                          <td className="py-3 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTicketType(ticket)}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTicketType(ticket.id)}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {ticketTypes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-muted-foreground">
                            Aucun type de ticket configuré
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="promo" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Promotions</h3>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatePromotionModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une promotion
                  </Button>
                </div>

                <div className="space-y-4">
                  {promotions.map((promotion) => (
                    <Card key={promotion.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{promotion.title}</CardTitle>
                            <CardDescription>{promotion.description}</CardDescription>
                          </div>
                          <Badge variant={
                            promotion.status === 'active' ? 'default' :
                              promotion.status === 'expired' ? 'destructive' : 'secondary'
                          }>
                            {promotion.status === 'active' ? 'Active' :
                              promotion.status === 'expired' ? 'Expirée' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Réduction:</span>
                            <p>{promotion.discountValue} {promotion.discountType === 'percentage' ? '%' : 'Ar'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Début:</span>
                            <p>{new Date(promotion.validFrom).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <span className="font-medium">Fin:</span>
                            <p>{new Date(promotion.validTo).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <span className="font-medium">Canaux:</span>
                            <p>{Array.isArray(promotion.channels) ? promotion.channels.join(', ') : 'Aucun'}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPromotion(promotion)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePromotion(promotion.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  {promotions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p>Aucune promotion créée pour cet événement</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsCreatePromotionModalOpen(true)}
                      >
                        Créer votre première promotion
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Modale de création d'événement */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel événement pour votre profil artiste
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement *</Label>
              <Input
                id="title"
                placeholder="Concert Live - Summer Vibes 2025"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date as string}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="200"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Heure de début *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">Heure de fin *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue-name">Nom de la salle *</Label>
              <Input
                id="venue-name"
                placeholder="Salle de concert principale"
                value={newEvent.venueName}
                onChange={(e) => setNewEvent({ ...newEvent, venueName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Adresse *</Label>
              <Input
                id="location"
                placeholder="123 Avenue des Arts, Ville"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  placeholder="Antananarivo"
                  value={newEvent.city}
                  onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays *</Label>
                <Input
                  id="country"
                  placeholder="Madagascar"
                  value={newEvent.country}
                  onChange={(e) => setNewEvent({ ...newEvent, country: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Localisation sur la carte</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? 'Masquer la carte' : 'Choisir sur la carte'}
                </Button>
                {showMap && (
                  <LocationPicker
                    position={mapPosition}
                    onPositionChange={setMapPosition}
                  />
                )}
                {mapPosition && (
                  <p className="text-sm text-muted-foreground">
                    Position sélectionnée: {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix de base *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="20000"
                  value={newEvent.price as string}
                  onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={newEvent.category}
                  onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concert">Concert</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Nightclub">Nightclub</SelectItem>
                    <SelectItem value="Afterwork">Afterwork</SelectItem>
                    <SelectItem value="Soirée privée">Soirée privée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nouveaux champs ajoutés pour la création */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mood">Ambiance</Label>
                <Select
                  value={newEvent.mood || 'energetic'}
                  onValueChange={(value) => setNewEvent({ ...newEvent, mood: value as any })}
                >
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Sélectionner une ambiance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">Énergique</SelectItem>
                    <SelectItem value="chill">Chill</SelectItem>
                    <SelectItem value="romantic">Romantique</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="festive">Festif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={newEvent.status || 'planning'}
                  onValueChange={(value) => setNewEvent({ ...newEvent, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reserve-tables"
                checked={newEvent.reserveTables || false}
                onChange={(e) => setNewEvent({ ...newEvent, reserveTables: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="reserve-tables">Réservation de tables disponible</Label>
            </div>

            {/* Section Image de couverture pour la création */}
            <div className="space-y-2">
              <Label>Image de couverture</Label>

              {/* Sélection de la méthode */}
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  onClick={() => setImageUploadMethod("url")}
                  variant={imageUploadMethod === "url" ? "default" : "outline"}
                  size="sm"
                >
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </Button>
                <Button
                  type="button"
                  onClick={() => setImageUploadMethod("upload")}
                  variant={imageUploadMethod === "upload" ? "default" : "outline"}
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              {imageUploadMethod === "url" ? (
                <div>
                  <Input
                    type="url"
                    value={newEvent.coverImage || ''}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, coverImage: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Entrez l'URL d'une image sur internet
                  </p>
                </div>
              ) : (
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload-create"
                    />
                    <label
                      htmlFor="file-upload-create"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedFile ? selectedFile.name : "Cliquez pour sélectionner une image"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG, GIF (max 5MB)
                      </span>
                    </label>
                  </div>
                  {uploadingImage && (
                    <div className="mt-2 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-xs text-muted-foreground mt-1">Upload en cours...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Preview de l'image */}
              {(imagePreview || newEvent.coverImage) && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Aperçu:</p>
                  <img
                    src={imagePreview || newEvent.coverImage || ''}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-cover mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Décrivez votre événement en quelques phrases..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
            <Button
              type="submit"
              onClick={handleCreateEvent}
              disabled={!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.venueName || uploadingImage}
            >
              {uploadingImage ? "Upload..." : "Créer l'événement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de création de type de ticket */}
      <Dialog open={isCreateTicketModalOpen} onOpenChange={setIsCreateTicketModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau type de ticket</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau type de ticket
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-name">Nom du ticket *</Label>
              <Input
                id="ticket-name"
                placeholder="VIP, Standard, Early Bird..."
                value={newTicketType.name}
                onChange={(e) => setNewTicketType({ ...newTicketType, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-price">Prix (Ar) *</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  placeholder="20000"
                  value={newTicketType.price as string}
                  onChange={(e) => setNewTicketType({ ...newTicketType, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-capacity">Capacité *</Label>
                <Input
                  id="ticket-capacity"
                  type="number"
                  placeholder="100"
                  value={newTicketType.capacity}
                  onChange={(e) => setNewTicketType({ ...newTicketType, capacity: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <textarea
                id="ticket-description"
                rows={3}
                placeholder="Description du type de ticket..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newTicketType.description || ''}
                onChange={(e) => setNewTicketType({ ...newTicketType, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTicketModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateTicketType}
              disabled={!newTicketType.name || !newTicketType.price || !newTicketType.capacity}
            >
              Créer le type de ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de modification de type de ticket */}
      <Dialog open={isEditTicketModalOpen} onOpenChange={setIsEditTicketModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le type de ticket</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de ticket
            </DialogDescription>
          </DialogHeader>

          {editingTicketType && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ticket-name">Nom du ticket *</Label>
                <Input
                  id="edit-ticket-name"
                  value={editingTicketType.name}
                  onChange={(e) => setEditingTicketType({ ...editingTicketType, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ticket-price">Prix (Ar) *</Label>
                  <Input
                    id="edit-ticket-price"
                    type="number"
                    value={editingTicketType.price as string}
                    onChange={(e) => setEditingTicketType({ ...editingTicketType, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-ticket-capacity">Capacité *</Label>
                  <Input
                    id="edit-ticket-capacity"
                    type="number"
                    value={editingTicketType.capacity}
                    onChange={(e) => setEditingTicketType({ ...editingTicketType, capacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-ticket-description">Description</Label>
                <textarea
                  id="edit-ticket-description"
                  rows={3}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={editingTicketType.description || ''}
                  onChange={(e) => setEditingTicketType({ ...editingTicketType, description: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTicketModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdateTicketType}
              disabled={!editingTicketType?.name || !editingTicketType?.price || !editingTicketType?.capacity}
            >
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de création de promotion */}
      <Dialog open={isCreatePromotionModalOpen} onOpenChange={setIsCreatePromotionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle promotion</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle promotion
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promo-title">Titre de la promotion *</Label>
              <Input
                id="promo-title"
                placeholder="Early Bird Special - 20% de réduction"
                value={newPromotion.title}
                onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-desc">Description</Label>
              <textarea
                id="promo-desc"
                rows={3}
                placeholder="Décrivez cette offre promotionnelle..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newPromotion.description || ''}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-discount-type">Type de réduction</Label>
                <Select
                  value={newPromotion.discountType}
                  onValueChange={(value: "percentage" | "fixed") => setNewPromotion({ ...newPromotion, discountType: value })}
                >
                  <SelectTrigger id="promo-discount-type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (Ar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-discount-value">
                  {newPromotion.discountType === 'percentage' ? 'Pourcentage de réduction *' : 'Montant de réduction (Ar) *'}
                </Label>
                <Input
                  id="promo-discount-value"
                  type="number"
                  min="0"
                  max={newPromotion.discountType === 'percentage' ? "100" : undefined}
                  placeholder={newPromotion.discountType === 'percentage' ? "20" : "5000"}
                  value={newPromotion.discountValue as string}
                  onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-start">Date de début *</Label>
                <Input
                  id="promo-start"
                  type="datetime-local"
                  value={newPromotion.validFrom.split('.')[0].slice(0, 16)}
                  onChange={(e) => setNewPromotion({ ...newPromotion, validFrom: e.target.value + ':00' })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-end">Date de fin *</Label>
                <Input
                  id="promo-end"
                  type="datetime-local"
                  value={newPromotion.validTo.split('.')[0].slice(0, 16)}
                  onChange={(e) => setNewPromotion({ ...newPromotion, validTo: e.target.value + ':00' })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-status">Statut</Label>
              <Select
                value={newPromotion.status}
                onValueChange={(value: "active" | "inactive" | "expired") => setNewPromotion({ ...newPromotion, status: value })}
              >
                <SelectTrigger id="promo-status">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expirée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 bg-muted/20">
              <h4 className="font-medium mb-2">Canaux de distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['app', 'email', 'sms', 'social', 'push'].map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`channel-${channel}`}
                      className="rounded"
                      checked={Array.isArray(newPromotion.channels) && newPromotion.channels.includes(channel)}
                      onChange={() => handleChannelToggle(channel)}
                    />
                    <label htmlFor={`channel-${channel}`}>
                      {channel === 'app' && 'Application'}
                      {channel === 'email' && 'Email'}
                      {channel === 'sms' && 'SMS'}
                      {channel === 'social' && 'Réseaux sociaux'}
                      {channel === 'push' && 'Notifications push'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePromotionModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreatePromotion}
              disabled={!newPromotion.title || !newPromotion.discountValue || !newPromotion.validFrom || !newPromotion.validTo}
            >
              Créer la promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de modification de promotion */}
      <Dialog open={isEditPromotionModalOpen} onOpenChange={setIsEditPromotionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la promotion</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la promotion
            </DialogDescription>
          </DialogHeader>

          {editingPromotion && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-promo-title">Titre de la promotion *</Label>
                <Input
                  id="edit-promo-title"
                  value={editingPromotion.title}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-promo-desc">Description</Label>
                <textarea
                  id="edit-promo-desc"
                  rows={3}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={editingPromotion.description || ''}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-promo-discount-type">Type de réduction</Label>
                  <Select
                    value={editingPromotion.discountType}
                    onValueChange={(value: "percentage" | "fixed") => setEditingPromotion({ ...editingPromotion, discountType: value })}
                  >
                    <SelectTrigger id="edit-promo-discount-type">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (Ar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-promo-discount-value">
                    {editingPromotion.discountType === 'percentage' ? 'Pourcentage de réduction *' : 'Montant de réduction (Ar) *'}
                  </Label>
                  <Input
                    id="edit-promo-discount-value"
                    type="number"
                    min="0"
                    max={editingPromotion.discountType === 'percentage' ? "100" : undefined}
                    value={editingPromotion.discountValue as string}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-promo-start">Date de début *</Label>
                  <Input
                    id="edit-promo-start"
                    type="datetime-local"
                    value={editingPromotion.validFrom ? new Date(editingPromotion.validFrom).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, validFrom: e.target.value + ':00' })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-promo-end">Date de fin *</Label>
                  <Input
                    id="edit-promo-end"
                    type="datetime-local"
                    value={editingPromotion.validTo ? new Date(editingPromotion.validTo).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, validTo: e.target.value + ':00' })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-promo-status">Statut</Label>
                <Select
                  value={editingPromotion.status}
                  onValueChange={(value: "active" | "inactive" | "expired") => setEditingPromotion({ ...editingPromotion, status: value })}
                >
                  <SelectTrigger id="edit-promo-status">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expirée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-2">Canaux de distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['app', 'email', 'sms', 'social', 'push'].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-channel-${channel}`}
                        className="rounded"
                        checked={Array.isArray(editingPromotion.channels) && editingPromotion.channels.includes(channel)}
                        onChange={() => handleEditChannelToggle(channel)}
                      />
                      <label htmlFor={`edit-channel-${channel}`}>
                        {channel === 'app' && 'Application'}
                        {channel === 'email' && 'Email'}
                        {channel === 'sms' && 'SMS'}
                        {channel === 'social' && 'Réseaux sociaux'}
                        {channel === 'push' && 'Notifications push'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPromotionModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdatePromotion}
              disabled={!editingPromotion?.title || !editingPromotion?.discountValue || !editingPromotion?.validFrom || !editingPromotion?.validTo}
            >
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        onConfirm={alertModal.onConfirm}
        title={alertModal.title}
        description={alertModal.description}
        type={alertModal.type}
        confirmLabel={alertModal.confignLabel}
      />
    </ResponsiveLayout>
  );
};

export default ArtistEventsPage;