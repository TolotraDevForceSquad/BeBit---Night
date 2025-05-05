import { db } from "./index";
import * as schema from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seeding...");
    
    // Check if we already have users to avoid duplicates
    const existingUsers = await db.query.users.findMany({
      limit: 1,
    });
    
    if (existingUsers.length > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }
    
    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await db.insert(schema.users).values({
      username: "admin",
      password: adminPassword,
      email: "admin@nightconnect.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isVerified: true,
      walletBalance: "1000",
    }).returning();
    
    console.log("Created admin user");
    
    // Create artist users
    const artistPassword = await hashPassword("artist123");
    
    // Artist 1: DJ Elektra
    const artistUser1 = await db.insert(schema.users).values({
      username: "dj_elektra",
      password: artistPassword,
      email: "elektra@nightconnect.com",
      firstName: "Elektra",
      lastName: "Jones",
      role: "artist",
      profileImage: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c",
      isVerified: true,
      walletBalance: "500",
    }).returning();
    
    const artist1 = await db.insert(schema.artists).values({
      userId: artistUser1[0].id,
      displayName: "DJ Elektra",
      genre: "House & Techno",
      bio: "DJ Elektra est une artiste électronique reconnue dans la scène underground depuis 5 ans.",
      rate: "350",
      tags: ["House", "Techno", "EDM"],
      popularity: 95,
    }).returning();
    
    // Artist 2: MC Blaze
    const artistUser2 = await db.insert(schema.users).values({
      username: "mc_blaze",
      password: artistPassword,
      email: "blaze@nightconnect.com",
      firstName: "Malik",
      lastName: "Thomas",
      role: "artist",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      isVerified: true,
      walletBalance: "300",
    }).returning();
    
    const artist2 = await db.insert(schema.artists).values({
      userId: artistUser2[0].id,
      displayName: "MC Blaze",
      genre: "Hip-Hop & Rap",
      bio: "MC Blaze apporte la chaleur dans ses performances avec un flow inimitable.",
      rate: "300",
      tags: ["Hip-Hop", "Rap", "Urban"],
      popularity: 80,
    }).returning();
    
    // Artist 3: Luna Ray
    const artistUser3 = await db.insert(schema.users).values({
      username: "luna_ray",
      password: artistPassword,
      email: "luna@nightconnect.com",
      firstName: "Luna",
      lastName: "Raymond",
      role: "artist",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      isVerified: true,
      walletBalance: "450",
    }).returning();
    
    const artist3 = await db.insert(schema.artists).values({
      userId: artistUser3[0].id,
      displayName: "Luna Ray",
      genre: "Lounge & Vocal",
      bio: "Luna Ray crée une ambiance envoûtante avec sa voix mélodieuse et ses sélections lounge.",
      rate: "280",
      tags: ["Lounge", "Vocal", "Chill"],
      popularity: 70,
    }).returning();
    
    // Artist 4: DJ Maximus
    const artistUser4 = await db.insert(schema.users).values({
      username: "dj_maximus",
      password: artistPassword,
      email: "maximus@nightconnect.com",
      firstName: "Max",
      lastName: "Johnson",
      role: "artist",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      isVerified: true,
      walletBalance: "600",
    }).returning();
    
    const artist4 = await db.insert(schema.artists).values({
      userId: artistUser4[0].id,
      displayName: "DJ Maximus",
      genre: "EDM & Dance",
      bio: "DJ Maximus est un maestro des platines qui sait comment faire bouger la foule.",
      rate: "400",
      tags: ["EDM", "Dance", "Party"],
      popularity: 85,
    }).returning();
    
    // Artist 5: Jazz Quartet
    const artistUser5 = await db.insert(schema.users).values({
      username: "jazz_quartet",
      password: artistPassword,
      email: "jazz@nightconnect.com",
      firstName: "Jazz",
      lastName: "Collective",
      role: "artist",
      profileImage: "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
      isVerified: true,
      walletBalance: "800",
    }).returning();
    
    const artist5 = await db.insert(schema.artists).values({
      userId: artistUser5[0].id,
      displayName: "Jazz Quartet",
      genre: "Jazz & Blues",
      bio: "Un ensemble de 4 musiciens qui vous transportent dans l'âge d'or du jazz.",
      rate: "500",
      tags: ["Jazz", "Blues", "Live Music"],
      popularity: 60,
    }).returning();
    
    console.log("Created 5 artist users with profiles");
    
    // Create club users
    const clubPassword = await hashPassword("club123");
    
    // Club 1: Club Oxygen
    const clubUser1 = await db.insert(schema.users).values({
      username: "club_oxygen",
      password: clubPassword,
      email: "oxygen@nightconnect.com",
      firstName: "Club",
      lastName: "Oxygen",
      role: "club",
      isVerified: true,
      walletBalance: "2000",
    }).returning();
    
    const club1 = await db.insert(schema.clubs).values({
      userId: clubUser1[0].id,
      name: "Club Oxygen",
      city: "Paris",
      country: "France",
      address: "15 Rue des Lumières, 75001 Paris",
      capacity: 300,
      description: "Un club élégant au coeur de Paris avec une ambiance électro moderne",
      profileImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2",
      rating: "4.7",
      reviewCount: 128,
    }).returning();
    
    // Club 2: Le Studio
    const clubUser2 = await db.insert(schema.users).values({
      username: "le_studio",
      password: clubPassword,
      email: "studio@nightconnect.com",
      firstName: "Le",
      lastName: "Studio",
      role: "club",
      isVerified: true,
      walletBalance: "1800",
    }).returning();
    
    const club2 = await db.insert(schema.clubs).values({
      userId: clubUser2[0].id,
      name: "Le Studio",
      city: "Lyon",
      country: "France",
      address: "8 Avenue des Arts, 69002 Lyon",
      capacity: 200,
      description: "Un lieu à Lyon dédié à la culture hip-hop et aux musiques urbaines",
      profileImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      rating: "4.0",
      reviewCount: 96,
    }).returning();
    
    // Club 3: Tunnel Club
    const clubUser3 = await db.insert(schema.users).values({
      username: "tunnel_club",
      password: clubPassword,
      email: "tunnel@nightconnect.com",
      firstName: "Tunnel",
      lastName: "Club",
      role: "club",
      isVerified: true,
      walletBalance: "1500",
    }).returning();
    
    const club3 = await db.insert(schema.clubs).values({
      userId: clubUser3[0].id,
      name: "Tunnel Club",
      city: "Marseille",
      country: "France",
      address: "42 Quai des Docks, 13002 Marseille",
      capacity: 400,
      description: "Un club underground dans un ancien tunnel ferroviaire à Marseille",
      profileImage: "https://images.unsplash.com/photo-1570872626485-d8ffea69f463",
      rating: "3.8",
      reviewCount: 74,
    }).returning();
    
    console.log("Created 3 club users with profiles");
    
    // Create regular user
    const userPassword = await hashPassword("user123");
    const regularUser = await db.insert(schema.users).values({
      username: "sophie_martin",
      password: userPassword,
      email: "sophie@nightconnect.com",
      firstName: "Sophie",
      lastName: "Martin",
      role: "user",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      isVerified: true,
      walletBalance: "150",
    }).returning();
    
    console.log("Created 1 regular user");
    
    // Create events
    const event1 = await db.insert(schema.events).values({
      clubId: club1.id,
      title: "Nuit Électronique",
      description: "Une nuit de musique électronique avec les meilleurs DJs de la scène parisienne",
      date: new Date("2023-11-15"),
      startTime: "23:00",
      endTime: "05:00",
      location: "Paris",
      venueName: "Club Oxygen",
      category: "House",
      price: "25",
      capacity: 300,
      coverImage: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1",
      participantCount: 210,
      popularity: 95,
      isApproved: true,
      createdAt: new Date(),
    }).returning();
    
    const event2 = await db.insert(schema.events).values({
      clubId: club2.id,
      title: "Nuit Hip-Hop & RnB",
      description: "Soirée spéciale Hip-Hop et RnB avec des performances live et des DJs",
      date: new Date("2023-11-18"),
      startTime: "22:00",
      endTime: "04:00",
      location: "Lyon",
      venueName: "Le Studio",
      category: "Hip-Hop",
      price: "18",
      capacity: 200,
      coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3",
      participantCount: 120,
      popularity: 80,
      isApproved: true,
      createdAt: new Date(),
    }).returning();
    
    const event3 = await db.insert(schema.events).values({
      clubId: club3.id,
      title: "Techno Underground",
      description: "Une expérience techno immersive dans les profondeurs de Marseille",
      date: new Date("2023-11-20"),
      startTime: "23:30",
      endTime: "06:00",
      location: "Marseille",
      venueName: "Tunnel Club",
      category: "Techno",
      price: "30",
      capacity: 400,
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
      participantCount: 275,
      popularity: 90,
      isApproved: true,
      createdAt: new Date(),
    }).returning();
    
    const event4 = await db.insert(schema.events).values({
      clubId: club1.id,
      title: "Soirée Jazz & Cocktails",
      description: "Une soirée élégante avec du jazz et des cocktails signature",
      date: new Date("2023-11-22"),
      startTime: "20:00",
      endTime: "01:00",
      location: "Bordeaux",
      venueName: "Blue Note",
      category: "Jazz",
      price: "15",
      capacity: 150,
      coverImage: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78",
      participantCount: 85,
      popularity: 65,
      isApproved: true,
      createdAt: new Date(),
    }).returning();
    
    console.log("Created 4 events");
    
    // Connect artists to events
    await db.insert(schema.eventArtists).values([
      {
        eventId: event1[0].id,
        artistId: artist1[0].id,
        fee: "350",
      },
      {
        eventId: event2[0].id,
        artistId: artist2[0].id,
        fee: "300",
      },
      {
        eventId: event3[0].id,
        artistId: artist1[0].id,
        fee: "400",
      },
      {
        eventId: event4[0].id,
        artistId: artist5[0].id,
        fee: "500",
      },
    ]);
    
    console.log("Connected artists to events");
    
    // Create some invitations
    await db.insert(schema.invitations).values([
      {
        clubId: club1[0].id,
        artistId: artist3[0].id,
        message: "Nous aimerions vous avoir pour notre soirée lounge le mois prochain. Êtes-vous disponible?",
        fee: "300",
        date: new Date("2023-12-10"),
        status: "pending",
        createdAt: new Date(),
      },
      {
        clubId: club2[0].id,
        artistId: artist2[0].id,
        message: "Une soirée spéciale hip-hop est prévue pour le Nouvel An. Intéressé(e) ?",
        fee: "450",
        date: new Date("2023-12-31"),
        status: "pending",
        createdAt: new Date(),
      },
    ]);
    
    console.log("Created 2 invitations");
    
    // Create some feedback
    await db.insert(schema.feedback).values([
      {
        userId: regularUser[0].id,
        eventId: event1[0].id,
        artistId: artist1[0].id,
        clubId: club1[0].id,
        rating: 5,
        comment: "DJ Elektra était incroyable ! L'ambiance était parfaite et le Club Oxygen offre une excellente acoustique.",
        createdAt: new Date("2023-11-16"),
      },
      {
        userId: regularUser[0].id,
        eventId: event2[0].id,
        artistId: artist2[0].id,
        clubId: club2[0].id,
        rating: 4,
        comment: "Très bonne soirée hip-hop. MC Blaze a su animer la foule avec énergie.",
        createdAt: new Date("2023-11-19"),
      },
    ]);
    
    console.log("Created 2 feedback entries");
    
    // Create some tickets
    await db.insert(schema.tickets).values([
      {
        eventId: event1[0].id,
        userId: regularUser[0].id,
        price: "25",
        purchaseDate: new Date("2023-11-10"),
        isUsed: true,
      },
      {
        eventId: event2[0].id,
        userId: regularUser[0].id,
        price: "18",
        purchaseDate: new Date("2023-11-15"),
        isUsed: true,
      },
      {
        eventId: event3[0].id,
        userId: regularUser[0].id,
        price: "30",
        purchaseDate: new Date("2023-11-18"),
        isUsed: false,
      },
    ]);
    
    console.log("Created 3 tickets");
    
    // Create some transactions
    await db.insert(schema.transactions).values([
      {
        userId: regularUser[0].id,
        amount: "-25",
        description: "Achat billet - Nuit Électronique",
        type: "payment",
        createdAt: new Date("2023-11-10"),
      },
      {
        userId: regularUser[0].id,
        amount: "-18",
        description: "Achat billet - Nuit Hip-Hop & RnB",
        type: "payment",
        createdAt: new Date("2023-11-15"),
      },
      {
        userId: regularUser[0].id,
        amount: "-30",
        description: "Achat billet - Techno Underground",
        type: "payment",
        createdAt: new Date("2023-11-18"),
      },
      {
        userId: regularUser[0].id,
        amount: "100",
        description: "Dépôt sur portefeuille",
        type: "deposit",
        createdAt: new Date("2023-11-05"),
      },
    ]);
    
    console.log("Created 4 transactions");
    
    console.log("Database successfully seeded!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
