// D:\Projet\BeBit\bebit - new\client\src\pages\club\invitations-page.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import {
  Plus,
  Eye,
  X,
  RotateCw,
  Send,
  FileText,
  CalendarDays,
  Trash2,
  ChevronRight,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
  ExternalLink
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  time: string;
}

interface Artist {
  id: number;
  name: string;
  avatarUrl: string;
  genres: string[];
  location: string;
  email: string;
  phone?: string;
  feeRange: string;
  rating: number;
  verified: boolean;
}

interface Invitation {
  id: number;
  artistId: number;
  artist: Artist;
  eventId?: number;
  event?: Event;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'confirmed';
  eventName: string;
  eventDate: Date;
  message: string;
  startTime: string;
  endTime: string;
  fee: number;
  createdAt: Date;
  responseDate?: Date;
  responseMessage?: string;
  readByArtist: boolean;
  contractSigned: boolean;
}

// Données fictives
const events: Event[] = [
  {
    id: 1,
    title: "Soirée Électro Summer",
    date: "2025-11-15",
    location: "Terrasse principale",
    time: "22:00 - 02:00"
  },
  {
    id: 2,
    title: "Soirée Jazz & Cocktails",
    date: "2025-12-10",
    location: "Salon VIP",
    time: "20:00 - 23:00"
  },
  {
    id: 3,
    title: "Brunch Acoustique",
    date: "2025-10-28",
    location: "Salle principale",
    time: "11:00 - 14:00"
  },
  {
    id: 4,
    title: "Nuit Hip-Hop",
    date: "2026-01-05",
    location: "Club entier",
    time: "23:00 - 04:00"
  },
  {
    id: 5,
    title: "Soirée Fusion Élégante",
    date: "2025-11-20",
    location: "Salon VIP",
    time: "21:00 - 00:00"
  },
  {
    id: 6,
    title: "Nuit Tropicale",
    date: "2025-12-25",
    location: "Piste de danse extérieure",
    time: "21:00 - 03:00"
  }
];

const artists: Artist[] = [
  {
    id: 1,
    name: "DJ Elektra",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    genres: ["House", "Techno", "EDM"],
    location: "Paris",
    email: "dj.elektra@example.com",
    phone: "+33 6 12 34 56 78",
    feeRange: "800€ - 1200€",
    rating: 4.8,
    verified: true
  },
  {
    id: 2,
    name: "Sax Master",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    genres: ["Jazz", "Funk", "Soul"],
    location: "Lyon",
    email: "saxmaster@example.com",
    feeRange: "600€ - 900€",
    rating: 4.6,
    verified: true
  },
  {
    id: 3,
    name: "Melodic Vibes",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    genres: ["Pop", "R&B", "Acoustic"],
    location: "Marseille",
    email: "melodic.vibes@example.com",
    phone: "+33 6 23 45 67 89",
    feeRange: "500€ - 800€",
    rating: 4.9,
    verified: false
  },
  {
    id: 4,
    name: "Beat Collective",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    genres: ["Hip-Hop", "Trap", "Reggaeton"],
    location: "Nice",
    email: "beat.collective@example.com",
    phone: "+33 7 12 34 56 78",
    feeRange: "900€ - 1300€",
    rating: 4.7,
    verified: true
  },
  {
    id: 5,
    name: "Electric Strings",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    genres: ["Classical", "Electronic", "Fusion"],
    location: "Bordeaux",
    email: "electric.strings@example.com",
    feeRange: "700€ - 1100€",
    rating: 4.5,
    verified: true
  },
  {
    id: 6,
    name: "Tropical Beats",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    genres: ["Reggae", "Afrobeat", "Dancehall"],
    location: "Toulouse",
    email: "tropical.beats@example.com",
    phone: "+33 6 98 76 54 32",
    feeRange: "700€ - 1000€",
    rating: 4.7,
    verified: true
  }
];

