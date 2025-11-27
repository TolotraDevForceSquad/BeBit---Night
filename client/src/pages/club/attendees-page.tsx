import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Star,
  UserCheck,
  Users,
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart4,
  Activity,
  Heart,
  MessageSquare,
  Mail,
  Phone,
  AlertCircle,
  Cake,
  Zap,
  CreditCard,
  MapPin,
  Clock,
  Check
} from "lucide-react";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";

// Données factices pour les participants
const attendees = [
  {
    id: 1,
    name: "Emma Dubois",
    avatar: "/avatars/emma.jpg",
    email: "emma.dubois@mail.com",
    phone: "+261 34 56 78 90",
    visits: 18,
    lastVisit: "2023-05-05T21:45:00",
    totalSpent: 240000,
    avgSpent: 13333,
    preferredEvents: ["DJ Night", "Electronic"],
    memberSince: "2022-10-15",
    status: "active",
    tags: ["VIP", "High Spender", "Regular"],
    birthday: "1995-08-12",
    address: "Antananarivo, Quartier Isoraka",
    loyaltyPoints: 850,
    preferences: {
      music: ["Electronic", "House", "Techno"],
      drinks: ["Cocktails", "Champagne"],
      location: "Terrasse"
    },
    feedback: {
      rating: 4.8,
      reviews: 7,
      lastFeedback: "Soirée incroyable, j'adore l'ambiance! Les cocktails étaient parfaits."
    },
    segments: ["High Value", "Frequent", "Trendsetter"]
  },
  {
    id: 2,
    name: "Thomas Rakoto",
    avatar: "/avatars/thomas.jpg",
    email: "thomas.r@mail.com",
    phone: "+261 32 11 22 33",
    visits: 12,
    lastVisit: "2023-05-02T23:15:00",
    totalSpent: 185000,
    avgSpent: 15416,
    preferredEvents: ["Live Music", "Jazz"],
    memberSince: "2022-11-20",
    status: "active",
    tags: ["Regular", "Table Reservation"],
    birthday: "1990-04-22",
    address: "Antananarivo, Quartier Analakely",
    loyaltyPoints: 620,
    preferences: {
      music: ["Jazz", "Live", "Soul"],
      drinks: ["Whisky", "Craft Beer"],
      location: "VIP Area"
    },
    feedback: {
      rating: 4.5,
      reviews: 4,
      lastFeedback: "J'apprécie l'ambiance jazz des jeudis soir. Service impeccable."
    },
    segments: ["Medium Value", "Regular", "Enthusiast"]
  },
  {
    id: 3,
    name: "Sophie Andrianome",
    avatar: "/avatars/sophie.jpg",
    email: "sophie.a@mail.com",
    phone: "+261 33 44 55 66",
    visits: 7,
    lastVisit: "2023-04-28T22:30:00",
    totalSpent: 98000,
    avgSpent: 14000,
    preferredEvents: ["Weekend Party", "R&B"],
    memberSince: "2023-01-10",
    status: "active",
    tags: ["New", "Weekend"],
    birthday: "1998-12-05",
    address: "Antananarivo, Quartier Ivandry",
    loyaltyPoints: 310,
    preferences: {
      music: ["R&B", "Hip-Hop", "Afrobeats"],
      drinks: ["Cocktails", "Wine"],
      location: "Dance Floor"
    },
    feedback: {
      rating: 4.2,
      reviews: 2,
      lastFeedback: "Bonne ambiance, mais l'attente au bar était un peu longue."
    },
    segments: ["Medium Value", "Growing", "Social"]
  },
  {
    id: 4,
    name: "Jean Razafindrakoto",
    avatar: "/avatars/jean.jpg",
    email: "jean.r@mail.com",
    phone: "+261 34 11 00 99",
    visits: 22,
    lastVisit: "2023-05-06T20:15:00",
    totalSpent: 320000,
    avgSpent: 14545,
    preferredEvents: ["DJ Night", "House"],
    memberSince: "2022-08-05",
    status: "active",
    tags: ["VIP", "High Spender", "Regular"],
    birthday: "1988-06-30",
    address: "Antananarivo, Quartier Tana Waterfront",
    loyaltyPoints: 980,
    preferences: {
      music: ["House", "EDM", "Progressive"],
      drinks: ["Premium Spirits", "Cocktails"],
      location: "VIP Area"
    },
    feedback: {
      rating: 4.9,
      reviews: 9,
      lastFeedback: "Le meilleur club de la ville! Les DJ sont toujours excellents."
    },
    segments: ["High Value", "Frequent", "Promoter"]
  },
  {
    id: 5,
    name: "Marie Solofo",
    avatar: "/avatars/marie.jpg",
    email: "marie.s@mail.com",
    phone: "+261 32 88 77 66",
    visits: 4,
    lastVisit: "2023-04-15T21:00:00",
    totalSpent: 45000,
    avgSpent: 11250,
    preferredEvents: ["Weekend Party", "Pop"],
    memberSince: "2023-03-12",
    status: "inactive",
    tags: ["New", "Occasional"],
    birthday: "1997-02-18",
    address: "Antananarivo, Quartier Ankorondrano",
    loyaltyPoints: 180,
    preferences: {
      music: ["Pop", "Commercial", "Latin"],
      drinks: ["Wine", "Soft Drinks"],
      location: "Bar Area"
    },
    feedback: {
      rating: 3.8,
      reviews: 1,
      lastFeedback: "Ambiance sympa, mais un peu trop bruyant pour discuter."
    },
    segments: ["Low Value", "Occasional", "Potential"]
  },
  {
    id: 6,
    name: "Luc Randriamanga",
    avatar: "/avatars/luc.jpg",
    email: "luc.r@mail.com",
    phone: "+261 33 22 11 00",
    visits: 15,
    lastVisit: "2023-05-01T23:45:00",
    totalSpent: 225000,
    avgSpent: 15000,
    preferredEvents: ["DJ Night", "Techno"],
    memberSince: "2022-09-28",
    status: "active",
    tags: ["Regular", "Table Reservation"],
    birthday: "1992-11-14",
    address: "Antananarivo, Quartier Ambanidia",
    loyaltyPoints: 750,
    preferences: {
      music: ["Techno", "Minimal", "Underground"],
      drinks: ["Beer", "Spirits"],
      location: "Main Floor"
    },
    feedback: {
      rating: 4.6,
      reviews: 5,
      lastFeedback: "Les soirées techno sont exceptionnelles. Continuez comme ça!"
    },
    segments: ["High Value", "Regular", "Enthusiast"]
  },
  {
    id: 7,
    name: "Nathalie Rabemananjara",
    avatar: "/avatars/nathalie.jpg",
    email: "nathalie.r@mail.com",
    phone: "+261 34 99 88 77",
    visits: 9,
    lastVisit: "2023-04-22T22:00:00",
    totalSpent: 135000,
    avgSpent: 15000,
    preferredEvents: ["Weekend Party", "RnB"],
    memberSince: "2022-12-15",
    status: "active",
    tags: ["Regular", "Social Media"],
    birthday: "1994-09-25",
    address: "Antananarivo, Quartier Andraharo",
    loyaltyPoints: 450,
    preferences: {
      music: ["RnB", "Afrobeats", "Hip-Hop"],
      drinks: ["Cocktails", "Premium Spirits"],
      location: "Lounge Area"
    },
    feedback: {
      rating: 4.4,
      reviews: 3,
      lastFeedback: "J'adore la sélection musicale et l'ambiance générale!"
    },
    segments: ["Medium Value", "Growing", "Influencer"]
  },
  {
    id: 8,
    name: "Paul Andriamihaja",
    avatar: "/avatars/paul.jpg",
    email: "paul.a@mail.com",
    phone: "+261 32 55 66 77",
    visits: 3,
    lastVisit: "2023-04-08T21:30:00",
    totalSpent: 38000,
    avgSpent: 12667,
    preferredEvents: ["Live Music", "Blues"],
    memberSince: "2023-03-05",
    status: "inactive",
    tags: ["New", "Occasional"],
    birthday: "1985-07-11",
    address: "Antananarivo, Quartier Behoririka",
    loyaltyPoints: 150,
    preferences: {
      music: ["Blues", "Jazz", "Rock"],
      drinks: ["Whisky", "Craft Beer"],
      location: "Quiet Area"
    },
    feedback: {
      rating: 4.0,
      reviews: 1,
      lastFeedback: "Bonne soirée blues, mais les prix sont un peu élevés."
    },
    segments: ["Low Value", "Occasional", "Niche"]
  },
  {
    id: 9,
    name: "Chantal Razafindrabe",
    avatar: "/avatars/chantal.jpg",
    email: "chantal.r@mail.com",
    phone: "+261 33 12 23 34",
    visits: 11,
    lastVisit: "2023-04-29T23:00:00",
    totalSpent: 175000,
    avgSpent: 15909,
    preferredEvents: ["Weekend Party", "House"],
    memberSince: "2022-11-10",
    status: "active",
    tags: ["Regular", "High Spender"],
    birthday: "1993-03-19",
    address: "Antananarivo, Quartier Ambohimanarina",
    loyaltyPoints: 580,
    preferences: {
      music: ["House", "Disco", "Funk"],
      drinks: ["Champagne", "Cocktails"],
      location: "VIP Area"
    },
    feedback: {
      rating: 4.7,
      reviews: 4,
      lastFeedback: "Service VIP exceptionnel, toujours une expérience parfaite!"
    },
    segments: ["High Value", "Regular", "Social"]
  },
  {
    id: 10,
    name: "Eric Rakotondrabe",
    avatar: "/avatars/eric.jpg",
    email: "eric.r@mail.com",
    phone: "+261 34 45 67 89",
    visits: 6,
    lastVisit: "2023-04-21T20:30:00",
    totalSpent: 78000,
    avgSpent: 13000,
    preferredEvents: ["DJ Night", "Afrobeats"],
    memberSince: "2023-01-25",
    status: "active",
    tags: ["New", "Weekend"],
    birthday: "1996-05-07",
    address: "Antananarivo, Quartier Ampandrana",
    loyaltyPoints: 280,
    preferences: {
      music: ["Afrobeats", "Dancehall", "Reggaeton"],
      drinks: ["Beer", "Rum"],
      location: "Dance Floor"
    },
    feedback: {
      rating: 4.3,
      reviews: 2,
      lastFeedback: "Super ambiance et bonne sélection musicale!"
    },
    segments: ["Medium Value", "Growing", "Explorer"]
  }
];

