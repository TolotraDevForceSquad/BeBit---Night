import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Event } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share, Calendar, MapPin, Clock, User, Music, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MobileEventCardProps {
  event: Event;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function MobileEventCard({ event, onLike, onDislike }: MobileEventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(eventDate);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Découvre l'événement ${event.title} sur NightConnect`,
        url: `/events/${event.id}`,
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de partager le contenu",
          variant: "destructive",
        });
      });
    } else {
      // Fallback
      toast({
        title: "Partage indisponible",
        description: "Le partage n'est pas supporté sur ce navigateur",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(true);
    onLike && onLike();
    
    toast({
      title: "Événement ajouté aux favoris",
      description: `Vous avez ajouté ${event.title} à vos favoris`,
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right (like)
      controls.start({ x: "100%", opacity: 0 });
      handleLike();
      setTimeout(() => {
        controls.set({ x: 0, opacity: 1 });
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left (dislike)
      controls.start({ x: "-100%", opacity: 0 });
      onDislike && onDislike();
      setTimeout(() => {
        controls.set({ x: 0, opacity: 1 });
      }, 300);
    } else {
      // Return to center
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <div ref={constraintsRef} className="relative h-[calc(100vh-200px)] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="bg-card rounded-xl overflow-hidden h-full shadow-lg border border-border flex flex-col">
          {/* Event Cover Image */}
          <div className="relative flex-grow">
            <AspectRatio ratio={9/16} className="h-full">
              {event.coverImage ? (
                <img 
                  src={event.coverImage} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Music className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </AspectRatio>
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <Link href={`/events/${event.id}`}>
                <a className="block">
                  <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                </a>
              </Link>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{formattedDate}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{event.startTime}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{event.venueName}, {event.location}</span>
                </div>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{event.participantCount}/{event.capacity} participants</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-white">
                  {event.category}
                </span>
                
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  {event.price} €
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="default" size="sm" className="rounded-full">
                  <Ticket className="h-4 w-4 mr-1" />
                  Réserver
                </Button>
                
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full ${isLiked ? 'text-red-500' : 'text-white'}`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className="h-6 w-6" fill={isLiked ? "currentColor" : "none"} />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="rounded-full text-white" onClick={handleShare}>
                    <Share className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Swipe instructions */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground opacity-20 text-lg font-light">
        ← Ignorer
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-muted-foreground opacity-20 text-lg font-light">
        Intéressé →
      </div>
    </div>
  );
}