const initialInvitations: Invitation[] = [
  {
    id: 1,
    artistId: 1,
    artist: artists[0],
    eventId: 1,
    event: events[0],
    status: 'accepted' as const,
    eventName: "Soirée Électro Summer",
    eventDate: new Date(2025, 10, 15),
    message: "Nous aimerions vous avoir comme DJ principal pour notre soirée électro d'été. Votre style unique correspond parfaitement à l'ambiance que nous voulons créer.",
    startTime: "22:00",
    endTime: "02:00",
    fee: 120000,
    createdAt: new Date(2025, 9, 20),
    responseDate: new Date(2025, 9, 22),
    responseMessage: "Je serai ravi de jouer à votre événement. Merci pour cette invitation!",
    readByArtist: true,
    contractSigned: true
  },
  {
    id: 2,
    artistId: 2,
    artist: artists[1],
    eventId: 2,
    event: events[1],
    status: 'pending' as const,
    eventName: "Soirée Jazz & Cocktails",
    eventDate: new Date(2025, 11, 10),
    message: "Nous organisons une soirée jazz sophistiquée et nous pensons que votre talent au saxophone serait parfait pour créer l'ambiance que nous recherchons.",
    startTime: "20:00",
    endTime: "23:00",
    fee: 95000,
    createdAt: new Date(2025, 10, 5),
    readByArtist: false,
    contractSigned: false
  },
  {
    id: 3,
    artistId: 3,
    artist: artists[2],
    eventId: 3,
    event: events[2],
    status: 'declined' as const,
    eventName: "Brunch Acoustique",
    eventDate: new Date(2025, 9, 28),
    message: "Nous aimerions vous avoir pour notre brunch dominical. Une performance acoustique douce serait parfaite pour notre clientèle.",
    startTime: "11:00",
    endTime: "14:00",
    fee: 85000,
    createdAt: new Date(2025, 9, 10),
    responseDate: new Date(2025, 9, 12),
    responseMessage: "Je vous remercie pour votre invitation, mais je ne suis malheureusement pas disponible à cette date.",
    readByArtist: true,
    contractSigned: false
  },
  {
    id: 4,
    artistId: 4,
    artist: artists[3],
    eventId: 4,
    event: events[3],
    status: 'confirmed' as const,
    eventName: "Nuit Hip-Hop",
    eventDate: new Date(2026, 0, 5),
    message: "Nous organisons une soirée spéciale hip-hop et nous aimerions que vous soyez nos DJs principaux pour la nuit.",
    startTime: "23:00",
    endTime: "04:00",
    fee: 110000,
    createdAt: new Date(2025, 10, 1),
    responseDate: new Date(2025, 10, 3),
    responseMessage: "Nous sommes disponibles et ravis de participer à votre événement.",
    readByArtist: true,
    contractSigned: true
  },
  {
    id: 5,
    artistId: 5,
    artist: artists[4],
    eventId: 5,
    event: events[4],
    status: 'cancelled' as const,
    eventName: "Soirée Fusion Élégante",
    eventDate: new Date(2025, 10, 20),
    message: "Votre style fusion unique serait parfait pour notre événement haut de gamme. Nous serions ravis de vous avoir.",
    startTime: "21:00",
    endTime: "00:00",
    fee: 130000,
    createdAt: new Date(2025, 9, 15),
    responseDate: new Date(2025, 9, 18),
    responseMessage: "J'accepte avec plaisir votre invitation.",
    readByArtist: true,
    contractSigned: false
  },
  {
    id: 6,
    artistId: 6,
    artist: artists[5],
    eventId: 6,
    event: events[5],
    status: 'pending' as const,
    eventName: "Nuit Tropicale",
    eventDate: new Date(2025, 11, 25),
    message: "Rejoignez-nous pour une nuit tropicale enflammée ! Votre énergie reggae est idéale pour cette ambiance festive.",
    startTime: "21:00",
    endTime: "03:00",
    fee: 90000,
    createdAt: new Date(2025, 10, 6),
    readByArtist: true,
    contractSigned: false
  }
];

