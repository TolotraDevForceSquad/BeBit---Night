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
  getEmployee(id: string): Promise<Employee>;
  getEmployeeByPin(pin: string): Promise<Employee | undefined>;
  createEmployee(employeeData: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employeeData: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: string): Promise<boolean>;

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
  getAllOrders(filters?: { tableId?: number; employeeId?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Order[]>;
  getOrder(id: number): Promise<Order>;
  getOrdersByTableId(tableId: number): Promise<Order[]>;
  getOrdersByEmployeeId(employeeId: string): Promise<Order[]>;
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
  getAllPosHistory(filters?: { employeeId?: string; deviceId?: number; startDate?: Date; endDate?: Date }): Promise<PosHistory[]>;
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
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("User not found");
    return result.rows[0];
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0];
  },

  async createUser(userData: InsertUser): Promise<User> {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      role = 'user',
      profileImage,
      city,
      country,
      latitude,
      longitude,
      walletBalance = '0',
      isVerified = false
    } = userData;

    const result = await pool.query(
      `INSERT INTO users (
        username, password, email, first_name, last_name, role, 
        profile_image, city, country, latitude, longitude, 
        wallet_balance, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        username,
        password,
        email,
        firstName,
        lastName,
        role,
        profileImage || null,
        city || '',
        country || '',
        latitude || null,
        longitude || null,
        walletBalance || '0',
        isVerified
      ]
    );

    return result.rows[0];
  },

  async getAllUsers(filters?: { role?: string; city?: string; country?: string; isVerified?: boolean }): Promise<User[]> {
    let query = "SELECT * FROM users WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.role) {
      query += ` AND role = $${paramCount}`;
      params.push(filters.role);
      paramCount++;
    }

    if (filters?.city) {
      query += ` AND city = $${paramCount}`;
      params.push(filters.city);
      paramCount++;
    }

    if (filters?.country) {
      query += ` AND country = $${paramCount}`;
      params.push(filters.country);
      paramCount++;
    }

    if (filters?.isVerified !== undefined) {
      query += ` AND is_verified = $${paramCount}`;
      params.push(filters.isVerified);
      paramCount++;
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("User not found");
    return result.rows[0];
  },

  async deleteUser(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Artist methods implementation
  async getAllArtists(filters?: { genre?: string; minRate?: number; maxRate?: number; minPopularity?: number }): Promise<Artist[]> {
    let query = "SELECT * FROM artists WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.genre) {
      query += ` AND genre = $${paramCount}`;
      params.push(filters.genre);
      paramCount++;
    }

    if (filters?.minRate !== undefined) {
      query += ` AND rate >= $${paramCount}`;
      params.push(filters.minRate);
      paramCount++;
    }

    if (filters?.maxRate !== undefined) {
      query += ` AND rate <= $${paramCount}`;
      params.push(filters.maxRate);
      paramCount++;
    }

    if (filters?.minPopularity !== undefined) {
      query += ` AND popularity >= $${paramCount}`;
      params.push(filters.minPopularity);
      paramCount++;
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getArtist(id: number): Promise<Artist> {
    const result = await pool.query(
      "SELECT * FROM artists WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Artist not found");
    return result.rows[0];
  },

  async getArtistByUserId(userId: number): Promise<Artist | undefined> {
    const result = await pool.query(
      "SELECT * FROM artists WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  },

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    const result = await pool.query(
      `INSERT INTO artists (user_id, display_name, genre, bio, rate, tags, popularity)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        artistData.userId,
        artistData.displayName,
        artistData.genre,
        artistData.bio || null,
        artistData.rate || 0,
        artistData.tags || [],
        artistData.popularity || 0
      ]
    );
    return result.rows[0];
  },

  async updateArtist(id: number, artistData: Partial<InsertArtist>): Promise<Artist> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(artistData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE artists SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Artist not found");
    return result.rows[0];
  },

  async deleteArtist(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM artists WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Club methods implementation
  async getAllClubs(filters?: { city?: string; country?: string; minRating?: number; minCapacity?: number }): Promise<Club[]> {
    let query = "SELECT * FROM clubs WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.city) {
      query += ` AND city = $${paramCount}`;
      params.push(filters.city);
      paramCount++;
    }

    if (filters?.country) {
      query += ` AND country = $${paramCount}`;
      params.push(filters.country);
      paramCount++;
    }

    if (filters?.minRating !== undefined) {
      query += ` AND rating >= $${paramCount}`;
      params.push(filters.minRating);
      paramCount++;
    }

    if (filters?.minCapacity !== undefined) {
      query += ` AND capacity >= $${paramCount}`;
      params.push(filters.minCapacity);
      paramCount++;
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getClub(id: number): Promise<Club> {
    const result = await pool.query(
      "SELECT * FROM clubs WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Club not found");
    return result.rows[0];
  },

  async getClubByUserId(userId: number): Promise<Club | undefined> {
    const result = await pool.query(
      "SELECT * FROM clubs WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  },

  async createClub(clubData: InsertClub): Promise<Club> {
    const result = await pool.query(
      `INSERT INTO clubs (user_id, name, city, country, address, latitude, longitude, capacity, description, profile_image, rating, review_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        clubData.userId,
        clubData.name,
        clubData.city,
        clubData.country,
        clubData.address || null,
        clubData.latitude || null,
        clubData.longitude || null,
        clubData.capacity,
        clubData.description || null,
        clubData.profileImage || null,
        clubData.rating || 0,
        clubData.reviewCount || 0
      ]
    );
    return result.rows[0];
  },

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(clubData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE clubs SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Club not found");
    return result.rows[0];
  },

  async deleteClub(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM clubs WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Event methods implementation
  async getAllEvents(filters?: {
    clubId?: number; category?: string; city?: string; country?: string;
    minDate?: Date; maxDate?: Date; minPrice?: number; maxPrice?: number;
    isApproved?: boolean; mood?: string
  }): Promise<Event[]> {
    let query = "SELECT * FROM events WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.clubId !== undefined) {
      query += ` AND club_id = $${paramCount}`;
      params.push(filters.clubId);
      paramCount++;
    }

    if (filters?.category) {
      query += ` AND category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters?.city) {
      query += ` AND city = $${paramCount}`;
      params.push(filters.city);
      paramCount++;
    }

    if (filters?.country) {
      query += ` AND country = $${paramCount}`;
      params.push(filters.country);
      paramCount++;
    }

    if (filters?.minDate) {
      query += ` AND date >= $${paramCount}`;
      params.push(filters.minDate);
      paramCount++;
    }

    if (filters?.maxDate) {
      query += ` AND date <= $${paramCount}`;
      params.push(filters.maxDate);
      paramCount++;
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters?.isApproved !== undefined) {
      query += ` AND is_approved = $${paramCount}`;
      params.push(filters.isApproved);
      paramCount++;
    }

    if (filters?.mood) {
      query += ` AND mood = $${paramCount}`;
      params.push(filters.mood);
      paramCount++;
    }

    query += " ORDER BY date DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getEvent(id: number): Promise<Event> {
    const result = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Event not found");
    return result.rows[0];
  },

  async getEventsByClubId(clubId: number): Promise<Event[]> {
    const result = await pool.query(
      "SELECT * FROM events WHERE club_id = $1 ORDER BY date DESC",
      [clubId]
    );
    return result.rows;
  },

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const result = await pool.query(
      `INSERT INTO events (club_id, title, description, date, start_time, end_time, location, city, country, latitude, longitude, venue_name, category, price, capacity, cover_image, participant_count, popularity, is_approved, mood)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
      [
        eventData.clubId,
        eventData.title,
        eventData.description || null,
        eventData.date,
        eventData.startTime,
        eventData.endTime,
        eventData.location,
        eventData.city || '',
        eventData.country || '',
        eventData.latitude || null,
        eventData.longitude || null,
        eventData.venueName,
        eventData.category,
        eventData.price,
        eventData.capacity,
        eventData.coverImage || null,
        eventData.participantCount || 0,
        eventData.popularity || 0,
        eventData.isApproved || false,
        eventData.mood || null
      ]
    );
    return result.rows[0];
  },

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(eventData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Event not found");
    return result.rows[0];
  },

  async deleteEvent(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Event Artist methods implementation
  async getAllEventArtists(filters?: { eventId?: number; artistId?: number }): Promise<EventArtist[]> {
    let query = "SELECT * FROM event_artists WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.eventId !== undefined) {
      query += ` AND event_id = $${paramCount}`;
      params.push(filters.eventId);
      paramCount++;
    }

    if (filters?.artistId !== undefined) {
      query += ` AND artist_id = $${paramCount}`;
      params.push(filters.artistId);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getEventArtistsByEventId(eventId: number): Promise<EventArtist[]> {
    const result = await pool.query(
      "SELECT * FROM event_artists WHERE event_id = $1",
      [eventId]
    );
    return result.rows;
  },

  async getEventArtistsByArtistId(artistId: number): Promise<EventArtist[]> {
    const result = await pool.query(
      "SELECT * FROM event_artists WHERE artist_id = $1",
      [artistId]
    );
    return result.rows;
  },

  async createEventArtist(eventArtistData: InsertEventArtist): Promise<EventArtist> {
    const result = await pool.query(
      `INSERT INTO event_artists (event_id, artist_id, fee)
       VALUES ($1, $2, $3) RETURNING *`,
      [
        eventArtistData.eventId,
        eventArtistData.artistId,
        eventArtistData.fee || null
      ]
    );
    return result.rows[0];
  },

  async deleteEventArtist(eventId: number, artistId: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM event_artists WHERE event_id = $1 AND artist_id = $2 RETURNING event_id",
      [eventId, artistId]
    );
    return result.rows.length > 0;
  },

  // Invitation methods implementation
  async getAllInvitations(filters?: { clubId?: number; artistId?: number; status?: string }): Promise<Invitation[]> {
    let query = "SELECT * FROM invitations WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.clubId !== undefined) {
      query += ` AND club_id = $${paramCount}`;
      params.push(filters.clubId);
      paramCount++;
    }

    if (filters?.artistId !== undefined) {
      query += ` AND artist_id = $${paramCount}`;
      params.push(filters.artistId);
      paramCount++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getInvitation(id: number): Promise<Invitation> {
    const result = await pool.query(
      "SELECT * FROM invitations WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Invitation not found");
    return result.rows[0];
  },

  async getInvitationsByClubId(clubId: number): Promise<Invitation[]> {
    const result = await pool.query(
      "SELECT * FROM invitations WHERE club_id = $1 ORDER BY created_at DESC",
      [clubId]
    );
    return result.rows;
  },

  async getInvitationsByArtistId(artistId: number): Promise<Invitation[]> {
    const result = await pool.query(
      "SELECT * FROM invitations WHERE artist_id = $1 ORDER BY created_at DESC",
      [artistId]
    );
    return result.rows;
  },

  async createInvitation(invitationData: InsertInvitation): Promise<Invitation> {
    const result = await pool.query(
      `INSERT INTO invitations (club_id, artist_id, message, fee, date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        invitationData.clubId,
        invitationData.artistId,
        invitationData.message || null,
        invitationData.fee || null,
        invitationData.date || null,
        invitationData.status || 'pending'
      ]
    );
    return result.rows[0];
  },

  async updateInvitation(id: number, invitationData: Partial<InsertInvitation>): Promise<Invitation> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(invitationData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE invitations SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Invitation not found");
    return result.rows[0];
  },

  async deleteInvitation(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM invitations WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Ticket methods implementation
  async getAllTickets(filters?: { eventId?: number; userId?: number; isUsed?: boolean }): Promise<Ticket[]> {
    let query = "SELECT * FROM tickets WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.eventId !== undefined) {
      query += ` AND event_id = $${paramCount}`;
      params.push(filters.eventId);
      paramCount++;
    }

    if (filters?.userId !== undefined) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    if (filters?.isUsed !== undefined) {
      query += ` AND is_used = $${paramCount}`;
      params.push(filters.isUsed);
      paramCount++;
    }

    query += " ORDER BY purchase_date DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getTicket(id: number): Promise<Ticket> {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Ticket not found");
    return result.rows[0];
  },

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE event_id = $1 ORDER BY purchase_date DESC",
      [eventId]
    );
    return result.rows;
  },

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE user_id = $1 ORDER BY purchase_date DESC",
      [userId]
    );
    return result.rows;
  },

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const result = await pool.query(
      `INSERT INTO tickets (event_id, user_id, price, is_used)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        ticketData.eventId,
        ticketData.userId,
        ticketData.price,
        ticketData.isUsed || false
      ]
    );
    return result.rows[0];
  },

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(ticketData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE tickets SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Ticket not found");
    return result.rows[0];
  },

  async deleteTicket(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Feedback methods implementation
  async getAllFeedback(filters?: { eventId?: number; artistId?: number; clubId?: number; userId?: number; minRating?: number }): Promise<Feedback[]> {
    let query = "SELECT * FROM feedback WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.eventId !== undefined) {
      query += ` AND event_id = $${paramCount}`;
      params.push(filters.eventId);
      paramCount++;
    }

    if (filters?.artistId !== undefined) {
      query += ` AND artist_id = $${paramCount}`;
      params.push(filters.artistId);
      paramCount++;
    }

    if (filters?.clubId !== undefined) {
      query += ` AND club_id = $${paramCount}`;
      params.push(filters.clubId);
      paramCount++;
    }

    if (filters?.userId !== undefined) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    if (filters?.minRating !== undefined) {
      query += ` AND rating >= $${paramCount}`;
      params.push(filters.minRating);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getFeedback(id: number): Promise<Feedback> {
    const result = await pool.query(
      "SELECT * FROM feedback WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Feedback not found");
    return result.rows[0];
  },

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const result = await pool.query(
      `INSERT INTO feedback (user_id, event_id, artist_id, club_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        feedbackData.userId,
        feedbackData.eventId,
        feedbackData.artistId || null,
        feedbackData.clubId || null,
        feedbackData.rating,
        feedbackData.comment || null
      ]
    );
    return result.rows[0];
  },

  async updateFeedback(id: number, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(feedbackData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE feedback SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Feedback not found");
    return result.rows[0];
  },

  async deleteFeedback(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM feedback WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Transaction methods implementation
  async getAllTransactions(filters?: { userId?: number; type?: string; minAmount?: number; maxAmount?: number; startDate?: Date; endDate?: Date }): Promise<Transaction[]> {
    let query = "SELECT * FROM transactions WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.userId !== undefined) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    if (filters?.type) {
      query += ` AND type = $${paramCount}`;
      params.push(filters.type);
      paramCount++;
    }

    if (filters?.minAmount !== undefined) {
      query += ` AND amount >= $${paramCount}`;
      params.push(filters.minAmount);
      paramCount++;
    }

    if (filters?.maxAmount !== undefined) {
      query += ` AND amount <= $${paramCount}`;
      params.push(filters.maxAmount);
      paramCount++;
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getTransaction(id: number): Promise<Transaction> {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Transaction not found");
    return result.rows[0];
  },

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  },

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, description, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        transactionData.userId,
        transactionData.amount,
        transactionData.description,
        transactionData.type
      ]
    );
    return result.rows[0];
  },

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(transactionData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE transactions SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Transaction not found");
    return result.rows[0];
  },

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Employee methods implementation (POS)
  async getAllEmployees(filters?: { role?: string }): Promise<Employee[]> {
    let query = "SELECT * FROM employees WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.role) {
      query += ` AND role = $${paramCount}`;
      params.push(filters.role);
      paramCount++;
    }

    query += " ORDER BY name";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getEmployee(id: string): Promise<Employee> {
    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Employee not found");
    return result.rows[0];
  },

  async getEmployeeByPin(pin: string): Promise<Employee | undefined> {
    const result = await pool.query(
      "SELECT * FROM employees WHERE pin = $1",
      [pin]
    );
    return result.rows[0];
  },

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const result = await pool.query(
      `INSERT INTO employees (name, role, pin)
       VALUES ($1, $2, $3) RETURNING *`,
      [
        employeeData.name,
        employeeData.role,
        employeeData.pin
      ]
    );
    return result.rows[0];
  },

  async updateEmployee(id: string, employeeData: Partial<InsertEmployee>): Promise<Employee> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(employeeData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE employees SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Employee not found");
    return result.rows[0];
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // POS Device methods implementation
  async getAllPosDevices(filters?: { isActive?: boolean }): Promise<PosDevice[]> {
    let query = "SELECT * FROM pos_devices WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.isActive !== undefined) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.isActive ? 'active' : 'inactive');
      paramCount++;
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getPosDevice(id: number): Promise<PosDevice> {
    const result = await pool.query(
      "SELECT * FROM pos_devices WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("POS device not found");
    return result.rows[0];
  },

  async createPosDevice(deviceData: InsertPosDevice): Promise<PosDevice> {
    const result = await pool.query(
      `INSERT INTO pos_devices (name, location, status, last_active, sales)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        deviceData.name,
        deviceData.location || null,
        deviceData.status,
        deviceData.lastActive || null,
        deviceData.sales || 0
      ]
    );
    return result.rows[0];
  },

  async updatePosDevice(id: number, deviceData: Partial<InsertPosDevice>): Promise<PosDevice> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(deviceData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE pos_devices SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("POS device not found");
    return result.rows[0];
  },

  async deletePosDevice(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM pos_devices WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Product Category methods implementation
  async getAllProductCategories(): Promise<ProductCategory[]> {
    const result = await pool.query(
      "SELECT * FROM product_categories ORDER BY name"
    );
    return result.rows;
  },

  async getProductCategory(id: number): Promise<ProductCategory> {
    const result = await pool.query(
      "SELECT * FROM product_categories WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Product category not found");
    return result.rows[0];
  },

  async createProductCategory(categoryData: InsertProductCategory): Promise<ProductCategory> {
    const result = await pool.query(
      `INSERT INTO product_categories (name, description, is_active)
       VALUES ($1, $2, $3) RETURNING *`,
      [
        categoryData.name,
        categoryData.description || null,
        categoryData.isActive
      ]
    );
    return result.rows[0];
  },

  async updateProductCategory(id: number, categoryData: Partial<InsertProductCategory>): Promise<ProductCategory> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(categoryData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE product_categories SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Product category not found");
    return result.rows[0];
  },

  async deleteProductCategory(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM product_categories WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Product methods implementation
  async getAllProducts(filters?: { categoryId?: number; minPrice?: number; maxPrice?: number; isAvailable?: boolean }): Promise<Product[]> {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.categoryId !== undefined) {
      query += ` AND category_id = $${paramCount}`;
      params.push(filters.categoryId);
      paramCount++;
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters?.isAvailable !== undefined) {
      query += ` AND is_available = $${paramCount}`;
      params.push(filters.isAvailable);
      paramCount++;
    }

    query += " ORDER BY name";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getProduct(id: number): Promise<Product> {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Product not found");
    return result.rows[0];
  },

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    const result = await pool.query(
      "SELECT * FROM products WHERE category_id = $1 ORDER BY name",
      [categoryId]
    );
    return result.rows;
  },

  async createProduct(productData: InsertProduct): Promise<Product> {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category_id, is_available, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        productData.name,
        productData.description || null,
        productData.price,
        productData.categoryId || null,
        productData.isAvailable,
        productData.imageUrl || null
      ]
    );
    return result.rows[0];
  },

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(productData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Product not found");
    return result.rows[0];
  },

  async deleteProduct(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // POS Table methods implementation
  async getAllPosTables(filters?: { isOccupied?: boolean }): Promise<PosTable[]> {
    let query = "SELECT * FROM pos_tables WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.isOccupied !== undefined) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.isOccupied ? 'occupied' : 'available');
      paramCount++;
    }

    query += " ORDER BY number";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getPosTable(id: number): Promise<PosTable> {
    const result = await pool.query(
      "SELECT * FROM pos_tables WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("POS table not found");
    return result.rows[0];
  },

  async createPosTable(tableData: InsertPosTable): Promise<PosTable> {
    const result = await pool.query(
      `INSERT INTO pos_tables (id, name, number, area, capacity, status, current_order_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        tableData.id,
        tableData.name,
        tableData.number || null,
        tableData.area || null,
        tableData.capacity || null,
        tableData.status,
        tableData.currentOrderId || null
      ]
    );
    return result.rows[0];
  },

  async updatePosTable(id: number, tableData: Partial<InsertPosTable>): Promise<PosTable> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(tableData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE pos_tables SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("POS table not found");
    return result.rows[0];
  },

  // 2 - SUITE

  // ... (previous storage.ts content continues)

  // POS Table methods implementation (continued)
  async deletePosTable(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM pos_tables WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Order methods implementation
  async getAllOrders(filters?: { tableId?: number; employeeId?: string; status?: string; startDate?: Date; endDate?: Date }): Promise<Order[]> {
    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.tableId !== undefined) {
      query += ` AND table_id = $${paramCount}`;
      params.push(filters.tableId);
      paramCount++;
    }

    if (filters?.employeeId) {
      query += ` AND customer_name = $${paramCount}`;
      params.push(filters.employeeId);
      paramCount++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getOrder(id: number): Promise<Order> {
    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Order not found");
    return result.rows[0];
  },

  async getOrdersByTableId(tableId: number): Promise<Order[]> {
    const result = await pool.query(
      "SELECT * FROM orders WHERE table_id = $1 ORDER BY created_at DESC",
      [tableId]
    );
    return result.rows;
  },

  async getOrdersByEmployeeId(employeeId: string): Promise<Order[]> {
    const result = await pool.query(
      "SELECT * FROM orders WHERE customer_name = $1 ORDER BY created_at DESC",
      [employeeId]
    );
    return result.rows;
  },

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO orders (table_id, customer_name, status, total, created_at, updated_at, payment_method, priority, estimated_completion_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        orderData.tableId,
        orderData.customerName,
        orderData.status,
        orderData.total,
        orderData.createdAt || now,
        orderData.updatedAt || now,
        orderData.paymentMethod,
        orderData.priority,
        orderData.estimatedCompletionTime
      ]
    );
    return result.rows[0];
  },

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(orderData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE orders SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Order not found");
    return result.rows[0];
  },

  async deleteOrder(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Order Item methods implementation
  async getAllOrderItems(filters?: { orderId?: number }): Promise<OrderItem[]> {
    let query = "SELECT * FROM order_items WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.orderId !== undefined) {
      query += ` AND order_id = $${paramCount}`;
      params.push(filters.orderId);
      paramCount++;
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getOrderItem(id: number): Promise<OrderItem> {
    const result = await pool.query(
      "SELECT * FROM order_items WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Order item not found");
    return result.rows[0];
  },

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    const result = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id",
      [orderId]
    );
    return result.rows;
  },

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price, subtotal, notes, status, category, preparation_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, // Correction: Ajout de order_id dans la requête
      [
        orderItemData.orderId,
        orderItemData.productId,
        orderItemData.quantity,
        orderItemData.price,
        orderItemData.subtotal,
        orderItemData.notes,
        orderItemData.status,
        orderItemData.category,
        orderItemData.preparationTime
      ]
    );
    return result.rows[0];
  },

  async updateOrderItem(id: number, orderItemData: Partial<InsertOrderItem>): Promise<OrderItem> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(orderItemData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE order_items SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Order item not found");
    return result.rows[0];
  },

  async deleteOrderItem(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM order_items WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // POS History methods implementation
  async getAllPosHistory(filters?: { employeeId?: string; deviceId?: number; startDate?: Date; endDate?: Date }): Promise<PosHistory[]> {
    let query = "SELECT * FROM pos_history WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.employeeId) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.employeeId);
      paramCount++;
    }

    if (filters?.deviceId !== undefined) {
      query += ` AND table_id = $${paramCount}`;
      params.push(filters.deviceId);
      paramCount++;
    }

    if (filters?.startDate) {
      query += ` AND timestamp >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters?.endDate) {
      query += ` AND timestamp <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += " ORDER BY timestamp DESC";
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getPosHistory(id: number): Promise<PosHistory> {
    const result = await pool.query(
      "SELECT * FROM pos_history WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("POS history not found");
    return result.rows[0];
  },

  async createPosHistory(historyData: InsertPosHistory): Promise<PosHistory> {
    const result = await pool.query(
      `INSERT INTO pos_history (id, type, description, user_id, user_name, user_role, timestamp, amount, order_id, table_id, table_name, details, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        historyData.id,
        historyData.type,
        historyData.description || null,
        historyData.userId || null,
        historyData.userName || null,
        historyData.userRole || null,
        historyData.timestamp,
        historyData.amount || null,
        historyData.orderId || null,
        historyData.tableId || null,
        historyData.tableName || null,
        historyData.details || null,
        historyData.status || null
      ]
    );
    return result.rows[0];
  },

  async updatePosHistory(id: number, historyData: Partial<InsertPosHistory>): Promise<PosHistory> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(historyData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE pos_history SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("POS history not found");
    return result.rows[0];
  },

  async deletePosHistory(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM pos_history WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },

  // Payment Method methods implementation
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    const result = await pool.query(
      "SELECT * FROM payment_methods ORDER BY name"
    );
    return result.rows;
  },

  async getPaymentMethod(id: number): Promise<PaymentMethod> {
    const result = await pool.query(
      "SELECT * FROM payment_methods WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) throw new Error("Payment method not found");
    return result.rows[0];
  },

  async createPaymentMethod(paymentMethodData: InsertPaymentMethod): Promise<PaymentMethod> {
    const result = await pool.query(
      `INSERT INTO payment_methods (name, value)
       VALUES ($1, $2) RETURNING *`,
      [
        paymentMethodData.name,
        paymentMethodData.value
      ]
    );
    return result.rows[0];
  },

  async updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(paymentMethodData)) {
      if (value !== undefined) {
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE payment_methods SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new Error("Payment method not found");
    return result.rows[0];
  },

  async deletePaymentMethod(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM payment_methods WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows.length > 0;
  },
};