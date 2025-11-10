// D:\Projet\BeBit\bebit - new\shared\schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ======================
// MODIFIED FOR: club-events-page.tsx - Enhancements v1.1
// ======================
// This schema has been extended to fully support club event management features:
// - Added table 'ticket_types' for event-specific ticket configurations (one-to-many with events).
// - Added table 'promotions' for event promotions with tracking (one-to-many with events).
// - Enhanced 'invitations' table with 'responseMessage' column for artist responses.
// - Extended relations for events to include ticket_types and promotions.
// - Added Zod schemas and TS types for new tables.
// No deletions; only additions for compatibility. Ready for ERD/class diagram generation.

type UserRole = "user" | "artist" | "club" | "admin";

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

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  displayName: text("display_name").notNull(),
  genre: text("genre").notNull(),
  bio: text("bio"),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull().default("0"),
  tags: jsonb("tags").notNull().default("[]"),
  popularity: integer("popularity").notNull().default(0),
  avatarUrl: text("avatar_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  locationId: integer("location_id").references(() => locations.id),
  experience: integer("experience").notNull().default(0),
  fee: decimal("fee", { precision: 10, scale: 2 }).notNull().default("0"),
  socialFollowers: integer("social_followers").notNull().default(0),
  availability: boolean("availability").notNull().default(true),
  followers: integer("followers").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  performances: integer("performances").notNull().default(0),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
  // NOUVEAUX CHAMPS pour BI Dashboard
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  visitorCount: integer("visitor_count").notNull().default(0),
  occupancyRate: decimal("occupancy_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  averageSpend: decimal("average_spend", { precision: 10, scale: 2 }).notNull().default("0"),
  // NOUVEAUX CHAMPS pour Wallet Page
  availableBalance: decimal("available_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  pendingBalance: decimal("pending_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  totalCumulativeRevenue: decimal("total_cumulative_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  withdrawalLimit: decimal("withdrawal_limit", { precision: 15, scale: 2 }).notNull().default("500000"), // 500,000 Ar par défaut
  minWithdrawalAmount: decimal("min_withdrawal_amount", { precision: 15, scale: 2 }).notNull().default("5000"), // 5,000 Ar par défaut
});

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
  status: text("status", { enum: ["upcoming", "planning", "past", "cancelled"] }).notNull().default("planning"),
  ticketTypesConfig: jsonb("ticket_types_config").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  clubId: integer("club_id").references(() => clubs.id), // NOUVEAU: Référence au club
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["deposit", "withdrawal", "payment", "refund", "credit", "debit", "fee"] }).notNull(), // ÉTENDU: Types supplémentaires
  status: text("status", { enum: ["pending", "completed", "failed", "cancelled"] }).notNull().default("pending"), // NOUVEAU: Statut de transaction
  reference: text("reference").unique(), // NOUVEAU: Référence unique (ex: "txn_132456789")
  metadata: jsonb("metadata").default("{}"), // NOUVEAU: Métadonnées supplémentaires
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // NOUVEAU: Date de mise à jour
});

// ======================
// NOUVELLES TABLES pour Wallet Page (inchangées)
// ======================

