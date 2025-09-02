import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { useToast } from "../../hooks/use-toast";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import {
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  Check,
  X,
  RotateCcw,
  Send,
  Mail,
  FileText,
  CalendarDays,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Plus,
  Users,
  Music,
  Star,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

// Types
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

// Données fictives pour les artistes
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
  }
];

// Données fictives pour les invitations
const initialInvitations: Invitation[] = [
  {
    id: 1,
    artistId: 1,
    artist: artists[0],
    status: 'accepted' as const,
    eventName: "Soirée Électro Summer",
    eventDate: new Date(2025, 5, 15), // 15 juin 2025
    message: "Nous aimerions vous avoir comme DJ principal pour notre soirée électro d'été. Votre style unique correspond parfaitement à l'ambiance que nous voulons créer.",
    startTime: "22:00",
    endTime: "02:00",
    fee: 120000,
    createdAt: new Date(2025, 4, 20), // 20 mai 2025
    responseDate: new Date(2025, 4, 22), // 22 mai 2025
    responseMessage: "Je serai ravi de jouer à votre événement. Merci pour cette invitation!",
    readByArtist: true,
    contractSigned: true
  },
  {
    id: 2,
    artistId: 2,
    artist: artists[1],
    status: 'pending' as const,
    eventName: "Soirée Jazz & Cocktails",
    eventDate: new Date(2025, 6, 10), // 10 juillet 2025
    message: "Nous organisons une soirée jazz sophistiquée et nous pensons que votre talent au saxophone serait parfait pour créer l'ambiance que nous recherchons.",
    startTime: "20:00",
    endTime: "23:00",
    fee: 95000,
    createdAt: new Date(2025, 5, 25), // 25 juin 2025
    readByArtist: false,
    contractSigned: false
  },
  {
    id: 3,
    artistId: 3,
    artist: artists[2],
    status: 'declined' as const,
    eventName: "Brunch Acoustique",
    eventDate: new Date(2025, 5, 28), // 28 juin 2025
    message: "Nous aimerions vous avoir pour notre brunch dominical. Une performance acoustique douce serait parfaite pour notre clientèle.",
    startTime: "11:00",
    endTime: "14:00",
    fee: 85000,
    createdAt: new Date(2025, 5, 10), // 10 juin 2025
    responseDate: new Date(2025, 5, 12), // 12 juin 2025
    responseMessage: "Je vous remercie pour votre invitation, mais je ne suis malheureusement pas disponible à cette date.",
    readByArtist: true,
    contractSigned: false
  },
  {
    id: 4,
    artistId: 4,
    artist: artists[3],
    status: 'confirmed' as const,
    eventName: "Nuit Hip-Hop",
    eventDate: new Date(2025, 7, 5), // 5 août 2025
    message: "Nous organisons une soirée spéciale hip-hop et nous aimerions que vous soyez nos DJs principaux pour la nuit.",
    startTime: "23:00",
    endTime: "04:00",
    fee: 110000,
    createdAt: new Date(2025, 6, 1), // 1 juillet 2025
    responseDate: new Date(2025, 6, 3), // 3 juillet 2025
    responseMessage: "Nous sommes disponibles et ravis de participer à votre événement.",
    readByArtist: true,
    contractSigned: true
  },
  {
    id: 5,
    artistId: 5,
    artist: artists[4],
    status: 'cancelled' as const,
    eventName: "Soirée Fusion Élégante",
    eventDate: new Date(2025, 6, 20), // 20 juillet 2025
    message: "Votre style fusion unique serait parfait pour notre événement haut de gamme. Nous serions ravis de vous avoir.",
    startTime: "21:00",
    endTime: "00:00",
    fee: 130000,
    createdAt: new Date(2025, 5, 15), // 15 juin 2025
    responseDate: new Date(2025, 5, 18), // 18 juin 2025
    responseMessage: "J'accepte avec plaisir votre invitation.",
    readByArtist: true,
    contractSigned: false
  }
];

