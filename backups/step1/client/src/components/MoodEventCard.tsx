import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Heart, X, ArrowLeft, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventMood, getMoodClassName } from '@/lib/mood-utils';

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
  mood?: EventMood;
}

interface MoodEventCardProps {
  event: Event;
  onLike?: () => void;
  onDislike?: () => void;
  onBack?: () => void;
  onSuperLike?: () => void;
  showButtons?: boolean;
  showTags?: boolean;
  className?: string;
  innerRef?: React.RefObject<HTMLDivElement>;
}

export default function MoodEventCard({ 
  event, 
  onLike, 
  onDislike, 
  onBack, 
  onSuperLike,
  showButtons = true,
  showTags = true,
  className = "",
  innerRef
}: MoodEventCardProps) {
  const [dragDirection, setDragDirection] = React.useState<'left' | 'right' | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold && onLike) {
      onLike();
    } else if (info.offset.x < -threshold && onDislike) {
      onDislike();
    }
    setDragDirection(null);
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 20) {
      setDragDirection('right');
    } else if (info.offset.x < -20) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  // Formater la date
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE d MMMM', { locale: fr });
  const formattedTime = format(eventDate, 'HH:mm', { locale: fr });

  // Utiliser l'ambiance pour obtenir le style approprié
  const moodClassName = getMoodClassName(event.mood);

  return (
    <motion.div 
      className={`${moodClassName} rounded-2xl overflow-hidden shadow-lg h-[calc(100vh-160px)] relative ${className}`}
      ref={innerRef || cardRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      style={{ 
        x: 0,
        transition: "all 0.3s ease-out"
      }}
      whileDrag={{ scale: 0.98 }}
    >
      {/* Calque de recouvrement avec l'ambiance */}
      <div className="mood-overlay"></div>
      
      {/* Image principale avec un dégradé en bas pour le texte */}
      <div className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${event.coverImage})`,
          backgroundPosition: 'center',
          opacity: 0.7
        }} 
      />
      
      {/* Dégradé du bas pour que le texte soit lisible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent via-black/40" />
      
      {/* Contenu de la carte */}
      <div className="absolute inset-0 flex flex-col p-4 mood-content">
        {/* En-tête avec catégorie et prix */}
        <div className="mt-2 flex justify-between items-start z-10">
          <Badge variant="outline" className="bg-black/50 text-white border-none">
            {event.category}
          </Badge>
          <Badge variant="outline" className="bg-black/50 text-white border-none">
            {event.price === 0 ? 'Gratuit' : `${event.price.toLocaleString()} Ar`}
          </Badge>
        </div>
        
        {/* Espace flexible */}
        <div className="flex-1"></div>
        
        {/* Détails de l'événement en bas */}
        <div className="text-white z-10">
          <h2 className="text-3xl font-bold mb-1">{event.title}</h2>
          <p className="text-white/80 mb-3 line-clamp-2">{event.description}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <CalendarDays className="w-4 h-4 mr-1 opacity-75" />
            <span className="text-sm opacity-90 capitalize">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <Clock className="w-4 h-4 mr-1 opacity-75" />
            <span className="text-sm opacity-90">{formattedTime}</span>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="w-4 h-4 mr-1 opacity-75" />
            <span className="text-sm opacity-90">
              {event.venueName} {event.city && `· ${event.city}`}
            </span>
          </div>
          
          {/* Boutons d'action */}
          {showButtons && (
            <div className="flex justify-between mt-4 pb-2">
              {onBack && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-black/30 border-white/20 text-white" 
                  onClick={onBack}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-black/30 border-white/20 text-white hover:bg-red-500/80" 
                onClick={onDislike}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {onSuperLike && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-black/30 border-white/20 text-white hover:bg-blue-500/80" 
                  onClick={onSuperLike}
                >
                  <Sparkles className="h-6 w-6" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-black/30 border-white/20 text-white hover:bg-green-500/80" 
                onClick={onLike}
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Indicateurs de direction du swipe */}
      {dragDirection === 'right' && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-green-500/80 text-white font-bold text-2xl p-4 rounded-full z-20">
          <Heart className="h-8 w-8" />
        </div>
      )}
      
      {dragDirection === 'left' && (
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-red-500/80 text-white font-bold text-2xl p-4 rounded-full z-20">
          <X className="h-8 w-8" />
        </div>
      )}
    </motion.div>
  );
}