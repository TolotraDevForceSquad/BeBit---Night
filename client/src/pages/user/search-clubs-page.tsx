import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Music,
  MapPin,
  Clock,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Définition du type Club
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

// Composant ClubCard
function ClubCard({ club }: { club: Club }) {
  const currentDay = getDayOfWeek();
  const openingTime = club.openingHours[currentDay] || "Fermé aujourd'hui";
  
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src={club.coverImage} 
          alt={club.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <h3 className="font-bold text-white">{club.name}</h3>
          <div className="flex items-center text-xs text-white/80 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{club.location}</span>
          </div>
        </div>
        {club.tableReservationEnabled && (
          <Badge className="absolute top-3 right-3 z-20 bg-primary">
            Réservation de table
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-grow py-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="px-2 py-0">
            {club.category}
          </Badge>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-yellow-500 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">
              {club.rating.toFixed(1)} ({club.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mt-3">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{openingTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Capacité: {club.capacity} personnes</span>
          </div>
          {club.upcomingEvents && club.upcomingEvents.length > 0 && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{club.upcomingEvents.length} événement{club.upcomingEvents.length > 1 ? 's' : ''} à venir</span>
            </div>
          )}
        </div>
        
        {club.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {club.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-0 text-xs">
                {feature}
              </Badge>
            ))}
            {club.features.length > 3 && (
              <Badge variant="outline" className="px-2 py-0 text-xs">
                +{club.features.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => {
            console.log("Redirection vers le profil du club:", club.name);
            window.location.href = `/user/club-profile?id=${club.id}`;
          }}
        >
          Voir le profil
        </Button>
      </CardFooter>
    </Card>
  );
}

// Fonction utilitaire pour obtenir le jour de la semaine actuel
function getDayOfWeek(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date().getDay();
  return days[today];
}

// Données simulées pour les clubs
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
  {
    id: 3,
    name: "Bass Drop",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1571935441005-02501f89285a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    coverImage: "https://images.unsplash.com/photo-1513554612610-9d8454b61b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Antsirabe",
    address: "23 Rue des Artistes, Antsirabe",
    rating: 4.3,
    reviewCount: 156,
    description: "Bass Drop est le paradis des amateurs de musique électronique avec l'un des meilleurs systèmes de son du pays.",
    featured: true,
    hasTableReservation: false,
    capacity: 350,
    instagram: "@bassdrop",
    website: "https://bassdrop.com",
    openingHours: {
      monday: "Fermé",
      tuesday: "Fermé",
      wednesday: "Fermé",
      thursday: "21:00 - 04:00",
      friday: "21:00 - 06:00",
      saturday: "21:00 - 06:00",
      sunday: "19:00 - 02:00"
    },
    features: ["Sound system premium", "Guest DJs", "Soirées à thème", "Événements EDM"],
    upcomingEvents: [
      {
        id: 104,
        name: "Dubstep Night",
        date: "2023-10-20",
        image: "https://images.unsplash.com/photo-1576525772176-5f5243de7e7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: 105,
        name: "Techno Masters",
        date: "2023-10-27",
        image: "https://images.unsplash.com/photo-1556749031-71e62933bd8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    tableReservationEnabled: false
  },
  {
    id: 4,
    name: "Skyview Rooftop",
    category: "Lounge",
    image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Antananarivo",
    address: "85 Avenue Panorama, Antananarivo",
    rating: 4.8,
    reviewCount: 215,
    description: "Skyview Rooftop offre une vue imprenable sur la ville avec des cocktails raffinés et une ambiance détendue.",
    featured: true,
    hasTableReservation: true,
    capacity: 150,
    instagram: "@skyview_rooftop",
    website: "https://skyviewrooftop.com",
    openingHours: {
      monday: "17:00 - 23:00",
      tuesday: "17:00 - 23:00",
      wednesday: "17:00 - 00:00",
      thursday: "17:00 - 00:00",
      friday: "17:00 - 02:00",
      saturday: "17:00 - 02:00",
      sunday: "16:00 - 22:00"
    },
    features: ["Vue panoramique", "Cocktails signature", "Apéritifs", "Chef invité"],
    upcomingEvents: [
      {
        id: 106,
        name: "Sunset Sessions",
        date: "2023-10-19",
        image: "https://images.unsplash.com/photo-1587116987928-227a0c8a1c0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
      }
    ],
    tableReservationEnabled: true
  },
  {
    id: 5,
    name: "Vinyl House",
    category: "Music Bar",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    coverImage: "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    location: "Tamatave",
    address: "12 Rue du Vinyle, Tamatave",
    rating: 4.6,
    reviewCount: 178,
    description: "Vinyl House est un bar à musique unique où vous pouvez écouter des vinyles classiques tout en sirotant d'excellents cocktails.",
    featured: false,
    hasTableReservation: true,
    capacity: 80,
    instagram: "@vinyl_house",
    website: "https://vinylhouse.com",
    openingHours: {
      monday: "18:00 - 00:00",
      tuesday: "18:00 - 00:00",
      wednesday: "18:00 - 00:00",
      thursday: "18:00 - 01:00",
      friday: "18:00 - 02:00",
      saturday: "18:00 - 02:00",
      sunday: "18:00 - 00:00"
    },
    features: ["Collection de vinyles", "DJ sets", "Acoustique", "Craft beers"],
    tableReservationEnabled: true
  },
  {
    id: 6,
    name: "Cosmos Club",
    category: "Nightclub",
    image: "https://images.unsplash.com/photo-1598495496118-f8763b94bde5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    coverImage: "https://images.unsplash.com/photo-1602816505236-10de2318e4b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Antananarivo",
    address: "34 Avenue de l'Espace, Antananarivo",
    rating: 4.4,
    reviewCount: 203,
    description: "Cosmos Club est un club futuriste avec une ambiance interstellaire, des lumières impressionnantes et une musique électrisante.",
    featured: true,
    hasTableReservation: true,
    capacity: 400,
    instagram: "@cosmos_club",
    website: "https://cosmosclub.com",
    openingHours: {
      monday: "Fermé",
      tuesday: "Fermé",
      wednesday: "21:00 - 03:00",
      thursday: "21:00 - 03:00",
      friday: "22:00 - 05:00",
      saturday: "22:00 - 06:00",
      sunday: "20:00 - 02:00"
    },
    features: ["Thème spatial", "Light show", "VIP", "DJs internationaux"],
    upcomingEvents: [
      {
        id: 107,
        name: "Galaxy Party",
        date: "2023-10-21",
        image: "https://images.unsplash.com/photo-1609244919273-5e3def8ccaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    tableReservationEnabled: true
  },
  {
    id: 7,
    name: "Jazz Corner",
    category: "Music Bar",
    image: "https://images.unsplash.com/photo-1569230516306-5a8cb5586399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    coverImage: "https://images.unsplash.com/photo-1531651008558-ed1740375b39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    location: "Antananarivo",
    address: "57 Rue du Jazz, Antananarivo",
    rating: 4.9,
    reviewCount: 167,
    description: "Jazz Corner est un lieu intime où vous pourrez écouter les meilleurs musiciens de jazz locaux et internationaux.",
    featured: false,
    hasTableReservation: true,
    capacity: 100,
    instagram: "@jazz_corner",
    website: "https://jazzcorner.com",
    openingHours: {
      monday: "Fermé",
      tuesday: "19:00 - 00:00",
      wednesday: "19:00 - 00:00",
      thursday: "19:00 - 01:00",
      friday: "19:00 - 02:00",
      saturday: "19:00 - 02:00",
      sunday: "18:00 - 00:00"
    },
    features: ["Musique live", "Jazz", "Cocktails classiques", "Acoustique parfaite"],
    upcomingEvents: [
      {
        id: 108,
        name: "Jazz Quartet",
        date: "2023-10-17",
        image: "https://images.unsplash.com/photo-1488841714725-bb4c32d1ac94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2030&q=80"
      }
    ],
    tableReservationEnabled: true
  },
  {
    id: 8,
    name: "Tropical Beach Club",
    category: "Beach Club",
    image: "https://images.unsplash.com/photo-1539758462369-43adaa19bc1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Nosy Be",
    address: "Plage de Belle Vue, Nosy Be",
    rating: 4.8,
    reviewCount: 245,
    description: "Tropical Beach Club est un paradis au bord de la mer où vous pourrez danser les pieds dans le sable avec des cocktails exotiques.",
    featured: true,
    hasTableReservation: true,
    capacity: 300,
    instagram: "@tropical_beach",
    website: "https://tropicalbeachclub.com",
    openingHours: {
      monday: "12:00 - 22:00",
      tuesday: "12:00 - 22:00",
      wednesday: "12:00 - 22:00",
      thursday: "12:00 - 00:00",
      friday: "12:00 - 03:00",
      saturday: "12:00 - 03:00",
      sunday: "12:00 - 22:00"
    },
    features: ["Plage privée", "Bar de plage", "Cocktails tropicaux", "Sunsets DJ"],
    upcomingEvents: [
      {
        id: 109,
        name: "Beach Party",
        date: "2023-10-23",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    tableReservationEnabled: true
  }
];

export default function SearchClubsPage() {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [selectedLocation, setSelectedLocation] = useState("Toutes les villes");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [showTableReservationOnly, setShowTableReservationOnly] = useState(false);
  
  // Extraire les catégories et emplacements uniques
  const categories = ["Toutes les catégories", ...Array.from(new Set(clubsData.map(club => club.category)))];
  const locations = ["Toutes les villes", ...Array.from(new Set(clubsData.map(club => club.location)))];
  
  // Extraire les caractéristiques uniques de tous les clubs
  const allFeatures: string[] = [];
  clubsData.forEach(club => {
    club.features.forEach(feature => {
      if (!allFeatures.includes(feature)) {
        allFeatures.push(feature);
      }
    });
  });
  
  // Filtrer les clubs en fonction des critères de recherche
  const filteredClubs = clubsData.filter(club => {
    // Filtre par recherche textuelle
    const matchesSearch = searchQuery === "" || 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filtre par catégorie
    const matchesCategory = selectedCategory === "Toutes les catégories" || club.category === selectedCategory;
    
    // Filtre par emplacement
    const matchesLocation = selectedLocation === "Toutes les villes" || club.location === selectedLocation;
    
    // Filtre par caractéristiques
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => club.features.includes(feature));
    
    // Filtre pour la réservation de table
    const matchesTableReservation = !showTableReservationOnly || club.tableReservationEnabled;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesFeatures && matchesTableReservation;
  });
  
  // Trier les résultats
  const sortedClubs = [...filteredClubs].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "popularity":
        return b.reviewCount - a.reviewCount;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default: // recommended (default)
        return b.featured ? 1 : -1;
    }
  });
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Toutes les catégories");
    setSelectedLocation("Toutes les villes");
    setSelectedFeatures([]);
    setSortBy("recommended");
    setShowTableReservationOnly(false);
  };
  
  // Contenu du filtre mobile
  const mobileFilterContent = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtres</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="category" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="category">Catégorie</TabsTrigger>
            <TabsTrigger value="location">Lieu</TabsTrigger>
            <TabsTrigger value="features">Options</TabsTrigger>
          </TabsList>
          <TabsContent value="category" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div 
                  key={category} 
                  className={`
                    border rounded-md p-3 text-sm cursor-pointer transition-colors
                    ${selectedCategory === category 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4">
            <ScrollArea className="h-[50vh]">
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <div 
                    key={location} 
                    className={`
                      border rounded-md p-3 text-sm cursor-pointer transition-colors
                      ${selectedLocation === location 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-muted-foreground'
                      }
                    `}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="table-reservation" 
                  checked={showTableReservationOnly}
                  onCheckedChange={(checked) => setShowTableReservationOnly(checked === true)}
                />
                <Label htmlFor="table-reservation">Réservation de table disponible</Label>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm font-medium mb-2">Caractéristiques</div>
              <ScrollArea className="h-[40vh]">
                <div className="space-y-2">
                  {allFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`feature-${feature}`} 
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                      <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-4 flex-row justify-between gap-2">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            Réinitialiser
          </Button>
          <Button className="flex-1">
            Appliquer ({filteredClubs.length})
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
  // Contenu du tri mobile
  const mobileSortContent = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Trier</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Trier par</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          {[
            { value: "recommended", label: "Recommandés" },
            { value: "rating", label: "Meilleures notes" },
            { value: "popularity", label: "Popularité" },
            { value: "name_asc", label: "Nom (A-Z)" },
            { value: "name_desc", label: "Nom (Z-A)" }
          ].map((option) => (
            <div 
              key={option.value} 
              className={`
                border rounded-md p-3 text-sm cursor-pointer transition-colors
                ${sortBy === option.value 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-muted-foreground'
                }
              `}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
  
  // Contenu du filtre desktop
  const desktopFilterContent = (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
        <CardDescription>Affinez votre recherche</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category-select" className="block mb-2">Catégorie</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Catégories</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="location-select" className="block mb-2">Lieu</Label>
          <Select 
            value={selectedLocation} 
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger id="location-select">
              <SelectValue placeholder="Sélectionner un lieu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lieux</SelectLabel>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="sort-select" className="block mb-2">Trier par</Label>
          <Select 
            value={sortBy} 
            onValueChange={setSortBy}
          >
            <SelectTrigger id="sort-select">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Options de tri</SelectLabel>
                <SelectItem value="recommended">Recommandés</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                <SelectItem value="popularity">Popularité</SelectItem>
                <SelectItem value="name_asc">Nom (A-Z)</SelectItem>
                <SelectItem value="name_desc">Nom (Z-A)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="desktop-table-reservation" 
              checked={showTableReservationOnly}
              onCheckedChange={(checked) => setShowTableReservationOnly(checked === true)}
            />
            <Label htmlFor="desktop-table-reservation">Réservation de table disponible</Label>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Caractéristiques</h3>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {allFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`desktop-feature-${feature}`} 
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFeatures([...selectedFeatures, feature]);
                      } else {
                        setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                      }
                    }}
                  />
                  <Label htmlFor={`desktop-feature-${feature}`}>{feature}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={resetFilters}
        >
          Réinitialiser les filtres
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-lg md:text-xl">
          <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
          <span className="ml-2 text-foreground">Rechercher un club</span>
        </h1>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="w-full">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un club, une catégorie, des fonctionnalités..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isMobile ? (
            <div className="flex gap-2">
              {mobileFilterContent}
              {mobileSortContent}
            </div>
          ) : null}
        </div>
        
        {/* Affichage des résultats */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filtres (desktop) */}
          {!isMobile && (
            <div className="hidden md:block md:w-1/4 lg:w-1/5">
              {desktopFilterContent}
            </div>
          )}
          
          {/* Liste des clubs */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
              </h2>
              
              {/* Affichage des filtres actifs */}
              <div className="flex flex-wrap gap-2 justify-end">
                {selectedCategory !== "Toutes les catégories" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedCategory("Toutes les catégories")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedLocation !== "Toutes les villes" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLocation}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedLocation("Toutes les villes")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {showTableReservationOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Réservation de table
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setShowTableReservationOnly(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedFeatures.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedFeatures.length} fonctionnalité{selectedFeatures.length > 1 ? 's' : ''}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setSelectedFeatures([])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
            
            {filteredClubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucun club trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}