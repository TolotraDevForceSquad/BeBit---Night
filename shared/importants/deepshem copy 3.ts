// D:\Projet\BeBit\bebit - new\shared\schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ======================
// Users table
// ======================
export type UserRole = "user" | "artist" | "club" | "admin";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["user", "artist", "club", "admin"] }).notNull().default("user"),
  profileImage: text("profile_image"),
  city: text("city").default(""),
  country: text("country").default(""),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0"),
  isVerified: boolean("is_verified").notNull().default(false),
  phone: text("phone"),
  verificationStatus: text("verification_status", { enum: ["pending", "approved", "rejected"] }),
  verificationDocuments: jsonb("verification_documents").default("[]"),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  emailNotificationsEnabled: boolean("email_notifications_enabled").notNull().default(true),
  darkMode: boolean("dark_mode").notNull().default(false),
  language: text("language").notNull().default("fr"),
  locationEnabled: boolean("location_enabled").notNull().default(true),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Artists table
// ======================
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  displayName: text("display_name").notNull(),
  genre: text("genre").notNull(),
  bio: text("bio"),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull().default("0"),
  tags: jsonb("tags").notNull().default("[]"),
  popularity: integer("popularity").notNull().default(0),
  socialMedia: jsonb("social_media").default("{}"),
  contact: jsonb("contact").default("{}"),
  location: text("location").default(""),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  bookings: integer("bookings").default(0),
});

export const artistPortfolios = pgTable("artist_portfolios", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Clubs table
// ======================
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  profileImage: text("profile_image"),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  category: text("category").notNull().default("Nightclub"),
  coverImage: text("cover_image"),
  featured: boolean("featured").default(false),
  instagram: text("instagram"),
  website: text("website"),
  openingHours: jsonb("opening_hours").default("{}"),
  features: jsonb("features").default("[]"),
  hasTableReservation: boolean("has_table_reservation").default(false),
});

export const clubLocations = pgTable("club_locations", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clubTables = pgTable("club_tables", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Events table
// ======================
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default(""),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  venueName: text("venue_name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  coverImage: text("cover_image"),
  participantCount: integer("participant_count").notNull().default(0),
  popularity: integer("popularity").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  status: text("status", { enum: ["upcoming", "planning", "past", "cancelled"] }).default("planning"),
  mood: text("mood", { enum: ["energetic", "chill", "romantic", "dark", "festive"] }),
  reserveTables: boolean("reserve_tables").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventReservedTables = pgTable("event_reserved_tables", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  tableId: integer("table_id").references(() => clubTables.id).notNull(),
  reservedAt: timestamp("reserved_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.tableId] }),
}));

// ======================
// Event Artists junction table
// ======================
export const eventArtists = pgTable("event_artists", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.artistId] }),
}));

export const eventParticipants = pgTable("event_participants", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "confirmed"] }).notNull().default("pending"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.userId] }),
}));

// ======================
// Invitations table
// ======================
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  invitedById: integer("invited_by_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "accepted", "declined", "confirmed", "cancelled", "rejected", "negotiation", "preparation", "completed"] }).notNull().default("pending"),
  progress: integer("progress").default(0),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  expectedAttendees: integer("expected_attendees").default(0),
  genre: text("genre"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Tickets table
// ======================
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  ticketTypeId: integer("ticket_type_id").references(() => ticketTypes.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
  status: text("status", { enum: ["purchased", "used", "refunded"] }).default("purchased"),
});

export const ticketTypes = pgTable("ticketTypes", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
});

// ======================
// Feedback table
// ======================
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  sourceType: text("source_type", { enum: ["user", "club", "artist", "event"] }).notNull(),
  sourceId: integer("source_id").notNull(),
  title: text("title").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  reply: text("reply"),
  sourceName: text("source_name").notNull(),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackLikes = pgTable("feedback_likes", {
  feedbackId: integer("feedback_id").references(() => feedback.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  likedAt: timestamp("liked_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.feedbackId, t.userId] }),
}));

export const feedbackComments = pgTable("feedback_comments", {
  id: serial("id").primaryKey(),
  feedbackId: integer("feedback_id").references(() => feedback.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Photos tables
// ======================
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail").notNull(),
  tags: jsonb("tags").default("[]"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const photoLikes = pgTable("photo_likes", {
  photoId: integer("photo_id").references(() => photos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  likedAt: timestamp("liked_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.photoId, t.userId] }),
}));

export const photoComments = pgTable("photo_comments", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => photos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Collaboration tables
// ======================
export const collaborationMilestones = pgTable("collaboration_milestones", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").references(() => invitations.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed"] }).notNull().default("pending"),
  assignedTo: text("assigned_to", { enum: ["artist", "club", "both"] }).notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collaborationMessages = pgTable("collaboration_messages", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").references(() => invitations.id).notNull(),
  senderType: text("sender_type", { enum: ["club", "artist"] }).notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Transactions table
// ======================
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type", { enum: ["credit", "debit", "fee", "withdrawal"] }).notNull(),
  status: text("status", { enum: ["completed", "processing", "failed"] }).notNull().default("processing"),
  description: text("description").notNull(),
  reference: text("reference").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Autres tables
// ======================
export const customerProfiles = pgTable("customer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  preferences: jsonb("preferences").default("{}"),
  visitHistory: jsonb("visit_history").default("[]"),
});

export const musicGenres = pgTable("music_genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const drinkTypes = pgTable("drink_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

export const customerTags = pgTable("customer_tags", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customerProfiles.id).notNull(),
  tag: text("tag").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.customerId, t.tag] }),
}));

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  clubId: integer("club_id").references(() => clubs.id),
  title: text("title").notNull(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: decimal("discount_value", { precision: 5, scale: 2 }).notNull(),
  status: text("status", { enum: ["active", "inactive", "expired"] }).notNull().default("active"),
  channels: jsonb("channels").default("[]"),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["card", "bank", "mobile"] }).notNull(),
  details: jsonb("details").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["paid", "pending", "overdue"] }).notNull().default("pending"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// POS/Employees tables
// ======================
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posDevices = pgTable("pos_devices", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  serialNumber: text("serial_number").unique().notNull(),
  isActive: boolean("is_active").default(true),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => productCategories.id).notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  image: text("image"),
});

