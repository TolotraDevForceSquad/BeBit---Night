import { Event } from "@shared/schema";
import { Ticket, MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Determine popularity level (1-3)
  const getPopularityIcons = (popularity: number) => {
    const filledCount = Math.min(Math.max(Math.round(popularity), 1), 3);
    
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <i key={i} className={`fas fa-fire ${i < filledCount ? 'text-primary' : 'text-gray-500'}`}></i>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border relative tiktok-card group hover:border-primary transition-all duration-300">
      <img 
        src={event.coverImage} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 relative">
        <div className="absolute -top-10 right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
          <Ticket className="h-5 w-5" />
        </div>
        <h3 className="font-medium text-lg mb-1">{event.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="mr-1 h-4 w-4 text-primary" />
          <span>{event.venueName}, {event.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <Calendar className="mr-1 h-4 w-4 text-secondary" />
          <span>{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}, {event.startTime} - {event.endTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">{event.price}€</span>
          <div className="flex space-x-1">
            <span className="text-sm text-muted-foreground">Popularité</span>
            {getPopularityIcons(event.popularity)}
          </div>
        </div>
      </div>
    </div>
  );
}
