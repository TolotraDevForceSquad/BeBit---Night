# NightConnect - Application d'événements nocturnes

NightConnect est une plateforme inspirée de TikTok qui connecte les artistes, les clubs et les utilisateurs dans l'écosystème de la vie nocturne. L'application permet:

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

## Démarrage

Pour lancer l'application:

```bash
npm run dev
```

Cela démarrera à la fois le serveur backend et le frontend.