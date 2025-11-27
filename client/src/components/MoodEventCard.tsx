import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Heart, X, ArrowLeft, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventMood, getMoodClassName } from '@/lib/mood-utils';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [swiped, setSwiped] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Utiliser des valeurs de motion avancées pour les animations
  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  
  // Calculer les indicateurs visuels en fonction de la position du swipe
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-150, 0], [1, 0]);

  // Optimiser le touch pour appareils mobiles
  useEffect(() => {
    const currentRef = cardRef.current;
    if (!currentRef) return;
    
    // Désactiver l'événement touchmove par défaut pour éviter les problèmes de scroll
    const preventScrolling = (e: TouchEvent) => {
      if (swiped) return;
      e.preventDefault();
    };
    
    currentRef.addEventListener('touchmove', preventScrolling, { passive: false });
    
    return () => {
      currentRef.removeEventListener('touchmove', preventScrolling);
    };
  }, [swiped]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const isSwipeFast = velocity > 800;
    
    // Détermine si le swipe doit être considéré comme complet
    const shouldSwipe = Math.abs(info.offset.x) > threshold || isSwipeFast;
    
    if (shouldSwipe) {
      setSwiped(true);
      
      // Animer la carte en fonction de la direction du swipe
      if (info.offset.x > 0) {
        // Swipe à droite (like)
        controls.start({
          x: 500,
          opacity: 0,
          rotate: 30,
          transition: { duration: 0.3 }
        });
        
        // Déclencher l'action après un court délai (important pour l'animation)
        setTimeout(() => {
          // Déclencher l'action immédiatement
          onLike && onLike();
        }, 100);
      } else {
        // Swipe à gauche (dislike)
        controls.start({
          x: -500,
          opacity: 0,
          rotate: -30,
          transition: { duration: 0.3 }
        });
        
        // Déclencher l'action après un court délai (important pour l'animation)
        setTimeout(() => {
          // Déclencher l'action immédiatement
          onDislike && onDislike();
        }, 100);
      }
    } else {
      // Retour à la position initiale si le swipe n'est pas assez prononcé
      controls.start({
        x: 0,
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
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
  
  // Fonction pour swiper manuellement avec les boutons
  const handleManualLike = () => {
    setSwiped(true);
    controls.start({
      x: 500,
      opacity: 0,
      rotate: 30,
      transition: { duration: 0.3 }
    });
    // Appeler directement la callback après un court délai
    setTimeout(() => {
      onLike && onLike();
    }, 100);
  };
  
  const handleManualDislike = () => {
    setSwiped(true);
    controls.start({
      x: -500,
      opacity: 0,
      rotate: -30,
      transition: { duration: 0.3 }
    });
    // Appeler directement la callback après un court délai
    setTimeout(() => {
      onDislike && onDislike();
    }, 100);
  };

  // Formater la date
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE d MMMM', { locale: fr });
  const formattedTime = format(eventDate, 'HH:mm', { locale: fr });

  // Utiliser l'ambiance pour obtenir le style approprié
  const moodClassName = getMoodClassName(event.mood);

  return (
    <motion.div 
      className={`${moodClassName} rounded-2xl overflow-hidden shadow-lg h-[calc(100vh-160px)] relative ${className} touch-none`}
      ref={innerRef || cardRef}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={controls}
      style={{ 
        x,
        rotate,
        opacity,
        touchAction: "none",
      }}
      whileTap={{ scale: 0.98 }}
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
      
      {/* Indicateurs de like/dislike superposés */}
      <motion.div 
        className="absolute top-10 right-5 rotate-12 border-4 border-green-500 rounded-lg px-5 py-2 z-20"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-green-500 font-bold text-2xl">J'AIME</span>
      </motion.div>
      
      <motion.div 
        className="absolute top-10 left-5 -rotate-12 border-4 border-red-500 rounded-lg px-5 py-2 z-20"
        style={{ opacity: dislikeOpacity }}
      >
        <span className="text-red-500 font-bold text-2xl">PASSER</span>
      </motion.div>
      
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
                onClick={handleManualDislike}
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
                onClick={handleManualLike}
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Instructions de swipe avec animation - Style TikTok */}
      <motion.div 
        className="absolute top-1/2 left-0 right-0 flex justify-between px-8 pointer-events-none text-white/70"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-12 w-12 rounded-full border-2 border-red-500/50 backdrop-blur-sm bg-black/20 flex items-center justify-center mb-2">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <span className="text-xs font-medium">Swipe gauche</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-12 w-12 rounded-full border-2 border-green-500/50 backdrop-blur-sm bg-black/20 flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-green-500" />
          </div>
          <span className="text-xs font-medium">Swipe droite</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}