// Données factices pour les tendances
const trends = {
  visitsByDayOfWeek: [
    { day: "Lun", count: 120 },
    { day: "Mar", count: 150 },
    { day: "Mer", count: 180 },
    { day: "Jeu", count: 250 },
    { day: "Ven", count: 420 },
    { day: "Sam", count: 480 },
    { day: "Dim", count: 200 }
  ],
  visitorDemographics: {
    ageGroups: [
      { group: "18-24", percentage: 35 },
      { group: "25-34", percentage: 42 },
      { group: "35-44", percentage: 18 },
      { group: "45+", percentage: 5 }
    ],
    gender: [
      { type: "Homme", percentage: 55 },
      { type: "Femme", percentage: 42 },
      { type: "Autre", percentage: 3 }
    ]
  },
  spendingByCategory: [
    { category: "Entrées", amount: 850000 },
    { category: "Boissons", amount: 1250000 },
    { category: "Tables VIP", amount: 680000 },
    { category: "Événements spéciaux", amount: 420000 }
  ],
  customerRetention: {
    oneTime: 35,
    occasional: 45,
    regular: 20
  },
  topEvents: [
    { name: "DJ International Night", attendance: 450, rating: 4.8 },
    { name: "Weekend Fever", attendance: 420, rating: 4.6 },
    { name: "Ladies Night", attendance: 380, rating: 4.7 },
    { name: "Throwback Thursday", attendance: 320, rating: 4.5 },
    { name: "Afrobeats Special", attendance: 310, rating: 4.4 }
  ]
};

