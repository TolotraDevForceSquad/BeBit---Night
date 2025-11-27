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
import { ScrollArea } from "../../components/ui/scroll-area";
import { useToast } from "../../hooks/use-toast";
import ResponsiveLayout from "../../layouts/ResponsiveLayout";
import {
  useUsers,
  useArtists,
  useClubs,
  useEvents,
  useInvitations,
  createInvitation,
  deleteInvitation,
  getArtistByUserId,
  getClubByUserId,
} from '../../services/servapi';
import {
  Search,
  Users,
  User,
  Music,
  Building,
  Calendar,
  MapPin,
  Star,
  Mail,
  Plus,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  MapPinIcon,
  Check,
  X,
  Trash2,
  RefreshCw
} from 'lucide-react';

// Types basés sur le schéma
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'artist' | 'club' | 'admin';
  profileImage?: string;
  city?: string;
  country?: string;
  isVerified: boolean;
  walletBalance: string;
  createdAt: string;
}

interface Artist {
  id: number;
  userId: number;
  displayName: string;
  genres: string[];
  bio?: string;
  rate: string;
  tags: string[];
  popularity: number;
  location: string;
  rating: string;
  bookings: number;
  availability: boolean;
  unavailableDates?: string[];
  user?: User;
}

interface Club {
  id: number;
  userId: number;
  name: string;
  city: string;
  country: string;
  address?: string;
  capacity: number;
  description?: string;
  profileImage?: string;
  rating: string;
  reviewCount: number;
  category: string;
  coverImage?: string;
  featured: boolean;
  user?: User;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  coverImage?: string;
  price: string;
  participantCount: number;
  organizerType: string;
  organizerId: number;
  createdBy: number;
}

interface Invitation {
  id: number;
  eventId: number;
  userId: number;
  invitedById: number;
  status: 'pending' | 'accepted' | 'declined' | 'confirmed' | 'cancelled' | 'rejected' | 'negotiation' | 'preparation' | 'completed';
  progress: number;
  invitedAt: string;
  expectedAttendees: number;
  genre?: string;
  description?: string;
  createdAt: string;
  event?: Event;
  user?: User;
  artist?: Artist;
}

