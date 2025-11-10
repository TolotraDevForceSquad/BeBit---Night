// D:\Projet\BeBit\bebit - new\client\src\pages\club\attendees-page.tsx
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

// Interfaces pour les entités (structurées comme des tables de base de données)
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
  preferredEvents: number[]; // Référence aux IDs d'événements
  memberSince: string;
  status: string;
  tags: number[]; // Référence aux IDs de tags
  birthday: string;
  address: string;
  loyaltyPoints: number;
  preferences: {
    music: number[]; // Référence aux IDs de genres
    drinks: number[]; // Référence aux IDs de types de boissons
    locationId: number; // Référence à l'ID de lieu
  };
  feedback: {
    rating: number;
    reviews: number;
    lastFeedback: string;
  };
  segments: number[]; // Référence aux IDs de segments
  createdAt: string;
  updatedAt: string;
}

// Interfaces existantes conservées
interface MusicGenre {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface DrinkType {
  id: number;
  name: string;
  category: 'alcoholic' | 'non-alcoholic';
  createdAt: string;
  updatedAt: string;
}

interface Location {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerTag {
  id: number;
  name: string;
  type: 'tag' | 'segment';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface VisitTrend {
  id: number;
  day: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

interface DemographicGroup {
  id: number;
  label: string;
  percentage: number;
  type: 'age' | 'gender';
  createdAt: string;
  updatedAt: string;
}

interface SpendingCategory {
  id: number;
  category: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface RetentionRate {
  id: number;
  type: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

interface TopEvent {
  id: number;
  name: string;
  attendance: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Nouvelles interfaces pour les données extraites du JSX
interface RevenueTrend {
  id: number;
  percentage: number;
  comparisonPeriod: string; // ex: "par rapport au mois précédent"
  direction: 'up' | 'down'; // pour icônes
  createdAt: string;
  updatedAt: string;
}

interface RatingDistribution {
  id: number;
  stars: number; // 1 à 5
  percentage: number;
  colorClass: string; // ex: "bg-amber-500" pour UI
  createdAt: string;
  updatedAt: string;
}

interface CustomerFeedback {
  id: number;
  attendeeId: number; // Lien vers Attendee
  rating: number;
  comment: string;
  eventName?: string; // ex: "DJ Night"
  relativeDate: string; // ex: "Il y a 2 jours"
  createdAt: string;
  updatedAt: string;
}

interface ImprovementArea {
  id: number;
  title: string;
  description: string;
  percentage: number;
  priority: 'high' | 'medium' | 'low'; // Pour couleur icône
  colorClass: string; // ex: "text-red-500"
  createdAt: string;
  updatedAt: string;
}

interface ImprovementSuggestion {
  id: number;
  text: string;
  areaId: number; // Lien vers ImprovementArea
  createdAt: string;
  updatedAt: string;
}

// Simulation d'une base de données (objet global avec des "tables") - Prêt pour API backend
const mockDatabase = {
  attendees: [
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
      preferredEvents: [1, 2], // IDs d'événements
      memberSince: "2022-10-15",
      status: "active",
      tags: [1, 2, 3], // IDs de tags
      birthday: "1995-08-12",
      address: "Antananarivo, Quartier Isoraka",
      loyaltyPoints: 850,
      preferences: {
        music: [1, 2, 3], // IDs de genres Electronic, House, Techno
        drinks: [1, 2], // IDs Cocktails, Champagne
        locationId: 1 // Terrasse
      },
      feedback: {
        rating: 4.8,
        reviews: 7,
        lastFeedback: "Soirée incroyable, j'adore l'ambiance! Les cocktails étaient parfaits."
      },
      segments: [1, 2, 3], // High Value, Frequent, Trendsetter
      createdAt: "2022-10-15T10:00:00Z",
      updatedAt: "2023-11-06T14:30:00Z"
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
      preferredEvents: [3, 4], // Live Music, Jazz
      memberSince: "2022-11-20",
      status: "active",
      tags: [4, 5], // Regular, Table Reservation
      birthday: "1990-04-22",
      address: "Antananarivo, Quartier Analakely",
      loyaltyPoints: 620,
      preferences: {
        music: [4, 5, 6], // Jazz, Live, Soul
        drinks: [3, 4], // Whisky, Craft Beer
        locationId: 2 // VIP Area
      },
      feedback: {
        rating: 4.5,
        reviews: 4,
        lastFeedback: "J'apprécie l'ambiance jazz des jeudis soir. Service impeccable."
      },
      segments: [4, 5, 6], // Medium Value, Regular, Enthusiast
      createdAt: "2022-11-20T09:15:00Z",
      updatedAt: "2023-11-06T16:45:00Z"
    },
    // ... (autres attendees inchangés pour brevité, ajoute-les si besoin)
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
      preferredEvents: [7, 8],
      memberSince: "2023-01-10",
      status: "active",
      tags: [7, 8], // New, Weekend
      birthday: "1998-12-05",
      address: "Antananarivo, Quartier Ivandry",
      loyaltyPoints: 310,
      preferences: {
        music: [9, 10, 11], // R&B, Hip-Hop, Afrobeats
        drinks: [1, 9], // Cocktails, Wine
        locationId: 3 // Dance Floor
      },
      feedback: {
        rating: 4.2,
        reviews: 2,
        lastFeedback: "Bonne ambiance, mais l'attente au bar était un peu longue."
      },
      segments: [4, 7, 8], // Medium Value, Growing, Social
      createdAt: "2023-01-10T11:20:00Z",
      updatedAt: "2023-11-06T18:00:00Z"
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
      preferredEvents: [1, 2],
      memberSince: "2022-08-05",
      status: "active",
      tags: [1, 2, 3],
      birthday: "1988-06-30",
      address: "Antananarivo, Quartier Tana Waterfront",
      loyaltyPoints: 980,
      preferences: {
        music: [2, 3, 12], // House, EDM, Progressive
        drinks: [10, 1], // Premium Spirits, Cocktails
        locationId: 2
      },
      feedback: {
        rating: 4.9,
        reviews: 9,
        lastFeedback: "Le meilleur club de la ville! Les DJ sont toujours excellents."
      },
      segments: [1, 2, 9], // High Value, Frequent, Promoter
      createdAt: "2022-08-05T13:45:00Z",
      updatedAt: "2023-11-06T12:10:00Z"
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
      preferredEvents: [7, 13],
      memberSince: "2023-03-12",
      status: "inactive",
      tags: [7, 10], // New, Occasional
      birthday: "1997-02-18",
      address: "Antananarivo, Quartier Ankorondrano",
      loyaltyPoints: 180,
      preferences: {
        music: [13, 14, 15], // Pop, Commercial, Latin
        drinks: [9, 11], // Wine, Soft Drinks
        locationId: 4 // Bar Area
      },
      feedback: {
        rating: 3.8,
        reviews: 1,
        lastFeedback: "Ambiance sympa, mais un peu trop bruyant pour discuter."
      },
      segments: [10, 11, 12], // Low Value, Occasional, Potential
      createdAt: "2023-03-12T15:00:00Z",
      updatedAt: "2023-11-06T09:30:00Z"
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
      preferredEvents: [1, 16],
      memberSince: "2022-09-28",
      status: "active",
      tags: [4, 5],
      birthday: "1992-11-14",
      address: "Antananarivo, Quartier Ambanidia",
      loyaltyPoints: 750,
      preferences: {
        music: [16, 17, 18], // Techno, Minimal, Underground
        drinks: [4, 12], // Beer, Spirits
        locationId: 5 // Main Floor
      },
      feedback: {
        rating: 4.6,
        reviews: 5,
        lastFeedback: "Les soirées techno sont exceptionnelles. Continuez comme ça!"
      },
      segments: [1, 4, 6], // High Value, Regular, Enthusiast
      createdAt: "2022-09-28T16:00:00Z",
      updatedAt: "2023-11-06T17:45:00Z"
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
      preferredEvents: [7, 19],
      memberSince: "2022-12-15",
      status: "active",
      tags: [4, 13], // Regular, Social Media
      birthday: "1994-09-25",
      address: "Antananarivo, Quartier Andraharo",
      loyaltyPoints: 450,
      preferences: {
        music: [19, 20, 10], // RnB, Afrobeats, Hip-Hop
        drinks: [1, 10], // Cocktails, Premium Spirits
        locationId: 6 // Lounge Area
      },
      feedback: {
        rating: 4.4,
        reviews: 3,
        lastFeedback: "J'adore la sélection musicale et l'ambiance générale!"
      },
      segments: [4, 7, 14], // Medium Value, Growing, Influencer
      createdAt: "2022-12-15T17:15:00Z",
      updatedAt: "2023-11-06T19:00:00Z"
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
      preferredEvents: [3, 21],
      memberSince: "2023-03-05",
      status: "inactive",
      tags: [7, 10],
      birthday: "1985-07-11",
      address: "Antananarivo, Quartier Behoririka",
      loyaltyPoints: 150,
      preferences: {
        music: [21, 4, 22], // Blues, Jazz, Rock
        drinks: [3, 4], // Whisky, Craft Beer
        locationId: 7 // Quiet Area
      },
      feedback: {
        rating: 4.0,
        reviews: 1,
        lastFeedback: "Bonne soirée blues, mais les prix sont un peu élevés."
      },
      segments: [10, 11, 15], // Low Value, Occasional, Niche
      createdAt: "2023-03-05T18:45:00Z",
      updatedAt: "2023-11-06T20:15:00Z"
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
      preferredEvents: [7, 2],
      memberSince: "2022-11-10",
      status: "active",
      tags: [4, 2],
      birthday: "1993-03-19",
      address: "Antananarivo, Quartier Ambohimanarina",
      loyaltyPoints: 580,
      preferences: {
        music: [2, 23, 5], // House, Disco, Funk
        drinks: [13, 1], // Champagne, Cocktails
        locationId: 2
      },
      feedback: {
        rating: 4.7,
        reviews: 4,
        lastFeedback: "Service VIP exceptionnel, toujours une expérience parfaite!"
      },
      segments: [1, 4, 8], // High Value, Regular, Social
      createdAt: "2022-11-10T19:20:00Z",
      updatedAt: "2023-11-06T21:45:00Z"
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
      preferredEvents: [1, 24],
      memberSince: "2023-01-25",
      status: "active",
      tags: [7, 8],
      birthday: "1996-05-07",
      address: "Antananarivo, Quartier Ampandrana",
      loyaltyPoints: 280,
      preferences: {
        music: [24, 25, 12], // Afrobeats, Dancehall, Reggaeton
        drinks: [4, 26], // Beer, Rum
        locationId: 3
      },
      feedback: {
        rating: 4.3,
        reviews: 2,
        lastFeedback: "Super ambiance et bonne sélection musicale!"
      },
      segments: [4, 7, 16], // Medium Value, Growing, Explorer
      createdAt: "2023-01-25T20:50:00Z",
      updatedAt: "2023-11-06T22:15:00Z"
    }
  ] as Attendee[],

  // Tables existantes conservées (musicGenres, drinkTypes, locations, customerTags inchangées pour brevité)
  musicGenres: [
    { id: 1, name: "Electronic", description: "Musique électronique moderne", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    // ... (autres genres inchangés)
  ] as MusicGenre[],

  drinkTypes: [
    { id: 1, name: "Cocktails", category: "alcoholic" as const, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    // ... (autres types inchangés)
  ] as DrinkType[],

  locations: [
    { id: 1, name: "Terrasse", description: "Zone extérieure ouverte", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    // ... (autres locations inchangées)
  ] as Location[],

  customerTags: [
    { id: 1, name: "VIP", type: "tag" as const, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
    // ... (autres tags inchangés)
  ] as CustomerTag[],

  trends: {
    visitTrends: [
      { id: 1, day: "Lun", count: 120, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
      // ... (autres trends inchangés)
    ] as VisitTrend[],
    demographics: [
      { id: 1, label: "18-24", percentage: 35, type: "age" as const, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
      // ... (autres demographics inchangés)
    ] as DemographicGroup[],
    spendingCategories: [
      { id: 1, category: "Entrées", amount: 850000, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
      // ... (autres spending inchangés)
    ] as SpendingCategory[],
    retentionRates: [
      { id: 1, type: "oneTime", percentage: 35, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
      // ... (autres retention inchangés)
    ] as RetentionRate[],
    topEvents: [
      { id: 1, name: "DJ International Night", attendance: 450, rating: 4.8, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
      // ... (autres topEvents inchangés)
    ] as TopEvent[]
  },

  // Nouvelles tables pour extraire les hardcodés JSX
  revenueTrends: [
    { id: 1, percentage: 20.1, comparisonPeriod: "par rapport au mois précédent", direction: "up" as const, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" }
  ] as RevenueTrend[],

  ratingDistributions: [
    { id: 1, stars: 5, percentage: 75, colorClass: "bg-amber-500", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 2, stars: 4, percentage: 15, colorClass: "bg-amber-400", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 3, stars: 3, percentage: 6, colorClass: "bg-amber-300", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 4, stars: 2, percentage: 3, colorClass: "bg-amber-200", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 5, stars: 1, percentage: 1, colorClass: "bg-amber-100", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" }
  ] as RatingDistribution[],

  customerFeedbacks: [
    { id: 1, attendeeId: 4, rating: 5, comment: "Ambiance incroyable, les DJs sont toujours excellents. Le service VIP est impeccable. Un peu d'attente au bar principal mais rien de dramatique.", eventName: "DJ Night", relativeDate: "Il y a 2 jours", createdAt: "2025-11-04T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 2, attendeeId: 3, rating: 4, comment: "J'ai adoré la soirée Afrobeats! Le DJ a mis une ambiance de folie. Seul bémol, c'était un peu bondé vers minuit.", eventName: "Weekend Party", relativeDate: "Il y a 5 jours", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" }
  ] as CustomerFeedback[],

  improvementAreas: [
    { id: 1, title: "Temps d'attente au bar", description: "Mentionné dans 42% des commentaires négatifs. Particulièrement problématique entre 23h-01h le weekend.", percentage: 42, priority: "high" as const, colorClass: "text-red-500", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 2, title: "Climatisation/Aération", description: "Mentionné dans 28% des commentaires négatifs. Principalement au niveau de la piste de danse centrale.", percentage: 28, priority: "medium" as const, colorClass: "text-amber-500", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 3, title: "Sélection des boissons", description: "Mentionné dans 15% des commentaires négatifs. Demande pour plus de cocktails sans alcool et options premium.", percentage: 15, priority: "medium" as const, colorClass: "text-amber-500", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" }
  ] as ImprovementArea[],

  improvementSuggestions: [
    { id: 1, text: "Ajouter 2 barmans supplémentaires les vendredis et samedis entre 22h et 2h", areaId: 1, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 2, text: "Améliorer le système de ventilation au niveau de la piste de danse", areaId: 2, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" },
    { id: 3, text: "Introduire une carte de cocktails sans alcool de qualité", areaId: 3, createdAt: "2025-11-01T00:00:00Z", updatedAt: "2025-11-06T00:00:00Z" }
  ] as ImprovementSuggestion[]
};

// Fonctions utilitaires pour "requêter" la DB mock (prêtes pour API)
const getAttendees = (): Attendee[] => mockDatabase.attendees;
const getTrends = () => mockDatabase.trends;
const getMusicGenres = (): MusicGenre[] => mockDatabase.musicGenres;
const getDrinkTypes = (): DrinkType[] => mockDatabase.drinkTypes;
const getLocations = (): Location[] => mockDatabase.locations;
const getCustomerTags = (): CustomerTag[] => mockDatabase.customerTags;

// Nouvelles queries pour les tables extraites
const getRevenueTrends = (): RevenueTrend[] => mockDatabase.revenueTrends;
const getRatingDistributions = (): RatingDistribution[] => mockDatabase.ratingDistributions;
const getCustomerFeedbacks = (): CustomerFeedback[] => mockDatabase.customerFeedbacks;
const getRecentFeedbacks = (limit: number = 2): CustomerFeedback[] => {
  // Simule un orderBy createdAt DESC
  return [...getCustomerFeedbacks()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
};
const getImprovementAreas = (): ImprovementArea[] => mockDatabase.improvementAreas;
const getImprovementSuggestions = (): ImprovementSuggestion[] => mockDatabase.improvementSuggestions;
const getSuggestionsByAreaId = (areaId: number): ImprovementSuggestion[] => getImprovementSuggestions().filter(s => s.areaId === areaId);

// Helpers pour résoudre les relations (existants + nouveaux)
const getGenreNamesByIds = (genreIds: number[]): string[] => {
  return getMusicGenres().filter(g => genreIds.includes(g.id)).map(g => g.name);
};
const getDrinkNamesByIds = (drinkIds: number[]): string[] => {
  return getDrinkTypes().filter(d => drinkIds.includes(d.id)).map(d => d.name);
};
const getLocationNameById = (locationId: number): string => {
  return getLocations().find(l => l.id === locationId)?.name || '';
};
const getTagNamesByIds = (tagIds: number[]): string[] => {
  return getCustomerTags().filter(t => tagIds.includes(t.id)).map(t => t.name);
};
const getSegmentNamesByIds = (segmentIds: number[]): string[] => {
  return getCustomerTags().filter(t => segmentIds.includes(t.id) && t.type === 'segment').map(t => t.name);
};
const getAttendeeNameById = (attendeeId: number): string => {
  return getAttendees().find(a => a.id === attendeeId)?.name || '';
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

const AttendeeCard: React.FC<{ attendee: Attendee }> = ({ attendee }) => {
  const genreNames = getGenreNamesByIds(attendee.preferences.music);
  const drinkNames = getDrinkNamesByIds(attendee.preferences.drinks);
  const locationName = getLocationNameById(attendee.preferences.locationId);
  const tagNames = getTagNamesByIds(attendee.tags);
  const segmentNames = getSegmentNamesByIds(attendee.segments);

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
              {genreNames.slice(0, 3).map((genre, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0.5 px-1.5">
                  {genre}
                </Badge>
              ))}
              {attendee.preferences.drinks.length > 0 && (
                <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                  {drinkNames[0]}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs py-0.5 px-1.5">
                {locationName}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col col-span-2 mt-1">
            <span className="text-muted-foreground text-xs">Segments</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {segmentNames.slice(0, 2).map((segment, index) => (
                <Badge key={index} variant="secondary" className="text-xs py-0.5 px-1.5">
                  {segment}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-muted-foreground text-xs">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {tagNames.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0.5 px-1.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Points fidélité</span>
            <span className="font-medium">{attendee.loyaltyPoints}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Membre depuis</span>
            <span className="text-xs">{new Date(attendee.memberSince).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Cake className="h-3 w-3" />
            <span>Anniversaire: {new Date(attendee.birthday).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs">{attendee.feedback.rating}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const AttendeesPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSegment, setFilterSegment] = useState("all");

  // Récupération des données BD pour utilisation (simule useQuery)
  const attendees = getAttendees();
  const trends = getTrends();
  const revenueTrends = getRevenueTrends();
  const ratingDistributions = getRatingDistributions();
  const recentFeedbacks = getRecentFeedbacks();
  const improvementAreas = getImprovementAreas();
  const improvementSuggestions = getImprovementSuggestions();

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || attendee.status === filterStatus;
    const segmentNames = getSegmentNamesByIds(attendee.segments);
    const matchesSegment = filterSegment === "all" || segmentNames.includes(filterSegment);
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const totalRevenue = attendees.reduce((sum, attendee) => sum + attendee.totalSpent, 0);
  const avgRating = attendees.reduce((sum, attendee) => sum + attendee.feedback.rating, 0) / attendees.length;
  const totalReviews = attendees.reduce((sum, attendee) => sum + attendee.feedback.reviews, 0);
  const highSpenders = attendees.filter(attendee => attendee.totalSpent > 200000).length;
  const activeMembers = attendees.filter(attendee => attendee.status === "active").length;
  const revenueTrend = revenueTrends[0]; // Premier (et seul pour l'instant)

  return (
    <ResponsiveLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des membres</h1>
            <p className="text-lg text-muted-foreground mt-1">Analysez et gérez vos clients fidèles</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    {`+${revenueTrend.percentage}% ${revenueTrend.comparisonPeriod}`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Basé sur {totalReviews} avis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Membres actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    {attendees.length} membres au total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gros dépensiers</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highSpenders}</div>
                  <p className="text-xs text-muted-foreground">
                    {`Clients > 200 000 Ar dépensés`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visites par jour de la semaine</CardTitle>
                  <CardDescription>Distribution hebdomadaire des visites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Graphique des visites par jour</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profil démographique</CardTitle>
                  <CardDescription>Âge et genre des visiteurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Répartition par âge</h3>
                      <div className="space-y-2">
                        {trends.demographics.filter(d => d.type === 'age').map((group, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm flex-1">{group.label}</span>
                            <span className="text-sm font-medium">{group.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Répartition par genre</h3>
                      <div className="flex items-center justify-between">
                        {trends.demographics.filter(d => d.type === 'gender').map((group, index) => (
                          <div key={index} className="text-center flex-1">
                            <div className="text-lg font-bold">{group.percentage}%</div>
                            <div className="text-xs text-muted-foreground">{group.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des revenus</CardTitle>
                <CardDescription>Sources de revenus par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    {trends.spendingCategories.map((category, index) => {
                      const total = trends.spendingCategories.reduce((acc, c) => acc + c.amount, 0);
                      const percentage = Math.round((category.amount / total) * 100);
                      const colors = ['#3b82f6', '#10b981', '#ec4899', '#f59e0b'];
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                            <span className="text-sm">{category.category}</span>
                          </div>
                          <div className="text-sm font-medium">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
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
                            <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={14} 
                                  className={`${star <= Math.floor(avgRating) ? "fill-amber-500 text-amber-500" : "fill-amber-300 text-amber-300"}`} 
                                />
                              ))}
                            </div>
                            <div className="text-xs mt-1 text-muted-foreground">{totalReviews} avis</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full space-y-2">
                        <h3 className="text-sm font-medium mb-1">Répartition des notes</h3>
                        
                        {ratingDistributions.map((dist, index) => (
                          <div key={dist.id} className="flex items-center gap-2">
                            <div className="w-8 text-xs text-right">{dist.stars} ★</div>
                            <div className={`flex-1 h-2 bg-muted rounded-full overflow-hidden`}>
                              <div className={`h-full ${dist.colorClass}`} style={{ width: `${dist.percentage}%` }}></div>
                            </div>
                            <div className="w-8 text-xs">{dist.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-3">Commentaires récents</h3>
                      <div className="space-y-4">
                        {recentFeedbacks.map((feedback) => {
                          const attendeeName = getAttendeeNameById(feedback.attendeeId);
                          return (
                            <div key={feedback.id} className="bg-muted/30 p-3 rounded-md">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={12} 
                                      className={`${star <= feedback.rating ? "fill-amber-500 text-amber-500" : "text-muted"}`} 
                                    />
                                  ))}
                                </div>
                                <div className="text-xs ml-2 text-muted-foreground">{feedback.relativeDate}</div>
                              </div>
                              <p className="text-sm">
                                "{feedback.comment}"
                              </p>
                              <div className="text-xs text-primary mt-1 font-medium">
                                {attendeeName} · {feedback.eventName}
                              </div>
                            </div>
                          );
                        })}
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
                    {improvementAreas.map((area) => (
                      <div key={area.id} className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={18} className={area.colorClass} />
                          <h3 className="font-medium">{area.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {area.description}
                        </p>
                        <div className="mt-2 flex items-center">
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${area.percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Suggestions d'amélioration</h3>
                      <ul className="text-sm space-y-2">
                        {improvementSuggestions.map((suggestion) => {
                          const area = improvementAreas.find(a => a.id === suggestion.areaId);
                          if (!area) return null;
                          return (
                            <li key={suggestion.id} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check size={12} className="text-green-600" />
                              </div>
                              <span>{suggestion.text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Membres - inchangé sauf filteredAttendees */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Rechercher un membre par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSegment} onValueChange={setFilterSegment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les segments</SelectItem>
                  {getCustomerTags().filter(tag => tag.type === 'segment').map(tag => (
                    <SelectItem key={tag.id} value={tag.name}>{tag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttendees.map((attendee) => (
                <AttendeeCard key={attendee.id} attendee={attendee} />
              ))}
            </div>

            {filteredAttendees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun membre trouvé</h3>
                <p className="text-muted-foreground mb-4">Essayez d'ajuster vos critères de recherche.</p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Insights - inchangé */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top événements</CardTitle>
                  <CardDescription>Événements les plus populaires</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trends.topEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users size={16} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.attendance} participants</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={12} 
                                className={`${star <= Math.floor(event.rating) ? "fill-amber-500 text-amber-500" : "text-muted"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{event.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fidélisation client</CardTitle>
                  <CardDescription>Répartition des fréquences de visite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-center">
                    {trends.retentionRates.map((rate, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <span className="text-sm">{rate.type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${rate.percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{rate.percentage}%</span>
                        </div>
                      </div>
                    ))}
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