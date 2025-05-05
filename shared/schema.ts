import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define user roles type
export type UserRole = "user" | "artist" | "club" | "admin";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["user", "artist", "club", "admin"] }).notNull().default("user"),
  profileImage: text("profile_image"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  artist: one(artists, {
    fields: [users.id],
    references: [artists.userId],
  }),
  club: one(clubs, {
    fields: [users.id],
    references: [clubs.userId],
  }),
  feedback: many(feedback),
  transactions: many(transactions),
}));

// Artists table
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  displayName: text("display_name").notNull(),
  genre: text("genre").notNull(),
  bio: text("bio"),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull().default("0"),
  tags: jsonb("tags").notNull().default([]),
  popularity: integer("popularity").notNull().default(0),
});

export const artistsRelations = relations(artists, ({ one, many }) => ({
  user: one(users, {
    fields: [artists.userId],
    references: [users.id],
  }),
  eventArtists: many(eventArtists),
  invitations: many(invitations),
  feedback: many(feedback),
}));

// Clubs table
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  address: text("address"),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  profileImage: text("profile_image"),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
});

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  user: one(users, {
    fields: [clubs.userId],
    references: [users.id],
  }),
  events: many(events),
  invitations: many(invitations),
  feedback: many(feedback),
}));

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
  venueName: text("venue_name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  coverImage: text("cover_image"),
  participantCount: integer("participant_count").notNull().default(0),
  popularity: integer("popularity").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, {
    fields: [events.clubId],
    references: [clubs.id],
  }),
  eventArtists: many(eventArtists),
  tickets: many(tickets),
  feedback: many(feedback),
}));

// Event Artists (junction table)
export const eventArtists = pgTable("event_artists", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.artistId] }),
}));

export const eventArtistsRelations = relations(eventArtists, ({ one }) => ({
  event: one(events, {
    fields: [eventArtists.eventId],
    references: [events.id],
  }),
  artist: one(artists, {
    fields: [eventArtists.artistId],
    references: [artists.id],
  }),
}));

// Invitations table (for clubs to invite artists)
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

export const invitationsRelations = relations(invitations, ({ one }) => ({
  club: one(clubs, {
    fields: [invitations.clubId],
    references: [clubs.id],
  }),
  artist: one(artists, {
    fields: [invitations.artistId],
    references: [artists.id],
  }),
}));

// Tickets table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  isUsed: boolean("is_used").notNull().default(false),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));

// Feedback table
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

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [feedback.eventId],
    references: [events.id],
  }),
  artist: one(artists, {
    fields: [feedback.artistId],
    references: [artists.id],
  }),
  club: one(clubs, {
    fields: [feedback.clubId],
    references: [clubs.id],
  }),
}));

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["deposit", "withdrawal", "payment", "refund"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// Create Zod validation schemas
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: (schema) => schema.email("Veuillez entrer un email valide"),
  password: (schema) => schema.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: (schema) => schema.min(1, "Le prénom est requis"),
  lastName: (schema) => schema.min(1, "Le nom est requis"),
});

export const insertArtistSchema = createInsertSchema(artists);
export const insertClubSchema = createInsertSchema(clubs);
export const insertEventSchema = createInsertSchema(events);
export const insertEventArtistSchema = createInsertSchema(eventArtists);
export const insertInvitationSchema = createInsertSchema(invitations);
export const insertTicketSchema = createInsertSchema(tickets);
export const insertFeedbackSchema = createInsertSchema(feedback);
export const insertTransactionSchema = createInsertSchema(transactions);

// Export types
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
