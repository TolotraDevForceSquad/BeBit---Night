import { type Express } from "express";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  insertUserSchema, insertArtistSchema, insertArtistPortfolioSchema,
  insertClubSchema, insertClubLocationSchema, insertClubTableSchema,
  insertEventSchema, insertEventArtistSchema, insertEventReservedTableSchema,
  insertEventParticipantSchema, insertInvitationSchema,
  insertTicketSchema, insertTicketTypeSchema,
  insertFeedbackSchema, insertFeedbackLikeSchema, insertFeedbackCommentSchema,
  insertPhotoSchema, insertPhotoLikeSchema, insertPhotoCommentSchema,
  insertCollaborationMilestoneSchema, insertCollaborationMessageSchema,
  insertTransactionSchema, insertCustomerProfileSchema,
  insertMusicGenreSchema, insertDrinkTypeSchema, insertCustomerTagSchema,
  insertPromotionSchema, insertPaymentMethodSchema, insertInvoiceSchema,
  insertEmployeeSchema, insertPosDeviceSchema,
  insertProductCategorySchema, insertProductSchema,
  insertPosTableSchema, insertOrderSchema, insertOrderItemSchema,
  insertPosHistorySchema, insertPosPaymentMethodSchema
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

// Configuration du stockage Multer
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// Filtrage des types de fichiers
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',
    'audio/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

