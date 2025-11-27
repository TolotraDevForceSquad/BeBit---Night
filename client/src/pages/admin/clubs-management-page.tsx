import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Building, Search, Filter, MoreHorizontal, MapPin, 
  Calendar, Clock, Users, Music, ArrowUpDown, CheckCircle, 
  XCircle, Eye, Edit, Trash2, Star, X, Phone, Mail,
  Globe, AlertTriangle, BadgeCheck, BadgeX, History,
  Plus, ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import PartyLoader from "@/components/PartyLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Types pour les clubs
type Club = {
  id: number;
  name: string;
  logo?: string;
  coverImage?: string;
  description: string;
  address: string;
  city: string;
  location: { lat: number; lng: number };
  contactEmail: string;
  contactPhone: string;
  website?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  openingHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  capacity: number;
  amenities: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  status: "pending" | "active" | "suspended" | "verified";
  registrationDate: string;
  lastActive: string;
  verificationDate?: string;
  manager: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  hostedEvents: number;
  upcomingEvents: number;
  hasTableReservation: boolean;
  featuredUntil?: string;
  isFeatured: boolean;
};

// Types pour l'historique des activités
type ActivityLog = {
  id: number;
  clubId: number;
  timestamp: string;
  action: string;
  details?: string;
  performedBy: {
    id: number;
    name: string;
    role: string;
  };
};

// Type pour les commentaires d'administration
type AdminNote = {
  id: number;
  clubId: number;
  text: string;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
  };
};

