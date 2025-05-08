import { db } from "@db";
import { eq, and, desc, sql, asc, like } from "drizzle-orm";
import * as schema from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "@db";
import session from "express-session";
import { createQRCode } from "./qr";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User-related methods
  getUser: (id: number) => Promise<schema.User | undefined>;
  getUserByUsername: (username: string) => Promise<schema.User | undefined>;
  createUser: (user: schema.InsertUser) => Promise<schema.User>;
  updateUser: (id: number, data: Partial<schema.User>) => Promise<schema.User | undefined>;
  
  // Artist-related methods
  getArtist: (id: number) => Promise<schema.Artist | undefined>;
  getArtistByUserId: (userId: number) => Promise<schema.Artist | undefined>;
  createArtist: (artist: schema.InsertArtist) => Promise<schema.Artist>;
  updateArtist: (id: number, data: Partial<schema.Artist>) => Promise<schema.Artist | undefined>;
  getTrendingArtists: (limit?: number) => Promise<schema.Artist[]>;
  
  // Club-related methods
  getClub: (id: number) => Promise<schema.Club | undefined>;
  getClubByUserId: (userId: number) => Promise<schema.Club | undefined>;
  createClub: (club: schema.InsertClub) => Promise<schema.Club>;
  updateClub: (id: number, data: Partial<schema.Club>) => Promise<schema.Club | undefined>;
  getPopularClubs: (limit?: number) => Promise<schema.Club[]>;
  
  // Event-related methods
  getEvent: (id: number) => Promise<schema.Event | undefined>;
  createEvent: (event: schema.InsertEvent) => Promise<schema.Event>;
  updateEvent: (id: number, data: Partial<schema.Event>) => Promise<schema.Event | undefined>;
  getEventsByClubId: (clubId: number, limit?: number) => Promise<schema.Event[]>;
  getEventsByArtistId: (artistId: number, limit?: number) => Promise<schema.Event[]>;
  getAllEvents: (limit?: number) => Promise<schema.Event[]>;
  getEventsByCategory: (category: string, limit?: number) => Promise<schema.Event[]>;
  searchEvents: (query: string, limit?: number) => Promise<schema.Event[]>;
  
  // Invitation-related methods
  getInvitation: (id: number) => Promise<schema.Invitation | undefined>;
  createInvitation: (invitation: schema.InsertInvitation) => Promise<schema.Invitation>;
  updateInvitation: (id: number, data: Partial<schema.Invitation>) => Promise<schema.Invitation | undefined>;
  getInvitationsByArtistId: (artistId: number) => Promise<schema.Invitation[]>;
  getInvitationsByClubId: (clubId: number) => Promise<schema.Invitation[]>;
  
  // Feedback-related methods
  getFeedback: (id: number) => Promise<schema.Feedback | undefined>;
  createFeedback: (feedback: schema.InsertFeedback) => Promise<schema.Feedback>;
  getFeedbackByArtistId: (artistId: number, limit?: number) => Promise<schema.Feedback[]>;
  getFeedbackByClubId: (clubId: number, limit?: number) => Promise<schema.Feedback[]>;
  
  // Transaction-related methods
  createTransaction: (transaction: schema.InsertTransaction) => Promise<schema.Transaction>;
  getTransactionsByUserId: (userId: number, limit?: number) => Promise<schema.Transaction[]>;
  
  // QR code-related methods
  generateEventQRCode: (eventId: number) => Promise<string>;
  generateUserTicketQRCode: (userId: number, eventId: number) => Promise<string>;
  
  // Admin-related methods
  getAdminStats: () => Promise<any>;
  getEventsForModeration: (limit?: number) => Promise<schema.Event[]>;
  getUsersForModeration: (limit?: number) => Promise<schema.User[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<schema.User | undefined> {
    const results = await db.query.users.findMany({
      where: eq(schema.users.id, id),
      limit: 1,
    });
    return results[0];
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const results = await db.query.users.findMany({
      where: eq(schema.users.username, username),
      limit: 1,
    });
    return results[0];
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const results = await db.insert(schema.users).values(user).returning();
    return results[0];
  }

  async updateUser(id: number, data: Partial<schema.User>): Promise<schema.User | undefined> {
    const results = await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
      .returning();
    return results[0];
  }

  // Artist methods
  async getArtist(id: number): Promise<schema.Artist | undefined> {
    const results = await db.query.artists.findMany({
      where: eq(schema.artists.id, id),
      limit: 1,
    });
    return results[0];
  }

  async getArtistByUserId(userId: number): Promise<schema.Artist | undefined> {
    const results = await db.query.artists.findMany({
      where: eq(schema.artists.userId, userId),
      limit: 1,
    });
    return results[0];
  }

  async createArtist(artist: schema.InsertArtist): Promise<schema.Artist> {
    const results = await db.insert(schema.artists).values(artist).returning();
    return results[0];
  }

  async updateArtist(id: number, data: Partial<schema.Artist>): Promise<schema.Artist | undefined> {
    const results = await db
      .update(schema.artists)
      .set(data)
      .where(eq(schema.artists.id, id))
      .returning();
    return results[0];
  }

  async getTrendingArtists(limit: number = 10): Promise<schema.Artist[]> {
    return db.query.artists.findMany({
      with: {
        user: true
      },
      limit,
      orderBy: [desc(schema.artists.popularity)]
    });
  }

  // Club methods
  async getClub(id: number): Promise<schema.Club | undefined> {
    const results = await db.query.clubs.findMany({
      where: eq(schema.clubs.id, id),
      limit: 1,
    });
    return results[0];
  }

  async getClubByUserId(userId: number): Promise<schema.Club | undefined> {
    const results = await db.query.clubs.findMany({
      where: eq(schema.clubs.userId, userId),
      limit: 1,
    });
    return results[0];
  }

  async createClub(club: schema.InsertClub): Promise<schema.Club> {
    const results = await db.insert(schema.clubs).values(club).returning();
    return results[0];
  }

  async updateClub(id: number, data: Partial<schema.Club>): Promise<schema.Club | undefined> {
    const results = await db
      .update(schema.clubs)
      .set(data)
      .where(eq(schema.clubs.id, id))
      .returning();
    return results[0];
  }

  async getPopularClubs(limit: number = 10): Promise<schema.Club[]> {
    return db.query.clubs.findMany({
      limit,
      orderBy: [desc(schema.clubs.rating)]
    });
  }

  // Event methods
  async getEvent(id: number): Promise<schema.Event | undefined> {
    const results = await db.query.events.findMany({
      where: eq(schema.events.id, id),
      limit: 1,
    });
    return results[0];
  }

  async createEvent(event: schema.InsertEvent): Promise<schema.Event> {
    const results = await db.insert(schema.events).values(event).returning();
    return results[0];
  }

  async updateEvent(id: number, data: Partial<schema.Event>): Promise<schema.Event | undefined> {
    const results = await db
      .update(schema.events)
      .set(data)
      .where(eq(schema.events.id, id))
      .returning();
    return results[0];
  }

  async getEventsByClubId(clubId: number, limit: number = 20): Promise<schema.Event[]> {
    return db.query.events.findMany({
      where: eq(schema.events.clubId, clubId),
      orderBy: [asc(schema.events.date)],
      limit,
    });
  }

  async getEventsByArtistId(artistId: number, limit: number = 20): Promise<schema.Event[]> {
    const eventArtists = await db.query.eventArtists.findMany({
      where: eq(schema.eventArtists.artistId, artistId),
      with: {
        event: true
      },
      limit,
    });
    
    return eventArtists.map(ea => ea.event);
  }

  async getAllEvents(limit: number = 20): Promise<schema.Event[]> {
    return db.query.events.findMany({
      orderBy: [asc(schema.events.date)],
      limit,
    });
  }

  async getEventsByCategory(category: string, limit: number = 20): Promise<schema.Event[]> {
    return db.query.events.findMany({
      where: eq(schema.events.category, category),
      orderBy: [asc(schema.events.date)],
      limit,
    });
  }

  async searchEvents(query: string, limit: number = 20): Promise<schema.Event[]> {
    return db.query.events.findMany({
      where: like(schema.events.title, `%${query}%`),
      orderBy: [asc(schema.events.date)],
      limit,
    });
  }

  // Invitation methods
  async getInvitation(id: number): Promise<schema.Invitation | undefined> {
    const results = await db.query.invitations.findMany({
      where: eq(schema.invitations.id, id),
      limit: 1,
    });
    return results[0];
  }

  async createInvitation(invitation: schema.InsertInvitation): Promise<schema.Invitation> {
    const results = await db.insert(schema.invitations).values(invitation).returning();
    return results[0];
  }

  async updateInvitation(id: number, data: Partial<schema.Invitation>): Promise<schema.Invitation | undefined> {
    const results = await db
      .update(schema.invitations)
      .set(data)
      .where(eq(schema.invitations.id, id))
      .returning();
    return results[0];
  }

  async getInvitationsByArtistId(artistId: number): Promise<schema.Invitation[]> {
    return db.query.invitations.findMany({
      where: eq(schema.invitations.artistId, artistId),
      with: {
        club: true
      },
      orderBy: [desc(schema.invitations.createdAt)],
    });
  }

  async getInvitationsByClubId(clubId: number): Promise<schema.Invitation[]> {
    return db.query.invitations.findMany({
      where: eq(schema.invitations.clubId, clubId),
      with: {
        artist: true
      },
      orderBy: [desc(schema.invitations.createdAt)],
    });
  }

  // Feedback methods
  async getFeedback(id: number): Promise<schema.Feedback | undefined> {
    const results = await db.query.feedback.findMany({
      where: eq(schema.feedback.id, id),
      limit: 1,
    });
    return results[0];
  }

  async createFeedback(feedback: schema.InsertFeedback): Promise<schema.Feedback> {
    const results = await db.insert(schema.feedback).values(feedback).returning();
    return results[0];
  }

  async getFeedbackByArtistId(artistId: number, limit: number = 10): Promise<schema.Feedback[]> {
    return db.query.feedback.findMany({
      where: eq(schema.feedback.artistId, artistId),
      with: {
        user: true,
        event: true
      },
      orderBy: [desc(schema.feedback.createdAt)],
      limit,
    });
  }

  async getFeedbackByClubId(clubId: number, limit: number = 10): Promise<schema.Feedback[]> {
    return db.query.feedback.findMany({
      where: eq(schema.feedback.clubId, clubId),
      with: {
        user: true,
        event: true
      },
      orderBy: [desc(schema.feedback.createdAt)],
      limit,
    });
  }

  // Transaction methods
  async createTransaction(transaction: schema.InsertTransaction): Promise<schema.Transaction> {
    const results = await db.insert(schema.transactions).values(transaction).returning();
    return results[0];
  }

  async getTransactionsByUserId(userId: number, limit: number = 20): Promise<schema.Transaction[]> {
    return db.query.transactions.findMany({
      where: eq(schema.transactions.userId, userId),
      orderBy: [desc(schema.transactions.createdAt)],
      limit,
    });
  }

  // QR code methods
  async generateEventQRCode(eventId: number): Promise<string> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    
    const data = {
      type: "event",
      id: event.id,
      title: event.title,
      timestamp: new Date().toISOString()
    };
    
    return createQRCode(JSON.stringify(data));
  }

  async generateUserTicketQRCode(userId: number, eventId: number): Promise<string> {
    const [user, event] = await Promise.all([
      this.getUser(userId),
      this.getEvent(eventId)
    ]);
    
    if (!user || !event) {
      throw new Error("User or Event not found");
    }
    
    const data = {
      type: "ticket",
      userId: user.id,
      username: user.username,
      eventId: event.id,
      eventTitle: event.title,
      timestamp: new Date().toISOString()
    };
    
    return createQRCode(JSON.stringify(data));
  }

  // Admin methods
  async getAdminStats() {
    const [
      userCount,
      artistCount,
      clubCount,
      eventCount
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(schema.users),
      db.select({ count: sql<number>`count(*)` }).from(schema.artists),
      db.select({ count: sql<number>`count(*)` }).from(schema.clubs),
      db.select({ count: sql<number>`count(*)` }).from(schema.events),
    ]);

    // Dummy data for charts (in a real app, this would use actual data from db queries)
    const userGrowthData = [
      { date: "Jan", count: 10 },
      { date: "Fév", count: 25 },
      { date: "Mar", count: 40 },
      { date: "Avr", count: 65 },
      { date: "Mai", count: 90 },
      { date: "Jun", count: 120 },
    ];

    const revenueByGenre = [
      { name: "House", value: 5200 },
      { name: "Techno", value: 4800 },
      { name: "Hip-Hop", value: 3900 },
      { name: "Jazz", value: 2700 },
      { name: "EDM", value: 4100 },
    ];

    return {
      userCount: userCount[0].count,
      artistCount: artistCount[0].count,
      clubCount: clubCount[0].count,
      eventCount: eventCount[0].count,
      userGrowthData,
      revenueByGenre
    };
  }

  async getEventsForModeration(limit: number = 10): Promise<schema.Event[]> {
    return db.query.events.findMany({
      where: eq(schema.events.isApproved, false),
      orderBy: [desc(schema.events.createdAt)],
      limit,
    });
  }

  async getUsersForModeration(limit: number = 10): Promise<schema.User[]> {
    return db.query.users.findMany({
      where: eq(schema.users.isVerified, false),
      orderBy: [desc(schema.users.createdAt)],
      limit,
    });
  }
}

// Create and export storage instance
export const storage = new DatabaseStorage();
