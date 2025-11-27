// client/src/pages/EventDetail.tsx
import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from '@/hooks/use-toast';
import {
    getEventById,
    createTicket,
    createEventParticipant,
    getAllEventParticipants,
    getAllEventArtists,
    getAllPromotions,
    getAllTicketTypes,
    useTicketTypes,
    usePromotions,
    createTransaction,
    getArtistById,
    getClubById,
    getUserById
} from '../../services/servapi';
import { Event, TicketType, EventParticipant, InsertTicket, Promotion, EventArtist, Ticket, Transaction, Artist, Club, User } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Users,
    Ticket as TicketIcon,
    Share2,
    Calendar,
    Star,
    Music,
    Wallet,
    CheckCircle,
    User as UserIcon,
    Building,
    Mic2,
    Navigation
} from 'lucide-react';

// Fix for default markers in react-leaflet
declare let L: any;
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Interface pour les données d'artiste étendues
interface ArtistWithDetails extends Artist {
    user?: User;
}

// Interface pour les données de club étendues
interface ClubWithDetails extends Club {
    user?: User;
}

// Interface pour les participants avec détails utilisateur
interface ParticipantWithDetails extends EventParticipant {
    user?: User;
}

export default function EventDetail() {
    const [, params] = useRoute('/event/:id');
    const eventId = parseInt(params?.id || '0');

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<ParticipantWithDetails[]>([]);
    const [eventArtists, setEventArtists] = useState<EventArtist[]>([]);
    const [artistsDetails, setArtistsDetails] = useState<ArtistWithDetails[]>([]);
    const [organizerDetails, setOrganizerDetails] = useState<ClubWithDetails | ArtistWithDetails | null>(null);
    const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState<string>('');
    const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
    const [isBuyingTickets, setIsBuyingTickets] = useState(false);
    const [userTickets, setUserTickets] = useState<Ticket[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distanceToEvent, setDistanceToEvent] = useState<number | null>(null);

    // Utiliser les hooks pour les données liées
    const { data: ticketTypes, refetch: refetchTicketTypes } = useTicketTypes(eventId);
    const { data: promotions } = usePromotions({ eventId, status: 'active' });

    useEffect(() => {
        if (eventId) {
            loadEventData();
        }
        getUserLocation();
        loadCurrentUser();
    }, [eventId]);

    const loadCurrentUser = async () => {
        try {
            // Récupérer l'utilisateur depuis le localStorage
            const authUser = localStorage.getItem("auth_user");
            if (authUser) {
                const user = JSON.parse(authUser);
                setCurrentUser(user);

                // Charger les tickets de l'utilisateur
                const tickets = await getAllTickets(eventId, user.id);
                setUserTickets(tickets || []);
            }
        } catch (error) {
            console.error('Erreur chargement utilisateur:', error);
        }
    };

    const getAllTickets = async (eventId?: number, userId?: number): Promise<Ticket[]> => {
        const params = new URLSearchParams();
        if (eventId) params.append('eventId', eventId.toString());
        if (userId) params.append('userId', userId.toString());

        const url = params.toString() ? `/api/tickets?${params}` : `/api/tickets`;
        return apiRequest<Ticket[]>(url, { method: 'GET' });
    };

    // Utility: Handle fetch with error parsing
    async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json() as Promise<T>;
    }

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Géolocalisation non disponible:', error);
                }
            );
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const loadEventData = async () => {
        try {
            setLoading(true);
            const [eventData, participantsData, artistsData] = await Promise.all([
                getEventById(eventId),
                getAllEventParticipants(eventId),
                getAllEventArtists(eventId)
            ]);

            setEvent(eventData);
            setEventArtists(artistsData || []);

            // Charger les détails des participants avec leurs informations utilisateur
            if (participantsData && participantsData.length > 0) {
                const participantsWithDetails = await Promise.all(
                    participantsData.map(async (participant) => {
                        try {
                            const user = await getUserById(participant.userId);
                            return { ...participant, user };
                        } catch (error) {
                            console.error(`Erreur chargement utilisateur ${participant.userId}:`, error);
                            return { ...participant, user: undefined };
                        }
                    })
                );
                setParticipants(participantsWithDetails);
            } else {
                setParticipants([]);
            }

            // Charger les détails des artistes
            if (artistsData && artistsData.length > 0) {
                const artistsDetailsPromises = artistsData.map(async (eventArtist) => {
                    try {
                        const artist = await getArtistById(eventArtist.artistId);
                        const user = await getUserById(artist.userId);
                        return { ...artist, user, fee: eventArtist.fee };
                    } catch (error) {
                        console.error(`Erreur chargement artiste ${eventArtist.artistId}:`, error);
                        return null;
                    }
                });
                const artistsDetailsResult = await Promise.all(artistsDetailsPromises);
                setArtistsDetails(artistsDetailsResult.filter(artist => artist !== null) as ArtistWithDetails[]);
            }

            // Charger les détails de l'organisateur
            if (eventData) {
                try {
                    if (eventData.organizerType === 'club') {
                        const club = await getClubById(eventData.organizerId);
                        const user = await getUserById(club.userId);
                        setOrganizerDetails({ ...club, user });
                    } else if (eventData.organizerType === 'artist') {
                        const artist = await getArtistById(eventData.organizerId);
                        const user = await getUserById(artist.userId);
                        setOrganizerDetails({ ...artist, user });
                    } else if (eventData.organizerType === 'user') {
                        const user = await getUserById(eventData.organizerId);
                        setOrganizerDetails({ 
                            id: user.id,
                            userId: user.id,
                            displayName: `${user.firstName} ${user.lastName}`,
                            user 
                        } as any);
                    }
                } catch (error) {
                    console.error('Erreur chargement organisateur:', error);
                }
            }

            // Calculer la distance si la géolocalisation est disponible et que l'événement a des coordonnées
            if (userLocation && eventData?.latitude && eventData?.longitude) {
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    Number(eventData.latitude),
                    Number(eventData.longitude)
                );
                setDistanceToEvent(distance);
            }

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les détails de l'événement",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = () => {
        if (!promotions || !promoCode.trim()) {
            setPromoError('Veuillez entrer un code promo');
            return;
        }

        // Réinitialiser les erreurs
        setPromoError('');
        setAppliedPromotion(null);

        // Recherche exacte du code promo
        const promotion = promotions.find(p =>
            p.code?.toLowerCase() === promoCode.trim().toLowerCase()
        );

        if (!promotion) {
            setPromoError('Code promo invalide');
            return;
        }

        // Vérifier si la promotion est encore valide
        const now = new Date();
        const validFrom = new Date(promotion.validFrom);
        const validTo = new Date(promotion.validTo);

        if (now < validFrom) {
            setPromoError('Ce code promo n\'est pas encore valide');
            return;
        }

        if (now > validTo) {
            setPromoError('Ce code promo a expiré');
            return;
        }

        // Appliquer la promotion
        setAppliedPromotion(promotion);

        toast({
            title: "Promotion appliquée !",
            description: `Réduction de ${promotion.discountValue}${promotion.discountType === 'percentage' ? '%' : '€'} appliquée`,
        });
    };

    const calculateTotalPrice = () => {
        if (!selectedTicketType || !ticketTypes) return 0;

        const ticketType = ticketTypes.find(tt => tt.id === selectedTicketType);
        if (!ticketType) return 0;

        let total = Number(ticketType.price) * ticketQuantity;

        if (appliedPromotion) {
            try {
                if (appliedPromotion.discountType === 'percentage') {
                    const discount = total * (Number(appliedPromotion.discountValue) / 100);
                    total = total - discount;
                } else {
                    total = total - Number(appliedPromotion.discountValue);
                }

                // S'assurer que le total ne soit pas négatif
                total = Math.max(0, total);
            } catch (error) {
                console.error('Erreur de calcul de promotion:', error);
            }
        }

        return Number(total.toFixed(2));
    };

    const handleBuyTickets = async () => {
        if (!currentUser || !selectedTicketType || !ticketTypes) {
            toast({
                title: "Connexion requise",
                description: "Veuillez vous connecter pour acheter des tickets",
                variant: "destructive",
            });
            return;
        }

        const ticketType = ticketTypes.find(tt => tt.id === selectedTicketType);
        if (!ticketType) {
            toast({
                title: "Erreur",
                description: "Type de ticket non trouvé",
                variant: "destructive",
            });
            return;
        }

        // Vérifier le solde du portefeuille
        const totalPrice = calculateTotalPrice();
        if (Number(currentUser.walletBalance) < totalPrice) {
            toast({
                title: "Solde insuffisant",
                description: `Votre solde (${Number(currentUser.walletBalance).toFixed(2)}€) est insuffisant pour cette transaction (${totalPrice.toFixed(2)}€)`,
                variant: "destructive",
            });
            return;
        }

        setIsBuyingTickets(true);
        try {
            const pricePerTicket = totalPrice / ticketQuantity;

            // Créer les tickets d'abord
            const createdTickets: Ticket[] = [];
            for (let i = 0; i < ticketQuantity; i++) {
                const ticket = await createTicket({
                    eventId,
                    userId: currentUser.id,
                    ticketTypeId: selectedTicketType,
                    price: pricePerTicket.toString(),
                    status: 'purchased'
                });
                createdTickets.push(ticket);
            }

            // Créer une transaction pour chaque ticket
            const transactionPromises = createdTickets.map(async (ticket) => {
                return createTransaction({
                    userId: currentUser.id,
                    amount: pricePerTicket.toString(),
                    type: 'debit',
                    status: 'completed',
                    sourceType: 'ticket_purchase',
                    sourceId: ticket.id,
                    sourceReference: `Ticket ${ticket.id} pour ${event?.title}`,
                    description: `Achat ticket ${ticketType.name} pour ${event?.title}`,
                    reference: `TICKET-${ticket.id}-${Date.now()}`
                });
            });

            await Promise.all(transactionPromises);

            // Ajouter l'utilisateur comme participant s'il ne l'est pas déjà
            const userIsParticipant = participants.some(p => p.userId === currentUser.id);
            if (!userIsParticipant) {
                await createEventParticipant({
                    eventId,
                    userId: currentUser.id,
                    status: 'confirmed'
                });
            }

            toast({
                title: "Achat réussi !",
                description: `${ticketQuantity} ticket(s) acheté(s) avec succès`,
            });

            // Recharger les données
            refetchTicketTypes();
            const updatedTickets = await getAllTickets(eventId, currentUser.id);
            setUserTickets(updatedTickets || []);
            loadEventData(); // Recharger les participants
            setSelectedTicketType(null);
            setTicketQuantity(1);
            setAppliedPromotion(null);
            setPromoCode('');

        } catch (error) {
            console.error('Erreur achat tickets:', error);
            toast({
                title: "Erreur",
                description: "Impossible d'acheter les tickets",
                variant: "destructive",
            });
        } finally {
            setIsBuyingTickets(false);
        }
    };

    const getUserTicketCountForType = (ticketTypeId: number): number => {
        return userTickets.filter(ticket => ticket.ticketTypeId === ticketTypeId).length;
    };

    const hasUserPurchasedTicketType = (ticketTypeId: number): boolean => {
        return userTickets.some(ticket => ticket.ticketTypeId === ticketTypeId);
    };

    const getRemainingTicketsForType = (ticketType: TicketType): number => {
        // Dans une implémentation réelle, il faudrait compter les tickets vendus
        // Pour l'instant, on retourne la capacité totale
        return ticketType.capacity;
    };

    const getOrganizerDisplayName = () => {
        if (!organizerDetails) return '';
        
        if (organizerDetails.user) {
            return organizerDetails.user.role === 'artist' 
                ? (organizerDetails as ArtistWithDetails).displayName
                : organizerDetails.user.role === 'club'
                ? (organizerDetails as ClubWithDetails).name
                : `${organizerDetails.user.firstName} ${organizerDetails.user.lastName}`;
        }
        
        return (organizerDetails as any).displayName || (organizerDetails as any).name || 'Organisateur';
    };

    const getOrganizerRoleBadge = () => {
        if (!organizerDetails?.user) return null;

        const role = organizerDetails.user.role;
        const roleLabels = {
            artist: 'Artiste',
            club: 'Club',
            user: 'Utilisateur',
            admin: 'Administrateur'
        };

        return (
            <Badge variant="outline" className="ml-2 border-blue-500 text-blue-500">
                {roleLabels[role as keyof typeof roleLabels] || role}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-64 bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-32 bg-gray-700 rounded"></div>
                            <div className="h-48 bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Événement non trouvé</h1>
                <p className="text-gray-400">L'événement que vous recherchez n'existe pas.</p>
            </div>
        );
    }

    const availableTickets = ticketTypes?.filter(tt => getRemainingTicketsForType(tt) > 0) || [];
    const isEventPast = new Date(event.date) < new Date();
    const userIsParticipant = participants.some(p => p.userId === currentUser?.id);
    const hasUserTickets = userTickets.length > 0;
    const hasActivePromotions = promotions && promotions.length > 0;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                    </Button>
                </div>
                
                {/* En-tête de l'événement */}
                <div className="relative mb-8 rounded-lg overflow-hidden">
                    {event.coverImage && (
                        <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-64 object-cover"
                        />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent ${!event.coverImage && 'bg-gray-800'}`}>
                        <div className="absolute bottom-0 left-0 p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={event.status === 'cancelled' ? "destructive" : "secondary"}>
                                    {event.status === 'upcoming' ? 'À venir' :
                                        event.status === 'planning' ? 'En planification' :
                                            event.status === 'past' ? 'Terminé' : 'Annulé'}
                                </Badge>
                                {event.mood && (
                                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                                        {event.mood}
                                    </Badge>
                                )}
                                {distanceToEvent !== null && (
                                    <Badge variant="outline" className="text-green-500 border-green-500">
                                        <Navigation className="w-3 h-3 mr-1" />
                                        {distanceToEvent.toFixed(1)} km
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                            <div className="flex items-center gap-4 text-lg text-gray-300 mb-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-5 h-5" />
                                    {new Date(event.date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-5 h-5" />
                                    {event.startTime} - {event.endTime}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <MapPin className="w-5 h-5" />
                                <span>{event.venueName}, {event.location}</span>
                            </div>
                            {organizerDetails && (
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-sm text-gray-400">Organisé par</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                                            {getOrganizerDisplayName()}
                                        </Badge>
                                        {getOrganizerRoleBadge()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                                <TabsTrigger value="info" className="text-white">Informations</TabsTrigger>
                                <TabsTrigger value="tickets" className="text-white">Tickets</TabsTrigger>
                                <TabsTrigger value="participants" className="text-white">Participants</TabsTrigger>
                                <TabsTrigger value="location" className="text-white">Localisation</TabsTrigger>
                            </TabsList>

                            {/* Informations */}
                            <TabsContent value="info" className="space-y-6">
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-300 leading-relaxed">
                                            {event.description || "Aucune description disponible."}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Artistes */}
                                {artistsDetails.length > 0 && (
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <Music className="w-5 h-5" />
                                                Artistes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {artistsDetails.map((artist) => (
                                                    <div key={artist.id} className="flex items-center gap-3 p-4 rounded-lg bg-gray-900 border border-gray-700 hover:border-blue-500 transition-colors">
                                                        <Avatar className="h-12 w-12">
                                                            {artist.user?.profileImage ? (
                                                                <AvatarImage src={artist.user.profileImage} alt={artist.displayName} />
                                                            ) : (
                                                                <AvatarFallback className="bg-pink-600 text-white">
                                                                    {artist.displayName?.charAt(0) || 'A'}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-white">{artist.displayName}</p>
                                                            <p className="text-sm text-gray-300">
                                                                {Array.isArray(artist.genres) ? artist.genres.join(', ') : ''}
                                                            </p>
                                                            {artist.rating && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                                    <span className="text-sm text-gray-300">
                                                                        {Number(artist.rating).toFixed(1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {artist.fee && (
                                                            <div className="text-right">
                                                                <p className="text-sm text-green-500 font-medium">
                                                                    {Number(artist.fee).toFixed(2)}€
                                                                </p>
                                                                <p className="text-xs text-gray-400">Cachet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Détails */}
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Détails de l'événement</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">Capacité</p>
                                                    <p className="text-white">{event.capacity} personnes</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Prix d'entrée de base</p>
                                                <p className="text-white">{Number(event.price).toFixed(2)}€</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Catégorie</p>
                                                <p className="text-white">{event.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-400">Participants</p>
                                                    <p className="text-white">{participants.length} inscrits</p>
                                                </div>
                                            </div>
                                            {distanceToEvent !== null && (
                                                <div className="flex items-center gap-2">
                                                    <Navigation className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-400">Distance</p>
                                                        <p className="text-white">{distanceToEvent.toFixed(1)} km</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-400">Réservation tables</p>
                                                <p className="text-white">{event.reserveTables ? 'Disponible' : 'Non disponible'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Tickets */}
                            <TabsContent value="tickets" className="space-y-6">
                                {/* Mes tickets */}
                                {hasUserTickets && (
                                    <Card className="bg-gray-800 border-green-500">
                                        <CardHeader>
                                            <CardTitle className="text-green-500 flex items-center gap-2">
                                                <TicketIcon className="w-5 h-5" />
                                                Mes Tickets
                                            </CardTitle>
                                            <CardDescription className="text-gray-300">
                                                Vous avez {userTickets.length} ticket(s) pour cet événement
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {userTickets.map((ticket) => {
                                                    const ticketType = ticketTypes?.find(tt => tt.id === ticket.ticketTypeId);
                                                    return (
                                                        <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-green-500">
                                                            <div>
                                                                <p className="font-medium text-white">
                                                                    {ticketType?.name || 'Ticket'} #{ticket.id}
                                                                </p>
                                                                <p className="text-sm text-gray-300">
                                                                    Acheté le {new Date(ticket.purchasedAt).toLocaleDateString('fr-FR')}
                                                                </p>
                                                                {getUserTicketCountForType(ticket.ticketTypeId) > 0 && (
                                                                    <Badge variant="outline" className="mt-1 bg-blue-500/20 text-blue-400 border-blue-400">
                                                                        {getUserTicketCountForType(ticket.ticketTypeId)} acheté(s)
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant="default" className="bg-green-500">
                                                                    {ticket.status === 'purchased' ? 'Acheté' :
                                                                        ticket.status === 'used' ? 'Utilisé' : 'Remboursé'}
                                                                </Badge>
                                                                <p className="text-sm text-green-500 mt-1">
                                                                    {Number(ticket.price).toFixed(2)}€
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Achat de tickets */}
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <TicketIcon className="w-5 h-5" />
                                            Acheter des tickets
                                        </CardTitle>
                                        <CardDescription className="text-gray-300">
                                            Choisissez votre type de ticket et la quantité
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Types de tickets */}
                                        <div className="space-y-4">
                                            <Label className="text-white">Type de ticket</Label>
                                            <Select
                                                value={selectedTicketType?.toString()}
                                                onValueChange={(value) => setSelectedTicketType(parseInt(value))}
                                            >
                                                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                                    <SelectValue placeholder="Sélectionnez un type de ticket" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                    {availableTickets.map((ticketType) => {
                                                        const userTicketCount = getUserTicketCountForType(ticketType.id);
                                                        const remainingTickets = getRemainingTicketsForType(ticketType);
                                                        const userHasPurchased = hasUserPurchasedTicketType(ticketType.id);

                                                        return (
                                                            <SelectItem
                                                                key={ticketType.id}
                                                                value={ticketType.id.toString()}
                                                                disabled={remainingTickets <= 0}
                                                            >
                                                                <div className="flex justify-between items-center w-full">
                                                                    <div>
                                                                        <span className={userHasPurchased ? "line-through text-gray-400" : ""}>
                                                                            {ticketType.name}
                                                                        </span>
                                                                        {userHasPurchased && (
                                                                            <Badge variant="outline" className="ml-2 text-xs bg-green-500/20 text-green-400 border-green-400">
                                                                                Déjà acheté
                                                                            </Badge>
                                                                        )}
                                                                        {userTicketCount > 0 && !userHasPurchased && (
                                                                            <Badge variant="outline" className="ml-2 text-xs bg-blue-500/20 text-blue-400 border-blue-400">
                                                                                {userTicketCount} acheté(s)
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className={`ml-4 ${userHasPurchased ? "text-gray-400 line-through" : "text-green-500"}`}>
                                                                            {Number(ticketType.price).toFixed(2)}€
                                                                        </span>
                                                                        <div className="text-xs text-gray-400">
                                                                            {remainingTickets} restant(s)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Quantité */}
                                        {selectedTicketType && (
                                            <div className="space-y-4">
                                                <Label className="text-white">Quantité</Label>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                                        className="border-gray-700 text-white"
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="text-white font-medium">{ticketQuantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                                                        className="border-gray-700 text-white"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Code promotionnel - SEULEMENT si l'événement a des promotions actives */}
                                        {selectedTicketType && hasActivePromotions && (
                                            <div className="space-y-4">
                                                <Label className="text-white">Code promotionnel</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Entrez votre code promo"
                                                        value={promoCode}
                                                        onChange={(e) => {
                                                            setPromoCode(e.target.value);
                                                            setPromoError('');
                                                        }}
                                                        className="bg-gray-900 border-gray-700 text-white"
                                                    />
                                                    <Button
                                                        onClick={handleApplyPromo}
                                                        disabled={!promoCode.trim()}
                                                        className="bg-pink-600 hover:bg-pink-700 text-white"
                                                    >
                                                        Appliquer
                                                    </Button>
                                                </div>
                                                {promoError && (
                                                    <p className="text-red-500 text-sm">{promoError}</p>
                                                )}
                                                {appliedPromotion && (
                                                    <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-green-500 font-medium">{appliedPromotion.title}</p>
                                                                <p className="text-green-500 text-sm">
                                                                    -{appliedPromotion.discountValue}
                                                                    {appliedPromotion.discountType === 'percentage' ? '%' : '€'} de réduction
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setAppliedPromotion(null);
                                                                    setPromoCode('');
                                                                }}
                                                                className="text-green-500 hover:bg-green-500/20"
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Total et achat */}
                                        {selectedTicketType && (
                                            <div className="space-y-4">
                                                <Separator className="bg-gray-700" />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white font-medium">Total</span>
                                                    <span className="text-2xl font-bold text-green-500">
                                                        {calculateTotalPrice().toFixed(2)}€
                                                    </span>
                                                </div>
                                                {currentUser && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-300 flex items-center gap-1">
                                                            <Wallet className="w-4 h-4" />
                                                            Solde après achat
                                                        </span>
                                                        <span className={`font-medium ${Number(currentUser.walletBalance) - calculateTotalPrice() < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                            {(Number(currentUser.walletBalance) - calculateTotalPrice()).toFixed(2)}€
                                                        </span>
                                                    </div>
                                                )}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            disabled={isBuyingTickets || isEventPast}
                                                            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                                        >
                                                            {isBuyingTickets ? "Achat en cours..." : "Acheter les tickets"}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                                                        <DialogHeader>
                                                            <DialogTitle>Confirmation d'achat</DialogTitle>
                                                            <DialogDescription className="text-gray-300">
                                                                Vérifiez les détails de votre commande avant de confirmer.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-400">Événement</p>
                                                                    <p className="text-white">{event.title}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-400">Type de ticket</p>
                                                                    <p className="text-white">
                                                                        {ticketTypes?.find(tt => tt.id === selectedTicketType)?.name}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-400">Quantité</p>
                                                                    <p className="text-white">{ticketQuantity}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-400">Total</p>
                                                                    <p className="text-green-500 font-bold">{calculateTotalPrice().toFixed(2)}€</p>
                                                                </div>
                                                            </div>
                                                            {appliedPromotion && (
                                                                <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg">
                                                                    <p className="text-green-500 text-sm">
                                                                        Promotion appliquée : {appliedPromotion.title}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => document.querySelector('button[data-state="closed"]')?.click()}
                                                                    className="flex-1 border-gray-700 text-white"
                                                                >
                                                                    Annuler
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        handleBuyTickets();
                                                                        document.querySelector('button[data-state="closed"]')?.click();
                                                                    }}
                                                                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                                                                >
                                                                    Confirmer l'achat
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                {isEventPast && (
                                                    <p className="text-red-500 text-sm text-center">
                                                        Les ventes de tickets sont closes pour cet événement passé
                                                    </p>
                                                )}
                                                {getUserTicketCountForType(selectedTicketType!) > 0 && (
                                                    <p className="text-blue-400 text-sm text-center">
                                                        Vous avez déjà {getUserTicketCountForType(selectedTicketType!)} ticket(s) de ce type
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Participants */}
                            <TabsContent value="participants">
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                Participants ({participants.length})
                                                {hasUserTickets && (
                                                    <Badge className="ml-2 bg-green-500">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Vous participez
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-96">
                                            <div className="space-y-3">
                                                {participants.length > 0 ? (
                                                    participants.map((participant) => (
                                                        <div key={`${participant.eventId}-${participant.userId}`} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-700">
                                                            <Avatar className="h-10 w-10">
                                                                {participant.user?.profileImage ? (
                                                                    <AvatarImage src={participant.user.profileImage} alt={participant.user.username} />
                                                                ) : (
                                                                    <AvatarFallback className={`${participant.userId === currentUser?.id ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                                                                        {participant.userId === currentUser?.id ? 'Vous' : participant.user?.firstName?.charAt(0) || 'U'}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-white">
                                                                        {participant.userId === currentUser?.id 
                                                                            ? 'Vous' 
                                                                            : `${participant.user?.firstName} ${participant.user?.lastName}`}
                                                                    </p>
                                                                    {participant.user?.role && participant.userId !== currentUser?.id && (
                                                                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                                                            {participant.user.role === 'artist' && <Mic2 className="w-3 h-3 mr-1" />}
                                                                            {participant.user.role === 'club' && <Building className="w-3 h-3 mr-1" />}
                                                                            {participant.user.role === 'user' && <UserIcon className="w-3 h-3 mr-1" />}
                                                                            {participant.user.role}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-300">
                                                                    @{participant.user?.username}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    Rejoint le {new Date(participant.joinedAt).toLocaleDateString('fr-FR')}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant={participant.status === 'confirmed' ? "default" : "secondary"}
                                                                className="ml-auto"
                                                            >
                                                                {participant.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-300 py-8">
                                                        Aucun participant pour le moment
                                                    </p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Localisation */}
                            <TabsContent value="location">
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Localisation
                                        </CardTitle>
                                        <CardDescription className="text-gray-300">
                                            {event.venueName} - {event.location}
                                            {distanceToEvent !== null && ` (à ${distanceToEvent.toFixed(1)} km)`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {event.latitude && event.longitude ? (
                                            <div className="h-96 rounded-lg overflow-hidden">
                                                <MapContainer
                                                    center={[Number(event.latitude), Number(event.longitude)]}
                                                    zoom={15}
                                                    style={{ height: '100%', width: '100%' }}
                                                    scrollWheelZoom={false}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <Marker position={[Number(event.latitude), Number(event.longitude)]}>
                                                        <Popup>
                                                            <div className="text-black">
                                                                <strong>{event.venueName}</strong><br />
                                                                {event.location}<br />
                                                                {event.city}, {event.country}
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                    {userLocation && (
                                                        <Marker
                                                            position={[userLocation.lat, userLocation.lng]}
                                                            icon={L.divIcon({
                                                                className: 'user-location-marker',
                                                                html: '📍',
                                                                iconSize: [20, 20]
                                                            })}
                                                        >
                                                            <Popup>Votre position</Popup>
                                                        </Marker>
                                                    )}
                                                </MapContainer>
                                            </div>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
                                                <p className="text-gray-300">Localisation non disponible</p>
                                            </div>
                                        )}
                                        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                                            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Adresse
                                            </h4>
                                            <p className="text-gray-300">{event.location}</p>
                                            {event.city && event.country && (
                                                <p className="text-gray-300">
                                                    {event.city}, {event.country}
                                                </p>
                                            )}
                                            {distanceToEvent !== null && (
                                                <p className="text-green-500 mt-2 flex items-center gap-1">
                                                    <Navigation className="w-4 h-4" />
                                                    À {distanceToEvent.toFixed(1)} km de votre position
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statut de participation */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Votre participation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {hasUserTickets ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg">
                                            <p className="text-green-500 font-medium text-center flex items-center justify-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                Vous participez à cet événement
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-300">
                                                Vous avez {userTickets.length} ticket(s)
                                            </p>
                                        </div>
                                    </div>
                                ) : currentUser ? (
                                    <div className="space-y-3">
                                        <p className="text-gray-300 text-sm text-center">
                                            Achetez un ticket pour participer à cet événement
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-gray-300 text-sm text-center">
                                            Connectez-vous pour acheter un ticket et participer
                                        </p>
                                        <Button
                                            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                                            onClick={() => {
                                                // Redirection vers la page de connexion
                                                window.location.href = '/login';
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full border-gray-700 text-white flex items-center gap-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast({
                                            title: "Lien copié",
                                            description: "Le lien de l'événement a été copié dans le presse-papier",
                                        });
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Partager l'événement
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Statistiques */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Participants
                                        </span>
                                        <span className="text-white font-medium">{participants.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Capacité</span>
                                        <span className="text-white font-medium">{event.capacity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Taux de remplissage</span>
                                        <span className="text-white font-medium">
                                            {Math.round((participants.length / event.capacity) * 100)}%
                                        </span>
                                    </div>
                                    {ticketTypes && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 flex items-center gap-2">
                                                <TicketIcon className="w-4 h-4" />
                                                Types de tickets
                                            </span>
                                            <span className="text-white font-medium">{ticketTypes.length}</span>
                                        </div>
                                    )}
                                    {distanceToEvent !== null && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 flex items-center gap-2">
                                                <Navigation className="w-4 h-4" />
                                                Distance
                                            </span>
                                            <span className="text-white font-medium">{distanceToEvent.toFixed(1)} km</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prochainement */}
                        {!isEventPast && (
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Prochainement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Dans</span>
                                            <span className="text-white font-medium">
                                                {Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Début</span>
                                            <span className="text-white font-medium">{event.startTime}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Fin</span>
                                            <span className="text-white font-medium">{event.endTime}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}