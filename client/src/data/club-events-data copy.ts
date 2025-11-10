// D:\Projet\BeBit\bebit - new\client\src\data\club-events-data.ts
import { Event, Artist, EventArtist, Invitation, User, Club, EventParticipant, ArtistPortfolio, ClubLocation, ClubTable, EventReservedTable } from "@shared/schema";

// Données fictives pour les artistes
export const mockArtists: Artist[] = [
  {
    id: 1,
    userId: 2,
    displayName: "DJ ElectroWave",
    genre: "Electronic, Techno",
    bio: "Producteur et DJ français spécialisé dans l'électronique expérimentale. Plus de 10 ans d'expérience dans les clubs parisiens.",
    rate: "1500.00",
    tags: ["techno", "house", "experimental", "live-set"],
    popularity: 95,
    socialMedia: {
      instagram: "@electrowave",
      twitter: "@electrowave_music",
      soundcloud: "electrowave",
      spotify: "DJ ElectroWave"
    },
    contact: {
      email: "booking@electrowave.com",
      phone: "+33612345678",
      agent: "Sarah Music"
    },
    location: "Paris, France",
    rating: "4.8",
    bookings: 127
  },
  {
    id: 2,
    userId: 3,
    displayName: "Jazz Trio Moderne",
    genre: "Jazz, Fusion",
    bio: "Formation jazz innovante mêlant tradition et modernité. Lauréats du Prix du Jazz Européen 2023.",
    rate: "800.00",
    tags: ["jazz", "fusion", "improvisation", "acoustic"],
    popularity: 88,
    socialMedia: {
      instagram: "@jazztriomoderne",
      facebook: "JazzTrioModerne",
      youtube: "Jazz Trio Moderne"
    },
    contact: {
      email: "contact@jazztrio.com",
      phone: "+33623456789"
    },
    location: "Lyon, France",
    rating: "4.9",
    bookings: 64
  },
  {
    id: 3,
    userId: 4,
    displayName: "MC Flow",
    genre: "Hip-Hop, Rap",
    bio: "Artiste hip-hop émergent de la scène marseillaise. Connu pour ses textes engagés et son flow unique.",
    rate: "500.00",
    tags: ["hiphop", "rap", "urban", "freestyle"],
    popularity: 92,
    socialMedia: {
      instagram: "@mcflowofficial",
      tiktok: "@mcflow",
      soundcloud: "mcflow"
    },
    contact: {
      email: "mcflow.booking@gmail.com",
      phone: "+33634567890"
    },
    location: "Marseille, France",
    rating: "4.6",
    bookings: 43
  },
  {
    id: 4,
    userId: 5,
    displayName: "Rock Revolution",
    genre: "Rock, Indie",
    bio: "Groupe de rock indépendant avec 3 albums à son actif. Tournées internationales et festivals majeurs.",
    rate: "1200.00",
    tags: ["rock", "indie", "alternative", "live-band"],
    popularity: 97,
    socialMedia: {
      instagram: "@rockrevolution",
      facebook: "RockRevolutionBand",
      spotify: "Rock Revolution"
    },
    contact: {
      email: "management@rockrevolution.com",
      phone: "+33645678901",
      agent: "Live Nation"
    },
    location: "Lyon, France",
    rating: "4.7",
    bookings: 89
  },
  {
    id: 5,
    userId: 6,
    displayName: "Classique Élégance",
    genre: "Classical, Orchestral",
    bio: "Ensemble classique de renom spécialisé dans les œuvres modernes et contemporaines.",
    rate: "2000.00",
    tags: ["classical", "orchestral", "strings", "elegant"],
    popularity: 85,
    socialMedia: {
      instagram: "@classiqueelegance",
      youtube: "Classique Élégance"
    },
    contact: {
      email: "info@classiqueelegance.fr",
      phone: "+33656789012"
    },
    location: "Bordeaux, France",
    rating: "4.9",
    bookings: 56
  },
  {
    id: 6,
    userId: 7,
    displayName: "Techno Master",
    genre: "Techno, Minimal",
    bio: "DJ techno reconnu internationalement pour ses sets profonds et hypnotiques.",
    rate: "1800.00",
    tags: ["techno", "minimal", "deep", "berlin-style"],
    popularity: 94,
    socialMedia: {
      instagram: "@technomaster",
      soundcloud: "technomaster",
      residentadvisor: "Techno Master"
    },
    contact: {
      email: "booking@technomaster.com",
      phone: "+33667890123"
    },
    location: "Lille, France",
    rating: "4.8",
    bookings: 112
  },
  {
    id: 7,
    userId: 8,
    displayName: "Pop Sensation",
    genre: "Pop, Dance",
    bio: "Chanteuse pop aux multiples succès. Performances énergiques et voix puissante.",
    rate: "2500.00",
    tags: ["pop", "dance", "mainstream", "vocal"],
    popularity: 98,
    socialMedia: {
      instagram: "@popsensation",
      tiktok: "@popsensation",
      spotify: "Pop Sensation"
    },
    contact: {
      email: "management@popsensation.com",
      phone: "+33678901234"
    },
    location: "Paris, France",
    rating: "4.9",
    bookings: 156
  },
  {
    id: 8,
    userId: 9,
    displayName: "Reggae Vibes",
    genre: "Reggae, Dub",
    bio: "Groupe reggae authentique porteur de messages positifs et de vibrations chaleureuses.",
    rate: "700.00",
    tags: ["reggae", "dub", "roots", "positive"],
    popularity: 87,
    socialMedia: {
      instagram: "@reggaevibes",
      facebook: "ReggaeVibesBand"
    },
    contact: {
      email: "reggaevibes@contact.com",
      phone: "+33689012345"
    },
    location: "Marseille, France",
    rating: "4.5",
    bookings: 38
  }
];

