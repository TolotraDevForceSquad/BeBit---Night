// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid3X3, List, Edit, Trash2, MapPin, Calendar, Users, DollarSign, Clock, X, User, Upload, Link, Music, Building, UserCheck, Star, Mail } from "lucide-react";
import { Event, InsertEvent, User as UserType, Artist, Invitation, InsertInvitation } from "@shared/schema";
import { useEvents, createEvent, updateEvent, deleteEvent, uploadFile, getFileUrl, useUsers, useArtists, createInvitation, updateInvitation, useInvitations } from "@/services/servapi";
import AlertModal from "@/components/AlertModal";

const ClubEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<Partial<InsertEvent>>({
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
    organizerId: 0
  });

  // États pour l'upload d'image
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">("url");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

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

  // États pour le modal d'invitation d'artistes
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [selectedArtistGenre, setSelectedArtistGenre] = useState("all");
  const [minRate, setMinRate] = useState<number | "">("");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [invitationData, setInvitationData] = useState({
    expectedAttendees: 0,
    genre: "",
    description: ""
  });

  const categories = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];
  const artistGenres = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae", "R&B", "Metal", "Folk"];

  // Charger l'utilisateur connecté depuis localStorage
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);
        setCurrentUser(userData);
        console.log("Utilisateur connecté:", userData);
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
      }
    }
  }, []);

  // Charger les événements depuis l'API
  const { data: eventsData, loading, error, refetch } = useEvents();
  // Charger tous les utilisateurs pour récupérer les infos des organisateurs
  const { data: allUsers } = useUsers();
  // Charger tous les artistes
  const { data: allArtists } = useArtists();

  // Charger les invitations existantes
  const { data: existingInvitations, refetch: refetchInvitations } = useInvitations({
    eventId: selectedEvent?.id
  });

  // Recharger les invitations quand l'événement sélectionné change
  useEffect(() => {
    if (selectedEvent) {
      refetchInvitations();
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

//   useEffect(() => {
//   if (eventsData) {
//     if (currentUser) {
//       // Filtrer pour n'afficher que les événements de l'utilisateur connecté
//       const myEvents = eventsData.filter(event => event.createdBy === currentUser.id);
//       setEvents(myEvents);
//     } else {
//       setEvents([]);
//     }
//   }
// }, [eventsData, currentUser]);

  // Fonction pour récupérer les informations du créateur/organisateur
  const getCreatorInfo = (event: Event) => {
    if (!allUsers) return null;

    const user = allUsers.find(u => u.id === event.createdBy);
    if (!user) return null;

    if (event.organizerType === "artist") {
      return {
        name: `${user.firstName} ${user.lastName}`,
        type: "artist",
        image: user.profileImage,
        role: "Artiste"
      };
    } else if (event.organizerType === "club") {
      return {
        name: `${user.firstName} ${user.lastName}`,
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

  // Fonction pour récupérer les informations complètes d'un artiste (user + artist)
  const getArtistFullInfo = (artist: Artist) => {
    if (!allUsers) return null;
    const user = allUsers.find(u => u.id === artist.userId);
    return user ? { ...artist, user } : null;
  };


  // Fonction pour récupérer l'invitation d'un artiste
  const getArtistInvitation = (artist: Artist) => {
    if (!existingInvitations || !selectedEvent) return null;

    return existingInvitations.find(invitation =>
      invitation.userId === artist.userId &&
      invitation.eventId === selectedEvent.id
    );
  };

  // Fonction pour obtenir la couleur selon le statut de l'invitation
  const getInvitationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { border: "border-orange-500", bg: "bg-orange-500/10", text: "text-orange-400" };
      case "accepted":
        return { border: "border-green-500", bg: "bg-green-500/10", text: "text-green-400" };
      case "declined":
        return { border: "border-red-500", bg: "bg-red-500/10", text: "text-red-400" };
      case "confirmed":
        return { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-400" };
      case "cancelled":
        return { border: "border-gray-500", bg: "bg-gray-500/10", text: "text-gray-400" };
      case "rejected":
        return { border: "border-red-700", bg: "bg-red-700/10", text: "text-red-600" };
      case "negotiation":
        return { border: "border-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-400" };
      case "preparation":
        return { border: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-400" };
      case "completed":
        return { border: "border-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-400" };
      default:
        return { border: "border-gray-500", bg: "bg-gray-500/10", text: "text-gray-400" };
    }
  };

  // Fonction pour obtenir le texte du statut en français
  const getInvitationStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      "pending": "En attente",
      "accepted": "Acceptée",
      "declined": "Déclinée",
      "confirmed": "Confirmée",
      "cancelled": "Annulée",
      "rejected": "Rejetée",
      "negotiation": "En négociation",
      "preparation": "En préparation",
      "completed": "Terminée"
    };
    return statusTexts[status] || status;
  };

  // Filtrer les artistes
  const filteredArtists = allArtists?.filter(artist => {
    const fullInfo = getArtistFullInfo(artist);
    if (!fullInfo) return false;

    // Filtre par recherche
    if (artistSearchTerm && !fullInfo.user.firstName.toLowerCase().includes(artistSearchTerm.toLowerCase()) &&
      !fullInfo.user.lastName.toLowerCase().includes(artistSearchTerm.toLowerCase()) &&
      !artist.displayName.toLowerCase().includes(artistSearchTerm.toLowerCase()) &&
      !artist.genre.toLowerCase().includes(artistSearchTerm.toLowerCase())) {
      return false;
    }

    // Filtre par genre
    if (selectedArtistGenre !== "all" && artist.genre !== selectedArtistGenre) {
      return false;
    }

    // Filtre par taux minimum
    if (minRate !== "" && parseFloat(artist.rate as string) < minRate) {
      return false;
    }

    // Filtre par taux maximum
    if (maxRate !== "" && parseFloat(artist.rate as string) > maxRate) {
      return false;
    }

    return true;
  }) || [];

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

  // Icônes et couleurs pour les types d'organisateurs
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

  // Ouvrir le modal d'invitation d'artistes
  const openArtistModal = (event: Event) => {
    if (!currentUser) {
      showAlertModal(
        "Non connecté",
        "Vous devez être connecté pour inviter un artiste.",
        () => setShowAlert(false),
        "warning",
        "OK"
      );
      return;
    }
    setSelectedEvent(event);
    setSelectedArtist(null);
    setInvitationData({
      expectedAttendees: 0,
      genre: event.category || "",
      description: ""
    });
    setIsArtistModalOpen(true);
    // Recharger les invitations pour cet événement
    refetchInvitations();
  };

  // Fonction pour sélectionner un artiste et remplir les données d'invitation existante
  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);

    // Vérifier si une invitation existe déjà pour cet artiste
    const existingInvitation = getArtistInvitation(artist);

    if (existingInvitation) {
      // Remplir les champs avec les données de l'invitation existante
      setInvitationData({
        expectedAttendees: existingInvitation.expectedAttendees || 0,
        genre: existingInvitation.genre || "",
        description: existingInvitation.description || ""
      });
    } else {
      // Réinitialiser les champs si aucune invitation
      setInvitationData({
        expectedAttendees: 0,
        genre: selectedEvent?.category || "",
        description: ""
      });
    }
  };

  // Fonction pour envoyer une invitation à un artiste
  const sendInvitation = async () => {
    if (!currentUser || !selectedEvent || !selectedArtist) {
      showAlertModal(
        "Données manquantes",
        "Veuillez sélectionner un artiste et vérifier que vous êtes connecté.",
        () => setShowAlert(false),
        "warning",
        "OK"
      );
      return;
    }

    try {
      // Récupérer l'utilisateur associé à l'artiste
      const artistUser = allUsers?.find(user => user.id === selectedArtist.userId);
      if (!artistUser) {
        throw new Error("Utilisateur artiste non trouvé");
      }

      // Préparer les données d'invitation
      const invitationDataToSend: InsertInvitation = {
        eventId: selectedEvent.id,
        userId: artistUser.id, // L'ID de l'utilisateur artiste
        invitedById: currentUser.id, // L'ID de l'utilisateur qui envoie l'invitation
        status: "pending", // Statut initial
        progress: 0,
        expectedAttendees: invitationData.expectedAttendees,
        genre: invitationData.genre,
        description: invitationData.description
      };

      // Envoyer l'invitation
      await createInvitation(invitationDataToSend);

      // Rafraîchir immédiatement les invitations
      await refetchInvitations();

      // Afficher un message de succès
      showAlertModal(
        "Invitation envoyée",
        `L'invitation a été envoyée à ${selectedArtist.displayName} avec succès.`,
        () => {
          setShowAlert(false);
          // Ne pas fermer le modal pour voir la mise à jour
          // setIsArtistModalOpen(false);
          // setSelectedArtist(null);
          setInvitationData({
            expectedAttendees: 0,
            genre: "",
            description: ""
          });
        },
        "success",
        "OK"
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'invitation:", error);
      showAlertModal(
        "Erreur",
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'invitation.",
        () => setShowAlert(false),
        "error",
        "OK"
      );
    }
  };

  // Fonction pour annuler une invitation
  const cancelInvitation = async (invitationId: number) => {
    showAlertModal(
      "Annuler l'invitation",
      "Êtes-vous sûr de vouloir annuler cette invitation ?",
      async () => {
        try {
          await updateInvitation(invitationId, { status: "cancelled" });
          setShowAlert(false);
          // Rafraîchir les invitations immédiatement
          await refetchInvitations();
          showAlertModal(
            "Invitation annulée",
            "L'invitation a été annulée avec succès.",
            () => setShowAlert(false),
            "success",
            "OK"
          );
        } catch (error) {
          console.error("Erreur lors de l'annulation:", error);
          showAlertModal(
            "Erreur",
            "Une erreur est survenue lors de l'annulation de l'invitation.",
            () => setShowAlert(false),
            "error",
            "OK"
          );
        }
      },
      "danger",
      "Annuler",
      "Fermer"
    );
  };

  // Fonction pour restaurer une invitation annulée
  const restoreInvitation = async (invitationId: number) => {
    showAlertModal(
      "Restaurer l'invitation",
      "Voulez-vous restaurer cette invitation en statut 'En attente' ?",
      async () => {
        try {
          await updateInvitation(invitationId, { status: "pending" });
          setShowAlert(false);
          await refetchInvitations();
          showAlertModal(
            "Invitation restaurée",
            "L'invitation a été restaurée avec succès.",
            () => setShowAlert(false),
            "success",
            "OK"
          );
        } catch (error) {
          console.error("Erreur lors de la restauration:", error);
          showAlertModal(
            "Erreur",
            "Une erreur est survenue lors de la restauration de l'invitation.",
            () => setShowAlert(false),
            "error",
            "OK"
          );
        }
      },
      "info",
      "Restaurer",
      "Annuler"
    );
  };

  // Fonction pour modifier une invitation existante
  const updateExistingInvitation = async (invitationId: number) => {
    showAlertModal(
      "Modifier l'invitation",
      "Voulez-vous modifier les informations de cette invitation ?",
      async () => {
        try {
          await updateInvitation(invitationId, {
            expectedAttendees: invitationData.expectedAttendees,
            genre: invitationData.genre,
            description: invitationData.description,
            status: "pending" // Remettre en pending si modifiée
          });
          setShowAlert(false);
          await refetchInvitations();
          showAlertModal(
            "Invitation modifiée",
            "L'invitation a été modifiée avec succès.",
            () => setShowAlert(false),
            "success",
            "OK"
          );
        } catch (error) {
          console.error("Erreur lors de la modification:", error);
          showAlertModal(
            "Erreur",
            "Une erreur est survenue lors de la modification de l'invitation.",
            () => setShowAlert(false),
            "error",
            "OK"
          );
        }
      },
      "info",
      "Modifier",
      "Annuler"
    );
  };

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

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  // Gestion de la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        showAlertModal(
          "Type de fichier invalide",
          "Veuillez sélectionner un fichier image (JPG, PNG, GIF, etc.)",
          () => setShowAlert(false),
          "error",
          "OK"
        );
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlertModal(
          "Fichier trop volumineux",
          "La taille du fichier ne doit pas dépasser 5MB",
          () => setShowAlert(false),
          "error",
          "OK"
        );
        return;
      }

      setSelectedFile(file);

      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de l'image
  const handleImageUpload = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error("Aucun fichier sélectionné");
    }

    setUploadingImage(true);
    try {
      const response = await uploadFile(selectedFile);
      return getFileUrl(response.file.filename);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      throw new Error("Échec de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = () => {
    if (!currentUser) {
      showAlertModal(
        "Non connecté",
        "Vous devez être connecté pour créer un événement.",
        () => setShowAlert(false),
        "warning",
        "OK"
      );
      return;
    }

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
      organizerId: currentUser.id
    });
    setImageUploadMethod("url");
    setSelectedFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    if (!currentUser) {
      showAlertModal(
        "Non connecté",
        "Vous devez être connecté pour modifier un événement.",
        () => setShowAlert(false),
        "warning",
        "OK"
      );
      return;
    }

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
      organizerId: currentUser.id
    });

    // Déterminer la méthode d'upload basée sur l'image existante
    if (event.coverImage && event.coverImage.startsWith('/api/uploads/')) {
      setImageUploadMethod("upload");
      setImagePreview(event.coverImage);
    } else {
      setImageUploadMethod("url");
      setImagePreview(event.coverImage || "");
    }

    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!currentUser) {
      showAlertModal(
        "Non connecté",
        "Vous devez être connecté pour supprimer un événement.",
        () => setShowAlert(false),
        "warning",
        "OK"
      );
      return;
    }

    showAlertModal(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.",
      async () => {
        try {
          await deleteEvent(id);
          setShowAlert(false);
          refetch(); // Recharger les données
          showAlertModal(
            "Événement supprimé",
            "L'événement a été supprimé avec succès.",
            () => setShowAlert(false),
            "success",
            "OK"
          );
        } catch (error) {
          showAlertModal(
            "Erreur",
            "Une erreur est survenue lors de la suppression de l'événement.",
            () => setShowAlert(false),
            "error",
            "OK"
          );
        }
      },
      "danger",
      "Supprimer",
      "Annuler"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showAlertModal(
        "Non connecté",
        "Vous devez être connecté pour créer ou modifier un événement.",
        () => setShowAlert(false),
        "error",
        "OK"
      );
      return;
    }

    try {
      let coverImageUrl = formData.coverImage;

      // Si upload de fichier, uploader l'image d'abord
      if (imageUploadMethod === "upload" && selectedFile) {
        coverImageUrl = await handleImageUpload();
      }

      const eventData = {
        ...formData,
        coverImage: coverImageUrl,
        organizerId: currentUser.id,
        createdBy: currentUser.id
      };

      if (editingEvent) {
        // Mise à jour
        await updateEvent(editingEvent.id, eventData);
        showAlertModal(
          "Événement modifié",
          "L'événement a été modifié avec succès.",
          () => setShowAlert(false),
          "success",
          "OK"
        );
      } else {
        // Création
        await createEvent(eventData as InsertEvent);
        showAlertModal(
          "Événement créé",
          "L'événement a été créé avec succès.",
          () => setShowAlert(false),
          "success",
          "OK"
        );
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedFile(null);
      setImagePreview("");
      refetch(); // Recharger les données
    } catch (error) {
      console.error("Erreur:", error);
      showAlertModal(
        "Erreur",
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement de l'événement.",
        () => setShowAlert(false),
        "error",
        "OK"
      );
    }
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

  // Vérifier si l'utilisateur peut modifier/supprimer un événement
  const canModifyEvent = (event: Event) => {
    return currentUser && (event.createdBy === currentUser.id || currentUser.role === "admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Erreur lors du chargement des événements</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Événements</h1>
              <p className="text-gray-400">Découvrez et gérez vos événements</p>
              {currentUser && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Connecté en tant que: {currentUser.firstName} {currentUser.lastName}</span>
                </div>
              )}
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
                disabled={!currentUser}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Créer</span>
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex items-end sm:items-center justify-between mt-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
        {!currentUser && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <User className="w-5 h-5" />
              <span className="font-semibold">Non connecté</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">
              Connectez-vous pour créer et gérer vos événements.
            </p>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Aucun événement trouvé</div>
            <button
              onClick={handleCreate}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!currentUser}
            >
              <Plus className="w-4 h-4" />
              Créer le premier événement
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // Vue Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map(event => {
              const creatorInfo = getCreatorInfo(event);

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

                    {canModifyEvent(event) && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => openArtistModal(event)}
                          className="bg-black/50 hover:bg-purple-500/70 text-purple-400 p-1.5 rounded transition-colors"
                          title="Inviter un artiste"
                        >
                          <Music className="w-3 h-3" />
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
                          src={creatorInfo.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
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
                                src={creatorInfo.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                                alt={creatorInfo.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs text-gray-400">
                                Créé par {creatorInfo.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {canModifyEvent(event) && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openArtistModal(event)}
                              className="bg-gray-700 hover:bg-purple-600 text-purple-400 p-2 rounded transition-colors"
                              title="Inviter un artiste"
                            >
                              <Music className="w-4 h-4" />
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

              {/* Informations de l'organisateur */}
              {/* Sélection du type d'organisateur */}
              {currentUser && (
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Organisateur de l'événement</h3>

                  <div className="space-y-3">
                    {/* Option Utilisateur */}
                    <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-700 hover:border-pink-500 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="organizerType"
                        value="user"
                        checked={formData.organizerType === "user"}
                        onChange={(e) => setFormData({
                          ...formData,
                          organizerType: e.target.value as any,
                          organizerId: currentUser.id
                        })}
                        className="mt-1 text-pink-500 focus:ring-pink-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-500" />
                          <span className="text-white font-medium">
                            {currentUser.firstName} {currentUser.lastName}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <span className="capitalize">Utilisateur</span>
                          {currentUser.city && (
                            <span> • {currentUser.city}{currentUser.country && `, ${currentUser.country}`}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Créer l'événement en votre nom personnel
                        </p>
                      </div>
                    </label>

                    {/* Option Club (si l'utilisateur a un club) */}
                    {(currentUser.role === "club" || currentUser.role === "admin") && (
                      <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-700 hover:border-blue-500 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="organizerType"
                          value="club"
                          checked={formData.organizerType === "club"}
                          onChange={(e) => setFormData({
                            ...formData,
                            organizerType: e.target.value as any,
                            organizerId: currentUser.id
                          })}
                          className="mt-1 text-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-blue-500" />
                            <span className="text-white font-medium">
                              {currentUser.clubName || "Mon Club"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span>Club</span>
                            {currentUser.city && (
                              <span> • {currentUser.city}{currentUser.country && `, ${currentUser.country}`}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Créer l'événement au nom de votre club
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Option Artiste (si l'utilisateur a un profil artiste) */}
                    {(currentUser.role === "artist" || currentUser.role === "admin") && (
                      <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-700 hover:border-purple-500 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="organizerType"
                          value="artist"
                          checked={formData.organizerType === "artist"}
                          onChange={(e) => setFormData({
                            ...formData,
                            organizerType: e.target.value as any,
                            organizerId: currentUser.id
                          })}
                          className="mt-1 text-purple-500 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-purple-500" />
                            <span className="text-white font-medium">
                              {currentUser.artistName || `${currentUser.firstName} ${currentUser.lastName}`}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span>Artiste</span>
                            {currentUser.genre && (
                              <span> • {currentUser.genre}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Créer l'événement en tant qu'artiste
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    L'événement sera associé au profil sélectionné et apparaîtra comme organisé par celui-ci.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (le reste du formulaire existant reste inchangé) */}
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

                {/* Section Image de couverture */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Image de couverture
                  </label>

                  {/* Sélection de la méthode */}
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("url")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${imageUploadMethod === "url"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <Link className="w-4 h-4" />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod("upload")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${imageUploadMethod === "upload"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>

                  {imageUploadMethod === "url" ? (
                    <div>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => {
                          setFormData({ ...formData, coverImage: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Entrez l'URL d'une image sur internet
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {selectedFile ? selectedFile.name : "Cliquez pour sélectionner une image"}
                          </span>
                          <span className="text-xs text-gray-400">
                            JPG, PNG, GIF (max 5MB)
                          </span>
                        </label>
                      </div>
                      {uploadingImage && (
                        <div className="mt-2 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                          <p className="text-xs text-gray-400 mt-1">Upload en cours...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview de l'image */}
                  {(imagePreview || formData.coverImage) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-300 mb-2">Aperçu:</p>
                      <img
                        src={imagePreview || formData.coverImage}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-cover mx-auto"
                      />
                    </div>
                  )}
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
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!currentUser || uploadingImage}
                  >
                    {uploadingImage ? "Upload..." : (editingEvent ? "Modifier" : "Créer")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'invitation d'artistes */}
      {isArtistModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Inviter un artiste</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Pour l'événement: <span className="text-pink-400">{selectedEvent.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsArtistModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section de recherche et filtres */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Rechercher des artistes</h3>

                    {/* Barre de recherche */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom, genre..."
                        value={artistSearchTerm}
                        onChange={(e) => setArtistSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Genre
                        </label>
                        <select
                          value={selectedArtistGenre}
                          onChange={(e) => setSelectedArtistGenre(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                        >
                          <option value="all">Tous les genres</option>
                          {artistGenres.filter(genre => genre !== "all").map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Taux min (€)
                        </label>
                        <input
                          type="number"
                          placeholder="Min"
                          value={minRate}
                          onChange={(e) => setMinRate(e.target.value ? Number(e.target.value) : "")}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Taux max (€)
                        </label>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxRate}
                          onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : "")}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    {/* Liste des artistes */}
                    <div className="max-h-96 overflow-y-auto">
                      {filteredArtists.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun artiste trouvé</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredArtists.map(artist => {
                            const fullInfo = getArtistFullInfo(artist);
                            if (!fullInfo) return null;

                            return (
                              <div
                                key={artist.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedArtist?.id === artist.id
                                  ? "border-pink-500 bg-pink-500/10"
                                  : getArtistInvitation(artist)
                                    ? getArtistInvitation(artist)!.status === "cancelled"
                                      ? "border-red-500 bg-red-500/20 opacity-70"
                                      : `${getInvitationStatusColor(getArtistInvitation(artist)!.status).border} ${getInvitationStatusColor(getArtistInvitation(artist)!.status).bg}`
                                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                                  }`}
                                onClick={() => handleSelectArtist(artist)}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={fullInfo.user.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                                    alt={fullInfo.user.firstName}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold text-white">
                                        {artist.displayName}
                                      </h4>
                                      <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs">{artist.rating || "N/A"}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                      {fullInfo.user.firstName} {fullInfo.user.lastName}
                                    </p>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                        {artist.genre}
                                      </span>
                                      <span>€{artist.rate}/h</span>
                                      <span>{artist.bookings || 0} bookings</span>
                                    </div>

                                    {/* Badge d'invitation avec couleur selon le statut */}
                                    {getArtistInvitation(artist) && (
                                      <div className="mt-2">
                                        <span className={`${getInvitationStatusColor(getArtistInvitation(artist)!.status).bg} ${getInvitationStatusColor(getArtistInvitation(artist)!.status).text} px-2 py-1 rounded text-xs`}>
                                          {getInvitationStatusText(getArtistInvitation(artist)!.status)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {selectedArtist?.id === artist.id && (
                                    <UserCheck className="w-5 h-5 text-pink-500" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section de détails et envoi */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
                    <h3 className="text-lg font-semibold mb-4">Détails de l'invitation</h3>

                    {selectedArtist ? (
                      <div className="space-y-4">
                        {/* Informations de l'artiste sélectionné */}
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={getArtistFullInfo(selectedArtist)?.user.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                              alt={selectedArtist.displayName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-white">{selectedArtist.displayName}</h4>
                              <p className="text-sm text-gray-300">{selectedArtist.genre}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>Note: {selectedArtist.rating || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-green-400" />
                              <span>€{selectedArtist.rate}/h</span>
                            </div>
                          </div>
                        </div>

                        {/* Formulaire d'invitation */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Participants attendus
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={invitationData.expectedAttendees}
                              onChange={(e) => setInvitationData({
                                ...invitationData,
                                expectedAttendees: parseInt(e.target.value) || 0
                              })}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Genre musical prévu
                            </label>
                            <input
                              type="text"
                              value={invitationData.genre}
                              onChange={(e) => setInvitationData({
                                ...invitationData,
                                genre: e.target.value
                              })}
                              placeholder="Ex: Techno, Jazz, Hip-Hop..."
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Description de l'événement
                            </label>
                            <textarea
                              value={invitationData.description}
                              onChange={(e) => setInvitationData({
                                ...invitationData,
                                description: e.target.value
                              })}
                              rows={3}
                              placeholder="Décrivez l'événement, l'ambiance, les attentes..."
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>

                        {getArtistInvitation(selectedArtist) ? (
                          <div className="space-y-3">
                            <div className={`${getInvitationStatusColor(getArtistInvitation(selectedArtist)!.status).bg} border ${getInvitationStatusColor(getArtistInvitation(selectedArtist)!.status).border} rounded-lg p-3`}>
                              <div className={`flex items-center gap-2 ${getInvitationStatusColor(getArtistInvitation(selectedArtist)!.status).text}`}>
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">Invitation déjà envoyée</span>
                              </div>
                              <p className={`${getInvitationStatusColor(getArtistInvitation(selectedArtist)!.status).text} text-xs mt-1`}>
                                Statut: {getInvitationStatusText(getArtistInvitation(selectedArtist)!.status)}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {/* Bouton restaurer pour les invitations annulées */}
                              {getArtistInvitation(selectedArtist)?.status === "cancelled" && (
                                <button
                                  onClick={() => restoreInvitation(getArtistInvitation(selectedArtist)!.id)}
                                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold text-sm"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Restaurer l'invitation
                                </button>
                              )}

                              {/* Bouton modifier pour les statuts où c'est possible */}
                              {(getArtistInvitation(selectedArtist)?.status === "pending" ||
                                getArtistInvitation(selectedArtist)?.status === "negotiation" ||
                                getArtistInvitation(selectedArtist)?.status === "cancelled") && (
                                  <button
                                    onClick={() => updateExistingInvitation(getArtistInvitation(selectedArtist)!.id)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold text-sm"
                                  >
                                    <Edit className="w-4 h-4" />
                                    {getArtistInvitation(selectedArtist)?.status === "cancelled" ? "Modifier et restaurer" : "Modifier l'invitation"}
                                  </button>
                                )}

                              {/* Bouton annuler pour les statuts actifs */}
                              {(getArtistInvitation(selectedArtist)?.status === "pending" ||
                                getArtistInvitation(selectedArtist)?.status === "negotiation") && (
                                  <button
                                    onClick={() => cancelInvitation(getArtistInvitation(selectedArtist)!.id)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold text-sm"
                                  >
                                    <X className="w-4 h-4" />
                                    Annuler l'invitation
                                  </button>
                                )}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={sendInvitation}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                          >
                            <Mail className="w-4 h-4" />
                            Envoyer l'invitation
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Sélectionnez un artiste pour envoyer une invitation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

export default ClubEventsPage;