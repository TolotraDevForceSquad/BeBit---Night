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
  useInvitations,
  useEvents,
  useUsers,
  useArtists,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  createTransaction,
  getArtistByUserId,
  useTransactions,
} from '../../services/servapi';
import {
  Calendar,
  Clock,
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
  DollarSign,
  Download,
  Upload,
  Receipt
} from 'lucide-react';

// Types basés sur le schéma réel
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

interface Transaction {
  id: number;
  userId: number;
  amount: string;
  type: 'credit' | 'debit' | 'fee' | 'withdrawal';
  status: 'completed' | 'processing' | 'failed';
  sourceType: string;
  sourceId: number;
  sourceReference: string;
  description: string;
  reference: string;
  createdAt: string;
  user?: User;
}

const ClubInvitationsPage = () => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewInvitationDialog, setShowNewInvitationDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [invitationDetail, setInvitationDetail] = useState<Invitation | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // États pour la nouvelle invitation
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [newInvitation, setNewInvitation] = useState({
    expectedAttendees: '',
    genre: '',
    description: ''
  });

  // États pour le paiement
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');

  // Chargement des données réelles
  const { data: invitations, loading: invitationsLoading, refetch: refetchInvitations } = useInvitations();
  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const { data: events, loading: eventsLoading } = useEvents({ organizerId: authUser.id });
  const { data: users, loading: usersLoading } = useUsers();
  const { data: artists, loading: artistsLoading } = useArtists();
  const { data: transactions, loading: transactionsLoading, refetch: refetchTransactions } = useTransactions();

  // Filtrer les invitations selon le statut
  const filteredInvitations = invitations?.filter(invitation => {
    if (statusFilter === 'all') return true;
    return invitation.status === statusFilter;
  }) || [];

  // Obtenir le style de badge selon le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-[#F59E0B] border-[#F59E0B]">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-[#22c55e] border-[#22c55e]">Accepté</Badge>;
      case 'declined':
        return <Badge variant="outline" className="text-[#dc2626] border-[#dc2626]">Refusé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-[#9ca3af] border-[#9ca3af]">Annulé</Badge>;
      case 'confirmed':
        return <Badge className="bg-[#22c55e] text-white">Confirmé</Badge>;
      case 'completed':
        return <Badge className="bg-[#3B82F6] text-white">Terminé</Badge>;
      case 'negotiation':
        return <Badge className="bg-[#8B5CF6] text-white">Négociation</Badge>;
      case 'preparation':
        return <Badge className="bg-[#3B82F6] text-white">Préparation</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Obtenir les informations de l'artiste
  const getArtistInfo = (invitation: Invitation) => {
    if (invitation.artist) {
      return invitation.artist;
    }

    const user = users?.find(u => u.id === invitation.userId);
    const artist = artists?.find(a => a.userId === invitation.userId);

    return artist || {
      id: invitation.userId,
      userId: invitation.userId,
      displayName: user ? `${user.firstName} ${user.lastName}` : `Artiste #${invitation.userId}`,
      genres: [],
      rate: "0",
      tags: [],
      popularity: 0,
      location: "",
      rating: "0",
      bookings: 0,
      availability: true,
      user
    };
  };

  // Obtenir l'événement associé à une invitation
  const getEventInfo = (invitation: Invitation) => {
    if (invitation.event) {
      return invitation.event;
    }

    return events?.find(e => e.id === invitation.eventId) || null;
  };

  // Obtenir l'image de profil
  const getProfileImage = (invitation: Invitation) => {
    const artist = getArtistInfo(invitation);

    // Vérifier si l'artiste a un utilisateur avec une image de profil
    if (artist.user?.profileImage) {
      return artist.user.profileImage;
    }

    // Vérifier si l'utilisateur a une image de profil
    const user = users?.find(u => u.id === invitation.userId);
    if (user?.profileImage) {
      return user.profileImage;
    }

    // Fallback aux initiales
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.displayName)}&background=8B5CF6&color=fff&size=128`;
  };

  // Obtenir les transactions liées à une invitation
  const getInvitationTransactions = (invitationId: number) => {
    return transactions?.filter(transaction =>
      transaction.sourceType === 'artist_payment' && transaction.sourceId === invitationId
    ) || [];
  };

  // Envoyer une invitation
  const handleSendInvitation = async () => {
    if (!selectedArtist || !selectedEvent || !newInvitation.description) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInvitation({
        eventId: parseInt(selectedEvent),
        userId: parseInt(selectedArtist),
        invitedById: authUser.id,
        status: 'pending',
        expectedAttendees: parseInt(newInvitation.expectedAttendees) || 0,
        genre: newInvitation.genre,
        description: newInvitation.description
      });

      setShowNewInvitationDialog(false);

      // Réinitialiser le formulaire
      setSelectedArtist('');
      setSelectedEvent('');
      setNewInvitation({
        expectedAttendees: '',
        genre: '',
        description: ''
      });

      await refetchInvitations();

      toast({
        title: "Invitation envoyée",
        description: "L'invitation a été envoyée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour le statut d'une invitation
  const updateInvitationStatus = async (id: number, status: Invitation['status']) => {
    try {
      await updateInvitation(id, { status });
      await refetchInvitations();

      toast({
        title: "Statut mis à jour",
        description: `L'invitation est maintenant ${getStatusText(status)}`,
      });

      // Fermer la boîte de dialogue de détail si elle est ouverte
      if (invitationDetail && invitationDetail.id === id) {
        setInvitationDetail(null);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  // Supprimer une invitation
  const removeInvitation = async (id: number) => {
    try {
      await deleteInvitation(id);
      await refetchInvitations();

      toast({
        title: "Invitation supprimée",
        description: "L'invitation a été supprimée définitivement",
      });

      if (invitationDetail && invitationDetail.id === id) {
        setInvitationDetail(null);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'invitation",
        variant: "destructive",
      });
    }
  };

  // Effectuer un paiement
  const handleSendPayment = async () => {
    if (!selectedInvitation || !paymentAmount || !paymentDescription) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir le montant et la description",
        variant: "destructive",
      });
      return;
    }

    // Vérifier que le montant est valide
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez saisir un montant valide",
        variant: "destructive",
      });
      return;
    }

    try {
      // Vérifier le solde du wallet pour les débits
      if (authUser.walletBalance < amount) {
        toast({
          title: "Solde insuffisant",
          description: `Votre solde (${authUser.walletBalance}Ar) est insuffisant pour effectuer ce paiement de ${amount}Ar`,
          variant: "destructive",
        });
        return;
      }

      const artist = getArtistInfo(selectedInvitation);
      const event = getEventInfo(selectedInvitation);

      // Créer la transaction
      await createTransaction({
        userId: artist.userId,
        amount: paymentAmount,
        type: 'debit',
        status: 'completed',
        sourceType: 'artist_payment',
        sourceId: selectedInvitation.id,
        sourceReference: `Paiement pour ${event?.title || 'événement'}`,
        description: paymentDescription,
        reference: `PAY-${Date.now()}`
      });

      // Mettre à jour le walletBalance de l'utilisateur
      const newBalance = parseFloat(authUser.walletBalance) - amount;

      // Mettre à jour l'utilisateur dans le localStorage
      const updatedUser = {
        ...authUser,
        walletBalance: newBalance.toString()
      };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      setShowPaymentDialog(false);
      setPaymentAmount('');
      setPaymentDescription('');
      await refetchTransactions();

      toast({
        title: "Paiement envoyé",
        description: `Le paiement de ${amount}Ar a été envoyé à ${artist.displayName}. Nouveau solde: ${newBalance}Ar`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le paiement",
        variant: "destructive",
      });
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formater le montant en Ariary
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(num);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Rejeté';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'declined': return 'Refusé';
      case 'negotiation': return 'Négociation';
      case 'preparation': return 'Préparation';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  if (invitationsLoading) {
    return (
      <ResponsiveLayout>
        <div className="p-8 flex justify-center items-center h-64">
          <div className="text-[#9ca3af]">Chargement des invitations...</div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="p-8 bg-[#18181b] min-h-screen">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#ffffff]">Invitations aux artistes</h1>
            <p className="text-lg text-[#9ca3af] mt-1">Gérez vos demandes de prestations artistiques</p>
          </div>

          <Button
            onClick={() => setShowNewInvitationDialog(true)}
            className="mt-4 lg:mt-0 bg-[#fe2f58] hover:bg-[#e02e50] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle invitation
          </Button>
        </div>

        {/* Filtres d'affichage */}
        <Card className="mb-6 bg-[#1f1f23] border-[#374151]">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#ffffff]">Filtrer les invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="status-filter" className="text-[#d1d5db]">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="mt-1 bg-[#18181b] border-[#374151] text-[#ffffff]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f23] border-[#374151] text-[#ffffff]">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="accepted">Accepté</SelectItem>
                    <SelectItem value="declined">Refusé</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
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
              filteredInvitations.map(invitation => {
                const artist = getArtistInfo(invitation);
                const event = getEventInfo(invitation);

                return (
                  <Card key={invitation.id} className="overflow-hidden bg-[#1f1f23] border-[#374151]">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CardTitle className="mr-2 text-[#ffffff] text-lg">
                              {event?.title || 'Événement sans nom'}
                            </CardTitle>
                            {getStatusBadge(invitation.status)}
                          </div>
                          <CardDescription className="mt-1 text-[#9ca3af]">
                            {event?.date ? formatDate(event.date) : 'Date non définie'} •
                            {event ? ` ${event.startTime} - ${event.endTime}` : ' Horaires non définis'}
                          </CardDescription>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setInvitationDetail(invitation)}
                          className="text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={getProfileImage(invitation)} alt={artist.displayName} />
                          <AvatarFallback className="bg-[#8B5CF6] text-white">
                            {artist.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#ffffff]">{artist.displayName}</div>
                          <div className="text-sm text-[#9ca3af]">
                            {artist.genres.length > 0 ? artist.genres.join(', ') : 'Aucun genre spécifié'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <div className="text-[#9ca3af]">Cachet habituel</div>
                          <div className="font-medium text-[#ffffff]">{artist.rate}Ar</div>
                        </div>
                        <div>
                          <div className="text-[#9ca3af]">Envoyé le</div>
                          <div className="font-medium text-[#ffffff]">{formatDate(invitation.createdAt)}</div>
                        </div>
                      </div>

                      <div className="text-sm line-clamp-2 text-[#9ca3af]">
                        {invitation.description || 'Aucun message'}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-[#18181b] pt-3">
                      <div className="w-full flex justify-between">
                        {invitation.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvitationStatus(invitation.id, 'cancelled')}
                            className="text-[#dc2626] border-[#dc2626] hover:bg-[#dc2626] hover:text-white"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Annuler
                          </Button>
                        )}
                        {invitation.status === 'declined' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvitationStatus(invitation.id, 'pending')}
                            className="text-[#F59E0B] border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white"
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
                            className="text-[#dc2626] hover:bg-[#dc2626] hover:text-white"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer
                          </Button>
                        )}
                        {(invitation.status === 'accepted' || invitation.status === 'confirmed' || invitation.status === 'completed') && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setShowPaymentDialog(true);
                            }}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Paiement
                          </Button>
                        )}
                        <span className="flex-grow"></span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInvitationDetail(invitation)}
                          className="text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                        >
                          Détails
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 p-8 text-center">
                <div className="text-[#9ca3af]">
                  Aucune invitation ne correspond aux critères sélectionnés
                </div>
                {statusFilter !== 'all' && (
                  <Button
                    variant="outline"
                    className="mt-4 border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                    onClick={() => setStatusFilter('all')}
                  >
                    Afficher toutes les invitations
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <Card className="bg-[#1f1f23] border-[#374151]">
          <CardHeader>
            <CardTitle className="text-[#ffffff]">Statistiques d'invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#18181b] rounded-lg border border-[#374151]">
                <div className="text-4xl font-bold text-[#F59E0B]">
                  {invitations?.filter(i => i.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-[#9ca3af] mt-1">En attente</div>
              </div>
              <div className="text-center p-4 bg-[#18181b] rounded-lg border border-[#374151]">
                <div className="text-4xl font-bold text-[#22c55e]">
                  {invitations?.filter(i => i.status === 'accepted' || i.status === 'confirmed').length || 0}
                </div>
                <div className="text-sm text-[#9ca3af] mt-1">Acceptées</div>
              </div>
              <div className="text-center p-4 bg-[#18181b] rounded-lg border border-[#374151]">
                <div className="text-4xl font-bold text-[#dc2626]">
                  {invitations?.filter(i => i.status === 'declined' || i.status === 'rejected').length || 0}
                </div>
                <div className="text-sm text-[#9ca3af] mt-1">Refusées</div>
              </div>
              <div className="text-center p-4 bg-[#18181b] rounded-lg border border-[#374151]">
                <div className="text-4xl font-bold text-[#3B82F6]">
                  {invitations?.filter(i => i.status === 'completed').length || 0}
                </div>
                <div className="text-sm text-[#9ca3af] mt-1">Terminées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section des transactions */}
        <Card className="bg-[#1f1f23] border-[#374151] mt-6">
          <CardHeader>
            <CardTitle className="text-[#ffffff]">Historique des paiements</CardTitle>
            <CardDescription className="text-[#9ca3af]">
              Liste des transactions liées à vos invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions?.filter(t => t.sourceType === 'artist_payment').length > 0 ? (
              <div className="space-y-4">
                {transactions
                  .filter(t => t.sourceType === 'artist_payment')
                  .map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#18181b] rounded-lg border border-[#374151]">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#8B5CF6] rounded-lg mr-4">
                          <Receipt className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[#ffffff]">
                            {transaction.sourceReference}
                          </div>
                          <div className="text-sm text-[#9ca3af]">
                            {transaction.description} • {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`font-bold ${transaction.type === 'debit' ? 'text-[#dc2626]' : 'text-[#22c55e]'}`}>
                            {transaction.type === 'debit' ? '-' : '+'}{transaction.amount}Ar
                          </div>
                          <Badge
                            className={`mt-1 ${transaction.status === 'completed'
                              ? 'bg-[#22c55e]'
                              : transaction.status === 'processing'
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#dc2626]'
                              }`}
                          >
                            {transaction.status === 'completed' ? 'Complété' :
                              transaction.status === 'processing' ? 'En cours' : 'Échoué'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionDialog(true);
                          }}
                          className="text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center p-8">
                <Receipt className="h-12 w-12 text-[#9ca3af] mx-auto mb-4" />
                <div className="text-[#9ca3af]">Aucune transaction pour le moment</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boîte de dialogue pour nouvelle invitation */}
        <Dialog open={showNewInvitationDialog} onOpenChange={setShowNewInvitationDialog}>
          <DialogContent className="max-w-md bg-[#1f1f23] border-[#374151] text-[#ffffff]">
            <DialogHeader>
              <DialogTitle>Nouvelle invitation</DialogTitle>
              <DialogDescription className="text-[#9ca3af]">
                Envoyez une invitation à un artiste pour votre événement.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="artist" className="text-[#d1d5db]">Artiste</Label>
                <Select
                  value={selectedArtist}
                  onValueChange={setSelectedArtist}
                >
                  <SelectTrigger id="artist" className="bg-[#18181b] border-[#374151] text-[#ffffff]">
                    <SelectValue placeholder="Sélectionner un artiste" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f23] border-[#374151] text-[#ffffff]">
                    {artists?.filter(artist => artist.availability).map(artist => (
                      <SelectItem key={artist.id} value={artist.userId.toString()}>
                        {artist.displayName} - {artist.genres[0] || 'Sans genre'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="event" className="text-[#d1d5db]">Événement</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={setSelectedEvent}
                >
                  <SelectTrigger id="event" className="bg-[#18181b] border-[#374151] text-[#ffffff]">
                    <SelectValue placeholder="Sélectionner un événement" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f23] border-[#374151] text-[#ffffff]">
                    {events?.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title} - {formatDate(event.date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expected-attendees" className="text-[#d1d5db]">Participants attendus</Label>
                <Input
                  id="expected-attendees"
                  type="number"
                  value={newInvitation.expectedAttendees}
                  onChange={e => setNewInvitation({ ...newInvitation, expectedAttendees: e.target.value })}
                  className="bg-[#18181b] border-[#374151] text-[#ffffff]"
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

              <div>
                <Label htmlFor="message" className="text-[#d1d5db]">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={newInvitation.description}
                  onChange={e => setNewInvitation({ ...newInvitation, description: e.target.value })}
                  className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                  placeholder="Décrivez votre événement et pourquoi vous souhaitez collaborer avec cet artiste..."
                />
              </div>
            </div>

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
                className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
              >
                Envoyer l'invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Boîte de dialogue pour les détails d'invitation */}
        <Dialog open={!!invitationDetail} onOpenChange={(open) => !open && setInvitationDetail(null)}>
          {invitationDetail && (
            <DialogContent className="max-w-3xl bg-[#1f1f23] border-[#374151] text-[#ffffff]">
              <DialogHeader>
                <DialogTitle>Détails de l'invitation</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-[#18181b] rounded-lg p-4 border border-[#374151]">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src={getProfileImage(invitationDetail)} alt={getArtistInfo(invitationDetail).displayName} />
                      <AvatarFallback className="bg-[#8B5CF6] text-white">
                        {getArtistInfo(invitationDetail).displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-[#ffffff]">{getArtistInfo(invitationDetail).displayName}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-[#fbbf24] fill-[#fbbf24]" />
                      <span className="ml-1 text-[#ffffff]">{getArtistInfo(invitationDetail).rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {getArtistInfo(invitationDetail).genres.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-[#374151] text-[#d1d5db]">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4 bg-[#374151]" />

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-[#9ca3af]">Emplacement</div>
                      <div className="text-[#ffffff]">{getArtistInfo(invitationDetail).location || 'Non spécifié'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#9ca3af]">Cachet habituel</div>
                      <div className="text-[#ffffff]">{getArtistInfo(invitationDetail).rate}Ar</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#9ca3af]">Disponibilité</div>
                      <div className="text-[#ffffff]">
                        {getArtistInfo(invitationDetail).availability ? 'Disponible' : 'Indisponible'}
                      </div>
                    </div>
                  </div>

                  {/* Transactions liées à cette invitation */}
                  {getInvitationTransactions(invitationDetail.id).length > 0 && (
                    <>
                      <Separator className="my-4 bg-[#374151]" />
                      <div>
                        <h4 className="font-medium mb-2 text-[#ffffff]">Paiements</h4>
                        <div className="space-y-2">
                          {getInvitationTransactions(invitationDetail.id).map(transaction => (
                            <div key={transaction.id} className="flex justify-between items-center p-2 bg-[#1f1f23] rounded text-sm">
                              <div>
                                <div className="text-[#ffffff]">{transaction.amount}Ar</div>
                                <div className="text-[#9ca3af] text-xs">{formatDate(transaction.createdAt)}</div>
                              </div>
                              <Badge
                                className={
                                  transaction.status === 'completed'
                                    ? 'bg-[#22c55e]'
                                    : transaction.status === 'processing'
                                      ? 'bg-[#F59E0B]'
                                      : 'bg-[#dc2626]'
                                }
                              >
                                {transaction.status === 'completed' ? 'Payé' :
                                  transaction.status === 'processing' ? 'En cours' : 'Échoué'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#ffffff]">
                        {getEventInfo(invitationDetail)?.title || 'Événement sans nom'}
                      </h2>
                      <div className="flex items-center mt-1 text-[#9ca3af]">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {getEventInfo(invitationDetail)?.date ? formatDate(getEventInfo(invitationDetail).date) : 'Date non définie'}
                        </span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>
                          {getEventInfo(invitationDetail) ? `${getEventInfo(invitationDetail).startTime} - ${getEventInfo(invitationDetail).endTime}` : 'Horaires non définis'}
                        </span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(invitationDetail.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-[#9ca3af]">Participants attendus</div>
                      <div className="font-bold text-[#ffffff]">{invitationDetail.expectedAttendees}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#9ca3af]">Invitation envoyée</div>
                      <div className="text-[#ffffff]">{formatDate(invitationDetail.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#9ca3af]">Progression</div>
                      <div className="text-[#ffffff]">{invitationDetail.progress}%</div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-[#374151]" />

                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-[#ffffff]">Votre message</h3>
                    <div className="bg-[#18181b] p-3 rounded-md text-sm text-[#d1d5db] border border-[#374151]">
                      {invitationDetail.description || 'Aucun message'}
                    </div>
                  </div>

                  {invitationDetail.genre && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2 text-[#ffffff]">Genre musical</h3>
                      <div className="text-[#d1d5db]">{invitationDetail.genre}</div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-6">
                    {invitationDetail.status === 'pending' && (
                      <Button
                        variant="destructive"
                        onClick={() => updateInvitationStatus(invitationDetail.id, 'cancelled')}
                        className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler l'invitation
                      </Button>
                    )}
                    {invitationDetail.status === 'declined' && (
                      <Button
                        onClick={() => updateInvitationStatus(invitationDetail.id, 'pending')}
                        className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Renvoyer l'invitation
                      </Button>
                    )}
                    {(invitationDetail.status === 'accepted' || invitationDetail.status === 'confirmed') && (
                      <Button
                        onClick={() => {
                          setSelectedInvitation(invitationDetail);
                          setShowPaymentDialog(true);
                          setInvitationDetail(null);
                        }}
                        className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Effectuer un paiement
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Boîte de dialogue pour le paiement */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md bg-[#1f1f23] border-[#374151] text-[#ffffff]">
            <DialogHeader>
              <DialogTitle>Effectuer un paiement</DialogTitle>
              <DialogDescription className="text-[#9ca3af]">
                Envoyez un paiement à l'artiste pour cette collaboration.
              </DialogDescription>
            </DialogHeader>

            {selectedInvitation && (
              <div className="grid gap-4">
                <div className="bg-[#18181b] p-3 rounded-md border border-[#374151]">
                  <div className="text-sm text-[#9ca3af]">Artiste</div>
                  <div className="font-medium text-[#ffffff]">{getArtistInfo(selectedInvitation).displayName}</div>
                  <div className="text-sm text-[#9ca3af] mt-1">
                    Pour: {getEventInfo(selectedInvitation)?.title || 'Événement sans nom'}
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment-amount" className="text-[#d1d5db]">Montant (Ar)</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                    placeholder="0.00"
                  />
                </div>

                {/* Affichage du solde actuel */}
                <div className="bg-[#18181b] p-3 rounded-md border border-[#374151]">
                  <div className="text-sm text-[#9ca3af]">Votre solde actuel</div>
                  <div className={`text-lg font-bold ${parseFloat(authUser.walletBalance || '0') < parseFloat(paymentAmount || '0') ? 'text-[#dc2626]' : 'text-[#22c55e]'}`}>
                    {formatCurrency(authUser.walletBalance || '0')}
                  </div>
                  {parseFloat(authUser.walletBalance || '0') < parseFloat(paymentAmount || '0') && (
                    <div className="text-sm text-[#dc2626] mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Solde insuffisant pour ce paiement
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="payment-description" className="text-[#d1d5db]">Description</Label>
                  <Textarea
                    id="payment-description"
                    rows={3}
                    value={paymentDescription}
                    onChange={e => setPaymentDescription(e.target.value)}
                    className="bg-[#18181b] border-[#374151] text-[#ffffff]"
                    placeholder="Décrivez la raison de ce paiement (acompte, solde, frais supplémentaires...)"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendPayment}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Envoyer le paiement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Boîte de dialogue pour les détails de transaction */}
        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
          {selectedTransaction && (
            <DialogContent className="max-w-md bg-[#1f1f23] border-[#374151] text-[#ffffff]">
              <DialogHeader>
                <DialogTitle>Détails de la transaction</DialogTitle>
                <DialogDescription className="text-[#9ca3af]">
                  Informations complètes sur ce paiement
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-[#18181b] p-4 rounded-lg border border-[#374151]">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-lg font-bold text-[#ffffff]">
                      {selectedTransaction.amount}Ar
                    </div>
                    <Badge
                      className={
                        selectedTransaction.status === 'completed'
                          ? 'bg-[#22c55e]'
                          : selectedTransaction.status === 'processing'
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#dc2626]'
                      }
                    >
                      {selectedTransaction.status === 'completed' ? 'Complété' :
                        selectedTransaction.status === 'processing' ? 'En cours' : 'Échoué'}
                    </Badge>
                  </div>
                  <div className="text-sm text-[#9ca3af]">
                    {selectedTransaction.type === 'debit' ? 'Débit' : 'Crédit'} • {selectedTransaction.sourceReference}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[#9ca3af]">Référence</div>
                    <div className="text-[#ffffff] font-mono">{selectedTransaction.reference}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9ca3af]">Date</div>
                    <div className="text-[#ffffff]">{formatDateTime(selectedTransaction.createdAt)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#9ca3af]">Description</div>
                  <div className="text-[#ffffff] mt-1">{selectedTransaction.description}</div>
                </div>

                <div>
                  <div className="text-sm text-[#9ca3af]">Type de source</div>
                  <div className="text-[#ffffff] mt-1 capitalize">
                    {selectedTransaction.sourceType.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setShowTransactionDialog(false)}
                  className="bg-[#fe2f58] hover:bg-[#e02e50] text-white"
                >
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default ClubInvitationsPage;