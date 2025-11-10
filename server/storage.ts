// storage.ts
import {
  User, InsertUser,
  Artist, InsertArtist, ArtistPortfolio, InsertArtistPortfolio,
  Club, InsertClub, ClubLocation, InsertClubLocation, ClubTable, InsertClubTable,
  Event, InsertEvent, EventArtist, InsertEventArtist, EventReservedTable, InsertEventReservedTable,
  EventParticipant, InsertEventParticipant,
  Invitation, InsertInvitation,
  Ticket, InsertTicket, TicketType, InsertTicketType,
  Feedback, InsertFeedback, FeedbackLike, InsertFeedbackLike, FeedbackComment, InsertFeedbackComment,
  Photo, InsertPhoto, PhotoLike, InsertPhotoLike, PhotoComment, InsertPhotoComment,
  CollaborationMilestone, InsertCollaborationMilestone, CollaborationMessage, InsertCollaborationMessage,
  Transaction, InsertTransaction,
  CustomerProfile, InsertCustomerProfile,
  MusicGenre, InsertMusicGenre,
  DrinkType, InsertDrinkType,
  CustomerTag, InsertCustomerTag,
  Promotion, InsertPromotion,
  PaymentMethod, InsertPaymentMethod,
  Invoice, InsertInvoice,
  Employee, InsertEmployee, PosDevice, InsertPosDevice,
  ProductCategory, InsertProductCategory, Product, InsertProduct,
  PosTable, InsertPosTable, Order, InsertOrder, OrderItem, InsertOrderItem,
  PosHistory, InsertPosHistory, PosPaymentMethod, InsertPosPaymentMethod
} from "@shared/schema";
import { pool } from "./db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
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
  getArtist(id: number): Promise<Artist>;
  getArtistByUserId(userId: number): Promise<Artist | undefined>;
  createArtist(artistData: InsertArtist): Promise<Artist>;
  getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]>;
  updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist>;
  deleteArtist(id: number): Promise<boolean>;

  // Artist Portfolio methods
  getArtistPortfolio(id: number): Promise<ArtistPortfolio>;
  getArtistPortfoliosByArtistId(artistId: number): Promise<ArtistPortfolio[]>;
  createArtistPortfolio(portfolioData: InsertArtistPortfolio): Promise<ArtistPortfolio>;
  getAllArtistPortfolios(filters?: { artistId?: number }): Promise<ArtistPortfolio[]>;
  updateArtistPortfolio(id: number, portfolioData: Partial<InsertArtistPortfolio>): Promise<ArtistPortfolio>;
  deleteArtistPortfolio(id: number): Promise<boolean>;

  // Club methods
  getClub(id: number): Promise<Club>;
  getClubByUserId(userId: number): Promise<Club | undefined>;
  createClub(clubData: InsertClub): Promise<Club>;
  getAllClubs(filters?: { city?: string; country?: string; category?: string; featured?: boolean }): Promise<Club[]>;
  updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club>;
  deleteClub(id: number): Promise<boolean>;

  // Club Location methods
  getClubLocation(id: number): Promise<ClubLocation>;
  getClubLocationsByClubId(clubId: number): Promise<ClubLocation[]>;
  createClubLocation(locationData: InsertClubLocation): Promise<ClubLocation>;
  getAllClubLocations(filters?: { clubId?: number }): Promise<ClubLocation[]>;
  updateClubLocation(id: number, locationData: Partial<InsertClubLocation>): Promise<ClubLocation>;
  deleteClubLocation(id: number): Promise<boolean>;

  // Club Table methods
  getClubTable(id: number): Promise<ClubTable>;
  getClubTablesByClubId(clubId: number): Promise<ClubTable[]>;
  createClubTable(tableData: InsertClubTable): Promise<ClubTable>;
  getAllClubTables(filters?: { clubId?: number; available?: boolean }): Promise<ClubTable[]>;
  updateClubTable(id: number, tableData: Partial<InsertClubTable>): Promise<ClubTable>;
  deleteClubTable(id: number): Promise<boolean>;

  // Event methods
  getEvent(id: number): Promise<Event>;
  createEvent(eventData: InsertEvent): Promise<Event>;
  getAllEvents(filters?: { clubId?: number; city?: string; country?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Event[]>;
  updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<boolean>;

  // Event Artist methods
  getEventArtist(eventId: number, artistId: number): Promise<EventArtist | undefined>;
  createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist>;
  getAllEventArtists(filters?: { eventId?: number; artistId?: number }): Promise<EventArtist[]>;
  updateEventArtist(eventId: number, artistId: number, eventArtistData: Partial<InsertEventArtist>): Promise<EventArtist>;
  deleteEventArtist(eventId: number, artistId: number): Promise<boolean>;

  // Event Reserved Table methods
  getEventReservedTable(eventId: number, tableId: number): Promise<EventReservedTable | undefined>;
  createEventReservedTable(reservedTableData: InsertEventReservedTable): Promise<EventReservedTable>;
  getAllEventReservedTables(filters?: { eventId?: number; tableId?: number }): Promise<EventReservedTable[]>;
  updateEventReservedTable(eventId: number, tableId: number, reservedTableData: Partial<InsertEventReservedTable>): Promise<EventReservedTable>;
  deleteEventReservedTable(eventId: number, tableId: number): Promise<boolean>;

  // Event Participant methods
  getEventParticipant(eventId: number, userId: number): Promise<EventParticipant | undefined>;
  createEventParticipant(participantData: InsertEventParticipant): Promise<EventParticipant>;
  getAllEventParticipants(filters?: { eventId?: number; userId?: number; status?: string }): Promise<EventParticipant[]>;
  updateEventParticipant(eventId: number, userId: number, participantData: Partial<InsertEventParticipant>): Promise<EventParticipant>;
  deleteEventParticipant(eventId: number, userId: number): Promise<boolean>;

  // Invitation methods
  getInvitation(id: number): Promise<Invitation>;
  createInvitation(invitationData: InsertInvitation): Promise<Invitation>;
  getAllInvitations(filters?: { eventId?: number; userId?: number; status?: string }): Promise<Invitation[]>;
  updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation>;
  deleteInvitation(id: number): Promise<boolean>;

  // Ticket methods
  getTicket(id: number): Promise<Ticket>;
  createTicket(ticketData: InsertTicket): Promise<Ticket>;
  getAllTickets(filters?: { eventId?: number; userId?: number; status?: string }): Promise<Ticket[]>;
  updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket>;
  deleteTicket(id: number): Promise<boolean>;

  // Ticket Type methods
  getTicketType(id: number): Promise<TicketType>;
  getTicketTypesByEventId(eventId: number): Promise<TicketType[]>;
  createTicketType(ticketTypeData: InsertTicketType): Promise<TicketType>;
  getAllTicketTypes(filters?: { eventId?: number }): Promise<TicketType[]>;
  updateTicketType(id: number, ticketTypeData: Partial<InsertTicketType>): Promise<TicketType>;
  deleteTicketType(id: number): Promise<boolean>;

  // Feedback methods
  getFeedback(id: number): Promise<Feedback>;
  createFeedback(feedbackData: InsertFeedback): Promise<Feedback>;
  getAllFeedback(filters?: { sourceType?: string; sourceId?: number; minRating?: number }): Promise<Feedback[]>;
  updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback>;
  deleteFeedback(id: number): Promise<boolean>;

  // Feedback Like methods
  getFeedbackLike(feedbackId: number, userId: number): Promise<FeedbackLike | undefined>;
  createFeedbackLike(likeData: InsertFeedbackLike): Promise<FeedbackLike>;
  getAllFeedbackLikes(filters?: { feedbackId?: number; userId?: number }): Promise<FeedbackLike[]>;
  updateFeedbackLike(feedbackId: number, userId: number, likeData: Partial<InsertFeedbackLike>): Promise<FeedbackLike>;
  deleteFeedbackLike(feedbackId: number, userId: number): Promise<boolean>;

  // Feedback Comment methods
  getFeedbackComment(id: number): Promise<FeedbackComment>;
  createFeedbackComment(commentData: InsertFeedbackComment): Promise<FeedbackComment>;
  getAllFeedbackComments(filters?: { feedbackId?: number }): Promise<FeedbackComment[]>;
  updateFeedbackComment(id: number, commentData: Partial<InsertFeedbackComment>): Promise<FeedbackComment>;
  deleteFeedbackComment(id: number): Promise<boolean>;

  // Photo methods
  getPhoto(id: number): Promise<Photo>;
  createPhoto(photoData: InsertPhoto): Promise<Photo>;
  getAllPhotos(filters?: { userId?: number; eventId?: number }): Promise<Photo[]>;
  updatePhoto(id: number, photoData: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<boolean>;

  // Photo Like methods
  getPhotoLike(photoId: number, userId: number): Promise<PhotoLike | undefined>;
  createPhotoLike(likeData: InsertPhotoLike): Promise<PhotoLike>;
  getAllPhotoLikes(filters?: { photoId?: number; userId?: number }): Promise<PhotoLike[]>;
  updatePhotoLike(photoId: number, userId: number, likeData: Partial<InsertPhotoLike>): Promise<PhotoLike>;
  deletePhotoLike(photoId: number, userId: number): Promise<boolean>;

  // Photo Comment methods
  getPhotoComment(id: number): Promise<PhotoComment>;
  createPhotoComment(commentData: InsertPhotoComment): Promise<PhotoComment>;
  getAllPhotoComments(filters?: { photoId?: number }): Promise<PhotoComment[]>;
  updatePhotoComment(id: number, commentData: Partial<InsertPhotoComment>): Promise<PhotoComment>;
  deletePhotoComment(id: number): Promise<boolean>;

  // Collaboration Milestone methods
  getCollaborationMilestone(id: number): Promise<CollaborationMilestone>;
  createCollaborationMilestone(milestoneData: InsertCollaborationMilestone): Promise<CollaborationMilestone>;
  getAllCollaborationMilestones(filters?: { invitationId?: number; status?: string }): Promise<CollaborationMilestone[]>;
  updateCollaborationMilestone(id: number, milestoneData: Partial<InsertCollaborationMilestone>): Promise<CollaborationMilestone>;
  deleteCollaborationMilestone(id: number): Promise<boolean>;

  // Collaboration Message methods
  getCollaborationMessage(id: number): Promise<CollaborationMessage>;
  createCollaborationMessage(messageData: InsertCollaborationMessage): Promise<CollaborationMessage>;
  getAllCollaborationMessages(filters?: { invitationId?: number; senderType?: string }): Promise<CollaborationMessage[]>;
  updateCollaborationMessage(id: number, messageData: Partial<InsertCollaborationMessage>): Promise<CollaborationMessage>;
  deleteCollaborationMessage(id: number): Promise<boolean>;

  // Transaction methods
  getTransaction(id: number): Promise<Transaction>;
  createTransaction(transactionData: InsertTransaction): Promise<Transaction>;
  getAllTransactions(filters?: { userId?: number; type?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Transaction[]>;
  updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: number): Promise<boolean>;

  // Customer Profile methods
  getCustomerProfile(id: number): Promise<CustomerProfile>;
  getCustomerProfileByUserId(userId: number): Promise<CustomerProfile | undefined>;
  createCustomerProfile(profileData: InsertCustomerProfile): Promise<CustomerProfile>;
  getAllCustomerProfiles(filters?: { userId?: number }): Promise<CustomerProfile[]>;
  updateCustomerProfile(id: number, profileData: Partial<InsertCustomerProfile>): Promise<CustomerProfile>;
  deleteCustomerProfile(id: number): Promise<boolean>;

  // Music Genre methods
  getMusicGenre(id: number): Promise<MusicGenre>;
  createMusicGenre(genreData: InsertMusicGenre): Promise<MusicGenre>;
  getAllMusicGenres(): Promise<MusicGenre[]>;
  updateMusicGenre(id: number, genreData: Partial<InsertMusicGenre>): Promise<MusicGenre>;
  deleteMusicGenre(id: number): Promise<boolean>;

  // Drink Type methods
  getDrinkType(id: number): Promise<DrinkType>;
  createDrinkType(drinkTypeData: InsertDrinkType): Promise<DrinkType>;
  getAllDrinkTypes(filters?: { category?: string }): Promise<DrinkType[]>;
  updateDrinkType(id: number, drinkTypeData: Partial<InsertDrinkType>): Promise<DrinkType>;
  deleteDrinkType(id: number): Promise<boolean>;

  // Customer Tag methods
  getCustomerTag(customerId: number, tag: string): Promise<CustomerTag | undefined>;
  createCustomerTag(tagData: InsertCustomerTag): Promise<CustomerTag>;
  getAllCustomerTags(filters?: { customerId?: number }): Promise<CustomerTag[]>;
  updateCustomerTag(customerId: number, tag: string, tagData: Partial<InsertCustomerTag>): Promise<CustomerTag>;
  deleteCustomerTag(customerId: number, tag: string): Promise<boolean>;

  // Promotion methods
  getPromotion(id: number): Promise<Promotion>;
  createPromotion(promotionData: InsertPromotion): Promise<Promotion>;
  getAllPromotions(filters?: { eventId?: number; clubId?: number; status?: string; validFrom?: Date; validTo?: Date }): Promise<Promotion[]>;
  updatePromotion(id: number, promotionData: Partial<InsertPromotion>): Promise<Promotion>;
  deletePromotion(id: number): Promise<boolean>;

  // Payment Method methods
  getPaymentMethod(id: number): Promise<PaymentMethod>;
  getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod>;
  getAllPaymentMethods(filters?: { userId?: number; type?: string; isDefault?: boolean }): Promise<PaymentMethod[]>;
  updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<boolean>;

  // Invoice methods
  getInvoice(id: number): Promise<Invoice>;
  createInvoice(invoiceData: InsertInvoice): Promise<Invoice>;
  getAllInvoices(filters?: { userId?: number; status?: string; startDate?: Date; endDate?: Date }): Promise<Invoice[]>;
  updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<boolean>;

  // Employee methods (POS)
  getAllEmployees(filters?: { role?: string }): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee>;
  getEmployeeByPin(pin: string): Promise<Employee | undefined>;
  createEmployee(employeeData: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employeeData: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;

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
  getAllOrders(filters?: { tableId?: number; employeeId?: number; status?: string; startDate?: Date; endDate?: Date }): Promise<Order[]>;
  getOrder(id: number): Promise<Order>;
  getOrdersByTableId(tableId: number): Promise<Order[]>;
  getOrdersByEmployeeId(employeeId: number): Promise<Order[]>;
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
  getAllPosHistory(filters?: { employeeId?: number; deviceId?: number; startDate?: Date; endDate?: Date }): Promise<PosHistory[]>;
  getPosHistory(id: number): Promise<PosHistory>;
  createPosHistory(historyData: InsertPosHistory): Promise<PosHistory>;
  updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory>;
  deletePosHistory(id: number): Promise<boolean>;

  // POS Payment Method methods
  getAllPosPaymentMethods(): Promise<PosPaymentMethod[]>;
  getPosPaymentMethod(id: number): Promise<PosPaymentMethod>;
  createPosPaymentMethod(paymentMethodData: InsertPosPaymentMethod): Promise<PosPaymentMethod>;
  updatePosPaymentMethod(id: number, paymentMethodData: Partial<InsertPosPaymentMethod>): Promise<PosPaymentMethod>;
  deletePosPaymentMethod(id: number): Promise<boolean>;
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

  // Artist Portfolio methods implementation
  async getArtistPortfolio(id: number): Promise<ArtistPortfolio> {
    const result = await db.select().from(schema.artistPortfolios).where(eq(schema.artistPortfolios.id, id));
    if (result.length === 0) throw new Error("Artist portfolio not found");
    return result[0];
  },

  async getArtistPortfoliosByArtistId(artistId: number): Promise<ArtistPortfolio[]> {
    return await db.select().from(schema.artistPortfolios).where(eq(schema.artistPortfolios.artistId, artistId)).orderBy(schema.artistPortfolios.id);
  },

  async createArtistPortfolio(portfolioData: InsertArtistPortfolio): Promise<ArtistPortfolio> {
    const result = await db.insert(schema.artistPortfolios).values(portfolioData).returning();
    return result[0];
  },

  async getAllArtistPortfolios(filters?: { artistId?: number }): Promise<ArtistPortfolio[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.artistId !== undefined) conditions.push(eq(schema.artistPortfolios.artistId, filters.artistId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.artistPortfolios).where(where).orderBy(schema.artistPortfolios.id);
  },

  async updateArtistPortfolio(id: number, portfolioData: Partial<InsertArtistPortfolio>): Promise<ArtistPortfolio> {
    if (Object.keys(portfolioData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.artistPortfolios).set(portfolioData).where(eq(schema.artistPortfolios.id, id)).returning();
    if (result.length === 0) throw new Error("Artist portfolio not found");
    return result[0];
  },

  async deleteArtistPortfolio(id: number): Promise<boolean> {
    const result = await db.delete(schema.artistPortfolios).where(eq(schema.artistPortfolios.id, id)).returning({ id: schema.artistPortfolios.id });
    return result.length > 0;
  },

  // Club methods implementation
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

  async getAllClubs(filters?: { city?: string; country?: string; category?: string; featured?: boolean }): Promise<Club[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.city) conditions.push(eq(schema.clubs.city, filters.city));
    if (filters?.country) conditions.push(eq(schema.clubs.country, filters.country));
    if (filters?.category) conditions.push(eq(schema.clubs.category, filters.category));
    if (filters?.featured !== undefined) conditions.push(eq(schema.clubs.featured, filters.featured));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.clubs).where(where).orderBy(schema.clubs.id);
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

  // Club Location methods implementation
  async getClubLocation(id: number): Promise<ClubLocation> {
    const result = await db.select().from(schema.clubLocations).where(eq(schema.clubLocations.id, id));
    if (result.length === 0) throw new Error("Club location not found");
    return result[0];
  },

  async getClubLocationsByClubId(clubId: number): Promise<ClubLocation[]> {
    return await db.select().from(schema.clubLocations).where(eq(schema.clubLocations.clubId, clubId)).orderBy(schema.clubLocations.id);
  },

  async createClubLocation(locationData: InsertClubLocation): Promise<ClubLocation> {
    const result = await db.insert(schema.clubLocations).values(locationData).returning();
    return result[0];
  },

  async getAllClubLocations(filters?: { clubId?: number }): Promise<ClubLocation[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.clubId !== undefined) conditions.push(eq(schema.clubLocations.clubId, filters.clubId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.clubLocations).where(where).orderBy(schema.clubLocations.id);
  },

  async updateClubLocation(id: number, locationData: Partial<InsertClubLocation>): Promise<ClubLocation> {
    if (Object.keys(locationData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.clubLocations).set(locationData).where(eq(schema.clubLocations.id, id)).returning();
    if (result.length === 0) throw new Error("Club location not found");
    return result[0];
  },

  async deleteClubLocation(id: number): Promise<boolean> {
    const result = await db.delete(schema.clubLocations).where(eq(schema.clubLocations.id, id)).returning({ id: schema.clubLocations.id });
    return result.length > 0;
  },

  // Club Table methods implementation
  async getClubTable(id: number): Promise<ClubTable> {
    const result = await db.select().from(schema.clubTables).where(eq(schema.clubTables.id, id));
    if (result.length === 0) throw new Error("Club table not found");
    return result[0];
  },

  async getClubTablesByClubId(clubId: number): Promise<ClubTable[]> {
    return await db.select().from(schema.clubTables).where(eq(schema.clubTables.clubId, clubId)).orderBy(schema.clubTables.id);
  },

  async createClubTable(tableData: InsertClubTable): Promise<ClubTable> {
    const result = await db.insert(schema.clubTables).values(tableData).returning();
    return result[0];
  },

  async getAllClubTables(filters?: { clubId?: number; available?: boolean }): Promise<ClubTable[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.clubId !== undefined) conditions.push(eq(schema.clubTables.clubId, filters.clubId));
    if (filters?.available !== undefined) conditions.push(eq(schema.clubTables.available, filters.available));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.clubTables).where(where).orderBy(schema.clubTables.id);
  },

  async updateClubTable(id: number, tableData: Partial<InsertClubTable>): Promise<ClubTable> {
    if (Object.keys(tableData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.clubTables).set(tableData).where(eq(schema.clubTables.id, id)).returning();
    if (result.length === 0) throw new Error("Club table not found");
    return result[0];
  },

  async deleteClubTable(id: number): Promise<boolean> {
    const result = await db.delete(schema.clubTables).where(eq(schema.clubTables.id, id)).returning({ id: schema.clubTables.id });
    return result.length > 0;
  },

  // Event methods implementation
  async getEvent(id: number): Promise<Event> {
    const result = await db.select().from(schema.events).where(eq(schema.events.id, id));
    if (result.length === 0) throw new Error("Event not found");
    return result[0];
  },

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const result = await db.insert(schema.events).values(eventData).returning();
    return result[0];
  },

  async getAllEvents(filters?: { clubId?: number; city?: string; country?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Event[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.clubId !== undefined) conditions.push(eq(schema.events.clubId, filters.clubId));
    if (filters?.city) conditions.push(eq(schema.events.city, filters.city));
    if (filters?.country) conditions.push(eq(schema.events.country, filters.country));
    if (filters?.status) conditions.push(eq(schema.events.status, filters.status));
    if (filters?.startDate) conditions.push(gte(schema.events.date, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.events.date, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.events).where(where).orderBy(schema.events.id);
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
  async getEventArtist(eventId: number, artistId: number): Promise<EventArtist | undefined> {
    const result = await db.select().from(schema.eventArtists).where(and(eq(schema.eventArtists.eventId, eventId), eq(schema.eventArtists.artistId, artistId)));
    return result[0];
  },

  async createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
    const result = await db.insert(schema.eventArtists).values(eventArtistData).returning();
    return result[0];
  },

  async getAllEventArtists(filters?: { eventId?: number; artistId?: number }): Promise<EventArtist[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.eventArtists.eventId, filters.eventId));
    if (filters?.artistId !== undefined) conditions.push(eq(schema.eventArtists.artistId, filters.artistId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.eventArtists).where(where).orderBy(schema.eventArtists.eventId);
  },

  async updateEventArtist(eventId: number, artistId: number, eventArtistData: Partial<InsertEventArtist>): Promise<EventArtist> {
    if (Object.keys(eventArtistData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.eventArtists).set(eventArtistData).where(and(eq(schema.eventArtists.eventId, eventId), eq(schema.eventArtists.artistId, artistId))).returning();
    if (result.length === 0) throw new Error("Event artist not found");
    return result[0];
  },

  async deleteEventArtist(eventId: number, artistId: number): Promise<boolean> {
    const result = await db.delete(schema.eventArtists).where(and(eq(schema.eventArtists.eventId, eventId), eq(schema.eventArtists.artistId, artistId))).returning({ eventId: schema.eventArtists.eventId });
    return result.length > 0;
  },

  // Event Reserved Table methods implementation
  async getEventReservedTable(eventId: number, tableId: number): Promise<EventReservedTable | undefined> {
    const result = await db.select().from(schema.eventReservedTables).where(and(eq(schema.eventReservedTables.eventId, eventId), eq(schema.eventReservedTables.tableId, tableId)));
    return result[0];
  },

  async createEventReservedTable(reservedTableData: InsertEventReservedTable): Promise<EventReservedTable> {
    const result = await db.insert(schema.eventReservedTables).values(reservedTableData).returning();
    return result[0];
  },

  async getAllEventReservedTables(filters?: { eventId?: number; tableId?: number }): Promise<EventReservedTable[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.eventReservedTables.eventId, filters.eventId));
    if (filters?.tableId !== undefined) conditions.push(eq(schema.eventReservedTables.tableId, filters.tableId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.eventReservedTables).where(where).orderBy(schema.eventReservedTables.eventId);
  },

  async updateEventReservedTable(eventId: number, tableId: number, reservedTableData: Partial<InsertEventReservedTable>): Promise<EventReservedTable> {
    if (Object.keys(reservedTableData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.eventReservedTables).set(reservedTableData).where(and(eq(schema.eventReservedTables.eventId, eventId), eq(schema.eventReservedTables.tableId, tableId))).returning();
    if (result.length === 0) throw new Error("Event reserved table not found");
    return result[0];
  },

  async deleteEventReservedTable(eventId: number, tableId: number): Promise<boolean> {
    const result = await db.delete(schema.eventReservedTables).where(and(eq(schema.eventReservedTables.eventId, eventId), eq(schema.eventReservedTables.tableId, tableId))).returning({ eventId: schema.eventReservedTables.eventId });
    return result.length > 0;
  },

  // Event Participant methods implementation
  async getEventParticipant(eventId: number, userId: number): Promise<EventParticipant | undefined> {
    const result = await db.select().from(schema.eventParticipants).where(and(eq(schema.eventParticipants.eventId, eventId), eq(schema.eventParticipants.userId, userId)));
    return result[0];
  },

  async createEventParticipant(participantData: InsertEventParticipant): Promise<EventParticipant> {
    const result = await db.insert(schema.eventParticipants).values(participantData).returning();
    return result[0];
  },

  async getAllEventParticipants(filters?: { eventId?: number; userId?: number; status?: string }): Promise<EventParticipant[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.eventParticipants.eventId, filters.eventId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.eventParticipants.userId, filters.userId));
    if (filters?.status) conditions.push(eq(schema.eventParticipants.status, filters.status));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.eventParticipants).where(where).orderBy(schema.eventParticipants.eventId);
  },

  async updateEventParticipant(eventId: number, userId: number, participantData: Partial<InsertEventParticipant>): Promise<EventParticipant> {
    if (Object.keys(participantData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.eventParticipants).set(participantData).where(and(eq(schema.eventParticipants.eventId, eventId), eq(schema.eventParticipants.userId, userId))).returning();
    if (result.length === 0) throw new Error("Event participant not found");
    return result[0];
  },

  async deleteEventParticipant(eventId: number, userId: number): Promise<boolean> {
    const result = await db.delete(schema.eventParticipants).where(and(eq(schema.eventParticipants.eventId, eventId), eq(schema.eventParticipants.userId, userId))).returning({ eventId: schema.eventParticipants.eventId });
    return result.length > 0;
  },

  // Invitation methods implementation
  async getInvitation(id: number): Promise<Invitation> {
    const result = await db.select().from(schema.invitations).where(eq(schema.invitations.id, id));
    if (result.length === 0) throw new Error("Invitation not found");
    return result[0];
  },

  async createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
    const result = await db.insert(schema.invitations).values(invitationData).returning();
    return result[0];
  },

  async getAllInvitations(filters?: { eventId?: number; userId?: number; status?: string }): Promise<Invitation[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.invitations.eventId, filters.eventId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.invitations.userId, filters.userId));
    if (filters?.status) conditions.push(eq(schema.invitations.status, filters.status));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.invitations).where(where).orderBy(schema.invitations.id);
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
  async getTicket(id: number): Promise<Ticket> {
    const result = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
    if (result.length === 0) throw new Error("Ticket not found");
    return result[0];
  },

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const result = await db.insert(schema.tickets).values(ticketData).returning();
    return result[0];
  },

  async getAllTickets(filters?: { eventId?: number; userId?: number; status?: string }): Promise<Ticket[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.tickets.eventId, filters.eventId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.tickets.userId, filters.userId));
    if (filters?.status) conditions.push(eq(schema.tickets.status, filters.status));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.tickets).where(where).orderBy(schema.tickets.id);
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

  // Ticket Type methods implementation
  async getTicketType(id: number): Promise<TicketType> {
    const result = await db.select().from(schema.ticketTypes).where(eq(schema.ticketTypes.id, id));
    if (result.length === 0) throw new Error("Ticket type not found");
    return result[0];
  },

  async getTicketTypesByEventId(eventId: number): Promise<TicketType[]> {
    return await db.select().from(schema.ticketTypes).where(eq(schema.ticketTypes.eventId, eventId)).orderBy(schema.ticketTypes.id);
  },

  async createTicketType(ticketTypeData: InsertTicketType): Promise<TicketType> {
    const result = await db.insert(schema.ticketTypes).values(ticketTypeData).returning();
    return result[0];
  },

  async getAllTicketTypes(filters?: { eventId?: number }): Promise<TicketType[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.ticketTypes.eventId, filters.eventId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.ticketTypes).where(where).orderBy(schema.ticketTypes.id);
  },

  async updateTicketType(id: number, ticketTypeData: Partial<InsertTicketType>): Promise<TicketType> {
    if (Object.keys(ticketTypeData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.ticketTypes).set(ticketTypeData).where(eq(schema.ticketTypes.id, id)).returning();
    if (result.length === 0) throw new Error("Ticket type not found");
    return result[0];
  },

  async deleteTicketType(id: number): Promise<boolean> {
    const result = await db.delete(schema.ticketTypes).where(eq(schema.ticketTypes.id, id)).returning({ id: schema.ticketTypes.id });
    return result.length > 0;
  },

  // Feedback methods implementation
  async getFeedback(id: number): Promise<Feedback> {
    const result = await db.select().from(schema.feedback).where(eq(schema.feedback.id, id));
    if (result.length === 0) throw new Error("Feedback not found");
    return result[0];
  },

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(schema.feedback).values(feedbackData).returning();
    return result[0];
  },

  async getAllFeedback(filters?: { sourceType?: string; sourceId?: number; minRating?: number }): Promise<Feedback[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.sourceType) conditions.push(eq(schema.feedback.sourceType, filters.sourceType));
    if (filters?.sourceId !== undefined) conditions.push(eq(schema.feedback.sourceId, filters.sourceId));
    if (filters?.minRating !== undefined) conditions.push(gte(schema.feedback.rating, filters.minRating));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.feedback).where(where).orderBy(schema.feedback.id);
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

  // Feedback Like methods implementation
  async getFeedbackLike(feedbackId: number, userId: number): Promise<FeedbackLike | undefined> {
    const result = await db.select().from(schema.feedbackLikes).where(and(eq(schema.feedbackLikes.feedbackId, feedbackId), eq(schema.feedbackLikes.userId, userId)));
    return result[0];
  },

  async createFeedbackLike(likeData: InsertFeedbackLike): Promise<FeedbackLike> {
    const result = await db.insert(schema.feedbackLikes).values(likeData).returning();
    return result[0];
  },

  async getAllFeedbackLikes(filters?: { feedbackId?: number; userId?: number }): Promise<FeedbackLike[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.feedbackId !== undefined) conditions.push(eq(schema.feedbackLikes.feedbackId, filters.feedbackId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.feedbackLikes.userId, filters.userId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.feedbackLikes).where(where).orderBy(schema.feedbackLikes.feedbackId);
  },

  async updateFeedbackLike(feedbackId: number, userId: number, likeData: Partial<InsertFeedbackLike>): Promise<FeedbackLike> {
    if (Object.keys(likeData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.feedbackLikes).set(likeData).where(and(eq(schema.feedbackLikes.feedbackId, feedbackId), eq(schema.feedbackLikes.userId, userId))).returning();
    if (result.length === 0) throw new Error("Feedback like not found");
    return result[0];
  },

  async deleteFeedbackLike(feedbackId: number, userId: number): Promise<boolean> {
    const result = await db.delete(schema.feedbackLikes).where(and(eq(schema.feedbackLikes.feedbackId, feedbackId), eq(schema.feedbackLikes.userId, userId))).returning({ feedbackId: schema.feedbackLikes.feedbackId });
    return result.length > 0;
  },

  // Feedback Comment methods implementation
  async getFeedbackComment(id: number): Promise<FeedbackComment> {
    const result = await db.select().from(schema.feedbackComments).where(eq(schema.feedbackComments.id, id));
    if (result.length === 0) throw new Error("Feedback comment not found");
    return result[0];
  },

  async createFeedbackComment(commentData: InsertFeedbackComment): Promise<FeedbackComment> {
    const result = await db.insert(schema.feedbackComments).values(commentData).returning();
    return result[0];
  },

  async getAllFeedbackComments(filters?: { feedbackId?: number }): Promise<FeedbackComment[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.feedbackId !== undefined) conditions.push(eq(schema.feedbackComments.feedbackId, filters.feedbackId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.feedbackComments).where(where).orderBy(schema.feedbackComments.id);
  },

  async updateFeedbackComment(id: number, commentData: Partial<InsertFeedbackComment>): Promise<FeedbackComment> {
    if (Object.keys(commentData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.feedbackComments).set(commentData).where(eq(schema.feedbackComments.id, id)).returning();
    if (result.length === 0) throw new Error("Feedback comment not found");
    return result[0];
  },

  async deleteFeedbackComment(id: number): Promise<boolean> {
    const result = await db.delete(schema.feedbackComments).where(eq(schema.feedbackComments.id, id)).returning({ id: schema.feedbackComments.id });
    return result.length > 0;
  },

  // Photo methods implementation
  async getPhoto(id: number): Promise<Photo> {
    const result = await db.select().from(schema.photos).where(eq(schema.photos.id, id));
    if (result.length === 0) throw new Error("Photo not found");
    return result[0];
  },

  async createPhoto(photoData: InsertPhoto): Promise<Photo> {
    const result = await db.insert(schema.photos).values(photoData).returning();
    return result[0];
  },

  async getAllPhotos(filters?: { userId?: number; eventId?: number }): Promise<Photo[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.photos.userId, filters.userId));
    if (filters?.eventId !== undefined) conditions.push(eq(schema.photos.eventId, filters.eventId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.photos).where(where).orderBy(schema.photos.id);
  },

  async updatePhoto(id: number, photoData: Partial<InsertPhoto>): Promise<Photo> {
    if (Object.keys(photoData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.photos).set(photoData).where(eq(schema.photos.id, id)).returning();
    if (result.length === 0) throw new Error("Photo not found");
    return result[0];
  },

  async deletePhoto(id: number): Promise<boolean> {
    const result = await db.delete(schema.photos).where(eq(schema.photos.id, id)).returning({ id: schema.photos.id });
    return result.length > 0;
  },

  // Photo Like methods implementation
  async getPhotoLike(photoId: number, userId: number): Promise<PhotoLike | undefined> {
    const result = await db.select().from(schema.photoLikes).where(and(eq(schema.photoLikes.photoId, photoId), eq(schema.photoLikes.userId, userId)));
    return result[0];
  },

  async createPhotoLike(likeData: InsertPhotoLike): Promise<PhotoLike> {
    const result = await db.insert(schema.photoLikes).values(likeData).returning();
    return result[0];
  },

  async getAllPhotoLikes(filters?: { photoId?: number; userId?: number }): Promise<PhotoLike[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.photoId !== undefined) conditions.push(eq(schema.photoLikes.photoId, filters.photoId));
    if (filters?.userId !== undefined) conditions.push(eq(schema.photoLikes.userId, filters.userId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.photoLikes).where(where).orderBy(schema.photoLikes.photoId);
  },

  async updatePhotoLike(photoId: number, userId: number, likeData: Partial<InsertPhotoLike>): Promise<PhotoLike> {
    if (Object.keys(likeData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.photoLikes).set(likeData).where(and(eq(schema.photoLikes.photoId, photoId), eq(schema.photoLikes.userId, userId))).returning();
    if (result.length === 0) throw new Error("Photo like not found");
    return result[0];
  },

  async deletePhotoLike(photoId: number, userId: number): Promise<boolean> {
    const result = await db.delete(schema.photoLikes).where(and(eq(schema.photoLikes.photoId, photoId), eq(schema.photoLikes.userId, userId))).returning({ photoId: schema.photoLikes.photoId });
    return result.length > 0;
  },

  // Photo Comment methods implementation
  async getPhotoComment(id: number): Promise<PhotoComment> {
    const result = await db.select().from(schema.photoComments).where(eq(schema.photoComments.id, id));
    if (result.length === 0) throw new Error("Photo comment not found");
    return result[0];
  },

  async createPhotoComment(commentData: InsertPhotoComment): Promise<PhotoComment> {
    const result = await db.insert(schema.photoComments).values(commentData).returning();
    return result[0];
  },

  async getAllPhotoComments(filters?: { photoId?: number }): Promise<PhotoComment[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.photoId !== undefined) conditions.push(eq(schema.photoComments.photoId, filters.photoId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.photoComments).where(where).orderBy(schema.photoComments.id);
  },

  async updatePhotoComment(id: number, commentData: Partial<InsertPhotoComment>): Promise<PhotoComment> {
    if (Object.keys(commentData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.photoComments).set(commentData).where(eq(schema.photoComments.id, id)).returning();
    if (result.length === 0) throw new Error("Photo comment not found");
    return result[0];
  },

  async deletePhotoComment(id: number): Promise<boolean> {
    const result = await db.delete(schema.photoComments).where(eq(schema.photoComments.id, id)).returning({ id: schema.photoComments.id });
    return result.length > 0;
  },

  // Collaboration Milestone methods implementation
  async getCollaborationMilestone(id: number): Promise<CollaborationMilestone> {
    const result = await db.select().from(schema.collaborationMilestones).where(eq(schema.collaborationMilestones.id, id));
    if (result.length === 0) throw new Error("Collaboration milestone not found");
    return result[0];
  },

  async createCollaborationMilestone(milestoneData: InsertCollaborationMilestone): Promise<CollaborationMilestone> {
    const result = await db.insert(schema.collaborationMilestones).values(milestoneData).returning();
    return result[0];
  },

  async getAllCollaborationMilestones(filters?: { invitationId?: number; status?: string }): Promise<CollaborationMilestone[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.invitationId !== undefined) conditions.push(eq(schema.collaborationMilestones.invitationId, filters.invitationId));
    if (filters?.status) conditions.push(eq(schema.collaborationMilestones.status, filters.status));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.collaborationMilestones).where(where).orderBy(schema.collaborationMilestones.id);
  },

  async updateCollaborationMilestone(id: number, milestoneData: Partial<InsertCollaborationMilestone>): Promise<CollaborationMilestone> {
    if (Object.keys(milestoneData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.collaborationMilestones).set(milestoneData).where(eq(schema.collaborationMilestones.id, id)).returning();
    if (result.length === 0) throw new Error("Collaboration milestone not found");
    return result[0];
  },

  async deleteCollaborationMilestone(id: number): Promise<boolean> {
    const result = await db.delete(schema.collaborationMilestones).where(eq(schema.collaborationMilestones.id, id)).returning({ id: schema.collaborationMilestones.id });
    return result.length > 0;
  },

  // Collaboration Message methods implementation
  async getCollaborationMessage(id: number): Promise<CollaborationMessage> {
    const result = await db.select().from(schema.collaborationMessages).where(eq(schema.collaborationMessages.id, id));
    if (result.length === 0) throw new Error("Collaboration message not found");
    return result[0];
  },

  async createCollaborationMessage(messageData: InsertCollaborationMessage): Promise<CollaborationMessage> {
    const result = await db.insert(schema.collaborationMessages).values(messageData).returning();
    return result[0];
  },

  async getAllCollaborationMessages(filters?: { invitationId?: number; senderType?: string }): Promise<CollaborationMessage[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.invitationId !== undefined) conditions.push(eq(schema.collaborationMessages.invitationId, filters.invitationId));
    if (filters?.senderType) conditions.push(eq(schema.collaborationMessages.senderType, filters.senderType));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.collaborationMessages).where(where).orderBy(schema.collaborationMessages.id);
  },

  async updateCollaborationMessage(id: number, messageData: Partial<InsertCollaborationMessage>): Promise<CollaborationMessage> {
    if (Object.keys(messageData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.collaborationMessages).set(messageData).where(eq(schema.collaborationMessages.id, id)).returning();
    if (result.length === 0) throw new Error("Collaboration message not found");
    return result[0];
  },

  async deleteCollaborationMessage(id: number): Promise<boolean> {
    const result = await db.delete(schema.collaborationMessages).where(eq(schema.collaborationMessages.id, id)).returning({ id: schema.collaborationMessages.id });
    return result.length > 0;
  },

  // Transaction methods implementation
  async getTransaction(id: number): Promise<Transaction> {
    const result = await db.select().from(schema.transactions).where(eq(schema.transactions.id, id));
    if (result.length === 0) throw new Error("Transaction not found");
    return result[0];
  },

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(schema.transactions).values(transactionData).returning();
    return result[0];
  },

  async getAllTransactions(filters?: { userId?: number; type?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Transaction[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.transactions.userId, filters.userId));
    if (filters?.type) conditions.push(eq(schema.transactions.type, filters.type));
    if (filters?.status) conditions.push(eq(schema.transactions.status, filters.status));
    if (filters?.startDate) conditions.push(gte(schema.transactions.createdAt, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.transactions.createdAt, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.transactions).where(where).orderBy(schema.transactions.id);
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

  // Customer Profile methods implementation
  async getCustomerProfile(id: number): Promise<CustomerProfile> {
    const result = await db.select().from(schema.customerProfiles).where(eq(schema.customerProfiles.id, id));
    if (result.length === 0) throw new Error("Customer profile not found");
    return result[0];
  },

  async getCustomerProfileByUserId(userId: number): Promise<CustomerProfile | undefined> {
    const result = await db.select().from(schema.customerProfiles).where(eq(schema.customerProfiles.userId, userId));
    return result[0];
  },

  async createCustomerProfile(profileData: InsertCustomerProfile): Promise<CustomerProfile> {
    const result = await db.insert(schema.customerProfiles).values(profileData).returning();
    return result[0];
  },

  async getAllCustomerProfiles(filters?: { userId?: number }): Promise<CustomerProfile[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.customerProfiles.userId, filters.userId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.customerProfiles).where(where).orderBy(schema.customerProfiles.id);
  },

  async updateCustomerProfile(id: number, profileData: Partial<InsertCustomerProfile>): Promise<CustomerProfile> {
    if (Object.keys(profileData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.customerProfiles).set(profileData).where(eq(schema.customerProfiles.id, id)).returning();
    if (result.length === 0) throw new Error("Customer profile not found");
    return result[0];
  },

  async deleteCustomerProfile(id: number): Promise<boolean> {
    const result = await db.delete(schema.customerProfiles).where(eq(schema.customerProfiles.id, id)).returning({ id: schema.customerProfiles.id });
    return result.length > 0;
  },

  // Music Genre methods implementation
  async getMusicGenre(id: number): Promise<MusicGenre> {
    const result = await db.select().from(schema.musicGenres).where(eq(schema.musicGenres.id, id));
    if (result.length === 0) throw new Error("Music genre not found");
    return result[0];
  },

  async createMusicGenre(genreData: InsertMusicGenre): Promise<MusicGenre> {
    const result = await db.insert(schema.musicGenres).values(genreData).returning();
    return result[0];
  },

  async getAllMusicGenres(): Promise<MusicGenre[]> {
    return await db.select().from(schema.musicGenres).orderBy(schema.musicGenres.id);
  },

  async updateMusicGenre(id: number, genreData: Partial<InsertMusicGenre>): Promise<MusicGenre> {
    if (Object.keys(genreData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.musicGenres).set(genreData).where(eq(schema.musicGenres.id, id)).returning();
    if (result.length === 0) throw new Error("Music genre not found");
    return result[0];
  },

  async deleteMusicGenre(id: number): Promise<boolean> {
    const result = await db.delete(schema.musicGenres).where(eq(schema.musicGenres.id, id)).returning({ id: schema.musicGenres.id });
    return result.length > 0;
  },

  // Drink Type methods implementation
  async getDrinkType(id: number): Promise<DrinkType> {
    const result = await db.select().from(schema.drinkTypes).where(eq(schema.drinkTypes.id, id));
    if (result.length === 0) throw new Error("Drink type not found");
    return result[0];
  },

  async createDrinkType(drinkTypeData: InsertDrinkType): Promise<DrinkType> {
    const result = await db.insert(schema.drinkTypes).values(drinkTypeData).returning();
    return result[0];
  },

  async getAllDrinkTypes(filters?: { category?: string }): Promise<DrinkType[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.category) conditions.push(eq(schema.drinkTypes.category, filters.category));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.drinkTypes).where(where).orderBy(schema.drinkTypes.id);
  },

  async updateDrinkType(id: number, drinkTypeData: Partial<InsertDrinkType>): Promise<DrinkType> {
    if (Object.keys(drinkTypeData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.drinkTypes).set(drinkTypeData).where(eq(schema.drinkTypes.id, id)).returning();
    if (result.length === 0) throw new Error("Drink type not found");
    return result[0];
  },

  async deleteDrinkType(id: number): Promise<boolean> {
    const result = await db.delete(schema.drinkTypes).where(eq(schema.drinkTypes.id, id)).returning({ id: schema.drinkTypes.id });
    return result.length > 0;
  },

  // Customer Tag methods implementation
  async getCustomerTag(customerId: number, tag: string): Promise<CustomerTag | undefined> {
    const result = await db.select().from(schema.customerTags).where(and(eq(schema.customerTags.customerId, customerId), eq(schema.customerTags.tag, tag)));
    return result[0];
  },

  async createCustomerTag(tagData: InsertCustomerTag): Promise<CustomerTag> {
    const result = await db.insert(schema.customerTags).values(tagData).returning();
    return result[0];
  },

  async getAllCustomerTags(filters?: { customerId?: number }): Promise<CustomerTag[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.customerId !== undefined) conditions.push(eq(schema.customerTags.customerId, filters.customerId));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.customerTags).where(where).orderBy(schema.customerTags.customerId);
  },

  async updateCustomerTag(customerId: number, tag: string, tagData: Partial<InsertCustomerTag>): Promise<CustomerTag> {
    if (Object.keys(tagData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.customerTags).set(tagData).where(and(eq(schema.customerTags.customerId, customerId), eq(schema.customerTags.tag, tag))).returning();
    if (result.length === 0) throw new Error("Customer tag not found");
    return result[0];
  },

  async deleteCustomerTag(customerId: number, tag: string): Promise<boolean> {
    const result = await db.delete(schema.customerTags).where(and(eq(schema.customerTags.customerId, customerId), eq(schema.customerTags.tag, tag))).returning({ customerId: schema.customerTags.customerId });
    return result.length > 0;
  },

  // Promotion methods implementation
  async getPromotion(id: number): Promise<Promotion> {
    const result = await db.select().from(schema.promotions).where(eq(schema.promotions.id, id));
    if (result.length === 0) throw new Error("Promotion not found");
    return result[0];
  },

  async createPromotion(promotionData: InsertPromotion): Promise<Promotion> {
    const result = await db.insert(schema.promotions).values(promotionData).returning();
    return result[0];
  },

  async getAllPromotions(filters?: { eventId?: number; clubId?: number; status?: string; validFrom?: Date; validTo?: Date }): Promise<Promotion[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.eventId !== undefined) conditions.push(eq(schema.promotions.eventId, filters.eventId));
    if (filters?.clubId !== undefined) conditions.push(eq(schema.promotions.clubId, filters.clubId));
    if (filters?.status) conditions.push(eq(schema.promotions.status, filters.status));
    if (filters?.validFrom) conditions.push(gte(schema.promotions.validFrom, filters.validFrom));
    if (filters?.validTo) conditions.push(lte(schema.promotions.validTo, filters.validTo));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.promotions).where(where).orderBy(schema.promotions.id);
  },

  async updatePromotion(id: number, promotionData: Partial<InsertPromotion>): Promise<Promotion> {
    if (Object.keys(promotionData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.promotions).set(promotionData).where(eq(schema.promotions.id, id)).returning();
    if (result.length === 0) throw new Error("Promotion not found");
    return result[0];
  },

  async deletePromotion(id: number): Promise<boolean> {
    const result = await db.delete(schema.promotions).where(eq(schema.promotions.id, id)).returning({ id: schema.promotions.id });
    return result.length > 0;
  },

  // Payment Method methods implementation
  async getPaymentMethod(id: number): Promise<PaymentMethod> {
    const result = await db.select().from(schema.paymentMethods).where(eq(schema.paymentMethods.id, id));
    if (result.length === 0) throw new Error("Payment method not found");
    return result[0];
  },

  async getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[]> {
    return await db.select().from(schema.paymentMethods).where(eq(schema.paymentMethods.userId, userId)).orderBy(schema.paymentMethods.id);
  },

  async createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod> {
    const result = await db.insert(schema.paymentMethods).values(paymentMethodData).returning();
    return result[0];
  },

  async getAllPaymentMethods(filters?: { userId?: number; type?: string; isDefault?: boolean }): Promise<PaymentMethod[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.paymentMethods.userId, filters.userId));
    if (filters?.type) conditions.push(eq(schema.paymentMethods.type, filters.type));
    if (filters?.isDefault !== undefined) conditions.push(eq(schema.paymentMethods.isDefault, filters.isDefault));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.paymentMethods).where(where).orderBy(schema.paymentMethods.id);
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

  // Invoice methods implementation
  async getInvoice(id: number): Promise<Invoice> {
    const result = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    if (result.length === 0) throw new Error("Invoice not found");
    return result[0];
  },

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(schema.invoices).values(invoiceData).returning();
    return result[0];
  },

  async getAllInvoices(filters?: { userId?: number; status?: string; startDate?: Date; endDate?: Date }): Promise<Invoice[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.userId !== undefined) conditions.push(eq(schema.invoices.userId, filters.userId));
    if (filters?.status) conditions.push(eq(schema.invoices.status, filters.status));
    if (filters?.startDate) conditions.push(gte(schema.invoices.createdAt, filters.startDate));
    if (filters?.endDate) conditions.push(lte(schema.invoices.createdAt, filters.endDate));
    if (conditions.length > 0) where = and(...conditions);
    return await db.select().from(schema.invoices).where(where).orderBy(schema.invoices.id);
  },

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    if (Object.keys(invoiceData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.invoices).set(invoiceData).where(eq(schema.invoices.id, id)).returning();
    if (result.length === 0) throw new Error("Invoice not found");
    return result[0];
  },

  async deleteInvoice(id: number): Promise<boolean> {
    const result = await db.delete(schema.invoices).where(eq(schema.invoices.id, id)).returning({ id: schema.invoices.id });
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
  async getAllPosDevices(filters?: { isActive?: boolean }): Promise<PosDevice[]> {
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
  async getAllPosTables(filters?: { isOccupied?: boolean }): Promise<PosTable[]> {
    let where: SQL | undefined = undefined;
    const conditions: SQL[] = [];
    if (filters?.isOccupied !== undefined) conditions.push(eq(schema.posTables.status, filters.isOccupied ? 'occupied' : 'available'));
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
    if (filters?.employeeId !== undefined) conditions.push(eq(schema.orders.employeeId, filters.employeeId));
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

  async getOrdersByEmployeeId(employeeId: number): Promise<Order[]> {
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
    if (filters?.deviceId !== undefined) conditions.push(eq(schema.posHistory.deviceId, filters.deviceId));
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

  // POS Payment Method methods implementation
  async getAllPosPaymentMethods(): Promise<PosPaymentMethod[]> {
    return await db.select().from(schema.posPaymentMethods).orderBy(schema.posPaymentMethods.id);
  },

  async getPosPaymentMethod(id: number): Promise<PosPaymentMethod> {
    const result = await db.select().from(schema.posPaymentMethods).where(eq(schema.posPaymentMethods.id, id));
    if (result.length === 0) throw new Error("POS payment method not found");
    return result[0];
  },

  async createPosPaymentMethod(paymentMethodData: InsertPosPaymentMethod): Promise<PosPaymentMethod> {
    const result = await db.insert(schema.posPaymentMethods).values(paymentMethodData).returning();
    return result[0];
  },

  async updatePosPaymentMethod(id: number, paymentMethodData: Partial<InsertPosPaymentMethod>): Promise<PosPaymentMethod> {
    if (Object.keys(paymentMethodData).length === 0) {
      throw new Error("No fields to update");
    }
    const result = await db.update(schema.posPaymentMethods).set(paymentMethodData).where(eq(schema.posPaymentMethods.id, id)).returning();
    if (result.length === 0) throw new Error("POS payment method not found");
    return result[0];
  },

  async deletePosPaymentMethod(id: number): Promise<boolean> {
    const result = await db.delete(schema.posPaymentMethods).where(eq(schema.posPaymentMethods.id, id)).returning({ id: schema.posPaymentMethods.id });
    return result.length > 0;
  },
};