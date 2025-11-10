"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List, MapPin, Calendar, Users, Star, Mail, Music, Eye, Edit, MoreVertical, X, Check, Send, Image, MessageCircle, Heart, Share, Play, DollarSign } from "lucide-react";
import { Artist, Event, Invitation, Feedback, Photo, CollaborationMessage, CollaborationMilestone, ArtistPortfolio } from "@shared/schema";
import { mockArtists, mockEvents, mockInvitations, mockFeedback, mockPhotos, mockCollaborationMessages, mockCollaborationMilestones, mockArtistPortfolios } from "@/data/club-events-data";
import AlertModal from "@/components/AlertModal";

// Types étendus pour les artistes
interface ArtistWithDetails extends Artist {
  eventsOrganized?: Event[];
  eventsPerformed?: Event[];
  invitations?: Invitation[];
  feedback?: Feedback[];
  photos?: Photo[];
  collaborationMessages?: CollaborationMessage[];
  collaborationMilestones?: CollaborationMilestone[];
  portfolio?: ArtistPortfolio[];
}

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistWithDetails[]>(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState<ArtistWithDetails[]>(mockArtists);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArtist, setSelectedArtist] = useState<ArtistWithDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"portfolio" | "events" | "organized" | "invitations" | "collaborations" | "feedback" | "photos">("portfolio");

  // États pour les modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // États pour AlertModal
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    type: "info" as const,
    onConfirm: () => {},
    confirmLabel: "OK",
    cancelLabel: "Fermer"
  });

  const genres = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];
  const locations = ["all", "Paris", "Lyon", "Marseille", "Bordeaux", "Lille"];

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

  // Récupérer les événements organisés par l'artiste
  const getEventsOrganizedByArtist = (artistId: number) => {
    return mockEvents.filter(event => 
      event.organizerType === "artist" && event.organizerId === artistId
    );
  };

  // Récupérer les événements où l'artiste performe
  const getEventsPerformedByArtist = (artistId: number) => {
    const artistInvitations = mockInvitations.filter(inv => inv.userId === artistId);
    return mockEvents.filter(event => 
      artistInvitations.some(inv => inv.eventId === event.id && inv.status === "confirmed")
    );
  };

  // Récupérer les invitations de l'artiste
  const getArtistInvitations = (artistId: number) => {
    return mockInvitations.filter(inv => inv.userId === artistId);
  };

  // Récupérer les feedbacks pour l'artiste
  const getArtistFeedback = (artistId: number) => {
    return mockFeedback.filter(fb => fb.sourceType === "artist" && fb.sourceId === artistId);
  };

  // Récupérer les photos de l'artiste
  const getArtistPhotos = (artistId: number) => {
    return mockPhotos.filter(photo => 
      mockEvents.some(event => 
        event.id === photo.eventId && 
        mockInvitations.some(inv => 
          inv.eventId === event.id && inv.userId === artistId && inv.status === "confirmed"
        )
      )
    );
  };

  // Récupérer les messages de collaboration
  const getArtistCollaborationMessages = (artistId: number) => {
    return mockCollaborationMessages.filter(msg => 
      mockInvitations.some(inv => 
        inv.id === msg.invitationId && inv.userId === artistId
      )
    );
  };

  // Récupérer les milestones de collaboration
  const getArtistCollaborationMilestones = (artistId: number) => {
    return mockCollaborationMilestones.filter(milestone => 
      mockInvitations.some(inv => 
        inv.id === milestone.invitationId && inv.userId === artistId
      )
    );
  };

  // Récupérer le portfolio de l'artiste
  const getArtistPortfolio = (artistId: number) => {
    return mockArtistPortfolios.filter(portfolio => portfolio.artistId === artistId);
  };

  // Charger les détails complets d'un artiste
  const loadArtistDetails = (artist: Artist): ArtistWithDetails => {
    return {
      ...artist,
      eventsOrganized: getEventsOrganizedByArtist(artist.id),
      eventsPerformed: getEventsPerformedByArtist(artist.id),
      invitations: getArtistInvitations(artist.id),
      feedback: getArtistFeedback(artist.id),
      photos: getArtistPhotos(artist.id),
      collaborationMessages: getArtistCollaborationMessages(artist.id),
      collaborationMilestones: getArtistCollaborationMilestones(artist.id),
      portfolio: getArtistPortfolio(artist.id)
    };
  };

  // Ouvrir le modal de détails d'un artiste
  const handleViewDetails = (artist: Artist) => {
    const artistWithDetails = loadArtistDetails(artist);
    setSelectedArtist(artistWithDetails);
    setIsDetailModalOpen(true);
    setActiveTab("portfolio");
  };

  // Ouvrir le modal d'invitation
  const handleOpenInvitation = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsInvitationModalOpen(true);
  };

  // Ouvrir le modal de message
  const handleOpenMessage = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsMessageModalOpen(true);
  };

  // Filtrer les artistes
  useEffect(() => {
    let filtered = artists;

    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter(artist => artist.genre.includes(selectedGenre));
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(artist => artist.location.includes(selectedLocation));
    }

    setFilteredArtists(filtered);
  }, [artists, searchTerm, selectedGenre, selectedLocation]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Artistes</h1>
              <p className="text-gray-400">Découvrez et collaborez avec des artistes talentueux</p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Barre de recherche */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher des artistes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex items-end sm:items-center justify-between mt-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Filtre par genre */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gray-400 text-sm whitespace-nowrap">Genre:</span>
                <button
                  onClick={() => setSelectedGenre("all")}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedGenre === "all" 
                      ? "bg-pink-500 text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Tous
                </button>
                {genres.filter(genre => genre !== "all").map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedGenre === genre 
                        ? "bg-pink-500 text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Filtre par localisation */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-gray-400 text-sm whitespace-nowrap">Localisation:</span>
                <button
                  onClick={() => setSelectedLocation("all")}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedLocation === "all" 
                      ? "bg-pink-500 text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Toutes
                </button>
                {locations.filter(location => location !== "all").map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedLocation === location 
                        ? "bg-pink-500 text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode d'affichage */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-gray-800 text-pink-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-gray-800 text-pink-500" : "text-gray-400 hover:text-white"
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
        {filteredArtists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Aucun artiste trouvé</div>
            <p className="text-gray-500 text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : viewMode === "grid" ? (
          // Vue Grid (style TikTok)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map(artist => (
              <div key={artist.id} className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 group">
                <div className="relative aspect-[4/3]">
                  <img
                    src={mockArtists.find(a => a.id === artist.id)?.socialMedia?.instagram 
                      ? `https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=300&fit=crop`
                      : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=300&fit=crop"
                    }
                    alt={artist.displayName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Badge de popularité */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{artist.popularity}%</span>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">{artist.displayName}</h3>
                    <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                      <Music className="w-3 h-3" />
                      <span className="line-clamp-1">{artist.genre}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{artist.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{artist.bio}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{artist.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{artist.bookings} réservations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{artist.rate}€</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {artist.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {artist.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300">
                        +{artist.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(artist)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Voir
                    </button>
                    <button
                      onClick={() => handleOpenInvitation(artist)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      Inviter
                    </button>
                    <button
                      onClick={() => handleOpenMessage(artist)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vue Liste
          <div className="space-y-4">
            {filteredArtists.map(artist => (
              <div key={artist.id} className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={mockArtists.find(a => a.id === artist.id)?.socialMedia?.instagram 
                      ? `https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=150&fit=crop`
                      : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=150&fit=crop"
                    }
                    alt={artist.displayName}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-lg">{artist.displayName}</h3>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{artist.popularity}%</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{artist.bio}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            <span>{artist.genre}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{artist.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{artist.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(artist)}
                          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenInvitation(artist)}
                          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded transition-colors"
                          title="Inviter"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenMessage(artist)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
                          title="Message"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {artist.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{artist.rate}€</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{artist.bookings} réservations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{getEventsPerformedByArtist(artist.id).length} événements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{getArtistFeedback(artist.id).length} avis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de détails de l'artiste */}
      {isDetailModalOpen && selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedArtist.displayName}</h2>
                  <p className="text-gray-400">{selectedArtist.genre} • {selectedArtist.location}</p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* En-tête de l'artiste */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="lg:w-1/3">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={mockArtists.find(a => a.id === selectedArtist.id)?.socialMedia?.instagram 
                        ? `https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop`
                        : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop"
                      }
                      alt={selectedArtist.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-pink-500">{selectedArtist.rating}</div>
                      <div className="text-gray-400">Note</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-500">{selectedArtist.bookings}</div>
                      <div className="text-gray-400">Réservations</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-500">{selectedArtist.popularity}%</div>
                      <div className="text-gray-400">Popularité</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-500">{selectedArtist.rate}€</div>
                      <div className="text-gray-400">Cachet</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleOpenInvitation(selectedArtist)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-full text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Inviter
                    </button>
                    <button
                      onClick={() => handleOpenMessage(selectedArtist)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-full text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedArtist.bio}</p>
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Spécialités</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Réseaux sociaux */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Contact</h3>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>{selectedArtist.contact?.email}</div>
                        <div>{selectedArtist.contact?.phone}</div>
                        {selectedArtist.contact?.agent && (
                          <div>Agent: {selectedArtist.contact.agent}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Réseaux sociaux</h3>
                      <div className="text-sm text-gray-300 space-y-1">
                        {selectedArtist.socialMedia?.instagram && (
                          <div>Instagram: {selectedArtist.socialMedia.instagram}</div>
                        )}
                        {selectedArtist.socialMedia?.twitter && (
                          <div>Twitter: {selectedArtist.socialMedia.twitter}</div>
                        )}
                        {selectedArtist.socialMedia?.soundcloud && (
                          <div>SoundCloud: {selectedArtist.socialMedia.soundcloud}</div>
                        )}
                        {selectedArtist.socialMedia?.spotify && (
                          <div>Spotify: {selectedArtist.socialMedia.spotify}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation par onglets */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8 overflow-x-auto">
                  {[
                    { id: "portfolio", label: "Portfolio", count: selectedArtist.portfolio?.length || 0 },
                    { id: "events", label: "Événements", count: selectedArtist.eventsPerformed?.length || 0 },
                    { id: "organized", label: "Organisés", count: selectedArtist.eventsOrganized?.length || 0 },
                    { id: "invitations", label: "Invitations", count: selectedArtist.invitations?.length || 0 },
                    { id: "collaborations", label: "Collaborations", count: selectedArtist.collaborationMessages?.length || 0 },
                    { id: "feedback", label: "Avis", count: selectedArtist.feedback?.length || 0 },
                    { id: "photos", label: "Photos", count: selectedArtist.photos?.length || 0 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-pink-500 text-pink-500"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="min-h-[400px]">
                {/* Portfolio */}
                {activeTab === "portfolio" && (
                  <div>
                    {selectedArtist.portfolio && selectedArtist.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedArtist.portfolio.map((item) => (
                          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden group">
                            <div className="relative aspect-video">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                              <p className="text-gray-400 text-xs">
                                Ajouté le {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucun élément dans le portfolio</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Événements où l'artiste performe */}
                {activeTab === "events" && (
                  <div>
                    {selectedArtist.eventsPerformed && selectedArtist.eventsPerformed.length > 0 ? (
                      <div className="space-y-4">
                        {selectedArtist.eventsPerformed.map((event) => (
                          <div key={event.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{event.title}</h4>
                                <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.venueName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{event.participantCount} participants</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucun événement à venir</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Événements organisés */}
                {activeTab === "organized" && (
                  <div>
                    {selectedArtist.eventsOrganized && selectedArtist.eventsOrganized.length > 0 ? (
                      <div className="space-y-4">
                        {selectedArtist.eventsOrganized.map((event) => (
                          <div key={event.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{event.title}</h4>
                                <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.venueName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{event.participantCount} participants</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucun événement organisé</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Invitations */}
                {activeTab === "invitations" && (
                  <div>
                    {selectedArtist.invitations && selectedArtist.invitations.length > 0 ? (
                      <div className="space-y-3">
                        {selectedArtist.invitations.map((invitation) => {
                          const event = mockEvents.find(e => e.id === invitation.eventId);
                          return (
                            <div key={invitation.id} className="bg-gray-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{event?.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${getInvitationStatusColor(invitation.status)}`}>
                                  {getInvitationStatusText(invitation.status)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{invitation.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Invité le {formatDate(invitation.invitedAt)}</span>
                                </div>
                                {invitation.expectedAttendees > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{invitation.expectedAttendees} attendees</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucune invitation</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Collaborations */}
                {activeTab === "collaborations" && (
                  <div className="space-y-6">
                    {/* Messages de collaboration */}
                    <div>
                      <h3 className="font-semibold mb-3">Messages de collaboration</h3>
                      {selectedArtist.collaborationMessages && selectedArtist.collaborationMessages.length > 0 ? (
                        <div className="space-y-3">
                          {selectedArtist.collaborationMessages.map((message) => {
                            const invitation = mockInvitations.find(inv => inv.id === message.invitationId);
                            const event = mockEvents.find(e => e.id === invitation?.eventId);
                            return (
                              <div key={message.id} className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    message.senderType === "artist" ? "bg-purple-500" : "bg-blue-500"
                                  }`} />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">
                                        {message.senderType === "artist" ? "Artiste" : "Organisateur"}
                                      </span>
                                      <span className="text-gray-400 text-xs">{formatDate(message.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{message.content}</p>
                                    {event && (
                                      <p className="text-gray-500 text-xs mt-1">
                                        Événement: {event.title}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-800 rounded-lg">
                          <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm">Aucun message de collaboration</div>
                        </div>
                      )}
                    </div>

                    {/* Milestones de collaboration */}
                    <div>
                      <h3 className="font-semibold mb-3">Étapes de collaboration</h3>
                      {selectedArtist.collaborationMilestones && selectedArtist.collaborationMilestones.length > 0 ? (
                        <div className="space-y-3">
                          {selectedArtist.collaborationMilestones.map((milestone) => {
                            const invitation = mockInvitations.find(inv => inv.id === milestone.invitationId);
                            const event = mockEvents.find(e => e.id === invitation?.eventId);
                            return (
                              <div key={milestone.id} className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-sm">{milestone.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getMilestoneStatusColor(milestone.status)}`}>
                                    {milestone.status === "completed" ? "Terminé" : 
                                     milestone.status === "in_progress" ? "En cours" : "En attente"}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">{milestone.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Échéance: {formatDate(milestone.dueDate)}</span>
                                  </div>
                                  {milestone.completedAt && (
                                    <div className="flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Terminé le {formatDate(milestone.completedAt)}</span>
                                    </div>
                                  )}
                                </div>
                                {event && (
                                  <p className="text-gray-500 text-xs mt-2">
                                    Événement: {event.title}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-800 rounded-lg">
                          <Check className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm">Aucune étape de collaboration</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {activeTab === "feedback" && (
                  <div>
                    {selectedArtist.feedback && selectedArtist.feedback.length > 0 ? (
                      <div className="space-y-4">
                        {selectedArtist.feedback.map((fb) => (
                          <div key={fb.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < fb.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-600 text-gray-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-gray-400 text-sm">{formatDate(fb.createdAt)}</span>
                                </div>
                                <h4 className="font-semibold mb-1">{fb.title}</h4>
                                <p className="text-gray-300 text-sm mb-2">{fb.comment}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{fb.likesCount} likes</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{fb.commentsCount} commentaires</span>
                                  </div>
                                </div>
                                {fb.reply && (
                                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300 text-sm">
                                      <span className="font-medium">Réponse: </span>
                                      {fb.reply}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucun avis pour le moment</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Photos */}
                {activeTab === "photos" && (
                  <div>
                    {selectedArtist.photos && selectedArtist.photos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedArtist.photos.map((photo) => (
                          <div key={photo.id} className="bg-gray-800 rounded-lg overflow-hidden group">
                            <div className="relative aspect-square">
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <h4 className="font-semibold text-sm mb-1">{photo.title}</h4>
                                <p className="text-gray-300 text-xs line-clamp-2">{photo.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{photo.likesCount}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{photo.commentsCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <div className="text-gray-400">Aucune photo disponible</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'invitation */}
      {isInvitationModalOpen && selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Inviter {selectedArtist.displayName}</h2>
                  <p className="text-gray-400">Envoyez une invitation à cet artiste</p>
                </div>
                <button
                  onClick={() => setIsInvitationModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Événement
                  </label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500">
                    <option value="">Sélectionnez un événement</option>
                    {mockEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {formatDate(event.date)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message d'invitation
                  </label>
                  <textarea
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder={`Bonjour ${selectedArtist.displayName},\n\nJe vous invite à participer à notre événement...`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cachet proposé (€)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      placeholder={selectedArtist.rate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Audience estimée
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                      placeholder="0"
                    />
                  </div>
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

      {/* Modal de message */}
      {isMessageModalOpen && selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Message à {selectedArtist.displayName}</h2>
                  <p className="text-gray-400">Envoyez un message à cet artiste</p>
                </div>
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={8}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                    placeholder={`Bonjour ${selectedArtist.displayName},\n\n...`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le message
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

export default ArtistsPage;