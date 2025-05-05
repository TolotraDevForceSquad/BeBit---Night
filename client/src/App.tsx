import { Switch, Route, Redirect } from "wouter";
import NotFound from "@/pages/not-found";
import SimpleAuth from "@/pages/simple-auth";
import SimplePage from "@/pages/SimplePage";
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
        {/* Route principale qui affiche l'authentification ou la page simple */}
        <Route path="/">
          {!user ? <SimpleAuth /> : <SimplePage />}
        </Route>
        
        {/* Route d'authentification simplifiée */}
        <Route path="/auth">
          {user ? <Redirect to="/" /> : <SimpleAuth />}
        </Route>
        
        {/* Routes spécifiques aux rôles - toutes affichent la même page simple pour l'instant */}
        <Route path="/artist">
          {!user ? <SimpleAuth /> : <SimplePage />}
        </Route>
        
        <Route path="/club">
          {!user ? <SimpleAuth /> : <SimplePage />}
        </Route>
        
        <Route path="/admin">
          {!user ? <SimpleAuth /> : <SimplePage />}
        </Route>
        
        {/* Fallback à 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
