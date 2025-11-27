// storage.ts
import {
  User, InsertUser, Artist, InsertArtist, Club, InsertClub,
  Event, InsertEvent, EventArtist, InsertEventArtist,
  Invitation, InsertInvitation, Ticket, InsertTicket,
  Feedback, InsertFeedback, Transaction, InsertTransaction,
  Employee, InsertEmployee, PosDevice, InsertPosDevice,
  ProductCategory, InsertProductCategory, Product, InsertProduct,
  PosTable, InsertPosTable, Order, InsertOrder, OrderItem, InsertOrderItem,
  PosHistory, InsertPosHistory, PaymentMethod, InsertPaymentMethod
} from "@shared/schema";
import { pool } from "./db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema"; // Assumes @shared/schema exports all tables: users, artists, etc.
import {
  eq, and, gte, lte, SQL
} from "drizzle-orm";

const db = drizzle(pool, { schema });

export interface Storage {
  // User methods
  getUser(id: number): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  getAllUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }): Promise<User[]>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;

  // Artist methods
  getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist>;
  getArtistByUserId(userId: number): Promise<Artist | undefined>;
  createArtist(artistData: InsertArtist): Promise<Artist>;
  updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist>;
  deleteArtist(id: number): Promise<boolean>;

  // Club methods
  getAllClubs(filters?: { city?: string; country?: string; minRating?: number; minCapacity?: number }): Promise<Club[]>;
  getClub(id: number): Promise<Club>;
  getClubByUserId(userId: number): Promise<Club | undefined>;
  createClub(clubData: InsertClub): Promise<Club>;
  updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club>;
  deleteClub(id: number): Promise<boolean>;

  // Event methods
  getAllEvents(filters?: {
    clubId?: number; category?: string; city?: string; country?: string;
    minDate?: Date; maxDate?: Date; minPrice?: number; maxPrice?: number;
    isApproved?: boolean; mood?: string
  }): Promise<Event[]>;
  getEvent(id: number): Promise<Event>;
  getEventsByClubId(clubId: number): Promise<Event[]>;
  createEvent(eventData: InsertEvent): Promise<Event>;
  updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<boolean>;

  // Event Artist methods
  getAllEventArtists(filters?: { eventId?: number; artistId?: number }): Promise<EventArtist[]>;
  getEventArtistsByEventId(eventId: number): Promise<EventArtist[]>;
  getEventArtistsByArtistId(artistId: number): Promise<EventArtist[]>;
  createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist>;
  deleteEventArtist(eventId: number, artistId: number): Promise<boolean>;

  // Invitation methods
  getAllInvitations(filters?: { clubId?: number; artistId?: number; status?: string }): Promise<Invitation[]>;
  getInvitation(id: number): Promise<Invitation>;
  getInvitationsByClubId(clubId: number): Promise<Invitation[]>;
  getInvitationsByArtistId(artistId: number): Promise<Invitation[]>;
  createInvitation(invitationData: InsertInvitation): Promise<Invitation>;
  updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation>;
  deleteInvitation(id: number): Promise<boolean>;

  // Ticket methods
  getAllTickets(filters?: { eventId?: number; userId?: number; isUsed?: boolean }): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket>;
  getTicketsByEventId(eventId: number): Promise<Ticket[]>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  createTicket(ticketData: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket>;
  deleteTicket(id: number): Promise<boolean>;

  // Feedback methods
  getAllFeedback(filters?: { eventId?: number; artistId?: number; clubId?: number; userId?: number; minRating?: number }): Promise<Feedback[]>;
  getFeedback(id: number): Promise<Feedback>;
  createFeedback(feedbackData: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback>;
  deleteFeedback(id: number): Promise<boolean>;

  // Transaction methods
  getAllTransactions(filters?: { userId?: number; type?: string; minAmount?: number; maxAmount?: number; startDate?: Date; endDate?: Date }): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transactionData: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: number): Promise<boolean>;

  // Employee methods (POS)
  getAllEmployees(filters?: { role?: string }): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee>; // Fixed to number
  getEmployeeByPin(pin: string): Promise<Employee | undefined>;
  createEmployee(employeeData: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employeeData: Partial<InsertEmployee>): Promise<Employee>; // Fixed to number
  deleteEmployee(id: number): Promise<boolean>; // Fixed to number

  // POS Device methods
  getAllPosDevices(filters?: { isActive?: boolean }): Promise<PosDevice[]>;
  getPosDevice(id: number): Promise<PosDevice>;
  createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice>;
  updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice>;
  deletePosDevice(id: number): Promise<boolean>;

  // Product Category methods
  getAllProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory>;
  createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory>;
  updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory>;
  deleteProductCategory(id: number): Promise<boolean>;

  // Product methods
  getAllProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }): Promise<Product[]>;
  getProduct(id: number): Promise<Product>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  createProduct(productData: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;

  // POS Table methods
  getAllPosTables(filters?: { isOccupied?: boolean }): Promise<PosTable[]>;
  getPosTable(id: number): Promise<PosTable>;
  createPosTable(tableData: InsertPosTable): Promise<PosTable>;
  updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable>;
  deletePosTable(id: number): Promise<boolean>;

  // Order methods
  getAllOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: Date; endDate?: Date }): Promise<Order[]>; // Fixed employeeId to number
  getOrder(id: number): Promise<Order>;
  getOrdersByTableId(tableId: number): Promise<Order[]>;
  getOrdersByEmployeeId(employeeId: number): Promise<Order[]>; // Fixed to number
  createOrder(orderData: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: number): Promise<boolean>;

  // Order Item methods
  getAllOrderItems(filters?: { orderId?: number }): Promise<OrderItem[]>;
  getOrderItem(id: number): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: number, orderItemData: Partial<InsertOrderItem>): Promise<OrderItem>;
  deleteOrderItem(id: number): Promise<boolean>;

  // POS History methods
  getAllPosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: Date; endDate?: Date }): Promise<PosHistory[]>; // Fixed employeeId to number
  getPosHistory(id: number): Promise<PosHistory>;
  createPosHistory(historyData: InsertPosHistory): Promise<PosHistory>;
  updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory>;
  deletePosHistory(id: number): Promise<boolean>;

  // Payment Method methods
  getAllPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethod(id: number): Promise<PaymentMethod>;
  createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<boolean>;
}

