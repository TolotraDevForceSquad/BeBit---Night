import { useState, useEffect, useCallback } from 'react';
import { User, Invitation, Event, CollaborationMessage, CollaborationMilestone } from '@shared/schema';
import {
  useInvitations,
  useEvents,
  useCollaborationMessages,
  useCollaborationMilestones,
  useUsers,
  createCollaborationMessage,
  createCollaborationMilestone,
  updateCollaborationMilestone,
  deleteCollaborationMilestone,
  updateInvitation,
  createEventArtist,
  deleteEventArtist,
  createEventParticipant,
  updateEventParticipant,
  deleteEventParticipant,
  getArtistByUserId,
  uploadMultipleFiles, getFileUrl,
  downloadFile,
} from '../../../services/servapi';
import {
  MessageSquare,
  X,
  Users,
  Music,
  Building,
  User as UserIcon,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Send,
  Filter,
  Maximize2,
  FileText,
  Plane,
  Hotel,
  FileCheck,
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Info,
  Paperclip,
  Download,
  Target,
  Rocket,
  PartyPopper,
} from 'lucide-react';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const MessengerModal = ({ isOpen, onClose, currentUser }: MessengerModalProps) => {
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'club' | 'artist' | 'user'>('all');
  const [showEventFilter, setShowEventFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [milestoneProgress, setMilestoneProgress] = useState(0);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<CollaborationMilestone | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'details'>('chat');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    assignedTo: 'both' as 'artist' | 'club' | 'both',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);

  // Fetch data avec refetch automatique
  const { data: invitations, loading: invitationsLoading, refetch: refetchInvitations } = useInvitations(
    showEventFilter && selectedEvent
      ? { eventId: selectedEvent.id }
      : { organizerId: currentUser.id }
  );

  const { data: events, loading: eventsLoading, refetch: refetchEvents } = useEvents(
    { organizerId: currentUser.id }
  );

  const { data: messages, loading: messagesLoading, refetch: refetchMessages } = useCollaborationMessages(
    selectedInvitation?.id
  );

  const { data: milestones, loading: milestonesLoading, refetch: refetchMilestones } = useCollaborationMilestones(
    selectedInvitation?.id
  );

  const { data: users, loading: usersLoading, refetch: refetchUsers } = useUsers();

  // Fonction pour rafraîchir toutes les données (sans les milestones pour éviter la boucle)
  const refreshAllData = useCallback(async (includeMilestones: boolean = false) => {
    try {
      const promises = [
        refetchInvitations(),
        refetchEvents(),
        refetchUsers(),
        selectedInvitation && refetchMessages()
      ];

      if (includeMilestones && selectedInvitation) {
        promises.push(refetchMilestones());
      }

      await Promise.all(promises.filter(Boolean));

      // FORCER la mise à jour de l'invitation sélectionnée après rafraîchissement
      if (selectedInvitation) {
        const updatedInvitations = await refetchInvitations();
        const updatedInvitation = updatedInvitations.data?.find(
          (inv: Invitation) => inv.id === selectedInvitation.id
        );
        if (updatedInvitation) {
          setSelectedInvitation(updatedInvitation);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // On relance quand même les refetch même en cas d'erreur
      refetchInvitations();
      refetchEvents();
      refetchUsers();
      if (selectedInvitation) {
        refetchMessages();
        if (includeMilestones) {
          refetchMilestones();
        }
      }
    }
  }, [refetchInvitations, refetchEvents, refetchUsers, refetchMessages, refetchMilestones, selectedInvitation]);

  // Filter invitations by type
  const filteredInvitations = invitations?.filter(invitation => {
    // 1. SÉCURITÉ : Vérifier d'abord si l'utilisateur est concerné par cette invitation
    // L'utilisateur doit être soit celui qui invite (invitedById), soit celui qui est invité (userId)
    const isMyInvitation =
      invitation.userId === currentUser.id ||
      invitation.invitedById === currentUser.id;

    // Si ce n'est pas mon invitation, je ne dois pas la voir, peu importe le filtre sélectionné
    if (!isMyInvitation) return false;

    // 2. FILTRES UI : Appliquer ensuite les filtres d'interface existants
    if (filterType === 'all') return true;

    // On récupère l'utilisateur cible de l'invitation pour vérifier son rôle
    const user = users?.find(u => u.id === invitation.userId);

    // Si l'utilisateur n'est pas trouvé (cas rare), on ne l'affiche pas par sécurité
    if (!user) return false;

    return user.role === filterType;
  });

  // Calculer la progression basée sur les milestones
  const calculateProgress = useCallback((milestones: CollaborationMilestone[]) => {
    if (!milestones || milestones.length === 0) return { progress: 0, currentMilestone: null };

    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = milestones.length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    const currentMilestone = milestones.find(m => m.status !== 'completed');

    return { progress, currentMilestone };
  }, []);

  // Mettre à jour la progression automatiquement (sans créer de boucle)
  useEffect(() => {
    if (milestones && selectedInvitation) {
      const { progress, currentMilestone } = calculateProgress(milestones);

      setMilestoneProgress(progress);
      setMilestoneTitle(currentMilestone?.title || 'Toutes les étapes terminées');

      // Mettre à jour la progression de l'invitation seulement si changement significatif
      // et éviter la boucle infinie
      if (selectedInvitation.progress !== progress) {
        updateInvitationProgress(progress);
      }

      // Si tous les milestones sont complétés, on prépare l'affichage du bouton de confirmation
      if (progress === 100 && selectedInvitation.status === 'preparation') {
        const event = getEventForInvitation(selectedInvitation);
        if (event && new Date() > new Date(event.date)) {
          updateInvitationStatus('completed');
        }
      }
    } else {
      setMilestoneProgress(0);
      setMilestoneTitle('Aucune étape définie');
    }
  }, [milestones, selectedInvitation, calculateProgress]);

  const updateInvitationProgress = async (progress: number) => {
    if (!selectedInvitation) return;

    try {
      await updateInvitation(selectedInvitation.id, {
        progress: progress
      });

      // Mettre à jour l'invitation sélectionnée localement immédiatement
      setSelectedInvitation(prev => prev ? {
        ...prev,
        progress: progress
      } : null);

      // Rafraîchir les données globales
      await refreshAllData(false);
    } catch (error) {
      console.error('Error updating invitation progress:', error);

      // Mettre à jour quand même localement en cas d'erreur
      setSelectedInvitation(prev => prev ? {
        ...prev,
        progress: progress
      } : null);

      await refreshAllData(false);
    }
  };

  const updateInvitationStatus = async (status: string) => {
    if (!selectedInvitation) return;

    try {
      // Mettre à jour le statut de l'invitation
      await updateInvitation(selectedInvitation.id, {
        status: status as any
      });

      setSelectedInvitation(prev => prev ? {
        ...prev,
        status: status as any
      } : null);

      // Gérer les événements associés (eventArtists et eventParticipants)
      const event = getEventForInvitation(selectedInvitation);

      if (event) {
        // Vérifier le rôle de l'utilisateur invité
        const invitedUser = users?.find(user => user.id === selectedInvitation.userId);
        const isArtist = invitedUser?.role === 'artist';

        if (isArtist) {
          // POUR LES ARTISTES - gérer eventArtists
          try {
            const artistResponse = await getArtistByUserId(selectedInvitation.userId);
            const artistId = artistResponse.id;

            if (status === 'confirmed' || status === 'completed') {
              // Ajouter à eventArtists avec le bon artistId
              try {
                await createEventArtist({
                  eventId: selectedInvitation.eventId,
                  artistId: artistId,
                  fee: null
                });
                console.log(`Artiste ${artistId} (user: ${selectedInvitation.userId}) ajouté à l'événement ${selectedInvitation.eventId}`);
              } catch (error) {
                // Si l'artiste existe déjà, ignorer l'erreur de duplication
                if (error.message.includes('23505') || error.message.includes('duplicate')) {
                  console.log(`Artiste ${artistId} déjà présent dans l'événement`);
                } else {
                  console.error('Error adding artist to event:', error);
                }
              }
            } else {
              // Retirer de eventArtists si le statut n'est plus confirmed/completed
              try {
                await deleteEventArtist(selectedInvitation.eventId, artistId);
                console.log(`Artiste ${artistId} retiré de l'événement ${selectedInvitation.eventId}`);
              } catch (error) {
                // Si l'artiste n'existe pas, ignorer l'erreur
                if (error.message.includes('404') || error.message.includes('not found')) {
                  console.log(`Artiste ${artistId} non trouvé dans l'événement`);
                } else {
                  console.error('Error removing artist from event:', error);
                }
              }
            }
          } catch (error) {
            console.error('Error fetching artist data:', error);
          }
        } else {
          // POUR LES UTILISATEURS NORMALS - gérer eventParticipants
          let participantStatus: 'pending' | 'confirmed' | 'cancel' = 'pending';

          // Déterminer le statut du participant basé sur le statut de l'invitation
          if (status === 'confirmed' || status === 'completed') {
            participantStatus = 'confirmed';
          } else if (status === 'cancelled' || status === 'rejected' || status === 'declined') {
            participantStatus = 'cancel';
          }

          try {
            // Essayer de créer le participant
            await createEventParticipant({
              eventId: selectedInvitation.eventId,
              userId: selectedInvitation.userId,
              status: participantStatus
            });
            console.log(`Participant ${selectedInvitation.userId} créé pour l'événement ${selectedInvitation.eventId} avec statut: ${participantStatus}`);
          } catch (error) {
            // Si le participant existe déjà (erreur de duplication), le mettre à jour
            if (error.message.includes('23505') || error.message.includes('duplicate')) {
              try {
                await updateEventParticipant(selectedInvitation.eventId, selectedInvitation.userId, {
                  status: participantStatus
                });
                console.log(`Participant ${selectedInvitation.userId} mis à jour pour l'événement ${selectedInvitation.eventId} avec statut: ${participantStatus}`);
              } catch (updateError) {
                console.error('Error updating participant:', updateError);
              }
            } else {
              console.error('Error creating participant:', error);
            }
          }
        }
      }

      await refreshAllData(true); // On inclut les milestones ici car c'est une action utilisateur
    } catch (error) {
      console.error('Error updating invitation status:', error);
      await refreshAllData(true); // Rafraîchir même en cas d'erreur
    }
  };

  const handleSendMessage = async () => {
    if (!selectedInvitation || !newMessage.trim() || isSending || uploadingFiles) return;

    setIsSending(true);
    try {
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';

      await createCollaborationMessage({
        invitationId: selectedInvitation.id,
        senderType: senderType,
        senderId: currentUser.id,
        content: newMessage.trim()
      });

      setNewMessage('');
      await refreshAllData(true);
    } catch (error) {
      console.error('Error sending message:', error);
      await refreshAllData(true);
    } finally {
      setIsSending(false);
    }
  };

  // CRÉER un nouveau milestone
  const handleCreateMilestone = async () => {
    if (!selectedInvitation || !newMilestone.title.trim()) return;

    try {
      await createCollaborationMilestone({
        invitationId: selectedInvitation.id,
        title: newMilestone.title.trim(),
        description: newMilestone.description,
        assignedTo: newMilestone.assignedTo,
        priority: newMilestone.priority,
        dueDate: newMilestone.dueDate ? new Date(newMilestone.dueDate) : null,
        status: 'pending'
      });

      // Réinitialiser le formulaire
      setNewMilestone({
        title: '',
        description: '',
        assignedTo: 'both',
        priority: 'medium',
        dueDate: ''
      });
      setShowMilestoneForm(false);

      await refreshAllData(true);

      // Message automatique
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';
      await createCollaborationMessage({
        invitationId: selectedInvitation.id,
        senderType: senderType,
        senderId: currentUser.id,
        content: `Nouvelle étape créée: "${newMilestone.title.trim()}"`
      });

      await refreshAllData(true);

    } catch (error) {
      console.error('Error creating milestone:', error);
      await refreshAllData(true);
    }
  };

  // METTRE À JOUR un milestone
  const handleUpdateMilestone = async (milestoneId: number, updates: Partial<CollaborationMilestone>) => {
    if (!selectedInvitation) return;

    try {
      const milestone = milestones?.find(m => m.id === milestoneId);
      if (!milestone) return;

      // Vérifier les permissions pour cocher comme "completed"
      if (updates.status === 'completed') {
        const canComplete =
          milestone.assignedTo === 'both' ||
          (milestone.assignedTo === 'artist' && currentUser.role === 'artist') ||
          (milestone.assignedTo === 'club' && currentUser.role === 'club');

        if (!canComplete) {
          alert('Vous n\'êtes pas autorisé à compléter cette étape');
          return;
        }
      }

      await updateCollaborationMilestone(milestoneId, {
        ...updates,
        ...(updates.status === 'completed' && { completedAt: new Date() }),
        ...(updates.status !== 'completed' && updates.status !== 'completed' && { completedAt: null })
      });

      await refreshAllData(true);

      // Message automatique pour notifier du changement
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';
      let statusText = '';

      if (updates.status === 'completed') statusText = 'terminée';
      else if (updates.status === 'in_progress') statusText = 'en cours';
      else if (updates.status === 'pending') statusText = 'en attente';

      if (statusText) {
        await createCollaborationMessage({
          invitationId: selectedInvitation.id,
          senderType: senderType,
          senderId: currentUser.id,
          content: `Étape "${milestone.title}" ${statusText}`
        });
        await refreshAllData(true);
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      await refreshAllData(true);
    }
  };

  // MODIFIER un milestone
  const handleEditMilestone = (milestone: CollaborationMilestone) => {
    setEditingMilestone(milestone);
    setNewMilestone({
      title: milestone.title,
      description: milestone.description || '',
      assignedTo: milestone.assignedTo,
      priority: milestone.priority,
      dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split('T')[0] : ''
    });
    setShowMilestoneForm(true);
  };

  // SAUVEGARDER la modification d'un milestone
  const handleSaveMilestoneEdit = async () => {
    if (!editingMilestone || !newMilestone.title.trim()) return;

    try {
      await updateCollaborationMilestone(editingMilestone.id, {
        title: newMilestone.title.trim(),
        description: newMilestone.description,
        assignedTo: newMilestone.assignedTo,
        priority: newMilestone.priority,
        dueDate: newMilestone.dueDate ? new Date(newMilestone.dueDate) : null
      });

      setEditingMilestone(null);
      setNewMilestone({
        title: '',
        description: '',
        assignedTo: 'both',
        priority: 'medium',
        dueDate: ''
      });
      setShowMilestoneForm(false);

      await refreshAllData(true);

      // Message automatique
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';
      await createCollaborationMessage({
        invitationId: selectedInvitation!.id,
        senderType: senderType,
        senderId: currentUser.id,
        content: `Étape modifiée: "${newMilestone.title.trim()}"`
      });

      await refreshAllData(true);

    } catch (error) {
      console.error('Error updating milestone:', error);
      await refreshAllData(true);
    }
  };

  // SUPPRIMER un milestone
  const handleDeleteMilestone = async (milestoneId: number) => {
    if (!selectedInvitation || !confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) return;

    try {
      // Supprimer le milestone - on s'attend à une erreur de parsing (204 No Content)
      await deleteCollaborationMilestone(milestoneId);
    } catch (error) {
      // Ignorer spécifiquement l'erreur de parsing JSON pour les réponses 204
      if (error.message.includes('JSON') || error.message.includes('Unexpected end of JSON input')) {
        // C'est normal pour une réponse 204, on continue
        console.log('Milestone supprimé avec succès (réponse 204)');
      } else {
        // Pour les autres erreurs, on les affiche
        console.error('Error deleting milestone:', error);
        await refreshAllData(true);
        return; // On arrête si c'est une vraie erreur
      }
    }

    // Mettre à jour l'interface
    try {
      await refreshAllData(true);

      // Ajouter un message dans le chat
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';
      await createCollaborationMessage({
        invitationId: selectedInvitation.id,
        senderType: senderType,
        senderId: currentUser.id,
        content: `Étape supprimée`
      });

      await refreshAllData(true);
    } catch (updateError) {
      console.error('Error updating interface after deletion:', updateError);
      await refreshAllData(true);
    }
  };

  const getMilestoneIcon = (title: string) => {
    if (title.includes('rider') || title.includes('Rider')) return <FileText size={14} />;
    if (title.includes('vol') || title.includes('flight')) return <Plane size={14} />;
    if (title.includes('hôtel') || title.includes('hotel')) return <Hotel size={14} />;
    if (title.includes('contrat') || title.includes('contract')) return <FileCheck size={14} />;
    if (title.includes('acompte') || title.includes('payment') || title.includes('solde')) return <CreditCard size={14} />;
    if (title.includes('playlist')) return <Music size={14} />;
    return <CheckCircle size={14} />;
  };

  const getAssignedToText = (assignedTo: string) => {
    switch (assignedTo) {
      case 'artist': return 'Artiste';
      case 'club': return 'Club';
      case 'both': return 'Les deux';
      default: return assignedTo;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
      case 'completed':
        return '#10B981';
      case 'pending':
      case 'negotiation':
        return '#F59E0B';
      case 'rejected':
      case 'cancelled':
      case 'declined':
        return '#EF4444';
      case 'preparation':
        return '#3B82F6';
      default:
        return '#9ca3af';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
      case 'negotiation':
        return <ClockIcon size={16} />;
      case 'rejected':
      case 'cancelled':
      case 'declined':
        return <AlertCircle size={16} />;
      case 'preparation':
        return <TrendingUp size={16} />;
      default:
        return <ClockIcon size={16} />;
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist':
        return <Music size={16} />;
      case 'club':
        return <Building size={16} />;
      case 'admin':
        return <Users size={16} />;
      default:
        return <UserIcon size={16} />;
    }
  };

  const getProfileImage = (invitation: Invitation) => {
    const targetUser = users?.find(user => user.id === invitation.userId);

    if (targetUser?.profileImage) {
      return targetUser.profileImage;
    }

    const role = targetUser?.role || 'user';
    const name = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : `Utilisateur ${invitation.userId}`;

    let color = 'fe2f58';
    if (role === 'artist') color = '8B5CF6';
    if (role === 'club') color = '10B981';
    if (role === 'admin') color = 'F59E0B';

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
  };

  const getUserInfo = (invitation: Invitation) => {
    const user = users?.find(u => u.id === invitation.userId);
    const event = getEventForInvitation(invitation);

    return {
      name: user ? `${user.firstName} ${user.lastName}` : `Utilisateur #${invitation.userId}`,
      role: user?.role || event?.organizerType || 'user',
      user: user
    };
  };

  const getInviterInfo = (invitation: Invitation) => {
    const inviterUser = users?.find(u => u.id === invitation.invitedById);

    const role = inviterUser?.role || 'user';
    let color = 'fe2f58';
    if (role === 'artist') color = '8B5CF6';
    if (role === 'club') color = '10B981';
    if (role === 'admin') color = 'F59E0B';

    return {
      name: inviterUser ? `${inviterUser.firstName} ${inviterUser.lastName}` : `Utilisateur #${invitation.invitedById}`,
      profileImage: inviterUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(inviterUser ? `${inviterUser.firstName} ${inviterUser.lastName}` : `User${invitation.invitedById}`)}&background=${color}&color=fff&size=128`,
      user: inviterUser
    };
  };
  const getEventForInvitation = (invitation: Invitation) => {
    return events?.find(event => event.id === invitation.eventId);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gérer la sélection de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      // Reset l'input file
      event.target.value = '';
    }
  };

  // Supprimer un fichier sélectionné
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Vider tous les fichiers sélectionnés
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  // Envoyer les fichiers
  const handleSendFiles = async () => {
    if (!selectedInvitation || selectedFiles.length === 0 || uploadingFiles) return;

    setUploadingFiles(true);
    try {
      // Upload les fichiers
      const uploadResponse = await uploadMultipleFiles(selectedFiles);

      // Créer un message avec les liens des fichiers
      const senderType = currentUser.role === 'club' ? 'club' : 'artist';
      const fileLinks = uploadResponse.files.map(file =>
        `📎 ${file.originalName}: ${getFileUrl(file.filename)}`
      ).join('\n');

      const messageContent = `J'ai partagé ${selectedFiles.length} fichier(s):\n${fileLinks}`;

      await createCollaborationMessage({
        invitationId: selectedInvitation.id,
        senderType: senderType,
        senderId: currentUser.id,
        content: messageContent
      });

      // Vider les fichiers sélectionnés
      setSelectedFiles([]);
      await refreshAllData(true);
    } catch (error) {
      console.error('Error sending files:', error);
      alert('Erreur lors de l\'envoi des fichiers');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Télécharger un fichier
  const handleDownloadFile = async (filename: string, originalName: string) => {
    try {
      // Utiliser votre service downloadFile
      const blob = await downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  // Fonction pour détecter les URLs de fichiers dans les messages
  const renderMessageContent = (content: string) => {
    // Si le message commence par "J'ai partagé X fichier(s):", on affiche uniquement les fichiers
    if (content.startsWith("J'ai partagé") && content.includes('fichier(s):')) {
      const lines = content.split('\n');
      const fileLines = lines.slice(1); // Enlever la première ligne "J'ai partagé..."

      return (
        <div className="space-y-2">
          <p className="text-[#9ca3af] text-sm mb-2 flex items-center space-x-2">
            <FileText size={16} />
            <span>{lines[0]}</span>
          </p>
          {fileLines.map((line, index) => {
            if (line.trim() === '') return null;

            // Extraire le nom du fichier et l'URL
            const match = line.match(/📎 (.+?): (.+)/);
            if (match) {
              const originalName = match[1];
              const fileUrl = match[2];
              const filename = fileUrl.split('/').pop() || originalName;

              return (
                <div key={index} className="flex items-center justify-between bg-[#1f1f23] p-3 rounded-lg border border-[#374151]">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText size={18} className="text-[#fe2f58] flex-shrink-0" />
                    <span className="text-[#ffffff] text-sm truncate" title={originalName}>
                      {originalName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(filename, originalName)}
                    className="bg-[#fe2f58] hover:bg-[#e02e50] text-[#ffffff] px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm flex-shrink-0 ml-3"
                  >
                    <Download size={16} />
                    <span>Télécharger</span>
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    // Pour les messages normaux sans fichiers, on garde l'affichage original
    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className={`bg-[#18181b] border border-[#374151] rounded-lg flex overflow-hidden transition-all duration-300 ${isExpanded
        ? 'w-[98vw] h-[98vh]'
        : 'w-4/5 h-4/5 max-w-6xl max-h-[90vh]'
        }`}>

        {/* Left Side - Contacts */}
        <div className="w-1/3 border-r border-[#374151] bg-[#18181b] flex flex-col">

          {/* Header */}
          <div className="p-4 border-b border-[#374151] bg-[#18181b]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="text-[#fe2f58]" size={24} />
                <h2 className="text-[#ffffff] text-xl font-semibold">Collaborations</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#9ca3af] hover:text-[#ffffff] transition-colors p-1 rounded"
                  title={isExpanded ? "Réduire" : "Agrandir"}
                >
                  <Maximize2 size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="text-[#9ca3af] hover:text-[#ffffff] transition-colors p-1 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-4">
              {(['all', 'club', 'artist', 'user'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${filterType === type
                    ? 'bg-[#fe2f58] text-[#ffffff]'
                    : 'bg-[#1f1f23] text-[#9ca3af] hover:text-[#ffffff]'
                    }`}
                >
                  {type === 'all' && <Filter size={14} />}
                  {type === 'club' && <Building size={14} />}
                  {type === 'artist' && <Music size={14} />}
                  {type === 'user' && <UserIcon size={14} />}
                  <span>
                    {type === 'all' ? 'Tous' :
                      type === 'club' ? 'Clubs' :
                        type === 'artist' ? 'Artistes' : 'Utilisateurs'}
                  </span>
                </button>
              ))}
            </div>

            {/* Event Filter Toggle */}
            <button
              onClick={() => {
                setShowEventFilter(!showEventFilter);
                if (showEventFilter) setSelectedEvent(null);
              }}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm transition-colors ${showEventFilter
                ? 'bg-[#fe2f58] text-[#ffffff]'
                : 'bg-[#1f1f23] text-[#9ca3af] hover:text-[#ffffff]'
                }`}
            >
              <Calendar size={16} />
              <span>
                {showEventFilter ? 'Voir toutes les collaborations' : 'Filtrer par événement'}
              </span>
            </button>
          </div>

          {/* Event List (when filter is active) */}
          {showEventFilter && (
            <div className="border-b border-[#374151] bg-[#18181b]">
              <div className="p-3">
                <h3 className="text-[#ffffff] text-sm font-medium mb-2 flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Mes Événements ({events?.length || 0})</span>
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {eventsLoading ? (
                    <div className="text-[#9ca3af] text-sm flex items-center justify-center py-4">
                      <ClockIcon className="animate-spin mr-2" size={16} />
                      Chargement...
                    </div>
                  ) : events?.length === 0 ? (
                    <div className="text-[#9ca3af] text-sm text-center py-4">
                      Aucun événement trouvé
                    </div>
                  ) : (
                    events?.map(event => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 border ${selectedEvent?.id === event.id
                          ? 'bg-[#fe2f58] text-[#ffffff] border-[#fe2f58]'
                          : 'bg-[#1f1f23] border-[#374151] text-[#9ca3af] hover:text-[#ffffff] hover:border-[#fe2f58]'
                          }`}
                      >
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-[#374151] flex items-center justify-center">
                            <Calendar size={20} className="text-[#9ca3af]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75 flex items-center space-x-1 mt-1">
                            <MapPin size={12} />
                            <span className="truncate">{event.venueName}</span>
                          </div>
                          <div className="text-xs opacity-75 flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users size={12} />
                              <span>{event.participantCount} participants</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {selectedEvent && (
                  <div className="mt-3 pt-3 border-t border-[#374151]">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="w-full text-center text-[#fe2f58] text-sm hover:underline"
                    >
                      Effacer le filtre
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {invitationsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#9ca3af] flex items-center space-x-2">
                  <ClockIcon className="animate-spin" size={16} />
                  <span>Chargement...</span>
                </div>
              </div>
            ) : filteredInvitations?.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-[#9ca3af] text-center">
                  <Users size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Aucune collaboration trouvée</p>
                  <p className="text-xs mt-1">Ajustez vos filtres pour voir plus de résultats</p>
                </div>
              </div>
            ) : (
              filteredInvitations?.map(invitation => {
                const event = getEventForInvitation(invitation);
                const userInfo = getUserInfo(invitation);

                return (
                  <button
                    key={invitation.id}
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setActiveTab('chat');
                    }}
                    className={`w-full text-left p-4 border-b border-[#1f1f23] transition-colors ${selectedInvitation?.id === invitation.id
                      ? 'bg-[#1f1f23] border-l-4 border-l-[#fe2f58]'
                      : 'bg-[#18181b] hover:bg-[#1f1f23]'
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={getProfileImage(invitation)}
                          alt={userInfo.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#374151]"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#18181b] rounded-full p-1">
                          {getRoleIcon(userInfo.role)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#ffffff] font-medium truncate text-sm">
                            {userInfo.name}
                          </span>
                          <div
                            className="flex items-center space-x-1"
                            style={{ color: getStatusColor(invitation.status) }}
                          >
                            {getStatusIcon(invitation.status)}
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getStatusColor(invitation.status) }}
                            />
                          </div>
                        </div>

                        <div className="text-xs mb-2 flex items-center space-x-1">
                          {getStatusIcon(invitation.status)}
                          <span
                            className="font-medium"
                            style={{ color: getStatusColor(invitation.status) }}
                          >
                            {getStatusText(invitation.status)}
                          </span>
                          <span className="text-[#9ca3af] mx-1">•</span>
                          <span className="text-[#9ca3af]">Progrès: {invitation.progress}%</span>
                          <span className="text-[#9ca3af] mx-1">•</span>
                          <span className="text-[#9ca3af] capitalize">{userInfo.role}</span>
                        </div>

                        {event && (
                          <div className="bg-[#18181b] rounded p-2 mb-2">
                            <div className="text-[#ffffff] text-xs font-medium truncate flex items-center space-x-2">
                              {event.coverImage && (
                                <img
                                  src={event.coverImage}
                                  alt={event.title}
                                  className="w-6 h-6 rounded object-cover"
                                />
                              )}
                              <span>{event.title}</span>
                            </div>
                            <div className="text-[#9ca3af] text-xs flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar size={10} />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin size={10} />
                                <span className="truncate">{event.venueName}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {invitation.description && (
                          <div className="text-[#9ca3af] text-xs line-clamp-2">
                            {invitation.description}
                          </div>
                        )}

                        <div className="text-[#6B7280] text-xs mt-2 flex justify-between">
                          <span>
                            {invitation.expectedAttendees > 0 &&
                              `${invitation.expectedAttendees} participants attendus`
                            }
                          </span>
                          <span>
                            {formatDate(invitation.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side - Messages et Collaboration */}
        <div className="flex-1 flex flex-col bg-[#18181b]">

          {selectedInvitation ? (
            <>
              {/* Header avec onglets */}
              <div className="p-4 border-b border-[#374151] bg-[#18181b]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 relative">
                      <img
                        src={getProfileImage(selectedInvitation)}
                        alt={getUserInfo(selectedInvitation).name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#fe2f58]"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#18181b] rounded-full p-1">
                        {getRoleIcon(getUserInfo(selectedInvitation).role)}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#ffffff] font-semibold text-lg">
                        {getUserInfo(selectedInvitation).name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getStatusColor(selectedInvitation.status),
                            color: '#ffffff'
                          }}
                        >
                          {getStatusIcon(selectedInvitation.status)}
                          <span>{getStatusText(selectedInvitation.status)}</span>
                        </div>
                        <div className="text-[#9ca3af] text-sm">
                          Progrès: {milestoneProgress}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'onglets */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'chat'
                        ? 'bg-[#fe2f58] text-[#ffffff]'
                        : 'bg-[#1f1f23] text-[#9ca3af] hover:text-[#ffffff]'
                        }`}
                    >
                      <MessageSquare size={16} />
                      <span>Discussion</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'details'
                        ? 'bg-[#fe2f58] text-[#ffffff]'
                        : 'bg-[#1f1f23] text-[#9ca3af] hover:text-[#ffffff]'
                        }`}
                    >
                      <Info size={16} />
                      <span>Détails</span>
                    </button>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#ffffff] text-sm font-medium flex items-center space-x-2">
                      <TrendingUp size={16} />
                      <span>{milestoneTitle}</span>
                    </span>
                    <span className="text-[#9ca3af] text-sm">{milestoneProgress}%</span>
                  </div>
                  <div className="w-full bg-[#1f1f23] rounded-full h-2 mb-1">
                    <div
                      className="bg-[#fe2f58] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestoneProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Contenu selon l'onglet actif */}
              {activeTab === 'chat' ? (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#18181b]">
                    {messagesLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="text-[#9ca3af] flex items-center space-x-2">
                          <ClockIcon className="animate-spin" size={16} />
                          <span>Chargement des messages...</span>
                        </div>
                      </div>
                    ) : messages?.length === 0 ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="text-[#9ca3af] text-center">
                          <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Aucun message encore.</p>
                          <p className="text-sm mt-1">Commencez la conversation !</p>
                        </div>
                      </div>
                    ) : (
                      messages?.map(message => {
                        const messageSender = users?.find(user => user.id === message.senderId);
                        const senderProfileImage = messageSender?.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(messageSender ? `${messageSender.firstName} ${messageSender.lastName}` : `User${message.senderId}`)}&background=fe2f58&color=fff&size=128`;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                              {message.senderId !== currentUser.id && (
                                <img
                                  src={senderProfileImage}
                                  alt={messageSender ? `${messageSender.firstName} ${messageSender.lastName}` : `Utilisateur ${message.senderId}`}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <div
                                className={`px-4 py-2 rounded-lg ${message.senderId === currentUser.id
                                  ? 'bg-[#fe2f58] text-[#ffffff] rounded-br-none'
                                  : 'bg-[#1f1f23] text-[#ffffff] rounded-bl-none'
                                  }`}
                              >
                                <div className="text-sm whitespace-pre-wrap">
                                  {renderMessageContent(message.content)}
                                </div>
                                <div
                                  className={`text-xs mt-1 flex items-center space-x-1 ${message.senderId === currentUser.id
                                    ? 'text-[#ffffff] opacity-80'
                                    : 'text-[#9ca3af]'
                                    }`}
                                >
                                  <Clock size={12} />
                                  <span>
                                    {formatDateTime(message.createdAt)}
                                  </span>
                                </div>
                              </div>
                              {message.senderId === currentUser.id && (
                                <img
                                  src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${currentUser.firstName} ${currentUser.lastName}`)}&background=fe2f58&color=fff&size=128`}
                                  alt="Vous"
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-[#374151] bg-[#18181b]">
                    <div className="flex space-x-3">
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Tapez votre message..."
                          className="flex-1 bg-[#1f1f23] border border-[#374151] rounded-lg px-4 py-2 text-[#ffffff] placeholder-[#9ca3af] focus:outline-none focus:border-[#fe2f58] transition-colors"
                          disabled={isSending}
                        />
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="*/*"
                        />
                        <label
                          htmlFor="file-upload"
                          className="bg-[#1f1f23] hover:bg-[#374151] border border-[#374151] text-[#9ca3af] hover:text-[#ffffff] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                          title="Ajouter des fichiers"
                        >
                          <FileText size={16} />
                        </label>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="bg-[#fe2f58] hover:bg-[#e02e50] disabled:bg-[#1f1f23] disabled:text-[#9ca3af] text-[#ffffff] px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {isSending ? (
                          <ClockIcon className="animate-spin" size={16} />
                        ) : (
                          <Send size={16} />
                        )}
                        <span>{isSending ? 'Envoi...' : 'Envoyer'}</span>
                      </button>
                    </div>
                    {/* Afficher les fichiers sélectionnés */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[#9ca3af] text-sm">Fichiers à envoyer:</p>
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#1f1f23] p-2 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText size={14} className="text-[#fe2f58]" />
                              <span className="text-[#ffffff] text-sm">{file.name}</span>
                              <span className="text-[#9ca3af] text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="text-[#9ca3af] hover:text-[#dc2626] transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={clearSelectedFiles}
                            className="text-[#9ca3af] hover:text-[#ffffff] text-sm transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleSendFiles}
                            disabled={isSending}
                            className="bg-[#fe2f58] hover:bg-[#e02e50] text-[#ffffff] px-4 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            {isSending ? (
                              <ClockIcon className="animate-spin" size={14} />
                            ) : (
                              <Send size={14} />
                            )}
                            <span>Envoyer {selectedFiles.length} fichier(s)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Onglet Détails */
                <div className="flex-1 overflow-y-auto p-4 bg-[#18181b]">
                  <div className="space-y-6">
                    {/* Informations de l'invitation */}
                    <div className="bg-[#1f1f23] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-[#ffffff] font-semibold mb-3 flex items-center space-x-2">
                        <Info size={16} />
                        <span>Informations de l'invitation</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedInvitation.genre && (
                          <div className="flex items-center space-x-2 text-[#d1d5db]">
                            <Music size={16} />
                            <span>Genre: {selectedInvitation.genre}</span>
                          </div>
                        )}
                        {selectedInvitation.expectedAttendees > 0 && (
                          <div className="flex items-center space-x-2 text-[#d1d5db]">
                            <Users size={16} />
                            <span>{selectedInvitation.expectedAttendees} participants attendus</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-[#d1d5db]">
                          <Calendar size={16} />
                          <span>Créée le: {formatDate(selectedInvitation.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#d1d5db]">
                          {selectedInvitation.invitedById === currentUser.id ? (
                            <>
                              <UserIcon size={16} />
                              <span>Vous avez envoyé cette invitation</span>
                            </>
                          ) : (
                            (() => {
                              const inviterInfo = getInviterInfo(selectedInvitation);
                              return (
                                <div className="flex items-center space-x-2">
                                  <UserIcon size={16} />
                                  <span>Invitation de: {inviterInfo.name}</span>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </div>

                      {selectedInvitation.description && (
                        <div className="mt-3">
                          <label className="text-[#d1d5db] text-sm block mb-1">Description:</label>
                          <p className="text-[#ffffff] text-sm bg-[#18181b] p-3 rounded border border-[#374151]">
                            {selectedInvitation.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Informations de l'événement */}
                    {(() => {
                      const event = getEventForInvitation(selectedInvitation);
                      if (!event) return null;

                      return (
                        <div className="bg-[#1f1f23] rounded-lg p-4 border border-[#374151]">
                          <h4 className="text-[#ffffff] font-semibold mb-3 flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>Événement associé</span>
                          </h4>

                          <div className="flex items-start space-x-4">
                            {event.coverImage ? (
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-20 h-20 rounded object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded bg-[#374151] flex items-center justify-center">
                                <Calendar size={24} className="text-[#9ca3af]" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h5 className="text-[#ffffff] font-medium text-lg mb-2">{event.title}</h5>

                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center space-x-2 text-[#d1d5db]">
                                  <Calendar size={14} />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#d1d5db]">
                                  <Clock size={14} />
                                  <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#d1d5db]">
                                  <MapPin size={14} />
                                  <span>{event.venueName}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#d1d5db]">
                                  <DollarSign size={14} />
                                  <span>{event.price} €</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#d1d5db]">
                                  <Users size={14} />
                                  <span>{event.participantCount} participants</span>
                                </div>
                              </div>

                              {event.description && (
                                <div className="mt-3">
                                  <label className="text-[#d1d5db] text-sm block mb-1">Description:</label>
                                  <p className="text-[#ffffff] text-sm">
                                    {event.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Boutons de changement de statut selon la progression */}
                    <div className="bg-[#1f1f23] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-[#ffffff] font-semibold mb-3 flex items-center space-x-2">
                        <TrendingUp size={16} />
                        <span>Statut de la collaboration</span>
                      </h4>

                      <div className="space-y-3">
                        {/* Boutons selon la progression */}
                        {milestoneProgress === 0 && (
                          <>
                            <p className="text-[#d1d5db] text-sm mb-2 flex items-center space-x-2">
                              <Target size={16} />
                              <span>Début de collaboration - Choisissez le statut initial</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => updateInvitationStatus('pending')}
                                className="bg-[#F59E0B] hover:bg-[#D97706] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <ClockIcon size={14} />
                                <span>En attente</span>
                              </button>
                              <button
                                onClick={() => updateInvitationStatus('negotiation')}
                                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <Users size={14} />
                                <span>Négociation</span>
                              </button>
                            </div>
                          </>
                        )}

                        {milestoneProgress > 0 && milestoneProgress < 30 && (
                          <>
                            <p className="text-[#d1d5db] text-sm mb-2 flex items-center space-x-2">
                              <FileText size={16} />
                              <span>Collaboration en cours - Acceptez ou rejetez la proposition</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => updateInvitationStatus('accepted')}
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <CheckCircle size={14} />
                                <span>Accepter</span>
                              </button>
                              <button
                                onClick={() => updateInvitationStatus('rejected')}
                                className="bg-[#dc2626] hover:bg-[#b91c1c] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <AlertCircle size={14} />
                                <span>Rejeter</span>
                              </button>
                            </div>
                          </>
                        )}

                        {milestoneProgress >= 30 && milestoneProgress < 70 && (
                          <>
                            <p className="text-[#d1d5db] text-sm mb-2 flex items-center space-x-2">
                              <Rocket size={16} />
                              <span>Préparation active - Continuez ou annulez la collaboration</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => updateInvitationStatus('preparation')}
                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <TrendingUp size={14} />
                                <span>Préparation</span>
                              </button>
                              <button
                                onClick={() => updateInvitationStatus('cancelled')}
                                className="bg-[#6B7280] hover:bg-[#4B5563] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <X size={14} />
                                <span>Annuler</span>
                              </button>
                            </div>
                          </>
                        )}

                        {milestoneProgress >= 70 && milestoneProgress < 100 && (
                          <>
                            <p className="text-[#d1d5db] text-sm mb-2 flex items-center space-x-2">
                              <CheckCircle size={16} />
                              <span>Finalisation - Confirmez ou refusez définitivement</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => updateInvitationStatus('confirmed')}
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <CheckCircle size={14} />
                                <span>Confirmer</span>
                              </button>
                              <button
                                onClick={() => updateInvitationStatus('declined')}
                                className="bg-[#dc2626] hover:bg-[#b91c1c] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <AlertCircle size={14} />
                                <span>Refuser</span>
                              </button>
                            </div>
                          </>
                        )}

                        {milestoneProgress === 100 && (
                          <>
                            <p className="text-[#d1d5db] text-sm mb-2 flex items-center space-x-2">
                              <PartyPopper size={16} />
                              <span>Félicitations ! Toutes les étapes sont terminées</span>
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              <button
                                onClick={() => updateInvitationStatus('completed')}
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-[#ffffff] px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-1"
                              >
                                <CheckCircle size={14} />
                                <span>Marquer comme terminé</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-3 text-center">
                        <p className="text-[#d1d5db] text-xs">
                          Progression: {milestoneProgress}% • Statut actuel: {getStatusText(selectedInvitation?.status || 'pending')}
                        </p>
                      </div>
                    </div>

                    {/* Section création/modification de milestone */}
                    {(showMilestoneForm || editingMilestone) && (
                      <div className="bg-[#1f1f23] rounded-lg p-4 border border-[#374151]">
                        <h4 className="text-[#ffffff] font-medium mb-3">
                          {editingMilestone ? 'Modifier l\'étape' : 'Nouvelle étape de collaboration'}
                        </h4>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Titre de l'étape (ex: Envoyer le rider technique)"
                            value={newMilestone.title}
                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                            className="w-full bg-[#18181b] border border-[#374151] rounded px-3 py-2 text-[#ffffff] placeholder-[#9ca3af] text-sm focus:outline-none focus:border-[#fe2f58]"
                          />

                          <textarea
                            placeholder="Description détaillée (optionnelle)"
                            value={newMilestone.description}
                            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                            className="w-full bg-[#18181b] border border-[#374151] rounded px-3 py-2 text-[#ffffff] placeholder-[#9ca3af] text-sm focus:outline-none focus:border-[#fe2f58] resize-none"
                            rows={2}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[#d1d5db] text-xs block mb-1">Assigné à</label>
                              <select
                                value={newMilestone.assignedTo}
                                onChange={(e) => setNewMilestone({ ...newMilestone, assignedTo: e.target.value as any })}
                                className="w-full bg-[#18181b] border border-[#374151] rounded px-3 py-2 text-[#ffffff] text-sm focus:outline-none focus:border-[#fe2f58]"
                              >
                                <option value="both">Les deux</option>
                                <option value="artist">Artiste</option>
                                <option value="club">Club</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[#d1d5db] text-xs block mb-1">Priorité</label>
                              <select
                                value={newMilestone.priority}
                                onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value as any })}
                                className="w-full bg-[#18181b] border border-[#374151] rounded px-3 py-2 text-[#ffffff] text-sm focus:outline-none focus:border-[#fe2f58]"
                              >
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[#d1d5db] text-xs block mb-1">Date d'échéance (optionnelle)</label>
                            <input
                              type="date"
                              value={newMilestone.dueDate}
                              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                              className="w-full bg-[#18181b] border border-[#374151] rounded px-3 py-2 text-[#ffffff] text-sm focus:outline-none focus:border-[#fe2f58]"
                            />
                          </div>

                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => {
                                setShowMilestoneForm(false);
                                setEditingMilestone(null);
                                setNewMilestone({
                                  title: '',
                                  description: '',
                                  assignedTo: 'both',
                                  priority: 'medium',
                                  dueDate: ''
                                });
                              }}
                              className="px-4 py-2 text-[#9ca3af] hover:text-[#ffffff] transition-colors text-sm"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={editingMilestone ? handleSaveMilestoneEdit : handleCreateMilestone}
                              disabled={!newMilestone.title.trim()}
                              className="px-4 py-2 bg-[#fe2f58] hover:bg-[#e02e50] disabled:bg-[#1f1f23] disabled:text-[#9ca3af] text-[#ffffff] rounded transition-colors text-sm"
                            >
                              {editingMilestone ? 'Sauvegarder' : 'Créer l\'étape'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Liste des milestones interactifs */}
                    <div className="bg-[#1f1f23] rounded-lg p-4 border border-[#374151]">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[#ffffff] text-sm font-medium flex items-center space-x-2">
                          <CheckCircle size={16} />
                          <span>
                            Étapes de collaboration ({milestones?.filter(m => m.status === 'completed').length || 0}/{milestones?.length || 0})
                          </span>
                        </h4>
                        <button
                          onClick={() => setShowMilestoneForm(true)}
                          className="flex items-center space-x-1 px-3 py-1 bg-[#fe2f58] hover:bg-[#e02e50] text-[#ffffff] rounded text-sm transition-colors"
                        >
                          <Plus size={14} />
                          <span>Nouvelle étape</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {milestonesLoading ? (
                          <div className="text-[#9ca3af] text-sm text-center py-4">
                            <ClockIcon className="animate-spin inline mr-2" size={16} />
                            Chargement des étapes...
                          </div>
                        ) : milestones?.length === 0 ? (
                          <div className="text-[#9ca3af] text-sm text-center py-4 border border-dashed border-[#374151] rounded-lg">
                            <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                            <p>Aucune étape définie</p>
                            <p className="text-xs">Créez la première étape pour commencer le suivi</p>
                          </div>
                        ) : (
                          milestones?.map((milestone) => {
                            const canEdit = true; // Tout le monde peut éditer
                            const canComplete =
                              milestone.assignedTo === 'both' ||
                              (milestone.assignedTo === 'artist' && currentUser.role === 'artist') ||
                              (milestone.assignedTo === 'club' && currentUser.role === 'club');

                            return (
                              <div
                                key={milestone.id}
                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${milestone.status === 'completed'
                                  ? 'bg-[#22c55e] bg-opacity-20 border-[#22c55e]'
                                  : milestone.status === 'in_progress'
                                    ? 'bg-[#3B82F6] bg-opacity-20 border-[#3B82F6]'
                                    : 'bg-[#1f1f23] border-[#374151]'
                                  }`}
                              >
                                {/* Checkbox pour compléter */}
                                <button
                                  onClick={() => canComplete && handleUpdateMilestone(milestone.id, {
                                    status: milestone.status === 'completed' ? 'pending' : 'completed'
                                  })}
                                  disabled={!canComplete}
                                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${milestone.status === 'completed'
                                    ? 'bg-[#22c55e] border-[#22c55e] text-white'
                                    : canComplete
                                      ? 'bg-transparent border-[#6B7280] hover:border-[#fe2f58] hover:bg-[#fe2f58] hover:bg-opacity-20'
                                      : 'bg-transparent border-[#4B5563] cursor-not-allowed'
                                    }`}
                                  title={canComplete ?
                                    (milestone.status === 'completed' ? 'Marquer comme non terminée' : 'Marquer comme terminée') :
                                    'Vous n\'êtes pas autorisé à compléter cette étape'
                                  }
                                >
                                  {milestone.status === 'completed' && <CheckCircle size={12} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                      {getMilestoneIcon(milestone.title)}
                                      <span className={`text-sm font-medium ${milestone.status === 'completed' ? 'text-[#22c55e]' :
                                        milestone.status === 'in_progress' ? 'text-[#3B82F6]' :
                                          'text-[#ffffff]'
                                        }`}>
                                        {milestone.title}
                                      </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      {/* Badge priorité */}
                                      {milestone.priority !== 'medium' && (
                                        <div
                                          className="px-2 py-1 rounded-full text-xs font-medium"
                                          style={{
                                            backgroundColor: getPriorityColor(milestone.priority),
                                            color: '#ffffff'
                                          }}
                                        >
                                          {milestone.priority === 'high' ? 'Haute' : 'Basse'}
                                        </div>
                                      )}

                                      {/* Badge assigné à */}
                                      <div className="px-2 py-1 bg-[#374151] rounded-full text-xs text-[#9ca3af]">
                                        {getAssignedToText(milestone.assignedTo)}
                                      </div>

                                      {/* Boutons d'action */}
                                      {canEdit && (
                                        <div className="flex items-center space-x-1">
                                          {milestone.status !== 'completed' && (
                                            <button
                                              onClick={() => handleEditMilestone(milestone)}
                                              className="text-[#9ca3af] hover:text-[#22c55e] transition-colors p-1"
                                              title="Modifier"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                          )}
                                          <button
                                            onClick={() => handleDeleteMilestone(milestone.id)}
                                            className="text-[#9ca3af] hover:text-[#dc2626] transition-colors p-1"
                                            title="Supprimer"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {milestone.description && (
                                    <p className="text-xs text-[#9ca3af] mb-2">{milestone.description}</p>
                                  )}

                                  <div className="flex items-center space-x-4 text-xs text-[#6B7280]">
                                    <span>Assigné à: {getAssignedToText(milestone.assignedTo)}</span>
                                    {milestone.dueDate && (
                                      <span className={new Date(milestone.dueDate) < new Date() && milestone.status !== 'completed' ? 'text-[#dc2626]' : ''}>
                                        Échéance: {formatDate(milestone.dueDate)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {milestone.status === 'completed' && milestone.completedAt && (
                                  <div className="text-xs text-[#22c55e] flex-shrink-0 text-right">
                                    Terminé le<br />
                                    {formatDate(milestone.completedAt)}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#18181b] p-8">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#1f1f23] flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-[#9ca3af]" />
                </div>
                <h3 className="text-[#ffffff] text-xl font-semibold mb-2">
                  Aucune collaboration sélectionnée
                </h3>
                <p className="text-[#9ca3af] text-sm mb-6">
                  Sélectionnez une collaboration dans la liste pour afficher les messages,
                  suivre la progression et gérer les étapes.
                </p>
                <div className="text-[#6B7280] text-xs space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle size={16} />
                    <span>Suivez les étapes de collaboration</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp size={16} />
                    <span>Visualisez la progression automatique</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Send size={16} />
                    <span>Échangez des messages en temps réel</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengerModal;