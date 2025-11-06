// D:\Projet\BeBit\bebit - new\shared\schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
// ======================
// Users table (modifiée avec nouveaux champs pour préférences)
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
  // Nouveaux champs pour préférences (avec defaults)
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
  mood: text("mood", { enum: ["energetic", "chill", "romantic", "dark", "festive"] }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
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
// ======================
// Invitations table
// ======================
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  message: text("message"),
  fee: decimal("fee", { precision: 10, scale: 2 }),
  date: timestamp("date"),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// ======================
// Tickets table
// ======================
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  isUsed: boolean("is_used").notNull().default(false),
});
// ======================
// Feedback table
// ======================
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id),
  clubId: integer("club_id").references(() => clubs.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// ======================
// Transactions table
// ======================
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["deposit", "withdrawal", "payment", "refund"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// ======================
// POS tables (Employees, Devices, Tables, Orders)
// ======================
// Employees
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  pin: text("pin").notNull(),
  status: boolean("status").notNull(),
  deviceId: integer("device_id").references(() => posDevices.id),
  // clubId: integer("club_id").references(() => clubs.id).notNull(),
});
// POS Devices
export const posDevices = pgTable("pos_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  status: boolean("status").notNull(),
  lastActive: text("last_active"),
  sales: integer("sales"),
});
// Product Categories
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});
// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  categoryId: integer("category_id").references(() => productCategories.id),
  destinations: text("destinations").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  imageUrl: text("image_url"),
});
// POS Tables
export const posTables = pgTable("pos_tables", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  number: integer("number"),
  area: text("area"),
  capacity: integer("capacity"),
  status: text("status").notNull(),
  currentOrderId: integer("current_order_id"),
});
// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").references(() => posTables.id),
  customerName: text("customer_name"),
  status: text("status").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  paymentMethod: text("payment_method"),
  priority: text("priority"),
  estimatedCompletionTime: timestamp("estimated_completion_time"),
});
// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price"),
  notes: text("notes"),
  subtotal: integer("subtotal").notNull(),
  status: text("status"),
  category: text("category"),
  preparationTime: integer("preparation_time"),
});
// POS History
export const posHistory = pgTable("pos_history", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => employees.id),
  userName: text("user_name"),
  userRole: text("user_role"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  amount: integer("amount"),
  orderId: integer("order_id").references(() => orders.id),
  tableId: integer("table_id").references(() => posTables.id),
  tableName: text("table_name"),
  details: text("details"),
  status: text("status"),
});
// Payment Methods
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
});
// ======================
// Relations
// ======================
// Users relations
export const usersRelations = relations(users, ({ one, many }) => ({
  artist: one(artists, { fields: [users.id], references: [artists.userId] }),
  club: one(clubs, { fields: [users.id], references: [clubs.userId] }),
  feedback: many(feedback),
  transactions: many(transactions),
  tickets: many(tickets),
}));
// Artists relations
export const artistsRelations = relations(artists, ({ one, many }) => ({
  user: one(users, { fields: [artists.userId], references: [users.id] }),
  eventArtists: many(eventArtists),
  invitations: many(invitations),
  feedback: many(feedback),
}));
// Clubs relations
export const clubsRelations = relations(clubs, ({ one, many }) => ({
  user: one(users, { fields: [clubs.userId], references: [users.id] }),
  events: many(events),
  invitations: many(invitations),
  feedback: many(feedback),
  employees: many(employees),
}));
// Events relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  eventArtists: many(eventArtists),
  tickets: many(tickets),
  feedback: many(feedback),
}));
// Event Artists relations
export const eventArtistsRelations = relations(eventArtists, ({ one }) => ({
  event: one(events, { fields: [eventArtists.eventId], references: [events.id] }),
  artist: one(artists, { fields: [eventArtists.artistId], references: [artists.id] }),
}));
// Invitations relations
export const invitationsRelations = relations(invitations, ({ one }) => ({
  club: one(clubs, { fields: [invitations.clubId], references: [clubs.id] }),
  artist: one(artists, { fields: [invitations.artistId], references: [artists.id] }),
}));
// Tickets relations
export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  user: one(users, { fields: [tickets.userId], references: [users.id] }),
}));
// Feedback relations
export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, { fields: [feedback.userId], references: [users.id] }),
  event: one(events, { fields: [feedback.eventId], references: [events.id] }),
  artist: one(artists, { fields: [feedback.artistId], references: [artists.id] }),
  club: one(clubs, { fields: [feedback.clubId], references: [clubs.id] }),
}));
// Transactions relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));
// POS relations
export const employeesRelations = relations(employees, ({ one, many }) => ({
  posDevice: one(posDevices, { fields: [employees.deviceId], references: [posDevices.id] }),
  // club: one(clubs, { fields: [employees.clubId], references: [clubs.id] }),
  posHistory: many(posHistory),
}));
export const posDevicesRelations = relations(posDevices, ({ many }) => ({
  employees: many(employees),
}));
export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  orderItems: many(orderItems),
}));
export const posTablesRelations = relations(posTables, ({ many }) => ({
  orders: many(orders),
  posHistory: many(posHistory),
}));
export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(posTables, { fields: [orders.tableId], references: [posTables.id] }),
  items: many(orderItems),
  posHistory: many(posHistory),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
export const posHistoryRelations = relations(posHistory, ({ one }) => ({
  user: one(employees, { fields: [posHistory.userId], references: [employees.id] }),
  order: one(orders, { fields: [posHistory.orderId], references: [orders.id] }),
  table: one(posTables, { fields: [posHistory.tableId], references: [posTables.id] }),
}));
export const paymentMethodsRelations = relations(paymentMethods, () => ({}));
// ======================
// Zod schemas for validation
// ======================
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: (schema) => schema.email("Veuillez entrer un email valide"),
  password: (schema) => schema.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: (schema) => schema.min(1, "Le prénom est requis"),
  lastName: (schema) => schema.min(1, "Le nom est requis"),
  // Nouvelles validations pour préférences
  language: (schema) => schema.default("fr").refine((val) => ["fr", "en"].includes(val), "Langue invalide"),
  notificationsEnabled: (schema) => schema.default(true),
  emailNotificationsEnabled: (schema) => schema.default(true),
  darkMode: (schema) => schema.default(false),
  locationEnabled: (schema) => schema.default(true),
  twoFactorEnabled: (schema) => schema.default(false),
});
export const insertArtistSchema = createInsertSchema(artists);
export const insertClubSchema = createInsertSchema(clubs);
export const insertEventSchema = createInsertSchema(events);
export const insertEventArtistSchema = createInsertSchema(eventArtists);
export const insertInvitationSchema = createInsertSchema(invitations);
export const insertTicketSchema = createInsertSchema(tickets);
export const insertFeedbackSchema = createInsertSchema(feedback);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertEmployeeSchema = createInsertSchema(employees);
export const insertPosDeviceSchema = createInsertSchema(posDevices);
export const insertProductCategorySchema = createInsertSchema(productCategories);
export const insertProductSchema = createInsertSchema(products);
export const insertPosTableSchema = createInsertSchema(posTables);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertPosHistorySchema = createInsertSchema(posHistory);
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
// ======================
// Export types
// ======================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventArtist = typeof eventArtists.$inferSelect;
export type InsertEventArtist = z.infer<typeof insertEventArtistSchema>;
export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
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
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;