// client/src/pages/FindArtistsPage.tsx
import React, { useState, useMemo } from 'react';
import { useArtists, useUsers, useArtistPortfolios, useFeedback, useEvents, createArtistInvitation, useInvitations } from '@/services/servapi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Calendar as CalendarIcon, Music, DollarSign, Users, Filter, ChevronLeft, ChevronRight, Send, Eye } from 'lucide-react';
import ResponsiveLayout from '@/layouts/ResponsiveLayout';
import { toast } from '@/hooks/use-toast';

// Types pour les filtres
interface ArtistFilters {
  search: string;
  genre: string;
  minRate: number;
  maxRate: number;
  minPopularity: number;
  availability: boolean;
  city: string;
  minRating: number;
}

// Composant Carousel pour les images de portfolio
const PortfolioCarousel: React.FC<{ images: any[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-800 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-lg">
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      <img
        src={images[currentIndex]?.image}
        alt={images[currentIndex]?.title || 'Portfolio'}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none hover:bg-opacity-70 z-20"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none hover:bg-opacity-70 z-20"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Indicateurs */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const InvitationModal: React.FC<{
  artist: any;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (eventId: number, description: string, expectedAttendees: number) => void;
}> = ({ artist, isOpen, onClose, onInvite }) => {
  if (!artist) return null;
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expectedAttendees, setExpectedAttendees] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer l'utilisateur connecté
  const currentUser = JSON.parse(localStorage.getItem("auth_user") || '{}');

  // Récupérer les événements de l'utilisateur connecté
  const { data: userEvents, loading: eventsLoading } = useEvents({
    organizerId: currentUser.id,
    organizerType: currentUser.role
  });

  // Récupérer les invitations existantes
  const { data: existingInvitations } = useInvitations({
    invitedById: currentUser.id
  });

  // Fonction pour vérifier si l'artiste est déjà invité à un événement
  const isAlreadyInvitedToEvent = (eventId: number) => {
    if (!existingInvitations || !artist) return false;
    return existingInvitations.some((invitation: any) =>
      invitation.userId === artist.userId &&
      invitation.eventId === eventId &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(invitation.status)
    );
  };

  // Fonction pour récupérer l'invitation existante pour un événement
  const getExistingInvitationForEvent = (eventId: number) => {
    if (!existingInvitations || !artist) return null;
    return existingInvitations.find((invitation: any) =>
      invitation.userId === artist.userId &&
      invitation.eventId === eventId &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(invitation.status)
    );
  };

  const handleSubmit = async () => {
    if (!selectedEvent) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un événement",
        variant: "destructive",
      });
      return;
    }

    const eventId = parseInt(selectedEvent);

    // Vérifier si l'artiste est déjà invité à cet événement
    const existingInvitation = existingInvitations?.find((inv: any) =>
      inv.userId === artist.userId &&
      inv.eventId === eventId &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(inv.status)
    );;

    if (existingInvitation) {
      const event = userEvents?.find((e: any) => e.id === eventId);

      toast({
        title: "Invitation déjà envoyée",
        description: `Cet artiste a déjà été invité à l'événement "${event?.title}". Statut: ${existingInvitation.status}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite(eventId, description, expectedAttendees);
      setSelectedEvent('');
      setDescription('');
      setExpectedAttendees(0);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les événements pour lesquels l'artiste n'est pas déjà invité
  const availableEvents = userEvents?.filter((event: any) => {
    // Vérifier si l'artiste est déjà invité à cet événement avec un statut actif
    if (!artist) return true; // Si artist est null, on montre tous les événements
    const isInvited = existingInvitations?.some((inv: any) =>
      inv.userId === artist.userId &&
      inv.eventId === event.id &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(inv.status)
    );
    return !isInvited;
  }) || [];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#18181b] rounded-lg max-w-md w-full border border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">
            Inviter {artist?.displayName}
          </h3>
          <p className="text-gray-400 mb-6">
            Sélectionnez un événement pour lequel vous souhaitez inviter cet artiste.
          </p>

          <div className="space-y-4">
            {/* Sélection d'événement */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Événement</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="bg-[#18181b] border-gray-700 text-white">
                  <SelectValue placeholder="Choisir un événement" />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-gray-700 text-white max-h-96">
                  {eventsLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : userEvents && userEvents.length > 0 ? (
                    userEvents.map((event: any) => {
                      const isAlreadyInvited = existingInvitations?.some((inv: any) =>
                        inv.userId === artist.userId &&
                        inv.eventId === event.id &&
                        !['completed', 'cancelled', 'declined', 'rejected'].includes(inv.status)
                      );

                      return (
                        <SelectItem
                          key={event.id}
                          value={event.id.toString()}
                          disabled={isAlreadyInvited}
                        >
                          <div className="flex items-center gap-3 py-1">
                            {event.coverImage && (
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-10 h-10 rounded-md object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium truncate ${isAlreadyInvited ? 'text-gray-500' : 'text-white'}`}>
                                  {event.title}
                                </span>
                                <Badge className={`text-xs ${event.status === 'upcoming' ? 'bg-green-500' :
                                  event.status === 'planning' ? 'bg-blue-500' :
                                    event.status === 'past' ? 'bg-gray-500' :
                                      event.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                                  }`}>
                                  {event.status === 'upcoming' ? 'À venir' :
                                    event.status === 'planning' ? 'En planification' :
                                      event.status === 'past' ? 'Passé' :
                                        event.status === 'cancelled' ? 'Annulé' : event.status}
                                </Badge>
                              </div>
                              <div className={`text-xs ${isAlreadyInvited ? 'text-gray-500' : 'text-gray-400'}`}>
                                {new Date(event.date).toLocaleDateString('fr-FR')} • {event.venueName}
                                {isAlreadyInvited && (
                                  <div className="text-yellow-500 text-xs mt-1">
                                    ✓ Déjà invité
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-events" disabled>Aucun événement disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* Message d'information si des événements sont filtrés */}
              {userEvents && availableEvents.length < userEvents.length && (
                <div className="text-xs text-yellow-500 bg-yellow-500 bg-opacity-10 p-2 rounded-md">
                  {userEvents.length - availableEvents.length} événement(s) masqué(s) - artiste déjà invité
                </div>
              )}
            </div>

            {/* Reste du code reste inchangé... */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nombre d'attendees prévus</label>
              <Input
                type="number"
                min="0"
                placeholder="Estimation du nombre de participants..."
                value={expectedAttendees}
                onChange={(e) => setExpectedAttendees(parseInt(e.target.value) || 0)}
                className="bg-[#18181b] border-gray-700 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Message (optionnel)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre événement et vos attentes..."
                className="w-full h-24 p-3 bg-[#18181b] border border-gray-700 rounded-md text-white placeholder-gray-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#18181b] text-white border-gray-700 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedEvent || isSubmitting || availableEvents.length === 0 || isAlreadyInvitedToEvent(parseInt(selectedEvent))}
              className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
            >
              {isSubmitting ? "Envoi..." : <><Send className="w-4 h-4 mr-2" />Envoyer l'invitation</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour obtenir le badge de statut d'événement
const getEventStatusBadge = (status: string) => {
  const statusConfig: { [key: string]: { label: string; color: string } } = {
    upcoming: { label: 'À venir', color: 'bg-green-500' },
    planning: { label: 'En planification', color: 'bg-blue-500' },
    past: { label: 'Passé', color: 'bg-gray-500' },
    cancelled: { label: 'Annulé', color: 'bg-red-500' }
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-500' };

  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
};

const InvitationDetailModal: React.FC<{
  invitation: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (invitationId: number, updates: any) => void;
}> = ({ invitation, isOpen, onClose, onUpdate }) => {
  const [description, setDescription] = useState<string>(invitation?.description || '');
  const [expectedAttendees, setExpectedAttendees] = useState<number>(invitation?.expectedAttendees || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer l'événement associé à l'invitation
  const { data: userEvents } = useEvents();
  const event = userEvents?.find((event: any) => event.id === invitation?.eventId);

  // Mettre à jour les champs quand l'invitation change
  React.useEffect(() => {
    if (invitation) {
      setDescription(invitation.description || '');
      setExpectedAttendees(invitation.expectedAttendees || 0);
    }
  }, [invitation]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(invitation.id, {
        description,
        expectedAttendees
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !invitation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#18181b] rounded-lg max-w-2xl w-full border border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Détails de l'invitation
          </h3>

          <div className="space-y-4">
            {/* Informations de l'événement */}
            {event && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-4">
                  {event.coverImage && (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                      {getEventStatusBadge(event.status)}
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('fr-FR')} • {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.venueName}, {event.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Capacité: {event.capacity} personnes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statut de l'invitation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Statut de l'invitation</label>
              <div className="p-2 bg-gray-800 rounded-md text-white">
                {getStatusBadge(invitation.status)}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Message d'invitation</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Modifiez votre message d'invitation..."
                className="w-full h-24 p-3 bg-[#18181b] border border-gray-700 rounded-md text-white placeholder-gray-500 resize-none"
              />
            </div>

            {/* Nombre d'attendees prévus */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nombre d'attendees prévus</label>
              <Input
                type="number"
                min="0"
                value={expectedAttendees}
                onChange={(e) => setExpectedAttendees(parseInt(e.target.value) || 0)}
                className="bg-[#18181b] border-gray-700 text-white"
              />
            </div>

            {/* Date d'invitation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Invité le</label>
              <div className="text-gray-400 p-2 bg-gray-800 rounded-md">
                {new Date(invitation.invitedAt).toLocaleDateString('fr-FR')} à {new Date(invitation.invitedAt).toLocaleTimeString('fr-FR')}
              </div>
            </div>

            {/* Progression si disponible */}
            {invitation.progress !== undefined && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Progression</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#fe2f58] h-2 rounded-full transition-all"
                      style={{ width: `${invitation.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10">{invitation.progress}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#18181b] text-white border-gray-700 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Fermer
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour afficher le badge de statut
const getStatusBadge = (status: string) => {
  const statusConfig: { [key: string]: { label: string; color: string } } = {
    pending: { label: 'En attente', color: 'bg-yellow-500' },
    accepted: { label: 'Accepté', color: 'bg-green-500' },
    declined: { label: 'Refusé', color: 'bg-red-500' },
    confirmed: { label: 'Confirmé', color: 'bg-blue-500' },
    negotiation: { label: 'En négociation', color: 'bg-purple-500' },
    preparation: { label: 'En préparation', color: 'bg-indigo-500' },
    completed: { label: 'Terminé', color: 'bg-green-600' }
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-500' };

  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
};

const FindArtistsPage: React.FC = () => {
  // États pour les filtres
  const [filters, setFilters] = useState<ArtistFilters>({
    search: '',
    genre: '',
    minRate: 0,
    maxRate: 5000,
    minPopularity: 0,
    availability: true,
    city: '',
    minRating: 0,
  });

  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [artistToInvite, setArtistToInvite] = useState<any>(null);

  const [showInvitationDetailModal, setShowInvitationDetailModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);

  // Récupérer l'utilisateur connecté
  const currentUser = JSON.parse(localStorage.getItem("auth_user") || '{}');

  // Récupérer les invitations existantes
  const { data: existingInvitations } = useInvitations({
    invitedById: currentUser.id
  });

  // Récupération des données
  const { data: artists, loading: artistsLoading, error: artistsError } = useArtists();
  const { data: users } = useUsers();
  const { data: portfolios } = useArtistPortfolios();
  const { data: feedback } = useFeedback();

  // Créer un mapping des utilisateurs par ID pour un accès rapide
  const usersMap = useMemo(() => {
    return users?.reduce((acc: any, user) => {
      acc[user.id] = user;
      return acc;
    }, {}) || {};
  }, [users]);

  // Créer un mapping des portfolios par artistId
  const portfoliosMap = useMemo(() => {
    return portfolios?.reduce((acc: any, portfolio) => {
      if (!acc[portfolio.artistId]) {
        acc[portfolio.artistId] = [];
      }
      acc[portfolio.artistId].push(portfolio);
      return acc;
    }, {}) || {};
  }, [portfolios]);

  // Calculer les notes moyennes des artistes
  const artistRatings = useMemo(() => {
    const ratings: { [key: number]: { total: number; count: number; average: number } } = {};

    feedback?.forEach(item => {
      if (item.sourceType === 'artist') {
        if (!ratings[item.sourceId]) {
          ratings[item.sourceId] = { total: 0, count: 0, average: 0 };
        }
        ratings[item.sourceId].total += item.rating;
        ratings[item.sourceId].count += 1;
        ratings[item.sourceId].average = ratings[item.sourceId].total / ratings[item.sourceId].count;
      }
    });

    return ratings;
  }, [feedback]);

  // Filtrer les artistes
  const filteredArtists = useMemo(() => {
    if (!artists) return [];

    return artists.filter(artist => {
      const user = usersMap[artist.userId];
      if (!user) return false;

      // Filtre de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const artistGenres = Array.isArray(artist.genres) ? artist.genres : [];
        const matchesSearch =
          artist.displayName.toLowerCase().includes(searchLower) ||
          artist.bio?.toLowerCase().includes(searchLower) ||
          artistGenres.some((genre: string) => genre.toLowerCase().includes(searchLower)) ||
          user.city?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Filtre par genre
      if (filters.genre && filters.genre !== "all") {
        const artistGenres = Array.isArray(artist.genres) ? artist.genres : [];
        if (!artistGenres.includes(filters.genre)) {
          return false;
        }
      }

      // Filtre par tarif
      const rate = parseFloat(artist.rate || '0');
      if (rate < filters.minRate || rate > filters.maxRate) {
        return false;
      }

      // Filtre par popularité
      if (artist.popularity < filters.minPopularity) {
        return false;
      }

      // Filtre par disponibilité
      if (filters.availability && !artist.availability) {
        return false;
      }

      // Filtre par ville
      if (filters.city && filters.city !== "all" && user.city !== filters.city) {
        return false;
      }

      // Filtre par note minimum
      const rating = artistRatings[artist.id]?.average || parseFloat(artist.rating || '0');
      if (rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [artists, usersMap, filters, artistRatings]);

  // Génres uniques pour le filtre
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    artists?.forEach(artist => {
      // S'assurer que genres est bien un tableau
      const artistGenres = Array.isArray(artist.genres) ? artist.genres : [];
      artistGenres.forEach((genre: string) => {
        if (genre && typeof genre === 'string') {
          genres.add(genre);
        }
      });
    });
    return Array.from(genres).sort();
  }, [artists]);

  // Villes uniques pour le filtre
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    artists?.forEach(artist => {
      const user = usersMap[artist.userId];
      if (user?.city) {
        cities.add(user.city);
      }
    });
    return Array.from(cities).sort();
  }, [artists, usersMap]);

  // Vérifier si un artiste est disponible à une date spécifique
  const isArtistAvailableOnDate = (artist: any, date: Date) => {
    if (!artist.availability) return false;

    const dateString = date.toISOString().split('T')[0];
    return !artist.unavailableDates?.includes(dateString);
  };

  // Fonction pour personnaliser le rendu des jours du calendrier
  const isUnavailableDate = (date: Date, artist: any) => {
    if (!artist.unavailableDates) return false;

    const dateString = date.toISOString().split('T')[0];
    return artist.unavailableDates.some((unavailableDate: string) => {
      return unavailableDate === dateString;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Fonction pour styliser les jours du calendrier
  const dayContent = (date: Date, artist: any) => {
    const day = date.getDate();

    if (isUnavailableDate(date, artist)) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-md text-sm font-medium">
          {day}
        </div>
      );
    }

    if (isToday(date)) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-medium">
          {day}
        </div>
      );
    }

    return (
      <div className="w-8 h-8 flex items-center justify-center text-sm">
        {day}
      </div>
    );
  };

  // Gérer la sélection d'un artiste
  const handleArtistSelect = (artist: any) => {
    setSelectedArtist(artist);
  };

  // Gérer l'invitation d'un artiste
  const handleInviteArtist = (artist: any) => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = JSON.parse(localStorage.getItem("auth_user") || '{}');
    if (!currentUser.id) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour inviter un artiste",
        variant: "destructive",
      });
      return;
    }

    setArtistToInvite(artist);
    setShowInvitationModal(true);
  };

  // Gérer la visualisation des détails d'invitation
  const handleViewInvitation = (artist: any) => {
    const invitation = getExistingInvitation(artist);
    if (invitation) {
      setSelectedInvitation(invitation);
      setShowInvitationDetailModal(true);
    }
  };

  const handleSendInvitation = async (eventId: number, description: string, expectedAttendees: number) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("auth_user") || '{}');

      const invitationData = {
        eventId: eventId,
        userId: artistToInvite.userId, // L'ID de l'utilisateur artiste
        invitedById: currentUser.id,
        status: "pending" as const,
        description: description,
        genre: artistToInvite.genres?.[0] || '',
        expectedAttendees: expectedAttendees
      };

      await createArtistInvitation(invitationData);

      toast({
        title: "Invitation envoyée",
        description: `Votre invitation a été envoyée à ${artistToInvite.displayName}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour une invitation existante
  const handleUpdateInvitation = async (invitationId: number, updates: any) => {
    try {
      // Ici vous devrez implémenter la mise à jour de l'invitation
      // selon votre API
      toast({
        title: "Invitation mise à jour",
        description: "Les modifications ont été enregistrées",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'invitation",
        variant: "destructive",
      });
    }
  };

  // Fonction pour vérifier si un artiste est déjà invité à un événement
  const isArtistAlreadyInvited = (artist: any, eventId?: number) => {
    if (!existingInvitations || !artist) return false;
    return existingInvitations.some((invitation: any) =>
      invitation.userId === artist.userId &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(invitation.status) &&
      (eventId ? invitation.eventId === eventId : true)
    );
  };

  // Fonction pour récupérer l'invitation existante d'un artiste
  const getExistingInvitation = (artist: any, eventId?: number) => {
    if (!existingInvitations || !artist) return null;
    return existingInvitations.find((invitation: any) =>
      invitation.userId === artist.userId &&
      !['cancelled', 'declined', 'rejected', 'completed'].includes(invitation.status) &&
      (eventId ? invitation.eventId === eventId : true)
    );
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      search: '',
      genre: '',
      minRate: 0,
      maxRate: 5000,
      minPopularity: 0,
      availability: true,
      city: '',
      minRating: 0,
    });
  };

  if (artistsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-white">Chargement des artistes...</div>
      </div>
    );
  }

  if (artistsError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">Erreur: {artistsError.message}</div>
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="container mx-auto py-8 px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Trouvez l'Artiste Parfait
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Découvrez des artistes talentueux pour votre événement. Filtrez par style, tarif et disponibilité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar des filtres */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-[#18181b] border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Filter className="w-5 h-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recherche */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Recherche</label>
                  <Input
                    placeholder="Nom, style, ville..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="bg-[#18181b] border-gray-700 text-white"
                  />
                </div>

                {/* Genre musical */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Genre musical</label>
                  <Select value={filters.genre} onValueChange={(value) => setFilters({ ...filters, genre: value === "all" ? "" : value })}>
                    <SelectTrigger className="bg-[#18181b] border-gray-700 text-white">
                      <SelectValue placeholder="Tous les genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181b] border-gray-700 text-white">
                      <SelectItem value="all">Tous les genres</SelectItem>
                      {uniqueGenres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ville */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Ville</label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value === "all" ? "" : value })}>
                    <SelectTrigger className="bg-[#18181b] border-gray-700 text-white">
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181b] border-gray-700 text-white">
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {uniqueCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tarif horaire */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white">
                    Tarif horaire: {filters.minRate} Ar - {filters.maxRate} Ar
                  </label>
                  <Slider
                    value={[filters.minRate, filters.maxRate]}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={([min, max]) => setFilters({ ...filters, minRate: min, maxRate: max })}
                    className="my-4"
                  />
                </div>

                {/* Popularité minimum */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white">
                    Popularité minimum: {filters.minPopularity}%
                  </label>
                  <Slider
                    value={[filters.minPopularity]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([value]) => setFilters({ ...filters, minPopularity: value })}
                  />
                </div>

                {/* Note minimum */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white">
                    Note minimum: {filters.minRating} ⭐
                  </label>
                  <Slider
                    value={[filters.minRating]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={([value]) => setFilters({ ...filters, minRating: value })}
                  />
                </div>

                {/* Disponibilité */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Disponible maintenant</label>
                  <Switch
                    checked={filters.availability}
                    onCheckedChange={(checked) => setFilters({ ...filters, availability: checked })}
                  />
                </div>

                {/* Bouton réinitialiser */}
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full bg-[#18181b] text-white border-gray-700 hover:bg-gray-800"
                >
                  Réinitialiser les filtres
                </Button>

                {/* Résultats */}
                <div className="text-center text-sm text-gray-400">
                  {filteredArtists.length} artiste(s) trouvé(s)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArtists.map(artist => {
                const user = usersMap[artist.userId];
                const artistPortfolios = portfoliosMap[artist.id] || [];
                const rating = artistRatings[artist.id]?.average || parseFloat(artist.rating || '0');

                return (
                  <Card
                    key={artist.id}
                    className={`cursor-pointer transition-all hover:shadow-lg bg-[#18181b] border-gray-700 flex flex-col h-full ${selectedArtist?.id === artist.id ? 'ring-2 ring-[#fe2f58]' : ''
                      }`}
                    onClick={() => handleArtistSelect(artist)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback className="bg-gray-700 text-white">
                              {artist.displayName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2 text-white">
                              {artist.displayName}
                              {user?.isVerified && (
                                <Badge variant="outline" className="text-[#3B82F6] border-[#3B82F6]">
                                  Vérifié
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-gray-400">
                              <MapPin className="w-3 h-3" />
                              {user?.city}, {user?.country}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={artist.availability ? "default" : "destructive"}
                          className={artist.availability ? "bg-green-600" : "bg-red-600"}
                        >
                          {artist.availability ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 flex-grow">
                      {/* Genres */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Array.isArray(artist.genres) && artist.genres.slice(0, 3).map((genre: string) => (
                          <Badge key={genre} variant="secondary" className="text-xs bg-gray-700 text-white">
                            {genre}
                          </Badge>
                        ))}
                        {Array.isArray(artist.genres) && artist.genres.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-white">
                            +{artist.genres.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {artist.bio || 'Aucune description disponible.'}
                      </p>

                      {/* Stats */}
                      <div className="flex justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FBBF24]" />
                          <span>{rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{parseFloat(artist.rate || '0')} Ar/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{artist.bookings || 0} réservations</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Boutton anakiroa */}
                    <CardFooter className="mt-auto flex gap-2">
                      <Button
                        className="flex-1 bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArtistSelect(artist);
                        }}
                      >
                        Voir le profil
                      </Button>
                      {isArtistAlreadyInvited(artist) ? (
                        <Button
                          variant="outline"
                          className="bg-[#18181b] text-white border-gray-700 hover:bg-gray-800 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewInvitation(artist);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Détails</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="bg-[#18181b] text-white border-gray-700 hover:bg-gray-800 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInviteArtist(artist);
                          }}
                        >
                          <Send className="w-4 h-4" />
                          <span className="hidden sm:inline">Inviter</span>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredArtists.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Aucun artiste trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de détail de l'artiste */}
        {selectedArtist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#18181b] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
              <ScrollArea className="h-full">
                <div className="relative">
                  {/* Image de couverture avec carousel */}
                  <PortfolioCarousel images={portfoliosMap[selectedArtist.id] || []} />

                  {/* Section profil en bas de l'image */}
                  <div className="relative -mt-16 px-6 pb-6 z-30">
                    <div className="flex items-end space-x-4">
                      <Avatar className="w-24 h-24 border-4 border-[#18181b] bg-[#18181b]">
                        <AvatarImage src={usersMap[selectedArtist.userId]?.profileImage} />
                        <AvatarFallback className="text-2xl bg-gray-700 text-white">
                          {selectedArtist.displayName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                              {selectedArtist.displayName}
                              {usersMap[selectedArtist.userId]?.isVerified && (
                                <Badge className="bg-[#3B82F6]">Vérifié</Badge>
                              )}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-black bg-opacity-80 text-white border-none">
                                <MapPin className="w-3 h-3 mr-1" />
                                {usersMap[selectedArtist.userId]?.city}, {usersMap[selectedArtist.userId]?.country}
                              </Badge>
                              <div className="flex items-center gap-1 text-white bg-black bg-opacity-80 px-2 py-1 rounded-md">
                                <Star className="w-3 h-3 text-[#FBBF24]" />
                                <span className="text-sm">
                                  {artistRatings[selectedArtist.id]?.average?.toFixed(1) || selectedArtist.rating || '0.0'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-white bg-black bg-opacity-80 px-3 py-2 rounded-lg inline-block">
                              {parseFloat(selectedArtist.rate || '0')} Ar/h
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton fermer */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 bg-black bg-opacity-70 text-white border-none hover:bg-opacity-90 z-40"
                    onClick={() => setSelectedArtist(null)}
                  >
                    ×
                  </Button>

                  {/* Contenu sous le profil */}
                  <div className="px-6 pb-6 -mt-2">
                    <Tabs defaultValue="profile" className="mt-6">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                        <TabsTrigger value="profile" className="text-white data-[state=active]:bg-gray-700">Profil</TabsTrigger>
                        <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-gray-700">Portfolio</TabsTrigger>
                        <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-gray-700">Disponibilités</TabsTrigger>
                      </TabsList>

                      <TabsContent value="profile" className="space-y-4">
                        <ScrollArea className="h-64">
                          <div className="space-y-4 p-4">
                            {/* Genres */}
                            <div>
                              <h4 className="font-semibold text-white mb-2">Genres musicaux</h4>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(selectedArtist.genres) && selectedArtist.genres.map((genre: string) => (
                                  <Badge key={genre} variant="secondary" className="bg-gray-700 text-white">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Bio */}
                            <div>
                              <h4 className="font-semibold text-white mb-2">Biographie</h4>
                              <p className="text-gray-400">
                                {selectedArtist.bio || 'Aucune biographie disponible.'}
                              </p>
                            </div>

                            {/* Tags */}
                            {selectedArtist.tags?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-white mb-2">Spécialités</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedArtist.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-gray-400 border-gray-600">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Statistiques */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                  {selectedArtist.bookings || 0}
                                </div>
                                <div className="text-sm text-gray-400">Réservations</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                  {selectedArtist.popularity || 0}%
                                </div>
                                <div className="text-sm text-gray-400">Popularité</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                  {selectedArtist.availability ? 'Oui' : 'Non'}
                                </div>
                                <div className="text-sm text-gray-400">Disponible</div>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="portfolio">
                        <ScrollArea className="h-64">
                          <div className="grid grid-cols-2 gap-4 p-4">
                            {portfoliosMap[selectedArtist.id]?.map((portfolio: any) => (
                              <div key={portfolio.id} className="space-y-2">
                                <img
                                  src={portfolio.image}
                                  alt={portfolio.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <p className="text-sm font-medium text-white">
                                  {portfolio.title}
                                </p>
                              </div>
                            ))}
                            {(!portfoliosMap[selectedArtist.id] || portfoliosMap[selectedArtist.id].length === 0) && (
                              <div className="col-span-2 text-center py-8 text-gray-400">
                                Aucun portfolio disponible
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="calendar">
                        <ScrollArea className="h-64">
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-white font-medium">
                                Calendrier de disponibilité
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-800 rounded-lg p-4">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  className="text-white rounded-md"
                                  components={{
                                    Day: ({ date, ...props }) => (
                                      <button
                                        {...props}
                                        className="w-9 h-9 flex items-center justify-center p-0 aria-selected:opacity-100 hover:bg-gray-600 rounded-md transition-colors"
                                      >
                                        {dayContent(date, selectedArtist)}
                                      </button>
                                    ),
                                  }}
                                />

                                {/* Légende */}
                                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <span>Aujourd'hui</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded-md"></div>
                                    <span>Indisponible</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-transparent border border-gray-400 rounded-md"></div>
                                    <span>Disponible</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="p-4 border border-gray-700 rounded-lg">
                                  <h4 className="font-semibold text-white mb-2">
                                    Disponibilité pour {selectedDate?.toLocaleDateString('fr-FR')}
                                  </h4>
                                  <Badge
                                    variant={isArtistAvailableOnDate(selectedArtist, selectedDate || new Date()) ? "default" : "destructive"}
                                    className={`text-sm ${isArtistAvailableOnDate(selectedArtist, selectedDate || new Date()) ? 'bg-green-600' : 'bg-red-600'}`}
                                  >
                                    {isArtistAvailableOnDate(selectedArtist, selectedDate || new Date())
                                      ? 'Artiste disponible'
                                      : 'Artiste indisponible'}
                                  </Badge>
                                </div>

                                {selectedArtist.unavailableDates?.length > 0 && (
                                  <div className="p-4 border border-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">
                                      Dates d'indisponibilité
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-400">
                                      {selectedArtist.unavailableDates?.slice(0, 5).map((date: string) => (
                                        <div key={date} className="flex items-center gap-2">
                                          <CalendarIcon className="w-3 h-3" />
                                          {new Date(date).toLocaleDateString('fr-FR')}
                                        </div>
                                      ))}
                                      {selectedArtist.unavailableDates?.length > 5 && (
                                        <div className="text-xs text-gray-500">
                                          +{selectedArtist.unavailableDates.length - 5} autres dates
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>

                    <Separator className="my-6 bg-gray-700" />

                    <div className="flex gap-4 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedArtist(null)}
                        className="bg-[#18181b] text-white border-gray-700 hover:bg-gray-800"
                      >
                        Fermer
                      </Button>
                      <Button
                        className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                        onClick={() => handleInviteArtist(selectedArtist)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Inviter l'artiste
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Modal d'invitation */}
        <InvitationModal
          artist={artistToInvite}
          isOpen={showInvitationModal}
          onClose={() => {
            setShowInvitationModal(false);
            setArtistToInvite(null);
          }}
          onInvite={handleSendInvitation}
        />

        {/* Modal de détail d'invitation */}
        <InvitationDetailModal
          invitation={selectedInvitation}
          isOpen={showInvitationDetailModal}
          onClose={() => {
            setShowInvitationDetailModal(false);
            setSelectedInvitation(null);
          }}
          onUpdate={handleUpdateInvitation}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default FindArtistsPage;