import React, { useState, useEffect } from "react";
import UserLayout from "../../layouts/user-layout";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Star, MapPin, Calendar, Clock, Instagram, Globe, CheckCircle, XCircle } from "lucide-react";

// Type pour le club
type Club = {
  id: number;
  name: string;
  category: string;
  image: string;
  coverImage: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  description: string;
  featured: boolean;
  hasTableReservation: boolean;
  capacity: number;
  instagram?: string;
  website?: string;
  openingHours: {
    [key: string]: string;
  };
  features: string[];
  upcomingEvents?: {
    id: number;
    name: string;
    date: string;
    image: string;
  }[];
  tableReservationEnabled: boolean;
};

// Fonction pour obtenir le jour de la semaine actuel
function getDayOfWeek(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date().getDay();
  return days[today];
}

// Club data (temporaire - à remplacer par une requête API)
const clubsData: Club[] = [
  {
    id: 1,
    name: "Oxygen Club",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2030&q=80",
    coverImage: "https://images.unsplash.com/photo-1545128485-c400ce7b6892?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Antananarivo",
    address: "15 Rue des Lilas, Antananarivo",
    rating: 4.7,
    reviewCount: 234,
    description: "Le club Oxygen est l'un des meilleurs clubs de la ville avec une ambiance électrique et des DJs de renommée mondiale.",
    featured: true,
    hasTableReservation: true,
    capacity: 500,
    instagram: "@oxygen_club",
    website: "https://oxygen-club.com",
    openingHours: {
      monday: "Fermé",
      tuesday: "Fermé",
      wednesday: "19:00 - 02:00",
      thursday: "19:00 - 03:00",
      friday: "20:00 - 05:00",
      saturday: "20:00 - 05:00",
      sunday: "18:00 - 00:00"
    },
    features: ["DJ international", "VIP", "Fumoir", "Dancefloor", "Bar premium"],
    upcomingEvents: [
      {
        id: 101,
        name: "Neon Night",
        date: "2023-10-15",
        image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: 102,
        name: "Électro Fusion",
        date: "2023-10-22",
        image: "https://images.unsplash.com/photo-1642207533814-99d689774beb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    tableReservationEnabled: true
  },
  {
    id: 2,
    name: "Pulse Lounge",
    category: "Lounge",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    coverImage: "https://images.unsplash.com/photo-1563292958-8a78955889d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Antananarivo",
    address: "47 Avenue des Roses, Antananarivo",
    rating: 4.5,
    reviewCount: 187,
    description: "Pulse Lounge offre un espace élégant et détendu avec d'excellents cocktails et une musique ambient parfaite pour les soirées entre amis.",
    featured: false,
    hasTableReservation: true,
    capacity: 200,
    instagram: "@pulse_lounge",
    website: "https://pulselounge.com",
    openingHours: {
      monday: "17:00 - 00:00",
      tuesday: "17:00 - 00:00",
      wednesday: "17:00 - 01:00",
      thursday: "17:00 - 01:00",
      friday: "17:00 - 03:00",
      saturday: "17:00 - 03:00",
      sunday: "16:00 - 00:00"
    },
    features: ["Cocktails artisanaux", "Terrasse", "Musique live", "Cuisine fusion"],
    upcomingEvents: [
      {
        id: 103,
        name: "Jazz & Cocktails",
        date: "2023-10-18",
        image: "https://images.unsplash.com/photo-1560359614-870d1a7ea91d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
      }
    ],
    tableReservationEnabled: true
  },
  // ... Autres clubs
];

export default function ClubProfilePage() {
  // Récupère l'id du club depuis l'URL (par exemple /user/club-profile?id=1)
  const queryParams = new URLSearchParams(window.location.search);
  const clubId = parseInt(queryParams.get("id") || "1");
  
  // État pour stocker les données du club
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [_, setLocation] = useLocation();
  
  // Récupère les données du club
  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      const foundClub = clubsData.find(c => c.id === clubId);
      setClub(foundClub || null);
      setLoading(false);
    }, 500);
  }, [clubId]);
  
  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }
  
  if (!club) {
    return (
      <UserLayout>
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Club introuvable</h1>
          <p className="mb-6">Le club que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => setLocation("/user/search-clubs")}>
            Retour à la recherche
          </Button>
        </div>
      </UserLayout>
    );
  }
  
  // Formatage des données
  const today = getDayOfWeek();
  const isOpenToday = club.openingHours[today] !== "Fermé";
  
  return (
    <UserLayout>
      <div className="pb-20">
        {/* Hero section avec l'image de couverture */}
        <div 
          className="h-60 sm:h-80 w-full bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${club.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <div className="flex items-center mb-2">
              <Badge variant="secondary" className="mr-2">{club.category}</Badge>
              {club.featured && <Badge variant="destructive">Populaire</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-1">{club.name}</h1>
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-1" />
              <span>{club.location}</span>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="p-4">
          {/* Informations de base */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mt-2">
              <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="fill-yellow-500" />
                  <span className="ml-1 text-black font-medium">{club.rating}</span>
                </div>
                <span className="text-gray-500">({club.reviewCount} avis)</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">Capacité: {club.capacity} personnes</span>
              </div>
              <p className="text-gray-700 mb-4">{club.description}</p>
              <div className="flex flex-wrap gap-2">
                {club.features.map((feature, index) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Onglets d'information */}
          <Tabs defaultValue="infos" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="events">Événements ({club.upcomingEvents?.length || 0})</TabsTrigger>
              <TabsTrigger value="tables">Réservation</TabsTrigger>
            </TabsList>
            
            {/* Onglet Informations */}
            <TabsContent value="infos" className="py-4">
              <div className="space-y-6">
                {/* Adresse */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Adresse</h3>
                  <p className="text-gray-700 flex items-center">
                    <MapPin size={18} className="mr-2 text-gray-500" />
                    {club.address}
                  </p>
                </div>
                
                {/* Horaires d'ouverture */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Horaires d'ouverture</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(club.openingHours).map(([day, hours]) => (
                      <div 
                        key={day} 
                        className={`flex justify-between p-2 rounded-md ${day === today ? 'bg-green-100' : ''}`}
                      >
                        <span className="capitalize">{day}</span>
                        <span className={hours === "Fermé" ? "text-red-500" : "text-green-600 font-medium"}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Réseaux sociaux et site web */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Médias sociaux et contact</h3>
                  <div className="flex flex-wrap gap-4">
                    {club.instagram && (
                      <a href={`https://instagram.com/${club.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary">
                        <Instagram size={18} className="mr-2" />
                        <span>{club.instagram}</span>
                      </a>
                    )}
                    {club.website && (
                      <a href={club.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary">
                        <Globe size={18} className="mr-2" />
                        <span>Site web</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Onglet Événements */}
            <TabsContent value="events" className="py-4">
              {club.upcomingEvents && club.upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {club.upcomingEvents.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                        <div className="flex items-center text-gray-500 mb-2">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <Button className="w-full mt-2">Voir les détails</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucun événement à venir pour ce club.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Onglet Réservation de tables */}
            <TabsContent value="tables" className="py-4">
              {club.tableReservationEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center text-green-600 mb-4">
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-medium">Ce club accepte les réservations de tables</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Réservez une table dans ce club pour profiter pleinement de votre soirée sans attendre. 
                    La réservation de table vous garantit un espace dédié.
                  </p>
                  
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={() => {
                      console.log("Redirection vers la page de réservation de table pour:", club.name);
                      window.location.href = `/user/table-reservation?clubId=${club.id}&clubName=${encodeURIComponent(club.name)}`;
                    }}
                  >
                    Réserver une table
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-red-500 mb-4">
                    <XCircle size={20} className="mr-2" />
                    <span className="font-medium">Ce club ne propose pas de réservation de tables</span>
                  </div>
                  
                  <p className="text-gray-700">
                    Ce club ne propose pas encore de service de réservation de tables. 
                    Nous vous recommandons d'arriver tôt pour assurer votre place.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UserLayout>
  );
}