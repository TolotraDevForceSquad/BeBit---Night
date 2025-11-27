import { type Express } from "express";
import { storage } from "./storage";
import {
  insertUserSchema, insertArtistSchema, insertClubSchema, insertEventSchema,
  insertEventArtistSchema, insertInvitationSchema, insertTicketSchema,
  insertFeedbackSchema, insertTransactionSchema, insertEmployeeSchema,
  insertPosDeviceSchema, insertProductCategorySchema, insertProductSchema,
  insertPosTableSchema, insertOrderSchema, insertOrderItemSchema,
  insertPosHistorySchema, insertPaymentMethodSchema
} from "@shared/schema";
import { z } from "zod";
import crypto from 'crypto';

const iterations = 10000;
const keylen = 64;
const digest = 'sha256';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
  return `${salt}:${iterations}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, iter, hash] = storedHash.split(':');
  const hashToVerify = crypto.pbkdf2Sync(password, salt, parseInt(iter, 10), keylen, digest).toString('hex');
  return hash === hashToVerify;
}

export function registerRoutes(app: Express) {
  // Routes existantes
  app.get("/api/hello", (req, res) => {
    res.send("hello world");
  });

  // Route d'inscription
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hasher le mot de passe
      const hashedPassword = hashPassword(validatedData.password);
      const userData = {
        ...validatedData,
        password: hashedPassword
      };

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  // Route de connexion
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Trouver l'utilisateur
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Vérifier le mot de passe
      const isPasswordValid = verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Retourner les informations utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/protected", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "Protected data", user: req.user });
  });

  // CRUD Routes for Users
  app.get("/api/users", async (req, res, next) => {
    try {
      const { role, city, country, isVerified } = req.query;
      const filters = {
        role: role as string,
        city: city as string,
        country: country as string,
        isVerified: isVerified ? isVerified === 'true' : undefined
      };

      const users = await storage.getAllUsers(filters);
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      next(error);
    }
  });

  app.get("/api/users/username/:username", async (req, res, next) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/users/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const updateSchema = insertUserSchema.partial().extend({
        currentPassword: z.string().optional() // Ajouter le champ pour l'ancien mot de passe
      });
      const validatedData = updateSchema.parse(req.body);

      // Vérifier si l'utilisateur existe
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Si le mot de passe est modifié, vérifier l'ancien mot de passe
      if (validatedData.password) {
        if (!validatedData.currentPassword) {
          return res.status(400).json({ message: "Current password is required to change password" });
        }

        // Vérifier l'ancien mot de passe
        const isCurrentPasswordValid = verifyPassword(validatedData.currentPassword, existingUser.password);
        if (!isCurrentPasswordValid) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hasher le nouveau mot de passe
        validatedData.password = hashPassword(validatedData.password);
      }

      // Supprimer currentPassword des données de mise à jour
      const { currentPassword, ...updateData } = validatedData;

      const user = await storage.updateUser(id, updateData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      next(error);
    }
  });

  app.delete("/api/users/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const success = await storage.deleteUser(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Artists
  app.get("/api/artists", async (req, res, next) => {
    try {
      const { genre, minRate, maxRate, minPopularity } = req.query;
      const filters = {
        genre: genre as string,
        minRate: minRate ? parseFloat(minRate as string) : undefined,
        maxRate: maxRate ? parseFloat(maxRate as string) : undefined,
        minPopularity: minPopularity ? parseInt(minPopularity as string) : undefined
      };

      const artists = await storage.getAllArtists(filters);
      res.json(artists);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/artists/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const artist = await storage.getArtist(id);
      res.json(artist);
    } catch (error: any) {
      if (error.message === "Artist not found") {
        return res.status(404).json({ message: "Artist not found" });
      }
      next(error);
    }
  });

  app.get("/api/artists/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const artist = await storage.getArtistByUserId(userId);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found for this user" });
      }
      res.json(artist);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/artists", async (req, res, next) => {
    try {
      const validatedData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(validatedData);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/artists/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const updateSchema = insertArtistSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const artist = await storage.updateArtist(id, validatedData);
      res.json(artist);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Artist not found") {
        return res.status(404).json({ message: "Artist not found" });
      }
      next(error);
    }
  });

  app.delete("/api/artists/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const success = await storage.deleteArtist(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Artist not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Clubs
  app.get("/api/clubs", async (req, res, next) => {
    try {
      const { city, country, minRating, minCapacity } = req.query;
      const filters = {
        city: city as string,
        country: country as string,
        minRating: minRating ? parseFloat(minRating as string) : undefined,
        minCapacity: minCapacity ? parseInt(minCapacity as string) : undefined
      };

      const clubs = await storage.getAllClubs(filters);
      res.json(clubs);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/clubs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const club = await storage.getClub(id);
      res.json(club);
    } catch (error: any) {
      if (error.message === "Club not found") {
        return res.status(404).json({ message: "Club not found" });
      }
      next(error);
    }
  });

  app.get("/api/clubs/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const club = await storage.getClubByUserId(userId);
      if (!club) {
        return res.status(404).json({ message: "Club not found for this user" });
      }
      res.json(club);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/clubs", async (req, res, next) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validatedData);
      res.status(201).json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/clubs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const updateSchema = insertClubSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const club = await storage.updateClub(id, validatedData);
      res.json(club);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Club not found") {
        return res.status(404).json({ message: "Club not found" });
      }
      next(error);
    }
  });

  app.delete("/api/clubs/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const success = await storage.deleteClub(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Club not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Events
  app.get("/api/events", async (req, res, next) => {
    try {
      const {
        clubId, category, city, country, minDate, maxDate,
        minPrice, maxPrice, isApproved, mood
      } = req.query;

      const filters = {
        clubId: clubId ? parseInt(clubId as string) : undefined,
        category: category as string,
        city: city as string,
        country: country as string,
        minDate: minDate ? new Date(minDate as string) : undefined,
        maxDate: maxDate ? new Date(maxDate as string) : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isApproved: isApproved ? isApproved === 'true' : undefined,
        mood: mood as string
      };

      const events = await storage.getAllEvents(filters);
      res.json(events);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/events/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await storage.getEvent(id);
      res.json(event);
    } catch (error: any) {
      if (error.message === "Event not found") {
        return res.status(404).json({ message: "Event not found" });
      }
      next(error);
    }
  });

  app.get("/api/events/club/:clubId", async (req, res, next) => {
    try {
      const clubId = parseInt(req.params.clubId);
      if (isNaN(clubId)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const events = await storage.getEventsByClubId(clubId);
      res.json(events);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events", async (req, res, next) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/events/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const updateSchema = insertEventSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const event = await storage.updateEvent(id, validatedData);
      res.json(event);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Event not found") {
        return res.status(404).json({ message: "Event not found" });
      }
      next(error);
    }
  });

  app.delete("/api/events/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const success = await storage.deleteEvent(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Event Artists
  app.get("/api/event-artists", async (req, res, next) => {
    try {
      const { eventId, artistId } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        artistId: artistId ? parseInt(artistId as string) : undefined
      };

      const eventArtists = await storage.getAllEventArtists(filters);
      res.json(eventArtists);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/event-artists/event/:eventId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const eventArtists = await storage.getEventArtistsByEventId(eventId);
      res.json(eventArtists);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/event-artists/artist/:artistId", async (req, res, next) => {
    try {
      const artistId = parseInt(req.params.artistId);
      if (isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const eventArtists = await storage.getEventArtistsByArtistId(artistId);
      res.json(eventArtists);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/event-artists", async (req, res, next) => {
    try {
      const validatedData = insertEventArtistSchema.parse(req.body);
      const eventArtist = await storage.createEventArtist(validatedData);
      res.status(201).json(eventArtist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.delete("/api/event-artists", async (req, res, next) => {
    try {
      const { eventId, artistId } = req.query;

      if (!eventId || !artistId) {
        return res.status(400).json({ message: "Event ID and Artist ID are required" });
      }

      const eventIdNum = parseInt(eventId as string);
      const artistIdNum = parseInt(artistId as string);

      if (isNaN(eventIdNum) || isNaN(artistIdNum)) {
        return res.status(400).json({ message: "Invalid event ID or artist ID" });
      }

      const success = await storage.deleteEventArtist(eventIdNum, artistIdNum);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Event artist not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Invitations
  app.get("/api/invitations", async (req, res, next) => {
    try {
      const { clubId, artistId, status } = req.query;
      const filters = {
        clubId: clubId ? parseInt(clubId as string) : undefined,
        artistId: artistId ? parseInt(artistId as string) : undefined,
        status: status as string
      };

      const invitations = await storage.getAllInvitations(filters);
      res.json(invitations);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/invitations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invitation ID" });
      }

      const invitation = await storage.getInvitation(id);
      res.json(invitation);
    } catch (error: any) {
      if (error.message === "Invitation not found") {
        return res.status(404).json({ message: "Invitation not found" });
      }
      next(error);
    }
  });

  app.get("/api/invitations/club/:clubId", async (req, res, next) => {
    try {
      const clubId = parseInt(req.params.clubId);
      if (isNaN(clubId)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const invitations = await storage.getInvitationsByClubId(clubId);
      res.json(invitations);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/invitations/artist/:artistId", async (req, res, next) => {
    try {
      const artistId = parseInt(req.params.artistId);
      if (isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const invitations = await storage.getInvitationsByArtistId(artistId);
      res.json(invitations);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/invitations", async (req, res, next) => {
    try {
      const validatedData = insertInvitationSchema.parse(req.body);
      const invitation = await storage.createInvitation(validatedData);
      res.status(201).json(invitation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/invitations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invitation ID" });
      }

      const updateSchema = insertInvitationSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const invitation = await storage.updateInvitation(id, validatedData);
      res.json(invitation);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Invitation not found") {
        return res.status(404).json({ message: "Invitation not found" });
      }
      next(error);
    }
  });

  app.delete("/api/invitations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invitation ID" });
      }

      const success = await storage.deleteInvitation(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Invitation not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Tickets
  app.get("/api/tickets", async (req, res, next) => {
    try {
      const { eventId, userId, isUsed } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        isUsed: isUsed ? isUsed === 'true' : undefined
      };

      const tickets = await storage.getAllTickets(filters);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tickets/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const ticket = await storage.getTicket(id);
      res.json(ticket);
    } catch (error: any) {
      if (error.message === "Ticket not found") {
        return res.status(404).json({ message: "Ticket not found" });
      }
      next(error);
    }
  });

  app.get("/api/tickets/event/:eventId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const tickets = await storage.getTicketsByEventId(eventId);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tickets/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const tickets = await storage.getTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/tickets", async (req, res, next) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/tickets/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const updateSchema = insertTicketSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const ticket = await storage.updateTicket(id, validatedData);
      res.json(ticket);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Ticket not found") {
        return res.status(404).json({ message: "Ticket not found" });
      }
      next(error);
    }
  });

  app.delete("/api/tickets/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket ID" });
      }

      const success = await storage.deleteTicket(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Ticket not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Feedback
  app.get("/api/feedback", async (req, res, next) => {
    try {
      const { eventId, artistId, clubId, userId, minRating } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        artistId: artistId ? parseInt(artistId as string) : undefined,
        clubId: clubId ? parseInt(clubId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        minRating: minRating ? parseInt(minRating as string) : undefined
      };

      const feedback = await storage.getAllFeedback(filters);
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/feedback/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }

      const feedback = await storage.getFeedback(id);
      res.json(feedback);
    } catch (error: any) {
      if (error.message === "Feedback not found") {
        return res.status(404).json({ message: "Feedback not found" });
      }
      next(error);
    }
  });

  app.post("/api/feedback", async (req, res, next) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/feedback/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }

      const updateSchema = insertFeedbackSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const feedback = await storage.updateFeedback(id, validatedData);
      res.json(feedback);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Feedback not found") {
        return res.status(404).json({ message: "Feedback not found" });
      }
      next(error);
    }
  });

  app.delete("/api/feedback/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }

      const success = await storage.deleteFeedback(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Feedback not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Transactions
  app.get("/api/transactions", async (req, res, next) => {
    try {
      const { userId, type, minAmount, maxAmount, startDate, endDate } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined,
        type: type as string,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const transactions = await storage.getAllTransactions(filters);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/transactions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }

      const transaction = await storage.getTransaction(id);
      res.json(transaction);
    } catch (error: any) {
      if (error.message === "Transaction not found") {
        return res.status(404).json({ message: "Transaction not found" });
      }
      next(error);
    }
  });

  app.get("/api/transactions/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/transactions", async (req, res, next) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/transactions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }

      const updateSchema = insertTransactionSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const transaction = await storage.updateTransaction(id, validatedData);
      res.json(transaction);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Transaction not found") {
        return res.status(404).json({ message: "Transaction not found" });
      }
      next(error);
    }
  });

  app.delete("/api/transactions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }

      const success = await storage.deleteTransaction(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Employees (POS)
  app.get("/api/employees", async (req, res, next) => {
    try {
      const { role } = req.query;
      const filters = {
        role: role as string
      };

      const employees = await storage.getAllEmployees(filters);
      res.json(employees);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/employees/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const employee = await storage.getEmployee(id);
      res.json(employee);
    } catch (error: any) {
      if (error.message === "Employee not found") {
        return res.status(404).json({ message: "Employee not found" });
      }
      next(error);
    }
  });

  app.get("/api/employees/pin/:pin", async (req, res, next) => {
    try {
      const { pin } = req.params;
      const employee = await storage.getEmployeeByPin(pin);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/employees", async (req, res, next) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/employees/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const updateSchema = insertEmployeeSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const employee = await storage.updateEmployee(id, validatedData);
      res.json(employee);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Employee not found") {
        return res.status(404).json({ message: "Employee not found" });
      }
      next(error);
    }
  });

  app.delete("/api/employees/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const success = await storage.deleteEmployee(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for POS Devices
  app.get("/api/pos-devices", async (req, res, next) => {
    try {
      const { isActive } = req.query;
      const filters = {
        isActive: isActive ? isActive === 'true' : undefined
      };

      const devices = await storage.getAllPosDevices(filters);
      res.json(devices);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pos-devices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const device = await storage.getPosDevice(id);
      res.json(device);
    } catch (error: any) {
      if (error.message === "POS device not found") {
        return res.status(404).json({ message: "POS device not found" });
      }
      next(error);
    }
  });

  app.post("/api/pos-devices", async (req, res, next) => {
    try {
      const validatedData = insertPosDeviceSchema.parse(req.body);
      const device = await storage.createPosDevice(validatedData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/pos-devices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const updateSchema = insertPosDeviceSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const device = await storage.updatePosDevice(id, validatedData);
      res.json(device);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "POS device not found") {
        return res.status(404).json({ message: "POS device not found" });
      }
      next(error);
    }
  });

  app.delete("/api/pos-devices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }

      const success = await storage.deletePosDevice(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "POS device not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Product Categories
  app.get("/api/product-categories", async (req, res, next) => {
    try {
      const categories = await storage.getAllProductCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/product-categories/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getProductCategory(id);
      res.json(category);
    } catch (error: any) {
      if (error.message === "Product category not found") {
        return res.status(404).json({ message: "Product category not found" });
      }
      next(error);
    }
  });

  app.post("/api/product-categories", async (req, res, next) => {
    try {
      const validatedData = insertProductCategorySchema.parse(req.body);
      const category = await storage.createProductCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/product-categories/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const updateSchema = insertProductCategorySchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const category = await storage.updateProductCategory(id, validatedData);
      res.json(category);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Product category not found") {
        return res.status(404).json({ message: "Product category not found" });
      }
      next(error);
    }
  });

  app.delete("/api/product-categories/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const success = await storage.deleteProductCategory(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Product category not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Products
  app.get("/api/products", async (req, res, next) => {
    try {
      const { categoryId, minPrice, maxPrice, isAvailable } = req.query;
      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isAvailable: isAvailable ? isAvailable === 'true' : undefined
      };

      const products = await storage.getAllProducts(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      res.json(product);
    } catch (error: any) {
      if (error.message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      next(error);
    }
  });

  app.get("/api/products/category/:categoryId", async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const products = await storage.getProductsByCategoryId(categoryId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", async (req, res, next) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const updateSchema = insertProductSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      next(error);
    }
  });

  app.delete("/api/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for POS Tables
  app.get("/api/pos-tables", async (req, res, next) => {
    try {
      const { isOccupied } = req.query;
      const filters = {
        isOccupied: isOccupied ? isOccupied === 'true' : undefined
      };

      const tables = await storage.getAllPosTables(filters);
      res.json(tables);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pos-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const table = await storage.getPosTable(id);
      res.json(table);
    } catch (error: any) {
      if (error.message === "POS table not found") {
        return res.status(404).json({ message: "POS table not found" });
      }
      next(error);
    }
  });

  app.post("/api/pos-tables", async (req, res, next) => {
    try {
      const validatedData = insertPosTableSchema.parse(req.body);
      const table = await storage.createPosTable(validatedData);
      res.status(201).json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/pos-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const updateSchema = insertPosTableSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const table = await storage.updatePosTable(id, validatedData);
      res.json(table);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "POS table not found") {
        return res.status(404).json({ message: "POS table not found" });
      }
      next(error);
    }
  });

  app.delete("/api/pos-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const success = await storage.deletePosTable(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "POS table not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Orders
  app.get("/api/orders", async (req, res, next) => {
    try {
      const { tableId, employeeId, status, startDate, endDate } = req.query;
      const filters = {
        tableId: tableId ? parseInt(tableId as string) : undefined,
        employeeId: employeeId as string,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const orders = await storage.getAllOrders(filters);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.getOrder(id);
      res.json(order);
    } catch (error: any) {
      if (error.message === "Order not found") {
        return res.status(404).json({ message: "Order not found" });
      }
      next(error);
    }
  });

  app.get("/api/orders/table/:tableId", async (req, res, next) => {
    try {
      const tableId = parseInt(req.params.tableId);
      if (isNaN(tableId)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const orders = await storage.getOrdersByTableId(tableId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/employee/:employeeId", async (req, res, next) => {
    try {
      const { employeeId } = req.params;
      const orders = await storage.getOrdersByEmployeeId(employeeId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", async (req, res, next) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/orders/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const updateSchema = insertOrderSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const order = await storage.updateOrder(id, validatedData);
      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Order not found") {
        return res.status(404).json({ message: "Order not found" });
      }
      next(error);
    }
  });

  app.delete("/api/orders/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const success = await storage.deleteOrder(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Order Items
  app.get("/api/order-items", async (req, res, next) => {
    try {
      const { orderId } = req.query;
      const filters = {
        orderId: orderId ? parseInt(orderId as string) : undefined
      };

      const orderItems = await storage.getAllOrderItems(filters);
      res.json(orderItems);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/order-items/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order item ID" });
      }

      const orderItem = await storage.getOrderItem(id);
      res.json(orderItem);
    } catch (error: any) {
      if (error.message === "Order item not found") {
        return res.status(404).json({ message: "Order item not found" });
      }
      next(error);
    }
  });

  app.get("/api/order-items/order/:orderId", async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const orderItems = await storage.getOrderItemsByOrderId(orderId);
      res.json(orderItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/order-items", async (req, res, next) => {
    try {
      const validatedData = insertOrderItemSchema.parse(req.body);
      const orderItem = await storage.createOrderItem(validatedData);
      res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/order-items/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order item ID" });
      }

      const updateSchema = insertOrderItemSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const orderItem = await storage.updateOrderItem(id, validatedData);
      res.json(orderItem);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Order item not found") {
        return res.status(404).json({ message: "Order item not found" });
      }
      next(error);
    }
  });

  app.delete("/api/order-items/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order item ID" });
      }

      const success = await storage.deleteOrderItem(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Order item not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for POS History
  app.get("/api/pos-history", async (req, res, next) => {
    try {
      const { employeeId, deviceId, startDate, endDate } = req.query;
      const filters = {
        employeeId: employeeId as string,
        deviceId: deviceId ? parseInt(deviceId as string) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const history = await storage.getAllPosHistory(filters);
      res.json(history);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pos-history/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid history ID" });
      }

      const history = await storage.getPosHistory(id);
      res.json(history);
    } catch (error: any) {
      if (error.message === "POS history not found") {
        return res.status(404).json({ message: "POS history not found" });
      }
      next(error);
    }
  });

  app.post("/api/pos-history", async (req, res, next) => {
    try {
      const validatedData = insertPosHistorySchema.parse(req.body);
      const history = await storage.createPosHistory(validatedData);
      res.status(201).json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/pos-history/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid history ID" });
      }

      const updateSchema = insertPosHistorySchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const history = await storage.updatePosHistory(id, validatedData);
      res.json(history);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "POS history not found") {
        return res.status(404).json({ message: "POS history not found" });
      }
      next(error);
    }
  });

  app.delete("/api/pos-history/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid history ID" });
      }

      const success = await storage.deletePosHistory(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "POS history not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Payment Methods
  app.get("/api/payment-methods", async (req, res, next) => {
    try {
      const paymentMethods = await storage.getAllPaymentMethods();
      res.json(paymentMethods);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }

      const paymentMethod = await storage.getPaymentMethod(id);
      res.json(paymentMethod);
    } catch (error: any) {
      if (error.message === "Payment method not found") {
        return res.status(404).json({ message: "Payment method not found" });
      }
      next(error);
    }
  });

  app.post("/api/payment-methods", async (req, res, next) => {
    try {
      const validatedData = insertPaymentMethodSchema.parse(req.body);
      const paymentMethod = await storage.createPaymentMethod(validatedData);
      res.status(201).json(paymentMethod);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      next(error);
    }
  });

  app.put("/api/payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }

      const updateSchema = insertPaymentMethodSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const paymentMethod = await storage.updatePaymentMethod(id, validatedData);
      res.json(paymentMethod);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Payment method not found") {
        return res.status(404).json({ message: "Payment method not found" });
      }
      if (error.message === "No fields to update") {
        return res.status(400).json({ message: "No fields to update" });
      }
      next(error);
    }
  });

  app.delete("/api/payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid payment method ID" });
      }

      const success = await storage.deletePaymentMethod(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Payment method not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Error handling middleware
  app.use((error: any, req: any, res: any, next: any) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
}