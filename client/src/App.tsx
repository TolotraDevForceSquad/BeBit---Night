import { Switch, Route, Redirect } from "wouter";
import NotFound from "@/pages/not-found";
import SimpleAuth from "@/pages/simple-auth";
import UserExplorerPage from "@/pages/user/explorer-page";
import { Loader2 } from "lucide-react";
import { Suspense, useState, useEffect, lazy } from "react";

// Chargement paresseux des composants de page pour optimiser les performances
const ArtistDashboardPage = lazy(() => import("@/pages/artist/dashboard-page"));
const ArtistProfilePage = lazy(() => import("@/pages/artist/artist-profile-page"));
const ClubDashboardPage = lazy(() => import("@/pages/club/dashboard-page"));
const ClubProfilePage = lazy(() => import("@/pages/club/club-profile-page"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard-page"));
const ModerationPage = lazy(() => import("@/pages/admin/moderation-page"));
const ArtistsManagementPage = lazy(() => import("@/pages/admin/artists-management-page"));
const ArtistFormPage = lazy(() => import("@/pages/admin/artist-form-page"));
const ClubsManagementPage = lazy(() => import("@/pages/admin/clubs-management-page"));
const ClubFormPage = lazy(() => import("@/pages/admin/club-form-page"));
const EventsManagementPage = lazy(() => import("@/pages/admin/events-management-page"));
const EventDetailsPage = lazy(() => import("@/pages/event-details-page"));

// Type pour l'authentification
type AuthUser = {
  username: string;
  role: 'user' | 'artist' | 'club' | 'admin';
};

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Vérifier si l'utilisateur est déjà connecté (via localStorage)
  useEffect(() => {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      try {
        const userData = JSON.parse(authData) as AuthUser;
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données d'authentification:", error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <Switch>
        {/* Route principale - affiche explorer pour les utilisateurs ou redirige vers la page appropriée selon le rôle */}
        <Route path="/">
          {!user 
            ? <SimpleAuth /> 
            : user.role === "user" 
              ? <UserExplorerPage /> 
              : <Redirect to={`/${user.role}`} />
          }
        </Route>
        
        {/* Route d'authentification */}
        <Route path="/auth">
          {user 
            ? (user.role === "user" 
                ? <Redirect to="/" /> 
                : <Redirect to={`/${user.role}`} />)
            : <SimpleAuth />
          }
        </Route>
        
        {/* Routes spécifiques aux rôles */}
        <Route path="/artist">
          {!user 
            ? <SimpleAuth /> 
            : user.role === "artist" 
              ? <ArtistDashboardPage /> 
              : <Redirect to={user.role === "user" ? "/" : `/${user.role}`} />
          }
        </Route>
        
        <Route path="/club">
          {!user 
            ? <SimpleAuth /> 
            : user.role === "club" 
              ? <ClubDashboardPage /> 
              : <Redirect to={user.role === "user" ? "/" : `/${user.role}`} />
          }
        </Route>
        
        <Route path="/admin">
          {!user 
            ? <SimpleAuth /> 
            : user.role === "admin" 
              ? <Redirect to="/admin/dashboard" /> 
              : <Redirect to={user.role === "user" ? "/" : `/${user.role}`} />
          }
        </Route>
        
        {/* Routes utilisateur */}
        <Route path="/user/wallet">
          {!user ? <SimpleAuth /> : user.role === "user" ? <UserExplorerPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/user/tickets">
          {!user ? <SimpleAuth /> : user.role === "user" ? <UserExplorerPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/user/profile">
          {!user ? <SimpleAuth /> : user.role === "user" ? <UserExplorerPage /> : <Redirect to="/" />}
        </Route>
        
        {/* Routes Admin */}
        <Route path="/admin/dashboard">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <AdminDashboardPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/moderation">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ModerationPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/artists">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ArtistsManagementPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/artists/new">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ArtistFormPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/artists/edit">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ArtistFormPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/clubs">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ClubsManagementPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/clubs/new">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ClubFormPage /> : <Redirect to="/" />}
        </Route>
        
        <Route path="/admin/clubs/edit">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <ClubFormPage /> : <Redirect to="/" />}
        </Route>

        <Route path="/admin/events">
          {!user ? <SimpleAuth /> : user.role === "admin" ? <EventsManagementPage /> : <Redirect to="/" />}
        </Route>
        
        {/* Routes Profils & Événements */}
        <Route path="/artist/:id">
          <ArtistProfilePage />
        </Route>
        
        <Route path="/club/:id">
          <ClubProfilePage />
        </Route>
        
        <Route path="/event/:id">
          <EventDetailsPage />
        </Route>
        
        {/* Fallback à 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
