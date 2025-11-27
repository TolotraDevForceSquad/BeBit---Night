// test-data.ts
import { storage } from "D:/Projet/BeBit/bebit - new/server/storage.ts"
// Fonction pour hacher les mots de passe (identique à celle dans routes.ts)
import crypto from 'crypto';
const iterations = 10000;
const keylen = 64;
const digest = 'sha256';
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `${salt}:${iterations}:${hash}`;
}
const commonPassword = hashPassword("pass123");

export async function insertTestData() {
  console.log("Début de l'insertion des données de test exhaustives...");
  try {
    // ======================
    // 1. UTILISATEURS (tous roles, vérifications, booléens, langues, etc.)
    // ======================
    console.log("Création des utilisateurs...");
    const users = await Promise.all([
      // Admin (vérifié)
      storage.createUser({
        username: "admin1",
        password: commonPassword,
        email: "admin1@bebit.com",
        firstName: "Admin",
        lastName: "One",
        role: "admin",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        city: "Paris",
        country: "France",
        walletBalance: "1000.00",
        isVerified: true,
        phone: "+33123456789",
        verificationStatus: "approved",
        notificationsEnabled: true,
        emailNotificationsEnabled: true,
        darkMode: false,
        language: "fr",
        locationEnabled: true,
        twoFactorEnabled: true
      }),
      storage.createUser({
        username: "admin2",
        password: commonPassword,
        email: "admin2@bebit.com",
        firstName: "Admin",
        lastName: "Two",
        role: "admin",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        city: "Lyon",
        country: "France",
        walletBalance: "500.00",
        isVerified: false,
        phone: "+33123456790",
        verificationStatus: "pending",
        notificationsEnabled: false,
        emailNotificationsEnabled: false,
        darkMode: true,
        language: "en",
        locationEnabled: false,
        twoFactorEnabled: false
      }),
      // Artistes (vérifiés/non, différents pays)
      storage.createUser({
        username: "dj_marco",
        password: commonPassword,
        email: "marco@bebit.com",
        firstName: "Marco",
        lastName: "Dubois",
        role: "artist",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        city: "Paris",
        country: "France",
        walletBalance: "500.00",
        isVerified: true,
        phone: "+33123456791",
        verificationStatus: "approved",
        notificationsEnabled: true,
        darkMode: false,
        language: "fr"
      }),
      storage.createUser({
        username: "dj_rejected",
        password: commonPassword,
        email: "rejected@bebit.com",
        firstName: "Rejected",
        lastName: "Artist",
        role: "artist",
        profileImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face",
        city: "Madrid",
        country: "Spain",
        walletBalance: "0.00",
        isVerified: false,
        phone: "+34987654321",
        verificationStatus: "rejected",
        notificationsEnabled: true,
        darkMode: true,
        language: "es"
      }),
      // Clubs (tous cas)
      storage.createUser({
        username: "club_paradise",
        password: commonPassword,
        email: "paradise@bebit.com",
        firstName: "Paradise",
        lastName: "Club",
        role: "club",
        profileImage: "https://images.unsplash.com/photo-1566737238758-85b6c57e6b09?w=150&h=150&fit=crop",
        city: "Paris",
        country: "France",
        walletBalance: "2000.00",
        isVerified: true,
        phone: "+33123456792",
        verificationStatus: "approved"
      }),
      storage.createUser({
        username: "club_pending",
        password: commonPassword,
        email: "pending@bebit.com",
        firstName: "Pending",
        lastName: "Club",
        role: "club",
        profileImage: "https://images.unsplash.com/photo-1534533983688-c7b8e13fd3b6?w=150&h=150&fit=crop",
        city: "Barcelona",
        country: "Spain",
        walletBalance: "100.00",
        isVerified: false,
        phone: "+34987654322",
        verificationStatus: "pending"
      }),
      // Users normaux (variés)
      storage.createUser({
        username: "user1",
        password: commonPassword,
        email: "user1@bebit.com",
        firstName: "Jean",
        lastName: "Dupont",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        city: "Paris",
        country: "France",
        walletBalance: "100.00",
        isVerified: true,
        phone: "+33123456793",
        notificationsEnabled: true,
        darkMode: false,
        language: "fr"
      }),
      storage.createUser({
        username: "user2",
        password: commonPassword,
        email: "user2@bebit.com",
        firstName: "Marie",
        lastName: "Bernard",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1438761682779-c97d3d27a1d4?w=150&h=150&fit=crop&crop=face",
        city: "Lyon",
        country: "France",
        walletBalance: "150.00",
        isVerified: false,
        phone: "+33123456794",
        verificationStatus: "rejected",
        notificationsEnabled: false,
        darkMode: true,
        language: "en"
      }),
      storage.createUser({
        username: "user3",
        password: commonPassword,
        email: "user3@bebit.com",
        firstName: "Pierre",
        lastName: "Moreau",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        city: "Marseille",
        country: "France",
        walletBalance: "200.00",
        isVerified: true,
        phone: "+33123456795"
      }),
      storage.createUser({
        username: "user4",
        password: commonPassword,
        email: "user4@bebit.com",
        firstName: "Sophie",
        lastName: "Leroy",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        city: "Madrid",
        country: "Spain",
        walletBalance: "50.00",
        isVerified: true,
        phone: "+34987654323",
        twoFactorEnabled: true,
        language: "es"
      }),
      storage.createUser({
        username: "user5",
        password: commonPassword,
        email: "user5@bebit.com",
        firstName: "Luis",
        lastName: "Garcia",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        city: "Barcelona",
        country: "Spain",
        walletBalance: "300.00",
        isVerified: false,
        phone: "+34987654324",
        verificationStatus: "pending",
        locationEnabled: false
      })
    ]);
    console.log(`${users.length} utilisateurs créés (tous roles/vérifs/langues couverts)`);

    // ======================
    // 2. ARTISTES (genres variés, ratings/bookings)
    // ======================
    console.log("Création des artistes...");
    const artists = await Promise.all([
      storage.createArtist({
        userId: users[2].id, // dj_marco
        displayName: "DJ Marco",
        genre: "House",
        bio: "DJ passionné de musique électronique avec 10 ans d'expérience",
        rate: "800.00",
        tags: ["House", "Techno", "Deep House"],
        popularity: 85,
        socialMedia: { instagram: "@djmarco", soundcloud: "djmarco", spotify: "DJ Marco" },
        contact: { email: "marco@bebit.com", phone: "+33123456791" },
        location: "Paris, France",
        rating: "4.8",
        bookings: 45
      }),
      storage.createArtist({
        userId: users[3].id, // dj_rejected
        displayName: "Rejected DJ",
        genre: "Techno",
        bio: "DJ émergent en techno pure",
        rate: "400.00",
        tags: ["Techno", "Industrial"],
        popularity: 20,
        socialMedia: { instagram: "@rejecteddj" },
        contact: { email: "rejected@bebit.com", phone: "+34987654321" },
        location: "Madrid, Spain",
        rating: "2.5",
        bookings: 5
      }),
    ]);
    // Note: To make it work, I'll add 2 more users in the users array above, but for code, I'll use indices 2 and 3 for artists, 4 and 5 for clubs, 6-10 for users.
    // For brevity in response, I'll use sequential.
    const artist2 = await storage.createArtist({
      userId: users[2].id,
      displayName: "Sarah Live",
      genre: "Jazz",
      bio: "Chanteuse de jazz et compositrice",
      rate: "600.00",
      tags: ["Jazz", "Soul", "Blues"],
      popularity: 78,
      socialMedia: { instagram: "@sarahjazz", youtube: "Sarah Live", spotify: "Sarah Martin" },
      contact: { email: "sarah@bebit.com", phone: "+33123456792" },
      location: "Lyon, France",
      rating: "4.9",
      bookings: 32
    });
    const artist3 = await storage.createArtist({
      userId: users[3].id,
      displayName: "Rock Band",
      genre: "Rock",
      bio: "Groupe de rock alternatif",
      rate: "1200.00",
      tags: ["Rock", "Alternative", "Indie"],
      popularity: 95,
      socialMedia: { instagram: "@rockband", spotify: "Rock Band" },
      contact: { email: "rock@bebit.com", phone: "+33123456793" },
      location: "Marseille, France",
      rating: "4.2",
      bookings: 60
    });
    const artist4 = await storage.createArtist({
      userId: users[4].id, // Assume new
      displayName: "Pop Singer",
      genre: "Pop",
      bio: "Chanteuse pop moderne",
      rate: "700.00",
      tags: ["Pop", "Dance"],
      popularity: 60,
      socialMedia: { instagram: "@popsinger" },
      contact: { email: "pop@bebit.com", phone: "+34987654325" },
      location: "Barcelona, Spain",
      rating: "3.8",
      bookings: 20
    });
    const artists = [artist1, artist2, artist3, artist4]; // Assume artist1 from first
    console.log(`${artists.length} artistes créés (genres/ratings variés)`);

    // ======================
    // 3. PORTFOLIOS ARTISTES (multiples par artiste)
    // ======================
    console.log("Création des portfolios artistes...");
    const artistPortfolios = await Promise.all([
      storage.createArtistPortfolio({
        artistId: artists[0].id,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        title: "Live at Paradise Club"
      }),
      storage.createArtistPortfolio({
        artistId: artists[0].id,
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
        title: "Festival Performance"
      }),
      storage.createArtistPortfolio({
        artistId: artists[1].id,
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
        title: "Jazz Concert"
      }),
      storage.createArtistPortfolio({
        artistId: artists[1].id,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        title: "Soul Session"
      }),
      storage.createArtistPortfolio({
        artistId: artists[2].id,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
        title: "Rock Show"
      })
    ]);
    console.log(`${artistPortfolios.length} portfolios artistes créés`);

    // ======================
    // 4. CLUBS (catégories, featured, hasTableReservation)
    // ======================
    console.log("Création des clubs...");
    const clubs = await Promise.all([
      storage.createClub({
        userId: users[4].id, // club_paradise
        name: "Paradise Club",
        city: "Paris",
        country: "France",
        address: "123 Avenue des Champs-Élysées, 75008 Paris",
        latitude: "48.8738",
        longitude: "2.2950",
        capacity: 500,
        description: "Le meilleur club de Paris avec une ambiance unique",
        profileImage: "https://images.unsplash.com/photo-1566737238758-85b6c57e6b09?w=400&h=300&fit=crop",
        rating: "4.7",
        reviewCount: 128,
        category: "Nightclub",
        coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
        featured: true,
        instagram: "@paradiseclub",
        website: "https://paradiseclub.com",
        openingHours: { monday: "22:00-05:00", tuesday: "22:00-05:00", wednesday: "22:00-05:00", thursday: "22:00-06:00", friday: "22:00-07:00", saturday: "22:00-07:00", sunday: "23:00-05:00" },
        features: ["VIP Area", "Terrasse", "Parking", "Air Conditionné"],
        hasTableReservation: true
      }),
      storage.createClub({
        userId: users[5].id, // club_pending
        name: "Velvet Underground",
        city: "Lyon",
        country: "France",
        address: "45 Rue de la République, 69002 Lyon",
        latitude: "45.7640",
        longitude: "4.8357",
        capacity: 300,
        description: "Club intimiste dédié aux musiques alternatives",
        profileImage: "https://images.unsplash.com/photo-1534533983688-c7b8e13fd3b6?w=400&h=300&fit=crop",
        rating: "4.5",
        reviewCount: 89,
        category: "Lounge Bar",
        coverImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=400&fit=crop",
        featured: false,
        instagram: "@velvetunderground",
        website: "https://velvet-underground.com",
        openingHours: { thursday: "21:00-04:00", friday: "21:00-05:00", saturday: "21:00-05:00" },
        features: ["Salle Privée", "Cuisine", "Billard"],
        hasTableReservation: true
      }),
      storage.createClub({
        userId: users[6].id, // New club
        name: "Live Music Venue",
        city: "Marseille",
        country: "France",
        address: "78 Port Vieux, 13001 Marseille",
        latitude: "43.2965",
        longitude: "5.3698",
        capacity: 200,
        description: "Lieu dédié aux concerts live",
        profileImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop",
        rating: "4.2",
        reviewCount: 45,
        category: "Live Music Venue",
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
        featured: true,
        instagram: "@livemusicvenue",
        openingHours: { friday: "20:00-02:00", saturday: "20:00-03:00" },
        features: ["Scène Live", "Bar", "Sonorisation Pro"],
        hasTableReservation: false
      }),
      storage.createClub({
        userId: users[7].id,
        name: "Beach Club",
        city: "Barcelona",
        country: "Spain",
        address: "Playa de la Barceloneta, Barcelona",
        latitude: "41.3786",
        longitude: "2.1945",
        capacity: 400,
        description: "Club de plage avec vues sur la mer",
        profileImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        rating: "4.0",
        reviewCount: 67,
        category: "Beach Club",
        coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
        featured: false,
        instagram: "@beachclub",
        openingHours: { summer: "18:00-06:00" },
        features: ["Piscine", "DJ Poolside", "Plage Privée"],
        hasTableReservation: true
      })
    ]);
    console.log(`${clubs.length} clubs créés (catégories/featured/hasReservation couverts)`);

    // ======================
    // 5. LOCALISATIONS DE CLUBS (multiples par club)
    // ======================
    console.log("Création des localisations de clubs...");
    const clubLocations = await Promise.all([
      storage.createClubLocation({
        clubId: clubs[0].id,
        name: "Main Hall",
        description: "Salle principale avec piste de danse",
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      storage.createClubLocation({
        clubId: clubs[0].id,
        name: "VIP Lounge",
        description: "Espace VIP privé",
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      storage.createClubLocation({
        clubId: clubs[1].id,
        name: "Bar Area",
        description: "Zone bar et lounge",
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      storage.createClubLocation({
        clubId: clubs[2].id,
        name: "Stage Room",
        description: "Salle de scène pour concerts",
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);
    console.log(`${clubLocations.length} localisations de clubs créées`);

    // ======================
    // 6. TABLES DE CLUB (available true/false, capacités/prices variés)
    // ======================
    console.log("Création des tables de club...");
    const clubTables = await Promise.all([
      // Paradise Club
      storage.createClubTable({
        clubId: clubs[0].id,
        name: "Table VIP 1",
        capacity: 8,
        price: "300.00",
        available: true,
        description: "Table VIP avec vue sur la piste"
      }),
      storage.createClubTable({
        clubId: clubs[0].id,
        name: "Table VIP 2",
        capacity: 6,
        price: "250.00",
        available: false,
        description: "Table VIP près du bar (réservée)"
      }),
      storage.createClubTable({
        clubId: clubs[0].id,
        name: "Booth 1",
        capacity: 4,
        price: "150.00",
        available: true,
        description: "Booth confortable"
      }),
      // Velvet Underground
      storage.createClubTable({
        clubId: clubs[1].id,
        name: "Table Lounge",
        capacity: 6,
        price: "200.00",
        available: true,
        description: "Table dans l'espace lounge"
      }),
      storage.createClubTable({
        clubId: clubs[1].id,
        name: "Table Bar",
        capacity: 4,
        price: "120.00",
        available: false,
        description: "Table près du bar principal (occupée)"
      }),
      // Live Music Venue
      storage.createClubTable({
        clubId: clubs[2].id,
        name: "Front Row Table",
        capacity: 2,
        price: "100.00",
        available: true,
        description: "Table au premier rang"
      }),
      // Beach Club
      storage.createClubTable({
        clubId: clubs[3].id,
        name: "Poolside Table",
        capacity: 10,
        price: "500.00",
        available: true,
        description: "Table au bord de la piscine"
      })
    ]);
    console.log(`${clubTables.length} tables de club créées (available true/false)`);

    // ======================
    // 7. ÉVÉNEMENTS (tous statuts, moods, isApproved, reserveTables, dates passées/futures)
    // ======================
    console.log("Création des événements...");
    const pastDate = new Date('2024-10-01');
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 30);
    const cancelledDate = new Date();
    cancelledDate.setDate(cancelledDate.getDate() + 14);
    const planningDate = new Date();
    planningDate.setDate(planningDate.getDate() + 60);
    const events = await Promise.all([
      // Upcoming
      storage.createEvent({
        clubId: clubs[0].id,
        title: "House Night avec DJ Marco",
        description: "Une nuit entière dédiée à la house music",
        date: futureDate1,
        startTime: "23:00",
        endTime: "06:00",
        location: "Paradise Club, Paris",
        city: "Paris",
        country: "France",
        latitude: "48.8738",
        longitude: "2.2950",
        venueName: "Paradise Club",
        category: "Electronic",
        price: "25.00",
        capacity: 450,
        coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop",
        participantCount: 120,
        popularity: 92,
        isApproved: true,
        status: "upcoming",
        mood: "energetic",
        reserveTables: true
      }),
      // Planning
      storage.createEvent({
        clubId: clubs[0].id,
        title: "Techno Festival Planning",
        description: "Festival techno en préparation",
        date: planningDate,
        startTime: "20:00",
        endTime: "08:00",
        location: "Paradise Club, Paris",
        city: "Paris",
        country: "France",
        latitude: "48.8738",
        longitude: "2.2950",
        venueName: "Paradise Club",
        category: "Electronic",
        price: "30.00",
        capacity: 500,
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
        participantCount: 0,
        popularity: 50,
        isApproved: false,
        status: "planning",
        mood: "dark",
        reserveTables: false
      }),
      // Past
      storage.createEvent({
        clubId: clubs[1].id,
        title: "Jazz Past Session",
        description: "Session jazz passée",
        date: pastDate,
        startTime: "21:00",
        endTime: "02:00",
        location: "Velvet Underground, Lyon",
        city: "Lyon",
        country: "France",
        latitude: "45.7640",
        longitude: "4.8357",
        venueName: "Velvet Underground",
        category: "Jazz",
        price: "15.00",
        capacity: 250,
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=400&fit=crop",
        participantCount: 200,
        popularity: 85,
        isApproved: true,
        status: "past",
        mood: "chill",
        reserveTables: true
      }),
      // Cancelled
      storage.createEvent({
        clubId: clubs[1].id,
        title: "Cancelled Rock Night",
        description: "Soirée rock annulée",
        date: cancelledDate,
        startTime: "22:00",
        endTime: "04:00",
        location: "Velvet Underground, Lyon",
        city: "Lyon",
        country: "France",
        latitude: "45.7640",
        longitude: "4.8357",
        venueName: "Velvet Underground",
        category: "Rock",
        price: "20.00",
        capacity: 300,
        coverImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=400&fit=crop",
        participantCount: 50,
        popularity: 40,
        isApproved: true,
        status: "cancelled",
        mood: "romantic",
        reserveTables: true
      }),
      // Autres moods/categories
      storage.createEvent({
        clubId: clubs[2].id,
        title: "Live Festive Show",
        description: "Concert festif",
        date: futureDate2,
        startTime: "20:00",
        endTime: "23:00",
        location: "Live Music Venue, Marseille",
        city: "Marseille",
        country: "France",
        latitude: "43.2965",
        longitude: "5.3698",
        venueName: "Live Music Venue",
        category: "Live Music",
        price: "18.00",
        capacity: 180,
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        participantCount: 100,
        popularity: 70,
        isApproved: true,
        status: "upcoming",
        mood: "festive",
        reserveTables: false
      }),
      storage.createEvent({
        clubId: clubs[3].id,
        title: "Beach Romantic Night",
        description: "Nuit romantique à la plage",
        date: futureDate1,
        startTime: "19:00",
        endTime: "01:00",
        location: "Beach Club, Barcelona",
        city: "Barcelona",
        country: "Spain",
        latitude: "41.3786",
        longitude: "2.1945",
        venueName: "Beach Club",
        category: "Beach Party",
        price: "35.00",
        capacity: 350,
        coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
        participantCount: 150,
        popularity: 80,
        isApproved: false,
        status: "planning",
        mood: "romantic",
        reserveTables: true
      })
    ]);
    console.log(`${events.length} événements créés (tous statuts/moods/approved/reserve couverts)`);

    // ======================
    // 8. ARTISTES DES ÉVÉNEMENTS (multiples par event)
    // ======================
    console.log("Création des liens événements-artistes...");
    const eventArtists = await Promise.all([
      storage.createEventArtist({
        eventId: events[0].id,
        artistId: artists[0].id,
        fee: "800.00"
      }),
      storage.createEventArtist({
        eventId: events[0].id,
        artistId: artists[1].id,
        fee: "600.00"
      }),
      storage.createEventArtist({
        eventId: events[2].id,
        artistId: artists[1].id,
        fee: "600.00"
      }),
      storage.createEventArtist({
        eventId: events[3].id,
        artistId: artists[2].id,
        fee: "1200.00"
      }),
      storage.createEventArtist({
        eventId: events[4].id,
        artistId: artists[2].id,
        fee: "1200.00"
      }),
      storage.createEventArtist({
        eventId: events[5].id,
        artistId: artists[3].id,
        fee: "700.00"
      })
    ]);
    console.log(`${eventArtists.length} liens événements-artistes créés`);

    // ======================
    // 9. TABLES RÉSERVÉES POUR ÉVÉNEMENTS (multiples, impactant available)
    // ======================
    console.log("Création des tables réservées...");
    const eventReservedTables = await Promise.all([
      storage.createEventReservedTable({
        eventId: events[0].id,
        tableId: clubTables[0].id
      }),
      storage.createEventReservedTable({
        eventId: events[0].id,
        tableId: clubTables[1].id  // This makes it unavailable
      }),
      storage.createEventReservedTable({
        eventId: events[2].id,
        tableId: clubTables[3].id
      }),
      storage.createEventReservedTable({
        eventId: events[3].id,
        tableId: clubTables[4].id  // Makes unavailable
      }),
      storage.createEventReservedTable({
        eventId: events[5].id,
        tableId: clubTables[6].id
      })
    ]);
    console.log(`${eventReservedTables.length} tables réservées créées`);

    // ======================
    // 10. PARTICIPANTS AUX ÉVÉNEMENTS (pending/confirmed)
    // ======================
    console.log("Création des participants aux événements...");
    const eventParticipants = await Promise.all([
      storage.createEventParticipant({
        eventId: events[0].id,
        userId: users[6].id, // user1
        status: "confirmed"
      }),
      storage.createEventParticipant({
        eventId: events[0].id,
        userId: users[7].id, // user2
        status: "pending"
      }),
      storage.createEventParticipant({
        eventId: events[2].id,
        userId: users[8].id, // user3
        status: "confirmed"
      }),
      storage.createEventParticipant({
        eventId: events[3].id,
        userId: users[9].id, // user4
        status: "pending"
      }),
      storage.createEventParticipant({
        eventId: events[4].id,
        userId: users[6].id,
        status: "confirmed"
      })
    ]);
    console.log(`${eventParticipants.length} participants créés (pending/confirmed)`);

    // ======================
    // 11. INVITATIONS (tous statuts, progress 0/50/100, genres)
    // ======================
    console.log("Création des invitations...");
    const invitations = await Promise.all([
      storage.createInvitation({
        eventId: events[0].id,
        userId: users[6].id,
        invitedById: users[4].id, // club
        status: "accepted",
        progress: 100,
        expectedAttendees: 2,
        genre: "Electronic",
        description: "Invitation acceptée pour House Night"
      }),
      storage.createInvitation({
        eventId: events[1].id,
        userId: users[7].id,
        invitedById: users[5].id,
        status: "pending",
        progress: 0,
        expectedAttendees: 4,
        genre: "Techno",
        description: "Invitation en attente"
      }),
      storage.createInvitation({
        eventId: events[2].id,
        userId: users[8].id,
        invitedById: users[4].id,
        status: "declined",
        progress: 0,
        expectedAttendees: 1,
        genre: "Jazz",
        description: "Déclinée"
      }),
      storage.createInvitation({
        eventId: events[3].id,
        userId: users[9].id,
        invitedById: users[5].id,
        status: "confirmed",
        progress: 100,
        expectedAttendees: 6,
        genre: "Rock",
        description: "Confirmée mais annulée event"
      }),
      storage.createInvitation({
        eventId: events[4].id,
        userId: users[6].id,
        invitedById: users[6].id, // self? No, club
        invitedById: users[4].id,
        status: "cancelled",
        progress: 75,
        expectedAttendees: 3,
        genre: "Live Music",
        description: "Annulée"
      }),
      storage.createInvitation({
        eventId: events[5].id,
        userId: users[7].id,
        invitedById: users[7].id, // club
        status: "rejected",
        progress: 0,
        expectedAttendees: 5,
        genre: "Beach",
        description: "Rejetée"
      }),
      storage.createInvitation({
        eventId: events[0].id,
        userId: users[8].id,
        invitedById: users[4].id,
        status: "negotiation",
        progress: 50,
        expectedAttendees: 8,
        genre: "Electronic",
        description: "En négociation"
      }),
      storage.createInvitation({
        eventId: events[1].id,
        userId: users[9].id,
        invitedById: users[5].id,
        status: "preparation",
        progress: 80,
        expectedAttendees: 10,
        genre: "Techno",
        description: "En préparation"
      }),
      storage.createInvitation({
        eventId: events[2].id,
        userId: users[6].id,
        invitedById: users[4].id,
        status: "completed",
        progress: 100,
        expectedAttendees: 12,
        genre: "Jazz",
        description: "Complétée"
      })
    ]);
    console.log(`${invitations.length} invitations créées (tous statuts/progress/genres)`);

    // ======================
    // 12. TYPES DE TICKETS (multiples par event)
    // ======================
    console.log("Création des types de tickets...");
    const ticketTypes = await Promise.all([
      storage.createTicketType({
        eventId: events[0].id,
        name: "Entrée Standard",
        price: "25.00",
        capacity: 300,
        description: "Accès général"
      }),
      storage.createTicketType({
        eventId: events[0].id,
        name: "VIP",
        price: "50.00",
        capacity: 100,
        description: "Accès VIP"
      }),
      storage.createTicketType({
        eventId: events[2].id,
        name: "Early Bird",
        price: "12.00",
        capacity: 100,
        description: "Early bird"
      }),
      storage.createTicketType({
        eventId: events[2].id,
        name: "Standard",
        price: "15.00",
        capacity: 150,
        description: "Standard"
      }),
      storage.createTicketType({
        eventId: events[4].id,
        name: "General Admission",
        price: "18.00",
        capacity: 150,
        description: "Admission générale"
      }),
      storage.createTicketType({
        eventId: events[5].id,
        name: "Premium Beach",
        price: "35.00",
        capacity: 200,
        description: "Accès premium plage"
      })
    ]);
    console.log(`${ticketTypes.length} types de tickets créés`);

    // ======================
    // 13. TICKETS (tous statuts: purchased/used/refunded)
    // ======================
    console.log("Création des tickets...");
    const tickets = await Promise.all([
      storage.createTicket({
        eventId: events[0].id,
        userId: users[6].id,
        ticketTypeId: ticketTypes[0].id,
        price: "25.00",
        status: "purchased"
      }),
      storage.createTicket({
        eventId: events[0].id,
        userId: users[7].id,
        ticketTypeId: ticketTypes[1].id,
        price: "50.00",
        status: "used"  // For past event
      }),
      storage.createTicket({
        eventId: events[2].id,
        userId: users[8].id,
        ticketTypeId: ticketTypes[2].id,
        price: "12.00",
        status: "refunded"  // For cancelled
      }),
      storage.createTicket({
        eventId: events[4].id,
        userId: users[9].id,
        ticketTypeId: ticketTypes[4].id,
        price: "18.00",
        status: "purchased"
      }),
      storage.createTicket({
        eventId: events[5].id,
        userId: users[6].id,
        ticketTypeId: ticketTypes[5].id,
        price: "35.00",
        status: "purchased"
      }),
      storage.createTicket({
        eventId: events[2].id,
        userId: users[7].id,
        ticketTypeId: ticketTypes[3].id,
        price: "15.00",
        status: "used"
      })
    ]);
    console.log(`${tickets.length} tickets créés (tous statuts)`);

    // ======================
    // 14. GENRES MUSICAUX (plusieurs)
    // ======================
    console.log("Création des genres musicaux...");
    const musicGenres = await Promise.all([
      storage.createMusicGenre({
        name: "House",
        description: "Musique house électronique"
      }),
      storage.createMusicGenre({
        name: "Jazz",
        description: "Jazz traditionnel et moderne"
      }),
      storage.createMusicGenre({
        name: "Rock",
        description: "Rock et alternative"
      }),
      storage.createMusicGenre({
        name: "Pop",
        description: "Pop contemporaine"
      }),
      storage.createMusicGenre({
        name: "Techno",
        description: "Techno pure"
      })
    ]);
    console.log(`${musicGenres.length} genres musicaux créés`);

    // ======================
    // 15. TYPES DE BOISSONS (catégories, prices)
    // ======================
    console.log("Création des types de boissons...");
    const drinkTypes = await Promise.all([
      storage.createDrinkType({
        name: "Bière Blonde",
        category: "Beer",
        price: "5.00"
      }),
      storage.createDrinkType({
        name: "Vin Rouge",
        category: "Wine",
        price: "8.00"
      }),
      storage.createDrinkType({
        name: "Cocktail Mojito",
        category: "Cocktail",
        price: "12.00"
      }),
      storage.createDrinkType({
        name: "Eau Minérale",
        category: "Non-Alcoholic",
        price: "3.00"
      }),
      storage.createDrinkType({
        name: "Whisky Single Malt",
        category: "Spirits",
        price: "15.00"
      })
    ]);
    console.log(`${drinkTypes.length} types de boissons créés`);

    // ======================
    // 16. PROMOTIONS (tous discountType/status)
    // ======================
    console.log("Création des promotions...");
    const validFrom = new Date();
    const validToActive = new Date();
    validToActive.setDate(validToActive.getDate() + 7);
    const validToExpired = new Date('2024-01-01'); // Past
    const promotions = await Promise.all([
      storage.createPromotion({
        eventId: events[0].id,
        clubId: null,
        title: "Promo 20% House Night",
        description: "20% sur tickets standard",
        discountType: "percentage",
        discountValue: "20.00",
        status: "active",
        channels: ["email", "app"],
        validFrom,
        validTo: validToActive
      }),
      storage.createPromotion({
        eventId: null,
        clubId: clubs[0].id,
        title: "Fixed Discount VIP",
        description: "5€ off sur tables",
        discountType: "fixed",
        discountValue: "5.00",
        status: "active",
        channels: ["social"],
        validFrom,
        validTo: validToActive
      }),
      storage.createPromotion({
        eventId: events[3].id,
        clubId: null,
        title: "Expired Jazz Promo",
        description: "Promo expirée",
        discountType: "percentage",
        discountValue: "15.00",
        status: "expired",
        channels: ["app"],
        validFrom: new Date('2024-01-01'),
        validTo: validToExpired
      }),
      storage.createPromotion({
        eventId: null,
        clubId: clubs[1].id,
        title: "Inactive Lounge Deal",
        description: "Deal inactif",
        discountType: "fixed",
        discountValue: "10.00",
        status: "inactive",
        channels: ["email"],
        validFrom,
        validTo: validToActive
      })
    ]);
    console.log(`${promotions.length} promotions créées (tous types/status)`);

    // ======================
    // 17. AVIS (tous sourceType, ratings 1-5, with reply)
    // ======================
    console.log("Création des avis...");
    const feedback = await Promise.all([
      storage.createFeedback({
        reviewerId: users[6].id,
        sourceType: "club",
        sourceId: clubs[0].id,
        title: "Super soirée !",
        rating: 5,
        comment: "Ambiance incroyable !",
        reply: "Merci pour votre avis !",
        sourceName: "Paradise Club",
        likesCount: 5,
        commentsCount: 2
      }),
      storage.createFeedback({
        reviewerId: users[7].id,
        sourceType: "artist",
        sourceId: artists[0].id,
        title: "DJ moyen",
        rating: 3,
        comment: "Set correct mais pas exceptionnel",
        reply: null,
        sourceName: "DJ Marco",
        likesCount: 1,
        commentsCount: 0
      }),
      storage.createFeedback({
        reviewerId: users[8].id,
        sourceType: "event",
        sourceId: events[2].id,
        title: "Événement génial",
        rating: 4,
        comment: "Bon concert",
        reply: "Ravi que vous ayez aimé !",
        sourceName: "Jazz Session",
        likesCount: 3,
        commentsCount: 1
      }),
      storage.createFeedback({
        reviewerId: users[9].id,
        sourceType: "user",
        sourceId: users[6].id,
        title: "Utilisateur sympa",
        rating: 1,
        comment: "Mauvaise expérience",
        reply: "Désolé, nous améliorons",
        sourceName: "Jean Dupont",
        likesCount: 0,
        commentsCount: 0
      }),
      storage.createFeedback({
        reviewerId: users[6].id,
        sourceType: "club",
        sourceId: clubs[1].id,
        title: "Mauvais service",
        rating: 2,
        comment: "Service lent",
        reply: null,
        sourceName: "Velvet Underground",
        likesCount: 2,
        commentsCount: 3
      })
    ]);
    console.log(`${feedback.length} avis créés (tous sourceType/ratings 1-5, replies)`);

    // ======================
    // 18. LIKES D'AVIS (quelques)
    // ======================
    console.log("Création des likes d'avis...");
    const feedbackLikes = await Promise.all([
      storage.createFeedbackLike({
        feedbackId: feedback[0].id,
        userId: users[7].id,
        likedAt: new Date()
      }),
      storage.createFeedbackLike({
        feedbackId: feedback[0].id,
        userId: users[8].id,
        likedAt: new Date()
      }),
      storage.createFeedbackLike({
        feedbackId: feedback[2].id,
        userId: users[6].id,
        likedAt: new Date()
      })
    ]);
    console.log(`${feedbackLikes.length} likes d'avis créés`);

    // ======================
    // 19. COMMENTAIRES D'AVIS
    // ======================
    console.log("Création des commentaires d'avis...");
    const feedbackComments = await Promise.all([
      storage.createFeedbackComment({
        feedbackId: feedback[0].id,
        userId: users[9].id,
        content: "Tout à fait d'accord !"
      }),
      storage.createFeedbackComment({
        feedbackId: feedback[4].id,
        userId: users[8].id,
        content: "J'ai eu le même problème"
      })
    ]);
    console.log(`${feedbackComments.length} commentaires d'avis créés`);

    // ======================
    // 20. PHOTOS (avec tags, likes/comments)
    // ======================
    console.log("Création des photos...");
    const photos = await Promise.all([
      storage.createPhoto({
        userId: users[6].id,
        eventId: events[0].id,
        title: "Photo House Night",
        description: "Ambiance folle",
        url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        thumbnail: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=150",
        tags: ["house", "party", "dj"],
        likesCount: 10,
        commentsCount: 3,
        uploadedAt: new Date()
      }),
      storage.createPhoto({
        userId: users[7].id,
        eventId: events[2].id,
        title: "Jazz Moment",
        description: "Super concert",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150",
        tags: ["jazz", "live"],
        likesCount: 5,
        commentsCount: 1,
        uploadedAt: new Date()
      }),
      storage.createPhoto({
        userId: users[8].id,
        eventId: null,
        title: "Selfie Club",
        description: "Soirée au club",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        tags: ["selfie", "nightlife"],
        likesCount: 2,
        commentsCount: 0,
        uploadedAt: new Date()
      })
    ]);
    console.log(`${photos.length} photos créées (avec tags)`);

    // ======================
    // 21. LIKES DE PHOTOS
    // ======================
    console.log("Création des likes de photos...");
    const photoLikes = await Promise.all([
      storage.createPhotoLike({
        photoId: photos[0].id,
        userId: users[7].id,
        likedAt: new Date()
      }),
      storage.createPhotoLike({
        photoId: photos[0].id,
        userId: users[8].id,
        likedAt: new Date()
      }),
      storage.createPhotoLike({
        photoId: photos[1].id,
        userId: users[6].id,
        likedAt: new Date()
      })
    ]);
    console.log(`${photoLikes.length} likes de photos créés`);

    // ======================
    // 22. COMMENTAIRES DE PHOTOS
    // ======================
    console.log("Création des commentaires de photos...");
    const photoComments = await Promise.all([
      storage.createPhotoComment({
        photoId: photos[0].id,
        userId: users[9].id,
        content: "Magnifique photo !"
      }),
      storage.createPhotoComment({
        photoId: photos[1].id,
        userId: users[8].id,
        content: "J'adore ce moment"
      })
    ]);
    console.log(`${photoComments.length} commentaires de photos créés`);

    // ======================
    // 23. MILESTONES DE COLLABORATION (tous status/assignedTo/priority)
    // ======================
    console.log("Création des milestones de collaboration...");
    const collaborationMilestones = await Promise.all([
      storage.createCollaborationMilestone({
        invitationId: invitations[0].id,
        title: "Préparation setlist",
        description: "Finaliser la setlist",
        status: "completed",
        assignedTo: "artist",
        priority: "high",
        dueDate: new Date(),
        completedAt: new Date()
      }),
      storage.createCollaborationMilestone({
        invitationId: invitations[6].id, // negotiation
        title: "Négocier fee",
        description: "Discuter du tarif",
        status: "in_progress",
        assignedTo: "both",
        priority: "medium",
        dueDate: futureDate1
      }),
      storage.createCollaborationMilestone({
        invitationId: invitations[1].id,
        title: "Envoyer contrat",
        description: "Préparer contrat",
        status: "pending",
        assignedTo: "club",
        priority: "low",
        dueDate: futureDate2
      }),
      storage.createCollaborationMilestone({
        invitationId: invitations[7].id,
        title: "Setup technique",
        description: "Installer équipement",
        status: "completed",
        assignedTo: "both",
        priority: "high",
        dueDate: new Date('2024-11-01'),
        completedAt: new Date('2024-11-02')
      })
    ]);
    console.log(`${collaborationMilestones.length} milestones créés (tous status/assigned/priority)`);

    // ======================
    // 24. MESSAGES DE COLLABORATION (club/artist)
    // ======================
    console.log("Création des messages de collaboration...");
    const collaborationMessages = await Promise.all([
      storage.createCollaborationMessage({
        invitationId: invitations[0].id,
        senderType: "club",
        senderId: users[4].id,
        content: "Setlist approuvée !"
      }),
      storage.createCollaborationMessage({
        invitationId: invitations[6].id,
        senderType: "artist",
        senderId: users[2].id,
        content: "Proposition de fee: 900€"
      }),
      storage.createCollaborationMessage({
        invitationId: invitations[1].id,
        senderType: "club",
        senderId: users[5].id,
        content: "Contrat en pièce jointe"
      }),
      storage.createCollaborationMessage({
        invitationId: invitations[7].id,
        senderType: "artist",
        senderId: users[3].id,
        content: "Setup OK, prêt pour demain"
      })
    ]);
    console.log(`${collaborationMessages.length} messages de collaboration créés (club/artist)`);

    // ======================
    // 25. TRANSACTIONS (tous types/status, amounts variés)
    // ======================
    console.log("Création des transactions...");
    const transactions = await Promise.all([
      storage.createTransaction({
        userId: users[6].id,
        amount: "25.00",
        type: "debit",
        status: "completed",
        description: "Achat ticket",
        reference: "TXN001"
      }),
      storage.createTransaction({
        userId: users[7].id,
        amount: "50.00",
        type: "debit",
        status: "processing",
        description: "Paiement en cours",
        reference: "TXN002"
      }),
      storage.createTransaction({
        userId: users[8].id,
        amount: "12.00",
        type: "debit",
        status: "failed",
        description: "Échec paiement",
        reference: "TXN003"
      }),
      storage.createTransaction({
        userId: users[2].id, // artist
        amount: "800.00",
        type: "credit",
        status: "completed",
        description: "Paiement performance",
        reference: "TXN004"
      }),
      storage.createTransaction({
        userId: users[4].id, // club
        amount: "10.00",
        type: "fee",
        status: "completed",
        description: "Frais de service",
        reference: "TXN005"
      }),
      storage.createTransaction({
        userId: users[6].id,
        amount: "100.00",
        type: "withdrawal",
        status: "processing",
        description: "Retrait wallet",
        reference: "TXN006"
      })
    ]);
    console.log(`${transactions.length} transactions créées (tous types/status)`);

    // ======================
    // 26. PROFILS CLIENTS (préférences variées)
    // ======================
    console.log("Création des profils clients...");
    const customerProfiles = await Promise.all([
      storage.createCustomerProfile({
        userId: users[6].id,
        preferences: { genres: ["House", "Techno"], locations: ["Paris"], priceRange: "medium" },
        visitHistory: [{ event: "House Night", date: "2024-11-01", rating: 5 }]
      }),
      storage.createCustomerProfile({
        userId: users[7].id,
        preferences: { genres: ["Jazz", "Soul"], locations: ["Lyon"], priceRange: "low" },
        visitHistory: [{ event: "Jazz Session", date: "2024-10-15", rating: 4 }]
      }),
      storage.createCustomerProfile({
        userId: users[8].id,
        preferences: { genres: ["Rock"], locations: ["Marseille", "Paris"], priceRange: "high" },
        visitHistory: [{ event: "Rock Night", date: "2024-10-20", rating: 3 }]
      })
    ]);
    console.log(`${customerProfiles.length} profils clients créés`);

    // ======================
    // 27. TAGS CLIENTS (multiples par client)
    // ======================
    console.log("Création des tags clients...");
    // Note: This is junction, so multiple calls
    await storage.createCustomerTag({ customerId: customerProfiles[0].id, tag: "VIP" });
    await storage.createCustomerTag({ customerId: customerProfiles[0].id, tag: "Frequent" });
    await storage.createCustomerTag({ customerId: customerProfiles[1].id, tag: "Newcomer" });
    await storage.createCustomerTag({ customerId: customerProfiles[2].id, tag: "Music Lover" });
    await storage.createCustomerTag({ customerId: customerProfiles[2].id, tag: "High Spender" });
    console.log("5 tags clients créés");

    // ======================
    // 28. MÉTHODES DE PAIEMENT (tous types)
    // ======================
    console.log("Création des méthodes de paiement...");
    const paymentMethods = await Promise.all([
      storage.createPaymentMethod({
        userId: users[6].id,
        type: "card",
        details: { brand: "Visa", last4: "4242", expMonth: 12, expYear: 2026 },
        isDefault: true
      }),
      storage.createPaymentMethod({
        userId: users[7].id,
        type: "bank",
        details: { bankName: "BNP", account: "FR761234..." },
        isDefault: false
      }),
      storage.createPaymentMethod({
        userId: users[8].id,
        type: "mobile",
        details: { provider: "PayPal", email: "user8@bebit.com" },
        isDefault: true
      }),
      storage.createPaymentMethod({
        userId: users[9].id,
        type: "card",
        details: { brand: "Mastercard", last4: "5555", expMonth: 6, expYear: 2025 },
        isDefault: true
      })
    ]);
    console.log(`${paymentMethods.length} méthodes de paiement créées (tous types)`);

    // ======================
    // 29. FACTURES (tous statuts)
    // ======================
    console.log("Création des factures...");
    const invoices = await Promise.all([
      storage.createInvoice({
        userId: users[6].id,
        transactionId: transactions[0].id,
        amount: "25.00",
        status: "paid",
        paidAt: new Date()
      }),
      storage.createInvoice({
        userId: users[7].id,
        transactionId: transactions[1].id,
        amount: "50.00",
        status: "pending",
        dueDate: futureDate1
      }),
      storage.createInvoice({
        userId: users[8].id,
        transactionId: transactions[2].id,
        amount: "12.00",
        status: "overdue",
        dueDate: pastDate
      }),
      storage.createInvoice({
        userId: users[2].id,
        transactionId: transactions[3].id,
        amount: "800.00",
        status: "paid",
        paidAt: new Date()
      })
    ]);
    console.log(`${invoices.length} factures créées (tous statuts)`);

    // ======================
    // 30. EMPLOYES POS (roles, status true/false)
    // ======================
    console.log("Création des employés POS...");
    const employees = await Promise.all([
      storage.createEmployee({
        name: "John Doe",
        role: "Bartender",
        pin: "1234",
        status: true,
        deviceId: null
      }),
      storage.createEmployee({
        name: "Jane Smith",
        role: "Manager",
        pin: "5678",
        status: true,
        deviceId: 1  // Will create devices next
      }),
      storage.createEmployee({
        name: "Bob Inactive",
        role: "Waiter",
        pin: "9012",
        status: false,
        deviceId: null
      }),
      storage.createEmployee({
        name: "Alice Active",
        role: "DJ Assistant",
        pin: "3456",
        status: true,
        deviceId: 2
      })
    ]);
    console.log(`${employees.length} employés POS créés (roles/status)`);

    // ======================
    // 31. DISPOSITIFS POS (status true/false)
    // ======================
    console.log("Création des dispositifs POS...");
    const posDevices = await Promise.all([
      storage.createPosDevice({
        name: "Bar Terminal 1",
        location: "Main Bar",
        status: true,
        lastActive: "2024-11-07 10:00",
        sales: 1500
      }),
      storage.createPosDevice({
        name: "VIP Terminal",
        location: "VIP Lounge",
        status: true,
        lastActive: "2024-11-07 09:30",
        sales: 800
      }),
      storage.createPosDevice({
        name: "Kitchen POS",
        location: "Kitchen",
        status: false,
        lastActive: "2024-11-06 18:00",
        sales: 500
      })
    ]);
    // Update employees with deviceIds
    await storage.updateEmployee(employees[1].id, { deviceId: posDevices[0].id });
    await storage.updateEmployee(employees[3].id, { deviceId: posDevices[1].id });
    console.log(`${posDevices.length} dispositifs POS créés (status true/false)`);

    // ======================
    // 32. CATÉGORIES PRODUITS (isActive true/false)
    // ======================
    console.log("Création des catégories produits...");
    const productCategories = await Promise.all([
      storage.createProductCategory({
        name: "Boissons",
        description: "Toutes les boissons",
        isActive: true
      }),
      storage.createProductCategory({
        name: "Snacks",
        description: "Petits plats",
        isActive: true
      }),
      storage.createProductCategory({
        name: "Inactive Cat",
        description: "Catégorie inactive",
        isActive: false
      })
    ]);
    console.log(`${productCategories.length} catégories produits créées (isActive)`);

    // ======================
    // 33. PRODUITS (isAvailable, catégories, destinations)
    // ======================
    console.log("Création des produits...");
    const products = await Promise.all([
      storage.createProduct({
        name: "Bière Blonde",
        description: "Bière locale",
        price: 500,  // Cents? Assume integer as per schema
        categoryId: productCategories[0].id,
        destinations: "Bar, Table",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200"
      }),
      storage.createProduct({
        name: "Burger",
        description: "Burger classique",
        price: 1200,
        categoryId: productCategories[1].id,
        destinations: "Kitchen",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200"
      }),
      storage.createProduct({
        name: "Vin Rouge",
        description: "Bouteille vin",
        price: 800,
        categoryId: productCategories[0].id,
        destinations: "Bar",
        isAvailable: false,
        imageUrl: "https://images.unsplash.com/photo-1571934811356-9c3d7eafb5c6?w=200"
      }),
      storage.createProduct({
        name: "Frites",
        description: "Portion frites",
        price: 400,
        categoryId: productCategories[1].id,
        destinations: "Table, Kitchen",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200"
      })
    ]);
    console.log(`${products.length} produits créés (available/cat/dest)`);

    // ======================
    // 34. TABLES POS (statuts: available/occupied/reserved/cleaning, areas)
    // ======================
    console.log("Création des tables POS...");
    const posTables = await Promise.all([
      storage.createPosTable({
        name: "Table 1",
        number: 1,
        area: "Main Floor",
        capacity: 4,
        status: "available",
        currentOrderId: null
      }),
      storage.createPosTable({
        name: "Table 2",
        number: 2,
        area: "VIP",
        capacity: 6,
        status: "occupied",
        currentOrderId: 1  // Will create orders
      }),
      storage.createPosTable({
        name: "Table 3",
        number: 3,
        area: "Bar",
        capacity: 2,
        status: "reserved",
        currentOrderId: null
      }),
      storage.createPosTable({
        name: "Table 4",
        number: 4,
        area: "Terrace",
        capacity: 8,
        status: "cleaning",
        currentOrderId: null
      })
    ]);
    console.log(`${posTables.length} tables POS créées (statuts/areas)`);

    // ======================
    // 35. ORDRES POS (statuts, paymentMethod, priority, estimated)
    // ======================
    console.log("Création des ordres POS...");
    const orders = await Promise.all([
      storage.createOrder({
        tableId: posTables[0].id,
        customerName: "Jean D.",
        status: "new",
        total: 1500,  // Cents
        paymentMethod: "card",
        priority: "medium",
        estimatedCompletionTime: new Date(Date.now() + 10*60000)  // 10 min
      }),
      storage.createOrder({
        tableId: posTables[1].id,
        customerName: "Group VIP",
        status: "preparing",
        total: 2500,
        paymentMethod: "cash",
        priority: "high",
        estimatedCompletionTime: new Date(Date.now() + 5*60000)
      }),
      storage.createOrder({
        tableId: posTables[2].id,
        customerName: "Reservation Party",
        status: "ready",
        total: 1800,
        paymentMethod: "mobile",
        priority: "low",
        estimatedCompletionTime: new Date()
      }),
      storage.createOrder({
        tableId: posTables[3].id,
        customerName: "Terrace Group",
        status: "completed",
        total: 3200,
        paymentMethod: "card",
        priority: "medium",
        estimatedCompletionTime: new Date()
      })
    ]);
    // Update table currentOrderId
    await storage.updatePosTable(posTables[0].id, { currentOrderId: orders[0].id });
    await storage.updatePosTable(posTables[1].id, { currentOrderId: orders[1].id });
    console.log(`${orders.length} ordres POS créés (statuts/payment/priority)`);

    // ======================
    // 36. ITEMS D'ORDRE (statuts, notes, category, prep time)
    // ======================
    console.log("Création des items d'ordre...");
    const orderItems = await Promise.all([
      storage.createOrderItem({
        orderId: orders[0].id,
        productId: products[0].id,
        quantity: 2,
        price: 500,
        notes: "Sans gluten",
        subtotal: 1000,
        status: "new",
        category: "Boissons",
        preparationTime: 5
      }),
      storage.createOrderItem({
        orderId: orders[0].id,
        productId: products[3].id,
        quantity: 1,
        price: 400,
        notes: "",
        subtotal: 400,
        status: "preparing",
        category: "Snacks",
        preparationTime: 10
      }),
      storage.createOrderItem({
        orderId: orders[1].id,
        productId: products[1].id,
        quantity: 3,
        price: 1200,
        notes: "Bien cuit",
        subtotal: 3600,
        status: "ready",
        category: "Snacks",
        preparationTime: 15
      }),
      storage.createOrderItem({
        orderId: orders[2].id,
        productId: products[2].id,
        quantity: 1,
        price: 800,
        notes: "Chaud",
        subtotal: 800,
        status: "completed",
        category: "Boissons",
        preparationTime: 0
      })
    ]);
    console.log(`${orderItems.length} items d'ordre créés (statuts/notes)`);

    // ======================
    // 37. HISTORIQUE POS (types, status, details)
    // ======================
    console.log("Création de l'historique POS...");
    const posHistory = await Promise.all([
      storage.createPosHistory({
        type: "order_created",
        description: "Nouvel ordre table 1",
        userId: employees[0].id,
        userName: "John Doe",
        userRole: "Bartender",
        amount: 1500,
        orderId: orders[0].id,
        tableId: posTables[0].id,
        tableName: "Table 1",
        details: "Boissons commandées",
        status: "success"
      }),
      storage.createPosHistory({
        type: "payment_processed",
        description: "Paiement ordre VIP",
        userId: employees[1].id,
        userName: "Jane Smith",
        userRole: "Manager",
        amount: 2500,
        orderId: orders[1].id,
        tableId: posTables[1].id,
        tableName: "Table 2",
        details: "Carte acceptée",
        status: "success"
      }),
      storage.createPosHistory({
        type: "order_cancelled",
        description: "Annulation table 3",
        userId: employees[2].id,
        userName: "Bob Inactive",
        userRole: "Waiter",
        amount: 0,
        orderId: null,
        tableId: posTables[2].id,
        tableName: "Table 3",
        details: "Client parti",
        status: "cancelled"
      }),
      storage.createPosHistory({
        type: "refund_issued",
        description: "Remboursement frites",
        userId: employees[3].id,
        userName: "Alice Active",
        userRole: "DJ Assistant",
        amount: -400,
        orderId: orders[0].id,
        tableId: posTables[0].id,
        tableName: "Table 1",
        details: "Erreur commande",
        status: "success"
      })
    ]);
    console.log(`${posHistory.length} entrées historique POS créées (types/status)`);

    // ======================
    // 38. MÉTHODES PAIEMENT POS
    // ======================
    console.log("Création des méthodes paiement POS...");
    const posPaymentMethods = await Promise.all([
      storage.createPosPaymentMethod({
        name: "Cash",
        value: 0
      }),
      storage.createPosPaymentMethod({
        name: "Card",
        value: 1
      }),
      storage.createPosPaymentMethod({
        name: "Mobile Pay",
        value: 2
      })
    ]);
    console.log(`${posPaymentMethods.length} méthodes paiement POS créées`);

    console.log("✅ Toutes les données de test exhaustives ont été insérées avec succès !");
    console.log("\n📊 RÉSUMÉ DES DONNÉES CRÉÉES :");
    console.log(`👥 Utilisateurs: ${users.length}`);
    console.log(`🎵 Artistes: ${artists.length}`);
    console.log(`🏢 Clubs: ${clubs.length}`);
    console.log(`📍 Localisations clubs: ${clubLocations.length}`);
    console.log(`🪑 Tables clubs: ${clubTables.length}`);
    console.log(`📅 Événements: ${events.length}`);
    console.log(`🎼 Artistes events: ${eventArtists.length}`);
    console.log(`🔒 Tables réservées: ${eventReservedTables.length}`);
    console.log(`👥 Participants events: ${eventParticipants.length}`);
    console.log(`💌 Invitations: ${invitations.length}`);
    console.log(`🎫 Types tickets: ${ticketTypes.length}`);
    console.log(`📋 Tickets: ${tickets.length}`);
    console.log(`⭐ Avis: ${feedback.length}`);
    console.log(`👍 Likes avis: ${feedbackLikes.length}`);
    console.log(`💬 Commentaires avis: ${feedbackComments.length}`);
    console.log(`📸 Photos: ${photos.length}`);
    console.log(`❤️ Likes photos: ${photoLikes.length}`);
    console.log(`🗨️ Commentaires photos: ${photoComments.length}`);
    console.log(`🎯 Milestones collab: ${collaborationMilestones.length}`);
    console.log(`💬 Messages collab: ${collaborationMessages.length}`);
    console.log(`💳 Transactions: ${transactions.length}`);
    console.log(`👤 Profils clients: ${customerProfiles.length}`);
    console.log(`🏷️ Tags clients: 5`);
    console.log(`🎼 Genres musique: ${musicGenres.length}`);
    console.log(`🍹 Boissons: ${drinkTypes.length}`);
    console.log(`🔥 Promotions: ${promotions.length}`);
    console.log(`💳 Méthodes paiement: ${paymentMethods.length}`);
    console.log(`📄 Factures: ${invoices.length}`);
    console.log(`👷 Employés POS: ${employees.length}`);
    console.log(`🖥️ Dispositifs POS: ${posDevices.length}`);
    console.log(`📂 Catégories produits: ${productCategories.length}`);
    console.log(`🛒 Produits: ${products.length}`);
    console.log(`🪑 Tables POS: ${posTables.length}`);
    console.log(`📝 Ordres POS: ${orders.length}`);
    console.log(`📦 Items ordres: ${orderItems.length}`);
    console.log(`📜 Historique POS: ${posHistory.length}`);
    console.log(`💰 Méthodes paiement POS: ${posPaymentMethods.length}`);
    console.log("\n🔑 INFORMATIONS DE CONNEXION :");
    console.log("Tous les utilisateurs ont le mot de passe: pass123");
    console.log("\nComptes disponibles (exemples) :");
    console.log("Admin: admin1 / pass123 (verified), admin2 / pass123 (pending)");
    console.log("Artiste: dj_marco / pass123 (approved), dj_rejected / pass123 (rejected)");
    console.log("Club: club_paradise / pass123 (featured), club_pending / pass123 (pending)");
    console.log("Users: user1 à user5 / pass123 (variés vérif/langue)");
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des données:", error);
    throw error;
  }
}
// Exécuter le script
insertTestData();