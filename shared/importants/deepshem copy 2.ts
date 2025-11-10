// D:\Projet\BeBit\bebit - new\shared\schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// MODIF GLOBAL [PAGES: dashboard/invitations/collaborations] - Version étendue pour dashboards artistiques et tracking collaborations (ajouts milestones/messages/status étendu). Supporte queries pour artist views (joins eventArtists/invitations), filtres/stats invitations, et tracking milestones/messages pour collaborations (liés à invitations acceptées/confirmées).
// MODIF GLOBAL [PAGES: agenda/feedback/create-event] - Extensions pour supporter agenda artiste (joins events+eventArtists), feedbacks post-event (polymorphe via sourceType+Id), et création événements (clubTables pour options tables, réservations via junction eventReservedTables). Structure normalisée : 1:N pour tables/réservations, N:N pour events-artists/tables. Prêt pour diagrammes de classes (entités + associations claires).
// MODIF [PAGE_ID: invitations-page] - Ajout invitedById (FK à users.id) pour supporter invitedBy nested (user profile) dans invitations ; étend status enum pour matcher "pending/accepted/declined" sans conflit. Permet joins Invitation -> User pour username/profileImage.
// MODIF [PAGE_ID: search-artists-page] - Ajout rating (decimal) et bookings (integer) à artists pour supporter cards avec étoiles et compteur réservations (dérivable de eventArtists mais denormalisé pour perf en search/filtres).
// MODIF [PAGE_ID: search-clubs-page] - Ajouts à clubs : category (text pour filtres), coverImage (text distinct de profileImage), featured (bool pour promo), instagram/website (text pour social), openingHours (jsonb {day: "hours"}), features (jsonb array pour tags comme "DJ international"). hasTableReservation dérivable de clubTables mais nouveau bool pour UI rapide. Supporte joins pour upcomingEvents via events (status='upcoming').

// ======================
// Users table (inchangée - utilisée pour profils généraux ; étendue pour rôles spécifiques via relations)
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
// Artists table (étendue pour search-artists : rating/bookings)
// ======================
// MODIF [PAGE_ID: club-events] - Ajout JSONB pour socialMedia (flexible: {instagram: string, ...}) et contact (sous-objet: {email, phone}), pour supporter profils artistes étendus sans sur-normalisation
// MODIF [PAGE_ID: search-artists-page] - Ajout rating (decimal 3,1 pour étoiles 4.8) et bookings (int pour compteur réservations, denormalisé pour perf en search).
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  displayName: text("display_name").notNull(),
  genre: text("genre").notNull(), // MODIF [PAGE_ID: find-artists] - Champ existant, mais normalisé vers table music_genres pour multi-genres
  bio: text("bio"),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull().default("0"),
  tags: jsonb("tags").notNull().default("[]"),
  popularity: integer("popularity").notNull().default(0),
  // Nouveaux champs pour profils étendus
  socialMedia: jsonb("social_media").default("{}"), // {instagram?: string, soundcloud?: string, spotify?: string, youtube?: string}
  contact: jsonb("contact").default("{}"), // {email: string, phone: string}
  location: text("location").default(""), // Ville pour matching géo (denorm pour perf, lié à users.city si besoin)
  // MODIF [PAGE_ID: search-artists-page] - Ajouts pour UI cards
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  bookings: integer("bookings").default(0),
});

