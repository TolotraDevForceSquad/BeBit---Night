import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Artist routes
  app.get("/api/artists/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const artists = await storage.getTrendingArtists(limit);
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const artist = await storage.getArtist(parseInt(req.params.id));
      if (!artist) {
        return res.status(404).json({ message: "Artiste non trouvé" });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/artists/events/upcoming", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const artist = await storage.getArtistByUserId(req.user.id);
      if (!artist) {
        return res.status(404).json({ message: "Profil d'artiste non trouvé" });
      }

      const events = await storage.getEventsByArtistId(artist.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/artists/invitations", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const artist = await storage.getArtistByUserId(req.user.id);
      if (!artist) {
        return res.status(404).json({ message: "Profil d'artiste non trouvé" });
      }

      const invitations = await storage.getInvitationsByArtistId(artist.id);
      res.json(invitations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/artists/feedback", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const artist = await storage.getArtistByUserId(req.user.id);
      if (!artist) {
        return res.status(404).json({ message: "Profil d'artiste non trouvé" });
      }

      const feedback = await storage.getFeedbackByArtistId(artist.id);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Club routes
  app.get("/api/clubs/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const clubs = await storage.getPopularClubs(limit);
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClub(parseInt(req.params.id));
      if (!club) {
        return res.status(404).json({ message: "Club non trouvé" });
      }
      res.json(club);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/clubs/events/upcoming", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const club = await storage.getClubByUserId(req.user.id);
      if (!club) {
        return res.status(404).json({ message: "Profil de club non trouvé" });
      }

      const events = await storage.getEventsByClubId(club.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/clubs/statistics", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const club = await storage.getClubByUserId(req.user.id);
      if (!club) {
        return res.status(404).json({ message: "Profil de club non trouvé" });
      }

      // Mock data for club statistics (in a real app, this would be calculated from actual data)
      const mockStats = {
        totalParticipants: 450,
        averageRating: 4.3,
        attendanceData: [
          { date: "Jan", value: 30 },
          { date: "Fév", value: 45 },
          { date: "Mar", value: 60 },
          { date: "Avr", value: 40 },
          { date: "Mai", value: 80 },
          { date: "Jun", value: 95 },
        ],
        genreData: [
          { name: "House", value: 35 },
          { name: "Techno", value: 28 },
          { name: "Hip-Hop", value: 18 },
          { name: "Jazz", value: 12 },
          { name: "EDM", value: 7 },
        ],
        reviews: await storage.getFeedbackByClubId(club.id)
      };

      res.json(mockStats);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      let events;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (search) {
        events = await storage.searchEvents(search, limit);
      } else if (category) {
        events = await storage.getEventsByCategory(category, limit);
      } else {
        events = await storage.getAllEvents(limit);
      }

      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      // Only clubs can create events
      if (req.user.role !== "club") {
        return res.status(403).json({ message: "Seuls les clubs peuvent créer des événements" });
      }

      const club = await storage.getClubByUserId(req.user.id);
      if (!club) {
        return res.status(404).json({ message: "Profil de club non trouvé" });
      }

      const eventData = {
        ...req.body,
        clubId: club.id,
        isApproved: false,
        createdAt: new Date(),
      };

      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Invitation routes
  app.post("/api/invitations", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      // Only clubs can create invitations
      if (req.user.role !== "club") {
        return res.status(403).json({ message: "Seuls les clubs peuvent envoyer des invitations" });
      }

      const club = await storage.getClubByUserId(req.user.id);
      if (!club) {
        return res.status(404).json({ message: "Profil de club non trouvé" });
      }

      const invitationData = {
        ...req.body,
        clubId: club.id,
        status: "pending",
        createdAt: new Date(),
      };

      const invitation = await storage.createInvitation(invitationData);
      res.status(201).json(invitation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.patch("/api/invitations/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const invitation = await storage.getInvitation(parseInt(req.params.id));
      if (!invitation) {
        return res.status(404).json({ message: "Invitation non trouvée" });
      }

      // Artists can only update their own invitations
      if (req.user.role === "artist") {
        const artist = await storage.getArtistByUserId(req.user.id);
        if (!artist || artist.id !== invitation.artistId) {
          return res.status(403).json({ message: "Non autorisé" });
        }
      }

      const updatedInvitation = await storage.updateInvitation(
        invitation.id,
        { status: req.body.status }
      );

      res.json(updatedInvitation);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const feedbackData = {
        ...req.body,
        userId: req.user.id,
        createdAt: new Date(),
      };

      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // QR code routes
  app.get("/api/events/:id/qrcode", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }

      // Check if the user is authorized to generate QR code for this event
      if (req.user.role === "club") {
        const club = await storage.getClubByUserId(req.user.id);
        if (!club || club.id !== event.clubId) {
          return res.status(403).json({ message: "Non autorisé" });
        }
      }

      const qrCode = await storage.generateEventQRCode(eventId);
      res.json({ qrCode });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/tickets/:eventId/qrcode", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const eventId = parseInt(req.params.eventId);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }

      const qrCode = await storage.generateUserTicketQRCode(req.user.id, eventId);
      res.json({ qrCode });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/admin/events/latest", async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const events = await storage.getEventsForModeration();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/admin/moderation/users", async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const users = await storage.getUsersForModeration();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.patch("/api/admin/events/:id/approve", async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }

      const updatedEvent = await storage.updateEvent(eventId, { isApproved: true });
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.patch("/api/admin/users/:id/verify", async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const updatedUser = await storage.updateUser(userId, { isVerified: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  return httpServer;
}
