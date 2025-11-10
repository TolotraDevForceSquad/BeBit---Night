// D:\Projet\BeBit\bebit - new\client\src\pages\club\club-events-page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Grid3X3, List, MapPin, Calendar, Users, DollarSign, Clock, User, Music, Building } from "lucide-react";
import { Event, User as UserType } from "@shared/schema";
import { useEvents, useUsers } from "@/services/servapi";

const ClubEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];

  // Charger les événements depuis l'API
  const { data: eventsData, loading, error } = useEvents();
  // Charger tous les utilisateurs pour récupérer les infos des organisateurs
  const { data: allUsers } = useUsers();

  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

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
              <p className="text-gray-400">Découvrez nos événements</p>
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
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Aucun événement trouvé</div>
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
    </div>
  );
};

export default ClubEventsPage;