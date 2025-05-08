import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, Calendar, MapPin, ArrowRight, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getDistanceFromLatLonInKm, formatDistance } from "@/lib/geo-utils";
import { useLocation } from "wouter";

// Type d'événement pour l'affichage
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  category: string;
  venueName: string;
  price: number;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
  isLiked?: boolean;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [, setLocation] = useLocation();
  // Récupérer la géolocalisation de l'utilisateur
  const { latitude, longitude } = useGeolocation();
  
  // Formatage de la date
  const formattedDate = format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr });
  
  // Calculer la distance entre l'utilisateur et l'événement si les coordonnées sont disponibles
  const distance = (latitude && longitude && event.latitude && event.longitude) 
    ? getDistanceFromLatLonInKm(latitude, longitude, event.latitude, event.longitude)
    : null;
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggler l'état "aimé" de l'événement
    // Dans une application réelle, cela serait une mutation API
    console.log(`Like event ${event.id}`);
    
    // Simuler un changement d'état visuel
    const eventCard = e.currentTarget.closest('.card');
    if (eventCard) {
      const heartIcon = e.currentTarget.querySelector('svg');
      if (heartIcon) {
        if (event.isLiked) {
          heartIcon.classList.remove('fill-current');
          e.currentTarget.classList.remove('text-red-500', 'bg-white/80');
          e.currentTarget.classList.add('text-white', 'bg-black/30', 'hover:bg-black/50');
          event.isLiked = false;
        } else {
          heartIcon.classList.add('fill-current');
          e.currentTarget.classList.remove('text-white', 'bg-black/30', 'hover:bg-black/50');
          e.currentTarget.classList.add('text-red-500', 'bg-white/80');
          event.isLiked = true;
        }
      }
    }
  };
  
  const handleViewDetails = () => {
    setLocation(`/event/${event.id}`);
  };

  return (
    <Card className="card overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        {/* Badge "En vedette" pour les événements mis en avant */}
        {event.isFeatured && (
          <Badge className="absolute top-2 left-2 z-10 bg-primary text-white">
            En vedette
          </Badge>
        )}
        
        {/* Image de couverture */}
        <div 
          className="h-48 w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${event.coverImage})` }}
        >
          {/* Overlay pour une meilleure lisibilité du titre */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        </div>
        
        {/* Bouton like */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 rounded-full p-0 h-8 w-8 ${
            event.isLiked ? "text-red-500 bg-white/80" : "text-white bg-black/30 hover:bg-black/50"
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${event.isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
          <Badge variant="outline" className="ml-2">
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.venueName}</span>
            {distance && (
              <Badge variant="secondary" className="ml-2 text-xs font-normal">
                {formatDistance(distance)}
              </Badge>
            )}
          </div>
          
          {event.city && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="h-4 w-4 mr-2" />
              <span>{event.city}, {event.country}</span>
            </div>
          )}
          
          <p className="text-sm line-clamp-2 mt-2">
            {event.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="font-semibold">
          {event.price > 0 ? `${event.price} €` : 'Gratuit'}
        </div>
        
        <Button 
          size="sm" 
          variant="default" 
          className="gap-1"
          onClick={handleViewDetails}
        >
          <span>Détails</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}