const InviteUsersPage = () => {
  const { toast } = useToast();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewInvitationDialog, setShowNewInvitationDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // États pour la nouvelle invitation
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [newInvitation, setNewInvitation] = useState({
    expectedAttendees: '',
    genre: '',
    description: ''
  });

  // Chargement des données
  const { data: users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { data: artists, loading: artistsLoading, refetch: refetchArtists } = useArtists();
  const { data: clubs, loading: clubsLoading, refetch: refetchClubs } = useClubs();
  const { data: allEvents, loading: eventsLoading, refetch: refetchEvents } = useEvents();
  const { data: allInvitations, loading: invitationsLoading, refetch: refetchInvitations } = useInvitations();
  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");

  // Fonction pour rafraîchir toutes les données
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchUsers(),
        refetchArtists(),
        refetchClubs(),
        refetchEvents(),
        refetchInvitations()
      ]);
      toast({
        title: "Données actualisées",
        description: "Les données ont été mises à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtrer pour n'avoir que mes événements
  const myEvents = allEvents?.filter(event => event.createdBy === authUser.id) || [];

  // Filtrer les utilisateurs selon le rôle et la recherche
  const filteredUsers = users?.filter(user => {
    // Filtre par rôle
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesName = fullName.includes(query);
      const matchesEmail = user.email.toLowerCase().includes(query);
      const matchesUsername = user.username.toLowerCase().includes(query);

      // Vérifier aussi dans les données d'artiste ou club si applicable
      let matchesOrganization = false;
      if (user.role === 'artist') {
        const artist = artists?.find(a => a.userId === user.id);
        if (artist?.displayName.toLowerCase().includes(query) ||
          artist?.genres.some(genre => genre.toLowerCase().includes(query))) {
          matchesOrganization = true;
        }
      } else if (user.role === 'club') {
        const club = clubs?.find(c => c.userId === user.id);
        if (club?.name.toLowerCase().includes(query) ||
          club?.city.toLowerCase().includes(query)) {
          matchesOrganization = true;
        }
      }

      return matchesName || matchesEmail || matchesUsername || matchesOrganization;
    }

    return true;
  }) || [];

  // Obtenir les informations d'artiste pour un utilisateur
  const getArtistInfo = (user: User): Artist | null => {
    return artists?.find(artist => artist.userId === user.id) || null;
  };

  // Obtenir les informations de club pour un utilisateur
  const getClubInfo = (user: User): Club | null => {
    return clubs?.find(club => club.userId === user.id) || null;
  };

  // Obtenir toutes les invitations d'un utilisateur
  const getUserInvitations = (user: User) => {
    return allInvitations?.filter(invitation =>
      invitation.userId === user.id &&
      myEvents.some(event => event.id === invitation.eventId)
    ) || [];
  };

  // Obtenir l'événement auquel l'utilisateur est invité
  const getInvitedEvent = (user: User) => {
    const userInvitations = getUserInvitations(user);
    if (userInvitations.length > 0) {
      const invitation = userInvitations[0];
      return myEvents.find(event => event.id === invitation.eventId);
    }
    return null;
  };

  // Obtenir le statut de l'invitation
  const getInvitationStatus = (user: User) => {
    const userInvitations = getUserInvitations(user);
    if (userInvitations.length > 0) {
      return userInvitations[0].status;
    }
    return null;
  };

  // Obtenir l'invitation spécifique
  const getInvitation = (user: User) => {
    const userInvitations = getUserInvitations(user);
    return userInvitations.length > 0 ? userInvitations[0] : null;
  };

  // Vérifier si l'utilisateur est déjà invité à l'événement sélectionné
  const isUserAlreadyInvitedToEvent = (userId: number, eventId: number) => {
    return allInvitations?.some(invitation =>
      invitation.userId === userId &&
      invitation.eventId === eventId
    ) || false;
  };

  // Annuler une invitation
  const handleCancelInvitation = async (user: User) => {
    const invitation = getInvitation(user);
    if (!invitation) return;

    try {
      await deleteInvitation(invitation.id);
      toast({
        title: "Invitation annulée",
        description: `L'invitation à ${getDisplayName(user)} a été annulée`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation",
        variant: "destructive",
      });
    } finally {
      // Rafraîchir les données dans tous les cas (succès ou erreur)
      await refreshAllData();
    }
  };

  // Obtenir l'image de profil
  const getProfileImage = (user: User) => {
    if (user.profileImage) {
      return user.profileImage;
    }

    // Fallback aux initiales
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8B5CF6&color=fff&size=128`;
  };

  // Obtenir l'image de l'événement
  const getEventImage = (event: Event) => {
    if (event.coverImage) {
      return event.coverImage;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(event.title)}&background=8B5CF6&color=fff&size=256`;
  };

  // Obtenir le nom d'affichage
  const getDisplayName = (user: User) => {
    if (user.role === 'artist') {
      const artist = getArtistInfo(user);
      return artist?.displayName || `${user.firstName} ${user.lastName}`;
    } else if (user.role === 'club') {
      const club = getClubInfo(user);
      return club?.name || `${user.firstName} ${user.lastName}`;
    }
    return `${user.firstName} ${user.lastName}`;
  };

  // Obtenir la localisation
  const getLocation = (user: User) => {
    if (user.role === 'artist') {
      const artist = getArtistInfo(user);
      return artist?.location || user.city || 'Localisation non spécifiée';
    } else if (user.role === 'club') {
      const club = getClubInfo(user);
      return club?.city || user.city || 'Localisation non spécifiée';
    }
    return user.city || 'Localisation non spécifiée';
  };

  // Obtenir les genres (pour les artistes)
  const getGenres = (user: User) => {
    if (user.role === 'artist') {
      const artist = getArtistInfo(user);
      return artist?.genres || [];
    }
    return [];
  };

  // Obtenir le rating
  const getRating = (user: User) => {
    if (user.role === 'artist') {
      const artist = getArtistInfo(user);
      return artist?.rating || "0";
    } else if (user.role === 'club') {
      const club = getClubInfo(user);
      return club?.rating || "0";
    }
    return "0";
  };

  // Obtenir le badge de rôle
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'artist':
        return <Badge className="bg-[#8B5CF6] text-white"><Music className="h-3 w-3 mr-1" />Artiste</Badge>;
      case 'club':
        return <Badge className="bg-[#3B82F6] text-white"><Building className="h-3 w-3 mr-1" />Club</Badge>;
      case 'admin':
        return <Badge className="bg-[#dc2626] text-white">Admin</Badge>;
      default:
        return <Badge variant="outline" className="text-[#9ca3af] border-[#374151]"><User className="h-3 w-3 mr-1" />Utilisateur</Badge>;
    }
  };

  // Obtenir le badge de vérification
  const getVerificationBadge = (user: User) => {
    if (user.isVerified) {
      return <Badge variant="outline" className="text-[#3B82F6] border-[#3B82F6]"><CheckCircle className="h-3 w-3 mr-1" />Vérifié</Badge>;
    }
    return null;
  };

  // Obtenir le badge d'invitation
  const getInvitationBadge = (user: User) => {
    const status = getInvitationStatus(user);
    const invitedEvent = getInvitedEvent(user);

    if (!status || !invitedEvent) return null;

    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-[#F59E0B] border-[#F59E0B]"><Clock className="h-3 w-3 mr-1" />Invité à {invitedEvent.title}</Badge>;
      case 'accepted':
      case 'confirmed':
        return <Badge className="bg-[#22c55e] text-white"><Check className="h-3 w-3 mr-1" />Confirmé pour {invitedEvent.title}</Badge>;
      case 'declined':
      case 'rejected':
      case 'cancelled':
        return <Badge variant="outline" className="text-[#dc2626] border-[#dc2626]"><X className="h-3 w-3 mr-1" />Refusé pour {invitedEvent.title}</Badge>;
      case 'negotiation':
        return <Badge className="bg-[#8B5CF6] text-white">Négociation pour {invitedEvent.title}</Badge>;
      case 'preparation':
        return <Badge className="bg-[#3B82F6] text-white">Préparation pour {invitedEvent.title}</Badge>;
      case 'completed':
        return <Badge className="bg-[#3B82F6] text-white">Terminé pour {invitedEvent.title}</Badge>;
      default:
        return <Badge variant="outline">Invité à {invitedEvent.title}</Badge>;
    }
  };

  // Envoyer une invitation
  const handleSendInvitation = async () => {
    if (!selectedUser || !selectedEvent || !newInvitation.description) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si l'utilisateur est déjà invité à cet événement
    if (isUserAlreadyInvitedToEvent(selectedUser.id, parseInt(selectedEvent))) {
      toast({
        title: "Invitation déjà envoyée",
        description: "Cet utilisateur est déjà invité à cet événement",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInvitation({
        eventId: parseInt(selectedEvent),
        userId: selectedUser.id,
        invitedById: authUser.id,
        status: 'pending',
        expectedAttendees: parseInt(newInvitation.expectedAttendees) || 0,
        genre: newInvitation.genre,
        description: newInvitation.description
      });

      setShowNewInvitationDialog(false);

      // Réinitialiser le formulaire
      setSelectedUser(null);
      setSelectedEvent('');
      setNewInvitation({
        expectedAttendees: '',
        genre: '',
        description: ''
      });

      toast({
        title: "Invitation envoyée",
        description: `L'invitation a été envoyée à ${getDisplayName(selectedUser)}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    } finally {
      // Rafraîchir les données dans tous les cas (succès ou erreur)
      await refreshAllData();
    }
  };

  // Ouvrir la boîte de dialogue d'invitation
  const openInvitationDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedEvent('');
    setNewInvitation({
      expectedAttendees: '',
      genre: '',
      description: ''
    });
    setShowNewInvitationDialog(true);
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formatage de l'heure
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir les statistiques par rôle
  const getRoleStats = () => {
    if (!users) return { total: 0, artists: 0, clubs: 0, users: 0, admins: 0 };

    return {
      total: users.length,
      artists: users.filter(u => u.role === 'artist').length,
      clubs: users.filter(u => u.role === 'club').length,
      users: users.filter(u => u.role === 'user').length,
      admins: users.filter(u => u.role === 'admin').length,
    };
  };

  const stats = getRoleStats();

  if (usersLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-[#9ca3af]">Chargement des utilisateurs...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#18181b] min-h-screen">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#ffffff]">Inviter des utilisateurs</h1>
          <p className="text-lg text-[#9ca3af] mt-1">Trouvez et invitez des artistes, clubs et utilisateurs à vos événements</p>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <Button
            onClick={refreshAllData}
            disabled={isRefreshing}
            variant="outline"
            className="border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <div className="text-sm text-[#9ca3af]">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'utilisateur' : 'utilisateurs'} trouvé(s)
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6 bg-[#1f1f23] border-[#374151]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#ffffff]">Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-[#d1d5db]">Rechercher</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                <Input
                  id="search"
                  placeholder="Rechercher par nom, email, genre, ville..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#18181b] border-[#374151] text-[#ffffff] placeholder-[#9ca3af]"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="role-filter" className="text-[#d1d5db]">Rôle</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="role-filter" className="mt-1 bg-[#18181b] border-[#374151] text-[#ffffff]">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f1f23] border-[#374151] text-[#ffffff]">
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="artist">Artistes</SelectItem>
                  <SelectItem value="club">Clubs</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#ffffff]">{stats.total}</div>
                <div className="text-sm text-[#9ca3af]">Total</div>
              </div>
              <Users className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#22c55e]">{stats.artists}</div>
                <div className="text-sm text-[#9ca3af]">Artistes</div>
              </div>
              <Music className="h-8 w-8 text-[#22c55e]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#3B82F6]">{stats.clubs}</div>
                <div className="text-sm text-[#9ca3af]">Clubs</div>
              </div>
              <Building className="h-8 w-8 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#9ca3af]">{stats.users}</div>
                <div className="text-sm text-[#9ca3af]">Utilisateurs</div>
              </div>
              <User className="h-8 w-8 text-[#9ca3af]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#dc2626]">{stats.admins}</div>
                <div className="text-sm text-[#9ca3af]">Admins</div>
              </div>
              <User className="h-8 w-8 text-[#dc2626]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      <div className="mb-8">
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                const artistInfo = getArtistInfo(user);
                const clubInfo = getClubInfo(user);
                const displayName = getDisplayName(user);
                const location = getLocation(user);
                const genres = getGenres(user);
                const rating = getRating(user);
                const invitationBadge = getInvitationBadge(user);
                const isAlreadyInvited = getUserInvitations(user).length > 0;
                const invitation = getInvitation(user);
                const invitedEvent = getInvitedEvent(user);

                return (
                  <Card key={user.id} className="overflow-hidden bg-[#1f1f23] border-[#374151] hover:border-[#8B5CF6] transition-colors flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={getProfileImage(user)} alt={displayName} />
                            <AvatarFallback className="bg-[#8B5CF6] text-white">
                              {displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-[#ffffff] text-lg">{displayName}</CardTitle>
                              {getVerificationBadge(user)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {getRoleBadge(user.role)}
                              {parseFloat(rating) > 0 && (
                                <div className="flex items-center text-sm text-[#fbbf24]">
                                  <Star className="h-3 w-3 fill-current" />
                                  <span className="ml-1 text-[#ffffff]">{rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setUserDetail(user)}
                            className="text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAlreadyInvited && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCancelInvitation(user)}
                              className="text-[#dc2626] hover:text-[#ffffff] hover:bg-[#dc2626]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {invitationBadge && (
                        <div className="mt-2">
                          {invitationBadge}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-[#9ca3af]">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate">{user.email}</span>
                        </div>

                        {/* Affichage de l'événement invité */}
                        {invitedEvent && (
                          <div className="bg-[#18181b] p-3 rounded-md border border-[#374151]">
                            <div className="flex items-start space-x-3">
                              <img
                                src={getEventImage(invitedEvent)}
                                alt={invitedEvent.title}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-[#ffffff] text-sm">{invitedEvent.title}</div>
                                <div className="text-xs text-[#9ca3af] mt-1">
                                  {formatDate(invitedEvent.date)} • {formatTime(invitedEvent.startTime)}
                                </div>
                                <div className="text-xs text-[#9ca3af] flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {invitedEvent.venueName}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-[#9ca3af]">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{location}</span>
                        </div>

                        {user.role === 'artist' && artistInfo && (
                          <>
                            {artistInfo.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {artistInfo.genres.slice(0, 3).map((genre, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-[#374151] text-[#d1d5db]">
                                    {genre}
                                  </Badge>
                                ))}
                                {artistInfo.genres.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-[#374151] text-[#d1d5db]">
                                    +{artistInfo.genres.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="text-[#9ca3af]">Cachet</div>
                                <div className="font-medium text-[#ffffff]">{artistInfo.rate}Ar</div>
                              </div>
                              <div>
                                <div className="text-[#9ca3af]">Réservations</div>
                                <div className="font-medium text-[#ffffff]">{artistInfo.bookings}</div>
                              </div>
                            </div>
                          </>
                        )}

                        {user.role === 'club' && clubInfo && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-[#9ca3af]">Capacité</div>
                              <div className="font-medium text-[#ffffff]">{clubInfo.capacity} pers.</div>
                            </div>
                            <div>
                              <div className="text-[#9ca3af]">Avis</div>
                              <div className="font-medium text-[#ffffff]">{clubInfo.reviewCount}</div>
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-[#9ca3af]">
                          Membre depuis {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-[#18181b] pt-3 mt-auto">
                      {isAlreadyInvited ? (
                        <div className="flex space-x-2 w-full">
                          <Button
                            onClick={() => openInvitationDialog(user)}
                            variant="outline"
                            className="flex-1 border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                          <Button
                            onClick={() => handleCancelInvitation(user)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => openInvitationDialog(user)}
                          className="w-full bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                          disabled={user.role === 'admin'}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {user.role === 'admin' ? 'Admin' : 'Inviter'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 p-8 text-center">
                <Users className="h-16 w-16 text-[#9ca3af] mx-auto mb-4" />
                <div className="text-[#9ca3af] text-lg">
                  Aucun utilisateur ne correspond aux critères de recherche
                </div>
                {(searchQuery || roleFilter !== 'all') && (
                  <Button
                    variant="outline"
                    className="mt-4 border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Boîte de dialogue pour nouvelle invitation */}
      <Dialog open={showNewInvitationDialog} onOpenChange={setShowNewInvitationDialog}>
        <DialogContent className="max-w-md bg-[#1f1f23] border-[#374151] text-[#ffffff]">
          <DialogHeader>
            <DialogTitle>Nouvelle invitation</DialogTitle>
            <DialogDescription className="text-[#9ca3af]">
              Invitez {selectedUser ? getDisplayName(selectedUser) : 'cet utilisateur'} à votre événement.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4">
              <div className="bg-[#18181b] p-3 rounded-md border border-[#374151]">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getProfileImage(selectedUser)} alt={getDisplayName(selectedUser)} />
                    <AvatarFallback className="bg-[#8B5CF6] text-white">
                      {getDisplayName(selectedUser).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-[#ffffff]">{getDisplayName(selectedUser)}</div>
                    <div className="text-sm text-[#9ca3af]">
                      {selectedUser.role === 'artist' ? 'Artiste' :
                        selectedUser.role === 'club' ? 'Club' : 'Utilisateur'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="event" className="text-[#d1d5db]">Événement *</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                >
                  <SelectTrigger id="event" className="mt-1 bg-[#18181b] border-[#374151] text-[#ffffff]">
                    <SelectValue placeholder="Sélectionner un événement" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f23] border-[#374151] text-[#ffffff]">
                    {myEvents.map(event => {
                      const isAlreadyInvited = isUserAlreadyInvitedToEvent(selectedUser.id, event.id);
                      return (
                        <SelectItem
                          key={event.id}
                          value={event.id.toString()}
                          disabled={isAlreadyInvited}
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={getEventImage(event)}
                              alt={event.title}
                              className="w-6 h-6 rounded"
                            />
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-xs text-[#9ca3af]">
                                {formatDate(event.date)} • {event.venueName}
                              </div>
                            </div>
                            {isAlreadyInvited && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                Déjà invité
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedEvent && isUserAlreadyInvitedToEvent(selectedUser.id, parseInt(selectedEvent)) && (
                  <div className="text-sm text-[#dc2626] mt-1 flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    Cet utilisateur est déjà invité à cet événement
                  </div>
                )}
              </div>

              {selectedUser.role === 'artist' && (
                <>
                  <div>
                    <Label htmlFor="expected-attendees" className="text-[#d1d5db]">Participants attendus</Label>
                    <Input
                      id="expected-attendees"
                      type="number"
                      value={newInvitation.expectedAttendees}
                      onChange={e => setNewInvitation({ ...newInvitation, expectedAttendees: e.target.value })}
                      className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre" className="text-[#d1d5db]">Genre musical</Label>
                    <Input
                      id="genre"
                      value={newInvitation.genre}
                      onChange={e => setNewInvitation({ ...newInvitation, genre: e.target.value })}
                      className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                      placeholder="House, Techno, Jazz..."
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="message" className="text-[#d1d5db]">Message *</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={newInvitation.description}
                  onChange={e => setNewInvitation({ ...newInvitation, description: e.target.value })}
                  className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                  placeholder={`Décrivez votre événement et pourquoi vous souhaitez inviter ${getDisplayName(selectedUser)}...`}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewInvitationDialog(false)}
              className="border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={!selectedEvent || !newInvitation.description ||
                (selectedEvent && isUserAlreadyInvitedToEvent(selectedUser.id, parseInt(selectedEvent)))}
              className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour les détails d'utilisateur */}
      <Dialog open={!!userDetail} onOpenChange={(open) => !open && setUserDetail(null)}>
        {userDetail && (
          <DialogContent className="max-w-3xl max-h-[90vh] bg-[#1f1f23] border-[#374151] text-[#ffffff] p-0">
            <ScrollArea className="max-h-[90vh]">
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>Profil de {getDisplayName(userDetail)}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-6 mt-4">
                  <div className="md:w-1/3 bg-[#18181b] rounded-lg p-4 border border-[#374151]">
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-20 w-20 mb-3">
                        <AvatarImage src={getProfileImage(userDetail)} alt={getDisplayName(userDetail)} />
                        <AvatarFallback className="bg-[#8B5CF6] text-white text-xl">
                          {getDisplayName(userDetail).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg text-[#ffffff]">{getDisplayName(userDetail)}</h3>
                      <div className="flex items-center mt-2 space-x-2">
                        {getRoleBadge(userDetail.role)}
                        {getVerificationBadge(userDetail)}
                      </div>
                      {parseFloat(getRating(userDetail)) > 0 && (
                        <div className="flex items-center mt-2 text-[#fbbf24]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-[#ffffff] font-medium">{getRating(userDetail)}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4 bg-[#374151]" />

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-[#9ca3af]">Email</div>
                        <div className="text-[#ffffff] break-all">{userDetail.email}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9ca3af]">Localisation</div>
                        <div className="text-[#ffffff]">{getLocation(userDetail)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9ca3af]">Membre depuis</div>
                        <div className="text-[#ffffff]">{formatDate(userDetail.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9ca3af]">Solde wallet</div>
                        <div className="text-[#ffffff]">{userDetail.walletBalance}Ar</div>
                      </div>
                    </div>

                    {/* Affichage des invitations existantes */}
                    {getUserInvitations(userDetail).length > 0 && (
                      <>
                        <Separator className="my-4 bg-[#374151]" />
                        <div>
                          <h4 className="font-medium mb-2 text-[#ffffff]">Invitations en cours</h4>
                          <div className="space-y-2">
                            {getUserInvitations(userDetail).map(invitation => {
                              const event = myEvents.find(e => e.id === invitation.eventId);
                              return (
                                <div key={invitation.id} className="bg-[#1f1f23] p-3 rounded border border-[#374151]">
                                  <div className="flex items-start space-x-3">
                                    <img
                                      src={getEventImage(event!)}
                                      alt={event?.title}
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium text-[#ffffff] text-sm">{event?.title}</div>
                                      <div className="text-xs text-[#9ca3af] mt-1">
                                        {formatDate(event!.date)} • {formatTime(event!.startTime)}
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <Badge variant={
                                          invitation.status === 'pending' ? 'outline' :
                                            invitation.status === 'accepted' || invitation.status === 'confirmed' ? 'default' :
                                              'destructive'
                                        } className="text-xs">
                                          {invitation.status === 'pending' && 'En attente'}
                                          {invitation.status === 'accepted' && 'Accepté'}
                                          {invitation.status === 'confirmed' && 'Confirmé'}
                                          {invitation.status === 'declined' && 'Refusé'}
                                          {invitation.status === 'cancelled' && 'Annulé'}
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleCancelInvitation(userDetail)}
                                          className="h-6 text-xs"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="my-4 bg-[#374151]" />

                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          openInvitationDialog(userDetail);
                          setUserDetail(null);
                        }}
                        className="w-full bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                        disabled={userDetail.role === 'admin'}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {userDetail.role === 'admin' ? 'Admin' : 'Nouvelle invitation'}
                      </Button>
                      <Button
                        onClick={refreshAllData}
                        variant="outline"
                        className="w-full border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualiser
                      </Button>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    {userDetail.role === 'artist' && getArtistInfo(userDetail) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#ffffff]">Informations Artiste</h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-[#9ca3af]">Nom d'affichage</div>
                            <div className="text-[#ffffff] font-medium">{getArtistInfo(userDetail)?.displayName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Cachet habituel</div>
                            <div className="text-[#ffffff] font-medium">{getArtistInfo(userDetail)?.rate}Ar</div>
                          </div>
                        </div>

                        {getArtistInfo(userDetail)?.bio && (
                          <div>
                            <div className="text-sm text-[#9ca3af]">Biographie</div>
                            <div className="text-[#ffffff] mt-1">{getArtistInfo(userDetail)?.bio}</div>
                          </div>
                        )}

                        {getGenres(userDetail).length > 0 && (
                          <div>
                            <div className="text-sm text-[#9ca3af] mb-2">Genres musicaux</div>
                            <div className="flex flex-wrap gap-2">
                              {getGenres(userDetail).map((genre, index) => (
                                <Badge key={index} variant="secondary" className="bg-[#374151] text-[#d1d5db]">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-[#9ca3af]">Réservations</div>
                            <div className="text-[#ffffff] font-medium">{getArtistInfo(userDetail)?.bookings}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Popularité</div>
                            <div className="text-[#ffffff] font-medium">{getArtistInfo(userDetail)?.popularity}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Disponibilité</div>
                            <div className={`font-medium ${getArtistInfo(userDetail)?.availability ? 'text-[#22c55e]' : 'text-[#dc2626]'}`}>
                              {getArtistInfo(userDetail)?.availability ? 'Disponible' : 'Indisponible'}
                            </div>
                          </div>
                        </div>

                        {/* Calendrier de disponibilité de l'artiste */}
                        <div className="mt-6 mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-[#ffffff]">Calendrier de disponibilité</h3>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const prevMonth = new Date(currentMonth);
                                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                                  setCurrentMonth(prevMonth);
                                }}
                                className="h-8 w-8 p-0 border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                              >
                                <span className="sr-only">Mois précédent</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nextMonth = new Date(currentMonth);
                                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                                  setCurrentMonth(nextMonth);
                                }}
                                className="h-8 w-8 p-0 border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                              >
                                <span className="sr-only">Mois suivant</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Button>
                            </div>
                          </div>

                          {/* Résumé de disponibilité */}
                          <div className="bg-[#18181b] p-3 rounded-md border border-[#374151] mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2"></div>
                                <span className="text-sm text-[#ffffff]">Disponible</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#dc2626] rounded-full mr-2"></div>
                                <span className="text-sm text-[#ffffff]">Occupé</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                                <span className="text-sm text-[#ffffff]">Votre événement</span>
                              </div>
                            </div>
                          </div>

                          {/* Calendrier avec vraies données */}
                          <div className="bg-[#18181b] p-4 rounded-md border border-[#374151]">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                <div key={day} className="text-center text-xs text-[#9ca3af] font-medium py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const year = currentMonth.getFullYear();
                                const month = currentMonth.getMonth();

                                // Premier jour du mois
                                const firstDay = new Date(year, month, 1);
                                // Dernier jour du mois
                                const lastDay = new Date(year, month + 1, 0);
                                // Nombre de jours dans le mois
                                const daysInMonth = lastDay.getDate();
                                // Premier jour de la semaine (0 = dimanche, 1 = lundi, etc.)
                                const firstDayOfWeek = firstDay.getDay();

                                // Tableau pour les jours du mois
                                const days = [];

                                // Ajouter les jours vides du début
                                for (let i = 0; i < firstDayOfWeek; i++) {
                                  days.push(null);
                                }

                                // Ajouter les jours du mois
                                for (let day = 1; day <= daysInMonth; day++) {
                                  days.push(day);
                                }

                                return days.map((day, index) => {
                                  if (day === null) {
                                    return (
                                      <div
                                        key={`empty-${index}`}
                                        className="h-8 rounded-md flex items-center justify-center text-xs font-medium text-transparent"
                                      >
                                        {0}
                                      </div>
                                    );
                                  }

                                  const artist = getArtistInfo(userDetail);
                                  const testDate = new Date(year, month, day);
                                  const dateString = testDate.toISOString().split('T')[0];

                                  // Vérifier si c'est une date d'indisponibilité
                                  const isUnavailable = artist?.unavailableDates?.includes(dateString);

                                  // Vérifier si c'est la date d'un de vos événements avec cet artiste
                                  const userInvitations = getUserInvitations(userDetail);
                                  const isEventDate = userInvitations.some(invitation => {
                                    const event = myEvents.find(e => e.id === invitation.eventId);
                                    if (!event) return false;
                                    const eventDate = new Date(event.date);
                                    return eventDate.getDate() === day &&
                                      eventDate.getMonth() === month &&
                                      eventDate.getFullYear() === year;
                                  });

                                  let bgColor = 'bg-[#22c55e]'; // Disponible
                                  if (isUnavailable) bgColor = 'bg-[#dc2626]'; // Occupé
                                  if (isEventDate) bgColor = 'bg-[#f59e0b]'; // Votre événement

                                  return (
                                    <div
                                      key={day}
                                      className={`h-8 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:opacity-80 ${bgColor} text-[#ffffff]`}
                                      title={
                                        isUnavailable ? `Indisponible - ${dateString}` :
                                          isEventDate ? `Votre événement` :
                                            `Disponible - ${dateString}`
                                      }
                                    >
                                      {day}
                                    </div>
                                  );
                                });
                              })()}
                            </div>

                            <div className="mt-3 text-xs text-[#9ca3af] text-center">
                              {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                            </div>
                          </div>

                          {/* Liste des dates indisponibles */}
                          {getArtistInfo(userDetail)?.unavailableDates && getArtistInfo(userDetail)?.unavailableDates.length > 0 && (
                            <div className="mt-4 bg-[#1f1f23] p-3 rounded-md border border-[#374151]">
                              <h4 className="font-medium text-[#ffffff] mb-2 text-sm">Dates indisponibles :</h4>
                              <div className="text-xs text-[#9ca3af] space-y-1">
                                {getArtistInfo(userDetail)?.unavailableDates.map((date, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className="w-2 h-2 bg-[#dc2626] rounded-full mr-2"></div>
                                    {formatDate(date)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userDetail.role === 'club' && getClubInfo(userDetail) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#ffffff]">Informations Club</h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-[#9ca3af]">Nom du club</div>
                            <div className="text-[#ffffff] font-medium">{getClubInfo(userDetail)?.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Catégorie</div>
                            <div className="text-[#ffffff] font-medium">{getClubInfo(userDetail)?.category}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-[#9ca3af]">Capacité</div>
                            <div className="text-[#ffffff] font-medium">{getClubInfo(userDetail)?.capacity} personnes</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Nombre d'avis</div>
                            <div className="text-[#ffffff] font-medium">{getClubInfo(userDetail)?.reviewCount}</div>
                          </div>
                        </div>

                        {getClubInfo(userDetail)?.description && (
                          <div>
                            <div className="text-sm text-[#9ca3af]">Description</div>
                            <div className="text-[#ffffff] mt-1">{getClubInfo(userDetail)?.description}</div>
                          </div>
                        )}

                        <div>
                          <div className="text-sm text-[#9ca3af]">Adresse</div>
                          <div className="text-[#ffffff]">{getClubInfo(userDetail)?.address || 'Non spécifiée'}</div>
                        </div>
                      </div>
                    )}

                    {userDetail.role === 'user' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#ffffff]">Informations Utilisateur</h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-[#9ca3af]">Prénom</div>
                            <div className="text-[#ffffff] font-medium">{userDetail.firstName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#9ca3af]">Nom</div>
                            <div className="text-[#ffffff] font-medium">{userDetail.lastName}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-[#9ca3af]">Nom d'utilisateur</div>
                          <div className="text-[#ffffff] font-medium">{userDetail.username}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
};

export default InviteUsersPage;