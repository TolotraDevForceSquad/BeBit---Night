import { useState } from "react";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  eachDayOfInterval,
  getDay,
  parse,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

// Type d'événement
export type CalendarEvent = {
  id: number;
  title: string;
  date: string; // ISO string
  location: string;
  fee: number;
  status: "pending" | "confirmed" | "cancelled";
};

interface ArtistCalendarProps {
  events: CalendarEvent[];
}

export default function ArtistCalendar({ events }: ArtistCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Navigation dans le calendrier
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Format d'affichage des jours de la semaine
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  // Calcul des dates du mois courant
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  // Générer tous les jours à afficher (y compris ceux des mois adjacents)
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  
  // Convertir les événements en objets Date pour faciliter les comparaisons
  const eventDates = events.map(event => ({
    ...event,
    dateObj: parseISO(event.date),
  }));
  
  // Vérifier si un jour a des événements
  const hasEvent = (day: Date) => {
    return eventDates.some(event => isSameDay(event.dateObj, day));
  };
  
  // Récupérer les événements pour un jour spécifique
  const getEventsForDay = (day: Date) => {
    return eventDates.filter(event => isSameDay(event.dateObj, day));
  };
  
  // Événements du jour sélectionné
  const selectedDayEvents = getEventsForDay(selectedDate);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" /> 
            Agenda des Événements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contrôles du calendrier */}
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold text-lg">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h2>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Calendrier */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {/* Jours de la semaine */}
            {days.map((day, i) => (
              <div key={i} className="text-center font-medium text-xs py-2">
                {day}
              </div>
            ))}
            
            {/* Jours du mois */}
            {dateRange.map((date, i) => {
              const dayEvents = getEventsForDay(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <Button
                  key={i}
                  variant="ghost"
                  className={`h-12 rounded-md relative ${
                    !isCurrentMonth ? "text-muted-foreground opacity-30" : ""
                  } ${isToday(date) ? "bg-primary/10" : ""} ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm">
                      {format(date, "d")}
                    </span>
                    
                    {/* Indicateur d'événement */}
                    {dayEvents.length > 0 && (
                      <div className="flex mt-1 gap-0.5">
                        {dayEvents.length > 3 ? (
                          <span className="h-1 w-1 rounded-full bg-primary" />
                        ) : (
                          dayEvents.map((_, idx) => (
                            <span 
                              key={idx} 
                              className={`h-1 w-1 rounded-full ${
                                dayEvents[idx].status === "confirmed" ? "bg-green-500" :
                                dayEvents[idx].status === "cancelled" ? "bg-red-500" :
                                "bg-yellow-500"
                              }`} 
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {/* Liste des événements du jour sélectionné */}
          <div>
            <h3 className="font-medium mb-2">
              {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </h3>
            
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="h-5 w-5 mx-auto mb-1" />
                <p>Aucun événement prévu pour cette date</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-center border p-3 rounded-md">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {format(event.dateObj, "HH'h'mm", { locale: fr })} • {event.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={
                        event.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/25" :
                        event.status === "cancelled" ? "bg-red-500/10 text-red-500 border-red-500/25" :
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                      }>
                        {event.status === "confirmed" ? "Confirmé" :
                         event.status === "cancelled" ? "Annulé" : "En attente"}
                      </Badge>
                      <span className="text-sm font-medium mt-1">{event.fee} Ar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}