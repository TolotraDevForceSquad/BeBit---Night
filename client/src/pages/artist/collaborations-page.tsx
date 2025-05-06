import { useState, useEffect } from "react";
import { 
  CalendarDays, Clock, PieChart, CheckCircle2, CircleDashed, 
  ArrowUpDown, Filter, Search, CalendarRange, Users, MessageSquare, 
  Mic2, Timer, MapPin, ChevronsUpDown
} from "lucide-react";
import ResponsiveLayout from "@/layouts/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format, formatDistance, parseISO, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour l'utilisateur authentifié
type AuthUser = {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

// Types pour le suivi de collaboration
type CollaborationStatus = 
  | "pending" 
  | "negotiation" 
  | "confirmed" 
  | "preparation" 
  | "completed" 
  | "cancelled";

type MilestoneStatus = "pending" | "in_progress" | "completed";

type Milestone = {
  id: number;
  title: string;
  description: string;
  dueDate?: string;
  status: MilestoneStatus;
  completedAt?: string;
  assignedTo: "artist" | "club" | "both";
  priority: "low" | "medium" | "high";
};

type Message = {
  id: number;
  sender: string;
  senderType: "club" | "artist";
  senderImage?: string;
  content: string;
  timestamp: string;
};

type Collaboration = {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  clubId: number;
  clubName: string;
  clubImage?: string;
  clubLocation: string;
  status: CollaborationStatus;
  created: string;
  lastUpdated: string;
  fee: number;
  expectedAttendees: number;
  progress: number; // 0-100
  milestones: Milestone[];
  messages: Message[];
  notes?: string;
};

// Données fictives pour les collaborations
const mockCollaborations: Collaboration[] = [
  {
    id: 1,
    eventId: 101,
    eventTitle: "Soirée Techno de Printemps",
    eventDate: new Date(new Date().getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    clubId: 1,
    clubName: "Club Oxygen",
    clubImage: "/images/clubs/club1.jpg",
    clubLocation: "Antananarivo",
    status: "preparation",
    created: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 500000,
    expectedAttendees: 300,
    progress: 70,
    milestones: [
      {
        id: 1,
        title: "Proposition initiale",
        description: "Discussion des termes de base et proposition de collaboration",
        dueDate: new Date(new Date().getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 38 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 2,
        title: "Négociation",
        description: "Finalisation du contrat, du cachet et des conditions techniques",
        dueDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 3,
        title: "Signature du contrat",
        description: "Signature officielle de l'accord de prestation",
        dueDate: new Date(new Date().getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 4,
        title: "Préparation technique",
        description: "Envoi de la fiche technique et des besoins spécifiques",
        dueDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 5,
        title: "Préparation du set",
        description: "Préparation de la playlist et du matériel",
        dueDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 6,
        title: "Promotion de l'événement",
        description: "Partage sur les réseaux sociaux et promotion auprès des fans",
        dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        assignedTo: "both",
        priority: "medium"
      },
      {
        id: 7,
        title: "Check technique",
        description: "Vérification du matériel sur place avant l'événement",
        dueDate: new Date(new Date().getTime() + 17 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "artist",
        priority: "high"
      },
      {
        id: 8,
        title: "Performance",
        description: "Jour de l'événement",
        dueDate: new Date(new Date().getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "artist",
        priority: "high"
      },
      {
        id: 9,
        title: "Bilan et feedback",
        description: "Discussion post-événement et feedback",
        dueDate: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "both",
        priority: "low"
      },
    ],
    messages: [
      {
        id: 1,
        sender: "Club Oxygen",
        senderType: "club",
        senderImage: "/images/clubs/club1.jpg",
        content: "Nous sommes ravis de vous accueillir pour notre soirée Techno de Printemps. Pouvez-vous nous confirmer vos besoins techniques spécifiques ?",
        timestamp: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Merci pour l'invitation ! J'ai envoyé ma fiche technique par email. J'aurais besoin de CDJs 3000 et d'un mixer DJM-900NXS2.",
        timestamp: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        sender: "Club Oxygen",
        senderType: "club",
        senderImage: "/images/clubs/club1.jpg",
        content: "Parfait, nous avons bien tout le matériel demandé. Concernant les horaires, pourriez-vous arriver vers 20h pour l'installation et les tests son ?",
        timestamp: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "C'est noté pour 20h. Est-ce que je peux avoir un accès à la cabine avant pour installer mes contrôleurs MIDI supplémentaires ?",
        timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        sender: "Club Oxygen",
        senderType: "club",
        senderImage: "/images/clubs/club1.jpg",
        content: "Oui, bien sûr. Notre ingénieur son sera là à partir de 18h si vous voulez venir plus tôt. Nous avons hâte de vous accueillir !",
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 2,
    eventId: 102,
    eventTitle: "Festival d'Été Groove",
    eventDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    clubId: 3,
    clubName: "Sky Lounge",
    clubImage: "/images/clubs/club3.jpg",
    clubLocation: "Antananarivo",
    status: "confirmed",
    created: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 850000,
    expectedAttendees: 500,
    progress: 40,
    milestones: [
      {
        id: 1,
        title: "Proposition initiale",
        description: "Discussion des termes de base et proposition de collaboration",
        dueDate: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 2,
        title: "Négociation",
        description: "Finalisation du contrat, du cachet et des conditions techniques",
        dueDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 3,
        title: "Signature du contrat",
        description: "Signature officielle de l'accord de prestation",
        dueDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 4,
        title: "Préparation technique",
        description: "Envoi de la fiche technique et des besoins spécifiques",
        dueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 5,
        title: "Préparation du set",
        description: "Préparation de la playlist et du matériel",
        dueDate: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 6,
        title: "Promotion de l'événement",
        description: "Partage sur les réseaux sociaux et promotion auprès des fans",
        dueDate: new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "both",
        priority: "medium"
      },
      {
        id: 7,
        title: "Performance",
        description: "Jour de l'événement",
        dueDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "artist",
        priority: "high"
      }
    ],
    messages: [
      {
        id: 1,
        sender: "Sky Lounge",
        senderType: "club",
        senderImage: "/images/clubs/club3.jpg",
        content: "Bonjour, nous organisons un festival d'été et nous aimerions vous avoir comme DJ principal pour notre soirée du 15 juillet. Êtes-vous disponible ?",
        timestamp: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Bonjour, merci pour votre invitation ! Oui, je suis disponible pour cette date. Pouvez-vous me donner plus de détails sur l'événement ?",
        timestamp: new Date(new Date().getTime() - 19 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        sender: "Sky Lounge",
        senderType: "club",
        senderImage: "/images/clubs/club3.jpg",
        content: "Bien sûr ! C'est un festival de 3 jours avec plusieurs artistes, vous seriez en tête d'affiche le deuxième jour. Le public attendu est d'environ 500 personnes. Nous proposons un cachet de 850,000 Ar. Qu'en pensez-vous ?",
        timestamp: new Date(new Date().getTime() - 18 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Cela me convient parfaitement. Je vous enverrai ma fiche technique prochainement pour que tout soit prêt. Merci de votre confiance !",
        timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 3,
    eventId: 103,
    eventTitle: "Soirée Deep House",
    eventDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    clubId: 2,
    clubName: "Le Bunker",
    clubImage: "/images/clubs/club2.jpg",
    clubLocation: "Antananarivo",
    status: "completed",
    created: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 400000,
    expectedAttendees: 200,
    progress: 100,
    milestones: [
      {
        id: 1,
        title: "Proposition initiale",
        description: "Discussion des termes de base et proposition de collaboration",
        dueDate: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 85 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 2,
        title: "Négociation",
        description: "Finalisation du contrat, du cachet et des conditions techniques",
        dueDate: new Date(new Date().getTime() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 3,
        title: "Signature du contrat",
        description: "Signature officielle de l'accord de prestation",
        dueDate: new Date(new Date().getTime() - 70 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 68 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 4,
        title: "Préparation technique",
        description: "Envoi de la fiche technique et des besoins spécifiques",
        dueDate: new Date(new Date().getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 48 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 5,
        title: "Préparation du set",
        description: "Préparation de la playlist et du matériel",
        dueDate: new Date(new Date().getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "medium"
      },
      {
        id: 6,
        title: "Promotion de l'événement",
        description: "Partage sur les réseaux sociaux et promotion auprès des fans",
        dueDate: new Date(new Date().getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 37 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "medium"
      },
      {
        id: 7,
        title: "Check technique",
        description: "Vérification du matériel sur place avant l'événement",
        dueDate: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "high"
      },
      {
        id: 8,
        title: "Performance",
        description: "Jour de l'événement",
        dueDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "high"
      },
      {
        id: 9,
        title: "Bilan et feedback",
        description: "Discussion post-événement et feedback",
        dueDate: new Date(new Date().getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "low"
      },
    ],
    messages: [
      {
        id: 1,
        sender: "Le Bunker",
        senderType: "club",
        senderImage: "/images/clubs/club2.jpg",
        content: "L'événement était un grand succès ! Merci pour votre performance exceptionnelle. Nous avons reçu d'excellents retours des clients.",
        timestamp: new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Merci beaucoup ! J'ai vraiment apprécié l'ambiance et l'énergie du public. Votre équipe technique était également très professionnelle. Je serais ravi de collaborer à nouveau avec vous à l'avenir.",
        timestamp: new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 4,
    eventId: 104,
    eventTitle: "Soirée Hip-Hop Fusion",
    eventDate: new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    clubId: 4,
    clubName: "Jungle Room",
    clubImage: "/images/clubs/club4.jpg",
    clubLocation: "Antananarivo",
    status: "negotiation",
    created: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 600000,
    expectedAttendees: 250,
    progress: 20,
    milestones: [
      {
        id: 1,
        title: "Proposition initiale",
        description: "Discussion des termes de base et proposition de collaboration",
        dueDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 2,
        title: "Négociation",
        description: "Finalisation du contrat, du cachet et des conditions techniques",
        dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 3,
        title: "Signature du contrat",
        description: "Signature officielle de l'accord de prestation",
        dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        assignedTo: "both",
        priority: "high"
      }
    ],
    messages: [
      {
        id: 1,
        sender: "Jungle Room",
        senderType: "club",
        senderImage: "/images/clubs/club4.jpg",
        content: "Nous aimerions vous proposer de mixer lors de notre soirée Hip-Hop Fusion. Êtes-vous à l'aise avec ce style musical ?",
        timestamp: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Oui, j'ai une bonne expérience dans le Hip-Hop et je peux créer un set fusion intéressant. Quelles sont vos attentes pour cette soirée ?",
        timestamp: new Date(new Date().getTime() - 9 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        sender: "Jungle Room",
        senderType: "club",
        senderImage: "/images/clubs/club4.jpg",
        content: "Nous cherchons un mix entre Hip-Hop classique et sonorités modernes avec des touches électroniques. Pour le cachet, nous proposons 500,000 Ar pour un set de 3 heures.",
        timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "J'aime le concept. Pour un set de 3 heures avec cette préparation spéciale, je demande habituellement 650,000 Ar. Est-ce que nous pouvons trouver un terrain d'entente ?",
        timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        sender: "Jungle Room",
        senderType: "club",
        senderImage: "/images/clubs/club4.jpg",
        content: "Nous pouvons vous proposer 600,000 Ar, ce qui est notre maximum pour cet événement. Qu'en pensez-vous ?",
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "600,000 Ar me convient. Je vous remercie pour cette proposition. Pouvons-nous discuter maintenant des détails techniques ?",
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 5,
    eventId: 105,
    eventTitle: "Soirée Électro Exclusive",
    eventDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    clubId: 5,
    clubName: "Club Nova",
    clubImage: "/images/clubs/club5.jpg",
    clubLocation: "Antananarivo",
    status: "cancelled",
    created: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 450000,
    expectedAttendees: 350,
    progress: 40,
    milestones: [
      {
        id: 1,
        title: "Proposition initiale",
        description: "Discussion des termes de base et proposition de collaboration",
        dueDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 2,
        title: "Négociation",
        description: "Finalisation du contrat, du cachet et des conditions techniques",
        dueDate: new Date(new Date().getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 3,
        title: "Signature du contrat",
        description: "Signature officielle de l'accord de prestation",
        dueDate: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "both",
        priority: "high"
      },
      {
        id: 4,
        title: "Préparation technique",
        description: "Envoi de la fiche technique et des besoins spécifiques",
        dueDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        completedAt: new Date(new Date().getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "artist",
        priority: "medium"
      }
    ],
    messages: [
      {
        id: 1,
        sender: "Club Nova",
        senderType: "club",
        senderImage: "/images/clubs/club5.jpg",
        content: "Bonjour, nous sommes ravis de vous accueillir pour notre soirée Électro Exclusive. Tout est prêt de notre côté.",
        timestamp: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Bonjour, je suis également très enthousiaste. J'ai envoyé ma fiche technique, avez-vous pu vérifier si tout est disponible ?",
        timestamp: new Date(new Date().getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        sender: "Club Nova",
        senderType: "club",
        senderImage: "/images/clubs/club5.jpg",
        content: "Oui, tout est en ordre. Notre équipe technique a confirmé que nous avons tout le matériel nécessaire.",
        timestamp: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        sender: "Club Nova",
        senderType: "club",
        senderImage: "/images/clubs/club5.jpg",
        content: "Nous sommes désolés de vous informer que nous devons annuler l'événement en raison de problèmes imprévus avec notre licence d'exploitation. Nous vous prions de nous excuser pour ce désagrément.",
        timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        sender: "DJ Elektra",
        senderType: "artist",
        content: "Je comprends, ces choses arrivent. J'espère que nous pourrons collaborer à l'avenir lorsque la situation sera résolue.",
        timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

// Fonction d'aide pour récupérer le statut textuel en français
const getStatusText = (status: CollaborationStatus): string => {
  const statusMap: Record<CollaborationStatus, string> = {
    pending: "En attente",
    negotiation: "En négociation",
    confirmed: "Confirmé",
    preparation: "En préparation",
    completed: "Terminé",
    cancelled: "Annulé"
  };
  return statusMap[status] || status;
};

// Fonction d'aide pour récupérer la couleur associée au statut
const getStatusColor = (status: CollaborationStatus): string => {
  const colorMap: Record<CollaborationStatus, string> = {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    negotiation: "bg-purple-100 text-purple-800 border-purple-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    preparation: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-slate-100 text-slate-800 border-slate-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer le texte du statut des jalons
const getMilestoneStatusText = (status: MilestoneStatus): string => {
  const statusMap: Record<MilestoneStatus, string> = {
    pending: "À venir",
    in_progress: "En cours",
    completed: "Terminé"
  };
  return statusMap[status] || status;
};

// Fonction d'aide pour récupérer la couleur associée au statut des jalons
const getMilestoneStatusColor = (status: MilestoneStatus): string => {
  const colorMap: Record<MilestoneStatus, string> = {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-green-100 text-green-800 border-green-200"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer la priorité textuelle
const getPriorityText = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute"
  };
  return priorityMap[priority] || priority;
};

// Fonction d'aide pour récupérer la couleur associée à la priorité
const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200"
  };
  return colorMap[priority] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Fonction d'aide pour récupérer l'attribution textuelle
const getAssignedToText = (assignedTo: string): string => {
  const assignedMap: Record<string, string> = {
    artist: "Artiste",
    club: "Club",
    both: "Les deux"
  };
  return assignedMap[assignedTo] || assignedTo;
};

export default function ArtistCollaborationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [filteredCollaborations, setFilteredCollaborations] = useState<Collaboration[]>([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CollaborationStatus | null>(null);
  const [sortOrder, setSortOrder] = useState<'upcoming' | 'recent'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [message, setMessage] = useState("");
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});

  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
      }
    }
  }, []);

  // Chargement des collaborations
  useEffect(() => {
    // Chargement immédiat sans délai artificiel
    setCollaborations(mockCollaborations);
    setFilteredCollaborations(mockCollaborations);
    setIsLoading(false);
  }, []);
  
  // Filtrer les collaborations
  useEffect(() => {
    let result = collaborations;
    
    // Filtre par onglet
    if (currentTab === "active") {
      result = result.filter(collab => 
        ["pending", "negotiation", "confirmed", "preparation"].includes(collab.status)
      );
    } else if (currentTab === "completed") {
      result = result.filter(collab => collab.status === "completed");
    } else if (currentTab === "cancelled") {
      result = result.filter(collab => collab.status === "cancelled");
    }
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(collab => 
        collab.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.clubName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      result = result.filter(collab => collab.status === statusFilter);
    }
    
    // Tri
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      
      if (sortOrder === 'upcoming') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    
    setFilteredCollaborations(result);
  }, [collaborations, searchTerm, statusFilter, sortOrder, currentTab]);

  // Sélectionner une collaboration
  const handleSelectCollaboration = (collab: Collaboration) => {
    setSelectedCollaboration(collab);
  };

  // Envoyer un message
  const handleSendMessage = () => {
    if (!selectedCollaboration || !message.trim()) return;
    
    const newMessage: Message = {
      id: Math.max(0, ...selectedCollaboration.messages.map(m => m.id)) + 1,
      sender: user?.username || "DJ Elektra",
      senderType: "artist",
      content: message,
      timestamp: new Date().toISOString()
    };
    
    const updatedCollaboration = {
      ...selectedCollaboration,
      messages: [...selectedCollaboration.messages, newMessage],
      lastUpdated: new Date().toISOString()
    };
    
    setCollaborations(prev => 
      prev.map(collab => 
        collab.id === selectedCollaboration.id 
          ? updatedCollaboration 
          : collab
      )
    );
    
    setSelectedCollaboration(updatedCollaboration);
    setMessage("");
  };

  // Basculer l'état d'expansion des jalons
  const toggleMilestoneExpansion = (collaborationId: number) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [collaborationId]: !prev[collaborationId]
    }));
  };

  // Calculer la prochaine étape pour une collaboration
  const getNextMilestone = (collab: Collaboration) => {
    const pendingMilestones = collab.milestones
      .filter(m => m.status === "pending" || m.status === "in_progress")
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      });
    
    return pendingMilestones[0];
  };

  // Contenu d'en-tête pour le layout
  const headerContent = (
    <div className="flex items-center justify-between">
      <h1 className="font-heading font-bold text-lg md:text-xl">
        <span className="text-primary">Be</span> <span className="text-secondary">bit.</span>
        <span className="ml-2 text-foreground">Collaborations</span>
      </h1>
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 px-3 py-1">
          <PieChart className="h-3 w-3 mr-1" />
          <span>Suivi d'événements</span>
        </Badge>
        
        {user && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      activeItem="collaborations"
      headerContent={headerContent}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des collaborations */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mes collaborations</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtres</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un événement ou un club..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortOrder('upcoming')}>
                    Prochains événements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('recent')}>
                    Événements récents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
                <TabsTrigger value="cancelled">Annulés</TabsTrigger>
              </TabsList>
              
              <div className="space-y-3 mt-2">
                {filteredCollaborations.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                    <p className="text-muted-foreground">Aucune collaboration trouvée</p>
                  </div>
                ) : (
                  <>
                    {filteredCollaborations.map(collab => (
                      <Card 
                        key={collab.id} 
                        className={`cursor-pointer hover:border-primary/50 transition-colors ${
                          selectedCollaboration?.id === collab.id ? "border-primary" : ""
                        }`}
                        onClick={() => handleSelectCollaboration(collab)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={collab.clubImage} alt={collab.clubName} />
                                <AvatarFallback>{collab.clubName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{collab.eventTitle}</h3>
                                <p className="text-sm text-muted-foreground">{collab.clubName}</p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(collab.status)}`}
                            >
                              {getStatusText(collab.status)}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center mb-1">
                              <CalendarDays className="h-4 w-4 mr-2" />
                              <span>{format(parseISO(collab.eventDate), "d MMMM yyyy", { locale: fr })}</span>
                            </div>
                            <div className="flex items-center mb-1">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{collab.clubLocation}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              <span>Audience prévue: {collab.expectedAttendees.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progression:</span>
                              <span>{collab.progress}%</span>
                            </div>
                            <Progress value={collab.progress} className="h-2" />
                          </div>
                          
                          {/* Prochaine étape */}
                          {getNextMilestone(collab) && collab.status !== "completed" && collab.status !== "cancelled" && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-1">Prochaine étape:</p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{getNextMilestone(collab)?.title}</p>
                                {getNextMilestone(collab)?.dueDate && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs bg-blue-50 text-blue-800 border-blue-100"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDistance(parseISO(getNextMilestone(collab)?.dueDate!), new Date(), { 
                                      addSuffix: true,
                                      locale: fr 
                                    })}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </Tabs>
          </div>
          
          {/* Détails de la collaboration */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedCollaboration ? (
              <div className="flex items-center justify-center h-full text-center p-12 border rounded-lg border-dashed">
                <div>
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez une collaboration</h3>
                  <p className="text-muted-foreground">Cliquez sur une collaboration pour voir les détails et suivre votre progression.</p>
                </div>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{selectedCollaboration.eventTitle}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <CalendarDays className="h-4 w-4 mr-1" /> 
                          {format(parseISO(selectedCollaboration.eventDate), "EEEE d MMMM yyyy", { locale: fr })}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(selectedCollaboration.status)}`}
                      >
                        {getStatusText(selectedCollaboration.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage src={selectedCollaboration.clubImage} alt={selectedCollaboration.clubName} />
                            <AvatarFallback>{selectedCollaboration.clubName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{selectedCollaboration.clubName}</h3>
                            <p className="text-sm text-muted-foreground">{selectedCollaboration.clubLocation}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Cachet:</span>
                            <span className="font-semibold">{selectedCollaboration.fee.toLocaleString()} Ar</span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Audience prévue:</span>
                            <span>{selectedCollaboration.expectedAttendees.toLocaleString()} personnes</span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Collaboration créée le:</span>
                            <span>{format(parseISO(selectedCollaboration.created), "d MMM yyyy", { locale: fr })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dernière mise à jour:</span>
                            <span>{format(parseISO(selectedCollaboration.lastUpdated), "d MMM yyyy", { locale: fr })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium flex items-center">
                          <PieChart className="h-4 w-4 mr-2" />
                          Progression globale
                        </h3>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Avancement:</span>
                            <span className="font-medium">{selectedCollaboration.progress}%</span>
                          </div>
                          <Progress value={selectedCollaboration.progress} className="h-3" />
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {selectedCollaboration.milestones.filter(m => m.status === "completed").length}
                            </div>
                            <div className="text-muted-foreground mt-1">Terminés</div>
                          </div>
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {selectedCollaboration.milestones.filter(m => m.status === "in_progress").length}
                            </div>
                            <div className="text-muted-foreground mt-1">En cours</div>
                          </div>
                          <div className="rounded-md bg-muted p-2">
                            <div className="font-medium">
                              {selectedCollaboration.milestones.filter(m => m.status === "pending").length}
                            </div>
                            <div className="text-muted-foreground mt-1">À venir</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="milestones" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="milestones">Étapes</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="milestones" className="space-y-4">
                    <Collapsible 
                      open={expandedMilestones[selectedCollaboration.id] || false}
                      onOpenChange={() => toggleMilestoneExpansion(selectedCollaboration.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Jalons de la collaboration</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="ml-1">
                              {expandedMilestones[selectedCollaboration.id] ? "Réduire" : "Voir tout"}
                            </span>
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <div className="mt-4 space-y-4">
                        {/* Jalon en cours ou à venir le plus proche d'abord */}
                        {selectedCollaboration.milestones
                          .filter(milestone => milestone.status !== "completed")
                          .sort((a, b) => {
                            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                            return dateA - dateB;
                          })
                          .slice(0, expandedMilestones[selectedCollaboration.id] ? undefined : 2)
                          .map(milestone => (
                            <Card key={milestone.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <h4 className="font-semibold">{milestone.title}</h4>
                                      <Badge 
                                        variant="outline" 
                                        className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                      >
                                        {getMilestoneStatusText(milestone.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      {milestone.dueDate && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                          <CalendarRange className="h-3 w-3 mr-1" />
                                          {format(parseISO(milestone.dueDate), "d MMM yyyy", { locale: fr })}
                                        </Badge>
                                      )}
                                      <Badge variant="outline" className={getPriorityColor(milestone.priority)}>
                                        Priorité: {getPriorityText(milestone.priority)}
                                      </Badge>
                                      <Badge variant="outline">
                                        Assigné à: {getAssignedToText(milestone.assignedTo)}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {milestone.status === "pending" && (
                                    <Button size="sm" className="ml-4">
                                      Démarrer
                                    </Button>
                                  )}
                                  
                                  {milestone.status === "in_progress" && (
                                    <Button size="sm" className="ml-4">
                                      Terminer
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        
                        <CollapsibleContent className="space-y-4">
                          {/* Jalons terminés */}
                          <h4 className="font-medium flex items-center text-muted-foreground mt-4">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Étapes terminées
                          </h4>
                          
                          {selectedCollaboration.milestones
                            .filter(milestone => milestone.status === "completed")
                            .sort((a, b) => {
                              const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                              const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                              return dateB - dateA; // Plus récent en premier
                            })
                            .map(milestone => (
                              <Card key={milestone.id} className="bg-muted/30">
                                <CardContent className="p-4">
                                  <div className="flex items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-1">
                                        <h4 className="font-semibold text-muted-foreground">{milestone.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                        >
                                          {getMilestoneStatusText(milestone.status)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                      
                                      <div className="flex flex-wrap gap-2 text-xs">
                                        {milestone.completedAt && (
                                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-100">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Terminé le {format(parseISO(milestone.completedAt), "d MMM yyyy", { locale: fr })}
                                          </Badge>
                                        )}
                                        {milestone.dueDate && (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                            <CalendarRange className="h-3 w-3 mr-1" />
                                            Date limite: {format(parseISO(milestone.dueDate), "d MMM yyyy", { locale: fr })}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                          {/* Jalons en attente au-delà de la limite initiale */}
                          {selectedCollaboration.milestones
                            .filter(milestone => milestone.status !== "completed")
                            .sort((a, b) => {
                              const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                              const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                              return dateA - dateB;
                            })
                            .slice(2)
                            .map(milestone => (
                              <Card key={milestone.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-1">
                                        <h4 className="font-semibold">{milestone.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={`ml-2 ${getMilestoneStatusColor(milestone.status)}`}
                                        >
                                          {getMilestoneStatusText(milestone.status)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                      
                                      <div className="flex flex-wrap gap-2 text-xs">
                                        {milestone.dueDate && (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                                            <CalendarRange className="h-3 w-3 mr-1" />
                                            {format(parseISO(milestone.dueDate), "d MMM yyyy", { locale: fr })}
                                          </Badge>
                                        )}
                                        <Badge variant="outline" className={getPriorityColor(milestone.priority)}>
                                          Priorité: {getPriorityText(milestone.priority)}
                                        </Badge>
                                        <Badge variant="outline">
                                          Assigné à: {getAssignedToText(milestone.assignedTo)}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {milestone.status === "pending" && (
                                      <Button size="sm" className="ml-4">
                                        Démarrer
                                      </Button>
                                    )}
                                    
                                    {milestone.status === "in_progress" && (
                                      <Button size="sm" className="ml-4">
                                        Terminer
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </TabsContent>
                  
                  <TabsContent value="messages" className="space-y-4">
                    <h3 className="text-lg font-semibold">Messagerie</h3>
                    
                    <div className="rounded-lg border h-[400px] flex flex-col">
                      <div className="p-4 flex-1 overflow-y-auto space-y-4">
                        {selectedCollaboration.messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2 opacity-30" />
                              <p className="text-muted-foreground">Aucun message pour le moment</p>
                            </div>
                          </div>
                        ) : (
                          selectedCollaboration.messages.map(msg => (
                            <div 
                              key={msg.id}
                              className={`flex ${msg.senderType === "artist" ? "justify-end" : ""}`}
                            >
                              <div 
                                className={`flex max-w-[75%] ${
                                  msg.senderType === "artist" 
                                    ? "flex-row-reverse" 
                                    : "flex-row"
                                }`}
                              >
                                <Avatar className={`h-8 w-8 ${msg.senderType === "artist" ? "ml-2" : "mr-2"}`}>
                                  <AvatarImage src={msg.senderImage} alt={msg.sender} />
                                  <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className={`text-xs mb-1 ${
                                    msg.senderType === "artist" ? "text-right" : "text-left"
                                  }`}>
                                    <span className="font-medium">{msg.sender}</span>
                                    <span className="text-muted-foreground ml-2">
                                      {format(parseISO(msg.timestamp), "d MMM yyyy HH:mm", { locale: fr })}
                                    </span>
                                  </div>
                                  <div className={`rounded-lg p-3 ${
                                    msg.senderType === "artist" 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-muted"
                                  }`}>
                                    <p className="text-sm">{msg.content}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Écrivez votre message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button onClick={handleSendMessage} disabled={!message.trim()}>
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}