export default function ClubsManagementPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isClubDetailsOpen, setIsClubDetailsOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedClub, setEditedClub] = useState<Club | null>(null);

  // Liste des villes
  const cities = ["Antananarivo", "Tamatave", "Majunga", "Diego Suarez", "Fianarantsoa", "Tuléar", "Antsirabe"];

  // Liste des aménagements
  const amenitiesList = [
    "Parking", "Climatisation", "Terrasse", "Accès handicapé", "Vestiaire", 
    "Fumoir", "Wi-Fi", "Vidéo-projection", "Effets spéciaux", "VIP", 
    "Service de sécurité", "Bar à cocktails"
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      // Données simulées pour les clubs
      const mockClubs: Club[] = [
        {
          id: 1,
          name: "Club Oxygen",
          logo: "https://images.unsplash.com/photo-1583244685026-d4ddf6338ba1?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=400&fit=crop",
          description: "Club tendance proposant DJ sets et soirées à thème dans une ambiance électro.",
          address: "45 Avenue de l'Indépendance",
          city: "Antananarivo",
          location: { lat: -18.8792, lng: 47.5079 },
          contactEmail: "contact@cluboxygen.mg",
          contactPhone: "+261 34 05 123 45",
          website: "https://cluboxygen.mg",
          socials: {
            facebook: "cluboxygenmg",
            instagram: "club_oxygen",
            twitter: "ClubOxygen"
          },
          openingHours: {
            monday: "Fermé",
            tuesday: "Fermé",
            wednesday: "19:00-02:00",
            thursday: "19:00-02:00",
            friday: "19:00-04:00",
            saturday: "19:00-05:00",
            sunday: "17:00-00:00"
          },
          capacity: 350,
          amenities: ["Climatisation", "VIP", "Service de sécurité", "Bar à cocktails"],
          photos: [
            "https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1581974206967-93856b25aa13?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1581974206963-7e0624932fbc?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1545128485-c400ce7b6892?w=300&h=200&fit=crop"
          ],
          rating: 4.7,
          reviewCount: 128,
          status: "verified",
          registrationDate: "2024-08-15T10:30:00",
          lastActive: "2025-05-07T22:15:32",
          verificationDate: "2024-09-01T14:45:10",
          manager: {
            id: 101,
            name: "Thomas Rakoto",
            email: "thomas.r@cluboxygen.mg",
            phone: "+261 33 05 678 90",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
          },
          hostedEvents: 87,
          upcomingEvents: 5,
          hasTableReservation: true,
          featuredUntil: "2025-08-31T23:59:59",
          isFeatured: true
        },
        {
          id: 2,
          name: "Club District",
          logo: "https://images.unsplash.com/photo-1602513142546-7226e3e609ff?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop",
          description: "Spécialisé dans les soirées hip-hop et RnB, le District est LE lieu incontournable pour les amateurs de musique urbaine.",
          address: "23 Rue du Commerce",
          city: "Antananarivo",
          location: { lat: -18.8991, lng: 47.5224 },
          contactEmail: "info@clubdistrict.mg",
          contactPhone: "+261 34 14 789 65",
          website: "https://clubdistrict.mg",
          socials: {
            facebook: "clubdistrictmg",
            instagram: "clubdistrict"
          },
          openingHours: {
            monday: "Fermé",
            tuesday: "Fermé",
            wednesday: "Fermé",
            thursday: "19:00-03:00",
            friday: "19:00-04:00",
            saturday: "19:00-05:00",
            sunday: "16:00-00:00"
          },
          capacity: 300,
          amenities: ["Parking", "Climatisation", "VIP", "Service de sécurité"],
          photos: [
            "https://images.unsplash.com/photo-1571204829887-3b8d69e23af5?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1571204808056-5dd123fd156f?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1576157336678-f7247c8a92a2?w=300&h=200&fit=crop"
          ],
          rating: 4.5,
          reviewCount: 93,
          status: "active",
          registrationDate: "2024-10-10T09:22:15",
          lastActive: "2025-05-06T23:45:11",
          manager: {
            id: 102,
            name: "Sarah Nomenjanahary",
            email: "sarah@clubdistrict.mg",
            phone: "+261 33 10 222 33",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
          },
          hostedEvents: 65,
          upcomingEvents: 3,
          hasTableReservation: true,
          isFeatured: false
        },
        {
          id: 3,
          name: "Le Lounge",
          logo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?w=800&h=400&fit=crop",
          description: "Bar lounge avec musique live et ambiance feutrée, idéal pour des soirées détente et jazz.",
          address: "78 Avenue des Arts",
          city: "Antananarivo",
          location: { lat: -18.9022, lng: 47.5335 },
          contactEmail: "reservations@lelounge.mg",
          contactPhone: "+261 34 50 555 55",
          socials: {
            facebook: "leloungemg",
            instagram: "le_lounge_tana"
          },
          openingHours: {
            monday: "18:00-00:00",
            tuesday: "18:00-00:00",
            wednesday: "18:00-00:00",
            thursday: "18:00-01:00",
            friday: "18:00-02:00",
            saturday: "18:00-02:00",
            sunday: "17:00-00:00"
          },
          capacity: 120,
          amenities: ["Climatisation", "Wi-Fi", "Service de sécurité", "Bar à cocktails"],
          photos: [
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1597075687490-c1f01ea37c4e?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=300&h=200&fit=crop"
          ],
          rating: 4.8,
          reviewCount: 72,
          status: "active",
          registrationDate: "2025-01-05T15:10:22",
          lastActive: "2025-05-07T21:30:45",
          manager: {
            id: 103,
            name: "Jean-Luc Razafy",
            email: "jeanluc@lelounge.mg",
            phone: "+261 33 22 789 01",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
          },
          hostedEvents: 40,
          upcomingEvents: 2,
          hasTableReservation: true,
          isFeatured: false
        },
        {
          id: 4,
          name: "Sky Bar",
          logo: "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1534232376-c2217f73ccbc?w=800&h=400&fit=crop",
          description: "Bar en terrasse avec vue panoramique sur la ville. Cocktails et musique lounge.",
          address: "120 Boulevard de l'Océan",
          city: "Tamatave",
          location: { lat: -18.1499, lng: 49.4028 },
          contactEmail: "contact@skybar.mg",
          contactPhone: "+261 34 33 444 55",
          website: "https://skybar.mg",
          socials: {
            facebook: "skybarmg",
            instagram: "skybar_madagascar"
          },
          openingHours: {
            monday: "17:00-00:00",
            tuesday: "17:00-00:00",
            wednesday: "17:00-00:00",
            thursday: "17:00-01:00",
            friday: "17:00-02:00",
            saturday: "17:00-02:00",
            sunday: "16:00-00:00"
          },
          capacity: 150,
          amenities: ["Terrasse", "Wi-Fi", "Bar à cocktails"],
          photos: [
            "https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1599483398303-6c1e89c2a2f1?w=300&h=200&fit=crop"
          ],
          rating: 4.6,
          reviewCount: 58,
          status: "verified",
          registrationDate: "2024-11-20T11:45:33",
          lastActive: "2025-05-08T19:30:11",
          verificationDate: "2024-12-15T10:20:45",
          manager: {
            id: 104,
            name: "Marie Anjara",
            email: "marie@skybar.mg",
            phone: "+261 33 44 987 65",
            avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop"
          },
          hostedEvents: 32,
          upcomingEvents: 2,
          hasTableReservation: true,
          featuredUntil: "2025-07-15T23:59:59",
          isFeatured: true
        },
        {
          id: 5,
          name: "Beach Club",
          logo: "https://images.unsplash.com/photo-1545115226-695ace51ef13?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1531574373289-ad0d66e59e43?w=800&h=400&fit=crop",
          description: "Club de plage ouvert en journée et soirée, organisant régulièrement des beach parties.",
          address: "Plage de Ramena",
          city: "Diego Suarez",
          location: { lat: -12.2463, lng: 49.3512 },
          contactEmail: "info@beachclub.mg",
          contactPhone: "+261 34 77 888 99",
          socials: {
            facebook: "beachclubmg",
            instagram: "beach_club_madagasikara"
          },
          openingHours: {
            monday: "10:00-22:00",
            tuesday: "10:00-22:00",
            wednesday: "10:00-22:00",
            thursday: "10:00-22:00",
            friday: "10:00-01:00",
            saturday: "10:00-03:00",
            sunday: "10:00-00:00"
          },
          capacity: 400,
          amenities: ["Parking", "Terrasse", "Bar à cocktails", "Effets spéciaux"],
          photos: [
            "https://images.unsplash.com/photo-1593320275562-fcbedb4bc572?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1531159811638-e2a856becf3f?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1529268209110-62be1d87fe75?w=300&h=200&fit=crop"
          ],
          rating: 4.3,
          reviewCount: 43,
          status: "suspended",
          registrationDate: "2025-02-01T08:30:12",
          lastActive: "2025-04-30T20:15:39",
          manager: {
            id: 105,
            name: "Olivier Randriamanana",
            email: "olivier@beachclub.mg",
            phone: "+261 33 55 123 45",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop"
          },
          hostedEvents: 22,
          upcomingEvents: 0,
          hasTableReservation: false,
          isFeatured: false
        },
        {
          id: 6,
          name: "Havana Club",
          logo: "https://images.unsplash.com/photo-1559023994-0483a1523ac1?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1614060384208-2b0c4be61a9b?w=800&h=400&fit=crop",
          description: "Club latino proposant des soirées salsa, bachata et reggaeton dans une ambiance festive.",
          address: "12 Rue des Flamboyants",
          city: "Tamatave",
          location: { lat: -18.1572, lng: 49.3950 },
          contactEmail: "contact@havanaclub.mg",
          contactPhone: "+261 34 66 777 88",
          socials: {
            facebook: "havanaclubmg",
            instagram: "havana_club_toamasina"
          },
          openingHours: {
            monday: "Fermé",
            tuesday: "Fermé",
            wednesday: "Fermé",
            thursday: "20:00-02:00",
            friday: "20:00-04:00",
            saturday: "20:00-04:00",
            sunday: "19:00-00:00"
          },
          capacity: 180,
          amenities: ["Climatisation", "Service de sécurité", "Bar à cocktails"],
          photos: [
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=300&h=200&fit=crop"
          ],
          rating: 4.4,
          reviewCount: 37,
          status: "pending",
          registrationDate: "2025-04-20T13:25:40",
          lastActive: "2025-05-01T10:10:10",
          manager: {
            id: 106,
            name: "Carmen Raveloson",
            email: "carmen@havanaclub.mg",
            phone: "+261 33 66 345 67",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
          },
          hostedEvents: 0,
          upcomingEvents: 0,
          hasTableReservation: false,
          isFeatured: false
        },
        {
          id: 7,
          name: "Jazz Corner",
          logo: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=100&h=100&fit=crop",
          coverImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=400&fit=crop",
          description: "Bar à jazz intimiste proposant des concerts live de jazz, soul et blues.",
          address: "45 Rue du 26 juin",
          city: "Antananarivo",
          location: { lat: -18.9105, lng: 47.5235 },
          contactEmail: "info@jazzcorner.mg",
          contactPhone: "+261 34 88 999 00",
          website: "https://jazzcorner.mg",
          socials: {
            facebook: "jazzcornermg",
            instagram: "jazz_corner_tana"
          },
          openingHours: {
            monday: "Fermé",
            tuesday: "19:00-00:00",
            wednesday: "19:00-00:00",
            thursday: "19:00-01:00",
            friday: "19:00-02:00",
            saturday: "19:00-02:00",
            sunday: "18:00-00:00"
          },
          capacity: 80,
          amenities: ["Climatisation", "Service de sécurité", "Bar à cocktails", "Wi-Fi"],
          photos: [
            "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1422748733255-ee572e4491bf?w=300&h=200&fit=crop"
          ],
          rating: 4.9,
          reviewCount: 28,
          status: "active",
          registrationDate: "2025-03-15T16:20:10",
          lastActive: "2025-05-06T22:25:30",
          manager: {
            id: 107,
            name: "Philippe Ratsimbazafy",
            email: "philippe@jazzcorner.mg",
            phone: "+261 33 88 567 89",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
          },
          hostedEvents: 12,
          upcomingEvents: 1,
          hasTableReservation: true,
          isFeatured: false
        }
      ];

      // Données simulées pour les activités
      const mockActivities: ActivityLog[] = [
        {
          id: 1,
          clubId: 1,
          timestamp: "2025-05-07T14:30:22",
          action: "Statut modifié",
          details: "Statut modifié de 'actif' à 'vérifié'",
          performedBy: {
            id: 1,
            name: "Admin System",
            role: "admin"
          }
        },
        {
          id: 2,
          clubId: 1,
          timestamp: "2025-05-05T10:15:45",
          action: "Mis en vedette",
          details: "Club mis en vedette jusqu'au 31/08/2025",
          performedBy: {
            id: 1,
            name: "Admin System",
            role: "admin"
          }
        },
        {
          id: 3,
          clubId: 1,
          timestamp: "2025-04-20T09:22:33",
          action: "Informations modifiées",
          details: "Description et coordonnées mises à jour",
          performedBy: {
            id: 101,
            name: "Thomas Rakoto",
            role: "manager"
          }
        },
        {
          id: 4,
          clubId: 5,
          timestamp: "2025-04-30T16:42:10",
          action: "Statut modifié",
          details: "Statut modifié de 'actif' à 'suspendu' en raison de violations des conditions d'utilisation",
          performedBy: {
            id: 1,
            name: "Admin System",
            role: "admin"
          }
        },
        {
          id: 5,
          clubId: 2,
          timestamp: "2025-05-02T11:30:00",
          action: "Événement créé",
          details: "Nouvel événement 'Urban Beats Party' créé pour le 17/05/2025",
          performedBy: {
            id: 102,
            name: "Sarah Nomenjanahary",
            role: "manager"
          }
        }
      ];

      // Données simulées pour les notes administratives
      const mockNotes: AdminNote[] = [
        {
          id: 1,
          clubId: 1,
          text: "Club très professionnel avec une excellente gestion. Vérification complète effectuée sur place.",
          createdAt: "2025-05-01T10:15:00",
          createdBy: {
            id: 1,
            name: "Admin System"
          }
        },
        {
          id: 2,
          clubId: 5,
          text: "Plusieurs plaintes reçues concernant le bruit excessif et problèmes de sécurité. À surveiller.",
          createdAt: "2025-04-28T14:30:22",
          createdBy: {
            id: 1,
            name: "Admin System"
          }
        },
        {
          id: 3,
          clubId: 5,
          text: "Suspendre temporairement le club suite aux multiples infractions constatées lors de l'inspection.",
          createdAt: "2025-04-30T16:40:05",
          createdBy: {
            id: 1,
            name: "Admin System"
          }
        },
        {
          id: 4,
          clubId: 6,
          text: "Documents de vérification reçus. En attente de validation de la licence d'exploitation.",
          createdAt: "2025-05-02T09:20:15",
          createdBy: {
            id: 1,
            name: "Admin System"
          }
        }
      ];

      setClubs(mockClubs);
      setActivityLogs(mockActivities);
      setAdminNotes(mockNotes);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filtrer les clubs
  const getFilteredClubs = () => {
    return clubs.filter(club => {
      // Filtre par recherche
      const matchesSearch = 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.manager.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par ville
      const matchesCity = 
        cityFilter === "all" || 
        club.city.toLowerCase() === cityFilter.toLowerCase();
      
      // Filtre par statut
      const matchesStatus = 
        statusFilter === "all" || 
        club.status === statusFilter;
      
      // Filtre par onglet
      const matchesTab = 
        (activeTab === "all") ||
        (activeTab === "verified" && club.status === "verified") ||
        (activeTab === "active" && club.status === "active") ||
        (activeTab === "pending" && club.status === "pending") ||
        (activeTab === "suspended" && club.status === "suspended") ||
        (activeTab === "featured" && club.isFeatured);
      
      return matchesSearch && matchesCity && matchesStatus && matchesTab;
    }).sort((a, b) => {
      // Tri des résultats
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "city") {
        return sortOrder === "asc" 
          ? a.city.localeCompare(b.city)
          : b.city.localeCompare(a.city);
      } else if (sortBy === "rating") {
        return sortOrder === "asc" 
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortBy === "events") {
        return sortOrder === "asc" 
          ? a.hostedEvents - b.hostedEvents
          : b.hostedEvents - a.hostedEvents;
      } else if (sortBy === "registration") {
        return sortOrder === "asc" 
          ? new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
          : new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      }
      return 0;
    });
  };

  // Obtenir les clubs filtrés et triés
  const filteredClubs = getFilteredClubs();

  // Fonctions d'action
  const handleViewClub = (club: Club) => {
    setSelectedClub(club);
    setIsClubDetailsOpen(true);
  };

  const handleEditClub = (club: Club) => {
    setEditedClub({...club});
    setIsEditModalOpen(true);
  };

  const handleDeleteClub = (club: Club) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le club ${club.name} ?`)) {
      toast({
        title: "Club supprimé",
        description: `${club.name} a été supprimé avec succès.`,
        variant: "destructive"
      });
      // Simuler la suppression
      setClubs(clubs.filter(c => c.id !== club.id));
    }
  };

  const handleToggleFeatured = (club: Club) => {
    const action = club.isFeatured ? "retiré des clubs en vedette" : "mis en vedette";
    toast({
      title: club.isFeatured ? "Club retiré de la vedette" : "Club mis en vedette",
      description: `${club.name} a été ${action}.`
    });
    // Simuler le changement
    setClubs(clubs.map(c => 
      c.id === club.id ? { 
        ...c, 
        isFeatured: !c.isFeatured,
        featuredUntil: !c.isFeatured ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined
      } : c
    ));
  };

  const handleVerifyClub = (club: Club) => {
    toast({
      title: "Club vérifié",
      description: `${club.name} a été marqué comme vérifié.`
    });
    // Simuler le changement
    setClubs(clubs.map(c => 
      c.id === club.id ? { 
        ...c, 
        status: "verified" as const,
        verificationDate: new Date().toISOString()
      } : c
    ));
  };

  const handleSuspendClub = (club: Club) => {
    toast({
      title: "Club suspendu",
      description: `${club.name} a été suspendu. Le club ne sera plus visible dans les recherches.`,
      variant: "destructive"
    });
    // Simuler le changement
    setClubs(clubs.map(c => 
      c.id === club.id ? { ...c, status: "suspended" as const } : c
    ));
  };

  const handleActivateClub = (club: Club) => {
    toast({
      title: "Club activé",
      description: `${club.name} a été activé et est maintenant visible dans les recherches.`
    });
    // Simuler le changement
    setClubs(clubs.map(c => 
      c.id === club.id ? { ...c, status: "active" as const } : c
    ));
  };

  const handleAddNote = () => {
    if (!selectedClub || !newNote.trim()) return;
    
    const note: AdminNote = {
      id: adminNotes.length + 1,
      clubId: selectedClub.id,
      text: newNote,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 1,
        name: "Admin System"
      }
    };
    
    setAdminNotes([...adminNotes, note]);
    setNewNote("");
    
    toast({
      title: "Note ajoutée",
      description: "La note administrative a été ajoutée avec succès."
    });
  };

  const handleViewImage = (image: string) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleSaveClubEdit = () => {
    if (!editedClub) return;
    
    setClubs(clubs.map(c => c.id === editedClub.id ? editedClub : c));
    setIsEditModalOpen(false);
    
    toast({
      title: "Club modifié",
      description: `Les informations de ${editedClub.name} ont été mises à jour avec succès.`
    });
  };

  // Obtenir le statut formaté pour affichage
  const getStatusDisplay = (status: Club["status"]) => {
    switch (status) {
      case "active":
        return { label: "Actif", color: "bg-green-100 text-green-600 border-green-200" };
      case "pending":
        return { label: "En attente", color: "bg-yellow-100 text-yellow-600 border-yellow-200" };
      case "verified":
        return { label: "Vérifié", color: "bg-blue-100 text-blue-600 border-blue-200" };
      case "suspended":
        return { label: "Suspendu", color: "bg-red-100 text-red-600 border-red-200" };
      default:
        return { label: status, color: "" };
    }
  };

  // Calculer les statistiques des clubs
  const getClubStats = () => {
    return {
      total: clubs.length,
      active: clubs.filter(c => c.status === "active").length,
      verified: clubs.filter(c => c.status === "verified").length,
      pending: clubs.filter(c => c.status === "pending").length,
      suspended: clubs.filter(c => c.status === "suspended").length,
      featured: clubs.filter(c => c.isFeatured).length,
      withTableReservation: clubs.filter(c => c.hasTableReservation).length,
      totalEvents: clubs.reduce((sum, club) => sum + club.hostedEvents, 0),
      upcomingEvents: clubs.reduce((sum, club) => sum + club.upcomingEvents, 0),
      averageRating: clubs.length > 0 
        ? parseFloat((clubs.reduce((sum, club) => sum + club.rating, 0) / clubs.length).toFixed(1))
        : 0,
    };
  };

  const stats = getClubStats();

  // Obtenir les activités pour un club spécifique
  const getClubActivities = (clubId: number) => {
    return activityLogs.filter(log => log.clubId === clubId);
  };

  // Obtenir les notes pour un club spécifique
  const getClubNotes = (clubId: number) => {
    return adminNotes.filter(note => note.clubId === clubId);
  };

  return (
    <ResponsiveLayout>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <PartyLoader />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestion des Clubs</h1>
              <p className="text-muted-foreground">
                Administrez et surveillez tous les clubs de la plateforme Be bit.
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button onClick={() => setLocation("/admin")} variant="outline">
                Retour au Dashboard
              </Button>
              <Button onClick={() => toast({
                title: "Fonctionnalité à venir",
                description: "L'ajout manuel de clubs sera disponible prochainement."
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un club
              </Button>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.verified} vérifiés · {stats.pending} en attente
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Événements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.upcomingEvents} événements à venir
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating}/5</div>
                <div className="flex text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(stats.averageRating) ? 'fill-current' : 'fill-none'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tables réservables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.withTableReservation}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Clubs proposant la réservation de tables
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-2/3">
              <TabsTrigger value="all">
                Tous <Badge className="ml-1">{stats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="verified">
                Vérifiés <Badge className="ml-1">{stats.verified}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                Actifs <Badge className="ml-1">{stats.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente <Badge className="ml-1 bg-yellow-500">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="suspended">
                Suspendus <Badge variant="destructive" className="ml-1">{stats.suspended}</Badge>
              </TabsTrigger>
              <TabsTrigger value="featured">
                En vedette <Badge className="ml-1 bg-purple-500">{stats.featured}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Liste des clubs</CardTitle>
                <CardDescription>
                  {filteredClubs.length} clubs correspondent à vos critères
                </CardDescription>
                
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, description, adresse..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <X 
                        className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                        onClick={() => setSearchQuery("")}
                      />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="w-[140px]">
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="verified">Vérifiés</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="suspended">Suspendus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => {
                          setSortBy("name");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Club
                          {sortBy === "name" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => {
                          setSortBy("city");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Localisation
                          {sortBy === "city" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center cursor-pointer" onClick={() => {
                          setSortBy("rating");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Note
                          {sortBy === "rating" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center cursor-pointer" onClick={() => {
                          setSortBy("events");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}>
                          Événements
                          {sortBy === "events" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredClubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <Building className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">Aucun club trouvé</p>
                            <p className="text-sm text-muted-foreground">
                              Modifiez vos filtres ou essayez une autre recherche
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClubs.map((club) => (
                        <TableRow key={club.id}>
                          <TableCell>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={club.logo} alt={club.name} />
                              <AvatarFallback>
                                {club.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {club.name}
                                {club.isFeatured && (
                                  <Badge variant="outline" className="ml-1 bg-purple-100 text-purple-600 border-purple-200">
                                    En vedette
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {club.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-sm">{club.city}</span>
                              </div>
                              <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                                {club.address}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-xs truncate max-w-[130px]">{club.contactEmail}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-xs">{club.contactPhone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusDisplay(club.status).color}>
                              {getStatusDisplay(club.status).label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <span className="mr-1 font-medium">{club.rating}</span>
                              <Star className="h-4 w-4 text-amber-400 fill-current" />
                              <span className="ml-1 text-xs text-muted-foreground">({club.reviewCount})</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{club.hostedEvents}</span>
                              <span className="text-xs text-muted-foreground">
                                {club.upcomingEvents > 0 && `${club.upcomingEvents} à venir`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewClub(club)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>Voir les détails</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditClub(club)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Modifier</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(club)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    <span>
                                      {club.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  {club.status === "active" && (
                                    <DropdownMenuItem onClick={() => handleVerifyClub(club)}>
                                      <BadgeCheck className="h-4 w-4 mr-2 text-blue-500" />
                                      <span>Marquer comme vérifié</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {(club.status === "active" || club.status === "verified") && (
                                    <DropdownMenuItem onClick={() => handleSuspendClub(club)}>
                                      <BadgeX className="h-4 w-4 mr-2 text-red-500" />
                                      <span>Suspendre</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {(club.status === "suspended" || club.status === "pending") && (
                                    <DropdownMenuItem onClick={() => handleActivateClub(club)}>
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      <span>Activer</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteClub(club)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Supprimer</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredClubs.length} clubs sur {clubs.length} au total
                </div>
                {filteredClubs.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Suivant
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Tabs>
        </div>
      )}

      {/* Dialogue de détails du club */}
      <Dialog open={isClubDetailsOpen} onOpenChange={setIsClubDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedClub && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du club</DialogTitle>
                <DialogDescription>
                  Informations complètes sur le club {selectedClub.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="flex flex-col items-center">
                  <div className="w-full h-48 rounded-md overflow-hidden bg-muted mb-4 relative">
                    {selectedClub.coverImage ? (
                      <img 
                        src={selectedClub.coverImage} 
                        alt={selectedClub.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Building className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex items-center bg-black/60 p-2 rounded-lg">
                      <Avatar className="h-12 w-12 mr-3 border-2 border-white">
                        <AvatarImage src={selectedClub.logo} />
                        <AvatarFallback>{selectedClub.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedClub.name}</h3>
                        <div className="flex items-center space-x-1 text-white">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span>{selectedClub.rating}</span>
                          <span className="text-sm opacity-80">({selectedClub.reviewCount} avis)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full flex flex-wrap gap-2 mb-4">
                    <Badge className={getStatusDisplay(selectedClub.status).color}>
                      {getStatusDisplay(selectedClub.status).label}
                    </Badge>
                    {selectedClub.isFeatured && (
                      <Badge className="bg-purple-100 text-purple-600 border-purple-200">
                        En vedette
                        {selectedClub.featuredUntil && (
                          <span className="ml-1 text-xs">
                            jusqu'au {format(new Date(selectedClub.featuredUntil), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        )}
                      </Badge>
                    )}
                    {selectedClub.hasTableReservation && (
                      <Badge variant="outline">Réservation de tables</Badge>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="info">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                    <TabsTrigger value="activity">Activité</TabsTrigger>
                    <TabsTrigger value="notes">Notes administratives</TabsTrigger>
                  </TabsList>
                  
                  {/* Onglet Informations */}
                  <TabsContent value="info" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm text-muted-foreground">{selectedClub.description}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Adresse</p>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {selectedClub.address}, {selectedClub.city}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Capacité</p>
                            <p className="text-sm text-muted-foreground">{selectedClub.capacity} personnes</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Aménagements</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedClub.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline">{amenity}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm">{selectedClub.contactEmail}</p>
                          </div>
                          
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm">{selectedClub.contactPhone}</p>
                          </div>
                          
                          {selectedClub.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <a href={selectedClub.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                {selectedClub.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-2">Réseaux sociaux</p>
                            <div className="space-y-1">
                              {selectedClub.socials.facebook && (
                                <div className="flex items-center">
                                  <div className="h-5 w-5 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs mr-2">f</div>
                                  <span className="text-sm">facebook.com/{selectedClub.socials.facebook}</span>
                                </div>
                              )}
                              
                              {selectedClub.socials.instagram && (
                                <div className="flex items-center">
                                  <div className="h-5 w-5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-md flex items-center justify-center text-white text-xs mr-2">i</div>
                                  <span className="text-sm">instagram.com/{selectedClub.socials.instagram}</span>
                                </div>
                              )}
                              
                              {selectedClub.socials.twitter && (
                                <div className="flex items-center">
                                  <div className="h-5 w-5 bg-blue-400 rounded-md flex items-center justify-center text-white text-xs mr-2">t</div>
                                  <span className="text-sm">twitter.com/{selectedClub.socials.twitter}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Horaires d'ouverture</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p>Lundi:</p>
                              <p>Mardi:</p>
                              <p>Mercredi:</p>
                              <p>Jeudi:</p>
                            </div>
                            <div>
                              <p className="font-medium">{selectedClub.openingHours.monday || "Fermé"}</p>
                              <p className="font-medium">{selectedClub.openingHours.tuesday || "Fermé"}</p>
                              <p className="font-medium">{selectedClub.openingHours.wednesday || "Fermé"}</p>
                              <p className="font-medium">{selectedClub.openingHours.thursday || "Fermé"}</p>
                            </div>
                            <div>
                              <p>Vendredi:</p>
                              <p>Samedi:</p>
                              <p>Dimanche:</p>
                            </div>
                            <div>
                              <p className="font-medium">{selectedClub.openingHours.friday || "Fermé"}</p>
                              <p className="font-medium">{selectedClub.openingHours.saturday || "Fermé"}</p>
                              <p className="font-medium">{selectedClub.openingHours.sunday || "Fermé"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Gestionnaire</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={selectedClub.manager.avatar} />
                              <AvatarFallback>{selectedClub.manager.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedClub.manager.name}</p>
                              <p className="text-sm text-muted-foreground">Responsable du club</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{selectedClub.manager.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{selectedClub.manager.phone}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Informations administratives</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium">ID du club</p>
                            <p className="text-muted-foreground">{selectedClub.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Date d'inscription</p>
                            <p className="text-muted-foreground">
                              {format(new Date(selectedClub.registrationDate), "dd MMMM yyyy à HH:mm", { locale: fr })}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Dernière activité</p>
                            <p className="text-muted-foreground">
                              {format(new Date(selectedClub.lastActive), "dd MMMM yyyy à HH:mm", { locale: fr })}
                            </p>
                          </div>
                          {selectedClub.verificationDate && (
                            <div>
                              <p className="font-medium">Date de vérification</p>
                              <p className="text-muted-foreground">
                                {format(new Date(selectedClub.verificationDate), "dd MMMM yyyy à HH:mm", { locale: fr })}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">Événements organisés</p>
                            <p className="text-muted-foreground">{selectedClub.hostedEvents} (dont {selectedClub.upcomingEvents} à venir)</p>
                          </div>
                          {selectedClub.isFeatured && selectedClub.featuredUntil && (
                            <div>
                              <p className="font-medium">En vedette jusqu'au</p>
                              <p className="text-muted-foreground">
                                {format(new Date(selectedClub.featuredUntil), "dd MMMM yyyy", { locale: fr })}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Onglet Médias */}
                  <TabsContent value="media">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Photos</CardTitle>
                        <CardDescription>
                          Galerie de photos du club ({selectedClub.photos.length})
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedClub.photos.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Aucune photo disponible</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedClub.photos.map((photo, index) => (
                              <div 
                                key={index} 
                                className="rounded-md overflow-hidden h-48 cursor-pointer"
                                onClick={() => handleViewImage(photo)}
                              >
                                <img 
                                  src={photo} 
                                  alt={`${selectedClub.name} - Photo ${index + 1}`} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Onglet Activité */}
                  <TabsContent value="activity">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historique d'activité</CardTitle>
                        <CardDescription>
                          Journal des actions et modifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {getClubActivities(selectedClub.id).length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Aucune activité enregistrée</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getClubActivities(selectedClub.id).map((activity) => (
                              <div key={activity.id} className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <History className="h-4 w-4" />
                                  </div>
                                  <div className="h-full w-px bg-border my-2"></div>
                                </div>
                                <div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <p className="font-medium">{activity.action}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(activity.timestamp), "dd MMM yyyy à HH:mm", { locale: fr })}
                                    </p>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Par: {activity.performedBy.name} ({activity.performedBy.role})
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Onglet Notes administratives */}
                  <TabsContent value="notes">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes administratives</CardTitle>
                        <CardDescription>
                          Notes internes sur ce club
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Textarea 
                            placeholder="Ajouter une nouvelle note..." 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                          />
                          <Button 
                            onClick={handleAddNote} 
                            className="mt-2"
                            disabled={!newNote.trim()}
                          >
                            Ajouter une note
                          </Button>
                        </div>
                        
                        {getClubNotes(selectedClub.id).length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">Aucune note pour le moment</p>
                          </div>
                        ) : (
                          <div className="space-y-4 mt-6">
                            {getClubNotes(selectedClub.id).map((note) => (
                              <div key={note.id} className="p-4 border rounded-lg">
                                <p className="text-sm">{note.text}</p>
                                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                  <span>Par: {note.createdBy.name}</span>
                                  <span>{format(new Date(note.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  {selectedClub.status === "pending" && (
                    <Button 
                      onClick={() => {
                        handleActivateClub(selectedClub);
                        setIsClubDetailsOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver ce club
                    </Button>
                  )}
                  
                  {selectedClub.status !== "suspended" && (
                    <Button 
                      onClick={() => {
                        handleSuspendClub(selectedClub);
                        setIsClubDetailsOpen(false);
                      }}
                      variant="destructive"
                    >
                      <BadgeX className="h-4 w-4 mr-2" />
                      Suspendre le club
                    </Button>
                  )}
                  
                  {selectedClub.status === "suspended" && (
                    <Button 
                      onClick={() => {
                        handleActivateClub(selectedClub);
                        setIsClubDetailsOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Réactiver le club
                    </Button>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleToggleFeatured(selectedClub)}
                  variant="outline" 
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedClub.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                </Button>
                
                <Button onClick={() => handleEditClub(selectedClub)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                
                <DialogClose asChild>
                  <Button variant="secondary">Fermer</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal d'agrandissement d'image */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Club photo" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button 
                className="absolute top-2 right-2" 
                size="icon" 
                variant="secondary"
                onClick={() => setIsImageModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal d'édition du club */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {editedClub && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier le club</DialogTitle>
                <DialogDescription>
                  Modifier les informations de {editedClub.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <Accordion type="single" collapsible defaultValue="basic">
                    <AccordionItem value="basic">
                      <AccordionTrigger className="text-lg font-medium">Informations de base</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club-name">Nom du club</Label>
                            <Input 
                              id="club-name"
                              value={editedClub.name}
                              onChange={(e) => setEditedClub({...editedClub, name: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-city">Ville</Label>
                            <Select
                              value={editedClub.city}
                              onValueChange={(value) => setEditedClub({...editedClub, city: value})}
                            >
                              <SelectTrigger id="club-city">
                                <SelectValue placeholder="Sélectionnez une ville" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map(city => (
                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="club-address">Adresse</Label>
                          <Input 
                            id="club-address"
                            value={editedClub.address}
                            onChange={(e) => setEditedClub({...editedClub, address: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="club-description">Description</Label>
                          <Textarea 
                            id="club-description"
                            value={editedClub.description}
                            onChange={(e) => setEditedClub({...editedClub, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club-capacity">Capacité</Label>
                            <Input 
                              id="club-capacity"
                              type="number"
                              value={editedClub.capacity}
                              onChange={(e) => setEditedClub({...editedClub, capacity: parseInt(e.target.value, 10)})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-status">Statut</Label>
                            <Select
                              value={editedClub.status}
                              onValueChange={(value: any) => setEditedClub({...editedClub, status: value})}
                            >
                              <SelectTrigger id="club-status">
                                <SelectValue placeholder="Sélectionnez un statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="verified">Vérifié</SelectItem>
                                <SelectItem value="suspended">Suspendu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="block mb-2">Aménagements</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {amenitiesList.map(amenity => (
                              <div key={amenity} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`amenity-${amenity}`}
                                  checked={editedClub.amenities.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setEditedClub({
                                        ...editedClub,
                                        amenities: [...editedClub.amenities, amenity]
                                      });
                                    } else {
                                      setEditedClub({
                                        ...editedClub,
                                        amenities: editedClub.amenities.filter(a => a !== amenity)
                                      });
                                    }
                                  }}
                                />
                                <Label 
                                  htmlFor={`amenity-${amenity}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {amenity}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="table-reservation"
                            checked={editedClub.hasTableReservation}
                            onCheckedChange={(checked) => setEditedClub({...editedClub, hasTableReservation: checked})}
                          />
                          <Label htmlFor="table-reservation" className="cursor-pointer">
                            Propose la réservation de tables
                          </Label>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="contact">
                      <AccordionTrigger className="text-lg font-medium">Informations de contact</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club-email">Email de contact</Label>
                            <Input 
                              id="club-email"
                              type="email"
                              value={editedClub.contactEmail}
                              onChange={(e) => setEditedClub({...editedClub, contactEmail: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-phone">Téléphone</Label>
                            <Input 
                              id="club-phone"
                              value={editedClub.contactPhone}
                              onChange={(e) => setEditedClub({...editedClub, contactPhone: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="club-website">Site web</Label>
                          <Input 
                            id="club-website"
                            type="url"
                            value={editedClub.website || ""}
                            onChange={(e) => setEditedClub({...editedClub, website: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Réseaux sociaux</Label>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-facebook" className="text-sm">Facebook</Label>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">facebook.com/</span>
                              <Input 
                                id="club-facebook"
                                value={editedClub.socials.facebook || ""}
                                onChange={(e) => setEditedClub({
                                  ...editedClub, 
                                  socials: {...editedClub.socials, facebook: e.target.value}
                                })}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-instagram" className="text-sm">Instagram</Label>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">instagram.com/</span>
                              <Input 
                                id="club-instagram"
                                value={editedClub.socials.instagram || ""}
                                onChange={(e) => setEditedClub({
                                  ...editedClub, 
                                  socials: {...editedClub.socials, instagram: e.target.value}
                                })}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="club-twitter" className="text-sm">Twitter</Label>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">twitter.com/</span>
                              <Input 
                                id="club-twitter"
                                value={editedClub.socials.twitter || ""}
                                onChange={(e) => setEditedClub({
                                  ...editedClub, 
                                  socials: {...editedClub.socials, twitter: e.target.value}
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="manager">
                      <AccordionTrigger className="text-lg font-medium">Gestionnaire</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="manager-name">Nom du gestionnaire</Label>
                            <Input 
                              id="manager-name"
                              value={editedClub.manager.name}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                manager: {...editedClub.manager, name: e.target.value}
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="manager-email">Email du gestionnaire</Label>
                            <Input 
                              id="manager-email"
                              type="email"
                              value={editedClub.manager.email}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                manager: {...editedClub.manager, email: e.target.value}
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="manager-phone">Téléphone du gestionnaire</Label>
                          <Input 
                            id="manager-phone"
                            value={editedClub.manager.phone}
                            onChange={(e) => setEditedClub({
                              ...editedClub, 
                              manager: {...editedClub.manager, phone: e.target.value}
                            })}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="hours">
                      <AccordionTrigger className="text-lg font-medium">Horaires d'ouverture</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-monday" className="flex items-center">Lundi</Label>
                            <Input 
                              id="hours-monday"
                              value={editedClub.openingHours.monday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, monday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-tuesday" className="flex items-center">Mardi</Label>
                            <Input 
                              id="hours-tuesday"
                              value={editedClub.openingHours.tuesday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, tuesday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-wednesday" className="flex items-center">Mercredi</Label>
                            <Input 
                              id="hours-wednesday"
                              value={editedClub.openingHours.wednesday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, wednesday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-thursday" className="flex items-center">Jeudi</Label>
                            <Input 
                              id="hours-thursday"
                              value={editedClub.openingHours.thursday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, thursday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-friday" className="flex items-center">Vendredi</Label>
                            <Input 
                              id="hours-friday"
                              value={editedClub.openingHours.friday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, friday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-saturday" className="flex items-center">Samedi</Label>
                            <Input 
                              id="hours-saturday"
                              value={editedClub.openingHours.saturday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, saturday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="hours-sunday" className="flex items-center">Dimanche</Label>
                            <Input 
                              id="hours-sunday"
                              value={editedClub.openingHours.sunday || ""}
                              onChange={(e) => setEditedClub({
                                ...editedClub, 
                                openingHours: {...editedClub.openingHours, sunday: e.target.value}
                              })}
                              placeholder="Fermé ou 18:00-00:00"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-featured"
                      checked={editedClub.isFeatured}
                      onCheckedChange={(checked) => setEditedClub({
                        ...editedClub, 
                        isFeatured: checked,
                        featuredUntil: checked 
                          ? editedClub.featuredUntil || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                          : undefined
                      })}
                    />
                    <Label htmlFor="edit-featured" className="cursor-pointer">
                      Club en vedette
                    </Label>
                  </div>
                </div>
                <Button onClick={handleSaveClubEdit} className="w-full sm:w-auto">
                  Enregistrer les modifications
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full sm:w-auto">Annuler</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}

// Composant Checkbox pour l'édition des aménagements
function Checkbox({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 focus:ring-primary cursor-pointer"
    />
  );
}