// Données fictives pour les événements
export const mockEvents: Event[] = [
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

// Données fictives pour les relations eventArtists
export const mockEventArtists: EventArtist[] = [
  { eventId: 1, artistId: 1, fee: "1500.00" },
  { eventId: 1, artistId: 6, fee: "1800.00" },
  { eventId: 2, artistId: 2, fee: "800.00" },
  { eventId: 3, artistId: 3, fee: "500.00" },
  { eventId: 4, artistId: 4, fee: "1200.00" },
  { eventId: 5, artistId: 5, fee: "2000.00" },
  { eventId: 7, artistId: 7, fee: "2500.00" },
  { eventId: 8, artistId: 8, fee: "700.00" },
];

// Données fictives pour les invitations
// Données fictives pour les invitations
export const mockInvitations: Invitation[] = [
  // ======================
  // Invitations CONFIRMÉES (status: "confirmed")
  // ======================
  {
    id: 1,
    eventId: 1,
    userId: 2,
    invitedById: 1,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-20T10:00:00"),
    expectedAttendees: 0,
    genre: "Electronic",
    description: "DJ résident pour la soirée",
    createdAt: new Date("2024-01-20T10:00:00")
  },
  {
    id: 2,
    eventId: 2,
    userId: 3,
    invitedById: 2,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-11T09:00:00"),
    expectedAttendees: 0,
    genre: "Jazz",
    description: "Pianiste principal pour le concert",
    createdAt: new Date("2024-01-11T09:00:00")
  },
  {
    id: 3,
    eventId: 3,
    userId: 4,
    invitedById: 3,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-09T11:00:00"),
    expectedAttendees: 0,
    genre: "Hip-Hop",
    description: "MC principal pour la soirée",
    createdAt: new Date("2024-01-09T11:00:00")
  },
  {
    id: 4,
    eventId: 4,
    userId: 5,
    invitedById: 4,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-06T14:00:00"),
    expectedAttendees: 0,
    genre: "Rock",
    description: "Groupe tête d'affiche du festival",
    createdAt: new Date("2024-01-06T14:00:00")
  },

  // ======================
  // Invitations en NÉGOCIATION (status: "negotiation")
  // ======================
  {
    id: 5,
    eventId: 1,
    userId: 7,
    invitedById: 1,
    status: "negotiation",
    progress: 50,
    invitedAt: new Date("2024-01-25T14:30:00"),
    expectedAttendees: 0,
    genre: "Techno",
    description: "Headliner pour le set de minuit",
    createdAt: new Date("2024-01-25T14:30:00")
  },
  {
    id: 6,
    eventId: 2,
    userId: 8,
    invitedById: 2,
    status: "negotiation",
    progress: 30,
    invitedAt: new Date("2024-01-15T16:00:00"),
    expectedAttendees: 0,
    genre: "Jazz",
    description: "Contrebassiste invité - négociation cachet",
    createdAt: new Date("2024-01-15T16:00:00")
  },
  {
    id: 7,
    eventId: 3,
    userId: 6,
    invitedById: 3,
    status: "negotiation",
    progress: 70,
    invitedAt: new Date("2024-01-12T10:30:00"),
    expectedAttendees: 0,
    genre: "Hip-Hop",
    description: "DJ support - discussion conditions",
    createdAt: new Date("2024-01-12T10:30:00")
  },

  // ======================
  // Invitations en PRÉPARATION (status: "preparation")
  // ======================
  {
    id: 8,
    eventId: 5,
    userId: 1,
    invitedById: 5,
    status: "preparation",
    progress: 80,
    invitedAt: new Date("2024-01-14T15:00:00"),
    expectedAttendees: 0,
    genre: "Classical",
    description: "Soliste violon - répétitions en cours",
    createdAt: new Date("2024-01-14T15:00:00")
  },
  {
    id: 9,
    eventId: 6,
    userId: 2,
    invitedById: 6,
    status: "preparation",
    progress: 60,
    invitedAt: new Date("2024-01-10T13:45:00"),
    expectedAttendees: 0,
    genre: "Techno",
    description: "Live act techno - préparation setup",
    createdAt: new Date("2024-01-10T13:45:00")
  },

  // ======================
  // Invitations COMPLÉTÉES (status: "completed")
  // ======================
  {
    id: 10,
    eventId: 7,
    userId: 3,
    invitedById: 7,
    status: "completed",
    progress: 100,
    invitedAt: new Date("2024-01-08T09:00:00"),
    expectedAttendees: 0,
    genre: "Pop",
    description: "Choriste - mission terminée",
    createdAt: new Date("2024-01-08T09:00:00")
  },
  {
    id: 11,
    eventId: 8,
    userId: 4,
    invitedById: 8,
    status: "completed",
    progress: 100,
    invitedAt: new Date("2024-01-07T11:30:00"),
    expectedAttendees: 0,
    genre: "Reggae",
    description: "Percussionniste - collaboration achevée",
    createdAt: new Date("2024-01-07T11:30:00")
  },

  // ======================
  // Invitations EN ATTENTE (status: "pending")
  // ======================
  {
    id: 12,
    eventId: 1,
    userId: 5,
    invitedById: 1,
    status: "pending",
    progress: 0,
    invitedAt: new Date("2024-01-28T10:00:00"),
    expectedAttendees: 0,
    genre: "Electronic",
    description: "VJ pour mapping vidéo",
    createdAt: new Date("2024-01-28T10:00:00")
  },
  {
    id: 13,
    eventId: 4,
    userId: 6,
    invitedById: 4,
    status: "pending",
    progress: 0,
    invitedAt: new Date("2024-01-20T14:00:00"),
    expectedAttendees: 0,
    genre: "Rock",
    description: "Groupe première partie",
    createdAt: new Date("2024-01-20T14:00:00")
  },

  // ======================
  // Invitations REFUSÉES (status: "declined")
  // ======================
  {
    id: 14,
    eventId: 2,
    userId: 7,
    invitedById: 2,
    status: "declined",
    progress: 0,
    invitedAt: new Date("2024-01-18T16:30:00"),
    expectedAttendees: 0,
    genre: "Jazz",
    description: "Saxophoniste - indisponible",
    createdAt: new Date("2024-01-18T16:30:00")
  },
  {
    id: 15,
    eventId: 5,
    userId: 8,
    invitedById: 5,
    status: "declined",
    progress: 0,
    invitedAt: new Date("2024-01-16T11:00:00"),
    expectedAttendees: 0,
    genre: "Classical",
    description: "Violoncelliste - emploi du temps chargé",
    createdAt: new Date("2024-01-16T11:00:00")
  },

  // ======================
  // Invitations ANNULÉES (status: "cancelled")
  // ======================
  {
    id: 16,
    eventId: 3,
    userId: 1,
    invitedById: 3,
    status: "cancelled",
    progress: 0,
    invitedAt: new Date("2024-01-14T09:30:00"),
    expectedAttendees: 0,
    genre: "Hip-Hop",
    description: "Beatmaker - annulation événement",
    createdAt: new Date("2024-01-14T09:30:00")
  },
  {
    id: 17,
    eventId: 6,
    userId: 2,
    invitedById: 6,
    status: "cancelled",
    progress: 0,
    invitedAt: new Date("2024-01-12T15:45:00"),
    expectedAttendees: 0,
    genre: "Techno",
    description: "DJ international - annulation vol",
    createdAt: new Date("2024-01-12T15:45:00")
  },

  // ======================
  // Invitations avec EXPECTED ATTENDEES (pour événements privés)
  // ======================
  {
    id: 18,
    eventId: 7,
    userId: 3,
    invitedById: 7,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-22T10:00:00"),
    expectedAttendees: 50,
    genre: "Pop",
    description: "Groupe invité - audience privée",
    createdAt: new Date("2024-01-22T10:00:00")
  },
  {
    id: 19,
    eventId: 8,
    userId: 4,
    invitedById: 8,
    status: "negotiation",
    progress: 40,
    invitedAt: new Date("2024-01-24T14:00:00"),
    expectedAttendees: 30,
    genre: "Reggae",
    description: "Sound system - négociation taille audience",
    createdAt: new Date("2024-01-24T14:00:00")
  },

  // ======================
  // Invitations CROISÉES (artistes invitant d'autres artistes)
  // ======================
  {
    id: 20,
    eventId: 1,
    userId: 6,
    invitedById: 2,
    status: "confirmed",
    progress: 100,
    invitedAt: new Date("2024-01-19T11:30:00"),
    expectedAttendees: 0,
    genre: "Techno",
    description: "Collaboration spéciale entre artistes",
    createdAt: new Date("2024-01-19T11:30:00")
  },
  {
    id: 21,
    eventId: 4,
    userId: 7,
    invitedById: 5,
    status: "preparation",
    progress: 90,
    invitedAt: new Date("2024-01-17T13:15:00"),
    expectedAttendees: 0,
    genre: "Rock",
    description: "Feature spécial entre genres musicaux",
    createdAt: new Date("2024-01-17T13:15:00")
  }
];

// Données fictives pour les utilisateurs
export const mockUsers: User[] = [
  // Utilisateurs normaux
  {
    id: 1,
    username: "jean_dupont",
    password: "hashed_password",
    email: "jean.dupont@email.com",
    firstName: "Jean",
    lastName: "Dupont",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    city: "Paris",
    country: "France",
    latitude: "48.8566",
    longitude: "2.3522",
    walletBalance: "150.50",
    isVerified: true,
    phone: "+33612345678",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date("2023-01-15T10:00:00")
  },
  {
    id: 2,
    username: "marie_leroy",
    password: "hashed_password",
    email: "marie.leroy@emaila.com",
    firstName: "Marie",
    lastName: "Leroy",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    city: "Lyon",
    country: "France",
    latitude: "45.7640",
    longitude: "4.8357",
    walletBalance: "75.00",
    isVerified: true,
    phone: "+33623456789",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: false,
    darkMode: true,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date("2023-03-20T14:30:00")
  },
  {
    id: 3,
    username: "pierre_martin",
    password: "hashed_password",
    email: "pierre.martin@email.com",
    firstName: "Pierre",
    lastName: "Martin",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    city: "Marseille",
    country: "France",
    latitude: "43.2965",
    longitude: "5.3698",
    walletBalance: "200.00",
    isVerified: false,
    phone: "+33634567890",
    verificationStatus: "pending",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: false,
    twoFactorEnabled: true,
    createdAt: new Date("2023-05-10T09:15:00")
  },

  // Artistes (doivent avoir un rôle artist)
  {
    id: 4,
    username: "dj_electrowave",
    password: "hashed_password",
    email: "booking@electrowave.com",
    firstName: "David",
    lastName: "Chen",
    role: "artist",
    profileImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop&crop=face",
    city: "Paris",
    country: "France",
    latitude: "48.8566",
    longitude: "2.3522",
    walletBalance: "2500.00",
    isVerified: true,
    phone: "+33612345678",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date("2022-11-08T16:45:00")
  },
  {
    id: 5,
    username: "jazz_trio",
    password: "hashed_password",
    email: "contact@jazztrio.com",
    firstName: "Sophie",
    lastName: "Bernard",
    role: "artist",
    profileImage: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face",
    city: "Lyon",
    country: "France",
    latitude: "45.7640",
    longitude: "4.8357",
    walletBalance: "1200.00",
    isVerified: true,
    phone: "+33623456789",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: true,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: true,
    createdAt: new Date("2022-09-12T11:20:00")
  },

  // Clubs (doivent avoir un rôle club)
  {
    id: 6,
    username: "le_palace_paris",
    password: "hashed_password",
    email: "contact@lepalace-paris.com",
    firstName: "Le Palace",
    lastName: "Paris",
    role: "club",
    profileImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop",
    city: "Paris",
    country: "France",
    latitude: "48.8738",
    longitude: "2.2950",
    walletBalance: "5000.00",
    isVerified: true,
    phone: "+33145678901",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date("2022-06-01T08:00:00")
  },
  {
    id: 7,
    username: "urban_factory",
    password: "hashed_password",
    email: "info@urbanfactory.com",
    firstName: "Urban",
    lastName: "Factory",
    role: "club",
    profileImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=150&h=150&fit=crop",
    city: "Marseille",
    country: "France",
    latitude: "43.2965",
    longitude: "5.3698",
    walletBalance: "3200.00",
    isVerified: true,
    phone: "+33498765432",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: false,
    darkMode: true,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: true,
    createdAt: new Date("2023-02-14T13:30:00")
  },
  {
    id: 8,
    username: "jazz_club_lyon",
    password: "hashed_password",
    email: "reservation@jazzclub-lyon.com",
    firstName: "Jazz Club",
    lastName: "Lyon",
    role: "club",
    profileImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop",
    city: "Lyon",
    country: "France",
    latitude: "45.7640",
    longitude: "4.8357",
    walletBalance: "1800.00",
    isVerified: true,
    phone: "+33412345678",
    verificationStatus: "approved",
    verificationDocuments: [],
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    darkMode: false,
    language: "fr",
    locationEnabled: true,
    twoFactorEnabled: false,
    createdAt: new Date("2023-04-05T10:15:00")
  }
];

// Données fictives pour les clubs (table clubs)
export const mockClubs: Club[] = [
  {
    id: 1,
    userId: 6, // le_palace_paris
    name: "Le Palace Paris",
    city: "Paris",
    country: "France",
    address: "78 Avenue des Champs-Élysées, 75008 Paris",
    latitude: "48.8738",
    longitude: "2.2950",
    capacity: 800,
    description: "Lieu emblématique de la nuit parisienne, le Palace accueille les meilleurs DJs et événements électroniques.",
    profileImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    rating: "4.7",
    reviewCount: 245,
    category: "Nightclub",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
    featured: true,
    instagram: "@lepalaceparis",
    website: "https://lepalace-paris.com",
    openingHours: {
      monday: "23:00-06:00",
      friday: "22:00-07:00",
      saturday: "22:00-07:00",
      sunday: "23:00-05:00"
    },
    features: ["Terrasse", "VIP", "Sound System Premium", "Parking"],
    hasTableReservation: true
  },
  {
    id: 2,
    userId: 7, // urban_factory
    name: "Urban Factory",
    city: "Marseille",
    country: "France",
    address: "42 Rue de la Bass, 13001 Marseille",
    latitude: "43.2965",
    longitude: "5.3698",
    capacity: 300,
    description: "Temple du hip-hop marseillais, l'Urban Factory est le spot incontournable pour les amateurs de culture urbaine.",
    profileImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop",
    rating: "4.5",
    reviewCount: 189,
    category: "Urban Club",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
    featured: true,
    instagram: "@urbanfactory",
    website: "https://urbanfactory.com",
    openingHours: {
      thursday: "21:00-04:00",
      friday: "21:00-05:00",
      saturday: "21:00-05:00"
    },
    features: ["Scène Hip-Hop", "Graffiti Wall", "DJ Booth", "Bar Street Food"],
    hasTableReservation: true
  },
  {
    id: 3,
    userId: 8, // jazz_club_lyon
    name: "Jazz Club Lyon",
    city: "Lyon",
    country: "France",
    address: "15 Rue du Jazz, 69001 Lyon",
    latitude: "45.7640",
    longitude: "4.8357",
    capacity: 150,
    description: "Cadre intimiste dédié au jazz sous toutes ses formes. Concerts live et ambiance chaleureuse garantis.",
    profileImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    rating: "4.8",
    reviewCount: 156,
    category: "Jazz Club",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop",
    featured: false,
    instagram: "@jazzclublyon",
    website: "https://jazzclub-lyon.com",
    openingHours: {
      tuesday: "19:00-23:00",
      wednesday: "19:00-23:00",
      thursday: "19:00-00:00",
      friday: "19:00-01:00",
      saturday: "19:00-01:00"
    },
    features: ["Scène Live", "Cave à Vins", "Ambiance Intimiste", "Acoustique Premium"],
    hasTableReservation: false
  }
];

// Données fictives pour les participants aux événements
export const mockEventParticipants: EventParticipant[] = [
  // Événement 1: Festival Électronique Nocturne (650 participants)
  { eventId: 1, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-16T09:00:00") },
  { eventId: 1, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-16T10:30:00") },
  { eventId: 1, userId: 3, status: "cancel", joinedAt: new Date("2024-01-17T14:15:00") },
  { eventId: 1, userId: 4, status: "pending", joinedAt: new Date("2024-01-18T11:20:00") },
  { eventId: 1, userId: 5, status: "confirmed", joinedAt: new Date("2024-01-19T16:45:00") },
  { eventId: 1, userId: 6, status: "cancel", joinedAt: new Date("2024-01-20T08:30:00") },
  { eventId: 1, userId: 7, status: "pending", joinedAt: new Date("2024-01-21T13:10:00") },
  { eventId: 1, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-22T17:25:00") },

  // Événement 2: Concert Jazz Intime (120 participants)
  { eventId: 2, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-11T15:00:00") },
  { eventId: 2, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-12T10:20:00") },
  { eventId: 2, userId: 3, status: "pending", joinedAt: new Date("2024-01-13T14:35:00") },
  { eventId: 2, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-14T11:45:00") },
  { eventId: 2, userId: 5, status: "cancel", joinedAt: new Date("2024-01-15T09:15:00") },
  { eventId: 2, userId: 6, status: "pending", joinedAt: new Date("2024-01-16T16:30:00") },

  // Événement 3: Soirée Hip-Hop Underground (280 participants)
  { eventId: 3, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-09T12:00:00") },
  { eventId: 3, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-09T13:25:00") },
  { eventId: 3, userId: 3, status: "confirmed", joinedAt: new Date("2024-01-10T10:40:00") },
  { eventId: 3, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-10T15:55:00") },
  { eventId: 3, userId: 5, status: "pending", joinedAt: new Date("2024-01-11T11:10:00") },
  { eventId: 3, userId: 6, status: "confirmed", joinedAt: new Date("2024-01-12T14:20:00") },
  { eventId: 3, userId: 7, status: "confirmed", joinedAt: new Date("2024-01-13T17:35:00") },
  { eventId: 3, userId: 8, status: "pending", joinedAt: new Date("2024-01-14T09:50:00") },

  // Événement 4: Festival Rock Indépendant (1800 participants)
  { eventId: 4, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-06T08:00:00") },
  { eventId: 4, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-06T09:30:00") },
  { eventId: 4, userId: 3, status: "confirmed", joinedAt: new Date("2024-01-07T11:45:00") },
  { eventId: 4, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-07T14:15:00") },
  { eventId: 4, userId: 5, status: "pending", joinedAt: new Date("2024-01-08T10:20:00") },
  { eventId: 4, userId: 6, status: "confirmed", joinedAt: new Date("2024-01-08T16:40:00") },
  { eventId: 4, userId: 7, status: "confirmed", joinedAt: new Date("2024-01-09T13:25:00") },
  { eventId: 4, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-10T12:10:00") },

  // Événement 5: Soirée Classique & Vin (350 participants)
  { eventId: 5, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-13T14:00:00") },
  { eventId: 5, userId: 2, status: "pending", joinedAt: new Date("2024-01-14T10:30:00") },
  { eventId: 5, userId: 3, status: "confirmed", joinedAt: new Date("2024-01-15T11:45:00") },
  { eventId: 5, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-16T15:20:00") },
  { eventId: 5, userId: 5, status: "confirmed", joinedAt: new Date("2024-01-17T09:35:00") },
  { eventId: 5, userId: 6, status: "pending", joinedAt: new Date("2024-01-18T13:50:00") },
  { eventId: 5, userId: 7, status: "confirmed", joinedAt: new Date("2024-01-19T16:25:00") },
  { eventId: 5, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-20T12:40:00") },

  // Événement 6: Rave Techno Mystique (480 participants)
  { eventId: 6, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-08T11:00:00") },
  { eventId: 6, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-09T14:30:00") },
  { eventId: 6, userId: 3, status: "pending", joinedAt: new Date("2024-01-10T10:15:00") },
  { eventId: 6, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-11T13:45:00") },
  { eventId: 6, userId: 5, status: "confirmed", joinedAt: new Date("2024-01-12T16:20:00") },
  { eventId: 6, userId: 6, status: "confirmed", joinedAt: new Date("2024-01-13T09:35:00") },
  { eventId: 6, userId: 7, status: "pending", joinedAt: new Date("2024-01-14T12:50:00") },
  { eventId: 6, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-15T15:25:00") },

  // Événement 7: Soirée Pop (350 participants)
  { eventId: 7, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-13T10:00:00") },
  { eventId: 7, userId: 2, status: "pending", joinedAt: new Date("2024-01-14T11:30:00") },
  { eventId: 7, userId: 3, status: "confirmed", joinedAt: new Date("2024-01-15T14:45:00") },
  { eventId: 7, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-16T16:20:00") },
  { eventId: 7, userId: 5, status: "confirmed", joinedAt: new Date("2024-01-17T09:35:00") },
  { eventId: 7, userId: 6, status: "pending", joinedAt: new Date("2024-01-18T13:50:00") },
  { eventId: 7, userId: 7, status: "confirmed", joinedAt: new Date("2024-01-19T15:25:00") },
  { eventId: 7, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-20T12:40:00") },

  // Événement 8: Soirée Reggae (480 participants)
  { eventId: 8, userId: 1, status: "confirmed", joinedAt: new Date("2024-01-08T10:00:00") },
  { eventId: 8, userId: 2, status: "confirmed", joinedAt: new Date("2024-01-09T13:30:00") },
  { eventId: 8, userId: 3, status: "pending", joinedAt: new Date("2024-01-10T11:15:00") },
  { eventId: 8, userId: 4, status: "confirmed", joinedAt: new Date("2024-01-11T14:45:00") },
  { eventId: 8, userId: 5, status: "confirmed", joinedAt: new Date("2024-01-12T17:20:00") },
  { eventId: 8, userId: 6, status: "confirmed", joinedAt: new Date("2024-01-13T08:35:00") },
  { eventId: 8, userId: 7, status: "pending", joinedAt: new Date("2024-01-14T12:50:00") },
  { eventId: 8, userId: 8, status: "confirmed", joinedAt: new Date("2024-01-15T16:25:00") }
];

// Autre
// ======================
// DONNÉES COMPLÉMENTAIRES POUR TOUTES LES TABLES LIÉES AUX ÉVÉNEMENTS
// ======================

// Données pour artistPortfolios
export const mockArtistPortfolios: ArtistPortfolio[] = [
  {
    id: 1,
    artistId: 1,
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop",
    title: "Live at Techno Festival 2024",
    createdAt: new Date("2024-01-10T10:00:00")
  },
  {
    id: 2,
    artistId: 1,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
    title: "Studio Session - New Album",
    createdAt: new Date("2024-01-15T14:30:00")
  },
  {
    id: 3,
    artistId: 2,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    title: "Jazz Club Performance",
    createdAt: new Date("2024-01-12T16:00:00")
  },
  {
    id: 4,
    artistId: 3,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Hip-Hop Battle Champion",
    createdAt: new Date("2024-01-08T11:20:00")
  },
  {
    id: 5,
    artistId: 4,
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop",
    title: "Rock Festival Headline",
    createdAt: new Date("2024-01-05T09:45:00")
  }
];

// Données pour clubLocations
export const mockClubLocations: ClubLocation[] = [
  {
    id: 1,
    clubId: 1,
    name: "Salle Principale",
    description: "Espace principal avec piste de dance et scène",
    createdAt: new Date("2024-01-01T10:00:00"),
    updatedAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 2,
    clubId: 1,
    name: "Terrasse VIP",
    description: "Terrasse privative avec vue sur Paris",
    createdAt: new Date("2024-01-01T10:00:00"),
    updatedAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 3,
    clubId: 2,
    name: "Main Room",
    description: "Scène hip-hop principale",
    createdAt: new Date("2024-01-01T10:00:00"),
    updatedAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 4,
    clubId: 3,
    name: "Jazz Lounge",
    description: "Salon intimiste dédié au jazz",
    createdAt: new Date("2024-01-01T10:00:00"),
    updatedAt: new Date("2024-01-01T10:00:00")
  }
];

// Données pour clubTables
export const mockClubTables: ClubTable[] = [
  {
    id: 1,
    clubId: 1,
    name: "Table VIP 1",
    capacity: 6,
    price: "300.00",
    available: true,
    description: "Table VIP au premier rang face à la scène",
    createdAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 2,
    clubId: 1,
    name: "Table VIP 2",
    capacity: 4,
    price: "200.00",
    available: false,
    description: "Table VIP côté piste de dance",
    createdAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 3,
    clubId: 2,
    name: "Booth Hip-Hop",
    capacity: 8,
    price: "150.00",
    available: true,
    description: "Booth style hip-hop avec vue sur scène",
    createdAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 4,
    clubId: 3,
    name: "Table Jazz Intime",
    capacity: 2,
    price: "80.00",
    available: true,
    description: "Table romantique près de la scène",
    createdAt: new Date("2024-01-01T10:00:00")
  }
];

// Données pour eventReservedTables
export const mockEventReservedTables: EventReservedTable[] = [
  { eventId: 1, tableId: 1, reservedAt: new Date("2024-01-20T10:00:00") },
  { eventId: 1, tableId: 2, reservedAt: new Date("2024-01-20T10:00:00") },
  { eventId: 5, tableId: 4, reservedAt: new Date("2024-01-14T15:00:00") },
  { eventId: 7, tableId: 3, reservedAt: new Date("2024-01-22T10:00:00") }
];

// Données pour ticketTypes
export const mockTicketTypes = [
  {
    id: 1,
    eventId: 1,
    name: "Early Bird",
    price: "35.00",
    capacity: 100,
    description: "Billet early bird - entrée avant minuit"
  },
  {
    id: 2,
    eventId: 1,
    name: "Standard",
    price: "45.00",
    capacity: 500,
    description: "Billet standard"
  },
  {
    id: 3,
    eventId: 1,
    name: "VIP",
    price: "75.00",
    capacity: 200,
    description: "Accès VIP avec consommations offertes"
  },
  {
    id: 4,
    eventId: 2,
    name: "Place Assise",
    price: "25.00",
    capacity: 100,
    description: "Place assise numérotée"
  },
  {
    id: 5,
    eventId: 2,
    name: "Place Debout",
    price: "20.00",
    capacity: 50,
    description: "Place debout au bar"
  },
  {
    id: 6,
    eventId: 3,
    name: "General Admission",
    price: "20.00",
    capacity: 300,
    description: "Accès général"
  }
];

// Données pour tickets
export const mockTickets = [
  {
    id: 1,
    eventId: 1,
    userId: 1,
    ticketTypeId: 1,
    price: "35.00",
    purchasedAt: new Date("2024-01-16T09:00:00"),
    status: "purchased"
  },
  {
    id: 2,
    eventId: 1,
    userId: 2,
    ticketTypeId: 2,
    price: "45.00",
    purchasedAt: new Date("2024-01-16T10:30:00"),
    status: "purchased"
  },
  {
    id: 3,
    eventId: 1,
    userId: 5,
    ticketTypeId: 3,
    price: "75.00",
    purchasedAt: new Date("2024-01-19T16:45:00"),
    status: "used"
  },
  {
    id: 4,
    eventId: 2,
    userId: 1,
    ticketTypeId: 4,
    price: "25.00",
    purchasedAt: new Date("2024-01-11T15:00:00"),
    status: "purchased"
  },
  {
    id: 5,
    eventId: 2,
    userId: 2,
    ticketTypeId: 5,
    price: "20.00",
    purchasedAt: new Date("2024-01-12T10:20:00"),
    status: "refunded"
  },
  {
    id: 6,
    eventId: 3,
    userId: 1,
    ticketTypeId: 6,
    price: "20.00",
    purchasedAt: new Date("2024-01-09T12:00:00"),
    status: "used"
  }
];

// Données pour feedback
export const mockFeedback = [
  {
    id: 1,
    reviewerId: 1,
    sourceType: "event",
    sourceId: 1,
    title: "Incroyable soirée !",
    rating: 5,
    comment: "L'ambiance était électrique, les DJs au top. Je reviendrai !",
    reply: "Merci pour votre retour ! Ravi que vous ayez passé une bonne soirée.",
    sourceName: "Festival Électronique Nocturne",
    likesCount: 12,
    commentsCount: 3,
    createdAt: new Date("2024-01-26T10:00:00")
  },
  {
    id: 2,
    reviewerId: 2,
    sourceType: "artist",
    sourceId: 1,
    title: "DJ exceptionnel",
    rating: 5,
    comment: "DJ ElectroWave a assuré une set incroyable, technique et énergie au rendez-vous.",
    reply: null,
    sourceName: "DJ ElectroWave",
    likesCount: 8,
    commentsCount: 1,
    createdAt: new Date("2024-01-25T14:30:00")
  },
  {
    id: 3,
    reviewerId: 3,
    sourceType: "club",
    sourceId: 1,
    title: "Super club",
    rating: 4,
    comment: "Cadre magnifique, bon sound system. Un peu cher sur les consommations.",
    reply: "Merci pour votre retour. Nous revoyons nos tarifs bar.",
    sourceName: "Le Palace Paris",
    likesCount: 5,
    commentsCount: 2,
    createdAt: new Date("2024-01-24T16:45:00")
  },
  {
    id: 4,
    reviewerId: 4,
    sourceType: "event",
    sourceId: 2,
    title: "Moment jazz magique",
    rating: 5,
    comment: "Concert intimiste de grande qualité. Les musiciens étaient inspirés.",
    reply: null,
    sourceName: "Concert Jazz Intime",
    likesCount: 6,
    commentsCount: 0,
    createdAt: new Date("2024-01-23T11:20:00")
  }
];

// Données pour feedbackLikes
export const mockFeedbackLikes = [
  { feedbackId: 1, userId: 2, likedAt: new Date("2024-01-26T11:00:00") },
  { feedbackId: 1, userId: 3, likedAt: new Date("2024-01-26T12:30:00") },
  { feedbackId: 1, userId: 4, likedAt: new Date("2024-01-26T14:15:00") },
  { feedbackId: 2, userId: 1, likedAt: new Date("2024-01-25T15:45:00") },
  { feedbackId: 2, userId: 5, likedAt: new Date("2024-01-25T16:20:00") },
  { feedbackId: 3, userId: 2, likedAt: new Date("2024-01-24T17:30:00") }
];

// Données pour feedbackComments
export const mockFeedbackComments = [
  {
    id: 1,
    feedbackId: 1,
    userId: 2,
    content: "Tout à fait d'accord, c'était mythique !",
    createdAt: new Date("2024-01-26T11:30:00")
  },
  {
    id: 2,
    feedbackId: 1,
    userId: 3,
    content: "Quel DJ vous avez préféré ?",
    createdAt: new Date("2024-01-26T13:00:00")
  },
  {
    id: 3,
    feedbackId: 1,
    userId: 1,
    content: "DJ ElectroWave était incroyable !",
    createdAt: new Date("2024-01-26T14:00:00")
  },
  {
    id: 4,
    feedbackId: 2,
    userId: 4,
    content: "Son dernier album est excellent aussi",
    createdAt: new Date("2024-01-25T16:00:00")
  }
];

// Données pour photos
export const mockPhotos = [
  {
    id: 1,
    userId: 1,
    eventId: 1,
    title: "Ambiance folle au Palace",
    description: "La foule en délire pendant le set de minuit",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=150&fit=crop",
    tags: ["techno", "crowd", "night"],
    likesCount: 45,
    commentsCount: 8,
    uploadedAt: new Date("2024-01-26T02:30:00")
  },
  {
    id: 2,
    userId: 2,
    eventId: 1,
    title: "DJ ElectroWave en action",
    description: "Le maître aux platines",
    url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=150&fit=crop",
    tags: ["dj", "performance", "electronic"],
    likesCount: 32,
    commentsCount: 5,
    uploadedAt: new Date("2024-01-26T01:45:00")
  },
  {
    id: 3,
    userId: 3,
    eventId: 2,
    title: "Moment jazz intimiste",
    description: "Le trio en pleine performance",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=150&fit=crop",
    tags: ["jazz", "live", "intimate"],
    likesCount: 28,
    commentsCount: 3,
    uploadedAt: new Date("2024-01-19T21:15:00")
  },
  {
    id: 4,
    userId: 4,
    eventId: 3,
    title: "Battle hip-hop endiablée",
    description: "Les MCs s'affrontent sur scène",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop",
    tags: ["hiphop", "battle", "urban"],
    likesCount: 36,
    commentsCount: 6,
    uploadedAt: new Date("2024-01-11T23:30:00")
  }
];

// Données pour photoLikes
export const mockPhotoLikes = [
  { photoId: 1, userId: 2, likedAt: new Date("2024-01-26T03:00:00") },
  { photoId: 1, userId: 3, likedAt: new Date("2024-01-26T03:15:00") },
  { photoId: 1, userId: 4, likedAt: new Date("2024-01-26T04:30:00") },
  { photoId: 2, userId: 1, likedAt: new Date("2024-01-26T02:00:00") },
  { photoId: 2, userId: 5, likedAt: new Date("2024-01-26T02:45:00") },
  { photoId: 3, userId: 2, likedAt: new Date("2024-01-19T22:00:00") },
  { photoId: 4, userId: 1, likedAt: new Date("2024-01-12T00:15:00") }
];

// Données pour photoComments
export const mockPhotoComments = [
  {
    id: 1,
    photoId: 1,
    userId: 2,
    content: "Wow quelle ambiance ! J'aurais aimé y être",
    createdAt: new Date("2024-01-26T03:05:00")
  },
  {
    id: 2,
    photoId: 1,
    userId: 3,
    content: "Incroyable cette foule !",
    createdAt: new Date("2024-01-26T03:20:00")
  },
  {
    id: 3,
    photoId: 2,
    userId: 4,
    content: "DJ ElectroWave toujours au top 👏",
    createdAt: new Date("2024-01-26T02:10:00")
  },
  {
    id: 4,
    photoId: 3,
    userId: 1,
    content: "Superbe capture d'ambiance",
    createdAt: new Date("2024-01-19T22:30:00")
  }
];

// Données pour collaborationMilestones
export const mockCollaborationMilestones = [
  {
    id: 1,
    invitationId: 1,
    title: "Signature du contrat",
    description: "Finalisation et signature du contrat de prestation",
    status: "completed",
    assignedTo: "both",
    priority: "high",
    dueDate: new Date("2024-01-25T00:00:00"),
    completedAt: new Date("2024-01-22T14:00:00"),
    createdAt: new Date("2024-01-20T10:00:00")
  },
  {
    id: 2,
    invitationId: 1,
    title: "Répétition technique",
    description: "Test du matériel et soundcheck",
    status: "in_progress",
    assignedTo: "both",
    priority: "medium",
    dueDate: new Date("2024-12-24T18:00:00"),
    completedAt: null,
    createdAt: new Date("2024-01-20T10:00:00")
  },
  {
    id: 3,
    invitationId: 5,
    title: "Négociation cachet",
    description: "Discussion sur les conditions financières",
    status: "in_progress",
    assignedTo: "both",
    priority: "high",
    dueDate: new Date("2024-02-01T00:00:00"),
    completedAt: null,
    createdAt: new Date("2024-01-25T14:30:00")
  },
  {
    id: 4,
    invitationId: 8,
    title: "Répétitions musicales",
    description: "Séances de répétition avec les autres musiciens",
    status: "completed",
    assignedTo: "artist",
    priority: "medium",
    dueDate: new Date("2024-11-15T00:00:00"),
    completedAt: new Date("2024-01-20T16:00:00"),
    createdAt: new Date("2024-01-14T15:00:00")
  }
];

// Données pour collaborationMessages
export const mockCollaborationMessages = [
  {
    id: 1,
    invitationId: 1,
    senderType: "club",
    senderId: 1,
    content: "Bonjour, nous confirmons votre booking pour le 25 décembre. Le contrat est en préparation.",
    createdAt: new Date("2024-01-20T10:05:00")
  },
  {
    id: 2,
    invitationId: 1,
    senderType: "artist",
    senderId: 1,
    content: "Parfait, j'attends le contrat. Quel est l'horaire de soundcheck prévu ?",
    createdAt: new Date("2024-01-20T11:30:00")
  },
  {
    id: 3,
    invitationId: 1,
    senderType: "club",
    senderId: 1,
    content: "Le soundcheck est prévu à 18h. Nous vous enverrons les détails techniques la veille.",
    createdAt: new Date("2024-01-20T14:15:00")
  },
  {
    id: 4,
    invitationId: 5,
    senderType: "club",
    senderId: 1,
    content: "Nous proposons 1200€ pour votre set de 2h. Qu'en pensez-vous ?",
    createdAt: new Date("2024-01-25T14:35:00")
  },
  {
    id: 5,
    invitationId: 5,
    senderType: "artist",
    senderId: 7,
    content: "Merci pour l'offre. Mon cachet habituel est de 1500€ pour ce type d'événement.",
    createdAt: new Date("2024-01-25T16:20:00")
  }
];

// Données pour transactions
export const mockTransactions = [
  {
    id: 1,
    userId: 1,
    amount: "35.00",
    type: "debit",
    status: "completed",
    description: "Achat billet Early Bird - Festival Électronique Nocturne",
    reference: "TICKET_001",
    createdAt: new Date("2024-01-16T09:00:00")
  },
  {
    id: 2,
    userId: 2,
    amount: "45.00",
    type: "debit",
    status: "completed",
    description: "Achat billet Standard - Festival Électronique Nocturne",
    reference: "TICKET_002",
    createdAt: new Date("2024-01-16T10:30:00")
  },
  {
    id: 3,
    userId: 5,
    amount: "75.00",
    type: "debit",
    status: "completed",
    description: "Achat billet VIP - Festival Électronique Nocturne",
    reference: "TICKET_003",
    createdAt: new Date("2024-01-19T16:45:00")
  },
  {
    id: 4,
    userId: 1,
    amount: "25.00",
    type: "debit",
    status: "completed",
    description: "Achat billet Concert Jazz Intime",
    reference: "TICKET_004",
    createdAt: new Date("2024-01-11T15:00:00")
  },
  {
    id: 5,
    userId: 2,
    amount: "20.00",
    type: "credit",
    status: "completed",
    description: "Remboursement billet Concert Jazz Intime",
    reference: "REFUND_001",
    createdAt: new Date("2024-01-13T11:00:00")
  },
  {
    id: 6,
    userId: 1,
    amount: "1500.00",
    type: "credit",
    status: "completed",
    description: "Cachet DJ ElectroWave - Festival Électronique Nocturne",
    reference: "ARTIST_001",
    createdAt: new Date("2024-01-23T09:00:00")
  }
];

// Données pour customerProfiles
export const mockCustomerProfiles = [
  {
    id: 1,
    userId: 1,
    preferences: {
      favoriteGenres: ["Electronic", "Techno", "House"],
      preferredLocations: ["Paris", "Lyon"],
      budgetRange: { min: 20, max: 100 },
      notificationTypes: ["new_events", "artist_updates"]
    },
    visitHistory: [
      { eventId: 1, date: "2024-12-25", rating: 5 },
      { eventId: 2, date: "2024-11-18", rating: 4 }
    ]
  },
  {
    id: 2,
    userId: 2,
    preferences: {
      favoriteGenres: ["Jazz", "Classical"],
      preferredLocations: ["Lyon", "Bordeaux"],
      budgetRange: { min: 15, max: 60 },
      notificationTypes: ["new_events"]
    },
    visitHistory: [
      { eventId: 2, date: "2024-11-18", rating: 5 },
      { eventId: 5, date: "2024-11-22", rating: 4 }
    ]
  },
  {
    id: 3,
    userId: 3,
    preferences: {
      favoriteGenres: ["Hip-Hop", "Rap", "Urban"],
      preferredLocations: ["Marseille", "Paris"],
      budgetRange: { min: 10, max: 40 },
      notificationTypes: ["artist_updates", "promotions"]
    },
    visitHistory: [
      { eventId: 3, date: "2024-12-10", rating: 5 },
      { eventId: 1, date: "2024-12-25", rating: 4 }
    ]
  }
];

// Données pour musicGenres
export const mockMusicGenres = [
  { id: 1, name: "Electronic", description: "Musique électronique et dance" },
  { id: 2, name: "Techno", description: "Techno et musiques électroniques underground" },
  { id: 3, name: "House", description: "House music et dérivés" },
  { id: 4, name: "Jazz", description: "Jazz traditionnel et moderne" },
  { id: 5, name: "Hip-Hop", description: "Hip-hop, rap et culture urbaine" },
  { id: 6, name: "Rock", description: "Rock, indie et musiques alternatives" },
  { id: 7, name: "Pop", description: "Musique pop mainstream" },
  { id: 8, name: "Classical", description: "Musique classique et orchestrale" },
  { id: 9, name: "Reggae", description: "Reggae, dub et musiques jamaïcaines" }
];

// Données pour drinkTypes
export const mockDrinkTypes = [
  { id: 1, name: "Bière pression", category: "Bières", price: "6.00" },
  { id: 2, name: "Bière bouteille", category: "Bières", price: "7.00" },
  { id: 3, name: "Vin rouge", category: "Vins", price: "8.00" },
  { id: 4, name: "Vin blanc", category: "Vins", price: "8.00" },
  { id: 5, name: "Champagne", category: "Vins", price: "12.00" },
  { id: 6, name: "Whisky", category: "Spiritueux", price: "10.00" },
  { id: 7, name: "Vodka", category: "Spiritueux", price: "9.00" },
  { id: 8, name: "Cocktail signature", category: "Cocktails", price: "14.00" },
  { id: 9, name: "Soft drink", category: "Softs", price: "4.00" },
  { id: 10, name: "Eau minérale", category: "Softs", price: "3.00" }
];

// Données pour customerTags
export const mockCustomerTags = [
  { customerId: 1, tag: "techno_lover" },
  { customerId: 1, tag: "early_adopter" },
  { customerId: 2, tag: "jazz_enthusiast" },
  { customerId: 2, tag: "premium_customer" },
  { customerId: 3, tag: "hiphop_fan" },
  { customerId: 3, tag: "urban_culture" }
];

// Données pour promotions
export const mockPromotions = [
  {
    id: 1,
    eventId: 1,
    clubId: null,
    title: "Early Bird -25%",
    description: "Billets early bird à prix réduit",
    discountType: "percentage",
    discountValue: "25.00",
    status: "active",
    channels: ["email", "app", "social"],
    validFrom: new Date("2024-01-15T00:00:00"),
    validTo: new Date("2024-02-15T23:59:59"),
    createdAt: new Date("2024-01-15T10:00:00")
  },
  {
    id: 2,
    eventId: null,
    clubId: 1,
    title: "Première visite -10%",
    description: "Réduction pour les nouveaux clients",
    discountType: "percentage",
    discountValue: "10.00",
    status: "active",
    channels: ["app", "website"],
    validFrom: new Date("2024-01-01T00:00:00"),
    validTo: new Date("2024-12-31T23:59:59"),
    createdAt: new Date("2024-01-01T00:00:00")
  },
  {
    id: 3,
    eventId: 3,
    clubId: null,
    title: "Offre groupe -15%",
    description: "Réduction pour les groupes de 4 personnes ou plus",
    discountType: "percentage",
    discountValue: "15.00",
    status: "active",
    channels: ["app", "social"],
    validFrom: new Date("2024-01-08T00:00:00"),
    validTo: new Date("2024-12-05T23:59:59"),
    createdAt: new Date("2024-01-08T09:15:00")
  }
];

// Données pour paymentMethods
export const mockPaymentMethods = [
  {
    id: 1,
    userId: 1,
    type: "card",
    details: {
      brand: "Visa",
      last4: "4242",
      expiry: "12/25"
    },
    isDefault: true,
    createdAt: new Date("2024-01-01T10:00:00")
  },
  {
    id: 2,
    userId: 2,
    type: "card",
    details: {
      brand: "Mastercard",
      last4: "8888",
      expiry: "08/26"
    },
    isDefault: true,
    createdAt: new Date("2024-01-02T14:30:00")
  },
  {
    id: 3,
    userId: 1,
    type: "bank",
    details: {
      bank: "BNP Paribas",
      iban: "FR76************1234"
    },
    isDefault: false,
    createdAt: new Date("2024-01-10T16:45:00")
  }
];

// Données pour invoices
export const mockInvoices = [
  {
    id: 1,
    userId: 1,
    transactionId: 1,
    amount: "35.00",
    status: "paid",
    dueDate: new Date("2024-01-16T00:00:00"),
    paidAt: new Date("2024-01-16T09:00:00"),
    createdAt: new Date("2024-01-16T09:00:00")
  },
  {
    id: 2,
    userId: 2,
    transactionId: 2,
    amount: "45.00",
    status: "paid",
    dueDate: new Date("2024-01-16T00:00:00"),
    paidAt: new Date("2024-01-16T10:30:00"),
    createdAt: new Date("2024-01-16T10:30:00")
  },
  {
    id: 3,
    userId: 1,
    transactionId: 6,
    amount: "1500.00",
    status: "paid",
    dueDate: new Date("2024-01-30T00:00:00"),
    paidAt: new Date("2024-01-23T09:00:00"),
    createdAt: new Date("2024-01-23T09:00:00")
  }
];



// liaison schema
// Données complémentaires 
export const mockTicketTypes: TicketType[] = [
export const mockTickets: Ticket[] = [
export const mockFeedback: Feedback[] = [
export const mockFeedbackLikes: FeedbackLike[] = [
export const mockFeedbackComments: FeedbackComment[] = [
export const mockPhotos: Photo[] = [
export const mockPhotoLikes: PhotoLike[] = [
export const mockPhotoComments: PhotoComment[] = [
export const mockCollaborationMilestones: CollaborationMilestone[] = [
export const mockCollaborationMessages: CollaborationMessage[] = [
export const mockTransactions: Transaction[] = [
export const mockCustomerProfiles: CustomerProfile[] = [
export const mockMusicGenres: MusicGenre[] = [
export const mockDrinkTypes: DrinkType[] = [
export const mockCustomerTags: CustomerTag[] = [
export const mockPromotions: Promotion[] = [
export const mockPaymentMethods: PaymentMethod[] = [
export const mockInvoices: Invoice[] = [