// MODIF [PAGE_ID: find-artists] - Nouvelle table pour portfolios d'artistes (one-to-many, pour images/titres flexibles)
export const artistPortfolios = pgTable("artist_portfolios", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Clubs table (étendue pour search-clubs : category/coverImage/featured/etc.)
// ======================
// MODIF [PAGE_ID: create-event] - Ajout pour supporter tableOptions (mock: name, capacity, price, available) -> Nouvelle table clubTables (1:N, normalisée pour réservations flexibles ; available bool pour stock).
// MODIF [PAGE_ID: search-clubs-page] - Ajouts : category (text pour filtres), coverImage (text pour bannières distinctes), featured (bool pour mise en avant), instagram/website (text pour liens sociaux), openingHours (jsonb pour horaires flex {monday: "19:00-02:00"}), features (jsonb array pour tags UI). hasTableReservation : Nouveau bool (dérivable de clubTables mais pour query rapide).
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
  // MODIF [PAGE_ID: search-clubs-page] - Ajouts pour cards/filtres
  category: text("category").notNull().default("Nightclub"),
  coverImage: text("cover_image"),
  featured: boolean("featured").default(false),
  instagram: text("instagram"),
  website: text("website"),
  openingHours: jsonb("opening_hours").default("{}"), // e.g., {monday: "Fermé", friday: "20:00 - 05:00"}
  features: jsonb("features").default("[]"), // Array<string> e.g., ["DJ international", "VIP"]
  hasTableReservation: boolean("has_table_reservation").default(false), // Flag pour UI (dérivable de clubTables)
});

// MODIF [PAGE_ID: attendees] - Nouvelle table pour zones/locations dans un club (ex. : Terrasse, VIP ; one-to-many avec clubs)
// MODIF [PAGE_ID: create-event] - Nouvelle table clubTables pour options tables (name, capacity, price, available ; 1:N avec clubs, pour réservations événementielles).
export const clubLocations = pgTable("club_locations", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clubTables = pgTable("club_tables", {  // MODIF [PAGE_ID: create-event] - Table dédiée pour tables/réservations (support mock tableOptions ; extensible à bookings).
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  name: text("name").notNull(),  // e.g., "Table VIP"
  capacity: integer("capacity").notNull(),  // Nombre de personnes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),  // Prix par table (Ar)
  available: boolean("available").notNull().default(true),  // Statut dispo (pour stock)
  description: text("description"),  // Optionnel
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Events table (inchangée - utilisée pour invitations et tickets ; étendue pour ticket_types)
// ======================
// MODIF [PAGE_ID: club-events] - Ajout enum status pour gérer upcoming/planning/past/cancelled (étend isApproved existant sans conflit)
// MODIF [PAGE_ID: create-event] - Ajout reserveTables (bool pour flag réservations), price comme entryFee (renommé pour clarté, mais conservé existant). Support création via formulaire (clubId owner, artist via invitation join).
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
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),  // EntryFee du formulaire
  capacity: integer("capacity").notNull(),
  coverImage: text("cover_image"),
  participantCount: integer("participant_count").notNull().default(0),
  popularity: integer("popularity").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  status: text("status", { enum: ["upcoming", "planning", "past", "cancelled"] }).default("planning"), // Nouveau pour lifecycle événement
  mood: text("mood", { enum: ["energetic", "chill", "romantic", "dark", "festive"] }),
  // MODIF [PAGE_ID: create-event] - Flag pour réservations tables (liées via junction ci-dessous)
  reserveTables: boolean("reserve_tables").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MODIF [PAGE_ID: create-event] - Nouvelle junction pour réservations tables par event (N:N ; support selectedTables du formulaire).
export const eventReservedTables = pgTable("event_reserved_tables", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  tableId: integer("table_id").references(() => clubTables.id).notNull(),
  reservedAt: timestamp("reserved_at").defaultNow().notNull(),  // Timestamp réservation
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.tableId] }),
}));

// ======================
// Event Artists junction table (inchangée)
// ======================
export const eventArtists = pgTable("event_artists", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  artistId: integer("artist_id").references(() => artists.id).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.artistId] }),
}));

// ======================
// MODIF [PAGE_ID: events-page] - Nouvelle junction pour participants d'événements (N:N events-users ; support participants array avec status "pending/confirmed", joinedAt pour tracking. Permet queries joins pour currentParticipants/max via count/where).
export const eventParticipants = pgTable("event_participants", {
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "confirmed"] }).notNull().default("pending"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.userId] }),
}));

