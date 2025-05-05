import { Switch, Route, Redirect } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import UserExplorerPage from "@/pages/user/explorer-page";
import ArtistDashboardPage from "@/pages/artist/dashboard-page";
import ClubDashboardPage from "@/pages/club/dashboard-page";
import AdminDashboardPage from "@/pages/admin/dashboard-page";
import { Loader2 } from "lucide-react";
import { Suspense, useState, useEffect } from "react";

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
        {/* Route d'authentification */}
        <Route path="/auth">
          {user ? <Redirect to={getUserHomePage(user.role)} /> : <AuthPage />}
        </Route>
        
        {/* Routes par défaut selon le rôle */}
        <Route path="/">
          {!user ? <Redirect to="/auth" /> : 
            user.role === "user" ? <UserExplorerPage /> : 
            <Redirect to={getUserHomePage(user.role)} />
          }
        </Route>
        
        {/* Routes spécifiques aux rôles */}
        <Route path="/artist">
          {!user ? <Redirect to="/auth" /> : 
            user.role === "artist" ? <ArtistDashboardPage /> : 
            <Redirect to={getUserHomePage(user.role)} />
          }
        </Route>
        
        <Route path="/club">
          {!user ? <Redirect to="/auth" /> : 
            user.role === "club" ? <ClubDashboardPage /> : 
            <Redirect to={getUserHomePage(user.role)} />
          }
        </Route>
        
        <Route path="/admin">
          {!user ? <Redirect to="/auth" /> : 
            user.role === "admin" ? <AdminDashboardPage /> : 
            <Redirect to={getUserHomePage(user.role)} />
          }
        </Route>
        
        {/* Fallback à 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Helper pour obtenir la page d'accueil selon le rôle
function getUserHomePage(role: string): string {
  switch (role) {
    case "artist": return "/artist";
    case "club": return "/club";
    case "admin": return "/admin";
    default: return "/";
  }
}

export default App;
