// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page copy.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid3X3, List, Edit, Trash2, Eye, MapPin, Calendar, Users, DollarSign, Clock, User, Music, Building, X, Check, Mail, MoreVertical, Send } from "lucide-react";
import { Event, InsertEvent, Artist, Invitation, User as UserType } from "@shared/schema";
import { mockEvents, mockUsers, mockArtists, mockClubs, mockInvitations, mockEventParticipants } from "@/data/club-events-data";
import AlertModal from "@/components/AlertModal";
// Types pour la gestion des artistes
interface ArtistWithInvitation extends Artist {
  invitationStatus?: string;
  invitationId?: number;
  invitationProgress?: number;
}

// Types pour la gestion des participants
interface UserWithParticipation extends UserType {
  participationStatus?: string;
  joinedAt?: Date;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOrganizerType, setSelectedOrganizerType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<InsertEvent & { createdBy?: number }>>({
    title: "",
    description: "",
    date: new Date(),
    startTime: "20:00",
    endTime: "23:00",
    location: "",
    city: "",
    country: "France",
    venueName: "",
    category: "",
    price: "0",
    capacity: 100,
    coverImage: "",
    status: "planning",
    mood: "energetic",
    reserveTables: false,
    organizerType: "user",
    organizerId: 1
  });

  // États pour la gestion des artistes
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [artists, setArtists] = useState<ArtistWithInvitation[]>(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState<ArtistWithInvitation[]>(mockArtists);
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [selectedInvitationStatus, setSelectedInvitationStatus] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // États pour la gestion des participants
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<Event | null>(null);
  const [users, setUsers] = useState<UserWithParticipation[]>(mockUsers);
  const [filteredParticipants, setFilteredParticipants] = useState<UserWithParticipation[]>(mockUsers);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // États pour le modal d'invitation (artiste)
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<ArtistWithInvitation | null>(null);
  const [invitationData, setInvitationData] = useState({
    message: "",
    expectedAttendees: 0,
    fee: "",
    conditions: ""
  });

  // États pour le modal d'invitation (participant)
  const [isParticipantInvitationModalOpen, setIsParticipantInvitationModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<UserWithParticipation | null>(null);
  const [participantInvitationData, setParticipantInvitationData] = useState({
    message: "",
    plusOne: false
  });

  // États pour AlertModal
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    type: "info" as const,
    onConfirm: () => { },
    confirmLabel: "OK",
    cancelLabel: "Fermer"
  });

