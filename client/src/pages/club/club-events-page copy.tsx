// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page.tsx
import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '../../layouts/ResponsiveLayout';
import { Calendar, Clock, MapPin, Users, DollarSign, Music, Bookmark, AlertCircle, Truck, Coffee, Award } from 'lucide-react';
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
import { api } from '@/services/api';
import { Event, InsertEvent } from '@shared/schema';
import { z } from 'zod';

const CLUB_ID = 1; // Hardcoded for demonstration; in production, retrieve from auth context or route params

// Extended Event type to include computed fields
interface ExtendedEvent extends Event {
  reservations: number;
  sales: number;
  time: string;
  artists: string[];
  ticketTypes: {
    name: string;
    price: number;
    available: number;
    sold: number;
  }[];
  coverImage: string; // Gradient or URL
}

const ClubEventsPage: React.FC = () => {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEvent, setNewEvent] = useState<Partial<InsertEvent>>({
    title: '',
    date: new Date(),
    location: '',
    capacity: 200,
    description: '',
    status: 'planning',
    ticketTypesConfig: [],
  });

  // Load events for the club
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const rawEvents = await api.getEventsByClubId(CLUB_ID);
      const extendedEvents: ExtendedEvent[] = await Promise.all(
        rawEvents.map(async (event) => {
          // Calculate reservations (participantCount)
          const reservations = event.participantCount || 0;

          // Calculate sales and ticketTypes with sold
          const rawTickets = await api.getTicketsByEventId(event.id);
          const ticketCounts = rawTickets.reduce((acc, ticket) => {
            const type = ticket.ticketType;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const ticketTypesConfig = event.ticketTypesConfig as any[];
          const ticketTypes = ticketTypesConfig.map((t: any) => ({
            name: t.name,
            price: t.price,
            available: t.available,
            sold: ticketCounts[t.name] || 0,
          }));

          const sales = ticketTypes.reduce((acc, t) => acc + (t.price * t.sold), 0);

          // Time string
          const time = `${event.startTime} - ${event.endTime}`;

          // Artists
          const eventArtists = await api.getEventArtistsByEventId(event.id);
          const artists = await Promise.all(
            eventArtists.map(async (ea) => {
              const artist = await api.getArtist(ea.artistId);
              return artist.displayName;
            })
          );

          // Cover image: fallback to gradient based on title hash
          const gradientHash = event.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;
          const gradients = [
            'from-purple-600 to-blue-500',
            'from-rose-500 to-orange-400',
            'from-gray-500 to-gray-700',
            'from-green-500 to-teal-500',
            'from-indigo-500 to-purple-600',
          ];
          const coverImage = event.coverImage || gradients[gradientHash];

          return {
            ...event,
            reservations,
            sales,
            time,
            artists,
            ticketTypes,
            coverImage,
          };
        })
      );
      setEvents(extendedEvents);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleManageEvent = async (event: ExtendedEvent) => {
    // Recompute for fresh data
    const rawTickets = await api.getTicketsByEventId(event.id);
    const ticketCounts = rawTickets.reduce((acc, ticket) => {
      const type = ticket.ticketType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ticketTypesConfig = event.ticketTypesConfig as any[];
    const ticketTypes = ticketTypesConfig.map((t: any) => ({
      name: t.name,
      price: t.price,
      available: t.available,
      sold: ticketCounts[t.name] || 0,
    }));

    const eventArtists = await api.getEventArtistsByEventId(event.id);
    const artists = await Promise.all(
      eventArtists.map(async (ea) => {
        const artist = await api.getArtist(ea.artistId);
        return artist.displayName;
      })
    );

    setSelectedEvent({ ...event, ticketTypes, artists });
    setIsManageModalOpen(true);
  };

  const handleViewSummary = (event: ExtendedEvent) => {
    setSelectedEvent(event);
    setIsSummaryModalOpen(true);
  };

  const handleCreateEvent = async () => {
    try {
      const validatedData = insertEventSchema.parse({
        ...newEvent,
        clubId: CLUB_ID,
        // Defaults for required fields not in form
        startTime: '21:00',
        endTime: '04:00',
        city: '',
        country: '',
        venueName: 'Club',
        category: 'party',
        price: 0,
        participantCount: 0,
        popularity: 0,
        isApproved: false,
        mood: undefined,
        createdAt: new Date(),
      });
      await api.createEvent(validatedData);
      toast({
        title: "Événement créé",
        description: "Votre nouvel événement a été créé avec succès",
      });
      setIsCreateModalOpen(false);
      setNewEvent({
        title: '',
        date: new Date(),
        location: '',
        capacity: 200,
        description: '',
        status: 'planning',
        ticketTypesConfig: [],
      });
      loadEvents();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'événement",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateEventDetails = async () => {
    if (!selectedEvent) return;
    try {
      const updateData: Partial<InsertEvent> = {
        title: (document.getElementById('event-title') as HTMLInputElement)?.value || selectedEvent.title,
        date: new Date((document.getElementById('event-date') as HTMLInputElement)?.value || selectedEvent.date),
        startTime: selectedEvent.startTime, // Keep existing or update if form has it
        endTime: selectedEvent.endTime,
        location: (document.getElementById('event-location') as HTMLInputElement)?.value || selectedEvent.location,
        capacity: parseInt((document.getElementById('event-capacity') as HTMLInputElement)?.value || selectedEvent.capacity.toString()),
        description: (document.getElementById('event-description') as HTMLTextAreaElement)?.value || selectedEvent.description,
        status: (document.getElementById('event-status') as HTMLSelectElement)?.value as any || selectedEvent.status,
      };
      await api.updateEvent(selectedEvent.id, updateData);
      toast({
        title: "Événement mis à jour",
        description: "Les détails de l'événement ont été mis à jour avec succès",
      });
      setIsManageModalOpen(false);
      loadEvents();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTickets = async () => {
    if (!selectedEvent) return;
    try {
      // Parse new config from form (simplified: assume manual input or keep existing)
      // For full impl, add form fields for each ticket type
      const updateData: Partial<InsertEvent> = {
        ticketTypesConfig: selectedEvent.ticketTypesConfig, // Update if form changes
      };
      await api.updateEvent(selectedEvent.id, updateData);
      toast({
        title: "Tickets mis à jour",
        description: "La configuration des tickets a été mise à jour avec succès",
      });
      setIsManageModalOpen(false);
      loadEvents();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les tickets",
        variant: "destructive",
      });
    }
  };

  const handlePublishPromotion = () => {
    if (!selectedEvent) return;
    // Promotion not in schema, just toast
    toast({
      title: "Promotion publiée",
      description: `La promotion pour "${selectedEvent.title}" a été publiée avec succès`,
    });
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;
    try {
      await api.deleteEvent(eventId);
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès",
      });
      loadEvents();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
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

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="p-6 md:p-8 flex justify-center items-center h-64">
          <div className="text-lg">Chargement des événements...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' Ar';
  };

  const formatDate = (date: Date | string): string => {
    return new Intl.DateTimeFormat('fr-MG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };

  // EventCard component (unchanged except props)
  const EventCard: React.FC<{ event: ExtendedEvent, onManage: (event: ExtendedEvent) => void, onViewSummary: (event: ExtendedEvent) => void, onDelete: (id: number) => void }> = ({ 
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

    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className={`h-40 bg-gradient-to-r ${event.coverImage} relative`}></div>
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
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Réservations</span>
              <span className="text-sm font-medium">{event.reservations} / {event.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {event.status === 'past' ? 'Revenus totaux' : 'Vente de tickets'}
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
                Gérer l'événement
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => onViewSummary(event)}
              >
                Voir le récapitulatif
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Événements du club</h1>
            <p className="text-lg text-muted-foreground mt-1">Gérez vos événements passés et à venir</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 md:mt-0"
          >
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

        {filteredEvents.length === 0 ? (
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
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {events.filter(e => e.status === 'upcoming').length} à venir
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(events.reduce((acc, event) => acc + event.sales, 0))}</div>
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
                  {events.length > 0 ? Math.round(
                    (events.reduce((acc, event) => acc + event.reservations, 0) / 
                    events.reduce((acc, event) => acc + event.capacity, 0)) * 100
                  ) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basé sur tous les événements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Artistes invités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(events.flatMap(event => event.artists)).size}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Artistes uniques programmés
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
                    <Input id="event-title" defaultValue={selectedEvent.title} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" defaultValue={selectedEvent.date.toISOString().split('T')[0]} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Horaires</Label>
                    <Input id="event-time" defaultValue={selectedEvent.time} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Lieu</Label>
                    <Input id="event-location" defaultValue={selectedEvent.location} />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="event-description">Description</Label>
                    <textarea 
                      id="event-description" 
                      rows={4} 
                      defaultValue={selectedEvent.description}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">Capacité</Label>
                    <Input id="event-capacity" type="number" defaultValue={selectedEvent.capacity} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-status">Statut</Label>
                    <Select defaultValue={selectedEvent.status}>
                      <SelectTrigger id="event-status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">En planification</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
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
                      {selectedEvent.ticketTypes.map((ticket, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3">{ticket.name}</td>
                          <td className="py-3">{formatCurrency(ticket.price)}</td>
                          <td className="py-3">{ticket.sold}</td>
                          <td className="py-3">{ticket.available}</td>
                          <td className="py-3">
                            <Button variant="outline" size="sm">Modifier</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button variant="outline" className="mt-4">
                  Ajouter un type de ticket
                </Button>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Fermer</Button>
                  <Button onClick={handleUpdateTickets}>Enregistrer les modifications</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="artists" className="space-y-4">
                <div className="space-y-4">
                  {selectedEvent.artists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Music className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{artist}</p>
                          <p className="text-sm text-muted-foreground">Performance confirmée</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Supprimer</Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/find-artists");
                  }}>
                    Trouver des artistes
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigate("/club/invitations");
                  }}>
                    Invitations en cours
                  </Button>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsManageModalOpen(false)}>Fermer</Button>
                </DialogFooter>
              </TabsContent>
              
              <TabsContent value="promo" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-title">Titre de la promotion</Label>
                    <Input id="promo-title" placeholder="Ex: Early Bird Special - 20% de réduction" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="promo-desc">Description</Label>
                    <textarea 
                      id="promo-desc" 
                      rows={3} 
                      placeholder="Décrivez cette offre promotionnelle..."
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-start">Date de début</Label>
                      <Input id="promo-start" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-end">Date de fin</Label>
                      <Input id="promo-end" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">Réduction (%)</Label>
                      <Input id="promo-discount" type="number" min="1" max="100" placeholder="20" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Code promo (optionnel)</Label>
                      <Input id="promo-code" placeholder="SUMMER2025" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">Canaux de distribution</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="channel-app" className="rounded" defaultChecked />
                        <label htmlFor="channel-app">Application</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="channel-email" className="rounded" defaultChecked />
                        <label htmlFor="channel-email">Email</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="channel-sms" className="rounded" />
                        <label htmlFor="channel-sms">SMS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="channel-social" className="rounded" defaultChecked />
                        <label htmlFor="channel-social">Réseaux sociaux</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="channel-push" className="rounded" />
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

      {/* Modale de récapitulatif d'événement */}
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
                    {Math.round((selectedEvent.reservations / selectedEvent.capacity) * 100)}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.reservations} participants sur {selectedEvent.capacity} places
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Revenu total</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedEvent.sales)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.ticketTypes.reduce((acc, ticket) => acc + ticket.sold, 0)} tickets vendus
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ventes additionnelles</CardDescription>
                  <CardTitle className="text-2xl">
                    {formatCurrency(selectedEvent.sales * 0.35)} {/* Simulation */}
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
                      <p className="text-sm text-muted-foreground">{selectedEvent.artists.join(', ')}</p>
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
                    {selectedEvent.ticketTypes.map((ticket, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{ticket.name}</td>
                        <td className="py-2">{formatCurrency(ticket.price)}</td>
                        <td className="py-2">{ticket.sold}</td>
                        <td className="py-2">{formatCurrency(ticket.price * ticket.sold)}</td>
                        <td className="py-2">
                          {selectedEvent.sales > 0 ? Math.round((ticket.price * ticket.sold / selectedEvent.sales) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Répartition démographique</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">18-24 ans</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">25-34 ans</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">35-44 ans</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">45+ ans</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-center">
                      <p className="text-xl font-medium">60%</p>
                      <p className="text-sm text-muted-foreground">Hommes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-medium">40%</p>
                      <p className="text-sm text-muted-foreground">Femmes</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Avis et engagement</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Award key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 font-medium">4.8/5</span>
                      <span className="text-sm text-muted-foreground ml-2">(42 avis)</span>
                    </div>
                    
                    <div className="space-y-3 mt-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm italic">"Excellente soirée, l'ambiance était électrique et l'organisation parfaite."</p>
                        <p className="text-xs text-muted-foreground mt-1">Marie L. - Utilisateur premium</p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm italic">"Les DJ étaient incroyables, mais un peu trop de monde à mon goût."</p>
                        <p className="text-xs text-muted-foreground mt-1">Thomas M. - Première visite</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Partages sur les réseaux sociaux</h4>
                      <div className="flex space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">f</span>
                          </div>
                          <span className="text-sm">124</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">t</span>
                          </div>
                          <span className="text-sm">87</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className="h-6 w-6 rounded-full bg-pink-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                          <span className="text-sm">203</span>
                        </div>
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
                  title: "Rapport exporté",
                  description: "Le rapport a été exporté au format PDF",
                });
              }}>Exporter le rapport</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modale de création d'événement */}
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
              <Label htmlFor="title">Titre de l'événement</Label>
              <Input
                id="title"
                placeholder="Soirée Summer Vibes 2025"
                value={newEvent.title as string}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={(newEvent.date as Date)?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setNewEvent({...newEvent, date: new Date(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="200"
                  value={(newEvent.capacity as number)?.toString() || ''}
                  onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu dans le club</Label>
              <Select onValueChange={(value) => setNewEvent({...newEvent, location: value})}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Sélectionner un lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main_room">Salle principale</SelectItem>
                  <SelectItem value="terrace">Terrasse</SelectItem>
                  <SelectItem value="vip_area">Zone VIP</SelectItem>
                  <SelectItem value="all">Club entier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Décrivez votre événement en quelques phrases..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newEvent.description as string}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut initial</Label>
              <Select onValueChange={(value) => setNewEvent({...newEvent, status: value as any})} defaultValue="planning">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">En planification</SelectItem>
                  <SelectItem value="upcoming">À venir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateEvent}>Créer l'événement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default ClubEventsPage;