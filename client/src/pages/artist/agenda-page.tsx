import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { getArtistByUserId, updateArtist } from "@/services/servapi";
import { getAllEventArtists } from "@/services/servapi";
import { getEventById } from "@/services/servapi";

// Types
type AuthUser = {
  id: number;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

type Artist = {
  id: number;
  userId: number;
  displayName: string;
  genres: string[];
  bio: string;
  rate: string;
  tags: string[];
  popularity: number;
  socialMedia: Record<string, string>;
  contact: Record<string, string>;
  location: string;
  rating: string;
  bookings: number;
  availability: boolean;
  unavailableDates: string[];
};

type EventArtist = {
  eventId: number;
  artistId: number;
  fee: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  venueName: string;
  status: string;
};

export default function ArtistAvailabilityPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [eventArtists, setEventArtists] = useState<EventArtist[]>([]);
  const [artistEvents, setArtistEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Récupérer l'utilisateur depuis localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
        loadArtistData(userData.id);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos informations.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Non connecté",
        description: "Veuillez vous connecter pour accéder à cette page.",
        variant: "destructive",
      });
    }
  }, []);

  // Charger les données de l'artiste
  const loadArtistData = async (userId: number) => {
    try {
      setIsLoading(true);
      
      // Charger l'artiste
      const artistData = await getArtistByUserId(userId);
      setArtist(artistData);
      
      // Charger les événements de l'artiste
      const eventArtistData = await getAllEventArtists(undefined, artistData.id);
      setEventArtists(eventArtistData);
      
      // Charger les détails des événements
      const eventPromises = eventArtistData.map(ea => getEventById(ea.eventId));
      const eventsData = await Promise.all(eventPromises);
      setArtistEvents(eventsData);
      
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données d'artiste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si une date est indisponible
  const isDateUnavailable = (date: Date): boolean => {
    if (!artist) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return artist.unavailableDates.includes(dateStr);
  };

  // Vérifier si une date a un événement
  const getEventOnDate = (date: Date): Event | undefined => {
    return artistEvents.find(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };

  // Ajouter/retirer une date d'indisponibilité
  const toggleUnavailableDate = async () => {
    if (!selectedDate || !artist) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date.",
        variant: "destructive",
      });
      return;
    }

    const selectedEvent = getEventOnDate(selectedDate);
    if (selectedEvent) {
      toast({
        title: "Date occupée",
        description: `Vous avez déjà un événement (${selectedEvent.title}) à cette date.`,
        variant: "destructive",
      });
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const isCurrentlyUnavailable = isDateUnavailable(selectedDate);
    
    try {
      setIsUpdating(true);
      
      let newUnavailableDates: string[];
      if (isCurrentlyUnavailable) {
        // Retirer la date
        newUnavailableDates = artist.unavailableDates.filter(d => d !== dateStr);
      } else {
        // Ajouter la date
        newUnavailableDates = [...artist.unavailableDates, dateStr];
      }
      
      // Mettre à jour l'artiste
      const updatedArtist = await updateArtist(artist.id, {
        unavailableDates: newUnavailableDates
      });
      
      setArtist(updatedArtist);
      
      toast({
        title: isCurrentlyUnavailable ? "Date libérée" : "Date marquée indisponible",
        description: isCurrentlyUnavailable 
          ? "La date est maintenant disponible pour de nouveaux événements."
          : "La date a été marquée comme indisponible.",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la date.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Formater une date pour l'affichage
  const formatDateDisplay = (date: Date): string => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  // Contenu d'en-tête
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Disponibilités</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Agenda</span>
        </Badge>
        
        {user && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  // Composant Calendrier simplifié
  const AvailabilityCalendar = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);
    
    // Générer les jours du mois
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days: Date[] = [];
      
      for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
      }
      
      return { firstDay, lastDay, days };
    };
    
    const { days } = getDaysInMonth(currentMonth);
    
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Calendrier des disponibilités</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                Suivant
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Sélectionnez une date pour gérer sa disponibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            
            {days.map(day => {
              const isToday = isSameDay(day, today);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isUnavailable = isDateUnavailable(day);
              const eventOnDay = getEventOnDate(day);
              const isPast = day < today && !isSameDay(day, today);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  className={`h-10 p-0 relative ${
                    isSelected 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : isToday 
                      ? "bg-muted" 
                      : ""
                  } ${isPast ? "opacity-50" : ""}`}
                  onClick={() => !isPast && setSelectedDate(day)}
                  disabled={isPast}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className={isPast ? "text-muted-foreground" : ""}>
                      {format(day, "d")}
                    </span>
                    
                    {eventOnDay && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500" />
                    )}
                    
                    {isUnavailable && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Événement programmé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Indisponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border border-muted-foreground" />
              <span>Aujourd'hui</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Section de gestion de la date sélectionnée
  const DateManagementSection = () => {
    if (!selectedDate) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Sélectionnez une date dans le calendrier pour la gérer</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    const isUnavailable = isDateUnavailable(selectedDate);
    const eventOnDate = getEventOnDate(selectedDate);
    const isPast = selectedDate < new Date() && !isSameDay(selectedDate, new Date());
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestion de la date
          </CardTitle>
          <CardDescription>
            {formatDateDisplay(selectedDate)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPast ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Cette date est passée. Vous ne pouvez pas modifier sa disponibilité.
              </AlertDescription>
            </Alert>
          ) : eventOnDate ? (
            <div className="space-y-3">
              <Alert className="bg-green-500/10 border-green-500/25">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Vous avez un événement programmé à cette date.
                </AlertDescription>
              </Alert>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-1">{eventOnDate.title}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(parseISO(eventOnDate.date), "EEEE d MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕒</span>
                      <span>{eventOnDate.startTime} - {eventOnDate.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{eventOnDate.venueName}, {eventOnDate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={eventOnDate.status === "upcoming" ? "default" : "secondary"}>
                        {eventOnDate.status === "upcoming" ? "À venir" : 
                         eventOnDate.status === "planning" ? "En planification" : 
                         eventOnDate.status === "past" ? "Passé" : "Annulé"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isUnavailable ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">
                    {isUnavailable ? "Indisponible" : "Disponible"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isUnavailable 
                      ? "Vous ne pouvez pas être réservé à cette date"
                      : "Cette date est disponible pour de nouveaux événements"}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <Button
                onClick={toggleUnavailableDate}
                disabled={isUpdating || isPast}
                variant={isUnavailable ? "default" : "destructive"}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : isUnavailable ? (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Libérer cette date
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Marquer comme indisponible
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                {isUnavailable
                  ? "En libérant cette date, vous pourrez être réservé pour des événements."
                  : "En marquant cette date comme indisponible, vous ne pourrez pas être réservé."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Liste des dates indisponibles
  const UnavailableDatesList = () => {
    if (!artist || artist.unavailableDates.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Vous n'avez aucune date marquée comme indisponible</p>
              <p className="text-sm mt-1">
                Sélectionnez des dates dans le calendrier pour les marquer comme indisponibles
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    const sortedDates = [...artist.unavailableDates]
      .sort()
      .map(dateStr => parseISO(dateStr));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Dates indisponibles
          </CardTitle>
          <CardDescription>
            {artist.unavailableDates.length} date(s) marquée(s) comme indisponible(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {sortedDates.map((date, index) => {
                const eventOnDate = getEventOnDate(date);
                const isPast = date < new Date() && !isSameDay(date, new Date());
                
                return (
                  <div 
                    key={date.toISOString()} 
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">
                        {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                      </div>
                      {eventOnDate && (
                        <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500 border-green-500/25">
                          Événement programmé
                        </Badge>
                      )}
                      {isPast && (
                        <Badge variant="outline" className="mt-1">
                          Passée
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDate(date);
                        // Scroll to calendar
                        document.querySelector('[data-tabs="calendar"]')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Gérer
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  // Liste des événements de l'artiste
  const ArtistEventsList = () => {
    if (artistEvents.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Vous n'avez aucun événement programmé</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    const sortedEvents = [...artistEvents]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter(event => event.status !== "cancelled");
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Événements programmés
          </CardTitle>
          <CardDescription>
            {sortedEvents.length} événement(s) à venir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {sortedEvents.map(event => {
                const eventDate = parseISO(event.date);
                const fee = eventArtists.find(ea => ea.eventId === event.id)?.fee || "0";
                
                return (
                  <Card key={event.id} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1 mt-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{format(eventDate, "EEEE d MMMM yyyy", { locale: fr })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>🕒</span>
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{event.venueName}, {event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>💰</span>
                              <span>{parseFloat(fee).toLocaleString()} Ar</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          event.status === "upcoming" ? "default" : 
                          event.status === "planning" ? "secondary" : "outline"
                        }>
                          {event.status === "upcoming" ? "À venir" : 
                           event.status === "planning" ? "En planification" : 
                           event.status === "past" ? "Passé" : "Annulé"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  return (
    <ResponsiveLayout
      activeItem="agenda"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !artist ? (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vous n'êtes pas enregistré en tant qu'artiste. 
                Veuillez compléter votre profil d'artiste pour accéder à cette fonctionnalité.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* En-tête artiste */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{artist.displayName}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className={
                      artist.availability 
                        ? "bg-green-500/10 text-green-500 border-green-500/25" 
                        : "bg-red-500/10 text-red-500 border-red-500/25"
                    }>
                      {artist.availability ? "Disponible" : "Non disponible"}
                    </Badge>
                    <Badge variant="outline">
                      {artist.bookings} réservation(s)
                    </Badge>
                    <Badge variant="outline">
                      {artist.unavailableDates.length} date(s) indisponible(s)
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Taux journalier</p>
                  <p className="text-xl font-semibold">{parseFloat(artist.rate).toLocaleString()} Ar</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Onglets */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar" data-tabs="calendar">
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="unavailable">
                Dates indisponibles
              </TabsTrigger>
              <TabsTrigger value="events">
                Mes événements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AvailabilityCalendar />
                </div>
                <div>
                  <DateManagementSection />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UnavailableDatesList />
                <ArtistEventsList />
              </div>
            </TabsContent>
            
            <TabsContent value="unavailable">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <UnavailableDatesList />
                </div>
                <div className="space-y-6">
                  <DateManagementSection />
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-2">📝 Note</h4>
                      <p className="text-sm text-muted-foreground">
                        Les dates marquées comme indisponibles ne seront pas proposées 
                        aux organisateurs d'événements pour vos réservations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ArtistEventsList />
                </div>
                <div className="space-y-6">
                  <DateManagementSection />
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-2">ℹ️ Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Les dates avec des événements programmés sont automatiquement 
                        marquées comme indisponibles pour d'autres réservations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ResponsiveLayout>
  );
}