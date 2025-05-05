import { Link } from 'wouter';
import { Heart, Calendar, MapPin, Music, Clock, Users } from 'lucide-react';
import { Event } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(eventDate);

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <Link href={`/events/${event.id}`}>
        <a className="block">
          <AspectRatio ratio={16/9} className="bg-muted">
            {event.coverImage ? (
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
                <Music className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </AspectRatio>
        </a>
      </Link>
      
      <div className="p-4">
        <Link href={`/events/${event.id}`}>
          <a className="block">
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
          </a>
        </Link>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>{formattedDate}</span>
            <span className="mx-1">•</span>
            <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>{event.startTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.venueName}, {event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>{event.participantCount}/{event.capacity} participants</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {event.category}
          </span>
          
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
            {event.price} €
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="rounded-full">
            En savoir plus
          </Button>
          
          <Button variant="ghost" size="sm" className="rounded-full">
            <Heart className="h-4 w-4 mr-1" />
            Intéressé
          </Button>
        </div>
      </div>
    </div>
  );
}