// ======================
// Invitations table (complétée depuis tronquée ; étendue pour events-page)
// ======================
// MODIF [PAGE_ID: events-page] - Complétion invitations pour support EventInvitation (status incl. pending/accepted/declined, invitedById FK users, invitedAt timestamp). Liaison à events via eventId (1:N invitations-events).
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(), // Invité
  invitedById: integer("invited_by_id").references(() => users.id).notNull(), // Inviteur (MODIF [PAGE_ID: invitations-page/events-page])
  status: text("status", { enum: ["pending", "accepted", "declined", "confirmed", "cancelled", "rejected", "negotiation", "preparation", "completed"] }).notNull().default("pending"),
  progress: integer("progress").default(0), // 0-100 pour tracking collaboration
  invitedAt: timestamp("invited_at").defaultNow().notNull(), // MODIF [PAGE_ID: events-page]
  expectedAttendees: integer("expected_attendees").default(0),
  genre: text("genre"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Tickets table (inchangée)
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

// MODIF [PAGE_ID: tickets] - Nouvelle table pour types de tickets (e.g., VIP/Standard ; 1:N avec tickets).
export const ticketTypes = pgTable("ticketTypes", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(), // e.g., "VIP", "Standard"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
});

// ======================
// Feedback table (étendue pour reviews-page : polymorphisme sourceType/sourceId, + title/reviewerId/compteurs pour likes/comments)
// ======================
// MODIF [PAGE_ID: feedback/reviews-page] - Ajout title (text pour titre avis), reviewerId (FK users pour auteur), likesCount/commentsCount (int default 0, dénormalisés pour perf). Étend sourceType enum à "user|club|artist|event" pour reviews polymorphes. Support joins pour entityName/image via sourceType.
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(), // MODIF [PAGE_ID: reviews-page]
  sourceType: text("source_type", { enum: ["user", "club", "artist", "event"] }).notNull(), // Étendu pour reviews
  sourceId: integer("source_id").notNull(), // ID de l'entité target (polymorphe)
  title: text("title").notNull(), // MODIF [PAGE_ID: reviews-page] - Titre pour avis structurés
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  reply: text("reply"),
  sourceName: text("source_name").notNull(), // Denorm pour perf (nom entité)
  likesCount: integer("likes_count").default(0), // MODIF [PAGE_ID: reviews-page] - Compteur dénormalisé
  commentsCount: integer("comments_count").default(0), // MODIF [PAGE_ID: reviews-page] - Compteur dénormalisé
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MODIF [PAGE_ID: reviews-page] - Nouvelle table pour likes sur feedback (N:N feedback-users ; support isLiked/likesCount via count/where).
export const feedbackLikes = pgTable("feedback_likes", {
  feedbackId: integer("feedback_id").references(() => feedback.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  likedAt: timestamp("liked_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.feedbackId, t.userId] }),
}));

// MODIF [PAGE_ID: reviews-page] - Nouvelle table pour commentaires sur feedback (1:N feedback-comments ; support nested comments via content/createdAt).
export const feedbackComments = pgTable("feedback_comments", {
  id: serial("id").primaryKey(),
  feedbackId: integer("feedback_id").references(() => feedback.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// MODIF [PAGE_ID: gallery-page] - Nouvelle table pour photos (1:N users/events optional ; support PhotoData avec tags JSONB, urls, compteurs likes/comments. Prêt pour joins user/event pour uploader/eventName).
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // Uploader
  eventId: integer("event_id").references(() => events.id), // Optional pour lien événement
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(), // Image full
  thumbnail: text("thumbnail").notNull(), // Miniature
  tags: jsonb("tags").default("[]"), // Array<string> pour filtres
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// MODIF [PAGE_ID: gallery-page] - Junction N:N pour likes photos (support isLiked/likesCount via existence/count).
export const photoLikes = pgTable("photo_likes", {
  photoId: integer("photo_id").references(() => photos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  likedAt: timestamp("liked_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.photoId, t.userId] }),
}));

// MODIF [PAGE_ID: gallery-page] - Table 1:N pour commentaires photos (support nested comments avec content/user).
export const photoComments = pgTable("photo_comments", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => photos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Collaboration tables (inchangées - liées à invitations acceptées)
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
  senderId: integer("sender_id").notNull(), // ID club/artist
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Transactions table (inchangée)
// ======================
// MODIF [PAGE_ID: wallet] - Extensions pour types/status (credit/debit/fee/withdrawal ; completed/processing/failed).
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
// Autres tables (inchangées ou étendues pour wallet/attendees/etc.)
// ======================
// MODIF [PAGE_ID: attendees] - Tables pour profils clients/tags/genres/boissons (support agenda/feedback).
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

// MODIF [PAGE_ID: club-events] - Table promotions (liée à events/clubs ; discountType/status/channels pour UI).
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  clubId: integer("club_id").references(() => clubs.id),
  title: text("title").notNull(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: decimal("discount_value", { precision: 5, scale: 2 }).notNull(),
  status: text("status", { enum: ["active", "inactive", "expired"] }).notNull().default("active"),
  channels: jsonb("channels").default("[]"), // Array<string> e.g., ["social", "email"]
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MODIF [PAGE_ID: wallet] - Tables pour méthodes paiement/invoices (support transactions).
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["card", "bank", "mobile"] }).notNull(),
  details: jsonb("details").notNull(), // {cardNumber?: string, etc.}
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
// POS/Employees tables (inchangées - pour backend club)
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
// Insert Schemas (étendus pour validations ; inchangés sauf MODIF)
// ======================
export const insertUserSchema = createInsertSchema(users, {
  role: (schema) => schema.refine((val) => ["user", "artist", "club", "admin"].includes(val), "Rôle invalide"),
  // ... validations existantes
});

export const insertArtistSchema = createInsertSchema(artists, {
  socialMedia: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format socialMedia invalide"),
  contact: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format contact invalide"),
  // MODIF [PAGE_ID: search-artists-page] - Validations pour ajouts
  rating: (schema) => schema.min(0).max(5, "Rating entre 0 et 5"),
  bookings: (schema) => schema.min(0, "Bookings non négatif"),
});
export const insertArtistPortfolioSchema = createInsertSchema(artistPortfolios); // MODIF [PAGE_ID: find-artists]

export const insertClubSchema = createInsertSchema(clubs, {
  // MODIF [PAGE_ID: search-clubs-page] - Validations pour ajouts
  category: (schema) => schema.min(1, "Catégorie requise"),
  openingHours: (schema) => schema.refine((val) => typeof val === 'object', "Format openingHours invalide"),
  features: (schema) => schema.refine((val) => Array.isArray(val), "Features doit être un array"),
});
export const insertClubLocationSchema = createInsertSchema(clubLocations); // MODIF [PAGE_ID: attendees]

// MODIF [PAGE_ID: create-event] - Schema pour clubTables (validations positifs pour price/capacity).
export const insertClubTableSchema = createInsertSchema(clubTables, {
  capacity: (schema) => schema.int().min(1, "Capacité minimale 1"),
  price: (schema) => schema.min(0, "Prix non négatif"),
  available: (schema) => schema.default(true),
});

export const insertEventSchema = createInsertSchema(events, {
  // MODIF [PAGE_ID: create-event] - Validations pour formulaire (date future, times cohérents, price/capacity >0, reserveTables bool).
  date: (schema) => schema.refine((val) => val > new Date(), "Date doit être future"),
  startTime: (schema) => schema.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format heure invalide"),
  endTime: (schema) => schema.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format heure invalide"),
  price: (schema) => schema.min(0, "Prix non négatif"),
  capacity: (schema) => schema.int().min(1, "Capacité minimale 1"),
  reserveTables: (schema) => schema.default(false),
});
export const insertEventArtistSchema = createInsertSchema(eventArtists);

// MODIF [PAGE_ID: create-event] - Schema pour réservations tables (simple, avec timestamp auto).
export const insertEventReservedTableSchema = createInsertSchema(eventReservedTables);

// MODIF [PAGE_ID: events-page] - Schema pour eventParticipants (status enum, joinedAt auto).
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
  genre: (schema) => schema.optional(), // Optionnel, string libre
  description: (schema) => schema.optional(),
  // MODIF [PAGE_ID: invitations-page/events-page] - Validations pour invitedById/invitedAt
  invitedById: (schema) => schema.int().min(1, "Invité par requis"),
});

export const insertTicketSchema = createInsertSchema(tickets);
export const insertTicketTypeSchema = createInsertSchema(ticketTypes); // MODIF [PAGE_ID: tickets]

// MODIF [PAGE_ID: feedback/reviews-page] - Schema étendu pour feedback (title requis, rating 1-5, sourceType enum étendu, comment min len, reply optional, compteurs >=0).
export const insertFeedbackSchema = createInsertSchema(feedback, {
  sourceType: (schema) => schema.refine((val) => ["user", "club", "artist", "event"].includes(val), "Source type invalide"),
  title: (schema) => schema.min(1, "Titre requis"), // MODIF [PAGE_ID: reviews-page]
  rating: (schema) => schema.int().min(1).max(5, "Rating entre 1 et 5"),
  comment: (schema) => schema.min(10, "Commentaire trop court"),
  reply: (schema) => schema.optional(),
  sourceName: (schema) => schema.min(1, "Nom source requis"),
  likesCount: (schema) => schema.int().min(0, "Likes non négatif"), // MODIF [PAGE_ID: reviews-page]
  commentsCount: (schema) => schema.int().min(0, "Comments non négatif"), // MODIF [PAGE_ID: reviews-page]
});

// MODIF [PAGE_ID: reviews-page] - Schema pour feedbackLikes (simple junction).
export const insertFeedbackLikeSchema = createInsertSchema(feedbackLikes);

// MODIF [PAGE_ID: reviews-page] - Schema pour feedbackComments (content min 1).
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
  // Validations pour nouveaux champs
  type: (schema) => schema.refine((val) => ["credit", "debit", "fee", "withdrawal"].includes(val), "Type de transaction invalide"),
  status: (schema) => schema.refine((val) => ["completed", "processing", "failed"].includes(val), "Statut invalide"),
}); // MODIF [PAGE_ID: wallet]
export const insertCustomerProfileSchema = createInsertSchema(customerProfiles); // MODIF [PAGE_ID: attendees]
export const insertMusicGenreSchema = createInsertSchema(musicGenres); // MODIF [PAGE_ID: attendees/find-artists]
export const insertDrinkTypeSchema = createInsertSchema(drinkTypes); // MODIF [PAGE_ID: attendees]
export const insertCustomerTagSchema = createInsertSchema(customerTags); // MODIF [PAGE_ID: attendees]

export const insertPromotionSchema = createInsertSchema(promotions, {
  // Validations pour enum et JSONB
  discountType: (schema) => schema.refine((val) => ["percentage", "fixed"].includes(val), "Type de discount invalide"),
  status: (schema) => schema.refine((val) => ["active", "inactive", "expired"].includes(val), "Statut invalide"),
  channels: (schema) => schema.refine((val) => Array.isArray(val), "Channels doit être un array"),
}); // MODIF [PAGE_ID: club-events]

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods, {
  type: (schema) => schema.refine((val) => ["card", "bank", "mobile"].includes(val), "Type de paiement invalide"),
  details: (schema) => schema.refine((val) => typeof val === 'object' && val !== null, "Format details invalide"),
}); // MODIF [PAGE_ID: wallet]

