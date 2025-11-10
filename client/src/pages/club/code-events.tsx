"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid3X3, List, Edit, Trash2, Eye, MapPin, Calendar, Users, DollarSign, Clock } from "lucide-react";
import { Event, InsertEvent } from "@shared/schema";

// Données fictives complètes pour les événements
const mockEvents: Event[] = [
  {
    id: 1,
    organizerType: "club",
    organizerId: 1,
    createdBy: 1,
    title: "Festival Électronique Nocturne",
    description: "Une nuit magique avec les meilleurs DJs de la scène électronique française. Ambiance garantie jusqu'au petit matin !",
    date: new Date("2024-12-25T22:00:00"),
    startTime: "22:00",
    endTime: "06:00",
    location: "78 Avenue des Champs-Élysées, Paris",
    city: "Paris",
    country: "France",
    latitude: "48.8738",
    longitude: "2.2950",
    venueName: "Le Palace Paris",
    category: "Electronic",
    price: "45.00",
    capacity: 800,
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
    participantCount: 650,
    popularity: 95,
    isApproved: true,
    status: "upcoming",
    mood: "energetic",
    reserveTables: true,
    createdAt: new Date("2024-01-15T10:00:00")
  },
  {
    id: 2,
    organizerType: "artist",
    organizerId: 2,
    createdBy: 2,
    title: "Concert Jazz Intime",
    description: "Découvrez une expérience jazz unique dans un cadre intimiste. Reprise des plus grands standards du jazz moderne.",
    date: new Date("2024-11-18T20:00:00"),
    startTime: "20:00",
    endTime: "23:00",
    location: "15 Rue du Jazz, Lyon",
    city: "Lyon",
    country: "France",
    latitude: "45.7640",
    longitude: "4.8357",
    venueName: "Jazz Club Lyon",
    category: "Jazz",
    price: "25.00",
    capacity: 150,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop",
    participantCount: 120,
    popularity: 88,
    isApproved: true,
    status: "upcoming",
    mood: "chill",
    reserveTables: false,
    createdAt: new Date("2024-01-10T14:30:00")
  },
  {
    id: 3,
    organizerType: "club",
    organizerId: 3,
    createdBy: 3,
    title: "Soirée Hip-Hop Underground",
    description: "Plongez dans l'univers du hip-hop avec les talents émergents de la scène française. Battles et performances live.",
    date: new Date("2024-12-10T21:00:00"),
    startTime: "21:00",
    endTime: "04:00",
    location: "42 Rue de la Bass, Marseille",
    city: "Marseille",
    country: "France",
    latitude: "43.2965",
    longitude: "5.3698",
    venueName: "Urban Factory",
    category: "Hip-Hop",
    price: "20.00",
    capacity: 300,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    participantCount: 280,
    popularity: 92,
    isApproved: true,
    status: "upcoming",
    mood: "energetic",
    reserveTables: true,
    createdAt: new Date("2024-01-08T09:15:00")
  },
  {
    id: 4,
    organizerType: "user",
    organizerId: 4,
    createdBy: 4,
    title: "Festival Rock Indépendant",
    description: "3 jours de rock indépendant avec 20 groupes prometteurs. Food trucks et artisanat local sur place.",
    date: new Date("2024-11-30T18:00:00"),
    startTime: "18:00",
    endTime: "23:00",
    location: "Parc de la Tête d'Or, Lyon",
    city: "Lyon",
    country: "France",
    latitude: "45.7772",
    longitude: "4.8520",
    venueName: "Parc de la Tête d'Or",
    category: "Rock",
    price: "35.00",
    capacity: 2000,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=300&fit=crop",
    participantCount: 1800,
    popularity: 97,
    isApproved: true,
    status: "upcoming",
    mood: "festive",
    reserveTables: false,
    createdAt: new Date("2024-01-05T11:20:00")
  },
  {
    id: 5,
    organizerType: "artist",
    organizerId: 5,
    createdBy: 5,
    title: "Soirée Classique & Vin",
    description: "Une soirée élégante alliant musique classique et dégustation de vins fins. Tenue chic recommandée.",
    date: new Date("2024-11-22T19:30:00"),
    startTime: "19:30",
    endTime: "22:30",
    location: "Opéra de Bordeaux, Bordeaux",
    city: "Bordeaux",
    country: "France",
    latitude: "44.8378",
    longitude: "-0.5792",
    venueName: "Grand Opéra de Bordeaux",
    category: "Classical",
    price: "60.00",
    capacity: 400,
    coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=300&fit=crop",
    participantCount: 350,
    popularity: 85,
    isApproved: true,
    status: "upcoming",
    mood: "romantic",
    reserveTables: true,
    createdAt: new Date("2024-01-12T16:45:00")
  },
  {
    id: 6,
    organizerType: "club",
    organizerId: 6,
    createdBy: 6,
    title: "Rave Techno Mystique",
    description: "Voyage sonore dans les profondeurs de la techno. Line-up international et mapping vidéo immersif.",
    date: new Date("2024-12-15T23:00:00"),
    startTime: "23:00",
    endTime: "08:00",
    location: "Warehouse 45, Lille",
    city: "Lille",
    country: "France",
    latitude: "50.6292",
    longitude: "3.0573",
    venueName: "The Warehouse",
    category: "Techno",
    price: "30.00",
    capacity: 500,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    participantCount: 480,
    popularity: 94,
    isApproved: true,
    status: "upcoming",
    mood: "dark",
    reserveTables: false,
    createdAt: new Date("2024-01-07T13:10:00")
  },
  {
    id: 7,
    organizerType: "artist",
    organizerId: 5,
    createdBy: 5,
    title: "Soirée Classique & Vin",
    description: "Une soirée élégante alliant musique classique et dégustation de vins fins. Tenue chic recommandée.",
    date: new Date("2024-11-22T19:30:00"),
    startTime: "19:30",
    endTime: "22:30",
    location: "Opéra de Bordeaux, Bordeaux",
    city: "Bordeaux",
    country: "France",
    latitude: "44.8378",
    longitude: "-0.5792",
    venueName: "Grand Opéra de Bordeaux",
    category: "Pop",
    price: "60.00",
    capacity: 400,
    coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=300&fit=crop",
    participantCount: 350,
    popularity: 85,
    isApproved: true,
    status: "upcoming",
    mood: "romantic",
    reserveTables: true,
    createdAt: new Date("2024-01-12T16:45:00")
  },
  {
    id: 8,
    organizerType: "artist",
    organizerId: 6,
    createdBy: 6,
    title: "Rave Techno Mystique",
    description: "Voyage sonore dans les profondeurs de la techno. Line-up international et mapping vidéo immersif.",
    date: new Date("2024-12-15T23:00:00"),
    startTime: "23:00",
    endTime: "08:00",
    location: "Warehouse 45, Lille",
    city: "Lille",
    country: "France",
    latitude: "50.6292",
    longitude: "3.0573",
    venueName: "The Warehouse",
    category: "Reggae",
    price: "30.00",
    capacity: 500,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
    participantCount: 480,
    popularity: 94,
    isApproved: true,
    status: "upcoming",
    mood: "dark",
    reserveTables: false,
    createdAt: new Date("2024-01-07T13:10:00")
  },
];

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
    reserveTables: false
  });

  const categories = ["all", "Electronic", "Jazz", "Hip-Hop", "Rock", "Classical", "Techno", "Pop", "Reggae"];

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
      reserveTables: false
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
      reserveTables: event.reserveTables || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Mise à jour
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData, id: editingEvent.id }
          : event
      ));
    } else {
      // Création
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id)) + 1,
        organizerType: "user",
        organizerId: 1,
        createdBy: 1,
        participantCount: 0,
        popularity: 0,
        isApproved: true,
        createdAt: new Date(),
        ...formData as Omit<InsertEvent, 'organizerType' | 'organizerId' | 'createdBy'>
      } as Event;
      
      setEvents([...events, newEvent]);
    }
    
    setIsModalOpen(false);
    setEditingEvent(null);
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
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === "all" 
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
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? "bg-pink-500 text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
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
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
                <div className="relative aspect-[4/3]">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&h=300&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{event.venueName}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
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
                </div>
                
                <div className="p-3">
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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === "upcoming" ? "bg-green-500/20 text-green-400" :
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
            ))}
          </div>
        ) : (
          // Vue Liste
          <div className="space-y-4">
            {filteredEvents.map(event => (
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
                        <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{event.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
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
                      <span className={`px-2 py-1 rounded-full ${
                        event.status === "upcoming" ? "bg-green-500/20 text-green-400" :
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
            ))}
          </div>
        )}
      </main>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingEvent ? "Modifier l'événement" : "Créer un événement"}
              </h2>
              
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
    </div>
  );
};

export default EventsPage;