  const categories = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];
  const organizerTypes = ["all", "user", "artist", "club"];
  const invitationStatuses = ["all", "pending", "confirmed", "negotiation", "preparation", "completed", "declined", "cancelled"];
  const genres = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];
  const roles = ["all", "user", "artist", "club"];
  const participationStatuses = ["all", "pending", "confirmed", "cancel"];

  // Charger l'utilisateur connecté
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      setCurrentUser(JSON.parse(authUser));
      console.log(authUser);
    }
  }, []);

  // Fonction pour afficher un modal de confirmation ou d'info
  const showAlertModal = (
    title: string,
    description: string,
    onConfirm: () => void,
    type: "info" | "success" | "warning" | "error" | "danger" = "info",
    confirmLabel: string = "OK",
    cancelLabel: string = "Fermer"
  ) => {
    setAlertConfig({ title, description, type, onConfirm, confirmLabel, cancelLabel });
    setShowAlert(true);
  };

  // Récupérer les informations du créateur
  const getCreatorInfo = (event: Event) => {
    const user = mockUsers.find(u => u.id === event.createdBy);
    if (!user) return null;

    if (event.organizerType === "artist") {
      const artist = mockArtists.find(a => a.userId === event.createdBy);
      return {
        name: artist?.displayName || `${user.firstName} ${user.lastName}`,
        type: "artist",
        image: user.profileImage,
        role: "Artiste"
      };
    } else if (event.organizerType === "club") {
      const club = mockClubs.find(c => c.userId === event.createdBy);
      return {
        name: club?.name || `${user.firstName} ${user.lastName}`,
        type: "club",
        image: user.profileImage,
        role: "Club"
      };
    } else {
      return {
        name: `${user.firstName} ${user.lastName}`,
        type: "user",
        image: user.profileImage,
        role: "Utilisateur"
      };
    }
  };

  // Récupérer les artistes invités pour un événement
  const getEventArtists = (eventId: number) => {
    const invitations = mockInvitations.filter(inv => inv.eventId === eventId);
    return invitations.map(invitation => {
      const artist = mockArtists.find(a => a.userId === invitation.userId);
      return {
        ...artist,
        invitationStatus: invitation.status,
        invitationId: invitation.id,
        invitationProgress: invitation.progress
      } as ArtistWithInvitation;
    }).filter(Boolean);
  };

  // Récupérer les participants pour un événement
  const getEventParticipants = (eventId: number) => {
    const participants = mockEventParticipants.filter(p => p.eventId === eventId);
    return participants.map(participant => {
      const user = mockUsers.find(u => u.id === participant.userId);
      return {
        ...user,
        participationStatus: participant.status,
        joinedAt: participant.joinedAt
      } as UserWithParticipation;
    }).filter(Boolean);
  };

  // Filtrer les artistes avec leur statut d'invitation
  useEffect(() => {
    let filtered = artists.map(artist => {
      const invitation = mockInvitations.find(
        inv => inv.userId === artist.userId && selectedEvent && inv.eventId === selectedEvent.id
      );
      return {
        ...artist,
        invitationStatus: invitation?.status,
        invitationId: invitation?.id,
        invitationProgress: invitation?.progress
      };
    });

    if (artistSearchTerm) {
      filtered = filtered.filter(artist =>
        artist.displayName.toLowerCase().includes(artistSearchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(artistSearchTerm.toLowerCase()) ||
        artist.bio.toLowerCase().includes(artistSearchTerm.toLowerCase())
      );
    }

    if (selectedInvitationStatus !== "all") {
      filtered = filtered.filter(artist => artist.invitationStatus === selectedInvitationStatus);
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter(artist => artist.genre.includes(selectedGenre));
    }

    setFilteredArtists(filtered);
  }, [artists, artistSearchTerm, selectedInvitationStatus, selectedGenre, selectedEvent]);

  // Filtrer les participants avec leur statut de participation
  useEffect(() => {
    let filtered = users.map(user => {
      const participant = mockEventParticipants.find(
        p => p.userId === user.id && selectedEventForParticipants && p.eventId === selectedEventForParticipants.id
      );
      return {
        ...user,
        participationStatus: participant?.status,
        joinedAt: participant?.joinedAt
      };
    });

    if (participantSearchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(participantSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(participantSearchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(participantSearchTerm.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedEventForParticipants) {
      // Prioriser les participants de l'événement sélectionné
      filtered = filtered.filter(user => user.participationStatus || true); // Show all, but mark status
    }

    setFilteredParticipants(filtered);
  }, [users, participantSearchTerm, selectedRole, selectedEventForParticipants]);

  // Filtrage des événements
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venueName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (selectedOrganizerType !== "all") {
      if (selectedOrganizerType === "my") {
        // Filtrer pour n'afficher que les événements de l'utilisateur connecté
        filtered = filtered.filter(event => event.createdBy === currentUser?.id);
      } else {
        filtered = filtered.filter(event => event.organizerType === selectedOrganizerType);
      }
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedOrganizerType]);

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: new Date(),
      startTime: "20:00",
      endTime: "23:00",
      location: "",
      city: "",
      country: "France",
      venueName: "",
      category: "",
      price: "0",
      capacity: 100,
      coverImage: "",
      status: "planning",
      mood: "energetic",
      reserveTables: false,
      organizerType: "user",
      organizerId: currentUser?.id || 1, // Utiliser l'ID de l'utilisateur connecté
      createdBy: currentUser?.id || 1 // Ajouter createdBy avec l'ID de l'utilisateur connecté
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      city: event.city,
      country: event.country,
      venueName: event.venueName,
      category: event.category,
      price: event.price,
      capacity: event.capacity,
      coverImage: event.coverImage || "",
      status: event.status,
      mood: event.mood || "energetic",
      reserveTables: event.reserveTables || false,
      organizerType: event.organizerType,
      organizerId: currentUser?.id || event.organizerId, // Utiliser l'ID de l'utilisateur connecté
      createdBy: currentUser?.id || event.createdBy // Mettre à jour avec l'utilisateur connecté
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    showAlertModal(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.",
      () => {
        setEvents(events.filter(event => event.id !== id));
        setShowAlert(false);
        showAlertModal(
          "Événement supprimé",
          "L'événement a été supprimé avec succès.",
          () => setShowAlert(false),
          "success",
          "OK"
        );
      },
      "danger",
      "Supprimer",
      "Annuler"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // Mise à jour
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? {
            ...event,
            ...formData,
            id: editingEvent.id,
            createdBy: currentUser?.id || event.createdBy // Garder l'utilisateur connecté
          }
          : event
      ));
    } else {
      // Création
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id)) + 1,
        createdBy: currentUser?.id || 1, // Utiliser l'ID de l'utilisateur connecté
        participantCount: 0,
        popularity: 0,
        isApproved: true,
        createdAt: new Date(),
        ...formData as Omit<InsertEvent, 'createdBy'>
      } as Event;

      setEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Gestion des artistes
  const handleManageArtists = (event: Event) => {
    setSelectedEvent(event);
    setIsArtistModalOpen(true);
  };

  // Gestion des participants
  const handleManageParticipants = (event: Event) => {
    setSelectedEventForParticipants(event);
    setIsParticipantModalOpen(true);
  };

  const handleOpenInvitationModal = (artist: ArtistWithInvitation) => {
    setSelectedArtist(artist);
    setInvitationData({
      message: `Bonjour ${artist.displayName},\n\nJe vous invite à participer à notre événement "${selectedEvent?.title}" prévu le ${selectedEvent ? formatDate(selectedEvent.date) : ''}.\n\nAu plaisir de collaborer avec vous !`,
      expectedAttendees: 0,
      fee: artist.rate,
      conditions: ""
    });
    setIsInvitationModalOpen(true);
  };

  // Ouverture modal invitation participant
  const handleOpenParticipantInvitationModal = (user: UserWithParticipation) => {
    setSelectedParticipant(user);
    setParticipantInvitationData({
      message: `Bonjour ${user.firstName} ${user.lastName},\n\nJe vous invite à participer à notre événement "${selectedEventForParticipants?.title}" prévu le ${selectedEventForParticipants ? formatDate(selectedEventForParticipants.date) : ''}.\n\nRejoignez-nous !`,
      plusOne: false
    });
    setIsParticipantInvitationModalOpen(true);
  };

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedArtist) return;

    // Simuler l'envoi d'une invitation
    const newInvitation: Invitation = {
      id: Math.max(...mockInvitations.map(i => i.id)) + 1,
      eventId: selectedEvent.id,
      userId: selectedArtist.userId,
      invitedById: 1, // ID de l'utilisateur connecté
      status: "pending",
      progress: 0,
      invitedAt: new Date(),
      expectedAttendees: invitationData.expectedAttendees,
      genre: selectedArtist.genre.split(", ")[0],
      description: invitationData.message,
      createdAt: new Date()
    };

    // Mettre à jour l'état local pour refléter le changement
    const updatedArtists = artists.map(artist =>
      artist.id === selectedArtist.id
        ? {
          ...artist,
          invitationStatus: "pending",
          invitationId: newInvitation.id,
          invitationProgress: 0
        }
        : artist
    );

    setArtists(updatedArtists);

    // Fermer les modals
    setIsInvitationModalOpen(false);
    setSelectedArtist(null);

    // Afficher le modal de succès
    showAlertModal(
      "Invitation envoyée",
      `L'invitation a été envoyée à ${selectedArtist.displayName} !`,
      () => setShowAlert(false),
      "success",
      "OK"
    );
  };

  // Envoi invitation participant
  const handleSendParticipantInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForParticipants || !selectedParticipant) return;

    // Simuler l'ajout d'un participant en pending
    const newParticipant = {
      eventId: selectedEventForParticipants.id,
      userId: selectedParticipant.id,
      status: "pending",
      joinedAt: new Date()
    };

    // Mettre à jour l'état local
    const updatedUsers = users.map(user =>
      user.id === selectedParticipant.id
        ? {
          ...user,
          participationStatus: "pending",
          joinedAt: newParticipant.joinedAt
        }
        : user
    );

    setUsers(updatedUsers);

    // Fermer les modals
    setIsParticipantInvitationModalOpen(false);
    setSelectedParticipant(null);

    // Afficher le modal de succès
    showAlertModal(
      "Invitation envoyée",
      `L'invitation a été envoyée à ${selectedParticipant.firstName} ${selectedParticipant.lastName} !`,
      () => setShowAlert(false),
      "success",
      "OK"
    );
  };

  const handleRemoveArtist = (artist: ArtistWithInvitation) => {
    if (!selectedEvent || !artist.invitationId) return;

    showAlertModal(
      "Retirer l'artiste",
      `Êtes-vous sûr de vouloir retirer ${artist.displayName} de l'événement ?`,
      () => {
        // Simuler la suppression de l'invitation
        const updatedArtists = artists.map(a =>
          a.id === artist.id
            ? { ...a, invitationStatus: undefined, invitationId: undefined, invitationProgress: undefined }
            : a
        );

        setArtists(updatedArtists);
        setShowAlert(false);

        // Afficher le modal de succès
        showAlertModal(
          "Artiste retiré",
          `${artist.displayName} a été retiré de l'événement.`,
          () => setShowAlert(false),
          "success",
          "OK"
        );
      },
      "warning",
      "Retirer",
      "Annuler"
    );
  };

  // Retirer participant
  const handleRemoveParticipant = (user: UserWithParticipation) => {
    if (!selectedEventForParticipants || !user.participationStatus) return;

    showAlertModal(
      "Retirer le participant",
      `Êtes-vous sûr de vouloir retirer ${user.firstName} ${user.lastName} de l'événement ?`,
      () => {
        // Simuler la suppression
        const updatedUsers = users.map(u =>
          u.id === user.id
            ? { ...u, participationStatus: undefined, joinedAt: undefined }
            : u
        );

        setUsers(updatedUsers);
        setShowAlert(false);

        // Afficher le modal de succès
        showAlertModal(
          "Participant retiré",
          `${user.firstName} ${user.lastName} a été retiré de l'événement.`,
          () => setShowAlert(false),
          "success",
          "OK"
        );
      },
      "warning",
      "Retirer",
      "Annuler"
    );
  };

  const handleUpdateInvitationStatus = (artist: ArtistWithInvitation, newStatus: string) => {
    if (!artist.invitationId) return;

    // Simuler la mise à jour du statut
    const updatedArtists = artists.map(a =>
      a.id === artist.id
        ? {
          ...a,
          invitationStatus: newStatus,
          invitationProgress: newStatus === "confirmed" ? 100 : a.invitationProgress
        }
        : a
    );

    setArtists(updatedArtists);

    // Afficher le modal de succès
    showAlertModal(
      "Statut mis à jour",
      `Le statut de ${artist.displayName} a été mis à jour : ${getInvitationStatusText(newStatus)}.`,
      () => setShowAlert(false),
      "success",
      "OK"
    );
  };

  // Mise à jour statut participant
  const handleUpdateParticipantStatus = (user: UserWithParticipation, newStatus: string) => {
    if (!user.participationStatus) return;

    // Simuler la mise à jour
    const updatedUsers = users.map(u =>
      u.id === user.id
        ? {
          ...u,
          participationStatus: newStatus
        }
        : u
    );

    setUsers(updatedUsers);

    // Afficher le modal de succès
    showAlertModal(
      "Statut mis à jour",
      `Le statut de ${user.firstName} ${user.lastName} a été mis à jour : ${getParticipationStatusText(newStatus)}.`,
      () => setShowAlert(false),
      "success",
      "OK"
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getOrganizerTypeIcon = (type: string) => {
    switch (type) {
      case "artist":
        return <Music className="w-3 h-3" />;
      case "club":
        return <Building className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getOrganizerTypeColor = (type: string) => {
    switch (type) {
      case "artist":
        return "text-purple-400";
      case "club":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getInvitationStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "negotiation":
        return "bg-blue-500/20 text-blue-400";
      case "preparation":
        return "bg-purple-500/20 text-purple-400";
      case "completed":
        return "bg-gray-500/20 text-gray-400";
      case "declined":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getParticipationStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancel":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getInvitationStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "negotiation":
        return "Négociation";
      case "preparation":
        return "Préparation";
      case "completed":
        return "Terminé";
      case "declined":
        return "Refusé";
      case "cancelled":
        return "Annulé";
      default:
        return "Inconnu";
    }
  };

  const getParticipationStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancel":
        return "Annulé";
      default:
        return "Inconnu";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "artist":
        return <Music className="w-3 h-3" />;
      case "club":
        return <Building className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "artist":
        return "text-purple-400";
      case "club":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Événements</h1>
              <p className="text-gray-400">Découvrez et gérez vos événements</p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Barre de recherche */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher des événements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Bouton créer */}
              <button
                onClick={handleCreate}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Créer</span>
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex items-end sm:items-center justify-between mt-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Filtre par type d'organisateur */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gray-400 text-sm whitespace-nowrap">Organisateur:</span>
                {organizerTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedOrganizerType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${selectedOrganizerType === type
                      ? "bg-pink-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    {type !== "all" && getOrganizerTypeIcon(type)}
                    <span>
                      {type === "all" ? "Tous" :
                        type === "artist" ? "Artistes" :
                          type === "club" ? "Clubs" : "Utilisateurs"}
                    </span>
                  </button>
                ))}

                {/* Filtre Mes événements */}
                <button
                  onClick={() => {
                    if (selectedOrganizerType === "my") {
                      setSelectedOrganizerType("all");
                    } else {
                      setSelectedOrganizerType("my");
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${selectedOrganizerType === "my"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  <User className="w-3 h-3" />
                  <span>Mes événements</span>
                </button>
              </div>

              {/* Filtre par catégorie */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gray-400 text-sm whitespace-nowrap">Catégorie:</span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === "all"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Tous
                </button>
                {categories.filter(cat => cat !== "all").map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category
                      ? "bg-pink-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode d'affichage */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-gray-800 text-pink-500" : "text-gray-400 hover:text-white"
                  }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-gray-800 text-pink-500" : "text-gray-400 hover:text-white"
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Aucun événement trouvé</div>
            <button
              onClick={handleCreate}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer le premier événement
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // Vue Grid (style TikTok)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map(event => {
              const creatorInfo = getCreatorInfo(event);
              const eventArtists = getEventArtists(event.id);
              const eventParticipants = getEventParticipants(event.id);

              return (
                <div key={event.id} className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={event.coverImage || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&h=300&fit=crop"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Badge type d'organisateur */}
                    {creatorInfo && (
                      <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs ${getOrganizerTypeColor(event.organizerType)}`}>
                        {getOrganizerTypeIcon(event.organizerType)}
                        <span>{creatorInfo.role}</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-1">{event.title}</h3>
                      <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{event.venueName}</span>
                      </div>
                    </div>
                    {currentUser && event.createdBy === currentUser.id && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => handleManageArtists(event)}
                          className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors"
                          title="Gérer les artistes"
                        >
                          <Music className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleManageParticipants(event)}
                          className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors"
                          title="Gérer les participants"
                        >
                          <Users className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="bg-black/50 hover:bg-red-500/70 text-white p-1.5 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    {/* Informations du créateur */}
                    {creatorInfo && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={creatorInfo.image}
                          alt={creatorInfo.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-400 line-clamp-1">
                          Par {creatorInfo.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.startTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.participantCount}/{event.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{event.price}€</span>
                      </div>
                    </div>

                    {/* Artistes invités */}
                    {eventArtists.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                          <Music className="w-3 h-3" />
                          <span>Artistes ({eventArtists.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {eventArtists.slice(0, 3).map(artist => (
                            <span
                              key={artist.id}
                              className={`px-2 py-1 rounded-full text-xs ${getInvitationStatusColor(artist.invitationStatus || 'pending')}`}
                            >
                              {artist.displayName}
                            </span>
                          ))}
                          {eventArtists.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                              +{eventArtists.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Participants (similaire aux artistes) */}
                    {eventParticipants.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                          <Users className="w-3 h-3" />
                          <span>Participants ({eventParticipants.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {eventParticipants.slice(0, 3).map(user => (
                            <span
                              key={user.id}
                              className={`px-2 py-1 rounded-full text-xs ${getParticipationStatusColor(user.participationStatus || 'pending')}`}
                            >
                              {user.firstName} {user.lastName}
                            </span>
                          ))}
                          {eventParticipants.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                              +{eventParticipants.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${event.status === "upcoming" ? "bg-green-500/20 text-green-400" :
                        event.status === "planning" ? "bg-blue-500/20 text-blue-400" :
                          event.status === "past" ? "bg-gray-500/20 text-gray-400" :
                            "bg-red-500/20 text-red-400"
                        }`}>
                        {event.status}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{event.mood}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vue Liste
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const creatorInfo = getCreatorInfo(event);
              const eventArtists = getEventArtists(event.id);
              const eventParticipants = getEventParticipants(event.id);

              return (
                <div key={event.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={event.coverImage || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=150&fit=crop"}
                      alt={event.title}
                      className="w-full sm:w-48 h-32 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                            {creatorInfo && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 text-xs ${getOrganizerTypeColor(event.organizerType)}`}>
                                {getOrganizerTypeIcon(event.organizerType)}
                                <span>{creatorInfo.role}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{event.description}</p>

                          {/* Informations du créateur */}
                          {creatorInfo && (
                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src={creatorInfo.image}
                                alt={creatorInfo.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs text-gray-400">
                                Créé par {creatorInfo.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {currentUser && event.createdBy === currentUser.id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleManageArtists(event)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                              title="Gérer les artistes"
                            >
                              <Music className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleManageParticipants(event)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                              title="Gérer les participants"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(event)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Artistes invités */}
                      {eventArtists.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Music className="w-4 h-4" />
                            <span>Artistes invités ({eventArtists.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {eventArtists.map(artist => (
                              <div
                                key={artist.id}
                                className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1"
                              >
                                <span className="text-xs text-white">{artist.displayName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getInvitationStatusColor(artist.invitationStatus || 'pending')}`}>
                                  {getInvitationStatusText(artist.invitationStatus || 'pending')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Participants (similaire) */}
                      {eventParticipants.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Users className="w-4 h-4" />
                            <span>Participants ({eventParticipants.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {eventParticipants.map(user => (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1"
                              >
                                <span className="text-xs text-white">{user.firstName} {user.lastName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getParticipationStatusColor(user.participationStatus || 'pending')}`}>
                                  {getParticipationStatusText(user.participationStatus || 'pending')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{event.venueName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{event.price}€</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className={`px-2 py-1 rounded-full ${event.status === "upcoming" ? "bg-green-500/20 text-green-400" :
                          event.status === "planning" ? "bg-blue-500/20 text-blue-400" :
                            event.status === "past" ? "bg-gray-500/20 text-gray-400" :
                              "bg-red-500/20 text-red-400"
                          }`}>
                          {event.status}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 capitalize">{event.mood}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{event.category}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{event.participantCount}/{event.capacity} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingEvent ? "Modifier l'événement" : "Créer un événement"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.filter(cat => cat !== "all").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Heure début *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Heure fin *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Lieu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nom de la salle *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venueName}
                      onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Capacité *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
                {/* Champ caché pour l'organisateur (affichage seulement) */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Organisateur:</span>
                    <span className="text-pink-400">
                      {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Non connecté"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Cet événement sera associé à votre compte
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image de couverture (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="planning">En planification</option>
                      <option value="upcoming">À venir</option>
                      <option value="past">Passé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ambiance
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="energetic">Énergique</option>
                      <option value="chill">Chill</option>
                      <option value="romantic">Romantique</option>
                      <option value="dark">Sombre</option>
                      <option value="festive">Festif</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reserveTables"
                    checked={formData.reserveTables}
                    onChange={(e) => setFormData({ ...formData, reserveTables: e.target.checked })}
                    className="rounded bg-gray-800 border-gray-700 text-pink-500 focus:ring-pink-500"
                  />
                  <label htmlFor="reserveTables" className="text-sm text-gray-300">
                    Réservation de tables disponible
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    {editingEvent ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des artistes */}
      {isArtistModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Gérer les artistes</h2>
                  <p className="text-gray-400">Événement: {selectedEvent.title}</p>
                </div>
                <button
                  onClick={() => setIsArtistModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filtres pour les artistes */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher des artistes..."
                    value={artistSearchTerm}
                    onChange={(e) => setArtistSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <select
                  value={selectedInvitationStatus}
                  onChange={(e) => setSelectedInvitationStatus(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  {invitationStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "Tous les statuts" : getInvitationStatusText(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === "all" ? "Tous les genres" : genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Liste des artistes (style TikTok) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map(artist => (
                  <div
                    key={artist.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={mockUsers.find(u => u.id === artist.userId)?.profileImage || "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=300&fit=crop"}
                        alt={artist.displayName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Statut d'invitation */}
                      {artist.invitationStatus && (
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs ${getInvitationStatusColor(artist.invitationStatus)}`}>
                          {getInvitationStatusText(artist.invitationStatus)}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">{artist.displayName}</h3>
                        <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                          <Music className="w-3 h-3" />
                          <span className="line-clamp-1">{artist.genre}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">{artist.bio}</p>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{artist.rate}€</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{artist.bookings} réservations</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {artist.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {artist.tags.length > 3 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                            +{artist.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!artist.invitationStatus ? (
                          <button
                            onClick={() => handleOpenInvitationModal(artist)}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            Inviter
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRemoveArtist(artist)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Retirer
                            </button>
                            <button
                              onClick={() => handleUpdateInvitationStatus(artist, "confirmed")}
                              className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Confirmer
                            </button>
                          </>
                        )}
                      </div>

                      {/* Barre de progression pour les invitations en cours */}
                      {artist.invitationProgress !== undefined && artist.invitationProgress > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progression</span>
                            <span>{artist.invitationProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-pink-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${artist.invitationProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredArtists.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">Aucun artiste trouvé</div>
                  <p className="text-gray-500 text-sm mt-2">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des participants (similaire aux artistes) */}
      {isParticipantModalOpen && selectedEventForParticipants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Gérer les participants</h2>
                  <p className="text-gray-400">Événement: {selectedEventForParticipants.title}</p>
                </div>
                <button
                  onClick={() => setIsParticipantModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filtres pour les participants */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher des participants..."
                    value={participantSearchTerm}
                    onChange={(e) => setParticipantSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role === "all" ? "Tous les rôles" :
                        role === "artist" ? "Artistes" :
                          role === "club" ? "Clubs" : "Utilisateurs"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Liste des participants (style TikTok) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParticipants.map(user => (
                  <div
                    key={user.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={user.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=300&fit=crop"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Statut de participation */}
                      {user.participationStatus && (
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs ${getParticipationStatusColor(user.participationStatus)}`}>
                          {getParticipationStatusText(user.participationStatus)}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1">{user.firstName} {user.lastName}</h3>
                        <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                          {getRoleIcon(user.role)}
                          <span className="line-clamp-1 capitalize">{user.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">{user.email}</p>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{user.city}, {user.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{user.walletBalance}€</span>
                        </div>
                      </div>

                      {/* Rôle badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs mb-3 ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {(!user.participationStatus || user.participationStatus === "cancel") ? (
                          <button
                            onClick={() => handleOpenParticipantInvitationModal(user)}
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            Inviter
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRemoveParticipant(user)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Retirer
                            </button>
                            <button
                              onClick={() => handleUpdateParticipantStatus(user, "confirmed")}
                              className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Confirmer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredParticipants.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">Aucun participant trouvé</div>
                  <p className="text-gray-500 text-sm mt-2">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'invitation d'artiste */}
      {isInvitationModalOpen && selectedArtist && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Inviter un artiste</h2>
                  <p className="text-gray-400">
                    {selectedArtist.displayName} - {selectedEvent.title}
                  </p>
                </div>
                <button
                  onClick={() => setIsInvitationModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendInvitation} className="space-y-4">
                {/* Informations de l'événement */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Détails de l'événement</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(selectedEvent.date)}
                    </div>
                    <div>
                      <span className="font-medium">Lieu:</span> {selectedEvent.venueName}
                    </div>
                    <div>
                      <span className="font-medium">Heure:</span> {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </div>
                    <div>
                      <span className="font-medium">Catégorie:</span> {selectedEvent.category}
                    </div>
                  </div>
                </div>

                {/* Message personnalisé */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message d'invitation *
                  </label>
                  <textarea
                    required
                    value={invitationData.message}
                    onChange={(e) => setInvitationData({ ...invitationData, message: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder="Rédigez votre message d'invitation..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Nombre d'attendees estimé */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Audience estimée
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={invitationData.expectedAttendees}
                      onChange={(e) => setInvitationData({ ...invitationData, expectedAttendees: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Cachet proposé */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cachet proposé (€)
                    </label>
                    <input
                      type="text"
                      value={invitationData.fee}
                      onChange={(e) => setInvitationData({ ...invitationData, fee: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Conditions spéciales */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Conditions particulières
                  </label>
                  <textarea
                    value={invitationData.conditions}
                    onChange={(e) => setInvitationData({ ...invitationData, conditions: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder="Conditions techniques, horaires de soundcheck, etc."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsInvitationModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer l'invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'invitation de participant (similaire) */}
      {isParticipantInvitationModalOpen && selectedParticipant && selectedEventForParticipants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Inviter un participant</h2>
                  <p className="text-gray-400">
                    {selectedParticipant.firstName} {selectedParticipant.lastName} - {selectedEventForParticipants.title}
                  </p>
                </div>
                <button
                  onClick={() => setIsParticipantInvitationModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendParticipantInvitation} className="space-y-4">
                {/* Informations de l'événement */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Détails de l'événement</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(selectedEventForParticipants.date)}
                    </div>
                    <div>
                      <span className="font-medium">Lieu:</span> {selectedEventForParticipants.venueName}
                    </div>
                    <div>
                      <span className="font-medium">Heure:</span> {formatTime(selectedEventForParticipants.startTime)} - {formatTime(selectedEventForParticipants.endTime)}
                    </div>
                    <div>
                      <span className="font-medium">Catégorie:</span> {selectedEventForParticipants.category}
                    </div>
                  </div>
                </div>

                {/* Message personnalisé */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message d'invitation *
                  </label>
                  <textarea
                    required
                    value={participantInvitationData.message}
                    onChange={(e) => setParticipantInvitationData({ ...participantInvitationData, message: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder="Rédigez votre message d'invitation..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="plusOne"
                    checked={participantInvitationData.plusOne}
                    onChange={(e) => setParticipantInvitationData({ ...participantInvitationData, plusOne: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="plusOne" className="text-sm text-gray-300">
                    Autoriser +1
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsParticipantInvitationModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer l'invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AlertModal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        confirmLabel={alertConfig.confirmLabel}
        cancelLabel={alertConfig.cancelLabel}
      />
    </div>
  );
};

export default EventsPage;