// Table pour les méthodes de paiement des clubs
export const clubPaymentMethods = pgTable("club_payment_methods", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  type: text("type", { enum: ["card", "bank", "mobile"] }).notNull(), // Type de méthode de paiement
  name: text("name").notNull(), // Nom affiché (ex: "VISA •••• 4242")
  isDefault: boolean("is_default").notNull().default(false), // Méthode par défaut
  // Champs pour cartes
  cardLastFour: text("card_last_four"),
  cardExpiry: text("card_expiry"),
  cardBrand: text("card_brand"),
  // Champs pour comptes bancaires/mobile
  accountNumber: text("account_number"),
  bankName: text("bank_name"),
  accountHolder: text("account_holder"),
  // Sécurité
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table pour les factures
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  reference: text("reference").notNull().unique(), // ex: "INV-001"
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull().default("0"),
  status: text("status", { enum: ["draft", "pending", "paid", "overdue", "cancelled"] }).notNull().default("draft"),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  metadata: jsonb("metadata").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table pour les analyses de revenus
export const revenueAnalytics = pgTable("revenue_analytics", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  periodDate: timestamp("period_date").notNull(), // Date de début de la période
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  // Répartition par source
  eventEntriesRevenue: decimal("event_entries_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  tableReservationsRevenue: decimal("table_reservations_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  barSalesRevenue: decimal("bar_sales_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  otherRevenue: decimal("other_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  // Métriques de croissance
  revenueGrowth: decimal("revenue_growth", { precision: 5, scale: 2 }).notNull().default("0"),
  averageMonthlyRevenue: decimal("average_monthly_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  topEventRevenue: decimal("top_event_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  topEventName: text("top_event_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table pour les retraits
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  paymentMethodId: integer("payment_method_id").references(() => clubPaymentMethods.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull().default("0"),
  fee: decimal("fee", { precision: 15, scale: 2 }).notNull().default("0"), // Frais de retrait (1.5%)
  netAmount: decimal("net_amount", { precision: 15, scale: 2 }).notNull().default("0"), // Montant net après frais
  status: text("status", { enum: ["pending", "processing", "completed", "failed", "cancelled"] }).notNull().default("pending"),
  reference: text("reference").unique(),
  processedAt: timestamp("processed_at"),
  estimatedCompletion: timestamp("estimated_completion"),
  metadata: jsonb("metadata").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// ADDED FOR club-events-page.tsx: Tables for event management
// ======================

// Table for ticket types per event (one-to-many with events)
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(), // e.g., "Standard", "VIP"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Ticket price in Ar
  available: integer("available").notNull().default(0), // Initial available quantity
  sold: integer("sold").notNull().default(0), // Sold quantity (updated via triggers/queries)
  description: text("description"),
  benefits: jsonb("benefits").default("[]"), // Array of benefits, e.g., ["Accès VIP", "1 boisson offerte"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table for promotions per event (one-to-many with events)
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(), // % or fixed amount
  code: text("code").notNull().unique(), // Promo code
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxUses: integer("max_uses"), // Null for unlimited
  usedCount: integer("used_count").notNull().default(0), // Track usages
  status: text("status", { enum: ["active", "inactive", "expired"] }).notNull().default("active"),
  channels: jsonb("channels").default("[]"), // e.g., ["email", "social"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enhanced invitations table (added column for artist responses)
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  message: text("message"),
  fee: decimal("fee", { precision: 10, scale: 2 }),
  status: text("status", { enum: ["pending", "accepted", "rejected", "declined", "cancelled", "confirmed"] }).notNull().default("pending"),
  eventName: text("event_name").notNull(),
  eventDate: timestamp("event_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  responseMessage: text("response_message"), // ADDED FOR club-events-page.tsx: Artist response text
  responseDate: timestamp("response_date"),
  readByArtist: boolean("read_by_artist").notNull().default(false),
  contractSigned: boolean("contract_signed").notNull().default(false),
  sentDate: timestamp("sent_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Tables BI Dashboard existantes (inchangées)
// ======================

export const financialMetrics = pgTable("financial_metrics", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  periodDate: timestamp("period_date").notNull(), // Date de début de la période
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  revenueGrowth: decimal("revenue_growth", { precision: 5, scale: 2 }).notNull().default("0"), // Pourcentage
  visitorCount: integer("visitor_count").notNull().default(0),
  visitorGrowth: decimal("visitor_growth", { precision: 5, scale: 2 }).notNull().default("0"),
  occupancyRate: decimal("occupancy_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  occupancyGrowth: decimal("occupancy_growth", { precision: 5, scale: 2 }).notNull().default("0"),
  averageSpend: decimal("average_spend", { precision: 10, scale: 2 }).notNull().default("0"),
  spendGrowth: decimal("spend_growth", { precision: 5, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const revenueByDay = pgTable("revenue_by_day", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  dayOfWeek: text("day_of_week").notNull(), // 'monday', 'tuesday', etc.
  dayLabel: text("day_label").notNull(), // 'Lun', 'Mar', etc.
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  period: timestamp("period").notNull(), // Date de référence pour la période
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const salesDistribution = pgTable("sales_distribution", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  category: text("category").notNull(), // 'boissons', 'entrees', 'tables_vip', 'divers'
  categoryLabel: text("category_label").notNull(), // Libellé affiché
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull().default("0"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  color: text("color"), // Couleur pour les graphiques
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const topProducts = pgTable("top_products", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  productName: text("product_name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  period: timestamp("period").notNull(),
  rank: integer("rank").notNull(), // Position dans le classement
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const growthTrends = pgTable("growth_trends", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  metric: text("metric").notNull(), // 'revenue', 'visitors', 'occupancy', 'spend'
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).notNull().default("0"),
  previousValue: decimal("previous_value", { precision: 15, scale: 2 }).notNull().default("0"),
  growthPercentage: decimal("growth_percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  direction: text("direction", { enum: ["up", "down", "stable"] }).notNull().default("stable"),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Tables restantes inchangées (conservées pour compatibilité)
// ======================

export const attendees = pgTable("attendees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  email: text("email").notNull(),
  phone: text("phone"),
  visits: integer("visits").notNull().default(0),
  lastVisit: timestamp("last_visit"),
  totalSpent: decimal("total_spent", { precision: 15, scale: 2 }).notNull().default("0"),
  avgSpent: decimal("avg_spent", { precision: 10, scale: 2 }).notNull().default("0"),
  birthday: timestamp("birthday"),
  address: text("address"),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  memberSince: timestamp("member_since").notNull(),
  status: text("status", { enum: ["active", "inactive", "banned"] }).notNull().default("active"),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviews: integer("reviews").notNull().default(0),
  lastFeedback: text("last_feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const drinkTypes = pgTable("drink_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category", { enum: ["alcoholic", "non-alcoholic"] }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customerTags = pgTable("customer_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["tag", "segment"] }).notNull(),
  description: text("description"),
  color: text("color"),
  clubId: integer("club_id").references(() => clubs.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const attendeePreferredEvents = pgTable("attendee_preferred_events", {
  attendeeId: integer("attendee_id").references(() => attendees.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.attendeeId, t.eventId] }),
}));

export const attendeeMusicPreferences = pgTable("attendee_music_preferences", {
  attendeeId: integer("attendee_id").references(() => attendees.id).notNull(),
  genreId: integer("genre_id").references(() => genres.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.attendeeId, t.genreId] }),
}));

export const attendeeDrinkPreferences = pgTable("attendee_drink_preferences", {
  attendeeId: integer("attendee_id").references(() => attendees.id).notNull(),
  drinkTypeId: integer("drink_type_id").references(() => drinkTypes.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.attendeeId, t.drinkTypeId] }),
}));

export const attendeeTags = pgTable("attendee_tags", {
  attendeeId: integer("attendee_id").references(() => attendees.id).notNull(),
  tagId: integer("tag_id").references(() => customerTags.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.attendeeId, t.tagId] }),
}));

export const visitTrends = pgTable("visit_trends", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  day: text("day").notNull(),
  count: integer("count").notNull().default(0),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const demographicGroups = pgTable("demographic_groups", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  label: text("label").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  type: text("type", { enum: ["age", "gender"] }).notNull(),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const spendingCategories = pgTable("spending_categories", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull().default("0"),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const retentionRates = pgTable("retention_rates", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  type: text("type").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const topEvents = pgTable("top_events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  attendance: integer("attendance").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const revenueTrends = pgTable("revenue_trends", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  comparisonPeriod: text("comparison_period").notNull(),
  direction: text("direction", { enum: ["up", "down"] }).notNull(),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ratingDistributions = pgTable("rating_distributions", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  stars: integer("stars").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  colorClass: text("color_class"),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customerFeedbacks = pgTable("customer_feedbacks", {
  id: serial("id").primaryKey(),
  attendeeId: integer("attendee_id").references(() => attendees.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  eventName: text("event_name"),
  relativeDate: text("relative_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const improvementAreas = pgTable("improvement_areas", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  priority: text("priority", { enum: ["high", "medium", "low"] }).notNull().default("medium"),
  colorClass: text("color_class"),
  period: timestamp("period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const improvementSuggestions = pgTable("improvement_suggestions", {
  id: serial("id").primaryKey(),
  areaId: integer("area_id").references(() => improvementAreas.id).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const artistGenres = pgTable("artist_genres", {
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  genreId: integer("genre_id").references(() => genres.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.artistId, t.genreId] }),
}));

export const artistSpecialties = pgTable("artist_specialties", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const artistPortfolio = pgTable("artist_portfolio", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventArtists = pgTable("event_artists", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.artistId] }),
}));

export const artistContacts = pgTable("artist_contacts", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  twitter: text("twitter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invitationHistory = pgTable("invitation_history", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").references(() => invitations.id).notNull(),
  status: text("status", { enum: ["pending", "accepted", "rejected", "declined", "cancelled", "confirmed"] }).notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  ticketType: text("ticket_type").notNull().default("standard"), // Existing string type (kept for compatibility)
  ticketTypeId: integer("ticket_type_id").references(() => ticketTypes.id), // ADDED FOR club-events-page.tsx: FK to new ticket_types (optional for legacy)
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  isUsed: boolean("is_used").notNull().default(false),
});

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

export const config = pgTable("config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Tables POS (inchangées)
// ======================

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  pin: text("pin").notNull(),
  status: boolean("status").notNull(),
  deviceId: integer("device_id").references(() => posDevices.id),
});

export const posDevices = pgTable("pos_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  status: boolean("status").notNull(),
  lastActive: text("last_active"),
  sales: integer("sales"),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

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

export const posTables = pgTable("pos_tables", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  number: integer("number"),
  area: text("area"),
  capacity: integer("capacity"),
  status: text("status").notNull(),
  currentOrderId: integer("current_order_id"),
});

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

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
});

// ======================
// Relations (MODIFIED FOR club-events-page.tsx: Added relations for new tables)
// ======================

// Users relations (inchangée)
export const usersRelations = relations(users, ({ one, many }) => ({
  artist: one(artists, { fields: [users.id], references: [artists.userId] }),
  club: one(clubs, { fields: [users.id], references: [clubs.userId] }),
  feedback: many(feedback),
  transactions: many(transactions),
  tickets: many(tickets),
  attendees: many(attendees),
}));

// Artists relations (inchangée)
export const artistsRelations = relations(artists, ({ one, many }) => ({
  user: one(users, { fields: [artists.userId], references: [users.id] }),
  eventArtists: many(eventArtists),
  invitations: many(invitations),
  feedback: many(feedback),
  location: one(locations, { fields: [artists.locationId], references: [locations.id] }),
  artistGenres: many(artistGenres),
  specialties: many(artistSpecialties),
  portfolio: many(artistPortfolio),
  contacts: one(artistContacts, { fields: [artists.id], references: [artistContacts.artistId] }),
}));

// Clubs relations (MODIFIÉE - nouvelles relations pour Wallet)
export const clubsRelations = relations(clubs, ({ one, many }) => ({
  user: one(users, { fields: [clubs.userId], references: [clubs.userId] }),
  events: many(events),
  invitations: many(invitations),
  feedback: many(feedback),
  employees: many(employees),
  attendees: many(attendees),
  visitTrends: many(visitTrends),
  demographicGroups: many(demographicGroups),
  spendingCategories: many(spendingCategories),
  retentionRates: many(retentionRates),
  topEvents: many(topEvents),
  revenueTrends: many(revenueTrends),
  ratingDistributions: many(ratingDistributions),
  improvementAreas: many(improvementAreas),
  customerTags: many(customerTags),
  // Relations BI Dashboard
  financialMetrics: many(financialMetrics),
  revenueByDay: many(revenueByDay),
  salesDistributions: many(salesDistribution),
  topProducts: many(topProducts),
  growthTrends: many(growthTrends),
  // NOUVELLES RELATIONS pour Wallet
  paymentMethods: many(clubPaymentMethods),
  invoices: many(invoices),
  revenueAnalytics: many(revenueAnalytics),
  withdrawals: many(withdrawals),
  transactions: many(transactions),
}));

// Events relations (MODIFIED FOR club-events-page.tsx: Added ticketTypes and promotions)
export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  eventArtists: many(eventArtists),
  invitations: many(invitations),
  feedback: many(feedback),
  tickets: many(tickets),
  topEvents: many(topEvents),
  customerFeedbacks: many(customerFeedbacks),
  // ADDED FOR club-events-page.tsx: Relations for event management
  ticketTypes: many(ticketTypes),
  promotions: many(promotions),
}));

// Transactions relations (MODIFIÉE pour Wallet)
export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  club: one(clubs, { fields: [transactions.clubId], references: [clubs.id] }), // NOUVELLE RELATION
}));

// Relations BI Dashboard existantes
export const financialMetricsRelations = relations(financialMetrics, ({ one }) => ({
  club: one(clubs, { fields: [financialMetrics.clubId], references: [clubs.id] }),
}));

export const revenueByDayRelations = relations(revenueByDay, ({ one }) => ({
  club: one(clubs, { fields: [revenueByDay.clubId], references: [clubs.id] }),
}));

export const salesDistributionRelations = relations(salesDistribution, ({ one }) => ({
  club: one(clubs, { fields: [salesDistribution.clubId], references: [clubs.id] }),
}));

export const topProductsRelations = relations(topProducts, ({ one }) => ({
  club: one(clubs, { fields: [topProducts.clubId], references: [clubs.id] }),
}));

export const growthTrendsRelations = relations(growthTrends, ({ one }) => ({
  club: one(clubs, { fields: [growthTrends.clubId], references: [clubs.id] }),
}));

// NOUVELLES RELATIONS pour Wallet
export const clubPaymentMethodsRelations = relations(clubPaymentMethods, ({ one, many }) => ({
  club: one(clubs, { fields: [clubPaymentMethods.clubId], references: [clubs.id] }),
  withdrawals: many(withdrawals),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  club: one(clubs, { fields: [invoices.clubId], references: [clubs.id] }),
}));

export const revenueAnalyticsRelations = relations(revenueAnalytics, ({ one }) => ({
  club: one(clubs, { fields: [revenueAnalytics.clubId], references: [clubs.id] }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  club: one(clubs, { fields: [withdrawals.clubId], references: [clubs.id] }),
  paymentMethod: one(clubPaymentMethods, { fields: [withdrawals.paymentMethodId], references: [clubPaymentMethods.id] }),
}));

// ADDED FOR club-events-page.tsx: Relations for new tables
export const ticketTypesRelations = relations(ticketTypes, ({ one }) => ({
  event: one(events, { fields: [ticketTypes.eventId], references: [events.id] }),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  event: one(events, { fields: [promotions.eventId], references: [events.id] }),
}));

// ======================
// Schémas Zod (AJOUTS pour les nouvelles tables Wallet et club-events-page.tsx)
// ======================

// Schémas existants inchangés
export const insertUserSchema = createInsertSchema(users);
export const insertArtistSchema = createInsertSchema(artists);
export const insertClubSchema = createInsertSchema(clubs);
export const insertEventSchema = createInsertSchema(events);
export const insertLocationSchema = createInsertSchema(locations);
export const insertGenreSchema = createInsertSchema(genres);
export const insertAttendeeSchema = createInsertSchema(attendees);
export const insertInvitationSchema = createInsertSchema(invitations);
export const insertTransactionSchema = createInsertSchema(transactions);

// Schémas BI Dashboard existants
export const insertFinancialMetricsSchema = createInsertSchema(financialMetrics);
export const insertRevenueByDaySchema = createInsertSchema(revenueByDay);
export const insertSalesDistributionSchema = createInsertSchema(salesDistribution);
export const insertTopProductsSchema = createInsertSchema(topProducts);
export const insertGrowthTrendsSchema = createInsertSchema(growthTrends);

// NOUVEAUX SCHÉMAS pour Wallet
export const insertClubPaymentMethodSchema = createInsertSchema(clubPaymentMethods);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertRevenueAnalyticsSchema = createInsertSchema(revenueAnalytics);
export const insertWithdrawalSchema = createInsertSchema(withdrawals);

// ADDED FOR club-events-page.tsx: Schemas for new tables
export const insertTicketTypeSchema = createInsertSchema(ticketTypes);
export const insertPromotionSchema = createInsertSchema(promotions);

// ======================
// Types TypeScript (AJOUTS pour les nouvelles tables Wallet et club-events-page.tsx)
// ======================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Genre = typeof genres.$inferSelect;
export type NewGenre = typeof genres.$inferInsert;
export type Attendee = typeof attendees.$inferSelect;
export type NewAttendee = typeof attendees.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// Types BI Dashboard existants
export type FinancialMetrics = typeof financialMetrics.$inferSelect;
export type NewFinancialMetrics = typeof financialMetrics.$inferInsert;
export type RevenueByDay = typeof revenueByDay.$inferSelect;
export type NewRevenueByDay = typeof revenueByDay.$inferInsert;
export type SalesDistribution = typeof salesDistribution.$inferSelect;
export type NewSalesDistribution = typeof salesDistribution.$inferInsert;
export type TopProducts = typeof topProducts.$inferSelect;
export type NewTopProducts = typeof topProducts.$inferInsert;
export type GrowthTrends = typeof growthTrends.$inferSelect;
export type NewGrowthTrends = typeof growthTrends.$inferInsert;

// NOUVEAUX TYPES pour Wallet
export type ClubPaymentMethod = typeof clubPaymentMethods.$inferSelect;
export type NewClubPaymentMethod = typeof clubPaymentMethods.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type RevenueAnalytics = typeof revenueAnalytics.$inferSelect;
export type NewRevenueAnalytics = typeof revenueAnalytics.$inferInsert;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type NewWithdrawal = typeof withdrawals.$inferInsert;

// ADDED FOR club-events-page.tsx: Types for new tables
export type TicketType = typeof ticketTypes.$inferSelect;
export type NewTicketType = typeof ticketTypes.$inferInsert;
export type Promotion = typeof promotions.$inferSelect;
export type NewPromotion = typeof promotions.$inferInsert;