export const insertInvoiceSchema = createInsertSchema(invoices, {
  status: (schema) => schema.refine((val) => ["paid", "pending", "overdue"].includes(val), "Statut de facture invalide"),
}); // MODIF [PAGE_ID: wallet]

// MODIF [PAGE_ID: gallery-page] - Schemas pour photos/likes/comments (validations urls/tags/content).
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
// Export types (étendus pour nouvelles entités)
// ======================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type ArtistPortfolio = typeof artistPortfolios.$inferSelect; // MODIF [PAGE_ID: find-artists]
export type InsertArtistPortfolio = z.infer<typeof insertArtistPortfolioSchema>;

export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type ClubLocation = typeof clubLocations.$inferSelect; // MODIF [PAGE_ID: attendees]
export type InsertClubLocation = z.infer<typeof insertClubLocationSchema>;
export type ClubTable = typeof clubTables.$inferSelect;  // MODIF [PAGE_ID: create-event]
export type InsertClubTable = z.infer<typeof insertClubTableSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventArtist = typeof eventArtists.$inferSelect;
export type InsertEventArtist = z.infer<typeof insertEventArtistSchema>;
export type EventReservedTable = typeof eventReservedTables.$inferSelect;  // MODIF [PAGE_ID: create-event]
export type InsertEventReservedTable = z.infer<typeof insertEventReservedTableSchema>;

