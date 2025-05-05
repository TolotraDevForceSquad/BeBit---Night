import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Calendar, MapPin, Music, Clock, Users, X, Check } from 'lucide-react';
import { Event } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileEventCardProps {
  event: Event;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function MobileEventCard({ event, onLike, onDislike }: MobileEventCardProps) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(eventDate);

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    
    // Limit vertical movement
    if (Math.abs(deltaY) > Math.abs(deltaX) * 0.8) {
      return;
    }
    
    setPosition({ x: deltaX, y: 0 });
    
    // Determine swipe direction
    if (deltaX > 50) {
      setDirection('right');
    } else if (deltaX < -50) {
      setDirection('left');
    } else {
      setDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (direction === 'right' && onLike) {
      onLike();
    } else if (direction === 'left' && onDislike) {
      onDislike();
    }
    
    // Reset position with animation
    setPosition({ x: 0, y: 0 });
    setDirection(null);
  };

  // Calculate rotation and opacity based on position
  const rotate = position.x * 0.1;
  const opacity = Math.min(1, Math.max(0, Math.abs(position.x) / 100));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="w-full h-[80vh] md:h-[500px] relative overflow-hidden rounded-xl shadow-xl"
        style={{
          transform: `translateX(${position.x}px) rotate(${rotate}deg)`,
          transition: isDragging ? 'none' : 'all 0.5s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-muted/80 overflow-hidden">
          {event.coverImage ? (
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-primary/20 to-card"></div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        
        {/* Swipe indicators */}
        <div 
          className="absolute top-1/3 left-4 bg-destructive rounded-full p-3 transform -translate-y-1/2"
          style={{ opacity: direction === 'left' ? opacity : 0 }}
        >
          <X className="h-6 w-6 text-white" />
        </div>
        
        <div 
          className="absolute top-1/3 right-4 bg-green-500 rounded-full p-3 transform -translate-y-1/2"
          style={{ opacity: direction === 'right' ? opacity : 0 }}
        >
          <Check className="h-6 w-6 text-white" />
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <Link href={`/events/${event.id}`}>
            <a className="block">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h2>
            </a>
          </Link>
          
          <div className="flex items-center space-x-2 text-white/80 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formattedDate}</span>
            <span className="mx-1">•</span>
            <Clock className="h-4 w-4" />
            <span className="text-sm">{event.startTime} - {event.endTime}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-white/80 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{event.venueName}, {event.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground">
              <Music className="h-3 w-3 mr-1" />
              {event.category}
            </span>
            
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
              <Users className="h-3 w-3 mr-1" />
              {event.participantCount}/{event.capacity}
            </span>
            
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {event.price} €
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="secondary" size="sm" className="rounded-full px-4">
              <Heart className="h-4 w-4 mr-1" />
              Intéressé
            </Button>
            
            <Link href={`/events/${event.id}`}>
              <Button variant="default" size="sm" className="rounded-full px-4">
                Détails
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}