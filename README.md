# Be bit. - Plateforme événementielle de nightlife

Be bit. est une plateforme moderne inspirée de TikTok qui connecte les artistes, les clubs et les utilisateurs dans l'écosystème de la vie nocturne. L'application permet:

- Aux artistes de trouver des engagements
- Aux clubs de découvrir des talents
- Aux utilisateurs de découvrir des événements
- Aux administrateurs de gérer la plateforme

## Fonctionnalités clés

- **Interface adaptative**: design responsive pour mobile et web
- **Expérience TikTok**: navigation par swipe sur mobile pour découvrir les événements
- **Système multi-profils**: quatre types d'utilisateurs (standard, artiste, club, admin)
- **Tableau de bord personnalisé**: chaque type d'utilisateur a son propre tableau de bord
- **Intégration QR Code**: validation des billets et entrées avec QR code
- **Système de paiement**: achat de billets et paiement d'artistes
- **Géolocalisation**: découvrez des événements à proximité
- **Réservation de tables**: possibilité de réserver des tables dans les clubs

### Fonctionnalités par profil

#### Utilisateurs standard
- Découverte d'événements par swipe (style TikTok/Tinder)
- Achat de billets pour les événements
- Création d'événements informels ("sorties")
- Recherche et suivi d'artistes favoris
- Réservation de tables dans les clubs
- Visualisation des tickets achetés avec QR codes

#### Artistes
- Gestion de profil et portfolio artistique
- Calendrier des performances
- Réception et gestion des invitations des clubs
- Création d'événements personnels
- Statistiques de popularité et d'engagement

#### Clubs
- Création et gestion d'événements
- Invitation d'artistes pour des performances
- Gestion des réservations de tables
- Analyse des données de fréquentation
- Configuration des plans de salle et zones VIP

#### Administrateurs
- Modération des contenus
- Gestion des utilisateurs
- Statistiques globales de la plateforme
- Validation des événements

## Identifiants de test

Utilisez les identifiants suivants pour tester l'application:

| Type       | Nom d'utilisateur | Mot de passe   |
|------------|-------------------|----------------|
| Utilisateur| user1             | password123    |
| Artiste    | dj_elektra        | password123    |
| Club       | club_oxygen       | password123    |
| Admin      | admin             | adminpass123   |

## Structure de l'application

```
├── client/            # Frontend React
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── hooks/      # Hooks personnalisés
│   │   ├── layouts/    # Layouts de page
│   │   ├── lib/        # Utilitaires et fonctions
│   │   ├── pages/      # Pages de l'application
│   │   └── ...
├── db/                # Configuration de la base de données
├── server/            # Backend Express
├── shared/            # Code partagé (schémas, types)
```

## Technologies utilisées

- **Frontend**: React avec TypeScript, TailwindCSS, Framer Motion pour les animations
- **Backend**: Express.js
- **Base de données**: PostgreSQL avec Drizzle ORM
- **Authentification**: Passport.js avec sessions
- **Requêtes API**: TanStack Query (React Query)
- **Styles**: shadcn/ui avec Tailwind
- **Navigation**: wouter pour le routage

## Modes d'affichage

L'application propose deux modes d'affichage distincts:

1. **Mode Mobile**: Interface optimisée pour les appareils mobiles avec:
   - Navigation en bas de l'écran
   - Cartes d'événements en plein écran avec swipe
   - Boutons agrandis pour faciliter les interactions tactiles

2. **Mode Desktop**: Interface optimisée pour les écrans plus grands avec:
   - Barre de navigation latérale
   - Affichage en grille pour les événements
   - Menus déroulants et filtres avancés

## Personnalisation

L'application applique automatiquement un thème sombre par défaut, avec des couleurs primaires et secondaires personnalisables dans le fichier `index.css`.

## Prérequis

Avant de pouvoir exécuter Be bit., vous aurez besoin des éléments suivants installés sur votre système :

- **Node.js** - version 18.x ou supérieure
- **PostgreSQL** - version 14.x ou supérieure
- **npm** - généralement installé avec Node.js

### Variables d'environnement

L'application nécessite les variables d'environnement suivantes :

```
DATABASE_URL=postgresql://username:password@hostname:port/database
SESSION_SECRET=your-session-secret-key
```

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/be-bit.git
   cd be-bit
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données :
   ```bash
   npm run db:push   # Crée les tables dans la base de données
   npm run db:seed   # Ajoute des données de test
   ```

## Démarrage

Pour lancer l'application en mode développement :

```bash
npm run dev
```

Cela démarrera à la fois le serveur backend et le frontend. L'application sera accessible à l'adresse `http://localhost:5000`.

## Construction pour la production

Pour créer une version de production :

```bash
npm run build
```

Pour démarrer la version de production :

```bash
npm start
```

## Interface et navigation

L'interface de Be bit. est intuitive et adaptée à chaque type d'utilisateur :

### Vue mobile
- Navigation par barre d'icônes en bas de l'écran avec 6 options principales
- Exploration d'événements par swipe (gauche/droite)
- Design compact optimisé pour une utilisation avec une seule main
- Bouton "+" central pour la création rapide d'événements ou de sorties

### Vue desktop
- Navigation par barre latérale
- Interface riche avec plus d'informations visibles simultanément
- Grilles d'événements et tableaux de données détaillés

## Monétisation et paiements

Be bit. utilise un système de paiement intégré qui permet :
- L'achat de billets pour les événements
- Le paiement des artistes pour leurs performances
- La réservation de tables dans les clubs
- Le versement des revenus aux organisateurs d'événements

La monnaie utilisée dans l'application est l'Ariary (Ar).

## Contribution

Si vous souhaitez contribuer au projet, voici les étapes à suivre :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou suggestion concernant Be bit., veuillez contacter l'équipe de développement à l'adresse contact@bebit.com.