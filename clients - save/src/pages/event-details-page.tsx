import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  Calendar, Clock, MapPin, Users, Music, Heart, Share, 
  Ticket, ChevronLeft, Info, Star, MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMobile } from "@/hooks/use-mobile";

// Type d'événement avec plus de détails
type DetailedEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  coverImage: string;
  category: string;
  venueName: string;
  address: string;
  price: number;
  maxCapacity: number;
  ticketsSold: number;
  isLiked?: boolean;
  artists: {
    id: number;
    name: string;
    image?: string;
    genre: string;
    rating: number;
  }[];
  organizer: {
    id: number;
    name: string;
    image?: string;
  };
  reviews: {
    id: number;
    username: string;
    rating: number;
    comment: string;
    userImage?: string;
    date: string;
  }[];
};

// Exemple de données
const mockEvent: DetailedEvent = {
  id: 1,
  title: "Soirée Techno avec DJ Elektra",
  description: "Une soirée techno inoubliable avec DJ Elektra. Venez vibrer sur les meilleurs sons électro de la scène parisienne. Un voyage sonore à ne pas manquer ! \n\nLes lumières, la musique et l'ambiance seront au rendez-vous pour une expérience unique. Cet événement est à guichet fermé, réservez vos places dès maintenant.",
  date: "2023-12-15",
  startTime: "22:00",
  endTime: "05:00",
  coverImage: "https://images.unsplash.com/photo-1571266028277-641cb7a18510?w=1200&h=600&fit=crop",
  category: "Techno",
  venueName: "Club Oxygen",
  address: "15 rue de la Nuit, 75001 Paris",
  price: 25,
  maxCapacity: 200,
  ticketsSold: 142,
  isLiked: false,
  artists: [
    {
      id: 1,
      name: "DJ Elektra",
      image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=120&h=120&fit=crop",
      genre: "Techno",
      rating: 4.8
    },
    {
      id: 2,
      name: "MC Blaze",
      image: "https://images.unsplash.com/photo-1525517450344-d08c6a528e3c?w=120&h=120&fit=crop",
      genre: "House",
      rating: 4.6
    }
  ],
  organizer: {
    id: 1,
    name: "Club Oxygen",
    image: "https://images.unsplash.com/photo-1572023459154-81ce732278ec?w=120&h=120&fit=crop"
  },
  reviews: [
    {
      id: 1,
      username: "partygoer88",
      rating: 5,
      comment: "Ambiance incroyable, musique au top !",
      userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
      date: "2023-10-15T14:30:00"
    },
    {
      id: 2,
      username: "nightlife_lover",
      rating: 4,
      comment: "Très bonne soirée, mais un peu trop de monde.",
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
      date: "2023-10-14T09:15:00"
    },
    {
      id: 3,
      username: "musicfan22",
      rating: 5,
      comment: "DJ Elektra était incroyable, j'ai adoré !",
      date: "2023-10-13T23:45:00"
    }
  ]
};

export default function EventDetailsPage() {
  const [, setLocation] = useLocation();
  const [event, setEvent] = useState<DetailedEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState("infos");
  
  const isMobile = useMobile();
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvent(mockEvent);
      setLiked(mockEvent.isLiked || false);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const handleLike = () => {
    setLiked(!liked);
    // Ici on pourrait appeler une API pour sauvegarder l'état
  };
  
  const handleShare = () => {
    // Logique de partage
    alert("Fonctionnalité de partage à implémenter");
  };
  
  const handleBuyTickets = () => {
    // Logique d'achat de billets
    alert(`Achat de ${ticketCount} billet(s) pour ${event.title}`);
  };
  
  const formattedDate = format(new Date(event.date), "EEEE d MMMM yyyy", { locale: fr });
  const fillPercentage = Math.round((event.ticketsSold / event.maxCapacity) * 100);
  
  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header avec image de couverture */}
      <div className="relative h-64 md:h-80 w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-black/30 text-white hover:bg-black/50"
          onClick={() => setLocation("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.coverImage})` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="mb-2">{event.category}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Actions rapides */}
        <div className="flex justify-between items-center -mt-6 mb-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full bg-background ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background"
              onClick={handleShare}
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
          
          <Button className="rounded-full" size={isMobile ? "sm" : "default"}>
            <Ticket className="h-4 w-4 mr-2" />
            Acheter des billets
          </Button>
        </div>
        
        {/* Informations principales */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Colonne principale */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="infos">Infos</TabsTrigger>
                <TabsTrigger value="artists">Artistes</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({event.reviews.length})</TabsTrigger>
              </TabsList>
              
              {/* Tab Infos */}
              <TabsContent value="infos" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">À propos de cet événement</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Organisateur</h2>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={event.organizer.image} alt={event.organizer.name} />
                      <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{event.organizer.name}</div>
                      <Button variant="ghost" size="sm" className="px-0 text-primary">
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab Artistes */}
              <TabsContent value="artists" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Line-up</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.artists.map(artist => (
                      <div key={artist.id} className="border rounded-lg p-4 flex items-start">
                        <Avatar className="h-14 w-14 mr-3">
                          <AvatarImage src={artist.image} alt={artist.name} />
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-sm text-muted-foreground mb-1">{artist.genre}</div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="text-sm">{artist.rating}/5</span>
                          </div>
                          <Button variant="ghost" size="sm" className="px-0 text-primary">
                            Voir le profil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab Avis */}
              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Avis des participants</h2>
                    <Button className="gap-1.5" size="sm">
                      <MessageCircle className="h-4 w-4" />
                      Ajouter un avis
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {event.reviews.map(review => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={review.userImage} />
                              <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(review.date), "d MMM yyyy", { locale: fr })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded">
                            <Star className="h-3.5 w-3.5 fill-current mr-1" />
                            <span className="text-sm font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Colonne latérale avec infos pratiques */}
          <div className="md:w-64 space-y-6">
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Date</div>
                  <div className="text-sm text-muted-foreground capitalize">{formattedDate}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Horaires</div>
                  <div className="text-sm text-muted-foreground">{event.startTime} - {event.endTime}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{event.venueName}</div>
                  <div className="text-sm text-muted-foreground">{event.address}</div>
                  <Button variant="link" className="p-0 h-auto text-xs">Voir sur la carte</Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Participants</div>
                  <div className="text-sm text-muted-foreground">
                    {event.ticketsSold} / {event.maxCapacity} places
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-1.5">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Prix</div>
                  <div className="text-sm text-muted-foreground">{event.price}€ par personne</div>
                </div>
              </div>
            </div>
            
            {/* Achat de billets */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Réserver vos places</h3>
              
              <div className="flex items-center justify-between">
                <span>Nombre de billets</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{ticketCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                    disabled={ticketCount >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{(event.price * ticketCount).toFixed(2)}€</span>
              </div>
              
              <Button className="w-full" onClick={handleBuyTickets}>
                Acheter maintenant
              </Button>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                <span>Paiement sécurisé via notre plateforme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}