// Config stats
const invitationStatsConfig = {
  statuses: {
    pending: { label: 'En attente', color: 'yellow' },
    accepted: { label: 'Accepté', color: 'green' },
    declined: { label: 'Refusé', color: 'red' },
    cancelled: { label: 'Annulé', color: 'slate' },
    confirmed: { label: 'Confirmé', color: 'green' }
  }
};

// Formatage
const formatCurrency = (value: number) => {
  return (value / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Composant principal
const ClubInvitationsPage = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewInvitationDialog, setShowNewInvitationDialog] = useState(false);
  const [selectedArtistDetail, setSelectedArtistDetail] = useState<Artist | null>(null);
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
  const [selectedInvitations, setSelectedInvitations] = useState<Invitation[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [newInvitation, setNewInvitation] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    fee: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInvitations(initialInvitations);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredInvitations = invitations
    .filter(invitation => {
      if (statusFilter === 'all') return true;
      return invitation.status === statusFilter;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const getInvitationsForArtist = (artistId: number) => {
    return invitations.filter(inv => inv.artistId === artistId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const getStatusBadge = (status: string) => {
    const config = invitationStatsConfig.statuses[status as keyof typeof invitationStatsConfig.statuses];
    if (!config) return <Badge variant="outline">Inconnu</Badge>;

    const variantClass = `text-${config.color}-600 dark:text-${config.color}-500`;
    return <Badge variant="outline" className={variantClass}>{config.label}</Badge>;
  };

  const handleSendInvitation = async () => {
    if (!selectedArtist || (!selectedEvent && (!newInvitation.eventName || !newInvitation.eventDate ||
        !newInvitation.startTime || !newInvitation.endTime)) || !newInvitation.fee ||
        !newInvitation.message) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const artist = artists.find(a => a.id.toString() === selectedArtist);
    if (!artist) {
      setIsSubmitting(false);
      return;
    }

    let eventData: Event | undefined;
    let eventName = newInvitation.eventName;
    let eventDate = new Date(newInvitation.eventDate);
    let startTime = newInvitation.startTime;
    let endTime = newInvitation.endTime;

    if (selectedEvent) {
      eventData = events.find(e => e.id.toString() === selectedEvent);
      if (eventData) {
        eventName = eventData.title;
        eventDate = new Date(eventData.date);
        const [start, end] = eventData.time.split(' - ');
        startTime = start;
        endTime = end;
      }
    }

    const newInvitationObj: Invitation = {
      id: invitations.length + 1,
      artistId: artist.id,
      artist,
      eventId: selectedEvent ? parseInt(selectedEvent) : undefined,
      event: eventData,
      status: 'pending',
      eventName,
      eventDate,
      message: newInvitation.message,
      startTime,
      endTime,
      fee: parseInt(newInvitation.fee) * 100,
      createdAt: new Date(),
      readByArtist: false,
      contractSigned: false
    };

    setInvitations(prev => [newInvitationObj, ...prev]);
    setShowNewInvitationDialog(false);

    setSelectedArtist('');
    setSelectedEvent('');
    setNewInvitation({
      eventName: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      fee: '',
      message: ''
    });

    toast({
      title: "Invitation envoyée",
      description: `Invitation envoyée à ${artist.name} pour ${eventName}`,
    });

    setIsSubmitting(false);
  };

  const openArtistDetails = (invitation: Invitation) => {
    setSelectedArtistDetail(invitation.artist);
  };

  const cancelInvitation = (id: number) => {
    setInvitations(prev => prev.map(inv =>
      inv.id === id ? { ...inv, status: 'cancelled' as const } : inv
    ));
    toast({
      title: "Invitation annulée",
      description: "L'invitation a été annulée avec succès",
    });
  };

  const removeInvitation = (id: number) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
    toast({
      title: "Invitation supprimée",
      description: "L'invitation a été supprimée définitivement",
    });
  };

  const resendInvitation = (id: number) => {
    setInvitations(prev => prev.map(inv =>
      inv.id === id ? { ...inv, status: 'pending' as const, createdAt: new Date(), readByArtist: false } : inv
    ));
    toast({
      title: "Invitation renvoyée",
      description: "L'invitation a été renvoyée à l'artiste",
    });
  };

  const handleOpenInvitationsModal = () => {
    setSelectedInvitations(filteredInvitations);
    setIsInvitationsModalOpen(true);
  };

  const handleMarkAsRead = (invitationId: number) => {
    setSelectedInvitations(prev => prev.map(inv => inv.id === invitationId ? { ...inv, readByArtist: true } : inv));
    toast({ title: "Marqué comme lu", description: "L'invitation a été marquée comme lue" });
  };

  const handleSignContract = (invitationId: number) => {
    setSelectedInvitations(prev => prev.map(inv => inv.id === invitationId ? { ...inv, contractSigned: true } : inv));
    toast({ title: "Contrat signé", description: "Le contrat a été marqué comme signé" });
  };

  const handleExportInvitations = () => {
    const csvContent = `ID,Artiste,Événement,Date,Cachet,Statut\n${selectedInvitations.map(inv => `${inv.id},"${inv.artist.name}","${inv.eventName}",${formatDate(inv.eventDate)},${inv.fee},${inv.status}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitations.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export", description: "Liste des invitations exportée en CSV" });
  };

  const InvitationSkeleton = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-40 mt-4 lg:mt-0" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <InvitationSkeleton key={i} />)}
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Invitations aux artistes</h1>
            <p className="text-lg text-muted-foreground mt-1">Gérez vos demandes de prestations artistiques</p>
          </div>

          <Button
            onClick={() => setShowNewInvitationDialog(true)}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle invitation
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filtrer les invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="status-filter">Statut</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className="mt-1">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="accepted">Accepté</SelectItem>
                      <SelectItem value="declined">Refusé</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="date-filter">Période</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="date-filter" className="mt-1">
                      <SelectValue placeholder="Toutes les périodes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les périodes</SelectItem>
                      <SelectItem value="upcoming">À venir</SelectItem>
                      <SelectItem value="past">Passées</SelectItem>
                      <SelectItem value="this_month">Ce mois-ci</SelectItem>
                      <SelectItem value="next_month">Mois prochain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="sort-filter">Trier par</Label>
                  <Select defaultValue="date_desc">
                    <SelectTrigger id="sort-filter" className="mt-1">
                      <SelectValue placeholder="Date (récent → ancien)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date_desc">Date (récent → ancien)</SelectItem>
                      <SelectItem value="date_asc">Date (ancien → récent)</SelectItem>
                      <SelectItem value="event_date">Date d'événement</SelectItem>
                      <SelectItem value="fee_desc">Cachet (élevé → bas)</SelectItem>
                      <SelectItem value="fee_asc">Cachet (bas → élevé)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleOpenInvitationsModal} className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
                    <Eye className="h-4 w-4" />
                    Vue tableau ({filteredInvitations.length} invitations)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvitations.length > 0 ? (
                filteredInvitations.map((invitation, index) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <CardTitle className="mr-2">{invitation.eventName}</CardTitle>
                              {getStatusBadge(invitation.status)}
                            </div>
                            <CardDescription className="mt-1">
                              {formatDate(invitation.eventDate)} • {invitation.startTime} - {invitation.endTime}
                            </CardDescription>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openArtistDetails(invitation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={invitation.artist.avatarUrl} alt={invitation.artist.name} />
                            <AvatarFallback>{invitation.artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{invitation.artist.name}</div>
                            <div className="text-sm text-muted-foreground">{invitation.artist.genres.join(', ')}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <div className="text-muted-foreground">Cachet</div>
                            <div className="font-medium">{formatCurrency(invitation.fee)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Envoyé le</div>
                            <div className="font-medium">{formatDate(invitation.createdAt)}</div>
                          </div>
                        </div>

                        <div className="text-sm line-clamp-2 text-muted-foreground">
                          Message: {invitation.message}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 pt-3">
                        <div className="w-full flex justify-between">
                          {invitation.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelInvitation(invitation.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                          )}
                          {invitation.status === 'declined' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resendInvitation(invitation.id)}
                            >
                              <RotateCw className="h-3 w-3 mr-1" />
                              Renvoyer
                            </Button>
                          )}
                          {(invitation.status === 'cancelled' || invitation.status === 'declined') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvitation(invitation.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          )}
                          {invitation.status === 'accepted' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Contrat
                            </Button>
                          )}
                          {invitation.status === 'confirmed' && (
                            <Button
                              variant="default"
                              size="sm"
                            >
                              <CalendarDays className="h-3 w-3 mr-1" />
                              Détails
                            </Button>
                          )}
                          <span className="flex-grow"></span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openArtistDetails(invitation)}
                          >
                            Détails
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center">
                  <div className="text-muted-foreground">
                    Aucune invitation ne correspond aux critères sélectionnés
                  </div>
                  {statusFilter !== 'all' && (
                    <Button variant="outline" className="mt-4" onClick={() => setStatusFilter('all')}>
                      Afficher toutes les invitations
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="text-4xl font-bold text-yellow-600">{invitations.filter(i => i.status === 'pending').length}</div>
                  <div className="text-sm text-muted-foreground mt-1">En attente</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="text-4xl font-bold text-green-600">{invitations.filter(i => i.status === 'accepted' || i.status === 'confirmed').length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Acceptées</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="text-4xl font-bold text-red-600">{invitations.filter(i => i.status === 'declined').length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Refusées</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="text-4xl font-bold text-green-600">{invitations.filter(i => i.status === 'confirmed').length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Confirmées</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modal tableau */}
        <Dialog open={isInvitationsModalOpen} onOpenChange={setIsInvitationsModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Gestion des invitations</DialogTitle>
              <DialogDescription>
                Visualisez et gérez toutes les invitations envoyées. {selectedInvitations.length} invitations au total.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Invitations totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedInvitations.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedInvitations.filter(i => i.status === 'confirmed').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cachet total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(selectedInvitations.reduce((acc, i) => acc + i.fee, 0))}</div>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Artiste</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Date événement</TableHead>
                    <TableHead>Cachet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Lu par artiste</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvitations.map((invitation) => (
                    <TableRow key={invitation.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{invitation.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invitation.artist.name}</p>
                          <p className="text-sm text-muted-foreground">{invitation.artist.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{invitation.eventName}</TableCell>
                      <TableCell>{formatDate(invitation.eventDate)}</TableCell>
                      <TableCell>{formatCurrency(invitation.fee)}</TableCell>
                      <TableCell>
                        {getStatusBadge(invitation.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invitation.readByArtist ? 'default' : 'secondary'}>
                          {invitation.readByArtist ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                          {invitation.readByArtist ? 'Lu' : 'Non lu'}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {!invitation.readByArtist && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(invitation.id)}>
                            Marquer lu
                          </Button>
                        )}
                        {invitation.status === 'accepted' && !invitation.contractSigned && (
                          <Button size="sm" variant="outline" onClick={() => handleSignContract(invitation.id)}>
                            Signer contrat
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => removeInvitation(invitation.id)}>
                          Supprimer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openArtistDetails(invitation)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleExportInvitations}>
                <Download className="h-4 w-4 mr-2" /> Exporter CSV
              </Button>
              <Button variant="outline" onClick={() => setIsInvitationsModalOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog nouvelle invitation */}
        <Dialog open={showNewInvitationDialog} onOpenChange={setShowNewInvitationDialog}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Nouvelle invitation</DialogTitle>
              <DialogDescription>
                Envoyez une invitation à un artiste pour votre événement.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="artist">Artiste</Label>
                <Select
                  value={selectedArtist}
                  onValueChange={setSelectedArtist}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="artist">
                    <SelectValue placeholder="Sélectionner un artiste" />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map(artist => (
                      <SelectItem key={artist.id} value={artist.id.toString()}>
                        {artist.name} - {artist.genres[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="event">Événement</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Choisir un événement existant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nouvel événement</SelectItem>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title} - {formatDate(new Date(event.date))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedEvent && (
                <>
                  <div>
                    <Label htmlFor="event-name">Nom de l'événement</Label>
                    <Input
                      id="event-name"
                      value={newInvitation.eventName}
                      onChange={e => setNewInvitation({...newInvitation, eventName: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="event-date">Date de l'événement</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newInvitation.eventDate}
                      onChange={e => setNewInvitation({...newInvitation, eventDate: e.target.value})}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Heure de début</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newInvitation.startTime}
                        onChange={e => setNewInvitation({...newInvitation, startTime: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">Heure de fin</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newInvitation.endTime}
                        onChange={e => setNewInvitation({...newInvitation, endTime: e.target.value})}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="fee">Cachet proposé (en Ariary)</Label>
                <Input
                  id="fee"
                  type="number"
                  value={newInvitation.fee}
                  onChange={e => setNewInvitation({...newInvitation, fee: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={newInvitation.message}
                  onChange={e => setNewInvitation({...newInvitation, message: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewInvitationDialog(false)} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handleSendInvitation} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isSubmitting ? 'Envoi...' : 'Envoyer l\'invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog détails artiste */}
        <Dialog open={!!selectedArtistDetail} onOpenChange={(open) => !open && setSelectedArtistDetail(null)}>
          {selectedArtistDetail && (
            <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>Détails de l'artiste: {selectedArtistDetail.name}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="flex flex-col items-center text-center mb-4">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Avatar className="h-16 w-16 mb-3 shadow-lg">
                        <AvatarImage src={selectedArtistDetail.avatarUrl} alt={selectedArtistDetail.name} />
                        <AvatarFallback>{selectedArtistDetail.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <h3 className="font-bold text-lg">{selectedArtistDetail.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{selectedArtistDetail.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {selectedArtistDetail.genres.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Emplacement</div>
                      <div>{selectedArtistDetail.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Contact</div>
                      <div>{selectedArtistDetail.email}</div>
                      {selectedArtistDetail.phone && <div>{selectedArtistDetail.phone}</div>}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Fourchette de prix habituelle</div>
                      <div>{selectedArtistDetail.feeRange}</div>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le profil
                  </Button>
                </div>

                <div className="lg:w-2/3">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Messages envoyés</h3>
                    {getInvitationsForArtist(selectedArtistDetail.id).length > 0 ? (
                      <div className="space-y-4">
                        {getInvitationsForArtist(selectedArtistDetail.id).map(invitation => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Card>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">{invitation.eventName}</h4>
                                    <p className="text-sm text-muted-foreground">{formatDate(invitation.eventDate)} • {invitation.startTime} - {invitation.endTime}</p>
                                  </div>
                                  {getStatusBadge(invitation.status)}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">Message:</p>
                                <p className="text-sm">{invitation.message}</p>
                                {invitation.responseMessage && (
                                  <div className="mt-3 p-2 bg-secondary rounded">
                                    <p className="text-sm font-medium">Réponse:</p>
                                    <p className="text-sm italic">{invitation.responseMessage}</p>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="pt-2">
                                <div className="text-xs text-muted-foreground">
                                  Envoyé le {formatDate(invitation.createdAt)}
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun message envoyé à cet artiste.</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default ClubInvitationsPage;