export const posTables = pgTable("pos_tables", {
  id: serial("id").primaryKey(),
  posDeviceId: integer("pos_device_id").references(() => posDevices.id).notNull(),
  tableNumber: integer("table_number").notNull(),
  capacity: integer("capacity").notNull(),
  status: text("status", { enum: ["available", "occupied", "reserved"] }).default("available"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  posTableId: integer("pos_table_id").references(() => posTables.id),
  employeeId: integer("employee_id").references(() => employees.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "preparing", "ready", "served", "paid"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const posHistory = pgTable("pos_history", {
  id: serial("id").primaryKey(),
  posDeviceId: integer("pos_device_id").references(() => posDevices.id).notNull(),
  action: text("action").notNull(),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const paymentMethodsPos = pgTable("payment_methods_pos", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  type: text("type", { enum: ["cash", "card", "mobile"] }).notNull(),
  details: jsonb("details"),
});

// ======================
// Insert Schemas
// ======================
export const insertUserSchema = createInsertSchema(users, {
  role: (schema) => schema.refine((val) => ["user", "artist", "club", "admin"].includes(val), "Rôle invalide"),
});

export const insertArtistSchema = createInsertSchema(artists, {
  socialMedia: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format socialMedia invalide"),
  contact: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format contact invalide"),
  rating: (schema) => schema.min(0).max(5, "Rating entre 0 et 5"),
  bookings: (schema) => schema.min(0, "Bookings non négatif"),
});
export const insertArtistPortfolioSchema = createInsertSchema(artistPortfolios);

export const insertClubSchema = createInsertSchema(clubs, {
  category: (schema) => schema.min(1, "Catégorie requise"),
  openingHours: (schema) => schema.refine((val) => typeof val === 'object', "Format openingHours invalide"),
  features: (schema) => schema.refine((val) => Array.isArray(val), "Features doit être un array"),
});
export const insertClubLocationSchema = createInsertSchema(clubLocations);

export const insertClubTableSchema = createInsertSchema(clubTables, {
  capacity: (schema) => schema.int().min(1, "Capacité minimale 1"),
  price: (schema) => schema.min(0, "Prix non négatif"),
  available: (schema) => schema.default(true),
});

export const insertEventSchema = createInsertSchema(events, {
  date: (schema) => schema.refine((val) => val > new Date(), "Date doit être future"),
  startTime: (schema) => schema.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format heure invalide"),
  endTime: (schema) => schema.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format heure invalide"),
  price: (schema) => schema.min(0, "Prix non négatif"),
  capacity: (schema) => schema.int().min(1, "Capacité minimale 1"),
  reserveTables: (schema) => schema.default(false),
});
export const insertEventArtistSchema = createInsertSchema(eventArtists);

export const insertEventReservedTableSchema = createInsertSchema(eventReservedTables);

export const insertEventParticipantSchema = createInsertSchema(eventParticipants, {
  status: (schema) => schema.refine((val) => ["pending", "confirmed"].includes(val), "Status participant invalide"),
});

export const insertInvitationSchema = createInsertSchema(invitations, {
  status: (schema) => schema.refine((val) => 
    ["pending", "accepted", "rejected", "confirmed", "cancelled", "declined", "negotiation", "preparation", "completed"].includes(val), 
    "Statut invalide"
  ),
  progress: (schema) => schema.min(0).max(100, "Progress doit être entre 0 et 100"),
  expectedAttendees: (schema) => schema.int().min(0, "Nombre attendu invalide"),
  genre: (schema) => schema.optional(),
  description: (schema) => schema.optional(),
  invitedById: (schema) => schema.int().min(1, "Invité par requis"),
});

export const insertTicketSchema = createInsertSchema(tickets);
export const insertTicketTypeSchema = createInsertSchema(ticketTypes);

export const insertFeedbackSchema = createInsertSchema(feedback, {
  sourceType: (schema) => schema.refine((val) => ["user", "club", "artist", "event"].includes(val), "Source type invalide"),
  title: (schema) => schema.min(1, "Titre requis"),
  rating: (schema) => schema.int().min(1).max(5, "Rating entre 1 et 5"),
  comment: (schema) => schema.min(10, "Commentaire trop court"),
  reply: (schema) => schema.optional(),
  sourceName: (schema) => schema.min(1, "Nom source requis"),
  likesCount: (schema) => schema.int().min(0, "Likes non négatif"),
  commentsCount: (schema) => schema.int().min(0, "Comments non négatif"),
});

export const insertFeedbackLikeSchema = createInsertSchema(feedbackLikes);

export const insertFeedbackCommentSchema = createInsertSchema(feedbackComments, {
  content: (schema) => schema.min(1, "Commentaire vide invalide"),
});

export const insertCollaborationMilestoneSchema = createInsertSchema(collaborationMilestones, {
  status: (schema) => schema.refine((val) => ["pending", "in_progress", "completed"].includes(val), "Statut milestone invalide"),
  assignedTo: (schema) => schema.refine((val) => ["artist", "club", "both"].includes(val), "Assigné invalide"),
  priority: (schema) => schema.refine((val) => ["low", "medium", "high"].includes(val), "Priorité invalide"),
});

export const insertCollaborationMessageSchema = createInsertSchema(collaborationMessages, {
  senderType: (schema) => schema.refine((val) => ["club", "artist"].includes(val), "Type sender invalide"),
  content: (schema) => schema.min(1, "Message vide invalide").max(2000, "Message trop long"),
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  type: (schema) => schema.refine((val) => ["credit", "debit", "fee", "withdrawal"].includes(val), "Type de transaction invalide"),
  status: (schema) => schema.refine((val) => ["completed", "processing", "failed"].includes(val), "Statut invalide"),
});
export const insertCustomerProfileSchema = createInsertSchema(customerProfiles);
export const insertMusicGenreSchema = createInsertSchema(musicGenres);
export const insertDrinkTypeSchema = createInsertSchema(drinkTypes);
export const insertCustomerTagSchema = createInsertSchema(customerTags);

export const insertPromotionSchema = createInsertSchema(promotions, {
  discountType: (schema) => schema.refine((val) => ["percentage", "fixed"].includes(val), "Type de discount invalide"),
  status: (schema) => schema.refine((val) => ["active", "inactive", "expired"].includes(val), "Statut invalide"),
  channels: (schema) => schema.refine((val) => Array.isArray(val), "Channels doit être un array"),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods, {
  type: (schema) => schema.refine((val) => ["card", "bank", "mobile"].includes(val), "Type de paiement invalide"),
  details: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format details invalide"),
});

export const insertInvoiceSchema = createInsertSchema(invoices, {
  status: (schema) => schema.refine((val) => ["paid", "pending", "overdue"].includes(val), "Statut de facture invalide"),
});

export const insertPhotoSchema = createInsertSchema(photos, {
  title: (schema) => schema.min(1, "Titre photo requis"),
  url: (schema) => schema.url("URL image invalide"),
  thumbnail: (schema) => schema.url("URL miniature invalide"),
  tags: (schema) => schema.refine((val) => Array.isArray(val), "Tags doit être un array"),
  likesCount: (schema) => schema.int().min(0),
  commentsCount: (schema) => schema.int().min(0),
});

export const insertPhotoLikeSchema = createInsertSchema(photoLikes);

export const insertPhotoCommentSchema = createInsertSchema(photoComments, {
  content: (schema) => schema.min(1, "Commentaire vide invalide").max(2000, "Commentaire trop long"),
});

export const insertEmployeeSchema = createInsertSchema(employees);
export const insertPosDeviceSchema = createInsertSchema(posDevices);
export const insertProductCategorySchema = createInsertSchema(productCategories);
export const insertProductSchema = createInsertSchema(products);
export const insertPosTableSchema = createInsertSchema(posTables);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertPosHistorySchema = createInsertSchema(posHistory);
export const insertPaymentMethodPosSchema = createInsertSchema(paymentMethodsPos);

// ======================
// Export types
// ======================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type ArtistPortfolio = typeof artistPortfolios.$inferSelect;
export type InsertArtistPortfolio = z.infer<typeof insertArtistPortfolioSchema>;

export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type ClubLocation = typeof clubLocations.$inferSelect;
export type InsertClubLocation = z.infer<typeof insertClubLocationSchema>;
export type ClubTable = typeof clubTables.$inferSelect;
export type InsertClubTable = z.infer<typeof insertClubTableSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventArtist = typeof eventArtists.$inferSelect;
export type InsertEventArtist = z.infer<typeof insertEventArtistSchema>;
export type EventReservedTable = typeof eventReservedTables.$inferSelect;
export type InsertEventReservedTable = z.infer<typeof insertEventReservedTableSchema>;

export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type TicketType = typeof ticketTypes.$inferSelect;
export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type FeedbackLike = typeof feedbackLikes.$inferSelect;
export type InsertFeedbackLike = z.infer<typeof insertFeedbackLikeSchema>;
export type FeedbackComment = typeof feedbackComments.$inferSelect;
export type InsertFeedbackComment = z.infer<typeof insertFeedbackCommentSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type MusicGenre = typeof musicGenres.$inferSelect;
export type InsertMusicGenre = z.infer<typeof insertMusicGenreSchema>;
export type DrinkType = typeof drinkTypes.$inferSelect;
export type InsertDrinkType = z.infer<typeof insertDrinkTypeSchema>;
export type CustomerTag = typeof customerTags.$inferSelect;
export type InsertCustomerTag = z.infer<typeof insertCustomerTagSchema>;

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type PhotoLike = typeof photoLikes.$inferSelect;
export type InsertPhotoLike = z.infer<typeof insertPhotoLikeSchema>;
export type PhotoComment = typeof photoComments.$inferSelect;
export type InsertPhotoComment = z.infer<typeof insertPhotoCommentSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type PosDevice = typeof posDevices.$inferSelect;
export type InsertPosDevice = z.infer<typeof insertPosDeviceSchema>;
export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type PosTable = typeof posTables.$inferSelect;
export type InsertPosTable = z.infer<typeof insertPosTableSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type PosHistory = typeof posHistory.$inferSelect;
export type InsertPosHistory = z.infer<typeof insertPosHistorySchema>;
export type PaymentMethodPos = typeof paymentMethodsPos.$inferSelect;
export type InsertPaymentMethodPos = z.infer<typeof insertPaymentMethodPosSchema>;

export type CollaborationMilestone = typeof collaborationMilestones.$inferSelect;
export type InsertCollaborationMilestone = z.infer<typeof insertCollaborationMilestoneSchema>;
export type CollaborationMessage = typeof collaborationMessages.$inferSelect;
export type InsertCollaborationMessage = z.infer<typeof insertCollaborationMessageSchema>;