const upload = multer({
  storage: storageConfig,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

export function registerRoutes(app: Express) {
  // Routes de test / auth
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
        currentPassword: z.string().optional()
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

        const isCurrentPasswordValid = verifyPassword(validatedData.currentPassword, existingUser.password);
        if (!isCurrentPasswordValid) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }

        validatedData.password = hashPassword(validatedData.password);
      }

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
        return res.status(404).json({ message: "Artist not found" });
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

  // CRUD Routes for Artist Portfolios
  app.get("/api/artist-portfolios", async (req, res, next) => {
    try {
      const { artistId } = req.query;
      const filters = {
        artistId: artistId ? parseInt(artistId as string) : undefined
      };

      const portfolios = await storage.getAllArtistPortfolios(filters);
      res.json(portfolios);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/artist-portfolios/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio ID" });
      }

      const portfolio = await storage.getArtistPortfolio(id);
      res.json(portfolio);
    } catch (error: any) {
      if (error.message === "Artist portfolio not found") {
        return res.status(404).json({ message: "Artist portfolio not found" });
      }
      next(error);
    }
  });

  app.get("/api/artist-portfolios/artist/:artistId", async (req, res, next) => {
    try {
      const artistId = parseInt(req.params.artistId);
      if (isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid artist ID" });
      }

      const portfolios = await storage.getArtistPortfoliosByArtistId(artistId);
      res.json(portfolios);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/artist-portfolios", async (req, res, next) => {
    try {
      const validatedData = insertArtistPortfolioSchema.parse(req.body);
      const portfolio = await storage.createArtistPortfolio(validatedData);
      res.status(201).json(portfolio);
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

  app.put("/api/artist-portfolios/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio ID" });
      }

      const updateSchema = insertArtistPortfolioSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const portfolio = await storage.updateArtistPortfolio(id, validatedData);
      res.json(portfolio);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Artist portfolio not found") {
        return res.status(404).json({ message: "Artist portfolio not found" });
      }
      next(error);
    }
  });

  app.delete("/api/artist-portfolios/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio ID" });
      }

      const success = await storage.deleteArtistPortfolio(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Artist portfolio not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Clubs
  app.get("/api/clubs", async (req, res, next) => {
    try {
      const { city, country, category, featured } = req.query;
      const filters = {
        city: city as string,
        country: country as string,
        category: category as string,
        featured: featured ? featured === 'true' : undefined
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
        return res.status(404).json({ message: "Club not found" });
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

  // CRUD Routes for Club Locations
  app.get("/api/club-locations", async (req, res, next) => {
    try {
      const { clubId } = req.query;
      const filters = {
        clubId: clubId ? parseInt(clubId as string) : undefined
      };

      const locations = await storage.getAllClubLocations(filters);
      res.json(locations);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/club-locations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }

      const location = await storage.getClubLocation(id);
      res.json(location);
    } catch (error: any) {
      if (error.message === "Club location not found") {
        return res.status(404).json({ message: "Club location not found" });
      }
      next(error);
    }
  });

  app.get("/api/club-locations/club/:clubId", async (req, res, next) => {
    try {
      const clubId = parseInt(req.params.clubId);
      if (isNaN(clubId)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const locations = await storage.getClubLocationsByClubId(clubId);
      res.json(locations);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/club-locations", async (req, res, next) => {
    try {
      const validatedData = insertClubLocationSchema.parse(req.body);
      const location = await storage.createClubLocation(validatedData);
      res.status(201).json(location);
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

  app.put("/api/club-locations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }

      const updateSchema = insertClubLocationSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const location = await storage.updateClubLocation(id, validatedData);
      res.json(location);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Club location not found") {
        return res.status(404).json({ message: "Club location not found" });
      }
      next(error);
    }
  });

  app.delete("/api/club-locations/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }

      const success = await storage.deleteClubLocation(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Club location not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Club Tables
  app.get("/api/club-tables", async (req, res, next) => {
    try {
      const { clubId, available } = req.query;
      const filters = {
        clubId: clubId ? parseInt(clubId as string) : undefined,
        available: available ? available === 'true' : undefined
      };

      const tables = await storage.getAllClubTables(filters);
      res.json(tables);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/club-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const table = await storage.getClubTable(id);
      res.json(table);
    } catch (error: any) {
      if (error.message === "Club table not found") {
        return res.status(404).json({ message: "Club table not found" });
      }
      next(error);
    }
  });

  app.get("/api/club-tables/club/:clubId", async (req, res, next) => {
    try {
      const clubId = parseInt(req.params.clubId);
      if (isNaN(clubId)) {
        return res.status(400).json({ message: "Invalid club ID" });
      }

      const tables = await storage.getClubTablesByClubId(clubId);
      res.json(tables);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/club-tables", async (req, res, next) => {
    try {
      const validatedData = insertClubTableSchema.parse(req.body);
      const table = await storage.createClubTable(validatedData);
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

  app.put("/api/club-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const updateSchema = insertClubTableSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const table = await storage.updateClubTable(id, validatedData);
      res.json(table);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Club table not found") {
        return res.status(404).json({ message: "Club table not found" });
      }
      next(error);
    }
  });

  app.delete("/api/club-tables/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid table ID" });
      }

      const success = await storage.deleteClubTable(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Club table not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Events
  app.get("/api/events", async (req, res, next) => {
    try {
      const { clubId, city, country, status, startDate, endDate } = req.query;
      const filters = {
        clubId: clubId ? parseInt(clubId as string) : undefined,
        city: city as string,
        country: country as string,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
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

  app.get("/api/event-artists/:eventId/:artistId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const artistId = parseInt(req.params.artistId);
      if (isNaN(eventId) || isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid event or artist ID" });
      }

      const eventArtist = await storage.getEventArtist(eventId, artistId);
      if (!eventArtist) {
        return res.status(404).json({ message: "Event artist not found" });
      }
      res.json(eventArtist);
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

  app.put("/api/event-artists/:eventId/:artistId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const artistId = parseInt(req.params.artistId);
      if (isNaN(eventId) || isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid event or artist ID" });
      }

      const updateSchema = insertEventArtistSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const eventArtist = await storage.updateEventArtist(eventId, artistId, validatedData);
      res.json(eventArtist);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Event artist not found") {
        return res.status(404).json({ message: "Event artist not found" });
      }
      next(error);
    }
  });

  app.delete("/api/event-artists/:eventId/:artistId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const artistId = parseInt(req.params.artistId);
      if (isNaN(eventId) || isNaN(artistId)) {
        return res.status(400).json({ message: "Invalid event or artist ID" });
      }

      const success = await storage.deleteEventArtist(eventId, artistId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Event artist not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Event Reserved Tables
  app.get("/api/event-reserved-tables", async (req, res, next) => {
    try {
      const { eventId, tableId } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        tableId: tableId ? parseInt(tableId as string) : undefined
      };

      const reservedTables = await storage.getAllEventReservedTables(filters);
      res.json(reservedTables);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/event-reserved-tables/:eventId/:tableId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tableId = parseInt(req.params.tableId);
      if (isNaN(eventId) || isNaN(tableId)) {
        return res.status(400).json({ message: "Invalid event or table ID" });
      }

      const reservedTable = await storage.getEventReservedTable(eventId, tableId);
      if (!reservedTable) {
        return res.status(404).json({ message: "Event reserved table not found" });
      }
      res.json(reservedTable);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/event-reserved-tables", async (req, res, next) => {
    try {
      const validatedData = insertEventReservedTableSchema.parse(req.body);
      const reservedTable = await storage.createEventReservedTable(validatedData);
      res.status(201).json(reservedTable);
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

  app.put("/api/event-reserved-tables/:eventId/:tableId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tableId = parseInt(req.params.tableId);
      if (isNaN(eventId) || isNaN(tableId)) {
        return res.status(400).json({ message: "Invalid event or table ID" });
      }

      const updateSchema = insertEventReservedTableSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const reservedTable = await storage.updateEventReservedTable(eventId, tableId, validatedData);
      res.json(reservedTable);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Event reserved table not found") {
        return res.status(404).json({ message: "Event reserved table not found" });
      }
      next(error);
    }
  });

  app.delete("/api/event-reserved-tables/:eventId/:tableId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const tableId = parseInt(req.params.tableId);
      if (isNaN(eventId) || isNaN(tableId)) {
        return res.status(400).json({ message: "Invalid event or table ID" });
      }

      const success = await storage.deleteEventReservedTable(eventId, tableId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Event reserved table not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Event Participants
  app.get("/api/event-participants", async (req, res, next) => {
    try {
      const { eventId, userId, status } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        status: status as string
      };

      const participants = await storage.getAllEventParticipants(filters);
      res.json(participants);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/event-participants/:eventId/:userId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = parseInt(req.params.userId);
      if (isNaN(eventId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid event or user ID" });
      }

      const participant = await storage.getEventParticipant(eventId, userId);
      if (!participant) {
        return res.status(404).json({ message: "Event participant not found" });
      }
      res.json(participant);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/event-participants", async (req, res, next) => {
    try {
      const validatedData = insertEventParticipantSchema.parse(req.body);
      const participant = await storage.createEventParticipant(validatedData);
      res.status(201).json(participant);
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

  app.put("/api/event-participants/:eventId/:userId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = parseInt(req.params.userId);
      if (isNaN(eventId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid event or user ID" });
      }

      const updateSchema = insertEventParticipantSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const participant = await storage.updateEventParticipant(eventId, userId, validatedData);
      res.json(participant);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Event participant not found") {
        return res.status(404).json({ message: "Event participant not found" });
      }
      next(error);
    }
  });

  app.delete("/api/event-participants/:eventId/:userId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = parseInt(req.params.userId);
      if (isNaN(eventId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid event or user ID" });
      }

      const success = await storage.deleteEventParticipant(eventId, userId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Event participant not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Invitations
  app.get("/api/invitations", async (req, res, next) => {
    try {
      const { eventId, userId, status } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
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
      const { eventId, userId, status } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        status: status as string
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

  // CRUD Routes for Ticket Types
  app.get("/api/ticket-types", async (req, res, next) => {
    try {
      const { eventId } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined
      };

      const ticketTypes = await storage.getAllTicketTypes(filters);
      res.json(ticketTypes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ticket-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const ticketType = await storage.getTicketType(id);
      res.json(ticketType);
    } catch (error: any) {
      if (error.message === "Ticket type not found") {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      next(error);
    }
  });

  app.get("/api/ticket-types/event/:eventId", async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const ticketTypes = await storage.getTicketTypesByEventId(eventId);
      res.json(ticketTypes);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ticket-types", async (req, res, next) => {
    try {
      const validatedData = insertTicketTypeSchema.parse(req.body);
      const ticketType = await storage.createTicketType(validatedData);
      res.status(201).json(ticketType);
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

  app.put("/api/ticket-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const updateSchema = insertTicketTypeSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const ticketType = await storage.updateTicketType(id, validatedData);
      res.json(ticketType);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Ticket type not found") {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      next(error);
    }
  });

  app.delete("/api/ticket-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const success = await storage.deleteTicketType(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Ticket type not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Feedback
  app.get("/api/feedback", async (req, res, next) => {
    try {
      const { sourceType, sourceId, minRating } = req.query;
      const filters = {
        sourceType: sourceType as string,
        sourceId: sourceId ? parseInt(sourceId as string) : undefined,
        minRating: minRating ? parseInt(minRating as string) : undefined
      };

      const feedbackList = await storage.getAllFeedback(filters);
      res.json(feedbackList);
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

  // CRUD Routes for Feedback Likes
  app.get("/api/feedback-likes", async (req, res, next) => {
    try {
      const { feedbackId, userId } = req.query;
      const filters = {
        feedbackId: feedbackId ? parseInt(feedbackId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined
      };

      const likes = await storage.getAllFeedbackLikes(filters);
      res.json(likes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/feedback-likes/:feedbackId/:userId", async (req, res, next) => {
    try {
      const feedbackId = parseInt(req.params.feedbackId);
      const userId = parseInt(req.params.userId);
      if (isNaN(feedbackId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid feedback or user ID" });
      }

      const like = await storage.getFeedbackLike(feedbackId, userId);
      if (!like) {
        return res.status(404).json({ message: "Feedback like not found" });
      }
      res.json(like);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/feedback-likes", async (req, res, next) => {
    try {
      const validatedData = insertFeedbackLikeSchema.parse(req.body);
      const like = await storage.createFeedbackLike(validatedData);
      res.status(201).json(like);
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

  app.put("/api/feedback-likes/:feedbackId/:userId", async (req, res, next) => {
    try {
      const feedbackId = parseInt(req.params.feedbackId);
      const userId = parseInt(req.params.userId);
      if (isNaN(feedbackId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid feedback or user ID" });
      }

      const updateSchema = insertFeedbackLikeSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const like = await storage.updateFeedbackLike(feedbackId, userId, validatedData);
      res.json(like);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Feedback like not found") {
        return res.status(404).json({ message: "Feedback like not found" });
      }
      next(error);
    }
  });

  app.delete("/api/feedback-likes/:feedbackId/:userId", async (req, res, next) => {
    try {
      const feedbackId = parseInt(req.params.feedbackId);
      const userId = parseInt(req.params.userId);
      if (isNaN(feedbackId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid feedback or user ID" });
      }

      const success = await storage.deleteFeedbackLike(feedbackId, userId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Feedback like not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Feedback Comments
  app.get("/api/feedback-comments", async (req, res, next) => {
    try {
      const { feedbackId } = req.query;
      const filters = {
        feedbackId: feedbackId ? parseInt(feedbackId as string) : undefined
      };

      const comments = await storage.getAllFeedbackComments(filters);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/feedback-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const comment = await storage.getFeedbackComment(id);
      res.json(comment);
    } catch (error: any) {
      if (error.message === "Feedback comment not found") {
        return res.status(404).json({ message: "Feedback comment not found" });
      }
      next(error);
    }
  });

  app.post("/api/feedback-comments", async (req, res, next) => {
    try {
      const validatedData = insertFeedbackCommentSchema.parse(req.body);
      const comment = await storage.createFeedbackComment(validatedData);
      res.status(201).json(comment);
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

  app.put("/api/feedback-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const updateSchema = insertFeedbackCommentSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const comment = await storage.updateFeedbackComment(id, validatedData);
      res.json(comment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Feedback comment not found") {
        return res.status(404).json({ message: "Feedback comment not found" });
      }
      next(error);
    }
  });

  app.delete("/api/feedback-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const success = await storage.deleteFeedbackComment(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Feedback comment not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Photos
  app.get("/api/photos", async (req, res, next) => {
    try {
      const { userId, eventId } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined,
        eventId: eventId ? parseInt(eventId as string) : undefined
      };

      const photos = await storage.getAllPhotos(filters);
      res.json(photos);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/photos/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const photo = await storage.getPhoto(id);
      res.json(photo);
    } catch (error: any) {
      if (error.message === "Photo not found") {
        return res.status(404).json({ message: "Photo not found" });
      }
      next(error);
    }
  });

  app.post("/api/photos", async (req, res, next) => {
    try {
      const validatedData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(validatedData);
      res.status(201).json(photo);
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

  app.put("/api/photos/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const updateSchema = insertPhotoSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const photo = await storage.updatePhoto(id, validatedData);
      res.json(photo);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Photo not found") {
        return res.status(404).json({ message: "Photo not found" });
      }
      next(error);
    }
  });

  app.delete("/api/photos/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const success = await storage.deletePhoto(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Photo not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Photo Likes
  app.get("/api/photo-likes", async (req, res, next) => {
    try {
      const { photoId, userId } = req.query;
      const filters = {
        photoId: photoId ? parseInt(photoId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined
      };

      const likes = await storage.getAllPhotoLikes(filters);
      res.json(likes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/photo-likes/:photoId/:userId", async (req, res, next) => {
    try {
      const photoId = parseInt(req.params.photoId);
      const userId = parseInt(req.params.userId);
      if (isNaN(photoId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid photo or user ID" });
      }

      const like = await storage.getPhotoLike(photoId, userId);
      if (!like) {
        return res.status(404).json({ message: "Photo like not found" });
      }
      res.json(like);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/photo-likes", async (req, res, next) => {
    try {
      const validatedData = insertPhotoLikeSchema.parse(req.body);
      const like = await storage.createPhotoLike(validatedData);
      res.status(201).json(like);
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

  app.put("/api/photo-likes/:photoId/:userId", async (req, res, next) => {
    try {
      const photoId = parseInt(req.params.photoId);
      const userId = parseInt(req.params.userId);
      if (isNaN(photoId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid photo or user ID" });
      }

      const updateSchema = insertPhotoLikeSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const like = await storage.updatePhotoLike(photoId, userId, validatedData);
      res.json(like);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Photo like not found") {
        return res.status(404).json({ message: "Photo like not found" });
      }
      next(error);
    }
  });

  app.delete("/api/photo-likes/:photoId/:userId", async (req, res, next) => {
    try {
      const photoId = parseInt(req.params.photoId);
      const userId = parseInt(req.params.userId);
      if (isNaN(photoId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid photo or user ID" });
      }

      const success = await storage.deletePhotoLike(photoId, userId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Photo like not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Photo Comments
  app.get("/api/photo-comments", async (req, res, next) => {
    try {
      const { photoId } = req.query;
      const filters = {
        photoId: photoId ? parseInt(photoId as string) : undefined
      };

      const comments = await storage.getAllPhotoComments(filters);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/photo-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const comment = await storage.getPhotoComment(id);
      res.json(comment);
    } catch (error: any) {
      if (error.message === "Photo comment not found") {
        return res.status(404).json({ message: "Photo comment not found" });
      }
      next(error);
    }
  });

  app.post("/api/photo-comments", async (req, res, next) => {
    try {
      const validatedData = insertPhotoCommentSchema.parse(req.body);
      const comment = await storage.createPhotoComment(validatedData);
      res.status(201).json(comment);
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

  app.put("/api/photo-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const updateSchema = insertPhotoCommentSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const comment = await storage.updatePhotoComment(id, validatedData);
      res.json(comment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Photo comment not found") {
        return res.status(404).json({ message: "Photo comment not found" });
      }
      next(error);
    }
  });

  app.delete("/api/photo-comments/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const success = await storage.deletePhotoComment(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Photo comment not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Collaboration Milestones
  app.get("/api/collaboration-milestones", async (req, res, next) => {
    try {
      const { invitationId, status } = req.query;
      const filters = {
        invitationId: invitationId ? parseInt(invitationId as string) : undefined,
        status: status as string
      };

      const milestones = await storage.getAllCollaborationMilestones(filters);
      res.json(milestones);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/collaboration-milestones/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid milestone ID" });
      }

      const milestone = await storage.getCollaborationMilestone(id);
      res.json(milestone);
    } catch (error: any) {
      if (error.message === "Collaboration milestone not found") {
        return res.status(404).json({ message: "Collaboration milestone not found" });
      }
      next(error);
    }
  });

  app.post("/api/collaboration-milestones", async (req, res, next) => {
    try {
      const validatedData = insertCollaborationMilestoneSchema.parse(req.body);
      const milestone = await storage.createCollaborationMilestone(validatedData);
      res.status(201).json(milestone);
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

  app.put("/api/collaboration-milestones/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid milestone ID" });
      }

      const updateSchema = insertCollaborationMilestoneSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const milestone = await storage.updateCollaborationMilestone(id, validatedData);
      res.json(milestone);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Collaboration milestone not found") {
        return res.status(404).json({ message: "Collaboration milestone not found" });
      }
      next(error);
    }
  });

  app.delete("/api/collaboration-milestones/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid milestone ID" });
      }

      const success = await storage.deleteCollaborationMilestone(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Collaboration milestone not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Collaboration Messages
  app.get("/api/collaboration-messages", async (req, res, next) => {
    try {
      const { invitationId, senderType } = req.query;
      const filters = {
        invitationId: invitationId ? parseInt(invitationId as string) : undefined,
        senderType: senderType as string
      };

      const messages = await storage.getAllCollaborationMessages(filters);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/collaboration-messages/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const message = await storage.getCollaborationMessage(id);
      res.json(message);
    } catch (error: any) {
      if (error.message === "Collaboration message not found") {
        return res.status(404).json({ message: "Collaboration message not found" });
      }
      next(error);
    }
  });

  app.post("/api/collaboration-messages", async (req, res, next) => {
    try {
      const validatedData = insertCollaborationMessageSchema.parse(req.body);
      const message = await storage.createCollaborationMessage(validatedData);
      res.status(201).json(message);
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

  app.put("/api/collaboration-messages/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const updateSchema = insertCollaborationMessageSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const message = await storage.updateCollaborationMessage(id, validatedData);
      res.json(message);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Collaboration message not found") {
        return res.status(404).json({ message: "Collaboration message not found" });
      }
      next(error);
    }
  });

  app.delete("/api/collaboration-messages/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const success = await storage.deleteCollaborationMessage(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Collaboration message not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Transactions
  app.get("/api/transactions", async (req, res, next) => {
    try {
      const { userId, type, status, startDate, endDate } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined,
        type: type as string,
        status: status as string,
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

  // CRUD Routes for Customer Profiles
  app.get("/api/customer-profiles", async (req, res, next) => {
    try {
      const { userId } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined
      };

      const profiles = await storage.getAllCustomerProfiles(filters);
      res.json(profiles);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/customer-profiles/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const profile = await storage.getCustomerProfile(id);
      res.json(profile);
    } catch (error: any) {
      if (error.message === "Customer profile not found") {
        return res.status(404).json({ message: "Customer profile not found" });
      }
      next(error);
    }
  });

  app.get("/api/customer-profiles/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const profile = await storage.getCustomerProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ message: "Customer profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/customer-profiles", async (req, res, next) => {
    try {
      const validatedData = insertCustomerProfileSchema.parse(req.body);
      const profile = await storage.createCustomerProfile(validatedData);
      res.status(201).json(profile);
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

  app.put("/api/customer-profiles/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const updateSchema = insertCustomerProfileSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const profile = await storage.updateCustomerProfile(id, validatedData);
      res.json(profile);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Customer profile not found") {
        return res.status(404).json({ message: "Customer profile not found" });
      }
      next(error);
    }
  });

  app.delete("/api/customer-profiles/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const success = await storage.deleteCustomerProfile(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Customer profile not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Music Genres
  app.get("/api/music-genres", async (req, res, next) => {
    try {
      const genres = await storage.getAllMusicGenres();
      res.json(genres);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/music-genres/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }

      const genre = await storage.getMusicGenre(id);
      res.json(genre);
    } catch (error: any) {
      if (error.message === "Music genre not found") {
        return res.status(404).json({ message: "Music genre not found" });
      }
      next(error);
    }
  });

  app.post("/api/music-genres", async (req, res, next) => {
    try {
      const validatedData = insertMusicGenreSchema.parse(req.body);
      const genre = await storage.createMusicGenre(validatedData);
      res.status(201).json(genre);
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

  app.put("/api/music-genres/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }

      const updateSchema = insertMusicGenreSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const genre = await storage.updateMusicGenre(id, validatedData);
      res.json(genre);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Music genre not found") {
        return res.status(404).json({ message: "Music genre not found" });
      }
      next(error);
    }
  });

  app.delete("/api/music-genres/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }

      const success = await storage.deleteMusicGenre(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Music genre not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Drink Types
  app.get("/api/drink-types", async (req, res, next) => {
    try {
      const { category } = req.query;
      const filters = {
        category: category as string
      };

      const drinkTypes = await storage.getAllDrinkTypes(filters);
      res.json(drinkTypes);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/drink-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid drink type ID" });
      }

      const drinkType = await storage.getDrinkType(id);
      res.json(drinkType);
    } catch (error: any) {
      if (error.message === "Drink type not found") {
        return res.status(404).json({ message: "Drink type not found" });
      }
      next(error);
    }
  });

  app.post("/api/drink-types", async (req, res, next) => {
    try {
      const validatedData = insertDrinkTypeSchema.parse(req.body);
      const drinkType = await storage.createDrinkType(validatedData);
      res.status(201).json(drinkType);
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

  app.put("/api/drink-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid drink type ID" });
      }

      const updateSchema = insertDrinkTypeSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const drinkType = await storage.updateDrinkType(id, validatedData);
      res.json(drinkType);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Drink type not found") {
        return res.status(404).json({ message: "Drink type not found" });
      }
      next(error);
    }
  });

  app.delete("/api/drink-types/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid drink type ID" });
      }

      const success = await storage.deleteDrinkType(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Drink type not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Customer Tags
  app.get("/api/customer-tags", async (req, res, next) => {
    try {
      const { customerId } = req.query;
      const filters = {
        customerId: customerId ? parseInt(customerId as string) : undefined
      };

      const tags = await storage.getAllCustomerTags(filters);
      res.json(tags);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/customer-tags/:customerId/:tag", async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const tag = req.params.tag;
      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const customerTag = await storage.getCustomerTag(customerId, tag);
      if (!customerTag) {
        return res.status(404).json({ message: "Customer tag not found" });
      }
      res.json(customerTag);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/customer-tags", async (req, res, next) => {
    try {
      const validatedData = insertCustomerTagSchema.parse(req.body);
      const tag = await storage.createCustomerTag(validatedData);
      res.status(201).json(tag);
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

  app.put("/api/customer-tags/:customerId/:tag", async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const tag = req.params.tag;
      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const updateSchema = insertCustomerTagSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const customerTag = await storage.updateCustomerTag(customerId, tag, validatedData);
      res.json(customerTag);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Customer tag not found") {
        return res.status(404).json({ message: "Customer tag not found" });
      }
      next(error);
    }
  });

  app.delete("/api/customer-tags/:customerId/:tag", async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const tag = req.params.tag;
      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const success = await storage.deleteCustomerTag(customerId, tag);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Customer tag not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Promotions
  app.get("/api/promotions", async (req, res, next) => {
    try {
      const { eventId, clubId, status, validFrom, validTo } = req.query;
      const filters = {
        eventId: eventId ? parseInt(eventId as string) : undefined,
        clubId: clubId ? parseInt(clubId as string) : undefined,
        status: status as string,
        validFrom: validFrom ? new Date(validFrom as string) : undefined,
        validTo: validTo ? new Date(validTo as string) : undefined
      };

      const promotions = await storage.getAllPromotions(filters);
      res.json(promotions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/promotions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const promotion = await storage.getPromotion(id);
      res.json(promotion);
    } catch (error: any) {
      if (error.message === "Promotion not found") {
        return res.status(404).json({ message: "Promotion not found" });
      }
      next(error);
    }
  });

  app.post("/api/promotions", async (req, res, next) => {
    try {
      const validatedData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(validatedData);
      res.status(201).json(promotion);
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

  app.put("/api/promotions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const updateSchema = insertPromotionSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const promotion = await storage.updatePromotion(id, validatedData);
      res.json(promotion);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Promotion not found") {
        return res.status(404).json({ message: "Promotion not found" });
      }
      next(error);
    }
  });

  app.delete("/api/promotions/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const success = await storage.deletePromotion(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Promotion not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRUD Routes for Payment Methods (User)
  app.get("/api/payment-methods", async (req, res, next) => {
    try {
      const { userId, type, isDefault } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined,
        type: type as string,
        isDefault: isDefault ? isDefault === 'true' : undefined
      };

      const paymentMethods = await storage.getAllPaymentMethods(filters);
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

  app.get("/api/payment-methods/user/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const paymentMethods = await storage.getPaymentMethodsByUserId(userId);
      res.json(paymentMethods);
    } catch (error) {
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

  // CRUD Routes for Invoices
  app.get("/api/invoices", async (req, res, next) => {
    try {
      const { userId, status, startDate, endDate } = req.query;
      const filters = {
        userId: userId ? parseInt(userId as string) : undefined,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const invoices = await storage.getAllInvoices(filters);
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/invoices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }

      const invoice = await storage.getInvoice(id);
      res.json(invoice);
    } catch (error: any) {
      if (error.message === "Invoice not found") {
        return res.status(404).json({ message: "Invoice not found" });
      }
      next(error);
    }
  });

  app.post("/api/invoices", async (req, res, next) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
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

  app.put("/api/invoices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }

      const updateSchema = insertInvoiceSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const invoice = await storage.updateInvoice(id, validatedData);
      res.json(invoice);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "Invoice not found") {
        return res.status(404).json({ message: "Invoice not found" });
      }
      next(error);
    }
  });

  app.delete("/api/invoices/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }

      const success = await storage.deleteInvoice(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Invoice not found" });
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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }

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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }

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
        employeeId: employeeId ? parseInt(employeeId as string) : undefined,
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
      const employeeId = parseInt(req.params.employeeId);
      if (isNaN(employeeId)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }

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
        employeeId: employeeId ? parseInt(employeeId as string) : undefined,
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

  // CRUD Routes for POS Payment Methods
  app.get("/api/pos-payment-methods", async (req, res, next) => {
    try {
      const paymentMethods = await storage.getAllPosPaymentMethods();
      res.json(paymentMethods);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pos-payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid POS payment method ID" });
      }

      const paymentMethod = await storage.getPosPaymentMethod(id);
      res.json(paymentMethod);
    } catch (error: any) {
      if (error.message === "POS payment method not found") {
        return res.status(404).json({ message: "POS payment method not found" });
      }
      next(error);
    }
  });

  app.post("/api/pos-payment-methods", async (req, res, next) => {
    try {
      const validatedData = insertPosPaymentMethodSchema.parse(req.body);
      const paymentMethod = await storage.createPosPaymentMethod(validatedData);
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

  app.put("/api/pos-payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid POS payment method ID" });
      }

      const updateSchema = insertPosPaymentMethodSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      const paymentMethod = await storage.updatePosPaymentMethod(id, validatedData);
      res.json(paymentMethod);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      if (error.message === "POS payment method not found") {
        return res.status(404).json({ message: "POS payment method not found" });
      }
      next(error);
    }
  });

  app.delete("/api/pos-payment-methods/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid POS payment method ID" });
      }

      const success = await storage.deletePosPaymentMethod(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "POS payment method not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Routes pour l'upload et la récupération de fichiers
  app.post("/api/uploads", upload.single('file'), async (req: any, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier uploadé" });
      }

      // Retourner les informations du fichier uploadé
      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
      };

      res.status(201).json({
        message: "Fichier uploadé avec succès",
        file: fileInfo
      });
    } catch (error) {
      next(error);
    }
  });

  // Route pour upload multiple
  app.post("/api/uploads/multiple", upload.array('files', 10), async (req: any, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Aucun fichier uploadé" });
      }

      const filesInfo = req.files.map((file: any) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString()
      }));

      res.status(201).json({
        message: `${req.files.length} fichier(s) uploadé(s) avec succès`,
        files: filesInfo
      });
    } catch (error) {
      next(error);
    }
  });

  // Route pour récupérer la liste des fichiers
  app.get("/api/uploads", async (req, res, next) => {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadDir)) {
        return res.json([]);
      }

      const files = fs.readdirSync(uploadDir).map(filename => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);

        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          uploadedAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });

      res.json(files);
    } catch (error) {
      next(error);
    }
  });

  // Route pour récupérer un fichier spécifique
  app.get("/api/uploads/:filename", async (req, res, next) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier non trouvé" });
      }

      // Détecter le type MIME
      const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };

      const ext = path.extname(filename).toLowerCase();
      const mimeType = mimeTypes[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', mimeType);
      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  });

  // Route pour supprimer un fichier
  app.delete("/api/uploads/:filename", async (req, res, next) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier non trouvé" });
      }

      fs.unlinkSync(filePath);
      res.json({ message: "Fichier supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  });

  // Error handling middleware
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "Fichier trop volumineux" });
      }
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });
}