// Formatage monétaire
const formatCurrency = (value: number) => {
  return (value/100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Formatage de la date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const ClubInvitationsPage = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewInvitationDialog, setShowNewInvitationDialog] = useState(false);
  const [invitationDetail, setInvitationDetail] = useState<Invitation | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [newInvitation, setNewInvitation] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    fee: '',
    message: ''
  });
  
  // Filtrer les invitations selon le statut
  const filteredInvitations = invitations.filter(invitation => {
    if (statusFilter === 'all') return true;
    return invitation.status === statusFilter;
  });
  
  // Obtenir le style de badge selon le statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 dark:text-yellow-500">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 dark:text-green-500">Accepté</Badge>;
      case 'declined':
        return <Badge variant="outline" className="text-red-600 dark:text-red-500">Refusé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-slate-600 dark:text-slate-500">Annulé</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-600 text-white">Confirmé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  // Envoyer une invitation
  const handleSendInvitation = () => {
    if (!selectedArtist || !newInvitation.eventName || !newInvitation.eventDate || 
        !newInvitation.startTime || !newInvitation.endTime || !newInvitation.fee || 
        !newInvitation.message) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }
    
    const artist = artists.find(a => a.id.toString() === selectedArtist);
    if (!artist) return;
    
    const newInvitationObj: Invitation = {
      id: invitations.length + 1,
      artistId: artist.id,
      artist,
      status: 'pending',
      eventName: newInvitation.eventName,
      eventDate: new Date(newInvitation.eventDate),
      message: newInvitation.message,
      startTime: newInvitation.startTime,
      endTime: newInvitation.endTime,
      fee: parseInt(newInvitation.fee) * 100, // Convertir en centimes
      createdAt: new Date(),
      readByArtist: false,
      contractSigned: false
    };
    
    setInvitations([...invitations, newInvitationObj]);
    setShowNewInvitationDialog(false);
    
    // Réinitialiser le formulaire
    setSelectedArtist('');
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
      description: `Invitation envoyée à ${artist.name}`,
    });
  };
  
  // Annuler une invitation
  const cancelInvitation = (id: number) => {
    const updatedInvitations = invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'cancelled' as const } : inv
    );
    setInvitations(updatedInvitations);
    
    toast({
      title: "Invitation annulée",
      description: "L'invitation a été annulée avec succès",
    });
    
    // Fermer la boîte de dialogue de détail si elle est ouverte
    if (invitationDetail && invitationDetail.id === id) {
      setInvitationDetail(null);
    }
  };
  
  // Retirer une invitation (supprimer)
  const removeInvitation = (id: number) => {
    const updatedInvitations = invitations.filter(inv => inv.id !== id);
    setInvitations(updatedInvitations);
    
    toast({
      title: "Invitation supprimée",
      description: "L'invitation a été supprimée définitivement",
    });
    
    // Fermer la boîte de dialogue de détail si elle est ouverte
    if (invitationDetail && invitationDetail.id === id) {
      setInvitationDetail(null);
    }
  };
  
  // Renvoyer une invitation
  const resendInvitation = (id: number) => {
    const updatedInvitations = invitations.map(inv => 
      inv.id === id ? { ...inv, status: 'pending' as const, createdAt: new Date(), readByArtist: false } : inv
    );
    setInvitations(updatedInvitations);
    
    toast({
      title: "Invitation renvoyée",
      description: "L'invitation a été renvoyée à l'artiste",
    });
  };
  
  return (
    <ResponsiveLayout>
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Invitations aux artistes</h1>
            <p className="text-lg text-muted-foreground mt-1">Gérez vos demandes de prestations artistiques</p>
          </div>
          
          <Button
            onClick={() => setShowNewInvitationDialog(true)}
            className="mt-4 lg:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle invitation
          </Button>
        </div>
        
        {/* Filtres d'affichage */}
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
            </div>
          </CardContent>
        </Card>
        
        {/* Liste des invitations */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map(invitation => (
                <Card key={invitation.id} className="overflow-hidden">
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
                        onClick={() => setInvitationDetail(invitation)}
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
                          <RotateCcw className="h-3 w-3 mr-1" />
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
                        onClick={() => setInvitationDetail(invitation)}
                      >
                        Détails
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
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
        </div>
        
        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques d'invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold">{invitations.filter(i => i.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground mt-1">En attente</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold">{invitations.filter(i => i.status === 'accepted' || i.status === 'confirmed').length}</div>
                <div className="text-sm text-muted-foreground mt-1">Acceptées</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold">{invitations.filter(i => i.status === 'declined').length}</div>
                <div className="text-sm text-muted-foreground mt-1">Refusées</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl font-bold text-green-600">{invitations.filter(i => i.status === 'confirmed').length}</div>
                <div className="text-sm text-muted-foreground mt-1">Confirmées</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Boîte de dialogue pour nouvelle invitation */}
        <Dialog open={showNewInvitationDialog} onOpenChange={setShowNewInvitationDialog}>
          <DialogContent className="max-w-md">
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
                <Label htmlFor="event-name">Nom de l'événement</Label>
                <Input 
                  id="event-name" 
                  value={newInvitation.eventName}
                  onChange={e => setNewInvitation({...newInvitation, eventName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="event-date">Date de l'événement</Label>
                <Input 
                  id="event-date" 
                  type="date" 
                  value={newInvitation.eventDate}
                  onChange={e => setNewInvitation({...newInvitation, eventDate: e.target.value})}
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
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">Heure de fin</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={newInvitation.endTime}
                    onChange={e => setNewInvitation({...newInvitation, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fee">Cachet proposé (en Ariary)</Label>
                <Input 
                  id="fee" 
                  type="number" 
                  value={newInvitation.fee}
                  onChange={e => setNewInvitation({...newInvitation, fee: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  rows={4}
                  value={newInvitation.message}
                  onChange={e => setNewInvitation({...newInvitation, message: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewInvitationDialog(false)}>Annuler</Button>
              <Button onClick={handleSendInvitation}>Envoyer l'invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Boîte de dialogue pour les détails d'invitation */}
        <Dialog open={!!invitationDetail} onOpenChange={(open) => !open && setInvitationDetail(null)}>
          {invitationDetail && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Détails de l'invitation</DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-muted rounded-lg p-4">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src={invitationDetail.artist.avatarUrl} alt={invitationDetail.artist.name} />
                      <AvatarFallback>{invitationDetail.artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{invitationDetail.artist.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{invitationDetail.artist.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {invitationDetail.artist.genres.map((genre, index) => (
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
                      <div>{invitationDetail.artist.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Contact</div>
                      <div>{invitationDetail.artist.email}</div>
                      {invitationDetail.artist.phone && <div>{invitationDetail.artist.phone}</div>}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Fourchette de prix habituelle</div>
                      <div>{invitationDetail.artist.feeRange}</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le profil
                  </Button>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{invitationDetail.eventName}</h2>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{formatDate(invitationDetail.eventDate)}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1 text-muted-foreground" />
                        <span>{invitationDetail.startTime} - {invitationDetail.endTime}</span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(invitationDetail.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Cachet</div>
                      <div className="font-bold">{formatCurrency(invitationDetail.fee)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Invitation envoyée</div>
                      <div>{formatDate(invitationDetail.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Contrat</div>
                      <div>{invitationDetail.contractSigned ? 'Signé' : 'Non signé'}</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Votre message</h3>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {invitationDetail.message}
                    </div>
                  </div>
                  
                  {invitationDetail.responseMessage && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">
                        Réponse de l'artiste
                        {invitationDetail.responseDate && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({formatDate(invitationDetail.responseDate)})
                          </span>
                        )}
                      </h3>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        {invitationDetail.responseMessage}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-6">
                    {invitationDetail.status === 'pending' && (
                      <Button 
                        variant="destructive" 
                        onClick={() => cancelInvitation(invitationDetail.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler l'invitation
                      </Button>
                    )}
                    {invitationDetail.status === 'accepted' && (
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Générer le contrat
                      </Button>
                    )}
                    {invitationDetail.status === 'declined' && (
                      <Button 
                        onClick={() => resendInvitation(invitationDetail.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Renvoyer l'invitation
                      </Button>
                    )}
                    {invitationDetail.status === 'confirmed' && (
                      <Button>
                        <Mail className="h-4 w-4 mr-2" />
                        Contacter l'artiste
                      </Button>
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