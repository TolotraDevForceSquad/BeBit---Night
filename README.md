# NightConnect - Plateforme Événementielle pour la Vie Nocturne

NightConnect est une application inspirée de TikTok qui connecte les artistes, les clubs et les utilisateurs dans un écosystème créatif pour la scène nocturne.

## Fonctionnalités principales

### Pour les utilisateurs
- Découvrir des événements à venir
- Acheter des billets pour des événements
- Scanner des QR codes pour valider les billets
- Consulter les profils des artistes et des clubs
- Laisser des avis

### Pour les artistes
- Gérer leur profil et portfolio
- Recevoir des invitations pour jouer dans des clubs
- Planifier leur calendrier de performances
- Consulter les avis et statistiques
- Gérer leur portefeuille virtuel

### Pour les clubs
- Créer et gérer des événements
- Inviter des artistes à se produire
- Gérer la billetterie via QR codes
- Consulter les statistiques et analyses
- Publier des offres spéciales

### Pour les administrateurs
- Modérer les événements et utilisateurs
- Approuver les nouveaux clubs et artistes
- Accéder aux statistiques globales
- Gérer le système dans son ensemble

## Identifiants de test

### Utilisateur standard
- Nom d'utilisateur: user1
- Mot de passe: password123

### Artiste
- Nom d'utilisateur: dj_elektra
- Mot de passe: password123

### Club
- Nom d'utilisateur: club_oxygen
- Mot de passe: password123

### Administrateur
- Nom d'utilisateur: admin
- Mot de passe: adminpass123

## Technologies utilisées
- Frontend: React avec TypeScript
- Backend: Express.js
- Base de données: PostgreSQL avec Drizzle ORM
- Authentication: Passport.js
- QR Code: qrcode
- UI: Tailwind CSS et Shadcn

## Architecture de l'application
L'application utilise une architecture moderne avec des composants réutilisables et des hooks React personnalisés. Conçue avec une approche "mobile-first", elle s'adapte parfaitement aux appareils mobiles et aux ordinateurs de bureau.

## Comment lancer l'application
1. Assurez-vous que Node.js et npm sont installés
2. Clonez le dépôt
3. Installez les dépendances: `npm install`
4. Configurez la base de données PostgreSQL et mettez à jour les variables d'environnement
5. Lancez l'application: `npm run dev`