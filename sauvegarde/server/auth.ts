import passport from "passport"; // Import de Passport.js pour l'authentification
import { Strategy as LocalStrategy } from "passport-local"; // Stratégie "local" (username + password)
import { Express } from "express"; // Type pour l'application Express
import session from "express-session"; // Gestion des sessions côté serveur
import { scrypt, randomBytes, timingSafeEqual } from "crypto"; // Fonctions pour hacher et sécuriser les mots de passe
import { promisify } from "util"; // Pour transformer scrypt en promesse
import { storage } from "./storage"; // Module personnalisé pour stocker/récupérer les utilisateurs

// ----------------------------
// Déclaration de l'interface utilisateur côté Express
// ----------------------------
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      isVerified: boolean;
      password: string;
    }
  }
}

// ----------------------------
// Utils pour le hachage et la comparaison des mots de passe
// ----------------------------
const scryptAsync = promisify(scrypt); // Transforme scrypt en promesse pour pouvoir utiliser async/await

// Fonction pour hacher un mot de passe
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex"); // Génère un sel aléatoire
  const buf = (await scryptAsync(password, salt, 64)) as Buffer; // Hache le mot de passe avec le sel
  return `${buf.toString("hex")}.${salt}`; // Retourne "hash.sel" pour stockage
}

// Fonction pour comparer mot de passe fourni avec mot de passe stocké
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split("."); // Sépare hash et sel
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf); // Comparaison sécurisée (évite les attaques par timing)
}

// ----------------------------
// Fonction principale pour configurer l'authentification
// ----------------------------
export function setupAuth(app: Express) {
  // Vérifie si SESSION_SECRET est défini sinon en crée un aléatoire
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = randomBytes(32).toString("hex");
    console.warn("No SESSION_SECRET provided, using a random value.");
  }

  // Configuration des sessions Express
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET, // clé secrète pour signer les cookies
    resave: false, // ne pas resauvegarder si la session n'a pas changé
    saveUninitialized: false, // ne pas sauvegarder les sessions vides
    cookie: {
      secure: process.env.NODE_ENV === "production", // cookie sécurisé en production
      maxAge: 7 * 24 * 60 * 60 * 1000, // durée de vie : 7 jours
    },
  };

  app.set("trust proxy", 1); // si derrière un proxy (ex : Replit, Heroku)
  app.use(session(sessionSettings)); // utilisation des sessions
  app.use(passport.initialize()); // initialise Passport
  app.use(passport.session()); // lie Passport aux sessions

  // ----------------------------
  // Configuration de la stratégie locale (login)
  // ----------------------------
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username); // cherche l'utilisateur
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false); // échec si utilisateur non trouvé ou mot de passe incorrect
        } else {
          return done(null, user); // succès : retourne l'utilisateur
        }
      } catch (err) {
        return done(err); // erreur serveur
      }
    }),
  );

  // ----------------------------
  // Sérialisation / désérialisation pour les sessions
  // ----------------------------
  passport.serializeUser((user, done) => done(null, user.id)); // stocke juste l'id dans la session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id); // récupère l'utilisateur complet à partir de l'id
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // ----------------------------
  // Routes d'authentification
  // ----------------------------

  // Enregistrement (register)
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        isVerified: req.body.role === "user", // vérification automatique pour role "user"
      });

      req.login(user, (err) => { // connecte automatiquement après l'inscription
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user!;
    res.status(200).json(userWithoutPassword);
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Récupérer l'utilisateur courant
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401); // non connecté
    const { password, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  });
}