export const storage: Storage = {
  // User methods implementation
  async getUser(id: number): Promise<User> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    if (result.length === 0) throw new Error("User not found");
    return result[0];
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  },

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(userData).returning();
    return result[0];
  },

  async getAllUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }): Promise<User[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.role) conditions.push(eq(schema.users.role, filters.role));
    if (filters?.city) conditions.push(eq(schema.users.city, filters.city));
    if (filters?.country) conditions.push(eq(schema.users.country, filters.country));
    if (filters?.isVerified !== undefined) conditions.push(eq(schema.users.isVerified, filters.isVerified));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.users).where(where).orderBy(schema.users.id);
  },

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    if (Object.keys(userData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.users).set(userData).where(eq(schema.users.id, id)).returning();
    if (result.length === 0) throw new Error("User not found");
    return result[0];
  },

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).returning({ id: schema.users.id });
    return result.length > 0;
  },

  // Artist methods implementation
  async getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.genre) conditions.push(eq(schema.artists.genre, filters.genre));
    if (filters?.minRate !== undefined) conditions.push(gte(schema.artists.rate, filters.minRate));
    if (filters?.maxRate !== undefined) conditions.push(lte(schema.artists.rate, filters.maxRate));
    if (filters?.minPopularity !== undefined) conditions.push(gte(schema.artists.popularity, filters.minPopularity));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.artists).where(where).orderBy(schema.artists.id);
  },

  async getArtist(id: number): Promise<Artist> {
    const result = await db.select().from(schema.artists).where(eq(schema.artists.id, id));
    if (result.length === 0) throw new Error("Artist not found");
    return result[0];
  },

  async getArtistByUserId(userId: number): Promise<Artist | undefined> {
    const result = await db.select().from(schema.artists).where(eq(schema.artists.userId, userId));
    return result[0];
  },

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    const result = await db.insert(schema.artists).values(artistData).returning();
    return result[0];
  },

  async updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
    if (Object.keys(artistData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.artists).set(artistData).where(eq(schema.artists.id, id)).returning();
    if (result.length === 0) throw new Error("Artist not found");
    return result[0];
  },

  async deleteArtist(id: number): Promise<boolean> {
    const result = await db.delete(schema.artists).where(eq(schema.artists.id, id)).returning({ id: schema.artists.id });
    return result.length > 0;
  },

  // Club methods implementation
  async getAllClubs(filters?: { city?: string; country?: string; minRating?: number; minCapacity?: number }): Promise<Club[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.city) conditions.push(eq(schema.clubs.city, filters.city));
    if (filters?.country) conditions.push(eq(schema.clubs.country, filters.country));
    if (filters?.minRating !== undefined) conditions.push(gte(schema.clubs.rating, filters.minRating));
    if (filters?.minCapacity !== undefined) conditions.push(gte(schema.clubs.capacity, filters.minCapacity));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.clubs).where(where).orderBy(schema.clubs.id);
  },

  async getClub(id: number): Promise<Club> {
    const result = await db.select().from(schema.clubs).where(eq(schema.clubs.id, id));
    if (result.length === 0) throw new Error("Club not found");
    return result[0];
  },

  async getClubByUserId(userId: number): Promise<Club | undefined> {
    const result = await db.select().from(schema.clubs).where(eq(schema.clubs.userId, userId));
    return result[0];
  },

  async createClub(clubData: InsertClub): Promise<Club> {
    const result = await db.insert(schema.clubs).values(clubData).returning();
    return result[0];
  },

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    if (Object.keys(clubData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.clubs).set(clubData).where(eq(schema.clubs.id, id)).returning();
    if (result.length === 0) throw new Error("Club not found");
    return result[0];
  },

  async deleteClub(id: number): Promise<boolean> {
    const result = await db.delete(schema.clubs).where(eq(schema.clubs.id, id)).returning({ id: schema.clubs.id });
    return result.length > 0;
  },

  // Event methods implementation
  async getAllEvents(filters?: {
    clubId?: number; category?: string; city?: string; country?: string;
    minDate?: Date; maxDate?: Date; minPrice?: number; maxPrice?: number;
    isApproved?: boolean; mood?: string
  }): Promise<Event[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.clubId !== undefined) conditions.push(eq(schema.events.clubId, filters.clubId));
    if (filters?.category) conditions.push(eq(schema.events.category, filters.category));
    if (filters?.city) conditions.push(eq(schema.events.city, filters.city));
    if (filters?.country) conditions.push(eq(schema.events.country, filters.country));
    if (filters?.minDate) conditions.push(gte(schema.events.date, filters.minDate));
    if (filters?.maxDate) conditions.push(lte(schema.events.date, filters.maxDate));
    if (filters?.minPrice !== undefined) conditions.push(gte(schema.events.price, filters.minPrice));
    if (filters?.maxPrice !== undefined) conditions.push(lte(schema.events.price, filters.maxPrice));
    if (filters?.isApproved !== undefined) conditions.push(eq(schema.events.isApproved, filters.isApproved));
    if (filters?.mood) conditions.push(eq(schema.events.mood, filters.mood));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.events).where(where).orderBy(schema.events.date, "desc");
  },

  async getEvent(id: number): Promise<Event> {
    const result = await db.select().from(schema.events).where(eq(schema.events.id, id));
    if (result.length === 0) throw new Error("Event not found");
    return result[0];
  },

  async getEventsByClubId(clubId: number): Promise<Event[]> {
    return await db.select().from(schema.events).where(eq(schema.events.clubId, clubId)).orderBy(schema.events.date, "desc");
  },

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const result = await db.insert(schema.events).values(eventData).returning();
    return result[0];
  },

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    if (Object.keys(eventData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.events).set(eventData).where(eq(schema.events.id, id)).returning();
    if (result.length === 0) throw new Error("Event not found");
    return result[0];
  },

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(schema.events).where(eq(schema.events.id, id)).returning({ id: schema.events.id });
    return result.length > 0;
  },

  // Event Artist methods implementation
  async getAllEventArtists(filters?: { eventId?: number; artistId?: number }): Promise<EventArtist[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.eventArtists.eventId, filters.eventId));
    if (filters?.artistId !== undefined) conditions.push(eq(schema.eventArtists.artistId, filters.artistId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.eventArtists).where(where);
  },

  async getEventArtistsByEventId(eventId: number): Promise<EventArtist[]> {
    return await db.select().from(schema.eventArtists).where(eq(schema.eventArtists.eventId, eventId));
  },

  async getEventArtistsByArtistId(artistId: number): Promise<EventArtist[]> {
    return await db.select().from(schema.eventArtists).where(eq(schema.eventArtists.artistId, artistId));
  },

  async createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
    const result = await db.insert(schema.eventArtists).values(eventArtistData).returning();
    return result[0];
  },

  async deleteEventArtist(eventId: number, artistId: number): Promise<boolean> {
    const result = await db.delete(schema.eventArtists).where(and(eq(schema.eventArtists.eventId, eventId), eq(schema.eventArtists.artistId, artistId))).returning({ eventId: schema.eventArtists.eventId });
    return result.length > 0;
  },

  // Invitation methods implementation
  async getAllInvitations(filters?: { clubId?: number; artistId?: number; status?: string }): Promise<Invitation[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.clubId !== undefined) conditions.push(eq(schema.invitations.clubId, filters.clubId));
    if (filters?.artistId !== undefined) conditions.push(eq(schema.invitations.artistId, filters.artistId));
    if (filters?.status) conditions.push(eq(schema.invitations.status, filters.status));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.invitations).where(where).orderBy(schema.invitations.createdAt, "desc");
  },

  async getInvitation(id: number): Promise<Invitation> {
    const result = await db.select().from(schema.invitations).where(eq(schema.invitations.id, id));
    if (result.length === 0) throw new Error("Invitation not found");
    return result[0];
  },

  async getInvitationsByClubId(clubId: number): Promise<Invitation[]> {
    return await db.select().from(schema.invitations).where(eq(schema.invitations.clubId, clubId)).orderBy(schema.invitations.createdAt, "desc");
  },

  async getInvitationsByArtistId(artistId: number): Promise<Invitation[]> {
    return await db.select().from(schema.invitations).where(eq(schema.invitations.artistId, artistId)).orderBy(schema.invitations.createdAt, "desc");
  },

  async createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
    const result = await db.insert(schema.invitations).values(invitationData).returning();
    return result[0];
  },

  async updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
    if (Object.keys(invitationData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.invitations).set(invitationData).where(eq(schema.invitations.id, id)).returning();
    if (result.length === 0) throw new Error("Invitation not found");
    return result[0];
  },

  async deleteInvitation(id: number): Promise<boolean> {
    const result = await db.delete(schema.invitations).where(eq(schema.invitations.id, id)).returning({ id: schema.invitations.id });
    return result.length > 0;
  },

  // Ticket methods implementation
  async getAllTickets(filters?: { eventId?: number; userId?: number; isUsed?: boolean }): Promise<Ticket[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.tickets.eventId, filters.eventId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.tickets.userId, filters.userId));
    if (filters?.isUsed !== undefined) conditions.push(eq(schema.tickets.isUsed, filters.isUsed));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.tickets).where(where).orderBy(schema.tickets.purchaseDate, "desc");
  },

  async getTicket(id: number): Promise<Ticket> {
    const result = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
    if (result.length === 0) throw new Error("Ticket not found");
    return result[0];
  },

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return await db.select().from(schema.tickets).where(eq(schema.tickets.eventId, eventId)).orderBy(schema.tickets.purchaseDate, "desc");
  },

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return await db.select().from(schema.tickets).where(eq(schema.tickets.userId, userId)).orderBy(schema.tickets.purchaseDate, "desc");
  },

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const result = await db.insert(schema.tickets).values(ticketData).returning();
    return result[0];
  },

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    if (Object.keys(ticketData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.tickets).set(ticketData).where(eq(schema.tickets.id, id)).returning();
    if (result.length === 0) throw new Error("Ticket not found");
    return result[0];
  },

  async deleteTicket(id: number): Promise<boolean> {
    const result = await db.delete(schema.tickets).where(eq(schema.tickets.id, id)).returning({ id: schema.tickets.id });
    return result.length > 0;
  },

  // Feedback methods implementation
  async getAllFeedback(filters?: { eventId?: number; artistId?: number; clubId?: number; userId?: number; minRating?: number }): Promise<Feedback[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.feedback.eventId, filters.eventId));
    if (filters?.artistId !== undefined) conditions.push(eq(schema.feedback.artistId, filters.artistId));
    if (filters?.clubId !== undefined) conditions.push(eq(schema.feedback.clubId, filters.clubId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.feedback.userId, filters.userId));
    if (filters?.minRating !== undefined) conditions.push(gte(schema.feedback.rating, filters.minRating));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.feedback).where(where);
  },

  async getFeedback(id: number): Promise<Feedback> {
    const result = await db.select().from(schema.feedback).where(eq(schema.feedback.id, id));
    if (result.length === 0) throw new Error("Feedback not found");
    return result[0];
  },

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(schema.feedback).values(feedbackData).returning();
    return result[0];
  },

  async updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
    if (Object.keys(feedbackData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.feedback).set(feedbackData).where(eq(schema.feedback.id, id)).returning();
    if (result.length === 0) throw new Error("Feedback not found");
    return result[0];
  },

  async deleteFeedback(id: number): Promise<boolean> {
    const result = await db.delete(schema.feedback).where(eq(schema.feedback.id, id)).returning({ id: schema.feedback.id });
    return result.length > 0;
  },

  // Transaction methods implementation
  async getAllTransactions(filters?: { userId?: number; type?: string; minAmount?: number; maxAmount?: number; startDate?: Date; endDate?: Date }): Promise<Transaction[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.transactions.userId, filters.userId));
    if (filters?.type) conditions.push(eq(schema.transactions.type, filters.type));
    if (filters?.minAmount !== undefined) conditions.push(gte(schema.transactions.amount, filters.minAmount));
    if (filters?.maxAmount !== undefined) conditions.push(lte(schema.transactions.amount, filters.maxAmount));
    if (filters?.startDate) conditions.push(gte(schema.transactions.createdAt, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.transactions.createdAt, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.transactions).where(where).orderBy(schema.transactions.createdAt, "desc");
  },

  async getTransaction(id: number): Promise<Transaction> {
    const result = await db.select().from(schema.transactions).where(eq(schema.transactions.id, id));
    if (result.length === 0) throw new Error("Transaction not found");
    return result[0];
  },

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(schema.transactions).where(eq(schema.transactions.userId, userId)).orderBy(schema.transactions.createdAt, "desc");
  },

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(schema.transactions).values(transactionData).returning();
    return result[0];
  },

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    if (Object.keys(transactionData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.transactions).set(transactionData).where(eq(schema.transactions.id, id)).returning();
    if (result.length === 0) throw new Error("Transaction not found");
    return result[0];
  },

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await db.delete(schema.transactions).where(eq(schema.transactions.id, id)).returning({ id: schema.transactions.id });
    return result.length > 0;
  },

  // Employee methods (POS)
  async getAllEmployees(filters?: { role?: string }): Promise<Employee[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.role) conditions.push(eq(schema.employees.role, filters.role));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.employees).where(where).orderBy(schema.employees.id);
  },

  async getEmployee(id: number): Promise<Employee> {
    const result = await db.select().from(schema.employees).where(eq(schema.employees.id, id));
    if (result.length === 0) throw new Error("Employee not found");
    return result[0];
  },

  async getEmployeeByPin(pin: string): Promise<Employee | undefined> {
    const result = await db.select().from(schema.employees).where(eq(schema.employees.pin, pin));
    return result[0];
  },

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const result = await db.insert(schema.employees).values(employeeData).returning();
    return result[0];
  },

  async updateEmployee(id: number, employeeData: Partial<InsertEmployee>): Promise<Employee> {
    if (Object.keys(employeeData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.employees).set(employeeData).where(eq(schema.employees.id, id)).returning();
    if (result.length === 0) throw new Error("Employee not found");
    return result[0];
  },

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(schema.employees).where(eq(schema.employees.id, id)).returning({ id: schema.employees.id });
    return result.length > 0;
  },

  // POS Device methods
  async getAllPosDevices(filters?: { isActive?: boolean }): Promise<PosDevice[]> { // Note: schema has status, assuming isActive maps to status
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.isActive !== undefined) conditions.push(eq(schema.posDevices.status, filters.isActive));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.posDevices).where(where).orderBy(schema.posDevices.id);
  },

  async getPosDevice(id: number): Promise<PosDevice> {
    const result = await db.select().from(schema.posDevices).where(eq(schema.posDevices.id, id));
    if (result.length === 0) throw new Error("POS device not found");
    return result[0];
  },

  async createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice> {
    const result = await db.insert(schema.posDevices).values(deviceData).returning();
    return result[0];
  },

  async updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice> {
    if (Object.keys(deviceData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.posDevices).set(deviceData).where(eq(schema.posDevices.id, id)).returning();
    if (result.length === 0) throw new Error("POS device not found");
    return result[0];
  },

  async deletePosDevice(id: number): Promise<boolean> {
    const result = await db.delete(schema.posDevices).where(eq(schema.posDevices.id, id)).returning({ id: schema.posDevices.id });
    return result.length > 0;
  },

  // Product Category methods
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(schema.productCategories).orderBy(schema.productCategories.id);
  },

  async getProductCategory(id: number): Promise<ProductCategory> {
    const result = await db.select().from(schema.productCategories).where(eq(schema.productCategories.id, id));
    if (result.length === 0) throw new Error("Product category not found");
    return result[0];
  },

  async createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
    const result = await db.insert(schema.productCategories).values(categoryData).returning();
    return result[0];
  },

  async updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory> {
    if (Object.keys(categoryData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.productCategories).set(categoryData).where(eq(schema.productCategories.id, id)).returning();
    if (result.length === 0) throw new Error("Product category not found");
    return result[0];
  },

  async deleteProductCategory(id: number): Promise<boolean> {
    const result = await db.delete(schema.productCategories).where(eq(schema.productCategories.id, id)).returning({ id: schema.productCategories.id });
    return result.length > 0;
  },

  // Product methods
  async getAllProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }): Promise<Product[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.categoryId !== undefined) conditions.push(eq(schema.products.categoryId, filters.categoryId));
    if (filters?.minPrice !== undefined) conditions.push(gte(schema.products.price, filters.minPrice));
    if (filters?.maxPrice !== undefined) conditions.push(lte(schema.products.price, filters.maxPrice));
    if (filters?.isAvailable !== undefined) conditions.push(eq(schema.products.isAvailable, filters.isAvailable));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.products).where(where).orderBy(schema.products.id);
  },

  async getProduct(id: number): Promise<Product> {
    const result = await db.select().from(schema.products).where(eq(schema.products.id, id));
    if (result.length === 0) throw new Error("Product not found");
    return result[0];
  },

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return await db.select().from(schema.products).where(eq(schema.products.categoryId, categoryId)).orderBy(schema.products.id);
  },

  async createProduct(productData: InsertProduct): Promise<Product> {
    const result = await db.insert(schema.products).values(productData).returning();
    return result[0];
  },

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    if (Object.keys(productData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.products).set(productData).where(eq(schema.products.id, id)).returning();
    if (result.length === 0) throw new Error("Product not found");
    return result[0];
  },

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id)).returning({ id: schema.products.id });
    return result.length > 0;
  },

  // POS Table methods
  async getAllPosTables(filters?: { isOccupied?: boolean }): Promise<PosTable[]> { // Assuming status maps to isOccupied, e.g., 'occupied'
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.isOccupied !== undefined) conditions.push(eq(schema.posTables.status, filters.isOccupied ? 'occupied' : 'available')); // Adjust mapping as needed
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.posTables).where(where).orderBy(schema.posTables.id);
  },

  async getPosTable(id: number): Promise<PosTable> {
    const result = await db.select().from(schema.posTables).where(eq(schema.posTables.id, id));
    if (result.length === 0) throw new Error("POS table not found");
    return result[0];
  },

  async createPosTable(tableData: InsertPosTable): Promise<PosTable> {
    const result = await db.insert(schema.posTables).values(tableData).returning();
    return result[0];
  },

  async updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable> {
    if (Object.keys(tableData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.posTables).set(tableData).where(eq(schema.posTables.id, id)).returning();
    if (result.length === 0) throw new Error("POS table not found");
    return result[0];
  },

  async deletePosTable(id: number): Promise<boolean> {
    const result = await db.delete(schema.posTables).where(eq(schema.posTables.id, id)).returning({ id: schema.posTables.id });
    return result.length > 0;
  },

  // Order methods
  async getAllOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: Date; endDate?: Date }): Promise<Order[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.tableId !== undefined) conditions.push(eq(schema.orders.tableId, filters.tableId));
    if (filters?.employeeId !== undefined) conditions.push(eq(schema.orders.employeeId, filters.employeeId)); // Assuming orders has employeeId; adjust if not
    if (filters?.status) conditions.push(eq(schema.orders.status, filters.status));
    if (filters?.startDate) conditions.push(gte(schema.orders.createdAt, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.orders.updatedAt, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.orders).where(where).orderBy(schema.orders.id);
  },

  async getOrder(id: number): Promise<Order> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    if (result.length === 0) throw new Error("Order not found");
    return result[0];
  },

  async getOrdersByTableId(tableId: number): Promise<Order[]> {
    return await db.select().from(schema.orders).where(eq(schema.orders.tableId, tableId)).orderBy(schema.orders.id);
  },

  async getOrdersByEmployeeId(employeeId: number): Promise<Order[]> { // Assuming orders has employeeId; adjust if needed
    return await db.select().from(schema.orders).where(eq(schema.orders.employeeId, employeeId)).orderBy(schema.orders.id);
  },

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const result = await db.insert(schema.orders).values(orderData).returning();
    return result[0];
  },

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    if (Object.keys(orderData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.orders).set(orderData).where(eq(schema.orders.id, id)).returning();
    if (result.length === 0) throw new Error("Order not found");
    return result[0];
  },

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(schema.orders).where(eq(schema.orders.id, id)).returning({ id: schema.orders.id });
    return result.length > 0;
  },

  // Order Item methods
  async getAllOrderItems(filters?: { orderId?: number }): Promise<OrderItem[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.orderId !== undefined) conditions.push(eq(schema.orderItems.orderId, filters.orderId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.orderItems).where(where).orderBy(schema.orderItems.id);
  },

  async getOrderItem(id: number): Promise<OrderItem> {
    const result = await db.select().from(schema.orderItems).where(eq(schema.orderItems.id, id));
    if (result.length === 0) throw new Error("Order item not found");
    return result[0];
  },

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId)).orderBy(schema.orderItems.id);
  },

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(schema.orderItems).values(orderItemData).returning();
    return result[0];
  },

  async updateOrderItem(id: number, orderItemData: Partial<InsertOrderItem>): Promise<OrderItem> {
    if (Object.keys(orderItemData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.orderItems).set(orderItemData).where(eq(schema.orderItems.id, id)).returning();
    if (result.length === 0) throw new Error("Order item not found");
    return result[0];
  },

  async deleteOrderItem(id: number): Promise<boolean> {
    const result = await db.delete(schema.orderItems).where(eq(schema.orderItems.id, id)).returning({ id: schema.orderItems.id });
    return result.length > 0;
  },

  // POS History methods
  async getAllPosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: Date; endDate?: Date }): Promise<PosHistory[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.employeeId !== undefined) conditions.push(eq(schema.posHistory.userId, filters.employeeId));
    if (filters?.deviceId !== undefined) conditions.push(eq(schema.posHistory.deviceId, filters.deviceId)); // Assuming posHistory has deviceId
    if (filters?.startDate) conditions.push(gte(schema.posHistory.timestamp, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.posHistory.timestamp, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.posHistory).where(where).orderBy(schema.posHistory.timestamp, "desc");
  },

  async getPosHistory(id: number): Promise<PosHistory> {
    const result = await db.select().from(schema.posHistory).where(eq(schema.posHistory.id, id));
    if (result.length === 0) throw new Error("POS history not found");
    return result[0];
  },

  async createPosHistory(historyData: InsertPosHistory): Promise<PosHistory> {
    const result = await db.insert(schema.posHistory).values(historyData).returning();
    return result[0];
  },

  async updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory> {
    if (Object.keys(historyData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.posHistory).set(historyData).where(eq(schema.posHistory.id, id)).returning();
    if (result.length === 0) throw new Error("POS history not found");
    return result[0];
  },

  async deletePosHistory(id: number): Promise<boolean> {
    const result = await db.delete(schema.posHistory).where(eq(schema.posHistory.id, id)).returning({ id: schema.posHistory.id });
    return result.length > 0;
  },

  // Payment Method methods
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select().from(schema.paymentMethods).orderBy(schema.paymentMethods.id);
  },

  async getPaymentMethod(id: number): Promise<PaymentMethod> {
    const result = await db.select().from(schema.paymentMethods).where(eq(schema.paymentMethods.id, id));
    if (result.length === 0) throw new Error("Payment method not found");
    return result[0];
  },

  async createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod> {
    const result = await db.insert(schema.paymentMethods).values(paymentMethodData).returning();
    return result[0];
  },

  async updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
    if (Object.keys(paymentMethodData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.paymentMethods).set(paymentMethodData).where(eq(schema.paymentMethods.id, id)).returning();
    if (result.length === 0) throw new Error("Payment method not found");
    return result[0];
  },

  async deletePaymentMethod(id: number): Promise<boolean> {
    const result = await db.delete(schema.paymentMethods).where(eq(schema.paymentMethods.id, id)).returning({ id: schema.paymentMethods.id });
    return result.length > 0;
  },
};