import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Heart, Calendar, MapPin, Ticket, Info, Building, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface MobileEventCardProps {
  event: Event;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function MobileEventCard({ event, onLike, onDislike }: MobileEventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const controls = useAnimation();
  const [, setLocation] = useLocation();
  
  // Récupérer la géolocalisation de l'utilisateur
  const { latitude, longitude } = useGeolocation();
  
  // Formatage de la date
  const formattedDate = format(new Date(event.date), "EEEE d MMMM, HH'h'mm", { locale: fr });
  
  // Calculer la distance entre l'utilisateur et l'événement si les coordonnées sont disponibles
  const distance = (latitude && longitude && event.latitude && event.longitude) 
    ? getDistanceFromLatLonInKm(latitude, longitude, event.latitude, event.longitude)
    : null;
  
  // Gestionnaire de glissement (swipe)
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // Seuil de distance pour considérer un swipe
    
    if (info.offset.x > threshold) {
      // Swipe à droite (like)
      controls.start({ x: "100%", opacity: 0 });
      onLike && onLike();
      
      // Réinitialiser la position après animation
      setTimeout(() => {
        controls.set({ x: 0, opacity: 1 });
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swipe à gauche (dislike)
      controls.start({ x: "-100%", opacity: 0 });
      onDislike && onDislike();
      
      // Réinitialiser la position après animation
      setTimeout(() => {
        controls.set({ x: 0, opacity: 1 });
      }, 300);
    } else {
      // Pas assez swipé, retour à la position initiale
      controls.start({ x: 0, opacity: 1 });
    }
  };
  
  // Action de like
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggler l'état "aimé" de l'événement
    console.log(`Like event ${event.id}`);
    
    // Animation visuelle
    if (event.isLiked) {
      event.isLiked = false;
      // Animation subtile pour feedback visuel
      controls.start({ scale: 0.95 }).then(() => {
        controls.start({ scale: 1 });
      });
    } else {
      event.isLiked = true;
      // Animation pour un like
      controls.start({ x: "20%", opacity: 0.8 }).then(() => {
        setTimeout(() => {
          controls.set({ x: 0, opacity: 1 });
        }, 300);
      });
      
      // Appeler le callback si fourni
      onLike && onLike();
    }
  };
  
  // Navigation vers la page de détails de l'événement
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/event/${event.id}`);
  };
  
  // Navigation vers la page d'achat de tickets
  const handleBuyTickets = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/event/${event.id}?buy=true`);
  };

  return (
    <motion.div
      className="relative h-[calc(100vh-120px)] w-full rounded-lg overflow-hidden shadow-xl"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: 0, opacity: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image de couverture en arrière-plan */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.coverImage})` }}
      />
      
      {/* Overlay pour une meilleure lisibilité du contenu - Style TikTok */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
      
      {/* Badge catégorie - Style TikTok/Tinder */}
      <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none font-medium">
        {event.category}
      </Badge>
      
      {/* Contenu de la carte */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-white/80">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-white/80">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.venueName}</span>
            {distance && (
              <Badge variant="secondary" className="ml-2 text-xs font-normal bg-white/20 text-white border-none">
                {formatDistance(distance)}
              </Badge>
            )}
          </div>
          
          {event.city && (
            <div className="flex items-center text-white/80">
              <Building className="h-4 w-4 mr-2" />
              <span className="text-sm">{event.city}{event.country ? `, ${event.country}` : ''}</span>
            </div>
          )}
        </div>
        
        {/* Description (expandable) */}
        <div 
          className={`overflow-hidden transition-all duration-300 mb-4 ${
            expanded ? "max-h-40" : "max-h-12"
          }`}
        >
          <p className="text-white/70 text-sm">{event.description}</p>
        </div>
        
        <Button 
          variant="ghost"
          size="sm"
          className="text-white/70 p-0 h-auto mb-4"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </Button>
        
        {/* Actions en bas */}
        <div className="flex justify-between items-center">
          <div className="text-white font-semibold">
            {event.price > 0 ? `${event.price} €` : 'Gratuit'}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full h-10 w-10 p-0 border-white/30 text-white"
              onClick={handleViewDetails}
            >
              <Info className="h-5 w-5" />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full h-10 w-10 p-0 border-white/30 text-white"
              onClick={handleBuyTickets}
            >
              <Ticket className="h-5 w-5" />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className={`rounded-full h-10 w-10 p-0 ${
                event.isLiked ? "bg-red-500/20 border-red-500 text-red-500" : "border-white/30 text-white"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${event.isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Instructions de swipe avec animation - Style TikTok */}
      <motion.div 
        className="absolute top-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none text-white/50"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <motion.div 
            className="h-12 w-12 rounded-full border border-pink-500/50 backdrop-blur-sm bg-black/20 flex items-center justify-center mb-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="h-6 w-6 text-pink-500" />
          </motion.div>
          <span className="text-xs font-medium">J'aime</span>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            className="h-12 w-12 rounded-full border border-blue-500/50 backdrop-blur-sm bg-black/20 flex items-center justify-center mb-2"
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <X className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className="text-xs font-medium">Passer</span>
        </div>
      </motion.div>
    </motion.div>
  );
}