// MODIF [PAGE_ID: events-page] - Nouveaux types pour participants/invitations étendus.
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type Invitation = typeof invitations.$inferSelect; // Étendu pour pages
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type TicketType = typeof ticketTypes.$inferSelect; // MODIF [PAGE_ID: tickets]
export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;

export type Feedback = typeof feedback.$inferSelect;  // MODIF [PAGE_ID: feedback/reviews-page]
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// MODIF [PAGE_ID: reviews-page] - Nouveaux types pour likes/comments feedback.
export type FeedbackLike = typeof feedbackLikes.$inferSelect;
export type InsertFeedbackLike = z.infer<typeof insertFeedbackLikeSchema>;
export type FeedbackComment = typeof feedbackComments.$inferSelect;
export type InsertFeedbackComment = z.infer<typeof insertFeedbackCommentSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CustomerProfile = typeof customerProfiles.$inferSelect; // MODIF [PAGE_ID: attendees]
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type MusicGenre = typeof musicGenres.$inferSelect; // MODIF [PAGE_ID: attendees/find-artists]
export type InsertMusicGenre = z.infer<typeof insertMusicGenreSchema>;
export type DrinkType = typeof drinkTypes.$inferSelect; // MODIF [PAGE_ID: attendees]
export type InsertDrinkType = z.infer<typeof insertDrinkTypeSchema>;
export type CustomerTag = typeof customerTags.$inferSelect; // MODIF [PAGE_ID: attendees]
export type InsertCustomerTag = z.infer<typeof insertCustomerTagSchema>;

export type Promotion = typeof promotions.$inferSelect; // MODIF [PAGE_ID: club-events]
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

export type PaymentMethod = typeof paymentMethods.$inferSelect; // MODIF [PAGE_ID: wallet]
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type Invoice = typeof invoices.$inferSelect; // MODIF [PAGE_ID: wallet]
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// MODIF [PAGE_ID: gallery-page] - Nouveaux types pour photos/likes/comments.
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

// MODIF [PAGE_ID: collaborations] - Nouveaux types pour milestones/messages (supportent mocks via queries)
export type CollaborationMilestone = typeof collaborationMilestones.$inferSelect;
export type InsertCollaborationMilestone = z.infer<typeof insertCollaborationMilestoneSchema>;
export type CollaborationMessage = typeof collaborationMessages.$inferSelect;
export type InsertCollaborationMessage = z.infer<typeof insertCollaborationMessageSchema>;
