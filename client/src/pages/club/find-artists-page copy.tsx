// D:\Projet\BeBit\bebit - new\client\src\pages\club\find-artists-page.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { Separator } from "../../components/ui/separator";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Search,
  Star,
  Mail,
  Calendar,
  Users,
  Music,
  Mic,
  Headphones,
  Award,
  Disc,
  Bookmark,
  MapPin,
  Globe,
  Flame,
  Filter,
  Clock,
  Heart,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock4
} from 'lucide-react';

// Interfaces pour les entités (structurées comme des tables de base de données)
interface Artist {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  genres: number[]; // Référence aux IDs des genres (au lieu de strings)
  locationId: number; // Référence à l'ID de location
  experience: number;
  fee: number;
  bio: string;
  specialties: string[];
  socialFollowers: number;
  availability: boolean;
  followers: number;
  featured: boolean;
  verified: boolean;
  performances: number;
  portfolio: {
    id: number;
    image: string;
    title: string;
  }[];
  email: string;
  phone: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invitation {
  id: number;
  artistId: number;
  eventName: string;
  date: string;
  budget: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message: string;
  sentDate: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Nouvelles interfaces pour les données extraites vers BD
interface Location {
  id: number;
  name: string;
  description?: string; // Optionnel pour détails géo
  createdAt: string;
  updatedAt: string;
}

interface Genre {
  id: number;
  name: string;
  description?: string; // Optionnel pour sous-genres
  createdAt: string;
  updatedAt: string;
}

interface Config {
  id: number;
  priceMin: number; // 0
  priceMax: number; // 200000
  defaultRange: [number, number]; // [50000, 150000]
  step: number; // 5000
  ratingsThresholds: number[]; // [0, 3, 4, 4.5]
  createdAt: string;
  updatedAt: string;
}

// Simulation d'une base de données (objet global avec des "tables") - Prêt pour API backend
const mockDatabase = {
  artists: [
    {
      id: 1,
      name: "DJ Elektra",
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      genres: [1, 2, 3], // IDs des genres
      locationId: 1, // ID de Paris
      experience: 7,
      fee: 120000,
      bio: "DJ Elektra crée des sets électrisants qui font vibrer les foules. Spécialiste de la house et de la techno, elle a joué dans les meilleurs clubs d'Europe.",
      specialties: ["Live Mixing", "Crowd Engagement"],
      socialFollowers: 45000,
      availability: true,
      followers: 28500,
      featured: true,
      verified: true,
      performances: 210,
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=300&h=200&fit=crop", title: "Festival Électronique 2023" },
        { id: 2, image: "https://images.unsplash.com/photo-1571397133301-3f1b6ae86085?w=300&h=200&fit=crop", title: "Club Underground" }
      ],
      email: "djelektra@example.com",
      phone: "+33 6 12 34 56 78",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-11-01T14:30:00Z"
    },
    {
      id: 2,
      name: "Sax Master",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      genres: [4, 5, 6], // IDs des genres
      locationId: 2, // ID de Lyon
      experience: 12,
      fee: 95000,
      bio: "Saxophoniste virtuose avec plus de 12 ans d'expérience, créant une ambiance sophistiquée pour votre événement. Parfait pour les soirées jazz et lounge.",
      specialties: ["Improvisation", "Live Collaborations"],
      socialFollowers: 22000,
      availability: true,
      followers: 15600,
      featured: false,
      verified: true,
      performances: 340,
      portfolio: [
        { id: 3, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=200&fit=crop", title: "Jazz Club Melody" },
        { id: 4, image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=200&fit=crop", title: "Festival de Jazz" }
      ],
      email: "saxmaster@example.com",
      phone: "+33 6 23 45 67 89",
      website: "saxmaster.com",
      createdAt: "2025-01-02T09:15:00Z",
      updatedAt: "2025-10-28T16:45:00Z"
    },
    {
      id: 3,
      name: "Melodic Vibes",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      genres: [7, 8, 9], // IDs des genres
      locationId: 3, // ID de Marseille
      experience: 5,
      fee: 85000,
      bio: "Chanteuse à la voix envoûtante, parfaite pour créer une ambiance chaleureuse et émotionnelle. Son répertoire varié s'adapte à tous types d'événements.",
      specialties: ["Vocals", "Acoustic Guitar"],
      socialFollowers: 38000,
      availability: false,
      followers: 42300,
      featured: true,
      verified: true,
      performances: 180,
      portfolio: [
        { id: 5, image: "https://images.unsplash.com/photo-1460723237783-e82e7e6f2535?w=300&h=200&fit=crop", title: "Concert Live" },
        { id: 6, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop", title: "Soirée Acoustique" }
      ],
      email: "melodicvibes@example.com",
      phone: "+33 6 34 56 78 90",
      createdAt: "2025-01-03T11:20:00Z",
      updatedAt: "2025-05-15T18:00:00Z"
    },
    {
      id: 4,
      name: "Beat Collective",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      genres: [10, 11, 12], // IDs des genres
      locationId: 4, // ID de Nice
      experience: 6,
      fee: 110000,
      bio: "Groupe de trois DJ spécialistes des rythmes urbains. Leur énergie contagieuse et leur maîtrise des transitions sont parfaites pour les soirées endiablées.",
      specialties: ["Scratch", "Mashups"],
      socialFollowers: 62000,
      availability: true,
      followers: 54100,
      featured: false,
      verified: true,
      performances: 220,
      portfolio: [
        { id: 7, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=200&fit=crop", title: "Festival Urbain" },
        { id: 8, image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=300&h=200&fit=crop", title: "Club Night" }
      ],
      email: "beatcollective@example.com",
      phone: "+33 6 45 67 89 01",
      createdAt: "2025-01-04T13:45:00Z",
      updatedAt: "2025-11-04T12:10:00Z"
    },
    {
      id: 5,
      name: "Electric Strings",
      avatarUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      rating: 4.5,
      genres: [13, 14, 15], // IDs des genres
      locationId: 5, // ID de Bordeaux
      experience: 8,
      fee: 130000,
      bio: "Violoniste innovante fusionnant musique classique et électronique. Son approche unique crée une expérience sonore inoubliable pour des événements sophistiqués.",
      specialties: ["Violin Loop", "Electronic Fusion"],
      socialFollowers: 29000,
      availability: true,
      followers: 18700,
      featured: false,
      verified: true,
      performances: 160,
      portfolio: [
        { id: 9, image: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=300&h=200&fit=crop", title: "Fusion Électronique" },
        { id: 10, image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=300&h=200&fit=crop", title: "Concert Privé" }
      ],
      email: "electricstrings@example.com",
      phone: "+33 6 56 78 90 12",
      website: "electricstrings.com",
      createdAt: "2025-01-05T15:00:00Z",
      updatedAt: "2025-10-20T09:30:00Z"
    }
  ] as Artist[],

  invitations: [
    {
      id: 1,
      artistId: 1,
      eventName: "Summer Night Party",
      date: "15 juillet 2025",
      budget: 120000,
      status: 'accepted',
      message: "Nous aimerions vous inviter pour notre grande soirée d'été...",
      sentDate: "2025-01-10",
      responseDate: "2025-01-12",
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2025-01-12T14:00:00Z"
    },
    {
      id: 2,
      artistId: 2,
      eventName: "Jazz & Cocktails Night",
      date: "5 juin 2025",
      budget: 95000,
      status: 'pending',
      message: "Votre style jazz serait parfait pour notre soirée lounge...",
      sentDate: "2025-01-15",
      createdAt: "2025-01-15T11:30:00Z",
      updatedAt: "2025-01-15T11:30:00Z"
    },
    {
      id: 3,
      artistId: 3,
      eventName: "Techno Revolution",
      date: "10 avril 2025",
      budget: 85000,
      status: 'declined',
      message: "Nous organisons une soirée techno et pensons que vous seriez parfaite...",
      sentDate: "2025-01-08",
      responseDate: "2025-01-09",
      createdAt: "2025-01-08T09:45:00Z",
      updatedAt: "2025-01-09T16:20:00Z"
    },
    {
      id: 4,
      artistId: 4,
      eventName: "Urban Beats Festival",
      date: "22 août 2025",
      budget: 110000,
      status: 'accepted',
      message: "Votre énergie serait idéale pour notre festival urbain...",
      sentDate: "2025-01-12",
      responseDate: "2025-01-14",
      createdAt: "2025-01-12T13:15:00Z",
      updatedAt: "2025-01-14T10:45:00Z"
    }
  ] as Invitation[],

  // Nouvelles tables extraites des hardcodés
  locations: [
    { id: 1, name: "Paris", description: "Capitale française, scène musicale vibrante", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 2, name: "Lyon", description: "Ville des lumières, clubs jazz renommés", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 3, name: "Marseille", description: "Port méditerranéen, vibes pop et R&B", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 4, name: "Nice", description: "Côte d'Azur, hip-hop urbain", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 5, name: "Bordeaux", description: "Sud-ouest, fusion classique-électro", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" }
  ] as Location[],

  genres: [
    { id: 1, name: "House", description: "Musique électronique rythmée", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 2, name: "Techno", description: "Rythmes minimalistes et intenses", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 3, name: "EDM", description: "Électronique dance music", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 4, name: "Jazz", description: "Improvisation sophistiquée", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 5, name: "Funk", description: "Groove rythmé et énergique", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 6, name: "Soul", description: "Émotion vocale profonde", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 7, name: "Pop", description: "Hits mainstream accessibles", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 8, name: "R&B", description: "Rythmes et blues contemporains", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 9, name: "Acoustic", description: "Sonorités naturelles et intimes", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 10, name: "Hip-Hop", description: "Culture rap et beats urbains", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 11, name: "Trap", description: "Basses lourdes et hi-hats rapides", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 12, name: "Reggaeton", description: "Rythmes latinos dansants", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 13, name: "Classical", description: "Répertoire orchestral traditionnel", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 14, name: "Electronic", description: "Synthés et beats modernes", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    { id: 15, name: "Fusion", description: "Mélange de styles hybrides", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" }
  ] as Genre[],

  // Config métier (ex: pour filtres, venant d'un endpoint /api/config)
  config: [
    { 
      id: 1, 
      priceMin: 0, 
      priceMax: 200000, 
      defaultRange: [50000, 150000] as [number, number], 
      step: 5000, 
      ratingsThresholds: [0, 3, 4, 4.5], 
      createdAt: "2025-01-01T00:00:00Z", 
      updatedAt: "2025-01-01T00:00:00Z" 
    }
  ] as Config[]
};

// Fonctions utilitaires pour "requêter" la DB mock (prêtes pour API)
const getArtistById = (id: number): Artist | undefined => mockDatabase.artists.find(a => a.id === id);
const getArtists = (): Artist[] => mockDatabase.artists;
const getInvitationsByArtistId = (artistId: number): Invitation[] => mockDatabase.invitations.filter(inv => inv.artistId === artistId);
const getAllInvitations = (): Invitation[] => mockDatabase.invitations;

// Nouvelles queries
const getLocations = (): Location[] => mockDatabase.locations;
const getGenres = (): Genre[] => mockDatabase.genres;
const getConfig = (): Config | undefined => mockDatabase.config[0];

// Helpers pour résoudre les relations (ex: genre names depuis IDs)
const getGenreNamesByIds = (genreIds: number[]): string[] => {
  const genres = getGenres();
  return genreIds.map(id => genres.find(g => g.id === id)?.name || '');
};
const getLocationNameById = (locationId: number): string => {
  const loc = getLocations().find(l => l.id === locationId);
  return loc?.name || '';
};

// Formatage monétaire
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-MG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' Ar';
};

const FindArtistsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const config = getConfig();
  const [priceRange, setPriceRange] = useState(config?.defaultRange || [50000, 150000]);
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState('all');
  const [savedArtists, setSavedArtists] = useState<number[]>([]);
  const [artists] = useState<Artist[]>(getArtists()); // Chargement initial depuis la "DB"
  const [invitations] = useState<Invitation[]>(getAllInvitations()); // Chargement initial depuis la "DB"
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isArtistDetailModalOpen, setIsArtistDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  const [inviteData, setInviteData] = useState({
    eventName: '',
    date: '',
    budget: '',
    message: ''
  });

  // Récupération des données BD pour utilisation (simule useQuery)
  const locations = getLocations();
  const genres = getGenres();

  // Gestion des invitations (simule insertion DB)
  const handleInviteArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setInviteData({
      eventName: '',
      date: '',
      budget: artist.fee.toString(),
      message: `Bonjour ${artist.name}, nous souhaiterions vous inviter à performer lors de notre événement. Votre style ${getGenreNamesByIds(artist.genres)[0]} serait parfait pour notre public.`
    });
    setIsInviteModalOpen(true);
  };

  const sendInvitation = () => {
    if (!selectedArtist || !inviteData.eventName || !inviteData.date || !inviteData.budget || !inviteData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const budgetNum = parseInt(inviteData.budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      toast({
        title: "Erreur",
        description: "Le budget doit être un nombre positif valide",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const newInvitationId = Math.max(...mockDatabase.invitations.map(inv => inv.id), 0) + 1;
    const newInvitation: Invitation = {
      id: newInvitationId,
      artistId: selectedArtist.id,
      eventName: inviteData.eventName,
      date: inviteData.date,
      budget: budgetNum,
      status: 'pending',
      message: inviteData.message,
      sentDate: now.split('T')[0], // Format YYYY-MM-DD
      createdAt: now,
      updatedAt: now
    };

    mockDatabase.invitations.push(newInvitation);
    
    toast({
      title: "📨 Invitation envoyée !",
      description: `Votre invitation a été envoyée à ${selectedArtist.name}`,
    });
    
    setIsInviteModalOpen(false);
    setInviteData({
      eventName: '',
      date: '',
      budget: '',
      message: ''
    });
  };

  // Gestion des favoris (local, non DB pour cet exemple)
  const toggleSaveArtist = (id: number) => {
    if (savedArtists.includes(id)) {
      setSavedArtists(savedArtists.filter(artistId => artistId !== id));
      toast({
        title: "Artiste retiré des favoris",
        description: "L'artiste a été retiré de votre liste de favoris",
      });
    } else {
      setSavedArtists([...savedArtists, id]);
      toast({
        title: "⭐ Artiste ajouté aux favoris",
        description: "L'artiste a été ajouté à votre liste de favoris",
      });
    }
  };

  // Voir les détails d'un artiste
  const viewArtistDetails = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsArtistDetailModalOpen(true);
  };

  // Obtenir les invitations pour un artiste (via query)
  const getArtistInvitations = (artistId: number) => {
    return getInvitationsByArtistId(artistId);
  };

  // Statut des invitations
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Acceptée</Badge>;
      case 'declined':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Refusée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-gray-500 text-gray-500"><XCircle className="h-3 w-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge variant="secondary"><Clock4 className="h-3 w-3 mr-1" />En attente</Badge>;
    }
  };

  // Filtrer les artistes selon les critères (utilise getArtists() + relations résolues)
  const filteredArtists = getArtists().filter(artist => {
    const genreNames = getGenreNamesByIds(artist.genres);
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artist.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          genreNames.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGenre = genreFilter === 'all' || artist.genres.map(id => getGenres().find(g => g.id === id)?.name).includes(genreFilter);
    const matchesPrice = artist.fee >= priceRange[0] && artist.fee <= priceRange[1];
    const matchesAvailability = !availabilityFilter || artist.availability;
    const matchesRating = artist.rating >= ratingFilter;
    const matchesLocation = locationFilter === 'all' || artist.locationId === parseInt(locationFilter);
    
    return matchesSearch && matchesGenre && matchesPrice && 
           matchesAvailability && matchesRating && matchesLocation;
  });

  // Genres disponibles (via query)
  const availableGenres = getGenres().map(g => g.name);

  // Statistiques (via queries)
  const totalInvitations = getAllInvitations().length;
  const acceptedInvitations = getAllInvitations().filter(inv => inv.status === 'accepted').length;
  const pendingInvitations = getAllInvitations().filter(inv => inv.status === 'pending').length;

  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Rechercher des artistes</h1>
            <p className="text-lg text-muted-foreground mt-1">Trouvez des talents pour vos événements</p>
          </div>
          
          <div className="flex mt-4 lg:mt-0 space-x-2">
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              {savedArtists.length} favoris
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('invitations')}>
              <Mail className="h-4 w-4 mr-2" />
              Mes invitations ({pendingInvitations})
            </Button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Rechercher des artistes
            </TabsTrigger>
            <TabsTrigger value="invitations">
              <FileText className="h-4 w-4 mr-2" />
              Mes invitations ({totalInvitations})
            </TabsTrigger>
          </TabsList>

          {/* Onglet Recherche */}
          <TabsContent value="search" className="space-y-6">
            {/* Barre de recherche principale */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10 py-6"
                placeholder="Rechercher par nom, genre ou compétences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Button 
                className="absolute right-1 top-1/2 -translate-y-1/2"
                variant="ghost"
                onClick={() => setSearchQuery('')}
              >
                {searchQuery && 'Effacer'}
              </Button>
            </div>
            
            {/* Filtres avancés */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
                  <CardTitle>Filtres avancés</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="genre">Genre musical</Label>
                    <Select value={genreFilter} onValueChange={setGenreFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Tous les genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les genres</SelectItem>
                        {genres.map(genre => (
                          <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Toutes les villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        {locations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="rating">Note minimale</Label>
                    <Select value={ratingFilter.toString()} onValueChange={(val) => setRatingFilter(Number(val))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Toutes les notes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Toutes les notes</SelectItem>
                        {config?.ratingsThresholds.map(threshold => (
                          <SelectItem key={threshold} value={threshold.toString()}>{threshold}+ étoiles</SelectItem>
                        )) || null}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Fourchette de prix</Label>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                      </span>
                    </div>
                    <Slider
                      defaultValue={config?.defaultRange || [50000, 150000]}
                      max={config?.priceMax || 200000}
                      min={config?.priceMin || 0}
                      step={config?.step || 5000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="available" 
                      checked={availabilityFilter}
                      onCheckedChange={setAvailabilityFilter}
                    />
                    <Label htmlFor="available" className="cursor-pointer">Disponibles uniquement</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Résultats de recherche */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {filteredArtists.length} {filteredArtists.length > 1 ? 'artistes' : 'artiste'} trouvé{filteredArtists.length > 1 ? 's' : ''}
              </h2>
              
              <Select defaultValue="rating">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note (décroissante)</SelectItem>
                  <SelectItem value="price_low">Prix (croissant)</SelectItem>
                  <SelectItem value="price_high">Prix (décroissant)</SelectItem>
                  <SelectItem value="experience">Expérience</SelectItem>
                  <SelectItem value="popularity">Popularité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredArtists.length > 0 ? (
                filteredArtists.map(artist => {
                  const genreNames = getGenreNamesByIds(artist.genres);
                  const locationName = getLocationNameById(artist.locationId);
                  return (
                    <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex flex-col items-center justify-center">
                          <div className="relative">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-lg">
                              <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                                {artist.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {artist.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                                <Award className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <h3 className="text-lg font-bold">{artist.name}</h3>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="ml-1">{artist.rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground ml-1">({artist.performances})</span>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {locationName}
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2 w-full">
                            <Button 
                              className="w-full" 
                              variant="default"
                              onClick={() => handleInviteArtist(artist)}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Inviter
                            </Button>
                            <div className="flex space-x-2">
                              <Button 
                                className="flex-1" 
                                variant={savedArtists.includes(artist.id) ? "secondary" : "outline"}
                                onClick={() => toggleSaveArtist(artist.id)}
                              >
                                <Bookmark className={`h-4 w-4 ${savedArtists.includes(artist.id) ? "fill-current" : ""}`} />
                              </Button>
                              <Button 
                                className="flex-1" 
                                variant="outline"
                                onClick={() => viewArtistDetails(artist)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 p-6">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {genreNames.map(genreName => (
                              <Badge key={genreName} variant="secondary" className="bg-blue-100 text-blue-800">
                                <Music className="h-3 w-3 mr-1" />
                                {genreName}
                              </Badge>
                            ))}
                            {artist.featured && (
                              <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                                <Flame className="h-3 w-3 mr-1" />
                                Tendance
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{artist.bio}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Cachet</div>
                              <div className="font-semibold text-green-600">{formatCurrency(artist.fee)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Expérience</div>
                              <div className="font-semibold">{artist.experience} ans</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Spécialités</div>
                              <div className="font-semibold text-sm">{artist.specialties.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Disponibilité</div>
                              <div className={`font-semibold ${artist.availability ? 'text-green-600' : 'text-red-600'}`}>
                                {artist.availability ? 'Disponible' : 'Non disponible'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Invitations existantes pour cet artiste (via query) */}
                          {getArtistInvitations(artist.id).length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-medium text-blue-800 mb-2">
                                Invitations envoyées à cet artiste
                              </div>
                              <div className="space-y-2">
                                {getArtistInvitations(artist.id).map(invitation => (
                                  <div key={invitation.id} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{invitation.eventName}</span>
                                    {getStatusBadge(invitation.status)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-12">
                  <div className="text-muted-foreground mb-2">Aucun artiste ne correspond à vos critères de recherche</div>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setGenreFilter('all');
                    setPriceRange(config?.defaultRange || [50000, 150000]);
                    setAvailabilityFilter(false);
                    setRatingFilter(0);
                    setLocationFilter('all');
                  }}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Onglet Invitations (utilise getAllInvitations()) */}
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Mes invitations aux artistes</CardTitle>
                <CardDescription>
                  Suivez l'état de vos invitations envoyées aux artistes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getAllInvitations().length > 0 ? (
                  <div className="space-y-4">
                    {getAllInvitations().map(invitation => {
                      const artist = getArtistById(invitation.artistId);
                      return (
                        <Card key={invitation.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={artist?.avatarUrl} alt={artist?.name} />
                                <AvatarFallback>{artist?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold">{artist?.name}</h4>
                                  {getStatusBadge(invitation.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Événement:</strong> {invitation.eventName} • {invitation.date}
                                </p>
                                <p className="text-sm">
                                  <strong>Budget proposé:</strong> {formatCurrency(invitation.budget)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  <strong>Envoyée le:</strong> {new Date(invitation.sentDate).toLocaleDateString('fr-FR')}
                                  {invitation.responseDate && (
                                    <span> • <strong>Réponse le:</strong> {new Date(invitation.responseDate).toLocaleDateString('fr-FR')}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => artist && viewArtistDetails(artist)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune invitation</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore envoyé d'invitations aux artistes
                    </p>
                    <Button onClick={() => setActiveTab('search')}>
                      Rechercher des artistes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modale de détails d'artiste (utilise queries) */}
      <Dialog open={isArtistDetailModalOpen} onOpenChange={setIsArtistDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'artiste</DialogTitle>
            <DialogDescription>
              Informations complètes sur {selectedArtist?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedArtist && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={selectedArtist.avatarUrl} alt={selectedArtist.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                    {selectedArtist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedArtist.name}</h2>
                    {selectedArtist.verified && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        <Award className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {selectedArtist.rating.toFixed(1)} ({selectedArtist.performances} performances)
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {getLocationNameById(selectedArtist.locationId)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {selectedArtist.followers.toLocaleString()} followers
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getGenreNamesByIds(selectedArtist.genres).map(genreName => (
                      <Badge key={genreName} variant="secondary" className="bg-blue-100 text-blue-800">
                        <Music className="h-3 w-3 mr-1" />
                        {genreName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Expérience</Label>
                      <div className="font-medium">{selectedArtist.experience} ans</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Cachet</Label>
                      <div className="font-medium text-green-600">{formatCurrency(selectedArtist.fee)}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Spécialités</Label>
                      <div className="font-medium">{selectedArtist.specialties.join(', ')}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Disponibilité</Label>
                      <div className={`font-medium ${selectedArtist.availability ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedArtist.availability ? 'Disponible' : 'Non disponible'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <div className="font-medium">{selectedArtist.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Téléphone</Label>
                      <div className="font-medium">{selectedArtist.phone}</div>
                    </div>
                    {selectedArtist.website && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Site web</Label>
                        <div className="font-medium text-blue-600 hover:underline cursor-pointer">
                          {selectedArtist.website}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Biographie</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedArtist.bio}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedArtist.portfolio.map((item) => (
                    <div key={item.id} className="rounded-lg overflow-hidden border">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-3 bg-muted">
                        <div className="font-medium">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Invitations pour cet artiste (via query) */}
              {getArtistInvitations(selectedArtist.id).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Invitations envoyées</h3>
                  <div className="space-y-3">
                    {getArtistInvitations(selectedArtist.id).map(invitation => (
                      <Card key={invitation.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{invitation.eventName}</div>
                            <div className="text-sm text-muted-foreground">
                              {invitation.date} • {formatCurrency(invitation.budget)}
                            </div>
                          </div>
                          {getStatusBadge(invitation.status)}
                        </div>
                        {invitation.message && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            "{invitation.message}"
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArtistDetailModalOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => handleInviteArtist(selectedArtist!)}>
              <Mail className="h-4 w-4 mr-2" />
              Inviter cet artiste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'invitation */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inviter {selectedArtist?.name}</DialogTitle>
            <DialogDescription>
              Envoyez une invitation à cet artiste pour votre événement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nom de l'événement *</Label>
              <Input
                id="event-name"
                placeholder="Soirée Summer Vibes 2025"
                value={inviteData.eventName}
                onChange={(e) => setInviteData({...inviteData, eventName: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date de l'événement *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={inviteData.date}
                  onChange={(e) => setInviteData({...inviteData, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-budget">Budget proposé (Ar) *</Label>
                <Input
                  id="event-budget"
                  type="number"
                  value={inviteData.budget}
                  onChange={(e) => setInviteData({...inviteData, budget: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-message">Message personnalisé *</Label>
              <textarea
                id="event-message"
                rows={4}
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={inviteData.message}
                onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Annuler</Button>
            <Button onClick={sendInvitation}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
};

export default FindArtistsPage;