// Formatage des montants en Ariary
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0
  }).format(amount);
};

// Formatage des dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Date relative (ex: "il y a 3 jours")
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }
};

interface Attendee {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  avgSpent: number;
  preferredEvents: string[];
  memberSince: string;
  status: string;
  tags: string[];
  birthday: string;
  address: string;
  loyaltyPoints: number;
  preferences: {
    music: string[];
    drinks: string[];
    location: string;
  };
  feedback: {
    rating: number;
    reviews: number;
    lastFeedback: string;
  };
  segments: string[];
}

const AttendeeCard: React.FC<{ attendee: Attendee }> = ({ attendee }) => {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {attendee.avatar ? (
                <img src={attendee.avatar} alt={attendee.name} className="w-full h-full object-cover" />
              ) : (
                <Users size={24} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{attendee.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock size={12} className="mr-1" />
                <span>Dernière visite: {getRelativeTime(attendee.lastVisit)}</span>
              </div>
            </div>
          </div>
          <div>
            <Badge variant={
              attendee.visits > 15 ? "default" : 
              attendee.visits > 8 ? "secondary" : "outline"
            }>
              {attendee.visits} visites
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Total dépensé</span>
            <span className="font-medium">{formatCurrency(attendee.totalSpent)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Moy. par visite</span>
            <span className="font-medium">{formatCurrency(attendee.avgSpent)}</span>
          </div>
          <div className="flex flex-col col-span-2 mt-1">
            <span className="text-muted-foreground text-xs">Préférences</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {attendee.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs py-0 px-1.5">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-full flex justify-between items-center">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
            <Mail size={14} className="mr-1" />
            Contacter
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
            Voir profil
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const AttendeesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  
  // Filtrer les participants
  const filteredAttendees = attendees.filter(attendee => {
    // Filtre de recherche
    if (searchTerm && !attendee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Filtre de statut
    if (statusFilter !== "all" && attendee.status !== statusFilter) {
      return false;
    }
    return true;
  });
  
  // Trier les participants
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    } else if (sortOrder === "visits") {
      return b.visits - a.visits;
    } else if (sortOrder === "spending") {
      return b.totalSpent - a.totalSpent;
    } else if (sortOrder === "loyalty") {
      return b.loyaltyPoints - a.loyaltyPoints;
    }
    return 0;
  });

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Participants</h1>
            <p className="text-lg text-muted-foreground mt-1.5">
              Analysez vos visiteurs et leurs habitudes
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={16} />
              Exporter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Mail size={16} />
              Campagne Email
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="visitors">Visiteurs</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          {/* Tab: Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Total visiteurs
                  </CardTitle>
                  <CardDescription>
                    Tous temps confondus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {attendees.length}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12.8%</span>
                    <span className="ml-1.5">depuis le mois dernier</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Voir tous les visiteurs
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Fréquentation moyenne
                  </CardTitle>
                  <CardDescription>
                    Par événement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    350
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+8.2%</span>
                    <span className="ml-1.5">depuis le mois dernier</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Détails par événement
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Dépense moyenne
                  </CardTitle>
                  <CardDescription>
                    Par visiteur et visite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(14562)}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+5.3%</span>
                    <span className="ml-1.5">depuis le mois dernier</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Détails des dépenses
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Taux de fidélisation
                  </CardTitle>
                  <CardDescription>
                    Visiteurs réguliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    65%
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+3.7%</span>
                    <span className="ml-1.5">depuis le mois dernier</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 pb-1">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Analyse fidélisation
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Participants récents</CardTitle>
                    <CardDescription>
                      Les derniers visiteurs de votre établissement
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Input 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedAttendees.slice(0, 6).map((attendee) => (
                    <AttendeeCard key={attendee.id} attendee={attendee} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Users size={16} />
                  Voir tous les participants
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Fréquentation par jour</CardTitle>
                  <CardDescription>
                    Nombre de visiteurs par jour de la semaine
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    {/* Chart simulation */}
                    <div className="flex h-[250px] items-end space-x-2">
                      {trends.visitsByDayOfWeek.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-primary/90 hover:bg-primary rounded-t transition-all"
                            style={{ 
                              height: `${(item.count / 500) * 250}px`
                            }}
                          ></div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {item.day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Basé sur les 30 derniers jours
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <BarChart4 size={16} />
                    Rapport détaillé
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top événements</CardTitle>
                  <CardDescription>Par nombre de participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trends.topEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between pb-2 border-b border-border last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium text-sm">{event.name}</div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Users size={12} className="mr-1" />
                            <span>{event.attendance} participants</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-primary/10 px-2 py-1 rounded text-xs">
                          <Star size={12} className="text-amber-500 mr-1 fill-amber-500" />
                          <span>{event.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Tous les événements
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Visiteurs */}
          <TabsContent value="visitors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Tous les participants</CardTitle>
                    <CardDescription>Liste complète de vos visiteurs</CardDescription>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-full"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[120px] flex-shrink-0">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-[140px] flex-shrink-0">
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Plus récents</SelectItem>
                        <SelectItem value="visits">Visites</SelectItem>
                        <SelectItem value="spending">Dépenses</SelectItem>
                        <SelectItem value="loyalty">Fidélité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium p-2">Participant</th>
                        <th className="text-left font-medium p-2">Dernière visite</th>
                        <th className="text-left font-medium p-2">Visites</th>
                        <th className="text-left font-medium p-2">Dépenses</th>
                        <th className="text-left font-medium p-2">Préférences</th>
                        <th className="text-left font-medium p-2">Statut</th>
                        <th className="text-right font-medium p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAttendees.map((attendee) => (
                        <tr 
                          key={attendee.id} 
                          className={`border-b border-border hover:bg-muted/50 cursor-pointer ${selectedAttendee?.id === attendee.id ? 'bg-muted' : ''}`}
                          onClick={() => setSelectedAttendee(attendee)}
                        >
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                {attendee.avatar ? (
                                  <img src={attendee.avatar} alt={attendee.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Users size={16} className="text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{attendee.name}</div>
                                <div className="text-xs text-muted-foreground">{attendee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div>{formatDate(attendee.lastVisit)}</div>
                            <div className="text-xs text-muted-foreground">{getRelativeTime(attendee.lastVisit)}</div>
                          </td>
                          <td className="p-2">{attendee.visits}</td>
                          <td className="p-2">
                            <div>{formatCurrency(attendee.totalSpent)}</div>
                            <div className="text-xs text-muted-foreground">
                              Moy: {formatCurrency(attendee.avgSpent)}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-1">
                              {attendee.preferredEvents.map((pref, index) => (
                                <Badge key={index} variant="outline" className="text-xs py-0 px-1.5">{pref}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant={attendee.status === 'active' ? 'default' : 'secondary'}>
                              {attendee.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Action pour envoyer un email
                                }}
                              >
                                <Mail size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Action pour gérer les statuts du client
                                }}
                              >
                                <UserCheck size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAttendee(attendee);
                                }}
                              >
                                <ChevronRight size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage de {sortedAttendees.length} participants
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Précédent</Button>
                  <Button variant="outline" size="sm" className="bg-primary/10">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant</Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Profil détaillé du participant</CardTitle>
                    <CardDescription>Sélectionnez un participant pour voir ses détails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 border-t">
                {!selectedAttendee ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <UserCheck size={24} className="text-primary/60" />
                    </div>
                    <h3 className="font-medium mb-2">Aucun participant sélectionné</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Cliquez sur un participant dans la liste ci-dessus pour afficher son profil détaillé avec historique, préférences et opportunités de fidélisation.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 p-6 border-r border-border">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-4">
                          {selectedAttendee.avatar ? (
                            <img src={selectedAttendee.avatar} alt={selectedAttendee.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users size={36} className="text-muted-foreground" />
                          )}
                        </div>
                        <h2 className="text-xl font-semibold">{selectedAttendee.name}</h2>
                        <div className="text-sm text-muted-foreground">{selectedAttendee.email}</div>
                        <div className="text-sm text-muted-foreground">{selectedAttendee.phone}</div>
                        
                        <div className="flex items-center mt-4 gap-2">
                          <Badge variant={selectedAttendee.status === 'active' ? 'default' : 'secondary'}>
                            {selectedAttendee.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                          {selectedAttendee.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Client depuis</span>
                          <span className="text-sm">{new Date(selectedAttendee.memberSince).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Nombre de visites</span>
                          <span className="text-sm">{selectedAttendee.visits} visites</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Dépenses totales</span>
                          <span className="text-sm font-medium">{formatCurrency(selectedAttendee.totalSpent)}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Moyenne par visite</span>
                          <span className="text-sm">{formatCurrency(selectedAttendee.avgSpent)}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Points de fidélité</span>
                          <span className="text-sm">{selectedAttendee.loyaltyPoints} points</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <Button className="w-full" size="sm">
                          <Mail size={16} className="mr-2" />
                          Contacter
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <UserCheck size={16} className="mr-2" />
                          Gérer le statut
                        </Button>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 p-6">
                      <Tabs defaultValue="preferences">
                        <TabsList className="w-full grid grid-cols-4">
                          <TabsTrigger value="preferences">Préférences</TabsTrigger>
                          <TabsTrigger value="history">Historique</TabsTrigger>
                          <TabsTrigger value="feedback">Avis</TabsTrigger>
                          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="preferences" className="pt-4">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-medium mb-3">Préférences musicales</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedAttendee.preferences.music.map((genre, index) => (
                                  <Badge key={index} variant="secondary">{genre}</Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-3">Boissons préférées</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedAttendee.preferences.drinks.map((drink, index) => (
                                  <Badge key={index} variant="secondary">{drink}</Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-3">Emplacement préféré</h3>
                              <Badge variant="secondary">{selectedAttendee.preferences.location}</Badge>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-3">Types d'événements fréquentés</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedAttendee.preferredEvents.map((event, index) => (
                                  <Badge key={index} variant="secondary">{event}</Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-3">Segments client</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedAttendee.segments.map((segment, index) => (
                                  <Badge key={index} className={
                                    segment.includes("High") ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900" :
                                    segment.includes("Medium") ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-900" :
                                    "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-900"
                                  }>
                                    {segment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="history" className="pt-4">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">Dernières visites</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center pb-2 border-b border-border">
                                <div>
                                  <div className="font-medium">DJ Night - {formatDate(selectedAttendee.lastVisit)}</div>
                                  <div className="text-xs text-muted-foreground">Table: Non • Entrée: {formatCurrency(3500)}</div>
                                </div>
                                <div className="text-sm font-medium">{formatCurrency(8500)}</div>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b border-border">
                                <div>
                                  <div className="font-medium">Weekend Fever - {formatDate("2023-04-22T22:30:00")}</div>
                                  <div className="text-xs text-muted-foreground">Table: VIP #4 • Entrée: {formatCurrency(5000)}</div>
                                </div>
                                <div className="text-sm font-medium">{formatCurrency(12500)}</div>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b border-border">
                                <div>
                                  <div className="font-medium">Afrobeats Special - {formatDate("2023-04-15T21:30:00")}</div>
                                  <div className="text-xs text-muted-foreground">Table: Non • Entrée: {formatCurrency(3500)}</div>
                                </div>
                                <div className="text-sm font-medium">{formatCurrency(7200)}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h3 className="text-sm font-medium mb-3">Commandes habituelles</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="text-sm font-medium">Bouteille Champagne</div>
                                  <div className="text-xs text-muted-foreground">5 commandes</div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="text-sm font-medium">Cocktails Premium</div>
                                  <div className="text-xs text-muted-foreground">8 commandes</div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="text-sm font-medium">Réservation VIP</div>
                                  <div className="text-xs text-muted-foreground">3 commandes</div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <div className="text-sm font-medium">Shots</div>
                                  <div className="text-xs text-muted-foreground">4 commandes</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="feedback" className="pt-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">Note moyenne</h3>
                              <div className="flex items-center">
                                <div className="flex mr-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={14} 
                                      className={star <= selectedAttendee.feedback.rating ? "fill-amber-500 text-amber-500" : "text-muted"}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{selectedAttendee.feedback.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            
                            <div className="bg-muted/30 p-3 rounded-md">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={12} 
                                      className={star <= selectedAttendee.feedback.rating ? "fill-amber-500 text-amber-500" : "text-muted"}
                                    />
                                  ))}
                                </div>
                                <div className="text-xs ml-2 text-muted-foreground">Il y a {selectedAttendee.lastVisit ? getRelativeTime(selectedAttendee.lastVisit) : "récemment"}</div>
                              </div>
                              <p className="text-sm">
                                "{selectedAttendee.feedback.lastFeedback}"
                              </p>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              Ce client a laissé {selectedAttendee.feedback.reviews} avis sur votre établissement.
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="opportunities" className="pt-4">
                          <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-4">
                              <h3 className="font-medium flex items-center text-green-800 dark:text-green-300 mb-2">
                                <CreditCard size={16} className="mr-2" />
                                Opportunité de montée en gamme
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Ce client a réservé une table VIP à 3 reprises. Il pourrait être intéressé par notre programme de fidélité premium offrant:
                              </p>
                              <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                                <li>Accès prioritaire aux nouvelles tables</li>
                                <li>Réductions sur les bouteilles de champagne</li>
                                <li>Invitations aux événements exclusifs</li>
                              </ul>
                              <div className="mt-2">
                                <Button size="sm" className="gap-1.5">
                                  <Mail size={14} />
                                  Envoyer l'offre
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                              <h3 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
                                <Calendar size={16} className="mr-2" />
                                Recommandation d'événements
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Basé sur les préférences {selectedAttendee.preferences.music.join(", ")}, ce client pourrait être intéressé par:
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-background rounded border">
                                  <div>
                                    <div className="font-medium text-sm">DJ International Night</div>
                                    <div className="text-xs text-muted-foreground">Vendredi 19 Mai</div>
                                  </div>
                                  <Button size="sm" variant="outline" className="h-7 text-xs px-2">Inviter</Button>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-background rounded border">
                                  <div>
                                    <div className="font-medium text-sm">Electronic Fever</div>
                                    <div className="text-xs text-muted-foreground">Samedi 27 Mai</div>
                                  </div>
                                  <Button size="sm" variant="outline" className="h-7 text-xs px-2">Inviter</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Segments */}
          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Segments clients</CardTitle>
                  <CardDescription>
                    Classification de vos participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Par valeur</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>High Value</span>
                            <span className="font-medium">28%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '28%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Medium Value</span>
                            <span className="font-medium">42%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Low Value</span>
                            <span className="font-medium">30%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-gray-500 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Par fréquence</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Frequent (8+ visits)</span>
                            <span className="font-medium">15%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Regular (3-7 visits)</span>
                            <span className="font-medium">35%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-violet-500 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Occasional (1-2 visits)</span>
                            <span className="font-medium">50%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-purple-400 rounded-full" style={{ width: '50%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Par comportement</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Trendsetter</span>
                            <span className="font-medium">12%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-pink-500 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Social</span>
                            <span className="font-medium">38%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-teal-500 rounded-full" style={{ width: '38%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Enthusiast</span>
                            <span className="font-medium">25%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Autres segments</span>
                            <span className="font-medium">25%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full">
                            <div className="h-1.5 bg-gray-400 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium flex items-center">
                    Configurer les segments
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recommandations par segment</CardTitle>
                  <CardDescription>
                    Actions marketing ciblées par groupe de participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                      <h3 className="font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
                        <Zap size={16} className="mr-2" />
                        HIGH VALUE / FREQUENT
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-3">
                        <p>Ce segment représente vos clients les plus précieux - ils dépensent beaucoup et viennent souvent.</p>
                      </div>
                      <div className="text-sm">
                        <h4 className="font-medium mb-1">Actions recommandées:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Programme VIP avec accès anticipé aux événements</li>
                          <li>Invitations personnalisées aux soirées exclusives</li>
                          <li>Service de conciergerie de table</li>
                          <li>Cadeaux d'anniversaire et occasions spéciales</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-md p-4">
                      <h3 className="font-medium flex items-center text-teal-800 dark:text-teal-300 mb-2">
                        <TrendingUp size={16} className="mr-2" />
                        MEDIUM VALUE / GROWING
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-3">
                        <p>Ces clients montrent un potentiel de croissance avec une fréquentation et des dépenses en augmentation.</p>
                      </div>
                      <div className="text-sm">
                        <h4 className="font-medium mb-1">Actions recommandées:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Programme de fidélité à paliers avec récompenses</li>
                          <li>Promotions "invitez un ami" avec avantages partagés</li>
                          <li>Offres spéciales sur boissons/réservations</li>
                          <li>Sondages pour comprendre leurs préférences</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                      <h3 className="font-medium flex items-center text-amber-800 dark:text-amber-300 mb-2">
                        <Activity size={16} className="mr-2" />
                        OCCASIONAL / POTENTIAL
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-3">
                        <p>Ces clients viennent occasionnellement mais pourraient être convertis en clients réguliers.</p>
                      </div>
                      <div className="text-sm">
                        <h4 className="font-medium mb-1">Actions recommandées:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Offres "bienvenue à nouveau" après absence prolongée</li>
                          <li>Promotions happy hour et entrée gratuite en semaine</li>
                          <li>Communication ciblée sur les événements correspondant à leurs goûts</li>
                          <li>Questionnaire post-visite pour amélioration continue</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Ces recommandations sont générées automatiquement basées sur les données de fréquentation
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Mail size={16} />
                    Créer campagne
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Campagnes par segment</CardTitle>
                <CardDescription>Performance des campagnes marketing ciblées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium p-2">Campagne</th>
                        <th className="text-left font-medium p-2">Segment ciblé</th>
                        <th className="text-left font-medium p-2">Date</th>
                        <th className="text-left font-medium p-2">Envois</th>
                        <th className="text-left font-medium p-2">Ouverture</th>
                        <th className="text-left font-medium p-2">Conversions</th>
                        <th className="text-left font-medium p-2">ROI</th>
                        <th className="text-left font-medium p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-2">VIP Weekend Experience</td>
                        <td className="p-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                            HIGH VALUE
                          </Badge>
                        </td>
                        <td className="p-2">12 Mai 2023</td>
                        <td className="p-2">75</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">82%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">35%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">3.8x</span>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                            Terminé
                          </Badge>
                        </td>
                      </tr>
                      
                      <tr className="border-b border-border">
                        <td className="p-2">Double Points Fidélité</td>
                        <td className="p-2">
                          <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900">
                            MEDIUM VALUE
                          </Badge>
                        </td>
                        <td className="p-2">5 Mai 2023</td>
                        <td className="p-2">180</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">75%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">28%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">2.5x</span>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                            Terminé
                          </Badge>
                        </td>
                      </tr>
                      
                      <tr className="border-b border-border">
                        <td className="p-2">Bienvenue à nouveau</td>
                        <td className="p-2">
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900">
                            OCCASIONAL
                          </Badge>
                        </td>
                        <td className="p-2">28 Avril 2023</td>
                        <td className="p-2">250</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">68%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">18%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '18%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">1.9x</span>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                            Terminé
                          </Badge>
                        </td>
                      </tr>
                      
                      <tr className="border-b border-border">
                        <td className="p-2">Anniversaire Club - Special VIP</td>
                        <td className="p-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                            HIGH VALUE
                          </Badge>
                        </td>
                        <td className="p-2">15 Mai 2023</td>
                        <td className="p-2">85</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">45%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">10%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="text-amber-600 dark:text-amber-400 font-medium">-</span>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900">
                            En cours
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Affichage des 4 dernières campagnes
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Mail size={16} />
                  Nouvelle campagne
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab: Tendances */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition démographique</CardTitle>
                  <CardDescription>Profil de vos participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Répartition par âge */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Répartition par âge</h3>
                      <div className="space-y-2">
                        {trends.visitorDemographics.ageGroups.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{item.group} ans</span>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Répartition par genre */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Répartition par genre</h3>
                      <div className="flex items-center">
                        <div className="w-28 h-28 relative">
                          <svg viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#e0e0e0" 
                              strokeWidth="20" 
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#4f46e5" 
                              strokeWidth="20" 
                              strokeDasharray="184" 
                              strokeDashoffset="0" 
                              transform="rotate(-90 50 50)"
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#ec4899" 
                              strokeWidth="20" 
                              strokeDasharray="184" 
                              strokeDashoffset="101.2" 
                              transform="rotate(-90 50 50)"
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#e0e0e0" 
                              strokeWidth="20" 
                              strokeDasharray="184" 
                              strokeDashoffset="178.48" 
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                        </div>
                        
                        <div className="ml-4 space-y-2">
                          {trends.visitorDemographics.gender.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-3 h-3 mr-2 rounded-sm ${
                                index === 0 ? "bg-[#4f46e5]" : 
                                index === 1 ? "bg-[#ec4899]" : "bg-[#e0e0e0]"
                              }`}></div>
                              <span className="text-xs">{item.type} ({item.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Insights démographiques</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• La tranche d'âge 25-34 ans représente votre segment principal</p>
                        <p>• Légère surreprésentation masculine (55% vs 42%)</p>
                        <p>• Opportunité: créer plus d'événements ciblant les 35-44 ans</p>
                        <p>• Les clients 18-24 ans dépensent moins mais viennent plus fréquemment</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comportement des clients</CardTitle>
                  <CardDescription>Habitudes et fidélisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Fidélisation des clients</h3>
                      <div className="w-full h-8 rounded-md overflow-hidden bg-muted flex">
                        <div 
                          className="h-full flex items-center justify-center text-xs font-medium text-white"
                          style={{ 
                            width: `${trends.customerRetention.oneTime}%`,
                            backgroundColor: "#f97316"
                          }}
                        >
                          {trends.customerRetention.oneTime}%
                        </div>
                        <div 
                          className="h-full flex items-center justify-center text-xs font-medium text-white"
                          style={{ 
                            width: `${trends.customerRetention.occasional}%`,
                            backgroundColor: "#3b82f6"
                          }}
                        >
                          {trends.customerRetention.occasional}%
                        </div>
                        <div 
                          className="h-full flex items-center justify-center text-xs font-medium text-white"
                          style={{ 
                            width: `${trends.customerRetention.regular}%`,
                            backgroundColor: "#10b981"
                          }}
                        >
                          {trends.customerRetention.regular}%
                        </div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-xs">Unique</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-xs">Occasionnel</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-xs">Régulier</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Évolution vs. mois précédent</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-card p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-amber-500">-5%</div>
                          <div className="text-xs text-muted-foreground">Clients uniques</div>
                        </div>
                        <div className="bg-card p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-green-500">+8%</div>
                          <div className="text-xs text-muted-foreground">Clients occasionnels</div>
                        </div>
                        <div className="bg-card p-2 rounded-md text-center">
                          <div className="text-lg font-bold text-green-500">+3%</div>
                          <div className="text-xs text-muted-foreground">Clients réguliers</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Préférences musicales</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">House</span>
                          </div>
                          <span className="text-xs font-medium">32%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">Techno</span>
                          </div>
                          <span className="text-xs font-medium">25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">Hip-Hop</span>
                          </div>
                          <span className="text-xs font-medium">18%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">Afrobeats</span>
                          </div>
                          <span className="text-xs font-medium">15%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">R&B</span>
                          </div>
                          <span className="text-xs font-medium">7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-xs">Autres</span>
                          </div>
                          <span className="text-xs font-medium">3%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Insights comportementaux</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Conversion positive des visiteurs occasionnels vers réguliers</p>
                        <p>• Les visiteurs réguliers dépensent en moyenne 45% de plus</p>
                        <p>• Préférence marquée pour House et Techno</p>
                        <p>• Opportunité: soirées thématiques Hip-Hop pour diversifier</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Dépenses par catégorie</CardTitle>
                <CardDescription>Répartition des revenus par source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2">
                    <div className="h-80 w-full">
                      {/* Bar chart simulation */}
                      <div className="h-full flex items-end">
                        {trends.spendingByCategory.map((category, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-24 bg-primary rounded-t transition-all hover:bg-primary/90"
                              style={{ 
                                height: `${(category.amount / 1500000) * 100}%`,
                                backgroundColor: index === 0 ? "#3b82f6" : 
                                  index === 1 ? "#10b981" : 
                                  index === 2 ? "#ec4899" : "#f59e0b"
                              }}
                            ></div>
                            <div className="mt-3 text-sm font-medium text-center">
                              {category.category}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(category.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Distribution des revenus</h3>
                        <div className="space-y-2.5">
                          {trends.spendingByCategory.map((category, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-sm mr-2" style={{ 
                                  backgroundColor: index === 0 ? "#3b82f6" : 
                                    index === 1 ? "#10b981" : 
                                    index === 2 ? "#ec4899" : "#f59e0b"
                                }}></div>
                                <span className="text-sm">{category.category}</span>
                              </div>
                              <div className="text-sm font-medium">
                                {Math.round((category.amount / trends.spendingByCategory.reduce((acc, curr) => acc + curr.amount, 0)) * 100)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md space-y-2">
                        <h3 className="font-medium text-sm flex items-center text-blue-800 dark:text-blue-300">
                          <TrendingUp size={16} className="mr-2" />
                          Insights
                        </h3>
                        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
                          <li>Les boissons représentent la principale source de revenus (39%)</li>
                          <li>Les tables VIP ont l'ARPU (revenu moyen/client) le plus élevé</li>
                          <li>Opportunité d'augmenter les revenus des événements spéciaux</li>
                          <li>Tendance: +15% sur les dépenses boissons vs. mois précédent</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Données des 30 derniers jours
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download size={16} />
                  Exporter
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Satisfaction client</CardTitle>
                  <CardDescription>Retours et évaluations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-36 h-36 rounded-full bg-primary/10 border-8 border-primary flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold">4.6</div>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={14} 
                                  className={`${star <= 4 ? "fill-amber-500 text-amber-500" : "fill-amber-300 text-amber-300"}`} 
                                />
                              ))}
                            </div>
                            <div className="text-xs mt-1 text-muted-foreground">350 avis</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full space-y-2">
                        <h3 className="text-sm font-medium mb-1">Répartition des notes</h3>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-right">5 ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: "75%" }}></div>
                          </div>
                          <div className="w-8 text-xs">75%</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-right">4 ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: "15%" }}></div>
                          </div>
                          <div className="w-8 text-xs">15%</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-right">3 ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-300" style={{ width: "6%" }}></div>
                          </div>
                          <div className="w-8 text-xs">6%</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-right">2 ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-200" style={{ width: "3%" }}></div>
                          </div>
                          <div className="w-8 text-xs">3%</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-xs text-right">1 ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-100" style={{ width: "1%" }}></div>
                          </div>
                          <div className="w-8 text-xs">1%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Commentaires récents</h3>
                      <div className="space-y-4">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={12} 
                                  className={`${star <= 5 ? "fill-amber-500 text-amber-500" : "text-muted"}`} 
                                />
                              ))}
                            </div>
                            <div className="text-xs ml-2 text-muted-foreground">Il y a 2 jours</div>
                          </div>
                          <p className="text-sm">
                            "Ambiance incroyable, les DJs sont toujours excellents. Le service VIP est impeccable. Un peu d'attente au bar principal mais rien de dramatique."
                          </p>
                          <div className="text-xs text-primary mt-1 font-medium">Jean R. · DJ Night</div>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={12} 
                                  className={`${star <= 4 ? "fill-amber-500 text-amber-500" : "text-muted"}`} 
                                />
                              ))}
                            </div>
                            <div className="text-xs ml-2 text-muted-foreground">Il y a 5 jours</div>
                          </div>
                          <p className="text-sm">
                            "J'ai adoré la soirée Afrobeats! Le DJ a mis une ambiance de folie. Seul bémol, c'était un peu bondé vers minuit."
                          </p>
                          <div className="text-xs text-primary mt-1 font-medium">Sophie A. · Weekend Party</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Points d'amélioration</CardTitle>
                  <CardDescription>Basé sur les retours clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-red-500" />
                        <h3 className="font-medium">Temps d'attente au bar</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mentionné dans 42% des commentaires négatifs. Particulièrement problématique entre 23h-01h le weekend.
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-amber-500" />
                        <h3 className="font-medium">Climatisation/Aération</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mentionné dans 28% des commentaires négatifs. Principalement au niveau de la piste de danse centrale.
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: "28%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-amber-500" />
                        <h3 className="font-medium">Sélection des boissons</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mentionné dans 15% des commentaires négatifs. Demande pour plus de cocktails sans alcool et options premium.
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Suggestions d'amélioration</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span>Ajouter 2 barmans supplémentaires les vendredis et samedis entre 22h et 2h</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span>Améliorer le système de ventilation au niveau de la piste de danse</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-green-600" />
                          </div>
                          <span>Introduire une carte de cocktails sans alcool de qualité</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AttendeesPage;